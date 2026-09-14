-- =============================================================
-- EventHub — data layer
-- PostgreSQL 14+
-- Relational implementation of the ER model described in README.md
-- =============================================================

DROP VIEW  IF EXISTS v_event_stats CASCADE;
DROP TABLE IF EXISTS review, registration, ticket_type, session,
                     event_tag, event, speaker_social, speaker,
                     user_phone, app_user, venue CASCADE;

-- -------------------------------------------------------------
-- Key (strong) entities
-- -------------------------------------------------------------

CREATE TABLE venue (
    venue_id     BIGSERIAL PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    -- composite attribute 'address' split into its components
    city         VARCHAR(80)  NOT NULL,
    street       VARCHAR(120) NOT NULL,
    building     VARCHAR(20)  NOT NULL,
    max_capacity INTEGER      NOT NULL CHECK (max_capacity > 0),
    geo_lat      NUMERIC(9,6),
    geo_lng      NUMERIC(9,6)
);

CREATE TABLE app_user (
    user_id       BIGSERIAL PRIMARY KEY,
    email         VARCHAR(180) NOT NULL UNIQUE,
    -- composite attribute 'full_name'
    first_name    VARCHAR(80)  NOT NULL,
    last_name     VARCHAR(80)  NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    birth_date    DATE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
    -- derived attribute 'age' is not stored: it depends on the current date,
    -- so it is computed in the v_user_profile view below
);

-- multivalued attribute 'phones' -> separate table (1NF)
CREATE TABLE user_phone (
    user_id BIGINT      NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    phone   VARCHAR(30) NOT NULL,
    label   VARCHAR(20),                       -- personal / work
    PRIMARY KEY (user_id, phone)
);

CREATE TABLE speaker (
    speaker_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name  VARCHAR(80) NOT NULL,
    bio        TEXT,
    photo_url  VARCHAR(500)
);

-- multivalued attribute 'socials'
CREATE TABLE speaker_social (
    speaker_id BIGINT       NOT NULL REFERENCES speaker(speaker_id) ON DELETE CASCADE,
    url        VARCHAR(500) NOT NULL,
    PRIMARY KEY (speaker_id, url)
);

CREATE TABLE event (
    event_id    BIGSERIAL PRIMARY KEY,
    venue_id    BIGINT       NOT NULL REFERENCES venue(venue_id),   -- ordinality (1,1): exactly one venue
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    start_at    TIMESTAMPTZ  NOT NULL,
    end_at      TIMESTAMPTZ  NOT NULL,
    status      VARCHAR(12)  NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','published','cancelled')),
    capacity    INTEGER      NOT NULL CHECK (capacity > 0),
    CONSTRAINT event_period_valid CHECK (end_at > start_at)
);

-- multivalued attribute 'tags'
CREATE TABLE event_tag (
    event_id BIGINT      NOT NULL REFERENCES event(event_id) ON DELETE CASCADE,
    tag      VARCHAR(40) NOT NULL,
    PRIMARY KEY (event_id, tag)
);

-- -------------------------------------------------------------
-- Weak entities
-- The owner's key is part of the primary key -> identifying relationship
-- -------------------------------------------------------------

CREATE TABLE session (
    event_id   BIGINT       NOT NULL REFERENCES event(event_id) ON DELETE CASCADE,
    session_no SMALLINT     NOT NULL,                -- partial (weak) key
    speaker_id BIGINT       NOT NULL REFERENCES speaker(speaker_id),
    title      VARCHAR(200) NOT NULL,
    start_at   TIMESTAMPTZ  NOT NULL,
    end_at     TIMESTAMPTZ  NOT NULL,
    room       VARCHAR(50),
    PRIMARY KEY (event_id, session_no),
    CONSTRAINT session_period_valid CHECK (end_at > start_at)
);

CREATE TABLE ticket_type (
    event_id  BIGINT        NOT NULL REFERENCES event(event_id) ON DELETE CASCADE,
    type_code VARCHAR(10)   NOT NULL,                -- partial key: STD, VIP, EARLY
    name      VARCHAR(60)   NOT NULL,
    price     NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    quota     INTEGER       NOT NULL CHECK (quota > 0),
    PRIMARY KEY (event_id, type_code)
);

-- -------------------------------------------------------------
-- Associative entities
-- -------------------------------------------------------------

CREATE TABLE registration (
    registration_id BIGSERIAL PRIMARY KEY,
    user_id         BIGINT        NOT NULL REFERENCES app_user(user_id),
    event_id        BIGINT        NOT NULL REFERENCES event(event_id),
    type_code       VARCHAR(10)   NOT NULL,
    registered_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    status          VARCHAR(12)   NOT NULL DEFAULT 'booked'
                    CHECK (status IN ('booked','cancelled','attended')),
    seat_no         VARCHAR(10),
    qty             SMALLINT      NOT NULL DEFAULT 1 CHECK (qty > 0),
    -- price is fixed at booking time, so it is stored rather than derived
    total_price     NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    FOREIGN KEY (event_id, type_code) REFERENCES ticket_type(event_id, type_code),
    CONSTRAINT registration_unique_per_event UNIQUE (user_id, event_id)
);

CREATE TABLE review (
    review_id  BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES app_user(user_id),
    event_id   BIGINT      NOT NULL REFERENCES event(event_id) ON DELETE CASCADE,
    rating     SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT review_unique_per_event UNIQUE (user_id, event_id)
);

-- -------------------------------------------------------------
-- Derived attributes: seats_left, avg_rating, sold, age
-- Not stored: computed on read so they cannot drift out of sync
-- -------------------------------------------------------------

CREATE VIEW v_user_profile AS
SELECT
    u.user_id,
    u.email,
    u.first_name || ' ' || u.last_name                             AS full_name,
    u.birth_date,
    EXTRACT(YEAR FROM age(CURRENT_DATE, u.birth_date))::INT        AS age,
    u.created_at
FROM app_user u;

CREATE VIEW v_event_stats AS
SELECT
    e.event_id,
    e.title,
    e.capacity,
    (e.end_at - e.start_at)                      AS duration,
    e.capacity - COALESCE(r.booked_qty, 0)       AS seats_left,
    COALESCE(r.booked_qty, 0)                    AS sold,
    ROUND(rv.avg_rating, 2)                      AS avg_rating,
    COALESCE(rv.review_count, 0)                 AS review_count
FROM event e
LEFT JOIN (
    SELECT event_id, SUM(qty) AS booked_qty
    FROM registration
    WHERE status IN ('booked','attended')        -- cancelled bookings return the seat to the pool
    GROUP BY event_id
) r ON r.event_id = e.event_id
LEFT JOIN (
    SELECT event_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
    FROM review
    GROUP BY event_id
) rv ON rv.event_id = e.event_id;

-- -------------------------------------------------------------
-- Indexes for the main access paths
-- -------------------------------------------------------------

CREATE INDEX idx_event_start        ON event (start_at) WHERE status = 'published';
CREATE INDEX idx_event_venue        ON event (venue_id);
CREATE INDEX idx_event_tag_tag      ON event_tag (tag);
CREATE INDEX idx_registration_user  ON registration (user_id, status);
CREATE INDEX idx_registration_event ON registration (event_id, status);
CREATE INDEX idx_review_event       ON review (event_id);
CREATE INDEX idx_session_speaker    ON session (speaker_id);

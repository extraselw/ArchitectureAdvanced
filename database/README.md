# Database Layer Design — EventHub

Conceptual data model for a web service that lets people find and book professional events.

**Diagram:** [`eventhub-er.png`](eventhub-er.png) · editable source [`eventhub-er.drawio`](eventhub-er.drawio) · print version [`eventhub-er.pdf`](eventhub-er.pdf)

---

## 1. Problem domain

An attendee finds a relevant event and books a seat without contacting the organiser. An organiser creates an event, sets up its schedule and ticket types, and monitors how many seats are left.

The database has to support:

- an event catalogue with filtering and a live count of available seats;
- a session schedule inside each event;
- seat booking with a chosen ticket type, and cancellation;
- ratings and reviews once an event has taken place.

## 2. Architectural pattern

The application follows a **three-tier pattern**: presentation layer, business logic layer, and data access layer on top of a relational database.

Reasoning:

- **The domain is highly interconnected.** A booking references a user, an event and a ticket type at the same time, and must stay consistent when it is cancelled. This is a transactional scenario where the ACID guarantees of a relational database remove a whole class of bugs.
- **CRUD operations dominate** over a stable schema. A document store would offer flexibility this domain does not need, at the cost of enforcing referential integrity by hand.
- **Microservices would be premature.** Splitting into services pays off under independent scaling and separate teams; neither applies here, while the cost of inter-service communication would apply immediately.
- **The data access layer is isolated** behind repositories, so replacing the database engine or extracting a module into a separate service later would not reach into the business logic.

## 3. Domain assumptions

| Assumption | Effect on the model |
|------------|---------------------|
| A session has exactly one speaker; panel discussions are out of scope for the MVP | `Speaker — Session` is 1:N rather than M:N through an associative entity |
| A user books a given event at most once | `unique (user_id, event_id)` constraint on `Registration` |
| A review may only be left for a past event the user actually attended | Enforced in the business logic layer, not in the schema |
| A published event has at least one session and at least one ticket type | Minimum participation of 1 on `contains` and `defines` |
| Cancelling a booking returns the seat to the pool | `seats_left` counts only bookings with status `booked` or `attended` |

---

## 4. Step 1 — Entities

Eight entities, covering all three types.

### Key (strong) entities

| Entity | Meaning | Key |
|--------|---------|-----|
| `Venue` | Location where events take place | `venue_id` |
| `Event` | An event | `event_id` |
| `User` | Registered attendee | `user_id` |
| `Speaker` | Speaker | `speaker_id` |

Each exists independently and is identified by its own single-attribute key.

### Weak entities

| Entity | Owner | Partial key | Full identifier |
|--------|-------|-------------|-----------------|
| `Session` | `Event` | `session_no` | `(event_id, session_no)` |
| `TicketType` | `Event` | `type_code` | `(event_id, type_code)` |

Neither has an identifier of its own. A session is numbered within its event: "session 2" only means something together with a specific event. A ticket type is defined per event: the code `VIP` implies a different price and quota for each one. Both attach through **identifying relationships**, drawn as double diamonds, and their participation is total, drawn as a double line.

### Associative entities

| Entity | Resolves | Own attributes |
|--------|----------|----------------|
| `Registration` | `User` M:N `Event` | `registered_at`, `status`, `qty`, `total_price` |
| `Review` | `User` M:N `Event` | `rating`, `comment`, `created_at` |

The relationship between a user and an event is many-to-many and carries data of its own, so it becomes an entity. A plain relationship could not hold a booking status or the text of a review. `Registration` additionally references `TicketType`, so it effectively connects three entities.

---

## 5. Steps 2–3 — Relationships, cardinality and ordinality

**Cardinality** is shown by the `1` / `N` labels on each line, giving the ratio of the relationship. **Ordinality** is shown by the line itself: a single line means partial participation (an instance may take no part in the relationship), a double line means total participation (every instance must take part).

| Relationship | Ratio | Participation | Reading |
|--------------|-------|---------------|---------|
| `Venue` — **hosts** — `Event` | 1 : N | Venue partial · Event total | A venue hosts many events, an event takes place at exactly one venue. Every event must have a venue; a venue may host none yet |
| `Event` — **contains** — `Session` | 1 : N | both total | An event contains many sessions, a session belongs to exactly one event. A published event has at least one session |
| `Event` — **defines** — `TicketType` | 1 : N | both total | An event defines many ticket types, a ticket type belongs to exactly one event. An event defines at least one type |
| `Speaker` — **presents** — `Session` | 1 : N | Speaker partial · Session total | A speaker presents many sessions, a session has exactly one speaker. A speaker may have no sessions yet |
| `User` — `Registration` | 1 : N | partial | A user makes many bookings, a booking belongs to one user |
| `Event` — `Registration` | 1 : N | partial | An event receives many bookings, a booking is for one event |
| `TicketType` — `Registration` | 1 : N | partial | A ticket type is used in many bookings, a booking uses one type |
| `User` — `Review` | 1 : N | partial | A user writes many reviews, a review has one author |
| `Event` — `Review` | 1 : N | partial | An event receives many reviews, a review is about one event |

`contains` and `defines` are identifying relationships, drawn as double diamonds: the owner's key becomes part of the weak entity's identifier.

---

## 6. Step 4 — Attributes

| Notation | Attribute type |
|----------|----------------|
| underlined | key attribute |
| dashed underline | weak (partial) key |
| dashed oval | derived attribute |
| double oval | multivalued attribute |

| Entity | Attributes |
|--------|-----------|
| `Venue` | venue_id (key), name, city, max_capacity |
| `Event` | event_id (key), title, start_at, end_at, capacity, seats_left (derived), tags (multivalued) |
| `User` | user_id (key), email, birth_date, age (derived), phones (multivalued), created_at |
| `Speaker` | speaker_id (key), full_name, bio, socials (multivalued) |
| `Session` | session_no (partial key), title, start_at, end_at, room |
| `TicketType` | type_code (partial key), price, quota, sold (derived) |
| `Registration` | registration_id (key), registered_at, status, qty, total_price (derived) |
| `Review` | review_id (key), rating, comment, created_at |

How the derived attributes are computed:

- `seats_left` = `capacity` minus the number of active bookings
- `age` = from `birth_date`
- `sold` = number of bookings of that ticket type
- `total_price` = `TicketType.price` × `qty`

---

## 7. From the conceptual model to a relational schema

Two categories of attribute do not map to columns directly. [`schema.sql`](schema.sql) shows how they are handled.

**Multivalued attributes** become separate tables, otherwise first normal form is violated: `phones` → `user_phone`, `tags` → `event_tag`, `socials` → `speaker_social`.

**Derived attributes** are computed rather than stored, otherwise they drift out of sync with the data they come from. `age`, `seats_left`, `sold` and `avg_rating` are exposed through views. `total_price` on `Registration` is the exception: the price is fixed at the moment of booking, so it is stored — otherwise a later price change would rewrite payment history.

---

## 8. Files

| File | Contents |
|------|----------|
| `README.md` | This report |
| `eventhub-er.drawio` | Diagram source, opens at app.diagrams.net |
| `eventhub-er.png` | Diagram, raster |
| `eventhub-er.pdf` | Diagram, vector for print |
| `eventhub-er.svg` | Diagram, vector for web |
| `schema.sql` | PostgreSQL DDL implementing the model |

# Interface Design — EventHub

User interface for the event booking service modelled in [`../database`](../database).

---

## 1. Purpose of the application

EventHub helps people find professional events happening near them and book a seat in a few clicks, without emailing an organiser or filling in a long form.

The value is speed and certainty. Today an attendee has to search several sources, work out whether an event is still open, and contact someone to confirm a place. EventHub replaces that with one catalogue that always shows how many seats are left and books them instantly.

## 2. Users and their objectives

**Primary user — the attendee.** Wants to know what is worth attending this week and to secure a place before it sells out.

**Secondary user — the organiser.** Creates events, sets up the schedule and ticket types, and watches how the seats fill. Out of scope for this prototype but accounted for in the data model.

What the attendee looks for, in order:

1. **First** — what is happening soon: date, topic, location, and whether seats are still available.
2. **Second** — the detail of one event: schedule, speakers, ticket prices.
3. **Third** — their own bookings: what is confirmed and whether it can still be cancelled.

That order determines the layout. The catalogue is the landing screen, seat availability is visible on every card without opening it, and bookings are one click from anywhere in the header.

## 3. Basic scenario — a guest books a seat

| # | User action | System response |
|---|-------------|-----------------|
| 1 | Opens the site | Catalogue of upcoming events, sorted by date. Each card shows title, date, venue, price from, seats left |
| 2 | Clicks a card | Event page: description, session schedule, speakers, ticket types |
| 3 | Picks a ticket type and clicks **Book** | Booking screen with the chosen type preselected and the total price calculated |
| 4 | Enters name and email, confirms | Validation, then the seat is reserved |
| 5 | — | Confirmation screen with the booking code, date and venue |

No account is required. This is the shortest path to value and the one the interactive prototype must reproduce end to end.

## 4. Advanced scenario — a registered user manages bookings

| # | User action | System response |
|---|-------------|-----------------|
| 1 | Clicks **Sign in**, enters credentials | Returns to the catalogue, header now shows the account menu |
| 2 | Filters by city, date range and topic tag | Catalogue narrows; active filters shown as removable chips |
| 3 | Books an event | Booking form is prefilled from the profile — name and email are not retyped |
| 4 | Opens **My bookings** | Two tabs: Upcoming and Past |
| 5 | Cancels an upcoming booking | Confirmation dialog, status changes to Cancelled, the seat returns to the pool |
| 6 | Opens a past event and leaves a review | Rating from 1 to 5 plus a comment; the event's average rating updates |

## 5. Screens

Seven screens plus one modal. Each maps to entities from the ER model, which keeps the interface and the database consistent.

| # | Screen | Purpose | Key elements | Entities |
|---|--------|---------|--------------|----------|
| 1 | **Catalogue** | Landing screen, event discovery | Header with logo, search, Sign in / account menu · filter bar (city, date, tag) · grid of event cards · empty state | `Event`, `Venue`, `TicketType` |
| 2 | **Event details** | Everything needed to decide | Cover, title, date, venue · description · session schedule as a timeline · speaker cards · ticket type table with prices and seats left · sticky **Book** button | `Event`, `Session`, `Speaker`, `TicketType` |
| 3 | **Booking** | Choose a ticket and confirm | Event summary · ticket type selector · quantity stepper · live total · name and email fields · **Confirm** button | `Registration`, `TicketType` |
| 4 | **Confirmation** | Proof the seat is reserved | Success state · booking code · date, time, venue · links to My bookings and back to catalogue | `Registration` |
| 5 | **Sign in** | Entry to the advanced scenario | Email and password fields · **Sign in** button · link to registration · inline error state | `User` |
| 6 | **My bookings** | Manage what was booked | Tabs Upcoming / Past · booking rows with status badge · **Cancel** on upcoming · **Leave a review** on past · empty state | `Registration`, `Event` |
| 7 | **Profile** | Personal data | Name, email, date of birth · list of phone numbers with add and remove · **Save** button | `User` |
| — | **Review modal** | Rate a past event | Star rating 1–5 · comment field · **Submit** | `Review` |

Phone numbers are a list rather than a single field because `phones` is a multivalued attribute in the data model. Seats left is computed, never typed in, because `seats_left` is derived.

## 6. Navigation

The header is identical on every screen: logo returns to the catalogue, and the right side holds either **Sign in** or the account menu with My bookings, Profile and Sign out.

Depth never exceeds two levels. From the catalogue a user reaches an event, from an event the booking form, and from booking the confirmation. There is no third level anywhere, so no breadcrumbs are needed.

## 7. Design system

Fixed up front so that every screen stays consistent — consistency across pages is a graded criterion, and deciding these values once removes the temptation to improvise per screen.

**Colour**

| Token | Value | Use |
|-------|-------|-----|
| ink | `#1A1D21` | Primary text |
| muted | `#6B7280` | Secondary text, labels |
| border | `#E5E7EB` | Dividers, input borders |
| surface | `#FFFFFF` | Cards, page background |
| accent | `#2563EB` | Primary buttons, links, active filters |
| success | `#16A34A` | Confirmation, seats available |
| danger | `#DC2626` | Cancellation, errors, sold out |

**Typography** — one family throughout (Inter, or the system sans-serif). Page title 32px bold · section heading 24px semibold · card title 18px semibold · body 16px · caption 14px. Line height 1.5 for body text.

**Spacing** — multiples of 8 only: 8, 16, 24, 32, 48. Nothing in between.

**Components** — corner radius 8px · buttons 44px tall · inputs 44px tall · cards with a 1px border and 24px of padding. Three button styles and no more: primary filled accent, secondary outlined, ghost text-only.

---

## 8. Usability testing

*To be completed after Step 6.*

| Participant | Task given | Where they hesitated | Change made |
|-------------|-----------|----------------------|-------------|
| | | | |

## 9. Files

| File | Contents |
|------|----------|
| `README.md` | This document |
| `wireframes/` | Schematic layouts, greyscale, all screens |
| `mockups/` | Static visual design, all screens |
| `prototype/` | Link to the interactive prototype |
| `web/` | HTML/JS version, open `index.html` in any browser |

**Interactive prototype:** https://www.figma.com/proto/VR2ydXPlfZDyXWfLdfvimw/EventHub-prototype?node-id=1-10&starting-point-node-id=1%3A10&page-id=0%3A1&scaling=min-zoom&content-scaling=fixed

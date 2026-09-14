# Web version

Plain HTML, CSS and vanilla JS implementation of the EventHub mockups. No
framework, no build step, no npm, no CDN.

## Running it

Just double-click `index.html`. Everything works on `file://` — no server,
no `fetch`, no `localStorage`. All data lives in memory, so a reload resets
it back to the seeded state.

Three files: `index.html`, `styles.css`, `app.js`.

## What's here

Both scenarios from the interface brief work end to end.

**Basic:** browse the catalogue → open an event → pick a ticket type → fill
in the booking form → get a confirmation screen with a generated
`EVH-2026-XXXXX` code. No account needed.

**Advanced:** sign in (any email + a 4+ character password) → filter the
catalogue by city/date/topic → book with the form prefilled from your
profile → check My bookings (Upcoming/Past) → cancel a booking → leave a
review on a past event → edit your profile, including phone numbers.

Routing is hash-based (`#/catalogue`, `#/event/:id`, `#/booking/:id`,
`#/confirmation/:code`, `#/signin`, `#/bookings`, `#/profile`) so it works
without a server. Back/forward behave normally, and an unknown hash just
falls back to the catalogue.

### The three things that were broken in the prototype

- **Leaving a review** now actually opens a modal — proper focus trap,
  closes on Escape or a backdrop click, and gives focus back to the button
  that opened it. Submitting shows a quick "saved" message, then the star
  rating shows up right on the booking row instead of the button.
- **Cancelling a booking** asks for confirmation first. Once confirmed, the
  badge switches to "Cancelled" and the seat goes back into the catalogue's
  count immediately, since that count is never stored — it's recalculated
  every time from the list of registrations.
- **The Past tab** used to look disabled because of low contrast. It's a
  real button now with a visible border and dark text, and it actually
  switches the list when clicked.

### What's a stub on purpose

The search field, "More filters", pagination, "Forgot?", "Create one",
"Sign out" and the speaker cards don't do anything — clicking them just
shows a toast saying so. Sign out especially is deliberate: there's no way
back into the advanced scenario without an account, so it leaves the
session alone instead of actually logging you out.

The whole event card is clickable, not just the title — that was one of the
usability problems, someone kept clicking the image first.

## Responsive layout

Mobile-first, two breakpoints at 768px and 1024px. Desktop gets a
three-column grid with sticky side panels; tablet drops to two columns and
the panels stop being sticky; mobile goes single-column, the header search
collapses into an icon, and the filters collapse into a bottom sheet.
Checked at everything from 320px to 1920px — nothing overflows.

## Accessibility

Every input has a real label. Focus rings are visible everywhere (nothing
disables `outline` without giving something back). The review modal is a
proper dialog with a focus trap. Status text like "Sold out" or "Cancelled"
is never colour-only. The whole basic scenario can be done with a keyboard
alone.

## The data

`app.js` hardcodes everything — venues, events, sessions, speakers, ticket
types, users, registrations, reviews — shaped after the ER model in
`database/README.md`.

Six events make up the catalogue, all in October 2026. There's a seventh
event, an earlier edition of "Figma for Engineers" from 28 September, which
only exists to give the demo user (Sam Ortiz) a past, attended booking to
review — it isn't shown in the catalogue, the same way a real past event
wouldn't be. The catalogue mockup and the My Bookings mockup actually show
this same title with two different dates, so I read it as two editions of a
recurring meetup rather than forcing one event to hold two dates at once.

The first event ("Designing for Trust") has three sessions and two ticket
types like the spec asked for; the rest have one or two ticket types and a
single representative session. Sam has two upcoming bookings and one past
one, plus there are three bare-bones "other attendee" records whose only
job is to occupy seats, so that a sold-out event and a low-stock event are
both real without inflating Sam's own history.

Nothing derived is stored — seats left, sold counts, order totals and
average ratings are all recalculated on every render straight from the
arrays above, so cancelling a booking or leaving a review updates every
screen that cares about it immediately. Booking codes and seat numbers are
generated at booking time and aren't meant to survive a reload — nothing
here persists outside memory.

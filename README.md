# ArchitectureAdvanced

Coursework repository. Two tasks — database layer design and interface design — built around a single product, so the interface follows directly from the data model rather than being invented separately.

## The product

**EventHub** is a web service for finding and booking professional events: lectures, workshops and meetups. An attendee sees what is happening nearby, how many seats are left, and books a place in a few clicks. An organiser creates events, sets up the schedule and ticket types, and watches the seats fill.

## Tasks

| Folder | Task | Contents |
|--------|------|----------|
| [`database/`](database) | Database Layer Design | Conceptual ER diagram in Chen notation, report on entities, relationships and attributes, PostgreSQL schema |
| [`interface/`](interface) | Interface Design | Design brief with user scenarios, wireframes, mockups, interactive prototype, HTML/JS version |

## Structure

```
ArchitectureAdvanced/
├── README.md
├── database/
│   ├── README.md              report
│   ├── eventhub-er.drawio     diagram source, opens at app.diagrams.net
│   ├── eventhub-er.png        diagram, raster
│   ├── eventhub-er.svg        diagram, vector
│   ├── eventhub-er.pdf        diagram, print version
│   └── schema.sql             PostgreSQL DDL
└── interface/
    ├── README.md              brief, scenarios, screen specs
    ├── wireframes/
    ├── mockups/
    ├── prototype/
    └── web/                   open index.html in any browser
```

## How the two tasks connect

Every screen in the interface maps to entities from the ER model. The event page renders `Event` with its `Session` and `TicketType` records, the booking flow creates a `Registration`, and the profile edits a `User` including the multivalued `phones` attribute. Values that are derived in the model — seats left, total price, average rating — are displayed but never editable in the interface.
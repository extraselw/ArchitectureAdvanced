(function () {
  "use strict";

  // Data

  var NOW = new Date(2026, 9, 10, 9, 0); // fixed "now" — 10 Oct 2026, so upcoming/past never shifts between reloads

  var VENUES = [
    { id: 1, name: "Dubai Design District", city: "Dubai", street: "Building 7", building: "d3" },
    { id: 2, name: "in5 Tech", city: "Dubai", street: "Dubai Internet City", building: "in5" },
    { id: 3, name: "AstroLabs", city: "Dubai", street: "Gate Village 3", building: "DIFC" },
    { id: 4, name: "Emirates Towers", city: "Abu Dhabi", street: "Corniche Road", building: "Tower 2" },
    { id: 5, name: "Dubai Internet City", city: "Dubai", street: "Internet City", building: "Building 1" },
    { id: 6, name: "The Offices 4", city: "Abu Dhabi", street: "Al Maryah Island", building: "Floor 3" }
  ];

  var SPEAKERS = [
    {
      id: 1, firstName: "Layla", lastName: "Haddad", role: "Lead Designer, Careem",
      bio: "Layla has spent the last six years shaping checkout, onboarding and payment flows used by millions of riders and drivers across the region.",
      socials: ["https://linkedin.com/in/laylahaddad"]
    },
    {
      id: 2, firstName: "Marcus", lastName: "Chen", role: "Head of Product, Tabby",
      bio: "Marcus leads product at Tabby, where he focuses on trust, fraud and the small interface decisions that make people comfortable paying online.",
      socials: ["https://linkedin.com/in/marcuschen"]
    }
  ];

  // event 7 is a past "Figma for Engineers" — not in the catalogue, only used for the past/review flow
  var EVENTS = [
    {
      id: 1, venueId: 1, title: "Designing for Trust",
      description: "A practical evening on how interface decisions shape user trust. Three talks from practitioners who have shipped checkout, onboarding and payment flows used by millions of people, followed by open networking.",
      startAt: "2026-10-12T18:00:00", endAt: "2026-10-12T21:00:00",
      status: "published", capacity: 30, tags: ["Product", "Design"]
    },
    {
      id: 2, venueId: 2, title: "Scaling Postgres to 1B Rows",
      description: "An engineering deep-dive into partitioning, indexing and connection pooling strategies that kept a single Postgres cluster fast well past a billion rows.",
      startAt: "2026-10-15T19:00:00", endAt: "2026-10-15T21:00:00",
      status: "published", capacity: 40, tags: ["Engineering", "Data"]
    },
    {
      id: 3, venueId: 3, title: "AI Agents in Production",
      description: "What breaks when an autonomous agent meets real customers. War stories on guardrails, evaluation and rollback from three teams running agents at scale.",
      startAt: "2026-10-18T18:30:00", endAt: "2026-10-18T21:00:00",
      status: "published", capacity: 4, tags: ["AI", "Product"]
    },
    {
      id: 4, venueId: 4, title: "Founder Stories: Series A",
      description: "Three founders on what actually changed between their seed round and their Series A — hiring, focus, and the metrics investors cared about.",
      startAt: "2026-10-22T19:00:00", endAt: "2026-10-22T21:00:00",
      status: "published", capacity: 41, tags: ["Business"]
    },
    {
      id: 5, venueId: 5, title: "Figma for Engineers",
      description: "A hands-on session for engineers who touch design files but never learned Figma properly: components, auto layout, and handoff without the guesswork.",
      startAt: "2026-10-25T17:00:00", endAt: "2026-10-25T19:00:00",
      status: "published", capacity: 12, tags: ["Design", "Engineering"]
    },
    {
      id: 6, venueId: 6, title: "Kubernetes Night",
      description: "Lightning talks on cluster upgrades, cost control and the on-call pages nobody wants at 3am, from teams running Kubernetes in production.",
      startAt: "2026-10-29T18:00:00", endAt: "2026-10-29T20:00:00",
      status: "published", capacity: 3, tags: ["Engineering"]
    },
    {
      id: 7, venueId: 5, title: "Figma for Engineers",
      description: "The previous edition of this recurring meetup: components, auto layout, and handoff without the guesswork.",
      startAt: "2026-09-28T17:00:00", endAt: "2026-09-28T19:00:00",
      status: "published", capacity: 20, tags: ["Design", "Engineering"]
    }
  ];

  var SESSIONS = [
    { eventId: 1, sessionNo: 1, speakerId: null, title: "Doors open & networking", startAt: "2026-10-12T18:00:00", endAt: "2026-10-12T18:30:00", room: "Room A" },
    { eventId: 1, sessionNo: 2, speakerId: 1, title: "Why users abandon checkout", startAt: "2026-10-12T18:30:00", endAt: "2026-10-12T19:30:00", room: "Room A" },
    { eventId: 1, sessionNo: 3, speakerId: 2, title: "Designing for trust at scale", startAt: "2026-10-12T19:30:00", endAt: "2026-10-12T20:30:00", room: "Room A" },
    { eventId: 2, sessionNo: 1, speakerId: 2, title: "Sharding strategies that actually worked", startAt: "2026-10-15T19:00:00", endAt: "2026-10-15T20:15:00", room: "Main Hall" },
    { eventId: 3, sessionNo: 1, speakerId: 1, title: "Shipping agents to production", startAt: "2026-10-18T18:30:00", endAt: "2026-10-18T19:30:00", room: "Main Hall" },
    { eventId: 4, sessionNo: 1, speakerId: 2, title: "From seed to Series A", startAt: "2026-10-22T19:00:00", endAt: "2026-10-22T20:00:00", room: "Auditorium" },
    { eventId: 5, sessionNo: 1, speakerId: 1, title: "Design systems for engineers", startAt: "2026-10-25T17:00:00", endAt: "2026-10-25T18:00:00", room: "Room B" },
    { eventId: 6, sessionNo: 1, speakerId: 1, title: "Zero-downtime cluster upgrades", startAt: "2026-10-29T18:00:00", endAt: "2026-10-29T19:00:00", room: "Main Hall" },
    { eventId: 7, sessionNo: 1, speakerId: 1, title: "Design systems for engineers", startAt: "2026-09-28T17:00:00", endAt: "2026-09-28T18:00:00", room: "Room B" }
  ];

  var TICKET_TYPES = [
    { eventId: 1, typeCode: "STD", name: "Standard", price: 25, quota: 22 },
    { eventId: 1, typeCode: "VIP", name: "VIP", price: 60, quota: 8 },
    { eventId: 2, typeCode: "FREE", name: "Free", price: 0, quota: 40 },
    { eventId: 3, typeCode: "STD", name: "Standard", price: 40, quota: 4 },
    { eventId: 4, typeCode: "STD", name: "Standard", price: 15, quota: 41 },
    { eventId: 5, typeCode: "STD", name: "Standard", price: 30, quota: 12 },
    { eventId: 6, typeCode: "FREE", name: "Free", price: 0, quota: 3 },
    { eventId: 7, typeCode: "STD", name: "Standard", price: 30, quota: 20 }
  ];

  // aria/noah/zara aren't real accounts, they just occupy seats so sold-out/low-stock look real
  var USERS = [
    {
      id: 1, email: "sam.ortiz@example.com", firstName: "Sam", lastName: "Ortiz",
      birthDate: "1994-04-12", phones: ["+971 50 123 4567", "+971 55 987 6543"],
      createdAt: "2025-01-10T00:00:00"
    },
    { id: 2, email: "aria.petrova@example.com", firstName: "Aria", lastName: "Petrova" },
    { id: 3, email: "noah.kim@example.com", firstName: "Noah", lastName: "Kim" },
    { id: 4, email: "zara.ali@example.com", firstName: "Zara", lastName: "Ali" }
  ];

  var REGISTRATIONS = [
    { id: 1, userId: 1, name: "Sam Ortiz", email: "sam.ortiz@example.com", eventId: 1, typeCode: "STD", registeredAt: "2026-09-20T10:00:00", status: "booked", qty: 1, totalPrice: 25, code: "EVH-2026-00418", seatNo: "A-14" },
    { id: 2, userId: 1, name: "Sam Ortiz", email: "sam.ortiz@example.com", eventId: 3, typeCode: "STD", registeredAt: "2026-09-22T14:00:00", status: "booked", qty: 1, totalPrice: 40, code: "EVH-2026-00419", seatNo: "B-02" },
    { id: 3, userId: 1, name: "Sam Ortiz", email: "sam.ortiz@example.com", eventId: 7, typeCode: "STD", registeredAt: "2026-09-20T09:00:00", status: "attended", qty: 1, totalPrice: 30, code: "EVH-2026-00311", seatNo: "A-05" },
    { id: 4, userId: 2, name: "Aria Petrova", email: "aria.petrova@example.com", eventId: 3, typeCode: "STD", registeredAt: "2026-09-15T09:00:00", status: "booked", qty: 2, totalPrice: 80, code: "EVH-2026-00120", seatNo: null },
    { id: 5, userId: 3, name: "Noah Kim", email: "noah.kim@example.com", eventId: 6, typeCode: "FREE", registeredAt: "2026-09-16T09:00:00", status: "booked", qty: 1, totalPrice: 0, code: "EVH-2026-00121", seatNo: null },
    { id: 6, userId: 4, name: "Zara Ali", email: "zara.ali@example.com", eventId: 6, typeCode: "FREE", registeredAt: "2026-09-17T09:00:00", status: "booked", qty: 1, totalPrice: 0, code: "EVH-2026-00122", seatNo: null },
    { id: 7, userId: 2, name: "Aria Petrova", email: "aria.petrova@example.com", eventId: 6, typeCode: "FREE", registeredAt: "2026-09-18T09:00:00", status: "booked", qty: 1, totalPrice: 0, code: "EVH-2026-00123", seatNo: null }
  ];

  var REVIEWS = [];

  var COVER_GRADIENTS = {
    1: "linear-gradient(135deg, #4338CA, #7C3AED)",
    2: "linear-gradient(135deg, #0D9488, #22C55E)",
    3: "linear-gradient(135deg, #F97316, #DC2626)",
    4: "linear-gradient(135deg, #A855F7, #EC4899)",
    5: "linear-gradient(135deg, #06B6D4, #3B82F6)",
    6: "linear-gradient(135deg, #475569, #1E293B)",
    7: "linear-gradient(135deg, #06B6D4, #3B82F6)"
  };

  var CITY_OPTIONS = [
    { value: "all", label: "All cities" },
    { value: "Dubai", label: "Dubai" },
    { value: "Abu Dhabi", label: "Abu Dhabi" }
  ];
  var DATE_OPTIONS = [
    { value: "any", label: "Any date" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" }
  ];
  var DATE_LABELS = { week: "This week", month: "This month" };

  var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // State

  var state = {
    currentUserId: null,
    filters: { city: "all", date: "any", topic: "all" },
    bookingsTab: "upcoming",
    ticketSelection: { eventId: null, typeCode: null },
    bookingEventId: null,
    bookingQty: 1,
    bookingName: null,
    bookingEmail: null,
    bookingTermsChecked: false,
    reviewRegistrationId: null,
    reviewTriggerEl: null,
    reviewSavedTimeout: null,
    toastTimeout: null,
    nextRegistrationId: 8,
    nextReviewId: 1
  };

  // Derived values — nothing here is stored, always computed fresh

  function getVenue(id) { return VENUES.filter(function (v) { return v.id === Number(id); })[0]; }
  function getEvent(id) { return EVENTS.filter(function (e) { return e.id === Number(id); })[0]; }
  function getSpeaker(id) { return SPEAKERS.filter(function (s) { return s.id === Number(id); })[0]; }
  function getSessions(eventId) { return SESSIONS.filter(function (s) { return s.eventId === Number(eventId); }); }
  function getTicketTypes(eventId) { return TICKET_TYPES.filter(function (t) { return t.eventId === Number(eventId); }); }
  function getTicketType(eventId, typeCode) {
    return TICKET_TYPES.filter(function (t) { return t.eventId === Number(eventId) && t.typeCode === typeCode; })[0];
  }
  function getCurrentUser() { return USERS.filter(function (u) { return u.id === state.currentUserId; })[0] || null; }

  function isUpcoming(event) { return new Date(event.startAt) > NOW; }

  function seatsLeft(event) {
    var used = REGISTRATIONS.reduce(function (sum, r) {
      if (r.eventId === event.id && (r.status === "booked" || r.status === "attended")) return sum + r.qty;
      return sum;
    }, 0);
    return event.capacity - used;
  }

  function ticketSold(eventId, typeCode) {
    return REGISTRATIONS.reduce(function (sum, r) {
      if (r.eventId === Number(eventId) && r.typeCode === typeCode && (r.status === "booked" || r.status === "attended")) return sum + r.qty;
      return sum;
    }, 0);
  }
  function ticketLeft(ticketType) { return ticketType.quota - ticketSold(ticketType.eventId, ticketType.typeCode); }

  function avgRating(eventId) {
    var ratings = REVIEWS.filter(function (r) { return r.eventId === Number(eventId); }).map(function (r) { return r.rating; });
    if (ratings.length === 0) return null;
    var mean = ratings.reduce(function (a, b) { return a + b; }, 0) / ratings.length;
    return { value: Math.round(mean * 10) / 10, count: ratings.length };
  }

  function priceLabel(eventId) {
    var types = getTicketTypes(eventId);
    var min = Math.min.apply(null, types.map(function (t) { return t.price; }));
    if (types.length === 1) return min === 0 ? "Free" : "$" + min;
    return min === 0 ? "Free" : "from $" + min;
  }

  function existingReview(userId, eventId) {
    return REVIEWS.filter(function (r) { return r.userId === userId && r.eventId === Number(eventId); })[0];
  }

  // Formatting

  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function timeStr(d) { return pad2(d.getHours()) + ":" + pad2(d.getMinutes()); }
  function longDate(d) { return d.getDate() + " " + MONTHS_LONG[d.getMonth()] + " " + d.getFullYear(); }
  function shortDate(d) { return d.getDate() + " " + MONTHS_SHORT[d.getMonth()]; }
  function shortDateYear(d) { return d.getDate() + " " + MONTHS_SHORT[d.getMonth()] + " " + d.getFullYear(); }
  function money(n) { return n === 0 ? "Free" : "$" + n; }
  function money2(n) { return "$" + n.toFixed(2); }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function cardMeta(event, venue) { return shortDate(new Date(event.startAt)) + ", " + timeStr(new Date(event.startAt)) + " · " + venue.name; }
  function detailMeta(event, venue) {
    var s = new Date(event.startAt), e = new Date(event.endAt);
    return longDate(s) + ", " + timeStr(s) + " – " + timeStr(e) + " · " + venue.name;
  }
  function summaryMeta(event, venue) {
    var s = new Date(event.startAt);
    return longDate(s) + ", " + timeStr(s) + " · " + venue.name;
  }
  function rowMeta(event, venue) {
    var s = new Date(event.startAt);
    return shortDateYear(s) + ", " + timeStr(s) + " · " + venue.name;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function generateBookingCode() { return "EVH-2026-" + (Math.floor(Math.random() * 90000) + 10000); }
  function generateSeatNo() {
    var row = String.fromCharCode(65 + Math.floor(Math.random() * 5));
    return row + "-" + (Math.floor(Math.random() * 40) + 1);
  }

  function seatsPillHtml(left) {
    if (left <= 0) return '<span class="pill pill--danger">Sold out</span>';
    if (left <= 5) return '<span class="pill pill--danger">' + escapeHtml(plural(left, "seat")) + " left</span>";
    return '<span class="pill pill--success">' + escapeHtml(plural(left, "seat")) + " left</span>";
  }

  // Header — same on every screen

  function renderHeader() {
    var user = getCurrentUser();
    var actions = document.getElementById("headerActions");
    if (user) {
      actions.innerHTML =
        '<div class="account-menu" id="accountMenu" data-open="false">' +
          '<button type="button" class="account-menu__trigger" id="accountMenuTrigger" aria-haspopup="true" aria-expanded="false">' +
            '<span class="account-menu__avatar" aria-hidden="true">' + escapeHtml(user.firstName.charAt(0)) + "</span>" +
            "<span>" + escapeHtml(user.firstName) + "</span>" +
            '<svg class="account-menu__chevron" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</button>" +
          '<div class="account-menu__list" role="menu">' +
            '<a class="account-menu__item" role="menuitem" href="#/bookings">My bookings</a>' +
            '<a class="account-menu__item" role="menuitem" href="#/profile">Profile</a>' +
            '<button type="button" class="account-menu__item" role="menuitem" data-action="stub">Sign out</button>' +
          "</div>" +
        "</div>";
    } else {
      actions.innerHTML = '<a href="#/signin" class="btn btn--primary">Sign in</a>';
    }
  }

  // Catalogue

  function populateFilterOptions() {
    var citySelect = document.getElementById("filterCity");
    citySelect.innerHTML = CITY_OPTIONS.map(function (o) { return '<option value="' + o.value + '">' + o.label + "</option>"; }).join("");
    var dateSelect = document.getElementById("filterDate");
    dateSelect.innerHTML = DATE_OPTIONS.map(function (o) { return '<option value="' + o.value + '">' + o.label + "</option>"; }).join("");

    var topics = [];
    EVENTS.filter(isUpcoming).forEach(function (e) { e.tags.forEach(function (t) { if (topics.indexOf(t) === -1) topics.push(t); }); });
    topics.sort();
    var topicSelect = document.getElementById("filterTopic");
    topicSelect.innerHTML = ['<option value="all">All topics</option>'].concat(
      topics.map(function (t) { return '<option value="' + t + '">' + t + "</option>"; })
    ).join("");
  }

  function syncFilterSelects() {
    document.getElementById("filterCity").value = state.filters.city;
    document.getElementById("filterDate").value = state.filters.date;
    document.getElementById("filterTopic").value = state.filters.topic;
  }

  function addDays(date, days) { var d = new Date(date); d.setDate(d.getDate() + days); return d; }
  function endOfMonth(date) { return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59); }

  function getFilteredEvents() {
    return EVENTS.filter(isUpcoming).filter(function (ev) {
      var venue = getVenue(ev.venueId);
      if (state.filters.city !== "all" && venue.city !== state.filters.city) return false;
      if (state.filters.topic !== "all" && ev.tags.indexOf(state.filters.topic) === -1) return false;
      if (state.filters.date !== "any") {
        var start = new Date(ev.startAt);
        if (state.filters.date === "week" && !(start >= NOW && start <= addDays(NOW, 7))) return false;
        if (state.filters.date === "month" && !(start >= NOW && start <= endOfMonth(NOW))) return false;
      }
      return true;
    }).sort(function (a, b) { return new Date(a.startAt) - new Date(b.startAt); });
  }

  function renderEventCard(ev) {
    var venue = getVenue(ev.venueId);
    var left = seatsLeft(ev);
    return (
      '<article class="event-card">' +
        '<div class="event-card__cover" style="background:' + COVER_GRADIENTS[ev.id] + '"></div>' +
        '<div class="event-card__body">' +
          '<h3 class="event-card__title"><a class="event-card__title-link" href="#/event/' + ev.id + '">' + escapeHtml(ev.title) + "</a></h3>" +
          '<p class="event-card__meta">' + escapeHtml(cardMeta(ev, venue)) + "</p>" +
          '<div class="event-card__footer">' +
            '<div class="event-card__price-seats">' +
              '<span class="event-card__price">' + priceLabel(ev.id) + "</span>" +
              seatsPillHtml(left) +
            "</div>" +
            '<a class="btn btn--secondary event-card__view" href="#/event/' + ev.id + '">View</a>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderChips() {
    var chips = [];
    if (state.filters.city !== "all") chips.push({ key: "city", label: state.filters.city });
    if (state.filters.date !== "any") chips.push({ key: "date", label: DATE_LABELS[state.filters.date] });
    if (state.filters.topic !== "all") chips.push({ key: "topic", label: state.filters.topic });
    document.getElementById("chipRow").innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-remove-filter="' + c.key + '">' +
        escapeHtml(c.label) +
        '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M1 1l10 10M11 1 1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
        '<span class="visually-hidden">Remove filter</span></button>';
    }).join("");
  }

  function renderPagination() {
    document.getElementById("pagination").innerHTML =
      '<button type="button" class="pagination__btn" data-action="stub" aria-label="Previous page">‹</button>' +
      '<button type="button" class="pagination__btn" aria-current="page">1</button>' +
      '<button type="button" class="pagination__btn" data-action="stub">2</button>' +
      '<button type="button" class="pagination__btn" data-action="stub">3</button>' +
      '<button type="button" class="pagination__btn" data-action="stub" aria-label="Next page">›</button>';
  }

  function renderCatalogue() {
    syncFilterSelects();
    renderChips();
    var totalUpcoming = EVENTS.filter(isUpcoming).length;
    document.getElementById("catalogueSubtitle").textContent = plural(totalUpcoming, "event") + " coming up";

    var filtered = getFilteredEvents();
    document.getElementById("resultCount").textContent = plural(filtered.length, "result");

    var grid = document.getElementById("eventGrid");
    var empty = document.getElementById("emptyState");
    if (filtered.length === 0) {
      grid.hidden = true;
      empty.hidden = false;
      empty.innerHTML =
        '<div class="empty-state">' +
          '<p class="empty-state__title">No events match your filters</p>' +
          "<p>Try a different city, date range or topic.</p>" +
          '<button type="button" class="btn btn--secondary empty-state__reset" id="resetFiltersBtn">Reset filters</button>' +
        "</div>";
    } else {
      empty.hidden = true;
      grid.hidden = false;
      grid.innerHTML = filtered.map(renderEventCard).join("");
    }
    renderPagination();
  }

  // Event details

  function renderTicketOptionsHtml(types, selectedCode) {
    return types.map(function (t) {
      var left = ticketLeft(t);
      var soldOut = left <= 0;
      var selected = t.typeCode === selectedCode;
      var lowClass = !soldOut && left <= 5 ? " ticket-option__left--low" : "";
      var leftText = soldOut ? "Sold out" : plural(left, "seat") + " left";
      return (
        '<label class="ticket-option" data-selected="' + selected + '" data-disabled="' + soldOut + '">' +
          '<input type="radio" class="ticket-option__input" name="ticketType" value="' + t.typeCode + '"' +
            (selected ? " checked" : "") + (soldOut ? " disabled" : "") + ">" +
          '<span class="ticket-option__radio" aria-hidden="true"></span>' +
          '<span class="ticket-option__info">' +
            '<span class="ticket-option__name">' + escapeHtml(t.name) + "</span>" +
            '<span class="ticket-option__left' + lowClass + '">' + leftText + "</span>" +
          "</span>" +
          '<span class="ticket-option__price">' + money(t.price) + "</span>" +
        "</label>"
      );
    }).join("");
  }

  function defaultTicketType(eventId) {
    var types = getTicketTypes(eventId);
    var available = types.filter(function (t) { return ticketLeft(t) > 0; });
    return (available[0] || types[0]).typeCode;
  }

  function renderScheduleHtml(eventId) {
    return getSessions(eventId).map(function (s) {
      var speakerHtml = "";
      if (s.speakerId) {
        var sp = getSpeaker(s.speakerId);
        speakerHtml =
          '<span class="schedule-item__speaker"><span class="avatar" aria-hidden="true">' + escapeHtml(sp.firstName.charAt(0)) + "</span>" +
          escapeHtml(sp.firstName + " " + sp.lastName) + "</span>";
      }
      return (
        '<li class="schedule-item">' +
          '<span class="schedule-item__time">' + timeStr(new Date(s.startAt)) + '<span class="schedule-item__room">' + escapeHtml(s.room || "") + "</span></span>" +
          '<span class="schedule-item__title">' + escapeHtml(s.title) + "</span>" +
          speakerHtml +
        "</li>"
      );
    }).join("");
  }

  function renderSpeakersHtml(eventId) {
    var speakerIds = [];
    getSessions(eventId).forEach(function (s) { if (s.speakerId && speakerIds.indexOf(s.speakerId) === -1) speakerIds.push(s.speakerId); });
    return speakerIds.map(function (id) {
      var sp = getSpeaker(id);
      return (
        '<button type="button" class="speaker-card" data-action="stub">' +
          '<span class="avatar avatar--large" aria-hidden="true">' + escapeHtml(sp.firstName.charAt(0)) + "</span>" +
          '<span><span class="speaker-card__name">' + escapeHtml(sp.firstName + " " + sp.lastName) + "</span><br>" +
          '<span class="speaker-card__role">' + escapeHtml(sp.role) + "</span></span>" +
        "</button>"
      );
    }).join("");
  }

  function renderEventDetail(id) {
    var ev = getEvent(id);
    if (!ev) { location.hash = "#/catalogue"; return; }
    if (state.ticketSelection.eventId !== ev.id) {
      state.ticketSelection = { eventId: ev.id, typeCode: defaultTicketType(ev.id) };
    }
    var venue = getVenue(ev.venueId);
    var types = getTicketTypes(ev.id);
    var selected = getTicketType(ev.id, state.ticketSelection.typeCode);
    var rating = avgRating(ev.id);
    var totalLeft = seatsLeft(ev);
    var bookBtn = totalLeft <= 0
      ? '<button type="button" class="btn btn--primary btn--block" disabled>Sold out</button>'
      : '<a class="btn btn--primary btn--block" href="#/booking/' + ev.id + '">Book a seat</a>';

    document.getElementById("eventDetailRoot").innerHTML =
      '<div class="event-hero" style="background:' + COVER_GRADIENTS[ev.id] + '"></div>' +
      '<div class="container">' +
        '<div class="event-detail__layout">' +
          "<div>" +
            '<h1 class="event-detail__title">' + escapeHtml(ev.title) + "</h1>" +
            '<p class="event-detail__meta">' + escapeHtml(detailMeta(ev, venue)) + "</p>" +
            '<p class="event-detail__rating">' + (rating ? "<strong>★ " + rating.value + "</strong> · " + plural(rating.count, "review") : "No reviews yet") + "</p>" +
            '<div class="event-detail__tags">' + ev.tags.map(function (t) { return '<span class="tag">' + escapeHtml(t) + "</span>"; }).join("") + "</div>" +
            '<p class="event-detail__description">' + escapeHtml(ev.description) + "</p>" +
            '<h2 class="section-title event-detail__section-heading">Schedule</h2>' +
            '<ul class="schedule-list">' + renderScheduleHtml(ev.id) + "</ul>" +
            '<h2 class="section-title event-detail__section-heading">Speakers</h2>' +
            '<div class="speaker-grid">' + renderSpeakersHtml(ev.id) + "</div>" +
          "</div>" +
          '<aside class="side-panel side-panel--sticky">' +
            '<h2 class="section-title">Tickets</h2>' +
            '<div class="ticket-list">' + renderTicketOptionsHtml(types, selected.typeCode) + "</div>" +
            '<div class="summary-total"><span>Total</span><span>' + money(selected.price) + "</span></div>" +
            '<div class="event-detail__cta">' + bookBtn + "</div>" +
          "</aside>" +
        "</div>" +
      "</div>";
  }

  // Booking

  function initBookingStateIfNewEvent(ev) {
    if (state.bookingEventId === ev.id) return;
    state.bookingEventId = ev.id;
    state.bookingQty = 1;
    var user = getCurrentUser();
    state.bookingName = user ? user.firstName + " " + user.lastName : "";
    state.bookingEmail = user ? user.email : "";
    state.bookingTermsChecked = false;
    if (state.ticketSelection.eventId !== ev.id) {
      state.ticketSelection = { eventId: ev.id, typeCode: defaultTicketType(ev.id) };
    }
  }

  function renderBookingDetailsFormHtml(types, selected, maxQty) {
    return (
      '<form id="bookingForm" novalidate>' +
        '<div class="booking-form__section">' +
          '<h2 class="section-title">Ticket type</h2>' +
          '<div class="ticket-list">' + renderTicketOptionsHtml(types, selected.typeCode) + "</div>" +
        "</div>" +
        '<div class="booking-form__section">' +
          '<h2 class="section-title">Quantity</h2>' +
          '<div class="stepper">' +
            '<button type="button" class="stepper__btn" id="qtyDec" aria-label="Decrease quantity"' + (state.bookingQty <= 1 ? " disabled" : "") + ">−</button>" +
            '<span class="stepper__value" id="qtyValue">' + state.bookingQty + "</span>" +
            '<button type="button" class="stepper__btn" id="qtyInc" aria-label="Increase quantity"' + (state.bookingQty >= maxQty ? " disabled" : "") + ">+</button>" +
          "</div>" +
        "</div>" +
        '<div class="booking-form__section">' +
          '<h2 class="section-title">Your details</h2>' +
          '<div class="booking-form__row">' +
            '<div class="form-field">' +
              '<label for="bookingName">Full name</label>' +
              '<input type="text" id="bookingName" name="name" value="' + escapeHtml(state.bookingName) + '">' +
              '<p class="form-field__error" id="bookingNameError" hidden></p>' +
            "</div>" +
            '<div class="form-field">' +
              '<label for="bookingEmail">Email address</label>' +
              '<input type="email" id="bookingEmail" name="email" value="' + escapeHtml(state.bookingEmail) + '">' +
              '<p class="form-field__error" id="bookingEmailError" hidden></p>' +
            "</div>" +
          "</div>" +
          '<p class="form-field__hint">Prefilled from your profile when signed in</p>' +
        "</div>" +
      "</form>"
    );
  }

  function renderOrderSummaryHtml(selected, total) {
    return (
      '<aside class="side-panel side-panel--sticky">' +
        '<h2 class="section-title">Order summary</h2>' +
        '<div class="summary-row"><span>Ticket</span><strong>' + escapeHtml(selected.name) + "</strong></div>" +
        '<div class="summary-row"><span>Price</span><strong>' + money2(selected.price) + "</strong></div>" +
        '<div class="summary-row"><span>Quantity</span><strong>' + state.bookingQty + "</strong></div>" +
        '<div class="summary-total"><span>Total</span><span>' + money2(total) + "</span></div>" +
        '<div class="checkbox-field">' +
          '<input type="checkbox" id="bookingTerms" name="terms"' + (state.bookingTermsChecked ? " checked" : "") + ">" +
          '<label for="bookingTerms">I accept the terms of service</label>' +
        "</div>" +
        '<p class="form-field__error" id="bookingTermsError" hidden></p>' +
        '<button type="submit" form="bookingForm" class="btn btn--primary btn--block order-summary__submit">Confirm booking</button>' +
      "</aside>"
    );
  }

  function renderBooking(id) {
    var ev = getEvent(id);
    if (!ev) { location.hash = "#/catalogue"; return; }
    initBookingStateIfNewEvent(ev);

    var venue = getVenue(ev.venueId);
    var types = getTicketTypes(ev.id);
    var selected = getTicketType(ev.id, state.ticketSelection.typeCode);
    var maxQty = Math.max(1, ticketLeft(selected));
    if (state.bookingQty > maxQty) state.bookingQty = maxQty;
    var total = selected.price * state.bookingQty;

    document.getElementById("bookingRoot").innerHTML =
      '<div class="container">' +
        '<a class="back-link" href="#/event/' + ev.id + '">← Back to event</a>' +
        '<h1 class="page-title booking-page__title">Complete your booking</h1>' +
        '<div class="event-summary-card">' +
          '<div class="event-summary-card__cover" style="background:' + COVER_GRADIENTS[ev.id] + '"></div>' +
          '<div class="event-summary-card__body">' +
            '<p class="event-summary-card__title">' + escapeHtml(ev.title) + "</p>" +
            '<p class="event-summary-card__meta">' + escapeHtml(summaryMeta(ev, venue)) + "</p>" +
          "</div>" +
        "</div>" +
        '<div class="event-detail__layout">' +
          renderBookingDetailsFormHtml(types, selected, maxQty) +
          renderOrderSummaryHtml(selected, total) +
        "</div>" +
      "</div>";
  }

  // Confirmation

  function renderConfirmation(code) {
    var reg = REGISTRATIONS.filter(function (r) { return r.code === code; })[0];
    var root = document.getElementById("confirmationRoot");
    if (!reg) {
      root.innerHTML = '<div class="container"><div class="empty-state"><p class="empty-state__title">Booking not found</p><a class="btn btn--primary" href="#/catalogue">Back to catalogue</a></div></div>';
      return;
    }
    var ev = getEvent(reg.eventId);
    var venue = getVenue(ev.venueId);
    var type = getTicketType(reg.eventId, reg.typeCode);
    root.innerHTML =
      '<div class="container">' +
        '<div class="confirmation">' +
          '<div class="confirmation__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 13l5 5 9-11" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
          '<h1 class="confirmation__title">Booking confirmed</h1>' +
          '<p class="confirmation__subtitle">A confirmation has been sent to ' + escapeHtml(reg.email) + "</p>" +
          '<div class="confirmation__code-box">' +
            '<p class="confirmation__code-label">Booking code</p>' +
            '<p class="confirmation__code">' + escapeHtml(reg.code) + "</p>" +
          "</div>" +
          '<div class="confirmation__event">' +
            '<div class="confirmation__event-cover" style="background:' + COVER_GRADIENTS[ev.id] + '"></div>' +
            '<div class="confirmation__event-body">' +
              '<p class="event-summary-card__title">' + escapeHtml(ev.title) + "</p>" +
              '<p class="event-summary-card__meta">' + escapeHtml(summaryMeta(ev, venue)) + "</p>" +
              '<p class="event-summary-card__meta">' + escapeHtml(type.name) + " · " + plural(reg.qty, "ticket") + (reg.seatNo ? " · Seat " + escapeHtml(reg.seatNo) : "") + "</p>" +
            "</div>" +
          "</div>" +
          '<div class="confirmation__actions">' +
            '<a class="btn btn--primary" href="#/bookings">View my bookings</a>' +
            '<a class="btn btn--secondary" href="#/catalogue">Back to catalogue</a>' +
          "</div>" +
        "</div>" +
      "</div>";
  }

  // My bookings

  function renderBookingRow(reg) {
    var ev = getEvent(reg.eventId);
    var venue = getVenue(ev.venueId);
    var badge = { booked: '<span class="status-badge status-badge--success">Confirmed</span>',
      cancelled: '<span class="status-badge status-badge--danger">Cancelled</span>',
      attended: '<span class="status-badge status-badge--muted">Attended</span>' }[reg.status];

    var action = "";
    if (reg.status === "booked") {
      action = '<button type="button" class="btn btn--secondary" data-action="cancel-booking" data-registration-id="' + reg.id + '">Cancel</button>';
    } else if (reg.status === "attended") {
      var review = existingReview(reg.userId, reg.eventId);
      action = review
        ? '<p class="booking-row__rating">Your rating: ' + "★".repeat(review.rating) + "☆".repeat(5 - review.rating) + "</p>"
        : '<button type="button" class="btn btn--primary" data-action="open-review" data-registration-id="' + reg.id + '">Leave a review</button>';
    }

    return (
      '<li class="booking-row' + (reg.status === "cancelled" ? " booking-row--cancelled" : "") + '">' +
        '<div class="booking-row__cover" style="background:' + COVER_GRADIENTS[ev.id] + '"></div>' +
        '<div class="booking-row__body">' +
          '<p class="booking-row__title">' + escapeHtml(ev.title) + "</p>" +
          '<p class="booking-row__meta">' + escapeHtml(rowMeta(ev, venue)) + "</p>" +
          '<p class="booking-row__meta">' + escapeHtml(getTicketType(reg.eventId, reg.typeCode).name) + " · " + plural(reg.qty, "ticket") + " · " + escapeHtml(reg.code) + "</p>" +
        "</div>" +
        '<div class="booking-row__end">' + badge + action + "</div>" +
      "</li>"
    );
  }

  function signedOutPrompt(message) {
    return (
      '<div class="container"><div class="empty-state">' +
        "<p class=\"empty-state__title\">" + escapeHtml(message) + "</p>" +
        '<a class="btn btn--primary empty-state__reset" href="#/signin">Sign in</a>' +
      "</div></div>"
    );
  }

  function renderBookings() {
    var user = getCurrentUser();
    var root = document.getElementById("bookingsRoot");
    if (!user) { root.innerHTML = signedOutPrompt("Sign in to see your bookings"); return; }

    var regs = REGISTRATIONS.filter(function (r) { return r.userId === user.id; });
    var upcoming = regs.filter(function (r) { return isUpcoming(getEvent(r.eventId)); });
    var past = regs.filter(function (r) { return !isUpcoming(getEvent(r.eventId)); });
    var list = state.bookingsTab === "upcoming" ? upcoming : past;
    var emptyMessage = state.bookingsTab === "upcoming" ? "No upcoming bookings yet." : "No past bookings yet.";

    root.innerHTML =
      '<div class="container">' +
        '<div class="bookings-header">' +
          '<h1 class="page-title">My bookings</h1>' +
          '<div class="tabs" role="tablist">' +
            '<button type="button" class="tab" role="tab" id="tabUpcoming" aria-selected="' + (state.bookingsTab === "upcoming") + '" data-action="select-tab" data-tab="upcoming">Upcoming</button>' +
            '<button type="button" class="tab" role="tab" id="tabPast" aria-selected="' + (state.bookingsTab === "past") + '" data-action="select-tab" data-tab="past">Past</button>' +
          "</div>" +
        "</div>" +
        (list.length
          ? '<ul class="booking-list">' + list.map(renderBookingRow).join("") + "</ul>"
          : '<div class="empty-state"><p class="empty-state__title">' + emptyMessage + "</p></div>") +
      "</div>";
  }

  // Profile

  function renderPhoneRow(phone, index) {
    return (
      '<div class="phone-row">' +
        '<label for="phone' + index + '" class="visually-hidden">Phone number ' + (index + 1) + "</label>" +
        '<input type="tel" id="phone' + index + '" class="phone-row__input" data-phone-index="' + index + '" value="' + escapeHtml(phone) + '">' +
        '<button type="button" class="btn btn--secondary" data-action="remove-phone" data-phone-index="' + index + '">Remove</button>' +
      "</div>"
    );
  }

  function renderPhoneList() {
    var user = getCurrentUser();
    document.getElementById("phoneList").innerHTML = user.phones.map(renderPhoneRow).join("");
  }

  function renderProfile() {
    var user = getCurrentUser();
    var root = document.getElementById("profileRoot");
    if (!user) { root.innerHTML = signedOutPrompt("Sign in to see your profile"); return; }

    root.innerHTML =
      '<div class="container container--narrow">' +
        '<h1 class="page-title profile-page__title">Profile</h1>' +
        '<form class="profile-card" id="profileForm" novalidate>' +
          '<h2 class="profile-card__section-title">Personal details</h2>' +
          '<div class="booking-form__row">' +
            '<div class="form-field"><label for="profileFirstName">First name</label><input type="text" id="profileFirstName" value="' + escapeHtml(user.firstName) + '"></div>' +
            '<div class="form-field"><label for="profileLastName">Last name</label><input type="text" id="profileLastName" value="' + escapeHtml(user.lastName) + '"></div>' +
          "</div>" +
          '<div class="booking-form__row">' +
            '<div class="form-field"><label for="profileEmail">Email</label><input type="email" id="profileEmail" value="' + escapeHtml(user.email) + '"></div>' +
            '<div class="form-field"><label for="profileDob">Date of birth</label><input type="date" id="profileDob" value="' + escapeHtml(user.birthDate || "") + '"></div>' +
          "</div>" +
          '<hr class="profile-card__divider">' +
          '<h2 class="profile-card__section-title">Phone numbers</h2>' +
          '<p class="profile-card__hint">You can store more than one</p>' +
          '<div id="phoneList" class="phone-list">' + user.phones.map(renderPhoneRow).join("") + "</div>" +
          '<button type="button" class="btn btn--secondary profile-card__add-phone" data-action="add-phone">+ Add phone</button>' +
          '<hr class="profile-card__divider">' +
          '<div class="profile-card__footer">' +
            '<span class="profile-card__saved" id="profileSavedMsg" hidden>Saved</span>' +
            '<button type="submit" class="btn btn--primary">Save changes</button>' +
          "</div>" +
        "</form>" +
      "</div>";
  }

  // Review modal — overlay on #/bookings, not its own route

  function focusableInModal() {
    return Array.prototype.slice.call(
      document.getElementById("reviewModal").querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }

  function openReviewModal(registrationId) {
    var reg = REGISTRATIONS.filter(function (r) { return r.id === registrationId; })[0];
    if (!reg) return;
    var ev = getEvent(reg.eventId);
    state.reviewRegistrationId = registrationId;
    state.reviewTriggerEl = document.activeElement;

    document.getElementById("reviewModalSubtitle").textContent = ev.title + " · " + shortDateYear(new Date(ev.startAt));
    document.getElementById("reviewForm").reset();
    document.getElementById("reviewForm").hidden = false;
    document.getElementById("reviewSavedMsg").hidden = true;
    document.getElementById("ratingError").hidden = true;

    var overlay = document.getElementById("reviewModalOverlay");
    overlay.hidden = false;
    document.body.classList.add("modal-open");
    var stars = focusableInModal();
    if (stars.length) stars[0].focus();
  }

  function closeReviewModal() {
    var overlay = document.getElementById("reviewModalOverlay");
    if (overlay.hidden) return;
    clearTimeout(state.reviewSavedTimeout);
    overlay.hidden = true;
    document.body.classList.remove("modal-open");
    if (state.reviewTriggerEl) state.reviewTriggerEl.focus();
    state.reviewTriggerEl = null;
    state.reviewRegistrationId = null;
  }

  function submitReview(e) {
    e.preventDefault();
    var form = e.target;
    var checked = form.querySelector('input[name="rating"]:checked');
    if (!checked) { document.getElementById("ratingError").hidden = false; return; }
    document.getElementById("ratingError").hidden = true;

    var reg = REGISTRATIONS.filter(function (r) { return r.id === state.reviewRegistrationId; })[0];
    REVIEWS.push({
      id: state.nextReviewId++, userId: reg.userId, eventId: reg.eventId,
      rating: Number(checked.value), comment: document.getElementById("reviewComment").value.trim(), createdAt: new Date().toISOString()
    });

    form.hidden = true;
    document.getElementById("reviewSavedMsg").hidden = false;
    clearTimeout(state.reviewSavedTimeout);
    state.reviewSavedTimeout = setTimeout(function () { closeReviewModal(); renderBookings(); }, 1200);
  }

  // Toast

  function showToast(message) {
    var el = document.getElementById("toast");
    clearTimeout(state.toastTimeout);
    el.classList.remove("is-leaving");
    el.textContent = message;
    el.hidden = false;
    state.toastTimeout = setTimeout(function () {
      el.classList.add("is-leaving");
      setTimeout(function () { el.hidden = true; }, 300);
    }, 3000);
  }

  // Everything below is delegated on document, since screens get rebuilt a lot

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showFieldError(inputId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(inputId + "Error");
    if (input) input.classList.add("is-invalid");
    if (error) { error.textContent = message; error.hidden = false; }
  }
  function clearFieldError(inputId) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(inputId + "Error");
    if (input) input.classList.remove("is-invalid");
    if (error) error.hidden = true;
  }

  function handleSignIn(e) {
    e.preventDefault();
    var email = document.getElementById("signinEmail").value.trim();
    var password = document.getElementById("signinPassword").value;
    var valid = true;
    if (!EMAIL_RE.test(email)) { showFieldError("signinEmail", "Enter a valid email address."); valid = false; } else clearFieldError("signinEmail");
    if (password.length < 4) { showFieldError("signinPassword", "Password must be at least 4 characters."); valid = false; } else clearFieldError("signinPassword");
    if (!valid) return;
    state.currentUserId = USERS[0].id;
    renderHeader();
    showToast("Signed in as " + USERS[0].firstName + " " + USERS[0].lastName);
    location.hash = "#/catalogue";
  }

  function validateBookingForm(name, email, termsChecked) {
    var valid = true;
    if (!name) { showFieldError("bookingName", "Enter your full name."); valid = false; } else clearFieldError("bookingName");
    if (!EMAIL_RE.test(email)) { showFieldError("bookingEmail", "Enter a valid email address."); valid = false; } else clearFieldError("bookingEmail");
    var termsError = document.getElementById("bookingTermsError");
    if (!termsChecked) { termsError.textContent = "You must accept the terms of service."; termsError.hidden = false; valid = false; } else termsError.hidden = true;
    return valid;
  }

  function handleBookingSubmit(e) {
    e.preventDefault();
    var name = document.getElementById("bookingName").value.trim();
    var email = document.getElementById("bookingEmail").value.trim();
    var termsChecked = document.getElementById("bookingTerms").checked;
    if (!validateBookingForm(name, email, termsChecked)) {
      var firstInvalid = document.querySelector(".is-invalid, #bookingTermsError:not([hidden])");
      if (firstInvalid) {
        var target = firstInvalid.id === "bookingTermsError" ? document.getElementById("bookingTerms") : firstInvalid;
        target.focus();
      }
      return;
    }
    var ev = getEvent(state.bookingEventId);
    var type = getTicketType(ev.id, state.ticketSelection.typeCode);
    var qty = state.bookingQty;
    var user = getCurrentUser();
    var reg = {
      id: state.nextRegistrationId++, userId: user ? user.id : null, name: name, email: email,
      eventId: ev.id, typeCode: type.typeCode, registeredAt: new Date().toISOString(),
      status: "booked", qty: qty, totalPrice: type.price * qty, code: generateBookingCode(), seatNo: generateSeatNo()
    };
    REGISTRATIONS.push(reg);
    location.hash = "#/confirmation/" + reg.code;
  }

  function handleProfileSubmit(e) {
    e.preventDefault();
    var user = getCurrentUser();
    if (!user) return;
    user.firstName = document.getElementById("profileFirstName").value.trim() || user.firstName;
    user.lastName = document.getElementById("profileLastName").value.trim() || user.lastName;
    user.email = document.getElementById("profileEmail").value.trim() || user.email;
    user.birthDate = document.getElementById("profileDob").value || user.birthDate;
    renderHeader();
    var saved = document.getElementById("profileSavedMsg");
    saved.hidden = false;
    setTimeout(function () { saved.hidden = true; }, 2500);
  }

  function handleCancelBooking(regId) {
    var reg = REGISTRATIONS.filter(function (r) { return r.id === regId; })[0];
    if (!reg) return;
    var ev = getEvent(reg.eventId);
    var confirmed = window.confirm('Cancel your booking for "' + ev.title + '"? This cannot be undone.');
    if (!confirmed) return;
    reg.status = "cancelled";
    showToast("Booking cancelled");
    renderBookings();
  }

  function toggleAccountMenu(force) {
    var menu = document.getElementById("accountMenu");
    if (!menu) return;
    var open = force !== undefined ? force : menu.dataset.open !== "true";
    menu.dataset.open = String(open);
    document.getElementById("accountMenuTrigger").setAttribute("aria-expanded", String(open));
  }

  function toggleSearch(force) {
    var wrap = document.getElementById("headerSearch");
    var open = force !== undefined ? force : wrap.dataset.expanded !== "true";
    wrap.dataset.expanded = String(open);
    document.getElementById("searchToggle").setAttribute("aria-expanded", String(open));
    if (open) document.getElementById("searchInput").focus();
  }

  function toggleFilterSheet(open) {
    document.getElementById("filterBar").dataset.open = String(open);
    document.getElementById("filterSheetBackdrop").hidden = !open;
  }

  function onQtyChange(delta) {
    var selected = getTicketType(state.bookingEventId, state.ticketSelection.typeCode);
    var max = Math.max(1, ticketLeft(selected));
    state.bookingQty = Math.min(max, Math.max(1, state.bookingQty + delta));
    renderBooking(state.bookingEventId);
  }

  function handleReviewModalClick(e) {
    var reviewBtn = e.target.closest('[data-action="open-review"]');
    if (reviewBtn) { openReviewModal(Number(reviewBtn.dataset.registrationId)); return true; }
    if (e.target.closest("#reviewModalClose") || e.target.closest("#reviewCancel")) { closeReviewModal(); return true; }
    if (e.target === document.getElementById("reviewModalOverlay")) { closeReviewModal(); return true; }
    return false;
  }

  function handlePhoneRowClick(e) {
    var removePhone = e.target.closest('[data-action="remove-phone"]');
    if (removePhone) { getCurrentUser().phones.splice(Number(removePhone.dataset.phoneIndex), 1); renderPhoneList(); return true; }
    if (e.target.closest('[data-action="add-phone"]')) {
      getCurrentUser().phones.push("");
      renderPhoneList();
      var rows = document.querySelectorAll(".phone-row__input");
      if (rows.length) rows[rows.length - 1].focus();
      return true;
    }
    return false;
  }

  function onDocumentClick(e) {
    var stub = e.target.closest('[data-action="stub"]');
    if (stub) { e.preventDefault(); showToast("Not available in this prototype"); return; }

    var removeChip = e.target.closest("[data-remove-filter]");
    if (removeChip) {
      var key = removeChip.dataset.removeFilter;
      state.filters[key] = key === "date" ? "any" : "all";
      renderCatalogue();
      return;
    }
    if (e.target.closest("#resetFiltersBtn")) { state.filters = { city: "all", date: "any", topic: "all" }; renderCatalogue(); return; }

    if (e.target.closest("#searchToggle")) { toggleSearch(); return; }
    if (e.target.closest("#accountMenuTrigger")) { toggleAccountMenu(); return; }
    if (e.target.closest("#filterOpenBtn")) { toggleFilterSheet(true); return; }
    if (e.target.closest("#filterSheetClose") || e.target.closest("#filterSheetBackdrop")) { toggleFilterSheet(false); return; }

    var tabBtn = e.target.closest('[data-action="select-tab"]');
    if (tabBtn) { state.bookingsTab = tabBtn.dataset.tab; renderBookings(); return; }

    var cancelBtn = e.target.closest('[data-action="cancel-booking"]');
    if (cancelBtn) { handleCancelBooking(Number(cancelBtn.dataset.registrationId)); return; }

    if (handleReviewModalClick(e)) return;
    if (handlePhoneRowClick(e)) return;

    if (e.target.closest("#qtyInc")) { onQtyChange(1); return; }
    if (e.target.closest("#qtyDec")) { onQtyChange(-1); return; }

    if (!e.target.closest("#accountMenu")) toggleAccountMenu(false);
    if (!e.target.closest("#headerSearch")) toggleSearch(false);
  }

  function onDocumentChange(e) {
    if (e.target.id === "filterCity") { state.filters.city = e.target.value; renderCatalogue(); return; }
    if (e.target.id === "filterDate") { state.filters.date = e.target.value; renderCatalogue(); return; }
    if (e.target.id === "filterTopic") { state.filters.topic = e.target.value; renderCatalogue(); return; }

    if (e.target.name === "ticketType") {
      state.ticketSelection = { eventId: state.ticketSelection.eventId, typeCode: e.target.value };
      var onBookingScreen = !document.getElementById("screen-booking").hidden;
      if (onBookingScreen) { state.bookingQty = 1; renderBooking(state.bookingEventId); }
      else renderEventDetail(state.ticketSelection.eventId);
      return;
    }
  }

  function onDocumentInput(e) {
    if (e.target.classList.contains("is-invalid")) {
      e.target.classList.remove("is-invalid");
      var error = document.getElementById(e.target.id + "Error");
      if (error) error.hidden = true;
    }
    if (e.target.id === "bookingName") state.bookingName = e.target.value;
    if (e.target.id === "bookingEmail") state.bookingEmail = e.target.value;
    if (e.target.id === "bookingTerms") {
      state.bookingTermsChecked = e.target.checked;
      document.getElementById("bookingTermsError").hidden = true;
    }
    if (e.target.classList.contains("phone-row__input")) {
      getCurrentUser().phones[Number(e.target.dataset.phoneIndex)] = e.target.value;
    }
  }

  function onDocumentSubmit(e) {
    if (e.target.id === "signinForm") return handleSignIn(e);
    if (e.target.id === "bookingForm") return handleBookingSubmit(e);
    if (e.target.id === "profileForm") return handleProfileSubmit(e);
    if (e.target.id === "reviewForm") return submitReview(e);
  }

  function onDocumentKeydown(e) {
    var overlay = document.getElementById("reviewModalOverlay");
    if (overlay.hidden) return;
    if (e.key === "Escape") { closeReviewModal(); return; }
    if (e.key !== "Tab") return;
    var items = focusableInModal();
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function bindEvents() {
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("change", onDocumentChange);
    document.addEventListener("input", onDocumentInput);
    document.addEventListener("submit", onDocumentSubmit);
    document.addEventListener("keydown", onDocumentKeydown);
  }

  // Router

  function parseHash() {
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("/").filter(Boolean);
    if (parts.length === 0) return { name: "catalogue", params: {} };
    switch (parts[0]) {
      case "catalogue": return { name: "catalogue", params: {} };
      case "event": return parts[1] ? { name: "event", params: { id: parts[1] } } : { name: "catalogue", params: {} };
      case "booking": return parts[1] ? { name: "booking", params: { id: parts[1] } } : { name: "catalogue", params: {} };
      case "confirmation": return parts[1] ? { name: "confirmation", params: { code: parts[1] } } : { name: "catalogue", params: {} };
      case "signin": return { name: "signin", params: {} };
      case "bookings": return { name: "bookings", params: {} };
      case "profile": return { name: "profile", params: {} };
      default: return { name: "catalogue", params: {} };
    }
  }

  function showScreen(name) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) screens[i].hidden = screens[i].dataset.screen !== name;
  }

  function router() {
    closeReviewModal();
    var route = parseHash();
    showScreen(route.name);
    if (route.name === "catalogue") renderCatalogue();
    else if (route.name === "event") renderEventDetail(route.params.id);
    else if (route.name === "booking") renderBooking(route.params.id);
    else if (route.name === "confirmation") renderConfirmation(route.params.code);
    else if (route.name === "signin") renderSignInReset();
    else if (route.name === "bookings") renderBookings();
    else if (route.name === "profile") renderProfile();
    renderHeader();
    window.scrollTo(0, 0);
  }

  function renderSignInReset() {
    document.getElementById("signinForm").reset();
    clearFieldError("signinEmail");
    clearFieldError("signinPassword");
  }

  // Init

  function init() {
    populateFilterOptions();
    bindEvents();
    window.addEventListener("hashchange", router);
    if (!location.hash) location.hash = "#/catalogue"; else router();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

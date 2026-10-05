# 001 · No router yet

**Status:** Superseded by #3 — the site moved to Next.js, which brings routing.

**Decision:** The product list renders as a section of the existing single page. The project does
not get a router in this ticket.

**Context:** The ticket says "the product page", which usually means its own URL. The project is a
single-page Vite app with no routing at all, so a real page would mean adding react-router. A
migration to Next.js is already planned, and Next brings routing with it — so a router installed
now would be deleted in a few weeks, along with the URL structure built on top of it.

**When to reopen:** When the Next.js migration starts, or as soon as a second screen needs its own
URL — a product detail page, a cart, or anything a customer should be able to link to or reload.

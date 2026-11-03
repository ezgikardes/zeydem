# Zeydem MVP plan · 30 October – 29 November 2026

Jira project `ZEY` is the live version of this plan: status, sprints and ticket details are kept
there. This file records the plan as agreed, so the repo explains itself.

## Goal

A new customer sees the products, adds them to a cart, orders and pays in test mode. The producer
logs in and sees the orders in one list. The site is live on the internet. Delivery: 29 November.

## Decisions already made

- Next.js stays as the frontend. The backend is a separate Java + Spring Boot service in the same
  repo. Java 17 is available; Docker is not installed.
- Payment runs in the provider's test mode (sandbox). One producer account, no customer accounts.
- Every other technology choice is made when the ticket that needs it opens, and written into
  that ticket's spec. Those points are marked **⚑** below.
- The frontend is deployed on Vercel from `main`. It goes live before T1.1, with the current
  home page.

**Out of scope:** walnuts, the English version, customer accounts, real payment, shipping,
email, marking an order as shipped.

**After delivery:** Docker for the local database and the backend tests (Testcontainers), ZEY-37;
real testimonials replace the current ones.

## How work is broken down

Feature (Jira epic) → sub-feature when needed (label) → ticket (Jira story, one user outcome) →
implementation steps inside the ticket, split into BE and FE lines. Labels: `FE`, `BE`,
`F2a`… for sub-features, `kesilebilir` for tickets that can be cut. Commit rules are in
`CLAUDE.md`.

## Preparation · epic ZEY-1

| Key | Work | Result | h |
|---|---|---|---|
| ZEY-7 | H1 Cleanup commit | Product list, cart, tests and the kuruş rule removed in one commit | 0.5 |
| ZEY-8 | H2 Move the code into `frontend/` | Build, lint and dev run inside `frontend/` | 2 |
| ZEY-9 | H3 Split CLAUDE.md | Repo-wide `CLAUDE.md` + `frontend/CLAUDE.md` | 1.5 |
| ZEY-10 | H4 Plan into Jira and this file | Epics, stories, sprints; `docs/plan.md` | 1.5 |
| ZEY-11 | H5 Page sketches and architecture | Excalidraw sketches of every MVP page and the earlier design system (colours, fonts, contrast rules, the current logo) in `docs/features/design/`; context and container diagram and the domain class diagram in `docs/architecture.md` | 4 |

## F1 · Discover products · epic ZEY-2

| Key | Ticket | Side | Draft steps | h |
|---|---|---|---|---|
| ZEY-12 | T1.1 A visitor sees the product list with name, photo and price | FE+BE | **BE:** decision 003 (Java backend); Spring Boot skeleton with Maven; layer packages + decision 004 (course week 5); product table + sample data: PostgreSQL (Homebrew locally, Neon live), schema created by Hibernate, idempotent seed SQL; prices in TL as `NUMERIC(10,2)` / `BigDecimal`, decision 005; amount and unit as separate fields; the contract for `GET /products`, errors included, written before either side; `GET /products` + test; layer boundaries checked by ArchUnit. **FE:** design tokens and fonts from the design system; `/urunler` page fetches on the server; test. **Deploy:** BE on Render; the FE on Vercel reads from it | 14 |
| ZEY-13 | T1.2 A visitor opens a product's detail page | FE+BE | **BE:** `slug` and `description` fields; `GET /products/{slug}`. **FE:** `/urunler/[slug]`; list cards link to it | 4 |
| ZEY-14 | T1.3 With no products on sale, the visitor sees "Henüz ürün yok" | FE | Empty state + test | 1 |
| ZEY-15 | T1.4 If products cannot load, the visitor sees an error | FE | Error state + test | 2 |
| ZEY-16 | T1.5 An unknown product address shows "Ürün bulunamadı" | FE+BE | **BE:** 404. **FE:** not-found page · cuttable | 2 |

## F2 · Build a cart · epic ZEY-3

| Key | Ticket | Side | Draft steps | h |
|---|---|---|---|---|
| ZEY-17 | T2.1 A visitor adds to the cart from the product page; the header count goes up | FE | Cart state, "Sepete ekle" button, header counter | 4 |
| ZEY-18 | T2.2 The cart survives a page reload | FE | Browser storage, safe default for unreadable data | 2 |
| ZEY-19 | T2.3 An out-of-stock product cannot be added | FE+BE | **BE:** stock in the product response. **FE:** disabled button + "Tükendi" · cuttable | 2 |
| ZEY-20 | T2.4 The cart page shows products, quantities and the total | FE | `/sepet`, total + test | 3 |
| ZEY-21 | T2.5 A visitor raises or lowers a quantity | FE | +/− buttons, limits | 2 |
| ZEY-22 | T2.6 A visitor removes a product; an empty cart says "Sepetiniz boş" | FE | Remove, empty state | 1.5 |

## F3 · Order and pay · epic ZEY-4

| Key | Ticket | Side | Draft steps | h |
|---|---|---|---|---|
| ZEY-23 | T3.1 The customer enters name, phone and address and sees the order summary | FE | `/odeme` form + summary | 3 |
| ZEY-24 | T3.2 Missing or invalid fields show an error | FE | Validation + tests | 2 |
| ZEY-25 | T3.3 The customer pays with a test card and sees "Siparişiniz alındı" with an order number | FE+BE | **BE:** order + line tables; `POST /orders`, price computed on the server; sandbox payment ⚑ provider (iyzico proposed): its documentation read for the five questions, and what it does not say written down; status `PAID`; sequence diagram of the payment in the spec. **FE:** payment step, confirmation page, cart cleared | 8 |
| ZEY-26 | T3.4 A declined payment shows an error and keeps the cart | FE+BE | **BE:** status `FAILED`. **FE:** error, cart kept | 2.5 |
| ZEY-27 | T3.5 If stock ran out meanwhile, the order is refused and the customer told | FE+BE | **BE:** stock check and decrement at order time. **FE:** which product ran out · cuttable | 3 |

## F4 · Follow the orders · epic ZEY-5

| Key | Ticket | Side | Draft steps | h |
|---|---|---|---|---|
| ZEY-28 | T4.1 The producer logs in with username and password | FE+BE | **BE:** one admin account, hashed password ⚑ session method. **FE:** `/yonetim/giris` | 5 |
| ZEY-29 | T4.2 Wrong credentials show an error | FE+BE | **BE:** 401. **FE:** message · cuttable | 1 |
| ZEY-30 | T4.3 Without logging in, the orders page redirects to the login page | FE+BE | **BE:** protected endpoints. **FE:** redirect | 2 |
| ZEY-31 | T4.4 The producer logs out | FE+BE | **BE:** end the session. **FE:** logout button | 1 |
| ZEY-32 | T4.5 The producer sees paid orders, newest first | FE+BE | **BE:** `GET /admin/orders`. **FE:** `/yonetim/siparisler` | 3 |
| ZEY-33 | T4.6 The producer opens an order: products, address, phone | FE+BE | **BE:** `GET /admin/orders/{id}`. **FE:** detail page | 2.5 |

## F5 · Get to know the farm · epic ZEY-6

| Key | Ticket | Side | Draft steps | h |
|---|---|---|---|---|
| ZEY-34 | T5.1 The home page shows the farm and the product categories | FE+BE | New home page from the H5 sketches; product `category` field for the category cards; the current logo moves into a `Logo` component; what happens to the olive-oil-only sections is decided here; the current testimonials stay for now | 4 |
| ZEY-35 | T5.2 Header and Hero links go to the right places | FE | Fix `#satinal`, `#hakkimizda`; `#iletisim` goes to the footer | 1 |
| ZEY-36 | T5.3 A visitor sees the contact details | FE | Contact details in the footer, no separate section | 1.5 |

## Sprints

| Sprint | Dates | Work | h | Checkpoint |
|---|---|---|---|---|
| Hafta 0 | 30 Oct – 1 Nov | H1–H4 | 5.5 | `frontend/` works, plan in Jira |
| Hafta 1 | 2–8 Nov | H5, T1.1, T1.2 | 22 | Product list live, served from the database |
| Hafta 2 | 9–15 Nov | T1.3–T1.5, T2.1–T2.6 | 19.5 | Cart works |
| Hafta 3 | 16–22 Nov | T3.1–T3.5, T4.1 | 23.5 | An order can be paid with a test card |
| Hafta 4 | 23–29 Nov | T4.2–T4.6, T5.1–T5.3, README with the AI section, 6-minute presentation | 20 + ~3 | Delivery on 29 November |

About 93 hours against a budget of about 85 (20 h a week). **If time runs short, cut in this
order:** first the edge cases labelled `kesilebilir` (T1.5, T2.3, T3.5, T4.2), then F5
shrinks to small changes on the existing sections. The happy path (T1.1, T1.2, T2.1, T2.4, T3.1,
T3.3, T4.1, T4.5) is never cut.


## Verification

- Every ticket: its spec's Given / When / Then checks are written as tests. In `frontend/`:
  `npm test`, `npm run lint`, `npm run build`; in `backend/`: its tests.
- From T1.1 on, at the end of each week the live site is tried in a browser for that week's flow.
- Before delivery: an order is placed on the live site with a sandbox card and seen in the
  producer's order list.

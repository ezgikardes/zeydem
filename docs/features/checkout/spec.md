# Checkout

The checkout tickets (ZEY-23 onwards) share this spec; each adds a section. The visitor goes
from the cart to `/odeme`, enters delivery details, and pays. The cart stays in the browser
until the order is placed; the prices shown here are for display only, and the server
calculates the order price (ZEY-25).

# ZEY-23: The customer enters contact and address details and sees the order summary

Issue: #40 · Jira: ZEY-23 · Sketch: `docs/features/design/sketches/05-checkout.png`

The cart page gets an "Ödemeye geç" link to `/odeme`. There the customer fills in a delivery
form and sees an order summary of their cart. Nothing is sent anywhere yet: the
"Siparişi tamamla" button and payment are ZEY-25, field errors are ZEY-24.

## Interface

### The route

`app/(magaza)/odeme/page.tsx`, inside the shop route group, so it gets the same header as the
cart page. `CheckoutPage` renders `CheckoutContents` inside a `main`, the same way `CartPage`
renders `CartContents`. It fetches nothing.

### `DeliveryForm`

`src/components/DeliveryForm.tsx`. No props.

| Label on the page | Input | `autocomplete` |
|---|---|---|
| Ad soyad | text | `name` |
| Telefon | `type="tel"` | `tel` |
| E-posta | `type="email"` | `email` |
| İl | text | `address-level1` |
| İlçe | text | `address-level2` |
| Açık adres | `textarea` | `street-address` |

- **Why `autocomplete`:** the browser can fill in a saved address, and the right keyboard opens
  on a phone (`tel`, `email`).
- **Why E-posta is here:** the order summary will always be sent by email (T3.6), so it is
  required from the start.
- İl and İlçe are free text; there is no province list.
- **The fields keep what is typed themselves** (uncontrolled inputs): nothing in this ticket
  reads the values. ZEY-24 moves them up into the page, as one `DeliveryDetails` object, when
  its field rules need them; ZEY-25 sends that object with the order.
- A `form` with the heading "Teslimat bilgileri" (`h2`), `noValidate` so the browser does not
  show its own bubbles (ZEY-24 shows ours).
- One visible `label` per field, linked to its input by `htmlFor`/`id`.
- From the sketch: Ad soyad, Telefon, E-posta, then İl and İlçe side by side, then Açık adres.
  On a narrow screen İl and İlçe stack.
- No submit button (ZEY-25).

### `OrderSummary`

`src/components/OrderSummary.tsx`. Props: `lines: CartLine[]`. It shows, it does not change.

- The heading "Sipariş özeti" (`h2`).
- A list, one item per line in the cart's order: `"<name> <amount> × <quantity>"` on the left
  (e.g. "Çiğ Badem 500 g × 2", the amount through `formatAmount`), the line total on the right
  (`formatPrice(fromKurus(lineTotal(line)))`).
- Below, "Toplam" and `formatPrice(fromKurus(cartTotal(lines)))`.
- The same helpers as the cart page, so the two pages cannot show different amounts.

### `CheckoutContents`

`src/components/CheckoutContents.tsx`, `"use client"` (it reads the cart).

- A "Siparişi tamamla" heading (`h1`), always.
- **Before the read** (`loaded` is `false`): only the heading, as on the cart page.
- **After the read, empty cart:** "Sepetiniz boş" and a "Sepete dön" link to `/sepet`. No form,
  no summary.
- **After the read, with lines:** `DeliveryForm` and `OrderSummary`, side by side on a wide
  screen (form on the left, as in the sketch), the form first on a narrow one.
- The form values are not saved: a reload empties the form (personal details are not stored in
  the browser).

### `CartContents`: "Ödemeye geç"

Under the total, when the cart has lines: an "Ödemeye geç" link to `/odeme`. It is a link, not a
button, because it goes to another page.

## Preconditions and postconditions

**Before:**
- The cart provider, the saved cart (ZEY-18) and the cart page (ZEY-20) work as before.

**After the cart has been read, on `/odeme` with a non-empty cart:**
- Each of the six fields shows what the customer typed into it.
- The summary has one item per cart line; its line totals and total equal the cart page's.

## Invariants

- The checkout page never talks to the backend and never changes the cart.
- The form values are never written to `localStorage` or anywhere else.
- No price is calculated with a floating-point number (the cart page's rule).

## Failure modes

- **An empty cart** (never filled, or emptied because the record was broken, ZEY-18): the
  empty message and the link back; there is nothing to order.
- **`localStorage` cannot be used:** the page shows the cart held in memory, as on the cart page.
- **The customer reloads:** the form is empty again. This is on purpose (see Invariants).

## Known limits

- **Prices from the record:** like the cart page, the summary shows the prices the lines were
  saved with. The server calculates the order price in ZEY-25.
- **Nothing is checked yet:** any text is accepted in any field until ZEY-24.

## Checks

`CartContents` (inside a `CartProvider`, the cart saved in `localStorage` before rendering):
- **Given** a cart with lines **Then** the page shows an "Ödemeye geç" link to `/odeme`.
- **Given** an empty cart **Then** there is no "Ödemeye geç" link.

`CheckoutContents` (same set-up; the cart: `"450.00"` × 1, `"1950.00"` × 1, almonds
`"320.00"` × 2, as in ZEY-20):
- **Given** the three lines **Then** the page shows the heading "Siparişi tamamla", the sections
  "Teslimat bilgileri" and "Sipariş özeti", and the fields Ad soyad, Telefon, E-posta, İl, İlçe
  and Açık adres, each found by its label.
- **Given** the three lines **When** the customer types into a field (each of the six) **Then**
  that field shows what was typed.
- **Given** the three lines **Then** the summary lists three items, one of them
  "Çiğ Badem 500 g × 2" with `640,00 TL`, and shows "Toplam" with `3.040,00 TL`.
- **Given** an empty cart **Then** the page shows "Sepetiniz boş" and a "Sepete dön" link to
  `/sepet`, and no form fields.

## Must still work

- The ZEY-20, ZEY-21 and ZEY-22 checks on the cart page.
- `npm test`, `npm run lint` and `npm run build` in `frontend/`; the build lists `/odeme`
  next to `/sepet`, `/urunler` and `/urunler/[slug]`.

## Out of scope

The "Siparişi tamamla" button, the card field and payment (ZEY-25); field rules and error
messages (ZEY-24); sending the email (T3.6); keeping the form values; a province list; shipping
cost; the site footer.

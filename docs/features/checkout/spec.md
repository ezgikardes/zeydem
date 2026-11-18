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

# ZEY-24: The customer sees an error message on a missing or wrong field

Issue: #42 · Jira: ZEY-24 · Sketch: `docs/features/design/sketches/05-checkout.png` (Alan hataları)

The ZEY-23 form accepts anything. Here each field gets a rule, and the customer sees a message
under a field as soon as they leave it wrong. The rules are a plain function, so the
"Siparişi tamamla" button in ZEY-25 checks all fields with the same code.

## Interface

### `src/lib/delivery.ts` (no React)

```ts
export type DeliveryDetails = {
  name: string; phone: string; email: string;
  city: string; district: string; address: string;
};
export const EMPTY_DELIVERY: DeliveryDetails; // six empty strings
export type DeliveryErrors = Partial<Record<keyof DeliveryDetails, string>>;
export function deliveryErrors(details: DeliveryDetails): DeliveryErrors;
```

`deliveryErrors` returns one message for each wrong field and nothing for a right one; an empty
object means every field is right. It does not change `details`.

| Field | Rule | Empty | Wrong |
|---|---|---|---|
| `name` | not empty | "Ad soyad gerekli." | – |
| `phone` | spaces, dashes and brackets removed, it is `5xxxxxxxxx`, `05xxxxxxxxx` or `+905xxxxxxxxx` | "Telefon numarası gerekli." | "Telefon numarası 05xx xxx xx xx biçiminde olmalı." |
| `email` | no space inside, one "@", at least one dot after it, text around each | "E-posta gerekli." | "E-posta adresi eksik görünüyor." |
| `city` | not empty | "İl gerekli." | – |
| `district` | not empty | "İlçe gerekli." | – |
| `address` | not empty | "Açık adres gerekli." | – |

- **Empty** means nothing but spaces. Spaces at the start and end are ignored for every rule
  (an address book or a paste often adds one).
- **Why one message for short and long numbers:** "eksik" (missing) is wrong for a number with
  too many digits; the expected shape fits both. Extra digits are not blocked while typing,
  because a cut-off paste would leave a number that looks right but is not.
- **The email rule is loose on purpose:** whether the address exists is only known once an email
  is sent (T3.6); the rule only catches a half-typed address.
- **The values are not cleaned:** the form keeps what the customer typed. Cleaning the number for
  sending is ZEY-25's.

### `CheckoutContents`: the values move up

`CheckoutContents` holds the six values as one `DeliveryDetails` (`useState`, starting from
`EMPTY_DELIVERY`) and passes them to `DeliveryForm`. ZEY-25 sends this object with the order.
The values are still not saved anywhere (ZEY-23 invariant).

### `DeliveryForm`: controlled fields and messages

Props: `details: DeliveryDetails`, `onChange: (details: DeliveryDetails) => void`. Each field
shows its value from `details` and calls `onChange` with that one field changed.

- **Which fields have been left:** `DeliveryForm` remembers each field the customer has left at
  least once (`onBlur`). This is display state, not data, so it stays in the form; ZEY-25 may
  move it up when the button has to show every message at once.
- **Shown message** = the field has been left **and** `deliveryErrors(details)` has a message
  for it. The errors are worked out from the values on every render, so a left field is checked
  again on every change: the message disappears as soon as the field is right, and changes when
  the kind of mistake changes.
- **Markup of a field with a shown message:**
  - the input has `aria-invalid="true"` and `aria-describedby` pointing at the message;
  - the message is a `p` under the input, with the id `<input id>-error`
    (e.g. `delivery-phone-error`);
  - the input has a red border, the message is red text.
- A field without a shown message has neither attribute and no message element.
- No asterisk on the labels: all six fields are required, so a mark would not tell anything apart.

### Colour

`--error: #b3261e` in `src/styles/tokens.css`: the text and border of a field error. It reads on
`--surface` and `--bg` above the 4.5:1 contrast for small text.

## Preconditions and postconditions

**Before:** the ZEY-23 page works: the empty cart message, the form, the summary.

**After the customer leaves a field:**
- If the field's value breaks its rule, its message is under it and the field is marked invalid.
- If the value keeps the rule, there is no message.

**After the customer changes a left field:** the message matches the new value.

## Invariants

- A field the customer has not left shows no message, whatever its value.
- The message shown for a field is always `deliveryErrors(details)` for that field: the page has
  one source of rules.
- The form values are never written to `localStorage` or anywhere else (ZEY-23).

## Failure modes

- **The customer never leaves a field** (types and goes straight to another tab): no message;
  the button in ZEY-25 checks every field anyway.
- **An address book fills every field at once:** no message until a field is left; a wrong
  autofilled value shows its message when the customer passes through that field.

## Known limits

- **Landlines and foreign numbers are refused:** the parcel company texts a mobile number.
- **The email can still bounce:** a well-formed address can belong to no one.
- **Nothing stops the order yet:** the messages only inform; ZEY-25 keeps the button from sending
  a wrong form.

## Checks

`deliveryErrors` (`src/lib/delivery.test.ts`), starting from a right set of details
(`"Ayşe Yılmaz"`, `"0532 123 45 67"`, `"ayse@ornek.com"`, `"Manisa"`, `"Akhisar"`,
`"Zeytinli Mah. 12. Sok. No: 4"`):
- **Given** the right details **Then** there are no errors.
- **Given** each of Ad soyad, İl, İlçe, Açık adres empty or only spaces **Then** that field's
  "… gerekli." message, and no other.
- **Given** an empty phone **Then** "Telefon numarası gerekli."
- **Given** the phone `"5321234567"`, `"05321234567"`, `"+90 532 123 45 67"`,
  `"(0532) 123-45-67"` **Then** no phone error.
- **Given** the phone `"0532 12"`, `"0532 123 45 678"`, `"0212 123 45 67"` (a landline)
  **Then** "Telefon numarası 05xx xxx xx xx biçiminde olmalı."
- **Given** an empty email **Then** "E-posta gerekli."
- **Given** the email `"ayse@ornek"`, `"ayseornek.com"`, `"ayse @ornek.com"` **Then**
  "E-posta adresi eksik görünüyor."; **given** `" ayse@ornek.com "` **Then** no email error.

`CheckoutContents` (the three-line cart of ZEY-23):
- **Given** the page **When** the customer leaves Ad soyad empty **Then** "Ad soyad gerekli." is
  under it, the field has `aria-invalid="true"` and is described by the message.
- **Given** the page **When** the customer types into Telefon without leaving it **Then** no
  message.
- **Given** the page **When** the customer types `"0532 12"` into Telefon and leaves it **Then**
  "Telefon numarası 05xx xxx xx xx biçiminde olmalı." **When** they complete it to
  `"0532 123 45 67"` **Then** the message is gone and the field is not marked invalid.
- **Given** the page **When** the customer types `"ayse@ornek"` into E-posta and leaves it
  **Then** "E-posta adresi eksik görünüyor."

## Must still work

- The ZEY-23 checks: each field shows what was typed (now through `details`), the summary, the
  empty cart.
- The cart page checks (ZEY-20, ZEY-21, ZEY-22).
- `npm test`, `npm run lint` and `npm run build` in `frontend/`.

## Out of scope

Checking every field and focusing the first wrong one when the button is pressed, and the
button itself (ZEY-25); server-side validation and the 400 error shape (ZEY-25 contract);
cleaning the number for sending (ZEY-25); sending the email (T3.6); a province/district list;
landline numbers; blocking extra digits while typing.

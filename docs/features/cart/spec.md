# Cart

The cart tickets (ZEY-17..22) share this spec; each adds a section. The cart lives in the
browser. The prices it holds are for display only: when an order is placed, the server
recalculates them (ZEY-25).

# ZEY-17: A visitor adds a product to the cart from its page, and the count in the header goes up

Issue: #28 · Jira: ZEY-17 · Sketch: `docs/features/design/sketches/03-product-detail.png`

On a product page the visitor picks a quantity and presses "Sepete ekle". The header above every
`/urunler` page shows "Sepet (n)", where `n` is how many items the cart holds. The cart is kept
in memory only: moving between pages with the site's own links keeps it, a reload empties it
(keeping it is ZEY-18).

## Interface

### The cart line

The cart is a list of lines, one per product. A line copies what the cart page (ZEY-20) will
show, so that page does not have to ask the backend again.

| Field | Type | Example | Meaning |
|---|---|---|---|
| `id` | number | `1` | The product's id. It tells lines apart, and the order (ZEY-25) sends it |
| `slug` | string | `"naturel-sizma-zeytinyagi-1l"` | For the link back to the product page |
| `name` | string | `"Natürel Sızma Zeytinyağı"` | As in the product |
| `photoUrl` | string | `"/products/zeytinyagi-1l.png"` | As in the product |
| `amount`, `unit` | number, string | `1`, `"L"` | As in the product |
| `price` | string | `"450.00"` | As in the product; for display only, never added up for payment |
| `quantity` | number | `2` | How many of this product, a whole number from 1 to 10 |

- **Why `id` and not `slug`:** the id never changes; a slug may be corrected one day
  (product-detail spec). The product-detail spec already names the id as the cart's identifier.
- The type is `CartLine` in `src/lib/cart.ts`, next to the reducer.

### The reducer

`cartReducer(lines, action)` in `src/lib/cart.ts`: a plain function, no React, so it is tested
without rendering anything. It never changes the list it is given; it returns a new one.

One action in this ticket:

```ts
{ type: "add", product: Product, quantity: number }
```

- **A product not yet in the cart:** a new line is added at the end, with the given quantity.
- **A product already in the cart** (same `id`): no new line; its quantity becomes the sum,
  but never more than 10. The other fields of the line are left as they were.
- `cartCount(lines)` returns the sum of the quantities: what the header shows.

### `CartProvider` and `useCart()`

- `CartProvider` (`src/components/CartProvider.tsx`, `"use client"`) holds the lines with
  `useReducer(cartReducer, [])` and gives them, and an `add(product, quantity)` function, to the
  components below it through React Context.
- It sits in the root layout (`app/layout.tsx`), around `body`'s content, because the cart page
  (ZEY-20) will live outside `/urunler`. A layout is not rendered again when the visitor moves
  between pages with `Link`, so the cart survives the move.
- `useCart()` returns `{ lines, count, add }`. Called outside a `CartProvider`, it throws: a
  missing provider shows up as an error at once, not as a cart that silently stays at 0.

### `SiteHeader`

`src/components/SiteHeader.tsx`, `"use client"` (it reads the cart). Rendered by
`app/urunler/layout.tsx` above the page, inside the design system. From the sketch:

- on the left, "Zeydem" as a link to `/`
- on the right, "Ürünler" as a link to `/urunler`, then "Sepet (n)"
- "Sepet (n)" is plain text until the cart page exists (ZEY-20)
- everything sits in a `header`, the links in a `nav` labelled "Ana menü"

The design system calls this component `Header`. The home page already has a `Header.jsx`, so
this one is `SiteHeader` until ZEY-34 moves the home page onto the design system.

### `QuantityInput`

`src/components/QuantityInput.tsx`, `"use client"`. Props: `value`, `onChange(next)`.

- A "−" button, the number, a "+" button, under the label "Adet".
- "−" is disabled at 1, "+" is disabled at 10. The buttons are labelled "Azalt" and "Artır" for
  screen readers, since "−" and "+" alone say little.
- It holds no state: the parent keeps the value. That is what lets it be tested on its own.

### `AddToCart`

`src/components/AddToCart.tsx`, `"use client"`. Prop: `product`.

- Keeps the chosen quantity (starts at 1) and shows `QuantityInput` and a "Sepete ekle" button
  (primary button: `--bg` on `--brand`).
- Pressing the button calls `add(product, quantity)`. The picker keeps its value afterwards.
- `ProductDetail` renders it under the description (sketch 03). `ProductDetail` itself stays a
  server component; only `AddToCart` and what is inside it run in the browser.

## Preconditions and postconditions

**Before:**
- The product page has loaded a product from the backend (ZEY-13).

**After pressing "Sepete ekle" with quantity `q`:**
- The cart has exactly one line with that product's `id`, and its quantity is
  `min(old quantity + q, 10)` (old quantity 0 for a new product).
- The header shows the new sum.

## Invariants

- At most one line per `id`.
- A line holds exactly the fields of the table, whatever else the product carries.
- Every line's quantity is a whole number from 1 to 10.
- The cart never talks to the backend in this ticket, and nothing in it is sent anywhere.
- Components do not fetch; the product reaches `AddToCart` as a prop (frontend rules).

## Failure modes

- **A quantity that would pass 10:** the line stops at 10. No message in this ticket; the header
  simply goes up by less than the visitor asked.
- **A quantity outside 1–10 from the picker:** cannot happen, the buttons are disabled at the
  limits. The reducer does not check it again.
- **A reload or a new tab:** the cart is empty. Expected until ZEY-18.
- **The backend does not answer:** no new case. The product page fails as before (ZEY-15) and
  shows no "Sepete ekle".

## Checks

Reducer:
- **Given** an empty cart **When** 2 of product 1 are added **Then** the cart has one line,
  product 1, quantity 2, with the product's slug, name, photo, amount, unit and price.
- **Given** a cart with 2 of product 1 **When** 1 more of product 1 is added **Then** there is
  still one line, quantity 3.
- **Given** a cart with 2 of product 1 **When** 1 of product 3 is added **Then** there are two
  lines and `cartCount` is 3.
- **Given** a cart with 8 of product 1 **When** 5 more are added **Then** the quantity is 10.
- **Given** an empty cart **When** a product with its description is added (as the product page
  sends it) **Then** the line has only the fields of the table above, no `description`.
- **Given** a cart **When** something is added **Then** the list passed in has not changed.

`QuantityInput`:
- **Given** the value 1 **Then** "Azalt" is disabled.
- **Given** the value 10 **Then** "Artır" is disabled.
- **Given** the value 3 **When** "Artır" is pressed **Then** `onChange` gets 4; **When**
  "Azalt" is pressed **Then** `onChange` gets 2.

Together (`SiteHeader` and `AddToCart` inside one `CartProvider`):
- **Given** an empty cart **Then** the header shows "Sepet (0)", "Zeydem" links to `/` and
  "Ürünler" links to `/urunler`.
- **Given** an empty cart **When** the quantity is set to 2 and "Sepete ekle" is pressed
  **Then** the header shows "Sepet (2)"; **When** "Sepete ekle" is pressed again with 1 **Then**
  "Sepet (3)".
- **Given** no `CartProvider` **When** `useCart()` is called **Then** it throws.

Live:
- **Given** the deployed site **When** I add 2 of one product and 1 of another, then move
  between the products with the site's links **Then** the header keeps showing "Sepet (3)".

## Must still work

- `ProductDetail` shows the same name, photo, price, description and breadcrumb: its existing
  tests, now rendered inside a `CartProvider`.
- `/urunler` shows the same cards, now under the header.
- The home page `/` keeps its own header and looks the same: the provider adds no markup.
- `npm test`, `npm run lint` and `npm run build` in `frontend/`.

## Out of scope

Keeping the cart after a reload (ZEY-18), stock and "Tükendi" (ZEY-19), the cart page and
"Sepet (n)" as a link (ZEY-20), changing quantities and removing lines in the cart (ZEY-21,
ZEY-22), a message when the limit of 10 is reached, a confirmation after adding, the
Hakkımızda/İletişim links and the header on the whole site (ZEY-34), adding from a list card.

# ZEY-18: A visitor's cart is not lost when the page reloads

Issue: #30 · Jira: ZEY-18

The cart is saved in the browser's `localStorage` every time it changes and read back when the
site opens. A reload, a new tab or closing and reopening the browser keeps the cart. Nothing
leaves the browser.

## Interface

### The record

- **Key:** `zeydem-cart-v1`. The `v1` is there so that a later change to the line's shape can
  use a new key and leave old records alone, instead of misreading them.
- **Value:** the cart lines as a JSON array, each line with exactly the fields of the ZEY-17
  table, in the cart's order. An empty cart is saved as `[]`.

```json
[{"id":1,"slug":"naturel-sizma-zeytinyagi-1l","name":"Natürel Sızma Zeytinyağı",
  "photoUrl":"/products/zeytinyagi-1l.png","amount":1,"unit":"L","price":"450.00","quantity":2}]
```

### `loadCart()` and `saveCart(lines)`

In `src/lib/cartStorage.ts`, with `CART_KEY`. Plain functions, no React.

- `loadCart(): CartLine[]` reads the record and returns its lines. It returns `[]` when there is
  no record, when the value is not valid JSON, when it is not an array, or when **any** line
  breaks the rules below. One broken line empties the whole cart: keeping half a cart would
  look like a bug to the visitor, an empty one looks like a fresh start.
- A line is valid when `id` and `amount` are numbers, `slug`, `name`, `photoUrl`, `unit` and
  `price` are strings, `quantity` is a whole number from 1 to 10, and no other line has the same
  `id`. Fields beyond the table are dropped, so a read line has exactly the table's fields.
- `saveCart(lines)` writes the lines under `CART_KEY`.
- Neither throws. If `localStorage` cannot be reached or refuses (private window, site data
  blocked, storage full), `loadCart()` returns `[]` and `saveCart()` does nothing.

### The reducer

One new action:

```ts
{ type: "load", lines: CartLine[] }
```

It replaces the cart with the given lines. It is how the provider puts the saved cart in place.

### `CartProvider`

- **Reading:** after the first render, in an effect, the provider calls `loadCart()` and
  dispatches `load`. Not earlier: the page is first rendered on the server, which has no
  `localStorage`, and the browser's first render must match it. So the header shows
  "Sepet (0)" for a moment, then the saved count. This is accepted.
- **Writing:** every time the lines change, the provider calls `saveCart(lines)`, but only after
  the read. Writing before it would save the empty starting cart over the saved one.
- Right after the read the cart is written once, so a broken record is replaced by `[]` at once.

## Preconditions and postconditions

**Before:**
- The provider from ZEY-17 is in the root layout.

**After any change to the cart (once the saved cart has been read):**
- `zeydem-cart-v1` holds the same lines as the cart, if `localStorage` can be used.

**After the site opens:**
- The cart holds the saved lines if the record is valid, otherwise it is empty and the record
  says `[]`.

## Invariants

- Everything in ZEY-17 still holds, also for a cart read from storage: one line per `id`, the
  table's fields only, quantities from 1 to 10.
- The record is never written before it has been read.
- A problem with `localStorage` never shows up as an error on the page.

## Failure modes

- **No record** (first visit): the cart starts empty.
- **A broken record** (not JSON, not an array, a line that breaks the rules): the cart starts
  empty and the record is overwritten with `[]`.
- **`localStorage` cannot be used:** the cart works in memory, as in ZEY-17; a reload empties it.
- **Storage full:** the write is skipped; the cart in memory is right, the saved one is older.

## Known limits

- **Two tabs:** each tab reads the record once, when it opens. With two tabs open, what one tab
  adds is overwritten by the other tab's next change. Live sync between tabs is out of scope.
- **Old prices:** the saved line keeps the price it was added with. It is for display only; the
  server calculates the order price (ZEY-25).
- **No expiry:** a saved cart stays until the visitor changes it or clears the site's data.
- **The first moment:** the header shows "Sepet (0)" until the read, as said above.

## Checks

`loadCart()` and `saveCart()`:
- **Given** no record **Then** `loadCart()` returns `[]`.
- **Given** a cart saved with `saveCart()` **Then** `loadCart()` returns the same lines.
- **Given** a record that is not valid JSON **Then** `loadCart()` returns `[]`.
- **Given** a record that is JSON but not an array **Then** `loadCart()` returns `[]`.
- **Given** a record with one valid line and one line whose quantity is 11 **Then** `loadCart()`
  returns `[]`. The same for a quantity of 0, a missing field, a price that is a number and two
  lines with the same `id`.
- **Given** a valid line with an extra field **Then** the line read back has no extra field.
- **Given** `localStorage` throws **Then** `loadCart()` returns `[]` and `saveCart()` does not
  throw.

Reducer:
- **Given** a cart with one line **When** `load` with two other lines **Then** the cart is those
  two lines.

`CartProvider` (with `SiteHeader` and `AddToCart`, as in ZEY-17):
- **Given** a saved record with 2 of a product **When** the provider opens **Then** the header
  shows "Sepet (2)".
- **Given** an empty `localStorage` **When** 2 are added **Then** the record holds that one line
  with quantity 2.
- **Given** a broken record **When** the provider opens **Then** the header shows "Sepet (0)" and
  the record is `[]`.

Live:
- **Given** the deployed site **When** I add 2 products and reload **Then** the header shows
  "Sepet (2)"; the same after closing the browser and opening the site again.
- **Given** the deployed site **When** I break `zeydem-cart-v1` in the developer tools and
  reload **Then** the page shows no error and "Sepet (0)".

## Must still work

- The ZEY-17 checks. Their tests clear `localStorage` before each test, so one test's cart does
  not leak into the next.
- `npm test`, `npm run lint` and `npm run build` in `frontend/`.

## Out of scope

Live sync between tabs, saving the cart to an account or the server, updating saved prices
(ZEY-25), a cart that expires, a message when a broken record is thrown away.

# ZEY-20: A visitor sees the products, quantities and total on the cart page

Issue: #32 · Jira: ZEY-20 · Sketch: `docs/features/design/sketches/04-cart.png`

`/sepet` shows what is in the cart: one row per line and the total at the bottom. "Sepet (n)"
in the header becomes a link to it. Nothing can be changed on the page yet (ZEY-21, ZEY-22).
The prices come from the saved cart; the page does not ask the backend.

## Interface

### Route group `(magaza)`

The product pages and the cart page share one header, so both go into a common folder that is
not part of the URL.

- **Why:** in Next.js a folder is a part of the URL, and a folder's `layout.tsx` wraps every
  page under it. The header lives in `app/urunler/layout.tsx`, so a page at `app/sepet/` would
  not get it. Putting the header in the root layout would give the home page two headers;
  copying the layout would keep the same code in two places.
- **How:** a folder whose name is in parentheses is a *route group*: Next.js leaves it out of
  the URL. `magaza` (shop) is only a label for the shopping pages; visitors never see it.
- **Refactor:** in its own commit, with no change in behaviour.

```
app/
├── layout.tsx              wraps every page (CartProvider), unchanged
├── page.tsx                /  (outside the group, keeps its own header until ZEY-34)
└── (magaza)/               not in the URL
    ├── layout.tsx          design system + SiteHeader (was app/urunler/layout.tsx)
    ├── urunler/            /urunler, /urunler/<slug>  (same URLs)
    └── sepet/page.tsx      /sepet  (new)
```

### Money: `src/lib/money.ts`

A price is text with up to two decimals (decision 005). To add prices up, the page turns them
into whole kuruş, adds and multiplies whole numbers, and turns the result back into text.

- `PRICE_PATTERN`: digits, optionally a dot and one or two digits. `"450.00"`, `"400.5"` and
  `"400"` match; `"abc"`, `"4.5.0"`, `"-1"` and `""` do not.
- `toKurus(price: string): number`: `"450.00"` → `45000`, `"400.5"` → `40050`, `"400"` →
  `40000`. Built from the digits as text, never with `parseFloat` or `Number(price) * 100`
  (`Number("4.35") * 100` is `434.99999999999994`). Throws for a price that does not match
  `PRICE_PATTERN`: a broken price here is a bug, and a loud one is found sooner.
- `fromKurus(kurus: number): string`: `304000` → `"3040.00"`, the same shape the backend sends,
  so the result goes through the existing `formatPrice`. One formatter for every price on the
  site.

Whole numbers are exact in JavaScript up to 2^53 (about 9 × 10^15). The largest line is
10 × 99.999.999,99 TL (decision 005) = about 10^11 kuruş, far below it.

### Totals: `src/lib/cart.ts`

- `lineTotal(line): number` = `toKurus(line.price) × line.quantity`, in kuruş.
- `cartTotal(lines): number` = the sum of the line totals, in kuruş; `0` for an empty cart.

### The saved price: `loadCart()`

One rule is added to the ZEY-18 line rules: `price` must match `PRICE_PATTERN`. A line with a
price like `"abc"` empties the cart, like any other broken line. So every price that reaches
`toKurus` is valid.

### `CartProvider` and `useCart()`

`useCart()` also returns `loaded`: `false` until the saved cart has been read (ZEY-18), then
`true`. The page needs it to tell "not read yet" from "empty".

### `CartPage`

`src/components/CartPage.tsx`, `"use client"` (it reads the cart). `app/(magaza)/sepet/page.tsx`
renders it inside a `main`. From the sketch:

- A "Sepetim" heading (`h1`), always.
- **Before the read** (`loaded` is `false`): only the heading. The server renders this too, so
  the visitor never sees a wrong cart for a moment.
- **After the read, empty cart:** only the heading. The "Sepetiniz boş" message is ZEY-22.
- **After the read, with lines:** a table with the columns "Ürün", "Birim fiyat", "Adet",
  "Toplam". One row per line, in the cart's order:
  - **Ürün:** the photo (`alt` = the name), the name as a link to `/urunler/<slug>`, and under
    it the amount (`formatAmount`, e.g. `1 L`).
  - **Birim fiyat:** `formatPrice(line.price)`.
  - **Adet:** the quantity as a number (the "−"/"+" buttons are ZEY-21).
  - **Toplam:** `formatPrice(fromKurus(lineTotal(line)))`.
- Under the table, "Toplam" and `formatPrice(fromKurus(cartTotal(lines)))`.
- A table because the content is a table: rows and columns that belong together. Screen readers
  read each cell with its column name.

### `SiteHeader`

"Sepet (n)" becomes a `Link` to `/sepet`, same text, same style.

## Preconditions and postconditions

**Before:**
- The cart provider (ZEY-17) and the saved cart (ZEY-18) work as before.

**After the cart has been read, on `/sepet`:**
- There is one row per cart line, with that line's values.
- The total shown is the exact sum of quantity × price over all lines.

## Invariants

- No price is calculated with a floating-point number; `Number()` is still used only inside
  `formatPrice`, to display.
- The page never talks to the backend.
- Nothing about the cart is shown before it has been read.

## Failure modes

- **A broken price in the saved cart:** `loadCart()` empties the cart (rule above); the page
  shows only the heading.
- **`toKurus` gets a price that does not match:** it throws. It cannot happen through the site:
  prices come from the backend or from a checked record.
- **A photo that does not load:** the browser shows the `alt` text; the row stays.
- **`localStorage` cannot be used:** the page shows the cart held in memory, as in ZEY-18.

## Known limits

- **Prices from the record:** the page shows the price the line was saved with. If it was edited
  by hand, the visitor sees that price and a total made from it. The order price is calculated
  by the server (ZEY-25), so this changes only what is shown in that browser.
- **The first moment:** until the read, only the heading is shown; the header shows "Sepet (0)"
  as in ZEY-18.

## Checks

`toKurus()` and `fromKurus()`:
- **Given** `"450.00"` **Then** `toKurus` returns `45000`; `"400.5"` → `40050`; `"400"` →
  `40000`; `"4.35"` → `435`.
- **Given** `"abc"`, `"4.5.0"`, `"-1"` or `""` **Then** `toKurus` throws.
- **Given** `304000` **Then** `fromKurus` returns `"3040.00"`; `5` → `"0.05"`; `0` → `"0.00"`.

Totals:
- **Given** `"450.00"` × 1, `"1950.00"` × 1 and `"320.00"` × 2 **Then** `lineTotal` of the
  almonds is `64000` and `cartTotal` is `304000`, which is shown as `3.040,00 TL`.
- **Given** an empty cart **Then** `cartTotal` is `0`.

`loadCart()`:
- **Given** a record with one line whose price is `"abc"` **Then** `loadCart()` returns `[]`.
- **Given** a record with one line whose price is `"400"` **Then** the line is read.

`CartPage` (inside a `CartProvider`, the cart saved in `localStorage` before rendering):
- **Given** the three lines above **Then** the table has three rows; the almond row shows
  "Çiğ Badem", `500 g`, `320,00 TL`, `2` and `640,00 TL`; the page shows "Toplam" and
  `3.040,00 TL`.
- **Given** the three lines **Then** "Çiğ Badem" links to `/urunler/<its slug>` and its photo has
  the alt text "Çiğ Badem".
- **Given** an empty cart **Then** the page shows "Sepetim" and no table.

`SiteHeader`:
- **Given** any cart **Then** "Sepet (n)" is a link to `/sepet`.

Live:
- **Given** the deployed site **When** I add 1 L olive oil, 5 L olive oil and 2 almonds and click
  "Sepet (4)" **Then** `/sepet` shows three rows and "Toplam 3.040,00 TL", under the same header.
- **Given** the deployed site **When** I reload `/sepet` **Then** the same rows come back, and
  no other cart flashes before them.

## Must still work

- `/urunler` and `/urunler/<slug>`: same URLs, same header, same pages. Their tests move with
  the folder and pass unchanged, apart from import paths.
- The ZEY-17 and ZEY-18 checks.
- `npm test`, `npm run lint` and `npm run build` in `frontend/`; the build lists `/sepet`,
  `/urunler` and `/urunler/[slug]`.

## Out of scope

Changing quantities (ZEY-21), "Çıkar" and the empty cart message (ZEY-22), "Ödemeye geç" and
payment (F3), shipping cost, discounts, updating saved prices (the server calculates the order
price, ZEY-25), the site footer, the header on the home page (ZEY-34).

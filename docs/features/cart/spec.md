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
- **Given** a cart **When** something is added **Then** the list passed in has not changed.

`QuantityInput`:
- **Given** the value 1 **Then** "Azalt" is disabled and "Artır" is enabled.
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

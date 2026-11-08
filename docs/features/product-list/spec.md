# ZEY-12: A visitor sees the product list with name, photo and price

Issue: #20 · Jira: ZEY-12 · Sketch: `docs/features/design/sketches/02-product-list.png`

The first ticket with a backend. The visitor opens `/urunler` and sees the products on sale, read
from the database. The exact request and response live in the OpenAPI contract
(`contracts/openapi.yaml`, shared by both sides, one file for every endpoint); this spec says what
they mean and how they must behave. No library checks answers against that file: the backend
test checks the exact fields and their types, and the two are kept in step by hand.

## Interface

### Backend: `GET /products`

No parameters. Answers `200` with a JSON array of every product, ordered by `id`.

| Field | Type | Example | Meaning |
|---|---|---|---|
| `id` | integer | `1` | Stable identifier |
| `name` | string | `"Natürel Sızma Zeytinyağı"` | Display name, Turkish |
| `photoUrl` | string | `"/products/zeytinyagi-1l.png"` | Path of the photo on the website (see below) |
| `price` | string | `"450.00"` | TL, always two decimals, `.` as separator |
| `amount` | number | `1`, `0.5` | How much is in the package, up to two decimals |
| `unit` | string | `"L"` | One of `L`, `g`, `kg` |

No other field appears. In particular, no database column name and no `createdAt` or similar.

- **Why `price` is a string:** a JSON number is read by JavaScript as a floating-point number,
  which cannot hold every decimal exactly. A string carries the value as written; the frontend
  only formats it for display and never does arithmetic with it. Recorded in decision 005.
- **Why `photoUrl` is a path, not a full address:** the photos are files of the website, kept in
  `frontend/public/products/`. The backend stores only the path, so the same database works
  locally and live.
- **Why `amount` is a decimal already:** a 0,5 L bottle is common for olive oil. Hibernate adds
  missing tables and columns but never changes the type of an existing column, so moving from
  integer to decimal later would mean altering the live table by hand. It is `NUMERIC(8,2)` /
  `BigDecimal`, and a plain JSON number: nobody calculates with it.
- **An empty list is a valid answer** (`[]`): it means there are no products. What the visitor
  sees then is ZEY-14.

On error the backend answers with the matching HTTP status and a `ProblemDetail` body
(`Content-Type: application/problem+json`):

```json
{ "title": "Internal Server Error", "status": 500, "instance": "/products" }
```

No `type`: RFC 9457 reads a missing type as `about:blank`. Nothing else: no exception message,
no stack trace, no SQL.

### Frontend

- **`/urunler` page** (`app/urunler/page.tsx`): runs on the Next.js server, fetches
  `${BACKEND_URL}/products`, passes the list to `ProductGrid`. `BACKEND_URL` is a server-only
  environment variable (no `NEXT_PUBLIC_` prefix), so the browser never learns the address.
- **The page renders on every request** (`export const dynamic = "force-dynamic"`). A page that
  reads nothing from the request (no cookies, no URL parameters) is otherwise rendered once, by
  `npm run build`, and served as that file until the next deploy: a new product would not
  appear, and the build would need the backend to be awake. The cost: every visit asks the
  backend, so a sleeping Render instance makes the first visitor wait.
- **`ProductGrid({ products })`** lays out the cards; **`ProductCard({ product })`** shows the
  photo, name, amount with unit, and price. Neither fetches.
- **Display formats:**
  - amount in Turkish format without trailing zeros, joined to the unit with a space: `1 L`,
    `0,5 L`, `500 g`
  - price in Turkish format with two decimals: `"450.00"` → `450,00 TL`,
    `"1950.00"` → `1.950,00 TL`
  - the photo's `alt` text is the product name
- **Colours and fonts** come from the design system: the colours as CSS variables in one tokens
  file, Fraunces for headings and Inter for body through `next/font`. No component writes a
  colour value directly.

### Data

The product table is created by Hibernate from the `Product` entity. Prices are `NUMERIC(10,2)`
in the database and `BigDecimal` in Java (decision 005).

Sample data comes from a seed SQL file that runs at every start:

| id | name | amount | unit | price | photo |
|---|---|---|---|---|---|
| 1 | Natürel Sızma Zeytinyağı | 1 | L | 450.00 | `/products/zeytinyagi-1l.png` |
| 2 | Natürel Sızma Zeytinyağı | 5 | L | 1950.00 | `/products/zeytinyagi-5l.png` |
| 3 | Çiğ Badem | 500 | g | 320.00 | `/products/badem-500g.jpg` |

The rows have fixed ids; inserting a row whose id already exists does nothing. So restarting
the backend never duplicates them, and a product added to the database by hand is left alone.
The other side of the same rule: editing a sample row in the seed file later does not change a
row that already exists. Such a change is made in the database too.

There is no almond photo yet. `badem-500g.jpg` is a placeholder image under its final name, so
the real photo replaces the file and no row has to change.

## Preconditions and postconditions

**Before:**
- The database is reachable and the backend has started (schema created, seed run).
- `BACKEND_URL` is set on the Next.js server.

**After:**
- `GET /products` has not changed any data.
- Every product in the table is in the response, including ones added after the seed.

## Invariants

- The response contains only the contract fields.
- Prices are never a `double` or `float` anywhere in the backend.
- The seed never creates a second copy of a sample product.
- Controllers call services, services call repositories; a controller never uses a repository.
  Checked by an ArchUnit test (decision 004).
- The browser never calls the backend.

## Failure modes

- **Invalid input:** there is no input. Unknown query parameters are ignored.
- **The database does not answer:** the backend answers `500` with a `ProblemDetail`, as above.
  It does not retry.
- **The backend does not answer or answers an error:** the page's fetch fails and Next.js shows
  its default error page. The visitor-facing message ("Ürünler yüklenemedi…"), a wait limit and
  the check of the answer's shape are ZEY-15. Render's free plan may take 30–60 s to wake up;
  that delay is accepted here, not hidden.
- **A photo file is missing:** the card shows a broken image. Paths come from the database, so
  the build cannot catch this; the seed paths are checked by eye once, on the live site.

## Checks

Backend:
- **Given** the three sample products **When** `GET /products` is called **Then** the answer is
  `200`, an array of three, ordered by id, each with exactly the fields `id`, `name`, `photoUrl`,
  `price`, `amount`, `unit`, and the first one's price is `"450.00"`.
- **Given** the backend has started once **When** it starts again on the same database **Then**
  the table still holds three sample products.
- **Given** a product added to the table by hand **When** `GET /products` is called **Then** it
  is in the answer.
- **Given** the database cannot be read **When** `GET /products` is called **Then** the answer is
  `500` with `Content-Type: application/problem+json`, and the body has no exception message,
  stack trace or SQL.
- **Given** a class in the controller package that uses the repository package directly **When**
  the backend tests run **Then** the ArchUnit test turns red and names that class.

Frontend:
- **Given** a list of products as props **When** `ProductGrid` renders **Then** each card shows
  the name, `1 L`, `450,00 TL`, and an image whose `alt` is the name.
- **Given** the amounts `1`, `0.5` and `500` **When** they are formatted with their units
  **Then** the results are `1 L`, `0,5 L` and `500 g`.
- **Given** the price `"1950.00"` **When** it is formatted **Then** the result is `1.950,00 TL`.
- **Given** the backend answers with a list **When** the `/urunler` page renders **Then** it has
  called `${BACKEND_URL}/products` and shows a card per product.

Live:
- **Given** the deployed site **When** I open `/urunler` **Then** I see the three sample products.
- **Given** a product added to the Neon database **When** I reload `/urunler` **Then** I see it.

## Must still work

- The home page `/` looks as it does today: checked by its existing tests and by eye.
- `npm test`, `npm run lint` and `npm run build` in `frontend/`; `npm run build` must not need
  the backend.

## Out of scope

The product detail page (ZEY-13), "Henüz ürün yok" (ZEY-14), the visitor-facing error message
(ZEY-15), the "Sepete ekle" button and the header cart count (ZEY-17), stock and "Tükendi"
(ZEY-19), the new home page and header (ZEY-34), Docker locally (ZEY-37), adding or editing
products from the interface, price per litre or kilo.

# ZEY-13: A visitor clicks a product and sees its detail page

Issue: #22 · Jira: ZEY-13 · Sketch: `docs/features/design/sketches/03-product-detail.png`

A visitor clicks a card on `/urunler` and lands on that product's own page, at an address made
from its name: `/urunler/naturel-sizma-zeytinyagi-1l`. The page shows the name, photo, price,
amount and description. The address works on its own, so it can be shared or opened in a new
tab. The request and response shapes live in `contracts/openapi.yaml`; this spec says what they
mean and how they behave. It builds on `docs/features/product-list/spec.md`.

## Interface

### Backend: `GET /products` gains `slug`

The list answer is unchanged except for one new field on every product, right after `id`:

| Field | Type | Example | Meaning |
|---|---|---|---|
| `slug` | string | `"naturel-sizma-zeytinyagi-1l"` | The product's part of the page address |

The list does not carry `description`: the cards do not show it.

### Backend: `GET /products/{slug}`

Answers `200` with one product: the list fields plus `description`.

| Field | Type | Example | Meaning |
|---|---|---|---|
| `id`, `slug`, `name`, `photoUrl`, `price`, `amount`, `unit` | | | As in the list |
| `description` | string | `"Manisa'daki bahçemizden…"` | Plain text, Turkish, may hold line breaks |

No other field appears.

- **What a slug looks like:** lowercase ASCII letters, digits and single hyphens, no hyphen at
  either end (`^[a-z0-9]+(-[a-z0-9]+)*$`). It is made from the name and the size, with Turkish
  letters turned into their plain forms (ü → u, ı → i, ğ → g): two bottles of the same oil need
  two addresses.
- **Why the slug is stored, not computed:** it is part of an address people share. Computing it
  from the name would change the address the day a name is corrected. A stored slug changes only
  when someone changes it on purpose.
- **Why the address uses the slug, not the id:** the ticket asks for an address that carries the
  product's name. The `id` stays in the answer as the stable identifier the cart will use.
- **Matching is exact.** `Cig-Badem` or `cig-badem/` does not find `cig-badem-500g`; there is no
  lowercasing and no redirect.

On an unknown slug the backend answers `404` with a `ProblemDetail`
(`Content-Type: application/problem+json`):

```json
{ "title": "Not Found", "status": 404, "instance": "/products/zeytin-ezmesi" }
```

A slug that breaks the pattern above is simply not found: `404`, not `400`. The pattern is a rule
for writing slugs, not a check on the request. Other errors stay as in ZEY-12 (`500`, no
message, no stack trace, no SQL).

### Frontend

- **`/urunler/[slug]` page** (`app/urunler/[slug]/page.tsx`): runs on the Next.js server, reads
  `slug` from the address, fetches `${BACKEND_URL}/products/{slug}` and passes the product to
  `ProductDetail`. It sits under `app/urunler/`, so the design system's layout already wraps it.
- **It renders on every request.** A page whose address has a part in brackets is rendered when
  it is asked for, unless it lists its addresses in advance (`generateStaticParams`); it does
  not, so nothing is built ahead and the build does not need the backend.
- **When the answer is not `200`,** the page throws, so Next.js shows its default error page
  instead of a page with an empty name and price. The "Ürün bulunamadı" page is ZEY-16.
- **`ProductDetail({ product })`** shows, from top to bottom (sketch 03):
  - the breadcrumb: a link "Ürünler" to `/urunler`, then the product's name and amount, plain
    text (`Ürünler / Natürel Sızma Zeytinyağı 1 L`), inside a `nav` whose label is "Sayfa yolu"
  - the photo, large, with the product name as `alt`
  - the name as the page's only `h1`
  - the amount with unit and the price, in the same formats as the card (`1 L`, `450,00 TL`)
  - a heading "Açıklama" and the description, with its line breaks kept
  It does not fetch.
- **`ProductCard`** becomes a link to `/urunler/{slug}`. The whole card is the link, so the photo
  and the name both open the page. Links use Next.js's `Link`, which opens the page without a
  full reload.
- **The `Product` type** gains `slug`; a `ProductDetail` type adds `description` to it.
- **Narrow screens:** the photo and the text sit side by side on wide screens and stack, photo
  first, on narrow ones.

### Data

Two new columns on `products`:

| Column | Type | Rule |
|---|---|---|
| `slug` | `varchar(255)` | not null, unique (constraint `products_slug_key`) |
| `description` | `text` | not null |

The unique constraint has a fixed name so that Hibernate recognises the one created by hand
below and does not add a second.

The sample rows, as the seed writes them into a new database:

| id | slug | description |
|---|---|---|
| 1 | `naturel-sizma-zeytinyagi-1l` | _(to be written)_ |
| 2 | `naturel-sizma-zeytinyagi-5l` | _(to be written)_ |
| 3 | `cig-badem-500g` | _(to be written)_ |

**Existing databases** (local `zeydem`, local `zeydem_test`, Neon) already hold these rows
without the new columns. Hibernate would add the columns but not fill them, and the seed does
not touch existing rows. So the rows are filled once, by hand, in two steps:

```sql
-- Step 1: before the new backend first starts on this database.
ALTER TABLE products ADD COLUMN slug varchar(255), ADD COLUMN description text;
UPDATE products SET slug = 'naturel-sizma-zeytinyagi-1l', description = '…' WHERE id = 1;
UPDATE products SET slug = 'naturel-sizma-zeytinyagi-5l', description = '…' WHERE id = 2;
UPDATE products SET slug = 'cig-badem-500g',              description = '…' WHERE id = 3;
ALTER TABLE products ADD CONSTRAINT products_slug_key UNIQUE (slug);

-- Step 2: after the new backend has started once on it.
ALTER TABLE products ALTER COLUMN slug SET NOT NULL, ALTER COLUMN description SET NOT NULL;
```

- **Why two steps:** until the new code is deployed, the old backend on Render still runs, and
  it restarts every time it wakes from sleep. Its seed inserts rows without a slug. With
  `NOT NULL` already in place, that insert fails and the old backend does not start.
- **Any other row** (a product added by hand) gets a slug and a description in step 1 too, or
  step 2 fails.
- Locally the two steps can run one after the other.

## Preconditions and postconditions

**Before:**
- The backend has started and every row in `products` has a slug and a description.
- `BACKEND_URL` is set on the Next.js server.

**After:**
- `GET /products/{slug}` has not changed any data.

## Invariants

- Every product has exactly one slug, and no two products share one: the database refuses it.
- The list answer has no `description`; only the single-product answer has it. No answer carries
  a field its contract does not list.
- The browser never calls the backend: the detail page fetches on the server, like the list.
- Controllers call services, services call repositories (ArchUnit, decision 004).

## Failure modes

- **Unknown slug:** the backend answers `404` as above. The frontend throws and Next.js shows
  its default error page; the visitor-facing "Ürün bulunamadı" page is ZEY-16.
- **The database does not answer:** `500` with a `ProblemDetail`, no retry. The page throws, as
  above; a visitor-facing message is not part of this ticket.
- **The backend does not answer:** the fetch fails and Next.js shows its default error page. A
  sleeping Render instance makes the first visit wait 30–60 s, as in ZEY-12.

## Checks

Backend:
- **Given** the sample products **When** `GET /products/naturel-sizma-zeytinyagi-1l` is called
  **Then** the answer is `200` with exactly the fields `id`, `slug`, `name`, `photoUrl`, `price`,
  `amount`, `unit`, `description`, and the values of sample product 1.
- **Given** the sample products **When** `GET /products` is called **Then** each product has
  exactly the fields `id`, `slug`, `name`, `photoUrl`, `price`, `amount`, `unit`, with the
  sample slugs, and no `description`.
- **Given** no product with the slug `zeytin-ezmesi` **When** `GET /products/zeytin-ezmesi` is
  called **Then** the answer is `404` with `Content-Type: application/problem+json`, title
  `Not Found`, status `404` and instance `/products/zeytin-ezmesi`.
- **Given** a product with the slug `cig-badem-500g` **When** a second row with the same slug is
  inserted **Then** the database refuses it.
- **Given** the backend has started once **When** the seed runs again **Then** the table still
  holds three sample products (unchanged check from ZEY-12).

Frontend:
- **Given** a list of products **When** `ProductGrid` renders **Then** each card is a link to
  `/urunler/{its slug}`.
- **Given** a product **When** `ProductDetail` renders **Then** it shows the name as a heading,
  `1 L`, `450,00 TL`, the description, an image whose `alt` is the name, and a "Ürünler" link
  to `/urunler`.
- **Given** the address `/urunler/cig-badem-500g` and a backend that answers with the product
  **When** the page renders **Then** it has called `${BACKEND_URL}/products/cig-badem-500g` and
  shows the product.
- **Given** a backend that answers `404` **When** the page renders **Then** it throws.

Live:
- **Given** the deployed site **When** I click a card on `/urunler` **Then** the product's page
  opens at `/urunler/{slug}`.
- **Given** that address **When** I open it in a new tab **Then** the same page comes up.

## Must still work

- `/urunler` shows the same three cards as before: its existing tests, and by eye.
- The home page `/` is untouched.
- `./mvnw test` in `backend/`; `npm test`, `npm run lint` and `npm run build` in `frontend/`.

## Out of scope

The "Ürün bulunamadı" page (ZEY-16), the quantity field and "Sepete ekle" (ZEY-17), stock and
"Tükendi" (ZEY-19), more than one photo, switching between sizes of the same product, the header
and footer of the sketch and the home page's olive oil sections (ZEY-34), a page title per
product, changing a slug later (and redirecting the old address).

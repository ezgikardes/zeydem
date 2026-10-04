# Product list — feature spec

The page that lists every product we sell, with a photo, a name and a price.
It is the first screen of the order path: the cart, the checkout and the order all start here.

## Built in three tickets

The feature is too large for one ticket, so it ships in three steps. Each step can be opened in
a browser and shown to someone.

| # | Ticket | What it adds | Sections of this spec |
|---|---|---|---|
| 1 | Show the product list (mock data) | Page, card, grid, price format, empty state. Data is a fixed array in the code. | §1 (list, card, empty state) · §2 In/Out · §4 rows marked ① |
| 2 | Load the product list from the database | Real products, lowest-price rule, error state, loading state | §2 data source · §3 preconditions 1-5 · §4 rows marked ② |
| 3 | Show the product list in English | English route, translation fallback, language-aware price and metadata | §2 locale · §3 guarantees 4-5 · §4 rows marked ③ |

Ticket 1 needs no database, so the layout can be finished before any data work starts.
Ticket 2 replaces the mock array with a real query — and nothing else, because both return the
same type (see §2).

---

## 1. What this feature does, and what it leaves alone

### It does

- Renders a page that lists **every active product**, ordered by `sort_order`.
- Shows one card per product: photo, name, short summary and price.
- Shows the **lowest price** among the product's variants, with that variant's label next to it
  (`400,00 TL · 1 L cam şişe`), because one product can have several sizes.
- Links each card to that product's detail page.
- Renders in both languages: Turkish at `/urunler`, English at `/en/products`.
- Shows a message when there is no product to list, instead of an empty screen.
- Renders on the server, so search engines receive the product names as text.

### It leaves alone

| Left alone | Where it belongs |
|---|---|
| Stock state, the "Out of stock" label, the disabled button | Task 9 |
| What happens when the add-to-cart button is clicked | Task 2 |
| Category filter, search, sorting | Backlog, not planned yet |
| The product detail page itself | Separate task; this feature only links to it |
| How products get into the database | Seed script, and later the admin panel |
| Prices, payment, delivery | Tasks 4, 5, 6 |

The add-to-cart button **is rendered** by this feature, but it does nothing. It is here so the
card layout does not change when Task 2 lands.

---

## 2. The interface — what goes in, what comes out

### In

| Input | Shape | Source |
|---|---|---|
| `locale` | `"tr"` \| `"en"` | The URL. `/urunler` is Turkish, `/en/products` is English. |
| Product data | `ProductWithVariants[]` | Ticket 1: a fixed array in the code. Ticket 2 on: `getProducts(locale)` |

This feature takes **no query parameters** and reads **no user input**. It cannot be broken by
what a visitor types.

```ts
type Variant = {
  id: string;
  sku: string;
  label: string;        // "1 L cam şişe" / "1 L glass bottle"
  priceKurus: number;   // 40000 means 400,00 TL
  stockQuantity: number;
};

type Product = {
  id: string;
  category: "zeytinyagi" | "badem" | "ceviz";
  slug: string;         // differs per language
  name: string;
  summary: string;
  images: string[];
};

type ProductWithVariants = Product & { variants: Variant[] };
```

**Ticket 1 uses a flatter shape.** The list component receives what a card needs and nothing more:

```ts
type Product = { id: string; name: string; image: string; priceKurus: number };
```

Ticket 2 keeps this shape and adds a mapping step: it reads `ProductWithVariants` from the
database, picks the lowest-priced variant, and hands the component the same flat `Product`. The
component never learns that variants exist, so the lowest-price rule can change without touching
the card.

### Out

| Output | Detail |
|---|---|
| An HTML page | Rendered on the server. No data fetching happens in the browser. |
| One card per product | Photo, name, summary, price, link to the product page |
| A price string | Produced only by `kurusToDisplay(priceKurus, locale)` |
| An empty state | "Henüz ürün yok" / "No products yet" |
| Page metadata | Title and description in the page language (ticket 3) |

### Rules that belong to this feature

- **Money never leaves the database as a decimal.** Prices travel as integer *kuruş* and become
  text in one place, `lib/money.ts`. No component formats a price by hand.
- **Components receive data, they do not fetch it.** The page fetches; the card only receives
  props. This keeps the card testable without a database.
- **The card does not know about languages.** It receives text that is already translated.

---

## 3. What must be true before it runs, and what's guaranteed after

### Before (preconditions)

1. The database is reachable and the Supabase environment variables are set. *(from ticket 2)*
2. The product and translation tables exist, and public read access is allowed for active rows.
3. Every product has a **Turkish** translation. Turkish is the source language; English may be
   missing.
4. Every active product has at least one active variant with `price_kurus >= 0`.
5. **Prices are never negative.** The formatter does not defend against a negative value: it
   renders it visibly wrong rather than silently turning it into a positive price. A negative
   price is a data error and must be visible as one.
6. Every image path in `images[]` exists under `public/`.
7. The URL carries a known language. Anything else never reaches this page.

### After (guarantees)

1. The page shows **exactly** the active products — no inactive one, none twice.
2. The order on screen matches `sort_order`.
3. Every card shows a photo area, a name and a price. No card renders with an empty name.
4. Prices follow the page language: `400,00 TL` in Turkish, `₺400.00` in English. *(ticket 3)*
5. A product with no English text is shown with its Turkish text. **No field renders blank.**
   *(ticket 3)*
6. With zero products, the page still renders, with the empty-state message.
7. The HTML contains the product names as plain text, so a search engine can read them without
   running JavaScript.
8. No secret value and no database key appears in the HTML.
9. The page makes no request to any other site.

---

## 4. What can go wrong, and what happens when it does

The circled number says which ticket handles it.

| What can go wrong | How we notice | What happens |
|---|---|---|
| ② Database unreachable or the query fails | The query throws on the server | The page does not render half a list. The error page for that language is shown: "Ürünleri şu anda yükleyemiyoruz." / "We can't load the products right now." The error is logged. |
| ② The database answers slowly | — | Grey placeholder cards are shown while the page is being prepared, so the visitor does not stare at a white screen. |
| ② A product has no active variant | The variant list is empty | The product is skipped: with no variant there is no price, and a product without a price cannot be sold. Logged. |
| ③ A product has no translation in the requested language | The translation lookup finds no row | Fall back to Turkish. The visitor sees Turkish text instead of a blank card. |
| ③ A product has no Turkish translation either | The lookup returns nothing at all | The product is skipped. A broken card is worse than a missing one. Logged, so the missing text can be added. |
| ③ An unknown language in the URL, like `/fr/products` | The language check in the layout | 404. |
| ① An image file is missing | The image request returns 404 | The card keeps its shape and shows a neutral coloured block. Name and price still render. A missing photo must not break the grid. |
| ① There are no products at all | The list is empty | The empty state is shown. This is a normal state, not an error. |

### Deliberately not handled here

- Retrying a failed database call. One clear error beats a page that silently hangs.
- Caching rules. They belong to a later performance task.

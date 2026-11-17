# Zeydem

[![CI](https://github.com/ezgikardes/zeydem/actions/workflows/ci.yml/badge.svg)](https://github.com/ezgikardes/zeydem/actions/workflows/ci.yml)

## What this is

The online shop of a family farm in Manisa, Türkiye, that sells olive oil and almonds. Today the
farm sells only by phone and WhatsApp to people who already know it; this shop lets a new customer
see the products and prices, fill a cart and, later, order and pay. Live: https://zeydem.vercel.app

## Before you start

- **Node.js 22 or newer**, with npm
- **Java 17** (Maven comes with the repo as `./mvnw`)
- **PostgreSQL 16 or newer**, running on `localhost:5432`

No accounts or API keys are needed to run it locally. Vercel, Render and Neon are used only for
the live site.

## How to run it

1. Create the database user and the two databases, inside `psql` as the `postgres` user. Choose
   your own password. (On macOS with the EDB installer, `psql` is
   `/Library/PostgreSQL/18/bin/psql`.)

   ```sql
   CREATE ROLE zeydem LOGIN PASSWORD 'choose-a-password';
   CREATE DATABASE zeydem OWNER zeydem;
   CREATE DATABASE zeydem_test OWNER zeydem;
   ```

2. Give the backend the password. The file is ignored by git.

   ```bash
   echo "DB_PASSWORD=choose-a-password" > backend/.env
   ```

3. Start the backend. It creates the tables and adds three sample products on its first start.

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. In a second terminal, tell the frontend where the backend is and start it.

   ```bash
   cd frontend
   echo "BACKEND_URL=http://localhost:8080" > .env.local
   npm install
   npm run dev
   ```

5. Open http://localhost:3000/urunler in the browser.

## How to know it worked

- The backend terminal ends with a line containing `Started ZeydemApplication`.
- http://localhost:8080/products shows the three products as JSON.
- http://localhost:3000/urunler shows three cards: two Natürel Sızma Zeytinyağı (1 L and 5 L) and
  Çiğ Badem, each with a photo and a price.
- Clicking a card opens its page; **Sepete ekle** raises the count in the header, and
  http://localhost:3000/sepet shows the line and the total.
- If the page says **Ürünler şu an yüklenemedi.**, the frontend cannot reach the backend: check that
  step 3 is still running and that `frontend/.env.local` has the right address.
- The tests pass: `./mvnw test` in `backend/` and `npm test` in `frontend/`.

## What it does not do yet

- **The home page does not lead to the shop.** http://localhost:3000 is still the earlier landing
  page and its links stay on the page; open `/urunler` directly. Fixed by ZEY-34 and ZEY-35.
- **No checkout yet:** no order form, no payment, no order list for the producers. These are the
  next features (F3, F4 in `docs/plan.md`).
- **Stock is not checked:** every product can be added to the cart (ZEY-19).
- **An unknown product address shows the loading error** ("Ürünler şu an yüklenemedi."), not a
  "Ürün bulunamadı" page (ZEY-16).
- **On the live site the first visit can wait up to a minute**, because the free backend on Render
  sleeps after about 15 minutes (ZEY-38). Meanwhile the **Tekrar dene** button gives no sign that
  it is waiting.
- `frontend/package.json` asks for Node 26, but the site is developed and run on Node 22.

## Where the decisions live

- Architecture decision records: [`decisions/`](decisions/), for example
  [003 Java backend](decisions/003-java-backend.md), [004 layers](decisions/004-layers.md),
  [005 prices](decisions/005-prices.md), [006 CI](decisions/006-ci.md)
- Feature specs: [product list](docs/features/product-list/spec.md),
  [product detail](docs/features/product-detail/spec.md), [cart](docs/features/cart/spec.md)
- The API contract between frontend and backend: [`contracts/openapi.yaml`](contracts/openapi.yaml)
- The MVP plan: [`docs/plan.md`](docs/plan.md); the live plan is in Jira project `ZEY`

## More

**Stack.** Frontend: Next.js 15, React 19, TypeScript, Jest, on Vercel from `main`; pages are
rendered on the server. Backend: Java 17, Spring Boot, Maven, PostgreSQL, on Render from a
`Dockerfile`, with the live database on Neon. The browser never calls the backend: the Next.js
server does.

**CI.** GitHub Actions (`.github/workflows/ci.yml`) runs lint, type check and tests for the
frontend, and `mvn -B verify` against a throwaway PostgreSQL for the backend, on every push to
`main` and every pull request into it. Merging waits for both.

**Other commands.** `npm run lint` and `npm run build` in `frontend/`; more backend commands and
rules in [`backend/CLAUDE.md`](backend/CLAUDE.md).

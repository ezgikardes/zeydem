# Frontend notes

The Next.js site. Repo-wide rules are in `../CLAUDE.md`.

## Rules

- **Components do not fetch data.** They take props. Data loading lives outside them, so a
  component can be tested without a database or the backend.
- **Interface text is Turkish.** English is planned as a second language; do not hardcode English
  strings in components.
- **Only pages talk to the backend.** A page fetches `${BACKEND_URL}/…` on the server and passes
  the result down as props. `BACKEND_URL` has no `NEXT_PUBLIC_` prefix, so it never reaches the
  browser. Locally it lives in `.env.local` (`BACKEND_URL=http://localhost:8080`, ignored by git).
- **Colours come from the design tokens.** `src/styles/tokens.css` defines them on the
  `.design-system` class, not on `:root`, so the home page keeps its own `--brand` until ZEY-34.
  Components use `var(--…)` and never write a colour value; their styles are CSS Modules.
- **Tests sit next to the code** they test (`format.ts` / `format.test.ts`).

## Shape

```
app/                Next.js entry: layout.tsx (HTML shell) and page.tsx (the home page)
app/urunler/        the product list: page.tsx fetches, layout.tsx sets the design system and fonts
app/urunler/[slug]/ one product's page: page.tsx fetches the product named in the address
src/components/     presentational React components
src/lib/            plain functions and types shared by components (formatting, Product); no React
src/styles/         tokens.css, the colours of docs/features/design/design-system.md
public/products/    product photos; the database stores only their paths
tests/              Jest setup and mocks for styles and images
```

## Commands

Run them inside `frontend/`.

```bash
npm test          # Jest
npm run dev       # Next.js dev server, port 3000
npm run build     # production build
npm run lint      # ESLint
```

`npm run dev` and `npm run build` write to the same `.next` folder: stop the dev server before a
build, or its styles break until `.next` is deleted.

## Next.js notes

- Components run on the server unless a file starts with `"use client"`. Add it only to a
  component that needs state, effects or event handlers.
- An imported image is an object in Next.js: pass `photo.src` to `<img>`, not `photo`.
- Never name a folder `pages`. Next.js reads it as the older routing system.
- A folder is a part of the address and `page.tsx` is the page there. A folder in brackets
  (`[slug]`) matches any value; the page reads it from `params`, which Next.js 15 passes as a
  promise to `await`.

# Working notes for the assistant

Zeydem is the online shop of a family farm in Manisa: olive oil and almonds, walnuts later.
It is a learning project as well as a real shop, so **explaining beats finishing**.

## How to work here

- **Test first.** Write the failing test, show it failing, then write the smallest code that
  makes it pass.
- **One ticket at a time.** The GitHub issue says where the work stops. If something outside it
  looks wrong, say so — do not fix it in the same change.
- **Spec before code.** Features have a spec in `docs/features/<feature>/spec.md`. If the code needs
  something the spec does not say, update the spec first.
- **Ask before adding a dependency.** Small project, few packages on purpose.
- **Explain unfamiliar code.** If a block needs more than a sentence to explain, it is probably
  the wrong solution for this project.

## Rules that hold everywhere

- **Money is an integer in kuruş.** `40000` means 400,00 TL. Never store or pass prices as
  decimals; formatting happens in one place only.
- **Components do not fetch data.** They take props. Data loading lives outside them, so a
  component can be tested without a database.
- **Interface text is Turkish.** English is planned as a second language; do not hardcode English
  strings in components.
- **Prices, stock and product data are not hardcoded in components.** Today they come from a mock
  module, later from the database.

## Project shape

```
src/components/     presentational React components
src/utils.ts        small shared helpers
docs/features/      one folder per feature, with its spec
decisions/          architecture decision records (ADR)
tests/mocks/        Jest mocks for styles and images
```

## Commands

```bash
npm test          # Jest
npm run dev       # Vite dev server
npm run build     # production build
```

## Where the project is going

A migration to Next.js is planned, for server-rendered pages and SEO. Until then, avoid work that
the migration would throw away — routing is the main example.

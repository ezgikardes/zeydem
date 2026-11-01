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

- **Components do not fetch data.** They take props. Data loading lives outside them, so a
  component can be tested without a database.
- **Interface text is Turkish.** English is planned as a second language; do not hardcode English
  strings in components.

## Project shape

```
app/                Next.js entry: layout.tsx (HTML shell) and page.tsx (the home page)
src/components/     presentational React components
docs/features/      one folder per feature, with its spec
decisions/          architecture decision records (ADR)
tests/mocks/        Jest mocks for styles and images
```

## Commands

```bash
npm test          # Jest
npm run dev       # Next.js dev server, port 3000
npm run build     # production build
```

## Next.js notes

- Components run on the server unless a file starts with `"use client"`. Add it only to a
  component that needs state, effects or event handlers.
- An imported image is an object in Next.js: pass `photo.src` to `<img>`, not `photo`.
- Never name a folder `pages`. Next.js reads it as the older routing system.

# Frontend notes

The Next.js site. Repo-wide rules are in `../CLAUDE.md`.

## Rules

- **Components do not fetch data.** They take props. Data loading lives outside them, so a
  component can be tested without a database or the backend.
- **Interface text is Turkish.** English is planned as a second language; do not hardcode English
  strings in components.

## Shape

```
app/                Next.js entry: layout.tsx (HTML shell) and page.tsx (the home page)
src/components/     presentational React components
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

## Next.js notes

- Components run on the server unless a file starts with `"use client"`. Add it only to a
  component that needs state, effects or event handlers.
- An imported image is an object in Next.js: pass `photo.src` to `<img>`, not `photo`.
- Never name a folder `pages`. Next.js reads it as the older routing system.

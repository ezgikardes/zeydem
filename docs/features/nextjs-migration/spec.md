# Move the site from Vite to Next.js — spec

Issue: #3 · Technical task: nothing changes for the user.

The next ticket reads products from a database. In Next.js that code runs on the server; in Vite
it would run in the browser. Migrating first means the data code is written once.

---

## 1. What this change does, and what it leaves alone

### It does

- Replaces Vite with Next.js as the tool that runs and builds the site.
- Moves the page entry from `index.html` + `src/main.jsx` + `src/App.jsx` into the Next.js
  `app/` folder: one layout, one page.
- Keeps every existing component working as it is: Header, Hero, Features, Tips, Products,
  Testimonials.
- Builds the home page HTML on the server, so the product names are in the page source before
  any JavaScript runs.
- Keeps the 12 existing tests passing with Jest.

### It leaves alone

| Left alone | Why |
|---|---|
| New pages or routes | Routing becomes possible, but no new URL is added here |
| Reading products from a database | Next ticket |
| The English version | Later ticket |
| New colours, fonts, logo | Later ticket; the site must look the same |
| `next/image` | It changes sizing and CSS; the site must look the same. Own ticket later |
| Converting `.jsx` files to TypeScript | Not needed for the migration |
| The test tool | Jest stays |

---

## 2. The interface — what goes in, what comes out

There is no new function or component. The interface is the shape of the project.

### In: today

```
index.html          the HTML shell, the Rubik font link, <div id="root">
src/main.jsx        mounts React into #root, imports index.css
src/App.jsx         Header + Home
vite.config.js      Vite settings
```

### Out: after

```
app/layout.tsx      the HTML shell: <html lang="tr">, the Rubik font link, index.css
app/page.tsx        Header + Home — what App.jsx did
next.config.mjs     Next.js settings
```

`src/components/`, `src/data/`, `src/utils.ts` and `src/index.css` stay where they are.

`src/pages/Home.jsx` moves to `src/components/Home.jsx`. In Next.js a folder named `pages` is not
just a name: it marks the older routing system, and its presence made Next.js look for the app in
`src/` instead of the project root. Found during the first build.

### Commands

| Command | Before | After |
|---|---|---|
| `npm run dev` | Vite dev server on port 5173 | Next.js dev server on port 3000 |
| `npm run build` | Vite build | Next.js build |
| `npm start` | — | serves the built site |
| `npm test` | Jest | Jest, unchanged |

### Images

A static image import gives a different value in each tool:

| | Vite | Next.js |
|---|---|---|
| `import hero from './hero.png'` | a text path: `"/assets/hero-abc123.png"` | an object: `{ src, width, height }` |

So every place that hands an imported image to `<img>` reads `.src` from it: `src={hero}` becomes
`src={hero.src}`. That is 15 places in 5 components, and the two images in `src/data/products.ts`.

`Product.image` stays a `string`. The mock data passes `bottledOliveOil.src`, so `ProductList` does
not change.

The import stays, rather than moving images to `public/` as text paths, because an import of a
file that does not exist fails the build. A wrong text path would only show up as a broken image
on the live site.

---

## 3. What must be true before, and what's guaranteed after

### Before

1. `main` is green: 12 tests pass.
2. No component uses state, effects or event handlers. Every component can run on the server
   without the `"use client"` marker.
3. Every image is a static import from `src/assets/`.

### After

1. The home page looks the same as before: same sections, same order, same font, same images,
   same prices.
2. The HTML that the server sends for `/` already contains the product names and prices.
3. The same 12 tests pass, with no test changed.
4. `npm run build` succeeds.
5. There is no `vite.config.js`, no `index.html`, no `src/main.jsx`, no `src/App.jsx`, and no
   Vite package in `package.json`.
6. The page title is "Zeydem" instead of "Vite + React". This is the only visible difference, and
   it is on purpose.

---

## 4. What can go wrong, and what happens when it does

| What can go wrong | How we notice | What we do |
|---|---|---|
| An image is passed to `<img>` without `.src` | The image is missing; the HTML says `src="[object Object]"` | Read `.src`. Every `<img>` is checked by eye after the move |
| Next.js rewrites `tsconfig.json` and sets JSX to `preserve`, which ts-jest cannot run | Every component test fails before running | Give Jest its own JSX setting in `jest.config.js`, so the site and the tests each get what they need |
| The Rubik font link is lost when `index.html` goes | Text falls back to the system font | The link moves into the `<head>` of `app/layout.tsx` |
| `index.css` is imported from a component | Next.js refuses: global CSS may only be imported in the layout | Import it in `app/layout.tsx` only |
| A folder named `pages` exists anywhere Next.js looks for routes | The build fails: `Cannot find module '../../src/app/page.js'` | Do not name a folder `pages`. `src/pages/` was renamed |
| The ESLint config still loads the Vite plugin | `npm run lint` fails | Remove the Vite-only rule from the config |
| An image file is renamed or deleted | — | The build fails with the missing file's name. This is wanted: it is the reason imports were kept |

### Deliberately not handled here

- Image optimisation. `next/image` would make pages faster, but it is a visual change.
- Server-side data loading. Nothing loads data yet; the next ticket does.

---

## Executable checks

**Check 1 · the normal path**
- **Given** the site running on Next.js
- **When** the server is asked for `/`
- **Then** the HTML it sends back contains "Natürel Sızma Zeytinyağı · 1 L" and "400,00 TL"

**Check 2 · something goes wrong**
- **Given** an imported image file that has been renamed
- **When** the site is built
- **Then** the build fails and names the missing file

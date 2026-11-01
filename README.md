# Zeydem

Online shop for a family farm in Manisa, Türkiye. The farm produces olive oil and almonds;
walnuts are coming.

## The problem

Today the farm sells by word of mouth: phone calls and WhatsApp messages from people who already
know the family. A new customer has nowhere to see what is for sale, what it costs, or whether it
is still in stock. The producers have no single list of what was ordered.

## MVP

> An online shop where a new customer can order and pay, and the producers see the order in one list.

Live: https://zeydem.vercel.app

## Stack

- **Frontend:** Next.js 15 · React 19 · TypeScript · Jest, deployed on Vercel from `main`. Pages
  are rendered on the server, so search engines receive the content as HTML.
- **Backend:** Java 17 · Spring Boot (coming with ZEY-12).

## Commands

Run them inside `frontend/`.

```bash
cd frontend
npm install     # install the packages, once
npm run dev     # start the site locally on http://localhost:3000
npm test        # run the tests (they return with ZEY-12)
npm run lint    # check the code with ESLint
npm run build   # production build
npm start       # serve the production build
```

## Repo

- `frontend/` — the Next.js site
- `backend/` — the Spring Boot service (coming)

## Documentation

Planning lives in Jira project `ZEY`; `docs/plan.md` records the plan as agreed.

- `docs/plan.md` — the MVP plan
- `docs/features/<name>/spec.md` — what a feature does, its interface, and what it leaves alone
- `decisions/` — architecture decision records

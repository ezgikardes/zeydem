# Working notes for the assistant

Zeydem is the online shop of a family farm in Manisa: olive oil and almonds, walnuts later.
It is a learning project as well as a real shop, so **explaining beats finishing**.

This file holds what applies to the whole repo. Each app has its own notes:
`frontend/CLAUDE.md` for the Next.js site, `backend/CLAUDE.md` once the backend exists.

## How to work here

- **Test first.** Write the failing test, show it failing, then write the smallest code that
  makes it pass.
- **One ticket at a time.** The Jira ticket says where the work stops. If something outside it
  looks wrong, say so — do not fix it in the same change.
- **Spec before code.** Features have a spec in `docs/features/<feature>/spec.md`. If the code needs
  something the spec does not say, update the spec first.
- **Ask before adding a dependency.** Small project, few packages on purpose.
- **Explain unfamiliar code.** If a block needs more than a sentence to explain, it is probably
  the wrong solution for this project.
- **No personal names in docs.** CLAUDE.md, specs and decisions state the rule or the reason,
  not who suggested it.

## Tickets

Work is broken down from large to small:

- **Feature:** a capability offered to the user ("Discover products"). A Jira epic.
- **Sub-feature:** only when a feature is too big ("Add to cart" / "Edit the cart"). A label.
- **Ticket:** one reviewable, verifiable user outcome ("A visitor sees the product list").
  A Jira story. Simplest happy path first, then rules, validation and errors.
- **Implementation steps:** live inside the ticket, split into BE and FE lines. Technical setup
  (backend skeleton, database, deploy) is a step of the first ticket that needs it, never a
  ticket of its own.

Jira project `ZEY` is the single place for planning. A GitHub issue is opened when work on a
ticket starts, titled with its key (`ZEY-12: …`). Branch names and commit messages carry the key.

## Commits

Commits follow the stages of the work, not one commit per ticket:

1. **Spec / design:** each spec comes in its own commit, never mixed with tests or code. A large
   spec may be split into commits by section.
2. **Tests:** one commit per test case, or one for the whole suite.
3. **Code:** the code that makes a failing test (or tests) pass comes in its own commit. If one
   piece of code makes several tests pass together, one commit is enough.
4. **Docs:** one commit.

The cycle can repeat: a missed test gets its own commit, then the code that makes it pass.
Never split something indivisible across commits; a coarser commit (a whole suite) is fine.

## Repo shape

```
frontend/           Next.js site (see frontend/CLAUDE.md)
backend/            Spring Boot service (arrives with ticket ZEY-12)
docs/features/      one folder per feature, with its spec
docs/plan.md        the MVP plan
decisions/          architecture decision records (ADR)
```

Turkish copies of the docs (`*.tr.md`) are kept locally and ignored by git.

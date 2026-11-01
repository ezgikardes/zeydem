# Working with the assistant

Where the assistant helped, and where it was corrected or overruled. A few lines are added when a
ticket closes; the README's AI section is written from this file.

## Preparation (ZEY-7 to ZEY-10)

**Helped**
- Cleared the old product list, cart and tests, and moved the app into `frontend/` with its
  build, lint and dev server checked after the move.
- Put the plan into Jira (epics, stories, sprints) and walked through linking GitHub to Jira.

**Corrected or overruled**
- The first task breakdown followed technical layers. It was rebuilt around user outcomes:
  feature → ticket (one outcome) → implementation steps.
- It edited the plan while questions were still open. The rule since then: agree first, then
  edit.
- It assumed the site was live on Netlify and planned to switch Netlify off. The Netlify account
  and the GitHub deployments showed the site had never been deployed; the plan was corrected and
  the frontend went live on Vercel instead.
- The commit rules were reworded several times until each stage said exactly one thing.

# 003 · A separate Java + Spring Boot backend

**Status:** Accepted

**Context:** The shop is a Next.js site with no data of its own: the earlier product list read a
mock file and was removed before the MVP plan. From ZEY-12 on, the MVP needs products in a
database, then orders, a payment call and a producer login (`docs/plan.md`). Something has to
hold that data and those rules, and the project is also where Java and Spring Boot are being
learned.

**Options:**
- **Next.js only:** route handlers and server code in the same app talk to the database. One
  language, one deploy.
- **A hosted backend service** (a database with a generated API and built-in auth). Little code,
  but the rules live in someone else's product.
- **A separate Spring Boot service** in `backend/`, next to `frontend/`, called by the Next.js
  server over REST.

**Decision:** A separate Spring Boot service, with these parts:

| Part | Choice |
|---|---|
| Language, framework | Java 17, Spring Boot (the current line that runs on Java 17; exact version from Spring Initializr) |
| Build | Maven, run through the Maven wrapper (`./mvnw`) so no global install is needed |
| Database | PostgreSQL 18: the EDB installer locally, Neon live |
| Schema | Created by Hibernate from the entities (`ddl-auto=update`) |
| Sample data | One seed SQL file that runs at every start and never duplicates a row |
| Tests | JUnit; against a separate local test database until Testcontainers arrives (ZEY-37) |
| Deploy | Render, built from a `Dockerfile` |

**Why this option:**
- Learning Java and Spring Boot is a goal of the project, not a side effect.
- A second service makes the boundary real: the frontend can only see what the contract
  (OpenAPI) gives it, so entities and column names cannot leak by accident.
- Maven describes the build in one plain XML file and is what most Spring material uses; the
  wrapper pins its version in the repo.
- Neon's free PostgreSQL does not expire and sleeps when unused; Render's free database is
  time-limited, and the site should stay up after delivery.
- Render has no native Java runtime, so a `Dockerfile` is how a Java service runs there.

**Evidence:** Java 17 is installed; Maven, PostgreSQL and Docker are not (checked on 3 November
2026). The architecture (`docs/architecture.md`) already draws the backend as its own container
and keeps the browser away from it.

**Trade-off accepted:**
- Two languages (TypeScript and Java) and two deploys (Vercel and Render), each with its own
  settings and logs. A change that touches both sides, such as a new product field, is made and
  deployed twice, backend first.
- A network call where one app would have none. The page's data travels Next.js server
  (Vercel) → internet → backend (Render) → database (Neon), and any step can be slow or fail;
  this is why the visitor needs an error state (ZEY-15).
- Hibernate compares the entities with the database at every start. It creates a missing table
  and adds a missing column, but never changes or drops an existing one: if a field's type
  changes, the column keeps the old type; if `photo` is renamed `photoUrl`, a new empty column
  appears and the old one keeps the data. It also keeps no history of the schema, so a change
  made by hand locally must be remembered and repeated on Neon. This is why `amount` is a
  decimal from the start (ZEY-12 spec).
- The `Dockerfile` cannot be tried locally: Docker is not installed. Render builds it, so a
  mistake shows up only in a Render build. Docker stays out until delivery (ZEY-37) for two
  reasons: the development machine has 8 GB of RAM, and on a Mac Docker runs a virtual machine
  that takes 2 GB or more next to the editor, Next.js, Spring Boot and the tests; and learning it
  would compete with the first backend sprint. If the `Dockerfile` keeps failing on Render, a
  lighter Docker app (OrbStack) can be installed just to build it once locally.
- Render's free plan sleeps after about 15 minutes without requests; the first request after
  that takes 30–60 s (ZEY-38).

**Revisit when:** a schema change has to keep live data (a migration tool such as Flyway then
replaces `ddl-auto`); Docker arrives (ZEY-37); or the sleep delay stops being acceptable
(ZEY-38).

# Backend notes

The Spring Boot service. Repo-wide rules are in `../CLAUDE.md`; the choices behind it are in
`decisions/003` (Java, Render, Neon), `004` (layers) and `005` (prices).

## Rules

- **Layers call one way:** controller → service → repository → domain; controller and service
  may use `dto`. `LayerRulesTest` (ArchUnit) fails when a class breaks this.
- **Only DTOs leave the service.** Entities stay inside; a response has exactly the fields of
  `contracts/openapi.yaml`, checked field by field by the controller test.
- **Every error is a `ProblemDetail`.** `ProblemDetailHandler` logs the exception and answers
  without its message, SQL or stack trace.
- **"Not found" is a service exception, not an HTTP status.** The service throws
  `ProductNotFoundException`; the handler turns it into a `404` with no `detail`, and does not log
  it: it is an expected answer, not a failure.
- **Prices are `BigDecimal`**, `NUMERIC(10,2)` in the database, a string in JSON. Never `double`.
- **Secrets stay out of git.** Locally they are in `backend/.env` (ignored); live they are
  Render environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`).

## Shape

```
src/main/java/com/zeydem/
  controller/       HTTP endpoints and the ProblemDetail handler
  service/          the work; turns entities into DTOs inside a transaction
  repository/       Spring Data interfaces
  domain/           JPA entities
  dto/              what crosses to the frontend
src/main/resources/
  application.yaml  settings; reads .env locally
  data.sql          sample products, fixed ids, run at every start
src/test/           JUnit tests; application-test.yaml points them at zeydem_test
Dockerfile          how Render builds and runs the service
```

## Commands

Run them inside `backend/`.

```bash
./mvnw test                     # all tests; the VS Code test panel does not show the ArchUnit test
./mvnw test -Dtest=ClassName    # one test class
./mvnw spring-boot:run          # the service on http://localhost:8080
```

## Database

- Locally: PostgreSQL 18 from the EDB installer, role `zeydem`, databases `zeydem` (the running
  app) and `zeydem_test` (the tests). Live: Neon, Frankfurt.
- Hibernate creates and extends the tables (`ddl-auto=update`) but never changes the type of an
  existing column: such a change is made by hand, locally and on Neon.
- `data.sql` inserts with `ON CONFLICT (id) DO NOTHING`. Editing a sample row in it later does not
  change a row that already exists; change it in the database too.
- **A new required column on a table that has rows** cannot be added by Hibernate: it only logs a
  warning, and then the seed fails. Add it by hand on every database (`zeydem`, `zeydem_test`,
  Neon): the column as nullable, fill the rows, then `NOT NULL`. On Neon the `NOT NULL` step waits
  until the new backend is deployed, because the old one re-runs its seed each time it wakes.
  Example: `docs/features/product-detail/spec.md`, "Data".
  These hand steps are fine for sample data only. Before the shop goes live for real customers,
  schema changes move to a migration tool that runs numbered SQL files at startup (Flyway, which
  uses plain SQL, fits this project; Liquibase is the heavier alternative), and `ddl-auto` becomes
  `validate`, so Hibernate only checks the tables. A new dependency, so it is decided first.

## Deploy

Render builds `Dockerfile` from the `backend` folder; Docker is not installed locally, so a
mistake in it shows up only in a Render build. The tests do not run there (no database): run
them before pushing. The free instance sleeps after about 15 minutes; the first request after
that waits up to a minute.

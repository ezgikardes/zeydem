# ZEY-xx: <the user outcome, in one sentence>

Copy this file to `docs/features/<feature>/spec.md` and fill it in before any test or code.
The spec grows with the ticket: start with the data, add the interface when you get there.
Delete a section only if it truly does not apply.

## Interface

What goes in and what comes back: the endpoint shape for the backend, the props for a component.

## Preconditions and postconditions

What must be true before it runs, and what is guaranteed after.

## Invariants

What must never change while it happens.

## Failure modes

- **Invalid input:** what is refused, and what the person sees.
- **The other side does not answer:** how long we wait, whether we retry, what we check in the
  answer before using it, and what the person sees.

## Flow (only if something waits)

When the screen waits for an answer whose result changes what it shows: the states, and the
success and failure branches as a sequence diagram.

## Checks

- **Given** … **When** … **Then** …  (happy path)
- **Given** … **When** … **Then** …  (something going wrong)

## Must still work

The nearby behaviour this change could break, and how it is checked.

## Out of scope

What this change does not touch.

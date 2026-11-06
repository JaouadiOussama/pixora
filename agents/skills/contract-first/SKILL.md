---
name: contract-first
description: The order and rules for changing a Pixora HTTP API or Kafka event, contract in the hub first, then the implementation. Use whenever a task adds or changes an endpoint, a response, an error type or an event.
---

# contract-first

An API or event change is **always two PRs**: the contract in the hub first, then the implementation in the service (and a third in pixora-web if the UI uses it). Sources: `docs/conventions.md` sections 4–5, `docs/events.md`, ADR-0016.

## 1. The contract PR (hub)

- **HTTP:** edit `contracts/openapi/<service>.yaml` (OpenAPI 3.1). **Events:** edit `contracts/asyncapi/<service>.yaml` (AsyncAPI) and the event catalog in `docs/events.md`. **New error:** add it to `contracts/problem-types.md`.
- Follow the API conventions exactly: `/api/v1/<plural-noun>` paths (the spec documents the public path), camelCase fields, UUIDv7 ids as strings, RFC 3339 UTC times, absent fields omitted, UPPER_SNAKE enums, cursor pagination (`limit`, `cursor`, `{items, nextCursor}`), the status codes in conventions 4.4, every error as `application/problem+json` with `code`.
- Every operation has an `operationId`, a summary, request and response **examples**, and every error response it can return.
- Every event has a schema for its payload inside the standard envelope, its topic (`pixora.<service>.<aggregate>`), its key (the aggregate id) and an example.
- Spectral must pass (CI runs it).
- Title: `feat(contracts): add <thing> to <service> (KEY)`; breaking: `feat(contracts)!:` with the migration explained.
- The owner approves contract changes at the planning stage; the PR is merged by the owner.

## 2. Breaking or not?

**Not breaking** (stays in `v1`): a new endpoint, a new optional request field, a new response field, a new enum value (clients must accept unknown values), a new event type, a new optional event field.

**Breaking** (needs `v2` of the endpoint or a new event version, plus a transition period): removing or renaming a field, endpoint or event; making an optional field required; changing a type, a format or a meaning; changing a status code clients rely on; changing an event's key or topic. If a breaking change seems needed, stop and ask the Tech Lead: it needs a plan (and possibly an ADR), `Deprecation` and `Sunset` headers on the old version, and both versions served for a while.

## 3. The implementation PR (service)

- Starts after the contract PR is merged.
- Controllers are written by hand to match the spec; **contract tests** (`*IT`) validate real responses (status, headers, body) and produced/consumed events against the merged contract.
- The service's `/v1/...` paths are what the gateway forwards after removing `/api` (routing map in conventions 4.2). A new public path also needs a gateway route: a separate pixora-gateway sub-issue.

## 4. The frontend PR (pixora-web)

- Regenerates the API client from the merged spec (never edits `src/app/api/` by hand), then uses the new types. A contract the frontend didn't follow breaks its build, which is the point.

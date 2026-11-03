# 0016. API conventions

- Status: Accepted
- Date: 2026-11-03

## Context

Six services expose HTTP APIs to one Angular app (and maybe a mobile app later), each built by different agents. Without shared rules, every service would invent its own URLs, error format and pagination, and the frontend would have to handle each one differently.

## Decision

- **Contract-first:** every endpoint is written in OpenAPI 3.1 in the hub first, in its own PR, then implemented. Controllers are hand-written and verified by contract tests; Angular uses a generated client. Spectral enforces the rules below.
- **URLs:** plural kebab-case nouns; actions through HTTP methods; relationships as resources set with `PUT` and removed with `DELETE`.
- **Versioning:** major version in the path (`/api/v1/...`) using Spring Framework 7 API versioning; only breaking changes create a new version; `Deprecation` and `Sunset` headers announce retirement.
- **JSON:** camelCase; RFC 3339 UTC timestamps; **UUIDv7** IDs as strings; absent values omitted; UPPER_SNAKE_CASE enums; `PATCH` with JSON Merge Patch.
- **Errors:** RFC 9457 Problem Details with the extensions `code`, `errors` and `traceId`; one global handler per service.
- **Pagination:** cursor-based everywhere (`limit`, `cursor` → `items`, `nextCursor`), default 20, maximum 100.
- **Writes:** optimistic concurrency with `ETag` / `If-Match` backed by JPA `@Version`; `Idempotency-Key` on `POST /api/v1/posts`.

Details: [conventions.md](../conventions.md#4-api-conventions).

## Consequences

- Every endpoint looks and fails the same way; the frontend handles errors once, by `code`.
- API changes are visible and reviewed in the hub before any code is written.
- The existing docs' paths moved from `/api/...` to `/api/v1/...`; ADR-0006 keeps its original wording.
- Each service needs the problem handler, ETag support and, for post creation, an idempotency key store.

## Alternatives considered

- **Code-first (generate the spec from controllers):** faster at first, but the contract becomes a by-product and cross-service changes aren't reviewed up front.
- **Version in a header or media type:** cleaner URLs, but harder to see, test and route; path versioning is the most common choice in large public APIs.
- **snake_case JSON:** used by some guidelines (Zalando), but camelCase is natural for both Java and TypeScript.
- **Offset pagination:** simple, but returns duplicates or skips items on feeds that change while the user scrolls.
- **A custom error format:** no benefit over the RFC, which Spring supports natively.

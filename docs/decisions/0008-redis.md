# 0008. Redis for sessions, feeds and counters

- Status: Accepted
- Date: 2026-10-30

## Context

Three needs call for a fast in-memory store: gateway sessions ([ADR-0006](0006-keycloak-with-gateway-bff.md)), precomputed home feeds (fan-out on write, [ADR-0002](0002-v1-scope.md)) and like/comment counters that are read on every post view.

## Decision

- **One Redis server**, shared, with a **key prefix per owner** (`pixora:gateway:`, `pixora:feed:`, `pixora:engagement:`). A service only touches its own prefix.
- Uses: gateway sessions (Spring Session), feed timelines (feed-service), counters (engagement-service). Gateway rate limiting may be added later.
- **Redis is never the source of truth.** Feeds can be rebuilt from Kafka events and PostgreSQL; counters are a cache of PostgreSQL data. Losing Redis logs users out and slows feeds, but loses no data.

## Consequences

- Fast feed reads and counters without hitting PostgreSQL on every view.
- Each Redis use needs a rebuild path.
- One Redis server is a shared dependency; acceptable for this project, and it saves RAM and disk.

## Alternatives considered

- **One Redis per service:** stronger isolation, but more containers on a laptop with limited resources.
- **Sessions in PostgreSQL (Spring Session JDBC):** works, but slower and adds load on the database for every request.
- **Counters only in PostgreSQL:** simpler, but every post view would run count queries.

# 0010. Elasticsearch for search

- Status: Accepted
- Date: 2026-10-30

## Context

v1 search covers username autocomplete and hashtags ([ADR-0002](0002-v1-scope.md)). search-service owns search and builds its data from events ([ADR-0004](0004-data-and-communication-defaults.md)). PostgreSQL with `pg_trgm` would cover the v1 needs, but search is also where typo tolerance, relevance ranking and trending hashtags (v2) will come from.

## Decision

- search-service uses **Elasticsearch** (9.x, the line supported by Spring Data Elasticsearch 6.1 in Spring Boot 4.1; exact version pinned in the Compose file), through Spring Data Elasticsearch.
- Dev: a **single node**, 512 MB heap, reachable only on the Compose network. Security is off in dev and on in any deployment.
- search-service is a **read model**: it has **no database of its own**. Its indexes are filled from Kafka events and can be rebuilt.
- Index writes are idempotent (upsert or delete by id, no counters stored), so search-service doesn't need a `processed_event` table.
- Each index is used through an **alias**, so a rebuild can fill a new index and swap the alias without downtime.

The full workflow is in [search.md](../search.md).

## Consequences

- Good autocomplete (`search_as_you_type`), typo tolerance and relevance ranking from the start; aggregations for trending hashtags later.
- About 1 GB of RAM and ~1.5 GB of disk more in dev.
- Search results are eventually consistent: a new user or post appears after its event is processed.
- A rebuild path is required (see search.md).

## Alternatives considered

- **PostgreSQL full-text search + `pg_trgm`:** enough for v1 and no extra container, but weaker ranking and fuzzy matching, and it doesn't show the read-model pattern this architecture is built around.
- **OpenSearch:** Apache 2.0 licensed, but its Spring integration is a community project that falls behind new Spring Boot versions.

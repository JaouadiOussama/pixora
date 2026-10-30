# Architecture decision records

Each important decision is recorded as an ADR: the context, the decision, its consequences and the alternatives we rejected. An ADR is never edited after it is accepted. To change a decision, write a new ADR that supersedes the old one.

| # | Decision | Status | Date |
|---|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted | 2026-10-29 |
| [0002](0002-v1-scope.md) | v1 scope | Accepted | 2026-10-29 |
| [0003](0003-microservices-and-multi-repo.md) | Microservices, one repo per service, plus a hub | Accepted | 2026-10-29 |
| [0004](0004-data-and-communication-defaults.md) | Data and communication defaults | Accepted | 2026-10-29 |
| [0005](0005-technology-versions.md) | Technology versions | Accepted | 2026-10-29 |
| [0006](0006-keycloak-with-gateway-bff.md) | Keycloak with the gateway as a BFF | Accepted | 2026-10-30 |
| [0007](0007-kafka-kraft-with-transactional-outbox.md) | Kafka (KRaft) with a transactional outbox | Accepted | 2026-10-30 |
| [0008](0008-redis.md) | Redis for sessions, feeds and counters | Accepted | 2026-10-30 |
| [0009](0009-s3-api-with-seaweedfs-in-dev.md) | S3 API for photo storage, SeaweedFS in dev | Accepted | 2026-10-30 |
| [0010](0010-elasticsearch-for-search.md) | Elasticsearch for search | Accepted | 2026-10-30 |

Still open: deployment (D8).

Template: [template.md](template.md).

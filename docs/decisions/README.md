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
| [0011](0011-deploy-later-build-deployable-now.md) | Deploy later, build deployable images from the start | Accepted | 2026-10-30 |
| [0012](0012-trunk-based-development-with-small-squash-merged-prs.md) | Trunk-based development with small, squash-merged pull requests | Accepted | 2026-11-02 |
| [0013](0013-test-strategy-and-quality-gate.md) | Test strategy and quality gate | Accepted | 2026-11-02 |
| [0014](0014-code-style-formatting-and-null-safety.md) | Code style, formatting and null safety | Accepted | 2026-11-02 |
| [0015](0015-package-by-feature.md) | Package by feature | Accepted | 2026-11-02 |
| [0016](0016-api-conventions.md) | API conventions | Accepted | 2026-11-03 |
| [0017](0017-apache-2-license.md) | Apache License 2.0 | Accepted | 2026-11-03 |

Template: [template.md](template.md).

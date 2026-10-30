# 0004. Data and communication defaults

- Status: Accepted
- Date: 2026-10-29

## Context

With seven services ([ADR-0003](0003-microservices-and-multi-repo.md)), we need common rules for data ownership, communication, configuration and observability, so every service is built the same way.

## Decision

- **One database per service**, all on one PostgreSQL server. No service reads another service's database.
- **Events between services** through Kafka (details in [ADR-0007](0007-kafka-kraft-with-transactional-outbox.md)).
- **Synchronous calls only when needed**, always through Resilience4j (timeout, retry, circuit breaker).
- **No Eureka and no Spring Cloud Config Server.** Docker Compose service names and environment variables are enough.
- **OpenTelemetry tracing to Jaeger from day 1**, including trace propagation through Kafka headers.
- **Contract tests** against the OpenAPI and AsyncAPI contracts in the hub.

## Consequences

- Services stay loosely coupled; data that another service needs is copied there through events.
- Data across services is eventually consistent, and the UI must accept that (for example, a new post can take a moment to appear in followers' feeds).
- Debugging a flow across services is possible from the first feature thanks to tracing.

## Alternatives considered

- **Shared database:** simplest, but couples every service to every schema.
- **Eureka + Config Server:** useful at scale, but extra moving parts with no benefit for a Compose-based setup.
- **Synchronous REST everywhere:** creates chains of failures and tight coupling.

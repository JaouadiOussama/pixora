# 0007. Kafka (KRaft) with a transactional outbox

- Status: Accepted
- Date: 2026-10-30

## Context

Services communicate mainly through events ([ADR-0004](0004-data-and-communication-defaults.md)). Feed fan-out and search indexing depend on these events, so losing one, or publishing one for a change that was rolled back, leaves data wrong. A service can't commit to its database and publish to a broker atomically.

## Decision

- **Apache Kafka in KRaft mode** (no ZooKeeper). One broker in dev.
- Every producing service uses a **transactional outbox**: the event is inserted into an `outbox` table in the same transaction as the data change, and a **polling relay** inside the service publishes it to Kafka (`FOR UPDATE SKIP LOCKED`), then marks it as published.
- The Kafka key is the aggregate id, so events for one aggregate stay in order.
- Delivery is **at-least-once**, so **consumers are idempotent** (a `processed_event` table keyed by `eventId`, updated in the same transaction as the consumer's change).
- Retries with backoff, then a dead-letter topic `<topic>.DLT`.
- Events are JSON with a common envelope, described in AsyncAPI in the hub. Trace context travels in Kafka headers.

Details: [events.md](../events.md).

## Consequences

- No lost events and no events for rolled-back changes.
- Every service has an outbox table, a relay and a cleanup job; every consumer has a deduplication table.
- Events arrive with a small delay (the relay's polling interval).

## Alternatives considered

- **Publish to Kafka directly after the commit:** loses events when the service crashes between the commit and the send.
- **Debezium change data capture:** no polling, but needs Kafka Connect, which costs RAM and disk the dev laptop doesn't have. Can be revisited later.
- **RabbitMQ:** fine for queues, but Kafka's partitioned log, replay and ordering per key fit feeds and indexing better, and Kafka is the more common choice for this kind of system.

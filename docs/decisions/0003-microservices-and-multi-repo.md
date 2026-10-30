# 0003. Microservices, one repo per service, plus a hub

- Status: Accepted
- Date: 2026-10-29

## Context

Pixora is a portfolio project. Besides working, it must show how a distributed system is designed, built, tested and operated: service boundaries, events, contracts, observability. A modular monolith was considered and would be simpler, but it would not show these skills.

## Decision

- Pixora is built as **microservices**, each in **its own repository**, all **public from the first commit**:
  `pixora-gateway`, `pixora-user-service`, `pixora-post-service`, `pixora-feed-service`, `pixora-engagement-service`, `pixora-search-service`, `pixora-web`.
- A **hub repository** (`pixora`) holds what they share: docs and ADRs, OpenAPI and AsyncAPI contracts, the Docker Compose file for the full system, Playwright end-to-end tests, reusable CI workflows and the merge gate.
- Agents always clone the hub next to the repo they work on.
- **No shared code library.** Services share contracts, not Java code.

## Consequences

- Each service can be built, tested, released and reviewed on its own, with a small context for the agent working on it.
- Cross-service changes need several pull requests, ordered contract first.
- More infrastructure to run locally; the dev laptop's disk (~43 GB free) is the main constraint, so images and volumes must stay small.
- Contract tests are required to keep services compatible.

## Alternatives considered

- **Modular monolith (Spring Modulith):** simpler to run and refactor, but shows fewer distributed-systems skills.
- **Microservices in a monorepo:** easier cross-service changes, but bigger agent context per task and less realistic team boundaries.
- **A shared Java library:** couples releases of every service; contracts are enough.

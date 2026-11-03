# 0015. Package by feature

- Status: Accepted
- Date: 2026-11-02

## Context

Every service and the Angular app need the same, predictable layout, so an agent knows where code goes and a task stays inside a small part of the codebase. The layout must also make boundaries checkable by tools.

## Decision

- **Java services are organized by feature**, as in the Spring Boot reference documentation: one package per feature (`profile`, `follow`...) holding its controller, service, repository, entity, DTOs, mapper and event payloads, plus `outbox` and `config` packages.
- Root package `io.github.jaouadioussama.pixora.<service>`; Maven groupId `io.github.jaouadioussama.pixora`, artifactId = repository name. (`io.github.<user>` is the convention for projects hosted on GitHub without an owned domain.)
- **Package-private by default**; only what another package needs is public.
- **ArchUnit** enforces: no cycles between features, controllers never use repositories, entities never leave their feature, only `outbox` publishes to Kafka.
- **Records** for DTOs, events and value objects; **MapStruct** for mapping; **no Lombok**.
- **Angular is organized by feature** (Angular style guide): `core/`, `shared/ui/`, the generated `api/`, and one lazy-loaded folder per feature; no folders by type; file names without suffixes; features don't import from each other (ESLint rule).

Details: [conventions.md](../conventions.md#2-java-code-layout).

## Consequences

- Everything about a feature is in one place; most tasks touch one package, which keeps PRs small.
- The compiler (package-private) and ArchUnit enforce boundaries, so they don't depend on reviewers noticing.
- Code shared by several features inside a service must be placed deliberately (in a feature that owns it, or a small shared package), not dumped in a `util` package.

## Alternatives considered

- **Package by layer** (`controller/`, `service/`, `repository/`): a change to one feature spreads across the whole tree, and everything must be public.
- **Hexagonal / clean architecture:** strong for complex domains, but heavy ceremony for services that are mostly CRUD plus events. An ADR can adopt it for one service if its domain grows complex.
- **Lombok:** less boilerplate for classes, but records already cover DTOs, and Lombok conflicts with Error Prone, NullAway and new Java versions.
- **Hand-written mappers:** no dependency, but more code in every PR.

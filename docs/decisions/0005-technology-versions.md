# 0005. Technology versions

- Status: Accepted
- Date: 2026-10-29

## Context

A new project should start on current, supported versions, so it doesn't begin with technical debt. Versions were checked on 2026-10-29.

## Decision

| Technology | Version |
|---|---|
| Java | 25 LTS, with virtual threads |
| Spring Boot (the six services) | 4.1.2 |
| Spring Boot + Spring Cloud (gateway) | 4.0.9 + 2025.1.4 |
| Angular | 22.2.4 |
| Node.js | 26 LTS |
| Infrastructure images | Latest stable, pinned to an exact version when the Compose file is written |

- The gateway stays on Spring Boot 4.0.x because Spring Cloud 2026.0 (the release for Boot 4.1) is not GA yet. It moves to Boot 4.1 with Spring Cloud 2026.0 through a Dependabot pull request once that is released.
- Angular code uses the modern patterns only: standalone components, signals, zoneless change detection, Signal Forms and the built-in control flow. `conventions.md` will lock these in.

## Consequences

- Two Spring Boot minor versions coexist for a while (gateway vs services).
- Dependabot is needed from the start to keep versions current.

## Alternatives considered

- **Everything on Boot 4.0.x:** one version, but the services would start one minor version behind for no reason.
- **Gateway on a Spring Cloud release candidate:** not acceptable for the entry point of the system.

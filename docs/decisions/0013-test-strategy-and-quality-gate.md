# 0013. Test strategy and quality gate

- Status: Accepted
- Date: 2026-11-02

## Context

Seven services and a frontend, mostly written by agents, must stay correct and compatible with each other. Tests are the main safety net before any merge, automatic or manual. They must catch real bugs (including the ones that only appear on real infrastructure), keep services compatible through the hub's contracts, and stay fast enough for every PR.

## Decision

- **The test pyramid.**
  - Backend: unit tests (most), Spring slice tests, integration tests with **Testcontainers** on the real engines (never H2), **contract tests** that validate responses and events against the hub's OpenAPI and AsyncAPI files, and **ArchUnit** rules.
  - Frontend: **Vitest** with **Angular Testing Library**, and an API client generated from OpenAPI.
  - End to end: **Playwright** for the critical user journeys only, on hub PRs and nightly; a nightly failure opens an issue.
- **Quality gate on every PR:** SonarQube Cloud with the Sonar way rules on new code: coverage ≥ 80%, duplication ≤ 3%, no new issues, all security hotspots reviewed.
- **Test-first** (red, green, refactor) is part of the agents' implementation workflow. A bug fix starts with a test that reproduces it. A flaky test is a bug, never retried away.
- Mutation testing and load tests are not PR gates.

Details: [engineering-guidelines.md](../engineering-guidelines.md#4-testing).

## Consequences

- Bugs tied to PostgreSQL, Kafka, Redis, Elasticsearch or Keycloak behaviour are caught before merge.
- A service can't drift from its contract without failing its build, and the frontend can't drift without failing to compile.
- Integration tests need Docker in CI and are slower than unit tests; sharing containers per test JVM keeps this acceptable.
- The 80% rule on new code adds tests to every PR, which counts toward the size limit and pushes towards smaller tasks.

## Alternatives considered

- **In-memory databases and embedded brokers:** faster, but they behave differently from production and hide bugs.
- **Consumer-driven contracts with Pact:** strong for many teams and consumers, but needs a broker and duplicates the contracts already kept in the hub; validating against the hub's specs fits contract-first better.
- **A coverage target on the whole codebase:** penalizes old code and encourages low-value tests; a gate on new code is the Sonar standard.
- **Many end-to-end tests:** slow and flaky; the pyramid keeps them to the critical journeys.

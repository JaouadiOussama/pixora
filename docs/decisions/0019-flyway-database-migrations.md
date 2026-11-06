# 0019. Flyway for database migrations

- Status: Accepted
- Date: 2026-11-06

## Context

Each service owns its PostgreSQL database ([ADR-0004](0004-data-and-communication-defaults.md)), and schema changes must go through versioned migrations, never Hibernate's automatic schema update ([conventions](../conventions.md)). The two standard tools with Spring Boot support are Flyway and Liquibase.

## Decision

- Every service with a database uses **Flyway**, through Spring Boot's Flyway support, with the PostgreSQL module (`flyway-database-postgresql`).
- Migrations are **plain SQL** in `src/main/resources/db/migration`, named `V<NNN>__<what_it_does>.sql` with a zero-padded number (`V001__create_profile_table.sql`).
- **An applied migration is never edited.** Flyway checks each file's checksum, so an edit fails the build. A mistake is fixed with a new migration (forward only; no undo scripts).
- Hibernate runs with `spring.jpa.hibernate.ddl-auto=validate`: the app refuses to start if the entities and the schema disagree.
- Migrations run on start-up in dev and in integration tests (Testcontainers), so every test runs against the real schema.
- Any PR that adds a migration is merged by hand ([merge gate](../engineering-guidelines.md)).

## Consequences

- Schema changes are readable SQL that the reviewer and the DBA agent can check line by line.
- Two PRs in the same repo that both add `V005` conflict. Flyway fails on the duplicate version, CI turns red, and the second PR renumbers its file.
- Backwards-compatible changes need care (expand, then contract) once the app is deployed; the DBA skill covers this.

## Alternatives considered

- **Liquibase:** database-independent changesets (XML/YAML/SQL) and rollback scripts. Rejected: we only use PostgreSQL, plain SQL is easier to review, and every migration is merged by hand anyway.
- **Hibernate `ddl-auto=update`:** no history, no review, unsafe in production.

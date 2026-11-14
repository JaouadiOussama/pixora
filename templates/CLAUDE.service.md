<!--
Template for the CLAUDE.md of a Pixora service (pixora-user-service, -post-service, -feed-service,
-engagement-service, -search-service). Copy it to the repo root as CLAUDE.md in the repo's first PR,
replace every <placeholder>, delete lines that don't apply (search-service has no database), and
delete this comment. Keep the file short: it is loaded into every session in the repo.
-->

# pixora-<name>-service

<One sentence: what this service owns, from the hub's docs/architecture.md section 2.>

The rules for all Pixora repositories live in the hub (https://github.com/JaouadiOussama/pixora), checked out next to this repository. This file holds what is specific to this one.

## Before you code

- Read, in the hub: `docs/architecture.md` (what this service owns and the cross-cutting rules) and <the workflow docs this service takes part in, e.g. docs/events.md, docs/media.md>.
- Code follows `docs/conventions.md` and `docs/engineering-guidelines.md`; the spring-backend and postgres-flyway skills are the working checklist.
- The API and the events are defined first in the hub's `contracts/` (<openapi and asyncapi file names>). Implement what is merged there.

## Commands

| What                      | Command                                                                  |
| ------------------------- | ------------------------------------------------------------------------ |
| Format                    | `./mvnw spotless:apply`                                                  |
| Fast tests (unit, slices) | `./mvnw test`                                                            |
| Everything CI runs        | `./mvnw verify` (needs Docker: Testcontainers starts the infrastructure) |
| Run locally               | <command, once the hub's Compose file exists>                            |

## This repository

- Root package `io.github.jaouadioussama.pixora.<package>`. Features: <one package per feature, e.g. `profile/`, `follow/`>; plus `outbox/` and `config/`.
- Database `<name>`: Flyway migrations in `src/main/resources/db/migration` (`V<NNN>__<what>.sql`, the next free number).
- Public API: `/api/v1/<resources>` at the gateway, served here as `/v1/<resources>`.
- Produces: <topics>. Consumes: <topics>.

## Rules

1. **Test first.** Every change comes with a test that fails without it; a bug fix starts with a test that reproduces the bug.
2. **Events go through the outbox**, written in the same transaction as the change. Nothing in a feature calls `KafkaTemplate`.
3. **A migration on `main` is never edited.** Fix forward with a new one.
4. **The service checks access itself:** the user is the JWT's subject, and every endpoint checks the caller may act on this resource.
5. **No secrets** in code, config files, tests or logs. Configuration comes from environment variables.

## Lessons

<!-- finalize-task adds one line per mistake made twice in this repo: the rule, then the two PRs. -->

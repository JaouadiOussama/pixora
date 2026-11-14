<!--
Template for the CLAUDE.md of pixora-gateway. Copy it to the repo root as CLAUDE.md in the repo's first PR,
replace every <placeholder> and delete this comment. Keep the file short: it is loaded into every session in the repo.
-->

# pixora-gateway

The single entry point of Pixora and the backend-for-frontend for authentication: OIDC login with Keycloak, server-side sessions in Redis, CSRF protection, routing to the services with the user's token relayed.

The rules for all Pixora repositories live in the hub (https://github.com/JaouadiOussama/pixora), checked out next to this repository. This file holds what is specific to this one.

## Before you code

- Read, in the hub: `docs/authentication.md` (every flow the gateway takes part in, and its security rules), ADR-0006 (gateway as BFF), ADR-0018 (reactive gateway) and `docs/conventions.md` section 4.2 (the routing map).
- The spring-backend skill's "The gateway is different" section is the working checklist; security-review lists what the Security Engineer checks here.

## Commands

| What               | Command                                       |
| ------------------ | --------------------------------------------- |
| Format             | `./mvnw spotless:apply`                       |
| Fast tests         | `./mvnw test`                                 |
| Everything CI runs | `./mvnw verify` (needs Docker)                |
| Run locally        | <command, once the hub's Compose file exists> |

## This repository

- Spring Boot <version> with Spring Cloud <release train> (Spring Cloud Gateway Server WebFlux). Root package `io.github.jaouadioussama.pixora.gateway`.
- Routes: `src/main/resources/application.yml`, matching the routing map in the hub's conventions.
- No database. Sessions and rate limits live in Redis.

## Rules

1. **Nothing blocks.** The gateway is reactive: no `block()`, no blocking I/O or JDBC on the event loop. Tests use `WebTestClient`.
2. **Tokens never reach the browser.** The browser only has the `SESSION` cookie; services receive the token through `TokenRelay`, and the `Cookie` header is removed before routing.
3. **`/api/**` never redirects to login:** an unauthenticated API call gets `401`.
4. **Routes follow the hub's routing map.** A new public path is a contract change first, then a route here.
5. **Security config and routes are owner-tier** at the merge gate and always get a Security review. No secrets in code, config or logs.

## Lessons

<!-- finalize-task adds one line per mistake made twice in this repo: the rule, then the two PRs. -->

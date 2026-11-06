# 0018. Reactive gateway (Spring Cloud Gateway on WebFlux)

- Status: Accepted
- Date: 2026-11-06

## Context

Spring Cloud Gateway comes in two flavours: **Server WebFlux** (reactive, the original) and **Server Web MVC** (servlet, newer). Both are documented by Spring as first-class options. The gateway has to be the BFF from [ADR-0006](0006-keycloak-with-gateway-bff.md) (OAuth2 login, sessions in Redis, CSRF, passing the token on to services), rate-limit requests per user with Redis ([conventions](../conventions.md), `429`), and route `/media/**` to the photo store ([media.md](../media.md)).

## Decision

- **pixora-gateway uses Spring Cloud Gateway Server WebFlux** (`spring-cloud-starter-gateway-server-webflux`).
- BFF building blocks, all reactive: Spring Security `oauth2Login`, the `TokenRelay` filter, Spring Session Data Redis, a cookie-based CSRF token for Angular.
- Rate limiting uses the built-in **`RequestRateLimiter` with `RedisRateLimiter`**: keyed by user when logged in, by client IP otherwise.
- **No blocking calls in the gateway.** It stays mostly configuration (routes in YAML, the security config); any custom filter is written reactively.
- The **six services stay on Spring MVC with virtual threads** (`spring.threads.virtual.enabled=true`). Reactive code exists only in the gateway.

## Consequences

- Everything the design needs is built in: no extra library for rate limiting or token relay.
- Two programming models in the project. This is kept small because the gateway has little code. The gateway's CLAUDE.md states the reactive rules (no `block()`, return `Mono`/`Flux`, test with `WebTestClient`).
- Security configuration in the gateway uses the reactive API (`SecurityWebFilterChain`), unlike the services (`SecurityFilterChain`).

## Alternatives considered

- **Server Web MVC with virtual threads:** same programming model as the services, and simpler to debug. Rejected because rate limiting with Redis needs an extra library (Bucket4j), and fewer production examples of the full BFF setup exist for it.
- **No gateway (Angular talks to each service):** rejected in [ADR-0006](0006-keycloak-with-gateway-bff.md); the BFF needs a single entry point.

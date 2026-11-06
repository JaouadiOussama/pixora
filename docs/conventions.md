# Conventions

How code and APIs look in every Pixora repository: names, the layout of a service and of the Angular app, coding rules, and the API rules every endpoint follows. How work is done (branches, PRs, tests, CI) is in [engineering-guidelines.md](engineering-guidelines.md).

Decisions: [ADR-0015](decisions/0015-package-by-feature.md) (code layout), [ADR-0016](decisions/0016-api-conventions.md) (API conventions), [ADR-0005](decisions/0005-technology-versions.md) (modern Angular patterns), [ADR-0007](decisions/0007-kafka-kraft-with-transactional-outbox.md) (events).

## 1. Names at a glance

| Thing | Convention | Example |
|---|---|---|
| Repository | `pixora-<name>`, kebab-case | `pixora-post-service` |
| Maven coordinates | groupId `io.github.jaouadioussama.pixora`, artifactId = repository name | `io.github.jaouadioussama.pixora:pixora-post-service` |
| Java root package | `io.github.jaouadioussama.pixora.<service>` | `io.github.jaouadioussama.pixora.post` |
| Docker image | `ghcr.io/jaouadioussama/<repository>` | `ghcr.io/jaouadioussama/pixora-post-service:sha-1a2b3c4` |
| Branch | `<type>/<issue-key>-<slug>` | `feat/PIX-12-signup-page` |
| PR title / commit | Conventional Commits | `feat(auth): add the sign-up page (PIX-12)` |
| API path | `/api/v1/<plural-noun>`, kebab-case | `/api/v1/posts/{postId}/comments` |
| JSON field | camelCase | `createdAt`, `followerCount` |
| Enum value / error code | UPPER_SNAKE_CASE | `PUBLIC`, `USERNAME_TAKEN` |
| ID | UUIDv7, as a string in JSON | `"01934f6e-8b1c-7a3d-9e4f-2b5c6d7e8f90"` |
| Kafka topic | `pixora.<service>.<aggregate>`; dead letters `<topic>.DLT` | `pixora.post.post`, `pixora.post.post.DLT` |
| Event type | PascalCase, past tense | `PostCreated`, `UserFollowed` |
| Redis key | `pixora:<owner>:...` | `pixora:feed:timeline:<userId>` |
| Database | the service's short name | `post`, `user`, `engagement` |
| Table and column | snake_case, singular table names | `outbox`, `processed_event`, `created_at` |

## 2. Java code layout

Each service is organized **by feature**, the structure shown in the Spring Boot reference documentation ("Structuring Your Code"). Example for user-service:

```
io.github.jaouadioussama.pixora.user
├── UserServiceApplication.java
├── profile/                    one package per feature
│   ├── package-info.java        @NullMarked
│   ├── ProfileController.java
│   ├── ProfileService.java
│   ├── ProfileRepository.java
│   ├── Profile.java             JPA entity
│   ├── ProfileResponse.java     API DTO (record)
│   ├── UpdateProfileRequest.java
│   ├── ProfileMapper.java       MapStruct
│   └── ProfileCreated.java      event payload (record)
├── follow/
│   └── ...
├── outbox/                     event publishing (ADR-0007), used by the features
└── config/                     Spring configuration, security, the global error handler
```

Rules:

- **A feature is one package.** Its layers (controller, service, repository, entity, DTOs, mapper) are classes inside it, not sub-packages. A task usually touches one package.
- **Package-private by default.** A class is `public` only when another package really needs it. Controllers, repositories and most services stay package-private.
- **No hexagonal or clean-architecture layering** by default: these services are mostly CRUD plus events, and ports and adapters would add ceremony without benefit. A service that grows complex domain logic can change its layout through an ADR.

**Enforced by ArchUnit** (a test in every service):

1. No dependency cycles between feature packages.
2. Controllers never use repositories directly; they go through a service.
3. JPA entities never leave their feature: they never appear in controller signatures, DTOs or event payloads.
4. Only the `outbox` package publishes to Kafka.

## 3. Java coding rules

- **Records** for DTOs, event payloads, configuration properties and value objects.
- **No Lombok.** Records cover most of its uses, and it conflicts with Error Prone, NullAway and new Java versions.
- **MapStruct** maps entities to DTOs and back (generated at compile time, no reflection). No mapping logic in controllers.
- **Null safety:** every package has `package-info.java` with `@NullMarked`; a value that can be null is annotated `@Nullable` ([JSpecify](https://jspecify.dev/)). NullAway checks this at compile time.
- **Constructor injection only**, with `final` fields. No field injection (`@Autowired` on fields).
- **Request validation** with Bean Validation annotations on request records and `@Valid` in controllers.
- **Configuration comes from environment variables** through `@ConfigurationProperties` records. No environment-specific values in the code or the image ([deployment.md](deployment.md)).
- **Database schema changes go through versioned Flyway migrations**: plain SQL, `V<NNN>__<what_it_does>.sql`, never edited once applied; Hibernate only validates (`ddl-auto=validate`). See [ADR-0019](decisions/0019-flyway-database-migrations.md).
- **Synchronous calls to another service** always go through Resilience4j and forward the user's JWT ([architecture.md](architecture.md#3-cross-cutting-rules)).

### Test names

- Java: test methods describe the behaviour: `shouldRejectSignupWhenUsernameIsTaken()`. The body has three parts separated by a blank line: given, when, then.
- Unit and slice test classes end in `Test` (run by Surefire); integration and contract test classes end in `IT` (run by Failsafe).
- Angular: `it('rejects sign-up when the username is taken', ...)`, grouped with `describe` per component or service.

## 4. API conventions

Rules for every HTTP API. [Spectral](https://github.com/stoplightio/spectral) checks the OpenAPI files in the hub against them, so they are enforced, not just written down. They follow the IETF RFCs where one exists, and the common choice of the major public API guidelines (Microsoft, Google, Zalando) where none does.

### 4.1 Contract-first

1. A new or changed endpoint is written in **OpenAPI 3.1** in the hub (`contracts/openapi/`) first, in its own PR.
2. The service then implements it in a second PR. Controllers are written by hand; **contract tests** prove that responses match the spec.
3. pixora-web uses a client **generated from the same spec**, so a contract change the frontend has not followed breaks its build.

### 4.2 URLs and versioning

- Resources are **plural nouns** in kebab-case; IDs are path segments: `/api/v1/posts/{postId}/comments/{commentId}`.
- Actions are expressed with HTTP methods, not verbs in the path. A relationship is a resource set with idempotent `PUT` and removed with `DELETE`: `PUT /api/v1/me/following/{userId}` follows, `DELETE` unfollows.
- **The major version is in the path: `/api/v1/...`.** Spring Framework 7's API versioning resolves it. Only a **breaking change** creates `v2`; adding an optional field or a new endpoint is not breaking. The old version keeps working for a transition period, announced with the `Deprecation` (RFC 9745) and `Sunset` (RFC 8594) response headers.
- **Routing:** the gateway receives `/api/v1/<resource>/...`, removes `/api` and forwards `/v1/<resource>/...` to the owning service. Starting map (the contracts are the source of truth):

  | Public path | Service | Path seen by the service |
  |---|---|---|
  | `/api/v1/me`, `/api/v1/me/**` | user-service | `/v1/users/me`, `/v1/users/me/**` |
  | `/api/v1/users/**` | user-service | `/v1/users/**` |
  | `/api/v1/posts/{postId}/likes/**`, `/api/v1/posts/{postId}/comments/**` | engagement-service (these routes are matched before the general `/posts` route) | `/v1/posts/{postId}/likes/**`, `/v1/posts/{postId}/comments/**` |
  | `/api/v1/posts/**` | post-service | `/v1/posts/**` |
  | `/api/v1/feed` | feed-service | `/v1/feed` |
  | `/api/v1/search/**` | search-service | `/v1/search/**` |

  `/media/**` (photos) is not part of the versioned API ([media.md](media.md)). ADR-0006 mentions `/api/me`; its versioned path is `/api/v1/me`.

### 4.3 Requests and responses

- **JSON with camelCase** field names.
- **Dates and times:** RFC 3339 in UTC (`2026-11-03T09:15:00Z`), `Instant` in Java.
- **IDs: UUIDv7** (RFC 9562), generated by the service and sent as strings. They are time-ordered, so database indexes stay efficient, and they can't be guessed or used to count users.
- **Absent values are omitted**, not sent as `null`. Empty lists are sent as `[]`.
- **Enums** are UPPER_SNAKE_CASE strings. Clients must accept values they don't know yet.
- **Partial updates** use `PATCH` with JSON Merge Patch (RFC 7396, `application/merge-patch+json`). `PUT` replaces a whole resource or sets a relationship.

### 4.4 Status codes

| Code | When |
|---|---|
| `200 OK` | Read or update with a response body |
| `201 Created` | Created; the `Location` header points to the new resource |
| `204 No Content` | Success with nothing to return (`DELETE`, relationship `PUT`) |
| `400 Bad Request` | Malformed or invalid input; field errors are listed in `errors` |
| `401 Unauthorized` | Not logged in (the gateway never redirects `/api/**` requests) |
| `403 Forbidden` | Logged in but not allowed |
| `404 Not Found` | Doesn't exist, or the caller isn't allowed to know it exists |
| `409 Conflict` | A business rule conflict: username taken, already following |
| `412 Precondition Failed` | The resource changed since the client read it (see 4.6) |
| `422 Unprocessable Content` | An `Idempotency-Key` was reused with a different request body |
| `428 Precondition Required` | An update without the required `If-Match` header |
| `429 Too Many Requests` | Rate limited by the gateway (per user, in Redis), with a `Retry-After` header |
| `500` / `503` | Unexpected error / a dependency is unavailable; never with internal details |

### 4.5 Errors: RFC 9457 Problem Details

Every error response is `application/problem+json`:

```json
{
  "type": "https://github.com/JaouadiOussama/pixora/blob/main/contracts/problem-types.md#username-taken",
  "title": "Username already taken",
  "status": 409,
  "detail": "The username 'sara.k' is already used by another account.",
  "instance": "/api/v1/me",
  "code": "USERNAME_TAKEN",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

- Standard members: `type`, `title`, `status`, `detail`, `instance`. `type` is `about:blank` when the status code says it all; otherwise it identifies the problem type in the hub's problem catalog (`contracts/problem-types.md`, created with the first specific error).
- Pixora extensions:
  - `code`: a stable, machine-readable code (UPPER_SNAKE_CASE). Angular chooses the message to show from it, never from `detail`.
  - `errors`: for `400`, the list of field errors: `[{ "field": "username", "code": "TOO_SHORT", "message": "..." }]`.
  - `traceId`: the OpenTelemetry trace id, to find the request in Jaeger.
- Each service has **one global exception handler** in `config/`, built on Spring's `ProblemDetail`. Stack traces, SQL and class names never reach a response.

### 4.6 Pagination, concurrency and retries

- **Cursor pagination everywhere:** `GET /api/v1/feed?limit=20&cursor=<opaque>` returns `{ "items": [...], "nextCursor": "<opaque>" }`. `nextCursor` is absent on the last page. The default `limit` is 20 and the maximum is 100. The cursor is opaque: clients never build or parse it. Each endpoint has a fixed order (for example newest first). Offset pagination (`?page=3`) is not used: on data that changes while you scroll it returns duplicates or skips items. Spring Data's keyset scrolling implements cursors.
- **Optimistic concurrency on updates:** a resource that can be edited returns an `ETag` (from the JPA `@Version` field). Updates must send `If-Match` with that value; a stale value gets `412`, a missing one `428`. This stops two tabs from silently overwriting each other.
- **Idempotent creation:** `POST /api/v1/posts` requires an `Idempotency-Key` header (a UUID generated by the client per user action). The same key with the same body returns the original response instead of creating a second post; the same key with a different body gets `422`. Keys are kept for 24 hours.
- `GET`, `PUT` and `DELETE` are idempotent by definition (RFC 9110) and safe to retry.

## 5. Event conventions

The event format, topics and delivery rules are in [events.md](events.md). In addition:

- `eventId` is a **UUIDv7**; `occurredAt` follows the same date rule as the API (4.3).
- Event types are PascalCase in the past tense: they state a fact that happened (`PostCreated`), never a command (`CreatePost`).
- Every event is described in AsyncAPI in the hub (`contracts/asyncapi/`) **before** a service produces it, in its own PR, like an API change.
- Event payloads are records in the producing feature's package, separate from the entity and from the API DTOs.

## 6. Angular conventions (pixora-web)

### Layout

The app is organized **by feature**, as the Angular style guide recommends:

```
src/app/
├── core/          app-wide singletons: auth (/api/v1/me), HTTP interceptors, error handling, the layout shell
├── shared/ui/     reusable presentational components (button, avatar, photo grid)
├── api/           the generated OpenAPI client, never edited by hand
├── auth/
├── profile/
├── feed/
├── post/
└── search/        one folder per feature, each lazy-loaded by its route
```

- **No folders by type** (`components/`, `services/`).
- **File names without type suffixes** (`user-profile.ts`, `user-profile.html`), the Angular CLI default since v20.
- **Features never import from each other.** They share only through `core`, `shared` and `api`; an ESLint boundaries rule enforces it.

### Patterns (locked by ADR-0005)

- **Standalone components** only, no NgModules.
- **Signals** for state: `signal`, `computed`, `linkedSignal`; RxJS only where streams are really needed (for example debounced search input).
- **Zoneless** change detection and **OnPush** components.
- **Signal Forms** for forms.
- **Built-in control flow** in templates: `@if`, `@for` (with `track`), `@switch`, `@defer`.
- `input()`, `output()` and `model()` instead of the decorators; `inject()` instead of constructor parameters.
- Functional route guards, resolvers and HTTP interceptors.
- Every feature route is **lazy-loaded**.
- No `any`; the generated API types are used end to end.
- The app holds **no tokens**: it calls the gateway with the session cookie, and Angular's built-in XSRF support sends the CSRF header ([authentication.md](authentication.md)).

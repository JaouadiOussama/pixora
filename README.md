# Pixora

Pixora is a photo-sharing platform built as a set of Spring Boot microservices with an Angular frontend.

This is the **hub repository**. It holds what all services share:

- `docs/`: architecture, workflows and the decision records (ADRs)
- `contracts/`: OpenAPI (sync APIs) and AsyncAPI (Kafka events). *(coming)*
- `compose/`: Docker Compose for the full system. *(coming)*
- `e2e/`: Playwright end-to-end tests. *(coming)*
- Reusable CI workflows and the merge gate. *(coming)*

## Repositories

| Repo | Role |
|---|---|
| `pixora` | This hub |
| `pixora-gateway` | Spring Cloud Gateway: the single entry point and the BFF for authentication |
| `pixora-user-service` | Profiles and the follow graph |
| `pixora-post-service` | Photo posts, captions, hashtags, uploads |
| `pixora-feed-service` | Home feeds |
| `pixora-engagement-service` | Likes and comments |
| `pixora-search-service` | Username and hashtag search |
| `pixora-web` | Angular frontend |

## Start here

1. [Architecture](docs/architecture.md)
2. [Authentication workflow](docs/authentication.md)
3. [Events and the transactional outbox](docs/events.md)
4. [Photo upload and serving](docs/media.md)
5. [Search](docs/search.md)
6. [Build, release and deployment](docs/deployment.md)
7. [Decision records](docs/decisions/README.md)

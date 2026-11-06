# Pixora

Pixora is a photo-sharing platform built as a set of Spring Boot microservices with an Angular frontend.

This is the **hub repository**. It holds what all services share:

- `docs/`: architecture, workflows and the decision records (ADRs)
- `agents/`: the AI team: how a task moves through it, and the skills every agent follows
- `contracts/`: OpenAPI (sync APIs) and AsyncAPI (Kafka events). _(coming)_
- `compose/`: Docker Compose for the full system. _(coming)_
- `e2e/`: Playwright end-to-end tests. _(coming)_
- Reusable CI workflows and the merge gate. _(coming)_

## Repositories

| Repo                        | Role                                                                        |
| --------------------------- | --------------------------------------------------------------------------- |
| `pixora`                    | This hub                                                                    |
| `pixora-gateway`            | Spring Cloud Gateway: the single entry point and the BFF for authentication |
| `pixora-user-service`       | Profiles and the follow graph                                               |
| `pixora-post-service`       | Photo posts, captions, hashtags, uploads                                    |
| `pixora-feed-service`       | Home feeds                                                                  |
| `pixora-engagement-service` | Likes and comments                                                          |
| `pixora-search-service`     | Username and hashtag search                                                 |
| `pixora-web`                | Angular frontend                                                            |

## Start here

1. [Architecture](docs/architecture.md)
2. [Authentication workflow](docs/authentication.md)
3. [Events and the transactional outbox](docs/events.md)
4. [Photo upload and serving](docs/media.md)
5. [Search](docs/search.md)
6. [Build, release and deployment](docs/deployment.md)
7. [Engineering guidelines](docs/engineering-guidelines.md): branches, pull requests, tests, code quality, CI checks
8. [Conventions](docs/conventions.md): names, code layout, API rules, Angular patterns
9. [Decision records](docs/decisions/README.md)
10. [The AI team and its skills](agents/README.md)

## License

[Apache License 2.0](LICENSE). See [NOTICE](NOTICE).

# 0017. Apache License 2.0

- Status: Accepted
- Date: 2026-11-03

## Context

All Pixora repositories are public. Without a license, code is "all rights reserved": it can be read but not legally reused. The project needs a clear, standard license.

## Decision

- Every Pixora repository is licensed under the **Apache License 2.0**: the unmodified license text in `LICENSE` (so GitHub detects it), the copyright line ("Copyright 2026 Oussama Jaouadi") in a `NOTICE` file as the Apache Software Foundation recommends, and a license line in the README.
- No license header in each source file.

## Consequences

- Anyone may use, modify and redistribute the code, including commercially, if they keep the copyright and license notices and state their changes.
- Contributors grant a patent license for their contributions, and the license gives no right to use the Pixora name or marks.
- Third-party components that run as separate containers (Keycloak, Elasticsearch, Kafka, Redis, PostgreSQL) keep their own licenses and don't affect Pixora's.

## Alternatives considered

- **MIT:** the most common license on GitHub and shorter, but without an explicit patent grant or trademark clause, and less usual in the Java ecosystem.
- **GPL / AGPL:** would force anyone reusing the code to open their own; too restrictive for a portfolio project meant to be read and reused.
- **No license:** nobody could legally reuse the code.

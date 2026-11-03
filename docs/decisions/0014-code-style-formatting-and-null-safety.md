# 0014. Code style, formatting and null safety

- Status: Accepted
- Date: 2026-11-02

## Context

Code is written by several agents and by the owner. Without enforced formatting, diffs fill with style noise and reviews waste time on it. `NullPointerException` remains the most common Java runtime bug. The rules must be checked by tools, not by reviewers.

## Decision

- **Java:** Google Java Style, applied by google-java-format through the Spotless Maven plugin; CI runs `spotless:check`.
- **Null safety:** JSpecify annotations (`@NullMarked` on every package, `@Nullable` where null is allowed), checked at compile time by NullAway inside Error Prone, the approach Spring Framework 7 adopted. Error Prone's bug patterns are on too. No Checkstyle.
- **TypeScript / Angular:** Prettier for formatting; ESLint with angular-eslint and typescript-eslint (strict, type-checked) for correctness; TypeScript `strict` and Angular strict templates.
- **All repositories:** `.editorconfig`; CI is the gate, not git hooks; agents format and lint before each commit.
- **Hub:** Prettier for Markdown and YAML; Spectral lints the OpenAPI and AsyncAPI files.
- **Security scanning:** CodeQL, secret scanning with push protection, Dependabot, dependency review on PRs, and Trivy for images.

Details: [engineering-guidelines.md](../engineering-guidelines.md#5-code-style-and-static-analysis).

## Consequences

- Diffs only contain real changes; formatting is never discussed in review.
- Possible null dereferences fail the build instead of reaching production.
- Google style uses 2-space indentation and 100 columns, which differs from IntelliJ's defaults; the google-java-format IntelliJ plugin keeps the editor in line.
- Error Prone adds some compile time.

## Alternatives considered

- **Palantir Java Format** (Google-based, 4 spaces, 120 columns, nicer lambda layout): a good option, but Google Java Style is the more widely recognized standard.
- **Spring's own formatter (spring-javaformat):** made for Spring's codebase, less common elsewhere.
- **Checkstyle:** overlaps with the formatter for layout, and with Error Prone and Sonar for the rest.
- **Pre-commit hooks:** slow every commit and can be skipped with `--no-verify`; CI is the reliable gate.

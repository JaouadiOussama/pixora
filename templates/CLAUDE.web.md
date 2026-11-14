<!--
Template for the CLAUDE.md of pixora-web. Copy it to the repo root as CLAUDE.md in the repo's first PR,
replace every <placeholder> and delete this comment. The npm script names below are the ones the repo's
package.json must define. Keep the file short: it is loaded into every session in the repo.
-->

# pixora-web

The Angular app of Pixora. It is served by the gateway on the same origin as the API, holds no tokens, and calls `/api/v1/...` with the session cookie.

The rules for all Pixora repositories live in the hub (https://github.com/JaouadiOussama/pixora), checked out next to this repository. This file holds what is specific to this one.

## Before you code

- Read, in the hub: `docs/conventions.md` section 6 (Angular layout and patterns), `docs/authentication.md` (what the app does at login, logout and on a `401`), and the workflow doc for the screen you build.
- The angular-frontend skill is the working checklist.
- The API comes from the hub's `contracts/openapi/`. Regenerate the client after a contract change; never write a URL or a DTO by hand.

## Commands

| What                          | Command                                       |
| ----------------------------- | --------------------------------------------- |
| Install                       | `npm ci`                                      |
| Format                        | `npm run format`                              |
| Lint                          | `npm run lint`                                |
| Tests (Vitest, with coverage) | `npm test`                                    |
| Production build              | `npm run build`                               |
| Regenerate the API client     | `npm run api:generate`                        |
| Run locally                   | <command, once the hub's Compose file exists> |

## This repository

- Angular <version>, zoneless, standalone components. Features in `src/app/<feature>/`, lazy-loaded; `core/` for app-wide services; `shared/ui/` for presentational components; `src/app/api/` is generated.

## Rules

1. **Test first**, with Angular Testing Library: find elements by role, label or text, and assert what the user sees.
2. **`src/app/api/` is generated:** never edit it by hand; regenerate it with `npm run api:generate`.
3. **Features never import from each other**; they share through `core/`, `shared/` and `api/`.
4. **Modern Angular only:** signals, `OnPush`, `input()`/`output()`, `inject()`, `@if`/`@for` with `track`, Signal Forms. No NgModules, no `*ngIf`.
5. **Every screen that loads data has loading, empty and error states, and works with the keyboard.** No tokens or personal data in `localStorage`.

## Lessons

<!-- finalize-task adds one line per mistake made twice in this repo: the rule, then the two PRs. -->

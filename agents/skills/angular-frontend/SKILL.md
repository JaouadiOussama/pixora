---
name: angular-frontend
description: How Pixora's Angular app (pixora-web) is written and tested. Use whenever you write, groom or review code in pixora-web.
---

# angular-frontend

The rules live in `docs/conventions.md` section 6 and ADR-0005; this skill is the working checklist. When this skill and a doc disagree, the doc wins: report it to the Tech Lead.

## Stack

Angular 22, TypeScript strict + strict templates, Node 26, Vitest + Angular Testing Library, Prettier, ESLint (angular-eslint + typescript-eslint strict type-checked).

## Writing a feature

- **Where:** `src/app/<feature>/`, lazy-loaded by its route. Shared presentational components in `shared/ui/`, app-wide services (auth, interceptors, error handling, the shell) in `core/`. Features never import from each other.
- **File names** without type suffixes: `user-profile.ts`, `user-profile.html`, `user-profile.scss`.
- **Components:** standalone, `ChangeDetectionStrategy.OnPush`, zoneless. `input()`, `output()`, `model()`; `inject()` for dependencies.
- **State:** `signal`, `computed`, `linkedSignal`. RxJS only for real streams (debounced search input, for example), converted at the edge with `toSignal`.
- **Templates:** `@if`, `@for` with `track`, `@switch`, `@defer`. No `*ngIf` / `*ngFor`.
- **Forms:** Signal Forms, with validation messages chosen from the API's problem `code` for server errors, never from `detail`.
- **HTTP:** only through the **generated client** in `src/app/api/` (never edited by hand, regenerated from the hub's OpenAPI when a contract changes). No hand-written URLs or DTO interfaces; no `any`.
- **Auth:** the app holds no tokens. It calls same-origin `/api/v1/...` with the session cookie; Angular's built-in XSRF support sends the CSRF header; the current user comes from `GET /api/v1/me`. A `401` sends the user to login.
- **Routing:** functional guards, resolvers and interceptors.
- **Errors and loading:** every screen that loads data shows a loading state, an empty state and an error state.
- **Accessibility (WCAG 2.2 AA):** semantic HTML first; every input has a label; every photo has `alt` text; everything works with the keyboard and has a visible focus; colour contrast meets AA.
- **Photos:** use the sizes the API gives (320 px for grids, 1080 px for the post view), `loading="lazy"` below the fold, with `width`/`height` set to avoid layout shift.

## Testing

- **Component tests** with Angular Testing Library: find elements by role, label or text, interact like a user (`userEvent`), assert what the user sees. Don't test internals (private methods, signals directly).
- **HTTP** with `HttpTestingController`: assert the request (method, URL, body) and test success, error (problem response) and loading.
- **Services and pure functions:** plain Vitest unit tests.
- Names: `it('rejects sign-up when the username is taken', ...)`, grouped with `describe` per component or service.
- New code coverage ≥ 80% (Sonar gate).
- Critical journeys get a Playwright test in the hub's `e2e/` (planned by the Tech Lead as its own sub-issue).

## Commands

The exact scripts are in pixora-web's `CLAUDE.md` and `package.json`: format (Prettier write), lint (ESLint), test (Vitest with coverage), build (production build), and the API client generation.

## Review focus

Generated client used everywhere; no feature-to-feature imports; OnPush + signals (no manual subscriptions left open); `track` in every `@for`; the three states (loading, empty, error); accessibility basics; no tokens or user data in `localStorage`.

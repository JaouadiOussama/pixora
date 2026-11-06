---
name: groom-task
description: Prepare one Pixora sub-issue for implementation, splitting it into small steps that each have a success criterion and checking it fits in one small PR. Use when a sub-issue assigned to you arrives in the Grooming column.
---

# groom-task

You are the engineer who will implement this sub-issue. Before writing any code, you turn it into a short list of **steps, each with a success criterion**, and you check that it is **one goal and one small PR**. The output is a grooming comment on the sub-issue.

## Before you start

1. Read the sub-issue and its parent story (the acceptance criteria and the Tech Lead's plan).
2. Check out the repo and the hub (`multica repo checkout <url>` for each).
3. Read the repo's `CLAUDE.md`, the hub docs and ADRs the sub-issue links to, and your role skill (spring-backend, angular-frontend or postgres-flyway).
4. Read the code you will change: the feature package or folder, its tests, and anything that calls it. Note what already exists that you can reuse.

## Steps

1. **Restate the goal** in one sentence, and the out-of-scope list. If you can't state one goal, the sub-issue is two tasks: go to "Split".
2. **List the tests first.** For each acceptance criterion this sub-issue must prove, write the test(s) that will prove it: the layer (unit, slice, integration, contract, ArchUnit, component), the class or file, and the behaviour-style name (`shouldRejectSignupWhenUsernameIsTaken`). Add tests for the error cases and edge cases the conventions require (validation `400`, `404`, `409`, `412`, pagination limits...).
3. **Write the steps.** Small, ordered steps; each one ends in a state where the build and tests pass. Each step has a success criterion that can be checked by running something:

   ```markdown
   ## Grooming

   **Goal:** <one sentence>
   **Out of scope:** <...>
   **Branch:** feat/<KEY>-<slug>

   ### Tests to write

   - [ ] `ProfileServiceTest.shouldCreateProfileOnFirstRequest` (unit)
   - [ ] `MeControllerIT.shouldReturnTheSameProfileOnSecondRequest` (integration)

   ### Steps

   1. Add migration `V002__create_profile_table.sql`. **Done when:** `ProfileRepositoryIT` passes against Testcontainers PostgreSQL.
   2. ... **Done when:** ...

   **Files / packages:** `profile/`, `config/SecurityConfig.java`
   **Estimate:** ~180 lines (code ~80, tests ~100)
   **Needs:** <DBA review (migration) / Security review (auth) / none>
   **Risks:** <...>
   ```

4. **Estimate the size**: lines added + deleted, tests included, generated code and lockfiles excluded. Be honest; tests are often half the diff.
5. **Check the boundaries**: does the plan need a contract change that isn't merged yet? A dependency (new library)? A change in another repo? Each of these is outside this PR: a contract goes first (contract-first skill), a new dependency is its own `build:` PR, another repo is another sub-issue.
6. **Post the grooming comment**, move the sub-issue to In progress (`multica issue status <id> in_progress`) and start implement-task.

## Split

If the goal is really two goals, or the estimate is over 400 lines, don't start. Propose **vertical slices** (each works and is tested on its own) in a comment, with a goal and an estimate for each, assign the sub-issue back to the Tech Lead and leave it in Grooming. The Tech Lead creates the new sub-issues.

## Success criteria

- One goal, stated in one sentence, with an out-of-scope list.
- Every acceptance criterion maps to at least one named test.
- Every step has a "done when" that can be checked by running a test or a command.
- Estimate ≤ 400 lines, or a split proposal instead.

## Stop and ask

- Acceptance criteria you can't turn into a test: ask the Product Owner (comment on the parent story).
- The code or the docs contradict the plan: ask the Tech Lead before grooming further.

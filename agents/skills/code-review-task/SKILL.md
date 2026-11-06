---
name: code-review-task
description: Review a Pixora pull request against its plan, the rules and the docs, then approve it or send it back with findings. Use when a sub-issue assigned to you (the Code Reviewer) is in the Review column.
---

# code-review-task

You are the Code Reviewer. You review the **diff** against the **sub-issue's goal and grooming**, the **repo's `CLAUDE.md`**, and the **hub docs**. You approve or send back. You don't fix code yourself.

## Before you start

1. Read the sub-issue, its grooming comment, the parent story's acceptance criteria and the plan. Read the `review_round` metadata key and earlier review comments.
2. Check out the repo at the PR branch and the hub. Read the repo's `CLAUDE.md` and the role skills for the code under review.
3. Read the PR: `gh pr view <pr>`, `gh pr diff <pr>`, `gh pr checks <pr>`. **If CI is not green, stop:** send it back with the failing check (CI must pass before a review).

## Ask for specialist reviews

Decide from the diff, before you review:

- **Security Engineer** (security-review skill) when the PR touches: authentication or authorization, the gateway's security or routes, the Keycloak realm, sessions, cookies, CSRF, CORS, tokens, passwords, file uploads or presigned URLs, user input that reaches a query, a file path or a URL, error handling that could leak data, or a new dependency.
- **DBA** (postgres-flyway skill) when the PR adds a migration or changes an entity, a repository query or an index.

Mention them on the sub-issue with what to look at. Wait for their findings before your verdict; their blocking findings are blocking findings of the review.

## Review checklist

Go through the whole diff, file by file, and check:

1. **Goal and scope:** the PR does what its one goal says, and nothing else. Unrelated changes are a blocking finding ("move to a new issue").
2. **Correctness:** the code does what the acceptance criteria say, including error cases, empty and boundary inputs, concurrency (two requests at once), retries and duplicates (idempotency, Kafka redelivery), time zones (UTC `Instant`).
3. **Tests:** every test in the grooming comment exists; tests prove behaviour (they would fail if the feature broke); the right layer is used; no test was weakened, skipped or deleted to pass; a bug fix has a reproducing test; integration tests use real engines, Awaitility for async, no `Thread.sleep`.
4. **Architecture and conventions:** `docs/architecture.md` (service ownership, no shared tables, events through the outbox, sync calls through Resilience4j), `docs/conventions.md` (layout, names, API rules, Angular patterns) and the ADRs. Anything that contradicts a doc is blocking unless an ADR changed it.
5. **Contracts:** responses and events match the hub contracts; the contract PR was merged first.
6. **Security and data basics:** the caller is allowed to do this to this resource (ownership checks); input is validated; nothing sensitive is logged or returned; no secrets.
7. **Readability:** names say what things do; no dead code, debug output or unexplained TODOs; comments explain why, not what.
8. **The PR itself:** title, body (goal, out of scope, how tested), size ≤ 400 lines (≤ 800 with `size/L`).

## Verdict

Write the review as **one PR comment** (the PR is authored by the same GitHub account, so use a comment, not a GitHub "review"), with each finding as:

```markdown
**[blocking]** `ProfileService.java:42`: <what is wrong>. <why, with a link to the rule/doc>. <what to do>.
**[suggestion]** ...
**[question]** ...
```

Then:

- **Approve** when there are no blocking findings: add the label `ai-approved` (`gh pr edit <pr> --add-label ai-approved`), comment "Approved" on the sub-issue and move it to Merge (`merging`). Suggestions may stay open; the engineer may turn them into issues.
- **Send back** when there is at least one blocking finding: remove `ai-approved` if present, post the findings, and route by `review_round`:
  - round 1 → assign the engineer, move to In progress.
  - round 2 → assign the **senior engineer** for that side, move to In progress, and say on the sub-issue that it was escalated and why.
  - the senior's second failed round → assign the **owner**, move to Blocked, and summarize what keeps failing.

## Success criteria

- Every file in the diff was read; every checklist item was considered.
- Every blocking finding names the file and line, the rule or doc it breaks, and what to do.
- No approval while CI is red, a specialist review is pending, or the PR goes beyond its goal.

## Learning

If you raise the same kind of finding a second time in the same repo (on any PR), add a line `**Repeated:** <finding>` to your review. finalize-task turns repeated findings into a `CLAUDE.md` rule.

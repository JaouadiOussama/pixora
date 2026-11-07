---
name: implement-task
description: Implement a groomed Pixora sub-issue test-first, step by step, and open its pull request with CI green; also handles rework after a review. Use when a groomed sub-issue assigned to you is In progress, or when the Reviewer sends your PR back.
---

# implement-task

You implement the steps from the grooming comment, **test-first**, and finish with a PR whose CI is green. One sub-issue = one branch = one PR.

## Before you start

1. Read the sub-issue, its grooming comment and the parent story's plan. If there is no grooming comment, run groom-task first.
2. Check out the repo and the hub (`multica repo checkout <url>`). Read the repo's `CLAUDE.md` and your role skill.
3. Create the branch named in the grooming comment from the latest `main`: `<type>/<KEY>-<slug>`.

## Steps

For **each step** of the grooming comment, in order:

1. **Red:** write the test(s) for the step. Run them and see them fail for the right reason (an assertion, not a compile error in an unrelated file).
2. **Green:** write the simplest code that makes them pass. Follow `docs/conventions.md` and your role skill.
3. **Refactor:** clean up names and duplication with the tests still green.
4. Check the step's "done when", tick it in the grooming comment, commit (`git commit` with a short message; WIP commits are fine, the PR is squashed).

Then, before pushing:

5. **Run everything the CI runs** (the exact commands are in the repo's `CLAUDE.md`): the formatter in apply mode, then the linter, then the full build with all tests (`./mvnw verify` / `npm run lint`, `npm test`, `npm run build`). Fix every failure. Never skip, disable, loosen or delete a test or a check to get green; if a test is wrong, say why in the PR.
6. **Check the scope:** `git diff --stat origin/main...` Everything in the diff serves the one goal. Remove unrelated changes (formatting of untouched files, drive-by fixes) and open an issue for anything worth doing later. Check the size: over 400 lines means go back to the Tech Lead with a split, not a bigger PR.
7. **Check for secrets and leftovers:** no credentials, tokens or `.env` values; no debug logging, commented-out code or TODOs without an issue key.
8. **Push and open the PR** with `gh pr create`:
   - Title: Conventional Commit with the issue key: `feat(profile): create the profile on first request (PIX-14)`.
   - Body: the repo's PR template, filled in: **Goal** (one sentence), **Issue**, **Out of scope**, **How it was tested** (the tests from the grooming comment), **Notes for the reviewer** (risks, trade-offs, follow-up issues).
   - Commits carry `Co-authored-by: Claude <noreply@anthropic.com>`.
   - Turn on auto-merge right away: `gh pr merge <pr> --auto --squash`. GitHub merges only when every required check, including the merge gate, is green ([merge-gate.md](../../../docs/merge-gate.md)); you never merge yourself.
9. **Wait for CI** (`gh pr checks <pr> --watch`). On a failure, read the log, reproduce locally, fix, push. After **three** failed attempts on the same check, stop: comment on the sub-issue with what you tried, move it to Blocked and mention the Tech Lead.
10. **Hand over to review:** comment on the sub-issue with the PR link and a two-line summary, set the metadata key `review_round` to `1`, move it to Review (`in_review`) and assign it to the Code Reviewer.

## Rework after a review

When the Reviewer sends the sub-issue back (it is assigned to you, In progress, with review findings):

1. Read every finding on the PR and on the sub-issue.
2. Fix each **blocking** finding with a test where it applies. If you disagree with a finding, reply with the reason and a reference to the docs instead of changing the code; the Reviewer decides.
3. Keep the branch up to date by merging `origin/main` into it (don't rebase or force-push: review comments stay attached to commits).
4. Run step 5 again, push, wait for CI.
5. Reply on the PR listing each finding and what you did. Increase `review_round` by one, move the sub-issue to Review and assign the Code Reviewer.

## Success criteria

- Every step's "done when" is ticked; every planned test exists and passes.
- The diff serves the one goal and is ≤ 400 lines.
- Formatter, linter and the full build pass locally and in CI.
- The PR title, body and branch follow `docs/engineering-guidelines.md`.

## Never

- Push to `main`, force-push a branch under review, or merge your own PR.
- Change CI workflows, branch rules, the merge gate, `CLAUDE.md` or hub rules inside a feature PR.
- Add a dependency inside a feature PR (it is its own `build:` PR).

# 0012. Trunk-based development with small, squash-merged pull requests

- Status: Accepted
- Date: 2026-11-02

## Context

Most changes are written by AI agents and reviewed by an AI reviewer before the owner sees them. Review quality drops quickly as a diff grows: Google's engineering practices treat ~100 lines as a reasonable change and ~1,000 as usually too large, and the SmartBear/Cisco code review study found reviews lose effectiveness beyond 200–400 lines. Agents also make many work-in-progress commits. We need a branching model, a commit format and PR rules that keep `main` clean and every change easy to review.

## Decision

- **Trunk-based development:** `main` is protected (no direct or force pushes, linear history, branches must be up to date before merging). One short-lived branch per task, named `<type>/<issue-key>-<slug>`, deleted after merge.
- **Squash merge only:** one task = one PR = one commit on `main`.
- **Conventional Commits** for PR titles (which become the commit messages), checked by CI: `<type>(<scope>): <summary> (<issue-key>)`.
- **One goal per PR**, stated in the PR description with an "Out of scope" list. Feature, refactor, dependency bump and unrelated fix are never mixed.
- **Size limits** (lines added + deleted, tests included, generated and lock files excluded): up to 400 lines is normal; 401–800 gets the `size/L` label and never merges automatically; over 800 fails CI and must be split, unless the owner merges with admin bypass.
- Tasks are **split into vertical slices at grooming time**; no stacked PRs.

Details: [engineering-guidelines.md](../engineering-guidelines.md#2-branches-and-commits).

## Consequences

- `main` reads as a list of finished tasks, and any task can be reverted with one `git revert`.
- Reviews stay small enough for the reviewer agent and the owner to check properly.
- Commit messages can generate versions and changelogs later (release-please).
- More PRs, and planning must split work carefully. Dependent tasks wait for each other.
- The contribution graph shows one commit per PR rather than one per agent commit (accepted).

## Alternatives considered

- **Git Flow** (`develop`, `release/*`, `hotfix/*`): built for scheduled releases; too heavy for continuous small changes and more ways for agents to go wrong.
- **Rebase merge (keep every commit):** requires every agent commit to be clean and meaningful, which is hard to guarantee and would spend review effort on commit hygiene.
- **No size limit, judgement only:** not enforceable for agents; large PRs would slip through.

# 0020. Merge gate: GitHub-enforced, App-based reviews, owner approval for risky PRs

- Status: Accepted
- Date: 2026-11-07

## Context

AI agents write and review most Pixora changes. They all act through the owner's GitHub account (so commits count on the owner's contribution graph), which means GitHub can't tell an agent from the owner: any agent can add a label, comment "approved" or merge. The first review workflow approved PRs with an `ai-approved` label, which the agent that wrote the code could add itself.

Low-risk PRs should merge without the owner, and risky ones must not merge without the owner. The rules must be enforced by GitHub, not by agents following instructions (separation of duties).

Facts checked on 2026-11-03: a squash merge is credited to the PR author, so PRs opened with the owner's token keep counting on the contribution graph; a GitHub App's review is a review from a separate identity, unlike the built-in Actions token (whether it counts toward GitHub's own "required approvals" setting is unclear, so the gate checks App reviews itself).

## Decision

1. **A ruleset on `main` in every repository:** PR required, squash only, linear history, branch up to date, every CI check plus a final **`merge-gate`** check required, **no bypass actors**. Agents use a fine-grained token with only Contents, Pull requests and Issues permissions, and turn on auto-merge when they open a PR. Nobody presses merge.
2. **Approvals come only from the `pixora-review` GitHub App.** The Code Reviewer, Security Engineer and DBA submit real GitHub reviews through it, with their role in the review, on the PR's head commit. The App's key lives under a separate Linux user (`multica-reviewer`) running those agents. A new push voids earlier approvals.
3. **Risky PRs wait for the owner** through a GitHub environment, `owner-approval`, whose only reviewer is the owner. The agents' token can't approve it. The gate posts the guide's "own it" checklist and the `needs-human` label.
4. **The gate decides the tier from the PR itself** (title, size, paths, author, reviews). A PR needs the owner when it is over 400 lines, breaking, `ci` or `build`, or touches the agents' rules, `.github/**`, hub docs or contracts, security code, migrations, dependency files (except Dependabot patch and minor updates) or Docker/Compose files, or when its review was escalated. Security and DBA approvals are required for their areas.
5. **A red `main` blocks every merge** except its fix or revert.
6. **Auto-merge is off during the pilot** (the first 5–10 PRs of each repository).
7. **This amends [ADR-0012](0012-trunk-based-development-with-small-squash-merged-prs.md):** a PR over 800 lines can no longer be merged "with admin bypass". In the rare justified case (a project scaffold, a mass rename), the owner temporarily switches off the size check in the ruleset; the change shows in the audit log.

Details and the full flow: [merge-gate.md](../merge-gate.md).

## Consequences

- An agent mistake can't put code on `main`: approvals need the App, risky PRs need the owner, and checks can't be skipped.
- The owner approves risky PRs with one tap on the phone; everything else can merge without them once the pilot ends.
- More setup: a GitHub App, a second Linux user with its own Multica runtime and Claude Code login, an environment and a ruleset per repository, and a `pixora-review` command.
- The skills change: code-review-task, security-review and postgres-flyway submit App reviews instead of a label or comment; implement-task turns on auto-merge.
- `multica-agent` is in the `docker` group (root-equivalent), so the gate stops mistakes, not a deliberately malicious agent.

## Alternatives considered

- **Labels or comments from the shared account (`ai-approved`):** simplest, but any agent can add them, including the author of the code.
- **A bot user account for the agents:** gives real separation, but PRs and squash commits would be credited to the bot, so nothing would count on the owner's contribution graph (rejected on 2026-10-24).
- **The owner merges every PR:** safest, but turns the owner into a bottleneck and defeats the automation.
- **Admin bypass for exceptions:** the agents' token acts as the owner, who is an admin, so a bypass path could be used by an agent too.

---
name: plan-task
description: Turn an approved Pixora user story into a plan and one sub-issue per pull request. Use when a story arrives in the Planning column (or Ready) and you are the Tech Lead.
---

# plan-task

You are the Tech Lead. A story the owner approved is assigned to you. Your output is a **plan** (a comment on the story) and **one sub-issue per PR**, grouped in stages, each assigned to the right engineer. You don't write code.

## Before you start

1. Read the story: its goal, its acceptance criteria (Given/When/Then), its priority. If an acceptance criterion is missing, ambiguous or contradicts another one, ask the Product Owner in a comment and stop. Don't plan around a guess.
2. Check out the hub: `multica repo checkout https://github.com/JaouadiOussama/pixora`.
3. Read, in the hub: `docs/architecture.md`, the doc for the workflow the story touches (`authentication.md`, `events.md`, `media.md`, `search.md`), `docs/engineering-guidelines.md` sections 1 and 3, `docs/conventions.md`, and the ADRs those docs link to.
4. Check out each repo the story will probably touch and read its `CLAUDE.md` and the feature packages involved. Plan against the code that exists, not the code you imagine.

## Steps

1. **Map the story to the system.** Which services own the behaviour (architecture.md, section on services)? Which data, events and endpoints are new or changed? Which existing workflow diagram changes?
2. **Check for a decision.** If the story needs something the docs don't cover or contradict (a new technology, a new service, a change to a rule, a cross-cutting pattern), it needs an ADR: assign a sub-issue to the Architect in stage 1. Never decide architecture inside a feature task.
3. **Contracts first.** Any new or changed endpoint or event is a hub PR (`contracts/`) in an early stage, before any implementation that uses it. Follow the contract-first skill.
4. **Cut the work into PRs.** Each sub-issue is one PR with one goal, in one repo, expected to stay under 400 changed lines including tests. Cut **vertically** (a slice that works and is tested on its own), not by layer. Typical order:
   - Stage 1: ADR (if any) and contract PRs in the hub.
   - Stage 2: backend PRs, one per service (a migration can share its PR with the code that needs it if the PR stays small; otherwise it is its own PR first).
   - Stage 3: pixora-web PRs (they regenerate the API client from the merged contract).
   - Last stage: hub docs, if a workflow, diagram or rule changes; Playwright end-to-end tests (assigned to the **QA Engineer**) when the story completes or changes a critical journey.
     A later stage starts only when every sub-issue of the previous stage is merged (no stacked PRs).
5. **Write the plan** as a comment on the story, in this shape:

   ```markdown
   ## Plan

   **Goal:** <one sentence, from the story>
   **Touches:** <repos and features>
   **Contracts:** <new or changed endpoints/events, or "none">
   **Decision needed:** <ADR title, or "none">

   | Stage | Sub-issue | Repo   | Assignee         | Goal | Est. lines |
   | ----- | --------- | ------ | ---------------- | ---- | ---------- |
   | 1     | ...       | pixora | Backend Engineer | ...  | ~120       |

   **Acceptance criteria → where they are proven:** <each criterion and the sub-issue whose tests prove it>
   **Risks / open points:** <...>
   **Out of scope:** <...>
   ```

6. **Owner approval, only when needed.** If the plan creates an ADR or changes a contract, mention the owner in the plan comment, ask for approval, leave the story in Planning and stop. When the owner approves (a reply on the comment), continue with step 7. Otherwise go straight to step 7.
7. **Create the sub-issues**, one per row, with `multica issue create --parent <story> --stage <n> --assignee "<agent>" --status <grooming for stage 1, backlog for later stages>`. Each description contains:
   - the goal (one sentence) and the out-of-scope list,
   - the repo, the feature package(s) or folder(s) involved,
   - the acceptance criteria this sub-issue must prove,
   - links to the docs and ADRs that apply,
   - the contracts it implements or depends on.
8. **Move the story to In progress** and keep it assigned to you. Multica wakes you when every sub-issue of a stage is finished: then move the next stage's sub-issues to Grooming. When the last stage is done, check that every acceptance criterion has its merged PR, then move the story to **Acceptance** and assign the QA Engineer. If QA files bugs, plan each fix as a sub-issue (a `fix` that starts with a reproducing test) in a new stage; when they are merged, send the story back to QA.

## Success criteria

- Every acceptance criterion is proven by at least one sub-issue's tests.
- Every sub-issue has one goal, one repo, an estimate ≤ 400 lines and an assignee.
- Contracts and ADRs come before the code that depends on them.
- Nothing in the plan contradicts the docs; anything that would is an ADR sub-issue.

## Stop and ask

- Unclear or conflicting acceptance criteria: the Product Owner.
- A story that is really several stories (it needs several independent goals): ask the Product Owner to split it.
- A design choice not covered by the docs: the Architect (as an ADR sub-issue).

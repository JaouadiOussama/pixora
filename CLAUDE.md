# Pixora hub

This repository holds what every Pixora repository shares, and no application code:

- `docs/`: the architecture, the workflows, the engineering guidelines, the conventions and the decision records (ADRs).
- `agents/`: the AI team: each agent's role, the skills they follow and the context they all share. This text is loaded into Multica, so it is the team's behaviour.
- `templates/`: the starting `CLAUDE.md` for each kind of repository.

Start from `README.md`.

## Before you change anything

- Read `docs/engineering-guidelines.md` (how work is done and merged) and `agents/README.md` (how work moves on the board).
- For a decision, read `docs/decisions/README.md` and follow the write-adr skill. An accepted ADR is history: change a decision with a new ADR that supersedes it.

## Commands

- Format the Markdown and YAML files you changed: `npx --yes prettier@3.9.10 --write <files>`. Some older docs aren't formatted yet; format only the files you change, so the diff stays about your change.

## Rules

1. **Docs describe the system as it is.** A decision, its doc and its diagram change in the same PR. Every link you add must resolve and every Mermaid diagram must render.
2. **One rule lives in one place.** The docs come first, then the skills, then the roles; link to the source instead of copying it, so two texts can't drift apart.
3. **Changes here wait for the owner.** `docs/`, `agents/`, `templates/` and this file are owner-tier paths at the merge gate ([merge-gate.md](docs/merge-gate.md)). Say in the PR body what changes for the team.
4. **Multica doesn't read this repository.** After a change to `agents/roles/` or `agents/workspace-context.md` is merged, the same text must be loaded into Multica; list that step in the PR body.
5. **The PR that adds a folder or a tool adds its commands here** (for example `contracts/` with Spectral, `compose/`, `e2e/` with Playwright, `.github/` workflows), so this file always matches the repository.

## Lessons

<!-- finalize-task adds one line per mistake made twice: the rule, then the two PRs where it happened. Example:
- Diagrams use `<br/>` for line breaks inside nodes; `\n` renders literally (#12, #15). -->

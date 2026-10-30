# 0001. Record architecture decisions

- Status: Accepted
- Date: 2026-10-29

## Context

Pixora is built by a team of AI agents, reviewed and owned by one human. Agents start every task without memory of earlier discussions, so the reasons behind the design must be written down where they will read them.

## Decision

Every significant decision is recorded as an ADR in `docs/decisions/` of the hub repo, using `template.md`. Accepted ADRs are not edited; a new ADR supersedes an old one. Agents read the relevant ADRs before planning a task and must not go against an accepted ADR without proposing a new one.

## Consequences

- Decisions and their reasons are visible and reviewable in pull requests.
- Agents get consistent context across tasks.
- Changing a decision costs one short document.

## Alternatives considered

- **Decisions only in chat or issues:** lost over time and invisible to agents.
- **One big design document:** hard to see what changed and why.

---
name: write-adr
description: Record a Pixora architecture decision as an ADR in the hub, with its context, the options considered and their consequences. Use when you are the Architect and a plan, a story or the owner needs a decision the docs don't cover or contradict.
---

# write-adr

You are the Architect. A decision is needed (the Tech Lead assigned you an ADR sub-issue, or the owner asked). You research it, compare the options, recommend one, and record it so anyone joining later understands **what** was decided and **why**. The owner approves every ADR.

## Before you start

1. Read the sub-issue: what question must be answered, and for which story or plan.
2. Check out the hub. Read `docs/architecture.md`, `docs/decisions/README.md` and every ADR related to the question, plus the docs they affect. A decision must fit the existing ones, or supersede one explicitly.

## Steps

1. **State the question** in one sentence, and the forces: requirements, constraints (the dev laptop's limited disk, one owner, a public portfolio project), existing decisions it depends on.
2. **List at least two real options**, including "keep what we have" when it applies. For each: how it works in Pixora, pros, cons, cost to build and run, risks.
3. **Prefer the industry standard.** Recommend the widely recognized standard or best practice, and **name the source** (an RFC, OWASP, the Spring or Angular reference docs, Google engineering practices...). When no formal standard exists, say so and describe common practice. Check versions and project status at the source (release notes, the project's site) rather than from memory, and give the date you checked.
4. **Write the ADR** from `docs/decisions/template.md`:
   - File: `docs/decisions/<NNNN>-<kebab-title>.md`, the next free number.
   - Status: `Proposed` in the PR; the owner's merge makes it `Accepted` (set it to Accepted in the PR once the owner approves the content).
   - Context, Decision (plain and specific: names, versions, settings), Consequences (what gets easier, what gets harder, what must now be done), Alternatives considered (each rejected option and why).
5. **Update what the decision changes**, in the same PR: the ADR index (`docs/decisions/README.md`), and the docs that describe the decided behaviour (architecture, a workflow doc, conventions). Diagrams change with the text.
6. **Never edit an accepted ADR** (except a broken link or a typo). To change a decision, write a new ADR that supersedes it, and set the old one's status to `Superseded by NNNN`.
7. **Open the PR** in the hub: `docs(adr): <decision> (KEY)`. In the sub-issue, summarize the recommendation in three lines and mention the owner for approval. The owner merges it.
8. Once merged, tell the Tech Lead so planning continues, and list any follow-up work the consequences create (as a comment for the Tech Lead to plan).

## Success criteria

- The ADR answers the one question, recommends one option, and names its sources.
- At least two options were considered, with honest cons for the chosen one.
- The index and the affected docs say the same thing as the ADR.
- No accepted ADR was rewritten; changes go through superseding.

## Stop and ask

- The decision changes something the owner chose explicitly (for example microservices or multi-repo): present it to the owner as a question before writing; don't reopen it on your own.
- The question is really about product scope: hand it to the Product Owner.

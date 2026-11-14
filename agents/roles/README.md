# Agent roles

One file per agent. Each file says **who the agent is and where its job stops**; the skills in [`../skills/`](../skills/) say **how** to do each kind of task. Together with the shared [workspace context](../workspace-context.md) they are everything an agent is told, so they are reviewed and versioned like code.

## The roles

| Role                     | File                                                       | Model      | Thinking | Runtime          | Skills                                                                                               |
| ------------------------ | ---------------------------------------------------------- | ---------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| Product Owner            | [product-owner.md](product-owner.md)                       | Opus 5.5   | High     | multica-agent    | write-story                                                                                          |
| Tech Lead                | [tech-lead.md](tech-lead.md)                               | Opus 5.5   | High     | multica-agent    | plan-task, contract-first                                                                            |
| Architect                | [architect.md](architect.md)                               | Opus 5.5   | High     | multica-agent    | write-adr, contract-first                                                                            |
| Backend Engineer         | [backend-engineer.md](backend-engineer.md)                 | Sonnet 5.5 | High     | multica-agent    | groom-task, implement-task, finalize-task, spring-backend, postgres-flyway, contract-first           |
| Frontend Engineer        | [frontend-engineer.md](frontend-engineer.md)               | Sonnet 5.5 | High     | multica-agent    | groom-task, implement-task, finalize-task, angular-frontend, contract-first                          |
| Senior Backend Engineer  | [senior-backend-engineer.md](senior-backend-engineer.md)   | Opus 5.5   | High     | multica-agent    | same as Backend Engineer                                                                             |
| Senior Frontend Engineer | [senior-frontend-engineer.md](senior-frontend-engineer.md) | Opus 5.5   | High     | multica-agent    | same as Frontend Engineer                                                                            |
| QA Engineer              | [qa-engineer.md](qa-engineer.md)                           | Sonnet 5.5 | High     | multica-agent    | acceptance-test, groom-task, implement-task, finalize-task                                           |
| Code Reviewer            | [code-reviewer.md](code-reviewer.md)                       | Opus 5.5   | High     | multica-reviewer | code-review-task, spring-backend, angular-frontend, postgres-flyway, security-review, contract-first |
| Security Engineer        | [security-engineer.md](security-engineer.md)               | Opus 5.5   | High     | multica-reviewer | security-review, spring-backend, angular-frontend, contract-first                                    |
| DBA                      | [dba.md](dba.md)                                           | Sonnet 5.5 | High     | multica-reviewer | postgres-flyway, spring-backend                                                                      |

Thinking is never below High. The step-up rules for models (more review rounds, CI failures, missed bugs) are in the project's team decisions; when a role changes model, change it here too.

## Loading a role into Multica

Each file has a header between `---` lines and the instructions below it.

| In the file                 | In Multica (agent settings)                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                      | Name                                                                                                                                         |
| `description`               | Description (display only; Multica never sends it to the agent)                                                                              |
| `model`, `thinking`         | Model, Thinking                                                                                                                              |
| `runtime`                   | Runtime: `multica-agent` = "Claude (jaouadi-my-laptop)"; `multica-reviewer` = the reviewers' runtime under the `multica-reviewer` Linux user |
| `skills`                    | Skills bound to the agent (imported from `../skills/`)                                                                                       |
| everything after the header | Instructions                                                                                                                                 |

The [workspace context](../workspace-context.md) is loaded once for the whole workspace (`multica workspace update --context-stdin < agents/workspace-context.md`). Multica gives it to every agent on every run, so rules shared by all agents live there instead of being copied into eleven files. When an agent is created, put its mention link in the workspace context's team table.

Changes apply from the next run. The flow for a change is: a PR to this folder (it touches `agents/**`, so it always waits for the owner at the merge gate), then the same text pasted into Multica.

**No squad for now.** Multica's squads suit work whose owner isn't known when the issue is created; here every story goes to the Tech Lead, who assigns each sub-issue directly. A squad can be added later without changing these files.

## How these files are written, and why

They follow Anthropic's guidance for prompting Claude ([prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [Claude Code best practices](https://code.claude.com/docs/en/best-practices), [subagents](https://code.claude.com/docs/en/sub-agents)) and Multica's guidance for agent instructions ([creating agents](https://multica.ai/docs/agents-create), [mentioning agents](https://multica.ai/docs/mentioning-agents)):

- **A role in one sentence, then the reason the role exists.** Claude follows a rule better when it knows why the rule is there, and can apply the reason to cases the rule didn't foresee.
- **Multica's five topics, as sections:** responsibilities (and what isn't the agent's), what to check first when work arrives, what it may change, how it delivers, when to check with someone. Plus "Done means": a check the agent can run before saying it is finished.
- **The right altitude.** Concrete commands, files and done conditions, but no scripted if-else logic; the step-by-step procedures live in the skills, loaded only when needed.
- **Short and without duplication.** Each file points to its skills and to the docs instead of repeating them, because two texts that drift apart make the agent pick one at random.
- **Plain wording.** No capitals or "MUST": current models follow plainly worded instructions and over-apply emphasized ones. Rules are phrased as what to do, with the reason.
- **Self-contained.** Each run starts fresh and an agent only receives its own instructions, so a role that builds on another (the seniors) tells the agent to read that file from the hub.
- **Stop conditions.** Every agent that mentions other agents knows when to stop replying and escalate, so two agents can't loop.

## What the prompts don't enforce

Instructions are context, not configuration: a rule that must always hold is enforced outside the prompt. In Pixora:

- **Merging** is controlled by the GitHub ruleset and the merge gate ([merge-gate.md](../../docs/merge-gate.md)): no agent can merge or skip a check, whatever its instructions say.
- **Approving** needs the `pixora-review` App key, which only the `multica-reviewer` runtime holds. The reviewers' GitHub access comes from App tokens with read access and reviews only, so they can't push code either.
- **The coding agents' token** has only Contents, Pull requests and Issues permissions, so they can't change settings, rulesets, secrets or environments.

## Improving a role

Start from these files, run the pilot, and change a role only for a failure that was actually observed: add the missing instruction or example, in the role or in the skill where it belongs. A mistake made twice by the same role becomes a line in its file (or in a repo's `CLAUDE.md` if it is about that repo).

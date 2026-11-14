# Templates

Starting files for new Pixora repositories. Each one is copied in the repository's first PR (its scaffold sub-issue), filled in, and then belongs to that repository.

| Template                               | For                                                                                     | Becomes                      |
| -------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------- |
| [CLAUDE.service.md](CLAUDE.service.md) | pixora-user-service, -post-service, -feed-service, -engagement-service, -search-service | `CLAUDE.md` at the repo root |
| [CLAUDE.gateway.md](CLAUDE.gateway.md) | pixora-gateway                                                                          | `CLAUDE.md` at the repo root |
| [CLAUDE.web.md](CLAUDE.web.md)         | pixora-web                                                                              | `CLAUDE.md` at the repo root |

## Why a repository's CLAUDE.md looks like this

Claude Code loads `CLAUDE.md` into every session in the repository, and agents read it before changing anything there. Following [Anthropic's guidance](https://code.claude.com/docs/en/memory) and the _AI for Software Engineers Guide_, it stays short and holds only what can't be found by reading the code:

- **What the repository is**, in one sentence, and which hub docs to read before coding. The rules themselves stay in the hub, linked rather than copied.
- **The exact commands** to format, test, run everything CI runs, and run locally.
- **What is specific to this repository:** its packages, its database, its API paths, its topics.
- **About five rules** that matter most here, each stated concretely.
- **Lessons:** one line per mistake made twice, added by finalize-task, so the team stops repeating it.

Keep each file well under 200 lines; a longer file is followed less reliably. Maintainer notes go in HTML comments, which Claude Code strips before loading.

Changes to these templates are owner-tier at the merge gate. A change to a template doesn't update the repositories already created from it: open a sub-issue per repository if the change should apply there too.

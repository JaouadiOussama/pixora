---
name: finalize-task
description: Close a Pixora sub-issue after its pull request is merged; check main, record follow-ups, update docs and turn repeated mistakes into rules. Use when your sub-issue's PR has been merged.
---

# finalize-task

The PR is merged (by the merge gate or by the owner). You close the loop so nothing is lost: `main` is healthy, follow-ups exist as issues, the docs are true, and repeated mistakes become rules.

## Steps

1. **Confirm the merge:** `gh pr view <pr> --json state,mergedAt,mergeCommit`. If it is not merged, stop: this skill runs only after a merge.
2. **Check `main`:** the CI run on the merge commit is green and the image was published (`gh run list --branch main --limit 3`). If `main` is red because of this PR, open a `fix` issue at top priority, link it, mention the Tech Lead, and stop here.
3. **Record follow-ups:** every suggestion the Reviewer left open, every "out of scope" item that should be done, every TODO with an issue key: make sure each has its own issue (`multica issue create`, linked to the parent story). Don't create issues for things nobody needs.
4. **Docs:** if this change altered a workflow, a diagram, a rule, an endpoint list or a config that the hub docs describe, and the plan had no docs sub-issue for it, open one for the Tech Lead. Docs are never changed inside a service PR.
5. **Lessons:** read the review comments on this PR. For each finding marked **Repeated**, propose a one-line rule for the repo's `CLAUDE.md` (or the hub's, if it applies to every repo): open a sub-issue `docs(claude): add rule ...` for the Tech Lead with the rule, the two PRs where the mistake happened, and why. One rule per PR.
6. **Close:** comment on the sub-issue with the merge commit, the follow-up issues and the lessons, then move it to Done (`multica issue status <id> done`). Multica wakes the Tech Lead when the whole stage is done.

## Success criteria

- `main` is green after the merge, or a fix issue exists.
- Every open follow-up is an issue; nothing is left only in a PR comment.
- Docs drift and repeated mistakes have issues.
- The sub-issue is Done with a closing comment.

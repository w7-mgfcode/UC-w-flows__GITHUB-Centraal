## Current repo status (as of 2025-12-15)

- Remote: https://github.com/w7-mgfcode/UC-w-flows__GITHUB-Centraal
- Default branch: `main`
- Active PR: #1 — [FIX] GitHub Actions workflow guards
  - https://github.com/w7-mgfcode/UC-w-flows__GITHUB-Centraal/pull/1
- Current local branch: `bugfix/workflow-guards`

### What happened

- Local repo was initialized and pushed to `main`, then branches were created/pushed (`01-init_REPO`, later `bugfix/workflow-guards`).
- PR #1 fixes GitHub Actions workflow parsing failures caused by unsupported `hashFiles()` expressions.
- PR #1 also makes AI review jobs skip when secrets aren’t set.

### Branch protection (current)

- 1 required approval
- Required checks currently set to: `validate` and `test-pipeline-mcp (22)`
- Linear history enabled
- Force-push and deletions disabled

### Next actions

1) Merge PR #1 into `main`.
2) Re-run Actions on `main` to confirm everything is green.
3) (Optional) Tighten required checks policy:
	- Minimal policy: `validate` + a single matrix entry like `test-pipeline-mcp (22)`
	- Stronger policy: `validate` + all `test-pipeline-mcp` matrix checks
4) (Optional) Add GitHub Actions secrets if you want AI reviews:
	- `OPENAI_API_KEY`, `SOURCERY_TOKEN` (and optionally `CODECOV_TOKEN`)

## Small summary: what this repo contains

- Governance + Copilot rules: `specs/`, `.github/copilot-instructions.md`, `AGENTS.md`
- CI workflows: `validate-pipeline.yml`, `tests.yml`, `copilot-review.yml`, plus example `pr-review-workflow.yml`
- Custom MCP server: `pipeline-mcp/` (Node+TS, Docker, unit tests + stdio integration test)
- Bilingual docs: `README.md` + `README.hu.md`, `CONTRIBUTING.md` + `CONTRIBUTING.hu.md`
- Post-publish init docs: `docs/01-create-github-repo.md`, `docs/03-init-after-publish.md`
- Maintainer info: Gabor Szabo, gabor@w7-7.net, https://w7-7.net

## Prompt for a new chat session (copy/paste)

You are GitHub Copilot (GPT-5.2 Preview) acting as a RepoOps coding agent in VS Code.

Repository:

Local path: w7-GITHUB-Centraal
Remote: https://github.com/w7-mgfcode/UC-w-flows__GITHUB-Centraal
Default branch: main
Active PR: #1 [FIX] GitHub Actions workflow guards https://github.com/w7-mgfcode/UC-w-flows__GITHUB-Centraal/pull/1
Current local branch: bugfix/workflow-guards

What’s implemented already:

Full “daily-use template” repo with specs, Copilot instructions, PR template, VS Code settings/tasks.
Pipeline MCP server in pipeline-mcp with Docker + Vitest tests including a stdio integration test.
Workflows for validation, tests, AI review, and an example PR-review chain workflow.
Docs for “create repo” and “init after publish”, plus EN/HU README/CONTRIBUTING.
Maintainer: Gabor Szabo (gabor@w7-7.net, https://w7-7.net)

Current issue/task:

GitHub Actions initially failed because workflows used hashFiles() in expressions; PR #1 removes that and gates steps via a “detect files” step output.
Branch protection is enabled; required checks currently include validate and test-pipeline-mcp (22).

Next actions to finish:

Merge PR #1 into main.
Re-run Actions on main to confirm green.
Adjust branch protection required checks (decide whether to require all test-* matrix checks or a smaller set).
Optionally add GitHub Actions secrets (OPENAI_API_KEY, SOURCERY_TOKEN) if you want AI reviews; otherwise ensure those jobs stay skipped.

Constraints:

Keep changes minimal; avoid drive-by refactors.
Follow AGENTS.md and specs as source of truth.
Ensure CI passes.
If you want, tell the next agent: “Please merge PR #1 and then tighten required checks to require validate + all pipeline-mcp tests (or specify exact list).”

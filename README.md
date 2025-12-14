# RepoOps Copilot + MCP Governance (Template)

This repository is a **daily-use template** for running a “single source of truth” workflow:
- `specs/` holds the rules that **humans + agents** must follow.
- Copilot Chat/Agent instructions are centralized in `.github/copilot-instructions.md` + `AGENTS.md`.
- GitHub Actions enforce PR quality gates (validation + tests) and run automated reviews (CodeRabbit + Sourcery).

Hungarian version: see [README.hu.md](README.hu.md)

After publishing to GitHub:
- Create the repo and push: [docs/01-create-github-repo.md](docs/01-create-github-repo.md)
- Initialize branch protection + required checks: [docs/03-init-after-publish.md](docs/03-init-after-publish.md)

## Maintainer

- Gabor Szabo
- gabor@w7-7.net
- https://w7-7.net

## Repository structure

- `specs/` — policy + standards (source of truth)
  - `global-rules.md`
  - `coding-standards.md`
  - `copilot-chat-modes.yml`
- `.github/`
  - `workflows/` — CI + validation + AI review workflows
  - `copilot-instructions.md` — repo-wide Copilot instructions
  - `pull_request_template.md` — forces Problem/Test/Rollback in PRs
- `.vscode/`
  - `settings.json` — points Copilot Chat to `.github/copilot-instructions.md`
- `pipeline-mcp/` — custom MCP server for GitHub Actions orchestration (Node.js + Docker)
- `docs/` — deep guides (MCP strategy, setup)

## Daily workflow

1. Create a branch (never push to `main`):
   - `feature/<short-description>`
2. Implement changes and update `specs/` if behavior/config/pipeline changes.
3. Open a PR.
4. Ensure PR includes:
   - problem statement
   - test plan
   - rollback plan
5. Required checks (recommended to enforce via branch protection):
   - **Pre-Merge Validation**
   - **Tests & Validation** (and/or pipeline-mcp tests)
6. Address human + AI review comments, then merge.

## Configure Copilot instructions (VS Code)

This repo is already wired so Copilot Chat loads:
- `.github/copilot-instructions.md`
- plus any additional instruction files found under `specs/` and `.github/`

If you need to verify: open `.vscode/settings.json`.

## Secrets / env

For GitHub Actions, add repository secrets:
- `OPENAI_API_KEY` (required for CodeRabbit action-based review)
- `SOURCERY_TOKEN` (optional)
- `CODECOV_TOKEN` (optional; private repos)

For local development, copy:
- `.env.example` → `.env`

## Pipeline MCP server

The custom server lives in `pipeline-mcp/` and exposes tools for:
- triggering GitHub Actions workflows
- listing workflow runs
- polling a run until completion

### Run locally

```bash
cd pipeline-mcp
npm install
npm run dev
```

### Build + run

```bash
cd pipeline-mcp
npm run build
npm start
```

### Docker

```bash
cd pipeline-mcp
docker build -t pipeline-mcp:local .
```

## Create the GitHub repository (manual)

Option A (GitHub UI): create a new repo, then set remote + push.

Option B (GitHub CLI):

```bash
# from repo root
gh repo create <owner>/<repo> --public --source=. --remote=origin --push
```

## License

Add a license if you plan to open-source this template.

# Agent Operating Rules (Repo)

## Mission
Help implement changes via small PRs that pass CI and keep `specs/` up to date.

## Non-negotiables
- Never commit to `main` directly.
- Prefer small PRs (single concern).
- If behavior changes, update `specs/` and add/adjust tests.
- Avoid drive-by refactors.

## Commands

### pipeline-mcp/
- Install: `cd pipeline-mcp && npm install`
- Typecheck: `cd pipeline-mcp && npm run typecheck`
- Unit tests: `cd pipeline-mcp && npm test`
- Build: `cd pipeline-mcp && npm run build`
- Docker build: `cd pipeline-mcp && docker build -t pipeline-mcp:local .`

### Lint/format
- Not configured yet (add a formatter/linter before enforcing this in CI).

## PR checklist
- Problem statement included
- Test plan included
- Rollback plan included
- Tests added/updated (as needed)
- CI green
- Specs updated (as needed)

# pipeline-mcp

Custom **Model Context Protocol (MCP)** server for coordinating GitHub Actions workflows.

## Tools

- `pipeline.dispatch_workflow` — trigger a `workflow_dispatch`
- `pipeline.list_workflow_runs` — list workflow runs for a workflow
- `pipeline.get_workflow_run` — get a single run by `run_id`

## Environment variables

Required:
- `GITHUB_TOKEN` — GitHub token with `actions:read` and (for dispatch) `actions:write` access

Optional:
- `GITHUB_OWNER` / `GITHUB_REPO` — defaults used when tool call omits owner/repo
- `MCP_USER_AGENT` — custom user-agent

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Docker

See `Dockerfile`.

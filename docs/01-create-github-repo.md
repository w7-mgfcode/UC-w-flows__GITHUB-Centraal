# Create the GitHub repository (manual step)

This workspace already contains the full project template. To publish it as a new GitHub repository, you need to create a remote repo and push.

## Option A: GitHub CLI (recommended)

1. Authenticate:

- `gh auth login`

2. Create the repo from this folder and push `main`:

- `cd /path/to/this/repo`
- `gh repo create <OWNER>/<REPO> --public --source=. --remote=origin --push`

If you prefer a private repo:

- `gh repo create <OWNER>/<REPO> --private --source=. --remote=origin --push`

## Option B: GitHub Web UI

1. Create an empty repo in GitHub UI.
2. Add it as `origin` and push:

- `git remote add origin https://github.com/<OWNER>/<REPO>.git`
- `git push -u origin main`

## Secrets for workflows

If you enable AI review/coverage workflows, add these GitHub Actions secrets:

- `OPENAI_API_KEY` (for CodeRabbit action)
- `SOURCERY_TOKEN` (for Sourcery action)
- `CODECOV_TOKEN` (optional)

Without these secrets, the “PR Review Workflow (Example)” will still pass; it just skips the AI review jobs.

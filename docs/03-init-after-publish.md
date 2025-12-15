# Initialize the repo after publishing to GitHub

This repo already contains the template content and workflows. After you push it to GitHub, do these **one-time repo settings** so the “daily-use” workflow is enforced.

## 1) Set the default branch

- Recommended default branch: `main`
- Ensure your local default branch matches:

- `git branch -M main`
- `git push -u origin main`

If you prefer `develop` as default, set it in GitHub **Settings → Branches**.

## 2) Configure branch protection (recommended)

GitHub: **Settings → Branches → Add branch protection rule**

Target: `main`

Enable:
- Require a pull request before merging
- Require approvals: `1`
- Dismiss stale approvals when new commits are pushed (recommended)
- Require status checks to pass before merging
  - Require at least:
    - `Pre-Merge Validation`
    - `Tests & Validation`
  - Note: GitHub’s “required status checks” list typically shows **job/check names**, not just workflow names.
    - Example: the validation workflow usually appears as `validate`.
    - Matrix jobs appear per entry, e.g. `test-pipeline-mcp (18)`, `test-pipeline-mcp (20)`, `test-pipeline-mcp (22)`.
    - Policy choice: require all matrix entries (stricter) or a single representative entry (lighter).
- Require conversation resolution before merging (recommended)
- Require linear history (recommended)

Optional:
- Do not allow force pushes
- Do not allow deletions

## 3) Enable/verify GitHub Actions

GitHub: **Settings → Actions → General**
- Allow actions and reusable workflows
- (Optional) Restrict to your org if needed

## 4) Add secrets (only if you want the optional features)

GitHub: **Settings → Secrets and variables → Actions**

- `OPENAI_API_KEY` (enables CodeRabbit workflow)
- `SOURCERY_TOKEN` (enables Sourcery workflow)
- `CODECOV_TOKEN` (only needed for some coverage uploads, typically private repos)

Notes:
- The example PR review workflow is designed to **skip AI review jobs** when secrets are not set.

## 5) First PR (recommended workflow)

Even if you’re the only maintainer, do the first change via PR so you confirm branch protection + required checks work.

- `git checkout -b feature/initial-repo-check`
- Make a tiny change (e.g., edit README)
- Commit with `[DOCS] ...`
- Push and open a PR

## 6) Optional: GitHub CLI shortcuts

If you use GitHub CLI (`gh`) you can still set most policy in the UI, but here are helpful basics:

- View workflows: `gh workflow list`
- View required checks (UI is still best for protection rules)

## What “init” means in this template

- Workflows exist under `.github/workflows/`
- Policies exist under `specs/` and `AGENTS.md`
- After publish, the missing piece is enforcing it via GitHub repo settings (branch protection + required checks + optional secrets)

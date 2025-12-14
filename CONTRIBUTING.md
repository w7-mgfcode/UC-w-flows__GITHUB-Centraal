# Contributing

This repo enforces PR quality gates via documentation + templates + CI.

## Rules (quick)
- Never push to `main`.
- Use short-lived branches: `feature/...`, `bugfix/...`, etc.
- Commit messages start with `[FEAT]`, `[FIX]`, `[DOCS]`, `[TEST]`, `[REFACTOR]`.
- PR must include: problem statement, test plan, rollback plan.
- If behavior/config/pipeline changes, update `specs/`.

## Before opening a PR
- Run the relevant checks locally (see `AGENTS.md` “Commands”).
- Keep PRs small and focused.

## Reviews
- At least 1 human approval is required.
- AI reviews (CodeRabbit/Sourcery) are helpful but do not replace human review.

## Maintainer
- Gabor Szabo — https://w7-7.net — gabor@w7-7.net

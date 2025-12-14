# RepoOps Copilot + MCP Irányítás (Sablon)

Ez a repository egy **mindennapi használatra szánt sablon** a “single source of truth” fejlesztési folyamathoz:
- A `specs/` tartalmazza a szabályokat, amelyeket **emberek és agentek** is követnek.
- A Copilot Chat/Agent instrukciók a `.github/copilot-instructions.md` + `AGENTS.md` fájlokban vannak központosítva.
- A GitHub Actions kényszeríti a PR minőségi kapukat (validáció + tesztek), és futtat AI review-kat (CodeRabbit + Sourcery).

Angol verzió: lásd [README.md](README.md)

GitHub-ra publikálás után:
- Repo létrehozás + push: [docs/01-create-github-repo.md](docs/01-create-github-repo.md)
- Branch protection + required check-ek beállítása: [docs/03-init-after-publish.md](docs/03-init-after-publish.md)

## Karbantartó

- Gabor Szabo
- gabor@w7-7.net
- https://w7-7.net

## Repository struktúra

- `specs/` — szabályok és standardok (source of truth)
  - `global-rules.md`
  - `coding-standards.md`
  - `copilot-chat-modes.yml`
- `.github/`
  - `workflows/` — CI + validáció + AI review workflow-k
  - `copilot-instructions.md` — repo-szintű Copilot instrukciók
  - `pull_request_template.md` — kötelező Problem/Test/Rollback blokkok PR-ben
- `.vscode/`
  - `settings.json` — Copilot Chat beállítások (instrukció fájl útvonal)
- `pipeline-mcp/` — egyedi MCP szerver GitHub Actions koordinációhoz (Node.js + Docker)
- `docs/` — részletes útmutatók (MCP stratégia, setup)

## Napi munkafolyamat

1. Branch létrehozás (soha ne pusholj `main`-re):
   - `feature/<rovid-leiras>`
2. Fejlesztés + `specs/` frissítése, ha változik viselkedés/konfig/pipeline.
3. Pull Request megnyitása.
4. A PR tartalmazza:
   - probléma leírás
   - teszt terv
   - rollback terv
5. Kötelező check-ek (branch protection-ben ajánlott beállítani):
   - **Pre-Merge Validation**
   - **Tests & Validation** (és/vagy pipeline-mcp tesztek)
6. Human + AI review kommentek kezelése, majd merge.

## Copilot instrukciók (VS Code)

A repo úgy van beállítva, hogy a Copilot Chat betöltse:
- `.github/copilot-instructions.md`
- valamint minden extra instrukciót a `specs/` és `.github/` alól

Ellenőrzés: nyisd meg a `.vscode/settings.json` fájlt.

## Secretek / env

GitHub Actions-hoz add hozzá a repository secret-eket:
- `OPENAI_API_KEY` (CodeRabbit-hez szükséges)
- `SOURCERY_TOKEN` (opcionális)
- `CODECOV_TOKEN` (opcionális; privát repo)

Lokális fejlesztéshez:
- `.env.example` → `.env`

## Pipeline MCP szerver

A `pipeline-mcp/` könyvtárban található, és eszközöket ad:
- GitHub Actions workflow indítás
- workflow run listázás
- futás állapotának pollingolása befejezésig

### Lokális futtatás

```bash
cd pipeline-mcp
npm install
npm run dev
```

## GitHub repo létrehozása

UI-val vagy GitHub CLI-vel:

```bash
gh repo create <owner>/<repo> --public --source=. --remote=origin --push
```

## Licenc

Ha open-source-olni szeretnéd, adj hozzá egy licencet.

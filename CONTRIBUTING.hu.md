# Hozzájárulás

Ez a repo PR minőségi kapukat kényszerít dokumentáció + template + CI segítségével.

## Szabályok (röviden)
- Soha ne pusholj `main`-re.
- Rövid életű branchek: `feature/...`, `bugfix/...`, stb.
- Commit message eleje: `[FEAT]`, `[FIX]`, `[DOCS]`, `[TEST]`, `[REFACTOR]`.
- A PR tartalmazza: probléma leírás, teszt terv, rollback terv.
- Ha változik viselkedés/konfig/pipeline, frissítsd a `specs/` fájlokat.

## PR előtt
- Futtasd a releváns ellenőrzéseket lokálisan (lásd `AGENTS.md` “Commands”).
- A PR legyen kicsi és fókuszált.

## Review
- Minimum 1 emberi jóváhagyás szükséges.
- Az AI review (CodeRabbit/Sourcery) hasznos, de nem helyettesíti az emberi review-t.

## Karbantartó
- Gabor Szabo — https://w7-7.net — gabor@w7-7.net

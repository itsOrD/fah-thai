# feat/cicd-pipeline

## What

Replaces the scaffold's placeholder deploy with the real promotion pipeline:
every merge to `main` automatically walks **test → staging → production**,
with smoke gates between each hop — emulating enterprise release flow on pure
GitHub (Actions + Environments + Pages), $0.

- **Three GitHub Environments** (`test`, `staging`, `production`), each with
  its deployment history and URL, auto-created by workflow reference.
- **One Pages site, three subfolders**: `gh-pages` branch serves
  `/fah-thai/test/`, `/fah-thai/staging/`, and prod at `/fah-thai/`.
  Deployed with `JamesIves/github-pages-deploy-action@v4 target-folder`, the
  only mechanism on GitHub Pages that can update one path without replacing
  the whole site (`actions/deploy-pages` is whole-site-only — ADR-002).
  The prod deploy uses `clean-exclude` so cleaning the root never deletes the
  test/staging subfolders.
- **Build-once-promote**: the verify job builds a single artifact (relative
  `base: './'` makes it path-agnostic); every environment deploys that same
  artifact via `download-artifact`. One deliberate exception, documented in
  ADR-018: non-prod deploys delete `manifest.webmanifest` so only production
  is installable (web.dev nested-scope guidance — shared origin storage/
  permissions, suppressed inner install prompts).
- **Smoke gates**: after each deploy, `pipeline/wait-for-deploy.ts` polls the
  commit-stamped `version.json` (cache-busted) until the deployed SHA matches
  the run's SHA — Pages deploys are queued and propagate slowly, so action
  success ≠ site live (measured on this very repo: ~60s of 404s after the
  first deploy). Then Playwright smoke runs against the live environment URL.
- **Playwright** joins the verify job too: chromium (mobile viewport, will
  later carry fake-mic recording E2E) + webkit (engine smoke only — Playwright
  WebKit is not iOS Safari and is never claimed as iOS proof) against the
  built artifact served by `vite preview`.
- **Concurrency**: all pushes to `gh-pages` share one concurrency group;
  parallel runs would race the branch.

## Why this shape

The portfolio story is "enterprise-grade release discipline without
enterprise infrastructure": same-artifact promotion, environment gates,
propagation-aware smoke, linear history. Cloudflare would make propagation
nicer but splits the pure-GitHub narrative (ADR-001 table).

## Definition of done

- Merge to main auto-walks all three environments with green gates.
- `/test/` and `/staging/` serve the app but are not installable; prod is.
- Local `pnpm test:e2e` runs the same smoke suite against a preview server.
- ADR-018 + retro entry for feat/scaffold committed.

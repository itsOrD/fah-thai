# ADR-018: test→staging→prod promotion on pure GitHub

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: feat/cicd-pipeline

## Context

The project emulates enterprise release discipline with zero infrastructure
budget: every merge to `main` must automatically walk three environments with
verification between hops, on GitHub free tier, deploying a static PWA.

## Decision

1. **Environments = GitHub Environments** (`test`, `staging`, `production`) —
   free on public repos; each carries its URL and deployment history. Gates
   are automated smoke tests, not human approvals (the "walk-through" is
   fully automatic by explicit user requirement).
2. **One Pages site, subfolder environments** via
   `JamesIves/github-pages-deploy-action target-folder` (test/, staging/,
   root). `actions/deploy-pages` was rejected: it replaces the whole site per
   deploy and cannot scope to a path. The prod deploy sets
   `clean-exclude: test, staging` so root cleaning never deletes the inner
   environments. All deploy jobs share one concurrency group — parallel runs
   would race the `gh-pages` branch.
3. **Build-once-promote**: the verify job uploads a single `dist/` artifact;
   every environment deploys that artifact. Enabled by `base: './'`, relative
   manifest scope, and scope-derived SW cache names (ADR-002).
   **One deliberate mutation**: non-prod deploys `rm manifest.webmanifest` so
   only production is installable — web.dev's nested-scope guidance (shared
   origin storage/permissions; inner-app install suppression). The dangling
   `<link rel=manifest>` 404s harmlessly. Promotion is otherwise
   byte-identical, and the exception is stated rather than hidden.
4. **Propagation-aware gates**: `pipeline/wait-for-deploy.ts` polls the
   commit-stamped `version.json` (cache-busted) until the environment serves
   the run's SHA, then Playwright smoke runs against the live URL. Measured
   on this repo: first deploy served 404 for ~60 s after action success.
   Pages' ~10-minute CDN cache headers cannot be changed; cache-busting query
   params defeat them for the poll.
5. **Playwright scope**: chromium (mobile viewport) is the deploy-gate
   browser and will carry fake-microphone recording E2E later; webkit runs in
   the verify job as engine smoke only — Playwright WebKit is **not** iOS
   Safari and is never claimed as iOS proof. Real-device checks live in
   `docs/device-tests.md` (spike/device-lab).

## Consequences

- Three sequential Pages builds per merge (~3–5 min added wall-clock) — the
  cost of the enterprise emulation, accepted.
- If Pages propagation flakiness ever exceeds the poll timeout regularly, the
  documented escape hatch is Cloudflare Workers static assets (ADR-001 table)
  at the cost of the pure-GitHub narrative.
- Environment protection rules (required reviewers on production) are
  available free and can be enabled later without workflow changes.

# ADR-002: GitHub Pages hosting, hash routing, relative base, scope-derived SW caches

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: feat/scaffold

## Context

Requirements: $0 hosting; public repo doubles as the deploy source; an
enterprise-style test→staging→prod promotion (feat/cicd-pipeline) must run on
pure GitHub; the installed iPhone PWA must keep one stable identity for 9+
months; a later Capacitor wrap must not force a rework.

## Decision

1. **GitHub Pages, branch source** (`gh-pages`), site at
   `itsord.github.io/fah-thai/`. The three environments will live as
   subfolders of one Pages site (`/test/`, `/staging/`, prod at root of the
   project path) — the only multi-environment layout GitHub Pages supports,
   since `actions/deploy-pages` is whole-site-replace only.
2. **Hash routing** (`#/route`): no 404-fallback hack, works at any subpath,
   URL bar is invisible in the installed app anyway, unchanged under Capacitor.
3. **`base: './'` everywhere** — relative asset paths, relative manifest
   `start_url`/`scope`. One built artifact can be promoted byte-identical
   through all three environments (build-once-promote).
4. **Service-worker cache names derived from registration scope at runtime**
   (`sw.ts`), because three installs of the same code share one origin and
   must not clobber each other's caches. IndexedDB names get the same
   treatment when Dexie arrives.
5. **Only prod is installable.** Test/staging deploys will strip the manifest
   (web.dev's nested-scope warnings: shared storage quota, shared permissions,
   suppressed inner-app install prompts). Test/staging never auto-request the
   microphone — a permission block on one path blocks the whole origin.
6. **No custom domain, ever** (for this app): changing scope later would make
   iOS treat the install as a different app and orphan 9 months of local SRS
   data. Decided now, deliberately.

## Consequences

- The scaffold ships a placeholder single-environment deploy; the promotion
  pipeline replaces it in feat/cicd-pipeline (ADR-018).
- Smoke tests must poll a commit-stamped `version.json` (emitted by the build)
  before running — Pages deploys are queued and propagate slowly; "the action
  succeeded" never means "the site is live".

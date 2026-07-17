# ADR-007: Pre-baked audio committed to the repo

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: feat/content-pipeline

## Context

The app ships thousands of small MP3s (~150 MB at 48 kbps mono when all
tranches land). They must serve from GitHub Pages, work offline, and never
depend on a live TTS API.

## Decision

Commit the generated MP3s to `app/public/audio/`, content-hash-named
(`sha1(voice|text|rate).mp3`).

- **Write-once by construction**: a hash file never changes, only appears —
  linear history stays clean and diffs stay readable.
- **Git LFS rejected**: GitHub Pages does not serve LFS pointers (audio
  would 404).
- **Runtime**: the service worker precaches only shell + T0 audio; later
  packs are CacheFirst with an explicit per-pack "download for offline"
  prefetch UI (deliberate offline, not accidental).
- **Escape hatch** if repo weight ever hurts (~150 MB is well inside GitHub
  norms): move `public/audio/` to a sibling `fah-thai-assets` repo with its
  own Pages origin; the audio manifest already indirects every reference, so
  the move is a base-URL change.

## Consequences

- Pre-baking fully insulates the app from TTS voice deprecations (Google has
  removed voices without notice) and from API availability in Thailand.
- Regeneration is idempotent (`existsSync` skip) — re-running the batch after
  adding words touches only new hashes.

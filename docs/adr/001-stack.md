# ADR-001: Application stack — Vite + Svelte 5 + TypeScript, minimal dependencies

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: feat/scaffold

## Context

Fah is an installed-PWA language app whose product identity is animation-heavy
bespoke UI (mascot rig, glowing tone contours, screen transitions) plus a
handful of pure computational cores (tone-rule engine, pitch post-processing,
FSRS scheduling). Solo-maintained, built agent-first, and doubles as a
portfolio artifact — the codebase itself must read well.

## Decision

Vite + **Svelte 5 (runes)** + TypeScript. State in plain `.svelte.ts` rune
modules. Hand-rolled ~60-line hash router. Hand-written CSS design tokens.
Dexie for IndexedDB (arrives with feat/srs-core). Vitest + Playwright.
Single root `package.json`; `pipeline/` scripts run via `tsx` against the same
dependency tree.

## Considered and rejected

| Option | Why not |
|---|---|
| React / Next.js | No server, no SSR, no SEO — Next's strengths are dead weight in an offline-first static PWA; animation needs extra libraries Svelte ships in the compiler. |
| SvelteKit | Server-first mental model (filesystem routing, `load`) fights a hash-routed installed PWA; plain Vite+Svelte keeps everything browser-side. |
| Tailwind / UnoCSS | The look is a bespoke neon design system; named tokens keep glow/gradient/motion values centralized instead of scattered as `shadow-[0_0_24px_#FF2E88]` arbitrary values. |
| shadcn/ui and kin | React-first; admin-dashboard aesthetic opposite to Neon Bangkok Night — components would be restyled beyond recognition, so copy-in has ~zero leverage. |
| Zustand / Redux / XState | Runes are already the state layer. |
| SQLite (wasm) | ~1 MB wasm; OPFS persistence wants COOP/COEP headers GitHub Pages can't set; no runtime relational queries exist. Storage sits behind an interface so a Capacitor-era SQLite swap stays cheap (ADR-019, future). |
| Docker / devcontainers | Nothing to containerize — no backend, no services; CI uses hosted runners + `setup-node`. Enterprise emulation lives in the promotion pipeline, where it's real. |
| Router library | 13 flat routes; a dependency can't beat 60 tested lines. |

## Consequences

- TypeScript pinned to **5.x**: svelte-check 4.x cannot load TypeScript 7's
  native package (`typescript.sys` is gone from the JS API). Revisit when the
  Svelte toolchain supports TS7.
- Vite 8 builds through rolldown; esbuild remains only as a transitive tool.
- Fonts ship as packages (`@fontsource/noto-sans-thai-looped`, `@fontsource/kanit`)
  so the app is fully self-hosted and works offline. Looped Thai is a pedagogy
  decision: looped terminals are the letterforms learners are taught with;
  loopless appears only in the late-game "read real signage" mode.

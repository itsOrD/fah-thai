# Fah · ฟ้า — Thai by Night

A pronunciation-first Thai learning PWA, built for one learner with a hard
deadline and a real reason. Installable from Safari, offline-capable, $0 to
run, and public because the engineering is the second product.

> **Status: scaffold.** The shell, design system, and pipeline are landing
> branch by branch — see the roadmap below.

## Why this exists when Thai apps already exist

1. **Tone feedback you can see** — record a word, watch your pitch curve drawn
   over the native contour. No Thai app does this.
2. **Animated mouth mechanics** — every Thai sound gets a moving sagittal
   cross-section and front view (tongue, teeth, throat), with an overlay of
   the English sound you're wrongly substituting. No app does this for Thai.
3. **AI voice-lesson handoff** — one tap compiles your actual weak sounds, due
   vocabulary, and tonight's scenario into a speaking-lesson prompt and opens
   ChatGPT voice.
4. **A curriculum of one** — built around real conversations the learner needs
   (family, food, memories, questions), in polite *colloquial* Thai, not
   textbook register.
5. **Fah** — a tsundere companion with a nine-month memory and opinions about
   your ข.

## Engineering shape

- **Stack**: Vite · Svelte 5 (runes) · TypeScript · Dexie · ts-fsrs · pitchy ·
  vite-plugin-pwa. No UI framework beyond Svelte, no CSS framework, no state
  library, no backend. Rationale + full considered-and-rejected tables: [docs/adr/](docs/adr/).
- **Cores are pure**: the tone-rule engine, pitch post-processing/scoring, SRS
  scheduling, and prompt compiler import nothing from the UI. Screens compose;
  cores compute.
- **Process**: every feature is a branch with its own `BRANCH.md` design note,
  multiple Conventional Commits, rebase + fast-forward onto `main` (strictly
  linear history), and branches are **never deleted** — each ref is a frozen
  historical artifact. `docs/retro.md` is a living retrospective of time,
  tokens, and money, updated at every merge.
- **CI/CD**: GitHub Actions → typecheck, unit tests, dual-engine E2E, build —
  then every merge to `main` automatically promotes **one build artifact**
  through test → staging → production GitHub Environments on GitHub Pages,
  with propagation-aware Playwright smoke gates between each hop (ADR-018).
  Environments: [/test/](https://itsord.github.io/fah-thai/test/) ·
  [/staging/](https://itsord.github.io/fah-thai/staging/) ·
  [prod](https://itsord.github.io/fah-thai/) (only prod is installable).

## Roadmap (branch = milestone)

| Branch | Delivers | State |
|---|---|---|
| `feat/scaffold` | toolchain, neon design tokens, router + tab shell, PWA, CI seed | ✅ |
| `feat/cicd-pipeline` | test→staging→prod promotion with smoke gates | ✅ |
| `spike/device-lab` | on-device probes: mic, worklet, ChatGPT deep links | |
| `feat/tone-engine` | pure Thai tone-rule engine + exhaustive tests | |
| `feat/content-pipeline` | curation → validation → multi-voice TTS pipeline | |
| `feat/sound-lab` | animated articulatory mouth views | |
| `feat/mascot-fah` | the companion: rig, dialogue, warmth arc | |
| `feat/srs-core` | FSRS scheduling, review sessions, backlog amnesty | |
| `feat/habit-loop` | onboarding, flexible weekly streaks, welcome-back | |
| `feat/tone-studio` | mic pitch-curve overlay + scoring | |
| …and eight more | ear gym, script track, GPT handoff, backups/push, content tranches, analytics, polish, journey | |

## Running it

```bash
pnpm install
pnpm dev        # local dev server
pnpm check      # svelte-check + TS
pnpm test       # vitest
pnpm build      # production build to dist/
pnpm icons      # regenerate PWA icons from the in-code SVG source
```

## Licensing

Code is MIT. Thai lexical data derives from Wiktionary (CC BY-SA 4.0) and
sentence data from Tatoeba (CC BY 2.0 FR); icon art sources carry per-author
attribution — see `ATTRIBUTION.md` (arrives with the content pipeline).

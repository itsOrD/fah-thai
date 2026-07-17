# ADR-006: Content pipeline — curation as code, engine-gated, license-clean

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: feat/content-pipeline

## Context

~2,500 vocabulary items, drill sets, and lessons must be authored, validated,
voiced, and shipped in tranches without ever blocking app development — and
without a single silently-wrong tone reaching a flashcard.

## Decision

1. **Curation is typed TS data in the repo** (`pipeline/curation/`), not
   spreadsheets: diffable, code-reviewable, refactorable, and imports the
   same zod schemas the app loads with (`content/schema.ts`, single source
   of truth — `tsx` runs pipeline scripts against app modules directly).
2. **Two build gates**, also mirrored as CI tests: zod validation, and the
   **tone engine re-deriving every drill word's tone from its spelling
   analysis** — disagreement fails the build. Every future discrepancy is an
   engine bug, a data bug, or a new lexicon exception; all three are wins.
3. **Schema grows with content**: T0 ships phonemes + drill sets + manifest
   only. Vocab/lesson/scenario schemas land with their tranches rather than
   speculatively (the plan's data model is the roadmap, not a day-one
   contract).
4. **Licensing from day one**: ATTRIBUTION.md tracks every source; Wiktionary
   derivatives stay CC BY-SA; thai-language.com excluded (proprietary).
5. **Audio**: Google TTS, `sha1(voice|text|rate).mp3` filenames — idempotent
   re-runs, write-once git history. Fah's voice (`th-TH-Neural2-C`) renders
   model + 0.78-rate slow variants; a 6-voice roster renders perception-drill
   words (HVPT multi-talker, plan §4). `--dry-run` needs no key; the key
   itself is a one-paste user to-do (docs/todo-tts-key.md). A 100-item
   minimal-pair pilot is ear-verified before any full batch.

## Consequences

- T0 starts at 18 drill sets / 42 words; the pilot list grows to ~100 items
  in the same files before the first real TTS run (mid-vs-low overweighted
  per the tone-pedagogy research).
- Chirp3-HD voices in the roster are an A/B bet (Preview SSML, shared
  personas); the pilot ear-check decides whether they stay.

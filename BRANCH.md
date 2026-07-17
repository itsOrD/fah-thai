# feat/content-pipeline

## What

The curation → validation → audio pipeline plus the first real content: the
T0 sound-system pack (priority phonemes, tone specs, minimal-pair drill
sets). The app never blocks on content — everything is manifest-driven and
lands in tranches (plan §7).

- `app/src/content/schema.ts` — zod schemas, single source of truth shared
  by app loaders and pipeline scripts (`tsx` imports them directly).
- `pipeline/curation/` — hand-authored inputs: `phonemes.ts` (articulatory
  data for the priority set, from Tingsabadh & Abramson 1993 / Slayden 2009),
  `drills-t0.ts` (the ~100-item tone minimal-pair pilot list: ใกล้/ไกล,
  มา/ม้า/หมา…), later tranche CSVs.
- `pipeline/build-content.ts` — validates curation against schemas, runs the
  tone engine over every syllable (inline tone-check for T0; the Wiktionary
  diff joins when vocab tranches arrive), writes packs + manifest into
  `app/public/content/`.
- `pipeline/tts-batch.ts` — Google Cloud TTS batch generator:
  sha1(voice|text|rate) filenames (idempotent re-runs), normal + 0.78-rate
  slow variants, `<break>` drill pauses, multi-voice roster for perception
  items, `--pilot` (first 100 minimal-pair items) and `--dry-run` (no API,
  prints the manifest) modes. Requires `GOOGLE_TTS_API_KEY` in `.env` —
  the user to-do ships as one paste (docs/todo-tts-key.md).
- `ATTRIBUTION.md` — per-source licenses from day one.

## Why this shape

Curation is code-reviewed data (typed TS files > opaque spreadsheets); the
tone engine cross-validates every syllable at build time so a wrong tone
never reaches a flashcard silently; audio filenames are content-hashed so
regeneration is idempotent and git history stays write-once (ADR-007).

## Definition of done

- `pnpm content:build` produces a schema-valid T0 pack + manifest.
- `pnpm tts -- --dry-run --pilot` prints the exact pilot batch without a key.
- Tone engine agrees with every hand-authored tone in T0 (build fails
  otherwise). ADR-006/007 + ATTRIBUTION.md committed.

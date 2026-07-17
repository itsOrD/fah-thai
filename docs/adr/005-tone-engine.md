# ADR-005: Tone engine — pure, table-driven, exception-honest

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: feat/tone-engine

## Context

Thai tones are deterministic from spelling (consonant class × tone mark ×
live/dead × vowel length + a short list of special rules). Encoding this as a
tested pure function is the pedagogical backbone of the script track — it
turns tone memorization into reading — and the reference implementation the
content pipeline diffs against Wiktionary data (`tone-check.ts`).

## Decision

- `app/src/tone/` is pure: zero imports from screens/data (boundary rule,
  ADR-001). Consumers: flashcards, Sound Lab, script track, pipeline.
- **Decision order** (verified in planning research, encoded in
  `resolveTone`): (1) tone mark → class × mark, overriding live/dead and
  length; (2) live → class default (mid→mid, high→rising, low→mid); (3) dead
  → mid/high→low; low splits on length (short→high, long→falling).
  Invalid mark/class combinations (mai tri/chattawa off mid class) return
  `null` — the engine never guesses.
- **Specials**: ho-nam (silent ห + unpaired low sonorant → high class) and
  true clusters (first consonant's class) resolve in `effectiveClass`;
  o-nam lives in a **word-level exception lexicon** (`exceptions.ts`) —
  a closed 4-word set plus an open irregulars map that `tone-check.ts`
  discrepancies feed over time, each with a recorded reason.
- **Input convention**: syllables arrive pre-analyzed (`SyllableInput`).
  Script→syllable segmentation is NOT this module's job (it belongs to the
  content pipeline, where humans review its output). The ไ- ใ- เ-า -ำ vowels
  are live; callers encode them via their implied final (ย/ว/ม).
- **Contours** (`contours.ts`): modern Bangkok Chao data — high [45] rises,
  low [21] falls — as normalized points shared by every tone visualization
  and the future Tone Studio scorer.

## Consequences

- 56 table-driven tests cover every decision-table cell, the letter-class
  audit (9/11/24, disjoint), all ho-nam sonorants, all four o-nam words,
  cluster inheritance, and 24 canonical words.
- A full Thai-script syllable segmenter is deliberately out of scope; if one
  is ever needed client-side, it composes in front of this engine without
  touching it.

# feat/tone-engine

## What

The pure Thai tone-rule engine (`app/src/tone/`) — zero imports from the app,
consumed later by flashcards, the script track, the Sound Lab, and the content
pipeline's cross-validation script (`tone-check.ts`, feat/content-pipeline).

Thai tones are deterministic from spelling: consonant class × tone mark ×
syllable kind (live/dead) × vowel length, plus a small set of special rules.
Encoding this as a tested pure function is what turns "memorize 5 tones per
word" into "read the word" — the pedagogical backbone of the script track.

Modules:

- `types.ts` — Tone, ConsonantClass, ToneMark, VowelLength, SyllableInput.
  Convention: the ไ- ใ- เ-า -ำ vowels are *live* because they end in glide/
  nasal sounds; callers express this by setting the implied final (ย ว ม).
- `letters.ts` — all 44 consonant letters → class (9 mid, 11 high, 24 low,
  obsolete flags), final-consonant sound mapping (9 finals; stops are dead,
  sonorants live), the 10 unpaired low sonorants.
- `engine.ts` — `resolveTone(features)` implementing the verified decision
  order: (1) tone mark present → class × mark (mark overrides live/dead and
  length); (2) live → class default; (3) dead → class × length (only low
  class splits on length). Plus `effectiveClass()` (ho-nam: silent ห +
  unpaired low sonorant → high-class rules; true clusters take the first
  consonant's class) and `toneOfSyllable()` composing the whole path.
- `exceptions.ts` — the o-nam lexicon (exactly อย่า อยู่ อย่าง อยาก → mid
  class) and an extensible word-level exception map for the irregulars the
  content pipeline will surface.
- `contours.ts` — ToneSpec data: modern Bangkok Chao values (mid [33],
  low [21] falls, falling [41], high [45] RISES, rising [214]) with
  normalized draw points for every tone visualization in the app.

## Test strategy

Table-driven and exhaustive, not anecdotal: every (class × mark) cell, every
(class × kind × length) cell, all 44 letters counted and disjoint, ho-nam
across all 8 sonorants, all four o-nam words, true-cluster class inheritance,
and the canonical word set from the plan (น้ำ ไม่ เก้า ขาด มาก รัก หมา ครับ
ใกล้ …). The engine is also the reference implementation the pipeline will
diff against Wiktionary tone data — every future discrepancy is an engine
bug, a data bug, or a new exception, all three worth catching.

## Definition of done

- Full decision table + specials green under Vitest; letters audited 9/11/24.
- ADR-005 records the engine design and its input conventions.

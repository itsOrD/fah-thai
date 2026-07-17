# ADR-008: Articulatory visuals — a parameterized rig, not 44 drawings

**Status**: accepted · **Date**: 2026-07-17 · **Branch**: feat/sound-lab

## Context

The plan's headline requirement (§4a): animated, multi-view mouth-position
guidance — tongue, teeth, throat — for every Thai sound, with an overlay of
the English sound the learner wrongly substitutes.

## Decision

- **Everything is data** (`sounds/rig.ts`, pure): tongue postures are seven
  named 8-point control arrays; a phoneme's articulation attributes map to an
  animation *program* (keyframes over posture, lip aperture/rounding, velum,
  voicing, aspiration). Rendering interpolates numerically. A new sound
  costs a data row; syllable-level transitions later cost chaining programs.
- **Two synchronized views**: sagittal cutaway (Sagittal.svelte — palate,
  velum drop for nasals, glottal buzz for voicing, saffron breath puff for
  aspiration, trill jitter for ร) and front view (FrontMouth.svelte —
  aperture, rounding/protrusion, teeth, tongue tip). One parent clock
  (MouthViews) owns rAF + scrub; views only draw.
- **English-trap ghost** (`compare.ts`): the substitute articulation renders
  as a dashed saffron overlay at the same timeline position — *what your
  mouth does vs what it should do*. Only where the visual contrast teaches
  (aspiration on the unaspirated stops, alveolar-n over ง, lip rounding on
  the unrounded back vowels); traps that are audio-first (ร/ล) stay textual.
- **Stylized, honestly**: geometry is legible neon line art, not clinical
  anatomy. The teaching content is the CONTRAST between sounds; postures are
  keyframed from the articulatory descriptions in Tingsabadh & Abramson
  (1993) and Slayden (2009). Seeing Speech was reference-only (no open
  license; ADR-006 licensing discipline).
- Reduced-motion: the loop freezes at the informative post-release frame;
  the scrub bar remains fully usable.

## Consequences

- Rig math is unit-tested (shape point-count invariant, program monotonicity,
  puff/velum semantics, interpolation clamping) — the views stay dumb.
- Fricatives/affricates (later tranches) currently fall back to a neutral
  continuant program; they get their own postures when their tranche lands.

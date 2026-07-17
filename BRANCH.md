# feat/sound-lab

## What

The Sound Lab — the app's headline articulatory feature and the first screen
mjb learns from daily:

- **`sounds/rig.ts`** (pure): maps a phoneme's articulation attributes to an
  animation timeline over named tongue shapes, lip states, velum position,
  voicing, and aspiration puffs. Tongue shapes are fixed-count control-point
  arrays; interpolation is plain lerp, so every phoneme is DATA, not a
  drawing — new sounds cost a data row, and syllable transitions can animate
  later by chaining timelines.
- **`Sagittal.svelte`**: the side cutaway (tongue, teeth, palate, velum,
  glottis) rendered as neon line art; rAF loop over the timeline with a
  scrub bar; voicing shown as a glottal pulse, aspiration as a breath puff,
  nasality as velum-drop + nasal airflow.
- **`FrontMouth.svelte`**: lips/teeth/tongue-tip from the front — rounding,
  aperture, spread — animated in lockstep with the sagittal view.
- **English-trap comparison**: one toggle overlays the substitute English
  articulation (e.g. aspirated pʰ over ป) — *what your mouth does vs what
  it should do*.
- **`ToneCurve.svelte`**: glowing contour glyphs from `tone/contours.ts`
  (the five modern Bangkok shapes) with an animated trace dot.
- **`content/loaders.ts`** + **`audio/player.ts`**: typed pack loading and a
  gesture-safe audio player (unlock, statechange resume). Audio buttons
  degrade to a "recording with Fah soon" state until the TTS pilot lands —
  the screen must not block on the API key to-do.
- **SoundLabScreen**: grouped browser (VOT triads · nasals & liquids ·
  vowels · the five tones) → detail view.

## Why this shape

The plan (§4a) requires multi-view animated mouth positioning as a headline
feature, not an illustration. Parameterizing beats hand-drawing 44 diagrams
on every axis that matters here: consistency between sounds (the learner
compares shapes), effort (a data row per phoneme), and future syllable-level
animation. Anatomy is stylized; the *contrasts* between sounds are the
teaching content, keyframed from Tingsabadh & Abramson (1993) / Slayden
(2009) descriptions (ADR-008).

## Definition of done

- All 14 T0 phonemes browsable with animated sagittal + front views, scrub,
  and English-trap comparison; five tone glyphs animate.
- rig.ts unit-tested (timelines resolve, interpolation stable, every T0
  articulation maps to a rig program).
- E2E smoke covers browse → detail. ADR-008 committed.

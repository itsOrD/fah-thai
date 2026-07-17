/**
 * Content schemas — the single source of truth shared by the app's loaders
 * and every pipeline script. Validation runs at build/test time and on
 * backup import; runtime loads trust the committed packs (ADR-001).
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Phonology
// ---------------------------------------------------------------------------

export const Tone = z.enum(['mid', 'low', 'falling', 'high', 'rising']);
export type ToneT = z.infer<typeof Tone>;

export const VowelLength = z.enum(['short', 'long']);

/** Articulatory attributes drive the animated mouth rig (§4a of the plan). */
export const Articulation = z.object({
  place: z.enum(['bilabial', 'labiodental', 'alveolar', 'postalveolar', 'palatal', 'velar', 'glottal']).optional(),
  manner: z.enum(['stop', 'nasal', 'fricative', 'affricate', 'approximant', 'trill', 'vowel']).optional(),
  voiced: z.boolean().optional(),
  aspirated: z.boolean().optional(),
  /** Vowels: tongue position + lip rounding (from Tingsabadh & Abramson). */
  tongueHeight: z.enum(['high', 'mid', 'low']).optional(),
  tongueBackness: z.enum(['front', 'central', 'back']).optional(),
  rounded: z.boolean().optional(),
});

export const Phoneme = z.object({
  id: z.string(), // e.g. 'p' (ป), 'ph' (พ), 'ng' (ง), 'ue' (อึ)
  ipa: z.string(),
  paiboon: z.string(),
  kind: z.enum(['initial', 'final', 'vowel']),
  thaiLetters: z.array(z.string()).min(1), // letters that spell it
  articulation: Articulation,
  /** What an English speaker wrongly substitutes, and why it's wrong. */
  englishTrap: z.string().optional(),
  /** Phoneme ids this contrasts with in minimal pairs. */
  contrasts: z.array(z.string()).default([]),
  /** Learner-facing one-liner on how to make the sound. */
  howTo: z.string(),
  teachWeek: z.number().int().min(1),
});
export type PhonemeT = z.infer<typeof Phoneme>;

// ---------------------------------------------------------------------------
// Drills & items
// ---------------------------------------------------------------------------

/** One audio rendition: a voice from the roster at a rate. */
export const AudioRef = z.object({
  hash: z.string(), // sha1(voice|text|rate) — the filename stem
  voice: z.string(),
  rate: z.number(),
});

export const DrillWord = z.object({
  thai: z.string(),
  paiboon: z.string(),
  gloss: z.string(),
  tone: Tone,
  /** Engine-checkable analysis; build fails if the engine disagrees. */
  analysis: z.object({
    initial: z.string(),
    mark: z.enum(['none', 'maiEk', 'maiTho', 'maiTri', 'maiChattawa']).default('none'),
    final: z.string().optional(),
    vowelLength: VowelLength,
  }),
  audio: z.array(AudioRef).default([]),
});
export type DrillWordT = z.infer<typeof DrillWord>;

/** A minimal-pair (or triplet…) group for the Ear Gym / 5AFC drills. */
export const DrillSet = z.object({
  id: z.string(),
  axis: z.enum(['tone', 'vowel-length', 'aspiration', 'phoneme']),
  words: z.array(DrillWord).min(2),
  note: z.string().optional(),
});
export type DrillSetT = z.infer<typeof DrillSet>;

// ---------------------------------------------------------------------------
// Pack + manifest
// ---------------------------------------------------------------------------

export const ContentPack = z.object({
  id: z.string(), // 't0-sounds'
  title: z.string(),
  version: z.number().int(),
  phonemes: z.array(Phoneme).default([]),
  drillSets: z.array(DrillSet).default([]),
});
export type ContentPackT = z.infer<typeof ContentPack>;

export const ContentManifest = z.object({
  generatedAt: z.string(),
  packs: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      version: z.number().int(),
      path: z.string(), // relative to public/content/
      bytes: z.number().int(),
    }),
  ),
});
export type ContentManifestT = z.infer<typeof ContentManifest>;

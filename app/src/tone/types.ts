/**
 * Pure types for the Thai tone engine. No app imports (boundary rule).
 */

/** The five Thai tones. */
export type Tone = 'mid' | 'low' | 'falling' | 'high' | 'rising';

/** Consonant classes (อักษรสามหมู่). */
export type ConsonantClass = 'mid' | 'high' | 'low';

/** Tone marks. 'none' is a real input, not an absence. */
export type ToneMark = 'none' | 'maiEk' | 'maiTho' | 'maiTri' | 'maiChattawa';

export type VowelLength = 'short' | 'long';

/** live = long open vowel or sonorant final; dead = stop final or short open. */
export type SyllableKind = 'live' | 'dead';

/**
 * Analyzed syllable features, script-level.
 *
 * Conventions:
 * - `initial`: the written initial consonant(s) — a single letter, a true
 *   cluster ('กร', 'ปล'), or a leading-consonant pair ('หม' ho-nam, 'อย'
 *   o-nam). Class resolution handles all of these.
 * - `final`: the written final consonant, if any. The vowels ไ- ใ- เ-า -ำ
 *   end in glide/nasal sounds and are LIVE: callers express them with the
 *   implied final (ย for ไ/ใ, ว for เ-า, ม for -ำ), e.g. ไม่ →
 *   { initial: 'ม', final: 'ย', mark: 'maiEk', vowelLength: 'short' }.
 */
export interface SyllableInput {
  initial: string;
  mark?: ToneMark;
  final?: string;
  vowelLength: VowelLength;
}

/** Fully resolved features, the engine's core input. */
export interface ToneFeatures {
  cls: ConsonantClass;
  mark: ToneMark;
  kind: SyllableKind;
  length: VowelLength;
}

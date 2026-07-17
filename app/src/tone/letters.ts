/**
 * Consonant-class and final-sound data for all 44 Thai consonant letters.
 * Source: standard consonant-class doctrine, cross-checked during planning
 * research (9 mid / 11 high / 24 low; ฃ and ฅ obsolete but classified).
 */
import type { ConsonantClass } from './types';

export const MID_CLASS = ['ก', 'จ', 'ฎ', 'ฏ', 'ด', 'ต', 'บ', 'ป', 'อ'] as const;

export const HIGH_CLASS = ['ข', 'ฃ', 'ฉ', 'ฐ', 'ถ', 'ผ', 'ฝ', 'ศ', 'ษ', 'ส', 'ห'] as const;

export const LOW_CLASS = [
  'ค', 'ฅ', 'ฆ', 'ง', 'ช', 'ซ', 'ฌ', 'ญ', 'ฑ', 'ฒ', 'ณ', 'ท',
  'ธ', 'น', 'พ', 'ฟ', 'ภ', 'ม', 'ย', 'ร', 'ล', 'ว', 'ฬ', 'ฮ',
] as const;

export const OBSOLETE = ['ฃ', 'ฅ'] as const;

const CLASS_OF = new Map<string, ConsonantClass>([
  ...MID_CLASS.map((c) => [c, 'mid'] as const),
  ...HIGH_CLASS.map((c) => [c, 'high'] as const),
  ...LOW_CLASS.map((c) => [c, 'low'] as const),
]);

export function classOf(letter: string): ConsonantClass | undefined {
  return CLASS_OF.get(letter);
}

/**
 * The 10 low-class letters with no high-class sound partner. The first 8 are
 * the ho-nam targets (silent ห transfers high-class tone rules); ว and ฬ
 * round out the unpaired set (หว exists in หวาน etc. — ว included in ho-nam
 * in practice; ฬ never leads).
 */
export const UNPAIRED_LOW_SONORANTS = ['ง', 'ญ', 'น', 'ม', 'ย', 'ร', 'ล', 'ว'] as const;

/** Final-consonant sound classes: stop finals make a syllable dead. */
const STOP_FINALS = new Set([
  // /k̚/
  'ก', 'ข', 'ค', 'ฆ',
  // /t̚/ — the large orthographic set
  'จ', 'ช', 'ซ', 'ฌ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ด', 'ต', 'ถ', 'ท', 'ธ', 'ศ', 'ษ', 'ส',
  // /p̚/
  'บ', 'ป', 'พ', 'ฟ', 'ภ',
]);

/** Sonorant finals keep a syllable live: /m n ŋ j w/. */
const SONORANT_FINALS = new Set(['ม', 'น', 'ณ', 'ญ', 'ร', 'ล', 'ฬ', 'ง', 'ย', 'ว']);

export type FinalKind = 'stop' | 'sonorant';

export function finalKind(letter: string): FinalKind | undefined {
  if (STOP_FINALS.has(letter)) return 'stop';
  if (SONORANT_FINALS.has(letter)) return 'sonorant';
  return undefined;
}

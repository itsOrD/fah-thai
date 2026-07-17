/**
 * Word-level exceptions to the tone rules.
 *
 * o-nam: exactly four words where a silent leading อ makes ย follow
 * MID-class rules. This is a closed set — standard doctrine, not extensible.
 *
 * IRREGULARS is the open set: words the content pipeline's Wiktionary
 * cross-validation (tone-check.ts) flags as genuine rule-breakers get
 * recorded here with a reason, so the engine stays honest about its edges.
 */
import type { ConsonantClass } from './types';

export const O_NAM_INITIAL = 'อ';

export interface WordException {
  cls: ConsonantClass;
  reason: string;
}

const O_NAM_WORDS: readonly string[] = ['อย่า', 'อยู่', 'อย่าง', 'อยาก'];

const IRREGULARS = new Map<string, WordException>(
  O_NAM_WORDS.map((w) => [w, { cls: 'mid', reason: 'o-nam (silent อ leads ย, mid-class rules)' }]),
);

export function wordException(word: string): WordException | undefined {
  return IRREGULARS.get(word);
}

export function oNamWords(): readonly string[] {
  return O_NAM_WORDS;
}

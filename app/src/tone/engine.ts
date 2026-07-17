/**
 * The Thai tone-rule engine (pure). Decision order is load-bearing and
 * verified (ADR-005):
 *
 *   1. tone mark present → class × mark (mark overrides live/dead; vowel
 *      length becomes irrelevant)
 *   2. live syllable     → class default
 *   3. dead syllable     → class × vowel length (only low class splits)
 */
import { classOf, finalKind, UNPAIRED_LOW_SONORANTS } from './letters';
import { O_NAM_INITIAL, wordException } from './exceptions';
import type {
  ConsonantClass,
  SyllableInput,
  SyllableKind,
  Tone,
  ToneFeatures,
  ToneMark,
} from './types';

/** class × mark. null = orthographically invalid combination. */
const MARK_TABLE: Record<Exclude<ToneMark, 'none'>, Record<ConsonantClass, Tone | null>> = {
  maiEk: { mid: 'low', high: 'low', low: 'falling' },
  maiTho: { mid: 'falling', high: 'falling', low: 'high' },
  // Mai tri and mai chattawa are standard only on mid-class initials.
  maiTri: { mid: 'high', high: null, low: null },
  maiChattawa: { mid: 'rising', high: null, low: null },
};

const LIVE_TABLE: Record<ConsonantClass, Tone> = {
  mid: 'mid',
  high: 'rising',
  low: 'mid',
};

/**
 * Core resolution from fully analyzed features.
 * Returns null only for orthographically invalid mark/class combinations.
 */
export function resolveTone({ cls, mark, kind, length }: ToneFeatures): Tone | null {
  if (mark !== 'none') return MARK_TABLE[mark][cls];
  if (kind === 'live') return LIVE_TABLE[cls];
  if (cls === 'low') return length === 'short' ? 'high' : 'falling';
  return 'low'; // mid and high class, dead, any length
}

/**
 * Class of a written initial (letter, true cluster, or leading pair):
 *
 * - ho-nam: silent ห before an unpaired low sonorant → high-class rules
 *   (หมา หนู หลาย…). อ-leading (o-nam) is word-level — see exceptions.
 * - true clusters (กร ปล ตร คว…): the FIRST consonant's class governs.
 */
export function effectiveClass(initial: string): ConsonantClass | undefined {
  if (initial.length >= 2) {
    const [first, second] = [initial[0]!, initial[1]!];
    if (first === 'ห' && (UNPAIRED_LOW_SONORANTS as readonly string[]).includes(second)) {
      return 'high';
    }
    if (first === O_NAM_INITIAL && second === 'ย') {
      // อย- is only valid in the four o-nam words; those resolve via the
      // word-level exception lexicon. Treat bare อย- as mid (อ's class).
      return 'mid';
    }
    return classOf(first);
  }
  return classOf(initial);
}

/** live/dead from final consonant (or its absence) + vowel length. */
export function syllableKind(input: Pick<SyllableInput, 'final' | 'vowelLength'>): SyllableKind {
  if (input.final) {
    return finalKind(input.final) === 'stop' ? 'dead' : 'live';
  }
  return input.vowelLength === 'long' ? 'live' : 'dead';
}

/**
 * Tone of an analyzed syllable, with optional word context for the
 * exception lexicon (o-nam and irregulars).
 */
export function toneOfSyllable(input: SyllableInput, word?: string): Tone | null {
  const exception = word ? wordException(word) : undefined;
  const cls = exception?.cls ?? effectiveClass(input.initial);
  if (!cls) return null;
  return resolveTone({
    cls,
    mark: input.mark ?? 'none',
    kind: syllableKind(input),
    length: input.vowelLength,
  });
}

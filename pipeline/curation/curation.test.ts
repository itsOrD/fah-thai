import { describe, expect, it } from 'vitest';
import { ContentPack, DrillSet, Phoneme } from '../../app/src/content/schema';
import { toneOfSyllable } from '../../app/src/tone/engine';
import { DRILLS_T0 } from './drills-t0';
import { PHONEMES_T0 } from './phonemes-t0';

/**
 * CI guard for the curation data — the same two gates build-content.ts runs,
 * as tests, so a bad edit fails the verify job before any pipeline run.
 */

describe('T0 curation', () => {
  it('phonemes validate against the schema', () => {
    for (const p of PHONEMES_T0) expect(() => Phoneme.parse(p)).not.toThrow();
  });

  it('drill sets validate against the schema', () => {
    for (const s of DRILLS_T0) expect(() => DrillSet.parse(s)).not.toThrow();
  });

  it('the whole pack parses', () => {
    expect(() =>
      ContentPack.parse({
        id: 't0-sounds',
        title: 'T0',
        version: 1,
        phonemes: PHONEMES_T0,
        drillSets: DRILLS_T0,
      }),
    ).not.toThrow();
  });

  it('the tone engine agrees with every authored drill tone', () => {
    for (const set of DRILLS_T0) {
      for (const word of set.words) {
        const derived = toneOfSyllable(
          {
            initial: word.analysis.initial,
            mark: word.analysis.mark,
            final: word.analysis.final,
            vowelLength: word.analysis.vowelLength,
          },
          word.thai,
        );
        expect(derived, `${set.id} · ${word.thai}`).toBe(word.tone);
      }
    }
  });

  it('phoneme contrasts reference real phoneme ids or planned ones', () => {
    const ids = new Set(PHONEMES_T0.map((p) => p.id));
    // Contrasts may point at not-yet-authored phonemes (forward refs are
    // allowed and tracked here); this test documents which.
    const forward = new Set<string>();
    for (const p of PHONEMES_T0) {
      for (const c of p.contrasts) if (!ids.has(c)) forward.add(c);
    }
    expect([...forward].sort()).toEqual(['i', 'n', 'u', 'y']);
  });
});

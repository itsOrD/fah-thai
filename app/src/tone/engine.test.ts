import { describe, expect, it } from 'vitest';
import { effectiveClass, resolveTone, syllableKind, toneOfSyllable } from './engine';
import { oNamWords } from './exceptions';
import { HIGH_CLASS, LOW_CLASS, MID_CLASS, UNPAIRED_LOW_SONORANTS, classOf } from './letters';
import type { ConsonantClass, SyllableInput, Tone, ToneMark, VowelLength } from './types';

// ---------------------------------------------------------------------------
// Full decision table — every cell, verified against the planning research.
// ---------------------------------------------------------------------------

describe('resolveTone: mark table (mark overrides live/dead and length)', () => {
  const cases: [ToneMark, ConsonantClass, Tone | null][] = [
    ['maiEk', 'mid', 'low'],
    ['maiEk', 'high', 'low'],
    ['maiEk', 'low', 'falling'],
    ['maiTho', 'mid', 'falling'],
    ['maiTho', 'high', 'falling'],
    ['maiTho', 'low', 'high'],
    ['maiTri', 'mid', 'high'],
    ['maiTri', 'high', null],
    ['maiTri', 'low', null],
    ['maiChattawa', 'mid', 'rising'],
    ['maiChattawa', 'high', null],
    ['maiChattawa', 'low', null],
  ];

  it.each(cases)('%s on %s-class → %s', (mark, cls, expected) => {
    for (const kind of ['live', 'dead'] as const) {
      for (const length of ['short', 'long'] as const) {
        expect(resolveTone({ cls, mark, kind, length })).toBe(expected);
      }
    }
  });
});

describe('resolveTone: unmarked live syllables', () => {
  const cases: [ConsonantClass, Tone][] = [
    ['mid', 'mid'],
    ['high', 'rising'],
    ['low', 'mid'],
  ];

  it.each(cases)('%s-class live → %s (any length)', (cls, expected) => {
    for (const length of ['short', 'long'] as const) {
      expect(resolveTone({ cls, mark: 'none', kind: 'live', length })).toBe(expected);
    }
  });
});

describe('resolveTone: unmarked dead syllables (only low class splits on length)', () => {
  it('mid and high class → low regardless of length', () => {
    for (const cls of ['mid', 'high'] as const) {
      for (const length of ['short', 'long'] as const) {
        expect(resolveTone({ cls, mark: 'none', kind: 'dead', length })).toBe('low');
      }
    }
  });

  it('low class: short → high, long → falling', () => {
    expect(resolveTone({ cls: 'low', mark: 'none', kind: 'dead', length: 'short' })).toBe('high');
    expect(resolveTone({ cls: 'low', mark: 'none', kind: 'dead', length: 'long' })).toBe('falling');
  });
});

// ---------------------------------------------------------------------------
// Letter data audit
// ---------------------------------------------------------------------------

describe('letters', () => {
  it('classes count 9 mid / 11 high / 24 low = 44 and are disjoint', () => {
    expect(MID_CLASS).toHaveLength(9);
    expect(HIGH_CLASS).toHaveLength(11);
    expect(LOW_CLASS).toHaveLength(24);
    const all = [...MID_CLASS, ...HIGH_CLASS, ...LOW_CLASS];
    expect(new Set(all).size).toBe(44);
  });

  it('classOf resolves every letter and nothing else', () => {
    for (const c of MID_CLASS) expect(classOf(c)).toBe('mid');
    for (const c of HIGH_CLASS) expect(classOf(c)).toBe('high');
    for (const c of LOW_CLASS) expect(classOf(c)).toBe('low');
    expect(classOf('ะ')).toBeUndefined(); // a vowel, not a consonant
  });
});

// ---------------------------------------------------------------------------
// Special rules
// ---------------------------------------------------------------------------

describe('effectiveClass', () => {
  it('ho-nam: ห + every unpaired low sonorant → high', () => {
    for (const sonorant of UNPAIRED_LOW_SONORANTS) {
      expect(effectiveClass(`ห${sonorant}`)).toBe('high');
    }
  });

  it('true clusters take the first consonant class', () => {
    expect(effectiveClass('กร')).toBe('mid'); // กราบ
    expect(effectiveClass('ปล')).toBe('mid'); // ปลา
    expect(effectiveClass('คร')).toBe('low'); // ครับ
    expect(effectiveClass('ขว')).toBe('high'); // ขวา
  });

  it('single letters pass through', () => {
    expect(effectiveClass('ก')).toBe('mid');
    expect(effectiveClass('ส')).toBe('high');
    expect(effectiveClass('ม')).toBe('low');
  });
});

describe('syllableKind', () => {
  it('stop finals are dead; sonorant finals are live', () => {
    expect(syllableKind({ final: 'ก', vowelLength: 'long' })).toBe('dead');
    expect(syllableKind({ final: 'ด', vowelLength: 'short' })).toBe('dead');
    expect(syllableKind({ final: 'บ', vowelLength: 'short' })).toBe('dead');
    expect(syllableKind({ final: 'ง', vowelLength: 'short' })).toBe('live');
    expect(syllableKind({ final: 'ม', vowelLength: 'long' })).toBe('live');
    expect(syllableKind({ final: 'ย', vowelLength: 'short' })).toBe('live');
  });

  it('open syllables: long → live, short → dead', () => {
    expect(syllableKind({ vowelLength: 'long' })).toBe('live');
    expect(syllableKind({ vowelLength: 'short' })).toBe('dead');
  });
});

// ---------------------------------------------------------------------------
// Canonical words (plan §6 + ho-nam/o-nam/cluster sets)
// ---------------------------------------------------------------------------

describe('toneOfSyllable: canonical words', () => {
  const words: [string, SyllableInput, string | undefined, Tone][] = [
    // [display, analyzed syllable, word-context, expected tone]
    ['น้ำ (water)', { initial: 'น', mark: 'maiTho', final: 'ม', vowelLength: 'long' }, undefined, 'high'],
    ['ไม่ (not)', { initial: 'ม', mark: 'maiEk', final: 'ย', vowelLength: 'short' }, undefined, 'falling'],
    ['เก้า (nine)', { initial: 'ก', mark: 'maiTho', final: 'ว', vowelLength: 'short' }, undefined, 'falling'],
    ['ขาด (torn)', { initial: 'ข', final: 'ด', vowelLength: 'long' }, undefined, 'low'],
    ['มาก (much)', { initial: 'ม', final: 'ก', vowelLength: 'long' }, undefined, 'falling'],
    ['รัก (love)', { initial: 'ร', final: 'ก', vowelLength: 'short' }, undefined, 'high'],
    ['มา (come)', { initial: 'ม', vowelLength: 'long' }, undefined, 'mid'],
    ['หมา (dog, ho-nam)', { initial: 'หม', vowelLength: 'long' }, undefined, 'rising'],
    ['หนู (mouse, ho-nam)', { initial: 'หน', vowelLength: 'long' }, undefined, 'rising'],
    ['หลาย (many, ho-nam)', { initial: 'หล', final: 'ย', vowelLength: 'long' }, undefined, 'rising'],
    ['ห้า (five)', { initial: 'ห', mark: 'maiTho', vowelLength: 'long' }, undefined, 'falling'],
    ['ครับ (polite ♂)', { initial: 'คร', final: 'บ', vowelLength: 'short' }, undefined, 'high'],
    ['ใกล้ (near)', { initial: 'กล', mark: 'maiTho', final: 'ย', vowelLength: 'short' }, undefined, 'falling'],
    ['ไกล (far)', { initial: 'กล', final: 'ย', vowelLength: 'short' }, undefined, 'mid'],
    ['ปลา (fish)', { initial: 'ปล', vowelLength: 'long' }, undefined, 'mid'],
    ['ขอ (request)', { initial: 'ข', vowelLength: 'long' }, undefined, 'rising'],
    ['เผ็ด (spicy)', { initial: 'ผ', final: 'ด', vowelLength: 'short' }, undefined, 'low'],
    ['สวย (beautiful)', { initial: 'ส', final: 'ย', vowelLength: 'long' }, undefined, 'rising'],
    ['ม้า (horse)', { initial: 'ม', mark: 'maiTho', vowelLength: 'long' }, undefined, 'high'],
    ['ก๋วยเตี๋ยว syllable ก๋วย', { initial: 'ก', mark: 'maiChattawa', final: 'ย', vowelLength: 'short' }, undefined, 'rising'],
    // o-nam — all four words, via word context
    ['อย่า (don’t)', { initial: 'อย', mark: 'maiEk', vowelLength: 'long' }, 'อย่า', 'low'],
    ['อยู่ (to be at)', { initial: 'อย', mark: 'maiEk', vowelLength: 'long' }, 'อยู่', 'low'],
    ['อย่าง (kind/sort)', { initial: 'อย', mark: 'maiEk', final: 'ง', vowelLength: 'long' }, 'อย่าง', 'low'],
    ['อยาก (to want)', { initial: 'อย', final: 'ก', vowelLength: 'long' }, 'อยาก', 'low'],
  ];

  it.each(words)('%s → %s', (_label, input, word, expected) => {
    expect(toneOfSyllable(input, word)).toBe(expected);
  });

  it('exposes exactly the four o-nam words', () => {
    expect([...oNamWords()]).toEqual(['อย่า', 'อยู่', 'อย่าง', 'อยาก']);
  });

  it('returns null for unknown initials rather than guessing', () => {
    expect(toneOfSyllable({ initial: 'x', vowelLength: 'long' })).toBeNull();
  });
});

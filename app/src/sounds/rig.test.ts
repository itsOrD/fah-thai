import { describe, expect, it } from 'vitest';
import { PHONEMES_T0 } from '../../../pipeline/curation/phonemes-t0';
import { TONGUE_SHAPES, programFor, stateAt, tonguePath } from './rig';

describe('rig', () => {
  it('all tongue shapes share the same point count (lerpable)', () => {
    const counts = new Set(Object.values(TONGUE_SHAPES).map((s) => s.length));
    expect(counts.size).toBe(1);
  });

  it('every T0 phoneme maps to a valid, monotonic program', () => {
    for (const p of PHONEMES_T0) {
      const program = programFor(p.articulation);
      expect(program.length).toBeGreaterThanOrEqual(2);
      expect(program[0]!.t).toBe(0);
      expect(program[program.length - 1]!.t).toBe(1);
      for (let i = 1; i < program.length; i++) {
        expect(program[i]!.t).toBeGreaterThan(program[i - 1]!.t);
      }
    }
  });

  it('aspirated stops puff on release; unaspirated never do', () => {
    const ph = PHONEMES_T0.find((p) => p.id === 'ph')!;
    const bp = PHONEMES_T0.find((p) => p.id === 'bp')!;
    const puffs = (art: (typeof ph)['articulation']) =>
      programFor(art).some((k) => k.puff);
    expect(puffs(ph.articulation)).toBe(true);
    expect(puffs(bp.articulation)).toBe(false);
  });

  it('nasals open the velum; orals keep it closed', () => {
    const ng = PHONEMES_T0.find((p) => p.id === 'ng')!;
    expect(programFor(ng.articulation).every((k) => k.velumOpen === 1)).toBe(true);
    const g = PHONEMES_T0.find((p) => p.id === 'g')!;
    expect(programFor(g.articulation).every((k) => k.velumOpen === 0)).toBe(true);
  });

  it('stateAt interpolates smoothly and clamps', () => {
    const program = programFor({ place: 'bilabial', manner: 'stop', voiced: false, aspirated: true });
    const s0 = stateAt(program, 0);
    const sMid = stateAt(program, 0.43);
    const s1 = stateAt(program, 1);
    expect(s0.aperture).toBe(0);
    expect(sMid.aperture).toBeGreaterThan(0);
    expect(s1.aperture).toBeGreaterThan(0.3);
    expect(stateAt(program, -5).aperture).toBe(s0.aperture);
    expect(stateAt(program, 5).aperture).toBe(s1.aperture);
    expect(s0.tonguePoints).toHaveLength(8);
  });

  it('tonguePath produces a closed path', () => {
    const s = stateAt(programFor({ manner: 'vowel', tongueHeight: 'high', tongueBackness: 'back', rounded: false }), 1);
    const d = tonguePath(s.tonguePoints);
    expect(d.startsWith('M ')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
  });
});

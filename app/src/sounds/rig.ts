/**
 * The articulatory rig (pure): phoneme articulation → an animation program
 * for the sagittal and front mouth views.
 *
 * Geometry is stylized, not clinical — the teaching content is the CONTRAST
 * between sounds (tip-up vs back-up, puff vs no puff, buzz vs silence),
 * keyframed from the articulatory descriptions in Tingsabadh & Abramson
 * (1993) and Slayden (2009). Coordinate space: 220×220 viewBox, face in
 * profile looking LEFT (lips ≈ x30, glottis lower right).
 */
import type { z } from 'zod';
import type { Articulation } from '../content/schema';

type ArticulationT = z.infer<typeof Articulation>;

/** Tongue as 8 control points, tip → root. Same count everywhere = lerpable. */
export type TongueShape = readonly (readonly [number, number])[];

export const TONGUE_SHAPES = {
  neutral: [[55, 135], [70, 120], [90, 112], [110, 112], [128, 118], [140, 130], [150, 145], [155, 160]],
  alveolarClosure: [[52, 80], [68, 96], [88, 106], [108, 111], [126, 118], [138, 130], [148, 145], [155, 160]],
  velarClosure: [[58, 140], [75, 128], [95, 114], [115, 96], [131, 82], [142, 94], [150, 122], [155, 160]],
  highBack: [[60, 130], [78, 114], [98, 99], [118, 92], [134, 96], [144, 112], [152, 136], [155, 160]],
  midBack: [[58, 135], [76, 122], [96, 112], [116, 105], [132, 108], [143, 121], [151, 141], [155, 160]],
  low: [[58, 143], [76, 137], [96, 132], [116, 130], [132, 133], [143, 139], [151, 149], [155, 160]],
  frontHigh: [[55, 115], [72, 101], [92, 95], [112, 100], [128, 110], [140, 124], [150, 142], [155, 160]],
} as const satisfies Record<string, TongueShape>;

export type TongueShapeName = keyof typeof TONGUE_SHAPES;

export interface MouthState {
  tongue: TongueShapeName;
  /** 0 = lips sealed, 1 = wide open. */
  aperture: number;
  /** 0 = spread, 1 = fully rounded/protruded. */
  rounding: number;
  /** 0 = velum raised (oral), 1 = lowered (nasal airflow). */
  velumOpen: number;
  /** Vocal-fold buzz active. */
  voiced: boolean;
  /** Breath puff visible at the lips. */
  puff: boolean;
  /** Rapid tongue-tip oscillation (ร trill). */
  trill: boolean;
}

export interface Keyframe extends MouthState {
  /** Position in the loop, 0..1, strictly increasing per program. */
  t: number;
}

const BASE: Omit<MouthState, 'tongue'> = {
  aperture: 0.45,
  rounding: 0.15,
  velumOpen: 0,
  voiced: false,
  puff: false,
  trill: false,
};

function kf(t: number, tongue: TongueShapeName, over: Partial<MouthState> = {}): Keyframe {
  return { t, tongue, ...BASE, ...over };
}

/**
 * A stop program: closure (held) → release (± puff) → open vowel.
 * `closure` describes where the seal happens.
 */
function stopProgram(
  closure: { tongue: TongueShapeName; aperture: number },
  opts: { aspirated: boolean; voiced: boolean },
): Keyframe[] {
  const hold = { tongue: closure.tongue, aperture: closure.aperture, voiced: opts.voiced };
  return [
    kf(0, hold.tongue, { aperture: hold.aperture, voiced: hold.voiced }),
    kf(0.38, hold.tongue, { aperture: hold.aperture, voiced: hold.voiced }),
    kf(0.48, 'neutral', { aperture: 0.5, puff: opts.aspirated, voiced: opts.voiced }),
    kf(0.62, 'low', { aperture: 0.62, puff: opts.aspirated && false, voiced: true }),
    kf(1, 'low', { aperture: 0.55, voiced: true }),
  ];
}

/** Continuous program (nasals, liquids): hold the posture, breathe. */
function continuantProgram(state: Partial<MouthState> & { tongue: TongueShapeName }): Keyframe[] {
  return [
    kf(0, state.tongue, { ...state, voiced: state.voiced ?? true }),
    kf(0.5, state.tongue, { ...state, voiced: state.voiced ?? true, aperture: (state.aperture ?? 0.4) + 0.04 }),
    kf(1, state.tongue, { ...state, voiced: state.voiced ?? true }),
  ];
}

/** Vowel program: settle into the posture and hold. */
function vowelProgram(state: Partial<MouthState> & { tongue: TongueShapeName }): Keyframe[] {
  return [
    kf(0, 'neutral', { aperture: 0.35, voiced: true }),
    kf(0.3, state.tongue, { ...state, voiced: true }),
    kf(1, state.tongue, { ...state, voiced: true }),
  ];
}

/** Maps a phoneme's articulation attributes to its animation program. */
export function programFor(a: ArticulationT): Keyframe[] {
  if (a.manner === 'stop') {
    const aspirated = a.aspirated ?? false;
    const voiced = a.voiced ?? false;
    if (a.place === 'bilabial') return stopProgram({ tongue: 'neutral', aperture: 0 }, { aspirated, voiced });
    if (a.place === 'velar') return stopProgram({ tongue: 'velarClosure', aperture: 0.3 }, { aspirated, voiced });
    return stopProgram({ tongue: 'alveolarClosure', aperture: 0.25 }, { aspirated, voiced });
  }
  if (a.manner === 'nasal') {
    const tongue: TongueShapeName = a.place === 'velar' ? 'velarClosure' : a.place === 'bilabial' ? 'neutral' : 'alveolarClosure';
    return continuantProgram({ tongue, aperture: a.place === 'bilabial' ? 0 : 0.3, velumOpen: 1 });
  }
  if (a.manner === 'trill') {
    return continuantProgram({ tongue: 'alveolarClosure', aperture: 0.35, trill: true });
  }
  if (a.manner === 'approximant') {
    return continuantProgram({ tongue: 'alveolarClosure', aperture: 0.4 });
  }
  if (a.manner === 'vowel') {
    const tongue: TongueShapeName =
      a.tongueHeight === 'high'
        ? a.tongueBackness === 'front'
          ? 'frontHigh'
          : 'highBack'
        : a.tongueHeight === 'low'
          ? 'low'
          : 'midBack';
    return vowelProgram({ tongue, aperture: a.tongueHeight === 'low' ? 0.7 : 0.42, rounding: a.rounded ? 0.85 : 0.05 });
  }
  // Fricatives/affricates arrive with later tranches; neutral continuant for now.
  return continuantProgram({ tongue: 'neutral', aperture: 0.35, voiced: a.voiced ?? false });
}

/** Linear interpolation of the full mouth state at loop position t (0..1). */
export function stateAt(program: Keyframe[], t: number): MouthState & { tonguePoints: number[][] } {
  const clamped = Math.max(0, Math.min(1, t));
  let a = program[0]!;
  let b = program[program.length - 1]!;
  for (let i = 0; i < program.length - 1; i++) {
    if (clamped >= program[i]!.t && clamped <= program[i + 1]!.t) {
      a = program[i]!;
      b = program[i + 1]!;
      break;
    }
  }
  const span = b.t - a.t || 1;
  const f = (clamped - a.t) / span;
  const lerp = (x: number, y: number) => x + (y - x) * f;
  const sa = TONGUE_SHAPES[a.tongue];
  const sb = TONGUE_SHAPES[b.tongue];
  const tonguePoints = sa.map((p, i) => [lerp(p[0], sb[i]![0]), lerp(p[1], sb[i]![1])]);
  return {
    tongue: f < 0.5 ? a.tongue : b.tongue,
    aperture: lerp(a.aperture, b.aperture),
    rounding: lerp(a.rounding, b.rounding),
    velumOpen: lerp(a.velumOpen, b.velumOpen),
    voiced: f < 0.5 ? a.voiced : b.voiced,
    puff: f < 0.5 ? a.puff : b.puff,
    trill: a.trill || b.trill,
    tonguePoints,
  };
}

/** Smooth SVG path through the tongue points, closed along the jaw floor. */
export function tonguePath(points: number[][]): string {
  const [first, ...rest] = points;
  if (!first) return '';
  let d = `M ${first[0]} ${first[1]}`;
  for (let i = 0; i < rest.length; i++) {
    const p = rest[i]!;
    const prev = points[i]!;
    const cx = (prev[0]! + p[0]!) / 2;
    const cy = (prev[1]! + p[1]!) / 2;
    d += ` Q ${prev[0]} ${prev[1]} ${cx} ${cy}`;
  }
  const last = points[points.length - 1]!;
  d += ` L ${last[0]} ${last[1]} L 155 172 L 60 172 Z`;
  return d;
}

/**
 * Tone contour data — modern Bangkok Thai, not textbook flat lines.
 *
 * Chao tone digits per Morén & Zsiga (2006) / Zsiga & Nitisaroj (2007):
 * mid [33], low [21] (falls slightly), falling [41], HIGH [45] (rises —
 * the single most misdrawn tone in teaching materials), rising [214].
 *
 * `points` are normalized {t, y} in [0,1] (y: 1 = top of the speaker's
 * range) for drawing glyphs and as the reference shapes the Tone Studio
 * scorer resamples against.
 */
import type { Tone } from './types';

export interface ContourPoint {
  t: number;
  y: number;
}

export interface ToneSpec {
  tone: Tone;
  /** Thai name, e.g. สามัญ. */
  thaiName: string;
  chao: string;
  points: readonly ContourPoint[];
}

export const TONE_SPECS: Record<Tone, ToneSpec> = {
  mid: {
    tone: 'mid',
    thaiName: 'สามัญ',
    chao: '33',
    points: [
      { t: 0, y: 0.5 },
      { t: 0.5, y: 0.49 },
      { t: 1, y: 0.46 },
    ],
  },
  low: {
    tone: 'low',
    thaiName: 'เอก',
    chao: '21',
    points: [
      { t: 0, y: 0.36 },
      { t: 0.5, y: 0.28 },
      { t: 1, y: 0.18 },
    ],
  },
  falling: {
    tone: 'falling',
    thaiName: 'โท',
    chao: '41',
    points: [
      { t: 0, y: 0.68 },
      { t: 0.25, y: 0.74 },
      { t: 0.6, y: 0.5 },
      { t: 1, y: 0.12 },
    ],
  },
  high: {
    tone: 'high',
    thaiName: 'ตรี',
    chao: '45',
    points: [
      { t: 0, y: 0.58 },
      { t: 0.5, y: 0.64 },
      { t: 0.8, y: 0.78 },
      { t: 1, y: 0.94 },
    ],
  },
  rising: {
    tone: 'rising',
    thaiName: 'จัตวา',
    chao: '214',
    points: [
      { t: 0, y: 0.4 },
      { t: 0.35, y: 0.16 },
      { t: 0.7, y: 0.45 },
      { t: 1, y: 0.86 },
    ],
  },
};

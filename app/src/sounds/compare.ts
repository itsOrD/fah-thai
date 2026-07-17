/**
 * English-trap comparisons: for a given phoneme, the articulation an English
 * speaker wrongly substitutes — rendered as the saffron ghost overlay.
 * Only sounds where the visual contrast teaches something get one.
 */
import type { z } from 'zod';
import type { Articulation, PhonemeT } from '../content/schema';

type ArticulationT = z.infer<typeof Articulation>;

export function englishTrapArticulation(p: PhonemeT): ArticulationT | null {
  const a = p.articulation;
  // Unaspirated stops: English speakers add the puff.
  if (a.manner === 'stop' && a.aspirated === false && a.voiced === false) {
    return { ...a, aspirated: true };
  }
  // Initial ง: English speakers front it to an alveolar n.
  if (p.id === 'ng') {
    return { place: 'alveolar', manner: 'nasal', voiced: true };
  }
  // The unrounded back vowels: English speakers round the lips ("oo").
  if (a.manner === 'vowel' && a.rounded === false && a.tongueBackness === 'back') {
    return { ...a, rounded: true };
  }
  return null;
}

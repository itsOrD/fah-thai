/**
 * T0 priority phonemes — the sounds English speakers get wrong, first
 * (plan §3 M1). Articulatory data per Tingsabadh & Abramson (1993) and
 * Slayden (2009); these attributes drive the animated mouth rig.
 *
 * Hand-authored, code-reviewed data. The build validates against
 * content/schema.ts and cross-checks every drill tone with the engine.
 */
import type { PhonemeT } from '../../app/src/content/schema';

export const PHONEMES_T0: PhonemeT[] = [
  // --- The three-way VOT contrast, labial ---------------------------------
  {
    id: 'bp',
    ipa: 'p',
    paiboon: 'bp',
    kind: 'initial',
    thaiLetters: ['ป'],
    articulation: { place: 'bilabial', manner: 'stop', voiced: false, aspirated: false },
    englishTrap:
      'English "p" is aspirated — a puff of air Thai ears hear as พ. Your ป must have NO puff.',
    howTo:
      'Lips closed like "p", but release with zero breath — as if the "p" hides inside "spa". Hold a tissue in front: it must not move.',
    contrasts: ['ph', 'b'],
    teachWeek: 1,
  },
  {
    id: 'ph',
    ipa: 'pʰ',
    paiboon: 'p',
    kind: 'initial',
    thaiLetters: ['พ', 'ผ', 'ภ'],
    articulation: { place: 'bilabial', manner: 'stop', voiced: false, aspirated: true },
    englishTrap: 'This one IS your English "p" — the trap is using it where ป belongs.',
    howTo: 'Strong puff of air on release. The tissue jumps.',
    contrasts: ['bp', 'b'],
    teachWeek: 1,
  },
  {
    id: 'b',
    ipa: 'b',
    paiboon: 'b',
    kind: 'initial',
    thaiLetters: ['บ'],
    articulation: { place: 'bilabial', manner: 'stop', voiced: true, aspirated: false },
    englishTrap: 'Same as English "b" — but keep it fully voiced, never drifting toward ป.',
    howTo: 'Vocal cords buzz BEFORE the lips open. Hum into the closure.',
    contrasts: ['bp', 'ph'],
    teachWeek: 1,
  },
  // --- The three-way VOT contrast, alveolar -------------------------------
  {
    id: 'dt',
    ipa: 't',
    paiboon: 'dt',
    kind: 'initial',
    thaiLetters: ['ต', 'ฏ'],
    articulation: { place: 'alveolar', manner: 'stop', voiced: false, aspirated: false },
    englishTrap: 'English "t" carries a puff; ต has none — Thai ears hear your "t" as ท.',
    howTo: 'Tongue tip at the ridge behind your teeth, release with no breath — the "t" inside "star".',
    contrasts: ['th', 'd'],
    teachWeek: 1,
  },
  {
    id: 'th',
    ipa: 'tʰ',
    paiboon: 't',
    kind: 'initial',
    thaiLetters: ['ท', 'ถ', 'ธ', 'ฐ', 'ฑ', 'ฒ'],
    articulation: { place: 'alveolar', manner: 'stop', voiced: false, aspirated: true },
    englishTrap: 'Your English "t" — NOT the "th" of "think"; Thai has no such sound.',
    howTo: 'Aspirated "t", tissue jumps. Never bite your tongue for this letter.',
    contrasts: ['dt', 'd'],
    teachWeek: 1,
  },
  {
    id: 'd',
    ipa: 'd',
    paiboon: 'd',
    kind: 'initial',
    thaiLetters: ['ด', 'ฎ'],
    articulation: { place: 'alveolar', manner: 'stop', voiced: true, aspirated: false },
    englishTrap: 'Same as English "d" — keep the voicing strong.',
    howTo: 'Buzz before release, tongue at the ridge.',
    contrasts: ['dt', 'th'],
    teachWeek: 1,
  },
  // --- Velar pair ----------------------------------------------------------
  {
    id: 'g',
    ipa: 'k',
    paiboon: 'g',
    kind: 'initial',
    thaiLetters: ['ก'],
    articulation: { place: 'velar', manner: 'stop', voiced: false, aspirated: false },
    englishTrap: 'Between English "g" and "k" — the "k" inside "ski", with no puff.',
    howTo: 'Back of tongue on the soft palate, clean release, zero breath.',
    contrasts: ['kh'],
    teachWeek: 1,
  },
  {
    id: 'kh',
    ipa: 'kʰ',
    paiboon: 'k',
    kind: 'initial',
    thaiLetters: ['ค', 'ข', 'ฆ', 'ฃ', 'ฅ'],
    articulation: { place: 'velar', manner: 'stop', voiced: false, aspirated: true },
    englishTrap: 'Your English "k" with its natural puff.',
    howTo: 'Aspirated "k". Tissue jumps.',
    contrasts: ['g'],
    teachWeek: 1,
  },
  // --- Initial ŋ -----------------------------------------------------------
  {
    id: 'ng',
    ipa: 'ŋ',
    paiboon: 'ng',
    kind: 'initial',
    thaiLetters: ['ง'],
    articulation: { place: 'velar', manner: 'nasal', voiced: true },
    englishTrap:
      'You already make this sound — but only at the END of words ("sing"). Thai puts it at the START.',
    howTo:
      'Say "singing", freeze on the "ng", hold it… now release into a vowel: "nga". Back of tongue stays up, air through the nose.',
    contrasts: ['n', 'y'],
    teachWeek: 2,
  },
  // --- r/l -----------------------------------------------------------------
  {
    id: 'r',
    ipa: 'r',
    paiboon: 'r',
    kind: 'initial',
    thaiLetters: ['ร'],
    articulation: { place: 'alveolar', manner: 'trill', voiced: true },
    englishTrap:
      'NOT the English "r" (no lip rounding, no bunched tongue). A tap or light trill — and yes, Bangkok speech often relaxes it toward "l"; you should still own the tap.',
    howTo: 'Tongue tip taps the ridge once, like the "tt" in American "butter". Trill = repeated taps.',
    contrasts: ['l'],
    teachWeek: 2,
  },
  {
    id: 'l',
    ipa: 'l',
    paiboon: 'l',
    kind: 'initial',
    thaiLetters: ['ล', 'ฬ'],
    articulation: { place: 'alveolar', manner: 'approximant', voiced: true },
    englishTrap: 'Light "l" as in "let" — never the dark "l" of "full".',
    howTo: 'Tongue tip touches the ridge, air flows around the sides.',
    contrasts: ['r'],
    teachWeek: 2,
  },
  // --- The unrounded back vowels ------------------------------------------
  {
    id: 'ue',
    ipa: 'ɯ',
    paiboon: 'ʉ',
    kind: 'vowel',
    thaiLetters: ['อึ'],
    articulation: { manner: 'vowel', tongueHeight: 'high', tongueBackness: 'back', rounded: false },
    englishTrap: 'English has nothing here. It is "oo" with the lips of "ee".',
    howTo:
      'Say "oo", freeze your tongue, now SMILE — unround the lips completely without moving the tongue. That vowel.',
    contrasts: ['ue-long', 'u', 'i'],
    teachWeek: 1,
  },
  {
    id: 'ue-long',
    ipa: 'ɯː',
    paiboon: 'ʉʉ',
    kind: 'vowel',
    thaiLetters: ['อือ'],
    articulation: { manner: 'vowel', tongueHeight: 'high', tongueBackness: 'back', rounded: false },
    englishTrap: 'Same sound, held long — length changes the word in Thai.',
    howTo: 'The smiling "oo", held twice as long.',
    contrasts: ['ue'],
    teachWeek: 1,
  },
  {
    id: 'oe-long',
    ipa: 'ɤː',
    paiboon: 'əə',
    kind: 'vowel',
    thaiLetters: ['เออ'],
    articulation: { manner: 'vowel', tongueHeight: 'mid', tongueBackness: 'back', rounded: false },
    englishTrap: 'Close to the vowel in "her" (without the r), but further back and unrounded.',
    howTo: 'Relaxed "uh", tongue pulled slightly back, lips loose and unrounded.',
    contrasts: ['ue-long'],
    teachWeek: 2,
  },
];

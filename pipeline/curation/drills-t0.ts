/**
 * T0 drill sets — the starter minimal-pair inventory for the Ear Gym and
 * the TTS pilot. Every word carries an engine-checkable analysis; the build
 * fails if the tone engine disagrees with the authored tone (the highest-
 * leverage QA rule in the repo).
 *
 * Grows to the full ~100-item pilot list alongside the first TTS run;
 * mid-vs-low pairs get deliberately overweighted as tranches land (research:
 * hardest contrast for English speakers, confusable even for natives).
 */
import type { DrillSetT } from '../../app/src/content/schema';

export const DRILLS_T0: DrillSetT[] = [
  {
    id: 'tone-maa',
    axis: 'tone',
    note: 'The classic: identical segments, three tones, three unrelated words.',
    words: [
      { thai: 'มา', paiboon: 'maa', gloss: 'to come', tone: 'mid', analysis: { initial: 'ม', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'ม้า', paiboon: 'máa', gloss: 'horse', tone: 'high', analysis: { initial: 'ม', mark: 'maiTho', vowelLength: 'long' }, audio: [] },
      { thai: 'หมา', paiboon: 'mǎa', gloss: 'dog', tone: 'rising', analysis: { initial: 'หม', mark: 'none', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'tone-khaao',
    axis: 'tone',
    note: 'White / news / rice — one spelling family, three tones you will order food with.',
    words: [
      { thai: 'ขาว', paiboon: 'kǎao', gloss: 'white', tone: 'rising', analysis: { initial: 'ข', mark: 'none', final: 'ว', vowelLength: 'long' }, audio: [] },
      { thai: 'ข่าว', paiboon: 'kàao', gloss: 'news', tone: 'low', analysis: { initial: 'ข', mark: 'maiEk', final: 'ว', vowelLength: 'long' }, audio: [] },
      { thai: 'ข้าว', paiboon: 'kâao', gloss: 'rice', tone: 'falling', analysis: { initial: 'ข', mark: 'maiTho', final: 'ว', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'tone-suea',
    axis: 'tone',
    note: 'Tiger / mat / shirt.',
    words: [
      { thai: 'เสือ', paiboon: 'sʉ̌a', gloss: 'tiger', tone: 'rising', analysis: { initial: 'ส', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'เสื่อ', paiboon: 'sʉ̀a', gloss: 'mat', tone: 'low', analysis: { initial: 'ส', mark: 'maiEk', vowelLength: 'long' }, audio: [] },
      { thai: 'เสื้อ', paiboon: 'sʉ̂a', gloss: 'shirt', tone: 'falling', analysis: { initial: 'ส', mark: 'maiTho', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'tone-bpaa',
    axis: 'tone',
    words: [
      { thai: 'ปา', paiboon: 'bpaa', gloss: 'to throw', tone: 'mid', analysis: { initial: 'ป', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'ป่า', paiboon: 'bpàa', gloss: 'forest', tone: 'low', analysis: { initial: 'ป', mark: 'maiEk', vowelLength: 'long' }, audio: [] },
      { thai: 'ป้า', paiboon: 'bpâa', gloss: 'aunt (elder)', tone: 'falling', analysis: { initial: 'ป', mark: 'maiTho', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'tone-naa',
    axis: 'tone',
    note: 'Field / aunt-uncle / face — includes a ho-nam spelling.',
    words: [
      { thai: 'นา', paiboon: 'naa', gloss: 'rice field', tone: 'mid', analysis: { initial: 'น', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'น้า', paiboon: 'náa', gloss: 'aunt/uncle (mother’s younger)', tone: 'high', analysis: { initial: 'น', mark: 'maiTho', vowelLength: 'long' }, audio: [] },
      { thai: 'หน้า', paiboon: 'nâa', gloss: 'face; front', tone: 'falling', analysis: { initial: 'หน', mark: 'maiTho', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'tone-glai',
    axis: 'tone',
    note: 'Near vs far — the infamous pair where tone flips the meaning to its opposite.',
    words: [
      { thai: 'ใกล้', paiboon: 'glâi', gloss: 'near', tone: 'falling', analysis: { initial: 'กล', mark: 'maiTho', final: 'ย', vowelLength: 'short' }, audio: [] },
      { thai: 'ไกล', paiboon: 'glai', gloss: 'far', tone: 'mid', analysis: { initial: 'กล', mark: 'none', final: 'ย', vowelLength: 'short' }, audio: [] },
    ],
  },
  {
    id: 'tone-mai',
    axis: 'tone',
    words: [
      { thai: 'ไม่', paiboon: 'mâi', gloss: 'not', tone: 'falling', analysis: { initial: 'ม', mark: 'maiEk', final: 'ย', vowelLength: 'short' }, audio: [] },
      { thai: 'ไม้', paiboon: 'mái', gloss: 'wood', tone: 'high', analysis: { initial: 'ม', mark: 'maiTho', final: 'ย', vowelLength: 'short' }, audio: [] },
    ],
  },
  {
    id: 'tone-khaa',
    axis: 'tone',
    note: 'Mixed spellings landing on mid/low/falling — reading practice disguised as ear practice.',
    words: [
      { thai: 'คา', paiboon: 'kaa', gloss: 'to be stuck', tone: 'mid', analysis: { initial: 'ค', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'ข่า', paiboon: 'kàa', gloss: 'galangal', tone: 'low', analysis: { initial: 'ข', mark: 'maiEk', vowelLength: 'long' }, audio: [] },
      { thai: 'ค่า', paiboon: 'kâa', gloss: 'value; fee', tone: 'falling', analysis: { initial: 'ค', mark: 'maiEk', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'length-gan',
    axis: 'vowel-length',
    note: 'Same mid tone; only the vowel length differs.',
    words: [
      { thai: 'กัน', paiboon: 'gan', gloss: 'together; each other', tone: 'mid', analysis: { initial: 'ก', mark: 'none', final: 'น', vowelLength: 'short' }, audio: [] },
      { thai: 'กาน', paiboon: 'gaan', gloss: '(syllable) กาน', tone: 'mid', analysis: { initial: 'ก', mark: 'none', final: 'น', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'length-khan',
    axis: 'vowel-length',
    words: [
      { thai: 'ขัน', paiboon: 'kǎn', gloss: 'water bowl; to crow', tone: 'rising', analysis: { initial: 'ข', mark: 'none', final: 'น', vowelLength: 'short' }, audio: [] },
      { thai: 'ขาน', paiboon: 'kǎan', gloss: 'to call out (reply)', tone: 'rising', analysis: { initial: 'ข', mark: 'none', final: 'น', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'aspiration-bpaa-paa',
    axis: 'aspiration',
    note: 'The puff decides the word: unaspirated ป vs aspirated พ.',
    words: [
      { thai: 'ปา', paiboon: 'bpaa', gloss: 'to throw', tone: 'mid', analysis: { initial: 'ป', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'พา', paiboon: 'paa', gloss: 'to lead/take someone', tone: 'mid', analysis: { initial: 'พ', mark: 'none', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'aspiration-dtaa-taa',
    axis: 'aspiration',
    words: [
      { thai: 'ตา', paiboon: 'dtaa', gloss: 'eye; grandpa (maternal)', tone: 'mid', analysis: { initial: 'ต', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'ทา', paiboon: 'taa', gloss: 'to apply/spread on', tone: 'mid', analysis: { initial: 'ท', mark: 'none', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'aspiration-gaa-khaa',
    axis: 'aspiration',
    words: [
      { thai: 'กา', paiboon: 'gaa', gloss: 'crow; kettle', tone: 'mid', analysis: { initial: 'ก', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'คา', paiboon: 'kaa', gloss: 'to be stuck', tone: 'mid', analysis: { initial: 'ค', mark: 'none', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'voicing-bai-bpai',
    axis: 'aspiration',
    note: 'Voiced บ vs unaspirated ป — the pair behind every "bai/pai" confusion.',
    words: [
      { thai: 'ใบ', paiboon: 'bai', gloss: 'leaf; classifier', tone: 'mid', analysis: { initial: 'บ', mark: 'none', final: 'ย', vowelLength: 'short' }, audio: [] },
      { thai: 'ไป', paiboon: 'bpai', gloss: 'to go', tone: 'mid', analysis: { initial: 'ป', mark: 'none', final: 'ย', vowelLength: 'short' }, audio: [] },
    ],
  },
  {
    id: 'phoneme-rak-lak',
    axis: 'phoneme',
    note: 'ร vs ล — same high tone, different consonant.',
    words: [
      { thai: 'รัก', paiboon: 'rák', gloss: 'to love', tone: 'high', analysis: { initial: 'ร', mark: 'none', final: 'ก', vowelLength: 'short' }, audio: [] },
      { thai: 'ลัก', paiboon: 'lák', gloss: 'to steal', tone: 'high', analysis: { initial: 'ล', mark: 'none', final: 'ก', vowelLength: 'short' }, audio: [] },
    ],
  },
  {
    id: 'phoneme-ngaam-yaam',
    axis: 'phoneme',
    note: 'Initial ง against ย — the sound English never starts words with.',
    words: [
      { thai: 'งาม', paiboon: 'ngaam', gloss: 'beautiful (formal)', tone: 'mid', analysis: { initial: 'ง', mark: 'none', final: 'ม', vowelLength: 'long' }, audio: [] },
      { thai: 'ยาม', paiboon: 'yaam', gloss: 'watchman; period', tone: 'mid', analysis: { initial: 'ย', mark: 'none', final: 'ม', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'vowel-muee-mii',
    axis: 'phoneme',
    note: 'The smiling vowel ʉʉ against ii.',
    words: [
      { thai: 'มือ', paiboon: 'mʉʉ', gloss: 'hand', tone: 'mid', analysis: { initial: 'ม', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'มี', paiboon: 'mii', gloss: 'to have', tone: 'mid', analysis: { initial: 'ม', mark: 'none', vowelLength: 'long' }, audio: [] },
    ],
  },
  {
    id: 'vowel-jooe-joo',
    axis: 'phoneme',
    note: 'əə (เ-อ) against ɔɔ (-อ).',
    words: [
      { thai: 'เจอ', paiboon: 'jəə', gloss: 'to meet/find', tone: 'mid', analysis: { initial: 'จ', mark: 'none', vowelLength: 'long' }, audio: [] },
      { thai: 'จอ', paiboon: 'jɔɔ', gloss: 'screen', tone: 'mid', analysis: { initial: 'จ', mark: 'none', vowelLength: 'long' }, audio: [] },
    ],
  },
];

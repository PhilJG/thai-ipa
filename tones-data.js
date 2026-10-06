// Thai tones and tone marks. Each `id` maps to audio/<id>.mp3, spoken from its `thai` text.
// Keep each entry on one line: tools/generate_audio.py reads this file line by line.
// Pitch contours are drawn from the tone letters in TONES (consonants-data.js).

// The five tones, with their Thai names (เสียง… "sound of …").
const TONE_INFO = [
  { tone: 'mid', id: 'tn-mid', thai: 'เสียงสามัญ', rom: 'sǐang sǎa-man', how: 'Flat and level, in the middle of your normal speaking voice.', tip: 'Like a calm, bored "uh-huh".' },
  { tone: 'low', id: 'tn-low', thai: 'เสียงเอก', rom: 'sǐang èek', how: 'Starts below your normal pitch and sinks a little lower.', tip: 'Low and relaxed, like a quiet sigh.' },
  { tone: 'falling', id: 'tn-falling', thai: 'เสียงโท', rom: 'sǐang thoo', how: 'Starts high and drops sharply.', tip: 'Like a firm "No!" or "Uh-oh".' },
  { tone: 'high', id: 'tn-high', thai: 'เสียงตรี', rom: 'sǐang trii', how: 'High and tense, rising slightly at the end.', tip: 'Like a surprised "Oh?" at the top of your voice.' },
  { tone: 'rising', id: 'tn-rising', thai: 'เสียงจัตวา', rom: 'sǐang jàt-ta-waa', how: 'Dips low, then climbs.', tip: 'Like a doubtful "Really?"' },
];

// The four tone marks, written above the initial consonant (or its second letter in a cluster).
const TONE_MARKS = [
  { key: 'm1', id: 'tm-ek', thai: 'ไม้เอก', mark: '่', rom: 'mái èek' },
  { key: 'm2', id: 'tm-tho', thai: 'ไม้โท', mark: '้', rom: 'mái thoo' },
  { key: 'm3', id: 'tm-tri', thai: 'ไม้ตรี', mark: '๊', rom: 'mái trii' },
  { key: 'm4', id: 'tm-chattawa', thai: 'ไม้จัตวา', mark: '๋', rom: 'mái jàt-ta-waa' },
];

// Words that differ only in tone. Some reuse audio from the tone table or the vocabulary.
const TONE_SETS = [
  { key: 'khaa', title: 'khaa', note: 'One syllable, all five tones.' },
  { key: 'mai', title: 'mai', note: 'Spelt with different vowel signs, consonants and marks.' },
  { key: 'khaao', title: 'khaao', note: 'No real word has the high tone here.' },
];

const TONE_WORDS = [
  { set: 'khaa', tone: 'mid', id: 't-low-lo', thai: 'คา', rom: 'khaa', en: 'stuck' },
  { set: 'khaa', tone: 'low', id: 't-high-m1', thai: 'ข่า', rom: 'khàa', en: 'galangal' },
  { set: 'khaa', tone: 'falling', id: 't-low-m1', thai: 'ค่า', rom: 'khâa', en: 'value' },
  { set: 'khaa', tone: 'high', id: 't-low-m2', thai: 'ค้า', rom: 'kháa', en: 'to trade' },
  { set: 'khaa', tone: 'rising', id: 't-high-lo', thai: 'ขา', rom: 'khǎa', en: 'leg' },
  { set: 'mai', tone: 'mid', id: 'tw-mai-mid', thai: 'ไมล์', rom: 'mai', en: 'mile' },
  { set: 'mai', tone: 'low', id: 'tw-mai-low', thai: 'ใหม่', rom: 'mài', en: 'new' },
  { set: 'mai', tone: 'falling', id: 'v-mai-neg', thai: 'ไม่', rom: 'mâi', en: 'not' },
  { set: 'mai', tone: 'high', id: 'tw-mai-high', thai: 'ไม้', rom: 'mái', en: 'wood' },
  { set: 'mai', tone: 'rising', id: 'v-mai-q', thai: 'ไหม', rom: 'mǎi', en: 'question word' },
  { set: 'khaao', tone: 'mid', id: 'tw-khaao-mid', thai: 'คาว', rom: 'khaao', en: 'fishy smell' },
  { set: 'khaao', tone: 'low', id: 'tw-khaao-low', thai: 'ข่าว', rom: 'khàao', en: 'news' },
  { set: 'khaao', tone: 'falling', id: 'v-khao', thai: 'ข้าว', rom: 'khâao', en: 'rice' },
  { set: 'khaao', tone: 'rising', id: 'tw-khaao-rising', thai: 'ขาว', rom: 'khǎao', en: 'white' },
];

// A classic tone tongue-twister.
const TONE_TWISTER = { id: 'tw-twister', thai: 'ไม้ใหม่ไม่ไหม้ไหม', rom: 'mái mài mâi mâi mǎi', en: "New wood doesn't burn, does it?", tones: ['high', 'low', 'falling', 'falling', 'rising'], words: ['ไม้', 'ใหม่', 'ไม่', 'ไหม้', 'ไหม'] };

// Thai vowel inventory. Each sound has an `id` that maps to audio/<id>.mp3
// (and audio/<id>-ex.mp3 for its example word). Regenerate audio with
// tools/generate_audio.py after editing this file.

// Monophthongs, grouped by their position on the vowel chart.
// `pos` is the key used in app.js to place the group on the trapezoid.
const MONOPHTHONGS = [
  {
    pos: 'i', name: 'close front unrounded',
    short: { id: 'i', ipa: 'i', thai: 'อิ', ex: { thai: 'กิน', rom: 'kin', en: 'eat' } },
    long: { id: 'ii', ipa: 'iː', thai: 'อี', ex: { thai: 'ดี', rom: 'dii', en: 'good' } },
  },
  {
    pos: 'ɯ', name: 'close back unrounded',
    short: { id: 'ue', ipa: 'ɯ', thai: 'อึ', ex: { thai: 'ขึ้น', rom: 'khɯ̂n', en: 'go up' } },
    long: { id: 'uue', ipa: 'ɯː', thai: 'อือ', ex: { thai: 'มือ', rom: 'mɯɯ', en: 'hand' } },
  },
  {
    pos: 'u', name: 'close back rounded',
    short: { id: 'u', ipa: 'u', thai: 'อุ', ex: { thai: 'คุณ', rom: 'khun', en: 'you' } },
    long: { id: 'uu', ipa: 'uː', thai: 'อู', ex: { thai: 'ดู', rom: 'duu', en: 'look' } },
  },
  {
    pos: 'e', name: 'close-mid front unrounded',
    short: { id: 'e', ipa: 'e', thai: 'เอะ', ex: { thai: 'เตะ', rom: 'tè', en: 'kick' } },
    long: { id: 'ee', ipa: 'eː', thai: 'เอ', ex: { thai: 'เพลง', rom: 'phleeŋ', en: 'song' } },
  },
  {
    pos: 'ɤ', name: 'close-mid back unrounded',
    short: { id: 'oe', ipa: 'ɤ', thai: 'เออะ', ex: { thai: 'เงิน', rom: 'ŋɤn', en: 'money' } },
    long: { id: 'ooe', ipa: 'ɤː', thai: 'เออ', ex: { thai: 'เจอ', rom: 'cɤɤ', en: 'meet' } },
  },
  {
    pos: 'o', name: 'close-mid back rounded',
    short: { id: 'o', ipa: 'o', thai: 'โอะ', ex: { thai: 'คน', rom: 'khon', en: 'person' } },
    long: { id: 'oo', ipa: 'oː', thai: 'โอ', ex: { thai: 'โต', rom: 'too', en: 'big' } },
  },
  {
    pos: 'ɛ', name: 'open-mid front unrounded',
    short: { id: 'ae', ipa: 'ɛ', thai: 'แอะ', ex: { thai: 'แกะ', rom: 'kɛ̀', en: 'sheep' } },
    long: { id: 'aae', ipa: 'ɛː', thai: 'แอ', ex: { thai: 'แม่', rom: 'mɛ̂ɛ', en: 'mother' } },
  },
  {
    pos: 'ɔ', name: 'open-mid back rounded',
    short: { id: 'aw', ipa: 'ɔ', thai: 'เอาะ', ex: { thai: 'เกาะ', rom: 'kɔ̀', en: 'island' } },
    long: { id: 'aaw', ipa: 'ɔː', thai: 'ออ', ex: { thai: 'ต่อ', rom: 'tɔ̀ɔ', en: 'continue' } },
  },
  {
    pos: 'a', name: 'open central unrounded',
    short: { id: 'a', ipa: 'a', thai: 'อะ', ex: { thai: 'จะ', rom: 'cà', en: 'will' } },
    long: { id: 'aa', ipa: 'aː', thai: 'อา', ex: { thai: 'มา', rom: 'maa', en: 'come' } },
  },
];

const DIPHTHONGS = [
  {
    name: 'i → a',
    short: { id: 'ia', ipa: 'iʔa', thai: 'เอียะ', ex: null },
    long: { id: 'iia', ipa: 'iːa', thai: 'เอีย', ex: { thai: 'เสีย', rom: 'sǐa', en: 'broken' } },
  },
  {
    name: 'ɯ → a',
    short: { id: 'uea', ipa: 'ɯʔa', thai: 'เอือะ', ex: null },
    long: { id: 'uuea', ipa: 'ɯːa', thai: 'เอือ', ex: { thai: 'เรือ', rom: 'rɯa', en: 'boat' } },
  },
  {
    name: 'u → a',
    short: { id: 'ua', ipa: 'uʔa', thai: 'อัวะ', ex: null },
    long: { id: 'uua', ipa: 'uːa', thai: 'อัว', ex: { thai: 'ตัว', rom: 'tua', en: 'body' } },
  },
];

// Vowel signs that include a final consonant sound, plus the ฤ letters.
const SPECIALS = [
  { id: 'am', ipa: 'am', thai: 'อำ', note: 'a + m', ex: { thai: 'ทำ', rom: 'tham', en: 'do' } },
  { id: 'ao', ipa: 'aw', thai: 'เอา', note: 'a + w', ex: { thai: 'เอา', rom: 'aw', en: 'take' } },
  { id: 'ai1', ipa: 'aj', thai: 'ใอ', note: 'a + j (mái múan)', ex: { thai: 'ให้', rom: 'hâj', en: 'give' } },
  { id: 'ai2', ipa: 'aj', thai: 'ไอ', note: 'a + j (mái malai)', ex: { thai: 'ไป', rom: 'paj', en: 'go' } },
  { id: 'rue', ipa: 'rɯ', thai: 'ฤ', note: 'vowel letter', ex: { thai: 'ฤดู', rom: 'rɯ́duu', en: 'season' } },
  { id: 'ruue', ipa: 'rɯː', thai: 'ฤๅ', note: 'vowel letter', ex: null },
];

// Thai consonants by class. `say` is the letter's name as spoken (audio/<id>.mp3).
// `initial` / `final` are IPA; final null = the letter can't end a syllable.
// Keep each entry on one line: tools/generate_audio.py reads this file line by line.

const CONSONANT_CLASSES = [
  { key: 'mid', name: 'Middle class', thai: 'อักษรกลาง' },
  { key: 'high', name: 'High class', thai: 'อักษรสูง' },
  { key: 'low', name: 'Low class', thai: 'อักษรต่ำ' },
];

const CONSONANTS = [
  { id: 'c-ko-kai', thai: 'ก', say: 'กอ ไก่', cls: 'mid', initial: 'k', final: 'k̚', rom: 'kɔɔ kày', en: 'chicken' },
  { id: 'c-jo-jan', thai: 'จ', say: 'จอ จาน', cls: 'mid', initial: 'tɕ', final: 't̚', rom: 'tɕɔɔ tɕaan', en: 'plate' },
  { id: 'c-do-chada', thai: 'ฎ', say: 'ดอ ชฎา', cls: 'mid', initial: 'd', final: 't̚', rom: 'dɔɔ tɕʰá-daa', en: 'headdress' },
  { id: 'c-to-patak', thai: 'ฏ', say: 'ตอ ปฏัก', cls: 'mid', initial: 't', final: 't̚', rom: 'tɔɔ pà-tàk', en: 'goad' },
  { id: 'c-do-dek', thai: 'ด', say: 'ดอ เด็ก', cls: 'mid', initial: 'd', final: 't̚', rom: 'dɔɔ dèk', en: 'child' },
  { id: 'c-to-tao', thai: 'ต', say: 'ตอ เต่า', cls: 'mid', initial: 't', final: 't̚', rom: 'tɔɔ tàw', en: 'turtle' },
  { id: 'c-bo-baimai', thai: 'บ', say: 'บอ ใบไม้', cls: 'mid', initial: 'b', final: 'p̚', rom: 'bɔɔ baj-máaj', en: 'leaf' },
  { id: 'c-po-pla', thai: 'ป', say: 'ปอ ปลา', cls: 'mid', initial: 'p', final: 'p̚', rom: 'pɔɔ plaa', en: 'fish' },
  { id: 'c-o-ang', thai: 'อ', say: 'ออ อ่าง', cls: 'mid', initial: 'ʔ', final: null, rom: 'ʔɔɔ ʔàaŋ', en: 'basin' },

  { id: 'c-kho-khai', thai: 'ข', say: 'ขอ ไข่', cls: 'high', initial: 'kʰ', final: 'k̚', rom: 'kʰɔ̌ɔ kʰày', en: 'egg' },
  { id: 'c-kho-khuat', thai: 'ฃ', say: 'ขอ ขวด', cls: 'high', initial: 'kʰ', final: 'k̚', rom: 'kʰɔ̌ɔ kʰùat', en: 'bottle', obsolete: true },
  { id: 'c-cho-ching', thai: 'ฉ', say: 'ฉอ ฉิ่ง', cls: 'high', initial: 'tɕʰ', final: null, rom: 'tɕʰɔ̌ɔ tɕʰìŋ', en: 'cymbals' },
  { id: 'c-tho-than', thai: 'ฐ', say: 'ฐอ ฐาน', cls: 'high', initial: 'tʰ', final: 't̚', rom: 'tʰɔ̌ɔ tʰǎan', en: 'pedestal' },
  { id: 'c-tho-thung', thai: 'ถ', say: 'ถอ ถุง', cls: 'high', initial: 'tʰ', final: 't̚', rom: 'tʰɔ̌ɔ tʰǔŋ', en: 'sack' },
  { id: 'c-pho-phueng', thai: 'ผ', say: 'ผอ ผึ้ง', cls: 'high', initial: 'pʰ', final: null, rom: 'pʰɔ̌ɔ pʰɯ̂ŋ', en: 'bee' },
  { id: 'c-fo-fa', thai: 'ฝ', say: 'ฝอ ฝา', cls: 'high', initial: 'f', final: null, rom: 'fɔ̌ɔ fǎa', en: 'lid' },
  { id: 'c-so-sala', thai: 'ศ', say: 'ศอ ศาลา', cls: 'high', initial: 's', final: 't̚', rom: 'sɔ̌ɔ sǎa-laa', en: 'pavilion' },
  { id: 'c-so-ruesi', thai: 'ษ', say: 'ษอ ฤๅษี', cls: 'high', initial: 's', final: 't̚', rom: 'sɔ̌ɔ rɯɯ-sǐi', en: 'hermit' },
  { id: 'c-so-suea', thai: 'ส', say: 'สอ เสือ', cls: 'high', initial: 's', final: 't̚', rom: 'sɔ̌ɔ sɯ̌a', en: 'tiger' },
  { id: 'c-ho-hip', thai: 'ห', say: 'หอ หีบ', cls: 'high', initial: 'h', final: null, rom: 'hɔ̌ɔ hìip', en: 'chest' },

  { id: 'c-kho-khwai', thai: 'ค', say: 'คอ ควาย', cls: 'low', initial: 'kʰ', final: 'k̚', rom: 'kʰɔɔ kʰwaaj', en: 'buffalo' },
  { id: 'c-kho-khon', thai: 'ฅ', say: 'คอ คน', cls: 'low', initial: 'kʰ', final: 'k̚', rom: 'kʰɔɔ kʰon', en: 'person', obsolete: true },
  { id: 'c-kho-rakhang', thai: 'ฆ', say: 'ฆอ ระฆัง', cls: 'low', initial: 'kʰ', final: 'k̚', rom: 'kʰɔɔ rá-kʰaŋ', en: 'bell' },
  { id: 'c-ngo-ngu', thai: 'ง', say: 'งอ งู', cls: 'low', initial: 'ŋ', final: 'ŋ', rom: 'ŋɔɔ ŋuu', en: 'snake' },
  { id: 'c-cho-chang', thai: 'ช', say: 'ชอ ช้าง', cls: 'low', initial: 'tɕʰ', final: 't̚', rom: 'tɕʰɔɔ tɕʰáaŋ', en: 'elephant' },
  { id: 'c-so-so', thai: 'ซ', say: 'ซอ โซ่', cls: 'low', initial: 's', final: 't̚', rom: 'sɔɔ sôo', en: 'chain' },
  { id: 'c-cho-choe', thai: 'ฌ', say: 'ฌอ เฌอ', cls: 'low', initial: 'tɕʰ', final: null, rom: 'tɕʰɔɔ tɕʰɤɤ', en: 'tree' },
  { id: 'c-yo-ying', thai: 'ญ', say: 'ญอ หญิง', cls: 'low', initial: 'j', final: 'n', rom: 'jɔɔ jǐŋ', en: 'woman' },
  { id: 'c-tho-montho', thai: 'ฑ', say: 'ฑอ มณโฑ', cls: 'low', initial: 'tʰ', final: 't̚', rom: 'tʰɔɔ mon-tʰoo', en: 'Montho (a queen)' },
  { id: 'c-tho-phuthao', thai: 'ฒ', say: 'ฒอ ผู้เฒ่า', cls: 'low', initial: 'tʰ', final: 't̚', rom: 'tʰɔɔ pʰûu-tʰâw', en: 'elder' },
  { id: 'c-no-nen', thai: 'ณ', say: 'ณอ เณร', cls: 'low', initial: 'n', final: 'n', rom: 'nɔɔ neen', en: 'novice monk' },
  { id: 'c-tho-thahan', thai: 'ท', say: 'ทอ ทหาร', cls: 'low', initial: 'tʰ', final: 't̚', rom: 'tʰɔɔ tʰá-hǎan', en: 'soldier' },
  { id: 'c-tho-thong', thai: 'ธ', say: 'ธอ ธง', cls: 'low', initial: 'tʰ', final: 't̚', rom: 'tʰɔɔ tʰoŋ', en: 'flag' },
  { id: 'c-no-nu', thai: 'น', say: 'นอ หนู', cls: 'low', initial: 'n', final: 'n', rom: 'nɔɔ nǔu', en: 'mouse' },
  { id: 'c-pho-phan', thai: 'พ', say: 'พอ พาน', cls: 'low', initial: 'pʰ', final: 'p̚', rom: 'pʰɔɔ pʰaan', en: 'tray' },
  { id: 'c-fo-fan', thai: 'ฟ', say: 'ฟอ ฟัน', cls: 'low', initial: 'f', final: 'p̚', rom: 'fɔɔ fan', en: 'tooth' },
  { id: 'c-pho-samphao', thai: 'ภ', say: 'ภอ สำเภา', cls: 'low', initial: 'pʰ', final: 'p̚', rom: 'pʰɔɔ sǎm-pʰaw', en: 'junk (ship)' },
  { id: 'c-mo-ma', thai: 'ม', say: 'มอ ม้า', cls: 'low', initial: 'm', final: 'm', rom: 'mɔɔ máa', en: 'horse' },
  { id: 'c-yo-yak', thai: 'ย', say: 'ยอ ยักษ์', cls: 'low', initial: 'j', final: 'j', rom: 'jɔɔ ják', en: 'giant' },
  { id: 'c-ro-ruea', thai: 'ร', say: 'รอ เรือ', cls: 'low', initial: 'r', final: 'n', rom: 'rɔɔ rɯa', en: 'boat' },
  { id: 'c-lo-ling', thai: 'ล', say: 'ลอ ลิง', cls: 'low', initial: 'l', final: 'n', rom: 'lɔɔ liŋ', en: 'monkey' },
  { id: 'c-wo-waen', thai: 'ว', say: 'วอ แหวน', cls: 'low', initial: 'w', final: 'w', rom: 'wɔɔ wɛ̌ɛn', en: 'ring' },
  { id: 'c-lo-chula', thai: 'ฬ', say: 'ฬอ จุฬา', cls: 'low', initial: 'l', final: 'n', rom: 'lɔɔ tɕù-laa', en: 'kite' },
  { id: 'c-ho-nokhuk', thai: 'ฮ', say: 'ฮอ นกฮูก', cls: 'low', initial: 'h', final: null, rom: 'hɔɔ nók-hûuk', en: 'owl' },
];

// Tone rules table (rows = class, columns = syllable type / tone mark).
const TONES = {
  mid: { name: 'mid', letters: '˧' },
  low: { name: 'low', letters: '˨˩' },
  falling: { name: 'falling', letters: '˥˩' },
  high: { name: 'high', letters: '˦˥' },
  rising: { name: 'rising', letters: '˩˩˦' },
};

const TONE_COLUMNS = [
  { key: 'lo', group: 'Long vowel', label: 'No final', rule: 'long vowel, no final' },
  { key: 'ls', group: 'Long vowel', label: 'Non-stop final', sub: 'ง น ม ย ว', rule: 'long vowel + non-stop final' },
  { key: 'lt', group: 'Long vowel', label: 'Stop final', sub: 'ก ด บ', rule: 'long vowel + stop final' },
  { key: 'so', group: 'Short vowel', label: 'No final', rule: 'short vowel, no final' },
  { key: 'ss', group: 'Short vowel', label: 'Non-stop final', sub: 'ง น ม ย ว', rule: 'short vowel + non-stop final' },
  { key: 'st', group: 'Short vowel', label: 'Stop final', sub: 'ก ด บ', rule: 'short vowel + stop final' },
  { key: 'm1', group: 'Tone marks', label: '◌่', sub: 'mái èek', rule: 'mái èek ( ่ )' },
  { key: 'm2', group: 'Tone marks', label: '◌้', sub: 'mái thoo', rule: 'mái thoo ( ้ )' },
  { key: 'm3', group: 'Tone marks', label: '◌๊', sub: 'mái trii', rule: 'mái trii ( ๊ )' },
  { key: 'm4', group: 'Tone marks', label: '◌๋', sub: 'mái jàttawaa', rule: 'mái jàttawaa ( ๋ )' },
];

// cls -> column key -> example syllable. Missing cells = combination doesn't occur.
const TONE_TABLE = {
  mid: {
    lo: { id: 't-mid-lo', thai: 'กา', tone: 'mid', ipa: 'kaː' },
    ls: { id: 't-mid-ls', thai: 'กาง', tone: 'mid', ipa: 'kaːŋ' },
    lt: { id: 't-mid-lt', thai: 'กาก', tone: 'low', ipa: 'kaːk̚' },
    so: { id: 't-mid-so', thai: 'กะ', tone: 'low', ipa: 'kaʔ' },
    ss: { id: 't-mid-ss', thai: 'กัง', tone: 'mid', ipa: 'kaŋ' },
    st: { id: 't-mid-st', thai: 'กัก', tone: 'low', ipa: 'kak̚' },
    m1: { id: 't-mid-m1', thai: 'ก่า', tone: 'low', ipa: 'kaː' },
    m2: { id: 't-mid-m2', thai: 'ก้า', tone: 'falling', ipa: 'kaː' },
    m3: { id: 't-mid-m3', thai: 'ก๊า', tone: 'high', ipa: 'kaː' },
    m4: { id: 't-mid-m4', thai: 'ก๋า', tone: 'rising', ipa: 'kaː' },
  },
  high: {
    lo: { id: 't-high-lo', thai: 'ขา', tone: 'rising', ipa: 'kʰaː' },
    ls: { id: 't-high-ls', thai: 'ขาง', tone: 'rising', ipa: 'kʰaːŋ' },
    lt: { id: 't-high-lt', thai: 'ขาก', tone: 'low', ipa: 'kʰaːk̚' },
    so: { id: 't-high-so', thai: 'ขะ', tone: 'low', ipa: 'kʰaʔ' },
    ss: { id: 't-high-ss', thai: 'ขัง', tone: 'rising', ipa: 'kʰaŋ' },
    st: { id: 't-high-st', thai: 'ขัก', tone: 'low', ipa: 'kʰak̚' },
    m1: { id: 't-high-m1', thai: 'ข่า', tone: 'low', ipa: 'kʰaː' },
    m2: { id: 't-high-m2', thai: 'ข้า', tone: 'falling', ipa: 'kʰaː' },
  },
  low: {
    lo: { id: 't-low-lo', thai: 'คา', tone: 'mid', ipa: 'kʰaː' },
    ls: { id: 't-low-ls', thai: 'คาง', tone: 'mid', ipa: 'kʰaːŋ' },
    lt: { id: 't-low-lt', thai: 'คาก', tone: 'falling', ipa: 'kʰaːk̚' },
    so: { id: 't-low-so', thai: 'คะ', tone: 'high', ipa: 'kʰaʔ' },
    ss: { id: 't-low-ss', thai: 'คัง', tone: 'mid', ipa: 'kʰaŋ' },
    st: { id: 't-low-st', thai: 'คัก', tone: 'high', ipa: 'kʰak̚' },
    m1: { id: 't-low-m1', thai: 'ค่า', tone: 'falling', ipa: 'kʰaː' },
    m2: { id: 't-low-m2', thai: 'ค้า', tone: 'high', ipa: 'kʰaː' },
  },
};

// Consonant compass (Stuart Jay Raj, crackinglanguage.com/compass): rows are where in the mouth
// the sound is made, columns the type of sound. Cells list letters by their Thai character.
const COMPASS_PLACES = {
  deep: 'Deep throat', guttural: 'Guttural', palatal: 'Palatal',
  cerebral: 'Cerebral', dental: 'Dental', labial: 'Labial',
};

const COMPASS = [
  {
    columns: ['Stopped', 'Aspirated', 'Voiced', 'Voiced aspirated', 'Nasal'],
    rows: [
      { place: 'guttural', cells: ['ก', 'ข ฃ', 'ค ฅ', 'ฆ', 'ง'] },
      { place: 'palatal', cells: ['จ', 'ฉ', 'ช ซ', 'ฌ', 'ญ'] },
      { place: 'cerebral', cells: ['ฎ ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ'] },
      { place: 'dental', cells: ['ด ต', 'ถ', 'ท', 'ธ', 'น'] },
      { place: 'labial', cells: ['บ ป', 'ผ ฝ', 'พ ฟ', 'ภ', 'ม'] },
    ],
  },
  {
    columns: ['Semivowel', 'Sibilant', 'H-aspirate', 'Throat base', 'Others'],
    rows: [
      { place: 'deep', cells: ['', '', 'ห', 'อ', ''] },
      { place: 'palatal', cells: ['ย', 'ศ', '', '', ''] },
      { place: 'cerebral', cells: ['ร ฮ', 'ษ', '', '', 'ฬ'] },
      { place: 'dental', cells: ['ล', 'ส', '', '', ''] },
      { place: 'labial', cells: ['ว', '', '', '', ''] },
    ],
  },
];

// A picture of each letter's keyword (emoji, so there's nothing to license or download) and a
// memory aid linking the letter's shape to it. The aids are starting points: the page lets you
// rewrite any of them, and keeps your version on this device.
const LETTER_ART = {
  'ก': { pic: '🐔', shape: 'A chicken bending its neck down to peck: the hooked top is its head.' },
  'จ': { pic: '🍽️', shape: 'A plate tilted towards you, with the little loop as the food in the middle.' },
  'ฎ': { pic: '👑', shape: 'Like ฏ but with a curl under its foot, the tassel hanging from a dancer\'s headdress.' },
  'ฏ': { pic: '🔱', shape: 'The zigzag tail under the letter is the sharp point of the elephant goad.' },
  'ด': { pic: '🧒', shape: 'A child turning their head, with the curl inside the top as a lock of hair.' },
  'ต': { pic: '🐢', shape: 'ด with a notch on top: the bump of a turtle\'s shell.' },
  'บ': { pic: '🍃', shape: 'A leaf with the loop at its base and the tall stroke as its stem.' },
  'ป': { pic: '🐟', shape: 'บ with a stroke sticking up high: a fish\'s tail flicking out of the water.' },
  'อ': { pic: '🛁', shape: 'A round basin with a little curl for the lip of the tap.' },

  'ข': { pic: '🥚', shape: 'The loop at the top left is an egg sitting in the dip of a nest.' },
  'ฃ': { pic: '🍾', shape: 'ข with a nick in its top, like the narrow neck of a bottle.' },
  'ฉ': { pic: '🥁', shape: 'จ with an extra loop on its tail: two little cymbals clashing.' },
  'ฐ': { pic: '🏛️', shape: 'The curl underneath is the base the letter stands on, like a pedestal.' },
  'ถ': { pic: '🛍️', shape: 'A sack with its opening tied off in the loop at the bottom.' },
  'ผ': { pic: '🐝', shape: 'Two humps like a bee\'s wings, with the loop as its body.' },
  'ฝ': { pic: '🫙', shape: 'ผ with a tall stroke on the right: the handle on top of a lid.' },
  'ศ': { pic: '🛖', shape: 'A pavilion with a curled spire rising from its roof.' },
  'ษ': { pic: '🧙', shape: 'A hermit sitting cross-legged, with the stroke inside as his staff.' },
  'ส': { pic: '🐯', shape: 'A tiger\'s tail curling up over its back.' },
  'ห': { pic: '🧰', shape: 'Two rounded lids side by side, like the top of a chest.' },

  'ค': { pic: '🐃', shape: 'A buffalo\'s head with the loop as its eye and the curved top as its horn.' },
  'ฅ': { pic: '🧍', shape: 'ค with a notch on top, like a person with their hand raised.' },
  'ฆ': { pic: '🔔', shape: 'A bell swinging, its wavy rim ringing at the bottom.' },
  'ง': { pic: '🐍', shape: 'A snake coiled up with its head raised and curving back.' },
  'ช': { pic: '🐘', shape: 'ข with a raised tail on the right: the elephant lifting its trunk.' },
  'ซ': { pic: '⛓️', shape: 'ช with a notch in its head, like one link of a chain.' },
  'ฌ': { pic: '🌳', shape: 'The widest, most branched letter: a tree spreading out its roots.' },
  'ญ': { pic: '👩', shape: 'A woman with the flowing hem of her skirt drawn underneath.' },
  'ฑ': { pic: '👸', shape: 'The wavy top is the crown worn by Queen Montho.' },
  'ฒ': { pic: '👴', shape: 'An elder bent over, with the loop on top as his head.' },
  'ณ': { pic: '🧘', shape: 'A seated novice monk, his robe trailing in the loop beside him.' },
  'ท': { pic: '💂', shape: 'A soldier standing to attention, the loop as his helmet.' },
  'ธ': { pic: '🚩', shape: 'A flag on its pole, the curl on top flapping in the wind.' },
  'น': { pic: '🐭', shape: 'A mouse with its tail curling up at the end.' },
  'พ': { pic: '🏆', shape: 'The three points along the top are the rim of an offering tray.' },
  'ฟ': { pic: '🦷', shape: 'พ with a tall stroke on the right: one long tooth.' },
  'ภ': { pic: '⛵', shape: 'The tall curved sail of a junk ship catching the wind.' },
  'ม': { pic: '🐴', shape: 'A horse\'s head turned to look back, the loop as its eye.' },
  'ย': { pic: '👹', shape: 'A giant with a big round belly and a curl for a club.' },
  'ร': { pic: '🛶', shape: 'A boat with a curled prow at the front.' },
  'ล': { pic: '🐒', shape: 'A monkey hanging by its tail, which curls up at the top.' },
  'ว': { pic: '💍', shape: 'A ring, its band curving round to the setting at the top.' },
  'ฬ': { pic: '🪁', shape: 'A kite with its long tail swirling below.' },
  'ฮ': { pic: '🦉', shape: 'อ with a swirl on its head: an owl turning to look at you.' },
};

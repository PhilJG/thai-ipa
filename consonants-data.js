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

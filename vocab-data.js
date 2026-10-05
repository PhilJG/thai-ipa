// Vocabulary and sentences from the Thai Practice Workbook.
// Keep each entry on one line: tools/generate_audio.py reads this file line by line.
//
// Words: `en` lists accepted English answers, the first is shown as the meaning.
// `hint` disambiguates the English prompt when two Thai words share a meaning.
const VOCAB = [
  { id: 'v-chop', thai: 'ชอบ', rom: 'chôrp', en: ['like', 'to like'] },
  { id: 'v-kin', thai: 'กิน', rom: 'gin', en: ['eat', 'to eat'] },
  { id: 'v-duem', thai: 'ดื่ม', rom: 'dùum', en: ['drink', 'to drink'] },
  { id: 'v-arai', thai: 'อะไร', rom: 'à-rai', en: ['what'] },
  { id: 'v-somtam', thai: 'ส้มตำ', rom: 'sôm tam', en: ['papaya salad', 'som tam', 'somtam', 'green papaya salad'] },
  { id: 'v-cha', thai: 'ชา', rom: 'chaa', en: ['tea'] },
  { id: 'v-kafae', thai: 'กาแฟ', rom: 'gaa-fae', en: ['coffee'] },
  { id: 'v-khao', thai: 'ข้าว', rom: 'khâao', en: ['rice', 'food', 'meal', 'cooked rice'] },
  { id: 'v-phet', thai: 'เผ็ด', rom: 'phèt', en: ['spicy', 'hot'] },
  { id: 'v-pai', thai: 'ไป', rom: 'bpai', en: ['go', 'to go'] },
  { id: 'v-ma', thai: 'มา', rom: 'maa', en: ['come', 'to come'] },
  { id: 'v-nai', thai: 'ไหน', rom: 'nǎi', en: ['where', 'which'], hint: 'not the question particle' },
  { id: 'v-rankafae', thai: 'ร้านกาแฟ', rom: 'ráan gaa-fae', en: ['coffee shop', 'cafe', 'café', 'coffee house'] },
  { id: 'v-supermarket', thai: 'ซูเปอร์มาร์เก็ต', rom: 'suu-bpəə-maa-gèt', en: ['supermarket'] },
  { id: 'v-talat', thai: 'ตลาด', rom: 'dtà-làat', en: ['market'] },
  { id: 'v-ban', thai: 'บ้าน', rom: 'bâan', en: ['house', 'home'] },
  { id: 'v-rongrian', thai: 'โรงเรียน', rom: 'roong-rian', en: ['school'] },
  { id: 'v-thamngan', thai: 'ทำงาน', rom: 'tham-ngaan', en: ['work', 'to work'] },
  { id: 'v-pen', thai: 'เป็น', rom: 'bpen', en: ['to be', 'be', 'am', 'is', 'are', 'am is are'] },
  { id: 'v-khon', thai: 'คน', rom: 'khon', en: ['person', 'people'] },
  { id: 'v-canada', thai: 'แคนาดา', rom: 'khae-naa-daa', en: ['Canada'] },
  { id: 'v-thailand', thai: 'ประเทศไทย', rom: 'bprà-thêet thai', en: ['Thailand'] },
  { id: 'v-khoei', thai: 'เคย', rom: 'kəəi', en: ['ever', 'used to', 'have ever', 'have been', 'ever done'], hint: 'past experience' },
  { id: 'v-ja', thai: 'จะ', rom: 'jà', en: ['will', 'going to', 'shall', 'future'] },
  { id: 'v-yang', thai: 'ยัง', rom: 'yang', en: ['yet', 'still', 'not yet'] },
  { id: 'v-laeo', thai: 'แล้ว', rom: 'láew', en: ['already'] },
  { id: 'v-maidai', thai: 'ไม่ได้', rom: 'mâi dâai', en: ['did not', 'didnt', 'have not', 'havent', 'not', 'cannot', 'cant'], hint: 'past negative' },
  { id: 'v-mai-neg', thai: 'ไม่', rom: 'mâi', en: ['not', 'no', 'dont', 'do not'], hint: 'plain negative' },
  { id: 'v-mai-q', thai: 'ไหม', rom: 'mǎi', en: ['question particle', 'question', 'yes no question', 'question word', '?'], hint: 'yes/no question particle' },
  { id: 'v-khao-pron', thai: 'เขา', rom: 'khǎo', en: ['he', 'she', 'they', 'him', 'her', 'them', 'he she', 'he she they'] },
  { id: 'v-rao', thai: 'เรา', rom: 'rao', en: ['we', 'us'] },
  { id: 'v-chan', thai: 'ฉัน', rom: 'chǎn', en: ['I', 'me'] },
  { id: 'v-khun', thai: 'คุณ', rom: 'khun', en: ['you'] },
  { id: 'v-mani', thai: 'มานี่', rom: 'maa nîi', en: ['come here'] },
  { id: 'v-khopkhun', thai: 'ขอบคุณ', rom: 'khàawp-khun', en: ['thank you', 'thanks'] },
  { id: 'v-mak', thai: 'มาก', rom: 'mâak', en: ['very', 'a lot', 'much', 'very much', 'lots', 'many'] },
  { id: 'v-maipenrai', thai: 'ไม่เป็นไร', rom: 'mâi bpen rai', en: ['never mind', 'no problem', 'youre welcome', 'no worries', 'its ok', 'its okay', 'thats ok', 'thats okay', 'it is ok'] },
  { id: 'v-khrap', thai: 'ครับ', rom: 'khráp', en: ['polite particle', 'polite', 'male polite particle', 'politeness particle', 'polite word'], hint: 'used by men' },
  { id: 'v-tae', thai: 'แต่', rom: 'dtàae', en: ['but'] },
];

// Words that appear inside sentences but aren't vocabulary cards.
const EXTRA_GLOSS = {
  'หรือ': { rom: 'rʉ̌ʉ', en: 'or (หรือยัง = "…yet?")' },
  'นี่': { rom: 'nîi', en: 'here / this' },
};

// Sentences: `words` splits the Thai into vocabulary chunks (word bank + gloss hints).
// `en` = accepted English (first is the model answer); `key` = every group must appear
// for a looser answer to count; `avoid` = words that mean it was misread (ไหม ≠ ไหน);
// `thAlt` = other acceptable Thai.
const SENTENCES = [
  { id: 's-01', thai: 'คุณชอบกินอะไร', rom: 'khun chôrp gin à-rai', words: ['คุณ', 'ชอบ', 'กิน', 'อะไร'], en: ['What do you like to eat?', 'What do you like eating?'], key: [['what'], ['like'], ['eat', 'eating']] },
  { id: 's-02', thai: 'ฉันชอบกินส้มตำ', rom: 'chǎn chôrp gin sôm tam', words: ['ฉัน', 'ชอบ', 'กิน', 'ส้มตำ'], en: ['I like to eat papaya salad.', 'I like eating papaya salad.', 'I like to eat som tam.', 'I like eating som tam.'], key: [['i'], ['like'], ['papaya salad', 'som tam', 'somtam']] },
  { id: 's-03', thai: 'คุณไปไหนมา', rom: 'khun bpai nǎi maa', words: ['คุณ', 'ไป', 'ไหน', 'มา'], en: ['Where have you been?', 'Where did you go?'], key: [['where'], ['been', 'go', 'went']] },
  { id: 's-04', thai: 'ฉันไปร้านกาแฟมา', rom: 'chǎn bpai ráan gaa-fae maa', words: ['ฉัน', 'ไป', 'ร้านกาแฟ', 'มา'], en: ['I went to the coffee shop.', 'I have been to the coffee shop.', 'I went to the cafe.', 'I have been to the cafe.'], key: [['i'], ['went', 'been', 'go'], ['coffee shop', 'cafe', 'café', 'coffee']] },
  { id: 's-05', thai: 'คุณเป็นคนอะไร', rom: 'khun bpen khon à-rai', words: ['คุณ', 'เป็น', 'คน', 'อะไร'], en: ['What nationality are you?', 'Where are you from?'], key: [['nationality', 'where are you from', 'where you from']] },
  { id: 's-06', thai: 'ฉันเป็นคนแคนาดา', rom: 'chǎn bpen khon khae-naa-daa', words: ['ฉัน', 'เป็น', 'คน', 'แคนาดา'], en: ['I am Canadian.', 'I am a Canadian.', 'I am from Canada.'], key: [['i'], ['canadian', 'canada']] },
  { id: 's-07', thai: 'คุณกินข้าวหรือยัง', rom: 'khun gin khâao rʉ̌ʉ yang', words: ['คุณ', 'กิน', 'ข้าว', 'หรือ', 'ยัง'], en: ['Have you eaten yet?', 'Have you eaten?', 'Did you eat yet?'], key: [['you'], ['eat', 'eaten', 'ate'], ['yet', 'have', 'did']] },
  { id: 's-08', thai: 'ฉันกินข้าวแล้ว', rom: 'chǎn gin khâao láew', words: ['ฉัน', 'กิน', 'ข้าว', 'แล้ว'], en: ['I have already eaten.', 'I already ate.', 'I ate already.', 'I have eaten.'], key: [['i'], ['eaten', 'ate', 'eat'], ['already', 'have eaten']] },
  { id: 's-09', thai: 'คุณเคยไปประเทศไทยไหม', rom: 'khun kəəi bpai bprà-thêet thai mǎi', words: ['คุณ', 'เคย', 'ไป', 'ประเทศไทย', 'ไหม'], en: ['Have you ever been to Thailand?', 'Have you been to Thailand?'], key: [['you'], ['been', 'gone', 'go', 'went'], ['thailand']], avoid: ['which', 'where'] },
  { id: 's-10', thai: 'ฉันเคยไป', rom: 'chǎn kəəi bpai', words: ['ฉัน', 'เคย', 'ไป'], en: ['I have been.', 'I have been before.', 'I have been there.', 'I have gone before.'], key: [['i'], ['have been', 'have gone', 'been before', 'went before', 'been there']] },
  { id: 's-11', thai: 'คุณจะไปทำงานไหม', rom: 'khun jà bpai tham-ngaan mǎi', words: ['คุณ', 'จะ', 'ไป', 'ทำงาน', 'ไหม'], en: ['Are you going to work?', 'Will you go to work?'], key: [['you'], ['going', 'will'], ['work']], avoid: ['which', 'where'] },
  { id: 's-12', thai: 'ฉันจะไปทำงาน', rom: 'chǎn jà bpai tham-ngaan', words: ['ฉัน', 'จะ', 'ไป', 'ทำงาน'], en: ['I will go to work.', 'I am going to work.', 'I am going to go to work.'], key: [['i'], ['will', 'going'], ['work']] },
  { id: 's-13', thai: 'เขาไม่ชอบกินเผ็ด', rom: 'khǎo mâi chôrp gin phèt', words: ['เขา', 'ไม่', 'ชอบ', 'กิน', 'เผ็ด'], en: ['He does not like spicy food.', 'He does not like eating spicy food.', 'She does not like spicy food.', 'They do not like spicy food.'], key: [['he', 'she', 'they'], ['not'], ['like'], ['spicy', 'hot']] },
  { id: 's-14', thai: 'แต่ฉันชอบกินเผ็ด', rom: 'dtàae chǎn chôrp gin phèt', words: ['แต่', 'ฉัน', 'ชอบ', 'กิน', 'เผ็ด'], en: ['But I like spicy food.', 'But I like eating spicy food.', 'But I like to eat spicy food.'], key: [['but'], ['i'], ['like'], ['spicy', 'hot']] },
  { id: 's-15', thai: 'มานี่', rom: 'maa nîi', words: ['มา', 'นี่'], en: ['Come here.'], key: [['come here']] },
  { id: 's-16', thai: 'ขอบคุณมากครับ', rom: 'khàawp-khun mâak khráp', words: ['ขอบคุณ', 'มาก', 'ครับ'], en: ['Thank you very much.', 'Thanks a lot.', 'Thank you so much.'], key: [['thank', 'thanks'], ['very much', 'a lot', 'so much', 'much']] },
  { id: 's-17', thai: 'ไม่เป็นไรครับ', rom: 'mâi bpen rai khráp', words: ['ไม่เป็นไร', 'ครับ'], en: ["You're welcome.", 'No problem.', 'Never mind.', 'No worries.'], key: [['welcome', 'no problem', 'never mind', 'no worries', 'okay', 'ok', 'all right', 'alright']] },
  { id: 's-18', thai: 'คุณชอบดื่มอะไร', rom: 'khun chôrp dùum à-rai', words: ['คุณ', 'ชอบ', 'ดื่ม', 'อะไร'], en: ['What do you like to drink?', 'What do you like drinking?'], key: [['what'], ['like'], ['drink', 'drinking']] },
  { id: 's-19', thai: 'ฉันชอบดื่มชา', rom: 'chǎn chôrp dùum chaa', words: ['ฉัน', 'ชอบ', 'ดื่ม', 'ชา'], en: ['I like to drink tea.', 'I like drinking tea.', 'I like tea.'], key: [['i'], ['like'], ['tea']], thAlt: ['ฉันชอบชา'] },
  { id: 's-20', thai: 'คุณไปซูเปอร์มาร์เก็ตไหม', rom: 'khun bpai suu-bpəə-maa-gèt mǎi', words: ['คุณ', 'ไป', 'ซูเปอร์มาร์เก็ต', 'ไหม'], en: ['Are you going to the supermarket?', 'Will you go to the supermarket?', 'Do you go to the supermarket?'], key: [['you'], ['go', 'going'], ['supermarket']], avoid: ['which', 'where'], thAlt: ['คุณจะไปซูเปอร์มาร์เก็ตไหม'] },
  { id: 's-21', thai: 'ฉันยังไม่ได้ไป', rom: 'chǎn yang mâi dâai bpai', words: ['ฉัน', 'ยัง', 'ไม่ได้', 'ไป'], en: ["I haven't gone yet.", "I haven't been yet.", "I didn't go yet.", 'Not yet.'], key: [['not'], ['yet']] },
  { id: 's-22', thai: 'คุณเคยไปแคนาดาไหม', rom: 'khun kəəi bpai khae-naa-daa mǎi', words: ['คุณ', 'เคย', 'ไป', 'แคนาดา', 'ไหม'], en: ['Have you ever been to Canada?', 'Have you been to Canada?'], key: [['you'], ['been', 'gone', 'go', 'went'], ['canada']], avoid: ['which', 'where'] },
  { id: 's-23', thai: 'เขาไม่ชอบกาแฟ', rom: 'khǎo mâi chôrp gaa-fae', words: ['เขา', 'ไม่', 'ชอบ', 'กาแฟ'], en: ["He doesn't like coffee.", "She doesn't like coffee.", "They don't like coffee."], key: [['he', 'she', 'they'], ['not'], ['like'], ['coffee']] },
  { id: 's-24', thai: 'เขาชอบกาแฟไหม', rom: 'khǎo chôrp gaa-fae mǎi', words: ['เขา', 'ชอบ', 'กาแฟ', 'ไหม'], en: ['Does he like coffee?', 'Does she like coffee?', 'Do they like coffee?'], key: [['does', 'do'], ['he', 'she', 'they'], ['like'], ['coffee']], avoid: ['which', 'where'] },
];

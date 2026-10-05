(() => {
  const { playBtn, esc, shuffle } = Quiz;

  const vocabByThai = new Map(VOCAB.map((v) => [v.thai, { rom: v.rom, en: v.en[0] }]));
  const gloss = (word) => vocabByThai.get(word) || EXTRA_GLOSS[word] || { rom: '', en: '?' };

  function glossHtml(item) {
    return `<div class="gloss">${item.words.map((w) => {
      const g = gloss(w);
      return `<span class="gloss-chunk"><span class="gloss-thai" lang="th">${w}</span>
        <span class="gloss-rom">${g.rom}</span><span class="gloss-en">${esc(g.en)}</span></span>`;
    }).join('')}</div>`;
  }

  Quiz.boot({
    kind: 's',
    noun: 'sentence',
    items: SENTENCES,
    defaultNew: 4,

    prompt(item, dir) {
      if (dir === 'te') return `<div class="prompt-thai prompt-sentence" lang="th">${item.thai}</div>${playBtn}`;
      return `<div class="prompt-en">${esc(item.en[0])}</div>`;
    },

    answer(item) {
      const others = item.en.slice(1, 3).map(esc).join(' · ');
      return `<div class="ans"><span class="ans-thai ans-sentence" lang="th">${item.thai}</span>${playBtn}
        <span class="ans-rom">${item.rom}</span>
        <span class="ans-en">${esc(item.en[0])}${others ? `<span class="ans-alt">also: ${others}</span>` : ''}</span></div>
        ${glossHtml(item)}`;
    },

    check(input, item, dir) {
      return dir === 'et' ? Check.thai(input, item) : Check.englishSentence(input, item);
    },

    hints(item, dir, ctx) {
      const pron = { label: 'Pronunciation', run: (out) => { out.innerHTML = `<span class="hint-rom">${item.rom}</span>`; } };
      if (dir === 'te') {
        return [
          { label: '🔊 Listen', free: true, run: () => ctx.play() },
          { label: 'Word by word', run: (out) => { out.innerHTML = glossHtml(item); } },
          pron,
        ];
      }
      return [
        {
          label: 'Word bank',
          run(out) {
            // The sentence's own words plus two distractors, like Part 4 of the workbook.
            const distractors = shuffle(VOCAB.filter((v) => !item.words.includes(v.thai))).slice(0, 2).map((v) => v.thai);
            out.innerHTML = '<div class="word-bank"></div>';
            const bank = out.querySelector('.word-bank');
            for (const w of shuffle([...item.words, ...distractors])) {
              bank.append(App.button(`<span lang="th">${w}</span>`, () => ctx.insert(w), 'bank-chip'));
            }
            bank.append(App.button('Clear', () => { ctx.input.value = ''; ctx.input.focus(); }, 'bank-chip bank-clear'));
          },
        },
        pron,
        { label: '🔊 Listen', run: () => ctx.play() },
        { label: 'First word', run: (out) => { out.innerHTML = `<span class="hint-letters" lang="th">${item.words[0]} …</span>`; } },
      ];
    },
  });
})();

(() => {
  const { playBtn, esc } = Quiz;

  // "c _ _ _ _ _" style hint for the first English meaning.
  const firstLetters = (text) => text.split(' ').map((w) => w[0] + ' _'.repeat(w.length - 1)).join('   ');

  Quiz.boot({
    kind: 'w',
    noun: 'word',
    items: VOCAB,
    defaultNew: 8,

    prompt(item, dir) {
      if (dir === 'te') return `<div class="prompt-thai" lang="th">${item.thai}</div>${playBtn}`;
      return `<div class="prompt-en">${esc(item.en[0])}</div>${item.hint ? `<div class="prompt-note">(${esc(item.hint)})</div>` : ''}`;
    },

    answer(item) {
      return `<div class="ans"><span class="ans-thai" lang="th">${item.thai}</span>${playBtn}
        <span class="ans-rom">${item.rom}</span>
        <span class="ans-en">${esc(item.en.slice(0, 3).join(' / '))}</span></div>`;
    },

    check(input, item, dir) {
      return dir === 'et' ? Check.thai(input, item) : Check.englishWord(input, item.en);
    },

    hints(item, dir, ctx) {
      const pron = { label: 'Pronunciation', run: (out) => { out.innerHTML = `<span class="hint-rom">${item.rom}</span>`; } };
      if (dir === 'te') {
        return [
          { label: '🔊 Listen', free: true, run: () => ctx.play() },
          pron,
          { label: 'First letter', run: (out) => { out.innerHTML = `<span class="hint-letters">${esc(firstLetters(item.en[0]))}</span>`; } },
        ];
      }
      return [
        pron,
        { label: '🔊 Listen', run: () => ctx.play() },
        { label: 'First letter', run: (out) => { out.innerHTML = `<span class="hint-letters" lang="th">${[...item.thai][0]} …</span>`; } },
      ];
    },
  });
})();

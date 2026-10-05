// Answer checking for typed answers: Thai script, romanized Thai, and English.
const Check = (() => {
  const THAI_CHAR = /[฀-๿]/;
  const POLITE_END = /(ครับ|คะ|ค่ะ|นะ)+$/;

  function normThai(s) {
    return s.normalize('NFC')
      .replace(/ํา/g, 'ำ')            // ํ + า typed separately = ำ
      .replace(/[\s​-‍﻿.,!?'"“”]/g, '')
      .replace(POLITE_END, '');                       // ครับ/ค่ะ at the end is optional
  }

  // Romanization: drop tone marks and hyphens, fold IPA-ish letters to plain ones, and
  // fold spelling variants of the same sound (gin/kin, bpai/pai, dtà/tà, maa/ma).
  function normRom(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/ə/g, 'e').replace(/ʉ/g, 'ue').replace(/ɔ/g, 'o').replace(/ɛ/g, 'ae')
      .replace(/[^a-z]/g, '')
      .replace(/bp/g, 'p').replace(/dt/g, 't').replace(/g/g, 'k')
      .replace(/([aeiou])\1+/g, '$1');
  }

  const CONTRACTIONS = {
    "won't": 'will not', "can't": 'can not', "cannot": 'can not', "n't": ' not',
    "'re": ' are', "'m": ' am', "'ve": ' have', "'ll": ' will', "'d": ' would', "'s": ' is',
  };
  const NO_APOSTROPHE = {
    dont: 'do not', doesnt: 'does not', didnt: 'did not', havent: 'have not', hasnt: 'has not',
    isnt: 'is not', arent: 'are not', cant: 'can not', wont: 'will not', im: 'i am',
    youre: 'you are', ive: 'i have', its: 'it is', thats: 'that is', whats: 'what is',
  };
  const DROP = new Set(['a', 'an', 'the']);

  function normEn(s) {
    let t = s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’‘]/g, "'");
    for (const [k, v] of Object.entries(CONTRACTIONS)) t = t.split(k).join(v);
    return t.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
      .flatMap((w) => (NO_APOSTROPHE[w] || w).split(' '))
      .filter((w) => !DROP.has(w))
      .join(' ');
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let diag = prev[0];
      prev[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = prev[j];
        prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
        diag = tmp;
      }
    }
    return prev[b.length];
  }

  // How many typos to forgive for a target of this length.
  const tolerance = (len) => (len < 4 ? 0 : len < 9 ? 1 : len < 20 ? 2 : 3);

  function closeEnough(input, target) {
    const d = levenshtein(input, target);
    if (d === 0) return 'exact';
    return d <= tolerance(target.length) ? 'typo' : null;
  }

  // Thai answer: Thai script must match; romanization is accepted with a nudge.
  function thai(input, item) {
    const raw = input.trim();
    if (!raw) return { ok: false, how: 'empty' };
    if (THAI_CHAR.test(raw)) {
      const got = normThai(raw);
      const targets = [item.thai, ...(item.thAlt || [])].map(normThai);
      return targets.includes(got) ? { ok: true, how: 'exact' } : { ok: false, how: 'wrong' };
    }
    const how = closeEnough(normRom(raw), normRom(item.rom));
    return how ? { ok: true, how: 'romanized' } : { ok: false, how: 'wrong' };
  }

  // English for a word: any accepted meaning; "he/she" style answers are split.
  function englishWord(input, accepted) {
    const parts = input.split(/[\/,;]|\bor\b/).map(normEn).filter(Boolean);
    if (!parts.length) return { ok: false, how: 'empty' };
    const targets = accepted.map(normEn);
    let best = null;
    for (const p of parts) {
      for (const t of targets) {
        const how = closeEnough(p, t);
        if (how === 'exact') return { ok: true, how };
        if (how) best = how;
      }
    }
    return best ? { ok: true, how: best } : { ok: false, how: 'wrong' };
  }

  // English for a sentence: a listed translation (allowing typos), or every key idea present.
  function englishSentence(input, item) {
    const got = normEn(input);
    if (!got) return { ok: false, how: 'empty' };
    let typo = false;
    for (const t of item.en.map(normEn)) {
      const how = closeEnough(got, t);
      if (how === 'exact') return { ok: true, how };
      if (how) typo = true;
    }
    if (typo) return { ok: true, how: 'typo' };
    const padded = ` ${got} `;
    // Words that signal a classic misreading (e.g. ไหม "question" read as ไหน "which").
    if ((item.avoid || []).some((w) => padded.includes(` ${normEn(w)} `))) return { ok: false, how: 'wrong' };
    const hasAll = (item.key || []).length > 0 && item.key.every((group) =>
      group.some((k) => padded.includes(` ${normEn(k)} `)));
    return hasAll ? { ok: true, how: 'keywords' } : { ok: false, how: 'wrong' };
  }

  return { thai, englishWord, englishSentence, normThai, normEn, normRom, isThai: (s) => THAI_CHAR.test(s) };
})();

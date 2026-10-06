(() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const { register, playFile, playSequence, button, toneIcon } = App;

  const TONE_LABEL = { mid: 'Mid', low: 'Low', falling: 'Falling', high: 'High', rising: 'Rising' };
  const TONE_ORDER = TONE_INFO.map((t) => t.tone);

  const play = (w) => playFile(w.id, w.thai, w.id);
  const step = (w) => [w.id, w.thai, w.id];

  // Chao tone letters (˥ high … ˩ low) as pitch levels 5…1; a single letter is a level tone.
  const LEVEL = { '˥': 5, '˦': 4, '˧': 3, '˨': 2, '˩': 1 };
  function pitches(tone) {
    const p = [...TONES[tone].letters].map((c) => LEVEL[c]);
    return p.length === 1 ? [p[0], p[0]] : p;
  }

  function svg(tag, attrs, parent) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    parent.appendChild(el);
    return el;
  }

  // ---------- Contour chart ----------
  // One curve per tone. Every sound with that tone is registered against its curve too,
  // so the curve pulses whenever a word in that tone is playing.
  const curves = {};
  const linkToCurve = (id, data, tone) => register(id, data, curves[tone]);

  function drawContours() {
    const chart = document.getElementById('contours');
    const X0 = 40, X1 = 250;
    const y = (level) => 170 - (level - 1) * 37.5;

    for (let level = 1; level <= 5; level++) {
      svg('line', { class: 'gridline', x1: X0, y1: y(level), x2: X1, y2: y(level) }, chart);
      svg('text', { class: 'level', x: X0 - 12, y: y(level) }, chart).textContent = level;
    }
    svg('text', { class: 'axis', x: X0, y: 188 }, chart).textContent = 'start';
    svg('text', { class: 'axis', x: X1, y: 188, 'text-anchor': 'end' }, chart).textContent = 'end';

    const labels = [];
    for (const tone of TONE_ORDER) {
      const p = pitches(tone);
      const xs = p.map((_, i) => X0 + 14 + i * (X1 - X0 - 28) / (p.length - 1));
      const points = p.map((lv, i) => `${xs[i]},${y(lv)}`).join(' ');
      curves[tone] = svg('polyline', { class: `contour tone-${tone}`, points }, chart);
      labels.push({ tone, y: y(p[p.length - 1]) });
    }
    // Low and falling both end at the bottom: nudge labels apart so they don't overlap.
    labels.sort((a, b) => b.y - a.y);
    labels.forEach((l, i) => { if (i && labels[i - 1].y - l.y < 15) l.y = labels[i - 1].y - 15; });
    for (const l of labels) {
      svg('text', { class: `contour-label tone-${l.tone}`, x: X1 + 8, y: l.y }, chart).textContent = TONE_LABEL[l.tone];
    }
  }

  function focusTone(tone) {
    for (const [k, el] of Object.entries(curves)) el.classList.toggle('dim', Boolean(tone) && k !== tone);
  }

  // ---------- Tone cards ----------
  function drawToneCards() {
    const wrap = document.getElementById('tone-cards');
    for (const t of TONE_INFO) {
      const ex = TONE_WORDS.find((w) => w.set === 'khaa' && w.tone === t.tone);
      const card = document.createElement('div');
      card.className = `tone-card tone-${t.tone}`;
      card.innerHTML = `
        <div class="tc-head">${toneIcon(t.tone)}<strong>${TONE_LABEL[t.tone]}</strong>
          <span class="tc-chao">${TONES[t.tone].letters} ${pitches(t.tone).join('')}</span></div>
        <p class="tc-how">${t.how}</p>
        <p class="tc-tip">${t.tip}</p>
        <div class="actions"></div>`;
      const nameBtn = button(`▶ <span lang="th">${t.thai}</span> <span class="ex-rom">${t.rom}</span>`, () => play(t));
      const exBtn = button(`▶ <span class="ex-thai" lang="th">${ex.thai}</span> <span class="ex-rom">${ex.rom}</span> · ${ex.en}`, () => play(ex));
      register(t.id, t, nameBtn);
      linkToCurve(t.id, t, t.tone);
      register(ex.id, ex, exBtn);
      card.querySelector('.actions').append(exBtn, nameBtn);
      card.addEventListener('mouseenter', () => focusTone(t.tone));
      card.addEventListener('mouseleave', () => focusTone(null));
      card.addEventListener('focusin', () => focusTone(t.tone));
      card.addEventListener('focusout', () => focusTone(null));
      wrap.append(card);
    }
  }

  // ---------- Minimal sets ----------
  function drawSets() {
    const wrap = document.getElementById('tone-sets');
    for (const set of TONE_SETS) {
      const words = TONE_WORDS.filter((w) => w.set === set.key);
      const block = document.createElement('div');
      block.className = 'tone-set';
      block.innerHTML = `
        <div class="ts-head"><strong>${set.title}</strong><span class="muted">${set.note}</span></div>
        <div class="ts-words"></div>`;
      block.querySelector('.ts-head').append(button('▶ Play all', () => playSequence(words.map(step)), 'ts-play'));
      const row = block.querySelector('.ts-words');
      for (const tone of TONE_ORDER) {
        const w = words.find((x) => x.tone === tone);
        if (!w) {
          row.insertAdjacentHTML('beforeend', `<div class="word-tile empty tone-${tone}">${toneIcon(tone)}<span class="wt-thai">—</span><span class="wt-en">no word</span></div>`);
          continue;
        }
        const b = button(
          `${toneIcon(tone)}<span class="wt-thai" lang="th">${w.thai}</span><span class="wt-rom">${w.rom}</span><span class="wt-en">${w.en}</span>`,
          () => play(w), `word-tile tone-${tone}`);
        b.setAttribute('aria-label', `${w.thai}, ${w.rom}, ${w.en}, ${tone} tone`);
        register(w.id, w, b);
        linkToCurve(w.id, w, tone);
        row.append(b);
      }
      wrap.append(block);
    }

    const tw = TONE_TWISTER;
    const twister = document.getElementById('twister');
    twister.innerHTML = `
      <div class="ts-head"><strong>Tongue twister</strong><span class="muted">${tw.en}</span></div>
      <div class="tw-words">${tw.words.map((w, i) => `
        <span class="tw-word tone-${tw.tones[i]}">${toneIcon(tw.tones[i])}<span lang="th">${w}</span>
          <span class="wt-rom">${tw.rom.split(' ')[i]}</span></span>`).join('')}</div>`;
    const b = button('▶ Play', () => play(tw), 'ts-play');
    register(tw.id, tw, twister);
    twister.querySelector('.ts-head').append(b);
  }

  // ---------- Tone marks ----------
  function drawMarks() {
    const cards = document.getElementById('mark-cards');
    for (const m of TONE_MARKS) {
      const b = button(
        `<span class="mark-glyph" lang="th">◌${m.mark}</span><span class="mark-name" lang="th">${m.thai}</span><span class="wt-rom">${m.rom}</span>`,
        () => play(m), 'mark-card');
      b.setAttribute('aria-label', `${m.thai}, ${m.rom}`);
      register(m.id, m, b);
      cards.append(b);
    }

    const table = document.getElementById('mark-table');
    table.innerHTML = `
      <thead><tr><th class="corner">Class</th>${TONE_MARKS.map((m) =>
        `<th class="col mark"><span lang="th">◌${m.mark}</span><span class="sub">${m.rom}</span></th>`).join('')}</tr></thead>
      <tbody></tbody>`;
    const body = table.querySelector('tbody');
    for (const cls of CONSONANT_CLASSES) {
      const tr = document.createElement('tr');
      tr.className = `cls-${cls.key}`;
      tr.innerHTML = `<th scope="row" class="row-head">${cls.name}</th>`;
      for (const m of TONE_MARKS) {
        const syl = TONE_TABLE[cls.key][m.key];
        const td = document.createElement('td');
        if (!syl) {
          td.className = 'none';
          td.textContent = '—';
        } else {
          const b = button(
            `${toneIcon(syl.tone)}<span class="tone-name">${syl.tone}</span><span class="syl" lang="th">${syl.thai}</span>`,
            () => play(syl), `tone-cell tone-${syl.tone}`);
          b.setAttribute('aria-label', `${syl.thai}, ${syl.tone} tone`);
          register(syl.id, syl, b);
          linkToCurve(syl.id, syl, syl.tone);
          td.append(b);
        }
        tr.append(td);
      }
      body.append(tr);
    }
  }

  drawContours();
  drawToneCards();
  drawSets();
  drawMarks();
  App.restorePosition();
})();

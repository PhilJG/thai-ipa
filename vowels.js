(() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Trapezoid corners (viewBox 490 x 360): front edge slants, back edge is vertical.
  const TOP = 50, BOTTOM = 330, BACK = 400;
  const FRONT_TOP = 100, FRONT_BOTTOM = 235;
  const ROWS = [TOP, 143, 237, BOTTOM]; // close, close-mid, open-mid, open
  const frontX = (y) => FRONT_TOP + (y - TOP) * (FRONT_BOTTOM - FRONT_TOP) / (BOTTOM - TOP);

  // Where each monophthong sits. `edge` is the x where the pills attach,
  // `align` says which side of the dot they go on, `cy` centres the pill pair.
  const LAYOUT = {
    i: { dot: [FRONT_TOP, TOP], edge: FRONT_TOP - 12, align: 'right', cy: TOP },
    ɯ: { dot: [340, TOP], edge: 328, align: 'right', cy: TOP + 32 },
    u: { dot: [BACK, TOP], edge: BACK + 12, align: 'left', cy: TOP },
    e: { dot: [frontX(ROWS[1]), ROWS[1]], edge: frontX(ROWS[1]) - 12, align: 'right', cy: ROWS[1] },
    ɤ: { dot: [330, 190], edge: 318, align: 'right', cy: 190 },
    o: { dot: [BACK, ROWS[1]], edge: BACK + 12, align: 'left', cy: ROWS[1] },
    ɛ: { dot: [frontX(ROWS[2]), ROWS[2]], edge: frontX(ROWS[2]) - 12, align: 'right', cy: ROWS[2] },
    ɔ: { dot: [BACK, ROWS[2]], edge: BACK + 12, align: 'left', cy: ROWS[2] },
    a: { dot: [FRONT_BOTTOM, BOTTOM], edge: FRONT_BOTTOM - 12, align: 'right', cy: BOTTOM },
  };
  const PILL_W = 72, PILL_H = 26, PILL_GAP = 4;

  const chart = document.getElementById('chart');
  const detail = document.getElementById('detail');
  const { register, select, playFile, playSequence, button } = App;

  function svg(tag, attrs = {}, parent) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (parent) parent.appendChild(el);
    return el;
  }

  const playSound = (sound) => playFile(sound.id, sound.thai, sound.id);
  const playExample = (sound) => playFile(`${sound.id}-ex`, sound.ex.thai, sound.id);

  const playPair = (group) => playSequence(
    [group.short, group.long].map((s) => [s.id, s.thai, s.id]));

  App.onSelect((entry, { play = true, scroll = false }) => {
    renderDetail(entry);
    if (scroll) detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (play) playSound(entry.sound);
  });

  function renderDetail({ sound, length, group }) {
    detail.hidden = false;
    detail.className = `detail detail-sticky ${length ? `is-${length}` : ''}`;
    const meta = [length, group && group.name, sound.note].filter(Boolean).join(' · ');
    const where = positions[sound.id];
    const mouth = where && Mouth.forVowel(where);
    detail.innerHTML = `
      ${mouth ? `<div class="detail-mouth">${Mouth.svg(mouth)}</div>` : ''}
      <div class="detail-head">
        <span class="detail-thai" lang="th">${sound.thai}</span>
        <span class="detail-ipa">[${sound.ipa}]</span>
      </div>
      <p class="detail-meta">${meta}</p>
      ${mouth ? `<p class="mouth-caption">${Mouth.caption(mouth)}</p>` : ''}
      <div class="actions"></div>`;
    const actions = detail.querySelector('.actions');
    actions.append(button('▶ Play', () => playSound(sound)));
    if (sound.ex) {
      actions.append(button(
        `▶ <span class="ex-thai" lang="th">${sound.ex.thai}</span> <span class="ex-rom">${sound.ex.rom}</span> · ${sound.ex.en}`,
        () => playExample(sound)));
    }
    if (group && group.short && group.long) {
      const other = length === 'short' ? group.long : group.short;
      actions.append(button('▶ Short vs long', () => playPair(group)));
      actions.append(button(
        `${length === 'short' ? 'Long' : 'Short'}: <span lang="th">${other.thai}</span> [${other.ipa}]`,
        () => select(other.id)));
    }
  }

  // ---------- Chart ----------
  function drawChart() {
    const left = svg('g', {}, chart);
    // Grid: inner horizontals and the central vertical.
    for (const y of ROWS.slice(1, 3)) {
      svg('line', { class: 'gridline', x1: frontX(y), y1: y, x2: BACK, y2: y }, left);
    }
    svg('line', { class: 'gridline', x1: 250, y1: TOP, x2: 318, y2: BOTTOM }, left);
    svg('polygon', {
      class: 'edge',
      points: `${FRONT_TOP},${TOP} ${BACK},${TOP} ${BACK},${BOTTOM} ${FRONT_BOTTOM},${BOTTOM}`,
    }, left);

    const rowNames = ['close', 'close-mid', 'open-mid', 'open'];
    ROWS.forEach((y, i) => {
      const t = svg('text', {
        class: 'row-label',
        x: frontX(y) + (i === 0 ? 14 : 10),
        y: i === ROWS.length - 1 ? y - 8 : y + 15,
      }, left);
      t.textContent = rowNames[i];
    });

    for (const group of MONOPHTHONGS) {
      const L = LAYOUT[group.pos];
      svg('circle', { class: 'dot', cx: L.dot[0], cy: L.dot[1], r: 5.5 }, chart);
      const x = L.align === 'right' ? L.edge - PILL_W : L.edge;
      drawPill(group.short, 'short', group, x, L.cy - PILL_H - PILL_GAP / 2);
      drawPill(group.long, 'long', group, x, L.cy + PILL_GAP / 2);
    }
  }

  function drawPill(sound, length, group, x, y) {
    const g = svg('g', {
      class: `pill ${length}`,
      tabindex: 0,
      role: 'button',
      'aria-label': `${length} ${sound.ipa}, ${sound.thai}`,
    }, chart);
    svg('rect', { x, y, width: PILL_W, height: PILL_H, rx: PILL_H / 2 }, g);
    const ipa = svg('text', { class: 'ipa', x: x + 11, y: y + PILL_H / 2 }, g);
    ipa.textContent = sound.ipa;
    const thai = svg('text', { class: 'thai', x: x + PILL_W - 10, y: y + PILL_H / 2, 'text-anchor': 'end' }, g);
    thai.textContent = sound.thai;
    register(sound.id, { sound, length, group }, g);
    g.addEventListener('click', () => select(sound.id, { scroll: true }));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(sound.id); }
    });
  }

  // ---------- Cards ----------
  function chip(sound, length, group) {
    const b = button(
      `<span class="ipa">[${sound.ipa}]</span><span class="thai" lang="th">${sound.thai}</span>`,
      () => select(sound.id),
      `chip ${length || 'long'}`);
    register(sound.id, { sound, length, group }, b);
    return b;
  }

  function drawCards() {
    const dip = document.getElementById('diphthongs');
    for (const group of DIPHTHONGS) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="card-title">${group.name}</div>`;
      card.append(chip(group.short, 'short', group), chip(group.long, 'long', group));
      dip.append(card);
    }
    const spec = document.getElementById('specials');
    for (const sound of SPECIALS) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="card-title">${sound.note}</div>`;
      card.append(chip(sound, null, null));
      spec.append(card);
    }
  }

  // ---------- Vowel compass ----------
  // SJR's column symbols: short ⊣, long ⌐ trailing off, stretchy (glides out), shrinky (glides in).
  const COLUMN_ICONS = {
    short: '<path d="M8 20 H22 M22 4 V36"/>',
    long: '<path d="M2 14 H30 Q37 14 40 20"/>',
    stretchy: '<path d="M4 16 L20 32 L36 16"/><path d="M12 16 A9 9 0 1 1 28 14"/><path d="M24 10 L28 15 L32 10"/>',
    shrinky: '<path d="M12 4 L20 24 L28 4"/><path d="M10 14 V28 Q10 34 16 34 H24 Q30 34 30 28 V14"/>',
  };

  function drawCompass() {
    const grid = document.getElementById('vowel-compass');
    const head = (name) => `<span class="vc-col"><svg viewBox="0 0 42 38" aria-hidden="true">${COLUMN_ICONS[name]}</svg>${name}</span>`;
    grid.innerHTML = `
      <span></span><span class="vc-group" style="grid-column: span 4">Raised tongue</span><span class="vc-divider" style="grid-row: span 6"></span><span class="vc-group" style="grid-column: span 2">Lowered tongue</span>
      <span></span>${VOWEL_COMPASS.raised.map(head).join('')}${VOWEL_COMPASS.lowered.map(head).join('')}`;
    for (const row of VOWEL_COMPASS.rows) {
      grid.insertAdjacentHTML('beforeend', `<span class="vc-row vc-${row.key}">${row.name}</span>`);
      for (const cell of [...row.raised, ...row.lowered]) grid.append(compassCell(cell));
    }
    // Bottom line: อำ, then the schwa pair under the lowered columns.
    grid.insertAdjacentHTML('beforeend', '<span class="vc-row vc-divider-row"></span>');
    grid.append(compassCell(VOWEL_COMPASS.am));
    grid.insertAdjacentHTML('beforeend', '<span class="vc-schwa-label" style="grid-column: span 4">Neutral ‘schwa’ vowel</span>');
    for (const cell of VOWEL_COMPASS.schwa) grid.append(compassCell(cell, 'vc-schwa'));
  }

  function compassCell(cell, extra = '') {
    const { sound, length, group } = soundById[cell.id];
    const b = button(
      `<span class="vc-ipa">${cell.ipa}</span><span class="vc-thai" lang="th">${sound.thai}</span>${cell.rare ? '<span class="vc-rare">rare</span>' : ''}`,
      () => select(cell.id),
      `vc-cell${cell.echo ? ' echo' : ''}${cell.rare ? ' rare' : ''} ${extra}`);
    b.setAttribute('aria-label', `${cell.ipa}, ${sound.thai}${cell.rare ? ', rare' : ''}`);
    register(cell.id, { sound, length, group }, b);
    return b;
  }

  // Every sound by id, with its length and pair, and where the tongue goes for it.
  const soundById = {};
  for (const group of [...MONOPHTHONGS, ...DIPHTHONGS]) {
    soundById[group.short.id] = { sound: group.short, length: 'short', group };
    soundById[group.long.id] = { sound: group.long, length: 'long', group };
  }
  for (const sound of SPECIALS) soundById[sound.id] = { sound, length: null, group: null };

  const positions = { ...EXTRA_VOWEL_POSITIONS };
  for (const row of VOWEL_COMPASS.rows) for (const c of [...row.raised, ...row.lowered]) positions[c.id] ||= c.q;
  for (const c of [VOWEL_COMPASS.am, ...VOWEL_COMPASS.schwa]) positions[c.id] = c.q;

  drawCompass();
  drawChart();
  drawCards();
  App.restorePosition();
})();

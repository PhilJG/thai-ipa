(() => {
  const { register, select, playFile, playSequence, button } = App;

  const letterDetail = document.getElementById('letter-detail');
  const toneDetail = document.getElementById('tone-detail');
  const classByKey = Object.fromEntries(CONSONANT_CLASSES.map((c) => [c.key, c]));
  const columnByKey = Object.fromEntries(TONE_COLUMNS.map((c) => [c.key, c]));

  // Small contour drawings of each tone, like the — \ ^ / v marks on a tone chart.
  const TONE_PATHS = {
    mid: 'M3 7 H17',
    low: 'M3 3 L17 11',
    falling: 'M3 12 L10 3 L17 12',
    high: 'M3 11 L17 3',
    rising: 'M3 3 L10 12 L17 3',
  };
  const toneIcon = (tone) =>
    `<svg class="tone-icon" viewBox="0 0 20 14" aria-hidden="true"><path d="${TONE_PATHS[tone]}"/></svg>`;

  const playLetter = (c) => playFile(c.id, c.say, c.id);
  const playSyllable = (s) => playFile(s.id, s.thai, s.id);
  const step = (s) => [s.id, s.thai, s.id];

  App.onSelect((entry, { play = true }) => {
    if (entry.kind === 'letter') {
      renderLetter(entry.letter);
      if (play) playLetter(entry.letter);
    } else {
      renderTone(entry);
      if (play) playSyllable(entry.syllable);
    }
  });

  // ---------- Letters by class ----------
  function drawClasses() {
    const wrap = document.getElementById('classes');
    for (const cls of CONSONANT_CLASSES) {
      const letters = CONSONANTS.filter((c) => c.cls === cls.key);
      const block = document.createElement('div');
      block.className = `class-block cls-${cls.key}`;
      block.innerHTML = `
        <h3>${cls.name} <span class="thai">${cls.thai}</span>
          <span class="count">${letters.filter((c) => !c.obsolete).length} letters</span></h3>
        <div class="letters"></div>`;
      const grid = block.querySelector('.letters');
      for (const c of letters) {
        const b = button(
          `<span class="glyph" lang="th">${c.thai}</span><span class="tile-ipa">${c.initial}</span>`,
          () => select(c.id),
          `letter-tile${c.obsolete ? ' obsolete' : ''}`);
        b.setAttribute('aria-label', `${c.thai}, ${c.rom}, ${c.en}, ${cls.name}`);
        register(c.id, { kind: 'letter', letter: c }, b);
        grid.append(b);
      }
      wrap.append(block);
    }
  }

  function renderLetter(c) {
    const cls = classByKey[c.cls];
    letterDetail.hidden = false;
    letterDetail.className = `detail detail-sticky cls-${c.cls}`;
    const final = c.final ? `final [${c.final}]` : 'not used as a final';
    letterDetail.innerHTML = `
      <div class="detail-head">
        <span class="detail-thai" lang="th">${c.thai}</span>
        <span class="detail-name"><span lang="th">${c.say}</span>
          <span class="detail-rom">${c.rom} · ${c.en}</span></span>
      </div>
      <p class="detail-meta"><span class="class-badge">${cls.name}</span>
        initial [${c.initial}] · ${final}${c.obsolete ? ' · obsolete, no longer used' : ''}</p>
      <div class="actions"></div>`;
    letterDetail.querySelector('.actions').append(button('▶ Play name', () => playLetter(c)));
  }

  // ---------- Tone rules table ----------
  function drawToneTable() {
    const table = document.getElementById('tone-table');
    const groups = [];
    for (const col of TONE_COLUMNS) {
      const last = groups[groups.length - 1];
      if (last && last.name === col.group) last.span++;
      else groups.push({ name: col.group, span: 1 });
    }
    table.innerHTML = `
      <thead>
        <tr>
          <th rowspan="2" class="corner">Class</th>
          ${groups.map((g) => `<th colspan="${g.span}" class="group">${g.name}</th>`).join('')}
        </tr>
        <tr>
          ${TONE_COLUMNS.map((c) => `<th class="col${c.group === 'Tone marks' ? ' mark' : ''}"><span lang="th">${c.label}</span>${c.sub ? `<span class="sub">${c.sub}</span>` : ''}</th>`).join('')}
        </tr>
      </thead>
      <tbody></tbody>`;

    const body = table.querySelector('tbody');
    // Neither high nor low class can take ไม้ตรี / ไม้จัตวา: one merged "none" cell covers both rows.
    let noneDrawn = false;
    for (const cls of CONSONANT_CLASSES) {
      const tr = document.createElement('tr');
      tr.className = `cls-${cls.key}`;
      const letters = CONSONANTS.filter((c) => c.cls === cls.key && !c.obsolete).map((c) => c.thai).join(' ');
      tr.innerHTML = `<th scope="row" class="row-head">${cls.name}<span class="row-letters" lang="th">${letters}</span></th>`;
      for (const col of TONE_COLUMNS) {
        const syl = TONE_TABLE[cls.key][col.key];
        if (!syl) {
          if (!noneDrawn) {
            const missing = TONE_COLUMNS.filter((c) => !TONE_TABLE[cls.key][c.key]).length;
            tr.insertAdjacentHTML('beforeend', `<td class="none" colspan="${missing}" rowspan="2">None</td>`);
            noneDrawn = true;
          }
          continue;
        }
        const td = document.createElement('td');
        const b = button(
          `${toneIcon(syl.tone)}<span class="tone-name">${syl.tone}</span><span class="syl" lang="th">${syl.thai}</span>`,
          () => select(syl.id),
          `tone-cell tone-${syl.tone}`);
        b.setAttribute('aria-label', `${syl.thai}, ${syl.tone} tone`);
        register(syl.id, { kind: 'tone', syllable: syl, cls: cls.key, col: col.key }, b);
        td.append(b);
        tr.append(td);
      }
      body.append(tr);
    }
  }

  function renderTone({ syllable: s, cls, col }) {
    const clsInfo = classByKey[cls];
    const colInfo = columnByKey[col];
    toneDetail.hidden = false;
    toneDetail.className = `detail detail-sticky cls-${cls}`;
    toneDetail.innerHTML = `
      <div class="detail-head">
        <span class="detail-thai" lang="th">${s.thai}</span>
        <span class="detail-ipa">[${s.ipa}<span class="tone-letters">${TONES[s.tone].letters}</span>]</span>
        <span class="detail-tone">${toneIcon(s.tone)} ${s.tone} tone</span>
      </div>
      <p class="detail-meta"><span class="class-badge">${clsInfo.name}</span> + ${colInfo.rule} → <strong>${s.tone}</strong></p>
      <div class="actions"></div>`;

    const row = TONE_COLUMNS.map((c) => TONE_TABLE[cls][c.key]).filter(Boolean);
    const column = CONSONANT_CLASSES.map((c) => TONE_TABLE[c.key][col]).filter(Boolean);
    toneDetail.querySelector('.actions').append(
      button('▶ Play', () => playSyllable(s)),
      button(`▶ Whole row (${clsInfo.name.toLowerCase()})`, () => playSequence(row.map(step))),
      button('▶ Compare classes', () => playSequence(column.map(step))),
    );
  }

  drawClasses();
  drawToneTable();
  App.restorePosition();
})();

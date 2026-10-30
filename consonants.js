(() => {
  const { register, select, playFile, playSequence, button, toneIcon } = App;

  const letterDetail = document.getElementById('letter-detail');
  const toneDetail = document.getElementById('tone-detail');
  const classByKey = Object.fromEntries(CONSONANT_CLASSES.map((c) => [c.key, c]));
  const columnByKey = Object.fromEntries(TONE_COLUMNS.map((c) => [c.key, c]));
  const letterByThai = Object.fromEntries(CONSONANTS.map((c) => [c.thai, c]));

  // Where each letter sits on the compass: thai -> { place, type }.
  const compassSpot = {};
  for (const row of COMPASS_ROWS) {
    row.cells.forEach((cell, i) => {
      for (const t of cell.split(' ').filter(Boolean)) {
        compassSpot[t] = { place: COMPASS_PLACES[row.place].name, type: COMPASS_COLUMNS[i] };
      }
    });
  }

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
      for (const c of letters) grid.append(letterTile(c));
      wrap.append(block);
    }
  }

  function letterTile(c) {
    const b = button(
      `<span class="glyph" lang="th">${c.thai}</span><span class="tile-ipa">${c.initial}</span>`,
      () => select(c.id),
      `letter-tile cls-${c.cls}${c.obsolete ? ' obsolete' : ''}`);
    b.setAttribute('aria-label', `${c.thai}, ${c.rom}, ${c.en}, ${classByKey[c.cls].name}`);
    register(c.id, { kind: 'letter', letter: c }, b);
    return b;
  }

  // ---------- Consonant compass ----------
  function drawCompass() {
    const grid = document.createElement('div');
    grid.className = 'compass-grid';
    grid.innerHTML = '<span></span>' + COMPASS_COLUMNS.map((c) => `<span class="compass-col">${c}</span>`).join('');
    for (const row of COMPASS_ROWS) {
      grid.insertAdjacentHTML('beforeend', `<span class="compass-row">${COMPASS_PLACES[row.place].name}</span>`);
      for (const cell of row.cells) {
        const div = document.createElement('div');
        const letters = cell.split(' ').filter(Boolean).map((t) => letterByThai[t]);
        if (letters.length) {
          const first = letters[0];
          const soundsLike = COMPASS_SOUNDS_LIKE[first.thai] || COMPASS_PLACES[row.place].soundsLike || row.place;
          div.className = `compass-cell at-${soundsLike} cls-${first.cls}${soundsLike !== row.place ? ` from-${row.place}` : ''}`;
          for (const c of letters) {
            const b = button(
              `<span class="glyph" lang="th">${c.thai}</span><span class="tile-ipa">/${COMPASS_IPA[c.thai] || c.initial}/</span>`,
              () => select(c.id),
              `compass-letter${c.obsolete ? ' obsolete' : ''}`);
            b.setAttribute('aria-label', `${c.thai}, ${c.rom}, ${c.en}, ${classByKey[c.cls].name}`);
            register(c.id, { kind: 'letter', letter: c }, b);
            div.append(b);
          }
        }
        grid.append(div);
      }
    }
    document.getElementById('compass-scroll').append(grid);
  }

  // ---------- Layout and class highlight ----------
  function setupViewBar() {
    const views = { classes: document.getElementById('classes'), compass: document.getElementById('compass') };
    const viewButtons = document.querySelectorAll('[data-view]');
    const classButtons = document.querySelectorAll('[data-cls]');
    const note = document.getElementById('class-note');

    const showView = (view) => {
      for (const [key, el] of Object.entries(views)) el.hidden = key !== view;
      viewButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
      App.remember('view', view);
    };
    const showClass = (cls) => {
      views.compass.dataset.highlight = cls;
      classButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cls === cls)));
      note.textContent = CLASS_NOTES[cls] || 'Pick a class to light up its letters. The class decides how a syllable is toned.';
      App.remember('highlight', cls);
    };

    viewButtons.forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));
    classButtons.forEach((b) => b.addEventListener('click', () => showClass(b.dataset.cls)));
    showView(App.recall('view', 'compass'));
    showClass(App.recall('highlight', 'none'));
  }

  // ---------- Memory aids ----------
  // Your own rewrites of the shape memory aids, keyed by letter.
  const SHAPES_KEY = 'letterShapes';
  let myShapes = {};
  try { myShapes = JSON.parse(localStorage.getItem(SHAPES_KEY)) || {}; } catch (e) {}

  function saveShape(thai, text) {
    if (text) myShapes[thai] = text;
    else delete myShapes[thai];
    try { localStorage.setItem(SHAPES_KEY, JSON.stringify(myShapes)); } catch (e) {}
  }

  const shapeFor = (c) => myShapes[c.thai] || LETTER_ART[c.thai].shape;

  function drawShape(c, box) {
    const edited = c.thai in myShapes;
    box.innerHTML = `<span class="shape-label">Memory aid${edited ? ' (yours)' : ''}</span>
      <span class="shape-text"></span>`;
    box.querySelector('.shape-text').textContent = shapeFor(c);
    const tools = document.createElement('span');
    tools.className = 'shape-tools';
    tools.append(button('Edit', () => editShape(c, box), 'small'));
    if (edited) tools.append(button('Reset', () => { saveShape(c.thai, ''); drawShape(c, box); }, 'small'));
    box.append(tools);
  }

  function editShape(c, box) {
    box.innerHTML = '<label class="shape-label" for="shape-input">Memory aid</label>';
    const input = document.createElement('textarea');
    input.id = 'shape-input';
    input.rows = 3;
    input.value = shapeFor(c);
    const tools = document.createElement('span');
    tools.className = 'shape-tools';
    tools.append(
      button('Save', () => {
        const text = input.value.trim();
        saveShape(c.thai, text === LETTER_ART[c.thai].shape ? '' : text);
        drawShape(c, box);
      }, 'small'),
      button('Cancel', () => drawShape(c, box), 'small'));
    box.append(input, tools);
    input.focus();
  }

  function renderLetter(c) {
    const cls = classByKey[c.cls];
    letterDetail.hidden = false;
    letterDetail.className = `detail detail-sticky cls-${c.cls}`;
    const final = c.final ? `final [${c.final}]` : 'not used as a final';
    const spot = compassSpot[c.thai];
    letterDetail.innerHTML = `
      <div class="detail-mouth">${Mouth.svg(Mouth.forConsonant(c.initial))}</div>
      <div class="detail-head">
        <span class="detail-thai" lang="th">${c.thai}</span>
        <span class="detail-pic" aria-hidden="true">${LETTER_ART[c.thai].pic}</span>
        <span class="detail-name"><span lang="th">${c.say}</span>
          <span class="detail-rom">${c.rom} · ${c.en}</span></span>
      </div>
      <p class="detail-meta"><span class="class-badge">${cls.name}</span>
        initial [${c.initial}] · ${final}${c.obsolete ? ' · obsolete, no longer used' : ''}
        <br>Compass: ${spot.place.toLowerCase()}, ${spot.type}</p>
      <p class="mouth-caption">${Mouth.caption(Mouth.forConsonant(c.initial))}</p>
      <p class="shape"></p>
      <div class="actions"></div>`;
    drawShape(c, letterDetail.querySelector('.shape'));
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
  drawCompass();
  setupViewBar();
  drawToneTable();
  App.restorePosition();
})();

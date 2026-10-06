// Shared typed-answer quiz with spaced repetition. Used by the Words and Sentences pages.
//
// Quiz.create({
//   kind,             // card id prefix: 'w' or 's'
//   items,            // [{ id, thai, rom, en: [...] , ... }]
//   noun,             // 'word' / 'sentence' (for labels)
//   defaultNew,       // new cards per session
//   prompt(item, dir), answer(item), check(input, item, dir),
//   hints(item, dir, ctx) -> [{ label, free?, run(out) }],
//   reviewHref(item)  // link to the word list for a new card (answer is never pre-shown)
// })
const Quiz = (() => {
  const DIR_LABEL = { te: 'Thai → English', et: 'English → Thai' };
  const DIR_SETTINGS = { both: ['te', 'et'], te: ['te'], et: ['et'] };
  // An unfinished session is picked up again if you come back to the page within this time.
  const SESSION_TTL = 12 * 60 * 60 * 1000;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function create(cfg) {
    const { kind, items } = cfg;
    const byId = new Map(items.map((i) => [i.id, i]));
    const cardEl = document.getElementById('quiz-card');
    const statsEl = document.getElementById('quiz-stats');
    const listEl = document.getElementById('quiz-list');

    let dirSetting = Store.getMeta(`${kind}:dirs`, 'both');
    let newLimit = Store.getMeta(`${kind}:newLimit`, cfg.defaultNew);
    let stored = Store.getCards(`${kind}:`);
    let session = null;
    let current = null;

    const cardId = (item, dir) => `${kind}:${item.id}:${dir}`;
    const parseId = (id) => {
      const [, itemId, dir] = id.split(':');
      return { item: byId.get(itemId), dir };
    };
    const allIds = () => items.flatMap((i) => DIR_SETTINGS[dirSetting].map((d) => cardId(i, d)));
    const playItem = (item) => App.playFile(item.id, item.thai, null);

    // ---------- Toolbar ----------
    function setupToolbar() {
      const dirButtons = document.querySelectorAll('.dir-picker [data-dir]');
      const syncDirs = () => dirButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.dir === dirSetting)));
      dirButtons.forEach((b) => b.addEventListener('click', () => {
        dirSetting = b.dataset.dir;
        Store.setMeta(`${kind}:dirs`, dirSetting);
        syncDirs();
        startSession();
      }));
      syncDirs();

      const newSelect = document.getElementById('new-limit');
      newSelect.value = String(newLimit);
      newSelect.addEventListener('change', () => {
        newLimit = Number(newSelect.value);
        Store.setMeta(`${kind}:newLimit`, newLimit);
        startSession();
      });
    }

    // ---------- Stats ----------
    function renderStats() {
      const ids = allIds();
      const now = Date.now();
      let due = 0, learned = 0, unseen = 0;
      for (const id of ids) {
        const c = stored.get(id);
        if (!c) unseen++;
        else {
          if (c.due <= now) due++;
          if (c.state === 'review') learned++;
        }
      }
      statsEl.innerHTML = `
        <div class="stat"><span class="stat-num">${due}</span><span class="stat-label">due</span></div>
        <div class="stat"><span class="stat-num">${unseen}</span><span class="stat-label">not started</span></div>
        <div class="stat"><span class="stat-num">${learned}<small>/${ids.length}</small></span><span class="stat-label">learned</span></div>`;
    }

    // ---------- Session ----------
    function startSession({ practice = false } = {}) {
      const ids = allIds();
      let queue;
      if (practice) {
        queue = ids.filter((id) => stored.has(id)).sort(() => Math.random() - 0.5);
      } else {
        queue = SRS.buildSession(ids, stored, newLimit).queue;
      }
      session = { queue, practice, answered: 0, firstTry: 0, seen: new Set() };
      renderStats();
      renderList();
      next();
    }

    function next() {
      if (!session.queue.length) return renderDone();
      load(session.queue.shift());
    }

    // `saved` carries a restored card's hints, draft and (if already checked) its result.
    function load(id, saved = {}) {
      const { item, dir } = parseId(id);
      const card = stored.get(id) || SRS.newCard(id);
      current = {
        id, item, dir, card, isNew: card.state === 'new' && !session.practice,
        hintsUsed: false, usedHints: [], shownHint: null, draft: '', answer: null, result: null, ...saved,
      };
      renderQuestion();
      saveSession();
    }

    // ---------- Remembered session ----------
    function saveSession() {
      const c = current;
      App.remember('session', {
        ts: Date.now(), dirs: dirSetting, practice: session.practice, queue: session.queue,
        answered: session.answered, firstTry: session.firstTry, seen: [...session.seen],
        current: { id: c.id, hintsUsed: c.hintsUsed, usedHints: c.usedHints, shownHint: c.shownHint,
          draft: c.draft, answer: c.answer, result: c.result },
      });
    }

    function restoreSession() {
      const s = App.recall('session', null);
      if (!s || !s.current || s.dirs !== dirSetting || Date.now() - s.ts > SESSION_TTL) return false;
      const valid = (id) => { const p = parseId(id); return p.item && DIR_LABEL[p.dir]; };
      if (![s.current.id, ...s.queue].every(valid)) return false;
      session = { queue: s.queue, practice: s.practice, answered: s.answered, firstTry: s.firstTry, seen: new Set(s.seen) };
      renderStats();
      renderList();
      load(s.current.id, s.current);
      return true;
    }

    function renderQuestion() {
      const { item, dir, isNew, card } = current;
      const badge = isNew ? '<span class="badge badge-new">New</span>'
        : session.practice ? '<span class="badge">Practice</span>'
        : card.state === 'learning' ? '<span class="badge badge-learning">Learning</span>'
        : '<span class="badge badge-review">Review</span>';
      const thaiInput = dir === 'et';
      cardEl.innerHTML = `
        <div class="qc-top">${badge}<span class="qc-dir">${DIR_LABEL[dir]}</span>
          <span class="qc-left">${session.queue.length + 1} left</span></div>
        <div class="qc-prompt">${cfg.prompt(item, dir)}</div>
        ${isNew ? `<div class="qc-new">First time seeing this ${cfg.noun}? Have a go, use a hint, or
          <a class="review-link" href="${cfg.reviewHref(item)}">${cfg.reviewLabel} →</a></div>` : ''}
        <form class="qc-form" autocomplete="off">
          <input class="qc-input" type="text" ${thaiInput ? 'lang="th"' : 'lang="en"'}
            placeholder="${thaiInput ? 'พิมพ์ภาษาไทย · type in Thai' : 'Type the English'}"
            autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go"
            aria-label="Your answer">
          <button type="submit" class="primary">Check</button>
        </form>
        <div class="qc-hints"></div>
        <div class="qc-hint-out" aria-live="polite"></div>
        <div class="qc-feedback" aria-live="polite" hidden></div>`;

      const form = cardEl.querySelector('.qc-form');
      const input = cardEl.querySelector('.qc-input');
      const hintOut = cardEl.querySelector('.qc-hint-out');
      const hintBar = cardEl.querySelector('.qc-hints');

      cardEl.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', () => playItem(item)));

      const setDraft = (text) => { input.value = text; input.focus(); input.dispatchEvent(new Event('input')); };
      const ctx = {
        input,
        play: () => playItem(item),
        insert(text) { setDraft(input.value + text); },
        clear() { setDraft(''); },
      };
      const hints = cfg.hints(item, dir, ctx);
      hints.forEach((h, i) => {
        const b = App.button(h.label, () => {
          if (current.result) return;
          if (!h.free) current.hintsUsed = true;
          if (!current.usedHints.includes(i)) current.usedHints.push(i);
          b.classList.add('used');
          const before = hintOut.innerHTML;
          h.run(hintOut);
          if (hintOut.innerHTML !== before) current.shownHint = i;
          saveSession();
        }, 'hint-btn');
        if (current.usedHints.includes(i)) b.classList.add('used');
        hintBar.append(b);
      });
      if (current.shownHint != null) hints[current.shownHint].run(hintOut);

      input.value = current.draft;
      input.addEventListener('input', () => {
        current.draft = input.value;
        saveSession();
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (current.result) commit();
        else submit(input.value);
      });
      if (current.result) {
        input.value = current.answer;
        showResult(false);
      }
      input.focus({ preventScroll: true });
    }

    function submit(answer) {
      if (!answer.trim()) return;
      current.result = cfg.check(answer, current.item, current.dir);
      current.answer = answer;
      saveSession();
      showResult(true);
    }

    // `fresh` is false when redrawing a result restored from a previous visit.
    function showResult(fresh) {
      const res = current.result;
      const answer = current.answer;
      const input = cardEl.querySelector('.qc-input');
      input.readOnly = true;
      cardEl.querySelector('.qc-form .primary').textContent = 'Next';
      cardEl.querySelectorAll('.hint-btn').forEach((b) => { b.disabled = true; });

      const fb = cardEl.querySelector('.qc-feedback');
      fb.hidden = false;
      fb.className = `qc-feedback ${res.ok ? 'ok' : 'bad'}`;
      const note = {
        exact: '', typo: 'Small typo — counted as correct.',
        keywords: 'Close enough — compare with the model answer.',
        romanized: 'Right sounds! Try typing it in Thai script next time.',
        wrong: '', empty: '',
      }[res.how];
      fb.innerHTML = `
        <div class="fb-head">${res.ok ? '✓ Correct' : '✗ Not quite'}${note ? `<span class="fb-note">${note}</span>` : ''}</div>
        ${res.ok ? '' : `<div class="fb-yours">You wrote: <span ${current.dir === 'et' ? 'lang="th"' : ''}>${esc(answer)}</span></div>`}
        <div class="fb-answer">${cfg.answer(current.item)}</div>
        <div class="actions"></div>`;
      fb.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', () => playItem(current.item)));
      const actions = fb.querySelector('.actions');
      actions.append(App.button('Next →', () => commit(), 'primary'));
      if (!res.ok) actions.append(App.button('I was right', () => commit(true)));
      if (!fresh) return;
      fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      // Chime first, then the word, unless the learner has already moved on.
      const shown = current;
      App.sfx(res.ok ? 'right' : 'wrong').then(() => { if (current === shown) playItem(shown.item); });
    }

    function gradeFor(res, override) {
      if (override) return current.hintsUsed ? 'hard' : 'good';
      if (!res.ok) return 'again';
      if (current.hintsUsed || res.how === 'romanized') return 'hard';
      return 'good';
    }

    function commit(override = false) {
      const g = gradeFor(current.result, override);
      if (!session.seen.has(current.id)) {
        session.seen.add(current.id);
        session.answered++;
        if (g !== 'again') session.firstTry++;
      }
      let requeue = null;
      if (session.practice) {
        if (g === 'again') requeue = 2;
      } else {
        const out = SRS.grade(current.card, g);
        requeue = out.requeue;
        stored.set(current.id, out.card);
        Store.saveCard(out.card);
        Store.logReview(current.id, g, current.answer);
      }
      if (requeue != null) session.queue.splice(Math.min(requeue, session.queue.length), 0, current.id);
      renderStats();
      next();
    }

    function renderDone() {
      current = null;
      App.remember('session', undefined); // a finished session isn't resumed; the next visit starts fresh
      const ids = allIds();
      const nd = SRS.nextDue(ids, stored);
      const unseen = ids.filter((id) => !stored.has(id)).length;
      const started = ids.filter((id) => stored.has(id)).length;
      cardEl.innerHTML = `
        <div class="qc-done">
          <div class="done-title">${session.answered ? 'Session complete 🎉' : 'All caught up'}</div>
          ${session.answered ? `<p>${session.firstTry} of ${session.answered} ${cfg.noun}s right first time</p>` : ''}
          <p class="muted">${nd ? `Next review ${SRS.describeDue(nd)}.` : unseen ? `No reviews due yet.` : ''}
            ${unseen ? `${unseen} ${cfg.noun}${unseen === 1 ? '' : 's'} not started.` : ''}</p>
          <div class="actions"></div>
        </div>`;
      const actions = cardEl.querySelector('.actions');
      if (unseen) actions.append(App.button(`Learn ${Math.min(newLimit, unseen)} new ${cfg.noun}s`, () => startSession(), 'primary'));
      if (started) actions.append(App.button('Practise all (schedule unchanged)', () => startSession({ practice: true })));
      renderList();
    }

    // ---------- Item list ----------
    function statusFor(id) {
      const c = stored.get(id);
      if (!c) return '<span class="st st-new">new</span>';
      if (c.state === 'learning') return '<span class="st st-learning">learning</span>';
      const strength = c.interval >= 21 ? 'strong' : c.interval >= 4 ? 'ok' : 'weak';
      return `<span class="st st-${strength}" title="interval ${Math.round(c.interval)} days">${SRS.describeDue(c.due)}</span>`;
    }

    listEl.open = App.recall('listOpen', false);
    listEl.addEventListener('toggle', () => App.remember('listOpen', listEl.open));

    function renderList() {
      listEl.querySelector('summary .count').textContent = items.length;
      const tbody = listEl.querySelector('tbody');
      tbody.innerHTML = items.map((i) => `
        <tr data-id="${i.id}">
          <td><button type="button" class="list-play" data-id="${i.id}" aria-label="Play ${esc(i.thai)}"><span lang="th">${i.thai}</span></button></td>
          <td class="muted">${i.rom}</td>
          <td>${esc(i.en[0])}</td>
          <td>${statusFor(cardId(i, 'te'))}</td>
          <td>${statusFor(cardId(i, 'et'))}</td>
        </tr>`).join('');
      tbody.querySelectorAll('.list-play').forEach((b) =>
        b.addEventListener('click', () => playItem(byId.get(b.dataset.id))));
      highlightReview();
    }

    // "#review=v-kin,v-chop" opens the list with those rows highlighted.
    function highlightReview() {
      const m = location.hash.match(/^#review=(.+)$/);
      const ids = m ? decodeURIComponent(m[1]).split(',') : [];
      const rows = [...listEl.querySelectorAll('tbody tr')];
      rows.forEach((r) => r.classList.toggle('review-hl', ids.includes(r.dataset.id)));
      const first = rows.find((r) => r.classList.contains('review-hl'));
      if (first) {
        listEl.open = true;
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    window.addEventListener('hashchange', highlightReview);

    // ---------- Backup ----------
    function setupBackup() {
      const msg = document.getElementById('backup-msg');
      const say = (t) => { msg.textContent = t; };
      if (!Store.persistent) say('⚠ This browser is blocking storage, so progress will be lost when you close the page. Use Export to keep it.');

      document.getElementById('export-btn').addEventListener('click', () => {
        const blob = new Blob([Store.exportBytes()], { type: 'application/x-sqlite3' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `thai-ipa-progress-${new Date().toISOString().slice(0, 10)}.sqlite`;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        say('Exported. Import this file on another device to continue there.');
      });

      const fileInput = document.getElementById('import-file');
      document.getElementById('import-btn').addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async () => {
        const f = fileInput.files[0];
        if (!f) return;
        try {
          await Store.importBytes(await f.arrayBuffer());
          stored = Store.getCards(`${kind}:`);
          say('Progress imported.');
          startSession();
        } catch (e) {
          say(e.message);
        }
        fileInput.value = '';
      });

      const resetBtn = document.getElementById('reset-btn');
      let armed = false;
      resetBtn.addEventListener('click', () => {
        if (!armed) {
          armed = true;
          resetBtn.textContent = `Tap again to erase ${cfg.noun} progress`;
          resetBtn.classList.add('danger');
          setTimeout(() => { armed = false; resetBtn.textContent = 'Reset progress'; resetBtn.classList.remove('danger'); }, 4000);
          return;
        }
        Store.reset(`${kind}:`);
        stored = new Map();
        armed = false;
        resetBtn.textContent = 'Reset progress';
        resetBtn.classList.remove('danger');
        say(`${cfg.noun[0].toUpperCase() + cfg.noun.slice(1)} progress reset.`);
        startSession();
      });
    }

    setupToolbar();
    setupBackup();
    if (!restoreSession()) startSession();
    App.restorePosition();
  }

  // Shared bits for page configs.
  const playBtn = '<button type="button" class="play-btn" data-play aria-label="Play audio">🔊</button>';

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Boots storage then the quiz, with a visible error if SQLite can't load.
  async function boot(cfg) {
    const cardEl = document.getElementById('quiz-card');
    try {
      await Store.open();
    } catch (e) {
      cardEl.innerHTML = `<p class="fb-note">Couldn't start the progress database (${esc(e.message)}). Try reloading the page.</p>`;
      return;
    }
    create(cfg);
  }

  return { boot, playBtn, shuffle, esc };
})();

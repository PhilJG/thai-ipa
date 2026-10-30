// Progress page: summary tiles, Leitner boxes, daily activity, upcoming reviews,
// weak spots and first-try accuracy, all read from the quiz database (cards + reviews).
(async () => {
  const out = document.getElementById('progress');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  try {
    await Store.open();
  } catch (e) {
    out.innerHTML = `<p class="fb-note">Couldn't open the progress database (${esc(e.message)}). Try reloading the page.</p>`;
    return;
  }

  const KINDS = {
    w: { label: 'Words', items: VOCAB, color: '--c-words' },
    s: { label: 'Sentences', items: SENTENCES, color: '--c-sentences' },
  };
  const DIR_LABEL = { te: 'Thai → Eng', et: 'Eng → Thai' };

  // "w:v-kin:te" -> { kind, item, dir }; cards for items no longer in the data are skipped.
  const items = new Map();
  for (const [kind, k] of Object.entries(KINDS)) for (const item of k.items) items.set(`${kind}:${item.id}`, { kind, item });
  const parse = (id) => {
    const m = id.match(/^(.+):(te|et)$/);
    const found = m && items.get(m[1]);
    return found ? { ...found, dir: m[2] } : null;
  };

  const cards = [...Store.getCards('').values()].filter((c) => parse(c.id));
  const reviews = Store.reviews().filter((r) => parse(r.card_id));
  const now = Date.now();

  // ---------- Days (local midnight, safe across daylight-saving changes) ----------
  const dayStart = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const addDays = (ts, n) => { const d = new Date(ts); d.setDate(d.getDate() + n); return d.getTime(); };
  const today = dayStart(now);
  const dayLabel = (ts) => new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const weekday = (ts) => new Date(ts).toLocaleDateString(undefined, { weekday: 'short' });

  const byDay = new Map(); // day -> reviews
  for (const r of reviews) {
    const d = dayStart(r.ts);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d).push(r);
  }

  // ---------- Summary ----------
  const total = Object.values(KINDS).reduce((t, k) => t + k.items.length * 2, 0);
  const learned = cards.filter((c) => c.state === 'review').length;
  const learning = cards.length - learned;
  let streak = 0;
  for (let d = byDay.has(today) ? today : addDays(today, -1); byDay.has(d); d = addDays(d, -1)) streak++;

  const tile = (num, label) => `<div class="stat"><span class="stat-num">${num}</span><span class="stat-label">${label}</span></div>`;
  out.innerHTML = `
    ${reviews.length ? '' : `<p class="hint">No answers yet. Do a session on <a href="words.html">Words</a> or
      <a href="sentences.html">Sentences</a> and your charts fill in here.</p>`}
    <div class="quiz-stats progress-stats">
      ${tile(`${learned}<small>/${total}</small>`, 'learned')}
      ${tile(learning, 'learning')}
      ${tile(total - cards.length, 'not started')}
      ${tile(`${streak}<small> day${streak === 1 ? '' : 's'}</small>`, 'streak')}
    </div>
    <div id="charts"></div>
    <section class="weak">
      <h2>Weak spots</h2>
      <p class="hint">The cards you've got wrong most often.</p>
      <div id="weak-list"></div>
    </section>`;
  const charts = document.getElementById('charts');
  const add = (fig) => charts.append(fig);

  // ---------- Leitner boxes ----------
  const BOXES = [1, 2, 4, 8, 16];
  const boxIndex = (interval) => {
    const b = interval >= 1 ? 2 ** Math.floor(Math.log2(interval)) : 1;
    return Math.min(BOXES.indexOf(Math.min(b, 16)), BOXES.length - 1);
  };
  const boxCounts = Object.fromEntries(Object.keys(KINDS).map((k) => [k, BOXES.map(() => 0)]));
  for (const c of cards) boxCounts[parse(c.id).kind][boxIndex(c.interval)]++;
  add(Charts.bars({
    title: 'Cards in each box (days until they come back)',
    categories: BOXES.map((b, i) => (i === BOXES.length - 1 ? `${b}+ days` : `${b} day${b === 1 ? '' : 's'}`)),
    series: Object.entries(KINDS).map(([k, v]) => ({ label: v.label, color: v.color, values: boxCounts[k] })),
  }));

  // ---------- Daily activity, last 30 days ----------
  const days30 = Array.from({ length: 30 }, (_, i) => addDays(today, i - 29));
  const gradeCount = (g) => days30.map((d) => (byDay.get(d) || []).filter((r) => r.grade === g).length);
  add(Charts.bars({
    title: 'Answers per day, last 30 days',
    categories: days30.map(dayLabel),
    series: [
      { label: 'Right', color: '--c-right', values: gradeCount('good') },
      { label: 'Right with a hint', color: '--c-hint', values: gradeCount('hard') },
      { label: 'Wrong', color: '--c-wrong', values: gradeCount('again') },
    ],
    stacked: true,
    labelEvery: 7,
  }));

  // ---------- Upcoming reviews, next 7 days (today includes anything overdue) ----------
  const days7 = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const dueOn = (k) => days7.map((d, i) => cards.filter((c) => parse(c.id).kind === k
    && c.due < addDays(d, 1) && (i === 0 || c.due >= d)).length);
  add(Charts.bars({
    title: 'Reviews coming up',
    categories: days7.map((d, i) => (i === 0 ? 'Today' : weekday(d))),
    series: Object.entries(KINDS).map(([k, v]) => ({ label: v.label, color: v.color, values: dueOn(k) })),
    stacked: true,
    totals: true,
  }));

  // ---------- First-try accuracy, last 8 weeks ----------
  // A card's first answer each day counts; the repeats after a wrong answer don't.
  const weeks = Array.from({ length: 8 }, (_, i) => addDays(today, (i - 7) * 7 - 6));
  const firsts = new Map(); // `${day}|${card}` -> grade
  for (const r of reviews) {
    const key = `${dayStart(r.ts)}|${r.card_id}`;
    if (!firsts.has(key)) firsts.set(key, r.grade);
  }
  const weekStats = weeks.map(() => ({ right: 0, all: 0 }));
  for (const [key, g] of firsts) {
    const d = Number(key.split('|')[0]);
    const w = weeks.findIndex((start, i) => d >= start && d < (weeks[i + 1] || addDays(today, 1)));
    if (w < 0) continue;
    weekStats[w].all++;
    if (g !== 'again') weekStats[w].right++;
  }
  add(Charts.line({
    title: 'Right first time, by week',
    label: 'Right first time',
    categories: weeks.map(dayLabel),
    values: weekStats.map((s) => (s.all ? Math.round((s.right / s.all) * 100) : null)),
    format: (v) => `${v}%`,
  }));

  // ---------- Weak spots ----------
  const wrong = new Map();
  for (const r of reviews) if (r.grade === 'again') wrong.set(r.card_id, (wrong.get(r.card_id) || 0) + 1);
  const weak = cards
    .map((c) => ({ c, misses: wrong.get(c.id) || 0 }))
    .filter((w) => w.misses || w.c.lapses)
    .sort((a, b) => b.misses - a.misses || b.c.lapses - a.c.lapses || a.c.interval - b.c.interval)
    .slice(0, 8);
  const weakEl = document.getElementById('weak-list');
  if (!weak.length) {
    weakEl.innerHTML = '<p class="muted">Nothing yet. Cards you miss will show up here.</p>';
  } else {
    weakEl.innerHTML = `<div class="table-scroll"><table class="weak-table">
      <thead><tr><th>Thai</th><th>English</th><th>Card</th><th>Wrong</th><th>Next</th></tr></thead>
      <tbody>${weak.map(({ c, misses }) => {
        const { kind, item, dir } = parse(c.id);
        return `<tr>
          <td class="w-thai"><button type="button" class="list-play" data-key="${kind}:${item.id}" aria-label="Play ${esc(item.thai)}"><span lang="th">${item.thai}</span></button>
            <div class="muted weak-rom">${item.rom}</div></td>
          <td class="w-en">${esc(item.en[0])}</td>
          <td class="w-card muted">${KINDS[kind].label.slice(0, -1)} · ${DIR_LABEL[dir]}</td>
          <td class="w-wrong">${misses}×</td>
          <td class="w-next muted">${SRS.describeDue(c.due, now)}</td></tr>`;
      }).join('')}</tbody></table></div>`;
    weakEl.querySelectorAll('.list-play').forEach((b) => b.addEventListener('click', () => {
      const { item } = items.get(b.dataset.key);
      App.playFile(item.id, item.thai, null);
    }));
  }

  App.restorePosition();
})();

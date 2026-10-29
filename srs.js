// Spaced-repetition scheduling: Leitner boxes counted in days (as in Gabriel Wyner's Fluent Forever).
//
// A card the learner has never seen is "new" and has no row in the database. Its `interval` is its
// box in days: 1, 2, 4, 8, 16… Right without help moves it up a box (double the wait), right with a
// hint keeps it in the same box, wrong sends it back to box 1. Boxes count in 24-hour cycles from the
// moment you answered: right at 1pm in box 1 means due again at 1pm tomorrow.
// A box-1 card is "learning"; from box 2 on it counts as learned ("review").
const SRS = (() => {
  const DAY = 24 * 60 * 60 * 1000;
  // A card answered wrong comes back this many cards later, at most MAX_REQUEUES times a session.
  const REQUEUE_GAP = 3, MAX_REQUEUES = 3;

  function newCard(id) {
    return { id, state: 'new', ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0, last: 0 };
  }

  // Cards scheduled by the old SM-2 code can have any interval; snap down to a box.
  const boxOf = (interval) => (interval >= 1 ? 2 ** Math.floor(Math.log2(interval)) : 0);

  // grade: 'again' (wrong), 'hard' (right with a hint / romanized), 'good' (right unaided).
  // Returns the updated card and, if it should come back this session, how many cards later.
  function grade(card, g, now = Date.now()) {
    const c = { ...card, reps: card.reps + 1, last: now };
    const box = boxOf(c.interval);
    let requeue = null;
    if (g === 'good') c.interval = box ? box * 2 : 1;
    else if (g === 'hard') c.interval = box || 1;
    else {
      if (card.state !== 'new') c.lapses += 1;
      c.interval = 1;
      requeue = REQUEUE_GAP;
    }
    c.state = c.interval >= 2 ? 'review' : 'learning';
    c.due = now + c.interval * DAY;
    return { card: c, requeue };
  }

  // Builds a session: due cards (shuffled), plus up to `newLimit` unseen cards mixed in.
  // `siblingOf(id)` gives the other direction of the same item. Only one direction of an item
  // goes into a session, and not if the other was answered in the last 24 hours, so one can't
  // give away the other.
  function buildSession(ids, stored, newLimit, siblingOf, now = Date.now()) {
    const recent = now - DAY;
    const taken = new Set();
    const free = (id) => {
      const sib = siblingOf(id);
      const s = stored.get(sib);
      return !taken.has(sib) && !(s && s.last > recent);
    };
    const due = [];
    const fresh = [];
    for (const id of shuffle(ids)) {
      const c = stored.get(id);
      if (c && c.due <= now && free(id)) { due.push(id); taken.add(id); }
    }
    // New cards keep the data's order (easier material comes first).
    for (const id of ids) {
      if (fresh.length >= newLimit) break;
      if (!stored.has(id) && free(id)) { fresh.push(id); taken.add(id); }
    }
    // Spread new cards through the reviews so a session isn't all-new at the end.
    const queue = [];
    const gap = fresh.length ? Math.max(1, Math.floor(due.length / fresh.length)) : 0;
    let n = 0;
    due.forEach((id, i) => {
      queue.push(id);
      if (gap && (i + 1) % gap === 0 && n < fresh.length) queue.push(fresh[n++]);
    });
    while (n < fresh.length) queue.push(fresh[n++]);
    return { queue, dueCount: due.length, newCount: fresh.length };
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function nextDue(ids, stored, now = Date.now()) {
    let min = Infinity;
    for (const id of ids) {
      const c = stored.get(id);
      if (c && c.due > now) min = Math.min(min, c.due);
    }
    return min === Infinity ? null : min;
  }

  function describeDue(due, now = Date.now()) {
    const ms = due - now;
    if (ms <= 0) return 'due now';
    const mins = Math.round(ms / 60000);
    if (mins < 60) return `in ${mins} min`;
    const hours = Math.round(ms / 3600000);
    if (hours < 24) return `in ${hours} h`;
    const days = Math.round(ms / DAY);
    return `in ${days} day${days === 1 ? '' : 's'}`;
  }

  return { newCard, grade, buildSession, nextDue, describeDue, DAY, MAX_REQUEUES };
})();

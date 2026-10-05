// Spaced-repetition scheduling (a small SM-2 variant).
//
// A card the learner has never seen is "new" and has no row in the database.
// New cards are first shown with the answer, then must be recalled within the session
// ("learning") before graduating to "review", where intervals grow by the ease factor.
const SRS = (() => {
  const DAY = 24 * 60 * 60 * 1000;
  const MIN_EASE = 1.3, MAX_EASE = 3.0;

  function newCard(id) {
    return { id, state: 'new', ease: 2.5, interval: 0, due: 0, reps: 0, lapses: 0, last: 0 };
  }

  // grade: 'again' (wrong), 'hard' (right with a hint / loose match), 'good' (right).
  // Returns the updated card and, if it should come back this session, how many cards later.
  function grade(card, g, now = Date.now()) {
    const c = { ...card, reps: card.reps + 1, last: now };
    let requeue = null;

    if (c.state === 'new') {
      // First exposure: the answer was shown, so just move it into learning.
      c.state = 'learning';
      c.due = now;
      requeue = g === 'again' ? 2 : 3;
    } else if (c.state === 'learning') {
      if (g === 'good') {
        c.state = 'review';
        c.interval = Math.max(1, c.interval);
        c.due = now + c.interval * DAY;
      } else {
        c.due = now;
        requeue = g === 'again' ? 2 : 4;
      }
    } else {
      if (g === 'good') {
        c.interval = Math.max(c.interval + 1, Math.round(c.interval * c.ease));
        c.ease = Math.min(MAX_EASE, c.ease + 0.05);
        c.due = now + c.interval * DAY;
      } else if (g === 'hard') {
        c.interval = Math.max(1, Math.round(c.interval * 1.2));
        c.ease = Math.max(MIN_EASE, c.ease - 0.15);
        c.due = now + c.interval * DAY;
      } else {
        c.lapses += 1;
        c.ease = Math.max(MIN_EASE, c.ease - 0.2);
        c.interval = 1;
        c.state = 'learning';
        c.due = now;
        requeue = 2;
      }
    }
    return { card: c, requeue };
  }

  // Builds a session: every due card, plus up to `newLimit` unseen cards mixed in.
  function buildSession(ids, stored, newLimit, now = Date.now()) {
    const due = [];
    const fresh = [];
    for (const id of ids) {
      const c = stored.get(id);
      if (!c) fresh.push(id);
      else if (c.due <= now) due.push(c);
    }
    due.sort((a, b) => a.due - b.due);
    const dueIds = due.map((c) => c.id);
    const newIds = fresh.slice(0, newLimit);
    // Spread new cards through the reviews so a session isn't all-new at the end.
    const queue = [];
    const gap = newIds.length ? Math.max(1, Math.floor(dueIds.length / newIds.length)) : 0;
    let n = 0;
    dueIds.forEach((id, i) => {
      queue.push(id);
      if (gap && (i + 1) % gap === 0 && n < newIds.length) queue.push(newIds[n++]);
    });
    while (n < newIds.length) queue.push(newIds[n++]);
    return { queue, dueCount: dueIds.length, newCount: newIds.length, unseen: fresh.length };
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

  return { newCard, grade, buildSession, nextDue, describeDue, DAY };
})();

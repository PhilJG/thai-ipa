// Progress storage: a real SQLite database (sql.js / WebAssembly) kept in the browser.
// The database file is persisted to IndexedDB after every change, so progress survives
// closing the tab. Export/import moves the .sqlite file between devices.
const Store = (() => {
  const IDB_NAME = 'thai-ipa';
  const IDB_STORE = 'files';
  const DB_KEY = 'progress.sqlite';

  let db = null;
  let persistent = true;
  let saveTimer = null;

  // ---------- IndexedDB (holds the raw .sqlite bytes) ----------
  function idb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbGet(key) {
    const conn = await idb();
    return new Promise((resolve, reject) => {
      const req = conn.transaction(IDB_STORE).objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbPut(key, value) {
    const conn = await idb();
    return new Promise((resolve, reject) => {
      const tx = conn.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  // ---------- Schema ----------
  const SCHEMA = `
    CREATE TABLE IF NOT EXISTS cards (
      id       TEXT PRIMARY KEY,   -- "<kind>:<item id>:<direction>", e.g. "w:v-kin:te"
      state    TEXT NOT NULL,      -- learning | review
      ease     REAL NOT NULL,
      interval REAL NOT NULL,      -- days
      due      INTEGER NOT NULL,   -- ms since epoch
      reps     INTEGER NOT NULL,
      lapses   INTEGER NOT NULL,
      last     INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id TEXT NOT NULL,
      ts      INTEGER NOT NULL,
      grade   TEXT NOT NULL,       -- again | hard | good
      answer  TEXT
    );
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
  `;

  function hasSchema(candidate) {
    const r = candidate.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='cards'");
    return r.length > 0;
  }

  let SQL = null;

  async function open() {
    SQL = await initSqlJs({ locateFile: (f) => `lib/${f}` });
    let bytes = null;
    try {
      bytes = await idbGet(DB_KEY);
    } catch (e) {
      persistent = false; // private mode / storage blocked: still works, just not saved
    }
    db = bytes ? new SQL.Database(new Uint8Array(bytes)) : new SQL.Database();
    db.exec(SCHEMA);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
    return { persistent };
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 250);
  }

  async function flush() {
    clearTimeout(saveTimer);
    if (!persistent || !db) return;
    try {
      await idbPut(DB_KEY, db.export());
    } catch (e) {
      persistent = false;
    }
  }

  // ---------- Queries ----------
  function all(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }

  function run(sql, params = []) {
    db.run(sql, params);
    scheduleSave();
  }

  function getCards(prefix) {
    const map = new Map();
    for (const row of all('SELECT * FROM cards WHERE id LIKE ?', [`${prefix}%`])) map.set(row.id, row);
    return map;
  }

  function saveCard(c) {
    run(`INSERT INTO cards (id, state, ease, interval, due, reps, lapses, last)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET state=excluded.state, ease=excluded.ease,
           interval=excluded.interval, due=excluded.due, reps=excluded.reps,
           lapses=excluded.lapses, last=excluded.last`,
    [c.id, c.state, c.ease, c.interval, c.due, c.reps, c.lapses, c.last]);
  }

  function logReview(cardId, grade, answer) {
    run('INSERT INTO reviews (card_id, ts, grade, answer) VALUES (?, ?, ?, ?)',
      [cardId, Date.now(), grade, answer]);
  }

  function getMeta(key, fallback) {
    const r = all('SELECT value FROM meta WHERE key = ?', [key]);
    return r.length ? JSON.parse(r[0].value) : fallback;
  }

  function setMeta(key, value) {
    run('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
      [key, JSON.stringify(value)]);
  }

  // Removes progress for one kind of card (e.g. "w:" words) or everything.
  function reset(prefix = '') {
    run('DELETE FROM cards WHERE id LIKE ?', [`${prefix}%`]);
    run('DELETE FROM reviews WHERE card_id LIKE ?', [`${prefix}%`]);
  }

  function exportBytes() { return db.export(); }

  async function importBytes(bytes) {
    const candidate = new SQL.Database(new Uint8Array(bytes));
    if (!hasSchema(candidate)) {
      candidate.close();
      throw new Error('That file is not a Thai IPA progress file.');
    }
    db.close();
    db = candidate;
    db.exec(SCHEMA);
    await flush();
  }

  return { open, flush, getCards, saveCard, logReview, getMeta, setMeta, reset, exportBytes, importBytes,
    get persistent() { return persistent; } };
})();

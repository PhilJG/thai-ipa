// Shared by every page: audio playback, tap-to-select registry, theme and Thai font pickers,
// and the remembered position (scroll, selection, quiz session) for each page.
const App = (() => {
  const root = document.documentElement;
  const slow = document.getElementById('slow');

  // ---------- Remembered position ----------
  // Each page keeps a small state object in localStorage, so switching tabs and coming
  // back lands where you left off instead of at the top of a fresh page.
  const pageKey = `pos:${location.pathname.split('/').pop() || 'index.html'}`;
  let pageState = {};
  try { pageState = JSON.parse(localStorage.getItem(pageKey)) || {}; } catch (e) {}

  function remember(key, value) {
    if (value === undefined) delete pageState[key];
    else pageState[key] = value;
    try { localStorage.setItem(pageKey, JSON.stringify(pageState)); } catch (e) {}
  }
  const recall = (key, fallback) => (key in pageState ? pageState[key] : fallback);

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  let scrollTimer = null;
  let scrollReady = false; // don't record the top-of-page position before it's been restored
  addEventListener('scroll', () => {
    if (!scrollReady) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => remember('scroll', Math.round(scrollY)), 150);
  }, { passive: true });
  addEventListener('pagehide', () => { if (scrollReady) remember('scroll', Math.round(scrollY)); });

  // Called by each page once its content is drawn. A #hash link wins over the saved spot.
  function restorePosition() {
    const id = recall('selected', null);
    if (id && registry.has(id)) select(id, { play: false });
    const y = recall('scroll', 0);
    if (y && !location.hash) scrollTo(0, y);
    scrollReady = true;
  }

  // ---------- Selection registry ----------
  // id -> { data, els: [] }. Every on-screen element for the same sound shares an id,
  // so selection and "playing" highlights stay in sync.
  const registry = new Map();
  let selectedId = null;
  let selectHandler = () => {};

  function register(id, data, el) {
    if (!registry.has(id)) registry.set(id, { data, els: [] });
    registry.get(id).els.push(el);
  }

  function onSelect(fn) { selectHandler = fn; }

  function select(id, opts = {}) {
    if (selectedId) registry.get(selectedId).els.forEach((el) => el.classList.remove('selected'));
    selectedId = id;
    remember('selected', id);
    const entry = registry.get(id);
    entry.els.forEach((el) => el.classList.add('selected'));
    selectHandler(entry.data, opts);
  }

  function setPlaying(id, on) {
    const entry = registry.get(id);
    if (entry) entry.els.forEach((el) => el.classList.toggle('playing', on));
  }

  // ---------- Audio ----------
  const audioCache = new Map();
  let current = null;

  function stopCurrent() {
    if (current) {
      current.audio.pause();
      current.audio.currentTime = 0;
      current.done();
    }
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  function speakFallback(text) {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'th-TH';
      u.rate = slow && slow.checked ? 0.6 : 0.9;
      u.onend = u.onerror = resolve;
      speechSynthesis.speak(u);
    });
  }

  // Bumped on every new playback request so a running sequence knows to stop.
  let playToken = 0;

  // Plays audio/<file>.mp3; falls back to the device's Thai voice if the file fails.
  // `id` is the registry id to pulse while playing.
  function playFile(file, fallbackText, id) {
    playToken++;
    return playOne(file, fallbackText, id);
  }

  function playOne(file, fallbackText, id) {
    stopCurrent();
    let audio = audioCache.get(file);
    if (!audio) {
      audio = new Audio(`audio/${file}.mp3`);
      audio.preload = 'auto';
      audioCache.set(file, audio);
    }
    audio.playbackRate = slow && slow.checked ? 0.65 : 1;
    audio.preservesPitch = true;
    setPlaying(id, true);
    return new Promise((resolve) => {
      const done = () => {
        audio.onended = audio.onerror = null;
        if (current && current.audio === audio) current = null;
        setPlaying(id, false);
        resolve();
      };
      current = { audio, done };
      audio.onended = done;
      audio.onerror = () => { done(); speakFallback(fallbackText); };
      audio.play().catch(() => { done(); speakFallback(fallbackText); });
    });
  }

  const pause = (ms) => new Promise((r) => setTimeout(r, ms));

  // Plays [file, fallbackText, id] steps back to back; any other playback cancels it.
  async function playSequence(steps, gap = 350) {
    const token = ++playToken;
    for (let i = 0; i < steps.length; i++) {
      if (i) await pause(gap);
      if (token !== playToken) return;
      await playOne(...steps[i]);
    }
  }

  // ---------- Sound effects ----------
  // Short synthesized chimes for right / wrong answers (Web Audio, so there are no files to load).
  // [frequency Hz, start s, length s] per note.
  const SFX = {
    right: { wave: 'sine', notes: [[659.25, 0, 0.14], [987.77, 0.09, 0.32]] }, // E5 -> B5, rising
    wrong: { wave: 'triangle', notes: [[233.08, 0, 0.16], [185, 0.13, 0.34]] }, // B♭3 -> F♯3, falling
  };
  const sfxToggle = document.getElementById('sfx');
  let sfxOn = true;
  try { sfxOn = localStorage.getItem('sfx') !== 'off'; } catch (e) {}
  if (sfxToggle) {
    sfxToggle.checked = sfxOn;
    sfxToggle.addEventListener('change', () => {
      sfxOn = sfxToggle.checked;
      try { localStorage.setItem('sfx', sfxOn ? 'on' : 'off'); } catch (e) {}
    });
  }
  let audioCtx = null;

  // Resolves when the effect has finished, so speech can follow without overlapping it.
  function sfx(kind) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!sfxOn || !Ctx) return Promise.resolve();
    audioCtx = audioCtx || new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const { wave, notes } = SFX[kind];
    const t0 = audioCtx.currentTime + 0.02;
    let end = 0;
    for (const [freq, start, len] of notes) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = wave;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t0 + start);
      gain.gain.exponentialRampToValueAtTime(0.22, t0 + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + start + len);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0 + start);
      osc.stop(t0 + start + len + 0.02);
      end = Math.max(end, start + len);
    }
    return new Promise((resolve) => setTimeout(resolve, end * 1000 + 80));
  }

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

  function button(html, onClick, cls = '') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.innerHTML = html;
    b.addEventListener('click', onClick);
    return b;
  }

  // ---------- Theme ----------
  const themeBtn = document.getElementById('theme-toggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);

  function syncThemeUI() {
    const dark = isDark();
    themeBtn.textContent = dark ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    const color = getComputedStyle(root).getPropertyValue('--bg').trim();
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', color));
  }

  themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeUI();
  });
  systemDark.addEventListener('change', syncThemeUI);
  syncThemeUI();

  // ---------- Thai font ----------
  const fontButtons = document.querySelectorAll('.font-picker [data-font]');

  function syncFontUI() {
    const current = root.dataset.thaiFont || 'looped';
    fontButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.font === current)));
  }

  fontButtons.forEach((b) => b.addEventListener('click', () => {
    root.dataset.thaiFont = b.dataset.font;
    try { localStorage.setItem('thaiFont', b.dataset.font); } catch (e) {}
    syncFontUI();
  }));
  syncFontUI();

  return { register, onSelect, select, playFile, playSequence, button, toneIcon, sfx, remember, recall, restorePosition };
})();

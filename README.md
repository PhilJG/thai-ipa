# Thai IPA Charts

Interactive charts for learning Thai pronunciation, with audio.

- **Vowels** (`index.html`): IPA vowel trapezoid. Tap a vowel to hear it, see its Thai
  spelling, IPA and an example word. Short vowels are outlined in blue, long filled in orange.
- **Consonants** (`consonants.html`): all 44 letters grouped by class (middle / high / low)
  with initial and final sounds, plus the tone-rules table with every syllable playable.
- **Words** (`words.html`): spaced-repetition quiz over the workbook vocabulary, typed answers
  in both directions (Thai → English, English → Thai).
- **Sentences** (`sentences.html`): translate the workbook sentences both ways, with hints
  (word bank, word-by-word gloss, pronunciation, audio).

Quiz progress lives in a SQLite database in the browser (sql.js, persisted to IndexedDB),
so it survives closing the page. Export/import moves the `.sqlite` file between devices.

Live at: https://philjg.github.io/thai-ipa/

## Files
- `index.html` + `vowels.js`, `consonants.html` + `consonants.js` – the two pages (no build step)
- `words.html` + `words.js`, `sentences.html` + `sentences.js` – the quiz pages
- `common.js` – shared audio playback, selection, theme and Thai font pickers
- `quiz.js` – shared quiz UI; `srs.js` – spaced-repetition scheduling;
  `check.js` – answer checking; `store.js` – SQLite storage
- `lib/` – vendored sql.js (SQLite compiled to WebAssembly, MIT licence)
- `styles.css` – all styles
- `data.js` – vowel inventory; `consonants-data.js` – consonants and tone rules;
  `vocab-data.js` – workbook vocabulary and sentences
- `audio/` – one mp3 per vowel (`<id>.mp3`) and per example word (`<id>-ex.mp3`)
- `tools/generate_audio.py` – regenerates audio from the data files using Google TTS

## Regenerating audio
```sh
python3 -m venv .venv && .venv/bin/pip install gtts
.venv/bin/python tools/generate_audio.py          # only missing files
.venv/bin/python tools/generate_audio.py --force  # everything
```

## Run locally
```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

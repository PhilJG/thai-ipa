# Thai IPA Charts

Interactive charts for learning Thai pronunciation, with audio.

- **Vowels** (`index.html`): Stuart Jay Raj's vowel compass (back / top / front / lips rows;
  raised-tongue short, long, stretchy and shrinky vowels; lowered-tongue short and long; schwa),
  then the IPA vowel trapezoid. Tap a vowel to hear it and see its Thai spelling, IPA, an example
  word and a mouth diagram of where the tongue goes. Short vowels are outlined in blue, long filled in orange.
- **Consonants** (`consonants.html`): Stuart Jay Raj's consonant compass (place of articulation ×
  type, coloured by where Thai says each letter today) with a high / mid / low class highlight, or
  the letters grouped by class, plus the tone-rules table with every syllable playable.
  Tapping a letter shows a mouth diagram, its keyword with a picture, and a shape memory aid you
  can rewrite (saved on the device).
- **Tones** (`tones.html`): the five tones as pitch contours with their Thai names, words that
  differ only in tone, and the four tone marks with the tone each gives per consonant class.
- **Words** (`words.html`): spaced-repetition quiz over the workbook vocabulary, numbers 1–10 and everyday verbs; typed answers
  in both directions (Thai → English, English → Thai). A bell marks right answers and a buzzer
  wrong ones (switch off with "Sound effects").
- **Sentences** (`sentences.html`): translate the workbook and everyday-verb sentences both ways, with hints
  (word bank, word-by-word gloss, pronunciation, audio).
- **Progress** (`progress.html`): charts of your quiz progress: learned / learning / not started
  and your daily streak, cards per Leitner box, answers per day (right / with a hint / wrong),
  reviews coming up over the next week, first-try accuracy by week, and your weak spots.
  Hover or tap a bar for its numbers; each chart has a "Show as table" view.

On phones, "Menu button on phones" (in any page's footer) folds the tabs into a ☰ menu.

Quiz progress lives in a SQLite database in the browser (sql.js, persisted to IndexedDB),
so it survives closing the page. Export/import moves the `.sqlite` file between devices.
The app asks the browser for persistent storage, and the quiz pages show when progress was last
exported, nudging after 7 days (and suggesting Add to Home Screen, which stops iOS Safari's
7-day storage wipe).
Each page also remembers where you were (scroll position, selected sound, the card you're on
and what you've typed) in `localStorage`, so switching tabs doesn't lose your place.

Live at: https://philjg.github.io/thai-ipa/

## Files
- `index.html` + `vowels.js`, `consonants.html` + `consonants.js`, `tones.html` + `tones.js` – the chart pages (no build step)
- `words.html` + `words.js`, `sentences.html` + `sentences.js` – the quiz pages
- `progress.html` + `progress.js` – the Progress page; `charts.js` – its small SVG charts
- `common.js` – shared audio playback, selection, menu button, theme and Thai font pickers
- `mouth.js` – the mouth / tongue position diagrams (SVG)
- `quiz.js` – shared quiz UI; `srs.js` – spaced-repetition scheduling;
  `check.js` – answer checking; `store.js` – SQLite storage
- `lib/` – vendored sql.js (SQLite compiled to WebAssembly, MIT licence)
- `styles.css` – all styles
- `data.js` – vowel inventory and vowel compass; `consonants-data.js` – consonants, tone rules,
  compass layout and keyword pictures / memory aids;
  `tones-data.js` – tone names, tone marks and minimal sets;
  `vocab-data.js` – vocabulary and sentences
- `audio/` – one mp3 per vowel (`<id>.mp3`) and per example word (`<id>-ex.mp3`)
- `tools/generate_audio.py` – regenerates audio from the data files using Google TTS
- `tools/generate_sfx.py` – synthesizes the bell and buzzer (`audio/sfx-*.wav`), standard library only

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

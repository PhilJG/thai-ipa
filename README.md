# Thai IPA Charts

Interactive charts for learning Thai pronunciation, with audio.

- **Vowels** (`index.html`): IPA vowel trapezoid. Tap a vowel to hear it, see its Thai
  spelling, IPA and an example word. Short vowels are outlined in blue, long filled in orange.
- **Consonants** (`consonants.html`): all 44 letters grouped by class (middle / high / low)
  with initial and final sounds, plus the tone-rules table with every syllable playable.

Live at: https://philjg.github.io/thai-ipa/

## Files
- `index.html` + `vowels.js`, `consonants.html` + `consonants.js` – the two pages (no build step)
- `common.js` – shared audio playback, selection, theme and Thai font pickers
- `styles.css` – all styles
- `data.js` – vowel inventory; `consonants-data.js` – consonants and tone rules
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

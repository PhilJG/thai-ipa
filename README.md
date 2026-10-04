# Thai Vowel Chart

Interactive IPA vowel chart for Thai. Tap a vowel to hear it, see its Thai spelling,
IPA, and an example word. Short vowels are outlined in blue, long vowels filled in orange.

Live at: https://philjg.github.io/thai-ipa/

## Files
- `index.html`, `styles.css`, `app.js` – the app (no build step)
- `data.js` – the vowel inventory (IPA, Thai spelling, example words)
- `audio/` – one mp3 per vowel (`<id>.mp3`) and per example word (`<id>-ex.mp3`)
- `tools/generate_audio.py` – regenerates audio from `data.js` using Google TTS

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

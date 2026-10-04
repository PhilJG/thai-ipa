"""Generate audio/<id>.mp3 and audio/<id>-ex.mp3 for every sound in data.js.

Usage:
    python -m venv .venv && .venv/bin/pip install gtts
    .venv/bin/python tools/generate_audio.py [--force]
"""
import pathlib
import re
import sys

from gtts import gTTS

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
LINE = re.compile(r"id: '([\w-]+)'.*?thai: '([^']+)'.*?ex: (?:null|\{ thai: '([^']+)')")


def save(text, path, force):
    if path.exists() and not force:
        return
    gTTS(text, lang="th").save(str(path))
    print("wrote", path.relative_to(ROOT), text)


def main():
    force = "--force" in sys.argv
    AUDIO.mkdir(exist_ok=True)
    for line in (ROOT / "data.js").read_text(encoding="utf-8").splitlines():
        m = LINE.search(line)
        if not m:
            continue
        sound_id, thai, example = m.groups()
        save(thai, AUDIO / f"{sound_id}.mp3", force)
        if example:
            save(example, AUDIO / f"{sound_id}-ex.mp3", force)


if __name__ == "__main__":
    main()

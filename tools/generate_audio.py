"""Generate audio for every sound in the data files.

Each line with an `id:` gets audio/<id>.mp3, spoken from its `say:` text if present,
otherwise its `thai:` text. An `ex: { thai: ... }` example word also gets audio/<id>-ex.mp3.

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
DATA_FILES = ["data.js", "consonants-data.js", "tones-data.js", "vocab-data.js"]

ID = re.compile(r"\bid: '([\w-]+)'")
THAI = re.compile(r"\bthai: '([^']+)'")
SAY = re.compile(r"\bsay: '([^']+)'")
EXAMPLE = re.compile(r"\bex: \{ thai: '([^']+)'")


def save(text, path, force):
    if path.exists() and path.stat().st_size and not force:
        return
    tmp = path.with_suffix(".tmp")
    gTTS(text, lang="th").save(str(tmp))  # write then rename so a failure never leaves a stub
    tmp.replace(path)
    print("wrote", path.relative_to(ROOT), text)


def main():
    force = "--force" in sys.argv
    AUDIO.mkdir(exist_ok=True)
    for name in DATA_FILES:
        for line in (ROOT / name).read_text(encoding="utf-8").splitlines():
            sound_id = ID.search(line)
            if not sound_id:
                continue
            sound_id = sound_id.group(1)
            say = SAY.search(line) or THAI.search(line)
            save(say.group(1), AUDIO / f"{sound_id}.mp3", force)
            example = EXAMPLE.search(line)
            if example:
                save(example.group(1), AUDIO / f"{sound_id}-ex.mp3", force)


if __name__ == "__main__":
    main()

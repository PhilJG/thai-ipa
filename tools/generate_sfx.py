"""Synthesize the quiz sound effects: a bell for right answers and a buzzer for wrong ones.

Writes audio/sfx-right.wav and audio/sfx-wrong.wav. Standard library only.

Usage:
    python3 tools/generate_sfx.py
"""
import math
import pathlib
import struct
import wave

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIO = ROOT / "audio"
RATE = 22050


def bell(freq, length):
    """One bell strike: inharmonic partials, the higher ones dying away faster."""
    partials = [(1.0, 1.0, 1.6), (2.0, 0.6, 2.8), (2.76, 0.35, 4.5), (5.4, 0.2, 8.0)]  # ratio, level, decay
    out = []
    for n in range(int(length * RATE)):
        t = n / RATE
        attack = min(1.0, t / 0.003)
        out.append(attack * sum(a * math.exp(-d * t) * math.sin(2 * math.pi * freq * r * t) for r, a, d in partials))
    return out


def buzz(length):
    """A harsh game-show buzz: two detuned sawtooths, clipped, with short fades."""
    out = []
    n_total = int(length * RATE)
    fade = int(0.012 * RATE)
    for n in range(n_total):
        t = n / RATE
        saw = sum(2 * ((f * t) % 1.0) - 1 for f in (138.0, 146.0))
        env = min(1.0, n / fade, (n_total - n) / fade)
        out.append(env * math.tanh(2.5 * saw))
    # one-pole low-pass to take the fizz off the top
    y, k = 0.0, 0.35
    for i, x in enumerate(out):
        y += k * (x - y)
        out[i] = y
    return out


def mix(parts, length):
    """parts: [(start seconds, samples)] -> one track."""
    track = [0.0] * int(length * RATE)
    for start, samples in parts:
        s = int(start * RATE)
        for i, v in enumerate(samples):
            if s + i < len(track):
                track[s + i] += v
    return track


def louder(samples, drive):
    """Soft-limit so the quieter tail comes up without clipping the attack."""
    return [math.tanh(drive * v) for v in samples]


def save(name, samples, peak):
    top = max(abs(v) for v in samples) or 1.0
    frames = b"".join(struct.pack("<h", int(v / top * peak * 32767)) for v in samples)
    with wave.open(str(AUDIO / name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(frames)
    print(f"wrote audio/{name}")


if __name__ == "__main__":
    # "Ding-ding": C6 then E6.
    bells = mix([(0, bell(1046.5, 1.1)), (0.15, bell(1318.5, 1.05))], 1.2)
    top = max(abs(v) for v in bells)
    save("sfx-right.wav", louder([v / top for v in bells], 2.5), 0.95)
    # "Eh-eh": two short buzzes.
    save("sfx-wrong.wav", mix([(0, buzz(0.2)), (0.26, buzz(0.32))], 0.6), 0.7)

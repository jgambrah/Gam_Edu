#!/usr/bin/env python3
"""
Builds PLACEHOLDER narration for the Story Spark preview, free and offline, with espeak-ng (via the espeakng-loader wheel).
It is NOT production narration: the voice is robotic. What it IS good for is proving the reader end to end, because the
engine reports the exact audio position of every word it speaks, so the word/sentence timing is real, not guessed.

  pip install espeakng-loader
  python3 scripts/library/build-preview-audio.py  <pilot-pages.json>  <out-dir>

Input JSON: { "story-key": ["page 1 text", "page 2 text", ...], ... }  (written by build-preview.ts)
Output: <out-dir>/<sha256-12>.mp3 per page and <out-dir>/timing.json: { key: [ {file, sha256, bytes, durationMs, words:[[s,e],..], sentences:[[s,e],..]} ] }
"""
import ctypes, hashlib, json, os, re, struct, subprocess, sys, tempfile, wave
import espeakng_loader

lib = ctypes.CDLL(espeakng_loader.get_library_path())

class Event(ctypes.Structure):
    _fields_ = [("type", ctypes.c_int), ("unique_identifier", ctypes.c_uint), ("text_position", ctypes.c_int), ("length", ctypes.c_int),
                ("audio_position", ctypes.c_int), ("sample", ctypes.c_int), ("user_data", ctypes.c_void_p), ("id", ctypes.c_void_p)]

CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.POINTER(Event))
lib.espeak_Initialize.restype = ctypes.c_int
rate = lib.espeak_Initialize(2, 0, espeakng_loader.get_data_path().encode(), 0)  # AUDIO_OUTPUT_SYNCHRONOUS
assert rate > 0, "espeak init failed"
lib.espeak_SetVoiceByName(b"en-gb")
lib.espeak_SetParameter(1, 125, 0)  # rate (wpm): slow for young listeners
lib.espeak_SetParameter(3, 55, 0)   # pitch

WORD = 1
samples = []
words = []  # (text_position, audio_position_ms, length)

@CB
def callback(wav, n, events):
    if wav and n > 0:
        samples.extend(wav[i] for i in range(n))
    i = 0
    while events[i].type != 0:
        e = events[i]
        if e.type == WORD:
            words.append((e.text_position, e.audio_position, e.length))
        i += 1
    return 0

lib.espeak_SetSynthCallback(callback)

def synth(text):
    samples.clear(); words.clear()
    data = text.encode("utf-8")
    # espeakCHARS_UTF8 = 1
    lib.espeak_Synth(data, len(data) + 1, 0, 1, 0, 1, None, None)
    lib.espeak_Synchronize()
    return list(samples), list(words)

def tokens_with_spans(text):
    return [(m.group(0), m.start(), m.end()) for m in re.finditer(r"\S+", text)]

def sentences(text):
    """Same rule as splitSentences() in premium.ts: split after . ! ? followed by whitespace."""
    return [s for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s]

def build_page(text):
    pcm, evs = synth(text)
    duration_ms = int(len(pcm) * 1000 / rate)
    toks = tokens_with_spans(text)
    # espeak text_position is 1-based, in characters
    starts = [None] * len(toks)
    for pos, ms, ln in evs:
        c = pos - 1
        for i, (_, s, e) in enumerate(toks):
            if s <= c < e or (c < s and i == 0):
                if starts[i] is None or ms < starts[i]:
                    starts[i] = ms
                break
    # tokens espeak did not announce (e.g. a lone symbol) share the previous token's start + 1 ms
    last = 0
    for i in range(len(starts)):
        if starts[i] is None:
            starts[i] = last + 1 if i else 0
        starts[i] = max(starts[i], last + 1 if i else 0)
        last = starts[i]
    marks = []
    for i, s in enumerate(starts):
        e = starts[i + 1] if i + 1 < len(starts) else duration_ms
        if e <= s: e = s + 1
        marks.append([s, e])
    # sentence marks from word marks
    sent_marks, at = [], 0
    for s in sentences(text):
        n = len(s.split())
        sent_marks.append([marks[at][0], marks[at + n - 1][1]]); at += n
    assert at == len(marks), "sentence/token mismatch"
    return pcm, duration_ms, marks, sent_marks

def main(src, out):
    os.makedirs(out, exist_ok=True)
    pages = json.load(open(src))
    result = {}
    for key, texts in pages.items():
        result[key] = []
        for i, text in enumerate(texts):
            pcm, dur, marks, sm = build_page(text)
            with tempfile.TemporaryDirectory() as td:
                wavp = os.path.join(td, "p.wav")
                with wave.open(wavp, "wb") as w:
                    w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
                    w.writeframes(struct.pack("<%dh" % len(pcm), *pcm))
                mp3 = os.path.join(td, "p.mp3")
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wavp, "-ac", "1", "-ar", "22050", "-b:a", "32k", mp3], check=True)
                data = open(mp3, "rb").read()
            sha = hashlib.sha256(data).hexdigest()
            fname = sha[:12] + ".mp3"
            open(os.path.join(out, fname), "wb").write(data)
            result[key].append({"file": fname, "sha256": sha, "bytes": len(data), "durationMs": dur, "words": marks, "sentences": sm})
        print(key, len(texts), "pages", sum(p["bytes"] for p in result[key]), "bytes")
    json.dump(result, open(os.path.join(out, "timing.json"), "w"), separators=(",", ":"))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

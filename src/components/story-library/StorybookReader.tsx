'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CatalogueEntry, StoryPackage } from '@/lib/story-library/types';
import type { LibrarySource, StoryPreviewInfo } from '@/lib/story-library/library-source';
import type { ReadMode } from '@/lib/story-library/lazy-loader';
import { presentationFor } from '@/lib/story-library/classification';
import { buildFlow, cleanWord, highlightAt, lineBreakAfterTokens, lookupWordHelp, modeInfo, NO_HIGHLIGHT, pageWords, READ_MODES, scoreResults, syncDescription, type HighlightState } from '@/lib/story-library/reader-logic';
import { GHANAIAN_PRONUNCIATIONS } from '@/lib/story-library/pronunciation/dictionary';
import { buildSpokenScript } from '@/lib/story-library/pronunciation/apply';
import { loadProgress, saveProgress } from '@/lib/story-library/progress-store';
import { Piano, TUNE_PRESETS, DEFAULT_VOLUME, type TuneId } from '@/lib/story-spark/piano';
import { PlaceholderArt } from './PlaceholderArt';
import { StoryNotes } from './StoryNotes';
import { ActivityPlayer, type ActivityResult } from './ActivityPlayer';

const SPEEDS = [0.75, 1, 1.25];

export function StorybookReader({
  pkg,
  entry,
  info: initialInfo,
  source,
  onClose,
}: {
  pkg: StoryPackage;
  entry?: CatalogueEntry;
  info?: StoryPreviewInfo;
  source: LibrarySource;
  onClose: () => void;
}) {
  const [loadedInfo, setLoadedInfo] = useState<StoryPreviewInfo | undefined>(initialInfo);
  useEffect(() => {
    if (initialInfo) {
      setLoadedInfo(initialInfo);
      return;
    }
    if (!source.loadInfo) return;
    let live = true;
    source.loadInfo(pkg.storyId).then((res) => {
      if (live && res) setLoadedInfo(res);
    }).catch(() => {});
    return () => { live = false; };
  }, [initialInfo, pkg.storyId, source]);

  const info = loadedInfo ?? initialInfo;
  const presentation = useMemo(
    () => presentationFor(info?.classification?.classIds ?? entry?.classIds ?? []),
    [info, entry?.classIds],
  );
  const flow = useMemo(() => buildFlow(pkg), [pkg]);
  const resume = useMemo(() => loadProgress(pkg.storyId), [pkg.storyId]);
  const [mode, setMode] = useState<ReadMode>(presentation.defaultMode);
  const [step, setStep] = useState(resume && !resume.done && resume.total === flow.length ? resume.step : 0);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [hl, setHl] = useState<HighlightState>(NO_HIGHLIGHT);
  const [tapped, setTapped] = useState<{ word: string; definition: string; phonetic?: string; spokenText?: string } | null>(null);
  const [results, setResults] = useState<ActivityResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [usingOfflineVoice, setUsingOfflineVoice] = useState<boolean>(false);
  const [autoRoll, setAutoRoll] = useState<boolean>(true);
  const [pianoOn, setPianoOn] = useState<boolean>(false);
  const [pianoTune, setPianoTune] = useState<TuneId>('piano');
  const [pianoVolume, setPianoVolume] = useState<number>(DEFAULT_VOLUME);
  const [customDurationScale, setCustomDurationScale] = useState<boolean>(true);
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [largeImageLayout, setLargeImageLayout] = useState<boolean>(false);
  const readerContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pianoRef = useRef<Piano | null>(null);
  const raf = useRef<number>(0);
  const hlRef = useRef<HighlightState>(NO_HIGHLIGHT);
  const synthTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const synthStartMsRef = useRef<number>(0);
  const synthPausedElapsedRef = useRef<number>(0);
  const usingOfflineVoiceRef = useRef<boolean>(false);
  const resolveMediaUrl = useMemo(() => source.resolveMediaUrl ?? ((p: string) => p), [source.resolveMediaUrl]);

  const stopOfflineSpeech = useCallback(() => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const p = new Piano();
    pianoRef.current = p;
    return () => {
      stopOfflineSpeech();
      p.dispose();
      pianoRef.current = null;
    };
  }, [stopOfflineSpeech]);

  const togglePiano = () => {
    const p = pianoRef.current;
    if (!p) return;
    if (pianoOn) {
      p.stop();
      setPianoOn(false);
    } else {
      p.setTune(pianoTune);
      p.setVolume(pianoVolume);
      const started = p.start();
      if (started) {
        p.duck(playing);
        setPianoOn(true);
      }
    }
  };

  const current = flow[step];
  const page = current?.kind === 'page' ? pkg.pages[current.index] : undefined;
  const m = modeInfo(mode);
  const pageNo = page ? page.n : undefined;

  // Warm all pages of the opened story into Cache Storage in the background so cutting the internet mid-story never loses audio or art.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      for (const p of pkg.pages) {
        if (cancelled) break;
        const tasks: Promise<unknown>[] = [];
        if (p.image && pkg.assets[p.image]?.path) {
          tasks.push(source.assets.blob(pkg.assets[p.image].path, false).catch(() => null));
        }
        if (m.narration && p.audio && pkg.assets[p.audio.hash]?.path) {
          tasks.push(source.assets.blob(pkg.assets[p.audio.hash].path, false).catch(() => null));
        }
        await Promise.all(tasks);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pkg, mode, m.narration, source.assets]);

  const wasAlreadyDone = Boolean(resume?.done);
  const reachedFinalPage = flow.length > 1 && step >= flow.length - 1 && current?.kind === 'page';
  // ---- remember where the child is (local + cloud-synced when signed in)
  useEffect(() => {
    saveProgress(pkg.storyId, {
      step,
      total: flow.length,
      done: finished || wasAlreadyDone || reachedFinalPage,
      updatedAt: Date.now(),
      mode,
    });
  }, [step, finished, wasAlreadyDone, reachedFinalPage, mode, pkg.storyId, flow.length]);

  const go = useCallback((delta: number) => {
    stopOfflineSpeech();
    setTapped(null);
    setStep((s) => {
      const n = s + delta;
      if (n >= flow.length) { setFinished(true); return s; }
      return Math.max(0, n);
    });
  }, [flow.length, stopOfflineSpeech]);

  // Start offline device-voice narration for the current page with word-by-word highlighting when audio files are unreachable offline
  const startOfflinePageNarration = useCallback((fromElapsedMs = 0) => {
    if (!page) return false;
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      return false;
    }
    stopOfflineSpeech();
    try {
      const spokenScript = buildSpokenScript(page.text, GHANAIAN_PRONUNCIATIONS, 'browser', { allowUnverified: true }).spoken;
      const u = new SpeechSynthesisUtterance(spokenScript || page.text);
      u.lang = 'en-GB';
      u.rate = Math.max(0.5, Math.min(2, speed * 0.95));

      const baseDurationMs = page.audio?.durationMs ?? Math.max(4000, tokenizeFallback(page.text) * 420);
      synthStartMsRef.current = performance.now() - fromElapsedMs;
      synthPausedElapsedRef.current = fromElapsedMs;

      u.onboundary = (ev: SpeechSynthesisEvent) => {
        if (ev.name === 'word' && typeof ev.charIndex === 'number') {
          const prefix = (spokenScript || page.text).slice(0, ev.charIndex);
          const wordIdx = Math.max(0, (prefix.trim() ? prefix.trim().split(/\s+/).length : 0));
          const pw = pageWords(page);
          const clampedWord = Math.min(wordIdx, Math.max(0, pw.tokens.length - 1));
          const next: HighlightState = {
            level: 'word',
            word: clampedWord,
            sentence: pw.sentenceOfToken[clampedWord] ?? 0,
          };
          hlRef.current = next;
          setHl(next);
        }
      };

      u.onend = () => {
        if (synthTimerRef.current) {
          clearInterval(synthTimerRef.current);
          synthTimerRef.current = null;
        }
        setPlaying(false);
        pianoRef.current?.duck(false);
        if (m.autoAdvance || autoRoll) setTimeout(() => go(1), 950);
      };

      u.onerror = () => {
        if (synthTimerRef.current) {
          clearInterval(synthTimerRef.current);
          synthTimerRef.current = null;
        }
        setPlaying(false);
        pianoRef.current?.duck(false);
      };

      setPlaying(true);
      setNeedsTap(false);
      setAudioError(null);
      pianoRef.current?.duck(true);

      // Drive smooth word-by-word highlight progression alongside speechSynthesis
      synthTimerRef.current = setInterval(() => {
        const elapsed = (performance.now() - synthStartMsRef.current) * speed;
        synthPausedElapsedRef.current = elapsed;
        const next = highlightAt(page, Math.min(elapsed, baseDurationMs), hlRef.current);
        if (next.word !== hlRef.current.word || next.sentence !== hlRef.current.sentence || next.level !== hlRef.current.level) {
          hlRef.current = next;
          setHl(next);
        }
      }, 60);

      window.speechSynthesis.speak(u);
      return true;
    } catch {
      return false;
    }
  }, [page, speed, stopOfflineSpeech, m.autoAdvance, autoRoll, go]);

  // Resolve cached illustration blob URL so page illustrations also work when offline
  useEffect(() => {
    let cancelled = false;
    setCachedImageUrl(null);
    if (!page) return;
    const pkgImg = page.image ? pkg.assets[page.image]?.path : undefined;
    const candidateImg = `/story-spark-preview/candidates/${pkg.storyId}/page${page.n}-1.webp`;
    (async () => {
      for (const candidate of [pkgImg, candidateImg]) {
        if (!candidate) continue;
        try {
          const blobUrl = await source.assets.objectUrl(candidate);
          if (!cancelled && blobUrl) {
            setCachedImageUrl(blobUrl);
            return;
          }
        } catch { /* try next */ }
      }
    })();
    return () => { cancelled = true; };
  }, [page, pkg, source.assets]);

  // Reset zoom scale on page turn
  useEffect(() => {
    setZoomScale(1);
  }, [step]);

  // Keyboard controls for zoom modal (Esc, +, -, 0)
  useEffect(() => {
    if (!isImageZoomed) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageZoomed(false);
      } else if (e.key === '+' || e.key === '=') {
        setZoomScale((s) => Math.min(2.5, +(s + 0.25).toFixed(2)));
      } else if (e.key === '-' || e.key === '_') {
        setZoomScale((s) => Math.max(0.75, +(s - 0.25).toFixed(2)));
      } else if (e.key === '0') {
        setZoomScale(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isImageZoomed]);

  // ---- load narration for the page and (optionally) start it
  useEffect(() => {
    const el = audioRef.current;
    cancelAnimationFrame(raf.current);
    stopOfflineSpeech();
    setHl(NO_HIGHLIGHT); hlRef.current = NO_HIGHLIGHT; setPlaying(false); setNeedsTap(false); setAudioError(null);
    setUsingOfflineVoice(false); usingOfflineVoiceRef.current = false;
    if (!el) return;
    el.pause();
    if (!page || !m.narration || !page.audio) { el.removeAttribute('src'); return; }
    let cancelled = false;
    (async () => {
      // 1. Trigger lazy loader for current page + look-ahead, but NEVER let a look-ahead network error abort current page playback!
      try {
        await source.loader.showPage(pkg, current!.kind === 'page' ? current.index : 0, mode);
      } catch {
        // Offline or look-ahead asset not cached yet; proceed to resolve current page from Cache Storage
      }

      const assetPath = pkg.assets[page.audio!.hash]?.path;
      const koreUrl = `/story-spark-preview/candidates/${pkg.storyId}/tts-Kore-page${page.n}.mp3`;
      let resolvedUrl: string | null = null;
      let useCustomScale = true;

      // 2. Resolve the package's content-hashed audio path through BrowserAssetCache (returns an offline-safe blob: URL)
      if (assetPath) {
        try {
          resolvedUrl = await source.assets.objectUrl(assetPath);
          useCustomScale = true;
        } catch {
          resolvedUrl = null;
        }
      }

      // 3. Fallback to candidate path via BrowserAssetCache if needed
      if (!resolvedUrl) {
        try {
          resolvedUrl = await source.assets.objectUrl(koreUrl);
          useCustomScale = true;
        } catch {
          resolvedUrl = null;
        }
      }

      if (cancelled) return;

      if (resolvedUrl) {
        setCustomDurationScale(useCustomScale);
        el.src = resolvedUrl;
        el.playbackRate = speed;
        el.load();
        if (m.autoplay) {
          try {
            await el.play();
          } catch {
            if (!cancelled) setNeedsTap(true);
          }
        }
        return;
      }

      // 4. Both network and Cache Storage missed (e.g. story opened after internet cut): use Offline Device Voice synthesis!
      setUsingOfflineVoice(true);
      usingOfflineVoiceRef.current = true;
      if (m.autoplay) {
        const ok = startOfflinePageNarration(0);
        if (!ok && !cancelled) setNeedsTap(true);
      } else {
        setNeedsTap(true);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, mode, pkg]);

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = speed; }, [speed]);

  // ---- drive the highlight from the audio clock (media time, so speed/pauses/replays never drift)
  const tick = useCallback(() => {
    const el = audioRef.current;
    if (el && page) {
      const dur = el.duration && Number.isFinite(el.duration) && el.duration > 0 ? el.duration * 1000 : (page.audio?.durationMs ?? 1);
      const scale = customDurationScale && page.audio?.durationMs ? page.audio.durationMs / dur : 1;
      const next = highlightAt(page, el.currentTime * 1000 * scale, hlRef.current);
      if (next.word !== hlRef.current.word || next.sentence !== hlRef.current.sentence || next.level !== hlRef.current.level) { hlRef.current = next; setHl(next); }
    }
    raf.current = requestAnimationFrame(tick);
  }, [page, customDurationScale]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onPlay = () => {
    setPlaying(true);
    setNeedsTap(false);
    setAudioError(null);
    pianoRef.current?.duck(true);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };
  const onPause = () => {
    setPlaying(false);
    pianoRef.current?.duck(false);
    cancelAnimationFrame(raf.current);
  };
  const onEnded = () => {
    setPlaying(false);
    pianoRef.current?.duck(false);
    cancelAnimationFrame(raf.current);
    if (m.autoAdvance || autoRoll) setTimeout(() => go(1), 950);
  };
  const onAudioElementError = () => {
    // If the <audio> element fails (e.g., offline uncached URL), seamlessly fall back to offline device voice
    setUsingOfflineVoice(true);
    usingOfflineVoiceRef.current = true;
    const started = startOfflinePageNarration(0);
    if (!started) {
      setNeedsTap(true);
    }
  };
  const toggle = async () => {
    if (usingOfflineVoiceRef.current) {
      if (playing) {
        stopOfflineSpeech();
        setPlaying(false);
        pianoRef.current?.duck(false);
      } else {
        const ok = startOfflinePageNarration(synthPausedElapsedRef.current);
        if (!ok) setAudioError('Narration could not be played on this device.');
      }
      return;
    }
    const el = audioRef.current;
    if (!el || !el.src) {
      setUsingOfflineVoice(true);
      usingOfflineVoiceRef.current = true;
      startOfflinePageNarration(0);
      return;
    }
    if (el.paused) {
      try {
        await el.play();
      } catch {
        setUsingOfflineVoice(true);
        usingOfflineVoiceRef.current = true;
        if (!startOfflinePageNarration(0)) setNeedsTap(true);
      }
    } else {
      el.pause();
    }
  };
  const replay = async () => {
    setHl(NO_HIGHLIGHT);
    hlRef.current = NO_HIGHLIGHT;
    synthPausedElapsedRef.current = 0;
    if (usingOfflineVoiceRef.current) {
      startOfflinePageNarration(0);
      return;
    }
    const el = audioRef.current;
    if (!el || !el.src) {
      setUsingOfflineVoice(true);
      usingOfflineVoiceRef.current = true;
      startOfflinePageNarration(0);
      return;
    }
    el.currentTime = 0;
    try {
      await el.play();
    } catch {
      setUsingOfflineVoice(true);
      usingOfflineVoiceRef.current = true;
      if (!startOfflinePageNarration(0)) setNeedsTap(true);
    }
  };

  // ---- keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [go, onClose]);

  // ---- tap a word
  const speakWord = (w: string) => {
    try { const u = new SpeechSynthesisUtterance(w); u.lang = 'en-GB'; u.rate = 0.8; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch { /* no device voice */ }
  };
  const tapWord = (token: string) => {
    audioRef.current?.pause();
    stopOfflineSpeech();
    setPlaying(false);
    const help = lookupWordHelp(token, {
      glossary: pkg.glossary,
      pageNumber: page?.n,
      activities: pkg.activities,
      pageText: page?.text,
    });
    setTapped({
      word: help.word,
      definition: help.definition,
      phonetic: help.phonetic,
      spokenText: help.spokenText,
    });
    speakWord(help.spokenText || help.word);

    // If the word was not in our curated offline dictionary, optionally enrich from the Free Dictionary API when online
    const cleaned = cleanWord(token);
    if (help.fromFallback && cleaned && typeof window !== 'undefined' && typeof fetch === 'function') {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleaned)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const def = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
          const phon = data?.[0]?.phonetic;
          if (typeof def === 'string' && def.trim()) {
            setTapped((prev) =>
              prev && prev.word === help.word
                ? { ...prev, definition: def.trim(), phonetic: phon || prev.phonetic }
                : prev,
            );
          }
        })
        .catch(() => {
          /* stay on offline word help */
        });
    }
  };
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const art = info?.pages?.[page ? page.n - 1 : 0];
  const words = page ? pageWords(page) : undefined;
  const lineBreaks = page ? lineBreakAfterTokens(page.text) : undefined;
  const fontSize = `clamp(1.15rem, 5.4vw, ${1.35 * presentation.textScale}rem)`;
  const [c0, c1] = info?.palette ?? entry?.palette ?? ['#e2e8f0', '#94a3b8'];

  if (finished) {
    const sc = scoreResults(results);
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl" data-testid="story-end">
        <div className="text-6xl" aria-hidden>🎉</div>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">The End</h2>
        <p className="mt-2 text-lg text-slate-700">{pkg.title}</p>
        {results.length > 0 && <p className="mt-4 text-lg text-slate-700">You tried <strong>{sc.answered}</strong> activities{sc.scored > 0 && <>, and got <strong>{sc.correct}</strong> of <strong>{sc.scored}</strong> right</>}.</p>}
        <div className="mt-6 flex justify-center gap-3">
          <button className="rounded-full bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300" onClick={() => { setFinished(false); setStep(0); setResults([]); }}>Read again</button>
          <button className="rounded-full border-2 border-slate-300 px-6 py-3 font-bold text-slate-800 hover:bg-slate-50" onClick={onClose}>Back to library</button>
        </div>
      </div>
    );
  }

  const toggleFullscreen = () => {
    const el = readerContainerRef.current;
    if (!el || typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div ref={readerContainerRef} className={`mx-auto w-full max-w-5xl ${isFullscreen ? 'min-h-screen bg-slate-50 p-4 md:p-8 overflow-y-auto' : ''}`} data-testid="reader" data-presentation={presentation.id}>
      <audio ref={audioRef} onPlay={onPlay} onPause={onPause} onEnded={onEnded} onError={onAudioElementError} preload="auto" />
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={onClose} className="rounded-full border-2 border-slate-300 bg-white px-4 py-2 font-bold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-200">← Library</button>
        <h2 className="min-w-0 flex-1 truncate text-xl font-extrabold text-slate-900">{pkg.title}</h2>
        <div role="radiogroup" aria-label="Reading mode" className="flex rounded-full bg-slate-200 p-1">
          {READ_MODES.map((r) => (
            <button key={r.id} type="button" role="radio" aria-checked={mode === r.id} title={r.blurb} onClick={() => setMode(r.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${mode === r.id ? 'bg-indigo-600 text-white shadow' : 'text-slate-700 hover:bg-white'}`}>{r.label}</button>
          ))}
        </div>
        {m.narration && (
          <>
            <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">Speed
              <select aria-label="Narration speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-lg border border-slate-300 bg-white px-2 py-1">
                {SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setAutoRoll((v) => !v)}
              aria-pressed={autoRoll}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${autoRoll ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              title="Automatically roll to the next page when the narrator finishes speaking"
            >
              {autoRoll ? '🔄 Auto-Roll: On' : '🔄 Auto-Roll: Off'}
            </button>
          </>
        )}
        <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">
          <button
            type="button"
            onClick={togglePiano}
            aria-pressed={pianoOn}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${pianoOn ? 'bg-amber-200 text-amber-950 ring-1 ring-amber-400 shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            title="Play background music that gently lowers while the narrator reads"
          >
            {pianoOn ? '🎵 Music: On' : '🎹 Soft Piano: Off'}
          </button>
          {pianoOn && (
            <>
              <select
                aria-label="Background tune"
                value={pianoTune}
                onChange={(e) => {
                  const next = e.target.value as TuneId;
                  setPianoTune(next);
                  pianoRef.current?.setTune(next);
                }}
                className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                title="Choose background music style"
              >
                {TUNE_PRESETS.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-700" title={`Music volume: ${Math.round(pianoVolume * 100)}%`}>
                <span>🔊</span>
                <input
                  type="range"
                  aria-label="Background music volume"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={pianoVolume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPianoVolume(v);
                    pianoRef.current?.setVolume(v);
                  }}
                  className="h-1.5 w-20 cursor-pointer accent-amber-600"
                />
                <span className="w-8 text-[11px] font-extrabold text-amber-900">{Math.round(pianoVolume * 100)}%</span>
              </label>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-pressed={isFullscreen}
          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Expand storybook for classroom smartboard or projector"
        >
          {isFullscreen ? '🗗 Exit Fullscreen' : '⛶ Classroom View'}
        </button>
        <button
          type="button"
          onClick={() => setLargeImageLayout((v) => !v)}
          aria-pressed={largeImageLayout}
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${largeImageLayout ? 'bg-indigo-100 text-indigo-900 ring-1 ring-indigo-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          title="Toggle larger illustration layout for closer visual connection"
        >
          {largeImageLayout ? '🖼️ Picture: Large' : '🖼️ Picture: Standard'}
        </button>
      </header>

      {source.notice && <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">{source.notice}</p>}

      {page && page.n === 1 && pkg.glossary && pkg.glossary.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl bg-amber-50/90 px-4 py-2.5 ring-1 ring-amber-200" data-testid="spotlight-words">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">✨ Spotlight Words:</span>
          {pkg.glossary.map((g) => (
            <button
              key={g.word}
              type="button"
              onClick={() => tapWord(g.word)}
              className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-950 shadow-sm ring-1 ring-amber-300 transition hover:bg-amber-100"
              title={`Tap to hear and see the meaning of "${g.word}"`}
            >
              🔊 {g.word}
            </button>
          ))}
        </div>
      )}

      {current?.kind === 'activity' && (
        <div key={`act-${current.activity.id}`} className="animate-in fade-in slide-in-from-right-4 duration-500">
          <ActivityPlayer activity={current.activity} onDone={(r) => { setResults((x) => [...x.filter((y) => y.id !== r.id), r]); go(1); }} />
        </div>
      )}

      {page && (
        <div key={`page-${page.n}`} className={`grid gap-4 animate-in fade-in slide-in-from-right-4 duration-500 ${largeImageLayout ? 'md:grid-cols-2' : presentation.layout === 'text-first' ? 'md:grid-cols-[1fr_320px]' : presentation.layout === 'picture-first' ? '' : 'md:grid-cols-2'}`}>
          <div className={!largeImageLayout && presentation.layout === 'text-first' ? 'order-2 md:order-2' : 'order-1'}>
            <PlaceholderArt
              motif={art?.motif ?? (page.n === 1 ? entry?.coverMotif : undefined) ?? '📖'}
              palette={[c0, c1]}
              alt={page.alt ?? 'Illustration'}
              brief={art?.brief}
              compact={!largeImageLayout && presentation.layout === 'text-first'}
              imageSrc={cachedImageUrl ?? resolveMediaUrl(`/story-spark-preview/candidates/${pkg.storyId}/page${page.n}-1.webp`)}
              onZoom={() => setIsImageZoomed(true)}
            />
          </div>
          <article aria-label={`Page ${page.n} of ${pkg.pages.length}`} className="order-2 flex flex-col justify-center rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200 md:p-8">
            <p className="text-lg leading-[1.9] text-slate-900" style={{ fontSize, fontFamily: 'Andika, Nunito, system-ui, sans-serif' }} data-testid="page-text">
              {words!.tokens.map((t, i) => {
                const active = hl.level === 'word' ? hl.word === i : hl.level === 'sentence' ? words!.sentenceOfToken[i] === hl.sentence : false;
                const inSentence = hl.level === 'word' && words!.sentenceOfToken[i] === hl.sentence;
                return (
                  <span key={i}>
                    <button type="button" onClick={() => tapWord(t)} aria-label={`${t} (tap for help)`}
                      data-active={active ? 'true' : undefined}
                      className={`rounded-lg px-1 py-0.5 text-inherit transition-colors motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-indigo-400 ${active && hl.level === 'word' ? 'bg-yellow-300 shadow' : active ? 'bg-yellow-200' : inSentence ? 'bg-yellow-50' : 'hover:bg-indigo-50'}`}>{t}</button>{' '}{lineBreaks?.has(i) ? <br /> : null}
                  </span>
                );
              })}
            </p>
            {tapped && (
              <div role="status" aria-live="polite" className="mt-4 rounded-2xl bg-indigo-50 p-3 text-slate-900" data-testid="word-help">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-xl font-extrabold">{tapped.word}</p>
                  {tapped.phonetic && (
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800">
                      {tapped.phonetic}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-base">{tapped.definition}</p>
                {canSpeak && <p className="mt-1 text-xs text-slate-600">Spoken by your device’s voice, not the story narrator.</p>}
                <div className="mt-2 flex gap-2">
                  {canSpeak && <button type="button" onClick={() => speakWord(tapped.spokenText || tapped.word)} className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-bold text-white">🔊 Hear it</button>}
                  <button type="button" onClick={() => setTapped(null)} className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-bold">Close</button>
                </div>
              </div>
            )}
          </article>
        </div>
      )}

      <footer className="mt-4 rounded-2xl bg-white p-3 shadow ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={() => go(-1)} disabled={step === 0} className="rounded-full bg-slate-200 px-5 py-3 text-lg font-bold disabled:opacity-40 focus:outline-none focus:ring-4 focus:ring-indigo-200" aria-label="Previous">◀ Back</button>
          {page && m.narration && page.audio && (
            <>
              <button type="button" onClick={toggle} className="rounded-full bg-indigo-600 px-6 py-3 text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300" aria-label={playing ? 'Pause narration' : 'Play narration'}>{playing ? '⏸ Pause' : needsTap ? '▶ Tap to listen' : '▶ Listen'}</button>
              <button type="button" onClick={replay} className="rounded-full bg-slate-200 px-4 py-3 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-indigo-200" aria-label="Replay this page">↺ Again</button>
            </>
          )}
          <button type="button" onClick={() => go(1)} className="rounded-full bg-emerald-600 px-5 py-3 text-lg font-bold text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300" aria-label="Next">{step === flow.length - 1 ? 'Finish ✔' : 'Next ▶'}</button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1" aria-hidden>
          {flow.map((s, i) => <span key={i} className={`h-2 rounded-full ${i === step ? 'w-6 bg-indigo-600' : s.kind === 'activity' ? 'w-2 bg-amber-400' : 'w-2 bg-slate-300'} ${i < step ? 'opacity-60' : ''}`} />)}
        </div>
        <p className="mt-2 text-center text-xs text-slate-600" data-testid="sync-status">
          {page ? `Page ${pageNo} of ${pkg.pages.length}. ${syncDescription(page, mode)}` : 'Activity time'}
          {usingOfflineVoice && m.narration && <span className="ml-1 font-semibold text-indigo-700"> (Offline device voice active)</span>}
          {audioError && <span className="ml-1 font-semibold text-red-700"> {audioError}</span>}
        </p>
        <p className="text-center text-[11px] text-slate-500">{m.blurb}</p>
      </footer>

      {isImageZoomed && page && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged illustration with narrative"
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 p-3 backdrop-blur-md animate-in fade-in duration-200 md:p-6 text-white overflow-y-auto"
          onClick={() => setIsImageZoomed(false)}
        >
          <div
            className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Title & Zoom controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-950/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-600/30 px-2.5 py-1 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/40">
                  Page {pageNo} of {pkg.pages.length}
                </span>
                <h3 className="text-sm font-bold text-slate-200 truncate max-w-[200px] md:max-w-md">{pkg.title}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomScale((s) => Math.max(0.75, +(s - 0.25).toFixed(2)))}
                  disabled={zoomScale <= 0.75}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold hover:bg-slate-700 disabled:opacity-40"
                  title="Zoom out (-)"
                >
                  ➖
                </button>
                <span className="min-w-[3.5rem] text-center text-xs font-semibold text-slate-300">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale((s) => Math.min(2.5, +(s + 0.25).toFixed(2)))}
                  disabled={zoomScale >= 2.5}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold hover:bg-slate-700 disabled:opacity-40"
                  title="Zoom in (+)"
                >
                  ➕
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold hover:bg-slate-700"
                  title="Reset zoom to 100%"
                >
                  ↺ Fit
                </button>
                <button
                  type="button"
                  onClick={() => setIsImageZoomed(false)}
                  className="ml-2 rounded-full bg-rose-600/80 px-3 py-1 text-xs font-bold text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  aria-label="Close zoom modal"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Image viewport */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto p-4 bg-slate-950/40 min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cachedImageUrl ?? resolveMediaUrl(`/story-spark-preview/candidates/${pkg.storyId}/page${page.n}-1.webp`)}
                alt={page.alt ?? 'Illustration'}
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                  maxHeight: '52vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                className="rounded-xl shadow-2xl ring-1 ring-white/10"
              />
            </div>

            {/* Narrative & Audio Sync Bar */}
            <div className="border-t border-slate-800 bg-slate-900/95 p-4">
              <p className="text-base leading-relaxed text-slate-100" style={{ fontFamily: 'Andika, Nunito, system-ui, sans-serif' }}>
                {words!.tokens.map((t, i) => {
                  const active = hl.level === 'word' ? hl.word === i : hl.level === 'sentence' ? words!.sentenceOfToken[i] === hl.sentence : false;
                  const inSentence = hl.level === 'word' && words!.sentenceOfToken[i] === hl.sentence;
                  return (
                    <span key={i}>
                      <button
                        type="button"
                        onClick={() => tapWord(t)}
                        aria-label={`${t} (tap for help)`}
                        data-active={active ? 'true' : undefined}
                        className={`rounded-md px-1 py-0.5 text-inherit transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${active && hl.level === 'word' ? 'bg-yellow-400 text-slate-950 font-bold shadow' : active ? 'bg-yellow-300 text-slate-950 font-semibold' : inSentence ? 'bg-yellow-950/60 text-yellow-100' : 'hover:bg-slate-800'}`}
                      >
                        {t}
                      </button>{' '}
                      {lineBreaks?.has(i) ? <br /> : null}
                    </span>
                  );
                })}
              </p>

              {/* Modal Narration and Navigation controls */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={step === 0}
                    className="rounded-full bg-slate-800 px-3.5 py-1.5 text-sm font-bold disabled:opacity-40 hover:bg-slate-700"
                  >
                    ◀ Back
                  </button>
                  {m.narration && page.audio && (
                    <>
                      <button
                        type="button"
                        onClick={toggle}
                        className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-indigo-500"
                      >
                        {playing ? '⏸ Pause' : '▶ Listen'}
                      </button>
                      <button
                        type="button"
                        onClick={replay}
                        className="rounded-full bg-slate-800 px-3 py-1.5 text-sm font-bold hover:bg-slate-700"
                      >
                        ↺ Again
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => go(1)}
                    disabled={step === flow.length - 1}
                    className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-40"
                  >
                    Next ▶
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  Tip: Press Esc to exit, +/- to zoom
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <StoryNotes info={info} />
    </div>
  );
}

function tokenizeFallback(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 1;
}

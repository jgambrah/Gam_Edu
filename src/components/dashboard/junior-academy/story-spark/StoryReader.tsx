'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Square, Music, VolumeX, RotateCcw, PartyPopper, BookOpen, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedStory } from '@/lib/story-spark/types';
import { readerPages, tokenizeWords, cleanWord } from '@/lib/story-spark/reader-text';
import { MODES, MODE_ORDER, SPEEDS, defaultModeForTier, defaultSpeedForTier, isReadingMode, type ReadingMode, type SpeedId } from '@/lib/story-spark/reading-modes';
import { Narrator, pickVoice } from '@/lib/story-spark/narration';
import { Piano } from '@/lib/story-spark/piano';

/**
 * The immersive story book: one illustrated page at a time, a voice that reads it with the spoken word lit up,
 * three reading modes, optional soft piano, and big, labelled, keyboard-friendly controls.
 * Reads only a NormalizedStory, so old `content` stories and new `pages` stories both work.
 */
const PREFS_KEY = 'storyspark.reader.prefs.v1';
const FONT_SCALES = [1, 1.25, 1.5];
const PAGE_GRADIENTS = [
  'from-amber-100 via-orange-50 to-yellow-100', 'from-sky-100 via-cyan-50 to-blue-100', 'from-emerald-100 via-lime-50 to-green-100',
  'from-pink-100 via-rose-50 to-fuchsia-100', 'from-violet-100 via-indigo-50 to-purple-100',
];

function loadPrefs(): Partial<{ mode: ReadingMode; speed: SpeedId; piano: boolean; font: number; volume: number }> {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') || {}; } catch { return {}; }
}
function savePrefs(p: object) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* private mode etc. */ } }

export function StoryReader({ story, ageTier, onFinish, onClose }: { story: NormalizedStory; ageTier?: string; onFinish?: () => void; onClose?: () => void }) {
  const pages = useMemo(() => readerPages(story), [story]);
  const prefs = useMemo(loadPrefs, []);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<ReadingMode>(isReadingMode(prefs.mode) ? prefs.mode : defaultModeForTier(ageTier));
  const [speed, setSpeed] = useState<SpeedId>(SPEEDS.some(s => s.id === prefs.speed) ? prefs.speed! : defaultSpeedForTier(ageTier));
  const [pianoOn, setPianoOn] = useState(false); // never starts on its own: needs a tap, and is off until the child/teacher chooses it
  const [volume, setVolume] = useState(typeof prefs.volume === 'number' ? prefs.volume : 0.35);
  const [fontStep, setFontStep] = useState(FONT_SCALES.includes(prefs.font ?? 0) ? FONT_SCALES.indexOf(prefs.font!) : 0);
  const [narrating, setNarrating] = useState(false);
  const [activeWord, setActiveWord] = useState(-1);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechMissing, setSpeechMissing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const narrator = useRef<Narrator | null>(null);
  const piano = useRef<Piano | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>();
  const cfg = MODES[mode];
  const page = pages[pageIndex];
  const words = useMemo(() => (page ? tokenizeWords(page.text) : []), [page]);
  const rate = SPEEDS.find((s) => s.id === speed)!.rate;

  // ---- setup / teardown
  useEffect(() => {
    narrator.current = new Narrator();
    piano.current = new Piano();
    if (!narrator.current.supported) setSpeechMissing(true);
    try { setReducedMotion(!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches); } catch { /* ignore */ }
    const loadVoices = () => { const v = window.speechSynthesis?.getVoices?.() || []; if (v.length) setVoice(pickVoice(v)); };
    loadVoices();
    try { window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices); } catch { /* ignore */ }
    return () => {
      clearTimeout(advanceTimer.current);
      narrator.current?.cancel();
      piano.current?.dispose();
      try { window.speechSynthesis?.removeEventListener?.('voiceschanged', loadVoices); } catch { /* ignore */ }
    };
  }, []);

  useEffect(() => { savePrefs({ mode, speed, piano: false, font: FONT_SCALES[fontStep], volume }); }, [mode, speed, fontStep, volume]);

  // ---- piano follows its switch and volume, and gets quieter while the voice is speaking
  useEffect(() => {
    const p = piano.current; if (!p) return;
    if (pianoOn) { if (!p.start()) setPianoOn(false); } else p.stop();
  }, [pianoOn]);
  useEffect(() => { piano.current?.setVolume(volume); }, [volume]);
  useEffect(() => { piano.current?.duck(narrating); }, [narrating]);

  // ---- narration
  const stopNarration = useCallback(() => {
    clearTimeout(advanceTimer.current);
    narrator.current?.cancel();
    setNarrating(false); setActiveWord(-1);
  }, []);

  const goTo = useCallback((i: number) => {
    stopNarration();
    setFinished(false);
    setPageIndex(Math.min(Math.max(i, 0), Math.max(pages.length - 1, 0)));
  }, [pages.length, stopNarration]);

  const speakPage = useCallback(() => {
    if (!page || !narrator.current) return;
    setNarrating(true); setActiveWord(-1);
    narrator.current.speak(page.text, {
      rate, voice,
      onWord: (i) => setActiveWord(i),
      onEnd: () => {
        setNarrating(false); setActiveWord(-1);
        if (!cfg.autoAdvance) return;
        advanceTimer.current = setTimeout(() => {
          if (pageIndex >= pages.length - 1) { setFinished(true); onFinish?.(); } else setPageIndex(pageIndex + 1);
        }, 700);
      },
      onError: () => { setNarrating(false); setActiveWord(-1); setSpeechMissing(true); },
    });
  }, [page, rate, voice, cfg.autoAdvance, pageIndex, pages.length, onFinish]);

  // Read each new page automatically in the modes that do (after the child has pressed Start — browsers need a tap first).
  useEffect(() => {
    if (!started || finished || !cfg.autoNarrate) return;
    speakPage();
    return () => { clearTimeout(advanceTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, pageIndex, mode, finished]);

  const start = () => { setStarted(true); setFinished(false); if (!cfg.autoNarrate) stopNarration(); };
  const next = () => { if (pageIndex >= pages.length - 1) { stopNarration(); setFinished(true); onFinish?.(); } else goTo(pageIndex + 1); };
  const prev = () => goTo(pageIndex - 1);
  const toggleHear = () => { if (narrating) stopNarration(); else speakPage(); };
  const changeMode = (m: ReadingMode) => { stopNarration(); setMode(m); };
  const tapWord = (text: string, i: number) => {
    if (!cfg.tapWords || !narrator.current) return;
    const w = cleanWord(text); if (!w) return;
    clearTimeout(advanceTimer.current);
    setNarrating(true); setActiveWord(i);
    narrator.current.speak(w, { rate: Math.min(rate, 0.8), voice, onEnd: () => { setNarrating(false); setActiveWord(-1); }, onError: () => { setNarrating(false); setActiveWord(-1); } });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('input,select,textarea')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === ' ' && t.tagName !== 'BUTTON') { e.preventDefault(); if (started) toggleHear(); else start(); }
    else if (e.key === 'Escape') onClose?.();
  };

  if (!page) {
    return <div role="status" className="p-8 text-center text-lg font-semibold text-slate-600">This story has no pages to read yet.</div>;
  }

  const gradient = PAGE_GRADIENTS[pageIndex % PAGE_GRADIENTS.length];
  const pic = page.imageUrl || (pageIndex === 0 ? story.imageUrl : '');
  const emoji = page.emoji || story.emojiIcon;
  const motion = reducedMotion ? '' : 'transition-all duration-200';
  const scale = FONT_SCALES[fontStep];

  const btn = 'min-h-[48px] min-w-[48px] rounded-2xl font-bold flex items-center justify-center gap-2 px-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed';

  // ---------------------------------------------------------------- cover
  if (!started) {
    return (
      <section aria-label={`Story book: ${story.title}`} onKeyDown={onKeyDown} tabIndex={0} className="flex flex-col items-center gap-5 p-6 md:p-10 text-center outline-none">
        <div className={cn('w-full max-w-xl aspect-[4/3] rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br shadow-lg', gradient)}>
          {story.imageUrl ? <img src={story.imageUrl} alt={`Cover of ${story.title}`} className="w-full h-full object-cover" /> : <span aria-hidden className="text-8xl">{story.emojiIcon}</span>}
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900">{story.title}</h2>
        <p className="text-slate-600 font-semibold">{pages.length} {pages.length === 1 ? 'page' : 'pages'}</p>

        <div role="radiogroup" aria-label="How would you like to read?" className="grid gap-3 w-full max-w-xl sm:grid-cols-3">
          {MODE_ORDER.map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => changeMode(m)}
              className={cn(btn, 'flex-col h-auto py-4 border-4 text-center', mode === m ? 'bg-indigo-600 text-white border-indigo-800' : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300')}>
              <span className="text-lg">{MODES[m].label}</span>
              <span className={cn('text-sm font-medium', mode === m ? 'text-indigo-100' : 'text-slate-500')}>{MODES[m].hint}</span>
            </button>
          ))}
        </div>

        {speechMissing && <p role="alert" className="text-amber-800 bg-amber-50 border border-amber-300 rounded-xl px-4 py-2 font-semibold">This device can’t read aloud, so the voice is off. You can still read the story.</p>}

        <button type="button" onClick={start} className={cn(btn, 'bg-emerald-600 hover:bg-emerald-700 text-white text-2xl h-16 px-10 shadow-lg')}>
          <BookOpen aria-hidden className="w-7 h-7" /> Start reading
        </button>
      </section>
    );
  }

  // ---------------------------------------------------------------- the end
  if (finished) {
    return (
      <section aria-label="The end" onKeyDown={onKeyDown} tabIndex={0} className="flex flex-col items-center gap-5 p-10 text-center outline-none">
        <PartyPopper aria-hidden className="w-16 h-16 text-amber-500" />
        <h2 className="text-4xl font-black text-slate-900">The End</h2>
        <p className="text-lg text-slate-600 font-semibold">Well done for reading “{story.title}”!</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button type="button" className={cn(btn, 'bg-indigo-600 text-white text-lg')} onClick={() => { setFinished(false); setPageIndex(0); }}><RotateCcw aria-hidden className="w-5 h-5" /> Read again</button>
          {onClose && <button type="button" className={cn(btn, 'bg-white border-4 border-slate-200 text-slate-800 text-lg')} onClick={onClose}>Close the book</button>}
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------- a page
  return (
    <section aria-label={`Story book: ${story.title}`} onKeyDown={onKeyDown} tabIndex={0} className="flex flex-col gap-4 p-4 md:p-6 outline-none">
      <p className="sr-only" role="status" aria-live="polite">Page {pageIndex + 1} of {pages.length}</p>

      <div className={cn('w-full aspect-[16/9] max-h-[42vh] rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br shadow-md', gradient)}>
        {pic ? <img src={pic} alt={`Illustration for page ${pageIndex + 1} of ${story.title}`} className="w-full h-full object-cover" />
             : <span aria-hidden className="text-8xl md:text-9xl select-none">{emoji}</span>}
      </div>

      <div className="rounded-3xl bg-white border-2 border-amber-200 p-5 md:p-8 shadow-inner min-h-[8rem]">
        <p data-testid="page-text" className="font-extrabold text-slate-900 tracking-wide leading-[1.9]" style={{ fontSize: `${(cfg.largeText ? 1.75 : 1.35) * scale}rem` }}>
          {words.map((w, i) => {
            const active = cfg.highlight && i === activeWord;
            return (
              // A real space between words (outside the span) so screen readers, copy/paste and text-only views read normally.
              <Fragment key={`${pageIndex}-${i}`}>
                <span data-word={i} data-active={active ? 'true' : undefined}
                  onClick={() => tapWord(w.text, i)}
                  className={cn('inline-block px-1 rounded-lg', cfg.tapWords && 'cursor-pointer hover:bg-yellow-100', motion,
                    active ? cn('bg-yellow-300 text-yellow-950 ring-2 ring-yellow-500', !reducedMotion && 'scale-110') : '')}>
                  {w.text}
                </span>{' '}
              </Fragment>
            );
          })}
        </p>
      </div>

      {speechMissing && <p role="alert" className="text-amber-800 bg-amber-50 border border-amber-300 rounded-xl px-4 py-2 font-semibold">The voice isn’t available on this device. You can still read the story.</p>}

      {/* progress */}
      <div className="flex items-center justify-center gap-2" aria-hidden>
        {pages.map((_, i) => <span key={i} className={cn('h-3 rounded-full', motion, i === pageIndex ? 'w-8 bg-indigo-600' : i < pageIndex ? 'w-3 bg-indigo-300' : 'w-3 bg-slate-300')} />)}
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" className={cn(btn, 'bg-white border-4 border-slate-200 text-slate-800')} onClick={prev} disabled={pageIndex === 0} aria-label="Previous page"><ChevronLeft aria-hidden className="w-6 h-6" /> Back</button>
        <button type="button" className={cn(btn, 'text-white text-lg px-6', narrating ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700')} onClick={toggleHear} disabled={speechMissing} aria-pressed={narrating}>
          {narrating ? <><Square aria-hidden className="w-5 h-5 fill-current" /> Stop</> : <><Play aria-hidden className="w-5 h-5 fill-current" /> Hear this page</>}
        </button>
        <button type="button" className={cn(btn, 'bg-indigo-600 hover:bg-indigo-700 text-white')} onClick={next} aria-label={pageIndex >= pages.length - 1 ? 'Finish the story' : 'Next page'}>
          {pageIndex >= pages.length - 1 ? 'The End' : 'Next'} <ChevronRight aria-hidden className="w-6 h-6" />
        </button>
      </div>

      {/* settings */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-2xl bg-slate-50 border border-slate-200 p-3 text-sm font-semibold text-slate-700">
        <div role="radiogroup" aria-label="Reading mode" className="flex gap-1">
          {MODE_ORDER.map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => changeMode(m)}
              className={cn(btn, 'text-sm px-3', mode === m ? 'bg-indigo-600 text-white' : 'bg-white border-2 border-slate-200')}>{MODES[m].label}</button>
          ))}
        </div>
        <label className="flex items-center gap-2">Voice speed
          <select value={speed} onChange={(e) => setSpeed(e.target.value as SpeedId)} className="min-h-[48px] rounded-xl border-2 border-slate-200 bg-white px-2">
            {SPEEDS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-1" role="group" aria-label="Text size">
          <button type="button" className={cn(btn, 'bg-white border-2 border-slate-200 px-3')} aria-label="Smaller text" disabled={fontStep === 0} onClick={() => setFontStep((s) => Math.max(0, s - 1))}><Minus aria-hidden className="w-4 h-4" /></button>
          <span aria-hidden>Aa</span>
          <button type="button" className={cn(btn, 'bg-white border-2 border-slate-200 px-3')} aria-label="Bigger text" disabled={fontStep === FONT_SCALES.length - 1} onClick={() => setFontStep((s) => Math.min(FONT_SCALES.length - 1, s + 1))}><Plus aria-hidden className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className={cn(btn, 'px-3', pianoOn ? 'bg-violet-600 text-white' : 'bg-white border-2 border-slate-200')} aria-pressed={pianoOn} onClick={() => setPianoOn((v) => !v)}>
            {pianoOn ? <Music aria-hidden className="w-5 h-5" /> : <VolumeX aria-hidden className="w-5 h-5" />} Soft piano {pianoOn ? 'on' : 'off'}
          </button>
          {pianoOn && (
            <label className="flex items-center gap-2">Music volume
              <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-28" aria-valuetext={`${Math.round(volume * 100)} percent`} />
            </label>
          )}
        </div>
        {onClose && <button type="button" className={cn(btn, 'bg-white border-2 border-slate-200')} onClick={onClose}>Close book</button>}
      </div>
      <p className="text-center text-xs text-slate-500">{cfg.hint} · Keys: ← → turn pages, Space reads.</p>
    </section>
  );
}

'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StoryPackage } from '@/lib/story-library/types';
import type { LibrarySource, StoryPreviewInfo } from '@/lib/story-library/library-source';
import type { ReadMode } from '@/lib/story-library/lazy-loader';
import { presentationFor } from '@/lib/story-library/classification';
import { buildFlow, cleanWord, highlightAt, lookupWord, modeInfo, NO_HIGHLIGHT, pageWords, READ_MODES, scoreResults, syncDescription, type HighlightState } from '@/lib/story-library/reader-logic';
import { loadProgress, saveProgress } from '@/lib/story-library/progress-store';
import { PlaceholderArt } from './PlaceholderArt';
import { ActivityPlayer, type ActivityResult } from './ActivityPlayer';

const SPEEDS = [0.75, 1, 1.25];

export function StorybookReader({ pkg, info, source, onClose }: { pkg: StoryPackage; info?: StoryPreviewInfo; source: LibrarySource; onClose: () => void }) {
  const presentation = useMemo(() => presentationFor(info?.classification.classIds ?? []), [info]);
  const flow = useMemo(() => buildFlow(pkg), [pkg]);
  const resume = useMemo(() => loadProgress(pkg.storyId), [pkg.storyId]);
  const [mode, setMode] = useState<ReadMode>(presentation.defaultMode);
  const [step, setStep] = useState(resume && !resume.done && resume.total === flow.length ? resume.step : 0);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [hl, setHl] = useState<HighlightState>(NO_HIGHLIGHT);
  const [tapped, setTapped] = useState<{ word: string; definition?: string } | null>(null);
  const [results, setResults] = useState<ActivityResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const raf = useRef<number>(0);
  const hlRef = useRef<HighlightState>(NO_HIGHLIGHT);

  const current = flow[step];
  const page = current?.kind === 'page' ? pkg.pages[current.index] : undefined;
  const m = modeInfo(mode);
  const pageNo = page ? page.n : undefined;

  // ---- remember where the child is (device only)
  useEffect(() => { saveProgress(pkg.storyId, { step, total: flow.length, done: finished, updatedAt: Date.now(), mode }); }, [step, finished, mode, pkg.storyId, flow.length]);

  const go = useCallback((delta: number) => {
    setTapped(null);
    setStep((s) => {
      const n = s + delta;
      if (n >= flow.length) { setFinished(true); return s; }
      return Math.max(0, n);
    });
  }, [flow.length]);

  // ---- load narration for the page and (optionally) start it
  useEffect(() => {
    const el = audioRef.current;
    cancelAnimationFrame(raf.current);
    setHl(NO_HIGHLIGHT); hlRef.current = NO_HIGHLIGHT; setPlaying(false); setNeedsTap(false); setAudioError(null);
    if (!el) return;
    el.pause();
    if (!page || !m.narration || !page.audio) { el.removeAttribute('src'); return; }
    let cancelled = false;
    (async () => {
      try {
        await source.loader.showPage(pkg, current!.kind === 'page' ? current.index : 0, mode); // this page + look-ahead; cached after first load
        const url = await source.assets.objectUrl(pkg.assets[page.audio!.hash].path);
        if (cancelled) return;
        el.src = url; el.playbackRate = speed; el.load();
        if (m.autoplay) { try { await el.play(); } catch { if (!cancelled) setNeedsTap(true); } }
      } catch (e) { if (!cancelled) setAudioError('Narration could not be loaded. You can still read the story.'); }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, mode, pkg]);

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = speed; }, [speed]);

  // ---- drive the highlight from the audio clock (media time, so speed/pauses/replays never drift)
  const tick = useCallback(() => {
    const el = audioRef.current;
    if (el && page) {
      const next = highlightAt(page, el.currentTime * 1000, hlRef.current);
      if (next.word !== hlRef.current.word || next.sentence !== hlRef.current.sentence || next.level !== hlRef.current.level) { hlRef.current = next; setHl(next); }
    }
    raf.current = requestAnimationFrame(tick);
  }, [page]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onPlay = () => { setPlaying(true); setNeedsTap(false); cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(tick); };
  const onPause = () => { setPlaying(false); cancelAnimationFrame(raf.current); };
  const onEnded = () => {
    setPlaying(false); cancelAnimationFrame(raf.current);
    if (m.autoAdvance) setTimeout(() => go(1), 900);
  };
  const toggle = async () => {
    const el = audioRef.current; if (!el || !el.src) return;
    if (el.paused) { try { await el.play(); } catch { setNeedsTap(true); } } else el.pause();
  };
  const replay = async () => { const el = audioRef.current; if (!el || !el.src) return; el.currentTime = 0; setHl(NO_HIGHLIGHT); hlRef.current = NO_HIGHLIGHT; try { await el.play(); } catch { setNeedsTap(true); } };

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
    const g = page ? lookupWord(pkg.glossary, page.n, token) : undefined;
    const w = cleanWord(token) || token;
    setTapped({ word: w, definition: g?.definition });
    speakWord(w);
  };
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const art = info?.pages[page ? page.n - 1 : 0];
  const words = page ? pageWords(page) : undefined;
  const fontSize = `clamp(1.15rem, 5.4vw, ${1.35 * presentation.textScale}rem)`;
  const [c0, c1] = info?.palette ?? ['#e2e8f0', '#94a3b8'];

  if (finished) {
    const sc = scoreResults(results);
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl" data-testid="story-end">
        <div className="text-6xl" aria-hidden>🎉</div>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">The End</h2>
        <p className="mt-2 text-lg text-slate-700">{pkg.title}</p>
        {results.length > 0 && <p className="mt-4 text-lg text-slate-700">You tried <strong>{sc.answered}</strong> activities{sc.scored > 0 && <>, and got <strong>{sc.correct}</strong> of <strong>{sc.scored}</strong> right</>}.</p>}
        <p className="mt-2 text-sm text-slate-500">Preview note: results stay on this screen and are not saved or sent anywhere.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="rounded-full bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300" onClick={() => { setFinished(false); setStep(0); setResults([]); }}>Read again</button>
          <button className="rounded-full border-2 border-slate-300 px-6 py-3 font-bold text-slate-800 hover:bg-slate-50" onClick={onClose}>Back to library</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl" data-testid="reader" data-presentation={presentation.id}>
      <audio ref={audioRef} onPlay={onPlay} onPause={onPause} onEnded={onEnded} onError={() => setAudioError('Narration could not be played.')} preload="auto" />
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
          <label className="flex items-center gap-1 text-sm font-semibold text-slate-700">Speed
            <select aria-label="Narration speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-lg border border-slate-300 bg-white px-2 py-1">
              {SPEEDS.map((s) => <option key={s} value={s}>{s}×</option>)}
            </select>
          </label>
        )}
      </header>

      <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">{source.notice}</p>

      {current?.kind === 'activity' && (
        <ActivityPlayer key={current.activity.id} activity={current.activity} onDone={(r) => { setResults((x) => [...x.filter((y) => y.id !== r.id), r]); go(1); }} />
      )}

      {page && (
        <div className={`grid gap-4 ${presentation.layout === 'text-first' ? 'md:grid-cols-[1fr_320px]' : presentation.layout === 'picture-first' ? '' : 'md:grid-cols-2'}`}>
          <div className={presentation.layout === 'text-first' ? 'order-2 md:order-2' : ''}>
            <PlaceholderArt motif={art?.motif ?? '📖'} palette={[c0, c1]} alt={page.alt ?? 'Illustration'} brief={art?.brief} compact={presentation.layout === 'text-first'} />
          </div>
          <article aria-label={`Page ${page.n} of ${pkg.pages.length}`} className="flex flex-col justify-center rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200 md:p-8">
            <p className="text-lg leading-[1.9] text-slate-900" style={{ fontSize, fontFamily: 'Andika, Nunito, system-ui, sans-serif' }} data-testid="page-text">
              {words!.tokens.map((t, i) => {
                const active = hl.level === 'word' ? hl.word === i : hl.level === 'sentence' ? words!.sentenceOfToken[i] === hl.sentence : false;
                const inSentence = hl.level === 'word' && words!.sentenceOfToken[i] === hl.sentence;
                return (
                  <span key={i}>
                    <button type="button" onClick={() => tapWord(t)} aria-label={`${t} (tap for help)`}
                      data-active={active ? 'true' : undefined}
                      className={`rounded-lg px-1 py-0.5 text-inherit transition-colors motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-indigo-400 ${active && hl.level === 'word' ? 'bg-yellow-300 shadow' : active ? 'bg-yellow-200' : inSentence ? 'bg-yellow-50' : 'hover:bg-indigo-50'}`}>{t}</button>{' '}
                  </span>
                );
              })}
            </p>
            {tapped && (
              <div role="status" aria-live="polite" className="mt-4 rounded-2xl bg-indigo-50 p-3 text-slate-900" data-testid="word-help">
                <p className="text-xl font-extrabold">{tapped.word}</p>
                <p className="text-base">{tapped.definition ?? 'No word help for this word yet.'}</p>
                {canSpeak && <p className="mt-1 text-xs text-slate-600">Spoken by your device’s voice, not the story narrator.</p>}
                <div className="mt-2 flex gap-2">
                  {canSpeak && <button type="button" onClick={() => speakWord(tapped.word)} className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-bold text-white">🔊 Hear it</button>}
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
          {audioError && <span className="ml-1 font-semibold text-red-700"> {audioError}</span>}
        </p>
        <p className="text-center text-[11px] text-slate-500">Background music: not included in this preview. {m.blurb}</p>
      </footer>
    </div>
  );
}

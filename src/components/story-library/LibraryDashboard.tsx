'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CatalogueEntry, StoryPackage } from '@/lib/story-library/types';
import { createPreviewSource, type LibrarySource } from '@/lib/story-library/library-source';
import { CLASS_REGISTRY, GENRES, READING_LEVELS, presentationFor } from '@/lib/story-library/classification';
import { FilteredFeed, planQuery, type Selection } from '@/lib/story-library/dashboard-query';
import { loadProgress } from '@/lib/story-library/progress-store';
import { PlaceholderArt } from './PlaceholderArt';
import { StorybookReader } from './StorybookReader';

const label = (list: readonly { id: string; label: string }[], id?: string) => list.find((x) => x.id === id)?.label ?? id ?? '';
const minutes = (s?: number) => (s ? `${Math.max(1, Math.round(s / 60))} min` : '');

export function LibraryDashboard({ createSource = createPreviewSource }: { createSource?: () => Promise<LibrarySource> }) {
  const [source, setSource] = useState<LibrarySource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sel, setSel] = useState<Selection>({});
  const [entries, setEntries] = useState<CatalogueEntry[]>([]);
  const [exhausted, setExhausted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<{ pkg: StoryPackage; entry: CatalogueEntry } | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // refresh stats after actions
  const feed = useRef<FilteredFeed | null>(null);

  useEffect(() => {
    let live = true;
    createSource().then(async (s) => { await s.catalogue.startSession(); if (live) setSource(s); }).catch((e) => live && setError(String(e?.message ?? e)));
    return () => { live = false; };
  }, [createSource]);

  const run = useCallback(async (s: LibrarySource, selection: Selection) => {
    setLoading(true);
    try {
      const f = new FilteredFeed(s.catalogue, planQuery(selection));
      feed.current = f;
      await f.loadMore(12);
      if (feed.current === f) { setEntries([...f.entries]); setExhausted(f.exhausted); }
    } catch (e: any) { setError(String(e?.message ?? e)); } finally { setLoading(false); setTick((t) => t + 1); }
  }, []);

  useEffect(() => { if (source) run(source, sel); }, [source, sel, run]);

  const more = async () => { if (!feed.current || !source) return; setLoading(true); await feed.current.loadMore(12); setEntries([...feed.current.entries]); setExhausted(feed.current.exhausted); setLoading(false); setTick((t) => t + 1); };

  const openStory = async (e: CatalogueEntry) => {
    if (!source) return;
    setOpening(e.storyKey);
    try { const pkg = await source.loader.openPackage(e.packagePath); setOpen({ pkg, entry: e }); }
    catch { setError('That story could not be opened. Check your connection and try again.'); }
    finally { setOpening(null); setTick((t) => t + 1); }
  };

  if (error && !source) return <div role="alert" className="mx-auto max-w-xl rounded-2xl bg-red-50 p-6 text-red-900 ring-1 ring-red-200">The library could not be loaded: {error}</div>;
  if (!source) return <div className="p-10 text-center text-lg font-semibold text-slate-600" role="status">Opening the library…</div>;

  if (open) return <StorybookReader pkg={open.pkg} info={source.info(open.pkg.storyId)} source={source} onClose={() => { setOpen(null); setTick((t) => t + 1); }} />;

  const sc = (k: keyof Selection, v: string | number | undefined) => setSel((s) => ({ ...s, [k]: v === '' ? undefined : v }));
  const active = Object.values(sel).some((v) => v !== undefined);

  return (
    <div className="mx-auto w-full max-w-6xl" data-testid="library">
      <section className="mb-5 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 p-6 text-white shadow-lg">
        <p className="text-sm font-bold uppercase tracking-widest text-white/80">GAM EDU</p>
        <h1 className="text-3xl font-black md:text-4xl" style={{ fontFamily: 'Fredoka, Nunito, system-ui, sans-serif' }}>Story Spark Library</h1>
        <p className="mt-1 max-w-2xl text-white/90">Illustrated, narrated stories for every class from Nursery to JHS. Pick a story, choose how you want to read it, and try the activities.</p>
      </section>
      {source.notice && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200" role="note">{source.notice}</p>}

      <form className="mb-5 grid gap-3 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-5" aria-label="Filter stories" onSubmit={(e) => e.preventDefault()}>
        <Field label="Class"><select aria-label="Class" value={sel.classId ?? ''} onChange={(e) => sc('classId', e.target.value)} className={selectCls}>
          <option value="">All classes</option>{CLASS_REGISTRY.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></Field>
        <Field label="Age"><select aria-label="Age" value={sel.ageYears ?? ''} onChange={(e) => sc('ageYears', e.target.value === '' ? undefined : Number(e.target.value))} className={selectCls}>
          <option value="">Any age</option>{Array.from({ length: 14 }, (_, i) => i + 2).map((a) => <option key={a} value={a}>{a} years</option>)}</select></Field>
        <Field label="Genre"><select aria-label="Genre" value={sel.genre ?? ''} onChange={(e) => sc('genre', e.target.value)} className={selectCls}>
          <option value="">All genres</option>{GENRES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}</select></Field>
        <Field label="Reading level"><select aria-label="Reading level" value={sel.readingLevel ?? ''} onChange={(e) => sc('readingLevel', e.target.value)} className={selectCls}>
          <option value="">All levels</option>{READING_LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}</select></Field>
        <div className="flex items-end"><button type="button" disabled={!active} onClick={() => setSel({})} className="w-full rounded-xl border-2 border-slate-300 px-4 py-2 font-bold text-slate-800 disabled:opacity-40">Clear filters</button></div>
      </form>

      <p className="mb-3 text-sm font-semibold text-slate-600" aria-live="polite" data-testid="result-count">
        {loading && !entries.length ? 'Loading stories…' : `${entries.length} ${entries.length === 1 ? 'story' : 'stories'}${active ? ' match your filters' : ''}${exhausted ? '' : ' so far'}`}
      </p>

      {!loading && entries.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow ring-1 ring-slate-200" data-testid="empty">
          <div className="text-5xl" aria-hidden>📚</div>
          <p className="mt-2 text-lg font-bold text-slate-800">No stories match these filters yet.</p>
          <p className="text-slate-600">Try clearing a filter to see all available stories.</p>
        </div>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="story-grid">
        {entries.map((e) => <StoryCard key={e.storyKey} entry={e} source={source} busy={opening === e.storyKey} onOpen={() => openStory(e)} tick={tick} />)}
      </ul>
      {!exhausted && entries.length > 0 && <div className="mt-6 text-center"><button type="button" onClick={more} disabled={loading} className="rounded-full bg-indigo-600 px-6 py-3 font-bold text-white disabled:opacity-50">Show more stories</button></div>}
      {error && <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-900">{error}</div>}
    </div>
  );
}

const selectCls = 'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none';
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block text-sm font-bold text-slate-700"><span className="mb-1 block">{label}</span>{children}</label>;

function StoryCard({ entry, source, busy, onOpen, tick }: { entry: CatalogueEntry; source: LibrarySource; busy: boolean; onOpen: () => void; tick: number }) {
  const info = source.info(entry.storyKey);
  const progress = useMemo(() => loadProgress(entry.storyKey), [entry.storyKey, tick]);
  const presentation = presentationFor(entry.classIds ?? []);
  const classes = (entry.classIds ?? []);
  const classText = classes.length > 2 ? `${label(CLASS_REGISTRY, classes[0])} to ${label(CLASS_REGISTRY, classes[classes.length - 1])}` : classes.map((c) => label(CLASS_REGISTRY, c)).join(', ');
  return (
    <li className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-200 transition hover:shadow-xl motion-reduce:transition-none" data-testid="story-card" data-story={entry.storyKey}>
      <PlaceholderArt
        motif={info?.pages[0]?.motif ?? '📖'}
        palette={info?.palette ?? ['#e2e8f0', '#94a3b8']}
        alt={`Cover for ${entry.title}`}
        imageSrc={`/story-spark-preview/candidates/${entry.storyKey}/page1-1.webp`}
        compact
      />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-xl font-extrabold leading-tight text-slate-900" style={{ fontFamily: 'Fredoka, Nunito, system-ui, sans-serif' }}>{entry.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{entry.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-bold">
          <Chip tone="indigo">{classText}</Chip>
          {entry.ageMin !== undefined && <Chip>{`Ages ${entry.ageMin}-${entry.ageMax}`}</Chip>}
          <Chip>{label(READING_LEVELS, entry.readingLevel)}</Chip>
          {(entry.genres ?? []).slice(0, 2).map((g) => <Chip key={g}>{label(GENRES, g)}</Chip>)}
          {entry.durationSec && <Chip>{minutes(entry.durationSec)}</Chip>}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
          {entry.hasNarration && <Chip tone="amber">🔊 Audio Narration</Chip>}
          {entry.hasActivities && <Chip tone="emerald">✨ Activities</Chip>}
          <Chip tone="indigo">🎨 Illustrated</Chip>
        </div>
        <div className="mt-auto pt-4">
          <button type="button" onClick={onOpen} disabled={busy} aria-label={`Open ${entry.title}`}
            className="w-full rounded-full bg-indigo-600 px-5 py-3 text-lg font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60">
            {busy ? 'Opening…' : progress && !progress.done ? 'Continue reading' : progress?.done ? 'Read again' : 'Read this story'}
          </button>
          <p className="mt-1 text-center text-[11px] text-slate-500">{presentation.label} style</p>
        </div>
      </div>
    </li>
  );
}

const tones: Record<string, string> = { indigo: 'bg-indigo-100 text-indigo-800', amber: 'bg-amber-100 text-amber-900', emerald: 'bg-emerald-100 text-emerald-900', slate: 'bg-slate-200 text-slate-800', default: 'bg-slate-100 text-slate-700' };
const Chip = ({ children, tone = 'default' }: { children: React.ReactNode; tone?: keyof typeof tones }) => <span className={`rounded-full px-2.5 py-1 ${tones[tone]}`}>{children}</span>;

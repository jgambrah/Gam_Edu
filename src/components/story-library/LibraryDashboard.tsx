'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CatalogueEntry, StoryPackage } from '@/lib/story-library/types';
import { createPreviewSource, type LibrarySource } from '@/lib/story-library/library-source';
import { CLASS_REGISTRY, GENRES, READING_LEVELS, presentationFor } from '@/lib/story-library/classification';
import { FilteredFeed, planQuery, type Selection } from '@/lib/story-library/dashboard-query';
import { loadFavourites, loadProgress, toggleFavourite } from '@/lib/story-library/progress-store';
import { PlaceholderArt } from './PlaceholderArt';
import { StorybookReader } from './StorybookReader';

const label = (list: readonly { id: string; label: string }[], id?: string) => list.find((x) => x.id === id)?.label ?? id ?? '';
const minutes = (s?: number) => (s ? `${Math.max(1, Math.round(s / 60))} min` : '');

export type StageFilterId = 'all' | 'early-years' | 'lower-primary' | 'upper-primary' | 'jhs';
export type CollectionShelfId =
  | 'all'
  | 'continue'
  | 'favourites'
  | 'completed'
  | 'folktales'
  | 'stem'
  | 'mysteries'
  | 'adventure'
  | 'money'
  | 'poetry'
  | 'bedtime';

const STAGE_GROUPS: { id: StageFilterId; label: string; classes: readonly string[] }[] = [
  { id: 'all', label: 'All Stories', classes: [] },
  { id: 'early-years', label: '🌱 Nursery & KG', classes: ['nursery-1', 'nursery-2', 'kg-1', 'kg-2'] },
  { id: 'lower-primary', label: '📘 Primary 1–3', classes: ['primary-1', 'primary-2', 'primary-3'] },
  { id: 'upper-primary', label: '📗 Primary 4–6', classes: ['primary-4', 'primary-5', 'primary-6'] },
  { id: 'jhs', label: '🎓 JHS 1–3', classes: ['jhs-1', 'jhs-2', 'jhs-3'] },
];

interface CollectionShelf {
  id: CollectionShelfId;
  label: string;
  blurb: string;
  match: (e: CatalogueEntry, ctx: { favs: Set<string>; inProgress: Set<string>; completed: Set<string> }) => boolean;
}

const COLLECTION_SHELVES: CollectionShelf[] = [
  {
    id: 'all',
    label: '✨ All Collections',
    blurb: 'Explore the complete GAM EDU Story Spark library across all subjects and ages.',
    match: () => true,
  },
  {
    id: 'continue',
    label: '▶️ Continue Reading',
    blurb: 'Pick up right where you left off in stories you have already started.',
    match: (e, ctx) => ctx.inProgress.has(e.storyKey),
  },
  {
    id: 'favourites',
    label: '❤️ My Favourites',
    blurb: 'Your personal bookshelf of saved favourite stories and poems.',
    match: (e, ctx) => ctx.favs.has(e.storyKey),
  },
  {
    id: 'completed',
    label: '🏆 Finished Books',
    blurb: 'Stories and poems you have read all the way to the end.',
    match: (e, ctx) => ctx.completed.has(e.storyKey),
  },
  {
    id: 'folktales',
    label: '🕷️ Ananse & Folktales',
    blurb: 'Beloved Ghanaian folktales, proverbs, and cultural wisdom retold for today’s learners.',
    match: (e) => (e.genres ?? []).includes('folktale') || (e.categories ?? []).includes('folktale') || /ananse/i.test(e.title),
  },
  {
    id: 'stem',
    label: '🔬 Young Scientists & Tech',
    blurb: 'Hands-on science, nature investigations, space, drones, coding, and discovery.',
    match: (e) =>
      (e.genres ?? []).some((g) => g === 'science' || g === 'nature') ||
      (e.themes ?? []).some((t) => t === 'technology' || t === 'environment' || t === 'weather'),
  },
  {
    id: 'mysteries',
    label: '🕵️ Mysteries & Heritage',
    blurb: 'Spooky science, historical mysteries, and deep-time detective stories from Ghana and the world.',
    match: (e) =>
      (e.genres ?? []).some((g) => g === 'mystery' || g === 'historical' || g === 'cultural') ||
      (e.themes ?? []).includes('fear-and-courage'),
  },
  {
    id: 'adventure',
    label: '🧭 Big Adventures',
    blurb: 'Rainforests, deep oceans, craters, and brave journeys where thinking saves the day.',
    match: (e) => (e.genres ?? []).includes('adventure'),
  },
  {
    id: 'money',
    label: '💰 Smart Money & Makers',
    blurb: 'Financial literacy, honest business, saving, entrepreneurship, and leadership.',
    match: (e) =>
      (e.themes ?? []).some((t) => t === 'money-and-work' || t === 'leadership') ||
      (e.objectives ?? []).includes('financial-literacy'),
  },
  {
    id: 'poetry',
    label: '🎭 Poetry & Rhymes',
    blurb: 'Nursery action rhymes, Ghanaian performance poems, and BECE literature practice.',
    match: (e) => (e.genres ?? []).includes('poetry') || /\((a poem|a rhyme)\)/i.test(e.title),
  },
  {
    id: 'bedtime',
    label: '🌙 Bedtime & Early Years',
    blurb: 'Gentle, soothing read-alouds and animal stories for our youngest listeners.',
    match: (e) => (e.genres ?? []).some((g) => g === 'bedtime' || g === 'animal') && (e.ageMin ?? 99) <= 7,
  },
];

export function LibraryDashboard({
  createSource = createPreviewSource,
  defaultStage = 'all',
  activeAgeTier,
}: {
  createSource?: () => Promise<LibrarySource>;
  defaultStage?: StageFilterId;
  activeAgeTier?: string;
}) {
  const [source, setSource] = useState<LibrarySource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sel, setSel] = useState<Selection>({});
  const [stage, setStage] = useState<StageFilterId>(defaultStage);
  const [shelf, setShelf] = useState<CollectionShelfId>('all');
  const [search, setSearch] = useState<string>('');
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
      const f = new FilteredFeed(s.catalogue, planQuery(selection), 50, 10);
      feed.current = f;
      await f.loadMore(500);
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

  const progressSnapshot = useMemo(() => {
    void tick;
    const favs = loadFavourites();
    const inProgress = new Set<string>();
    const completed = new Set<string>();
    for (const e of entries) {
      const p = loadProgress(e.storyKey);
      if (!p) continue;
      if (p.done) completed.add(e.storyKey);
      else if (p.step > 0) inProgress.add(e.storyKey);
    }
    return { favs, inProgress, completed };
  }, [entries, tick]);

  const visibleEntries = useMemo(() => {
    const stageDef = STAGE_GROUPS.find((g) => g.id === stage);
    const shelfDef = COLLECTION_SHELVES.find((c) => c.id === shelf);
    const q = search.trim().toLowerCase();

    const filtered = entries.filter((e) => {
      if (stageDef && stageDef.id !== 'all' && !(e.classIds ?? []).some((c) => stageDef.classes.includes(c))) {
        return false;
      }
      if (shelfDef && shelfDef.id !== 'all' && !shelfDef.match(e, progressSnapshot)) {
        return false;
      }
      if (q) {
        const hay = `${e.title} ${e.summary ?? ''} ${(e.genres ?? []).join(' ')} ${(e.themes ?? []).join(' ')} ${e.storyKey}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (activeAgeTier && stage === 'all' && !sel.classId) {
      return [...filtered].sort((a, b) => (a.ageMin ?? 99) - (b.ageMin ?? 99));
    }
    return filtered;
  }, [entries, stage, shelf, search, progressSnapshot, activeAgeTier, sel.classId]);

  if (error && !source) return <div role="alert" className="mx-auto max-w-xl rounded-2xl bg-red-50 p-6 text-red-900 ring-1 ring-red-200">The library could not be loaded: {error}</div>;
  if (!source) return <div className="p-10 text-center text-lg font-semibold text-slate-600" role="status">Opening the library…</div>;

  if (open) return <StorybookReader pkg={open.pkg} info={source.info(open.pkg.storyId)} source={source} onClose={() => { setOpen(null); setTick((t) => t + 1); }} />;

  const sc = (k: keyof Selection, v: string | number | undefined) => {
    if (k === 'classId' && v !== '' && v !== undefined) setStage('all');
    setSel((s) => ({ ...s, [k]: v === '' ? undefined : v }));
  };
  const active = Object.values(sel).some((v) => v !== undefined) || stage !== 'all' || shelf !== 'all' || search.trim() !== '';
  const activeShelf = COLLECTION_SHELVES.find((c) => c.id === shelf) ?? COLLECTION_SHELVES[0];

  return (
    <div className="mx-auto w-full max-w-6xl" data-testid="library">
      <section className="mb-5 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-white/80">GAM EDU</p>
            <h1 className="text-3xl font-black md:text-4xl" style={{ fontFamily: 'Fredoka, Nunito, system-ui, sans-serif' }}>Story Spark Library</h1>
            <p className="mt-1 max-w-2xl text-white/90">Illustrated, narrated stories & poems for every class from Nursery to JHS. Pick a collection, choose your reading mode, and explore.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-extrabold">
            <button
              type="button"
              onClick={() => setShelf('all')}
              className="rounded-2xl bg-white/15 px-3.5 py-2 text-left backdrop-blur hover:bg-white/25"
            >
              <span className="block text-lg font-black">{entries.length}</span>
              <span className="text-white/85">📚 Books & Poems</span>
            </button>
            <button
              type="button"
              onClick={() => setShelf(shelf === 'continue' ? 'all' : 'continue')}
              className={`rounded-2xl px-3.5 py-2 text-left backdrop-blur transition ${shelf === 'continue' ? 'bg-white text-indigo-900 shadow' : 'bg-white/15 hover:bg-white/25'}`}
            >
              <span className="block text-lg font-black">{progressSnapshot.inProgress.size}</span>
              <span>▶️ In Progress</span>
            </button>
            <button
              type="button"
              onClick={() => setShelf(shelf === 'completed' ? 'all' : 'completed')}
              className={`rounded-2xl px-3.5 py-2 text-left backdrop-blur transition ${shelf === 'completed' ? 'bg-white text-indigo-900 shadow' : 'bg-white/15 hover:bg-white/25'}`}
            >
              <span className="block text-lg font-black">{progressSnapshot.completed.size}</span>
              <span>🏆 Finished</span>
            </button>
            <button
              type="button"
              onClick={() => setShelf(shelf === 'favourites' ? 'all' : 'favourites')}
              className={`rounded-2xl px-3.5 py-2 text-left backdrop-blur transition ${shelf === 'favourites' ? 'bg-white text-rose-700 shadow' : 'bg-white/15 hover:bg-white/25'}`}
            >
              <span className="block text-lg font-black">{progressSnapshot.favs.size}</span>
              <span>❤️ Favourites</span>
            </button>
          </div>
        </div>
      </section>
      {source.notice && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200" role="note">{source.notice}</p>}

      {/* Curated Collection Shelves (Epic!-inspired) */}
      <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1.5" role="group" aria-label="Curated story collections">
        {COLLECTION_SHELVES.map((c) => {
          const isSelected = shelf === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setShelf(isSelected && c.id !== 'all' ? 'all' : c.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
                isSelected
                  ? 'bg-violet-700 text-white shadow-sm ring-2 ring-violet-300'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-violet-50'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {shelf !== 'all' && (
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-violet-50 px-4 py-2.5 text-sm text-violet-950 ring-1 ring-violet-200" data-testid="collection-banner">
          <div>
            <span className="font-extrabold">{activeShelf.label}:</span>{' '}
            <span>{activeShelf.blurb}</span>
          </div>
          <button type="button" onClick={() => setShelf('all')} className="ml-3 shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-800 ring-1 ring-violet-200 hover:bg-violet-100">
            Show all
          </button>
        </div>
      )}

      {/* Stage filter + Instant search bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="School stage filter">
          {STAGE_GROUPS.map((g) => {
            const isActive = stage === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => { setStage(g.id); if (g.id !== 'all') setSel((s) => ({ ...s, classId: undefined })); }}
                className={`rounded-full px-4 py-1.5 text-sm font-extrabold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-indigo-50'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <input
            type="search"
            aria-label="Search stories"
            placeholder="🔍 Search title, topic, or character…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border-2 border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <form className="mb-5 grid gap-3 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-5" aria-label="Filter stories" onSubmit={(e) => e.preventDefault()}>
        <Field label="Class"><select aria-label="Class" value={sel.classId ?? ''} onChange={(e) => sc('classId', e.target.value)} className={selectCls}>
          <option value="">All classes</option>{CLASS_REGISTRY.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></Field>
        <Field label="Age"><select aria-label="Age" value={sel.ageYears ?? ''} onChange={(e) => sc('ageYears', e.target.value === '' ? undefined : Number(e.target.value))} className={selectCls}>
          <option value="">Any age</option>{Array.from({ length: 14 }, (_, i) => i + 2).map((a) => <option key={a} value={a}>{a} years</option>)}</select></Field>
        <Field label="Genre"><select aria-label="Genre" value={sel.genre ?? ''} onChange={(e) => sc('genre', e.target.value)} className={selectCls}>
          <option value="">All genres</option>{GENRES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}</select></Field>
        <Field label="Reading level"><select aria-label="Reading level" value={sel.readingLevel ?? ''} onChange={(e) => sc('readingLevel', e.target.value)} className={selectCls}>
          <option value="">All levels</option>{READING_LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}</select></Field>
        <div className="flex items-end"><button type="button" disabled={!active} onClick={() => { setSel({}); setStage('all'); setShelf('all'); setSearch(''); }} className="w-full rounded-xl border-2 border-slate-300 px-4 py-2 font-bold text-slate-800 disabled:opacity-40">Clear filters</button></div>
      </form>

      <p className="mb-3 text-sm font-semibold text-slate-600" aria-live="polite" data-testid="result-count">
        {loading && !visibleEntries.length ? 'Loading stories…' : `${visibleEntries.length} ${visibleEntries.length === 1 ? 'story' : 'stories'}${active ? ' match your filters' : ''}${exhausted ? '' : ' so far'}`}
      </p>

      {!loading && visibleEntries.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow ring-1 ring-slate-200" data-testid="empty">
          <div className="text-5xl" aria-hidden>📚</div>
          <p className="mt-2 text-lg font-bold text-slate-800">No stories match these filters yet.</p>
          <p className="text-slate-600">Try clearing a filter to see all available stories.</p>
        </div>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="story-grid">
        {visibleEntries.map((e) => (
          <StoryCard
            key={e.storyKey}
            entry={e}
            source={source}
            busy={opening === e.storyKey}
            isFav={progressSnapshot.favs.has(e.storyKey)}
            onToggleFav={() => {
              toggleFavourite(e.storyKey);
              setTick((t) => t + 1);
            }}
            onOpen={() => openStory(e)}
            tick={tick}
          />
        ))}
      </ul>
      {!exhausted && entries.length > 0 && <div className="mt-6 text-center"><button type="button" onClick={more} disabled={loading} className="rounded-full bg-indigo-600 px-6 py-3 font-bold text-white disabled:opacity-50">Show more stories</button></div>}
      {error && <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-900">{error}</div>}
    </div>
  );
}

const selectCls = 'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none';
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block text-sm font-bold text-slate-700"><span className="mb-1 block">{label}</span>{children}</label>;

function StoryCard({ entry, source, busy, isFav, onToggleFav, onOpen, tick }: { entry: CatalogueEntry; source: LibrarySource; busy: boolean; isFav: boolean; onToggleFav: () => void; onOpen: () => void; tick: number }) {
  const info = source.info(entry.storyKey);
  const progress = useMemo(() => loadProgress(entry.storyKey), [entry.storyKey, tick]);
  const presentation = presentationFor(entry.classIds ?? []);
  const classes = (entry.classIds ?? []);
  const classText = classes.length > 2 ? `${label(CLASS_REGISTRY, classes[0])} to ${label(CLASS_REGISTRY, classes[classes.length - 1])}` : classes.map((c) => label(CLASS_REGISTRY, c)).join(', ');
  return (
    <li className="relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-200 transition hover:shadow-xl motion-reduce:transition-none" data-testid="story-card" data-story={entry.storyKey}>
      <div className="relative">
        <PlaceholderArt
          motif={info?.pages?.[0]?.motif ?? '📖'}
          palette={info?.palette ?? ['#e2e8f0', '#94a3b8']}
          alt={`Cover for ${entry.title}`}
          imageSrc={`/story-spark-preview/candidates/${entry.storyKey}/page1-1.webp`}
          compact
        />
        <button
          type="button"
          onClick={onToggleFav}
          aria-label={isFav ? `Remove ${entry.title} from favourites` : `Save ${entry.title} to favourites`}
          aria-pressed={isFav}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-base shadow backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-rose-400 ${
            isFav ? 'bg-rose-600 text-white' : 'bg-white/85 text-slate-700 hover:bg-white'
          }`}
          title={isFav ? 'Saved in My Favourites' : 'Save to My Favourites'}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
        {progress && !progress.done && progress.step > 0 && (
          <span className="absolute bottom-2 left-3 rounded-full bg-indigo-900/85 px-2.5 py-0.5 text-[11px] font-extrabold text-white backdrop-blur">
            In progress • Step {progress.step + 1}/{progress.total}
          </span>
        )}
        {progress?.done && (
          <span className="absolute bottom-2 left-3 rounded-full bg-emerald-700/90 px-2.5 py-0.5 text-[11px] font-extrabold text-white backdrop-blur">
            ✔ Completed
          </span>
        )}
      </div>
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

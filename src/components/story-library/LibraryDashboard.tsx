'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PUBLISHED_PREFIX, type CatalogueEntry, type StoryPackage } from '@/lib/story-library/types';
import { createPreviewSource, type LibrarySource } from '@/lib/story-library/library-source';
import { CLASS_REGISTRY, GENRES, READING_LEVELS, presentationFor } from '@/lib/story-library/classification';
import { FilteredFeed, planQuery, type Selection } from '@/lib/story-library/dashboard-query';
import { loadProgressSnapshot, subscribeProgressChanges, toggleFavourite, type LocalProgress } from '@/lib/story-library/progress-store';
import {
  formatQuarantineBadge,
  getStoryQuarantineStatus,
  isDeveloperReviewer,
  isStoryVisibleToViewer,
  loadCachedViewerEmail,
  loadLocalReviewOverrides,
  saveLocalReviewOverrides,
  type StoryQuarantineStatus,
} from '@/lib/story-library/quarantine';
import { loadInterests, subscribeInterestChanges, toggleInterest } from '@/lib/story-library/interests';
import { recommendReadNext } from '@/lib/story-library/recommendations';
import { PlaceholderArt } from './PlaceholderArt';
import { StorybookReader } from './StorybookReader';
import { LibraryToolbar, type ShelfGroup, type ToolbarChip } from './LibraryToolbar';
import { ReadNextShelf } from './ReadNextShelf';

const label = (list: readonly { id: string; label: string }[], id?: string) => list.find((x) => x.id === id)?.label ?? id ?? '';
const minutes = (s?: number) => (s ? `${Math.max(1, Math.round(s / 60))} min` : '');

const INITIAL_FEED_BATCH = 300;
const INITIAL_RENDER_WINDOW = 300;
const RENDER_WINDOW_STEP = 60;

export type StageFilterId = 'all' | 'early-years' | 'lower-primary' | 'upper-primary' | 'jhs';
export type CollectionShelfId =
  | 'all'
  | 'under-review'
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
  /** Which group of the Collection dropdown the shelf sits under. */
  group: ShelfGroup;
  blurb: string;
  developerOnly?: boolean;
  match: (e: CatalogueEntry, ctx: { favs: Set<string>; inProgress: Set<string>; completed: Set<string>; quarantined: Set<string> }) => boolean;
}

const COLLECTION_SHELVES: CollectionShelf[] = [
  {
    id: 'all',
    group: 'browse',
    label: '✨ All Collections',
    blurb: 'Explore the complete GAM EDU Story Spark library across all subjects and ages.',
    match: () => true,
  },
  {
    id: 'under-review',
    group: 'review',
    label: '🛡️ Under Review (48h)',
    blurb: 'Developer quarantine inbox (jamesgambrah@gmail.com only): newly seeded stories stay private here for 48 hours before auto-promoting to schools and readers, unless held.',
    developerOnly: true,
    match: (e, ctx) => ctx.quarantined.has(e.storyKey),
  },
  {
    id: 'continue',
    group: 'mine',
    label: '▶️ Continue Reading',
    blurb: 'Pick up right where you left off in stories you have already started.',
    match: (e, ctx) => ctx.inProgress.has(e.storyKey),
  },
  {
    id: 'favourites',
    group: 'mine',
    label: '❤️ My Favourites',
    blurb: 'Your personal bookshelf of saved favourite stories and poems.',
    match: (e, ctx) => ctx.favs.has(e.storyKey),
  },
  {
    id: 'completed',
    group: 'mine',
    label: '🏆 Finished Books',
    blurb: 'Stories and poems you have read all the way to the end.',
    match: (e, ctx) => ctx.completed.has(e.storyKey),
  },
  {
    id: 'folktales',
    group: 'topics',
    label: '🕷️ Ananse & Folktales',
    blurb: 'Beloved Ghanaian folktales, proverbs, and cultural wisdom retold for today’s learners.',
    match: (e) => (e.genres ?? []).includes('folktale') || (e.categories ?? []).includes('folktale') || /ananse/i.test(e.title),
  },
  {
    id: 'stem',
    group: 'topics',
    label: '🔬 Young Scientists & Tech',
    blurb: 'Hands-on science, nature investigations, space, drones, coding, and discovery.',
    match: (e) =>
      (e.genres ?? []).some((g) => g === 'science' || g === 'nature') ||
      (e.themes ?? []).some((t) => t === 'technology' || t === 'environment' || t === 'weather'),
  },
  {
    id: 'mysteries',
    group: 'topics',
    label: '🕵️ Mysteries & Heritage',
    blurb: 'Spooky science, historical mysteries, and deep-time detective stories from Ghana and the world.',
    match: (e) =>
      (e.genres ?? []).some((g) => g === 'mystery' || g === 'historical' || g === 'cultural') ||
      (e.themes ?? []).includes('fear-and-courage'),
  },
  {
    id: 'adventure',
    group: 'topics',
    label: '🧭 Big Adventures',
    blurb: 'Rainforests, deep oceans, craters, and brave journeys where thinking saves the day.',
    match: (e) => (e.genres ?? []).includes('adventure'),
  },
  {
    id: 'money',
    group: 'topics',
    label: '💰 Smart Money & Makers',
    blurb: 'Financial literacy, honest business, saving, entrepreneurship, and leadership.',
    match: (e) =>
      (e.themes ?? []).some((t) => t === 'money-and-work' || t === 'money-and-enterprise' || t === 'leadership') ||
      (e.objectives ?? []).includes('financial-literacy'),
  },
  {
    id: 'poetry',
    group: 'topics',
    label: '🎭 Poetry & Rhymes',
    blurb: 'Nursery action rhymes, Ghanaian performance poems, and BECE literature practice.',
    match: (e) => (e.genres ?? []).includes('poetry') || /\((a poem|a rhyme)\)/i.test(e.title),
  },
  {
    id: 'bedtime',
    group: 'topics',
    label: '🌙 Bedtime & Early Years',
    blurb: 'Gentle, soothing read-alouds and animal stories for our youngest listeners.',
    match: (e) => (e.genres ?? []).some((g) => g === 'bedtime' || g === 'animal') && (e.ageMin ?? 99) <= 7,
  },
];

export function LibraryDashboard({
  createSource = createPreviewSource,
  defaultStage = 'all',
  activeAgeTier,
  viewerEmail,
  heldStoryKeys,
  approvedEarlyStoryKeys,
  onToggleHoldStory,
  onApproveStoryEarly,
  nowMs,
  focusNacca,
  focusLabel,
}: {
  createSource?: () => Promise<LibrarySource>;
  defaultStage?: StageFilterId;
  activeAgeTier?: string;
  viewerEmail?: string | null;
  heldStoryKeys?: ReadonlySet<string>;
  approvedEarlyStoryKeys?: ReadonlySet<string>;
  onToggleHoldStory?: (storyKey: string, nextHold: boolean) => void;
  onApproveStoryEarly?: (storyKey: string) => void;
  nowMs?: number;
  /** NaCCA codes or prefixes a teacher wants brought forward on the Read next shelf, for example ['B4.2']. */
  focusNacca?: readonly string[];
  /** Plain-words name of that focus, shown to children, for example 'Plants and seeds'. */
  focusLabel?: string;
}) {
  const [source, setSource] = useState<LibrarySource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sel, setSel] = useState<Selection>({});
  const [stage, setStage] = useState<StageFilterId>(defaultStage);
  const [shelf, setShelf] = useState<CollectionShelfId>('all');
  const [search, setSearch] = useState<string>('');
  const [entries, setEntries] = useState<CatalogueEntry[]>([]);
  const [exhausted, setExhausted] = useState(false);
  const [renderLimit, setRenderLimit] = useState(INITIAL_RENDER_WINDOW);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<{ pkg: StoryPackage; entry: CatalogueEntry } | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // refresh stats after actions
  const [cachedEmail, setCachedEmail] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [localOverrides, setLocalOverrides] = useState(() => loadLocalReviewOverrides());
  const feed = useRef<FilteredFeed | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInterests(loadInterests());
    return subscribeInterestChanges(() => setInterests(loadInterests()));
  }, []);

  useEffect(() => {
    setCachedEmail(loadCachedViewerEmail());
    setLocalOverrides(loadLocalReviewOverrides());
  }, []);

  const effectiveViewerEmail = viewerEmail !== undefined ? viewerEmail : cachedEmail;
  const isDeveloper = isDeveloperReviewer(effectiveViewerEmail);
  const currentNowMs = nowMs ?? Date.now();

  const effectiveHeldKeys = useMemo(() => {
    if (heldStoryKeys) return heldStoryKeys;
    return new Set(localOverrides.heldKeys);
  }, [heldStoryKeys, localOverrides.heldKeys]);

  const effectiveApprovedKeys = useMemo(() => {
    if (approvedEarlyStoryKeys) return approvedEarlyStoryKeys;
    return new Set(localOverrides.approvedKeys);
  }, [approvedEarlyStoryKeys, localOverrides.approvedKeys]);

  const handleToggleHold = useCallback(
    (storyKey: string, nextHold: boolean) => {
      if (onToggleHoldStory) {
        onToggleHoldStory(storyKey, nextHold);
        return;
      }
      setLocalOverrides((prev) => {
        const held = new Set(prev.heldKeys);
        const approved = new Set(prev.approvedKeys);
        if (nextHold) {
          held.add(storyKey);
          approved.delete(storyKey);
        } else {
          held.delete(storyKey);
        }
        const next = { heldKeys: [...held], approvedKeys: [...approved], updatedAt: Date.now() };
        saveLocalReviewOverrides(next);
        return next;
      });
    },
    [onToggleHoldStory],
  );

  const handleApproveEarly = useCallback(
    (storyKey: string) => {
      if (onApproveStoryEarly) {
        onApproveStoryEarly(storyKey);
        return;
      }
      setLocalOverrides((prev) => {
        const held = new Set(prev.heldKeys);
        const approved = new Set(prev.approvedKeys);
        held.delete(storyKey);
        approved.add(storyKey);
        const next = { heldKeys: [...held], approvedKeys: [...approved], updatedAt: Date.now() };
        saveLocalReviewOverrides(next);
        return next;
      });
    },
    [onApproveStoryEarly],
  );

  const isReaderOpenRef = useRef(false);
  isReaderOpenRef.current = open !== null;
  useEffect(() => {
    return subscribeProgressChanges(() => {
      if (!isReaderOpenRef.current) setTick((t) => t + 1);
    });
  }, []);

  useEffect(() => {
    let live = true;
    createSource().then(async (s) => { await s.catalogue.startSession(); if (live) setSource(s); }).catch((e) => live && setError(String(e?.message ?? e)));
    return () => { live = false; };
  }, [createSource]);

  const run = useCallback(async (s: LibrarySource, selection: Selection) => {
    setLoading(true);
    setRenderLimit(INITIAL_RENDER_WINDOW);
    try {
      const f = new FilteredFeed(s.catalogue, planQuery(selection), 50, 6);
      feed.current = f;
      await f.loadMore(INITIAL_FEED_BATCH);
      if (feed.current === f) { setEntries([...f.entries]); setExhausted(f.exhausted); }
    } catch (e: any) { setError(String(e?.message ?? e)); } finally { setLoading(false); setTick((t) => t + 1); }
  }, []);

  useEffect(() => { if (source) run(source, sel); }, [source, sel, run]);

  const more = useCallback(async () => {
    setRenderLimit((prev) => prev + RENDER_WINDOW_STEP);
    if (!feed.current || !source || feed.current.exhausted || loading) return;
    setLoading(true);
    try {
      await feed.current.loadMore(RENDER_WINDOW_STEP);
      setEntries([...feed.current.entries]);
      setExhausted(feed.current.exhausted);
    } finally {
      setLoading(false);
      setTick((t) => t + 1);
    }
  }, [source, loading]);

  const openStory = async (e: CatalogueEntry) => {
    if (!source) return;
    if (!isStoryVisibleToViewer(e, { viewerEmail: effectiveViewerEmail, nowMs: currentNowMs, heldKeys: effectiveHeldKeys, approvedKeys: effectiveApprovedKeys })) {
      return;
    }
    setOpening(e.storyKey);
    try {
      const [pkg] = await Promise.all([
        source.loader.openPackage(e.packagePath),
        source.loadInfo ? source.loadInfo(e.storyKey).catch(() => undefined) : Promise.resolve(undefined),
      ]);
      setOpen({ pkg, entry: e });
    } catch {
      setError('That story could not be opened. Check your connection and try again.');
    } finally {
      setOpening(null);
      setTick((t) => t + 1);
    }
  };

  // O(opened-books) progress scan — independent of total library size even at 5,000+ stories
  const progressSnapshot = useMemo(() => {
    void tick;
    return loadProgressSnapshot();
  }, [tick]);

  const quarantineMap = useMemo(() => {
    const map = new Map<string, StoryQuarantineStatus>();
    const quarantinedSet = new Set<string>();
    for (const e of entries) {
      const st = getStoryQuarantineStatus(e, {
        nowMs: currentNowMs,
        heldKeys: effectiveHeldKeys,
        approvedKeys: effectiveApprovedKeys,
      });
      map.set(e.storyKey, st);
      if (st.isQuarantined) quarantinedSet.add(e.storyKey);
    }
    return { byKey: map, quarantinedSet };
  }, [entries, currentNowMs, effectiveHeldKeys, effectiveApprovedKeys]);

  const audienceEntries = useMemo(() => {
    return entries.filter((e) =>
      isStoryVisibleToViewer(e, {
        viewerEmail: effectiveViewerEmail,
        nowMs: currentNowMs,
        heldKeys: effectiveHeldKeys,
        approvedKeys: effectiveApprovedKeys,
      }),
    );
  }, [entries, effectiveViewerEmail, currentNowMs, effectiveHeldKeys, effectiveApprovedKeys]);

  const availableShelves = useMemo(
    () => COLLECTION_SHELVES.filter((c) => !c.developerOnly || isDeveloper),
    [isDeveloper],
  );

  const visibleEntries = useMemo(() => {
    const stageDef = STAGE_GROUPS.find((g) => g.id === stage);
    const shelfDef = availableShelves.find((c) => c.id === shelf);
    const q = search.trim().toLowerCase();
    const shelfCtx = { ...progressSnapshot, quarantined: quarantineMap.quarantinedSet };

    const filtered = audienceEntries.filter((e) => {
      if (stageDef && stageDef.id !== 'all' && !(e.classIds ?? []).some((c) => stageDef.classes.includes(c))) {
        return false;
      }
      if (shelfDef && shelfDef.id !== 'all' && !shelfDef.match(e, shelfCtx)) {
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
  }, [audienceEntries, stage, shelf, availableShelves, search, progressSnapshot, quarantineMap.quarantinedSet, activeAgeTier, sel.classId]);

  const windowedEntries = useMemo(
    () => visibleEntries.slice(0, renderLimit),
    [visibleEntries, renderLimit],
  );
  const hasMoreToShow = windowedEntries.length < visibleEntries.length || !exhausted;

  // "Read next": fit (class, age) first, then interests, reading history, a gentle difficulty step and any teacher focus.
  const readNext = useMemo(() => {
    const byKey = new Map(audienceEntries.map((e) => [e.storyKey, e]));
    const stageDef = STAGE_GROUPS.find((g) => g.id === stage);
    const classIds = sel.classId ? [sel.classId] : stageDef && stageDef.id !== 'all' ? stageDef.classes : [];
    const pick = (keys: Iterable<string>) => [...keys].map((k) => byKey.get(k)).filter((e): e is CatalogueEntry => !!e);
    const finished = pick(progressSnapshot.completed);
    const candidates = audienceEntries.filter((e) => !quarantineMap.quarantinedSet.has(e.storyKey));
    return recommendReadNext(candidates, {
      interests,
      classIds,
      ageYears: sel.ageYears,
      excludeKeys: new Set([...progressSnapshot.completed, ...progressSnapshot.inProgress]),
      history: [...finished, ...pick(progressSnapshot.favs)],
      finished,
      focusNacca,
    });
  }, [audienceEntries, interests, stage, sel.classId, sel.ageYears, progressSnapshot, quarantineMap.quarantinedSet, focusNacca]);

  // Progressive infinite scroll as the learner scrolls near the bottom of the shelf
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMoreToShow || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (records) => {
        if (records.some((r) => r.isIntersecting)) {
          void more();
        }
      },
      { rootMargin: '400px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMoreToShow, more]);

  if (error && !source) return <div role="alert" className="mx-auto max-w-xl rounded-2xl bg-red-50 p-6 text-red-900 ring-1 ring-red-200">The library could not be loaded: {error}</div>;
  if (!source) return <div className="p-10 text-center text-lg font-semibold text-slate-600" role="status">Opening the library…</div>;

  if (open) {
    return (
      <StorybookReader
        pkg={open.pkg}
        entry={open.entry}
        info={source.info(open.pkg.storyId)}
        source={source}
        onClose={() => { setOpen(null); setTick((t) => t + 1); }}
      />
    );
  }

  const sc = (k: keyof Selection, v: string | number | undefined) => {
    if (k === 'classId' && v !== '' && v !== undefined) setStage('all');
    setSel((s) => ({ ...s, [k]: v === '' ? undefined : v }));
  };
  const active = Object.values(sel).some((v) => v !== undefined) || stage !== 'all' || shelf !== 'all' || search.trim() !== '';
  const activeShelf = availableShelves.find((c) => c.id === shelf) ?? availableShelves[0];
  const clearAll = () => { setSel({}); setStage('all'); setShelf('all'); setSearch(''); };
  const chips: ToolbarChip[] = [];
  if (shelf !== 'all') chips.push({ key: 'shelf', text: activeShelf.label.replace(/^\S+\s/, ''), onRemove: () => setShelf('all') });
  if (stage !== 'all') chips.push({ key: 'stage', text: STAGE_GROUPS.find((g) => g.id === stage)?.label.replace(/^\S+\s/, '') ?? stage, onRemove: () => setStage('all') });
  if (sel.classId) chips.push({ key: 'class', text: label(CLASS_REGISTRY, sel.classId), onRemove: () => sc('classId', '') });
  if (sel.ageYears !== undefined) chips.push({ key: 'age', text: `${sel.ageYears} years`, onRemove: () => sc('ageYears', undefined) });
  if (sel.genre) chips.push({ key: 'genre', text: label(GENRES, sel.genre), onRemove: () => sc('genre', '') });
  if (sel.readingLevel) chips.push({ key: 'level', text: label(READING_LEVELS, sel.readingLevel), onRemove: () => sc('readingLevel', '') });
  if (search.trim()) chips.push({ key: 'search', text: `“${search.trim()}”`, onRemove: () => setSearch('') });
  const hiddenQuarantinedCount = isDeveloper ? 0 : quarantineMap.quarantinedSet.size;
  const rawTotal = source.catalogue.totalPublished ?? entries.length;
  const totalBooksCount = Math.max(0, rawTotal - hiddenQuarantinedCount);
  const underReviewCount = quarantineMap.quarantinedSet.size;

  return (
    <div className="mx-auto w-full max-w-6xl" data-testid="library">
      <section className="mb-5 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-white/80">GAM EDU</p>
            <h1 className="text-3xl font-black md:text-4xl" style={{ fontFamily: 'Fredoka, Nunito, system-ui, sans-serif' }}>Story Spark Library</h1>
            <p className="mt-1 max-w-2xl text-white/90">Illustrated, narrated stories & poems for every class from Nursery to JHS. Pick a collection, choose your reading mode, and explore.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 text-xs font-extrabold" data-testid="hero-stats">
            <button
              type="button"
              onClick={() => setShelf('all')}
              className={`min-w-[116px] rounded-2xl px-3.5 py-2.5 text-left backdrop-blur transition ${shelf === 'all' ? 'bg-white/25 text-white ring-1 ring-white/50 shadow-sm' : 'bg-white/15 text-white hover:bg-white/25'}`}
            >
              <span className="block text-xl font-black leading-tight text-white">{totalBooksCount}</span>
              <span className="text-white/90">📚 Books & Poems</span>
            </button>
            {isDeveloper && (
              <button
                type="button"
                data-testid="under-review-stat"
                onClick={() => setShelf(shelf === 'under-review' ? 'all' : 'under-review')}
                className={`min-w-[132px] rounded-2xl px-3.5 py-2.5 text-left backdrop-blur transition ${
                  shelf === 'under-review'
                    ? 'bg-amber-300 text-slate-950 shadow ring-2 ring-white'
                    : 'bg-amber-400/25 text-amber-50 ring-1 ring-amber-200/60 hover:bg-amber-400/35'
                }`}
              >
                <span className={`block text-xl font-black leading-tight ${shelf === 'under-review' ? 'text-slate-950' : 'text-white'}`}>
                  {underReviewCount}
                </span>
                <span className={shelf === 'under-review' ? 'text-slate-900' : 'text-amber-100'}>🛡️ Under Review (48h)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShelf(shelf === 'continue' ? 'all' : 'continue')}
              className={`min-w-[116px] rounded-2xl px-3.5 py-2.5 text-left backdrop-blur transition ${shelf === 'continue' ? 'bg-white text-indigo-900 shadow' : 'bg-white/15 text-white hover:bg-white/25'}`}
            >
              <span className={`block text-xl font-black leading-tight ${shelf === 'continue' ? 'text-indigo-950' : 'text-white'}`}>{progressSnapshot.inProgress.size}</span>
              <span className={shelf === 'continue' ? 'text-indigo-900' : 'text-white/90'}>▶️ In Progress</span>
            </button>
            <button
              type="button"
              onClick={() => setShelf(shelf === 'completed' ? 'all' : 'completed')}
              className={`min-w-[116px] rounded-2xl px-3.5 py-2.5 text-left backdrop-blur transition ${shelf === 'completed' ? 'bg-white text-indigo-900 shadow' : 'bg-white/15 text-white hover:bg-white/25'}`}
            >
              <span className={`block text-xl font-black leading-tight ${shelf === 'completed' ? 'text-indigo-950' : 'text-white'}`}>{progressSnapshot.completed.size}</span>
              <span className={shelf === 'completed' ? 'text-indigo-900' : 'text-white/90'}>🏆 Finished</span>
            </button>
            <button
              type="button"
              onClick={() => setShelf(shelf === 'favourites' ? 'all' : 'favourites')}
              className={`min-w-[116px] rounded-2xl px-3.5 py-2.5 text-left backdrop-blur transition ${shelf === 'favourites' ? 'bg-white text-rose-700 shadow' : 'bg-white/15 text-white hover:bg-white/25'}`}
            >
              <span className={`block text-xl font-black leading-tight ${shelf === 'favourites' ? 'text-rose-700' : 'text-white'}`}>{progressSnapshot.favs.size}</span>
              <span className={shelf === 'favourites' ? 'text-rose-700' : 'text-white/90'}>❤️ Favourites</span>
            </button>
          </div>
        </div>
      </section>
      {source.notice && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200" role="note">{source.notice}</p>}

      <LibraryToolbar
        shelves={availableShelves}
        shelf={shelf}
        onShelf={(id) => setShelf(id as CollectionShelfId)}
        shelfSuffix={{
          'under-review': ` (${underReviewCount})`,
          continue: ` (${progressSnapshot.inProgress.size})`,
          favourites: ` (${progressSnapshot.favs.size})`,
          completed: ` (${progressSnapshot.completed.size})`,
        }}
        stages={STAGE_GROUPS}
        stage={stage}
        onStage={(id) => { setStage(id as StageFilterId); if (id !== 'all') setSel((s) => ({ ...s, classId: undefined })); }}
        search={search}
        onSearch={setSearch}
        filtersCount={[sel.classId, sel.ageYears, sel.genre, sel.readingLevel].filter((v) => v !== undefined).length}
        chips={chips}
        onClearAll={clearAll}
        active={active}
      >
        <form className="grid gap-3 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-5" aria-label="Filter stories" onSubmit={(e) => e.preventDefault()}>
          <Field label="Class"><select aria-label="Class" value={sel.classId ?? ''} onChange={(e) => sc('classId', e.target.value)} className={selectCls}>
            <option value="">All classes</option>{CLASS_REGISTRY.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></Field>
          <Field label="Age"><select aria-label="Age" value={sel.ageYears ?? ''} onChange={(e) => sc('ageYears', e.target.value === '' ? undefined : Number(e.target.value))} className={selectCls}>
            <option value="">Any age</option>{Array.from({ length: 14 }, (_, i) => i + 2).map((a) => <option key={a} value={a}>{a} years</option>)}</select></Field>
          <Field label="Genre"><select aria-label="Genre" value={sel.genre ?? ''} onChange={(e) => sc('genre', e.target.value)} className={selectCls}>
            <option value="">All genres</option>{GENRES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}</select></Field>
          <Field label="Reading level"><select aria-label="Reading level" value={sel.readingLevel ?? ''} onChange={(e) => sc('readingLevel', e.target.value)} className={selectCls}>
            <option value="">All levels</option>{READING_LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}</select></Field>
          <div className="flex items-end"><button type="button" disabled={!active} onClick={clearAll} className="w-full rounded-xl border-2 border-slate-300 px-4 py-2 font-bold text-slate-800 disabled:opacity-40">Clear filters</button></div>
        </form>
      </LibraryToolbar>

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

      {shelf === 'all' && search.trim() === '' && (
        <ReadNextShelf
          recs={readNext}
          interests={interests}
          onToggleInterest={(id) => { toggleInterest(id); }}
          onOpen={openStory}
          busyKey={opening}
          focusLabel={focusLabel}
          coverFor={(e) => {
            const info = source.info(e.storyKey);
            return { motif: e.coverMotif ?? info?.pages?.[0]?.motif ?? '📖', palette: e.palette ?? info?.palette ?? ['#e2e8f0', '#94a3b8'], alt: e.cover?.alt ?? `Cover for ${e.title}`, src: resolveCoverUrl(e, source) };
          }}
        />
      )}

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
        {windowedEntries.map((e) => (
          <StoryCard
            key={e.storyKey}
            entry={e}
            source={source}
            busy={opening === e.storyKey}
            isFav={progressSnapshot.favs.has(e.storyKey)}
            progress={progressSnapshot.byStory.get(e.storyKey)}
            isDeveloper={isDeveloper}
            quarantine={quarantineMap.byKey.get(e.storyKey)}
            onToggleHold={(nextHold) => handleToggleHold(e.storyKey, nextHold)}
            onApproveEarly={() => handleApproveEarly(e.storyKey)}
            onToggleFav={() => {
              toggleFavourite(e.storyKey);
            }}
            onOpen={() => openStory(e)}
          />
        ))}
      </ul>
      {hasMoreToShow && visibleEntries.length > 0 && (
        <div ref={sentinelRef} className="mt-6 text-center">
          <button type="button" onClick={more} disabled={loading} className="rounded-full bg-indigo-600 px-6 py-3 font-bold text-white disabled:opacity-50">
            {loading ? 'Loading more…' : 'Show more stories'}
          </button>
        </div>
      )}
      {error && <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-900">{error}</div>}
    </div>
  );
}

const selectCls = 'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none';
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block text-sm font-bold text-slate-700"><span className="mb-1 block">{label}</span>{children}</label>;

function resolveCoverUrl(entry: CatalogueEntry, source: LibrarySource): string {
  const resolve = source.resolveMediaUrl ?? ((p: string) => p);
  if (entry.cover?.hash?.startsWith('sha256:')) {
    const hex = entry.cover.hash.slice(7);
    return resolve(`/${PUBLISHED_PREFIX}assets/${hex.slice(0, 2)}/${hex}.webp`);
  }
  return resolve(`/story-spark-preview/candidates/${entry.storyKey}/page1-1.webp`);
}

function StoryCard({
  entry,
  source,
  busy,
  isFav,
  progress,
  isDeveloper,
  quarantine,
  onToggleHold,
  onApproveEarly,
  onToggleFav,
  onOpen,
}: {
  entry: CatalogueEntry;
  source: LibrarySource;
  busy: boolean;
  isFav: boolean;
  progress?: LocalProgress;
  isDeveloper: boolean;
  quarantine?: StoryQuarantineStatus;
  onToggleHold: (nextHold: boolean) => void;
  onApproveEarly: () => void;
  onToggleFav: () => void;
  onOpen: () => void;
}) {
  const info = source.info(entry.storyKey);
  const presentation = presentationFor(entry.classIds ?? []);
  const classes = entry.classIds ?? [];
  const classText = classes.length > 2 ? `${label(CLASS_REGISTRY, classes[0])} to ${label(CLASS_REGISTRY, classes[classes.length - 1])}` : classes.map((c) => label(CLASS_REGISTRY, c)).join(', ');
  const badgeText = isDeveloper && quarantine?.isQuarantined ? formatQuarantineBadge(quarantine) : '';

  return (
    <li
      className={`relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-md transition hover:shadow-xl motion-reduce:transition-none ${
        badgeText
          ? quarantine?.isHeld
            ? 'ring-2 ring-rose-500'
            : 'ring-2 ring-amber-400'
          : 'ring-1 ring-slate-200'
      }`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 440px' }}
      data-testid="story-card"
      data-story={entry.storyKey}
    >
      <div className="relative">
        <PlaceholderArt
          motif={entry.coverMotif ?? info?.pages?.[0]?.motif ?? '📖'}
          palette={entry.palette ?? info?.palette ?? ['#e2e8f0', '#94a3b8']}
          alt={entry.cover?.alt ?? `Cover for ${entry.title}`}
          imageSrc={resolveCoverUrl(entry, source)}
          compact
        />
        {badgeText && (
          <span
            data-testid="quarantine-badge"
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold text-white shadow backdrop-blur ${
              quarantine?.isHeld ? 'bg-rose-700/95' : 'bg-amber-600/95'
            }`}
          >
            {badgeText}
          </span>
        )}
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
        {progress && !progress.done && progress.step >= 0 && (
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
        {isDeveloper && (quarantine?.isQuarantined || quarantine?.isApprovedEarly) && (
          <div className="mt-3 flex flex-wrap gap-1.5 rounded-2xl bg-amber-50 p-2 text-xs font-bold ring-1 ring-amber-200" data-testid="developer-quarantine-controls">
            <button
              type="button"
              onClick={() => onToggleHold(!quarantine?.isHeld)}
              className={`flex-1 rounded-xl px-2.5 py-1.5 transition ${
                quarantine?.isHeld
                  ? 'bg-slate-800 text-white hover:bg-slate-900'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {quarantine?.isHeld ? '↩️ Remove Hold' : '🚩 Hold / Flag'}
            </button>
            {quarantine?.isQuarantined && (
              <button
                type="button"
                onClick={onApproveEarly}
                className="flex-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-white transition hover:bg-emerald-700"
              >
                ✅ Release Live
              </button>
            )}
          </div>
        )}
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

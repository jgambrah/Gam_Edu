/**
 * Everything the library UI needs from "where the stories come from".
 *
 * Scaling notes (1,000–5,000+ stories):
 *   1. Startup NEVER downloads a monolithic `preview.json`. Shelf cards render cover gradient (`palette`) and motif
 *      (`coverMotif`) directly from compact `CatalogueEntry` metadata.
 *   2. Rich per-story educator notes & teacher guides (`info/<storyKey>.json`) are fetched lazily on demand ONLY when
 *      that individual book is opened (`loadInfo(storyKey)`), keeping startup O(1) per browsed page.
 *   3. Device catalogue caching uses IndexedDB (`openPersistentKV`) so thousands of entries never hit localStorage's 5 MB cap.
 *   4. Binary media & packages can be served from a Cloud Storage / CDN base URL (`NEXT_PUBLIC_STORY_LIBRARY_CDN_URL`)
 *      without committing gigabytes of WebPs/MP3s to Git.
 */
import { CatalogueClient, type CatalogueBackend } from './catalogue-client';
import { StaticCatalogueBackend, type StaticCatalogueData } from './static-catalogue';
import { openPersistentKV } from './persistent-kv';
import { BrowserAssetCache } from './browser-cache';
import { MemoryAssetStore, StoryLoader } from './lazy-loader';
import { PREVIEW_BASE } from './preview-source';
import type { Classification } from './classification';
import type { TeacherGuide } from './pilot/teacher-guide';

export interface StoryPreviewInfo {
  status?: 'approved' | 'published';
  set: 'pilot' | 'extension' | 'benchmark' | 'sample';
  palette: [string, string];
  classification: Classification;
  characters: string[];
  narrationPlan: { voice: string; pace: string; notes: string[] };
  music: string;
  culturalNotes: string[];
  reviewQuestions: string[];
  pages: Array<{ motif: string; brief: string; narration: string }>;
  assetStatus: Record<string, string>;
  /** Short teacher's guide, when the story has one. */
  teacherGuide?: TeacherGuide;
  /** Names in this story that go through the pronunciation dictionary, with their approval status. */
  pronunciation?: Array<{ written: string; language: string; status: string; guidance: string; reviewerNotes: string[] }>;
  /** Illustration progress: files only count when they exist. */
  illustration?: { approved: number; candidate: number; placeholder: number; missing: number; total: number; allApproved?: boolean };
}

export interface LibrarySource {
  kind: 'preview' | 'central';
  /** Shown on every screen when not production content. */
  notice?: string;
  catalogue: CatalogueClient;
  loader: StoryLoader;
  assets: BrowserAssetCache;
  /** Live counters, for the "data & cache" panel and the pilot measurements. */
  counters: () => { catalogue: Record<string, number> };
  /** Synchronous lookup of already-loaded per-story educator/sidecar info. */
  info(storyKey: string): StoryPreviewInfo | undefined;
  /** Lazy per-story fetch (~9 KB) invoked only when opening a book; never downloads the whole library upfront. */
  loadInfo?(storyKey: string): Promise<StoryPreviewInfo | undefined>;
  /** Resolves a media or asset path against the configured CDN / Storage base when present. */
  resolveMediaUrl?(path: string): string;
  clearDeviceCache(): Promise<void>;
}

export function resolveCdnMediaUrl(path: string, cdnBase?: string): string {
  if (!path) return path;
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  const trimmedBase = (cdnBase ?? defaultCdnBase()).replace(/\/+$/, '');
  if (!trimmedBase) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath}`;
}

function defaultCdnBase(): string {
  try {
    return (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STORY_LIBRARY_CDN_URL) || '';
  } catch {
    return '';
  }
}

export async function createPreviewSource(
  base = PREVIEW_BASE,
  fetchFn: typeof fetch = (...a) => fetch(...a),
  opts: { cdnBaseUrl?: string } = {},
): Promise<LibrarySource> {
  const resolveMediaUrl = (p: string) => resolveCdnMediaUrl(p, opts.cdnBaseUrl);
  const assets = new BrowserAssetCache(fetchFn, undefined, resolveMediaUrl);

  const catalogueRes = await fetchFn(resolveMediaUrl(`${base}/catalogue.json`));
  if (!catalogueRes.ok) throw new Error(`catalogue.json: HTTP ${catalogueRes.status}`);
  const catalogueData = (await catalogueRes.json()) as StaticCatalogueData;

  const backend: CatalogueBackend & { counters: Record<string, number> } = new StaticCatalogueBackend(catalogueData);
  const kv = await openPersistentKV('story-spark-preview-catalogue');
  const sig = `${catalogueData.catalogueVersion}:${catalogueData.totalPublished ?? catalogueData.entries.length}`;
  if (kv.get<string>('meta:sig') !== sig) {
    kv.clear();
    kv.set('meta:sig', sig);
    await assets.clearPackages();
  }
  const catalogue = new CatalogueClient(backend, kv, { pageSize: 50, refresh: 'refetch' });
  const loader = new StoryLoader(assets, new MemoryAssetStore(), { lookAhead: 1 });

  const infoCache = new Map<string, StoryPreviewInfo>();
  const infoInflight = new Map<string, Promise<StoryPreviewInfo | undefined>>();
  let legacyMonolithicFallback: Promise<Record<string, StoryPreviewInfo> | null> | null = null;

  const loadLegacyFallback = () => {
    if (!legacyMonolithicFallback) {
      legacyMonolithicFallback = fetchFn(resolveMediaUrl(`${base}/preview.json`))
        .then((r) => (r.ok ? (r.json() as Promise<Record<string, StoryPreviewInfo>>) : null))
        .catch(() => null);
    }
    return legacyMonolithicFallback;
  };

  const loadInfo = async (storyKey: string): Promise<StoryPreviewInfo | undefined> => {
    const cached = infoCache.get(storyKey);
    if (cached) return cached;
    const inflight = infoInflight.get(storyKey);
    if (inflight) return inflight;

    const task = (async () => {
      try {
        const res = await fetchFn(resolveMediaUrl(`${base}/info/${storyKey}.json`));
        if (res.ok) {
          const parsed = (await res.json()) as StoryPreviewInfo;
          infoCache.set(storyKey, parsed);
          return parsed;
        }
      } catch {
        // Fall through to legacy fallback if per-story info file is unreachable
      }
      const legacy = await loadLegacyFallback();
      const found = legacy?.[storyKey];
      if (found) infoCache.set(storyKey, found);
      return found;
    })().finally(() => {
      infoInflight.delete(storyKey);
    });

    infoInflight.set(storyKey, task);
    return task;
  };

  return {
    kind: 'central',
    catalogue,
    loader,
    assets,
    counters: () => ({ catalogue: { ...backend.counters } }),
    info: (k) => infoCache.get(k),
    loadInfo,
    resolveMediaUrl,
    async clearDeviceCache() {
      infoCache.clear();
      kv.clear();
      await kv.flush?.();
      await assets.clear();
    },
  };
}

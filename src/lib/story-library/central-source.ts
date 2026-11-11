/**
 * Production Central Story Library Source (Firestore `story_catalogue` + Cloud Storage / CDN assets).
 *
 * Kept in its own module so `/story-spark-preview` retains zero Firebase imports (`preview-isolation.test.ts`).
 * Scales cleanly to 10,000+ stories:
 *   - 1 `library_meta/current` read per session;
 *   - Cursor-paginated queries (`limit <= 50`) using single indexed filter shapes (`classification.ts`);
 *   - Delta sync (`changedInVersion > since`) backed by IndexedDB (`openPersistentKV`);
 *   - Content-addressed packages, WebP illustrations, MP3/Opus audio, and per-story `info/<storyKey>.json` served from
 *     Cloud Storage / CDN and cached in Browser Cache Storage.
 */
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit as fsLimit,
  orderBy,
  query,
  startAfter as fsStartAfter,
  where,
  type Firestore,
  type QueryConstraint,
} from 'firebase/firestore';
import { CatalogueClient, type CatalogueBackend } from './catalogue-client';
import type { CatalogueFilter } from './classification';
import { BrowserAssetCache } from './browser-cache';
import { MemoryAssetStore, StoryLoader } from './lazy-loader';
import { openPersistentKV } from './persistent-kv';
import { resolveCdnMediaUrl, type LibrarySource, type StoryPreviewInfo } from './library-source';
import { MAX_CATALOGUE_PAGE_SIZE, PUBLISHED_PREFIX, type CatalogueEntry } from './types';

export class FirestoreCatalogueBackend implements CatalogueBackend {
  readonly counters = { metaReads: 0, queries: 0, entriesRead: 0 };

  constructor(private db: Firestore) {}

  async getMeta(): Promise<{ catalogueVersion: number; totalPublished?: number }> {
    this.counters.metaReads++;
    const snap = await getDoc(doc(this.db, 'library_meta/current'));
    if (!snap.exists()) return { catalogueVersion: 0, totalPublished: 0 };
    const data = snap.data();
    return {
      catalogueVersion: typeof data.catalogueVersion === 'number' ? data.catalogueVersion : 0,
      totalPublished: typeof data.totalPublished === 'number' ? data.totalPublished : undefined,
    };
  }

  async listPage(o: { limit: number; startAfter?: string; ageTier?: string; filter?: CatalogueFilter }): Promise<CatalogueEntry[]> {
    if (o.limit > MAX_CATALOGUE_PAGE_SIZE) {
      throw new Error(`limit must be <= ${MAX_CATALOGUE_PAGE_SIZE}`);
    }
    const constraints: QueryConstraint[] = [where('status', '==', 'published')];
    const f = o.filter ?? {};
    if (o.ageTier) {
      constraints.push(where('ageTiers', 'array-contains', o.ageTier));
    } else if (f.classId && f.readingLevel) {
      constraints.push(where('classIds', 'array-contains', f.classId), where('readingLevel', '==', f.readingLevel));
    } else if (f.classId) {
      constraints.push(where('classIds', 'array-contains', f.classId));
    } else if (f.genre && f.readingLevel) {
      constraints.push(where('genres', 'array-contains', f.genre), where('readingLevel', '==', f.readingLevel));
    } else if (f.genre) {
      constraints.push(where('genres', 'array-contains', f.genre));
    } else if (f.readingLevel) {
      constraints.push(where('readingLevel', '==', f.readingLevel));
    } else if (f.theme) {
      constraints.push(where('themes', 'array-contains', f.theme));
    } else if (f.objective) {
      constraints.push(where('objectives', 'array-contains', f.objective));
    } else if (f.language) {
      constraints.push(where('language', '==', f.language));
    } else if (f.ghanaianContext) {
      constraints.push(where('ghanaianContext', '==', f.ghanaianContext));
    }

    constraints.push(orderBy(documentId()));
    if (o.startAfter) constraints.push(fsStartAfter(o.startAfter));
    constraints.push(fsLimit(o.limit));

    const snap = await getDocs(query(collection(this.db, 'story_catalogue'), ...constraints));
    this.counters.queries++;
    this.counters.entriesRead += snap.size;
    return snap.docs.map((d) => ({ ...(d.data() as CatalogueEntry), storyKey: d.id }));
  }

  async listChangedSince(o: { since: number; limit: number; startAfter?: string }): Promise<CatalogueEntry[]> {
    if (o.limit > MAX_CATALOGUE_PAGE_SIZE) {
      throw new Error(`limit must be <= ${MAX_CATALOGUE_PAGE_SIZE}`);
    }
    const constraints: QueryConstraint[] = [
      where('status', '==', 'published'),
      where('changedInVersion', '>', o.since),
      orderBy('changedInVersion'),
      orderBy(documentId()),
    ];
    if (o.startAfter) constraints.push(fsStartAfter(o.since, o.startAfter));
    constraints.push(fsLimit(o.limit));

    const snap = await getDocs(query(collection(this.db, 'story_catalogue'), ...constraints));
    this.counters.queries++;
    this.counters.entriesRead += snap.size;
    return snap.docs.map((d) => ({ ...(d.data() as CatalogueEntry), storyKey: d.id }));
  }
}

export interface CentralSourceOptions {
  db: Firestore;
  /** Cloud Storage / CDN origin (e.g. `https://storage.googleapis.com/<bucket>` or custom CDN domain). */
  cdnBaseUrl: string;
  fetchFn?: typeof fetch;
  namespace?: string;
}

export async function createCentralSource(opts: CentralSourceOptions): Promise<LibrarySource> {
  const fetchFn = opts.fetchFn ?? ((...a) => fetch(...a));
  const resolveMediaUrl = (p: string) => resolveCdnMediaUrl(p, opts.cdnBaseUrl);
  const assets = new BrowserAssetCache(fetchFn, undefined, resolveMediaUrl);
  const backend = new FirestoreCatalogueBackend(opts.db);
  const kv = await openPersistentKV(opts.namespace ?? 'gam-edu-central-story-catalogue');
  const catalogue = new CatalogueClient(backend, kv, { pageSize: 50, refresh: 'delta' });
  const loader = new StoryLoader(assets, new MemoryAssetStore(), { lookAhead: 1 });

  const infoCache = new Map<string, StoryPreviewInfo>();
  const infoInflight = new Map<string, Promise<StoryPreviewInfo | undefined>>();

  const loadInfo = async (storyKey: string): Promise<StoryPreviewInfo | undefined> => {
    const hit = infoCache.get(storyKey);
    if (hit) return hit;
    const inflight = infoInflight.get(storyKey);
    if (inflight) return inflight;
    const task = (async () => {
      try {
        const res = await fetchFn(resolveMediaUrl(`/${PUBLISHED_PREFIX}info/${storyKey}.json`));
        if (!res.ok) return undefined;
        const parsed = (await res.json()) as StoryPreviewInfo;
        infoCache.set(storyKey, parsed);
        return parsed;
      } catch {
        return undefined;
      }
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

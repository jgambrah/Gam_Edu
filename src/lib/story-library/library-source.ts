/**
 * Everything the library UI needs from "where the stories come from". The preview implements it over static files; the
 * production implementation (Firestore catalogue + Storage packages) satisfies the same interface, so the screens do not
 * change when the source does.
 */
import { CatalogueClient, type CatalogueBackend } from './catalogue-client';
import { StaticCatalogueBackend, type StaticCatalogueData } from './static-catalogue';
import { PersistentKV } from './persistent-kv';
import { BrowserAssetCache } from './browser-cache';
import { MemoryAssetStore, StoryLoader } from './lazy-loader';
import { PREVIEW_BASE } from './preview-source';
import type { Classification } from './classification';
import type { TeacherGuide } from './pilot/teacher-guide';

export interface StoryPreviewInfo {
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
  /** Names in this story that go through the pronunciation dictionary, with their (un)verified status. */
  pronunciation?: Array<{ written: string; language: string; status: string; guidance: string; reviewerNotes: string[] }>;
  /** Honest illustration progress: files only count when they exist. */
  illustration?: { approved: number; candidate: number; placeholder: number; missing: number; total: number };
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
  /** Preview-only side information (placeholder art, briefs, asset status). Absent for real content. */
  info(storyKey: string): StoryPreviewInfo | undefined;
  clearDeviceCache(): Promise<void>;
}

export async function createPreviewSource(base = PREVIEW_BASE, fetchFn: typeof fetch = (...a) => fetch(...a)): Promise<LibrarySource> {
  const assets = new BrowserAssetCache(fetchFn);
  const [catalogueData, infoData] = await Promise.all([
    fetchFn(`${base}/catalogue.json`).then((r) => { if (!r.ok) throw new Error(`catalogue.json: HTTP ${r.status}`); return r.json() as Promise<StaticCatalogueData>; }),
    fetchFn(`${base}/preview.json`).then((r) => { if (!r.ok) throw new Error(`preview.json: HTTP ${r.status}`); return r.json() as Promise<Record<string, StoryPreviewInfo>>; }),
  ]);
  const backend: CatalogueBackend & { counters: Record<string, number> } = new StaticCatalogueBackend(catalogueData);
  const kv = new PersistentKV('story-spark-preview-catalogue');
  const catalogue = new CatalogueClient(backend, kv, { pageSize: 50, refresh: 'delta' });
  const loader = new StoryLoader(assets, new MemoryAssetStore(), { lookAhead: 1 });
  return {
    kind: 'central',
    catalogue, loader, assets,
    counters: () => ({ catalogue: { ...backend.counters } }),
    info: (k) => infoData[k],
    async clearDeviceCache() { kv.clear(); await assets.clear(); },
  };
}

/**
 * Catalogue client (Stage 2: logic + measurement; the IndexedDB-backed KeyValueStore arrives in Stage 3).
 *
 * What a learner session costs in Firestore, by design:
 *   - ONE read of library_meta/current to learn the catalogue version;
 *   - unchanged version → every page already browsed is served from the device cache: 0 further reads;
 *   - changed version → either refetch the pages the learner actually browses ('refetch'), or ask only for entries that
 *     changed since the cached version ('delta', keyed on the existing `updatedAt` field, so reads follow the number of
 *     CHANGES, not the size of the library);
 *   - pages are small (<= 50, enforced by the rules), loaded on demand, never the whole catalogue, and no listeners.
 * Opening a story costs no Firestore read at all: the package and media come from Storage.
 */
import { MAX_CATALOGUE_PAGE_SIZE, type CatalogueEntry } from './types';
import type { CatalogueFilter } from './classification';

/**
 * A browsing filter is a string key so cached pages can be stored per filter. 'all' = none; a bare value such as
 * '5-6' is the legacy age-tier filter; 'f:classId=kg-1&readingLevel=emergent' is a classification filter (one indexed
 * query shape, see classification.ts matchShape).
 */
export function filterKey(f: CatalogueFilter & { ageTier?: string }): string {
  const parts = (Object.keys(f) as Array<keyof typeof f>).filter((k) => f[k] !== undefined && f[k] !== '').sort().map((k) => `${k}=${f[k]}`);
  if (!parts.length) return 'all';
  if (parts.length === 1 && parts[0].startsWith('ageTier=')) return parts[0].slice(8);
  return `f:${parts.join('&')}`;
}
export function parseFilterKey(key: string): CatalogueFilter & { ageTier?: string } {
  if (key === 'all') return {};
  if (!key.startsWith('f:')) return { ageTier: key };
  return Object.fromEntries(key.slice(2).split('&').map((kv) => { const i = kv.indexOf('='); return [kv.slice(0, i), kv.slice(i + 1)]; }));
}
/** Does an entry belong in the filtered list? Mirrors what the server-side query selects. */
export function matchesFilter(e: CatalogueEntry, key: string): boolean {
  const f = parseFilterKey(key);
  if (f.ageTier && !e.ageTiers.includes(f.ageTier)) return false;
  if (f.classId && !(e.classIds ?? []).includes(f.classId)) return false;
  if (f.readingLevel && e.readingLevel !== f.readingLevel) return false;
  if (f.language && e.language !== f.language) return false;
  if (f.ghanaianContext && e.ghanaianContext !== f.ghanaianContext) return false;
  if (f.genre && !(e.genres ?? []).includes(f.genre)) return false;
  if (f.objective && !(e.objectives ?? []).includes(f.objective)) return false;
  if (f.theme && !(e.themes ?? []).includes(f.theme)) return false;
  return true;
}

export interface CatalogueBackend {
  getMeta(): Promise<{ catalogueVersion: number }>;
  listPage(o: { limit: number; startAfter?: string; ageTier?: string; filter?: CatalogueFilter }): Promise<CatalogueEntry[]>;
  listChangedSince(o: { since: number; limit: number; startAfter?: string }): Promise<CatalogueEntry[]>;
}

export interface KeyValueStore { get<T>(k: string): T | undefined; set(k: string, v: unknown): void; delete(k: string): void; keys(): string[] }
export class MemoryKV implements KeyValueStore {
  private m = new Map<string, unknown>();
  get<T>(k: string) { return this.m.get(k) as T | undefined; }
  set(k: string, v: unknown) { this.m.set(k, v); }
  delete(k: string) { this.m.delete(k); }
  keys() { return [...this.m.keys()]; }
}

export type RefreshMode = 'refetch' | 'delta';
interface CachedPage { entries: CatalogueEntry[]; lastId?: string; exhausted: boolean }

export class CatalogueClient {
  private version = -1;
  constructor(
    private backend: CatalogueBackend,
    private kv: KeyValueStore,
    private opts: { pageSize: number; refresh: RefreshMode } = { pageSize: 20, refresh: 'delta' },
  ) {
    if (opts.pageSize > MAX_CATALOGUE_PAGE_SIZE) throw new Error(`pageSize must be <= ${MAX_CATALOGUE_PAGE_SIZE}`);
  }

  private pk = (filter: string, i: number) => `page:${filter}:${i}`;
  private filters(): string[] {
    return [...new Set(this.kv.keys().filter((k) => k.startsWith('page:')).map((k) => k.split(':')[1]))];
  }

  /** Call once when a learner opens the library. Costs one `library_meta` read (+ a delta query if the version moved). */
  async startSession(): Promise<{ catalogueVersion: number; changed: boolean }> {
    const { catalogueVersion } = await this.backend.getMeta();
    const cached = this.kv.get<number>('meta:version');
    this.version = catalogueVersion;
    if (cached === catalogueVersion) return { catalogueVersion, changed: false };
    if (cached === undefined) { this.kv.set('meta:version', catalogueVersion); return { catalogueVersion, changed: false }; }

    if (this.opts.refresh === 'refetch') {
      for (const k of this.kv.keys().filter((k) => k.startsWith('page:'))) this.kv.delete(k); // pages refetch on demand
    } else {
      await this.applyDelta(cached);
    }
    this.kv.set('meta:version', catalogueVersion);
    return { catalogueVersion, changed: true };
  }

  private async applyDelta(since: number) {
    const changed: CatalogueEntry[] = [];
    let after: string | undefined;
    for (;;) {
      const batch = await this.backend.listChangedSince({ since, limit: MAX_CATALOGUE_PAGE_SIZE, startAfter: after });
      changed.push(...batch);
      if (batch.length < MAX_CATALOGUE_PAGE_SIZE) break;
      after = batch[batch.length - 1].storyKey;
    }
    if (!changed.length) return;
    for (const f of this.filters()) {
      const pages: Array<[string, CachedPage]> = this.kv.keys().filter((k) => k.startsWith(`page:${f}:`)).sort((a, b) => Number(a.split(':')[2]) - Number(b.split(':')[2]))
        .map((k) => [k, this.kv.get<CachedPage>(k)!]);
      const lastCached = pages.length ? pages[pages.length - 1][1].lastId : undefined;
      const cachedIds = new Set(pages.flatMap(([, p]) => p.entries.map((e) => e.storyKey)));
      let invalidate = false;
      let tailGrew = false; // a new entry sorts after everything cached
      const byId = new Map(changed.map((e) => [e.storyKey, e]));
      for (const e of changed) {
        const inFilter = f === 'all' || matchesFilter(e, f);
        const had = cachedIds.has(e.storyKey);
        const leaves = e.status !== 'published' || !inFilter;
        if (had && !leaves) continue; // replaced below
        if (had && leaves) { invalidate = true; continue; } // removal shifts page boundaries
        if (!had && !leaves) {
          if (lastCached !== undefined && e.storyKey <= lastCached) invalidate = true; // a new entry inside the cached range
          else tailGrew = true;
        }
      }
      if (invalidate) { for (const [k] of pages) this.kv.delete(k); continue; }
      const last = pages[pages.length - 1];
      // If the cache had reached the END of the catalogue, appended entries belong on the (previously partial) last page:
      // drop just that page; it is refetched from the previous page's cursor when next browsed.
      const dropLast = tailGrew && last && last[1].exhausted;
      if (dropLast) this.kv.delete(last[0]);
      for (const [k, p] of pages) {
        if (dropLast && k === last[0]) continue;
        this.kv.set(k, { ...p, entries: p.entries.map((e) => byId.get(e.storyKey) ?? e) });
      }
    }
  }

  /** Page `index` (0-based) for an age filter ('all' for none). Pages are fetched in order, each from the previous cursor. */
  async getPage(index: number, filter = 'all'): Promise<CatalogueEntry[]> {
    if (this.version < 0) throw new Error('call startSession() first');
    for (let i = 0; i <= index; i++) {
      const key = this.pk(filter, i);
      const hit = this.kv.get<CachedPage>(key);
      if (hit) { if (i === index) return hit.entries; continue; }
      const prev = i > 0 ? this.kv.get<CachedPage>(this.pk(filter, i - 1)) : undefined;
      if (i > 0 && prev?.exhausted) return [];
      const pf = parseFilterKey(filter);
      const entries = await this.backend.listPage({ limit: this.opts.pageSize, startAfter: prev?.lastId, ...(pf.ageTier ? { ageTier: pf.ageTier } : {}), ...(Object.keys(pf).some((k) => k !== 'ageTier') ? { filter: pf } : {}) });
      const page: CachedPage = { entries, lastId: entries.length ? entries[entries.length - 1].storyKey : prev?.lastId, exhausted: entries.length < this.opts.pageSize };
      this.kv.set(key, page);
      if (i === index) return entries;
    }
    return [];
  }
}

/** The approach this replaces, for comparison: read the whole catalogue, 50 at a time. Reads grow with the library. */
export async function loadWholeCatalogue(b: CatalogueBackend): Promise<CatalogueEntry[]> {
  const all: CatalogueEntry[] = [];
  let after: string | undefined;
  for (;;) {
    const batch = await b.listPage({ limit: MAX_CATALOGUE_PAGE_SIZE, startAfter: after });
    all.push(...batch);
    if (batch.length < MAX_CATALOGUE_PAGE_SIZE) return all;
    after = batch[batch.length - 1].storyKey;
  }
}

// ----------------------------------------------------------------------------------------- simulated Firestore

export interface ReadCounters { reads: number; queries: number; rulesReads: number }

/**
 * A stand-in for the published catalogue in Firestore that bills like Firestore: one read per document returned (a query
 * returning nothing still costs one), plus the rules-lookup reads the real rules cause per request (staff/users doc +
 * school doc; see cost-model.ts REVISED.rulesReadsPerLibraryRequest). Page size above 50 is refused, as the rules do.
 */
export class SimulatedCatalogue implements CatalogueBackend {
  entries: CatalogueEntry[] = [];
  catalogueVersion = 1;
  private baseCount: number;
  counters: ReadCounters = { reads: 0, queries: 0, rulesReads: 0 };
  /** 'append': new entries sort after every existing one (sortKey assigned at publish). 'random': they land anywhere. */
  constructor(count: number, private rulesReadsPerRequest = 3, private insertMode: 'append' | 'random' = 'append') {
    this.baseCount = count;
    for (let i = 0; i < count; i++) this.entries.push(this.make(i));
    this.entries.sort((a, b) => (a.storyKey < b.storyKey ? -1 : 1));
  }
  private make(i: number, added = false): CatalogueEntry {
    const id = added && this.insertMode === 'random'
      ? `story-${String(Math.floor(((Math.imul(i, 2654435761) >>> 0) / 4294967296) * this.baseCount)).padStart(6, '0')}-n${i}`
      : `story-${String(i).padStart(6, '0')}`;
    const h = `sha256:${i.toString(16).padStart(64, '0')}`;
    return {
      storyKey: id, version: 1, packageVersion: 1, status: 'published', title: `Story ${i}`, ageTiers: [['3-4', '5-6', '7-8', '9-10'][i % 4]],
      pageCount: 10, packagePath: `story_library/published/packages/${id}/v1/${h.slice(7, 23)}.json`, packageHash: h, contentHash: h,
      publishedBy: 'publisher1', updatedAt: 1 as unknown,
    };
  }
  private bill(n: number) { this.counters.reads += Math.max(1, n); this.counters.queries++; this.counters.rulesReads += this.rulesReadsPerRequest; }
  private cap(limit: number) { if (limit > MAX_CATALOGUE_PAGE_SIZE) throw new Error('rules refuse list limits above 50'); }
  async getMeta() { this.bill(1); return { catalogueVersion: this.catalogueVersion }; }
  async listPage(o: { limit: number; startAfter?: string; ageTier?: string; filter?: CatalogueFilter }) {
    this.cap(o.limit);
    const rows = this.entries.filter((e) => e.status === 'published' && matchesFilter(e, filterKey({ ...(o.filter ?? {}), ...(o.ageTier ? { ageTier: o.ageTier } : {}) })) && (!o.startAfter || e.storyKey > o.startAfter)).slice(0, o.limit);
    this.bill(rows.length);
    return structuredClone(rows);
  }
  async listChangedSince(o: { since: number; limit: number; startAfter?: string }) {
    this.cap(o.limit);
    // includes archived tombstones so clients can drop them
    const rows = this.entries.filter((e) => (e.updatedAt as number) > o.since && (!o.startAfter || e.storyKey > o.startAfter)).slice(0, o.limit);
    this.bill(rows.length);
    return structuredClone(rows);
  }
  // ---- publisher actions (one catalogue version per publish batch) ----
  publishBatch(change: { add?: number[]; update?: string[]; archive?: string[] }) {
    this.catalogueVersion++;
    for (const i of change.add ?? []) { const e = this.make(i, true); e.updatedAt = this.catalogueVersion as unknown; this.entries.push(e); }
    for (const id of change.update ?? []) { const e = this.entries.find((x) => x.storyKey === id); if (e) { e.version++; e.title += '*'; e.updatedAt = this.catalogueVersion as unknown; } }
    for (const id of change.archive ?? []) { const e = this.entries.find((x) => x.storyKey === id); if (e) { e.status = 'archived'; e.updatedAt = this.catalogueVersion as unknown; } }
    this.entries.sort((a, b) => (a.storyKey < b.storyKey ? -1 : 1));
  }
  truth(ageTier?: string) { return this.entries.filter((e) => e.status === 'published' && (!ageTier || e.ageTiers.includes(ageTier))); }
  reset() { this.counters = { reads: 0, queries: 0, rulesReads: 0 }; }
}

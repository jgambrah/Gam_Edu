/**
 * Catalogue backend over a static list of entries (the preview's catalogue.json, and tests). It implements the same
 * `CatalogueBackend` contract the Firestore backend will, so the REAL CatalogueClient (version-keyed cache, delta
 * refresh, filter keys) runs unchanged on top of it. Counts every call so the UI can show what a session costs.
 */
import { MAX_CATALOGUE_PAGE_SIZE, type CatalogueEntry } from './types';
import { filterKey, matchesFilter, type CatalogueBackend } from './catalogue-client';
import type { CatalogueFilter } from './classification';

export interface StaticCatalogueData { catalogueVersion: number; totalPublished?: number; entries: CatalogueEntry[] }

export class StaticCatalogueBackend implements CatalogueBackend {
  readonly counters = { metaReads: 0, queries: 0, entriesRead: 0 };
  private sortedCache: CatalogueEntry[] | null = null;
  constructor(private data: StaticCatalogueData) {}
  private sorted() {
    if (!this.sortedCache) {
      this.sortedCache = [...this.data.entries].sort((a, b) => (a.storyKey < b.storyKey ? -1 : 1));
    }
    return this.sortedCache;
  }
  async getMeta() {
    this.counters.metaReads++;
    const totalPublished = this.data.totalPublished ?? this.data.entries.filter((e) => e.status === 'published').length;
    return { catalogueVersion: this.data.catalogueVersion, totalPublished };
  }
  async listPage(o: { limit: number; startAfter?: string; ageTier?: string; filter?: CatalogueFilter }) {
    if (o.limit > MAX_CATALOGUE_PAGE_SIZE) throw new Error(`limit must be <= ${MAX_CATALOGUE_PAGE_SIZE}`);
    const key = filterKey({ ...(o.filter ?? {}), ...(o.ageTier ? { ageTier: o.ageTier } : {}) });
    const rows = this.sorted().filter((e) => e.status === 'published' && matchesFilter(e, key) && (!o.startAfter || e.storyKey > o.startAfter)).slice(0, o.limit);
    this.counters.queries++; this.counters.entriesRead += rows.length;
    return structuredClone(rows);
  }
  async listChangedSince(o: { since: number; limit: number; startAfter?: string }) {
    if (o.limit > MAX_CATALOGUE_PAGE_SIZE) throw new Error(`limit must be <= ${MAX_CATALOGUE_PAGE_SIZE}`);
    const rows = this.sorted().filter((e) => Number(e.changedInVersion ?? e.updatedAt) > o.since && (!o.startAfter || e.storyKey > o.startAfter)).slice(0, o.limit);
    this.counters.queries++; this.counters.entriesRead += rows.length;
    return structuredClone(rows);
  }
}

/**
 * Turns the library screen's filter selection into (a) ONE indexed server query shape and (b) a client-side refinement
 * for whatever the server query cannot express (age; a second list field). The client never downloads the library to
 * filter it: it pages through the server-filtered list (<= 50 per page, cached per filter) until it has enough matches.
 */
import { filterKey, type CatalogueClient } from './catalogue-client';
import { matchShape, type CatalogueFilter } from './classification';
import type { CatalogueEntry } from './types';

export interface Selection { classId?: string; ageYears?: number; genre?: string; readingLevel?: string }
export interface QueryPlan { server: CatalogueFilter; key: string; refine: (e: CatalogueEntry) => boolean; shapeId: string }

export function planQuery(sel: Selection): QueryPlan {
  const { classId, genre, readingLevel, ageYears } = sel;
  let server: CatalogueFilter;
  if (classId && readingLevel) server = { classId, readingLevel };
  else if (classId) server = { classId };
  else if (genre && readingLevel) server = { genre, readingLevel };
  else if (genre) server = { genre };
  else if (readingLevel) server = { readingLevel };
  else server = {};
  const shape = matchShape(server);
  if (!shape) throw new Error('internal: no indexed query for the chosen filter combination');
  const refine = (e: CatalogueEntry) =>
    (!classId || server.classId === classId || (e.classIds ?? []).includes(classId))
    && (!genre || server.genre === genre || (e.genres ?? []).includes(genre))
    && (!readingLevel || server.readingLevel === readingLevel || e.readingLevel === readingLevel)
    && (ageYears === undefined || (e.ageMin !== undefined && e.ageMax !== undefined ? e.ageMin <= ageYears && ageYears <= e.ageMax : true));
  return { server, key: filterKey(server), refine, shapeId: shape.id };
}

/** Pages through a filtered catalogue lazily, returning only entries that pass the client refinement. */
export class FilteredFeed {
  entries: CatalogueEntry[] = [];
  exhausted = false;
  pagesFetched = 0;
  private next = 0;
  constructor(private client: CatalogueClient, readonly plan: QueryPlan, private pageSize = 20, private maxPagesPerLoad = 5) {}

  /** Load more pages until at least `want` new matches are found, the end is reached, or the page budget is spent. */
  async loadMore(want = 6): Promise<CatalogueEntry[]> {
    const added: CatalogueEntry[] = [];
    let budget = this.maxPagesPerLoad;
    while (!this.exhausted && added.length < want && budget-- > 0) {
      const page = await this.client.getPage(this.next++, this.plan.key);
      this.pagesFetched++;
      if (page.length < this.pageSize) this.exhausted = true;
      for (const e of page) if (this.plan.refine(e)) { this.entries.push(e); added.push(e); }
    }
    return added;
  }
}

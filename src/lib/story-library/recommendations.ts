/**
 * "Read next": a small, rule-based recommender that runs in the browser on the catalogue entries already loaded.
 * No API calls, no model and no tracking beyond what is already kept on the device.
 *
 * 1. FIT comes first. A story outside the reader's class or age is never suggested, however well it matches their interests.
 * 2. Then INTEREST: the topics the reader picked, plus what they have finished or saved (genres and themes they keep choosing).
 * 3. Then PROGRESSION: nudge towards a slightly harder story than the ones they have comfortably finished.
 * 4. A teacher can FOCUS a NaCCA strand or standard; matching stories rise to the top.
 * 5. The shelf keeps a place for the library's aims (science, life skills, heritage) so interests alone do not narrow it.
 */
import { interestsOf } from './interests';
import { matchesNaccaFocus } from './nacca';
import type { CatalogueEntry } from './types';

export interface RecProfile {
  /** Interest ids the reader picked (see INTEREST_OPTIONS). */
  interests: readonly string[];
  /** Classes the reader is in or browsing. Empty means any class. */
  classIds?: readonly string[];
  /** The reader's age in years, if known. */
  ageYears?: number;
  /** Stories to leave out: finished and in-progress ones (those have their own shelves). */
  excludeKeys?: ReadonlySet<string>;
  /** Entries the reader finished or saved, used to learn favourite genres/themes and a comfortable difficulty. */
  history?: readonly CatalogueEntry[];
  /** Entries the reader finished, used for the difficulty nudge. */
  finished?: readonly CatalogueEntry[];
  /** NaCCA codes or prefixes a teacher wants brought forward, for example ['B4.2']. */
  focusNacca?: readonly string[];
}

export interface Recommendation { entry: CatalogueEntry; score: number; reasons: string[] }

const W = { interest: 3, interestCap: 2, affinityCap: 3, focus: 6, mission: 1 } as const;

/** Science, life-skills and heritage stories the library wants every child to meet. */
export function isMissionStory(e: CatalogueEntry): boolean {
  const g = [...(e.genres ?? []), ...(e.categories ?? [])];
  return Boolean(e.nacca?.length)
    || g.some((x) => x === 'science' || x === 'cultural' || x === 'folktale' || x === 'historical')
    || (e.objectives ?? []).some((o) => o === 'environmental-awareness' || o === 'cultural-heritage' || o === 'financial-literacy')
    || (e.themes ?? []).includes('health-and-wellbeing');
}

/** Does the story fit the reader's class and age? Missing data on the story never excludes it. */
export function fits(e: CatalogueEntry, p: Pick<RecProfile, 'classIds' | 'ageYears'>): boolean {
  if (p.classIds?.length && e.classIds?.length && !e.classIds.some((c) => p.classIds!.includes(c))) return false;
  if (p.ageYears !== undefined && e.ageMin !== undefined && e.ageMax !== undefined && (p.ageYears < e.ageMin || p.ageYears > e.ageMax)) return false;
  return true;
}

function median(xs: number[]): number | undefined {
  if (!xs.length) return undefined;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor((s.length - 1) / 2)];
}

/** Scores one story for one reader. Returns null when it should not be suggested at all. */
export function scoreEntry(e: CatalogueEntry, p: RecProfile): Recommendation | null {
  if (p.excludeKeys?.has(e.storyKey)) return null;
  if (!fits(e, p)) return null;
  const reasons: string[] = [];
  let score = 0;

  const mine = new Set(p.interests);
  const matched = interestsOf(e).filter((i) => mine.has(i));
  if (matched.length) { score += W.interest * Math.min(matched.length, W.interestCap); reasons.push('interest'); }

  // Affinity: genres and themes of stories the reader finished or saved.
  if (p.history?.length) {
    const seen = new Map<string, number>();
    for (const h of p.history) for (const t of [...(h.genres ?? []), ...(h.themes ?? [])]) seen.set(t, (seen.get(t) ?? 0) + 1);
    const hits = [...(e.genres ?? []), ...(e.themes ?? [])].filter((t) => seen.has(t));
    if (hits.length) { score += Math.min(hits.length, W.affinityCap); reasons.push('like-your-reads'); }
  }

  // Progression: a story one step above the comfortable level is best; far above is discouraged.
  const comfy = median((p.finished ?? []).map((f) => f.difficulty).filter((d): d is number => typeof d === 'number'));
  if (comfy !== undefined && typeof e.difficulty === 'number') {
    const gap = e.difficulty - comfy;
    if (gap === 1) { score += 2; reasons.push('next-step'); }
    else if (gap === 0) score += 1;
    else if (gap > 2) score -= 2;
  }

  if (matchesNaccaFocus(e.nacca, p.focusNacca)) { score += W.focus; reasons.push('class-focus'); }
  if (isMissionStory(e)) score += W.mission;
  return { entry: e, score, reasons };
}

export interface ReadNextOptions { limit?: number; missionSlots?: number; maxPerGenre?: number }

/**
 * The "Read next" list: best matches first, with up to `missionSlots` places held for science, life-skills and heritage
 * stories, and no more than `maxPerGenre` stories of one main genre so the shelf stays varied. With no interests, history
 * or focus there is nothing to personalise, so the list is empty and the shelf asks what the reader likes.
 */
export function recommendReadNext(entries: readonly CatalogueEntry[], p: RecProfile, o: ReadNextOptions = {}): Recommendation[] {
  const limit = o.limit ?? 6;
  const missionSlots = Math.min(o.missionSlots ?? 2, limit);
  const maxPerGenre = o.maxPerGenre ?? 3;
  if (!p.interests.length && !p.history?.length && !p.focusNacca?.length) return [];

  const scored = entries.map((e) => scoreEntry(e, p)).filter((r): r is Recommendation => r !== null && r.score > 0);
  // Highest score first; ties go to the newer story, then the key, so the order is stable between visits.
  scored.sort((a, b) => b.score - a.score || (b.entry.sortKey ?? 0) - (a.entry.sortKey ?? 0) || a.entry.storyKey.localeCompare(b.entry.storyKey));

  const picked: Recommendation[] = [];
  const perGenre = new Map<string, number>();
  const room = (r: Recommendation) => (perGenre.get(r.entry.genres?.[0] ?? '') ?? 0) < maxPerGenre;
  const take = (r: Recommendation) => { picked.push(r); const g = r.entry.genres?.[0] ?? ''; perGenre.set(g, (perGenre.get(g) ?? 0) + 1); };

  // Reserve mission slots first (best-scoring mission stories), then fill the rest by score.
  for (const r of scored) { if (picked.length >= missionSlots) break; if (isMissionStory(r.entry) && room(r)) take(r); }
  for (const r of scored) { if (picked.length >= limit) break; if (!picked.includes(r) && room(r)) take(r); }
  return picked.sort((a, b) => b.score - a.score || (b.entry.sortKey ?? 0) - (a.entry.sortKey ?? 0));
}

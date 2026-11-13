/**
 * Reader interests: the topics a child says they like, used to put matching stories on the "Read next" shelf.
 * - Each interest maps to the genres, themes and objectives already on every catalogue entry (no new tagging needed).
 * - Stored on this device only (no network), scoped to the signed-in user like reading progress.
 * - Pure TypeScript with no Firebase imports, so /story-spark-preview stays isolated (preview-isolation.test.ts).
 */
import { getActiveProgressUser } from './progress-store';
import type { CatalogueEntry } from './types';

export interface InterestOption {
  id: string;
  label: string;
  emoji: string;
  genres?: readonly string[];
  themes?: readonly string[];
  objectives?: readonly string[];
}

export const INTEREST_OPTIONS: readonly InterestOption[] = [
  { id: 'animals', label: 'Animals', emoji: '🐾', genres: ['animal'], themes: ['animals-and-habitats'] },
  { id: 'science', label: 'Science & nature', emoji: '🔬', genres: ['science', 'nature', 'science-fiction'], themes: ['technology', 'weather', 'night-sky'] },
  { id: 'folktales', label: 'Folktales & culture', emoji: '🕷️', genres: ['folktale', 'cultural'], themes: ['festivals', 'identity'] },
  { id: 'adventure', label: 'Adventure & courage', emoji: '🧭', genres: ['adventure', 'fantasy'], themes: ['fear-and-courage'] },
  { id: 'mystery', label: 'Mystery & history', emoji: '🕵️', genres: ['mystery', 'historical', 'biography'] },
  { id: 'friends', label: 'Friends & family', emoji: '🤝', genres: ['friendship', 'family'], themes: ['friendship', 'family', 'helping-others'] },
  { id: 'school', label: 'School life', emoji: '🏫', genres: ['school-life'], themes: ['school'] },
  { id: 'money', label: 'Money & business', emoji: '💰', themes: ['money-and-enterprise', 'careers', 'leadership'], objectives: ['financial-literacy'] },
  { id: 'health', label: 'Health & safety', emoji: '🩺', themes: ['health-and-wellbeing'] },
  { id: 'farm', label: 'Farm & food', emoji: '🌽', themes: ['farm-and-garden', 'food'] },
  { id: 'rhymes', label: 'Rhymes & poems', emoji: '🎭', genres: ['rhyme', 'poetry'] },
  { id: 'funny', label: 'Funny stories', emoji: '😄', genres: ['humour'] },
  { id: 'bedtime', label: 'Bedtime', emoji: '🌙', genres: ['bedtime'] },
];

const OPTION_IDS = new Set(INTEREST_OPTIONS.map((o) => o.id));

/** The interest ids a catalogue entry matches (by genre, theme or objective). */
export function interestsOf(e: Pick<CatalogueEntry, 'genres' | 'categories' | 'themes' | 'objectives'>): string[] {
  const genres = new Set([...(e.genres ?? []), ...(e.categories ?? [])]);
  const themes = new Set(e.themes ?? []);
  const objectives = new Set(e.objectives ?? []);
  return INTEREST_OPTIONS.filter((o) =>
    (o.genres ?? []).some((g) => genres.has(g)) || (o.themes ?? []).some((t) => themes.has(t)) || (o.objectives ?? []).some((x) => objectives.has(x)),
  ).map((o) => o.id);
}

// ---------------------------------------------------------------------------------------------------------- storage

const listeners = new Set<() => void>();
const notify = () => { for (const fn of listeners) { try { fn(); } catch { /* ignore listener errors */ } } };
export function subscribeInterestChanges(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

const keyFor = (uid: string | null) => (uid ? `story-spark-preview:u:${uid}:interests` : 'story-spark-preview:interests');
function safe(): Storage | undefined { try { return typeof localStorage !== 'undefined' ? localStorage : undefined; } catch { return undefined; } }

export function loadInterests(storage: Pick<Storage, 'getItem'> | undefined = safe(), uid: string | null = getActiveProgressUser()): string[] {
  try {
    const raw = storage?.getItem(keyFor(uid));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? [...new Set(arr.filter((x): x is string => typeof x === 'string' && OPTION_IDS.has(x)))] : [];
  } catch { return []; }
}

export function saveInterests(ids: readonly string[], storage: Pick<Storage, 'setItem'> | undefined = safe(), uid: string | null = getActiveProgressUser()): string[] {
  const clean = [...new Set(ids.filter((x) => OPTION_IDS.has(x)))];
  try { storage?.setItem(keyFor(uid), JSON.stringify(clean)); } catch { /* storage full or blocked: interests are a convenience */ }
  notify();
  return clean;
}

export function toggleInterest(id: string, storage: Storage | undefined = safe(), uid: string | null = getActiveProgressUser()): string[] {
  const cur = loadInterests(storage, uid);
  return saveInterests(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id], storage, uid);
}

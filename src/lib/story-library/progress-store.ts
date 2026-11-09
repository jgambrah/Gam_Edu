/**
 * Local reading progress and favourites (device only, no network). One tiny record per story; nothing identifies a child.
 * The production design batches progress to the server separately (see the analytics design); the preview never sends it.
 */
export interface LocalProgress { step: number; total: number; done: boolean; updatedAt: number; mode?: string }
const key = (storyKey: string) => `story-spark-preview:progress:${storyKey}`;
const FAV_KEY = 'story-spark-preview:favourites';

export function loadProgress(storyKey: string, storage: Pick<Storage, 'getItem'> | undefined = safe()): LocalProgress | undefined {
  try {
    const raw = storage?.getItem(key(storyKey));
    if (!raw) return undefined;
    const p = JSON.parse(raw) as LocalProgress;
    return Number.isInteger(p.step) && Number.isInteger(p.total) && p.step >= 0 && p.total > 0 ? p : undefined;
  } catch { return undefined; }
}
export function saveProgress(storyKey: string, p: LocalProgress, storage: Pick<Storage, 'setItem'> | undefined = safe()) {
  try { storage?.setItem(key(storyKey), JSON.stringify(p)); } catch { /* storage full or blocked: progress is a convenience */ }
}
export function clearProgress(storyKey: string, storage: Pick<Storage, 'removeItem'> | undefined = safe()) {
  try { storage?.removeItem(key(storyKey)); } catch { /* ignore */ }
}

export function loadFavourites(storage: Pick<Storage, 'getItem'> | undefined = safe()): Set<string> {
  try {
    const raw = storage?.getItem(FAV_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x): x is string => typeof x === 'string')) : new Set();
  } catch { return new Set(); }
}

export function toggleFavourite(storyKey: string, storage: Pick<Storage, 'getItem' | 'setItem'> | undefined = safe()): boolean {
  const favs = loadFavourites(storage);
  const nextState = !favs.has(storyKey);
  if (nextState) favs.add(storyKey); else favs.delete(storyKey);
  try { storage?.setItem(FAV_KEY, JSON.stringify([...favs])); } catch { /* ignore */ }
  return nextState;
}

function safe(): Storage | undefined { try { return typeof localStorage !== 'undefined' ? localStorage : undefined; } catch { return undefined; } }

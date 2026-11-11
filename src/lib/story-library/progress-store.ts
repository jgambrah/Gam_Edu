/**
 * Reading progress and favourites store.
 * - Pure TypeScript with zero Firebase imports so /story-spark-preview stays 100% isolated (preview-isolation.test.ts).
 * - Supports user-scoped local keys when signed in, automatic one-time migration of legacy device keys,
 *   change listeners for instant UI updates, O(opened-books) shelf snapshots, and deterministic cloud merge helpers.
 */
export interface LocalProgress {
  step: number;
  total: number;
  done: boolean;
  updatedAt: number;
  mode?: string;
}

export interface FavRecord {
  on: boolean;
  updatedAt: number;
}

export interface StoryShelfCloudPayload {
  progress: Record<string, LocalProgress>;
  favMeta: Record<string, FavRecord>;
  favourites: string[];
  updatedAt: number;
}

export interface ProgressSnapshot {
  favs: Set<string>;
  inProgress: Set<string>;
  completed: Set<string>;
  byStory: Map<string, LocalProgress>;
}

const LEGACY_PROGRESS_PREFIX = 'story-spark-preview:progress:';
const LEGACY_FAV_KEY = 'story-spark-preview:favourites';
const LEGACY_CLAIMED_KEY = 'story-spark-preview:legacy-claimed-uid';

let activeUserId: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) {
    try { fn(); } catch { /* ignore listener errors */ }
  }
}

export function subscribeProgressChanges(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function progressPrefix(uid: string | null = activeUserId): string {
  return uid ? `story-spark-preview:u:${uid}:progress:` : LEGACY_PROGRESS_PREFIX;
}
function progressKey(storyKey: string, uid: string | null = activeUserId): string {
  return `${progressPrefix(uid)}${storyKey}`;
}
function favKey(uid: string | null = activeUserId): string {
  return uid ? `story-spark-preview:u:${uid}:favourites` : LEGACY_FAV_KEY;
}
function favMetaKey(uid: string | null = activeUserId): string {
  return uid ? `story-spark-preview:u:${uid}:fav-meta` : 'story-spark-preview:fav-meta';
}

function isValidProgress(p: any): p is LocalProgress {
  return Boolean(
    p &&
    typeof p === 'object' &&
    Number.isInteger(p.step) &&
    Number.isInteger(p.total) &&
    p.step >= 0 &&
    p.total > 0,
  );
}

/**
 * Sets the active signed-in user scope and performs a one-time migration of any existing
 * un-scoped progress/favourites on this browser so prior work is never lost.
 */
export function setActiveProgressUser(uid: string | null | undefined, storage: Storage | undefined = safe()): void {
  const normalized = uid && uid.trim() ? uid.trim() : null;
  const changed = activeUserId !== normalized;
  activeUserId = normalized;
  if (normalized && storage) {
    migrateLegacyIfUnclaimed(normalized, storage);
  }
  if (changed) notify();
}

export function getActiveProgressUser(): string | null {
  return activeUserId;
}

function migrateLegacyIfUnclaimed(uid: string, storage: Storage) {
  try {
    const claimedBy = storage.getItem(LEGACY_CLAIMED_KEY);
    if (claimedBy && claimedBy !== uid) return;
    const migFlag = `story-spark-preview:u:${uid}:migrated`;
    if (storage.getItem(migFlag) === '1') return;

    let copiedAny = false;
    if (typeof storage.length === 'number' && typeof storage.key === 'function') {
      const keys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k) keys.push(k);
      }
      for (const k of keys) {
        if (k.startsWith(LEGACY_PROGRESS_PREFIX)) {
          const storyKey = k.slice(LEGACY_PROGRESS_PREFIX.length);
          const targetKey = progressKey(storyKey, uid);
          if (!storage.getItem(targetKey)) {
            const raw = storage.getItem(k);
            if (raw) {
              storage.setItem(targetKey, raw);
              copiedAny = true;
            }
          }
        }
      }
    }

    const legacyFavRaw = storage.getItem(LEGACY_FAV_KEY);
    if (legacyFavRaw && !storage.getItem(favKey(uid))) {
      storage.setItem(favKey(uid), legacyFavRaw);
      try {
        const arr = JSON.parse(legacyFavRaw);
        if (Array.isArray(arr)) {
          const meta: Record<string, FavRecord> = {};
          const now = Date.now();
          for (const item of arr) {
            if (typeof item === 'string') meta[item] = { on: true, updatedAt: now };
          }
          storage.setItem(favMetaKey(uid), JSON.stringify(meta));
          copiedAny = true;
        }
      } catch { /* ignore */ }
    }

    storage.setItem(migFlag, '1');
    if (copiedAny && !claimedBy) {
      storage.setItem(LEGACY_CLAIMED_KEY, uid);
    }
  } catch { /* ignore storage restrictions */ }
}

export function loadProgress(
  storyKey: string,
  storage: Pick<Storage, 'getItem'> | undefined = safe(),
  uid: string | null = activeUserId,
): LocalProgress | undefined {
  try {
    const raw = storage?.getItem(progressKey(storyKey, uid));
    if (!raw) return undefined;
    const p = JSON.parse(raw);
    return isValidProgress(p) ? p : undefined;
  } catch {
    return undefined;
  }
}

/**
 * O(opened-books) shelf progress snapshot: scans only the keys actually stored for the learner
 * rather than looping over thousands of catalogue entries on every render.
 */
export function loadProgressSnapshot(
  fallbackStoryKeys?: readonly string[],
  storage: Storage | undefined = safe(),
  uid: string | null = activeUserId,
): ProgressSnapshot {
  const favs = loadFavourites(storage, uid);
  const inProgress = new Set<string>();
  const completed = new Set<string>();
  const byStory = new Map<string, LocalProgress>();

  if (!storage) return { favs, inProgress, completed, byStory };

  const pref = progressPrefix(uid);
  try {
    if (typeof storage.length === 'number' && typeof storage.key === 'function') {
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (!k || !k.startsWith(pref)) continue;
        const storyKey = k.slice(pref.length);
        const raw = storage.getItem(k);
        if (!raw) continue;
        try {
          const p = JSON.parse(raw);
          if (!isValidProgress(p)) continue;
          byStory.set(storyKey, p);
          if (p.done) completed.add(storyKey);
          else if (p.step >= 0) inProgress.add(storyKey);
        } catch { /* ignore corrupt item */ }
      }
      return { favs, inProgress, completed, byStory };
    }
  } catch { /* fall back to known keys */ }

  if (fallbackStoryKeys) {
    for (const storyKey of fallbackStoryKeys) {
      const p = loadProgress(storyKey, storage, uid);
      if (!p) continue;
      byStory.set(storyKey, p);
      if (p.done) completed.add(storyKey);
      else if (p.step >= 0) inProgress.add(storyKey);
    }
  }
  return { favs, inProgress, completed, byStory };
}

export function saveProgress(
  storyKey: string,
  p: LocalProgress,
  storage: Pick<Storage, 'getItem' | 'setItem'> | undefined = safe(),
  uid: string | null = activeUserId,
) {
  try {
    // Never downgrade a previously completed story back to undone when re-reading
    const existing = loadProgress(storyKey, storage, uid);
    const merged: LocalProgress = existing?.done && !p.done ? { ...p, done: true } : p;
    storage?.setItem(progressKey(storyKey, uid), JSON.stringify(merged));
    notify();
  } catch { /* storage full or blocked: progress is a convenience */ }
}

export function clearProgress(
  storyKey: string,
  storage: Pick<Storage, 'removeItem'> | undefined = safe(),
  uid: string | null = activeUserId,
) {
  try {
    storage?.removeItem(progressKey(storyKey, uid));
    notify();
  } catch { /* ignore */ }
}

function loadFavMeta(
  storage: Pick<Storage, 'getItem'> | undefined = safe(),
  uid: string | null = activeUserId,
): Record<string, FavRecord> {
  try {
    const raw = storage?.getItem(favMetaKey(uid));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: Record<string, FavRecord> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, any>)) {
      if (v && typeof v.on === 'boolean' && typeof v.updatedAt === 'number') {
        out[k] = { on: v.on, updatedAt: v.updatedAt };
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function loadFavourites(
  storage: Pick<Storage, 'getItem'> | undefined = safe(),
  uid: string | null = activeUserId,
): Set<string> {
  try {
    const raw = storage?.getItem(favKey(uid));
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x): x is string => typeof x === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

export function toggleFavourite(
  storyKey: string,
  storage: Pick<Storage, 'getItem' | 'setItem'> | undefined = safe(),
  uid: string | null = activeUserId,
): boolean {
  const favs = loadFavourites(storage, uid);
  const meta = loadFavMeta(storage, uid);
  const nextState = !favs.has(storyKey);
  if (nextState) favs.add(storyKey);
  else favs.delete(storyKey);
  meta[storyKey] = { on: nextState, updatedAt: Date.now() };
  try {
    storage?.setItem(favKey(uid), JSON.stringify([...favs]));
    storage?.setItem(favMetaKey(uid), JSON.stringify(meta));
    notify();
  } catch { /* ignore */ }
  return nextState;
}

export function exportCloudShelf(
  uid: string | null = activeUserId,
  knownStoryKeys?: readonly string[],
  storage: Storage | undefined = safe(),
): StoryShelfCloudPayload {
  const snap = loadProgressSnapshot(knownStoryKeys, storage, uid);
  const progress: Record<string, LocalProgress> = Object.fromEntries(snap.byStory.entries());
  const favs = snap.favs;
  const favMeta = loadFavMeta(storage, uid);
  for (const k of favs) {
    if (!favMeta[k]) favMeta[k] = { on: true, updatedAt: 1 };
  }
  return {
    progress,
    favMeta,
    favourites: [...favs].sort(),
    updatedAt: Date.now(),
  };
}

export function mergeAndSaveCloudShelf(
  remote: Partial<StoryShelfCloudPayload> | null | undefined,
  uid: string | null = activeUserId,
  storage: Storage | undefined = safe(),
): { merged: StoryShelfCloudPayload; needsUpload: boolean } {
  const local = exportCloudShelf(uid, undefined, storage);
  const remoteProgress = remote?.progress && typeof remote.progress === 'object' ? remote.progress : {};
  const mergedProgress: Record<string, LocalProgress> = {};
  let needsUpload = !remote || typeof remote !== 'object';

  const allProgressKeys = new Set([...Object.keys(local.progress), ...Object.keys(remoteProgress)]);
  for (const k of allProgressKeys) {
    const loc = isValidProgress(local.progress[k]) ? local.progress[k] : undefined;
    const rem = isValidProgress(remoteProgress[k]) ? remoteProgress[k] : undefined;
    if (loc && !rem) {
      mergedProgress[k] = loc;
      needsUpload = true;
    } else if (!loc && rem) {
      mergedProgress[k] = rem;
    } else if (loc && rem) {
      const done = Boolean(loc.done || rem.done);
      const newer = (loc.updatedAt ?? 0) >= (rem.updatedAt ?? 0) ? loc : rem;
      const combined: LocalProgress = { ...newer, done };
      mergedProgress[k] = combined;
      if (
        combined.done !== rem.done ||
        combined.step !== rem.step ||
        combined.total !== rem.total
      ) {
        needsUpload = true;
      }
    }
  }

  const remoteFavMeta: Record<string, FavRecord> = {};
  if (remote?.favMeta && typeof remote.favMeta === 'object') {
    for (const [k, v] of Object.entries(remote.favMeta)) {
      if (v && typeof v.on === 'boolean' && typeof v.updatedAt === 'number') {
        remoteFavMeta[k] = { on: v.on, updatedAt: v.updatedAt };
      }
    }
  }
  if (Array.isArray(remote?.favourites)) {
    for (const k of remote.favourites) {
      if (typeof k === 'string' && !remoteFavMeta[k]) {
        remoteFavMeta[k] = { on: true, updatedAt: 1 };
      }
    }
  }

  const mergedFavMeta: Record<string, FavRecord> = {};
  const allFavKeys = new Set([...Object.keys(local.favMeta), ...Object.keys(remoteFavMeta)]);
  for (const k of allFavKeys) {
    const loc = local.favMeta[k];
    const rem = remoteFavMeta[k];
    if (loc && !rem) {
      mergedFavMeta[k] = loc;
      needsUpload = true;
    } else if (!loc && rem) {
      mergedFavMeta[k] = rem;
    } else if (loc && rem) {
      const winner = loc.updatedAt >= rem.updatedAt ? loc : rem;
      mergedFavMeta[k] = winner;
      if (winner.on !== rem.on || winner.updatedAt > rem.updatedAt) {
        needsUpload = true;
      }
    }
  }

  const activeFavs = Object.entries(mergedFavMeta)
    .filter(([, v]) => v.on)
    .map(([k]) => k)
    .sort();

  if (storage) {
    try {
      for (const [k, p] of Object.entries(mergedProgress)) {
        storage.setItem(progressKey(k, uid), JSON.stringify(p));
      }
      storage.setItem(favKey(uid), JSON.stringify(activeFavs));
      storage.setItem(favMetaKey(uid), JSON.stringify(mergedFavMeta));
    } catch { /* ignore */ }
  }

  notify();

  return {
    merged: {
      progress: mergedProgress,
      favMeta: mergedFavMeta,
      favourites: activeFavs,
      updatedAt: Date.now(),
    },
    needsUpload,
  };
}

function safe(): Storage | undefined {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : undefined;
  } catch {
    return undefined;
  }
}

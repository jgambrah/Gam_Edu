/**
 * Local reading progress (device only, no network). One tiny record per story; nothing identifies a child.
 * The production design batches progress to the server separately (see the analytics design); the preview never sends it.
 */
export interface LocalProgress { step: number; total: number; done: boolean; updatedAt: number; mode?: string }
const key = (storyKey: string) => `story-spark-preview:progress:${storyKey}`;

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
function safe(): Storage | undefined { try { return typeof localStorage !== 'undefined' ? localStorage : undefined; } catch { return undefined; } }

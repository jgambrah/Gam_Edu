import type { KeyValueStore } from './catalogue-client';

/**
 * Device-persistent KeyValueStore for the catalogue client. Reads are served from memory (the interface is synchronous);
 * every change is written through to localStorage. If storage is unavailable or full (private mode, quota) it degrades to
 * memory only: browsing still works, it just does not survive a reload. A corrupt or foreign entry is ignored and removed,
 * so a damaged cache can never break the library (it only costs a refetch).
 */
export class PersistentKV implements KeyValueStore {
  private m = new Map<string, unknown>();
  persistent = true;
  constructor(private ns: string, private storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'> | null = safeStorage() ?? null) {
    if (!storage) { this.persistent = false; return; }
    try {
      const prefix = `${ns}:`;
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (!k || !k.startsWith(prefix)) continue;
        try { this.m.set(k.slice(prefix.length), JSON.parse(storage.getItem(k) ?? 'null')); }
        catch { try { storage.removeItem(k); } catch { /* ignore */ } }
      }
    } catch { this.persistent = false; }
  }
  get<T>(k: string) { return this.m.get(k) as T | undefined; }
  set(k: string, v: unknown) {
    this.m.set(k, v);
    if (!this.storage || !this.persistent) return;
    try { this.storage.setItem(`${this.ns}:${k}`, JSON.stringify(v)); } catch { this.persistent = false; }
  }
  delete(k: string) {
    this.m.delete(k);
    try { this.storage?.removeItem(`${this.ns}:${k}`); } catch { /* ignore */ }
  }
  keys() { return [...this.m.keys()]; }
  clear() { for (const k of this.keys()) this.delete(k); }
}

function safeStorage(): Storage | undefined {
  try { return typeof localStorage !== 'undefined' ? localStorage : undefined; } catch { return undefined; }
}

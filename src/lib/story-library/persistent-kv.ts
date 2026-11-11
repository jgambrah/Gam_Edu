import type { KeyValueStore } from './catalogue-client';

export interface PersistentKeyValueStore extends KeyValueStore {
  persistent: boolean;
  clear(): void;
  flush?(): Promise<void>;
}

/**
 * Synchronous localStorage-backed KeyValueStore (used as fallback when IndexedDB is unavailable, e.g. JSDOM tests).
 * Degrades cleanly to memory-only if storage is unavailable or quota-exceeded.
 */
export class PersistentKV implements PersistentKeyValueStore {
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

const IDB_NAME = 'gam-edu-story-library-kv-v1';
const IDB_STORE = 'kv';

/**
 * IndexedDB-backed KeyValueStore for scaling to thousands of stories without hitting localStorage's 5 MB ceiling.
 * Hydrates its namespace into memory once on `open()` so `CatalogueClient` keeps fast synchronous reads, while
 * writing mutations through to IndexedDB asynchronously in order.
 */
export class IndexedDBKV implements PersistentKeyValueStore {
  private m = new Map<string, unknown>();
  private pending: Promise<void> = Promise.resolve();
  persistent = true;

  private constructor(
    private ns: string,
    private db: IDBDatabase | null,
    initialEntries: Iterable<[string, unknown]>,
  ) {
    for (const [k, v] of initialEntries) this.m.set(k, v);
    if (!db) this.persistent = false;
  }

  static async open(ns: string, idbFactory: IDBFactory | undefined = safeIndexedDB()): Promise<IndexedDBKV> {
    if (!idbFactory) {
      return new IndexedDBKV(ns, null, []);
    }
    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = idbFactory.open(IDB_NAME, 1);
        req.onupgradeneeded = () => {
          const d = req.result;
          if (!d.objectStoreNames.contains(IDB_STORE)) {
            d.createObjectStore(IDB_STORE);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
      });

      const prefix = `${ns}:`;
      const initial = await new Promise<Array<[string, unknown]>>((resolve) => {
        const out: Array<[string, unknown]> = [];
        try {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const store = tx.objectStore(IDB_STORE);
          const range = typeof IDBKeyRange !== 'undefined' ? IDBKeyRange.bound(prefix, `${ns};\uffff`) : undefined;
          const cursorReq = range ? store.openCursor(range) : store.openCursor();
          cursorReq.onsuccess = () => {
            const cursor = cursorReq.result;
            if (!cursor) { resolve(out); return; }
            const key = String(cursor.key);
            if (key.startsWith(prefix)) {
              out.push([key.slice(prefix.length), cursor.value]);
            }
            cursor.continue();
          };
          cursorReq.onerror = () => resolve(out);
        } catch {
          resolve(out);
        }
      });

      return new IndexedDBKV(ns, db, initial);
    } catch {
      return new IndexedDBKV(ns, null, []);
    }
  }

  private enqueue(op: (store: IDBObjectStore) => void) {
    if (!this.db || !this.persistent) return;
    const db = this.db;
    this.pending = this.pending.then(() => new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        op(tx.objectStore(IDB_STORE));
        tx.oncomplete = () => resolve();
        tx.onerror = () => { this.persistent = false; resolve(); };
        tx.onabort = () => { this.persistent = false; resolve(); };
      } catch {
        this.persistent = false;
        resolve();
      }
    }));
  }

  get<T>(k: string): T | undefined {
    return this.m.get(k) as T | undefined;
  }

  set(k: string, v: unknown): void {
    this.m.set(k, v);
    const fullKey = `${this.ns}:${k}`;
    this.enqueue((store) => { store.put(v, fullKey); });
  }

  delete(k: string): void {
    this.m.delete(k);
    const fullKey = `${this.ns}:${k}`;
    this.enqueue((store) => { store.delete(fullKey); });
  }

  keys(): string[] {
    return [...this.m.keys()];
  }

  clear(): void {
    const keys = this.keys();
    this.m.clear();
    if (!keys.length) return;
    this.enqueue((store) => {
      for (const k of keys) store.delete(`${this.ns}:${k}`);
    });
  }

  flush(): Promise<void> {
    return this.pending;
  }
}

/**
 * Preferred factory for browser catalogue caching: uses IndexedDB when available (hundreds of MBs quota for thousands
 * of stories) and falls back cleanly to PersistentKV (localStorage / memory) in non-IDB environments.
 */
export async function openPersistentKV(ns: string): Promise<PersistentKeyValueStore> {
  const idb = safeIndexedDB();
  if (idb) {
    const kv = await IndexedDBKV.open(ns, idb);
    if (kv.persistent) return kv;
  }
  return new PersistentKV(ns);
}

function safeStorage(): Storage | undefined {
  try { return typeof localStorage !== 'undefined' ? localStorage : undefined; } catch { return undefined; }
}

function safeIndexedDB(): IDBFactory | undefined {
  try { return typeof indexedDB !== 'undefined' && indexedDB ? indexedDB : undefined; } catch { return undefined; }
}

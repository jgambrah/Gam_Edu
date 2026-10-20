'use client';
/**
 * One-time Firestore reads with a short in-memory cache (read-cost saver).
 *
 * A live listener (useCollection) bills a read for every document when it opens, again for every document
 * when it is re-opened (forceRefetch), and the page re-renders whenever anybody else changes a document.
 * For screens that only need a snapshot (gradebook rosters, class lists, marks for one class + subject),
 * this hook reads ONCE and remembers the result for the browser session, so switching back and forth
 * between classes/subjects or re-opening the page costs no further reads. After a save the page updates the
 * cached copy itself (setData) instead of reading everything again.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; data: any[] }>();
const inflight = new Map<string, Promise<any[]>>();

export function readOnceCached<T = any>(key: string, load: () => Promise<T[]>, opts?: { ttlMs?: number; force?: boolean }): Promise<T[]> {
  const ttl = opts?.ttlMs ?? DEFAULT_TTL_MS;
  const hit = cache.get(key);
  if (!opts?.force && hit && Date.now() - hit.at < ttl) return Promise.resolve(hit.data as T[]);
  const pending = inflight.get(key);
  if (!opts?.force && pending) return pending as Promise<T[]>;
  const p = load()
    .then((data) => {
      cache.set(key, { at: Date.now(), data });
      return data;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

export function useOnceQuery<T = any>(key: string | null, load: () => Promise<T[]>, opts?: { ttlMs?: number }) {
  const [data, setDataState] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!key);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);
  const forceRef = useRef(false);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!key) {
      setDataState(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    let alive = true;
    const force = forceRef.current;
    forceRef.current = false;
    const hit = cache.get(key);
    if (!force && hit && Date.now() - hit.at < (opts?.ttlMs ?? DEFAULT_TTL_MS)) {
      setDataState(hit.data as T[]);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setDataState(null);
    setError(null);
    readOnceCached<T>(key, () => loadRef.current(), { ttlMs: opts?.ttlMs, force })
      .then((d) => { if (alive) { setDataState(d); setIsLoading(false); } })
      .catch((e) => {
        console.error('useOnceQuery failed for', key, e);
        if (alive) { setError(e instanceof Error ? e : new Error(String(e))); setDataState(null); setIsLoading(false); }
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce]);

  /** Read again from Firestore (bills reads) — only for an explicit "Refresh" button. */
  const refresh = useCallback(() => { forceRef.current = true; setNonce((n) => n + 1); }, []);

  /** Replace the cached copy locally (no reads) — e.g. after the page saved its own changes. */
  const setData = useCallback((updater: T[] | ((prev: T[]) => T[])) => {
    setDataState((prev) => {
      const next = typeof updater === 'function' ? (updater as (p: T[]) => T[])(prev || []) : updater;
      if (key) cache.set(key, { at: Date.now(), data: next });
      return next;
    });
  }, [key]);

  return { data, isLoading, error, refresh, setData };
}

/** Forget cached reads whose key starts with `prefix` (e.g. after marks change, so report cards recompile fresh). */
export function invalidateOnceCache(prefix: string) {
  Array.from(cache.keys()).forEach((k) => { if (k.startsWith(prefix)) cache.delete(k); });
}

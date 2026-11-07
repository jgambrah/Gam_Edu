/**
 * In-memory SeedBackend for tests and for the `--target memory` dry run.
 * Transactions are OPTIMISTIC, like Firestore's: every read records the version it saw; at commit, if any of those paths
 * changed, the transaction is retried. Every operation yields to the event loop, so concurrent runners really interleave.
 */
import { TransientError, ProcessCrash, type Doc, type PutResult, type SeedBackend, type Tx } from './types';

export interface MemoryStats {
  docReads: number; docWrites: number; docDeletes: number; txCommits: number; txConflicts: number;
  objectPuts: number; objectClashes: number; listCalls: number;
}

export class MemoryBackend implements SeedBackend {
  docs = new Map<string, { data: Doc; ver: number }>();
  objects = new Map<string, { size: number; sha: string; contentType: string }>();
  stats: MemoryStats = { docReads: 0, docWrites: 0, docDeletes: 0, txCommits: 0, txConflicts: 0, objectPuts: 0, objectClashes: 0, listCalls: 0 };
  /** Every committed write, in order, so tests can prove what was (not) touched. */
  writeLog: Array<{ kind: 'doc' | 'delete' | 'object'; path: string }> = [];
  private t = 1_700_000_000_000;

  constructor(private opts: { yieldToLoop?: boolean } = { yieldToLoop: true }) {}

  now() { return this.t; }
  advance(ms: number) { this.t += ms; }
  private async tick() { if (this.opts.yieldToLoop !== false) await new Promise<void>((r) => setImmediate(r)); }

  async putObjectIfAbsent(path: string, bytes: Uint8Array, contentType: string, sha256: string): Promise<PutResult> {
    await this.tick();
    const existing = this.objects.get(path);
    if (existing) { this.stats.objectClashes++; return existing.sha === sha256 ? 'exists_same' : 'exists_different'; }
    this.objects.set(path, { size: bytes.length, sha: sha256, contentType });
    this.stats.objectPuts++;
    this.writeLog.push({ kind: 'object', path });
    return 'created';
  }

  async transact<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < 25; attempt++) {
      const seen = new Map<string, number>();
      const buffer = new Map<string, Doc | null>(); // null = delete
      const tx: Tx = {
        get: async (path) => {
          await this.tick();
          // Firestore transactions refuse reads after writes; enforce it here so the unit tests prove the seeder complies.
          if (buffer.size > 0) throw new Error('Firestore transactions require all reads before any write');
          this.stats.docReads++;
          const d = this.docs.get(path);
          seen.set(path, d?.ver ?? 0);
          return d ? structuredClone(d.data) : undefined;
        },
        set: (path, data) => { buffer.set(path, structuredClone(data)); },
        delete: (path) => { buffer.set(path, null); },
      };
      const result = await fn(tx);
      await this.tick();
      // ---- commit: atomic because nothing below awaits ----
      let conflict = false;
      for (const [p, v] of seen) if ((this.docs.get(p)?.ver ?? 0) !== v) { conflict = true; break; }
      if (conflict) { this.stats.txConflicts++; continue; }
      for (const [p, data] of buffer) {
        if (data === null) {
          if (this.docs.delete(p)) { this.stats.docDeletes++; this.writeLog.push({ kind: 'delete', path: p }); }
        } else {
          const ver = (this.docs.get(p)?.ver ?? 0) + 1;
          this.docs.set(p, { data, ver });
          this.stats.docWrites++;
          this.writeLog.push({ kind: 'doc', path: p });
        }
      }
      this.stats.txCommits++;
      return result;
    }
    throw new TransientError('too much contention');
  }

  async listDocs(collectionPath: string) {
    await this.tick();
    this.stats.listCalls++;
    const prefix = `${collectionPath}/`;
    const out: Array<{ id: string; data: Doc }> = [];
    for (const [p, d] of this.docs) {
      if (!p.startsWith(prefix)) continue;
      const rest = p.slice(prefix.length);
      if (!rest.includes('/')) out.push({ id: rest, data: structuredClone(d.data) });
    }
    return out;
  }

  /** A comparable snapshot of everything stored, minus per-run bookkeeping. */
  snapshot(opts: { ignoreRunFields?: boolean } = {}) {
    const strip = (p: string, d: Doc) => {
      if (!opts.ignoreRunFields) return d;
      const { owner, claimExpiresAt, attempts, updatedAt, finishedAt, createdAt, startedAt, lastJobId, error, at, reseededAt, rolledBackAt, ...rest } = d;
      if (/^library_seed_jobs\/job-[^/]+$/.test(p)) delete (rest as Doc).createdBy; // the job doc records which runner created it
      return rest;
    };
    const docs = [...this.docs.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([p, d]) => [p, strip(p, d.data)] as const);
    const objects = [...this.objects.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([p, o]) => [p, o.size, o.sha] as const);
    return { docs, objects };
  }
}

export type Fault = 'transient' | 'crash_before' | 'crash_after';
export type FaultPlan = (op: 'put' | 'transact' | 'list', n: number, path?: string) => Fault | undefined;

/**
 * Wraps a backend and injects failures. After any crash the "process is dead": every later call throws ProcessCrash,
 * so a crashed run cannot quietly carry on.
 */
export class FaultyBackend implements SeedBackend {
  counts = { put: 0, transact: 0, list: 0 };
  dead = false;
  constructor(private inner: SeedBackend, private plan: FaultPlan) {}
  now() { return this.inner.now(); }

  private async guard<T>(op: 'put' | 'transact' | 'list', path: string | undefined, run: () => Promise<T>): Promise<T> {
    if (this.dead) throw new ProcessCrash('process is dead');
    const n = ++this.counts[op];
    const f = this.plan(op, n, path);
    if (f === 'transient') throw new TransientError(`injected transient error on ${op} #${n}`);
    if (f === 'crash_before') { this.dead = true; throw new ProcessCrash(`injected crash before ${op} #${n}`); }
    const r = await run();
    if (f === 'crash_after') { this.dead = true; throw new ProcessCrash(`injected crash after ${op} #${n}`); }
    return r;
  }
  putObjectIfAbsent(path: string, bytes: Uint8Array, contentType: string, sha: string) {
    return this.guard('put', path, () => this.inner.putObjectIfAbsent(path, bytes, contentType, sha));
  }
  transact<T>(fn: (tx: Tx) => Promise<T>) { return this.guard('transact', undefined, () => this.inner.transact(fn)); }
  listDocs(c: string) { return this.guard('list', c, () => this.inner.listDocs(c)); }
}

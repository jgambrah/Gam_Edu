// @vitest-environment node
/**
 * Ask Teacher shared cap: concurrency, atomicity, cost and failure behaviour (audit checkpoint 3, task 10).
 * The stand-in database implements Firestore's transaction contract (optimistic concurrency: a transaction whose read
 * documents changed before commit is retried), and counts reads and writes so the per-request cost is measured.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/firebaseAdmin', () => ({ getAdminAuth: () => ({}), getAdminDb: () => ({}) }));

import { reserveSharedAiCall, releaseSharedAiCall } from './ask-teacher-guard';

function concurrentFakeDb() {
  const store = new Map<string, { v: number; data: any }>();
  const stats = { reads: 0, writes: 0, commits: 0, retries: 0 };
  const db: any = {
    store,
    stats,
    collection: () => ({ doc: (id: string) => ({ id }) }),
    runTransaction: async (fn: (tx: any) => Promise<any>) => {
      for (let attempt = 0; attempt < 50; attempt++) {
        const readVersions = new Map<string, number>();
        const writes: Array<[string, any]> = [];
        const tx = {
          get: async (r: any) => {
            stats.reads++;
            const e = store.get(r.id);
            readVersions.set(r.id, e?.v ?? 0);
            await new Promise((res) => setTimeout(res, Math.random() * 3)); // interleave concurrent transactions
            return { exists: !!e, data: () => e?.data };
          },
          set: (r: any, v: any, o?: any) => writes.push([r.id, o?.merge ? { ...(store.get(r.id)?.data ?? {}), ...v } : v]),
        };
        const result = await fn(tx);
        // commit: abort and retry if anything we read changed meanwhile (Firestore optimistic concurrency)
        const conflict = [...readVersions].some(([id, v]) => (store.get(id)?.v ?? 0) !== v);
        if (conflict) { stats.retries++; continue; }
        writes.forEach(([id, data]) => { store.set(id, { v: (store.get(id)?.v ?? 0) + 1, data }); stats.writes++; });
        stats.commits++;
        return result;
      }
      throw new Error('too much contention');
    },
  };
  return db;
}

afterEach(() => { delete process.env.ASK_TEACHER_USER_DAILY_CAP; delete process.env.ASK_TEACHER_SCHOOL_DAILY_CAP; });
const day = new Date('2026-11-30T09:00:00Z');
const teacher = (uid: string, schoolId = 's1') => ({ uid, role: 'Teacher', schoolId });

describe('shared cap under concurrency', () => {
  it('100 simultaneous requests by one user with a cap of 10: EXACTLY 10 succeed (atomic enforcement)', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '10';
    const db = concurrentFakeDb();
    const results = await Promise.all(Array.from({ length: 100 }, () => reserveSharedAiCall(teacher('u1'), day, db)));
    expect(results.filter((r) => r.ok)).toHaveLength(10);
    expect(results.filter((r) => !r.ok && (r as any).reason === 'user-cap')).toHaveLength(90);
    expect(db.store.get('u_u1_2026-11-30')!.data.count).toBe(10); // no lost updates, no overshoot
    expect(db.stats.retries).toBeGreaterThan(0); // contention really happened and was resolved by retries
  });

  it('school cap holds across many users at once, and another school is unaffected', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '5';
    process.env.ASK_TEACHER_SCHOOL_DAILY_CAP = '12';
    const db = concurrentFakeDb();
    const all = await Promise.all(Array.from({ length: 60 }, (_, i) => reserveSharedAiCall(teacher(`u${i % 20}`, 's1'), day, db)));
    expect(all.filter((r) => r.ok)).toHaveLength(12);
    expect(db.store.get('s_s1_2026-11-30')!.data.count).toBe(12);
    const other = await reserveSharedAiCall(teacher('x1', 's2'), day, db);
    expect(other.ok).toBe(true); // cross-school isolation
  });

  it('day boundary: 23:59:59 and 00:00:00 UTC count against different days', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '1';
    const db = concurrentFakeDb();
    const c = teacher('u1');
    expect((await reserveSharedAiCall(c, new Date('2026-11-30T23:59:59Z'), db)).ok).toBe(true);
    expect((await reserveSharedAiCall(c, new Date('2026-11-30T23:59:59Z'), db)).ok).toBe(false);
    expect((await reserveSharedAiCall(c, new Date('2026-12-01T00:00:00Z'), db)).ok).toBe(true);
  });

  it('duplicate identical requests each consume one allowance (there is no idempotency key; documented limitation)', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '3';
    const db = concurrentFakeDb();
    const r = await Promise.all([1, 2, 3, 4].map(() => reserveSharedAiCall(teacher('u1'), day, db)));
    expect(r.filter((x) => x.ok)).toHaveLength(3);
  });
});

describe('cost per request (Firestore operations)', () => {
  it('an allowed AI call costs 2 reads + 2 writes; a refused call costs 2 reads and 0 writes', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '1';
    const db = concurrentFakeDb();
    await reserveSharedAiCall(teacher('u1'), day, db);
    expect({ reads: db.stats.reads, writes: db.stats.writes }).toEqual({ reads: 2, writes: 2 });
    db.stats.reads = 0; db.stats.writes = 0;
    const refused = await reserveSharedAiCall(teacher('u1'), day, db);
    expect(refused.ok).toBe(false);
    expect({ reads: db.stats.reads, writes: db.stats.writes }).toEqual({ reads: 2, writes: 0 });
  });

  it('a caller with no school uses a single document (1 read, 1 write)', async () => {
    const db = concurrentFakeDb();
    await reserveSharedAiCall({ uid: 'dir1', role: 'Director', schoolId: null }, day, db);
    expect({ reads: db.stats.reads, writes: db.stats.writes }).toEqual({ reads: 1, writes: 1 });
  });
});

describe('release when no paid answer was produced', () => {
  it('gives the slot back (never below zero) so a provider outage does not burn the allowance', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '2';
    const db = concurrentFakeDb();
    const c = teacher('u1');
    await reserveSharedAiCall(c, day, db);
    await releaseSharedAiCall(c, day, db);
    expect(db.store.get('u_u1_2026-11-30')!.data.count).toBe(0);
    await releaseSharedAiCall(c, day, db); // extra release must not go negative
    expect(db.store.get('u_u1_2026-11-30')!.data.count).toBe(0);
    expect((await reserveSharedAiCall(c, day, db)).ok).toBe(true);
    expect((await reserveSharedAiCall(c, day, db)).ok).toBe(true);
    expect((await reserveSharedAiCall(c, day, db)).ok).toBe(false);
  });

  it('a failing release never throws', async () => {
    const broken: any = { collection: () => ({ doc: () => ({}) }), runTransaction: async () => { throw new Error('down'); } };
    await expect(releaseSharedAiCall(teacher('u1'), day, broken)).resolves.toBeUndefined();
  });
});

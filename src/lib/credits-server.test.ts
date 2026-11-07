import { describe, it, expect, vi, beforeEach } from 'vitest';

// Minimal in-memory Firestore with transactions, enough for the ledger logic.
const store = vi.hoisted(() => ({ docs: new Map<string, any>() }));
vi.mock('@/lib/firebaseAdmin', () => {
  const ref = (path: string): any => ({
    path,
    collection: (c: string) => ({
      doc: (id: string) => ref(`${path}/${c}/${id}`),
      where: (f1: string, _o1: string, v1: any) => ({ where: (f2: string, _o2: string, v2: any) => ({ get: async () => ({
        docs: [...store.docs.entries()].filter(([k, d]) => k.startsWith(`${path}/${c}/`) && d[f1] === v1 && d[f2] < v2).map(([k]) => ({ id: k.split('/').pop() })),
      }) }) }),
    }),
  });
  return {
    getAdminDb: () => ({
      collection: (c: string) => ({ doc: (id: string) => ref(`${c}/${id}`) }),
      runTransaction: async (fn: any) => {
        const writes: Array<() => void> = [];
        const t = {
          get: async (r: any) => ({ exists: store.docs.has(r.path), data: () => store.docs.get(r.path) }),
          update: (r: any, d: any) => writes.push(() => store.docs.set(r.path, { ...store.docs.get(r.path), ...d })),
          set: (r: any, d: any) => writes.push(() => store.docs.set(r.path, d)),
        };
        const out = await fn(t);
        writes.forEach(w => w());
        return out;
      },
    }),
  };
});

import { chargeCreditsOnce, refundChargeOnce, markChargeCompleted, refundStaleCharges, ledgerKey } from './credits-server';

const bal = () => store.docs.get('schools/s1').aiCredits;
beforeEach(() => { store.docs.clear(); store.docs.set('schools/s1', { aiCredits: 20 }); });

describe('chargeCreditsOnce', () => {
  it('charges once; the same key again is not charged twice', async () => {
    expect(await chargeCreditsOnce('s1', 5, 'u_r1_cover')).toEqual({ success: true });
    expect(bal()).toBe(15);
    expect(await chargeCreditsOnce('s1', 5, 'u_r1_cover')).toEqual({ success: true, alreadyCharged: true });
    expect(bal()).toBe(15);
  });
  it('different keys charge separately', async () => {
    await chargeCreditsOnce('s1', 5, 'a'); await chargeCreditsOnce('s1', 3, 'b');
    expect(bal()).toBe(12);
  });
  it('refuses when credits are short, leaving balance and ledger untouched', async () => {
    const r = await chargeCreditsOnce('s1', 50, 'big');
    expect(r.success).toBe(false);
    expect(bal()).toBe(20);
    expect(store.docs.has('schools/s1/credit_ledger/big')).toBe(false);
  });
  it('rejects bad amounts, missing school, bad keys', async () => {
    for (const c of [0, -1, NaN, 501]) expect((await chargeCreditsOnce('s1', c, 'k')).success).toBe(false);
    expect((await chargeCreditsOnce('', 1, 'k')).success).toBe(false);
    expect((await chargeCreditsOnce('s1', 1, 'a/b')).success).toBe(false);
    expect(bal()).toBe(20);
  });
  it('keeps the legacy aiCreditBalance field in step', async () => {
    store.docs.set('schools/s1', { aiCredits: 10, aiCreditBalance: 10 });
    await chargeCreditsOnce('s1', 4, 'k');
    expect(store.docs.get('schools/s1')).toMatchObject({ aiCredits: 6, aiCreditBalance: 6 });
  });
});

describe('refundChargeOnce', () => {
  it('returns the credits exactly once', async () => {
    await chargeCreditsOnce('s1', 5, 'k');
    expect(await refundChargeOnce('s1', 'k')).toBe(true);
    expect(bal()).toBe(20);
    expect(await refundChargeOnce('s1', 'k')).toBe(false);
    expect(bal()).toBe(20);
  });
  it('refunds nothing for a key that was never charged', async () => {
    expect(await refundChargeOnce('s1', 'nope')).toBe(false);
    expect(bal()).toBe(20);
  });
  it('a refunded key cannot be charged again (a redo needs a new key)', async () => {
    await chargeCreditsOnce('s1', 5, 'k'); await refundChargeOnce('s1', 'k');
    expect((await chargeCreditsOnce('s1', 5, 'k')).success).toBe(false);
    expect(bal()).toBe(20);
  });
  it('concurrent-style double refund still returns credits once', async () => {
    await chargeCreditsOnce('s1', 5, 'k');
    const [a, b] = [await refundChargeOnce('s1', 'k'), await refundChargeOnce('s1', 'k')];
    expect([a, b].filter(Boolean)).toHaveLength(1);
    expect(bal()).toBe(20);
  });
});

describe('ledgerKey', () => {
  it('builds safe ids and rejects unsafe ones', () => {
    expect(ledgerKey(['u1', 'req-1', 'cover'])).toBe('u1_req-1_cover');
    expect(ledgerKey(['u1', 'a/b'])).toBeNull();
    expect(ledgerKey(['x'.repeat(300)])).toBeNull();
  });
});

describe('interrupted and lost-result cases', () => {
  const entry = (k: string) => store.docs.get(`schools/s1/credit_ledger/${k}`);

  it('a completed charge is final: the automatic refund refuses it', async () => {
    await chargeCreditsOnce('s1', 5, 'k'); await markChargeCompleted('s1', 'k');
    expect(entry('k').status).toBe('completed');
    expect(await refundChargeOnce('s1', 'k')).toBe(false);
    expect(bal()).toBe(15);
  });
  it('a replay of a completed key is reported as already charged (so the flow will not run the AI again)', async () => {
    await chargeCreditsOnce('s1', 5, 'k'); await markChargeCompleted('s1', 'k');
    expect(await chargeCreditsOnce('s1', 5, 'k')).toEqual({ success: true, alreadyCharged: true });
    expect(bal()).toBe(15);
  });
  it('a deliberate, audited manual refund can return a completed charge — once', async () => {
    await chargeCreditsOnce('s1', 5, 'k'); await markChargeCompleted('s1', 'k');
    expect(await refundChargeOnce('s1', 'k', { includeCompleted: true })).toBe(true);
    expect(await refundChargeOnce('s1', 'k', { includeCompleted: true })).toBe(false);
    expect(bal()).toBe(20);
  });
  it('marking an already-refunded entry completed does not resurrect it', async () => {
    await chargeCreditsOnce('s1', 5, 'k'); await refundChargeOnce('s1', 'k'); await markChargeCompleted('s1', 'k');
    expect(entry('k').status).toBe('refunded');
  });
  it('the stale sweep refunds jobs that never finished (server crash), not finished or recent ones, and is repeatable', async () => {
    await chargeCreditsOnce('s1', 5, 'crashed');
    await chargeCreditsOnce('s1', 3, 'done'); await markChargeCompleted('s1', 'done');
    await chargeCreditsOnce('s1', 2, 'recent');
    entry('crashed').chargedAt = new Date(Date.now() - 60 * 60 * 1000);
    entry('done').chargedAt = new Date(Date.now() - 60 * 60 * 1000);
    expect(bal()).toBe(10);
    expect(await refundStaleCharges('s1')).toBe(1);
    expect(bal()).toBe(15);
    expect(await refundStaleCharges('s1')).toBe(0);
    expect(bal()).toBe(15);
  });
});

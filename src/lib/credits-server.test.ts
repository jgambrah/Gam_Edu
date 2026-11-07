import { describe, it, expect, vi, beforeEach } from 'vitest';

// Minimal in-memory Firestore with transactions, enough for the ledger logic.
const store = vi.hoisted(() => ({ docs: new Map<string, any>() }));
vi.mock('@/lib/firebaseAdmin', () => {
  const ref = (path: string): any => ({
    path,
    collection: (c: string) => ({ doc: (id: string) => ref(`${path}/${c}/${id}`) }),
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

import { chargeCreditsOnce, refundChargeOnce, ledgerKey } from './credits-server';

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

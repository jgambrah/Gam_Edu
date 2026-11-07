import { describe, expect, it } from 'vitest';
import { newLedger, remainingUsd, reserve, settle, spentOrReservedUsd } from './spend-ledger';

describe('spend ledger', () => {
  it('refuses a call that would pass the ceiling and records nothing for it', () => {
    const l = newLedger(10);
    expect(reserve(l, 'a', 'img', 9.5, 't').ok).toBe(true);
    const r = reserve(l, 'b', 'img', 0.6, 't');
    expect(r.ok).toBe(false);
    expect(l.entries).toHaveLength(1);
    expect(remainingUsd(l)).toBeCloseTo(0.5, 9);
  });
  it('allows spending exactly up to the ceiling', () => { const l = newLedger(1); expect(reserve(l, 'a', 'x', 1, 't').ok).toBe(true); expect(reserve(l, 'b', 'x', 0.001, 't').ok).toBe(false); });
  it('settling replaces the estimate with the measured cost, freeing headroom', () => {
    const l = newLedger(1); reserve(l, 'a', 'x', 0.9, 't'); settle(l, 'a', 0.1);
    expect(spentOrReservedUsd(l)).toBeCloseTo(0.1, 9); expect(reserve(l, 'b', 'x', 0.8, 't').ok).toBe(true);
  });
  it('rejects duplicate ids, negatives and NaN', () => {
    const l = newLedger(10); reserve(l, 'a', 'x', 1, 't');
    expect(reserve(l, 'a', 'x', 1, 't').ok).toBe(false); expect(reserve(l, 'n', 'x', -1, 't').ok).toBe(false); expect(reserve(l, 'm', 'x', NaN, 't').ok).toBe(false);
  });
});

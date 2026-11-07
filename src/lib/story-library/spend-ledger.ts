/**
 * Hard spending guard for one-off premium generation. Every paid call must be `reserve`d BEFORE it is made, using a
 * conservative (upper-bound) cost; a reservation that would push the total over the ceiling is refused. `settle` replaces the
 * estimate with the measured cost when the provider reports usage. Pure and serialisable so the ledger can be kept on disk.
 */
export interface LedgerEntry { id: string; what: string; reservedUsd: number; actualUsd?: number; at: string }
export interface Ledger { ceilingUsd: number; entries: LedgerEntry[] }

export const newLedger = (ceilingUsd: number): Ledger => ({ ceilingUsd, entries: [] });
export const spentOrReservedUsd = (l: Ledger) => l.entries.reduce((n, e) => n + (e.actualUsd ?? e.reservedUsd), 0);
export const remainingUsd = (l: Ledger) => l.ceilingUsd - spentOrReservedUsd(l);

export function reserve(l: Ledger, id: string, what: string, upperBoundUsd: number, at: string): { ok: true } | { ok: false; reason: string } {
  if (!(upperBoundUsd >= 0) || !Number.isFinite(upperBoundUsd)) return { ok: false, reason: 'invalid cost estimate' };
  if (l.entries.some((e) => e.id === id)) return { ok: false, reason: `duplicate call id ${id}` };
  if (spentOrReservedUsd(l) + upperBoundUsd > l.ceilingUsd + 1e-9) return { ok: false, reason: `would exceed the $${l.ceilingUsd.toFixed(2)} ceiling ($${remainingUsd(l).toFixed(2)} left, call needs up to $${upperBoundUsd.toFixed(3)})` };
  l.entries.push({ id, what, reservedUsd: upperBoundUsd, at });
  return { ok: true };
}

export function settle(l: Ledger, id: string, actualUsd: number): void {
  const e = l.entries.find((x) => x.id === id);
  if (!e) throw new Error(`unknown call ${id}`);
  e.actualUsd = actualUsd;
}

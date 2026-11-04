/**
 * One payment can be spread over several bills (e.g. GH₵800 paid = GH₵500 current fees + GH₵300 owed from last
 * term). Each bill keeps its own payment record, all carrying the same receipt number. These helpers find all the
 * parts of a receipt so every receipt can show the whole payment, not only its own bill's share.
 */
import { collection, getDocs, query, where, type Firestore } from 'firebase/firestore';

export interface ReceiptPart {
  recordId: string;
  paymentDocId: string;
  description: string;
  feeType: string;
  amount: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** The number printed on the receipt, shared by every part of one payment. */
export const receiptKeyOf = (p: any): string => String(p?.receiptNo || p?.id || '').trim();

/**
 * True when this payment record is known to be one part of a bigger payment, so looking for the other parts is
 * worthwhile. Plain single-bill payments (the large majority) never trigger any extra reads.
 */
export function mayHaveOtherParts(p: any): boolean {
  if (!p) return false;
  const id = String(p.id || '');
  if (id.startsWith('consolidated-') || id.startsWith('legacy-')) return false;
  const amount = Number(p.amount) || 0;
  return p.isAllocation === true
    || (Number(p.allocatedOut) || 0) > 0.009
    || (Number(p.receiptTotal) || 0) > amount + 0.009;
}

/** Drops reversed/zero parts and duplicates (the same record can match both lookups), keeps the order given. */
export function mergeReceiptParts(parts: ReceiptPart[]): ReceiptPart[] {
  const seen = new Set<string>();
  const out: ReceiptPart[] = [];
  for (const p of parts) {
    const k = `${p.recordId}|${p.paymentDocId}`;
    if (seen.has(k) || !(p.amount > 0.009)) continue;
    seen.add(k);
    out.push({ ...p, amount: round2(p.amount) });
  }
  return out;
}

export const partsTotal = (parts: ReceiptPart[]): number => round2(parts.reduce((s, p) => s + p.amount, 0));

/**
 * Finds every part of the receipt `key` among the student's bills. Reads happen only for bills that have money on
 * them, and only when a receipt is opened.
 */
export async function fetchReceiptParts(firestore: Firestore, records: any[], key: string, cap = 30): Promise<ReceiptPart[]> {
  if (!key) return [];
  const withMoney = (records || []).filter(r => r && r.status !== 'Pending Reversal' && (Number(r.amountPaid) || 0) > 0.009).slice(0, cap);
  const found: ReceiptPart[] = [];
  await Promise.all(withMoney.map(async (rec) => {
    const col = collection(firestore, 'financialRecords', rec.id, 'payments');
    const snaps = await Promise.all([
      getDocs(query(col, where('receiptNo', '==', key))),
      getDocs(query(col, where('id', '==', key))),
    ]);
    for (const snap of snaps) {
      for (const d of snap.docs) {
        const p: any = d.data();
        if (p.isReversal === true || p.status === 'Reversed') continue;
        found.push({
          recordId: rec.id,
          paymentDocId: d.id,
          description: String(p.description || rec.description || rec.type || 'Payment'),
          feeType: String(rec.type || ''),
          amount: Number(p.amount) || 0,
        });
      }
    }
  }));
  // Keep the bills in the order they were passed in (stable output).
  const order = new Map(withMoney.map((r, i) => [r.id, i] as const));
  found.sort((a, b) => (order.get(a.recordId) ?? 0) - (order.get(b.recordId) ?? 0));
  return mergeReceiptParts(found);
}

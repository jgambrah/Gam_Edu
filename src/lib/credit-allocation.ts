import {
  Firestore,
  collection,
  doc,
  getDocs,
  increment,
  query,
  runTransaction,
  where,
  arrayUnion,
  updateDoc,
} from 'firebase/firestore';
import type { FinancialRecord } from '@/lib/types';
import { termStampOfRecord } from '@/lib/term';

/**
 * Credit allocation helpers.
 *
 * When a payment exceeds the balance of the bill it was recorded against, the surplus must be
 * applied to the student's other unpaid bills. Otherwise individual bills show "Unpaid" even though
 * the parent has already paid for them (overstating debtor lists / debt letters).
 *
 * Allocation priority:
 *   1. Unpaid bills of the SAME fee type (e.g. other Canteen days), oldest due date first.
 *   2. All other unpaid bills, oldest due date first.
 * Any amount left after every bill is settled stays on the original bill as a credit.
 */

const EPS = 0.009;
const round2 = (n: number) => Math.round(n * 100) / 100;

const toMillis = (v: any): number => {
  if (!v) return 0;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (typeof v.seconds === 'number') return v.seconds * 1000;
  const d = new Date(v);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

export const recordBalance = (r: Partial<FinancialRecord> | any): number =>
  round2((Number(r?.billedAmount) || 0) - (Number(r?.amountPaid) || 0) - (Number(r?.waiverAmount) || 0));

const isAllocatable = (r: any) =>
  !!r && r.status !== 'Pending Reversal' && r.status !== 'Void' && !r.isArchived && r.type !== 'Correction / Reversal';

const feeFamily = (r: any) => String(r?.type || '').replace(/\s*\((Daily|Termly)\)\s*$/i, '').trim().toLowerCase();

/** Unpaid bills ordered by allocation priority relative to `source`. */
export function orderAllocationTargets(records: any[], source: any): any[] {
  const family = feeFamily(source);
  return records
    .filter(r => r.id !== source.id && isAllocatable(r) && recordBalance(r) > EPS)
    .sort((a, b) => {
      const fa = feeFamily(a) === family ? 0 : 1;
      const fb = feeFamily(b) === family ? 0 : 1;
      if (fa !== fb) return fa - fb;
      const da = toMillis(a.dueDate) || toMillis(a.createdAt);
      const db = toMillis(b.dueDate) || toMillis(b.createdAt);
      return da - db;
    });
}

/** Fetches all of a student's financial records (by every known ID key). */
export async function fetchStudentRecords(firestore: Firestore, schoolId: string, studentKeys: string[]): Promise<any[]> {
  const keys = Array.from(new Set(studentKeys.filter(Boolean)));
  const map = new Map<string, any>();
  for (const k of keys) {
    const snap = await getDocs(query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), where('studentId', '==', k)));
    snap.docs.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));
  }
  return Array.from(map.values());
}

/**
 * Splits `amount` across the source bill and the student's other unpaid bills.
 * Returns a list of { recordId, portion }. The source always comes first and absorbs any leftover credit.
 */
export function planAllocation(amount: number, sourceFresh: any, orderedTargetsFresh: any[]): { recordId: string; portion: number }[] {
  let remaining = round2(amount);
  const plan: { recordId: string; portion: number }[] = [];
  const sourcePortion = Math.min(remaining, Math.max(0, recordBalance(sourceFresh)));
  remaining = round2(remaining - sourcePortion);
  for (const t of orderedTargetsFresh) {
    if (remaining <= EPS) break;
    const bal = recordBalance(t);
    if (bal <= EPS) continue;
    const portion = round2(Math.min(bal, remaining));
    plan.push({ recordId: t.id, portion });
    remaining = round2(remaining - portion);
  }
  // Source keeps its share plus any unallocatable surplus (credit on account).
  plan.unshift({ recordId: sourceFresh.id, portion: round2(sourcePortion + remaining) });
  return plan.filter(p => p.portion > EPS || p.recordId === sourceFresh.id);
}

const statusFor = (billed: number, paid: number, waiver: number, prevStatus?: string) => {
  if (billed - paid - waiver <= 0.001) return 'Paid';
  return prevStatus === 'Overdue' ? 'Overdue' : 'Unpaid';
};

/**
 * One-off repair: for a student, moves surplus already sitting on over-paid bills onto their unpaid bills.
 * Payment documents are split (not duplicated) so cash totals, payment dates, receipts and per-bill
 * reversals all stay consistent. Returns the total amount reallocated.
 */
export async function reallocateExistingOverpayments(params: {
  firestore: Firestore;
  schoolId: string;
  studentKeys: string[];
  performedBy: string;
}): Promise<{ moved: number; sources: number; remainingCredit: number }> {
  const { firestore, schoolId, studentKeys, performedBy } = params;
  let moved = 0;
  let sources = 0;

  const initial = await fetchStudentRecords(firestore, schoolId, studentKeys);
  const overpaid = initial.filter(r => isAllocatable(r) && recordBalance(r) < -EPS);

  for (const src of overpaid) {
    const records = await fetchStudentRecords(firestore, schoolId, studentKeys);
    const targets = orderAllocationTargets(records, src);
    if (targets.length === 0) break; // nothing left to pay — remaining surplus is a genuine credit

    // Payment docs on the source bill, newest first (the latest payment is what created the surplus).
    const paySnap = await getDocs(collection(firestore, 'financialRecords', src.id, 'payments'));
    const srcPayments = paySnap.docs
      .map(d => ({ id: d.id, ...(d.data() as any) }))
      .filter(p => p.status !== 'Reversed' && !p.isReversal && (Number(p.amount) || 0) > 0)
      .sort((a, b) => toMillis(b.paidAt) - toMillis(a.paidAt));

    const movedHere = await runTransaction(firestore, async (tx) => {
      const srcRef = doc(firestore, 'financialRecords', src.id);
      const srcSnap = await tx.get(srcRef);
      if (!srcSnap.exists()) return 0;
      const srcData: any = { id: src.id, ...srcSnap.data() };

      const tgtRefs = targets.map(t => doc(firestore, 'financialRecords', t.id));
      const tgtSnaps = await Promise.all(tgtRefs.map(r => tx.get(r)));
      const tgtFresh = tgtSnaps.filter(s => s.exists()).map(s => ({ id: s.id, ...(s.data() as any) }));

      const payRefs = srcPayments.map(p => doc(firestore, 'financialRecords', src.id, 'payments', p.id));
      const paySnaps = await Promise.all(payRefs.map(r => tx.get(r)));
      const payFresh = paySnaps.filter(s => s.exists()).map(s => ({ id: s.id, ref: s.ref, ...(s.data() as any) }));

      let surplus = round2(-recordBalance(srcData));
      if (surplus <= EPS) return 0;

      const payRemaining = new Map<string, number>(payFresh.map(p => [p.id, Number(p.amount) || 0]));
      const now = new Date().toISOString();
      let total = 0;

      for (const t of tgtFresh) {
        if (surplus <= EPS) break;
        const need = recordBalance(t);
        if (need <= EPS) continue;
        const chunk = round2(Math.min(need, surplus));
        const tRef = doc(firestore, 'financialRecords', t.id);

        // Split the chunk out of the source's payment docs so the money keeps its original receipt/date.
        let toCover = chunk;
        for (const p of payFresh) {
          if (toCover <= EPS) break;
          const avail = payRemaining.get(p.id) || 0;
          if (avail <= EPS) continue;
          const part = round2(Math.min(avail, toCover));
          payRemaining.set(p.id, round2(avail - part));
          toCover = round2(toCover - part);
          tx.set(doc(firestore, 'financialRecords', t.id, 'payments', `${p.id}-ALLOC-${src.id.slice(0, 6)}`), {
            id: `${p.id}-ALLOC-${src.id.slice(0, 6)}`,
            amount: increment(part),
            method: p.method || 'Cash',
            notes: `Surplus from receipt ${p.id} applied to this bill`,
            paidAt: p.paidAt || null,
            processedById: p.processedById || '',
            processedByName: p.processedByName || performedBy,
            studentId: t.studentId || p.studentId || '',
            description: t.description || p.description || '',
            schoolId,
            tillId: p.tillId || '',
            receiptNo: p.id,
            allocatedFromRecordId: src.id,
            isAllocation: true,
            // Credit carried over from a closed term is not new cash: keep it out of collections.
            ...((p as any).isCarryForward ? { isCarryForward: true } : {}),
            ...(() => { const st = termStampOfRecord(t); return st ? { termId: st.termId, academicYear: st.academicYear } : {}; })(),
          }, { merge: true });
        }
        // Remaining `toCover` (legacy payments with no payment docs) is moved via amountPaid only.

        const tPaid = round2((Number(t.amountPaid) || 0) + chunk);
        tx.update(tRef, {
          amountPaid: tPaid,
          status: statusFor(Number(t.billedAmount) || 0, tPaid, Number(t.waiverAmount) || 0, t.status),
          creditAllocations: arrayUnion({ fromRecordId: src.id, amount: chunk, at: now, by: performedBy }),
        });
        t.amountPaid = tPaid;
        surplus = round2(surplus - chunk);
        total = round2(total + chunk);
      }

      if (total <= EPS) return 0;

      for (const p of payFresh) {
        const left = payRemaining.get(p.id) ?? (Number(p.amount) || 0);
        if (Math.abs(left - (Number(p.amount) || 0)) > EPS) {
          tx.update(p.ref, { amount: left, originalAmount: p.originalAmount ?? p.amount, allocatedOut: increment(round2((Number(p.amount) || 0) - left)) });
        }
      }

      const newSrcPaid = round2((Number(srcData.amountPaid) || 0) - total);
      tx.update(srcRef, {
        amountPaid: newSrcPaid,
        status: statusFor(Number(srcData.billedAmount) || 0, newSrcPaid, Number(srcData.waiverAmount) || 0, srcData.status),
        creditAllocations: arrayUnion({ toOthers: total, at: now, by: performedBy }),
      });
      return total;
    });

    if (movedHere > EPS) {
      moved = round2(moved + movedHere);
      sources += 1;
    }
  }

  // Whatever surplus is still left (no unpaid bills to absorb it) is held as credit for future bills.
  const after = await fetchStudentRecords(firestore, schoolId, studentKeys);
  const remainingCredit = round2(after.filter(isAllocatable).reduce((s, r) => { const b = recordBalance(r); return b < -EPS ? s - b : s; }, 0));

  return { moved, sources, remainingCredit };
}

/**
 * Marks/unmarks the student as holding account credit. Billing reads this marker from the student
 * document it already has in memory, so no extra reads happen for students without credit.
 */
export async function setStudentCreditMarker(firestore: Firestore, studentDocId: string | undefined, credit: number): Promise<void> {
  if (!studentDocId) return;
  try {
    await updateDoc(doc(firestore, 'students', studentDocId), {
      hasAccountCredit: credit > EPS,
      accountCreditBalance: credit > EPS ? round2(credit) : 0,
    });
  } catch (e) {
    console.warn('Could not update student credit marker:', e);
  }
}

/**
 * Called right after daily bills are created. If the student holds credit (e.g. paid for the whole
 * week on Monday), the credit is applied to the new bill(s) so they show as Paid.
 * NEVER throws — billing must not fail because of credit application.
 */
export async function applyHeldCreditAfterBilling(firestore: Firestore, schoolId: string, student: any): Promise<number> {
  try {
    if (!student?.hasAccountCredit) return 0;
    const keys = [student.uid, student.id, student.studentId, student.admissionNo, student.admissionNumber].filter(Boolean);
    const res = await reallocateExistingOverpayments({ firestore, schoolId, studentKeys: keys, performedBy: 'Auto-credit (billing)' });
    await setStudentCreditMarker(firestore, student.id || student.uid, res.remainingCredit);
    student.hasAccountCredit = res.remainingCredit > EPS;
    return res.moved;
  } catch (e) {
    console.warn('Auto credit application skipped:', e);
    return 0;
  }
}

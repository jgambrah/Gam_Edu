import { FieldValue } from 'firebase-admin/firestore';

/**
 * Server (admin SDK) version of the held-credit application used after biometric attendance billing.
 * Mirrors src/lib/credit-allocation.ts: surplus on over-paid bills is moved onto unpaid bills
 * (same fee type first, then oldest), splitting payment docs so cash totals and receipts are unchanged.
 * NEVER throws — billing must not fail because of credit application.
 */

const EPS = 0.009;
const round2 = (n: number) => Math.round(n * 100) / 100;

const toMillis = (v: any): number => {
  if (!v) return 0;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (typeof v.seconds === 'number') return v.seconds * 1000;
  if (typeof v._seconds === 'number') return v._seconds * 1000;
  const d = new Date(v);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

const balanceOf = (r: any) => round2((Number(r?.billedAmount) || 0) - (Number(r?.amountPaid) || 0) - (Number(r?.waiverAmount) || 0));
const isAllocatable = (r: any) => !!r && r.status !== 'Pending Reversal' && r.status !== 'Void' && !r.isArchived && r.type !== 'Correction / Reversal';
const feeFamily = (r: any) => String(r?.type || '').replace(/\s*\((Daily|Termly)\)\s*$/i, '').trim().toLowerCase();
const statusFor = (billed: number, paid: number, waiver: number, prev?: string) =>
  billed - paid - waiver <= 0.001 ? 'Paid' : (prev === 'Overdue' ? 'Overdue' : 'Unpaid');

async function fetchRecords(db: FirebaseFirestore.Firestore, schoolId: string, keys: string[]) {
  const map = new Map<string, any>();
  for (const k of Array.from(new Set(keys.filter(Boolean)))) {
    const snap = await db.collection('financialRecords').where('schoolId', '==', schoolId).where('studentId', '==', k).get();
    snap.docs.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));
  }
  return Array.from(map.values());
}

export async function applyHeldCreditAfterBillingServer(db: FirebaseFirestore.Firestore, schoolId: string, student: any): Promise<number> {
  try {
    if (!student?.hasAccountCredit) return 0;
    const keys = [student.uid, student.id, student.studentId, student.admissionNo, student.admissionNumber].filter(Boolean);
    let moved = 0;

    const initial = await fetchRecords(db, schoolId, keys);
    const sources = initial.filter(r => isAllocatable(r) && balanceOf(r) < -EPS);

    for (const src of sources) {
      const records = await fetchRecords(db, schoolId, keys);
      const family = feeFamily(src);
      const targets = records
        .filter(r => r.id !== src.id && isAllocatable(r) && balanceOf(r) > EPS)
        .sort((a, b) => {
          const fa = feeFamily(a) === family ? 0 : 1;
          const fb = feeFamily(b) === family ? 0 : 1;
          if (fa !== fb) return fa - fb;
          return (toMillis(a.dueDate) || toMillis(a.createdAt)) - (toMillis(b.dueDate) || toMillis(b.createdAt));
        });
      if (targets.length === 0) break;

      const paySnap = await db.collection('financialRecords').doc(src.id).collection('payments').get();
      const payIds = paySnap.docs
        .map(d => ({ id: d.id, ...(d.data() as any) }))
        .filter(p => p.status !== 'Reversed' && !p.isReversal && (Number(p.amount) || 0) > 0)
        .sort((a, b) => toMillis(b.paidAt) - toMillis(a.paidAt))
        .map(p => p.id);

      const movedHere = await db.runTransaction(async (tx) => {
        const srcRef = db.collection('financialRecords').doc(src.id);
        const tgtRefs = targets.map(t => db.collection('financialRecords').doc(t.id));
        const payRefs = payIds.map(id => srcRef.collection('payments').doc(id));
        const all = await tx.getAll(srcRef, ...tgtRefs, ...payRefs);
        const srcSnap = all[0];
        if (!srcSnap.exists) return 0;
        const srcData: any = srcSnap.data();
        const tgtFresh = all.slice(1, 1 + tgtRefs.length).filter(s => s.exists).map(s => ({ id: s.id, ...(s.data() as any) }));
        const payFresh = all.slice(1 + tgtRefs.length).filter(s => s.exists).map(s => ({ id: s.id, ref: s.ref, ...(s.data() as any) }));

        let surplus = round2(-balanceOf(srcData));
        if (surplus <= EPS) return 0;
        const payRemaining = new Map<string, number>(payFresh.map(p => [p.id, Number(p.amount) || 0]));
        const now = new Date().toISOString();
        let total = 0;

        for (const t of tgtFresh) {
          if (surplus <= EPS) break;
          const need = balanceOf(t);
          if (need <= EPS) continue;
          const chunk = round2(Math.min(need, surplus));
          let toCover = chunk;
          for (const p of payFresh) {
            if (toCover <= EPS) break;
            const avail = payRemaining.get(p.id) || 0;
            if (avail <= EPS) continue;
            const part = round2(Math.min(avail, toCover));
            payRemaining.set(p.id, round2(avail - part));
            toCover = round2(toCover - part);
            const allocId = `${p.id}-ALLOC-${src.id.slice(0, 6)}`;
            tx.set(db.collection('financialRecords').doc(t.id).collection('payments').doc(allocId), {
              id: allocId,
              amount: FieldValue.increment(part),
              method: p.method || 'Cash',
              notes: `Surplus from receipt ${p.id} applied to this bill`,
              paidAt: p.paidAt || null,
              processedById: p.processedById || '',
              processedByName: p.processedByName || 'Auto-credit (billing)',
              studentId: t.studentId || p.studentId || '',
              description: t.description || p.description || '',
              schoolId,
              tillId: p.tillId || '',
              receiptNo: p.id,
              allocatedFromRecordId: src.id,
              isAllocation: true,
            }, { merge: true });
          }
          const tPaid = round2((Number(t.amountPaid) || 0) + chunk);
          tx.update(db.collection('financialRecords').doc(t.id), {
            amountPaid: tPaid,
            status: statusFor(Number(t.billedAmount) || 0, tPaid, Number(t.waiverAmount) || 0, t.status),
            creditAllocations: FieldValue.arrayUnion({ fromRecordId: src.id, amount: chunk, at: now, by: 'Auto-credit (billing)' }),
          });
          surplus = round2(surplus - chunk);
          total = round2(total + chunk);
        }
        if (total <= EPS) return 0;

        for (const p of payFresh) {
          const left = payRemaining.get(p.id) ?? (Number(p.amount) || 0);
          if (Math.abs(left - (Number(p.amount) || 0)) > EPS) {
            tx.update(p.ref, { amount: left, originalAmount: p.originalAmount ?? p.amount, allocatedOut: FieldValue.increment(round2((Number(p.amount) || 0) - left)) });
          }
        }
        const newSrcPaid = round2((Number(srcData.amountPaid) || 0) - total);
        tx.update(srcRef, {
          amountPaid: newSrcPaid,
          status: statusFor(Number(srcData.billedAmount) || 0, newSrcPaid, Number(srcData.waiverAmount) || 0, srcData.status),
          creditAllocations: FieldValue.arrayUnion({ toOthers: total, at: now, by: 'Auto-credit (billing)' }),
        });
        return total;
      });
      moved = round2(moved + movedHere);
    }

    // Refresh the student's credit marker.
    const after = await fetchRecords(db, schoolId, keys);
    const remaining = round2(after.filter(isAllocatable).reduce((s, r) => { const b = balanceOf(r); return b < -EPS ? s - b : s; }, 0));
    await db.collection('students').doc(student.uid || student.id).update({
      hasAccountCredit: remaining > EPS,
      accountCreditBalance: remaining > EPS ? remaining : 0,
    }).catch(() => undefined);
    student.hasAccountCredit = remaining > EPS;

    return moved;
  } catch (e) {
    console.warn('Auto credit application skipped (server):', e);
    return 0;
  }
}

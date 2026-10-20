import { Firestore, doc, collection, runTransaction, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { standardStatus, billBalance, round2 } from '@/lib/bill-actions';

/**
 * Approves a pending waiver request. Used by the Director dashboard and Accounts > Approvals so both behave
 * the same:
 *  - the request must still be Pending (approving twice does nothing);
 *  - the bill is re-read now: the waiver is added to the CURRENT waiver (not the figure from when it was
 *    requested), and is capped at what is still owed, so it can never turn into a credit;
 *  - the bill keeps the app's standard status (Paid / Unpaid / Overdue);
 *  - the waiver is kept in the bill's waiverHistory and in the audit log.
 * Returns the amount actually waived.
 */
export async function approveWaiverRequest(
  firestore: Firestore,
  req: any,
  approver: { uid?: string; name: string },
): Promise<number> {
  const requestRef = doc(firestore, 'waiverRequests', req.id);
  const recordRef = doc(firestore, 'financialRecords', req.recordId);
  return runTransaction(firestore, async (tx) => {
    const [reqSnap, billSnap] = await Promise.all([tx.get(requestRef), tx.get(recordRef)]);
    if (!reqSnap.exists()) throw new Error('Waiver request not found.');
    const r: any = reqSnap.data();
    if (r.status !== 'Pending') throw new Error(`This request was already ${String(r.status || 'processed').toLowerCase()}.`);
    if (!billSnap.exists()) throw new Error('The bill no longer exists.');
    const bill: any = billSnap.data();
    if (bill.isArchived === true) throw new Error('This bill belongs to a closed term; apply the waiver on its Arrears Brought Forward bill instead.');

    const requested = round2(Number(r.requestedAmount) || 0);
    const outstanding = billBalance(bill);
    const amount = round2(Math.min(requested, Math.max(0, outstanding)));
    if (amount <= 0.009) throw new Error('Nothing is owed on this bill any more, so there is nothing to waive.');

    const newWaiver = round2((Number(bill.waiverAmount) || 0) + amount);
    const at = new Date().toISOString();
    tx.update(recordRef, {
      waiverAmount: newWaiver,
      waiverReason: r.reason || '',
      status: standardStatus(Number(bill.billedAmount) || 0, Number(bill.amountPaid) || 0, newWaiver, bill.status),
      waiverHistory: arrayUnion({ amount, reason: r.reason || '', by: approver.uid || '', byName: approver.name, at, requestId: req.id, requestedBy: r.requestedByName || '' }),
    });
    tx.update(requestRef, {
      status: 'Approved',
      approvedBy: approver.uid || '',
      approvedByName: approver.name,
      approvedAt: serverTimestamp(),
      approvedAmount: amount,
    });
    tx.set(doc(collection(firestore, 'auditLogs')), {
      schoolId: bill.schoolId || r.schoolId || '',
      userName: approver.name,
      userId: approver.uid || null,
      action: 'APPROVE_WAIVER',
      details: `Approved waiver of GH₵${amount.toFixed(2)}${amount < requested ? ` (requested GH₵${requested.toFixed(2)}, capped at the amount still owed)` : ''} for ${r.studentName || 'student'} on "${r.recordDescription || bill.description || 'bill'}". Reason: ${r.reason || ''}`,
      recordId: req.recordId,
      timestamp: serverTimestamp(),
    });
    return amount;
  });
}

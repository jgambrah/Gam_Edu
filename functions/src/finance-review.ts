/**
 * Fee-change review trail ("review after", maker–checker light).
 *
 * Accountants may correct bills immediately (no waiting for approval), but EVERY change to what a family
 * owes is copied — by the server, so it cannot be skipped or hidden from the app — into
 * financeReviews/{id} for the Director, who can mark it OK or query it. The accountant answers queries on
 * their own dashboard.
 *
 * Recorded: bill amount raised or lowered, fee type / description / term changed, bill moved to another
 * student, bill deleted. NOT recorded (normal operations, already traceable): payments, approved waivers,
 * attendance-driven canteen/transport voids and restores, and changes made by the Director.
 *
 * Who made the change comes from Firestore itself (authenticated user id), not from anything the browser
 * sends. The browser only adds the reason the accountant typed (lastEditReason).
 */
import { onDocumentWrittenWithAuthContext, onDocumentCreatedWithAuthContext } from 'firebase-functions/v2/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) initializeApp();
const db = getFirestore();

const OWNER_ROLES = new Set(['Director', 'director', 'Owner', 'owner']);
const num = (v: any) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const r2 = (n: number) => Math.round(n * 100) / 100;

export const onBillChangeForReview = onDocumentWrittenWithAuthContext('financialRecords/{recordId}', async (event) => {
  const before: any = event.data?.before?.exists ? event.data.before.data() : null;
  const after: any = event.data?.after?.exists ? event.data.after.data() : null;
  if (!before) return; // a new bill is not a change
  const schoolId: string = (after?.schoolId || before?.schoolId || '') as string;
  if (!schoolId) return;

  // Attendance-driven daily voids/restores and pure payment/waiver updates are not "edits".
  if (after && Boolean(before.voided) !== Boolean(after.voided)) return;

  const changes: Record<string, { from: any; to: any }> = {};
  let kind = 'edit';
  if (!after) {
    // Deleting an UNPAID daily canteen/transport bill is the attendance correction — not reviewed.
    const daily = /canteen|transport/i.test(String(before.type || '')) && /daily/i.test(String(before.type || ''));
    if (daily && num(before.amountPaid) <= 0.009) return;
    kind = 'deleted';
    changes.bill = { from: `${before.type || 'Bill'} GH₵${r2(num(before.billedAmount)).toFixed(2)}`, to: 'deleted' };
  } else {
    const fb = r2(num(before.billedAmount)), ta = r2(num(after.billedAmount));
    if (Math.abs(fb - ta) > 0.009) changes.billedAmount = { from: fb, to: ta };
    for (const k of ['type', 'description', 'studentId', 'termId', 'academicYear', 'term']) {
      if ((before[k] ?? null) !== (after[k] ?? null)) changes[k] = { from: before[k] ?? null, to: after[k] ?? null };
    }
    if (Object.keys(changes).length === 0) return;
    if (changes.studentId) kind = 'moved';
    else if (changes.billedAmount) kind = changes.billedAmount.to < changes.billedAmount.from ? 'reduced' : 'increased';
    else kind = 'details';
  }

  // Signed-in app users arrive with their uid in authId; server code (service account / system) has none.
  const authType = String(event.authType || '');
  const isServer = authType === 'service_account' || authType === 'system';
  const editorId = !isServer && event.authId ? String(event.authId) : '';
  let editorName = editorId ? '' : (isServer ? 'System (server)' : 'Unknown');
  let editorRole = '';
  if (editorId) {
    const [staff, user] = await Promise.all([db.collection('staff').doc(editorId).get(), db.collection('users').doc(editorId).get()]);
    const s: any = { ...(user.data() || {}), ...(staff.data() || {}) };
    editorRole = String(s.role || '');
    editorName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email || editorId;
  }
  // The Director's own corrections need no review by themselves; server jobs (rollover, credit moves) only
  // touch payments/balances, but if one ever changes a bill amount it is still recorded.
  if (OWNER_ROLES.has(editorRole)) return;

  const rec = after || before;
  const paid = r2(num(rec.amountPaid));
  const highRisk = kind === 'deleted' || kind === 'moved' || (kind === 'reduced' && paid > 0.009) || (!editorId && !isServer);

  await db.collection('financeReviews').add({
    schoolId,
    recordId: event.params.recordId,
    studentId: rec.studentId || '',
    studentName: rec.studentName || '',
    billType: rec.type || '',
    description: rec.description || '',
    kind,
    risk: highRisk ? 'high' : 'normal',
    changes,
    amountPaidAtEdit: paid,
    reason: String(after?.lastEditReason || '').slice(0, 500),
    editedBy: editorId,
    editedByName: editorName,
    editedByRole: editorRole,
    at: FieldValue.serverTimestamp(),
    status: 'pending',
  });
});

/**
 * Payment reversals made by anyone other than the Director (e.g. a cashier's "immediate reversal" of a
 * receipt) also go to the Director's review list: a reversal makes money already received disappear from
 * the bill, so the Director should see each one.
 */
export const onPaymentReversalForReview = onDocumentCreatedWithAuthContext('financialRecords/{recordId}/payments/{paymentId}', async (event) => {
  const p: any = event.data?.exists ? event.data.data() : null;
  if (!p || p.isReversal !== true) return;
  const authType = String(event.authType || '');
  const isServer = authType === 'service_account' || authType === 'system';
  const editorId = !isServer && event.authId ? String(event.authId) : '';
  let editorName = editorId ? '' : (isServer ? 'System (server)' : 'Unknown');
  let editorRole = '';
  if (editorId) {
    const [staff, user] = await Promise.all([db.collection('staff').doc(editorId).get(), db.collection('users').doc(editorId).get()]);
    const s: any = { ...(user.data() || {}), ...(staff.data() || {}) };
    editorRole = String(s.role || '');
    editorName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email || editorId;
  }
  if (OWNER_ROLES.has(editorRole)) return;
  const bill = await db.collection('financialRecords').doc(event.params.recordId).get();
  const b: any = bill.data() || {};
  const schoolId = String(p.schoolId || b.schoolId || '');
  if (!schoolId) return;
  await db.collection('financeReviews').add({
    schoolId,
    recordId: event.params.recordId,
    studentId: b.studentId || p.studentId || '',
    studentName: b.studentName || '',
    billType: b.type || '',
    description: b.description || p.description || '',
    kind: 'reversed',
    risk: 'high',
    changes: { receipt: { from: `Receipt ${p.reversedReceiptId || ''} GH₵${Math.abs(num(p.amount)).toFixed(2)}`, to: 'reversed' } },
    amountPaidAtEdit: r2(num(b.amountPaid)),
    reason: String(p.notes || '').slice(0, 500),
    editedBy: editorId,
    editedByName: editorName,
    editedByRole: editorRole,
    at: FieldValue.serverTimestamp(),
    status: 'pending',
  });
});

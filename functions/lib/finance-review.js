"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPayrollRecordForReview = exports.onSalaryConfigChangeForReview = exports.onVoucherCreatedForReview = exports.onPaymentReversalForReview = exports.onBillChangeForReview = void 0;
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
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
const OWNER_ROLES = new Set(['Director', 'director', 'Owner', 'owner']);
const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const r2 = (n) => Math.round(n * 100) / 100;
exports.onBillChangeForReview = (0, firestore_1.onDocumentWrittenWithAuthContext)('financialRecords/{recordId}', async (event) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const before = ((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null;
    const after = ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null;
    if (!before)
        return; // a new bill is not a change
    const schoolId = ((after === null || after === void 0 ? void 0 : after.schoolId) || (before === null || before === void 0 ? void 0 : before.schoolId) || '');
    if (!schoolId)
        return;
    // Attendance-driven daily voids/restores are not "edits" — but a CANCELLED daily canteen/transport bill
    // (pupil re-marked absent after being billed) is money not collected, so the Director sees a daily
    // summary per staff member (one review item per person per day, not one per pupil).
    if (after && Boolean(before.voided) !== Boolean(after.voided)) {
        if (!before.voided && after.voided)
            await recordAttendanceCancellation(event, schoolId, before);
        return;
    }
    // Server code (scripts, term stamping, rollovers, online payments) is never a staff "edit".
    const authTypeEarly = String(event.authType || '');
    if (authTypeEarly === 'service_account' || authTypeEarly === 'system')
        return;
    // Only DELIBERATE changes by a person are reviewed: a save of the "Edit Record" dialog (it stamps a new
    // lastEditId each time) or a deletion. Everything else that touches a bill — payments, credit moves,
    // attendance billing, status/term housekeeping — is ordinary bookkeeping and is not listed.
    if (after && (!after.lastEditId || after.lastEditId === before.lastEditId))
        return;
    const changes = {};
    let kind = 'edit';
    if (!after) {
        // Deleting an UNPAID daily canteen/transport bill is the attendance correction — not reviewed.
        const daily = /canteen|transport/i.test(String(before.type || '')) && /daily/i.test(String(before.type || ''));
        if (daily && num(before.amountPaid) <= 0.009) {
            await recordAttendanceCancellation(event, schoolId, before);
            return;
        }
        kind = 'deleted';
        changes.bill = { from: `${before.type || 'Bill'} GH₵${r2(num(before.billedAmount)).toFixed(2)}`, to: 'deleted' };
    }
    else {
        const fb = r2(num(before.billedAmount)), ta = r2(num(after.billedAmount));
        if (Math.abs(fb - ta) > 0.009)
            changes.billedAmount = { from: fb, to: ta };
        for (const k of ['type', 'description', 'studentId', 'academicYear', 'term']) {
            if (((_e = before[k]) !== null && _e !== void 0 ? _e : null) !== ((_f = after[k]) !== null && _f !== void 0 ? _f : null))
                changes[k] = { from: (_g = before[k]) !== null && _g !== void 0 ? _g : null, to: (_h = after[k]) !== null && _h !== void 0 ? _h : null };
        }
        if (Object.keys(changes).length === 0)
            return;
        if (changes.studentId)
            kind = 'moved';
        else if (changes.billedAmount)
            kind = changes.billedAmount.to < changes.billedAmount.from ? 'reduced' : 'increased';
        else
            kind = 'details';
    }
    // Signed-in app users arrive with their uid in authId; server code (service account / system) has none.
    const authType = String(event.authType || '');
    const isServer = authType === 'service_account' || authType === 'system';
    const editorId = !isServer && event.authId ? String(event.authId) : '';
    let editorName = editorId ? '' : (isServer ? 'System (server)' : 'Unknown');
    let editorRole = '';
    if (editorId) {
        const [staff, user] = await Promise.all([db.collection('staff').doc(editorId).get(), db.collection('users').doc(editorId).get()]);
        const s = Object.assign(Object.assign({}, (user.data() || {})), (staff.data() || {}));
        editorRole = String(s.role || '');
        editorName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email || editorId;
    }
    // The Director's own corrections need no review by themselves; server jobs (rollover, credit moves) only
    // touch payments/balances, but if one ever changes a bill amount it is still recorded.
    if (OWNER_ROLES.has(editorRole))
        return;
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
        reason: String((after === null || after === void 0 ? void 0 : after.lastEditReason) || '').slice(0, 500),
        editedBy: editorId,
        editedByName: editorName,
        editedByRole: editorRole,
        at: firestore_2.FieldValue.serverTimestamp(),
        status: 'pending',
    });
});
/**
 * Payment reversals made by anyone other than the Director (e.g. a cashier's "immediate reversal" of a
 * receipt) also go to the Director's review list: a reversal makes money already received disappear from
 * the bill, so the Director should see each one.
 */
exports.onPaymentReversalForReview = (0, firestore_1.onDocumentCreatedWithAuthContext)('financialRecords/{recordId}/payments/{paymentId}', async (event) => {
    var _a;
    const p = ((_a = event.data) === null || _a === void 0 ? void 0 : _a.exists) ? event.data.data() : null;
    if (!p || p.isReversal !== true)
        return;
    const authType = String(event.authType || '');
    const isServer = authType === 'service_account' || authType === 'system';
    const editorId = !isServer && event.authId ? String(event.authId) : '';
    let editorName = editorId ? '' : (isServer ? 'System (server)' : 'Unknown');
    let editorRole = '';
    if (editorId) {
        const [staff, user] = await Promise.all([db.collection('staff').doc(editorId).get(), db.collection('users').doc(editorId).get()]);
        const s = Object.assign(Object.assign({}, (user.data() || {})), (staff.data() || {}));
        editorRole = String(s.role || '');
        editorName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email || editorId;
    }
    if (OWNER_ROLES.has(editorRole))
        return;
    const bill = await db.collection('financialRecords').doc(event.params.recordId).get();
    const b = bill.data() || {};
    const schoolId = String(p.schoolId || b.schoolId || '');
    if (!schoolId)
        return;
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
        at: firestore_2.FieldValue.serverTimestamp(),
        status: 'pending',
    });
});
// ── Money going OUT: expenses, salary set-up and payroll runs also reach the Director's review list ──────
/** Who made a change (from Firestore's own auth context), and whether they are the Director/owner. */
async function editorOf(event) {
    const authType = String(event.authType || '');
    const isServer = authType === 'service_account' || authType === 'system';
    const id = !isServer && event.authId ? String(event.authId) : '';
    let name = id ? '' : (isServer ? 'System (server)' : 'Unknown');
    let role = '';
    if (id) {
        const [staff, user] = await Promise.all([db.collection('staff').doc(id).get(), db.collection('users').doc(id).get()]);
        const s = Object.assign(Object.assign({}, (user.data() || {})), (staff.data() || {}));
        role = String(s.role || '');
        name = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email || id;
    }
    return { id, name, role, isOwner: OWNER_ROLES.has(role), isServer };
}
const money = (n) => `GH₵${r2(num(n)).toFixed(2)}`;
/** Every expense voucher prepared by someone other than the Director. */
exports.onVoucherCreatedForReview = (0, firestore_1.onDocumentCreatedWithAuthContext)('paymentVouchers/{voucherId}', async (event) => {
    var _a;
    const v = ((_a = event.data) === null || _a === void 0 ? void 0 : _a.exists) ? event.data.data() : null;
    if (!v || !v.schoolId)
        return;
    const who = await editorOf(event);
    if (who.isOwner)
        return;
    const gross = num(v.grossAmount);
    await db.collection('financeReviews').add({
        schoolId: v.schoolId,
        recordId: event.params.voucherId,
        studentId: '',
        studentName: v.payee || 'Payee',
        billType: 'Expense voucher',
        description: `${v.pvNumber || ''} ${v.description || ''}`.trim(),
        kind: 'expense',
        risk: v.status === 'Awaiting Override' || gross >= 5000 ? 'high' : 'normal',
        changes: { expense: { from: v.costCenter || 'General', to: `${money(gross)} to ${v.payee || 'payee'}` } },
        amountPaidAtEdit: r2(gross),
        reason: String(v.description || '').slice(0, 500),
        editedBy: who.id, editedByName: who.name, editedByRole: who.role,
        at: firestore_2.FieldValue.serverTimestamp(),
        status: 'pending',
    });
});
/** Salary set-up changes (basic salary, allowances, deductions, bank account) made by anyone but the Director. */
exports.onSalaryConfigChangeForReview = (0, firestore_1.onDocumentWrittenWithAuthContext)('staff/{staffId}/payroll/{configId}', async (event) => {
    var _a, _b, _c, _d;
    const before = ((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null;
    const after = ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null;
    const sumOf = (list) => (Array.isArray(list) ? list : []).reduce((s, i) => s + num(i === null || i === void 0 ? void 0 : i.amount), 0);
    const changes = {};
    const cmp = (label, a, b) => { if (String(a !== null && a !== void 0 ? a : '') !== String(b !== null && b !== void 0 ? b : ''))
        changes[label] = { from: a !== null && a !== void 0 ? a : '—', to: b !== null && b !== void 0 ? b : '—' }; };
    cmp('basicSalary', before ? money(before.basicSalary) : null, after ? money(after.basicSalary) : null);
    cmp('allowances', before ? money(sumOf(before.allowances)) : null, after ? money(sumOf(after.allowances)) : null);
    cmp('deductions', before ? money(sumOf(before.deductions)) : null, after ? money(sumOf(after.deductions)) : null);
    cmp('bankAccount', before ? `${before.bankName || ''} ${before.accountNumber || ''}`.trim() : null, after ? `${after.bankName || ''} ${after.accountNumber || ''}`.trim() : null);
    if (Object.keys(changes).length === 0)
        return;
    const who = await editorOf(event);
    if (who.isOwner)
        return;
    const staff = await db.collection('staff').doc(event.params.staffId).get();
    const s = staff.data() || {};
    const schoolId = String(s.schoolId || (after === null || after === void 0 ? void 0 : after.schoolId) || (before === null || before === void 0 ? void 0 : before.schoolId) || '');
    if (!schoolId)
        return;
    const raised = num(after === null || after === void 0 ? void 0 : after.basicSalary) + sumOf(after === null || after === void 0 ? void 0 : after.allowances) > num(before === null || before === void 0 ? void 0 : before.basicSalary) + sumOf(before === null || before === void 0 ? void 0 : before.allowances) + 0.009;
    await db.collection('financeReviews').add({
        schoolId,
        recordId: event.params.staffId,
        studentId: '',
        studentName: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Staff member',
        billType: 'Salary set-up',
        description: s.role || '',
        kind: 'salary',
        // Pay raised, a bank account changed, or someone editing their own pay: high risk.
        risk: raised || !!changes.bankAccount || who.id === event.params.staffId ? 'high' : 'normal',
        changes,
        amountPaidAtEdit: r2(num(after === null || after === void 0 ? void 0 : after.basicSalary)),
        reason: '',
        editedBy: who.id, editedByName: who.name, editedByRole: who.role,
        at: firestore_2.FieldValue.serverTimestamp(),
        status: 'pending',
    });
});
/** One review per payroll run (school + month), totalled as the payslips are written. */
exports.onPayrollRecordForReview = (0, firestore_1.onDocumentCreatedWithAuthContext)('payrollRecords/{recordId}', async (event) => {
    var _a;
    const p = ((_a = event.data) === null || _a === void 0 ? void 0 : _a.exists) ? event.data.data() : null;
    if (!p || !p.schoolId || !p.period)
        return;
    const who = await editorOf(event);
    if (who.isOwner)
        return;
    const ref = db.collection('financeReviews').doc(`payroll_${p.schoolId}_${String(p.period).replace(/[^0-9A-Za-z-]/g, '')}`);
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const cur = snap.data() || {};
        const staffCount = num(cur.payrollStaff) + 1;
        const gross = r2(num(cur.payrollGross) + num(p.grossSalary));
        const net = r2(num(cur.payrollNet) + num(p.netSalary));
        tx.set(ref, {
            schoolId: p.schoolId,
            recordId: String(p.period),
            studentId: '',
            studentName: `Payroll ${p.period}`,
            billType: 'Payroll run',
            description: '',
            kind: 'payroll',
            risk: 'normal',
            payrollStaff: staffCount, payrollGross: gross, payrollNet: net,
            changes: { payroll: { from: `${staffCount} staff`, to: `gross ${money(gross)} · net ${money(net)}` } },
            amountPaidAtEdit: net,
            reason: '',
            editedBy: who.id, editedByName: who.name, editedByRole: who.role,
            at: cur.at || firestore_2.FieldValue.serverTimestamp(),
            status: snap.exists ? (cur.status || 'pending') : 'pending',
        }, { merge: true });
    });
});
/** Daily summary of canteen/transport bills cancelled through attendance corrections, per staff member. */
async function recordAttendanceCancellation(event, schoolId, bill) {
    var _a;
    const amount = r2(num((_a = bill === null || bill === void 0 ? void 0 : bill.originalBilledAmount) !== null && _a !== void 0 ? _a : bill === null || bill === void 0 ? void 0 : bill.billedAmount));
    if (amount <= 0.009)
        return;
    const who = await editorOf(event);
    if (who.isOwner || who.isServer)
        return; // the Director's own corrections, and server-side biometric billing
    const day = new Date().toISOString().slice(0, 10);
    const ref = db.collection('financeReviews').doc(`cancel_${schoolId}_${day}_${(who.id || 'unknown').replace(/[^A-Za-z0-9_-]/g, '')}`);
    const pupil = String((bill === null || bill === void 0 ? void 0 : bill.studentName) || (bill === null || bill === void 0 ? void 0 : bill.studentId) || 'pupil');
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const cur = snap.data() || {};
        const count = num(cur.cancelCount) + 1;
        const total = r2(num(cur.cancelTotal) + amount);
        const pupils = Array.isArray(cur.pupils) ? cur.pupils : [];
        if (!pupils.includes(pupil) && pupils.length < 60)
            pupils.push(pupil);
        tx.set(ref, {
            schoolId,
            recordId: day,
            studentId: '',
            studentName: `${count} cancelled bill${count === 1 ? '' : 's'} on ${day}`,
            billType: 'Canteen / transport cancelled by attendance',
            description: pupils.slice(0, 12).join(', ') + (pupils.length > 12 ? ` and ${pupils.length - 12} more` : ''),
            kind: 'cancelled',
            risk: count >= 10 ? 'high' : 'normal',
            cancelCount: count, cancelTotal: total, pupils,
            changes: { cancelled: { from: `${count} daily bill${count === 1 ? '' : 's'}`, to: `GH₵${total.toFixed(2)} not charged` } },
            amountPaidAtEdit: 0,
            reason: 'Pupils re-marked absent after being billed.',
            editedBy: who.id, editedByName: who.name, editedByRole: who.role,
            at: cur.at || firestore_2.FieldValue.serverTimestamp(),
            status: snap.exists && cur.status === 'ok' ? 'pending' : (cur.status || 'pending'), // new cancellations reopen it
        }, { merge: true });
    });
}
//# sourceMappingURL=finance-review.js.map
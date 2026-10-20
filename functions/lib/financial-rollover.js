"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditDocId = exports.arrearsDocId = exports.rolloverIdFor = void 0;
exports.resolveRolloverTerms = resolveRolloverTerms;
exports.planTermRollover = planTermRollover;
exports.executeTermFinancialRollover = executeTermFinancialRollover;
exports.reconcileCorrectedTerm = reconcileCorrectedTerm;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const term_utils_1 = require("./term-utils");
/**
 * END-OF-TERM FINANCIAL ROLLOVER
 *
 * Closes the school's current term (read from the school profile) and opens the next one:
 *
 *  1. Every open bill that is not already in the next term — current-term bills, older unpaid bills and
 *     legacy bills with no term stamp — is included. Each student's NET balance is calculated
 *     (bills − payments − waivers, so an overpaid bill offsets an unpaid one).
 *  2. Net owing  → one "Arrears Brought Forward" bill in the new term, status 'Unpaid', itemised by fee
 *                  type, listing the bills it replaces.
 *     Net credit → one "Credit Brought Forward" record in the new term, holding the credit as a
 *                  carry-forward payment (`isCarryForward`, never counted as cash collected). The existing
 *                  auto-credit logic then applies it to the student's new bills.
 *  3. The included bills are archived (`isArchived`, `closedInTermId`, open ones get status
 *     'Carried Forward'), so no balance is ever counted twice.
 *  4. The school profile moves to the next term, so new bills are stamped with it.
 *
 * Safety:
 *  - Dry run (`planTermRollover`) writes nothing and returns per-student figures to review.
 *  - Blocked while any bill is 'Pending Reversal' (its balance is not final).
 *  - A run record at termRollovers/{schoolId}__{from}__{to} stores the frozen plan, so a run
 *    that was interrupted resumes exactly where it stopped, and a finished run is never repeated.
 *    (Top-level collection with no client rule, so per-student balances are readable by the server only.)
 *  - Brought-forward documents have fixed ids and are only created if missing.
 *  - All writes go in batches of ≤ 400.
 */
function getAdminDb() {
    const existingApps = (0, app_1.getApps)();
    const adminApp = existingApps.find(app => app.name === 'admin');
    if (adminApp)
        return (0, firestore_1.getFirestore)(adminApp);
    if (existingApps.length > 0)
        return (0, firestore_1.getFirestore)(existingApps[0]);
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
    if (projectId && clientEmail && privateKeyRaw) {
        const formattedKey = privateKeyRaw.replace(/\\n/g, '\n').replace(/"/g, '');
        const app = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({ projectId, clientEmail, privateKey: formattedKey }),
        }, 'admin');
        return (0, firestore_1.getFirestore)(app);
    }
    const defaultApp = (0, app_1.initializeApp)();
    return (0, firestore_1.getFirestore)(defaultApp);
}
const EPS = 0.009;
const BATCH_LIMIT = 400;
const STUDENTS_PER_CHUNK = 250;
const RECORD_IDS_PER_CHUNK = 2000;
const MAX_SOURCE_LINES = 150;
const LEASE_MS = 15 * 60 * 1000;
const round2 = (n) => Math.round(n * 100) / 100;
function categoryOf(r) {
    // An earlier brought-forward bill keeps its own breakdown (handled by the caller).
    const c = String((r === null || r === void 0 ? void 0 : r.category) || (r === null || r === void 0 ? void 0 : r.type) || 'tuition').toLowerCase();
    if (c.includes('bus') || c.includes('transport'))
        return 'busArrears';
    if (c.includes('canteen') || c.includes('feeding') || c.includes('mess'))
        return 'canteenArrears';
    if (c.includes('exam') || c.includes('test'))
        return 'examArrears';
    if (c.includes('tuition') || c.includes('fee'))
        return 'tuitionArrears';
    return 'otherArrears';
}
const emptyItemized = () => ({
    tuitionArrears: 0, busArrears: 0, canteenArrears: 0, examArrears: 0, otherArrears: 0, totalArrears: 0,
});
const balanceOf = (r) => { var _a, _b; return round2((Number((_b = (_a = r === null || r === void 0 ? void 0 : r.billedAmount) !== null && _a !== void 0 ? _a : r === null || r === void 0 ? void 0 : r.amount) !== null && _b !== void 0 ? _b : 0) || 0) - (Number(r === null || r === void 0 ? void 0 : r.amountPaid) || 0) - (Number(r === null || r === void 0 ? void 0 : r.waiverAmount) || 0)); };
const rolloverIdFor = (fromTermId, toTermId) => `${fromTermId}__${toTermId}`;
exports.rolloverIdFor = rolloverIdFor;
const arrearsDocId = (studentId, toTermId) => `abf_${studentId}_${toTermId}`;
exports.arrearsDocId = arrearsDocId;
const creditDocId = (studentId, toTermId) => `cbf_${studentId}_${toTermId}`;
exports.creditDocId = creditDocId;
async function readProfile(db, schoolId) {
    const [schoolSnap, settingsSnap] = await Promise.all([
        db.collection('schools').doc(schoolId).get(),
        db.collection('schoolSettings').doc(schoolId).get(),
    ]);
    const school = schoolSnap.exists ? schoolSnap.data() || {} : {};
    const settings = settingsSnap.exists ? settingsSnap.data() || {} : {};
    // The School Profile page writes the same term fields to both documents; `schools` is primary.
    return Object.assign(Object.assign(Object.assign({}, settings), school), { rolledOverTermIds: settings.rolledOverTermIds || school.rolledOverTermIds || [] });
}
/** A run that froze its plan (and so may already have moved the term pointer) but did not finish. */
async function findUnfinishedRun(db, schoolId) {
    const snap = await db.collection('termRollovers')
        .where('schoolId', '==', schoolId)
        .where('planStored', '==', true).get();
    const open = snap.docs.filter(d => d.data().status !== 'completed');
    return open.length ? { ref: open[0].ref, data: open[0].data() } : null;
}
/** Which term closes and which opens, from the school profile. */
async function resolveRolloverTerms(db, schoolId) {
    const profile = await readProfile(db, schoolId);
    const from = (0, term_utils_1.currentTermFromProfile)(profile);
    if (!from) {
        throw new Error('The current academic year and term are not set. Set them in Admin → School Profile first.');
    }
    return { from, to: (0, term_utils_1.nextTermStamp)(from), profile };
}
/** Builds the plan from live data. Writes nothing. */
async function computePlan(db, schoolId, from, to, profile) {
    const snap = await db.collection('financialRecords').where('schoolId', '==', schoolId).get();
    const byStudent = new Map();
    const recordIds = [];
    const blockers = [];
    let recordsWithoutStudent = 0;
    snap.docs.forEach(d => {
        const r = d.data();
        if (r.isArchived === true)
            return;
        const stamp = (0, term_utils_1.termStampOfRecord)(r);
        if (stamp && stamp.termId === to.termId)
            return; // already belongs to the new term (e.g. its own B/F docs)
        if (r.status === 'Pending Reversal') {
            blockers.push({ recordId: d.id, studentName: r.studentName || '', reason: 'Reversal awaiting approval' });
            return;
        }
        const studentId = String(r.studentId || '').trim();
        if (!studentId) {
            recordsWithoutStudent++;
            return; // left untouched; listed in the dry run so it can be fixed by hand
        }
        let line = byStudent.get(studentId);
        if (!line) {
            line = {
                studentId,
                studentName: r.studentName || 'Student',
                classId: r.classId || '',
                owing: 0, credit: 0, net: 0,
                itemized: emptyItemized(),
                sources: [],
                recordCount: 0,
            };
            byStudent.set(studentId, line);
        }
        if (r.studentName)
            line.studentName = r.studentName;
        if (r.classId)
            line.classId = r.classId;
        recordIds.push(d.id);
        line.recordCount++;
        const bal = balanceOf(r);
        if (bal > EPS) {
            line.owing = round2(line.owing + bal);
            if (r.itemizedArrears && typeof r.itemizedArrears === 'object' && bal > EPS) {
                // An earlier Arrears B/F bill: spread what is still unpaid on it across its original breakdown.
                const it = r.itemizedArrears;
                const parts = ['tuitionArrears', 'busArrears', 'canteenArrears', 'examArrears', 'otherArrears'];
                const total = parts.reduce((s, k) => s + (Number(it[k]) || 0), 0);
                if (total > EPS) {
                    parts.forEach(k => { line.itemized[k] = round2(line.itemized[k] + bal * ((Number(it[k]) || 0) / total)); });
                }
                else {
                    line.itemized.otherArrears = round2(line.itemized.otherArrears + bal);
                }
            }
            else {
                const k = categoryOf(r);
                line.itemized[k] = round2(line.itemized[k] + bal);
            }
        }
        else if (bal < -EPS) {
            line.credit = round2(line.credit - bal);
        }
        if (Math.abs(bal) > EPS && line.sources.length < MAX_SOURCE_LINES) {
            line.sources.push({ id: d.id, description: r.description || r.type || 'Bill', balance: bal, termId: (stamp === null || stamp === void 0 ? void 0 : stamp.termId) || null });
        }
    });
    const students = Array.from(byStudent.values()).map(l => {
        l.net = round2(l.owing - l.credit);
        l.itemized.totalArrears = round2(l.itemized.tuitionArrears + l.itemized.busArrears + l.itemized.canteenArrears + l.itemized.examArrears + l.itemized.otherArrears);
        return l;
    }).sort((a, b) => a.studentName.localeCompare(b.studentName));
    const withArrears = students.filter(s => s.net > EPS);
    const withCredit = students.filter(s => s.net < -EPS);
    const rolled = Array.isArray(profile === null || profile === void 0 ? void 0 : profile.rolledOverTermIds) ? profile.rolledOverTermIds : [];
    return {
        schoolId,
        fromTerm: from,
        toTerm: to,
        newTermStartDate: (profile === null || profile === void 0 ? void 0 : profile.nextTermDate) || null,
        students,
        recordIds,
        totals: {
            students: students.length,
            studentsWithArrears: withArrears.length,
            studentsWithCredit: withCredit.length,
            arrearsCarried: round2(withArrears.reduce((s, l) => s + l.net, 0)),
            creditCarried: round2(withCredit.reduce((s, l) => s - l.net, 0)),
            recordsToArchive: recordIds.length,
            recordsWithoutStudent,
        },
        blockers,
        alreadyCompleted: rolled.includes(from.termId),
        resumePending: false,
    };
}
/** DRY RUN — what the rollover would do right now. Writes nothing. */
async function planTermRollover(schoolId) {
    const db = getAdminDb();
    const unfinished = await findUnfinishedRun(db, schoolId);
    if (unfinished) {
        // Show the frozen figures of the interrupted run; confirming finishes exactly that run.
        const { students, recordIds } = await loadPlan(unfinished.ref, unfinished.data);
        return {
            schoolId,
            fromTerm: unfinished.data.fromTerm,
            toTerm: unfinished.data.toTerm,
            newTermStartDate: unfinished.data.newTermStartDate || null,
            students,
            recordIds,
            totals: unfinished.data.totals,
            blockers: [],
            alreadyCompleted: false,
            resumePending: true,
        };
    }
    const { from, to, profile } = await resolveRolloverTerms(db, schoolId);
    return computePlan(db, schoolId, from, to, profile);
}
// ── Frozen-plan storage (so an interrupted run resumes with the SAME figures) ───────────────────────
async function savePlan(runRef, plan) {
    const db = runRef.firestore;
    const writes = [];
    for (let i = 0; i < plan.students.length; i += STUDENTS_PER_CHUNK) {
        writes.push([runRef.collection('students').doc(String(i / STUDENTS_PER_CHUNK)), { lines: plan.students.slice(i, i + STUDENTS_PER_CHUNK) }]);
    }
    for (let i = 0; i < plan.recordIds.length; i += RECORD_IDS_PER_CHUNK) {
        writes.push([runRef.collection('records').doc(String(i / RECORD_IDS_PER_CHUNK)), { ids: plan.recordIds.slice(i, i + RECORD_IDS_PER_CHUNK) }]);
    }
    for (let i = 0; i < writes.length; i += 20) {
        const batch = db.batch();
        writes.slice(i, i + 20).forEach(([ref, data]) => batch.set(ref, data));
        await batch.commit();
    }
    await runRef.set({
        planStored: true,
        studentChunks: Math.ceil(plan.students.length / STUDENTS_PER_CHUNK),
        recordChunks: Math.ceil(plan.recordIds.length / RECORD_IDS_PER_CHUNK),
        totals: plan.totals,
        newTermStartDate: plan.newTermStartDate,
    }, { merge: true });
}
async function loadPlan(runRef, run) {
    var _a, _b;
    const students = [];
    const recordIds = [];
    for (let i = 0; i < (run.studentChunks || 0); i++) {
        const s = await runRef.collection('students').doc(String(i)).get();
        students.push(...(((_a = s.data()) === null || _a === void 0 ? void 0 : _a.lines) || []));
    }
    for (let i = 0; i < (run.recordChunks || 0); i++) {
        const s = await runRef.collection('records').doc(String(i)).get();
        recordIds.push(...(((_b = s.data()) === null || _b === void 0 ? void 0 : _b.ids) || []));
    }
    return { students, recordIds };
}
async function commitInChunks(db, ops, opsPerItem = 1) {
    const perBatch = Math.max(1, Math.floor(BATCH_LIMIT / opsPerItem));
    for (let i = 0; i < ops.length; i += perBatch) {
        const batch = db.batch();
        ops.slice(i, i + perBatch).forEach(fn => fn(batch));
        await batch.commit();
    }
}
/**
 * EXECUTE the rollover for the school's current term.
 *
 * @param expectedFromTermId  The term the admin reviewed in the dry run. If the profile has moved on since,
 *                            the run is refused instead of closing a different term.
 */
async function executeTermFinancialRollover(schoolId, options = {}) {
    var _a;
    const db = getAdminDb();
    const performedBy = options.performedBy || 'Admin';
    // An interrupted run is always finished first, with its own (frozen) terms — the profile may already
    // point at the new term because the pointer moves before the bills are archived.
    const unfinished = await findUnfinishedRun(db, schoolId);
    const { from, to, profile } = unfinished
        ? { from: unfinished.data.fromTerm, to: unfinished.data.toTerm, profile: null }
        : await resolveRolloverTerms(db, schoolId);
    if (options.expectedFromTermId && options.expectedFromTermId !== from.termId) {
        throw new Error(`The current term is now ${from.termId}, not ${options.expectedFromTermId}. Refresh and review the dry run again.`);
    }
    const rolloverId = (0, exports.rolloverIdFor)(from.termId, to.termId);
    const runRef = db.collection('termRollovers').doc(`${schoolId}__${rolloverId}`);
    // 1. Claim the run (one at a time).
    const claim = await db.runTransaction(async (tx) => {
        var _a, _b, _c;
        const snap = await tx.get(runRef);
        const run = snap.exists ? snap.data() : null;
        if ((run === null || run === void 0 ? void 0 : run.status) === 'completed')
            return { state: 'completed', run };
        const leaseUntil = (_c = (_b = (_a = run === null || run === void 0 ? void 0 : run.leaseUntil) === null || _a === void 0 ? void 0 : _a.toMillis) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : 0;
        if ((run === null || run === void 0 ? void 0 : run.status) === 'running' && leaseUntil > Date.now())
            return { state: 'busy', run };
        tx.set(runRef, {
            rolloverId,
            schoolId,
            fromTermId: from.termId,
            toTermId: to.termId,
            fromTerm: from,
            toTerm: to,
            status: 'running',
            leaseUntil: new Date(Date.now() + LEASE_MS),
            startedAt: (run === null || run === void 0 ? void 0 : run.startedAt) || firestore_1.FieldValue.serverTimestamp(),
            startedBy: (run === null || run === void 0 ? void 0 : run.startedBy) || performedBy,
            attempts: firestore_1.FieldValue.increment(1),
        }, { merge: true });
        return { state: 'claimed', run };
    });
    if (claim.state === 'completed') {
        const t = claim.run.totals || {};
        return {
            success: true, rolloverId, fromTermId: from.termId, toTermId: to.termId,
            processedStudents: t.students || 0, totalArrearsCarried: t.arrearsCarried || 0, totalCreditCarried: t.creditCarried || 0,
            recordsArchived: t.recordsToArchive || 0, resumed: false, alreadyCompleted: true,
        };
    }
    if (claim.state === 'busy') {
        throw new Error('A rollover for this term is already running. Wait a few minutes and try again.');
    }
    const resumed = !!((_a = claim.run) === null || _a === void 0 ? void 0 : _a.planStored);
    try {
        // 2. Freeze the plan (or reload the frozen one).
        let students;
        let recordIds;
        let totals;
        let newTermStartDate;
        if (resumed) {
            ({ students, recordIds } = await loadPlan(runRef, claim.run));
            totals = claim.run.totals;
            newTermStartDate = claim.run.newTermStartDate || null;
        }
        else {
            const plan = await computePlan(db, schoolId, from, to, profile);
            if (plan.blockers.length > 0) {
                await runRef.set({ status: 'blocked', leaseUntil: null, blockers: plan.blockers.slice(0, 50) }, { merge: true });
                throw new Error(`${plan.blockers.length} bill(s) have a reversal awaiting approval. Approve or reject them, then run the rollover again.`);
            }
            await savePlan(runRef, plan);
            students = plan.students;
            recordIds = plan.recordIds;
            totals = plan.totals;
            newTermStartDate = plan.newTermStartDate;
        }
        // 3. Move the school to the new term FIRST, so anything billed from now on lands in the new term
        //    and is never swept into this (frozen) rollover.
        const pointer = {
            academicYear: to.academicYear,
            activeAcademicYear: to.academicYear,
            term: to.term,
            activeTerm: to.term,
            currentTerm: to.term,
            currentTermId: to.termId,
            termStartDate: newTermStartDate || null,
            termEndDate: null,
            nextTermDate: null,
            termStatus: 'Active',
            softScopedPointer: false,
            activeQueryTermId: firestore_1.FieldValue.delete(),
            lastTermRolloverAt: firestore_1.FieldValue.serverTimestamp(),
            lastRolledOverTermId: from.termId,
            rolledOverTermIds: firestore_1.FieldValue.arrayUnion(from.termId),
        };
        // Keep the closing term's dates: the profile's termStartDate/termEndDate are about to be replaced, and the
        // academic close (attendance by date) and the correction tools need them later.
        if (profile) {
            await db.collection('schoolSettings').doc(schoolId).collection('terms').doc(from.termId).set(Object.assign(Object.assign({}, from), { startDate: profile.termStartDate || null, endDate: profile.termEndDate || null, financialClosedAt: firestore_1.FieldValue.serverTimestamp(), rolloverId }), { merge: true });
        }
        await Promise.all([
            db.collection('schools').doc(schoolId).set(pointer, { merge: true }),
            db.collection('schoolSettings').doc(schoolId).set(pointer, { merge: true }),
        ]);
        // 4. Brought-forward documents (created only if missing — never overwrite one that may have been paid).
        const dueDate = newTermStartDate ? new Date(`${newTermStartDate}T00:00:00`) : new Date();
        const movers = students.filter(s => Math.abs(s.net) > EPS);
        for (let i = 0; i < movers.length; i += 150) {
            const slice = movers.slice(i, i + 150);
            const refs = slice.map(s => db.collection('financialRecords').doc(s.net > 0 ? (0, exports.arrearsDocId)(s.studentId, to.termId) : (0, exports.creditDocId)(s.studentId, to.termId)));
            const existing = await db.getAll(...refs);
            const batch = db.batch();
            slice.forEach((s, idx) => {
                if (existing[idx].exists)
                    return;
                const ref = refs[idx];
                const common = Object.assign(Object.assign({ id: ref.id, schoolId, studentId: s.studentId, studentName: s.studentName, classId: s.classId }, to), { isArchived: false, broughtForwardFromTermId: from.termId, rolloverId,
                    dueDate, createdAt: firestore_1.FieldValue.serverTimestamp(), createdBy: performedBy });
                if (s.net > 0) {
                    batch.set(ref, Object.assign(Object.assign({}, common), { type: 'Arrears Brought Forward', category: 'Arrears', title: 'Arrears Brought Forward', description: `Arrears brought forward from ${from.term} ${from.academicYear}`, billedAmount: s.net, amountPaid: 0, waiverAmount: 0, status: 'Unpaid', itemizedArrears: s.itemized, grossOwing: s.owing, creditOffset: s.credit, sourceRecords: s.sources, sourceRecordCount: s.recordCount }));
                }
                else {
                    const credit = round2(-s.net);
                    batch.set(ref, Object.assign(Object.assign({}, common), { type: 'Credit Brought Forward', category: 'Credit', title: 'Credit Brought Forward', description: `Credit brought forward from ${from.term} ${from.academicYear}`, billedAmount: 0, amountPaid: credit, waiverAmount: 0, status: 'Paid', creditBroughtForward: credit, grossOwing: s.owing, sourceRecords: s.sources, sourceRecordCount: s.recordCount }));
                    batch.set(ref.collection('payments').doc(`CBF-${from.termId}`), {
                        id: `CBF-${from.termId}`,
                        amount: credit,
                        method: 'Credit B/F',
                        notes: `Credit brought forward from ${from.term} ${from.academicYear}. Not new cash.`,
                        description: 'Credit Brought Forward',
                        paidAt: firestore_1.FieldValue.serverTimestamp(),
                        processedById: 'SYSTEM',
                        processedByName: `Term rollover (${performedBy})`,
                        studentId: s.studentId,
                        schoolId,
                        termId: to.termId,
                        academicYear: to.academicYear,
                        isCarryForward: true,
                        status: 'Completed',
                    });
                }
            });
            await batch.commit();
        }
        // 5. Archive the closed-term bills (idempotent: re-applying the same update is harmless).
        const studentNet = new Map(students.map(s => [s.studentId, s.net]));
        for (let i = 0; i < recordIds.length; i += 200) {
            const ids = recordIds.slice(i, i + 200);
            const snaps = await db.getAll(...ids.map(id => db.collection('financialRecords').doc(id)));
            const ops = [];
            snaps.forEach(snap => {
                if (!snap.exists)
                    return;
                const r = snap.data();
                if (r.isArchived === true && r.rolloverId === rolloverId)
                    return;
                const bal = balanceOf(r);
                const own = (0, term_utils_1.termStampOfRecord)(r);
                const update = {
                    isArchived: true,
                    archivedAt: firestore_1.FieldValue.serverTimestamp(),
                    closedInTermId: from.termId,
                    rolloverId,
                    carriedForwardToTermId: to.termId,
                };
                if (own && !r.termId)
                    update.termId = own.termId; // stamp legacy bills that had year+term only
                if (bal > EPS) {
                    update.statusBeforeRollover = r.status || null;
                    update.status = 'Carried Forward';
                    update.carriedForwardAmount = bal;
                }
                else if (bal < -EPS) {
                    update.creditCarriedForward = round2(-bal);
                }
                ops.push(b => b.update(snap.ref, update));
            });
            await commitInChunks(db, ops);
        }
        // 6. Credit markers on students (used by the auto-credit logic when new bills are raised).
        const markerOps = students
            .filter(s => s.credit > EPS || s.net < -EPS)
            .map(s => db.collection('students').doc(s.studentId).update({
            hasAccountCredit: s.net < -EPS,
            accountCreditBalance: s.net < -EPS ? round2(-s.net) : 0,
        }).catch(() => undefined)); // studentId may not be a student doc id on very old records
        for (let i = 0; i < markerOps.length; i += 50)
            await Promise.all(markerOps.slice(i, i + 50));
        // 7. Done.
        await runRef.set({
            status: 'completed',
            leaseUntil: null,
            completedAt: firestore_1.FieldValue.serverTimestamp(),
            completedBy: performedBy,
            studentNetCount: studentNet.size,
        }, { merge: true });
        await db.collection('auditLogs').add({
            action: 'TERM_FINANCIAL_ROLLOVER',
            schoolId,
            fromTermId: from.termId,
            toTermId: to.termId,
            rolloverId,
            performedBy,
            totals,
            resumed,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return {
            success: true,
            rolloverId,
            fromTermId: from.termId,
            toTermId: to.termId,
            processedStudents: totals.students,
            totalArrearsCarried: totals.arrearsCarried,
            totalCreditCarried: totals.creditCarried,
            recordsArchived: totals.recordsToArchive,
            resumed,
            alreadyCompleted: false,
        };
    }
    catch (err) {
        // Release the lease so the admin can retry (the frozen plan, if saved, is reused).
        await runRef.set({ leaseUntil: null, lastError: String((err === null || err === void 0 ? void 0 : err.message) || err), lastErrorAt: firestore_1.FieldValue.serverTimestamp() }, { merge: true }).catch(() => undefined);
        throw err;
    }
}
/**
 * After a closed term was unlocked for corrections, re-check its bills and post any difference into the
 * CURRENT term as an adjustment (never by editing the brought-forward bill, which may already be paid).
 * Re-archives the corrected bills. Safe to run more than once.
 */
async function reconcileCorrectedTerm(schoolId, closedTermId, performedBy = 'System') {
    const db = getAdminDb();
    const closed = (0, term_utils_1.stampFromTermId)(closedTermId);
    if (!closed)
        throw new Error(`Unknown term id ${closedTermId}`);
    const snap = await db.collection('financialRecords')
        .where('schoolId', '==', schoolId)
        .where('closedInTermId', '==', closedTermId)
        .get();
    if (snap.empty)
        return { adjustments: 0, netChange: 0 };
    const rolloverId = snap.docs[0].data().rolloverId;
    const runRef = db.collection('termRollovers').doc(`${schoolId}__${rolloverId}`);
    const runSnap = await runRef.get();
    if (!runSnap.exists)
        throw new Error(`Rollover record ${rolloverId} not found.`);
    const run = runSnap.data();
    const { students } = await loadPlan(runRef, run);
    const carried = new Map(students.map(s => [s.studentId, s.net]));
    // Previously posted adjustments for this closed term.
    const adjSnap = await db.collection('financialRecords')
        .where('schoolId', '==', schoolId)
        .where('adjustsRolloverId', '==', rolloverId)
        .get();
    const adjusted = new Map();
    adjSnap.docs.forEach(d => {
        const a = d.data();
        adjusted.set(a.studentId, round2((adjusted.get(a.studentId) || 0) + (Number(a.adjustmentAmount) || 0)));
    });
    // Recompute each student's closed-term net from the (corrected) bills.
    const nowNet = new Map();
    snap.docs.forEach(d => {
        const r = d.data();
        if (r.status === 'Pending Reversal')
            return;
        const sid = String(r.studentId || '');
        if (!sid)
            return;
        const cur = nowNet.get(sid) || { net: 0, name: r.studentName || 'Student', classId: r.classId || '' };
        cur.net = round2(cur.net + balanceOf(r));
        nowNet.set(sid, cur);
    });
    const profile = await readProfile(db, schoolId);
    const current = (0, term_utils_1.currentTermFromProfile)(profile);
    const ops = [];
    const creditStudents = [];
    let adjustments = 0;
    let netChange = 0;
    const stampNow = Date.now();
    nowNet.forEach((v, sid) => {
        const delta = round2(v.net - (carried.get(sid) || 0) - (adjusted.get(sid) || 0));
        if (Math.abs(delta) <= EPS)
            return;
        adjustments++;
        netChange = round2(netChange + delta);
        const ref = db.collection('financialRecords').doc(`adj_${sid}_${rolloverId}_${stampNow}`);
        const base = Object.assign(Object.assign({ id: ref.id, schoolId, studentId: sid, studentName: v.name, classId: v.classId }, (current || {})), { isArchived: false, adjustsRolloverId: rolloverId, adjustmentAmount: delta, createdAt: firestore_1.FieldValue.serverTimestamp(), dueDate: new Date(), createdBy: performedBy });
        if (delta > 0) {
            ops.push(b => b.set(ref, Object.assign(Object.assign({}, base), { type: 'Arrears Adjustment', category: 'Arrears', description: `Correction to ${closed.term} ${closed.academicYear} arrears`, billedAmount: delta, amountPaid: 0, waiverAmount: 0, status: 'Unpaid' })));
        }
        else {
            const credit = round2(-delta);
            ops.push(b => b.set(ref, Object.assign(Object.assign({}, base), { type: 'Credit Adjustment', category: 'Credit', description: `Correction to ${closed.term} ${closed.academicYear} balance (credit)`, billedAmount: 0, amountPaid: credit, waiverAmount: 0, status: 'Paid' })));
            ops.push(b => b.set(ref.collection('payments').doc('ADJ'), Object.assign({ id: 'ADJ', amount: credit, method: 'Credit B/F', isCarryForward: true, status: 'Completed', paidAt: firestore_1.FieldValue.serverTimestamp(), schoolId, studentId: sid, description: 'Credit from correction to a closed term', processedByName: performedBy }, (current ? { termId: current.termId, academicYear: current.academicYear } : {}))));
            creditStudents.push(sid);
        }
    });
    // Re-archive anything un-archived for the correction window.
    snap.docs.forEach(d => {
        if (d.data().isArchived !== true)
            ops.push(b => b.update(d.ref, { isArchived: true, unlockedForCorrection: false }));
    });
    await commitInChunks(db, ops);
    // Credit markers are separate: a studentId on an old record may not be a student doc id.
    await Promise.all(creditStudents.map(sid => db.collection('students').doc(sid).update({ hasAccountCredit: true }).catch(() => undefined)));
    await db.collection('auditLogs').add({
        action: 'TERM_CORRECTION_RECONCILED', schoolId, closedTermId, rolloverId, adjustments, netChange, performedBy,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return { adjustments, netChange };
}
//# sourceMappingURL=financial-rollover.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAcademicTerms = listAcademicTerms;
exports.planAcademicClose = planAcademicClose;
exports.executeAcademicClose = executeAcademicClose;
exports.relockAcademicTerm = relockAcademicTerm;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const term_utils_1 = require("./term-utils");
/**
 * END-OF-TERM ACADEMIC CLOSE (separate from the financial rollover)
 *
 * For one term it:
 *  1. Finds that term's academic records:
 *       - assessments, report-cards, behavioral_records — by their academicYear + term fields;
 *       - attendance — by date, between the term's start and end dates.
 *  2. Writes one attendance summary per student (attendance_summaries/att_summary_{school}_{student}_{term}).
 *  3. Freezes a copy of every report card (term_report_cards/term_report_card_{school}_{student}_{term}).
 *  4. Marks the records archived and read-only for that term (isArchived, closedInTermId). Nothing is deleted.
 *
 * Safety:
 *  - Dry run first (planAcademicClose) — counts per collection, report cards still in Draft, records that
 *    could not be placed in a term.
 *  - Refuses to close the CURRENT term before its end date has passed (teachers would lose their open term).
 *  - Repeatable: archiving and the summary / frozen-copy ids are deterministic.
 *  - One run at a time per school (lease).
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
        const app = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({ projectId, clientEmail, privateKey: privateKeyRaw.replace(/\\n/g, '\n').replace(/"/g, '') }),
        }, 'admin');
        return (0, firestore_1.getFirestore)(app);
    }
    return (0, firestore_1.getFirestore)((0, app_1.initializeApp)());
}
const TERM_FIELD_COLLECTIONS = ['assessments', 'report-cards', 'behavioral_records'];
const BATCH = 400;
const LEASE_MS = 15 * 60 * 1000;
const toMs = (v) => {
    if (!v)
        return 0;
    if (typeof v.toMillis === 'function')
        return v.toMillis();
    if (typeof v._seconds === 'number')
        return v._seconds * 1000;
    if (typeof v.seconds === 'number')
        return v.seconds * 1000;
    const t = new Date(v).getTime();
    return isNaN(t) ? 0 : t;
};
const dayStart = (s) => new Date(`${s}T00:00:00`).getTime();
const dayEnd = (s) => new Date(`${s}T23:59:59.999`).getTime();
async function readProfile(db, schoolId) {
    const [schoolSnap, settingsSnap] = await Promise.all([
        db.collection('schools').doc(schoolId).get(),
        db.collection('schoolSettings').doc(schoolId).get(),
    ]);
    return Object.assign(Object.assign({}, (settingsSnap.data() || {})), (schoolSnap.data() || {}));
}
/** Terms an admin can choose from: the current one and any whose finances were closed. */
async function listAcademicTerms(schoolId) {
    const db = getAdminDb();
    const profile = await readProfile(db, schoolId);
    const current = (0, term_utils_1.currentTermFromProfile)(profile);
    const termsSnap = await db.collection('schoolSettings').doc(schoolId).collection('terms').get();
    const closedAcademic = new Set(profile.academicClosedTermIds || []);
    const options = new Map();
    const today = Date.now();
    termsSnap.docs.forEach(d => {
        const st = (0, term_utils_1.stampFromTermId)(d.id);
        if (!st)
            return;
        const t = d.data();
        options.set(d.id, {
            termId: d.id, label: `${st.term} ${st.academicYear}`, startDate: t.startDate || null, endDate: t.endDate || null,
            isCurrent: false, academicClosed: closedAcademic.has(d.id) || !!t.academicClosedAt, canClose: true,
        });
    });
    if (current) {
        const ended = profile.termEndDate ? dayEnd(profile.termEndDate) < today : false;
        options.set(current.termId, {
            termId: current.termId, label: `${current.term} ${current.academicYear}`,
            startDate: profile.termStartDate || null, endDate: profile.termEndDate || null,
            isCurrent: true, academicClosed: closedAcademic.has(current.termId),
            canClose: ended,
            reason: ended ? undefined : 'This is the current term and its end date (School Profile) has not passed yet.',
        });
    }
    return Array.from(options.values()).sort((a, b) => (a.termId < b.termId ? 1 : -1));
}
async function resolveTerm(db, schoolId, termId) {
    const term = (0, term_utils_1.stampFromTermId)(termId);
    if (!term)
        throw new Error(`Unknown term ${termId}.`);
    const profile = await readProfile(db, schoolId);
    const current = (0, term_utils_1.currentTermFromProfile)(profile);
    const histSnap = await db.collection('schoolSettings').doc(schoolId).collection('terms').doc(termId).get();
    const hist = histSnap.exists ? histSnap.data() : {};
    const isCurrent = (current === null || current === void 0 ? void 0 : current.termId) === termId;
    const startDate = isCurrent ? (profile.termStartDate || null) : (hist.startDate || null);
    const endDate = isCurrent ? (profile.termEndDate || null) : (hist.endDate || null);
    let canClose = true;
    let reason = null;
    if (isCurrent && !(endDate && dayEnd(endDate) < Date.now())) {
        canClose = false;
        reason = 'This is the current term and its end date (School Profile) has not passed yet.';
    }
    return { term, startDate, endDate, isCurrent, canClose, reason, profile };
}
/** Records belonging to the term, per collection. */
async function collectRecords(db, schoolId, term, startDate, endDate) {
    const byCol = {};
    const unplaced = {};
    for (const col of TERM_FIELD_COLLECTIONS) {
        const snap = await db.collection(col).where('schoolId', '==', schoolId).get();
        byCol[col] = [];
        unplaced[col] = 0;
        snap.docs.forEach(d => {
            const r = d.data();
            const st = (0, term_utils_1.termStampOfRecord)(r) || (0, term_utils_1.makeTermStamp)(r.academicYearId || r.year, r.semester);
            if (!st) {
                unplaced[col]++;
                return;
            }
            if (st.termId === term.termId)
                byCol[col].push(d);
        });
    }
    byCol.attendance = [];
    let attendanceSkippedReason = null;
    if (startDate && endDate) {
        const from = dayStart(startDate);
        const to = dayEnd(endDate);
        const seen = new Map();
        const inRange = (d) => {
            const r = d.data();
            const ms = toMs(r.date) || (r.dateStr ? dayStart(r.dateStr) : 0);
            return ms >= from && ms <= to;
        };
        try {
            // Uses the existing (schoolId, date) index: reads only the term's days.
            const snap = await db.collection('attendance')
                .where('schoolId', '==', schoolId)
                .where('date', '>=', new Date(from))
                .where('date', '<=', new Date(to))
                .get();
            snap.docs.forEach(d => seen.set(d.id, d));
        }
        catch (e) {
            console.warn('[academic close] Date-range attendance query failed; scanning all attendance instead:', e);
            const snap = await db.collection('attendance').where('schoolId', '==', schoolId).get();
            snap.docs.filter(inRange).forEach(d => seen.set(d.id, d));
        }
        // Records already closed for this term (e.g. re-lock after a correction window), whatever their date.
        const closedSnap = await db.collection('attendance').where('schoolId', '==', schoolId).where('closedInTermId', '==', term.termId).get();
        closedSnap.docs.forEach(d => seen.set(d.id, d));
        byCol.attendance = Array.from(seen.values());
    }
    else {
        attendanceSkippedReason = 'The term start and end dates are not known, so attendance was not included. Set them in School Profile before closing the current term.';
    }
    return { byCol, unplaced, attendanceSkippedReason };
}
async function planAcademicClose(schoolId, termId) {
    const db = getAdminDb();
    const { term, startDate, endDate, canClose, reason } = await resolveTerm(db, schoolId, termId);
    const { byCol, unplaced, attendanceSkippedReason } = await collectRecords(db, schoolId, term, startDate, endDate);
    const counts = {};
    const alreadyArchived = {};
    Object.entries(byCol).forEach(([col, docs]) => {
        counts[col] = docs.length;
        alreadyArchived[col] = docs.filter(d => d.data().isArchived === true).length;
    });
    const draftReportCards = byCol['report-cards'].filter(d => (d.data().status || 'Draft') === 'Draft').length;
    const studentsWithAttendance = new Set(byCol.attendance.map(d => d.data().studentId).filter(Boolean)).size;
    return {
        schoolId, term, startDate, endDate, counts, alreadyArchived, draftReportCards, studentsWithAttendance,
        attendanceSkippedReason, unplacedRecords: unplaced, canClose, reason,
    };
}
async function commitChunks(db, ops) {
    for (let i = 0; i < ops.length; i += BATCH) {
        const batch = db.batch();
        ops.slice(i, i + BATCH).forEach(fn => fn(batch));
        await batch.commit();
    }
}
async function executeAcademicClose(schoolId, termId, performedBy = 'Admin') {
    const db = getAdminDb();
    const { term, startDate, endDate, canClose, reason } = await resolveTerm(db, schoolId, termId);
    if (!canClose)
        throw new Error(reason || 'This term cannot be closed yet.');
    const lockRef = db.collection('schoolSettings').doc(schoolId).collection('terms').doc(termId);
    const claimed = await db.runTransaction(async (tx) => {
        var _a, _b, _c, _d;
        const snap = await tx.get(lockRef);
        const lease = (_d = (_c = (_b = (_a = snap.data()) === null || _a === void 0 ? void 0 : _a.academicCloseLeaseUntil) === null || _b === void 0 ? void 0 : _b.toMillis) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : 0;
        if (lease > Date.now())
            return false;
        tx.set(lockRef, Object.assign(Object.assign({}, term), { academicCloseLeaseUntil: new Date(Date.now() + LEASE_MS) }), { merge: true });
        return true;
    });
    if (!claimed)
        throw new Error('An academic close for this term is already running. Try again in a few minutes.');
    try {
        const { byCol } = await collectRecords(db, schoolId, term, startDate, endDate);
        const ops = [];
        // 1. Attendance summaries (individual per-student docs only; class-day aggregate docs carry studentsMap).
        const stats = {};
        byCol.attendance.forEach(d => {
            var _a;
            const r = d.data();
            if (r.studentsMap || !r.studentId)
                return;
            const s = (stats[_a = r.studentId] || (stats[_a] = { present: 0, absent: 0, late: 0, excused: 0, total: 0, name: r.studentName || '', classId: r.classId || '' }));
            s.total++;
            if (r.status === 'Present')
                s.present++;
            else if (r.status === 'Absent')
                s.absent++;
            else if (r.status === 'Late')
                s.late++;
            else if (r.status === 'Excused')
                s.excused++;
        });
        Object.entries(stats).forEach(([studentId, s]) => {
            const ref = db.collection('attendance_summaries').doc(`att_summary_${schoolId}_${studentId}_${termId}`);
            const attended = s.present + s.late;
            ops.push(b => b.set(ref, Object.assign(Object.assign({ schoolId, studentId, studentName: s.name, classId: s.classId }, term), { totalPresent: s.present, totalAbsent: s.absent, totalLate: s.late, totalExcused: s.excused, totalDays: s.total, attendanceRate: s.total > 0 ? Math.round((attended / s.total) * 100) : 0, isArchived: true, updatedAt: firestore_1.FieldValue.serverTimestamp() }), { merge: true }));
        });
        // 2. Frozen report cards.
        let frozen = 0;
        byCol['report-cards'].forEach(d => {
            const r = d.data();
            if (!r.studentId)
                return;
            frozen++;
            const ref = db.collection('term_report_cards').doc(`term_report_card_${schoolId}_${r.studentId}_${termId}`);
            ops.push(b => b.set(ref, Object.assign(Object.assign(Object.assign(Object.assign({}, r), { id: ref.id, sourceReportCardId: d.id, schoolId }), term), { isLocked: true, isArchived: true, lockedAt: firestore_1.FieldValue.serverTimestamp(), lockedBy: performedBy }), { merge: true }));
        });
        // 3. Archive the term's raw records (stamp termId so later look-ups are exact).
        const archived = {};
        Object.entries(byCol).forEach(([col, docs]) => {
            archived[col] = 0;
            docs.forEach(d => {
                const r = d.data();
                if (r.isArchived === true && r.closedInTermId === termId)
                    return;
                archived[col]++;
                ops.push(b => b.update(d.ref, Object.assign(Object.assign({ isArchived: true, closedInTermId: termId, termId, archivedAt: firestore_1.FieldValue.serverTimestamp() }, (r.academicYear ? {} : { academicYear: term.academicYear })), (r.term ? {} : { term: term.term }))));
            });
        });
        await commitChunks(db, ops);
        await lockRef.set({
            academicClosedAt: firestore_1.FieldValue.serverTimestamp(), academicClosedBy: performedBy, academicCloseLeaseUntil: null,
            startDate: startDate || null, endDate: endDate || null,
        }, { merge: true });
        await db.collection('schoolSettings').doc(schoolId).set({ academicClosedTermIds: firestore_1.FieldValue.arrayUnion(termId) }, { merge: true });
        await db.collection('auditLogs').add({
            action: 'TERM_ACADEMIC_CLOSE', schoolId, termId, archived, attendanceSummaries: Object.keys(stats).length,
            frozenReportCards: frozen, performedBy, createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        return { success: true, termId, archived, attendanceSummaries: Object.keys(stats).length, frozenReportCards: frozen };
    }
    catch (e) {
        await lockRef.set({ academicCloseLeaseUntil: null }, { merge: true }).catch(() => undefined);
        throw e;
    }
}
/** After a correction window: re-archive the term's records and refresh its summaries and frozen copies. */
async function relockAcademicTerm(schoolId, termId, performedBy = 'Auto re-lock') {
    const db = getAdminDb();
    const profile = await readProfile(db, schoolId);
    if (!(profile.academicClosedTermIds || []).includes(termId))
        return null; // never academically closed
    const histSnap = await db.collection('schoolSettings').doc(schoolId).collection('terms').doc(termId).get();
    if (!histSnap.exists)
        return null;
    return executeAcademicClose(schoolId, termId, performedBy);
}
//# sourceMappingURL=academic-rollover.js.map
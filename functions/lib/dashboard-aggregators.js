"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onBehavioralWrite = exports.onAdmissionWrite = exports.onStaffAttendanceWrite = exports.onFinancialRecordWrite = exports.onAttendanceWrite = exports.onStudentWrite = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
/** Reference to the summary doc for a school */
const SUMMARY = (schoolId) => db.collection('dashboard_summaries').doc(schoolId);
/** "YYYY-MM-DD" for today on the server */
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}
/** Epoch ms for start of today */
function todayStartMs() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
// ── TRIGGER 1: Students ────────────────────────────────────────────────────────
exports.onStudentWrite = (0, firestore_1.onDocumentWritten)('students/{studentId}', async (event) => {
    var _a, _b, _c, _d, _e;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    const wasActive = !!(before && (before.enrollmentStatus === 'Active' || !before.enrollmentStatus));
    const isActive = !!(after && (after.enrollmentStatus === 'Active' || !after.enrollmentStatus));
    const wasWithdrawn = (before === null || before === void 0 ? void 0 : before.enrollmentStatus) === 'Withdrawn';
    const isWithdrawn = (after === null || after === void 0 ? void 0 : after.enrollmentStatus) === 'Withdrawn';
    let totalDelta = 0, activeDelta = 0, withdrawnDelta = 0;
    if (!before && after) {
        totalDelta = 1;
        activeDelta = isActive ? 1 : 0;
        withdrawnDelta = isWithdrawn ? 1 : 0;
    }
    else if (before && !after) {
        totalDelta = -1;
        activeDelta = wasActive ? -1 : 0;
        withdrawnDelta = wasWithdrawn ? -1 : 0;
    }
    else {
        activeDelta = (isActive ? 1 : 0) - (wasActive ? 1 : 0);
        withdrawnDelta = (isWithdrawn ? 1 : 0) - (wasWithdrawn ? 1 : 0);
    }
    if (totalDelta === 0 && activeDelta === 0 && withdrawnDelta === 0)
        return;
    await SUMMARY(schoolId).set({
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        'studentCount.total': firestore_2.FieldValue.increment(totalDelta),
        'studentCount.active': firestore_2.FieldValue.increment(activeDelta),
        'studentCount.withdrawn': firestore_2.FieldValue.increment(withdrawnDelta),
    }, { merge: true });
});
// ── TRIGGER 2: Student Attendance ─────────────────────────────────────────────
exports.onAttendanceWrite = (0, firestore_1.onDocumentWritten)('attendance/{recordId}', async (event) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    const dateStr = (_g = (_f = after === null || after === void 0 ? void 0 : after.date) !== null && _f !== void 0 ? _f : before === null || before === void 0 ? void 0 : before.date) !== null && _g !== void 0 ? _g : '';
    if (dateStr !== todayStr())
        return;
    const snap = await db.collection('attendance')
        .where('schoolId', '==', schoolId)
        .where('date', '==', dateStr)
        .get();
    let present = 0, absent = 0, late = 0;
    const absentIds = [];
    snap.forEach(doc => {
        const d = doc.data();
        if (d.status === 'Present')
            present++;
        else if (d.status === 'Absent') {
            absent++;
            if (absentIds.length < 25)
                absentIds.push(d.studentId);
        }
        else if (d.status === 'Late')
            late++;
    });
    const total = present + absent + late;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    await SUMMARY(schoolId).set({
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        attendance: { date: dateStr, totalPresent: present, totalAbsent: absent, totalLate: late, attendanceRate: rate, absentStudentIds: absentIds },
    }, { merge: true });
});
// ── TRIGGER 3: Financial Records ──────────────────────────────────────────────
exports.onFinancialRecordWrite = (0, firestore_1.onDocumentWritten)('financialRecords/{recordId}', async (event) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    if (!(after === null || after === void 0 ? void 0 : after.schoolId))
        return;
    const schoolId = after.schoolId;
    const balBefore = Number((_f = (_e = before === null || before === void 0 ? void 0 : before.outstandingBalance) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.balance) !== null && _f !== void 0 ? _f : 0);
    const balAfter = Number((_h = (_g = after.outstandingBalance) !== null && _g !== void 0 ? _g : after.balance) !== null && _h !== void 0 ? _h : 0);
    const balDelta = balAfter - balBefore;
    const paidAt = after.paidAt;
    const paidAtMs = (_k = (_j = paidAt === null || paidAt === void 0 ? void 0 : paidAt.toMillis) === null || _j === void 0 ? void 0 : _j.call(paidAt)) !== null && _k !== void 0 ? _k : 0;
    const isPaidToday = paidAtMs >= todayStartMs();
    const amountDelta = Number((_l = after.amountPaid) !== null && _l !== void 0 ? _l : 0) - Number((_m = before === null || before === void 0 ? void 0 : before.amountPaid) !== null && _m !== void 0 ? _m : 0);
    const wasInArrears = (Number((_o = before === null || before === void 0 ? void 0 : before.outstandingBalance) !== null && _o !== void 0 ? _o : 0)) > 0;
    const isInArrears = balAfter > 0;
    const arrearsDelta = (isInArrears ? 1 : 0) - (wasInArrears ? 1 : 0);
    const update = {
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        'financials.totalOutstanding': firestore_2.FieldValue.increment(balDelta),
        'financials.arrearsCount': firestore_2.FieldValue.increment(arrearsDelta),
    };
    if (isPaidToday && amountDelta > 0) {
        update['financials.totalCollectedToday'] = firestore_2.FieldValue.increment(amountDelta);
        update['financials.totalCollectedThisMonth'] = firestore_2.FieldValue.increment(amountDelta);
        update['financials.totalCollectedThisTerm'] = firestore_2.FieldValue.increment(amountDelta);
        update['financials.lastPaymentAmount'] = amountDelta;
        update['financials.lastPaymentAt'] = firestore_2.Timestamp.now();
    }
    await SUMMARY(schoolId).set(update, { merge: true });
});
// ── TRIGGER 4: Staff Attendance ───────────────────────────────────────────────
exports.onStaffAttendanceWrite = (0, firestore_1.onDocumentWritten)('staff_attendance/{recordId}', async (event) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    const ts = after === null || after === void 0 ? void 0 : after.timestamp;
    const tsMs = (_g = (_f = ts === null || ts === void 0 ? void 0 : ts.toMillis) === null || _f === void 0 ? void 0 : _f.call(ts)) !== null && _g !== void 0 ? _g : 0;
    if (tsMs < todayStartMs())
        return;
    const snap = await db.collection('staff_attendance')
        .where('schoolId', '==', schoolId)
        .where('type', '==', 'In')
        .get();
    const todayMs = todayStartMs();
    const presentSet = new Set();
    let lateCount = 0;
    snap.forEach(doc => {
        var _a, _b;
        const d = doc.data();
        const docTs = d.timestamp;
        const ms = (_b = (_a = docTs === null || docTs === void 0 ? void 0 : docTs.toMillis) === null || _a === void 0 ? void 0 : _a.call(docTs)) !== null && _b !== void 0 ? _b : 0;
        if (ms >= todayMs) {
            presentSet.add(d.staffId);
            if (d.status === 'Late')
                lateCount++;
        }
    });
    await SUMMARY(schoolId).set({
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        'staff.presentToday': presentSet.size,
        'staff.lateToday': lateCount,
    }, { merge: true });
});
// ── TRIGGER 5: Admissions ─────────────────────────────────────────────────────
exports.onAdmissionWrite = (0, firestore_1.onDocumentWritten)('admissionApplications/{appId}', async (event) => {
    var _a, _b, _c, _d, _e;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    const wasPending = (before === null || before === void 0 ? void 0 : before.status) === 'Pending Review';
    const isPending = (after === null || after === void 0 ? void 0 : after.status) === 'Pending Review';
    const wasAdmitted = (before === null || before === void 0 ? void 0 : before.status) === 'Admitted';
    const isAdmitted = (after === null || after === void 0 ? void 0 : after.status) === 'Admitted';
    const pendingDelta = (isPending ? 1 : 0) - (wasPending ? 1 : 0);
    const admittedDelta = (isAdmitted ? 1 : 0) - (wasAdmitted ? 1 : 0);
    if (pendingDelta === 0 && admittedDelta === 0)
        return;
    await SUMMARY(schoolId).set({
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        'admissions.pendingCount': firestore_2.FieldValue.increment(pendingDelta),
        'admissions.approvedThisMonth': firestore_2.FieldValue.increment(admittedDelta),
    }, { merge: true });
});
// ── TRIGGER 6: Behavioral Records ────────────────────────────────────────────
exports.onBehavioralWrite = (0, firestore_1.onDocumentWritten)('behavioral_records/{recordId}', async (event) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const dateTs = after === null || after === void 0 ? void 0 : after.date;
    const createdMs = (_g = (_f = dateTs === null || dateTs === void 0 ? void 0 : dateTs.toMillis) === null || _f === void 0 ? void 0 : _f.call(dateTs)) !== null && _g !== void 0 ? _g : 0;
    if (createdMs < weekAgoMs)
        return;
    const wasInfraction = (before === null || before === void 0 ? void 0 : before.incidentType) === 'Infraction';
    const isInfraction = (after === null || after === void 0 ? void 0 : after.incidentType) === 'Infraction';
    const wasPositive = (before === null || before === void 0 ? void 0 : before.incidentType) === 'Positive Behavior';
    const isPositive = (after === null || after === void 0 ? void 0 : after.incidentType) === 'Positive Behavior';
    let infDelta = 0, posDelta = 0;
    if (!before && after) {
        infDelta = isInfraction ? 1 : 0;
        posDelta = isPositive ? 1 : 0;
    }
    else if (before && !after) {
        infDelta = wasInfraction ? -1 : 0;
        posDelta = wasPositive ? -1 : 0;
    }
    else {
        infDelta = (isInfraction ? 1 : 0) - (wasInfraction ? 1 : 0);
        posDelta = (isPositive ? 1 : 0) - (wasPositive ? 1 : 0);
    }
    if (infDelta === 0 && posDelta === 0)
        return;
    await SUMMARY(schoolId).set({
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        'behavioral.incidentsThisWeek': firestore_2.FieldValue.increment(infDelta),
        'behavioral.positiveThisWeek': firestore_2.FieldValue.increment(posDelta),
    }, { merge: true });
});
//# sourceMappingURL=dashboard-aggregators.js.map
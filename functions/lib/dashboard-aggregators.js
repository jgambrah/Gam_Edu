"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onParentWrite = exports.onBehavioralWrite = exports.onAdmissionWrite = exports.onStaffAttendanceWrite = exports.onPaymentSubcollectionWrite = exports.onFinancialRecordWrite = exports.onAttendanceWrite = exports.onStudentWrite = void 0;
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
/** Robust helper to get YYYY-MM-DD from Timestamp, Date, or string */
function getYYYYMMDD(val) {
    if (!val)
        return '';
    let d;
    if (typeof val.toDate === 'function') {
        d = val.toDate();
    }
    else if (val instanceof Date) {
        d = val;
    }
    else {
        d = new Date(val);
    }
    if (isNaN(d.getTime()))
        return '';
    return d.toISOString().slice(0, 10);
}
/** Helper to recalculate financial metrics for a school considering active students */
async function recalculateSchoolFinancials(schoolId) {
    // Fetch active students first
    const studentsSnap = await db.collection('students')
        .where('schoolId', '==', schoolId)
        .get();
    const activeStudentIds = new Set();
    studentsSnap.forEach(sDoc => {
        const s = sDoc.data();
        if (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) {
            activeStudentIds.add(sDoc.id);
        }
    });
    // Fetch all financial records for this school to calculate full, accurate aggregates
    const snap = await db.collection('financialRecords')
        .where('schoolId', '==', schoolId)
        .get();
    // Fetch all payments for this school via collectionGroup to calculate collections today/this month
    const paymentsSnap = await db.collectionGroup('payments')
        .where('schoolId', '==', schoolId)
        .get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let totalBilled = 0;
    let totalRevenue = 0;
    let totalOutstanding = 0;
    let arrearsCount = 0;
    let current = 0;
    let age30 = 0;
    let age60 = 0;
    let age90 = 0;
    let overpayments = 0;
    let totalCollectedToday = 0;
    let totalCollectedThisMonth = 0;
    let totalCollectedThisTerm = 0;
    let lastPaymentAmount = 0;
    let lastPaymentAt = null;
    const todayMs = todayStartMs();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthMs = monthStart.getTime();
    // 1. Process parent financial records (billing, arrears, and debt aging)
    snap.forEach(doc => {
        var _a, _b, _c, _d, _e, _f;
        const r = doc.data();
        if (r.status === 'Pending Reversal')
            return;
        if (!activeStudentIds.has(r.studentId))
            return;
        const billed = Number((_b = (_a = r.billedAmount) !== null && _a !== void 0 ? _a : r.amount) !== null && _b !== void 0 ? _b : 0);
        const paid = Number((_c = r.amountPaid) !== null && _c !== void 0 ? _c : 0);
        const waiver = Number((_d = r.waiverAmount) !== null && _d !== void 0 ? _d : 0);
        const balance = billed - paid - waiver;
        totalBilled += billed;
        totalRevenue += paid;
        if (balance < 0) {
            overpayments += Math.abs(balance);
            return;
        }
        if (balance <= 0.01)
            return;
        totalOutstanding += balance;
        arrearsCount++;
        // Debt aging buckets
        const dueTs = r.dueDate;
        const dueMs = (_f = (_e = dueTs === null || dueTs === void 0 ? void 0 : dueTs.toMillis) === null || _e === void 0 ? void 0 : _e.call(dueTs)) !== null && _f !== void 0 ? _f : (r.dueDate ? new Date(r.dueDate).getTime() : todayMs);
        const diffTime = today.getTime() - dueMs;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) {
            current += balance;
        }
        else if (diffDays <= 30) {
            age30 += balance;
        }
        else if (diffDays <= 60) {
            age60 += balance;
        }
        else {
            age90 += balance;
        }
    });
    // 2. Process payments for actual collection sums (today, this month, this term)
    paymentsSnap.forEach(pDoc => {
        var _a, _b;
        const p = pDoc.data();
        if (p.studentId && !activeStudentIds.has(p.studentId))
            return;
        const amount = Number(p.amount) || 0;
        if (amount <= 0)
            return;
        const dateVal = p.paidAt || p.createdAt || p.date;
        if (!dateVal)
            return;
        const pTs = dateVal;
        const pMs = (_b = (_a = pTs.toMillis) === null || _a === void 0 ? void 0 : _a.call(pTs)) !== null && _b !== void 0 ? _b : (dateVal ? new Date(dateVal).getTime() : 0);
        if (pMs >= todayMs) {
            totalCollectedToday += amount;
            if (amount > lastPaymentAmount) {
                lastPaymentAmount = amount;
                lastPaymentAt = pTs;
            }
        }
        if (pMs >= monthMs) {
            totalCollectedThisMonth += amount;
        }
    });
    totalCollectedThisTerm = totalCollectedThisMonth;
    const collectionRate = (totalRevenue + totalOutstanding) > 0
        ? Math.round((totalRevenue / (totalRevenue + totalOutstanding)) * 100)
        : 0;
    await SUMMARY(schoolId).set({
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        financials: {
            totalCollectedToday,
            totalCollectedThisMonth,
            totalCollectedThisTerm,
            totalOutstanding,
            totalBilled,
            totalRevenue,
            collectionRate,
            arrearsCount,
            lastPaymentAmount,
            lastPaymentAt,
        },
        debtAging: {
            current,
            age30,
            age60,
            age90,
            overpayments,
        }
    }, { merge: true });
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
    if (activeDelta !== 0) {
        await recalculateSchoolFinancials(schoolId);
    }
});
// ── TRIGGER 2: Student Attendance ─────────────────────────────────────────────
exports.onAttendanceWrite = (0, firestore_1.onDocumentWritten)('attendance/{recordId}', async (event) => {
    var _a, _b, _c, _d, _e, _f;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    const dateVal = (_f = after === null || after === void 0 ? void 0 : after.date) !== null && _f !== void 0 ? _f : before === null || before === void 0 ? void 0 : before.date;
    const dateStr = getYYYYMMDD(dateVal);
    if (!dateStr || dateStr !== todayStr())
        return;
    // Convert dateStr (e.g. "2026-07-13") to the exact Timestamp object to query Firestore
    const startOfToday = new Date(dateStr + 'T00:00:00.000Z');
    const todayTimestamp = firestore_2.Timestamp.fromDate(startOfToday);
    const snap = await db.collection('attendance')
        .where('schoolId', '==', schoolId)
        .where('date', '==', todayTimestamp)
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
    var _a, _b, _c, _d, _e;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    await recalculateSchoolFinancials(schoolId);
});
// ── TRIGGER 3.5: Payments Subcollection ─────────────────────────────────────────
exports.onPaymentSubcollectionWrite = (0, firestore_1.onDocumentWritten)('financialRecords/{recordId}/payments/{paymentId}', async (event) => {
    var _a, _b, _c, _d, _e;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    await recalculateSchoolFinancials(schoolId);
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
// ── TRIGGER 7: Parents ─────────────────────────────────────────────────────────
exports.onParentWrite = (0, firestore_1.onDocumentWritten)('parents/{parentId}', async (event) => {
    var _a, _b, _c, _d, _e;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    let delta = 0;
    if (!before && after) {
        delta = 1;
    }
    else if (before && !after) {
        delta = -1;
    }
    if (delta === 0)
        return;
    await SUMMARY(schoolId).set({
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        parentCount: firestore_2.FieldValue.increment(delta),
    }, { merge: true });
});
//# sourceMappingURL=dashboard-aggregators.js.map
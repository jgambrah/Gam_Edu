"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onParentWrite = exports.onBehavioralWrite = exports.onAdmissionWrite = exports.onStaffAttendanceWrite = exports.onPaymentSubcollectionWrite = exports.onFinancialRecordWrite = exports.onAttendanceWrite = exports.onStudentWrite = void 0;
exports.summarizeTermAttendance = summarizeTermAttendance;
exports.lockTermReportCards = lockTermReportCards;
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
    d.setUTCHours(0, 0, 0, 0);
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
function classifyCategory(item) {
    if (!item)
        return 'tuition';
    const text = `${item.type || ''} ${item.category || ''} ${item.description || ''} ${item.feeType || ''} ${item.notes || ''} ${item.name || ''} ${item.title || ''} ${item.paymentType || ''} ${item.narration || ''} ${item.paymentNarration || ''} ${item.item || ''}`.toLowerCase();
    if (text.includes('canteen') || text.includes('feed') || text.includes('lunch') || text.includes('meal') || text.includes('food') || text.includes('cafeteria')) {
        return 'canteen';
    }
    if (text.includes('bus') || text.includes('transport') || text.includes('fare') || text.includes('shuttle') || text.includes('transit') || text.includes('vehicle')) {
        return 'transport';
    }
    if (text.includes('boarding') || text.includes('hostel') || text.includes('dorm') || text.includes('accommodation')) {
        return 'boarding';
    }
    if (text.includes('uniform') || text.includes('book') || text.includes('textbook') || text.includes('stationery') || text.includes('crest') || text.includes('jersey') || text.includes('exercise')) {
        return 'uniforms';
    }
    if (text.includes('rent') || text.includes('hire') || text.includes('fine') || text.includes('penalty') || text.includes('transcript') || text.includes('certificate')) {
        return 'other';
    }
    return 'tuition';
}
/** Helper to recalculate financial metrics for a school considering active students */
async function recalculateSchoolFinancials(schoolId, eventTermId) {
    // Fetch active students first (excluding archived students)
    let studentsQuery = db.collection('students')
        .where('schoolId', '==', schoolId)
        .where('isArchived', '!=', true);
    const studentsSnap = await studentsQuery.get();
    const activeStudentIds = new Set();
    studentsSnap.forEach(sDoc => {
        const s = sDoc.data();
        if (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) {
            activeStudentIds.add(sDoc.id);
        }
    });
    // Build scoped query for active financial records
    let recordsQuery = db.collection('financialRecords')
        .where('schoolId', '==', schoolId)
        .where('isArchived', '!=', true);
    if (eventTermId) {
        recordsQuery = recordsQuery.where('termId', '==', eventTermId);
    }
    const snap = await recordsQuery.get();
    // Build scoped query for active payments via collectionGroup
    let paymentsQuery = db.collectionGroup('payments')
        .where('schoolId', '==', schoolId)
        .where('isArchived', '!=', true);
    if (eventTermId) {
        paymentsQuery = paymentsQuery.where('termId', '==', eventTermId);
    }
    const paymentsSnap = await paymentsQuery.get();
    let tillsTransactionsSnap;
    try {
        tillsTransactionsSnap = await db.collectionGroup('transactions').where('schoolId', '==', schoolId).get();
    }
    catch (e) {
        tillsTransactionsSnap = { docs: [] };
    }
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
    const currentAccounts = new Set();
    const age30Accounts = new Set();
    const age60Accounts = new Set();
    const age90Accounts = new Set();
    let totalCollectedToday = 0;
    let totalCollectedThisMonth = 0;
    let totalCollectedThisTerm = 0;
    let lastPaymentAmount = 0;
    let lastPaymentAt = null;
    let tuitionStream = 0;
    let canteenStream = 0;
    let transportStream = 0;
    let boardingStream = 0;
    let uniformsStream = 0;
    let otherStream = 0;
    let outstandingTuition = 0;
    let outstandingCanteen = 0;
    let outstandingTransport = 0;
    let otherDebt = 0;
    const categoryMap = {
        'Tuition': { billed: 0, paid: 0, waived: 0 },
        'Canteen': { billed: 0, paid: 0, waived: 0 },
        'Transport': { billed: 0, paid: 0, waived: 0 },
        'PTA Levy': { billed: 0, paid: 0, waived: 0 },
        'Other': { billed: 0, paid: 0, waived: 0 },
    };
    const todayMs = todayStartMs();
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const monthMs = monthStart.getTime();
    // 1. Process parent financial records (billing, arrears, and debt aging)
    snap.forEach(doc => {
        var _a, _b, _c, _d, _e, _f;
        const r = doc.data();
        if (r.status === 'Pending Reversal')
            return;
        if (r.studentId && !activeStudentIds.has(r.studentId) && activeStudentIds.size > 0)
            return;
        const billed = Number((_b = (_a = r.billedAmount) !== null && _a !== void 0 ? _a : r.amount) !== null && _b !== void 0 ? _b : 0);
        const paid = Number((_c = r.amountPaid) !== null && _c !== void 0 ? _c : 0);
        const waiver = Number((_d = r.waiverAmount) !== null && _d !== void 0 ? _d : 0);
        const balance = billed - paid - waiver;
        totalBilled += billed;
        const typeLower = (r.type || r.category || '').toLowerCase();
        let catKey = 'Other';
        if (typeLower.includes('tuition'))
            catKey = 'Tuition';
        else if (typeLower.includes('canteen'))
            catKey = 'Canteen';
        else if (typeLower.includes('transport'))
            catKey = 'Transport';
        else if (typeLower.includes('pta'))
            catKey = 'PTA Levy';
        if (categoryMap[catKey]) {
            categoryMap[catKey].billed += billed;
            categoryMap[catKey].paid += paid;
            categoryMap[catKey].waived += waiver;
        }
        if (balance < 0) {
            overpayments += Math.abs(balance);
            return;
        }
        if (balance <= 0.01)
            return;
        totalOutstanding += balance;
        arrearsCount++;
        if (typeLower.includes('tuition'))
            outstandingTuition += balance;
        else if (typeLower.includes('canteen'))
            outstandingCanteen += balance;
        else if (typeLower.includes('transport'))
            outstandingTransport += balance;
        else
            otherDebt += balance;
        // Debt aging buckets
        const dueTs = r.dueDate;
        const dueMs = (_f = (_e = dueTs === null || dueTs === void 0 ? void 0 : dueTs.toMillis) === null || _e === void 0 ? void 0 : _e.call(dueTs)) !== null && _f !== void 0 ? _f : (r.dueDate ? new Date(r.dueDate).getTime() : todayMs);
        const diffTime = today.getTime() - dueMs;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const accountId = String(r.studentId || r.studentUid || r.accountId || r.studentName || '').trim();
        if (diffDays <= 0) {
            current += balance;
            if (accountId)
                currentAccounts.add(accountId);
        }
        else if (diffDays <= 30) {
            age30 += balance;
            if (accountId)
                age30Accounts.add(accountId);
        }
        else if (diffDays <= 60) {
            age60 += balance;
            if (accountId)
                age60Accounts.add(accountId);
        }
        else {
            age90 += balance;
            if (accountId)
                age90Accounts.add(accountId);
        }
    });
    const processedKeys = new Set();
    const processItem = (p, docId) => {
        var _a, _b;
        if (!p)
            return;
        if (p.status === 'Reversed' || p.status === 'Cancelled' || p.status === 'Pending Reversal')
            return;
        const amount = Number(p.amount) || Number(p.amountPaid) || Number(p.totalAmount) || 0;
        if (amount <= 0)
            return;
        const refNo = p.referenceNo || p.reference_no || p.transactionId || p.receiptNo || docId;
        if (processedKeys.has(refNo))
            return;
        processedKeys.add(refNo);
        const dateVal = p.paidAt || p.createdAt || p.date || p.timestamp;
        let pMs = 0;
        if (dateVal) {
            const pTs = dateVal;
            pMs = (_b = (_a = pTs.toMillis) === null || _a === void 0 ? void 0 : _a.call(pTs)) !== null && _b !== void 0 ? _b : new Date(dateVal).getTime();
            if (pMs >= todayMs && amount > lastPaymentAmount) {
                lastPaymentAmount = amount;
                lastPaymentAt = pTs;
            }
        }
        totalRevenue += amount;
        if (pMs >= todayMs)
            totalCollectedToday += amount;
        if (pMs >= monthMs)
            totalCollectedThisMonth += amount;
        totalCollectedThisTerm += amount;
        const cat = classifyCategory(p);
        if (cat === 'tuition')
            tuitionStream += amount;
        else if (cat === 'canteen')
            canteenStream += amount;
        else if (cat === 'transport')
            transportStream += amount;
        else if (cat === 'boarding')
            boardingStream += amount;
        else if (cat === 'uniforms')
            uniformsStream += amount;
        else
            otherStream += amount;
    };
    // 2. Process payments for actual collection sums & category streams
    if (paymentsSnap.docs) {
        paymentsSnap.docs.forEach((pDoc) => processItem(pDoc.data(), pDoc.id));
    }
    if (tillsTransactionsSnap.docs) {
        tillsTransactionsSnap.docs.forEach((tDoc) => processItem(tDoc.data(), tDoc.id));
    }
    snap.forEach(doc => {
        const r = doc.data();
        if (r.payments && Array.isArray(r.payments) && r.payments.length > 0) {
            r.payments.forEach((p) => processItem(p, p.id || doc.id));
        }
        else if (r.amountPaid && Number(r.amountPaid) > 0) {
            processItem({
                amount: Number(r.amountPaid),
                paidAt: r.lastPaymentDate || r.createdAt || r.date,
                type: r.type || r.category || 'Tuition',
                description: r.description
            }, `record-${doc.id}`);
        }
    });
    const collectionRate = totalBilled > 0
        ? Math.round((totalRevenue / totalBilled) * 100)
        : 0;
    await SUMMARY(schoolId).set({
        schoolId,
        lastUpdated: firestore_2.FieldValue.serverTimestamp(),
        financials: {
            totalCollectedToday,
            totalCollectedThisMonth,
            totalCollectedThisTerm: totalRevenue,
            totalCollectedThisYear: totalRevenue,
            totalOutstanding,
            totalBilled,
            totalRevenue,
            collectionRate,
            arrearsCount,
            lastPaymentAmount,
            lastPaymentAt,
            streamBreakdown: {
                tuition: tuitionStream,
                canteen: canteenStream,
                transport: transportStream,
                auxiliary: boardingStream + uniformsStream + otherStream
            },
            streamDebts: {
                tuition: outstandingTuition,
                canteen: outstandingCanteen,
                transport: outstandingTransport,
                other: otherDebt,
            },
            categoryCollections: Object.entries(categoryMap).map(([name, catStats]) => {
                const netBilled = catStats.billed - catStats.waived;
                const rate = netBilled > 0 ? (catStats.paid / netBilled) * 100 : 100;
                return {
                    name,
                    billed: catStats.billed,
                    paid: catStats.paid,
                    waived: catStats.waived,
                    outstanding: Math.max(0, netBilled - catStats.paid),
                    rate,
                };
            }),
        },
        debtAging: {
            current,
            age30,
            age60,
            age90,
            overpayments,
            accountCounts: {
                current: currentAccounts.size,
                age30: age30Accounts.size,
                lessThan30: new Set([...currentAccounts, ...age30Accounts]).size,
                age60: age60Accounts.size,
                age90: age90Accounts.size,
                over90: 0,
                totalOverdue: new Set([...age30Accounts, ...age60Accounts, ...age90Accounts]).size,
                overdue60Plus: new Set([...age60Accounts, ...age90Accounts]).size,
            }
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
    // COST GUARD: Only process class-level aggregated attendance documents (${schoolId}_${classId}_${dateStr})
    // Skip individual student attendance records (prefixed with 'att-') which otherwise cause an O(N^2) read cascade!
    const recordId = event.params.recordId;
    if (recordId && recordId.startsWith('att-')) {
        return;
    }
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
        if (doc.id.startsWith('att-'))
            return;
        const d = doc.data();
        if (typeof d.presentCount === 'number') {
            present += d.presentCount;
            absent += (d.absentCount || 0);
            late += (d.lateCount || 0);
            if (d.studentsMap && typeof d.studentsMap === 'object') {
                Object.values(d.studentsMap).forEach((s) => {
                    if (s.status === 'Absent' && absentIds.length < 25) {
                        absentIds.push(s.studentId);
                    }
                });
            }
        }
        else {
            if (d.status === 'Present')
                present++;
            else if (d.status === 'Absent') {
                absent++;
                if (absentIds.length < 25)
                    absentIds.push(d.studentId);
            }
            else if (d.status === 'Late')
                late++;
        }
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
    var _a, _b, _c, _d, _e, _f;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    const termId = (_f = after === null || after === void 0 ? void 0 : after.termId) !== null && _f !== void 0 ? _f : before === null || before === void 0 ? void 0 : before.termId;
    await recalculateSchoolFinancials(schoolId, termId);
});
// ── TRIGGER 3.5: Payments Subcollection ─────────────────────────────────────────
exports.onPaymentSubcollectionWrite = (0, firestore_1.onDocumentWritten)('financialRecords/{recordId}/payments/{paymentId}', async (event) => {
    var _a, _b, _c, _d, _e, _f;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    const before = (_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.before) === null || _d === void 0 ? void 0 : _d.data();
    const schoolId = (_e = after === null || after === void 0 ? void 0 : after.schoolId) !== null && _e !== void 0 ? _e : before === null || before === void 0 ? void 0 : before.schoolId;
    if (!schoolId)
        return;
    const termId = (_f = after === null || after === void 0 ? void 0 : after.termId) !== null && _f !== void 0 ? _f : before === null || before === void 0 ? void 0 : before.termId;
    await recalculateSchoolFinancials(schoolId, termId);
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
    const todayMs = todayStartMs();
    const todayTimestamp = firestore_2.Timestamp.fromMillis(todayMs);
    // COST GUARD: Filter by timestamp >= todayTimestamp in Firestore directly (avoids reading historical clock-ins)
    const snap = await db.collection('staff_attendance')
        .where('schoolId', '==', schoolId)
        .where('type', '==', 'In')
        .where('timestamp', '>=', todayTimestamp)
        .get();
    const presentSet = new Set();
    let lateCount = 0;
    snap.forEach(doc => {
        const d = doc.data();
        presentSet.add(d.staffId);
        if (d.status === 'Late')
            lateCount++;
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
// ── PHASE 2: ATTENDANCE SUMMARIZATION ENGINE ─────────────────────────────────
async function summarizeTermAttendance(schoolId, termId) {
    const snap = await db.collection('attendance')
        .where('schoolId', '==', schoolId)
        .where('termId', '==', termId)
        .get();
    const studentStats = {};
    const batch = db.batch();
    snap.forEach(d => {
        const data = d.data();
        const studentId = data.studentId;
        if (!studentId)
            return;
        if (!studentStats[studentId]) {
            studentStats[studentId] = { present: 0, absent: 0, late: 0, total: 0 };
        }
        studentStats[studentId].total++;
        if (data.status === 'Present')
            studentStats[studentId].present++;
        else if (data.status === 'Absent')
            studentStats[studentId].absent++;
        else if (data.status === 'Late')
            studentStats[studentId].late++;
        // Mark raw daily attendance doc as archived (idempotent)
        batch.update(d.ref, { isArchived: true });
    });
    // Write deterministic summary doc per student: att_summary_${schoolId}_${studentId}_${termId}
    for (const [studentId, stats] of Object.entries(studentStats)) {
        const docId = `att_summary_${schoolId}_${studentId}_${termId}`;
        const rate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
        const summaryRef = db.collection('attendance_summaries').doc(docId);
        batch.set(summaryRef, {
            schoolId,
            studentId,
            termId,
            totalPresent: stats.present,
            totalAbsent: stats.absent,
            totalLate: stats.late,
            totalDays: stats.total,
            attendanceRate: rate,
            isArchived: true,
            updatedAt: firestore_2.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    await batch.commit();
}
// ── PHASE 2: ACADEMIC REPORT CARD & GRADEBOOK LOCKING ────────────────────────
async function lockTermReportCards(schoolId, termId) {
    const reportsSnap = await db.collection('report-cards')
        .where('schoolId', '==', schoolId)
        .where('termId', '==', termId)
        .get();
    const batch = db.batch();
    reportsSnap.forEach(docSnap => {
        const data = docSnap.data();
        const studentId = data.studentId;
        if (!studentId)
            return;
        // Deterministic frozen summary doc ID: term_report_card_${schoolId}_${studentId}_${termId}
        const docId = `term_report_card_${schoolId}_${studentId}_${termId}`;
        const lockedRef = db.collection('term_report_cards').doc(docId);
        batch.set(lockedRef, Object.assign(Object.assign({}, data), { id: docId, schoolId,
            studentId,
            termId, isLocked: true, isArchived: true, lockedAt: firestore_2.FieldValue.serverTimestamp() }), { merge: true });
        batch.update(docSnap.ref, { isArchived: true });
    });
    const assessmentsSnap = await db.collection('assessments')
        .where('schoolId', '==', schoolId)
        .where('termId', '==', termId)
        .get();
    assessmentsSnap.forEach(aDoc => {
        batch.update(aDoc.ref, { isArchived: true });
    });
    await batch.commit();
}
//# sourceMappingURL=dashboard-aggregators.js.map
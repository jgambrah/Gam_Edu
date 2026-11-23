"use strict";
/**
 * Durable server-side daily canteen & transport billing.
 *
 * PARITY NOTICE:
 *   Keep billing predicates, deterministic bill IDs, rate resolution, and voided-bill restoration
 *   in sync with:
 *     - src/lib/billing-predicates.ts
 *     - src/lib/billing.ts
 *     - src/lib/billing-server.ts
 *   Term stamping shares `currentTermFromProfile` directly via `./term-utils` (re-exported by `src/lib/term.ts`).
 *   Verified by src/lib/daily-billing.parity.test.ts.
 *
 * Firestore database location: `nam5` (verified via `firebase firestore:databases:get "(default)"`).
 * Function region: `us-central1` (co-located with `nam5` and matching all existing v2 functions).
 *
 * Read estimates per school (Mercy's Springfield: ~11 classes, ~300 present students, ~20 absent):
 *   - onAttendanceWrittenBill (per class save, ~30 present):
 *       Waits 20s so the client fast-path (~1-2s) normally wins, then reads:
 *       1 schoolSettings + 1 canteen rates + ~5 routes + 1 school/term + ~30 students (getAll)
 *       + ~60 deterministic bill IDs (getAll) ≈ ~98 reads/class (~1,080 reads/day across 11 classes).
 *       Unchanged Present/Late set exits before any Firestore read (0 reads, 0 writes).
 *   - reconcileDailyBills 11:30 & 14:00 (count-first, when active counts match expected):
 *       ~11 aggregated class attendance docs + ~300 student docs (getAll) + 1 settings + 1 rates
 *       + ~5 routes + 1 term + 4 count() aggregations + ~20 absent-student bill checks ≈ ~340 reads/run.
 *       When `SERVER_DAILY_BILLING_ALLOWLIST` is set, the attendance query pushes down `schoolId in [...]`
 *       so other schools' attendance docs are never read.
 *   - reconcileDailyBills 18:00 (always full deterministic-ID lookup) or any mismatch run:
 *       ~320 base reads + ~600 deterministic bill ID lookups (getAll) ≈ ~920 reads/run.
 *
 * v1 policy:
 *   - NO server-side deletes of financialRecords. Absence bill reversal stays on the client
 *     (reverseDailyBillsForAbsence). In dry-run/trigger logs we record `wouldDeleteCount` only.
 *   - Held credit: when a server-created bill belongs to a student with `hasAccountCredit === true`,
 *     the bill is flagged `creditPending: true` (0 extra reads for students without credit).
 *     Finance applies pending credits from the Bulk Daily Receipts page.
 *   - Per-school rollout mode: `schoolSettings/{schoolId}.serverDailyBillingMode` (`'off' | 'dry-run' | 'live'`),
 *     defaulting to `'dry-run'` for schools in `SERVER_DAILY_BILLING_ALLOWLIST` and `'off'` otherwise.
 *   - Privacy: NEVER log student names or phone numbers — counts and IDs only.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconcileDailyBillsEvening = exports.reconcileDailyBillsAfternoon = exports.reconcileDailyBillsMidday = exports.onAttendanceWrittenBill = exports.DEFAULT_MERCY_SCHOOL_ID = exports.CLIENT_FAST_PATH_DELAY_MS = exports.MAX_OPS_PER_BATCH = exports.DAILY_BILLING_REGION = void 0;
exports.getDailyBillingRuntimeConfig = getDailyBillingRuntimeConfig;
exports.isSchoolInAllowlist = isSchoolInAllowlist;
exports.resolveSchoolBillingMode = resolveSchoolBillingMode;
exports.shouldBillDailyCanteen = shouldBillDailyCanteen;
exports.isDailyTransportSubscriber = isDailyTransportSubscriber;
exports.canteenBillId = canteenBillId;
exports.transportBillId = transportBillId;
exports.schoolDayStartUtcFromDateStr = schoolDayStartUtcFromDateStr;
exports.schoolTodayDateStrUtc = schoolTodayDateStrUtc;
exports.formatBillDisplayDate = formatBillDisplayDate;
exports.resolveStudentDailyRates = resolveStudentDailyRates;
exports.buildRestoreVoidedPatch = buildRestoreVoidedPatch;
exports.readAttendanceEntryStatus = readAttendanceEntryStatus;
exports.isAggregatedClassAttendanceDoc = isAggregatedClassAttendanceDoc;
exports.extractPresentStudentIds = extractPresentStudentIds;
exports.extractAbsentStudentIds = extractAbsentStudentIds;
exports.hasPresentSetChanged = hasPresentSetChanged;
exports.extractNewlyAbsentStudentIds = extractNewlyAbsentStudentIds;
exports.planDailyBillsForStudents = planDailyBillsForStudents;
exports.loadSchoolBillingContext = loadSchoolBillingContext;
exports.fetchStudentsByIds = fetchStudentsByIds;
exports.fetchExistingDailyBills = fetchExistingDailyBills;
exports.executePlannedBillOps = executePlannedBillOps;
exports.handleAggregatedAttendanceWrite = handleAggregatedAttendanceWrite;
exports.checkSchoolBillCounts = checkSchoolBillCounts;
exports.runDailyReconciliation = runDailyReconciliation;
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const term_utils_1 = require("./term-utils");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const defaultDb = (0, firestore_2.getFirestore)();
exports.DAILY_BILLING_REGION = 'us-central1';
exports.MAX_OPS_PER_BATCH = 200;
exports.CLIENT_FAST_PATH_DELAY_MS = 20000;
exports.DEFAULT_MERCY_SCHOOL_ID = 'oHr3BrGdK2eS5MQ5zmZU';
function getDailyBillingRuntimeConfig(env = process.env) {
    var _a, _b;
    const enabled = ((_a = env.SERVER_DAILY_BILLING_ENABLED) !== null && _a !== void 0 ? _a : 'true').toLowerCase() !== 'false';
    const rawAllowlist = ((_b = env.SERVER_DAILY_BILLING_ALLOWLIST) !== null && _b !== void 0 ? _b : exports.DEFAULT_MERCY_SCHOOL_ID).trim();
    let allowlist = null;
    if (rawAllowlist && rawAllowlist !== '*' && rawAllowlist.toUpperCase() !== 'ALL') {
        allowlist = new Set(rawAllowlist
            .split(',')
            .map(s => s.trim())
            .filter(Boolean));
    }
    return { enabled, allowlist };
}
function isSchoolInAllowlist(schoolId, config) {
    if (!config.enabled || !schoolId)
        return false;
    if (config.allowlist && !config.allowlist.has(schoolId))
        return false;
    return true;
}
/**
 * Resolves effective per-school mode without requiring a redeploy:
 *   1. Env kill switch OFF -> `'off'`
 *   2. Explicit `schoolSettings.serverDailyBillingMode` in `'off' | 'dry-run' | 'live'` -> use it
 *   3. Legacy kill switch `schoolSettings.serverDailyBilling === false` -> `'off'`
 *   4. Otherwise -> `'dry-run'` if allowlisted (Mercy's Springfield by default), else `'off'`
 */
function resolveSchoolBillingMode(settingsData, schoolId, config) {
    if (!config.enabled || !schoolId)
        return 'off';
    const explicit = settingsData === null || settingsData === void 0 ? void 0 : settingsData.serverDailyBillingMode;
    if (explicit === 'off' || explicit === 'dry-run' || explicit === 'live') {
        return explicit;
    }
    if ((settingsData === null || settingsData === void 0 ? void 0 : settingsData.serverDailyBilling) === false)
        return 'off';
    return isSchoolInAllowlist(schoolId, config) ? 'dry-run' : 'off';
}
// ---------------------------------------------------------------------------
// Pure billing helpers (parity-tested against src/lib/billing*.ts)
// ---------------------------------------------------------------------------
/** Mirrors src/lib/billing-predicates.ts -> shouldBillDailyCanteen */
function shouldBillDailyCanteen(student) {
    if (!student)
        return false;
    if (student.usesCanteen === false)
        return false;
    if (student.canteenBillingMode === 'Termly' || student.canteenBillingMode === 'None')
        return false;
    return student.canteenBillingMode === 'Daily' || !student.canteenBillingMode;
}
/** Mirrors src/lib/billing-predicates.ts -> isDailyTransportSubscriber */
function isDailyTransportSubscriber(student) {
    if (!student)
        return false;
    return student.usesBusService === true && student.transportBillingModel === 'Daily';
}
/** Deterministic daily canteen bill ID (mirrors src/lib/billing.ts & src/lib/billing-server.ts). */
function canteenBillId(studentUid, dateStr) {
    return `canteen-${studentUid}-${dateStr}`;
}
/** Deterministic daily transport bill ID (mirrors src/lib/billing.ts & src/lib/billing-server.ts). */
function transportBillId(studentUid, dateStr) {
    return `transport-${studentUid}-${dateStr}`;
}
/** Canonical UTC midnight for a YYYY-MM-DD school calendar date (mirrors schoolDayStartUtc). */
function schoolDayStartUtcFromDateStr(dateStr) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (!match) {
        throw new Error(`Invalid dateStr "${dateStr}"; expected YYYY-MM-DD`);
    }
    return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 0, 0, 0, 0));
}
/** Current YYYY-MM-DD in Africa/Accra (UTC+0). */
function schoolTodayDateStrUtc(now = new Date()) {
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
function ordinalSuffix(day) {
    if (day >= 11 && day <= 13)
        return `${day}th`;
    switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
    }
}
/** Matches date-fns `format(date, 'PPP')` (e.g. "November 23rd, 2026") without external dependency. */
function formatBillDisplayDate(dateStr) {
    const d = schoolDayStartUtcFromDateStr(dateStr);
    return `${MONTH_NAMES[d.getUTCMonth()]} ${ordinalSuffix(d.getUTCDate())}, ${d.getUTCFullYear()}`;
}
/** Mirrors rate resolution in src/lib/billing.ts & src/lib/billing-server.ts. */
function resolveStudentDailyRates(student, canteenConfig, transportRateMap) {
    var _a;
    const canteen = canteenConfig.pricingModel === 'Flat'
        ? Number(canteenConfig.dailyRate) || 0
        : Number((_a = canteenConfig.classRates) === null || _a === void 0 ? void 0 : _a[student.classId || '']) || 0;
    const transport = Number(transportRateMap.get(student.uid)) || 0;
    return { canteen, transport };
}
/** Mirrors restoreVoidedBill in src/lib/billing.ts & src/lib/billing-server.ts. */
function buildRestoreVoidedPatch(prev, rate, restoredAtValue = firestore_2.FieldValue.serverTimestamp()) {
    var _a;
    const paid = Number(prev === null || prev === void 0 ? void 0 : prev.amountPaid) || 0;
    const waiver = Number((_a = prev === null || prev === void 0 ? void 0 : prev.originalWaiverAmount) !== null && _a !== void 0 ? _a : prev === null || prev === void 0 ? void 0 : prev.waiverAmount) || 0;
    return {
        billedAmount: rate,
        waiverAmount: waiver,
        voided: false,
        voidReason: null,
        restoredAt: restoredAtValue,
        status: rate - paid - waiver <= 0.001 ? 'Paid' : 'Unpaid',
    };
}
function readAttendanceEntryStatus(v) {
    if (typeof v === 'string')
        return v;
    if (v && typeof v === 'object' && 'status' in v) {
        const s = v.status;
        return typeof s === 'string' ? s : '';
    }
    return '';
}
/**
 * Attendance collection stores both per-student docs (`att-...`) and aggregated class docs
 * (`{schoolId}_{classId}_{dateStr}` with `studentsMap`). Trigger ONLY on aggregated class docs.
 */
function isAggregatedClassAttendanceDoc(docId, data) {
    if (!docId || docId.startsWith('att-') || !data)
        return false;
    if (typeof data.schoolId !== 'string' || !data.schoolId)
        return false;
    if (typeof data.classId !== 'string' || !data.classId)
        return false;
    if (typeof data.dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.dateStr))
        return false;
    if (!data.studentsMap || typeof data.studentsMap !== 'object' || Array.isArray(data.studentsMap))
        return false;
    return true;
}
function extractPresentStudentIds(studentsMap) {
    if (!studentsMap)
        return [];
    const ids = [];
    for (const [sid, entry] of Object.entries(studentsMap)) {
        const status = readAttendanceEntryStatus(entry);
        if (status === 'Present' || status === 'Late')
            ids.push(sid);
    }
    ids.sort();
    return ids;
}
function extractAbsentStudentIds(studentsMap) {
    if (!studentsMap)
        return [];
    const ids = [];
    for (const [sid, entry] of Object.entries(studentsMap)) {
        const status = readAttendanceEntryStatus(entry);
        if (status === 'Absent' || status === 'Excused')
            ids.push(sid);
    }
    ids.sort();
    return ids;
}
function hasPresentSetChanged(beforeMap, afterMap) {
    const before = extractPresentStudentIds(beforeMap);
    const after = extractPresentStudentIds(afterMap);
    if (before.length !== after.length)
        return true;
    for (let i = 0; i < before.length; i++) {
        if (before[i] !== after[i])
            return true;
    }
    return false;
}
function extractNewlyAbsentStudentIds(beforeMap, afterMap) {
    if (!beforeMap || !afterMap)
        return [];
    const newlyAbsent = [];
    for (const [sid, afterEntry] of Object.entries(afterMap)) {
        const beforeStatus = readAttendanceEntryStatus(beforeMap[sid]);
        const afterStatus = readAttendanceEntryStatus(afterEntry);
        const wasPresent = beforeStatus === 'Present' || beforeStatus === 'Late';
        const isNowAbsent = afterStatus === 'Absent' || afterStatus === 'Excused';
        if (wasPresent && isNowAbsent)
            newlyAbsent.push(sid);
    }
    newlyAbsent.sort();
    return newlyAbsent;
}
/**
 * Pure planner: given students, rates, and existing bill snapshots, computes exact create/restore ops.
 * Never overwrites an existing non-voided (or paid) bill.
 * Skips Inactive students and ineligible service subscribers.
 * Sets `creditPending: true` ONLY when `student.hasAccountCredit === true`.
 */
function planDailyBillsForStudents(params) {
    var _a, _b;
    const { students, schoolId, dateStr, canteenConfig, transportRateMap, existingBills, termStamp, } = params;
    const dueDateValue = (_a = params.dueDateValue) !== null && _a !== void 0 ? _a : firestore_2.Timestamp.fromDate(schoolDayStartUtcFromDateStr(dateStr));
    const createdAtValue = (_b = params.createdAtValue) !== null && _b !== void 0 ? _b : firestore_2.FieldValue.serverTimestamp();
    const formattedDate = formatBillDisplayDate(dateStr);
    const termFields = termStamp ? Object.assign(Object.assign({}, termStamp), { isArchived: false }) : { isArchived: false };
    const ops = [];
    let expectedBillCount = 0;
    let expectedCanteenCount = 0;
    let expectedTransportCount = 0;
    let existingActiveCount = 0;
    let skippedCount = 0;
    let creditPendingCount = 0;
    for (const student of students) {
        if (!(student === null || student === void 0 ? void 0 : student.uid)) {
            skippedCount++;
            continue;
        }
        if (student.enrollmentStatus === 'Inactive') {
            skippedCount++;
            continue;
        }
        const billCanteen = shouldBillDailyCanteen(student);
        const billTransport = isDailyTransportSubscriber(student);
        const { canteen: canteenRate, transport: transportRate } = resolveStudentDailyRates(student, canteenConfig, transportRateMap);
        const hasCredit = student.hasAccountCredit === true;
        const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
        if (billCanteen && canteenRate > 0) {
            expectedBillCount++;
            expectedCanteenCount++;
            const id = canteenBillId(student.uid, dateStr);
            const existing = existingBills.get(id);
            if (existing) {
                if (existing.voided === true) {
                    ops.push({
                        kind: 'restore',
                        billId: id,
                        studentUid: student.uid,
                        service: 'Canteen',
                        amount: canteenRate,
                        patch: buildRestoreVoidedPatch(existing, canteenRate, createdAtValue),
                    });
                }
                else {
                    existingActiveCount++;
                    skippedCount++;
                }
            }
            else {
                const data = Object.assign(Object.assign({ studentId: student.uid, studentName, classId: student.classId || '', type: 'Canteen Fee (Daily)', description: `Canteen - ${formattedDate}`, billedAmount: canteenRate, amountPaid: 0, waiverAmount: 0, status: 'Unpaid', dueDate: dueDateValue, createdAt: createdAtValue, schoolId }, termFields), (hasCredit ? { creditPending: true } : {}));
                if (hasCredit)
                    creditPendingCount++;
                ops.push({
                    kind: 'create',
                    billId: id,
                    studentUid: student.uid,
                    service: 'Canteen',
                    amount: canteenRate,
                    data,
                    creditPending: hasCredit,
                });
            }
        }
        if (billTransport && transportRate > 0) {
            expectedBillCount++;
            expectedTransportCount++;
            const id = transportBillId(student.uid, dateStr);
            const existing = existingBills.get(id);
            if (existing) {
                if (existing.voided === true) {
                    ops.push({
                        kind: 'restore',
                        billId: id,
                        studentUid: student.uid,
                        service: 'Transport',
                        amount: transportRate,
                        patch: buildRestoreVoidedPatch(existing, transportRate, createdAtValue),
                    });
                }
                else {
                    existingActiveCount++;
                    skippedCount++;
                }
            }
            else {
                const data = Object.assign(Object.assign({ studentId: student.uid, studentName, classId: student.classId || '', type: 'Transport Fee (Daily)', description: `Transport - ${formattedDate}`, billedAmount: transportRate, amountPaid: 0, waiverAmount: 0, status: 'Unpaid', dueDate: dueDateValue, createdAt: createdAtValue, schoolId }, termFields), (hasCredit ? { creditPending: true } : {}));
                if (hasCredit)
                    creditPendingCount++;
                ops.push({
                    kind: 'create',
                    billId: id,
                    studentUid: student.uid,
                    service: 'Transport',
                    amount: transportRate,
                    data,
                    creditPending: hasCredit,
                });
            }
        }
    }
    return {
        ops,
        expectedBillCount,
        expectedCanteenCount,
        expectedTransportCount,
        existingActiveCount,
        skippedCount,
        creditPendingCount,
    };
}
// ---------------------------------------------------------------------------
// Firestore loaders & safe batched executor
// ---------------------------------------------------------------------------
function isAlreadyExistsError(err) {
    if (!err || typeof err !== 'object')
        return false;
    const e = err;
    if (e.code === 6 || e.code === 'already-exists' || e.code === 'ALREADY_EXISTS')
        return true;
    if (typeof e.message === 'string' && e.message.toUpperCase().includes('ALREADY_EXISTS'))
        return true;
    return false;
}
async function loadSchoolBillingContext(db, schoolId, config) {
    var _a;
    const [settingsSnap, schoolSnap, canteenSnap, routesSnap] = await Promise.all([
        db.collection('schoolSettings').doc(schoolId).get(),
        db.collection('schools').doc(schoolId).get(),
        db.collection('schoolSettings').doc(schoolId).collection('rates').doc('canteen').get(),
        db.collection('routes').where('schoolId', '==', schoolId).get(),
    ]);
    const settingsData = settingsSnap.exists ? settingsSnap.data() : null;
    const schoolData = schoolSnap.exists ? schoolSnap.data() : null;
    const mode = resolveSchoolBillingMode(settingsData, schoolId, config);
    const canteenData = canteenSnap.exists ? canteenSnap.data() : null;
    const canteenConfig = {
        pricingModel: String((canteenData === null || canteenData === void 0 ? void 0 : canteenData.pricingModel) || 'Flat'),
        dailyRate: Number(canteenData === null || canteenData === void 0 ? void 0 : canteenData.dailyRate) || 0,
        classRates: (canteenData === null || canteenData === void 0 ? void 0 : canteenData.classRates) || {},
    };
    const transportRateMap = new Map();
    for (const d of routesSnap.docs) {
        const data = d.data();
        const dailyRate = Number(data.dailyRate) || 0;
        const stops = Array.isArray(data.stops) ? data.stops : [];
        for (const stop of stops) {
            const assigned = Array.isArray(stop === null || stop === void 0 ? void 0 : stop.assignedStudentIds) ? stop.assignedStudentIds : [];
            for (const sid of assigned) {
                transportRateMap.set(String(sid), dailyRate);
            }
        }
    }
    // Share the exact canonical term stamp logic with the web app (`./term-utils`).
    const termStamp = (_a = (0, term_utils_1.currentTermFromProfile)(schoolData)) !== null && _a !== void 0 ? _a : (0, term_utils_1.currentTermFromProfile)(settingsData);
    return { mode, canteenConfig, transportRateMap, termStamp };
}
async function fetchStudentsByIds(db, studentIds) {
    if (studentIds.length === 0)
        return [];
    const refs = studentIds.map(uid => db.collection('students').doc(uid));
    const snaps = await db.getAll(...refs);
    const out = [];
    for (const s of snaps) {
        if (!s.exists)
            continue;
        const data = s.data();
        out.push({
            uid: String(data.uid || s.id),
            firstName: typeof data.firstName === 'string' ? data.firstName : undefined,
            lastName: typeof data.lastName === 'string' ? data.lastName : undefined,
            classId: typeof data.classId === 'string' ? data.classId : undefined,
            enrollmentStatus: typeof data.enrollmentStatus === 'string' ? data.enrollmentStatus : undefined,
            usesCanteen: data.usesCanteen,
            canteenBillingMode: data.canteenBillingMode,
            usesBusService: data.usesBusService,
            transportBillingModel: data.transportBillingModel,
            hasAccountCredit: data.hasAccountCredit === true,
        });
    }
    return out;
}
async function fetchExistingDailyBills(db, studentIds, dateStr) {
    const map = new Map();
    if (studentIds.length === 0)
        return map;
    const refs = studentIds.flatMap(uid => [
        db.collection('financialRecords').doc(canteenBillId(uid, dateStr)),
        db.collection('financialRecords').doc(transportBillId(uid, dateStr)),
    ]);
    const snaps = await db.getAll(...refs);
    for (const s of snaps) {
        if (!s.exists)
            continue;
        const d = s.data();
        map.set(s.id, {
            id: s.id,
            voided: d.voided === true,
            amountPaid: Number(d.amountPaid) || 0,
            waiverAmount: Number(d.waiverAmount) || 0,
            originalWaiverAmount: d.originalWaiverAmount !== undefined ? Number(d.originalWaiverAmount) : undefined,
            status: typeof d.status === 'string' ? d.status : undefined,
        });
    }
    return map;
}
/**
 * Executes planned create/restore ops safely:
 *   - Uses `batch.create()` for missing docs (never blind `set`).
 *   - Max 200 ops per batch (a 35-student class = at most 1 batch).
 *   - If a batch throws `ALREADY_EXISTS` (concurrent race with client fast-path),
 *     retries each op individually and treats `ALREADY_EXISTS` as a benign skip.
 *   - When `dryRun` is true, writes nothing and returns intended counts.
 */
async function executePlannedBillOps(params) {
    var _a;
    const { db, plan, dryRun } = params;
    if (dryRun) {
        let wouldCreate = 0;
        let wouldRestore = 0;
        for (const op of plan.ops) {
            if (op.kind === 'create')
                wouldCreate++;
            else
                wouldRestore++;
        }
        return {
            expected: plan.expectedBillCount,
            existing: plan.existingActiveCount,
            created: wouldCreate,
            restored: wouldRestore,
            skipped: plan.skippedCount,
            failed: 0,
            failedStudentIds: [],
            creditPendingCount: plan.creditPendingCount,
            batchCommits: 0,
            dryRun: true,
        };
    }
    let created = 0;
    let restored = 0;
    let skipped = plan.skippedCount;
    let failed = 0;
    let batchCommits = 0;
    const failedStudentSet = new Set();
    for (let i = 0; i < plan.ops.length; i += exports.MAX_OPS_PER_BATCH) {
        const chunk = plan.ops.slice(i, i + exports.MAX_OPS_PER_BATCH);
        const batch = db.batch();
        for (const op of chunk) {
            const ref = db.collection('financialRecords').doc(op.billId);
            if (op.kind === 'create')
                batch.create(ref, op.data);
            else
                batch.update(ref, op.patch);
        }
        try {
            await batch.commit();
            batchCommits++;
            for (const op of chunk) {
                if (op.kind === 'create')
                    created++;
                else
                    restored++;
            }
        }
        catch (batchErr) {
            // Concurrent client fast-path may have created one of the bills between getAll and commit.
            // Retry each op in this chunk individually; ALREADY_EXISTS on create is a benign skip.
            for (const op of chunk) {
                const ref = db.collection('financialRecords').doc(op.billId);
                try {
                    if (op.kind === 'create') {
                        await ref.create(op.data);
                        created++;
                    }
                    else {
                        await ref.update(op.patch);
                        restored++;
                    }
                }
                catch (opErr) {
                    if (op.kind === 'create' && isAlreadyExistsError(opErr)) {
                        skipped++;
                    }
                    else {
                        failed++;
                        failedStudentSet.add(op.studentUid);
                    }
                }
            }
            if (!isAlreadyExistsError(batchErr)) {
                console.warn('[daily-billing] Batch fallback triggered by non-ALREADY_EXISTS error', {
                    chunkSize: chunk.length,
                    errorCode: (_a = batchErr === null || batchErr === void 0 ? void 0 : batchErr.code) !== null && _a !== void 0 ? _a : 'unknown',
                });
            }
        }
    }
    return {
        expected: plan.expectedBillCount,
        existing: plan.existingActiveCount,
        created,
        restored,
        skipped,
        failed,
        failedStudentIds: Array.from(failedStudentSet),
        creditPendingCount: plan.creditPendingCount,
        batchCommits,
        dryRun: false,
    };
}
/**
 * Counts how many unpaid daily bills exist for newly-absent students (v1: log-only, NO deletes).
 */
async function countWouldDeleteForAbsentStudents(db, absentStudentIds, dateStr) {
    if (absentStudentIds.length === 0)
        return 0;
    const existing = await fetchExistingDailyBills(db, absentStudentIds, dateStr);
    let wouldDelete = 0;
    for (const bill of existing.values()) {
        if (bill.voided)
            continue;
        const paid = Number(bill.amountPaid) || 0;
        const waiver = Number(bill.waiverAmount) || 0;
        if (paid + waiver <= 0.009)
            wouldDelete++;
    }
    return wouldDelete;
}
const defaultSleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// ---------------------------------------------------------------------------
// Core trigger handler (exported for unit testing)
// ---------------------------------------------------------------------------
async function handleAggregatedAttendanceWrite(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { db, docId, beforeData, afterData } = params;
    const config = (_a = params.config) !== null && _a !== void 0 ? _a : getDailyBillingRuntimeConfig();
    const delayMs = (_b = params.delayMs) !== null && _b !== void 0 ? _b : 0;
    const sleep = (_c = params.sleep) !== null && _c !== void 0 ? _c : defaultSleep;
    const log = (_d = params.logger) !== null && _d !== void 0 ? _d : console;
    if (!isAggregatedClassAttendanceDoc(docId, afterData)) {
        return { ran: false, reason: 'not-aggregated-class-doc' };
    }
    const { schoolId, classId, dateStr, studentsMap } = afterData;
    if (!config.enabled) {
        return { ran: false, reason: 'env-kill-switch-off' };
    }
    const beforeMap = beforeData && typeof beforeData.studentsMap === 'object' && beforeData.studentsMap !== null
        ? beforeData.studentsMap
        : null;
    const presentChanged = hasPresentSetChanged(beforeMap, studentsMap);
    const newlyAbsentIds = extractNewlyAbsentStudentIds(beforeMap, studentsMap);
    if (!presentChanged && newlyAbsentIds.length === 0) {
        return { ran: false, reason: 'present-set-unchanged' };
    }
    const ctx = await loadSchoolBillingContext(db, schoolId, config);
    if (ctx.mode === 'off') {
        return { ran: false, mode: 'off', reason: 'school-mode-off' };
    }
    // Wait briefly so the client fast-path (~1-2s) normally wins before we read existing bills.
    if (delayMs > 0) {
        await sleep(delayMs);
    }
    const dryRun = ctx.mode === 'dry-run';
    // v1: never delete bills on the server; count unpaid bills for newly absent students for dry-run visibility only.
    const wouldDeleteCount = newlyAbsentIds.length > 0 ? await countWouldDeleteForAbsentStudents(db, newlyAbsentIds, dateStr) : 0;
    let counters;
    if (presentChanged) {
        const presentIds = extractPresentStudentIds(studentsMap);
        const [students, existingBills] = await Promise.all([
            fetchStudentsByIds(db, presentIds),
            fetchExistingDailyBills(db, presentIds, dateStr),
        ]);
        const plan = planDailyBillsForStudents({
            students,
            schoolId,
            dateStr,
            canteenConfig: ctx.canteenConfig,
            transportRateMap: ctx.transportRateMap,
            existingBills,
            termStamp: ctx.termStamp,
        });
        counters = await executePlannedBillOps({ db, plan, dryRun });
    }
    // Privacy: counters and IDs only — never log student names or phone numbers.
    log.info('[daily-billing:trigger]', {
        schoolId,
        classId,
        dateStr,
        mode: ctx.mode,
        dryRun,
        created: (_e = counters === null || counters === void 0 ? void 0 : counters.created) !== null && _e !== void 0 ? _e : 0,
        restored: (_f = counters === null || counters === void 0 ? void 0 : counters.restored) !== null && _f !== void 0 ? _f : 0,
        skipped: (_g = counters === null || counters === void 0 ? void 0 : counters.skipped) !== null && _g !== void 0 ? _g : 0,
        failed: (_h = counters === null || counters === void 0 ? void 0 : counters.failed) !== null && _h !== void 0 ? _h : 0,
        creditPendingCount: (_j = counters === null || counters === void 0 ? void 0 : counters.creditPendingCount) !== null && _j !== void 0 ? _j : 0,
        wouldDeleteCount,
    });
    return { ran: true, mode: ctx.mode, counters, wouldDeleteCount };
}
/**
 * Count-first check for 11:30 and 14:00 runs:
 *   1. Counts total & voided daily bills per service via 1-read Firestore `.count()` aggregations.
 *   2. Checks deterministic bill IDs of ABSENT/EXCUSED students (~20 reads) to count any unvoided
 *      bills belonging to students no longer Present/Late (e.g. a paid bill for a student later
 *      marked absent), subtracting them so they can NEVER mask a missing bill for a Present student.
 *   3. Returns matched=true ONLY when effectivePresentActiveCount === expectedCount for BOTH services.
 */
async function checkSchoolBillCounts(params) {
    const { db, schoolId, dateStr, expectedCanteenCount, expectedTransportCount, absentStudentIds } = params;
    const dueTs = firestore_2.Timestamp.fromDate(schoolDayStartUtcFromDateStr(dateStr));
    const fin = db.collection('financialRecords');
    const [canteenTotalSnap, canteenVoidedSnap, transportTotalSnap, transportVoidedSnap, absentBills] = await Promise.all([
        fin.where('schoolId', '==', schoolId).where('type', '==', 'Canteen Fee (Daily)').where('dueDate', '==', dueTs).count().get(),
        fin.where('schoolId', '==', schoolId).where('type', '==', 'Canteen Fee (Daily)').where('dueDate', '==', dueTs).where('voided', '==', true).count().get(),
        fin.where('schoolId', '==', schoolId).where('type', '==', 'Transport Fee (Daily)').where('dueDate', '==', dueTs).count().get(),
        fin.where('schoolId', '==', schoolId).where('type', '==', 'Transport Fee (Daily)').where('dueDate', '==', dueTs).where('voided', '==', true).count().get(),
        fetchExistingDailyBills(db, absentStudentIds, dateStr),
    ]);
    let unvoidedAbsentCanteen = 0;
    let unvoidedAbsentTransport = 0;
    for (const [id, bill] of absentBills.entries()) {
        if (bill.voided === true)
            continue;
        if (id.startsWith('canteen-'))
            unvoidedAbsentCanteen++;
        else if (id.startsWith('transport-'))
            unvoidedAbsentTransport++;
    }
    const canteenActiveCount = Math.max(0, canteenTotalSnap.data().count - canteenVoidedSnap.data().count - unvoidedAbsentCanteen);
    const transportActiveCount = Math.max(0, transportTotalSnap.data().count - transportVoidedSnap.data().count - unvoidedAbsentTransport);
    const matched = canteenActiveCount === expectedCanteenCount &&
        transportActiveCount === expectedTransportCount;
    return {
        canteenActiveCount,
        transportActiveCount,
        expectedCanteenCount,
        expectedTransportCount,
        matched,
    };
}
async function queryAggregatedAttendanceDocsForDate(db, dateStr, config) {
    // When an allowlist is set, push `schoolId in [...]` down to Firestore so other schools' docs are never read.
    if (config.allowlist && config.allowlist.size > 0) {
        const ids = Array.from(config.allowlist);
        const results = [];
        for (let i = 0; i < ids.length; i += 30) {
            const chunk = ids.slice(i, i + 30);
            const snap = await db
                .collection('attendance')
                .where('schoolId', 'in', chunk)
                .where('dateStr', '==', dateStr)
                .where('totalStudents', '>', 0)
                .get();
            for (const d of snap.docs) {
                results.push({ id: d.id, data: d.data() });
            }
        }
        return results;
    }
    const snap = await db
        .collection('attendance')
        .where('dateStr', '==', dateStr)
        .where('totalStudents', '>', 0)
        .get();
    return snap.docs.map(d => ({ id: d.id, data: d.data() }));
}
async function runDailyReconciliation(params) {
    var _a, _b, _c;
    const { db, forceFullLookup, scheduleLabel } = params;
    const dateStr = (_a = params.dateStr) !== null && _a !== void 0 ? _a : schoolTodayDateStrUtc();
    const config = (_b = params.config) !== null && _b !== void 0 ? _b : getDailyBillingRuntimeConfig();
    const log = (_c = params.logger) !== null && _c !== void 0 ? _c : console;
    if (!config.enabled) {
        log.info('[daily-billing:reconcile] Disabled by env flag', { dateStr, scheduleLabel });
        return [];
    }
    // Derive expected bills strictly from aggregated attendance class docs (never canteen_headcounts).
    const attDocs = await queryAggregatedAttendanceDocsForDate(db, dateStr, config);
    const bySchool = new Map();
    for (const d of attDocs) {
        if (!isAggregatedClassAttendanceDoc(d.id, d.data))
            continue;
        let bucket = bySchool.get(d.data.schoolId);
        if (!bucket) {
            bucket = { presentIds: new Set(), absentIds: new Set() };
            bySchool.set(d.data.schoolId, bucket);
        }
        for (const sid of extractPresentStudentIds(d.data.studentsMap))
            bucket.presentIds.add(sid);
        for (const sid of extractAbsentStudentIds(d.data.studentsMap))
            bucket.absentIds.add(sid);
    }
    // Ensure any student marked Present in one class isn't also in absentIds
    for (const bucket of bySchool.values()) {
        for (const sid of bucket.presentIds)
            bucket.absentIds.delete(sid);
    }
    const summaries = [];
    for (const [schoolId, bucket] of bySchool.entries()) {
        const presentIds = Array.from(bucket.presentIds).sort();
        const absentIds = Array.from(bucket.absentIds).sort();
        if (presentIds.length === 0)
            continue;
        const ctx = await loadSchoolBillingContext(db, schoolId, config);
        if (ctx.mode === 'off')
            continue;
        const dryRun = ctx.mode === 'dry-run';
        const students = await fetchStudentsByIds(db, presentIds);
        // Compute exact eligible expected counts from student docs + rates (no bill reads yet)
        const dryPlanForCounts = planDailyBillsForStudents({
            students,
            schoolId,
            dateStr,
            canteenConfig: ctx.canteenConfig,
            transportRateMap: ctx.transportRateMap,
            existingBills: new Map(),
            termStamp: ctx.termStamp,
        });
        if (!forceFullLookup) {
            const countCheck = await checkSchoolBillCounts({
                db,
                schoolId,
                dateStr,
                expectedCanteenCount: dryPlanForCounts.expectedCanteenCount,
                expectedTransportCount: dryPlanForCounts.expectedTransportCount,
                absentStudentIds: absentIds,
            });
            if (countCheck.matched) {
                const summary = {
                    schoolId,
                    dateStr,
                    billingMode: ctx.mode,
                    mode: 'count-skipped',
                    expected: dryPlanForCounts.expectedBillCount,
                    existing: countCheck.canteenActiveCount + countCheck.transportActiveCount,
                    created: 0,
                    restored: 0,
                    failed: 0,
                    failedStudentIds: [],
                    creditPendingCount: 0,
                    dryRun,
                };
                if (!dryRun) {
                    await db.collection('billingReconciliation').doc(`${schoolId}_${dateStr}`).set({
                        schoolId,
                        dateStr,
                        scheduleLabel,
                        mode: summary.mode,
                        expected: summary.expected,
                        existing: summary.existing,
                        created: 0,
                        restored: 0,
                        failed: 0,
                        failedStudentIds: [],
                        updatedAt: firestore_2.FieldValue.serverTimestamp(),
                    }, { merge: true });
                }
                log.info('[daily-billing:reconcile]', {
                    schoolId,
                    dateStr,
                    scheduleLabel,
                    billingMode: ctx.mode,
                    mode: summary.mode,
                    dryRun,
                    expected: summary.expected,
                    existing: summary.existing,
                    created: 0,
                    restored: 0,
                    failed: 0,
                });
                summaries.push(summary);
                continue;
            }
        }
        // Full deterministic-ID lookup (always at 18:00, or on any count mismatch at 11:30/14:00)
        const existingBills = await fetchExistingDailyBills(db, presentIds, dateStr);
        const plan = planDailyBillsForStudents({
            students,
            schoolId,
            dateStr,
            canteenConfig: ctx.canteenConfig,
            transportRateMap: ctx.transportRateMap,
            existingBills,
            termStamp: ctx.termStamp,
        });
        const counters = await executePlannedBillOps({ db, plan, dryRun });
        const summary = {
            schoolId,
            dateStr,
            billingMode: ctx.mode,
            mode: 'full-lookup',
            expected: counters.expected,
            existing: counters.existing,
            created: counters.created,
            restored: counters.restored,
            failed: counters.failed,
            failedStudentIds: counters.failedStudentIds,
            creditPendingCount: counters.creditPendingCount,
            dryRun,
        };
        if (!dryRun) {
            await db.collection('billingReconciliation').doc(`${schoolId}_${dateStr}`).set({
                schoolId,
                dateStr,
                scheduleLabel,
                mode: summary.mode,
                expected: summary.expected,
                existing: summary.existing,
                created: summary.created,
                restored: summary.restored,
                failed: summary.failed,
                failedStudentIds: summary.failedStudentIds,
                creditPendingCount: summary.creditPendingCount,
                updatedAt: firestore_2.FieldValue.serverTimestamp(),
            }, { merge: true });
        }
        log.info('[daily-billing:reconcile]', {
            schoolId,
            dateStr,
            scheduleLabel,
            billingMode: ctx.mode,
            mode: summary.mode,
            dryRun,
            expected: summary.expected,
            existing: summary.existing,
            created: summary.created,
            restored: summary.restored,
            failed: summary.failed,
            creditPendingCount: summary.creditPendingCount,
        });
        summaries.push(summary);
    }
    return summaries;
}
// ---------------------------------------------------------------------------
// Exported Firebase Cloud Functions (v2)
// ---------------------------------------------------------------------------
exports.onAttendanceWrittenBill = (0, firestore_1.onDocumentWritten)({
    document: 'attendance/{docId}',
    region: exports.DAILY_BILLING_REGION,
    retry: false,
    maxInstances: 20,
    timeoutSeconds: 90,
}, async (event) => {
    var _a, _b;
    const docId = event.params.docId;
    const beforeData = ((_a = event.data) === null || _a === void 0 ? void 0 : _a.before.exists)
        ? event.data.before.data()
        : null;
    const afterData = ((_b = event.data) === null || _b === void 0 ? void 0 : _b.after.exists)
        ? event.data.after.data()
        : null;
    await handleAggregatedAttendanceWrite({
        db: defaultDb,
        docId,
        beforeData,
        afterData,
        delayMs: exports.CLIENT_FAST_PATH_DELAY_MS,
    });
});
exports.reconcileDailyBillsMidday = (0, scheduler_1.onSchedule)({
    schedule: '30 11 * * 1-5',
    timeZone: 'Africa/Accra',
    region: exports.DAILY_BILLING_REGION,
    retryCount: 0,
    maxInstances: 5,
    timeoutSeconds: 180,
}, async () => {
    await runDailyReconciliation({
        db: defaultDb,
        forceFullLookup: false,
        scheduleLabel: '11:30',
    });
});
exports.reconcileDailyBillsAfternoon = (0, scheduler_1.onSchedule)({
    schedule: '0 14 * * 1-5',
    timeZone: 'Africa/Accra',
    region: exports.DAILY_BILLING_REGION,
    retryCount: 0,
    maxInstances: 5,
    timeoutSeconds: 180,
}, async () => {
    await runDailyReconciliation({
        db: defaultDb,
        forceFullLookup: false,
        scheduleLabel: '14:00',
    });
});
exports.reconcileDailyBillsEvening = (0, scheduler_1.onSchedule)({
    schedule: '0 18 * * 1-5',
    timeZone: 'Africa/Accra',
    region: exports.DAILY_BILLING_REGION,
    retryCount: 0,
    maxInstances: 5,
    timeoutSeconds: 180,
}, async () => {
    await runDailyReconciliation({
        db: defaultDb,
        forceFullLookup: true,
        scheduleLabel: '18:00',
    });
});
//# sourceMappingURL=daily-billing.js.map
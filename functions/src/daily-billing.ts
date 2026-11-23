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

import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { currentTermFromProfile, type TermStamp } from './term-utils';

if (!getApps().length) initializeApp();
const defaultDb = getFirestore();

export const DAILY_BILLING_REGION = 'us-central1';
export const MAX_OPS_PER_BATCH = 200;
export const CLIENT_FAST_PATH_DELAY_MS = 20_000;
export const DEFAULT_MERCY_SCHOOL_ID = 'oHr3BrGdK2eS5MQ5zmZU';

export type ServerDailyBillingMode = 'off' | 'dry-run' | 'live';

// ---------------------------------------------------------------------------
// Rollout & kill-switch configuration
// ---------------------------------------------------------------------------

export interface DailyBillingRuntimeConfig {
  /** Global env kill switch (`SERVER_DAILY_BILLING_ENABLED !== 'false'`). */
  enabled: boolean;
  /** Schools that default to `'dry-run'` when `schoolSettings.serverDailyBillingMode` is unset. */
  allowlist: Set<string> | null;
}

export function getDailyBillingRuntimeConfig(env: NodeJS.ProcessEnv = process.env): DailyBillingRuntimeConfig {
  const enabled = (env.SERVER_DAILY_BILLING_ENABLED ?? 'true').toLowerCase() !== 'false';
  const rawAllowlist = (env.SERVER_DAILY_BILLING_ALLOWLIST ?? DEFAULT_MERCY_SCHOOL_ID).trim();

  let allowlist: Set<string> | null = null;
  if (rawAllowlist && rawAllowlist !== '*' && rawAllowlist.toUpperCase() !== 'ALL') {
    allowlist = new Set(
      rawAllowlist
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    );
  }

  return { enabled, allowlist };
}

export function isSchoolInAllowlist(schoolId: string, config: DailyBillingRuntimeConfig): boolean {
  if (!config.enabled || !schoolId) return false;
  if (config.allowlist && !config.allowlist.has(schoolId)) return false;
  return true;
}

/**
 * Resolves effective per-school mode without requiring a redeploy:
 *   1. Env kill switch OFF -> `'off'`
 *   2. Explicit `schoolSettings.serverDailyBillingMode` in `'off' | 'dry-run' | 'live'` -> use it
 *   3. Legacy kill switch `schoolSettings.serverDailyBilling === false` -> `'off'`
 *   4. Otherwise -> `'dry-run'` if allowlisted (Mercy's Springfield by default), else `'off'`
 */
export function resolveSchoolBillingMode(
  settingsData: Record<string, unknown> | null | undefined,
  schoolId: string,
  config: DailyBillingRuntimeConfig
): ServerDailyBillingMode {
  if (!config.enabled || !schoolId) return 'off';
  const explicit = settingsData?.serverDailyBillingMode;
  if (explicit === 'off' || explicit === 'dry-run' || explicit === 'live') {
    return explicit;
  }
  if (settingsData?.serverDailyBilling === false) return 'off';
  return isSchoolInAllowlist(schoolId, config) ? 'dry-run' : 'off';
}

// ---------------------------------------------------------------------------
// Pure billing helpers (parity-tested against src/lib/billing*.ts)
// ---------------------------------------------------------------------------

/** Mirrors src/lib/billing-predicates.ts -> shouldBillDailyCanteen */
export function shouldBillDailyCanteen(
  student: { usesCanteen?: unknown; canteenBillingMode?: unknown } | null | undefined
): boolean {
  if (!student) return false;
  if (student.usesCanteen === false) return false;
  if (student.canteenBillingMode === 'Termly' || student.canteenBillingMode === 'None') return false;
  return student.canteenBillingMode === 'Daily' || !student.canteenBillingMode;
}

/** Mirrors src/lib/billing-predicates.ts -> isDailyTransportSubscriber */
export function isDailyTransportSubscriber(
  student: { usesBusService?: unknown; transportBillingModel?: unknown } | null | undefined
): boolean {
  if (!student) return false;
  return student.usesBusService === true && student.transportBillingModel === 'Daily';
}

/** Deterministic daily canteen bill ID (mirrors src/lib/billing.ts & src/lib/billing-server.ts). */
export function canteenBillId(studentUid: string, dateStr: string): string {
  return `canteen-${studentUid}-${dateStr}`;
}

/** Deterministic daily transport bill ID (mirrors src/lib/billing.ts & src/lib/billing-server.ts). */
export function transportBillId(studentUid: string, dateStr: string): string {
  return `transport-${studentUid}-${dateStr}`;
}

/** Canonical UTC midnight for a YYYY-MM-DD school calendar date (mirrors schoolDayStartUtc). */
export function schoolDayStartUtcFromDateStr(dateStr: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) {
    throw new Error(`Invalid dateStr "${dateStr}"; expected YYYY-MM-DD`);
  }
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 0, 0, 0, 0));
}

/** Current YYYY-MM-DD in Africa/Accra (UTC+0). */
export function schoolTodayDateStrUtc(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

/** Matches date-fns `format(date, 'PPP')` (e.g. "November 23rd, 2026") without external dependency. */
export function formatBillDisplayDate(dateStr: string): string {
  const d = schoolDayStartUtcFromDateStr(dateStr);
  return `${MONTH_NAMES[d.getUTCMonth()]} ${ordinalSuffix(d.getUTCDate())}, ${d.getUTCFullYear()}`;
}

export interface CanteenRateConfig {
  pricingModel: 'Flat' | 'Class' | string;
  dailyRate: number;
  classRates: Record<string, number>;
}

/** Mirrors rate resolution in src/lib/billing.ts & src/lib/billing-server.ts. */
export function resolveStudentDailyRates(
  student: { uid: string; classId?: string },
  canteenConfig: CanteenRateConfig,
  transportRateMap: Map<string, number>
): { canteen: number; transport: number } {
  const canteen =
    canteenConfig.pricingModel === 'Flat'
      ? Number(canteenConfig.dailyRate) || 0
      : Number(canteenConfig.classRates?.[student.classId || '']) || 0;
  const transport = Number(transportRateMap.get(student.uid)) || 0;
  return { canteen, transport };
}

/** Mirrors restoreVoidedBill in src/lib/billing.ts & src/lib/billing-server.ts. */
export function buildRestoreVoidedPatch(
  prev: { amountPaid?: unknown; originalWaiverAmount?: unknown; waiverAmount?: unknown } | undefined,
  rate: number,
  restoredAtValue: unknown = FieldValue.serverTimestamp()
): Record<string, unknown> {
  const paid = Number(prev?.amountPaid) || 0;
  const waiver = Number(prev?.originalWaiverAmount ?? prev?.waiverAmount) || 0;
  return {
    billedAmount: rate,
    waiverAmount: waiver,
    voided: false,
    voidReason: null,
    restoredAt: restoredAtValue,
    status: rate - paid - waiver <= 0.001 ? 'Paid' : 'Unpaid',
  };
}

/**
 * Production `studentsMap` entries are objects `{ studentId, studentName, status, notes, ... }`
 * (see `daily-attendance-sheet.tsx`). Legacy/string entries are also supported defensively.
 */
export type AttendanceStudentEntry =
  | string
  | {
      status?: unknown;
      studentId?: unknown;
      studentName?: unknown;
      notes?: unknown;
      [key: string]: unknown;
    };

export function readAttendanceEntryStatus(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && 'status' in v) {
    const s = (v as { status?: unknown }).status;
    return typeof s === 'string' ? s : '';
  }
  return '';
}

export interface AggregatedAttendanceDoc {
  schoolId: string;
  classId: string;
  dateStr: string;
  studentsMap: Record<string, AttendanceStudentEntry>;
  totalStudents?: number;
}

/**
 * Attendance collection stores both per-student docs (`att-...`) and aggregated class docs
 * (`{schoolId}_{classId}_{dateStr}` with `studentsMap`). Trigger ONLY on aggregated class docs.
 */
export function isAggregatedClassAttendanceDoc(
  docId: string,
  data: Record<string, unknown> | null | undefined
): data is AggregatedAttendanceDoc & Record<string, unknown> {
  if (!docId || docId.startsWith('att-') || !data) return false;
  if (typeof data.schoolId !== 'string' || !data.schoolId) return false;
  if (typeof data.classId !== 'string' || !data.classId) return false;
  if (typeof data.dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.dateStr)) return false;
  if (!data.studentsMap || typeof data.studentsMap !== 'object' || Array.isArray(data.studentsMap)) return false;
  return true;
}

export function extractPresentStudentIds(
  studentsMap: Record<string, unknown> | undefined | null
): string[] {
  if (!studentsMap) return [];
  const ids: string[] = [];
  for (const [sid, entry] of Object.entries(studentsMap)) {
    const status = readAttendanceEntryStatus(entry);
    if (status === 'Present' || status === 'Late') ids.push(sid);
  }
  ids.sort();
  return ids;
}

export function extractAbsentStudentIds(
  studentsMap: Record<string, unknown> | undefined | null
): string[] {
  if (!studentsMap) return [];
  const ids: string[] = [];
  for (const [sid, entry] of Object.entries(studentsMap)) {
    const status = readAttendanceEntryStatus(entry);
    if (status === 'Absent' || status === 'Excused') ids.push(sid);
  }
  ids.sort();
  return ids;
}

export function hasPresentSetChanged(
  beforeMap: Record<string, unknown> | undefined | null,
  afterMap: Record<string, unknown> | undefined | null
): boolean {
  const before = extractPresentStudentIds(beforeMap);
  const after = extractPresentStudentIds(afterMap);
  if (before.length !== after.length) return true;
  for (let i = 0; i < before.length; i++) {
    if (before[i] !== after[i]) return true;
  }
  return false;
}

export function extractNewlyAbsentStudentIds(
  beforeMap: Record<string, unknown> | undefined | null,
  afterMap: Record<string, unknown> | undefined | null
): string[] {
  if (!beforeMap || !afterMap) return [];
  const newlyAbsent: string[] = [];
  for (const [sid, afterEntry] of Object.entries(afterMap)) {
    const beforeStatus = readAttendanceEntryStatus(beforeMap[sid]);
    const afterStatus = readAttendanceEntryStatus(afterEntry);
    const wasPresent = beforeStatus === 'Present' || beforeStatus === 'Late';
    const isNowAbsent = afterStatus === 'Absent' || afterStatus === 'Excused';
    if (wasPresent && isNowAbsent) newlyAbsent.push(sid);
  }
  newlyAbsent.sort();
  return newlyAbsent;
}

// ---------------------------------------------------------------------------
// Pure bill planner (shared by trigger, reconciler, and parity tests)
// ---------------------------------------------------------------------------

export interface BillableStudentRecord {
  uid: string;
  firstName?: string;
  lastName?: string;
  classId?: string;
  enrollmentStatus?: string;
  usesCanteen?: unknown;
  canteenBillingMode?: unknown;
  usesBusService?: unknown;
  transportBillingModel?: unknown;
  hasAccountCredit?: boolean;
}

export interface ExistingBillState {
  id: string;
  voided?: boolean;
  amountPaid?: number;
  waiverAmount?: number;
  originalWaiverAmount?: number;
  status?: string;
}

export type PlannedBillOp =
  | { kind: 'create'; billId: string; studentUid: string; service: 'Canteen' | 'Transport'; amount: number; data: Record<string, unknown>; creditPending: boolean }
  | { kind: 'restore'; billId: string; studentUid: string; service: 'Canteen' | 'Transport'; amount: number; patch: Record<string, unknown> };

export interface PlanSummary {
  ops: PlannedBillOp[];
  expectedBillCount: number;
  expectedCanteenCount: number;
  expectedTransportCount: number;
  existingActiveCount: number;
  skippedCount: number;
  creditPendingCount: number;
}

/**
 * Pure planner: given students, rates, and existing bill snapshots, computes exact create/restore ops.
 * Never overwrites an existing non-voided (or paid) bill.
 * Skips Inactive students and ineligible service subscribers.
 * Sets `creditPending: true` ONLY when `student.hasAccountCredit === true`.
 */
export function planDailyBillsForStudents(params: {
  students: BillableStudentRecord[];
  schoolId: string;
  dateStr: string;
  canteenConfig: CanteenRateConfig;
  transportRateMap: Map<string, number>;
  existingBills: Map<string, ExistingBillState>;
  termStamp: TermStamp | null;
  dueDateValue?: unknown;
  createdAtValue?: unknown;
}): PlanSummary {
  const {
    students,
    schoolId,
    dateStr,
    canteenConfig,
    transportRateMap,
    existingBills,
    termStamp,
  } = params;

  const dueDateValue = params.dueDateValue ?? Timestamp.fromDate(schoolDayStartUtcFromDateStr(dateStr));
  const createdAtValue = params.createdAtValue ?? FieldValue.serverTimestamp();
  const formattedDate = formatBillDisplayDate(dateStr);
  const termFields = termStamp ? { ...termStamp, isArchived: false } : { isArchived: false };

  const ops: PlannedBillOp[] = [];
  let expectedBillCount = 0;
  let expectedCanteenCount = 0;
  let expectedTransportCount = 0;
  let existingActiveCount = 0;
  let skippedCount = 0;
  let creditPendingCount = 0;

  for (const student of students) {
    if (!student?.uid) {
      skippedCount++;
      continue;
    }
    if (student.enrollmentStatus === 'Inactive') {
      skippedCount++;
      continue;
    }

    const billCanteen = shouldBillDailyCanteen(student);
    const billTransport = isDailyTransportSubscriber(student);
    const { canteen: canteenRate, transport: transportRate } = resolveStudentDailyRates(
      student,
      canteenConfig,
      transportRateMap
    );

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
        } else {
          existingActiveCount++;
          skippedCount++;
        }
      } else {
        const data: Record<string, unknown> = {
          studentId: student.uid,
          studentName,
          classId: student.classId || '',
          type: 'Canteen Fee (Daily)',
          description: `Canteen - ${formattedDate}`,
          billedAmount: canteenRate,
          amountPaid: 0,
          waiverAmount: 0,
          status: 'Unpaid',
          dueDate: dueDateValue,
          createdAt: createdAtValue,
          schoolId,
          ...termFields,
          ...(hasCredit ? { creditPending: true } : {}),
        };
        if (hasCredit) creditPendingCount++;
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
        } else {
          existingActiveCount++;
          skippedCount++;
        }
      } else {
        const data: Record<string, unknown> = {
          studentId: student.uid,
          studentName,
          classId: student.classId || '',
          type: 'Transport Fee (Daily)',
          description: `Transport - ${formattedDate}`,
          billedAmount: transportRate,
          amountPaid: 0,
          waiverAmount: 0,
          status: 'Unpaid',
          dueDate: dueDateValue,
          createdAt: createdAtValue,
          schoolId,
          ...termFields,
          ...(hasCredit ? { creditPending: true } : {}),
        };
        if (hasCredit) creditPendingCount++;
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

function isAlreadyExistsError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: unknown; message?: unknown };
  if (e.code === 6 || e.code === 'already-exists' || e.code === 'ALREADY_EXISTS') return true;
  if (typeof e.message === 'string' && e.message.toUpperCase().includes('ALREADY_EXISTS')) return true;
  return false;
}

export interface SchoolBillingContext {
  mode: ServerDailyBillingMode;
  canteenConfig: CanteenRateConfig;
  transportRateMap: Map<string, number>;
  termStamp: TermStamp | null;
}

export async function loadSchoolBillingContext(
  db: FirebaseFirestore.Firestore,
  schoolId: string,
  config: DailyBillingRuntimeConfig
): Promise<SchoolBillingContext> {
  const [settingsSnap, schoolSnap, canteenSnap, routesSnap] = await Promise.all([
    db.collection('schoolSettings').doc(schoolId).get(),
    db.collection('schools').doc(schoolId).get(),
    db.collection('schoolSettings').doc(schoolId).collection('rates').doc('canteen').get(),
    db.collection('routes').where('schoolId', '==', schoolId).get(),
  ]);

  const settingsData = settingsSnap.exists ? (settingsSnap.data() as Record<string, unknown>) : null;
  const schoolData = schoolSnap.exists ? (schoolSnap.data() as Record<string, unknown>) : null;
  const mode = resolveSchoolBillingMode(settingsData, schoolId, config);

  const canteenData = canteenSnap.exists ? (canteenSnap.data() as Record<string, unknown>) : null;
  const canteenConfig: CanteenRateConfig = {
    pricingModel: String(canteenData?.pricingModel || 'Flat'),
    dailyRate: Number(canteenData?.dailyRate) || 0,
    classRates: (canteenData?.classRates as Record<string, number>) || {},
  };

  const transportRateMap = new Map<string, number>();
  for (const d of routesSnap.docs) {
    const data = d.data();
    const dailyRate = Number(data.dailyRate) || 0;
    const stops = Array.isArray(data.stops) ? data.stops : [];
    for (const stop of stops) {
      const assigned = Array.isArray(stop?.assignedStudentIds) ? stop.assignedStudentIds : [];
      for (const sid of assigned) {
        transportRateMap.set(String(sid), dailyRate);
      }
    }
  }

  // Share the exact canonical term stamp logic with the web app (`./term-utils`).
  const termStamp = currentTermFromProfile(schoolData) ?? currentTermFromProfile(settingsData);

  return { mode, canteenConfig, transportRateMap, termStamp };
}

export async function fetchStudentsByIds(
  db: FirebaseFirestore.Firestore,
  studentIds: string[]
): Promise<BillableStudentRecord[]> {
  if (studentIds.length === 0) return [];
  const refs = studentIds.map(uid => db.collection('students').doc(uid));
  const snaps = await db.getAll(...refs);
  const out: BillableStudentRecord[] = [];
  for (const s of snaps) {
    if (!s.exists) continue;
    const data = s.data() as Record<string, unknown>;
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

export async function fetchExistingDailyBills(
  db: FirebaseFirestore.Firestore,
  studentIds: string[],
  dateStr: string
): Promise<Map<string, ExistingBillState>> {
  const map = new Map<string, ExistingBillState>();
  if (studentIds.length === 0) return map;
  const refs = studentIds.flatMap(uid => [
    db.collection('financialRecords').doc(canteenBillId(uid, dateStr)),
    db.collection('financialRecords').doc(transportBillId(uid, dateStr)),
  ]);
  const snaps = await db.getAll(...refs);
  for (const s of snaps) {
    if (!s.exists) continue;
    const d = s.data() as Record<string, unknown>;
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

export interface ExecutionCounters {
  expected: number;
  existing: number;
  created: number;
  restored: number;
  skipped: number;
  failed: number;
  failedStudentIds: string[];
  creditPendingCount: number;
  batchCommits: number;
  dryRun: boolean;
}

/**
 * Executes planned create/restore ops safely:
 *   - Uses `batch.create()` for missing docs (never blind `set`).
 *   - Max 200 ops per batch (a 35-student class = at most 1 batch).
 *   - If a batch throws `ALREADY_EXISTS` (concurrent race with client fast-path),
 *     retries each op individually and treats `ALREADY_EXISTS` as a benign skip.
 *   - When `dryRun` is true, writes nothing and returns intended counts.
 */
export async function executePlannedBillOps(params: {
  db: FirebaseFirestore.Firestore;
  plan: PlanSummary;
  dryRun: boolean;
}): Promise<ExecutionCounters> {
  const { db, plan, dryRun } = params;

  if (dryRun) {
    let wouldCreate = 0;
    let wouldRestore = 0;
    for (const op of plan.ops) {
      if (op.kind === 'create') wouldCreate++;
      else wouldRestore++;
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
  const failedStudentSet = new Set<string>();

  for (let i = 0; i < plan.ops.length; i += MAX_OPS_PER_BATCH) {
    const chunk = plan.ops.slice(i, i + MAX_OPS_PER_BATCH);
    const batch = db.batch();
    for (const op of chunk) {
      const ref = db.collection('financialRecords').doc(op.billId);
      if (op.kind === 'create') batch.create(ref, op.data);
      else batch.update(ref, op.patch);
    }

    try {
      await batch.commit();
      batchCommits++;
      for (const op of chunk) {
        if (op.kind === 'create') created++;
        else restored++;
      }
    } catch (batchErr) {
      // Concurrent client fast-path may have created one of the bills between getAll and commit.
      // Retry each op in this chunk individually; ALREADY_EXISTS on create is a benign skip.
      for (const op of chunk) {
        const ref = db.collection('financialRecords').doc(op.billId);
        try {
          if (op.kind === 'create') {
            await ref.create(op.data);
            created++;
          } else {
            await ref.update(op.patch);
            restored++;
          }
        } catch (opErr) {
          if (op.kind === 'create' && isAlreadyExistsError(opErr)) {
            skipped++;
          } else {
            failed++;
            failedStudentSet.add(op.studentUid);
          }
        }
      }
      if (!isAlreadyExistsError(batchErr)) {
        console.warn('[daily-billing] Batch fallback triggered by non-ALREADY_EXISTS error', {
          chunkSize: chunk.length,
          errorCode: (batchErr as { code?: unknown })?.code ?? 'unknown',
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
async function countWouldDeleteForAbsentStudents(
  db: FirebaseFirestore.Firestore,
  absentStudentIds: string[],
  dateStr: string
): Promise<number> {
  if (absentStudentIds.length === 0) return 0;
  const existing = await fetchExistingDailyBills(db, absentStudentIds, dateStr);
  let wouldDelete = 0;
  for (const bill of existing.values()) {
    if (bill.voided) continue;
    const paid = Number(bill.amountPaid) || 0;
    const waiver = Number(bill.waiverAmount) || 0;
    if (paid + waiver <= 0.009) wouldDelete++;
  }
  return wouldDelete;
}

const defaultSleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Core trigger handler (exported for unit testing)
// ---------------------------------------------------------------------------

export async function handleAggregatedAttendanceWrite(params: {
  db: FirebaseFirestore.Firestore;
  docId: string;
  beforeData: Record<string, unknown> | null | undefined;
  afterData: Record<string, unknown> | null | undefined;
  config?: DailyBillingRuntimeConfig;
  delayMs?: number;
  sleep?: (ms: number) => Promise<void>;
  logger?: Pick<Console, 'info' | 'warn'>;
}): Promise<{ ran: boolean; mode?: ServerDailyBillingMode; reason?: string; counters?: ExecutionCounters; wouldDeleteCount?: number }> {
  const { db, docId, beforeData, afterData } = params;
  const config = params.config ?? getDailyBillingRuntimeConfig();
  const delayMs = params.delayMs ?? 0;
  const sleep = params.sleep ?? defaultSleep;
  const log = params.logger ?? console;

  if (!isAggregatedClassAttendanceDoc(docId, afterData)) {
    return { ran: false, reason: 'not-aggregated-class-doc' };
  }

  const { schoolId, classId, dateStr, studentsMap } = afterData;
  if (!config.enabled) {
    return { ran: false, reason: 'env-kill-switch-off' };
  }

  const beforeMap =
    beforeData && typeof beforeData.studentsMap === 'object' && beforeData.studentsMap !== null
      ? (beforeData.studentsMap as Record<string, unknown>)
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
  const wouldDeleteCount =
    newlyAbsentIds.length > 0 ? await countWouldDeleteForAbsentStudents(db, newlyAbsentIds, dateStr) : 0;

  let counters: ExecutionCounters | undefined;
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
    created: counters?.created ?? 0,
    restored: counters?.restored ?? 0,
    skipped: counters?.skipped ?? 0,
    failed: counters?.failed ?? 0,
    creditPendingCount: counters?.creditPendingCount ?? 0,
    wouldDeleteCount,
  });

  return { ran: true, mode: ctx.mode, counters, wouldDeleteCount };
}

// ---------------------------------------------------------------------------
// Core scheduled reconciliation handler (exported for unit testing)
// ---------------------------------------------------------------------------

export interface CountCheckResult {
  canteenActiveCount: number;
  transportActiveCount: number;
  expectedCanteenCount: number;
  expectedTransportCount: number;
  matched: boolean;
}

/**
 * Count-first check for 11:30 and 14:00 runs:
 *   1. Counts total & voided daily bills per service via 1-read Firestore `.count()` aggregations.
 *   2. Checks deterministic bill IDs of ABSENT/EXCUSED students (~20 reads) to count any unvoided
 *      bills belonging to students no longer Present/Late (e.g. a paid bill for a student later
 *      marked absent), subtracting them so they can NEVER mask a missing bill for a Present student.
 *   3. Returns matched=true ONLY when effectivePresentActiveCount === expectedCount for BOTH services.
 */
export async function checkSchoolBillCounts(params: {
  db: FirebaseFirestore.Firestore;
  schoolId: string;
  dateStr: string;
  expectedCanteenCount: number;
  expectedTransportCount: number;
  absentStudentIds: string[];
}): Promise<CountCheckResult> {
  const { db, schoolId, dateStr, expectedCanteenCount, expectedTransportCount, absentStudentIds } = params;
  const dueTs = Timestamp.fromDate(schoolDayStartUtcFromDateStr(dateStr));
  const fin = db.collection('financialRecords');

  const [canteenTotalSnap, canteenVoidedSnap, transportTotalSnap, transportVoidedSnap, absentBills] =
    await Promise.all([
      fin.where('schoolId', '==', schoolId).where('type', '==', 'Canteen Fee (Daily)').where('dueDate', '==', dueTs).count().get(),
      fin.where('schoolId', '==', schoolId).where('type', '==', 'Canteen Fee (Daily)').where('dueDate', '==', dueTs).where('voided', '==', true).count().get(),
      fin.where('schoolId', '==', schoolId).where('type', '==', 'Transport Fee (Daily)').where('dueDate', '==', dueTs).count().get(),
      fin.where('schoolId', '==', schoolId).where('type', '==', 'Transport Fee (Daily)').where('dueDate', '==', dueTs).where('voided', '==', true).count().get(),
      fetchExistingDailyBills(db, absentStudentIds, dateStr),
    ]);

  let unvoidedAbsentCanteen = 0;
  let unvoidedAbsentTransport = 0;
  for (const [id, bill] of absentBills.entries()) {
    if (bill.voided === true) continue;
    if (id.startsWith('canteen-')) unvoidedAbsentCanteen++;
    else if (id.startsWith('transport-')) unvoidedAbsentTransport++;
  }

  const canteenActiveCount = Math.max(
    0,
    canteenTotalSnap.data().count - canteenVoidedSnap.data().count - unvoidedAbsentCanteen
  );
  const transportActiveCount = Math.max(
    0,
    transportTotalSnap.data().count - transportVoidedSnap.data().count - unvoidedAbsentTransport
  );

  const matched =
    canteenActiveCount === expectedCanteenCount &&
    transportActiveCount === expectedTransportCount;

  return {
    canteenActiveCount,
    transportActiveCount,
    expectedCanteenCount,
    expectedTransportCount,
    matched,
  };
}

export interface SchoolReconcileSummary {
  schoolId: string;
  dateStr: string;
  billingMode: ServerDailyBillingMode;
  mode: 'count-skipped' | 'full-lookup';
  expected: number;
  existing: number;
  created: number;
  restored: number;
  failed: number;
  failedStudentIds: string[];
  creditPendingCount: number;
  dryRun: boolean;
}

async function queryAggregatedAttendanceDocsForDate(
  db: FirebaseFirestore.Firestore,
  dateStr: string,
  config: DailyBillingRuntimeConfig
): Promise<Array<{ id: string; data: Record<string, unknown> }>> {
  // When an allowlist is set, push `schoolId in [...]` down to Firestore so other schools' docs are never read.
  if (config.allowlist && config.allowlist.size > 0) {
    const ids = Array.from(config.allowlist);
    const results: Array<{ id: string; data: Record<string, unknown> }> = [];
    for (let i = 0; i < ids.length; i += 30) {
      const chunk = ids.slice(i, i + 30);
      const snap = await db
        .collection('attendance')
        .where('schoolId', 'in', chunk)
        .where('dateStr', '==', dateStr)
        .where('totalStudents', '>', 0)
        .get();
      for (const d of snap.docs) {
        results.push({ id: d.id, data: d.data() as Record<string, unknown> });
      }
    }
    return results;
  }

  const snap = await db
    .collection('attendance')
    .where('dateStr', '==', dateStr)
    .where('totalStudents', '>', 0)
    .get();
  return snap.docs.map(d => ({ id: d.id, data: d.data() as Record<string, unknown> }));
}

export async function runDailyReconciliation(params: {
  db: FirebaseFirestore.Firestore;
  dateStr?: string;
  forceFullLookup: boolean;
  scheduleLabel: '11:30' | '14:00' | '18:00';
  config?: DailyBillingRuntimeConfig;
  logger?: Pick<Console, 'info' | 'warn'>;
}): Promise<SchoolReconcileSummary[]> {
  const { db, forceFullLookup, scheduleLabel } = params;
  const dateStr = params.dateStr ?? schoolTodayDateStrUtc();
  const config = params.config ?? getDailyBillingRuntimeConfig();
  const log = params.logger ?? console;

  if (!config.enabled) {
    log.info('[daily-billing:reconcile] Disabled by env flag', { dateStr, scheduleLabel });
    return [];
  }

  // Derive expected bills strictly from aggregated attendance class docs (never canteen_headcounts).
  const attDocs = await queryAggregatedAttendanceDocsForDate(db, dateStr, config);

  const bySchool = new Map<string, { presentIds: Set<string>; absentIds: Set<string> }>();
  for (const d of attDocs) {
    if (!isAggregatedClassAttendanceDoc(d.id, d.data)) continue;

    let bucket = bySchool.get(d.data.schoolId);
    if (!bucket) {
      bucket = { presentIds: new Set<string>(), absentIds: new Set<string>() };
      bySchool.set(d.data.schoolId, bucket);
    }
    for (const sid of extractPresentStudentIds(d.data.studentsMap)) bucket.presentIds.add(sid);
    for (const sid of extractAbsentStudentIds(d.data.studentsMap)) bucket.absentIds.add(sid);
  }

  // Ensure any student marked Present in one class isn't also in absentIds
  for (const bucket of bySchool.values()) {
    for (const sid of bucket.presentIds) bucket.absentIds.delete(sid);
  }

  const summaries: SchoolReconcileSummary[] = [];

  for (const [schoolId, bucket] of bySchool.entries()) {
    const presentIds = Array.from(bucket.presentIds).sort();
    const absentIds = Array.from(bucket.absentIds).sort();
    if (presentIds.length === 0) continue;

    const ctx = await loadSchoolBillingContext(db, schoolId, config);
    if (ctx.mode === 'off') continue;
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
        const summary: SchoolReconcileSummary = {
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
          await db.collection('billingReconciliation').doc(`${schoolId}_${dateStr}`).set(
            {
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
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
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
    const summary: SchoolReconcileSummary = {
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
      await db.collection('billingReconciliation').doc(`${schoolId}_${dateStr}`).set(
        {
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
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
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

export const onAttendanceWrittenBill = onDocumentWritten(
  {
    document: 'attendance/{docId}',
    region: DAILY_BILLING_REGION,
    retry: false,
    maxInstances: 20,
    timeoutSeconds: 90,
  },
  async (event) => {
    const docId = event.params.docId;
    const beforeData = event.data?.before.exists
      ? (event.data.before.data() as Record<string, unknown>)
      : null;
    const afterData = event.data?.after.exists
      ? (event.data.after.data() as Record<string, unknown>)
      : null;

    await handleAggregatedAttendanceWrite({
      db: defaultDb,
      docId,
      beforeData,
      afterData,
      delayMs: CLIENT_FAST_PATH_DELAY_MS,
    });
  }
);

export const reconcileDailyBillsMidday = onSchedule(
  {
    schedule: '30 11 * * 1-5',
    timeZone: 'Africa/Accra',
    region: DAILY_BILLING_REGION,
    retryCount: 0,
    maxInstances: 5,
    timeoutSeconds: 180,
  },
  async () => {
    await runDailyReconciliation({
      db: defaultDb,
      forceFullLookup: false,
      scheduleLabel: '11:30',
    });
  }
);

export const reconcileDailyBillsAfternoon = onSchedule(
  {
    schedule: '0 14 * * 1-5',
    timeZone: 'Africa/Accra',
    region: DAILY_BILLING_REGION,
    retryCount: 0,
    maxInstances: 5,
    timeoutSeconds: 180,
  },
  async () => {
    await runDailyReconciliation({
      db: defaultDb,
      forceFullLookup: false,
      scheduleLabel: '14:00',
    });
  }
);

export const reconcileDailyBillsEvening = onSchedule(
  {
    schedule: '0 18 * * 1-5',
    timeZone: 'Africa/Accra',
    region: DAILY_BILLING_REGION,
    retryCount: 0,
    maxInstances: 5,
    timeoutSeconds: 180,
  },
  async () => {
    await runDailyReconciliation({
      db: defaultDb,
      forceFullLookup: true,
      scheduleLabel: '18:00',
    });
  }
);

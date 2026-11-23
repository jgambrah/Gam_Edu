import { describe, it, expect, vi } from 'vitest';
import {
  shouldBillDailyCanteen as clientShouldBillDailyCanteen,
  isDailyTransportSubscriber as clientIsDailyTransportSubscriber,
} from '@/lib/billing-predicates';
import { schoolDayDateStrUtc, schoolDayStartUtcFromInstant } from '@/lib/attendance-date';
import { currentTermFromProfile as clientCurrentTermFromProfile } from '@/lib/term';
import { format } from 'date-fns';
import {
  shouldBillDailyCanteen as fnShouldBillDailyCanteen,
  isDailyTransportSubscriber as fnIsDailyTransportSubscriber,
  canteenBillId,
  transportBillId,
  schoolDayStartUtcFromDateStr,
  formatBillDisplayDate,
  resolveStudentDailyRates,
  buildRestoreVoidedPatch,
  resolveSchoolBillingMode,
  extractPresentStudentIds,
  extractAbsentStudentIds,
  hasPresentSetChanged,
  extractNewlyAbsentStudentIds,
  planDailyBillsForStudents,
  executePlannedBillOps,
  handleAggregatedAttendanceWrite,
  runDailyReconciliation,
  loadSchoolBillingContext,
  type BillableStudentRecord,
  type DailyBillingRuntimeConfig,
  type ExistingBillState,
} from '../../functions/src/daily-billing';

// ---------------------------------------------------------------------------
// Production-shaped anonymized attendance fixture (copied from Mercy's Springfield
// aggregated class attendance doc `<schoolId>_<classId>_2026-11-23`).
// ---------------------------------------------------------------------------

function makeProdAttendanceEntry(
  studentId: string,
  status: 'Present' | 'Late' | 'Absent' | 'Excused',
  opts: { studentName?: string; usesCanteen?: string; usesBusService?: string; canteenEligible?: boolean } = {}
) {
  return {
    studentId,
    studentName: opts.studentName ?? `Student ${studentId}`,
    status,
    notes: '',
    usesCanteen: opts.usesCanteen ?? 'true',
    usesBusService: opts.usesBusService ?? 'false',
    canteenEligible: opts.canteenEligible ?? true,
  };
}

function makeProdAggregatedAttendanceDoc(params: {
  schoolId: string;
  classId: string;
  dateStr: string;
  entries: Array<{ uid: string; status: 'Present' | 'Late' | 'Absent' | 'Excused'; name?: string }>;
}) {
  const { schoolId, classId, dateStr, entries } = params;
  const studentsMap: Record<string, ReturnType<typeof makeProdAttendanceEntry>> = {};
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;
  for (const e of entries) {
    studentsMap[e.uid] = makeProdAttendanceEntry(e.uid, e.status, { studentName: e.name });
    if (e.status === 'Present') presentCount++;
    else if (e.status === 'Late') lateCount++;
    else if (e.status === 'Absent') absentCount++;
    else if (e.status === 'Excused') excusedCount++;
  }
  return {
    id: `${schoolId}_${classId}_${dateStr}`,
    schoolId,
    classId,
    className: 'Grade 4 Daisy',
    dateStr,
    totalStudents: entries.length,
    presentCount,
    absentCount,
    lateCount,
    excusedCount,
    canteenMealsCount: presentCount + lateCount,
    studentsMap,
  };
}

// ---------------------------------------------------------------------------
// Minimal in-memory Firestore Admin fake (supports getAll, batch create/update,
// where `==`, `>`, `in`, `.count().get()`, and read/write telemetry)
// ---------------------------------------------------------------------------

interface FakeDocEntry {
  data: Record<string, any>;
}

function createFakeAdminDb(initialCollections: Record<string, Record<string, Record<string, any>>> = {}) {
  const store = new Map<string, Map<string, FakeDocEntry>>();
  for (const [col, docs] of Object.entries(initialCollections)) {
    const m = new Map<string, FakeDocEntry>();
    for (const [id, data] of Object.entries(docs)) {
      m.set(id, { data: { ...data } });
    }
    store.set(col, m);
  }

  const stats = {
    getAllCalls: 0,
    getAllDocCount: 0,
    countQueries: 0,
    batchCommits: 0,
    creates: 0,
    updates: 0,
    sets: 0,
    deletes: 0,
    queries: [] as Array<{ col: string; filters: Array<{ field: string; op: string; value: any }> }>,
  };

  const getColMap = (path: string) => {
    let m = store.get(path);
    if (!m) {
      m = new Map();
      store.set(path, m);
    }
    return m;
  };

  const makeDocRef = (colPath: string, id: string): any => ({
    id,
    path: `${colPath}/${id}`,
    _colPath: colPath,
    collection: (sub: string) => makeColRef(`${colPath}/${id}/${sub}`),
    get: async () => {
      const entry = getColMap(colPath).get(id);
      return { id, exists: Boolean(entry), data: () => (entry ? { ...entry.data } : undefined) };
    },
    create: async (data: Record<string, any>) => {
      const m = getColMap(colPath);
      if (m.has(id)) {
        const err: any = new Error(`6 ALREADY_EXISTS: Document already exists: ${colPath}/${id}`);
        err.code = 6;
        throw err;
      }
      m.set(id, { data: { ...data } });
      stats.creates++;
    },
    update: async (patch: Record<string, any>) => {
      const m = getColMap(colPath);
      const prev = m.get(id);
      if (!prev) throw new Error(`NOT_FOUND: ${colPath}/${id}`);
      m.set(id, { data: { ...prev.data, ...patch } });
      stats.updates++;
    },
    set: async (data: Record<string, any>, opts?: { merge?: boolean }) => {
      const m = getColMap(colPath);
      const prev = m.get(id);
      m.set(id, { data: opts?.merge && prev ? { ...prev.data, ...data } : { ...data } });
      stats.sets++;
    },
    delete: async () => {
      getColMap(colPath).delete(id);
      stats.deletes++;
    },
  });

  const matchVal = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a?.toMillis && b?.toMillis) return a.toMillis() === b.toMillis();
    if (a instanceof Date && b?.toDate) return a.getTime() === b.toDate().getTime();
    if (b instanceof Date && a?.toDate) return b.getTime() === a.toDate().getTime();
    return false;
  };

  const makeQuery = (colPath: string, filters: Array<{ field: string; op: string; value: any }>): any => {
    const evalDocs = () => {
      const m = getColMap(colPath);
      const matched: Array<{ id: string; data: () => Record<string, any> }> = [];
      for (const [id, entry] of m.entries()) {
        const ok = filters.every(f => {
          const v = entry.data[f.field];
          if (f.op === '==') return matchVal(v, f.value);
          if (f.op === '>') return typeof v === 'number' && v > f.value;
          if (f.op === 'in') return Array.isArray(f.value) && f.value.includes(v);
          return false;
        });
        if (ok) matched.push({ id, data: () => ({ ...entry.data }) });
      }
      return matched;
    };

    return {
      where: (field: string, op: string, value: any) => makeQuery(colPath, [...filters, { field, op, value }]),
      get: async () => {
        stats.queries.push({ col: colPath, filters });
        const docs = evalDocs();
        return { docs, size: docs.length, empty: docs.length === 0 };
      },
      count: () => ({
        get: async () => {
          stats.countQueries++;
          stats.queries.push({ col: colPath, filters });
          const docs = evalDocs();
          return { data: () => ({ count: docs.length }) };
        },
      }),
    };
  };

  const makeColRef = (colPath: string): any => ({
    doc: (id: string) => makeDocRef(colPath, id),
    where: (field: string, op: string, value: any) => makeQuery(colPath, [{ field, op, value }]),
    get: async () => makeQuery(colPath, []).get(),
  });

  const db: any = {
    collection: (colPath: string) => makeColRef(colPath),
    getAll: async (...refs: any[]) => {
      stats.getAllCalls++;
      stats.getAllDocCount += refs.length;
      return refs.map(r => {
        const entry = getColMap(r._colPath).get(r.id);
        return { id: r.id, exists: Boolean(entry), data: () => (entry ? { ...entry.data } : undefined) };
      });
    },
    batch: () => {
      const ops: Array<{ kind: 'create' | 'update'; ref: any; data: Record<string, any> }> = [];
      return {
        create: (ref: any, data: Record<string, any>) => ops.push({ kind: 'create', ref, data }),
        update: (ref: any, data: Record<string, any>) => ops.push({ kind: 'update', ref, data }),
        commit: async () => {
          for (const op of ops) {
            if (op.kind === 'create' && getColMap(op.ref._colPath).has(op.ref.id)) {
              const err: any = new Error(`6 ALREADY_EXISTS: ${op.ref.path}`);
              err.code = 6;
              throw err;
            }
          }
          for (const op of ops) {
            if (op.kind === 'create') {
              getColMap(op.ref._colPath).set(op.ref.id, { data: { ...op.data } });
              stats.creates++;
            } else {
              const prev = getColMap(op.ref._colPath).get(op.ref.id);
              getColMap(op.ref._colPath).set(op.ref.id, { data: { ...(prev?.data || {}), ...op.data } });
              stats.updates++;
            }
          }
          stats.batchCommits++;
        },
      };
    },
    _store: store,
    _stats: stats,
  };

  return db;
}

// ---------------------------------------------------------------------------
// 1. Parity Tests: src/lib/* vs functions/src/daily-billing.ts
// ---------------------------------------------------------------------------

describe('Daily Billing Parity (src/lib vs functions/src/daily-billing.ts)', () => {
  it('matches shouldBillDailyCanteen and isDailyTransportSubscriber across all student fixtures', () => {
    const fixtures = [
      null,
      undefined,
      {},
      { usesCanteen: true, canteenBillingMode: 'Daily' },
      { usesCanteen: undefined, canteenBillingMode: undefined },
      { usesCanteen: false, canteenBillingMode: 'Daily' },
      { usesCanteen: true, canteenBillingMode: 'None' },
      { usesCanteen: true, canteenBillingMode: 'Termly' },
      { usesBusService: true, transportBillingModel: 'Daily' },
      { usesBusService: true, transportBillingModel: 'Termly' },
      { usesBusService: true, transportBillingModel: undefined },
      { usesBusService: false, transportBillingModel: 'Daily' },
      { usesCanteen: true, canteenBillingMode: 'Daily', usesBusService: true, transportBillingModel: 'Daily' },
    ];

    for (const f of fixtures) {
      expect(fnShouldBillDailyCanteen(f as any)).toBe(clientShouldBillDailyCanteen(f as any));
      expect(fnIsDailyTransportSubscriber(f as any)).toBe(clientIsDailyTransportSubscriber(f as any));
    }
  });

  it('matches deterministic bill IDs, UTC midnight dueDate, and display date format', () => {
    const instant = new Date('2026-11-23T14:31:00.000Z');
    const dateStr = schoolDayDateStrUtc(instant);
    expect(dateStr).toBe('2026-11-23');
    expect(schoolDayStartUtcFromDateStr(dateStr).toISOString()).toBe(
      schoolDayStartUtcFromInstant(instant).toISOString()
    );
    expect(canteenBillId('stu-1', dateStr)).toBe('canteen-stu-1-2026-11-23');
    expect(transportBillId('stu-1', dateStr)).toBe('transport-stu-1-2026-11-23');

    const utcDate = schoolDayStartUtcFromDateStr(dateStr);
    const localMirror = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
    expect(formatBillDisplayDate(dateStr)).toBe(format(localMirror, 'PPP'));
    expect(formatBillDisplayDate('2026-11-01')).toBe('November 1st, 2026');
    expect(formatBillDisplayDate('2026-11-02')).toBe('November 2nd, 2026');
    expect(formatBillDisplayDate('2026-11-03')).toBe('November 3rd, 2026');
    expect(formatBillDisplayDate('2026-11-11')).toBe('November 11th, 2026');
  });

  it('produces identical canonical termId / academicYear / term as client fetchCurrentTermStamp (currentTermFromProfile)', async () => {
    const schoolProfile = { academicYear: '2025/2026', term: 'First Term' };
    const clientStamp = clientCurrentTermFromProfile(schoolProfile);
    expect(clientStamp).toEqual({
      termId: '2025-2026_T1',
      academicYear: '2025-2026',
      term: 'First Term',
    });

    const db = createFakeAdminDb({
      schoolSettings: { s1: { serverDailyBillingMode: 'live' } },
      schools: { s1: schoolProfile },
      'schoolSettings/s1/rates': { canteen: { pricingModel: 'Flat', dailyRate: 9, classRates: {} } },
    });

    const ctx = await loadSchoolBillingContext(db, 's1', { enabled: true, allowlist: new Set(['s1']) });
    expect(ctx.termStamp).toEqual(clientStamp);

    const plan = planDailyBillsForStudents({
      students: [{ uid: 'stu-1', firstName: 'A', lastName: 'B', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' }],
      schoolId: 's1',
      dateStr: '2026-11-23',
      canteenConfig: ctx.canteenConfig,
      transportRateMap: ctx.transportRateMap,
      existingBills: new Map(),
      termStamp: ctx.termStamp,
    });

    const createOp = plan.ops[0];
    expect(createOp.kind).toBe('create');
    if (createOp.kind === 'create') {
      expect(createOp.data.termId).toBe('2025-2026_T1');
      expect(createOp.data.academicYear).toBe('2025-2026');
      expect(createOp.data.term).toBe('First Term');
    }
  });

  it('extracts Present/Late/Absent from production object-valued studentsMap (fails if string-only comparison were used)', () => {
    const prodDoc = makeProdAggregatedAttendanceDoc({
      schoolId: 'school-1',
      classId: '9zuqYrwKDNpAD33ObzjK',
      dateStr: '2026-11-23',
      entries: [
        { uid: 'stu-1', status: 'Present' },
        { uid: 'stu-2', status: 'Late' },
        { uid: 'stu-3', status: 'Absent' },
        { uid: 'stu-4', status: 'Excused' },
      ],
    });

    // Guard: confirm our fixture uses real object entries (not bare strings) so a string-only bug would return []
    expect(typeof prodDoc.studentsMap['stu-1']).toBe('object');
    expect(String(prodDoc.studentsMap['stu-1'])).not.toBe('Present');

    expect(extractPresentStudentIds(prodDoc.studentsMap)).toEqual(['stu-1', 'stu-2']);
    expect(extractAbsentStudentIds(prodDoc.studentsMap)).toEqual(['stu-3', 'stu-4']);

    // Mutate stu-1 -> Absent
    const updatedDoc = makeProdAggregatedAttendanceDoc({
      schoolId: 'school-1',
      classId: '9zuqYrwKDNpAD33ObzjK',
      dateStr: '2026-11-23',
      entries: [
        { uid: 'stu-1', status: 'Absent' },
        { uid: 'stu-2', status: 'Late' },
        { uid: 'stu-3', status: 'Absent' },
        { uid: 'stu-4', status: 'Excused' },
      ],
    });
    expect(hasPresentSetChanged(prodDoc.studentsMap, updatedDoc.studentsMap)).toBe(true);
    expect(extractNewlyAbsentStudentIds(prodDoc.studentsMap, updatedDoc.studentsMap)).toEqual(['stu-1']);
    expect(hasPresentSetChanged(prodDoc.studentsMap, prodDoc.studentsMap)).toBe(false);
  });

  it('matches Flat vs Class canteen rates and voided-bill restoration patch', () => {
    const flatRates = resolveStudentDailyRates(
      { uid: 's1', classId: 'g4' },
      { pricingModel: 'Flat', dailyRate: 10, classRates: { g4: 15 } },
      new Map([['s1', 7]])
    );
    expect(flatRates).toEqual({ canteen: 10, transport: 7 });

    const classRates = resolveStudentDailyRates(
      { uid: 's1', classId: 'g4' },
      { pricingModel: 'Class', dailyRate: 10, classRates: { g4: 15 } },
      new Map()
    );
    expect(classRates).toEqual({ canteen: 15, transport: 0 });

    const unpaidRestore = buildRestoreVoidedPatch({ amountPaid: 0, originalWaiverAmount: 0 }, 9, 'TS');
    expect(unpaidRestore).toEqual({
      billedAmount: 9,
      waiverAmount: 0,
      voided: false,
      voidReason: null,
      restoredAt: 'TS',
      status: 'Unpaid',
    });

    const paidRestore = buildRestoreVoidedPatch({ amountPaid: 9, originalWaiverAmount: 0 }, 9, 'TS');
    expect(paidRestore.status).toBe('Paid');
  });
});

// ---------------------------------------------------------------------------
// 2. Core Billing Behavior, Modes, Delay, Allowlist & Safety Tests
// ---------------------------------------------------------------------------

describe('Durable Daily Billing Execution & Edge Cases', () => {
  const schoolId = 'oHr3BrGdK2eS5MQ5zmZU';
  const dateStr = '2026-11-23';
  const defaultConfig: DailyBillingRuntimeConfig = {
    enabled: true,
    allowlist: new Set([schoolId]),
  };

  it('resolves per-school serverDailyBillingMode without redeploying (default dry-run for allowlist, off otherwise)', () => {
    expect(resolveSchoolBillingMode(null, schoolId, defaultConfig)).toBe('dry-run');
    expect(resolveSchoolBillingMode(null, 'other-school', defaultConfig)).toBe('off');
    expect(resolveSchoolBillingMode({ serverDailyBillingMode: 'live' }, schoolId, defaultConfig)).toBe('live');
    expect(resolveSchoolBillingMode({ serverDailyBillingMode: 'off' }, schoolId, defaultConfig)).toBe('off');
    expect(resolveSchoolBillingMode({ serverDailyBillingMode: 'live' }, 'other-school', defaultConfig)).toBe('live');
    // Global env kill switch overrides even explicit 'live'
    expect(resolveSchoolBillingMode({ serverDailyBillingMode: 'live' }, schoolId, { enabled: false, allowlist: new Set([schoolId]) })).toBe('off');
  });

  it('bills a 35-student class in at most 1 Firestore batch commit', async () => {
    const students: BillableStudentRecord[] = Array.from({ length: 35 }, (_, i) => ({
      uid: `stu-${i + 1}`,
      firstName: `First${i + 1}`,
      lastName: `Last${i + 1}`,
      classId: 'grade-4-daisy',
      usesCanteen: true,
      canteenBillingMode: 'Daily',
    }));

    const db = createFakeAdminDb();
    const plan = planDailyBillsForStudents({
      students,
      schoolId,
      dateStr,
      canteenConfig: { pricingModel: 'Flat', dailyRate: 9, classRates: {} },
      transportRateMap: new Map(),
      existingBills: new Map(),
      termStamp: { termId: '2025-2026_T1', academicYear: '2025-2026', term: 'First Term' },
    });

    const counters = await executePlannedBillOps({ db, plan, dryRun: false });
    expect(counters.created).toBe(35);
    expect(counters.batchCommits).toBe(1);
    expect(db._stats.batchCommits).toBe(1);
    expect(db._store.get('financialRecords')?.size).toBe(35);
  });

  it('waits the configured fast-path delay before reading bills, is idempotent, and exits early with 0 reads on unchanged Present set', async () => {
    const db = createFakeAdminDb({
      schoolSettings: { [schoolId]: { serverDailyBillingMode: 'live' } },
      [`schoolSettings/${schoolId}/rates`]: { canteen: { pricingModel: 'Flat', dailyRate: 9, classRates: {} } },
      schools: { [schoolId]: { academicYear: '2025-2026', term: 'First Term' } },
      students: {
        s1: { uid: 's1', firstName: 'A', lastName: 'B', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
        s2: { uid: 's2', firstName: 'C', lastName: 'D', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
      },
    });

    const docData = makeProdAggregatedAttendanceDoc({
      schoolId,
      classId: 'c1',
      dateStr,
      entries: [
        { uid: 's1', status: 'Present' },
        { uid: 's2', status: 'Late' },
      ],
    });
    const log = { info: vi.fn(), warn: vi.fn() };
    const sleepOrder: string[] = [];
    const sleep = vi.fn(async (ms: number) => {
      sleepOrder.push(`sleep:${ms}:getAllBefore=${db._stats.getAllCalls}`);
    });

    const first = await handleAggregatedAttendanceWrite({
      db,
      docId: docData.id,
      beforeData: null,
      afterData: docData,
      config: defaultConfig,
      delayMs: 20_000,
      sleep,
      logger: log,
    });
    expect(first.ran).toBe(true);
    expect(first.counters?.created).toBe(2);
    expect(sleep).toHaveBeenCalledWith(20_000);
    // Delay occurred BEFORE reading existing bills via getAll
    expect(sleepOrder).toEqual(['sleep:20000:getAllBefore=0']);

    const readsAfterFirst = db._stats.getAllCalls;
    const second = await handleAggregatedAttendanceWrite({
      db,
      docId: docData.id,
      beforeData: docData,
      afterData: docData,
      config: defaultConfig,
      delayMs: 20_000,
      sleep,
      logger: log,
    });
    expect(second.ran).toBe(false);
    expect(second.reason).toBe('present-set-unchanged');
    expect(db._stats.getAllCalls).toBe(readsAfterFirst);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(db._store.get('financialRecords')?.size).toBe(2);
  });

  it('never overwrites paid or unpaid existing bills, restores voided bills, and handles ALREADY_EXISTS race', async () => {
    const existing = new Map<string, ExistingBillState>([
      [canteenBillId('paid-stu', dateStr), { id: canteenBillId('paid-stu', dateStr), voided: false, amountPaid: 9, status: 'Paid' }],
      [canteenBillId('unpaid-stu', dateStr), { id: canteenBillId('unpaid-stu', dateStr), voided: false, amountPaid: 0, status: 'Unpaid' }],
      [canteenBillId('voided-stu', dateStr), { id: canteenBillId('voided-stu', dateStr), voided: true, amountPaid: 0, status: 'Void' }],
    ]);

    const students: BillableStudentRecord[] = [
      { uid: 'paid-stu', firstName: 'P', lastName: 'S', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
      { uid: 'unpaid-stu', firstName: 'U', lastName: 'S', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
      { uid: 'voided-stu', firstName: 'V', lastName: 'S', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
      { uid: 'new-stu', firstName: 'N', lastName: 'S', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
    ];

    const db = createFakeAdminDb({
      financialRecords: {
        [canteenBillId('paid-stu', dateStr)]: { billedAmount: 9, amountPaid: 9, status: 'Paid', voided: false },
        [canteenBillId('unpaid-stu', dateStr)]: { billedAmount: 9, amountPaid: 0, status: 'Unpaid', voided: false },
        [canteenBillId('voided-stu', dateStr)]: { billedAmount: 0, amountPaid: 0, status: 'Void', voided: true },
      },
    });

    const plan = planDailyBillsForStudents({
      students,
      schoolId,
      dateStr,
      canteenConfig: { pricingModel: 'Flat', dailyRate: 9, classRates: {} },
      transportRateMap: new Map(),
      existingBills: existing,
      termStamp: null,
    });

    expect(plan.ops.map(o => `${o.kind}:${o.billId}`)).toEqual([
      `restore:${canteenBillId('voided-stu', dateStr)}`,
      `create:${canteenBillId('new-stu', dateStr)}`,
    ]);

    // Simulate concurrent client creating new-stu between getAll and batch.commit
    db._store.get('financialRecords')!.set(canteenBillId('new-stu', dateStr), { data: { billedAmount: 9, amountPaid: 0, status: 'Unpaid' } });
    const counters = await executePlannedBillOps({ db, plan, dryRun: false });
    expect(counters.restored).toBe(1);
    expect(counters.created).toBe(0);
    expect(counters.failed).toBe(0);
    expect(db._store.get('financialRecords')!.get(canteenBillId('voided-stu', dateStr))!.data.voided).toBe(false);
    expect(db._store.get('financialRecords')!.get(canteenBillId('paid-stu', dateStr))!.data.amountPaid).toBe(9);
  });

  it('skips usesCanteen:false, canteenBillingMode:None/Termly, Inactive, and handles canteen-only, transport-only, and both', () => {
    const students: BillableStudentRecord[] = [
      { uid: 'skip-false', usesCanteen: false, canteenBillingMode: 'Daily' },
      { uid: 'skip-none', usesCanteen: true, canteenBillingMode: 'None' },
      { uid: 'skip-termly', usesCanteen: true, canteenBillingMode: 'Termly' },
      { uid: 'skip-inactive', enrollmentStatus: 'Inactive', usesCanteen: true, canteenBillingMode: 'Daily', usesBusService: true, transportBillingModel: 'Daily' },
      { uid: 'canteen-only', usesCanteen: true, canteenBillingMode: 'Daily', usesBusService: false },
      { uid: 'transport-only', usesCanteen: false, usesBusService: true, transportBillingModel: 'Daily' },
      { uid: 'both-services', usesCanteen: true, canteenBillingMode: 'Daily', usesBusService: true, transportBillingModel: 'Daily' },
    ];

    const plan = planDailyBillsForStudents({
      students,
      schoolId,
      dateStr,
      canteenConfig: { pricingModel: 'Flat', dailyRate: 9, classRates: {} },
      transportRateMap: new Map([
        ['skip-inactive', 12],
        ['transport-only', 12],
        ['both-services', 12],
      ]),
      existingBills: new Map(),
      termStamp: null,
    });

    expect(plan.ops.map(o => o.billId)).toEqual([
      canteenBillId('canteen-only', dateStr),
      transportBillId('transport-only', dateStr),
      canteenBillId('both-services', dateStr),
      transportBillId('both-services', dateStr),
    ]);
  });

  it('flags creditPending ONLY when hasAccountCredit is true (no extra reads for others)', () => {
    const students: BillableStudentRecord[] = [
      { uid: 'has-credit', usesCanteen: true, canteenBillingMode: 'Daily', hasAccountCredit: true },
      { uid: 'no-credit', usesCanteen: true, canteenBillingMode: 'Daily', hasAccountCredit: false },
    ];

    const plan = planDailyBillsForStudents({
      students,
      schoolId,
      dateStr,
      canteenConfig: { pricingModel: 'Flat', dailyRate: 9, classRates: {} },
      transportRateMap: new Map(),
      existingBills: new Map(),
      termStamp: null,
    });

    expect(plan.creditPendingCount).toBe(1);
    const creditOp = plan.ops.find(o => o.studentUid === 'has-credit')!;
    const normalOp = plan.ops.find(o => o.studentUid === 'no-credit')!;
    expect(creditOp.kind === 'create' && creditOp.data.creditPending).toBe(true);
    expect(normalOp.kind === 'create' && 'creditPending' in normalOp.data).toBe(false);
  });

  it('pushes down schoolId in [...] to the reconcile attendance query when allowlist is set', async () => {
    const otherSchool = 'other-school-999';
    const attMercy = makeProdAggregatedAttendanceDoc({
      schoolId,
      classId: 'c1',
      dateStr,
      entries: [{ uid: 's1', status: 'Present' }],
    });
    const attOther = makeProdAggregatedAttendanceDoc({
      schoolId: otherSchool,
      classId: 'c2',
      dateStr,
      entries: [{ uid: 'other-s1', status: 'Present' }],
    });

    const db = createFakeAdminDb({
      schoolSettings: {
        [schoolId]: { serverDailyBillingMode: 'live' },
        [otherSchool]: { serverDailyBillingMode: 'live' },
      },
      [`schoolSettings/${schoolId}/rates`]: { canteen: { pricingModel: 'Flat', dailyRate: 9, classRates: {} } },
      schools: { [schoolId]: { academicYear: '2025-2026', term: 'First Term' } },
      attendance: {
        [attMercy.id]: attMercy,
        [attOther.id]: attOther,
      },
      students: {
        s1: { uid: 's1', firstName: 'A', lastName: 'B', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
      },
    });

    const summaries = await runDailyReconciliation({
      db,
      dateStr,
      forceFullLookup: true,
      scheduleLabel: '18:00',
      config: defaultConfig,
      logger: { info: vi.fn(), warn: vi.fn() },
    });

    expect(summaries).toHaveLength(1);
    expect(summaries[0].schoolId).toBe(schoolId);
    const attQuery = db._stats.queries.find((q: any) => q.col === 'attendance');
    expect(attQuery.filters).toContainEqual({ field: 'schoolId', op: 'in', value: [schoolId] });
  });

  it('(a) paid bill for a student later marked absent does NOT hide a missing bill at 11:30/14:00', async () => {
    const dueDate = schoolDayStartUtcFromDateStr(dateStr);
    const attDoc = makeProdAggregatedAttendanceDoc({
      schoolId,
      classId: 'c1',
      dateStr,
      // s1 was marked Absent after paying; s2 is Present and MISSING a bill
      entries: [
        { uid: 's1', status: 'Absent' },
        { uid: 's2', status: 'Present' },
      ],
    });
    const db = createFakeAdminDb({
      schoolSettings: { [schoolId]: { serverDailyBillingMode: 'live' } },
      [`schoolSettings/${schoolId}/rates`]: { canteen: { pricingModel: 'Flat', dailyRate: 9, classRates: {} } },
      schools: { [schoolId]: { academicYear: '2025-2026', term: 'First Term' } },
      attendance: { [attDoc.id]: attDoc },
      students: {
        s1: { uid: 's1', firstName: 'Absent', lastName: 'Paid', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
        s2: { uid: 's2', firstName: 'Present', lastName: 'Missing', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
      },
      financialRecords: {
        // s1 has an unvoided PAID bill -> totalCount=1 == expected=1, MUST NOT mask s2's missing bill!
        [canteenBillId('s1', dateStr)]: {
          schoolId,
          studentId: 's1',
          type: 'Canteen Fee (Daily)',
          dueDate,
          billedAmount: 9,
          amountPaid: 9,
          status: 'Paid',
          voided: false,
        },
      },
    });

    const summaries = await runDailyReconciliation({
      db,
      dateStr,
      forceFullLookup: false,
      scheduleLabel: '11:30',
      config: defaultConfig,
      logger: { info: vi.fn(), warn: vi.fn() },
    });

    expect(summaries).toHaveLength(1);
    expect(summaries[0].mode).toBe('full-lookup');
    expect(summaries[0].created).toBe(1);
    expect(db._store.get('financialRecords')!.has(canteenBillId('s2', dateStr))).toBe(true);
  });

  it('(b) a voided bill is NOT counted as active during count-first check', async () => {
    const dueDate = schoolDayStartUtcFromDateStr(dateStr);
    const attDoc = makeProdAggregatedAttendanceDoc({
      schoolId,
      classId: 'c1',
      dateStr,
      entries: [{ uid: 's1', status: 'Present' }],
    });
    const db = createFakeAdminDb({
      schoolSettings: { [schoolId]: { serverDailyBillingMode: 'live' } },
      [`schoolSettings/${schoolId}/rates`]: { canteen: { pricingModel: 'Flat', dailyRate: 9, classRates: {} } },
      schools: { [schoolId]: { academicYear: '2025-2026', term: 'First Term' } },
      attendance: { [attDoc.id]: attDoc },
      students: {
        s1: { uid: 's1', firstName: 'Voided', lastName: 'Stu', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
      },
      financialRecords: {
        [canteenBillId('s1', dateStr)]: {
          schoolId,
          studentId: 's1',
          type: 'Canteen Fee (Daily)',
          dueDate,
          billedAmount: 0,
          amountPaid: 0,
          status: 'Void',
          voided: true,
        },
      },
    });

    const summaries = await runDailyReconciliation({
      db,
      dateStr,
      forceFullLookup: false,
      scheduleLabel: '14:00',
      config: defaultConfig,
      logger: { info: vi.fn(), warn: vi.fn() },
    });

    expect(summaries[0].mode).toBe('full-lookup');
    expect(summaries[0].restored).toBe(1);
    expect(db._store.get('financialRecords')!.get(canteenBillId('s1', dateStr))!.data.voided).toBe(false);
  });

  it('(c) exact count match skips full lookup at 11:30/14:00, but 18:00 always runs full lookup', async () => {
    const dueDate = schoolDayStartUtcFromDateStr(dateStr);
    const attDoc = makeProdAggregatedAttendanceDoc({
      schoolId,
      classId: 'c1',
      dateStr,
      entries: [{ uid: 's1', status: 'Present' }],
    });
    const makeDb = () =>
      createFakeAdminDb({
        schoolSettings: { [schoolId]: { serverDailyBillingMode: 'live' } },
        [`schoolSettings/${schoolId}/rates`]: { canteen: { pricingModel: 'Flat', dailyRate: 9, classRates: {} } },
        schools: { [schoolId]: { academicYear: '2025-2026', term: 'First Term' } },
        attendance: { [attDoc.id]: attDoc },
        students: {
          s1: { uid: 's1', firstName: 'Ok', lastName: 'Stu', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
        },
        financialRecords: {
          [canteenBillId('s1', dateStr)]: {
            schoolId,
            studentId: 's1',
            type: 'Canteen Fee (Daily)',
            dueDate,
            billedAmount: 9,
            amountPaid: 0,
            status: 'Unpaid',
            voided: false,
          },
        },
      });

    const dbMidday = makeDb();
    const midday = await runDailyReconciliation({
      db: dbMidday,
      dateStr,
      forceFullLookup: false,
      scheduleLabel: '11:30',
      config: defaultConfig,
      logger: { info: vi.fn(), warn: vi.fn() },
    });
    expect(midday[0].mode).toBe('count-skipped');
    expect(dbMidday._stats.countQueries).toBe(4);

    const dbEvening = makeDb();
    const evening = await runDailyReconciliation({
      db: dbEvening,
      dateStr,
      forceFullLookup: true,
      scheduleLabel: '18:00',
      config: defaultConfig,
      logger: { info: vi.fn(), warn: vi.fn() },
    });
    expect(evening[0].mode).toBe('full-lookup');
    expect(dbEvening._stats.countQueries).toBe(0);
  });

  it('(d) dry-run writes nothing, never deletes, and logs counts only (no student names or phone numbers)', async () => {
    const beforeDoc = makeProdAggregatedAttendanceDoc({
      schoolId,
      classId: 'c1',
      dateStr,
      entries: [{ uid: 's2', status: 'Present', name: 'AbsentKid Hidden' }],
    });
    const afterDoc = makeProdAggregatedAttendanceDoc({
      schoolId,
      classId: 'c1',
      dateStr,
      entries: [
        { uid: 's1', status: 'Present', name: 'SecretName SecretLast' },
        { uid: 's2', status: 'Absent', name: 'AbsentKid Hidden' },
      ],
    });

    const db = createFakeAdminDb({
      // No serverDailyBillingMode set -> allowlisted school defaults to 'dry-run'
      schoolSettings: { [schoolId]: {} },
      [`schoolSettings/${schoolId}/rates`]: { canteen: { pricingModel: 'Flat', dailyRate: 9, classRates: {} } },
      schools: { [schoolId]: { academicYear: '2025-2026', term: 'First Term' } },
      students: {
        s1: { uid: 's1', firstName: 'SecretName', lastName: 'SecretLast', phone: '0244123456', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
        s2: { uid: 's2', firstName: 'AbsentKid', lastName: 'Hidden', phone: '0209998888', classId: 'c1', usesCanteen: true, canteenBillingMode: 'Daily' },
      },
      financialRecords: {
        [canteenBillId('s2', dateStr)]: { schoolId, studentId: 's2', billedAmount: 9, amountPaid: 0, status: 'Unpaid', voided: false },
      },
    });

    const infoSpy = vi.fn();
    const warnSpy = vi.fn();

    const res = await handleAggregatedAttendanceWrite({
      db,
      docId: afterDoc.id,
      beforeData: beforeDoc,
      afterData: afterDoc,
      config: defaultConfig,
      logger: { info: infoSpy, warn: warnSpy },
    });

    expect(res.ran).toBe(true);
    expect(res.mode).toBe('dry-run');
    expect(res.counters?.dryRun).toBe(true);
    expect(res.counters?.created).toBe(1);
    expect(res.wouldDeleteCount).toBe(1);
    // Dry-run wrote and deleted NOTHING
    expect(db._stats.creates).toBe(0);
    expect(db._stats.updates).toBe(0);
    expect(db._stats.deletes).toBe(0);
    expect(db._store.get('financialRecords')!.has(canteenBillId('s1', dateStr))).toBe(false);
    expect(db._store.get('financialRecords')!.has(canteenBillId('s2', dateStr))).toBe(true);

    // Logs contain counts only — zero names or phone numbers
    const serializedLogs = JSON.stringify(infoSpy.mock.calls);
    expect(serializedLogs).not.toContain('SecretName');
    expect(serializedLogs).not.toContain('SecretLast');
    expect(serializedLogs).not.toContain('AbsentKid');
    expect(serializedLogs).not.toContain('0244123456');
    expect(serializedLogs).not.toContain('0209998888');
  });
});

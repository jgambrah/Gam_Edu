import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { format } from 'date-fns';
import { schoolDayDateStrUtc, schoolDayStartUtcFromInstant } from '@/lib/attendance-date';
import { isDailyTransportSubscriber, shouldBillDailyCanteen } from '@/lib/billing-predicates';
import { applyHeldCreditAfterBillingServer } from '@/lib/credit-allocation-server';
import { currentTermFromProfile, type TermStamp } from '@/lib/term';
import { BILLING_PAUSE_DOC_PATH, isServicePausedOnDate, parseBillingPauses } from '@/lib/billing-pause';

/** Reads the school's current term from the school profile. Returns null if it isn't set. Never throws. */
export async function fetchCurrentTermStampServer(db: FirebaseFirestore.Firestore, schoolId: string): Promise<TermStamp | null> {
  try {
    const snap = await db.collection('schools').doc(schoolId).get();
    const stamp = currentTermFromProfile(snap.exists ? snap.data() : null);
    if (stamp) return stamp;
    const settings = await db.collection('schoolSettings').doc(schoolId).get();
    return currentTermFromProfile(settings.exists ? settings.data() : null);
  } catch (e) {
    console.warn('Could not read current term (server); bill will be stamped by the backfill instead:', e);
    return null;
  }
}

const DAILY_RATES = {
  CANTEEN: 0.00,
  BUS: 0.00,
};

interface BillingResult {
  success: boolean;
  message: string;
  amountBilled: number;
}

/**
 * Server-side implementation of billing a student for canteen and/or bus services when they attend school.
 * Uses admin SDK to perform writes.
 * PARITY NOTICE: Mirrored in `functions/src/daily-billing.ts` (isolated Cloud Functions package)
 * and verified by `src/lib/daily-billing.parity.test.ts`. Keep IDs, rates, and restore logic in sync.
 */
export async function billStudentForAttendanceServer(
  db: FirebaseFirestore.Firestore,
  student: any,
  attendanceDate: Date,
  schoolId: string,
  providedRates?: { canteen: number; transport: number },
  termStamp?: TermStamp | null
): Promise<BillingResult> {
  try {
    if (!student || !student.uid || !schoolId) {
      return {
        success: false,
        message: 'Invalid student or school data',
        amountBilled: 0
      };
    }

    // NORMALIZE DATE: Canonical UTC midnight independent of server host timezone
    const normalizedUtcDate = schoolDayStartUtcFromInstant(attendanceDate);
    const dateStr = schoolDayDateStrUtc(attendanceDate);
    const displayDate = new Date(
      normalizedUtcDate.getUTCFullYear(),
      normalizedUtcDate.getUTCMonth(),
      normalizedUtcDate.getUTCDate(),
    );

    // 1. Check preferences (shared predicates with client billing & reconciliation)
    const shouldBillCanteen = shouldBillDailyCanteen(student);
    const shouldBillTransport = isDailyTransportSubscriber(student);

    if (!shouldBillCanteen && !shouldBillTransport) {
      return {
        success: true,
        message: 'No daily services to bill (skipped Termly or None subscribers)',
        amountBilled: 0
      };
    }

    // 2. Resolve Rates
    const canteenRate = (providedRates && providedRates.canteen !== undefined) 
      ? providedRates.canteen 
      : DAILY_RATES.CANTEEN;
      
    const transportRate = (providedRates && providedRates.transport !== undefined)
      ? providedRates.transport
      : DAILY_RATES.BUS;

    const batch = db.batch();
    let totalBilled = 0;
    const billedServices: string[] = [];
    // Every new bill carries termId + academicYear + term (see src/lib/term.ts).
    const stamp = termStamp === undefined ? await fetchCurrentTermStampServer(db, schoolId) : termStamp;
    const termFields = stamp ? { ...stamp, isArchived: false } : { isArchived: false };

    // SAFETY: never overwrite a bill that already exists for this day (a repeat scan used to reset a
    // paid bill back to amountPaid 0 / Unpaid). If the check itself fails, billing continues as before.
    const canteenRecordId = `canteen-${student.uid}-${dateStr}`;
    const transportRecordId = `transport-${student.uid}-${dateStr}`;
    const alreadyBilled = new Set<string>();
    // Bills voided by an earlier absence correction are restored (not skipped, not overwritten).
    const voided = new Map<string, any>();
    try {
      const [cSnap, tSnap] = await db.getAll(
        db.collection('financialRecords').doc(canteenRecordId),
        db.collection('financialRecords').doc(transportRecordId)
      );
      for (const s of [cSnap, tSnap]) {
        if (!s.exists) continue;
        if ((s.data() as any)?.voided) voided.set(s.id, s.data());
        else alreadyBilled.add(s.id);
      }
    } catch (checkErr) {
      console.warn('Existing-bill check failed (server); continuing with billing:', checkErr);
    }

    const restoreVoided = (prev: any, rate: number) => {
      const paid = Number(prev?.amountPaid) || 0;
      const waiver = Number(prev?.originalWaiverAmount ?? prev?.waiverAmount) || 0;
      return {
        billedAmount: rate,
        waiverAmount: waiver,
        voided: false,
        voidReason: null,
        restoredAt: FieldValue.serverTimestamp(),
        status: rate - paid - waiver <= 0.001 ? 'Paid' : 'Unpaid',
      };
    };

    // 3. Process Canteen Bill (Using Deterministic ID)
    if (shouldBillCanteen && canteenRate > 0 && voided.has(canteenRecordId)) {
      batch.update(db.collection('financialRecords').doc(canteenRecordId), restoreVoided(voided.get(canteenRecordId), canteenRate));
      totalBilled += canteenRate;
      billedServices.push('Canteen');
    } else if (shouldBillCanteen && canteenRate > 0 && !alreadyBilled.has(canteenRecordId)) {
      const canteenRef = db.collection('financialRecords').doc(canteenRecordId);
      
      batch.set(canteenRef, {
        studentId: student.uid,
        studentName: `${student.firstName} ${student.lastName}`,
        classId: student.classId || '',
        type: 'Canteen Fee (Daily)',
        description: `Canteen - ${format(displayDate, 'PPP')}`,
        billedAmount: canteenRate,
        amountPaid: 0,
        waiverAmount: 0,
        status: 'Unpaid',
        dueDate: Timestamp.fromDate(normalizedUtcDate),
        createdAt: FieldValue.serverTimestamp(),
        schoolId: schoolId,
        ...termFields,
      }, { merge: true });
      totalBilled += canteenRate;
      billedServices.push('Canteen');
    }

    // 4. Process Transport Bill (Using Deterministic ID)
    if (shouldBillTransport && transportRate > 0 && voided.has(transportRecordId)) {
      batch.update(db.collection('financialRecords').doc(transportRecordId), restoreVoided(voided.get(transportRecordId), transportRate));
      totalBilled += transportRate;
      billedServices.push('Transport');
    } else if (shouldBillTransport && transportRate > 0 && !alreadyBilled.has(transportRecordId)) {
      const transportRef = db.collection('financialRecords').doc(transportRecordId);
      
      batch.set(transportRef, {
        studentId: student.uid,
        studentName: `${student.firstName} ${student.lastName}`,
        classId: student.classId || '',
        type: 'Transport Fee (Daily)',
        description: `Transport - ${format(displayDate, 'PPP')}`,
        billedAmount: transportRate,
        amountPaid: 0,
        waiverAmount: 0,
        status: 'Unpaid',
        dueDate: Timestamp.fromDate(normalizedUtcDate),
        createdAt: FieldValue.serverTimestamp(),
        schoolId: schoolId,
        ...termFields,
      }, { merge: true });
      totalBilled += transportRate;
      billedServices.push('Transport');
    }

    if (billedServices.length > 0) {
      await batch.commit();
      // Apply any credit the student is holding (e.g. prepaid the week). Never throws.
      const credited = await applyHeldCreditAfterBillingServer(db, schoolId, student);
      return {
        success: true,
        message: `Billed GHS ${totalBilled.toFixed(2)} for ${billedServices.join(' and ')}${credited > 0 ? ` (GHS ${credited.toFixed(2)} paid from credit)` : ''}`,
        amountBilled: totalBilled
      };
    }

    return {
      success: true,
      message: 'No bills generated (rates are 0 or student already billed)',
      amountBilled: 0
    };

  } catch (error: any) {
    console.error('Billing error (server):', error);
    return {
      success: false,
      message: `Billing failed: ${error.message}`,
      amountBilled: 0
    };
  }
}

/**
 * Main server-side billing function called when processing attendance batches.
 */
export async function billMultipleStudentsServer(
  db: FirebaseFirestore.Firestore,
  students: any[],
  attendanceDate: Date,
  schoolId: string
): Promise<{
  successful: number;
  failed: number;
  totalBilled: number;
  errors: string[];
}> {
  if (!students.length || !schoolId) {
    return { successful: 0, failed: 0, totalBilled: 0, errors: [] };
  }

  const normalizedUtcDate = schoolDayStartUtcFromInstant(attendanceDate);
  const dateStr = schoolDayDateStrUtc(attendanceDate);
  const displayDate = new Date(
    normalizedUtcDate.getUTCFullYear(),
    normalizedUtcDate.getUTCMonth(),
    normalizedUtcDate.getUTCDate(),
  );

  // 1. Run all setup reads in parallel (canteen rates, routes, current term, existing daily bills)
  const billRefs = students.flatMap(st =>
    st?.uid
      ? [
          db.collection('financialRecords').doc(`canteen-${st.uid}-${dateStr}`),
          db.collection('financialRecords').doc(`transport-${st.uid}-${dateStr}`),
        ]
      : []
  );

  const [canteenSettingsSnap, routesSnap, termStamp, existingSnaps, pausesSnap] = await Promise.all([
    db.collection('schoolSettings').doc(schoolId).collection('rates').doc('canteen').get(),
    db.collection('routes').where('schoolId', '==', schoolId).get(),
    fetchCurrentTermStampServer(db, schoolId),
    billRefs.length > 0 ? db.getAll(...billRefs) : Promise.resolve([]),
    // Director billing pause (kitchen closed, buses off the road...): attendance counts, billing is skipped.
    db.collection('schoolSettings').doc(schoolId).collection(BILLING_PAUSE_DOC_PATH[0]).doc(BILLING_PAUSE_DOC_PATH[1]).get()
      .catch(() => null),
  ]);

  const pauses = pausesSnap?.exists ? parseBillingPauses(pausesSnap.data()) : [];
  const canteenPaused = isServicePausedOnDate(pauses, dateStr, 'canteen');
  const transportPaused = isServicePausedOnDate(pauses, dateStr, 'transport');
  if (canteenPaused && transportPaused) {
    return { successful: students.length, failed: 0, totalBilled: 0, errors: [] };
  }

  const canteenData = canteenSettingsSnap.data();
  const canteenModel = canteenData?.pricingModel || 'Flat';
  const globalCanteenRate = Number(canteenData?.dailyRate) || 0;
  const classCanteenRates = canteenData?.classRates || {};

  const studentToTransportRateMap = new Map<string, number>();
  routesSnap.docs.forEach(d => {
    const data = d.data();
    const dailyRate = Number(data.dailyRate) || 0;
    data.stops?.forEach((stop: any) => {
      stop.assignedStudentIds?.forEach((sid: string) => {
        studentToTransportRateMap.set(sid, dailyRate);
      });
    });
  });

  const existingBillIds = new Set<string>();
  const voidedBills = new Map<string, any>();
  for (const s of existingSnaps) {
    if (!s.exists) continue;
    if ((s.data() as any)?.voided) voidedBills.set(s.id, s.data());
    else existingBillIds.add(s.id);
  }

  const termFields = termStamp ? { ...termStamp, isArchived: false } : { isArchived: false };
  const formattedDate = format(displayDate, 'PPP');
  const dueTimestamp = Timestamp.fromDate(normalizedUtcDate);

  const restoreVoided = (prev: any, rate: number) => {
    const paid = Number(prev?.amountPaid) || 0;
    const waiver = Number(prev?.originalWaiverAmount ?? prev?.waiverAmount) || 0;
    return {
      billedAmount: rate,
      waiverAmount: waiver,
      voided: false,
      voidReason: null,
      restoredAt: FieldValue.serverTimestamp(),
      status: rate - paid - waiver <= 0.001 ? 'Paid' : 'Unpaid',
    };
  };

  type PlannedWrite =
    | { kind: 'set'; ref: FirebaseFirestore.DocumentReference; data: Record<string, any> }
    | { kind: 'update'; ref: FirebaseFirestore.DocumentReference; data: Record<string, any> };
  type PlannedStudent = { student: any; writes: PlannedWrite[]; amountBilled: number; rates: { canteen: number; transport: number } };

  let successful = 0;
  let failed = 0;
  let totalBilled = 0;
  const errors: string[] = [];
  const planned: PlannedStudent[] = [];

  for (const student of students) {
    if (!student || !student.uid) {
      failed++;
      errors.push(`${student?.firstName || 'Student'}: Invalid student or school data`);
      continue;
    }

    const shouldBillCanteen = shouldBillDailyCanteen(student);
    const shouldBillTransport = isDailyTransportSubscriber(student);
    if (!shouldBillCanteen && !shouldBillTransport) {
      successful++;
      continue;
    }

    // A paused service resolves to rate 0 (treated as "do not bill / do not restore" below).
    const canteenRate = canteenPaused ? 0 : (canteenModel === 'Flat' ? globalCanteenRate : (Number(classCanteenRates[student.classId]) || 0));
    const transportRate = transportPaused ? 0 : (studentToTransportRateMap.get(student.uid) || 0);

    const canteenRecordId = `canteen-${student.uid}-${dateStr}`;
    const transportRecordId = `transport-${student.uid}-${dateStr}`;
    const writes: PlannedWrite[] = [];
    let studentBilled = 0;

    if (shouldBillCanteen && canteenRate > 0 && voidedBills.has(canteenRecordId)) {
      writes.push({
        kind: 'update',
        ref: db.collection('financialRecords').doc(canteenRecordId),
        data: restoreVoided(voidedBills.get(canteenRecordId), canteenRate),
      });
      studentBilled += canteenRate;
    } else if (shouldBillCanteen && canteenRate > 0 && !existingBillIds.has(canteenRecordId)) {
      writes.push({
        kind: 'set',
        ref: db.collection('financialRecords').doc(canteenRecordId),
        data: {
          studentId: student.uid,
          studentName: `${student.firstName} ${student.lastName}`,
          classId: student.classId || '',
          type: 'Canteen Fee (Daily)',
          description: `Canteen - ${formattedDate}`,
          billedAmount: canteenRate,
          amountPaid: 0,
          waiverAmount: 0,
          status: 'Unpaid',
          dueDate: dueTimestamp,
          createdAt: FieldValue.serverTimestamp(),
          schoolId,
          ...termFields,
        },
      });
      studentBilled += canteenRate;
    }

    if (shouldBillTransport && transportRate > 0 && voidedBills.has(transportRecordId)) {
      writes.push({
        kind: 'update',
        ref: db.collection('financialRecords').doc(transportRecordId),
        data: restoreVoided(voidedBills.get(transportRecordId), transportRate),
      });
      studentBilled += transportRate;
    } else if (shouldBillTransport && transportRate > 0 && !existingBillIds.has(transportRecordId)) {
      writes.push({
        kind: 'set',
        ref: db.collection('financialRecords').doc(transportRecordId),
        data: {
          studentId: student.uid,
          studentName: `${student.firstName} ${student.lastName}`,
          classId: student.classId || '',
          type: 'Transport Fee (Daily)',
          description: `Transport - ${formattedDate}`,
          billedAmount: transportRate,
          amountPaid: 0,
          waiverAmount: 0,
          status: 'Unpaid',
          dueDate: dueTimestamp,
          createdAt: FieldValue.serverTimestamp(),
          schoolId,
          ...termFields,
        },
      });
      studentBilled += transportRate;
    }

    if (writes.length > 0) {
      planned.push({ student, writes, amountBilled: studentBilled, rates: { canteen: canteenRate, transport: transportRate } });
    } else {
      successful++;
    }
  }

  // 2. Commit all planned writes in batches of at most 200 ops
  const MAX_OPS_PER_BATCH = 200;
  const batches: PlannedStudent[][] = [];
  let currentGroup: PlannedStudent[] = [];
  let currentOps = 0;
  for (const item of planned) {
    if (currentGroup.length > 0 && currentOps + item.writes.length > MAX_OPS_PER_BATCH) {
      batches.push(currentGroup);
      currentGroup = [];
      currentOps = 0;
    }
    currentGroup.push(item);
    currentOps += item.writes.length;
  }
  if (currentGroup.length > 0) batches.push(currentGroup);

  const studentsToApplyCredit: any[] = [];

  for (const group of batches) {
    const batch = db.batch();
    for (const item of group) {
      for (const w of item.writes) {
        if (w.kind === 'set') batch.set(w.ref, w.data, { merge: true });
        else batch.update(w.ref, w.data);
      }
    }

    try {
      await batch.commit();
      for (const item of group) {
        successful++;
        totalBilled += item.amountBilled;
        if (item.student?.hasAccountCredit) {
          studentsToApplyCredit.push(item.student);
        }
      }
    } catch (batchErr: any) {
      console.warn('Batched server daily billing commit failed; falling back to per-student billing:', batchErr);
      for (const item of group) {
        const result = await billStudentForAttendanceServer(db, item.student, attendanceDate, schoolId, item.rates, termStamp);
        if (result.success) {
          successful++;
          totalBilled += result.amountBilled;
        } else {
          failed++;
          errors.push(`${item.student.firstName}: ${result.message}`);
        }
      }
    }
  }

  if (studentsToApplyCredit.length > 0) {
    await Promise.allSettled(
      studentsToApplyCredit.map(st => applyHeldCreditAfterBillingServer(db, schoolId, st))
    );
  }

  return { successful, failed, totalBilled, errors };
}

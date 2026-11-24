'use client';

import { doc, getDoc, serverTimestamp, Timestamp, collection, writeBatch, query, where, getDocs, documentId } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { format, startOfDay } from 'date-fns';
import { schoolDayDateStr, schoolDayStartUtc } from '@/lib/attendance-date';
import { applyHeldCreditAfterBilling, reallocateExistingOverpayments, setStudentCreditMarker } from '@/lib/credit-allocation';
import { currentTermFromProfile, type TermStamp } from '@/lib/term';
import { isDailyTransportSubscriber, shouldBillDailyCanteen } from '@/lib/billing-predicates';
import { BILLING_PAUSE_DOC_PATH, isServicePausedOnDate, parseBillingPauses, type BillingPause } from '@/lib/billing-pause';

export { isDailyTransportSubscriber, shouldBillDailyCanteen };

/**
 * Director-set billing pauses (kitchen closed, buses off the road...). Attendance is still recorded,
 * but daily bills for a paused service are not generated. Never throws: on a read error we return []
 * (billing continues as before) rather than blocking attendance.
 */
export async function fetchBillingPauses(firestore: Firestore, schoolId: string): Promise<BillingPause[]> {
  try {
    const snap = await getDoc(doc(firestore, 'schoolSettings', schoolId, ...BILLING_PAUSE_DOC_PATH));
    return snap.exists() ? parseBillingPauses(snap.data()) : [];
  } catch (e) {
    console.warn('Could not read billing pauses; billing continues as normal:', e);
    return [];
  }
}

/** Reads the school's current term from the school profile. Returns null if it isn't set. Never throws. */
export async function fetchCurrentTermStamp(firestore: Firestore, schoolId: string): Promise<TermStamp | null> {
  try {
    const snap = await getDoc(doc(firestore, 'schools', schoolId));
    const stamp = currentTermFromProfile(snap.exists() ? snap.data() : null);
    if (stamp) return stamp;
    const settings = await getDoc(doc(firestore, 'schoolSettings', schoolId));
    return currentTermFromProfile(settings.exists() ? settings.data() : null);
  } catch (e) {
    console.warn('Could not read current term; bill will be stamped by the backfill instead:', e);
    return null;
  }
}

/**
 * Fields that bring a bill voided by an absence correction back to life (student re-marked present).
 * PARITY NOTICE: Mirrored in `functions/src/daily-billing.ts` (`buildRestoreVoidedPatch`) and
 * verified by `src/lib/daily-billing.parity.test.ts`. Keep IDs, rates, and restore logic in sync.
 */
const restoreVoidedBill = (prev: any, rate: number) => {
  const paid = Number(prev?.amountPaid) || 0;
  const waiver = Number(prev?.originalWaiverAmount ?? prev?.waiverAmount) || 0;
  return {
    billedAmount: rate,
    waiverAmount: waiver,
    voided: false,
    voidReason: null,
    restoredAt: serverTimestamp(),
    status: rate - paid - waiver <= 0.001 ? 'Paid' : 'Unpaid',
  };
};

/**
 * Called when a student is (re)marked Absent/Excused for a day. Removes that day's daily canteen /
 * transport bills WITHOUT losing money:
 *  - bill missing            -> nothing to do
 *  - bill unpaid             -> deleted (same as before)
 *  - bill already (part) paid -> voided (billed 0); the cash becomes account credit and is applied to the
 *                               student's other unpaid bills, or held for upcoming daily bills.
 * NEVER throws — saving attendance must not fail because of this.
 */
export async function reverseDailyBillsForAbsence(
  firestore: Firestore,
  schoolId: string,
  student: { uid: string; id?: string; [key: string]: any },
  dateStr: string
): Promise<void> {
  try {
    if (!student?.uid) return;
    const ids = [`canteen-${student.uid}-${dateStr}`, `transport-${student.uid}-${dateStr}`];
    const snaps = await Promise.all(ids.map(id => getDoc(doc(firestore, 'financialRecords', id))));
    const batch = writeBatch(firestore);
    let ops = 0;
    let createdCredit = false;

    for (const s of snaps) {
      if (!s.exists()) continue;
      const d: any = s.data();
      if (d.voided || d.isArchived) continue;
      const paid = Number(d.amountPaid) || 0;
      const waiver = Number(d.waiverAmount) || 0;
      if (paid + waiver <= 0.009) {
        batch.delete(s.ref);
      } else {
        batch.update(s.ref, {
          billedAmount: 0,
          originalBilledAmount: Number(d.billedAmount) || 0,
          waiverAmount: 0, // a waiver on a cancelled day is not money; only real cash becomes credit
          originalWaiverAmount: waiver,
          voided: true,
          voidReason: 'Student marked absent/excused',
          voidedAt: serverTimestamp(),
          status: paid > 0.009 ? 'Paid' : 'Void',
        });
        if (paid > 0.009) createdCredit = true;
      }
      ops++;
    }

    if (ops > 0) await batch.commit();

    if (createdCredit) {
      const keys = [student.uid, student.id, student.studentId, student.admissionNo, student.admissionNumber].filter(Boolean) as string[];
      const res = await reallocateExistingOverpayments({ firestore, schoolId, studentKeys: keys, performedBy: 'Auto-credit (absence correction)' });
      await setStudentCreditMarker(firestore, student.id || student.uid, res.remainingCredit);
    }
  } catch (e) {
    console.warn('Absence bill reversal skipped:', e);
  }
}

// Default rates are now 0 to ensure we only bill what is explicitly set in school settings
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
 * Bills a student for canteen and/or bus services when they attend school.
 * Uses startOfDay for timestamps to ensure compatibility with sync tools.
 */
export async function billStudentForAttendance(
  firestore: Firestore,
  student: Student,
  attendanceDate: Date,
  schoolId: string,
  providedRates?: { canteen: number, transport: number },
  existingBillIds?: Set<string>,
  voidedBills?: Map<string, any>,
  termStamp?: TermStamp | null,
  pauses?: BillingPause[]
): Promise<BillingResult> {
  
  try {
    if (!student || !student.uid || !schoolId) {
      return {
        success: false,
        message: 'Invalid student or school data',
        amountBilled: 0
      };
    }

    // NORMALIZE DATE: Anchor to canonical UTC midnight for the selected calendar date regardless of device timezone
    const displayDate = startOfDay(attendanceDate);
    const normalizedUtcDate = schoolDayStartUtc(attendanceDate);
    const dateStr = schoolDayDateStr(attendanceDate);

    // 1. Check preferences (shared predicates with Bulk Receipts & Reconciliation)
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
    // Director billing pause: a paused service has rate 0, so nothing is created or restored for it.
    const activePauses = pauses ?? await fetchBillingPauses(firestore, schoolId);
    const canteenPaused = isServicePausedOnDate(activePauses, dateStr, 'canteen');
    const transportPaused = isServicePausedOnDate(activePauses, dateStr, 'transport');

    const canteenRate = canteenPaused ? 0 : (providedRates && providedRates.canteen !== undefined)
      ? providedRates.canteen
      : DAILY_RATES.CANTEEN;

    const transportRate = transportPaused ? 0 : (providedRates && providedRates.transport !== undefined)
      ? providedRates.transport
      : DAILY_RATES.BUS;

    const batch = writeBatch(firestore);
    let totalBilled = 0;
    const billedServices: string[] = [];
    // Every new bill carries termId + academicYear + term (see src/lib/term.ts).
    const stamp = termStamp === undefined ? await fetchCurrentTermStamp(firestore, schoolId) : termStamp;
    const termFields = stamp ? { ...stamp, isArchived: false } : { isArchived: false };

    // SAFETY: never overwrite a bill that already exists for this day. Re-running billing (e.g. the
    // "Bill Today's Services" button) used to reset an already-paid bill back to amountPaid 0 / Unpaid.
    // When the caller pre-fetched today's bill IDs we trust that set (no extra reads); otherwise we check.
    const canteenRecordId = `canteen-${student.uid}-${dateStr}`;
    const transportRecordId = `transport-${student.uid}-${dateStr}`;
    const alreadyBilled = new Set<string>(existingBillIds ? Array.from(existingBillIds) : []);
    // Bills voided by an earlier absence correction are restored (not skipped, not overwritten).
    const voided = new Map<string, any>(voidedBills ? Array.from(voidedBills.entries()) : []);
    if (!existingBillIds) {
      try {
        const [cSnap, tSnap] = await Promise.all([
          getDoc(doc(firestore, 'financialRecords', canteenRecordId)),
          getDoc(doc(firestore, 'financialRecords', transportRecordId)),
        ]);
        for (const s of [cSnap, tSnap]) {
          if (!s.exists()) continue;
          if ((s.data() as any)?.voided) voided.set(s.id, s.data());
          else alreadyBilled.add(s.id);
        }
      } catch (checkErr) {
        // Never block billing because of the safety check.
        console.warn('Existing-bill check failed; continuing with billing:', checkErr);
      }
    }

    // 3. Process Canteen Bill (Using Deterministic ID)
    if (shouldBillCanteen && canteenRate > 0 && voided.has(canteenRecordId)) {
        batch.update(doc(firestore, 'financialRecords', canteenRecordId), restoreVoidedBill(voided.get(canteenRecordId), canteenRate));
        totalBilled += canteenRate;
        billedServices.push('Canteen');
    } else if (shouldBillCanteen && canteenRate > 0 && !alreadyBilled.has(canteenRecordId)) {
        const canteenRef = doc(firestore, 'financialRecords', canteenRecordId);
        
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
            dueDate: Timestamp.fromDate(normalizedUtcDate), // Standardized to UTC Start of School Day
            createdAt: serverTimestamp(),
            schoolId: schoolId,
            ...termFields,
        }, { merge: true });
        totalBilled += canteenRate;
        billedServices.push('Canteen');
    }

    // 4. Process Transport Bill (Using Deterministic ID)
    if (shouldBillTransport && transportRate > 0 && voided.has(transportRecordId)) {
        batch.update(doc(firestore, 'financialRecords', transportRecordId), restoreVoidedBill(voided.get(transportRecordId), transportRate));
        totalBilled += transportRate;
        billedServices.push('Transport');
    } else if (shouldBillTransport && transportRate > 0 && !alreadyBilled.has(transportRecordId)) {
        const transportRef = doc(firestore, 'financialRecords', transportRecordId);
        
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
            dueDate: Timestamp.fromDate(normalizedUtcDate), // Standardized to UTC Start of School Day
            createdAt: serverTimestamp(),
            schoolId: schoolId,
            ...termFields,
        }, { merge: true });
        totalBilled += transportRate;
        billedServices.push('Transport');
    }

    if (billedServices.length > 0) {
        await batch.commit();
        // Apply any credit the student is holding (e.g. prepaid the week). Never throws.
        const credited = await applyHeldCreditAfterBilling(firestore, schoolId, student);
        return {
            success: true,
            message: `Billed GHS ${totalBilled.toFixed(2)} for ${billedServices.join(' and ')}${credited > 0 ? ` (GHS ${credited.toFixed(2)} paid from credit)` : ''}`,
            amountBilled: totalBilled
        };
    }

    return {
        success: true,
        message: (canteenPaused || transportPaused)
          ? 'No bills generated: daily billing is paused for this date by the Director'
          : 'No bills generated (rates are 0 or student already billed)',
        amountBilled: 0
    };

  } catch (error: any) {
    console.error('Billing error:', error);
    return {
      success: false,
      message: `Billing failed: ${error.message}`,
      amountBilled: 0
    };
  }
}

/**
 * Main function called by the Attendance UI to bill a list of students.
 */
export async function billMultipleStudents(
  firestore: Firestore,
  students: Student[],
  attendanceDate: Date,
  schoolId: string,
  onProgress?: (current: number, total: number, studentName: string) => void
): Promise<{
  successful: number;
  failed: number;
  totalBilled: number;
  errors: string[];
}> {
  if (!students.length || !schoolId) {
    return { successful: 0, failed: 0, totalBilled: 0, errors: [] };
  }

  const displayDate = startOfDay(attendanceDate);
  const normalizedUtcDate = schoolDayStartUtc(attendanceDate);
  const dateStr = schoolDayDateStr(attendanceDate);

  // 1. Run all setup reads in parallel (1 network round-trip instead of 4+ sequential reads):
  //    canteen rates, transport routes, current term stamp, and existing daily bill IDs (in 30-ID chunks).
  const ids = students.flatMap(st => st?.uid ? [`canteen-${st.uid}-${dateStr}`, `transport-${st.uid}-${dateStr}`] : []);
  const idChunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 30) {
    idChunks.push(ids.slice(i, i + 30));
  }

  const [canteenResult, routesResult, termStamp, existingBillsResult, pauses] = await Promise.all([
    getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen')).catch(err => {
      console.warn("Could not fetch canteen rates:", err);
      return null;
    }),
    getDocs(query(collection(firestore, 'routes'), where('schoolId', '==', schoolId))).catch(err => {
      console.warn("Could not fetch transport routes:", err);
      return null;
    }),
    fetchCurrentTermStamp(firestore, schoolId),
    Promise.all(
      idChunks.map(chunk =>
        getDocs(query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), where(documentId(), 'in', chunk)))
      )
    ).catch((err: any) => {
      if (err?.message !== 'small-batch') console.warn("Could not fetch existing daily bills; checking per student instead:", err);
      return null;
    }),
    fetchBillingPauses(firestore, schoolId),
  ]);

  const canteenPaused = isServicePausedOnDate(pauses, dateStr, 'canteen');
  const transportPaused = isServicePausedOnDate(pauses, dateStr, 'transport');
  // Everything paused for the day: attendance is still recorded, but there is nothing to bill.
  if (canteenPaused && transportPaused) {
    return { successful: students.length, failed: 0, totalBilled: 0, errors: [] };
  }

  let canteenModel = 'Flat';
  let globalCanteenRate = 0;
  let classCanteenRates: Record<string, number> = {};
  if (canteenResult?.exists()) {
    const canteenData = canteenResult.data();
    canteenModel = canteenData?.pricingModel || 'Flat';
    globalCanteenRate = Number(canteenData?.dailyRate) || 0;
    classCanteenRates = canteenData?.classRates || {};
  }

  const studentToTransportRateMap = new Map<string, number>();
  if (routesResult) {
    routesResult.docs.forEach(d => {
      const data = d.data();
      const dailyRate = Number(data.dailyRate) || 0;
      data.stops?.forEach((stop: any) => {
        stop.assignedStudentIds?.forEach((sid: string) => {
          studentToTransportRateMap.set(sid, dailyRate);
        });
      });
    });
  }

  let existingBillIds: Set<string> | undefined;
  const voidedBills = new Map<string, any>();
  if (existingBillsResult) {
    existingBillIds = new Set<string>();
    existingBillsResult.forEach(snap => {
      snap.docs.forEach(d => {
        if ((d.data() as any)?.voided) voidedBills.set(d.id, d.data());
        else existingBillIds!.add(d.id);
      });
    });
  }

  // A paused service resolves to rate 0, which the planners below treat as "do not bill / do not restore".
  const resolveRates = (student: Student) => ({
    canteen: canteenPaused ? 0 : (canteenModel === 'Flat' ? globalCanteenRate : (classCanteenRates[student.classId] || 0)),
    transport: transportPaused ? 0 : (studentToTransportRateMap.get(student.uid) || 0),
  });

  let successful = 0;
  let failed = 0;
  let totalBilled = 0;
  const errors: string[] = [];

  // 2. Fast atomic path: commit all daily bills in a single writeBatch (chunked at 200 writes)
  //    instead of N sequential commits. Eliminates partial-class billing when teachers close their phone/tab.
  if (existingBillIds) {
    const termFields = termStamp ? { ...termStamp, isArchived: false } : { isArchived: false };
    const formattedDate = format(displayDate, 'PPP');
    const dueTimestamp = Timestamp.fromDate(normalizedUtcDate);

    type PlannedWrite =
      | { kind: 'set'; ref: ReturnType<typeof doc>; data: Record<string, any> }
      | { kind: 'update'; ref: ReturnType<typeof doc>; data: Record<string, any> };
    type PlannedStudent = { student: Student; writes: PlannedWrite[]; amountBilled: number };

    const planned: PlannedStudent[] = [];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
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

      const { canteen: canteenRate, transport: transportRate } = resolveRates(student);
      const canteenRecordId = `canteen-${student.uid}-${dateStr}`;
      const transportRecordId = `transport-${student.uid}-${dateStr}`;
      const writes: PlannedWrite[] = [];
      let studentBilled = 0;

      if (shouldBillCanteen && canteenRate > 0 && voidedBills.has(canteenRecordId)) {
        writes.push({
          kind: 'update',
          ref: doc(firestore, 'financialRecords', canteenRecordId),
          data: restoreVoidedBill(voidedBills.get(canteenRecordId), canteenRate),
        });
        studentBilled += canteenRate;
      } else if (shouldBillCanteen && canteenRate > 0 && !existingBillIds.has(canteenRecordId)) {
        writes.push({
          kind: 'set',
          ref: doc(firestore, 'financialRecords', canteenRecordId),
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
            createdAt: serverTimestamp(),
            schoolId,
            ...termFields,
          },
        });
        studentBilled += canteenRate;
      }

      if (shouldBillTransport && transportRate > 0 && voidedBills.has(transportRecordId)) {
        writes.push({
          kind: 'update',
          ref: doc(firestore, 'financialRecords', transportRecordId),
          data: restoreVoidedBill(voidedBills.get(transportRecordId), transportRate),
        });
        studentBilled += transportRate;
      } else if (shouldBillTransport && transportRate > 0 && !existingBillIds.has(transportRecordId)) {
        writes.push({
          kind: 'set',
          ref: doc(firestore, 'financialRecords', transportRecordId),
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
            createdAt: serverTimestamp(),
            schoolId,
            ...termFields,
          },
        });
        studentBilled += transportRate;
      }

      if (writes.length > 0) {
        planned.push({ student, writes, amountBilled: studentBilled });
      } else {
        successful++;
      }
    }

    if (onProgress) onProgress(students.length, students.length, `${planned.length} bill(s) committing...`);

    // Chunk into batches of at most 200 Firestore writes (well below the 500-write limit; 1 batch for typical classes)
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

    const studentsToApplyCredit: Student[] = [];

    for (const group of batches) {
      const batch = writeBatch(firestore);
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
          if ((item.student as any)?.hasAccountCredit) {
            studentsToApplyCredit.push(item.student);
          }
        }
      } catch (batchErr: any) {
        // Fallback: if a batch fails (e.g. one student's doc violates a rule), bill each student individually
        // so the remaining students in the class are still billed.
        console.warn('Batched daily billing commit failed; falling back to per-student billing:', batchErr);
        for (const item of group) {
          try {
            const result = await billStudentForAttendance(
              firestore,
              item.student,
              attendanceDate,
              schoolId,
              resolveRates(item.student),
              existingBillIds,
              voidedBills,
              termStamp,
              pauses
            );
            if (result.success) {
              successful++;
              totalBilled += result.amountBilled;
            } else {
              failed++;
              errors.push(`${item.student.firstName || 'Student'}: ${result.message}`);
            }
          } catch (err: any) {
            failed++;
            errors.push(`${item.student.firstName || 'Student'}: ${err.message || 'Billing error'}`);
          }
        }
      }
    }

    // 3. Apply held account credit in parallel ONLY for students marked with credit (0 reads for everyone else).
    if (studentsToApplyCredit.length > 0) {
      await Promise.allSettled(
        studentsToApplyCredit.map(st => applyHeldCreditAfterBilling(firestore, schoolId, st))
      );
    }

    return { successful, failed, totalBilled, errors };
  }

  // Fallback path (only if existingBillIds pre-fetch failed): per-student billing with existence check
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (onProgress) onProgress(i + 1, students.length, `${student.firstName || ''} ${student.lastName || ''}`);

    try {
      const result = await billStudentForAttendance(
        firestore,
        student,
        attendanceDate,
        schoolId,
        resolveRates(student),
        undefined,
        undefined,
        termStamp,
        pauses
      );
      if (result.success) {
        successful++;
        totalBilled += result.amountBilled;
      } else {
        failed++;
        errors.push(`${student.firstName || 'Student'}: ${result.message}`);
      }
    } catch (err: any) {
      failed++;
      errors.push(`${student.firstName || 'Student'}: ${err.message || 'Billing error'}`);
    }
  }

  return { successful, failed, totalBilled, errors };
}

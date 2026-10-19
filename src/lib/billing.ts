'use client';

import { doc, getDoc, serverTimestamp, Timestamp, collection, writeBatch, query, where, getDocs } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { format, startOfDay } from 'date-fns';
import { applyHeldCreditAfterBilling, reallocateExistingOverpayments, setStudentCreditMarker } from '@/lib/credit-allocation';
import { currentTermFromProfile, type TermStamp } from '@/lib/term';

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

/** Fields that bring a bill voided by an absence correction back to life (student re-marked present). */
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

    // NORMALIZE DATE: Use midnight for all financial dueDates
    const normalizedDate = startOfDay(attendanceDate);
    const dateStr = format(normalizedDate, 'yyyy-MM-dd');

    // 1. Check preferences
    // Only bill daily Canteen if their mode is 'Daily' (or not set, assuming default daily)
    const shouldBillCanteen = student.canteenBillingMode === 'Daily' || (student.usesCanteen !== false && !student.canteenBillingMode);
    
    // Only bill daily Transport if they use the bus AND their mode is 'Daily'
    const isDailyTransportSubscriber = student.usesBusService === true && student.transportBillingModel === 'Daily';

    if (!shouldBillCanteen && !isDailyTransportSubscriber) {
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
            description: `Canteen - ${format(normalizedDate, 'PPP')}`,
            billedAmount: canteenRate,
            amountPaid: 0,
            waiverAmount: 0,
            status: 'Unpaid',
            dueDate: Timestamp.fromDate(normalizedDate), // Standardized to Start of Day
            createdAt: serverTimestamp(),
            schoolId: schoolId,
            ...termFields,
        }, { merge: true });
        totalBilled += canteenRate;
        billedServices.push('Canteen');
    }

    // 4. Process Transport Bill (Using Deterministic ID)
    if (isDailyTransportSubscriber && transportRate > 0 && voided.has(transportRecordId)) {
        batch.update(doc(firestore, 'financialRecords', transportRecordId), restoreVoidedBill(voided.get(transportRecordId), transportRate));
        totalBilled += transportRate;
        billedServices.push('Transport');
    } else if (isDailyTransportSubscriber && transportRate > 0 && !alreadyBilled.has(transportRecordId)) {
        const transportRef = doc(firestore, 'financialRecords', transportRecordId);
        
        batch.set(transportRef, {
            studentId: student.uid,
            studentName: `${student.firstName} ${student.lastName}`,
            classId: student.classId || '',
            type: 'Transport Fee (Daily)',
            description: `Transport - ${format(normalizedDate, 'PPP')}`,
            billedAmount: transportRate,
            amountPaid: 0,
            waiverAmount: 0,
            status: 'Unpaid',
            dueDate: Timestamp.fromDate(normalizedDate), // Standardized to Start of Day
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
        message: 'No bills generated (rates are 0 or student already billed)',
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
  
  // 1. Fetch Canteen Settings (Dynamic Model)
  let canteenModel = 'Flat';
  let globalCanteenRate = 0;
  let classCanteenRates: Record<string, number> = {};
  try {
      const canteenSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
      if (canteenSettingsSnap.exists()) {
          const canteenData = canteenSettingsSnap.data();
          canteenModel = canteenData?.pricingModel || 'Flat';
          globalCanteenRate = Number(canteenData?.dailyRate) || 0;
          classCanteenRates = canteenData?.classRates || {};
      }
  } catch (err) {
      console.warn("Could not fetch canteen rates:", err);
  }

  // 2. Fetch ALL Transport Routes for this school and build a Student -> Rate Map
  const studentToTransportRateMap = new Map<string, number>();
  try {
      const routesQuery = query(collection(firestore, 'routes'), where('schoolId', '==', schoolId));
      const routesSnap = await getDocs(routesQuery);
      routesSnap.docs.forEach(d => {
          const data = d.data();
          const dailyRate = Number(data.dailyRate) || 0;
          data.stops?.forEach((stop: any) => {
              stop.assignedStudentIds?.forEach((sid: string) => {
                  studentToTransportRateMap.set(sid, dailyRate);
              });
          });
      });
  } catch (err) {
      console.warn("Could not fetch transport routes:", err);
  }

  // 2b. Current term (one read for the whole batch)
  const termStamp = await fetchCurrentTermStamp(firestore, schoolId);

  // 3. Fetch existing bills for this date and school to avoid overwriting them
  const normalizedDate = startOfDay(attendanceDate);
  let existingBillIds: Set<string> | undefined = new Set<string>();
  const voidedBills = new Map<string, any>();
  try {
      // Small batches (quick toggles) check each student's two bills directly instead of reading every
      // daily bill in the school for the date.
      if (students.length <= 5) throw new Error('small-batch');
      const billsQuery = query(
          collection(firestore, 'financialRecords'),
          where('schoolId', '==', schoolId),
          where('dueDate', '==', Timestamp.fromDate(normalizedDate))
      );
      const billsSnap = await getDocs(billsQuery);
      billsSnap.docs.forEach(d => {
          if ((d.data() as any)?.voided) voidedBills.set(d.id, d.data());
          else existingBillIds!.add(d.id);
      });
  } catch (err: any) {
      if (err?.message !== 'small-batch') console.warn("Could not fetch existing daily bills; checking per student instead:", err);
      existingBillIds = undefined; // forces a per-student existence check so paid bills are never overwritten
  }

  let successful = 0;
  let failed = 0;
  let totalBilled = 0;
  const errors: string[] = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (onProgress) onProgress(i + 1, students.length, `${student.firstName || ''} ${student.lastName || ''}`);

    try {
        let studentCanteenRate = 0;
        if (canteenModel === 'Flat') {
            studentCanteenRate = globalCanteenRate;
        } else {
            studentCanteenRate = classCanteenRates[student.classId] || 0;
        }

        const transportRate = studentToTransportRateMap.get(student.uid) || 0;

        const result = await billStudentForAttendance(firestore, student, attendanceDate, schoolId, { 
            canteen: studentCanteenRate, 
            transport: transportRate 
        }, existingBillIds, existingBillIds ? voidedBills : undefined, termStamp);
        
        if (result.success) {
          if (result.amountBilled > 0) {
            successful++;
            totalBilled += result.amountBilled;
          } else {
            successful++; 
          }
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

import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { format, startOfDay } from 'date-fns';
import { applyHeldCreditAfterBillingServer } from '@/lib/credit-allocation-server';
import { currentTermFromProfile, type TermStamp } from '@/lib/term';

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

    // NORMALIZE DATE: Use midnight for all financial dueDates
    const normalizedDate = startOfDay(attendanceDate);
    const dateStr = format(normalizedDate, 'yyyy-MM-dd');

    // 1. Check preferences
    const shouldBillCanteen = student.canteenBillingMode === 'Daily' || (student.usesCanteen !== false && !student.canteenBillingMode);
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
        description: `Canteen - ${format(normalizedDate, 'PPP')}`,
        billedAmount: canteenRate,
        amountPaid: 0,
        waiverAmount: 0,
        status: 'Unpaid',
        dueDate: Timestamp.fromDate(normalizedDate),
        createdAt: FieldValue.serverTimestamp(),
        schoolId: schoolId,
        ...termFields,
      }, { merge: true });
      totalBilled += canteenRate;
      billedServices.push('Canteen');
    }

    // 4. Process Transport Bill (Using Deterministic ID)
    if (isDailyTransportSubscriber && transportRate > 0 && voided.has(transportRecordId)) {
      batch.update(db.collection('financialRecords').doc(transportRecordId), restoreVoided(voided.get(transportRecordId), transportRate));
      totalBilled += transportRate;
      billedServices.push('Transport');
    } else if (isDailyTransportSubscriber && transportRate > 0 && !alreadyBilled.has(transportRecordId)) {
      const transportRef = db.collection('financialRecords').doc(transportRecordId);
      
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
        dueDate: Timestamp.fromDate(normalizedDate),
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
  // 1. Fetch Canteen Settings
  const canteenSettingsSnap = await db.collection('schoolSettings').doc(schoolId).collection('rates').doc('canteen').get();
  const canteenData = canteenSettingsSnap.data();
  const canteenModel = canteenData?.pricingModel || 'Flat';
  const globalCanteenRate = canteenData?.dailyRate || 0;
  const classCanteenRates = canteenData?.classRates || {};

  // 2. Fetch ALL Transport Routes for this school and build a Student -> Rate Map
  const routesSnap = await db.collection('routes').where('schoolId', '==', schoolId).get();
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

  const termStamp = await fetchCurrentTermStampServer(db, schoolId);

  let successful = 0;
  let failed = 0;
  let totalBilled = 0;
  const errors: string[] = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    // A. Resolve Canteen Rate
    let studentCanteenRate = 0;
    if (canteenModel === 'Flat') {
      studentCanteenRate = globalCanteenRate;
    } else {
      studentCanteenRate = classCanteenRates[student.classId] || 0;
    }

    // B. Resolve Transport Rate
    const transportRate = studentToTransportRateMap.get(student.uid) || 0;

    const result = await billStudentForAttendanceServer(db, student, attendanceDate, schoolId, { 
      canteen: studentCanteenRate, 
      transport: transportRate 
    }, termStamp);
    
    if (result.success) {
      if (result.amountBilled > 0) {
        successful++;
        totalBilled += result.amountBilled;
      } else {
        successful++; 
      }
    } else {
      failed++;
      errors.push(`${student.firstName}: ${result.message}`);
    }
  }

  return { successful, failed, totalBilled, errors };
}

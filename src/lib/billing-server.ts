import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { format, startOfDay } from 'date-fns';

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
  providedRates?: { canteen: number; transport: number }
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

    // 3. Process Canteen Bill (Using Deterministic ID)
    if (shouldBillCanteen && canteenRate > 0) {
      const canteenRecordId = `canteen-${student.uid}-${dateStr}`;
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
      }, { merge: true });
      totalBilled += canteenRate;
      billedServices.push('Canteen');
    }

    // 4. Process Transport Bill (Using Deterministic ID)
    if (isDailyTransportSubscriber && transportRate > 0) {
      const transportRecordId = `transport-${student.uid}-${dateStr}`;
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
      }, { merge: true });
      totalBilled += transportRate;
      billedServices.push('Transport');
    }

    if (billedServices.length > 0) {
      await batch.commit();
      return {
        success: true,
        message: `Billed GHS ${totalBilled.toFixed(2)} for ${billedServices.join(' and ')}`,
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
    });
    
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

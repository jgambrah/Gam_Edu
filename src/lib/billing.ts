'use client';

import { doc, getDoc, serverTimestamp, Timestamp, collection, writeBatch, query, where, getDocs } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { format, startOfDay } from 'date-fns';

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
  existingBillIds?: Set<string>
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

    // 3. Process Canteen Bill (Using Deterministic ID)
    const canteenRecordId = `canteen-${student.uid}-${dateStr}`;
    if (shouldBillCanteen && canteenRate > 0 && (!existingBillIds || !existingBillIds.has(canteenRecordId))) {
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
        }, { merge: true });
        totalBilled += canteenRate;
        billedServices.push('Canteen');
    }

    // 4. Process Transport Bill (Using Deterministic ID)
    const transportRecordId = `transport-${student.uid}-${dateStr}`;
    if (isDailyTransportSubscriber && transportRate > 0 && (!existingBillIds || !existingBillIds.has(transportRecordId))) {
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

  // 3. Fetch existing bills for this date and school to avoid overwriting them
  const normalizedDate = startOfDay(attendanceDate);
  const existingBillIds = new Set<string>();
  try {
      const billsQuery = query(
          collection(firestore, 'financialRecords'),
          where('schoolId', '==', schoolId),
          where('dueDate', '==', Timestamp.fromDate(normalizedDate))
      );
      const billsSnap = await getDocs(billsQuery);
      billsSnap.docs.forEach(d => existingBillIds.add(d.id));
  } catch (err) {
      console.warn("Could not fetch existing daily bills:", err);
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
        }, existingBillIds);
        
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

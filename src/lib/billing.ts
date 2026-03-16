'use client';

import { doc, setDoc, getDoc, serverTimestamp, Timestamp, collection, writeBatch, query, where, getDocs } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { format } from 'date-fns';

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
 */
export async function billStudentForAttendance(
  firestore: Firestore,
  student: Student,
  attendanceDate: Date,
  schoolId: string,
  providedRates?: { canteen: number, transport: number }
): Promise<BillingResult> {
  
  try {
    if (!student || !student.uid || !schoolId) {
      return {
        success: false,
        message: 'Invalid student or school data',
        amountBilled: 0
      };
    }

    // NEW: Check the student's transport billing model
    const isDailyTransportSubscriber = student.usesBusService === true && student.transportBillingModel === 'Daily';
    const shouldBillCanteen = student.usesCanteen !== false;

    if (!shouldBillCanteen && !isDailyTransportSubscriber) {
      return {
        success: true,
        message: 'No daily services to bill (skipped Termly subscribers)',
        amountBilled: 0
      };
    }

    // Explicitly check for undefined to allow 0.00 as a valid rate
    const canteenRate = (providedRates && providedRates.canteen !== undefined) 
      ? providedRates.canteen 
      : DAILY_RATES.CANTEEN;
      
    const transportRate = (providedRates && providedRates.transport !== undefined)
      ? providedRates.transport
      : DAILY_RATES.BUS;

    const dateStr = format(attendanceDate, 'yyyy-MM-dd');
    const batch = writeBatch(firestore);
    let totalBilled = 0;
    const billedServices: string[] = [];

    // 1. Process Canteen Bill
    if (shouldBillCanteen && canteenRate > 0) {
        const canteenRecordId = `canteen-${student.uid}-${dateStr}`;
        const canteenRef = doc(firestore, 'financialRecords', canteenRecordId);
        
        batch.set(canteenRef, {
            studentId: student.uid,
            studentName: `${student.firstName} ${student.lastName}`,
            classId: student.classId || '',
            type: 'Canteen Fee',
            description: `Canteen - ${format(attendanceDate, 'PPP')}`,
            billedAmount: canteenRate,
            amountPaid: 0,
            waiverAmount: 0,
            status: 'Unpaid',
            dueDate: Timestamp.fromDate(attendanceDate),
            createdAt: serverTimestamp(),
            schoolId: schoolId,
        }, { merge: true });
        totalBilled += canteenRate;
        billedServices.push('Canteen');
    }

    // 2. Process Transport Bill (Only if 'Daily' model)
    if (isDailyTransportSubscriber && transportRate > 0) {
        const transportRecordId = `transport-${student.uid}-${dateStr}`;
        const transportRef = doc(firestore, 'financialRecords', transportRecordId);
        
        batch.set(transportRef, {
            studentId: student.uid,
            studentName: `${student.firstName} ${student.lastName}`,
            classId: student.classId || '',
            type: 'Transport Fee (Daily)',
            description: `Transport - ${format(attendanceDate, 'PPP')}`,
            billedAmount: transportRate,
            amountPaid: 0,
            waiverAmount: 0,
            status: 'Unpaid',
            dueDate: Timestamp.fromDate(attendanceDate),
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
  const canteenSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
  const canteenData = canteenSettingsSnap.data();
  const canteenModel = canteenData?.pricingModel || 'Flat';
  const globalCanteenRate = canteenData?.dailyRate || 0;
  const classCanteenRates = canteenData?.classRates || {};

  // 2. Fetch ALL Transport Routes for this school to build a Rate Map
  const routesQuery = query(collection(firestore, 'routes'), where('schoolId', '==', schoolId));
  const routesSnap = await getDocs(routesQuery);
  const routeRatesMap = new Map<string, number>();
  routesSnap.docs.forEach(doc => {
      routeRatesMap.set(doc.id, doc.data().dailyRate || 0);
  });

  let successful = 0;
  let failed = 0;
  let totalBilled = 0;
  const errors: string[] = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (onProgress) onProgress(i + 1, students.length, `${student.firstName} ${student.lastName}`);

    // A. Resolve Canteen Rate per student
    let studentCanteenRate = 0;
    if (canteenModel === 'Flat') {
        studentCanteenRate = globalCanteenRate;
    } else {
        studentCanteenRate = classCanteenRates[student.classId] || 0;
    }

    // B. Resolve Transport Rate per student
    const transportRate = student.routeId ? (routeRatesMap.get(student.routeId) || 0) : 0;

    const result = await billStudentForAttendance(firestore, student, attendanceDate, schoolId, { 
        canteen: studentCanteenRate, 
        transport: transportRate 
    });
    
    if (result.success) {
      if (result.amountBilled > 0) {
        successful++;
        totalBilled += result.amountBilled;
      }
    } else {
      failed++;
      errors.push(`${student.firstName}: ${result.message}`);
    }
  }

  return { successful, failed, totalBilled, errors };
}

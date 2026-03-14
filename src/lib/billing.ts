'use client';

import { doc, setDoc, getDoc, serverTimestamp, Timestamp, collection, writeBatch } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { format } from 'date-fns';

// Define your daily rates (adjust these to your school's rates)
const DAILY_RATES = {
  CANTEEN: 7.00,  // GHS per day
  BUS: 3.00,      // GHS per day
};

interface BillingResult {
  success: boolean;
  message: string;
  amountBilled: number;
}

/**
 * Bills a student for canteen and/or bus services when they attend school.
 * Now generates individual records per service for better accounting.
 */
export async function billStudentForAttendance(
  firestore: Firestore,
  student: Student,
  attendanceDate: Date,
  schoolId: string,
  providedRates?: { canteen: number, transport: number }
): Promise<BillingResult> {
  
  try {
    // Safety checks
    if (!student || !student.uid || !schoolId) {
      console.error('Invalid student or school data:', student);
      return {
        success: false,
        message: 'Invalid data provided for billing',
        amountBilled: 0
      };
    }

    // Determine which services to bill for
    const shouldBillCanteen = student.usesCanteen !== false;
    const shouldBillBus = student.usesBusService === true;

    // If student doesn't use any services, skip billing
    if (!shouldBillCanteen && !shouldBillBus) {
      return {
        success: true,
        message: 'Student not subscribed to any billable services',
        amountBilled: 0
      };
    }

    // Use provided rates or fall back to defaults
    const canteenRate = providedRates ? providedRates.canteen : DAILY_RATES.CANTEEN;
    const transportRate = providedRates ? providedRates.transport : DAILY_RATES.BUS;

    // Create unique record ID prefix based on date and student
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

    // 2. Process Transport Bill
    if (shouldBillBus && transportRate > 0) {
        const transportRecordId = `transport-${student.uid}-${dateStr}`;
        const transportRef = doc(firestore, 'financialRecords', transportRecordId);
        
        batch.set(transportRef, {
            studentId: student.uid,
            studentName: `${student.firstName} ${student.lastName}`,
            classId: student.classId || '',
            type: 'Transport Fee',
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
        message: 'No new bills needed (already billed or zero rates)',
        amountBilled: 0
    };

  } catch (error: any) {
    console.error('Billing error for student:', student?.uid, error);
    return {
      success: false,
      message: `Billing failed: ${error.message}`,
      amountBilled: 0
    };
  }
}

/**
 * Bulk billing function for multiple students.
 * Fetches rates once to optimize performance.
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
  
  // Fetch school settings once
  const canteenRateDoc = await getDoc(doc(firestore, `schoolSettings/${schoolId}/rates/canteen`));
  const transportRateDoc = await getDoc(doc(firestore, `schoolSettings/${schoolId}/rates/transport`));
  
  const rates = {
      canteen: canteenRateDoc.exists() ? canteenRateDoc.data().dailyRate : DAILY_RATES.CANTEEN,
      transport: transportRateDoc.exists() ? transportRateDoc.data().dailyRate : DAILY_RATES.BUS
  };

  let successful = 0;
  let failed = 0;
  let totalBilled = 0;
  const errors: string[] = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    
    if (onProgress) {
      onProgress(i + 1, students.length, `${student.firstName} ${student.lastName}`);
    }

    const result = await billStudentForAttendance(firestore, student, attendanceDate, schoolId, rates);
    
    if (result.success) {
      if (result.amountBilled > 0) {
        successful++;
        totalBilled += result.amountBilled;
      }
    } else {
      failed++;
      errors.push(`${student.firstName}: ${result.message}`);
    }

    if (i < students.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  return {
    successful,
    failed,
    totalBilled,
    errors
  };
}

export { DAILY_RATES };

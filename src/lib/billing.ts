'use client';

import { doc, setDoc, getDoc, serverTimestamp, Timestamp, collection, writeBatch } from 'firebase/firestore';
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

    const shouldBillCanteen = student.usesCanteen !== false;
    const shouldBillBus = student.usesBusService === true;

    if (!shouldBillCanteen && !shouldBillBus) {
      return {
        success: true,
        message: 'No subscribed services',
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
  
  const canteenRateDoc = await getDoc(doc(firestore, `schoolSettings/${schoolId}/rates/canteen`));
  const transportRateDoc = await getDoc(doc(firestore, `schoolSettings/${schoolId}/rates/transport`));
  
  const rates = {
      canteen: canteenRateDoc.exists() ? Number(canteenRateDoc.data().dailyRate) : DAILY_RATES.CANTEEN,
      transport: transportRateDoc.exists() ? Number(transportRateDoc.data().dailyRate) : DAILY_RATES.BUS
  };

  let successful = 0;
  let failed = 0;
  let totalBilled = 0;
  const errors: string[] = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (onProgress) onProgress(i + 1, students.length, `${student.firstName} ${student.lastName}`);

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
  }

  return { successful, failed, totalBilled, errors };
}
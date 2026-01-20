
'use client';

/**
 * ROBUST ATTENDANCE BILLING SYSTEM
 * 
 * This helper function ensures all students are billed correctly
 * when marked as Present or Late in attendance.
 */

import { doc, setDoc, getDoc, serverTimestamp, Timestamp, collection, writeBatch } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { format } from 'date-fns';

// Define your daily rates (adjust these to your school's rates)
const DAILY_RATES = {
  CANTEEN: 5.00,  // GHS per day
  BUS: 3.00,      // GHS per day
};

interface BillingResult {
  success: boolean;
  message: string;
  amountBilled: number;
}

/**
 * Bills a student for canteen and/or bus services when they attend school
 */
export async function billStudentForAttendance(
  firestore: Firestore,
  student: Student,
  attendanceDate: Date,
  schoolId: string
): Promise<BillingResult> {
  
  try {
    // Safety checks
    if (!student || !student.uid) {
      console.error('Invalid student data:', student);
      return {
        success: false,
        message: 'Invalid student data',
        amountBilled: 0
      };
    }

    if (!schoolId) {
        return { success: false, message: 'School ID is required for billing.', amountBilled: 0 };
    }

    // Determine which services to bill for
    // DEFAULT: If usesCanteen is undefined, assume TRUE (for backward compatibility)
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

    // Calculate total amount to bill
    let totalAmount = 0;
    const services: string[] = [];

    if (shouldBillCanteen) {
      totalAmount += DAILY_RATES.CANTEEN;
      services.push('Canteen');
    }

    if (shouldBillBus) {
      totalAmount += DAILY_RATES.BUS;
      services.push('Bus Service');
    }

    if (totalAmount === 0) {
        return { success: true, message: 'No applicable charges.', amountBilled: 0 };
    }

    // Create unique record ID based on date and student
    const dateStr = attendanceDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const recordId = `${student.uid}_${dateStr}`;

    // Check if already billed for this date
    const existingRecord = await getDoc(
      doc(firestore, 'financialRecords', recordId)
    );

    if (existingRecord.exists()) {
      console.log(`Student ${student.studentId} already billed for ${dateStr}`);
      return {
        success: true,
        message: 'Already billed for this date',
        amountBilled: 0
      };
    }

    // Get student's class information
    const classDoc = student.classId 
      ? await getDoc(doc(firestore, 'classes', student.classId))
      : null;
    
    const className = classDoc?.exists() ? classDoc.data()?.name : 'Unknown Class';

    // Create financial record
    await setDoc(doc(firestore, 'financialRecords', recordId), {
      studentId: student.uid,
      studentName: `${student.firstName} ${student.lastName}`,
      classId: student.classId || '',
      className: className,
      type: 'Daily Services',
      description: `Daily charges for ${services.join(' and ')} - ${dateStr}`,
      billedAmount: totalAmount,
      amountPaid: 0,
      waiverAmount: 0,
      status: 'Unpaid',
      dueDate: Timestamp.fromDate(new Date(attendanceDate.getTime() + 7 * 24 * 60 * 60 * 1000)), // Due in 7 days
      createdAt: serverTimestamp(),
      billedBy: 'Attendance System',
      schoolId: schoolId,
    });

    console.log(`✅ Successfully billed ${student.studentId} - ${totalAmount} GHS for ${services.join(' & ')}`);

    return {
      success: true,
      message: `Billed GHS ${totalAmount.toFixed(2)} for ${services.join(' and ')}`,
      amountBilled: totalAmount
    };

  } catch (error: any) {
    console.error('Billing error for student:', student?.studentId, error);
    return {
      success: false,
      message: `Billing failed: ${error.message}`,
      amountBilled: 0
    };
  }
}

/**
 * Bulk billing function for multiple students
 * Use this when marking attendance for an entire class
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
  
  let successful = 0;
  let failed = 0;
  let totalBilled = 0;
  const errors: string[] = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    
    if (onProgress) {
      onProgress(i + 1, students.length, `${student.firstName} ${student.lastName}`);
    }

    const result = await billStudentForAttendance(firestore, student, attendanceDate, schoolId);
    
    if (result.success) {
      if (result.amountBilled > 0) {
        successful++;
        totalBilled += result.amountBilled;
      }
    } else {
      failed++;
      errors.push(`${student.studentId || student.firstName}: ${result.message}`);
    }

    // Small delay to avoid overwhelming Firestore
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

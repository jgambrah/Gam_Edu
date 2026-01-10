
import type { Student } from '@/lib/types';
import { doc, collection, runTransaction, serverTimestamp } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

/**
 * Formats student name with ID for display
 * Usage: Shows "John Doe (SS-2025-0001)" everywhere
 */
export function formatStudentNameWithId(student: Student): string {
  const fullName = `${student.firstName} ${student.lastName}`;
  const studentId = student.studentId || 'ID Pending';
  return `${fullName} (${studentId})`;
}

/**
 * Formats just the student ID with proper fallback
 */
export function formatStudentId(student?: Student): string {
  if (student?.studentId && /^SS-\d{4}-\d{4}$/.test(student.studentId)) {
    return student.studentId;
  }
  return 'ID Pending';
}

/**
 * Search/filter function that includes student ID
 * Usage: Filter students by name OR student ID
 */
export function searchStudent(student: Student, searchTerm: string): boolean {
  if (!searchTerm) return true;
  
  const term = searchTerm.toLowerCase().trim();
  const firstName = (student.firstName || '').toLowerCase();
  const lastName = (student.lastName || '').toLowerCase();
  const email = (student.email || '').toLowerCase();
  const studentId = (student.studentId || '').toLowerCase();
  
  return (
    firstName.includes(term) ||
    lastName.includes(term) ||
    email.includes(term) ||
    studentId.includes(term)
  );
}

/**
 * Compact display for badges/small spaces
 */
export function formatStudentBadge(student: Student): string {
  return `${student.firstName} ${student.lastName.charAt(0)}. - ${formatStudentId(student)}`;
}


/**
 * Atomically increments and returns the next student ID.
 * @param firestore - The Firestore instance.
 * @returns A formatted student ID string (e.g., "SS-2024-0001").
 */
export async function generateNextStudentId(firestore: Firestore): Promise<string> {
  const counterRef = doc(firestore, 'counters', 'students');
  
  const newIdNumber = await runTransaction(firestore, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    if (!counterDoc.exists()) {
      // Initialize counter if it doesn't exist
      transaction.set(counterRef, { 
        currentId: 1,
        lastUpdated: serverTimestamp()
      });
      return 1;
    }
    
    const newId = (counterDoc.data().currentId || 0) + 1;
    transaction.update(counterRef, { 
      currentId: newId,
      lastUpdated: serverTimestamp()
    });
    
    return newId;
  });
  
  const year = new Date().getFullYear();
  const paddedNumber = String(newIdNumber).padStart(4, '0');
  
  return `SS-${year}-${paddedNumber}`;
}

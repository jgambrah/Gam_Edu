import type { Student } from '@/lib/types';
import { doc, collection, runTransaction, serverTimestamp, query, where, getDocs, addDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { sendPaymentSMSNotificationAction } from '@/app/actions/sms';

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
 * @param schoolId - The ID of the school.
 * @returns A formatted student ID string (e.g., "SS-2024-0001").
 */
export async function generateNextStudentId(firestore: Firestore, schoolId: string): Promise<string> {
  const counterRef = doc(firestore, 'counters', `students_${schoolId}`);
  
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

/**
 * Atomically increments and returns the next receipt ID.
 * @param firestore - The Firestore instance.
 * @param schoolId - The ID of the school.
 * @returns A formatted receipt ID string (e.g., "RCT-2024-0001").
 */
export async function generateNextReceiptId(firestore: Firestore, schoolId: string): Promise<string> {
  const counterRef = doc(firestore, 'counters', `receipts_${schoolId}`);
  
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
  
  return `RCT-${year}-${paddedNumber}`;
}

export interface PaymentNotificationConfig {
  firestore: Firestore;
  schoolId: string;
  studentId: string;
  studentName: string;
  paymentAmount: number;
  feeType: string;
  receiptId: string;
  paymentMethod: string;
  senderUid: string;
  senderName: string;
  senderRole?: string;
  idToken?: string;
  remainingBalance?: number;
}

/**
 * Sends notifications to the parent(s) of a student when a payment is recorded:
 * 1. An automated SMS payment receipt via the school's configured gateway (Arkesel/Hubtel).
 * 2. An in-app direct message if the parent has an active app account.
 */
export async function sendPaymentNotificationToParent(config: PaymentNotificationConfig): Promise<{ success: boolean; parentCount: number; error?: string }> {
  const {
    firestore,
    schoolId,
    studentId,
    studentName,
    paymentAmount,
    feeType,
    receiptId,
    paymentMethod,
    senderUid,
    senderName,
    senderRole = 'Staff'
  } = config;

  let parentCount = 0;

  // 1. Dispatch SMS payment notification via Server Action (handles phone resolution, gateway routing, and audit logging)
  let smsResult: any = null;
  try {
    let token = config.idToken;
    if (!token && typeof window !== 'undefined') {
      try {
        const { getAuth } = await import('firebase/auth');
        token = await getAuth().currentUser?.getIdToken();
      } catch {
        // Safe fallback
      }
    }

    if (token) {
      smsResult = await sendPaymentSMSNotificationAction({
        schoolId,
        studentId,
        studentName,
        paymentAmount,
        feeType,
        receiptId,
        paymentMethod,
        remainingBalance: config.remainingBalance,
        idToken: token,
        senderName,
        senderRole
      });
      if (smsResult?.success) {
        parentCount = Math.max(parentCount, smsResult.count || 1);
        console.log(`[SMS Payment Receipt] Dispatched for ${studentName} (${receiptId})`);
      } else if (smsResult?.skipped) {
        console.info(`[SMS Payment Receipt] ${smsResult.error}`);
      } else if (smsResult?.error) {
        console.warn(`[SMS Payment Receipt] Delivery error: ${smsResult.error}`);
      }
    } else {
      console.warn(`[SMS Payment Receipt] Auth token not available to dispatch SMS.`);
    }
  } catch (smsError) {
    console.error(`[SMS Payment Receipt] Exception during dispatch:`, smsError);
  }

  // 2. In-app Direct Messaging (Non-blocking: isolated in separate try/catch)
  try {
    const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
    const schoolName = schoolDoc.data()?.name || 'our school';

    // Find parent docs either by studentIds array or by student.parentId
    const parentsToNotify: Array<{ id: string; data: any }> = [];

    // Query by studentIds
    const parentsQuery = query(
      collection(firestore, 'parents'),
      where('schoolId', '==', schoolId),
      where('studentIds', 'array-contains', studentId)
    );
    const parentsSnap = await getDocs(parentsQuery);
    parentsSnap.forEach(d => parentsToNotify.push({ id: d.id, data: d.data() }));

    // If none found by array-contains, check student doc parentId
    if (parentsToNotify.length === 0) {
      const studentSnap = await getDoc(doc(firestore, 'students', studentId));
      if (studentSnap.exists()) {
        const pId = studentSnap.data()?.parentId;
        if (pId) {
          const parentSnap = await getDoc(doc(firestore, 'parents', pId));
          if (parentSnap.exists()) {
            parentsToNotify.push({ id: parentSnap.id, data: parentSnap.data() });
          }
        }
      }
    }

    // Query direct messages where current sender is a participant (obeys security rules)
    let userChats: any[] = [];
    if (parentsToNotify.length > 0) {
      try {
        const chatsQuery = query(
          collection(firestore, 'direct_messages'),
          where('schoolId', '==', schoolId),
          where('participants', 'array-contains', senderUid)
        );
        const chatsSnap = await getDocs(chatsQuery);
        userChats = chatsSnap.docs;
      } catch (chatQErr) {
        console.warn('[Payment DM] Could not query direct_messages:', chatQErr);
      }
    }

    for (const { id: parentId, data: parentData } of parentsToNotify) {
      const parentName = `${parentData.firstName || ''} ${parentData.lastName || ''}`.trim() || 'Parent';

      let chatId = '';
      const existingChat = userChats.find(d => {
        const data = d.data();
        return !data.isGroup && data.participants?.includes(parentId);
      });

      if (existingChat) {
        chatId = existingChat.id;
      } else {
        const newChatRef = await addDoc(collection(firestore, 'direct_messages'), {
          participants: [senderUid, parentId],
          participantDetails: {
            [senderUid]: { name: senderName, role: senderRole, photoURL: null },
            [parentId]: { name: parentName, role: 'Parent', photoURL: parentData.photoURL || null }
          },
          lastMessage: 'Receipt acknowledged',
          lastMessageTime: serverTimestamp(),
          unreadCount: { [parentId]: 1, [senderUid]: 0 },
          schoolId,
          isGroup: false
        });
        chatId = newChatRef.id;
      }

      const msgText = `Dear ${parentName},\n\n` +
        `This is to acknowledge the receipt of your payment of GHS ${paymentAmount.toFixed(2)} ` +
        `towards ${feeType} for your ward, ${studentName}.\n\n` +
        `Receipt Reference: ${receiptId}\n` +
        `Payment Method: ${paymentMethod}\n\n` +
        `Thank you for your payment. Please contact the accountant, administrator, or the director in case of any discrepancy.\n\n` +
        `Best regards,\n` +
        `${senderName} (${senderRole})\n` +
        `${schoolName}`;

      await addDoc(collection(firestore, `direct_messages/${chatId}/messages`), {
        text: msgText,
        senderId: senderUid,
        createdAt: serverTimestamp(),
        type: 'text',
        status: 'sent'
      });

      const chatRef = doc(firestore, 'direct_messages', chatId);
      const chatUpdate: any = {
        lastMessage: `Payment acknowledged: GHS ${paymentAmount.toFixed(2)}`,
        lastMessageTime: serverTimestamp()
      };
      chatUpdate[`unreadCount.${parentId}`] = increment(1);
      await updateDoc(chatRef, chatUpdate);

      parentCount++;
    }
  } catch (parentErr) {
    console.warn('[Payment DM] In-app direct message skipped:', parentErr);
  }

  return { success: true, parentCount };
}

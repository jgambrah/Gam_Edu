
import type { Student } from '@/lib/types';
import { doc, collection, runTransaction, serverTimestamp, query, where, getDocs, addDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
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

import { sendSchoolSMSAction } from '@/app/actions/sms';

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
 * Sends a direct message notification to the linked parent(s) of a student when a payment is recorded.
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

  try {
    // 1. Fetch school name
    const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
    const schoolName = schoolDoc.data()?.name || 'our school';

    let parentCount = 0;
    const candidatePhones: Array<{ name: string; phone: string }> = [];

    // 2. Query parents linked to the student in the parents collection (for in-app Direct Messaging)
    try {
      const parentsQuery = query(
        collection(firestore, 'parents'),
        where('schoolId', '==', schoolId),
        where('studentIds', 'array-contains', studentId)
      );
      const parentsSnap = await getDocs(parentsQuery);

      if (!parentsSnap.empty) {
        for (const parentDoc of parentsSnap.docs) {
          const parentData = parentDoc.data();
          const parentId = parentDoc.id;
          const parentName = `${parentData.firstName || ''} ${parentData.lastName || ''}`.trim() || 'Parent';

          const rawPhone = parentData.phone || parentData.phoneNumber || parentData.telephone || parentData.contactNumber;
          if (rawPhone) {
            candidatePhones.push({ name: parentName, phone: String(rawPhone).trim() });
          }

          // 3. Find if there's an existing 1-on-1 chat
          const chatsQuery = query(
            collection(firestore, 'direct_messages'),
            where('schoolId', '==', schoolId),
            where('participants', 'array-contains', parentId)
          );
          const chatsSnap = await getDocs(chatsQuery);
          
          let chatId = '';
          const existingChat = chatsSnap.docs.find(d => {
            const data = d.data();
            return !data.isGroup && data.participants.includes(senderUid);
          });

          if (existingChat) {
            chatId = existingChat.id;
          } else {
            // Create new direct chat
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

          // 4. Construct direct message content
          const msgText = `Dear ${parentName},\n\n` +
            `This is to acknowledge the receipt of your payment of GH₵${paymentAmount.toFixed(2)} ` +
            `towards ${feeType} for your ward, ${studentName}.\n\n` +
            `Receipt Reference: ${receiptId}\n` +
            `Payment Method: ${paymentMethod}\n\n` +
            `Thank you for your payment. Please contact the accountant, administrator, or the director in case of any discrepancy.\n\n` +
            `Best regards,\n` +
            `${senderName} (${senderRole})\n` +
            `${schoolName}`;

          // 5. Send in-app message
          await addDoc(collection(firestore, `direct_messages/${chatId}/messages`), {
            text: msgText,
            senderId: senderUid,
            createdAt: serverTimestamp(),
            type: 'text',
            status: 'sent'
          });

          // 6. Update direct_messages metadata
          const chatRef = doc(firestore, 'direct_messages', chatId);
          const chatUpdate: any = {
            lastMessage: `Payment acknowledged: GH₵${paymentAmount.toFixed(2)}`,
            lastMessageTime: serverTimestamp()
          };
          
          chatUpdate[`unreadCount.${parentId}`] = increment(1);
          await updateDoc(chatRef, chatUpdate);

          parentCount++;
        }
      }
    } catch (parentErr) {
      console.warn('Could not query parents collection for in-app DM:', parentErr);
    }

    // 3. Fallback/Supplement: Always check student document for registered parent/guardian phone numbers
    if (studentId) {
      try {
        let studentData: any = null;
        const studentDirectSnap = await getDoc(doc(firestore, 'students', studentId));
        if (studentDirectSnap.exists()) {
          studentData = studentDirectSnap.data();
        } else {
          // In case studentId passed is admission number / code
          const q1 = query(
            collection(firestore, 'students'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId)
          );
          const snap1 = await getDocs(q1);
          if (!snap1.empty) {
            studentData = snap1.docs[0].data();
          } else {
            const q2 = query(
              collection(firestore, 'students'),
              where('schoolId', '==', schoolId),
              where('uid', '==', studentId)
            );
            const snap2 = await getDocs(q2);
            if (!snap2.empty) {
              studentData = snap2.docs[0].data();
            }
          }
        }

        if (studentData) {
          const possiblePhones = [
            studentData.parentPhone,
            studentData.guardianPhone,
            studentData.emergencyPhone,
            studentData.phone,
            studentData.parent1?.phone,
            studentData.parent2?.phone,
            studentData.emergencyContact?.phone,
            studentData.contactNumber,
            studentData.telephone,
            studentData.fatherPhone,
            studentData.motherPhone,
            studentData.smsPhone
          ];

          for (const rawP of possiblePhones) {
            if (rawP && typeof rawP === 'string' && rawP.trim().length > 0) {
              const cleanP = rawP.trim();
              if (!candidatePhones.some(c => c.phone.replace(/\s+/g, '') === cleanP.replace(/\s+/g, ''))) {
                candidatePhones.push({
                  name: studentData.parentName || studentData.guardianName || studentData.parent1?.name || 'Parent',
                  phone: cleanP
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch student parent phone for SMS receipt:', err);
      }
    }

    // 4. Dispatch SMS receipt to connected school SMS API (Arkesel / Hubtel)
    let token = config.idToken;
    if (!token && typeof window !== 'undefined') {
      try {
        const { getAuth } = await import('firebase/auth');
        token = await getAuth().currentUser?.getIdToken();
      } catch {
        // Safe fallback
      }
    }

    if (token && candidatePhones.length > 0) {
      const balanceSnippet = config.remainingBalance !== undefined && config.remainingBalance > 0
        ? ` Bal: GH₵${config.remainingBalance.toFixed(2)}.`
        : (config.remainingBalance === 0 ? ` Paid in full.` : '');

      for (const { name, phone } of candidatePhones) {
        const smsContent = `Receipt Ref: ${receiptId}. Payment of GH₵${paymentAmount.toFixed(2)} received for ${studentName} (${feeType}). Method: ${paymentMethod}.${balanceSnippet} Thank you! - ${schoolName}`;

        sendSchoolSMSAction(schoolId, phone, smsContent, token).then(res => {
          if (res?.success) {
            console.log(`[SMS Payment Receipt] Sent to ${phone} for ${studentName}`);
          } else {
            console.warn(`[SMS Payment Receipt] Skipped/Status: ${res?.error}`);
          }
        }).catch(err => {
          console.error(`[SMS Payment Receipt] Dispatch error:`, err);
        });
      }
    } else {
      if (candidatePhones.length === 0) {
        console.warn(`[SMS Payment Receipt] No phone number found for student ${studentId} (${studentName}).`);
      }
      if (!token) {
        console.warn(`[SMS Payment Receipt] Authentication token not available to dispatch SMS.`);
      }
    }

    return { success: true, parentCount: Math.max(parentCount, candidatePhones.length) };
  } catch (error: any) {
    console.error('Error sending payment notification:', error);
    return { success: false, parentCount: 0, error: error.message };
  }
}


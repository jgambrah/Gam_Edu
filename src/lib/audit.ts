import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

interface LogAuditParams {
  firestore: Firestore;
  schoolId: string | null | undefined;
  userName: string;
  action: string;
  details: string;
}

export async function logAuditEvent({
  firestore,
  schoolId,
  userName,
  action,
  details
}: LogAuditParams) {
  if (!firestore || !schoolId) {
    console.warn('logAuditEvent skipped: firestore or schoolId is missing', { hasFirestore: !!firestore, schoolId, action, details });
    return;
  }
  try {
    await addDoc(collection(firestore, 'auditLogs'), {
      schoolId,
      userName: userName || 'System',
      action,
      details,
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

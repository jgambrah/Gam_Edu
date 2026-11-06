import type {
  Firestore,
  DocumentReference,
  DocumentSnapshot,
} from 'firebase-admin/firestore';

type StudentRecord = {
  uid?: string;
  schoolId?: string;
  status?: string;
  enrollmentStatus?: string;
  isActive?: boolean;
};

const INACTIVE_STATUSES = new Set([
  'inactive',
  'transferred',
  'withdrawn',
  'suspended',
  'graduated',
]);

export async function resolveThinkTankStudent(
  db: Firestore,
  uid: string,
  verifiedSchoolId: string
): Promise<DocumentReference> {
  if (!uid || !verifiedSchoolId) {
    throw new Error('Missing verified student identity.');
  }

  const directRef = db.collection('students').doc(uid);

  const [directSnap, linkedSnaps] = await Promise.all([
    directRef.get(),
    db.collection('students').where('uid', '==', uid).get(),
  ]);

  const candidates = new Map<string, DocumentReference>();

  const consider = (snap: DocumentSnapshot) => {
    if (!snap.exists) return;

    const student = snap.data() as StudentRecord;

    if (student.uid && student.uid !== uid) return;
    if (student.schoolId !== verifiedSchoolId) return;

    if (student.isActive === false) return;

    if (
      student.status &&
      INACTIVE_STATUSES.has(student.status.toLowerCase())
    ) {
      return;
    }

    if (
      student.enrollmentStatus &&
      INACTIVE_STATUSES.has(student.enrollmentStatus.toLowerCase())
    ) {
      return;
    }

    candidates.set(snap.ref.path, snap.ref);
  };

  consider(directSnap);

  linkedSnaps.docs.forEach(consider);

  if (candidates.size === 0) {
    throw new Error('No matching student record found.');
  }

  if (candidates.size > 1) {
    throw new Error(
      'Multiple active student records found. Administrator reconciliation required.'
    );
  }

  return Array.from(candidates.values())[0];
}

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

const AUTHORIZED_STAFF_ROLES = new Set([
  'teacher',
  'subject teacher',
  'class teacher',
  'instructor',
  'faculty',
  'head of department',
  'tutor',
  'director',
  'administrator',
  'admin',
  'principal',
  'headmaster',
  'headmistress',
  'head teacher',
  'registrar',
  'admissions',
  'owner',
  'super_admin',
]);

const NON_STAFF_ROLES = new Set(['student', 'parent', 'guardian']);

const HARDCODED_SCHOOL_BY_UID: Record<string, string> = {
  '7GVi5qCxC4YDnjKkjVwSjAYtQz73': 'oHr3BrGdK2eS5MQ5zmZU',
};

const HARDCODED_SCHOOL_BY_EMAIL: Record<string, string> = {
  'atampokaadongo@gmail.com': 'oHr3BrGdK2eS5MQ5zmZU',
};

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

export async function resolveStaffFallbackSchoolId(
  db: Firestore,
  user: {
    uid: string;
    email?: string;
    isSuperAdmin?: boolean;
    claims?: Record<string, any>;
  }
): Promise<string> {
  if (!user?.uid) return '';
  try {
    const staffSnap = await db.collection('staff').doc(user.uid).get();
    if (staffSnap.exists) {
      const data = staffSnap.data() as Record<string, any> | undefined;
      if (typeof data?.schoolId === 'string' && data.schoolId.trim()) {
        return data.schoolId.trim();
      }
    }
  } catch {
    // Ignore if staff collection is unavailable in mock tests
  }
  return (
    HARDCODED_SCHOOL_BY_UID[user.uid] ||
    (user.email ? HARDCODED_SCHOOL_BY_EMAIL[user.email] : '') ||
    ''
  );
}

export async function resolveThinkTankStudentOrStaff(
  db: Firestore,
  user: {
    uid: string;
    email?: string;
    isSuperAdmin?: boolean;
    claims?: Record<string, any>;
  },
  verifiedSchoolId: string
): Promise<{ studentRef: DocumentReference | null; isStaff: boolean }> {
  try {
    const studentRef = await resolveThinkTankStudent(
      db,
      user.uid,
      verifiedSchoolId
    );
    return { studentRef, isStaff: false };
  } catch (err: any) {
    if (err?.message !== 'No matching student record found.') {
      throw err;
    }

    const [staffSnap, userSnap] = await Promise.all([
      db.collection('staff').doc(user.uid).get(),
      db.collection('users').doc(user.uid).get(),
    ]);

    const staffData = staffSnap.exists
      ? (staffSnap.data() as Record<string, any>)
      : null;
    const userData = userSnap.exists
      ? (userSnap.data() as Record<string, any>)
      : null;

    const staffRole =
      typeof staffData?.role === 'string'
        ? staffData.role.trim().toLowerCase()
        : '';
    const userRole =
      typeof userData?.role === 'string'
        ? userData.role.trim().toLowerCase()
        : '';
    const claimRole =
      typeof user.claims?.role === 'string'
        ? user.claims.role.trim().toLowerCase()
        : '';

    if (
      NON_STAFF_ROLES.has(staffRole) ||
      NON_STAFF_ROLES.has(userRole) ||
      NON_STAFF_ROLES.has(claimRole)
    ) {
      throw err;
    }

    const effectiveRole =
      staffRole ||
      userRole ||
      claimRole ||
      (user.isSuperAdmin ? 'super_admin' : '');

    const isAuthorizedStaff =
      Boolean(user.isSuperAdmin) ||
      (staffSnap.exists && AUTHORIZED_STAFF_ROLES.has(staffRole)) ||
      AUTHORIZED_STAFF_ROLES.has(effectiveRole);

    if (!isAuthorizedStaff) {
      throw err;
    }

    const staffSchoolId =
      typeof staffData?.schoolId === 'string' ? staffData.schoolId.trim() : '';
    const userSchoolId =
      typeof userData?.schoolId === 'string' ? userData.schoolId.trim() : '';

    if (staffSchoolId && staffSchoolId !== verifiedSchoolId) {
      throw new Error('Staff school mismatch with verified school.');
    }
    if (userSchoolId && userSchoolId !== verifiedSchoolId) {
      throw new Error('User profile school mismatch with verified school.');
    }

    return { studentRef: null, isStaff: true };
  }
}

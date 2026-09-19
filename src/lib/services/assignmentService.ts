import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  onSnapshot,
  writeBatch,
  runTransaction,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import {
  SchoolAssignment,
  StudentAssignmentSubmission,
  AssignmentExamOption
} from '@/types/assignmentTypes';

/**
 * Curated list of standard exam options for past paper assignment dispatch
 */
export const PAST_PAPER_EXAM_OPTIONS: AssignmentExamOption[] = [
  {
    id: 'paper_2025_variant',
    title: '2025 BECE Mathematics Paper 2 (Set 65 Theory)',
    year: 2025,
    setNumber: 65,
    paperType: 2,
    subject: 'Mathematics',
    badge: 'Modern Era'
  },
  {
    id: 'paper_2024_variant',
    title: '2024 BECE Mathematics Paper 2 (Set 60 Theory)',
    year: 2024,
    setNumber: 60,
    paperType: 2,
    subject: 'Mathematics',
    badge: 'Modern Era'
  },
  {
    id: 'paper_2023_variant',
    title: '2023 BECE Mathematics Paper 2 (Set 62 Theory)',
    year: 2023,
    setNumber: 62,
    paperType: 2,
    subject: 'Mathematics',
    badge: 'Modern Era'
  },
  {
    id: 'paper_2022_variant',
    title: '2022 BECE Mathematics Paper 2 (Set 64 Theory)',
    year: 2022,
    setNumber: 64,
    paperType: 2,
    subject: 'Mathematics',
    badge: 'Modern Era'
  },
  {
    id: 'paper_2021_variant',
    title: '2021 BECE Mathematics Paper 2 (Set 63 Theory)',
    year: 2021,
    setNumber: 63,
    paperType: 2,
    subject: 'Mathematics',
    badge: 'Legacy Standard'
  },
  {
    id: 'paper_2020_variant',
    title: '2020 BECE Mathematics Paper 2 (Set 61 Theory)',
    year: 2020,
    setNumber: 61,
    paperType: 2,
    subject: 'Mathematics',
    badge: 'Legacy Standard'
  },
  {
    id: 'paper_2019_variant',
    title: '2019 BECE Mathematics Paper 2 (Set 67 Theory)',
    year: 2019,
    setNumber: 67,
    paperType: 2,
    subject: 'Mathematics',
    badge: 'Classic Series'
  },
  // Paper 1 Objective CBT variants
  {
    id: 'paper_2025_p1_variant',
    title: '2025 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2025,
    setNumber: 65,
    paperType: 1,
    subject: 'Mathematics',
    badge: 'Modern CBT'
  },
  {
    id: 'paper_2024_p1_variant',
    title: '2024 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2024,
    setNumber: 60,
    paperType: 1,
    subject: 'Mathematics',
    badge: 'Modern CBT'
  },
  {
    id: 'paper_2023_p1_variant',
    title: '2023 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2023,
    setNumber: 62,
    paperType: 1,
    subject: 'Mathematics',
    badge: 'Modern CBT'
  },
  {
    id: 'paper_2022_p1_variant',
    title: '2022 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2022,
    setNumber: 64,
    paperType: 1,
    subject: 'Mathematics',
    badge: 'Modern CBT'
  },
  {
    id: 'paper_2021_p1_variant',
    title: '2021 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2021,
    setNumber: 63,
    paperType: 1,
    subject: 'Mathematics',
    badge: 'Legacy CBT'
  },
  {
    id: 'paper_2020_p1_variant',
    title: '2020 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2020,
    setNumber: 61,
    paperType: 1,
    subject: 'Mathematics',
    badge: 'Legacy CBT'
  },
  {
    id: 'paper_2019_p1_variant',
    title: '2019 BECE Mathematics Paper 1 (Set 66 Objective CBT)',
    year: 2019,
    setNumber: 66,
    paperType: 1,
    subject: 'Mathematics',
    badge: 'Classic CBT'
  }
];

/**
 * Dispatch an exam assignment to a target class and seed student submissions
 */
export async function dispatchAssignment(
  firestore: Firestore,
  params: {
    schoolId: string;
    title: string;
    examId: string;
    paperType: 1 | 2;
    targetClass: string;
    dueDate: Date;
    isTimed?: boolean;
    timeLimitMinutes?: number;
    maxAttempts?: number;
    assignedByUid: string;
    assignedByName: string;
    instructions?: string;
  }
): Promise<{ assignmentId: string; totalAssigned: number }> {
  const {
    schoolId,
    title,
    examId,
    paperType,
    targetClass,
    dueDate,
    isTimed = false,
    timeLimitMinutes = 60,
    maxAttempts = 1,
    assignedByUid,
    assignedByName,
    instructions = ''
  } = params;

  // 1. Fetch targeted students in the class
  let targetStudents: Array<{ uid: string; name: string; class: string }> = [];

  try {
    // Attempt 1: Query top-level students collection
    const studentsColRef = collection(firestore, 'students');
    const q1 = query(studentsColRef, where('schoolId', '==', schoolId));
    const snap1 = await getDocs(q1);

    snap1.docs.forEach(docSnap => {
      const data = docSnap.data();
      const sClass = String(data.class || data.className || data.gradeLevel || '').trim();
      const isMatch =
        targetClass === 'ALL_JHS' ||
        targetClass === 'All Classes' ||
        sClass.toLowerCase() === targetClass.toLowerCase() ||
        sClass.toLowerCase().includes(targetClass.toLowerCase()) ||
        String(data.classId || '') === targetClass;

      if (isMatch && (docSnap.id || data.uid)) {
        const studentUid = String(data.uid || docSnap.id);
        const name = String(data.name || (data.firstName ? (data.firstName + ' ' + (data.lastName || '')).trim() : '') || 'Student');
        targetStudents.push({ uid: studentUid, name, class: sClass || targetClass });
      }
    });

    // Attempt 2: If none found, also check schools/{schoolId}/students subcollection
    if (targetStudents.length === 0) {
      const subColRef = collection(firestore, 'schools', schoolId, 'students');
      const snap2 = await getDocs(subColRef);
      snap2.docs.forEach(docSnap => {
        const data = docSnap.data();
        const sClass = String(data.class || data.className || '').trim();
        const isMatch =
          targetClass === 'ALL_JHS' ||
          targetClass === 'All Classes' ||
          sClass.toLowerCase() === targetClass.toLowerCase() ||
          sClass.toLowerCase().includes(targetClass.toLowerCase());

        if (isMatch) {
          const studentUid = String(data.uid || docSnap.id);
          const name = String(data.name || (data.firstName ? (data.firstName + ' ' + (data.lastName || '')).trim() : '') || 'Student');
          targetStudents.push({ uid: studentUid, name, class: sClass || targetClass });
        }
      });
    }
  } catch (e) {
    console.warn('[assignmentService] Student query warning:', e);
  }

  // Deduplicate students by uid
  const uniqueMap = new Map<string, { uid: string; name: string; class: string }>();
  targetStudents.forEach(s => uniqueMap.set(s.uid, s));
  targetStudents = Array.from(uniqueMap.values());

  // Fallback demo students if no students currently seeded in this school
  if (targetStudents.length === 0) {
    targetStudents = [
      { uid: 'demo_std_1', name: 'Kwame Mensah', class: targetClass },
      { uid: 'demo_std_2', name: 'Abena Osei', class: targetClass },
      { uid: 'demo_std_3', name: 'Kofi Boateng', class: targetClass },
      { uid: 'demo_std_4', name: 'Akosua Frimpong', class: targetClass },
      { uid: 'demo_std_5', name: 'Yaw Addo', class: targetClass }
    ];
  }

  // 2. Generate assignment document ID
  const assignmentsCol = collection(firestore, 'schools', schoolId, 'assignments');
  const assignmentDocRef = doc(assignmentsCol);
  const assignmentId = assignmentDocRef.id;

  const assignmentDoc: SchoolAssignment = {
    id: assignmentId,
    schoolId,
    title,
    examId,
    paperType,
    targetClass,
    dueDate: Timestamp.fromDate(dueDate),
    isTimed,
    timeLimitMinutes,
    maxAttempts,
    assignedByUid,
    assignedByName,
    totalAssigned: targetStudents.length,
    completedCount: 0,
    createdAt: serverTimestamp(),
    instructions,
    subject: 'Mathematics'
  };

  // 3. Batch write assignment and initial 'not_started' submissions
  const batch = writeBatch(firestore);
  batch.set(assignmentDocRef, assignmentDoc);

  targetStudents.forEach(student => {
    const subDocRef = doc(firestore, 'schools', schoolId, 'assignments', assignmentId, 'submissions', student.uid);
    const initialSub: StudentAssignmentSubmission = {
      studentUid: student.uid,
      studentName: student.name,
      studentClass: student.class || targetClass,
      status: 'not_started',
      startedAt: null,
      submittedAt: null,
      score: null,
      maxScore: null,
      percentage: null,
      answers: null
    };
    batch.set(subDocRef, initialSub);
  });

  await batch.commit();

  return { assignmentId, totalAssigned: targetStudents.length };
}

/**
 * Mark an assignment as in_progress when a student begins
 */
export async function startStudentAssignment(
  firestore: Firestore,
  schoolId: string,
  assignmentId: string,
  studentUid: string,
  studentName?: string,
  studentClass?: string
): Promise<void> {
  const subDocRef = doc(firestore, 'schools', schoolId, 'assignments', assignmentId, 'submissions', studentUid);

  try {
    const snap = await getDoc(subDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.status === 'not_started') {
        await updateDoc(subDocRef, {
          status: 'in_progress',
          startedAt: serverTimestamp()
        });
      }
    } else {
      // Create if it didn't exist
      await setDoc(subDocRef, {
        studentUid,
        studentName: studentName || 'Student',
        studentClass: studentClass || 'JHS',
        status: 'in_progress',
        startedAt: serverTimestamp(),
        submittedAt: null,
        score: null,
        maxScore: null,
        percentage: null
      });
    }
  } catch (err) {
    console.warn('[assignmentService] Error setting in_progress:', err);
  }
}

/**
 * Mark an assignment as completed and record scores/AI breakdown
 */
export async function completeStudentAssignment(
  firestore: Firestore,
  params: {
    schoolId: string;
    assignmentId: string;
    studentUid: string;
    studentName?: string;
    studentClass?: string;
    score: number;
    maxScore: number;
    answers?: any;
    aiGradedResults?: any[];
  }
): Promise<void> {
  const {
    schoolId,
    assignmentId,
    studentUid,
    studentName,
    studentClass,
    score,
    maxScore,
    answers,
    aiGradedResults
  } = params;

  const assignmentRef = doc(firestore, 'schools', schoolId, 'assignments', assignmentId);
  const subRef = doc(firestore, 'schools', schoolId, 'assignments', assignmentId, 'submissions', studentUid);

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  try {
    await runTransaction(firestore, async transaction => {
      const subSnap = await transaction.get(subRef);
      const isAlreadyCompleted = subSnap.exists() && subSnap.data()?.status === 'completed';

      transaction.set(
        subRef,
        {
          studentUid,
          studentName: studentName || subSnap.data()?.studentName || 'Student',
          studentClass: studentClass || subSnap.data()?.studentClass || 'JHS',
          status: 'completed',
          submittedAt: serverTimestamp(),
          score,
          maxScore,
          percentage,
          answers: answers || null,
          ...(aiGradedResults ? { aiGradedResults } : {})
        },
        { merge: true }
      );

      // Only increment parent completedCount if this student hadn't already completed
      if (!isAlreadyCompleted) {
        transaction.update(assignmentRef, {
          completedCount: increment(1)
        });
      }
    });
  } catch (err) {
    console.error('[assignmentService] Transaction failed, falling back to direct write:', err);
    // Direct write fallback
    await setDoc(
      subRef,
      {
        studentUid,
        status: 'completed',
        submittedAt: serverTimestamp(),
        score,
        maxScore,
        percentage,
        answers: answers || null,
        ...(aiGradedResults ? { aiGradedResults } : {})
      },
      { merge: true }
    );
    await updateDoc(assignmentRef, {
      completedCount: increment(1)
    }).catch(() => {});
  }
}

/**
 * Record a nudge reminder timestamp for a student
 */
export async function nudgeStudent(
  firestore: Firestore,
  schoolId: string,
  assignmentId: string,
  studentUid: string
): Promise<void> {
  const subRef = doc(firestore, 'schools', schoolId, 'assignments', assignmentId, 'submissions', studentUid);
  await updateDoc(subRef, {
    nudgedAt: serverTimestamp()
  });
}

/**
 * Real-time subscription to an assignment's student submissions
 */
export function subscribeToAssignmentSubmissions(
  firestore: Firestore,
  schoolId: string,
  assignmentId: string,
  callback: (submissions: StudentAssignmentSubmission[]) => void
) {
  const subsCol = collection(firestore, 'schools', schoolId, 'assignments', assignmentId, 'submissions');
  const q = query(subsCol, orderBy('studentName', 'asc'));

  return onSnapshot(
    q,
    snapshot => {
      const items: StudentAssignmentSubmission[] = [];
      snapshot.forEach(docSnap => {
        items.push({
          id: docSnap.id,
          ...(docSnap.data() as any)
        });
      });
      callback(items);
    },
    error => {
      console.warn('[assignmentService] onSnapshot submissions error:', error);
      // Fallback: fetch without orderBy if composite index missing
      getDocs(subsCol)
        .then(snap => {
          const items: StudentAssignmentSubmission[] = [];
          snap.forEach(d => items.push({ id: d.id, ...(d.data() as any) }));
          callback(items);
        })
        .catch(() => {});
    }
  );
}

/**
 * Real-time subscription to all dispatched assignments for a school
 */
export function subscribeToSchoolAssignments(
  firestore: Firestore,
  schoolId: string,
  callback: (assignments: SchoolAssignment[]) => void
) {
  const assignmentsCol = collection(firestore, 'schools', schoolId, 'assignments');
  const q = query(assignmentsCol, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    snapshot => {
      const items: SchoolAssignment[] = [];
      snapshot.forEach(docSnap => {
        items.push({
          id: docSnap.id,
          ...(docSnap.data() as any)
        });
      });
      callback(items);
    },
    error => {
      console.warn('[assignmentService] onSnapshot assignments error:', error);
      getDocs(assignmentsCol)
        .then(snap => {
          const items: SchoolAssignment[] = [];
          snap.forEach(d => items.push({ id: d.id, ...(d.data() as any) }));
          callback(items);
        })
        .catch(() => {});
    }
  );
}

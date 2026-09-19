import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
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
  // Integrated Science Variants
  {
    id: 'paper_2026_variant',
    title: '2026 BECE Integrated Science Paper 1 (Set 72 Objective)',
    year: 2026,
    setNumber: 72,
    paperType: 1,
    subject: 'Integrated Science',
    badge: 'Modern CBT'
  },
  {
    id: 'paper_2026_variant_p2',
    title: '2026 BECE Integrated Science Paper 2 (Set 73 Practical & Essay)',
    year: 2026,
    setNumber: 73,
    paperType: 2,
    subject: 'Integrated Science',
    badge: 'Modern Essay'
  },
  {
    id: 'paper_2014_variant',
    title: '2014 BECE Integrated Science Paper 1 (Set 74 Objective)',
    year: 2014,
    setNumber: 74,
    paperType: 1,
    subject: 'Integrated Science',
    badge: 'Legacy CBT'
  },
  {
    id: 'paper_nacca_sample_variant_p1',
    title: 'NaCCA Integrated Science CCP Preparatory CBT Exam (Set 70)',
    year: 2024,
    setNumber: 70,
    paperType: 1,
    subject: 'Integrated Science',
    badge: 'NaCCA CBT Set 70'
  },
  {
    id: 'paper_nacca_sample_variant_p2',
    title: 'NaCCA Integrated Science CCP Practical & Theory Exam (Set 71)',
    year: 2024,
    setNumber: 71,
    paperType: 2,
    subject: 'Integrated Science',
    badge: 'NaCCA Theory Set 71'
  },
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
 * Helper: Resolve live students from Firestore for a school and target class/cohort.
 * Strictly queries real database records and never returns mock/demo data.
 */
export async function queryLiveClassStudents(
  firestore: Firestore,
  schoolId: string,
  targetClass: string,
  targetClassId?: string
): Promise<{
  students: Array<{ uid: string; name: string; class: string; classId?: string }>;
  resolvedClassName: string;
}> {
  // 1. Fetch classes for the school to establish relational class mappings
  const classMap = new Map<string, { id: string; name: string; gradeLevel?: string }>();
  try {
    const classesColRef = collection(firestore, 'classes');
    const classesSnap = await getDocs(query(classesColRef, where('schoolId', '==', schoolId)));
    classesSnap.docs.forEach(docSnap => {
      const d = docSnap.data();
      classMap.set(docSnap.id, {
        id: docSnap.id,
        name: String(d.name || ''),
        gradeLevel: d.gradeLevel ? String(d.gradeLevel) : undefined
      });
    });
  } catch (err) {
    console.warn('[assignmentService] Could not fetch classes collection:', err);
  }

  const isAllJhs =
    targetClass === 'ALL_JHS' ||
    targetClass === 'All Classes' ||
    targetClass === 'ALL' ||
    targetClassId === 'ALL_JHS';

  const targetClassLower = targetClass.toLowerCase().trim();
  const matchingClassIds = new Set<string>();
  let resolvedClassName = targetClass;

  if (targetClassId && targetClassId !== 'ALL_JHS' && classMap.has(targetClassId)) {
    matchingClassIds.add(targetClassId);
    resolvedClassName = classMap.get(targetClassId)!.name || targetClass;
  } else {
    for (const [cId, cData] of classMap.entries()) {
      const nameLower = cData.name.toLowerCase().trim();
      const gradeLower = (cData.gradeLevel || '').toLowerCase().trim();

      if (isAllJhs) {
        if (
          nameLower.includes('jhs') ||
          nameLower.includes('bs 7') ||
          nameLower.includes('bs 8') ||
          nameLower.includes('bs 9') ||
          gradeLower.includes('jhs') ||
          gradeLower.includes('bs 7') ||
          gradeLower.includes('bs 8') ||
          gradeLower.includes('bs 9')
        ) {
          matchingClassIds.add(cId);
        }
      } else {
        if (cId === targetClass) {
          matchingClassIds.add(cId);
          resolvedClassName = cData.name;
        } else if (
          nameLower === targetClassLower ||
          nameLower.includes(targetClassLower) ||
          targetClassLower.includes(nameLower) ||
          gradeLower === targetClassLower ||
          (gradeLower && targetClassLower.includes(gradeLower))
        ) {
          matchingClassIds.add(cId);
          resolvedClassName = cData.name;
        }
      }
    }

    // If All JHS requested but no classes specifically named JHS, include all school classes
    if (isAllJhs && matchingClassIds.size === 0) {
      for (const cId of classMap.keys()) {
        matchingClassIds.add(cId);
      }
      resolvedClassName = 'All Classes';
    }
  }

  // 2. Fetch live students matching schoolId
  const liveStudents: Array<{ uid: string; name: string; class: string; classId?: string }> = [];
  const seenUids = new Set<string>();

  const processStudentDoc = (docSnap: any) => {
    const data = docSnap.data();

    // Respect active enrollment status
    const rawStatus = String(data.enrollmentStatus || data.status || 'Active').toLowerCase();
    if (rawStatus === 'inactive' || rawStatus === 'graduated' || rawStatus === 'suspended' || rawStatus === 'withdrawn') {
      return;
    }

    const sClassId = String(data.classId || '').trim();
    const sClassName = String(data.className || data.class || data.gradeLevel || '').trim().toLowerCase();

    let isMatch = false;

    if (isAllJhs) {
      isMatch =
        (sClassId && matchingClassIds.has(sClassId)) ||
        sClassName.includes('jhs') ||
        sClassName.includes('bs 7') ||
        sClassName.includes('bs 8') ||
        sClassName.includes('bs 9') ||
        matchingClassIds.size === 0; // If no specific classes, include all active students
    } else {
      if (sClassId && matchingClassIds.has(sClassId)) {
        isMatch = true;
      } else if (sClassId && (sClassId === targetClass || (targetClassId && sClassId === targetClassId))) {
        isMatch = true;
      } else if (sClassName) {
        if (
          sClassName === targetClassLower ||
          sClassName.includes(targetClassLower) ||
          targetClassLower.includes(sClassName)
        ) {
          isMatch = true;
        }
      }
    }

    if (isMatch) {
      const studentUid = String(data.uid || docSnap.id).trim();
      if (!studentUid || seenUids.has(studentUid)) return;
      seenUids.add(studentUid);

      // Resolve real human name
      const firstName = data.firstName ? String(data.firstName).trim() : '';
      const lastName = data.lastName ? String(data.lastName).trim() : '';
      const constructedName = firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName);
      const studentName = String(data.name || constructedName || data.fullName || 'Student').trim();

      const studentClassLabel =
        (sClassId && classMap.get(sClassId)?.name) ||
        data.className ||
        data.class ||
        resolvedClassName;

      liveStudents.push({
        uid: studentUid,
        name: studentName,
        class: studentClassLabel,
        classId: sClassId || undefined
      });
    }
  };

  try {
    // Primary query: top-level students collection
    const studentsColRef = collection(firestore, 'students');
    const q1 = query(studentsColRef, where('schoolId', '==', schoolId));
    const snap1 = await getDocs(q1);
    snap1.docs.forEach(processStudentDoc);

    // Secondary query: if top-level returned 0, check schools/{schoolId}/students subcollection
    if (liveStudents.length === 0) {
      const subColRef = collection(firestore, 'schools', schoolId, 'students');
      const snap2 = await getDocs(subColRef);
      snap2.docs.forEach(processStudentDoc);
    }
  } catch (err) {
    console.error('[assignmentService] Failed to query live students:', err);
    throw new Error('Failed to query live students from database. Please check your network connection.');
  }

  // Sort alphabetically by student name
  liveStudents.sort((a, b) => a.name.localeCompare(b.name));

  return {
    students: liveStudents,
    resolvedClassName
  };
}

/**
 * Dispatch an exam assignment to a target class and seed student submissions
 * ONLY uses live enrolled students from Firestore. Throws an error if 0 live students found.
 */
export async function dispatchAssignment(
  firestore: Firestore,
  params: {
    schoolId: string;
    title: string;
    examId: string;
    paperType: 1 | 2;
    targetClass: string;
    targetClassId?: string;
    dueDate: Date;
    isTimed?: boolean;
    timeLimitMinutes?: number;
    maxAttempts?: number;
    assignedByUid: string;
    assignedByName: string;
    instructions?: string;
  }
): Promise<{ assignmentId: string; totalAssigned: number; targetClassName: string }> {
  const {
    schoolId,
    title,
    examId,
    paperType,
    targetClass,
    targetClassId,
    dueDate,
    isTimed = false,
    timeLimitMinutes = 60,
    maxAttempts = 1,
    assignedByUid,
    assignedByName,
    instructions = ''
  } = params;

  // 1. Fetch live students for the specified class
  const { students: targetStudents, resolvedClassName } = await queryLiveClassStudents(
    firestore,
    schoolId,
    targetClass,
    targetClassId
  );

  // STRICT REQUIREMENT: ZERO hardcoded or mock student fallbacks!
  if (targetStudents.length === 0) {
    throw new Error(
      `No active students found enrolled in "${resolvedClassName || targetClass}". Please verify that students are registered and linked to this class in the Students directory before dispatching.`
    );
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
    targetClass: resolvedClassName || targetClass,
    targetClassId: targetClassId || undefined,
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

  // 3. Batch write assignment and initial 'not_started' submissions for live students
  // Firestore batches have a 500 operations limit; chunk if school class exceeds 450
  const CHUNK_SIZE = 400;
  for (let i = 0; i < targetStudents.length; i += CHUNK_SIZE) {
    const chunk = targetStudents.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(firestore);

    if (i === 0) {
      batch.set(assignmentDocRef, assignmentDoc);
    }

    chunk.forEach(student => {
      const subDocRef = doc(firestore, 'schools', schoolId, 'assignments', assignmentId, 'submissions', student.uid);
      const initialSub: StudentAssignmentSubmission = {
        studentUid: student.uid,
        studentName: student.name,
        studentClass: student.class || resolvedClassName || targetClass,
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
  }

  return {
    assignmentId,
    totalAssigned: targetStudents.length,
    targetClassName: resolvedClassName || targetClass
  };
}

/**
 * Resync an assignment's student roster with the current live students from the class.
 * Purges any legacy demo submissions (e.g. demo_std_...) and adds any missing real students.
 */
export async function resyncAssignmentRoster(
  firestore: Firestore,
  schoolId: string,
  assignmentId: string,
  targetClass: string,
  targetClassId?: string
): Promise<{ totalSynced: number; removedDemoCount: number; addedCount: number }> {
  // 1. Fetch current submissions
  const subsCol = collection(firestore, 'schools', schoolId, 'assignments', assignmentId, 'submissions');
  const currentSnap = await getDocs(subsCol);

  let removedDemoCount = 0;
  const existingUids = new Set<string>();

  // Delete any placeholder or demo student documents
  const deleteBatch = writeBatch(firestore);
  currentSnap.docs.forEach(d => {
    const data = d.data();
    const uid = String(data.studentUid || d.id);
    if (uid.startsWith('demo_') || uid.startsWith('demo_std_') || data.studentName === 'Kwame Mensah' || data.studentName === 'Abena Osei' || data.studentName === 'Kofi Boateng' || data.studentName === 'Akosua Frimpong' || data.studentName === 'Yaw Addo') {
      deleteBatch.delete(d.ref);
      removedDemoCount++;
    } else {
      existingUids.add(uid);
    }
  });

  if (removedDemoCount > 0) {
    await deleteBatch.commit();
  }

  // 2. Query live students
  const { students: liveStudents } = await queryLiveClassStudents(
    firestore,
    schoolId,
    targetClass,
    targetClassId
  );

  let addedCount = 0;
  const addBatch = writeBatch(firestore);

  liveStudents.forEach(student => {
    if (!existingUids.has(student.uid)) {
      const subDocRef = doc(subsCol, student.uid);
      const initialSub: StudentAssignmentSubmission = {
        studentUid: student.uid,
        studentName: student.name,
        studentClass: student.class,
        status: 'not_started',
        startedAt: null,
        submittedAt: null,
        score: null,
        maxScore: null,
        percentage: null,
        answers: null
      };
      addBatch.set(subDocRef, initialSub);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    await addBatch.commit();
  }

  // 3. Update totalAssigned on assignment document
  const assignmentDocRef = doc(firestore, 'schools', schoolId, 'assignments', assignmentId);
  const finalTotal = liveStudents.length;
  await updateDoc(assignmentDocRef, {
    totalAssigned: finalTotal
  }).catch(() => {});

  return {
    totalSynced: finalTotal,
    removedDemoCount,
    addedCount
  };
}

/**
 * Delete a school assignment and its submissions subcollection
 */
export async function deleteSchoolAssignment(
  firestore: Firestore,
  schoolId: string,
  assignmentId: string
): Promise<void> {
  const subsCol = collection(firestore, 'schools', schoolId, 'assignments', assignmentId, 'submissions');
  const subsSnap = await getDocs(subsCol);

  const batch = writeBatch(firestore);
  subsSnap.docs.forEach(docSnap => {
    batch.delete(docSnap.ref);
  });

  const assignmentDocRef = doc(firestore, 'schools', schoolId, 'assignments', assignmentId);
  batch.delete(assignmentDocRef);

  await batch.commit();
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

      if (!isAlreadyCompleted) {
        transaction.update(assignmentRef, {
          completedCount: increment(1)
        });
      }
    });
  } catch (err) {
    console.error('[assignmentService] Transaction failed, falling back to direct write:', err);
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

'use server';

import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { currentTermFromProfile } from '@/lib/term';

/**
 * Grades a quiz ON THE SERVER and records the attempt (and, for gradable quizzes, the gradebook mark).
 * Students can no longer write their own marks: the browser only sends the answers.
 * Grading rules are identical to the previous in-browser grading, so scores do not change.
 */
export async function submitQuizAttemptAction(
  idToken: string,
  quizId: string,
  answers: Record<string, string>
): Promise<{ ok: true; score: number; total: number } | { ok: false; error: string }> {
  try {
    if (!idToken || !quizId) return { ok: false, error: 'Missing quiz or sign-in.' };
    let uid: string;
    let displayName = '';
    try {
      const decoded = await getAdminAuth().verifyIdToken(idToken);
      uid = decoded.uid;
      displayName = decoded.name || '';
    } catch {
      return { ok: false, error: 'Your session has expired. Sign in again.' };
    }

    const db = getAdminDb();
    const quizSnap = await db.collection('quizzes').doc(quizId).get();
    if (!quizSnap.exists) return { ok: false, error: 'Quiz not found.' };
    const quiz: any = quizSnap.data();
    const schoolId: string = quiz.schoolId || '';

    // The student must belong to the quiz's school.
    const studentSnap = await db.collection('students').where('uid', '==', uid).limit(5).get();
    const studentDoc = studentSnap.docs.find(d => !schoolId || d.data().schoolId === schoolId) || null;
    const userSnap = await db.collection('users').doc(uid).get();
    const userSchool = userSnap.exists ? (userSnap.data() as any)?.schoolId : undefined;
    if (schoolId && !studentDoc && userSchool && userSchool !== schoolId) {
      return { ok: false, error: 'This quiz belongs to another school.' };
    }
    if (quiz.startDate && new Date(quiz.startDate).getTime() > Date.now() + 60_000) {
      return { ok: false, error: 'This quiz has not started yet.' };
    }

    // Same grading as before (moved from the browser).
    const questions: any[] = Array.isArray(quiz.questions) ? quiz.questions : [];
    let score = 0;
    questions.forEach((q, index) => {
      const raw = answers?.[String(index)] ?? '';
      const studentAns = String(raw).trim().toLowerCase();
      const correctAns = String(q.correctAnswer || '').trim().toLowerCase();
      const isCorrect = q.type === 'written'
        ? (studentAns === correctAns || (correctAns.includes(studentAns) && studentAns.length > 2))
        : (String(raw) === q.correctAnswer);
      if (isCorrect) score++;
    });
    const total = questions.length;

    const effectiveSchoolId = schoolId || (studentDoc?.data() as any)?.schoolId || userSchool || '';
    const batch = db.batch();
    batch.set(db.collection('quizAttempts').doc(), {
      quizId,
      studentId: uid,
      score,
      total,
      answers: answers || {},
      completedAt: FieldValue.serverTimestamp(),
      schoolId: effectiveSchoolId,
      gradedOnServer: true,
    });

    if (quiz.gradable && quiz.subjectId && effectiveSchoolId) {
      const [schoolProfileSnap, settingsSnap] = await Promise.all([
        db.collection('schools').doc(effectiveSchoolId).get(),
        db.collection('schoolSettings').doc(effectiveSchoolId).get(),
      ]);
      const stamp = currentTermFromProfile(schoolProfileSnap.data()) || currentTermFromProfile(settingsSnap.data());
      const s: any = studentDoc?.data() || {};
      const studentName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || displayName || 'Student';
      batch.set(db.collection('assessments').doc(), {
        studentId: uid,
        studentName,
        classId: quiz.classId || '',
        subjectId: quiz.subjectId,
        schoolId: effectiveSchoolId,
        teacherId: quiz.teacherId || '',
        term: stamp?.term || (settingsSnap.data() as any)?.term || 'First Term',
        academicYear: stamp?.academicYear || (settingsSnap.data() as any)?.academicYear || '',
        ...(stamp ? { termId: stamp.termId } : {}),
        assessmentType: quiz.assessmentType || 'Class Exercise (CA)',
        score: total > 0 ? Math.round((score / total) * 100) : 0,
        maxScore: 100,
        teacherRemark: `AI Quiz completed: ${score}/${total} questions correct.`,
        createdAt: FieldValue.serverTimestamp(),
        assessmentDate: FieldValue.serverTimestamp(),
        quizId,
        gradedOnServer: true,
      });
    }

    await batch.commit();
    return { ok: true, score, total };
  } catch (e: any) {
    console.error('submitQuizAttemptAction failed:', e?.message);
    return { ok: false, error: 'Could not save your attempt. Please try again.' };
  }
}

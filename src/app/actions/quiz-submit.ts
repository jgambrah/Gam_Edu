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
): Promise<
  | { ok: true; score: number; total: number; review: { correctAnswer: string; explanation: string }[]; firstAttempt: boolean }
  | { ok: false; error: string }
> {
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

    // Answers live in quizKeys/{quizId} (moved there by the quizAnswerVault function so students cannot
    // read them); older quizzes that have not been moved yet still carry them on the quiz itself.
    const keySnap = await db.collection('quizKeys').doc(quizId).get();
    const keys: any[] = keySnap.exists && Array.isArray((keySnap.data() as any)?.keys) ? (keySnap.data() as any).keys : [];
    const questions: any[] = (Array.isArray(quiz.questions) ? quiz.questions : []).map((q: any, i: number) => ({
      ...q,
      correctAnswer: q?.correctAnswer ?? keys[i]?.correctAnswer ?? '',
      explanation: q?.explanation ?? keys[i]?.explanation ?? '',
    }));

    // Only the first attempt counts towards the gradebook (answers are shown after submitting, so a
    // retake would otherwise always score 100%). Later attempts are still saved as practice.
    const previous = await db.collection('quizAttempts')
      .where('quizId', '==', quizId)
      .where('studentId', '==', uid)
      .limit(1)
      .get();
    const firstAttempt = previous.empty;

    // Same grading as before (moved from the browser).
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
      countsForGrade: firstAttempt,
    });

    if (firstAttempt && quiz.gradable && quiz.subjectId && effectiveSchoolId) {
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
    const review = questions.map(q => ({ correctAnswer: String(q.correctAnswer || ''), explanation: String(q.explanation || '') }));
    return { ok: true, score, total, review, firstAttempt };
  } catch (e: any) {
    console.error('submitQuizAttemptAction failed:', e?.message);
    return { ok: false, error: 'Could not save your attempt. Please try again.' };
  }
}

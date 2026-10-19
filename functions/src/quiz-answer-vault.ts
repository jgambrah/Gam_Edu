import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { splitQuizAnswers } from './quiz-answer-split';

if (!getApps().length) initializeApp();
const db = getFirestore();

/**
 * Keeps quiz answer keys away from students.
 *
 * Teachers keep creating quizzes exactly as before (questions with `correctAnswer` / `explanation`). As soon
 * as such a quiz is saved, this function moves the answers into `quizKeys/{quizId}` — readable only by that
 * school's teachers and admins (see firestore.rules) — and removes them from the quiz document that
 * students read. Grading happens on the server (submitQuizAttemptAction), which reads the key.
 *
 * Runs again on later edits: if a teacher saves answers again, the key is replaced; if a save carries no
 * answers (e.g. a title change), the existing key is left alone.
 */
export const quizAnswerVault = onDocumentWritten('quizzes/{quizId}', async event => {
  const after = event.data?.after?.data();
  if (!after) return; // deleted
  const split = splitQuizAnswers(after);
  if (!split) return; // nothing to hide (also stops this function re-triggering itself)
  const quizId = event.params.quizId;
  const batch = db.batch();
  batch.set(db.collection('quizKeys').doc(quizId), {
    quizId,
    schoolId: after.schoolId || '',
    teacherId: after.teacherId || '',
    classId: after.classId || '',
    keys: split.keys,
    updatedAt: FieldValue.serverTimestamp(),
  });
  batch.update(db.collection('quizzes').doc(quizId), {
    questions: split.stripped,
    answersHidden: true,
  });
  await batch.commit();
});

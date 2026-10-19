/**
 * ONE-TIME: move answers out of existing quizzes into quizKeys/{quizId} (students can no longer read them).
 * New quizzes are handled automatically by the quizAnswerVault Cloud Function.
 *
 * Run from the `functions` folder (after `npm run build`):
 *   node hide-quiz-answers.js            (REPORT ONLY — nothing is written)
 *   node hide-quiz-answers.js --apply    (moves the answers)
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const { splitQuizAnswers } = require('./lib/quiz-answer-split');

dotenv.config({ path: '../.env' });
const APPLY = process.argv.includes('--apply');
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in ../.env');
  process.exit(1);
}
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();

(async () => {
  const snap = await db.collection('quizzes').get();
  let withAnswers = 0;
  let ops = [];
  const flush = async () => {
    if (!ops.length) return;
    const batch = db.batch();
    ops.forEach(fn => fn(batch));
    await batch.commit();
    ops = [];
  };
  for (const d of snap.docs) {
    const q = d.data();
    const split = splitQuizAnswers(q);
    if (!split) continue;
    withAnswers++;
    if (!APPLY) continue;
    ops.push(b => b.set(db.collection('quizKeys').doc(d.id), {
      quizId: d.id, schoolId: q.schoolId || '', teacherId: q.teacherId || '', classId: q.classId || '',
      keys: split.keys, updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }));
    ops.push(b => b.update(d.ref, { questions: split.stripped, answersHidden: true }));
    if (ops.length >= 400) await flush();
  }
  await flush();
  console.log(`Quizzes: ${snap.size}. With visible answers: ${withAnswers}. ${APPLY ? 'Moved.' : 'REPORT ONLY (add --apply to move them).'}`);
})().catch(e => { console.error(e); process.exit(1); });

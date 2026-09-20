import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { createRequire } from 'module';

dotenv.config();

const require = createRequire(import.meta.url);
const adminInstance: any = (admin as any).default || admin;

async function getFirestore(): Promise<any> {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.split(String.fromCharCode(92) + 'n').join(String.fromCharCode(10)) : undefined;
  const serviceAccountEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

  if (!adminInstance.apps?.length) {
    if (clientEmail && privateKey) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert({ projectId, clientEmail, privateKey }),
        projectId
      });
      return adminInstance.firestore();
    } else if (serviceAccountEnv && fs.existsSync(serviceAccountEnv)) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert(serviceAccountEnv),
        projectId
      });
      return adminInstance.firestore();
    } else if (fs.existsSync(fallbackKeyPath)) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert(fallbackKeyPath),
        projectId
      });
      return adminInstance.firestore();
    }
  } else {
    return adminInstance.firestore();
  }

  try {
    const { Firestore } = require('@google-cloud/firestore');
    const { OAuth2Client } = require('google-auth-library');
    const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({
        access_token: tokenObj.access_token,
        refresh_token: account.tokens.refresh_token
      });
      return new Firestore({
        projectId: 'gamedu-69888475-f5783',
        authClient: oauthClient
      });
    }
  } catch (e) {
    console.log('Falling back to default initialization...');
  }

  adminInstance.initializeApp({
    credential: adminInstance.credential.applicationDefault(),
    projectId
  });
  return adminInstance.firestore();
}

async function verifySet100() {
  console.log('=== VERIFYING SET 100 (2009 BECE INTEGRATED SCIENCE COMPLETE VARIANT) ===');
  const db = await getFirestore();

  // 1. Target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2009_variant';
  const docSnap = await db.doc(docPath).get();
  if (!docSnap.exists) {
    throw new Error('Target document does not exist: ' + docPath);
  }

  const data = docSnap.data();
  console.log('Target document exists:', docPath);
  console.log('Year:', data.year, '| Set:', data.setNumber, '| Subject:', data.subject);

  if (data.setNumber !== 100) throw new Error('Expected setNumber 100, got: ' + data.setNumber);

  // 2. Paper 1 verification
  if (!data.paper1 || !Array.isArray(data.paper1.questions)) throw new Error('paper1 questions array missing');
  const p1 = data.paper1;
  console.log('Paper 1 questions count:', p1.questions.length);
  if (p1.questions.length !== 40) throw new Error('Expected 40 questions in Paper 1, found: ' + p1.questions.length);

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  p1.questions.forEach((q: any, i: number) => {
    if (!q.options || q.options.length !== 4) throw new Error('Q' + (i+1) + ' options not 4');
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === -1) throw new Error('Q' + (i+1) + ' correctAnswer not found in options');
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
    if (!q.hint || !q.workedSolution) throw new Error('Q' + (i+1) + ' missing hint or solution');
  });
  console.log('Paper 1 Key Distribution:', keyDist);
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Key distribution not exactly 10 each: ' + JSON.stringify(keyDist));
  }

  // Paper 1 SVGs
  const q13 = p1.questions.find((q: any) => q.number === 13);
  if (!q13 || !q13.prompt.includes('<svg') || !q13.prompt.includes('Lamp')) {
    throw new Error('Q13 DC circuit SVG missing!');
  }
  console.log('Q13 DC circuit with lamp SVG verified.');

  const q26 = p1.questions.find((q: any) => q.number === 26);
  if (!q26 || !q26.prompt.includes('<svg') || !q26.prompt.includes('Normal Line')) {
    throw new Error('Q26 reflection plane mirror SVG missing!');
  }
  console.log('Q26 reflection plane mirror SVG verified.');

  // 3. Paper 2 verification
  if (!data.paper2 || !Array.isArray(data.paper2.questions)) throw new Error('paper2 questions array missing');
  const p2 = data.paper2;
  console.log('Paper 2 questions count:', p2.questions.length);
  if (p2.questions.length !== 5) throw new Error('Expected 5 questions in Paper 2, found: ' + p2.questions.length);

  // Q1 practical
  const q1 = p2.questions[0];
  let q1Marks = 0;
  q1.subQuestions.forEach((s: any) => { q1Marks += s.maxMarks || 0; });
  console.log('Question 1 total marks:', q1Marks, '/ 30');
  if (q1Marks !== 30) throw new Error('Q1 marks not 30');

  // Q1 SVGs
  if (!q1.subQuestions[0].prompt.includes('<svg') || !q1.subQuestions[0].prompt.includes('THERMAL CONDUCTION')) {
    throw new Error('Q1(a) thermal conduction SVG missing');
  }
  console.log('Q1(a) thermal conduction bar SVG verified.');

  if (!q1.subQuestions[1].prompt.includes('<svg') || !q1.subQuestions[1].prompt.includes('Setup A')) {
    throw new Error('Q1(b) rusting setups SVG missing');
  }
  console.log('Q1(b) rusting setups SVG verified.');

  if (!q1.subQuestions[2].prompt.includes('<svg') || !q1.subQuestions[2].prompt.includes('STARCH TEST')) {
    throw new Error('Q1(c) starch test activities SVG missing');
  }
  console.log('Q1(c) starch test activities SVG verified.');

  // Questions 2 to 5 (15 marks each)
  for (let qIdx = 1; qIdx < 5; qIdx++) {
    const q = p2.questions[qIdx];
    let qMarks = 0;
    q.subQuestions.forEach((s: any) => { qMarks += s.maxMarks || 0; });
    console.log('Question', q.questionNumber, 'total marks:', qMarks, '/ 15');
    if (qMarks !== 15) throw new Error('Question ' + q.questionNumber + ' marks not 15');
  }

  // 4. Single-document read pattern
  const t1 = await db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2009_variant_p1').get();
  if (!t1.exists || t1.data().questions?.length !== 40) throw new Error('Topic doc paper_2009_variant_p1 missing or incomplete');
  console.log('Single-doc read paper_2009_variant_p1 verified (40 items).');

  const t2 = await db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2009_variant_p2').get();
  if (!t2.exists || t2.data().questions?.length !== 5) throw new Error('Topic doc paper_2009_variant_p2 missing or incomplete');
  console.log('Single-doc read paper_2009_variant_p2 verified (5 questions).');

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 100 (2009 BECE SCIENCE COMPLETE VARIANT)!');
}

verifySet100()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Verification failed for Set 100:', err);
    process.exit(1);
  });

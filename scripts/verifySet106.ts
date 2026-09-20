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
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
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

  // CLI OAuth fallback
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
  } catch (cliErr) {
    // Continue
  }

  try {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
    return adminInstance.firestore();
  } catch (e) {
    return adminInstance.firestore();
  }
}

async function verifySet106() {
  console.log('=== VERIFYING SET 106 & SET 107 (2006 BECE INTEGRATED SCIENCE COMPLETE VARIANT) ===');
  const db = await getFirestore();

  // 1. Target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2006_variant';
  const docSnap = await db.doc(docPath).get();
  if (!docSnap.exists) {
    throw new Error('Target document does not exist: ' + docPath);
  }

  const data = docSnap.data();
  console.log('Target document exists:', docPath);
  console.log('Year:', data.year, '| Set:', data.setNumber, '| Subject:', data.subject);

  if (data.setNumber !== 106) throw new Error('Expected setNumber 106, got: ' + data.setNumber);

  // 2. Paper 1 verification
  if (!data.paper1 || !Array.isArray(data.paper1.questions)) throw new Error('paper1 questions array missing');
  const p1 = data.paper1;
  console.log('Paper 1 questions count:', p1.questions.length);
  if (p1.questions.length !== 40) throw new Error('Expected 40 questions in Paper 1, found: ' + p1.questions.length);

  const keyDist: any = { A: 0, B: 0, C: 0, D: 0 };
  p1.questions.forEach((q: any, i: number) => {
    if (!q.options || q.options.length !== 4) throw new Error('Question ' + (i+1) + ' does not have 4 options');
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === -1) throw new Error('Question ' + (i+1) + ' correct answer not found in options');
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Paper 1 Key Distribution:', keyDist);
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Key distribution not exactly 10 A, 10 B, 10 C, 10 D: ' + JSON.stringify(keyDist));
  }

  // Q07 Glancing angle SVG check
  const q07 = p1.questions[6];
  if (!q07.prompt.includes('<svg') || !q07.prompt.includes('r = 70°')) {
    throw new Error('Q07 glancing angle SVG missing or incomplete');
  }
  console.log('Q07 glancing angle SVG verified (r = 70°).');

  // 3. Paper 2 verification
  if (!data.paper2 || !Array.isArray(data.paper2.questions)) throw new Error('paper2 questions array missing');
  const p2 = data.paper2;
  console.log('Paper 2 questions count:', p2.questions.length);
  if (p2.questions.length !== 5) throw new Error('Expected 5 questions in Paper 2, found: ' + p2.questions.length);

  // Question 1 (Practical - 30 marks)
  const q1 = p2.questions[0];
  if (!q1.subQuestions || q1.subQuestions.length !== 3) throw new Error('Question 1 does not have 3 subquestions');
  let q1Marks = 0;
  q1.subQuestions.forEach((s: any) => { q1Marks += s.maxMarks || 0; });
  console.log('Question 1 total marks:', q1Marks, '/ 30');
  if (q1Marks !== 30) throw new Error('Question 1 marks not 30');

  // Q1a Electromagnet nail SVG
  if (!q1.subQuestions[0].prompt.includes('<svg') || !q1.subQuestions[0].prompt.includes('Nail with Solenoid')) {
    throw new Error('Q1(a) electromagnet nail SVG missing');
  }
  console.log('Q1(a) solenoid electromagnetization of nail SVG verified.');

  // Q1b CO2 preparation SVG
  if (!q1.subQuestions[1].prompt.includes('<svg') || !q1.subQuestions[1].prompt.includes('Thistle Funnel')) {
    throw new Error('Q1(b) carbon dioxide preparation SVG missing');
  }
  console.log('Q1(b) carbon dioxide preparation and over-water collection apparatus SVG verified.');

  // Q1c Salivary digestion SVG
  if (!q1.subQuestions[2].prompt.includes('<svg') || !q1.subQuestions[2].prompt.includes('Yam + Iodine')) {
    throw new Error('Q1(c) salivary digestion of yam starch SVG missing');
  }
  console.log('Q1(c) salivary amylase yam pap starch hydrolysis SVG verified.');

  // Questions 2 to 5 (20 marks each)
  for (let qIdx = 1; qIdx < 5; qIdx++) {
    const q = p2.questions[qIdx];
    let qMarks = 0;
    q.subQuestions.forEach((s: any) => { qMarks += s.maxMarks || 0; });
    console.log('Question', q.questionNumber, 'total marks:', qMarks, '/ 20');
    if (qMarks !== 20) throw new Error('Question ' + q.questionNumber + ' marks not 20');
  }

  // Q5c Parallel circuit SVG
  const q5c = p2.questions[4].subQuestions[2];
  if (!q5c.prompt.includes('<svg') || !q5c.prompt.includes('Lamp 1') || !q5c.prompt.includes('Lamp 2')) {
    throw new Error('Q5(c) parallel circuit schematic SVG missing');
  }
  console.log('Q5(c) parallel lamp circuit schematic SVG verified.');

  // 4. Single-document read pattern
  const t1 = await db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2006_variant').get();
  if (!t1.exists || t1.data().questions?.length !== 40) throw new Error('Topic doc paper_2006_variant missing or incomplete');
  console.log('Single-doc read paper_2006_variant verified (40 items).');

  const t2 = await db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2006_variant_p2').get();
  if (!t2.exists || t2.data().questions?.length !== 5) throw new Error('Topic doc paper_2006_variant_p2 missing or incomplete');
  console.log('Single-doc read paper_2006_variant_p2 verified (5 questions).');

  console.log('🌟 ALL VERIFICATION CHECKS PASSED FOR SET 106 & SET 107 (2006 BECE SCIENCE COMPLETE VARIANT)!');
}

verifySet106()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Verification failed for Set 106/107:', err);
    process.exit(1);
  });

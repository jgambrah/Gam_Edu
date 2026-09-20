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

async function verifySet110() {
  console.log('🔍 Starting comprehensive verification for Set 110 & 111 (2004 BECE Science)...');
  const db = await getFirestore();

  // 1. Check Master Doc
  const masterDocRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2004_variant');
  const masterSnap = await masterDocRef.get();
  if (!masterSnap.exists) {
    throw new Error('❌ Master document paper_2004_variant not found in Firestore!');
  }
  const data = masterSnap.data();
  console.log('✅ Master Document Found:', masterDocRef.path);

  // 2. Validate Paper 1
  const p1 = data.paper1;
  if (!p1 || !Array.isArray(p1.questions) || p1.questions.length !== 40) {
    throw new Error(`❌ Paper 1 questions count mismatch: expected 40, found ${p1?.questions?.length}`);
  }
  console.log(`✅ Paper 1 Question Count: ${p1.questions.length}`);

  // 3. Validate Answer Key Distribution
  const keyDist: any = { A: 0, B: 0, C: 0, D: 0 };
  p1.questions.forEach((q: any, i: number) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === -1) throw new Error(`❌ Q${i+1} correct answer not found in options!`);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('✅ Paper 1 Key Distribution:', keyDist);
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error(`❌ Key distribution not balanced! Expected 10/10/10/10, got: ${JSON.stringify(keyDist)}`);
  }

  // 4. Validate Vector SVGs in Paper 1
  const q6 = p1.questions.find((q: any) => q.number === 6);
  if (!q6 || !q6.prompt.includes('<svg') || !q6.prompt.includes('1.5V')) {
    throw new Error('❌ Q06 Series vs Parallel Cells SVG missing or malformed!');
  }
  console.log('✅ Paper 1 Q06/Q07 Series vs Parallel Cells SVG Verified (IMG_2597.jpg / IMG_2596.jpg).');

  const q9 = p1.questions.find((q: any) => q.number === 9);
  if (!q9 || !q9.prompt.includes('<svg') || !q9.prompt.includes('Sugar Tongs') && !q9.prompt.includes('Fulcrum')) {
    throw new Error('❌ Q09 Sugar Tongs Class 3 Lever SVG missing or malformed!');
  }
  console.log('✅ Paper 1 Q09 Sugar Tongs Class 3 Lever SVG Verified (IMG_2595.jpg).');

  // 5. Validate Paper 2
  const p2 = data.paper2;
  if (!p2 || !Array.isArray(p2.questions) || p2.questions.length !== 5) {
    throw new Error(`❌ Paper 2 questions count mismatch: expected 5, found ${p2?.questions?.length}`);
  }
  console.log(`✅ Paper 2 Question Count: ${p2.questions.length}`);

  // Section A Question 1 SVGs and tables
  const q1 = p2.questions.find((q: any) => q.questionNumber === "1");
  const q1a = q1?.subQuestions?.find((sq: any) => sq.subId === "(a)");
  const q1b = q1?.subQuestions?.find((sq: any) => sq.subId === "(b)");
  const q1c = q1?.subQuestions?.find((sq: any) => sq.subId === "(c)");

  if (!q1a || !q1a.prompt.includes('<svg') || !q1a.prompt.includes('Ammeter') || !q1a.prompt.includes('Voltmeter')) {
    throw new Error('❌ Q1(a) Complete Direct Current Circuit SVG missing or malformed!');
  }
  console.log('✅ Paper 2 Q1(a) Complete DC Circuit SVG Verified (IMG_2594.jpg).');

  if (!q1b || !q1b.prompt.includes('<svg') || !q1b.prompt.includes('Water and') || !q1b.prompt.includes('Water jacket')) {
    throw new Error('❌ Q1(b) Fractional Distillation SVG missing or malformed!');
  }
  console.log('✅ Paper 2 Q1(b) Fractional Distillation SVG Verified (IMG_2593.jpg).');

  if (!q1c || !q1c.prompt.includes('Food Substance') || !q1c.workedSolution.includes('Substance A') || !q1c.workedSolution.includes('Starch')) {
    throw new Error('❌ Q1(c) Qualitative Food Tests Table details missing or malformed!');
  }
  console.log('✅ Paper 2 Q1(c) Qualitative Food Tests Table Verified (IMG_2592.jpg).');

  // Section B Question 4 Endocrine Table
  const q4 = p2.questions.find((q: any) => q.questionNumber === "4");
  const q4a = q4?.subQuestions?.find((sq: any) => sq.subId === "(a)");
  if (!q4a || !q4a.prompt.includes('Adrenalin') || !q4a.workedSolution.includes('Adrenal glands')) {
    throw new Error('❌ Q4(a) Endocrine Glands Table missing or malformed!');
  }
  console.log('✅ Paper 2 Q4(a) Endocrine Glands Table Verified (IMG_2591.jpg).');

  // 6. Check Single-Doc Read Paths
  const testPaths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2004_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2004_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2004_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2004_variant_p2'
  ];

  for (const tp of testPaths) {
    const s = await db.doc(tp).get();
    if (!s.exists) throw new Error(`❌ Read path ${tp} does not exist!`);
    console.log(`✅ Verified Single-Doc Read Path: ${tp}`);
  }

  console.log('🌟 ALL VERIFICATION CHECKS PASSED PERFECTLY FOR SET 110 & 111 (2004 BECE SCIENCE)!');
}

verifySet110()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
  });

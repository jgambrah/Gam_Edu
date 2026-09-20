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

async function verifySet108() {
  console.log('🔍 Starting comprehensive verification for Set 108 & 109 (2005 BECE Science)...');
  const db = await getFirestore();

  // 1. Check Master Doc
  const masterDocRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2005_variant');
  const masterSnap = await masterDocRef.get();
  if (!masterSnap.exists) {
    throw new Error('❌ Master document paper_2005_variant not found in Firestore!');
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

  // 4. Validate Vector SVGs in Paper 1 (Q10/Q11 lever system)
  const q10 = p1.questions.find((q: any) => q.number === 10);
  if (!q10 || !q10.prompt.includes('<svg') || !q10.prompt.includes('LEVER SYSTEM')) {
    throw new Error('❌ Q10 lever system SVG missing or malformed!');
  }
  console.log('✅ Paper 1 Q10 Crowbar Lever System SVG Verified.');

  // 5. Validate Paper 2
  const p2 = data.paper2;
  if (!p2 || !Array.isArray(p2.questions) || p2.questions.length !== 5) {
    throw new Error(`❌ Paper 2 questions count mismatch: expected 5, found ${p2?.questions?.length}`);
  }
  console.log(`✅ Paper 2 Question Count: ${p2.questions.length}`);

  // Check Section A Question 1 SVGs
  const q1 = p2.questions.find((q: any) => q.questionNumber === "1");
  const q1a = q1?.subQuestions?.find((sq: any) => sq.subId === "(a)");
  const q1b = q1?.subQuestions?.find((sq: any) => sq.subId === "(b)");
  const q1c = q1?.subQuestions?.find((sq: any) => sq.subId === "(c)");

  if (!q1a || !q1a.prompt.includes('<svg') || !q1a.prompt.includes('Set-up A')) {
    throw new Error('❌ Q1(a) Spouting Cans SVG missing or malformed!');
  }
  console.log('✅ Paper 2 Q1(a) Spouting Cans (Pressure vs Depth) SVG Verified.');

  if (!q1b || !q1b.prompt.includes('<svg') || !q1b.prompt.includes('Solution A')) {
    throw new Error('❌ Q1(b) Neutralization Reaction SVG missing or malformed!');
  }
  console.log('✅ Paper 2 Q1(b) Neutralization Reaction Test Tubes SVG Verified.');

  if (!q1c || !q1c.workedSolution.includes('Boiling water') || !q1c.workedSolution.includes('blue-black')) {
    throw new Error('❌ Q1(c) Leaf Starch Testing details missing or malformed!');
  }
  console.log('✅ Paper 2 Q1(c) Leaf Starch Testing Experiment Verified.');

  // Check Section B Question 4 Class 2 Lever SVG
  const q4 = p2.questions.find((q: any) => q.questionNumber === "4");
  const q4c = q4?.subQuestions?.find((sq: any) => sq.subId === "(c)");
  if (!q4c || !q4c.prompt.includes('<svg') || !q4c.prompt.includes('CLASS 2 LEVER')) {
    throw new Error('❌ Q4(c) Class 2 Lever System SVG missing or malformed!');
  }
  console.log('✅ Paper 2 Q4(c) Class 2 Lever System SVG Verified.');

  // 6. Check Single-Doc Read Paths
  const testPaths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2005_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2005_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2005_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2005_variant_p2'
  ];

  for (const tp of testPaths) {
    const s = await db.doc(tp).get();
    if (!s.exists) throw new Error(`❌ Read path ${tp} does not exist!`);
    console.log(`✅ Verified Single-Doc Read Path: ${tp}`);
  }

  console.log('🌟 ALL VERIFICATION CHECKS PASSED PERFECTLY FOR SET 108 & 109 (2005 BECE SCIENCE)!');
}

verifySet108()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
  });

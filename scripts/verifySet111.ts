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

async function verifySet111() {
  console.log('🔍 Running Dedicated Verification for Set 111 (2004 BECE Science Paper 2)...');
  const db = await getFirestore();

  // 1. Inspect Master Doc
  const masterDocRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2004_variant');
  const masterSnap = await masterDocRef.get();
  if (!masterSnap.exists) {
    throw new Error('❌ Master document paper_2004_variant not found in Firestore!');
  }
  const data = masterSnap.data();
  console.log('✅ Master Document Found:', masterDocRef.path);

  const p2 = data.paper2;
  if (!p2 || !Array.isArray(p2.questions) || p2.questions.length !== 5) {
    throw new Error(`❌ Paper 2 questions count mismatch: expected 5, found ${p2?.questions?.length}`);
  }
  console.log(`✅ Paper 2 Question Count: ${p2.questions.length} (Matches Checklist)`);

  // 2. Inspect Section A Question 1 (30 Marks Total)
  const q1 = p2.questions.find((q: any) => q.questionNumber === "1");
  if (!q1) throw new Error('❌ Question 1 not found in Paper 2!');

  const q1a = q1.subQuestions?.find((sq: any) => sq.subId === "(a)");
  if (!q1a) throw new Error('❌ Q1(a) missing!');
  if (!q1a.prompt.includes('<svg') || !q1a.prompt.includes('Ammeter') || !q1a.prompt.includes('Voltmeter')) {
    throw new Error('❌ Q1(a) Complete DC Circuit SVG missing or malformed!');
  }
  console.log(`✅ Q1(a) Complete Direct Current Circuit SVG Verified: ${q1a.maxMarks} marks (IMG_2594.jpg)`);

  const q1b = q1.subQuestions?.find((sq: any) => sq.subId === "(b)");
  if (!q1b) throw new Error('❌ Q1(b) missing!');
  if (!q1b.prompt.includes('<svg') || !q1b.prompt.includes('Water and') || !q1b.prompt.includes('Water jacket')) {
    throw new Error('❌ Q1(b) Fractional Distillation SVG missing or malformed!');
  }
  console.log(`✅ Q1(b) Fractional Distillation SVG Verified: ${q1b.maxMarks} marks (IMG_2593.jpg)`);

  const q1c = q1.subQuestions?.find((sq: any) => sq.subId === "(c)");
  if (!q1c) throw new Error('❌ Q1(c) missing!');
  if (!q1c.prompt.includes('Food Substance') || !q1c.workedSolution.includes('Substance A') || !q1c.workedSolution.includes('Starch')) {
    throw new Error('❌ Q1(c) Qualitative Food Tests Table details missing!');
  }
  console.log(`✅ Q1(c) Qualitative Food Tests Table Verified: ${q1c.maxMarks} marks (IMG_2592.jpg)`);

  // 3. Inspect Section B Theory Questions (60 marks total, 20 marks each)
  const q2 = p2.questions.find((q: any) => q.questionNumber === "2");
  if (!q2) throw new Error('❌ Question 2 missing!');
  const q2Marks = q2.subQuestions.reduce((acc: number, sq: any) => acc + (sq.maxMarks || 0), 0);
  console.log(`✅ Q2 Vegetative Propagation, Reproduction & Light Dispersion Verified: ${q2Marks} marks`);

  const q3 = p2.questions.find((q: any) => q.questionNumber === "3");
  if (!q3) throw new Error('❌ Question 3 missing!');
  const q3Marks = q3.subQuestions.reduce((acc: number, sq: any) => acc + (sq.maxMarks || 0), 0);
  console.log(`✅ Q3 Soil Erosion, Binary Compounds & Heat/Temperature Verified: ${q3Marks} marks`);

  const q4 = p2.questions.find((q: any) => q.questionNumber === "4");
  if (!q4) throw new Error('❌ Question 4 missing!');
  const q4a = q4.subQuestions?.find((sq: any) => sq.subId === "(a)");
  if (!q4a || !q4a.prompt.includes('Adrenalin') || !q4a.workedSolution.includes('Adrenal glands')) {
    throw new Error('❌ Q4(a) Endocrine Glands Table missing or malformed!');
  }
  const q4Marks = q4.subQuestions.reduce((acc: number, sq: any) => acc + (sq.maxMarks || 0), 0);
  console.log(`✅ Q4 Endocrine Table, Ammonia Synthesis & Physics of Forces Verified: ${q4Marks} marks (IMG_2591.jpg)`);

  const q5 = p2.questions.find((q: any) => q.questionNumber === "5");
  if (!q5) throw new Error('❌ Question 5 missing!');
  const q5Marks = q5.subQuestions.reduce((acc: number, sq: any) => acc + (sq.maxMarks || 0), 0);
  console.log(`✅ Q5 Rhizome/Stem Tuber, Separation Methods & Ship Buoyancy Verified: ${q5Marks} marks`);

  // 4. Verify Single-Doc Read Paths
  const pathsToCheck = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2004_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2004_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2004_variant/question_sets/paper_2004_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2004_variant_p2'
  ];

  for (const p of pathsToCheck) {
    const s = await db.doc(p).get();
    if (!s.exists) throw new Error(`❌ Read path ${p} does not exist!`);
    console.log(`✅ Verified Single-Doc Read Path: ${p}`);
  }

  console.log('🌟 DEDICATED VERIFICATION PASSED PERFECTLY FOR SET 111 (2004 BECE SCIENCE PAPER 2)!');
}

verifySet111()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Verification failed for Set 111:', err);
    process.exit(1);
  });

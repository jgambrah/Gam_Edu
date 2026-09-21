import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

const repoRoot = process.cwd();
dotenv.config({ path: path.join(repoRoot, '.env') });
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
  } catch (cliErr) {}

  try {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
    return adminInstance.firestore();
  } catch (e) {
    return adminInstance.firestore();
  }
}

async function runVerification() {
  console.log('🔍 Verifying Set 130 (1998 BECE Integrated Science Variant) in Firestore...');
  const db = await getFirestore();

  const mainDocRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_1998_variant');
  const mainDoc = await mainDocRef.get();

  if (!mainDoc.exists) {
    throw new Error('❌ mainDoc does not exist!');
  }

  const data = mainDoc.data()!;
  console.log('✅ Found paper_1998_variant document.');
  console.log(`   Year: ${data.year}, Set: ${data.setNumber}, Subject: ${data.subject}`);

  const p1 = data.paper1;
  if (!p1 || !Array.isArray(p1.questions) || p1.questions.length !== 40) {
    throw new Error(`❌ Paper 1 questions count mismatch: expected 40, got ${p1?.questions?.length}`);
  }
  console.log(`✅ Paper 1 questions count: ${p1.questions.length}`);

  // Check key distribution
  const keyDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  p1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === -1) {
      throw new Error(`❌ Q${q.number}: Correct answer not found in options!`);
    }
    const letter = ['A', 'B', 'C', 'D'][idx];
    keyDist[letter]++;
  });

  console.log('✅ Paper 1 Answer Key Distribution:', keyDist);
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('❌ Key distribution is NOT exactly 10 A, 10 B, 10 C, 10 D!');
  }

  // Verify Paper 1 Q39 Alveolar SVG
  const q39 = p1.questions.find((q: any) => q.number === 39);
  if (!q39 || !q39.prompt.includes('<svg') || !q39.prompt.includes('Alveolus')) {
    throw new Error('❌ Q39 Alveolar capillary gas exchange vector SVG missing from prompt!');
  }
  console.log('✅ Q39 Alveolar capillary gas exchange vector SVG verified.');

  // Check Paper 2
  const p2 = data.paper2;
  if (!p2 || !Array.isArray(p2.questions) || p2.questions.length !== 4) {
    throw new Error(`❌ Paper 2 questions count mismatch: expected 4, got ${p2?.questions?.length}`);
  }
  console.log(`✅ Paper 2 questions count: ${p2.questions.length}`);

  // Verify marks per question
  p2.questions.forEach((q: any) => {
    const totalMarks = q.subQuestions.reduce((sum: number, sq: any) => sum + (sq.maxMarks || 0), 0);
    console.log(`   Q${q.questionNumber} total marks: ${totalMarks}`);
    if (totalMarks !== 20) {
      throw new Error(`❌ Q${q.questionNumber} total marks expected 20, got ${totalMarks}`);
    }
  });

  // Verify vector SVGs in Paper 2
  const q4c = p2.questions[3].subQuestions.find((sq: any) => sq.subId === '(c)');
  if (!q4c || !q4c.prompt.includes('<svg') || !q4c.prompt.includes('LITHIUM ATOM')) {
    throw new Error('❌ Q4(c) Lithium Bohr shell structure vector SVG missing from prompt!');
  }
  console.log('✅ Q4(c) Lithium Bohr shell structure vector SVG verified.');

  // Check redundant paths
  const pathsToCheck = [
    'global_curriculum/jhs/subjects/integrated_science/past_papers/paper_1998_variant',
    'global_curriculum/jhs/subjects/science/past_papers/paper_1998_variant_p1',
    'global_curriculum/jhs/subjects/science/past_papers/paper_1998_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/past_papers/paper_1998_variant_p1',
    'global_curriculum/jhs/subjects/integrated_science/past_papers/paper_1998_variant_p2',
  ];

  for (const p of pathsToCheck) {
    const snap = await db.doc(p).get();
    if (!snap.exists) {
      console.warn(`⚠️ Path ${p} does not exist!`);
    } else {
      console.log(`✅ Path ${p} verified.`);
    }
  }

  console.log('🎉 ALL FIRESTORE VERIFICATION CHECKS PASSED FOR SET 130 (1998 BECE INTEGRATED SCIENCE)!');
}

runVerification()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
  });

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

async function verifyFirestoreSet119() {
  console.log('=== VERIFYING FIRESTORE INGESTION FOR SET 119 (PAPER 2) ===');
  const db = await getFirestore();

  // 1. Check main document: global_curriculum/jhs/subjects/science/past_papers/paper_2025_variant
  const mainPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2025_variant';
  const mainSnap = await db.doc(mainPath).get();
  if (!mainSnap.exists) {
    throw new Error(`Main doc does not exist at ${mainPath}`);
  }
  const mainData = mainSnap.data();
  console.log(`✅ Main doc verified: ${mainPath}`);
  console.log(`   - Paper 2 title: ${mainData.paper2?.title}`);
  console.log(`   - Paper 2 total questions: ${mainData.paper2?.questions?.length} (Expected: 5)`);
  console.log(`   - metadata.paper2Calibrated: ${mainData.metadata?.paper2Calibrated}`);
  console.log(`   - metadata.set119Verified: ${mainData.metadata?.set119Verified}`);

  if (!mainData.paper2?.questions || mainData.paper2.questions.length !== 5) {
    throw new Error('Paper 2 questions array in main doc does not contain 5 questions!');
  }

  // Check Q1 practical marks
  const q1 = mainData.paper2.questions[0];
  const q1Marks = q1.subQuestions.reduce((a: number, s: any) => a + s.maxMarks, 0);
  console.log(`   - Q1 Section A Practical marks: ${q1Marks} (Expected: 40)`);
  if (q1Marks !== 40) {
    throw new Error(`Q1 practical marks expected 40, got ${q1Marks}`);
  }

  // Check Q2-Q5 theory marks
  for (let i = 1; i <= 4; i++) {
    const q = mainData.paper2.questions[i];
    const marks = q.subQuestions.reduce((a: number, s: any) => a + s.maxMarks, 0);
    console.log(`   - Q${q.questionNumber} Section B Theory marks: ${marks} (Expected: 20)`);
    if (marks !== 20) {
      throw new Error(`Q${q.questionNumber} theory marks expected 20, got ${marks}`);
    }
  }

  // 2. Check single-doc P2 paths
  const p2Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2025_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2025_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2025_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2025_variant_p2',
  ];

  for (const p of p2Paths) {
    const snap = await db.doc(p).get();
    if (!snap.exists) {
      throw new Error(`P2 single doc does not exist at ${p}`);
    }
    const data = snap.data();
    console.log(`✅ P2 single-doc verified: ${p} (SetNumber: ${data.setNumber}, Questions: ${data.questions?.length})`);
    if (data.setNumber !== 119 || data.questions?.length !== 5) {
      throw new Error(`Unexpected data in ${p}`);
    }
  }

  console.log('\n🎉 ALL SET 119 FIRESTORE DATASETS VERIFIED SUCCESSFULLY!');
}

verifyFirestoreSet119()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Set 119 verification failed:', err);
    process.exit(1);
  });

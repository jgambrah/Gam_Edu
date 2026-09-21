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

async function verifyFirestoreSet120() {
  console.log('=== VERIFYING FIRESTORE INGESTION FOR SET 120 ===');
  const db = await getFirestore();

  // 1. Check main document
  const mainPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2024_variant';
  const mainSnap = await db.doc(mainPath).get();
  if (!mainSnap.exists) {
    throw new Error(`Main doc does not exist at ${mainPath}`);
  }
  const mainData = mainSnap.data();
  console.log(`✅ Main doc verified: ${mainPath}`);
  console.log(`   - Year: ${mainData.year}, Set: ${mainData.setNumber}, Subject: ${mainData.subject}`);
  console.log(`   - Paper 1 total questions: ${mainData.paper1?.questions?.length}`);
  console.log(`   - Paper 2 total questions: ${mainData.paper2?.questions?.length}`);

  // Check key distribution in Firestore doc
  const keyDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  mainData.paper1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    const letter = ['A', 'B', 'C', 'D'][idx];
    keyDist[letter]++;
  });
  console.log(`   - Verified Firestore Paper 1 key distribution:`, keyDist);
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error(`Firestore key distribution not 10 of each! ${JSON.stringify(keyDist)}`);
  }

  // Check Paper 2 marks
  const q1 = mainData.paper2.questions[0];
  const q1Marks = q1.subQuestions.reduce((acc: number, sub: any) => acc + sub.maxMarks, 0);
  console.log(`   - Q1 Section A Practical marks: ${q1Marks} (Expected: 40)`);
  if (q1Marks !== 40) throw new Error(`Q1 marks expected 40, got ${q1Marks}`);

  // 2. Check single-doc P1 path
  const p1Path = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2024_variant_p1';
  const p1Snap = await db.doc(p1Path).get();
  if (!p1Snap.exists) {
    throw new Error(`P1 single doc does not exist at ${p1Path}`);
  }
  const p1Data = p1Snap.data();
  console.log(`✅ P1 single-doc verified: ${p1Path} (questions: ${p1Data.questions?.length})`);

  // 3. Check single-doc P2 path
  const p2Path = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2024_variant_p2';
  const p2Snap = await db.doc(p2Path).get();
  if (!p2Snap.exists) {
    throw new Error(`P2 single doc does not exist at ${p2Path}`);
  }
  const p2Data = p2Snap.data();
  console.log(`✅ P2 single-doc verified: ${p2Path} (questions: ${p2Data.questions?.length})`);

  // 4. Check paper_2024_variant topic path root questions
  const topicPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2024_variant';
  const topicSnap = await db.doc(topicPath).get();
  if (!topicSnap.exists) {
    throw new Error(`Topic doc does not exist at ${topicPath}`);
  }
  console.log(`✅ Topic doc verified: ${topicPath}`);

  console.log('\n🎉 ALL FIRESTORE DATASETS VERIFIED SUCCESSFULLY FOR SET 120!');
}

verifyFirestoreSet120()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
  });

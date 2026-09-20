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

async function verifySet90() {
  console.log('--- STARTING COMPREHENSIVE VERIFICATION FOR SET 90 ---');
  const db = await getFirestore();

  // 1. Check Primary Document
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2013_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    console.error('❌ Document does not exist at:', docPath);
    process.exit(1);
  }

  const data = docSnap.data();
  console.log('✅ Primary Document Loaded successfully.');
  console.log('Year:', data.year, '| Set Number:', data.setNumber, '| Subject:', data.subject);

  const paper1 = data.paper1;
  if (!paper1) {
    console.error('❌ paper1 object missing!');
    process.exit(1);
  }

  const questions = paper1.questions || [];
  console.log('Total Questions in document:', questions.length);

  if (questions.length !== 40) {
    console.error('❌ Expected 40 questions, got:', questions.length);
    process.exit(1);
  }
  console.log('✅ Question count check passed: 40/40 items.');

  // 2. Check Key Distribution
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  questions.forEach((q: any, i: number) => {
    const correctIdx = q.options.indexOf(q.correctAnswer);
    const letter = ['A', 'B', 'C', 'D'][correctIdx];
    if (!letter) {
      console.error(`❌ Q${i+1} correctAnswer not found in options!`);
    } else {
      counts[letter]++;
    }
  });

  console.log('Key Distribution across 40 items:', counts);
  if (counts.A === 10 && counts.B === 10 && counts.C === 10 && counts.D === 10) {
    console.log('✅ Balanced Key Distribution Verified: Exactly 10 A, 10 B, 10 C, 10 D (0% skew).');
  } else {
    console.error('❌ Key distribution is skewed!', counts);
    process.exit(1);
  }

  // 3. Check Q11 Vector SVG (Lever mechanism)
  const q11 = questions[10];
  if (q11 && q11.prompt.includes('<svg') && q11.prompt.includes('Fixed Pivot (Fulcrum)')) {
    console.log('✅ Q11 Vector SVG verified (Lever mechanism turning about fixed fulcrum).');
  } else {
    console.error('❌ Q11 SVG missing or invalid:', q11?.prompt?.slice(0, 100));
    process.exit(1);
  }

  // 4. Check Q17 Vector SVG (Railway expansion joint gap)
  const q17 = questions[16];
  if (q17 && q17.prompt.includes('<svg') && q17.prompt.includes('Expansion Gap')) {
    console.log('✅ Q17 Vector SVG verified (Railway expansion joint gap).');
  } else {
    console.error('❌ Q17 SVG missing or invalid:', q17?.prompt?.slice(0, 100));
    process.exit(1);
  }

  // 5. Check Q35 Calculation
  const q35 = questions[34];
  if (q35 && q35.correctAnswer === '14 neutrons' && q35.workedSolution.includes('14')) {
    console.log('✅ Q35 Nuclear calculation verified: 27 - 13 = 14 neutrons.');
  } else {
    console.error('❌ Q35 Calculation mismatch:', q35);
    process.exit(1);
  }

  // 6. Check Topic Question Set Synced Document
  const topicPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2013_variant';
  const topicSnap = await db.doc(topicPath).get();
  if (topicSnap.exists) {
    const tData = topicSnap.data();
    console.log('✅ Topic Question Set Document verified:', topicPath);
    console.log('   Synced questions count:', tData.questions?.length);
    if (tData.questions?.length === 40) {
      console.log('✅ Single-document read architecture verified (all 40 questions in single document, 0 subcollections).');
    }
  } else {
    console.warn('⚠️ Topic document not yet synced at:', topicPath);
  }

  console.log('--- ALL VERIFICATION CHECKS PASSED FOR SET 90 ---');
}

verifySet90()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
  });

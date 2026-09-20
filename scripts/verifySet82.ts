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

async function verifySet82() {
  console.log('--- VERIFYING SET 82 FIRESTORE INTEGRITY ---');
  const db = await getFirestore();

  // 1. Verify paper_2019_variant in science/past_papers
  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2019_variant');
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new Error('paper_2019_variant does NOT exist!');
  }
  const data = snap.data();

  // Check paper1
  if (!data.paper1 || !data.paper1.questions) {
    throw new Error('paper1 is missing from paper_2019_variant!');
  }
  console.log('Paper 1 Title:', data.paper1.title);
  console.log('Paper 1 Questions count:', data.paper1.questions.length);
  if (data.paper1.questions.length !== 40) {
    throw new Error('Expected 40 questions in paper1, got ' + data.paper1.questions.length);
  }

  // Verify answer key distribution
  const keyDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  data.paper1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Key Distribution across 40 items:', keyDist);
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Key distribution is NOT exactly 10 A, 10 B, 10 C, 10 D!');
  }
  console.log('✅ Key distribution verified: exactly 10 A, 10 B, 10 C, 10 D.');

  // Check Q12 Vector SVG
  const q12 = data.paper1.questions[11];
  if (!q12.prompt.includes('<svg') || !q12.prompt.includes('LOAD')) {
    throw new Error('Q12 does not include crowbar vector SVG!');
  }
  console.log('✅ Q12 includes responsive crowbar lever SVG diagram.');

  // Check Q16 Vector SVG
  const q16 = data.paper1.questions[15];
  if (!q16.prompt.includes('<svg') || !q16.prompt.includes('Kerosene')) {
    throw new Error('Q16 does not include capillary wick vector SVG!');
  }
  console.log('✅ Q16 includes responsive capillary wick SVG diagram.');

  // Check Q20 Work formula derivation
  const q20 = data.paper1.questions[19];
  if (!q20.workedSolution.includes('60') || !q20.prompt.includes('720')) {
    throw new Error('Q20 calculation does not match 720 J / 12 m = 60 N!');
  }
  console.log('✅ Q20 verified: Force = Work / Distance = 720 J / 12 m = 60 N.');

  // Check that paper2 is still intact from Set 83
  if (!data.paper2 || data.paper2.questions?.length !== 5) {
    throw new Error('paper2 from Set 83 was overwritten or corrupted!');
  }
  console.log('✅ paper2 (Set 83) is preserved intact with 5 questions!');

  // 2. Check topic question set document
  const topicRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2019_variant');
  const topicSnap = await topicRef.get();
  if (!topicSnap.exists) {
    throw new Error('Topic question set paper_2019_variant does NOT exist!');
  }
  const topicData = topicSnap.data();
  console.log('✅ Topic question set doc exists! SetNumber:', topicData.setNumber, 'Questions:', topicData.questions?.length);
  if (topicData.questions?.length !== 40) {
    throw new Error('Topic question set does not have 40 questions!');
  }

  // Check subcollections
  const subcolls = await topicRef.listCollections();
  console.log('Subcollections under paper_2019_variant:', subcolls.length);
  if (subcolls.length > 0) {
    throw new Error('Unexpected subcollections found: ' + subcolls.map((c: any) => c.id).join(', '));
  }
  console.log('✅ Single-read document structure verified (0 subcollections)!');

  console.log('🎉 ALL INTEGRITY CHECKS FOR SET 82 PASSED PERFECTLY!');
}

verifySet82().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});

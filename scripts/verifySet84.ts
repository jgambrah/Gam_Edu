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

async function verifySet84() {
  console.log('--- VERIFYING SET 84 FIRESTORE INTEGRITY ---');
  const db = await getFirestore();

  // 1. Verify paper_2018_variant in science/past_papers
  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2018_variant');
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new Error('paper_2018_variant does NOT exist!');
  }
  const data = snap.data();

  // Check paper1
  if (!data.paper1 || !data.paper1.questions) {
    throw new Error('paper1 is missing from paper_2018_variant!');
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

  // Check Q01 Vector SVG (Class 1 Lever)
  const q01 = data.paper1.questions[0];
  if (!q01.prompt.includes('<svg') || !q01.prompt.includes('Pivot (Fulcrum)')) {
    throw new Error('Q01 does not include class 1 lever vector SVG!');
  }
  console.log('✅ Q01 includes responsive first-class lever SVG diagram.');

  // Check Q17 Vector SVG (Kinetic Energy)
  const q17 = data.paper1.questions[16];
  if (!q17.prompt.includes('<svg') || !q17.prompt.includes('m = 4 kg')) {
    throw new Error('Q17 does not include kinetic energy vector SVG!');
  }
  if (q17.prompt.includes('18 Joules')) {
    throw new Error('Q17 diagram contains unsanitized answer spoiler (18 Joules)!');
  }
  console.log('✅ Q17 includes responsive kinetic energy SVG diagram (sanitized, zero spoiler).');

  // Check Q34 Parallel Resistance
  const q34 = data.paper1.questions[33];
  if (!q34.correctAnswer.includes('3 Ω') || !q34.prompt.includes('6')) {
    throw new Error('Q34 calculation does not match 6 Ω // 6 Ω = 3 Ω!');
  }
  console.log('✅ Q34 verified: Parallel resistors 6 Ω // 6 Ω = 3 Ω.');

  // 2. Check topic question set document
  const topicRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2018_variant');
  const topicSnap = await topicRef.get();
  if (!topicSnap.exists) {
    throw new Error('Topic question set paper_2018_variant does NOT exist!');
  }
  const topicData = topicSnap.data();
  console.log('✅ Topic question set doc exists! SetNumber:', topicData.setNumber, 'Questions:', topicData.questions?.length);
  if (topicData.questions?.length !== 40) {
    throw new Error('Topic question set does not have 40 questions!');
  }

  // Check subcollections
  const subcolls = await topicRef.listCollections();
  console.log('Subcollections under paper_2018_variant:', subcolls.length);
  if (subcolls.length > 0) {
    throw new Error('Unexpected subcollections found: ' + subcolls.map((c: any) => c.id).join(', '));
  }
  console.log('✅ Single-read document structure verified (0 subcollections)!');

  console.log('🎉 ALL INTEGRITY CHECKS FOR SET 84 PASSED PERFECTLY!');
}

verifySet84().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});

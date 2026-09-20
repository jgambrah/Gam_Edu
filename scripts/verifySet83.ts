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

async function verifySet83() {
  console.log('--- VERIFYING SET 83 FIRESTORE INTEGRITY ---');
  const db = await getFirestore();

  // 1. Verify paper_2019_variant
  const paperRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2019_variant');
  const snap = await paperRef.get();
  if (!snap.exists) {
    throw new Error('global_curriculum/jhs/subjects/science/past_papers/paper_2019_variant does NOT exist!');
  }
  const data = snap.data();
  console.log('Document exists! Checking paper2 data...');

  if (!data.paper2) {
    throw new Error('paper2 field is missing from document!');
  }

  const p2 = data.paper2;
  console.log('Paper 2 Title:', p2.title);
  console.log('Paper 2 Questions count:', p2.questions.length);

  if (p2.questions.length !== 5) {
    throw new Error('Expected 5 questions, got ' + p2.questions.length);
  }

  const q1 = p2.questions[0];
  console.log('Q1 isPracticalSectionA:', q1.isPracticalSectionA);
  console.log('Q1 subQuestions count:', q1.subQuestions.length);
  if (q1.subQuestions.length !== 4) {
    throw new Error('Expected 4 subQuestions in Q1, got ' + q1.subQuestions.length);
  }

  // Check SVG sanitization in Q1
  const q1Prompt = q1.subQuestions[0].prompt;
  if (q1Prompt.includes('Rusts') || q1Prompt.includes('No Rust')) {
    throw new Error('Q1(a) diagram contains unsanitized outcome spoilers!');
  } else {
    console.log('✅ Q1(a) SVG diagram successfully sanitized (no spoilers).');
  }

  // Check Q2 shadow diagram sanitization
  const q2 = p2.questions[1];
  const q2Prompt = q2.subQuestions[1].prompt;
  if (q2Prompt.includes('A (Umbra)') || q2Prompt.includes('B (Penumbra)')) {
    throw new Error('Q2(b) shadow diagram contains unsanitized label spoilers!');
  } else {
    console.log('✅ Q2(b) shadow SVG diagram successfully sanitized (no spoilers).');
  }

  // 2. Verify Topic Question Set Doc (Single document read)
  const topicDocRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2019_variant_p2');
  const topicSnap = await topicDocRef.get();
  if (!topicSnap.exists) {
    throw new Error('Topic question set doc paper_2019_variant_p2 does NOT exist!');
  }
  const topicData = topicSnap.data();
  console.log('✅ Topic question set doc exists! SetNumber:', topicData.setNumber, 'Questions count:', topicData.questions?.length);

  // Check that no subcollections exist under paper_2019_variant_p2
  const subcolls = await topicDocRef.listCollections();
  console.log('Subcollections under paper_2019_variant_p2:', subcolls.length);
  if (subcolls.length > 0) {
    throw new Error('Found unexpected subcollections: ' + subcolls.map((c: any) => c.id).join(', '));
  }
  console.log('✅ Single-read document structure verified (0 subcollections)!');

  console.log('🎉 ALL INTEGRITY CHECKS FOR SET 83 PASSED PERFECTLY!');
}

verifySet83().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

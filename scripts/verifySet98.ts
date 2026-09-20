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

async function verifySet98() {
  console.log('=== VERIFYING SET 98 (1990 BECE SCIENCE PAPER 1 VARIANT) ===');
  const db = await getFirestore();

  // 1. Verify target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_1990_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    throw new Error(`Target document does not exist: ${docPath}`);
  }

  const data = docSnap.data();
  console.log('✅ Target past paper document exists:', docPath);
  console.log('Year:', data.year, '| Set Number:', data.setNumber, '| Subject:', data.subject);

  if (data.year !== 1990 || data.setNumber !== 98) {
    throw new Error(`Expected year 1990, set 98; found year ${data.year}, set ${data.setNumber}`);
  }

  const p1 = data.paper1;
  if (!p1 || !Array.isArray(p1.questions)) {
    throw new Error('❌ paper1 or paper1.questions missing!');
  }

  console.log('✅ Paper 1 questions count:', p1.questions.length);
  if (p1.questions.length !== 40) {
    throw new Error(`Expected 40 questions in Paper 1, found ${p1.questions.length}`);
  }

  // Check IDs and 4-option framework on all questions
  p1.questions.forEach((q: any, idx: number) => {
    if (!q.id || typeof q.id !== 'string') {
      throw new Error(`Question at index ${idx} missing valid string id: ${q.id}`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Question ${q.id} does not have exactly 4 options! Count: ${q.options?.length}`);
    }
    if (!q.options.includes(q.correctAnswer)) {
      throw new Error(`Question ${q.id} correctAnswer '${q.correctAnswer}' not in options!`);
    }
  });
  console.log('✅ All 40 questions have explicit string IDs and 4 standardized options (A-D).');

  // Check SVGs
  const q3 = p1.questions[2];
  if (!q3.prompt.includes('<svg') || !q3.prompt.includes('Liebig Condenser')) {
    throw new Error('❌ Q03 missing simple distillation vector SVG!');
  }
  console.log('✅ Q03 embeds simple distillation vector SVG.');

  const q14 = p1.questions[13];
  if (!q14.prompt.includes('<svg') || !q14.prompt.includes('CLASS 1 LEVER')) {
    throw new Error('❌ Q14 missing first-class lever vector SVG!');
  }
  console.log('✅ Q14 embeds first-class lever vector SVG.');

  const q16 = p1.questions[15];
  if (!q16.prompt.includes('<svg') || !q16.prompt.includes('Pupil (Aperture)')) {
    throw new Error('❌ Q16 missing eye pupil/iris vector SVG!');
  }
  console.log('✅ Q16 embeds eye pupil/iris light regulation vector SVG.');

  // Check key distribution
  const keyDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  p1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('✅ Answer key distribution:', keyDist);

  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error(`Key distribution is not 10A/10B/10C/10D! Found: ${JSON.stringify(keyDist)}`);
  }
  console.log('✅ Exact 10 A, 10 B, 10 C, 10 D distribution verified (0% skew).');

  // 2. Verify single-document read pattern
  const topicDocPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_1990_variant';
  const topicSnap = await db.doc(topicDocPath).get();
  if (!topicSnap.exists) {
    throw new Error(`❌ Topic question set document missing: ${topicDocPath}`);
  }
  const topicData = topicSnap.data();
  console.log('✅ Single-document read pattern verified at:', topicDocPath);
  console.log('Topic set questions count:', topicData.questions?.length);
  if (topicData.questions?.length !== 40) {
    throw new Error(`Expected 40 questions in topic document, found ${topicData.questions?.length}`);
  }

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 98 (1990 BECE SCIENCE PAPER 1 VARIANT)!');
}

verifySet98()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed for Set 98:', err);
    process.exit(1);
  });

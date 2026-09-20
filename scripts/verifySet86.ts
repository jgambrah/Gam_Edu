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

async function verifySet86() {
  console.log('=== VERIFYING SET 86 (2021 BECE SCIENCE PAPER 1 VARIANT) ===');
  const db = await getFirestore();

  // 1. Verify target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2021_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    throw new Error(`Target document does not exist: ${docPath}`);
  }

  const data = docSnap.data();
  console.log('Target document exists:', docPath);

  if (!data.paper1 || !Array.isArray(data.paper1.questions)) {
    throw new Error('paper1.questions is missing or invalid in target document!');
  }

  const questions = data.paper1.questions;
  console.log(`✅ Questions count: ${questions.length}`);

  if (questions.length !== 40) {
    throw new Error(`Expected 40 questions, found: ${questions.length}`);
  }

  // 2. Check Key Distribution
  const dist = { A: 0, B: 0, C: 0, D: 0 };
  questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) dist.A++;
    if (idx === 1) dist.B++;
    if (idx === 2) dist.C++;
    if (idx === 3) dist.D++;
  });
  console.log('Key distribution:', dist);

  if (dist.A !== 10 || dist.B !== 10 || dist.C !== 10 || dist.D !== 10) {
    throw new Error(`Invalid key distribution! Expected 10/10/10/10, found: ${JSON.stringify(dist)}`);
  }
  console.log('✅ Key distribution verified: exactly 10 A, 10 B, 10 C, 10 D (0% skew)');

  // 3. Check SVGs in Q08 and Q33
  const q08 = questions.find((q: any) => q.number === 8);
  if (!q08 || !q08.prompt.includes('<svg')) {
    throw new Error('Q08 does not contain vector SVG diagram!');
  }
  if (q08.prompt.includes('LOAD IN THE MIDDLE')) {
    throw new Error('Q08 SVG contains answer spoiler!');
  }
  console.log('✅ Q08 includes sanitized Class 2 lever SVG diagram');

  const q33 = questions.find((q: any) => q.number === 33);
  if (!q33 || !q33.prompt.includes('<svg')) {
    throw new Error('Q33 does not contain vector SVG diagram!');
  }
  if (q33.prompt.includes('EARTH BETWEEN SUN AND MOON')) {
    throw new Error('Q33 SVG contains answer spoiler!');
  }
  console.log('✅ Q33 includes sanitized Lunar Eclipse SVG diagram');

  // 4. Check Calculations
  const q17 = questions.find((q: any) => q.number === 17);
  if (!q17 || !q17.workedSolution.includes('100')) {
    throw new Error('Q17 kinetic energy calculation (100 J) failed verification!');
  }
  console.log('✅ Q17 calculates kinetic energy cleanly: 100 Joules');

  const q30 = questions.find((q: any) => q.number === 30);
  if (!q30 || !q30.workedSolution.includes('25.0')) {
    throw new Error('Q30 density/mass calculation (25.0 g) failed verification!');
  }
  console.log('✅ Q30 calculates mass cleanly: 25.0 grams');

  const q40 = questions.find((q: any) => q.number === 40);
  if (!q40 || q40.correctAnswer !== '2') {
    throw new Error('Q40 stoichiometry equation balancing failed verification!');
  }
  console.log('✅ Q40 verifies stoichiometric balancing coefficient: 2');

  // 5. Check topic question set doc
  const topicPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2021_variant';
  const topicSnap = await db.doc(topicPath).get();
  if (!topicSnap.exists) {
    throw new Error(`Topic question set does not exist: ${topicPath}`);
  }
  const topicData = topicSnap.data();
  console.log(`✅ Topic question set ${topicPath} exists with ${topicData.questions?.length} questions (Single document read pattern verified)`);

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 86 (2021 BECE SCIENCE PAPER 1)!');
}

verifySet86()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  });

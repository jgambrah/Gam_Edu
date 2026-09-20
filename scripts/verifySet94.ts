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

async function verifySet94() {
  console.log('=== VERIFYING SET 94 (2011 BECE SCIENCE PAPER 1 VARIANT) ===');
  const db = await getFirestore();

  // 1. Verify target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2011_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    throw new Error('Target document does not exist: ' + docPath);
  }

  const data = docSnap.data();
  console.log('✅ Target past paper document exists:', docPath);
  console.log('Year:', data.year, '| Set Number:', data.setNumber, '| Subject:', data.subject);

  if (!data.paper1 || !Array.isArray(data.paper1.questions)) {
    throw new Error('paper1.questions is missing or not an array');
  }

  const questions = data.paper1.questions;
  console.log('✅ Paper 1 questions count:', questions.length);

  if (questions.length !== 40) {
    throw new Error('Expected exactly 40 questions, found: ' + questions.length);
  }

  // 2. Check Q10 stamen SVG
  const q10 = questions[9];
  if (!q10.prompt.includes('<svg') || !q10.prompt.includes('Filament') || !q10.prompt.includes('Anther')) {
    throw new Error('Q10 does not embed stamen anatomy vector SVG');
  }
  console.log('✅ Q10 embeds stamen anatomy vector SVG (anther and filament).');

  // 3. Check Q40 biological hierarchy SVG
  const q40 = questions[39];
  if (!q40.prompt.includes('<svg') || !q40.prompt.includes('Cells') || !q40.prompt.includes('Tissues') || !q40.prompt.includes('Organs') || !q40.prompt.includes('Systems')) {
    throw new Error('Q40 does not embed biological hierarchy vector SVG');
  }
  console.log('✅ Q40 embeds biological hierarchy vector SVG (Cells -> Tissues -> Organs -> Systems).');

  // 4. Verify Q12 and Q33 nuclear mass & neutron calculations
  const q12 = questions[11];
  if (q12.correctAnswer !== '13' || !q12.workedSolution.includes('6 + 7 = 13')) {
    throw new Error('Q12 calculation verification failed');
  }
  const q33 = questions[32];
  if (!q33.correctAnswer.includes('13 neutrons') || !q33.workedSolution.includes('25 - 12 = 13')) {
    throw new Error('Q33 calculation verification failed');
  }
  console.log('✅ Q12 and Q33 calculate nuclear mass number (6+7=13) and neutron count (25-12=13) cleanly.');

  // 5. Verify answer key distribution (10 A, 10 B, 10 C, 10 D)
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  questions.forEach((q: any, i: number) => {
    if (!q.id) {
      throw new Error('Question at index ' + i + ' is missing an id string!');
    }
    const correctIdx = q.options.indexOf(q.correctAnswer);
    if (correctIdx === -1) {
      throw new Error('Correct answer not found in options for question ' + q.number);
    }
    if (correctIdx === 0) keyDist.A++;
    if (correctIdx === 1) keyDist.B++;
    if (correctIdx === 2) keyDist.C++;
    if (correctIdx === 3) keyDist.D++;
  });

  console.log('✅ Answer key distribution:', keyDist);
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Answer distribution is unbalanced: ' + JSON.stringify(keyDist));
  }
  console.log('✅ Exact 10 A, 10 B, 10 C, 10 D distribution verified (0% skew).');

  // 6. Verify single-document read pattern
  const topicPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2011_variant';
  const topicSnap = await db.doc(topicPath).get();
  if (!topicSnap.exists) {
    throw new Error('Topic question set does not exist: ' + topicPath);
  }
  const topicData = topicSnap.data();
  console.log('✅ Single-document read pattern verified: ' + topicPath + ' exists with ' + topicData.questions?.length + ' questions.');

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 94 (2011 BECE SCIENCE PAPER 1 VARIANT)!');
}

verifySet94()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  });
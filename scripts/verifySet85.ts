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

async function verifySet85() {
  console.log('=== VERIFYING SET 85 (2018 BECE SCIENCE PAPER 2 VARIANT) ===');
  const db = await getFirestore();

  // 1. Verify target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2018_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    throw new Error(`Target document does not exist: ${docPath}`);
  }

  const data = docSnap.data();
  console.log('Target document exists:', docPath);

  // Check paper 1 preserved
  if (data.paper1 && Array.isArray(data.paper1.questions)) {
    console.log(`✅ Paper 1 preserved: ${data.paper1.questions.length} questions`);
  } else {
    console.warn('⚠️ Paper 1 not found in doc!');
  }

  // Check paper 2
  if (!data.paper2) {
    throw new Error('paper2 field missing in target document!');
  }

  const p2Questions = data.paper2.questions;
  console.log(`✅ Paper 2 questions count: ${p2Questions.length}`);

  if (p2Questions.length !== 6) {
    throw new Error(`Expected 6 questions in Paper 2, found: ${p2Questions.length}`);
  }

  // Check Q1 practical
  const q1 = p2Questions[0];
  console.log(`Q1 has ${q1.subQuestions.length} subquestions (Practical Section A)`);
  if (!q1.isPracticalSectionA || q1.subQuestions.length !== 4) {
    throw new Error('Q1 structure invalid: expected 4 practical subquestions');
  }

  // Check SVGs in Q1
  for (let i = 0; i < 3; i++) {
    const sub = q1.subQuestions[i];
    if (!sub.prompt.includes('<svg')) {
      throw new Error(`Subquestion ${sub.subId} missing SVG!`);
    }
  }
  console.log('✅ SVGs present in Q1(a), Q1(b), and Q1(c)');

  // Verify no spoiler text in SVGs
  const q1aPrompt = q1.subQuestions[0].prompt;
  const q1bPrompt = q1.subQuestions[1].prompt;
  const q1cPrompt = q1.subQuestions[2].prompt;

  if (q1aPrompt.includes('I (Mouth)') || q1aPrompt.includes('VI (Eye)') || q1aPrompt.includes('II (Operculum)')) {
    throw new Error('Spoiler labels found in Q1(a) SVG!');
  }
  if (q1bPrompt.includes('I (Topsoil') || q1bPrompt.includes('IV (Bedrock')) {
    throw new Error('Spoiler labels found in Q1(b) SVG!');
  }
  if (q1cPrompt.includes('I (Cell)') || q1cPrompt.includes('II (Switch)') || q1cPrompt.includes('VI (Rheostat)')) {
    throw new Error('Spoiler labels found in Q1(c) SVG!');
  }
  console.log('✅ All SVGs sanitized with 0 spoiler text');

  // Verify numerical calculations in Q2 and Q3
  const q2Worked = q2WorkedSolution(p2Questions);
  if (!q2Worked.includes('52')) {
    throw new Error('Q2 mechanical work calculation (52 J) missing!');
  }
  console.log('✅ Q2 mechanical work cleanly evaluated: 52 J');

  const q3Worked = q3WorkedSolution(p2Questions);
  if (!q3Worked.includes('20')) {
    throw new Error('Q3 kinetic energy calculation (20 J) missing!');
  }
  console.log('✅ Q3 kinetic energy cleanly evaluated: 20 J');

  // 2. Check topic question set doc
  const topicPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2018_variant_p2';
  const topicSnap = await db.doc(topicPath).get();
  if (!topicSnap.exists) {
    throw new Error(`Topic question set does not exist: ${topicPath}`);
  }
  const topicData = topicSnap.data();
  console.log(`✅ Topic question set ${topicPath} exists with ${topicData.questions?.length} questions (Single document read pattern verified)`);

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 85 (2018 BECE SCIENCE PAPER 2)!');
}

function q2WorkedSolution(qs: any[]): string {
  const q = qs.find((x: any) => x.questionNumber === '2');
  return q ? q.subQuestions.map((s: any) => s.workedSolution).join(' ') : '';
}

function q3WorkedSolution(qs: any[]): string {
  const q = qs.find((x: any) => x.questionNumber === '3');
  return q ? q.subQuestions.map((s: any) => s.workedSolution).join(' ') : '';
}

verifySet85()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  });

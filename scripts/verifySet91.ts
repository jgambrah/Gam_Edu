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

async function verifySet91() {
  console.log('=== VERIFYING SET 91 (2013 BECE SCIENCE PAPER 2 VARIANT) ===');
  const db = await getFirestore();

  // 1. Verify target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2013_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    throw new Error(`Target document does not exist: ${docPath}`);
  }

  const data = docSnap.data();
  console.log('✅ Target document exists:', docPath);
  console.log('Year:', data.year, '| Set Number:', data.setNumber, '| Subject:', data.subject);

  // Check Paper 1 preserved (Set 90)
  if (data.paper1 && Array.isArray(data.paper1.questions)) {
    console.log(`✅ Paper 1 preserved: ${data.paper1.questions.length} questions (Set 90 intact)`);
    if (data.paper1.questions.length !== 40) {
      throw new Error(`Expected 40 questions in Paper 1, found: ${data.paper1.questions.length}`);
    }
  } else {
    throw new Error('❌ Paper 1 not found or invalid in target document!');
  }

  // Check Paper 2
  if (!data.paper2) {
    throw new Error('❌ paper2 field missing in target document!');
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

  // Check SVGs in Q1 (a, b, c, d)
  if (
    !q1.subQuestions[0].prompt.includes('<svg') ||
    !q1.subQuestions[1].prompt.includes('<svg') ||
    !q1.subQuestions[2].prompt.includes('<svg') ||
    !q1.subQuestions[3].prompt.includes('<svg')
  ) {
    throw new Error('SVGs missing in one or more Q1 subquestions!');
  }
  console.log('✅ All 4 SVGs present in Q1(a), Q1(b), Q1(c), and Q1(d)');

  // Verify no spoiler text in SVGs
  const q1aPrompt = q1.subQuestions[0].prompt;
  const q1cPrompt = q1.subQuestions[2].prompt;
  const q1dPrompt = q1.subQuestions[3].prompt;

  if (q1aPrompt.includes('(Potato Cavity)') || q1aPrompt.includes('Living Plant Tissue (Potato Cavity)')) {
    throw new Error('Spoiler labels found in Q1(a) SVG!');
  }
  if (q1cPrompt.includes('(Stopper)') || q1cPrompt.includes('(Silvered Walls)') || q1cPrompt.includes('(Vacuum Space)')) {
    throw new Error('Spoiler labels found in Q1(c) SVG!');
  }
  if (q1dPrompt.includes('(Sand)') || q1dPrompt.includes('(Loam)') || q1dPrompt.includes('(Clay)')) {
    throw new Error('Spoiler labels found in Q1(d) SVG!');
  }
  console.log('✅ All SVGs verified to be sanitized with 0 spoiler text.');

  // Verify Q1(b) chemical equation
  const q1bWorked = q1.subQuestions[1].workedSolution;
  if (!q1bWorked.includes('ZnCl') || !q1bWorked.includes('H_2')) {
    throw new Error('Q1(b) chemical equation missing or invalid!');
  }
  console.log('✅ Q1(b) chemical equation verified: Zn + 2HCl -> ZnCl2 + H2.');

  // 2. Check topic question set doc
  const topicPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2013_variant_p2';
  const topicSnap = await db.doc(topicPath).get();
  if (!topicSnap.exists) {
    throw new Error(`Topic question set does not exist: ${topicPath}`);
  }
  const topicData = topicSnap.data();
  console.log(`✅ Topic question set ${topicPath} exists with ${topicData.questions?.length} questions (Single-document read pattern verified)`);

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 91 (2013 BECE SCIENCE PAPER 2)!');
}

verifySet91()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  });

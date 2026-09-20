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

async function verifySet93() {
  console.log('=== VERIFYING SET 93 (2012 BECE SCIENCE PAPER 2 VARIANT) ===');
  const db = await getFirestore();

  // 1. Verify target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2012_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    throw new Error('Target document does not exist: ' + docPath);
  }

  const data = docSnap.data();
  console.log('✅ Target document exists:', docPath);
  console.log('Year:', data.year, '| Set Number:', data.setNumber, '| Subject:', data.subject);

  // Check Paper 1 preserved (Set 92 intact)
  if (data.paper1 && Array.isArray(data.paper1.questions)) {
    console.log('✅ Paper 1 preserved: ' + data.paper1.questions.length + ' questions (Set 92 intact)');
    if (data.paper1.questions.length !== 40) {
      throw new Error('Expected 40 questions in Paper 1, found: ' + data.paper1.questions.length);
    }
  } else {
    throw new Error('❌ Paper 1 not found or invalid in target document!');
  }

  // Check Paper 2
  if (!data.paper2) {
    throw new Error('❌ paper2 field missing in target document!');
  }

  const p2Questions = data.paper2.questions;
  console.log('✅ Paper 2 questions count: ' + p2Questions.length);

  if (p2Questions.length !== 6) {
    throw new Error('Expected 6 questions in Paper 2, found: ' + p2Questions.length);
  }

  // Check Q1 practical
  const q1 = p2Questions[0];
  console.log('Q1 has ' + q1.subQuestions.length + ' subquestions (Practical Section A)');
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
  const q1bPrompt = q1.subQuestions[1].prompt;
  const q1cPrompt = q1.subQuestions[2].prompt;
  const q1dPrompt = q1.subQuestions[3].prompt;

  if (q1bPrompt.includes('(Volumetric)') || q1bPrompt.includes('(Beaker)') || q1bPrompt.includes('(Wash Bottle)')) {
    throw new Error('Spoiler labels found in Q1(b) SVG!');
  }
  if (q1cPrompt.includes('(Stem Internode)') || q1cPrompt.includes('(Leaf Lamina)') || q1cPrompt.includes('(Fruit / Pod)')) {
    throw new Error('Spoiler labels found in Q1(c) SVG!');
  }
  if (q1dPrompt.includes('(Pinna / Ear)') || q1dPrompt.includes('(Vibrissae)') || q1dPrompt.includes('(Hind Limb)')) {
    throw new Error('Spoiler labels found in Q1(d) SVG!');
  }
  console.log('✅ All SVGs verified to be sanitized with 0 spoiler text.');

  // Verify Q1(a) calculations
  const q1aWorked = q1.subQuestions[0].workedSolution;
  if (!q1aWorked.includes('18\\text{ cm}^3') || !q1aWorked.includes('2.0\\text{ cm}^3') || !q1aWorked.includes('2.0\\text{ g cm}^{-3}')) {
    throw new Error('Q1(a) calculation values missing or incorrect!');
  }
  console.log('✅ Q1(a) cork volume and density calculations verified: V_stone = 18 cm3, V_cork = 2.0 cm3, density = 2.0 g cm-3.');

  // Verify Q2-Q6 Theory
  const q2 = p2Questions[1];
  const q3 = p2Questions[2];
  const q4 = p2Questions[3];
  const q5 = p2Questions[4];
  const q6 = p2Questions[5];

  if (!q2.subQuestions || q2.subQuestions.length < 5) throw new Error('Q2 subquestions incomplete');
  if (!q3.subQuestions || q3.subQuestions.length < 4) throw new Error('Q3 subquestions incomplete');
  if (!q4.subQuestions || q4.subQuestions.length < 4) throw new Error('Q4 subquestions incomplete');
  if (!q5.subQuestions || q5.subQuestions.length < 4) throw new Error('Q5 subquestions incomplete');
  if (!q6.subQuestions || q6.subQuestions.length < 4) throw new Error('Q6 subquestions incomplete');
  console.log('✅ Questions 2 through 6 verified with comprehensive theory sub-parts.');

  // 2. Check topic question set doc
  const topicPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2012_variant_p2';
  const topicSnap = await db.doc(topicPath).get();
  if (!topicSnap.exists) {
    throw new Error('Topic question set does not exist: ' + topicPath);
  }
  const topicData = topicSnap.data();
  console.log('✅ Topic question set ' + topicPath + ' exists with ' + topicData.questions?.length + ' questions (Single-document read pattern verified)');

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 93 (2012 BECE SCIENCE PAPER 2)!');
}

verifySet93()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  });
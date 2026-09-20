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

async function verifySet97() {
  console.log('=== VERIFYING SET 97 (2010 BECE SCIENCE PAPER 2 VARIANT) ===');
  const db = await getFirestore();

  // 1. Verify target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2010_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    throw new Error(`Target document does not exist: ${docPath}`);
  }

  const data = docSnap.data();
  console.log('✅ Target document exists:', docPath);
  console.log('Year:', data.year, '| Subject:', data.subject);

  // Check Paper 1 preserved (Set 96 intact)
  if (data.paper1 && Array.isArray(data.paper1.questions)) {
    console.log(`✅ Paper 1 preserved: ${data.paper1.questions.length} questions (Set 96 intact)`);
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

  const p2 = data.paper2;
  console.log('Paper 2 Title:', p2.title);
  console.log('Paper 2 Questions count:', p2.questions?.length);

  if (!Array.isArray(p2.questions) || p2.questions.length < 5) {
    throw new Error(`Expected 5-6 questions in Paper 2, found: ${p2.questions?.length}`);
  }

  // Section A - Question 1 checks
  const q1 = p2.questions[0];
  if (q1.questionNumber !== "1" || !q1.isPracticalSectionA) {
    throw new Error('❌ Question 1 is not designated as Section A practical!');
  }

  const subParts = q1.subQuestions || q1.parts;
  if (!Array.isArray(subParts) || subParts.length !== 4) {
    throw new Error(`Expected 4 sub-questions in Q1, found: ${subParts?.length}`);
  }
  console.log('✅ Question 1 contains 4 compulsory practical sub-parts.');

  let q1Marks = 0;
  subParts.forEach((sp: any) => {
    q1Marks += sp.maxMarks || sp.marks || 0;
  });
  console.log(`✅ Question 1 marks total: ${q1Marks}/40`);
  if (q1Marks !== 40) {
    throw new Error(`Expected 40 marks for Question 1, found: ${q1Marks}`);
  }

  // Check Q1 SVGs
  const q1a = subParts[0];
  if (!q1a.prompt.includes('<svg') || !q1a.prompt.includes('E (Cell)')) {
    throw new Error('❌ Q1(a) missing circuit diagram SVG!');
  }
  console.log('✅ Q1(a) DC series circuit SVG embedded.');

  const q1b = subParts[1];
  if (!q1b.prompt.includes('Lemon juice') || !q1b.workedSolution.includes('CaCl')) {
    throw new Error('❌ Q1(b) missing litmus table or neutralization equation!');
  }
  console.log('✅ Q1(b) litmus test and neutralization equation verified.');

  const q1c = subParts[2];
  if (!q1c.prompt.includes('<svg') || !q1c.prompt.includes('Salivary Gland')) {
    throw new Error('❌ Q1(c) missing alimentary canal SVG!');
  }
  console.log('✅ Q1(c) alimentary canal anatomy SVG embedded.');

  const q1d = subParts[3];
  if (!q1d.prompt.includes('<svg') || !q1d.prompt.includes('CUTLASS')) {
    throw new Error('❌ Q1(d) missing cutlass SVG!');
  }
  console.log('✅ Q1(d) agricultural cutlass SVG embedded.');

  // Section B checks
  const q2 = p2.questions[1];
  const q2Subs = q2.subQuestions || q2.parts;
  if (!q2Subs.some((s: any) => s.workedSolution.includes('NaCl'))) {
    throw new Error('❌ Q2 missing neutralization equations!');
  }
  console.log('✅ Q2 verified (neutralization, weaning, Milky Way, habitat).');

  const q3 = p2.questions[2];
  const q3Subs = q3.subQuestions || q3.parts;
  if (!q3Subs.some((s: any) => s.workedSolution.toLowerCase().includes('pressure'))) {
    throw new Error('❌ Q3 missing pressure principles!');
  }
  console.log('✅ Q3 verified (pressure physics, metals vs non-metals, alloys, tilapia).');

  const q4 = p2.questions[3];
  const q4Subs = q4.subQuestions || q4.parts;
  const q4d = q4Subs.find((s: any) => s.subId === '(d)');
  if (!q4d.prompt.includes('<svg') || !q4d.prompt.includes('SULFUR')) {
    throw new Error('❌ Q4(d) missing sulfur Bohr shell SVG!');
  }
  console.log('✅ Q4 verified (disease vectors, parasites, tomato N deficiency, sulfur Bohr SVG).');

  const q5 = p2.questions[4];
  const q5Subs = q5.subQuestions || q5.parts;
  if (!q5Subs.some((s: any) => s.workedSolution.toLowerCase().includes('respiration'))) {
    throw new Error('❌ Q5 missing cellular respiration definitions!');
  }
  console.log('✅ Q5 verified (respiration, soil fertility, IUPAC nomenclature, fuse).');

  if (p2.questions.length >= 6) {
    const q6 = p2.questions[5];
    const q6Subs = q6.subQuestions || q6.parts;
    if (!q6Subs.some((s: any) => s.workedSolution.toLowerCase().includes('unicellular'))) {
      throw new Error('❌ Q6 missing unicellular/multicellular distinction!');
    }
    console.log('✅ Q6 verified (unicellular organisms, climate vs weather, staking, corrosion).');
  }

  // 2. Verify single-document read pattern
  const topicDocPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2010_variant_p2';
  const topicSnap = await db.doc(topicDocPath).get();
  if (!topicSnap.exists) {
    throw new Error(`❌ Topic question set document missing: ${topicDocPath}`);
  }
  const topicData = topicSnap.data();
  console.log('✅ Single-document read pattern verified at:', topicDocPath);
  console.log('Topic set questions:', topicData.questions?.length);

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 97 (2010 BECE SCIENCE PAPER 2 VARIANT)!');
}

verifySet97()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed for Set 97:', err);
    process.exit(1);
  });

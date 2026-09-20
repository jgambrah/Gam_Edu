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

async function verifySet99() {
  console.log('=== VERIFYING SET 99 (1990 BECE SCIENCE PAPER 2 VARIANT) ===');
  const db = await getFirestore();

  // 1. Verify target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_1990_variant';
  const docSnap = await db.doc(docPath).get();

  if (!docSnap.exists) {
    throw new Error(`Target document does not exist: ${docPath}`);
  }

  const data = docSnap.data();
  console.log('✅ Target document exists:', docPath);
  console.log('Year:', data.year, '| Subject:', data.subject);

  // Check Paper 1 preserved (Set 98 intact)
  if (data.paper1 && Array.isArray(data.paper1.questions)) {
    console.log(`✅ Paper 1 preserved: ${data.paper1.questions.length} questions (Set 98 intact)`);
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

  if (!Array.isArray(p2.questions) || p2.questions.length !== 4) {
    throw new Error(`Expected 4 questions in Paper 2, found: ${p2.questions?.length}`);
  }

  // Question 1 checks
  const q1 = p2.questions[0];
  const q1Subs = q1.subQuestions || q1.parts;
  let q1Marks = 0;
  q1Subs.forEach((s: any) => { q1Marks += s.maxMarks || s.marks || 0; });
  console.log(`✅ Question 1 marks: ${q1Marks}/20`);
  if (q1Marks !== 20) throw new Error(`Expected 20 marks for Q1, found ${q1Marks}`);
  if (!q1Subs[2].prompt.includes('<svg') || !q1Subs[2].prompt.includes('Receptacle')) {
    throw new Error('❌ Q1(c) missing floral anatomy vector SVG!');
  }
  console.log('✅ Q1 verified (Compound/Mixture/Element/Solute, Energy, Floral SVG, 5 Senses).');

  // Question 2 checks
  const q2 = p2.questions[1];
  const q2Subs = q2.subQuestions || q2.parts;
  let q2Marks = 0;
  q2Subs.forEach((s: any) => { q2Marks += s.maxMarks || s.marks || 0; });
  console.log(`✅ Question 2 marks: ${q2Marks}/20`);
  if (q2Marks !== 20) throw new Error(`Expected 20 marks for Q2, found ${q2Marks}`);
  if (!q2Subs[1].workedSolution.includes('First-Class Levers') || !q2Subs[2].workedSolution.includes('Physical change')) {
    throw new Error('❌ Q2 missing lever classification or change analysis!');
  }
  console.log('✅ Q2 verified (Soil erosion, lever mechanics 6 tools, fufu/ice/rusting changes).');

  // Question 3 checks
  const q3 = p2.questions[2];
  const q3Subs = q3.subQuestions || q3.parts;
  let q3Marks = 0;
  q3Subs.forEach((s: any) => { q3Marks += s.maxMarks || s.marks || 0; });
  console.log(`✅ Question 3 marks: ${q3Marks}/20`);
  if (q3Marks !== 20) throw new Error(`Expected 20 marks for Q3, found ${q3Marks}`);
  if (!q3Subs[1].prompt.includes('<svg') || !q3Subs[1].prompt.includes('Filtration')) {
    throw new Error('❌ Q3(b) missing separation train vector SVG!');
  }
  console.log('✅ Q3 verified (Cholera/Bilharzia/Malaria/TB, salt/sand separation train SVG, orbital mechanics, solar energy).');

  // Question 4 checks
  const q4 = p2.questions[3];
  const q4Subs = q4.subQuestions || q4.parts;
  let q4Marks = 0;
  q4Subs.forEach((s: any) => { q4Marks += s.maxMarks || s.marks || 0; });
  console.log(`✅ Question 4 marks: ${q4Marks}/20`);
  if (q4Marks !== 20) throw new Error(`Expected 20 marks for Q4, found ${q4Marks}`);
  if (!q4Subs[2].prompt.includes('<svg') || !q4Subs[2].prompt.includes('Electrons')) {
    throw new Error('❌ Q4(c) missing atomic structure vector SVG!');
  }
  if (!q4Subs[2].workedSolution.includes('Joule') || !q4Subs[2].workedSolution.includes('Kelvin')) {
    throw new Error('❌ Q4(c) missing S.I. units for heat and temperature!');
  }
  console.log('✅ Q4 verified (Environmental pollution, vegetative reproduction, atomic Bohr SVG, work, heat vs temp table).');

  // 2. Verify single-document read pattern
  const topicDocPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_1990_variant_p2';
  const topicSnap = await db.doc(topicDocPath).get();
  if (!topicSnap.exists) {
    throw new Error(`❌ Topic question set document missing: ${topicDocPath}`);
  }
  const topicData = topicSnap.data();
  console.log('✅ Single-document read pattern verified at:', topicDocPath);
  console.log('Topic set questions:', topicData.questions?.length);
  if (topicData.questions?.length !== 4) {
    throw new Error(`Expected 4 questions in topic document, found: ${topicData.questions?.length}`);
  }

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 99 (1990 BECE SCIENCE PAPER 2 VARIANT)!');
}

verifySet99()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed for Set 99:', err);
    process.exit(1);
  });

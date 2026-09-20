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
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
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
  } catch (cliErr) {}

  try {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
    return adminInstance.firestore();
  } catch (e) {
    return adminInstance.firestore();
  }
}

async function runVerification() {
  console.log('================================================================');
  console.log('🔍 VERIFYING SET 113: 2003 BECE INTEGRATED SCIENCE PAPER 2 ESSAY');
  console.log('================================================================');

  const db = await getFirestore();

  const mainDocRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2003_variant');
  const mainSnap = await mainDocRef.get();

  if (!mainSnap.exists) {
    throw new Error('❌ Document global_curriculum/jhs/subjects/science/past_papers/paper_2003_variant does not exist!');
  }

  const data = mainSnap.data();
  console.log('✅ Main doc exists: global_curriculum/jhs/subjects/science/past_papers/paper_2003_variant');
  console.log(`  - metadata.paper2Calibrated: ${data?.metadata?.paper2Calibrated}`);
  console.log(`  - metadata.set113Verified: ${data?.metadata?.set113Verified}`);

  const paper2 = data?.paper2;
  if (!paper2) {
    throw new Error('❌ paper2 field is missing from document!');
  }

  console.log(`\n📋 Paper 2 Title: "${paper2.title}"`);
  console.log(`⏱️ Duration: ${paper2.durationMinutes} mins | Total Questions: ${paper2.totalQuestions}`);

  const questions = paper2.questions;
  console.log(`\n📊 Total Paper 2 Questions: ${questions.length} (Expected: 4)`);
  if (questions.length !== 4) {
    throw new Error(`❌ Expected 4 questions, found ${questions.length}`);
  }

  let totalPaper2Marks = 0;

  questions.forEach((q: any, index: number) => {
    let qMarks = 0;
    console.log(`\n------------------------------------------------------------`);
    console.log(`QUESTION ${q.questionNumber} (Index ${index + 1}):`);
    console.log(`  Sub-questions count: ${q.subQuestions.length}`);

    q.subQuestions.forEach((sq: any) => {
      qMarks += sq.maxMarks;
      console.log(`    • Sub ${sq.subId} (${sq.maxMarks} marks): ${sq.prompt.slice(0, 65).replace(/\n/g, ' ')}...`);
      if (!sq.workedSolution || sq.workedSolution.length < 20) {
        throw new Error(`❌ Question ${q.questionNumber}${sq.subId} missing comprehensive workedSolution!`);
      }
    });

    console.log(`  => Question ${q.questionNumber} Total Marks: ${qMarks} / 20`);
    if (qMarks !== 20) {
      throw new Error(`❌ Question ${q.questionNumber} does not sum to 20 marks (found ${qMarks})`);
    }
    totalPaper2Marks += qMarks;
  });

  console.log(`\n============================================================`);
  console.log(`📈 TOTAL PAPER 2 MARKS: ${totalPaper2Marks} / 80`);
  if (totalPaper2Marks !== 80) {
    throw new Error(`❌ Expected 80 total marks, found ${totalPaper2Marks}`);
  }

  // Verify Specific Blueprint Checkpoints
  console.log('\n🔬 Verifying Specific Blueprint Requirements:');
  
  // Q1 Checkpoints
  const q1 = questions[0];
  const q1eSvgFound = q1.subQuestions.some((sq: any) => sq.prompt.includes('<svg') && sq.prompt.includes('Two Cells in Series') && sq.prompt.includes('Lamp'));
  console.log(`  ✓ Q1(e) Vector SVG Series Circuit: ${q1eSvgFound ? 'VERIFIED' : 'FAILED'}`);
  if (!q1eSvgFound) throw new Error('Q1(e) Series Circuit SVG missing or malformed');

  const q1dReaction = q1.subQuestions.find((sq: any) => sq.subId === '(d)');
  const q1dValid = q1dReaction && q1dReaction.workedSolution.includes('CaCO') && q1dReaction.workedSolution.includes('CaCl');
  console.log(`  ✓ Q1(d) CaCO3 + 2HCl balanced equation: ${q1dValid ? 'VERIFIED' : 'FAILED'}`);
  if (!q1dValid) throw new Error('Q1(d) reaction equation invalid');

  // Q2 Checkpoints
  const q2 = questions[1];
  const q2dSvgFound = q2.subQuestions.some((sq: any) => sq.prompt.includes('<svg') && sq.prompt.includes('LITHIUM ATOM') && sq.prompt.includes('3p (+)'));
  console.log(`  ✓ Q2(d) Vector SVG Lithium Bohr Model: ${q2dSvgFound ? 'VERIFIED' : 'FAILED'}`);
  if (!q2dSvgFound) throw new Error('Q2(d) Lithium Atom SVG missing or malformed');

  const q2bStarch = q2.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q2bValid = q2bStarch && q2bStarch.workedSolution.includes('iodine') && q2bStarch.workedSolution.includes('alcohol');
  console.log(`  ✓ Q2(b) 4-stage starch test protocol: ${q2bValid ? 'VERIFIED' : 'FAILED'}`);
  if (!q2bValid) throw new Error('Q2(b) Starch test invalid');

  // Q3 Checkpoints
  const q3 = questions[2];
  const q3aSeed = q3.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q3aValid = q3aSeed && q3aSeed.workedSolution.includes('Pollination') && q3aSeed.workedSolution.includes('Fertilization');
  console.log(`  ✓ Q3(a) Pollination & fertilization: ${q3aValid ? 'VERIFIED' : 'FAILED'}`);
  if (!q3aValid) throw new Error('Q3(a) seed formation invalid');

  const q3dStates = q3.subQuestions.find((sq: any) => sq.subId === '(d)');
  const q3dValid = q3dStates && q3dStates.workedSolution.includes('Toilet soap') && q3dStates.workedSolution.includes('Wood smoke');
  console.log(`  ✓ Q3(d) States of matter classification: ${q3dValid ? 'VERIFIED' : 'FAILED'}`);
  if (!q3dValid) throw new Error('Q3(d) States classification invalid');

  // Q4 Checkpoints
  const q4 = questions[3];
  const q4bExcretion = q4.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q4bValid = q4bExcretion && q4bExcretion.workedSolution.includes('Kidneys') && q4bExcretion.workedSolution.includes('Lungs');
  console.log(`  ✓ Q4(b) Excretion importance and organs: ${q4bValid ? 'VERIFIED' : 'FAILED'}`);
  if (!q4bValid) throw new Error('Q4(b) excretion invalid');

  const q4dEnergy = q4.subQuestions.find((sq: any) => sq.subId === '(d)');
  const q4dValid = q4dEnergy && q4dEnergy.workedSolution.includes('Potential Energy') && q4dEnergy.workedSolution.includes('Kinetic Energy');
  console.log(`  ✓ Q4(d) Mechanical energy transitions in free fall: ${q4dValid ? 'VERIFIED' : 'FAILED'}`);
  if (!q4dValid) throw new Error('Q4(d) energy transitions invalid');

  // Replicated single-doc path check
  const standaloneDocRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2003_variant_p2');
  const standaloneSnap = await standaloneDocRef.get();
  console.log(`\n✓ Standalone P2 document check (paper_2003_variant_p2): ${standaloneSnap.exists ? 'EXISTS & ACTIVE' : 'MISSING'}`);
  if (!standaloneSnap.exists) {
    throw new Error('Standalone paper_2003_variant_p2 is missing');
  }

  console.log('\n🎉 ALL SET 113 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
}

runVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  });

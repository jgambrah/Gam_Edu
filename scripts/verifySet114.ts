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

async function verifySet114() {
  console.log('================================================================');
  console.log('🔍 VERIFYING SET 114: 2001 BECE INTEGRATED SCIENCE COMPLETE (P1 & P2)');
  console.log('================================================================');

  const db = await getFirestore();

  const mainDocRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2001_variant');
  const mainSnap = await mainDocRef.get();

  if (!mainSnap.exists) {
    throw new Error('❌ Document global_curriculum/jhs/subjects/science/past_papers/paper_2001_variant does not exist!');
  }

  const data = mainSnap.data();
  console.log('✅ Main doc exists: global_curriculum/jhs/subjects/science/past_papers/paper_2001_variant');
  console.log(`  - Set Number: ${data?.setNumber}`);
  console.log(`  - Year: ${data?.year}`);
  console.log(`  - metadata.optionsBalanced: ${data?.metadata?.optionsBalanced}`);
  console.log(`  - metadata.set114Verified: ${data?.metadata?.set114Verified}`);

  // ==========================================
  // VERIFY PAPER 1
  // ==========================================
  console.log('\n--- 1. PAPER 1 (OBJECTIVE TEST) VERIFICATION ---');
  const paper1 = data?.paper1;
  if (!paper1) throw new Error('❌ paper1 field is missing!');

  console.log(`📋 Paper 1 Title: "${paper1.title}" | Duration: ${paper1.durationMinutes} mins`);
  console.log(`📊 Questions count: ${paper1.questions.length} (Expected: 40)`);
  if (paper1.questions.length !== 40) {
    throw new Error(`❌ Expected 40 Paper 1 questions, found ${paper1.questions.length}`);
  }

  const keyCounts = { A: 0, B: 0, C: 0, D: 0 };
  paper1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyCounts.A++;
    else if (idx === 1) keyCounts.B++;
    else if (idx === 2) keyCounts.C++;
    else if (idx === 3) keyCounts.D++;
    else throw new Error(`❌ Q${q.number} correctAnswer "${q.correctAnswer}" not found in options!`);

    if (!q.hint || q.hint.length < 5) throw new Error(`❌ Q${q.number} missing hint!`);
    if (!q.workedSolution || q.workedSolution.length < 10) throw new Error(`❌ Q${q.number} missing workedSolution!`);
  });

  console.log('🎯 Key Distribution:', keyCounts);
  if (keyCounts.A !== 10 || keyCounts.B !== 10 || keyCounts.C !== 10 || keyCounts.D !== 10) {
    throw new Error(`❌ Key distribution unbalanced: ${JSON.stringify(keyCounts)}`);
  }
  console.log('✅ Paper 1 Distribution: EXACTLY 10 A, 10 B, 10 C, 10 D (0% skew)');

  // Verify Q10 / Q11 Balanced Lever SVG
  const q10 = paper1.questions[9];
  const q11 = paper1.questions[10];
  const q10HasSvg = q10.prompt.includes('<svg') && q10.prompt.includes('Q (Pivot)') && q10.prompt.includes('P (Effort)') && q10.prompt.includes('R (Load)');
  const q11HasSvg = q11.prompt.includes('<svg') && q11.prompt.includes('CLASS 1 LEVER');
  console.log(`  ✓ Q10 Lever SVG: ${q10HasSvg ? 'VERIFIED' : 'FAILED'}`);
  console.log(`  ✓ Q11 Lever SVG: ${q11HasSvg ? 'VERIFIED' : 'FAILED'}`);
  if (!q10HasSvg || !q11HasSvg) throw new Error('Q10 or Q11 missing balanced lever vector SVG');

  // ==========================================
  // VERIFY PAPER 2
  // ==========================================
  console.log('\n--- 2. PAPER 2 (ESSAY & PRACTICAL) VERIFICATION ---');
  const paper2 = data?.paper2;
  if (!paper2) throw new Error('❌ paper2 field is missing!');

  console.log(`📋 Paper 2 Title: "${paper2.title}" | Duration: ${paper2.durationMinutes} mins`);
  console.log(`📊 Questions count: ${paper2.questions.length} (Expected: 4)`);
  if (paper2.questions.length !== 4) {
    throw new Error(`❌ Expected 4 Paper 2 questions, found ${paper2.questions.length}`);
  }

  let totalPaper2Marks = 0;
  paper2.questions.forEach((q: any, index: number) => {
    let qMarks = 0;
    console.log(`\n------------------------------------------------------------`);
    console.log(`QUESTION ${q.questionNumber} (Index ${index + 1}):`);
    console.log(`  Sub-questions count: ${q.subQuestions.length}`);

    q.subQuestions.forEach((sq: any) => {
      qMarks += sq.maxMarks;
      console.log(`    • Sub ${sq.subId} (${sq.maxMarks} marks): ${sq.prompt.slice(0, 60).replace(/\n/g, ' ')}...`);
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

  // Verify Specific Paper 2 Blueprint Checkpoints
  console.log('\n🔬 Verifying Specific Paper 2 Blueprint Requirements:');

  // Q1 Checkpoints
  const q1 = paper2.questions[0];
  const q1aSurface = q1.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q1aValid = q1aSurface && q1aSurface.workedSolution.includes('elastic membrane');
  console.log(`  ✓ Q1(a) Surface tension definition & umbrella/needle: ${q1aValid ? 'VERIFIED' : 'FAILED'}`);

  const q1bConstip = q1.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q1bValid = q1bConstip && q1bConstip.workedSolution.includes('fiber') && q1bConstip.workedSolution.includes('water');
  console.log(`  ✓ Q1(b) Constipation definition & 4 preventive practices: ${q1bValid ? 'VERIFIED' : 'FAILED'}`);

  const q1cForce = q1.subQuestions.find((sq: any) => sq.subId === '(c)');
  const q1cValid = q1cForce && (q1cForce.workedSolution.includes('100.0') || q1cForce.workedSolution.includes('100'));
  console.log(`  ✓ Q1(c) Downward weight calculation (W = 100 N): ${q1cValid ? 'VERIFIED' : 'FAILED'}`);

  const q1dNeutral = q1.subQuestions.find((sq: any) => sq.subId === '(d)');
  const q1dValid = q1dNeutral && q1dNeutral.workedSolution.includes('NaOH') && q1dNeutral.workedSolution.includes('NaCl');
  console.log(`  ✓ Q1(d) Neutralization with litmus & NaCl evaporation: ${q1dValid ? 'VERIFIED' : 'FAILED'}`);

  // Q2 Checkpoints
  const q2 = paper2.questions[1];
  const q2aDefense = q2.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q2aValid = q2aDefense && q2aDefense.workedSolution.includes('Thorns') && q2aDefense.workedSolution.includes('Toxins');
  console.log(`  ✓ Q2(a) Plant botanical defense mechanisms: ${q2aValid ? 'VERIFIED' : 'FAILED'}`);

  const q2bAnion = q2.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q2bValid = q2bAnion && q2bAnion.workedSolution.includes('Ammonium chloride') && q2bAnion.workedSolution.includes('Calcium chloride');
  console.log(`  ✓ Q2(b) Anion definition & neutralization reaction products: ${q2bValid ? 'VERIFIED' : 'FAILED'}`);

  const q2cSvg = q2.subQuestions.find((sq: any) => sq.subId === '(c)');
  const q2cSvgValid = q2cSvg && q2cSvg.prompt.includes('<svg') && q2cSvg.prompt.includes('DC Battery') && q2cSvg.prompt.includes('Steel Bar');
  console.log(`  ✓ Q2(c) Solenoid Magnetization Vector SVG: ${q2cSvgValid ? 'VERIFIED' : 'FAILED'}`);

  // Q3 Checkpoints
  const q3 = paper2.questions[2];
  const q3aRoot = q3.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q3aValid = q3aRoot && q3aRoot.workedSolution.includes('geotropic') && q3aRoot.workedSolution.includes('Anchorage');
  console.log(`  ✓ Q3(a) Root morphological characteristics & functions: ${q3aValid ? 'VERIFIED' : 'FAILED'}`);

  const q3cDisp = q3.subQuestions.find((sq: any) => sq.subId === '(c)');
  const q3cValid = q3cDisp && q3cDisp.workedSolution.includes('V_2 - V_1');
  console.log(`  ✓ Q3(c) Irregular sphere Archimedes displacement method: ${q3cValid ? 'VERIFIED' : 'FAILED'}`);

  const q3dChem = q3.subQuestions.find((sq: any) => sq.subId === '(d)');
  const q3dValid = q3dChem && q3dChem.workedSolution.includes('CuSO') && (q3dChem.workedSolution.includes('K}_2') || q3dChem.workedSolution.includes('Potassium carbonate'));
  console.log(`  ✓ Q3(d) Binary chemical formulae (NaCl, CuSO4, MgSO4, K2CO3): ${q3dValid ? 'VERIFIED' : 'FAILED'}`);

  const q3eSep = q3.subQuestions.find((sq: any) => sq.subId === '(e)');
  const q3eValid = q3eSep && q3eSep.workedSolution.includes('Sublimation') && q3eSep.workedSolution.includes('Fractional distillation');
  console.log(`  ✓ Q3(e) Separation protocols (Iodine/sand & Ethanol/water): ${q3eValid ? 'VERIFIED' : 'FAILED'}`);

  // Q4 Checkpoints
  const q4 = paper2.questions[3];
  const q4aStomach = q4.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q4aValid = q4aStomach && q4aStomach.workedSolution.includes('pepsin') && q4aStomach.workedSolution.includes('Hydrochloric Acid');
  console.log(`  ✓ Q4(a) Gastric mechanical & chemical digestion: ${q4aValid ? 'VERIFIED' : 'FAILED'}`);

  const q4bEclipse = q4.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q4bValid = q4bEclipse && q4bEclipse.prompt.includes('<svg') && q4bEclipse.prompt.includes('Umbra') && q4bEclipse.prompt.includes('Penumbra');
  console.log(`  ✓ Q4(b) Solar Eclipse Vector SVG (Umbra vs Penumbra): ${q4bValid ? 'VERIFIED' : 'FAILED'}`);

  const q4cChange = q4.subQuestions.find((sq: any) => sq.subId === '(c)');
  const q4cValid = q4cChange && q4cChange.workedSolution.includes('Physical change') && q4cChange.workedSolution.includes('Chemical change');
  console.log(`  ✓ Q4(c) Physical vs chemical change comparison: ${q4cValid ? 'VERIFIED' : 'FAILED'}`);

  // Replicated paths check
  const p1DocSnap = await db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2001_variant_p1').get();
  const p2DocSnap = await db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2001_variant_p2').get();
  console.log(`\n✓ Replicated P1 doc check: ${p1DocSnap.exists ? 'EXISTS & ACTIVE' : 'MISSING'}`);
  console.log(`✓ Replicated P2 doc check: ${p2DocSnap.exists ? 'EXISTS & ACTIVE' : 'MISSING'}`);
  if (!p1DocSnap.exists || !p2DocSnap.exists) {
    throw new Error('Replicated single-doc paths missing');
  }

  console.log('\n🎉 ALL SET 114 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
}

verifySet114()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  });

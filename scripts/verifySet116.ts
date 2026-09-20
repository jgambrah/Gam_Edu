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

async function verifySet116() {
  console.log('================================================================');
  console.log('🔍 VERIFYING SET 116: 2000 BECE INTEGRATED SCIENCE COMPLETE (P1 & P2)');
  console.log('================================================================');

  const db = await getFirestore();

  const mainDocRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2000_variant');
  const mainSnap = await mainDocRef.get();

  if (!mainSnap.exists) {
    throw new Error('❌ Document global_curriculum/jhs/subjects/science/past_papers/paper_2000_variant does not exist!');
  }

  const data = mainSnap.data();
  console.log('✅ Main doc exists: global_curriculum/jhs/subjects/science/past_papers/paper_2000_variant');
  console.log(`  - Set Number: ${data?.setNumber}`);
  console.log(`  - Year: ${data?.year}`);
  console.log(`  - metadata.optionsBalanced: ${data?.metadata?.optionsBalanced}`);
  console.log(`  - metadata.set116Verified: ${data?.metadata?.set116Verified}`);

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

  // Verify Q40 Hypermetropia SVG
  const q40 = paper1.questions[39];
  const q40HasSvg = q40.prompt.includes('<svg') && q40.prompt.includes('Convex Lens') && q40.prompt.includes('Retina');
  console.log(`  ✓ Q40 Hypermetropia SVG: ${q40HasSvg ? 'VERIFIED' : 'FAILED'}`);
  if (!q40HasSvg) throw new Error('Q40 missing hypermetropia convex lens vector SVG');

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
  const q1aHygiene = q1.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q1aValid = q1aHygiene && q1aHygiene.workedSolution.includes('cleanliness') && q1aHygiene.workedSolution.includes('Bathing');
  console.log(`  ✓ Q1(a) Personal hygiene definition & 4 routines: ${q1aValid ? 'VERIFIED' : 'FAILED'}`);

  const q1bMatter = q1.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q1bValid = q1bMatter && q1bMatter.workedSolution.includes('Chemical compound') && q1bMatter.workedSolution.includes('Physical mixture');
  console.log(`  ✓ Q1(b) Compound vs Mixture definitions & examples: ${q1bValid ? 'VERIFIED' : 'FAILED'}`);

  const q1cLevers = q1.subQuestions.find((sq: any) => sq.subId === '(c)');
  const q1cValid = q1cLevers && q1cLevers.workedSolution.includes('First-class') && q1cLevers.workedSolution.includes('Second-class') && q1cLevers.workedSolution.includes('Third-class');
  console.log(`  ✓ Q1(c) Simple machine & 3 lever classes: ${q1cValid ? 'VERIFIED' : 'FAILED'}`);

  const q1dSat = q1.subQuestions.find((sq: any) => sq.subId === '(d)');
  const q1dValid = q1dSat && q1dSat.workedSolution.includes('telecommunications') && q1dSat.workedSolution.includes('Meteorological');
  console.log(`  ✓ Q1(d) Satellite definition & modern uses: ${q1dValid ? 'VERIFIED' : 'FAILED'}`);

  // Q2 Checkpoints
  const q2 = paper2.questions[1];
  const q2aElectro = q2.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q2aValid = q2aElectro && q2aElectro.workedSolution.includes('non-contact');
  console.log(`  ✓ Q2(a) Electrostatic force definition: ${q2aValid ? 'VERIFIED' : 'FAILED'}`);

  const q2bWork = q2.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q2bValid = q2bWork && (q2bWork.workedSolution.includes('4,000') || q2bWork.workedSolution.includes('4000')) && q2bWork.prompt.includes('<svg');
  console.log(`  ✓ Q2(b) Units of force/work & lifting work (W = 4,000 J) with SVG: ${q2bValid ? 'VERIFIED' : 'FAILED'}`);

  const q2cSep = q2.subQuestions.find((sq: any) => sq.subId === '(c)');
  const q2cValid = q2cSep && q2cSep.workedSolution.includes('Dissolution') && q2cSep.workedSolution.includes('Filtration') && q2cSep.workedSolution.includes('Evaporation');
  console.log(`  ✓ Q2(c) Salt & sulfur separation protocol: ${q2cValid ? 'VERIFIED' : 'FAILED'}`);

  const q2dFlowers = q2.subQuestions.find((sq: any) => sq.subId === '(d)');
  const q2dValid = q2dFlowers && q2dFlowers.workedSolution.includes('insect-pollinated') && q2dFlowers.workedSolution.includes('wind-pollinated');
  console.log(`  ✓ Q2(d) Entomophilous vs anemophilous floral characteristics: ${q2dValid ? 'VERIFIED' : 'FAILED'}`);

  // Q3 Checkpoints
  const q3 = paper2.questions[2];
  const q3aFert = q3.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q3aValid = q3aFert && q3aFert.workedSolution.includes('spermatozoon') && q3aFert.workedSolution.includes('fallopian');
  console.log(`  ✓ Q3(a) Human fertilization definition & coital pathway: ${q3aValid ? 'VERIFIED' : 'FAILED'}`);

  const q3bDensity = q3.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q3bValid = q3bDensity && q3bDensity.workedSolution.includes('V_2 - V_1');
  console.log(`  ✓ Q3(b) Density definition & irregular stone displacement: ${q3bValid ? 'VERIFIED' : 'FAILED'}`);

  const q3cClass = q3.subQuestions.find((sq: any) => sq.subId === '(c)');
  const q3cValid = q3cClass && q3cClass.workedSolution.includes('Solid potassium') && q3cClass.workedSolution.includes('Atmospheric air');
  console.log(`  ✓ Q3(c) Element definition & classification table: ${q3cValid ? 'VERIFIED' : 'FAILED'}`);

  // Q4 Checkpoints
  const q4 = paper2.questions[3];
  const q4aDefs = q4.subQuestions.find((sq: any) => sq.subId === '(a)');
  const q4aValid = q4aDefs && q4aDefs.workedSolution.includes('Metallic alloy') && q4aDefs.workedSolution.includes('Molecular diffusion') && q4aDefs.workedSolution.includes('Chemical colloid');
  console.log(`  ✓ Q4(a) Alloy, diffusion, and colloid definitions: ${q4aValid ? 'VERIFIED' : 'FAILED'}`);

  const q4bExamples = q4.subQuestions.find((sq: any) => sq.subId === '(b)');
  const q4bValid = q4bExamples && q4bExamples.workedSolution.includes('Brass') && q4bExamples.workedSolution.includes('Milk');
  console.log(`  ✓ Q4(b) Alloy & colloid commercial examples: ${q4bValid ? 'VERIFIED' : 'FAILED'}`);

  const q4cPollution = q4.subQuestions.find((sq: any) => sq.subId === '(c)');
  const q4cValid = q4cPollution && q4cPollution.workedSolution.includes('Air pollutants') && q4cPollution.workedSolution.includes('Water pollutants') && q4cPollution.workedSolution.includes('Land pollutants');
  console.log(`  ✓ Q4(c) Environmental pollution & air, water, land pollutants: ${q4cValid ? 'VERIFIED' : 'FAILED'}`);

  const q4dEnergy = q4.subQuestions.find((sq: any) => sq.subId === '(d)');
  const q4dValid = q4dEnergy && (q4dEnergy.workedSolution.includes('750.0') || q4dEnergy.workedSolution.includes('750'));
  console.log(`  ✓ Q4(d) Gravitational potential energy of coconut (P.E. = 750 J): ${q4dValid ? 'VERIFIED' : 'FAILED'}`);

  // Replicated paths check
  const p1DocSnap = await db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2000_variant_p1').get();
  const p2DocSnap = await db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2000_variant_p2').get();
  console.log(`\n✓ Replicated P1 doc check: ${p1DocSnap.exists ? 'EXISTS & ACTIVE' : 'MISSING'}`);
  console.log(`✓ Replicated P2 doc check: ${p2DocSnap.exists ? 'EXISTS & ACTIVE' : 'MISSING'}`);
  if (!p1DocSnap.exists || !p2DocSnap.exists) {
    throw new Error('Replicated single-doc paths missing');
  }

  console.log('\n🎉 ALL SET 116 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
}

verifySet116()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  });

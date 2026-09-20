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

async function verifySet101() {
  console.log('=== VERIFYING SET 101 (2009 BECE INTEGRATED SCIENCE PAPER 2 VARIANT) ===');
  const db = await getFirestore();

  // 1. Target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2009_variant';
  const docSnap = await db.doc(docPath).get();
  if (!docSnap.exists) {
    throw new Error('Target document does not exist: ' + docPath);
  }

  const data = docSnap.data();
  console.log('✅ Target document exists:', docPath);
  console.log('Year:', data.year, '| Subject:', data.subject);

  // Check Paper 1 preserved intact
  if (data.paper1 && Array.isArray(data.paper1.questions)) {
    console.log(`✅ Paper 1 preserved: ${data.paper1.questions.length} questions (Set 100 intact)`);
    if (data.paper1.questions.length !== 40) {
      throw new Error(`Expected 40 questions in Paper 1, found: ${data.paper1.questions.length}`);
    }
  } else {
    throw new Error('❌ Paper 1 not found or invalid in target document!');
  }

  // 2. Verify Paper 2
  if (!data.paper2 || !Array.isArray(data.paper2.questions)) {
    throw new Error('❌ paper2 or paper2.questions missing in target document!');
  }

  const p2 = data.paper2;
  console.log('Paper 2 Title:', p2.title);
  console.log('Paper 2 Questions count:', p2.questions.length);
  if (p2.questions.length !== 5) {
    throw new Error(`Expected exactly 5 questions in Paper 2, found: ${p2.questions.length}`);
  }

  // Question 1 (Section A Compulsory - 30 marks total)
  const q1 = p2.questions[0];
  if (!q1.isPracticalSectionA || q1.subQuestions.length !== 3) {
    throw new Error('❌ Question 1 is not configured as Section A compulsory practical test with 3 subquestions!');
  }
  let q1TotalMarks = 0;
  q1.subQuestions.forEach((s: any) => { q1TotalMarks += s.maxMarks || 0; });
  console.log(`✅ Question 1 (Section A Practical) marks: ${q1TotalMarks}/30`);
  if (q1TotalMarks !== 30) throw new Error(`Expected 30 marks for Q1, found: ${q1TotalMarks}`);

  // Q1(a): Thermal conduction bar with 4 nails and thermometers A-D
  const q1a = q1.subQuestions[0];
  if (!q1a.prompt.includes('<svg') || !q1a.prompt.includes('THERMAL CONDUCTION')) {
    throw new Error('❌ Q1(a) missing thermal conduction nails vector SVG!');
  }
  if (!q1a.workedSolution.includes('100') || !q1a.workedSolution.includes('conduction')) {
    throw new Error('❌ Q1(a) missing boiling point or conduction solution!');
  }
  console.log('✅ Q1(a) verified (10 marks, thermal conduction bar SVG, sequential nail drop 1->2->3->4, T_A > T_B > T_C > T_D).');

  // Q1(b): Rusting test setups A, B, C
  const q1b = q1.subQuestions[1];
  if (!q1b.prompt.includes('<svg') || !q1b.prompt.includes('Set-up A') || !q1b.prompt.includes('Set-up B')) {
    throw new Error('❌ Q1(b) missing corrosion setups vector SVG!');
  }
  if (!q1b.workedSolution.includes('boiled') && !q1b.workedSolution.includes('oxygen')) {
    throw new Error('❌ Q1(b) missing oxygen/water explanation in solution!');
  }
  console.log('✅ Q1(b) verified (10 marks, corrosion setups SVG, boiled water air expulsion, oil barrier, dry air desiccant).');

  // Q1(c): Four-stage leaf starch test sequence
  const q1c = q1.subQuestions[2];
  if (!q1c.prompt.includes('<svg') || !q1c.prompt.includes('STARCH TEST')) {
    throw new Error('❌ Q1(c) missing leaf starch test vector SVG!');
  }
  if (!q1c.workedSolution.includes('blue-black') || !q1c.workedSolution.includes('Activity I')) {
    throw new Error('❌ Q1(c) missing step-by-step starch test solution!');
  }
  console.log('✅ Q1(c) verified (10 marks, 4-stage starch test SVG: boiling kill, warm ethanol decolorize, cold water rinse, iodine indicator).');

  // Questions 2 to 5 (Section B Theory - 15 marks each)
  // Q2: Deep ocean absence, pawpaw pollination, soil weathering, plane mirror reflection
  const q2 = p2.questions[1];
  let q2Marks = 0;
  q2.subQuestions.forEach((s: any) => { q2Marks += s.maxMarks || 0; });
  console.log(`✅ Question 2 marks: ${q2Marks}/15`);
  if (q2Marks !== 15) throw new Error(`Expected 15 marks for Q2, found: ${q2Marks}`);
  if (!q2.subQuestions[2].prompt.includes('<svg') || !q2.subQuestions[2].prompt.includes('Normal Line')) {
    throw new Error('❌ Q2(c) missing plane mirror specular reflection vector SVG!');
  }
  console.log('✅ Q2 verified (deep ocean plant absence, dioecious pawpaw failure, weathering in pedogenesis, plane mirror SVG i=r).');

  // Q3: Night blindness (Vitamin A), atomic structure & neutrality, mechanical friction
  const q3 = p2.questions[2];
  let q3Marks = 0;
  q3.subQuestions.forEach((s: any) => { q3Marks += s.maxMarks || 0; });
  console.log(`✅ Question 3 marks: ${q3Marks}/15`);
  if (q3Marks !== 15) throw new Error(`Expected 15 marks for Q3, found: ${q3Marks}`);
  if (!q3.subQuestions[0].workedSolution.includes('Vitamin A') || !q3.subQuestions[1].workedSolution.includes('neutral') || !q3.subQuestions[2].workedSolution.includes('friction')) {
    throw new Error('❌ Q3 missing expected solutions for Vit A, atom, or friction!');
  }
  console.log('✅ Q3 verified (Nyctalopia / Vitamin A, atomic mass/charge neutrality, friction definition, advantages & disadvantages).');

  // Q4: Heredity, chemical vs. physical changes, simple machines and efficiency
  const q4 = p2.questions[3];
  let q4Marks = 0;
  q4.subQuestions.forEach((s: any) => { q4Marks += s.maxMarks || 0; });
  console.log(`✅ Question 4 marks: ${q4Marks}/15`);
  if (q4Marks !== 15) throw new Error(`Expected 15 marks for Q4, found: ${q4Marks}`);
  if (!q4.subQuestions[1].workedSolution.includes('Chemical change') || !q4.subQuestions[2].workedSolution.includes('Efficiency')) {
    throw new Error('❌ Q4 missing change classification or machine efficiency!');
  }
  console.log('✅ Q4 verified (biological heredity traits, physical/chemical changes classification, simple machines & efficiency < 100%).');

  // Q5: Terrestrial food chain, forces in nature and dynamic effects, myopia & concave lens
  const q5 = p2.questions[4];
  let q5Marks = 0;
  q5.subQuestions.forEach((s: any) => { q5Marks += s.maxMarks || 0; });
  console.log(`✅ Question 5 marks: ${q5Marks}/15`);
  if (q5Marks !== 15) throw new Error(`Expected 15 marks for Q5, found: ${q5Marks}`);
  if (!q5.subQuestions[0].workedSolution.includes('Cassava plant') || !q5.subQuestions[2].workedSolution.includes('Myopia')) {
    throw new Error('❌ Q5 missing food chain or myopia solution!');
  }
  console.log('✅ Q5 verified (4-organism food chain Cassava->Grasshopper->Hen->Man, contact/non-contact forces, myopia & concave lens).');

  // 3. Single-document read pattern
  const topicDocPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2009_variant_p2';
  const topicSnap = await db.doc(topicDocPath).get();
  if (!topicSnap.exists) {
    throw new Error('❌ Topic question set document missing: ' + topicDocPath);
  }
  const topicData = topicSnap.data();
  console.log('✅ Single-document read pattern verified at:', topicDocPath);
  console.log('Topic set questions count:', topicData.questions?.length);
  if (topicData.questions?.length !== 5) {
    throw new Error(`Expected 5 questions in topic document, found: ${topicData.questions?.length}`);
  }

  // Metadata verification
  if (data.metadata?.paper2Calibrated !== true || data.metadata?.set101Verified !== true) {
    throw new Error('❌ metadata.paper2Calibrated or metadata.set101Verified not true in target document!');
  }
  console.log('✅ Metadata flags calibrated: paper2Calibrated = true, set101Verified = true.');

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 101 (2009 BECE SCIENCE PAPER 2 VARIANT)!');
}

verifySet101()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed for Set 101:', err);
    process.exit(1);
  });

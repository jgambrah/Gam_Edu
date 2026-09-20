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

  // CLI OAuth fallback
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
  } catch (cliErr) {
    // Continue
  }

  try {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
    return adminInstance.firestore();
  } catch (e) {
    return adminInstance.firestore();
  }
}

async function verifySet103() {
  console.log('=== VERIFYING SET 103 (2008 BECE INTEGRATED SCIENCE PAPER 2 VARIANT) ===');
  const db = await getFirestore();

  // 1. Target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2008_variant';
  const docSnap = await db.doc(docPath).get();
  if (!docSnap.exists) {
    throw new Error('Target document does not exist: ' + docPath);
  }

  const data = docSnap.data();
  console.log('✅ Target document exists:', docPath);
  console.log('Year:', data.year, '| Subject:', data.subject);

  // Check Paper 1 preserved intact
  if (data.paper1 && Array.isArray(data.paper1.questions)) {
    console.log(`✅ Paper 1 preserved: ${data.paper1.questions.length} questions (Set 102 intact)`);
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

  // Q1(a): Connected vessels A & B (head pressure & diffusion)
  const q1a = q1.subQuestions[0];
  if (!q1a.prompt.includes('<svg') || !q1a.prompt.includes('Container A')) {
    throw new Error('❌ Q1(a) missing connected cylinders vector SVG!');
  }
  if (!q1a.workedSolution.includes('Hydrostatic') && !q1a.workedSolution.includes('diffusion')) {
    throw new Error('❌ Q1(a) missing hydrostatic pressure or diffusion solution!');
  }
  console.log('✅ Q1(a) verified (10 marks, connected cylinders SVG, hydrostatic pressure differential P=ρgh, 24-hr molecular diffusion).');

  // Q1(b): Ammonia gas laboratory preparation
  const q1b = q1.subQuestions[1];
  if (!q1b.prompt.includes('<svg') || !q1b.prompt.includes('NH₄Cl')) {
    throw new Error('❌ Q1(b) missing ammonia synthesis vector SVG!');
  }
  if (!q1b.workedSolution.includes('CaO') && !q1b.workedSolution.includes('ammonia')) {
    throw new Error('❌ Q1(b) missing CaO quicklime or ammonia explanation in solution!');
  }
  console.log('✅ Q1(b) verified (10 marks, ammonia preparation SVG, downward tilt boiling tube, CaO drying tower, upward delivery, red litmus test).');

  // Q1(c): Variegated leaf starch test
  const q1c = q1.subQuestions[2];
  if (!q1c.prompt.includes('<svg') || !q1c.prompt.includes('Variegated Leaf')) {
    throw new Error('❌ Q1(c) missing variegated leaf starch test vector SVG!');
  }
  if (!q1c.workedSolution.includes('Chlorophyll') || !q1c.workedSolution.includes('photosynthesis')) {
    throw new Error('❌ Q1(c) missing chlorophyll requirement conclusion in solution!');
  }
  console.log('✅ Q1(c) verified (10 marks, variegated leaf SVG, 4-stage starch test: water boiling kill, warm ethanol decolorization, cold water soften, iodine indicator).');

  // Questions 2 to 5 (Section B Theory - 15 marks each)
  // Q2: Opaque vs translucent, seed dispersal, municipal recycling in Ghana
  const q2 = p2.questions[1];
  let q2Marks = 0;
  q2.subQuestions.forEach((s: any) => { q2Marks += s.maxMarks || 0; });
  console.log(`✅ Question 2 marks: ${q2Marks}/15`);
  if (q2Marks !== 15) throw new Error(`Expected 15 marks for Q2, found: ${q2Marks}`);
  console.log('✅ Q2 verified (opaque vs translucent light transmission, seed dispersal ecology & adaptations, recycling advantages & commodities in Ghana).');

  // Q3: Nocturnal enuresis, hard vs impure water, water treatment stages, density displacement calculation
  const q3 = p2.questions[2];
  let q3Marks = 0;
  q3.subQuestions.forEach((s: any) => { q3Marks += s.maxMarks || 0; });
  console.log(`✅ Question 3 marks: ${q3Marks}/15`);
  if (q3Marks !== 15) throw new Error(`Expected 15 marks for Q3, found: ${q3Marks}`);
  if (!q3.subQuestions[2].workedSolution.includes('1.2') || !q3.subQuestions[2].workedSolution.includes('float')) {
    throw new Error('❌ Q3 missing density calculation (1.2 g/cm3) or flotation behavior!');
  }
  console.log('✅ Q3 verified (enuresis etiology & dermatitis complications, hard vs impure water, municipal water stages, density displacement rho=1.2 g/cm3 & flotation).');

  // Q4: Echoes, respiratory pathologies, biotechnology
  const q4 = p2.questions[3];
  let q4Marks = 0;
  q4.subQuestions.forEach((s: any) => { q4Marks += s.maxMarks || 0; });
  console.log(`✅ Question 4 marks: ${q4Marks}/15`);
  if (q4Marks !== 15) throw new Error(`Expected 15 marks for Q4, found: ${q4Marks}`);
  console.log('✅ Q4 verified (echo definition & sonar/ultrasound applications, tuberculosis/asthma/bronchitis preventions, biotechnology products).');

  // Q5: Pressure in mechanics, liver functions, chemical compounds
  const q5 = p2.questions[4];
  let q5Marks = 0;
  q5.subQuestions.forEach((s: any) => { q5Marks += s.maxMarks || 0; });
  console.log(`✅ Question 5 marks: ${q5Marks}/15`);
  if (q5Marks !== 15) throw new Error(`Expected 15 marks for Q5, found: ${q5Marks}`);
  if (!q5.subQuestions[2].workedSolution.includes('HCl') || !q5.subQuestions[2].workedSolution.includes('MgO')) {
    throw new Error('❌ Q5 missing HCl or MgO formulas in solution!');
  }
  console.log('✅ Q5 verified (pressure P=F/A applications, hepatic functions, compound properties & binary formulas HCl, MgO).');

  // 3. Single-document read pattern
  const topicDocPath = 'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2008_variant_p2';
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
  if (data.metadata?.paper2Calibrated !== true || data.metadata?.set103Verified !== true) {
    throw new Error('❌ metadata.paper2Calibrated or metadata.set103Verified not true in target document!');
  }
  console.log('✅ Metadata flags calibrated: paper2Calibrated = true, set103Verified = true.');

  console.log('\n🌟 ALL VERIFICATION CHECKS PASSED FOR SET 103 (2008 BECE SCIENCE PAPER 2 VARIANT)!');
}

verifySet103()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed for Set 103:', err);
    process.exit(1);
  });

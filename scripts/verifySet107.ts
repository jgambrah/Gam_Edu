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

async function verifySet107() {
  console.log('=== VERIFYING SET 107 (2006 BECE INTEGRATED SCIENCE PAPER 2 VARIANT) ===');
  const db = await getFirestore();

  // 1. Target doc
  const docPath = 'global_curriculum/jhs/subjects/science/past_papers/paper_2006_variant';
  const docSnap = await db.doc(docPath).get();
  if (!docSnap.exists) {
    throw new Error('Target document does not exist: ' + docPath);
  }

  const data = docSnap.data();
  console.log('✅ Target document exists:', docPath);
  console.log('Year:', data.year, '| Subject:', data.subject);

  // Check Paper 1 preserved intact
  if (data.paper1 && Array.isArray(data.paper1.questions)) {
    console.log(`✅ Paper 1 preserved intact: ${data.paper1.questions.length} questions (Set 106 intact)`);
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

  // Question 1 (Practical Section A)
  const q1 = p2.questions[0];
  console.log('--- Question 1 (Section A Practical Test) ---');
  if (q1.questionNumber !== "1" || !q1.isPracticalSectionA) {
    throw new Error('Question 1 must be marked as isPracticalSectionA: true');
  }
  if (!Array.isArray(q1.subQuestions) || q1.subQuestions.length !== 3) {
    throw new Error(`Expected 3 subquestions in Question 1, found: ${q1.subQuestions?.length}`);
  }

  // Subquestions validation
  const subIds = ["(a)", "(b)", "(c)"];
  subIds.forEach((id, idx) => {
    const sub = q1.subQuestions[idx];
    if (sub.subId !== id) throw new Error(`Expected subquestion ${id}, got ${sub.subId}`);
    if (typeof sub.maxMarks !== 'number' || sub.maxMarks <= 0) throw new Error(`Invalid maxMarks in subquestion ${id}`);
    if (!sub.prompt || !sub.workedSolution) throw new Error(`Missing prompt or solution in subquestion ${id}`);
  });

  // Check SVG in Q1(a): Solenoid Electromagnetization of Iron Nail
  const q1a = q1.subQuestions[0];
  if (!q1a.prompt.includes('<svg') || !q1a.prompt.includes('Nail with Solenoid')) {
    throw new Error('❌ Q1(a) SVG solenoid electromagnetization missing or malformed');
  }
  console.log('✅ Q1(a) solenoid electromagnetization of iron nail SVG verified.');

  // Check SVG in Q1(b): Carbon Dioxide Preparation & Collection Over Water
  const q1b = q1.subQuestions[1];
  if (!q1b.prompt.includes('<svg') || !q1b.prompt.includes('OVER-WATER COLLECTION')) {
    throw new Error('❌ Q1(b) SVG carbon dioxide over-water apparatus missing or malformed');
  }
  console.log('✅ Q1(b) carbon dioxide preparation & collection over water SVG verified.');

  // Check SVG in Q1(c): Salivary Digestion of Yam Pap Starch
  const q1c = q1.subQuestions[2];
  if (!q1c.prompt.includes('<svg') || !q1c.prompt.includes('Yam + Iodine')) {
    throw new Error('❌ Q1(c) SVG salivary amylase starch digestion missing or malformed');
  }
  console.log('✅ Q1(c) salivary amylase yam pap starch hydrolysis SVG verified.');

  // Verify Questions 2 to 5 (Section B Theory Essays)
  console.log('--- Questions 2 to 5 (Section B Theory Essays) ---');
  for (let qIdx = 1; qIdx < 5; qIdx++) {
    const q = p2.questions[qIdx];
    const expectedNum = (qIdx + 1).toString();
    if (q.questionNumber !== expectedNum) {
      throw new Error(`Expected questionNumber ${expectedNum}, got ${q.questionNumber}`);
    }
    if (q.isPracticalSectionA) {
      throw new Error(`Question ${expectedNum} should not be isPracticalSectionA`);
    }
    let totalMarks = 0;
    q.subQuestions.forEach((sub: any) => {
      totalMarks += (sub.maxMarks || 0);
      if (!sub.prompt || !sub.workedSolution) {
        throw new Error(`Question ${expectedNum} ${sub.subId} missing prompt or solution`);
      }
    });
    console.log(`✅ Question ${expectedNum}: total marks = ${totalMarks} / 20`);
    if (totalMarks !== 20) {
      throw new Error(`Question ${expectedNum} total marks should be 20, got ${totalMarks}`);
    }
  }

  // Check SVG in Q5(c): Parallel Circuit
  const q5c = p2.questions[4].subQuestions[2];
  if (!q5c.prompt.includes('<svg') || !q5c.prompt.includes('Lamp 1') || !q5c.prompt.includes('Lamp 2')) {
    throw new Error('❌ Q5(c) parallel circuit schematic SVG missing or malformed');
  }
  console.log('✅ Q5(c) parallel lamp circuit schematic SVG verified.');

  // 3. Verify Single-Document Read Paths for Paper 2
  console.log('--- Verifying Single-Document Read Paths for Paper 2 ---');
  const p2Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2006_variant/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2006_variant/question_sets/paper_2006_variant_p2',
  ];

  for (const p of p2Paths) {
    const snap = await db.doc(p).get();
    if (!snap.exists) {
      throw new Error(`Missing single-doc read path: ${p}`);
    }
    const d = snap.data();
    if (d.setNumber !== 107 || d.paperType !== 2 || d.questions?.length !== 5) {
      throw new Error(`Invalid data at ${p}`);
    }
    console.log(`✅ Path verified: ${p}`);
  }

  console.log('🎉 ALL VERIFICATION CHECKS PASSED FOR SET 107 (2006 SCIENCE PAPER 2)!');
}

verifySet107()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed for Set 107:', err);
    process.exit(1);
  });

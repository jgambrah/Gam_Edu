import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import {
  SET_BECE_2025_SCIENCE_P1,
  SET_BECE_2025_SCIENCE_P2,
  SET_BECE_2025_SCIENCE_COMPLETE
} from '../src/lib/data/jhs-curriculum-set-118';

// Explicitly load .env from repo root
const repoRoot = process.cwd();
dotenv.config({ path: path.join(repoRoot, '.env') });
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

async function seedBece2025ScienceCompleteVariant() {
  console.log('Seeding 2025 BECE Integrated Science Complete Variant (Set 118) into Firestore...');
  const db = await getFirestore();

  // Verify balanced key distribution for Paper 1
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  SET_BECE_2025_SCIENCE_P1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Paper 1 Key Distribution across 40 items:', keyDist);

  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error(`Unbalanced Paper 1 key distribution! Expected exactly 10 of each, got: ${JSON.stringify(keyDist)}`);
  }

  // Target main document
  const mainDocRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2025_variant');
  await mainDocRef.set({
    ...SET_BECE_2025_SCIENCE_COMPLETE,
    metadata: {
      ...SET_BECE_2025_SCIENCE_COMPLETE.metadata,
      set118Verified: true,
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });

  console.log('✅ Successfully seeded Set 118 into past_papers/paper_2025_variant.');

  // Topic redundant paths for complete paper
  const topicPaths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2025_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2025_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_2025_variant/question_sets/paper_2025_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2025_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2025_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2025_variant/question_sets/paper_2025_variant',
  ];

  for (const p of topicPaths) {
    await db.doc(p).set({
      ...SET_BECE_2025_SCIENCE_COMPLETE,
      id: "paper_2025_variant",
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }, { merge: true });
    console.log('✅ Ingested complete ->', p);
  }

  // Single-doc read paths for Paper 1
  const p1Data = {
    ...SET_BECE_2025_SCIENCE_P1,
    id: "paper_2025_variant_p1",
    year: 2025,
    setNumber: 118,
    paperType: 1,
    subject: "Integrated Science",
    topic: "2025 BECE Standardized Objective Examination",
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  };
  const p1Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2025_variant_p1',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2025_variant_p1',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2025_variant_p1',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2025_variant_p1',
  ];
  for (const p of p1Paths) {
    await db.doc(p).set(p1Data, { merge: true });
    console.log('✅ Ingested P1 ->', p);
  }

  // Single-doc read paths for Paper 2
  const p2Data = {
    ...SET_BECE_2025_SCIENCE_P2,
    id: "paper_2025_variant_p2",
    year: 2025,
    setNumber: 118,
    paperType: 2,
    subject: "Integrated Science",
    topic: "2025 BECE Standardized Theory & Practical Examination",
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  };
  const p2Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2025_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2025_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2025_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2025_variant_p2',
  ];
  for (const p of p2Paths) {
    await db.doc(p).set(p2Data, { merge: true });
    console.log('✅ Ingested P2 ->', p);
  }

  console.log('🎉 Set 118 (2025 Science Complete Variant) ingestion complete!');
}

seedBece2025ScienceCompleteVariant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 118 Science Complete Variant:', err);
    process.exit(1);
  });

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { createRequire } from 'module';
import { SET_BECE_2026_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-72';
import { SET_JHS_SCIENCE_SAMPLE_P1 } from '../src/lib/data/jhs-curriculum-set-70';
import { SET_JHS_SCIENCE_SAMPLE_P2 } from '../src/lib/data/jhs-curriculum-set-71';
import { SET_BECE_2026_SCIENCE_P2 } from '../src/lib/data/jhs-curriculum-set-73';

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

async function syncAll() {
  console.log('Synchronizing Science Past Question Sets (Set 70, 71, 72) across all Firestore topics...');
  const db = await getFirestore();

  const set72Data = {
    ...SET_BECE_2026_SCIENCE_P1,
    id: 'paper_2026_variant',
    year: 2026,
    setNumber: 72,
    paperType: 1,
    subject: 'Integrated Science',
    topic: '2026 BECE Integrated Science Blueprint & Standardized CBT',
    updatedAt: new Date()
  };

  const set70Data = {
    ...SET_JHS_SCIENCE_SAMPLE_P1,
    id: 'paper_nacca_sample_variant_p1',
    year: 2024,
    setNumber: 70,
    paperType: 1,
    subject: 'Integrated Science',
    topic: 'NaCCA 50-Item Preparatory Assessment Blueprint',
    updatedAt: new Date()
  };

  const set71Data = {
    ...SET_JHS_SCIENCE_SAMPLE_P2,
    id: 'paper_nacca_sample_variant_p2',
    year: 2024,
    setNumber: 71,
    paperType: 2,
    subject: 'Integrated Science',
    topic: 'Practical Science Labs & Core Theory',
    updatedAt: new Date()
  };

  const set73Data = {
    ...SET_BECE_2026_SCIENCE_P2,
    id: 'paper_2026_variant_p2',
    year: 2026,
    setNumber: 73,
    paperType: 2,
    subject: 'Integrated Science',
    topic: '2026 BECE Practical & Theory Essay Test',
    updatedAt: new Date()
  };

  // Paths for Set 72
  const set72Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2026_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2026_variant',
    'global_curriculum/jhs/subjects/science/topics/nacca_preparatory_blueprint/question_sets/paper_2026_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2026_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2026_variant',
    'global_curriculum/jhs/subjects/science/past_papers/paper_2026_variant'
  ];

  for (const p of set72Paths) {
    await db.doc(p).set(set72Data, { merge: true });
    console.log('Synced Set 72 ->', p);
  }

  // Paths for Set 70
  const set70Paths = [
    'global_curriculum/jhs/subjects/science/topics/nacca_preparatory_blueprint/question_sets/paper_nacca_sample_variant_p1',
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_nacca_sample_variant_p1',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_nacca_sample_variant_p1',
    'global_curriculum/jhs/subjects/integrated_science/topics/nacca_preparatory_blueprint/question_sets/paper_nacca_sample_variant_p1',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_nacca_sample_variant_p1'
  ];

  for (const p of set70Paths) {
    await db.doc(p).set(set70Data, { merge: true });
    console.log('Synced Set 70 ->', p);
  }

  // Paths for Set 71
  const set71Paths = [
    'global_curriculum/jhs/subjects/science/topics/nacca_preparatory_blueprint/question_sets/paper_nacca_sample_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_nacca_sample_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_nacca_sample_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/nacca_preparatory_blueprint/question_sets/paper_nacca_sample_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_nacca_sample_variant_p2'
  ];

  for (const p of set71Paths) {
    await db.doc(p).set(set71Data, { merge: true });
    console.log('Synced Set 71 ->', p);
  }

  // Paths for Set 73
  const set73Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2026_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2026_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/nacca_preparatory_blueprint/question_sets/paper_2026_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2026_variant/question_sets/paper_2026_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2026_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2026_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/nacca_preparatory_blueprint/question_sets/paper_2026_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2026_variant/question_sets/paper_2026_variant_p2'
  ];

  for (const p of set73Paths) {
    await db.doc(p).set(set73Data, { merge: true });
    console.log('Synced Set 73 ->', p);
  }

  console.log('✅ All Science Past Papers successfully synced across all Firestore collections.');
}

syncAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error syncing:', err);
    process.exit(1);
  });

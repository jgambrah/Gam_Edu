import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { createRequire } from 'module';
import { SET_BECE_2026_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-72';
import { SET_JHS_SCIENCE_SAMPLE_P1 } from '../src/lib/data/jhs-curriculum-set-70';
import { SET_JHS_SCIENCE_SAMPLE_P2 } from '../src/lib/data/jhs-curriculum-set-71';
import { SET_BECE_2026_SCIENCE_P2 } from '../src/lib/data/jhs-curriculum-set-73';
import { SET_BECE_2014_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-74';
import { SET_BECE_2014_SCIENCE_P2 } from '../src/lib/data/jhs-curriculum-set-75';
import { SET_BECE_2015_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-76';
import { SET_BECE_2015_SCIENCE_P2 } from '../src/lib/data/jhs-curriculum-set-77';
import { SET_BECE_2016_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-78';
import { SET_BECE_2016_SCIENCE_P2 } from '../src/lib/data/jhs-curriculum-set-79';
import { SET_BECE_2017_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-80';
import { SET_BECE_2017_SCIENCE_P2 } from '../src/lib/data/jhs-curriculum-set-81';
import { SET_BECE_2018_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-84';
import { SET_BECE_2018_SCIENCE_P2 } from '../src/lib/data/jhs-curriculum-set-85';
import { SET_BECE_2021_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-86';
import { SET_BECE_2019_SCIENCE_P1 } from '../src/lib/data/jhs-curriculum-set-82';
import { SET_BECE_2019_SCIENCE_P2 } from '../src/lib/data/jhs-curriculum-set-83';

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

  const set74Data = {
    ...SET_BECE_2014_SCIENCE_P1,
    id: 'paper_2014_variant',
    year: 2014,
    setNumber: 74,
    paperType: 1,
    subject: 'Integrated Science',
    topic: '2014 BECE Integrated Science Standardized CBT',
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

  // Paths for Set 74
  const set74Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2014_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2014_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_2014_variant/question_sets/paper_2014_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2014_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2014_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2014_variant/question_sets/paper_2014_variant'
  ];

  for (const p of set74Paths) {
    await db.doc(p).set(set74Data, { merge: true });
    console.log('Synced Set 74 ->', p);
  }

  const set75Data = {
    ...SET_BECE_2014_SCIENCE_P2,
    id: 'paper_2014_variant_p2',
    year: 2014,
    setNumber: 75,
    paperType: 2,
    subject: 'Integrated Science',
    topic: '2014 BECE Practical & Theory Essay Test',
    updatedAt: new Date()
  };

  // Paths for Set 75
  const set75Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2014_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2014_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2014_variant/question_sets/paper_2014_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2014_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2014_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2014_variant/question_sets/paper_2014_variant_p2'
  ];

  for (const p of set75Paths) {
    await db.doc(p).set(set75Data, { merge: true });
    console.log('Synced Set 75 ->', p);
  }

  const set76Data = {
    ...SET_BECE_2015_SCIENCE_P1,
    id: 'paper_2015_variant',
    year: 2015,
    setNumber: 76,
    paperType: 1,
    subject: 'Integrated Science',
    topic: '2015 BECE Integrated Science Standardized CBT',
    updatedAt: new Date()
  };

  // Paths for Set 76
  const set76Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2015_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2015_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_2015_variant/question_sets/paper_2015_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2015_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2015_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2015_variant/question_sets/paper_2015_variant'
  ];

  for (const p of set76Paths) {
    await db.doc(p).set(set76Data, { merge: true });
    console.log('Synced Set 76 ->', p);
  }

  const set77Data = {
    ...SET_BECE_2015_SCIENCE_P2,
    id: 'paper_2015_variant_p2',
    year: 2015,
    setNumber: 77,
    paperType: 2,
    subject: 'Integrated Science',
    topic: '2015 BECE Practical & Theory Essay Test',
    updatedAt: new Date()
  };

  // Paths for Set 77
  const set77Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2015_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2015_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2015_variant/question_sets/paper_2015_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2015_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2015_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2015_variant/question_sets/paper_2015_variant_p2'
  ];

  for (const p of set77Paths) {
    await db.doc(p).set(set77Data, { merge: true });
    console.log('Synced Set 77 ->', p);
  }

  const set78Data = {
    ...SET_BECE_2016_SCIENCE_P1,
    id: 'paper_2016_variant',
    year: 2016,
    setNumber: 78,
    paperType: 1,
    subject: 'Integrated Science',
    topic: '2016 BECE Integrated Science Standardized CBT',
    updatedAt: new Date()
  };

  // Paths for Set 78
  const set78Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2016_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2016_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_2016_variant/question_sets/paper_2016_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2016_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2016_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2016_variant/question_sets/paper_2016_variant'
  ];

  for (const p of set78Paths) {
    await db.doc(p).set(set78Data, { merge: true });
    console.log('Synced Set 78 ->', p);
  }

  const set79Data = {
    ...SET_BECE_2016_SCIENCE_P2,
    id: 'paper_2016_variant_p2',
    year: 2016,
    setNumber: 79,
    paperType: 2,
    subject: 'Integrated Science',
    topic: '2016 BECE Practical & Theory Essay Test',
    updatedAt: new Date()
  };

  // Paths for Set 79
  const set79Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2016_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2016_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2016_variant/question_sets/paper_2016_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2016_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2016_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2016_variant/question_sets/paper_2016_variant_p2'
  ];

  for (const p of set79Paths) {
    await db.doc(p).set(set79Data, { merge: true });
    console.log('Synced Set 79 ->', p);
  }

  const set80Data = {
    ...SET_BECE_2017_SCIENCE_P1,
    id: 'paper_2017_variant',
    year: 2017,
    setNumber: 80,
    paperType: 1,
    subject: 'Integrated Science',
    topic: '2017 BECE Integrated Science Standardized CBT',
    updatedAt: new Date()
  };

  // Paths for Set 80
  const set80Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2017_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2017_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_2017_variant/question_sets/paper_2017_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2017_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2017_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2017_variant/question_sets/paper_2017_variant'
  ];

  for (const p of set80Paths) {
    await db.doc(p).set(set80Data, { merge: true });
    console.log('Synced Set 80 ->', p);
  }

  const set81Data = {
    ...SET_BECE_2017_SCIENCE_P2,
    id: 'paper_2017_variant_p2',
    year: 2017,
    setNumber: 81,
    paperType: 2,
    subject: 'Integrated Science',
    topic: '2017 BECE Practical & Theory Essay Test',
    updatedAt: new Date()
  };

  // Paths for Set 81
  const set81Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2017_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2017_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2017_variant/question_sets/paper_2017_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2017_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2017_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2017_variant/question_sets/paper_2017_variant_p2'
  ];

  for (const p of set81Paths) {
    await db.doc(p).set(set81Data, { merge: true });
    console.log('Synced Set 81 ->', p);
  }

  const set82Data = {
    ...SET_BECE_2019_SCIENCE_P1,
    id: 'paper_2019_variant',
    year: 2019,
    setNumber: 82,
    paperType: 1,
    subject: 'Integrated Science',
    topic: '2019 BECE Integrated Science Standardized CBT',
    updatedAt: new Date()
  };

  // Paths for Set 82
  const set82Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2019_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2019_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_2019_variant/question_sets/paper_2019_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2019_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2019_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2019_variant/question_sets/paper_2019_variant'
  ];

  for (const p of set82Paths) {
    await db.doc(p).set(set82Data, { merge: true });
    console.log('Synced Set 82 ->', p);
  }

  const set84Data = {
    ...SET_BECE_2018_SCIENCE_P1,
    id: 'paper_2018_variant',
    year: 2018,
    setNumber: 84,
    paperType: 1,
    subject: 'Integrated Science',
    topic: '2018 BECE Integrated Science Standardized CBT',
    updatedAt: new Date()
  };

  // Paths for Set 84
  const set84Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2018_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2018_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_2018_variant/question_sets/paper_2018_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2018_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2018_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2018_variant/question_sets/paper_2018_variant'
  ];

  for (const p of set84Paths) {
    await db.doc(p).set(set84Data, { merge: true });
    console.log('Synced Set 84 ->', p);
  }



  const set83Data = {
    ...SET_BECE_2019_SCIENCE_P2,
    id: 'paper_2019_variant_p2',
    year: 2019,
    setNumber: 83,
    paperType: 2,
    subject: 'Integrated Science',
    topic: '2019 BECE Practical & Theory Essay Test',
    updatedAt: new Date()
  };

  // Paths for Set 83
  const set83Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2019_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2019_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2019_variant/question_sets/paper_2019_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2019_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2019_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2019_variant/question_sets/paper_2019_variant_p2'
  ];

  for (const p of set83Paths) {
    await db.doc(p).set(set83Data, { merge: true });
    console.log('Synced Set 83 ->', p);
  }

  const set85Data = {
    ...SET_BECE_2018_SCIENCE_P2,
    id: 'paper_2018_variant_p2',
    year: 2018,
    setNumber: 85,
    paperType: 2,
    subject: 'Integrated Science',
    topic: '2018 BECE Practical & Theory Essay Test',
    updatedAt: new Date()
  };

  // Paths for Set 85
  const set85Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2018_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2018_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2018_variant/question_sets/paper_2018_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2018_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2018_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2018_variant/question_sets/paper_2018_variant_p2'
  ];

  for (const p of set85Paths) {
    await db.doc(p).set(set85Data, { merge: true });
    console.log('Synced Set 85 ->', p);
  }

  const set86Data = {
    ...SET_BECE_2021_SCIENCE_P1,
    id: 'paper_2021_variant',
    year: 2021,
    setNumber: 86,
    paperType: 1,
    subject: 'Integrated Science',
    topic: '2021 BECE Integrated Science Standardized CBT',
    updatedAt: new Date()
  };

  // Paths for Set 86
  const set86Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2021_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2021_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_2021_variant/question_sets/paper_2021_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2021_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2021_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2021_variant/question_sets/paper_2021_variant'
  ];

  for (const p of set86Paths) {
    await db.doc(p).set(set86Data, { merge: true });
    console.log('Synced Set 86 ->', p);
  }











  console.log('✅ All Science Past Papers successfully synced across all Firestore collections.');
}

syncAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error syncing:', err);
    process.exit(1);
  });

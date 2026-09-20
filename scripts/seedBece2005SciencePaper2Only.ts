import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { createRequire } from 'module';
import { SET_BECE_2005_SCIENCE_P2, svgQ1aSpoutingCans, svgQ1bNeutralizationTubes, svgQ4cClass2LeverSystem } from '../src/lib/data/jhs-curriculum-set-109';

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

async function seedBece2005SciencePaper2Only() {
  console.log('Seeding 2005 BECE Integrated Science Paper 2 Variant (Set 109) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2005_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: SET_BECE_2005_SCIENCE_P2.questions
    },
    metadata: {
      paper2Calibrated: true,
      set109Verified: true,
      sourcePhotographsIntegrated: ["IMG_2582.jpg", "IMG_2583.jpg", "IMG_2584.jpg"],
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });

  console.log('✅ Successfully seeded Set 109 (2005 Science Paper 2 Variant) into past_papers/paper_2005_variant.');

  // Single-doc read paths for Paper 2
  const p2Data = {
    ...SET_BECE_2005_SCIENCE_P2,
    id: "paper_2005_variant_p2",
    year: 2005,
    setNumber: 109,
    paperType: 2,
    subject: "Integrated Science",
    topic: "2005 BECE Standardized Theory & Practical Examination",
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  };

  const p2Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2005_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2005_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2005_variant/question_sets/paper_2005_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2005_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2005_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2005_variant/question_sets/paper_2005_variant_p2',
  ];

  for (const p of p2Paths) {
    await db.doc(p).set(p2Data, { merge: true });
    console.log('✅ Ingested P2 ->', p);
  }

  console.log('🎉 Set 109 (2005 Science Paper 2 Variant) dedicated ingestion complete!');
}

seedBece2005SciencePaper2Only()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 109 Science Paper 2:', err);
    process.exit(1);
  });

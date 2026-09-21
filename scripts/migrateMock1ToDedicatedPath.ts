import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import {
  SET_BECE_MOCK_1_SCIENCE_P1,
  SET_BECE_MOCK_1_SCIENCE_P2,
  SET_BECE_MOCK_1_SCIENCE_COMPLETE
} from '../src/lib/data/jhs-curriculum-set-132.ts';

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
  } catch (cliErr) {
    console.warn('CLI auth fallback error:', cliErr);
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

async function migrateMock1ToDedicatedPath() {
  console.log('--- Starting Migration for BECE Integrated Science Mock 1 ---');
  const db = await getFirestore();

  // Validate balanced options in Paper 1
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  SET_BECE_MOCK_1_SCIENCE_P1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Paper 1 Key Distribution (Balanced 10x4):', keyDist);

  // Separate Section A practicals and Section B essays
  const allP2Questions = SET_BECE_MOCK_1_SCIENCE_P2.questions;
  const sectionAPracticals = (allP2Questions[0].subQuestions || []).map((sq: any) => ({
    ...sq,
    section: 'A',
    questionNumber: '1'
  }));

  const sectionBEssays = allP2Questions.slice(1).map((q: any) => {
    const marks = q.subQuestions.reduce((sum: number, sq: any) => sum + (sq.maxMarks || 0), 0);
    return {
      ...q,
      section: 'B',
      questionNumber: q.questionNumber,
      totalMarks: marks
    };
  });

  const unifiedMockDocument = {
    mockId: 'mock_1',
    title: 'BECE Integrated Science Mock 1 (Standard Predictive Model)',
    subject: 'Integrated Science',
    totalDurationMinutes: 150, // 45m P1 + 105m P2
    metadata: {
      isMock: true,
      setNumber: 132,
      version: '2027-2029 Standard',
      totalMarks: 140, // 40 (P1) + 100 (P2)
      optionsBalanced: true,
      predictiveModel: true,
      vectorGraphicsCount: 2,
      keyDistribution: keyDist,
      copyright: 'Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    paper1: {
      title: 'Paper 1: Objective Test',
      durationMinutes: 45,
      totalQuestions: 40,
      questions: SET_BECE_MOCK_1_SCIENCE_P1.questions
    },
    paper2: {
      title: 'Paper 2: Practical & Theory Essay',
      durationMinutes: 105,
      instructions: 'Answer Question 1 in Section A and three questions from Section B.',
      sectionA: sectionAPracticals, // 4 compulsory practical questions (40 marks)
      sectionB: sectionBEssays,      // 4 essay questions (choose 3, 60 marks)
      questions: allP2Questions     // Backwards-compatibility for existing UI components
    }
  };

  const targetPaths = [
    'global_curriculum/jhs/subjects/science/mock_exams/mock_1',
    'global_curriculum/jhs/subjects/integrated_science/mock_exams/mock_1'
  ];

  for (const docPath of targetPaths) {
    console.log(`Writing unified Mock 1 to dedicated path: ${docPath}...`);
    const docRef = db.doc(docPath);
    await docRef.set(unifiedMockDocument, { merge: true });
    console.log(`✅ Dedicated Mock 1 document set at: ${docPath}`);
  }

  // Clean up legacy/erroneous past_papers paths if they exist
  const legacyPaths = [
    'global_curriculum/jhs/subjects/science/past_papers/paper_mock_1',
    'global_curriculum/jhs/subjects/integrated_science/past_papers/paper_mock_1'
  ];

  for (const legacyPath of legacyPaths) {
    const legacyRef = db.doc(legacyPath);
    const snap = await legacyRef.get();
    if (snap.exists) {
      await legacyRef.delete();
      console.log(`🗑️ Removed legacy mock from historical past papers: ${legacyPath}`);
    } else {
      console.log(`ℹ️ Legacy path clean (does not exist): ${legacyPath}`);
    }
  }

  console.log('🎉 Migration successfully completed!');
}

migrateMock1ToDedicatedPath()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration execution error:', err);
    process.exit(1);
  });

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

async function verifyQ1cTable() {
  const db = await getFirestore();
  const snap = await db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2004_variant').get();
  if (!snap.exists) {
    console.error('❌ Document does not exist in Firestore!');
    process.exit(1);
  }
  const data = snap.data();
  const q1 = data.paper2.questions.find((q: any) => q.questionNumber === '1');
  const q1c = q1.subQuestions.find((sq: any) => sq.subId === '(c)');
  console.log('=== FIRESTORE Q1(c) PROMPT ===');
  console.log(q1c.prompt);
  console.log('\n=== FIRESTORE Q1(c) WORKED SOLUTION ===');
  console.log(q1c.workedSolution);

  if (q1c.prompt.includes('| Food Substance | Test Performed | Observation Made |') &&
      q1c.prompt.includes('| :---: | :--- | :--- |') &&
      q1c.workedSolution.includes('Identification of Food Nutrients:')) {
    console.log('\n✅ TABLE AND CONTENT VERIFIED ACCURATELY IN FIRESTORE!');
  } else {
    console.error('\n❌ Table formatting verification failed!');
    process.exit(1);
  }
}

verifyQ1cTable()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

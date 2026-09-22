process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';
import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
    const oauthClient = new OAuth2Client();
    oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
    return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
  } catch (e) {
    if (!fbAdmin.apps?.length) {
      fbAdmin.initializeApp({
        credential: fbAdmin.credential.applicationDefault(),
      });
    }
    return fbAdmin.firestore();
  }
}

async function auditMock2() {
  const db = await getDb();
  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_2');
  const snap = await docRef.get();
  if (!snap.exists) {
    console.error('FAIL: mock_2 does not exist in Firestore!');
    process.exit(1);
  }

  const data = snap.data();
  console.log('AUDIT REPORT: mock_2 in Firestore');
  console.log('Doc ID:', snap.id);
  console.log('Title:', data.title);
  console.log('Total Duration Minutes:', data.totalDurationMinutes);
  console.log('Metadata:', JSON.stringify(data.metadata, null, 2));

  // Check Paper 1
  console.log('Paper 1 Title:', data.paper1?.title);
  console.log('Paper 1 Duration Minutes:', data.paper1?.durationMinutes);
  console.log('Paper 1 Questions Count:', data.paper1?.questions?.length);
  
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  data.paper1?.questions?.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Paper 1 Balanced Keys:', keyDist);

  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    console.error('FAIL: Paper 1 key distribution is not balanced!');
    process.exit(1);
  }

  // Check Paper 2
  console.log('Paper 2 Title:', data.paper2?.title);
  console.log('Paper 2 Duration Minutes:', data.paper2?.durationMinutes);
  console.log('Paper 2 Questions Count:', data.paper2?.questions?.length);

  // Check for any forbidden "predict" terms
  const rawStr = JSON.stringify(data).toLowerCase();
  const matchCount = (rawStr.match(/predict/g) || []).length;
  console.log('Occurrences of forbidden word "predict":', matchCount);

  if (matchCount > 0) {
    console.error('FAIL: Found forbidden word "predict" in document!');
    process.exit(1);
  }

  console.log('✅ AUDIT PASSED: mock_2 is perfectly calibrated and standards-compliant!');
}

auditMock2().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});

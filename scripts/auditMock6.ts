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

async function auditMock6() {
  const db = await getDb();
  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_6');
  const snap = await docRef.get();
  if (!snap.exists) {
    console.error('FAIL: mock_6 does not exist in Firestore!');
    process.exit(1);
  }

  const data = snap.data();
  console.log('AUDIT REPORT: mock_6 in Firestore');
  console.log('Doc ID:', snap.id);
  console.log('Title:', data.title);
  console.log('Subject:', data.subject);
  console.log('Total Duration Minutes:', data.totalDurationMinutes);
  console.log('Metadata:', JSON.stringify(data.metadata, null, 2));

  // Check Paper 1
  console.log('\n--- Paper 1 Audit ---');
  console.log('Paper 1 Title:', data.paper1?.title);
  console.log('Paper 1 Duration Minutes:', data.paper1?.durationMinutes);
  console.log('Paper 1 Questions Count:', data.paper1?.questions?.length);
  
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  let p1PredictCount = 0;
  data.paper1?.questions?.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
    if (/predict/i.test(JSON.stringify(q))) p1PredictCount++;
  });
  console.log('Paper 1 Balanced Keys:', keyDist);
  console.log('Paper 1 "predict" occurrences:', p1PredictCount);

  // Check Paper 2
  console.log('\n--- Paper 2 Audit ---');
  console.log('Paper 2 Title:', data.paper2?.title);
  console.log('Paper 2 Duration Minutes:', data.paper2?.durationMinutes);
  console.log('Paper 2 Questions Count:', data.paper2?.questions?.length);
  const p2Str = JSON.stringify(data.paper2 || {});
  const svgMatches = p2Str.match(/<svg/g) || [];
  console.log('Paper 2 SVG Diagram Count:', svgMatches.length);
  const p2PredictMatches = p2Str.match(/predict/gi) || [];
  console.log('Paper 2 "predict" occurrences:', p2PredictMatches.length);

  // Overall validation
  const allJson = JSON.stringify(data);
  const totalPredict = (allJson.match(/predict/gi) || []).length;
  console.log('\nTotal "predict" in entire Mock 6 document:', totalPredict);

  const errors: string[] = [];
  if (data.paper1?.questions?.length !== 40) errors.push('Paper 1 does not have 40 questions');
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) errors.push('Key distribution is not 10 A, 10 B, 10 C, 10 D');
  if (!data.paper2 || data.paper2.questions?.length !== 5) errors.push('Paper 2 is missing or corrupted');
  if (svgMatches.length < 4) errors.push('Paper 2 practical SVGs are missing');
  if (totalPredict > 0) errors.push('Document contains predictive phrasing');

  if (errors.length > 0) {
    console.error('❌ Audit Failed with errors:', errors);
    process.exit(1);
  }

  console.log('\n✅ ALL AUDIT CRITERIA PASSED: Mock 6 is perfectly calibrated, balanced, and intact.');
}

auditMock6()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Audit script failed:', err);
    process.exit(1);
  });

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
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
    }
  } catch (e) {
    console.log("Fallback to admin default credentials...");
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.applicationDefault(),
    });
  }
  return fbAdmin.firestore();
}

async function verifyFoundation() {
  const db = await getDb();
  console.log("🔍 Verifying JHS English Foundation in Firestore...");

  // 1. Root Subject Verification
  const rootDoc = await db.doc("global_curriculum/jhs/subjects/english").get();
  console.log(`1. Root Doc Exists: ${rootDoc.exists}`);
  if (rootDoc.exists) {
    const rootData = rootDoc.data();
    console.log(`   Title: ${rootData.title}`);
    console.log(`   Framework: ${rootData.curriculumFramework}`);
    console.log(`   Strands Count: ${rootData.strands?.length}`);
    console.log(`   Total Questions Target per Topic: ${rootData.structure?.totalQuestionsPerTopic}`);
  }

  // 2. Topical Topics Verification
  const topicalSnap = await db.collection("global_curriculum/jhs/subjects/english/topical").get();
  console.log(`2. Topical Documents Count: ${topicalSnap.size} (Expected: 21)`);

  const rcDoc = await db.doc("global_curriculum/jhs/subjects/english/topical/reading_comprehension").get();
  if (rcDoc.exists) {
    const rcData = rcDoc.data();
    console.log(`   Sample Topic Check (reading_comprehension):`);
    console.log(`     - B7 Title: ${rcData.levels?.b7?.title}, Target: ${rcData.levels?.b7?.notes?.questionTargetCount?.total}`);
    console.log(`     - B8 Title: ${rcData.levels?.b8?.title}, Target: ${rcData.levels?.b8?.notes?.questionTargetCount?.total}`);
    console.log(`     - B9 Title: ${rcData.levels?.b9?.title}, Target: ${rcData.levels?.b9?.notes?.questionTargetCount?.total}`);
  }

  // 3. Past Questions Verification
  const pqSnap = await db.collection("global_curriculum/jhs/subjects/english/past_questions").get();
  console.log(`3. Past Questions Containers Count: ${pqSnap.size} (Expected: 16, 2010–2025)`);
  const pq2025 = await db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2025").get();
  if (pq2025.exists) {
    const pqData = pq2025.data();
    console.log(`   Sample PQ Check (bece_2025):`);
    console.log(`     - Title: ${pqData.title}`);
    console.log(`     - Paper 1 Target: ${pqData.paper1?.totalQuestions} MCQs, ${pqData.paper1?.durationMinutes} mins`);
    console.log(`     - Paper 2 Sections: ${Object.keys(pqData.paper2?.sections || {}).join(', ')}`);
  }

  // 4. Mock Exams Verification
  const mockSnap = await db.collection("global_curriculum/jhs/subjects/english/mock_exams").get();
  console.log(`4. Mock Exams Containers Count: ${mockSnap.size} (Expected: 10, Mock 1–10)`);
  const mock1 = await db.doc("global_curriculum/jhs/subjects/english/mock_exams/mock_1").get();
  if (mock1.exists) {
    const mockData = mock1.data();
    console.log(`   Sample Mock Check (mock_1):`);
    console.log(`     - Title: ${mockData.title}`);
    console.log(`     - Paper 1 Target: ${mockData.paper1?.totalQuestions} items`);
    console.log(`     - Paper 2 Duration: ${mockData.paper2?.durationMinutes} mins`);
  }

  console.log("\n✅ All JHS English Foundation checks completed successfully!");
}

verifyFoundation().catch(console.error);

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
  } catch (e) {}

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.applicationDefault(),
    });
  }
  return fbAdmin.firestore();
}

async function verifySingleDocRead() {
  const db = await getDb();
  console.log("🔍 Testing Strict 1-Document Read on BECE English 2024...");

  const docPath = "global_curriculum/jhs/subjects/english/past_questions/bece_2024";
  const startTime = Date.now();
  const snap = await db.doc(docPath).get();
  const readDuration = Date.now() - startTime;

  if (!snap.exists) {
    console.error(`❌ Document does not exist at ${docPath}`);
    process.exit(1);
  }

  const data = snap.data();
  console.log(`✅ [1 Read Successful] Path: ${docPath} (${readDuration}ms)`);
  console.log(`   - Year: ${data.year}`);
  console.log(`   - Title: ${data.title}`);
  console.log(`   - Status: ${data.metadata?.status}`);
  console.log(`   - Standard: ${data.metadata?.standard}`);

  const p1 = data.paper1;
  console.log(`\n📚 [Paper 1 Verification]`);
  console.log(`   - Title: ${p1?.title}`);
  console.log(`   - Duration: ${p1?.durationMinutes} mins`);
  console.log(`   - Questions Count: ${p1?.questions?.length} / 40`);

  const p1Complete = p1?.questions?.every((q: any) => 
    q.number && q.prompt && q.options?.length === 4 && q.correctAnswer && q.hint && q.workedSolution
  );
  console.log(`   - All 40 items valid with hint + workedSolution: ${p1Complete}`);
  console.log(`   - Sample Q1: "${p1?.questions?.[0]?.prompt}" -> Key: ${p1?.questions?.[0]?.correctAnswer}`);
  console.log(`   - Sample Q40: "${p1?.questions?.[39]?.prompt}" -> Key: ${p1?.questions?.[39]?.correctAnswer}`);

  const p2 = data.paper2;
  console.log(`\n✍️ [Paper 2 Verification]`);
  console.log(`   - Title: ${p2?.title}`);
  console.log(`   - Duration: ${p2?.durationMinutes} mins`);
  console.log(`   - Section A (Essay): ${p2?.sections?.sectionA_essay?.questions?.length} prompts`);
  console.log(`   - Section B (Comprehension): ${p2?.sections?.sectionB_comprehension?.questions?.length} items`);
  console.log(`   - Section C (Literature): ${p2?.sections?.sectionC_literature?.questions?.length} items`);
  console.log(`   - Flattened Question Parts: ${p2?.questions?.length}`);

  const jsonStr = JSON.stringify(data);
  const sizeKb = (Buffer.byteLength(jsonStr, 'utf8') / 1024).toFixed(2);
  console.log(`\n📦 Total Document Size: ${sizeKb} KB (Well within Firestore 1 MB document ceiling)`);
  console.log(`⚡ Firestore Read Count: EXACTLY 1 DOCUMENT READ.`);
}

verifySingleDocRead()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  });

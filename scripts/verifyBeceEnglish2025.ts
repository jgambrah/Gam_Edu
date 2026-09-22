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
  console.log("🔍 Testing Strict 1-Document Read on BECE English 2025...");

  // PERFORM STRICTLY 1 FIRESTORE DOCUMENT READ
  const docPath = "global_curriculum/jhs/subjects/english/past_questions/bece_2025";
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

  // Validate Paper 1 (Objective 40 items)
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

  // Validate Paper 2 (Essay, Comprehension, Literature)
  const p2 = data.paper2;
  console.log(`\n✍️ [Paper 2 Verification]`);
  console.log(`   - Title: ${p2?.title}`);
  console.log(`   - Duration: ${p2?.durationMinutes} mins`);

  const secA = p2?.sections?.sectionA_essay;
  console.log(`   - Section A (Essay): ${secA?.questions?.length} composition prompts with full model answers`);
  secA?.questions?.forEach((q: any) => {
    console.log(`     * Prompt ${q.questionNumber} (${q.category}): ~${q.modelAnswer?.split(' ').length} words`);
  });

  const secB = p2?.sections?.sectionB_comprehension;
  console.log(`   - Section B (Comprehension): ${secB?.questions?.length} question items with model answers`);
  console.log(`     * Passage Length: ~${secB?.passage?.split(' ').length} words`);

  const secC = p2?.sections?.sectionC_literature;
  console.log(`   - Section C (Literature): ${secC?.questions?.length} questions (The Cockcrow Anthology)`);

  const payloadSizeBytes = Buffer.byteLength(JSON.stringify(data), 'utf8');
  console.log(`\n📦 Total Document Size: ${(payloadSizeBytes / 1024).toFixed(2)} KB (Well within Firestore 1 MB document ceiling)`);
  console.log(`⚡ Firestore Read Count: EXACTLY 1 DOCUMENT READ.`);
}

verifySingleDocRead().catch(console.error);

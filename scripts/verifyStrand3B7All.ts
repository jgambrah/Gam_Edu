import { createRequire } from 'module';
const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function verifyStrand3B7All() {
  const { OAuth2Client } = req('google-auth-library');
  const { Firestore } = req('@google-cloud/firestore');
  const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');

  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  const db = new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });

  const topicId = 'grammar_lexis_prepositions_and_phrasal_verbs';
  const labs = ['B7_foundation', 'B7_intermediate', 'B7_advanced'];

  console.log("=== CHECKING SUBCOLLECTIONS ===");
  for (const lab of labs) {
    const subDocRef = db.doc(`global_curriculum/jhs/subjects/english/topical/${topicId}/practice_labs/${lab}`);
    const subDoc = await subDocRef.get();
    if (subDoc.exists) {
      const d = subDoc.data() || {};
      const qLen = d.questions?.length || 0;
      const q1 = d.questions[0];
      const q55 = d.questions[qLen - 1];
      console.log(`✅ ${lab}: ${qLen} Qs | Q1: ${q1?.id} | Q55: ${q55?.id} (Capstone: ${q55?.isCapstoneExamPassage})`);
    } else {
      console.log(`❌ ${lab}: NOT FOUND`);
    }
  }

  console.log("\n=== CHECKING MAIN DOC PRACTICE POOLS ===");
  const mainDocRef = db.doc(`global_curriculum/jhs/subjects/english/topical/${topicId}`);
  const mainDoc = await mainDocRef.get();
  if (mainDoc.exists) {
    const md = mainDoc.data() || {};
    const b7Pool = md.levels?.b7?.practicePool || {};
    console.log("Main doc b7 pool counts:", {
      low: b7Pool.low?.length || 0,
      medium: b7Pool.medium?.length || 0,
      hard: b7Pool.hard?.length || 0
    });
    const bytes = Buffer.byteLength(JSON.stringify(md), 'utf8');
    console.log("Main doc total size:", (bytes / 1024).toFixed(2), "KB / 1024 KB limit");
    console.log("Headroom remaining:", (1024 - (bytes / 1024)).toFixed(2), "KB");
  }
}

verifyStrand3B7All()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

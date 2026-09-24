import { createRequire } from 'module';
const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function verifyAllCockcrowLabs() {
  const { OAuth2Client } = req('google-auth-library');
  const { Firestore } = req('@google-cloud/firestore');
  const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');

  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  const db = new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });

  console.log("=================================================");
  console.log("   ALL 9 COCKCROW LABS - FIRESTORE VERIFICATION   ");
  console.log("=================================================");

  const labCodes = [
    'B7_foundation', 'B7_intermediate', 'B7_advanced',
    'B8_foundation', 'B8_intermediate', 'B8_advanced',
    'B9_foundation', 'B9_intermediate', 'B9_advanced'
  ];

  let totalQuestionsCount = 0;

  for (const lab of labCodes) {
    const subDocRef = db.doc(`global_curriculum/jhs/subjects/english/topical/literature_cockcrow_canon/practice_labs/${lab}`);
    const subDoc = await subDocRef.get();
    if (subDoc.exists) {
      const d = subDoc.data() || {};
      const qLen = d.questions?.length || 0;
      totalQuestionsCount += qLen;
      const q1 = d.questions[0];
      const q55 = d.questions[qLen - 1];
      console.log(`✅ ${lab.padEnd(16)}: ${qLen} Qs | Q1: ${q1?.id} | Q55: ${q55?.id} (Capstone: ${q55?.isCapstoneExamPassage})`);
    } else {
      console.log(`❌ ${lab.padEnd(16)}: NOT FOUND`);
    }
  }

  console.log(`\nTotal questions across all 9 subcollections: ${totalQuestionsCount} (Target: 495)`);

  console.log("\n=== MAIN TOPIC DOCUMENT PRACTICE POOLS ===");
  const mainDocRef = db.doc('global_curriculum/jhs/subjects/english/topical/literature_cockcrow_canon');
  const mainDoc = await mainDocRef.get();
  if (mainDoc.exists) {
    const md = mainDoc.data() || {};
    const b7 = md.levels?.b7?.practicePool || {};
    const b8 = md.levels?.b8?.practicePool || {};
    const b9 = md.levels?.b9?.practicePool || {};

    console.log(`B7 Pools -> Low: ${b7.low?.length || 0}, Medium: ${b7.medium?.length || 0}, Hard: ${b7.hard?.length || 0} (Total: ${(b7.low?.length || 0) + (b7.medium?.length || 0) + (b7.hard?.length || 0)})`);
    console.log(`B8 Pools -> Low: ${b8.low?.length || 0}, Medium: ${b8.medium?.length || 0}, Hard: ${b8.hard?.length || 0} (Total: ${(b8.low?.length || 0) + (b8.medium?.length || 0) + (b8.hard?.length || 0)})`);
    console.log(`B9 Pools -> Low: ${b9.low?.length || 0}, Medium: ${b9.medium?.length || 0}, Hard: ${b9.hard?.length || 0} (Total: ${(b9.low?.length || 0) + (b9.medium?.length || 0) + (b9.hard?.length || 0)})`);

    const totalBytes = Buffer.byteLength(JSON.stringify(md), 'utf8');
    console.log("\nMain Document Size:", (totalBytes / 1024).toFixed(2), "KB / 1024 KB limit");
    console.log("Headroom remaining:", (1024 - (totalBytes / 1024)).toFixed(2), "KB");
  }
}

verifyAllCockcrowLabs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  });

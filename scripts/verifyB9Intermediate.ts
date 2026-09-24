import { createRequire } from 'module';
const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function verifyB9Intermediate() {
  const { OAuth2Client } = req('google-auth-library');
  const { Firestore } = req('@google-cloud/firestore');
  const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');

  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  const db = new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });

  console.log("=== CHECKING B9_INTERMEDIATE SUBCOLLECTIONS ===");
  const subDocRef = db.doc('global_curriculum/jhs/subjects/english/topical/literature_cockcrow_canon/practice_labs/B9_intermediate');
  const subDoc = await subDocRef.get();
  console.log("Subcollection doc exists:", subDoc.exists);
  if (subDoc.exists) {
    const data = subDoc.data() || {};
    console.log("Title:", data.title);
    console.log("Total questions count:", data.questions?.length);
    console.log("Q1 ID & Target:", data.questions[0]?.id, "|", data.questions[0]?.competencyTarget);
    console.log("Q50 ID & Target:", data.questions[49]?.id, "|", data.questions[49]?.competencyTarget);
    console.log("Q51 Capstone Passage?:", data.questions[50]?.isCapstoneExamPassage, "| Target:", data.questions[50]?.competencyTarget);
    console.log("Q55 Capstone Passage?:", data.questions[54]?.isCapstoneExamPassage, "| Target:", data.questions[54]?.competencyTarget);
    console.log("Q55 Options count:", data.questions[54]?.options?.length);
  }

  console.log("\n=== CHECKING MAIN TOPIC DOCUMENT PRACTICE POOLS ===");
  const mainDocRef = db.doc('global_curriculum/jhs/subjects/english/topical/literature_cockcrow_canon');
  const mainDoc = await mainDocRef.get();
  if (mainDoc.exists) {
    const md = mainDoc.data() || {};
    const b7 = md.levels?.b7?.practicePool || {};
    const b8 = md.levels?.b8?.practicePool || {};
    const b9 = md.levels?.b9?.practicePool || {};

    console.log("B7 Practice Pools -> Low:", b7.low?.length || 0, "Medium:", b7.medium?.length || 0, "Hard:", b7.hard?.length || 0);
    console.log("B8 Practice Pools -> Low:", b8.low?.length || 0, "Medium:", b8.medium?.length || 0, "Hard:", b8.hard?.length || 0);
    console.log("B9 Practice Pools -> Low:", b9.low?.length || 0, "Medium:", b9.medium?.length || 0, "Hard:", b9.hard?.length || 0);

    const totalBytes = Buffer.byteLength(JSON.stringify(md), 'utf8');
    console.log("\nMain Document Total Size:", (totalBytes / 1024).toFixed(2), "KB / 1024 KB limit");
    console.log("Headroom remaining:", (1024 - (totalBytes / 1024)).toFixed(2), "KB");
  }
}

verifyB9Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  });

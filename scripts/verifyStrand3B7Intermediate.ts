import { createRequire } from 'module';
const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function verifyStrand3B7Intermediate() {
  const { OAuth2Client } = req('google-auth-library');
  const { Firestore } = req('@google-cloud/firestore');
  const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');

  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  const db = new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });

  const topicId = 'grammar_lexis_prepositions_and_phrasal_verbs';
  const subDocRef = db.doc(`global_curriculum/jhs/subjects/english/topical/${topicId}/practice_labs/B7_intermediate`);
  const subDoc = await subDocRef.get();
  console.log("Subdoc exists:", subDoc.exists);
  if (subDoc.exists) {
    const d = subDoc.data() || {};
    console.log("Title:", d.title);
    console.log("Question count:", d.questions?.length);
    console.log("Q1:", d.questions[0]?.id, "-", d.questions[0]?.competencyTarget);
    console.log("Q50:", d.questions[49]?.id, "-", d.questions[49]?.competencyTarget);
    console.log("Q51:", d.questions[50]?.id, "-", d.questions[50]?.competencyTarget, "| Capstone:", d.questions[50]?.isCapstoneExamPassage);
    console.log("Q55:", d.questions[54]?.id, "-", d.questions[54]?.competencyTarget, "| Capstone:", d.questions[54]?.isCapstoneExamPassage);
  }

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
  }
}

verifyStrand3B7Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

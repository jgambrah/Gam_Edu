import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin: any = (admin as any).default || admin;
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
    console.warn("OAuth fallback failed, trying default admin credential:", e);
  }

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
    } catch (e) {}
  }
  return fbAdmin.firestore();
}

async function runSeeding() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  // Load JSON payload using process.cwd() or fallback to scratch directory
  const candidatePaths = [
    path.resolve(process.cwd(), 'scripts', 'strand3GrammarPayload.json'),
    path.resolve(process.cwd(), 'strand3GrammarPayload.json'),
    'C:\\Users\\DELL\\.gemini\\antigravity-ide\brain\\0311eb12-9e31-4c13-8472-97bc7d3125db\\scratch\\strand3GrammarPayload.json'
  ];

  let rawData = '';
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      console.log(`Loading payload from: ${p}`);
      rawData = fs.readFileSync(p, 'utf8');
      break;
    }
  }

  if (!rawData) {
    throw new Error("Could not find strand3GrammarPayload.json in any expected path.");
  }

  const payload = JSON.parse(rawData);

  console.log("Seeding comprehensive Strand 3 Grammar Concept Notes into Firestore...");

  const targetDocPaths = [
    "global_curriculum/jhs/subjects/english/topical/grammar_lexis_prepositions_and_phrasal_verbs",
    "global_curriculum/jhs/subjects/english/topics/grammar_lexis_prepositions_and_phrasal_verbs",
    "global_curriculum/jhs/subjects/english/topical_units/grammar_lexis_prepositions_and_phrasal_verbs"
  ];

  for (const docPath of targetDocPaths) {
    const targetDoc = db.doc(docPath);
    await targetDoc.set({
      ...payload,
      metadata: {
        ...payload.metadata,
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log("✅ SUCCESS: Deployed Strand 3 Sub-Strand 1 Concept Notes to:");
    console.log("   " + targetDoc.path);
  }

  const byteLength = Buffer.byteLength(JSON.stringify(payload), 'utf8');
  console.log(`Payload size: ${(byteLength / 1024).toFixed(2)} KB`);
}

runSeeding()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Strand 3 Concept Notes:", err);
    process.exit(1);
  });

import * as admin from 'firebase-admin';
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

function sanitizePromptText(text: string): string {
  if (!text) return "";
  // Removes (Item \d+), (Case \d+), (Drill \d+), (Scenario \d+), (Context: Item \d+)
  return text
    .replace(/\s*\((?:Context:\s*)?(?:Item|Case|Drill|Scenario)\s+\d+\)/gi, '')
    .trim();
}

function cleanQuestionObject(q: any): any {
  if (!q) return q;
  const originalPrompt = q.prompt || "";
  const cleanedPrompt = sanitizePromptText(originalPrompt);
  return {
    ...q,
    prompt: cleanedPrompt
  };
}

async function cleanAllArtifacts() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Sanitizing prompts: Removing '(Item X)', '(Case X)', '(Drill X)', and '(Scenario X)' from all labs...\n");

  const topics = [
    "reading_comprehension_summary",
    "oral_listening_conversation"
  ];

  const collectionPrefixes = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  const subcollNames = [
    "B7_foundation",
    "B7_intermediate",
    "B7_advanced",
    "B8_foundation",
    "B8_intermediate",
    "B8_advanced",
    "B9_foundation",
    "B9_intermediate",
    "B9_advanced"
  ];

  for (const topic of topics) {
    console.log(`=======================================================`);
    console.log(`PROCESSING TOPIC: ${topic}`);
    console.log(`=======================================================`);

    // 1. Clean subcollections across all path variants
    for (const prefix of collectionPrefixes) {
      for (const sub of subcollNames) {
        const subPath = `${prefix}/${topic}/practice_labs/${sub}`;
        const docRef = db.doc(subPath);
        const docSnap = await docRef.get();

        if (!docSnap.exists) continue;

        const data = docSnap.data();
        if (!data || !Array.isArray(data.questions)) continue;

        let modCount = 0;
        const cleaned = data.questions.map((q: any) => {
          const oldP = q.prompt || "";
          const newP = sanitizePromptText(oldP);
          if (oldP !== newP) modCount++;
          return cleanQuestionObject(q);
        });

        if (modCount > 0) {
          await docRef.set({
            questions: cleaned,
            metadata: {
              ...(data.metadata || {}),
              artifactsCleaned: true,
              lastSanitized: new Date().toISOString()
            }
          }, { merge: true });
          console.log(`✅ Cleaned ${modCount} questions in subcollection: ${subPath}`);
        }
      }
    }

    // 2. Clean main documents (levels.b7, levels.b8, levels.b9, jhs1, jhs2, jhs3, questions)
    for (const prefix of collectionPrefixes) {
      const mainPath = `${prefix}/${topic}`;
      const mainRef = db.doc(mainPath);
      const snap = await mainRef.get();

      if (!snap.exists) continue;

      const data = snap.data();
      const levels = data.levels || {};
      let totalDocMods = 0;

      const updatedLevels = { ...levels };
      for (const lvlKey of Object.keys(updatedLevels)) {
        const lvlData = updatedLevels[lvlKey];
        if (lvlData && lvlData.practicePool) {
          const pool = lvlData.practicePool;
          const cleanTier = (arr: any[]) => {
            if (!Array.isArray(arr)) return arr;
            return arr.map(q => {
              const oldP = q.prompt || "";
              const newP = sanitizePromptText(oldP);
              if (oldP !== newP) totalDocMods++;
              return cleanQuestionObject(q);
            });
          };

          updatedLevels[lvlKey] = {
            ...lvlData,
            practicePool: {
              low: cleanTier(pool.low || []),
              medium: cleanTier(pool.medium || []),
              hard: cleanTier(pool.hard || [])
            }
          };
        }
      }

      // Also clean root questions array if present
      let cleanedQuestions = data.questions;
      if (Array.isArray(data.questions)) {
        cleanedQuestions = data.questions.map((q: any) => {
          const oldP = q.prompt || "";
          const newP = sanitizePromptText(oldP);
          if (oldP !== newP) totalDocMods++;
          return cleanQuestionObject(q);
        });
      }

      if (totalDocMods > 0) {
        await mainRef.set({
          levels: updatedLevels,
          questions: cleanedQuestions,
          metadata: {
            ...(data.metadata || {}),
            artifactsCleaned: true,
            lastSanitized: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log(`✅ Cleaned ${totalDocMods} pool questions in main doc: ${mainPath}`);
      }
    }
  }

  console.log("\n🎉 ALL PROMPTS ARE NOW CLEAN, NATURAL, AND EXAM-STANDARD!");
}

cleanAllArtifacts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error cleaning artifacts:", err);
    process.exit(1);
  });

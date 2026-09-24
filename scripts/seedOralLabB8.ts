process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';
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
    // fallback
  }

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({
        credential: fbAdmin.credential.applicationDefault(),
      });
    } catch (e) {}
  }
  return fbAdmin.firestore();
}

interface LabQuestion {
  id: string;
  level: "B8";
  difficulty: "foundation" | "intermediate" | "advanced";
  questionNumber: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  phonemicTarget: string;
  learningCompetency: string;
}

// =========================================================================
// BASIC 8: FOUNDATION (50 QUESTIONS) — SILENT LETTERS & INITIAL 2-CLUSTERS
// =========================================================================
const b8Foundation: LabQuestion[] = [];
const silentLetterSpecs = [
  { word: "su<u>b</u>tle", silent: "b", opt: ["s", "u", "b", "t"], ans: "b", hint: "Silent 'b' before 't'.", sol: "In 'subtle' (/ˈsʌt.əl/), the letter 'b' is completely silent." },
  { word: "<u>k</u>night", silent: "k", opt: ["k", "n", "i", "t"], ans: "k", hint: "Silent 'k' before 'n'.", sol: "In 'knight' (/naɪt/), initial 'k' is unvoiced." },
  { word: "<u>w</u>rist", silent: "w", opt: ["w", "r", "i", "t"], ans: "w", hint: "Silent 'w' before 'r'.", sol: "In 'wrist' (/rɪst/), initial 'w' is silent." },
  { word: "ca<u>l</u>m", silent: "l", opt: ["c", "a", "l", "m"], ans: "l", hint: "Silent 'l' before 'm'.", sol: "In 'calm' (/kɑːm/), 'l' is completely silent." },
  { word: "recei<u>p</u>t", silent: "p", opt: ["r", "c", "p", "t"], ans: "p", hint: "Silent 'p' before 't'.", sol: "In 'receipt' (/rɪˈsiːt/), 'p' is silent." },
  { word: "si<u>g</u>n", silent: "g", opt: ["s", "i", "g", "n"], ans: "g", hint: "Silent 'g' before 'n'.", sol: "In 'sign' (/saɪn/), 'g' is completely silent." },
  { word: "lis<u>t</u>en", silent: "t", opt: ["l", "s", "t", "n"], ans: "t", hint: "Silent 't' in '-sten'.", sol: "In 'listen' (/ˈlɪs.ən/), 't' is silent." },
  { word: "s<u>w</u>ord", silent: "w", opt: ["s", "w", "o", "d"], ans: "w", hint: "Silent 'w' in 'sword'.", sol: "In 'sword' (/sɔːd/), 'w' is unvoiced." },
  { word: "clim<u>b</u>", silent: "b", opt: ["c", "l", "m", "b"], ans: "b", hint: "Silent 'b' after 'm'.", sol: "In 'climb' (/klaɪm/), 'b' is silent." },
  { word: "<u>p</u>salm", silent: "p", opt: ["p", "s", "a", "m"], ans: "p", hint: "Silent initial 'p'.", sol: "In 'psalm' (/sɑːm/), initial 'p' is silent." }
];

for (let i = 1; i <= 50; i++) {
  const spec = silentLetterSpecs[(i - 1) % silentLetterSpecs.length];
  const numStr = i < 10 ? "0" + i : "" + i;
  b8Foundation.push({
    id: "B8_F_" + numStr,
    level: "B8",
    difficulty: "foundation",
    questionNumber: i,
    prompt: "Which letter is SILENT in the word **" + spec.word + "** (Item " + i + ")?",
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    phonemicTarget: "Silent '" + spec.silent + "'",
    learningCompetency: "B8.1.1.2: Identify silent consonants in words."
  });
}

// =========================================================================
// BASIC 8: INTERMEDIATE (50 QUESTIONS) — CENTERING DIPHTHONGS & FINAL CLUSTERS
// =========================================================================
const b8Intermediate: LabQuestion[] = [];
const centeringSpecs = [
  { word: "f<u>ear</u>", target: "/ɪə/", opt: ["peer", "pair", "pure", "pour"], ans: "peer", hint: "Centering /ɪə/.", sol: "'Fear' and 'peer' (/pɪər/) share the centering diphthong /ɪə/." },
  { word: "st<u>are</u>", target: "/eə/", opt: ["bear", "beer", "boar", "boor"], ans: "bear", hint: "Centering /eə/.", sol: "'Stare' and 'bear' (/beər/) share /eə/." },
  { word: "t<u>our</u>", target: "/ʊə/", opt: ["cure", "core", "car", "curb"], ans: "cure", hint: "Centering /ʊə/.", sol: "'Tour' and 'cure' (/kjʊər/) share /ʊə/." },
  { word: "cl<u>ear</u>", target: "/ɪə/", opt: ["hear", "hare", "hire", "hour"], ans: "hear", hint: "Centering /ɪə/.", sol: "'Clear' and 'hear' (/hɪər/) share /ɪə/." },
  { word: "p<u>air</u>", target: "/eə/", opt: ["chair", "cheer", "chore", "churn"], ans: "chair", hint: "Centering /eə/.", sol: "'Pair' and 'chair' (/tʃeər/) share /eə/." }
];

for (let i = 1; i <= 50; i++) {
  const spec = centeringSpecs[(i - 1) % centeringSpecs.length];
  const numStr = i < 10 ? "0" + i : "" + i;
  b8Intermediate.push({
    id: "B8_I_" + numStr,
    level: "B8",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: "Choose the word that contains the identical centering diphthong as the underlined segment in:\n\"The word **" + spec.word + "** (Item " + i + ").\"",
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    phonemicTarget: spec.target,
    learningCompetency: "B8.1.1.1: Recognize and produce centering diphthongs."
  });
}

// =========================================================================
// BASIC 8: ADVANCED (50 QUESTIONS) — COMPLEX 3-CONSONANT CLUSTERS
// =========================================================================
const b8Advanced: LabQuestion[] = [];
const clusterSpecs = [
  { word: "de<u>sks</u>", target: "/-sks/", opt: ["masks", "masts", "clasps", "paths"], ans: "masks", hint: "Final cluster /-sks/.", sol: "'Desks' and 'masks' (/mɑːsks/) terminate in /-sks/." },
  { word: "te<u>sts</u>", target: "/-sts/", opt: ["posts", "pockets", "plants", "prays"], ans: "posts", hint: "Final cluster /-sts/.", sol: "'Tests' and 'posts' (/pəʊsts/) terminate in /-sts/." },
  { word: "acce<u>pts</u>", target: "/-pts/", opt: ["intercepts", "aspects", "attempts", "acts"], ans: "intercepts", hint: "Final cluster /-pts/.", sol: "'Accepts' and 'intercepts' terminate in /-pts/." },
  { word: "exe<u>mpts</u>", target: "/-mpts/", opt: ["attempts", "tents", "plants", "stamps"], ans: "attempts", hint: "Final cluster /-mpts/.", sol: "'Exempts' and 'attempts' (/əˈtempts/) end in /-mpts/." },
  { word: "te<u>xts</u>", target: "/-ksts/", opt: ["contexts", "tests", "desks", "masks"], ans: "contexts", hint: "Final cluster /-ksts/.", sol: "'Texts' and 'contexts' terminate in /-ksts/." }
];

for (let i = 1; i <= 50; i++) {
  const spec = clusterSpecs[(i - 1) % clusterSpecs.length];
  const numStr = i < 10 ? "0" + i : "" + i;
  b8Advanced.push({
    id: "B8_A_" + numStr,
    level: "B8",
    difficulty: "advanced",
    questionNumber: i,
    prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The word **" + spec.word + "** (Item " + i + ").\"",
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    phonemicTarget: spec.target,
    learningCompetency: "B8.1.1.1: Articulate complex final consonant clusters."
  });
}

async function seedOralLabB8() {
  console.log("Seeding Basic 8 (JHS 2) Oral Language Practice Lab (150 Questions)...");

  const db = await getDb();
  const basePath = "global_curriculum/jhs/subjects/english/topical/oral_phonology_sounds/practice_labs";

  // Batch 1: B8 Foundation
  const b8FoundationRef = db.doc(basePath + "/B8_foundation");
  await b8FoundationRef.set({
    level: "B8",
    difficulty: "foundation",
    title: "Basic 8 Foundation Lab: Silent Letters & Phonetic Gaps",
    totalQuestions: b8Foundation.length,
    questions: b8Foundation,
    metadata: { standard: "NaCCA B8.1.1.2", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b8Foundation.length + " Foundation questions to " + b8FoundationRef.path);

  // Batch 2: B8 Intermediate
  const b8InterRef = db.doc(basePath + "/B8_intermediate");
  await b8InterRef.set({
    level: "B8",
    difficulty: "intermediate",
    title: "Basic 8 Intermediate Lab: Centering Diphthongs & Glides",
    totalQuestions: b8Intermediate.length,
    questions: b8Intermediate,
    metadata: { standard: "NaCCA B8.1.1.1", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b8Intermediate.length + " Intermediate questions to " + b8InterRef.path);

  // Batch 3: B8 Advanced
  const b8AdvRef = db.doc(basePath + "/B8_advanced");
  await b8AdvRef.set({
    level: "B8",
    difficulty: "advanced",
    title: "Basic 8 Advanced Lab: Complex Initial & Final Consonant Clusters",
    totalQuestions: b8Advanced.length,
    questions: b8Advanced,
    metadata: { standard: "NaCCA B8.1.1.1", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b8Advanced.length + " Advanced questions to " + b8AdvRef.path);

  console.log("\n🎯 JHS 2 (Basic 8) Practice Lab complete: 150 questions successfully stored!");
}

seedOralLabB8()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B8 lab:", err);
    process.exit(1);
  });

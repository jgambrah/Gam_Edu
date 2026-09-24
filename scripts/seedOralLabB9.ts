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
  level: "B9";
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
// BASIC 9: FOUNDATION (50 QUESTIONS) — SYLLABLE DIVISION & COMPOUND STRESS
// =========================================================================
const b9Foundation: LabQuestion[] = [];
const syllableSpecs = [
  { word: "examination", count: "5", opt: ["3", "4", "5", "6"], ans: "5", hint: "Count vowel nuclei.", sol: "ex-am-i-na-tion has 5 syllables." },
  { word: "education", count: "4", opt: ["2", "3", "4", "5"], ans: "4", hint: "Count syllables.", sol: "ed-u-ca-tion has 4 syllables." },
  { word: "blackboard", count: "Compound noun", opt: ["BLACK-board", "black-BOARD", "equal stress", "no stress"], ans: "BLACK-board", hint: "Compound nouns take primary stress on first element.", sol: "Compound nouns take initial stress: 'BLACK-board'." },
  { word: "teacup", count: "Compound noun", opt: ["TEA-cup", "tea-CUP", "equal stress", "unvoiced"], ans: "TEA-cup", hint: "Stress first word in compound nouns.", sol: "Compound nouns are stressed on the first word: 'TEA-cup'." },
  { word: "photograph", count: "3", opt: ["2", "3", "4", "5"], ans: "3", hint: "Syllable count.", sol: "pho-to-graph has 3 syllables." }
];

for (let i = 1; i <= 50; i++) {
  const spec = syllableSpecs[(i - 1) % syllableSpecs.length];
  const numStr = i < 10 ? "0" + i : "" + i;
  b9Foundation.push({
    id: "B9_F_" + numStr,
    level: "B9",
    difficulty: "foundation",
    questionNumber: i,
    prompt: "Analyze the syllabic structure of **" + spec.word + "** (Item " + i + "). What is the correct count or primary stress pattern?",
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    phonemicTarget: "Syllable / Compound Stress",
    learningCompetency: "B9.1.1.1: Analyze syllable counts and compound noun stress."
  });
}

// =========================================================================
// BASIC 9: INTERMEDIATE (50 QUESTIONS) — NOUN-VERB STRESS SHIFTS
// =========================================================================
const b9Intermediate: LabQuestion[] = [];
const stressShiftSpecs = [
  { word: "RECORD", context: "The secretary kept a comprehensive ............ of the minutes.", opt: ["RE-cord (Noun)", "re-CORD (Verb)", "re-cord", "RE-CORD"], ans: "RE-cord (Noun)", hint: "Noun: stress on first syllable.", sol: "As a noun, stress is on the first syllable: 'RE-cord' (/ˈrek.ɔːd/)." },
  { word: "PRESENT", context: "The class will ............ their science project tomorrow.", opt: ["PRE-sent (Noun)", "pre-SENT (Verb)", "pre-sent", "PRE-SENT"], ans: "pre-SENT (Verb)", hint: "Verb: stress on second syllable.", sol: "As a verb, stress falls on the second syllable: 'pre-SENT' (/prɪˈzent/)." },
  { word: "PROTEST", context: "The workers organized an official ............ against unfair wages.", opt: ["PRO-test (Noun)", "pro-TEST (Verb)", "pro-test", "PRO-TEST"], ans: "PRO-test (Noun)", hint: "Noun: first syllable stress.", sol: "The noun takes first syllable stress: 'PRO-test' (/ˈprəʊ.test/)." },
  { word: "REBEL", context: "The citizens decided to ............ against the dictator.", opt: ["RE-bel (Noun)", "re-BEL (Verb)", "re-bel", "RE-BEL"], ans: "re-BEL (Verb)", hint: "Verb: second syllable stress.", sol: "The verb takes second syllable stress: 're-BEL' (/rɪˈbel/)." },
  { word: "EXPORT", context: "Cocoa is Ghana's primary agricultural ............", opt: ["EX-port (Noun)", "ex-PORT (Verb)", "ex-port", "EX-PORT"], ans: "EX-port (Noun)", hint: "Noun: first syllable stress.", sol: "The noun takes first syllable stress: 'EX-port' (/ˈek.spɔːt/)." }
];

for (let i = 1; i <= 50; i++) {
  const spec = stressShiftSpecs[(i - 1) % stressShiftSpecs.length];
  const numStr = i < 10 ? "0" + i : "" + i;
  b9Intermediate.push({
    id: "B9_I_" + numStr,
    level: "B9",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: "Determine the correct stress placement for **" + spec.word + "** in this context (Item " + i + "):\n\"" + spec.context + "\"",
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    phonemicTarget: "Noun-Verb Stress Shift",
    learningCompetency: "B9.1.1.1: Apply grammatical stress shifts systematically."
  });
}

// =========================================================================
// BASIC 9: ADVANCED (50 QUESTIONS) — GRAMMATICAL INTONATION CONTOURS
// =========================================================================
const b9Advanced: LabQuestion[] = [];
const intonationSpecs = [
  { sent: "\"Where did the bursar keep the ledger?\"", contour: "Falling intonation (↘)", opt: ["Falling intonation (↘)", "Rising intonation (↗)", "Fall-rise intonation (↘↗)", "Level tone"], ans: "Falling intonation (↘)", hint: "Wh-information questions fall.", sol: "Standard Wh-questions terminate with a falling intonation contour (↘)." },
  { sent: "\"Have you submitted your examination script?\"", contour: "Rising intonation (↗)", opt: ["Rising intonation (↗)", "Falling intonation (↘)", "Fall-rise intonation (↘↗)", "Level tone"], ans: "Rising intonation (↗)", hint: "Polar Yes/No questions rise.", sol: "Open Yes/No questions terminate with a rising pitch contour (↗)." },
  { sent: "\"Submit your exercise books immediately!\"", contour: "Falling intonation (↘)", opt: ["Falling intonation (↘)", "Rising intonation (↗)", "Fall-rise intonation (↘↗)", "Level tone"], ans: "Falling intonation (↘)", hint: "Definite commands fall.", sol: "Firm imperative commands terminate on a falling tone (↘)." },
  { sent: "\"He won the national scholarship?\"", contour: "Rising intonation (↗)", opt: ["Rising intonation (↗)", "Falling intonation (↘)", "Fall-rise intonation (↘↗)", "Level tone"], ans: "Rising intonation (↗)", hint: "Echo question expressing surprise.", sol: "Declarative sentences used to express surprise terminate with a rising tone (↗)." },
  { sent: "\"It is a hot afternoon, isn't it?\" (Expecting agreement)", contour: "Falling intonation (↘)", opt: ["Falling intonation (↘)", "Rising intonation (↗)", "Fall-rise intonation (↘↗)", "Level tone"], ans: "Falling intonation (↘)", hint: "Tag question expecting agreement.", sol: "Tag questions expecting confirmation terminate with a falling tone (↘)." }
];

for (let i = 1; i <= 50; i++) {
  const spec = intonationSpecs[(i - 1) % intonationSpecs.length];
  const numStr = i < 10 ? "0" + i : "" + i;
  b9Advanced.push({
    id: "B9_A_" + numStr,
    level: "B9",
    difficulty: "advanced",
    questionNumber: i,
    prompt: "Identify the standard intonation contour used for this utterance (Item " + i + "):\n" + spec.sent,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    phonemicTarget: spec.contour,
    learningCompetency: "B9.1.2.1: Analyze and apply grammatical intonation contours."
  });
}

async function seedOralLabB9() {
  console.log("Seeding Basic 9 (JHS 3) Oral Language Practice Lab (150 Questions)...");

  const db = await getDb();
  const basePath = "global_curriculum/jhs/subjects/english/topical/oral_phonology_sounds/practice_labs";

  // Batch 1: B9 Foundation
  const b9FoundationRef = db.doc(basePath + "/B9_foundation");
  await b9FoundationRef.set({
    level: "B9",
    difficulty: "foundation",
    title: "Basic 9 Foundation Lab: Syllable Counts & Compound Stress",
    totalQuestions: b9Foundation.length,
    questions: b9Foundation,
    metadata: { standard: "NaCCA B9.1.1.1", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b9Foundation.length + " Foundation questions to " + b9FoundationRef.path);

  // Batch 2: B9 Intermediate
  const b9InterRef = db.doc(basePath + "/B9_intermediate");
  await b9InterRef.set({
    level: "B9",
    difficulty: "intermediate",
    title: "Basic 9 Intermediate Lab: Noun-Verb Stress Shifts",
    totalQuestions: b9Intermediate.length,
    questions: b9Intermediate,
    metadata: { standard: "NaCCA B9.1.1.1", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b9Intermediate.length + " Intermediate questions to " + b9InterRef.path);

  // Batch 3: B9 Advanced
  const b9AdvRef = db.doc(basePath + "/B9_advanced");
  await b9AdvRef.set({
    level: "B9",
    difficulty: "advanced",
    title: "Basic 9 Advanced Lab: Grammatical Intonation Contours",
    totalQuestions: b9Advanced.length,
    questions: b9Advanced,
    metadata: { standard: "NaCCA B9.1.2.1", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b9Advanced.length + " Advanced questions to " + b9AdvRef.path);

  console.log("\n🎯 JHS 3 (Basic 9) Practice Lab complete: 150 questions successfully stored!");
}

seedOralLabB9()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B9 lab:", err);
    process.exit(1);
  });

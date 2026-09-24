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

interface LabQuestion {
  id: string;
  level: "B9";
  difficulty: "advanced";
  questionNumber: number;
  prompt: string;
  passageText: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  competencyTarget: string;
  learningCompetency: string;
}

// 5 Distinct Passage Contexts rotated across the 50 items
const passageContexts = [
  {
    passage: "In mineral-rich forest basins, illegal alluvial mining has devastated local ecosystems. Heavy excavators tear down mature cocoa trees, and miners wash dredged slurries with toxic liquid mercury directly in rivers, destroying vital water bodies that sustain thousands of rural households.",
    task: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary environmental danger of illegal mining.\nWhich candidate answer earns FULL MARKS under WAEC/NaCCA rules?",
    opt: [
      "Destruction of vital river bodies and farmlands.",
      "Illegal mining destroys vital water bodies.",
      "Because of illegal mining, pristine agricultural farmlands and community river bodies are heavily contaminated.",
      "Illegal mining is very destructive."
    ],
    ans: "Illegal mining destroys vital water bodies.",
    hint: "Must be an active grammatical sentence (Subject + Finite Verb + Object), not exceeding 8 words.",
    sol: "'Illegal mining destroys vital water bodies' is exactly 6 words, possesses complete Subject-Verb-Object syntax, and directly answers the prompt. Option A is a fragment (lacks finite verb = 0 marks), Option C has 14 words (violates ceiling), and Option D is too vague.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "The National Road Safety Authority reports that reckless overtaking and nocturnal driver fatigue account for over sixty percent of highway fatalities. To eliminate this carnage, the transport ministry must repair dilapidated highway corridors, install speed-monitoring cameras, and mandate emergency vehicle towing.",
    task: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the author's primary infrastructural solution to highway carnage.\nWhich candidate answer qualifies for FULL MARKS without penalties?",
    opt: [
      "Government must repair dilapidated highway corridors.",
      "Installing speed cameras and repairing bad roads.",
      "To prevent fatal accidents, authorities should definitely install computerized speed cameras on all major highways.",
      "Accidents kill many passengers annually."
    ],
    ans: "Government must repair dilapidated highway corridors.",
    hint: "Ensure the sentence contains an active Subject, Finite Verb, and does not exceed 8 words.",
    sol: "'Government must repair dilapidated highway corridors' is exactly 6 words, grammatically complete, and addresses the prompt. Option B is an unattached fragment (0 marks), Option C has 14 words.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Smallholder agrarian communities across the arid savannah face severe seasonal water scarcity. In response, public health agencies recommend that district assemblies construct decentralized solar-powered boreholes to supply uninterrupted potable groundwater to clinics and basic schools.",
    task: "Why is the summary submission 'Constructing solar-powered boreholes in rural communities' awarded ZERO MARKS under WAEC marking rules?",
    opt: [
      "Because the word count is too short",
      "Because it is an incomplete grammatical fragment lacking a finite verb",
      "Because boreholes are expensive to drill",
      "Because solar energy is an unproven technology"
    ],
    ans: "Because it is an incomplete grammatical fragment lacking a finite verb",
    hint: "A participle ('Constructing...') starting a phrase without an auxiliary or subject cannot stand as an independent sentence.",
    sol: "In WAEC marking criteria, summary answers that are phrases or dependent fragments lacking a finite verb are penalized for grammatical incompleteness and receive zero (0) marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Deforestation severely reduces global carbon sequestration. Tropical rainforests serve as planetary carbon sinks; when living canopies are preserved, trees absorb carbon dioxide from the atmosphere during photosynthesis, drastically lowering greenhouse gas warming.",
    task: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state how trees help combat climate change.\nWhich submission strictly obeys both grammatical and length rules?",
    opt: [
      "Trees absorb carbon dioxide from the atmosphere.",
      "Absorbing carbon dioxide from the atmosphere daily.",
      "Because trees are green, they absorb carbon dioxide greenhouse gases from our air.",
      "Planting trees across the country."
    ],
    ans: "Trees absorb carbon dioxide from the atmosphere.",
    hint: "Count the words: exactly 7 words, Subject ('Trees') + Verb ('absorb') + Object.",
    sol: "'Trees absorb carbon dioxide from the atmosphere' is exactly 7 words, grammatically complete, and scientifically accurate. Option B is a fragment, Option C is 12 words, and Option D is a phrase.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Candidates frequently misunderstand summary instructions by copying long clauses directly from the reading text. For instance, when asked to state a solution in eight words, copying a twenty-five-word sentence verbatim demonstrates a lack of synthesis and synthesis discipline.",
    task: "What penalty is applied by WAEC examiners when a student copies an entire 25-word sentence verbatim from the text for an 8-word summary item?",
    opt: [
      "Full marks are awarded because the sentence is from the passage.",
      "Heavy deductions for mindless lifting and complete forfeiture of marks for exceeding the word ceiling.",
      "The examiner shortens the sentence for the candidate.",
      "The candidate is asked to retake the test."
    ],
    ans: "Heavy deductions for mindless lifting and complete forfeiture of marks for exceeding the word ceiling.",
    hint: "WAEC penalizes both verbatim copying ('lifting') and word count violations.",
    sol: "Verbatim copying incurs expression penalties, and exceeding the prescribed length ceiling by more than 3 words results in a score of zero (0) for that item.",
    target: "Summary Penalty Diagnostics"
  }
];

const b9AdvancedQuestions: LabQuestion[] = [];

for (let i = 1; i <= 50; i++) {
  const spec = passageContexts[(i - 1) % passageContexts.length];
  
  // Format prompt so the passage is displayed first, followed by the question
  const formattedPrompt = 
`📖 PASSAGE CONTEXT:
"${spec.passage}"

❓ TASK:
${spec.task} (Case ${i})`;

  b9AdvancedQuestions.push({
    id: `B9_R_A_${i < 10 ? "0" + i : i}`,
    level: "B9",
    difficulty: "advanced",
    questionNumber: i,
    passageText: spec.passage,
    prompt: formattedPrompt,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B9.2.2.1: Read passage contexts, enforce strict 8-word ceilings, and verify grammatical sentence completeness."
  });
}

async function patchReadingLabB9Advanced() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Patching Basic 9 Advanced Reading Lab to ensure PASSAGE FIRST formatting...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  // 1. Update subcollections
  for (const mainPath of paths) {
    const docRef = db.doc(`${mainPath}/practice_labs/B9_advanced`);
    await docRef.set({
      level: "B9",
      difficulty: "advanced",
      title: "Basic 9 Advanced Lab: 8-Word Ceiling Summaries & Penalty Diagnostics",
      totalQuestions: b9AdvancedQuestions.length,
      hasPassageContextFirst: true,
      questions: b9AdvancedQuestions,
      metadata: {
        standard: "NaCCA B9.2.2.1",
        passageFirstLayout: true,
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${docRef.path}`);
  }

  // 2. Synchronize into Main Topical Document Practice Pool for TopicalLabRunner
  console.log("\nSynchronizing updated B9 Advanced questions into main topical document practice pool...");
  const mappedHardQuestions = b9AdvancedQuestions.map(q => ({
    id: q.id,
    difficulty: 'hard' as const,
    prompt: q.prompt,
    passageText: q.passageText,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1,
    learningCompetency: q.learningCompetency
  }));

  for (const mainPath of paths) {
    const mainRef = db.doc(mainPath);
    const snap = await mainRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      const updatedLevels = {
        ...existingLevels,
        b9: {
          ...(existingLevels.b9 || {}),
          practicePool: {
            ...(existingLevels.b9?.practicePool || {}),
            hard: mappedHardQuestions
          }
        },
        jhs3: {
          ...(existingLevels.jhs3 || {}),
          practicePool: {
            ...(existingLevels.jhs3?.practicePool || {}),
            hard: mappedHardQuestions
          }
        }
      };

      await mainRef.set({
        levels: updatedLevels,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Updated main document practicePool.hard at: ${mainPath}`);
    }
  }

  console.log("\n✅ Successfully updated Basic 9 Advanced Practice Lab with PASSAGE-FIRST format!");
}

patchReadingLabB9Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to patch B9 Advanced Lab:", err);
    process.exit(1);
  });

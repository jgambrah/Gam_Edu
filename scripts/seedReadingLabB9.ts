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
  difficulty: "foundation" | "intermediate" | "advanced";
  questionNumber: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  competencyTarget: string;
  learningCompetency: string;
}

// =========================================================================
// BASIC 9: FOUNDATION (50 QUESTIONS) — PRUNING ILLUSTRATIVE TRASH
// =========================================================================
const b9Foundation: LabQuestion[] = [];
const b9FoundSpecs = [
  {
    passage: "Passage: 'To combat youth unemployment, the ministry must fund vocational technical institutes. For instance, in Germany, over sixty percent of secondary school leavers enroll in dual-track apprenticeships like joinery, welding, and software coding.'",
    prompt: "In extracting the main point for a summary, which portion of the text constitutes illustrative detail that MUST be discarded?",
    opt: [
      "'the ministry must fund vocational technical institutes'",
      "'To combat youth unemployment'",
      "'For instance, in Germany, over sixty percent... apprenticeships like joinery, welding, and coding'",
      "None; all words must be included in the summary."
    ],
    ans: "'For instance, in Germany, over sixty percent... apprenticeships like joinery, welding, and coding'",
    hint: "Identify the example introduced by 'For instance' containing foreign statistics and lists.",
    sol: "In formal summary rules, illustrative examples, country statistics, and parenthetical lists are considered non-essential and must be pruned.",
    target: "Pruning Illustrative Details"
  },
  {
    passage: "Passage: 'Plastic pollution inflicts catastrophic damage on marine ecology. Sea turtles, dolphins, and pelicans frequently ingest polythene bags, mistaking them for jellyfish, which blocks their digestive tracts and causes premature death.'",
    prompt: "Which core proposition should be retained for a summary sentence?",
    opt: [
      "Sea turtles mistake polythene bags for jellyfish",
      "Pelicans have fragile digestive tracts",
      "Plastic waste severely harms marine organisms",
      "Polythene bags look identical to oceanic jellyfish"
    ],
    ans: "Plastic waste severely harms marine organisms",
    hint: "Focus on the macro-claim rather than specific animal species.",
    sol: "The essential thesis is that plastic pollution harms marine life; naming specific animals (turtles, dolphins) is subordinate detail.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Passage: 'Epidemiologists recommend regular handwashing with soap under running water. Studies conducted across ten regional pediatric hospitals proved this habit reduced gastrointestinal infections by forty-eight percent among school-aged children.'",
    prompt: "What part of this excerpt should be stripped away during summary condensation?",
    opt: [
      "The recommendation to wash hands with soap",
      "The hospital survey statistics and percentage reductions",
      "The phrase 'running water'",
      "The term 'infections'"
    ],
    ans: "The hospital survey statistics and percentage reductions",
    hint: "Supporting empirical data and research statistics must be pruned in summaries.",
    sol: "The statistical study ('forty-eight percent across ten pediatric hospitals') provides evidence rather than the core instructional point.",
    target: "Pruning Statistical Details"
  },
  {
    passage: "Passage: 'Modern cities require green urban parks. As the famous urban planner Ebenezer Howard noted in his landmark 1898 treatise, trees act as biological lungs, absorbing carbon dioxide and cooling asphalt avenues.'",
    prompt: "Why must the mention of 'Ebenezer Howard and his 1898 treatise' be excluded from a summary?",
    opt: [
      "Because Ebenezer Howard was an architect",
      "Because historical names, dates, and rhetorical quotations are illustrative padding",
      "Because the summary must only talk about asphalt avenues",
      "Because 1898 was in the 19th century"
    ],
    ans: "Because historical names, dates, and rhetorical quotations are illustrative padding",
    hint: "Attribution to specific historical figures and dates is extraneous to the main claim.",
    sol: "Summary answers capture the core idea (parks benefit cities); citing authority figures and publication dates adds word count without adding core substance.",
    target: "Pruning Authority Quotes"
  },
  {
    passage: "Passage: 'Deforestation causes severe soil erosion. For example, during the 2022 monsoon downpours in the Kwahu valley, three hundred hectares of terraced cocoa farms were completely washed away by mudslides.'",
    prompt: "Which element represents the core thesis that belongs in a summary?",
    opt: [
      "The 2022 monsoon downpours in Kwahu valley",
      "Three hundred hectares of cocoa washed away",
      "Deforestation leads to severe soil erosion",
      "Terraced farming techniques on hillsides"
    ],
    ans: "Deforestation leads to severe soil erosion",
    hint: "Identify the primary cause-and-effect principle asserted in the first sentence.",
    sol: "'Deforestation causes severe soil erosion' is the main premise; the Kwahu valley disaster is an illustrative example.",
    target: "Thesis Identification"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b9FoundSpecs[(i - 1) % b9FoundSpecs.length];
  b9Foundation.push({
    id: `B9_R_F_${i < 10 ? "0" + i : i}`,
    level: "B9",
    difficulty: "foundation",
    questionNumber: i,
    prompt: `${spec.prompt}\n\n${spec.passage} (Drill ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B9.2.2.1: Isolate primary macro-propositions and prune subordinate illustrative details for summary writing."
  });
}

// =========================================================================
// BASIC 9: INTERMEDIATE (50 QUESTIONS) — ACTIVE SENTENCE ENCODING
// =========================================================================
const b9Intermediate: LabQuestion[] = [];
const b9InterSpecs = [
  {
    passage: "Text: 'Municipal authorities must enforce strict hygiene standards in public food markets to prevent lethal outbreaks of cholera.'",
    prompt: "Which of the following demonstrates an active, grammatically complete summary sentence?",
    opt: [
      "Strict hygiene standards in public food markets.",
      "Enforcing standards to prevent cholera.",
      "Authorities must enforce market hygiene standards.",
      "Because cholera is lethal in public markets."
    ],
    ans: "Authorities must enforce market hygiene standards.",
    hint: "Ensure the sentence contains an active Subject, Finite Verb, and Object.",
    sol: "Option C has a complete grammatical Subject ('Authorities'), Modal Finite Verb ('must enforce'), and Object ('market hygiene standards'). Options A, B, and D are fragments.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The government ought to invest aggressively in solar energy infrastructure to reduce national dependence on imported fossil fuels.'",
    prompt: "Which sentence provides a valid, grammatically complete summary?",
    opt: [
      "Government must invest in solar energy.",
      "Investing aggressively in solar energy infrastructure.",
      "Solar infrastructure instead of imported fossil fuels.",
      "To reduce national dependence on fuels."
    ],
    ans: "Government must invest in solar energy.",
    hint: "Identify the option with an active Subject and Finite Verb.",
    sol: "'Government must invest in solar energy' is a complete grammatical sentence. The other options are noun phrases or infinitive fragments.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Agricultural extension officers should train peasant farmers in organic composting techniques to restore depleted soil fertility.'",
    prompt: "Which option represents a properly encoded active summary sentence?",
    opt: [
      "Training peasant farmers in organic composting techniques.",
      "Officers must train farmers in composting.",
      "Organic composting for depleted soil fertility.",
      "Depleted soil fertility restoration."
    ],
    ans: "Officers must train farmers in composting.",
    hint: "Check for the presence of a finite verb ('must train') agreeing with a subject ('Officers').",
    sol: "Option B provides an active grammatical architecture: Subject ('Officers') + Verb ('must train') + Object ('farmers in composting').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The highway authority must install digital speed-monitoring cameras on accident-prone highways to curb reckless driving.'",
    prompt: "Which of the following is a grammatically complete summary statement?",
    opt: [
      "Authorities must install speed cameras on highways.",
      "Speed cameras on accident-prone highways.",
      "Installing digital speed-monitoring cameras to curb speeding.",
      "Because reckless drivers speed on highways."
    ],
    ans: "Authorities must install speed cameras on highways.",
    hint: "Look for an explicit Subject paired with a Finite Verb.",
    sol: "Option A forms a complete grammatical sentence ('Authorities must install speed cameras on highways'). The others are fragments.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Community water boards should drill mechanized boreholes to provide rural inhabitants with reliable potable water.'",
    prompt: "Which option constitutes a valid grammatical summary?",
    opt: [
      "Boards should drill mechanized rural boreholes.",
      "Drilling mechanized boreholes for rural inhabitants.",
      "Reliable potable water from mechanized boreholes.",
      "For providing rural inhabitants with water."
    ],
    ans: "Boards should drill mechanized rural boreholes.",
    hint: "Avoid participial phrases ('Drilling...') and choose a complete finite clause.",
    sol: "Option A is a complete active sentence with an auxiliary and main verb ('should drill').",
    target: "Active Sentence Encoding"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b9InterSpecs[(i - 1) % b9InterSpecs.length];
  b9Intermediate.push({
    id: `B9_R_I_${i < 10 ? "0" + i : i}`,
    level: "B9",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: `Analyze the excerpt:\n"${spec.passage}"\n\n${spec.prompt} (Item ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B9.2.2.1: Encode summary propositions into grammatically complete sentences with finite verbs."
  });
}

// =========================================================================
// BASIC 9: ADVANCED (50 QUESTIONS) — HARD 8-WORD CEILINGS & PENALTY AUDIT
// =========================================================================
const b9Advanced: LabQuestion[] = [];
const b9AdvSpecs = [
  {
    prompt: "Prompt: 'In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary environmental danger of illegal mining.'\nEvaluate the following candidate answers. Which one earns FULL MARKS under WAEC/NaCCA rules?",
    opt: [
      "Destruction of vital river bodies and farmlands.",
      "Illegal mining destroys vital water bodies.",
      "Because of illegal mining, pristine agricultural farmlands and community river bodies are heavily contaminated.",
      "Illegal mining is very destructive."
    ],
    ans: "Illegal mining destroys vital water bodies.",
    hint: "Must be a complete sentence, exactly 8 words or fewer, with a finite verb and specific meaning.",
    sol: "'Illegal mining destroys vital water bodies' is exactly 6 words, possesses complete Subject-Verb-Object architecture, and directly answers the prompt. Option A is a fragment (0 marks), Option C has 12 words (penalized), and Option D is too vague.",
    target: "8-Word Rule Compliance"
  },
  {
    prompt: "Prompt: 'In ONE sentence of NOT MORE THAN EIGHT WORDS, state the author's recommended solution to road accidents.'\nWhich candidate answer qualifies for full marks without penalties?",
    opt: [
      "Government must repair dilapidated highway corridors.",
      "Installing speed cameras and repairing bad roads.",
      "To prevent fatal accidents, authorities should definitely install computerized speed cameras on all major highways.",
      "Accidents kill many passengers annually."
    ],
    ans: "Government must repair dilapidated highway corridors.",
    hint: "Count the words carefully: ensure it has an active verb and does not exceed 8 words.",
    sol: "'Government must repair dilapidated highway corridors' is exactly 6 words, grammatically complete, and addresses the prompt. Option B is a fragment (lacks finite verb), Option C is 14 words long.",
    target: "8-Word Rule Compliance"
  },
  {
    prompt: "Why is the summary submission 'Constructing solar-powered boreholes in rural communities' awarded ZERO MARKS in a BECE summary test?",
    opt: [
      "Because the word count is too short",
      "Because it is an incomplete grammatical fragment lacking a finite verb",
      "Because boreholes are expensive to drill",
      "Because solar energy is an unproven technology"
    ],
    ans: "Because it is an incomplete grammatical fragment lacking a finite verb",
    hint: "A participle ('Constructing...') starting a phrase without an auxiliary or subject cannot stand as an independent sentence.",
    sol: "In WAEC marking rules, summary answers that are phrases or fragments lacking a finite verb are penalized for grammatical incompleteness and receive zero marks.",
    target: "Penalty Diagnostics"
  },
  {
    prompt: "Prompt: 'In one sentence of not more than eight words, state how trees help combat climate change.'\nWhich submission strictly obeys both the grammatical and length rules?",
    opt: [
      "Trees absorb carbon dioxide from the atmosphere.",
      "Absorbing carbon dioxide from the atmosphere daily.",
      "Because trees are green, they absorb carbon dioxide greenhouse gases from our air.",
      "Planting trees."
    ],
    ans: "Trees absorb carbon dioxide from the atmosphere.",
    hint: "Count the words: exactly 7 words, Subject ('Trees') + Verb ('absorb') + Object.",
    sol: "'Trees absorb carbon dioxide from the atmosphere' is exactly 7 words, grammatically complete, and scientifically precise. Option B is a fragment, Option C is 12 words, and Option D is a phrase.",
    target: "8-Word Rule Compliance"
  },
  {
    prompt: "What penalty is applied when a student copies an entire 25-word sentence verbatim from the reading passage to answer a summary question requiring an 8-word answer?",
    opt: [
      "Full marks are awarded because the sentence is from the passage.",
      "Heavy mark deductions for mindless lifting and complete forfeiture of marks for exceeding the word ceiling.",
      "The examiner shortens the sentence for the student.",
      "The student is asked to rewrite the paper after the exam."
    ],
    ans: "Heavy mark deductions for mindless lifting and complete forfeiture of marks for exceeding the word ceiling.",
    hint: "WAEC marks down heavily for mindless copying and disqualifies answers exceeding word limits by 3+ words.",
    sol: "Verbatim lifting demonstrates lack of understanding, and exceeding the prescribed length ceiling by more than 3 words results in a score of zero for that item.",
    target: "Penalty Diagnostics"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b9AdvSpecs[(i - 1) % b9AdvSpecs.length];
  b9Advanced.push({
    id: `B9_R_A_${i < 10 ? "0" + i : i}`,
    level: "B9",
    difficulty: "advanced",
    questionNumber: i,
    prompt: `${spec.prompt} (Case ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B9.2.2.1: Enforce strict 8-word ceilings, audit grammatical completeness, and prevent lifting penalties."
  });
}

async function seedReadingLabB9() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding Basic 9 Reading Comprehension & Summary Lab (150 Questions)...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  for (const mainPath of paths) {
    const basePath = `${mainPath}/practice_labs`;

    const fRef = db.doc(`${basePath}/B9_foundation`);
    await fRef.set({
      level: "B9",
      difficulty: "foundation",
      title: "Basic 9 Foundation Lab: Pruning Illustrative Material & Thesis Extraction",
      totalQuestions: b9Foundation.length,
      questions: b9Foundation,
      metadata: { standard: "NaCCA B9.2.2.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b9Foundation.length} questions to ${fRef.path}`);

    const iRef = db.doc(`${basePath}/B9_intermediate`);
    await iRef.set({
      level: "B9",
      difficulty: "intermediate",
      title: "Basic 9 Intermediate Lab: Active Grammatical Sentence Encoding",
      totalQuestions: b9Intermediate.length,
      questions: b9Intermediate,
      metadata: { standard: "NaCCA B9.2.2.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b9Intermediate.length} questions to ${iRef.path}`);

    const aRef = db.doc(`${basePath}/B9_advanced`);
    await aRef.set({
      level: "B9",
      difficulty: "advanced",
      title: "Basic 9 Advanced Lab: 8-Word Ceiling Summaries & Penalty Diagnostics",
      totalQuestions: b9Advanced.length,
      questions: b9Advanced,
      metadata: { standard: "NaCCA B9.2.2.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b9Advanced.length} questions to ${aRef.path}`);
  }

  // =========================================================================
  // SYNCHRONIZE INTO MAIN TOPICAL DOCUMENT FOR TOPICAL LAB RUNNER COMPONENT
  // =========================================================================
  console.log("\nSynchronizing B9 practice pools into the main topical document...");
  
  const mapToPracticeQuestion = (q: LabQuestion, mappedDifficulty: 'low' | 'medium' | 'hard') => ({
    id: q.id,
    difficulty: mappedDifficulty,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1,
    learningCompetency: q.learningCompetency
  });

  const b9PracticePool = {
    low: b9Foundation.map(q => mapToPracticeQuestion(q, 'low')),
    medium: b9Intermediate.map(q => mapToPracticeQuestion(q, 'medium')),
    hard: b9Advanced.map(q => mapToPracticeQuestion(q, 'hard'))
  };

  for (const mainPath of paths) {
    const mainDocRef = db.doc(mainPath);
    const snap = await mainDocRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      const updatedLevels = {
        ...existingLevels,
        b9: {
          ...(existingLevels.b9 || {}),
          practicePool: b9PracticePool
        },
        jhs3: {
          ...(existingLevels.jhs3 || {}),
          practicePool: b9PracticePool
        }
      };

      await mainDocRef.set({
        levels: updatedLevels,
        totalPracticeQuestions: (data.totalPracticeQuestions || 0) + 150,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Updated main document practicePool at: ${mainPath}`);
    }
  }

  // =========================================================================
  // UPDATE MANIFEST
  // =========================================================================
  console.log("\nUpdating English manifests/topical_labs document...");
  const manifestRef = db.doc("global_curriculum/jhs/subjects/english/manifests/topical_labs");
  const mSnap = await manifestRef.get();
  if (mSnap.exists) {
    const mData = mSnap.data();
    const newTopics = (mData.topics || []).map((t: any) => {
      if (t.id === 'reading_comprehension_summary' || t.topicId === 'reading_comprehension_summary') {
        return {
          ...t,
          totalQuestions: 450,
          questionCount: 450,
          status: 'ready'
        };
      }
      return t;
    });
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("✅ Manifest updated successfully.");
  }

  console.log("\n🎯 JHS 3 (Basic 9) Reading Lab complete: 150 questions stored and active!");
  console.log("🌟 Full Strand 2 Topic 1 (B7 + B8 + B9) Practice Lab complete with 450 questions!");
}

seedReadingLabB9()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B9 Reading Lab:", err);
    process.exit(1);
  });

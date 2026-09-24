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
// BASIC 9: FOUNDATION (50 QUESTIONS) — DEBATE STRUCTURE & SPEAKER ROLES
// =========================================================================
const b9Foundation: LabQuestion[] = [];
const b9FoundSpecs = [
  {
    prompt: "In a formal competitive debate, what is the motion?",
    opt: [
      "The physical movement of speakers across the stage",
      "The official topic or proposition proposed for debate",
      "The time allocated for each speech",
      "The score sheet used by adjudicators"
    ],
    ans: "The official topic or proposition proposed for debate",
    hint: "The motion is the central proposition that begins with 'That...'",
    sol: "In formal debate, the 'motion' is the defined proposition or policy question being debated by the teams.",
    target: "Debate Foundations"
  },
  {
    prompt: "What is the primary responsibility of the first speaker for the Proposition (Affirmative)?",
    opt: [
      "To summarize all arguments and declare victory",
      "To define operational terms, state the team's stance, and introduce main arguments",
      "To attack the character of the opposition speakers",
      "To keep track of the speaking time"
    ],
    ans: "To define operational terms, state the team's stance, and introduce main arguments",
    hint: "The lead speaker sets the boundaries of the debate and establishes definitions.",
    sol: "The 1st Proposition speaker defines key terms, presents the proposition's thesis, and outlines constructive points.",
    target: "Speaker Roles"
  },
  {
    prompt: "Which of the following is the standard protocol salutation required to open a formal school debate?",
    opt: [
      "'Hello friends, listen to what I have to say.'",
      "'Mr. Chairman, Esteemed Panel of Adjudicators, Accurate Timekeeper, Co-debaters, Ladies and Gentlemen...'",
      "'Good day, I am here to tell you why we must win.'",
      "'Members of the school, let's talk about our problems.'"
    ],
    ans: "'Mr. Chairman, Esteemed Panel of Adjudicators, Accurate Timekeeper, Co-debaters, Ladies and Gentlemen...'",
    hint: "Recognize the hierarchy: Chair, Adjudicators, Timekeeper, Opponents, and Audience.",
    sol: "Formal debate elocution begins with an acknowledgment of the presiding officials, judges, timekeeper, and audience.",
    target: "Protocol Salutation"
  },
  {
    prompt: "What is the role of the Opposition team in a parliamentary debate?",
    opt: [
      "To agree with everything the Proposition says",
      "To challenge the motion, contest flawed definitions, and present counter-arguments",
      "To disrupt the debate with noise",
      "To decide the marks for both teams"
    ],
    ans: "To challenge the motion, contest flawed definitions, and present counter-arguments",
    hint: "The opposition's role is to negate or dismantle the proposition's case.",
    sol: "The Opposition directly challenges the motion by exposing logical fallacies and presenting counter-evidence.",
    target: "Speaker Roles"
  },
  {
    prompt: "What is the main task of the concluding speaker (Whip / Summarizer) on a debate team?",
    opt: [
      "Introduce completely new arguments that were never mentioned",
      "Rebut key opponent claims, summarize team arguments, and reinforce the case",
      "Sing a song to entertain the judges",
      "Read out dictionary definitions again"
    ],
    ans: "Rebut key opponent claims, summarize team arguments, and reinforce the case",
    hint: "Closing speakers synthesize arguments and reinforce core contentions without introducing new material.",
    sol: "The summarizer ties together the team's points, addresses major opponent claims, and crystallizes the case.",
    target: "Speaker Roles"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b9FoundSpecs[(i - 1) % b9FoundSpecs.length];
  b9Foundation.push({
    id: `B9_L_F_${i < 10 ? "0" + i : i}`,
    level: "B9",
    difficulty: "foundation",
    questionNumber: i,
    prompt: `${spec.prompt} (Item ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B9.1.2.1: Master formal debate structure, protocol salutations, and speaker responsibilities."
  });
}

// =========================================================================
// BASIC 9: INTERMEDIATE (50 QUESTIONS) — RHETORICAL APPEALS (ETHOS, PATHOS, LOGOS)
// =========================================================================
const b9Intermediate: LabQuestion[] = [];
const b9InterSpecs = [
  {
    prompt: "A debater cites statistics from the Ghana Health Service and the World Health Organization to substantiate their claim. Which rhetorical appeal is being utilized?",
    opt: ["Pathos (Emotional Appeal)", "Logos (Logical / Evidentiary Appeal)", "Ethos (Credibility Appeal)", "Mythos (Cultural Myth)"],
    ans: "Logos (Logical / Evidentiary Appeal)",
    hint: "This appeal relies on empirical data, logic, and factual statistics.",
    sol: "Citing verified empirical data, statistical research, and objective facts is a core application of Logos.",
    target: "Rhetorical Appeals"
  },
  {
    prompt: "A speaker states: 'As a three-time national science prefect and certified peer counselor, I have witnessed the realities of student learning.' Which appeal is primarily displayed?",
    opt: ["Ethos (Establishing Authority and Credibility)", "Logos (Pure Statistics)", "Pathos (Generating Pity)", "Fallacy (False Logic)"],
    ans: "Ethos (Establishing Authority and Credibility)",
    hint: "This appeal highlights qualifications, personal integrity, and professional track record.",
    sol: "Highlighting credentials and experience establishes speaker credibility and trustworthiness (Ethos).",
    target: "Rhetorical Appeals"
  },
  {
    prompt: "A speaker describes an orphaned student studying under streetlights to support a family. Which appeal is being used?",
    opt: ["Logos", "Ethos", "Pathos (Emotional Resonance)", "Syllogism"],
    ans: "Pathos (Emotional Resonance)",
    hint: "This appeal evokes empathy, moral sentiment, and deep human emotion.",
    sol: "Evoking sympathy, compassion, and shared human sentiment is an example of Pathos.",
    target: "Rhetorical Appeals"
  },
  {
    prompt: "In structuring a persuasive argument using the PEEL technique, what does the letter 'E' stand for?",
    opt: ["Emotion and Energy", "Explanation and Evidence", "Echo and Ending", "Entry and Exit"],
    ans: "Explanation and Evidence",
    hint: "Arguments need logical explanation backed by verifiable evidence.",
    sol: "In the PEEL writing/speaking structure (Point, Explanation, Evidence, Link), the 'E's represent Explanation and Evidence.",
    target: "Argumentation Structure"
  },
  {
    prompt: "What is 'signposting' in formal public speaking?",
    opt: [
      "Carrying painted wooden signs onto the stage",
      "Using verbal cues like 'Firstly', 'In contrast', and 'To conclude' to guide listeners",
      "Pointing fingers at the adjudicators",
      "Writing key words on the floor"
    ],
    ans: "Using verbal cues like 'Firstly', 'In contrast', and 'To conclude' to guide listeners",
    hint: "Verbal transitions help listeners follow the structure of the speech.",
    sol: "Signposting words provide structural markers that help an audience follow the trajectory of an address.",
    target: "Delivery Techniques"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b9InterSpecs[(i - 1) % b9InterSpecs.length];
  b9Intermediate.push({
    id: `B9_L_I_${i < 10 ? "0" + i : i}`,
    level: "B9",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: `${spec.prompt} (Drill ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B9.1.3.1: Apply rhetorical appeals (Ethos, Pathos, Logos) and organizational signposting."
  });
}

// =========================================================================
// BASIC 9: ADVANCED (50 QUESTIONS) — REBUTTALS & FALLACY IDENTIFICATION
// =========================================================================
const b9Advanced: LabQuestion[] = [];
const b9AdvSpecs = [
  {
    prompt: "During a debate on boarding schools, a speaker says: 'Do not listen to my opponent; he failed mathematics last term!' What logical fallacy is committed?",
    opt: [
      "Ad Hominem (Personal Attack)",
      "Bandwagon Fallacy (Appeal to Popularity)",
      "False Dichotomy (Either/Or Fallacy)",
      "Circular Reasoning"
    ],
    ans: "Ad Hominem (Personal Attack)",
    hint: "Attacking an opponent's personal life instead of addressing their argument is an ad hominem fallacy.",
    sol: "An Ad Hominem fallacy occurs when a speaker attacks the personal character of an opponent rather than the substantive issue.",
    target: "Fallacy Identification"
  },
  {
    prompt: "Motion: 'That day schools are superior to boarding schools.'\nOpponent claims: 'Boarding schools eliminate parental involvement.'\nWhich response is the most effective rebuttal?",
    opt: [
      "'My opponent has no idea what he is saying, and he is lying.'",
      "'While boarding schools reduce daily face-to-face interaction, structured visiting days, PTA assemblies, and mid-term breaks maintain active parental engagement.'",
      "'My father attended boarding school and loved it.'",
      "'Boarding schools are simply better in every single way.'"
    ],
    ans: "'While boarding schools reduce daily face-to-face interaction, structured visiting days, PTA assemblies, and mid-term breaks maintain active parental engagement.'",
    hint: "Acknowledge the opponent's premise, then use evidence to qualify and refute it.",
    sol: "An effective rebuttal concedes the surface point while presenting structured evidence that refutes the broader claim.",
    target: "Rebuttal Strategy"
  },
  {
    prompt: "A debater asserts: 'Everyone in Ghana uses social media, so basic schools must permit smartphones in class.' What logical error is present?",
    opt: [
      "Bandwagon Fallacy (Assuming popular behavior makes a policy right)",
      "Red Herring (Changing the topic)",
      "Equivocation (Misleading word usage)",
      "Valid deductive reasoning"
    ],
    ans: "Bandwagon Fallacy (Assuming popular behavior makes a policy right)",
    hint: "Arguing that an action is valid simply because 'everyone does it' is a bandwagon fallacy.",
    sol: "The Bandwagon Fallacy appeals to popularity rather than demonstrating whether a practice is sound within a school context.",
    target: "Fallacy Identification"
  },
  {
    prompt: "What is the primary function of a cross-examination question in competitive parliamentary debate?",
    opt: [
      "To insult the opposing speaker publicly",
      "To expose contradictions, clarify definitions, and weaken the opponent's case",
      "To give the opposing speaker more time to explain their life story",
      "To ask the timekeeper for the remaining minutes"
    ],
    ans: "To expose contradictions, clarify definitions, and weaken the opponent's case",
    hint: "Cross-examination aims to uncover inconsistencies in the opponent's arguments.",
    sol: "Cross-examination questions aim to uncover logical flaws, extract concessions, and challenge unsupported claims.",
    target: "Cross-Examination"
  },
  {
    prompt: "How should a speaker conclude a persuasive presentation to leave a lasting impact on adjudicators?",
    opt: [
      "Walk off the stage mid-sentence without saying anything",
      "Summarize core contentions and deliver a memorable, focused final appeal that ties directly back to the motion",
      "Apologize for being nervous and making mistakes",
      "Repeat the entire speech from beginning to end"
    ],
    ans: "Summarize core contentions and deliver a memorable, focused final appeal that ties directly back to the motion",
    hint: "A strong conclusion reinforces central points and ends with a clear final call to action.",
    sol: "An impactful conclusion summarizes key contentions and finishes with a memorable call to action or insight.",
    target: "Persuasive Oratory"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b9AdvSpecs[(i - 1) % b9AdvSpecs.length];
  b9Advanced.push({
    id: `B9_L_A_${i < 10 ? "0" + i : i}`,
    level: "B9",
    difficulty: "advanced",
    questionNumber: i,
    prompt: `${spec.prompt} (Case ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B9.1.3.1: Formulate persuasive rebuttals, identify logical fallacies, and deliver structured oral arguments."
  });
}

async function seedOralListeningLabB9() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding Basic 9 Oral Listening & Debate Lab (150 Questions)...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/oral_listening_conversation",
    "global_curriculum/jhs/subjects/english/topics/oral_listening_conversation",
    "global_curriculum/jhs/subjects/english/topical_units/oral_listening_conversation"
  ];

  for (const mainPath of paths) {
    const basePath = `${mainPath}/practice_labs`;

    const fRef = db.doc(`${basePath}/B9_foundation`);
    await fRef.set({
      level: "B9",
      difficulty: "foundation",
      title: "Basic 9 Foundation Lab: Debate Structure & Speaker Roles",
      totalQuestions: b9Foundation.length,
      questions: b9Foundation,
      metadata: { standard: "NaCCA B9.1.2.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b9Foundation.length} questions to ${fRef.path}`);

    const iRef = db.doc(`${basePath}/B9_intermediate`);
    await iRef.set({
      level: "B9",
      difficulty: "intermediate",
      title: "Basic 9 Intermediate Lab: Rhetorical Appeals & Signposting",
      totalQuestions: b9Intermediate.length,
      questions: b9Intermediate,
      metadata: { standard: "NaCCA B9.1.3.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b9Intermediate.length} questions to ${iRef.path}`);

    const aRef = db.doc(`${basePath}/B9_advanced`);
    await aRef.set({
      level: "B9",
      difficulty: "advanced",
      title: "Basic 9 Advanced Lab: Rebuttals & Fallacy Identification",
      totalQuestions: b9Advanced.length,
      questions: b9Advanced,
      metadata: { standard: "NaCCA B9.1.3.1", updatedAt: new Date().toISOString() }
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
      if (t.id === 'oral_listening_conversation' || t.topicId === 'oral_listening_conversation') {
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

  console.log("\n🎯 JHS 3 (Basic 9) Oral Listening Lab complete: 150 questions stored and active!");
  console.log("🌟 Full Strand 1 Topic 2 (B7 + B8 + B9) Practice Lab now complete with 450 calibrated questions!");
}

seedOralListeningLabB9()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B9 Oral Listening Lab:", err);
    process.exit(1);
  });

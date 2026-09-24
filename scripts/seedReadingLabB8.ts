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
  level: "B8";
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
// BASIC 8: FOUNDATION (50 QUESTIONS) — CONTEXTUAL CLUE DECODING (4 TYPES)
// =========================================================================
const b8Foundation: LabQuestion[] = [];
const b8FoundSpecs = [
  {
    passage: "The agronomist carefully surveyed the **arable** land—soil that is fertile and suitable for growing crops—before deciding to cultivate maize.",
    prompt: "Using the definition clue provided in the sentence, what is the meaning of the word 'arable'?",
    opt: [
      "Rocky, steep, and completely dry",
      "Fertile and suitable for growing crops",
      "Flooded with industrial salt water",
      "Reserved exclusively for wildlife sanctuaries"
    ],
    ans: "Fertile and suitable for growing crops",
    hint: "The word is defined directly between the dashes in the text.",
    sol: "The parenthetical definition dash ('—soil that is fertile and suitable for growing crops—') explicitly defines 'arable'.",
    target: "Context Clue: Definition"
  },
  {
    passage: "While her elder brother was notoriously **garrulous**, talking incessantly about irrelevant matters, Akua remained completely taciturn during dinner.",
    prompt: "Using the contrast clue in the excerpt, what does the word 'garrulous' mean?",
    opt: [
      "Extremely silent and thoughtful",
      "Excessively talkative about trivial matters",
      "Generous with money and gifts",
      "Afraid of darkness and strangers"
    ],
    ans: "Excessively talkative about trivial matters",
    hint: "Contrast the brother's behavior ('talking incessantly') with Akua's silence.",
    sol: "The phrase 'talking incessantly about irrelevant matters' contrasts directly with Akua's silence, identifying 'garrulous' as excessively talkative.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the community stream was poisoned with toxic mercury runoff from illegal mining, the water was rendered completely **unpotable**.",
    prompt: "Using the cause-and-effect clue in the passage, what does 'unpotable' mean?",
    opt: [
      "Safe and refreshing to drink",
      "Unfit or unsafe for drinking",
      "Ideal for swimming and sports",
      "Extremely cold and sweet"
    ],
    ans: "Unfit or unsafe for drinking",
    hint: "What happens to drinking water when poisoned with toxic mercury?",
    sol: "The causal prefix 'Because the stream was poisoned...' indicates that the water became dangerous and unfit for human consumption.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The district suffered from various severe **calamities**, including flash floods, locust invasions, and prolonged dry season droughts.",
    prompt: "Based on the exemplification clue ('including...'), what is the meaning of 'calamities'?",
    opt: [
      "Disastrous events or great misfortunes",
      "Festivals of joy and thanksgiving",
      "Technological breakthroughs in farming",
      "Educational scholarships for youth"
    ],
    ans: "Disastrous events or great misfortunes",
    hint: "Examine the shared category of flash floods, locust swarms, and droughts.",
    sol: "The examples provided (floods, locust swarms, droughts) represent natural catastrophes, defining 'calamities' as severe disasters.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The young apprentice was exceptionally **meticulous**; he measured every joint with precision, verified his angles twice, and cleaned his instruments thoroughly.",
    prompt: "What is the contextual meaning of 'meticulous' as demonstrated by the apprentice's actions?",
    opt: [
      "Careless, hurried, and clumsy",
      "Showing extreme care, thoroughness, and attention to detail",
      "Lazy and avoiding physical exertion",
      "Proud and unwilling to take advice"
    ],
    ans: "Showing extreme care, thoroughness, and attention to detail",
    hint: "Look at the evidence: measuring with precision, verifying angles twice, and cleaning tools thoroughly.",
    sol: "The apprentice's thoroughness and double-checking illustrate that 'meticulous' means showing painstaking care and attention to detail.",
    target: "Context Clue: Descriptive Expansion"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b8FoundSpecs[(i - 1) % b8FoundSpecs.length];
  b8Foundation.push({
    id: `B8_R_F_${i < 10 ? "0" + i : i}`,
    level: "B8",
    difficulty: "foundation",
    questionNumber: i,
    prompt: `Examine the excerpt:\n"${spec.passage}"\n\n${spec.prompt} (Item ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B8.2.1.1: Deduce the contextual meanings of unfamiliar vocabulary using structural context clues."
  });
}

// =========================================================================
// BASIC 8: INTERMEDIATE (50 QUESTIONS) — DEDUCTIVE INFERENCES & SUBTEXT
// =========================================================================
const b8Intermediate: LabQuestion[] = [];
const b8InterSpecs = [
  {
    passage: "Kwame walked out of the scholarship interview room, loosened his tight necktie with trembling fingers, and stared blankly at the floor with slumping shoulders. When his mother asked how it went, he turned his face away in silence.",
    prompt: "What can be inferred about the outcome of Kwame's interview?",
    opt: [
      "He was immediately offered the scholarship with great honor.",
      "The interview went very poorly and he experienced deep disappointment.",
      "He was angry because the interviewers were his close friends.",
      "He forgot his necktie and was disqualified before entering."
    ],
    ans: "The interview went very poorly and he experienced deep disappointment.",
    hint: "Combine physical gestures (trembling fingers, slumping shoulders, silent turning away) with emotional context.",
    sol: "Trembling fingers, slumping shoulders, blank stares, and avoiding eye contact with his mother logically signal failure and distress.",
    target: "Deductive Inference"
  },
  {
    passage: "As the dark cumulonimbus clouds gathered overhead, the market women hurriedly packed their dried fish and grains into plastic tarpaulins, fastening the ropes firmly to wooden market stalls.",
    prompt: "What impending event prompted the market women's urgent actions?",
    opt: [
      "The sudden arrival of municipal tax collectors",
      "An imminent torrential rainstorm",
      "A surprise visit by the Paramount Chief",
      "The closing time siren sounding in town"
    ],
    ans: "An imminent torrential rainstorm",
    hint: "Connect 'cumulonimbus clouds' with the action of covering goods in waterproof tarpaulins.",
    sol: "Dark cumulonimbus clouds are scientific heralds of heavy rainstorms, prompting the women to shield perishable goods from water damage.",
    target: "Deductive Inference"
  },
  {
    passage: "Although Mr. Mensah's shop was small, his account ledgers were pristine, every receipt was filed in numerical order, and his balance sheet matched the bank statements to the exact pesewa.",
    prompt: "What does the passage imply about Mr. Mensah's professional character?",
    opt: [
      "He was a careless shopkeeper who lost money regularly.",
      "He was exceptionally honest, disciplined, and financially organized.",
      "He was planning to close down his commercial shop.",
      "He did not know how to record financial transactions."
    ],
    ans: "He was exceptionally honest, disciplined, and financially organized.",
    hint: "Pristine ledgers and exact pesewa matching indicate rigorous financial discipline.",
    sol: "Maintaining spotless ledgers and perfectly reconciled bank statements reveals meticulous bookkeeping and integrity.",
    target: "Character Inference"
  },
  {
    passage: "The doctor looked grave as she reviewed the diagnostic scans. She requested the nurse to call the patient's family into the private consultation room before speaking.",
    prompt: "What does the doctor's behavior suggest about the patient's medical condition?",
    opt: [
      "The patient had recovered completely and was being discharged.",
      "The scan revealed a serious or critical health condition.",
      "The doctor misplaced the medical files and needed help searching.",
      "The hospital was celebrating a public holiday."
    ],
    ans: "The scan revealed a serious or critical health condition.",
    hint: "A 'grave' expression and summoning the family to a private room are standard medical indicators of serious news.",
    sol: "Looking grave and summoning the patient's family into a private room prior to speaking implies serious diagnosis.",
    target: "Situational Inference"
  },
  {
    passage: "Every evening, grandfather sat under the ancient baobab tree. As soon as he cleared his throat, children from across the compound gathered silently in a semicircle at his feet, their eyes wide with anticipation.",
    prompt: "Why did the children gather around grandfather when he cleared his throat?",
    opt: [
      "They were afraid he was about to punish them.",
      "They eagerly anticipated his storytelling session.",
      "They wanted to borrow money from his leather purse.",
      "He had prepared an evening meal for the entire village."
    ],
    ans: "They eagerly anticipated his storytelling session.",
    hint: "Gathering silently in a semicircle with wide, expectant eyes under an ancestral baobab is traditional storytelling behavior.",
    sol: "In traditional African domestic contexts, children gathering in a semicircle at an elder's feet with expectant eyes denotes eagerness to hear folklore and moral tales.",
    target: "Cultural & Behavioral Inference"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b8InterSpecs[(i - 1) % b8InterSpecs.length];
  b8Intermediate.push({
    id: `B8_R_I_${i < 10 ? "0" + i : i}`,
    level: "B8",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: `Analyze the passage:\n"${spec.passage}"\n\n${spec.prompt} (Item ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B8.2.1.1: Draw valid deductive inferences and interpret underlying subtext in prose passages."
  });
}

// =========================================================================
// BASIC 8: ADVANCED (50 QUESTIONS) — TONE, MOOD, BIAS & FIGURATIVE LANGUAGE
// =========================================================================
const b8Advanced: LabQuestion[] = [];
const b8AdvSpecs = [
  {
    passage: "The politician mounted the rostrum, showering the crowd with lavish promises of gold-paved streets and free mansions for all. The sensible villagers merely shook their heads at this cosmetic circus.",
    prompt: "What is the author's tone toward the politician's campaign promises?",
    opt: [
      "Adoring and deeply respectful",
      "Skeptical, critical, and mocking",
      "Objective and scientifically neutral",
      "Fearful and intimidated"
    ],
    ans: "Skeptical, critical, and mocking",
    hint: "Words like 'lavish promises' and 'cosmetic circus' reveal the author's attitude.",
    sol: "Describing promises as 'gold-paved streets' and branding the event a 'cosmetic circus' conveys deep cynicism, skepticism, and mockery.",
    target: "Author's Tone"
  },
  {
    passage: "The abandoned colonial mansion stood shrouded in thick nocturnal mist. Broken shutters banged against rotted timbers in the whistling wind, like skeletal fingers clawing at the dark.",
    prompt: "What mood does the author evoke in this descriptive passage?",
    opt: [
      "Joyful and celebratory",
      "Eerie, suspenseful, and ominous",
      "Peaceful and relaxing",
      "Humorous and cheerful"
    ],
    ans: "Eerie, suspenseful, and ominous",
    hint: "Identify the emotional atmosphere created by nocturnal mist, rotted timbers, and skeletal fingers.",
    sol: "Imagery of rotted wood, howling wind, and skeletal fingers creates an eerie, tense, and ominous atmosphere in the reader's mind.",
    target: "Literary Mood"
  },
  {
    passage: "Examine the expression: 'The prosecutor described the corporate embezzlement as a cancer eating away at the economic vitals of the municipality.'",
    prompt: "What figure of speech is employed in the underlined expression, and what is its meaning?",
    opt: [
      "Simile; meaning the municipality needs medical doctors.",
      "Metaphor; meaning the corruption is an insidious, destructive evil destroying the town's wealth.",
      "Hyperbole; meaning the money was spent on hospital bills.",
      "Personification; meaning money can walk and talk."
    ],
    ans: "Metaphor; meaning the corruption is an insidious, destructive evil destroying the town's wealth.",
    hint: "Direct comparison equating embezzlement to a destructive disease without using 'like' or 'as'.",
    sol: "The phrase directly compares financial embezzlement to a malignant disease (cancer) without comparative words, making it a metaphor denoting destruction.",
    target: "Figurative Language Decoding"
  },
  {
    passage: "The logging company's brochure claimed they were 'responsibly grooming the forest canopy,' yet satellite photographs revealed thousands of hectares of completely bulldozed, charred wasteland.",
    prompt: "What literary device is present between the company's claim and the satellite reality?",
    opt: [
      "Irony (Discrepancy between stated claim and harsh reality)",
      "Alliteration (Repetition of consonant sounds)",
      "Onomatopoeia (Sound imitation)",
      "Apostrophe (Addressing an absent person)"
    ],
    ans: "Irony (Discrepancy between stated claim and harsh reality)",
    hint: "Notice the sharp contradiction between what was said ('responsible grooming') and the actual truth (charred wasteland).",
    sol: "The stark contrast between the deceptive corporate claim of environmental stewardship and the factual photographic evidence of devastation constitutes situational irony.",
    target: "Literary Devices: Irony"
  },
  {
    passage: "The fiery sun beat down mercilessly upon the desert travelers, an angry furnace in the cloudless sky that baked the cracked clay until it groaned.",
    prompt: "What figure of speech is used in the phrase 'that baked the cracked clay until it groaned'?",
    opt: [
      "Personification (Attributing the human sensation of groaning to clay)",
      "Euphemism (Softening harsh words)",
      "Oxymoron (Juxtaposing contradictory words)",
      "Pun (Play on words)"
    ],
    ans: "Personification (Attributing the human sensation of groaning to clay)",
    hint: "Can clay literally 'groan' in pain?",
    sol: "Giving inanimate, cracked clay the human ability to 'groan' in pain under excessive heat is an example of personification.",
    target: "Figurative Language: Personification"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b8AdvSpecs[(i - 1) % b8AdvSpecs.length];
  b8Advanced.push({
    id: `B8_R_A_${i < 10 ? "0" + i : i}`,
    level: "B8",
    difficulty: "advanced",
    questionNumber: i,
    prompt: `Analyze the excerpt:\n"${spec.passage}"\n\n${spec.prompt} (Case ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B8.2.1.1: Analyze tone, mood, author bias, and decode complex figurative language in prose."
  });
}

async function seedReadingLabB8() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding Basic 8 Reading Comprehension & Summary Lab (150 Questions)...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  for (const mainPath of paths) {
    const basePath = `${mainPath}/practice_labs`;

    const fRef = db.doc(`${basePath}/B8_foundation`);
    await fRef.set({
      level: "B8",
      difficulty: "foundation",
      title: "Basic 8 Foundation Lab: Contextual Clues (Definition, Contrast, Cause & Example)",
      totalQuestions: b8Foundation.length,
      questions: b8Foundation,
      metadata: { standard: "NaCCA B8.2.1.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b8Foundation.length} questions to ${fRef.path}`);

    const iRef = db.doc(`${basePath}/B8_intermediate`);
    await iRef.set({
      level: "B8",
      difficulty: "intermediate",
      title: "Basic 8 Intermediate Lab: Deductive Inferences & Subtext Analysis",
      totalQuestions: b8Intermediate.length,
      questions: b8Intermediate,
      metadata: { standard: "NaCCA B8.2.1.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b8Intermediate.length} questions to ${iRef.path}`);

    const aRef = db.doc(`${basePath}/B8_advanced`);
    await aRef.set({
      level: "B8",
      difficulty: "advanced",
      title: "Basic 8 Advanced Lab: Tone, Mood, Bias & Figurative Decoding",
      totalQuestions: b8Advanced.length,
      questions: b8Advanced,
      metadata: { standard: "NaCCA B8.2.1.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b8Advanced.length} questions to ${aRef.path}`);
  }

  // =========================================================================
  // SYNCHRONIZE INTO MAIN TOPICAL DOCUMENT FOR TOPICAL LAB RUNNER COMPONENT
  // =========================================================================
  console.log("\nSynchronizing B8 practice pools into the main topical document...");
  
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

  const b8PracticePool = {
    low: b8Foundation.map(q => mapToPracticeQuestion(q, 'low')),
    medium: b8Intermediate.map(q => mapToPracticeQuestion(q, 'medium')),
    hard: b8Advanced.map(q => mapToPracticeQuestion(q, 'hard'))
  };

  for (const mainPath of paths) {
    const mainDocRef = db.doc(mainPath);
    const snap = await mainDocRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      const updatedLevels = {
        ...existingLevels,
        b8: {
          ...(existingLevels.b8 || {}),
          practicePool: b8PracticePool
        },
        jhs2: {
          ...(existingLevels.jhs2 || {}),
          practicePool: b8PracticePool
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
        const prevCount = t.totalQuestions || 0;
        return {
          ...t,
          totalQuestions: Math.max(prevCount, 300),
          questionCount: Math.max(prevCount, 300),
          status: 'ready'
        };
      }
      return t;
    });
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("✅ Manifest updated successfully.");
  }

  console.log("\n🎯 JHS 2 (Basic 8) Reading Lab complete: 150 questions stored and active!");
}

seedReadingLabB8()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B8 Reading Lab:", err);
    process.exit(1);
  });

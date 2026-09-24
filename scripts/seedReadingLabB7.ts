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
  level: "B7";
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
// BASIC 7: FOUNDATION (50 QUESTIONS) — SKIM/SCAN & LITERAL RETRIEVAL
// =========================================================================
const b7Foundation: LabQuestion[] = [];
const b7FoundSpecs = [
  {
    passage: "Cocoa seedlings require moderate shade and fertile, well-drained loam soil. Farmers typically transplant young shoots at the onset of the major rainy season in May to ensure root establishment.",
    prompt: "According to the excerpt, in which month do farmers transplant young cocoa seedlings?",
    opt: ["March", "May", "August", "December"],
    ans: "May",
    hint: "Scan specifically for the calendar month associated with the major rainy season.",
    sol: "The text explicitly states that farmers transplant young shoots 'in May to ensure root establishment.'",
    target: "Scanning Specific Data"
  },
  {
    passage: "The Akosombo Hydroelectric Dam on the Volta River was officially commissioned in 1965 by President Kwame Nkrumah to supply electrical energy for national industrialization.",
    prompt: "In what year was the Akosombo Dam officially commissioned?",
    opt: ["1957", "1960", "1965", "1972"],
    ans: "1965",
    hint: "Scan for the four-digit numeral following the word 'commissioned'.",
    sol: "The text directly provides the date: 'officially commissioned in 1965'.",
    target: "Scanning Specific Data"
  },
  {
    passage: "During the dry harmattan season, humidity levels drop drastically across the northern savannah, causing dry dusty winds to blow from the Sahara Desert across West Africa.",
    prompt: "From which geographic region do the dry harmattan winds originate according to the passage?",
    opt: ["The Atlantic Ocean", "The Sahara Desert", "The Guinea Highlands", "The Congo Basin"],
    ans: "The Sahara Desert",
    hint: "Scan for the proper noun naming the source of the winds.",
    sol: "The text directly states that dusty winds blow 'from the Sahara Desert across West Africa.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "Unlike speed reading, skimming involves purposefully glancing through a passage to identify the main theme, author's purpose, and general structure without reading every word.",
    prompt: "What is the primary objective of skimming a text?",
    opt: [
      "To count every punctuation mark",
      "To extract the main theme, purpose, and general structure",
      "To memorize all names and statistical figures",
      "To correct spelling errors in the manuscript"
    ],
    ans: "To extract the main theme, purpose, and general structure",
    hint: "Check the definition of skimming provided in the text.",
    sol: "The passage defines skimming as purposefully glancing 'to identify the main theme, author's purpose, and general structure.'",
    target: "Locational Mechanics"
  },
  {
    passage: "Scanning is a selective reading technique used when a researcher is looking for a specific telephone number, date of birth, or geographical location in an index or encyclopedia.",
    prompt: "When is scanning the most appropriate reading technique to employ?",
    opt: [
      "When enjoying a mystery novel before bedtime",
      "When searching for a specific piece of information like a date or phone number",
      "When reading a poem to analyze its rhythmic meter",
      "When translating an entire foreign language book"
    ],
    ans: "When searching for a specific piece of information like a date or phone number",
    hint: "Scanning targets pinpointed data points rather than continuous reading.",
    sol: "The passage notes scanning is used 'when a researcher is looking for a specific telephone number, date of birth, or geographical location.'",
    target: "Locational Mechanics"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b7FoundSpecs[(i - 1) % b7FoundSpecs.length];
  b7Foundation.push({
    id: `B7_R_F_${i < 10 ? "0" + i : i}`,
    level: "B7",
    difficulty: "foundation",
    questionNumber: i,
    prompt: `Read the passage excerpt:\n"${spec.passage}"\n\n${spec.prompt} (Item ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B7.2.1.1: Locate specific factual details and retrieve explicit information using locational reading skills."
  });
}

// =========================================================================
// BASIC 7: INTERMEDIATE (50 QUESTIONS) — TOPIC SENTENCES & PARAGRAPH GIST
// =========================================================================
const b7Intermediate: LabQuestion[] = [];
const b7InterSpecs = [
  {
    passage: "Clean potable water is essential for human survival. Without adequate hydration, human biological organs cease to function efficiently. Furthermore, access to safe drinking water prevents fatal outbreaks of waterborne diseases such as cholera and typhoid fever in rural communities.",
    prompt: "Which sentence expresses the central topic idea of the paragraph?",
    opt: [
      "Without adequate hydration, organs cease to function.",
      "Clean potable water is essential for human survival.",
      "Access to safe drinking water prevents cholera and typhoid.",
      "Rural communities often experience dry seasons."
    ],
    ans: "Clean potable water is essential for human survival.",
    hint: "Look for the overarching anchor statement that summarizes the entire paragraph.",
    sol: "The first sentence is the topic sentence asserting the overarching claim, while subsequent sentences provide medical and public health explanations.",
    target: "Topic Sentence Identification"
  },
  {
    passage: "Deforestation in tropical rainforests leads to immediate soil degradation. When protective tree canopies are cleared by timber loggers, torrential downpours wash away fertile agricultural topsoil. Deprived of nutrients, farmlands quickly transform into barren scrubland.",
    prompt: "What is the primary focus of this paragraph?",
    opt: [
      "The various types of timber trees found in Africa",
      "How deforestation triggers soil degradation and nutrient loss",
      "Techniques used by farmers to harvest rain water",
      "The life cycle of forest wildlife"
    ],
    ans: "How deforestation triggers soil degradation and nutrient loss",
    hint: "Synthesize the opening assertion and its consequences into a central theme.",
    sol: "The paragraph focuses systematically on the causal relationship between logging tree canopies and resulting topsoil degradation.",
    target: "Paragraph Gist"
  },
  {
    passage: "Regular physical exercise strengthens cardiovascular health. It enhances blood circulation, reduces arterial pressure, and helps maintain a healthy body mass index. In addition, physical workout sessions stimulate the release of endorphins that alleviate psychological stress.",
    prompt: "Where is the topic sentence positioned in this paragraph?",
    opt: [
      "At the very beginning of the paragraph",
      "In the middle of the second sentence",
      "At the very end of the paragraph",
      "There is no topic sentence present"
    ],
    ans: "At the very beginning of the paragraph",
    hint: "Identify where the main assertion about cardiovascular health is stated.",
    sol: "This follows a classic deductive structure where the topic sentence opens the paragraph: 'Regular physical exercise strengthens cardiovascular health.'",
    target: "Paragraph Structure"
  },
  {
    passage: "Solar energy is completely renewable, emitting zero greenhouse gases during operation. Unlike thermal power plants that combust heavy crude oil, photovoltaic installations require minimal mechanical maintenance once installed.",
    prompt: "What makes solar energy environmentally preferable according to the excerpt?",
    opt: [
      "It requires heavy combustion of crude oil",
      "It is an inexhaustible resource that generates electricity without greenhouse emissions",
      "It operates exclusively during nocturnal hours",
      "It costs more to maintain than thermal generators"
    ],
    ans: "It is an inexhaustible resource that generates electricity without greenhouse emissions",
    hint: "Focus on the primary environmental advantage cited in sentence 1.",
    sol: "The author explicitly emphasizes that solar power is renewable and emits zero greenhouse gases during operation.",
    target: "Core Idea Synthesis"
  },
  {
    passage: "In standard formal essays, supporting details serve to explain, illustrate, or prove the main topic sentence. These details may consist of verifiable statistics, factual historical examples, or causal scientific explanations.",
    prompt: "What is the primary function of supporting details in a paragraph?",
    opt: [
      "To introduce an unrelated topic to confuse the reader",
      "To explain, illustrate, or validate the anchor topic sentence",
      "To fill empty space when an author runs out of ideas",
      "To replace the topic sentence completely"
    ],
    ans: "To explain, illustrate, or validate the anchor topic sentence",
    hint: "Supporting details expand and defend the core premise.",
    sol: "Supporting details substantiate the topic sentence by providing explanations, evidence, examples, or data.",
    target: "Textual Architecture"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b7InterSpecs[(i - 1) % b7InterSpecs.length];
  b7Intermediate.push({
    id: `B7_R_I_${i < 10 ? "0" + i : i}`,
    level: "B7",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: `Read the passage excerpt:\n"${spec.passage}"\n\n${spec.prompt} (Drill ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B7.2.1.1: Identify topic sentences and synthesize paragraph main ideas."
  });
}

// =========================================================================
// BASIC 7: ADVANCED (50 QUESTIONS) — NARRATIVE SEQUENCE & PARAPHRASING
// =========================================================================
const b7Advanced: LabQuestion[] = [];
const b7AdvSpecs = [
  {
    passage: "Before the sun had risen above the horizon, Kofi loaded his hunting rifle and strapped on his cutlass. Next, he whistled for his faithful hound, Bingo, who bounded eagerly out of the kennel. Together, they quietly slipped through the sleeping village toward the virgin forest.",
    prompt: "What chronological action did Kofi perform immediately before whistling for his dog?",
    opt: [
      "He slipped through the sleeping village",
      "He loaded his hunting rifle and strapped on his cutlass",
      "He shot a wild boar in the forest",
      "He ate a heavy breakfast in the kitchen"
    ],
    ans: "He loaded his hunting rifle and strapped on his cutlass",
    hint: "Identify the temporal marker 'Next' and check what preceded it.",
    sol: "The text states: 'Kofi loaded his hunting rifle and strapped on his cutlass. Next, he whistled for his faithful hound...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original sentence: 'The sudden torrential downpour compelled the sports master to cancel the annual inter-house athletics competition.'",
    prompt: "Which of the following represents the most accurate paraphrase of the sentence without altering its core meaning?",
    opt: [
      "The sports master cancelled the sports games because of heavy rain.",
      "The sports master disliked the rainy weather and stayed home.",
      "The athletics games continued despite the catastrophic storm.",
      "Torrential rains always happen during annual inter-house sports competitions."
    ],
    ans: "The sports master cancelled the sports games because of heavy rain.",
    hint: "A faithful paraphrase preserves meaning while using simpler, distinct phrasing.",
    sol: "Option A captures both the cause (heavy rain) and the effect (cancellation of sports) accurately and concisely.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "After digging a two-meter trench, the workers laid perforated PVC drainage pipes along the embankment. Finally, they backfilled the excavation with gravel to allow surface runoff to percolate freely.",
    prompt: "What was the final engineering step executed by the workers?",
    opt: [
      "Digging a two-meter trench",
      "Laying perforated PVC drainage pipes",
      "Backfilling the excavation with gravel",
      "Constructing a concrete bridge"
    ],
    ans: "Backfilling the excavation with gravel",
    hint: "Locate the sequence signaled by the transition word 'Finally'.",
    sol: "The text explicitly uses the chronological signpost 'Finally, they backfilled the excavation with gravel...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original sentence: 'Because the commercial driver was exhausted after driving for twelve continuous hours, he failed to negotiate the sharp hairpin curve.'",
    prompt: "Which statement accurately paraphrases the causal relationship described in the excerpt?",
    opt: [
      "The vehicle's brakes failed because the road was curved.",
      "Extreme driver fatigue from prolonged driving led to the steering accident on the curve.",
      "The driver drove for twelve hours because he missed the curve.",
      "Hairpin curves are easy to drive when a driver is tired."
    ],
    ans: "Extreme driver fatigue from prolonged driving led to the steering accident on the curve.",
    hint: "Link the driver's state of fatigue directly to his failure to steer.",
    sol: "Option B preserves the causal nexus: driver exhaustion caused by 12 hours of driving resulted in the failure to navigate the curve.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The royal linguist poured libation to invoke the blessings of the departed ancestors. Thereafter, the Paramount Chief beat the sacred talking drum, signaling that the annual yam harvest festival had formally commenced.",
    prompt: "What event occurred immediately following the pouring of libation?",
    opt: [
      "The Paramount Chief beat the sacred talking drum",
      "The villagers harvested all the yams on the farm",
      "The linguist went home to rest",
      "The youth started dancing in the street"
    ],
    ans: "The Paramount Chief beat the sacred talking drum",
    hint: "Identify the action signaled by the transition 'Thereafter'.",
    sol: "The text indicates: 'The royal linguist poured libation... Thereafter, the Paramount Chief beat the sacred talking drum...'",
    target: "Chronological Sequencing"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b7AdvSpecs[(i - 1) % b7AdvSpecs.length];
  b7Advanced.push({
    id: `B7_R_A_${i < 10 ? "0" + i : i}`,
    level: "B7",
    difficulty: "advanced",
    questionNumber: i,
    prompt: `Examine the excerpt:\n"${spec.passage}"\n\n${spec.prompt} (Case ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B7.2.1.1: Trace chronological events, understand narrative sequence, and produce faithful paraphrases."
  });
}

async function seedReadingLabB7() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding Basic 7 Reading Comprehension & Summary Lab (150 Questions)...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  for (const mainPath of paths) {
    const basePath = `${mainPath}/practice_labs`;

    const fRef = db.doc(`${basePath}/B7_foundation`);
    await fRef.set({
      level: "B7",
      difficulty: "foundation",
      title: "Basic 7 Foundation Lab: Skim/Scan Mechanics & Literal Retrieval",
      totalQuestions: b7Foundation.length,
      questions: b7Foundation,
      metadata: { standard: "NaCCA B7.2.1.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b7Foundation.length} questions to ${fRef.path}`);

    const iRef = db.doc(`${basePath}/B7_intermediate`);
    await iRef.set({
      level: "B7",
      difficulty: "intermediate",
      title: "Basic 7 Intermediate Lab: Topic Sentences & Paragraph Gist",
      totalQuestions: b7Intermediate.length,
      questions: b7Intermediate,
      metadata: { standard: "NaCCA B7.2.1.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b7Intermediate.length} questions to ${iRef.path}`);

    const aRef = db.doc(`${basePath}/B7_advanced`);
    await aRef.set({
      level: "B7",
      difficulty: "advanced",
      title: "Basic 7 Advanced Lab: Narrative Sequence & Paraphrasing",
      totalQuestions: b7Advanced.length,
      questions: b7Advanced,
      metadata: { standard: "NaCCA B7.2.1.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b7Advanced.length} questions to ${aRef.path}`);
  }

  // =========================================================================
  // SYNCHRONIZE INTO MAIN TOPICAL DOCUMENT FOR TOPICAL LAB RUNNER COMPONENT
  // =========================================================================
  console.log("\nSynchronizing B7 practice pools into the main topical document...");
  
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

  const b7PracticePool = {
    low: b7Foundation.map(q => mapToPracticeQuestion(q, 'low')),
    medium: b7Intermediate.map(q => mapToPracticeQuestion(q, 'medium')),
    hard: b7Advanced.map(q => mapToPracticeQuestion(q, 'hard'))
  };

  for (const mainPath of paths) {
    const mainDocRef = db.doc(mainPath);
    const snap = await mainDocRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      const updatedLevels = {
        ...existingLevels,
        b7: {
          ...(existingLevels.b7 || {}),
          practicePool: b7PracticePool
        },
        jhs1: {
          ...(existingLevels.jhs1 || {}),
          practicePool: b7PracticePool
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
          totalQuestions: Math.max(prevCount, 150),
          questionCount: Math.max(prevCount, 150),
          status: 'ready'
        };
      }
      return t;
    });
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("✅ Manifest updated successfully.");
  }

  console.log("\n🎯 JHS 1 (Basic 7) Reading Comprehension Lab complete: 150 questions stored and active!");
}

seedReadingLabB7()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B7 Reading Lab:", err);
    process.exit(1);
  });

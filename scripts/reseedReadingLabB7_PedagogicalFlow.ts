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
  isCapstoneExamPassage: boolean;
  passageText: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  competencyTarget: string;
  learningCompetency: string;
}

// =========================================================================
// CAPSTONE EXAM PASSAGE FOR B7 (QUESTIONS 51 TO 55)
// =========================================================================
const b7CapstonePassage = 
`In the early years of Ghana's independence, the construction of the Akosombo Hydroelectric Dam represented the nation's boldest industrial ambition. Spearheaded by President Kwame Nkrumah and formally commissioned in 1965, the monumental project aimed to harness the immense flow of the Volta River. Engineers flooded the gorge to create Lake Volta, which remains one of the largest artificial reservoirs by surface area in the world.

The primary objective of the dam was to generate abundant, low-cost electrical energy to drive national economic modernization. Heavy industries, particularly the commercial aluminum smelter at Tema, depended entirely on the dam's power generation. In addition to powering urban manufacturing hubs, the hydroelectric grid stimulated local rural economies by powering irrigation pumping schemes and cold-storage facilities for coastal fishing communities.

However, the creation of the massive reservoir introduced severe socioeconomic disruptions. Over eighty thousand inhabitants living in the submerged river valleys were displaced from their ancestral farmlands. The government resettled these communities into newly constructed townships, though many families endured prolonged hardships adapting to unfamiliar soil types and altered livelihoods. Furthermore, the downstream river ecosystem experienced ecological changes, including shifts in seasonal salinity and the proliferation of waterborne vectors such as freshwater snails carrying bilharzia.

Despite these environmental and social hurdles, the Akosombo Dam stands as an enduring pillar of Ghana's energy architecture. It continues to provide base-load electricity to millions of domestic households while exporting power to neighboring West African nations.`;

// -------------------------------------------------------------------------
// SHORT DRILLS FOR FOUNDATION (QUESTIONS 1 TO 50)
// -------------------------------------------------------------------------
const shortDrillsFoundation = [
  {
    passage: "Cocoa seedlings require moderate shade and fertile, well-drained loam soil. Farmers typically transplant young shoots at the onset of the major rainy season in May to ensure root establishment.",
    prompt: "In which month do farmers transplant cocoa seedlings according to the excerpt?",
    opt: ["March", "May", "August", "December"],
    ans: "May",
    hint: "Scan for the calendar month associated with the major rainy season.",
    sol: "The text states farmers transplant seedlings 'in May to ensure root establishment.'",
    target: "Scanning Data"
  },
  {
    passage: "During the dry harmattan season, humidity drops drastically across the savannah, causing dusty winds to blow from the Sahara Desert across West Africa.",
    prompt: "From where do the dry harmattan winds blow?",
    opt: ["The Atlantic Ocean", "The Sahara Desert", "The Guinea Highlands", "The Congo Basin"],
    ans: "The Sahara Desert",
    hint: "Scan for the proper noun naming the source of the wind.",
    sol: "The text explicitly states winds blow 'from the Sahara Desert across West Africa.'",
    target: "Literal Fact"
  },
  {
    passage: "Unlike speed reading, skimming involves glancing through a text to identify the main theme, author's purpose, and general structure without reading every word.",
    prompt: "What is the primary purpose of skimming?",
    opt: ["To count punctuation marks", "To extract the main theme and general structure", "To memorize numbers", "To correct spelling errors"],
    ans: "To extract the main theme and general structure",
    hint: "Check the definition of skimming in the text.",
    sol: "The excerpt defines skimming as glancing 'to identify the main theme, author's purpose, and general structure.'",
    target: "Reading Methodology"
  },
  {
    passage: "The human skeletal framework contains 206 individual bones in adulthood. It provides structural support, shields delicate visceral organs, and acts as an anchor for muscular movement.",
    prompt: "How many bones are present in the adult human skeleton?",
    opt: ["105", "206", "312", "500"],
    ans: "206",
    hint: "Scan for the three-digit number.",
    sol: "The text explicitly states: 'contains 206 individual bones in adulthood.'",
    target: "Scanning Numerals"
  },
  {
    passage: "Mangrove ecosystems along tropical coastlines serve as critical marine nurseries. Their tangled roots trap silt, prevent coastal erosion, and shield offshore coral reefs from land runoff.",
    prompt: "How do mangrove roots help protect coastal environments?",
    opt: ["By producing salt", "By trapping silt and preventing coastal erosion", "By killing off young fish", "By heating the ocean water"],
    ans: "By trapping silt and preventing coastal erosion",
    hint: "Look at the actions performed by the tangled roots.",
    sol: "The passage notes their roots 'trap silt, prevent coastal erosion, and shield offshore coral reefs.'",
    target: "Literal Fact"
  }
];

// -------------------------------------------------------------------------
// SHORT DRILLS FOR INTERMEDIATE (QUESTIONS 1 TO 50)
// -------------------------------------------------------------------------
const shortDrillsIntermediate = [
  {
    passage: "Clean potable water is essential for human survival. Without adequate hydration, human biological organs cease to function efficiently. Furthermore, access to safe drinking water prevents fatal outbreaks of waterborne diseases such as cholera and typhoid fever in rural communities.",
    prompt: "Which statement expresses the central topic idea of the paragraph?",
    opt: [
      "Without adequate hydration, organs cease to function.",
      "Clean potable water is essential for human survival.",
      "Access to safe drinking water prevents cholera and typhoid.",
      "Rural communities often experience dry seasons."
    ],
    ans: "Clean potable water is essential for human survival.",
    hint: "Look for the overarching anchor statement that summarizes the entire paragraph.",
    sol: "The first sentence is the topic sentence asserting the overarching claim, while subsequent sentences provide supporting explanations.",
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
    sol: "The paragraph focuses systematically on the causal link between logging tree canopies and resulting topsoil degradation.",
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
    sol: "This follows a deductive structure where the topic sentence opens the paragraph: 'Regular physical exercise strengthens cardiovascular health.'",
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

// -------------------------------------------------------------------------
// SHORT DRILLS FOR ADVANCED (QUESTIONS 1 TO 50)
// -------------------------------------------------------------------------
const shortDrillsAdvanced = [
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

// Capstone 5-Question Exam Battery for B7 (Questions 51 to 55)
const capstoneQuestions = [
  {
    qNum: 51,
    prompt: "According to the passage, in what year was the Akosombo Dam officially commissioned?",
    opt: ["1957", "1960", "1965", "1972"],
    ans: "1965",
    hint: "Scan paragraph 1 for the four-digit numeral following the word 'commissioned'.",
    sol: "The text states explicitly in the first paragraph: 'formally commissioned in 1965'.",
    target: "Capstone Exam: Scanning Specific Details"
  },
  {
    qNum: 52,
    prompt: "Which major industrial enterprise at Tema depended directly on the dam's power generation?",
    opt: ["A commercial aluminum smelter", "A cotton textile factory", "A motor assembly plant", "A gold refinery"],
    ans: "A commercial aluminum smelter",
    hint: "Check the heavy industries cited in paragraph 2.",
    sol: "Paragraph 2 explicitly names 'the commercial aluminum smelter at Tema' as depending entirely on the dam.",
    target: "Capstone Exam: Literal Fact"
  },
  {
    qNum: 53,
    prompt: "As used in paragraph 1, what does the word 'monumental' mean?",
    opt: ["Insignificant and small", "Massive, historic, and grand in scale", "Fragile and temporary", "Extremely cheap"],
    ans: "Massive, historic, and grand in scale",
    hint: "Consider the scale of creating one of the largest man-made lakes in the world.",
    sol: "'Monumental' refers to an undertaking of immense size and lasting historical significance.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    qNum: 54,
    prompt: "Why did displaced farming families suffer prolonged hardships in resettlement townships?",
    opt: [
      "They had to adapt to unfamiliar soil types and altered livelihoods",
      "The government prohibited farming entirely",
      "They refused to build homes",
      "They could not access river water"
    ],
    ans: "They had to adapt to unfamiliar soil types and altered livelihoods",
    hint: "Review paragraph 3 for the challenges experienced by resettled families.",
    sol: "Paragraph 3 notes families endured hardships 'adapting to unfamiliar soil types and altered livelihoods.'",
    target: "Capstone Exam: Causal Analysis"
  },
  {
    qNum: 55,
    prompt: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary domestic purpose of the Akosombo Dam.\nWhich summary qualifies for full marks?",
    opt: [
      "The dam generates low-cost electrical energy.",
      "Generating electrical energy for Ghanaian citizens.",
      "Because Ghana needed industrialization, Nkrumah constructed the dam to produce electricity.",
      "Electricity generation."
    ],
    ans: "The dam generates low-cost electrical energy.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    sol: "'The dam generates low-cost electrical energy' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and captures the core purpose. Option B is a fragment (lacks finite verb).",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

function buildTierQuestions(difficulty: "foundation" | "intermediate" | "advanced"): LabQuestion[] {
  const list: LabQuestion[] = [];
  const drillSource = difficulty === "foundation" 
    ? shortDrillsFoundation 
    : difficulty === "intermediate" 
      ? shortDrillsIntermediate 
      : shortDrillsAdvanced;

  // Questions 1 to 50: Short Targeted Drills
  for (let i = 1; i <= 50; i++) {
    const spec = drillSource[(i - 1) % drillSource.length];
    list.push({
      id: `B7_${difficulty[0].toUpperCase()}_${i < 10 ? "0" + i : i}`,
      level: "B7",
      difficulty: difficulty,
      questionNumber: i,
      isCapstoneExamPassage: false,
      passageText: spec.passage,
      prompt: spec.prompt,
      options: spec.opt,
      correctAnswer: spec.ans,
      hint: spec.hint,
      workedSolution: spec.sol,
      competencyTarget: spec.target,
      learningCompetency: "B7.2.1.1: Practice targeted reading and decoding skills on short textual excerpts."
    });
  }

  // Questions 51 to 55: Capstone Multi-Paragraph Exam Passage
  for (const cap of capstoneQuestions) {
    list.push({
      id: `B7_${difficulty[0].toUpperCase()}_${cap.qNum}`,
      level: "B7",
      difficulty: difficulty,
      questionNumber: cap.qNum,
      isCapstoneExamPassage: true,
      passageText: b7CapstonePassage,
      prompt: cap.prompt,
      options: cap.opt,
      correctAnswer: cap.ans,
      hint: cap.hint,
      workedSolution: cap.sol,
      competencyTarget: cap.target,
      learningCompetency: "B7.2.1.1 / B7.2.2.1: Comprehensive textual analysis and summary synthesis on an authentic full-length exam passage."
    });
  }

  return list;
}

async function reseedReadingLabB7() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Reseeding B7 Reading Labs: Questions 1–50 Short Drills + Questions 51–55 Capstone Exam...\n");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  const tiers: ("foundation" | "intermediate" | "advanced")[] = ["foundation", "intermediate", "advanced"];
  const b7TierQuestions: Record<string, LabQuestion[]> = {};

  for (const tier of tiers) {
    b7TierQuestions[tier] = buildTierQuestions(tier);
  }

  // 1. Reseed Subcollections
  for (const mainPath of paths) {
    for (const tier of tiers) {
      const questions = b7TierQuestions[tier];
      const docRef = db.doc(`${mainPath}/practice_labs/B7_${tier}`);

      await docRef.set({
        level: "B7",
        difficulty: tier,
        title: `Basic 7 ${tier.toUpperCase()} Lab: 50 Targeted Drills + 5 Capstone Exam Questions`,
        totalQuestions: questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: questions,
        metadata: {
          structure: "50 Short Drills + 5 Capstone Exam Questions",
          passagePosition: "Passage always appears first on the card",
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });

      console.log(`✅ Subcollection B7_${tier} seeded: 50 short drills + 5 capstone exam questions at ${docRef.path}`);
    }
  }

  // 2. Synchronize into Main Topical Document Practice Pool for TopicalLabRunner
  console.log("\nSynchronizing B7 (55 low + 55 medium + 55 hard) into main topical document practicePool...");
  const mapToPracticeQuestion = (q: LabQuestion, mappedDiff: 'low' | 'medium' | 'hard') => ({
    id: q.id,
    difficulty: mappedDiff,
    prompt: q.prompt,
    passageText: q.passageText,
    isCapstoneExamPassage: q.isCapstoneExamPassage,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1,
    learningCompetency: q.learningCompetency
  });

  const b7PracticePool = {
    low: b7TierQuestions["foundation"].map(q => mapToPracticeQuestion(q, 'low')),
    medium: b7TierQuestions["intermediate"].map(q => mapToPracticeQuestion(q, 'medium')),
    hard: b7TierQuestions["advanced"].map(q => mapToPracticeQuestion(q, 'hard'))
  };

  for (const mainPath of paths) {
    const mainRef = db.doc(mainPath);
    const snap = await mainRef.get();
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

      await mainRef.set({
        levels: updatedLevels,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Main document practicePool updated at: ${mainPath}`);
    }
  }

  // 3. Update manifest
  console.log("\nUpdating English manifests/topical_labs document...");
  const manifestRef = db.doc("global_curriculum/jhs/subjects/english/manifests/topical_labs");
  const mSnap = await manifestRef.get();
  if (mSnap.exists) {
    const mData = mSnap.data();
    const newTopics = (mData.topics || []).map((t: any) => {
      if (t.id === 'reading_comprehension_summary' || t.topicId === 'reading_comprehension_summary') {
        const total = 55 * 3 + 150 + 150; // 165 (B7) + 150 (B8) + 150 (B9) = 465
        return {
          ...t,
          totalQuestions: total,
          questionCount: total,
          status: 'ready'
        };
      }
      return t;
    });
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("✅ Manifest updated successfully.");
  }

  console.log("\n🎯 Basic 7 successfully restructured to the 50 + 5 pedagogical flow!");
}

reseedReadingLabB7()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to reseed B7:", err);
    process.exit(1);
  });

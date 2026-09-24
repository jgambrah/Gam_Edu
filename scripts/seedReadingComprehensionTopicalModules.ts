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

// =========================================================================
// TEXTBOOK-GRADE NACCA CONCEPT NOTES (MARKDOWN FOR TAB 1)
// =========================================================================

const B7_NOTES_MARKDOWN = `### 1. Foundational Locational Skills & Literal Comprehension (Basic 7)

Reading comprehension at the Junior High School level begins with mastering selective reading techniques to retrieve factual information rapidly and accurately.

#### A. Locational Techniques: Skimming vs. Scanning

| Feature | Skimming | Scanning |
| :--- | :--- | :--- |
| **Speed** | 300 – 500 words per minute | 800 – 1,000+ words per minute |
| **Focus Area** | Headings, subheadings, first & last sentences, introduction, conclusion | Specific keywords, numerals, dates, capital letters, proper nouns |
| **Primary Objective** | Extract overall gist, general structure, and macro-theme | Locate a pinpointed piece of factual data |
| **Typical Question** | *"What is the main topic of this passage?"* | *"In what year did the floods destroy the bridge?"* |

#### B. The SQ3R Active Study Method
To retain and comprehend complex expository texts, use the classic **SQ3R** framework:
1. **Survey:** Rapidly skim the title, headings, diagram captions, and summary paragraph to frame a mental map.
2. **Question:** Convert headings into inquiries (e.g., Turn *"Causes of Soil Degradation"* into *"What factors cause soil degradation?"*).
3. **Read:** Read actively with the specific aim of finding answers to your questions.
4. **Recite:** Summarize aloud or note down the core idea of each paragraph without glancing at the page.
5. **Review:** Revisit the text to confirm relationships and review key terminology.

#### C. Paragraph Architecture & Topic Sentences
Every formal paragraph in English has a deliberate anatomical design:
- **Topic Sentence (Anchor Idea):** Declares the central proposition.
  - *Deductive Paragraph:* Topic sentence appears as Sentence 1, followed by evidence and examples.
  - *Inductive Paragraph:* Opens with specific examples, culminating in the topic sentence at the end.
- **Supporting Details:** Concrete explanations, statistics, illustrations, and citations.
- **Concluding/Transition Hook:** Summarizes the thought or bridges into the next paragraph.

> **Key Rule:** Literal comprehension answers must be strictly grounded in the passage. Never introduce extraneous outside assumptions.`;

const B8_NOTES_MARKDOWN = `### 2. Inferential Analysis & Contextual Lexical Decoding (Basic 8)

Basic 8 advances from literal retrieval to inferential reasoning—uncovering what the writer implies without stating directly—and deciphering unfamiliar vocabulary using contextual cues.

#### A. The Deductive Inference Engine
Inference is reading between the lines. It is governed by a strict equation:
$$\\text{Explicit Textual Clues} + \\text{Logical World Knowledge} = \\text{Valid Deduction}$$

- **Rule 1:** An inference must be anchored to explicit evidence in the text.
- **Rule 2:** Avoid unsupported speculation or personal bias.

#### B. Tone and Mood Analysis
- **Tone:** The writer's attitude toward the subject matter or audience (e.g., *critical, satirical, indignant, objective, cautionary, optimistic, celebratory*).
- **Mood:** The emotional atmosphere evoked within the reader (e.g., *somber, suspenseful, nostalgic, serene, ominous*).

#### C. The Four Types of Context Clues
When encountering unfamiliar vocabulary in an exam passage, examine the surrounding sentence for these four syntactic patterns:

1. **Definition / Restatement Clue:**
   - *Signal Words:* *that is, in other words, commas, dashes, parentheses*
   - *Example:* "The botanist examined the **indigenous** flora—plants naturally native to the West African forest belt."
   - *Deduction:* *Indigenous* means native or naturally occurring in a region.

2. **Contrast / Antonym Clue:**
   - *Signal Words:* *whereas, unlike, on the other hand, however, conversely*
   - *Example:* "While Kwame was notoriously **garrulous**, his sister remained entirely **taciturn**."
   - *Deduction:* *Taciturn* is the opposite of talkative (quiet, reserved).

3. **Cause and Effect Clue:**
   - *Signal Words:* *because, consequently, therefore, so that, as a result*
   - *Example:* "Because industrial effluents poisoned the municipal stream, the water became **unpotable**."
   - *Deduction:* *Unpotable* means unsafe or unfit for drinking.

4. **Exemplification / Apposition Clue:**
   - *Signal Words:* *such as, including, for instance, notably*
   - *Example:* "The farmer suffered from numerous **calamities**, including flash floods, locust swarms, and wildfires."
   - *Deduction:* *Calamities* are severe disasters or catastrophes.`;

const B9_NOTES_MARKDOWN = `### 3. Macro-Synthesis & Summary Writing Mechanics (Basic 9)

In Basic 9, students must master summary writing—the rigorous process of condensing extensive expository passages into concise, grammatically complete sentences under strict word ceilings.

#### A. The Summary Compression Pipeline
1. **Locate Target Scope:** Identify the exact paragraph or section specified in the question prompt.
2. **Discard Illustrative Padding ("Trash"):**
   - Strike out: Examples, names, dates, statistics, rhetorical questions, analogies, and parenthetical lists.
3. **Isolate the Proposition:** Find the underlying general claim (the core thesis).
4. **Draft an Active Sentence:** Write a fresh sentence adhering to:
   $$\\text{Subject} + \\text{Finite Verb} + \\text{Object / Complement}$$

#### B. The 8-Word Rule & Examination Penalty Matrix
WAEC / NaCCA examinations enforce rigid penalty criteria for summary sentences:

| Error Category | Specific Violation | Penalty / Mark Outcome |
| :--- | :--- | :--- |
| **Grammatical Fragment** | Writing a phrase without a finite verb (e.g., *"Destruction of rivers and farms."*) | **0 Marks** (Total forfeiture) |
| **Word Ceiling Breach** | Exceeding 8 words (or the stated limit) by 3+ words | Heavy marks deduction or **0 Marks** |
| **Mindless Lifting** | Copying verbatim chunks from the passage without rephrasing | Heavy deduction for expression |
| **Inclusion of Padding** | Retaining examples, quotes, or secondary illustrations | Loss of clarity and marks penalty |

#### C. Gold-Standard Summary Comparison
*Passage Excerpt:* "Governments across the sub-region must invest heavily in building decentralized solar cold storage hubs, construct bitumen highways, and deploy refrigerated transport to preserve crops."

*Prompt:* In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary solution proposed.
- ❌ **Disqualified Fragment:** *"Constructing cold stores and bitumen highways."* (0 Marks — No finite verb).
- ❌ **Disqualified Length:** *"Governments must construct cold storage hubs and pave rural transit corridors."* (11 words — Exceeds 8 words).
- ✅ **Full Marks Benchmark:** *"Governments must build cold stores and roads."* (7 words — Complete S-V-O sentence, strictly under 8 words).`;

// =========================================================================
// WORKED EXAMPLES (TAB 2)
// =========================================================================

const B7_WORKED_EXAMPLES = [
  {
    id: "read_we_b7_01",
    title: "Worked Example 1: Locating Explicit Information via Scanning",
    problem: "Passage Excerpt:\n'The Volta River Authority commissioned the Kpong Hydroelectric Project in 1982 to supplement the energy output of the Akosombo Dam, providing an additional 160 megawatts of electricity to the national grid.'\n\nQuestion: According to the passage, in what year was the Kpong Hydroelectric Project commissioned, and what capacity does it provide?",
    steps: [
      "Step 1 (Scan Target): Scan for numerals and capitalized proper nouns: 'Kpong Hydroelectric Project' and year numbers.",
      "Step 2 (Locate Sentence): The text explicitly states: 'commissioned the Kpong Hydroelectric Project in 1982... providing an additional 160 megawatts...'",
      "Step 3 (Synthesize Answer): Formulate a clear, direct response avoiding unnecessary words."
    ],
    finalAnswer: "The Kpong Hydroelectric Project was commissioned in 1982 and provides 160 megawatts of electricity."
  },
  {
    id: "read_we_b7_02",
    title: "Worked Example 2: Identifying the Topic Sentence of a Deductive Paragraph",
    problem: "Paragraph:\n'Wetlands provide irreplaceable environmental benefits to coastal communities. They act as natural sponges that absorb floodwaters during violent storms. Furthermore, their root systems filter hazardous agricultural runoff before it reaches the sea. Finally, they serve as essential breeding sanctuaries for migratory birds and commercial fish species.'\n\nQuestion: Which sentence is the topic sentence of this paragraph, and what structure does it use?",
    steps: [
      "Step 1 (Analyze Opening Sentence): Sentence 1 makes a broad, overarching claim: 'Wetlands provide irreplaceable environmental benefits...'",
      "Step 2 (Examine Subsequent Sentences): Sentences 2, 3, and 4 list specific benefits (flood sponge, filtering runoff, breeding sanctuary).",
      "Step 3 (Determine Structure): Because the general claim opens the paragraph followed by supporting details, it is a deductive paragraph."
    ],
    finalAnswer: "Topic Sentence: 'Wetlands provide irreplaceable environmental benefits to coastal communities.' The paragraph follows a deductive structure."
  }
];

const B8_WORKED_EXAMPLES = [
  {
    id: "read_we_b8_01",
    title: "Worked Example 1: Contextual Synonym Replacement (Substitution Test)",
    problem: "Passage Sentence:\n'The regional minister denounced the contractor for using **substandard** gravel that caused the newly paved highway to crumble within three months.'\n\nQuestion: Replace the word 'substandard' with a single word or phrase that conveys the same meaning and fits the grammatical structure of the sentence.",
    steps: [
      "Step 1 (Analyze Context): The highway crumbled within three months because of poor materials.",
      "Step 2 (Determine Part of Speech): 'Substandard' is an adjective qualifying the noun 'gravel'.",
      "Step 3 (Brainstorm Candidates): 'Inferior', 'poor-quality', 'flawed', 'shoddy'.",
      "Step 4 (Execute Substitution Test): '...denounced the contractor for using inferior gravel...' preserves both the exact grammatical syntax and meaning."
    ],
    finalAnswer: "'Inferior' or 'poor-quality'."
  },
  {
    id: "read_we_b8_02",
    title: "Worked Example 2: Making a Deductive Inference from Textual Clues",
    problem: "Passage Excerpt:\n'As the sun dipped below the horizon, fishermen dragged their empty nets ashore with slumped shoulders, muttering curses at the foreign trawlers whose bright floodlights still dotted the deep sea waters.'\n\nQuestion: What can be inferred about the day's catch and the local fishermen's attitude toward the foreign trawlers?",
    steps: [
      "Step 1 (Identify Explicit Clues): 'empty nets', 'slumped shoulders', 'muttering curses at the foreign trawlers'.",
      "Step 2 (Connect to Logic): Empty nets and slumped shoulders signify failure and disappointment. Cursing the foreign trawlers indicates they blame them for depleting the fish stock.",
      "Step 3 (Formulate Inference): Deduce the implicit situation without quoting verbatim."
    ],
    finalAnswer: "The fishermen caught no fish, and they resent the foreign industrial trawlers for overfishing and depleting their marine resources."
  }
];

const B9_WORKED_EXAMPLES = [
  {
    id: "read_we_b9_01",
    title: "Worked Example 1: Compressing a Multi-Sentence Paragraph into an 8-Word Summary",
    problem: "Paragraph:\n'Urban plastic waste presents an overwhelming environmental hazard across our cities. Discarded plastic sachets, water bottles, and polythene carrier bags relentlessly choke drainage channels, culminating in devastating urban flash floods every rainy season.'\n\nPrompt: In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary environmental danger of plastic waste described in the passage.",
    steps: [
      "Step 1 (Identify Target Action): Plastic waste blocks drains, causing flooding.",
      "Step 2 (Strip Illustrative Trash): Remove specific items ('sachets, bottles, bags') and descriptors ('relentlessly, devastating, every rainy season').",
      "Step 3 (Draft Subject-Verb-Object): 'Plastic waste chokes drains and causes floods.'",
      "Step 4 (Count Words): 'Plastic (1) waste (2) chokes (3) drains (4) and (5) causes (6) floods. (7)' -> 7 words.",
      "Step 5 (Check Requirements): Complete grammatical sentence with finite verbs ('chokes', 'causes'); exactly 7 words (under 8-word ceiling)."
    ],
    finalAnswer: "'Plastic waste chokes drains and causes floods.' (7 words)"
  },
  {
    id: "read_we_b9_02",
    title: "Worked Example 2: Identifying and Explaining a Figure of Speech in Context",
    problem: "Passage Sentence:\n'The bustling central market was a beehive of commercial activity from sunrise until dusk.'\n\nQuestion: Identify the figure of speech used in the underlined phrase and explain its contextual meaning.",
    steps: [
      "Step 1 (Identify Device): Direct comparison between the 'bustling market' and a 'beehive' without using 'like' or 'as' -> Metaphor.",
      "Step 2 (Contextual Explanation): A beehive is characterized by continuous, rapid, and organized movement of thousands of bees. In this context, it illustrates that the market was crowded, energetic, and filled with non-stop buying and selling."
    ],
    finalAnswer: "Figure of Speech: Metaphor.\nContextual Meaning: It means that the market was extremely crowded, noisy, and vigorously active with vendors and buyers."
  }
];

// =========================================================================
// PRACTICE LAB INITIAL QUESTIONS (TAB 3)
// =========================================================================

const B7_PRACTICE_POOL = {
  low: [
    {
      id: "rc_b7_l_01",
      difficulty: "low" as const,
      prompt: "Passage Excerpt: 'Due to poor storage infrastructure, nearly thirty percent of harvested grain is destroyed by moisture, mold, and weevils before reaching urban consumers.'\nQuestion: According to the passage, what is the primary cause of grain destruction?",
      options: [
        "A lack of demand from urban consumers",
        "Poor storage infrastructure that exposes crops to moisture and pests",
        "Excessive use of agricultural pesticides",
        "Delayed planting seasons caused by drought"
      ],
      correctAnswer: "Poor storage infrastructure that exposes crops to moisture and pests",
      hint: "Look for the explicit causal phrase 'Due to...' in the passage.",
      workedSolution: "The text states explicitly: 'Due to poor storage infrastructure, nearly thirty percent of harvested grain is destroyed by moisture, mold, and weevils...'",
      points: 1,
      learningCompetency: "B7.2.1.1: Locate direct factual details and extract explicit information from expository texts."
    },
    {
      id: "rc_b7_l_02",
      difficulty: "low" as const,
      prompt: "Which reading technique is fastest and most effective when looking up a specific date or name in a lengthy history article?",
      options: ["Skimming", "Scanning", "Close analytical reading", "Vocal recitation"],
      correctAnswer: "Scanning",
      hint: "This technique operates up to 1,000 words per minute to spot specific target words.",
      workedSolution: "Scanning is the selective reading technique used to locate specific, pinpointed items such as dates, numerals, and proper names.",
      points: 1,
      learningCompetency: "B7.2.1.1: Select appropriate reading techniques for specific tasks."
    }
  ],
  medium: [
    {
      id: "rc_b7_m_01",
      difficulty: "medium" as const,
      prompt: "In a deductive paragraph, where is the topic sentence customarily placed?",
      options: [
        "At the very beginning of the paragraph",
        "Hidden within the middle of the paragraph",
        "At the end as a surprise concluding sentence",
        "Deductive paragraphs do not have topic sentences"
      ],
      correctAnswer: "At the very beginning of the paragraph",
      hint: "Deductive structure moves from the general thesis to specific details.",
      workedSolution: "In a deductive paragraph structure, the main anchor claim (topic sentence) is stated in the opening sentence, followed by supporting explanations.",
      points: 1,
      learningCompetency: "B7.2.1.1: Identify paragraph structure and main idea placement."
    }
  ],
  hard: [
    {
      id: "rc_b7_h_01",
      difficulty: "hard" as const,
      prompt: "Which of the following elements represents illustrative 'padding' that should be discarded when extracting main ideas?",
      options: [
        "The core grammatical subject and predicate",
        "The central thesis assertion",
        "Specific statistical figures, parenthetical examples, and direct quotes",
        "The major argument of the paragraph"
      ],
      correctAnswer: "Specific statistical figures, parenthetical examples, and direct quotes",
      hint: "Padding consists of illustrative details used to support but not define the central thesis.",
      workedSolution: "Illustrative padding consists of secondary supporting details such as specific numbers, dates, parenthetical lists, and quotations.",
      points: 1,
      learningCompetency: "B7.2.2.1: Distinguish main propositions from supporting secondary details."
    }
  ]
};

const B8_PRACTICE_POOL = {
  low: [
    {
      id: "rc_b8_l_01",
      difficulty: "low" as const,
      prompt: "Sentence: 'Because industrial chemicals contaminated the reservoir, the municipal water became unpotable.'\nWhat type of context clue reveals the meaning of 'unpotable'?",
      options: ["Definition / Restatement", "Cause and Effect", "Contrast / Antonym", "Exemplification"],
      correctAnswer: "Cause and Effect",
      hint: "Notice the signal word 'Because' indicating a causal relationship.",
      workedSolution: "The word 'Because' sets up a cause-and-effect relationship, showing that contamination caused the water to become unsafe to drink.",
      points: 1,
      learningCompetency: "B8.2.1.1: Identify and apply context clue categories."
    }
  ],
  medium: [
    {
      id: "rc_b8_m_01",
      difficulty: "medium" as const,
      prompt: "In the passage, the author refers to the transportation challenge as 'an intractable transport bottleneck.' What is the contextual meaning of the word 'intractable'?",
      options: [
        "Extremely simple and easy to navigate",
        "Stubborn, difficult, and hard to manage or resolve",
        "Temporary and resolving naturally",
        "Inexpensive and highly efficient"
      ],
      correctAnswer: "Stubborn, difficult, and hard to manage or resolve",
      hint: "The context describes impassable muddy roads during torrential rains that prevent food transport.",
      workedSolution: "In this context, 'intractable' qualifies a bottleneck that is stubborn, hard to control, and difficult to resolve due to impassable roads.",
      points: 1,
      learningCompetency: "B8.2.1.1: Deduce the contextual meanings of high-order vocabulary and figurative expressions."
    }
  ],
  hard: [
    {
      id: "rc_b8_h_01",
      difficulty: "hard" as const,
      prompt: "Passage: 'The author repeatedly describes the illegal gold-mining pit as a gaping, bleeding wound on the green surface of the earth.'\nWhat is the author's tone toward illegal mining in this excerpt?",
      options: [
        "Enthusiastic and supportive",
        "Objective and neutral",
        "Indignant, critical, and condemnatory",
        "Humorous and playful"
      ],
      correctAnswer: "Indignant, critical, and condemnatory",
      hint: "Look at the evocative, violent imagery of a 'bleeding wound'.",
      workedSolution: "Describing the mining site as a 'gaping, bleeding wound' reflects strong moral indignation and sharp condemnation of environmental damage.",
      points: 1,
      learningCompetency: "B8.2.1.1: Analyze author tone and emotional atmosphere in persuasive texts."
    }
  ]
};

const B9_PRACTICE_POOL = {
  low: [
    {
      id: "rc_b9_l_01",
      difficulty: "low" as const,
      prompt: "In a formal summary examination under WAEC/NaCCA standards, what happens if an answer is submitted as a phrase without a finite verb?",
      options: [
        "It receives full marks if the idea is recognizable",
        "It receives ZERO (0) marks because it is a grammatical fragment",
        "It is penalized only half a mark",
        "It is awarded a bonus mark for brevity"
      ],
      correctAnswer: "It receives ZERO (0) marks because it is a grammatical fragment",
      hint: "Every summary response must be a complete grammatical sentence.",
      workedSolution: "Summary answers must be grammatically complete sentences. A fragment lacking a finite verb receives zero marks under strict examination guidelines.",
      points: 1,
      learningCompetency: "B9.2.2.1: Apply strict grammatical and structural rules in summary writing."
    }
  ],
  medium: [
    {
      id: "rc_b9_m_01",
      difficulty: "medium" as const,
      prompt: "Passage: 'Governments must construct decentralized solar cold hubs and seal rural transit corridors to eliminate food waste.'\nPrompt: In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary solution proposed.\nWhich option fulfills all criteria?",
      options: [
        "Constructing decentralized solar cold hubs and bitumen roads.",
        "Governments must build cold stores and roads.",
        "Because crops rot, governments must definitely construct cold storage facilities and good roads.",
        "Solar hubs and paved roads."
      ],
      correctAnswer: "Governments must build cold stores and roads.",
      hint: "The summary must be a complete grammatical sentence with subject and finite verb, containing 8 words or fewer.",
      workedSolution: "'Governments must build cold stores and roads' is an active, grammatically complete sentence of exactly 7 words that captures both core interventions without illustrative padding.",
      points: 1,
      learningCompetency: "B9.2.2.1: Synthesize main passage ideas into concise, grammatically complete summary sentences under strict word limits."
    }
  ],
  hard: [
    {
      id: "rc_b9_h_01",
      difficulty: "hard" as const,
      prompt: "Which of the following sentences commits the error of 'mindless lifting' in summary writing?",
      options: [
        "Summarizing the author's core thesis using fresh, original grammatical vocabulary",
        "Copying a 15-word clause verbatim from paragraph three without rephrasing or condensing",
        "Writing a complete Subject-Verb-Object sentence under seven words",
        "Replacing difficult adjectives with appropriate contextual synonyms"
      ],
      correctAnswer: "Copying a 15-word clause verbatim from paragraph three without rephrasing or condensing",
      hint: "'Mindless lifting' refers to copying directly without cognitive processing or compression.",
      workedSolution: "Mindless lifting occurs when a candidate copies sentences or clauses directly from the passage without rephrasing into their own words.",
      points: 1,
      learningCompetency: "B9.2.2.1: Avoid verbatim copying and rephrase concepts into original syntax."
    }
  ]
};

// =========================================================================
// MAIN PAYLOAD COMBINING ALL MODULES & TOPICAL LAB RUNNER SCHEMA
// =========================================================================

const readingComprehensionPayload = {
  id: "reading_comprehension_summary",
  topicId: "reading_comprehension_summary",
  subjectId: "english",
  subject: "English Language",
  tier: "Junior Secondary (JHS)",
  strandCode: "S2",
  strandId: "strand_2_reading_literature",
  strandName: "STRAND 2: READING & LITERATURE",
  strandTitle: "STRAND 2: READING & LITERATURE",
  strand: "STRAND 2: READING & LITERATURE",
  subStrandTitle: "Reading Comprehension & Summarization",
  subStrand: "Reading Comprehension & Summarization",
  topicTitle: "Textual Analysis & Summary Skills",
  title: "Textual Analysis & Summary Skills",
  badge: "NaCCA Common Core Programme (CCP)",
  summary: "Comprehensive NaCCA-aligned curriculum module covering literal locational decoding, skimming and scanning, deductive inferences, contextual vocabulary deciphering, and summary writing under strict 8-word ceilings across Basic 7 to Basic 9.",
  description: "Master skim-and-scan techniques, locating explicit information, making deductive inferences, decoding contextual vocabulary, and writing summaries under strict word limits.",
  gradeLevels: ["B7 (JHS 1)", "B8 (JHS 2)", "B9 (JHS 3)"],
  levelsAvailable: ["B7", "B8", "B9"],
  curriculumIndicators: ["B7.2.1.1", "B7.2.2.1", "B8.2.1.1", "B8.2.2.1", "B9.2.1.1", "B9.2.2.1"],
  totalPracticeQuestions: 9,
  hasNotes: true,
  status: "ready",
  version: 1,

  // Concept Notes for detailed reference
  conceptNotes: {
    b7_overview: B7_NOTES_MARKDOWN,
    b8_progression: B8_NOTES_MARKDOWN,
    b9_mastery: B9_NOTES_MARKDOWN
  },

  // TopicalLabRunner Level-Specific Content
  levels: {
    b7: {
      levelTitle: "B7 • Locational Decoding & Literal Recall",
      summary: "Foundational locational reading skills, skimming and scanning, SQ3R method, and paragraph architecture.",
      notes: B7_NOTES_MARKDOWN,
      workedExamples: B7_WORKED_EXAMPLES,
      practicePool: B7_PRACTICE_POOL
    },
    b8: {
      levelTitle: "B8 • Inferential Analysis & Contextual Lexis",
      summary: "Deductive inferences, author tone and mood, and deciphering vocabulary with the four context clue types.",
      notes: B8_NOTES_MARKDOWN,
      workedExamples: B8_WORKED_EXAMPLES,
      practicePool: B8_PRACTICE_POOL
    },
    b9: {
      levelTitle: "B9 • Macro-Synthesis & Summary Mechanics",
      summary: "WAEC/NaCCA summary gold standards, discarding illustrative padding, and the strict 8-word sentence rule.",
      notes: B9_NOTES_MARKDOWN,
      workedExamples: B9_WORKED_EXAMPLES,
      practicePool: B9_PRACTICE_POOL
    },
    jhs1: {
      levelTitle: "JHS 1 • Locational Decoding & Literal Recall",
      summary: "Foundational locational reading skills, skimming and scanning, SQ3R method, and paragraph architecture.",
      notes: B7_NOTES_MARKDOWN,
      workedExamples: B7_WORKED_EXAMPLES,
      practicePool: B7_PRACTICE_POOL
    },
    jhs2: {
      levelTitle: "JHS 2 • Inferential Analysis & Contextual Lexis",
      summary: "Deductive inferences, author tone and mood, and deciphering vocabulary with the four context clue types.",
      notes: B8_NOTES_MARKDOWN,
      workedExamples: B8_WORKED_EXAMPLES,
      practicePool: B8_PRACTICE_POOL
    },
    jhs3: {
      levelTitle: "JHS 3 • Macro-Synthesis & Summary Mechanics",
      summary: "WAEC/NaCCA summary gold standards, discarding illustrative padding, and the strict 8-word sentence rule.",
      notes: B9_NOTES_MARKDOWN,
      workedExamples: B9_WORKED_EXAMPLES,
      practicePool: B9_PRACTICE_POOL
    }
  },

  questions: [
    ...B7_PRACTICE_POOL.low,
    ...B7_PRACTICE_POOL.medium,
    ...B7_PRACTICE_POOL.hard,
    ...B8_PRACTICE_POOL.low,
    ...B8_PRACTICE_POOL.medium,
    ...B8_PRACTICE_POOL.hard,
    ...B9_PRACTICE_POOL.low,
    ...B9_PRACTICE_POOL.medium,
    ...B9_PRACTICE_POOL.hard
  ],

  metadata: {
    isEnglishLanguage: true,
    curriculum: "NaCCA Common Core Programme (CCP) Standard",
    framework: "National Standards for JHS 1 - JHS 3",
    difficultyLevels: ["low", "medium", "hard"],
    hasPracticeLab: true,
    updatedAt: new Date().toISOString()
  }
};

async function seedReadingComprehensionTopicalModules() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding detailed NaCCA Reading Comprehension & Summary notes into Firestore...");

  console.log("1. Writing to primary topical path:");
  console.log("   global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary");
  await db.doc("global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary").set(readingComprehensionPayload, { merge: true });

  console.log("2. Writing to secondary alias path:");
  console.log("   global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary");
  await db.doc("global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary").set(readingComprehensionPayload, { merge: true });

  console.log("3. Writing to topical_units path:");
  console.log("   global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary");
  await db.doc("global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary").set(readingComprehensionPayload, { merge: true });

  console.log("4. Updating English manifests/topical_labs document...");
  const manifestRef = db.doc("global_curriculum/jhs/subjects/english/manifests/topical_labs");
  const mSnap = await manifestRef.get();
  if (mSnap.exists) {
    const mData = mSnap.data();
    const newTopics = (mData.topics || []).map((t: any) => {
      if (t.id === 'reading_comprehension_summary' || t.topicId === 'reading_comprehension_summary') {
        return {
          ...t,
          totalQuestions: readingComprehensionPayload.questions.length,
          questionCount: readingComprehensionPayload.questions.length,
          hasNotes: true,
          status: 'ready'
        };
      }
      return t;
    });
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("   Manifest updated successfully.");
  }

  console.log("\n✅ SUCCESS! Reading Comprehension & Summary module deployed with rich notes, worked examples, and practice pools!");
}

seedReadingComprehensionTopicalModules()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Reading Comprehension notes:", err);
    process.exit(1);
  });

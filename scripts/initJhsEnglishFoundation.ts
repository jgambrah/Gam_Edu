process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';
import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
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
    console.log("Fallback to admin default credentials...");
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.applicationDefault(),
    });
  }
  return fbAdmin.firestore();
}

// 1. Definition of Core NaCCA English Strands & Topics
const englishStrands = [
  {
    id: "oral_language",
    name: "Oral Language (Listening and Speaking)",
    topics: [
      { id: "speech_sounds_vowels_consonants", name: "Speech Sounds: Pure Vowels, Diphthongs & Consonants" },
      { id: "stress_and_intonation", name: "Word Stress, Sentence Stress & Intonation Patterns" },
      { id: "listening_and_speaking_etiquette", name: "Listening Comprehension & Conversation Etiquette" }
    ]
  },
  {
    id: "reading_and_literature",
    name: "Reading Comprehension and Literature",
    topics: [
      { id: "reading_comprehension", name: "Reading Comprehension: Literal, Inferential & Summary Skills" },
      { id: "prose_analysis", name: "Literature: Prose (Plot, Characterization, Themes)" },
      { id: "poetry_and_poetic_devices", name: "Literature: Poetry (Imagery, Figures of Speech, Rhyme & Rhythm)" },
      { id: "drama_and_stagecraft", name: "Literature: Drama (Dialogue, Conflict, Dramatic Irony)" }
    ]
  },
  {
    id: "grammar_and_usage",
    name: "Grammar and Language Structure",
    topics: [
      { id: "parts_of_speech_nouns_pronouns", name: "Nouns (Classes, Functions) & Pronouns (Case, Reference)" },
      { id: "verbs_tenses_and_aspects", name: "Verbs: Regular/Irregular, Finite/Non-finite & Tense Aspects" },
      { id: "adjectives_and_adverbs", name: "Adjectives, Adverbs & Comparison of Modifiers" },
      { id: "prepositions_and_phrasal_verbs", name: "Prepositions and Common Phrasal Verbs" },
      { id: "subject_verb_agreement_concord", name: "Concord: Rules of Subject-Verb Agreement" },
      { id: "active_and_passive_voice", name: "Active and Passive Voice Transformations" },
      { id: "direct_and_indirect_speech", name: "Reported (Indirect) Speech and Punctuation" },
      { id: "vocabulary_synonyms_antonyms_idioms", name: "Vocabulary: Synonyms, Antonyms & Idiomatic Expressions" },
      { id: "question_tags", name: "Question Tags and Short Responses" }
    ]
  },
  {
    id: "writing_and_composition",
    name: "Composition and Written Rhetoric",
    topics: [
      { id: "informal_friendly_letters", name: "Informal (Friendly) Letter Writing" },
      { id: "formal_official_letters", name: "Formal (Official / Business) Letter Writing" },
      { id: "narrative_and_descriptive_essays", name: "Narrative and Descriptive Essay Writing" },
      { id: "argumentative_and_persuasive_essays", name: "Argumentative / Persuasive Essays & Debates" },
      { id: "article_and_speech_writing", name: "Article Writing for Publication & Public Speeches" }
    ]
  }
];

// Sample Graduated Notes Template for Reading Comprehension across B7, B8, and B9
const sampleTopicNotes = {
  reading_comprehension: {
    level_b7: {
      level: "Basic 7 (JHS 1)",
      overview: "Introduction to Reading Comprehension: Skimming, Scanning, and Answering Literal Questions.",
      learningObjectives: [
        "Read grade-level narrative and expository passages fluently with understanding.",
        "Differentiate between skimming for general gist and scanning for specific dates, names, or numbers.",
        "Identify stated facts and answer direct literal questions.",
        "Determine the meaning of unfamiliar vocabulary items using contextual clues."
      ],
      coreNotesMarkdown: `### 1. What is Reading Comprehension?
Reading comprehension is the cognitive ability to read text, process it, and understand its meaning. It is not merely pronouncing words correctly; it involves decoding the author's ideas and interpreting the message.

### 2. Reading Techniques
* **Skimming:** Reading rapidly through the entire passage to get the main idea or general impression. You glance at headings, introductory sentences, and concluding lines.
* **Scanning:** Looking swiftly through a passage for a specific fact, piece of information, date, or name without reading the surrounding sentences.

### 3. Types of Questions at Basic 7 Level
* **Literal Questions:** Answers that are directly stated in the text. For example: *Where did Kofi go on Monday?* (The answer can be lifted directly from the text).
* **Vocabulary in Context:** Finding words or phrases from the passage that mean the same as or are closest in meaning to given words.`,
      questionTargetCount: { low: 50, medium: 50, hard: 50, total: 150 }
    },
    level_b8: {
      level: "Basic 8 (JHS 2)",
      overview: "Intermediate Comprehension: Inferential Reading, Deductive Reasoning, and Topic Sentences.",
      learningObjectives: [
        "Make logical inferences from implied (unstated) details in passages.",
        "Identify paragraph topic sentences and differentiate between main ideas and supporting details.",
        "Recognize basic tone, mood, and the author's underlying attitude.",
        "Formulate concise paragraph summaries."
      ],
      coreNotesMarkdown: `### 1. Inferential Comprehension (Reading Between the Lines)
In Basic 8, passages contain details that are implied rather than directly stated. You must combine textual clues with logical reasoning to deduce what the author means.
* *Example:* If a passage says *"Ama walked into the room shivering, water dripping from her soaked uniform,"* we infer that it was raining heavily outside even if the word 'rain' is never explicitly stated.

### 2. Paragraph Structure
* **Topic Sentence:** The sentence that contains the central idea of the paragraph. It usually appears at the beginning, but may occasionally be found in the middle or at the end.
* **Supporting Details:** Concrete examples, statistics, or explanations that elaborate on and defend the topic sentence.

### 3. Understanding Figurative Language in Context
Passages often employ similes (*"as sharp as a needle"*), metaphors (*"he is a lion in battle"*), and personification (*"the wind whispered through the trees"*). Comprehension questions will ask you to explain their contextual significance.`,
      questionTargetCount: { low: 50, medium: 50, hard: 50, total: 150 }
    },
    level_b9: {
      level: "Basic 9 (JHS 3 / BECE Final Year)",
      overview: "Advanced Comprehension & Summary Writing: Evaluative Analysis, Figurative Language, and Grammatical Functions.",
      learningObjectives: [
        "Answer complex inferential, deductive, and evaluative questions to BECE standard.",
        "Identify and analyze grammatical names and functions of underlined clauses and phrases in passages.",
        "Explain figures of speech (metaphors, irony, hyperbole) as used in context.",
        "Extract core points and write concise, coherent summaries adhering to strict word limits without lifting wholesale."
      ],
      coreNotesMarkdown: `### 1. Advanced Question Types in the BECE
The BECE Reading Comprehension Section tests higher-order thinking skills across five distinct domains:
1. **Direct/Literal Questions:** Testing recall and specific factual retention.
2. **Inferential/Deductive Questions:** Requiring reasoning based on implied evidence.
3. **Figures of Speech:** Identifying literary devices (e.g., metaphor, personification, hyperbole, rhetorical questions, irony) and stating their meaning in context.
4. **Grammatical Name and Function:**
   * Identifying an underlined group of words (e.g., *Noun phrase, Adjectival clause, Adverbial clause of time/reason/condition*).
   * Stating its syntactic function (e.g., *Subject of the verb 'went'*, *Modifying the verb 'ran'*, *Qualifying the noun 'boy'*).
5. **Vocabulary Replacement:** Providing a single word or phrase that can replace an underlined word in the passage without altering the grammatical correctness or meaning.

### 2. Summary Writing Principles
* Extract only the **essential points** addressing the specific question prompt.
* Omit illustrations, anecdotes, direct speech, examples, and redundant adjectives.
* Write in **clear, complete, grammatically correct sentences** in your own words.
* Avoid verbatim lifting of full sentences from the passage.`,
      questionTargetCount: { low: 50, medium: 50, hard: 50, total: 150 }
    }
  }
};

async function initializeEnglishFoundation() {
  const db = await getDb();
  console.log("🚀 Initializing JHS English Language Foundation in Firestore...");

  // 1. Set Root Metadata
  const rootRef = db.doc("global_curriculum/jhs/subjects/english");
  const now = new Date();
  await rootRef.set({
    subjectId: "english",
    title: "English Language (Basic 7–9 / JHS 1–3)",
    curriculumFramework: "NaCCA Common Core Programme (CCP) & WAEC/BECE Standards",
    totalStrands: englishStrands.length,
    strands: englishStrands,
    structure: {
      topicalQuestionsPerClassLevel: 150, // 50 Low, 50 Med, 50 Hard
      totalQuestionsPerTopic: 450,        // B7 (150) + B8 (150) + B9 (150)
      becePastQuestionsTarget: "2010 to 2025 (Paper 1 & Paper 2)",
      mockExamTarget: "10 Full Calibrated Mocks"
    },
    metadata: {
      status: "initialized",
      initializedAt: now,
      updatedAt: now
    }
  }, { merge: true });

  console.log("✅ Subject root metadata registered at global_curriculum/jhs/subjects/english");

  // 2. Initialize Topical Taxonomy
  for (const strand of englishStrands) {
    for (const topic of strand.topics) {
      const topicDocRef = db.doc(`global_curriculum/jhs/subjects/english/topical/${topic.id}`);
      
      const existingData = sampleTopicNotes[topic.id as keyof typeof sampleTopicNotes];

      await topicDocRef.set({
        topicId: topic.id,
        topicName: topic.name,
        strandId: strand.id,
        strandName: strand.name,
        totalQuestionsAcrossLevels: 450,
        levels: {
          b7: {
            title: "Basic 7 (JHS 1)",
            notes: existingData?.level_b7 || {
              level: "Basic 7 (JHS 1)",
              overview: `Foundational curriculum notes and learning indicators for ${topic.name}.`,
              learningObjectives: [
                `Understand foundational concepts of ${topic.name} in accordance with NaCCA B7 standards.`,
                `Identify key structures and apply rules in context.`
              ],
              coreNotesMarkdown: `### ${topic.name} (Basic 7)\nFoundational notes and concepts as prescribed by the NaCCA B7 syllabus.`,
              questionTargetCount: { low: 50, medium: 50, hard: 50, total: 150 }
            },
            questionsCount: { low: 0, medium: 0, hard: 0, total: 0 },
            questions: [] // Array container for 150 calibrated questions
          },
          b8: {
            title: "Basic 8 (JHS 2)",
            notes: existingData?.level_b8 || {
              level: "Basic 8 (JHS 2)",
              overview: `Intermediate curriculum notes and expanding applications for ${topic.name}.`,
              learningObjectives: [
                `Deepen analytical and practical command of ${topic.name} to NaCCA B8 standards.`,
                `Analyze complex sentence constructions and stylistic nuances.`
              ],
              coreNotesMarkdown: `### ${topic.name} (Basic 8)\nIntermediate analysis, usage rules, and practice frameworks.`,
              questionTargetCount: { low: 50, medium: 50, hard: 50, total: 150 }
            },
            questionsCount: { low: 0, medium: 0, hard: 0, total: 0 },
            questions: [] // Array container for 150 calibrated questions
          },
          b9: {
            title: "Basic 9 (JHS 3 / BECE Final Year)",
            notes: existingData?.level_b9 || {
              level: "Basic 9 (JHS 3)",
              overview: `Advanced mastery, BECE exam-readiness, and complex applications for ${topic.name}.`,
              learningObjectives: [
                `Master examination-standard proficiency in ${topic.name} according to WAEC/BECE requirements.`,
                `Synthesize advanced grammatical, rhetorical, and evaluative techniques.`
              ],
              coreNotesMarkdown: `### ${topic.name} (Basic 9)\nExam-standard past question patterns, syntactic analysis, and critical mastery.`,
              questionTargetCount: { low: 50, medium: 50, hard: 50, total: 150 }
            },
            questionsCount: { low: 0, medium: 0, hard: 0, total: 0 },
            questions: [] // Array container for 150 calibrated questions
          }
        },
        updatedAt: new Date()
      }, { merge: true });

      console.log(`   📂 Initialized Topic: [${strand.id}] -> ${topic.id} (450-item schema)`);
    }
  }

  // 3. Initialize Past Questions Root Placeholder (2010–2025)
  const years = Array.from({ length: 16 }, (_, i) => 2010 + i); // 2010 to 2025
  for (const year of years) {
    const pqRef = db.doc(`global_curriculum/jhs/subjects/english/past_questions/bece_${year}`);
    await pqRef.set({
      year: year,
      title: `BECE English Language ${year}`,
      paper1: {
        title: `Paper 1: Objective Test (BECE ${year})`,
        durationMinutes: 45,
        totalQuestions: 40,
        questions: []
      },
      paper2: {
        title: `Paper 2: Essay, Comprehension & Literature (BECE ${year})`,
        durationMinutes: 75,
        sections: {
          sectionA_essay: { title: "Section A: Essay Writing", instructions: "Answer one question only from this section.", questions: [] },
          sectionB_comprehension: { title: "Section B: Comprehension", instructions: "Read the passage carefully and answer all questions.", questions: [] },
          sectionC_literature: { title: "Section C: Literature", instructions: "Answer all questions on the prescribed texts.", questions: [] }
        }
      },
      status: "pending_ingestion",
      updatedAt: new Date()
    }, { merge: true });
  }
  console.log("✅ Initialized Past Questions containers for BECE 2010–2025");

  // 4. Initialize Mock Exams Root Placeholder (Mock 1 to 10)
  for (let m = 1; m <= 10; m++) {
    const mockRef = db.doc(`global_curriculum/jhs/subjects/english/mock_exams/mock_${m}`);
    await mockRef.set({
      mockId: `mock_${m}`,
      title: `BECE English Language Mock ${m} (National Benchmark Examination Suite)`,
      totalDurationMinutes: 120,
      paper1: {
        title: `Paper 1: Objective Test (Mock ${m})`,
        durationMinutes: 45,
        totalQuestions: 40,
        questions: []
      },
      paper2: {
        title: `Paper 2: Essay, Comprehension & Literature (Mock ${m})`,
        durationMinutes: 75,
        sections: {
          sectionA_essay: { title: "Section A: Essay Writing", questions: [] },
          sectionB_comprehension: { title: "Section B: Comprehension", questions: [] },
          sectionC_literature: { title: "Section C: Literature", questions: [] }
        }
      },
      status: "pending_ingestion",
      updatedAt: new Date()
    }, { merge: true });
  }
  console.log("✅ Initialized Mock Exams containers for Mock 1 to 10");

  console.log("\n🎉 JHS English Language Curriculum Foundation successfully laid!");
}

initializeEnglishFoundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to initialize English foundation:", err);
    process.exit(1);
  });

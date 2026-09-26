import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

async function getFirestoreDb(): Promise<admin.firestore.Firestore> {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const adminInst = (admin as any)?.apps ? admin : ((admin as any)?.default || require('firebase-admin'));
    if (!adminInst?.apps?.length) {
      adminInst.initializeApp({
        credential: adminInst.credential.applicationDefault(),
        projectId: 'gamedu-69888475-f5783'
      });
    }
    return adminInst.firestore();
  }

  // Use Firebase CLI OAuth credentials when running locally
  const { OAuth2Client } = require('google-auth-library');
  const { Firestore } = require('@google-cloud/firestore');
  const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient }) as any;
}

// =========================================================================
// TYPES & SCHEMAS
// =========================================================================
export type CompositionGenreType = 'narrative_proverbial' | 'descriptive_travelogue' | 'article_publication' | 'debate_speech';

export type HeadlineStyle = 'full_caps_no_underline' | 'title_case_underlined' | 'none';

export interface GuidanceScaffold {

  genreType: CompositionGenreType;

  headlineGuide?: {

    isRequired: boolean;

    recommendedStyle: HeadlineStyle;

    modelHeadline: string;

    rules: string[];

  };

  bylineGuide?: {

    isRequired: boolean;

    modelByline: string;

    rules: string[];

  };

  vocativeProtocol?: {

    isRequired: boolean;

    hierarchyOrder: string[];

    stanceProclamationModel: string;

    prohibitedOpenings: string[];

  };

  plotOrSpatialRoadmap: {

    recommendedParagraphs: number;

    targetWordCount: number;

    minimumWordCount: number;

    frameworkDescription: string;

    stagePrompts: Array<{

      stageIndex: number;

      role: string;

      guidingQuestion: string;

      transitionHints: string[];

    }>;

  };

  dialogueOrRebuttalGuide?: {

    rules: string[];

    modelSnippet: string;

  };

  moralOrPerorationGuide: {

    role: string;

    proverbOrClosingPhrase: string;

    integrationRule: string;

  };

}

export interface WritingRubricCriterion {

  name: 'content' | 'organization' | 'expression' | 'mechanical_accuracy';

  displayName: string;

  maxMarks: number;

  scoringGuidelines: string[];

  diagnosticChecklist: string[];

}

export interface WritingRubricSchema {

  totalMarks: number;

  timeAllowedMinutes: number;

  criteria: {

    content: WritingRubricCriterion;

    organization: WritingRubricCriterion;

    expression: WritingRubricCriterion;

    mechanicalAccuracy: WritingRubricCriterion;

  };

}

export interface ObjectiveQuestionItem {

  id: string;

  section: "objective";

  questionNumber: number;

  type: "multiple_choice";

  format: "multiple_choice";

  level: "B8";

  difficulty: "intermediate";

  category: "Composition & Rhetoric Mechanics";

  passageText: string;

  prompt: string;

  options: string[];

  correctAnswer: string;

  hint: string;

  workedSolution: string;

  points: 1;

  competencyTarget: string;

  learningCompetency: string;

}

export interface TheoryEssayItem {

  id: string;

  section: "theory";

  questionNumber: number;

  theoryIndex: number;

  type: "structured_essay";

  format: "structured_essay";

  level: "B8";

  difficulty: "intermediate";

  category: "Narrative Essay" | "Descriptive Essay" | "Article for Publication" | "Debate Speech";

  title: string;

  shortSummary: string;

  prompt: string;

  wordCountLimit: { min: number; target: number; max: number };

  points: 30;

  guidanceScaffold: GuidanceScaffold;

  rubric: WritingRubricSchema;

  modelAnswer: string;

  workedSolution: string;

  hint: string;

  competencyTarget: string;

  learningCompetency: string;

}

// Fisher-Yates array shuffling algorithm

function shuffleArray<T>(array: T[]): T[] {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];

  }

  return arr;

}

const createWAECRubric = (

  contentGuide: string[],

  contentCheck: string[],

  orgGuide: string[],

  orgCheck: string[],

  expGuide: string[],

  expCheck: string[]

): WritingRubricSchema => ({

  totalMarks: 30,

  timeAllowedMinutes: 45,

  criteria: {

    content: {

      name: "content",

      displayName: "Content & Idea Development",

      maxMarks: 10,

      scoringGuidelines: contentGuide,

      diagnosticChecklist: contentCheck

    },

    organization: {

      name: "organization",

      displayName: "Organization & Genre Architecture",

      maxMarks: 5,

      scoringGuidelines: orgGuide,

      diagnosticChecklist: orgCheck

    },

    expression: {

      name: "expression",

      displayName: "Expression, Tone & Rhetorical Register",

      maxMarks: 10,

      scoringGuidelines: expGuide,

      diagnosticChecklist: expCheck

    },

    mechanicalAccuracy: {

      name: "mechanical_accuracy",

      displayName: "Mechanical Accuracy",

      maxMarks: 5,

      scoringGuidelines: [

        "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."

      ],

      diagnosticChecklist: [

        "Consistent tense maintenance across complex multi-clause sentences",

        "Dialogue tags punctuated strictly within quotation marks",

        "Rigorous subject-verb concord and zero contraction slips in formal articles/debates"

      ]

    }

  }

});

// =========================================================================

// 50 UNIQUE OBJECTIVE COMPOSITION & RHETORIC DRILLS (QUESTIONS 1 TO 50)

// Basic 8 Intermediate Focus:

// Complex Narrative Pacing, Proverbial Synthesis, Spatial Framing,

// Journalistic Register, Inquit Tag Orthography, and Debate Rebuttal Architecture

// =========================================================================

const rawObjective50Data = [

  {

    passage: "A candidate is illustrating the proverb: 'When the cat is away, the mice will play.'",

    question: "Which of the following narrative plotlines captures the essence of this aphorism authentically?",

    options: [

      "Boarding house students engage in chaotic pranks and noisy indiscipline the moment their strict housemaster departs for a weekend seminar",

      "A farmer purchases three cats to hunt rodents destroying his maize storage barn",

      "A domestic cat chases a mouse across a kitchen floor until it escapes under a cupboard",

      "A student adopts a pet cat and feeds it milk every morning before walking to school"

    ],

    answer: "Boarding house students engage in chaotic pranks and noisy indiscipline the moment their strict housemaster departs for a weekend seminar",

    hint: "The proverb warns of what happens when supervisory authority is temporarily absent.",

    solution: "The proverb depicts how subordinates or children exploit the temporary absence of supervisory authority to engage in uncontrolled mischief. The boarding house scenario embodies this theme perfectly.",

    target: "Proverbial Interpretation & Narrative Plotline Conception"

  },

  {

    passage: "In a formal article intended for the *Daily Graphic*, the writer starts paragraph 1 with: 'I am taking my pen to write this article because I am very annoyed about sanitation.'",

    question: "What expressive defect undermines this opening lead sentence?",

    options: [

      "Cliché redundant preamble ('I am taking my pen') and subjective emotional petulance rather than an objective journalistic lead",

      "An unpunctuated relative clause",

      "Use of the past continuous aspect",

      "An erroneous inside address"

    ],

    answer: "Cliché redundant preamble ('I am taking my pen') and subjective emotional petulance rather than an objective journalistic lead",

    hint: "Avoid trite epistolary filler and subjective outbursts in public print media.",

    solution: "Phrases like 'I take my pen to write' are empty colloquial clichés. Journalistic articles require an objective, engaging lead paragraph that summarizes the core 5 Ws.",

    target: "Articles for Publication: Lead Paragraph Quality"

  },

  {

    passage: "A student writes a headline: '<u>THE MENACE OF PLASTIC WASTE IN GHANA</u>'.",

    question: "How should this headline be corrected to conform strictly to WAEC orthography?",

    options: [

      "Remove the underline from the all-caps heading, or write it in Title Case with an underline",

      "Add a full stop at the very end of the headline",

      "Place the entire headline inside double quotation marks",

      "Write the author's examination index number inside the headline"

    ],

    answer: "Remove the underline from the all-caps heading, or write it in Title Case with an underline",

    hint: "All-caps headings are never underlined; Title Case headings must be underlined.",

    solution: "Headlines written in ALL CAPITAL LETTERS must not be underlined. If an underline is desired, the heading must be converted into Title Case: '<u>The Menace of Plastic Waste in Ghana</u>'.",

    target: "Headline Typography: Underline Harmonization"

  },

  {

    passage: "In a debate competition, the second opposing speaker begins by directly disproving the proposition's statistical claims on solar panel costs.",

    question: "What technical rhetorical term designates this maneuver?",

    options: [

      "Forensic Rebuttal (Refutation)",

      "The Exordium",

      "The Parliamentary Vocative",

      "The Peroration"

    ],

    answer: "Forensic Rebuttal (Refutation)",

    hint: "It is the direct dismantling of an opponent's argument using counter-evidence.",

    solution: "Forensic rebuttal is the debate component where a speaker directly attacks and dismantles the specific premises, data, or logic presented by opposing speakers.",

    target: "Debate Speech: Forensic Rebuttal"

  },

  {

    passage: "Examine this dialogue punctuation: '\"Why did you arrive late?\" asked the tutor. \"The school bus broke down,\" replied Kwadwo.'",

    question: "Why is this dialogue formatted and punctuated with absolute accuracy?",

    options: [

      "Each speaker's utterance starts on a fresh line, terminal punctuation sits inside the quotes, and reporting tags are lowercase",

      "Because the dialogue tags are placed in brackets",

      "Because the word 'replied' is written in all-caps",

      "Because quotation marks are omitted around the second sentence"

    ],

    answer: "Each speaker's utterance starts on a fresh line, terminal punctuation sits inside the quotes, and reporting tags are lowercase",

    hint: "Look at lineation, punctuation boundaries, and inquit verb casing.",

    solution: "Standard dialogue orthography requires: a new line for each speaker, punctuation marks inside quotation boundaries, and lowercase reporting verbs when following dialogue.",

    target: "Dialogue Formatting: Complete Mechanical Accuracy"

  },

  {

    passage: "A student writes in a descriptive essay: 'The screeching owl flew silently into the night.'",

    question: "What semantic flaw weakens the sensory description in this sentence?",

    options: [

      "An internal logical contradiction between 'screeching' and 'silently'",

      "An ungrammatical subject-verb concord mismatch",

      "A misplaced adverbial clause",

      "Use of passive voice"

    ],

    answer: "An internal logical contradiction between 'screeching' and 'silently'",

    hint: "An entity cannot be making loud screeching sounds while simultaneously moving silently.",

    solution: "Describing an owl as 'screeching' while simultaneously flying 'silently' creates a descriptive contradiction that bewilders the reader's sensory imagination.",

    target: "Descriptive Writing: Sensory Consistency"

  },

  {

    passage: "What is the primary function of the 'inciting incident' in narrative plot structure?",

    question: "Select the precise narrative role:",

    options: [

      "To disrupt the baseline status quo and trigger the central dramatic conflict",

      "To summarize the moral lesson at the end of the story",

      "To introduce the names and family lineages of all characters",

      "To provide a detailed physical description of the landscape"

    ],

    answer: "To disrupt the baseline status quo and trigger the central dramatic conflict",

    hint: "It is the event that sets the story's main action into motion.",

    solution: "The inciting incident shatters the opening equilibrium, confronting the protagonist with a dilemma, obstacle, or choice that drives the rising action.",

    target: "Freytag's Pyramid: Inciting Incident Function"

  },

  {

    passage: "A candidate writes: 'Neither the headmaster nor the teachers was present at the regional debate.'",

    question: "Under the Principle of Proximity Concord, how should the verb be corrected?",

    options: [

      "were present (agreeing in plural number with the nearest subject 'teachers')",

      "are present",

      "has been present",

      "is present"

    ],

    answer: "were present (agreeing in plural number with the nearest subject 'teachers')",

    hint: "With 'neither... nor', the verb agrees with the subject closest to it.",

    solution: "The Principle of Proximity Concord mandates that with correlative conjunctions ('neither... nor'), the finite verb agrees with the nearest nominal element ('teachers' -> 'were').",

    target: "Concord Mechanics: Correlative Proximity"

  },

  {

    passage: "In an argumentative essay on road safety, which of the following provides the most persuasive empirical evidence?",

    question: "Select the most credible supporting evidence:",

    options: [

      "Statistical reports from the National Road Safety Authority showing an 80% decrease in pedestrian fatalities after speed tables were constructed",

      "The writer's personal opinion that asphalt speed ramps look attractive on highways",

      "An unconfirmed rumor heard at a local taxi rank",

      "A story about a bicycle that suffered a flat tire"

    ],

    answer: "Statistical reports from the National Road Safety Authority showing an 80% decrease in pedestrian fatalities after speed tables were constructed",

    hint: "Empirical evidence relies on documented data from recognized public institutions.",

    solution: "Empirical statistics from accredited statutory bodies carry authoritative evidential weight, elevating an argument above unsubstantiated subjective assertion.",

    target: "Argumentative Logic: Empirical Evidence"

  },

  {

    passage: "Where should the byline of an article intended for publication be positioned?",

    question: "Select the standard location for an article's byline:",

    options: [

      "Directly beneath the headline or centered at the end of the text",

      "In the top right corner accompanied by a full postal address",

      "In the middle of the second paragraph as a parenthetical note",

      "Within the concluding moral sentence only"

    ],

    answer: "Directly beneath the headline or centered at the end of the text",

    hint: "Bylines announce authorship immediately following the title or at the close.",

    solution: "A byline (e.g., 'By Francis Appiah, Basic 8') belongs immediately beneath the headline or appended at the very end of the article, without postal addresses.",

    target: "Articles for Publication: Byline Positioning"

  },

  {

    passage: "A debate speaker uses the phrase: 'We need bold leadership, decisive action, and unyielding discipline.'",

    question: "What rhetorical figure of speech is demonstrated by this three-part structure?",

    options: [

      "Tricolon (rule of three)",

      "Oxymoron",

      "Euphemism",

      "Hyperbole"

    ],

    answer: "Tricolon (rule of three)",

    hint: "A series of three parallel words or phrases used for emphasis.",

    solution: "A tricolon groups three parallel grammatical units ('bold leadership, decisive action, and unyielding discipline') to create rhythmic persuasive impact.",

    target: "Rhetorical Devices: Tricolon Structure"

  },

  {

    passage: "A candidate writes: 'The market was filled with nice things and good people.'",

    question: "Why is this sentence evaluated as weak descriptive writing under WAEC rubrics?",

    options: [

      "It relies on vague, abstract adjectives ('nice', 'good') rather than concrete sensory details",

      "It contains multiple spelling mistakes",

      "It is written in the passive voice",

      "The market should not be described in an essay"

    ],

    answer: "It relies on vague, abstract adjectives ('nice', 'good') rather than concrete sensory details",

    hint: "Descriptive writing must show specific physical details rather than telling generic labels.",

    solution: "Vague qualifiers like 'nice' and 'good' fail to engage the reader's senses. Effective descriptive writing uses concrete sensory imagery to evoke vivid reality.",

    target: "Descriptive Writing: Abstract vs. Concrete Lexis"

  },

  {

    passage: "What is the grammatical term for the reporting phrase 'whispered the frightened boy' in a narrative dialogue?",

    question: "Identify the grammatical term:",

    options: [

      "An inquit tag (dialogue tag)",

      "A parenthetical clause only",

      "A relative clause",

      "An imperative tag"

    ],

    answer: "An inquit tag (dialogue tag)",

    hint: "The clause that attributes spoken words to a speaker.",

    solution: "An inquit tag (from Latin 'inquam', meaning 'I say') is the narrative reporting clause identifying the speaker and manner of speech.",

    target: "Dialogue Mechanics: Inquit Tag Terminology"

  },

  {

    passage: "A student writes a headline: 'HOW TO CURB CYBERBULLYING IN SCHOOLS'.",

    question: "Under WAEC formatting standards, why must this all-caps headline NOT be underlined?",

    options: [

      "Headings written in ALL CAPITAL LETTERS are already typographically prominent, making underlines redundant",

      "Because all-caps headlines are forbidden in English",

      "Because headlines should only be written in green ink",

      "Because underlining causes spelling errors"

    ],

    answer: "Headings written in ALL CAPITAL LETTERS are already typographically prominent, making underlines redundant",

    hint: "Underlining is reserved for Title Case headings.",

    solution: "Block capital titles provide sufficient typographic prominence. Adding an underline is a redundant mechanical flaw penalized under WAEC guidelines.",

    target: "Headline Typography: Block Capital Prominence Rule"

  },

  {

    passage: "In a narrative composition, what role does the 'denouement' perform?",

    question: "Define the function of the denouement in Freytag's plot pyramid:",

    options: [

      "The final unraveling where mysteries are clarified, equilibrium is restored, and the moral lesson is realized",

      "The sudden shock that starts the conflict",

      "The loud argument between the main characters",

      "The opening sentence describing the morning weather"

    ],

    answer: "The final unraveling where mysteries are clarified, equilibrium is restored, and the moral lesson is realized",

    hint: "It is the final resolution of the story.",

    solution: "The denouement (or resolution) untangles the remaining plot threads, establishes a new baseline equilibrium, and reveals the lasting moral or thematic insight.",

    target: "Freytag's Pyramid: Denouement Function"

  },

  {

    passage: "A speaker in a debate says: 'Can we afford to sit unconcerned while our rivers turn to poison?'",

    question: "Why is this rhetorical question effective in an oral debate speech?",

    options: [

      "It emotionally engages the audience and compels them to agree with the speaker's implied answer",

      "Because the judges are expected to stand up and answer",

      "Because it replaces the need for factual proof",

      "Because it is an informal joke to break the ice"

    ],

    answer: "It emotionally engages the audience and compels them to agree with the speaker's implied answer",

    hint: "It provokes thought and steers the listener toward an obvious conclusion.",

    solution: "Rhetorical questions engage listeners directly, framing the issue so that the audience mentally affirms the speaker's premise without needing an answer.",

    target: "Rhetorical Devices: Persuasive Questioning"

  },

  {

    passage: "Which of the following transitions best signals a shift from cause to effect in an expository article?",

    question: "Select the causal connective adverb:",

    options: [

      "Consequently",

      "Conversely",

      "Nevertheless",

      "Simultaneously"

    ],

    answer: "Consequently",

    hint: "It indicates that the next statement is the result of the previous one.",

    solution: "'Consequently' signifies that the succeeding proposition directly results from the preceding cause.",

    target: "Discourse Markers: Causal Transitions"

  },

  {

    passage: "A narrative includes the sentence: 'His heart pounded against his ribs like a trapped bird.'",

    question: "What figurative device is employed here to depict fear?",

    options: [

      "Simile",

      "Metaphor",

      "Irony",

      "Litotes"

    ],

    answer: "Simile",

    hint: "It compares the heartbeat to a trapped bird using 'like'.",

    solution: "The explicit comparison of a racing heartbeat to a trapped bird using the connective 'like' is a simile.",

    target: "Descriptive Writing: Simile Analysis"

  },

  {

    passage: "In a formal debate, what must the speaker say immediately after completing the vocative salutations?",

    question: "Identify the required next step in debate structure:",

    options: [

      "Explicitly proclaim their stance on the motion (supporting or opposing)",

      "Narrate a funny personal joke to relax the judges",

      "Read out the full dictionary definition of every word in the dictionary",

      "Sit down and wait for the opponents to speak"

    ],

    answer: "Explicitly proclaim their stance on the motion (supporting or opposing)",

    hint: "The speaker must clearly announce which side they are defending.",

    solution: "Following the formal vocatives, a debate speaker must state their stance clearly: 'I rise to stoutly support/oppose the motion which states that...'.",

    target: "Debate Speech: Stance Proclamation"

  },

  {

    passage: "A student writing an article on road safety begins: 'According to statistics from the National Road Safety Authority, eighty percent of accidents result from human error.'",

    question: "What quality does citing this statistical evidence add to the essay?",

    options: [

      "Objective credibility and empirical authority",

      "Emotional subjectivity",

      "Informal conversational intimacy",

      "Poetic figurative flair"

    ],

    answer: "Objective credibility and empirical authority",

    hint: "Official statistics ground claims in verifiable reality.",

    solution: "Citing data from recognized authorities gives expository writing empirical credibility, elevating the composition above mere opinion.",

    target: "Expository Craft: Empirical Grounding"

  },

  {

    passage: "Which of the following details engages the tactile sensory register?",

    question: "Select the tactile description:",

    options: [

      "The coarse, blistered wooden handle chafed against his bleeding palms",

      "The shrill whistle of the train echoed down the tracks",

      "The sour sting of unripe lemon juice curdled on his tongue",

      "The golden rays of dawn filtered through the morning mist"

    ],

    answer: "The coarse, blistered wooden handle chafed against his bleeding palms",

    hint: "Tactile relates to touch, physical friction, and skin sensation.",

    solution: "'Coarse, blistered wooden handle chafed against his bleeding palms' describes direct physical contact, texture, and pain, appealing to the tactile sense.",

    target: "Descriptive Writing: Tactile Sensory Imagery"

  },

  {

    passage: "A student writes a narrative where the protagonist disregards advice and suffers disaster, concluding: 'He realized that a word to the wise is enough.'",

    question: "Why is this integration of the proverb considered effective?",

    options: [

      "It ties the aphorism directly into the character's moral realization and the story's outcome",

      "Because it is printed in bold capital letters",

      "Because it is translated into Latin",

      "Because it appears in every paragraph"

    ],

    answer: "It ties the aphorism directly into the character's moral realization and the story's outcome",

    hint: "The proverb emerges naturally from the character's lived experience.",

    solution: "Organic proverbial integration weaves the moral into the protagonist's realization, demonstrating how the events validate the proverb.",

    target: "Narrative Craft: Organic Proverb Integration"

  },

  {

    passage: "In debate terminology, what does 'ad hominem' mean, and why is it penalized?",

    question: "Define an ad hominem fallacy in debate speech:",

    options: [

      "Attacking an opponent's personal appearance or character rather than their argument; it violates parliamentary decorum",

      "Speaking for longer than the timekeeper allows",

      "Using statistics from foreign encyclopedias",

      "Agreeing with the judges on all points"

    ],

    answer: "Attacking an opponent's personal appearance or character rather than their argument; it violates parliamentary decorum",

    hint: "It is a personal attack on the person rather than addressing the substance of their point.",

    solution: "An ad hominem argument attacks the individual rather than the logic of their position. It violates parliamentary debate decorum and attracts deductions under Expression.",

    target: "Debate Logic: Ad Hominem Fallacy"

  },

  {

    passage: "Examine this sentence: 'The screeching owl flew silently into the night.'",

    question: "What contradictory descriptive defect is present here?",

    options: [

      "A logical contradiction between 'screeching' and 'silently'",

      "A grammatical subject-verb concord error",

      "An unpunctuated relative clause",

      "Use of the future tense"

    ],

    answer: "A logical contradiction between 'screeching' and 'silently'",

    hint: "Something cannot be screeching and silent at the same time.",

    solution: "Claiming an owl is 'screeching' while simultaneously flying 'silently' creates a descriptive contradiction that confuses the reader.",

    target: "Expression: Descriptive Consistency"

  },

  {

    passage: "What is the primary objective of an article's concluding 'call to action'?",

    question: "Select the function of a call to action:",

    options: [

      "To urge readers, community leaders, or authorities to adopt specific solutions to solve the problem",

      "To invite readers to send private letters to the author's home",

      "To summarize all the words alphabetically",

      "To state the author's personal examination index number"

    ],

    answer: "To urge readers, community leaders, or authorities to adopt specific solutions to solve the problem",

    hint: "It moves readers from awareness to taking practical steps.",

    solution: "A call to action mobilizes stakeholders to address the social, educational, or environmental issue analyzed in the essay.",

    target: "Articles for Publication: Call to Action"

  },

  {

    passage: "Which of the following sentences illustrates grammatical parallelism across clauses?",

    question: "Select the sentence demonstrating syntactic parallelism:",

    options: [

      "She loved reading novels, painting portraits, and writing short stories.",

      "She loved reading novels, to paint portraits, and wrote stories.",

      "She loved to read, painting, and stories.",

      "She loved novels, to paint, and writing."

    ],

    answer: "She loved reading novels, painting portraits, and writing short stories.",

    hint: "All three elements share the exact same grammatical form: gerund + noun.",

    solution: "'Reading novels, painting portraits, and writing short stories' maintains consistent gerund-noun phrasing, achieving balanced grammatical parallelism.",

    target: "Syntactic Style: Grammatical Parallelism"

  },

  {

    passage: "A narrative includes the line: 'The dark forest seemed to watch their every step with silent menace.'",

    question: "What figurative device is used here to build suspense?",

    options: [

      "Personification",

      "Hyperbole",

      "Oxymoron",

      "Euphemism"

    ],

    answer: "Personification",

    hint: "Giving human intent ('watching with menace') to an inanimate forest.",

    solution: "Attributing human intent (watching with menace) to an inanimate setting personifies the environment, heightening atmospheric suspense.",

    target: "Descriptive Writing: Personification"

  },

  {

    passage: "In debate evaluation, what does 'clash' mean?",

    question: "Define clash in competitive debate:",

    options: [

      "Direct engagement and refutation of the core arguments advanced by the opposing side",

      "Physical contact between debaters on stage",

      "Speaking louder than the other team",

      "Wearing identical debate uniforms"

    ],

    answer: "Direct engagement and refutation of the core arguments advanced by the opposing side",

    hint: "It occurs when arguments meet head-to-head rather than talking past each other.",

    solution: "'Clash' refers to directly engaging and refuting an opponent's central arguments rather than presenting parallel, unrelated speeches.",

    target: "Debate Speech: Conceptual Clash"

  },

  {

    passage: "A student writes: 'I woke up early, I brushed my teeth, I went to school, I saw the teacher.'",

    question: "What stylistic flaw weakens the expression of this narrative sequence?",

    options: [

      "Monotonous repetitive syntax lacking varied sentence connectors and subordination",

      "Tense inconsistency across past tense verbs",

      "Inappropriate use of passive voice",

      "Unpunctuated dialogue tags"

    ],

    answer: "Monotonous repetitive syntax lacking varied sentence connectors and subordination",

    hint: "Repeatedly starting clauses with 'I [verb]' creates a repetitive rhythm.",

    solution: "Stringing together identical short clauses ('I woke... I brushed... I went...') produces a monotonous rhythm. Skilled writers vary clause structures using subordinate linkers and participial phrases.",

    target: "Expression: Syntactic Variety"

  },

  {

    passage: "Which of the following represents an accurate guideline for Title Case headlines?",

    question: "Select the correct Title Case capitalization rule:",

    options: [

      "Capitalize nouns, verbs, and adjectives, but keep short prepositions and coordinating conjunctions in lowercase",

      "Capitalize every single letter in every word",

      "Write all words in lowercase letters except the final word",

      "Only capitalize the first letter of the first word"

    ],

    answer: "Capitalize nouns, verbs, and adjectives, but keep short prepositions and coordinating conjunctions in lowercase",

    hint: "Major lexical words are capitalized; grammatical words remain lowercase.",

    solution: "Title Case capitalizes lexical words (nouns, verbs, adjectives, adverbs), keeping short grammatical words (prepositions, conjunctions, articles) lowercase unless they start the heading.",

    target: "Headline Typography: Title Case Rules"

  },

  {

    passage: "A narrative describes an athlete crossing the finish line: 'He collapsed onto the cinder track, chest heaving, lungs burning for oxygen.'",

    question: "What descriptive technique is employed in this sentence?",

    options: [

      "Show, don't tell: depicting physical exhaustion through bodily sensations rather than abstract adjectives",

      "Telling the reader that the boy was very tired",

      "Using abstract mathematical measurements",

      "Introducing an irrelevant minor character"

    ],

    answer: "Show, don't tell: depicting physical exhaustion through bodily sensations rather than abstract adjectives",

    hint: "It depicts exhaustion through physical bodily reactions.",

    solution: "'Chest heaving, lungs burning for oxygen' demonstrates the 'show, don't tell' principle by describing physiological reactions rather than stating 'he was tired'.",

    target: "Descriptive Writing: Show, Don't Tell"

  },

  {

    passage: "In an argumentative essay on mobile phones in school, which of the following represents a balanced refutation?",

    question: "Select the most effective refutation structure:",

    options: [

      "While smartphones offer instant access to digital research, their presence in classrooms creates severe distractions that undermine concentration.",

      "Smartphones are totally evil and anyone who likes them is foolish.",

      "Smartphones are good because I like playing games on them.",

      "Smartphones have no advantages whatsoever in education."

    ],

    answer: "While smartphones offer instant access to digital research, their presence in classrooms creates severe distractions that undermine concentration.",

    hint: "It concedes a genuine benefit before countering with its primary educational flaw.",

    solution: "The sentence acknowledges a real benefit ('instant access to research') before delivering its counter-argument ('severe distractions'), creating a balanced, persuasive refutation.",

    target: "Argumentative Logic: Balanced Refutation"

  },

  {

    passage: "A student writes: 'The aroma of fresh hot bread was everywhere.'",

    question: "Which sensory organ is primarily appealed to by this description?",

    options: [

      "The nose (olfactory sense)",

      "The eyes (visual sense)",

      "The ears (auditory sense)",

      "The skin (tactile sense)"

    ],

    answer: "The nose (olfactory sense)",

    hint: "'Aroma' is an odor perceived through smelling.",

    solution: "'Aroma' describes a distinct scent or fragrance, appealing directly to the olfactory faculty.",

    target: "Descriptive Writing: Olfactory Imagery"

  },

  {

    passage: "What is the purpose of using an 'in medias res' opening in advanced narrative writing?",

    question: "Define an in medias res opening:",

    options: [

      "Starting the narrative right in the middle of dramatic action rather than beginning with slow background exposition",

      "Beginning the essay by listing all the vocabulary words used",

      "Writing the moral lesson at the top of the sheet",

      "Starting with the character waking up and brushing teeth"

    ],

    answer: "Starting the narrative right in the middle of dramatic action rather than beginning with slow background exposition",

    hint: "Latin for 'into the middle of things'.",

    solution: "'In medias res' plunges the reader immediately into the center of a crisis or action, capturing attention before filling in necessary background context.",

    target: "Narrative Craft: In Medias Res Hook"

  },

  {

    passage: "In a debate speech, why is it customary to thank the Chairperson and audience at the very end?",

    question: "State the parliamentary rationale:",

    options: [

      "To observe parliamentary courtesy and formal valediction protocol",

      "Because the speaker ran out of arguments",

      "Because the speaker made a mistake and wishes to apologize",

      "To tell the judges that the timekeeper was unfair"

    ],

    answer: "To observe parliamentary courtesy and formal valediction protocol",

    hint: "It is a standard polite convention closing formal speeches.",

    solution: "Concluding with 'Thank you, Mr. Chairman, ladies and gentlemen' adheres to formal parliamentary courtesy, acknowledging the house and judges.",

    target: "Debate Speech: Valedictory Etiquette"

  },

  {

    passage: "Which of the following sentences contains an ungrammatical comma splice?",

    question: "Identify the comma splice error:",

    options: [

      "The rain fell heavily, the streets flooded within minutes.",

      "The rain fell heavily; the streets flooded within minutes.",

      "The rain fell heavily, and the streets flooded within minutes.",

      "Because the rain fell heavily, the streets flooded within minutes."

    ],

    answer: "The rain fell heavily, the streets flooded within minutes.",

    hint: "Two independent clauses joined by only a comma without a conjunction.",

    solution: "Joining two complete independent clauses with only a comma without a coordinating conjunction creates a comma splice, penalized under Mechanical Accuracy.",

    target: "Sentence Mechanics: Comma Splice Identification"

  },

  {

    passage: "A candidate writes: 'The market was as chaotic as a disturbed beehive.'",

    question: "What figurative device is used to describe the crowd's movement?",

    options: [

      "Simile",

      "Metaphor",

      "Personification",

      "Synecdoche"

    ],

    answer: "Simile",

    hint: "The comparison uses the connective 'as... as'.",

    solution: "Explicitly comparing the market's chaos to a disturbed beehive using 'as' is a simile.",

    target: "Descriptive Writing: Simile Analysis"

  },

  {

    passage: "What is the primary function of paragraphing in an extended continuous essay?",

    question: "Identify the function of paragraph division:",

    options: [

      "To group sentences around a single coherent controlling idea, providing clear structural progression",

      "To ensure the essay looks neat and uses up space on the page",

      "To start a new paragraph every five lines regardless of thought",

      "To make room for handwriting corrections"

    ],

    answer: "To group sentences around a single coherent controlling idea, providing clear structural progression",

    hint: "Each paragraph develops one central idea.",

    solution: "Paragraphs organize thought, grouping related sentences around a single controlling topic sentence to guide the reader through the argument or narrative.",

    target: "Organizational Structure: Paragraph Cohesion"

  },

  {

    passage: "A narrative includes the line: '\"Halt!\" the guard commanded. \"Who goes there?\"'",

    question: "Why is the punctuation of this speech segment correct?",

    options: [

      "The inquit tag terminates with a period because 'Halt!' and 'Who goes there?' are distinct independent utterances",

      "Because 'commanded' is capitalized",

      "Because question marks cannot be placed inside quotation marks",

      "Because quotation marks are omitted from the second half"

    ],

    answer: "The inquit tag terminates with a period because 'Halt!' and 'Who goes there?' are distinct independent utterances",

    hint: "Two separate spoken sentences separated by a tag require a full stop after the tag.",

    solution: "When an inquit tag separates two complete spoken sentences, the tag must conclude with a full stop, and the second sentence begins with a capital letter inside quotation marks.",

    target: "Dialogue Mechanics: Separate Utterance Punctuation"

  },

  {

    passage: "Which of the following discourse markers is best suited to introduce an illustrative example in an article?",

    question: "Select the exemplary connective phrase:",

    options: [

      "For instance",

      "Nevertheless",

      "Conversely",

      "In conclusion"

    ],

    answer: "For instance",

    hint: "'For instance' introduces a specific supporting example.",

    solution: "'For instance' (or 'For example') signals the introduction of concrete evidence or an illustration supporting the preceding claim.",

    target: "Discourse Markers: Exemplification"

  },

  {

    passage: "In a debate opposing the motion 'Day Schools Are Better Than Boarding Schools,' what should the speaker emphasize?",

    question: "Select the most compelling argument opposing the motion (supporting boarding schools):",

    options: [

      "Boarding schools provide structured, uninterrupted evening study prep and eliminate grueling daily commutes",

      "Day schools allow children to watch television every evening",

      "Boarding school food is always tastier than home food",

      "Day students never have to buy uniforms"

    ],

    answer: "Boarding schools provide structured, uninterrupted evening study prep and eliminate grueling daily commutes",

    hint: "Focus on academic structure, prep supervision, and eliminating travel fatigue.",

    solution: "Emphasizing structured study routines, mandatory evening prep, and eliminating long commuting distances provides strong substantive argumentation in favor of boarding institutions.",

    target: "Debate Logic: Substantive Argumentation"

  },

  {

    passage: "A candidate writes: 'The silence was shattered by a deafening crash.'",

    question: "What sensory contrast is created in this sentence?",

    options: [

      "A sharp auditory contrast between total quiet and explosive sound",

      "A visual contrast between black and white",

      "A temperature contrast between hot and cold",

      "A gustatory contrast between sweet and bitter"

    ],

    answer: "A sharp auditory contrast between total quiet and explosive sound",

    hint: "It juxtaposes silence with a loud crash.",

    solution: "Contrasting 'silence' with a 'deafening crash' creates an acoustic juxtaposition that heightens dramatic impact.",

    target: "Descriptive Craft: Auditory Contrast"

  },

  {

    passage: "Why are informal contractions (e.g., 'can't', 'won't', 'gonna') prohibited in formal debate speeches?",

    question: "State the stylistic reason:",

    options: [

      "They degrade the elevated, authoritative register expected in parliamentary debate and attract Expression penalties",

      "Because the timekeeper cannot hear contracted words clearly",

      "Because contractions are only permitted in poetry",

      "Because debaters must speak for at least ten minutes"

    ],

    answer: "They degrade the elevated, authoritative register expected in parliamentary debate and attract Expression penalties",

    hint: "Debates require formal spoken English, not casual street speech.",

    solution: "Formal debate speeches demand an elevated, dignified register. Contracted auxiliaries and colloquial shortcuts diminish authority and are penalized under Expression.",

    target: "Debate Speech: Register and Contraction Ban"

  },

  {

    passage: "Under the WAEC 30-mark Paper 2 marking guide, how is a candidate penalized for writing an essay that falls well below the 250-word requirement (e.g., only 120 words)?",

    question: "How is severe brevity penalized?",

    options: [

      "Content marks are capped at a maximum of 4 to 5 marks because points are undeveloped",

      "The script is automatically cancelled with zero marks",

      "Deductions are made only under Mechanical Accuracy",

      "No penalty is applied if handwriting is neat"

    ],

    answer: "Content marks are capped at a maximum of 4 to 5 marks because points are undeveloped",

    hint: "Essays under 150 words cannot adequately develop ideas, capping the Content score.",

    solution: "In WAEC marking schemes, essays falling well below length thresholds (~250 words) are penalized heavily under Content, with marks capped at a ceiling of 4–5 out of 10 due to superficial treatment.",

    target: "WAEC Rubrics: Length Penalty Ceilings"

  },

  {

    passage: "A student writes: 'The committee have made their decision.'",

    question: "When 'committee' functions as a single unified collective entity, how should the verb be constructed?",

    options: [

      "has made (singular concord for a unified corporate entity)",

      "have made",

      "are making",

      "were made"

    ],

    answer: "has made (singular concord for a unified corporate entity)",

    hint: "A collective noun acting as a single unit takes a singular verb.",

    solution: "When a collective noun functions as a single unified institution, standard prescriptive concord mandates the singular verb 'has made'.",

    target: "Concord Mechanics: Collective Nouns"

  },

  {

    passage: "Which of the following sentences correctly applies an inverted conditional structure?",

    question: "Select the inverted conditional sentence:",

    options: [

      "Had I known about the revision class, I would have attended punctually.",

      "If I had known about the revision class, I would have attended punctually.",

      "If I would have known about the class, I had attended.",

      "I had known about the class if I attended."

    ],

    answer: "Had I known about the revision class, I would have attended punctually.",

    hint: "Inversion fronts the auxiliary 'Had' and omits 'if'.",

    solution: "'Had I known...' is an inverted third conditional construction that omits the conjunction 'if' by fronting the auxiliary verb, representing sophisticated formal syntax.",

    target: "Advanced Syntax: Inverted Conditionals"

  },

  {

    passage: "In an article, what is the rhetorical effect of a short, punchy single-clause sentence following a long, complex periodic sentence?",

    question: "Identify the stylistic impact:",

    options: [

      "It delivers dramatic emphasis and emotional impact through rhythmic variation",

      "It reveals that the author ran out of ideas",

      "It is a grammatical punctuation error",

      "It confuses the reader unnecessarily"

    ],

    answer: "It delivers dramatic emphasis and emotional impact through rhythmic variation",

    hint: "Varying sentence length creates dramatic contrast.",

    solution: "Juxtaposing a brief, punchy sentence against a long periodic sentence creates rhythmic contrast, focusing intense reader attention on the core takeaway.",

    target: "Syntactic Style: Rhythmic Variation"

  },

  {

    passage: "A narrative includes the sentence: 'The old oak tree groaned in agony as the lightning bolt shattered its trunk.'",

    question: "What figurative device is used to describe the tree's destruction?",

    options: [

      "Personification",

      "Simile",

      "Synecdoche",

      "Alliteration only"

    ],

    answer: "Personification",

    hint: "Attributing human groaning and agony to a tree.",

    solution: "Attributing the human capacity to 'groan in agony' to an inanimate tree personifies nature, heightening dramatic atmospheric intensity.",

    target: "Descriptive Writing: Personification"

  },

  {

    passage: "In a debate speech, why is it vital to define key terms operationally in paragraph 1?",

    question: "State the purpose of operational definitions:",

    options: [

      "To establish clear contextual boundaries for the debate and prevent semantic confusion",

      "To demonstrate that the speaker memorized the dictionary",

      "To use up time on the timekeeper's clock",

      "To insult the opposing team's vocabulary"

    ],

    answer: "To establish clear contextual boundaries for the debate and prevent semantic confusion",

    hint: "It clarifies how contentious words are understood within the scope of the motion.",

    solution: "Operational definitions establish clear conceptual parameters, ensuring that the debate addresses the core issue without drifting into semantic ambiguity.",

    target: "Debate Logic: Operational Definitions"

  },

  {

    passage: "A candidate writes: 'The smell of hot jollof rice was sweet and nice.'",

    question: "How should this weak descriptive sentence be elevated to create mouth-watering culinary imagery?",

    options: [

      "Aromatic steam rose from the steaming cauldron of jollof rice, redolent with smoked bay leaves, crushed rosemary, and caramelized tomato essence.",

      "The jollof rice was sweet and tasted very good.",

      "People liked the jollof rice because the smell was fine.",

      "The rice was hot and had a nice taste."

    ],

    answer: "Aromatic steam rose from the steaming cauldron of jollof rice, redolent with smoked bay leaves, crushed rosemary, and caramelized tomato essence.",

    hint: "Replace vague qualifiers with specific spices, culinary actions, and sensory adjectives.",

    solution: "The elevated version uses concrete culinary nouns ('steaming cauldron', 'bay leaves', 'caramelized tomato essence') and evocative adjectives ('aromatic', 'redolent') to recreate the sensory experience vividly.",

    target: "Descriptive Writing: Culinary Sensory Elevation"

  }

];

// =========================================================================

// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)

// Basic 8 Intermediate Scaffolds & Model Compositions (~250 words each)

// Covering: Narrative Moral Stories, Sensory Travelogues, Articles & Debates

// =========================================================================

const theory10Prompts: TheoryEssayItem[] = [

  // 51. Narrative: Illustrating 'When the Cat Is Away, the Mice Will Play'

  {

    id: "B8_S4_E_I_T_01",

    section: "theory",

    questionNumber: 51,

    theoryIndex: 1,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Narrative Essay",

    title: "Chaos in the Dormitory",

    shortSummary: "Write a narrative story illustrating the proverb: 'When the cat is away, the mice will play.'",

    prompt: "Write a story that illustrates the truth of the proverb: 'When the cat is away, the mice will play.' Narrate how boarding house students took advantage of their strict housemaster's weekend absence to organize an unauthorized midnight party, only for the housemaster to return unannounced during the peak of the chaos.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Narrative Conflict Pacing, Dramatic Irony & Organic Proverb Integration",

    learningCompetency: "B8.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through escalating mischief, dramatic turning points, and moral resolution.",

    hint: "Establish the housemaster's strict reputation early on. Describe the sudden announcement of his weekend departure, the escalating indiscipline in the dormitory, his sudden return, and the moral consequence.",

    guidanceScaffold: {

      genreType: "narrative_proverbial",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "The Price of Midnight Revelry",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Narrative plot arc tracing authority departure, escalating dorm mischief, unexpected confrontation, and moral consequence.",

        stagePrompts: [

          { stageIndex: 1, role: "Exposition & Authority Departure", guidingQuestion: "Introduce strict Housemaster Mr. Mensah departing for an emergency weekend seminar in Accra.", transitionHints: ["In House Three of St. Peter's Junior High School, discipline was maintained with an iron rod...", "When our strict housemaster, Mr. Mensah, announced that he was traveling to Accra for a three-day conference..."] },

          { stageIndex: 2, role: "Rising Action & Escalating Indiscipline", guidingQuestion: "Describe how study prep was abandoned as boarders organized an unauthorized midnight feast with booming Bluetooth speakers.", transitionHints: ["The moment his vehicle cleared the school gate, restraint evaporated...", "Mandatory evening study prep was abandoned as boys brought out hidden electric cookers, frying sausages and blasting music..."] },

          { stageIndex: 3, role: "The Climax: Unannounced Return", guidingQuestion: "Narrate the wild pillow fights and dancing abruptly frozen by Mr. Mensah's car headlights sweeping across the room.", transitionHints: ["At midnight, the dormitory was a roaring madhouse of flying pillows and dancing...", "Without warning, the headlights of a car flashed across the frosted windows, and the heavy front door swung open..."] },

          { stageIndex: 4, role: "Denouement, Punishment & Proverbial Realization", guidingQuestion: "Describe the frozen terror of the students, the disciplinary sanctions imposed, and the moral lesson.", transitionHints: ["Standing in the doorway with folded arms, Mr. Mensah's icy gaze silenced the room instantly...", "Tasked with weeding the football field at dawn, the exhausted boys realized: when the cat is away, the mice will play..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Resolution & Moral Aphorism",

        proverbOrClosingPhrase: "When the cat is away, the mice will play.",

        integrationRule: "Weave the proverb organically into the narrator's final reflection during the morning disciplinary punishment."

      }

    },

    rubric: createWAECRubric(

      ["Strict housemaster authority and departure established (2 marks)", "Escalating dormitory mischief and midnight chaos depicted vividly (4 marks)", "Sudden return, disciplinary consequences, and organic proverb integration (4 marks)"],

      ["Setting and character established", "Dormitory chaos shown vividly", "Proverb integrated organically"],

      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],

      ["Headline correct", "Paragraph transitions smooth", "Dialogue mechanics accurate"],

      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and kinetic adjectives (3 marks)"],

      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]

    ),

    modelAnswer: `The Price of Midnight Revelry\n______________________________\n\nIn House Three of St. Peter's Junior High School, discipline was maintained with an iron rod by our formidable housemaster, Mr. Mensah, affectionately nicknamed 'The Hawk.' Under his watchful gaze, lights-out at 9:00 p.m. was observed with religious precision, and whispers after dark earned offenders severe manual labor. Therefore, when Mr. Mensah announced during Friday morning roll-call that he was departing for a three-day educational conference in Accra, an unspoken wave of exhilaration rippled through the dormitory.\n\nThe moment his blue saloon car cleared the school gates, all restraint evaporated. Mandatory evening study prep was abandoned as boys turned the dormitory into an unauthorized carnival. Senior boarders plugged illegal electric coils into wall sockets, frying eggs and seasoned sausages that filled the room with sizzling aromas. Hidden Bluetooth speakers boomed with pulsating Afrobeats, while boys stood on double-decker iron beds, dancing and tossing laundry baskets across the aisles.\n\nBy midnight, the revelry had peaked into chaotic pandemonium. Pillows burst open in ferocious feuds, filling the air with a swirling blizzard of white feathers. Suddenly, a pair of bright automotive headlights swept through the frosted glass louvres, casting long, ominous shadows against the wall. The booming music was abruptly cut. The heavy timber door swung inward with a slow, agonizing creak.\n\nFramed in the doorway, illuminated by the porch light, stood Mr. Mensah! His conference had ended early, and he had taken an evening flight back. For three frozen seconds, sixty boys stood like stone statues, clutching burst pillows and half-eaten bread in paralyzed terror. The silence was deafening. Looking at our punishment—clearing three acres of elephant grass under the scorching Saturday sun—we learned the bitter truth of human nature: truly, when the cat is away, the mice will play.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 52. Descriptive: A Journey to Boti Falls and the Umbrella Rock

  {

    id: "B8_S4_E_I_T_02",

    section: "theory",

    questionNumber: 52,

    theoryIndex: 2,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Descriptive Essay",

    title: "Wonders of the Yilo Krobo Mountains",

    shortSummary: "Write a descriptive essay capturing the sensory sights, physical climb, and cascade thunder of Boti Falls.",

    prompt: "Your school organized an excursion to the twin Boti Falls and the geological marvel known as Umbrella Rock in the Eastern Region. Write a descriptive essay recreating the steep forest trail, the awe-inspiring balanced rock formation, the thundering twin waterfalls, and the refreshing mist of the forest pool.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Spatial Geological Progression, Sensory Waterfall Imagery & Mountainous Atmosphere",

    learningCompetency: "B8.4.2.2.1: Write descriptive compositions recreating natural landscapes through spatial elevation, tactile and auditory registers, and evocative aesthetic reflection.",

    hint: "Use spatial progression: ascending the rocky mountain ridge to Umbrella Rock, descending the two hundred and fifty stone steps to Boti Falls, and plunging into the spray of the twin cascades.",

    guidanceScaffold: {

      genreType: "descriptive_travelogue",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "Majesty at Boti Falls and Umbrella Rock",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Spatial and sensory progression from the high mountain ridge of Umbrella Rock down into the rocky gorge of Boti Falls.",

        stagePrompts: [

          { stageIndex: 1, role: "Ascent to Umbrella Rock", guidingQuestion: "Describe hiking up the steep, sunlit sandstone ridge in Yilo Krobo to view the giant balanced rock formation.", transitionHints: ["Perched high upon the rugged sandstone ridges of Yilo Krobo...", "The steep ascent left our legs trembling, but emerging onto the windswept plateau, the geological marvel took our breath away..."] },

          { stageIndex: 2, role: "The Panorama from the Summit", guidingQuestion: "Describe the massive rock overhang shaped like an umbrella and the panoramic view of the forest valley below.", transitionHints: ["The colossal mushroom-shaped granite overhang balanced precariously on a narrow pedestal...", "Looking outward, an endless green blanket of cocoa and oil palm valleys stretched toward the blue horizon..."] },

          { stageIndex: 3, role: "Descent into the Boti Gorge", guidingQuestion: "Depict descending the 250 mossy stone steps, feeling the air cool down, and hearing the roar of the twin falls.", transitionHints: ["Leaving the ridge, we descended two hundred and fifty damp, moss-covered stone steps into the deep river gorge...", "The scorching sun vanished beneath towering mahogany trees, while a thunderous roar vibrated through the earth..."] },

          { stageIndex: 4, role: "The Twin Cascades & Sensory Immersion", guidingQuestion: "Describe the male and female waterfalls plummeting into the rainbow-lit pool and the icy spray on your skin.", transitionHints: ["Rounding the mossy boulders, the twin cascades burst into view in all their thundering splendor...", "Sheets of white water crashed into the emerald plunge pool, coating our faces with icy mist as sunlight refracted into mini rainbows..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Aesthetic Reflection",

        proverbOrClosingPhrase: "Nature sculpts monuments grander than human hands can build.",

        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating Ghana's breathtaking natural geography."

      }

    },

    rubric: createWAECRubric(

      ["Sandstone mountain setting and Umbrella Rock hike established (2 marks)", "Sensory depictions of balanced rock, gorge descent, and cooling air (4 marks)", "Twin waterfalls plunge, rainbow mist, and aesthetic reflection conveyed (4 marks)"],

      ["Mountain setting vivid", "Sensory cues (touch, sight, sound) rich", "Spatial progression clear"],

      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],

      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],

      ["Rich geological and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],

      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]

    ),

    modelAnswer: `Majesty at Boti Falls and Umbrella Rock\n________________________________________\n\nPerched high upon the rugged sandstone ridges of the Yilo Krobo district in the Eastern Region lies one of Ghana's most astonishing natural treasures. Our school excursion bus deposited us at the foot of the mountainous trail on a bright, breezy morning, where the earthy scent of red clay and wild eucalyptus leaves invigorated our senses for the demanding climb ahead.\n\nOur journey commenced with an arduous hike up the sun-baked ridge to visit the renowned Umbrella Rock. Emerging onto the wind-swept plateau, we stood in sheer disbelief before the colossal geological marvel. A massive, flat-topped granite slab, spanning roughly twenty meters across, balanced with uncanny perfection on a remarkably slender stone pivot, looking like a gigantic mushroom sculpted by titans. Seeking shelter beneath its enormous shadow, we gazed out across the edge. Below rolled an uninterrupted, undulating sea of emerald cocoa valleys and distant blue hills that made us feel on top of the world.\n\nLeaving the sunlit plateau, we began our descent into the deep river gorge to see Boti Falls, carefully negotiating two hundred and fifty steep, moss-carpeted stone steps. With every descending step, the blistering heat dissipated, replaced by a cool, moist breeze. Towering bamboo groves leaned inward like cathedral arches, filtering the sunlight into dancing jade shadows. The gentle gurgle of a forest brook was soon swallowed by a thunderous, rhythmic roar that vibrated through our chest bones.\n\nAt the base of the gorge, the spectacle of the twin waterfalls burst upon us with breathtaking majesty. Two separate torrents—revered by locals as the male and female falls—plunged thirty meters over a sheer sandstone precipice, crashing into a frothing emerald pool below. The collision whipped up a perpetual, swirling cloud of icy spray that coated our skin with cool droplets, refracting the morning sunbeams into dazzling, iridescent rainbows across the rocks. Submerged in that thundering roar, I stood spellbound by the untamed power and beauty of our homeland.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 53. Article for Publication: The Menace of Indiscriminate Sand Winning

  {

    id: "B8_S4_E_I_T_03",

    section: "theory",

    questionNumber: 53,

    theoryIndex: 3,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Article for Publication",

    title: "Halt the Devastation of Coastal Sand Winning",

    shortSummary: "Write an article for publication in a national daily on the destructive effects of illegal beach sand mining.",

    prompt: "Write an article for publication in a national daily newspaper titled: 'The Ecological Menace of Coastal Sand Winning in Ghana.' Analyze how heavy tipper trucks excavating beach sand trigger rapid coastal erosion, threaten coastal basic schools and fishing landing sites, and propose two statutory regulatory interventions to halt the destruction.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Journalistic Article Architecture, Coastal Ecological Analysis & Regulatory Enforcement Proposals",

    learningCompetency: "B8.4.2.1.2: Compose structured articles for publication analyzing marine environmental degradation, infrastructure vulnerability, and statutory environmental policing.",

    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, ecological fallout, threat to schools, and enforcement solutions.",

    guidanceScaffold: {

      genreType: "article_publication",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "full_caps_no_underline",

        modelHeadline: "THE ECOLOGICAL MENACE OF COASTAL SAND WINNING IN GHANA",

        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]

      },

      bylineGuide: {

        isRequired: true,

        modelByline: "By Daniel Osei-Owusu, Basic 8B",

        rules: ["Position directly beneath the headline.", "State author name and class stream."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Stripping Coastal Dunes -> Destruction of Schools & Fishing Livelihoods -> Statutory Taskforces).",

        stagePrompts: [

          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and describe fleets of heavy tipper trucks plundering Ghana's beaches under the cover of darkness.", transitionHints: ["Under the shadowy cover of midnight along Ghana's historic coastline...", "Fleets of heavy commercial tipper trucks and mechanical backhoes are ruthlessly excavating thousands of tons of beach sand..."] },

          { stageIndex: 2, role: "Erosion & Destruction of Sea Defense Dunes", guidingQuestion: "Analyze how stripping natural sand dunes allows high oceanic tidal surges to march twenty meters inland.", transitionHints: ["The ecological consequences of this unchecked plunder are catastrophic...", "Beach sand dunes serve as nature's primeval sea defense barriers; when they are stripped away, powerful ocean surges..."] },

          { stageIndex: 3, role: "Threats to Schools & Artisanal Fishing", guidingQuestion: "Explain how collapsing shorelines undermine coastal school buildings and destroy traditional canoe landing sites.", transitionHints: ["The human and economic toll on coastal communities is heartbreaking...", "In towns like Gomoa Fetteh and Keta, basic school classrooms sit barely ten meters from crashing waves, while fishermen lose..."] },

          { stageIndex: 4, role: "Statutory Enforcement & Call to Action", guidingQuestion: "Propose two actionable solutions (joint military-police road checkpoints and impounding tipper trucks) and conclude with a patriotic appeal.", transitionHints: ["To preserve our coastline from total submersion, the state must act with iron resolve...", "First, municipal assemblies must establish joint police-military checkpoints to impound all sand trucks, while the EPA..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Peroration & Environmental Call",

        proverbOrClosingPhrase: "The sea will reclaim whatever land human greed exposes to its fury.",

        integrationRule: "End with an inspiring appeal urging state agencies and citizens to protect the marine coastline."

      }

    },

    rubric: createWAECRubric(

      ["Lead hook and coastal sand winning crisis established (2 marks)", "Dune destruction, tidal erosion, and school/fishing impacts analyzed (4 marks)", "Two actionable regulatory enforcement solutions and peroration presented (4 marks)"],

      ["Lead hook clear", "Ecological fallout detailed", "Actionable solutions proposed"],

      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],

      ["Headline correct", "Byline present", "Zero letter format contamination"],

      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental vocabulary (3 marks)"],

      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]

    ),

    modelAnswer: `THE ECOLOGICAL MENACE OF COASTAL SAND WINNING IN GHANA\nBy Daniel Osei-Owusu, Basic 8B\n\nUnder the shadowy cover of midnight along Ghana's historic five-hundred-kilometer coastline, a silent ecological crime of catastrophic proportions is taking place. Fleets of heavy commercial tipper trucks and roaring mechanical excavators invade sandy beaches, scooping up thousands of tons of sea sand to feed the booming, insatiable urban real estate construction industry. What builders celebrate as cheap mortar aggregate is costing coastal communities their very survival.\n\nThe ecological fallout of this reckless plunder is devastating. Natural beach sand dunes and coconut groves act as primeval shock absorbers, dissipating the violent kinetic energy of Atlantic tidal surges before they reach human settlements. When contractors strip away these sandy buffers, the shoreline collapses. In communities like Gomoa Fetteh, Ada, and Keta, ocean tides have marched over twenty meters inland within a few seasons, eroding roads, toppling coconut plantations, and salinating freshwater wells.\n\nThe human cost is tragic. In several coastal fishing villages, public basic schools built decades ago safely away from the shore now stand precariously on the edge of eroding cliffs, their concrete foundations undermined by crashing waves during high tides. Frightened teachers are forced to evacuate classrooms whenever sea surges roar. Furthermore, the destruction of wide, sandy beaches has wiped out artisanal canoe landing sites, smashing wooden canoes against exposed rocks and crippling the livelihoods of thousands of fishing families.\n\nTo halt this environmental catastrophe, the state must take uncompromising action. The Environmental Protection Agency (EPA), in collaboration with the Ghana Police Service, must mount permanent, round-the-clock road checkpoints on all access corridors leading from beaches, impounding any tipper truck caught hauling beach sand and revoking the driver's license. Furthermore, municipal assemblies must pass strict zoning laws and heavily penalize building contractors who purchase illegal sea sand. The ocean will reclaim whatever land human greed exposes to its fury; we must defend our shores before our coastal towns are washed into the sea.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 54. Debate: Social Media in Education (Supporting Social Media)

  {

    id: "B8_S4_E_I_T_04",

    section: "theory",

    questionNumber: 54,

    theoryIndex: 4,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Debate Speech",

    title: "Social Media Enhances Student Learning",

    shortSummary: "Speak in support of the motion that social media platforms are valuable tools for modern student education.",

    prompt: "You are the lead speaker in an inter-schools debate competition on the motion: 'Social Media Platforms Have Done More to Promote Student Learning Than to Harm It.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding peer academic collaboration and access to global educational resources, while refuting opposing claims on distraction.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",

    learningCompetency: "B8.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",

    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on virtual study syndicates and educational content channels. Conclude with 'Thank you.'",

    guidanceScaffold: {

      genreType: "debate_speech",

      vocativeProtocol: {

        isRequired: true,

        hierarchyOrder: [

          "1. Mr. Chairman (or Madam Chairperson)",

          "2. Distinguished Panel of Adjudicators",

          "3. Accurate Timekeeper",

          "4. Worthy Opponents",

          "5. Ladies and Gentlemen"

        ],

        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that Social Media platforms have done far more to promote student learning than to harm it.",

        prohibitedOpenings: ["Good morning to you all", "I am standing here to speak"]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Real-Time Peer Collaboration -> Global Micro-Learning Content -> Rebuttal & Peroration).",

        stagePrompts: [

          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with unyielding conviction today to defend the motion which asserts that..."] },

          { stageIndex: 2, role: "First Argument: Real-Time Academic Collaboration", guidingQuestion: "Explain how platforms like WhatsApp, Telegram, and YouTube enable student study groups to share notes and solve math problems after hours.", transitionHints: ["First and foremost, social media has dismantled the physical walls of the classroom...", "Through moderated WhatsApp and Telegram academic groups, candidates share lecture notes, solve complex geometry problems, and..."] },

          { stageIndex: 3, role: "Second Argument: Access to Global Educational Content", guidingQuestion: "Show how video tutorials and educational influencers explain science and literature concepts simply and freely.", transitionHints: ["Secondly, social media has democratized elite global education through bite-sized micro-learning...", "Platforms like YouTube and educational channels host thousands of free visual tutorials in chemistry, coding, and history that..."] },

          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on cyberbullying and distractions, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will surely complain about digital addiction and cyberbullying; however, this narrow view collapses because...", "With these undeniable truths, I urge you all to vote resoundingly in favor of the motion. Thank you."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Peroration & Final Sign-Off",

        proverbOrClosingPhrase: "Technology is a double-edged sword; in disciplined hands, it carves a path to brilliance.",

        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"

      }

    },

    rubric: createWAECRubric(

      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Peer collaborative study groups argument developed cogently (4 marks)", "Global educational multimedia access and opponent refutation delivered effectively (4 marks)"],

      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],

      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],

      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],

      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],

      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]

    ),

    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Social Media Platforms Have Done More to Promote Student Learning Than to Harm It.\"\n\nFirst and foremost, social media has demolished the rigid physical boundaries of the traditional classroom, creating a dynamic ecosystem of real-time peer collaboration. Long after school gates close at 3:00 p.m., learning continues uninterrupted. Through moderated academic WhatsApp, Telegram, and Discord syndicates, basic school candidates across different regions share handwritten study notes, solve difficult past WAEC mathematics questions, and debate literary themes. A student struggling with quadratic equations in a remote village can post a snapshot of the problem and receive step-by-step video explanations from peers in Kumasi or Accra within minutes! Can a static textbook deliver such instant, collaborative assistance? Incontestably not!\n\nSecondly, social media has democratized world-class visual education through digital micro-learning. Channels on YouTube, TikTok, and educational Facebook groups host millions of free, animated lessons created by expert educators. Complex scientific processes that students find difficult to visualize in flat textbooks—such as photosynthesis, cellular mitosis, and electromagnetic induction—are animated in vivid color. A student can watch an MIT professor explain robotics or a Ghanaian language specialist break down Akan proverbs for free on their smartphone. Social media transforms passive learners into curious, independent researchers.\n\nMy worthy opponents will complain loudly about screen addiction, cyberbullying, and distractions. However, their argument confuses the medium with the user! Does a carpenter throw away his hammer simply because it can smash a finger if mishandled? With basic parental guidance, digital literacy education, and self-discipline, social media becomes an indispensable educational asset, not a detriment.\n\nMr. Chairman, social media is the digital highway of 21st-century knowledge. Let us not fear the highway; let us teach our students how to drive on it. I urge you all to vote resoundingly in favor of the motion.\n\nThank you.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 55. Narrative: Illustrating 'Birds of a Feather Flock Together'

  {

    id: "B8_S4_E_I_T_05",

    section: "theory",

    questionNumber: 55,

    theoryIndex: 5,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Narrative Essay",

    title: "The Dangerous Gang at the Corner",

    shortSummary: "Write a narrative story illustrating the proverb: 'Birds of a feather flock together.'",

    prompt: "Write a story that illustrates the truth of the proverb: 'Birds of a feather flock together.' Narrate how an initially well-behaved student was gradually influenced by a gang of truants and gamblers, resulting in his arrest and suspension during a police raid on an illegal gaming parlor.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Peer Pressure Narrative Arc, Gradual Character Corruption & Organic Proverb Integration",

    learningCompetency: "B8.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through negative peer influence, escalating indiscipline, and police raid resolution.",

    hint: "Establish the student's initial discipline. Show the gradual enticement into a truant gang, the police raid on the gaming shop, and the bitter moral realization in the police station.",

    guidanceScaffold: {

      genreType: "narrative_proverbial",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "Caught in the Wrong Circle",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Narrative plot arc tracing honest student baseline, peer pressure compromise, police raid climax, and moral awakening.",

        stagePrompts: [

          { stageIndex: 1, role: "Exposition & Baseline Discipline", guidingQuestion: "Introduce fourteen-year-old Kwame, a quiet, well-behaved student who transferred to a new urban school in Kumasi.", transitionHints: ["Fourteen-year-old Kwame had always been the pride of his family in Kumasi...", "Gentle, studious, and punctual, he consistently earned top academic marks until he met a clique of smooth-talking classmates..."] },

          { stageIndex: 2, role: "Inciting Incident & Peer Enticement", guidingQuestion: "Describe Kwame being lured into skipping afternoon prep by a clique of truants who frequented a secret sports betting hub.", transitionHints: ["The subtle trap opened when Kofi and his gang invited him to an internet gaming lounge after school...", "\"Do not be an antisocial coward,\" they teased, gradually convincing him to skip afternoon prep and gamble lunch coins..."] },

          { stageIndex: 3, role: "Rising Action & The Police Raid Climax", guidingQuestion: "Narrate the afternoon Kwame was inside the dark betting shop when armed police officers raided the illegal parlor.", transitionHints: ["Before long, Kwame was skipping morning classes altogether, wearing unbuttoned shirts and smoking roll-ups with the gang...", "Suddenly, the metal doors of the dimly lit betting shop were kicked open with a thunderous crash as armed police commandos stormed inside..."] },

          { stageIndex: 4, role: "Denouement, Arrest & Proverbial Realization", guidingQuestion: "Describe standing in the police cell in handcuffs, his mother's tears, and his realization of the proverb.", transitionHints: ["Clapped in heavy steel handcuffs alongside the notorious gang members, Kwame's desperate cries of innocence were dismissed...", "Seeing his weeping mother at the police station counter, he learned the bitter truth: birds of a feather flock together..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Moral Synthesis",

        proverbOrClosingPhrase: "Birds of a feather flock together.",

        integrationRule: "Embed the proverb organically into Kwame's reflection inside the juvenile detention cell."

      }

    },

    rubric: createWAECRubric(

      ["Disciplined character baseline established (2 marks)", "Gradual peer enticement and truancy depicted vividly (4 marks)", "Police raid climax, arrest, and organic proverb integration (4 marks)"],

      ["Character context clear", "Peer corruption shown", "Proverb integrated organically"],

      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],

      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],

      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and dramatic adjectives (3 marks)"],

      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]

    ),

    modelAnswer: `Caught in the Wrong Circle\n___________________________\n\nFourteen-year-old Kwame had always been the pride of his family in Kumasi. Gentle, soft-spoken, and diligent, he had maintained an immaculate conduct record throughout Basic 7, earning the respect of his teachers. However, upon entering Basic 8, a desperate craving for popularity among the school's 'cool crowd' paved the way for his downfall.\n\nThe trap opened innocently enough. A clique of charismatic, swaggering boys led by a notorious truant named Rex began inviting Kwame to hang out behind the sports pavilion during break. Initially, Kwame was uncomfortable with their coarse language and sneering defiance of teachers, but their flattery was intoxicating. \"A handsome, smart boy like you shouldn't waste his youth reading dusty textbooks all day,\" Rex laughed, draping an arm around his shoulder. Within weeks, Kwame was imitating their rolled-up sleeves, sneaking out of school before afternoon roll-call, and loitering around commercial betting shops.\n\nThe catastrophe struck on a humid Thursday afternoon. Instead of sitting in the science laboratory for an end-of-term practical test, Kwame allowed Rex to drag him to a secret, unlicensed sports gambling parlor in an unventilated basement. Surrounded by older criminals, Kwame was clutching a betting slip when a deafening crash shook the room. The iron doors were kicked inward off their hinges! Armed police officers from the regional anti-vice squad swarmed the room, shouting: \"Nobody move! Hands above your heads!\"\n\nPanic erupted, but there was no escape. Clapped in cold steel handcuffs, Kwame wept hysterically, protesting: \"I am an innocent student! I only came with them!\" An officer snapped coldly: \"You are sitting with criminals, you are dressed like criminals, and you will be treated as one!\" Standing behind the cold iron bars of the juvenile police station, watching his heartbroken mother collapse in tears across the counter, Kwame understood the brutal reality of his choices. Truly, birds of a feather flock together.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 56. Descriptive: The Electric Atmosphere of an Inter-Schools Drama Festival

  {

    id: "B8_S4_E_I_T_06",

    section: "theory",

    questionNumber: 56,

    theoryIndex: 6,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Descriptive Essay",

    title: "Magic on the Theater Stage",

    shortSummary: "Write a descriptive essay recreating the theatrical sights, sounds, and drama of an inter-schools theater contest.",

    prompt: "Your school drama troupe performed in the regional junior secondary drama festival. Write a descriptive essay recreating the packed auditorium, the dramatic lighting and painted backdrops, the powerful theatrical performance of the lead actors, and the audience's emotional standing ovation.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Theatrical Sensory Description, Auditory Crescendo & Stage Pacing",

    learningCompetency: "B8.4.2.2.1: Write descriptive compositions recreating performing arts events through theatrical vocabulary, lighting imagery, and auditory emotional crescendo.",

    hint: "Use spatial progression: the darkened, packed auditorium, the spotlight illuminating the stage backdrop, the actors' emotional confrontation, and the deafening standing ovation as the curtain falls.",

    guidanceScaffold: {

      genreType: "descriptive_travelogue",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "A Night of Theatrical Brilliance",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Spatial and sensory progression from the darkened auditorium to the stage performance and standing ovation.",

        stagePrompts: [

          { stageIndex: 1, role: "The Expectant Auditorium", guidingQuestion: "Describe the packed, hushed auditorium as the house lights dim and the velvet stage curtains part.", transitionHints: ["Inside the cavernous auditorium of the Centre for National Culture...", "A suffocating hush descended over the sea of eight hundred spectators as the house lights dimmed into velvety darkness..."] },

          { stageIndex: 2, role: "Stage Lighting & Visual Splendor", guidingQuestion: "Depict the theatrical spotlights, painted village backdrop, and authentic traditional costumes of the actors.", transitionHints: ["A brilliant beam of amber spotlight sliced through the gloom, illuminating an ornate village square on stage...", "Draped in authentic raffia skirts and white chalk body paint, the actors commanded the boards with majestic presence..."] },

          { stageIndex: 3, role: "The Dramatic Conflict (Auditory & Emotional)", guidingQuestion: "Capture the rising emotional dialogue, the crack of thunder sound effects, and the audience holding their breath.", transitionHints: ["The acoustic intensity peaked as the protagonist confronted the corrupt village elder...", "Her voice soared with heartbreaking grief and fury, resonating off the high wooden rafters while ominous drum beats..."] },

          { stageIndex: 4, role: "The Curtains Fall & The Standing Ovation", guidingQuestion: "Describe the final dramatic freeze-frame, the sudden darkness, and the explosion of applause as the cast bows.", transitionHints: ["As the final tragic line echoed, the spotlight snapped off into total darkness...", "For two breathtaking heartbeats, complete silence hung over the theater—then a thunderous standing ovation exploded..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Theatrical Synthesis",

        proverbOrClosingPhrase: "Drama is the mirror through which society confronts its own soul.",

        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating drama as a mirror of truth."

      }

    },

    rubric: createWAECRubric(

      ["Auditorium anticipation and stage setting established (2 marks)", "Spotlight visual aesthetics and traditional costume regalia depicted vividly (4 marks)", "Emotional dialogue, sound effects, and thunderous ovation conveyed (4 marks)"],

      ["Theater setting vivid", "Sensory cues (sound, light, emotion) rich", "Stage atmosphere captured"],

      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],

      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],

      ["Rich theatrical and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],

      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]

    ),

    modelAnswer: `A Night of Theatrical Brilliance\n___________________________________\n\nInside the cavernous auditorium of the Centre for National Culture in Kumasi, an expectant, suffocating hush descended over eight hundred spectators. The house lights dimmed gradually into velvety darkness, silencing the eager murmurs of students, teachers, and adjudication panels. From behind the heavy crimson velvet curtains rose the faint, haunting wail of an indigenous bamboo flute, signaling the commencement of our school's championship performance.\n\nWith a slow, dramatic hiss, the curtains parted. A dazzling shaft of blue and amber stage spotlight sliced through the darkness, illuminating a meticulously hand-painted backdrop of an ancient Ghanaian forest village. Draped in authentic handwoven raffia skirts, animal pelts, and intricate geometric body patterns traced in white clay, our student actors inhabited the stage with commanding gravitas. The air grew thick with the aromatic smoke of smoldering resin incense, transporting the entire audience two centuries backward in time.\n\nThe emotional crescendo of the play was mesmerizing. Playing the lead role of a courageous queen mother defending her people against an invading warlord, fourteen-year-old Abigail delivered a performance of astonishing maturity. Her voice trembled with righteous fury, soaring above the menacing, low rumble of the stage thunder effects and the sharp clatter of wooden war swords. When she delivered her climactic monologue on ancestral loyalty, her tears glistened under the bright quartz stage lamps, and several audience members gasped audibly, wiping away tears.\n\nAs the final tragic words echoed off the timber rafters, the spotlight snapped off into absolute darkness. For two breathless heartbeats, complete silence gripped the hall—then an explosive roar of thunderous applause tore through the theater! House lights blazed on as hundreds of spectators leaped to their feet in a roaring standing ovation, celebrating the transformative magic of live theater.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 57. Article for Publication: The Toll of Road Accidents on National Development

  {

    id: "B8_S4_E_I_T_07",

    section: "theory",

    questionNumber: 57,

    theoryIndex: 7,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Article for Publication",

    title: "Curbing the Carnage on Ghanaian Highways",

    shortSummary: "Write an article for publication in a national newspaper on human error causing vehicular accidents and highway safety reforms.",

    prompt: "Write an article for publication in a national daily newspaper titled: 'The Carnage on Our Roads: Causes, Consequences, and Remedies.' Examine how reckless speeding, drunk driving, and poorly maintained vehicles cause road carnage, analyze the economic and human loss to the nation, and propose two strict regulatory solutions involving police technology and vehicle roadworthiness.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Journalistic Article Architecture, Traffic Forensic Analysis & Regulatory Transport Proposals",

    learningCompetency: "B8.4.2.1.2: Compose structured articles for publication analyzing road transport casualties, socio-economic losses, and statutory highway enforcement.",

    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, root causes, national losses, and enforcement solutions.",

    guidanceScaffold: {

      genreType: "article_publication",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "full_caps_no_underline",

        modelHeadline: "THE CARNAGE ON OUR ROADS: CAUSES, CONSEQUENCES, AND REMEDIES",

        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]

      },

      bylineGuide: {

        isRequired: true,

        modelByline: "By Selorm Bawa, Basic 8B",

        rules: ["Position directly beneath the headline.", "State author name and class stream."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Human Behavioral Causes -> Economic & Humanitarian Fallout -> Rigorous Technological Enforcement).",

        stagePrompts: [

          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and cite alarming annual casualty figures on Ghanaian highways.", transitionHints: ["Every single day on Ghana's major highways, precious human lives are snuffed out in violent crashes...", "According to official reports from the National Road Safety Authority, over two thousand souls perish annually in avoidable crashes..."] },

          { stageIndex: 2, role: "Human Error & Vehicular Neglect", guidingQuestion: "Analyze reckless overtaking, drunk driving, driver fatigue, and decrepit unroadworthy commercial vehicles.", transitionHints: ["The root causes of this endless bloodshed point squarely toward human recklessness...", "Drivers treat highways as racecourses, engaging in blind overtaking on blind hills while fatigued commercial operators..."] },

          { stageIndex: 3, role: "Economic & Humanitarian Toll", guidingQuestion: "Explain how accidents kill breadwinners, orphan young children, and cost the nation billions in medical care.", transitionHints: ["The consequences of this vehicular carnage tear through the fabric of our society...", "Breadwinners are killed in their prime, leaving impoverished widows and traumatized orphans, while public hospitals are overwhelmed with..."] },

          { stageIndex: 4, role: "Technological Enforcement & Call to Action", guidingQuestion: "Propose two actionable solutions (automated highway speed cameras and strict digital vehicle testing) with a call to national discipline.", transitionHints: ["To halt this highway slaughter, the state must implement uncompromising reforms...", "The Motor Transport and Traffic Department must install automated radar speed cameras along highways, while the Driver and Vehicle Licensing Authority..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Peroration & Civic Appeal",

        proverbOrClosingPhrase: "Better to arrive late in this life than early in the next.",

        integrationRule: "End with an inspiring appeal urging drivers, passengers, and regulators to prioritize road safety."

      }

    },

    rubric: createWAECRubric(

      ["Lead hook and road carnage casualty data established (2 marks)", "Human error, vehicle neglect, and socio-economic devastation analyzed (4 marks)", "Two actionable technological enforcement solutions and peroration presented (4 marks)"],

      ["Lead hook clear", "Causes and consequences detailed", "Actionable solutions proposed"],

      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],

      ["Headline correct", "Byline present", "Zero letter format contamination"],

      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive transport and regulatory vocabulary (3 marks)"],

      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]

    ),

    modelAnswer: `THE CARNAGE ON OUR ROADS: CAUSES, CONSEQUENCES, AND REMEDIES\nBy Selorm Bawa, Basic 8B\n\nEvery single day on Ghana's highways, vibrant human lives are violently extinguished in preventable vehicular crashes. According to distressing data published by the National Road Safety Authority, over two thousand citizens perish annually, with thousands more maimed for life. Our highways—intended to serve as arteries of economic commerce and national integration—have become slaughterhouses bathed in human blood.\n\nThe root causes of this carnage are driven by human indiscipline and institutional laxity. Reckless overtaking on blind curves, speeding far above legal limits, driving under the influence of alcohol, and chronic driver fatigue account for over eighty percent of crashes. Commercial minibus and heavy haulage drivers routinely pilot their vehicles for sixteen continuous hours without sleep, turning their steering wheels into lethal weapons. This behavioral indiscipline is compounded by decrepit, unroadworthy vehicles operating with bald tires, defective brakes, and blinding headlights.\n\nThe consequences on national development are catastrophic. Highway fatalities claim economic breadwinners in the prime of their productive lives, plunging families into destitution and swelling the ranks of orphaned school dropouts. Furthermore, treating severe orthopedic injuries and trauma patients places an unbearable financial burden on our national health insurance scheme, costing the nation over two billion cedis in lost productivity and healthcare expenditures annually.\n\nTo end this highway butchery, we must deploy uncompromising regulatory technology. The Motor Transport and Traffic Directorate (MTTD) must install automated digital speed-enforcement radar cameras along accident-prone corridors like the Accra-Kumasi highway, issuing automatic electronic fines directly to vehicle owners. In addition, the Driver and Vehicle Licensing Authority (DVLA) must abolish corrupt manual inspections and mandate rigorous electronic brake-and-wheel diagnostic testing for all commercial passenger vehicles. Road safety is a shared civic responsibility; it is far better to arrive late in this life than early in the next.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 58. Debate: Free Healthcare vs. Free Education (Supporting Free Education)

  {

    id: "B8_S4_E_I_T_08",

    section: "theory",

    questionNumber: 58,

    theoryIndex: 8,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Debate Speech",

    title: "Free Education Is More Essential Than Free Healthcare",

    shortSummary: "Speak in support of the motion that a developing country should prioritize free education over free healthcare.",

    prompt: "You are the principal speaker in an inter-schools debate competition on the motion: 'A Developing Country Should Prioritize Free Quality Education Over Free Healthcare.' Write your debate speech in support of the motion, delivering at least two convincing arguments demonstrating that education trains doctors and cures poverty, while refuting opposing claims.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",

    learningCompetency: "B8.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",

    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments showing that education produces medical professionals and eradicates disease through knowledge. Conclude with 'Thank you.'",

    guidanceScaffold: {

      genreType: "debate_speech",

      vocativeProtocol: {

        isRequired: true,

        hierarchyOrder: [

          "1. Mr. Chairman (or Madam Chairperson)",

          "2. Distinguished Panel of Adjudicators",

          "3. Accurate Timekeeper",

          "4. Worthy Opponents",

          "5. Ladies and Gentlemen"

        ],

        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that a developing country must prioritize free quality education over free healthcare.",

        prohibitedOpenings: ["Good morning to you all", "I am standing here to talk"]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Education Trains Medical Personnel -> Preventative Health & Poverty Eradication -> Rebuttal & Peroration).",

        stagePrompts: [

          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with resolute intellectual passion today to defend the motion which asserts that..."] },

          { stageIndex: 2, role: "First Argument: Education Trains Healthcare Professionals", guidingQuestion: "Explain that free healthcare is impossible without educated doctors, nurses, pharmacists, and medical engineers.", transitionHints: ["First and foremost, who operates hospitals, invents vaccines, and dispenses medication?...", "Free healthcare is a hollow fantasy if a nation lacks trained medical personnel to administer it; it is quality education that..."] },

          { stageIndex: 3, role: "Second Argument: Preventative Health & Poverty Eradication", guidingQuestion: "Demonstrate that an educated populace practices sanitation, nutrition, and prevents disease before needing hospitals.", transitionHints: ["Secondly, education provides the ultimate preventative cure for societal disease...", "Educated citizens understand personal hygiene, water purification, and balanced nutrition, eliminating eighty percent of..."] },

          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims that 'health is wealth,' deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will surely shout the popular proverb that 'health is wealth'; however, this claim collapses because...", "With these unassailable truths, I urge you all to vote resoundingly in favor of the motion. Thank you."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Peroration & Final Sign-Off",

        proverbOrClosingPhrase: "Education is the mother of all professions and the primary cure for poverty.",

        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"

      }

    },

    rubric: createWAECRubric(

      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Education producing medical professionals argument developed cogently (4 marks)", "Preventative health/poverty eradication and opponent refutation delivered effectively (4 marks)"],

      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],

      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],

      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],

      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],

      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]

    ),

    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"A Developing Country Should Prioritize Free Quality Education Over Free Healthcare.\"\n\nFirst and foremost, education is the foundational mother of all human professions, including medicine. How can a developing nation operate free healthcare without trained human resources? A hospital building filled with free medicines is useless without qualified surgeons, pharmacologists, midwives, and biomedical engineers to diagnose illnesses and prescribe treatments. It is quality education that trains the medical doctor, builds diagnostic technologies, and synthesizes pharmaceuticals. If a nation prioritizes healthcare while neglecting education, who will staff the clinics? Will we import foreign doctors while our own citizens remain illiterate? Incontestably not! Education creates the medical capacity that makes healthcare possible.\n\nSecondly, education provides the ultimate preventative cure for diseases and national poverty. Medical studies consistently reveal that over seventy percent of illnesses in developing countries—cholera, malaria, dysentery, and infant malnutrition—are entirely preventable through basic hygiene and public education. An educated mother knows how to boil drinking water, prepare balanced meals, and observe sanitation, protecting her children from sickness long before they ever need a hospital bed. Furthermore, education lifts entire families out of poverty by equipping youth with high-income skills, enabling them to afford their own medical care independently.\n\nMy worthy opponents will parrot the age-old proverb that 'health is wealth.' While health is important, an uneducated healthy person remains trapped in poverty, ignorance, and vulnerability. A nation of healthy, illiterate citizens cannot build roads, manage banks, or govern democracies.\n\nMr. Chairman, free healthcare treats the symptoms of underdevelopment, but free education cures the disease. I urge this entire house to vote resoundingly in favor of the motion.\n\nThank you.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 59. Narrative: A Treacherous Forest Encounter with a Puff Adder

  {

    id: "B8_S4_E_I_T_09",

    section: "theory",

    questionNumber: 59,

    theoryIndex: 9,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Narrative Essay",

    title: "The Slumbering Viper",

    shortSummary: "Write a narrative story recounting a heart-stopping encounter with a venomous viper during firewood foraging.",

    prompt: "While gathering firewood in a thick forest with your younger sibling, you narrowly avoided stepping on a deadly, camouflaged puff adder. Write a narrative essay recounting the quiet afternoon in the bush, the sudden heart-stopping discovery of the venomous snake, the tense struggle to rescue your sibling, and the safe escape.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Suspenseful Pacing, Visceral Sensory Tension & Threat Resolution",

    learningCompetency: "B8.4.2.1.1: Compose suspenseful narrative stories depicting wildlife hazards, visceral physiological reactions, and heroic brotherly protection.",

    hint: "Start with the peaceful firewood foraging, describe the camouflaged viper hidden in dead leaves, the near-fatal step, the breathless freeze, and the quick-thinking rescue.",

    guidanceScaffold: {

      genreType: "narrative_proverbial",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "The Deadly Coil in the Leaves",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Narrative plot arc tracing peaceful foraging, sudden mortal danger, tense rescue, and safe escape.",

        stagePrompts: [

          { stageIndex: 1, role: "Exposition & Foraging Baseline", guidingQuestion: "Describe a quiet Saturday afternoon gathering dry firewood with your eight-year-old brother, Kojo, in the Atewa forest fringe.", transitionHints: ["On a golden Saturday afternoon, my eight-year-old brother Kojo and I walked into the Atewa forest fringe...", "Equipped with cutlasses and twine ropes, we gathered dry mahogany branches, laughing cheerfully under the cool canopy..."] },

          { stageIndex: 2, role: "Inciting Incident & Camouflaged Terror", guidingQuestion: "Describe Kojo stepping toward a large rotten log, completely unaware of a thick, camouflaged puff adder coiled on dead leaves.", transitionHints: ["Kojo bounded ahead, reaching toward a fallen log surrounded by dry, rustling leaves...", "Suddenly, my eyes caught a subtle geometric chevron pattern among the dead foliage—a colossal, venomous puff adder coiled just inches from his bare foot..."] },

          { stageIndex: 3, role: "Rising Action & Breathless Freeze", guidingQuestion: "Narrate the terrifying hiss, shouting at Kojo to freeze, and the snake raising its triangular head to strike.", transitionHints: ["\"Kojo, freeze! Don't move an inch!\" I screamed in a strangled whisper...", "A sinister, deep hiss escaped the snake's jaws as its flat, spade-shaped head drew back into an S-shaped strike posture..."] },

          { stageIndex: 4, role: "Climax, Rescue & Denouement", guidingQuestion: "Describe hurling a heavy branch to distract the serpent, yanking Kojo to safety, and fleeing the forest in tears of relief.", transitionHints: ["Thinking with frantic instinct, I hurled a heavy timber branch directly across the snake's tail...", "As the viper struck the wood with venomous fury, I lunged forward, grabbed Kojo by his collar, and yanked him backward onto the path..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Heroic Reflection",

        proverbOrClosingPhrase: "Vigilance is the shield that preserves life from hidden snares.",

        integrationRule: "Conclude with an emotional reflection celebrating alertness and brotherly protection."

      }

    },

    rubric: createWAECRubric(

      ["Foraging forest setting and baseline established (2 marks)", "Camouflaged viper discovery and terrifying freeze depicted vividly (4 marks)", "Heart-stopping rescue, safe escape, and emotional relief conveyed (4 marks)"],

      ["Forest setting established", "Snake threat vivid and suspenseful", "Rescue and relief clear"],

      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative perspective (1 mark)"],

      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],

      ["Dynamic action verbs and serpentine imagery (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and suspenseful adjectives (3 marks)"],

      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]

    ),

    modelAnswer: `The Deadly Coil in the Leaves\n_____________________________\n\nOn a humid Saturday afternoon, my eight-year-old brother, Kojo, and I ventured into the dense fringes of the Atewa forest reserve near our village. Our mother had instructed us to gather dry firewood for the evening cooking fire. Armed with a dull cutlass and strips of banana twine, we enjoyed the chore, chattering happily as we snapped fallen mahogany branches beneath the cool green canopy.\n\nDeep inside an overgrown clearing, Kojo spotted a thick, decaying log carpeted in dry brown leaves. \"Look, Brother, there is enough dry wood here to fill our basket!\" he chirped, bounding forward barefoot. Just as his right foot hovered inches above the ground, an instinctive chill surged down my spine. My gaze locked onto something sinister nestled among the dead foliage. What looked like dry twigs was the intricate, geometric chevron pattern of a massive, bloated puff adder, perfectly camouflaged in the leaves!\n\n\"Kojo, freeze! Do not breathe!\" I screamed in a choked, frantic whisper. Kojo froze mid-step, his foot trembling barely ten centimeters above the deadly coil. Disturbed by the vibration, the viper stirred. A terrifying, raspy hiss sounded from the undergrowth as the thick, heavy serpent drew its wide, spade-shaped triangular head backward into a deadly S-curve, ready to launch its venomous fangs.\n\nPanic threatened to paralyze me, but instinct took over. Gripping a heavy, two-meter branch with both hands, I hurled it forcefully across the snake's tail. Distracted by the impact, the adder struck the wood with explosive, blinding speed, spraying clear venom onto the bark. In that split second, I lunged forward, seized Kojo by the scruff of his shirt, and hauled him violently backward onto the cleared path. We sprinted out of the forest without looking back, our chests heaving, weeping in boundless gratitude for the vigilance that had saved his young life.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 60. Descriptive: The Visual and Auditory Splendor of a Durbar of Chiefs

  {

    id: "B8_S4_E_I_T_10",

    section: "theory",

    questionNumber: 60,

    theoryIndex: 10,

    type: "structured_essay",

    format: "structured_essay",

    level: "B8",

    difficulty: "intermediate",

    category: "Descriptive Essay",

    title: "A Golden Durbar Under the Sun",

    shortSummary: "Write a descriptive essay recreating the visual magnificence, musketry, and drumming of an Akwasidae durbar.",

    prompt: "You attended the grand Akwasidae festival durbar at the Manhyia Palace in Kumasi. Write a descriptive essay recreating the visual majesty of the Paramount Chief's kente regalia, the gleaming gold ornaments, the deafening roar of musketry, and the poetic rhythms of the fontomfrom drums.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Cultural Royalty Description, Auditory Regal Pacing & Spatial Grandeur",

    learningCompetency: "B8.4.2.2.1: Write descriptive compositions capturing traditional royal pageantry through rich sensory registers, regal vocabulary, and spatial progression.",

    hint: "Use spatial progression: the courtyard under giant state umbrellas, the arrival of royal courtiers, the King seated in state draped in gold and kente, and the reverberating climax of talking drums.",

    guidanceScaffold: {

      genreType: "descriptive_travelogue",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "Royal Pageantry at Manhyia Palace",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Spatial and sensory progression through an Akwasidae royal durbar from arrival to the royal throne.",

        stagePrompts: [

          { stageIndex: 1, role: "Courtyard Arrival", guidingQuestion: "Set the scene at the grand Manhyia Palace courtyard packed with dignitaries, diplomats, and traditional subjects.", transitionHints: ["Under the radiant morning sun, the sweeping palace grounds of Manhyia in Kumasi...", "A vast, dignified multitude of thousands assembled under gigantic velvet state umbrellas that swayed..."] },

          { stageIndex: 2, role: "The Retinue & Horn Blowers (Auditory & Visual)", guidingQuestion: "Describe the procession of executioners, sword-bearers with golden hilts, and the mournful calls of ivory horns.", transitionHints: ["The royal court entered in a breathtaking display of ancestral protocol...", "Sword-bearers brandished ancient gold-hilted execution swords that flashed in the sunlight, while elephant-tusk horn blowers..."] },

          { stageIndex: 3, role: "The King Seated in State (Regal Regalia)", guidingQuestion: "Depict the Asantehene seated on his carved stool, draped in luminous kente and weighed down by heavy gold ornaments.", transitionHints: ["At the center of the royal dais sat the King, a living embodiment of ancestral majesty...", "Draped in majestic gold and black kente cloth, his wrists and ankles were encircled by massive solid gold armlets..."] },

          { stageIndex: 4, role: "Fontomfrom Drumming & Reverent Climax", guidingQuestion: "Describe the deafening thunder of fontomfrom drums speaking ancient proverbs and reflect on national cultural pride.", transitionHints: ["The acoustic majesty reached its climax as the fontomfrom drums spoke in royal cadence...", "Watching the chiefs swear allegiance with raised swords, an overwhelming wave of pride in Ghanaian heritage swept over the assembly..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Cultural Reflection",

        proverbOrClosingPhrase: "The golden stool is the sacred soul of an undefeated people.",

        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating indigenous African sovereignty and heritage."

      }

    },

    rubric: createWAECRubric(

      ["Palace courtyard setting and regal atmosphere established (2 marks)", "Sword-bearers, ivory horns, and visual procession depicted vividly (4 marks)", "King's gold regalia, fontomfrom drumming, and cultural pride conveyed (4 marks)"],

      ["Palace setting vivid", "Sensory cues (gold, sound, regalia) rich", "Cultural grandeur captured"],

      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],

      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],

      ["Rich regal and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],

      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]

    ),

    modelAnswer: `Royal Pageantry at Manhyia Palace\n___________________________________\n\nUnder the radiant morning sun, the grand palace courtyard of Manhyia in Kumasi was transformed into a dazzling theater of African royalty for the sacred Akwasidae festival. A reverent multitude of thousands—diplomats, paramount chiefs, and citizens—assembled under an ocean of gigantic, scalloped state umbrellas that bobbed gently in the morning breeze. The air was rich with the scent of burning cedar incense and the musky fragrance of handwoven kente cloths.\n\nThe royal retinue entered in a magnificent display of centuries-old court protocol. First came the royal sword-bearers, their chests adorned with gold medallions as they brandished ancient ceremonial swords whose hilts were encased in polished pure gold. Beside them walked the royal heralds and praise singers, reciting the genealogical victories of the kingdom in resonant Twi. The piercing, mournful calls of elephant-tusk horns pierced the sky, sending shivers through the crowd as their melodies conversed with the rhythmic clinking of iron bells.\n\nAt the center of the royal pavilion sat the King in state, the living embodiment of ancestral sovereignty. Draped in yards of heavy, hand-stitched gold and black silk kente, his presence radiated majesty. Massive, solid gold bangles and armbands, carved with sacred adinkra symbols of wisdom and strength, encircled his forearms. A headband studded with gold stars crowned his brow, while his feet rested upon a velvet-lined stool to avoid touching the bare earth. Every movement of his hand sent flashes of golden light across the courtyard.\n\nThe acoustic power of the durbar peaked as the colossal fontomfrom drums erupted into action. The master drummers struck the cowhide surfaces with lightning precision, reciting epic poetry that stirred the soul of every listener. Intermittently, musketeers fired blank gunpowder into the air, shrouding the royal throne in romantic plumes of white smoke. Watching paramount chiefs swear eternal allegiance, I stood humbled by the enduring grandeur of Ghanaian cultural identity.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  }

];

// =========================================================================

// DEPLOYMENT ORCHESTRATION FUNCTION

// =========================================================================

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B8IntermediateClean() {
  console.log("Building clean 60-item Strand 4 B8 Intermediate Practice Lab...");
  console.log("   -> Topic: Essays, Articles for Publication & Debates");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective, Balanced Shuffled Options)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory, Flippable Prompts)");

  const db = await getFirestoreDb();
  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // Generate a balanced target position array: 13 'A' (0), 13 'B' (1), 12 'C' (2), 12 'D' (3) = 50 total
  const targetPositions: number[] = [];
  for (let i = 0; i < 13; i++) targetPositions.push(0);
  for (let i = 0; i < 13; i++) targetPositions.push(1);
  for (let i = 0; i < 12; i++) targetPositions.push(2);
  for (let i = 0; i < 12; i++) targetPositions.push(3);
  const shuffledTargetPositions = shuffleArray(targetPositions);

  // 1. Build Section A (Questions 1 to 50: Objective Multiple-Choice with Balanced Spread)
  rawObjective50Data.forEach((item, index) => {
    const qNum = index + 1;
    const targetPos = shuffledTargetPositions[index];
    const otherOptions = shuffleArray(item.options.filter(opt => opt !== item.answer));
    const finalOptions: string[] = [];
    let otherIdx = 0;
    for (let pos = 0; pos < 4; pos++) {
      if (pos === targetPos) {
        finalOptions.push(item.answer);
      } else {
        finalOptions.push(otherOptions[otherIdx++]);
      }
    }

    all60Items.push({
      id: `B8_S4_E_I_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B8",
      difficulty: "intermediate",
      category: "Composition & Rhetoric Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n"${item.passage}"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: item.answer, // Matches exact string value in finalOptions[targetPos]
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B8.4.2.1: Demonstrate intermediate mastery of narrative plot structures, sensory travelogue descriptions, article headline-byline rules, and parliamentary debate mechanics."
    });
  });

  // Verify option distribution
  const dist = { A: 0, B: 0, C: 0, D: 0 };
  all60Items.slice(0, 50).forEach(it => {
    const obj = it as ObjectiveQuestionItem;
    const idx = obj.options.indexOf(obj.correctAnswer);
    if (idx === 0) dist.A++;
    else if (idx === 1) dist.B++;
    else if (idx === 2) dist.C++;
    else if (idx === 3) dist.D++;
  });
  console.log(`   📊 Shuffled Option Distribution: A: ${dist.A}, B: ${dist.B}, C: ${dist.C}, D: ${dist.D}`);

  // 2. Build Section B (Questions 51 to 60: Theory Structured Essays)
  theory10Prompts.forEach((task) => {
    all60Items.push(task);
  });

  const docIds = ['writing_composition_essays_articles_debates', 'writing_essays_articles_debates'];
  const parentCollections = ['topical', 'topics', 'topical_units'];

  const labPayload = {
    level: "B8",
    difficulty: "intermediate",
    title: "Basic 8 Intermediate Writing Lab: 50 Objective Rhetoric Drills + 10 Theory Extended Compositions",
    totalItemsCount: all60Items.length,
    objectiveDrillsCount: 50,
    structuredEssaysCount: 10,
    sections: {
      objective: {
        startIndex: 0,
        endIndex: 49,
        count: 50,
        format: "multiple_choice"
      },
      theory: {
        startIndex: 50,
        endIndex: 59,
        count: 10,
        format: "structured_essay",
        allowsDirectTopicFlipping: true,
        topicList: theory10Prompts.map(t => ({
          questionNumber: t.questionNumber,
          theoryIndex: t.theoryIndex,
          id: t.id,
          title: t.title,
          category: t.category,
          shortSummary: t.shortSummary
        }))
      }
    },
    tasks: all60Items,
    questions: all60Items, // Dual-populating tasks and questions to prevent runner fallback
    metadata: {
      curriculum: "NaCCA Common Core Programme (CCP) Standard",
      strand: "Strand 4: Writing",
      subStrand: "Sub-Strand 2: Text Types and Purposes (Narrative, Descriptive, Articles & Debates)",
      evaluationEngine: "Gemini 2.5 Flash WAEC 4-Tier Evaluator (30 Marks)",
      canonicalTopicPath: "global_curriculum/jhs/subjects/english/topical/writing_composition_essays_articles_debates",
      updatedAt: new Date().toISOString()
    }
  };

  for (const docId of docIds) {
    // 3. Write directly to Firestore Practice Lab Document
    const targetDoc = db.doc(
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B8_intermediate`
    );
    await targetDoc.set(labPayload);
    console.log(`   ✅ Deployed Practice Lab: ${targetDoc.path}`);

    // 4. Synchronize into the main topical document practice pool (medium)
    for (const parentCol of parentCollections) {
      const mainTopicDoc = db.doc(
        `global_curriculum/jhs/subjects/english/${parentCol}/${docId}`
      );

      await mainTopicDoc.set({
        levels: {
          b8: {
            practicePool: {
              medium: all60Items.map(item => ({
                id: item.id,
                section: item.section,
                type: item.type,
                format: item.format,
                category: item.category,
                points: item.points
              }))
            }
          }
        }
      }, { merge: true });
      console.log(`   ✅ Synchronized Practice Pool: ${mainTopicDoc.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all60Items.length} items to B8 Intermediate Practice Labs!`);
}

deployStrand4B8IntermediateClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B8 Intermediate Clean 60 Lab:", err);
    process.exit(1);
  });

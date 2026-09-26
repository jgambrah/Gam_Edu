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
  level: "B7";
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
  level: "B7";
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
        "Consistent tense maintenance across narrative timeline",
        "Punctuation inside direct speech quotation marks",
        "Rigorous subject-verb concord and zero contraction slips in formal articles/debates"
      ]
    }
  }
});

// =========================================================================
// 50 UNIQUE OBJECTIVE COMPOSITION & RHETORIC DRILLS (QUESTIONS 1 TO 50)
// Basic 7 Intermediate Focus:
// Complex Narrative Pacing, Proverbial Synthesis, Spatial Framing,
// Journalistic Register, Inquit Tag Orthography, and Debate Rebuttal Architecture
// =========================================================================
const rawObjective50Data = [
  {
    passage: "A candidate writes a story illustrating the proverb: 'Make hay while the sun shines.'",
    question: "Which of the following plot setups most authentically captures the essence of this aphorism?",
    options: [
      "A student uses daylight vacation hours to prepare for academic trials rather than squandering time on video games",
      "A farmer gathers grass only after torrential rains have ruined the entire field",
      "A young girl refuses to go outside because the afternoon weather is too sunny",
      "A boy buys sunglasses to protect his eyes during an afternoon soccer match"
    ],
    answer: "A student uses daylight vacation hours to prepare for academic trials rather than squandering time on video games",
    hint: "The proverb emphasizes taking advantage of favorable opportunities before they disappear.",
    solution: "The proverb 'Make hay while the sun shines' urges timely action during favorable conditions. A narrative contrasting diligent vacation study with neglected time demonstrates its core moral meaning.",
    target: "Proverbial Interpretation & Narrative Conception"
  },
  {
    passage: "Examine this narrative sentence: 'As soon as the bell rang, the pupils rush out, but the teacher ordered them back.'",
    question: "What grammatical defect disrupts the narrative flow in this sentence?",
    options: [
      "Tense instability: slipping into the present tense 'rush' within a past narrative context",
      "Faulty passive voice construction",
      "Misplacement of the subordinate clause",
      "Lack of an adverbial modifier"
    ],
    answer: "Tense instability: slipping into the present tense 'rush' within a past narrative context",
    hint: "The sentence starts and ends in the past, but the middle verb is present.",
    solution: "Past narrative discourse requires consistent aspect. Shifting from 'rang' to 'rush' before returning to 'ordered' is a tense instability error penalized under Mechanical Accuracy.",
    target: "Narrative Craft: Tense Consistency"
  },
  {
    passage: "In an article written for the *Daily Graphic*, where should the byline appear?",
    question: "Select the most appropriate journalistic positioning for the byline:",
    options: [
      "Directly beneath the headline or centered at the end of the text",
      "In the top right corner accompanied by a full postal address",
      "In the middle of the second paragraph as a parenthetical note",
      "Within the concluding moral sentence only"
    ],
    answer: "Directly beneath the headline or centered at the end of the text",
    hint: "Bylines announce authorship immediately following the title or at the close.",
    solution: "A byline (e.g., 'By Francis Appiah, Basic 7') belongs immediately beneath the headline or appended at the very end of the article, without postal addresses.",
    target: "Articles for Publication: Byline Positioning"
  },
  {
    passage: "A speaker in a debate on environmental protection addresses the assembly.",
    question: "Which of the following sequences follows the strict descending Parliamentary Vocative Protocol?",
    options: [
      "Mr. Chairman, Panel of Adjudicators, Timekeeper, Co-Debaters, Ladies and Gentlemen",
      "Ladies and Gentlemen, Co-Debaters, Timekeeper, Adjudicators, Mr. Chairman",
      "Panel of Adjudicators, Mr. Chairman, Co-Debaters, Timekeeper, Audience",
      "Co-Debaters, Mr. Chairman, Accurate Timekeeper, Ladies and Gentlemen"
    ],
    answer: "Mr. Chairman, Panel of Adjudicators, Timekeeper, Co-Debaters, Ladies and Gentlemen",
    hint: "The presiding officer is addressed first, followed by judges, timekeeper, opponents, and audience.",
    solution: "The descending parliamentary hierarchy is strictly ordered: (1) Chairman, (2) Adjudicators, (3) Timekeeper, (4) Co-Debaters, and (5) Audience.",
    target: "Debate Speech: Vocative Protocol Hierarchy"
  },
  {
    passage: "Examine this dialogue construction: '\"Where are you going?\" asked Mother. \"To the library,\" replied Kofi.'",
    question: "Why is this dialogue formatted correctly on the page?",
    options: [
      "Every change of speaker begins on a new indented line with punctuation inside the quotes",
      "Both sentences use exclamation marks to indicate loud speech",
      "The reporting tags are written in capital letters",
      "Quotation marks are placed around the inquit verbs"
    ],
    answer: "Every change of speaker begins on a new indented line with punctuation inside the quotes",
    hint: "A new speaker requires a new paragraph line, and terminal marks sit inside the quotes.",
    solution: "Standard dialogue mechanics mandate that each speaker's utterance starts on a fresh indented line, with punctuation marks contained within the quotation boundaries.",
    target: "Dialogue Formatting: Speaker Boundaries"
  },
  {
    passage: "A candidate writes: 'The thunderous roar of the waterfall drowned the gentle chirping of crickets.'",
    question: "Which sensory register is primarily appealed to in this sentence?",
    options: [
      "Auditory register",
      "Olfactory register",
      "Gustatory register",
      "Tactile register"
    ],
    answer: "Auditory register",
    hint: "'Roar' and 'chirping' are sound cues perceived through the ears.",
    solution: "The terms 'thunderous roar' and 'gentle chirping' engage the sense of hearing, representing auditory sensory imagery.",
    target: "Descriptive Writing: Auditory Register"
  },
  {
    passage: "A candidate writes an article headline in Title Case: <u>The role of discipline In school Success</u>.",
    question: "What capitalization error is present in this headline?",
    options: [
      "The noun 'role' should be capitalized and the preposition 'In' should be lowercase",
      "All words should be written in capital letters",
      "The word 'Success' should be lowercase",
      "The article 'The' should be lowercase"
    ],
    answer: "The noun 'role' should be capitalized and the preposition 'In' should be lowercase",
    hint: "Nouns must be capitalized in Title Case, while short prepositions remain lowercase.",
    solution: "In Title Case, lexical words such as the noun 'Role' require capital initial letters, while short grammatical prepositions like 'in' must remain lowercase: 'The Role of Discipline in School Success'.",
    target: "Headline Typography: Title Case Preposition Mechanics"
  },
  {
    passage: "What is the primary function of the 'rising action' in Freytag's plot pyramid?",
    question: "Identify the narrative role of the rising action:",
    options: [
      "To escalate dramatic tension through a series of complications and obstacles",
      "To introduce the names and birthplaces of the characters",
      "To wrap up the story and deliver the moral lesson",
      "To describe the weather on the morning after the crisis"
    ],
    answer: "To escalate dramatic tension through a series of complications and obstacles",
    hint: "It builds conflict and suspense between the inciting incident and the climax.",
    solution: "The rising action presents complications, obstacles, and secondary conflicts that build tension, propelling the protagonist toward the inevitable climax.",
    target: "Freytag's Pyramid: Rising Action Dynamics"
  },
  {
    passage: "In an argumentative essay, what is the rhetorical purpose of the 'thesis statement'?",
    question: "Define the thesis statement in argumentative prose:",
    options: [
      "A concise sentence articulating the author's primary stance and scope of argument",
      "A dictionary definition of the key words in the essay prompt",
      "A polite greeting enquiring about the reader's health",
      "A summary of all opposing opinions"
    ],
    answer: "A concise sentence articulating the author's primary stance and scope of argument",
    hint: "It states the main argument that the entire composition defends.",
    solution: "The thesis statement anchors the essay, clearly stating the author's definitive claim and providing the logical roadmap for subsequent paragraphs.",
    target: "Argumentative Discourse: Thesis Articulation"
  },
  {
    passage: "A speaker in a debate states: 'My worthy opponent argued that day schools lack discipline; however, this claim is contradicted by regional examination records.'",
    question: "What debate component is being executed in this sentence?",
    options: [
      "A direct forensic rebuttal",
      "The parliamentary vocative opening",
      "An ad hominem personal insult",
      "A dramatic narrative exposition"
    ],
    answer: "A direct forensic rebuttal",
    hint: "The speaker cites an opponent's claim and directly refutes it with evidence.",
    solution: "A rebuttal identifies a premise asserted by an opponent and directly refutes it using factual or logical counter-evidence.",
    target: "Debate Speech: Forensic Rebuttal Mechanics"
  },
  {
    passage: "A descriptive essay follows a traveler walking from the noisy market, through the village square, and up the quiet mountain path.",
    question: "What structural method of organization is being employed here?",
    options: [
      "Spatial journey progression",
      "Alphabetical listing",
      "Random chronological jumping",
      "Statistical grouping"
    ],
    answer: "Spatial journey progression",
    hint: "The description follows the physical path of the traveler through space.",
    solution: "Spatial journey progression arranges descriptive details in a logical geographic sequence as the observer moves through physical terrain.",
    target: "Descriptive Writing: Spatial Progression"
  },
  {
    passage: "A student writes: '\"Help me!\" the drowning boy shouted, \"I cannot swim!\"'",
    question: "What punctuation error occurs in this dialogue sentence?",
    options: [
      "The comma after 'shouted' should be a full stop because 'Help me!' and 'I cannot swim!' are separate complete sentences",
      "The exclamation mark should be placed outside the quotation marks",
      "The word 'shouted' should be capitalized",
      "Quotation marks should be omitted from the second sentence"
    ],
    answer: "The comma after 'shouted' should be a full stop because 'Help me!' and 'I cannot swim!' are separate complete sentences",
    hint: "Both spoken parts are independent exclamations, so a comma creates a run-on.",
    solution: "Because 'Help me!' and 'I cannot swim!' are distinct complete utterances, the reporting tag must terminate with a period: '\"Help me!\" shouted the drowning boy. \"I cannot swim!\"'.",
    target: "Dialogue Mechanics: Sentence Boundary Punctuation"
  },
  {
    passage: "Why must an article intended for publication NEVER include the phrase 'Yours faithfully,' at the end?",
    question: "State the governing layout rule:",
    options: [
      "Valedictions belong strictly to epistolary correspondence, and their inclusion in articles is penalized as format contamination",
      "Because the editor does not know the writer's name",
      "Because articles must only conclude with poems",
      "Because 'faithfully' is only used in informal notes"
    ],
    answer: "Valedictions belong strictly to epistolary correspondence, and their inclusion in articles is penalized as format contamination",
    hint: "Letter closings do not belong in public print media.",
    solution: "Articles are public expository essays, not private letters. Appending epistolary subscriptions ('Yours faithfully,') is format contamination, penalized under Organization.",
    target: "Articles for Publication: Format Purity"
  },
  {
    passage: "In a narrative, the moment when the hidden truth is discovered and the protagonist makes an irreversible decision is called:",
    question: "Identify this plot point:",
    options: [
      "The climax",
      "The exposition",
      "The resolution",
      "The preliminary background"
    ],
    answer: "The climax",
    hint: "It is the peak turning point of dramatic tension.",
    solution: "The climax is the highest point of conflict and emotional intensity, representing the decisive turning point of the dramatic action.",
    target: "Freytag's Pyramid: Climax Identification"
  },
  {
    passage: "Which of the following phrases appeals to the olfactory and gustatory registers simultaneously?",
    question: "Select the sentence engaging smell and taste:",
    options: [
      "The mouth-watering aroma of spiced ginger and roasted groundnuts made his stomach growl",
      "The blinding glare of the midday sun scorched the white sand",
      "The icy spray of mountain water chilled his trembling fingers",
      "The distant clang of church bells echoed across the silent valley"
    ],
    answer: "The mouth-watering aroma of spiced ginger and roasted groundnuts made his stomach growl",
    hint: "'Aroma' appeals to smell, while 'mouth-watering' and 'spiced ginger' evoke taste.",
    solution: "'Mouth-watering aroma of spiced ginger' activates both olfactory (smell) and gustatory (taste) associations.",
    target: "Descriptive Writing: Dual Sensory Imagery"
  },
  {
    passage: "In an argumentative composition, how should a counter-argument be addressed?",
    question: "Select the most effective dialectical approach:",
    options: [
      "State the counter-argument fairly, then dismantle it using logical reasoning and empirical evidence",
      "Pretend the counter-argument does not exist to avoid confusing the reader",
      "Insult the intelligence of anyone who holds the opposing view",
      "Agree with the counter-argument and change your thesis halfway through"
    ],
    answer: "State the counter-argument fairly, then dismantle it using logical reasoning and empirical evidence",
    hint: "Acknowledge the opposing claim honestly before refuting it.",
    solution: "Mature argumentative discourse presents the opposing view objectively (concession) before systematically demonstrating its factual or logical flaws (refutation).",
    target: "Argumentative Logic: Dialectical Refutation"
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
  }
];

// =========================================================================
// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)
// Basic 7 Intermediate Scaffolds & Model Compositions (~250 words each)
// Covering: Narrative Moral Stories, Sensory Travelogues, Articles & Debates
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Narrative: Illustrating 'Make Hay While the Sun Shines'
  {
    id: "B7_S4_E_I_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Narrative Essay",
    title: "The Squandered Vacation",
    shortSummary: "Write a narrative story illustrating the proverb: 'Make hay while the sun shines.'",
    prompt: "Write a story that illustrates the proverb: 'Make hay while the sun shines.' Narrate how two students spent their long school vacation—one studying diligently for upcoming scholarship examinations, and the other squandering time on social media and video games—and describe the contrasting outcomes when school resumed.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Contrast, Character Arc Development & Organic Proverb Integration",
    learningCompetency: "B7.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through contrasting character choices, dramatic plot resolution, and moral synthesis.",
    hint: "Establish the two characters early. Show the contrast between disciplined preparation and lazy indulgence during the vacation, building to the decisive examination day.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Harvest of Diligence",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Contrasting narrative character arc tracing vacation choices, examination climax, and moral realization.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Baseline", guidingQuestion: "Introduce classmates Kofi and Kwesi as the two-month school vacation begins with an upcoming scholarship exam announced.", transitionHints: ["When the final school bell sounded for the long vacation in Bekwai...", "Two inseparable classmates, Kofi and Kwesi, faced the two-month holiday with starkly different attitudes..."] },
          { stageIndex: 2, role: "Rising Action & Contrasting Choices", guidingQuestion: "Contrast Kofi's disciplined morning library routine with Kwesi's addiction to video games and television.", transitionHints: ["While Kofi rose at dawn to review past science papers and read novels in the community library...", "Kwesi spent his days glued to video-game consoles and scrolling through social media feeds..."] },
          { stageIndex: 3, role: "The Examination Climax", guidingQuestion: "Describe the first day of the scholarship examination, Kofi's calm mastery, and Kwesi's panic.", transitionHints: ["When school resumed and the scholarship examination papers were unsealed...", "Kwesi stared at the complex algebra equations with rising dread, his mind completely blank..."] },
          { stageIndex: 4, role: "Denouement & Proverbial Realization", guidingQuestion: "Describe the scholarship announcement and Kwesi's bitter realization of the proverb.", transitionHints: ["On Monday morning assembly, Kofi was awarded the prestigious scholarship plaque...", "Sitting among the crowd in regret, Kwesi finally understood: make hay while the sun shines..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Resolution & Moral Aphorism",
        proverbOrClosingPhrase: "Make hay while the sun shines.",
        integrationRule: "Weave the proverb organically into Kwesi's final realization during the award ceremony."
      }
    },
    rubric: createWAECRubric(
      ["Character contrast and scholarship context established (2 marks)", "Detailed portrayal of vacation habits and examination day drama (4 marks)", "Contrasting outcomes and organic proverb integration (4 marks)"],
      ["Character contrast clear", "Examination drama shown vividly", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Natural transitions between contrasting scenes (1 mark)", "Consistent narrative pacing (1 mark)", "Unified third-person voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Pacing consistent"],
      ["Vivid narrative action verbs (4 marks)", "Consistent past tense aspect (3 marks)", "Rich descriptive and psychological vocabulary (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Harvest of Diligence\n________________________\n\nWhen the final school bell signaled the start of the two-month long vacation in Bekwai, our Headmaster announced that a prestigious secondary school scholarship examination would be conducted on the first day of the new term. Two inseparable classmates, Kofi and Kwesi, received the news with starkly contrasting attitudes.\n\nKofi resolved to seize every moment of the holiday. Each morning, after completing his household chores, he walked to the district library to study mathematics textbooks, summarize science chapters, and solve past questions. When his peers invited him to roam the streets, he declined politely. Kwesi, on the other hand, treated the vacation as an endless carnival of pleasure. He spent long afternoons in noisy gaming parlors, played football until dusk, and scrolled through video clips late into the night. \"Vacation is for resting, not studying,\" he boasted whenever Kofi urged him to revise.\n\nThe day of reckoning arrived when the examination papers were distributed. Kofi read through the questions with calm confidence, his pen gliding across the answer booklet as he tackled algebraic equations and botanical diagrams he had thoroughly practiced. Two desks away, Kwesi sat in cold terror. His mind was an absolute blank. Complex physics formulas danced mockingly before his eyes, and he chewed his pen in agonizing frustration, unable to complete even half the questions.\n\nTwo weeks later, during morning assembly, the Headmaster presented Kofi with the coveted scholarship award amid thunderous cheers. Watching from the back row in bitter shame, Kwesi learned the hardest lesson of his youth: opportunity must be seized when it presents itself. Truly, one must make hay while the sun shines.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Descriptive: A Journey on Lake Volta by Ferry
  {
    id: "B7_S4_E_I_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Descriptive Essay",
    title: "Voyage Across Lake Volta",
    shortSummary: "Write a descriptive travelogue capturing the sensory experience of a ferry journey across Lake Volta.",
    prompt: "Write a descriptive essay about a voyage across Lake Volta aboard a commercial ferry boat. Describe the crowded port at dawn, the vast expanse of blue water, the submerged tree stumps, the cool breeze, and the dramatic sunset over the distant hills.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Spatial Journey Progression, Multi-Sensory Waterway Imagery & Atmospheric Tone",
    learningCompetency: "B7.4.2.2.1: Write descriptive essays recreating geographic voyages using spatial progression, rich sensory registers, and figurative descriptions.",
    hint: "Follow a chronological and spatial journey: the bustling Akosombo jetty at dawn, boarding the ferry, sailing across the open water with its submerged tree branches, and the golden evening arrival.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "A Voyage Across Lake Volta",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory journey from lake port departure to open-water crossing and sunset arrival.",
        stagePrompts: [
          { stageIndex: 1, role: "Dawn Departure at the Jetty", guidingQuestion: "Describe the bustling, misty morning scene at the Akosombo ferry dock.", transitionHints: ["As the pale amber light of dawn broke over the Akosombo gorge...", "The ferry terminal was a hive of chaotic motion, echoing with the calls of boatmen and market women..."] },
          { stageIndex: 2, role: "Leaving the Shore (Sensory Immersion)", guidingQuestion: "Describe the powerful throb of the diesel engine, foaming white wake, and cooling lake breeze.", transitionHints: ["With a deep, resonant blast of its horn, the massive vessel pulled away from the concrete pier...", "The diesel engines throbbed rhythmically beneath our feet, churning the calm dark water into..."] },
          { stageIndex: 3, role: "Open Water Vistas & Submerged Forests", guidingQuestion: "Depict the vast expanse of water, craggy distant hills, and dark silhouettes of drowned trees.", transitionHints: ["Out on the open lake, the world expanded into an endless sheet of blue...", "Skeletal branches of drowned hardwood trees poked through the water like ancient statues..."] },
          { stageIndex: 4, role: "Sunset Arrival & Aesthetic Reflection", guidingQuestion: "Describe the sunset painting the lake in crimson gold and the gentle arrival at the far shore.", transitionHints: ["As evening descended, the setting sun dissolved into brilliant streaks of crimson and amber...", "Gliding into the harbor under the cool evening breeze, I marvelled at the serene grandeur of Ghana's waters..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Aesthetic Synthesis",
        proverbOrClosingPhrase: "Water is the tranquil mirror of nature's majesty.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating Ghana's aquatic landscape."
      }
    },
    rubric: createWAECRubric(
      ["Port setting and dawn departure established (2 marks)", "Sensory depictions of ferry motion, breeze, and drowned trees (4 marks)", "Sunset vistas and reflective arrival captured vividly (4 marks)"],
      ["Journey progression clear", "Sight, sound, and touch evoked", "Atmosphere serene and rich"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial progression (1 mark)", "Smooth transitional markers (1 mark)", "Consistent descriptive focus (1 mark)", "Unified travelogue perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Spatial progression clear"],
      ["Rich sensory and figurative vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence patterns"]
    ),
    modelAnswer: `A Voyage Across Lake Volta\n___________________________\n\nAs the pale amber glow of dawn crept over the steep hills of Akosombo, the ferry jetty was already a hive of bustling activity. The cool morning air carried the sharp scent of damp freshwater, mingled with the aroma of smoking herrings and diesel fumes. Hundreds of market women carrying woven baskets of produce jostled alongside barrow-pushers, while cargo trucks edged cautiously onto the lower deck of the *Yapei Queen*.\n\nWith a deep, vibrating blast of its horn that echoed against the surrounding cliffs, the massive steel vessel detached from the pier. The powerful diesel engines throbbed rhythmically beneath the iron deck, sending gentle tremors through the soles of our shoes. Churning propellers whipped the calm green water into a foaming white wake that stretched far behind us like an unraveling ribbon of lace. A fresh, brisk breeze swept across the upper deck, instantly wiping away the sticky heat of the morning.\n\nOut on the open lake, the horizon expanded into a breathtaking sheet of shimmering blue. In every direction, emerald mountains rose steeply from the water's edge, their reflection mirrored on the surface. Occasionally, the dark, weathered branches of drowned hardwood trees emerged through the waves like the skeletal fingers of ancient river gods, warning our captain to navigate with care. Flocks of white egrets skimmed the surface, diving gracefully to snatch silver fingerlings.\n\nBy late afternoon, the fiery orb of the sun sank toward the western ridges, dissolving the sky into brilliant streaks of gold and lavender. The lake turned into liquid bronze under the fading light. As the ferry glided gently toward the distant harbor lights of Kpando Torkor, a deep peace descended over the passengers, leaving us in quiet awe of Ghana's magnificent inland sea.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Article for Publication: Promoting Reading Habits Among Junior High Pupils
  {
    id: "B7_S4_E_I_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Article for Publication",
    title: "Reviving the Culture of Reading",
    shortSummary: "Write an article for publication in your school magazine on cultivating reading habits among students.",
    prompt: "Write an article for publication in your school magazine titled: 'Cultivating a Passion for Reading Among Junior High School Students.' Discuss the decline of reading habits due to screen distractions, explain the academic benefits of reading literature, and propose two practical strategies schools and parents can implement to revive reading.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Analytical Exposition & Educational Policy Proposals",
    learningCompetency: "B7.4.2.1.2: Compose structured articles for publication analyzing reading habits, vocabulary development, and school library policies.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into problem analysis, benefits, and practical remedies.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "CULTIVATING A PASSION FOR READING AMONG JUNIOR HIGH SCHOOL STUDENTS",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Abigail Ofori, Basic 7A",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> The Digital Distraction Crisis -> Cognitive Benefits -> Strategic Interventions).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and announce the alarming decline in student reading habits.", transitionHints: ["It is often stated that readers are leaders, yet a glance across modern classrooms...", "Regrettably, the golden culture of reading for pleasure is rapidly vanishing among..."] },
          { stageIndex: 2, role: "The Screen Distraction Crisis", guidingQuestion: "Analyze how mobile phone games, social media, and television have displaced book reading.", transitionHints: ["The root of this literary decline is the pervasive addiction to digital screens...", "Adolescents now spend three to four hours daily scrolling through short video clips and playing mobile games..."] },
          { stageIndex: 3, role: "Cognitive & Academic Benefits", guidingQuestion: "Explain how reading literature sharpens vocabulary, improves essay writing, and stimulates imagination.", transitionHints: ["The academic benefits of consistent reading are incontrovertible...", "Immersion in good literature expands vocabulary, sharpens grammatical intuition, and fosters..."] },
          { stageIndex: 4, role: "Practical Interventions & Call to Action", guidingQuestion: "Propose two actionable solutions (mandatory school reading periods and parent-guided book corners) and conclude with an inspiring appeal.", transitionHints: ["To reverse this worrying trend, collaborative interventions are required...", "Schools should institute a mandatory thirty-minute silent reading period, while parents..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Call to Literacy",
        proverbOrClosingPhrase: "A book is a magical vessel that transports the mind across oceans and centuries.",
        integrationRule: "End with an inspiring appeal urging youth to embrace the power of the written word."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and reading culture crisis established (2 marks)", "Digital screen distractions and cognitive benefits analyzed (4 marks)", "Two actionable solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Benefits and challenges detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive analytical vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `CULTIVATING A PASSION FOR READING AMONG JUNIOR HIGH SCHOOL STUDENTS\nBy Abigail Ofori, Basic 7A\n\nIt is an enduring truth that readers are leaders, yet a glance across modern basic school classrooms reveals an alarming cultural shift. The cherished habit of opening a storybook and immersing oneself in the world of imaginative prose is rapidly vanishing, replaced by an unhealthy obsession with digital screens and fleeting entertainment.\n\nThe causes of this literary decline are evident in our homes and neighborhoods. Many junior high pupils spend hours every evening mesmerized by television soap operas, video-game consoles, and smartphone social media feeds. The rapid dopamine rush delivered by flashing digital screens has conditioned adolescent minds to reject the quiet, reflective patience required to finish a novel. Consequently, library shelves in many schools gather dust, while pupils struggle to comprehend basic reading comprehension passages in terminal examinations.\n\nYet, the intellectual benefits of regular reading are irreplaceable. Frequent interaction with well-written literature expands a student's vocabulary, instills an intuitive grasp of grammatical concord, and enriches narrative expression. Students who read widely express ideas with clarity, construct sophisticated sentences, and perform exceptionally well in WAEC continuous writing papers. Beyond academic scores, reading develops empathy, allowing young minds to understand diverse human cultures and experiences.\n\nTo revive our reading culture, schools must institute a mandatory thirty-minute 'Drop Everything and Read' (DEAR) session on their weekly timetables, supported by well-stocked classroom book corners. Furthermore, parents must model the habit by setting aside daily screen-free reading hours at home. A book is a magical vessel that transports the mind across oceans and centuries; let us empower our children to open its pages and lead the future.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Debate: Science vs. Arts in National Development (Supporting Science)
  {
    id: "B7_S4_E_I_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Debate Speech",
    title: "Science and Technology Are Superior to Arts for National Development",
    shortSummary: "Speak in support of the motion that science education contributes more to national development than arts education.",
    prompt: "You are the principal speaker in an inter-schools debate competition on the motion: 'Science and Technology Education Contributes More to National Development Than the Arts.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding healthcare and industrialization, while refuting opposing viewpoints.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B7.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on life-saving medicine and agricultural/industrial mechanization. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that Science and Technology Education contributes far more to national development than the Arts.",
        prohibitedOpenings: ["Good morning to you all", "I am standing here to talk"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Healthcare & Disease Eradication -> Industrialization & Food Security -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with resolute conviction today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Medical Breakthroughs & Public Health", guidingQuestion: "Explain how scientific medicine, vaccines, and surgical technologies sustain human life.", transitionHints: ["First and foremost, human life is the fundamental prerequisite for any nation's progress...", "Without the discoveries of medical science—antibiotics, surgical ventilators, and childhood vaccines—nations would be wiped out by..."] },
          { stageIndex: 3, role: "Second Argument: Industrialization & Agricultural Mechanization", guidingQuestion: "Explain how engineering, electrical grids, and mechanized farming drive economic growth.", transitionHints: ["Secondly, national economic prosperity is propelled by engineering and technology...", "Can poetic stanzas construct hydroelectric dams or can theatrical plays fabricate tractors to cultivate vast farmlands? Incontestably not!..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on cultural preservation, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will argue passionately that the arts preserve cultural heritage; however, this claim collapses because...", "With these unassailable points, I urge you all to vote for the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Science is the engine of human survival and modern civilization.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Healthcare and medical preservation argument developed cogently (4 marks)", "Industrialization/mechanization evidence and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Science and Technology Education Contributes More to National Development Than the Arts.\"\n\nFirst and foremost, human life is the foundational cornerstone of every civilized society. Without physical health and disease eradication, no nation can boast of an active workforce. It is scientific research that invented antibiotics, eradicated smallpox, and engineered life-saving neonatal incubators. When infectious epidemics threaten our towns, we do not summon poets to recite sonnets; we deploy laboratory scientists, epidemiologists, and doctors to develop vaccines. Science protects and prolongs human existence, providing the living canvas upon which all other human endeavors rest.\n\nSecondly, modern national development is driven by technological industrialization and agricultural mechanization. Ghana cannot achieve economic transformation by relying on hand hoes and manual cutlasses. It is agricultural engineering that manufactures solar-powered irrigation pumps and motorized combine harvesters, ensuring food security for our millions. It is civil and electrical engineering that builds asphalt highways, bridges, and hydroelectric power dams like Akosombo. Can creative writing generate electrical power to run factory machines? Incontestably not!\n\nMy worthy opponents have argued passionately that the arts cultivate cultural values, music, and moral identity. While I appreciate the beauty of drama and sculpture, aesthetic pleasure cannot feed a starving population or cure tuberculosis. Cultural dance troupes can only perform when the community is healthy, fed, and sheltered by scientific infrastructure.\n\nMr. Chairman, the arts decorate the room of civilization, but science and technology build the walls and foundation. I urge this entire house to vote resoundingly for the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Narrative: Illustrating 'Honesty Is the Best Policy'
  {
    id: "B7_S4_E_I_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Narrative Essay",
    title: "The Lost Leather Wallet",
    shortSummary: "Write a narrative story illustrating the proverb: 'Honesty is the best policy.'",
    prompt: "Write a story that illustrates the proverb: 'Honesty is the best policy.' Describe how a poor student found a large sum of money on the school compound, resisted the temptation to keep it, and was unexpectedly rewarded for his truthfulness.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Moral Dilemma Pacing, Character Integrity Arc & Organic Proverb Integration",
    learningCompetency: "B7.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through internal moral conflicts, dramatic resolution, and ethical synthesis.",
    hint: "Show the protagonist's financial struggles early on. Describe finding the lost money, the internal temptation, the decision to return it, and the surprising reward that validates the proverb.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Reward of Truth",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing financial struggle, moral dilemma, ethical choice, and reward.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Struggle", guidingQuestion: "Introduce Kofi, a needy pupil whose mother was struggling to pay his examination registration fee.", transitionHints: ["In the bustling peri-urban town of Kpone, fourteen-year-old Kofi lived with his widowed mother...", "Times were hard, and the deadline to pay his final examination registration fee was barely forty-eight hours away..."] },
          { stageIndex: 2, role: "Inciting Incident & Moral Conflict", guidingQuestion: "Describe Kofi discovering a fat leather wallet containing bundles of banknotes on the library steps.", transitionHints: ["While sweeping the concrete steps of the administration block during afternoon duty...", "His broom brushed against a heavy brown leather wallet stuffed with crisp five-hundred-cedi banknotes..."] },
          { stageIndex: 3, role: "Rising Action & The Ethical Choice", guidingQuestion: "Depict the internal battle between keeping the cash and handing it to the Headmaster.", transitionHints: ["A voice in his head whispered that this was the answer to his family's prayers...", "Yet, remembering his mother's solemn counsel that stolen wealth brings a curse, he walked straight to..."] },
          { stageIndex: 4, role: "Climax, Reward & Denouement", guidingQuestion: "Describe returning the money to a grateful visiting university lecturer, who sponsors his education.", transitionHints: ["Inside the office, the distraught visiting lecturer could scarcely believe his eyes...", "Overwhelmed by Kofi's integrity, the gentleman paid his full examination fees and offered a full scholarship, proving: honesty is the best policy..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Moral Synthesis",
        proverbOrClosingPhrase: "Honesty is the best policy.",
        integrationRule: "Embed the proverb into the narrator's reflection on the unexpected reward."
      }
    },
    rubric: createWAECRubric(
      ["Protagonist's poverty and examination fee deadline established (2 marks)", "Finding the wallet and the internal moral conflict depicted vividly (4 marks)", "Ethical surrender, generous reward, and organic proverb integration (4 marks)"],
      ["Character dilemma clear", "Temptation depicted vividly", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Reward of Truth\n___________________\n\nFourteen-year-old Kofi lived in a humble mud-brick cottage with his widowed mother in Kpone. His mother worked long, exhausting hours frying plantain chips by the roadside, but her modest earnings could barely cover their daily meals. With the registration deadline for his end-of-term examinations looming barely forty-eight hours away, Kofi walked to school with a heavy heart, knowing that an unpaid fee meant exclusion from the exams.\n\nDuring afternoon sanitation duty, while sweeping the concrete veranda of the administration block, Kofi's broom brushed against a thick, heavy leather wallet half-hidden beneath an ornamental potted palm. Kneeling down, he opened the zipper. His breath caught in his throat. Inside lay a thick bundle of crisp, purple banknotes—thousands of cedis—along with bank cards and an official national identification card belonging to a visiting university lecturer.\n\nA deceitful voice in his head whispered tempting thoughts: \"Take the money, pay your examination fees, buy new shoes, and leave the wallet.\" For two agonizing minutes, his hands trembled as he stared at the fortune. But the moral voice of his mother echoed in his conscience: \"A good name is better than ill-gotten riches.\" Resolutely, Kofi clutched the wallet, marched up the administration stairs, and knocked on the Headmaster's door.\n\nInside the office sat Professor Mensah, the guest speaker for the upcoming speech day, looking distraught and pale. When Kofi placed the intact wallet onto the desk, the professor leaped from his chair in disbelief, tears welling in his eyes. The wallet contained his entire research grant and travel passport! Overwhelmed by Kofi's rare integrity, Professor Mensah not only paid his examination fees on the spot, but pledged to finance his secondary school education. Standing before the cheering school assembly the next morning, Kofi understood that honesty is indeed the best policy.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Descriptive: An Inter-Schools Football Final Match
  {
    id: "B7_S4_E_I_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Descriptive Essay",
    title: "Drama at the Inter-Schools Football Final",
    shortSummary: "Write a descriptive essay capturing the sights, sounds, and tension of a fiercely contested football final.",
    prompt: "Your school participated in the grand final of the inter-schools soccer championship. Write a descriptive essay recreating the tense atmosphere, the deafening cheers of supporters, the frantic on-pitch action, and the dramatic last-minute winning goal.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Kinetic Action Description, Auditory Stadium Imagery & Climactic Pacing",
    learningCompetency: "B7.4.2.2.1: Write descriptive essays recreating fast-paced sporting events through kinetic verbs, auditory imagery, and emotional crescendo.",
    hint: "Use chronological progression: the packed stadium atmosphere before kickoff, the fast-paced physical duel on the pitch, the tense penalty shootout or stoppage-time goal, and the wild pitch invasion.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Thunder and Triumph on the Pitch",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Chronological kinetic progression through a tense football championship match.",
        stagePrompts: [
          { stageIndex: 1, role: "The Charged Stadium Atmosphere", guidingQuestion: "Describe the packed stands, waving banners, brass bands, and nervous energy before kickoff.", transitionHints: ["The atmosphere inside the Sunyani Coronation Park was electric with anticipation...", "Over two thousand passionate student supporters packed the bleachers, their synchronized cheers accompanied by..."] },
          { stageIndex: 2, role: "The Kinetic On-Pitch Battle", guidingQuestion: "Depict the fierce physical duel, crunching tackles, and swift counter-attacks between the rival teams.", transitionHints: ["From the opening referee's whistle, the contest was a fierce battle of stamina and skill...", "Midfielders clashed in bone-jarring tackles while the ball zipped across the damp green turf..."] },
          { stageIndex: 3, role: "The Stoppage-Time Climax", guidingQuestion: "Describe the heart-stopping last-minute corner kick and dramatic header that broke the deadlock.", transitionHints: ["With barely sixty seconds remaining on the clock and the score locked at zero...", "Our winger curled a magnificent corner kick into the crowded penalty box, where our captain rose like an eagle..."] },
          { stageIndex: 4, role: "The Final Whistle & Pitch Invasion", guidingQuestion: "Depict the net bulging, the final whistle, the wild pitch invasion, and the joyous celebration.", transitionHints: ["The ball rifled into the top corner, and the stadium erupted into deafening pandemonium...", "Hundreds of ecstatic students poured over the barricades in a flood of celebration..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Sporting Reflection",
        proverbOrClosingPhrase: "Teamwork and resilience turn pressure into victory.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating athletic unity and determination."
      }
    },
    rubric: createWAECRubric(
      ["Stadium crowd atmosphere and nervous energy established (2 marks)", "Kinetic on-pitch physical action and ball movement depicted vividly (4 marks)", "Stoppage-time goal climax and pitch invasion celebration conveyed (4 marks)"],
      ["Stadium setting vivid", "Kinetic action described clearly", "Goal climax exciting"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph chronological flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Dynamic action verbs and athletic vocabulary (4 marks)", "Apt similes and sound effects (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Action verbs active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `Thunder and Triumph on the Pitch\n___________________________________\n\nThe atmosphere inside the Sunyani Coronation Park was charged with an electric tension that made hairs stand on end. Over two thousand passionate students from rival basic schools packed the stands, beating painted oil drums, blowing shrill vuvuzelas, and waving school banners in a blur of blue and yellow. The deafening chants of our brass band reverberated through the stadium, setting hearts thumping in anticipation of the regional soccer final.\n\nFrom the moment the referee's whistle pierced the afternoon air, the match became a relentless physical and tactical battle. The ball darted across the emerald turf like a speeding projectile. In the midfield, players collided in bone-jarring tackles, while swift wingers executed breathtaking step-overs, sending plumes of dust flying under their studded boots. Our goalkeeper pulled off an acrobatic diving save, tipping a ferocious rocket shot over the crossbar with his fingertips, drawing gasps of relief from our trembling supporters.\n\nWith ninety minutes elapsed and the scoreboard locked at a tense 0–0, the referee signaled three minutes of stoppage time. We earned a desperate corner kick. Our left winger stepped up, took a deep breath, and curled a magnificent, looping cross into the crowded penalty box. Leaping above a thick wall of towering defenders, our striker rose like a soaring falcon, met the ball with a powerful header, and directed it downward with explosive precision.\n\nThe leather ball crashed into the top corner of the net! For a fraction of a second, absolute silence stunned the stadium—then deafening pandemonium exploded. The referee blew his final whistle, and a jubilant yellow sea of students spilled over the perimeter rails, engulfing the players in tears of triumph.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Article for Publication: The Hazards of Commercial Video-Gaming Centers
  {
    id: "B7_S4_E_I_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Article for Publication",
    title: "The Growing Menace of Video-Game Parlors",
    shortSummary: "Write an article for publication in a national daily on teenage truancy fueled by commercial gaming shops.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'The Threat of Commercial Video-Gaming Centers to Youth Education.' Examine how unregulated gaming shops fuel chronic truancy, examine its negative impact on academic performance and moral conduct, and propose two strict regulatory solutions.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Sociological Analysis & Statutory Solutions",
    learningCompetency: "B7.4.2.1.2: Compose structured articles for publication analyzing contemporary sociological problems, academic fallout, and municipal bylaws.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into problem analysis, effects, and remedies.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "THE THREAT OF COMMERCIAL VIDEO-GAMING CENTERS TO YOUTH EDUCATION",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Richmond Asare, Basic 7A",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> The Truancy Crisis -> Moral and Academic Decay -> Regulatory Enforcement).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and describe the alarming proliferation of dark, unregulated gaming shops near schools.", transitionHints: ["Tucked away in the narrow alleys of our urban suburbs...", "A dangerous social vice is silently derailing the academic dreams of hundreds of junior secondary pupils..."] },
          { stageIndex: 2, role: "The Truancy and Addiction Crisis", guidingQuestion: "Analyze how children abandon morning classes to spend hours playing violent console games.", transitionHints: ["During official instructional school hours, when classrooms should be full...", "Pupils in uniform congregate inside dark, stuffy video-game parlors, squandering lunch money and..."] },
          { stageIndex: 3, role: "Moral & Academic Repercussions", guidingQuestion: "Explain the link between gaming addiction, chronic academic failure, and petty theft.", transitionHints: ["The repercussions on youth development are alarming...", "Deprived of study hours, addicted pupils score dismal grades in continuous assessments, while some resort to petty theft..."] },
          { stageIndex: 4, role: "Statutory Remedies & Call to Action", guidingQuestion: "Propose two actionable solutions (enforcing assembly operating hours and police-PTA taskforce raids).", transitionHints: ["To safeguard our educational investments, decisive regulatory action must be taken...", "First, municipal assemblies must pass strict bylaws prohibiting operators from admitting minors during school hours..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Civic Appeal",
        proverbOrClosingPhrase: "Our children are the intellectual foundation of tomorrow's nation.",
        integrationRule: "End with an inspiring appeal urging communities to protect children's educational futures."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and commercial gaming proliferation established (2 marks)", "Truancy, academic decline, and theft fallout analyzed (4 marks)", "Two actionable regulatory solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Consequences detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive analytical vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `THE THREAT OF COMMERCIAL VIDEO-GAMING CENTERS TO YOUTH EDUCATION\nBy Richmond Asare, Basic 7A\n\nTucked away in the cramped alleyways of our urban towns and peri-urban settlements lies a growing social vice that threatens the future of basic education: commercial video-gaming and digital betting parlors. Under the guise of innocent entertainment, these unlicensed establishments have become breeding grounds for chronic truancy, academic failure, and juvenile delinquency.\n\nIt is deeply alarming that during official school hours, when classrooms should be filled with learning, dozens of school pupils in uniform can be found huddled in dark, poorly ventilated gaming dens. Enticed by violent combat games and digital football matches, children squander their daily lunch allowances and examination registration fees. The addictive nature of these video games hijacks their attention, making disciplined classroom instruction feel boring and unbearable.\n\nThe consequences on educational outcomes are devastating. Children trapped in this gaming addiction arrive at school late, fall asleep during afternoon lessons, and fail to complete homework assignments. Terminal examination scores plummet, leading to high dropout rates before the BECE. Even more concerning is the moral decay that accompanies the habit; when pocket allowances run out, addicted youths frequently resort to pilfering money from their parents' purses or stealing textbooks to fund their hourly gaming sessions.\n\nTo eradicate this growing menace, municipal assemblies must urgently pass and enforce strict business licensing bylaws prohibiting gaming parlors from operating within a five-hundred-meter radius of any school. Furthermore, operators who admit pupils in uniform during school hours must face heavy fines and permanent closure. Parents, teachers, and assembly members must unite in vigilance, for our children are the intellectual foundation of tomorrow's nation.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Debate: Corporal Punishment vs. Alternative Discipline (Opposing Caning)
  {
    id: "B7_S4_E_I_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Debate Speech",
    title: "Corporal Punishment Should Be Abolished in Schools",
    shortSummary: "Speak against caning and in favor of constructive alternative disciplinary methods in schools.",
    prompt: "You are the second speaker in an inter-schools debate competition on the motion: 'Corporal Punishment in Basic Schools Does More Harm Than Good.' Write your debate speech opposing the use of the cane, delivering at least two convincing arguments regarding psychological trauma and classroom fear, while refuting opposing viewpoints.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B7.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on psychological fear and constructive alternatives like counseling. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that corporal punishment in basic schools does far more harm than good.",
        prohibitedOpenings: ["Good morning to you all", "I am here to tell you"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Psychological Trauma & Fear -> Constructive Restorative Alternatives -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with resolute passion today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Psychological Fear & Hostility", guidingQuestion: "Explain how physical caning breeds anxiety, fear of asking questions, and hatred for school.", transitionHints: ["First and foremost, true discipline cannot be beaten into a child with a cane...", "When teachers rely on the cane, classrooms become environments of terror where children are terrified of answering questions..."] },
          { stageIndex: 3, role: "Second Argument: Constructive Restorative Discipline", guidingQuestion: "Contrast violent caning with counseling, community service, and detention that correct character.", transitionHints: ["Secondly, modern child psychology demonstrates that restorative discipline is vastly superior...", "Assigning reflective writing tasks, library duties, or counseling sessions addresses the root cause of misbehavior..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims that 'sparing the rod spoils the child,' deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents have quoted ancient proverbs to defend the cane; however, this claim collapses because...", "With these undeniable truths, I urge you all to vote for the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Education should enlighten the mind, not scar the body.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Psychological fear and trauma argument developed cogently (4 marks)", "Restorative discipline alternatives and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Corporal Punishment in Basic Schools Does Far More Harm Than Good.\"\n\nFirst and foremost, physical flogging destroys the psychological atmosphere essential for learning. A classroom should be a safe sanctuary of intellectual curiosity, not a torture chamber of terror. When teachers wield the cane for every minor mistake, pupils become paralyzed by fear. Instead of focusing on mathematical reasoning or creative writing, children spend lessons trembling, terrified that giving a wrong answer will earn them painful wheals across their backs. This fear breeds chronic truancy, destroys self-confidence, and conditions children to hate school.\n\nSecondly, caning is an outdated, lazy substitute for constructive character correction. Inflicting physical pain does not teach a child why an action is wrong; it merely teaches them how to avoid getting caught. Modern educational practice relies on restorative discipline: counseling, withdrawing privileges, assigning reflective essays, and school community service. When a disruptive pupil is made to weed flowerbeds or clean the library, they contribute productively to the school community while reflecting on their conduct without suffering physical injury or public humiliation.\n\nMy worthy opponents have argued passionately that 'sparing the rod spoils the child.' However, this ancient biblical metaphor has been misunderstood! The shepherd's rod was used to guide and protect sheep, not to beat them into submission. Do the most technologically advanced nations beat their school children? Incontestably not, yet their pupils excel globally!\n\nMr. Chairman, education should enlighten the mind, not scar the flesh. Let us throw the cane out of our classrooms and lead with empathy, reason, and restorative discipline. I urge this house to vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Narrative: An Encounter with Wild Honeybees on a Farm Excursion
  {
    id: "B7_S4_E_I_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Narrative Essay",
    title: "The Wrath of the Honeybees",
    shortSummary: "Write a narrative story about an unexpected swarm of wild bees attacking students during a nature walk.",
    prompt: "During an agricultural nature walk in the forest near your school, a careless stone throw disturbed a colony of wild honeybees. Write a narrative essay recounting the panicked flight of the students, describing the painful stings, and sharing how an experienced local farmer rescued the group.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Suspenseful Action Narration, Kinetic Pacing & Crisis Resolution",
    learningCompetency: "B7.4.2.1.1: Compose suspenseful narrative stories depicting sudden environmental hazards, dynamic group action, and practical community rescue.",
    hint: "Start with the peaceful nature walk, build up the careless action that disturbed the hive, narrate the chaotic flight through the bush, and conclude with the rescue using smoke.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Terror in the Forest Trail",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing peaceful hike, sudden crisis, frantic flight, and farmer's rescue.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Baseline", guidingQuestion: "Describe the pleasant Friday afternoon agricultural nature walk into the community forest reserve.", transitionHints: ["On a breezy Friday afternoon, our Basic 7 Agricultural Science class set off...", "Equipped with field notebooks, we walked along the shaded forest trail identifying medicinal shrubs..."] },
          { stageIndex: 2, role: "Inciting Incident: The Careless Throw", guidingQuestion: "Describe a mischievous student throwing a rock at a dark mass hanging high in a baobab tree.", transitionHints: ["Disaster struck when a restless classmate, Kwesi, spotted a dark clump high on a hollow baobab limb...", "Ignoring our tutor's warning, he hurled a heavy jagged stone straight into the tree hollow..."] },
          { stageIndex: 3, role: "Rising Action & Chaotic Flight", guidingQuestion: "Narrate the furious buzzing swarm emerging and the panicked scramble of screaming students through thorns.", transitionHints: ["A terrifying, angry hum reverberated through the canopy as a black cloud of bees burst out...", "Pandemonium erupted instantly as thirty screaming students scattered blindly through the thorny brushwood..."] },
          { stageIndex: 4, role: "The Farmer's Rescue & Denouement", guidingQuestion: "Describe a nearby elderly palm-wine tapper using smoke to disperse the bees, and treating the stings.", transitionHints: ["Just as exhaustion threatened to overwhelm us, an experienced palm-wine tapper rushed from his hut...", "Lighting bundles of dry palm fronds, he enveloped us in protective smoke, driving the furious swarm away..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Moral Synthesis",
        proverbOrClosingPhrase: "Do not poke a sleeping hornets' nest.",
        integrationRule: "Conclude with the reflection that thoughtless actions endanger entire communities."
      }
    },
    rubric: createWAECRubric(
      ["Nature walk setting and cheerful baseline established (2 marks)", "Careless rock throwing and terrifying swarm attack depicted vividly (4 marks)", "Chaotic flight, farmer's smoke rescue, and lesson learned conveyed (4 marks)"],
      ["Setting established", "Swarm attack vivid and kinetic", "Rescue by farmer clear"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Natural narrative pacing (1 mark)", "Consistent narrative perspective (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Pacing consistent"],
      ["Dynamic action verbs and sensory adjectives (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid auditory and tactile imagery (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `Terror in the Forest Trail\n___________________________\n\nOn a breezy Friday afternoon, our Basic 7 Agricultural Science class embarked on a field nature walk into the community forest reserve bordering our school. Armed with clipboards and hand lenses, we enjoyed the excursion under the pleasant forest canopy, identifying indigenous medicinal herbs and collecting soil samples under our teacher's supervision.\n\nDisaster struck when we reached an ancient, hollow baobab tree. High up in a sheltered fork between two massive branches hung a large, dark, pulsating mass. Spotting it from afar, a restless and mischievous classmate named Kwesi picked up a jagged stone. \"Watch me strike that target!\" he laughed boastfully. Before our horrified teacher could shout a warning, the rock whistled through the air and struck the hollow with a solid thud. It was not a termite nest; it was a gigantic wild honeybee hive!\n\nA terrifying, high-pitched hum erupted from the canopy. In seconds, an angry black cloud of thousands of furious bees burst from the shattered comb, spiraling downward like a living tornado. Pandemonium broke loose. Screaming in terror, thirty students dropped clipboards and scrambled blindly through the dense undergrowth. The air was filled with sharp, stinging agony as bees swarmed into our hair, pierced our ears, and stung our necks through our uniforms.\n\nJust as panic threatened to turn into a stampede, an elderly palm-wine tapper working in a nearby clearing heard our desperate shrieks. He rushed toward us with burning bundles of dry palm fronds, bellowing at us to throw ourselves flat into the grass. The thick, pungent smoke billowed over our prostrate bodies, confusing the bees and driving the swarm back up into the canopy. Coughing, bruised, and nursing painful swollen foreheads, we thanked our rescuer, while Kwesi wept in humiliation. He had learned never to poke a sleeping hornets' nest.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Descriptive: The Early Morning Activity at a Coastal Fishing Harbor
  {
    id: "B7_S4_E_I_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Descriptive Essay",
    title: "Dawn at the Coastal Fishing Beach",
    shortSummary: "Write a descriptive essay capturing the sensory sights, sounds, and vibrant commerce of a fishing beach at dawn.",
    prompt: "Write a descriptive essay recreating the early morning scene at an artisanal fishing beach in Ghana. Vividly depict the colorful wooden canoes returning from sea, the singing fishermen hauling heavy nets, the haggling fishmongers, and the smell of the salty ocean air.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Sensory Maritime Imagery, Spatial Harbor Progression & Cultural Color",
    learningCompetency: "B7.4.2.2.1: Write descriptive compositions capturing commercial coastal activities through rich auditory, olfactory, and visual sensory registers.",
    hint: "Use spatial progression: the misty ocean horizon at dawn, the arrival and hauling of canoes onto the wet sand, the lively commercial haggling over baskets of fish, and the smoking kilns along the shore.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Life Awakes on the Atlantic Shore",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory description of an artisanal fishing beach from dawn arrival to market commerce.",
        stagePrompts: [
          { stageIndex: 1, role: "Dawn on the Horizon", guidingQuestion: "Set the scene at dawn along the sandy shore as wooden canoes emerge from the ocean mist.", transitionHints: ["Before the golden crest of the sun breaks above the Atlantic horizon...", "A dense, cool sea mist clings to the rocky coastline of Elmina, where dawn awakens with..."] },
          { stageIndex: 2, role: "Hauling the Canoes (Kinetic & Auditory)", guidingQuestion: "Describe singing fishermen pulling heavy painted canoes onto the wet sand with rhythmic chants.", transitionHints: ["Dozens of hand-carved wooden canoes, adorned with vibrant flags and spiritual proverbs, glide toward the beach...", "Chest-deep in the surging surf, barefoot fishermen chant rhythmic working songs as they haul the heavy timber vessels..."] },
          { stageIndex: 3, role: "The Fish Market Bustle (Olfactory & Gustatory)", guidingQuestion: "Depict the sparkling mounds of fish, haggling market women, and smell of salty sea spray and herrings.", transitionHints: ["As the massive hemp drag-nets are pulled onto the sand, a sparkling treasure of marine life is unveiled...", "Glistening silver sardines, flat soles, and snapping blue crabs spill across woven wicker trays while fishmongers haggle..."] },
          { stageIndex: 4, role: "The Shoreline Smoking Kilns & Reflection", guidingQuestion: "Describe the rising plumes of fragrant firewood smoke from fish kilns and reflect on the dignity of labor.", transitionHints: ["Further inland, plumes of aromatic firewood smoke drift lazily from circular mud kilns...", "Standing on the damp sand, watching generations work together in harmony, I felt deep respect for the resilience of our coastal people..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Aesthetic Reflection",
        proverbOrClosingPhrase: "The ocean rewards only those who brave the nocturnal waves.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating honest coastal industry."
      }
    },
    rubric: createWAECRubric(
      ["Coastal setting and dawn horizon established (2 marks)", "Canoe hauling and rhythmic working songs depicted vividly (4 marks)", "Vibrant fish commerce and smoking kilns conveyed with multi-sensory details (4 marks)"],
      ["Shoreline setting vivid", "Auditory, visual, and olfactory imagery rich", "Dignity of labor captured"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich maritime and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `Life Awakes on the Atlantic Shore\n__________________________________\n\nLong before the golden rim of the sun breaks over the Atlantic horizon, the sandy beach at Elmina stirs to life. A crisp, cool sea breeze sweeps inland, carrying the pungent scent of brine, seaweed, and wet sand. Through the drifting morning mist, the dark silhouettes of dozens of hand-carved wooden canoes emerge from the rolling waves like returning sea creatures after a long night on the open ocean.\n\nThe shoreline is a theater of coordinated human energy. Chest-deep in the pounding white surf, teams of muscular fishermen grip thick hemp ropes, their voices rising in rhythmic call-and-response working songs that keep their pulls synchronized. With a collective heave, they slide the massive timber canoes onto the glistening wet sand. Each vessel is a work of maritime art, its hull painted in bold yellow and scarlet geometric patterns, with miniature national flags fluttering from tall bamboo masts.\n\nOn the beach, the catch is unloaded onto woven wicker baskets, unleashing a vibrant marketplace. Thousands of silver sardines and barracudas glisten like polished coins in the dawn light, snapping tails spraying droplets of cold water into the air. Crowds of fishmongers in colorful calico wrappers haggle furiously with the boat captains, their sharp voices competing with the ceaseless roar of the breaking surf and the squawking of circling sea terns overhead.\n\nFurther along the shore, aromatic plumes of mangrove firewood smoke drift lazily from circular mud smoking kilns where women prepare fish for distant markets. Watching this timeless cycle of labor and survival, I was filled with deep admiration for the resilience and dignity of our coastal fishermen, proving that the ocean rewards only those who brave the nocturnal waves.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B7IntermediateClean() {
  console.log("Building clean 60-item Strand 4 B7 Intermediate Practice Lab...");
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
      id: `B7_S4_E_I_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B7",
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
      learningCompetency: "B7.4.2.1: Demonstrate intermediate mastery of narrative arcs, sensory descriptive writing, article headline-byline rules, and parliamentary debate vocatives."
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
    level: "B7",
    difficulty: "intermediate",
    title: "Basic 7 Intermediate Writing Lab: 50 Objective Rhetoric Drills + 10 Theory Extended Compositions",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B7_intermediate`
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
          b7: {
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all60Items.length} items to B7 Intermediate Practice Labs!`);
}

deployStrand4B7IntermediateClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B7 Intermediate Clean 60 Lab:", err);
    process.exit(1);
  });

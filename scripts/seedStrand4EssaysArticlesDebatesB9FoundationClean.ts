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
  level: "B9";
  difficulty: "foundation";
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
  level: "B9";
  difficulty: "foundation";
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
// Basic 9 Foundation Diagnostic Focus:
// BECE Continuous Writing Architecture, Freytag Plot Pacing, Spatial Framing,
// Article Headline/Byline Laws, Dialogue Orthography & Parliamentary Vocatives
// =========================================================================
const rawObjective50Data = [
  {
    passage: "A BECE candidate is writing an illustrative narrative for the proverb: 'A bird in hand is worth two in the bush.'",
    question: "Which of the following narrative developments best exemplifies this proverb?",
    options: [
      "A young apprentice resigns from a reliable carpentry job to chase vague promises of oil riches, ending up broke and unemployed",
      "A hunter catches two wild partridges in a forest trap and sells them at a profit in the market",
      "A student keeps a wounded bird in a wooden cage until its broken wing heals completely",
      "A boy climbs a tall baobab tree to inspect a bird's nest and safely climbs down"
    ],
    answer: "A young apprentice resigns from a reliable carpentry job to chase vague promises of oil riches, ending up broke and unemployed",
    hint: "The proverb warns against abandoning an assured modest benefit in pursuit of risky illusions.",
    solution: "The proverb 'A bird in hand is worth two in the bush' teaches that a certain modest benefit should not be forfeited for uncertain, speculative rewards. Abandoning guaranteed employment for an illusion embodies this truth.",
    target: "Proverbial Interpretation & Narrative Architecture"
  },
  {
    passage: "In Freytag's dramatic plot pyramid, what structural role does the 'climax' play in an essay?",
    question: "Identify the defining feature of the narrative climax:",
    options: [
      "It represents the peak of dramatic tension where the conflict reaches a crisis requiring a decisive choice",
      "It serves as the opening paragraph where setting and character background are established",
      "It is the concluding sentence where the moral proverb is formally quoted",
      "It lists the names of all secondary characters in order of importance"
    ],
    answer: "It represents the peak of dramatic tension where the conflict reaches a crisis requiring a decisive choice",
    hint: "It is the turning point of greatest dramatic conflict in the story.",
    solution: "The climax is the apex of dramatic tension in Freytag's pyramid, forcing an irreversible choice or showdown that triggers the falling action.",
    target: "Freytag's Pyramid: Climax Function"
  },
  {
    passage: "A student writing an article for the *Daily Graphic* writes: 'Yours faithfully, Master Kwame Mensah' at the conclusion.",
    question: "How is this evaluated under the WAEC Paper 2 marking guide?",
    options: [
      "Penalized under Organization for format contamination because articles never take epistolary subscriptions",
      "Awarded full marks for formal polite closure",
      "Penalized under Mechanical Accuracy for capitalization",
      "Classified as an optional journalistic convention"
    ],
    answer: "Penalized under Organization for format contamination because articles never take epistolary subscriptions",
    hint: "Articles are public press documents, not private letters.",
    solution: "Articles intended for publication are public expository essays. Adding epistolary subscriptions ('Yours faithfully,') constitutes layout contamination, penalizable under Organization.",
    target: "Articles for Publication: Format Purity"
  },
  {
    passage: "A debater addresses the hall: 'Panel of Adjudicators, Mr. Chairman, Co-Debaters, Timekeeper, Ladies and Gentlemen.'",
    question: "What procedural error exists in this vocative salutation?",
    options: [
      "The Chairman must always precede the Panel of Adjudicators in the parliamentary hierarchy",
      "The Timekeeper should be addressed before the Adjudicators",
      "The audience must be addressed before the Chairman",
      "Co-debaters must be addressed before the judges"
    ],
    answer: "The Chairman must always precede the Panel of Adjudicators in the parliamentary hierarchy",
    hint: "The presiding officer outranks all judges and officials.",
    solution: "Under standard parliamentary procedure, the presiding officer ('Mr. Chairman' or 'Madam Chairperson') occupies the highest constitutional authority and must be addressed first.",
    target: "Debate Speech: Vocative Protocol Hierarchy"
  },
  {
    passage: "Examine this dialogue construction: '\"Stop where you are!\" shouted the night watchman, \"or I will release the guard dog!\"'",
    question: "What punctuation correction must be applied to the inquit tag?",
    options: [
      "Replace the comma after 'watchman' with a full stop because both spoken clauses are complete sentences",
      "Place the exclamation mark outside the quotation marks",
      "Capitalize the word 'shouted'",
      "Remove the quotation marks from the second spoken clause"
    ],
    answer: "Replace the comma after 'watchman' with a full stop because both spoken clauses are complete sentences",
    hint: "Two independent complete sentences spoken by a character require a period after the reporting tag.",
    solution: "Because 'Stop where you are!' and 'or I will release the guard dog!' are independent sentences, the inquit tag must terminate with a period: '...watchman. \"Or I will...\"'.",
    target: "Dialogue Mechanics: Sentence Boundary Rules"
  },
  {
    passage: "A student writes: 'The pungent stench of charred fish bones and burning polythene stung his nostrils.'",
    question: "Which human sensory register is engaged by this sentence?",
    options: [
      "Olfactory register",
      "Auditory register",
      "Tactile register",
      "Visual register"
    ],
    answer: "Olfactory register",
    hint: "It describes odors perceived through the nose.",
    solution: "'Pungent stench' and 'stung his nostrils' appeal directly to the olfactory sense (smell).",
    target: "Descriptive Writing: Olfactory Sensory Imagery"
  },
  {
    passage: "A candidate writes an article headline in all-caps: <u>THE EFFECTS OF UNEMPLOYMENT ON YOUTH INDISCIPLINE</u>.",
    question: "What typographical layout rule is violated here?",
    options: [
      "A headline written in ALL BLOCK CAPITALS must not be underlined",
      "Headlines must never be written in capital letters",
      "The word 'EFFECTS' must be abbreviated",
      "The headline should be placed in quotation marks"
    ],
    answer: "A headline written in ALL BLOCK CAPITALS must not be underlined",
    hint: "Underlining is reserved exclusively for Title Case headings.",
    solution: "Under WAEC marking rubrics, full block capital titles must never be underlined. Underlining is reserved exclusively for Title Case headings.",
    target: "Headline Typography: Block Capital Prominence Rule"
  },
  {
    passage: "In narrative prose, what is the consequence of slipping between past and present tense (e.g., 'he ran to the station and jumps on the bus')?",
    question: "How is this error penalized under WAEC marking rubrics?",
    options: [
      "Under Mechanical Accuracy as a tense instability error (deduction of 1/2 mark per occurrence)",
      "Under Content as a failure of imagination",
      "Under Organization as a paragraph defect",
      "No penalty is applied if the story is exciting"
    ],
    answer: "Under Mechanical Accuracy as a tense instability error (deduction of 1/2 mark per occurrence)",
    hint: "Tense shifts are grammatical errors penalized under Mechanical Accuracy.",
    solution: "Unjustified shifting between past and present tense violates aspectual consistency, resulting in 1/2 mark deductions under Mechanical Accuracy.",
    target: "Narrative Aspect: Tense Stability Penalties"
  },
  {
    passage: "Where should the byline be positioned on an article written for publication?",
    question: "Select the correct location for the byline:",
    options: [
      "Directly below the headline or at the conclusion of the article",
      "At the top right corner with a sender postal address",
      "In the middle of the second paragraph as a parenthetical note",
      "Within the concluding moral sentence only"
    ],
    answer: "Directly below the headline or at the conclusion of the article",
    hint: "The byline establishes authorship under the title or at the end.",
    solution: "The byline (e.g., 'By Kwame Mensah, Basic 9A') sits immediately beneath the headline or is appended at the very end of the essay.",
    target: "Articles for Publication: Byline Placement"
  },
  {
    passage: "A debate speaker says: 'Are we to believe that giving laptops to students without internet will magically solve illiteracy?'",
    question: "What rhetorical figure of speech is utilized here to challenge the opposition?",
    options: [
      "Rhetorical question",
      "Metaphor",
      "Oxymoron",
      "Litotes"
    ],
    answer: "Rhetorical question",
    hint: "A question designed to make a point rather than seek an answer.",
    solution: "A rhetorical question is used to make a persuasive point or emphasize absurdity, steering the audience toward an obvious conclusion.",
    target: "Rhetorical Devices: Persuasive Questioning"
  },
  {
    passage: "In a descriptive composition, what is the purpose of 'spatial progression'?",
    question: "Define spatial progression in descriptive writing:",
    options: [
      "Arranging physical descriptions in a coherent, directional path (e.g., foreground to background, top to bottom)",
      "Listing the cost of every building described",
      "Writing paragraphs of equal word counts",
      "Describing events in reverse alphabetical order"
    ],
    answer: "Arranging physical descriptions in a coherent, directional path (e.g., foreground to background, top to bottom)",
    hint: "It organizes the eye of the reader logically across physical space.",
    solution: "Spatial progression organizes descriptions systematically across space, guiding the reader's imagination without chaotic hopping.",
    target: "Descriptive Writing: Spatial Progression"
  },
  {
    passage: "Examine this dialogue tag: '\"We must find shelter immediately,\" urged the tour guide.'",
    question: "Why is 'urged' written with a lowercase initial letter?",
    options: [
      "Because the inquit tag is part of the same continuous sentence and 'urged' is not a proper noun",
      "Because dialogue tags must always be lowercase regardless of punctuation",
      "Because the guide was whispering quietly",
      "Because the quotation marks were closed prematurely"
    ],
    answer: "Because the inquit tag is part of the same continuous sentence and 'urged' is not a proper noun",
    hint: "When a reporting verb follows quoted speech separated by a comma, it continues the sentence.",
    solution: "The reporting verb in an inquit tag continues the syntactic clause and remains in lowercase unless it is a capitalized proper noun.",
    target: "Dialogue Mechanics: Inquit Casing Laws"
  },
  {
    passage: "In Freytag's plot pyramid, what occurs during the 'falling action'?",
    question: "Identify the narrative role of falling action:",
    options: [
      "The consequences of the climax unfold, de-escalating tension toward the final resolution",
      "The protagonist meets the antagonist for the first time",
      "The author describes the childhood of the main character",
      "The story ends abruptly without explaining what happened"
    ],
    answer: "The consequences of the climax unfold, de-escalating tension toward the final resolution",
    hint: "It traces the aftermath immediately following the turning point.",
    solution: "Falling action traces the unraveling of the crisis after the climax, leading the narrative toward its final denouement and moral resolution.",
    target: "Freytag's Pyramid: Falling Action Phase"
  },
  {
    passage: "In an argumentative composition, what is the purpose of a 'counter-argument refutation'?",
    question: "Identify the function of refuting an opposing argument:",
    options: [
      "To acknowledge the opponent's strongest point fairly, then dismantle it using superior facts and logic",
      "To insult the opponent's character and intelligence",
      "To agree completely with the opponent and change your thesis",
      "To omit difficult topics from the discussion"
    ],
    answer: "To acknowledge the opponent's strongest point fairly, then dismantle it using superior facts and logic",
    hint: "It strengthens your stance by taking on the opponent's best point and disproving it.",
    solution: "Refutation involves stating the opposing perspective honestly (concession) and systematically demonstrating its weaknesses through logic and empirical evidence.",
    target: "Argumentative Logic: Dialectical Refutation"
  },
  {
    passage: "A student writes a headline: '<u>THE ROLE OF VOCATIONAL TRAINING IN GHANA.</u>'.",
    question: "What two mechanical formatting errors are present in this headline?",
    options: [
      "Underlining a headline written in ALL CAPITAL LETTERS and adding an illegal terminal full stop",
      "Failing to write in pencil and omitting quotation marks",
      "Using the preposition 'in' and capitalizing the article",
      "Omitting the author's class stream from the title"
    ],
    answer: "Underlining a headline written in ALL CAPITAL LETTERS and adding an illegal terminal full stop",
    hint: "All-caps headings should not be underlined, and titles never end with periods.",
    solution: "Headlines in all-caps must not be underlined, and titles must never end with a period. Both represent mechanical errors under WAEC rubrics.",
    target: "Headline Typography: Combined Orthography Flaws"
  },
  {
    passage: "Which of the following phrases appeals directly to the tactile sensory register?",
    question: "Select the tactile descriptive phrase:",
    options: [
      "The icy, jagged mountain rocks lacerated his bleeding fingertips",
      "The deafening shriek of the siren echoed through the valley",
      "The dazzling glare of the afternoon sun blinded the spectators",
      "The sweet, fragrant perfume of wild orchids filled the glade"
    ],
    answer: "The icy, jagged mountain rocks lacerated his bleeding fingertips",
    hint: "Tactile relates to touch, texture, cold/heat, and physical pain on the skin.",
    solution: "'Icy, jagged mountain rocks lacerated his bleeding fingertips' evokes physical touch, surface texture, and bodily pain.",
    target: "Descriptive Writing: Tactile Imagery"
  },
  {
    passage: "In a formal debate speech, what is the correct title used to address the person presiding over the contest?",
    question: "Identify the proper presiding vocative:",
    options: [
      "Mr. Chairman (or Madam Chairperson)",
      "Master Speaker",
      "Chief Ruler",
      "Senior Headmaster"
    ],
    answer: "Mr. Chairman (or Madam Chairperson)",
    hint: "Parliamentary debate protocol designates the presiding official as Chairman or Chairperson.",
    solution: "Under standard parliamentary procedure, the presiding officer is addressed as 'Mr. Chairman' or 'Madam Chairperson'.",
    target: "Debate Speech: Presiding Vocative"
  },
  {
    passage: "A writer describes an athlete: 'He ran like the wind, soared like an eagle, and struck like lightning.'",
    question: "What two stylistic devices are combined in this sentence?",
    options: [
      "Tricolon and parallel similes",
      "Oxymoron and personification",
      "Hyperbole and euphemism",
      "Chiasmus and litotes"
    ],
    answer: "Tricolon and parallel similes",
    hint: "A three-part sentence using 'like' in each clause.",
    solution: "The sentence combines a three-part syntactic structure (tricolon) with three parallel comparisons introduced by 'like' (similes).",
    target: "Stylistic Analysis: Combined Rhetorical Devices"
  },
  {
    passage: "Why are postal addresses and dates prohibited at the top of an article intended for publication?",
    question: "State the governing genre purity rule:",
    options: [
      "Articles are public expository essays written for a general readership, not private postal letters",
      "Because the printer does not have enough paper",
      "Because the editor already knows the student's address",
      "Because dates are only used in historical textbooks"
    ],
    answer: "Articles are public expository essays written for a general readership, not private postal letters",
    hint: "Articles are public media documents, not personal correspondence.",
    solution: "Articles are public media texts. Including postal addresses or dates is format contamination, penalized under Organization.",
    target: "Articles for Publication: Format Purity Rules"
  },
  {
    passage: "What is an 'in medias res' narrative opening?",
    question: "Define the narrative technique known as in medias res:",
    options: [
      "Plunging the reader immediately into the middle of intense dramatic action before providing background context",
      "Beginning a story with a detailed physical description of the characters' ancestors",
      "Listing all the vocabulary words at the start of the essay",
      "Starting with the conclusion and ending with the introduction"
    ],
    answer: "Plunging the reader immediately into the middle of intense dramatic action before providing background context",
    hint: "Latin for 'into the middle of things'.",
    solution: "'In medias res' begins the story at the midpoint of crisis or action, capturing reader attention immediately before filling in backstory.",
    target: "Narrative Craft: In Medias Res Hook"
  },
  {
    passage: "A student writes: 'The food was sweet, sugary, tasty, and delicious.'",
    question: "What stylistic defect weakens this sentence?",
    options: [
      "Tautology and sensory redundancy",
      "A subject-verb concord error",
      "Passive voice distortion",
      "Unpunctuated dialogue"
    ],
    answer: "Tautology and sensory redundancy",
    hint: "Piling up synonyms that mean the same thing wastes expressive energy.",
    solution: "Using multiple words expressing the same basic quality ('sweet', 'sugary', 'tasty', 'delicious') creates tautological redundancy.",
    target: "Expression: Lexical Tautology"
  },
  {
    passage: "How should a speaker refer to the opposing debaters during a competitive debate?",
    question: "Select the decorous parliamentary term:",
    options: [
      "My worthy opponents / My esteemed co-debaters",
      "My foolish competitors over there",
      "Those confused speakers on the left",
      "The enemies of truth"
    ],
    answer: "My worthy opponents / My esteemed co-debaters",
    hint: "Parliamentary decorum mandates polite, dignified references to opponents.",
    solution: "Debate decorum forbids personal abuse. Contestants must refer to the opposing side as 'my worthy opponents' or 'my esteemed co-debaters'.",
    target: "Debate Speech: Parliamentary Etiquette"
  },
  {
    passage: "A narrative ends with: 'Staring at his ruined farm, he realized that a rolling stone gathers no moss.'",
    question: "What makes this integration of the proverb effective?",
    options: [
      "It connects the moral aphorism directly to the protagonist's lived consequence and emotional realization",
      "Because it is written in capital letters",
      "Because the proverb is placed inside parenthesis",
      "Because it is the longest sentence in the story"
    ],
    answer: "It connects the moral aphorism directly to the protagonist's lived consequence and emotional realization",
    hint: "The proverb fits naturally into the character's thoughts.",
    solution: "Organic proverb integration weaves the moral into the character's internal reflection, showing that the story's events directly validate the saying.",
    target: "Narrative Craft: Organic Proverbial Synthesis"
  },
  {
    passage: "What is an 'inquit tag' in direct speech mechanics?",
    question: "Define the term inquit tag:",
    options: [
      "The reporting clause that identifies the speaker and manner of utterance (e.g., 'shouted the captain')",
      "The quotation marks surrounding dialogue",
      "The moral lesson at the end of a narrative",
      "The stage directions in a printed play"
    ],
    answer: "The reporting clause that identifies the speaker and manner of utterance (e.g., 'shouted the captain')",
    hint: "It is the reporting verb and subject that attribute speech to a speaker.",
    solution: "An inquit tag (or dialogue tag) is the reporting clause indicating who spoke and how, such as 'whispered Ama' or 'replied the doctor'.",
    target: "Dialogue Mechanics: Inquit Tag Definition"
  },
  {
    passage: "In a debate opposing the motion 'Social Media Has Done More Harm Than Good,' what should paragraph 1 achieve?",
    question: "Identify the mandatory opening requirement:",
    options: [
      "Deliver the vocative salutations, explicitly state opposition to the motion, and define key terms concisely",
      "Tell a long humorous story about personal phone usage",
      "Apologize for not having scientific statistics",
      "Insult the intelligence of the proposition speakers"
    ],
    answer: "Deliver the vocative salutations, explicitly state opposition to the motion, and define key terms concisely",
    hint: "The first paragraph must anchor the speaker's stance and define terms.",
    solution: "The opening paragraph of a debate speech must formally state the speaker's stance (proposing or opposing) and establish concise operational definitions for the motion.",
    target: "Debate Speech: Stance and Definitions"
  },
  {
    passage: "Which of the following describes an auditory sensory image?",
    question: "Select the auditory descriptive detail:",
    options: [
      "The piercing screech of rusty iron brakes shattered the silence of the night",
      "The western sky was painted in shades of bruised purple and amber",
      "The smooth river pebbles felt cool and slick underfoot",
      "The pungent odor of rotting compost hung heavily in the humid air"
    ],
    answer: "The piercing screech of rusty iron brakes shattered the silence of the night",
    hint: "Auditory imagery appeals to the ear and sound perception.",
    solution: "'Piercing screech of rusty iron brakes' uses sound imagery (pitch, acoustic texture) to engage the reader's auditory sense.",
    target: "Descriptive Writing: Auditory Imagery"
  },
  {
    passage: "A student writes: 'Everyone in Ghana agrees that boarding schools are the best.'",
    question: "What logical flaw is present in this argumentative claim?",
    options: [
      "Hasty generalization and unsupported sweeping assertion",
      "Proper use of empirical statistical evidence",
      "Effective rhetorical understatement",
      "Accurate dialectical refutation"
    ],
    answer: "Hasty generalization and unsupported sweeping assertion",
    hint: "Sweeping claims like 'everyone agrees' lack factual evidence.",
    solution: "Sweeping assertions like 'everyone agrees' commit the fallacy of hasty generalization. Argumentative discourse requires objective, evidence-based reasoning.",
    target: "Argumentative Logic: Avoiding Sweeping Generalizations"
  },
  {
    passage: "When a new speaker begins talking in a narrative composition, what formatting rule must be obeyed?",
    question: "Select the correct paragraphing rule for direct speech dialogue:",
    options: [
      "Start a new paragraph on a fresh line, indented from the margin",
      "Continue writing on the same line using bold text",
      "Enclose the entire page in brackets",
      "Underline every word spoken by the new character"
    ],
    answer: "Start a new paragraph on a fresh line, indented from the margin",
    hint: "New speaker equals new paragraph line.",
    solution: "In standard dialogue mechanics, every shift in speaker requires a brand new paragraph line, maintaining clear narrative speaker boundaries.",
    target: "Dialogue Formatting: Speaker Line Breaks"
  },
  {
    passage: "What is the primary function of the 'peroration' in a competitive speech or article?",
    question: "Define the rhetorical function of a peroration:",
    options: [
      "The impassioned concluding summary and final call to action designed to leave an enduring impression",
      "The opening sentence where the speaker introduces himself",
      "The middle paragraph where statistics are listed",
      "The dictionary definition of contentious words"
    ],
    answer: "The impassioned concluding summary and final call to action designed to leave an enduring impression",
    hint: "It is the powerful closing climax of an address or essay.",
    solution: "The peroration is the concluding section of a speech or essay, synthesizing central arguments into an inspiring, memorable final appeal.",
    target: "Rhetorical Architecture: The Peroration"
  },
  {
    passage: "A student writes: 'The market was noisy, chaotic, and very disorganized.'",
    question: "How can this sentence be revised to create vivid sensory immersion?",
    options: [
      "Shouting market women haggled furiously over baskets of glistening tomatoes while barrow-pushers bellowed for right of way.",
      "The market had plenty noise and was disorganized.",
      "People were making too much noise in the market because it was dirty.",
      "The market was bad and there was confusion everywhere."
    ],
    answer: "Shouting market women haggled furiously over baskets of glistening tomatoes while barrow-pushers bellowed for right of way.",
    hint: "Show, don't tell. Replace generic labels with concrete actions, sounds, and visual details.",
    solution: "The revised version uses concrete sensory verbs ('haggled', 'bellowed') and descriptive nouns ('glistening tomatoes', 'barrow-pushers') rather than abstract adjectives.",
    target: "Descriptive Writing: Show, Don't Tell"
  },
  {
    passage: "Which of the following transitions is best suited to introduce an opposing viewpoint in an argumentative essay?",
    question: "Choose the most appropriate dialectical transition:",
    options: [
      "On the other hand, critics may contend that...",
      "Furthermore, everyone agrees that...",
      "In the first place, I think that...",
      "Finally, let me conclude by saying..."
    ],
    answer: "On the other hand, critics may contend that...",
    hint: "It signals contrast and introduces an alternative point of view.",
    solution: "'On the other hand, critics may contend that...' signals a shift to counter-argumentation, setting up a dialectical refutation.",
    target: "Argumentative Discourse: Dialectical Transitions"
  },
  {
    passage: "A narrative contains the sentence: 'Suddenly, a cold sweat broke out on his forehead, his knees buckled, and his heart pounded like a hammer.'",
    question: "What emotional state is communicated through these physiological symptoms?",
    options: [
      "Intense fear and panic",
      "Great boredom and sleepiness",
      "Uncontrollable happiness",
      "Extreme hunger"
    ],
    answer: "Intense fear and panic",
    hint: "Cold sweat, trembling knees, and racing pulse indicate fear.",
    solution: "Describing physiological symptoms (sweating, trembling knees, rapid heartbeat) effectively conveys visceral terror through bodily action.",
    target: "Narrative Exposition: Physiological Emotion Depiction"
  },
  {
    passage: "In a published article, what is the role of the 'lead paragraph'?",
    question: "Select the primary function of a journalistic lead paragraph:",
    options: [
      "To hook the reader's attention while summarizing the core 5 Ws (Who, What, Where, When, Why)",
      "To list all previous articles written by the author",
      "To state the author's age and hobbies",
      "To thank the printer for publishing the article"
    ],
    answer: "To hook the reader's attention while summarizing the core 5 Ws (Who, What, Where, When, Why)",
    hint: "It introduces the topic engagingly and summarizes the essential facts.",
    solution: "The lead paragraph hooks the audience and outlines the core facts (Who, What, Where, When, Why), establishing the central theme immediately.",
    target: "Articles for Publication: The Lead Paragraph"
  },
  {
    passage: "A candidate writes in a debate: 'My opponent said that day students save money, but she failed to consider the daily cost of transportation.'",
    question: "What rhetorical technique is demonstrated here?",
    options: [
      "Direct rebuttal of an opponent's point",
      "Ad hominem personal attack",
      "Tautological repetition",
      "Spatial description"
    ],
    answer: "Direct rebuttal of an opponent's point",
    hint: "It directly takes an opponent's claim and exposes its flaw.",
    solution: "A direct rebuttal explicitly identifies a premise raised by an opponent and demonstrates its weakness using counter-evidence.",
    target: "Debate Speech: Forensic Rebuttal"
  },
  {
    passage: "Which of the following phrases appeals to the olfactory register?",
    question: "Select the olfactory sensory detail:",
    options: [
      "The sickening stench of decomposing fish and stagnant gutter sludge",
      "The dazzling brilliance of the midday sun on the ocean",
      "The icy chill of mountain stream water on tired feet",
      "The deafening roar of diesel generators in the alley"
    ],
    answer: "The sickening stench of decomposing fish and stagnant gutter sludge",
    hint: "Olfactory relates to smell and odor.",
    solution: "'Sickening stench of decomposing fish and stagnant gutter sludge' engages the sense of smell directly.",
    target: "Descriptive Writing: Olfactory Imagery"
  },
  {
    passage: "In an argumentative essay on road safety, which of the following provides the most persuasive evidence?",
    question: "Select the strongest supporting evidence:",
    options: [
      "Statistical reports from the National Road Safety Authority showing an 80% decrease in accidents where speed ramps were built",
      "The writer's personal feeling that speed ramps look nice on roads",
      "A rumor that drivers dislike speed ramps",
      "A story about a bicycle with a flat tire"
    ],
    answer: "Statistical reports from the National Road Safety Authority showing an 80% decrease in accidents where speed ramps were built",
    hint: "Official statistics and documented facts provide empirical proof.",
    solution: "Empirical data from accredited regulatory bodies carries objective weight, making it far more persuasive than anecdotes or personal feelings.",
    target: "Argumentative Logic: Empirical Evidence"
  },
  {
    passage: "A narrative includes the sentence: 'Kwame dashed out of the room, ran across the compound, and jumped over the low fence.'",
    question: "What grammatical category of words creates the fast-paced action in this sentence?",
    options: [
      "Dynamic action verbs in the past tense ('dashed', 'ran', 'jumped')",
      "Abstract collective nouns",
      "Passive auxiliary verbs",
      "Relative pronouns"
    ],
    answer: "Dynamic action verbs in the past tense ('dashed', 'ran', 'jumped')",
    hint: "Action verbs propel the physical pace of the narrative.",
    solution: "Using a series of dynamic past tense action verbs creates kinetic energy, quickening the narrative tempo during action scenes.",
    target: "Narrative Craft: Dynamic Verb Pacing"
  },
  {
    passage: "What is an 'anaphora' in speech writing?",
    question: "Define the rhetorical device known as anaphora:",
    options: [
      "The deliberate repetition of a word or phrase at the beginning of successive sentences for oratorical emphasis",
      "A sentence that contains no adjectives",
      "A question that requires an immediate spoken answer",
      "The alphabetical arrangement of arguments"
    ],
    answer: "The deliberate repetition of a word or phrase at the beginning of successive sentences for oratorical emphasis",
    hint: "Think of Martin Luther King Jr.'s 'I have a dream' repeated across paragraphs.",
    solution: "Anaphora is the repetition of opening words across successive clauses (e.g., 'We shall fight... We shall defend...'), creating rhythmic emotional power.",
    target: "Rhetorical Devices: Anaphora"
  },
  {
    passage: "Why is the conclusion of an article for publication called a 'call to action'?",
    question: "State the purpose of a call to action:",
    options: [
      "It challenges society, government, or readers to implement concrete solutions to resolve the issue",
      "It demands that the reader write a personal letter to the author",
      "It tells the reader to stop reading immediately",
      "It gives the author's personal phone number"
    ],
    answer: "It challenges society, government, or readers to implement concrete solutions to resolve the issue",
    hint: "It urges the audience to act on the problem discussed.",
    solution: "A call to action moves beyond mere complaint, mobilizing stakeholders (parents, municipal authorities, youth) to take concrete steps toward reform.",
    target: "Articles for Publication: Call to Action"
  },
  {
    passage: "A candidate writing a narrative uses the phrase: 'The old rusty gate screeched like a wounded animal.'",
    question: "What figurative device is used to enhance the auditory description?",
    options: [
      "Simile",
      "Metaphor",
      "Personification only",
      "Oxymoron"
    ],
    answer: "Simile",
    hint: "The comparison uses the connective word 'like'.",
    solution: "Comparing the sound of the screeching gate to a wounded animal using 'like' constitutes a vivid auditory simile.",
    target: "Descriptive Writing: Simile"
  },
  {
    passage: "In an argumentative essay, what is the 'thesis statement'?",
    question: "Define the thesis statement in argumentative composition:",
    options: [
      "The single, central claim or position that the entire essay aims to prove and defend",
      "The dictionary definition of the title words",
      "The final sentence where the writer signs his name",
      "The opening pleasantry enquiring about the reader's health"
    ],
    answer: "The single, central claim or position that the entire essay aims to prove and defend",
    hint: "It is the core argument of the essay.",
    solution: "The thesis statement articulates the author's primary stance and scope in sentence 1 or 2, providing a roadmap for the subsequent arguments.",
    target: "Argumentative Discourse: Thesis Formulation"
  },
  {
    passage: "A student writes: 'The thunder roared, the wind howled, and the rain lashed against the windows.'",
    question: "What figurative device gives human or animal characteristics to inanimate nature here?",
    options: [
      "Personification",
      "Hyperbole",
      "Litotes",
      "Euphemism"
    ],
    answer: "Personification",
    hint: "Thunder 'roaring', wind 'howling', and rain 'lashing' give living traits to weather.",
    solution: "Attributing animate actions (roaring, howling, lashing) to weather elements personifies the storm, heightening atmospheric drama.",
    target: "Descriptive Craft: Personification"
  },
  {
    passage: "Why must a debate speech end with a courteous thank-you to the assembly?",
    question: "State the rule of debate valediction:",
    options: [
      "Parliamentary protocol requires the speaker to acknowledge and thank the audience and judges for their audience",
      "It is an informal apology for speaking too long",
      "It is only done if the speaker makes a mistake",
      "It replaces the entire final paragraph"
    ],
    answer: "Parliamentary protocol requires the speaker to acknowledge and thank the audience and judges for their audience",
    hint: "Ending with 'Thank you' shows parliamentary respect.",
    solution: "Debate speeches conclude with a formal expression of gratitude ('Thank you, Mr. Chairman and assembly') to respect the house and adjudication panel.",
    target: "Debate Speech: Valedictory Courtesy"
  },
  {
    passage: "A candidate writes: 'The girl was very beautiful, fair, and pretty.'",
    question: "How should this weak descriptive sentence be improved under WAEC expression standards?",
    options: [
      "Her almond-shaped eyes sparkled beneath gracefully arched eyebrows, complementing her radiant complexion.",
      "She was fine and very beautiful indeed.",
      "The girl was too pretty to behold in words.",
      "She looked fine like an angel in town."
    ],
    answer: "Her almond-shaped eyes sparkled beneath gracefully arched eyebrows, complementing her radiant complexion.",
    hint: "Replace abstract labels with specific physical details.",
    solution: "Vivid character description focuses on specific facial features, expressions, and textures rather than piling up empty synonyms like 'beautiful, fair, and pretty'.",
    target: "Descriptive Writing: Specific Character Details"
  },
  {
    passage: "What is the structural consequence of failing to include a headline in an article for publication?",
    question: "How is a missing headline penalized under WAEC marking rubrics?",
    options: [
      "A mandatory mark deduction under Organization for omitting a required structural feature",
      "Immediate disqualification of the candidate",
      "A deduction under Mechanical Accuracy only",
      "No penalty is applied if the body is well written"
    ],
    answer: "A mandatory mark deduction under Organization for omitting a required structural feature",
    hint: "Headlines are mandatory structural elements of articles.",
    solution: "An article without a headline is structurally incomplete, incurring an automatic deduction under the Organization rubric.",
    target: "WAEC Rubrics: Organization Deductions"
  },
  {
    passage: "In a narrative essay, why is 'dialogue' valuable?",
    question: "Identify the narrative value of direct speech dialogue:",
    options: [
      "It reveals character personality, accelerates conflict pacing, and adds lifelike authenticity to scenes",
      "It allows the writer to avoid writing full paragraphs",
      "It increases the word count without thinking",
      "It replaces the need for an ending"
    ],
    answer: "It reveals character personality, accelerates conflict pacing, and adds lifelike authenticity to scenes",
    hint: "Dialogue makes characters feel real and advances the plot.",
    solution: "Direct speech breaks monotonous narration, reveals personality and social dynamics through authentic voices, and heightens tension during scenes.",
    target: "Narrative Craft: Function of Dialogue"
  },
  {
    passage: "Which of the following transitions indicates a causal relationship between arguments?",
    question: "Select the causal connective word:",
    options: [
      "Consequently",
      "Simultaneously",
      "Nevertheless",
      "Admittedly"
    ],
    answer: "Consequently",
    hint: "'Consequently' means 'as a result of'.",
    solution: "'Consequently' functions as a causal conjunctive adverb, demonstrating that the subsequent point directly results from the preceding premise.",
    target: "Discourse Markers: Causal Connectives"
  },
  {
    passage: "A student ends an argumentative essay with: 'In conclusion, the evidence unequivocally demonstrates that vocational education is the backbone of national development.'",
    question: "What makes this conclusion effective?",
    options: [
      "It provides a clear synthesis of the thesis with confident, elevated vocabulary",
      "It introduces three brand new arguments not mentioned earlier",
      "It apologizes for any grammatical errors in the essay",
      "It asks the examiner to award full marks"
    ],
    answer: "It provides a clear synthesis of the thesis with confident, elevated vocabulary",
    hint: "It synthesizes the central claim firmly and professionally.",
    solution: "An effective conclusion reinforces the thesis with authority, synthesizing the core argument without repeating body sentences verbatim.",
    target: "Argumentative Closings: Synthesis"
  },
  {
    passage: "Under the 30-mark WAEC Paper 2 rubric, how are marks distributed across the four evaluation dimensions?",
    question: "Identify the standard mark allocation:",
    options: [
      "Content: 10 marks, Organization: 5 marks, Expression: 10 marks, Mechanical Accuracy: 5 marks",
      "Content: 15 marks, Organization: 5 marks, Expression: 5 marks, Mechanical Accuracy: 5 marks",
      "Content: 10 marks, Organization: 10 marks, Expression: 5 marks, Mechanical Accuracy: 5 marks",
      "Content: 5 marks, Organization: 5 marks, Expression: 15 marks, Mechanical Accuracy: 5 marks"
    ],
    answer: "Content: 10 marks, Organization: 5 marks, Expression: 10 marks, Mechanical Accuracy: 5 marks",
    hint: "Content and Expression carry 10 marks each; Organization and MA carry 5 marks each.",
    solution: "The standard WAEC Paper 2 continuous writing rubric weights compositions as: Content (10), Organization (5), Expression (10), and Mechanical Accuracy (5), totaling 30 marks.",
    target: "WAEC Rubrics: Four-Tier Distribution"
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
  }
];

// =========================================================================
// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)
// Basic 9 Foundation Scaffolds & Model Compositions (~250 words each)
// Covering: Narrative Moral Stories, Sensory Travelogues, Articles & Debates
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Narrative: Illustrating 'A Bird in Hand Is Worth Two in the Bush'
  {
    id: "B9_S4_E_F_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Narrative Essay",
    title: "Chasing Illusions",
    shortSummary: "Write a narrative story illustrating the proverb: 'A bird in hand is worth two in the bush.'",
    prompt: "Write a story that illustrates the truth of the proverb: 'A bird in hand is worth two in the bush.' Narrate how an ambitious junior high school leaver abandoned a secure apprenticeship and a confirmed senior high school scholarship to pursue speculative promises of quick overseas travel, only to lose both opportunities.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Decision Arc, Speculative Hubris Pacing & Organic Proverb Integration",
    learningCompetency: "B9.4.2.1.1: Compose coherent narrative compositions illustrating moral proverbs through contrasting choices, rising adversity, and ethical resolution.",
    hint: "Establish the protagonist's confirmed opportunity early. Show the temptation of the speculative promise, the reckless abandonment of what was secure, and the bitter ending.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Mirage of Golden Promises",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing confirmed opportunity, speculative temptation, financial swindle, and moral awakening.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Confirmed Opportunity", guidingQuestion: "Introduce fifteen-year-old Kwabena receiving a full scholarship to study Technical Engineering at a renowned institute.", transitionHints: ["Following the release of the BECE results in Obuasi, fifteen-year-old Kwabena celebrated a dream breakthrough...", "He had secured an all-expenses-paid scholarship to study Mechanical Engineering, with classes scheduled to begin in two weeks..."] },
          { stageIndex: 2, role: "Inciting Incident & The Speculative Mirage", guidingQuestion: "Describe a smooth-talking travel agent promising instant overseas football contracts in Europe in exchange for his scholarship fund.", transitionHints: ["The disruption came when a self-proclaimed football scout named Morgan arrived in town...", "\"Why waste three years in technical school when I can fly you to a professional football academy in Spain?\" he whispered seductively..."] },
          { stageIndex: 3, role: "Rising Action & The Reckless Surrender", guidingQuestion: "Narrate Kwabena forfeiting his scholarship deadline and handing over his family's savings to the agent.", transitionHints: ["Blinded by visions of European football fame, Kwabena rejected his principal's counsel and forfeited his scholarship registration...", "He convinced his mother to surrender her modest savings to pay for fictitious visa processing fees..."] },
          { stageIndex: 4, role: "Climax, Ruin & Proverbial Realization", guidingQuestion: "Describe discovering the agent's office deserted, the scholarship forfeited, and realizing the proverb in tears.", transitionHints: ["When Kwabena arrived at the airport transit office with his packed bag, the building was locked and the agent's phone switched off...", "Standing on the rain-swept pavement penniless with his scholarship lost, he learned the bitter truth: a bird in hand is worth two in the bush..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Resolution & Moral Aphorism",
        proverbOrClosingPhrase: "A bird in hand is worth two in the bush.",
        integrationRule: "Embed the proverb organically into Kwabena's final realization on the deserted pavement."
      }
    },
    rubric: createWAECRubric(
      ["Confirmed scholarship baseline and character ambition established (2 marks)", "Tempting agent proposition and forfeiture of certainty depicted vividly (4 marks)", "Swindle climax, total loss, and organic proverb integration (4 marks)"],
      ["Character context clear", "Temptation depicted vividly", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and emotional adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Mirage of Golden Promises\n_______________________________\n\nFollowing the release of the Basic Education Certificate Examination results in Obuasi, fifteen-year-old Kwabena stood on the threshold of a brilliant future. He had scored aggregate seven and secured a fully funded scholarship from a mining conglomerate to study Electrical Engineering at a prestigious technical secondary school. His parents were overjoyed, and his enrollment forms were duly processed, awaiting final registration on Monday morning.\n\nHowever, on Saturday evening, an alluring temptation derailed his judgment. A flamboyant stranger named Morgan arrived at his father's house, claiming to be an international soccer scout representing European academies. Spotting Kwabena's natural athletic frame, Morgan made an intoxicating proposal: \"Why spend three years reading technical books when I can secure you an immediate professional soccer contract in Spain? All you need is the three thousand cedis your parents set aside for your technical school equipment to process an emergency transit visa.\"\n\nBlinded by dreams of instant European luxury and global fame, Kwabena refused to listen to his mother's cautious pleas. He threw a tantrum, announced that technical school was for ordinary people, and pressured his mother into handing over the cash. On Monday morning, instead of reporting to the technical school to finalize his scholarship registration, Kwabena boarded a bus to Accra with his packed luggage, confident that a flight to Madrid awaited him.\n\nThe devastating truth struck him like a sledgehammer at the capital's bus terminal. The registered address Morgan provided was an empty, dilapidated warehouse with padlocked doors. When Kwabena dialed the scout's phone number, an automated voice repeated coldly that the line was out of service. Sinking onto his suitcase in the pouring rain, he called his former school principal, only to learn that his scholarship had been reassigned to another deserving candidate on the waiting list. Penniless, stranded, and stripped of both his education and his dreams, Kwabena wept bitter tears of remorse. He had learned the hardest lesson of his youth: truly, a bird in hand is worth two in the bush.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Descriptive: A Memorable Visit to the Kakum National Park Canopy Walkway
  {
    id: "B9_S4_E_F_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Descriptive Essay",
    title: "Walking on Air in Kakum Forest",
    shortSummary: "Write a descriptive essay recreating the sensory sights, heights, and emotions of walking on the Kakum canopy walkway.",
    prompt: "Your school organized a graduation excursion to the Kakum National Park in the Central Region. Write a descriptive essay recreating your journey across the suspended rope canopy walkway, vividly depicting the humid forest floor, the dizzying height forty meters aloft, the swaying rope bridges, and the panoramic ocean of green leaves.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Spatial Height Progression, Multi-Sensory Rainforest Imagery & Kinesthetic Adrenaline",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions recreating natural monuments through spatial elevation, tactile and kinesthetic registers, and evocative aesthetic reflection.",
    hint: "Use spatial progression: the hike up the damp rainforest trail, stepping onto the swaying wooden planks, looking down into the green abyss, and the triumphant finish on the final platform.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "A Walk Among the Tree Crowns",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression from the damp forest floor up onto the forty-meter suspended canopy walkway.",
        stagePrompts: [
          { stageIndex: 1, role: "The Forest Trail Ascent", guidingQuestion: "Describe trekking along the steep, humid forest footpath through towering mahogany and silk cotton trees.", transitionHints: ["The journey into the ancient heart of Kakum National Park began with a demanding hike...", "Massive buttress roots crossed the damp footpath like slumbering pythons, while the air hung heavy with..."] },
          { stageIndex: 2, role: "Stepping onto the Rope Bridge (Kinesthetic Fear)", guidingQuestion: "Describe stepping onto the narrow wooden planks of the suspension bridge forty meters above the ground.", transitionHints: ["Emerging onto the timber staging platform, my breath caught in my throat...", "Suspended forty meters aloft by steel cables and wire netting, the narrow wooden bridge swayed with every tentative footstep..."] },
          { stageIndex: 3, role: "The Canopy Vista (Visual & Auditory)", guidingQuestion: "Depict the panoramic ocean of rolling green treetops, flying hornbills, and the distant forest floor.", transitionHints: ["Looking outward, the world was an endless, rolling ocean of shimmering emerald and olive foliage...", "High above the ground, the wind whispered through the tree crowns, while colorful hornbills swooped..."] },
          { stageIndex: 4, role: "The Final Platform & Triumphant Reflection", guidingQuestion: "Describe reaching solid ground, the rush of relief, and marveling at Ghana's virgin rainforest heritage.", transitionHints: ["Stepping onto solid ground at the final tree platform, an exhilarating rush of triumph washed over me...", "Gazing back at the seven swinging bridges, I stood in awe of the ancient rainforest that protects our planet..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Aesthetic Reflection",
        proverbOrClosingPhrase: "The rainforest is the sacred breathing lung of the earth.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating environmental conservation."
      }
    },
    rubric: createWAECRubric(
      ["Rainforest trail and ascent established (2 marks)", "Kinesthetic fear, swaying bridge, and sensory heights conveyed vividly (4 marks)", "Canopy panoramas, birdlife, and environmental reflection captured (4 marks)"],
      ["Setting established", "Height and swaying motion vivid", "Rainforest vistas detailed"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial progression (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified travelogue perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Spatial progression clear"],
      ["Rich sensory and kinesthetic vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Kinesthetic words active", "Apt figurative devices", "Varied sentence patterns"]
    ),
    modelAnswer: `A Walk Among the Tree Crowns\n_____________________________\n\nThe journey into the ancient tropical heart of Kakum National Park began with a demanding, sweat-drenched hike through virgin rainforest. Massive buttress roots of centuries-old mahogany and silk cotton trees snaked across the rocky red footpath like giant slumbering pythons. The humid air was thick with the rich, earthy fragrance of decomposing leaves and aromatic tree sap. High above our heads, the dense, interwoven foliage formed an emerald cathedral roof that filtered the fierce afternoon sun into cool, dancing jade shadows.\n\nEmerging onto the timber staging platform, my pulse spiked with sudden adrenaline. Before us stretched the legendary canopy walkway: a series of seven narrow rope-and-cable bridges suspended forty meters above the forest floor. Stepping onto the first span, an acute wave of vertigo seized my chest. The walkway, barely two handspans wide, bounced and pitched with every nervous step. Clinging to the taut nylon safety nets with sweating fingers, I glanced down through the gaps in the wooden planks into a dizzying green abyss where giant ferns on the forest floor appeared as tiny as moss.\n\nYet, as our group advanced across the swaying spans, terror gradually gave way to pure wonder. Suspended amid the clouds, the perspective was nothing short of magical. In every direction, the rainforest rolled across the mist-shrouded hills like a boundless ocean of emerald and olive waves. Yellow-casqued hornbills glided effortlessly below our feet, their rhythmic wingbeats humming in the breezy mountain air, while orchids and flowering lianas draped the ancient branches like royal tapestries.\n\nStepping off the final platform onto the firm mountain ridge, an exhilarating wave of triumph washed over my trembling limbs. Gazing back across the dizzying network of suspension bridges swaying in the wind, I felt humbled by the untamed grandeur of Ghana's natural heritage. Kakum is not merely a tourist destination; it is the living, breathing green soul of our nation.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Article for Publication: The Menace of Galamsey on Drinking Water
  {
    id: "B9_S4_E_F_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Article for Publication",
    title: "Saving Our Rivers from the Galamsey Menace",
    shortSummary: "Write an article for publication in a national newspaper on illegal mining poisoning public water sources.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'The Scourge of Illegal Mining on Our Freshwater Bodies.' Analyze how alluvial gold mining has turned major rivers like the Pra, Birim, and Ankobra into toxic yellow mud, explain the soaring cost of water treatment for urban consumers, and propose two statutory solutions to eradicate the menace.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Water Resource Analysis & Statutory Policy Proposals",
    learningCompetency: "B9.4.2.1.2: Compose structured articles for publication analyzing freshwater ecological crises, municipal utility costs, and statutory mining enforcement.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, water turbidity analysis, economic utility costs, and statutory solutions.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "THE SCOURGE OF ILLEGAL MINING ON OUR FRESHWATER BODIES",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Richmond Asare, Basic 9A",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> River Turbidity & Chemical Poisoning -> Utility Tariffs & Water Shortages -> Statutory Demilitarization & Drone Enforcement).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and declare that water is life, yet Ghana's river basins are being poisoned for gold.", transitionHints: ["Water is the primal essence of human existence and civilization, yet across Ghana today...", "A catastrophic ecological crime—unregulated alluvial gold mining, popularly known as 'galamsey'—is poisoning our freshwater lifelines..."] },
          { stageIndex: 2, role: "Turbidity & Heavy Metal Pollution", guidingQuestion: "Analyze how hydraulic excavators and floating 'changfa' platforms have turned pristine rivers into thick yellow toxic mud.", transitionHints: ["Major river basins like the Pra, Offin, Birim, and Ankobra have lost their natural clarity...", "Floating washing platforms dump thousands of tons of silt, mercury, and cyanide directly into riverbeds daily, wiping out aquatic life..."] },
          { stageIndex: 3, role: "Economic Costs & Public Health Crises", guidingQuestion: "Explain the soaring cost of water treatment for the Ghana Water Company and resulting municipal tap shutoffs.", transitionHints: ["The repercussions on urban households and public health are alarming...", "The Ghana Water Company Limited now spends three times its normal budget on chemical coagulants simply to clarify mud, forcing tariffs to soar..."] },
          { stageIndex: 4, role: "Statutory Enforcement & Call to Action", guidingQuestion: "Propose two actionable solutions (declaring a 100-meter river buffer zone and drone-guided military taskforce raids) with an urgent civic appeal.", transitionHints: ["To halt this descent into national ecological suicide, the state must take uncompromising action...", "First, Parliament must enact statutory legislation declaring a permanent 100-meter buffer zone along all rivers, backed by drone patrols to..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Civic Appeal",
        proverbOrClosingPhrase: "Water is life; to poison our rivers is to sign our own death warrant.",
        integrationRule: "End with an inspiring appeal urging citizens and leaders to protect Ghana's water bodies."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and freshwater poisoning crisis established (2 marks)", "Turbidity, heavy metals, and utility tariff inflation analyzed (4 marks)", "Two actionable statutory enforcement solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Ecological and economic costs detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental and utility vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `THE SCOURGE OF ILLEGAL MINING ON OUR FRESHWATER BODIES\nBy Richmond Asare, Basic 9A\n\nWater is the indispensable foundation of human survival, public health, and industrial civilization. Yet, across Ghana today, our most precious natural lifelines are under brutal, suffocating assault. A relentless wave of unregulated alluvial gold mining, popularly termed 'galamsey,' has transformed our historic freshwater river systems into toxic, sluggish corridors of liquid mud, pushing our nation toward an unprecedented water security catastrophe.\n\nThe scale of this devastation is horrific. Rivers that sustained generations with clean drinking water and fresh fish—including the Pra, Birim, Offin, and Ankobra—have completely lost their natural aquatic balance. Fleets of commercial excavators and floating diesel-powered washing platforms known as 'changfa' churn riverbeds day and night, stripping protective bank vegetation and dumping heavy industrial silt into the current. Even more terrifying is the unregulated release of lethal chemicals; miners use toxic mercury and cyanide to amalgamate gold flakes, poisoning water tables and wiping out riverine ecosystems.\n\nThe socio-economic fallout has hit urban and rural citizens with equal ferocity. The Ghana Water Company Limited has repeatedly sounded the alarm that several regional water treatment plants are on the verge of total shutdown due to extreme turbidity levels. The utility now expends millions of cedis on importing specialized aluminum sulfate and chemical coagulants simply to clarify mud, forcing water tariffs to skyrocket for struggling households. In cities like Cape Coast and Sekondi-Takoradi, municipal taps regularly run dry for weeks, forcing basic school pupils to miss morning classes while carrying buckets in search of well water.\n\nTo preserve our nation from drying up, the government must abandon temporary taskforces and enforce permanent, military-grade solutions. First, Parliament must pass emergency legislation declaring a permanent one-hundred-meter exclusion zone along all riverbanks where all mineral prospecting is treasonable. Second, the military and national security agencies must deploy 24-hour thermal drone surveillance along forest river corridors to identify and confiscate all dredging barges on sight. Water is life; to poison our rivers for a few ounces of gold is to sign our collective death warrant.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Debate: Day Schools vs. Boarding Schools (Supporting Boarding Schools)
  {
    id: "B9_S4_E_F_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Debate Speech",
    title: "Boarding Schools Cultivate Superior Discipline and Academic Focus",
    shortSummary: "Speak in support of the motion that boarding schools provide a superior educational environment compared to day schools.",
    prompt: "You are the principal speaker in an inter-schools debate competition on the motion: 'Boarding Junior High Schools Provide a Superior Learning and Disciplinary Environment Than Day Schools.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding enforced evening study prep and self-reliance, while refuting opposing claims on parental affection.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B9.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on mandatory study prep, eliminating commuting fatigue, and cultivating self-reliance. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that Boarding Junior High Schools provide a vastly superior learning and disciplinary environment than Day Schools.",
        prohibitedOpenings: ["Good morning to you all", "I am here to tell you"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Enforced Structured Study Prep -> Eradicating Commuting Fatigue & Cultivating Independence -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with resolute passion today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Structured Daily Routine & Enforced Prep", guidingQuestion: "Explain how boarding schools enforce strict daily study hours from 6:30 p.m. to 8:30 p.m., eliminating home distractions.", transitionHints: ["First and foremost, academic excellence is forged in structured routine...", "In a boarding school, every single hour is governed by clockwork discipline—from dawn inspection to mandatory evening study prep where..."] },
          { stageIndex: 3, role: "Second Argument: Eliminating Commuting Fatigue & Fostering Independence", guidingQuestion: "Contrast day students wasting two hours in traffic with boarders who walk two minutes to class and learn self-reliance.", transitionHints: ["Secondly, consider the devastating physical and mental toll of daily commuting on day pupils...", "While day students arrive at school exhausted after battling two hours of traffic and evening chores, boarders walk two minutes from the dormitory to the library..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on parental warmth, deliver an inspiring closing appeal, and say thank you.", transitionHints: ["My worthy opponents will argue emotionally that day schools preserve family bonding; however, this claim collapses because...", "With these undeniable facts, I urge you all to vote resoundingly in favor of the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Discipline and structured focus are the forge in which academic champions are made.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Enforced evening study routine argument developed cogently (4 marks)", "Commuting fatigue elimination and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Boarding Junior High Schools Provide a Superior Learning and Disciplinary Environment Than Day Schools.\"\n\nFirst and foremost, academic distinction is forged within the furnace of structured, unbroken discipline. In a well-administered boarding institution, a learner's entire day operates with military precision. From the ringing of the rising bell at 5:00 a.m. through morning inspection, classes, and mandatory two-hour silent evening study prep, every hour is optimized for intellectual development. Boarders are shielded from the chaotic domestic distractions that sabotage day pupils: television soap operas, endless video games, noisy neighborhood taverns, and domestic errands. Supervised by resident housemasters, boarders complete homework on schedule, master library research, and participate in peer study syndicates. Is it any surprise that top-tier boarding institutions dominate national BECE honors?\n\nSecondly, boarding education eliminates the crushing physical and mental exhaustion of daily commuting. In our bustling urban and rural centers, day students waste up to four grueling hours daily fighting for space in commercial minibuses or trekking long distances in the scorching sun. They arrive in the classroom drained of energy, and return home too exhausted to open a textbook. Boarders, conversely, live two minutes from their classrooms! Furthermore, boarding life cultivates lifelong self-reliance. Boarders learn to wash their own uniforms, manage their pocket money, scrub their living quarters, and live harmoniously with peers from diverse ethnic backgrounds, molding them into resilient, independent leaders.\n\nMy worthy opponents will argue emotionally that day schools preserve parental affection and family guidance. While home love is noble, modern economic realities dismantle their argument! In contemporary Ghana, many parents leave home before dawn and return late at night, leaving adolescents unmonitored during the most vulnerable hours of the day. In contrast, boarding schools provide round-the-clock pastoral supervision.\n\nMr. Chairman, discipline and structured focus are the forge in which academic champions are created. I urge this house to reject sentiment and vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Narrative: Illustrating 'Pride Goes Before a Fall'
  {
    id: "B9_S4_E_F_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Narrative Essay",
    title: "The Humiliation of the Arrogant Prefect",
    shortSummary: "Write a narrative story illustrating the proverb: 'Pride goes before a fall.'",
    prompt: "Write a story that illustrates the truth of the proverb: 'Pride goes before a fall.' Narrate how an intellectually brilliant but arrogant senior prefect ridiculed his peers and neglected mock revision, only to suffer public academic humiliation when the trial BECE mock examination results were announced.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Hubris Arc, Academic Conflict Pacing & Organic Proverb Integration",
    learningCompetency: "B9.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through hubris, neglected preparation, and dramatic public humbling.",
    hint: "Establish the student's brilliant intellect and overbearing arrogance. Show his refusal to participate in group study, his careless examination performance, and the shocking assembly humiliation.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Downfall of Arrogance",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing intellectual arrogance, neglected revision, examination failure, and public moral realization.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Character Hubris", guidingQuestion: "Introduce brilliant senior school prefect Daniel, whose academic prowess had inflated his ego to unbearable heights.", transitionHints: ["In St. John's Junior High School, fifteen-year-old Daniel was recognized as a generational mathematics prodigy...", "Having maintained the top position in every termly examination, his undeniable intellect had unfortunately bred a toxic, overbearing arrogance..."] },
          { stageIndex: 2, role: "Inciting Incident & Mocking Peer Study", guidingQuestion: "Describe Daniel publicly ridiculing a peer study group formed by his classmates ahead of the regional mock exams.", transitionHints: ["When the final BECE trial mock examinations approached, classmates formed an afternoon study syndicate...", "\"Group study is a crutch for mediocre minds who need collective help to pass,\" Daniel mocked openly, boasting that he could score aggregate six without opening a book..."] },
          { stageIndex: 3, role: "The Mock Examination Climax", guidingQuestion: "Narrate the examination hall scene where Daniel answered questions carelessly and walked out early, while peers worked diligently.", transitionHints: ["During the three-hour mathematics paper, Daniel scribbled answers with careless speed and strolled out thirty minutes early...", "However, the questions were set on the newly revised Common Core curriculum, requiring rigorous step-by-step proofs that he had dismissed..."] },
          { stageIndex: 4, role: "Denouement, Assembly Humiliation & Proverbial Realization", guidingQuestion: "Describe the Headmaster reading the mock results on assembly, Daniel's shocking failure, and the bitter lesson learned.", transitionHints: ["The moment of reckoning arrived during Monday morning general assembly...", "Standing on the dais expecting honors, his jaw dropped as the Headmaster announced that the diligent study syndicate swept the top ranks, while Daniel plummeted to twenty-fifth place, proving: pride goes before a fall..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Moral Synthesis",
        proverbOrClosingPhrase: "Pride goes before a fall.",
        integrationRule: "Embed the proverb into Daniel's internal reflection on the assembly grounds."
      }
    },
    rubric: createWAECRubric(
      ["Intellectual brilliance and boastful character established (2 marks)", "Mocking peer study and careless examination performance depicted vividly (4 marks)", "Assembly humiliation, shocking failure, and organic proverb integration (4 marks)"],
      ["Character arrogance clear", "Examination hubris shown", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and psychological adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Downfall of Arrogance\n__________________________\n\nAt St. John's Junior High School, fifteen-year-old Daniel was celebrated as an intellectual prodigy. He had swept every subject prize in Basic 7 and Basic 8, solving complex algebraic equations with effortless speed. Regrettably, his undeniable talent had inflated his ego to insufferable heights. Appointed as the Senior School Prefect, Daniel swaggered across the compound with disdain, treating his struggling classmates as intellectual inferiors and rebuffing anyone who asked him for academic assistance.\n\nAs the crucial regional BECE trial mock examinations drew near, his classmates formed an after-school revision syndicate to review past Chief Examiners' reports. When they invited Daniel to lead their discussions, he laughed scornfully. \"Group study is a pathetic crutch for mediocre minds who need collective assistance to survive,\" he declared loudly in the corridor. \"A genius like me does not need to sweat over past questions; I could write the BECE in my sleep and still score straight grade ones!\" While his peers spent four hours every evening working through challenging geometry and chemical equations, Daniel spent his time playing computer games.\n\nHis moment of reckoning arrived during the regional trial examinations. The papers, set by seasoned external examiners on the newly implemented Common Core curriculum, placed immense emphasis on practical application, rigorous step-by-step geometric proofs, and analytical essay reasoning. Overconfident, Daniel breezed through the questions, scribbled brief, unverified answers without showing his workings, and strolled out of the examination hall forty minutes early, casting a mocking smirk at his sweating classmates.\n\nOn Monday morning, the entire school assembled under the central pavilion as the Headmaster unsealed the certified regional results. Daniel stepped toward the front row, a triumphant smile already plastered across his face. Then, the Headmaster cleared his throat and spoke into the microphone: \"Hard work and humility always defeat complacent talent. I am proud to announce that the four members of our peer study syndicate swept the top regional honors!\" The pavilion erupted in thunderous applause. But as the Headmaster read down the ranking sheet, Daniel's name was nowhere near the top. Having lost critical marks for omitting working steps and misinterpreting questions, Daniel had plummeted to an embarrassing twenty-fifth position in the class!\n\nA suffocating wave of heat washed over Daniel's cheeks as the entire student body turned to stare at him in stunned silence. Looking at his trembling hands, the ground seemed to open beneath his feet. His boastful arrogance had been exposed before the entire community. He had learned the bitter, ancient truth the hardest way: truly, pride goes before a fall.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Descriptive: The Grand Durbar of Chiefs During an Annual Festival
  {
    id: "B9_S4_E_F_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Descriptive Essay",
    title: "The Golden Durbar of Kings",
    shortSummary: "Write a descriptive essay recreating the visual magnificence, musketry, and drumming of an Akwasidae durbar.",
    prompt: "You attended the grand Akwasidae festival durbar at the Manhyia Palace in Kumasi. Write a descriptive essay recreating the visual majesty of the Paramount Chief's kente regalia, the gleaming gold ornaments, the deafening roar of musketry, and the poetic rhythms of the fontomfrom drums.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Cultural Royalty Description, Auditory Regal Pacing & Spatial Grandeur",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions capturing traditional royal pageantry through rich sensory registers, regal vocabulary, and spatial progression.",
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
  },

  // 57. Article for Publication: The Menace of Single-Use Plastics
  {
    id: "B9_S4_E_F_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Article for Publication",
    title: "Choked in Plastic: Reclaiming Our Environment",
    shortSummary: "Write an article for publication in a national daily on single-use plastics choking marine ecosystems and municipal gutters.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'Choked in Plastic: The Urgent Need to Ban Single-Use Plastics in Ghana.' Analyze how discarded water sachets and polythene carrier bags choke municipal drainage networks, destroy marine life along the Atlantic coast, and recommend two statutory policy solutions to phase out non-biodegradable plastics.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Marine Ecological Analysis & Legislative Proposals",
    learningCompetency: "B9.4.2.1.2: Compose structured articles for publication analyzing non-biodegradable environmental waste, urban drainage collapse, and statutory plastic bans.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, drainage and marine destruction, economic fallout, and legislative solutions.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "CHOKED IN PLASTIC: THE URGENT NEED TO BAN SINGLE-USE PLASTICS IN GHANA",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Francisca Mensah, Basic 9A",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Drainage Clogging & Urban Floods -> Marine Ecology Destruction -> Statutory Bans & Biodegradable Alternatives).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and declare that Ghana is suffocating beneath an unbroken blanket of single-use plastic waste.", transitionHints: ["Walk through any market, beach, or street corner in Ghana today, and a heartbreaking spectacle unfolds...", "An unbroken tide of single-use plastic water sachets and black polythene carrier bags blankets our cities, turning urban centers into eyesores..."] },
          { stageIndex: 2, role: "Drainage Clogging & Deadly Floods", guidingQuestion: "Analyze how discarded non-biodegradable plastics choke concrete storm drains, triggering catastrophic annual flash floods.", transitionHints: ["Because petroleum-based plastics require hundreds of years to decompose, they accumulate relentlessly in gutters...", "During heavy downpours, these plastic dams choke stormwater channels, causing floods that submerge homes and claim lives..."] },
          { stageIndex: 3, role: "Marine Ecology & Microplastic Poisoning", guidingQuestion: "Examine how tons of plastic waste wash into the Atlantic ocean, suffocating sea turtles and entering the human food chain.", transitionHints: ["Beyond our cities, this plastic deluge empties directly into the Atlantic Ocean...", "Marine biologists report that sea turtles choke to death mistaking plastic bags for jellyfish, while toxic microplastics enter the fish we consume daily..."] },
          { stageIndex: 4, role: "Statutory Ban & Biodegradable Solutions", guidingQuestion: "Propose two actionable solutions (a phased national ban on thin plastic bags and tax incentives for cassava-starch biodegradable alternatives).", transitionHints: ["To rescue our land and sea, the government must abandon cosmetic cleanup exercises and enact bold legislation...", "Parliament must enact an outright statutory ban on single-use plastics, while offering tax holidays to local manufacturing firms producing cassava-starch bags..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & National Call",
        proverbOrClosingPhrase: "The earth does not belong to us; we hold it in trust for generations unborn.",
        integrationRule: "End with an inspiring appeal urging citizens and policymakers to eliminate plastic pollution."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and single-use plastic crisis established (2 marks)", "Drainage clogging floods and marine destruction analyzed (4 marks)", "Two actionable legislative solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Ecological fallout detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental and policy vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `CHOKED IN PLASTIC: THE URGENT NEED TO BAN SINGLE-USE PLASTICS IN GHANA\nBy Francisca Mensah, Basic 9A\n\nA stroll through any commercial market, coastal beach, or residential suburb in Ghana reveals a heartbreaking environmental tragedy: a suffocating blanket of discarded single-use plastic carrier bags, food wrappers, and water sachets. What was once celebrated as a modern convenience has metastasized into the most destructive ecological crisis of our era, turning our historic towns into unsightly dumps and suffocating our ecosystems.\n\nThe immediate consequence of this plastic deluge is the total paralysis of our urban drainage infrastructure. Because petroleum-based plastics are non-biodegradable and take over four centuries to decompose, they accumulate relentlessly in open concrete gutters. During torrential rainstorms, these plastic blockages form impenetrable dams, trapping stormwater and forcing catastrophic flash floods into streets, market stalls, and living rooms. Furthermore, the stagnant sewage trapped behind plastic dams creates fertile breeding grounds for mosquitoes and houseflies, directly fueling perennial epidemics of malaria, cholera, and typhoid fever that hospitalize thousands of vulnerable children annually.\n\nEven more catastrophic is the devastation inflicted upon our marine environment. Millions of tons of plastic waste wash through municipal lagoons directly into the Atlantic Ocean. Beautiful coastal beaches in Cape Coast, Ada, and Jamestown have been buried beneath layers of plastic debris, ruining eco-tourism. Marine biologists frequently recover dead sea turtles and dolphins whose digestive tracts were clogged with polythene bags they mistook for jellyfish. As these plastics break down into microscopic particles under saltwater action, they are ingested by commercial fish species, introducing toxic chemical carcinogens into the human food chain.\n\nTo save our nation from ecological disaster, the state must display unyielding political courage. Parliament must pass comprehensive legislation instituting a total ban on single-use carrier bags and water sachets, following the successful precedents set by Rwanda and Kenya. Simultaneously, the government should provide tax incentives to local green entrepreneurs to manufacture biodegradable paper wrappers and cassava-starch packaging. The earth does not belong to us; we hold it in trust for generations unborn. We must ban single-use plastics before they choke the life out of our homeland.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Debate: Corporal Punishment in Schools (Opposing the Motion)
  {
    id: "B9_S4_E_F_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Debate Speech",
    title: "Corporal Punishment Must Be Eradicated from Ghanaian Schools",
    shortSummary: "Speak against caning and in favor of restorative, constructive discipline in basic schools.",
    prompt: "You are the lead speaker in an inter-schools debate competition on the motion: 'Caning and Corporal Punishment Have No Place in Modern Basic Education.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding psychological trauma and classroom fear, while refuting opposing claims that caning builds character.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B9.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on psychological trauma, classroom intimidation, and restorative alternatives. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that caning and corporal punishment have no place in modern basic education.",
        prohibitedOpenings: ["Good morning to you all", "I am standing here to talk"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Psychological Fear & Stifling Curiosity -> Restorative Discipline Alternatives -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with resolute passion today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Psychological Fear & Stifling Curiosity", guidingQuestion: "Explain how physical caning breeds anxiety, fear of making mistakes, and hatred for school.", transitionHints: ["First and foremost, true discipline cannot be beaten into a child with a cane...", "When teachers rely on the cane, classrooms become environments of terror where children are terrified of answering questions..."] },
          { stageIndex: 3, role: "Second Argument: Restorative Discipline & Character Transformation", guidingQuestion: "Contrast violent caning with counseling, community service, and detention that correct character.", transitionHints: ["Secondly, modern child psychology demonstrates that restorative discipline is vastly superior...", "Assigning reflective writing tasks, library duties, or counseling sessions addresses the root cause of misbehavior..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims that 'sparing the rod spoils the child,' deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will argue passionately that sparing the rod spoils the child; however, this claim collapses because...", "With these undeniable truths, I urge you all to vote for the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Education should enlighten the mind, not scar the body.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Psychological fear and stifled curiosity argument developed cogently (4 marks)", "Restorative discipline alternatives and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Caning and Corporal Punishment Have No Place in Modern Basic Education.\"\n\nFirst and foremost, physical flogging destroys the psychological atmosphere essential for intellectual learning. A classroom should be a safe sanctuary of curiosity, discovery, and creative questioning. When teachers wield the cane for every minor academic error, pupils become paralyzed by fear. Instead of engaging actively in mathematical problem-solving or essay writing, children spend lessons trembling in anxiety, terrified that volunteering an incorrect answer will earn them painful lashes across their palms. This atmosphere of intimidation stifles original thinking, destroys student self-esteem, and breeds chronic school phobia. Research consistently shows that fear of physical pain causes memory blackouts in children during examinations. Can intellectual excellence flourish under the whip? Incontestably not!\n\nSecondly, corporal punishment is an outdated, lazy substitute for constructive character reformation. Inflicting physical pain does not teach a child why an action is wrong; it merely teaches them how to conceal misconduct and avoid getting caught. Modern global education relies on restorative justice: withdrawal of privileges, supervised school community service, detention, and empathetic professional counseling. When a truant student is assigned to organize library books or write a reflective essay on accountability, they reflect on their behavior and contribute positively to the school community without suffering physical injury or public humiliation.\n\nMy worthy opponents will parrot the ancient biblical proverb that 'he who spares the rod hates his son.' However, they fundamentally misunderstand the metaphor! The shepherd's wooden staff was designed to guide, defend, and gently retrieve sheep, not to beat them into bruised submission. Do the world's most scientifically advanced nations cane their school children? Absolutely not! Yet their students innovate, patent technologies, and lead global development.\n\nMr. Chairman, education is meant to cultivate the human intellect, not to brutalize the flesh. Let us banish the cane from our classrooms and lead with empathy, reason, and restorative discipline. I urge this house to vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Narrative: A Dramatic Escape from an Armed Robbery on a Commercial Bus
  {
    id: "B9_S4_E_F_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Narrative Essay",
    title: "Night of Terror on the Highway",
    shortSummary: "Write a narrative story recounting a dramatic bus journey interrupted by an armed highway robbery and police rescue.",
    prompt: "While traveling home on an evening commercial bus after a school competition, the bus was ambushed by armed highway robbers. Write a narrative essay recounting the terrifying roadblock, the panic of the passengers, the tense confrontation, and the heroic arrival of a highway police patrol.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Suspenseful Action Pacing, Visceral Tension & Dramatic Resolution",
    learningCompetency: "B9.4.2.1.1: Compose suspenseful narrative stories depicting highway crime perils, visceral physiological fear, and police intervention.",
    hint: "Start with the peaceful night journey, describe the sudden roadblock of felled logs, the masked robbers boarding with weapons, the passenger terror, and the dramatic police patrol shootout and rescue.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Ambush on the Forest Highway",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing peaceful journey, sudden ambush, violent hostage crisis, and police rescue.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Night Travel Baseline", guidingQuestion: "Describe the quiet night bus journey returning from Kumasi with fatigued passengers sleeping under the hum of the engine.", transitionHints: ["The hum of the diesel engine was the only sound breaking the midnight quiet as our commercial bus cruised...", "Fatigued passengers slept peacefully on their cushioned seats, dreaming of home as the vehicle navigated the forested highway..."] },
          { stageIndex: 2, role: "Inciting Incident & The Ambush", guidingQuestion: "Describe the driver screeching to a halt before a barricade of felled logs, and masked gunmen surrounding the bus.", transitionHints: ["Without warning, the driver slammed on the brakes with a bone-jarring screech of tires...", "Directly in our headlights lay a barricade of heavy tree trunks, and within seconds, masked gunmen brandishing shotguns emerged from the bush..."] },
          { stageIndex: 3, role: "Rising Action & Terror in the Aisle", guidingQuestion: "Narrate the shattered glass, screaming passengers, and the robbers demanding cash and phones at gunpoint.", transitionHints: ["A gunshot shattered the passenger windshield, showering the front seats in crystals of glass...", "Masked men stormed the aisle, kicking seats and bellowing: \"Drop your phones and wallets on the floor or face death!\"..."] },
          { stageIndex: 4, role: "Climax, Police Rescue & Denouement", guidingQuestion: "Describe the flashing blue lights and sirens of an approaching highway patrol, the robbers fleeing, and immense relief.", transitionHints: ["Just as the robber's gun pointed at my trembling chest, flashing red and blue strobe lights illuminated the trees...", "Sirens wailed as an armed police highway patrol unit opened fire, sending the robbers fleeing blindly into the forest..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Dramatic Reflection",
        proverbOrClosingPhrase: "Deliverance arrives when all human hope seems exhausted.",
        integrationRule: "Conclude with an emotional synthesis celebrating courage and gratitude for law enforcement officers."
      }
    },
    rubric: createWAECRubric(
      ["Night bus journey baseline established (2 marks)", "Barricade ambush, gunfire, and passenger terror depicted vividly (4 marks)", "Police patrol shootout, robber retreat, and emotional relief conveyed (4 marks)"],
      ["Highway setting established", "Armed robbery scene vivid and kinetic", "Police rescue and relief clear"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative perspective (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Dynamic action verbs and highway thriller imagery (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and suspenseful adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `Ambush on the Forest Highway\n_____________________________\n\nThe rhythmic hum of the commercial bus engine was the only sound breaking the midnight stillness as we cruised along the winding Kumasi-Accra highway. Exhausted after a grueling three-day national science quiz competition, my classmates and I leaned back against the headrests, lulled toward sleep by the cool air conditioning. Outside, the pitch-black forest flashed past our windows in a blur of shadowy silhouettes.\n\nWithout warning, our world descended into violent chaos. The driver slammed on the emergency brakes with a deafening screech of burning rubber, pitching passengers violently forward against the seats. Directly ahead, bathed in the high beams of our headlights, lay an intentional barricade of felled mahogany tree trunks blocking both lanes. Before the stunned driver could engage reverse, six masked figures dressed in military camouflage burst from the roadside thickets, brandishing pump-action shotguns and glistening machetes.\n\nA thunderous shotgun blast shattered the front windshield, spraying shards of safety glass across the dashboard. Screams of pure terror erupted through the cabin as two heavily armed assailants kicked open the folding doors and stormed the central aisle. \"Heads down! Nobody move if you love your lives!\" their leader bellowed in a raspy voice, cocking his weapon. Women sobbed hysterically while mothers desperately shielded their crying infants beneath the seats. Trembling uncontrollably, I pressed myself against the window as the barrel of a shotgun pushed against my temple, demanding my phone and school bag.\n\nAt that terrifying precipice between life and death, salvation arrived like a thunderbolt. Blinding flashes of blue and crimson strobe lights swept across the tree canopy as an armored highway police patrol vehicle rounded the bend with sirens screaming. \"Police! Surrender your weapons!\" a bullhorn commanded. Rapid volleys of gunfire tore through the night air as the disciplined officers engaged the criminals. Panicking, the robbers leaped through the broken bus windows and fled blindly into the dense jungle. As heavily armed tactical officers secured the vehicle and escorted trembling passengers to safety, tears of boundless relief streamed down my face. Deliverance had arrived at the exact moment hope seemed lost.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Descriptive: The Electric Atmosphere of an Independence Day Parade
  {
    id: "B9_S4_E_F_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Descriptive Essay",
    title: "Pride and Pageantry on Independence Square",
    shortSummary: "Write a descriptive essay recreating the visual majesty, brass band music, and military precision of the 6th March parade.",
    prompt: "You attended the national 6th March Independence Day parade at the Black Star Square in Accra. Write a descriptive essay recreating the dazzling national colors, the crisp precision drills of military contingents and school cadets, the soaring brass band music, and the electric patriotism of the crowd.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Patriotic Ceremonial Description, Auditory Military Pacing & Spatial Grandeur",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions capturing national ceremonial pageantry through rich sensory registers, civic pride vocabulary, and spatial progression.",
    hint: "Use spatial progression: the packed stands draped in red, gold, and green under the blazing sun, the precision footwork of military and student cadet contingents, the resounding 21-gun salute, and the collective roar of national pride.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "A Symphony of Red, Gold, and Green",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression through the 6th March national parade from arrival to the grand march-past.",
        stagePrompts: [
          { stageIndex: 1, role: "The Packed Parade Arena", guidingQuestion: "Set the scene at the Black Star Square draped in vibrant national flags under the tropical sun.", transitionHints: ["Under the radiant, golden morning sun, the sweeping expanse of the Black Star Square in Accra...", "Over thirty thousand citizens, dignitaries, and foreign ambassadors packed the coastal stands, creating an ocean of red, gold, and green..."] },
          { stageIndex: 2, role: "The Military Cadets (Kinetic Precision)", guidingQuestion: "Describe the synchronized marching, polished leather boots thudding in unison, and gleaming bayonets flashing.", transitionHints: ["The parade ignited with the arrival of the armed forces contingents and school cadet corps...", "Polished black leather boots struck the asphalt in thunderous unison, while ceremonial chrome bayonets caught the sunbeams..."] },
          { stageIndex: 3, role: "Auditory Majesty: Brass Bands & 21-Gun Salute", guidingQuestion: "Capture the stirring military brass band music and the earth-shaking thunder of the 21-gun artillery salute over the ocean.", transitionHints: ["The acoustic majesty was overwhelming...", "Massed military brass bands played stirring patriotic anthems, followed by the deafening, earth-shaking boom of a 21-gun artillery salute..."] },
          { stageIndex: 4, role: "The School March-Past & National Pride", guidingQuestion: "Describe hundreds of school children marching proudly past the presidential dais and reflect on Ghanaian freedom.", transitionHints: ["Then came the school contingents, their crisp uniforms and beaming smiles capturing the hope of our sovereign republic...", "Standing amid that sea of waving miniature flags, an overwhelming wave of patriotism swelled in my chest..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Patriotic Synthesis",
        proverbOrClosingPhrase: "Freedom is the eternal beacon that guides our sovereign destiny.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating national unity, sovereignty, and democratic hope."
      }
    },
    rubric: createWAECRubric(
      ["Black Star Square setting and crowd patriotic energy established (2 marks)", "Military precision marching, boots, and bayonets depicted vividly (4 marks)", "Brass band music, 21-gun salute, and student cadet pride conveyed (4 marks)"],
      ["Parade setting vivid", "Sensory cues (color, sound, rhythm) rich", "Patriotic grandeur captured"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich civic, military, and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `A Symphony of Red, Gold, and Green\n___________________________________\n\nUnder the radiant morning sun, the sweeping expanse of the Black Star Square in Accra was transformed into a dazzling, monumental theater of patriotic pride on the sixth of March. Over thirty thousand citizens, foreign dignitaries, and traditional rulers packed the grand concrete stands overlooking the Atlantic Ocean. A vibrant sea of red, gold, and green national flags fluttered briskly in the coastal sea breeze, creating an unforgettable spectacle of national unity.\n\nThe parade commenced with an electrifying demonstration of military precision. Regiments of the Ghana Armed Forces, the Police Service, and senior school cadet corps lined up in perfect geometric columns across the black asphalt. At the command of the Parade Commander, hundreds of polished black leather combat boots struck the ground with a single, thunderous thud that vibrated through the bleachers. Polished chrome rifle bayonets flashed like silver lightning against the tropical sky as soldiers executed synchronized turns with breathtaking mechanical flawless perfection.\n\nThe acoustic power of the square was overwhelming. The massed military brass band unleashed stirring, triumphant renditions of patriotic marches, their gleaming brass tubas and trumpets soaring above the rolling crash of ocean breakers. Suddenly, the earth shook beneath our feet. From the coastal seawall, artillery guns fired a deafening twenty-one-gun presidential salute. Massive plumes of gray cordite smoke drifted over the Gulf of Guinea as the thunder of the cannons reverberated off the monumental Independence Arch, sending goosebumps rippling down the arms of every spectator.\n\nThen came the climax: hundreds of young school children, dressed in immaculately pressed uniforms, marched past the presidential dais with heads held high, swinging their arms in rhythmic pride. Watching those youthful faces glowing with hope and determination, an overwhelming wave of love for Ghana swelled in my chest. Freedom and justice are not merely words inscribed on an arch; they are the living, beating soul of our sovereign nation.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B9FoundationClean() {
  console.log("Building clean 60-item Strand 4 B9 Foundation Practice Lab...");
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
      id: `B9_S4_E_F_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B9",
      difficulty: "foundation",
      category: "Composition & Rhetoric Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n"${item.passage}"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: item.answer, // Matches exact string value in finalOptions[targetPos]
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B9.4.2.1: Demonstrate foundation mastery of narrative plot structures, sensory travelogue descriptions, article headline-byline rules, and parliamentary debate mechanics."
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
    level: "B9",
    difficulty: "foundation",
    title: "Basic 9 Foundation Writing Lab: 50 Objective Rhetoric Drills + 10 Theory Extended Compositions",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B9_foundation`
    );
    await targetDoc.set(labPayload);
    console.log(`   ✅ Deployed Practice Lab: ${targetDoc.path}`);

    // 4. Synchronize into the main topical document practice pool (low)
    for (const parentCol of parentCollections) {
      const mainTopicDoc = db.doc(
        `global_curriculum/jhs/subjects/english/${parentCol}/${docId}`
      );

      await mainTopicDoc.set({
        levels: {
          b9: {
            practicePool: {
              low: all60Items.map(item => ({
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all60Items.length} items to B9 Foundation Practice Labs!`);
}

deployStrand4B9FoundationClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B9 Foundation Clean 60 Lab:", err);
    process.exit(1);
  });

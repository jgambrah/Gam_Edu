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
  level: "B8";
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
// Basic 8 Foundation Diagnostic Focus:
// Freytag Arc Analysis, Proverbial Structural Synthesis, Advanced Sensory Framing,
// Journalistic Lead Forensics, Inquit Syntactic Inversions & Parliamentary Vocatives
// =========================================================================
const rawObjective50Data = [
  {
    passage: "A Basic 8 student is writing an illustrative narrative on the proverb: 'Patience can cook a stone.'",
    question: "How should the proverb be developed across the narrative arc?",
    options: [
      "By demonstrating through a character's sustained endurance and calm perseverance that difficult obstacles are overcome over time",
      "By having a character literally try to boil a rock in a kitchen pot",
      "By writing the proverb repeatedly at the start of every paragraph",
      "By summarizing the story as an isolated moral slogan at the very top of the page"
    ],
    answer: "By demonstrating through a character's sustained endurance and calm perseverance that difficult obstacles are overcome over time",
    hint: "The story must show steady perseverance overcoming a seemingly impossible trial.",
    solution: "The aphorism 'Patience can cook a stone' represents enduring perseverance. In narrative writing, it must be reflected in the protagonist's steadfast patience through adversity leading to triumph.",
    target: "Narrative Arc: Proverbial Conceptual Integration"
  },
  {
    passage: "In Freytag's plot pyramid, where does the 'turning point' of the conflict occur?",
    question: "Identify the stage where the central conflict reaches its peak intensity:",
    options: [
      "The Climax",
      "The Exposition",
      "The Inciting Incident",
      "The Denouement"
    ],
    answer: "The Climax",
    hint: "It is the emotional peak and highest point of dramatic action.",
    solution: "The climax represents the turning point and highest emotional peak of the narrative arc, forcing the decisive choice that initiates the falling action.",
    target: "Freytag's Pyramid: Climax Function"
  },
  {
    passage: "A candidate writes an article for the *Junior Graphic* and includes: 'Dear Editor, how are your family members doing?' in paragraph 1.",
    question: "What structural defect does this represent under WAEC rubrics?",
    options: [
      "Format contamination: introducing epistolary greetings into a public journalistic article",
      "A welcome expression of personal warmth",
      "A mechanical error in spelling and concord",
      "An effective journalistic lead hook"
    ],
    answer: "Format contamination: introducing epistolary greetings into a public journalistic article",
    hint: "Articles address the general reading public, not the editor personally.",
    solution: "Articles for publication are public expository essays. Introducing personal epistolary greetings to the editor constitutes format contamination, penalized under Organization.",
    target: "Articles for Publication: Format Purity"
  },
  {
    passage: "In a formal parliamentary debate speech, what immediately follows the vocative salutation hierarchy?",
    question: "Select the required next step in debate structure:",
    options: [
      "An explicit declaration of stance on the motion (supporting or opposing)",
      "A humorous personal joke to entertain the audience",
      "A detailed reading of the dictionary definition of every single word",
      "The speaker's personal life history"
    ],
    answer: "An explicit declaration of stance on the motion (supporting or opposing)",
    hint: "The audience and judges must immediately know which side the speaker is defending.",
    solution: "Immediately following the descending vocatives, a debate speaker must state their stance clearly: 'I rise to stoutly defend/oppose the motion which states that...'.",
    target: "Debate Speech: Stance Proclamation Protocol"
  },
  {
    passage: "Examine this dialogue construction: '\"Leave this compound at once!\" the headmaster commanded, \"You have violated school rules.\"'",
    question: "What punctuation error exists in the dialogue tag?",
    options: [
      "The comma after 'commanded' should be a full stop because both spoken clauses are separate complete sentences",
      "The exclamation mark should be outside the quotation marks",
      "The word 'commanded' must be capitalized",
      "The word 'compound' should be inside single quotes"
    ],
    answer: "The comma after 'commanded' should be a full stop because both spoken clauses are separate complete sentences",
    hint: "Two independent complete sentences spoken by a character require a period after the reporting tag.",
    solution: "Because 'Leave this compound at once!' and 'You have violated school rules' are independent complete sentences, the inquit tag must end with a period: '...commanded. \"You have...\"'.",
    target: "Dialogue Mechanics: Sentence Boundary Rules"
  },
  {
    passage: "A student writes: 'The suffocating stench of decaying garbage and stagnant gutter sludge stung their nostrils.'",
    question: "Which human sensory register is engaged by this description?",
    options: [
      "Olfactory register",
      "Auditory register",
      "Visual register",
      "Tactile register"
    ],
    answer: "Olfactory register",
    hint: "It describes bad smells affecting the nose.",
    solution: "'Suffocating stench' and 'stung their nostrils' appeal directly to the olfactory sense (smell).",
    target: "Descriptive Writing: Olfactory Sensory Imagery"
  },
  {
    passage: "A candidate writes an article headline in all-caps: <u>THE EFFECTS OF CLIMATE CHANGE ON AGRICULTURE</u>.",
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
      "Inside the left margin alongside each paragraph",
      "Only in the second paragraph"
    ],
    answer: "Directly below the headline or at the conclusion of the article",
    hint: "The byline establishes authorship under the title or at the end.",
    solution: "The byline (e.g., 'By Kwame Mensah, Basic 8B') sits immediately beneath the headline or is appended at the very end of the essay.",
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
    passage: "A Basic 8 student is drafting an article for a national daily newspaper on teenage road safety.",
    question: "Which of the following is the most suitable concluding strategy for an article for publication?",
    options: [
      "A vigorous call to action urging transport authorities, drivers, and students to observe safety regulations",
      "Signing off with 'Yours faithfully' followed by the student's signature and parent's phone number",
      "Ending abruptly after listing the statistics without summarizing solutions",
      "Writing a personal prayer asking God to bless the newspaper printing press"
    ],
    answer: "A vigorous call to action urging transport authorities, drivers, and students to observe safety regulations",
    hint: "An article for publication must end with a constructive, solution-driven call to action.",
    solution: "Under WAEC and NaCCA conventions, the peroration of a journalistic article must synthesize the thesis into an urgent, actionable call to action directed at stakeholders and readers.",
    target: "Articles for Publication: Concluding Call to Action Architecture"
  }
];

const theory10Prompts: TheoryEssayItem[] = [
  // 51. Narrative: Illustrating 'Patience Can Cook a Stone'
  {
    id: "B8_S4_E_F_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Narrative Essay",
    title: "The Fruits of Long Endurance",
    shortSummary: "Write a narrative story illustrating the indigenous proverb: 'Patience can cook a stone.'",
    prompt: "Write a story that illustrates the truth of the Ghanaian proverb: 'Patience can cook a stone.' Narrate how an orphaned apprentice endured years of mockery and harsh apprenticeship in a motor mechanic workshop, remaining patient and honest until an unexpected opportunity established him as a master craftsman.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Character Arc, Realistic Conflict Pacing & Proverbial Moral Synthesis",
    learningCompetency: "B8.4.2.1.1: Compose coherent narrative compositions illustrating traditional proverbs through sustained plot development, rising adversity, and ethical resolution.",
    hint: "Establish Kwadwo's humble apprenticeship early. Show his patient forbearance under harsh insults, build to the climactic breakdown of an official's vehicle, and weave the proverb into his triumph.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Master of Patience",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing apprenticeship hardship, persistent diligence, decisive diagnostic climax, and moral triumph.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Hardship", guidingQuestion: "Introduce orphaned teenager Kwadwo arriving at Master Antwi's roadside garage in Suame Magazine.", transitionHints: ["In the sprawling industrial hub of Suame Magazine, fifteen-year-old Kwadwo began...", "Having lost both parents early, his only inheritance was a pair of worn overalls and an iron will..."] },
          { stageIndex: 2, role: "Rising Action & Forbearance", guidingQuestion: "Describe senior apprentices bullying him and taking credit for his repair work while Kwadwo quietly mastered diesel mechanics.", transitionHints: ["For two grueling years, senior apprentices mocked his quiet nature, forcing him to wash engine blocks...", "While others lounged during break hours, Kwadwo carefully studied electrical wiring diagrams and carburetor adjustments..."] },
          { stageIndex: 3, role: "The Diagnostic Climax", guidingQuestion: "Narrate a visiting minister's luxury vehicle breaking down, senior mechanics failing to fix it, and Kwadwo identifying the electrical fault.", transitionHints: ["The turning point arrived on a rainy Friday when a ministerial convoy broke down outside the garage...", "After Master Antwi and his senior apprentices spent two hours sweating in vain over the engine, Kwadwo stepped forward..."] },
          { stageIndex: 4, role: "Denouement, Reward & Proverbial Realization", guidingQuestion: "Describe Kwadwo fixing the car in ten minutes, receiving a workshop sponsorship, and reflecting on the proverb.", transitionHints: ["Tracing a loose earth wire with his multimeter, Kwadwo revived the engine within ten minutes...", "When the grateful dignitary established a modern workshop in his name, Kwadwo remembered his late mother's words: patience can cook a stone..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Resolution & Moral Aphorism",
        proverbOrClosingPhrase: "Patience can cook a stone.",
        integrationRule: "Embed the proverb organically into Kwadwo's final reflection during the commissioning of his new workshop."
      }
    },
    rubric: createWAECRubric(
      ["Apprenticeship setting and character hardship established (2 marks)", "Persistent diligence under mockery and engine breakdown crisis depicted (4 marks)", "Diagnostic climax, generous sponsorship, and organic proverb integration (4 marks)"],
      ["Character context clear", "Hardship depicted vividly", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and mechanical adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Master of Patience\n_______________________\n\nIn the noisy industrial labyrinth of Suame Magazine in Kumasi, fifteen-year-old Kwadwo started his journey as an apprentice motor mechanic. Having lost both parents to illness two years prior, his worldly possessions amounted to a tattered pair of denim overalls and a stubborn determination to learn a trade. Master Antwi, the garage proprietor, was a demanding taskmaster whose tongue was as sharp as a cold chisel.\n\nFor two exhausting years, Kwadwo endured grueling labor and constant ridicule. Senior apprentices routinely dumped the dirtiest tasks onto his shoulders—washing grease-encrusted engine blocks, scrubbing greasy sumps, and running errands under the scorching sun. While other apprentices spent their afternoons gambling behind parked scrap trucks, Kwadwo sat quietly beneath stripped vehicle chassis, studying diagnostic wiring diagrams and memorizing diesel injector calibrations. Whenever hot grease burned his skin or Master Antwi scolded him unfairly, he swallowed his tears, recalling his grandmother's whispered counsel that quiet endurance conquers all things.\n\nHis moment of destiny arrived on a stormy Friday afternoon. A regional minister's bulletproof luxury SUV developed a sudden electrical fault, grinding to an abrupt halt directly outside the workshop. Master Antwi and his senior mechanics swarmed over the vehicle. For two frustrating hours, they replaced spark plugs, drained fuel filters, and disconnected batteries, but the computerized engine refused to turn over. With the minister pacing the workshop in fury, Kwadwo stepped forward respectfully and whispered that the trouble lay in a corroded alternator ground wire.\n\nMaster Antwi barked at him to stay back, but the minister permitted the boy to test his hypothesis. Producing his multimeter, Kwadwo stripped the oxidised earth wire, tightened the terminal lug, and smiled. When the chauffeur turned the key, the powerful V8 engine roared to life with a smooth, purring hum! The stunned minister rewarded Kwadwo with a full scholarship to an advanced technical training institute in Germany. Standing before his new tools, Kwadwo's eyes filled with tears of gratitude. Truly, patience can cook a stone.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Descriptive: A Visit to an Ancient Slave Castle Dungeons
  {
    id: "B8_S4_E_F_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Descriptive Essay",
    title: "Echoes in the Stone Dungeons",
    shortSummary: "Write a descriptive essay capturing the chilling sights, suffocating atmosphere, and historical gravity of Cape Coast Castle.",
    prompt: "Your school organized an educational tour of the historic Cape Coast Castle. Write a descriptive essay recreating your descent into the male slave dungeons, capturing the cold stone walls, the suffocating darkness, the damp smell of history, and the emotional resonance of the 'Door of No Return.'",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Spatial Descent Progression, Multi-Sensory Historical Imagery & Somber Tone",
    learningCompetency: "B8.4.2.2.1: Write descriptive compositions recreating historical monuments through multi-sensory registers, spatial progression, and evocative reflection.",
    hint: "Use spatial progression: the bright, breezy castle courtyard above ground, descending the damp stone staircase into darkness, the claustrophobic dungeon interior, and stepping through the Door of No Return.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Echoes in the Stone Dungeons",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression from the sunny castle courtyard down into the subterranean slave dungeons.",
        stagePrompts: [
          { stageIndex: 1, role: "Courtyard Contrast", guidingQuestion: "Contrast the bright, ocean-breezy courtyard with the dark underground entrances.", transitionHints: ["Standing in the sunlit, whitewashed courtyard of Cape Coast Castle...", "The contrast between the sparkling Atlantic breeze above and the dark openings below was chilling..."] },
          { stageIndex: 2, role: "Descending into Darkness", guidingQuestion: "Describe descending the damp stone stairs, the sudden drop in temperature, and the suffocating darkness.", transitionHints: ["Stepping down the slick, narrow stone staircase into the subterranean male dungeon...", "Daylight vanished in seconds, replaced by a suffocating, pitch-black gloom where the air hung heavy and cold..."] },
          { stageIndex: 3, role: "Sensory Horror of the Dungeons", guidingQuestion: "Depict the ancient trench carved into the floor, the damp stone walls, and the lingering smell of suffering.", transitionHints: ["Our tour guide switched on a single battery lantern, illuminating craggy granite walls...", "A musty, damp odor of ancient salt, mold, and historic misery seemed etched into the rough stone..."] },
          { stageIndex: 4, role: "The Door of No Return & Moral Reflection", guidingQuestion: "Describe stepping through the narrow Door of No Return toward the crashing waves and reflecting on human freedom.", transitionHints: ["At the far end of the gloomy corridor opened the narrow, rectangular Portal of No Return...", "Gazing out at the pounding ocean surf where slave ships once anchored, an overwhelming wave of solemn reverence swept over me..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Historical Synthesis",
        proverbOrClosingPhrase: "Memory is the eternal guardian of human freedom.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating freedom and ancestral remembrance."
      }
    },
    rubric: createWAECRubric(
      ["Castle courtyard and descent established (2 marks)", "Sensory depictions of cold darkness, damp smell, and stone trenches (4 marks)", "Door of No Return and solemn historical reflection captured (4 marks)"],
      ["Dungeon setting vivid", "Sensory cues (smell, touch, sight) rich", "Emotional weight conveyed clearly"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich historical and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `Echoes in the Stone Dungeons\n_______________________________\n\nStanding in the sun-drenched central courtyard of Cape Coast Castle, the Atlantic breeze felt fresh and invigorating. Sea gulls circled against a brilliant blue sky, and waves crashed playfully against ancient granite ramparts lined with black iron cannons. Yet, beneath this tranquil, whitewashed surface lay an underground abyss of unimaginable human cruelty.\n\nOur descent into the subterranean male slave dungeon felt like crossing the threshold into a tomb. As our tour group stepped down the steep, slick stone staircase, the radiant tropical daylight vanished within seconds, swallowed by an impenetrable, suffocating gloom. The temperature dropped abruptly, yet the air was thick, clammy, and suffocating. A heavy, musty stench of ancient sweat, damp sea salt, and decomposing centuries of sorrow seemed permanently baked into the rough stone walls.\n\nWhen our guide illuminated a single battery lantern, the horrifying reality of the chamber came into view. The floor was rough, unpaved bedrock, marked by shallow drainage trenches where hundreds of captured African men were crammed together in absolute darkness for months on end. Touching the cold, sweating walls, my fingers felt the encrusted layers of human misery that no amount of whitewash could erase. High above, tiny rectangular air slits barely allowed a sliver of light to penetrate the gloom, offering no relief from the stifling heat.\n\nAt the far end of the tunnel stood the infamous 'Door of No Return.' Emerging through its narrow stone portal, the thunderous crash of the ocean returned, and the brisk coastal wind whipped against my face. Staring out at the vast Atlantic horizon where slave frigates once awaited their human cargo, a profound wave of grief and solemn reverence silenced our entire class. Those dark dungeons stand as an eternal monument, warning humanity that freedom is sacred and must never be surrendered.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Article for Publication: The Menace of Street Children in Urban Centers
  {
    id: "B8_S4_E_F_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Article for Publication",
    title: "Rescuing Our Street Children",
    shortSummary: "Write an article for publication in a national daily on eradicating child homelessness in urban centers.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'The Growing Tragedy of Street Children in Our Cities.' Examine the root causes of child homelessness, analyze the risks these children face on highways and market centers, and propose two actionable solutions involving government welfare and vocational rehabilitation.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Sociological Vulnerability Analysis & Policy Reform",
    learningCompetency: "B8.4.2.1.2: Compose structured articles for publication analyzing juvenile street homelessness, child labor hazards, and social welfare rehabilitation policies.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, root causes, highway hazards, and statutory solutions.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "THE GROWING TRAGEDY OF STREET CHILDREN IN OUR CITIES",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Selorm Mensah, Basic 8B",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Socio-Economic Drivers -> Daily Perils & Hazards -> Comprehensive Rehabilitation).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and depict the distressing sight of school-aged children dodging traffic at city intersections.", transitionHints: ["At every major traffic intersection in Accra and Kumasi, a painful humanitarian crisis unfolds daily...", "Children barely eight years old dart between moving vehicles, wiping windshields and begging for coins..."] },
          { stageIndex: 2, role: "Socio-Economic Root Causes", guidingQuestion: "Analyze root causes: parental neglect, rural-urban migration, domestic abuse, and broken homes.", transitionHints: ["These children did not choose the harsh pavement out of criminal instinct...", "Pervasive rural poverty, fractured marriages, and domestic abuse force vulnerable youngsters to flee..."] },
          { stageIndex: 3, role: "Daily Hazards on the Street", guidingQuestion: "Describe the dangers: vehicular knockdowns, severe malnutrition, sexual exploitation, and crime syndicates.", transitionHints: ["Life on the asphalt street is a brutal gamble with survival...", "Deprived of balanced meals and shelter, these youngsters face vehicular knockdowns by reckless drivers, exposure to pneumonia, and exploitation..."] },
          { stageIndex: 4, role: "Actionable Solutions & Call to Action", guidingQuestion: "Propose two actionable solutions (reintegration shelter centers and vocational apprenticeship scholarships) and conclude with a moral challenge.", transitionHints: ["To reclaim these children, national authorities must act decisively...", "The Ministry of Gender, Children and Social Protection must establish municipal transitional shelters, while vocational training centers provide..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Civic Appeal",
        proverbOrClosingPhrase: "The moral health of a nation is judged by how it protects its most vulnerable children.",
        integrationRule: "End with an inspiring appeal urging state agencies and citizens to rescue street children."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and street children crisis established (2 marks)", "Socio-economic causes and street hazards analyzed (4 marks)", "Two actionable welfare solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Causes and hazards detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive sociological vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `THE GROWING TRAGEDY OF STREET CHILDREN IN OUR CITIES\nBy Selorm Mensah, Basic 8B\n\nAt every major traffic intersection and commercial roundabout across our bustling cities, a distressing humanitarian tragedy plays out daily in broad daylight. Children barely eight years old, dressed in filthy rags and barefoot, dart perilously between fast-moving haulage trucks and commercial minibuses, clutching plastic rags to wipe windshields in exchange for spare coins. While their peers sit in classrooms mastering science and literature, these young souls are fighting an exhausting battle for survival on the hot asphalt.\n\nThis crisis is fueled by deep-seated socio-economic fractures. The breakdown of extended family safety nets, parental abandonment, domestic abuse, and severe rural-urban poverty compel vulnerable minors to flee their villages for regional capitals in search of food. Deceived by the illusion of urban prosperity, they arrive at bus terminals only to find that the city offers no shelter, forcing them to make concrete verandas and market stalls their permanent homes.\n\nLife on the street exposes these children to horrific dangers. Deprived of nutritious food, clean water, and healthcare, they battle chronic malaria, skin infections, and malnutrition. Sleeping under open market sheds leaves them defenseless against cold rainstorms, criminal syndicates, and sexual predators. Furthermore, the daily hazard of navigating heavy vehicular traffic results in catastrophic hit-and-run accidents that maim or kill dozens of street children annually.\n\nTo rescue these lost youngsters, the government must move beyond cosmetic roundups and establish permanent solutions. The Ministry of Gender, Children and Social Protection must partner with civil society organizations to construct municipal transitional shelters equipped with counseling, healthcare, and formal education. In addition, older street teenagers must be enrolled in state-sponsored vocational apprenticeship programs to learn carpentry, catering, and electrical installation. The moral soul of our nation is judged by how we treat our most vulnerable; we must take these children off the streets and restore their dignity.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Debate: Science Has Done More Harm Than Good (Opposing the Motion)
  {
    id: "B8_S4_E_F_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Debate Speech",
    title: "Science Has Blessed Humanity Far More Than It Has Harmed It",
    shortSummary: "Speak against the motion that science and modern technology have done more harm than good to humanity.",
    prompt: "You are the second speaker in an inter-schools debate competition on the motion: 'Science and Modern Technology Have Done More Harm Than Good to Humanity.' Write your debate speech opposing the motion, presenting at least two compelling arguments regarding life-saving medical discoveries and global agricultural productivity, while refuting opposing claims on pollution and warfare.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B8.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on antibiotics, surgical advancements, and motorized food farming. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly oppose the motion which asserts that science and modern technology have done more harm than good to humanity.",
        prohibitedOpenings: ["Good morning to you all", "I am here to tell you"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Medical Longevity & Disease Eradication -> Agricultural Food Abundance -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion opposition unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with resolute passion today to stoutly oppose the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Medical Longevity & Disease Eradication", guidingQuestion: "Explain how scientific medicine (vaccines, anesthesia, surgical transplants) doubled human life expectancy.", transitionHints: ["First and foremost, before the dawn of scientific medicine, human existence was short, brutal, and terrifying...", "Diseases like smallpox, polio, and bacterial pneumonia routinely wiped out entire towns until medical science engineered..."] },
          { stageIndex: 3, role: "Second Argument: Agricultural Mechanization & Global Food Abundance", guidingQuestion: "Contrast manual farming starvation with motorized tractors, fertilizers, and irrigation that feed billions.", transitionHints: ["Secondly, science feeds a global population of eight billion souls...", "Can hand cutlasses and wooden hoes cultivate vast plains to feed teeming cities? It is scientific agronomy, motorized tractors, and..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on weapons and pollution, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents have pointed trembling fingers at atomic bombs and industrial pollution; however, this claim collapses because...", "With these unassailable truths, I urge you all to reject the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Science is the magnificent torch that banished the dark ages of disease and famine.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion opposition declared firmly (2 marks)", "Medical life-saving discoveries argument developed cogently (4 marks)", "Agricultural food abundance and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly oppose the motion which asserts that: \"Science and Modern Technology Have Done More Harm Than Good to Humanity.\"\n\nFirst and foremost, human life itself has been rescued and prolonged by the wonders of scientific medicine. Before the advent of modern biomedical research, human existence was fragile, brief, and agonizing. Deadly infectious plagues like smallpox, cholera, and tuberculosis wiped out entire populations without cure. A simple toothache or minor scratch could lead to fatal blood poisoning. It is scientific pharmacology that discovered penicillin, developed childhood vaccines, engineered sterile surgical theaters, and invented life-saving incubators for premature babies. Thanks to science, global life expectancy has doubled over the past century! Can anyone in this hall, who was immunized at birth or treated with antibiotics, honestly claim that science has harmed humanity?\n\nSecondly, science and engineering have conquered famine and enabled our planet to feed over eight billion people. In pre-scientific times, primitive manual hoes and unpredictable rains caused recurrent famines that starved millions to death. Today, agricultural mechanization, motorized combine harvesters, automated drip-irrigation networks, and high-yielding disease-resistant crop varieties ensure food security across continents. Furthermore, telecommunications and aviation have shrunk the globe, allowing international disaster relief and emergency supplies to reach famine zones in hours.\n\nMy worthy opponents have pointed trembling fingers at atomic weapons, toxic plastics, and factory pollution. However, their argument confuses the tool with the user! Science is neutral knowledge; it is human greed, political corruption, and moral failure that abuse it. Do we blame electricity because an individual chooses to touch an uninsulated live wire? Incontestably not!\n\nMr. Chairman, science is the magnificent torch that dragged humanity out of the dark ages of superstition, plague, and starvation. I urge this house to vote resoundingly against the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Narrative: Illustrating 'Look Before You Leap'
  {
    id: "B8_S4_E_F_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Narrative Essay",
    title: "The Treacherous Shortcut",
    shortSummary: "Write a narrative story illustrating the proverb: 'Look before you leap.'",
    prompt: "Write a story that illustrates the truth of the proverb: 'Look before you leap.' Narrate how an impatient student chose an unfamiliar, dangerous shortcut through an abandoned swamp to beat the school morning bell, only to plunge into treacherous mud and ruin his uniform on an important inspection day.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Conflict Pacing, Reckless Decision Arc & Organic Proverb Integration",
    learningCompetency: "B8.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through reckless choices, environmental hazards, and moral consequences.",
    hint: "Show the student's panic about being late. Describe his reckless decision to take the forbidden swamp path, the terrifying plunge into deep mud, and the bitter moral realization.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Treacherous Shortcut",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing late wake-up, reckless decision, swamp disaster, and moral realization.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & The Morning Inspection", guidingQuestion: "Introduce fourteen-year-old Daniel on the morning of the regional director's general school inspection.", transitionHints: ["The morning of the Regional Director's inspection in Nsawam began with panic for fourteen-year-old Daniel...", "He had overslept, and his immaculate white uniform was laid out as the clock ticked dangerously toward 7:30 a.m...."] },
          { stageIndex: 2, role: "Inciting Incident & The Reckless Decision", guidingQuestion: "Describe Daniel arriving at the road junction, realizing the main road would make him late, and choosing the forbidden swamp shortcut.", transitionHints: ["The normal road wound around the valley, taking thirty minutes of brisk walking...", "Terrified of being flogged and disqualified from assembly, Daniel stared at the overgrown footpath leading into the abandoned marshland..."] },
          { stageIndex: 3, role: "Rising Action & The Swamp Disaster", guidingQuestion: "Narrate rushing onto what appeared to be solid green grass, only to plunge waist-deep into foul, slimy bog mud.", transitionHints: ["Sprinting blindly along the path, he leaped onto a green carpet of floating ferns...", "Without warning, the deceitful crust collapsed, and Daniel plunged waist-deep into black, foul-smelling swamp mud..."] },
          { stageIndex: 4, role: "Climax, Ruin & Proverbial Realization", guidingQuestion: "Describe clawing his way out with lost shoes and a ruined uniform, arriving late in shame, and realizing the proverb.", transitionHints: ["Gasping and weeping in terror, he dragged his mud-caked body out by clutching mangrove roots...", "Standing outside the school gate with his ruined uniform while the inspection proceeded, he learned: look before you leap..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Moral Synthesis",
        proverbOrClosingPhrase: "Look before you leap.",
        integrationRule: "Embed the proverb into Daniel's reflection while standing outside the school gate."
      }
    },
    rubric: createWAECRubric(
      ["Inspection day stakes and panic established (2 marks)", "Reckless swamp shortcut choice and terrifying plunge depicted vividly (4 marks)", "Humiliating arrival, ruined uniform, and organic proverb integration (4 marks)"],
      ["Character context clear", "Swamp disaster shown vividly", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and kinetic adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Treacherous Shortcut\n________________________\n\nThe morning of the Regional Director's annual inspection in Nsawam began with sheer panic for fourteen-year-old Daniel. It was the most important day of the term; students who appeared in immaculate uniforms and arrived before the final 7:30 a.m. bell were to be considered for prefectorial honors. Having overslept after studying late, Daniel bolted out of his house in his pristine, starch-white uniform, his heart thumping against his ribs as his wristwatch showed 7:15 a.m.\n\nArriving at the main junction, despair gripped him. The safe asphalt road curved around the rocky ridge, requiring twenty-five minutes of rapid walking. A few meters away lay an overgrown, deserted track through the Densu marshland. Elders had warned children for years that the swamp was treacherous, but Daniel brushed the memory aside. \"If I run through the marsh, I can reach the back gate in seven minutes,\" he muttered to himself in frantic impatience. Blinded by panic, he charged down the muddy slope without inspecting the ground ahead.\n\nFor the first hundred meters, the soil seemed firm. Reaching a broad depression covered in a lush, emerald blanket of green ferns, Daniel leaped forward with full momentum. That reckless leap proved catastrophic! The green ferns were not solid ground; they were a floating carpet over a deep quagmire of decomposing silt and stagnant mud. The crust ruptured instantly, and Daniel plummeted waist-deep into foul-smelling black sludge.\n\nTears of horror flooded his eyes as the cold, slimy muck sucked him deeper. Thrashing wildly, he lost his school shoes and backpack in the mud. Desperately lunging forward, his fingers clawed into thorny elephant grass, and he dragged his trembling, mud-encrusted body onto the embankment. Staring at his ruined, blackened uniform while the distant school inspection bell tolled, Daniel wept in bitter humiliation. He had learned the timeless truth the hard way: always look before you leap.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Descriptive: An Inter-Schools Cultural Dance Competition
  {
    id: "B8_S4_E_F_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Descriptive Essay",
    title: "The Thunder of Drums at the Cultural Gala",
    shortSummary: "Write a descriptive essay recreating the visual colors, rhythmic drumming, and kinetic energy of an inter-schools cultural dance gala.",
    prompt: "Your school hosted the district inter-schools cultural dance competition. Write a descriptive essay recreating the colorful traditional costumes, the complex rhythms of indigenous drums (Adowa, Kpanlogo, Agbadza), the expressive body movements of the student dancers, and the electric audience response.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Cultural Multi-Sensory Description, Auditory Rhythm Capture & Kinetic Movement Exposition",
    learningCompetency: "B8.4.2.2.1: Write descriptive essays recreating indigenous cultural performances through kinetic verbs, auditory rhythms, and traditional regalia imagery.",
    hint: "Use spatial progression: the decorated open-air arena, the entrance of the Adowa dancers in kente and beads, the rhythmic mastery of the drumming ensemble, and the thunderous roar of the crowd.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "A Celebration of Rhythm and Movement",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and kinetic progression through an indigenous cultural dance performance.",
        stagePrompts: [
          { stageIndex: 1, role: "The Arena Setting", guidingQuestion: "Set the scene at the open-air school quadrangle draped in handwoven cloths and surrounded by eager spectators.", transitionHints: ["Under the golden canopy of a warm Friday afternoon, our school quadrangle was transformed into...", "Benches overflowed with traditional elders, teachers, and hundreds of students dressed in ceremonial calico..."] },
          { stageIndex: 2, role: "The Drumming Ensemble (Auditory Power)", guidingQuestion: "Describe the master drummer, the deep thunder of fontomfrom, and clinking iron bells setting the tempo.", transitionHints: ["The performance ignited with a sudden, deafening strike on the fontomfrom drums...", "The master drummer, his bare chest glistening with perspiration, commanded the rhythms with curved wooden sticks..."] },
          { stageIndex: 3, role: "The Dancers' Entrance (Visual & Kinetic)", guidingQuestion: "Depict the Adowa dancers gliding onto the stage in rich kente wrappers, intricate beaded armlets, and expressive hand gestures.", transitionHints: ["Onto the red clay performance circle glided twelve female dancers in synchronized harmony...", "Draped in authentic kente cloths with golden aggry beads rattling around their ankles, their graceful wrists twisted..."] },
          { stageIndex: 4, role: "The Crescendo & Cultural Reflection", guidingQuestion: "Describe the breathtaking acceleration of the rhythm, the final acrobatic flourish, and the roaring audience standing ovation.", transitionHints: ["As the tempo accelerated to an electrifying crescendo, the dancers' footwork blurred with astounding agility...", "When the final drum beat cracked like thunder, the entire crowd rose in a deafening standing ovation, celebrating our living heritage..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Cultural Reflection",
        proverbOrClosingPhrase: "Traditional dance is the poetic heartbeat of African ancestral history.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating traditional dance as living history."
      }
    },
    rubric: createWAECRubric(
      ["Cultural arena and crowd atmosphere established (2 marks)", "Master drumming rhythms and acoustic intensity depicted vividly (4 marks)", "Synchronized dancer movements, regalia, and roaring finale conveyed (4 marks)"],
      ["Arena setting vivid", "Auditory and kinetic imagery rich", "Cultural pride conveyed clearly"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich cultural and kinetic vocabulary (4 marks)", "Apt similes and rhythmic adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Kinetic words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `A Celebration of Rhythm and Movement\n_____________________________________\n\nUnder the golden light of a warm Friday afternoon, the central quadrangle of our school was transformed into an electric amphitheater of African heritage for the district inter-schools cultural dance festival. Hundreds of students, teachers, and traditional elders packed the wooden bleachers, their excited chatter mingling with the crisp rustle of national flags and colorful ceremonial canopies.\n\nThe performance ignited with an explosive volley from the drumming ensemble. Bare-chested master drummers, their muscular arms glistening with sweat, bent over giant, hand-carved fontomfrom drums. Striking the cowhide membranes with curved wooden sticks, they unleashed deep, thunderous rhythms that resonated in the chest of every spectator. Iron dawuro bells clinked in rapid, intricate counterpoint, while gourds strung with cowrie shells shook with a sharp, hypnotic hiss that commanded the entire field to listen.\n\nOnto the performance arena glided our school's Adowa dance troupe, moving in synchronized, breathtaking grace. Dressed in rich emerald and gold kente wrappers wound tightly above their chests, their bare feet moved with effortless precision across the ground. Multi-colored aggry beads rattled musically around their wrists and ankles with every rhythmic step. With eyes cast down in traditional modesty, their hands executed complex, fluid gestures—communicating ancient proverbs of welcome, courage, and royal victory that brought nods of deep admiration from the village chiefs.\n\nAs the drumming quickened into a dizzying, climactic crescendo, the lead dancers accelerated their footwork into an agile, mesmerizing blur of motion. On the final crack of the master drum, they dropped into an elegant, freeze-frame bow. For an instant, breathless silence hung over the field—before the entire arena erupted into a roaring standing ovation! Watching those young dancers celebrate our living heritage, I knew our ancestral culture will never die.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Article for Publication: The Hazards of Poor Drainage and Flooding
  {
    id: "B8_S4_E_F_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Article for Publication",
    title: "Curbing the Perennial Menace of Urban Floods",
    shortSummary: "Write an article for publication in a national newspaper on urban flooding caused by choked drainage gutters.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'Choked Gutters and the Perennial Menace of Urban Flooding.' Examine how indiscriminate dumping of solid waste blocks concrete storm drains, analyze the resulting destruction of property and disease outbreaks, and recommend two practical municipal engineering and community cleanup reforms.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Urban Environmental Analysis & Municipal Engineering Proposals",
    learningCompetency: "B8.4.2.1.2: Compose structured articles for publication analyzing urban drainage infrastructure, civic indiscipline, and municipal engineering reforms.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, root causes, flooding fallout, and practical solutions.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "CHOKED GUTTERS AND THE PERENNIAL MENACE OF URBAN FLOODING",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Francisca Mensah, Basic 8A",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Civic Irresponsibility & Choked Drains -> Human and Economic Devastation -> Engineering and Civic Remedies).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and depict how a simple two-hour rainstorm turns city streets into deadly rivers of floodwater.", transitionHints: ["Whenever the dark storm clouds gather over our major cities, terror grips urban residents...", "What should be a refreshing shower of rain inevitably turns into a destructive catastrophe of rushing floodwaters..."] },
          { stageIndex: 2, role: "Civic Indiscipline & Choked Drains", guidingQuestion: "Analyze how residents dumping plastic trash and household garbage into concrete gutters chokes the storm drainage network.", transitionHints: ["The root cause of this annual tragedy is not nature's cruelty, but human indiscipline...", "Concrete storm drains designed to convey stormwater to the sea have been turned into communal dumping grounds for..."] },
          { stageIndex: 3, role: "Economic Destruction & Disease Outbreaks", guidingQuestion: "Examine the destruction of homes, submerged roads, displaced families, and cholera outbreaks.", transitionHints: ["The devastation left in the wake of these avoidable floods is heartbreaking...", "Torrential runoff, blocked by plastic dams, bursts gutter banks to submerge living rooms, destroy market merchandise, and contaminate..."] },
          { stageIndex: 4, role: "Municipal Engineering & Enforcement Reforms", guidingQuestion: "Propose two actionable solutions (constructing covered storm drains and enforcing heavy fines on gutter dumpers) with a call to action.", transitionHints: ["To break this perennial cycle of disaster, municipal authorities must execute bold reforms...", "First, open gutters must be replaced with covered concrete drains, while sanitation guards strictly enforce..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Civic Appeal",
        proverbOrClosingPhrase: "Water will always find its path; we must not block it with our own filth.",
        integrationRule: "End with an inspiring appeal urging municipal assemblies and citizens to treat drainage systems with discipline."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and urban flooding terror established (2 marks)", "Indiscriminate gutter dumping and economic/health devastation analyzed (4 marks)", "Two actionable engineering and enforcement solutions with peroration presented (4 marks)"],
      ["Lead hook clear", "Causes and consequences detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental and municipal engineering vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `CHOKED GUTTERS AND THE PERENNIAL MENACE OF URBAN FLOODING\nBy Francisca Mensah, Basic 8A\n\nWhenever dark, bruised rain clouds gather over our cities, terror grips the hearts of urban residents. What should be a welcome, refreshing blessing of rain inevitably transforms into a terrifying ordeal of destruction, displacement, and loss of life. Yet, a dispassionate examination of this annual nightmare reveals that our floods are not acts of an angry nature; they are the direct, predictable outcome of human indiscipline and neglected drainage infrastructure.\n\nThe primary driver of this crisis is the widespread practice of converting public storm gutters into communal refuse dumps. Concrete drainage channels constructed to evacuate stormwater into lagoons and the sea are choked with mountains of plastic bottles, polythene bags, and household garbage. Residents habitually empty trash cans into gutters during downpours, assuming the current will carry the waste away. Instead, non-biodegradable plastics form impenetrable dams, trapping silt and reducing the capacity of drainage channels by over eighty percent.\n\nThe resulting devastation is heartbreaking. Denied a passage, torrential stormwater bursts gutter banks, turning roads into raging rivers and submerging residential neighborhoods. Families wake up at midnight to find their mattresses, furniture, and electronic appliances floating in murky water. Worse still, floodwaters wash sewage from septic tanks into broken municipal water pipes, triggering catastrophic outbreaks of cholera, typhoid, and dysentery that hospitalize hundreds of vulnerable children every rainy season.\n\nTo break this deadly cycle, municipal assemblies must immediately take two decisive actions. First, all open gutters must be systematically engineered into covered underground storm drains, preventing citizens from dumping refuse into them. Second, local assemblies must rigorously enforce sanitation bylaws, deploying plainclothes sanitation officers to arrest and prosecute anyone caught dumping waste into drainage paths. Water will always reclaim its natural path; let us stop choking it with our own filth.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Debate: Private Schools vs. Public Schools (Supporting Public Schools)
  {
    id: "B8_S4_E_F_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Debate Speech",
    title: "Public Basic Schools Are More Beneficial to the Nation Than Private Schools",
    shortSummary: "Speak in support of the motion that public basic schools contribute more to national development than private schools.",
    prompt: "You are the principal speaker in an inter-schools debate competition on the motion: 'Public Basic Schools Contribute More to National Development Than Private Schools.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding equitable access for the poor and professionally certified teachers, while refuting opposing claims on private school academic scores.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B8.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on free access for underprivileged children and trained, certified teachers. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that Public Basic Schools contribute far more to national development than Private Schools.",
        prohibitedOpenings: ["Good morning to you all", "I am standing here to speak"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Democratic Universal Access -> Professionally Certified Teachers -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with unshakeable conviction today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Universal Equitable Access", guidingQuestion: "Explain how public basic schools educate ninety percent of the population, lifting the poor out of poverty without profit motives.", transitionHints: ["First and foremost, true national development is measured by inclusivity, not exclusivity...", "While private schools cater to the wealthy minority in urban enclaves, public schools provide free, universal education to millions of rural children..."] },
          { stageIndex: 3, role: "Second Argument: Professionally Certified Teachers", guidingQuestion: "Highlight that public school tutors are university-trained, government-certified professionals with pedagogical mastery.", transitionHints: ["Secondly, public basic schools boast professionally certified educators...", "Unlike private schools that frequently employ uncertified secondary school leavers on starvation wages, public schools are staffed by university-educated teachers..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on private school BECE pass rates, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will point proudly to private school BECE examination rankings; however, this superficial claim collapses because...", "With these undeniable truths, I urge you all to vote resoundingly in favor of the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Public education is the democratic pillar that holds the nation together.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Universal access for poor children argument developed cogently (4 marks)", "Certified teacher quality and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Public Basic Schools Contribute More to National Development Than Private Schools.\"\n\nFirst and foremost, true national development is measured by democratic inclusivity, not commercial exclusivity. Ghana cannot develop when quality education is accessible only to the children of the wealthy elite. Private schools operate primarily as profit-driven businesses concentrated in wealthy urban enclaves, charging exorbitant fees that shut out eighty percent of our population. In stark contrast, public basic schools stand as the democratic equalizer, providing free education, free textbooks, and school feeding programs to millions of children in impoverished rural villages and farming communities. Public schools ensure that the daughter of a cocoa farmer and the son of a fisherman can rise to become doctors, engineers, and presidents!\n\nSecondly, public basic schools are staffed by professionally certified, university-trained teachers. The Ghana Education Service recruits educators who have completed rigorous pedagogical training in accredited Colleges of Education and universities. They understand child psychology, curriculum methodologies, and inclusive teaching techniques. In contrast, many private school proprietors, driven by profit maximization, cut costs by hiring uncertified senior high school leavers whom they pay exploitative wages. Which system guarantees durable, professional educational foundation? The public system, without question!\n\nMy worthy opponents will boast about private school BECE examination pass rates. But let us unmask that illusion! Private schools achieve high test scores through ruthless selective admissions, weeding out struggling pupils, and subjecting children to endless commercial cramming. Public schools, however, take in all learners, regardless of academic background, transforming raw potential into disciplined citizens.\n\nMr. Chairman, private schools serve private bank accounts, but public schools build the sovereign nation. I urge you all to vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Narrative: An Unexpected Outbreak of Fire in a School Dormitory
  {
    id: "B8_S4_E_F_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Narrative Essay",
    title: "Night of the Blazing Dormitory",
    shortSummary: "Write a narrative story recounting the chaos and heroic evacuation during an unexpected dormitory fire.",
    prompt: "An electrical short-circuit triggered an unexpected fire in your boarding school dormitory while students were at evening prep. Write a narrative essay recounting the panicked evacuation, describing the roaring flames and thick smoke, and sharing how a student leader's quick action saved a trapped junior pupil.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Dramatic Action Pacing, Crisis Evacuation Narrative & Heroic Climax",
    learningCompetency: "B8.4.2.1.1: Compose suspenseful narrative stories depicting sudden emergency crises, heroic evacuation leadership, and emotional relief.",
    hint: "Start with the peaceful evening prep, build up the sudden shout of fire, describe the roaring blaze and smoke, narrate the daring rescue of the trapped boy, and conclude with the arrival of firefighters.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Night the Dormitory Burned",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing quiet study baseline, sudden fire alarm, daring rescue, and relief.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Baseline", guidingQuestion: "Describe the quiet, studious atmosphere in the classrooms during mandatory evening prep.", transitionHints: ["It was a tranquil Thursday evening at St. Paul's Boarding School...", "Inside the brightly lit classrooms, over two hundred students were immersed in silent study prep when..."] },
          { stageIndex: 2, role: "Inciting Incident & The Alarm", guidingQuestion: "Describe the sudden smell of burning wires, a blinding flash, and the terrifying scream of 'Fire!'.", transitionHints: ["The peaceful silence was shattered by a pungent stench of burning plastic and acrid smoke...", "Suddenly, an ear-splitting shriek pierced the night: \"Fire! The junior block is on fire!\"..."] },
          { stageIndex: 3, role: "Rising Action & The Trapped Junior", guidingQuestion: "Narrate the chaotic stampede onto the field and discovering that a sick first-year pupil was trapped inside the smoke-filled room.", transitionHints: ["Flames roared into the night sky, leaping across the wooden rafters of House 2...", "During the frantic head-count on the soccer field, a terrified house prefect realized that sick junior boy Kwame was still asleep inside..."] },
          { stageIndex: 4, role: "Climax, Heroic Rescue & Denouement", guidingQuestion: "Describe the house prefect soaking a blanket, plunging into the smoke, carrying the boy out to safety, and the arrival of fire tenders.", transitionHints: ["Soaking a heavy woolen blanket in water, our senior house prefect plunged into the blinding smoke...", "Emerging moments later coughing violently with the gasping boy in his arms, the crowd cheered in tears as fire engines wailed..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Heroic Reflection",
        proverbOrClosingPhrase: "True courage shines brightest in the darkest hours of danger.",
        integrationRule: "Conclude with an emotional reflection celebrating selfless leadership and human resilience."
      }
    },
    rubric: createWAECRubric(
      ["Evening prep baseline and peaceful setting established (2 marks)", "Sudden fire eruption and trapped junior pupil discovery depicted vividly (4 marks)", "Heroic soaked-blanket rescue and emotional relief conveyed (4 marks)"],
      ["School setting established", "Fire chaos vivid and kinetic", "Rescue operation clear"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative perspective (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Dynamic action verbs and fire imagery (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and emotional adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Night the Dormitory Burned\n________________________________\n\nIt was a serene Thursday evening at St. Paul's Boarding School. Inside the well-lit classroom blocks, over two hundred pupils were immersed in mandatory evening study prep. The only sounds breaking the night silence were the scratching of pens on notebooks and the occasional turn of a textbook page. Nobody could have anticipated the fiery nightmare about to unfold.\n\nAt precisely 7:45 p.m., a pungent, suffocating odor of scorched electrical insulation drifted through the open windows, followed by an abrupt, blinding spark from the main transformer. Seconds later, a terrified scream pierced the darkness: \"Fire! House Two is burning!\" Pandemonium erupted instantly. Pupils shoved chairs aside and scrambled through doorways in a frantic stampede toward the open assembly field, coughing as thick, oily plumes of black smoke billowed across the compound. Looking toward the boarding quadrangle, tongues of crimson and orange flame were already leaping through the roof of the junior dormitory.\n\nOut on the grass, amid sobbing and confusion, our Housemaster conducted a frantic head-count. Suddenly, someone gasped in horror: \"Kwame! Kwame was sick with malaria and sleeping in Bed 14!\" The dormitory was now an inferno; roaring flames crackled through the dry wooden ceiling rafters, and scorching heat pushed teachers back. Without hesitating, our senior dormitory prefect, Emmanuel, grabbed a heavy woolen blanket, drenched it in a nearby water drum, wrapped it over his head, and charged directly into the smoke-filled doorway.\n\nTwo agonizing minutes passed. We held our breath in terrified silence as burning ceiling boards crashed inside. Then, through the swirling black smoke, Emmanuel staggered out onto the veranda, coughing violently and clutching the semi-conscious, gasping boy wrapped in the steaming blanket. The crowd erupted into deafening cheers of relief as volunteer teachers pulled them onto the grass, just as the distant sirens of municipal fire engines wailed through the night gates. That night taught us all that true leadership is measured by courage in the face of mortal peril.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Descriptive: The Atmosphere Inside a Crowded Central Market on a Saturday
  {
    id: "B8_S4_E_F_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Descriptive Essay",
    title: "The Sensory Tapestry of Kejetia Market",
    shortSummary: "Write a descriptive essay recreating the visual sights, shouting commerce, and aromas of Kejetia Market on a busy Saturday.",
    prompt: "Kejetia Market in Kumasi is renowned as one of the largest and most vibrant commercial markets in West Africa. Write a descriptive essay recreating a Saturday morning visit, vividly depicting the maze of colorful stalls, the aromatic mingling of spices and fresh produce, the shouting barter of traders, and the surging sea of shoppers.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Sensory Market Exposition, Spatial Maze Progression & Kinetic Human Commerce",
    learningCompetency: "B8.4.2.2.1: Write descriptive essays recreating commercial urban marketplaces through rich auditory, olfactory, visual, and tactile sensory registers.",
    hint: "Use spatial progression: entering through the crowded entrance gates, navigating the aromatic food and spice alleys, moving through the vibrant textiles section, and soaking in the energetic pulse of human commerce.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Beating Heart of Kejetia Market",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and multi-sensory progression through a bustling urban market on a busy Saturday.",
        stagePrompts: [
          { stageIndex: 1, role: "Entering the Commercial Whirlwind", guidingQuestion: "Set the scene at mid-morning outside Kejetia Market with honking minibuses, barrow-pushers, and surging crowds.", transitionHints: ["Stepping into the bustling entrance of Kejetia Market on a blazing Saturday morning...", "A surging river of thousands of shoppers sweeps you into a vibrant commercial labyrinth..."] },
          { stageIndex: 2, role: "The Fresh Produce Alleys (Olfactory & Visual)", guidingQuestion: "Describe the colorful pyramids of red tomatoes, emerald peppers, and the pungent smell of smoked herrings.", transitionHints: ["The vegetable and spice corridor is an explosion of raw color and fragrance...", "Heaping pyramids of glossy crimson tomatoes and fiery yellow scotch-bonnet peppers stand beside baskets of..."] },
          { stageIndex: 3, role: "The Auditory Cacophony & Street Barter", guidingQuestion: "Capture the clatter of barrows, blaring gospel music from megaphones, and shouting market women haggling prices.", transitionHints: ["The auditory atmosphere is an exhilarating urban symphony...", "Barrow-pushers bellow \"Agoo! Agoo!\" to part the crowds, while cloth merchants shout prices above the blare of..."] },
          { stageIndex: 4, role: "The Textile Section & Cultural Reflection", guidingQuestion: "Describe walking into the vibrant fabric lanes draped in kente and wax prints, reflecting on the resilient spirit of trade.", transitionHints: ["Deep inside the covered market halls, corridors open into dazzling avenues of wax prints and handwoven kente...", "Walking through this endless labyrinth of energy and enterprise, I felt the unmistakable vitality of Ghanaian commerce..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Cultural Reflection",
        proverbOrClosingPhrase: "The market is the bustling heartbeat of a nation's industrious spirit.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating commercial resilience and community energy."
      }
    },
    rubric: createWAECRubric(
      ["Market entrance and crowd surge established (2 marks)", "Vivid sensory description of produce, spices, and smoked fish (4 marks)", "Auditory street banter, textile colors, and cultural vitality conveyed (4 marks)"],
      ["Market setting vivid", "Sensory cues (smell, sound, sight) rich", "Commercial energy captured"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich commercial and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `The Beating Heart of Kejetia Market\n___________________________________\n\nStepping through the towering entrance arches of Kejetia Market on a bustling Saturday morning, one is instantly swept up into a roaring, colorful river of human energy. What begins as a crowded pavement outside dissolves into a boundless commercial labyrinth under a sea of corrugated iron roofs and blue canvas awnings. The humid air vibrates with the deafening chorus of thousands of eager voices, honking minibus horns, and the rhythmic clatter of wooden wheelbarrows navigating narrow concrete alleys.\n\nThe food and spice section is an intoxicating festival of sensory impressions. Towering, symmetrical pyramids of glossy crimson tomatoes and bright yellow scotch-bonnet peppers gleam under the filtered sunlight. Beside them, wooden tables overflow with earthy mounds of freshly harvested yam tubers and vibrant green plantain bunches. The rich, pungent scent of smoked salmon and salted tilapia mingles intimately with the sharp, warm aroma of crushed ginger, garlic roots, and wild dried basil, creating a fragrance that is unmistakably Ghanaian.\n\nThe auditory atmosphere is an exhilarating urban symphony. Muscular barrow-pushers, their brown shoulders glistening with sweat as they haul heavy crates of merchandise, bellow \"Agoo! Agoo!\" to clear a path through the packed crowd. Sharp-tongued market women, draped in bright calico head-ties, clap their hands rhythmically while singing out discounts on enamel bowls. Around every corner, small battery-powered megaphones blare competing highlife songs and commercial advertisements, while shoppers haggle stubbornly over prices in lively bursts of Twi and Ga.\n\nDeeper inside the covered pavilions, the market transitions into the dazzling elegance of the textile lanes. Yards of majestic wax prints and handwoven kente cloths hang from high rafters like royal tapestries, their intricate patterns glowing under warm light bulbs. Navigating this endless maze of industrious enterprise, I stood in awe of the relentless determination and cultural vibrancy that makes Kejetia the beating economic heart of West Africa.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B8FoundationClean() {
  console.log("Building clean 60-item Strand 4 B8 Foundation Practice Lab...");
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
      id: `B8_S4_E_F_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B8",
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
      learningCompetency: "B8.4.2.1: Demonstrate foundation mastery of narrative plot structures, sensory travelogue descriptions, article headline-byline rules, and parliamentary debate mechanics."
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
    difficulty: "foundation",
    title: "Basic 8 Foundation Writing Lab: 50 Objective Rhetoric Drills + 10 Theory Extended Compositions",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B8_foundation`
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
          b8: {
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all60Items.length} items to B8 Foundation Practice Labs!`);
}

deployStrand4B8FoundationClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B8 Foundation Clean 60 Lab:", err);
    process.exit(1);
  });

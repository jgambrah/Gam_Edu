import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// =========================================================================
// TYPES & SCHEMAS
// =========================================================================

export type LetterFormalityType = 'informal' | 'semi_formal' | 'formal_administrative' | 'civic_petition';
export type AddressStyle = 'blocked' | 'slanted_indented';
export type AddressPunctuation = 'open' | 'closed';
export type CaptionStyle = 'full_caps_no_underline' | 'title_case_underlined' | 'none';
export type SignOffFormat = 'mononymic' | 'semi_formal' | 'quadripartite';

export interface GuidanceScaffold {
  letterType: LetterFormalityType;
  senderAddress: {
    recommendedStyle: AddressStyle;
    recommendedPunctuation: AddressPunctuation;
    defaultLinesPlaceholder: string[];
    allowedDatingFormats: string[];
    prohibitedDatingFormats: string[];
  };
  insideAddress?: {
    isRequired: boolean;
    titleDesignationPlaceholder?: string;
    officeOrSchoolPlaceholder?: string;
    postalBoxPlaceholder?: string;
    townRegionPlaceholder?: string;
    formatContaminationPenaltyWarning: string;
  };
  salutationGuide: {
    recommendedSalutation: string;
    permissibleSalutations: string[];
    bannedSalutations: string[];
  };
  captionGuide?: {
    isRequired: boolean;
    recommendedStyle: CaptionStyle;
    modelCaption: string;
    rules: string[];
  };
  bodyGuidance: {
    minimumWordCount: number;
    targetWordCount: number;
    recommendedParagraphs: number;
    paragraphPrompts: Array<{
      paragraphIndex: number;
      role: 'preamble_opening' | 'exposition_body_1' | 'exposition_body_2' | 'requisition_prayer' | 'valediction_conclusion';
      guidingQuestion: string;
      transitionHints: string[];
    }>;
  };
  signOffGuide: {
    format: SignOffFormat;
    subscription: string;
    requiresHandwrittenSignature: boolean;
    printedNameFormat: 'first_name_only' | 'full_name_title_case';
    designationPlaceholder?: string;
    coOccurrenceConstraint: string;
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
  difficulty: "advanced";
  category: "Epistolary Mechanics";
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
  difficulty: "advanced";
  category: "Informal Letter" | "Semi-Formal Letter" | "Formal Letter" | "Civic Petition";
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

// Defensive credential resolver supporting local execution & ADC
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
      displayName: "Organization & Epistolary Layout",
      maxMarks: 5,
      scoringGuidelines: orgGuide,
      diagnosticChecklist: orgCheck
    },
    expression: {
      name: "expression",
      displayName: "Expression, Tone & Register",
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
        "Consistent subject-verb agreement across embedded clauses",
        "Proper sequence of tenses and modal consistency",
        "Absolute absence of contractions and colloquial slang in formal registers"
      ]
    }
  }
});

const rawObjective50Data = [
  {
    "passage": "A candidate writes the inside address of a formal petition as: 'The Honourable Regional Minister, Regional Coordinating Council, P.O. Box 100, Sunyani.'.",
    "question": "In closed punctuation style, which character must end each intermediate line before the final period?",
    "options": [
      "A comma",
      "A semicolon",
      "A full stop",
      "No punctuation mark"
    ],
    "answer": "A comma",
    "hint": "Closed punctuation ends every intermediate line with a comma.",
    "solution": "Under closed punctuation rules, every intermediate line of an address block must terminate with a comma, reserving the full stop solely for the final line.",
    "target": "Address Architecture: Closed Punctuation Line Termination"
  },
  {
    "passage": "In a formal query response to a school board, a student writes: 'I am in receipt of your letter dated 10th October and write to state that I didn't steal the chemicals.'",
    "question": "What specific register violation occurs in this sentence?",
    "options": [
      "Using the informal contracted form 'didn't' in a formal administrative query response",
      "Using passive voice incorrectly",
      "Starting with 'I am in receipt'",
      "Omitting the recipient's phone number"
    ],
    "answer": "Using the informal contracted form 'didn't' in a formal administrative query response",
    "hint": "Contracted auxiliary verbs are strictly barred from formal letters.",
    "solution": "In formal correspondence, contracted verbs like 'didn't' compromise institutional dignity and are penalized under Expression. The full form 'did not' is mandatory.",
    "target": "Formal Register: Contraction Penalties"
  },
  {
    "passage": "A candidate uses the open punctuation convention for the sender's address.",
    "question": "Which of the following date presentations strictly satisfies pure open punctuation?",
    "options": [
      "14 October 2026",
      "14th October, 2026.",
      "14th October, 2026",
      "October 14th, 2026."
    ],
    "answer": "14 October 2026",
    "hint": "Pure open punctuation eliminates commas, ordinal abbreviations, and terminal periods.",
    "solution": "Pure open punctuation uses cardinal numbers without ordinal suffixes ('th') and dispenses with commas and terminal periods: '14 October 2026'.",
    "target": "Address Architecture: Pure Open Punctuation Dating"
  },
  {
    "passage": "A letter is addressed to: 'The Paramount Chief, Dormaa Traditional Council, Dormaa Ahenkro.'.",
    "question": "Which formal salutation best reflects standard Ghanaian administrative and traditional protocol?",
    "options": [
      "Nana, / His Royal Majesty, / Dear Sir,",
      "Dear Paramount Chief Kwame,",
      "Hello Chief,",
      "Mr. Paramount Chief,"
    ],
    "answer": "Nana, / His Royal Majesty, / Dear Sir,",
    "hint": "Traditional rulers are addressed using respectful traditional titles or formal honorifics.",
    "solution": "Formal petitions and official correspondence to traditional rulers employ respectful honorifics like 'Nana,', 'His Royal Majesty,', or the standard administrative 'Dear Sir,'.",
    "target": "Epistolary Salutations: Traditional Authorities"
  },
  {
    "passage": "A candidate writes the caption for an administrative petition as: <u>PETITION AGAINST CORRUPT LOGGING PRACTICES</u>.",
    "question": "Under WAEC Chief Examiner rubrics, why is this formatting penalized?",
    "options": [
      "Underlining a heading written in full block capital letters is a mechanical layout error",
      "The heading is too short",
      "A petition must never have a caption",
      "The words should have been written in pencil"
    ],
    "answer": "Underlining a heading written in full block capital letters is a mechanical layout error",
    "hint": "Headings in full capital letters must never be underlined.",
    "solution": "Captions in ALL CAPITAL LETTERS are already prominent; underlining them is considered a mechanical flaw under WAEC guidelines. Underlines belong strictly to Title Case captions.",
    "target": "Caption Orthography: Underlining Rules"
  },
  {
    "passage": "A student writing to the Senior Housemaster ends the letter with: 'Yours sincerely, \\n [Signature] \\n Kwame Mensah \\n Senior Prefect'.",
    "question": "Under what specific condition is the subscription 'Yours sincerely,' correct in this context?",
    "options": [
      "Only when the Housemaster was addressed by name in the salutation (e.g., 'Dear Mr. Mensah,')",
      "Whenever the writer is a school prefect",
      "Only when the letter is written during school hours",
      "Whenever two addresses are used"
    ],
    "answer": "Only when the Housemaster was addressed by name in the salutation (e.g., 'Dear Mr. Mensah,')",
    "hint": "'Yours sincerely,' requires a personal name in the salutation.",
    "solution": "The co-occurrence rule dictates that 'Yours sincerely,' can only follow a named salutation ('Dear Mr. Mensah,'). If the salutation was 'Dear Sir,', 'Yours faithfully,' is mandatory.",
    "target": "Co-Occurrence Constraint: Named vs. Unnamed Salutations"
  },
  {
    "passage": "A student writes an informal letter to his father seeking boarding house provisions.",
    "question": "Which sign-off is most appropriate and conforms to the mononymic rule?",
    "options": [
      "Your loving son, \\n Kwabena",
      "Yours faithfully, \\n Kwabena Mensah",
      "I remain, your humble servant, \\n K. Mensah",
      "Yours sincerely, \\n Master Kwabena Mensah"
    ],
    "answer": "Your loving son, \\n Kwabena",
    "hint": "Informal letters to family members require an affectionate closing and first name only.",
    "solution": "Family letters demand warm filial subscriptions ('Your loving son,') followed strictly by the writer's first name ('Kwabena') without surnames or formal signatures.",
    "target": "Informal Sign-off: Mononymic Rule"
  },
  {
    "passage": "In a letter to the Editor of a national newspaper, the writer signs off as: 'Yours faithfully, \\n [Signature] \\n Kofi Boateng \\n Kumasi'.",
    "question": "Why is the city 'Kumasi' appended on the fourth line instead of an official designation?",
    "options": [
      "Because public letters to the press require the contributor's residential town rather than an institutional post",
      "Because the writer forgot his school name",
      "Because the newspaper editor lives in Kumasi",
      "Because formal letters prohibit official designations"
    ],
    "answer": "Because public letters to the press require the contributor's residential town rather than an institutional post",
    "hint": "Letters to the press identify citizens by their residential location.",
    "solution": "In public letters to the press, private citizens indicate their geographical town or district (e.g., 'Kumasi') to establish locality for public commentary.",
    "target": "Letters to the Editor: Geographical Sign-off"
  },
  {
    "passage": "Which of the following sentences exhibits the most sophisticated formal administrative vocabulary?",
    "question": "Identify the best formal expression:",
    "options": [
      "I write to respectfully draw your attention to the deplorable state of the municipal drainage system.",
      "I am writing this letter to tell you that our gutters are very dirty and broken.",
      "Please look into our gutters because they smell bad and people are falling inside.",
      "Our drainage is in a mess and you have to send workers to fix it quickly."
    ],
    "answer": "I write to respectfully draw your attention to the deplorable state of the municipal drainage system.",
    "hint": "Formal writing uses elevated vocabulary like 'respectfully draw your attention' and 'deplorable'.",
    "solution": "'I write to respectfully draw your attention to the deplorable state...' demonstrates the elevated, dignified register expected in formal administrative correspondence.",
    "target": "Formal Administrative Lexis"
  },
  {
    "passage": "A student formats an address block using the traditional slanted (indented) format.",
    "question": "How should subsequent lines in a slanted address block be arranged?",
    "options": [
      "Each succeeding line should begin slightly to the right of the line above it",
      "All lines must be flush along the left vertical margin",
      "Lines must alternate between the left and right sides of the page",
      "Every line must be centered horizontally"
    ],
    "answer": "Each succeeding line should begin slightly to the right of the line above it",
    "hint": "Slanted formatting indents each progressive line.",
    "solution": "In traditional British slanted/indented address formatting, each subsequent line is indented several spaces to the right of the preceding line.",
    "target": "Address Styling: Slanted Formatting Mechanics"
  },
  {
    "passage": "A candidate writes: 'Neither the headmistress nor the teachers was present at the parade.'",
    "question": "Under the Principle of Proximity Concord, how must this sentence be corrected?",
    "options": [
      "Neither the headmistress nor the teachers were present at the parade.",
      "Neither the headmistress nor the teachers are present at the parade.",
      "Neither the headmistress nor the teachers has been present at the parade.",
      "Neither the headmistress or the teachers was present at the parade."
    ],
    "answer": "Neither the headmistress nor the teachers were present at the parade.",
    "hint": "With 'neither... nor', the verb agrees with the nearest subject ('teachers').",
    "solution": "The Principle of Proximity Concord mandates that when subjects are joined by 'neither... nor', the verb agrees in number with the nearest nominal ('teachers' -> 'were').",
    "target": "Syntactic Concord: Correlative Proximity"
  },
  {
    "passage": "A student writes a heading in Title Case: <u>An appeal for the construction of a footbridge.</u>",
    "question": "What two errors are present in this heading?",
    "options": [
      "The noun 'appeal' is uncapitalized and the heading ends with an illegal full stop",
      "The heading should have been in quotation marks and written in pencil",
      "The preposition 'for' should be capitalized and the underline omitted",
      "The article 'An' should be lowercase"
    ],
    "answer": "The noun 'appeal' is uncapitalized and the heading ends with an illegal full stop",
    "hint": "Major nouns in Title Case must be capitalized, and headings never take periods.",
    "solution": "In Title Case, major lexical words ('Appeal') must be capitalized, and headings must never terminate with a full stop.",
    "target": "Caption Mechanics: Title Case Rules"
  },
  {
    "passage": "Which of the following represents an ungrammatical resumptive pronoun error in a relative clause?",
    "question": "Identify the flawed sentence:",
    "options": [
      "The science laboratory which the PTA constructed it last year has leaked.",
      "The science laboratory which the PTA constructed last year has leaked.",
      "The science laboratory that the PTA constructed last year has leaked.",
      "The science laboratory constructed by the PTA last year has leaked."
    ],
    "answer": "The science laboratory which the PTA constructed it last year has leaked.",
    "hint": "Do not repeat the object pronoun ('it') when a relative pronoun already replaces it.",
    "solution": "In relative clauses, the relative pronoun ('which') replaces the object. Retaining 'it' ('constructed it') creates an ungrammatical resumptive pronoun error.",
    "target": "Syntax Mechanics: Resumptive Pronoun Prohibition"
  },
  {
    "passage": "A letter to a minister includes the sentence: 'It is essential that the municipal director attends the emergency session.'",
    "question": "Under the rules of the mandative subjunctive, how must 'attends' be corrected?",
    "options": [
      "attend",
      "attends",
      "attended",
      "is attending"
    ],
    "answer": "attend",
    "hint": "Mandative subjunctive clauses take the uninflected base verb without '-s'.",
    "solution": "Formulaic adjectives of necessity ('It is essential that...') trigger the mandative subjunctive, requiring the uninflected base verb ('attend'), suppressing third-person '-s'.",
    "target": "Advanced Syntax: Mandative Subjunctive"
  },
  {
    "passage": "A candidate writes the sender's address in blocked format on the top right, but begins the inside address directly beneath it on the right.",
    "question": "Where should the inside address be located?",
    "options": [
      "On the left-hand margin, below the level of the date line",
      "In the center of the page below the heading",
      "At the bottom of the page beneath the signature",
      "On the top right margin above the sender's address"
    ],
    "answer": "On the left-hand margin, below the level of the date line",
    "hint": "The recipient's inside address belongs on the left margin.",
    "solution": "In two-address formal layouts, the recipient's inside address is placed on the left-hand margin, starting below the sender's date line.",
    "target": "Formal Architecture: Inside Address Alignment"
  },
  {
    "passage": "A pupil writing an informal letter includes the phrase: 'I would be grateful if you could grant me an interview at your earliest convenience.'",
    "question": "What is wrong with this expression in an informal letter to a friend?",
    "options": [
      "It represents an overly formal, bureaucratic register unsuitable for friendly peer correspondence",
      "It contains grammatical errors",
      "It is too short",
      "It uses subjunctive mood incorrectly"
    ],
    "answer": "It represents an overly formal, bureaucratic register unsuitable for friendly peer correspondence",
    "hint": "Formal business clichés sound unnatural in letters to friends.",
    "solution": "Using formal recruitment clichés in an informal letter creates severe register dissonance. Friendly correspondence requires warm, natural language.",
    "target": "Epistolary Register Alignment"
  },
  {
    "passage": "Which of the following subscriptions is punctuated with absolute accuracy according to standard British/WAEC conventions?",
    "question": "Select the correctly punctuated subscription:",
    "options": [
      "Yours faithfully,",
      "Yours Faithfully,",
      "Your's faithfully,",
      "Yours faithfully."
    ],
    "answer": "Yours faithfully,",
    "hint": "Only the first word is capitalized, and it must end with a comma.",
    "solution": "'Yours faithfully,' correctly capitalizes only the opening word, avoids ungrammatical apostrophes, and terminates with a comma.",
    "target": "Subscription Mechanics: Casing and Punctuation"
  },
  {
    "passage": "A student writes: 'The headmaster as well as the teachers are traveling to Kumasi.'",
    "question": "Under standard concord rules governing parenthetical quasi-coordinators, how should the verb be corrected?",
    "options": [
      "is traveling",
      "are traveling",
      "were traveling",
      "have traveled"
    ],
    "answer": "is traveling",
    "hint": "'As well as' does not pluralize the singular subject 'headmaster'.",
    "solution": "Quasi-coordinators ('as well as') introduce parenthetical adjuncts. The singular head noun 'headmaster' controls concord, requiring the singular verb 'is traveling'.",
    "target": "Syntactic Concord: Intervening Parentheticals"
  },
  {
    "passage": "In a civic petition to a Municipal Chief Executive, which of the following represents the most effective opening for the prayer section?",
    "question": "Select the most appropriate formal prayer formula:",
    "options": [
      "We therefore humbly pray that your honorable office intervene by dispatching municipal engineers to reconstruct the culvert.",
      "You must immediately fix our culvert because we pay our taxes.",
      "We want you to send workers right now to solve the problem.",
      "Can your assembly try and help us with the culvert before next month?"
    ],
    "answer": "We therefore humbly pray that your honorable office intervene by dispatching municipal engineers to reconstruct the culvert.",
    "hint": "Formal petitions use respectful, precise prayer language.",
    "solution": "'We therefore humbly pray that your honorable office intervene...' embodies the standard forensic and respectful tone expected in administrative petitions.",
    "target": "Civic Petitions: The Formal Prayer Formula"
  },
  {
    "passage": "What is the primary stylistic hazard of using clichés like 'As cool as a cucumber' or 'Raining cats and dogs' in a formal letter?",
    "question": "Why should these idioms be avoided in formal writing?",
    "options": [
      "They are trite, informal colloquialisms that undermine institutional seriousness and degrade the Expression score",
      "They are too difficult for examiners to understand",
      "They increase the word count unnecessarily",
      "They violate British spelling rules"
    ],
    "answer": "They are trite, informal colloquialisms that undermine institutional seriousness and degrade the Expression score",
    "hint": "Clichés and idioms belong to colloquial conversation, not formal correspondence.",
    "solution": "Colloquial idioms and clichés are considered trite and informal. Formal letters require precise, literal, and dignified phrasing.",
    "target": "Expression: Idiomatic Cliché Penalties"
  },
  {
    "passage": "A candidate writes the date as: 'Wednesday, the 14th of October, 2026.'.",
    "question": "How is this date evaluated in standard epistolary marking?",
    "options": [
      "It is unnecessarily wordy and archaic; '14th October, 2026.' is the preferred concise standard",
      "It is the only acceptable format in formal letters",
      "It is an immediate failure in layout",
      "It is penalized under Content"
    ],
    "answer": "It is unnecessarily wordy and archaic; '14th October, 2026.' is the preferred concise standard",
    "hint": "Modern epistolary dating avoids unnecessary words like 'the' and 'of'.",
    "solution": "While grammatically intelligible, including 'Wednesday, the... of...' is archaic and unnecessarily wordy. Standard practice favors '14th October, 2026.'.",
    "target": "Dating Conventions: Conciseness"
  },
  {
    "passage": "Which of the following is considered an acceptable mononymic sign-off for an informal letter?",
    "question": "Select the proper informal name format:",
    "options": [
      "Kwame",
      "Kwame Mensah",
      "Master Kwame Mensah",
      "K. Mensah (Student)"
    ],
    "answer": "Kwame",
    "hint": "Mononymic means using only the first name.",
    "solution": "The mononymic sign-off rule requires the writer's first name only ('Kwame') in informal correspondence.",
    "target": "Informal Sign-off: Mononymic Standards"
  },
  {
    "passage": "A formal letter addressed to an administrative officer begins with: 'Dear Sir,'.",
    "question": "Which of the following subscriptions represents a fatal layout error?",
    "options": [
      "Yours sincerely,",
      "Yours faithfully,",
      "Respectfully yours,",
      "Yours truly,"
    ],
    "answer": "Yours sincerely,",
    "hint": "'Dear Sir,' must never be paired with 'Yours sincerely,'.",
    "solution": "Pairing 'Dear Sir,' with 'Yours sincerely,' is a major co-occurrence violation in British and WAEC epistolary frameworks, penalized under Organization.",
    "target": "Co-Occurrence Constraint: Unnamed Salutations"
  },
  {
    "passage": "A candidate writes a formal complaint letter and uses the sentence: 'The contractors didn't do the work well and they won't get away with it.'",
    "question": "How should this sentence be revised for formal administrative compliance?",
    "options": [
      "The contractors failed to execute the project according to specifications, and administrative sanctions should be applied.",
      "The contractors didn't do their job well and must be punished.",
      "The contractors have done rubbish work and won't get paid.",
      "The contractors did bad work and can't go free."
    ],
    "answer": "The contractors failed to execute the project according to specifications, and administrative sanctions should be applied.",
    "hint": "Replace contractions and colloquialisms with objective administrative vocabulary.",
    "solution": "The revised version eliminates contractions ('didn't', 'won't') and colloquial phrasing ('get away with it'), replacing them with objective, elevated vocabulary.",
    "target": "Formal Lexical Elevation"
  },
  {
    "passage": "In an administrative petition to a Municipal Chief Executive, where should the petition's subject heading be placed?",
    "question": "Select the correct vertical location:",
    "options": [
      "Immediately below the salutation ('Dear Sir,') and above the opening paragraph",
      "Above the recipient's inside address",
      "At the very bottom of the letter below the signature",
      "Inside the third paragraph"
    ],
    "answer": "Immediately below the salutation ('Dear Sir,') and above the opening paragraph",
    "hint": "The caption sits between the salutation and the first paragraph.",
    "solution": "In standard formal letter and petition layout, the caption is positioned between the salutation and the preamble (opening paragraph).",
    "target": "Formal Layout: Caption Placement"
  },
  {
    "passage": "Which of the following sentences correctly applies Second Conditional irrealis subjunctive in a formal appeal?",
    "question": "Identify the grammatically correct hypothetical construction:",
    "options": [
      "If the assembly were to allocate supplementary funding, the school clinic would be completed ahead of schedule.",
      "If the assembly was to allocate supplementary funding, the school clinic will be completed ahead of schedule.",
      "If the assembly will allocate supplementary funding, the school clinic would be completed ahead of schedule.",
      "If the assembly would allocate supplementary funding, the school clinic had been completed ahead of schedule."
    ],
    "answer": "If the assembly were to allocate supplementary funding, the school clinic would be completed ahead of schedule.",
    "hint": "Second Conditional hypothetical statements require 'were + to-infinitive' and 'would + base verb'.",
    "solution": "Formal irrealis hypothetical conditions use the subjunctive 'were to allocate' in the protasis, paired with 'would be completed' in the apodosis.",
    "target": "Advanced Syntax: Second Conditional Subjunctive"
  },
  {
    "passage": "A student writing a letter of inquiry to an educational foundation ends the body with: 'I look forward to hearing from you at your earliest convenience.'",
    "question": "What prepositional complementation rule applies to the idiom 'look forward to'?",
    "options": [
      "It contains a true preposition 'to' and must be followed by a gerund ('hearing') or noun phrase",
      "It must always be followed by a bare infinitive ('hear')",
      "It must be followed by a past participle ('heard')",
      "It cannot take an object"
    ],
    "answer": "It contains a true preposition 'to' and must be followed by a gerund ('hearing') or noun phrase",
    "hint": "In 'look forward to', 'to' is a preposition requiring a gerund.",
    "solution": "In 'look forward to', 'to' functions as a preposition rather than an infinitival particle, strictly requiring a gerund complement ('hearing').",
    "target": "Grammatical Idioms: True Prepositional To"
  },
  {
    "passage": "What is the primary function of an inside address in formal correspondence?",
    "question": "State the administrative purpose:",
    "options": [
      "To specify the recipient's official title, department, and institutional address for archival and delivery precision",
      "To show off the writer's geographical knowledge",
      "To make the letter look longer to satisfy word count requirements",
      "To provide space for the recipient to write personal notes"
    ],
    "answer": "To specify the recipient's official title, department, and institutional address for archival and delivery precision",
    "hint": "Inside addresses record the recipient's official details for institutional delivery and filing.",
    "solution": "The inside address records the official title, department, and location of the recipient, ensuring precise routing, delivery, and institutional record-keeping.",
    "target": "Inside Address Functional Purpose"
  },
  {
    "passage": "A candidate writes the subscription: 'Yours Faithfully,'.",
    "question": "Why is the capital 'F' marked as an error in WAEC examinations?",
    "options": [
      "In standard epistolary mechanics, only the first word of the subscription is capitalized ('Yours faithfully,')",
      "Subscriptions must be written entirely in lowercase",
      "Subscriptions must be written entirely in capital letters",
      "The word 'Faithfully' is an archaic spelling"
    ],
    "answer": "In standard epistolary mechanics, only the first word of the subscription is capitalized ('Yours faithfully,')",
    "hint": "Only the initial letter of the opening word is capitalized.",
    "solution": "Prescriptive epistolary orthography dictates that only the initial letter of the first word takes a capital letter: 'Yours faithfully,'.",
    "target": "Subscription Mechanics: Casing Laws"
  },
  {
    "passage": "Which of the following opening sentences represents an acceptable informal epistolary hook?",
    "question": "Select the most engaging informal opening:",
    "options": [
      "You will never believe what happened at our inter-schools debate last Friday!",
      "I hereby write to announce the occurrence of a debate competition.",
      "Pursuant to our telephone conversation, I present details of a debate.",
      "This correspondence serves to inform you regarding a school debate."
    ],
    "answer": "You will never believe what happened at our inter-schools debate last Friday!",
    "hint": "Informal letters open with conversational enthusiasm.",
    "solution": "'You will never believe what happened...' provides an engaging, conversational hook that establishes natural peer rapport.",
    "target": "Informal Openings: Conversational Hooks"
  },
  {
    "passage": "A student writes a formal petition to a minister and forgets to sign his handwritten signature above his printed name.",
    "question": "Under which WAEC rubric criterion is this missing signature penalized?",
    "options": [
      "Organization (deduction of 1 mark for incomplete formal layout)",
      "Content",
      "Expression",
      "Spelling"
    ],
    "answer": "Organization (deduction of 1 mark for incomplete formal layout)",
    "hint": "Formal layout features belong to the Organization rubric.",
    "solution": "The handwritten signature is a required structural element of the quadripartite sign-off. Its omission is a layout defect penalized under Organization.",
    "target": "WAEC Rubrics: Organization Deductions"
  },
  {
    "passage": "Which of the following headings demonstrates an error in prepositional capitalization in Title Case?",
    "question": "Identify the flawed heading:",
    "options": [
      "<u>Petition Concerning The Menace Of Illegal Mining</u>",
      "<u>Petition Concerning the Menace of Illegal Mining</u>",
      "PETITION CONCERNING THE MENACE OF ILLEGAL MINING",
      "<u>An Appeal for Clean Potable Water</u>"
    ],
    "answer": "<u>Petition Concerning The Menace Of Illegal Mining</u>",
    "hint": "Short prepositions like 'of' and articles like 'the' should be lowercase in Title Case.",
    "solution": "In Title Case, short prepositions ('of') and definite articles ('the') must remain lowercase unless they occur as the first word of the heading.",
    "target": "Title Case Mechanics: Preposition Rules"
  },
  {
    "passage": "In a formal letter, why is it ungrammatical to write: 'If I would have known, I would have attended the briefing'?",
    "question": "What grammatical rule is violated in the if-clause?",
    "options": [
      "Modal auxiliaries like 'would have' are prohibited in the protasis (if-clause) of a Third Conditional",
      "The past participle 'known' is irregular",
      "The sentence uses passive voice incorrectly",
      "The sentence lacks an object"
    ],
    "answer": "Modal auxiliaries like 'would have' are prohibited in the protasis (if-clause) of a Third Conditional",
    "hint": "Never use 'would have' inside the conditional if-clause.",
    "solution": "Under Third Conditional syntax, the protasis requires the Past Perfect ('Had I known' or 'If I had known'). Inserting 'would have' into the if-clause is a grammatical error.",
    "target": "Advanced Syntax: Third Conditional Protasis Law"
  },
  {
    "passage": "A student writes an informal letter and uses the abbreviation 'U' instead of 'you'.",
    "question": "How is this penalized under the WAEC marking scheme?",
    "options": [
      "As a mechanical accuracy spelling/orthography penalty of 1/2 mark per occurrence",
      "It is accepted as modern shorthand",
      "It is rewarded for speed",
      "It is ignored in informal letters"
    ],
    "answer": "As a mechanical accuracy spelling/orthography penalty of 1/2 mark per occurrence",
    "hint": "Text shorthand is penalized as an orthographic error.",
    "solution": "Using single-letter text abbreviations ('U', 'R', 'Pls') violates standard English orthography and attracts deductions under Mechanical Accuracy.",
    "target": "Orthographic Penalties: Text Shorthand"
  },
  {
    "passage": "Which of the following phrases is most suitable for expressing respectful urgency in a formal petition?",
    "question": "Select the most effective formal phrase:",
    "options": [
      "In light of these escalating hazards, we appeal for your urgent administrative intervention.",
      "You have to hurry up and solve this problem right now.",
      "We want this fixed today because tomorrow might be too late.",
      "Hurry and come to our aid before things get out of hand."
    ],
    "answer": "In light of these escalating hazards, we appeal for your urgent administrative intervention.",
    "hint": "Combine respectful deference with precise, formal urgency.",
    "solution": "'In light of these escalating hazards, we appeal for your urgent administrative intervention' conveys compelling urgency while preserving formal dignity.",
    "target": "Formal Expression: Persuasive Urgency"
  },
  {
    "passage": "A candidate writes the sender's address in pure block style with open punctuation, but places a comma after the date.",
    "question": "What is the mechanical flaw?",
    "options": [
      "Inconsistency: open punctuation requires zero punctuation at the end of the date line",
      "The date should have been written in Roman numerals",
      "The date should have been on the left margin",
      "The year should be preceded by a semicolon"
    ],
    "answer": "Inconsistency: open punctuation requires zero punctuation at the end of the date line",
    "hint": "Open punctuation omits end-of-line marks, including after the date.",
    "solution": "In pure open punctuation, all end-of-line punctuation marks are eliminated. Adding a comma after the date introduces an inconsistency penalized under Mechanical Accuracy.",
    "target": "Punctuation Consistency: Open Style"
  },
  {
    "passage": "Which of the following salutations is appropriate for a formal letter to an unknown female director?",
    "question": "Select the correct formal salutation:",
    "options": [
      "Dear Madam,",
      "Dear Lady,",
      "Dear Mrs. Director,",
      "Dear Female Director,"
    ],
    "answer": "Dear Madam,",
    "hint": "The formal counterpart to 'Dear Sir,' is 'Dear Madam,'.",
    "solution": "When addressing an unknown female official in a formal letter, standard administrative protocol requires 'Dear Madam,'.",
    "target": "Formal Salutations: Female Addressees"
  },
  {
    "passage": "In an administrative letter of apology to a school headmaster, what should the final sentence convey?",
    "question": "Select the most appropriate closing sentiment:",
    "options": [
      "A reaffirmation of commitment to school discipline and polite gratitude for the headmaster's understanding",
      "A demand that the headmaster forgive the mistake immediately",
      "A threat to report the matter to the education office",
      "An enquiry about the headmaster's family health"
    ],
    "answer": "A reaffirmation of commitment to school discipline and polite gratitude for the headmaster's understanding",
    "hint": "Apologies conclude with a commitment to reform and gratitude.",
    "solution": "A formal letter of apology concludes constructively by pledging adherence to institutional discipline and expressing gratitude for administrative consideration.",
    "target": "Formal Valedictions: Apology Closures"
  },
  {
    "passage": "A student writes: 'The council insisted that the contractor vacates the site.'",
    "question": "Under mandative subjunctive rules, what should 'vacates' be?",
    "options": [
      "vacate",
      "vacates",
      "vacated",
      "is vacating"
    ],
    "answer": "vacate",
    "hint": "The verb following 'insisted that' must be in the bare base form.",
    "solution": "The suasive verb 'insisted that' triggers the mandative subjunctive, requiring the uninflected base verb 'vacate' without the third-person '-s'.",
    "target": "Advanced Syntax: Mandative Subjunctive"
  },
  {
    "passage": "What is the primary difference between a semi-formal letter and a formal administrative letter?",
    "question": "Differentiate the two genres:",
    "options": [
      "Semi-formal letters address known adult acquaintances by surname ('Dear Mr. Mensah,') and use 'Yours sincerely,', whereas formal letters address official posts ('Dear Sir,') and use 'Yours faithfully,'",
      "Semi-formal letters have no addresses, while formal letters have three addresses",
      "Semi-formal letters allow street slang, while formal letters do not",
      "Semi-formal letters are only written to friends, while formal letters are written to parents"
    ],
    "answer": "Semi-formal letters address known adult acquaintances by surname ('Dear Mr. Mensah,') and use 'Yours sincerely,', whereas formal letters address official posts ('Dear Sir,') and use 'Yours faithfully,'",
    "hint": "Semi-formal letters balance respect with familiarity, using surnames and 'Yours sincerely,'.",
    "solution": "Semi-formal letters address familiar adults by surname with 'Yours sincerely,', whereas formal letters address institutional offices with 'Dear Sir,' and 'Yours faithfully,'.",
    "target": "Epistolary Taxonomies: Semi-Formal vs. Formal"
  },
  {
    "passage": "A candidate writes the inside address as: 'The Municipal Chief Executive, P.O. Box 24, Tamale.'.",
    "question": "What vital institutional line is missing between the title and the postal box?",
    "options": [
      "The name of the institution/office (e.g., 'Tamale Metropolitan Assembly,')",
      "The name of the official's spouse",
      "The official's home address",
      "The date of establishment of the assembly"
    ],
    "answer": "The name of the institution/office (e.g., 'Tamale Metropolitan Assembly,')",
    "hint": "A complete inside address requires the official title, institution, box, and town.",
    "solution": "A complete formal inside address includes: (1) Official title, (2) Organization/assembly name, (3) Postal box, (4) Town/region.",
    "target": "Inside Address Completeness"
  },
  {
    "passage": "Which of the following demonstrates an error in the use of personal pronouns in formal petition drafting?",
    "question": "Identify the flawed sentence:",
    "options": [
      "Between you and I, the assembly has failed our community completely.",
      "Between you and me, the assembly has failed our community completely.",
      "The assembly has failed our community completely.",
      "We believe that the assembly has failed our community."
    ],
    "answer": "Between you and I, the assembly has failed our community completely.",
    "hint": "Prepositions like 'between' govern objective pronouns ('me', not 'I').",
    "solution": "Prepositions govern the objective case. 'Between you and I' is a hypercorrection error; the grammatically mandatory form is 'Between you and me'.",
    "target": "Grammatical Case Law: Prepositional Objective Complementation"
  },
  {
    "passage": "In an informal letter, why is it unnecessary to write a subject heading (caption)?",
    "question": "State the epistolary reason:",
    "options": [
      "Because informal letters are personal and conversational, making formal business captions redundant and artificial",
      "Because headings are too difficult to underline",
      "Because informal letters are written in pencil",
      "Because the postal service removes headings"
    ],
    "answer": "Because informal letters are personal and conversational, making formal business captions redundant and artificial",
    "hint": "Captions belong to formal and functional business correspondence.",
    "solution": "Informal letters are personal and conversational. Inserting a business heading creates unnatural rigidity and represents format contamination.",
    "target": "Informal Epistolary Purity"
  },
  {
    "passage": "A candidate writes: 'Should any student encounter difficulties with the registration portal, report to the ICT laboratory.'",
    "question": "What syntactic structure is demonstrated in the opening clause?",
    "options": [
      "An inverted First Conditional clause where 'Should' replaces 'If'",
      "A past counterfactual Third Conditional",
      "A passive voice declarative sentence",
      "A relative clause modifying the student"
    ],
    "answer": "An inverted First Conditional clause where 'Should' replaces 'If'",
    "hint": "'Should' fronted before the subject forms an inverted First Conditional.",
    "solution": "'Should any student encounter...' is an inverted First Conditional expressing a real future possibility, functioning as the formal equivalent of 'If any student encounters...'.",
    "target": "Advanced Syntax: Inverted First Conditional"
  },
  {
    "passage": "Which of the following subscriptions contains a capitalization error?",
    "question": "Identify the erroneous subscription:",
    "options": [
      "Yours Sincerely,",
      "Yours sincerely,",
      "Yours faithfully,",
      "Your affectionate sister,"
    ],
    "answer": "Yours Sincerely,",
    "hint": "The second word in a subscription must not be capitalized.",
    "solution": "In standard epistolary mechanics, the second word ('sincerely') must begin with a lowercase letter: 'Yours sincerely,'.",
    "target": "Subscription Mechanics: Casing Rules"
  },
  {
    "passage": "A student writes a formal letter and spells 'privilege' as 'privelege'.",
    "question": "How is this error penalized under WAEC marking rubrics?",
    "options": [
      "As a spelling error under Mechanical Accuracy (deduction of 1/2 mark)",
      "Under Expression",
      "Under Content",
      "Under Organization"
    ],
    "answer": "As a spelling error under Mechanical Accuracy (deduction of 1/2 mark)",
    "hint": "Spelling mistakes are penalized under Mechanical Accuracy.",
    "solution": "Misspelling 'privilege' as 'privelege' is an orthographical error penalized under the Mechanical Accuracy rubric.",
    "target": "WAEC Rubrics: Mechanical Accuracy Penalties"
  },
  {
    "passage": "In a formal letter of application, what information must the second paragraph primarily convey?",
    "question": "Select the primary function:",
    "options": [
      "The applicant's relevant academic qualifications, leadership experience, and personal competencies",
      "The applicant's childhood hobbies and favorite sports teams",
      "An enquiry about the employer's salary structure",
      "A complaint about previous employers"
    ],
    "answer": "The applicant's relevant academic qualifications, leadership experience, and personal competencies",
    "hint": "The second paragraph provides the core evidence justifying the application.",
    "solution": "In a letter of application, the second paragraph details the candidate's qualifications, past achievements, and specific skills that justify their appointment.",
    "target": "Formal Applications: Qualifications Exposition"
  },
  {
    "passage": "Which of the following transitions is best suited for introducing the final summary paragraph in a civic petition?",
    "question": "Select the most effective formal concluding linker:",
    "options": [
      "In conclusion, we urge your administration to act expeditiously to preserve public safety.",
      "Finally, let me stop writing here because the paper is full.",
      "To wrap up my gist, do something about this problem.",
      "At last, I have reached the end of my petition."
    ],
    "answer": "In conclusion, we urge your administration to act expeditiously to preserve public safety.",
    "hint": "Use formal, elevated discourse markers to conclude.",
    "solution": "'In conclusion, we urge your administration to act expeditiously...' provides a dignified, formal conclusion suitable for civic advocacy.",
    "target": "Formal Discourse Markers: Conclusions"
  },
  {
    "passage": "A student writes: 'We haven't received no response from the district assembly.'",
    "question": "What syntactic error is present in this sentence?",
    "options": [
      "A double negative ('haven't' paired with 'no response')",
      "Incorrect subject-verb concord",
      "Faulty passive voice",
      "Resumptive pronoun error"
    ],
    "answer": "A double negative ('haven't' paired with 'no response')",
    "hint": "Pairing a negative contraction with 'no' creates an ungrammatical double negative.",
    "solution": "Combining the negative auxiliary 'haven't' with 'no response' creates an ungrammatical double negative. The correct form is 'We have not received any response'.",
    "target": "Syntax Mechanics: Double Negative Prohibition"
  },
  {
    "passage": "What is the maximum achievable score for an essay under the BECE / WAEC Paper 2 marking scheme?",
    "question": "Select the maximum composite score:",
    "options": [
      "30 marks",
      "50 marks",
      "100 marks",
      "20 marks"
    ],
    "answer": "30 marks",
    "hint": "The four WAEC dimensions (Content 10, Org 5, Exp 10, MA 5) total 30 marks.",
    "solution": "Under WAEC/BECE guidelines, Paper 2 compositions are evaluated out of 30 marks, distributed as Content (10), Organization (5), Expression (10), and Mechanical Accuracy (5).",
    "target": "WAEC Assessment Rubric: Total Mark Weighting"
  }
];

// =========================================================================
// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Informal: Coping with Boarding School Discipline
  {
    id: "B7_S4_A_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Informal Letter",
    title: "Navigating Boarding School Discipline",
    shortSummary: "Write to an elder brother recounting your adjustment to strict boarding school routines.",
    prompt: "You recently transitioned from a day school to a strict boarding junior high school in another region. Write a letter to your elder brother who is studying abroad, describing your daily boarding routine, recounting a memorable disciplinary experience that taught you personal responsibility, and sharing how you are managing your academic schedule.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Narrative Pacing, Reflective Self-Evaluation & Familial Warmth",
    learningCompetency: "B7.4.2.1.1: Compose reflective personal letters evaluating personal growth, daily routines, and moral responsibility using appropriate informal conventions.",
    hint: "Use single address formatting. Balance vivid narrative storytelling with personal reflections. Conclude with an affectionate subscription and your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["St. Augustine's Junior High School,", "P.O. Box 98,", "Cape Coast,", "Central Region.", "14th October, 2026."],
        allowedDatingFormats: ["14th October, 2026", "14 October 2026"],
        prohibitedDatingFormats: ["14/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Brother Kojo,",
        permissibleSalutations: ["Dear Brother Kojo,", "Dearest Kojo,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his studies abroad and state your purpose.", transitionHints: ["I hope this letter finds you thriving in your university studies...", "It has been two eventful months since I entered the boarding house..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the rigorous daily boarding routine from dawn inspection to evening lights-out.", transitionHints: ["Life here operates with clockwork precision...", "Our day commences at 5:00 a.m. with compound sweeping..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Recount a specific disciplinary incident and the valuable life lesson it taught you.", transitionHints: ["A few weeks ago, I learned a lesson in punctuality I will never forget...", "When the senior housemaster caught me running late for inspection..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Share your academic progress and invite him to write back.", transitionHints: ["Despite the strict discipline, I am adapting remarkably well...", "Please write back soon and share your own experiences..."] }
        ]
      },
      signOffGuide: {
        format: "mononymic",
        subscription: "Your loving brother,",
        requiresHandwrittenSignature: false,
        printedNameFormat: "first_name_only",
        coOccurrenceConstraint: "End with an affectionate family closing and your first name only."
      }
    },
    rubric: createWAECRubric(
      ["Warm familial opening and context established (2 marks)", "Vivid description of boarding routine (4 marks)", "Insightful disciplinary experience and academic coping strategy (4 marks)"],
      ["Overseas brother acknowledged warmly", "Daily routine detailed vividly", "Moral lesson articulated clearly"],
      ["Single address format correctly styled (1 mark)", "Familial salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct address layout", "Consistent punctuation", "First name only at closing"],
      ["Warm, reflective, and mature tone (4 marks)", "Natural conversational phrasing and contractions (3 marks)", "Rich descriptive vocabulary (3 marks)"],
      ["Reflective sibling rapport", "Clear paragraph transitions", "Vivid narrative lexis"]
    ),
    modelAnswer: "St. Augustine's Junior High School,\nP.O. Box 98,\nCape Coast,\nCentral Region.\n14th October, 2026.\n\nDear Brother Kojo,\n\nI hope this letter finds you thriving in your university studies in Canada. We all miss your inspiring presence at home! It has been two intense months since I transitioned into the boarding house here in Cape Coast, and I am writing to share how I am navigating this new world of strict discipline and independence.\n\nLife in the boarding house operates with military precision. Our siren sounds at 5:00 a.m. sharp, giving us barely twenty minutes to fetch water, scrub our allocated veranda plots, and dress for morning inspection. Initially, I found the schedule overwhelming, especially the mandatory two-hour silent evening study prep where not a whisper is permitted. However, this rigorous structure has eliminated my old habit of procrastinating on homework.\n\nTwo weeks ago, I learned an unforgettable lesson in accountability. I lingered by the sports pavilion after afternoon football and arrived five minutes late for the housemaster's roll call. As a consequence, I was tasked with weeding the flowerbeds behind the assembly hall on Saturday morning. Under the hot sun, blisters formed on my palms, but the experience cured my carelessness. I now prepare my uniform and books the night before, ensuring I am always five minutes ahead of schedule.\n\nMy academic performance has improved significantly because of the enforced study hours, and I recently scored the highest mark in our Integrated Science test.\n\nPlease write back soon and tell me how you are coping with the Canadian winter.\n\nYour loving brother,\nKwabena",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Informal: Promoting Local Eco-Tourism to a Foreign Pen Pal
  {
    id: "B7_S4_A_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Informal Letter",
    title: "Eco-Tourism & Wildlife Conservation",
    shortSummary: "Write to a foreign pen pal describing a school excursion to a national park and promoting eco-tourism.",
    prompt: "Your school recently organized an educational excursion to the Kakum National Park and the Cape Coast Castle. Write a letter to your pen pal in Kenya, vividly describing the adrenaline-pumping experience of walking on the canopy walkway, sharing the sober historical reflections from the castle dungeons, and explaining why eco-tourism is vital for national development.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Descriptive Narrative Excursion Writing, Historical Reflection & Environmental Advocacy",
    learningCompetency: "B7.4.2.1.1: Compose descriptive personal letters capturing sensory travel experiences, historical insights, and conservation values.",
    hint: "Use single address formatting. Combine thrilling sensory details of the canopy walkway with thoughtful historical commentary. End with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Achimota Basic School,", "P.O. Box AH 11,", "Achimota-Accra.", "20th October, 2026."],
        allowedDatingFormats: ["20th October, 2026", "20 October 2026"],
        prohibitedDatingFormats: ["20/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Wanjiru,",
        permissibleSalutations: ["Dear Wanjiru,", "My dear friend Wanjiru,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire about her life in Nairobi and announce your thrilling excursion to the Central Region.", transitionHints: ["I hope you are doing wonderfully in Nairobi...", "I am eager to share the breathtaking highlights of our excursion..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Vividly describe suspended heights, swinging bridges, and rainforest wildlife on the canopy walkway.", transitionHints: ["Our first stop was Kakum National Park, where we braved the famous canopy walkway...", "Suspended forty meters above the rainforest floor, the rope bridge swayed..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Describe the solemn historical atmosphere inside the Cape Coast Castle slave dungeons.", transitionHints: ["In stark contrast, our afternoon visit to Cape Coast Castle was deeply sobering...", "Standing in the dark, damp subterranean dungeons where enslaved ancestors were kept..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reflect on how eco-tourism preserves natural heritage and invite her to visit Ghana.", transitionHints: ["This excursion made me appreciate how eco-tourism generates revenue while protecting...", "You must plan a visit to Ghana during your next vacation..."] }
        ]
      },
      signOffGuide: {
        format: "mononymic",
        subscription: "Your sincere friend,",
        requiresHandwrittenSignature: false,
        printedNameFormat: "first_name_only",
        coOccurrenceConstraint: "End with friendly closing phrases and first name only."
      }
    },
    rubric: createWAECRubric(
      ["Warm opening and excursion context established (2 marks)", "Sensory description of canopy walkway (4 marks)", "Sober historical reflections and eco-tourism value (4 marks)"],
      ["Kenyan pen pal acknowledged", "Kakum walkway described vividly", "Cape Coast Castle reflections included"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Engaging, descriptive, and reflective tone (4 marks)", "Natural conversational flow (3 marks)", "Vivid sensory and historical vocabulary (3 marks)"],
      ["Evocative sensory descriptions", "Smooth thematic transitions", "Mature vocabulary"]
    ),
    modelAnswer: "Achimota Basic School,\nP.O. Box AH 11,\nAchimota-Accra.\n20th October, 2026.\n\nDear Wanjiru,\n\nI hope this letter finds you well and thriving in vibrant Nairobi. I recently returned from a remarkable two-day educational excursion to the Central Region of Ghana with my classmates, and I cannot wait to share the unforgettable highlights with you!\n\nOur first destination was the dense tropical rainforest of Kakum National Park. The defining highlight was conquering the famous canopy walkway. Suspended forty meters above the forest floor on narrow wooden planks connected by wire ropes, my heart pounded furiously with every swaying step! Looking down into the emerald sea of giant mahogany trees, we spotted colorful hornbills and rare colobus monkeys leaping across branches. The experience was terrifying yet exhilarating.\n\nLater in the afternoon, we visited the historic Cape Coast Castle on the Atlantic shoreline. Standing in the suffocating darkness of the underground slave dungeons was an intensely sobering experience. Touching the cold stone walls and walking through the narrow 'Door of No Return' moved many of my classmates to tears as our guide narrated the agonizing hardships our ancestors endured before being shipped across the ocean.\n\nThis journey taught me that eco-tourism does far more than entertain; it generates vital revenue to conserve endangered wildlife while preserving sacred historical memory for future generations.\n\nYou simply must visit Ghana one day so we can explore Kakum together! Write back soon.\n\nYour sincere friend,\nEsi",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Semi-Formal: Mentorship Request to a Medical Doctor
  {
    id: "B7_S4_A_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Semi-Formal Letter",
    title: "Clinical Shadowing & Mentorship Request",
    shortSummary: "Write to a family medical doctor requesting a weekend shadowing opportunity at her clinic.",
    prompt: "You aspire to pursue pediatric medicine after secondary school. Write a semi-formal letter to Dr. (Mrs.) Joyce Asare, your family's physician and a patron of your school's health club, respectfully requesting permission to shadow her for two Saturdays at her community pediatric clinic to gain practical insight into patient care and clinical record-keeping.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Deference, Professional Aspiration & Confidentiality Commitment",
    learningCompetency: "B7.4.2.1.2: Compose semi-formal requests to medical professionals demonstrating career purpose, ethical confidentiality pledges, and appropriate honorifics.",
    hint: "Salute with 'Dear Dr. (Mrs.) Asare,'. Provide an underlined Title Case caption. State your career ambitions and pledge patient confidentiality. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Health Scouts Secretariat,", "Ridge Church Junior High School,", "P.O. Box 110,", "Accra.", "25th October, 2026."],
        allowedDatingFormats: ["25th October, 2026", "25 October 2026"],
        prohibitedDatingFormats: ["25/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Dr. (Mrs.) Asare,",
        permissibleSalutations: ["Dear Dr. (Mrs.) Asare,", "Dear Dr. Asare,"],
        bannedSalutations: ["Dear Sir,", "Dear Joyce,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for Weekend Clinical Shadowing and Mentorship",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Respectfully state the purpose of your letter and recall her role as school health patron.", transitionHints: ["I write to respectfully seek your guidance and permission...", "As a dedicated patron of our school Health Scouts Club, you have inspired..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain your long-standing dream of becoming a pediatrician and your current science studies.", transitionHints: ["Ever since I joined Basic 7, my goal has been to pursue pediatric medicine...", "Observing patient triage and pediatric care under your supervision would..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Specify the exact dates (two Saturdays) and make a solemn pledge to observe patient confidentiality and clinic rules.", transitionHints: ["I humbly request permission to shadow you on Saturday, 7th November, and...", "I solemnly pledge to observe absolute patient confidentiality and adhere to all clinic safety protocols..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Express profound gratitude for her ongoing encouragement and anticipate her guidance.", transitionHints: ["I would be immensely honored by your kind consideration of my request...", "Thank you very much for your continuous mentorship..."] }
        ]
      },
      signOffGuide: {
        format: "semi_formal",
        subscription: "Yours sincerely,",
        requiresHandwrittenSignature: false,
        printedNameFormat: "full_name_title_case",
        coOccurrenceConstraint: "Surname salutations mandate 'Yours sincerely,' followed by your full name."
      }
    },
    rubric: createWAECRubric(
      ["Mentorship request and patron connection established (2 marks)", "Pediatric career aspiration explained (4 marks)", "Specific dates and patient confidentiality pledge detailed (4 marks)"],
      ["Doctor's patron role acknowledged", "Pediatric career interest developed", "Strict confidentiality guaranteed"],
      ["Single address format (1 mark)", "Honorific surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Caption underlined", "Correct subscription", "Full printed name without signature"],
      ["Deferential, highly professional semi-formal tone (4 marks)", "Zero informal contractions (3 marks)", "Precise clinical and academic vocabulary (3 marks)"],
      ["Polite, respectful register", "Clear transitional progression", "Elevated vocabulary"]
    ),
    modelAnswer: "Health Scouts Secretariat,\nRidge Church Junior High School,\nP.O. Box 110,\nAccra.\n25th October, 2026.\n\nDear Dr. (Mrs.) Asare,\n\nRequest for Weekend Clinical Shadowing and Mentorship\n__________________________________________________\n\nI write to respectfully seek your kind permission and mentorship to undertake a two-day clinical observation placement at your community pediatric clinic during the upcoming mid-term break.\n\nAs the patron of our school Health Scouts Club, your insightful presentations on community hygiene and child health have profoundly shaped my academic ambitions. Ever since I commenced my Basic 7 studies, my dream has been to pursue medicine and specialize as a pediatrician, dedicating my life to improving neonatal survival in underserved communities. Gaining direct exposure to clinical consultations, triage procedures, and medical record-keeping under your seasoned guidance would provide invaluable foundation for my science studies.\n\nI humbly request permission to shadow your clinical team on Saturday, 7th November, and Saturday, 14th November, 2026, from 8:30 a.m. to 1:00 p.m. I am fully conscious of the sacred ethical obligations of the medical profession and solemnly pledge to maintain absolute patient confidentiality, observe all clinical hygiene directives, and conduct myself with the utmost decorum.\n\nI would be profoundly grateful for this mentorship opportunity to learn from your exemplary medical service.\n\nThank you very much for your time, consideration, and continuous support.\n\nYours sincerely,\nPriscilla Nyamekye",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Formal: Application for Student Representative Council President
  {
    id: "B7_S4_A_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Formal Letter",
    title: "Application for Junior SRC Representative",
    shortSummary: "Apply to the Headmaster for appointment to the Student Representative Council with a policy manifesto.",
    prompt: "The school administration has introduced a Student Representative Council (SRC) to foster student-administration collaboration. Write a formal letter of application to your Headmaster, applying to serve as the Basic 7 Representative on the Council. Detail your leadership philosophy, analyze two pressing student welfare challenges, and propose concrete collaborative solutions.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Policy Formulation & Quadripartite Close",
    learningCompetency: "B7.4.2.1.2: Compose formal administrative applications demonstrating policy advocacy, objective problem analysis, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 7 Secretariat,", "Prempeh College Experimental School,", "P.O. Box 192,", "Kumasi,", "Ashanti Region.", "2nd November, 2026."],
        allowedDatingFormats: ["2nd November, 2026", "2 November 2026"],
        prohibitedDatingFormats: ["02/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Headmaster,",
        officeOrSchoolPlaceholder: "Prempeh College Experimental School,",
        postalBoxPlaceholder: "P.O. Box 192,",
        townRegionPlaceholder: "Kumasi, Ashanti Region.",
        formatContaminationPenaltyWarning: "CRITICAL: Inside address is mandatory."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Sir,",
        permissibleSalutations: ["Dear Sir,"],
        bannedSalutations: ["Dear Mr. Headmaster,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "APPLICATION FOR THE OFFICE OF BASIC 7 REPRESENTATIVE ON THE SRC",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the SRC representative position and express your leadership philosophy.", transitionHints: ["I write to formally submit my application for the office of...", "In response to the establishment of the Student Representative Council..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your academic diligence, discipline, and past leadership credentials.", transitionHints: ["Throughout my academic journey in Basic 7, I have maintained...", "My past experience as a primary school council leader instilled in me..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Analyze two student welfare issues (e.g., washroom hygiene, peer bullying) and propose practical reforms.", transitionHints: ["If given the mandate, I will focus on two pressing welfare concerns...", "First, I propose the introduction of a peer-led sanitation monitoring corps..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge constructive collaboration between students and administration.", transitionHints: ["I pledge to serve as an impartial, articulate bridge between...", "Thank you very much for considering my application..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Applicant, Basic 7 Stream",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application purpose declared clearly (2 marks)", "Leadership philosophy and qualifications outlined (4 marks)", "Two student welfare problems and actionable solutions proposed (4 marks)"],
      ["SRC post clearly stated", "Leadership qualities demonstrated", "Two welfare solutions developed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: "Basic 7 Secretariat,\nPrempeh College Experimental School,\nP.O. Box 192,\nKumasi,\nAshanti Region.\n2nd November, 2026.\n\nThe Headmaster,\nPrempeh College Experimental School,\nP.O. Box 192,\nKumasi,\nAshanti Region.\n\nDear Sir,\n\nAPPLICATION FOR THE OFFICE OF BASIC 7 REPRESENTATIVE ON THE SRC\n\nI write to formally submit my application to serve as the Basic 7 Representative on the newly inaugurated Student Representative Council (SRC) for the 2026/2027 academic session.\n\nMy leadership philosophy is anchored on constructive engagement, discipline, and empathetic service. Throughout my first term in Basic 7, I have maintained a clean record of conduct, exemplary punctuality, and consistent academic excellence in the terminal examinations. Having served as the Boys' Protocol Officer in primary school, I possess proven organizational skills in mediating student disagreements and articulating student concerns constructively to school authorities.\n\nIf appointed to this council, I intend to tackle two pressing welfare concerns affecting junior learners. First, I will advocate for the establishment of a student-led washroom maintenance committee that works collaboratively with our sanitation monitors to ensure clean running water and liquid soap are consistently replenished. Second, I will propose a 'Peer Academic Clinic' during afternoon study breaks where academically gifted students volunteer to assist peers struggling with mathematics and science concepts.\n\nI pledge to serve as an articulate, loyal bridge between the student body and school management, fostering harmony and institutional pride.\n\nThank you very much for your consideration.\n\nYours faithfully,\n[Signature]\nEmmanuel Osei-Tutu\nApplicant, Basic 7 Stream",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Civic Petition: Artisanal Mining Contamination of Community River
  {
    id: "B7_S4_A_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Civic Petition",
    title: "Petition to Halt Illegal Alluvial Mining on Pra River",
    shortSummary: "Petition the Municipal Chief Executive regarding Pra River pollution by illegal miners.",
    prompt: "Illegal artisanal mining (galamsey) along the Pra River has severely polluted the main drinking water source for three surrounding communities, resulting in fish kills and waterborne diseases among school children. As the General Secretary of the Youth Coalition for Environmental Defense, write a formal petition to your Municipal Chief Executive (MCE), documenting the ecological destruction with empirical evidence and demanding an immediate military task force crackdown on illegal dredging barges.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Forensic Environmental Advocacy, Legislative Preamble & Enforcement Prayer",
    learningCompetency: "B7.4.2.1.2: Compose forensic civic petitions to executive authorities documenting environmental crimes, health epidemics, and statutory enforcement demands.",
    hint: "Address to 'The Municipal Chief Executive,'. State the crisis factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Youth Coalition for Environmental Defense,", "P.O. Box 72,", "Twifo Praso,", "Central Region.", "8th November, 2026."],
        allowedDatingFormats: ["8th November, 2026", "8 November 2026"],
        prohibitedDatingFormats: ["08/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Municipal Chief Executive,",
        officeOrSchoolPlaceholder: "Twifo Atti-Morkwa Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box 10,",
        townRegionPlaceholder: "Twifo Praso, Central Region.",
        formatContaminationPenaltyWarning: "CRITICAL: Full inside address is required."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Sir,",
        permissibleSalutations: ["Dear Sir,", "Honorable Sir,"],
        bannedSalutations: ["Dear MCE,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "PETITION TO HALT ILLEGAL ALLUVIAL GOLD MINING ON THE PRA RIVER",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your coalition's statutory standing and declare the petition's focus.", transitionHints: ["We, the executive members of the Youth Coalition for Environmental Defense, respectfully petition...", "I write on behalf of over five thousand residents across the Pra basin to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the empirical evidence of heavy metal contamination, river turbidity, and pediatric health emergencies.", transitionHints: ["Over the past four months, illegal dredging syndicates operating heavy excavators...", "Water testing conducted by local health officials revealed hazardous mercury levels..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (deployment of joint security task force, destruction of dredge platforms, and provision of potable water tankers).", transitionHints: ["We therefore humbly pray that your honorable administration execute three immediate actions...", "First, we demand the immediate deployment of the joint security task force to..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent intervention before total ecological collapse occurs.", transitionHints: ["Our children's health and the survival of our ecosystem hang in the balance...", "Thank you very much for your leadership and anticipated decisive intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "General Secretary, Youth Environmental Coalition",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Environmental coalition standing established (2 marks)", "Empirical evidence of water pollution and pediatric ailments documented (4 marks)", "Clear three-point security and remediation prayer (4 marks)"],
      ["Coalition authority established", "River pollution evidence detailed", "Task force and water tanker prayer stated"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, forensic civic register (4 marks)", "Zero informal contractions (3 marks)", "Precise scientific and environmental vocabulary (3 marks)"],
      ["Forensic civic language", "Logical problem-evidence-prayer flow", "Precise technical vocabulary"]
    ),
    modelAnswer: "Youth Coalition for Environmental Defense,\nP.O. Box 72,\nTwifo Praso,\nCentral Region.\n8th November, 2026.\n\nThe Municipal Chief Executive,\nTwifo Atti-Morkwa Municipal Assembly,\nP.O. Box 10,\nTwifo Praso, Central Region.\n\nDear Sir,\n\nPETITION TO HALT ILLEGAL ALLUVIAL GOLD MINING ON THE PRA RIVER\n\nI write on behalf of the executive committee of the Youth Coalition for Environmental Defense and the combined student unions of the Twifo Praso basin to respectfully submit this urgent petition regarding the catastrophic contamination of the Pra River.\n\nOver the past four months, unregulated artisanal mining syndicates operating heavy hydraulic excavators and floating 'changfa' washing platforms have devastated the river basin. The water turbidity has escalated to alarming levels, turning a once-pristine aquatic sanctuary into thick yellowish-brown toxic sludge. Chemical assays conducted by local health officers confirmed dangerous concentrations of mercury and lead. Consequently, hundreds of basic school pupils who depend on river water for domestic chores have contracted acute gastrointestinal infections and chronic dermatological rashes, paralyzing school attendance.\n\nWe therefore humbly pray that your honorable office enforce three decisive interventions. First, we demand the immediate deployment of the joint military-police task force to dismantle and burn all illegal dredging platforms operating along the riverbanks. Second, we appeal for the immediate arrest and prosecution of the financial backers of these mining syndicates. Finally, we urge the assembly to dispatch emergency potable water tankers to supply clean drinking water to affected basic schools.\n\nOur river is our lifeblood; allowing it to die is mortgaging our children's future.\n\nThank you for your leadership and anticipated swift action.\n\nYours faithfully,\n[Signature]\nSolomon Kwakye\nGeneral Secretary, Youth Environmental Coalition",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Informal: Preserving Indigenous Culinary Traditions
  {
    id: "B7_S4_A_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Informal Letter",
    title: "Preserving Indigenous Culinary Traditions",
    shortSummary: "Write to a cousin in the diaspora describing how your family prepares a traditional Ghanaian dish.",
    prompt: "Fast food franchises are rapidly replacing traditional local cuisines among urban youth. Write a letter to your cousin who was born in the United States, vividly describing the meticulous process of preparing your favorite traditional Ghanaian meal (e.g., Fufu with Light Soup, Banku with Tilapia, or Tuo Zaafi), explaining its nutritional benefits, and discussing why safeguarding indigenous food culture matters.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Procedural Culinary Exposition, Cultural Preservation Advocacy & Warm Sibling Rapport",
    learningCompetency: "B7.4.2.1.1: Compose descriptive personal letters detailing procedural cultural practices, nutritional values, and indigenous heritage preservation.",
    hint: "Use single address formatting. Detail the culinary steps with sensory descriptive verbs. Discuss cultural identity warmly. End with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Bompata Junior High School,", "P.O. Box 15,", "Bompata-Asante,", "Ashanti Region.", "12th November, 2026."],
        allowedDatingFormats: ["12th November, 2026", "12 November 2026"],
        prohibitedDatingFormats: ["12/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Akwasi,",
        permissibleSalutations: ["Dear Akwasi,", "My dear cousin Akwasi,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his life in New York and introduce the theme of indigenous culinary heritage.", transitionHints: ["I hope this letter finds you well in New York...", "I was inspired to write after watching a documentary on..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Provide a sensory step-by-step description of preparing traditional fufu and aromatic goat light soup.", transitionHints: ["Last Saturday, grandmother taught me how to prepare authentic fufu...", "First, we boiled peeled cassava and plantain chunks until tender, then pounded them in a wooden mortar..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain the nutritional benefits of fresh indigenous ingredients compared to processed fast foods.", transitionHints: ["Unlike processed fast foods loaded with trans-fats, our local dishes are packed with...", "The freshly ground ginger, garlic, and wild garden eggs provide natural vitamins..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reflect on preserving cultural identity through cuisine and urge him to try cooking it in New York.", transitionHints: ["Food is the sacred heartbeat of cultural heritage...", "When you visit next Christmas, I promise to cook this feast for you..."] }
        ]
      },
      signOffGuide: {
        format: "mononymic",
        subscription: "Your affectionate cousin,",
        requiresHandwrittenSignature: false,
        printedNameFormat: "first_name_only",
        coOccurrenceConstraint: "End with friendly closing phrases and first name only."
      }
    },
    rubric: createWAECRubric(
      ["Warm diaspora connection established (2 marks)", "Meticulous sensory culinary process described (4 marks)", "Nutritional value and cultural identity preservation argued (4 marks)"],
      ["Cousin in diaspora acknowledged", "Cooking steps detailed with sensory words", "Cultural importance defended"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at closing"],
      ["Lively, sensory, and culturally rich tone (4 marks)", "Natural conversational phrasing (3 marks)", "Vivid culinary vocabulary (3 marks)"],
      ["Sensory adjectives used effectively", "Smooth procedural transitions", "Apt cultural vocabulary"]
    ),
    modelAnswer: "Bompata Junior High School,\nP.O. Box 15,\nBompata-Asante,\nAshanti Region.\n12th November, 2026.\n\nDear Akwasi,\n\nI hope this letter finds you in high spirits in bustling New York. Mother recently showed me pictures of your graduation, and we are all proud of you! I was inspired to write after noticing how fast-food chains are displacing our indigenous dishes among urban youth here in Ghana, and I wanted to share the rich culinary heritage that ties us to our ancestral roots.\n\nLast weekend, Grandmother taught me how to prepare authentic plantain fufu paired with aromatic goat meat light soup. The process is a sacred art! First, we boiled peeled cassava tubers and golden semi-ripe plantains over firewood until they turned soft and fragrant. Next came the rhythmic pounding: Grandmother skillfully crushed the steaming chunks in a heavy wooden mortar while I deftly turned the dough with wet hands until it formed a smooth, elastic mass.\n\nMeanwhile, the soup simmered over glowing charcoal. Grandmother blended fresh crimson tomatoes, fiery scotch bonnet peppers, wild garden eggs, and generous roots of aromatic ginger with fresh cuts of seasoned chevron. Unlike processed burgers and French fries saturated with artificial preservatives and sodium, our indigenous meals are packed with complex carbohydrates, lean protein, and natural antioxidants that bolster the immune system.\n\nFood is far more than sustenance; it is living history. When we abandon our traditional pots, we lose touch with our cultural identity.\n\nWhen you visit Ghana next summer, I will pound a fresh bowl just for you! Write back soon.\n\nYour affectionate cousin,\nYaw",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Semi-Formal: Seeking Venue Permission for Inter-School Debate
  {
    id: "B7_S4_A_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Semi-Formal Letter",
    title: "Community Auditorium Booking Request",
    shortSummary: "Write to a community center manager seeking permission to use the municipal auditorium for a debate gala.",
    prompt: "You are the President of the District Junior Debaters' Society. Write a semi-formal letter to Mr. Daniel Oduro, the Manager of the Municipal Community Centre, requesting the use of the main auditorium for your annual inter-schools championship. State the date, time, and expected audience, outline the logistical support needed, and guarantee the care and cleanliness of the facility.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Facility Negotiation, Event Logistics & Property Care Guarantees",
    learningCompetency: "B7.4.2.1.2: Compose semi-formal requests to institutional facility managers detailing event logistics, audience capacities, and property indemnity assurances.",
    hint: "Salute with 'Dear Mr. Oduro,'. Provide an underlined Title Case caption. Detail event times, audience numbers, and property protection guarantees. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["District Debaters' Society,", "P.O. Box 80,", "Teshie-Nungua,", "Greater Accra Region.", "15th November, 2026."],
        allowedDatingFormats: ["15th November, 2026", "15 November 2026"],
        prohibitedDatingFormats: ["15/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Oduro,",
        permissibleSalutations: ["Dear Mr. Oduro,", "Dear Facility Manager,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for the Use of the Main Community Auditorium",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "State your leadership capacity and declare the venue booking request clearly.", transitionHints: ["I write in my capacity as President of the District Debaters' Society to respectfully request...", "We wish to seek your permission to hold our annual inter-schools championship at..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Specify the exact date, duration, expected participating schools, and audience size.", transitionHints: ["The championship is scheduled for Friday, 4th December, 2026, from...", "We anticipate hosting six junior secondary schools with an estimated audience of..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Detail required logistical facilities (public address system, microphones, stage lighting) and make a property care pledge.", transitionHints: ["To ensure a successful academic contest, we humbly request access to...", "Our executive committee solemnly guarantees that all hall facilities will be treated with..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Invite him as an honored special guest and express gratitude.", transitionHints: ["We would be deeply honored if you could join us as a special guest...", "Thank you very much for your continuous dedication to youth empowerment..."] }
        ]
      },
      signOffGuide: {
        format: "semi_formal",
        subscription: "Yours sincerely,",
        requiresHandwrittenSignature: false,
        printedNameFormat: "full_name_title_case",
        coOccurrenceConstraint: "Surname salutations mandate 'Yours sincerely,' followed by your full name."
      }
    },
    rubric: createWAECRubric(
      ["Society standing and purpose established (2 marks)", "Date, duration, and audience logistics detailed (4 marks)", "Equipment needs and facility indemnity guaranteed (4 marks)"],
      ["Debating society role clear", "Event times and audience count given", "Property protection pledged"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Title Case underlined", "Correct subscription", "Full printed name"],
      ["Polite, professional semi-formal register (4 marks)", "Zero informal contractions (3 marks)", "Precise organizational vocabulary (3 marks)"],
      ["Courteous administrative tone", "Clear chronological progression", "Precise event terminology"]
    ),
    modelAnswer: "District Debaters' Society,\nP.O. Box 80,\nTeshie-Nungua,\nGreater Accra Region.\n15th November, 2026.\n\nDear Mr. Oduro,\n\nRequest for the Use of the Main Community Auditorium\n___________________________________________________\n\nI write in my capacity as President of the Ledzokuku-Krowor District Junior Debaters' Society to respectfully request permission to utilize the main auditorium of the Municipal Community Centre for our annual inter-schools intellectual tournament.\n\nThe championship is scheduled for Friday, 4th December, 2026, commencing at 9:00 a.m. and concluding at 2:00 p.m. The contest will feature eight accredited junior high schools debating contemporary national development themes. We expect an audience of approximately two hundred and fifty attendees, comprising student delegates, patron teachers, and educational circuit supervisors.\n\nTo facilitate a seamless contest, we humbly request access to the hall's public address system, four cordless stage microphones, and ceiling projection screens. Our executive board solemnly guarantees that all electrical fixtures and upholstery will be handled with utmost care. Furthermore, our student protocol corps will clean the entire hall and dispose of all litter immediately following the closing ceremony.\n\nWe would be immensely honored if you could grace the occasion as our Special Guest of Honor to deliver brief opening remarks.\n\nThank you very much for your continuous support of youth intellectual development.\n\nYours sincerely,\nKelvin Amartey",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Formal: Application for Student Welfare and Disciplinary Committee Member
  {
    id: "B7_S4_A_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Formal Letter",
    title: "Application for Disciplinary Committee Junior Member",
    shortSummary: "Apply to the Senior Housemistress for appointment as the junior pupil representative on the school disciplinary board.",
    prompt: "Your school has instituted a joint teacher-student Disciplinary and Restorative Justice Committee to resolve junior pupil conflicts fairly. Write a formal letter of application to the Senior Housemistress, applying to serve as the Basic 7 student panelist. State your ethical qualifications, analyze why peer restorative justice is superior to corporal punishment, and explain how you will handle confidential pupil disciplinary matters.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Restorative Justice Analysis & Ethical Confidentiality",
    learningCompetency: "B7.4.2.1.2: Compose formal applications demonstrating ethical self-advocacy, restorative justice advocacy, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Madam,'. Conclude with 'Yours faithfully,', signature, full name, and class designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Junior Leadership Desk,", "Yaa Asantewaa Girls' Junior High School,", "P.O. Box 450,", "Kumasi,", "Ashanti Region.", "18th November, 2026."],
        allowedDatingFormats: ["18th November, 2026", "18 November 2026"],
        prohibitedDatingFormats: ["18/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Senior Housemistress,",
        officeOrSchoolPlaceholder: "Yaa Asantewaa Girls' Junior High School,",
        postalBoxPlaceholder: "P.O. Box 450,",
        townRegionPlaceholder: "Kumasi, Ashanti Region.",
        formatContaminationPenaltyWarning: "CRITICAL: Full inside address is required."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Madam,",
        permissibleSalutations: ["Dear Madam,"],
        bannedSalutations: ["Dear Mrs. Housemistress,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "APPLICATION FOR APPOINTMENT TO THE RESTORATIVE JUSTICE COMMITTEE",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of student panelist on the Restorative Justice Committee.", transitionHints: ["I write to formally submit my candidature for the office of...", "In response to the administration's call for student representation on the..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Detail your personal integrity, fairness, and past record in peer conflict mediation.", transitionHints: ["Throughout my academic stay in Basic 7, I have maintained an unblemished...", "In primary school, I served creditably as the peer dispute mediator, where I..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Explain why restorative justice (reconciliation, dialogue) works better than punitive measures, and pledge confidentiality.", transitionHints: ["I strongly believe that restorative justice transforms offender behavior more effectively than...", "I understand the sensitive nature of disciplinary proceedings and solemnly pledge to maintain..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your readiness to uphold school regulations and appear for vetting.", transitionHints: ["I pledge to discharge my duties with absolute impartiality and loyalty...", "I look forward to an opportunity to be interviewed by the vetting board..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Student, Basic 7A",
        coOccurrenceConstraint: "'Dear Madam,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application purpose declared clearly (2 marks)", "Integrity and peer mediation credentials presented (4 marks)", "Restorative justice defended and confidentiality pledged (4 marks)"],
      ["Panelist post clear", "Conflict resolution skills shown", "Confidentiality guaranteed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation 'Dear Madam,' (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, mature ethical register (4 marks)", "Zero contractions (3 marks)", "Persuasive philosophical and administrative vocabulary (3 marks)"],
      ["Objective, dignified tone", "Smooth rhetorical progression", "Precise ethical vocabulary"]
    ),
    modelAnswer: "Junior Leadership Desk,\nYaa Asantewaa Girls' Junior High School,\nP.O. Box 450,\nKumasi,\nAshanti Region.\n18th November, 2026.\n\nThe Senior Housemistress,\nYaa Asantewaa Girls' Junior High School,\nP.O. Box 450,\nKumasi,\nAshanti Region.\n\nDear Madam,\n\nAPPLICATION FOR APPOINTMENT TO THE RESTORATIVE JUSTICE COMMITTEE\n\nI write to formally submit my application to serve as the Basic 7 Student Panelist on the newly established School Disciplinary and Restorative Justice Committee, following the administration's call for student nominations.\n\nMy commitment to equity, empathy, and institutional discipline makes me an ideal candidate for this sensitive role. Throughout my academic tenure in Basic 7, I have maintained an unblemished conduct record and earned the trust of my classmates. During my final year at Garrison Primary School, I served as a student peer mediator, resolving interpersonal friction and minor classroom disputes peacefully before they escalated into punitive disciplinary cases.\n\nI firmly believe that restorative justice is vastly superior to purely retributive punishments. While physical manual labor often breeds resentment and alienation, restorative dialogue compels offenders to understand the emotional and academic impact of their infractions, take ownership of their actions, and make genuine amends to affected peers. I recognize that disciplinary hearings involve sensitive personal information, and I solemnly pledge to uphold absolute confidentiality regarding all committee proceedings.\n\nIf given the opportunity to serve, I will execute my duties with impartiality, emotional maturity, and unwavering allegiance to school regulations.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nSerwaa Akoto\nStudent, Basic 7A",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Civic Petition: Deplorable Feeder Road Paralyzing Agricultural Evacuation
  {
    id: "B7_S4_A_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Civic Petition",
    title: "Petition on Collapsed Feeder Road Network",
    shortSummary: "Petition the District Chief Executive over eroded feeder roads trapping farm produce in villages.",
    prompt: "The unpaved feeder road connecting your farming village to the municipal market has developed deep gullies and a broken culvert, stranding farmers and causing tons of harvested perishable crops to rot. As the Secretary of the Agrarian Youth Association, write a formal petition to your District Chief Executive (DCE), presenting economic and educational evidence of the road collapse and appealing for urgent bulldozing, regrading, and culvert construction.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Economic Petition Architecture, Infrastructure Impact Analysis & Statutory Requisition",
    learningCompetency: "B7.4.2.1.2: Compose formal petitions to local government executives detailing rural infrastructural neglect, post-harvest losses, and concrete engineering prayers.",
    hint: "Address to 'The District Chief Executive,'. State the crisis factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Agrarian Youth Association Secretariat,", "P.O. Box 32,", "Tepa-Ahafo,", "Ashanti Region.", "22nd November, 2026."],
        allowedDatingFormats: ["22nd November, 2026", "22 November 2026"],
        prohibitedDatingFormats: ["22/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The District Chief Executive,",
        officeOrSchoolPlaceholder: "Ahafo Ano North Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box 1,",
        townRegionPlaceholder: "Tepa, Ashanti Region.",
        formatContaminationPenaltyWarning: "CRITICAL: Full inside address is required."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Sir,",
        permissibleSalutations: ["Dear Sir,", "Honorable Sir,"],
        bannedSalutations: ["Dear DCE,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "PETITION ON THE DEPLORABLE STATE OF THE TEPA-MANFO FEEDER ROAD",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your association's mandate and declare the road infrastructure grievance.", transitionHints: ["We, the executive committee of the Agrarian Youth Association, respectfully petition...", "I write on behalf of over three thousand agrarian families and school children to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the post-harvest economic losses and educational disruption caused by collapsed culverts.", transitionHints: ["Over the past two months, heavy torrential rains have eroded the road into...", "Commercial transport vehicles refuse to ply the route, causing tons of harvested plantain and cocoa to..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (emergency deployment of motor graders, drainage culvert reconstruction, and gravel laying).", transitionHints: ["We therefore humbly pray that your honorable administration take immediate engineering action...", "First, we appeal for the urgent dispatch of the municipal feeder roads engineering unit to..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Emphasize the urgency of preventing economic destitution and school closures.", transitionHints: ["The economic survival and educational development of our farming belt hang in the balance...", "Thank you very much for your leadership and anticipated swift intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "General Secretary, Agrarian Youth Association",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Agrarian youth representation established (2 marks)", "Post-harvest food losses and school disruption documented (4 marks)", "Clear three-point road rehabilitation prayer presented (4 marks)"],
      ["Association mandate clear", "Economic and school impacts detailed", "Grading and culvert repair demanded"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Forceful, authoritative civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive economic and infrastructure vocabulary (3 marks)"],
      ["Persuasive civic language", "Logical problem-evidence-prayer flow", "Precise agricultural and road engineering vocabulary"]
    ),
    modelAnswer: "Agrarian Youth Association Secretariat,\nP.O. Box 32,\nTepa-Ahafo,\nAshanti Region.\n22nd November, 2026.\n\nThe District Chief Executive,\nAhafo Ano North Municipal Assembly,\nP.O. Box 1,\nTepa, Ashanti Region.\n\nDear Sir,\n\nPETITION ON THE DEPLORABLE STATE OF THE TEPA-MANFO FEEDER ROAD\n\nI write on behalf of the executive committee of the Agrarian Youth Association and the farming communities of Manfo, Subriso, and Dotoam to respectfully submit this urgent petition concerning the severe collapse of the main twelve-kilometer feeder road connecting our agrarian belt to the Tepa commercial market.\n\nFollowing recent torrential downpours, the arterial road has deteriorated into dangerous impassable mud craters, while the central wooden box culvert over the Tano tributary has completely collapsed. Consequently, commercial haulage trucks and passenger minibuses have suspended operations on the corridor. Over thirty metric tons of harvested plantains, tomatoes, and bagged cocoa beans are rotting on farm gates, causing catastrophic financial ruin for subsistence farming households. Furthermore, basic school teachers living in Tepa are unable to commute to our community schools, leaving hundreds of pupils without instructional supervision for the third consecutive week.\n\nTo avert total economic collapse and educational deprivation, we humbly pray that your honorable office enforce three emergency remedial interventions. First, we appeal for the immediate dispatch of the municipal feeder roads engineering unit to deploy bulldozers and motor graders to regrade the road. Second, we demand the immediate reconstruction of the collapsed stream culvert using reinforced concrete rings. Finally, we request the application of compact quarry gravel along the waterlogged portions to allow light vehicular transit before the weekend market day.\n\nOur agrarian livelihoods and children's education depend on your swift administrative intervention.\n\nThank you very much for your leadership and anticipated decisive action.\n\nYours faithfully,\n[Signature]\nClement Boakye\nGeneral Secretary, Agrarian Youth Association",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Formal Letter to Editor: Eradicating Cyber-Fraud & Indiscipline among Youth
  {
    id: "B7_S4_A_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "advanced",
    category: "Formal Letter",
    title: "Combating Youth Cyber-Fraud & Digital Malpractice",
    shortSummary: "Write to the Editor of a national newspaper on youth cyber-crime and commercial internet café regulation.",
    prompt: "An increasing number of junior secondary school students in urban centers are dropping out of school to engage in commercial internet fraud (popularly known as 'sakawa'). Write a letter to the Editor of a national daily newspaper, analyzing how the quest for quick wealth erodes moral values among youth, examining the role of unregulated commercial internet cafés, and recommending two statutory regulatory measures to eradicate the menace.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Letter to the Press Architecture, Forensic Social Commentary & Statutory Valediction",
    learningCompetency: "B7.4.2.1.2: Compose formal letters to national editors analyzing contemporary sociological menaces and recommending regulatory statutory interventions.",
    hint: "Address to 'The Editor, Daily Graphic,'. Include an un-underlined BLOCK CAPITAL heading. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', your signature, full name, and your residential town.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Civic Education Youth Forum,", "P.O. Box 550,", "Kasoa,", "Central Region.", "26th November, 2026."],
        allowedDatingFormats: ["26th November, 2026", "26 November 2026"],
        prohibitedDatingFormats: ["26/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Editor,",
        officeOrSchoolPlaceholder: "Daily Graphic,",
        postalBoxPlaceholder: "P.O. Box 742,",
        townRegionPlaceholder: "Accra.",
        formatContaminationPenaltyWarning: "CRITICAL: Letters to the press require the editor's inside address."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Sir,",
        permissibleSalutations: ["Dear Sir,", "Sir,"],
        bannedSalutations: ["Dear Editor,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "CURBING THE CANCER OF YOUTH CYBER-FRAUD AND MORAL DECAY",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Request editorial space and state the grave social menace directly.", transitionHints: ["Permit me space in your widely read national daily to voice...", "I write to draw national attention to the alarming moral decay and cyber-fraud..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Analyze how the lure of fast illicit wealth causes school dropouts, erosion of work ethics, and tarnishes national reputation.", transitionHints: ["It is deeply distressing that dozens of junior secondary pupils are abandoning classrooms...", "The illusion of instant digital wealth has corroded the timeless values of hard work and integrity..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Examine the complicity of unregulated internet cafés and propose two statutory remedies (police task forces, cyber licensing).", transitionHints: ["Unscrupulous internet café operators facilitate this crime by...", "To eradicate this menace, municipal authorities and the cybersecurity authority must..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Summarize the moral urgency of collective parental, church, and state intervention.", transitionHints: ["If we fail to act decisively, our educational investments will be nullified...", "I pray that this appeal mobilizes parents, traditional leaders, and law enforcement agencies..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Kasoa, Central Region",
        coOccurrenceConstraint: "Letters to the editor terminate with 'Yours faithfully,', signature, full name, and town/region."
      }
    },
    rubric: createWAECRubric(
      ["Editorial space requested and social issue stated (2 marks)", "Moral decay and educational dropout impact analyzed (4 marks)", "Two statutory regulatory solutions proposed (4 marks)"],
      ["Editorial space requested", "Moral and educational impacts analyzed", "Regulatory solutions outlined"],
      ["Two addresses correctly positioned (1 mark)", "Salutation 'Dear Sir,' (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Sign-off with signature, name, and town (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Sign-off includes town"],
      ["Authoritative civic commentary register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive sociological vocabulary (3 marks)"],
      ["Elevated civic vocabulary", "Effective paragraph links", "Varied sentence patterns"]
    ),
    modelAnswer: "Civic Education Youth Forum,\nP.O. Box 550,\nKasoa,\nCentral Region.\n26th November, 2026.\n\nThe Editor,\nDaily Graphic,\nP.O. Box 742,\nAccra.\n\nDear Sir,\n\nCURBING THE CANCER OF YOUTH CYBER-FRAUD AND MORAL DECAY\n\nPermit me a space in your widely read national daily newspaper to sound an urgent clarion call regarding the alarming proliferation of cyber-fraud—popularly termed 'sakawa'—among junior secondary school pupils in our urban centers.\n\nIt is deeply alarming that children barely thirteen years old are abandoning classrooms to spend long nights in dark, unregulated internet cafés, orchestrating deceptive romance scams and financial identity theft. The obsession with flashy cars, designer clothes, and overnight wealth has obliterated the virtues of honest labor, patient diligence, and academic perseverance. Promising young minds that should be studying science and literature to drive national industrialization are instead entangling themselves in organized crime, bringing international shame to our sovereign nation.\n\nThis destructive social cancer is heavily fueled by unscrupulous commercial internet café proprietors who rent computers to minors during instructional school hours without questioning their activities. To eliminate this menace, I propose two urgent statutory interventions. First, the Cyber Security Authority, in tandem with the Ghana Police Service, must conduct unannounced night raids on commercial browsing hubs, arresting café owners who permit minors to operate unmonitored digital terminals. Second, municipal assemblies must pass strict business licensing bylaws mandating biometric user registration at all commercial internet centers, backed by automatic business revocations for violators.\n\nWe cannot sit idly by while a generation of potential doctors, engineers, and educators is consumed by digital criminality.\n\nYours faithfully,\n[Signature]\nBenjamin Appiah\nKasoa, Central Region",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
export async function deployStrand4B7AdvancedClean() {
  console.log("Building clean 60-item Strand 4 B7 Advanced Practice Lab...");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective, Shuffled Options)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory, Flippable Prompts)");

  const db = await getFirestoreDb();
  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // 1. Build Section A (Questions 1 to 50: Objective Multiple-Choice with Shuffled Options)
  rawObjective50Data.forEach((item, index) => {
    const qNum = index + 1;
    const shuffledOptions = shuffleArray<string>(item.options);

    all60Items.push({
      id: `B7_S4_A_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B7",
      difficulty: "advanced",
      category: "Epistolary Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n\"${item.passage}\"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: shuffledOptions,
      correctAnswer: item.answer, // Matches the exact target string regardless of shuffled index
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B7.4.2.1: Demonstrate advanced mastery of epistolary formatting, address architecture, dating laws, salutation/close pairings, and caption rules."
    });
  });

  // 2. Build Section B (Questions 51 to 60: Theory Structured Essays)
  theory10Prompts.forEach((task) => {
    all60Items.push(task);
  });

  const docIds = ['writing_letter_formats', 'writing_composition_letters_petitions'];
  const parentCollections = ['topical', 'topics', 'topical_units'];

  const labPayload = {
    level: "B7",
    difficulty: "advanced",
    title: "Basic 7 Advanced Writing Lab: 50 Objective Drills + 10 Theory Writing Tasks",
    totalItemsCount: all60Items.length,
    totalQuestions: all60Items.length,
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
    questions: all60Items, // Dual-populating tasks and questions to ensure compatibility across all runners
    metadata: {
      curriculum: "NaCCA Common Core Programme (CCP) Standard",
      strand: "Strand 4: Writing",
      subStrand: "Sub-Strand 2: Text Types and Purposes (Letter Writing & Petitions)",
      evaluationEngine: "Gemini 2.5 Flash WAEC 4-Tier Evaluator (30 Marks)",
      canonicalTopicPath: "global_curriculum/jhs/subjects/english/topical/writing_letter_formats",
      updatedAt: new Date().toISOString()
    }
  };

  for (const docId of docIds) {
    // 3. Write directly to Firestore Practice Lab Document
    const targetDoc = db.doc(
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B7_advanced`
    );
    await targetDoc.set(labPayload);
    console.log(`   ✅ Deployed Practice Lab: ${targetDoc.path}`);

    // 4. Synchronize into the main topical document practice pool
    for (const parentCol of parentCollections) {
      const mainTopicDoc = db.doc(
        `global_curriculum/jhs/subjects/english/${parentCol}/${docId}`
      );

      await mainTopicDoc.set({
        levels: {
          b7: {
            practicePool: {
              hard: all60Items
            },
            tasks: all60Items,
            questions: all60Items
          }
        },
        tasks: all60Items,
        questions: all60Items
      }, { merge: true });
      console.log(`   ✅ Synchronized Practice Pool: ${mainTopicDoc.path}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all60Items.length} items to practice labs & pools!`);
}

deployStrand4B7AdvancedClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B7 Advanced Clean 60 Lab:", err);
    process.exit(1);
  });

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
  level: "B8";
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
  level: "B8";
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
        "Rigorous subject-verb agreement across multi-tier subordinate clauses",
        "Tense sequence consistency with zero informal contraction slips in formal discourse",
        "Syntactic elegance in forensic exposition and policy argument progression"
      ]
    }
  }
});

// =========================================================================
// 50 UNIQUE OBJECTIVE EPISTOLARY DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const rawObjective50Data = [
  {
    "passage": "A candidate drafting an administrative petition to a ministerial secretariat writes the inside address: 'The Chief Director, Ministry of Environment, Science and Technology, Ministries Post Office, Accra.'.",
    "question": "Under standard closed punctuation rules, what punctuation mark must terminate the first three lines before the final line?",
    "options": [
      "A comma",
      "A semicolon",
      "A colon",
      "No punctuation mark"
    ],
    "answer": "A comma",
    "hint": "Every intermediate line in closed punctuation ends with a comma.",
    "solution": "Under closed punctuation conventions, intermediate lines of an address block end with a comma, while the terminal geographic entity ends with a full stop.",
    "target": "Address Architecture: Closed Punctuation Syntax"
  },
  {
    "passage": "In a formal query response, a student writes: 'I am in receipt of your letter and I didn't fail to submit the report deliberately.'",
    "question": "What exact mechanical and register defect occurs in this statement?",
    "options": [
      "Use of the informal contracted auxiliary 'didn't' in a formal administrative query response",
      "Using the active voice instead of passive voice",
      "Beginning the sentence with the pronoun 'I'",
      "Failure to include an official date in the body"
    ],
    "answer": "Use of the informal contracted auxiliary 'didn't' in a formal administrative query response",
    "hint": "Contracted auxiliaries are strictly prohibited in formal correspondence.",
    "solution": "Formal institutional letters prohibit contracted forms. 'Didn't' must be written in full as 'did not' to preserve formal register.",
    "target": "Formal Register: Contraction Prohibition"
  },
  {
    "passage": "A candidate applies the modern open punctuation convention for the sender's address block.",
    "question": "Which of the following date presentations strictly satisfies pure open punctuation with absolute accuracy?",
    "options": [
      "18 November 2026",
      "18th November, 2026.",
      "18th November 2026",
      "November 18th, 2026."
    ],
    "answer": "18 November 2026",
    "hint": "Pure open punctuation omits commas, terminal periods, and ordinal suffixes.",
    "solution": "Pure open punctuation uses cardinal figures without ordinal suffixes ('th'), commas, or terminal periods: '18 November 2026'.",
    "target": "Address Architecture: Pure Open Punctuation Dating"
  },
  {
    "passage": "A petition is addressed to: 'The Paramount Chief, New Juaben Traditional Council, Yiadom-Hwedie Palace, Koforidua.'.",
    "question": "Which formal salutation strictly aligns with Ghanaian administrative and traditional protocol?",
    "options": [
      "Nana, / His Royal Majesty, / Dear Sir,",
      "Dear Chief Osei,",
      "Hello Nana Chief,",
      "Dear Mr. Paramount Chief,"
    ],
    "answer": "Nana, / His Royal Majesty, / Dear Sir,",
    "hint": "Traditional rulers require traditional honorifics or formal administrative greetings.",
    "solution": "Official correspondence to traditional rulers uses recognized honorifics such as 'Nana,', 'His Royal Majesty,', or the formal administrative 'Dear Sir,'.",
    "target": "Epistolary Salutations: Traditional Authorities"
  },
  {
    "passage": "A candidate writes the caption for an administrative petition as: <u>PETITION CONCERNING ILLEGAL ALLUVIAL GOLD MINING</u>.",
    "question": "Under WAEC Chief Examiner guidelines, why is this formatting penalized?",
    "options": [
      "Underlining a heading written in full block capital letters is a mechanical layout error",
      "The heading should have been italicized",
      "Petitions must never have a subject heading",
      "The heading must be written in red ink"
    ],
    "answer": "Underlining a heading written in full block capital letters is a mechanical layout error",
    "hint": "Headings in all-caps must never be underlined.",
    "solution": "Under WAEC marking rubrics, full capital block headings must not be underlined. Underlining is reserved exclusively for Title Case headings.",
    "target": "Caption Orthography: Underlining Rules"
  },
  {
    "passage": "A student writes to the Senior Housemaster and signs off: 'Yours sincerely, \\n [Signature] \\n Kwame Mensah \\n Senior Prefect'.",
    "question": "Under what specific condition is 'Yours sincerely,' acceptable in this formal context?",
    "options": [
      "Only when the Housemaster was addressed by surname in the salutation (e.g., 'Dear Mr. Mensah,')",
      "Whenever the student holds a senior prefectorial rank",
      "Only when the letter discusses boarding house matters",
      "Whenever two addresses are present on the sheet"
    ],
    "answer": "Only when the Housemaster was addressed by surname in the salutation (e.g., 'Dear Mr. Mensah,')",
    "hint": "'Yours sincerely,' requires a personal name in the salutation.",
    "solution": "The co-occurrence constraint mandates that 'Yours sincerely,' is used only when the salutation addresses the recipient by surname ('Dear Mr. Mensah,'). An impersonal salutation ('Dear Sir,') strictly commands 'Yours faithfully,'.",
    "target": "Co-Occurrence Constraint: Named vs. Unnamed Salutations"
  },
  {
    "passage": "A pupil writes an informal letter to his elder brother seeking financial support for a school field trip.",
    "question": "Which sign-off strictly conforms to the mononymic rule in informal correspondence?",
    "options": [
      "Your loving brother, \\n Kwadwo",
      "Yours faithfully, \\n Kwadwo Mensah",
      "I remain, your obedient brother, \\n K. Mensah",
      "Yours sincerely, \\n Master Kwadwo Mensah"
    ],
    "answer": "Your loving brother, \\n Kwadwo",
    "hint": "Informal letters to family require first name only.",
    "solution": "Informal family letters require an affectionate subscription and strictly the writer's first name ('Kwadwo') without surnames or signatures.",
    "target": "Informal Sign-off: Mononymic Protocol"
  },
  {
    "passage": "In a published letter to the Editor of a national daily, the contributor signs off as: 'Yours faithfully, \\n [Signature] \\n Ama Boateng \\n Kumasi'.",
    "question": "Why is the city name 'Kumasi' appended on the fourth line instead of an institutional post?",
    "options": [
      "Because public correspondence to the press requires the contributor's residential locality rather than an institutional post",
      "Because the writer forgot to state her school name",
      "Because the newspaper editor resides in Kumasi",
      "Because letters to the editor prohibit official signatures"
    ],
    "answer": "Because public correspondence to the press requires the contributor's residential locality rather than an institutional post",
    "hint": "Letters to the press identify contributors by their town or city.",
    "solution": "In public letters to the editor, private citizens provide their geographic residential town (e.g., 'Kumasi') to establish locality for public record.",
    "target": "Letters to the Editor: Geographic Attribution"
  },
  {
    "passage": "Which of the following sentences exhibits the most sophisticated formal administrative vocabulary?",
    "question": "Select the sentence demonstrating formal administrative elevation:",
    "options": [
      "I write to respectfully draw your attention to the deteriorating state of the municipal drainage system.",
      "I am writing this letter to tell you that our gutters are very dirty and broken.",
      "Please look into our gutters because they smell bad and students are falling inside.",
      "Our drainage is in a total mess and you have to send workers to fix it quickly."
    ],
    "answer": "I write to respectfully draw your attention to the deteriorating state of the municipal drainage system.",
    "hint": "Formal writing uses elevated vocabulary like 'respectfully draw your attention' and 'deteriorating'.",
    "solution": "'I write to respectfully draw your attention to the deteriorating state...' demonstrates the elevated, dignified register expected in formal administrative correspondence.",
    "target": "Formal Administrative Lexis"
  },
  {
    "passage": "A student formats an address block using the traditional slanted (indented) layout.",
    "question": "How must each subsequent line in a slanted address block be arranged?",
    "options": [
      "Each succeeding line should begin slightly to the right of the line above it",
      "All lines must be flush along the left vertical margin",
      "Lines must alternate between the left and right sides of the page",
      "Every line must be centered horizontally"
    ],
    "answer": "Each succeeding line should begin slightly to the right of the line above it",
    "hint": "Slanted formatting indents each progressive line.",
    "solution": "In traditional slanted address formatting, each subsequent line steps progressively to the right of the preceding line.",
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
    "solution": "The Principle of Proximity Concord dictates that with correlative coordinators ('neither... nor'), the verb agrees with the nearest subject nominal ('teachers' -> 'were').",
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
    "hint": "Formal business clich\u00e9s sound unnatural in letters to friends.",
    "solution": "Using formal recruitment clich\u00e9s in an informal letter creates severe register dissonance. Friendly correspondence requires warm, natural language.",
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
    "passage": "What is the primary stylistic hazard of using clich\u00e9s like 'As cool as a cucumber' or 'Raining cats and dogs' in a formal letter?",
    "question": "Why should these idioms be avoided in formal writing?",
    "options": [
      "They are trite, informal colloquialisms that undermine institutional seriousness and degrade the Expression score",
      "They are too difficult for examiners to understand",
      "They increase the word count unnecessarily",
      "They violate British spelling rules"
    ],
    "answer": "They are trite, informal colloquialisms that undermine institutional seriousness and degrade the Expression score",
    "hint": "Clich\u00e9s and idioms belong to colloquial conversation, not formal correspondence.",
    "solution": "Colloquial idioms and clich\u00e9s are considered trite and informal. Formal letters require precise, literal, and dignified phrasing.",
    "target": "Expression: Idiomatic Clich\u00e9 Penalties"
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
// Basic 8 Advanced Scaffolds & Model Letters (~250 words each)
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Informal: Navigating Academic Competition & Peer Pressure
  {
    id: "B8_S4_A_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Informal Letter",
    title: "Navigating Academic Competition & Peer Pressure",
    shortSummary: "Write to an older cousin on managing intense academic competition without sacrificing integrity.",
    prompt: "As Basic 8 pupils prepare for senior school selection, intense academic competition has triggered unhealthy rivalry and examination malpractice among your peers. Write a letter to your older cousin studying at university, describing the toxic classroom atmosphere, sharing how you remain focused on honest diligence, and asking for strategies to handle peer pressure while maintaining top grades.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Ethical Narrative, Psychological Reflection & Sibling Mentorship",
    learningCompetency: "B8.4.2.1.1: Compose reflective personal letters evaluating peer dynamics, ethical academic integrity, and personal resilience.",
    hint: "Use single address formatting. Express your moral convictions with maturity and conversational warmth. Conclude with an affectionate subscription and your first name only.",
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
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his university studies and introduce the tense classroom atmosphere.", transitionHints: ["I hope this letter finds you thriving in your studies...", "As we enter the crucial second term of Basic 8, the academic atmosphere has become..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the toxic rivalry, hoarding of textbooks, and temptation toward test cheating.", transitionHints: ["Desperation for Category A school placement has fostered unhealthy rivalry...", "Some classmates have begun hoarding library materials and forming clandestine cheating syndicates..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain your personal commitment to honest diligence and ask for his psychological coping strategies.", transitionHints: ["I have resisted the pressure to compromise my integrity by focusing on personal mastery...", "How did you manage intense peer rivalry during your secondary school days?"] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your values and ask him to reply soon.", transitionHints: ["Your counsel has always been my compass...", "Please write back soon and share your thoughts..."] }
        ]
      },
      signOffGuide: {
        format: "mononymic",
        subscription: "Your loving cousin,",
        requiresHandwrittenSignature: false,
        printedNameFormat: "first_name_only",
        coOccurrenceConstraint: "End with an affectionate family closing and your first name only."
      }
    },
    rubric: createWAECRubric(
      ["Warm opening and academic context established (2 marks)", "Detailed account of peer pressure and ethical dilemma (4 marks)", "Principled coping stance and thoughtful questions presented (4 marks)"],
      ["Cousin acknowledged warmly", "Classroom dynamics described vividly", "Ethical resilience explained"],
      ["Single address format correctly styled (1 mark)", "Familial salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct address layout", "Consistent punctuation", "First name only at closing"],
      ["Warm, mature, and reflective tone (4 marks)", "Permissible contractions used naturally (3 marks)", "Rich ethical and academic vocabulary (3 marks)"],
      ["Reflective sibling rapport", "Clear paragraph transitions", "Vivid narrative lexis"]
    ),
    modelAnswer: `St. Augustine's Junior High School,\nP.O. Box 98,\nCape Coast,\nCentral Region.\n14th October, 2026.\n\nDear Brother Kojo,\n\nI hope this letter finds you thriving in your university studies in Legon. We all miss your inspiring presence during vacation gatherings! As our Basic 8 cohort enters the second term, discussions surrounding senior high school selection have transformed our once-cooperative classroom into an arena of intense and unhealthy rivalry, prompting me to seek your seasoned perspective.\n\nThe pressure to qualify for premier Category A institutions has driven many of my classmates to extremes. Students now deliberately hoard past question booklets, refuse to share class notes with absent peers, and celebrate others' academic setbacks. More distressing is the growing temptation toward examination malpractice during continuous assessments, with several pupils forming clandestine networks to smuggle unauthorized notes into test halls. Being mocked as a 'foolish idealist' simply because I refuse to participate in these schemes has been emotionally draining.\n\nDespite the hostility, I remain committed to the timeless values of honest labor and personal discipline that our family instilled in us. I remind myself daily that an unearned grade is an illusion that crumbles when true competence is tested. I focus on disciplined personal study, solving mathematics drills independently and reading extensively.\n\nSince you navigated these same corridors with distinction, how did you maintain your composure and inner peace when surrounded by toxic peer pressure? How did you protect your friendships without compromising your principles?\n\nYour guidance has always been my anchor. Please write back soon and share your insights.\n\nYour loving cousin,\nKwabena`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Informal: The Ecological Value of Wetlands to a Pen Pal
  {
    id: "B8_S4_A_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Informal Letter",
    title: "Wetland Ecology & Coastal Conservation",
    shortSummary: "Write to a foreign pen pal describing an excursion to the Muni-Pomadze Ramsar wetland site.",
    prompt: "Your school wildlife club visited the Muni-Pomadze Ramsar wetland site in Winneba to study migratory shorebirds and mangrove ecology. Write a letter to your pen pal in South Africa, vividly describing the excursion, explaining the crucial ecological role of wetlands in flood control and carbon storage, and discussing how encroaching real estate development threatens these fragile habitats.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Ecological Expository Exposition, Scientific Description & Informal Rapport",
    learningCompetency: "B8.4.2.1.1: Compose descriptive personal letters detailing scientific field research, ecological sustainability, and wetland conservation.",
    hint: "Use single address formatting. Integrate scientific concepts like biodiversity and flood mitigation into warm conversational prose. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Wildlife Club Secretariat,", "Winneba Basic School,", "P.O. Box 52,", "Winneba,", "Central Region.", "20th October, 2026."],
        allowedDatingFormats: ["20th October, 2026", "20 October 2026"],
        prohibitedDatingFormats: ["20/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Thabo,",
        permissibleSalutations: ["Dear Thabo,", "Dearest Thabo,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his school in Durban and announce your scientific expedition to the coastal lagoon.", transitionHints: ["I hope this letter finds you well in Durban...", "I am eager to share the fascinating findings from our recent field trip..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe navigating the mangrove channels and observing migratory curlews and terns.", transitionHints: ["Our expedition into the Muni-Pomadze Ramsar site began at dawn...", "Gliding through the labyrinthine mangrove creeks in wooden canoes, we spotted..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain the ecological functions of wetlands (natural flood sponges, nursery for fish) and the threat of urban encroachment.", transitionHints: ["Our ecology tutor explained that wetlands act as nature's coastal kidneys...", "Tragically, unregulated estate developers are dumping construction debris to reclaim..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reflect on youth conservation advocacy and invite his thoughts on South African coastal reserves.", transitionHints: ["Safeguarding these wetlands is vital for climate resilience...", "Write back soon and tell me about the marine reserves along the Durban coast..."] }
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
      ["Warm opening and excursion context established (2 marks)", "Vivid sensory description of mangrove channels and wildlife (4 marks)", "Ecological mechanisms and development threats analyzed (4 marks)"],
      ["Durban pen pal acknowledged", "Mangrove expedition detailed vividly", "Ecological value and threats analyzed"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Lively, intellectual, and natural tone (4 marks)", "Natural conversational flow (3 marks)", "Rich scientific and ecological vocabulary (3 marks)"],
      ["Sensory details used effectively", "Smooth ecological transitions", "Apt descriptive vocabulary"]
    ),
    modelAnswer: `Wildlife Club Secretariat,\nWinneba Basic School,\nP.O. Box 52,\nWinneba,\nCentral Region.\n20th October, 2026.\n\nDear Thabo,\n\nI hope this letter finds you thriving in school in Durban. I recently returned from an eye-opening field expedition to the Muni-Pomadze Ramsar wetland sanctuary on the outskirts of Winneba, and I could not wait to share the ecological insights with you!\n\nOur journey commenced at sunrise as our club paddled wooden canoes through the tangled red mangrove swamps of the lagoon. The avian biodiversity was astonishing! Armed with binoculars, we observed flocks of migratory Royal Terns, Curlew Sandpipers, and Western Reef Herons that had flown thousands of kilometers from the Arctic tundra to feed on coastal mudflats. Watching a majestic pied kingfisher hover motionlessly before plunging into the brackish water to seize a silver mullet was an unforgettable spectacle.\n\nOur marine biology instructor emphasized that wetlands serve as nature's coastal kidneys and sponge. The intricate mangrove roots trap silt, neutralize chemical runoff, and serve as fertile breeding nurseries for over eighty percent of commercial marine fish species. Furthermore, these coastal estuaries act as vital shock absorbers, absorbing oceanic tidal surges and preventing catastrophic flooding in coastal villages. Tragically, this ecological marvel is under severe assault from unregulated estate developers who are bulldozing ancient mangrove groves and dumping gravel into the lagoon to build luxury beachfront villas.\n\nWitnessing this environmental destruction reinforced my conviction that young Africans must champion conservation. Are wetlands protected along the coast of KwaZulu-Natal?\n\nWrite back soon and let me know your thoughts.\n\nYour sincere friend,\nKofi`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Semi-Formal: Seeking Patronage for Community Coding Club
  {
    id: "B8_S4_A_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Semi-Formal Letter",
    title: "Patronage Request for Youth Coding Initiative",
    shortSummary: "Write to a software executive requesting mentorship and sponsorship for a community coding hub.",
    prompt: "You have co-founded the 'Digital Pioneers Club' to train underprivileged junior high school pupils in computer programming and algorithmic problem-solving. Write a semi-formal letter to Ing. Michael Mensah, a senior software executive at a leading technology firm and alumnus of your school, requesting him to serve as the Grand Patron of the initiative, outline the club's curriculum, and solicit surplus refurbished laptops for training.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Tech Advocacy, Corporate Alignment & Underlined Title Case Caption",
    learningCompetency: "B8.4.2.1.2: Compose semi-formal institutional requests to corporate alumni demonstrating project vision, curriculum structure, and resource appeals.",
    hint: "Salute with 'Dear Ing. Mensah,'. Provide an underlined Title Case caption. Detail your coding syllabus and laptop request professionally. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Digital Pioneers Secretariat,", "Ridge Church Basic School,", "P.O. Box 110,", "Accra.", "25th October, 2026."],
        allowedDatingFormats: ["25th October, 2026", "25 October 2026"],
        prohibitedDatingFormats: ["25/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Ing. Mensah,",
        permissibleSalutations: ["Dear Ing. Mensah,", "Dear Mr. Mensah,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for Patronage and Technical Sponsorship for Coding Club",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Respectfully state the purpose of your letter and announce the establishment of the coding club.", transitionHints: ["I write on behalf of the founding executives of the Digital Pioneers Club to respectfully invite you...", "As a distinguished alumnus and technological innovator, your career has inspired..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Outline the club's curriculum (Scratch visual coding, Python fundamentals, digital literacy) and its social mission.", transitionHints: ["Our initiative is designed to bridge the digital divide by training fifty junior secondary pupils in...", "The weekend curriculum encompasses foundational algorithmic logic, web design, and..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Formally request his acceptance of the Grand Patron role and appeal for surplus corporate laptops.", transitionHints: ["We humbly request you to honor our initiative by accepting the mantle of Grand Patron...", "To enable our students to write and test code, we appeal for your firm's assistance with..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Express profound anticipation and invite him to inspect an inaugural coding workshop.", transitionHints: ["We would be immensely honored if you could visit our training workshop...", "Thank you very much for your continuous dedication to youth technological empowerment..."] }
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
      ["Patronage invitation and club rationale established (2 marks)", "Technical coding curriculum and social impact detailed (4 marks)", "Resource appeal and accountability commitments outlined (4 marks)"],
      ["Alumnus connection established", "Coding syllabus detailed", "Laptop appeal articulated cleanly"],
      ["Single address format (1 mark)", "Honorific surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Caption underlined", "Correct subscription", "Full printed name without signature"],
      ["Respectful, professional, and articulate semi-formal tone (4 marks)", "Zero informal contractions (3 marks)", "Precise computing and corporate vocabulary (3 marks)"],
      ["Polite, elevated register", "Smooth technical transitions", "Rich vocabulary"]
    ),
    modelAnswer: `Digital Pioneers Secretariat,\nRidge Church Basic School,\nP.O. Box 110,\nAccra.\n25th October, 2026.\n\nDear Ing. Mensah,\n\nRequest for Patronage and Technical Sponsorship for Coding Club\n_______________________________________________________________\n\nI write on behalf of the student executive board of the Digital Pioneers Club to respectfully invite you to serve as our Grand Patron and to solicit your esteemed corporate mentorship for our youth coding initiative.\n\nAs an illustrious alumnus of Ridge Church Basic School and a pioneering software architect, your ground-breaking contributions to enterprise cloud computing across Africa continue to inspire our student body. Motivated by your example, we established this club to democratize computer science education for fifty underprivileged pupils from neighboring public basic schools who lack access to functional computer hardware.\n\nOur structured weekend syllabus covers computational thinking, block-based algorithmic design using Scratch, and introductory Python programming for web automation. However, our progress is severely constrained by an acute shortage of computing terminals; currently, four students are forced to huddle around a single borrowed desktop monitor. We humbly appeal to your kind office to consider donating ten decommissioned, refurbished corporate laptops to our community laboratory. Furthermore, we would be deeply honored if you would accept the role of Grand Patron to deliver quarterly masterclasses to our young coders.\n\nWe would be thrilled to host you at our inaugural weekend workshop next month to showcase our students' working interactive math games.\n\nThank you very much for your time, consideration, and unwavering commitment to nurturing Africa's next generation of technological leaders.\n\nYours sincerely,\nFrancis Kyeremeh`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Formal: Application for Student Welfare & Disciplinary Prefect
  {
    id: "B8_S4_A_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Formal Letter",
    title: "Application for Student Disciplinary Prefect",
    shortSummary: "Apply to the Headmaster for the office of Student Disciplinary Prefect with a restorative justice policy manifesto.",
    prompt: "Nominations have been declared open for student executive offices. Write a formal letter of application to your Headmaster, applying to serve as the School Disciplinary Prefect. Highlight your ethical track record, analyze why peer restorative justice is superior to harsh retributive punishment, and outline two innovative mechanisms to resolve classroom conflicts and curb absenteeism.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Restorative Justice Analysis & Quadripartite Close",
    learningCompetency: "B8.4.2.1.2: Compose formal administrative applications demonstrating ethical self-advocacy, restorative justice advocacy, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Prefectorial Candidates' Desk,", "Opoku Ware Basic School,", "P.O. Box 700,", "Kumasi,", "Ashanti Region.", "2nd November, 2026."],
        allowedDatingFormats: ["2nd November, 2026", "2 November 2026"],
        prohibitedDatingFormats: ["02/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Headmaster,",
        officeOrSchoolPlaceholder: "Opoku Ware Basic School,",
        postalBoxPlaceholder: "P.O. Box 700,",
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
        modelCaption: "APPLICATION FOR THE OFFICE OF SCHOOL DISCIPLINARY PREFECT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of Disciplinary Prefect and state your leadership philosophy.", transitionHints: ["I write to formally submit my candidature for the office of...", "Pursuant to the circular declaring nominations open for student governance..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Detail your personal integrity, punctuality, and past record in peer dispute mediation.", transitionHints: ["Throughout my two years in Basic 7 and Basic 8, I have maintained an immaculate record of...", "My peer leadership philosophy rejects brute intimidation in favor of moral persuasion..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Contrast retributive punishment with restorative justice, and propose peer mediation desks and truant tracking.", transitionHints: ["I firmly believe that retributive manual labor breeds resentment rather than reform...", "To build lasting discipline, I propose establishing an anonymous peer mediation committee and..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge absolute impartiality, confidentiality, and loyalty to the school administration.", transitionHints: ["I pledge to execute the duties of this office with unwavering integrity, equity, and discretion...", "Thank you very much for considering my application..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Applicant, Basic 8A",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application position stated clearly (2 marks)", "Integrity and peer mediation credentials demonstrated (4 marks)", "Restorative justice defended and two reform policies outlined (4 marks)"],
      ["Prefect post clear", "Ethical standing shown", "Restorative policies detailed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive philosophical and administrative vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: `Prefectorial Candidates' Desk,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi,\nAshanti Region.\n2nd November, 2026.\n\nThe Headmaster,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi, Ashanti Region.\n\nDear Sir,\n\nAPPLICATION FOR THE OFFICE OF SCHOOL DISCIPLINARY PREFECT\n\nI write to formally submit my candidature for the office of School Disciplinary Prefect for the upcoming 2026/2027 academic session, in response to the administrative circular inviting student leadership applications.\n\nMy leadership philosophy is founded upon equity, personal example, and moral persuasion. Throughout my tenure in Basic 7 and Basic 8, I have preserved an unblemished record of conduct, exemplary attendance, and consistent academic diligence. Having served creditably as the class protocol officer, I have developed refined conflict resolution competencies, frequently de-escalating playground altercations into peaceful compromises before they deteriorated into physical brawls.\n\nI am convinced that sustainable school discipline cannot be achieved through punitive corporal punishment or demoralizing manual weeding. Harsh retributive measures often breed resentment, student rebellion, and truancy. In contrast, restorative justice compels transgressors to confront the psychological and academic consequences of their misconduct, make constructive amends to affected peers, and reform. If elected, I will institute a 'Peer Conflict Mediation Forum' where trained class delegates mediate student disputes under teacher supervision. Additionally, I will establish an early-warning peer attendance ledger to identify and support students facing domestic hurdles before chronic absenteeism forces them out of school.\n\nI solemnly pledge to discharge the duties of this high office with absolute impartiality, emotional maturity, and unflinching fidelity to school bylaws.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nEmmanuel Osei-Bonsu\nApplicant, Basic 8A`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Civic Petition: Deplorable Healthcare Facilities & Maternal Mortality in Rural Clinics
  {
    id: "B8_S4_A_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Civic Petition",
    title: "Petition on Maternal & Infant Health Infrastructure in Rural Clinics",
    shortSummary: "Petition the District Chief Executive over chronic power outages, vaccine loss, and delivery room crises in rural clinics.",
    prompt: "The primary community health center serving three agrarian farming communities lacks an auxiliary power generator, resulting in spoiled vaccine cold-chains, water shortages, and midwives delivering babies using phone flashlights during frequent night blackouts. As the General Secretary of the Rural Youth Health Coalition, write a formal petition to your District Chief Executive (DCE), presenting forensic clinical evidence and demanding the immediate installation of a solar inverter system and an automated generator.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Healthcare Petition Architecture, Clinical Evidence & Statutory Prayer",
    learningCompetency: "B8.4.2.1.2: Compose civic petitions to local assemblies detailing clinical infrastructure crises, vaccine cold-chain failures, and concrete engineering prayers.",
    hint: "Address to 'The District Chief Executive,'. State the healthcare emergency factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Rural Youth Health Coalition,", "P.O. Box 42,", "Mampong-Ashanti,", "Ashanti Region.", "8th November, 2026."],
        allowedDatingFormats: ["8th November, 2026", "8 November 2026"],
        prohibitedDatingFormats: ["08/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The District Chief Executive,",
        officeOrSchoolPlaceholder: "Mampong Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box 10,",
        townRegionPlaceholder: "Mampong-Ashanti, Ashanti Region.",
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
        modelCaption: "PETITION FOR THE URGENT PROVISION OF BACKUP POWER AT APUTUOGYA CLINIC",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your coalition's mandate and declare the healthcare emergency clearly.", transitionHints: ["We, the executive committee of the Rural Youth Health Coalition, respectfully petition...", "I write on behalf of over four thousand residents across three agrarian villages to draw your urgent attention to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the frequent blackouts, spoiled childhood vaccines, and emergency night deliveries in darkness.", transitionHints: ["Over the past three months, chronic grid blackouts have crippled clinical operations...", "Midwives are routinely forced to perform emergency night deliveries using mobile phone torches..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (installation of a solar inverter system and provision of an auxiliary diesel generator).", transitionHints: ["We therefore humbly pray that your honorable administration execute three critical interventions...", "First, we demand the immediate installation of a five-kilowatt solar-powered battery inverter system..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent administrative action to safeguard maternal and infant lives.", transitionHints: ["The survival of vulnerable pregnant mothers and newborn infants hang in the balance...", "Thank you very much for your leadership and anticipated prompt intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "General Secretary, Rural Youth Health Coalition",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Coalition representation established (2 marks)", "Forensic clinical evidence of vaccine loss and blackout deliveries documented (4 marks)", "Clear three-point healthcare power prayer presented (4 marks)"],
      ["Coalition standing established", "Vaccine and maternity risks described clearly", "Solar and generator prayer stated"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive public health vocabulary (3 marks)"],
      ["Civic advocacy language", "Logical problem-evidence-prayer flow", "Precise medical and power engineering terms"]
    ),
    modelAnswer: `Rural Youth Health Coalition,\nP.O. Box 42,\nMampong-Ashanti,\nAshanti Region.\n8th November, 2026.\n\nThe District Chief Executive,\nMampong Municipal Assembly,\nP.O. Box 10,\nMampong-Ashanti, Ashanti Region.\n\nDear Sir,\n\nPETITION FOR THE URGENT PROVISION OF BACKUP POWER AT APUTUOGYA CLINIC\n\nI write on behalf of the executive committee of the Rural Youth Health Coalition and over four thousand residents of Aputuogya, Bosofour, and Daaho to respectfully submit this urgent petition concerning the life-threatening infrastructural breakdown at the Aputuogya Community Health Centre.\n\nFor the past three months, frequent unannounced municipal power outages have paralyzed clinical healthcare delivery at the facility. Because the clinic lacks a dedicated standby auxiliary generator, midwives and clinical officers are routinely compelled to deliver babies and suture deep surgical lacerations using flickering mobile phone flashlights. Even more disastrous is the repeated failure of the vaccine cold-chain infrastructure; on three separate occasions last month, hundreds of doses of essential childhood polio, measles, and tuberculosis vaccines spoiled due to prolonged refrigeration failure, leaving hundreds of newborn infants vulnerable to preventable fatal diseases.\n\nTo eliminate preventable maternal and infant fatalities, we humbly pray that your honorable administration enforce three emergency interventions. First, we appeal for the immediate procurement and installation of a robust five-kilowatt solar-powered battery inverter system dedicated exclusively to maintaining uninterrupted refrigeration for vaccine banks and illumination in the maternity ward. Second, we demand the supply of a heavy-duty standby diesel generator to power the clinic's water pumping system and diagnostic laboratory equipment. Finally, we urge the assembly to supply high-intensity surgical headlamps to clinical staff.\n\nThe right to healthcare is a sacred constitutional entitlement. We trust in your prompt leadership to avert further catastrophe.\n\nThank you for your dedicated service and anticipated swift intervention.\n\nYours faithfully,\n[Signature]\nSolomon Kwakye\nGeneral Secretary, Rural Youth Health Coalition`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Informal: Account of Inter-Schools Robotics Championship
  {
    id: "B8_S4_A_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Informal Letter",
    title: "Regional Robotics & Coding Championship Victory",
    shortSummary: "Write to a friend living abroad narrating your school's dramatic victory in an autonomous robotics tournament.",
    prompt: "Your school robotics team designed an autonomous maze-solving robot and won first place in the Regional STEM Innovation Challenge. Write a letter to your former classmate who relocated to Canada, narrating the tense final round of the competition, describing how your team debugged a sensor glitch under time pressure, and explaining how your robotic design automates agricultural weed detection.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Technical Narrative, Suspenseful Problem-Solving & International Peer Dialogue",
    learningCompetency: "B8.4.2.1.1: Compose friendly personal letters incorporating vivid narrative action, engineering problem-solving, and conversational warmth.",
    hint: "Use single address formatting. Narrate the technical debugging session with suspense and descriptive detail. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["STEM Club Secretariat,", "Opoku Ware Basic School,", "P.O. Box 700,", "Kumasi,", "Ashanti Region.", "12th November, 2026."],
        allowedDatingFormats: ["12th November, 2026", "12 November 2026"],
        prohibitedDatingFormats: ["12/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Selorm,",
        permissibleSalutations: ["Dear Selorm,", "Dearest Selorm,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his school in Toronto and announce the thrilling robotics victory.", transitionHints: ["I hope you are keeping warm in cold Toronto...", "I have the most exhilarating technological news to share with you!"] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the autonomous maze-solving competition and the agricultural weed-detection mechanism of your rover.", transitionHints: ["Our robotics team entered the regional innovation tournament with an autonomous rover named 'Agro-Bot'...", "Equipped with ultrasonic sensors and computerized color cameras, our robot was engineered to..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Narrate the tense moment when an infrared sensor malfunctioned and how your team recoded the algorithm in under five minutes.", transitionHints: ["Disaster nearly struck during the semi-final round when our left optical sensor glitched...", "With barely three minutes on the countdown clock, our programmer frantically patched the logic code..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Describe the crowd's roar upon winning first place and invite him to share his Canadian STEM experiences.", transitionHints: ["When Agro-Bot completed the final obstacle run in record time, the entire arena exploded...", "Write back soon and let me know about the computer science clubs in your school..."] }
        ]
      },
      signOffGuide: {
        format: "mononymic",
        subscription: "Your sincere friend,",
        requiresHandwrittenSignature: false,
        printedNameFormat: "first_name_only",
        coOccurrenceConstraint: "Informal letters conclude with friendly subscription and first name only."
      }
    },
    rubric: createWAECRubric(
      ["Warm opening and robotics victory context established (2 marks)", "Technical rover design and maze challenge described clearly (4 marks)", "Dramatic debugging narrative and victory celebration shared (4 marks)"],
      ["Friend in Canada acknowledged", "Robotics challenge detailed vividly", "Debugging and victory celebration included"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Lively, technical, and natural tone (4 marks)", "Natural conversational phrasing (3 marks)", "Rich STEM and engineering vocabulary (3 marks)"],
      ["Enthusiastic tone", "Smooth narrative flow", "Rich vocabulary"]
    ),
    modelAnswer: `STEM Club Secretariat,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi,\nAshanti Region.\n12th November, 2026.\n\nDear Selorm,\n\nI hope this letter finds you thriving in school in Toronto. We all miss your infectious energy during science practicals! I am writing to share the most thrilling news: our school robotics team just clinched first prize at the Ashanti Regional STEM Innovation Challenge!\n\nOur team entered an autonomous four-wheeled rover named 'Agro-Bot,' which we constructed using microcontrollers, servo motors, and recycled acrylic sheets. The machine was designed to navigate agricultural crop rows autonomously, using optical sensors to differentiate between healthy maize leaves and invasive weeds while mapping soil moisture levels. The championship required our rover to navigate a complex, randomized obstacle maze within three minutes.\n\nDisaster nearly knocked us out during the preliminary trial. A sudden voltage drop caused the left ultrasonic sensor to fail, sending Agro-Bot spinning blindly into a barrier. With the five-minute emergency timer ticking down on the giant arena screen, our programmer, Kwame, and I frantically recalibrated the sensor thresholds, rewrote the navigational logic loop in our Python script, and uploaded the patch via Bluetooth with barely forty seconds to spare!\n\nWhen our rover entered the championship course, it performed flawlessly. Agro-Bot calculated alternate turns in fractions of a second, bypassed every obstacle, and crossed the finish line in two minutes flat, setting a new tournament record! The entire arena erupted into thunderous applause, and the judges awarded us a gold trophy and a scholarship grant for our school laboratory.\n\nI wish you were there to celebrate with us. Write back soon and tell me about the engineering clubs in Canada!\n\nYour sincere friend,\nKelvin`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Semi-Formal: Seeking Partnership with Renewable Energy Firm
  {
    id: "B8_S4_A_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Semi-Formal Letter",
    title: "Solar Installation Mentorship & Partnership Request",
    shortSummary: "Write to a renewable energy executive seeking technical mentorship and equipment support for a school solar project.",
    prompt: "Your school's Young Engineers Club is constructing a prototype solar-powered irrigation system to support the school vegetable farm. Write a semi-formal letter to Ing. Kwame Boateng, the Managing Director of SunPower Ghana and an alumnus of your school, explaining the project's technical architecture, requesting technical mentorship for club members, and appealing for discarded solar photovoltaic panels.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Engineering Partnership, Technical Clarity & Resource Solicitation",
    learningCompetency: "B8.4.2.1.2: Compose semi-formal institutional requests to corporate executives detailing engineering schematics, educational mentorship, and equipment appeals.",
    hint: "Salute with 'Dear Ing. Boateng,'. Provide an underlined Title Case caption. Outline technical specifications, mentorship needs, and equipment requests. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Young Engineers Club Secretariat,", "Prempeh College Basic School,", "P.O. Box 192,", "Kumasi,", "Ashanti Region.", "15th November, 2026."],
        allowedDatingFormats: ["15th November, 2026", "15 November 2026"],
        prohibitedDatingFormats: ["15/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Ing. Boateng,",
        permissibleSalutations: ["Dear Ing. Boateng,", "Dear Mr. Boateng,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for Technical Mentorship and Equipment Partnership for Solar Project",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "State your engineering club leadership and declare the partnership request clearly.", transitionHints: ["I write in my capacity as President of the Young Engineers Club to respectfully request...", "We wish to seek technical mentorship and an equipment partnership with your esteemed firm for..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain the solar irrigation prototype designed to automate water pumping for the school farm.", transitionHints: ["Our prototype integrates a twelve-volt DC submersible pump with solar photovoltaic panels...", "By harnessing renewable solar energy, our project aims to eliminate the exhausting manual hauling of water..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Request quarterly technical mentorship from his engineers and appeal for surplus/tested solar panels.", transitionHints: ["We humbly appeal for your engineering team to provide technical oversight on charge controller wiring...", "Additionally, we would be profoundly grateful if your company could donate two surplus solar panels..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Invite him to inspect the project site and express gratitude for his continuous alumni support.", transitionHints: ["We would be immensely honored to host you on campus for a demonstration...", "Thank you very much for your continuous dedication to technological innovation in Ghana..."] }
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
      ["Club leadership and partnership purpose established (2 marks)", "Technical solar irrigation schematic and farm benefits detailed (4 marks)", "Mentorship and panel equipment appeal clearly articulated (4 marks)"],
      ["Young Engineers Club role clear", "Solar pump design explained technically", "Mentorship and panel donation requested"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Title Case underlined", "Correct subscription", "Full printed name"],
      ["Polite, professional semi-formal register (4 marks)", "Zero informal contractions (3 marks)", "Precise technical engineering vocabulary (3 marks)"],
      ["Courteous administrative tone", "Clear technical progression", "Precise engineering terminology"]
    ),
    modelAnswer: `Young Engineers Club Secretariat,\nPrempeh College Basic School,\nP.O. Box 192,\nKumasi,\nAshanti Region.\n15th November, 2026.\n\nDear Ing. Boateng,\n\nRequest for Technical Mentorship and Equipment Partnership for Solar Project\n___________________________________________________________________________\n\nI write in my capacity as President of the Young Engineers Club of Prempeh College Basic School to respectfully request your technical mentorship and corporate partnership as we construct an automated solar-powered irrigation prototype for our school vegetable farm.\n\nAs an esteemed alumnus and a foremost pioneer in renewable solar infrastructure across West Africa, your accomplishments inspire our thirty-five club members. Over the past term, our club designed an automated drip-irrigation system that utilizes a twelve-volt DC submersible pump connected to a moisture-sensing microcontroller. When the soil moisture falls below thirty percent, the circuit automatically engages the pump to irrigate vegetable beds. This innovation will eliminate the exhausting manual hauling of water from distant boreholes and boost crop yields for our school canteen.\n\nHowever, our technical execution requires seasoned guidance. We humbly appeal for your engineering department to provide occasional technical mentorship, particularly regarding charge controller sizing, battery storage safety, and circuit soldering. Furthermore, we would be profoundly grateful if SunPower Ghana could donate two decommissioned or tested surplus eighty-watt photovoltaic panels to power our prototype.\n\nWe would be thrilled to host you on campus during our next school exhibition to demonstrate the working irrigation system.\n\nThank you very much for your leadership and continuous investment in the technological education of Ghanaian youth.\n\nYours sincerely,\nKelvin Amartey`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Formal: Application for Student Environmental Officer
  {
    id: "B8_S4_A_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Formal Letter",
    title: "Application for School Environmental & Sustainability Officer",
    shortSummary: "Apply to the Senior Housemaster to serve as the School Environmental and Sustainability Officer.",
    prompt: "The school administration is appointing junior student officers to pioneer the campus 'Green School and Zero-Waste Initiative.' Write a formal letter of application to your Senior Housemaster, applying for the office of Student Environmental Officer. Highlight your passion for environmental sustainability, evaluate existing waste generation patterns on campus, and outline two innovative projects to establish composting and paper recycling.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Sustainability Policy Advocacy & Quadripartite Close",
    learningCompetency: "B8.4.2.1.2: Compose formal administrative applications demonstrating ecological stewardship, waste management policies, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and class designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Green Pioneers Secretariat,", "St. Peter's Basic School,", "P.O. Box 78,", "Kumasi,", "Ashanti Region.", "18th November, 2026."],
        allowedDatingFormats: ["18th November, 2026", "18 November 2026"],
        prohibitedDatingFormats: ["18/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Senior Housemaster,",
        officeOrSchoolPlaceholder: "St. Peter's Basic School,",
        postalBoxPlaceholder: "P.O. Box 78,",
        townRegionPlaceholder: "Kumasi, Ashanti Region.",
        formatContaminationPenaltyWarning: "CRITICAL: Inside address is mandatory."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Sir,",
        permissibleSalutations: ["Dear Sir,"],
        bannedSalutations: ["Dear Mr. Senior Housemaster,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "APPLICATION FOR THE OFFICE OF STUDENT ENVIRONMENTAL OFFICER",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of Student Environmental Officer.", transitionHints: ["I write to formally submit my candidature for the office of...", "In response to the administration's announcement regarding the Green School Initiative..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your dedication to environmental conservation, botanical knowledge, and personal leadership.", transitionHints: ["Throughout my junior secondary schooling, I have actively championed environmental protection...", "As head of our school tree-planting project, I supervised the planting of fifty shade saplings..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Analyze campus waste patterns (organic food scraps, single-use plastic) and propose composting and recycling schemes.", transitionHints: ["Currently, the school dining hall generates dozens of kilograms of organic food waste daily...", "To establish a zero-waste campus, I propose establishing an aerobic composting pit and..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge diligent service and express readiness to be vetted by the selection committee.", transitionHints: ["I pledge to execute the duties of this office with unwavering dedication, discipline, and integrity...", "Thank you very much for considering my application..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Student, Basic 8B",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application position stated clearly (2 marks)", "Environmental dedication and project experience shown (4 marks)", "Two actionable waste reduction and composting projects proposed (4 marks)"],
      ["Environmental Officer post clear", "Ecological passion shown", "Composting and recycling detailed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive environmental vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: `Green Pioneers Secretariat,\nSt. Peter's Basic School,\nP.O. Box 78,\nKumasi,\nAshanti Region.\n18th November, 2026.\n\nThe Senior Housemaster,\nSt. Peter's Basic School,\nP.O. Box 78,\nKumasi, Ashanti Region.\n\nDear Sir,\n\nAPPLICATION FOR THE OFFICE OF STUDENT ENVIRONMENTAL OFFICER\n\nI write to formally submit my application for the appointment of Student Environmental Officer for the 2026/2027 academic session, pursuant to the announcement on the Green School and Zero-Waste Initiative.\n\nI possess a deep commitment to environmental sustainability, climate advocacy, and campus beautification. Throughout my studies in Basic 7 and Basic 8, I have consistently demonstrated leadership in environmental sanitation. During the recent National Arbor Day celebration, I coordinated our club's tree-planting campaign, successfully planting forty royal palm and mahogany saplings across our school perimeter to combat soil erosion.\n\nIf appointed to this office, I intend to implement two practical ecological initiatives to transform our waste management architecture. First, I will establish an aerobic composting project behind the school orchard. By collecting organic kitchen peels, leftover dining hall food scraps, and dry leaves, we can produce rich organic compost to fertilize our agricultural science demonstration farm, saving the school money on synthetic fertilizers. Second, I will launch a segregated waste initiative with designated bins for clean waste paper and plastic bottles, partnering with certified recycling depots in Kumasi to generate funding for student welfare projects.\n\nI pledge to discharge my responsibilities with diligence, fairness, and unwavering allegiance to school environmental bylaws.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nDaniel Osei-Owusu\nStudent, Basic 8B`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Civic Petition: Dangerous Quarry Blasting Shaking School Classrooms
  {
    id: "B8_S4_A_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Civic Petition",
    title: "Petition on Unregulated Commercial Stone Quarrying",
    shortSummary: "Petition the Municipal Chief Executive over commercial dynamite blasting fracturing school walls.",
    prompt: "A commercial granite quarry operating barely four hundred meters from your school uses heavy dynamite blasting during instructional school hours, triggering seismic tremors that have cracked classroom walls and sent flying rock debris across the sports field. As the General Secretary of the Joint Student and Parent Civic Action Council, write a formal petition to your Municipal Chief Executive (MCE), presenting structural and safety evidence and demanding the immediate enforcement of statutory buffer zones and blasting curfews.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Safety Petition Architecture, Forensic Structural Analysis & Statutory Prayer",
    learningCompetency: "B8.4.2.1.2: Compose forensic civic petitions to municipal authorities documenting public safety violations, structural damage, and regulatory enforcement prayers.",
    hint: "Address to 'The Municipal Chief Executive,'. State the quarry disaster factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Civic Action Council Secretariat,", "Kasoa Community Basic School,", "P.O. Box 55,", "Kasoa,", "Central Region.", "22nd November, 2026."],
        allowedDatingFormats: ["22nd November, 2026", "22 November 2026"],
        prohibitedDatingFormats: ["22/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Municipal Chief Executive,",
        officeOrSchoolPlaceholder: "Awutu Senya East Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box 10,",
        townRegionPlaceholder: "Kasoa, Central Region.",
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
        modelCaption: "PETITION TO HALT RECKLESS QUARRY BLASTING NEAR KASOA COMMUNITY BASIC SCHOOL",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your council's joint standing and declare the commercial quarry grievance clearly.", transitionHints: ["We, the executive committee of the Joint Student and Parent Civic Action Council, respectfully petition...", "I write on behalf of over eight hundred pupils, teachers, and concerned parents to draw your urgent attention to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the empirical evidence of structural wall fractures, airborne rock fragments, and pupil trauma.", transitionHints: ["Over the past two months, heavy industrial dynamite blasting conducted during instructional hours has...", "Seismic shockwaves have cracked the load-bearing pillars of our JHS block, while flying rock debris..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (immediate suspension of blasting, enforcement of buffer zones, structural engineering audit).", transitionHints: ["We therefore humbly pray that your honorable administration take decisive regulatory action...", "First, we demand the immediate issuance of an emergency stop-work order halting all blasting operations..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent administrative action to prevent a catastrophic structural collapse.", transitionHints: ["The physical safety of our pupils and teachers cannot be compromised for commercial profits...", "Thank you very much for your leadership and anticipated prompt intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "General Secretary, Joint Civic Action Council",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Joint council representation established (2 marks)", "Forensic structural wall fractures and safety threats documented (4 marks)", "Clear three-point regulatory enforcement prayer presented (4 marks)"],
      ["Council authority established", "Wall cracks and flying debris detailed", "Stop-work order and buffer zone requested"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive structural and legal vocabulary (3 marks)"],
      ["Civic advocacy language", "Logical problem-evidence-prayer flow", "Precise structural and geological terminology"]
    ),
    modelAnswer: `Civic Action Council Secretariat,\nKasoa Community Basic School,\nP.O. Box 55,\nKasoa,\nCentral Region.\n22nd November, 2026.\n\nThe Municipal Chief Executive,\nAwutu Senya East Municipal Assembly,\nP.O. Box 10,\nKasoa, Central Region.\n\nDear Sir,\n\nPETITION TO HALT RECKLESS QUARRY BLASTING NEAR KASOA COMMUNITY BASIC SCHOOL\n\nI write on behalf of the executive committee of the Joint Student and Parent Civic Action Council and the entire academic community of Kasoa Community Basic School to respectfully submit this urgent petition concerning the grave perils posed by commercial dynamite blasting adjacent to our campus.\n\nFor the past two months, a commercial granite quarry company operating barely four hundred meters from our school perimeter has been conducting heavy subsurface dynamite detonations during morning school hours. The violent seismic shockwaves have caused visible structural fissures across the load-bearing concrete pillars of our two-storey classroom block. Last Wednesday, during a mid-morning lesson, an unannounced blast shattered three glass windows and hurled jagged rock fragments onto our school sports pavilion, narrowly missing pupils during physical education class. The pervasive noise and ground vibrations induce panic, traumatizing young learners and disrupting teaching.\n\nTo avert a fatal structural collapse and safeguard innocent human lives, we humbly pray that your honorable administration enforce three immediate statutory interventions. First, we appeal for the immediate issuance of an executive stop-work order suspending all dynamite blasting within our educational zone. Second, we demand the strict enforcement of the mandatory Minerals Commission five-hundred-meter safety buffer zone. Finally, we urge the municipal works department to conduct an urgent geotechnical structural integrity audit of our classroom blocks at the quarry company's expense.\n\nOur children deserve to learn in safety, free from the terror of falling rocks and collapsing walls.\n\nThank you for your dedicated leadership and anticipated decisive intervention.\n\nYours faithfully,\n[Signature]\nClement Boakye\nGeneral Secretary, Joint Civic Action Council`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Formal Letter to Editor: Combating Teenage Truancy and Digital Gaming Addiction
  {
    id: "B8_S4_A_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "advanced",
    category: "Formal Letter",
    title: "Combating Commercial Sports Betting & Truancy",
    shortSummary: "Write to the Editor of a national newspaper on youth sports betting addiction and unregulated gambling centers.",
    prompt: "The proliferation of unregulated sports betting shops and online gambling parlors in urban suburbs is causing an alarming surge in teenage truancy, examination malpractice, and petty theft among basic school pupils. Write a letter to the Editor of a national daily newspaper, analyzing how commercial gambling undermines youth academic discipline, criticizing lax enforcement by gaming regulators, and recommending two statutory interventions to eradicate the menace.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Letter to the Press Architecture, Sociological Commentary & Statutory Valediction",
    learningCompetency: "B8.4.2.1.2: Compose formal letters to national newspaper editors analyzing contemporary social vices, regulatory lapses, and legislative solutions.",
    hint: "Address to 'The Editor, Daily Graphic,'. Include an un-underlined BLOCK CAPITAL heading. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', your signature, full name, and your residential town.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Social Justice Youth Forum,", "P.O. Box 88,", "Bantama-Kumasi,", "Ashanti Region.", "26th November, 2026."],
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
        modelCaption: "CURBING THE CANCER OF UNDERAGE SPORTS BETTING AND TRUANCY",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Request editorial space and state the grave social vice directly.", transitionHints: ["Permit me space in your widely read national newspaper to sound an urgent alarm...", "I write to draw national attention to the destructive scourge of commercial sports betting among..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Analyze how gambling addiction leads to school dropouts, erosion of work ethics, and theft.", transitionHints: ["It is deeply distressing to observe that dozens of junior secondary pupils are abandoning morning classes to...", "The deceptive illusion of effortless wealth has corroded the core values of academic diligence..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Criticize lax regulatory enforcement and propose two statutory remedies (police task forces, heavy fines for operators).", transitionHints: ["Unscrupulous betting proprietors operate with utter impunity, admitting minors in uniform...", "To eradicate this menace, the Gaming Commission of Ghana must collaborate with municipal assemblies to..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Summarize the urgency of safeguarding the moral and academic future of Ghana's youth.", transitionHints: ["Our children are our nation's most precious human resource...", "I hope this appeal mobilizes civic leaders, parents, and law enforcement agencies to take uncompromising action..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Bantama-Kumasi",
        coOccurrenceConstraint: "Letters to the editor terminate with 'Yours faithfully,', signature, full name, and town/region."
      }
    },
    rubric: createWAECRubric(
      ["Editorial space requested and issue announced clearly (2 marks)", "Sociological analysis of gambling addiction and school fallout (4 marks)", "Two actionable statutory regulatory policies proposed (4 marks)"],
      ["Editorial space requested", "Betting impact on schooling explained", "Regulatory fines and enforcement suggested"],
      ["Two addresses correctly positioned (1 mark)", "Salutation 'Dear Sir,' (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Sign-off with signature, name, and town (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Sign-off includes town"],
      ["Formal, articulate civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive sociological vocabulary (3 marks)"],
      ["Elevated civic vocabulary", "Effective paragraph links", "Varied sentence patterns"]
    ),
    modelAnswer: `Social Justice Youth Forum,\nP.O. Box 88,\nBantama-Kumasi,\nAshanti Region.\n26th November, 2026.\n\nThe Editor,\nDaily Graphic,\nP.O. Box 742,\nAccra.\n\nDear Sir,\n\nCURBING THE CANCER OF UNDERAGE SPORTS BETTING AND TRUANCY\n\nPermit me a space in your widely read national daily newspaper to sound an urgent alarm regarding the alarming proliferation of commercial sports betting and digital gambling parlors in our urban communities.\n\nIt is deeply troubling that during official school hours, dozens of junior high school pupils abandon classroom instruction to congregate inside unventilated betting shops. Enticed by the false promise of instant wealth, children barely fourteen years old squander their lunch allowances and examination fees on computerized odds. This destructive addiction has fueled an unprecedented surge in truancy, sharp drops in academic performance, and petty theft within households and classrooms. Promising young minds that should be mastering mathematics, literature, and science are instead being ensnared by the psychological grip of gambling dependency.\n\nThis social crisis is perpetuated by reckless betting shop proprietors who blatantly violate the Gaming Act by admitting pupils in school uniform without verifying their age. To halt this growing cancer, I propose two urgent statutory interventions. First, the Gaming Commission of Ghana, in collaboration with the police service, must conduct aggressive, unannounced inspections across all suburbs, revoking the operating licenses of any gambling operator caught admitting minors. Second, municipal assemblies must pass strict zoning bylaws that prohibit betting centers from operating within a five-hundred-meter radius of any basic or secondary school.\n\nOur children are the bedrock of our nation's developmental aspirations. We must act decisively to protect their moral and intellectual future before an entire generation is lost to gambling addiction.\n\nYours faithfully,\n[Signature]\nPrince Boamah\nBantama-Kumasi`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B8AdvancedClean() {
  const db = await getFirestoreDb();
  console.log("Building clean 60-item Strand 4 B8 Advanced Practice Lab...");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective, Shuffled Options)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory, Flippable Prompts)");

  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // 1. Build Section A (Questions 1 to 50: Objective Multiple-Choice with Shuffled Options)
  rawObjective50Data.forEach((item, index) => {
    const qNum = index + 1;
    const shuffledOptions = shuffleArray(item.options);

    all60Items.push({
      id: `B8_S4_A_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B8",
      difficulty: "advanced",
      category: "Epistolary Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n"${item.passage}"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: shuffledOptions,
      correctAnswer: item.answer, // Matches exact string value regardless of randomized position
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B8.4.2.1: Demonstrate advanced mastery of epistolary formatting, address architecture, dating laws, salutation/close pairings, and caption rules."
    });
  });

  // 2. Build Section B (Questions 51 to 60: Theory Structured Essays)
  theory10Prompts.forEach((task) => {
    all60Items.push(task);
  });

  const docIds = ['writing_letter_formats', 'writing_composition_letters_petitions'];
  const parentCollections = ['topical', 'topics', 'topical_units'];

  const labPayload = {
    level: "B8",
    difficulty: "advanced",
    title: "Basic 8 Advanced Writing Lab: 50 Objective Drills + 10 Theory Writing Tasks",
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
      subStrand: "Sub-Strand 2: Text Types and Purposes (Letter Writing & Petitions)",
      evaluationEngine: "Gemini 2.5 Flash WAEC 4-Tier Evaluator (30 Marks)",
      canonicalTopicPath: "global_curriculum/jhs/subjects/english/topical/writing_letter_formats",
      updatedAt: new Date().toISOString()
    }
  };

  for (const docId of docIds) {
    // 3. Write directly to Firestore Practice Lab Document
    const targetDoc = db.doc(
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B8_advanced`
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
          b8: {
            practicePool: {
              hard: all60Items.map(item => ({
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

  console.log(`\n✅ SUCCESS: Deployed exactly ${all60Items.length} items to practice labs & pools!`);
}

deployStrand4B8AdvancedClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B8 Advanced Clean 60 Lab:", err);
    process.exit(1);
  });

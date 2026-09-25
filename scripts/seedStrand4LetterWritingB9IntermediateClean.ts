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
  level: "B9";
  difficulty: "intermediate";
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
  level: "B9";
  difficulty: "intermediate";
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
// Basic 9 Intermediate Focus:
// Advanced Layout Purity, Forensic Deixis, Correlative Concord, Mandative
// Subjunctives in Petitions, Co-occurrence Constraints & Press Conventions
// =========================================================================
const rawObjective50Data = [
  {
    passage: "A Basic 9 candidate drafting an application for secondary school admission writes the inside address: 'The Headmaster, Prempeh College, P.O. Box 192, Kumasi.'.",
    question: "Under standard closed punctuation rules, which punctuation mark must end each line preceding the final destination line?",
    options: ["A comma", "A semicolon", "A colon", "No punctuation mark"],
    answer: "A comma",
    hint: "Every intermediate line in closed punctuation ends with a comma.",
    solution: "Under closed punctuation conventions, intermediate lines of an address block end with a comma, while the terminal geographic entity ends with a full stop.",
    target: "Address Architecture: Closed Punctuation Syntax"
  },
  {
    passage: "In a formal petition to the Regional Minister, a student writes: 'We aren't going to sit down while our health center remains without power.'",
    question: "What specific stylistic and grammatical defect occurs in this statement?",
    options: [
      "Use of the informal contracted auxiliary 'aren't' and colloquial phrasing in a formal administrative petition",
      "Using the active voice instead of passive voice",
      "Beginning the sentence with the pronoun 'We'",
      "Failure to include an official date in the body"
    ],
    answer: "Use of the informal contracted auxiliary 'aren't' and colloquial phrasing in a formal administrative petition",
    hint: "Contracted auxiliaries are strictly prohibited in formal correspondence.",
    solution: "Formal institutional letters prohibit contracted forms. 'Aren't' and colloquial idioms compromise institutional dignity and are penalized under Expression.",
    target: "Formal Register: Contraction Prohibition"
  },
  {
    passage: "A candidate applies the modern open punctuation convention for the sender's address block.",
    question: "Which of the following date presentations satisfies pure open punctuation with absolute accuracy?",
    options: ["28 October 2026", "28th October, 2026.", "28th October 2026", "October 28th, 2026."],
    answer: "28 October 2026",
    hint: "Pure open punctuation omits commas, terminal periods, and ordinal suffixes.",
    solution: "Pure open punctuation uses cardinal figures without ordinal suffixes ('th'), commas, or terminal periods: '28 October 2026'.",
    target: "Address Architecture: Pure Open Punctuation Dating"
  },
  {
    passage: "A petition is addressed to: 'The Paramount Chief, Asante Traditional Council, Manhyia Palace, Kumasi.'.",
    question: "Which formal salutation strictly aligns with Ghanaian administrative and traditional protocol?",
    options: ["Otumfuo, / His Royal Majesty, / Dear Sir,", "Dear Chief Osei,", "Hello Nana Chief,", "Dear Mr. Paramount Chief,"],
    answer: "Otumfuo, / His Royal Majesty, / Dear Sir,",
    hint: "Traditional rulers require traditional honorifics or formal administrative greetings.",
    solution: "Official correspondence to traditional rulers uses recognized honorifics such as 'Otumfuo,', 'His Royal Majesty,', or the formal administrative 'Dear Sir,'.",
    target: "Epistolary Salutations: Traditional Authorities"
  },
  {
    passage: "A candidate writes the caption for an administrative petition as: <u>PETITION CONCERNING ILLEGAL SAND WINNING ALONG THE COASTLINE</u>.",
    question: "Under WAEC Chief Examiner guidelines, why is this formatting penalized?",
    options: [
      "Underlining a heading written in full block capital letters is a mechanical layout error",
      "The heading should have been italicized",
      "Petitions must never have a subject heading",
      "The heading must be written in red ink"
    ],
    answer: "Underlining a heading written in full block capital letters is a mechanical layout error",
    hint: "Headings in all-caps must never be underlined.",
    solution: "Under WAEC marking rubrics, full capital block headings must not be underlined. Underlining is reserved exclusively for Title Case headings.",
    target: "Caption Orthography: Underlining Rules"
  },
  {
    passage: "A student writes to the Senior Housemaster and signs off: 'Yours sincerely, \\n [Signature] \\n Kwame Mensah \\n Senior Prefect'.",
    question: "Under what specific condition is 'Yours sincerely,' acceptable in this formal context?",
    options: [
      "Only when the Housemaster was addressed by surname in the salutation (e.g., 'Dear Mr. Mensah,')",
      "Whenever the student holds a senior prefectorial rank",
      "Only when the letter discusses boarding house matters",
      "Whenever two addresses are present on the sheet"
    ],
    answer: "Only when the Housemaster was addressed by surname in the salutation (e.g., 'Dear Mr. Mensah,')",
    hint: "'Yours sincerely,' requires a personal name in the salutation.",
    solution: "The co-occurrence constraint mandates that 'Yours sincerely,' is used only when the salutation addresses the recipient by surname ('Dear Mr. Mensah,'). An impersonal salutation ('Dear Sir,') strictly commands 'Yours faithfully,'.",
    target: "Co-Occurrence Constraint: Named vs. Unnamed Salutations"
  },
  {
    passage: "A pupil writes an informal letter to his elder sister seeking advice on secondary school selection.",
    question: "Which sign-off strictly conforms to the mononymic rule in informal correspondence?",
    options: ["Your loving brother, \\n Kwadwo", "Yours faithfully, \\n Kwadwo Mensah", "I remain, your obedient brother, \\n K. Mensah", "Yours sincerely, \\n Master Kwadwo Mensah"],
    answer: "Your loving brother, \\n Kwadwo",
    hint: "Informal letters to family require first name only.",
    solution: "Informal family letters require an affectionate subscription and strictly the writer's first name ('Kwadwo') without surnames or signatures.",
    target: "Informal Sign-off: Mononymic Protocol"
  },
  {
    passage: "In a published letter to the Editor of a national daily, the contributor signs off as: 'Yours faithfully, \\n [Signature] \\n Ama Boateng \\n Kumasi'.",
    question: "Why is the city name 'Kumasi' appended on the fourth line instead of an institutional post?",
    options: [
      "Because public correspondence to the press requires the contributor's residential locality rather than an institutional post",
      "Because the writer forgot to state her school name",
      "Because the newspaper editor resides in Kumasi",
      "Because letters to the editor prohibit official signatures"
    ],
    answer: "Because public correspondence to the press requires the contributor's residential locality rather than an institutional post",
    hint: "Letters to the press identify contributors by their town or city.",
    solution: "In public letters to the editor, private citizens provide their geographic residential town (e.g., 'Kumasi') to establish locality for public record.",
    target: "Letters to the Editor: Geographic Attribution"
  },
  {
    passage: "Which of the following sentences exhibits the most sophisticated formal administrative vocabulary?",
    question: "Select the sentence demonstrating formal administrative elevation:",
    options: [
      "I write to respectfully draw your attention to the deteriorating state of the municipal road network.",
      "I am writing this letter to tell you that our road is very dirty and broken.",
      "Please look into our road because it smells bad and vehicles are falling into ditches.",
      "Our road is in a total mess and you have to send workers to fix it quickly."
    ],
    answer: "I write to respectfully draw your attention to the deteriorating state of the municipal road network.",
    hint: "Formal writing uses elevated vocabulary like 'respectfully draw your attention' and 'deteriorating'.",
    solution: "'I write to respectfully draw your attention to the deteriorating state...' demonstrates the elevated, dignified register expected in formal administrative correspondence.",
    target: "Formal Administrative Lexis"
  },
  {
    passage: "A student formats an address block using the traditional slanted (indented) layout.",
    question: "How must each subsequent line in a slanted address block be arranged?",
    options: [
      "Each succeeding line should begin slightly to the right of the line above it",
      "All lines must be flush along the left vertical margin",
      "Lines must alternate between the left and right sides of the page",
      "Every line must be centered horizontally"
    ],
    answer: "Each succeeding line should begin slightly to the right of the line above it",
    hint: "Slanted formatting indents each progressive line.",
    solution: "In traditional slanted address formatting, each subsequent line steps progressively to the right of the preceding line.",
    target: "Address Styling: Slanted Formatting Mechanics"
  },
  {
    passage: "A candidate writes: 'Neither the headmaster nor the subject tutors was satisfied with the mock results.'",
    question: "Under the Principle of Proximity Concord, how must this sentence be corrected?",
    options: [
      "Neither the headmaster nor the subject tutors were satisfied with the mock results.",
      "Neither the headmaster nor the subject tutors are satisfied with the mock results.",
      "Neither the headmaster nor the subject tutors has been satisfied with the mock results.",
      "Neither the headmaster or the subject tutors was satisfied with the mock results."
    ],
    answer: "Neither the headmaster nor the subject tutors were satisfied with the mock results.",
    hint: "With 'neither... nor', the verb agrees with the nearest subject ('tutors').",
    solution: "The Principle of Proximity Concord dictates that with correlative coordinators ('neither... nor'), the verb agrees with the nearest subject nominal ('tutors' -> 'were').",
    target: "Syntactic Concord: Correlative Proximity"
  },
  {
    passage: "A student writes a heading in Title Case: <u>An appeal for the construction of a pedestrian overpass.</u>",
    question: "What two errors are present in this heading?",
    options: [
      "The noun 'appeal' is uncapitalized and the heading ends with an illegal full stop",
      "The heading should have been in quotation marks and written in pencil",
      "The preposition 'for' should be capitalized and the underline omitted",
      "The article 'An' should be lowercase"
    ],
    answer: "The noun 'appeal' is uncapitalized and the heading ends with an illegal full stop",
    hint: "Major nouns in Title Case must be capitalized, and headings never take periods.",
    solution: "In Title Case, major lexical words ('Appeal') must be capitalized, and headings must never terminate with a full stop.",
    target: "Caption Mechanics: Title Case Rules"
  },
  {
    passage: "Which of the following represents an ungrammatical resumptive pronoun error in a relative clause?",
    question: "Identify the flawed sentence:",
    options: [
      "The computer laboratory which the municipal assembly renovated it has developed a leak.",
      "The computer laboratory which the municipal assembly renovated has developed a leak.",
      "The computer laboratory that the municipal assembly renovated has developed a leak.",
      "The computer laboratory renovated by the municipal assembly has developed a leak."
    ],
    answer: "The computer laboratory which the municipal assembly renovated it has developed a leak.",
    hint: "Do not repeat the object pronoun ('it') when a relative pronoun already replaces it.",
    solution: "In relative clauses, the relative pronoun ('which') replaces the object. Retaining 'it' ('renovated it') creates an ungrammatical resumptive pronoun error.",
    target: "Syntax Mechanics: Resumptive Pronoun Prohibition"
  },
  {
    passage: "A letter to a minister includes the sentence: 'It is vital that the regional coordinator visits the damaged school facility.'",
    question: "Under the rules of the mandative subjunctive, how must 'visits' be corrected?",
    options: ["visit", "visits", "visited", "is visiting"],
    answer: "visit",
    hint: "Mandative subjunctive clauses take the uninflected base verb without '-s'.",
    solution: "Formulaic adjectives of necessity ('It is vital that...') trigger the mandative subjunctive, requiring the uninflected base verb ('visit'), suppressing third-person '-s'.",
    target: "Advanced Syntax: Mandative Subjunctive"
  },
  {
    passage: "A candidate writes the sender's address in blocked format on the top right, but begins the inside address directly beneath it on the right.",
    question: "Where should the inside address be located?",
    options: [
      "On the left-hand margin, below the level of the date line",
      "In the center of the page below the heading",
      "At the bottom of the page beneath the signature",
      "On the top right margin above the sender's address"
    ],
    answer: "On the left-hand margin, below the level of the date line",
    hint: "The recipient's inside address belongs on the left margin.",
    solution: "In two-address formal layouts, the recipient's inside address is placed on the left-hand margin, starting below the sender's date line.",
    target: "Formal Architecture: Inside Address Alignment"
  },
  {
    passage: "A pupil writing an informal letter includes the phrase: 'I would be grateful if you could grant me an interview at your earliest convenience.'",
    question: "What is wrong with this expression in an informal letter to a friend?",
    options: [
      "It represents an overly formal, bureaucratic register unsuitable for friendly peer correspondence",
      "It contains grammatical errors",
      "It is too short",
      "It uses subjunctive mood incorrectly"
    ],
    answer: "It represents an overly formal, bureaucratic register unsuitable for friendly peer correspondence",
    hint: "Formal business clichés sound unnatural in letters to friends.",
    solution: "Using formal recruitment clichés in an informal letter creates severe register dissonance. Friendly correspondence requires warm, natural language.",
    target: "Epistolary Register Alignment"
  },
  {
    passage: "Which of the following subscriptions is punctuated with absolute accuracy according to standard British/WAEC conventions?",
    question: "Select the correctly punctuated subscription:",
    options: ["Yours faithfully,", "Yours Faithfully,", "Your's faithfully,", "Yours faithfully."],
    answer: "Yours faithfully,",
    hint: "Only the first word is capitalized, and it must end with a comma.",
    solution: "'Yours faithfully,' correctly capitalizes only the opening word, avoids ungrammatical apostrophes, and terminates with a comma.",
    target: "Subscription Mechanics: Casing and Punctuation"
  },
  {
    passage: "A student writes: 'The Form Master as well as the candidates are attending the briefing.'",
    question: "Under standard concord rules governing parenthetical quasi-coordinators, how should the verb be corrected?",
    options: ["is attending", "are attending", "were attending", "have attended"],
    answer: "is attending",
    hint: "'As well as' does not pluralize the singular subject 'Form Master'.",
    solution: "Quasi-coordinators ('as well as') introduce parenthetical adjuncts. The singular head noun 'Form Master' controls concord, requiring the singular verb 'is attending'.",
    target: "Syntactic Concord: Intervening Parentheticals"
  },
  {
    passage: "In a civic petition to a Municipal Chief Executive, which of the following represents the most effective opening for the prayer section?",
    question: "Select the most appropriate formal prayer formula:",
    options: [
      "We therefore humbly pray that your honorable office intervene by dispatching engineers to reconstruct the drainage culvert.",
      "You must immediately fix our culvert because we pay our taxes.",
      "We want you to send workers right now to solve the problem.",
      "Can your assembly try and help us with the culvert before next month?"
    ],
    answer: "We therefore humbly pray that your honorable office intervene by dispatching engineers to reconstruct the drainage culvert.",
    hint: "Formal petitions use respectful, precise prayer language.",
    solution: "'We therefore humbly pray that your honorable office intervene...' embodies the standard forensic and respectful tone expected in administrative petitions.",
    target: "Civic Petitions: The Formal Prayer Formula"
  },
  {
    passage: "What is the primary stylistic hazard of using clichés like 'At the end of the day' or 'A drop in the ocean' in a formal administrative petition?",
    question: "Why should these idioms be avoided in formal writing?",
    options: [
      "They are trite, informal colloquialisms that undermine institutional seriousness and degrade the Expression score",
      "They are too difficult for examiners to understand",
      "They increase the word count unnecessarily",
      "They violate British spelling rules"
    ],
    answer: "They are trite, informal colloquialisms that undermine institutional seriousness and degrade the Expression score",
    hint: "Clichés and idioms belong to colloquial conversation, not formal correspondence.",
    solution: "Colloquial idioms and clichés are considered trite and informal. Formal letters require precise, literal, and dignified phrasing.",
    target: "Expression: Idiomatic Cliché Penalties"
  },
  {
    passage: "A candidate writes the date as: 'Friday, the 28th of October, 2026.'.",
    question: "How is this date evaluated in standard epistolary marking?",
    options: [
      "It is unnecessarily wordy and archaic; '28th October, 2026.' is the preferred concise standard",
      "It is the only acceptable format in formal letters",
      "It is an immediate failure in layout",
      "It is penalized under Content"
    ],
    answer: "It is unnecessarily wordy and archaic; '28th October, 2026.' is the preferred concise standard",
    hint: "Modern epistolary dating avoids unnecessary words like 'the' and 'of'.",
    solution: "While grammatically intelligible, including 'Friday, the... of...' is archaic and unnecessarily wordy. Standard practice favors '28th October, 2026.'.",
    target: "Dating Conventions: Conciseness"
  },
  {
    passage: "Which of the following is considered an acceptable mononymic sign-off for an informal letter?",
    question: "Select the proper informal name format:",
    options: ["Emmanuel", "Emmanuel Mensah", "Master Emmanuel Mensah", "E. Mensah (Student)"],
    answer: "Emmanuel",
    hint: "Mononymic means using only the first name.",
    solution: "The mononymic sign-off rule requires the writer's first name only ('Emmanuel') in informal correspondence.",
    target: "Informal Sign-off: Mononymic Standards"
  },
  {
    passage: "A formal letter addressed to an administrative officer begins with: 'Dear Madam,'.",
    question: "Which of the following subscriptions represents a fatal layout error?",
    options: ["Yours sincerely,", "Yours faithfully,", "Respectfully yours,", "Yours truly,"],
    answer: "Yours sincerely,",
    hint: "'Dear Madam,' must never be paired with 'Yours sincerely,'.",
    solution: "Pairing 'Dear Madam,' with 'Yours sincerely,' is a major co-occurrence violation in British and WAEC epistolary frameworks, penalized under Organization.",
    target: "Co-Occurrence Constraint: Unnamed Salutations"
  },
  {
    passage: "A candidate writes a formal complaint letter and uses the sentence: 'The municipal engineers didn't inspect the bridge and they won't escape blame.'",
    question: "How should this sentence be revised for formal administrative compliance?",
    options: [
      "The municipal engineers failed to inspect the bridge structure and cannot evade administrative responsibility.",
      "The municipal engineers didn't inspect the bridge and must be punished.",
      "The engineers have done poor work and won't get paid.",
      "The engineers did bad work and can't go free."
    ],
    answer: "The municipal engineers failed to inspect the bridge structure and cannot evade administrative responsibility.",
    hint: "Replace contractions and colloquialisms with objective administrative vocabulary.",
    solution: "The revised version eliminates contractions ('didn't', 'won't') and colloquial phrasing ('escape blame'), replacing them with objective, elevated vocabulary.",
    target: "Formal Lexical Elevation"
  },
  {
    passage: "In an administrative petition to a Municipal Chief Executive, where should the petition's subject heading be placed?",
    question: "Select the correct vertical location:",
    options: [
      "Immediately below the salutation ('Dear Sir,') and above the opening paragraph",
      "Above the recipient's inside address",
      "At the very bottom of the letter below the signature",
      "Inside the third paragraph"
    ],
    answer: "Immediately below the salutation ('Dear Sir,') and above the opening paragraph",
    hint: "The caption sits between the salutation and the first paragraph.",
    solution: "In standard formal letter and petition layout, the caption is positioned between the salutation and the preamble (opening paragraph).",
    target: "Formal Layout: Caption Placement"
  },
  {
    passage: "Which of the following sentences correctly applies Second Conditional irrealis subjunctive in a formal appeal?",
    question: "Identify the grammatically correct hypothetical construction:",
    options: [
      "If the assembly were to release emergency subventions, the school laboratory would be completed before the exams.",
      "If the assembly was to release emergency subventions, the school laboratory will be completed before the exams.",
      "If the assembly will release emergency subventions, the school laboratory would be completed before the exams.",
      "If the assembly would release emergency subventions, the school laboratory had been completed before the exams."
    ],
    answer: "If the assembly were to release emergency subventions, the school laboratory would be completed before the exams.",
    hint: "Second Conditional hypothetical statements require 'were + to-infinitive' and 'would + base verb'.",
    solution: "Formal irrealis hypothetical conditions use the subjunctive 'were to release' in the protasis, paired with 'would be completed' in the apodosis.",
    target: "Advanced Syntax: Second Conditional Subjunctive"
  },
  {
    passage: "A student writing a letter of inquiry to a university scholarship committee ends the body with: 'I look forward to receiving your response.'",
    question: "What prepositional complementation rule applies to the idiom 'look forward to'?",
    options: [
      "It contains a true preposition 'to' and must be followed by a gerund ('receiving') or noun phrase",
      "It must always be followed by a bare infinitive ('receive')",
      "It must be followed by a past participle ('received')",
      "It cannot take an object"
    ],
    answer: "It contains a true preposition 'to' and must be followed by a gerund ('receiving') or noun phrase",
    hint: "In 'look forward to', 'to' is a preposition requiring a gerund.",
    solution: "In 'look forward to', 'to' functions as a preposition rather than an infinitival particle, strictly requiring a gerund complement ('receiving').",
    target: "Grammatical Idioms: True Prepositional To"
  },
  {
    passage: "What is the primary function of an inside address in formal correspondence?",
    question: "State the administrative purpose:",
    options: [
      "To specify the recipient's official title, department, and institutional address for archival and delivery precision",
      "To show off the writer's geographical knowledge",
      "To make the letter look longer to satisfy word count requirements",
      "To provide space for the recipient to write personal notes"
    ],
    answer: "To specify the recipient's official title, department, and institutional address for archival and delivery precision",
    hint: "Inside addresses record the recipient's official details for institutional delivery and filing.",
    solution: "The inside address records the official title, department, and location of the recipient, ensuring precise routing, delivery, and institutional record-keeping.",
    target: "Inside Address Functional Purpose"
  },
  {
    passage: "A candidate writes the subscription: 'Yours Faithfully,'.",
    question: "Why is the capital 'F' marked as an error in WAEC examinations?",
    options: [
      "In standard epistolary mechanics, only the first word of the subscription is capitalized ('Yours faithfully,')",
      "Subscriptions must be written entirely in lowercase",
      "Subscriptions must be written entirely in capital letters",
      "The word 'Faithfully' is an archaic spelling"
    ],
    answer: "In standard epistolary mechanics, only the first word of the subscription is capitalized ('Yours faithfully,')",
    hint: "Only the initial letter of the opening word is capitalized.",
    solution: "Prescriptive epistolary orthography dictates that only the initial letter of the first word takes a capital letter: 'Yours faithfully,'.",
    target: "Subscription Mechanics: Casing Laws"
  },
  {
    passage: "Which of the following opening sentences represents an acceptable informal epistolary hook?",
    question: "Select the most engaging informal opening:",
    options: [
      "You will never guess the incredible news I have about our BECE mock results!",
      "I hereby write to announce the occurrence of a mock examination.",
      "Pursuant to our telephone conversation, I present details of our examination scores.",
      "This correspondence serves to inform you regarding a school test."
    ],
    answer: "You will never guess the incredible news I have about our BECE mock results!",
    hint: "Informal letters open with conversational enthusiasm.",
    solution: "'You will never guess the incredible news...' provides an engaging, conversational hook that establishes natural peer rapport.",
    target: "Informal Openings: Conversational Hooks"
  },
  {
    passage: "A student writes a formal petition to a minister and forgets to sign his handwritten signature above his printed name.",
    question: "Under which WAEC rubric criterion is this missing signature penalized?",
    options: ["Organization (deduction of 1 mark for incomplete formal layout)", "Content", "Expression", "Spelling"],
    answer: "Organization (deduction of 1 mark for incomplete formal layout)",
    hint: "Formal layout features belong to the Organization rubric.",
    solution: "The handwritten signature is a required structural element of the quadripartite sign-off. Its omission is a layout defect penalized under Organization.",
    target: "WAEC Rubrics: Organization Deductions"
  },
  {
    passage: "Which of the following headings demonstrates an error in prepositional capitalization in Title Case?",
    question: "Identify the flawed heading:",
    options: [
      "<u>Petition Concerning The Menace Of Commercial Sand Winning</u>",
      "<u>Petition Concerning the Menace of Commercial Sand Winning</u>",
      "PETITION CONCERNING THE MENACE OF COMMERCIAL SAND WINNING",
      "<u>An Appeal for Clean Potable Water in Schools</u>"
    ],
    answer: "<u>Petition Concerning The Menace Of Commercial Sand Winning</u>",
    hint: "Short prepositions like 'of' and articles like 'the' should be lowercase in Title Case.",
    solution: "In Title Case, short prepositions ('of') and definite articles ('the') must remain lowercase unless they occur as the first word of the heading.",
    target: "Title Case Mechanics: Preposition Rules"
  },
  {
    passage: "In a formal letter, why is it ungrammatical to write: 'If I would have completed the syllabus earlier, I would have passed the trial test'?",
    question: "What grammatical rule is violated in the if-clause?",
    options: [
      "Modal auxiliaries like 'would have' are prohibited in the protasis (if-clause) of a Third Conditional",
      "The past participle 'completed' is regular",
      "The sentence uses passive voice incorrectly",
      "The sentence lacks an object"
    ],
    answer: "Modal auxiliaries like 'would have' are prohibited in the protasis (if-clause) of a Third Conditional",
    hint: "Never use 'would have' inside the conditional if-clause.",
    solution: "Under Third Conditional syntax, the protasis requires the Past Perfect ('Had I completed' or 'If I had completed'). Inserting 'would have' into the if-clause is a grammatical error.",
    target: "Advanced Syntax: Third Conditional Protasis Law"
  },
  {
    passage: "A student writes an informal letter and uses the abbreviation 'U' instead of 'you'.",
    question: "How is this penalized under the WAEC marking scheme?",
    options: [
      "As a mechanical accuracy spelling/orthography penalty of 1/2 mark per occurrence",
      "It is accepted as modern shorthand",
      "It is rewarded for speed",
      "It is ignored in informal letters"
    ],
    answer: "As a mechanical accuracy spelling/orthography penalty of 1/2 mark per occurrence",
    hint: "Text shorthand is penalized as an orthographic error.",
    solution: "Using single-letter text abbreviations ('U', 'R', 'Pls') violates standard English orthography and attracts deductions under Mechanical Accuracy.",
    target: "Orthographic Penalties: Text Shorthand"
  },
  {
    passage: "Which of the following phrases is most suitable for expressing respectful urgency in a formal petition?",
    question: "Select the most effective formal phrase:",
    options: [
      "In view of these escalating hazards, we appeal for your urgent administrative intervention.",
      "You have to hurry up and solve this problem right now.",
      "We want this fixed today because tomorrow might be too late.",
      "Hurry and come to our aid before things get completely out of hand."
    ],
    answer: "In view of these escalating hazards, we appeal for your urgent administrative intervention.",
    hint: "Combine respectful deference with precise, formal urgency.",
    solution: "'In view of these escalating hazards, we appeal for your urgent administrative intervention' conveys compelling urgency while preserving formal dignity.",
    target: "Formal Expression: Persuasive Urgency"
  },
  {
    passage: "A candidate writes the sender's address in pure block style with open punctuation, but places a comma after the date.",
    question: "What is the mechanical flaw?",
    options: [
      "Inconsistency: open punctuation requires zero punctuation at the end of the date line",
      "The date should have been written in Roman numerals",
      "The date should have been on the left margin",
      "The year should be preceded by a semicolon"
    ],
    answer: "Inconsistency: open punctuation requires zero punctuation at the end of the date line",
    hint: "Open punctuation omits end-of-line marks, including after the date.",
    solution: "In pure open punctuation, all end-of-line punctuation marks are eliminated. Adding a comma after the date introduces an inconsistency penalized under Mechanical Accuracy.",
    target: "Punctuation Consistency: Open Style"
  },
  {
    passage: "Which of the following salutations is appropriate for a formal letter to an unknown female director?",
    question: "Select the correct formal salutation:",
    options: ["Dear Madam,", "Dear Lady,", "Dear Mrs. Director,", "Dear Female Director,"],
    answer: "Dear Madam,",
    hint: "The formal counterpart to 'Dear Sir,' is 'Dear Madam,'.",
    solution: "When addressing an unknown female official in a formal letter, standard administrative protocol requires 'Dear Madam,'.",
    target: "Formal Salutations: Female Addressees"
  },
  {
    passage: "In an administrative letter of apology to a school headmaster, what should the final sentence convey?",
    question: "Select the most appropriate closing sentiment:",
    options: [
      "A reaffirmation of commitment to school discipline and polite gratitude for the headmaster's understanding",
      "A demand that the headmaster forgive the mistake immediately",
      "A threat to report the matter to the education directorate",
      "An enquiry about the headmaster's family health"
    ],
    answer: "A reaffirmation of commitment to school discipline and polite gratitude for the headmaster's understanding",
    hint: "Apologies conclude with a commitment to reform and gratitude.",
    solution: "A formal letter of apology concludes constructively by pledging adherence to institutional discipline and expressing gratitude for administrative consideration.",
    target: "Formal Valedictions: Apology Closures"
  },
  {
    passage: "A student writes: 'The regional director demanded that the contractor completes the work by Friday.'",
    question: "Under mandative subjunctive rules, what should 'completes' be?",
    options: ["complete", "completes", "completed", "is completing"],
    answer: "complete",
    hint: "The verb following 'demanded that' must be in the bare base form.",
    solution: "The suasive verb 'demanded that' triggers the mandative subjunctive, requiring the uninflected base verb 'complete' without the third-person '-s'.",
    target: "Advanced Syntax: Mandative Subjunctive"
  },
  {
    passage: "What is the primary difference between a semi-formal letter and a formal administrative letter?",
    question: "Differentiate the two genres:",
    options: [
      "Semi-formal letters address known adult acquaintances by surname ('Dear Mr. Mensah,') and use 'Yours sincerely,', whereas formal letters address official posts ('Dear Sir,') and use 'Yours faithfully,'",
      "Semi-formal letters have no addresses, while formal letters have three addresses",
      "Semi-formal letters allow street slang, while formal letters do not",
      "Semi-formal letters are only written to friends, while formal letters are written to parents"
    ],
    answer: "Semi-formal letters address known adult acquaintances by surname ('Dear Mr. Mensah,') and use 'Yours sincerely,', whereas formal letters address official posts ('Dear Sir,') and use 'Yours faithfully,'",
    hint: "Semi-formal letters balance respect with familiarity, using surnames and 'Yours sincerely,'.",
    solution: "Semi-formal letters address familiar adults by surname with 'Yours sincerely,', whereas formal letters address institutional offices with 'Dear Sir,' and 'Yours faithfully,'.",
    target: "Epistolary Taxonomies: Semi-Formal vs. Formal"
  },
  {
    passage: "A candidate writes the inside address as: 'The Municipal Chief Executive, P.O. Box 24, Sunyani.'.",
    question: "What vital institutional line is missing between the title and the postal box?",
    options: ["The name of the institution/assembly (e.g., 'Sunyani Municipal Assembly,')", "The name of the official's spouse", "The official's home address", "The date of establishment of the assembly"],
    answer: "The name of the institution/assembly (e.g., 'Sunyani Municipal Assembly,')",
    hint: "A complete inside address requires the official title, institution, box, and town.",
    solution: "A complete formal inside address includes: (1) Official title, (2) Organization/assembly name, (3) Postal box, (4) Town/region.",
    target: "Inside Address Completeness"
  },
  {
    passage: "Which of the following demonstrates an error in the use of personal pronouns in formal petition drafting?",
    question: "Identify the flawed sentence:",
    options: [
      "Between you and I, the assembly has neglected our educational infrastructure.",
      "Between you and me, the assembly has neglected our educational infrastructure.",
      "The assembly has neglected our educational infrastructure completely.",
      "We believe that the assembly has neglected our educational infrastructure."
    ],
    answer: "Between you and I, the assembly has neglected our educational infrastructure.",
    hint: "Prepositions like 'between' govern objective pronouns ('me', not 'I').",
    solution: "Prepositions govern the objective case. 'Between you and I' is a hypercorrection error; the grammatically mandatory form is 'Between you and me'.",
    target: "Grammatical Case Law: Prepositional Objective Complementation"
  },
  {
    passage: "In an informal letter, why is it unnecessary to write a subject heading (caption)?",
    question: "State the epistolary reason:",
    options: [
      "Because informal letters are personal and conversational, making formal business captions redundant and artificial",
      "Because headings are too difficult to underline",
      "Because informal letters are written in pencil",
      "Because the postal service removes headings"
    ],
    answer: "Because informal letters are personal and conversational, making formal business captions redundant and artificial",
    hint: "Captions belong to formal and functional business correspondence.",
    solution: "Informal letters are personal and conversational. Inserting a business heading creates unnatural rigidity and represents format contamination.",
    target: "Informal Epistolary Purity"
  },
  {
    passage: "A candidate writes: 'Should any candidate require an additional answer booklet, raise your hand quietly.'",
    question: "What syntactic structure is demonstrated in the opening clause?",
    options: [
      "An inverted First Conditional clause where 'Should' replaces 'If'",
      "A past counterfactual Third Conditional",
      "A passive voice declarative sentence",
      "A relative clause modifying the candidate"
    ],
    answer: "An inverted First Conditional clause where 'Should' replaces 'If'",
    hint: "'Should' fronted before the subject forms an inverted First Conditional.",
    solution: "'Should any candidate require...' is an inverted First Conditional expressing a real future possibility, functioning as the formal equivalent of 'If any candidate requires...'.",
    target: "Advanced Syntax: Inverted First Conditional"
  },
  {
    passage: "Which of the following subscriptions contains a capitalization error?",
    question: "Identify the erroneous subscription:",
    options: ["Yours Sincerely,", "Yours sincerely,", "Yours faithfully,", "Your affectionate brother,"],
    answer: "Yours Sincerely,",
    hint: "The second word in a subscription must not be capitalized.",
    solution: "In standard epistolary mechanics, the second word ('sincerely') must begin with a lowercase letter: 'Yours sincerely,'.",
    target: "Subscription Mechanics: Casing Rules"
  },
  {
    passage: "A student writes a formal letter and spells 'accommodation' as 'accomodation'.",
    question: "How is this error penalized under WAEC marking rubrics?",
    options: ["As a spelling error under Mechanical Accuracy (deduction of 1/2 mark)", "Under Expression", "Under Content", "Under Organization"],
    answer: "As a spelling error under Mechanical Accuracy (deduction of 1/2 mark)",
    hint: "Spelling mistakes are penalized under Mechanical Accuracy.",
    solution: "Misspelling 'accommodation' as 'accomodation' is an orthographical error penalized under the Mechanical Accuracy rubric.",
    target: "WAEC Rubrics: Mechanical Accuracy Penalties"
  },
  {
    passage: "In a formal letter of application, what information must the second paragraph primarily convey?",
    question: "Select the primary function:",
    options: [
      "The applicant's relevant academic qualifications, leadership experience, and personal competencies",
      "The applicant's childhood hobbies and favorite sports teams",
      "An enquiry about the employer's salary structure",
      "A complaint about previous employers"
    ],
    answer: "The applicant's relevant academic qualifications, leadership experience, and personal competencies",
    hint: "The second paragraph provides the core evidence justifying the application.",
    solution: "In a letter of application, the second paragraph details the candidate's qualifications, past achievements, and specific skills that justify their appointment.",
    target: "Formal Applications: Qualifications Exposition"
  },
  {
    passage: "Which of the following transitions is best suited for introducing the final summary paragraph in a civic petition?",
    question: "Select the most effective formal concluding linker:",
    options: [
      "In conclusion, we urge your administration to act expeditiously to preserve public safety.",
      "Finally, let me stop writing here because the paper is full.",
      "To wrap up my gist, do something about this problem.",
      "At last, I have reached the end of my petition."
    ],
    answer: "In conclusion, we urge your administration to act expeditiously to preserve public safety.",
    hint: "Use formal, elevated discourse markers to conclude.",
    solution: "'In conclusion, we urge your administration to act expeditiously...' provides a dignified, formal conclusion suitable for civic advocacy.",
    target: "Formal Discourse Markers: Conclusions"
  },
  {
    passage: "A student writes: 'We haven't received no response from the district assembly.'",
    question: "What syntactic error is present in this sentence?",
    options: [
      "A double negative ('haven't' paired with 'no response')",
      "Incorrect subject-verb concord",
      "Faulty passive voice",
      "Resumptive pronoun error"
    ],
    answer: "A double negative ('haven't' paired with 'no response')",
    hint: "Pairing a negative contraction with 'no' creates an ungrammatical double negative.",
    solution: "Combining the negative auxiliary 'haven't' with 'no response' creates an ungrammatical double negative. The correct form is 'We have not received any response'.",
    target: "Syntax Mechanics: Double Negative Prohibition"
  },
  {
    passage: "What is the maximum achievable score for an essay under the BECE / WAEC Paper 2 marking scheme?",
    question: "Select the maximum composite score:",
    options: ["30 marks", "50 marks", "100 marks", "20 marks"],
    answer: "30 marks",
    hint: "The four WAEC dimensions (Content 10, Org 5, Exp 10, MA 5) total 30 marks.",
    solution: "Under WAEC/BECE guidelines, Paper 2 compositions are evaluated out of 30 marks, distributed as Content (10), Organization (5), Expression (10), and Mechanical Accuracy (5).",
    target: "WAEC Assessment Rubric: Total Mark Weighting"
  }
];

// =========================================================================
// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)
// Basic 9 Intermediate Scaffolds & Model Letters (~250 words each)
// Aligned with WAEC / BECE Paper 2 Composition Standards
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Informal: Coping with BECE Preparation & Career Pathways
  {
    id: "B9_S4_I_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Navigating BECE Mock Pressure & School Placement",
    shortSummary: "Write to an older cousin on coping with mock exam anxiety and selecting secondary school programs.",
    prompt: "Following the release of your school's first BECE trial mock results, you scored high grades in Science and Mathematics but experienced severe time pressure in English essay writing. Write a letter to your older cousin who completed secondary school with honors, analyzing your mock performance, explaining your computerized school placement choices, and asking for time management strategies for the upcoming BECE.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Academic Self-Appraisal, Time Management Analysis & Sibling Mentorship",
    learningCompetency: "B9.4.2.1.1: Compose reflective personal letters evaluating examination performance, time management strategies, and secondary school pathways.",
    hint: "Use single address formatting. Express your academic reflections with maturity and conversational warmth. Conclude with an affectionate subscription and your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Christ the King Basic School,", "P.O. Box 40,", "Obuasi,", "Ashanti Region.", "14th October, 2026."],
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
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his university studies and introduce the release of your trial mock results.", transitionHints: ["I hope this letter finds you well in Legon...", "Our school just published the results of our first BECE mock examination..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Analyze your strong performance in STEM subjects versus time management struggles in English Paper 2.", transitionHints: ["I was thrilled to score grade ones in Integrated Science and Mathematics...", "However, I struggled severely with time allocation during English Paper 2, leaving my final paragraph rushed..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain your computerized school selections (Prempeh College, General Science) and ask for his essay pacing techniques.", transitionHints: ["For my first choice, I selected Prempeh College to read General Science...", "How did you plan your forty-five-minute essay composition during your BECE days?"] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your determination to secure single-digit aggregate and ask him to reply soon.", transitionHints: ["Your counsel has always been my compass...", "Please extend my warmest greetings to Uncle Yaw and write back soon..."] }
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
      ["Warm opening and mock examination context established (2 marks)", "Detailed self-appraisal of mock scores and essay pacing dilemma (4 marks)", "Secondary school choices explained and pacing advice requested (4 marks)"],
      ["Cousin acknowledged warmly", "Mock exam scores analyzed honestly", "Essay pacing advice requested"],
      ["Single address format correctly styled (1 mark)", "Familial salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct address layout", "Consistent punctuation", "First name only at closing"],
      ["Warm, mature, and reflective tone (4 marks)", "Permissible contractions used naturally (3 marks)", "Rich academic and analytical vocabulary (3 marks)"],
      ["Reflective sibling rapport", "Clear paragraph transitions", "Vivid narrative lexis"]
    ),
    modelAnswer: `Christ the King Basic School,\nP.O. Box 40,\nObuasi,\nAshanti Region.\n14th October, 2026.\n\nDear Brother Kojo,\n\nI hope this letter finds you in good health and excelling in your engineering coursework at the university. We all miss your lively presence during family dinners! Our school recently published the results of our first district BECE mock examination, and I am writing to seek your seasoned advice on time management.\n\nOverall, the results were very encouraging. I secured grade ones in Integrated Science and Mathematics, scoring ninety-two percent on the practical science paper. However, my performance in English Language revealed a glaring weakness: time allocation during Paper 2 composition. I spent nearly thirty minutes brainstorming and perfecting my introductory paragraphs, leaving barely fifteen minutes to develop the main exposition and conclusion. As a consequence, my final two paragraphs were rushed, and I received a penalized grade three under Organization and Expression.\n\nOur computerized school selection exercise has also begun, and I selected Prempeh College as my first choice to read General Science with Physics, Chemistry, and Elective Mathematics. My ambition remains to qualify as a biomedical engineer, designing affordable diagnostic devices for rural hospitals in Ghana.\n\nSince you scored straight ones in your BECE, how did you structure your forty-five-minute writing window? Did you spend five minutes outlining points before writing, or did you write continuously?\n\nYour mentorship has always guided me, and any essay pacing strategies you share will be immensely valuable.\n\nPlease extend my warmest regards to Uncle Yaw and Auntie Mary. Write back soon!\n\nYour loving cousin,\nKwame`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Informal: The Impact of Renewable Solar Technology in Rural Education
  {
    id: "B9_S4_I_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Renewable Solar Energy Transforming Rural Education",
    shortSummary: "Write to a foreign pen pal describing how a solar electrification project transformed your community school.",
    prompt: "A non-governmental organization recently installed a complete solar photovoltaic mini-grid at your rural basic school, providing reliable power for laboratory microscopes, desktop computers, and evening study prep. Write a letter to your pen pal in Germany, describing the transformation from kerosene lanterns to clean solar power, explaining how this has boosted academic performance, and discussing the role of renewable energy in Africa's development.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Technological Narrative, Energy Transition Advocacy & International Dialogue",
    learningCompetency: "B9.4.2.1.1: Compose descriptive personal letters detailing technological transitions, educational empowerment, and renewable energy sustainability.",
    hint: "Use single address formatting. Contrast past kerosene darkness with clean solar illumination vividly. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Bompata Methodist Basic School,", "P.O. Box 15,", "Bompata-Asante,", "Ashanti Region.", "20th October, 2026."],
        allowedDatingFormats: ["20th October, 2026", "20 October 2026"],
        prohibitedDatingFormats: ["20/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Lukas,",
        permissibleSalutations: ["Dear Lukas,", "My dear friend Lukas,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his school in Berlin and announce the thrilling solar transformation of your school.", transitionHints: ["I hope this letter finds you well in Berlin...", "I am bursting with excitement to share how clean solar technology has revolutionized our school!"] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Contrast past hardships of reading with smoky kerosene lamps against the new solar-powered lighting.", transitionHints: ["Before this intervention, our village was disconnected from the national electrical grid...", "Pupils strained their eyes over toxic kerosene lanterns, inhaling soot that caused respiratory ailments..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain the academic impact (functional ICT lab, evening study prep, powered science microscopes).", transitionHints: ["The installation of the solar mini-grid has transformed our academic outcomes completely...", "Our computer laboratory now powers fifteen desktop monitors, allowing candidates to practice computing practicals..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reflect on renewable solar energy as the key to Africa's green industrial future and invite his thoughts.", transitionHints: ["Harnessing our abundant equatorial sunshine is unlocking the latent genius of rural learners...", "Write back soon and let me know about renewable energy projects in Germany..."] }
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
      ["Warm opening and solar project context established (2 marks)", "Vivid contrast between past kerosene struggles and solar power (4 marks)", "Academic gains and green energy significance analyzed (4 marks)"],
      ["German pen pal acknowledged", "Kerosene vs. solar contrasted vividly", "Educational and green energy benefits explained"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Lively, informative, and natural tone (4 marks)", "Natural conversational flow (3 marks)", "Rich technological and environmental vocabulary (3 marks)"],
      ["Sensory details used effectively", "Smooth transitions", "Apt descriptive vocabulary"]
    ),
    modelAnswer: `Bompata Methodist Basic School,\nP.O. Box 15,\nBompata-Asante,\nAshanti Region.\n20th October, 2026.\n\nDear Lukas,\n\nI hope this letter finds you well and enjoying your autumn term in Berlin. I am writing to share the most transformative news from our village: a solar energy foundation recently installed a complete solar photovoltaic mini-grid at our school, and it has revolutionized our academic lives!\n\nFor decades, our community was disconnected from the national electrical grid. Studying after dusk was an ordeal; we were forced to crowd around smoky kerosene lanterns and flickering wax candles on wooden verandas. The toxic soot blackened our nostrils, irritated our eyes, and triggered frequent coughing bouts. Completing science homework or reading novels after sunset was nearly impossible, placing rural candidates at a severe disadvantage during national examinations.\n\nToday, our campus is bathed in brilliant, clean solar illumination! The installation features rooftop solar arrays, lithium battery storage banks, and high-efficiency LED ceiling lights in every classroom. Our newly electrified computer laboratory now powers fifteen desktop monitors, allowing our Basic 9 cohort to practice word processing, coding algorithms, and spreadsheet calculations for our upcoming BECE computing paper. In addition, our evening study prep now runs peacefully from 6:30 p.m. to 8:30 p.m., supervised by volunteer teachers.\n\nThis project proved to me that Africa does not need to burn fossil fuels to achieve modernization. Our abundant equatorial sunshine holds the key to powering education and driving green industrialization.\n\nDoes your school in Germany generate solar electricity on its rooftop? Write back soon and share your thoughts!\n\nYour sincere friend,\nEmmanuel`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Semi-Formal: Request to Head of Science for Laboratory Practice
  {
    id: "B9_S4_I_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Semi-Formal Letter",
    title: "Laboratory Practice Access for BECE Science Candidates",
    shortSummary: "Write to the Head of Science requesting weekend laboratory access for practical chemistry and physics drills.",
    prompt: "The upcoming BECE Integrated Science paper requires mastery of practical laboratory experimental setups, such as titrations, electrical circuit assembly, and biological slide preparation. Write a semi-formal letter to your Head of Science, Mr. Isaac Mensah, requesting permission for the Basic 9 science cohort to utilize the laboratory on two consecutive Saturdays, detailing the practical experiments to be conducted, and pledging strict adherence to safety protocols.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Academic Request, Experimental Specification & Laboratory Safety Pledge",
    learningCompetency: "B9.4.2.1.2: Compose semi-formal institutional requests to department heads detailing laboratory apparatus, experimental schedules, and safety indemnities.",
    hint: "Salute with 'Dear Mr. Mensah,'. Provide an underlined Title Case caption. Detail specific apparatus and experiments. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Science Candidates' Secretariat,", "Achimota Basic School,", "P.O. Box AH 11,", "Achimota-Accra.", "25th October, 2026."],
        allowedDatingFormats: ["25th October, 2026", "25 October 2026"],
        prohibitedDatingFormats: ["25/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Mensah,",
        permissibleSalutations: ["Dear Mr. Mensah,", "Dear Head of Science,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for Weekend Science Laboratory Access for BECE Candidates",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Respectfully state the purpose of the letter and announce the BECE cohort's practical revision plan.", transitionHints: ["I write on behalf of the registered Basic 9 science candidates to respectfully request...", "Ahead of the upcoming Basic Education Certificate Examination in Integrated Science..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Detail the specific practical experiments to be reviewed (chemical indicators, electrical circuits, plant cell microscopy).", transitionHints: ["Our revision focus encompasses three critical practical components...", "Specifically, candidates need hands-on practice in assembling series-parallel circuits and calibrating..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State the requested dates (two Saturdays, 9:00 a.m. to 12:30 p.m.) and make an uncompromising laboratory safety pledge.", transitionHints: ["We humbly appeal for laboratory access on Saturday, 7th November, and Saturday, 14th November...", "We solemnly pledge that all candidates will wear protective lab coats, handle glassware with care, and..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Invite him or a lab technician to supervise the sessions and express polite appreciation.", transitionHints: ["We would be immensely honored if you or a designated laboratory technician could supervise...", "Thank you very much for your continuous guidance, patience, and dedication to our success..."] }
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
      ["Laboratory access request and BECE context established (2 marks)", "Specific experimental modules and apparatus outlined (4 marks)", "Dates, times, and laboratory safety pledge guaranteed (4 marks)"],
      ["Purpose clear in opening", "Experiments detailed technically", "Safety rules pledged"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Caption underlined", "Correct subscription", "Full printed name without signature"],
      ["Respectful, dignified semi-formal tone (4 marks)", "No informal contractions (3 marks)", "Precise scientific vocabulary (3 marks)"],
      ["Courteous phrasing throughout", "Zero slang", "Clear sentence structure"]
    ),
    modelAnswer: `Science Candidates' Secretariat,\nAchimota Basic School,\nP.O. Box AH 11,\nAchimota-Accra.\n25th October, 2026.\n\nDear Mr. Mensah,\n\nRequest for Weekend Science Laboratory Access for BECE Candidates\n_______________________________________________________________\n\nI write on behalf of the seventy-five registered Basic 9 science candidates to respectfully request your permission to utilize the school science laboratory for two intensive weekend practical revision sessions ahead of our BECE examinations.\n\nRecent Chief Examiners' reports indicate that candidate performance in Integrated Science Paper 2 is heavily determined by accuracy in practical test setups, graph plotting, and observation analysis. While our weekday classroom periods cover theoretical concepts thoroughly, our cohort requires dedicated hands-on laboratory practice to master three core experimental modules: acid-base titration using phenolphthalein indicators, assembling series and parallel circuits with ammeters, and preparing temporary stained onion epidermal slides under light microscopes.\n\nWe humbly request access to the laboratory on Saturday, 7th November, and Saturday, 14th November, 2026, from 9:00 a.m. to 12:30 p.m. on both days. We solemnly pledge that all candidates will wear protective white laboratory coats and safety goggles, handle sensitive glassware and chemical reagents with the utmost caution, and ensure that all electrical power points are switched off and benches disinfected before vacating the facility.\n\nWe would be immensely honored if you or the resident laboratory technician could supervise our sessions to provide expert feedback on our experimental technique.\n\nThank you very much for your continuous mentorship, patience, and tireless dedication to our academic distinction.\n\nYours sincerely,\nEmmanuel Frimpong`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Formal: Application for Student Academic Prefect
  {
    id: "B9_S4_I_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Application for School Academic & Curriculum Prefect",
    shortSummary: "Apply to the Headmaster for appointment as the School Academic Prefect with an academic reform manifesto.",
    prompt: "Nominations have been opened for senior prefectorial positions. Write a formal letter of application to your Headmaster, applying to serve as the School Academic and Curriculum Prefect. Highlight your consistent academic honors, analyze common study habits and examination pitfalls among candidates, and outline two innovative initiatives to enhance library usage and peer tutoring.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Academic Policy Formulation & Quadripartite Close",
    learningCompetency: "B9.4.2.1.2: Compose formal administrative applications demonstrating academic leadership, study habit reforms, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 9 Academic Secretariat,", "Opoku Ware Basic School,", "P.O. Box 700,", "Kumasi,", "Ashanti Region.", "28th October, 2026."],
        allowedDatingFormats: ["28th October, 2026", "28 October 2026"],
        prohibitedDatingFormats: ["28/10/2026"]
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
        modelCaption: "APPLICATION FOR THE OFFICE OF SCHOOL ACADEMIC PREFECT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of Academic Prefect.", transitionHints: ["I write to formally submit my candidature for the office of...", "Pursuant to the circular declaring nominations open for senior student executive offices..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your academic record, subject honors, and personal intellectual diligence.", transitionHints: ["Throughout my junior secondary schooling, I have maintained an unblemished academic record...", "Having maintained the top aggregate rank across Basic 7, 8, and 9, I have consistently..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Analyze common study pitfalls and propose two dynamic academic programs (peer tutoring syndicates, library reading challenges).", transitionHints: ["Many candidates struggle with examination anxiety and unstructured study routines...", "If appointed, I intend to establish an afternoon 'Peer Masterclass Clinic' and..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge commitment to institutional excellence and express readiness to appear before the vetting panel.", transitionHints: ["I pledge to execute the duties of this office with humility, fairness, and unwavering loyalty...", "Thank you very much for considering my application..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Applicant, Basic 9A",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application position stated clearly (2 marks)", "Academic pedigree and intellectual credentials demonstrated (4 marks)", "Two actionable peer tutoring and library initiatives proposed (4 marks)"],
      ["Academic Prefect post clear", "Academic pedigree shown", "Two initiatives outlined"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive academic vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: `Basic 9 Academic Secretariat,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi,\nAshanti Region.\n28th October, 2026.\n\nThe Headmaster,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi, Ashanti Region.\n\nDear Sir,\n\nAPPLICATION FOR THE OFFICE OF SCHOOL ACADEMIC PREFECT\n\nI write to formally submit my candidature for the office of School Academic and Curriculum Prefect for the 2026/2027 academic session, pursuant to the official circular declaring nominations open for student governance.\n\nI possess an unwavering dedication to intellectual inquiry, academic excellence, and student mentorship. Throughout my three years at Opoku Ware Basic School, I have maintained an unblemished conduct record and consistently achieved the top academic position in Basic 7, 8, and 9. In our recent trial mock examinations, I secured aggregate six, earning subject honors in Mathematics, Integrated Science, and English Language. My peers regard me as an approachable, patient student leader who regularly organizes informal revision discussions during break times.\n\nIf appointed to this honorable office, I intend to implement two transformative academic policies. First, I will establish a 'Peer Academic Masterclass Syndicate' where high-achieving Basic 9 students volunteer thirty minutes after afternoon classes to tutor junior pupils battling foundational concepts in algebra, grammatical concord, and physics formulas. Second, I will partner with our school librarian to launch a 'BECE Past-Question Challenge' where classes that complete and review ten past WAEC examination series receive a circulating academic trophy during Monday morning assembly.\n\nI pledge to discharge my duties with fairness, diligence, and unwavering loyalty to the administration's quest for academic pre-eminence.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nRichmond Asare\nApplicant, Basic 9A`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Civic Petition: Acute Water Shortage in Basic Schools During Examinations
  {
    id: "B9_S4_I_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Civic Petition",
    title: "Petition on Acute Water Crisis in BECE Examination Centers",
    shortSummary: "Petition the Municipal Chief Executive over broken boreholes and lack of running water in examination centers.",
    prompt: "A prolonged disruption in municipal pipe-borne water supply has left three designated BECE examination centers without running water, forcing candidates to carry buckets of water to school for sanitation and causing widespread dysentery. As the President of the Municipal Candidates' Civic Alliance, write a formal petition to your Municipal Chief Executive (MCE), documenting the health hazards confronting candidates and appealing for the immediate dispatch of water tankers and the drilling of mechanized boreholes.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Sanitation Petition Architecture, Forensic Health Evidence & Administrative Prayer",
    learningCompetency: "B9.4.2.1.2: Compose civic petitions to municipal assemblies detailing public health hazards, academic disruptions, and structured engineering prayers.",
    hint: "Address to 'The Municipal Chief Executive,'. State the water crisis factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Candidates' Civic Alliance,", "P.O. Box 45,", "Tarkwa,", "Western Region.", "2nd November, 2026."],
        allowedDatingFormats: ["2nd November, 2026", "2 November 2026"],
        prohibitedDatingFormats: ["02/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Municipal Chief Executive,",
        officeOrSchoolPlaceholder: "Tarkwa-Nsuaem Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box 1,",
        townRegionPlaceholder: "Tarkwa, Western Region.",
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
        modelCaption: "PETITION CONCERNING THE ACUTE WATER CRISIS IN BECE EXAMINATION CENTERS",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your alliance's mandate and declare the water crisis grievance clearly.", transitionHints: ["We, the executive committee of the Municipal Candidates' Civic Alliance, respectfully petition...", "I write on behalf of over six hundred registered BECE candidates across three centers to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the broken municipal taps, filthy school washrooms, and outbreak of waterborne illnesses among candidates.", transitionHints: ["For the past five weeks, pipe-borne water supply to the examination cluster has been completely cut off...", "Pupils are forced to carry heavy water buckets from polluted streams, and unsanitary washroom conditions have fueled..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (dispatch of daily municipal water tankers, construction of two mechanized boreholes, storage poly-tanks).", transitionHints: ["We therefore humbly pray that your honorable administration take decisive remedial action...", "First, we appeal for the immediate daily dispatch of municipal water tankers to supply clean drinking water..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent intervention to protect candidate health ahead of the national examinations.", transitionHints: ["Our health and examination performance depend upon your prompt intervention...", "Thank you very much for your leadership and anticipated decisive action..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "President, Candidates' Civic Alliance",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Alliance representation established (2 marks)", "Forensic water shortage and disease outbreak evidence documented (4 marks)", "Clear three-point water engineering prayer presented (4 marks)"],
      ["Alliance authority established", "Water shortage detailed clearly", "Tankers and borehole requested"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive public health vocabulary (3 marks)"],
      ["Civic advocacy language", "Logical problem-evidence-prayer flow", "Precise sanitation terminology"]
    ),
    modelAnswer: `Candidates' Civic Alliance,\nP.O. Box 45,\nTarkwa,\nWestern Region.\n2nd November, 2026.\n\nThe Municipal Chief Executive,\nTarkwa-Nsuaem Municipal Assembly,\nP.O. Box 1,\nTarkwa, Western Region.\n\nDear Sir,\n\nPETITION CONCERNING THE ACUTE WATER CRISIS IN BECE EXAMINATION CENTERS\n\nI write on behalf of the executive committee of the Municipal Candidates' Civic Alliance and over six hundred final-year pupils across three designated BECE examination centers to respectfully petition your high office regarding the acute water crisis paralyzing our schools.\n\nFor the past five weeks, pipe-borne water supply to the Tarkwa educational cluster has been completely severed following major pipeline bursts along the main highway. The consequences for candidates preparing for national examinations are catastrophic. Our school washrooms have become unsanitary breeding grounds for flies, creating an intolerable stench that drifts directly into examination halls. Candidates are forced to waste valuable study hours walking two kilometers every morning to fetch untreated water from polluted streams. Several students have already contracted acute amoebic dysentery and typhoid fever, resulting in alarming absenteeism during our ongoing trial mock examinations.\n\nTo avert a full-blown public health epidemic and secure fair examination conditions for all candidates, we humbly pray that your honorable administration execute three critical interventions. First, we appeal for the immediate daily dispatch of municipal water tankers to replenish our school storage tanks throughout the examination period. Second, we request the urgent drilling of two mechanized boreholes with filtration units to provide an independent, sustainable water supply for the schools. Finally, we urge the assembly to provide three ten-thousand-liter poly-tanks to store emergency water reserves.\n\nOur health, dignity, and academic future hang in the balance.\n\nThank you for your dedicated leadership and anticipated swift intervention.\n\nYours faithfully,\n[Signature]\nFrancisca Mensah\nPresident, Candidates' Civic Alliance`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Informal: Account of Inter-Schools Athletics Championship Triumph
  {
    id: "B9_S4_I_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Inter-Schools Athletics Championship Victory",
    shortSummary: "Write to a friend living abroad narrating your school's dramatic victory in the annual sports gala.",
    prompt: "Your school recently emerged as the overall champion in the annual inter-schools athletics competition. Write a letter to your former seatmate who now lives with his family in London, narrating the dramatic highlights of the championship, describing your personal participation, and explaining how the school celebrated the victory.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Narrative Pacing, Vivid Sports Exposition & Conversational Warmth",
    learningCompetency: "B9.4.2.1.1: Compose friendly personal letters incorporating vivid narrative action, suspense, and celebratory tone.",
    hint: "Use single address formatting. Narrate the sports action vividly using sensory adjectives and dramatic verbs. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Christ the King Basic School,", "P.O. Box 33,", "Obuasi,", "Ashanti Region.", "8th November, 2026."],
        allowedDatingFormats: ["8th November, 2026", "8 November 2026"],
        prohibitedDatingFormats: ["08/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Kojo,",
        permissibleSalutations: ["Dear Kojo,", "Dearest Kojo,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire about his life in London and enthusiastically announce the championship victory.", transitionHints: ["I hope you are keeping warm in cold London...", "I have the most exhilarating news to share with you!"] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the tense showdown during the boys' four-by-one-hundred-meter relay race.", transitionHints: ["The most unforgettable highlight of the championship was...", "Going into the final relay race, our school was trailing by..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Describe your personal participation as the third runner and the dramatic finish.", transitionHints: ["When Kwame handed the baton to me on the third bend...", "Our anchor leg sprinter crossed the finish line a fraction of a second ahead..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Describe the joyful celebrations back on campus and invite him to reply.", transitionHints: ["The entire stadium erupted into wild jubilation...", "Write back soon and tell me about school sports in London..."] }
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
      ["Warm opening and championship announcement (2 marks)", "Vivid narrative of relay race and personal role (5 marks)", "Celebration description and friendly conclusion (3 marks)"],
      ["London context referenced warmly", "Relay race described dramatically", "Celebration details included"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at closing"],
      ["Lively, exhilarating narrative tone (4 marks)", "Natural contractions (3 marks)", "Vivid athletic vocabulary (3 marks)"],
      ["Suspenseful narrative pace", "Clear transitions", "Apt descriptive vocabulary"]
    ),
    modelAnswer: `Christ the King Basic School,\nP.O. Box 33,\nObuasi,\nAshanti Region.\n8th November, 2026.\n\nDear Kojo,\n\nI hope you are keeping warm in cold London and settling into your new school. We miss your cheerful presence here in Obuasi! I am writing to share the most exhilarating news with you: our school just emerged as the undisputed overall champions of the Obuasi Municipal Inter-Schools Athletics Competition!\n\nThe entire two-day tournament was intensely competitive, but the climax was the senior boys' four-by-one-hundred-meter relay. Heading into that final event, our school was trailing St. Joseph's by two points. The atmosphere in the Len Clay Stadium was electrifying as thousands of students cheered from the stands.\n\nI was honored to run the third leg of the relay. When Kwame handed the metal baton to me around the final bend, my heart was thumping wildly. I sprinted with every ounce of strength in my legs, overtaking the St. Joseph's runner just before passing the baton to our anchor sprinter, Yaw Mensah. Yaw accelerated like a cheetah and crossed the finish line half a stride ahead, securing the gold medal!\n\nThe entire stadium erupted into deafening cheers! When our headmaster lifted the shimmering championship trophy, the brass band played celebratory victory tunes all the way back to the school compound, where a special dinner of jollof rice and roasted chicken awaited us.\n\nI wish you were here to celebrate with us. Write back soon and tell me how sports competitions work over there in England.\n\nYour sincere friend,\nFelix`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Semi-Formal: Seeking Venue Permission for Inter-School Quiz
  {
    id: "B9_S4_I_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Semi-Formal Letter",
    title: "Community Hall Booking for Science Quiz",
    shortSummary: "Write to a community center administrator requesting the use of the main hall for an inter-schools quiz.",
    prompt: "You are the Coordinator of the Municipal Junior Science Club. Write a semi-formal letter to Mr. Daniel Oduro, the Administrator of the Municipal Community Centre, requesting the use of the main conference hall for your annual inter-schools quiz championship. State the date, hours, and expected attendance, outline required audiovisual support, and guarantee the care and cleanliness of the facility.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Facility Negotiation, Logistical Clarity & Facility Indemnity Guarantee",
    learningCompetency: "B9.4.2.1.2: Compose semi-formal requests to facility administrators detailing event logistics, audiovisual needs, and property care guarantees.",
    hint: "Salute with 'Dear Mr. Oduro,'. Provide an underlined Title Case caption. Detail event times, audience numbers, and property protection guarantees. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Junior Science Club Secretariat,", "St. James Basic School,", "P.O. Box 80,", "Koforidua,", "Eastern Region.", "12th November, 2026."],
        allowedDatingFormats: ["12th November, 2026", "12 November 2026"],
        prohibitedDatingFormats: ["12/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Oduro,",
        permissibleSalutations: ["Dear Mr. Oduro,", "Dear Facility Administrator,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for the Use of the Main Community Conference Hall",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "State your coordinator capacity and declare the venue booking request clearly.", transitionHints: ["I write in my capacity as Coordinator of the Municipal Junior Science Club to respectfully request...", "We wish to seek your kind permission to utilize the main conference hall for..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Specify the exact date, duration, expected schools, and audience capacity.", transitionHints: ["The championship is scheduled for Friday, 27th November, 2026, from 9:00 a.m. to 2:00 p.m....", "We anticipate hosting six accredited junior secondary schools with an estimated audience of..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Detail required facilities (projector, microphones, standby generator) and make a property care pledge.", transitionHints: ["To ensure a smooth academic competition, we humbly request access to...", "Our executive board solemnly guarantees that all hall furniture and electronic equipment will be handled with..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Invite him as a Special Guest of Honor and express gratitude.", transitionHints: ["We would be deeply honored if you could join us as our Special Guest...", "Thank you very much for your continuous encouragement of youth scientific literacy..."] }
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
      ["Club standing and purpose established (2 marks)", "Date, duration, and audience logistics detailed (4 marks)", "Equipment needs and facility indemnity guaranteed (4 marks)"],
      ["Coordinator role clear", "Event times and audience count given", "Property protection pledged"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Title Case underlined", "Correct subscription", "Full printed name"],
      ["Polite, professional semi-formal register (4 marks)", "Zero informal contractions (3 marks)", "Precise organizational vocabulary (3 marks)"],
      ["Courteous administrative tone", "Clear chronological progression", "Precise event terminology"]
    ),
    modelAnswer: `Junior Science Club Secretariat,\nSt. James Basic School,\nP.O. Box 80,\nKoforidua,\nEastern Region.\n12th November, 2026.\n\nDear Mr. Oduro,\n\nRequest for the Use of the Main Community Conference Hall\n________________________________________________________\n\nI write in my capacity as Coordinator of the New Juaben Municipal Junior Science Club to respectfully request permission to utilize the main conference hall of the Municipal Community Centre for our annual inter-schools science and innovation quiz.\n\nThe tournament is scheduled for Friday, 27th November, 2026, commencing at 9:00 a.m. and concluding at 2:00 p.m. The competition will bring together eight junior secondary schools to test competencies in integrated science, robotics, and environmental technology. We expect an audience of approximately two hundred and fifty attendees, comprising student contestants, patron teachers, and district education officials.\n\nTo ensure a professional and seamless contest, we humbly request access to the hall's digital ceiling projector, three cordless stage microphones, and auxiliary generator in the event of municipal power outages. Our executive board solemnly guarantees that all hall facilities, sound consoles, and seating upholstery will be treated with the utmost care. Furthermore, our club protocol team will thoroughly sweep the hall and dispose of all refuse immediately following the closing session.\n\nWe would be immensely honored if you could grace the occasion as our Special Guest of Honor to deliver brief opening remarks.\n\nThank you very much for your continuous encouragement of youth scientific literacy.\n\nYours sincerely,\nKelvin Amartey`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Formal: Application for Student Health Prefect
  {
    id: "B9_S4_I_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Application for School Health & Dispensary Prefect",
    shortSummary: "Apply to the Senior Housemistress to serve as the School Health and Dispensary Prefect.",
    prompt: "Nominations have opened for student leadership positions in your school. Write a formal letter of application to your Senior Housemistress, applying to serve as the School Health and Dispensary Prefect. Highlight your First Aid training, discuss common health challenges among boarding pupils, and propose two practical measures to improve dispensary triage and campus hygiene.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Health Policy Advocacy & Quadripartite Close",
    learningCompetency: "B9.4.2.1.2: Compose formal administrative applications demonstrating medical aptitude, health policy proposals, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Madam,'. Conclude with 'Yours faithfully,', signature, full name, and class designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Health Cadet Desk,", "Yaa Asantewaa Girls' Basic School,", "P.O. Box 450,", "Kumasi,", "Ashanti Region.", "15th November, 2026."],
        allowedDatingFormats: ["15th November, 2026", "15 November 2026"],
        prohibitedDatingFormats: ["15/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Senior Housemistress,",
        officeOrSchoolPlaceholder: "Yaa Asantewaa Girls' Basic School,",
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
        modelCaption: "APPLICATION FOR THE POSITION OF SCHOOL HEALTH PREFECT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of School Health Prefect.", transitionHints: ["I write to formally submit my candidature for the office of...", "In response to the circular inviting applications for student leadership positions..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your Red Cross First Aid certification and volunteer dispensary service.", transitionHints: ["Throughout my junior secondary education, I have demonstrated a strong commitment to healthcare...", "I hold a certified First Aid badge from the Ghana Red Cross Society..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Analyze common ailments (malaria, stomach upsets) and propose two dispensary triage reforms.", transitionHints: ["Currently, the dispensary experiences overcrowding during morning roll-call...", "To streamline medical triage, I propose establishing an emergency triage desk and..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge compassionate, disciplined service and express readiness for vetting.", transitionHints: ["I pledge to discharge my duties with empathy, confidentiality, and unwavering loyalty...", "Thank you very much for considering my application..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Student, Basic 9B",
        coOccurrenceConstraint: "'Dear Madam,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application position stated clearly (2 marks)", "First Aid credentials and healthcare dedication demonstrated (4 marks)", "Two actionable dispensary triage and hygiene reforms proposed (4 marks)"],
      ["Health Prefect post clear", "First Aid qualification shown", "Two health reforms detailed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation 'Dear Madam,' (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive medical vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: `Health Cadet Desk,\nYaa Asantewaa Girls' Basic School,\nP.O. Box 450,\nKumasi,\nAshanti Region.\n15th November, 2026.\n\nThe Senior Housemistress,\nYaa Asantewaa Girls' Basic School,\nP.O. Box 450,\nKumasi, Ashanti Region.\n\nDear Madam,\n\nAPPLICATION FOR THE POSITION OF SCHOOL HEALTH PREFECT\n\nI write to formally submit my candidature for the office of School Health and Dispensary Prefect for the 2026/2027 academic session, pursuant to the announcement on prefectorial appointments.\n\nI possess a lifelong dedication to community healthcare and student welfare. Throughout Basic 7, 8, and 9, I have maintained an unblemished disciplinary record while actively serving as the lead first-aider for our school sports contingent. Last year, I successfully completed the certified Youth First Aid Training Course conducted by the Ghana Red Cross Society, acquiring practical skills in wound dressing, CPR administration, and vital signs monitoring.\n\nAt present, our school dispensary faces two operational bottlenecks: morning congestion during roll-call and delays in administering basic oral rehydration therapy to boarders suffering from acute dehydration and fever. To resolve these challenges, I intend to implement two practical reforms. First, I will establish a digital morning triage desk where minor cuts and headaches are recorded and treated swiftly, preventing overcrowding in the main examination room. Second, I will launch a weekly 'Clean Water, Healthy Boarders' peer education campaign to ensure dormitory water storage barrels are kept scrubbed and covered.\n\nI pledge to execute my duties with compassion, confidentiality, and firm adherence to institutional regulations.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nSerwaa Akoto\nStudent, Basic 9B`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Civic Petition: Deplorable Healthcare Infrastructure in Rural Clinics
  {
    id: "B9_S4_I_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Civic Petition",
    title: "Petition on Healthcare Infrastructure in Rural Clinic",
    shortSummary: "Petition the District Chief Executive over frequent power blackouts and vaccine spoilage at the local health center.",
    prompt: "The only community health clinic serving your farming district lacks a reliable backup power generator, resulting in spoiled vaccine cold-chains and nurses using phone flashlights to deliver babies during night blackouts. As the Secretary of the Rural Youth Health Alliance, write a formal petition to your District Chief Executive (DCE), documenting the life-threatening conditions and appealing for the urgent installation of a solar power inverter and an automated backup generator.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Healthcare Petition Architecture, Clinical Evidence & Statutory Prayer",
    learningCompetency: "B9.4.2.1.2: Compose civic petitions to local assemblies detailing clinical infrastructure crises, vaccine cold-chain failures, and concrete engineering prayers.",
    hint: "Address to 'The District Chief Executive,'. State the healthcare emergency factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Rural Youth Health Alliance,", "P.O. Box 24,", "Kuntanase,", "Ashanti Region.", "20th November, 2026."],
        allowedDatingFormats: ["20th November, 2026", "20 November 2026"],
        prohibitedDatingFormats: ["20/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The District Chief Executive,",
        officeOrSchoolPlaceholder: "Bosomtwe District Assembly,",
        postalBoxPlaceholder: "P.O. Box 1,",
        townRegionPlaceholder: "Kuntanase, Ashanti Region.",
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
        modelCaption: "PETITION FOR THE URGENT PROVISION OF BACKUP POWER AT KUNTANASE CLINIC",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your alliance's mandate and declare the healthcare emergency clearly.", transitionHints: ["We, the executive committee of the Rural Youth Health Alliance, respectfully petition...", "I write on behalf of over four thousand residents and healthcare workers to draw your urgent attention to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the frequent blackouts, spoiled childhood vaccines, and emergency night deliveries in darkness.", transitionHints: ["Over the past two months, chronic grid blackouts have crippled the community health center...", "Nurses are forced to deliver babies using mobile phone flashlights, while vaccine refrigerators lose power..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (installation of a solar inverter system and provision of an auxiliary diesel generator).", transitionHints: ["We therefore humbly pray that your honorable administration take immediate remedial action...", "First, we appeal for the urgent procurement and installation of a five-kilowatt solar power system..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent administrative action to safeguard maternal and infant lives.", transitionHints: ["The lives of vulnerable pregnant mothers and newborn infants hang in the balance...", "Thank you very much for your leadership and anticipated decisive intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Secretary, Rural Youth Health Alliance",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Alliance representation established (2 marks)", "Forensic clinical evidence of vaccine loss and blackout deliveries documented (4 marks)", "Clear three-point healthcare power prayer presented (4 marks)"],
      ["Alliance standing established", "Vaccine and maternity risks described clearly", "Solar and generator prayer stated"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive public health vocabulary (3 marks)"],
      ["Civic advocacy language", "Logical problem-evidence-prayer flow", "Precise medical and power engineering terms"]
    ),
    modelAnswer: `Rural Youth Health Alliance,\nP.O. Box 24,\nKuntanase,\nAshanti Region.\n20th November, 2026.\n\nThe District Chief Executive,\nBosomtwe District Assembly,\nP.O. Box 1,\nKuntanase, Ashanti Region.\n\nDear Sir,\n\nPETITION FOR THE URGENT PROVISION OF BACKUP POWER AT KUNTANASE CLINIC\n\nI write on behalf of the executive committee of the Rural Youth Health Alliance and over four thousand residents across the Kuntanase health catchment area to respectfully petition your high office regarding the life-threatening power crisis at our community health center.\n\nFor the past three months, frequent unannounced municipal power outages have crippled vital clinical services at the facility. Because the clinic lacks an automated auxiliary generator, maternity ward staff are routinely forced to perform emergency night deliveries and stitch lacerations using flickering mobile phone flashlights. Most alarming is the total breakdown of the cold-chain storage system; on two separate occasions last month, hundreds of doses of essential childhood polio, measles, and tetanus vaccines spoiled due to prolonged refrigeration loss, depriving newborn infants of immunization.\n\nTo avert preventable maternal deaths and secure childhood immunization, we humbly pray that your honorable administration execute three critical interventions. First, we appeal for the immediate installation of a five-kilowatt solar-powered battery inverter system dedicated solely to powering the vaccine refrigerators and delivery room lighting. Second, we request the allocation of a heavy-duty standby diesel generator to support laboratory microscopes and sterilizing autoclaves. Finally, we urge the assembly to supply rechargeable medical headlamps for clinical midwives.\n\nThe survival of our mothers and infants cannot wait.\n\nThank you for your leadership and anticipated swift intervention.\n\nYours faithfully,\n[Signature]\nSamuel Osei-Mensah\nSecretary, Rural Youth Health Alliance`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Formal Letter to Editor: Combating Teenage Truancy and Digital Gaming Addiction
  {
    id: "B9_S4_I_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Combating Illegal Mining & River Contamination",
    shortSummary: "Write to the Editor of a national newspaper on artisanal gold mining destroying municipal water supplies.",
    prompt: "Unregulated illegal artisanal gold mining along major river basins is poisoning public water sources with toxic chemicals and driving up municipal water treatment costs. Write a letter to the Editor of a national daily newspaper, expressing profound concern over the contamination of drinking water, analyzing the economic costs on utility tariffs, and proposing two strict regulatory policies to protect river ecosystems.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Letter to the Press Architecture, Environmental Socio-Economic Commentary & Statutory Valediction",
    learningCompetency: "B9.4.2.1.2: Compose formal letters to national newspaper editors analyzing ecological crises, economic impacts, and statutory regulatory interventions.",
    hint: "Address to 'The Editor, Daily Graphic,'. Include an un-underlined BLOCK CAPITAL heading. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', your signature, full name, and your residential town.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Environmental Youth Desk,", "P.O. Box 72,", "Dunkwa-on-Offin,", "Central Region.", "24th November, 2026."],
        allowedDatingFormats: ["24th November, 2026", "24 November 2026"],
        prohibitedDatingFormats: ["24/11/2026"]
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
        modelCaption: "CURBING THE MENACE OF ILLEGAL MINING ON MUNICIPAL WATER BODIES",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Request editorial space and state the ecological water crisis directly.", transitionHints: ["Permit me space in your widely read national daily newspaper to voice...", "I write to draw national attention to the catastrophic contamination of our river basins by..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Analyze how alluvial gold dredging destroys water turbidity and spikes water production costs.", transitionHints: ["It is distressing to observe that major rivers like the Offin, Pra, and Birim have turned into...", "The Ghana Water Company is spending astronomical sums on chemical coagulants to treat muddy water..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Propose two regulatory policies (permanent river buffer protection zones, drone surveillance patrols).", transitionHints: ["To eradicate this existential threat, the government must adopt two decisive interventions...", "First, Parliament must enact statutory legislation declaring a hundred-meter exclusion buffer along all rivers..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Emphasize national responsibility and urge collective defense of natural resources.", transitionHints: ["Water is the essence of human survival; allowing our water bodies to die is national suicide...", "I hope this appeal mobilizes citizens and traditional leaders to take uncompromising action..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Dunkwa-on-Offin",
        coOccurrenceConstraint: "Letters to the editor terminate with 'Yours faithfully,', signature, full name, and town/region."
      }
    },
    rubric: createWAECRubric(
      ["Editorial space requested and issue announced clearly (2 marks)", "Detailed analysis of water contamination and economic utility impacts (4 marks)", "Two actionable statutory regulatory policies proposed (4 marks)"],
      ["Editorial space requested", "River pollution and treatment costs explained", "Buffer zones and drone patrols suggested"],
      ["Two addresses correctly positioned (1 mark)", "Salutation 'Dear Sir,' (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Sign-off with signature, name, and town (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Sign-off includes town"],
      ["Formal, articulate civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental vocabulary (3 marks)"],
      ["Elevated civic vocabulary", "Effective paragraph links", "Varied sentence patterns"]
    ),
    modelAnswer: `Environmental Youth Desk,\nP.O. Box 72,\nDunkwa-on-Offin,\nCentral Region.\n24th November, 2026.\n\nThe Editor,\nDaily Graphic,\nP.O. Box 742,\nAccra.\n\nDear Sir,\n\nCURBING THE MENACE OF ILLEGAL MINING ON MUNICIPAL WATER BODIES\n\nPermit me space in your widely read national daily newspaper to sound an urgent alarm regarding the catastrophic devastation of our municipal water bodies caused by unregulated artisanal gold mining, popularly known as 'galamsey.'\n\nIt is deeply distressing that vital freshwater lifelines like the Offin, Pra, and Ankobra rivers have been transformed into thick, yellowish-brown mud slimes contaminated with lethal traces of mercury and cyanide. This reckless destruction has paralyzed municipal water treatment plants across several regions. The Ghana Water Company Limited recently revealed that it now expends more than triple its budget on chemical coagulants and aluminum sulfate simply to make raw river water potable, costs that are inevitably passed on to struggling consumers through higher utility tariffs. In several rural districts, taps have run completely dry for months.\n\nTo reverse this existential ecological catastrophe, I propose two urgent statutory interventions. First, the Ministry of Lands and Natural Resources, in coordination with the Environmental Protection Agency, must establish a permanent hundred-meter demilitarized green buffer zone along all riverbanks where all mineral prospecting is permanently prohibited. Second, the government should deploy round-the-clock thermal drone surveillance squads to detect and dismantle hidden hydraulic excavator platforms operating deep within forested river valleys.\n\nWater is life. If we poison our rivers for short-term mineral gains, we are condemning future generations to disease and thirst.\n\nYours faithfully,\n[Signature]\nPrince Boamah\nDunkwa-on-Offin`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B9IntermediateClean() {
  const db = await getFirestoreDb();
  console.log("Building clean 60-item Strand 4 B9 Intermediate Practice Lab...");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective, Shuffled Options)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory, Flippable Prompts)");

  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // 1. Build Section A (Questions 1 to 50: Objective Multiple-Choice with Shuffled Options)
  rawObjective50Data.slice(0, 50).forEach((item, index) => {
    const qNum = index + 1;
    const shuffledOptions = shuffleArray(item.options);

    all60Items.push({
      id: `B9_S4_I_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B9",
      difficulty: "intermediate",
      category: "Epistolary Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n\"${item.passage}\"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: shuffledOptions,
      correctAnswer: item.answer, // Matches exact string value regardless of randomized position
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B9.4.2.1: Demonstrate intermediate mastery of epistolary formatting, address architecture, dating laws, salutation/close pairings, and caption rules."
    });
  });

  // 2. Build Section B (Questions 51 to 60: Theory Structured Essays)
  theory10Prompts.forEach((task) => {
    all60Items.push(task);
  });

  const docIds = ['writing_letter_formats', 'writing_composition_letters_petitions'];
  const parentCollections = ['topical', 'topics', 'topical_units'];

  const labPayload = {
    level: "B9",
    difficulty: "intermediate",
    title: "Basic 9 Intermediate Writing Lab: 50 Objective Drills + 10 Theory Writing Tasks",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B9_intermediate`
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
          b9: {
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all60Items.length} items to B9 Intermediate Practice Labs!`);
}

deployStrand4B9IntermediateClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B9 Intermediate Clean 60 Lab:", err);
    process.exit(1);
  });

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
  level: "B8";
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
        "Consistent subject-verb concord across complex and compound sentences",
        "Proper sequence of tenses and modal consistency",
        "Absolute absence of contractions and colloquial slang in formal and semi-formal registers"
      ]
    }
  }
});

// =========================================================================
// 50 UNIQUE OBJECTIVE EPISTOLARY DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const rawObjective50Data = [
  {
    "passage": "A student writes a formal letter to an administrative director and uses the inside address: 'The Director, Ghana Education Service, P.O. Box M.45, Accra.'.",
    "question": "Under closed punctuation rules, which mark must follow 'The Director' and 'Ghana Education Service'?",
    "options": [
      "A comma",
      "A semicolon",
      "A full stop",
      "No punctuation mark"
    ],
    "answer": "A comma",
    "hint": "In closed punctuation, every line before the final destination line ends with a comma.",
    "solution": "Under closed epistolary punctuation, every intermediate line of an address block terminates with a comma, while the final line terminates with a full stop.",
    "target": "Address Architecture: Closed Punctuation Line Termination"
  },
  {
    "passage": "In a semi-formal letter to a Form Master, a candidate writes: 'I won't be able to come for Saturday remedial classes.'",
    "question": "How should this sentence be revised to maintain an appropriate respectful register?",
    "options": [
      "I will not be able to attend the Saturday remedial classes.",
      "I won't be able to come for Saturday remedial classes.",
      "I can't make it to Saturday classes, sir.",
      "I am not coming to Saturday remedial classes at all."
    ],
    "answer": "I will not be able to attend the Saturday remedial classes.",
    "hint": "Avoid informal contractions like 'won't' and use formal verbs like 'attend'.",
    "solution": "Semi-formal letters to school tutors require an uncontracted, respectful register. 'I will not be able to attend...' replaces the casual contraction and colloquial phrasing.",
    "target": "Semi-Formal Register: Contraction Elimination"
  },
  {
    "passage": "A student writes a formal letter with the salutation 'Dear Sir,' and concludes with 'Yours sincerely,'.",
    "question": "What is the nature of this layout error in WAEC assessment?",
    "options": [
      "A complementary close co-occurrence error penalized under Organization",
      "A minor spelling error under Mechanical Accuracy",
      "A content error that reduces word count",
      "It is an acceptable modern alternative"
    ],
    "answer": "A complementary close co-occurrence error penalized under Organization",
    "hint": "'Dear Sir,' must always pair with 'Yours faithfully,'.",
    "solution": "Pairing 'Dear Sir,' with 'Yours sincerely,' violates the fundamental co-occurrence constraint in formal letter writing and is penalized under Organization.",
    "target": "Co-Occurrence Constraint: Unnamed Salutations"
  },
  {
    "passage": "A candidate writes the caption for an application letter as: <u>APPLICATION FOR THE POST OF LIBRARY PREFECT</u>.",
    "question": "What typographical flaw does this heading display?",
    "options": [
      "A heading written in ALL BLOCK CAPITALS must not be underlined",
      "The heading should have been written in pencil",
      "The heading must be in lowercase only",
      "A formal letter must never have a caption"
    ],
    "answer": "A heading written in ALL BLOCK CAPITALS must not be underlined",
    "hint": "Headings in all-caps must never be underlined.",
    "solution": "Under WAEC marking rubrics, underlining a caption written in ALL BLOCK CAPITALS is a mechanical layout flaw. Underlining belongs exclusively to Title Case headings.",
    "target": "Caption Orthography: Block Capital Underlining Ban"
  },
  {
    "passage": "A Basic 8 candidate writes the date in the address block as: '18/11/2026'.",
    "question": "How is this date evaluated under WAEC composition standards?",
    "options": [
      "It is penalized as an error because numerical slash dates are barred from epistolary compositions",
      "It is accepted as concise standard notation",
      "It is awarded a bonus mark for brevity",
      "It is allowed only in letters to siblings"
    ],
    "answer": "It is penalized as an error because numerical slash dates are barred from epistolary compositions",
    "hint": "Dates in essays must spell out the month in full words.",
    "solution": "Numerical shorthand dates (such as 18/11/2026 or 18-11-2026) are strictly penalized in WAEC compositions. The month must be spelled out in full words.",
    "target": "Epistolary Dating Laws: Slash Date Prohibition"
  },
  {
    "passage": "A student writes a formal letter to his Headteacher and ends with: 'Yours faithfully, \\n [Signature] \\n Kofi Mensah'.",
    "question": "What vital formal element is missing on the fourth line beneath the printed name?",
    "options": [
      "The student's official designation or class (e.g., 'Student, Basic 8B')",
      "The student's residential house number",
      "The student's date of birth",
      "The signature of the student's parent"
    ],
    "answer": "The student's official designation or class (e.g., 'Student, Basic 8B')",
    "hint": "The fourth line of a formal quadripartite sign-off specifies the writer's capacity.",
    "solution": "The formal quadripartite sign-off consists of: (1) Subscription, (2) Signature, (3) Printed Full Name, and (4) Official Designation or Class (e.g., 'Class Prefect, Basic 8' or 'Student, Basic 8B').",
    "target": "The Quadripartite Sign-off Framework: Designation Line"
  },
  {
    "passage": "A student writes a semi-formal letter to her sports patron, Dr. (Mrs.) Joyce Addo.",
    "question": "Which salutation is the most appropriate?",
    "options": [
      "Dear Dr. (Mrs.) Addo,",
      "Dear Joyce,",
      "Dear Sir Addo,",
      "Hello Dr. Addo,"
    ],
    "answer": "Dear Dr. (Mrs.) Addo,",
    "hint": "Semi-formal greetings use 'Dear' followed by the polite professional title and surname.",
    "solution": "Semi-formal greetings to respected adult patrons use 'Dear' combined with their official title and surname: 'Dear Dr. (Mrs.) Addo,'.",
    "target": "Semi-Formal Salutations: Professional Honorifics"
  },
  {
    "passage": "A candidate writes the sender's address in pure block style.",
    "question": "How should the date line be positioned relative to the rest of the address block?",
    "options": [
      "Flush against the same left margin of the address block without indentation",
      "Indented five spaces to the right",
      "Centered beneath the address block",
      "Placed on the opposite margin"
    ],
    "answer": "Flush against the same left margin of the address block without indentation",
    "hint": "In blocked style, every line starts flush against the same margin.",
    "solution": "In pure block formatting, all lines\u2014including the date line\u2014must align flush against the left margin of the address block without progressive indentation.",
    "target": "Address Styling: Block Alignment"
  },
  {
    "passage": "Which of the following dates exemplifies accurate closed punctuation?",
    "question": "Select the correctly punctuated closed date:",
    "options": [
      "18th November, 2026.",
      "18 November 2026",
      "18th November 2026,",
      "November 18 2026."
    ],
    "answer": "18th November, 2026.",
    "hint": "Closed style has an ordinal suffix, a comma after the month, and a period at the end.",
    "solution": "In closed punctuation, the date takes an ordinal indicator ('th'), a comma following the month, and a terminal period: '18th November, 2026.'.",
    "target": "Dating Orthography: Closed Style"
  },
  {
    "passage": "A student writes an informal letter to her cousin and signs off with: 'Your loving cousin, \\n Akua Boateng'.",
    "question": "What is the structural defect in this sign-off?",
    "options": [
      "Including the surname 'Boateng' in an informal letter",
      "Using 'Your loving cousin'",
      "Failing to affix an official signature",
      "Writing in title case"
    ],
    "answer": "Including the surname 'Boateng' in an informal letter",
    "hint": "Informal letters require first name only.",
    "solution": "Informal letters to family relatives require a mononymic sign-off (first name only). Appending a surname introduces artificial social distance.",
    "target": "Informal Sign-off: Mononymic Protocol"
  },
  {
    "passage": "In the subscription 'Yours sincerely,', what is the capitalization rule for the second word?",
    "question": "Select the correct orthographic rule:",
    "options": [
      "The second word must begin with a lowercase letter ('sincerely')",
      "The second word must begin with a capital letter ('Sincerely')",
      "Both words must be in all capital letters",
      "Neither word is capitalized"
    ],
    "answer": "The second word must begin with a lowercase letter ('sincerely')",
    "hint": "Only the very first word in an epistolary subscription begins with a capital letter.",
    "solution": "Prescriptive epistolary mechanics require that only the initial letter of the first word takes a capital letter: 'Yours sincerely,'.",
    "target": "Subscription Mechanics: Lowercase Second Element"
  },
  {
    "passage": "A candidate writes a Title Case heading: <u>An Appeal For Laboratory Equipment</u>.",
    "question": "What minor word capitalization defect is present in this heading?",
    "options": [
      "The preposition 'For' should be written in lowercase ('for')",
      "The noun 'Appeal' should be in lowercase",
      "The noun 'Equipment' should be in lowercase",
      "The article 'An' should be in lowercase"
    ],
    "answer": "The preposition 'For' should be written in lowercase ('for')",
    "hint": "Short prepositions remain lowercase in Title Case.",
    "solution": "In Title Case, grammatical function words such as short prepositions ('for', 'in', 'at') and coordinating conjunctions must remain in lowercase.",
    "target": "Title Case Mechanics: Preposition Casing"
  },
  {
    "passage": "A student writes: 'The Senior Housemaster together with the dormitory prefects have arrived.'",
    "question": "Why is the plural verb 'have arrived' grammatically incorrect?",
    "options": [
      "Because 'together with the dormitory prefects' is a parenthetical quasi-coordinator that does not alter the singular head noun 'Senior Housemaster'",
      "Because 'prefects' is plural",
      "Because 'arrived' is an intransitive verb",
      "Because 'dormitory' is singular"
    ],
    "answer": "Because 'together with the dormitory prefects' is a parenthetical quasi-coordinator that does not alter the singular head noun 'Senior Housemaster'",
    "hint": "Phrases introduced by 'together with' do not compound the grammatical subject.",
    "solution": "Quasi-coordinators ('together with', 'as well as') introduce parenthetical adjuncts. Concord is strictly governed by the singular subject 'Senior Housemaster', requiring 'has arrived'.",
    "target": "Concord Mechanics: Parenthetical Quasi-Coordinators"
  },
  {
    "passage": "A formal letter addressed to a newspaper editor has the inside address: 'The Editor, Ghanaian Times, P.O. Box 2638, Accra.'.",
    "question": "What is the standard salutation for this letter?",
    "options": [
      "Dear Sir, / Sir,",
      "Dear Editor Mensah,",
      "Hello Ghanaian Times,",
      "Dear Mr. Editor,"
    ],
    "answer": "Dear Sir, / Sir,",
    "hint": "Letters to the press use 'Dear Sir,' or 'Sir,'.",
    "solution": "In letters addressed to the editor of a newspaper, standard journalistic protocol mandates 'Dear Sir,' or simply 'Sir,'.",
    "target": "Letters to the Editor: Salutation Norms"
  },
  {
    "passage": "In a formal quadripartite sign-off, where is the writer's handwritten signature placed?",
    "question": "Select the correct location:",
    "options": [
      "Between the subscription ('Yours faithfully,') and the printed full name",
      "Directly below the official designation on the fifth line",
      "At the top right corner next to the date",
      "Inside the body of the final paragraph"
    ],
    "answer": "Between the subscription ('Yours faithfully,') and the printed full name",
    "hint": "The handwritten signature occupies the second line of the four-tier sign-off.",
    "solution": "The formal quadripartite sign-off places the handwritten signature on the second line, directly between the subscription and the printed full name.",
    "target": "The Quadripartite Sign-off Framework: Signature Placement"
  },
  {
    "passage": "Which of the following subscriptions contains an ungrammatical apostrophe?",
    "question": "Identify the flawed subscription:",
    "options": [
      "Your's faithfully,",
      "Yours faithfully,",
      "Your sincere friend,",
      "Your loving son,"
    ],
    "answer": "Your's faithfully,",
    "hint": "Possessive pronouns never take apostrophes.",
    "solution": "The possessive pronoun 'Yours' does not take an apostrophe. Writing 'Your's' is an error penalized under Mechanical Accuracy.",
    "target": "Subscription Mechanics: Apostrophe Prohibition"
  },
  {
    "passage": "A pupil opens an informal letter to a friend with: 'Dear Sir, I write to inform you that our school will celebrate its speech day.'",
    "question": "What is the major stylistic defect in this opening?",
    "options": [
      "Severe register clash: using the formal salutation 'Dear Sir,' in a friendly personal letter",
      "Using the first-person pronoun 'I'",
      "Failing to write in the past tense",
      "Omitting the recipient's school name"
    ],
    "answer": "Severe register clash: using the formal salutation 'Dear Sir,' in a friendly personal letter",
    "hint": "'Dear Sir,' is strictly formal and inappropriate for friends.",
    "solution": "Using 'Dear Sir,' in a letter to a school peer creates an absurd register clash. Informal letters require familiar salutations such as 'Dear Kwame,'.",
    "target": "Epistolary Register Traps: Salutation Incongruity"
  },
  {
    "passage": "What is the primary function of the opening paragraph in a formal administrative letter?",
    "question": "Select the primary function:",
    "options": [
      "To state the purpose of the letter directly and concisely without personal pleasantries",
      "To enquire about the recipient's family and health",
      "To describe the author's hobbies and background",
      "To apologize for disturbing the recipient's schedule"
    ],
    "answer": "To state the purpose of the letter directly and concisely without personal pleasantries",
    "hint": "Formal letters declare their business immediately in sentence 1.",
    "solution": "A formal administrative opening states the core purpose and context directly in sentence 1, omitting conversational pleasantries.",
    "target": "Formal Preamble: Direct Purpose Declaration"
  },
  {
    "passage": "In an address block using open punctuation, how are line ends punctuated?",
    "question": "Select the open punctuation rule:",
    "options": [
      "No terminal commas or periods are placed at the ends of the address lines",
      "Every line must end with a semicolon",
      "Lines must end with alternating periods and commas",
      "A comma must terminate every single line"
    ],
    "answer": "No terminal commas or periods are placed at the ends of the address lines",
    "hint": "Open punctuation removes end-of-line marks.",
    "solution": "Pure open punctuation omits all terminal commas and full stops from the ends of address lines throughout the block.",
    "target": "Address Architecture: Open Punctuation Standard"
  },
  {
    "passage": "A student writes a letter to his uncle requesting financial support for textbooks.",
    "question": "Under which epistolary category does this letter fall?",
    "options": [
      "Informal letter",
      "Formal administrative petition",
      "Semi-formal query",
      "Commercial contract"
    ],
    "answer": "Informal letter",
    "hint": "Letters to family members are informal.",
    "solution": "Correspondence addressed to family members (aunts, uncles, parents, siblings) is categorized as an informal letter, even when requesting financial assistance.",
    "target": "Epistolary Taxonomy: Familial Correspondence"
  },
  {
    "passage": "Which of the following salutations is strictly prohibited in an informal letter to a school classmate?",
    "question": "Identify the prohibited salutation:",
    "options": [
      "Dear Sir,",
      "Dear Kofi,",
      "Dearest Ama,",
      "Dear Friend,"
    ],
    "answer": "Dear Sir,",
    "hint": "Administrative titles must never be used with peers.",
    "solution": "'Dear Sir,' is an impersonal administrative salutation and cannot be used in friendly personal correspondence.",
    "target": "Salutation Restrictions: Peer Correspondence"
  },
  {
    "passage": "In a formal letter, where must the recipient's inside address begin?",
    "question": "Select the correct location:",
    "options": [
      "On the left-hand margin, starting one or two lines below the level of the sender's date line",
      "At the top right corner above the sender's address",
      "Centered on the sheet directly above the caption",
      "At the bottom of the page below the signature"
    ],
    "answer": "On the left-hand margin, starting one or two lines below the level of the sender's date line",
    "hint": "The inside address belongs on the left margin below the date line.",
    "solution": "In standard two-address formal layouts, the recipient's inside address begins flush on the left margin, one or two lines below the sender's date line.",
    "target": "Formal Architecture: Inside Address Placement"
  },
  {
    "passage": "What is the structural role of the final paragraph in a formal petition?",
    "question": "Identify the concluding function:",
    "options": [
      "To summarize the formal prayer or requested remedial action and express polite anticipation",
      "To introduce brand new grievances not mentioned in the body",
      "To enquire about the recipient's weekend plans",
      "To apologize for writing a lengthy letter"
    ],
    "answer": "To summarize the formal prayer or requested remedial action and express polite anticipation",
    "hint": "Petitions conclude with an explicit appeal for administrative action.",
    "solution": "The final paragraph of a petition articulates the 'prayer'\u2014the specific administrative remedy demanded\u2014and expresses polite expectation of prompt action.",
    "target": "Civic Petitions: The Prayer Clause"
  },
  {
    "passage": "Which of the following subscriptions is suitable for concluding an informal letter to a classmate?",
    "question": "Select the appropriate informal subscription:",
    "options": [
      "Your sincere friend,",
      "Yours faithfully,",
      "I remain, your obedient servant,",
      "Respectfully submitted,"
    ],
    "answer": "Your sincere friend,",
    "hint": "Informal subscriptions express warmth and peer friendship.",
    "solution": "'Your sincere friend,' is an appropriate informal subscription for peer letters. 'Yours faithfully,' belongs strictly to formal discourse.",
    "target": "Informal Subscriptions: Peer Warmth"
  },
  {
    "passage": "A student writes: 'I write to respectfully apply for permission to organize an educational excursion.'",
    "question": "What register is demonstrated in this sentence?",
    "options": [
      "Formal administrative register",
      "Informal conversational slang",
      "Poetic archaic register",
      "Colloquial dialect"
    ],
    "answer": "Formal administrative register",
    "hint": "Uncontracted, polite, and direct phrasing reflects a formal register.",
    "solution": "The sentence is direct, uncontracted, and deferential, representing the standard formal administrative register.",
    "target": "Epistolary Registers: Formal Tone Identification"
  },
  {
    "passage": "Why is it an error to write a caption as: <u>APPLICATION FOR ADMISSION</u>?",
    "question": "Identify the typographical flaw:",
    "options": [
      "Captions written in ALL CAPITAL LETTERS must not be underlined",
      "Captions must always be written in lowercase",
      "Captions must only be placed inside the body paragraphs",
      "Captions must end with an exclamation mark"
    ],
    "answer": "Captions written in ALL CAPITAL LETTERS must not be underlined",
    "hint": "Underlining is reserved for Title Case headings.",
    "solution": "Under WAEC marking guidelines, underlining a caption written in ALL BLOCK CAPITALS is a mechanical defect. Underlining belongs exclusively to Title Case.",
    "target": "Caption Typography: Block Capital Underlining Ban"
  },
  {
    "passage": "Which of the following subscriptions is correctly paired with the salutation 'Dear Mr. Owusu,'?",
    "question": "Select the matching subscription:",
    "options": [
      "Yours sincerely,",
      "Yours faithfully,",
      "Yours affectionately,",
      "Your brother,"
    ],
    "answer": "Yours sincerely,",
    "hint": "Salutations using a personal surname mandate 'Yours sincerely,'.",
    "solution": "When the recipient is saluted by surname ('Dear Mr. Owusu,'), the subscription must be 'Yours sincerely,'.",
    "target": "Co-occurrence Constraint: Named Salutations"
  },
  {
    "passage": "A student writes: 'We ain't got no computers in our school lab.'",
    "question": "How should this sentence be revised for a formal letter to a headmaster?",
    "options": [
      "Our school computer laboratory currently lacks functioning desktop computers.",
      "We don't have no computers in the school lab.",
      "Computers are ain't available in our laboratory.",
      "There is no computers nowhere in our school lab."
    ],
    "answer": "Our school computer laboratory currently lacks functioning desktop computers.",
    "hint": "Use formal, elevated vocabulary without double negatives or slang.",
    "solution": "'Our school computer laboratory currently lacks functioning desktop computers' replaces colloquial double negatives with precise, elevated formal vocabulary.",
    "target": "Formal Lexical Elevation"
  },
  {
    "passage": "Where is the writer's address placed in the traditional slanted (indented) format?",
    "question": "Select the correct position:",
    "options": [
      "At the top right-hand corner of the page",
      "At the bottom left-hand corner",
      "Centered in the middle of the sheet",
      "Below the salutation on the left margin"
    ],
    "answer": "At the top right-hand corner of the page",
    "hint": "The sender's address in traditional epistolary layout is at the top right.",
    "solution": "In traditional epistolary formatting, the sender's address and date are positioned at the top right-hand corner of the sheet.",
    "target": "Address Layout: Slanted Format Placement"
  },
  {
    "passage": "A student ends an informal letter with: 'Your's Ever, Kwabena'.",
    "question": "What two mechanical errors are present in 'Your's Ever'?",
    "options": [
      "An erroneous apostrophe in 'Yours' and incorrect capitalization of 'Ever'",
      "Misspelling of Kwabena and lack of a period",
      "Using capital letters throughout",
      "Omitting a handwritten signature"
    ],
    "answer": "An erroneous apostrophe in 'Yours' and incorrect capitalization of 'Ever'",
    "hint": "Possessive pronouns have no apostrophe, and the second word of a closing is lowercase.",
    "solution": "'Yours' never takes an apostrophe, and the second word of a subscription must begin with a lowercase letter: 'Yours ever,'.",
    "target": "Subscription Mechanics: Apostrophe and Casing Errors"
  },
  {
    "passage": "What is the penalty for omitting the date in an epistolary composition in a WAEC examination?",
    "question": "How is an omitted date evaluated?",
    "options": [
      "A mandatory mark deduction under Organization/Format",
      "Immediate cancellation of the script",
      "A deduction under Content only",
      "No penalty is applied"
    ],
    "answer": "A mandatory mark deduction under Organization/Format",
    "hint": "The date is a required structural feature of the address block.",
    "solution": "In WAEC marking schemes, omitting the date constitutes an incomplete address block, resulting in a mandatory mark deduction under Organization.",
    "target": "Epistolary Scoring Rubrics: Format Deductions"
  },
  {
    "passage": "A formal petition is addressed to: 'The Honourable Minister, Ministry of Roads and Highways, Accra.'.",
    "question": "Which salutation is most appropriate for this state dignitary?",
    "options": [
      "Honourable Sir, / Dear Sir,",
      "Dear Minister Kwame,",
      "Hello Boss,",
      "Dear Uncle Minister,"
    ],
    "answer": "Honourable Sir, / Dear Sir,",
    "hint": "Ministers of state are formally saluted as 'Honourable Sir,' or 'Dear Sir,'.",
    "solution": "In formal correspondence to a government minister, 'Honourable Sir,' or 'Dear Sir,' is the required respectful formal salutation.",
    "target": "Administrative Salutations: Ministers of State"
  },
  {
    "passage": "Which of the following represents the correct format for an inside address in closed punctuation?",
    "question": "Identify the properly punctuated inside address:",
    "options": [
      "The Headteacher,\nPrempeh College Basic School,\nP.O. Box 192,\nKumasi.",
      "The Headteacher\nPrempeh College Basic School\nP.O. Box 192\nKumasi,",
      "To My Headteacher,\nAt Kumasi School.",
      "Headteacher P.O. Box 192 Kumasi."
    ],
    "answer": "The Headteacher,\nPrempeh College Basic School,\nP.O. Box 192,\nKumasi.",
    "hint": "Each line ends with a comma, and the final line ends with a period.",
    "solution": "A standard inside address in closed style lists the official title, institution, postal address, and destination town, punctuated with commas and a terminal period.",
    "target": "Formal Architecture: Inside Address Format"
  },
  {
    "passage": "In an informal letter, which of the following is an acceptable conversational opening?",
    "question": "Select the appropriate conversational opening:",
    "options": [
      "It was delightful to receive your letter last Friday.",
      "With reference to your memo of even date.",
      "I acknowledge receipt of your communication.",
      "Pursuant to our previous official discussion."
    ],
    "answer": "It was delightful to receive your letter last Friday.",
    "hint": "Informal letters open with warm, natural conversational language.",
    "solution": "'It was delightful to receive your letter...' is natural and warm, matching the informal register.",
    "target": "Informal Openings: Conversational Tone"
  },
  {
    "passage": "A student writes a formal letter and spells the subscription as: 'Yours Faithfully,'.",
    "question": "What is the mechanical flaw in this subscription?",
    "options": [
      "The letter 'F' in 'Faithfully' should be in lowercase ('faithfully')",
      "The word 'Yours' should be in lowercase",
      "There should be no comma after the subscription",
      "The subscription should be written in capital letters"
    ],
    "answer": "The letter 'F' in 'Faithfully' should be in lowercase ('faithfully')",
    "hint": "Only the initial letter of the subscription is capitalized.",
    "solution": "In standard epistolary rules, only the first word begins with a capital letter: 'Yours faithfully,'. Capitalizing 'Faithfully' is an error.",
    "target": "Subscription Orthography: Casing Rules"
  },
  {
    "passage": "Which type of correspondence requires a caption (subject heading)?",
    "question": "Identify the letter types that mandate a caption:",
    "options": [
      "Formal letters, administrative petitions, and semi-formal letters",
      "Only informal letters to siblings",
      "Only letters to pen pals",
      "No English letter requires a heading"
    ],
    "answer": "Formal letters, administrative petitions, and semi-formal letters",
    "hint": "Business, administrative, and functional letters state their subject in a heading.",
    "solution": "Formal letters, petitions, and institutional semi-formal letters require a clear caption to announce their administrative purpose.",
    "target": "Epistolary Conventions: Caption Mandate"
  },
  {
    "passage": "A candidate writes the sender's address in full block style and indents the date by five spaces.",
    "question": "What layout error has been committed?",
    "options": [
      "Inconsistent layout: mixing blocked and indented styles",
      "Omitting the date",
      "Using capital letters",
      "Writing on the right margin"
    ],
    "answer": "Inconsistent layout: mixing blocked and indented styles",
    "hint": "In blocked style, every line must align flush against the same margin.",
    "solution": "In pure block formatting, all lines including the date must align flush against the margin. Indenting the date introduces layout inconsistency.",
    "target": "Layout Consistency: Block Formatting Rules"
  },
  {
    "passage": "Which of the following represents an appropriate sign-off for a letter written by a school prefect on behalf of the student body?",
    "question": "Select the complete quadripartite sign-off:",
    "options": [
      "Yours faithfully,\n[Signature]\nFrancis Appiah\nSenior Prefect",
      "Yours sincerely,\nFrancis",
      "Your friend,\nFrancis Appiah (Senior Prefect)",
      "Faithfully yours,\n[Signature]"
    ],
    "answer": "Yours faithfully,\n[Signature]\nFrancis Appiah\nSenior Prefect",
    "hint": "Official student representation requires subscription, signature, printed name, and designation.",
    "solution": "The full formal sign-off includes subscription, signature, printed full name, and official designation across four distinct vertical lines.",
    "target": "The Quadripartite Sign-off Framework: Prefectorial Sign-off"
  },
  {
    "passage": "A student writes to his uncle: 'I am writing this letter to you because I need some money for my exams.'",
    "question": "How can this sentence be made more polite and appropriate for an informal family letter?",
    "options": [
      "I hope this letter finds you well. I write to humbly ask if you could assist me with funds for my upcoming examination registration.",
      "Send me money immediately for my exam fees.",
      "Give me cash right now because exam registration has started.",
      "I demand financial subventions from your office."
    ],
    "answer": "I hope this letter finds you well. I write to humbly ask if you could assist me with funds for my upcoming examination registration.",
    "hint": "Requests to family elders must balance personal warmth with respect.",
    "solution": "Combining an enquiry about health with a polite, respectful request reflects appropriate familial etiquette.",
    "target": "Familial Register: Respectful Requests"
  },
  {
    "passage": "When a formal letter has a caption written in Title Case, what must be done to it?",
    "question": "State the rule for Title Case captions:",
    "options": [
      "It must be underlined across its entire length",
      "It must be placed in quotation marks",
      "It must be written in bold red ink",
      "It must be left completely un-underlined"
    ],
    "answer": "It must be underlined across its entire length",
    "hint": "Title Case headings require an underline.",
    "solution": "In formal British/WAEC orthography, any caption written in Title Case (Initial Capitals) must be neatly underlined.",
    "target": "Caption Typography: Title Case Underlining"
  },
  {
    "passage": "Which of the following salutations is inappropriate for an informal letter to an elder sister?",
    "question": "Select the inappropriate salutation:",
    "options": [
      "Dear Madam,",
      "Dear Sister Akosua,",
      "Dearest Sister,",
      "Dear Akosua,"
    ],
    "answer": "Dear Madam,",
    "hint": "'Dear Madam,' is an impersonal administrative salutation unsuitable for family.",
    "solution": "'Dear Madam,' creates distant administrative formality that is inappropriate in a letter to an elder sister.",
    "target": "Familial Salutations: Inappropriate Formality"
  },
  {
    "passage": "A student writes an informal letter and uses contractions such as 'I'll', 'we've', and 'don't'.",
    "question": "Are these contractions acceptable in this context?",
    "options": [
      "Yes, contractions are fully acceptable in informal personal letters",
      "No, contractions are strictly banned in all types of letters",
      "They are permitted only in the address block",
      "They are allowed only in letters to teachers"
    ],
    "answer": "Yes, contractions are fully acceptable in informal personal letters",
    "hint": "Natural contractions reflect the conversational register of informal correspondence.",
    "solution": "Informal letters reflect natural conversational speech; appropriate verb contractions ('I'll', 'we've') are fully permitted and expected.",
    "target": "Informal Register: Contraction Permissibility"
  },
  {
    "passage": "What is the correct punctuation mark following the salutation 'Dear Sir,' in a formal letter?",
    "question": "Identify the correct punctuation mark:",
    "options": [
      "A comma",
      "A colon",
      "A semicolon",
      "A period"
    ],
    "answer": "A comma",
    "hint": "Standard WAEC convention places a comma after the salutation.",
    "solution": "In standard British and West African epistolary syntax, salutations terminate with a comma: 'Dear Sir,'.",
    "target": "Salutation Mechanics: Terminal Comma"
  },
  {
    "passage": "A formal petition begins with: 'We, the undersigned executive members of the Youth Development Association...'",
    "question": "What rhetorical purpose does this opening clause serve?",
    "options": [
      "It establishes the legal and representational standing of the petitioners",
      "It apologizes for writing the petition",
      "It lists the personal hobbies of the writers",
      "It states the weather conditions in the community"
    ],
    "answer": "It establishes the legal and representational standing of the petitioners",
    "hint": "Petitions open by clarifying who is writing and on whose authority.",
    "solution": "In administrative petitions, the preamble formally identifies the petitioners and establishes their representational authority before presenting grievances.",
    "target": "Civic Petitions: Preamble Standing"
  },
  {
    "passage": "Which of the following is the most suitable concluding sentence for an informal letter to a friend?",
    "question": "Select the best informal conclusion:",
    "options": [
      "Please give my warmest regards to your parents and write back soon.",
      "I anticipate your prompt official response to my requisition.",
      "I remain, your obedient servant.",
      "Submit your reply within fourteen working days."
    ],
    "answer": "Please give my warmest regards to your parents and write back soon.",
    "hint": "Informal conclusions send warm regards to family members and encourage a reply.",
    "solution": "Sending friendly greetings to family and inviting a response is the standard concluding convention for personal letters.",
    "target": "Informal Valedictions: Familial Regards"
  },
  {
    "passage": "In a formal letter, why must words like 'cannot' and 'will not' be written in full?",
    "question": "State the rule regarding formal register:",
    "options": [
      "Because formal correspondence prohibits contracted verb forms",
      "Because contractions save too much paper",
      "Because full words are easier to read aloud",
      "Because contractions are only used in poetry"
    ],
    "answer": "Because formal correspondence prohibits contracted verb forms",
    "hint": "Uncontracted forms preserve the objective dignity of formal discourse.",
    "solution": "Writing auxiliary verbs in full ('cannot', 'will not') maintains the dignity, precision, and objectivity required in formal writing.",
    "target": "Formal Register: Contraction Ban"
  },
  {
    "passage": "A student writes a letter to his school principal and signs off: 'Your affectionate friend, \\n Kwame'.",
    "question": "What is the primary error in this closing?",
    "options": [
      "Using an overly familiar informal subscription for a formal school head",
      "Failing to write in red ink",
      "Using the name Kwame",
      "Writing the closing on the left margin"
    ],
    "answer": "Using an overly familiar informal subscription for a formal school head",
    "hint": "A student writing to a principal must use formal or semi-formal subscriptions.",
    "solution": "Signing off as 'Your affectionate friend' to a school principal is a serious register breach. The student must use 'Yours faithfully,' with a full formal signature.",
    "target": "Register Alignment: Subscription Traps"
  },
  {
    "passage": "Which of the following headings demonstrates an error by including terminal punctuation?",
    "question": "Identify the incorrectly punctuated heading:",
    "options": [
      "APPLICATION FOR EMPLOYMENT AS A TEACHING ASSISTANT.",
      "APPLICATION FOR EMPLOYMENT AS A TEACHING ASSISTANT",
      "<u>Application for Employment as a Teaching Assistant</u>",
      "Application for Employment as a Teaching Assistant (underlined)"
    ],
    "answer": "APPLICATION FOR EMPLOYMENT AS A TEACHING ASSISTANT.",
    "hint": "Headings must never end with a period (full stop).",
    "solution": "Headings and captions are titles, not complete grammatical sentences. Ending a caption with a full stop is a mechanical error.",
    "target": "Caption Mechanics: Terminal Period Prohibition"
  },
  {
    "passage": "Under WAEC marking rubrics, what are the four criteria used to score an essay?",
    "question": "Identify the four standard evaluation criteria:",
    "options": [
      "Content (10), Organization (5), Expression (10), Mechanical Accuracy (5)",
      "Handwriting (10), Length (10), Speed (5), Neatness (5)",
      "Vocabulary (15), Grammar (10), Punctuation (5), Spelling (0)",
      "Introduction (10), Body (10), Conclusion (5), Title (5)"
    ],
    "answer": "Content (10), Organization (5), Expression (10), Mechanical Accuracy (5)",
    "hint": "The four WAEC dimensions total 30 marks.",
    "solution": "The standard BECE/WAEC essay rubric allocates marks across four dimensions: Content (10 marks), Organization (5 marks), Expression (10 marks), and Mechanical Accuracy (5 marks), totaling 30 marks.",
    "target": "WAEC Assessment Rubric: Four-Tier Structure"
  },
  {
    "passage": "What is the maximum penalty ceiling for Mechanical Accuracy under the 30-mark WAEC essay rubric?",
    "question": "Select the maximum penalty ceiling:",
    "options": [
      "5 marks (errors are penalized 1/2 mark each up to the 5-mark total)",
      "10 marks",
      "15 marks",
      "There is no ceiling; candidates can receive negative marks"
    ],
    "answer": "5 marks (errors are penalized 1/2 mark each up to the 5-mark total)",
    "hint": "Mechanical Accuracy has a ceiling of 5 marks under the WAEC rubric.",
    "solution": "Under WAEC/BECE marking guidelines, Mechanical Accuracy carries 5 marks. Distinct errors deduct 1/2 mark each until the 5-mark ceiling is exhausted.",
    "target": "WAEC Rubrics: Scoring Ceilings"
  }
];

// =========================================================================
// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)
// Basic 8 Intermediate Scaffolds & Model Letters (~250 words each)
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Informal: Career Guidance & Secondary School Electives
  {
    id: "B8_S4_I_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Career Guidance & Elective Choices",
    shortSummary: "Write to an older cousin seeking advice on selecting senior high school elective subjects.",
    prompt: "You are currently considering your future career path and need to select elective subjects for Senior High School next year. Write a letter to your older cousin who is currently studying at university, explaining your dream career, asking for advice on the best combination of secondary school subjects, and inquiring about the study habits required to excel.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Epistolary Register, Career Exploration & Academic Dialogue",
    learningCompetency: "B8.4.2.1.1: Compose friendly personal letters seeking guidance on career planning, subject selection, and study habits using appropriate informal conventions.",
    hint: "Use single address formatting. Express your career interests clearly. Ask thoughtful questions. Conclude with an affectionate closing and your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Christ the King Junior High School,", "P.O. Box 40,", "Obuasi,", "Ashanti Region.", "14th October, 2026."],
        allowedDatingFormats: ["14th October, 2026", "14 October 2026"],
        prohibitedDatingFormats: ["14/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Brother Kojo,",
        permissibleSalutations: ["Dear Brother Kojo,", "Dear Kojo,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his university studies and introduce your career dilemma.", transitionHints: ["I hope this letter finds you well...", "As I progress through Basic 8, I am beginning to think seriously about..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe your dream career (e.g., civil engineer, medical scientist) and what inspired you.", transitionHints: ["My ultimate ambition is to pursue a career in...", "I was inspired after seeing the new bridge construction..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Ask for his advice regarding elective combinations and effective study routines.", transitionHints: ["Given your experience, which elective combination would you recommend...", "What specific study habits helped you score top grades in your WASSCE?"] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Express appreciation for his mentorship and ask him to reply soon.", transitionHints: ["I would be deeply grateful for your guidance...", "Please give my regards to your roommates..."] }
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
      ["Warm opening and academic context established (2 marks)", "Career ambition and inspiration explained clearly (4 marks)", "Thoughtful advice requested on electives and study habits (4 marks)"],
      ["Cousin acknowledged warmly", "Career goal clearly stated", "Subject advice requested"],
      ["Single address format correctly styled (1 mark)", "Familial salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct address layout", "Consistent punctuation", "First name only at closing"],
      ["Warm, natural conversational tone (4 marks)", "Permissible contractions used naturally (3 marks)", "Varied sentence patterns and academic vocabulary (3 marks)"],
      ["Friendly tone without slang", "Clear transitions", "Good sentence variety"]
    ),
    modelAnswer: `Christ the King Junior High School,\nP.O. Box 40,\nObuasi,\nAshanti Region.\n14th October, 2026.\n\nDear Brother Kojo,\n\nI hope this letter finds you in good health and thriving in your engineering studies at KNUST. We all miss your lively presence during family gatherings. As I enter the second term of Basic 8, our guidance counselor has urged us to start thinking seriously about our Senior High School elective programs, and I immediately thought of seeking your seasoned advice.\n\nOver the past year, my passion for design and technology has grown immensely. My dream is to become a civil engineer so that I can design sustainable roads, bridges, and drainage systems that will prevent annual flooding in our mining communities. I am fascinated by how structural mechanics can solve pressing societal challenges.\n\nI am currently torn between selecting General Science with Elective Mathematics, Physics, and Chemistry, or opting for Technical Skills. Given the competitive nature of university admissions, which combination do you think will provide the strongest foundation for civil engineering? In addition, how did you manage the intense volume of calculations during your secondary school days without burning out?\n\nYour mentorship has always guided me, and any book recommendations or study strategies you share will be immensely valuable to me.\n\nPlease extend my warmest regards to Uncle Yaw and Auntie Mary when you call them. Write back soon!\n\nYour loving cousin,\nKwame`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Informal: Promoting Local Eco-Tourism to a Pen Pal
  {
    id: "B8_S4_I_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Eco-Tourism & Wildlife Conservation in Ghana",
    shortSummary: "Write to a foreign pen pal describing an excursion to Mole National Park and promoting eco-tourism.",
    prompt: "Your school recently organized an educational excursion to the Mole National Park in the Savannah Region. Write a letter to your pen pal in Kenya, describing your close encounters with elephants and antelopes, sharing your safari experience, and discussing why eco-tourism is essential for protecting wildlife and supporting rural communities.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Descriptive Travel Exposition, Environmental Awareness & Informal Warmth",
    learningCompetency: "B8.4.2.1.1: Compose descriptive personal letters detailing wildlife conservation, safari experiences, and eco-tourism benefits.",
    hint: "Use single address formatting. Describe the safari using vivid sensory adjectives. Conclude with your first name only.",
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
        permissibleSalutations: ["Dear Wanjiru,", "Dearest Wanjiru,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about her life in Nairobi and announce your thrilling safari trip.", transitionHints: ["I hope you are doing wonderfully in Nairobi...", "I am eager to share the unforgettable highlights of our safari..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe driving through the park and encountering majestic elephants at the watering hole.", transitionHints: ["Our early morning safari drive was truly breathtaking...", "Just twenty meters from our jeep, a family of African elephants emerged..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain the broader benefits of eco-tourism for wildlife preservation and local villagers.", transitionHints: ["Our park ranger explained that eco-tourism provides essential revenue...", "Local villagers are employed as tour guides and conservation monitors..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Invite her to visit Ghana and ask about famous wildlife parks in Kenya.", transitionHints: ["You simply must visit Ghana during your next vacation...", "Write back soon and tell me about the wildlife reserves near Nairobi..."] }
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
      ["Warm opening and excursion context established (2 marks)", "Vivid sensory description of safari and wildlife encounters (4 marks)", "Eco-tourism benefits for conservation and community explained (4 marks)"],
      ["Kenyan pen pal acknowledged", "Safari details vivid and clear", "Eco-tourism importance explained"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Lively, descriptive, and natural tone (4 marks)", "Natural conversational flow (3 marks)", "Vivid travel vocabulary (3 marks)"],
      ["Sensory details used effectively", "Smooth transitions", "Apt descriptive vocabulary"]
    ),
    modelAnswer: `Achimota Basic School,\nP.O. Box AH 11,\nAchimota-Accra.\n20th October, 2026.\n\nDear Wanjiru,\n\nI hope this letter finds you well and enjoying the cool weather in Nairobi. I recently returned from an unforgettable three-day school excursion to Mole National Park in the northern savannah belt of Ghana, and I am bursting with excitement to share my experience with you!\n\nOur early morning game drive was magical. As the golden dawn mist cleared over the savannah grasslands, our open-top safari vehicle navigated along the watering holes. Suddenly, our armed ranger signaled for silence. Barely thirty meters away, a majestic herd of wild African elephants emerged from the acacia trees! Watching a massive bull elephant spray cool water over its dusty back while playful calves splashed beside it was awe-inspiring. We also spotted graceful roan antelopes, warthogs, and troops of baboons grooming each other on termite mounds.\n\nOur guide explained that eco-tourism plays a vital role in protecting these endangered species from illegal poachers. The entrance fees paid by visitors fund round-the-clock anti-poaching patrols and support community development projects, such as building clinics and solar boreholes for neighboring villages. When local communities benefit directly from tourism, they become active protectors of wildlife.\n\nSince Kenya is world-renowned for its safaris, I would love to know which national reserve you like best. When you visit Ghana, we will certainly embark on another safari together!\n\nYour sincere friend,\nEsi`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Semi-Formal: Request to Housemaster for Prep Exemption
  {
    id: "B8_S4_I_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Semi-Formal Letter",
    title: "Permission for Prep Exemption for Science Quiz",
    shortSummary: "Write to your Housemaster requesting permission to miss evening prep to attend science quiz coaching.",
    prompt: "You have been chosen to represent your school in the upcoming Regional Science and Mathematics Quiz, but the evening preparatory coaching sessions clash with your boarding house study prep. Write a semi-formal letter to your Housemaster, explaining the situation, requesting permission to be excused from evening prep for three weeks, and detailing how you plan to compensate for your private study.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Deference, Academic Prioritization & Underlined Title Case Caption",
    learningCompetency: "B8.4.2.1.2: Compose semi-formal requests adhering to respectful registers, surname salutations, underlined Title Case captions, and 'Yours sincerely,' subscriptions.",
    hint: "Address as 'Dear Mr. [Surname],'. Provide an underlined Title Case caption. Explain your timetable clash and compensatory study plan. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["House 3 Dormitory,", "Achimota Basic School,", "P.O. Box AH 11,", "Achimota-Accra.", "25th October, 2026."],
        allowedDatingFormats: ["25th October, 2026", "25 October 2026"],
        prohibitedDatingFormats: ["25/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Boateng,",
        permissibleSalutations: ["Dear Mr. Boateng,", "Dear Housemaster,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Permission to be Excused from Evening Prep Sessions",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Respectfully state the purpose of the letter and announce your selection for the science quiz team.", transitionHints: ["I write to respectfully inform you that I have been selected to represent...", "With reference to the upcoming regional quiz championship..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain the clash in timetable between the coaching sessions and house prep.", transitionHints: ["The regional quiz organizing committee has scheduled intensive tutorials...", "Regrettably, this timing directly conflicts with our mandatory boarding prep hours..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Detail your compensatory study plan (library study, notes from classmates) and request a three-week exemption.", transitionHints: ["To ensure that my regular academic studies do not suffer...", "I have arranged with our study prefect, Kwame Osei, to review class briefing notes..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your commitment to house discipline and express polite anticipation of approval.", transitionHints: ["In view of the significance of this contest to our school's reputation...", "Thank you very much for your continuous guidance and understanding..."] }
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
      ["Quiz selection and purpose stated clearly (3 marks)", "Schedule clash and duration explained (3 marks)", "Academic compensation plan detailed (4 marks)"],
      ["Purpose clear in opening", "Schedule clash documented", "Study catch-up plan provided"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Caption underlined", "Correct subscription", "Full printed name without signature"],
      ["Respectful, dignified semi-formal tone (4 marks)", "No informal contractions (3 marks)", "Clear academic vocabulary (3 marks)"],
      ["Courteous phrasing throughout", "Zero slang", "Clear sentence structure"]
    ),
    modelAnswer: `House 3 Dormitory,\nAchimota Basic School,\nP.O. Box AH 11,\nAchimota-Accra.\n25th October, 2026.\n\nDear Mr. Boateng,\n\nPermission to be Excused from Evening Prep Sessions\n__________________________________________________\n\nI write to respectfully inform you that I have been selected by the school administration to represent Achimota Basic School in the forthcoming Greater Accra Regional Science and Mathematics Quiz competition.\n\nThe regional quiz organizing committee has scheduled intensive masterclass coaching sessions daily from 6:30 p.m. to 8:30 p.m. in the central computer laboratory. Regrettably, this schedule directly clashes with our mandatory boarding house evening prep hours. The training commences on Monday, 2nd November, and will run for three consecutive weeks.\n\nTo ensure that my regular academic studies do not suffer as a result of this permission, I have consulted my subject tutors and arranged to complete all evening prep homework assignments during afternoon library hours. In addition, our house study prefect, Kwame Osei, has agreed to share daily class briefing notes with me after every evening prep session so that I do not miss any core instruction.\n\nIn view of the significance of this competition to the reputation of our school, I humbly appeal to your kind office to grant me permission to be excused from house prep for the designated three-week period.\n\nThank you very much for your continuous guidance, patience, and understanding.\n\nYours sincerely,\nEmmanuel Mensah`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Formal: Application for Student Library Prefect
  {
    id: "B8_S4_I_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Application for School Library Prefect",
    shortSummary: "Apply to the Headmaster for appointment as the School Library Prefect.",
    prompt: "Nominations have opened for senior student leadership positions for the next academic year. Write a formal letter of application to your Headmaster, applying for the position of School Library Prefect. State your academic standing, outline your past contributions to the library, and propose two innovative initiatives to cultivate a vibrant reading culture among junior students.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Policy Innovation & Quadripartite Close",
    learningCompetency: "B8.4.2.1.2: Compose formal administrative applications demonstrating academic leadership, reading culture initiatives, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 8 Stream A Secretariat,", "Opoku Ware Basic School,", "P.O. Box 700,", "Kumasi,", "Ashanti Region.", "28th October, 2026."],
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
        modelCaption: "APPLICATION FOR THE POSITION OF SCHOOL LIBRARY PREFECT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of School Library Prefect.", transitionHints: ["I write to formally submit my candidature for the office of...", "Pursuant to the circular inviting applications for student leadership positions..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your academic record, passion for literature, and volunteer library work.", transitionHints: ["Throughout my two years in this institution, I have maintained...", "As a volunteer student librarian, I have assisted our tutor in cataloging..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Propose two innovative policies to foster reading (e.g., 'Reader of the Month' and book clubs).", transitionHints: ["If given the mandate to serve, I will introduce two dynamic reading initiatives...", "First, I propose the launch of a 'Reader of the Month' award..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge commitment to institutional discipline and express readiness for vetting.", transitionHints: ["I pledge to discharge my responsibilities with diligence, fairness, and humility...", "Thank you very much for considering my application..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Student, Basic 8A",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application position stated clearly (2 marks)", "Academic credentials and library experience shown (4 marks)", "Two actionable reading culture initiatives proposed (4 marks)"],
      ["Library Prefect post clear", "Academic standing demonstrated", "Two initiatives outlined"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive academic vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: `Basic 8 Stream A Secretariat,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi,\nAshanti Region.\n28th October, 2026.\n\nThe Headmaster,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi, Ashanti Region.\n\nDear Sir,\n\nAPPLICATION FOR THE POSITION OF SCHOOL LIBRARY PREFECT\n\nI write to formally submit my candidature for the office of School Library Prefect for the upcoming 2026/2027 academic session, pursuant to the official circular on prefectorial nominations.\n\nI possess an unyielding passion for literacy, academic inquiry, and student service. Throughout my academic tenure in Basic 7 and Basic 8, I have consistently maintained an unblemished conduct record and earned academic honors in English Literature and Social Studies. Over the past four terms, I have served faithfully as a volunteer library assistant, helping our school librarian classify new reference texts, mend torn book spines, and supervise student silence during afternoon study periods.\n\nIf appointed to this leadership office, I intend to introduce two transformative reading programs. First, I will establish a competitive 'Reader of the Month' initiative, where pupils who read and submit structured one-page summaries of at least four supplementary library books receive a book voucher during morning assembly. Second, I will institute weekly peer-led book discussion circles during break periods to help struggling readers build vocabulary and comprehension skills in a supportive setting.\n\nI pledge to execute my duties with fairness, punctuality, and unwavering loyalty to the school administration.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nRichmond Asare\nStudent, Basic 8A`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Civic Petition: Construction of a Pedestrian Footbridge
  {
    id: "B8_S4_I_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Civic Petition",
    title: "Petition for a Highway Pedestrian Footbridge",
    shortSummary: "Petition the Municipal Chief Executive for a pedestrian footbridge across a dangerous highway fronting schools.",
    prompt: "The expansion of the main municipal highway into a dual carriageway has made crossing the road perilous for hundreds of basic school pupils, resulting in frequent vehicular accidents. As the President of the Joint School Road Safety Coalition, write a formal petition to your Municipal Chief Executive (MCE), documenting recent accident statistics and appealing for the urgent construction of an overhead pedestrian footbridge.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Advocacy Architecture, Forensic Accident Documentation & Legislative Prayer",
    learningCompetency: "B8.4.2.1.2: Compose civic petitions to local assemblies detailing traffic hazards, pedestrian accident data, and structured engineering prayers.",
    hint: "Address to 'The Municipal Chief Executive,'. State the pedestrian crisis factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Road Safety Coalition Secretariat,", "Madina Cluster of Schools,", "P.O. Box MD 50,", "Madina-Accra.", "2nd November, 2026."],
        allowedDatingFormats: ["2nd November, 2026", "2 November 2026"],
        prohibitedDatingFormats: ["02/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Municipal Chief Executive,",
        officeOrSchoolPlaceholder: "La-Nkwantanang Madina Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box MD 11,",
        townRegionPlaceholder: "Madina-Accra.",
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
        modelCaption: "PETITION FOR THE CONSTRUCTION OF AN OVERHEAD PEDESTRIAN FOOTBRIDGE",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your coalition's mandate and declare the pedestrian safety grievance.", transitionHints: ["We, the executive committee of the Joint School Road Safety Coalition, respectfully petition...", "I write on behalf of over three thousand pupils across four educational clusters to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the recent surge in pedestrian hit-and-run accidents and crossing difficulties.", transitionHints: ["Since the expansion of the highway into an unbarricaded dual carriageway, vehicular speeds have surged...", "Tragically, five pupils have been knocked down by speeding haulage trucks over the past term..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (construction of an overhead footbridge, temporary police traffic wardens).", transitionHints: ["We therefore humbly pray that your honorable administration take decisive action...", "First, we appeal for the urgent funding and construction of an overhead steel footbridge..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent administrative action to prevent further loss of innocent young lives.", transitionHints: ["Our children's right to safe education must be protected...", "Thank you very much for your leadership and anticipated prompt intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "President, Road Safety Coalition",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Coalition representation established (2 marks)", "Forensic accident data and pedestrian hazards documented (4 marks)", "Clear three-point road engineering prayer presented (4 marks)"],
      ["Coalition authority established", "Accident data documented clearly", "Overhead footbridge and wardens requested"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive traffic engineering vocabulary (3 marks)"],
      ["Civic advocacy language", "Logical problem-evidence-prayer flow", "Precise technical road terminology"]
    ),
    modelAnswer: `Road Safety Coalition Secretariat,\nMadina Cluster of Schools,\nP.O. Box MD 50,\nMadina-Accra.\n2nd November, 2026.\n\nThe Municipal Chief Executive,\nLa-Nkwantanang Madina Municipal Assembly,\nP.O. Box MD 11,\nMadina-Accra.\n\nDear Sir,\n\nPETITION FOR THE CONSTRUCTION OF AN OVERHEAD PEDESTRIAN FOOTBRIDGE\n\nI write on behalf of the executive committee of the Joint School Road Safety Coalition and the student population of over three thousand pupils across four basic schools to respectfully petition your high office regarding the deadly pedestrian hazards along the newly expanded Madina-Pantang highway.\n\nSince the completion of the asphalt dual carriageway earlier this year, vehicular traffic has accelerated to highway speeds exceeding eighty kilometers per hour. In the absence of speed-calming interventions or pedestrian overpasses, crossing this six-lane corridor during morning arrival and afternoon closing hours has become a terrifying gamble. Within the last two months alone, four basic school pupils were struck by speeding commercial minibuses while attempting to cross to school, resulting in two fatalities and two severe orthopedic amputations. Hundreds of terrified parents are withdrawing their children from school out of fear for their lives.\n\nTo prevent further loss of innocent young lives and restore public confidence, we humbly pray that your honorable administration execute three urgent interventions. First, we appeal for the immediate budgetary allocation and construction of a raised concrete pedestrian footbridge directly opposite the school cluster gate. Second, we demand the immediate daily deployment of municipal traffic wardens to halt vehicular traffic during peak crossing hours. Finally, we urge the assembly to install audible rumble strips and prominent warning signposts along the approach.\n\nOur children deserve to pursue education without risking death on the highway.\n\nThank you for your dedicated service and anticipated swift intervention.\n\nYours faithfully,\n[Signature]\nIbrahim Alhassan\nPresident, Road Safety Coalition`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Informal: Account of Inter-Schools Debate Championship
  {
    id: "B8_S4_I_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Regional Debate Championship Triumph",
    shortSummary: "Write to a friend narrating your school's triumph in the regional debate championship.",
    prompt: "Your school emerged as the champion in the regional junior secondary schools debate competition on the motion: 'Artificial Intelligence Does More Harm Than Good to African Education.' Write a letter to your former seatmate who transferred to another school, narrating the dramatic debate rounds, describing your role as the lead speaker, and sharing how the victory was celebrated.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Intellectual Narrative, Argumentative Pacing & Conversational Warmth",
    learningCompetency: "B8.4.2.1.1: Compose friendly personal letters narrating intellectual contests, oratorical triumphs, and shared academic milestones.",
    hint: "Use single address formatting. Narrate the debate rounds with descriptive intellectual vocabulary. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Presbyterian Junior High School,", "P.O. Box 102,", "Tema,", "Greater Accra Region.", "8th November, 2026."],
        allowedDatingFormats: ["8th November, 2026", "8 November 2026"],
        prohibitedDatingFormats: ["08/11/2026"]
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
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his new school and announce the championship victory enthusiastically.", transitionHints: ["I hope this letter finds you well...", "I have the most exhilarating news to share with you!"] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the motion and your arguments against the proposition as the principal speaker.", transitionHints: ["Our debate team faced defending champions St. Peter's on the motion...", "Speaking against the motion, I argued that AI empowers rural schools through automated tutoring..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Narrate the intense rebuttal round and the judges' unanimous verdict.", transitionHints: ["The tension peaked during the cross-examination rebuttal round...", "When the chief judge announced that our team won with ninety-four points, the hall erupted..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Detail the victory celebrations back on campus and ask him to write back.", transitionHints: ["Our headmaster presented us with commemorative certificates during assembly...", "Write back soon and let me know about your school's debate society..."] }
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
      ["Warm opening and debate victory context established (2 marks)", "Debate motion and principal arguments described clearly (4 marks)", "Dramatic rebuttal round and celebration details shared (4 marks)"],
      ["Friend acknowledged warmly", "Debate arguments detailed vividly", "Rebuttal and awards included"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Lively, intellectual, and natural tone (4 marks)", "Natural conversational phrasing (3 marks)", "Rich oratorical vocabulary (3 marks)"],
      ["Enthusiastic tone", "Smooth narrative flow", "Rich vocabulary"]
    ),
    modelAnswer: `Presbyterian Junior High School,\nP.O. Box 102,\nTema,\nGreater Accra Region.\n8th November, 2026.\n\nDear Selorm,\n\nI hope this letter finds you settled and excelling in your new school in Tema. We all miss your insightful contributions during social studies debates! I am writing to share some thrilling news: our school debate team just won the Greater Accra Regional Junior Debating Championship!\n\nThe tournament brought together sixteen elite junior high schools to deliberate on the controversial motion: 'Artificial Intelligence Does More Harm Than Good to African Education.' Our team was tasked with opposing the motion against the formidable defending champions, St. Peter's.\n\nAs the lead speaker for the opposition, I felt a knot in my stomach when taking the podium. However, once I gripped the microphone, confidence took over. I argued passionately that intelligent adaptive tutoring platforms bridge the teacher deficit in rural Ghanaian schools, allowing children in remote villages to access world-class science and mathematics lessons on basic tablets. During the rebuttal round, our second speaker, Maame Yaa, brilliantly dismantled the proposition's claims on cheating by demonstrating how AI literacy prepares African students for global employment.\n\nWhen the chief adjudicator announced that our school had won by a decisive margin of ninety-four points to eighty-seven, our supporters erupted into deafening cheers! We received a shimmering glass trophy, a desktop computer for our library, and gold medals.\n\nI wish you were there to celebrate with us. Write back soon and tell me about the academic clubs in your new school.\n\nYour sincere friend,\nKelvin`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Semi-Formal: Seeking Venue Permission for Inter-School Quiz
  {
    id: "B8_S4_I_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Semi-Formal Letter",
    title: "Community Hall Booking for Science Quiz",
    shortSummary: "Write to a community center administrator requesting the use of the main hall for an inter-schools quiz.",
    prompt: "You are the Coordinator of the Municipal Junior Science Club. Write a semi-formal letter to Mr. Daniel Oduro, the Administrator of the Municipal Community Centre, requesting the use of the main conference hall for your annual inter-schools quiz championship. State the date, hours, and expected attendance, outline required audiovisual support, and guarantee the care and cleanliness of the facility.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Facility Negotiation, Logistical Clarity & Facility Indemnity Guarantee",
    learningCompetency: "B8.4.2.1.2: Compose semi-formal requests to facility administrators detailing event logistics, audiovisual needs, and property care guarantees.",
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
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Invite him as a Special Guest of Honor and express gratitude.", transitionHints: ["We would be deeply honored if you could join us as our Special Guest...", "Thank you very much for your continuous dedication to youth intellectual development..."] }
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
    id: "B8_S4_I_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Application for School Health & Dispensary Prefect",
    shortSummary: "Apply to the Senior Housemistress to serve as the School Health and Dispensary Prefect.",
    prompt: "Nominations have opened for student leadership positions in your school. Write a formal letter of application to your Senior Housemistress, applying to serve as the School Health and Dispensary Prefect. Highlight your First Aid training, discuss common health challenges among boarding pupils, and propose two practical measures to improve dispensary triage and campus hygiene.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Health Policy Advocacy & Quadripartite Close",
    learningCompetency: "B8.4.2.1.2: Compose formal administrative applications demonstrating medical aptitude, health policy proposals, dual addresses, and quadripartite sign-offs.",
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
        designationPlaceholder: "Student, Basic 8B",
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
    modelAnswer: `Health Cadet Desk,\nYaa Asantewaa Girls' Basic School,\nP.O. Box 450,\nKumasi,\nAshanti Region.\n15th November, 2026.\n\nThe Senior Housemistress,\nYaa Asantewaa Girls' Basic School,\nP.O. Box 450,\nKumasi, Ashanti Region.\n\nDear Madam,\n\nAPPLICATION FOR THE POSITION OF SCHOOL HEALTH PREFECT\n\nI write to formally submit my candidature for the office of School Health and Dispensary Prefect for the 2026/2027 academic session, pursuant to the announcement on prefectorial appointments.\n\nI possess a lifelong dedication to community healthcare and student welfare. Throughout Basic 7 and Basic 8, I have maintained an unblemished disciplinary record while actively serving as the lead first-aider for our school sports contingent. Last year, I successfully completed the certified Youth First Aid Training Course conducted by the Ghana Red Cross Society, acquiring practical skills in wound dressing, CPR administration, and vital signs monitoring.\n\nAt present, our school dispensary faces two operational bottlenecks: morning congestion during roll-call and delays in administering basic oral rehydration therapy to boarders suffering from acute dehydration and fever. To resolve these challenges, I intend to implement two practical reforms. First, I will establish a digital morning triage desk where minor cuts and headaches are recorded and treated swiftly, preventing overcrowding in the main examination room. Second, I will launch a weekly 'Clean Water, Healthy Boarders' peer education campaign to ensure dormitory water storage barrels are kept scrubbed and covered.\n\nI pledge to execute my duties with compassion, confidentiality, and firm adherence to institutional regulations.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nSerwaa Akoto\nStudent, Basic 8B`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Civic Petition: Deplorable Healthcare Infrastructure in Rural Clinics
  {
    id: "B8_S4_I_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Civic Petition",
    title: "Petition on Healthcare Infrastructure in Rural Clinic",
    shortSummary: "Petition the District Chief Executive over frequent power blackouts and vaccine spoilage at the local health center.",
    prompt: "The only community health clinic serving your farming district lacks a reliable backup power generator, resulting in spoiled vaccine cold-chains and nurses using phone flashlights to deliver babies during night blackouts. As the Secretary of the Rural Youth Health Alliance, write a formal petition to your District Chief Executive (DCE), documenting the life-threatening conditions and appealing for the urgent installation of a solar power inverter and an automated backup generator.",
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

  // 60. Formal Letter to Editor: Combating Illegal Mining & River Contamination
  {
    id: "B8_S4_I_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Combating Illegal Mining & River Contamination",
    shortSummary: "Write to the Editor of a national newspaper on artisanal gold mining destroying municipal water supplies.",
    prompt: "Unregulated illegal artisanal gold mining along major river basins is poisoning public water sources with toxic chemicals and driving up municipal water treatment costs. Write a letter to the Editor of a national daily newspaper, expressing profound concern over the contamination of drinking water, analyzing the economic costs on utility tariffs, and proposing two strict regulatory policies to protect river ecosystems.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Letter to the Press Architecture, Environmental Socio-Economic Commentary & Statutory Valediction",
    learningCompetency: "B8.4.2.1.2: Compose formal letters to national newspaper editors analyzing ecological crises, economic impacts, and statutory regulatory interventions.",
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
async function deployStrand4B8IntermediateClean() {
  const db = await getFirestoreDb();
  console.log("Building clean 60-item Strand 4 B8 Intermediate Practice Lab...");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective, Shuffled Options)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory, Flippable Prompts)");

  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // 1. Build Section A (Questions 1 to 50: Objective Multiple-Choice with Shuffled Options)
  rawObjective50Data.forEach((item, index) => {
    const qNum = index + 1;
    const shuffledOptions = shuffleArray(item.options);

    all60Items.push({
      id: `B8_S4_I_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B8",
      difficulty: "intermediate",
      category: "Epistolary Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n"${item.passage}"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: shuffledOptions,
      correctAnswer: item.answer, // Matches exact string value regardless of shuffled position
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B8.4.2.1: Demonstrate intermediate mastery of epistolary formatting, address architecture, dating laws, salutation/close pairings, and caption rules."
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
    difficulty: "intermediate",
    title: "Basic 8 Intermediate Writing Lab: 50 Objective Drills + 10 Theory Writing Tasks",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B8_intermediate`
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

  console.log(`\n✅ SUCCESS: Deployed exactly ${all60Items.length} items to practice labs & pools!`);
}

deployStrand4B8IntermediateClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B8 Intermediate Clean 60 Lab:", err);
    process.exit(1);
  });

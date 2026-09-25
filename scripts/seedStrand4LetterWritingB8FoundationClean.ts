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
  difficulty: "foundation";
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
  difficulty: "foundation";
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
        "Consistent subject-verb concord across compound and complex sentences",
        "Proper sequence of tenses and modal auxiliary precision",
        "Absolute absence of contractions and slang in formal and semi-formal registers"
      ]
    }
  }
});

const rawObjective50Data = [
  {
    "passage": "A Basic 8 pupil writes an informal letter to his elder brother living in Sunyani.",
    "question": "Where should the writer's address and date be positioned in the standard WAEC layout?",
    "options": [
      "At the top right-hand corner of the page",
      "On the top left margin directly above the salutation",
      "Centered at the top of the sheet",
      "At the bottom left beneath the signature"
    ],
    "answer": "At the top right-hand corner of the page",
    "hint": "Traditional epistolary layout places the sender's address at the top right.",
    "solution": "In standard WAEC informal letter formatting, the sender's address and the date are placed in the top right-hand corner of the paper.",
    "target": "Informal Architecture: Sender Address Alignment"
  },
  {
    "passage": "A student dates a semi-formal letter as: '25-09-2026'.",
    "question": "Why does the Chief Examiner penalize this dating format?",
    "options": [
      "Numerical hyphenated dates are strictly prohibited in epistolary compositions",
      "The year should have been written in words",
      "Hyphens are only permitted in formal petitions",
      "The date should appear at the bottom of the page"
    ],
    "answer": "Numerical hyphenated dates are strictly prohibited in epistolary compositions",
    "hint": "Dates in essays must have the month written out in words.",
    "solution": "Numerical shorthand dates using hyphens or slashes (e.g., 25-09-2026) violate standard epistolary conventions. The month must be spelled out in full.",
    "target": "Epistolary Dating Laws: Prohibited Numerical Shorthand"
  },
  {
    "passage": "In a formal letter to the Municipal Education Director, the salutation is 'Dear Sir,'.",
    "question": "Which of the following subscriptions must be used to close this letter?",
    "options": [
      "Yours faithfully,",
      "Yours sincerely,",
      "Your obedient student,",
      "Yours affectionately,"
    ],
    "answer": "Yours faithfully,",
    "hint": "An impersonal formal salutation strictly pairs with 'faithfully'.",
    "solution": "The co-occurrence constraint mandates that an impersonal salutation ('Dear Sir,' or 'Dear Madam,') must pair with 'Yours faithfully,'.",
    "target": "Co-occurrence Constraint: Impersonal Formal Valediction"
  },
  {
    "passage": "A candidate writes the caption for an application letter as: <u>APPLICATION FOR ADMISSION TO BASIC 8</u>.",
    "question": "What layout error has been committed in this heading?",
    "options": [
      "Underlining a heading written in full block capital letters",
      "Using capital letters for the heading",
      "Failing to write the heading in italics",
      "Placing the caption below the first paragraph"
    ],
    "answer": "Underlining a heading written in full block capital letters",
    "hint": "Block capital headings must never be underlined.",
    "solution": "Under WAEC marking rubrics, a caption written in ALL CAPITAL LETTERS must not be underlined. Underlining is reserved solely for Title Case headings.",
    "target": "Caption Orthography: Block Capital Underlining Ban"
  },
  {
    "passage": "A student writes a semi-formal letter to his Housemaster, Mr. Mensah.",
    "question": "Which salutation is the most appropriate?",
    "options": [
      "Dear Mr. Mensah,",
      "Dear Sir Mensah,",
      "Dear Mensah,",
      "Hello Mr. Mensah,"
    ],
    "answer": "Dear Mr. Mensah,",
    "hint": "Semi-formal greetings use 'Dear' followed by the title and surname.",
    "solution": "In semi-formal correspondence to an adult superior, the salutation combines 'Dear' with the recipient's polite title and surname: 'Dear Mr. Mensah,'.",
    "target": "Semi-Formal Salutations: Surname Deference"
  },
  {
    "passage": "A formal petition closes with: 'Yours faithfully, \\n Kwame Mensah'.",
    "question": "What critical formal element has been omitted between the subscription and the printed name?",
    "options": [
      "The handwritten signature mark",
      "The writer's postal address",
      "The telephone number",
      "The date of birth of the writer"
    ],
    "answer": "The handwritten signature mark",
    "hint": "A formal sign-off requires a signature between the closing and the printed name.",
    "solution": "In formal correspondence, a handwritten signature mark must appear between the subscription ('Yours faithfully,') and the printed name.",
    "target": "The Quadripartite Sign-off Framework: Signature Mandate"
  },
  {
    "passage": "In closed address punctuation, which punctuation mark terminates the final line of the address block?",
    "question": "Identify the terminal punctuation mark:",
    "options": [
      "A full stop (period)",
      "A comma",
      "A semicolon",
      "A colon"
    ],
    "answer": "A full stop (period)",
    "hint": "Closed punctuation ends every line with a comma except the last, which gets a period.",
    "solution": "Under closed punctuation rules, intermediate lines terminate with commas, while the final line terminates with a full stop.",
    "target": "Address Architecture: Closed Punctuation Rules"
  },
  {
    "passage": "A candidate writes the sender's address in pure block style.",
    "question": "How should all lines within the block be aligned?",
    "options": [
      "Flush along the left margin of the address block without indentation",
      "Progressively stepped to the right",
      "Centered horizontally on the page",
      "Alternating between left and right margins"
    ],
    "answer": "Flush along the left margin of the address block without indentation",
    "hint": "Block format aligns all text flush to a single vertical line.",
    "solution": "In pure block formatting, all lines begin at the exact same vertical left margin without any progressive indentation.",
    "target": "Address Styling: Block Alignment"
  },
  {
    "passage": "Which of the following dates exemplifies accurate closed punctuation?",
    "question": "Select the correctly punctuated closed date:",
    "options": [
      "25th September, 2026.",
      "25 September 2026",
      "25th September 2026,",
      "September 25 2026."
    ],
    "answer": "25th September, 2026.",
    "hint": "Closed style has an ordinal indicator, a comma after the month, and a period at the end.",
    "solution": "In closed punctuation, the date includes an ordinal suffix ('th'), a comma following the month, and a terminal period: '25th September, 2026.'.",
    "target": "Dating Orthography: Closed Style"
  },
  {
    "passage": "A student writes a friendly letter to his mother and signs off as: 'Your loving son, \\n Kwabena Osei'.",
    "question": "What is the structural defect in this sign-off?",
    "options": [
      "Including the surname 'Osei' in an informal family letter",
      "Using 'Your loving son'",
      "Failing to write in block capitals",
      "Omitting a signature mark"
    ],
    "answer": "Including the surname 'Osei' in an informal family letter",
    "hint": "Letters to parents and close friends require first name only.",
    "solution": "Informal letters to parents or siblings mandate a mononymic sign-off (first name only). Appending a surname introduces unnatural distance.",
    "target": "Informal Sign-off: Mononymic Protocol"
  },
  {
    "passage": "In the subscription 'Yours faithfully,', what is the capitalization rule for the second word?",
    "question": "Select the correct orthographic rule:",
    "options": [
      "The second word must begin with a lowercase letter ('faithfully')",
      "The second word must begin with a capital letter ('Faithfully')",
      "Both words must be in all capital letters",
      "Neither word is capitalized"
    ],
    "answer": "The second word must begin with a lowercase letter ('faithfully')",
    "hint": "Only the very first word in an epistolary closing begins with a capital letter.",
    "solution": "Prescriptive epistolary mechanics require that only the first word of a subscription begins with a capital letter: 'Yours faithfully,'.",
    "target": "Subscription Mechanics: Lowercase Second Element"
  },
  {
    "passage": "A candidate writes a Title Case heading: <u>An Appeal For Financial Assistance</u>.",
    "question": "What minor word capitalization defect is present in this heading?",
    "options": [
      "The preposition 'For' should be written in lowercase ('for')",
      "The noun 'Appeal' should be in lowercase",
      "The noun 'Assistance' should be in lowercase",
      "The article 'An' should be in lowercase"
    ],
    "answer": "The preposition 'For' should be written in lowercase ('for')",
    "hint": "Short prepositions remain lowercase in Title Case.",
    "solution": "In Title Case, grammatical function words such as short prepositions ('for', 'in', 'at') and coordinating conjunctions must remain in lowercase.",
    "target": "Title Case Mechanics: Preposition Casing"
  },
  {
    "passage": "A student writes: 'The Headmaster together with the tutors has inspected the dormitory.'",
    "question": "Why is the singular verb 'has inspected' grammatically correct?",
    "options": [
      "Because 'together with the tutors' is a parenthetical prepositional phrase that does not alter the singular head noun 'Headmaster'",
      "Because 'dormitory' is singular",
      "Because tutors are subordinate to the headmaster",
      "Because 'inspected' is an intransitive verb"
    ],
    "answer": "Because 'together with the tutors' is a parenthetical prepositional phrase that does not alter the singular head noun 'Headmaster'",
    "hint": "Phrases introduced by 'together with' are quasi-coordinators and do not compound the subject.",
    "solution": "Quasi-coordinators ('together with', 'as well as') introduce parenthetical adjuncts. Concord is strictly governed by the singular subject 'Headmaster'.",
    "target": "Concord Mechanics: Parenthetical Quasi-Coordinators"
  },
  {
    "passage": "A formal letter addressed to a newspaper editor has the inside address: 'The Editor, Daily Graphic, P.O. Box 742, Accra.'.",
    "question": "What is the standard salutation for this letter?",
    "options": [
      "Dear Sir, / Sir,",
      "Dear Editor Kwame,",
      "Hello Daily Graphic,",
      "Dear Mr. Editor,"
    ],
    "answer": "Dear Sir, / Sir,",
    "hint": "Letters to the press use 'Dear Sir,' or 'Sir,'.",
    "solution": "In letters addressed to the editor of a newspaper, standard journalistic protocol mandates 'Dear Sir,' or simply 'Sir,'.",
    "target": "Letters to the Editor: Salutation Norms"
  },
  {
    "passage": "In a formal quadripartite sign-off, where is the writer's official designation placed?",
    "question": "Select the correct position:",
    "options": [
      "Directly beneath the printed full name on the fourth line",
      "Above the handwritten signature",
      "On the same line as the subscription",
      "Inside the body of the final paragraph"
    ],
    "answer": "Directly beneath the printed full name on the fourth line",
    "hint": "The designation is the final line of the four-tier sign-off.",
    "solution": "The formal quadripartite sign-off arranges its components as: Subscription -> Signature -> Printed Name -> Official Designation.",
    "target": "Quadripartite Sign-off: Designation Alignment"
  },
  {
    "passage": "Which of the following subscriptions contains an ungrammatical apostrophe?",
    "question": "Identify the flawed subscription:",
    "options": [
      "Your's sincerely,",
      "Yours sincerely,",
      "Your sincere friend,",
      "Your loving brother,"
    ],
    "answer": "Your's sincerely,",
    "hint": "Possessive pronouns never take apostrophes.",
    "solution": "The possessive pronoun 'Yours' does not take an apostrophe. 'Your's' is an error penalized under Mechanical Accuracy.",
    "target": "Subscription Mechanics: Apostrophe Prohibition"
  },
  {
    "passage": "A pupil opens an informal letter to a classmate with: 'Dear Sir, I am writing to inform you about our upcoming football match.'",
    "question": "What is the major defect in this opening?",
    "options": [
      "Severe register clash: using the formal salutation 'Dear Sir,' in a friendly peer letter",
      "Failing to use passive voice",
      "Omitting the recipient's surname",
      "Writing in the present tense"
    ],
    "answer": "Severe register clash: using the formal salutation 'Dear Sir,' in a friendly peer letter",
    "hint": "'Dear Sir,' is strictly formal and inappropriate for friends.",
    "solution": "Using 'Dear Sir,' in a letter to a school peer creates an absurd register clash. Informal letters require familiar salutations such as 'Dear Kofi,'.",
    "target": "Epistolary Register Traps: Salutation Incongruity"
  },
  {
    "passage": "What is the primary objective of the opening paragraph in a formal administrative letter?",
    "question": "Select the primary function:",
    "options": [
      "To state the purpose of the letter directly and concisely without personal pleasantries",
      "To enquire about the recipient's family and personal well-being",
      "To describe the author's hobbies and background",
      "To apologize for disturbing the recipient's busy schedule"
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
    "passage": "A student writes a letter to his aunt asking for financial assistance to buy science equipment.",
    "question": "Under which epistolary category does this letter fall?",
    "options": [
      "Informal letter",
      "Formal administrative petition",
      "Semi-formal query",
      "Commercial contract"
    ],
    "answer": "Informal letter",
    "hint": "Letters to family members are informal.",
    "solution": "Correspondence addressed to family members (aunts, uncles, parents, siblings) is categorized as an informal letter, even when requesting assistance.",
    "target": "Epistolary Taxonomy: Familial Correspondence"
  },
  {
    "passage": "Which of the following salutations is strictly prohibited in an informal letter to a school friend?",
    "question": "Identify the prohibited salutation:",
    "options": [
      "Dear Sir,",
      "Dear Kwaku,",
      "Dearest Akosua,",
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
    "solution": "The final paragraph of a petition articulates the 'prayer'—the specific administrative remedy demanded—and expresses polite expectation of prompt action.",
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
    "passage": "A student writes: 'I write to respectfully apply for permission to organize a clean-up campaign.'",
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
    "passage": "Which of the following subscriptions is correctly paired with the salutation 'Dear Dr. Arku,'?",
    "question": "Select the matching subscription:",
    "options": [
      "Yours sincerely,",
      "Yours faithfully,",
      "Yours affectionately,",
      "Your brother,"
    ],
    "answer": "Yours sincerely,",
    "hint": "Salutations using a personal surname mandate 'Yours sincerely,'.",
    "solution": "When the recipient is saluted by surname ('Dear Dr. Arku,'), the subscription must be 'Yours sincerely,'.",
    "target": "Co-occurrence Constraint: Named Salutations"
  },
  {
    "passage": "A student writes: 'We ain't got no water in our dormitory.'",
    "question": "How should this sentence be revised for a formal letter to a headmaster?",
    "options": [
      "Our dormitory currently lacks potable running water.",
      "We don't have no water in the dormitory.",
      "Water is ain't flowing in our dormitory taps.",
      "There is no water nowhere in our dormitory."
    ],
    "answer": "Our dormitory currently lacks potable running water.",
    "hint": "Use formal, elevated vocabulary without double negatives or slang.",
    "solution": "'Our dormitory currently lacks potable running water' replaces colloquial double negatives with precise, elevated formal vocabulary.",
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
    "passage": "A student ends an informal letter with: 'Your's Ever, Kofi'.",
    "question": "What two mechanical errors are present in 'Your's Ever'?",
    "options": [
      "An erroneous apostrophe in 'Yours' and incorrect capitalization of 'Ever'",
      "Misspelling of Kofi and lack of a period",
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
    "passage": "A formal petition is addressed to: 'The Honourable Regional Minister, Ashanti Regional Coordinating Council, Kumasi.'.",
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
      "The Headteacher,\nOpoku Ware School,\nP.O. Box 700,\nKumasi.",
      "The Headteacher\nOpoku Ware School\nP.O. Box 700\nKumasi,",
      "To My Headteacher,\nAt Kumasi School.",
      "Headteacher P.O. Box 700 Kumasi."
    ],
    "answer": "The Headteacher,\nOpoku Ware School,\nP.O. Box 700,\nKumasi.",
    "hint": "Each line ends with a comma, and the final line ends with a period.",
    "solution": "A standard inside address in closed style lists the official title, institution, postal address, and destination town, punctuated with commas and a terminal period.",
    "target": "Formal Architecture: Inside Address Format"
  },
  {
    "passage": "In an informal letter, which of the following is an acceptable conversational opening?",
    "question": "Select the appropriate conversational opening:",
    "options": [
      "It was wonderful to receive your letter last Tuesday.",
      "With reference to your memo of even date.",
      "I acknowledge receipt of your communication.",
      "Pursuant to our previous official discussion."
    ],
    "answer": "It was wonderful to receive your letter last Tuesday.",
    "hint": "Informal letters open with warm, natural conversational language.",
    "solution": "'It was wonderful to receive your letter...' is natural and warm, matching the informal register.",
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
      "Yours faithfully,\n[Signature]\nKwame Mensah\nSenior Prefect",
      "Yours sincerely,\nKwame",
      "Your friend,\nKwame Mensah (Senior Prefect)",
      "Faithfully yours,\n[Signature]"
    ],
    "answer": "Yours faithfully,\n[Signature]\nKwame Mensah\nSenior Prefect",
    "hint": "Official student representation requires subscription, signature, printed name, and designation.",
    "solution": "The full formal sign-off includes subscription, signature, printed full name, and official designation across four distinct vertical lines.",
    "target": "The Quadripartite Sign-off Framework: Prefectorial Sign-off"
  },
  {
    "passage": "A student writes to his aunt: 'I am writing this letter to you because I need some money.'",
    "question": "How can this sentence be made more polite and appropriate for an informal family letter?",
    "options": [
      "I hope you are well. I am writing to humbly ask if you could assist me with funds for my school supplies.",
      "Send me money immediately for my school books.",
      "Give me cash right now because school has reopened.",
      "I demand financial subventions from your office."
    ],
    "answer": "I hope you are well. I am writing to humbly ask if you could assist me with funds for my school supplies.",
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
    "passage": "Which of the following salutations is inappropriate for an informal letter to an elder brother?",
    "question": "Select the inappropriate salutation:",
    "options": [
      "Dear Sir,",
      "Dear Brother Kwame,",
      "Dearest Brother,",
      "Dear Kwame,"
    ],
    "answer": "Dear Sir,",
    "hint": "'Dear Sir,' is an impersonal administrative salutation unsuitable for family.",
    "solution": "'Dear Sir,' creates distant administrative formality that is inappropriate in a letter to an elder sibling.",
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
    "passage": "A formal petition begins with: 'We, the undersigned executive members of the Youth Association...'",
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
      "APPLICATION FOR EMPLOYMENT AS A CLERK.",
      "APPLICATION FOR EMPLOYMENT AS A CLERK",
      "<u>Application for Employment as a Clerk</u>",
      "Application for Employment as a Clerk (underlined)"
    ],
    "answer": "APPLICATION FOR EMPLOYMENT AS A CLERK.",
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
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Informal: Coping with JHS 2 Academic Demands
  {
    id: "B8_S4_F_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Informal Letter",
    title: "Coping with Basic 8 Academic Workload",
    shortSummary: "Write to a cousin explaining the increased academic workload in Basic 8 and how you manage your study time.",
    prompt: "You have noticed that the workload in Basic 8 is significantly heavier than in Basic 7, with new curriculum projects and weekly assessments. Write a letter to your cousin who attends school in Takoradi, describing your daily study schedule, explaining how you handle multiple subject assignments, and asking for advice on preparing for mock examinations.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Academic Exposition, Time Management Narrative & Familial Sibling Rapport",
    learningCompetency: "B8.4.2.1.1: Compose friendly personal letters describing academic challenges, study habits, and personal time management using appropriate informal conventions.",
    hint: "Use single address formatting. Describe your daily study routine realistically. Conclude with an affectionate closing and your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Bethel Junior High School,", "P.O. Box 45,", "Sunyani,", "Bono Region.", "14th October, 2026."],
        allowedDatingFormats: ["14th October, 2026", "14 October 2026"],
        prohibitedDatingFormats: ["14/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Kwesi,",
        permissibleSalutations: ["Dear Kwesi,", "Dearest Kwesi,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his family in Takoradi and introduce the topic of Basic 8 workload.", transitionHints: ["I hope this letter finds you well...", "It has been quite a while since we caught up..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the increased academic demands in Basic 8 (weekly tests, science projects).", transitionHints: ["Basic 8 has proven to be far more demanding than Basic 7...", "Our subject tutors give us extensive homework assignments..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain your practical time management strategies and request his revision tips.", transitionHints: ["To stay on top of my studies, I designed a strict evening timetable...", "How do you manage to revise multiple subjects each week?"] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Send greetings to his parents and ask him to reply promptly.", transitionHints: ["Please extend my warmest greetings to Auntie Ama...", "I look forward to hearing from you soon..."] }
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
      ["Warm opening and academic context established (2 marks)", "Detailed account of Basic 8 workload and study schedule (4 marks)", "Practical time management strategies and advice request (4 marks)"],
      ["Cousin in Takoradi acknowledged", "Workload described clearly", "Time management explained"],
      ["Single address format correctly styled (1 mark)", "Familial salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct address layout", "Consistent punctuation", "First name only at closing"],
      ["Warm, natural conversational tone (4 marks)", "Permissible contractions used naturally (3 marks)", "Varied sentence patterns and academic vocabulary (3 marks)"],
      ["Friendly tone without slang", "Clear transitions", "Good sentence variety"]
    ),
    modelAnswer: "Bethel Junior High School,\nP.O. Box 45,\nSunyani,\nBono Region.\n14th October, 2026.\n\nDear Kwesi,\n\nI hope this letter finds you and your family in good health in Takoradi. It has been two months since we last spoke on the phone, and I am writing to share how I am coping with the rigorous demands of Basic 8.\n\nTo be honest, the step up from Basic 7 has caught many of us by surprise. Our subject teachers give us voluminous homework assignments and weekly continuous assessment tests. In Integrated Science, we are required to submit an independent research portfolio on crop propagation, while our Mathematics tutor assigns thirty challenging algebraic equations every Monday. Balancing these tasks with daily house chores was chaotic during the first few weeks.\n\nTo keep from falling behind, I designed a strict daily study timetable. Immediately after taking my evening bath at 5:00 p.m., I tackle my mathematics exercises while my mind is fresh. After dinner, I spend an hour revising science concepts and making summary notes. I have also joined a weekend study circle with two diligent classmates, where we solve past questions together under timed conditions.\n\nSince you consistently score top grades in your school, I would love to know how you organize your notes ahead of terminal examinations. Do you use flashcards or mind maps?\n\nPlease extend my warmest regards to Uncle Joe and little Ama. Write back soon and share your secrets to academic success.\n\nYour loving cousin,\nKofi",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Informal: Explaining a Science Project to a Friend
  {
    id: "B8_S4_F_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Informal Letter",
    title: "Building a Solar Oven Science Project",
    shortSummary: "Write to a friend describing how your group constructed a functioning solar oven from recycled cardboard.",
    prompt: "For your Basic 8 science practical project, your group constructed a solar oven using cardboard boxes, aluminum foil, and glass. Write a letter to your friend in another school, describing how your group designed and tested the solar cooker, sharing your excitement when it successfully boiled an egg, and explaining the environmental benefits of solar cooking.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Procedural Scientific Description, Enthusiasm in Writing & Informal Register",
    learningCompetency: "B8.4.2.1.1: Compose friendly personal letters describing scientific experiments, practical innovations, and environmental sustainability.",
    hint: "Use single address formatting. Explain the construction steps clearly with sensory words. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Methodist Junior High School,", "P.O. Box 12,", "Koforidua,", "Eastern Region.", "20th October, 2026."],
        allowedDatingFormats: ["20th October, 2026", "20 October 2026"],
        prohibitedDatingFormats: ["20/10/2026"]
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
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his studies and announce your thrilling science project.", transitionHints: ["I hope you are doing wonderfully in school...", "I cannot wait to share our exciting science breakthrough with you!"] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain the construction process using recycled cardboard, black paint, and foil.", transitionHints: ["For our term project, my group decided to build a solar cooker...", "We took two cardboard boxes, lined the inner chamber with crumpled newspaper..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Describe the testing session and the thrill of successfully cooking an egg with sunlight.", transitionHints: ["Last Friday at noon, we placed our prototype in the center of the football field...", "After ninety minutes of intense sunshine, the thermometer read..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Highlight the environmental benefits of solar energy and invite him to try it.", transitionHints: ["This project proved to me that renewable solar energy can replace firewood...", "Write back soon and let me know what you think..."] }
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
      ["Warm opening and project context established (2 marks)", "Clear step-by-step description of solar oven construction (4 marks)", "Testing results and environmental significance explained (4 marks)"],
      ["Friend acknowledged warmly", "Construction steps described clearly", "Environmental value articulated"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Enthusiastic, descriptive, and natural tone (4 marks)", "Natural conversational flow (3 marks)", "Apt scientific vocabulary (3 marks)"],
      ["Lively tone", "Clear chronological progression", "Rich vocabulary"]
    ),
    modelAnswer: "Methodist Junior High School,\nP.O. Box 12,\nKoforidua,\nEastern Region.\n20th October, 2026.\n\nDear Selorm,\n\nI hope you are doing wonderfully and enjoying your Basic 8 classes. I am writing to share the most exciting news about our Integrated Science project: my group built a functioning solar oven out of discarded materials, and it worked like magic!\n\nOur teacher challenged us to design an environmentally friendly cooking device using renewable energy. We collected two cardboard boxes from a grocery store, placing the smaller box inside the larger one and filling the gap with crumpled newspaper for insulation. We painted the interior box matte black to absorb heat and lined the cardboard reflector flaps with shiny aluminum foil to bounce sunlight into the chamber. Finally, we covered the top with a pane of clear glass to trap the radiant heat.\n\nLast Friday at midday, under the scorching sun on our school field, we tested our prototype. We placed a small black metal pot containing an egg and half a cup of water inside the cooker. Within forty minutes, the internal temperature soared to ninety-five degrees Celsius! When we opened the glass lid an hour later, the water was boiling and the egg was completely cooked. Our entire class clapped enthusiastically!\n\nThis simple experiment proved to me that clean solar energy can help rural families cook nutritious meals without chopping down trees for firewood or inhaling toxic charcoal smoke.\n\nYou should definitely try building one with your classmates. Write back soon and tell me about your own school projects.\n\nYour sincere friend,\nKwame",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Semi-Formal: Permission to be Excused from Games for Medical Reasons
  {
    id: "B8_S4_F_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Semi-Formal Letter",
    title: "Exemption from Physical Education on Medical Grounds",
    shortSummary: "Write to your Sports Master requesting exemption from strenuous sports due to an ankle injury.",
    prompt: "You sprained your right ankle during an inter-class football match and your doctor has advised complete rest from strenuous physical activity for three weeks. Write a semi-formal letter to your Sports Master, explaining the nature of your injury, attaching your medical report, and requesting exemption from weekly physical education drills while offering to assist with match recording.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Medical Request, Constructive Role Substitution & Underlined Title Case Caption",
    learningCompetency: "B8.4.2.1.2: Compose semi-formal requests to school staff stating medical justifications, proposing constructive duties, and adhering to respectful conventions.",
    hint: "Salute with 'Dear Mr. [Surname],'. Provide an underlined Title Case caption. Explain your injury respectfully and offer to help off the field. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Presbyterian Junior High School,", "P.O. Box 77,", "Mampong-Akuapem,", "Eastern Region.", "24th October, 2026."],
        allowedDatingFormats: ["24th October, 2026", "24 October 2026"],
        prohibitedDatingFormats: ["24/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Okyere,",
        permissibleSalutations: ["Dear Mr. Okyere,", "Dear Sports Master,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for Temporary Exemption from Physical Education Sessions",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Respectfully state the purpose of your letter and your request for physical education exemption.", transitionHints: ["I write to respectfully seek your permission...", "I am writing to formally request a temporary exemption from..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain how you sustained the sprain and state the doctor's three-week rest directive.", transitionHints: ["During last Thursday's inter-class football match, I landed awkwardly...", "The medical officer at Tetteh Quarshie Memorial Hospital diagnosed a severe sprain and advised..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Offer to assist during PE lessons by taking attendance, keeping scores, or managing equipment.", transitionHints: ["Although I cannot participate in running drills, I am eager to assist...", "I would be delighted to manage the sports equipment and record match scores..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your love for school sports and anticipate his favorable approval.", transitionHints: ["I have attached a copy of my official medical report for your perusal...", "Thank you very much for your understanding and continuous encouragement..."] }
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
      ["Medical exemption request stated clearly (2 marks)", "Circumstances of injury and doctor's directive explained (4 marks)", "Alternative administrative assistance offered with medical proof (4 marks)"],
      ["Exemption dates/timeframe clear", "Injury described honestly", "Scorekeeping assistance offered"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Caption underlined", "Correct subscription", "Full printed name without signature"],
      ["Polite, respectful semi-formal tone (4 marks)", "No informal contractions (3 marks)", "Clear medical and sports vocabulary (3 marks)"],
      ["Courteous phrasing throughout", "Zero slang", "Clear sentence structure"]
    ),
    modelAnswer: "Presbyterian Junior High School,\nP.O. Box 77,\nMampong-Akuapem,\nEastern Region.\n24th October, 2026.\n\nDear Mr. Okyere,\n\nRequest for Temporary Exemption from Physical Education Sessions\n_______________________________________________________________\n\nI write to respectfully seek your kind permission to be temporarily excused from participating in weekly physical education practical drills and afternoon sports training for a duration of three weeks.\n\nDuring our inter-class football match last Thursday, I contested an aerial ball and landed awkwardly on my right foot, severely twisting my ankle. Following an examination at the Tetteh Quarshie Memorial Hospital, the medical officer confirmed a severe ligament sprain and placed my leg in a compressive crepe bandage. He has strictly instructed me to avoid running, jumping, and strenuous physical exertion for the next twenty-one days to allow the damaged tissues to heal completely.\n\nAlthough I am unable to take part in physical exercises, I am eager to contribute productively during our sports periods. I would be delighted to assist you with record-keeping, taking roll-call attendance, distributing training cones, and keeping official scores during class practice matches.\n\nI have attached my official medical clearance certificate from the attending physician for your verification and record. I hope to resume full training as soon as my recovery is complete.\n\nThank you very much for your guidance, patience, and understanding.\n\nYours sincerely,\nEmmanuel Frimpong",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Formal: Application for Student ICT Laboratory Assistant
  {
    id: "B8_S4_F_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Formal Letter",
    title: "Application for Student ICT Lab Assistant",
    shortSummary: "Apply to the Headmaster for the post of Student ICT Laboratory Assistant.",
    prompt: "Your school has refurbished its computer laboratory and is seeking applications from disciplined students to serve as Student ICT Laboratory Assistants. Write a formal letter of application to your Headmaster, highlighting your computer literacy skills, discussing past responsibilities in school, and proposing two ways to safeguard the computers from damage and malware.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Technical Competency Exposition & Quadripartite Close",
    learningCompetency: "B8.4.2.1.2: Compose formal administrative applications demonstrating technical competence, equipment safeguarding measures, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and class designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 8 Secretariat,", "Anglican Junior High School,", "P.O. Box 30,", "Ho,", "Volta Region.", "28th October, 2026."],
        allowedDatingFormats: ["28th October, 2026", "28 October 2026"],
        prohibitedDatingFormats: ["28/10/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Headmaster,",
        officeOrSchoolPlaceholder: "Anglican Junior High School,",
        postalBoxPlaceholder: "P.O. Box 30,",
        townRegionPlaceholder: "Ho, Volta Region.",
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
        modelCaption: "APPLICATION FOR THE POSITION OF STUDENT ICT LABORATORY ASSISTANT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of Student ICT Lab Assistant.", transitionHints: ["I write to formally submit my application for...", "In response to the notice inviting applications for student laboratory assistants..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your computer skills (typing, basic troubleshooting, software navigation).", transitionHints: ["Throughout my studies in Basic 7 and 8, I have developed strong digital literacy...", "I am proficient in word processing, basic operating system navigation, and hardware care..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Propose two practical rules to protect the lab (banning unauthorized flash drives, mandatory dust covers).", transitionHints: ["If appointed, I will introduce two vital safeguarding protocols...", "First, I will enforce a strict ban on unauthorized external USB drives to prevent virus infections..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your discipline and readiness to attend a practical interview.", transitionHints: ["I pledge to discharge my duties with utmost diligence, honesty, and care...", "Thank you very much for considering my application..."] }
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
      ["Application position stated clearly (2 marks)", "Digital literacy and technical troubleshooting skills outlined (4 marks)", "Two computer protection protocols proposed (4 marks)"],
      ["ICT Assistant post clear", "Computer skills demonstrated", "Two safeguarding rules developed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive technical vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: "Basic 8 Secretariat,\nAnglican Junior High School,\nP.O. Box 30,\nHo,\nVolta Region.\n28th October, 2026.\n\nThe Headmaster,\nAnglican Junior High School,\nP.O. Box 30,\nHo, Volta Region.\n\nDear Sir,\n\nAPPLICATION FOR THE POSITION OF STUDENT ICT LABORATORY ASSISTANT\n\nI write to formally submit my application for the post of Student ICT Laboratory Assistant for the 2026/2027 academic session, pursuant to the announcement on student lab positions.\n\nThroughout my junior secondary education, I have demonstrated a strong aptitude for computing and digital literacy. I achieved the highest grade in Computing in Basic 7 and possess practical skills in operating system maintenance, word processing, and basic hardware troubleshooting. In addition, I have consistently shown reliability and trustworthiness as our class homework monitor, ensuring teaching materials are kept in order.\n\nIf appointed to this role, I plan to implement two practical measures to protect our newly refurbished facility. First, I will assist the ICT instructor in enforcing a strict ban on unverified personal USB flash drives, which frequently introduce destructive malware and corrupt system software. Second, I will institute a mandatory end-of-day shutdown routine to ensure that every monitor is powered down and covered with a dust cloth, protecting delicate optical parts from harm.\n\nI pledge to execute my responsibilities with honesty, humility, and careful stewardship of school property.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nChristian Dzidula\nStudent, Basic 8B",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Civic Petition: Refuse Dump Encroaching on School Premises
  {
    id: "B8_S4_F_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Civic Petition",
    title: "Petition on Illegal Refuse Dump near School",
    shortSummary: "Petition the Municipal Chief Executive over an unauthorized communal refuse dump adjacent to the school.",
    prompt: "An unauthorized refuse dump created by market traders right beside your school fence has grown into an unsightly mountain of decomposing waste, breeding flies and producing a stench that disrupts classes. As the President of the School Environmental Club, write a formal petition to your Municipal Chief Executive (MCE), describing the health hazards to students and appealing for the evacuation of the dump and the placement of waste containers.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Petition Architecture, Public Health Evidence & Remedial Prayer",
    learningCompetency: "B8.4.2.1.2: Compose civic petitions to municipal assemblies detailing public health hazards, academic disruptions, and concrete sanitation prayers.",
    hint: "Address to 'The Municipal Chief Executive,'. State the sanitation hazard factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Environmental Club Secretariat,", "St. Paul's Junior High School,", "P.O. Box 88,", "Techiman,", "Bono East Region.", "4th November, 2026."],
        allowedDatingFormats: ["4th November, 2026", "4 November 2026"],
        prohibitedDatingFormats: ["04/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Municipal Chief Executive,",
        officeOrSchoolPlaceholder: "Techiman Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box 1,",
        townRegionPlaceholder: "Techiman, Bono East Region.",
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
        modelCaption: "PETITION FOR THE EVACUATION OF THE ILLEGAL REFUSE DUMP NEAR OUR SCHOOL",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your club's mandate and declare the sanitation grievance clearly.", transitionHints: ["We, the executive committee of the School Environmental Club, respectfully petition...", "I write on behalf of over four hundred students and teachers to draw your urgent attention to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the decomposing refuse pile, foul stench, and health risks (cholera, malaria).", transitionHints: ["Over the past four months, an unauthorized dumping site has emerged...", "The decomposing refuse emits an unbearable stench that forces teachers to close classroom windows..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (evacuation by bulldozers, placement of covered metal skips, sanitation taskforce).", transitionHints: ["We therefore humbly pray that your honorable administration take immediate action...", "First, we appeal for the urgent dispatch of municipal waste trucks to clear..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for swift intervention before an epidemic breaks out.", transitionHints: ["The health of our students and the dignity of our learning environment depend on...", "Thank you very much for your leadership and anticipated prompt intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "President, School Environmental Club",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Environmental club representation established (2 marks)", "Detailed documentation of refuse hazard and health effects (4 marks)", "Clear three-point sanitation prayer presented (4 marks)"],
      ["Club standing established", "Sanitation hazard described vividly", "Evacuation and metal skips requested"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive sanitation vocabulary (3 marks)"],
      ["Civic advocacy language", "Logical problem-evidence-prayer flow", "Precise environmental health vocabulary"]
    ),
    modelAnswer: "Environmental Club Secretariat,\nSt. Paul's Junior High School,\nP.O. Box 88,\nTechiman,\nBono East Region.\n4th November, 2026.\n\nThe Municipal Chief Executive,\nTechiman Municipal Assembly,\nP.O. Box 1,\nTechiman, Bono East Region.\n\nDear Sir,\n\nPETITION FOR THE EVACUATION OF THE ILLEGAL REFUSE DUMP NEAR OUR SCHOOL\n\nI write on behalf of the executive committee of the School Environmental Club and the student body of St. Paul's Junior High School to respectfully petition your high office regarding the dangerous heap of refuse accumulating beside our school wall.\n\nOver the past four months, market traders and nearby residents have turned the open land adjacent to our school fence into an unauthorized dumping ground. The decomposing waste has accumulated into a massive heap that emits a foul, sickening stench throughout the school day. On warm afternoons, the odor is so suffocating that teachers are forced to shut classroom windows, disrupting learning. Furthermore, the dump has become a breeding ground for swarms of houseflies, mosquitoes, and rodents. Several Basic 8 pupils have already been hospitalized with severe cholera and malaria infections.\n\nTo safeguard our health and restore a clean learning environment, we humbly pray that your honorable administration implement three urgent interventions. First, we appeal for the immediate dispatch of municipal bulldozers and waste compactor trucks to evacuate the refuse. Second, we request the placement of two large covered metal waste skips at a designated site away from the school. Finally, we urge the assembly to erect 'No Dumping' signposts and deploy municipal sanitation guards to prosecute violators.\n\nWe trust that your prompt leadership will avert a full-blown public health epidemic.\n\nThank you very much for your service and anticipated cooperation.\n\nYours faithfully,\n[Signature]\nEbenezer Donkor\nPresident, School Environmental Club",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Informal: Account of an Exciting School Drama Competition
  {
    id: "B8_S4_F_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Informal Letter",
    title: "Inter-Schools Drama Competition Triumph",
    shortSummary: "Write to a friend describing your school's winning performance at the regional drama festival.",
    prompt: "Your school drama club recently won first place in the regional schools drama competition with a play about environmental preservation. Write a letter to your former classmate in Kumasi, narrating your role in the stage production, describing the audience's reaction during the climax, and sharing the prizes awarded to the school.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Dramatic Narrative, Stage Performance Description & Friendly Rapport",
    learningCompetency: "B8.4.2.1.1: Compose friendly personal letters narrating artistic performances, stage drama triumphs, and shared cultural celebrations.",
    hint: "Use single address formatting. Narrate the stage action with descriptive theatrical vocabulary. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Grace Memorial Junior High School,", "P.O. Box 50,", "Tarkwa,", "Western Region.", "10th November, 2026."],
        allowedDatingFormats: ["10th November, 2026", "10 November 2026"],
        prohibitedDatingFormats: ["10/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Yaw,",
        permissibleSalutations: ["Dear Yaw,", "Dearest Yaw,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his school in Kumasi and announce the drama championship victory.", transitionHints: ["I hope you are doing great in Kumasi...", "I have some wonderful news that will make you smile!"] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the play's storyline and your personal role as the courageous village chief.", transitionHints: ["Our drama club entered the regional festival with an original play entitled...", "I was cast in the lead role of Nana Kusi, a traditional chief who stood up against..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Narrate the dramatic climax and the audience's standing ovation.", transitionHints: ["During the final scene when my character confronted the illegal miners...", "The entire auditorium went dead silent before erupting into a thunderous standing ovation..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Detail the championship prizes (trophy, books) and ask him to write back.", transitionHints: ["Our school was awarded a glittering golden trophy and a set of library books...", "Write back soon and tell me about your school's extracurricular activities..."] }
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
      ["Warm opening and drama victory context established (2 marks)", "Play storyline and personal stage role described vividly (4 marks)", "Dramatic climax, audience reaction, and awards shared (4 marks)"],
      ["Friend in Kumasi acknowledged", "Play and acting role detailed", "Awards and audience reaction included"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Lively, expressive narrative tone (4 marks)", "Natural conversational phrasing (3 marks)", "Theatrical and descriptive vocabulary (3 marks)"],
      ["Enthusiastic tone", "Smooth narrative flow", "Rich vocabulary"]
    ),
    modelAnswer: "Grace Memorial Junior High School,\nP.O. Box 50,\nTarkwa,\nWestern Region.\n10th November, 2026.\n\nDear Yaw,\n\nI hope this letter finds you well and settled in your new school in Kumasi. We all miss your humor during break time! I am writing to share some thrilling news: our drama club took first place at the Western Regional Schools Drama Festival last weekend!\n\nOur club performed a four-act play titled 'The Cry of the Sacred Forest,' written by our English tutor, Mr. Asante. The story centers on a farming village resisting a greedy mining syndicate that wants to poison their river. I was chosen to play the lead role of Nana Kusi, an honest village elder who unites the community to protect their ancestral lands. Memorizing ten pages of lines while preparing for continuous assessment tests was exhausting, but it was worth every minute.\n\nDuring the climax in Act Four, my character delivers an emotional speech declaring that money cannot purchase clean water or fertile soil. When my voice cracked with emotion, the entire auditorium fell into complete silence. As the stage lights dimmed, the audience of over five hundred people erupted into deafening applause and a standing ovation! The judges awarded our performance ninety-two percent.\n\nOur school took home a magnificent golden trophy, two desktop computers for our library, and certificates of distinction. Our headmaster was so delighted that he treated the entire cast to a feast of fried rice and chicken on Monday.\n\nI wish you were there to watch us perform. Write back soon and let me know how life in Kumasi is treating you.\n\nYour sincere friend,\nBright",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Semi-Formal: Request to Community Leader for Football Pitch Usage
  {
    id: "B8_S4_F_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Semi-Formal Letter",
    title: "Request for Community Football Pitch Access",
    shortSummary: "Write to an Assembly Member requesting permission to use the community football field for school matches.",
    prompt: "Your school's football field has been dug up for municipal pipe-laying, leaving the school team without a training venue ahead of the inter-schools soccer gala. Write a semi-formal letter to your local Assembly Member, Hon. Peter Osei, explaining the dilemma, requesting permission to use the community community park on Tuesday and Thursday afternoons, and promising to keep the field clean.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Facility Negotiation, Respectful Civic Deference & Field Maintenance Pledge",
    learningCompetency: "B8.4.2.1.2: Compose semi-formal requests to local civic leaders outlining logistical challenges, proposing training schedules, and pledging environmental care.",
    hint: "Salute with 'Dear Hon. Mr. Osei,' or 'Dear Mr. Osei,'. Provide an underlined Title Case caption. Outline days, training times, and pitch care guarantees. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Sports Committee Secretariat,", "Dormaa Junior High School,", "P.O. Box 14,", "Dormaa Ahenkro,", "Bono Region.", "14th November, 2026."],
        allowedDatingFormats: ["14th November, 2026", "14 November 2026"],
        prohibitedDatingFormats: ["14/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Hon. Mr. Osei,",
        permissibleSalutations: ["Dear Hon. Mr. Osei,", "Dear Mr. Osei,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for Permission to Use the Community Football Pitch",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "State your sports role and declare the pitch booking request clearly.", transitionHints: ["I write in my capacity as Captain of the School Football Team to respectfully request...", "We wish to seek your kind permission to train on the community park ahead of..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain the pipe-laying project that disabled your school pitch.", transitionHints: ["Over the past two weeks, municipal water contractors have excavated trenches across our school field...", "Consequently, our team has been left without a training ground with the inter-schools gala barely three weeks away..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Specify the exact training days (Tuesdays and Thursdays, 3:30 p.m. to 5:00 p.m.) and pledge field maintenance.", transitionHints: ["We humbly request access to the community pitch on Tuesdays and Thursdays from...", "We solemnly guarantee that our players will take great care of the goalposts and pick up all litter..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Express polite appreciation and invite him to watch the team's opening match.", transitionHints: ["We would be deeply honored if you could attend our opening gala match as our guest...", "Thank you very much for your leadership and continuous dedication to youth sports development..."] }
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
      ["Sports captain role and purpose established (2 marks)", "Trench excavation problem and gala urgency explained (4 marks)", "Training days, times, and litter cleanup guaranteed (4 marks)"],
      ["Sports role stated", "Field dilemma articulated clearly", "Schedule and cleanup pledged"],
      ["Single address format (1 mark)", "Honorific surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Caption underlined", "Correct subscription", "Full printed name without signature"],
      ["Respectful, polite civic register (4 marks)", "Zero informal contractions (3 marks)", "Precise sports and negotiation vocabulary (3 marks)"],
      ["Courteous tone", "Logical progression", "Clear sentence structure"]
    ),
    modelAnswer: "Sports Committee Secretariat,\nDormaa Junior High School,\nP.O. Box 14,\nDormaa Ahenkro,\nBono Region.\n14th November, 2026.\n\nDear Hon. Mr. Osei,\n\nRequest for Permission to Use the Community Football Pitch\n________________________________________________________\n\nI write in my capacity as Captain of the Dormaa Junior High School Football Team to respectfully request your permission to utilize the community football park for our afternoon training sessions.\n\nOver the past two weeks, municipal water contractors have excavated deep pipeline trenches across our school football field as part of the regional water expansion project. As a result, our pitch has been rendered completely unusable. With the annual Municipal Inter-Schools Soccer Championship scheduled to kick off in three weeks, our twenty-two-member squad is stranded without a suitable venue to practice tactical drills and fitness routines.\n\nWe humbly appeal to your kind office to permit us to train on the community park on Tuesday and Thursday afternoons, from 3:30 p.m. to 5:00 p.m., beginning on Tuesday, 17th November, 2026. We solemnly assure you that our players and physical education tutor will treat the community facility with great respect. We pledge to safeguard the goal nets and conduct a thorough cleanup of the grounds after every training session to ensure no plastic sachets are left behind.\n\nWe would be honored if you could attend our opening championship match as our Special Guest of Honor.\n\nThank you very much for your leadership and continuous support of community youth development.\n\nYours sincerely,\nJustice Mensah",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Formal: Application for Student Sanitation Inspector
  {
    id: "B8_S4_F_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Formal Letter",
    title: "Application for School Health & Sanitation Inspector",
    shortSummary: "Apply to the Senior Housemaster to serve as an Assistant School Sanitation Inspector.",
    prompt: "The school administration is appointing junior pupils to serve on the School Sanitation and Health Inspection Taskforce. Write a formal letter of application to your Senior Housemaster, applying for the position of Assistant Student Sanitation Inspector. Highlight your personal hygiene habits, analyze common littering spots on the compound, and propose two practical strategies to keep classrooms tidy.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Sanitation Problem Analysis & Quadripartite Close",
    learningCompetency: "B8.4.2.1.2: Compose formal administrative applications demonstrating leadership responsibility, compound sanitation proposals, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 8 Stream A,", "St. John's Junior High School,", "P.O. Box 25,", "Sekondi,", "Western Region.", "18th November, 2026."],
        allowedDatingFormats: ["18th November, 2026", "18 November 2026"],
        prohibitedDatingFormats: ["18/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Senior Housemaster,",
        officeOrSchoolPlaceholder: "St. John's Junior High School,",
        postalBoxPlaceholder: "P.O. Box 25,",
        townRegionPlaceholder: "Sekondi, Western Region.",
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
        modelCaption: "APPLICATION FOR THE POSITION OF ASSISTANT SANITATION INSPECTOR",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of Assistant Sanitation Inspector.", transitionHints: ["I write to formally apply for the position of...", "In response to the notice announcing appointments to the School Sanitation Taskforce..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your personal cleanliness, punctuality, and past hygiene responsibilities.", transitionHints: ["Throughout my junior secondary schooling, I have maintained an unblemished record of...", "As an active member of our health club, I have consistently advocated for..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Analyze problem areas (canteen sachet waste, unwashed gutters) and propose two practical strategies.", transitionHints: ["Currently, the areas behind the school canteen and sports pavilion experience heavy littering...", "To eliminate this problem, I propose two practical interventions: first, introducing designated trash monitors..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge commitment to school hygiene and readiness for an interview.", transitionHints: ["I pledge to discharge my duties with fairness, diligence, and firmness...", "Thank you very much for considering my application..."] }
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
      ["Application position stated clearly (2 marks)", "Personal discipline and sanitation habits demonstrated (4 marks)", "Two actionable waste reduction strategies proposed (4 marks)"],
      ["Inspector post clear", "Cleanliness habits shown", "Two sanitation strategies detailed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive environmental vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: "Basic 8 Stream A,\nSt. John's Junior High School,\nP.O. Box 25,\nSekondi,\nWestern Region.\n18th November, 2026.\n\nThe Senior Housemaster,\nSt. John's Junior High School,\nP.O. Box 25,\nSekondi, Western Region.\n\nDear Sir,\n\nAPPLICATION FOR THE POSITION OF ASSISTANT SANITATION INSPECTOR\n\nI write to formally submit my application for the appointment of Assistant Student Sanitation Inspector for the 2026/2027 academic session, in response to the circular from your office.\n\nI am deeply passionate about environmental hygiene and personal cleanliness. Throughout my time in Basic 7 and Basic 8, I have maintained an immaculate record of personal neatness and punctuality. During our weekly compound cleaning exercises, I frequently volunteer to supervise classroom sweeping and ensure that waste bins are emptied promptly before morning assembly. My peers know me as a fair, approachable, yet principled student who does not tolerate littering.\n\nIf appointed to the taskforce, I intend to implement two practical solutions to resolve our school's waste challenges. First, I will establish a 'Classroom Cleanliness Honor Roll' where classrooms that keep their verandas free from wrappers receive a commendation flag during Monday assembly. Second, I will organize the placement of separate bins for plastic water sachets near the canteen, allowing the school to partner with local recycling depots to earn extra revenue for sports equipment.\n\nI pledge to discharge my inspection duties with impartiality, dedication, and firm commitment to our school's motto.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nPatrick Appiah\nStudent, Basic 8A",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Civic Petition: Repair of Broken Culvert Blocking Access to School
  {
    id: "B8_S4_F_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Civic Petition",
    title: "Petition on Collapsed Stream Culvert near School",
    shortSummary: "Petition the District Chief Executive over a collapsed culvert that floods the primary access road to school.",
    prompt: "A concrete culvert bridging a seasonal stream along the main road leading to your school has caved in, causing torrential floods that prevent pupils from crossing to attend classes whenever it rains. As the Secretary of the School Civic Club, write a formal petition to your District Chief Executive (DCE), describing the dangers children face wading through swift floodwaters and appealing for the urgent reconstruction of the culvert.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Petition Architecture, Flood Hazard Analysis & Engineering Prayer",
    learningCompetency: "B8.4.2.1.2: Compose civic petitions to local assemblies detailing infrastructural failures, student safety hazards, and structured engineering prayers.",
    hint: "Address to 'The District Chief Executive,'. State the culvert collapse factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Civic Club Secretariat,", "St. Theresa's Junior High School,", "P.O. Box 10,", "Nkawie,", "Ashanti Region.", "22nd November, 2026."],
        allowedDatingFormats: ["22nd November, 2026", "22 November 2026"],
        prohibitedDatingFormats: ["22/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The District Chief Executive,",
        officeOrSchoolPlaceholder: "Atwima Nwabiagya Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box 1,",
        townRegionPlaceholder: "Nkawie, Ashanti Region.",
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
        modelCaption: "PETITION FOR THE URGENT RECONSTRUCTION OF THE COLLAPSED STREAM CULVERT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your club's representational mandate and state the culvert collapse grievance.", transitionHints: ["We, the executive committee of the School Civic Club, respectfully petition...", "I write on behalf of over five hundred pupils and teachers of St. Theresa's to draw your urgent attention to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the collapsed concrete culvert, dangerous flash flooding, and student absenteeism.", transitionHints: ["Three weeks ago, heavy downpours washed away the retaining pillars of the concrete culvert...", "Whenever it rains, the stream overflows its banks, forcing young children to wade through swift, dangerous currents..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (dispatch of municipal engineers, temporary pedestrian footbridge, reinforced culvert reconstruction).", transitionHints: ["We therefore humbly pray that your honorable administration take immediate remedial action...", "First, we appeal for the immediate construction of a temporary wooden footbridge to allow safe crossing..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent intervention to avert drowning accidents during the rainy season.", transitionHints: ["Our pupils' lives are in grave danger each morning...", "Thank you very much for your leadership and anticipated decisive action..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Secretary, School Civic Club",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Civic club mandate established (2 marks)", "Dangerous flood conditions and pupil risks documented (4 marks)", "Clear three-point engineering and safety prayer presented (4 marks)"],
      ["Club standing established", "Drowning hazards described clearly", "Temporary bridge and reconstruction requested"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive safety and civil engineering vocabulary (3 marks)"],
      ["Civic language", "Logical problem-evidence-prayer flow", "Precise flood and road terms"]
    ),
    modelAnswer: "Civic Club Secretariat,\nSt. Theresa's Junior High School,\nP.O. Box 10,\nNkawie,\nAshanti Region.\n22nd November, 2026.\n\nThe District Chief Executive,\nAtwima Nwabiagya Municipal Assembly,\nP.O. Box 1,\nNkawie, Ashanti Region.\n\nDear Sir,\n\nPETITION FOR THE URGENT RECONSTRUCTION OF THE COLLAPSED STREAM CULVERT\n\nI write on behalf of the executive committee of the School Civic Club and the entire student population of St. Theresa's Junior High School to respectfully submit this urgent petition regarding the collapsed concrete culvert on the Nkawie-Toase access road.\n\nThree weeks ago, a severe rainstorm weakened the foundation pillars of the culvert bridging the Subin stream, causing the entire concrete slab to collapse into the water. As a consequence, the primary access road connecting three residential suburbs to our school has been cut off. Whenever torrential rains fall, the stream swells into a dangerous torrent, submerging the roadway. Last Tuesday, two primary school pupils were nearly swept away while attempting to wade through the waist-deep current, saved only by the heroic efforts of nearby farmers. Over two hundred pupils have been forced to stay home on rainy days.\n\nTo prevent a tragic drowning incident and restore school attendance, we humbly pray that your honorable administration execute three critical interventions. First, we appeal for the immediate installation of a temporary wooden footbridge with safety handrails to allow pupils to cross safely. Second, we request the deployment of municipal engineers to construct a wider, reinforced concrete box culvert. Finally, we urge the assembly to dredge the stream bed to improve drainage.\n\nOur children's safety must not be compromised.\n\nThank you very much for your leadership and anticipated prompt intervention.\n\nYours faithfully,\n[Signature]\nCynthia Boateng\nSecretary, School Civic Club",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Formal Letter to Editor: Combating Plastic Pollution in Urban Markets
  {
    id: "B8_S4_F_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B8",
    difficulty: "foundation",
    category: "Formal Letter",
    title: "Tackling Plastic Waste in Urban Markets",
    shortSummary: "Write to the Editor of a national newspaper on single-use plastic waste choking city drainage systems.",
    prompt: "Single-use plastic water sachets and shopping bags are clogging concrete storm gutters in urban markets, triggering severe flash floods and malaria outbreaks whenever rain falls. Write a letter to the Editor of a national daily newspaper, highlighting the environmental hazards of plastic waste, criticizing indiscriminate disposal habits, and proposing two practical solutions involving community recycling and municipal bylaws.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Letter to the Press Architecture, Environmental Civic Advocacy & Statutory Valediction",
    learningCompetency: "B8.4.2.1.2: Compose formal letters to national newspaper editors analyzing urban environmental challenges and recommending municipal policy reforms.",
    hint: "Address to 'The Editor, Daily Graphic,'. Include an un-underlined BLOCK CAPITAL heading. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', your signature, full name, and your residential town.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Youth Environmental Watch,", "P.O. Box 115,", "Bantama-Kumasi,", "Ashanti Region.", "26th November, 2026."],
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
        modelCaption: "CURBING THE MENACE OF PLASTIC WASTE AND URBAN DRAINAGE CLOGGING",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Request editorial space and state the plastic waste issue directly.", transitionHints: ["Permit me space in your widely read national newspaper to voice...", "I write to draw public attention to the devastating environmental hazards caused by..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Analyze how discarded water sachets and carrier bags choke concrete drains, causing flash floods.", transitionHints: ["It is distressing to observe that tons of single-use plastic waste are dumped into open drains...", "During downpours, these non-biodegradable plastics form impenetrable barriers that cause floodwaters to..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Propose two practical solutions (assembly sanitation bylaws with spot fines, commercial buy-back recycling schemes).", transitionHints: ["To eliminate this chronic menace, municipal assemblies must adopt two decisive measures...", "First, local assemblies should strictly enforce anti-littering bylaws by imposing spot fines..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Urge citizens to adopt civic responsibility to protect the environment.", transitionHints: ["A cleaner environment begins with individual discipline...", "I hope this appeal galvanizes municipal leaders and citizens to take action..."] }
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
      ["Editorial space requested and issue announced clearly (2 marks)", "Detailed analysis of clogged storm drains and flooding hazards (4 marks)", "Two actionable regulatory and recycling solutions proposed (4 marks)"],
      ["Editorial space requested", "Drain clogging and flooding explained", "Recycling and fines suggested"],
      ["Two addresses correctly positioned (1 mark)", "Salutation 'Dear Sir,' (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Sign-off with signature, name, and town (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Sign-off includes town"],
      ["Formal, articulate civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental vocabulary (3 marks)"],
      ["Elevated civic lexis", "Effective paragraph links", "Varied sentence patterns"]
    ),
    modelAnswer: "Youth Environmental Watch,\nP.O. Box 115,\nBantama-Kumasi,\nAshanti Region.\n26th November, 2026.\n\nThe Editor,\nDaily Graphic,\nP.O. Box 742,\nAccra.\n\nDear Sir,\n\nCURBING THE MENACE OF PLASTIC WASTE AND URBAN DRAINAGE CLOGGING\n\nPermit me a space in your widely read national daily newspaper to express my deep concern over the alarming accumulation of single-use plastic waste in our urban commercial centers and residential neighborhoods.\n\nIt is heartbreaking to witness how discarded water sachets and polythene carrier bags have choked concrete storm gutters throughout our cities. Because plastics are non-biodegradable, they accumulate in drainage channels, forming impenetrable dams. Whenever torrential rain falls, floodwaters have nowhere to go and submerge roads, shops, and homes. Furthermore, the stagnant pools created by blocked drains serve as fertile breeding habitats for mosquitoes, fueling perennial outbreaks of malaria and cholera among children.\n\nTo tackle this growing crisis, I propose two urgent interventions. First, municipal assemblies must pass and strictly enforce anti-littering bylaws that impose spot fines on individuals and market traders caught throwing plastic waste onto streets or into gutters. Second, the government should introduce economic incentives for plastic collection by partnering with private recycling firms to establish buy-back centers in commercial markets, allowing citizens to trade segregated plastic bags for cash.\n\nClean drainage systems are essential for public health and urban safety. We must take collective responsibility before another disaster strikes.\n\nYours faithfully,\n[Signature]\nPrince Boamah\nBantama-Kumasi",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
export async function deployStrand4B8FoundationClean() {
  console.log("Building clean 60-item Strand 4 B8 Foundation Practice Lab...");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective, Shuffled Options)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory, Flippable Prompts)");

  const db = await getFirestoreDb();
  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // 1. Build Section A (Questions 1 to 50: Objective Multiple-Choice with Shuffled Options)
  rawObjective50Data.forEach((item, index) => {
    const qNum = index + 1;
    const shuffledOptions = shuffleArray<string>(item.options);

    all60Items.push({
      id: `B8_S4_F_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B8",
      difficulty: "foundation",
      category: "Epistolary Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n\"${item.passage}\"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: shuffledOptions,
      correctAnswer: item.answer, // Matches exact string value regardless of randomized position
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B8.4.2.1: Demonstrate foundation mastery of epistolary formatting, address architecture, dating laws, salutation/close pairings, and caption rules."
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
    difficulty: "foundation",
    title: "Basic 8 Foundation Writing Lab: 50 Objective Drills + 10 Theory Writing Tasks",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B8_foundation`
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

  console.log(`\n✅ SUCCESS: Deployed exactly ${all60Items.length} items to practice labs & pools!`);
}

deployStrand4B8FoundationClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B8 Foundation Clean 60 Lab:", err);
    process.exit(1);
  });

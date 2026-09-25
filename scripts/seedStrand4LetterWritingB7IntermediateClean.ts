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
  level: "B7";
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
        "Consistent subject-verb concord",
        "Proper sequence of tenses",
        "Zero contraction slips in formal letters and petitions"
      ]
    }
  }
});

const rawObjective50Data = [
  {
    "passage": "A candidate begins an informal letter with: 'Dear Friend Kofi,'.",
    "question": "What is the most natural and standard informal salutation?",
    "options": [
      "Dear Kofi,",
      "Dear Friend Kofi,",
      "Dear Sir Kofi,",
      "Dear Mr. Kofi,"
    ],
    "answer": "Dear Kofi,",
    "hint": "Informal letters to peers standardly use 'Dear' followed directly by the first name.",
    "solution": "The tautological phrase 'Dear Friend Kofi' is unidiomatic in standard English. 'Dear Kofi,' is the natural standard greeting.",
    "target": "Informal Salutation Conventions"
  },
  {
    "passage": "In a formal letter, a student writes: 'I am writing this letter to notify you that...'",
    "question": "How can this sentence be made more concise and professionally direct?",
    "options": [
      "I write to respectfully notify you that...",
      "I am writing this letter to notify you that...",
      "This letter is written by me to notify you...",
      "I take my pen to write and notify you that..."
    ],
    "answer": "I write to respectfully notify you that...",
    "hint": "Avoid tautologies like 'I am writing this letter'. State the purpose directly.",
    "solution": "In formal correspondence, phrases like 'I am writing this letter' or 'I take my pen' are redundant fluff. 'I write to notify you that...' is concise and professional.",
    "target": "Formal Preamble Conciseness"
  },
  {
    "passage": "A student formats the inside address with a mixture of open and closed punctuation across different lines.",
    "question": "Under WAEC marking rubrics, how is this penalized?",
    "options": [
      "As a mechanical accuracy penalty for punctuation inconsistency",
      "It is awarded full marks as modern styling",
      "As a content error",
      "It cancels the entire composition"
    ],
    "answer": "As a mechanical accuracy penalty for punctuation inconsistency",
    "hint": "Candidates must choose either open or closed punctuation and apply it consistently throughout.",
    "solution": "Mixing open punctuation (no line-end marks) with closed punctuation (commas and periods) creates punctuation inconsistency penalized under Mechanical Accuracy.",
    "target": "Punctuation Regime Consistency"
  },
  {
    "passage": "A candidate writes the caption of a petition in Title Case: <u>Petition Concerning Poor Sanitation In Our Market</u>.",
    "question": "What minor word capitalization error exists in this heading?",
    "options": [
      "The preposition 'In' should be in lowercase ('in')",
      "The noun 'Market' should be lowercase",
      "The word 'Sanitation' should be lowercase",
      "The word 'Petition' should be lowercase"
    ],
    "answer": "The preposition 'In' should be in lowercase ('in')",
    "hint": "In Title Case, short prepositions like 'in', 'on', and 'at' remain in lowercase.",
    "solution": "In Title Case headings, short prepositions (under four letters) such as 'in', 'on', 'at', and 'to' must be written in lowercase unless they begin the heading.",
    "target": "Title Case Preposition Rules"
  },
  {
    "passage": "A student writes a letter to a school patron named Dr. Osei and signs off with: 'Yours faithfully, \\n Kwame Mensah'.",
    "question": "Why is 'Yours faithfully,' incorrect here?",
    "options": [
      "Because the recipient was addressed by name/title ('Dear Dr. Osei,'), which mandates 'Yours sincerely,'",
      "Because students must never write to patrons",
      "Because 'faithfully' must be spelled in capital letters",
      "Because a signature was omitted"
    ],
    "answer": "Because the recipient was addressed by name/title ('Dear Dr. Osei,'), which mandates 'Yours sincerely,'",
    "hint": "Named salutations mandate 'Yours sincerely,'.",
    "solution": "The co-occurrence constraint strictly dictates that whenever a specific name or surname is used in the salutation ('Dear Dr. Osei,'), the subscription must be 'Yours sincerely,'.",
    "target": "Co-occurrence Constraint: Named Addressees"
  },
  {
    "passage": "In a formal letter, which of the following represents the correct order of elements in the quadripartite sign-off?",
    "question": "Select the correct vertical sequence:",
    "options": [
      "Subscription -> Signature -> Printed Full Name -> Official Designation",
      "Signature -> Subscription -> Designation -> Printed Name",
      "Printed Name -> Signature -> Subscription -> Designation",
      "Subscription -> Printed Name -> Signature -> Designation"
    ],
    "answer": "Subscription -> Signature -> Printed Full Name -> Official Designation",
    "hint": "The subscription comes first, followed by the physical signature, the printed name, and the title.",
    "solution": "The standard quadripartite sign-off is vertically ordered: (1) Subscription ('Yours faithfully,'), (2) Handwritten signature, (3) Printed full name, (4) Designation.",
    "target": "Quadripartite Structural Ordering"
  },
  {
    "passage": "A pupil ends a letter to a pen pal with: 'I shall stop here for now because pen has fallen from my hand.'",
    "question": "What is wrong with this traditional closing formula?",
    "options": [
      "It is an outdated, hackneyed cliché that degrades the Expression score",
      "It is grammatically correct and highly recommended",
      "It is required in all WAEC informal letters",
      "It demonstrates rich creative imagination"
    ],
    "answer": "It is an outdated, hackneyed cliché that degrades the Expression score",
    "hint": "Clichés like 'pen has fallen' or 'ink is finished' are penalized as poor expression.",
    "solution": "Stock clichés such as 'my pen is leaking' or 'I will drop my pen here' are severely penalized under Expression. Closings should be meaningful and natural.",
    "target": "Expression: Cliché Eradication"
  },
  {
    "passage": "Which of the following addresses displays an illegal numerical date format?",
    "question": "Identify the incorrect address line:",
    "options": [
      "P.O. Box 12, \\n Kumasi. \\n 14/05/2026",
      "P.O. Box 12, \\n Kumasi. \\n 14th May, 2026.",
      "P.O. Box 12 \\n Kumasi \\n 14 May 2026",
      "P.O. Box 12, \\n Kumasi. \\n May 14, 2026."
    ],
    "answer": "P.O. Box 12, \\n Kumasi. \\n 14/05/2026",
    "hint": "Numerical slashes in dates are prohibited.",
    "solution": "Writing the date as '14/05/2026' is an orthographic violation in Ghanaian epistolary standards. The month must be spelled in full words.",
    "target": "Dating Orthography"
  },
  {
    "passage": "A letter of complaint to the Municipal Environmental Health Officer requires what register?",
    "question": "Select the appropriate register:",
    "options": [
      "Impersonal, objective, and formally dignified",
      "Warm, emotional, and chatty",
      "Humorous and sarcastic",
      "Colloquial with local slang"
    ],
    "answer": "Impersonal, objective, and formally dignified",
    "hint": "Letters to administrative regulatory bodies demand an objective formal register.",
    "solution": "Administrative complaints must remain objective, factual, and dignified, avoiding emotional outbursts or colloquial language.",
    "target": "Administrative Letter Registers"
  },
  {
    "passage": "Which of the following salutations is correctly punctuated for a letter to an unmarried female teacher whose surname is Mensah?",
    "question": "Select the correct semi-formal salutation:",
    "options": [
      "Dear Ms. Mensah,",
      "Dear Miss. Mensah,",
      "Dear Mrs Mensah,",
      "Dear Lady Mensah,"
    ],
    "answer": "Dear Ms. Mensah,",
    "hint": "'Ms.' is punctuated with a period before the comma, while 'Miss' is a complete word without a period.",
    "solution": "'Ms.' is the standard polite title, followed by the surname and a comma: 'Dear Ms. Mensah,'. Note that 'Miss' is not an abbreviation and never takes an internal period.",
    "target": "Salutation Honorific Mechanics"
  },
  {
    "passage": "In a formal letter, a student writes the caption: <u>APPLICATION FOR EMPLOYMENT AS A MESSENGER</u>.",
    "question": "What is the primary layout error?",
    "options": [
      "Underlining a heading written in full block capital letters",
      "Using capital letters for the heading",
      "Failing to end the heading with a full stop",
      "Placing the heading after the salutation"
    ],
    "answer": "Underlining a heading written in full block capital letters",
    "hint": "Headings in all-caps must never be underlined.",
    "solution": "A caption rendered in ALL CAPITAL LETTERS must not be underlined. Underlining is reserved exclusively for Title Case headings.",
    "target": "Caption Typography Rules"
  },
  {
    "passage": "A student writes a formal petition to the Regional Director of Health regarding hospital delays.",
    "question": "What should appear in the opening paragraph?",
    "options": [
      "A clear statement of purpose and representation without personal health enquiries",
      "Inquiries about how the director's children are performing in school",
      "A complaint about the hot weather",
      "An apology for taking up the director's valuable time"
    ],
    "answer": "A clear statement of purpose and representation without personal health enquiries",
    "hint": "Formal petitions begin with a direct statement of representation and intent.",
    "solution": "The opening paragraph of a formal petition must establish the identity of the petitioner and state the core grievance directly.",
    "target": "Petition Preamble Standards"
  },
  {
    "passage": "Which of the following subscriptions contains an apostrophe error?",
    "question": "Identify the ungrammatical subscription:",
    "options": [
      "Your's faithfully,",
      "Yours faithfully,",
      "Yours sincerely,",
      "Your affectionate son,"
    ],
    "answer": "Your's faithfully,",
    "hint": "Possessive pronouns like 'Yours' never take an apostrophe.",
    "solution": "The possessive pronoun 'Yours' has no apostrophe. 'Your's' is an error penalized under Mechanical Accuracy.",
    "target": "Subscription Mechanics: Apostrophe Ban"
  },
  {
    "passage": "A candidate indents every paragraph in the body by one inch but formats the address in blocked style.",
    "question": "How is this layout discrepancy evaluated?",
    "options": [
      "As a stylistic mixture that should be harmonized (either pure blocked or pure indented)",
      "It is mandatory to mix styles",
      "It is awarded extra marks for creativity",
      "It is only permitted in informal letters"
    ],
    "answer": "As a stylistic mixture that should be harmonized (either pure blocked or pure indented)",
    "hint": "Layout conventions should be uniform throughout the document.",
    "solution": "Standard epistolary conventions recommend consistency: pure blocked layouts use block paragraphs (separated by blank lines), while indented layouts use indented paragraphs.",
    "target": "Layout Harmony & Consistency"
  },
  {
    "passage": "When writing an informal letter to a cousin, which of the following is fully acceptable?",
    "question": "Select the permissible linguistic feature:",
    "options": [
      "Natural auxiliary verb contractions (e.g., 'I\\'ve', 'didn\\'t')",
      "Vulgar street slang and profanity",
      "Texting shortcuts like 'u' and 'gr8'",
      "Writing the entire letter in capital letters"
    ],
    "answer": "Natural auxiliary verb contractions (e.g., 'I\\'ve', 'didn\\'t')",
    "hint": "Informal letters welcome natural contractions, but text-message abbreviations are penalized.",
    "solution": "Standard informal letters naturally incorporate conversational contractions ('I\\'ve', 'we\\'ll', 'didn\\'t'), while text shortcuts and slang remain prohibited.",
    "target": "Informal Contraction Permissibility"
  },
  {
    "passage": "A letter addressed to 'The Municipal Chief Executive, Tema Metropolitan Assembly' is classified as:",
    "question": "Select the correct epistolary classification:",
    "options": [
      "A formal administrative letter or civic petition",
      "A semi-formal note",
      "An informal friendly letter",
      "A literary narrative essay"
    ],
    "answer": "A formal administrative letter or civic petition",
    "hint": "Correspondence to local government leaders follows formal administrative protocols.",
    "solution": "Letters addressed to metropolitan or municipal chief executives are formal administrative letters or civic petitions requiring two addresses and an objective register.",
    "target": "Epistolary Taxonomy: Civic Correspondence"
  },
  {
    "passage": "Where is the inside recipient address placed in a formal letter?",
    "question": "Select the correct location:",
    "options": [
      "On the left-hand margin, below the level of the sender's date line",
      "At the top right corner above the sender's address",
      "At the very bottom of the page beneath the signature",
      "Directly centered above the caption"
    ],
    "answer": "On the left-hand margin, below the level of the sender's date line",
    "hint": "The recipient address begins on the left margin, below the sender's date.",
    "solution": "In two-address formal correspondence, the recipient's inside address begins on the left margin, positioned one or two lines below the sender's date line.",
    "target": "Formal Architecture: Inside Address Positioning"
  },
  {
    "passage": "A student writes a formal letter and spells the subscription as: 'Yours Faithfully,'.",
    "question": "What is the mechanical defect in this closing?",
    "options": [
      "The letter 'F' in 'Faithfully' must be in lowercase ('faithfully')",
      "The word 'Yours' must be in lowercase",
      "The comma should be omitted",
      "The subscription must be written on the right margin"
    ],
    "answer": "The letter 'F' in 'Faithfully' must be in lowercase ('faithfully')",
    "hint": "Only the initial letter of the opening word is capitalized in a subscription.",
    "solution": "In standard epistolary mechanics, only the initial letter of the subscription is capitalized: 'Yours faithfully,'. Capitalizing 'Faithfully' is an error.",
    "target": "Subscription Orthography"
  },
  {
    "passage": "Which of the following captions is formatted completely without error?",
    "question": "Identify the correctly formatted caption:",
    "options": [
      "REQUEST FOR PERMISSION TO ORGANIZE A SCIENCE EXHIBITION",
      "<u>REQUEST FOR PERMISSION TO ORGANIZE A SCIENCE EXHIBITION</u>",
      "Request For Permission To Organize A Science Exhibition",
      "REQUEST FOR PERMISSION TO ORGANIZE A SCIENCE EXHIBITION."
    ],
    "answer": "REQUEST FOR PERMISSION TO ORGANIZE A SCIENCE EXHIBITION",
    "hint": "All-caps headings must have no underline and no trailing period.",
    "solution": "A caption written in ALL BLOCK CAPITALS must not be underlined and must never end with a period. Option A satisfies all criteria.",
    "target": "Caption Formatting Master Rule"
  },
  {
    "passage": "A pupil ends a letter to a school principal with: 'Your affectionate friend, \\n Kwame'.",
    "question": "What is the major error in this sign-off?",
    "options": [
      "Severe register clash: using an intimate informal subscription for an administrative superior",
      "Omitting the student's date of birth",
      "Writing in ink instead of pencil",
      "Placing the sign-off on the left"
    ],
    "answer": "Severe register clash: using an intimate informal subscription for an administrative superior",
    "hint": "Students must maintain formal distance when writing to school heads.",
    "solution": "Using 'Your affectionate friend' for a school headmaster is a severe register clash. Formal letters mandate 'Yours faithfully,' with a complete signature.",
    "target": "Epistolary Register Traps"
  },
  {
    "passage": "What is the standard word count target for a BECE / Basic 7 composition paper?",
    "question": "Select the required length:",
    "options": [
      "Approximately 250 words",
      "Exactly 50 words",
      "Over 1,000 words",
      "No word limit applies"
    ],
    "answer": "Approximately 250 words",
    "hint": "WAEC Paper 2 compositions expect a developed essay of about 250 words.",
    "solution": "The standard WAEC/BECE syllabus prescribes a target length of approximately 250 words for junior high school compositions.",
    "target": "Curriculum Specification: Essay Volume"
  },
  {
    "passage": "In a formal letter, which of the following is considered an acceptable transition between argument paragraphs?",
    "question": "Choose the best formal transitional linker:",
    "options": [
      "Furthermore, the absence of streetlights has increased nocturnal theft.",
      "By the way, did I tell you about the streetlights?",
      "Another gist is that the streetlights are bad.",
      "Well, let me talk about the lights now."
    ],
    "answer": "Furthermore, the absence of streetlights has increased nocturnal theft.",
    "hint": "Use formal conjunctive adverbs like 'Furthermore', 'Moreover', or 'In addition'.",
    "solution": "'Furthermore' is a formal transitional adverb that links paragraphs smoothly and objectively.",
    "target": "Formal Transitional Devices"
  },
  {
    "passage": "A student writes an informal letter to his elder brother asking for school fees.",
    "question": "What is the appropriate tone for this letter?",
    "options": [
      "Affectionate, respectful, and sincere",
      "Aggressive and demanding",
      "Cold and bureaucratic",
      "Sarcastic and humorous"
    ],
    "answer": "Affectionate, respectful, and sincere",
    "hint": "Family letters requesting support must blend personal warmth with deference.",
    "solution": "Writing to an elder sibling for assistance requires an affectionate, respectful tone that honors family hierarchy without bureaucratic coldness.",
    "target": "Familial Register Modulation"
  },
  {
    "passage": "Which of the following constitutes an error in a closed punctuation address block?",
    "question": "Identify the punctuation mistake:",
    "options": [
      "Ending the last line of the address with a comma instead of a period",
      "Putting a comma after the post office box number",
      "Putting a comma after the town name",
      "Ending the date line with a period"
    ],
    "answer": "Ending the last line of the address with a comma instead of a period",
    "hint": "The final line of a closed address must terminate with a full stop.",
    "solution": "In closed punctuation, intermediate lines end with commas, but the terminal line must end with a full stop (period).",
    "target": "Address Architecture: Closed Punctuation"
  },
  {
    "passage": "What does the term 'format contamination' mean in epistolary writing?",
    "question": "Define format contamination:",
    "options": [
      "Mixing structural conventions of one letter type into another (e.g., adding an inside address to an informal letter)",
      "Writing in blue ink instead of black",
      "Using a ruler to draw margins",
      "Spelling the recipient's name incorrectly"
    ],
    "answer": "Mixing structural conventions of one letter type into another (e.g., adding an inside address to an informal letter)",
    "hint": "Occurs when features of formal and informal formats are inappropriately blended.",
    "solution": "Format contamination occurs when conventions of formal correspondence (e.g., inside addresses, captions, formal sign-offs) are erroneously applied to informal letters, or vice versa.",
    "target": "Format Contamination Principles"
  },
  {
    "passage": "A candidate writing to a newspaper editor addresses the letter to: 'The Editor, Ghanaian Times, P.O. Box 2638, Accra.'",
    "question": "What must be the salutation?",
    "options": [
      "Dear Sir, / Sir,",
      "Dear Editor Kwame,",
      "Hello Sir,",
      "Dear Mr. Editor,"
    ],
    "answer": "Dear Sir, / Sir,",
    "hint": "Letters to the press standardly salute the editor as 'Dear Sir,' or simply 'Sir,'.",
    "solution": "In letters to newspaper editors, standard journalistic convention requires 'Dear Sir,' or 'Sir,'.",
    "target": "Letters to the Editor: Salutation"
  },
  {
    "passage": "Which of the following is NOT an acceptable informal subscription?",
    "question": "Identify the non-informal subscription:",
    "options": [
      "Yours faithfully,",
      "Your sincere friend,",
      "Your loving brother,",
      "Yours affectionately,"
    ],
    "answer": "Yours faithfully,",
    "hint": "'Yours faithfully,' is strictly formal.",
    "solution": "'Yours faithfully,' belongs exclusively to formal correspondence where the recipient is unnamed. It cannot be used in informal letters.",
    "target": "Informal Subscription Restrictions"
  },
  {
    "passage": "In a formal petition, where should the signature be affixed?",
    "question": "Select the correct location for the signature:",
    "options": [
      "Directly between the subscription and the printed full name",
      "At the top right corner next to the date",
      "Inside the body of the first paragraph",
      "At the very bottom below the official designation"
    ],
    "answer": "Directly between the subscription and the printed full name",
    "hint": "The signature occupies the second line of the four-tier formal closing.",
    "solution": "The physical signature mark sits between the subscription ('Yours faithfully,') and the printed name.",
    "target": "Signature Positioning"
  },
  {
    "passage": "A student writes a heading in Title Case: <u>An appeal for the construction of a pedestrian bridge</u>.",
    "question": "What capitalization error is present in this heading?",
    "options": [
      "The noun 'appeal' should be capitalized ('Appeal')",
      "The word 'An' should be lowercase",
      "The word 'bridge' should be lowercase",
      "All words must be lowercase"
    ],
    "answer": "The noun 'appeal' should be capitalized ('Appeal')",
    "hint": "In Title Case, all major lexical words (nouns, verbs, adjectives) must begin with a capital letter.",
    "solution": "In Title Case, major lexical words—including the noun 'appeal'—must be capitalized: 'An Appeal for the Construction of a Pedestrian Bridge'.",
    "target": "Title Case Lexical Capitalization"
  },
  {
    "passage": "Why are slang and colloquial idioms penalized in formal letters?",
    "question": "State the linguistic reason:",
    "options": [
      "Because they violate the objective, dignified register required in institutional communication",
      "Because examiners do not understand modern slang",
      "Because slang words are too short",
      "Because slang takes up too much ink"
    ],
    "answer": "Because they violate the objective, dignified register required in institutional communication",
    "hint": "Institutional communication requires standard grammar and professional vocabulary.",
    "solution": "Formal letters demand standard, elevated English. Slang and colloquialisms undermine institutional objectivity and are penalized under Expression.",
    "target": "Formal Register: Slang Prohibition"
  },
  {
    "passage": "Which of the following expressions is appropriate for opening a semi-formal letter of apology to a teacher?",
    "question": "Select the best opening sentence:",
    "options": [
      "I write to sincerely apologize for my absence from yesterday's remedial class.",
      "I am writing this letter because I didn't come to school.",
      "Sorry for not showing up yesterday, teacher.",
      "You know that yesterday was bad, so I couldn't come."
    ],
    "answer": "I write to sincerely apologize for my absence from yesterday's remedial class.",
    "hint": "Semi-formal apologies must be respectful, direct, and uncontracted.",
    "solution": "'I write to sincerely apologize...' is courteous, dignified, and direct, setting the appropriate semi-formal tone.",
    "target": "Semi-Formal Apology Openings"
  },
  {
    "passage": "A student ends an informal letter with: 'Your brother, \\n Kwame Mensah'.",
    "question": "How should the sign-off be corrected?",
    "options": [
      "Drop the surname 'Mensah' and retain only 'Kwame'",
      "Add a formal signature mark above Kwame",
      "Change 'Your brother' to 'Yours faithfully'",
      "Write 'Kwame' in all-caps"
    ],
    "answer": "Drop the surname 'Mensah' and retain only 'Kwame'",
    "hint": "Informal letters use only the writer's first name.",
    "solution": "Informal letters to family members require a mononymic sign-off (first name only). The surname 'Mensah' must be dropped.",
    "target": "Mononymic Sign-off Rule"
  },
  {
    "passage": "What is the primary function of the second and third paragraphs in an informal letter?",
    "question": "Identify the body paragraphs' function:",
    "options": [
      "To develop the central points of the topic with vivid details and personal reflection",
      "To repeat the sender's address",
      "To enquire about family members again",
      "To list the recipient's faults"
    ],
    "answer": "To develop the central points of the topic with vivid details and personal reflection",
    "hint": "The middle paragraphs carry the core narrative or explanatory content.",
    "solution": "The middle paragraphs form the exposition, where the main ideas, stories, or explanations are elaborated with descriptive depth.",
    "target": "Informal Body Development"
  },
  {
    "passage": "Which of the following dates shows correct comma placement in the American dating variant?",
    "question": "Identify the correctly punctuated date:",
    "options": [
      "May 14, 2026",
      "May, 14 2026",
      "May 14 2026,",
      "May 14, 2026."
    ],
    "answer": "May 14, 2026",
    "hint": "The American format places a comma between the day and the year.",
    "solution": "In the American date format (Month Day, Year), a comma separates the day from the year: 'May 14, 2026'.",
    "target": "Dating Conventions: American Format"
  },
  {
    "passage": "In a formal letter, why is it necessary to state one's designation (e.g., 'Class Prefect') below the printed name?",
    "question": "State the administrative purpose:",
    "options": [
      "To confirm the official capacity or authority under which the letter is written",
      "To prove that the writer attends school",
      "To satisfy the word count requirement",
      "To make the closing look balanced"
    ],
    "answer": "To confirm the official capacity or authority under which the letter is written",
    "hint": "The designation establishes the writer's representational role.",
    "solution": "In administrative correspondence, stating one's designation establishes the official authority or representative capacity of the author.",
    "target": "Formal Sign-off: Designation Role"
  },
  {
    "passage": "A candidate writing an application letter fails to include a caption heading.",
    "question": "How is this omission penalized?",
    "options": [
      "Under Organization for missing a required formal structural feature",
      "Under Mechanical Accuracy only",
      "No penalty is applied if the body is long",
      "Under Expression only"
    ],
    "answer": "Under Organization for missing a required formal structural feature",
    "hint": "Captions are structural requirements in formal letters.",
    "solution": "In WAEC marking schemes, omitting the caption in a formal letter is a structural defect penalizable under Organization.",
    "target": "Scoring Rubrics: Caption Omission"
  },
  {
    "passage": "Which of the following represents an appropriate informal closing remark before the subscription?",
    "question": "Select the best closing remark:",
    "options": [
      "Please give my warmest regards to Auntie Mary and write back soon.",
      "I anticipate your prompt compliance with these statutory directives.",
      "I remain, your humble petitioner.",
      "Forward your responding memorandum without delay."
    ],
    "answer": "Please give my warmest regards to Auntie Mary and write back soon.",
    "hint": "Informal letters close with friendly well-wishes to family members.",
    "solution": "Warm regards to relatives and an invitation to reply form the standard valediction in informal correspondence.",
    "target": "Informal Valediction Conventions"
  },
  {
    "passage": "A formal petition to the Minister of Education includes signatures from multiple community leaders.",
    "question": "Why is multi-signatory endorsement used in civic petitions?",
    "options": [
      "To demonstrate collective community backing and legitimate civic mandate",
      "Because one person's handwriting is hard to read",
      "To make the letter longer",
      "To avoid writing an inside address"
    ],
    "answer": "To demonstrate collective community backing and legitimate civic mandate",
    "hint": "Multiple signatures confirm communal consensus.",
    "solution": "Civic petitions often feature multiple signatures to prove that the grievance represents a collective community consensus rather than an individual complaint.",
    "target": "Civic Petitions: Collective Mandate"
  },
  {
    "passage": "Which of the following demonstrates an error in address capitalization?",
    "question": "Identify the capitalization error:",
    "options": [
      "eastern region.",
      "Eastern Region.",
      "Greater Accra Region.",
      "Ashanti Region."
    ],
    "answer": "eastern region.",
    "hint": "Proper geographical nouns must be capitalized.",
    "solution": "Administrative regions are proper nouns; both words must begin with capital letters: 'Eastern Region.'.",
    "target": "Address Capitalization Mechanics"
  },
  {
    "passage": "A student writes: 'I hope this letter finds you in good health and happiness.'",
    "question": "In which type of correspondence is this opening sentence most appropriate?",
    "options": [
      "An informal personal letter to a friend or relative",
      "A formal letter of application for employment",
      "An official petition to the High Court",
      "A query letter to a defaulting accountant"
    ],
    "answer": "An informal personal letter to a friend or relative",
    "hint": "Enquiries about health belong in personal correspondence.",
    "solution": "Polite personal pleasantries regarding health and well-being belong exclusively in informal personal letters.",
    "target": "Epistolary Openings: Familial Register"
  },
  {
    "passage": "Why must formal letters never use text-message shorthand like 'pls', 'u', or 'thx'?",
    "question": "State the rule:",
    "options": [
      "They represent ungrammatical orthographic abbreviations that degrade academic expression",
      "They are too difficult for examiners to decipher",
      "They take up too little space on the page",
      "They are allowed only in pencil"
    ],
    "answer": "They represent ungrammatical orthographic abbreviations that degrade academic expression",
    "hint": "Texting abbreviations are prohibited in all formal academic writing.",
    "solution": "SMS/text shorthand violates formal written English conventions and incurs severe penalties under Expression and Mechanical Accuracy.",
    "target": "Orthographic Standards: SMS Slang Prohibition"
  },
  {
    "passage": "A candidate writes the inside address of a school headmaster as: 'To The Headteacher, St. Paul's School'.",
    "question": "What is incorrect about including the preposition 'To'?",
    "options": [
      "The word 'To' is archaic and redundant in modern formal inside addresses",
      "The word 'To' must be in capital letters",
      "The word 'To' belongs on the date line",
      "There is no error; 'To' is required"
    ],
    "answer": "The word 'To' is archaic and redundant in modern formal inside addresses",
    "hint": "Modern inside addresses start directly with the official title.",
    "solution": "Preceding an inside address with 'To' is an archaic formula that is redundant in contemporary standard epistolary architecture.",
    "target": "Inside Address Conventions"
  },
  {
    "passage": "In a semi-formal letter, why is 'Yours sincerely,' the mandatory subscription when saluting 'Dear Mr. Mensah,'?",
    "question": "State the governing rule:",
    "options": [
      "Because the recipient is addressed by their personal surname rather than an impersonal title",
      "Because semi-formal letters never use signatures",
      "Because 'sincerely' means the writer is telling the truth",
      "Because 'faithfully' is only used for women"
    ],
    "answer": "Because the recipient is addressed by their personal surname rather than an impersonal title",
    "hint": "Personal surname salutations strictly pair with 'Yours sincerely,'.",
    "solution": "When the recipient's personal surname is used in the greeting, standard English mandates 'Yours sincerely,'. 'Yours faithfully,' is reserved for impersonal greetings like 'Dear Sir,'.",
    "target": "Co-occurrence Rules: Salutation and Subscription"
  },
  {
    "passage": "Which of the following sentences represents an appropriate statement of prayer in a formal petition?",
    "question": "Select the best petition prayer sentence:",
    "options": [
      "We respectfully pray that your office dispatch road maintenance engineers to regrade our street before the rains.",
      "You must fix our street immediately because we are tired of asking.",
      "We hope somebody will look at our road sometime soon.",
      "Why have you neglected our street for so long?"
    ],
    "answer": "We respectfully pray that your office dispatch road maintenance engineers to regrade our street before the rains.",
    "hint": "A petition prayer must be polite, specific, and actionable.",
    "solution": "A formal prayer clearly, respectfully, and specifically states the administrative actions requested from the authority.",
    "target": "Civic Petitions: The Prayer Clause"
  },
  {
    "passage": "A student writes an informal letter and spells 'Wednesday' as 'Wenesday'.",
    "question": "Under which marking dimension is this spelling error penalized?",
    "options": [
      "Mechanical Accuracy (deduction of 1/2 mark)",
      "Content",
      "Organization",
      "Format"
    ],
    "answer": "Mechanical Accuracy (deduction of 1/2 mark)",
    "hint": "Spelling mistakes are classified under Mechanical Accuracy.",
    "solution": "All orthographical, spelling, capitalization, and punctuation errors are penalized under the Mechanical Accuracy rubric.",
    "target": "WAEC Rubrics: Mechanical Accuracy Penalties"
  },
  {
    "passage": "In pure block formatting, how are paragraphs separated from one another?",
    "question": "Select the paragraph separation method:",
    "options": [
      "By leaving a full blank line between flush-left paragraphs",
      "By indenting the first line five spaces without blank lines",
      "By drawing a horizontal pencil line across the page",
      "By centering the first word of each paragraph"
    ],
    "answer": "By leaving a full blank line between flush-left paragraphs",
    "hint": "Blocked text relies on blank lines rather than indents for visual separation.",
    "solution": "In block layout, all paragraphs begin flush at the left margin, and distinct paragraphs are visually separated by an empty line space.",
    "target": "Paragraph Formatting: Block Style"
  },
  {
    "passage": "Which of the following is an effective opening for a formal letter seeking sponsorship for a school sports team?",
    "question": "Select the most professional opening:",
    "options": [
      "I write on behalf of the school sports committee to respectfully request your company's sponsorship for our athletics team.",
      "We need money from your company for our sports jerseys.",
      "How is business going? I am writing to ask for sports funds.",
      "Our team is the best, so you should sponsor us immediately."
    ],
    "answer": "I write on behalf of the school sports committee to respectfully request your company's sponsorship for our athletics team.",
    "hint": "State the representational capacity and request with formal dignity.",
    "solution": "Stating representational authority and presenting the sponsorship request respectfully reflects proper business etiquette.",
    "target": "Formal Openings: Sponsorship Requests"
  },
  {
    "passage": "A candidate writes: 'The committee have decided to postpone the durbar.'",
    "question": "In formal British/WAEC English, when 'committee' acts as a single unified entity, what should the verb be?",
    "options": [
      "has decided",
      "have decided",
      "are deciding",
      "were decided"
    ],
    "answer": "has decided",
    "hint": "A collective noun acting as a single unit commands a singular verb.",
    "solution": "When a collective noun functions as a single unified institution, standard prescriptive concord mandates the singular verb 'has decided'.",
    "target": "Concord Mechanics: Collective Nouns"
  },
  {
    "passage": "Which of the following subscriptions is properly capitalized and punctuated?",
    "question": "Identify the correct subscription:",
    "options": [
      "Yours sincerely,",
      "Yours Sincerely,",
      "Your's sincerely,",
      "yours sincerely,"
    ],
    "answer": "Yours sincerely,",
    "hint": "Capitalize only the first letter of 'Yours', keep 'sincerely' in lowercase, and end with a comma.",
    "solution": "The first word begins with a capital letter, the second word is in lowercase, and a comma terminates the phrase: 'Yours sincerely,'.",
    "target": "Subscription Mechanics: Casing and Punctuation"
  },
  {
    "passage": "What is the maximum penalty cap for Mechanical Accuracy under the 30-mark WAEC essay rubric?",
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
  // 51. Informal: Career Aspirations
  {
    id: "B7_S4_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Career Aspirations & Secondary School Choices",
    shortSummary: "Write to an uncle explaining your dream career and the senior high school electives needed to achieve it.",
    prompt: "Your uncle living in Takoradi has offered to sponsor your senior high school education if you maintain high academic grades. Write a letter to him, thanking him for his generous offer, explaining your future career aspiration, and describing at least three senior high school elective subjects you intend to study to prepare for this profession.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Familial Gratitude, Expository Career Justification & Informal Epistolary Architecture",
    learningCompetency: "B7.4.2.1.1: Compose friendly personal letters to family elders expressing gratitude and articulating structured academic and career aspirations.",
    hint: "Use single address formatting. Express gratitude respectfully before explaining your career path. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Bethel Junior High School,", "P.O. Box 89,", "Cape Coast,", "Central Region.", "14th October, 2026."],
        allowedDatingFormats: ["14th October, 2026", "14 October 2026"],
        prohibitedDatingFormats: ["14/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Uncle Joe,",
        permissibleSalutations: ["Dear Uncle Joe,", "Dearest Uncle Joe,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Warmly enquire about his welfare and express heartfelt thanks for his sponsorship offer.", transitionHints: ["I hope this letter finds you well...", "I was overjoyed to receive your generous offer..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain your dream career (e.g., agricultural engineer, nurse, software developer) and what inspired you.", transitionHints: ["Ever since I joined Basic 7, I have developed a deep passion for...", "My dream is to become a..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Detail the three senior high school elective subjects you need and how you are currently studying for them.", transitionHints: ["To prepare for this career path, I plan to read General Science...", "Specifically, subjects like Chemistry, Physics, and Elective Mathematics..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your commitment to academic discipline and send greetings to his family.", transitionHints: ["I promise to work tirelessly to make you proud...", "Please extend my warmest regards to Auntie Grace..."] }
        ]
      },
      signOffGuide: {
        format: "mononymic",
        subscription: "Your loving nephew,",
        requiresHandwrittenSignature: false,
        printedNameFormat: "first_name_only",
        coOccurrenceConstraint: "End with an affectionate family subscription and your first name only."
      }
    },
    rubric: createWAECRubric(
      ["Gratitude for sponsorship expressed (2 marks)", "Career aspiration clearly explained with inspiration (4 marks)", "Three SHS elective subjects justified (4 marks)"],
      ["Sponsorship offer acknowledged", "Career goal clearly described", "Three electives named and linked to career"],
      ["Single address format (1 mark)", "Familial salutation (1 mark)", "No inside address/heading (1 mark)", "4 paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct address layout", "Consistent punctuation", "First name only at closing"],
      ["Warm, respectful familial register (4 marks)", "Natural conversational phrasing (3 marks)", "Varied sentence structures (3 marks)"],
      ["Respectful tone towards elder", "Clear transitional links", "Apt career and academic vocabulary"]
    ),
    modelAnswer: "Bethel Junior High School,\nP.O. Box 89,\nCape Coast,\nCentral Region.\n14th October, 2026.\n\nDear Uncle Joe,\n\nI hope this letter finds you and your family in good health and happiness in Takoradi. I was overjoyed when Mother informed me last week of your generous offer to sponsor my senior high school education. Words cannot express how grateful I am for your kindness and belief in my future.\n\nEver since I started Basic 7, I have developed a keen interest in modern technology and how it can solve local challenges. My dream is to become a computer software engineer so that I can design mobile health applications for rural clinics across Ghana. Witnessing how digital health registries saved lives in our local hospital during the recent health campaign inspired me deeply.\n\nTo prepare myself thoroughly for this career path, I intend to study General Science at Mfantsipim School. Specifically, I plan to select Elective Mathematics, Physics, and Chemistry. Elective Mathematics will sharpen my logical problem-solving abilities, while Physics will provide a solid understanding of electronics and hardware systems. Currently, I dedicate two hours every evening to practicing advanced algebra and introductory computer coding in our school laboratory.\n\nI promise to study diligently and maintain the top position in my class to prove worthy of your investment. Please extend my warmest greetings to Auntie Grace and my cousins.\n\nYour loving nephew,\nKwame",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Informal: Advice on Overcoming Examination Anxiety
  {
    id: "B7_S4_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Overcoming Examination Anxiety",
    shortSummary: "Write to a friend who suffers from examination panic sharing practical relaxation and revision techniques.",
    prompt: "Your close friend in another school wrote to confess that she suffers from severe panic and memory blackouts whenever examination week approaches. Write a reply to her, expressing heartfelt sympathy and offering at least three practical techniques that have helped you overcome examination anxiety and write tests with confidence.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Peer Empathy Register, Psychological Reassurance & Structured Advice",
    learningCompetency: "B7.4.2.1.1: Write supportive informal letters offering advice on emotional well-being and test preparation.",
    hint: "Maintain an empathetic, encouraging tone. Provide actionable advice (e.g., deep breathing, mock question practice, adequate sleep). End with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Wesley Junior High School,", "P.O. Box 45,", "Tarkwa,", "Western Region.", "22nd October, 2026."],
        allowedDatingFormats: ["22nd October, 2026", "22 October 2026"],
        prohibitedDatingFormats: ["22/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Efua,",
        permissibleSalutations: ["Dear Efua,", "My dearest Efua,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Sympathize with her test anxiety and reassure her that it is a common challenge.", transitionHints: ["I was deeply touched by your honest letter...", "Please know that you are not alone in feeling..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Share your first two anxiety management techniques (e.g., active recall practice and timed mock tests).", transitionHints: ["The first strategy that helped me conquer panic was...", "Secondly, I started solving past questions under timed conditions..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain physical habits that keep your mind calm (e.g., deep breathing and 8 hours of sleep).", transitionHints: ["Equally important is taking care of your body...", "Whenever panic strikes in the examination hall, I practice..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Encourage her self-confidence and remind her that exams do not define her worth.", transitionHints: ["Believe in yourself and your preparation...", "Write back soon and let me know how you feel..."] }
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
      ["Empathetic opening acknowledging panic (2 marks)", "Three practical anti-anxiety strategies developed (6 marks)", "Uplifting concluding advice (2 marks)"],
      ["Empathy clearly expressed", "Three techniques explained clearly", "Encouraging conclusion"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Warm, supportive peer tone (4 marks)", "Natural conversational flow (3 marks)", "Varied sentence patterns (3 marks)"],
      ["Reassuring tone", "Good transitions between strategies", "Rich empathetic vocabulary"]
    ),
    modelAnswer: "Wesley Junior High School,\nP.O. Box 45,\nTarkwa,\nWestern Region.\n22nd October, 2026.\n\nDear Efua,\n\nI was deeply touched by your heartfelt letter yesterday. It saddened me to read about the intense anxiety and memory blackouts you experience whenever examinations draw near. Please reassure yourself that you are not alone; when I entered Basic 7, my hands would shake so violently before mathematics papers that I could barely hold a compass. Fortunately, a few practical habits helped me overcome the fear.\n\nFirst and foremost, I stopped cramming the night before tests. Instead of memorizing notes blindly, I began using active recall. After reading a chapter in science or history, I close the textbook and write down everything I can remember on a blank sheet. Comparing my summary with the text reveals my weak areas immediately. This method eliminates uncertainty and gives me genuine confidence.\n\nSecondly, I simulate realistic examination conditions on weekends. I set a timer for forty-five minutes and answer past BECE questions without checking the answers. Familiarizing my brain with time pressure in a quiet room removed the terrifying shock factor from the actual test hall.\n\nFinally, never underestimate the power of deep breathing and proper rest. On the eve of an exam, I ensure I sleep for at least eight hours. Whenever a sudden wave of panic hits me in the exam hall, I close my eyes, inhale deeply through my nose for four seconds, and exhale slowly. This instantly slows down my racing heartbeat and clears mental fog.\n\nYou are brilliant and hardworking, Efua. Believe in your abilities, try these steps, and watch your confidence soar.\n\nYour sincere friend,\nAbena",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Semi-Formal: Request for Science Lab Equipment Usage
  {
    id: "B7_S4_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Semi-Formal Letter",
    title: "Laboratory Access for Science Project",
    shortSummary: "Write to your Science Master seeking after-school laboratory access for a national science fair project.",
    prompt: "You and two classmates have qualified to participate in the National Junior Science Innovation Fair, but your project on solar water purification requires laboratory measuring instruments. Write a semi-formal letter to your Integrated Science Master, explaining your project, requesting permission to use the school science laboratory after classes for two weeks, and guaranteeing adherence to safety rules.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Scientific Justification, Laboratory Etiquette & Underlined Title Case Caption",
    learningCompetency: "B7.4.2.1.2: Compose semi-formal requests to teachers adhering to respectful registers, surname salutations, underlined captions, and explicit safety pledges.",
    hint: "Address as 'Dear Mr. [Surname],'. Provide an underlined Title Case heading. Detail your project needs and safety assurances. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Science Club Secretariat,", "St. James Junior High School,", "P.O. Box 112,", "Wa,", "Upper West Region.", "28th October, 2026."],
        allowedDatingFormats: ["28th October, 2026", "28 October 2026"],
        prohibitedDatingFormats: ["28/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Dery,",
        permissibleSalutations: ["Dear Mr. Dery,", "Dear Science Master,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for After-School Access to the Science Laboratory",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "State the purpose of your letter and announce your qualification for the Science Fair.", transitionHints: ["I write on behalf of our science project team to respectfully request...", "Our team has qualified for the National Junior Science Fair..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain the solar water purification prototype and the specific apparatus needed (e.g., test tubes, pH meters).", transitionHints: ["Our experimental prototype is designed to...", "To calibrate our water samples accurately, we require the use of..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State the exact dates, hours of laboratory use, and your strict safety commitments.", transitionHints: ["We humbly request permission to use the facility from...", "We solemnly pledge to observe all safety protocols..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Express polite gratitude and request his expert mentorship.", transitionHints: ["We would be deeply honored if you could inspect our progress...", "Thank you very much for your continuous encouragement..."] }
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
      ["Project purpose and fair qualification explained (3 marks)", "Specific laboratory apparatus specified (3 marks)", "Dates, times, and safety pledges outlined (4 marks)"],
      ["Science fair context clear", "Apparatus specified clearly", "Safety commitment detailed"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Caption underlined", "Correct subscription", "Full printed name"],
      ["Respectful, academic register (4 marks)", "No informal contractions (3 marks)", "Scientific vocabulary and clear linkers (3 marks)"],
      ["Polite expressions throughout", "Zero slang", "Clear compound/complex sentences"]
    ),
    modelAnswer: "Science Club Secretariat,\nSt. James Junior High School,\nP.O. Box 112,\nWa,\nUpper West Region.\n28th October, 2026.\n\nDear Mr. Dery,\n\nRequest for After-School Access to the Science Laboratory\n________________________________________________________\n\nI write on behalf of our three-member student innovation team to respectfully request your permission to utilize the school science laboratory for preparatory research ahead of the National Junior Science Innovation Fair in Accra.\n\nOur research project focuses on designing a low-cost solar water distillation apparatus capable of purifying brackish borehole water for rural households. To validate our prototypes and record empirical findings, we need to test daily water samples using the laboratory's digital thermometers, glass condensing tubes, and electronic pH meter.\n\nWe humbly request access to the laboratory from Monday, 3rd November, to Friday, 14th November, 2026, between 3:30 p.m. and 5:00 p.m. daily. We solemnly promise to handle all glassware and electronic meters with the utmost care, wear protective lab coats and goggles at all times, and ensure that all workbenches are cleaned and disinfected before vacating the room.\n\nYour mentorship has been the driving force behind our academic passion, and we would be honored if you could occasionally supervise our testing sessions.\n\nThank you very much for your kind consideration and continuous support.\n\nYours sincerely,\nStephen Bawa",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Formal: Application for School Canteen Prefect
  {
    id: "B7_S4_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Application for Food & Canteen Prefect",
    shortSummary: "Apply to the Headteacher for the office of School Canteen and Food Prefect.",
    prompt: "Nominations have opened for student leadership offices. Write a formal letter of application to your Headteacher, expressing your desire to serve as the School Canteen and Food Prefect. State your leadership qualities, discuss existing nutritional and queuing problems at the school canteen, and propose two practical reforms you will implement.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Institutional Analysis & Quadripartite Close",
    learningCompetency: "B7.4.2.1.2: Compose formal letters of application demonstrating objective problem analysis, dual-address layouts, block captions, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and class designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 7 Stream A,", "Holy Child Junior High School,", "P.O. Box 77,", "Kpone-on-Sea,", "Greater Accra Region.", "4th November, 2026."],
        allowedDatingFormats: ["4th November, 2026", "4 November 2026"],
        prohibitedDatingFormats: ["04/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Headteacher,",
        officeOrSchoolPlaceholder: "Holy Child Junior High School,",
        postalBoxPlaceholder: "P.O. Box 77,",
        townRegionPlaceholder: "Kpone-on-Sea, Greater Accra Region.",
        formatContaminationPenaltyWarning: "CRITICAL: Inside address is mandatory."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Sir,",
        permissibleSalutations: ["Dear Sir,", "Dear Madam,"],
        bannedSalutations: ["Dear Mr. Headteacher,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "APPLICATION FOR THE POSITION OF SCHOOL CANTEEN PREFECT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of Canteen Prefect.", transitionHints: ["I write to formally submit my application for...", "In response to the invitation for prefectorial nominations..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your personal integrity, fairness, and past record of hygiene monitoring.", transitionHints: ["Throughout my academic stay in Basic 7, I have demonstrated...", "My commitment to food safety and student welfare was evident when..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Discuss existing canteen problems (disorderly queuing, uncovered meals) and propose two concrete solutions.", transitionHints: ["Currently, the school canteen experiences disorderly queues...", "To resolve these challenges, I will introduce class-based shift queuing..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your loyalty to the administration and readiness for vetting.", transitionHints: ["I pledge to discharge my duties with fairness and impartiality...", "I look forward to appearing before the vetting committee..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Applicant, Basic 7A",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application purpose declared clearly (2 marks)", "Personal leadership and integrity qualities shown (4 marks)", "Canteen problems analyzed with two practical reforms (4 marks)"],
      ["Office applied for stated clearly", "Leadership qualities demonstrated", "Two reforms proposed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: "Basic 7 Stream A,\nHoly Child Junior High School,\nP.O. Box 77,\nKpone-on-Sea,\nGreater Accra Region.\n4th November, 2026.\n\nThe Headteacher,\nHoly Child Junior High School,\nP.O. Box 77,\nKpone-on-Sea,\nGreater Accra Region.\n\nDear Sir,\n\nAPPLICATION FOR THE POSITION OF SCHOOL CANTEEN PREFECT\n\nI write to formally submit my candidature for the office of School Canteen and Food Prefect for the upcoming 2026/2027 academic session, following the opening of prefectorial nominations.\n\nDuring my academic tenure in Basic 7, I have maintained an unblemished record of discipline, honesty, and punctuality. As an active member of the School Health and Sanitation Club, I regularly assisted duty masters in supervising lunchtime distribution, which provided me with first-hand experience in managing large groups of students during meals.\n\nAt present, our school canteen faces two major challenges: chaotic overcrowding during the first break and inconsistent food hygiene among vendors. To rectify these difficulties, I propose two major reforms. First, I will introduce a staggered lunch queuing system where junior and senior streams access vendor stalls during alternating fifteen-minute windows, eliminating shoving and long waiting times. Second, I will institute daily pre-break vendor hygiene inspections to ensure that all food handlers wear aprons and hairnets and keep food containers covered.\n\nIf given the mandate to serve, I pledge to discharge my duties with firmness, fairness, and deep loyalty to the administration.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nPriscilla Darkwa\nApplicant, Basic 7A",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Civic Petition: Inadequate Public Library Facilities
  {
    id: "B7_S4_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Civic Petition",
    title: "Petition on Dilapidated Municipal Library",
    shortSummary: "Petition the Municipal Chief Executive regarding the dilapidated municipal library and appeal for urgent renovation.",
    prompt: "The municipal community library in your town has fallen into severe disrepair, with broken louvre blades, inadequate lighting, and empty bookshelves. As the Secretary of the Municipal Students' Alliance, write a formal petition to your Municipal Chief Executive (MCE), detailing how the poor state of the library affects student academic performance and appealing for urgent renovation and re-stocking.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Petition Architecture, Forensic Evidence & Administrative Prayer",
    learningCompetency: "B7.4.2.1.2: Compose civic petitions to local assemblies addressing educational infrastructure crises using empirical evidence, structured prayers, and executive sign-offs.",
    hint: "Address to 'The Municipal Chief Executive,'. State the problem factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Municipal Students' Alliance,", "P.O. Box 210,", "Effiduase-Ashanti,", "Ashanti Region.", "10th November, 2026."],
        allowedDatingFormats: ["10th November, 2026", "10 November 2026"],
        prohibitedDatingFormats: ["10/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Municipal Chief Executive,",
        officeOrSchoolPlaceholder: "Sekyere East Municipal Assembly,",
        postalBoxPlaceholder: "P.O. Box 15,",
        townRegionPlaceholder: "Effiduase-Ashanti, Ashanti Region.",
        formatContaminationPenaltyWarning: "CRITICAL: Formal petitions to state officials require a full inside address."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Sir,",
        permissibleSalutations: ["Dear Sir,", "Honorable Sir,"],
        bannedSalutations: ["Dear MCE,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "PETITION FOR THE REHABILITATION AND RESTOCKING OF THE MUNICIPAL LIBRARY",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your representational standing and declare the petition's focus on the community library.", transitionHints: ["We, the executive committee of the Municipal Students' Alliance, respectfully petition...", "I write on behalf of over two thousand junior secondary students to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the physical decay (broken louvres, dim lights, outdated reference texts) and academic fallout.", transitionHints: ["Over the past three years, the community library has decayed...", "Students preparing for the Basic Education Certificate Examination find it impossible to..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (assembly budget allocation for repairs, solar lighting, and book procurement).", transitionHints: ["We therefore humbly pray that your honorable administration...", "Specifically, we appeal for the immediate refurbishment of..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm the importance of public reading facilities for youth empowerment.", transitionHints: ["We trust that your esteemed office will act decisively to safeguard...", "Thank you very much for your leadership and anticipated intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Secretary, Municipal Students' Alliance",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Alliance standing established (2 marks)", "Detailed documentation of library decay and academic impacts (4 marks)", "Clear three-point prayer for refurbishment and books (4 marks)"],
      ["Student alliance authority established", "Physical library defects detailed", "Actionable solutions proposed"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive vocabulary (3 marks)"],
      ["Forceful civic language", "Logical problem-evidence-prayer flow", "Precise terminology"]
    ),
    modelAnswer: "Municipal Students' Alliance,\nP.O. Box 210,\nEffiduase-Ashanti,\nAshanti Region.\n10th November, 2026.\n\nThe Municipal Chief Executive,\nSekyere East Municipal Assembly,\nP.O. Box 15,\nEffiduase-Ashanti,\nAshanti Region.\n\nDear Sir,\n\nPETITION FOR THE REHABILITATION AND RESTOCKING OF THE MUNICIPAL LIBRARY\n\nI write on behalf of the executive committee of the Municipal Students' Alliance and over two thousand junior secondary students in Effiduase to respectfully petition your high office regarding the dilapidated state of our community library.\n\nFor the past three years, the municipal library facility has suffered severe administrative neglect. More than half of the glass window louvre blades are shattered, leaving the reading hall exposed to rainstorms and dust. Additionally, the fluorescent tubes are defective, creating dim lighting that strains pupils' eyesight. Most distressing is the state of the bookshelves, which contain tattered, decades-old encyclopedias that do not reflect the contemporary NaCCA Common Core curriculum.\n\nWe therefore humbly pray that your honorable administration execute three critical interventions. First, we appeal for the immediate structural refurbishment of the facility, including replacing broken louvre blades and installing solar-powered LED ceiling lights. Second, we request the allocation of emergency municipal funds to procure contemporary curriculum textbooks for mathematics, science, and English. Finally, we urge the assembly to install at least five desktop computers with internet connectivity for digital research.\n\nA functional public library is the heartbeat of community academic excellence. We trust your administration will act swiftly to empower our youth.\n\nThank you for your dedicated service and anticipated intervention.\n\nYours faithfully,\n[Signature]\nBright Adjei\nSecretary, Municipal Students' Alliance",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Informal: Account of Inter-Schools Athletics Championship
  {
    id: "B7_S4_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Informal Letter",
    title: "Inter-Schools Athletics Championship Victory",
    shortSummary: "Write to a friend living abroad narrating your school's dramatic victory in the annual sports gala.",
    prompt: "Your school recently emerged as the overall champion in the annual inter-schools athletics competition. Write a letter to your former seatmate who now lives with his family in London, narrating the dramatic highlights of the championship, describing your personal participation, and explaining how the school celebrated the victory.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Narrative Pacing, Vivid Sports Exposition & Conversational Warmth",
    learningCompetency: "B7.4.2.1.1: Compose friendly personal letters incorporating vivid narrative action, suspense, and celebratory tone.",
    hint: "Use single address formatting. Narrate the sports action vividly using sensory adjectives and dramatic verbs. End with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Christ the King Junior High School,", "P.O. Box 33,", "Obuasi,", "Ashanti Region.", "15th November, 2026."],
        allowedDatingFormats: ["15th November, 2026", "15 November 2026"],
        prohibitedDatingFormats: ["15/11/2026"]
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
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at closing"],
      ["Lively, exhilarating narrative tone (4 marks)", "Natural contractions (3 marks)", "Vivid athletic vocabulary (3 marks)"],
      ["Suspenseful narrative pace", "Clear transitions", "Apt descriptive vocabulary"]
    ),
    modelAnswer: "Christ the King Junior High School,\nP.O. Box 33,\nObuasi,\nAshanti Region.\n15th November, 2026.\n\nDear Kojo,\n\nI hope you are keeping warm in cold London and settling into your new school. We miss your cheerful presence here in Obuasi! I am writing to share the most exhilarating news with you: our school just emerged as the undisputed overall champions of the Obuasi Municipal Inter-Schools Athletics Competition!\n\nThe entire two-day tournament was intensely competitive, but the climax was the senior boys' four-by-one-hundred-meter relay. Heading into that final event, our school was trailing St. Joseph's by two points. The atmosphere in the Len Clay Stadium was electrifying as thousands of students cheered from the stands.\n\nI was honored to run the third leg of the relay. When Kwame handed the metal baton to me around the final bend, my heart was thumping wildly. I sprinted with every ounce of strength in my legs, overtaking the St. Joseph's runner just before passing the baton to our anchor sprinter, Yaw Mensah. Yaw accelerated like a cheetah and crossed the finish line half a stride ahead, securing the gold medal!\n\nThe entire stadium erupted into deafening cheers! When our headmaster lifted the shimmering championship trophy, the brass band played celebratory victory tunes all the way back to the school compound, where a special dinner of jollof rice and roasted chicken awaited us.\n\nI wish you were here to celebrate with us. Write back soon and tell me how sports competitions work over there in England.\n\nYour sincere friend,\nFelix",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Semi-Formal: Apology and Compensation for Damaged Science Apparatus
  {
    id: "B7_S4_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Semi-Formal Letter",
    title: "Apology for Damaged Laboratory Apparatus",
    shortSummary: "Write to the Science Master apologizing for accidentally breaking a glass condenser and offering full replacement.",
    prompt: "During an afternoon practical chemistry lesson, you accidentally knocked a glass Liebig condenser off your laboratory workbench, shattering it on the concrete floor. Write a semi-formal letter of apology to your Integrated Science Master, explaining how the accident occurred, expressing genuine remorse, and outlining your plan to replace the equipment before the end of the term.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Apologetic Register, Honest Accountability & Recompense Plan",
    learningCompetency: "B7.4.2.1.2: Compose semi-formal letters of apology to school instructors demonstrating remorse, factual accountability, and concrete compensation proposals.",
    hint: "Salute with 'Dear Mr. [Surname],'. Provide an underlined Title Case caption. Explain the accident truthfully without shifting blame. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 7 Science Stream,", "St. Augustine's Junior High School,", "P.O. Box 60,", "Berekum,", "Bono Region.", "18th November, 2026."],
        allowedDatingFormats: ["18th November, 2026", "18 November 2026"],
        prohibitedDatingFormats: ["18/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Addai,",
        permissibleSalutations: ["Dear Mr. Addai,", "Dear Science Master,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Apology and Restitution for Damaged Laboratory Condenser",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Directly state the purpose of your letter and tender a sincere apology for the broken apparatus.", transitionHints: ["I write to express my profound remorse...", "I am writing to formally apologize for the unfortunate accident..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain truthfully how the accident occurred during the distillation experiment without excuses.", transitionHints: ["While disassembling our distillation setup...", "In my haste to return the apparatus to the rack, my elbow accidentally brushed..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Outline your concrete plan to purchase and deliver an identical replacement condenser.", transitionHints: ["I accept full responsibility for this loss...", "My parents have agreed to assist me in procuring an identical..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm your commitment to laboratory safety and appeal for his understanding.", transitionHints: ["I promise to exercise extreme vigilance during future practical sessions...", "Thank you very much for your patience and understanding..."] }
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
      ["Sincere apology tendered immediately (2 marks)", "Honest, realistic account of the accident (4 marks)", "Clear compensation and replacement plan (4 marks)"],
      ["Apology stated in paragraph 1", "Accident explained honestly", "Replacement plan clearly specified"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Title Case underlined", "Correct subscription", "Full printed name"],
      ["Remorseful, respectful, and mature tone (4 marks)", "No informal contractions (3 marks)", "Precise scientific and apologetic vocabulary (3 marks)"],
      ["Dignified accountability", "Zero colloquial excuses", "Clear sentence structure"]
    ),
    modelAnswer: "Basic 7 Science Stream,\nSt. Augustine's Junior High School,\nP.O. Box 60,\nBerekum,\nBono Region.\n18th November, 2026.\n\nDear Mr. Addai,\n\nApology and Restitution for Damaged Laboratory Condenser\n_______________________________________________________\n\nI write to express my profound remorse and to formally apologize for accidentally shattering a glass Liebig condenser during yesterday afternoon's practical chemistry class.\n\nThe unfortunate incident occurred while my group members and I were dismantling our distillation apparatus at the end of the lesson. In my hurry to pack my notebooks, my elbow brushed against the glass condenser, causing it to roll off the laboratory workbench and shatter on the concrete floor. I deeply regret my carelessness and acknowledge that this equipment is vital for our upcoming practical examinations.\n\nI take full personal responsibility for this damage. I have informed my parents about the incident, and my father has contacted an accredited scientific supplies shop in Sunyani to purchase an identical brand-new borosilicate glass condenser. We will deliver the replacement equipment to your office by Friday, 27th November, 2026.\n\nI assure you that I have learned a valuable lesson in laboratory discipline and will exercise rigorous caution around fragile scientific glassware during all future practical sessions.\n\nThank you very much for your patience, understanding, and gracious guidance.\n\nYours sincerely,\nGodwin Anane",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Formal: Petition to Headteacher on Compulsory Afternoon Prep Lighting
  {
    id: "B7_S4_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Classroom Lighting Appeal to Headmaster",
    shortSummary: "Write on behalf of students appealing for classroom solar lights to support evening study sessions.",
    prompt: "Your school administration recently introduced compulsory evening study prep for all Basic 7 pupils, but frequent municipal power outages leave classrooms in total darkness, forcing students to read with dangerous candle flames. As the Class Prefect, write a formal letter to your Headmaster, explaining the safety hazards of candles and appealing for the installation of rechargeable solar emergency lights in each classroom.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Problem-Solution Exposition, Fire Hazard Analysis & Quadripartite Close",
    learningCompetency: "B7.4.2.1.2: Compose formal administrative appeals addressing school safety hazards using objective analysis, dual-address layouts, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Class Prefects' Secretariat,", "Good Shepherd Junior High School,", "P.O. Box 28,", "Agona Swedru,", "Central Region.", "20th November, 2026."],
        allowedDatingFormats: ["20th November, 2026", "20 November 2026"],
        prohibitedDatingFormats: ["20/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The Headmaster,",
        officeOrSchoolPlaceholder: "Good Shepherd Junior High School,",
        postalBoxPlaceholder: "P.O. Box 28,",
        townRegionPlaceholder: "Agona Swedru, Central Region.",
        formatContaminationPenaltyWarning: "CRITICAL: Full inside address is required."
      },
      salutationGuide: {
        recommendedSalutation: "Dear Sir,",
        permissibleSalutations: ["Dear Sir,"],
        bannedSalutations: ["Dear Headmaster,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelCaption: "APPEAL FOR THE INSTALLATION OF SOLAR EMERGENCY LIGHTS IN CLASSROOMS",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "State your capacity as Class Prefect and declare the purpose of the appeal.", transitionHints: ["I write in my capacity as the Class Prefect of Basic 7...", "On behalf of the entire student body, I draw your urgent attention to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the frequent power cuts and the grave fire hazards of reading with candles.", transitionHints: ["Over the past month, chronic power outages have disrupted...", "Pupils have resorted to lighting wax candles on wooden desks, creating severe fire hazards..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Propose the procurement of rechargeable solar lights and explain their cost-effectiveness.", transitionHints: ["To eliminate this imminent danger, we humbly suggest that...", "Installing rechargeable solar LED lighting units in each block would..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Reaffirm students' enthusiasm for study prep and express anticipation of swift action.", transitionHints: ["We remain dedicated to maintaining outstanding academic standards...", "Thank you in advance for your compassionate leadership..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Class Prefect, Basic 7",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Prefectorial standing and purpose established (2 marks)", "Fire and eye-strain hazards of candles analyzed (4 marks)", "Solar emergency lighting proposal justified (4 marks)"],
      ["Prefect role clear", "Candle hazards articulated convincingly", "Solar solution proposed"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Objective administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive vocabulary (3 marks)"],
      ["Business-like tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: "Class Prefects' Secretariat,\nGood Shepherd Junior High School,\nP.O. Box 28,\nAgona Swedru,\nCentral Region.\n20th November, 2026.\n\nThe Headmaster,\nGood Shepherd Junior High School,\nP.O. Box 28,\nAgona Swedru,\nCentral Region.\n\nDear Sir,\n\nAPPEAL FOR THE INSTALLATION OF SOLAR EMERGENCY LIGHTS IN CLASSROOMS\n\nI write in my capacity as the Class Prefect of Basic 7, and on behalf of the entire junior student body, to respectfully draw your attention to the serious hazards associated with our evening study prep during power outages and to suggest a safe lighting solution.\n\nWhile students warmly welcome the newly instituted evening study prep hours, our academic efforts are severely undermined by frequent municipal blackout episodes. Over the past four weeks, power cuts have occurred almost every evening, plunging our classrooms into total darkness. Consequently, pupils have resorted to burning wax candles on wooden desks, creating a severe fire hazard that nearly ignited curtains in Class 7B last Thursday. Furthermore, reading in flickering candlelight causes severe eye strain and headaches.\n\nTo safeguard student lives and ensure uninterrupted study, we humbly propose that the school administration procure and install rechargeable solar-powered LED lighting units in each classroom block. These eco-friendly units can be charged naturally by sunlight during the day and provide bright, safe illumination for up to four hours during evening blackouts. The Parent-Teacher Association could be approached to support this modest investment.\n\nWe trust that your high office will treat this safety appeal with urgent consideration.\n\nThank you very much for your continuous dedication to our welfare.\n\nYours faithfully,\n[Signature]\nJoshua Mensah\nClass Prefect, Basic 7",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Civic Petition: Illegal Sand Winning along Community Coastline
  {
    id: "B7_S4_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Civic Petition",
    title: "Petition against Coastal Sand Winning",
    shortSummary: "Petition the District Chief Executive over illegal beach sand winning that threatens coastal schools.",
    prompt: "Unregulated commercial sand winning along your coastal village has caused massive beach erosion, threatening to wash away the community basic school and traditional canoe landing sites. As the Youth Club Secretary, write a formal petition to your District Chief Executive (DCE), presenting photographic and empirical evidence of the environmental destruction and appealing for an immediate police ban on sand-hauling tipper trucks.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Environmental Civic Petition Architecture, Forensic Evidence & Regulatory Prayer",
    learningCompetency: "B7.4.2.1.2: Compose formal environmental petitions to district authorities utilizing empirical evidence, regulatory prayers, and executive sign-offs.",
    hint: "Address to 'The District Chief Executive,'. State the environmental crisis in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Gomoa Fetteh Youth Association,", "P.O. Box 14,", "Gomoa Fetteh,", "Central Region.", "24th November, 2026."],
        allowedDatingFormats: ["24th November, 2026", "24 November 2026"],
        prohibitedDatingFormats: ["24/11/2026"]
      },
      insideAddress: {
        isRequired: true,
        titleDesignationPlaceholder: "The District Chief Executive,",
        officeOrSchoolPlaceholder: "Gomoa East District Assembly,",
        postalBoxPlaceholder: "P.O. Box 55,",
        townRegionPlaceholder: "Potsin, Central Region.",
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
        modelCaption: "PETITION TO HALT ILLEGAL COMMERCIAL SAND WINNING ALONG OUR COASTLINE",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your association's representational mandate and declare the environmental petition's purpose.", transitionHints: ["We, the executive committee of the Youth Association, respectfully petition...", "I write on behalf of the elders, fishermen, and youth of Gomoa Fetteh to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the empirical evidence of coastal erosion, destroyed coconut groves, and threats to the school.", transitionHints: ["For the past six months, heavy commercial tipper trucks have been excavating...", "Consequently, the high tide has advanced twenty meters inland, undermining the foundations of..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (police checkpoints, seizure of tipper trucks, sea defense barriers).", transitionHints: ["We therefore humbly pray that your honorable office take immediate regulatory action...", "First, we demand the immediate mounting of an armed police barrier..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent administrative intervention before the next storm surge destroys the school.", transitionHints: ["We trust in your prompt leadership to safeguard our community...", "Thank you very much for your anticipated decisive intervention..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Secretary, Gomoa Fetteh Youth Association",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Community youth mandate established (2 marks)", "Empirical environmental damage documented (4 marks)", "Clear regulatory enforcement prayer presented (4 marks)"],
      ["Youth association standing established", "Erosion evidence documented", "Police checkpoint and truck ban requested"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental vocabulary (3 marks)"],
      ["Forensic civic language", "Logical problem-evidence-prayer progression", "Precise technical vocabulary"]
    ),
    modelAnswer: "Gomoa Fetteh Youth Association,\nP.O. Box 14,\nGomoa Fetteh,\nCentral Region.\n24th November, 2026.\n\nThe District Chief Executive,\nGomoa East District Assembly,\nP.O. Box 55,\nPotsin, Central Region.\n\nDear Sir,\n\nPETITION TO HALT ILLEGAL COMMERCIAL SAND WINNING ALONG OUR COASTLINE\n\nI write on behalf of the executive committee of the Gomoa Fetteh Youth Association and the artisanal fishing community to respectfully submit this urgent petition concerning the destructive wave of illegal commercial sand winning along our beachfront.\n\nOver the past six months, fleets of heavy tipper trucks have been unlawfully excavating thousands of tons of beach sand every night. This uncontrolled destruction has stripped our coastline of its natural sea-defense dunes. Consequently, ocean surges have advanced more than twenty meters inland, uprooting ancient coconut groves and severely undermining the concrete foundations of the Gomoa Fetteh Community Basic School, which now stands barely ten meters from the breaking surf.\n\nTo prevent the total submergence of our school and the loss of our canoe landing beaches, we humbly pray that your honorable office enforce three immediate interventions. First, we appeal for the immediate deployment of a permanent joint police-military checkpoint on the Fetteh-Potsin road to impound all sand-carrying tipper trucks. Second, we demand the revocation of environmental permits held by compromised local quarry operators. Finally, we urge the assembly to collaborate with the coastal engineering department to place rock boulders along the exposed school perimeter.\n\nOur community's survival depends on decisive administrative action.\n\nThank you very much for your leadership and swift intervention.\n\nYours faithfully,\n[Signature]\nEmmanuel Quaye\nSecretary, Gomoa Fetteh Youth Association",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Formal Letter to Editor: Combating Teenage Truancy and Digital Gaming Addiction
  {
    id: "B7_S4_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B7",
    difficulty: "intermediate",
    category: "Formal Letter",
    title: "Combating Truancy (Letter to Editor)",
    shortSummary: "Write to the Editor of a daily newspaper on youth gaming center truancy.",
    prompt: "There is an alarming increase in teenage truancy in your neighborhood due to children abandoning classes to patronize commercial video-gaming and sports betting parlors. Write a letter to the Editor of a national daily newspaper, expressing concern about this social menace, analyzing its effects on school attendance, and suggesting two practical ways parents and local authorities can eliminate the problem.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Letter to the Press Architecture, Social Commentary Register & Civic Valediction",
    learningCompetency: "B7.4.2.1.2: Compose formal letters to newspaper editors analyzing contemporary social issues and proposing regulatory interventions.",
    hint: "Address to 'The Editor, Daily Graphic,'. Include an un-underlined BLOCK CAPITAL heading. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', your signature, full name, and your residential town.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Old Tafo Community Youth Desk,", "P.O. Box 88,", "Old Tafo-Kumasi,", "Ashanti Region.", "2nd December, 2026."],
        allowedDatingFormats: ["2nd December, 2026", "2 December 2026"],
        prohibitedDatingFormats: ["02/12/2026"]
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
        modelCaption: "CURBING THE MENACE OF TEENAGE TRUANCY IN GAMING CENTERS",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Request editorial space and state the social issue directly.", transitionHints: ["Permit me space in your widely read newspaper...", "I write to draw national attention to the alarming..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Analyze how video-game centers induce school absenteeism and academic decline.", transitionHints: ["During instructional school hours, dozens of school children...", "This addiction leads to chronic truancy, academic failure, and..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Propose two practical solutions (assembly bylaws and parental monitoring).", transitionHints: ["To eradicate this menace, municipal authorities must...", "Furthermore, parents must exercise greater vigilance by..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Summarize the urgency of safeguarding youth education.", transitionHints: ["If we fail to act decisively, our educational investments will...", "I hope this appeal stirs immediate community action..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Old Tafo-Kumasi",
        coOccurrenceConstraint: "Letters to the editor terminate with 'Yours faithfully,', signature, full name, and town/region."
      }
    },
    rubric: createWAECRubric(
      ["Editorial space requested and issue announced (2 marks)", "Effects on academic attendance analyzed (4 marks)", "Two actionable regulatory solutions proposed (4 marks)"],
      ["Issue introduced clearly", "Social consequences analyzed", "Realistic solutions suggested"],
      ["Two addresses correctly positioned (1 mark)", "Salutation 'Dear Sir,' (1 mark)", "Block capital caption without underline (1 mark)", "4-paragraph structure (1 mark)", "Sign-off with signature, name, and town (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Sign-off includes town"],
      ["Engaged civic commentary register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive public advocacy vocabulary (3 marks)"],
      ["Thoughtful civic vocabulary", "Effective paragraph links", "Varied sentence patterns"]
    ),
    modelAnswer: "Old Tafo Community Youth Desk,\nP.O. Box 88,\nOld Tafo-Kumasi,\nAshanti Region.\n2nd December, 2026.\n\nThe Editor,\nDaily Graphic,\nP.O. Box 742,\nAccra.\n\nDear Sir,\n\nCURBING THE MENACE OF TEENAGE TRUANCY IN GAMING CENTERS\n\nPermit me a space in your widely read national newspaper to express my profound concern over the alarming surge in school absenteeism caused by commercial video-gaming and sports betting centers in our urban communities.\n\nIt is deeply troubling that during official school hours, dozens of junior high school pupils abandon classroom lessons to congregate in dark, unventilated video-game parlors across our suburbs. This disturbing addiction has fueled chronic truancy, sharp drops in terminal examination scores, and petty pilfering among students seeking coins to fund their gaming sessions. The future of many promising youngsters is being compromised while gaming operators profit unhindered.\n\nTo eradicate this growing social menace, I propose two urgent interventions. First, municipal assemblies must rigorously enforce local business bylaws that prohibit commercial gaming operators from admitting school children in uniform between 7:00 a.m. and 3:00 p.m., backed by heavy fines and license revocations for non-compliant proprietors. Second, community parent-teacher associations should collaborate with local unit committees to conduct regular surveillance raids on known gaming hubs during school hours.\n\nOur children are the nation's future human resource. We cannot sit idly by while commercial gaming centers derail their educational aspirations.\n\nYours faithfully,\n[Signature]\nRichmond Asare\nOld Tafo-Kumasi",
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
export async function deployStrand4B7IntermediateClean() {
  console.log("Building clean 60-item Strand 4 B7 Intermediate Practice Lab...");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective, Shuffled Options)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory, Flippable Prompts)");

  const db = await getFirestoreDb();
  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // 1. Build Section A (Questions 1 to 50: Objective Multiple-Choice with Shuffled Options)
  rawObjective50Data.forEach((item, index) => {
    const qNum = index + 1;
    const shuffledOptions = shuffleArray<string>(item.options);

    all60Items.push({
      id: `B7_S4_I_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B7",
      difficulty: "intermediate",
      category: "Epistolary Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n\"${item.passage}\"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: shuffledOptions,
      correctAnswer: item.answer, // Matches the exact target string regardless of shuffled index
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B7.4.2.1: Demonstrate intermediate mastery of epistolary formatting, address architecture, dating laws, salutation/close pairings, and caption rules."
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
    difficulty: "intermediate",
    title: "Basic 7 Intermediate Writing Lab: 50 Objective Drills + 10 Theory Writing Tasks",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B7_intermediate`
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
              medium: all60Items
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

deployStrand4B7IntermediateClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B7 Intermediate Clean 60 Lab:", err);
    process.exit(1);
  });

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
  level: "B9";
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
        "Strict subject-verb concord across compound-complex structures",
        "Proper sequence of tenses and modal auxiliary accuracy",
        "Absolute prohibition of informal contractions in formal letters and petitions"
      ]
    }
  }
});

// =========================================================================
// 50 UNIQUE OBJECTIVE EPISTOLARY DRILLS (QUESTIONS 1 TO 50)
// Basic 9 Foundation Diagnostic Focus:
// BECE Level Assessment on Layout Purity, Advanced Salutation-Subscription
// Co-occurrence, Caption Typography, Contraction Penalties & Official Registers
// =========================================================================
const rawObjective50Data = [
  {
    passage: "A candidate preparing for the BECE begins an informal letter to a friend with two addresses: the writer's address at the top right and the recipient's inside address on the left.",
    question: "Under the WAEC marking scheme, how is this evaluated?",
    options: [
      "Penalized under Organization for format contamination (informal letters must never have an inside address)",
      "Awarded full marks for providing complete postal details",
      "Penalized under Content for exceeding the required word limit",
      "Regarded as standard modern semi-formal layout"
    ],
    answer: "Penalized under Organization for format contamination (informal letters must never have an inside address)",
    hint: "Informal personal letters strictly require a single address.",
    solution: "Including a recipient inside address on an informal personal letter violates epistolary layout purity. It is penalized under Organization as format contamination.",
    target: "Epistolary Typologies: Informal Layout Purity"
  },
  {
    passage: "A Basic 9 student dates an application letter to the Ghana Education Service as: '25th September 2026,'.",
    question: "What punctuation flaw exists in this date?",
    options: [
      "Placing a comma after the year instead of a period (in closed style) or omitting it (in open style)",
      "Using ordinal letters after the cardinal day number",
      "Capitalizing the initial letter of September",
      "Writing the day before the month"
    ],
    answer: "Placing a comma after the year instead of a period (in closed style) or omitting it (in open style)",
    hint: "A comma should never terminate the year in an epistolary date line.",
    solution: "A date line must never end with a trailing comma. In closed punctuation, the year terminates with a full stop ('25th September, 2026.'), while in open style no punctuation is used ('25 September 2026').",
    target: "Epistolary Dating Laws: Terminal Comma Error"
  },
  {
    passage: "A formal petition to the Metropolitan Chief Executive opens with the salutation 'Dear Sir,'.",
    question: "Which of the following subscriptions must be used to close this petition?",
    options: ["Yours faithfully,", "Yours sincerely,", "Yours respectfully,", "Your obedient servant,"],
    answer: "Yours faithfully,",
    hint: "Impersonal formal greetings strictly command 'faithfully'.",
    solution: "When an official is saluted by an impersonal title ('Dear Sir,' or 'Dear Madam,'), the complementary close strictly mandates 'Yours faithfully,'.",
    target: "Complementary Close Co-occurrence Constraint"
  },
  {
    passage: "A student writes a formal letter caption as: <u>APPLICATION FOR ADMISSION AS A GENERAL SCIENCE STUDENT</u>.",
    question: "Under WAEC marking rubrics, what is the typographical error?",
    options: [
      "Underlining a heading written in full block capital letters",
      "Using block capital letters instead of title case",
      "Omitting quotation marks around the heading",
      "Failing to indent the heading five spaces from the margin"
    ],
    answer: "Underlining a heading written in full block capital letters",
    hint: "Headings in all-caps must never be underlined.",
    solution: "Under WAEC rubrics, a caption written in ALL BLOCK CAPITALS must not be underlined. Underlining is reserved strictly for Title Case headings.",
    target: "Caption Orthography: Underline Prohibition on Block Capitals"
  },
  {
    passage: "In a letter to the Headteacher, a candidate writes: 'We can't attend prep because the lights aren't working.'",
    question: "How should this sentence be revised to satisfy formal register requirements?",
    options: [
      "We cannot attend evening prep because the lighting system is not functional.",
      "We can't attend prep because the lights are totally spoiled.",
      "We couldn't come for prep because lights weren't available.",
      "We ain't coming for prep because power is off."
    ],
    answer: "We cannot attend evening prep because the lighting system is not functional.",
    hint: "Eliminate informal contractions and elevate the vocabulary.",
    solution: "Formal writing strictly bars informal contractions ('can't', 'aren't'). Writing auxiliary verbs in full ('cannot', 'is not functional') maintains standard formal register.",
    target: "Formal Register: Contraction Elimination"
  },
  {
    passage: "A student signs off a formal letter with: 'Yours faithfully, \\n Kwame Mensah \\n Senior Prefect'.",
    question: "What essential element of the quadripartite sign-off is missing?",
    options: [
      "The handwritten signature mark between the subscription and the printed name",
      "The telephone number of the school",
      "The date of birth of the student",
      "The residential address of the writer"
    ],
    answer: "The handwritten signature mark between the subscription and the printed name",
    hint: "Formal letters mandate a physical signature above the printed name.",
    solution: "The formal quadripartite sign-off requires: (1) Subscription, (2) Handwritten signature mark, (3) Printed full name, and (4) Official designation.",
    target: "Quadripartite Sign-off Framework: Signature Mandate"
  },
  {
    passage: "A Basic 9 candidate writes a semi-formal letter to her former English tutor, Mr. Danquah.",
    question: "Which salutation is the most appropriate and decorous?",
    options: ["Dear Mr. Danquah,", "Dear Tutor Danquah,", "Dear Sir Danquah,", "Hello Mr. Danquah,"],
    answer: "Dear Mr. Danquah,",
    hint: "Semi-formal greetings use 'Dear' followed by the title and surname.",
    solution: "Semi-formal correspondence to an adult superior requires 'Dear' followed by the recipient's title and surname: 'Dear Mr. Danquah,'.",
    target: "Semi-Formal Salutations: Surname Deference"
  },
  {
    passage: "In closed address punctuation, how must the line immediately preceding the date be punctuated?",
    question: "Identify the correct punctuation mark:",
    options: ["A full stop (period)", "A comma", "A colon", "No punctuation mark"],
    answer: "A full stop (period)",
    hint: "The last geographical entity in closed style terminates with a full stop.",
    solution: "In closed address punctuation, the final line of the address block (the administrative region or country) ends with a full stop before the date line.",
    target: "Address Architecture: Closed Punctuation Rules"
  },
  {
    passage: "A candidate applies the pure block address format.",
    question: "Where must every line in the address block begin?",
    options: [
      "Flush against the margin with no indentation",
      "Stepped progressively to the right by five spaces",
      "Centered horizontally on the page",
      "Alternating between left and right margins"
    ],
    answer: "Flush against the margin with no indentation",
    hint: "Block format aligns all text flush to a single vertical line.",
    solution: "In pure block formatting, all lines align vertically flush against the left margin of the address block without indentation.",
    target: "Address Styling: Block Alignment"
  },
  {
    passage: "Which of the following dates exemplifies accurate closed punctuation?",
    question: "Select the correctly punctuated closed date:",
    options: ["25th September, 2026.", "25 September 2026", "25th September 2026,", "September 25 2026."],
    answer: "25th September, 2026.",
    hint: "Closed style has an ordinal indicator, a comma after the month, and a period at the end.",
    solution: "In closed punctuation, the date takes an ordinal indicator ('th'), a comma following the month, and a terminal period: '25th September, 2026.'.",
    target: "Dating Orthography: Closed Style"
  },
  {
    passage: "A student writes an informal letter to her mother and signs off as: 'Your loving daughter, \\n Ama Mensah'.",
    question: "What is the structural defect in this sign-off?",
    options: [
      "Including the surname 'Mensah' in an informal letter",
      "Using 'Your loving daughter'",
      "Failing to affix an official signature",
      "Writing in title case"
    ],
    answer: "Including the surname 'Mensah' in an informal letter",
    hint: "Informal letters require first name only.",
    solution: "Informal letters to family relatives require a mononymic sign-off (first name only). Appending a surname introduces artificial social distance.",
    target: "Informal Sign-off: Mononymic Protocol"
  },
  {
    passage: "In the subscription 'Yours faithfully,', what is the capitalization rule for the second word?",
    question: "Select the correct orthographic rule:",
    options: [
      "The second word must begin with a lowercase letter ('faithfully')",
      "The second word must begin with a capital letter ('Faithfully')",
      "Both words must be in all capital letters",
      "Neither word is capitalized"
    ],
    answer: "The second word must begin with a lowercase letter ('faithfully')",
    hint: "Only the very first word in an epistolary subscription begins with a capital letter.",
    solution: "Prescriptive epistolary mechanics require that only the initial letter of the first word takes a capital letter: 'Yours faithfully,'.",
    target: "Subscription Mechanics: Lowercase Second Element"
  },
  {
    passage: "A candidate writes a Title Case heading: <u>An Appeal For Educational Infrastructure</u>.",
    question: "What minor word capitalization defect is present in this heading?",
    options: [
      "The preposition 'For' should be written in lowercase ('for')",
      "The noun 'Appeal' should be in lowercase",
      "The noun 'Infrastructure' should be in lowercase",
      "The article 'An' should be in lowercase"
    ],
    answer: "The preposition 'For' should be written in lowercase ('for')",
    hint: "Short prepositions remain lowercase in Title Case.",
    solution: "In Title Case, grammatical function words such as short prepositions ('for', 'in', 'at') and coordinating conjunctions must remain in lowercase.",
    target: "Title Case Mechanics: Preposition Casing"
  },
  {
    passage: "A student writes: 'The Headmaster together with the board members have approved the budget.'",
    question: "Why is the plural verb 'have approved' grammatically incorrect?",
    options: [
      "Because 'together with the board members' is a parenthetical quasi-coordinator that does not alter the singular head noun 'Headmaster'",
      "Because 'board members' is plural",
      "Because 'approved' is an intransitive verb",
      "Because 'budget' is singular"
    ],
    answer: "Because 'together with the board members' is a parenthetical quasi-coordinator that does not alter the singular head noun 'Headmaster'",
    hint: "Phrases introduced by 'together with' do not compound the grammatical subject.",
    solution: "Quasi-coordinators ('together with', 'as well as') introduce parenthetical adjuncts. Concord is strictly governed by the singular subject 'Headmaster', requiring 'has approved'.",
    target: "Concord Mechanics: Parenthetical Quasi-Coordinators"
  },
  {
    passage: "A formal letter addressed to a newspaper editor has the inside address: 'The Editor, Daily Graphic, P.O. Box 742, Accra.'.",
    question: "What is the standard salutation for this letter?",
    options: ["Dear Sir, / Sir,", "Dear Editor Mensah,", "Hello Daily Graphic,", "Dear Mr. Editor,"],
    answer: "Dear Sir, / Sir,",
    hint: "Letters to the press use 'Dear Sir,' or 'Sir,'.",
    solution: "In letters addressed to the editor of a newspaper, standard journalistic protocol mandates 'Dear Sir,' or simply 'Sir,'.",
    target: "Letters to the Editor: Salutation Norms"
  },
  {
    passage: "In a formal quadripartite sign-off, where is the writer's handwritten signature placed?",
    question: "Select the correct location:",
    options: [
      "Between the subscription ('Yours faithfully,') and the printed full name",
      "Directly below the official designation on the fifth line",
      "At the top right corner next to the date",
      "Inside the body of the final paragraph"
    ],
    answer: "Between the subscription ('Yours faithfully,') and the printed full name",
    hint: "The handwritten signature occupies the second line of the four-tier sign-off.",
    solution: "The formal quadripartite sign-off places the handwritten signature on the second line, directly between the subscription and the printed full name.",
    target: "The Quadripartite Sign-off Framework: Signature Placement"
  },
  {
    passage: "Which of the following subscriptions contains an ungrammatical apostrophe?",
    question: "Identify the flawed subscription:",
    options: ["Your's faithfully,", "Yours faithfully,", "Your sincere friend,", "Your loving son,"],
    answer: "Your's faithfully,",
    hint: "Possessive pronouns never take apostrophes.",
    solution: "The possessive pronoun 'Yours' does not take an apostrophe. Writing 'Your's' is an error penalized under Mechanical Accuracy.",
    target: "Subscription Mechanics: Apostrophe Prohibition"
  },
  {
    passage: "A pupil opens an informal letter to a friend with: 'Dear Sir, I write to inform you that our school will celebrate its speech day.'",
    question: "What is the major stylistic defect in this opening?",
    options: [
      "Severe register clash: using the formal salutation 'Dear Sir,' in a friendly personal letter",
      "Using the first-person pronoun 'I'",
      "Failing to write in the past tense",
      "Omitting the recipient's school name"
    ],
    answer: "Severe register clash: using the formal salutation 'Dear Sir,' in a friendly personal letter",
    hint: "'Dear Sir,' is strictly formal and inappropriate for friends.",
    solution: "Using 'Dear Sir,' in a letter to a school peer creates an absurd register clash. Informal letters require familiar salutations such as 'Dear Kwame,'.",
    target: "Epistolary Register Traps: Salutation Incongruity"
  },
  {
    passage: "What is the primary function of the opening paragraph in a formal administrative letter?",
    question: "Select the primary function:",
    options: [
      "To state the purpose of the letter directly and concisely without personal pleasantries",
      "To enquire about the recipient's family and health",
      "To describe the author's hobbies and background",
      "To apologize for disturbing the recipient's schedule"
    ],
    answer: "To state the purpose of the letter directly and concisely without personal pleasantries",
    hint: "Formal letters declare their business immediately in sentence 1.",
    solution: "A formal administrative opening states the core purpose and context directly in sentence 1, omitting conversational pleasantries.",
    target: "Formal Preamble: Direct Purpose Declaration"
  },
  {
    passage: "In an address block using open punctuation, how are line ends punctuated?",
    question: "Select the open punctuation rule:",
    options: [
      "No terminal commas or periods are placed at the ends of the address lines",
      "Every line must end with a semicolon",
      "Lines must end with alternating periods and commas",
      "A comma must terminate every single line"
    ],
    answer: "No terminal commas or periods are placed at the ends of the address lines",
    hint: "Open punctuation removes end-of-line marks.",
    solution: "Pure open punctuation omits all terminal commas and full stops from the ends of address lines throughout the block.",
    target: "Address Architecture: Open Punctuation Standard"
  },
  {
    passage: "A student writes a letter to his uncle requesting financial support for textbooks.",
    question: "Under which epistolary category does this letter fall?",
    options: ["Informal letter", "Formal administrative petition", "Semi-formal query", "Commercial contract"],
    answer: "Informal letter",
    hint: "Letters to family members are informal.",
    solution: "Correspondence addressed to family members (aunts, uncles, parents, siblings) is categorized as an informal letter, even when requesting financial assistance.",
    target: "Epistolary Taxonomy: Familial Correspondence"
  },
  {
    passage: "Which of the following salutations is strictly prohibited in an informal letter to a school classmate?",
    question: "Identify the prohibited salutation:",
    options: ["Dear Sir,", "Dear Kofi,", "Dearest Ama,", "Dear Friend,"],
    answer: "Dear Sir,",
    hint: "Administrative titles must never be used with peers.",
    solution: "'Dear Sir,' is an impersonal administrative salutation and cannot be used in friendly personal correspondence.",
    target: "Salutation Restrictions: Peer Correspondence"
  },
  {
    passage: "In a formal letter, where must the recipient's inside address begin?",
    question: "Select the correct location:",
    options: [
      "On the left-hand margin, starting one or two lines below the level of the sender's date line",
      "At the top right corner above the sender's address",
      "Centered on the sheet directly above the caption",
      "At the bottom of the page below the signature"
    ],
    answer: "On the left-hand margin, starting one or two lines below the level of the sender's date line",
    hint: "The inside address belongs on the left margin below the date line.",
    solution: "In standard two-address formal layouts, the recipient's inside address begins flush on the left margin, one or two lines below the sender's date line.",
    target: "Formal Architecture: Inside Address Placement"
  },
  {
    passage: "What is the structural role of the final paragraph in a formal petition?",
    question: "Identify the concluding function:",
    options: [
      "To summarize the formal prayer or requested remedial action and express polite anticipation",
      "To introduce brand new grievances not mentioned in the body",
      "To enquire about the recipient's weekend plans",
      "To apologize for writing a lengthy letter"
    ],
    answer: "To summarize the formal prayer or requested remedial action and express polite anticipation",
    hint: "Petitions conclude with an explicit appeal for administrative action.",
    solution: "The final paragraph of a petition articulates the 'prayer'—the specific administrative remedy demanded—and expresses polite expectation of prompt action.",
    target: "Civic Petitions: The Prayer Clause"
  },
  {
    passage: "Which of the following subscriptions is suitable for concluding an informal letter to a classmate?",
    question: "Select the appropriate informal subscription:",
    options: ["Your sincere friend,", "Yours faithfully,", "I remain, your obedient servant,", "Respectfully submitted,"],
    answer: "Your sincere friend,",
    hint: "Informal subscriptions express warmth and peer friendship.",
    solution: "'Your sincere friend,' is an appropriate informal subscription for peer letters. 'Yours faithfully,' belongs strictly to formal discourse.",
    target: "Informal Subscriptions: Peer Warmth"
  },
  {
    passage: "A student writes: 'I write to respectfully apply for permission to organize an educational excursion.'",
    question: "What register is demonstrated in this sentence?",
    options: ["Formal administrative register", "Informal conversational slang", "Poetic archaic register", "Colloquial dialect"],
    answer: "Formal administrative register",
    hint: "Uncontracted, polite, and direct phrasing reflects a formal register.",
    solution: "The sentence is direct, uncontracted, and deferential, representing the standard formal administrative register.",
    target: "Epistolary Registers: Formal Tone Identification"
  },
  {
    passage: "Why is it an error to write a caption as: <u>APPLICATION FOR ADMISSION</u>?",
    question: "Identify the typographical flaw:",
    options: [
      "Captions written in ALL CAPITAL LETTERS must not be underlined",
      "Captions must always be written in lowercase",
      "Captions must only be placed inside the body paragraphs",
      "Captions must end with an exclamation mark"
    ],
    answer: "Captions written in ALL CAPITAL LETTERS must not be underlined",
    hint: "Underlining is reserved for Title Case headings.",
    solution: "Under WAEC marking guidelines, underlining a caption written in ALL BLOCK CAPITALS is a mechanical defect. Underlining belongs exclusively to Title Case.",
    target: "Caption Typography: Block Capital Underlining Ban"
  },
  {
    passage: "Which of the following subscriptions is correctly paired with the salutation 'Dear Mr. Owusu,'?",
    question: "Select the matching subscription:",
    options: ["Yours sincerely,", "Yours faithfully,", "Yours affectionately,", "Your brother,"],
    answer: "Yours sincerely,",
    hint: "Salutations using a personal surname mandate 'Yours sincerely,'.",
    solution: "When the recipient is saluted by surname ('Dear Mr. Owusu,'), the subscription must be 'Yours sincerely,'.",
    target: "Co-occurrence Constraint: Named Salutations"
  },
  {
    passage: "A student writes: 'We ain't got no computers in our school lab.'",
    question: "How should this sentence be revised for a formal letter to a headmaster?",
    options: [
      "Our school computer laboratory currently lacks functioning desktop computers.",
      "We don't have no computers in the school lab.",
      "Computers are ain't available in our laboratory.",
      "There is no computers nowhere in our school lab."
    ],
    answer: "Our school computer laboratory currently lacks functioning desktop computers.",
    hint: "Use formal, elevated vocabulary without double negatives or slang.",
    solution: "'Our school computer laboratory currently lacks functioning desktop computers' replaces colloquial double negatives with precise, elevated formal vocabulary.",
    target: "Formal Lexical Elevation"
  },
  {
    passage: "Where is the writer's address placed in the traditional slanted (indented) format?",
    question: "Select the correct position:",
    options: ["At the top right-hand corner of the page", "At the bottom left-hand corner", "Centered in the middle of the sheet", "Below the salutation on the left margin"],
    answer: "At the top right-hand corner of the page",
    hint: "The sender's address in traditional epistolary layout is at the top right.",
    solution: "In traditional epistolary formatting, the sender's address and date are positioned at the top right-hand corner of the sheet.",
    target: "Address Layout: Slanted Format Placement"
  },
  {
    passage: "A student ends an informal letter with: 'Your's Ever, Kwabena'.",
    question: "What two mechanical errors are present in 'Your's Ever'?",
    options: [
      "An erroneous apostrophe in 'Yours' and incorrect capitalization of 'Ever'",
      "Misspelling of Kwabena and lack of a period",
      "Using capital letters throughout",
      "Omitting a handwritten signature"
    ],
    answer: "An erroneous apostrophe in 'Yours' and incorrect capitalization of 'Ever'",
    hint: "Possessive pronouns have no apostrophe, and the second word of a closing is lowercase.",
    solution: "'Yours' never takes an apostrophe, and the second word of a subscription must begin with a lowercase letter: 'Yours ever,'.",
    target: "Subscription Mechanics: Apostrophe and Casing Errors"
  },
  {
    passage: "What is the penalty for omitting the date in an epistolary composition in a WAEC examination?",
    question: "How is an omitted date evaluated?",
    options: [
      "A mandatory mark deduction under Organization/Format",
      "Immediate cancellation of the script",
      "A deduction under Content only",
      "No penalty is applied"
    ],
    answer: "A mandatory mark deduction under Organization/Format",
    hint: "The date is a required structural feature of the address block.",
    solution: "In WAEC marking schemes, omitting the date constitutes an incomplete address block, resulting in a mandatory mark deduction under Organization.",
    target: "Epistolary Scoring Rubrics: Format Deductions"
  },
  {
    passage: "A formal petition is addressed to: 'The Honourable Minister, Ministry of Roads and Highways, Accra.'.",
    question: "Which salutation is most appropriate for this state dignitary?",
    options: ["Honourable Sir, / Dear Sir,", "Dear Minister Kwame,", "Hello Boss,", "Dear Uncle Minister,"],
    answer: "Honourable Sir, / Dear Sir,",
    hint: "Ministers of state are formally saluted as 'Honourable Sir,' or 'Dear Sir,'.",
    solution: "In formal correspondence to a government minister, 'Honourable Sir,' or 'Dear Sir,' is the required respectful formal salutation.",
    target: "Administrative Salutations: Ministers of State"
  },
  {
    passage: "Which of the following represents the correct format for an inside address in closed punctuation?",
    question: "Identify the properly punctuated inside address:",
    options: [
      "The Headteacher,\nPrempeh College Basic School,\nP.O. Box 192,\nKumasi.",
      "The Headteacher\nPrempeh College Basic School\nP.O. Box 192\nKumasi,",
      "To My Headteacher,\nAt Kumasi School.",
      "Headteacher P.O. Box 192 Kumasi."
    ],
    answer: "The Headteacher,\nPrempeh College Basic School,\nP.O. Box 192,\nKumasi.",
    hint: "Each line ends with a comma, and the final line ends with a period.",
    solution: "A standard inside address in closed style lists the official title, institution, postal address, and destination town, punctuated with commas and a terminal period.",
    target: "Formal Architecture: Inside Address Format"
  },
  {
    passage: "In an informal letter, which of the following is an acceptable conversational opening?",
    question: "Select the appropriate conversational opening:",
    options: [
      "It was delightful to receive your letter last Friday.",
      "With reference to your memo of even date.",
      "I acknowledge receipt of your communication.",
      "Pursuant to our previous official discussion."
    ],
    answer: "It was delightful to receive your letter last Friday.",
    hint: "Informal letters open with warm, natural conversational language.",
    solution: "'It was delightful to receive your letter...' is natural and warm, matching the informal register.",
    target: "Informal Openings: Conversational Tone"
  },
  {
    passage: "A student writes a formal letter and spells the subscription as: 'Yours Faithfully,'.",
    question: "What is the mechanical flaw in this subscription?",
    options: [
      "The letter 'F' in 'Faithfully' should be in lowercase ('faithfully')",
      "The word 'Yours' should be in lowercase",
      "There should be no comma after the subscription",
      "The subscription should be written in capital letters"
    ],
    answer: "The letter 'F' in 'Faithfully' should be in lowercase ('faithfully')",
    hint: "Only the initial letter of the subscription is capitalized.",
    solution: "In standard epistolary rules, only the first word begins with a capital letter: 'Yours faithfully,'. Capitalizing 'Faithfully' is an error.",
    target: "Subscription Orthography: Casing Rules"
  },
  {
    passage: "Which type of correspondence requires a caption (subject heading)?",
    question: "Identify the letter types that mandate a caption:",
    options: [
      "Formal letters, administrative petitions, and semi-formal letters",
      "Only informal letters to siblings",
      "Only letters to pen pals",
      "No English letter requires a heading"
    ],
    answer: "Formal letters, administrative petitions, and semi-formal letters",
    hint: "Business, administrative, and functional letters state their subject in a heading.",
    solution: "Formal letters, petitions, and institutional semi-formal letters require a clear caption to announce their administrative purpose.",
    target: "Epistolary Conventions: Caption Mandate"
  },
  {
    passage: "A candidate writes the sender's address in full block style and indents the date by five spaces.",
    question: "What layout error has been committed?",
    options: [
      "Inconsistent layout: mixing blocked and indented styles",
      "Omitting the date",
      "Using capital letters",
      "Writing on the right margin"
    ],
    answer: "Inconsistent layout: mixing blocked and indented styles",
    hint: "In blocked style, every line must align flush against the same margin.",
    solution: "In pure block formatting, all lines including the date must align flush against the margin. Indenting the date introduces layout inconsistency.",
    target: "Layout Consistency: Block Formatting Rules"
  },
  {
    passage: "Which of the following represents an appropriate sign-off for a letter written by a school prefect on behalf of the student body?",
    question: "Select the complete quadripartite sign-off:",
    options: [
      "Yours faithfully,\n[Signature]\nFrancis Appiah\nSenior Prefect",
      "Yours sincerely,\nFrancis",
      "Your friend,\nFrancis Appiah (Senior Prefect)",
      "Faithfully yours,\n[Signature]"
    ],
    answer: "Yours faithfully,\n[Signature]\nFrancis Appiah\nSenior Prefect",
    hint: "Official student representation requires subscription, signature, printed name, and designation.",
    solution: "The full formal sign-off includes subscription, signature, printed full name, and official designation across four distinct vertical lines.",
    target: "The Quadripartite Sign-off Framework: Prefectorial Sign-off"
  },
  {
    passage: "A student writes to his uncle: 'I am writing this letter to you because I need some money for my exams.'",
    question: "How can this sentence be made more polite and appropriate for an informal family letter?",
    options: [
      "I hope this letter finds you well. I write to humbly ask if you could assist me with funds for my upcoming examination registration.",
      "Send me money immediately for my exam fees.",
      "Give me cash right now because exam registration has started.",
      "I demand financial subventions from your office."
    ],
    answer: "I hope this letter finds you well. I write to humbly ask if you could assist me with funds for my upcoming examination registration.",
    hint: "Requests to family elders must balance personal warmth with respect.",
    solution: "Combining an enquiry about health with a polite, respectful request reflects appropriate familial etiquette.",
    target: "Familial Register: Respectful Requests"
  },
  {
    passage: "When a formal letter has a caption written in Title Case, what must be done to it?",
    question: "State the rule for Title Case captions:",
    options: [
      "It must be underlined across its entire length",
      "It must be placed in quotation marks",
      "It must be written in bold red ink",
      "It must be left completely un-underlined"
    ],
    answer: "It must be underlined across its entire length",
    hint: "Title Case headings require an underline.",
    solution: "In formal British/WAEC orthography, any caption written in Title Case (Initial Capitals) must be neatly underlined.",
    target: "Caption Typography: Title Case Underlining"
  },
  {
    passage: "Which of the following salutations is inappropriate for an informal letter to an elder sister?",
    question: "Select the inappropriate salutation:",
    options: ["Dear Madam,", "Dear Sister Akosua,", "Dearest Sister,", "Dear Akosua,"],
    answer: "Dear Madam,",
    hint: "'Dear Madam,' is an impersonal administrative salutation unsuitable for family.",
    solution: "'Dear Madam,' creates distant administrative formality that is inappropriate in a letter to an elder sister.",
    target: "Familial Salutations: Inappropriate Formality"
  },
  {
    passage: "A student writes an informal letter and uses contractions such as 'I'll', 'we've', and 'don't'.",
    question: "Are these contractions acceptable in this context?",
    options: [
      "Yes, contractions are fully acceptable in informal personal letters",
      "No, contractions are strictly banned in all types of letters",
      "They are permitted only in the address block",
      "They are allowed only in letters to teachers"
    ],
    answer: "Yes, contractions are fully acceptable in informal personal letters",
    hint: "Natural contractions reflect the conversational register of informal correspondence.",
    solution: "Informal letters reflect natural conversational speech; appropriate verb contractions ('I'll', 'we've') are fully permitted and expected.",
    target: "Informal Register: Contraction Permissibility"
  },
  {
    passage: "What is the correct punctuation mark following the salutation 'Dear Sir,' in a formal letter?",
    question: "Identify the correct punctuation mark:",
    options: ["A comma", "A colon", "A semicolon", "A period"],
    answer: "A comma",
    hint: "Standard WAEC convention places a comma after the salutation.",
    solution: "In standard British and West African epistolary syntax, salutations terminate with a comma: 'Dear Sir,'.",
    target: "Salutation Mechanics: Terminal Comma"
  },
  {
    passage: "A formal petition begins with: 'We, the undersigned executive members of the Youth Development Association...'",
    question: "What rhetorical purpose does this opening clause serve?",
    options: [
      "It establishes the legal and representational standing of the petitioners",
      "It apologizes for writing the petition",
      "It lists the personal hobbies of the writers",
      "It states the weather conditions in the community"
    ],
    answer: "It establishes the legal and representational standing of the petitioners",
    hint: "Petitions open by clarifying who is writing and on whose authority.",
    solution: "In administrative petitions, the preamble formally identifies the petitioners and establishes their representational authority before presenting grievances.",
    target: "Civic Petitions: Preamble Standing"
  },
  {
    passage: "Which of the following is the most suitable concluding sentence for an informal letter to a friend?",
    question: "Select the best informal conclusion:",
    options: [
      "Please give my warmest regards to your parents and write back soon.",
      "I anticipate your prompt official response to my requisition.",
      "I remain, your obedient servant.",
      "Submit your reply within fourteen working days."
    ],
    answer: "Please give my warmest regards to your parents and write back soon.",
    hint: "Informal conclusions send warm regards to family members and encourage a reply.",
    solution: "Sending friendly greetings to family and inviting a response is the standard concluding convention for personal letters.",
    target: "Informal Valedictions: Familial Regards"
  },
  {
    passage: "In a formal letter, why must words like 'cannot' and 'will not' be written in full?",
    question: "State the rule regarding formal register:",
    options: [
      "Because formal correspondence prohibits contracted verb forms",
      "Because contractions save too much paper",
      "Because full words are easier to read aloud",
      "Because contractions are only used in poetry"
    ],
    answer: "Because formal correspondence prohibits contracted verb forms",
    hint: "Uncontracted forms preserve the objective dignity of formal discourse.",
    solution: "Writing auxiliary verbs in full ('cannot', 'will not') maintains the dignity, precision, and objectivity required in formal writing.",
    target: "Formal Register: Contraction Ban"
  },
  {
    passage: "A student writes a letter to his school principal and signs off: 'Your affectionate friend, \\n Kwame'.",
    question: "What is the primary error in this closing?",
    options: [
      "Using an overly familiar informal subscription for a formal school head",
      "Failing to write in red ink",
      "Using the name Kwame",
      "Writing the closing on the left margin"
    ],
    answer: "Using an overly familiar informal subscription for a formal school head",
    hint: "A student writing to a principal must use formal or semi-formal subscriptions.",
    solution: "Signing off as 'Your affectionate friend' to a school principal is a serious register breach. The student must use 'Yours faithfully,' with a full formal signature.",
    target: "Register Alignment: Subscription Traps"
  },
  {
    passage: "Which of the following headings demonstrates an error by including terminal punctuation?",
    question: "Identify the incorrectly punctuated heading:",
    options: [
      "APPLICATION FOR EMPLOYMENT AS A TEACHING ASSISTANT.",
      "APPLICATION FOR EMPLOYMENT AS A TEACHING ASSISTANT",
      "<u>Application for Employment as a Teaching Assistant</u>",
      "Application for Employment as a Teaching Assistant (underlined)"
    ],
    answer: "APPLICATION FOR EMPLOYMENT AS A TEACHING ASSISTANT.",
    hint: "Headings must never end with a period (full stop).",
    solution: "Headings and captions are titles, not complete grammatical sentences. Ending a caption with a full stop is a mechanical error.",
    target: "Caption Mechanics: Terminal Period Prohibition"
  },
  {
    passage: "Under WAEC marking rubrics, what are the four criteria used to score an essay?",
    question: "Identify the four standard evaluation criteria:",
    options: [
      "Content (10), Organization (5), Expression (10), Mechanical Accuracy (5)",
      "Handwriting (10), Length (10), Speed (5), Neatness (5)",
      "Vocabulary (15), Grammar (10), Punctuation (5), Spelling (0)",
      "Introduction (10), Body (10), Conclusion (5), Title (5)"
    ],
    answer: "Content (10), Organization (5), Expression (10), Mechanical Accuracy (5)",
    hint: "The four WAEC dimensions total 30 marks.",
    solution: "The standard BECE/WAEC essay rubric allocates marks across four dimensions: Content (10 marks), Organization (5 marks), Expression (10 marks), and Mechanical Accuracy (5 marks), totaling 30 marks.",
    target: "WAEC Assessment Rubric: Four-Tier Structure"
  },
  {
    passage: "What is the maximum penalty ceiling for Mechanical Accuracy under the 30-mark WAEC essay rubric?",
    question: "Select the maximum penalty ceiling:",
    options: [
      "5 marks (errors are penalized 1/2 mark each up to the 5-mark total)",
      "10 marks",
      "15 marks",
      "There is no ceiling; candidates can receive negative marks"
    ],
    answer: "5 marks (errors are penalized 1/2 mark each up to the 5-mark total)",
    hint: "Mechanical Accuracy has a ceiling of 5 marks under the WAEC rubric.",
    solution: "Under WAEC/BECE marking guidelines, Mechanical Accuracy carries 5 marks. Distinct errors deduct 1/2 mark each until the 5-mark ceiling is exhausted.",
    target: "WAEC Rubrics: Scoring Ceilings"
  }
];

// =========================================================================
// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)
// Basic 9 Foundation Scaffolds & Model Letters (~250 words each)
// Aligned with WAEC / BECE Final Year Foundation Expectations
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Informal: Managing Final Year BECE Preparation Stress
  {
    id: "B9_S4_F_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Informal Letter",
    title: "BECE Preparation & Coping Strategies",
    shortSummary: "Write to a cousin in another school describing your BECE study schedule and handling revision pressure.",
    prompt: "As a Basic 9 candidate preparing for the Basic Education Certificate Examination (BECE), you have adopted a rigorous revision routine to excel. Write a letter to your cousin who attends another junior high school, describing your daily study timetable, explaining how you are mastering challenging subjects like Integrated Science and Mathematics, and sharing advice on avoiding burnout.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Academic Exposition, Time Management Narrative & Familial Sibling Rapport",
    learningCompetency: "B9.4.2.1.1: Compose friendly personal letters articulating structured exam revision routines, subject remediation, and psychological stress management.",
    hint: "Use single address formatting. Describe your study timetable realistically. Offer genuine advice on staying calm. Conclude with an affectionate closing and your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Presbyterian Junior High School,", "P.O. Box 18,", "Akropong-Akuapem,", "Eastern Region.", "14th October, 2026."],
        allowedDatingFormats: ["14th October, 2026", "14 October 2026"],
        prohibitedDatingFormats: ["14/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Kwaku,",
        permissibleSalutations: ["Dear Kwaku,", "Dearest Kwaku,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his health and studies, and introduce the shared pressure of final-year BECE prep.", transitionHints: ["I hope this letter finds you well...", "As we count down the final months to our BECE, the academic pressure has..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe your daily revision routine and peer group past-question solving sessions.", transitionHints: ["To ensure thorough coverage of all nine subjects, I designed a disciplined daily schedule...", "Every morning before dawn, and during weekend study circles, we solve..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Explain how you tackle tough topics in Mathematics and Science while avoiding mental exhaustion.", transitionHints: ["Whenever I encounter challenging algebraic proofs or chemical formulas...", "To prevent burnout, I make sure to take short breaks and sleep for at least..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Offer encouraging words for his own preparation and ask him to share his study tips.", transitionHints: ["Believe in your hard work and stay consistent...", "Please give my warmest regards to Auntie Akua and write back soon..."] }
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
      ["Warm opening and BECE preparation context established (2 marks)", "Detailed account of revision schedule and difficult subject remediation (4 marks)", "Practical burnout prevention advice and encouragement (4 marks)"],
      ["Cousin acknowledged warmly", "Study routine described clearly", "Burnout advice articulated cleanly"],
      ["Single address format correctly styled (1 mark)", "Familial salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct address layout", "Consistent punctuation", "First name only at closing"],
      ["Warm, natural conversational tone (4 marks)", "Permissible contractions used naturally (3 marks)", "Varied sentence patterns and academic vocabulary (3 marks)"],
      ["Friendly tone without slang", "Clear transitions", "Good sentence variety"]
    ),
    modelAnswer: `Presbyterian Junior High School,\nP.O. Box 18,\nAkropong-Akuapem,\nEastern Region.\n14th October, 2026.\n\nDear Kwaku,\n\nI hope this letter finds you in high spirits and good health in Koforidua. It has been several weeks since we last caught up. As we count down the final terms to our Basic Education Certificate Examination (BECE), the pressure to excel has intensified across every classroom, prompting me to write and share how I am managing the workload.\n\nTo ensure I cover the entire syllabus thoroughly, I designed a structured daily revision timetable. I wake up at 4:30 a.m. each morning to revise Integrated Science and Social Studies while my mind is completely clear. In the evenings, after completing regular school assignments, I dedicate two hours to solving past BECE questions in Mathematics and English Language. Working through past Chief Examiners' reports has helped me identify common pitfalls, particularly in algebraic word problems and grammatical concord.\n\nHowever, preparing for nine subjects simultaneously can quickly lead to mental exhaustion if one is not careful. Whenever I feel overwhelmed by difficult physics formulas or chemical equations, I practice the twenty-minute focus method: twenty minutes of deep concentration followed by a five-minute walk around the compound to stretch. In addition, I ensure I sleep for at least seven hours each night and eat balanced meals. Adequate rest keeps my memory sharp and prevents the crippling anxiety that many of our classmates are battling.\n\nStay disciplined and believe in your preparation, Kwaku. We have worked hard for three years, and our efforts will surely be rewarded with grade ones.\n\nPlease extend my warmest greetings to Uncle Kwame and the family. Write back soon and share your own study techniques!\n\nYour loving cousin,\nEmmanuel`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Informal: Choosing a Secondary School and Career Path
  {
    id: "B9_S4_F_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Informal Letter",
    title: "Senior High School Selection & Career Vision",
    shortSummary: "Write to a friend discussing your Senior High School placement choices and career goals.",
    prompt: "The computerized school selection process for Basic 9 candidates has commenced. Write a letter to your friend in another district, explaining the Senior High School you have chosen as your first choice, describing the elective program you intend to study, and sharing your long-term career aspirations.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Career Narrative, Secondary School Selection & Peer Rapport",
    learningCompetency: "B9.4.2.1.1: Compose personal letters discussing secondary school choices, elective combinations, and career ambitions using appropriate informal conventions.",
    hint: "Use single address formatting. Justify your school choice convincingly. Conclude with an affectionate closing and your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Anglican Junior High School,", "P.O. Box 77,", "Sunyani,", "Bono Region.", "20th October, 2026."],
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
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his preparation and introduce the ongoing school selection exercise.", transitionHints: ["I hope you are doing wonderfully in school...", "Our teachers just concluded the computerized school selection guidance session..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Name your first-choice secondary school and explain why you selected it (facilities, academic pedigree).", transitionHints: ["For my first choice, I selected Prempeh College in Kumasi...", "The school boasts state-of-the-art science laboratories and an illustrious academic tradition..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Detail the elective subjects you will study and link them to your future career.", transitionHints: ["I have opted for the General Science program, specifically Physics, Chemistry, and Elective Mathematics...", "This combination will prepare me to pursue biomedical engineering at university..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Ask about his own school selections and wish him success in the upcoming exams.", transitionHints: ["Which schools did you choose for your category selections?...", "Write back soon and let me know your choices..."] }
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
      ["Warm opening and school selection context established (2 marks)", "First-choice secondary school justified clearly (4 marks)", "Elective program and career link articulated convincingly (4 marks)"],
      ["Friend acknowledged warmly", "School choice justified", "Career aspiration explained"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Lively, purposeful, and natural tone (4 marks)", "Natural conversational flow (3 marks)", "Apt academic and career vocabulary (3 marks)"],
      ["Enthusiastic tone", "Smooth narrative transitions", "Clear vocabulary"]
    ),
    modelAnswer: `Anglican Junior High School,\nP.O. Box 77,\nSunyani,\nBono Region.\n20th October, 2026.\n\nDear Selorm,\n\nI hope this letter finds you well and making great strides in your BECE preparation. Here in Sunyani, our teachers just completed the orientation exercise for the Computerized School Selection and Placement System (CSSPS), and I could not wait to share my choices with you!\n\nFor my first-choice Category A institution, I selected Prempeh College in Kumasi. I have admired the school ever since our senior debaters participated in a competition on their magnificent campus. The institution boasts modern integrated science laboratories, a well-stocked library, and an enviable track record of academic excellence in the National Science and Mathematics Quiz. Studying in such a competitive and inspiring environment will push me to achieve my highest potential.\n\nI have opted for the General Science program, selecting Physics, Chemistry, Biology, and Elective Mathematics. My ultimate career aspiration is to become a biomedical engineer, designing affordable diagnostic devices and prosthetic limbs for public hospitals in Ghana. Mastery of physical sciences and advanced mathematics is essential to laying the groundwork for this discipline.\n\nMy parents fully support my choices and have urged me to maintain disciplined study habits to secure the single-digit aggregate required for admission.\n\nWhich secondary schools did you pick for your first and second choices? Write back soon and share your selections with me!\n\nYour sincere friend,\nKwame`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Semi-Formal: Request to Form Master for Study Group Permission
  {
    id: "B9_S4_F_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Semi-Formal Letter",
    title: "Permission for After-School BECE Study Group",
    shortSummary: "Write to your Form Master requesting permission to use an empty classroom for after-school revision.",
    prompt: "You and five classmates have formed a peer study group to solve past BECE questions in Mathematics and Integrated Science. Write a semi-formal letter to your Form Master, Mr. Okyere, explaining the purpose of the study group, requesting permission to use Classroom 9A between 3:30 p.m. and 5:00 p.m. on weekdays, and guaranteeing good conduct and cleanliness.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Academic Request, Deferential Justification & Underlined Title Case Caption",
    learningCompetency: "B9.4.2.1.2: Compose semi-formal requests adhering to respectful registers, surname salutations, underlined Title Case captions, and 'Yours sincerely,' subscriptions.",
    hint: "Salute with 'Dear Mr. Okyere,'. Provide an underlined Title Case caption. Detail study hours, subjects, and property protection pledges. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 9 Study Syndicate,", "Methodist Junior High School,", "P.O. Box 55,", "Cape Coast,", "Central Region.", "25th October, 2026."],
        allowedDatingFormats: ["25th October, 2026", "25 October 2026"],
        prohibitedDatingFormats: ["25/10/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Okyere,",
        permissibleSalutations: ["Dear Mr. Okyere,", "Dear Form Master,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for Permission to Use Classroom 9A for Peer Study Group",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Respectfully state the purpose of the letter and introduce the six-member BECE study syndicate.", transitionHints: ["I write on behalf of our six-member peer study group to respectfully seek...", "With the upcoming BECE examinations approaching, we wish to request..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain the academic focus of the group (Mathematics, Integrated Science, Chief Examiners' reports).", transitionHints: ["Our study group is focused on solving past examination papers and reviewing...", "By working collaboratively on difficult algebraic and scientific topics, we hope to..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State the requested hours (3:30 p.m. to 5:00 p.m., Monday to Thursday) and make a solemn conduct and cleanliness pledge.", transitionHints: ["We humbly request permission to use Classroom 9A from 3:30 p.m. to 5:00 p.m....", "We solemnly assure you that all classroom furniture will be kept orderly and the lights turned off..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Express gratitude for his continuous guidance and anticipate his approval.", transitionHints: ["We remain profoundly grateful for your tireless encouragement...", "Thank you very much for your understanding and continuous support..."] }
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
      ["Study group purpose stated clearly (2 marks)", "Academic focus and past question review explained (4 marks)", "Times, days, and classroom care pledged (4 marks)"],
      ["Purpose clear in opening", "Study plan documented", "Classroom cleanliness guaranteed"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Caption underlined", "Correct subscription", "Full printed name without signature"],
      ["Respectful, dignified semi-formal tone (4 marks)", "No informal contractions (3 marks)", "Clear academic vocabulary (3 marks)"],
      ["Courteous phrasing throughout", "Zero slang", "Clear sentence structure"]
    ),
    modelAnswer: `Basic 9 Study Syndicate,\nMethodist Junior High School,\nP.O. Box 55,\nCape Coast,\nCentral Region.\n25th October, 2026.\n\nDear Mr. Okyere,\n\nRequest for Permission to Use Classroom 9A for Peer Study Group\n_______________________________________________________________\n\nI write on behalf of our six-member Basic 9 peer revision group to respectfully seek your permission to utilize Classroom 9A for after-school study sessions ahead of the upcoming BECE examinations.\n\nTo ensure that we enter the final examination hall with total confidence, our syndicate has organized structured daily revision sessions dedicated to solving past WAEC objective and theory questions. We focus specifically on complex topics in Mathematics, such as trigonometry and vectors, as well as practical experimental setups in Integrated Science. Collaborative peer discussions have already helped us clarify misconceptions and master the Chief Examiners' marking criteria.\n\nWe humbly request permission to use Classroom 9A from Monday to Thursday, between 3:30 p.m. and 5:00 p.m., beginning on Monday, 2nd November, 2026. We solemnly assure you that our members will maintain absolute discipline and silence throughout our sessions. Furthermore, we promise to arrange all desks neatly, clean the chalkboard, sweep the floor, and switch off all ceiling fans before vacating the classroom each afternoon.\n\nYour mentorship has been a continuous inspiration to our class, and we would be honored if you could occasionally review our progress.\n\nThank you very much for your patience, guidance, and anticipated approval.\n\nYours sincerely,\nJustice Mensah`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Formal: Application for Head Prefect
  {
    id: "B9_S4_F_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Formal Letter",
    title: "Application for the Office of Head Prefect",
    shortSummary: "Apply to the Headmaster for appointment as the School Head Prefect.",
    prompt: "Nominations have been opened for the senior prefectorial board. Write a formal letter of application to your Headmaster, applying to be considered for the position of Head Prefect. State your academic achievements, outline your past leadership record, and propose two constructive initiatives to promote student discipline and academic excellence.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Leadership Exposition & Quadripartite Close",
    learningCompetency: "B9.4.2.1.2: Compose formal administrative applications demonstrating leadership philosophy, institutional vision, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Basic 9 Stream A Secretariat,", "Opoku Ware Basic School,", "P.O. Box 700,", "Kumasi,", "Ashanti Region.", "28th October, 2026."],
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
        modelCaption: "APPLICATION FOR THE OFFICE OF HEAD PREFECT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of Head Prefect.", transitionHints: ["I write to formally submit my application for the office of...", "Pursuant to the official circular declaring nominations open for prefectorial offices..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your academic honors, personal discipline, and past leadership service.", transitionHints: ["Throughout my three years in this school, I have maintained an unblemished...", "Having served creditably as the Assistant Compound Prefect in Basic 8, I have gained..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Propose two dynamic policies (peer academic mentoring, punctuality recognition).", transitionHints: ["If given the mandate to serve, I will implement two key policies...", "First, I propose establishing a student-led academic mentoring initiative..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge loyalty, fairness, and readiness to be vetted by the electoral board.", transitionHints: ["I pledge to discharge my duties with fairness, humility, and unwavering loyalty...", "Thank you very much for considering my application..."] }
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
      ["Application position stated clearly (2 marks)", "Academic honors and leadership experience shown (4 marks)", "Two actionable policy initiatives proposed (4 marks)"],
      ["Head Prefect post clear", "Academic standing demonstrated", "Two initiatives outlined"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive administrative vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: `Basic 9 Stream A Secretariat,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi,\nAshanti Region.\n28th October, 2026.\n\nThe Headmaster,\nOpoku Ware Basic School,\nP.O. Box 700,\nKumasi, Ashanti Region.\n\nDear Sir,\n\nAPPLICATION FOR THE OFFICE OF HEAD PREFECT\n\nI write to formally submit my candidature for the office of School Head Prefect for the 2026/2027 academic session, following the opening of nominations by the school electoral committee.\n\nI have consistently demonstrated academic diligence, moral integrity, and exemplary punctuality throughout my three years at Opoku Ware Basic School. I have maintained the top academic rank in Basic 9 and earned academic prizes in Mathematics and Social Studies. In Basic 8, I had the privilege of serving as the Assistant Compound Prefect, an experience that honed my ability to coordinate student cleanup rosters, mediate peer disagreements, and communicate administrative directives with tact and fairness.\n\nIf appointed to this honorable office, I intend to implement two key initiatives. First, I will establish a 'Peer Academic Clinic' where high-achieving candidates in Basic 9 provide structured remedial tutoring to junior learners during afternoon break periods, boosting overall school academic performance. Second, I will introduce a 'Punctuality Honor Flag' competition among classes to eradicate morning tardiness and inspire collective student pride.\n\nI pledge to serve as an articulate, loyal bridge between the student body and school management, executing my duties with firmness, humility, and fairness.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nRichmond Asare\nApplicant, Basic 9A`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Civic Petition: Provision of Computers and Internet for BECE ICT Exam
  {
    id: "B9_S4_F_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Civic Petition",
    title: "Petition for Desktop Computers for BECE Candidates",
    shortSummary: "Petition the District Chief Executive for functional computers ahead of the national BECE computing practicals.",
    prompt: "Your school is a designated BECE examination center, but its ICT laboratory possesses only four functioning desktop computers for over eighty candidates preparing for the practical computing paper. As the Senior Prefect, write a formal petition to your District Chief Executive (DCE), highlighting the severe disadvantage candidates face and appealing for the urgent provision of twenty desktop computers and internet connectivity.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Petition Architecture, Digital Infrastructure Analysis & Administrative Prayer",
    learningCompetency: "B9.4.2.1.2: Compose civic petitions to municipal assemblies detailing technological deficits, examination disadvantages, and concrete equipment prayers.",
    hint: "Address to 'The District Chief Executive,'. State the ICT deficit factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Senior Prefects' Secretariat,", "Kuntanase Junior High School,", "P.O. Box 24,", "Kuntanase,", "Ashanti Region.", "2nd November, 2026."],
        allowedDatingFormats: ["2nd November, 2026", "2 November 2026"],
        prohibitedDatingFormats: ["02/11/2026"]
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
        modelCaption: "PETITION FOR THE PROVISION OF ICT INFRASTRUCTURE FOR BECE CANDIDATES",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your leadership mandate and declare the computing infrastructure deficit clearly.", transitionHints: ["We, the student leadership of Kuntanase Junior High School, respectfully petition...", "I write on behalf of eighty-four registered BECE candidates to draw your urgent attention to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document the acute computer shortage (4 functional PCs for 84 pupils) and the disadvantage faced in the national exam.", transitionHints: ["At present, our school ICT laboratory has only four working desktop computers...", "During practical lessons, upwards of twenty candidates are forced to crowd around a single monitor..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (allocation of 20 desktop computers, solar backup, and internet connectivity).", transitionHints: ["We therefore humbly pray that your honorable administration take decisive action...", "Specifically, we appeal for the urgent procurement and delivery of twenty desktop computers..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent administrative intervention before the national exams commence.", transitionHints: ["Our academic future and the reputation of our district depend on your intervention...", "Thank you very much for your leadership and anticipated prompt assistance..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Senior Prefect, Kuntanase JHS",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Prefectorial representation established (2 marks)", "Forensic documentation of computing deficit and examination disadvantage (4 marks)", "Clear three-point digital infrastructure prayer presented (4 marks)"],
      ["Prefect authority established", "Computer shortage detailed clearly", "Computers and connectivity requested"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive technical and educational vocabulary (3 marks)"],
      ["Civic advocacy language", "Logical problem-evidence-prayer flow", "Precise technological terminology"]
    ),
    modelAnswer: `Senior Prefects' Secretariat,\nKuntanase Junior High School,\nP.O. Box 24,\nKuntanase,\nAshanti Region.\n2nd November, 2026.\n\nThe District Chief Executive,\nBosomtwe District Assembly,\nP.O. Box 1,\nKuntanase, Ashanti Region.\n\nDear Sir,\n\nPETITION FOR THE PROVISION OF ICT INFRASTRUCTURE FOR BECE CANDIDATES\n\nI write on behalf of the student leadership and eighty-four registered candidates of Kuntanase Junior High School to respectfully submit this urgent petition concerning the severe deficit of computing equipment in our school ahead of the Basic Education Certificate Examination (BECE).\n\nAlthough our school is an accredited examination center for the upcoming national examinations, our ICT laboratory currently possesses only four functioning desktop computers to serve over eighty final-year pupils. During weekly computing practicals, upwards of twenty students are forced to huddle around a single monitor, leaving most candidates with less than ten minutes of hands-on typing and spreadsheet practice each week. This acute deficit places our candidates at a grave disadvantage compared to their peers in well-equipped urban schools.\n\nTo ensure our students can compete equitably and achieve high marks in Computing, we humbly pray that your honorable administration execute three critical interventions. First, we appeal for the urgent allocation and delivery of twenty functioning desktop computers from the assembly's educational development fund. Second, we request the installation of a reliable solar-powered backup battery inverter to prevent power blackouts during the examination. Finally, we urge the assembly to provide a subsidized wireless internet router to support online research.\n\nOur candidates possess the intellect and determination to excel; they only require the tools to succeed.\n\nThank you very much for your leadership and anticipated decisive intervention.\n\nYours faithfully,\n[Signature]\nSamuel Osei-Mensah\nSenior Prefect, Kuntanase JHS`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Informal: Account of Graduation & Speech Day
  {
    id: "B9_S4_F_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Informal Letter",
    title: "School Speech and Prize-Giving Day Triumph",
    shortSummary: "Write to a friend describing your awards and the speeches delivered at the annual school speech day.",
    prompt: "Your school recently celebrated its 25th Annual Speech and Prize-Giving Day, where you received three subject awards. Write a letter to your former classmate in Tamale, narrating the colorful proceedings, describing your excitement upon receiving the awards, and sharing the guest speaker's inspiring advice to Basic 9 candidates.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Informal Ceremonial Narrative, Personal Triumph Exposition & Friendly Warmth",
    learningCompetency: "B9.4.2.1.1: Compose friendly personal letters narrating ceremonial events, personal academic awards, and inspiring oratorical advice.",
    hint: "Use single address formatting. Narrate the ceremony vividly with sensory adjectives. Conclude with your first name only.",
    guidanceScaffold: {
      letterType: "informal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Christ the King Junior High School,", "P.O. Box 33,", "Obuasi,", "Ashanti Region.", "8th November, 2026."],
        allowedDatingFormats: ["8th November, 2026", "8 November 2026"],
        prohibitedDatingFormats: ["08/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Fuseini,",
        permissibleSalutations: ["Dear Fuseini,", "Dearest Fuseini,"],
        bannedSalutations: ["Dear Sir,"]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Enquire warmly about his school in Tamale and announce the speech day celebration enthusiastically.", transitionHints: ["I hope this letter finds you well...", "I have the most exciting and joyful news to share with you!"] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Describe the colorful ceremony (cultural drumming, dignitaries, brass band).", transitionHints: ["Our silver jubilee Speech and Prize-Giving Day was truly spectacular...", "The school pavilion was decorated in vibrant blue and gold bunting..."] },
          { paragraphIndex: 3, role: "exposition_body_2", guidingQuestion: "Narrate receiving three academic awards and share the guest speaker's inspiring message.", transitionHints: ["You can imagine my sheer joy when my name was called for the Best Student in Mathematics...", "The guest speaker, a prominent female medical surgeon, delivered an unforgettable speech urging us to..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Share your renewed determination for the BECE and ask him to reply soon.", transitionHints: ["Winning these prizes has energized my preparation for the final exams...", "Write back soon and let me know how you are preparing in Tamale..."] }
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
      ["Warm opening and speech day context established (2 marks)", "Ceremonial atmosphere and awards ceremony described vividly (4 marks)", "Guest speaker's advice and renewed exam motivation shared (4 marks)"],
      ["Friend acknowledged warmly", "Ceremony details vivid and clear", "Awards and motivation shared"],
      ["Single address format (1 mark)", "Informal salutation (1 mark)", "No inside address/heading (1 mark)", "4 coherent paragraphs (1 mark)", "Mononymic sign-off (1 mark)"],
      ["Correct layout", "Consistent punctuation", "First name only at sign-off"],
      ["Lively, celebratory, and natural tone (4 marks)", "Natural conversational phrasing (3 marks)", "Rich descriptive vocabulary (3 marks)"],
      ["Enthusiastic tone", "Smooth narrative flow", "Rich vocabulary"]
    ),
    modelAnswer: `Christ the King Junior High School,\nP.O. Box 33,\nObuasi,\nAshanti Region.\n8th November, 2026.\n\nDear Fuseini,\n\nI hope this letter finds you well and excelling in your studies in Tamale. We all miss your hearty laughter on campus! I am writing to share some truly exhilarating news: our school recently held its 25th Annual Speech and Prize-Giving Day, and I had the honor of walking away with three major academic prizes!\n\nThe school compound was a festival of vibrant color. Our assembly grounds were adorned with blue and gold canopies, while our cadet corps and brass band greeted traditional chiefs and regional education officials with crisp drills. The atmosphere was electrifying as hundreds of proud parents packed the auditorium.\n\nYou can imagine my joy when my name was announced as the Overall Best Student in Mathematics, Integrated Science, and Social Studies! Walking onto the dais to receive three commemorative plaques, a scientific calculator, and a cash scholarship felt surreal. The keynote speaker, Dr. Joyce Addo, a renowned neurosurgeon and alumna of our school, delivered a stirring address on perseverance. She urged us candidates never to allow our humble beginnings to limit our dreams, reminding us that discipline and consistent practice are the true keys to distinction.\n\nReceiving these honors has boosted my confidence as we approach our final examinations. I am more determined than ever to secure straight ones in the BECE.\n\nI wish you were there to celebrate with me. Write back soon and tell me about preparations in your school!\n\nYour sincere friend,\nKelvin`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Semi-Formal: Seeking Career Shadowing Opportunity with Local Bank Manager
  {
    id: "B9_S4_F_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Semi-Formal Letter",
    title: "Shadowing Placement Request at Commercial Bank",
    shortSummary: "Write to a bank manager requesting a two-day vacation shadowing placement to understand financial management.",
    prompt: "You aspire to pursue business accounting and corporate finance in Senior High School. Write a semi-formal letter to Mr. Daniel Oduro, the Branch Manager of the Ghana Commercial Bank in your town, respectfully requesting permission to undertake a two-day observational shadowing placement during the vacation to gain practical insight into banking operations and customer service.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Semi-Formal Professional Request, Career Alignment & Underlined Title Case Caption",
    learningCompetency: "B9.4.2.1.2: Compose semi-formal institutional requests to corporate professionals demonstrating career purpose, ethical confidentiality pledges, and respectful conventions.",
    hint: "Salute with 'Dear Mr. Oduro,'. Provide an underlined Title Case caption. Outline your business accounting ambition and pledge client confidentiality. Conclude with 'Yours sincerely,' and your full name.",
    guidanceScaffold: {
      letterType: "semi_formal",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Young Economists Club,", "St. James Basic School,", "P.O. Box 80,", "Koforidua,", "Eastern Region.", "12th November, 2026."],
        allowedDatingFormats: ["12th November, 2026", "12 November 2026"],
        prohibitedDatingFormats: ["12/11/2026"]
      },
      salutationGuide: {
        recommendedSalutation: "Dear Mr. Oduro,",
        permissibleSalutations: ["Dear Mr. Oduro,", "Dear Branch Manager,"],
        bannedSalutations: ["Dear Sir,"]
      },
      captionGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelCaption: "Request for Two-Day Observational Shadowing Placement",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Respectfully state the purpose of your letter and announce your upcoming vacation availability.", transitionHints: ["I write to respectfully seek your permission and guidance to undertake...", "As a final-year Basic 9 pupil preparing for Senior High School, I am eager to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Explain your passion for accounting, financial management, and business studies.", transitionHints: ["My long-term career ambition is to become a certified chartered accountant...", "Observing cash operations, ledger reconciliation, and customer service under your supervision would..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Specify the exact dates (e.g., 18th and 19th December) and make a solemn pledge regarding client confidentiality and banking etiquette.", transitionHints: ["I humbly request permission to shadow your operations team on...", "I solemnly pledge to observe strict customer confidentiality, dress in full corporate attire, and..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Express polite gratitude for his time and anticipate a favorable response.", transitionHints: ["I would be profoundly grateful for this mentorship opportunity...", "Thank you very much for your continuous dedication to community youth empowerment..."] }
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
      ["Shadowing request and purpose established (2 marks)", "Accounting ambition and banking interest detailed (4 marks)", "Specific dates and client confidentiality guaranteed (4 marks)"],
      ["Shadowing dates clear", "Accounting interest developed", "Client confidentiality pledged"],
      ["Single address format (1 mark)", "Surname salutation (1 mark)", "Underlined Title Case caption (1 mark)", "4 paragraphs (1 mark)", "Yours sincerely + full name (1 mark)"],
      ["Title Case underlined", "Correct subscription", "Full printed name without signature"],
      ["Polite, professional semi-formal register (4 marks)", "Zero informal contractions (3 marks)", "Precise business and financial vocabulary (3 marks)"],
      ["Courteous administrative tone", "Clear chronological progression", "Precise business terminology"]
    ),
    modelAnswer: `Young Economists Club,\nSt. James Basic School,\nP.O. Box 80,\nKoforidua,\nEastern Region.\n12th November, 2026.\n\nDear Mr. Oduro,\n\nRequest for Two-Day Observational Shadowing Placement\n_____________________________________________________\n\nI write to respectfully seek your kind permission to undertake a two-day observational career shadowing placement at your branch during the upcoming end-of-term vacation.\n\nAs a final-year Basic 9 pupil preparing for the BECE, I have selected Business with Financial Accounting and Economics as my intended secondary school program. My dream is to qualify as a chartered accountant and serve in corporate banking. While classroom business studies lessons provide theoretical knowledge, observing banking operations, general ledger reconciliation, and electronic financial services under your expert supervision would provide invaluable practical perspective.\n\nI humbly request permission to shadow your banking hall staff on Thursday, 18th December, and Friday, 19th December, 2026, from 8:30 a.m. to 1:30 p.m. daily. I am fully conscious of the sacred ethical requirements of the financial industry and solemnly pledge to observe absolute client confidentiality, adhere to all institutional security directives, and conduct myself with the utmost professional decorum.\n\nI would be profoundly grateful for this mentorship opportunity to gain first-hand exposure to the world of corporate banking.\n\nThank you very much for your time, consideration, and continuous support of youth empowerment.\n\nYours sincerely,\nPriscilla Darkwa`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Formal: Application for Student Sanitation & Health Prefect
  {
    id: "B9_S4_F_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Formal Letter",
    title: "Application for School Health & Sanitation Prefect",
    shortSummary: "Apply to the Senior Housemaster to serve as the School Health and Sanitation Prefect.",
    prompt: "Nominations have been declared open for student leadership positions. Write a formal letter of application to your Senior Housemaster, applying for the office of School Health and Sanitation Prefect. Highlight your personal discipline, evaluate existing campus waste challenges, and propose two practical strategies to improve sanitation and hygiene among pupils.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Formal Application Architecture, Sanitation Policy Advocacy & Quadripartite Close",
    learningCompetency: "B9.4.2.1.2: Compose formal administrative applications demonstrating leadership responsibility, sanitation policies, dual addresses, and quadripartite sign-offs.",
    hint: "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and class designation.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Health Cadets' Secretariat,", "St. Peter's Basic School,", "P.O. Box 78,", "Kumasi,", "Ashanti Region.", "18th November, 2026."],
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
        modelCaption: "APPLICATION FOR THE POSITION OF SCHOOL HEALTH AND SANITATION PREFECT",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Formally apply for the position of School Health and Sanitation Prefect.", transitionHints: ["I write to formally submit my candidature for the office of...", "In response to the announcement inviting applications for student leadership positions..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Highlight your personal cleanliness, punctuality, and past leadership in campus hygiene.", transitionHints: ["Throughout my junior secondary schooling, I have maintained an unblemished record of...", "As an active member of our health club, I have consistently advocated for..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Analyze campus waste hotspots (canteen wrappers, unwashed washrooms) and propose two practical strategies.", transitionHints: ["Currently, the areas around the school canteen and sports field experience heavy littering...", "To eliminate this problem, I propose two practical interventions: introducing color-coded recycling bins and..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Pledge commitment to school hygiene and readiness for an interview.", transitionHints: ["I pledge to discharge my duties with fairness, diligence, and firmness...", "Thank you very much for considering my application..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "Student, Basic 9B",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Application position stated clearly (2 marks)", "Personal discipline and sanitation habits demonstrated (4 marks)", "Two actionable waste reduction strategies proposed (4 marks)"],
      ["Sanitation Prefect post clear", "Cleanliness habits shown", "Two sanitation strategies detailed"],
      ["Two addresses correctly formatted (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Quadripartite sign-off complete (1 mark)"],
      ["Dual addresses present", "Un-underlined all-caps caption", "Complete 4-tier sign-off"],
      ["Formal, confident administrative register (4 marks)", "Zero contractions (3 marks)", "Persuasive environmental vocabulary (3 marks)"],
      ["Objective tone", "Formal transitions", "Well-developed compound sentences"]
    ),
    modelAnswer: `Health Cadets' Secretariat,\nSt. Peter's Basic School,\nP.O. Box 78,\nKumasi,\nAshanti Region.\n18th November, 2026.\n\nThe Senior Housemaster,\nSt. Peter's Basic School,\nP.O. Box 78,\nKumasi, Ashanti Region.\n\nDear Sir,\n\nAPPLICATION FOR THE POSITION OF SCHOOL HEALTH AND SANITATION PREFECT\n\nI write to formally submit my candidature for the office of School Health and Sanitation Prefect for the 2026/2027 academic session, in response to the administrative circular on student leadership nominations.\n\nI possess a lifelong dedication to personal hygiene, environmental cleanliness, and student health. Throughout my studies in Basic 7, 8, and 9, I have maintained an unblemished disciplinary record and served actively in the School Health Scouts Corps. During our weekly compound cleaning exercises, I consistently volunteer to supervise classroom sweeping and ensure that waste bins are disinfected and emptied promptly before morning assembly. My peers know me as an approachable, fair, and firm leader who leads by personal example.\n\nIf appointed to this office, I intend to implement two practical solutions to resolve our school's sanitation challenges. First, I will establish a 'Cleanest Classroom of the Week' award scheme where classes that keep their verandas free from wrappers receive a commendation banner during Monday assembly. Second, I will introduce color-coded waste collection bins near the canteen to separate plastic water sachets from paper waste, partnering with local recycling depots to generate extra revenue for student welfare supplies.\n\nI pledge to execute my duties with impartiality, dedication, and firm commitment to our school's environmental bylaws.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nDaniel Osei-Owusu\nStudent, Basic 9B`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Civic Petition: Construction of Speed Tables near School
  {
    id: "B9_S4_F_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Civic Petition",
    title: "Petition for Concrete Speed Ramps near School Gate",
    shortSummary: "Petition the Municipal Chief Executive over speeding haulage trucks injuring students crossing the highway.",
    prompt: "Reckless commercial vehicular speeding on the highway directly in front of your school gate has resulted in multiple hit-and-run accidents involving pupils during morning arrival and afternoon closing hours. As the President of the School Road Safety Club, write a formal petition to your Municipal Chief Executive (MCE), detailing recent pedestrian casualties and appealing for the urgent construction of concrete speed tables and a zebra crossing.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Civic Safety Petition Architecture, Forensic Accident Documentation & Statutory Prayer",
    learningCompetency: "B9.4.2.1.2: Compose civic petitions to local assemblies detailing traffic hazards, pedestrian accident data, and structured engineering prayers.",
    hint: "Address to 'The Municipal Chief Executive,'. State the vehicular emergency factually in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and designation.",
    guidanceScaffold: {
      letterType: "civic_petition",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Road Safety Club Secretariat,", "Madina Islamic Junior High School,", "P.O. Box MD 45,", "Madina-Accra.", "22nd November, 2026."],
        allowedDatingFormats: ["22nd November, 2026", "22 November 2026"],
        prohibitedDatingFormats: ["22/11/2026"]
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
        modelCaption: "PETITION FOR THE URGENT CONSTRUCTION OF SPEED RAMPS NEAR OUR SCHOOL",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Establish your club's representational standing and declare the highway safety grievance.", transitionHints: ["We, the executive committee of the School Road Safety Club, respectfully petition...", "I write on behalf of over six hundred pupils and teachers of Madina Islamic JHS to draw your urgent attention to..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Document recent reckless speeding incidents, pedestrian collisions, and student hospitalizations.", transitionHints: ["Over the past two terms, commercial minibus and heavy haulage drivers have treated the stretch in front of our school as a speedway...", "Tragically, within the last month alone, two Basic 7 pupils were struck while attempting to cross..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "State your formal prayer (construction of two raised speed tables, zebra crossing, and speed warning signs).", transitionHints: ["We therefore humbly pray that your honorable administration take decisive remedial action...", "First, we appeal for the urgent construction of two raised asphalt speed tables on both approaches..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Appeal for urgent administrative action to prevent further loss of innocent young lives.", transitionHints: ["Our children's lives are in grave danger each morning...", "Thank you very much for your leadership and anticipated decisive action..."] }
        ]
      },
      signOffGuide: {
        format: "quadripartite",
        subscription: "Yours faithfully,",
        requiresHandwrittenSignature: true,
        printedNameFormat: "full_name_title_case",
        designationPlaceholder: "President, School Road Safety Club",
        coOccurrenceConstraint: "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    rubric: createWAECRubric(
      ["Road safety club representation established (2 marks)", "Forensic accident data and pedestrian hazards documented (4 marks)", "Clear three-point road engineering prayer presented (4 marks)"],
      ["Club standing established", "Accident details documented clearly", "Speed tables and zebra crossing requested"],
      ["Two addresses formatted correctly (1 mark)", "Formal salutation (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Complete quadripartite sign-off (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Four-part sign-off complete"],
      ["Authoritative, dignified civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive traffic safety and engineering vocabulary (3 marks)"],
      ["Civic advocacy language", "Logical problem-evidence-prayer flow", "Precise technical road terminology"]
    ),
    modelAnswer: `Road Safety Club Secretariat,\nMadina Islamic Junior High School,\nP.O. Box MD 45,\nMadina-Accra.\n22nd November, 2026.\n\nThe Municipal Chief Executive,\nLa-Nkwantanang Madina Municipal Assembly,\nP.O. Box MD 11,\nMadina-Accra.\n\nDear Sir,\n\nPETITION FOR THE URGENT CONSTRUCTION OF SPEED RAMPS NEAR OUR SCHOOL\n\nI write on behalf of the executive committee of the School Road Safety Club and the entire student population of Madina Islamic Junior High School to respectfully petition your high office regarding the grave vehicular perils along the main highway fronting our campus.\n\nSince the resurfacing of the Madina-Pantang highway earlier this year, commercial minibus and heavy haulage drivers have treated the section directly in front of our school gate as a high-speed motorway. Drivers routinely ignore the mandatory thirty-kilometer-per-hour school zone limit, operating at dangerous speeds exceeding eighty kilometers per hour. Within the past two months alone, three basic school pupils were struck by speeding commercial vehicles while crossing to school, sustaining severe orthopedic injuries that required weeks of hospitalization. Terrified parents are now afraid to let their young children walk to school unescorted.\n\nTo prevent further loss of innocent student lives and restore safety to our school community, we humbly pray that your honorable administration execute three immediate engineering interventions. First, we appeal for the urgent construction of two raised asphalt speed tables on both approaches to the school entrance. Second, we demand the painting of a high-visibility zebra crossing directly opposite our gate. Finally, we urge the assembly to install prominent 'School Zone: Speed Limit 30 km/h' warning signposts.\n\nOur pupils deserve to travel to school without fearing vehicular collisions.\n\nThank you very much for your leadership and anticipated prompt intervention.\n\nYours faithfully,\n[Signature]\nMustapha Haruna\nPresident, School Road Safety Club`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Formal Letter to Editor: Combating Teenage Truancy and Digital Gaming Addiction
  {
    id: "B9_S4_F_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "foundation",
    category: "Formal Letter",
    title: "Combating Teenage Truancy in Gaming Centers",
    shortSummary: "Write to the Editor of a national newspaper on youth gaming center addiction and municipal regulation.",
    prompt: "An increasing number of junior secondary school students in urban suburbs are dropping out of school to patronize commercial video-gaming and sports betting parlors. Write a letter to the Editor of a national daily newspaper, expressing concern about this social menace, analyzing its effects on school attendance and BECE performance, and suggesting two practical ways parents and local authorities can eliminate the problem.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Letter to the Press Architecture, Sociological Commentary & Statutory Valediction",
    learningCompetency: "B9.4.2.1.2: Compose formal letters to national newspaper editors analyzing contemporary social issues and proposing regulatory interventions.",
    hint: "Address to 'The Editor, Daily Graphic,'. Include an un-underlined BLOCK CAPITAL heading. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', your signature, full name, and your residential town.",
    guidanceScaffold: {
      letterType: "formal_administrative",
      senderAddress: {
        recommendedStyle: "blocked",
        recommendedPunctuation: "closed",
        defaultLinesPlaceholder: ["Youth Welfare Forum,", "P.O. Box 88,", "Old Tafo-Kumasi,", "Ashanti Region.", "26th November, 2026."],
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
        modelCaption: "CURBING THE MENACE OF TEENAGE TRUANCY IN GAMING CENTERS",
        rules: ["Do not underline all-caps headings.", "Never end with a period."]
      },
      bodyGuidance: {
        minimumWordCount: 180,
        targetWordCount: 250,
        recommendedParagraphs: 4,
        paragraphPrompts: [
          { paragraphIndex: 1, role: "preamble_opening", guidingQuestion: "Request editorial space and state the social issue directly.", transitionHints: ["Permit me space in your widely read national daily newspaper to voice...", "I write to draw national attention to the alarming surge in school absenteeism caused by..."] },
          { paragraphIndex: 2, role: "exposition_body_1", guidingQuestion: "Analyze how video-game centers induce school absenteeism and academic decline.", transitionHints: ["During instructional school hours, dozens of junior high school pupils abandon classroom lessons to...", "This addiction leads to chronic truancy, academic failure, and petty theft..."] },
          { paragraphIndex: 3, role: "requisition_prayer", guidingQuestion: "Propose two practical solutions (assembly bylaws and parental monitoring).", transitionHints: ["To eradicate this menace, municipal authorities must enforce strict bylaws...", "Furthermore, parents and unit committees must exercise greater surveillance by..."] },
          { paragraphIndex: 4, role: "valediction_conclusion", guidingQuestion: "Summarize the urgency of safeguarding youth education.", transitionHints: ["If we fail to act decisively, our educational investments will be compromised...", "I hope this appeal stirs immediate community action..."] }
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
      ["Editorial space requested and issue announced clearly (2 marks)", "Sociological analysis of gaming addiction and school fallout (4 marks)", "Two actionable regulatory and parental solutions proposed (4 marks)"],
      ["Editorial space requested", "Gaming impact on schooling explained", "Bylaws and parental oversight suggested"],
      ["Two addresses correctly positioned (1 mark)", "Salutation 'Dear Sir,' (1 mark)", "Block capital caption without underline (1 mark)", "4 paragraphs (1 mark)", "Sign-off with signature, name, and town (1 mark)"],
      ["Inside address present", "Caption properly formatted", "Sign-off includes town"],
      ["Formal, articulate civic register (4 marks)", "Zero informal contractions (3 marks)", "Persuasive sociological vocabulary (3 marks)"],
      ["Elevated civic vocabulary", "Effective paragraph links", "Varied sentence patterns"]
    ),
    modelAnswer: `Youth Welfare Forum,\nP.O. Box 88,\nOld Tafo-Kumasi,\nAshanti Region.\n26th November, 2026.\n\nThe Editor,\nDaily Graphic,\nP.O. Box 742,\nAccra.\n\nDear Sir,\n\nCURBING THE MENACE OF TEENAGE TRUANCY IN GAMING CENTERS\n\nPermit me a space in your widely read national daily newspaper to sound an urgent clarion call regarding the alarming proliferation of commercial video-gaming and sports betting parlors in our urban communities.\n\nIt is deeply troubling that during official school hours, dozens of junior high school pupils abandon classroom instruction to congregate inside unventilated video-game parlors across our suburbs. This disturbing addiction has fueled chronic truancy, sharp drops in terminal examination scores, and petty theft within households as students seek coins to fund their gaming sessions. The future of many promising youngsters is being compromised while gaming operators profit unhindered.\n\nTo eradicate this growing social menace, I propose two urgent interventions. First, municipal assemblies must rigorously enforce local business bylaws that prohibit commercial gaming operators from admitting school children in uniform between 7:00 a.m. and 3:00 p.m., backed by heavy spot fines and license revocations for non-compliant proprietors. Second, community parent-teacher associations should collaborate with local unit committees to conduct regular surveillance raids on known gaming hubs during school hours.\n\nOur children are the nation's future human resource. We cannot sit idly by while commercial gaming centers derail their educational aspirations.\n\nYours faithfully,\n[Signature]\nRichmond Asare\nOld Tafo-Kumasi`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B9FoundationClean() {
  const db = await getFirestoreDb();
  console.log("Building clean 60-item Strand 4 B9 Foundation Practice Lab...");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective, Shuffled Options)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory, Flippable Prompts)");

  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // 1. Build Section A (Questions 1 to 50: Objective Multiple-Choice with Shuffled Options)
  rawObjective50Data.slice(0, 50).forEach((item, index) => {
    const qNum = index + 1;
    const shuffledOptions = shuffleArray(item.options);

    all60Items.push({
      id: `B9_S4_F_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B9",
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
      learningCompetency: "B9.4.2.1: Demonstrate foundation mastery of epistolary formatting, address architecture, dating laws, salutation/close pairings, and caption rules."
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
    difficulty: "foundation",
    title: "Basic 9 Foundation Writing Lab: 50 Objective Drills + 10 Theory Writing Tasks",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B9_foundation`
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

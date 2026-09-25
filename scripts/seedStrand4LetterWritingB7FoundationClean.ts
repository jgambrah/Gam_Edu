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
  level: "B7";
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

// 50 OBJECTIVE MULTIPLE-CHOICE QUESTIONS
const objective50Data = [
  {
    "passage": "Kwame is writing a friendly letter to his cousin who lives in Cape Coast.",
    "question": "How many addresses must Kwame include on his letter?",
    "options": [
      "One address (Sender's address only)",
      "Two addresses (Sender's and Recipient's addresses)",
      "No address is required in friendly letters",
      "Three addresses including the school address"
    ],
    "answer": "One address (Sender's address only)",
    "hint": "Informal letters to friends and relatives strictly prohibit an inside address.",
    "solution": "Informal personal letters require only the writer's address in the top right-hand corner. Writing a recipient inside address is an error known as format contamination.",
    "target": "Epistolary Typologies: Informal Layout Purity"
  },
  {
    "passage": "A student writes the date on her formal letter as: '12/03/2026'.",
    "question": "Under WAEC marking guidelines, how is this date evaluated?",
    "options": [
      "It is penalized as an error because numerical slash dates are prohibited",
      "It is accepted as modern standard shorthand",
      "It is awarded a bonus mark for brevity",
      "It is permitted only in informal letters"
    ],
    "answer": "It is penalized as an error because numerical slash dates are prohibited",
    "hint": "Dates in English compositions must write the month out in words.",
    "solution": "In standard formal English, numerical slash or hyphen dates (e.g., 12/03/2026 or 12-03-2026) are strictly prohibited. The month must be spelled out in full words: '12th March, 2026' or '12 March 2026'.",
    "target": "Epistolary Dating Law"
  },
  {
    "passage": "The salutation of a formal application letter to an unknown administrator reads: 'Dear Sir,'.",
    "question": "What is the mandatory subscription (valediction) to close this letter?",
    "options": [
      "Yours faithfully,",
      "Yours sincerely,",
      "Your sincere friend,",
      "Yours affectionately,"
    ],
    "answer": "Yours faithfully,",
    "hint": "When the recipient's name is not used in the salutation, one specific closing is required.",
    "solution": "The co-occurrence constraint dictates that an unnamed formal salutation ('Dear Sir,' or 'Dear Madam,') strictly pairs with 'Yours faithfully,'. 'Yours sincerely,' is reserved for named salutations.",
    "target": "Complementary Close Co-occurrence Constraint"
  },
  {
    "passage": "A Basic 7 candidate writes the caption for an application letter as: <u>APPLICATION FOR ADMISSION AS A BOARDING STUDENT.</u>",
    "question": "What mechanical accuracy or layout error has the candidate committed?",
    "options": [
      "Underlining a heading written in full block capital letters and adding a period",
      "Failing to write the heading in italics",
      "Using capital letters instead of lowercase",
      "Placing the caption below the first paragraph"
    ],
    "answer": "Underlining a heading written in full block capital letters and adding a period",
    "hint": "Headings in full capital letters must never be underlined, and titles never end with periods.",
    "solution": "When a caption is written in ALL CAPITAL LETTERS, it must NOT be underlined. Furthermore, titles are not syntactic sentences and must never terminate with a period.",
    "target": "Caption Orthography & Typography"
  },
  {
    "passage": "In a formal petition to the District Chief Executive, a student writes: 'We can't allow this road to remain unrepaired, so you've got to help us.'",
    "question": "What stylistic defect does this sentence display?",
    "options": [
      "Use of informal contractions and colloquial phrasing in a formal administrative petition",
      "Failure to use passive voice",
      "Lack of adjective clauses",
      "Use of third-person pronouns"
    ],
    "answer": "Use of informal contractions and colloquial phrasing in a formal administrative petition",
    "hint": "Contracted verbs like 'can't' and 'you've' are banned in formal correspondence.",
    "solution": "Formal letters and petitions require an elevated, objective register. Informal contractions ('can't', 'you've') and colloquial idioms are strictly penalized under Expression.",
    "target": "Formal Register: Contraction Prohibition"
  },
  {
    "passage": "A letter concludes with: 'Yours faithfully, \\n Kwame Mensah'.",
    "question": "What essential formal element is missing between the subscription and the printed name?",
    "options": [
      "The handwritten signature mark",
      "The writer's date of birth",
      "The telephone number",
      "The name of the writer's father"
    ],
    "answer": "The handwritten signature mark",
    "hint": "Formal letters mandate a four-part sign-off: subscription, signature mark, printed name, and designation.",
    "solution": "The formal quadripartite sign-off requires: (1) Subscription, (2) Handwritten signature, (3) Full printed name, and (4) Professional or leadership designation.",
    "target": "The Quadripartite Sign-off Framework"
  },
  {
    "passage": "Yaw is writing a semi-formal letter to his Form Master, Mr. Boateng.",
    "question": "Which salutation is most appropriate?",
    "options": [
      "Dear Mr. Boateng,",
      "Dear Boateng,",
      "Dear Sir,",
      "My dear friend Boateng,"
    ],
    "answer": "Dear Mr. Boateng,",
    "hint": "Semi-formal letters salute the recipient using their polite title and surname.",
    "solution": "In semi-formal letters to a respected adult acquaintance or teacher, the proper salutation consists of 'Dear' followed by the recipient's title and surname: 'Dear Mr. Boateng,'.",
    "target": "Semi-Formal Epistolary Salutations"
  },
  {
    "passage": "A letter to a school headmaster uses the closed punctuation style in the address.",
    "question": "Which punctuation mark must be placed at the very end of the final line (region or country)?",
    "options": [
      "A full stop (period)",
      "A comma",
      "A semicolon",
      "No punctuation mark"
    ],
    "answer": "A full stop (period)",
    "hint": "Closed punctuation ends every intermediate line with a comma and the last line with a period.",
    "solution": "In closed address punctuation, each line terminates with a comma, and the final line terminates with a full stop (period).",
    "target": "Address Architecture: Closed Punctuation"
  },
  {
    "passage": "A student writing a letter in the modern blocked address format places all lines:",
    "question": "Where do the lines align in blocked style?",
    "options": [
      "Flush against the margin with no indentation",
      "Stepped progressively to the right",
      "Centered in the middle of the page",
      "Alternating between left and right margins"
    ],
    "answer": "Flush against the margin with no indentation",
    "hint": "Blocked style aligns all text elements flush to a single vertical margin.",
    "solution": "In the blocked address style, all lines begin at the same vertical margin without any progressive indentation.",
    "target": "Address Architecture: Blocked Style"
  },
  {
    "passage": "Which of the following dates is punctuated strictly according to the closed style?",
    "question": "Identify the correct closed date format:",
    "options": [
      "14th November, 2026.",
      "14 November 2026",
      "14th, November 2026",
      "November 14 2026."
    ],
    "answer": "14th November, 2026.",
    "hint": "Closed style includes an ordinal suffix, a comma following the month, and a full stop after the year.",
    "solution": "In closed epistolary punctuation, the date takes an ordinal indicator, a comma after the month, and a terminal period: '14th November, 2026.'.",
    "target": "Epistolary Dating Law"
  },
  {
    "passage": "A student writes an informal letter to her mother and signs off as: 'Yours affectionately, \\n Akua Mensah'.",
    "question": "What error has the student committed in the sign-off?",
    "options": [
      "Including her surname in an informal family letter",
      "Using 'Yours affectionately'",
      "Writing on two lines",
      "Failing to include a official seal"
    ],
    "answer": "Including her surname in an informal family letter",
    "hint": "Letters to close family members and friends must use the first name only.",
    "solution": "Informal letters to parents, siblings, or close peers mandate a mononymic sign-off (first name only: 'Akua'). Adding a surname creates unnatural social distance.",
    "target": "Informal Sign-off: Mononymic Rule"
  },
  {
    "passage": "In a formal letter, which word in the subscription 'Yours faithfully,' must begin with a lowercase letter?",
    "question": "Identify the correct capitalization rule for subscriptions:",
    "options": [
      "The second word ('faithfully')",
      "The first word ('yours')",
      "Both words must be capitalized",
      "Neither word is capitalized"
    ],
    "answer": "The second word ('faithfully')",
    "hint": "Only the initial letter of the first word takes a capital letter: 'Yours faithfully,'.",
    "solution": "In epistolary subscriptions, only the first letter of the opening word is capitalized ('Yours'). The second word begins with a lowercase letter: 'Yours faithfully,'.",
    "target": "Subscription Orthography"
  },
  {
    "passage": "A candidate writes a heading in Title Case: <u>An Appeal for Clean Potable Water in Asokwa</u>",
    "question": "Why is this heading formatted correctly?",
    "options": [
      "It is written in Title Case, major lexical words are capitalized, minor words are lowercase, and it is underlined without a period",
      "Because all words start with capital letters",
      "Because it is in quotation marks",
      "Because it ends with an exclamation mark"
    ],
    "answer": "It is written in Title Case, major lexical words are capitalized, minor words are lowercase, and it is underlined without a period",
    "hint": "Title Case headings require an underline, capitalization of major words, and no terminal period.",
    "solution": "Title Case headings require: initial capital for major words, lowercase for short prepositions/articles, a continuous underline, and zero terminal punctuation.",
    "target": "Caption Typography: Title Case"
  },
  {
    "passage": "Which of the following is a quasi-coordinator that does NOT compound the subject?",
    "question": "Identify the parenthetical expression:",
    "options": [
      "together with",
      "and",
      "both",
      "furthermore and"
    ],
    "answer": "together with",
    "hint": "Phrases like 'together with' or 'as well as' are parenthetical and do not pluralize the subject.",
    "solution": "'Together with' introduces a parenthetical adjunct. It does not act as a coordinating conjunction and leaves subject concord governed by the head noun.",
    "target": "Parenthetical Concord"
  },
  {
    "passage": "A letter addressed to 'The Editor, Daily Graphic' is categorized as what type of correspondence?",
    "question": "Select the correct category:",
    "options": [
      "A formal letter to the press",
      "An informal letter",
      "A semi-formal note",
      "A private diary entry"
    ],
    "answer": "A formal letter to the press",
    "hint": "Correspondence intended for publication in national newspapers follows formal public rules.",
    "solution": "A letter to a newspaper editor is a formal letter to the press, requiring two addresses, a formal salutation ('Dear Sir,'), a caption, and a formal closing.",
    "target": "Epistolary Typologies: Letters to the Editor"
  },
  {
    "passage": "When writing a formal petition on behalf of a student body, where is the writer's official designation placed?",
    "question": "Identify the correct position:",
    "options": [
      "Directly beneath the printed full name at the end of the letter",
      "At the top of the letter above the date",
      "Inside the body of the opening paragraph only",
      "Above the handwritten signature"
    ],
    "answer": "Directly beneath the printed full name at the end of the letter",
    "hint": "The fourth line of a formal quadripartite sign-off contains the official designation.",
    "solution": "In a formal sign-off, the designation (e.g., 'Senior Prefect') is placed on the fourth vertical line, directly beneath the printed full name.",
    "target": "Quadripartite Sign-off: Designation Placement"
  },
  {
    "passage": "Which of the following address lines displays an apostrophe error in an informal sign-off?",
    "question": "Select the erroneous subscription:",
    "options": [
      "Your's sincerely,",
      "Yours sincerely,",
      "Your loving son,",
      "Your friend,"
    ],
    "answer": "Your's sincerely,",
    "hint": "Possessive pronouns like 'Yours' never take an apostrophe.",
    "solution": "The possessive pronoun 'Yours' does not take an apostrophe. Writing 'Your's' is an error penalized under Mechanical Accuracy.",
    "target": "Subscription Mechanics: Apostrophe Ban"
  },
  {
    "passage": "A pupil opens an informal letter with: 'Dear Sir, I am writing to tell you about our inter-schools sports.'",
    "question": "What is the primary error in this opening?",
    "options": [
      "Using the formal salutation 'Dear Sir,' in an informal letter",
      "Failing to write the letter in past tense",
      "Using the first-person pronoun 'I'",
      "Writing more than ten words in the opening sentence"
    ],
    "answer": "Using the formal salutation 'Dear Sir,' in an informal letter",
    "hint": "Informal letters use friendly personal salutations, never administrative titles.",
    "solution": "Saluting with 'Dear Sir,' in a friendly informal letter is a severe register clash and format error.",
    "target": "Epistolary Registers: Salutation Alignment"
  },
  {
    "passage": "What is the primary purpose of the opening paragraph in a formal administrative letter?",
    "question": "Select the correct function:",
    "options": [
      "To state the purpose of the letter directly and concisely without personal pleasantries",
      "To ask about the recipient's family and health",
      "To narrate a long childhood story",
      "To provide jokes to relax the reader"
    ],
    "answer": "To state the purpose of the letter directly and concisely without personal pleasantries",
    "hint": "Formal letters avoid conversational greetings and declare their objective immediately.",
    "solution": "Formal business and administrative correspondence requires a direct declaration of purpose in sentence 1, omitting conversational inquiries about health or family.",
    "target": "Formal Letter Architecture: Opening Paragraph"
  },
  {
    "passage": "In an open punctuation address block, how are line ends treated?",
    "question": "Select the open punctuation rule:",
    "options": [
      "No commas or periods are placed at the ends of address lines",
      "Every line must end with a semicolon",
      "Lines must end with alternating periods and commas",
      "Only the date receives a comma"
    ],
    "answer": "No commas or periods are placed at the ends of address lines",
    "hint": "Open punctuation removes end-of-line marks throughout the address block.",
    "solution": "In pure open punctuation, all terminal commas and periods are omitted from the ends of address lines.",
    "target": "Address Architecture: Open Punctuation"
  },
  {
    "passage": "A student writes a letter to his uncle seeking financial support for school textbooks.",
    "question": "What category does this letter fall under?",
    "options": [
      "Informal letter",
      "Formal administrative petition",
      "Official gazette",
      "Commercial tender"
    ],
    "answer": "Informal letter",
    "hint": "Letters to family members and relatives are categorized as informal correspondence.",
    "solution": "Letters to family relatives (uncles, parents, siblings) are informal personal letters, even when requesting financial assistance.",
    "target": "Epistolary Typologies: Family Correspondence"
  },
  {
    "passage": "Which of the following salutations is strictly prohibited in an informal letter to a school friend?",
    "question": "Identify the prohibited salutation:",
    "options": [
      "Dear Sir,",
      "Dear Kofi,",
      "Dearest Akua,",
      "Dear Friend,"
    ],
    "answer": "Dear Sir,",
    "hint": "Administrative titles must never be used with peers.",
    "solution": "'Dear Sir,' is an impersonal formal salutation and cannot be used in friendly peer correspondence.",
    "target": "Salutation Register Restrictions"
  },
  {
    "passage": "A formal letter contains the inside address: 'The District Chief Executive, Bosomtwe District Assembly, Kuntanase.'",
    "question": "Where must this inside address be positioned on the page?",
    "options": [
      "On the left-hand margin below the level of the date",
      "At the top right corner above the date",
      "In the exact center of the page",
      "At the bottom left beneath the signature"
    ],
    "answer": "On the left-hand margin below the level of the date",
    "hint": "The recipient's inside address begins flush against the left margin below the date line.",
    "solution": "In formal correspondence, the inside recipient address is placed on the left-hand margin, starting one or two lines below the writer's date line.",
    "target": "Formal Architecture: Inside Address Positioning"
  },
  {
    "passage": "What is the structural role of the final paragraph in a formal petition?",
    "question": "Identify the concluding function:",
    "options": [
      "To state the formal prayer or desired administrative action and express polite anticipation",
      "To enquire about the recipient's weekend plans",
      "To introduce a brand-new complaint not mentioned earlier",
      "To list the writer's personal hobbies"
    ],
    "answer": "To state the formal prayer or desired administrative action and express polite anticipation",
    "hint": "Petitions conclude with an explicit appeal for administrative intervention.",
    "solution": "The final paragraph of a petition summarizes the 'prayer'—the specific intervention or remedy demanded—and expresses polite expectation of prompt action.",
    "target": "Civic Petitions: The Prayer Clause"
  },
  {
    "passage": "Which of the following phrases is most suitable for closing an informal letter to a classmate?",
    "question": "Choose the appropriate informal closing:",
    "options": [
      "Your sincere friend,",
      "Yours faithfully,",
      "I remain, your obedient servant,",
      "Respectfully submitted,"
    ],
    "answer": "Your sincere friend,",
    "hint": "Informal closings express warmth and personal affection.",
    "solution": "'Your sincere friend,' is an appropriate informal subscription for peer letters. 'Yours faithfully,' and 'obedient servant' are formal registers.",
    "target": "Informal Subscriptions"
  },
  {
    "passage": "A student writes: 'I am writing to respectfully apply for the post of library prefect.'",
    "question": "What register is demonstrated in this sentence?",
    "options": [
      "Formal administrative register",
      "Informal conversational slang",
      "Poetic archaic register",
      "Colloquial dialect"
    ],
    "answer": "Formal administrative register",
    "hint": "Polite, direct, and uncontracted declarations are formal.",
    "solution": "The phrasing is polite, direct, and uncontracted, representing the standard formal administrative register.",
    "target": "Epistolary Registers: Formal Tone"
  },
  {
    "passage": "In a formal letter, why is it incorrect to write the caption as: <u>APPLICATION FOR ADMISSION</u>?",
    "question": "Identify the typographical error:",
    "options": [
      "Captions written in all-caps must not be underlined",
      "The caption must always be in lowercase",
      "The caption must be written after the signature",
      "The caption must contain at least twenty words"
    ],
    "answer": "Captions written in all-caps must not be underlined",
    "hint": "Underlining is reserved for Title Case headings, not blocks of capital letters.",
    "solution": "Under WAEC marking rubrics, underlining a caption written in ALL BLOCK CAPITALS is a mechanical defect.",
    "target": "Caption Typography Rules"
  },
  {
    "passage": "Which of the following subscriptions is correct for a letter saluted with 'Dear Dr. Arku,'?",
    "question": "Select the correctly paired subscription:",
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
    "passage": "A letter includes the sentence: 'We ain't got no books in our library.'",
    "question": "How should this sentence be revised for a formal letter to a headmaster?",
    "options": [
      "Our library lacks sufficient reference textbooks.",
      "We don't have no books in the library.",
      "Books are ain't available in our library.",
      "There is no books in our library."
    ],
    "answer": "Our library lacks sufficient reference textbooks.",
    "hint": "Use formal, elevated vocabulary without double negatives or slang.",
    "solution": "'Our library lacks sufficient reference textbooks' replaces colloquial double negatives with precise, formal vocabulary.",
    "target": "Formal Lexical Transformation"
  },
  {
    "passage": "Where should the writer's address be placed in the traditional slanted (indented) format?",
    "question": "Select the correct placement:",
    "options": [
      "At the top right-hand corner of the page",
      "At the bottom left-hand corner",
      "In the center of the page",
      "Below the salutation on the left margin"
    ],
    "answer": "At the top right-hand corner of the page",
    "hint": "The writer's address in traditional epistolary layout is positioned at the top right.",
    "solution": "In traditional epistolary formatting, the sender's address and date are positioned at the top right-hand corner of the sheet.",
    "target": "Address Layout: Slanted Format"
  },
  {
    "passage": "A student ends an informal letter with: 'Your's Ever, Kofi'.",
    "question": "What two mechanical errors are present in 'Your's Ever'?",
    "options": [
      "An erroneous apostrophe in 'Yours' and incorrect capitalization of 'Ever'",
      "Misspelling of Kofi and lack of a period",
      "Use of capital letters throughout",
      "Lack of a handwritten signature"
    ],
    "answer": "An erroneous apostrophe in 'Yours' and incorrect capitalization of 'Ever'",
    "hint": "Possessive pronouns have no apostrophe, and the second word of a subscription is lowercase.",
    "solution": "'Yours' never takes an apostrophe, and the second word of a subscription must begin with a lowercase letter: 'Yours ever,'.",
    "target": "Subscription Punctuation & Capitalization"
  },
  {
    "passage": "What is the consequence of omitting the date from a letter in an examination?",
    "question": "How is an omitted date penalized in WAEC scoring?",
    "options": [
      "An automatic mark deduction under Organization/Format",
      "Immediate cancellation of the entire script",
      "A penalty under Content only",
      "No penalty is applied"
    ],
    "answer": "An automatic mark deduction under Organization/Format",
    "hint": "The date is a mandatory structural feature of the address block.",
    "solution": "In WAEC marking schemes, omitting the date constitutes an incomplete address block, resulting in a mandatory mark deduction under Organization.",
    "target": "Epistolary Scoring Rubrics: Format Deductions"
  },
  {
    "passage": "A formal petition is addressed to: 'The Honorable Minister, Ministry of Roads and Highways, Accra.'",
    "question": "Which salutation is most appropriate for this high-ranking state official?",
    "options": [
      "Honorable Sir, / Dear Sir,",
      "Dear Minister Kwame,",
      "Hello Boss,",
      "Dear Uncle,"
    ],
    "answer": "Honorable Sir, / Dear Sir,",
    "hint": "Ministers of state are formally saluted as 'Honorable Sir,' or 'Dear Sir,'.",
    "solution": "In formal correspondence to a government minister, 'Honorable Sir,' or 'Dear Sir,' is the required respectful formal salutation.",
    "target": "Administrative Salutations: Ministers of State"
  },
  {
    "passage": "Which of the following represents the correct format for an inside address?",
    "question": "Identify the properly formatted inside address:",
    "options": [
      "The Headteacher,\nOpoku Ware School,\nP.O. Box 700,\nKumasi.",
      "The Headteacher\nOpoku Ware School\nP.O. Box 700\nKumasi,",
      "To My Headteacher,\nAt Kumasi School.",
      "Headteacher P.O. Box 700 Kumasi."
    ],
    "answer": "The Headteacher,\nOpoku Ware School,\nP.O. Box 700,\nKumasi.",
    "hint": "Each line in closed punctuation ends with a comma, and the final line ends with a period.",
    "solution": "A standard inside address lists the official title, institution, postal address, and destination town, punctuated consistently.",
    "target": "Formal Architecture: Inside Address Format"
  },
  {
    "passage": "In an informal letter, which of the following expressions is acceptable to acknowledge a previous letter?",
    "question": "Select the appropriate conversational opening:",
    "options": [
      "It was wonderful to receive your letter last Tuesday.",
      "With reference to your memo of even date.",
      "I acknowledge receipt of your communication.",
      "Pursuant to our previous discussion."
    ],
    "answer": "It was wonderful to receive your letter last Tuesday.",
    "hint": "Informal letters use warm, natural conversational language.",
    "solution": "'It was wonderful to receive your letter...' is natural and warm, matching the informal register.",
    "target": "Informal Openings"
  },
  {
    "passage": "A student writes a formal letter and spells the subscription as: 'Yours Faithfully,'.",
    "question": "What is the mechanical error in this subscription?",
    "options": [
      "The letter 'F' in 'Faithfully' should be lowercase ('faithfully')",
      "The word 'Yours' should be lowercase",
      "There should be no comma after the subscription",
      "The subscription should be written in capital letters"
    ],
    "answer": "The letter 'F' in 'Faithfully' should be lowercase ('faithfully')",
    "hint": "Only the initial letter of the subscription is capitalized.",
    "solution": "In standard English epistolary rules, only the first word begins with a capital letter: 'Yours faithfully,'. Capitalizing 'Faithfully' is an error.",
    "target": "Subscription Orthography"
  },
  {
    "passage": "Which type of letter requires a caption (subject heading)?",
    "question": "Identify the letter types that require a caption:",
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
    "question": "What error has been committed?",
    "options": [
      "Inconsistent layout: mixing blocked and indented styles",
      "Omitting the date",
      "Using capital letters",
      "Writing on the right margin"
    ],
    "answer": "Inconsistent layout: mixing blocked and indented styles",
    "hint": "In blocked style, every line must start flush against the same margin.",
    "solution": "In pure block formatting, all lines including the date must align flush against the margin. Indenting the date introduces layout inconsistency.",
    "target": "Layout Consistency: Pure Block Style"
  },
  {
    "passage": "Which of the following is an appropriate sign-off for a letter written by a school prefect on behalf of the students?",
    "question": "Select the complete quadripartite sign-off:",
    "options": [
      "Yours faithfully,\n[Signature]\nKwame Mensah\nSenior Prefect",
      "Yours sincerely,\nKwame",
      "Your friend,\nKwame Mensah (Senior Prefect)",
      "Faithfully yours,\n[Signature]"
    ],
    "answer": "Yours faithfully,\n[Signature]\nKwame Mensah\nSenior Prefect",
    "hint": "Official student representation requires subscription, signature, printed name, and designation.",
    "solution": "The full formal sign-off includes subscription, signature, printed full name, and official designation across four distinct lines.",
    "target": "The Quadripartite Sign-off Framework"
  },
  {
    "passage": "A student writes a letter to his aunt: 'I am writing this letter to you because I need some money.'",
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
    "target": "Familial Epistolary Tone"
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
    "target": "Caption Typography: Title Case Underline"
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
    "target": "Familial Salutations"
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
    "hint": "British and WAEC standard epistolary convention uses a comma after the salutation.",
    "solution": "In standard British and West African epistolary syntax, salutations terminate with a comma: 'Dear Sir,'.",
    "target": "Salutation Punctuation"
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
    "target": "Civic Petitions: The Preamble"
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
    "target": "Informal Valedictions"
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
    "target": "WAEC 4-Tier Assessment Rubric"
  }
];

// 10 THEORY ESSAY WRITING TASKS
const theory10Prompts: TheoryEssayItem[] = [
  {
    "id": "B7_S4_T_01",
    "section": "theory",
    "questionNumber": 51,
    "theoryIndex": 1,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Informal Letter",
    "title": "Relocation to a New School",
    "shortSummary": "Write to an elder sister describing your impressions of your new junior high school.",
    "prompt": "You recently gained admission to a new junior high school in another district. Write a letter to your elder sister who attends university in Kumasi, describing your initial impressions of your new school, your favorite subject tutor, and at least two challenges you are currently facing as a new Basic 7 pupil.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "informal",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Presbyterian Junior High School,",
          "P.O. Box 24,",
          "Aburi-Akuapem,",
          "Eastern Region.",
          "14th October, 2026."
        ],
        "allowedDatingFormats": [
          "14th October, 2026",
          "14 October 2026"
        ],
        "prohibitedDatingFormats": [
          "14/10/2026",
          "14-10-2026"
        ]
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Sister Akosua,",
        "permissibleSalutations": [
          "Dear Sister Akosua,",
          "Dear Akosua,",
          "My dearest Sister,"
        ],
        "bannedSalutations": [
          "Dear Sir,",
          "Dear Madam,"
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "Enquire warmly about her university studies and health, and state your purpose.",
            "transitionHints": [
              "I hope this letter meets you in good health...",
              "It has been three exciting weeks since..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Describe the physical school environment and introduce your favorite teacher.",
            "transitionHints": [
              "My first impression of the school was...",
              "My favorite teacher is Mr. Boateng..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "exposition_body_2",
            "guidingQuestion": "Detail two specific challenges and how you are coping.",
            "transitionHints": [
              "However, life here has a few difficulties...",
              "Another challenge I face is..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Send greetings to her roommates and invite her to visit during midterm.",
            "transitionHints": [
              "Please extend my greetings to...",
              "I eagerly look forward to..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "mononymic",
        "subscription": "Your loving brother,",
        "requiresHandwrittenSignature": false,
        "printedNameFormat": "first_name_only",
        "coOccurrenceConstraint": "Informal letters end with your first name only. Do not write your surname or sign."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Impressions of new school (3 marks)",
            "Favorite teacher profile (3 marks)",
            "Two challenges and coping strategies (4 marks)"
          ],
          "diagnosticChecklist": [
            "Friendly opening/closing pleasantries present",
            "Clear school description",
            "Meets ~250 words"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Single address properly styled (1 mark)",
            "Informal salutation (1 mark)",
            "No inside address/heading (1 mark)",
            "4 distinct paragraphs (1 mark)",
            "First name only sign-off (1 mark)"
          ],
          "diagnosticChecklist": [
            "No recipient address",
            "Consistent address punctuation",
            "Mononymic sign-off"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Warm familial tone (4 marks)",
            "Natural contractions used (3 marks)",
            "Varied sentence patterns (3 marks)"
          ],
          "diagnosticChecklist": [
            "Conversational fluency without slang",
            "Clear transitional linkers",
            "Good sentence variety"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Presbyterian Junior High School,\nP.O. Box 24,\nAburi-Akuapem,\nEastern Region.\n14th October, 2026.\n\nDear Sister Akosua,\n\nHow are you and your university roommates doing in Kumasi? I hope your mid-semester engineering examinations went smoothly. Mother told me last weekend that you were feeling much better after your mild bout of malaria. I am writing to share my thrilling experiences since commencing my Basic 7 studies here at Aburi.\n\nThe school compound is breathtakingly beautiful, nestled on a lush hillside with cool breezes throughout the day. The classrooms are spacious, and the senior students have been remarkably welcoming to us newcomers. My favorite tutor is Mr. Boateng, our Integrated Science teacher. He explains complex botanical concepts with fascinating practical demonstrations, making every lesson an adventure. Last Tuesday, he helped us prepare plant cell slides under a compound light microscope!\n\nHowever, adjusting to my new routine has not been entirely easy. My first major challenge is the daily three-kilometer walk from our uncle's house to the school gate. By the time I arrive for morning assembly at half past seven, I am often exhausted. Additionally, our school library currently has a severe shortage of the new curriculum social studies textbooks, which makes completing independent evening assignments quite stressful. Fortunately, my seatmate Kwame has graciously agreed to share his copy with me.\n\nPlease extend my warmest greetings to your friend Abena. I hope you will visit us during your semester vacation. Write back soon and let me know how Kumasi life is treating you.\n\nYour loving brother,\nKofi",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Use only your own address (single address) in the top right corner. Do not include an inside recipient address or caption heading. Conclude warmly using your first name only.",
    "competencyTarget": "Informal Epistolary Architecture, Single Address Layout & Mononymic Sign-Off",
    "learningCompetency": "B7.4.2.1.1: Compose friendly informal letters observing appropriate single-address headers, warm familial salutations, natural paragraph development, and mononymic subscriptions."
  },
  {
    "id": "B7_S4_T_02",
    "section": "theory",
    "questionNumber": 52,
    "theoryIndex": 2,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Informal Letter",
    "title": "Effective Study Habits",
    "shortSummary": "Write to a struggling classmate sharing three effective study habits.",
    "prompt": "Your former primary school classmate wrote to complain that he is struggling to balance homework with household chores in his new school. Write a reply to him, sympathizing with his difficulties and sharing at least three effective study habits that have helped you improve your academic performance in Basic 7.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "informal",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Anglican Junior High School,",
          "P.O. Box 102,",
          "Sunyani,",
          "Bono Region.",
          "20th October, 2026."
        ],
        "allowedDatingFormats": [
          "20th October, 2026",
          "20 October 2026"
        ],
        "prohibitedDatingFormats": [
          "20/10/2026",
          "20-10-2026"
        ]
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Kwaku,",
        "permissibleSalutations": [
          "Dear Kwaku,",
          "Dearest Kwaku,"
        ],
        "bannedSalutations": [
          "Dear Sir,",
          "Mr. Kwaku,"
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "Acknowledge his letter with empathy, sympathizing with his busy schedule.",
            "transitionHints": [
              "I was delighted to receive your letter...",
              "I completely understand how overwhelming..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Explain your first two study habits (e.g., daily study timetable and 25-minute focus intervals).",
            "transitionHints": [
              "First and foremost, I designed...",
              "Secondly, I practice the..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "exposition_body_2",
            "guidingQuestion": "Describe your third study habit (e.g., weekend peer study circle).",
            "transitionHints": [
              "Finally, what has helped me most is...",
              "Every Saturday morning, we meet..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Encourage him to stay positive and invite him to update you.",
            "transitionHints": [
              "Try implementing these tips...",
              "Give my regards to your parents..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "mononymic",
        "subscription": "Your sincere friend,",
        "requiresHandwrittenSignature": false,
        "printedNameFormat": "first_name_only",
        "coOccurrenceConstraint": "End with friendly closing phrases and your first name only. Do not write your surname or sign."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Empathetic opening (2 marks)",
            "Three distinct study habits explained (6 marks)",
            "Encouraging conclusion (2 marks)"
          ],
          "diagnosticChecklist": [
            "Empathetic opening present",
            "Three study tips developed",
            "Meets ~250 words"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Single address layout (1 mark)",
            "Informal salutation (1 mark)",
            "No inside address/heading (1 mark)",
            "4 coherent paragraphs (1 mark)",
            "Informal subscription and first name (1 mark)"
          ],
          "diagnosticChecklist": [
            "Correct layout without inside address",
            "Consistent punctuation",
            "Mononymic sign-off"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Encouraging peer tone (4 marks)",
            "Cohesive linkers used (3 marks)",
            "Varied sentence patterns (3 marks)"
          ],
          "diagnosticChecklist": [
            "Friendly tone without slang",
            "Clear transitional phrases",
            "Precise academic vocabulary"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Anglican Junior High School,\nP.O. Box 102,\nSunyani,\nBono Region.\n20th October, 2026.\n\nDear Kwaku,\n\nI was delighted to receive your letter yesterday, although it saddened me to learn that you are having a difficult time coping with your studies in Sunyani. I completely understand how overwhelming it feels to juggle rigorous junior high school assignments with heavy household chores. When I started Basic 7, I faced the exact same problem until I adopted a few disciplined study habits that completely turned things around for me.\n\nFirst and foremost, I designed a realistic personal study timetable that accommodates all my daily house chores. Instead of leaving homework until late at night when I am exhausted, I complete my most demanding mathematics and science exercises immediately after taking my evening bath at 5:00 p.m. This leaves my mind fresh and alert before dinner.\n\nSecondly, I practice the twenty-five-minute focus technique. Whenever I sit down to revise, I turn off all distractions, set a timer for twenty-five minutes of uninterrupted reading, and take a short five-minute break to stretch. This simple method has significantly improved my concentration and helped me retain difficult historical and scientific definitions without feeling overwhelmed.\n\nFinally, I established a weekend peer revision circle with two diligent classmates. Every Saturday morning, we meet under the school pavilion for two hours to test each other on challenging topics and solve past objective questions. Explaining concepts to my friends has strengthened my own understanding immensely.\n\nTry implementing these three habits over the next two weeks, and I guarantee you will notice a remarkable difference. Give my regards to your parents and little brother Yaw.\n\nYour sincere friend,\nEmmanuel",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Maintain an encouraging peer tone. Introduce your study techniques systematically using transition markers. Conclude with your first name only.",
    "competencyTarget": "Informal Expository Structure, Empathy Register & Transitional Cohesion",
    "learningCompetency": "B7.4.2.1.1: Write friendly letters providing advice and emotional support, utilizing cohesive transition signals and informal epistolary conventions."
  },
  {
    "id": "B7_S4_T_03",
    "section": "theory",
    "questionNumber": 53,
    "theoryIndex": 3,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Semi-Formal Letter",
    "title": "Permission for Cultural Absence",
    "shortSummary": "Write to your Form Master seeking permission to attend your town's Yam Festival.",
    "prompt": "You need to travel with your parents to your hometown for the annual Yam Festival celebrations, which means you will miss classes for three school days. Write a letter to your Form Master, explaining why your presence at the cultural festival is required, stating the exact dates of your absence, and explaining how you intend to make up for missed classwork.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "semi_formal",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Methodist Junior High School,",
          "P.O. Box 55,",
          "Hohoe,",
          "Volta Region.",
          "28th October, 2026."
        ],
        "allowedDatingFormats": [
          "28th October, 2026",
          "28 October 2026"
        ],
        "prohibitedDatingFormats": [
          "28/10/2026",
          "28-10-2026"
        ]
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Mr. Agyeman,",
        "permissibleSalutations": [
          "Dear Mr. Agyeman,",
          "Dear Form Master,"
        ],
        "bannedSalutations": [
          "Dear Sir,",
          "Dear Kwabena,"
        ]
      },
      "captionGuide": {
        "isRequired": true,
        "recommendedStyle": "title_case_underlined",
        "modelCaption": "Permission to be Absent from School for Cultural Festival",
        "rules": [
          "Must be underlined when in Title Case.",
          "Never end with a period."
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "State the purpose of your letter and exact dates of intended absence.",
            "transitionHints": [
              "I write to respectfully seek permission...",
              "I am writing to formally request leave..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Explain the cultural significance of the festival and your mandatory family role.",
            "transitionHints": [
              "The annual Yam Festival is of immense...",
              "As the eldest grandson, my presence is..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "requisition_prayer",
            "guidingQuestion": "Explain your concrete plan to catch up on missed classwork.",
            "transitionHints": [
              "To ensure that I do not fall behind...",
              "I have already arranged with the class prefect..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Politely thank the Form Master and anticipate his approval.",
            "transitionHints": [
              "I humbly hope that my request meets...",
              "Thank you very much for your understanding..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "semi_formal",
        "subscription": "Yours sincerely,",
        "requiresHandwrittenSignature": false,
        "printedNameFormat": "full_name_title_case",
        "coOccurrenceConstraint": "Because the salutation uses a surname ('Dear Mr. Agyeman,'), the subscription MUST be 'Yours sincerely,'."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Exact absence dates stated (3 marks)",
            "Cultural justification (3 marks)",
            "Academic catch-up plan (4 marks)"
          ],
          "diagnosticChecklist": [
            "Exact dates given",
            "Cultural reason clearly explained",
            "Academic catch-up plan provided"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Single address formatted (1 mark)",
            "Surname salutation (1 mark)",
            "Underlined Title Case caption (1 mark)",
            "4 logical paragraphs (1 mark)",
            "Yours sincerely + full name (1 mark)"
          ],
          "diagnosticChecklist": [
            "Underline present on caption",
            "Subscription spelled correctly",
            "Full name printed"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Respectful tone for an educator (4 marks)",
            "No informal contractions (3 marks)",
            "Varied sentence patterns (3 marks)"
          ],
          "diagnosticChecklist": [
            "Polite expressions used",
            "Zero slang",
            "Clear compound/complex sentences"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Methodist Junior High School,\nP.O. Box 55,\nHohoe,\nVolta Region.\n28th October, 2026.\n\nDear Mr. Agyeman,\n\nPermission to be Absent from School for Cultural Festival\n________________________________________________________\n\nI write to respectfully seek your permission to be absent from school for three days, starting from Wednesday, 4th November, to Friday, 6th November, 2026.\n\nThis temporary absence is necessitated by our annual community Yam Festival, which takes place in my ancestral hometown of Asikuma. As the eldest son of the royal stool elders, my physical participation is traditionally required during the sacred cleansing rituals and ancestral prayers that precede the public durbar. My family considers this cultural observance an indispensable family responsibility.\n\nI am deeply conscious of the importance of our ongoing Basic 7 second-term syllabus. To ensure that my studies are not disrupted, I have consulted my subject teachers in advance and obtained the weekend reading assignments for Integrated Science, Mathematics, and English Language. Furthermore, my classmate and study partner, Selorm Mensah, has promised to collect all class handouts and take detailed lesson notes on my behalf throughout my absence.\n\nI shall resume classes promptly on Monday, 9th November, and submit all completed assignments for your evaluation. I humbly hope that my request meets your kind understanding and approval.\n\nThank you very much for your continuous guidance and support.\n\nYours sincerely,\nKwame Darko",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Salute your Form Master using title and surname: 'Dear Mr. [Surname],'. Provide an underlined Title Case heading. Conclude with 'Yours sincerely,' followed by your full name. Avoid informal contractions.",
    "competencyTarget": "Semi-Formal Epistolary Etiquette, Surname Salutation & Underlined Title Case Caption",
    "learningCompetency": "B7.4.2.1.2: Compose semi-formal requests adhering to respectful formal registers, surname salutations, underlined Title Case captions, and 'Yours sincerely,' subscriptions."
  },
  {
    "id": "B7_S4_T_04",
    "section": "theory",
    "questionNumber": 54,
    "theoryIndex": 4,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Formal Letter",
    "title": "Library Rehabilitation Appeal",
    "shortSummary": "Write to the Headteacher outlining library problems and three solutions.",
    "prompt": "As the Class Prefect of Basic 7, write a formal letter to your Headteacher pointing out the inadequate state of reading books and furniture in the school library, and proposing at least three practical measures the school administration can take to improve the facility for students.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "formal_administrative",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Basic 7 Classroom Secretariat,",
          "St. Peter's Junior High School,",
          "P.O. Box 78,",
          "Kumasi,",
          "Ashanti Region.",
          "5th November, 2026."
        ],
        "allowedDatingFormats": [
          "5th November, 2026",
          "5 November 2026"
        ],
        "prohibitedDatingFormats": [
          "05/11/2026",
          "5-11-2026"
        ]
      },
      "insideAddress": {
        "isRequired": true,
        "titleDesignationPlaceholder": "The Headteacher,",
        "officeOrSchoolPlaceholder": "St. Peter's Junior High School,",
        "postalBoxPlaceholder": "P.O. Box 78,",
        "townRegionPlaceholder": "Kumasi, Ashanti Region.",
        "formatContaminationPenaltyWarning": "CRITICAL: Inside address is mandatory in formal letters."
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Sir,",
        "permissibleSalutations": [
          "Dear Sir,",
          "Dear Madam,"
        ],
        "bannedSalutations": [
          "Dear Mr. Mensah,",
          "Dear Headmaster,"
        ]
      },
      "captionGuide": {
        "isRequired": true,
        "recommendedStyle": "full_caps_no_underline",
        "modelCaption": "APPEAL FOR IMPROVEMENT OF THE SCHOOL LIBRARY FACILITY",
        "rules": [
          "When writing in FULL CAPITAL LETTERS, DO NOT UNDERLINE.",
          "Never end with a period."
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "State your role as Class Prefect and declare the purpose directly.",
            "transitionHints": [
              "I write in my capacity as the Class Prefect...",
              "On behalf of the Basic 7 stream, I draw attention to..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Describe the current library deficits (broken chairs, outdated books).",
            "transitionHints": [
              "At present, the library lacks sufficient...",
              "Furthermore, the existing book shelves contain..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "requisition_prayer",
            "guidingQuestion": "Propose three concrete improvement solutions.",
            "transitionHints": [
              "To resolve this challenge, we suggest that...",
              "First, the administration could appeal to the PTA..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Reaffirm student commitment and express hope for swift action.",
            "transitionHints": [
              "We trust that your high office will...",
              "Thank you in advance for your..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "quadripartite",
        "subscription": "Yours faithfully,",
        "requiresHandwrittenSignature": true,
        "printedNameFormat": "full_name_title_case",
        "designationPlaceholder": "Class Prefect, Basic 7",
        "coOccurrenceConstraint": "The salutation 'Dear Sir,' strictly mandates 'Yours faithfully,' followed by signature, name, and designation."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Prefect role and purpose stated (2 marks)",
            "Detailed library shortcomings (4 marks)",
            "Three practical solutions proposed (4 marks)"
          ],
          "diagnosticChecklist": [
            "Purpose stated in paragraph 1",
            "Book and furniture deficits documented",
            "Three solutions offered"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Two addresses correctly formatted (1 mark)",
            "Formal salutation 'Dear Sir,' (1 mark)",
            "Full capital caption without underline (1 mark)",
            "4-paragraph flow (1 mark)",
            "Quadripartite sign-off complete (1 mark)"
          ],
          "diagnosticChecklist": [
            "Both sender and inside addresses present",
            "No underline on all-caps heading",
            "Four-part sign-off correct"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Formal administrative tone (4 marks)",
            "Zero informal contractions (3 marks)",
            "Mature vocabulary and transitions (3 marks)"
          ],
          "diagnosticChecklist": [
            "Impersonal, business-like tone",
            "Accurate formal verbs",
            "Complete syntactic clauses"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Basic 7 Classroom Secretariat,\nSt. Peter's Junior High School,\nP.O. Box 78,\nKumasi,\nAshanti Region.\n5th November, 2026.\n\nThe Headteacher,\nSt. Peter's Junior High School,\nP.O. Box 78,\nKumasi,\nAshanti Region.\n\nDear Sir,\n\nAPPEAL FOR IMPROVEMENT OF THE SCHOOL LIBRARY FACILITY\n\nI write in my capacity as the Class Prefect of Basic 7, and on behalf of the entire student body, to respectfully draw your attention to the deteriorating state of our school library and to suggest practical measures for its rehabilitation.\n\nAt present, the library can no longer support effective independent study. There are only fifteen functional wooden chairs to serve a school population of over three hundred students, forcing many pupils to sit on concrete window sills during private study periods. Furthermore, the vast majority of supplementary reading books and encyclopedias are outdated, with several key pages torn or missing.\n\nTo resolve these pressing difficulties, we humbly propose three immediate interventions. First, the school administration could appeal to the Parent-Teacher Association (PTA) to donate supplementary storybooks and modern English curriculum reference texts. Second, the school could procure fifty durable plastic chairs to accommodate an entire class stream at a time. Finally, the student representative council could organize a voluntary 'Donate-a-Book' campaign among parents and alumni to replenish our fiction shelves.\n\nWe are confident that if these measures are implemented, student reading habits and academic performance will improve significantly.\n\nThank you very much for your continuous dedication to our welfare.\n\nYours faithfully,\n[Signature]\nFrancis Appiah\nClass Prefect, Basic 7",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Include two addresses. Write the caption in FULL BLOCK CAPITALS without an underline. Salute with 'Dear Sir,' and conclude with 'Yours faithfully,', a signature mark, full name, and designation.",
    "competencyTarget": "Formal Two-Address Framework, Block Capital Caption & Quadripartite Close",
    "learningCompetency": "B7.4.2.1.2: Compose formal administrative letters observing dual-address layouts, impersonal objective registers, un-underlined Block Capital captions, and complete quadripartite sign-offs."
  },
  {
    "id": "B7_S4_T_05",
    "section": "theory",
    "questionNumber": 55,
    "theoryIndex": 5,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Civic Petition",
    "title": "Borehole Repair Petition to DCE",
    "shortSummary": "Petition your District Chief Executive over broken community drinking water facilities.",
    "prompt": "The only mechanized borehole supplying potable drinking water to your school and the surrounding community has broken down, forcing pupils to fetch untreated water from a polluted stream. As the Youth Club Secretary, write a formal petition to your District Chief Executive (DCE), explaining the health risks students are facing and appealing for the urgent repair of the borehole and the provision of an additional water tank.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "civic_petition",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Bosomtwe Youth Development Club,",
          "P.O. Box 14,",
          "Kuntanase,",
          "Ashanti Region.",
          "12th November, 2026."
        ],
        "allowedDatingFormats": [
          "12th November, 2026",
          "12 November 2026"
        ],
        "prohibitedDatingFormats": [
          "12/11/2026",
          "12-11-2026"
        ]
      },
      "insideAddress": {
        "isRequired": true,
        "titleDesignationPlaceholder": "The District Chief Executive,",
        "officeOrSchoolPlaceholder": "Bosomtwe District Assembly,",
        "postalBoxPlaceholder": "P.O. Box 1,",
        "townRegionPlaceholder": "Kuntanase, Ashanti Region.",
        "formatContaminationPenaltyWarning": "CRITICAL: Formal petitions to state officials require a full inside address."
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Sir,",
        "permissibleSalutations": [
          "Dear Sir,",
          "Honorable Sir,"
        ],
        "bannedSalutations": [
          "Dear Mr. DCE,",
          "Hello Sir,"
        ]
      },
      "captionGuide": {
        "isRequired": true,
        "recommendedStyle": "full_caps_no_underline",
        "modelCaption": "PETITION CONCERNING THE BREAKDOWN OF THE COMMUNITY MECHANIZED BOREHOLE",
        "rules": [
          "Block headings must not be underlined.",
          "Must never end with a period."
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "Establish your representational standing and declare the petition's focus.",
            "transitionHints": [
              "We, the executive members of the Youth Club, respectfully petition...",
              "I write on behalf of the students and residents of Kuntanase to..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Describe the mechanical failure and the severe health hazards students face.",
            "transitionHints": [
              "Three weeks ago, the mechanical pump broke down...",
              "Consequently, pupils are forced to drink from the polluted..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "requisition_prayer",
            "guidingQuestion": "Detail your formal prayer (emergency pump repair and a poly-tank).",
            "transitionHints": [
              "We therefore humbly pray that your office...",
              "Specifically, we appeal for the immediate dispatch of engineers to..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Conclude with an urgent appeal to avert a public health disaster.",
            "transitionHints": [
              "We trust in your prompt intervention to avert...",
              "Thank you for your prompt consideration of this..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "quadripartite",
        "subscription": "Yours faithfully,",
        "requiresHandwrittenSignature": true,
        "printedNameFormat": "full_name_title_case",
        "designationPlaceholder": "Secretary, Youth Development Club",
        "coOccurrenceConstraint": "Always sign off formal petitions with 'Yours faithfully,', signature, printed full name, and leadership designation."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Representational standing established (2 marks)",
            "Evidence-based health hazards described (4 marks)",
            "Structured two-point prayer (4 marks)"
          ],
          "diagnosticChecklist": [
            "Petitioners identified",
            "Health risks detailed",
            "Explicit prayer stated"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Two addresses correctly laid out (1 mark)",
            "Formal salutation (1 mark)",
            "Block capital caption without underline (1 mark)",
            "4-paragraph structure (1 mark)",
            "Quadripartite sign-off with designation (1 mark)"
          ],
          "diagnosticChecklist": [
            "Inside address formatted correctly",
            "Correct caption format",
            "Complete four-part sign-off"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Authoritative civic advocacy tone (4 marks)",
            "Zero informal contractions (3 marks)",
            "Persuasive vocabulary (3 marks)"
          ],
          "diagnosticChecklist": [
            "Formal administrative language used",
            "Logical problem-evidence-prayer progression",
            "Consistent formal perspective"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Bosomtwe Youth Development Club,\nP.O. Box 14,\nKuntanase,\nAshanti Region.\n12th November, 2026.\n\nThe District Chief Executive,\nBosomtwe District Assembly,\nP.O. Box 1,\nKuntanase,\nAshanti Region.\n\nDear Sir,\n\nPETITION CONCERNING THE BREAKDOWN OF THE COMMUNITY MECHANIZED BOREHOLE\n\nI write on behalf of the executive committee of the Bosomtwe Youth Development Club and the student body of Kuntanase Junior High School to respectfully submit this urgent petition regarding the acute water crisis in our community.\n\nThree weeks ago, the electrical submersible pump of our only mechanized borehole broke down completely due to a power surge. Since then, over five hundred school children and community residents have had no access to potable drinking water. Consequently, pupils are forced to walk two kilometers every morning to fetch untreated water from the polluted Subin stream. Several students have already contracted severe waterborne ailments, including acute dysentery and typhoid fever, resulting in alarming absenteeism in our school.\n\nWe therefore humbly pray that your honorable office intervene swiftly by implementing two critical remedial actions. First, we appeal for the immediate dispatch of the district water engineers to replace the burnt submersible pump and restore the borehole. Second, we respectfully request the provision of a five-thousand-liter poly-tank for our school to serve as a strategic emergency water reserve during future utility interruptions.\n\nWe trust that your prompt leadership will avert a catastrophic public health epidemic in our district.\n\nThank you very much for your anticipated cooperation and swift intervention.\n\nYours faithfully,\n[Signature]\nSamuel Osei\nSecretary, Youth Development Club",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Address to 'The District Chief Executive,'. State the problem factually in the caption. Use an authoritative formal civic register. End with 'Yours faithfully,', signature, full name, and designation.",
    "competencyTarget": "Civic Petition Architecture, Forensic Preamble & Legislative Prayer",
    "learningCompetency": "B7.4.2.1.2: Compose civic petitions to local administrative authorities adhering to statutory preamble protocols, evidence-based expositions, formal prayers, and executive sign-offs."
  },
  {
    "id": "B7_S4_T_06",
    "section": "theory",
    "questionNumber": 56,
    "theoryIndex": 6,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Informal Letter",
    "title": "Festival Celebration Invitation",
    "shortSummary": "Invite a pen pal in Tamale to spend the annual Kundum festival holidays with your family.",
    "prompt": "Your community will be celebrating its annual Kundum festival next month. Write a letter to your pen pal in Tamale, inviting him or her to spend the festival holidays with your family. Describe at least two major cultural activities that take place during the festival and explain how your family plans to host your guest.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "informal",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Methodist Junior High School,",
          "P.O. Box 18,",
          "Axim,",
          "Western Region.",
          "18th November, 2026."
        ],
        "allowedDatingFormats": [
          "18th November, 2026",
          "18 November 2026"
        ],
        "prohibitedDatingFormats": [
          "18/11/2026"
        ]
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Fuseini,",
        "permissibleSalutations": [
          "Dear Fuseini,",
          "My dear friend Fuseini,"
        ],
        "bannedSalutations": [
          "Dear Sir,"
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "Warmly enquire about his welfare and extend the invitation to the Kundum festival.",
            "transitionHints": [
              "I hope this letter finds you well...",
              "I am thrilled to invite you to..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Describe two exciting cultural activities (e.g., traditional drumming and royal durbar).",
            "transitionHints": [
              "The festival is celebrated with magnificent...",
              "The most captivating highlight is..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "exposition_body_2",
            "guidingQuestion": "Explain your family's hospitality arrangements (meals, accommodation, sight-seeing).",
            "transitionHints": [
              "My parents have already prepared...",
              "Mother has promised to cook special..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Reiterate your excitement and ask him to confirm his travel dates.",
            "transitionHints": [
              "Please let me know when you will arrive...",
              "I cannot wait to show you around..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "mononymic",
        "subscription": "Your sincere friend,",
        "requiresHandwrittenSignature": false,
        "printedNameFormat": "first_name_only",
        "coOccurrenceConstraint": "Informal letters conclude with friendly subscription and first name only."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Warm invitation extended (2 marks)",
            "Two cultural festival highlights described (5 marks)",
            "Family hosting arrangements explained (3 marks)"
          ],
          "diagnosticChecklist": [
            "Invitation clearly stated",
            "Festival activities described vividly",
            "Hosting details provided"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Single address format (1 mark)",
            "Informal salutation (1 mark)",
            "No inside address/heading (1 mark)",
            "4 paragraphs (1 mark)",
            "Mononymic sign-off (1 mark)"
          ],
          "diagnosticChecklist": [
            "Correct layout",
            "Consistent punctuation",
            "First name only at closing"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Enthusiastic friendly tone (4 marks)",
            "Natural contractions (3 marks)",
            "Vivid cultural vocabulary (3 marks)"
          ],
          "diagnosticChecklist": [
            "Lively tone",
            "Clear transitions",
            "Apt descriptive vocabulary"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Methodist Junior High School,\nP.O. Box 18,\nAxim,\nWestern Region.\n18th November, 2026.\n\nDear Fuseini,\n\nI hope this letter finds you in great health and high spirits in Tamale. It has been several months since we last exchanged letters, and I am writing to enthusiastically invite you to spend the forthcoming vacation with my family in Axim during our annual Kundum festival.\n\nThe festival will commence on the second week of December, and it promises to be an unforgettable cultural celebration. The entire town comes alive with rhythmic Kundum drumming, captivating brass-band processions, and energetic traditional dancing competitions in the town square. The grand durbar of chiefs is the most spectacular highlight; paramount rulers adorned in majestic kente regalia and heavy gold ornaments are paraded through the streets in ornate palanquins.\n\nMy parents are delighted about your intended visit and have already prepared our spacious guest room for your stay. Mother has promised to prepare authentic coastal delicacies, including fresh grilled lobster, spicy fish stew, and cassava fufu. We will also visit the historic Fort Saint Anthony and take an afternoon swim at the pristine rocky beach.\n\nPlease discuss this trip with your parents and write back to confirm your arrival date so that father can pick you up from the bus terminal. I cannot wait to welcome you to Axim!\n\nYour sincere friend,\nKwesi",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Use single address formatting. Introduce the festival enthusiastically. Describe traditional drumming, dancing, and royal durbars. End with your first name only.",
    "competencyTarget": "Informal Cultural Expository Register & Warm Hospitality",
    "learningCompetency": "B7.4.2.1.1: Compose friendly personal letters describing cultural events and extending hospitable invitations."
  },
  {
    "id": "B7_S4_T_07",
    "section": "theory",
    "questionNumber": 57,
    "theoryIndex": 7,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Semi-Formal Letter",
    "title": "Testimonial Requisition to Former Headteacher",
    "shortSummary": "Request a scholarship recommendation from your former primary school headteacher.",
    "prompt": "You are applying for a regional leadership and academic merit scholarship offered by a non-governmental organization. Write a semi-formal letter to your former primary school headteacher, respectfully requesting a testimonial of recommendation attesting to your past academic diligence and school service.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "semi_formal",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Presbyterian Junior High School,",
          "P.O. Box 40,",
          "Koforidua,",
          "Eastern Region.",
          "22nd November, 2026."
        ],
        "allowedDatingFormats": [
          "22nd November, 2026",
          "22 November 2026"
        ],
        "prohibitedDatingFormats": [
          "22/11/2026"
        ]
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Mrs. Mensah,",
        "permissibleSalutations": [
          "Dear Mrs. Mensah,",
          "Dear Headmistress,"
        ],
        "bannedSalutations": [
          "Dear Sir,",
          "Dear Grace,"
        ]
      },
      "captionGuide": {
        "isRequired": true,
        "recommendedStyle": "title_case_underlined",
        "modelCaption": "Request for Academic Testimonial and Recommendation",
        "rules": [
          "Must be underlined in Title Case.",
          "No period at the end."
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "State the purpose of your letter and announce your application for the scholarship.",
            "transitionHints": [
              "I write to respectfully request...",
              "I am applying for the prestigious..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Remind the headteacher of your academic records and leadership service at her primary school.",
            "transitionHints": [
              "During my tenure as the Girls' Prefect...",
              "I consistently maintained academic leadership in..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "requisition_prayer",
            "guidingQuestion": "State the submission deadline and specific testimonial requirements.",
            "transitionHints": [
              "The scholarship secretariat requires a letter...",
              "I would be deeply grateful if the testimonial could highlight..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Express heartfelt gratitude for her continuous mentorship.",
            "transitionHints": [
              "Thank you very much for your enduring guidance...",
              "I look forward to your kind assistance..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "semi_formal",
        "subscription": "Yours sincerely,",
        "requiresHandwrittenSignature": false,
        "printedNameFormat": "full_name_title_case",
        "coOccurrenceConstraint": "Surname salutations mandate 'Yours sincerely,' followed by your full name."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Scholarship purpose stated (3 marks)",
            "Past primary school achievements recalled (4 marks)",
            "Clear deadline and submission details (3 marks)"
          ],
          "diagnosticChecklist": [
            "Purpose clearly stated",
            "Past records referenced respectfully",
            "Submission details provided"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Single address format (1 mark)",
            "Surname salutation (1 mark)",
            "Underlined Title Case caption (1 mark)",
            "4 paragraphs (1 mark)",
            "Yours sincerely + full name (1 mark)"
          ],
          "diagnosticChecklist": [
            "Title Case underlined",
            "Correct subscription",
            "Full printed name"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Deferential and courteous tone (4 marks)",
            "No informal contractions (3 marks)",
            "Polished academic vocabulary (3 marks)"
          ],
          "diagnosticChecklist": [
            "Polite expressions throughout",
            "Zero colloquial slang",
            "Well-constructed clauses"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Presbyterian Junior High School,\nP.O. Box 40,\nKoforidua,\nEastern Region.\n22nd November, 2026.\n\nDear Mrs. Mensah,\n\nRequest for Academic Testimonial and Recommendation\n__________________________________________________\n\nI write to respectfully inform you that I have been shortlisted for the Eastern Regional Youth Leadership Scholarship, awarded by the Global Educational Foundation to promising junior secondary pupils.\n\nTo complete the final screening process, the scholarship board requires a confidential testimonial from my former primary school headteacher attesting to my academic performance, conduct, and leadership qualities. During my final year at Grace Memorial Primary School in 2025, I had the privilege of serving as the School Compound Prefect and graduated as the best overall student in the Basic Education Certificate mock examinations.\n\nI would be immensely grateful if you could write a brief letter of recommendation highlighting my academic consistency, discipline, and dedication to school service. The foundation requires all supporting documents to be submitted online by Friday, 11th December, 2026.\n\nI remain profoundly grateful for the moral values and academic foundation you instilled in me during my primary school years.\n\nThank you very much for your time, consideration, and continuous support.\n\nYours sincerely,\nAbigail Ofori",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Salute with 'Dear Mrs. [Surname],'. Provide an underlined Title Case caption. Recall your past school contributions respectfully. End with 'Yours sincerely,' and your full name.",
    "competencyTarget": "Semi-Formal Testimonial Requisition & Deferential Etiquette",
    "learningCompetency": "B7.4.2.1.2: Compose semi-formal requests to former educators following surname salutations, underlined captions, and courteous justification."
  },
  {
    "id": "B7_S4_T_08",
    "section": "theory",
    "questionNumber": 58,
    "theoryIndex": 8,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Formal Letter",
    "title": "Prefectorial Leadership Application",
    "shortSummary": "Apply for the position of Assistant School Compound Prefect to the Senior Housemaster.",
    "prompt": "The electoral board of your school has opened nominations for junior leadership positions. Write a formal letter of application to your Senior Housemaster, applying to be considered for the position of Assistant School Compound Prefect. State your qualifications, past leadership experience, and outline two innovative sanitation ideas you will implement if appointed.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "formal_administrative",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Basic 7 Stream B,",
          "Presbyterian Junior High School,",
          "P.O. Box 12,",
          "Tema,",
          "Greater Accra Region.",
          "25th November, 2026."
        ],
        "allowedDatingFormats": [
          "25th November, 2026",
          "25 November 2026"
        ],
        "prohibitedDatingFormats": [
          "25/11/2026"
        ]
      },
      "insideAddress": {
        "isRequired": true,
        "titleDesignationPlaceholder": "The Senior Housemaster,",
        "officeOrSchoolPlaceholder": "Presbyterian Junior High School,",
        "postalBoxPlaceholder": "P.O. Box 12,",
        "townRegionPlaceholder": "Tema, Greater Accra Region.",
        "formatContaminationPenaltyWarning": "CRITICAL: Inside address is mandatory."
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Sir,",
        "permissibleSalutations": [
          "Dear Sir,"
        ],
        "bannedSalutations": [
          "Dear Mr. Senior Housemaster,"
        ]
      },
      "captionGuide": {
        "isRequired": true,
        "recommendedStyle": "full_caps_no_underline",
        "modelCaption": "APPLICATION FOR THE POSITION OF ASSISTANT COMPOUND PREFECT",
        "rules": [
          "Do not underline all-caps headings.",
          "Never end with a period."
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "Directly state the leadership position you are applying for.",
            "transitionHints": [
              "I write to formally submit my application for...",
              "With reference to the notice on prefectorial nominations..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Highlight your discipline, punctuality, and past leadership experience.",
            "transitionHints": [
              "Throughout my first year in Basic 7, I have demonstrated...",
              "In primary school, I served creditably as..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "requisition_prayer",
            "guidingQuestion": "Outline two innovative sanitation initiatives you plan to introduce.",
            "transitionHints": [
              "If given the opportunity, I will introduce...",
              "First, I intend to establish a 'Clean Class of the Week' award..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Express your commitment to school discipline and readiness for an interview.",
            "transitionHints": [
              "I pledge to uphold the noble traditions of our school...",
              "I look forward to an opportunity to be interviewed..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "quadripartite",
        "subscription": "Yours faithfully,",
        "requiresHandwrittenSignature": true,
        "printedNameFormat": "full_name_title_case",
        "designationPlaceholder": "Student, Basic 7B",
        "coOccurrenceConstraint": "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Application purpose declared clearly (2 marks)",
            "Leadership qualifications highlighted (4 marks)",
            "Two actionable sanitation innovations proposed (4 marks)"
          ],
          "diagnosticChecklist": [
            "Position applied for is clear",
            "Personal qualities demonstrated",
            "Two sanitation initiatives outlined"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Two addresses correctly laid out (1 mark)",
            "Formal salutation (1 mark)",
            "Block capital caption without underline (1 mark)",
            "4 paragraphs (1 mark)",
            "Quadripartite sign-off complete (1 mark)"
          ],
          "diagnosticChecklist": [
            "Dual addresses present",
            "Un-underlined all-caps caption",
            "Complete 4-tier sign-off"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Formal, confident administrative register (4 marks)",
            "Zero contractions (3 marks)",
            "Persuasive vocabulary (3 marks)"
          ],
          "diagnosticChecklist": [
            "Objective tone",
            "Formal transitions",
            "Well-developed compound sentences"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Basic 7 Stream B,\nPresbyterian Junior High School,\nP.O. Box 12,\nTema,\nGreater Accra Region.\n25th November, 2026.\n\nThe Senior Housemaster,\nPresbyterian Junior High School,\nP.O. Box 12,\nTema,\nGreater Accra Region.\n\nDear Sir,\n\nAPPLICATION FOR THE POSITION OF ASSISTANT COMPOUND PREFECT\n\nI write to formally submit my application for the leadership position of Assistant School Compound Prefect for the upcoming academic session, pursuant to the notice on prefectorial nominations.\n\nThroughout my time in Basic 7, I have consistently demonstrated punctuality, personal discipline, and active involvement in school sanitation activities. In my final year of primary school, I served diligently as the Health and Environment Monitor, where I developed practical skills in coordinating student duty rosters and managing morning cleanup exercises fairly.\n\nIf appointed to this honorable office, I intend to implement two innovative sanitation initiatives. First, I will establish a competitive 'Cleanest Classroom of the Week' scheme to encourage pupils to keep their verandas clean without constant teacher supervision. Second, I plan to introduce color-coded waste collection bins across the sports field to separate plastic sachets from paper waste, which will facilitate recycling and keep our compound tidy.\n\nI pledge to discharge my duties with fairness, humility, and unwavering loyalty to the school administration.\n\nThank you very much for considering my application.\n\nYours faithfully,\n[Signature]\nDaniel Mensah\nStudent, Basic 7B",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Use two addresses. Write the heading in BLOCK CAPITALS without underline. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', signature, full name, and class designation.",
    "competencyTarget": "Formal Application Architecture, Objective Self-Advocacy & Quadripartite Close",
    "learningCompetency": "B7.4.2.1.2: Compose formal letters of application demonstrating persuasive self-evaluation, dual-address layouts, block captions, and quadripartite sign-offs."
  },
  {
    "id": "B7_S4_T_09",
    "section": "theory",
    "questionNumber": 59,
    "theoryIndex": 9,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Civic Petition",
    "title": "School Speed Tables Petition to MCE",
    "shortSummary": "Petition your Municipal Chief Executive for speed ramps following student accidents.",
    "prompt": "Reckless commercial speeding on the highway fronting your school has caused multiple hit-and-run accidents involving pupils. As the President of the School Road Safety Club, write a formal petition to your Municipal Chief Executive (MCE), detailing the dangers students face when crossing the road and appealing for the urgent installation of concrete speed tables and pedestrian road crossings.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "civic_petition",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Road Safety Club Secretariat,",
          "Madina Islamic Junior High School,",
          "P.O. Box MD 45,",
          "Madina-Accra.",
          "28th November, 2026."
        ],
        "allowedDatingFormats": [
          "28th November, 2026",
          "28 November 2026"
        ],
        "prohibitedDatingFormats": [
          "28/11/2026"
        ]
      },
      "insideAddress": {
        "isRequired": true,
        "titleDesignationPlaceholder": "The Municipal Chief Executive,",
        "officeOrSchoolPlaceholder": "La-Nkwantanang Madina Municipal Assembly,",
        "postalBoxPlaceholder": "P.O. Box MD 11,",
        "townRegionPlaceholder": "Madina-Accra.",
        "formatContaminationPenaltyWarning": "CRITICAL: Full inside address is required."
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Sir,",
        "permissibleSalutations": [
          "Dear Sir,",
          "Honorable Sir,"
        ],
        "bannedSalutations": [
          "Dear MCE,"
        ]
      },
      "captionGuide": {
        "isRequired": true,
        "recommendedStyle": "full_caps_no_underline",
        "modelCaption": "PETITION FOR THE URGENT CONSTRUCTION OF SPEED RAMPS NEAR OUR SCHOOL",
        "rules": [
          "Do not underline block capital headings.",
          "Never end with a period."
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "Establish your club's representational standing and declare the petition's road safety objective.",
            "transitionHints": [
              "I write on behalf of the Road Safety Club...",
              "We respectfully petition your honorable office regarding..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Document recent reckless speeding incidents and pedestrian hazards.",
            "transitionHints": [
              "Over the past two months, reckless commercial drivers...",
              "Tragically, three pupils have suffered severe injuries while..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "requisition_prayer",
            "guidingQuestion": "Present your formal prayer (speed tables, zebra crossing, warning signage).",
            "transitionHints": [
              "We therefore humbly pray that the municipal assembly...",
              "Specifically, we appeal for the immediate construction of..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Appeal for urgent intervention before further lives are lost.",
            "transitionHints": [
              "We trust in your prompt action to safeguard...",
              "Thank you for your dedicated service to our municipality..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "quadripartite",
        "subscription": "Yours faithfully,",
        "requiresHandwrittenSignature": true,
        "printedNameFormat": "full_name_title_case",
        "designationPlaceholder": "President, School Road Safety Club",
        "coOccurrenceConstraint": "'Dear Sir,' strictly mandates 'Yours faithfully,'."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Civic club representation established (2 marks)",
            "Evidence-based road traffic hazards documented (4 marks)",
            "Clear three-point road safety prayer (4 marks)"
          ],
          "diagnosticChecklist": [
            "Club standing established",
            "Accident details documented",
            "Actionable solutions proposed"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Two addresses formatted correctly (1 mark)",
            "Formal salutation (1 mark)",
            "Block capital caption without underline (1 mark)",
            "4 paragraphs (1 mark)",
            "Complete quadripartite sign-off (1 mark)"
          ],
          "diagnosticChecklist": [
            "Inside address present",
            "Caption properly formatted",
            "Four-part sign-off complete"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Urgent, authoritative civic register (4 marks)",
            "Zero informal contractions (3 marks)",
            "Persuasive vocabulary (3 marks)"
          ],
          "diagnosticChecklist": [
            "Forceful civic language",
            "Logical rhetorical progression",
            "Precise technical road terminology"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Road Safety Club Secretariat,\nMadina Islamic Junior High School,\nP.O. Box MD 45,\nMadina-Accra.\n28th November, 2026.\n\nThe Municipal Chief Executive,\nLa-Nkwantanang Madina Municipal Assembly,\nP.O. Box MD 11,\nMadina-Accra.\n\nDear Sir,\n\nPETITION FOR THE URGENT CONSTRUCTION OF SPEED RAMPS NEAR OUR SCHOOL\n\nI write on behalf of the Road Safety Club and the student body of Madina Islamic Junior High School to respectfully petition your high office regarding the grave vehicular hazards confronting pupils along the main Madina-Pantang highway.\n\nOver the past two terms, commercial minibus and heavy haulage drivers have treated the stretch in front of our school as a high-speed expressway. The absence of traffic-calming devices has made crossing the road during morning arrival and afternoon closing hours hazardous. Tragically, within the last month alone, two Basic 7 pupils were struck by speeding vehicles while attempting to cross to school, sustaining severe orthopedic injuries that required hospitalization.\n\nTo prevent further loss of innocent student lives, we humbly pray that your honorable administration take three immediate remedial measures. First, we appeal for the urgent construction of two raised asphalt speed tables on both approaches to the school entrance. Second, we request the painting of a visible zebra crossing across the carriageway. Finally, we urge the assembly to install prominent 'School Zone: Speed Limit 30 km/h' warning signposts.\n\nWe are confident that your prompt intervention will protect our pupils and restore safety to our school community.\n\nThank you very much for your leadership and anticipated cooperation.\n\nYours faithfully,\n[Signature]\nMustapha Haruna\nPresident, School Road Safety Club",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Address to 'The Municipal Chief Executive,'. State the urgent danger in the caption. Use an authoritative formal register. End with 'Yours faithfully,', signature, full name, and club designation.",
    "competencyTarget": "Civic Road Safety Petition Architecture & Requisition Precision",
    "learningCompetency": "B7.4.2.1.2: Compose civic petitions to local assemblies addressing road safety emergencies using forensic evidence, structured prayers, and executive sign-offs."
  },
  {
    "id": "B7_S4_T_10",
    "section": "theory",
    "questionNumber": 60,
    "theoryIndex": 10,
    "type": "structured_essay",
    "format": "structured_essay",
    "level": "B7",
    "difficulty": "foundation",
    "category": "Formal Letter",
    "title": "Combating Truancy (Letter to Editor)",
    "shortSummary": "Write to the Editor of a daily newspaper on youth gaming center truancy.",
    "prompt": "There is an alarming increase in teenage truancy in your neighborhood due to children abandoning classes to patronize commercial video-gaming and sports betting parlors. Write a letter to the Editor of a national daily newspaper, expressing concern about this social menace, analyzing its effects on school attendance, and suggesting two practical ways parents and local authorities can eliminate the problem.",
    "wordCountLimit": {
      "min": 180,
      "target": 250,
      "max": 320
    },
    "points": 30,
    "guidanceScaffold": {
      "letterType": "formal_administrative",
      "senderAddress": {
        "recommendedStyle": "blocked",
        "recommendedPunctuation": "closed",
        "defaultLinesPlaceholder": [
          "Old Tafo Community Youth Desk,",
          "P.O. Box 88,",
          "Old Tafo-Kumasi,",
          "Ashanti Region.",
          "2nd December, 2026."
        ],
        "allowedDatingFormats": [
          "2nd December, 2026",
          "2 December 2026"
        ],
        "prohibitedDatingFormats": [
          "02/12/2026"
        ]
      },
      "insideAddress": {
        "isRequired": true,
        "titleDesignationPlaceholder": "The Editor,",
        "officeOrSchoolPlaceholder": "Daily Graphic,",
        "postalBoxPlaceholder": "P.O. Box 742,",
        "townRegionPlaceholder": "Accra.",
        "formatContaminationPenaltyWarning": "CRITICAL: Letters to the press require the editor's inside address."
      },
      "salutationGuide": {
        "recommendedSalutation": "Dear Sir,",
        "permissibleSalutations": [
          "Dear Sir,",
          "Sir,"
        ],
        "bannedSalutations": [
          "Dear Editor,"
        ]
      },
      "captionGuide": {
        "isRequired": true,
        "recommendedStyle": "full_caps_no_underline",
        "modelCaption": "CURBING THE MENACE OF TEENAGE TRUANCY IN GAMING CENTERS",
        "rules": [
          "Do not underline all-caps headings.",
          "Never end with a period."
        ]
      },
      "bodyGuidance": {
        "minimumWordCount": 180,
        "targetWordCount": 250,
        "recommendedParagraphs": 4,
        "paragraphPrompts": [
          {
            "paragraphIndex": 1,
            "role": "preamble_opening",
            "guidingQuestion": "Request editorial space and state the social issue directly.",
            "transitionHints": [
              "Permit me space in your widely read newspaper...",
              "I write to draw national attention to the alarming..."
            ]
          },
          {
            "paragraphIndex": 2,
            "role": "exposition_body_1",
            "guidingQuestion": "Analyze how video-game centers induce school absenteeism and academic decline.",
            "transitionHints": [
              "During instructional school hours, dozens of school children...",
              "This addiction leads to chronic truancy, academic failure, and..."
            ]
          },
          {
            "paragraphIndex": 3,
            "role": "requisition_prayer",
            "guidingQuestion": "Propose two practical solutions (assembly bylaws and parental monitoring).",
            "transitionHints": [
              "To eradicate this menace, municipal authorities must...",
              "Furthermore, parents must exercise greater vigilance by..."
            ]
          },
          {
            "paragraphIndex": 4,
            "role": "valediction_conclusion",
            "guidingQuestion": "Summarize the urgency of safeguarding youth education.",
            "transitionHints": [
              "If we fail to act decisively, our educational investments will...",
              "I hope this appeal stirs immediate community action..."
            ]
          }
        ]
      },
      "signOffGuide": {
        "format": "quadripartite",
        "subscription": "Yours faithfully,",
        "requiresHandwrittenSignature": true,
        "printedNameFormat": "full_name_title_case",
        "designationPlaceholder": "Old Tafo-Kumasi",
        "coOccurrenceConstraint": "Letters to the editor terminate with 'Yours faithfully,', signature, full name, and town/region."
      }
    },
    "rubric": {
      "totalMarks": 30,
      "timeAllowedMinutes": 45,
      "criteria": {
        "content": {
          "name": "content",
          "displayName": "Content & Idea Development",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Editorial space requested and issue announced (2 marks)",
            "Effects on academic attendance analyzed (4 marks)",
            "Two actionable regulatory solutions proposed (4 marks)"
          ],
          "diagnosticChecklist": [
            "Issue introduced clearly",
            "Social consequences analyzed",
            "Realistic solutions suggested"
          ]
        },
        "organization": {
          "name": "organization",
          "displayName": "Organization & Epistolary Layout",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Two addresses correctly positioned (1 mark)",
            "Salutation 'Dear Sir,' (1 mark)",
            "Block capital caption without underline (1 mark)",
            "4-paragraph structure (1 mark)",
            "Sign-off with signature, name, and town (1 mark)"
          ],
          "diagnosticChecklist": [
            "Inside address present",
            "Caption properly formatted",
            "Sign-off includes town"
          ]
        },
        "expression": {
          "name": "expression",
          "displayName": "Expression, Tone & Register",
          "maxMarks": 10,
          "scoringGuidelines": [
            "Engaged civic commentary register (4 marks)",
            "Zero informal contractions (3 marks)",
            "Persuasive public advocacy vocabulary (3 marks)"
          ],
          "diagnosticChecklist": [
            "Thoughtful civic vocabulary",
            "Effective paragraph links",
            "Varied sentence patterns"
          ]
        },
        "mechanicalAccuracy": {
          "name": "mechanical_accuracy",
          "displayName": "Mechanical Accuracy",
          "maxMarks": 5,
          "scoringGuidelines": [
            "Deduct 1/2 mark for each distinct spelling, punctuation, concord, or grammatical error up to 5 marks."
          ],
          "diagnosticChecklist": [
            "Consistent subject-verb agreement",
            "Proper sequence of tenses",
            "Zero contraction slips in formal letters and petitions"
          ]
        }
      }
    },
    "modelAnswer": "Old Tafo Community Youth Desk,\nP.O. Box 88,\nOld Tafo-Kumasi,\nAshanti Region.\n2nd December, 2026.\n\nThe Editor,\nDaily Graphic,\nP.O. Box 742,\nAccra.\n\nDear Sir,\n\nCURBING THE MENACE OF TEENAGE TRUANCY IN GAMING CENTERS\n\nPermit me a space in your widely read national newspaper to express my profound concern over the alarming surge in school absenteeism caused by commercial video-gaming and sports betting centers in our urban communities.\n\nIt is deeply troubling that during official school hours, dozens of junior high school pupils abandon classroom lessons to congregate in dark, unventilated video-game parlors across our suburbs. This disturbing addiction has fueled chronic truancy, sharp drops in terminal examination scores, and petty pilfering among students seeking coins to fund their gaming sessions. The future of many promising youngsters is being compromised while gaming operators profit unhindered.\n\nTo eradicate this growing social menace, I propose two urgent interventions. First, municipal assemblies must rigorously enforce local business bylaws that prohibit commercial gaming operators from admitting school children in uniform between 7:00 a.m. and 3:00 p.m., backed by heavy fines and license revocations for non-compliant proprietors. Second, community parent-teacher associations should collaborate with local unit committees to conduct regular surveillance raids on known gaming hubs during school hours.\n\nOur children are the nation's future human resource. We cannot sit idly by while commercial gaming centers derail their educational aspirations.\n\nYours faithfully,\n[Signature]\nRichmond Asare\nOld Tafo-Kumasi",
    "workedSolution": "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)",
    "hint": "Address to 'The Editor, Daily Graphic,'. Include an un-underlined BLOCK CAPITAL heading. Salute with 'Dear Sir,'. Conclude with 'Yours faithfully,', your signature, full name, and your residential town.",
    "competencyTarget": "Letter to the Press Architecture, Social Commentary Register & Civic Valediction",
    "learningCompetency": "B7.4.2.1.2: Compose formal letters to newspaper editors analyzing contemporary social issues and proposing regulatory interventions."
  }
];

// =========================================================================
// UNIVERSAL FIRESTORE INITIALIZATION (ADC OR FIREBASE CLI CREDENTIALS)
// =========================================================================
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

// Fisher-Yates deterministic shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const unique50EpistolaryDrills = objective50Data;

export async function deployStrand4Clean60() {
  console.log("Building clean 60-item Strand 4 B7 Foundation Practice Lab...");
  console.log("   -> 50 Multiple-Choice Drills (Section A: Objective)");
  console.log("   -> 10 Full Structured Essays (Section B: Theory / Flippable Prompts)");

  const db = await getFirestoreDb();
  const all60Items: (ObjectiveQuestionItem | TheoryEssayItem)[] = [];

  // 1. Build Section A with randomized option distribution (Questions 1 to 50: Objective Multiple-Choice)
  unique50EpistolaryDrills.forEach((item: any, index: number) => {
    const qNum = index + 1;
    const targetAnswer = item.answer;
    const shuffledOptions: string[] = shuffleArray<string>(item.options);

    // Verify targetAnswer is present in shuffledOptions
    if (!shuffledOptions.includes(targetAnswer)) {
      throw new Error(`Integrity check failed: target answer "${targetAnswer}" not found in options for Q${qNum}`);
    }

    all60Items.push({
      id: `B7_S4_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B7",
      difficulty: "foundation",
      category: "Epistolary Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n"${item.passage}"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: shuffledOptions,
      correctAnswer: targetAnswer, // Stored as the exact matching text string
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B7.4.2.1: Demonstrate mastery of epistolary formatting, address architecture, dating laws, salutation/close pairings, and caption rules."
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
    difficulty: "foundation",
    title: "Basic 7 Foundation Writing Lab: 50 Objective Drills + 10 Theory Writing Tasks",
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
    questions: all60Items,
    metadata: {
      curriculum: "NaCCA Common Core Programme (CCP) Standard",
      strand: "Strand 4: Writing",
      subStrand: "Sub-Strand 2: Text Types and Purposes (Letter Writing & Petitions)",
      evaluationEngine: "Gemini 2.5 Flash WAEC 4-Tier Evaluator (30 Marks)",
      canonicalTopicPath: "global_curriculum/jhs/subjects/english/topical/writing_letter_formats",
      updatedAt: new Date()
    }
  };

  for (const docId of docIds) {
    // 3. Write directly to Firestore Practice Lab Document
    const targetDoc = db.doc(
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B7_foundation`
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
              low: all60Items
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

deployStrand4Clean60()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B7 Foundation Clean 60 Lab:", err);
    process.exit(1);
  });

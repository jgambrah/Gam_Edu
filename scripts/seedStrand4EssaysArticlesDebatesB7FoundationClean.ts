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

  level: "B7";

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

  level: "B7";

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

        "Consistent tense maintenance across narrative timeline",

        "Punctuation inside direct speech quotation marks",

        "Rigorous subject-verb concord and zero contraction slips in formal articles/debates"

      ]

    }

  }

});

// =========================================================================

// 50 UNIQUE OBJECTIVE COMPOSITION & RHETORIC DRILLS (QUESTIONS 1 TO 50)

// Basic 7 Foundation Focus:

// Freytag Plot Pyramid, Proverb Integration, Sensory Registers, Spatial Flow,

// Headline-Byline Rules, Inquit Orthography, and Parliamentary Vocatives

// =========================================================================

const rawObjective50Data = [

  {

    passage: "A Basic 7 candidate is writing a story to illustrate the proverb: 'A stitch in time saves nine.'",

    question: "Where in the narrative should the proverb be most effectively integrated?",

    options: [

      "Naturally embedded into the character's climactic realization or resolution",

      "As the very first sentence before introducing the characters",

      "Repeated at the beginning of every single paragraph",

      "Tacked on as an isolated definition after the final paragraph"

    ],

    answer: "Naturally embedded into the character's climactic realization or resolution",

    hint: "The moral truth of a proverb must emerge organically from character actions and consequences.",

    solution: "Under NaCCA and WAEC guidelines, an illustrative proverb must be woven seamlessly into the story's climax, falling action, or denouement where the character faces the moral reality of their choices.",

    target: "Narrative Architecture: Proverbial Organic Integration"

  },

  {

    passage: "In Freytag's dramatic plot pyramid, what is the specific function of the 'inciting incident'?",

    question: "Identify the role of the inciting incident in narrative storytelling:",

    options: [

      "To shatter the initial baseline status quo and trigger the central dramatic conflict",

      "To introduce the names and family backgrounds of all characters",

      "To resolve all character misunderstandings peacefully",

      "To provide a detailed physical description of the landscape"

    ],

    answer: "To shatter the initial baseline status quo and trigger the central dramatic conflict",

    hint: "It is the initial event that sets the story's main action into motion.",

    solution: "The inciting incident disrupts the opening equilibrium (exposition) and introduces the problem, challenge, or choice that drives the rising action.",

    target: "Freytag's Pyramid: Inciting Incident Function"

  },

  {

    passage: "A student writing an article for the *Junior Graphic* adds a sender's postal address and 'Yours faithfully,' at the end.",

    question: "How is this evaluated under the WAEC marking scheme?",

    options: [

      "Penalized under Organization for format contamination (articles do not use postal addresses or subscriptions)",

      "Awarded bonus marks for providing complete contact information",

      "Penalized under Content for exceeding the word limit",

      "Classified as acceptable modern journalistic format"

    ],

    answer: "Penalized under Organization for format contamination (articles do not use postal addresses or subscriptions)",

    hint: "Articles are public press documents, not personal letters.",

    solution: "Articles are designed for publication. Adding postal addresses, salutations ('Dear Sir,'), or letter subscriptions ('Yours faithfully,') constitutes layout contamination, penalizable under Organization.",

    target: "Articles for Publication: Format Purity"

  },

  {

    passage: "A speaker opens a competitive school debate with: 'Hello everybody, I am here to tell you why day schools are bad.'",

    question: "What major rhetorical defect does this opening exhibit?",

    options: [

      "Violation of the Parliamentary Vocative Protocol and failure to declare an articulate formal stance",

      "Use of English instead of the local language",

      "Speaking without microphone amplification",

      "Failing to tell a personal childhood story"

    ],

    answer: "Violation of the Parliamentary Vocative Protocol and failure to declare an articulate formal stance",

    hint: "Formal debates require addressing officials in descending order before stating the motion.",

    solution: "Competitive debates require a structured descending vocative hierarchy (Chairman, Adjudicators, Timekeeper, Opponents, Audience) followed by an explicit stance proclamation.",

    target: "Debate Speech: Parliamentary Vocative Protocol"

  },

  {

    passage: "Examine this dialogue snippet: '\"Stop thief!\" shouted the patrolman.'",

    question: "What punctuation rule governs the dialogue tag and the direct speech quotation marks?",

    options: [

      "The punctuation mark must sit INSIDE the closing quotation mark, and the inquit verb remains lowercase",

      "The punctuation mark must sit outside the quotation marks",

      "The word 'shouted' must always begin with a capital letter",

      "No comma or exclamation mark is permitted in direct speech"

    ],

    answer: "The punctuation mark must sit INSIDE the closing quotation mark, and the inquit verb remains lowercase",

    hint: "Speech punctuation sits within the quotation marks.",

    solution: "In standard dialogue orthography, commas, exclamation marks, or question marks separating spoken words from reporting tags sit inside the quotation marks, followed by a lowercase reporting verb.",

    target: "Dialogue Mechanics: Inquit Orthography"

  },

  {

    passage: "A candidate begins a descriptive essay on a bustling market: 'The pungent aroma of smoked herrings mingled with the sharp sting of fresh crushed ginger.'",

    question: "Which two human sensory registers are engaged in this sentence?",

    options: [

      "Olfactory (smell) and gustatory (taste)",

      "Visual (sight) and auditory (sound)",

      "Tactile (touch) and auditory (sound)",

      "Visual (sight) and thermal (heat)"

    ],

    answer: "Olfactory (smell) and gustatory (taste)",

    hint: "'Aroma' engages the nose, while 'sharp sting of ginger' evokes taste and scent.",

    solution: "'Pungent aroma' appeals to the olfactory sense (smell), while 'sharp sting of fresh crushed ginger' appeals to both the olfactory and gustatory (taste) faculties.",

    target: "Descriptive Writing: Sensory Registers"

  },

  {

    passage: "A student writes a headline for a school magazine article: <u>THE DANGERS OF GOSSIP IN SCHOOL</u>.",

    question: "What typographical layout flaw is present in this headline?",

    options: [

      "Underlining a headline written in ALL BLOCK CAPITALS",

      "Writing the headline in capital letters",

      "Failing to write the author's age in the title",

      "Placing the headline in quotation marks"

    ],

    answer: "Underlining a headline written in ALL BLOCK CAPITALS",

    hint: "Headings in all-caps must never be underlined.",

    solution: "Under WAEC marking rubrics, full block capital titles must never be underlined. Underlining is reserved exclusively for Title Case headings.",

    target: "Headline Typography: Block Capital Rules"

  },

  {

    passage: "In narrative storytelling, what does 'temporal shift' or 'tense instability' refer to?",

    question: "Identify the grammatical error defined as tense instability:",

    options: [

      "Illogically jumping between past and present tense within the same narrative scene",

      "Using adverbs of time at the beginning of sentences",

      "Using the past perfect tense after simple past verbs",

      "Changing the physical location of the characters"

    ],

    answer: "Illogically jumping between past and present tense within the same narrative scene",

    hint: "It happens when a writer slips from past to present without reason.",

    solution: "Tense instability occurs when a writer ungrammatically mixes the simple past and simple present within historical narrative accounts, incurring severe Mechanical Accuracy penalties.",

    target: "Narrative Aspect: Tense Stability"

  },

  {

    passage: "Where should the byline of an article intended for publication be positioned?",

    question: "Select the standard location for an article's byline:",

    options: [

      "Directly below the headline or at the conclusion of the article",

      "Inside the margin beside each paragraph",

      "At the top right-hand corner with a full postal address",

      "Within the concluding moral sentence only"

    ],

    answer: "Directly below the headline or at the conclusion of the article",

    hint: "A byline indicates the author's identity and sits near the title or at the end.",

    solution: "The byline (e.g., 'By Kwame Mensah, Basic 7A') is placed directly beneath the headline or appended at the very end of the article.",

    target: "Articles for Publication: Byline Positioning"

  },

  {

    passage: "A speaker in a debate says: 'Can any reasonable person in this hall claim that a country can prosper without educated teachers?'",

    question: "What rhetorical figure of speech is utilized here to persuade the audience?",

    options: [

      "Rhetorical question",

      "Hyperbole",

      "Simile",

      "Euphemism"

    ],

    answer: "Rhetorical question",

    hint: "It is a question posed for persuasive effect without expecting a spoken answer.",

    solution: "A rhetorical question is asked to make a point or provoke thought rather than elicit a direct reply, compelling the audience to agree with the speaker.",

    target: "Rhetorical Devices: Persuasive Questioning"

  },

  {

    passage: "In a descriptive composition of a physical journey, what is 'spatial dominance sequencing'?",

    question: "Define spatial dominance sequencing in descriptive writing:",

    options: [

      "Organizing descriptions in a logical directional order (e.g., top-to-bottom, near-to-far, panoramic-to-particular)",

      "Listing objects alphabetically according to their names",

      "Describing only the most expensive items in the room",

      "Writing all sentences with the same number of words"

    ],

    answer: "Organizing descriptions in a logical directional order (e.g., top-to-bottom, near-to-far, panoramic-to-particular)",

    hint: "It arranges descriptions according to physical position and sightlines.",

    solution: "Spatial dominance organizes sensory descriptions logically through physical space (such as foreground to background or skyline to ground level), preventing chaotic jumping.",

    target: "Descriptive Writing: Spatial Sequencing"

  },

  {

    passage: "A student writes: '\"We must hurry,\" whispered Kofi, \"or the gates will close.\"'",

    question: "Why is the punctuation of this interrupted direct speech sentence correct?",

    options: [

      "The speech tag is enclosed by commas inside the quotes, and the second spoken clause continues in lowercase",

      "Because the word 'whispered' is capitalized",

      "Because both sentences end with exclamation marks",

      "Because quotation marks are omitted around the second half"

    ],

    answer: "The speech tag is enclosed by commas inside the quotes, and the second spoken clause continues in lowercase",

    hint: "The sentence continues across the dialogue tag, so the second part remains lowercase.",

    solution: "When an inquit tag interrupts a single grammatical sentence, the first spoken part ends with a comma inside the quotes, and the second part continues in lowercase.",

    target: "Dialogue Mechanics: Interrupted Speech Punctuation"

  },

  {

    passage: "What is the climax in a narrative story?",

    question: "Select the definition of the narrative climax:",

    options: [

      "The moment of highest dramatic tension where the central conflict reaches its peak and demands a decisive choice",

      "The opening scene where characters wake up in the morning",

      "The moral lesson summarized at the bottom of the page",

      "The list of characters provided before the story begins"

    ],

    answer: "The moment of highest dramatic tension where the central conflict reaches its peak and demands a decisive choice",

    hint: "It is the turning point of the plot.",

    solution: "The climax represents the emotional peak and turning point of Freytag's pyramid, where character actions force the unraveling of the conflict.",

    target: "Freytag's Pyramid: Climax Definition"

  },

  {

    passage: "In an argumentative essay, what is the role of a 'concession'?",

    question: "Identify the function of an argumentative concession:",

    options: [

      "To acknowledge the valid point of an opposing argument before logically refuting it",

      "To surrender and agree completely with the opponent",

      "To apologize for having a controversial opinion",

      "To change the topic to avoid difficult questions"

    ],

    answer: "To acknowledge the valid point of an opposing argument before logically refuting it",

    hint: "Conceding means recognizing the other side's view to dismantle it.",

    solution: "A concession acknowledges the opponent's strongest point fairly, demonstrating intellectual maturity before the writer refutes it with superior evidence.",

    target: "Argumentative Discourse: Dialectical Concession"

  },

  {

    passage: "A student writes an article headline: '<u>How to Improve Academic Performance in Basic Schools</u>'.",

    question: "Why is this headline formatted correctly?",

    options: [

      "It is written in Title Case, major words are capitalized, minor words are lowercase, and it is neatly underlined without a trailing period",

      "Because all words begin with lowercase letters",

      "Because it ends with an exclamation mark",

      "Because it is centered and written in red ink"

    ],

    answer: "It is written in Title Case, major words are capitalized, minor words are lowercase, and it is neatly underlined without a trailing period",

    hint: "Title Case headings require an underline and no terminal punctuation.",

    solution: "Title Case headlines must capitalize lexical words (nouns, verbs, adjectives), keep grammatical particles lowercase, bear an underline, and omit terminal full stops.",

    target: "Headline Typography: Title Case Rules"

  },

  {

    passage: "Which of the following sensory phrases appeals directly to the tactile register?",

    question: "Select the tactile descriptive phrase:",

    options: [

      "The coarse, gritty sand scraped painfully against his sunburned shoulders.",

      "The deafening rumble of thunder shook the zinc roof.",

      "The blinding crimson flash of lightning illuminated the valley.",

      "The rich, savory aroma of palm nut soup filled the courtyard."

    ],

    answer: "The coarse, gritty sand scraped painfully against his sunburned shoulders.",

    hint: "Tactile relates to touch, texture, and physical sensation on the skin.",

    solution: "'Coarse, gritty sand scraped painfully' describes physical touch, surface texture, and bodily sensation, appealing directly to the tactile sense.",

    target: "Descriptive Writing: Tactile Imagery"

  },

  {

    passage: "In a formal debate speech, which dignitary must be addressed first in the vocative hierarchy?",

    question: "Identify the opening vocative of highest priority:",

    options: [

      "Mr. Chairman (or Madam Chairperson)",

      "Distinguished Panel of Adjudicators",

      "Accurate Timekeeper",

      "Worthy Opponents"

    ],

    answer: "Mr. Chairman (or Madam Chairperson)",

    hint: "The chairperson presides over the entire assembly and takes first position.",

    solution: "Under standard parliamentary and debate protocol, the Chairperson presides over the session and must always be addressed first.",

    target: "Debate Speech: Hierarchical Vocative Protocol"

  },

  {

    passage: "A pupil writes in a narrative: 'Every morning, the birds sang, the sun shone, and the flowers bloomed.'",

    question: "What syntactic rhetorical device is demonstrated by this clause structure?",

    options: [

      "Tricolon with grammatical parallelism",

      "Chiasmus",

      "Antithesis",

      "Oxymoron"

    ],

    answer: "Tricolon with grammatical parallelism",

    hint: "Three parallel clauses joined for rhythmic balance.",

    solution: "A tricolon presents three parallel syntactic structures in rhythmic succession, reinforcing imagery and narrative flow.",

    target: "Rhetorical Devices: Tricolon and Parallelism"

  },

  {

    passage: "Why are personal epistolary greetings (e.g., 'Dear Editor, I hope you are fine') forbidden in an article for publication?",

    question: "State the rule regarding articles for publication:",

    options: [

      "Articles are public expository essays written for a general readership, not private letters to an individual editor",

      "The editor does not like being greeted",

      "Greetings increase the word count too rapidly",

      "WAEC examiners prefer letters to articles"

    ],

    answer: "Articles are public expository essays written for a general readership, not private letters to an individual editor",

    hint: "An article addresses the public reading audience, not the editor personally.",

    solution: "Articles address the general reading public through print media. Direct epistolary greetings to the editor represent format contamination.",

    target: "Articles for Publication: Audience Conception"

  },

  {

    passage: "In a narrative composition, what occurs during the 'falling action'?",

    question: "Identify the function of falling action in Freytag's pyramid:",

    options: [

      "The immediate consequences of the climax unfold, leading toward the final resolution",

      "The protagonist meets the antagonist for the first time",

      "The author describes the weather in great detail",

      "The story stops without explaining the ending"

    ],

    answer: "The immediate consequences of the climax unfold, leading toward the final resolution",

    hint: "It bridges the gap between the turning point and the final denouement.",

    solution: "Falling action traces the aftermath of the climax, de-escalating tension and resolving secondary conflicts as the story moves toward its denouement.",

    target: "Freytag's Pyramid: Falling Action"

  },

  {

    passage: "A student writes: 'The food was delicious, sweet, and sugary.'",

    question: "What expressive defect does this sentence demonstrate?",

    options: [

      "Tautology and sensory redundancy",

      "Grammatical disagreement",

      "Metaphorical contradiction",

      "Passive voice error"

    ],

    answer: "Tautology and sensory redundancy",

    hint: "Using multiple words that mean the same thing wastes expressive space.",

    solution: "'Delicious, sweet, and sugary' repeats the same gustatory quality without providing sensory contrast or specific imagery, resulting in tautological redundancy.",

    target: "Expression: Tautology and Lexical Redundancy"

  },

  {

    passage: "In a debate speech, how should a speaker refer to contestants on the opposing side?",

    question: "Select the appropriate formal debate term:",

    options: [

      "My worthy opponents / My esteemed co-debaters",

      "My enemies on the left",

      "The foolish speakers over there",

      "Those confused pupils"

    ],

    answer: "My worthy opponents / My esteemed co-debaters",

    hint: "Parliamentary debate demands courteous, respectful references to opponents.",

    solution: "Formal debate demands collegial decorum. Opponents must be referred to as 'worthy opponents' or 'esteemed co-debaters', avoiding ad hominem insults.",

    target: "Debate Speech: Parliamentary Etiquette"

  },

  {

    passage: "Which of the following titles violates headline mechanics by including illegal terminal punctuation?",

    question: "Identify the incorrectly punctuated headline:",

    options: [

      "THE IMPORTANCE OF VOCATIONAL TRAINING IN GHANA.",

      "THE IMPORTANCE OF VOCATIONAL TRAINING IN GHANA",

      "<u>The Importance of Vocational Training in Ghana</u>",

      "The Importance of Vocational Training in Ghana (underlined)"

    ],

    answer: "THE IMPORTANCE OF VOCATIONAL TRAINING IN GHANA.",

    hint: "Headlines and captions are titles, not sentences, and must never end with a period.",

    solution: "Headlines must never end with a full stop. Placing a terminal period after a title is a mechanical punctuation error under WAEC marking rubrics.",

    target: "Headline Typography: Terminal Period Prohibition"

  },

  {

    passage: "A narrative ends with: 'As he looked at his empty hands, he remembered his grandmother's words: a bird in hand is worth two in the bush.'",

    question: "Why is this integration of the proverb effective?",

    options: [

      "It connects the moral aphorism directly to the protagonist's lived consequence and emotional realization",

      "Because it is written in capital letters",

      "Because the proverb is placed inside parenthesis",

      "Because it repeats the proverb five times"

    ],

    answer: "It connects the moral aphorism directly to the protagonist's lived consequence and emotional realization",

    hint: "The proverb fits naturally into the character's thoughts.",

    solution: "Organic proverb integration anchors the aphorism to character realization, demonstrating its universal truth through the protagonist's direct loss.",

    target: "Narrative Architecture: Organic Proverbial Synthesis"

  },

  {

    passage: "What is an 'inquit tag' in narrative writing?",

    question: "Define the term inquit tag:",

    options: [

      "The reporting clause that identifies who is speaking (e.g., 'said Kofi', 'shouted the teacher')",

      "The quotation marks surrounding speech",

      "The moral lesson at the end of a story",

      "The title of a poem"

    ],

    answer: "The reporting clause that identifies who is speaking (e.g., 'said Kofi', 'shouted the teacher')",

    hint: "It is the reporting verb and subject that attribute speech to a speaker.",

    solution: "An inquit tag (or dialogue tag) is the reporting clause indicating the speaker and vocal tone, such as 'whispered Ama' or 'replied the doctor'.",

    target: "Dialogue Mechanics: Inquit Tag Definition"

  },

  {

    passage: "In a debate opposing the motion 'Social Media Has Done More Harm Than Good,' what should the lead speaker state in paragraph 1?",

    question: "Identify the mandatory opening requirement:",

    options: [

      "An explicit proclamation opposing the motion and a clear definition of key terms",

      "A long humorous story about personal phone usage",

      "An apology for not having scientific statistics",

      "A personal insult directed at the first proposition speaker"

    ],

    answer: "An explicit proclamation opposing the motion and a clear definition of key terms",

    hint: "The first paragraph must anchor the speaker's stance and define terms.",

    solution: "The opening paragraph of a debate speech must formally state the speaker's stance (proposing or opposing) and establish concise operational definitions for the motion.",

    target: "Debate Speech: Stance and Definitions"

  },

  {

    passage: "Which of the following describes an auditory sensory image?",

    question: "Select the auditory descriptive detail:",

    options: [

      "The shrill, piercing screech of rusty brakes pierced the silence of the night.",

      "The sky was painted in shades of bruised purple and amber.",

      "The smooth river pebbles felt cool and slick underfoot.",

      "The pungent odor of rotting compost hung heavily in the humid air."

    ],

    answer: "The shrill, piercing screech of rusty brakes pierced the silence of the night.",

    hint: "Auditory imagery appeals to the ear and sound perception.",

    solution: "'Shrill, piercing screech' uses sound imagery (pitch, acoustic texture) to engage the reader's auditory sense.",

    target: "Descriptive Writing: Auditory Imagery"

  },

  {

    passage: "A student writing an argumentative essay writes: 'Everyone knows that day schools are the worst.'",

    question: "What logical flaw is present in this argumentative claim?",

    options: [

      "Hasty generalization and unsupported sweeping assertion",

      "Proper use of empirical statistical evidence",

      "Effective rhetorical understatement",

      "Accurate dialectical refutation"

    ],

    answer: "Hasty generalization and unsupported sweeping assertion",

    hint: "Sweeping claims like 'everyone knows' lack factual evidence.",

    solution: "Sweeping assertions like 'everyone knows' commit the fallacy of hasty generalization. Argumentative discourse requires objective, evidence-based reasoning.",

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

  }

];

// =========================================================================

// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)

// Basic 7 Foundation Scaffolds & Model Compositions (~250 words each)

// Covering: Narrative Moral Stories, Sensory Travelogues, Articles & Debates

// =========================================================================

const theory10Prompts: TheoryEssayItem[] = [

  // 51. Narrative: Illustrating 'A Stitch in Time Saves Nine'

  {

    id: "B7_S4_E_T_01",

    section: "theory",

    questionNumber: 51,

    theoryIndex: 1,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Narrative Essay",

    title: "The Torn Bicycle Chain",

    shortSummary: "Write a narrative story illustrating the proverb: 'A stitch in time saves nine.'",

    prompt: "Write a story that illustrates the truth of the proverb: 'A stitch in time saves nine.' Describe how a small neglected problem or ignored warning escalated into a major crisis for the protagonist on an important day.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Freytag Narrative Arc, Conflict Escalation & Organic Proverb Integration",

    learningCompetency: "B7.4.2.1.1: Compose coherent narrative stories illustrating indigenous or universal proverbs with structured plot progression.",

    hint: "Follow Freytag's plot pyramid: introduce the character, present the neglected warning, build up to the crisis, and weave the proverb into the resolution naturally.",

    guidanceScaffold: {

      genreType: "narrative_proverbial",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "The Cost of Neglect",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Freytag's dramatic plot pyramid (Exposition -> Inciting Incident -> Rising Action/Climax -> Denouement).",

        stagePrompts: [

          { stageIndex: 1, role: "Exposition & Baseline", guidingQuestion: "Introduce Kwame and the morning of his end-of-term mathematics examination.", transitionHints: ["On a bright Tuesday morning in Tanoso...", "Fourteen-year-old Kwame was preparing for his final mathematics paper..."] },

          { stageIndex: 2, role: "Inciting Incident & Ignored Warning", guidingQuestion: "Describe Kwame noticing a loose link in his bicycle chain and dismissing his father's warning.", transitionHints: ["As he wheeled his bicycle out, his father pointed to the rattling chain...", "\"Fix it now,\" his father warned, but Kwame brushed the advice aside..."] },

          { stageIndex: 3, role: "Rising Action & Dramatic Climax", guidingQuestion: "Narrate the chain snapping halfway along the lonely bush path and his frantic struggle to reach school.", transitionHints: ["Pedaling furiously up the steep rocky hill, a sharp metallic snap echoed...", "The chain snapped, jammed the rear wheel, and threw him into the gravel..."] },

          { stageIndex: 4, role: "Denouement & Moral Synthesis", guidingQuestion: "Describe arriving at the locked examination hall and reflecting on the proverb.", transitionHints: ["By the time he limped into the school compound, the bell had rung and the hall doors were bolted...", "Staring at his grease-stained hands, he learned the bitter truth: a stitch in time saves nine..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Resolution & Moral Aphorism",

        proverbOrClosingPhrase: "A stitch in time saves nine.",

        integrationRule: "Embed the proverb organically into Kwame's final realization rather than writing it as a standalone label."

      }

    },

    rubric: createWAECRubric(

      ["Protagonist, setting, and critical examination day established (2 marks)", "Ignored chain warning and dramatic snapping incident described vividly (4 marks)", "Consequences of arriving late and organic proverb integration (4 marks)"],

      ["Character context clear", "Neglected problem detailed", "Proverb integrated organically"],

      ["Appropriate title (1 mark)", "Clear 4-paragraph plot structure (1 mark)", "Logical chronological transitions (1 mark)", "Natural pacing from crisis to resolution (1 mark)", "Consistent narrative voice (1 mark)"],

      ["Headline properly formatted", "Paragraph transitions smooth", "Plot progression clear"],

      ["Vivid narrative action verbs (4 marks)", "Consistent past tense aspect (3 marks)", "Rich descriptive vocabulary (3 marks)"],

      ["Action verbs used effectively", "Consistent tense", "Good sentence variety"]

    ),

    modelAnswer: `The Cost of Neglect\n___________________\n\nOn a breezy Tuesday morning in the farming town of Tanoso, fourteen-year-old Kwame woke up with confident determination. It was the day of the District Mathematics Championship, an examination for which he had prepared diligently for months. Winning the contest meant a scholarship to a prestigious secondary school, and Kwame was determined to make his parents proud.\n\nAs he wheeled his bicycle from the shed, his father noticed that the drive chain was severely slack, rattling loudly against the metal frame. \"Kwame,\" his father cautioned sternly, \"tighten that loose link before you leave. If it snaps on the highway, you will be stranded.\" Eager to get to school early, Kwame shrugged off the advice. \"I will tighten it after the examination, Father; it will easily take me to school,\" he boasted dismissively.\n\nDisaster struck halfway through his journey. While pedaling furiously up a steep, rocky ridge three kilometers from the school, a violent metallic snap broke the morning quiet. The slack chain had slipped off the sprocket, coiled around the wheel hub, and jammed the rear tire. Kwame was thrown off the saddle onto the gravel, scraping his palms and knees. Frantically, he wrestled with the twisted metal, his fingers black with grease, but the chain was mangled beyond repair.\n\nAbandoning the bicycle in the bush, Kwame sprinted along the dusty road, tears of panic blurring his vision. When he finally stumbled into the examination center, sweat-soaked and panting, the invigilator pointed coldly to the wall clock. The examination had commenced thirty minutes earlier, and the hall doors were locked. Leaning against the corridor wall in bitter regret, his father's warning echoed in his mind. Indeed, a stitch in time saves nine.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 52. Descriptive: A Memorable Visit to a Waterfalls (Sensory Travelogue)

  {

    id: "B7_S4_E_T_02",

    section: "theory",

    questionNumber: 52,

    theoryIndex: 2,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Descriptive Essay",

    title: "The Splendor of Wli Waterfalls",

    shortSummary: "Write a descriptive travelogue capturing the sensory sights, sounds, and textures of a visit to Wli Waterfalls.",

    prompt: "Your school recently organized an excursion to a famous natural attraction in Ghana. Write a descriptive essay about your visit to a waterfall, vividly recreating the sights, sounds, smells, and physical sensations of the natural environment for your reader.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Sensory Imagery Deployment, Spatial Sequencing & Descriptive Elevation",

    learningCompetency: "B7.4.2.2.1: Write vivid descriptive compositions utilizing multiple sensory registers, spatial organization, and figurative devices.",

    hint: "Use spatial progression: establish the scenic hike through the forest, build up to the thunderous sight of the cascade, and capture the tactile sensation of icy spray on your skin.",

    guidanceScaffold: {

      genreType: "descriptive_travelogue",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "A Day of Wonder at Wli Waterfalls",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Spatial and sensory progression from forest trail to the base of the waterfall pool.",

        stagePrompts: [

          { stageIndex: 1, role: "Establishing the Setting", guidingQuestion: "Set the physical and geographical scene as your bus arrives at the forested sanctuary.", transitionHints: ["Nestled within the Agumatsa Wildlife Sanctuary in the Volta Region...", "As our school excursion bus approached the base of the mountain trail..."] },

          { stageIndex: 2, role: "The Forest Hike (Sensory Markers)", guidingQuestion: "Describe trekking along the forest path, crossing wooden footbridges, and hearing the distant roar.", transitionHints: ["Trekking along the narrow footpath under towering mahogany trees...", "The humid air carried the sweet scent of wild lilies, while in the distance, a low rumble..."] },

          { stageIndex: 3, role: "The Cascade Revelation (Sight & Sound)", guidingQuestion: "Vividly depict emerging into the rocky clearing and seeing the roaring cascade plummet from the cliff.", transitionHints: ["Rounding the final bend, the breathtaking spectacle burst into view...", "A sheer wall of white foaming water plunged eighty meters down the craggy precipice..."] },

          { stageIndex: 4, role: "Tactile Sensation & Reflection", guidingQuestion: "Describe wading into the icy mountain pool, feeling the mist, and reflecting on the beauty of nature.", transitionHints: ["Stepping into the crystal-clear pool, an icy shock surged through my veins...", "As the fine mist coated our faces, I stood in awe of Ghana's natural heritage..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Aesthetic Reflection",

        proverbOrClosingPhrase: "Nature is the living canvas of the Creator.",

        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating environmental preservation."

      }

    },

    rubric: createWAECRubric(

      ["Forest setting and excursion context established (2 marks)", "Multi-sensory hike described with rich adjectives (4 marks)", "Vivid description of the waterfall, pool immersion, and reflection (4 marks)"],

      ["Location clear", "Sight, sound, smell, and touch evoked", "Spatial progression smooth"],

      ["Underlined Title Case title (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],

      ["Headline formatted correctly", "Directional transitions clear", "No narrative wandering"],

      ["Rich sensory and figurative vocabulary (4 marks)", "Apt similes and metaphors (3 marks)", "Varied sentence architecture (3 marks)"],

      ["Sensory words used effectively", "Good figurative devices", "Varied sentence patterns"]

    ),

    modelAnswer: `A Day of Wonder at Wli Waterfalls\n___________________________________\n\nNestled deep within the lush embrace of the Agumatsa Wildlife Sanctuary in the Volta Region lies Wli Waterfalls, a natural wonder that captivated my senses when our school excursion visited last month. Leaving behind the dusty, noisy streets of the town, our bus delivered us into a tranquil world where emerald peaks met the blue sky.\n\nOur trek along the shaded footpath was a symphony of forest sights and sounds. Towering mahogany trees stretched upward like cathedral columns, their dense leaves filtering the golden morning sunlight into cool green patterns on the mossy ground. The damp earth gave off a rich, musky fragrance mingled with the sweet scent of wild forest orchids. Above our heads, chattering fruit bats hung from rocky cliff ledges like dark chandeliers, while a gentle stream gurgled beside the trail, crossed by eleven quaint wooden footbridges.\n\nAs we advanced, the distant rumble grew into a deafening roar that vibrated through the ground. Rounding the final craggy bend, the grand cascade burst into view. A colossal curtain of foaming white water plummeted eighty meters straight down a sheer rock face, crashing into a dark turquoise pool below. The sheer power of the falls created an immense wind that whipped the surrounding ferns into a wild dance, filling the gorge with a swirling cloud of iridescent mist that refracted sunlight into miniature rainbows.\n\nWading into the shallow edges of the pool, an icy shock washed away all the exhaustion of our journey. The fine, cold spray coated our skin, while the thunder of the falling water drowned out all human voices. Standing before that majestic torrent, I felt tiny yet deeply connected to the breathtaking beauty of our homeland.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 53. Article for Publication: Curbing Examination Malpractice in Basic Schools

  {

    id: "B7_S4_E_T_03",

    section: "theory",

    questionNumber: 53,

    theoryIndex: 3,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Article for Publication",

    title: "Curbing Examination Malpractice",

    shortSummary: "Write an article for publication in your school magazine analyzing the causes and remedies of exam cheating.",

    prompt: "Write an article for publication in your school magazine titled: 'Curbing Examination Malpractice Among Junior High School Students.' Identify two major causes of cheating during examinations, analyze its negative consequences on pupils' futures, and propose two practical solutions.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Journalistic Article Architecture, Expository Problem-Solution Flow & Headline/Byline Syntax",

    learningCompetency: "B7.4.2.1.2: Compose structured articles for publication featuring appropriate headlines, bylines, objective problem analysis, and actionable societal solutions.",

    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into causes, effects, and remedies.",

    guidanceScaffold: {

      genreType: "article_publication",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "full_caps_no_underline",

        modelHeadline: "CURBING EXAMINATION MALPRACTICE AMONG JUNIOR HIGH SCHOOL STUDENTS",

        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]

      },

      bylineGuide: {

        isRequired: true,

        modelByline: "By Kwame Mensah, Basic 7A",

        rules: ["Position directly beneath the headline.", "State author name and class stream."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Expository article framework (Lead Hook -> Root Causes -> Academic Fallout -> Remedial Interventions).",

        stagePrompts: [

          { stageIndex: 1, role: "The Lead Paragraph", guidingQuestion: "Hook the reader and define the social cancer of examination malpractice.", transitionHints: ["Examinations are designed as honest yardsticks to measure student learning...", "Regrettably, the destructive scourge of examination malpractice has infiltrated..."] },

          { stageIndex: 2, role: "Root Causes Analysis", guidingQuestion: "Explain two primary causes: inadequate study preparation and parental/social pressure for high grades.", transitionHints: ["The root causes of this vice are not far-fetched...", "First, poor study habits and chronic procrastination drive unprepared pupils to panic..."] },

          { stageIndex: 3, role: "Societal & Academic Fallout", guidingQuestion: "Analyze how cheating damages student self-confidence and ruins reputations when results are cancelled.", transitionHints: ["The repercussions of examination fraud are catastrophic...", "When examination bodies cancel compromised results, years of hard work are wiped out..."] },

          { stageIndex: 4, role: "Actionable Remedies & Call to Action", guidingQuestion: "Propose two practical solutions (strict invigilation and effective study habits) and conclude with a call to action.", transitionHints: ["To eradicate this social menace, concerted action is essential...", "Schools must implement early syllabus completion, while invigilators maintain..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Peroration & Call to Integrity",

        proverbOrClosingPhrase: "Integrity is the true measure of an educated mind.",

        integrationRule: "End with an inspiring appeal urging students to value honest diligence over fraudulent shortcuts."

      }

    },

    rubric: createWAECRubric(

      ["Lead hook and examination malpractice definition clear (2 marks)", "Two root causes analyzed with insight (4 marks)", "Two actionable solutions and peroration presented (4 marks)"],

      ["Lead paragraph hooks reader", "Causes and consequences clear", "Actionable solutions proposed"],

      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],

      ["Headline correct", "Byline present", "Zero letter format contamination"],

      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive analytical vocabulary (3 marks)"],

      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]

    ),

    modelAnswer: `CURBING EXAMINATION MALPRACTICE AMONG JUNIOR HIGH SCHOOL STUDENTS\nBy Kwame Mensah, Basic 7A\n\nExaminations serve as universal academic instruments designed to assess a learner's true intellectual grasp, critical thinking abilities, and personal diligence. Regrettably, the disturbing scourge of examination malpractice has cast a dark shadow over our educational landscape, tempting many junior high school learners to trade their moral integrity for fraudulent grades.\n\nThe root causes of this social cancer are evident in our classrooms. First, poor time management and chronic procrastination leave many pupils ill-prepared when examination dates arrive. Having squandered study hours on television and social media, panic compels them to smuggle unauthorized notes into examination halls or copy from peers. Second, immense pressure from overbearing parents and competitive school rankings creates an unhealthy fear of failure, leading children to believe that good grades must be obtained by any means necessary, fair or foul.\n\nThe consequences of this deceit are devastating. Examination malpractice breeds intellectual laziness, destroying a pupil's genuine ability to solve problems. When examination syndicates are uncovered by the West African Examinations Council (WAEC), entire school results are cancelled, plunging innocent families into shame and financial ruin. More critically, cheaters who manage to slip through school grow into incompetent professionals who pose grave risks to society.\n\nTo stamp out this menace, schools must cultivate early syllabus completion and provide regular mock practice to build candidate confidence. Furthermore, teachers and parents must teach children that honest failure is nobler than fraudulent success. Let us choose discipline, for integrity is the true measure of an educated mind.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 54. Debate: Day Schools vs. Boarding Schools (Supporting Day Schools)

  {

    id: "B7_S4_E_T_04",

    section: "theory",

    questionNumber: 54,

    theoryIndex: 4,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Debate Speech",

    title: "Day Schools Are Superior to Boarding Schools",

    shortSummary: "Speak in support of the motion that day junior high schools are better than boarding schools.",

    prompt: "You are the lead speaker in an inter-schools debate competition on the motion: 'Day Junior High Schools Are Superior to Boarding Schools for Basic Education.' Write your speech in support of the motion, presenting at least two strong arguments regarding family bonding and financial affordability, while refuting opposing views.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",

    learningCompetency: "B7.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",

    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on family moral guidance and lower cost. Conclude with 'Thank you.'",

    guidanceScaffold: {

      genreType: "debate_speech",

      vocativeProtocol: {

        isRequired: true,

        hierarchyOrder: [

          "1. Mr. Chairman (or Madam Chairperson)",

          "2. Esteemed Panel of Adjudicators",

          "3. Accurate Timekeeper",

          "4. Worthy Opponents",

          "5. Ladies and Gentlemen"

        ],

        stanceProclamationModel: "I rise firmly on this podium to stoutly support the motion which states that Day Junior High Schools are superior to Boarding Schools for basic education.",

        prohibitedOpenings: ["Good morning to you all", "I am here to tell you"]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Parliamentary debate framework (Vocative & Stance -> Parental Moral Shield -> Economic Affordability -> Rebuttal & Peroration).",

        stagePrompts: [

          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Esteemed Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I stand before this august gathering today to stoutly defend the motion that..."] },

          { stageIndex: 2, role: "First Argument: Parental Nurture & Moral Supervision", guidingQuestion: "Explain how day schools keep adolescent children under direct parental moral guidance every evening.", transitionHints: ["First and foremost, basic education coincides with critical formative adolescent years...", "Day schooling ensures that children return home daily to the loving supervision and moral guidance of parents..."] },

          { stageIndex: 3, role: "Second Argument: Economic Affordability", guidingQuestion: "Contrast the low fees of day schools with the exorbitant boarding house levies that strain poor families.", transitionHints: ["Secondly, we cannot discuss education while ignoring economic realities...", "Boarding fees place an unbearable financial strain on poor parents, whereas day schools make quality education accessible..."] },

          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on prep time, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will argue that boarding schools teach independence; however, this claim collapses because...", "With these unassailable points, I urge you all to vote for the motion. Thank you."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Peroration & Final Sign-Off",

        proverbOrClosingPhrase: "Education without home love is like a tree without roots.",

        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"

      }

    },

    rubric: createWAECRubric(

      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Parental moral supervision argument developed cogently (4 marks)", "Economic affordability and opponent refutation delivered with oratorical vigor (4 marks)"],

      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],

      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],

      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],

      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],

      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]

    ),

    modelAnswer: `Mr. Chairman, Esteemed Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI rise firmly on this podium today to stoutly defend the motion which states that: \"Day Junior High Schools Are Superior to Boarding Schools for Basic Education.\"\n\nFirst and foremost, early adolescence is the most fragile formative stage of human growth. Basic school pupils, aged eleven to fifteen, require continuous parental warmth, affection, and direct moral supervision. Day schooling ensures that after classroom lessons, children return home to their families, where parents can monitor homework, nurture character, and detect early signs of delinquency. In stark contrast, boarding houses detach young children from familial guidance, leaving them vulnerable to peer bullying, senior intimidation, and negative social vices in unmonitored dormitories.\n\nSecondly, day schooling is far more cost-effective and democratic. In our developing nation, the exorbitant costs of boarding fees—encompassing dormitory bed fees, utility subventions, and termly provisions—place an unbearable financial burden on struggling families. Many parents are forced into crippling debt just to keep a child in a boarding house. Day schools provide equal access to curriculum instruction without bankrupting parents, ensuring that poverty does not bar brilliant children from pursuing education.\n\nMy worthy opponents have argued passionately that boarding schools foster self-reliance and uninterrupted prep hours. However, this claim collapses under scrutiny! A disciplined child can observe a strict study timetable at home without being locked away in a boarding house. Must a child be alienated from family love simply to learn how to wash plates?\n\nMr. Chairman, education without home affection is like a tree without roots. I urge this entire house to reject sentiment and vote resoundingly in favor of the motion.\n\nThank you.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 55. Narrative: Illustrating 'All That Glitters Is Not Gold'

  {

    id: "B7_S4_E_T_05",

    section: "theory",

    questionNumber: 55,

    theoryIndex: 5,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Narrative Essay",

    title: "The Deceptive Allure of City Life",

    shortSummary: "Write a story illustrating the proverb: 'All that glitters is not gold.'",

    prompt: "Write a story illustrating the proverb: 'All that glitters is not gold.' Narrate the experience of a village boy who was lured away by the flashy appearances of a stranger, only to discover hardship and deceit.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Narrative Conflict, Character Disillusionment & Organic Proverb Integration",

    learningCompetency: "B7.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through plot progression, character disillusionment, and moral resolution.",

    hint: "Show the contrast between the attractive initial promise and the bitter reality. Weave the proverb into the protagonist's final moment of realization.",

    guidanceScaffold: {

      genreType: "narrative_proverbial",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "The Cost of Blind Ambition",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Narrative plot arc tracing temptation, journey, hardship, and moral enlightenment.",

        stagePrompts: [

          { stageIndex: 1, role: "Exposition", guidingQuestion: "Introduce Kofi's quiet life in the farming village of Aburi and his desire for quick wealth.", transitionHints: ["In the tranquil hillside village of Aburi, fourteen-year-old Kofi lived a simple life...", "Though his parents provided honest meals, Kofi yearned for the glamorous lifestyle..."] },

          { stageIndex: 2, role: "Inciting Incident & Temptation", guidingQuestion: "Describe the arrival of a flashy stranger with a shiny sports car offering him city riches.", transitionHints: ["The disruption came during the annual festival when Uncle Charles arrived from the capital...", "Dressed in flashy designer clothes and waving bundles of cash, he promised Kofi..."] },

          { stageIndex: 3, role: "Rising Action & Harsh Climax", guidingQuestion: "Narrate running away to Accra only to be forced into backbreaking child labor in a scrap yard.", transitionHints: ["Sneaking away on a midnight bus, Kofi arrived in Accra with high hopes...", "Instead of the promised air-conditioned office job, he was taken to a squalid scrap yard..."] },

          { stageIndex: 4, role: "Denouement & Proverbial Realization", guidingQuestion: "Describe being rescued by social workers and realizing that outward sparkle hides danger.", transitionHints: ["Weeks of sleeping on damp cardboard ended when social workers raided the yard...", "Sitting in the police bus heading back to his humble village, he realized: all that glitters is not gold..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Moral Aphorism",

        proverbOrClosingPhrase: "All that glitters is not gold.",

        integrationRule: "Weave the proverb into Kofi's final realization during the journey back home."

      }

    },

    rubric: createWAECRubric(

      ["Village baseline and temptation established (2 marks)", "Deceptive stranger and harsh urban scrap yard conditions described (4 marks)", "Rescue, return, and organic proverb integration (4 marks)"],

      ["Character context clear", "Hardship vividly shown", "Proverb integrated organically"],

      ["Title properly underlined (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Natural transitions between scenes (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],

      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],

      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory adjectives (3 marks)"],

      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]

    ),

    modelAnswer: `The Cost of Blind Ambition\n___________________________\n\nIn the tranquil cocoa-farming village of Aburi, fourteen-year-old Kofi led a peaceful life. His parents were subsistence farmers who worked tirelessly to provide three wholesome meals a day and pay his junior high school fees. Yet, Kofi was perpetually dissatisfied, dreaming of fast cars, expensive sneakers, and the glamorous lifestyles he glimpsed in foreign television dramas.\n\nThe turning point arrived during the annual Odwira festival when a man named Charles arrived from Accra. Charles drove a glistening crimson sports car, wore heavy gold chains around his neck, and sprayed crisp bank notes into the crowd. Captivated by this display of affluence, Kofi approached him. Charles smiled warmly and made an alluring proposition: \"Come with me to the capital, young man, and I will place you in a high-paying international electronics firm.\"\n\nBlinded by the promise of effortless fortune, Kofi slipped out of his family's cottage at midnight without leaving a note. However, his dreams evaporated the moment the bus pulled into a squalid slum in Old Fadama. There was no corporate office. Charles confiscated his little luggage and forced him into an illegal e-waste scrap yard, burning toxic electrical cables over open fires to extract copper wire. His hands blistered, his eyes burned from chemical smoke, and he was fed only stale bread while sleeping on damp cardboard.\n\nTwo agonizing months later, child welfare officers raided the yard and rescued the emaciated boys. As the police bus drove Kofi back to his parents' warm, humble embrace, tears of repentance rolled down his cheeks. He learned through bitter suffering that all that glitters is not gold.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 56. Descriptive: An Annual Traditional Festival Durbar

  {

    id: "B7_S4_E_T_06",

    section: "theory",

    questionNumber: 56,

    theoryIndex: 6,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Descriptive Essay",

    title: "The Grand Durbar of Chiefs",

    shortSummary: "Write a descriptive essay recreating the visual majesty and vibrant sounds of an annual festival durbar.",

    prompt: "Your community recently celebrated its annual traditional festival. Write a descriptive essay about the grand durbar of chiefs, vividly depicting the colorful kente cloths, rhythmic drumming, royal palanquins, and electric atmosphere of the festival grounds.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Descriptive Cultural Exposition, Sensory Imagery & Spatial Sequencing",

    learningCompetency: "B7.4.2.2.1: Write vivid descriptive compositions capturing traditional cultural regalia, auditory rhythms, and ceremonial processions.",

    hint: "Use spatial progression: describe the bustling crowded grounds, the royal palanquin procession, the fontomfrom drumming, and the chief's traditional address.",

    guidanceScaffold: {

      genreType: "descriptive_travelogue",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "A Tapestry of Culture at the Grand Durbar",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Spatial and sensory depiction of an indigenous festival durbar.",

        stagePrompts: [

          { stageIndex: 1, role: "Establishing the Festival Ground", guidingQuestion: "Set the scene at the community ceremonial park under colorful umbrellas.", transitionHints: ["Under the radiant afternoon sun, the royal durbar grounds in Cape Coast...", "A vast sea of thousands of festival-goers had assembled under vibrant velvet canopies..."] },

          { stageIndex: 2, role: "The Procession of Chiefs (Visual & Tactile)", guidingQuestion: "Describe chiefs riding in palanquins adorned with heavy gold regalia and rich handwoven kente cloths.", transitionHints: ["The climax of the procession began with the arrival of the sub-chiefs...", "Borne aloft in ornate palanquins lined with velvet cushions, each paramount ruler was draped in..."] },

          { stageIndex: 3, role: "Auditory Majesty: Drumming & Gunpowder", guidingQuestion: "Capture the deep rhythms of the fontomfrom drums, horn blowers, and firing of muskets.", transitionHints: ["The acoustic atmosphere was electrifying...", "Deep, resonant beats from the fontomfrom talking drums vibrated through the earth while..."] },

          { stageIndex: 4, role: "Ceremonial Libation & Cultural Reflection", guidingQuestion: "Describe the solemn pouring of libation and reflect on the pride of Ghanaian cultural identity.", transitionHints: ["As the paramount chief stepped down to pour the sacred libation, silence swept over the field...", "Standing amid the sea of celebration, I felt a deep surge of pride in our enduring African heritage..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Cultural Synthesis",

        proverbOrClosingPhrase: "Our culture is the sacred anchor of our collective identity.",

        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating traditional heritage."

      }

    },

    rubric: createWAECRubric(

      ["Festival grounds and crowd atmosphere established (2 marks)", "Vivid sensory description of royal regalia and palanquins (4 marks)", "Fontomfrom drumming rhythms and cultural reflection conveyed (4 marks)"],

      ["Durbar setting established", "Visual and auditory imagery rich", "Cultural pride conveyed clearly"],

      ["Underlined Title Case title (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],

      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],

      ["Rich sensory and cultural vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],

      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]

    ),

    modelAnswer: `A Tapestry of Culture at the Grand Durbar\n___________________________________________\n\nUnder the radiant afternoon sun, the Victoria Park in Cape Coast was transformed into a kaleidoscopic sea of gold, velvet, and rhythm for the annual Fetu Afahye grand durbar of chiefs. Thousands of celebrants, tourists, and traditional elders from across the nation had gathered under towering multi-colored state umbrellas that bobbed gently in the coastal breeze.\n\nThe visual spectacle was breathtaking. The royal procession commenced with traditional warrior groups, the Asafo companies, their faces painted in white chalk and their chests crossed with protective leather amulets. Behind them came the paramount rulers, borne high above the crowd in ornate palanquins shaped like royal boats and war eagles. Each chief was draped in yards of handwoven silk kente, vibrant with shimmering patterns of crimson, gold, and emerald. Massive gold rings, heavy armbands, and crowns cast brilliant flashes of light whenever the sun caught their polished surfaces.\n\nThe acoustic power of the durbar was overwhelming. The deep, thunderous boom of the fontomfrom drums resonated in the chest of every spectator, conversing in the ancient proverbs of the Akan ancestors. Ivory horn blowers blew shrill, mournful calls that harmonized with the rhythmic clinking of iron bells. Intermittently, musketeers fired deafening volleys of blank gunpowder into the air, sending aromatic plumes of white smoke drifting over the dancing crowds.\n\nAs the Paramount Chief stepped forward to pour the sacred libation from an ornate calabash, absolute reverence silenced the thousands assembled. Watching him invoke blessings for peace and bumper harvests, I felt an overwhelming sense of pride in our rich, enduring African heritage.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 57. Article for Publication: The Menace of Indiscriminate Littering

  {

    id: "B7_S4_E_T_07",

    section: "theory",

    questionNumber: 57,

    theoryIndex: 7,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Article for Publication",

    title: "Curbing Plastic Litter in Our Community",

    shortSummary: "Write an article for a local newspaper on eradicating plastic waste and clogged gutters.",

    prompt: "Write an article for publication in a national daily newspaper titled: 'The Menace of Plastic Litter in Our Urban Communities.' Describe the widespread dumping of single-use plastic waste, analyze how blocked gutters trigger flooding and disease outbreaks, and recommend two practical community solutions.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Journalistic Article Architecture, Environmental Analysis & Civic Call to Action",

    learningCompetency: "B7.4.2.1.2: Compose structured articles for publication analyzing environmental sanitation, drainage challenges, and municipal policy reforms.",

    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into problem analysis, effects, and remedies.",

    guidanceScaffold: {

      genreType: "article_publication",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "full_caps_no_underline",

        modelHeadline: "THE MENACE OF PLASTIC LITTER IN OUR URBAN COMMUNITIES",

        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]

      },

      bylineGuide: {

        isRequired: true,

        modelByline: "By Francis Appiah, Basic 7B",

        rules: ["Position directly beneath the headline.", "State author name and class stream."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Expository problem-solution journalistic article framework.",

        stagePrompts: [

          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and describe the choking flood of single-use plastic waste across urban centers.", transitionHints: ["Walk through any commercial market or residential suburb in our cities today...", "A suffocating blanket of discarded single-use plastic carrier bags and water sachets greets every visitor..."] },

          { stageIndex: 2, role: "Environmental & Health Hazards", guidingQuestion: "Analyze how plastic waste chokes drainage channels, triggering flash floods and malaria epidemics.", transitionHints: ["Because plastic is non-biodegradable, its indiscriminate disposal creates catastrophic environmental consequences...", "During torrential rains, clogged gutters form dams that force floodwaters into homes and market stalls..."] },

          { stageIndex: 3, role: "Civic Irresponsibility", guidingQuestion: "Critique the culture of throwing trash from moving vehicles and lack of public dustbins.", transitionHints: ["The root of this crisis lies in a pervasive deficit of civic discipline...", "Commuters casually toss plastic sachets from moving minibuses, unbothered by the damage to public infrastructure..."] },

          { stageIndex: 4, role: "Practical Remedies & Call to Action", guidingQuestion: "Propose two actionable solutions (enforcing municipal spot fines and community recycling buy-back centers).", transitionHints: ["To reclaim our towns from filth, decisive multi-stakeholder action is urgently required...", "Municipal assemblies must strictly enforce anti-littering bylaws by imposing instant spot fines..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Peroration & Civic Appeal",

        proverbOrClosingPhrase: "Cleanliness is the foundation of civic pride.",

        integrationRule: "End with an inspiring appeal urging citizens to treat the environment with care."

      }

    },

    rubric: createWAECRubric(

      ["Lead hook and plastic pollution context established (2 marks)", "Drainage clogging, flooding, and malaria impacts analyzed (4 marks)", "Two actionable solutions and peroration presented (4 marks)"],

      ["Lead hook clear", "Consequences detailed", "Actionable solutions proposed"],

      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],

      ["Headline correct", "Byline present", "Zero letter format contamination"],

      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental vocabulary (3 marks)"],

      ["Objective register", "No slang or contractions", "Rich vocabulary"]

    ),

    modelAnswer: `THE MENACE OF PLASTIC LITTER IN OUR URBAN COMMUNITIES\nBy Francis Appiah, Basic 7B\n\nA casual stroll through any urban market or residential neighborhood in Ghana reveals an unsightly and alarming environmental tragedy: a suffocating tide of discarded single-use plastic carrier bags, food containers, and water sachets. What was once celebrated as a modern convenience has rapidly transformed into our cities' most destructive ecological curse.\n\nBecause petroleum-based plastic is non-biodegradable, it does not decompose. Instead, mountains of discarded plastic blow across streets and wash into open concrete storm drains. During heavy downpours, these plastic dams choke the drainage network completely. The trapped storm water overflows gutter banks, flooding streets, destroying market stalls, and submerging living rooms. Even worse, the stagnant, foul pools of water trapped in blocked gutters become prime breeding sanctuaries for mosquitoes and houseflies, directly fueling deadly annual outbreaks of malaria and cholera.\n\nThe persistence of this crisis stems from a blatant disregard for civic responsibility. Commuters habitually toss empty water sachets through bus windows, while roadside food vendors dump polythene bags directly into public gutters without remorse. This lack of discipline is compounded by a severe shortage of public waste receptacles along our streets.\n\nTo reverse this environmental degradation, municipal assemblies must immediately enact and enforce strict anti-littering bylaws, backed by instant spot fines for anyone caught littering in public. Furthermore, the government should partner with private waste firms to establish community recycling buy-back kiosks where citizens can exchange clean segregated plastic for cash. A cleaner nation begins with individual discipline, for cleanliness is the foundation of true civic pride.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 58. Debate: Books vs. Computers (Supporting Computers)

  {

    id: "B7_S4_E_T_08",

    section: "theory",

    questionNumber: 58,

    theoryIndex: 8,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Debate Speech",

    title: "Computers Are More Useful to Students Than Textbooks",

    shortSummary: "Speak in support of the motion that computers are more beneficial for basic school students than physical textbooks.",

    prompt: "You are representing your school in an inter-schools debate competition on the motion: 'Computers Have Done More to Advance Student Learning Than Printed Textbooks.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding digital libraries and interactive learning, while refuting opposing views.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",

    learningCompetency: "B7.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",

    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on vast digital libraries and interactive STEM models. Conclude with 'Thank you.'",

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

        stanceProclamationModel: "I stand firmly on this podium today to stoutly defend the motion which asserts that computers have done more to advance student learning than printed textbooks.",

        prohibitedOpenings: ["Good morning to you all", "I am standing here to talk"]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Parliamentary debate speech framework.",

        stagePrompts: [

          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with unyielding conviction today to defend the motion which asserts that..."] },

          { stageIndex: 2, role: "First Argument: Infinite Access to Knowledge", guidingQuestion: "Contrast a heavy, outdated physical textbook with a computer accessing vast global digital libraries.", transitionHints: ["First and foremost, consider the sheer volume and freshness of knowledge...", "A single printed textbook is static, easily outdated, and heavy to carry; in contrast, a computer connects a student to..."] },

          { stageIndex: 3, role: "Second Argument: Interactive Multimedia & STEM Simulations", guidingQuestion: "Explain how 3D simulations and video models make difficult mathematics and science concepts easy to grasp.", transitionHints: ["Secondly, computers cater to diverse learning styles through dynamic multimedia...", "While a textbook shows a flat, motionless diagram of the human heart, a computer simulation allows a student to..."] },

          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims about internet distractions, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will surely argue that computers distract students with games; however, this claim ignores that...", "With these cogent arguments, I urge you all to vote for the motion. Thank you."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Peroration & Final Sign-Off",

        proverbOrClosingPhrase: "The digital age is the gateway to limitless discovery.",

        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"

      }

    },

    rubric: createWAECRubric(

      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Access to dynamic digital libraries argued cogently (4 marks)", "Interactive STEM simulations and opponent refutation delivered effectively (4 marks)"],

      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],

      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],

      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],

      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],

      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]

    ),

    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Computers Have Done More to Advance Student Learning Than Printed Textbooks.\"\n\nFirst and foremost, consider the sheer volume, portability, and freshness of human knowledge. A traditional printed textbook is heavy, expensive, and rapidly outdated. Once printing ink dries on paper, scientific discoveries and geographical updates pass it by. In contrast, a single desktop or laptop computer connected to the internet grants a junior high school learner instant, free access to millions of digital encyclopedias, peer-reviewed journals, and educational databases. Can a school library with three hundred dusty textbooks match the boundless library of the digital universe? Incontestably not!\n\nSecondly, computers transform abstract, difficult concepts into engaging visual realities. While a static biology textbook shows a flat, confusing black-and-white sketch of the human circulatory system, a computerized 3D simulation allows a student to watch oxygenated blood pump through the heart valves in real time. Digital software enables learners to manipulate mathematical geometry shapes, conduct simulated chemical titration experiments safely, and learn coding algorithms. Computers do not merely deliver information; they ignite understanding through interactive engagement.\n\nMy worthy opponents have argued passionately that computers distract students with video games and social media. However, this argument collapses under scrutiny! The potential misuse of a tool does not diminish its inherent value. Do we ban pencils simply because a child can scribble on a wall? With basic parental guidance and school firewalls, computers remain the ultimate catalysts of academic distinction.\n\nMr. Chairman, printed textbooks belong to the horse-and-carriage era; computers are the rocket engines of modern discovery. I urge you all to vote resoundingly for the motion.\n\nThank you.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 59. Descriptive: The Chaos of a Stormy Rain in Town

  {

    id: "B7_S4_E_T_09",

    section: "theory",

    questionNumber: 59,

    theoryIndex: 9,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Descriptive Essay",

    title: "When the Rainstorm Struck Tanoso",

    shortSummary: "Write a descriptive essay capturing the sensory chaos and physical fury of a sudden tropical rainstorm.",

    prompt: "A sudden, violent rainstorm disrupted an open market in your town. Write a descriptive essay recreating the ominous gathering of dark clouds, the frantic scrambling of market vendors, the deafening fury of wind and thunder, and the drenched aftermath.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Atmospheric Sensory Description, Personification & Kinetic Pacing",

    learningCompetency: "B7.4.2.2.1: Write descriptive essays capturing extreme meteorological events through dynamic sensory registers, personification, and spatial progression.",

    hint: "Use chronological progression: the ominous pre-storm silence, the violent arrival of wind and flying canopies, the deluge of rain, and the soaked aftermath.",

    guidanceScaffold: {

      genreType: "descriptive_travelogue",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "Fury of the Tropical Rainstorm",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Chronological sensory progression through a severe rainstorm.",

        stagePrompts: [

          { stageIndex: 1, role: "The Ominous Prelude", guidingQuestion: "Describe the sudden darkening of the sky, suffocating stillness, and drop in temperature.", transitionHints: ["The afternoon had started with oppressive, muggy heat in Tanoso market...", "Without warning, the western horizon bruised into ominous shades of charcoal and purple..."] },

          { stageIndex: 2, role: "The Frantic Scramble (Visual & Auditory)", guidingQuestion: "Depict market traders screaming, hauling wooden stalls, and chasing flying tarpaulins in the rising wind.", transitionHints: ["A sudden blast of freezing wind howled across the stalls like an unleashed beast...", "Pandemonium erupted instantly as women screamed, desperately hauling baskets of tomatoes..."] },

          { stageIndex: 3, role: "The Deluge & Thunderous Climax", guidingQuestion: "Describe deafening thunderclaps, blinding lightning, and torrential sheets of water lashing the town.", transitionHints: ["Then, the heavens tore open with primeval fury...", "Deafening cracks of thunder shook the ground while sheets of gray rain hammered onto zinc roofs like machine gun fire..."] },

          { stageIndex: 4, role: "The Soaked Aftermath", guidingQuestion: "Describe the gradual easing of the deluge, swollen brown gutters, and drenched, relieved townsfolk.", transitionHints: ["An hour later, the tempest exhausted its fury, leaving the town drenched and silent...", "Gutters overflowed with swirling brown currents carrying debris, while cool air washed over the dripping market..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Natural Reflection",

        proverbOrClosingPhrase: "The storm clears the air of oppressive heat.",

        integrationRule: "Conclude with an aesthetic reflection on nature's raw power and the return of tranquility."

      }

    },

    rubric: createWAECRubric(

      ["Ominous gathering clouds and drop in temperature described (2 marks)", "Frantic market scramble depicted with vivid action verbs (4 marks)", "Sensory violence of thunder, rain deluge, and soaked aftermath conveyed (4 marks)"],

      ["Atmosphere established", "Sensory details rich and clear", "Rainstorm progression smooth"],

      ["Underlined Title Case title (1 mark)", "Logical 4-paragraph chronological flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],

      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],

      ["Dynamic action verbs and meteorological vocabulary (4 marks)", "Apt similes and personification (3 marks)", "Varied sentence architecture (3 marks)"],

      ["Action verbs active", "Apt figurative devices", "Varied sentence structures"]

    ),

    modelAnswer: `Fury of the Tropical Rainstorm\n_______________________________\n\nThe afternoon in Tanoso market had begun under an oppressive, suffocating heat that made breathing feel heavy. Suddenly, the northern horizon bruised into menacing shades of charcoal and indigo. A terrifying wall of dark storm clouds swept across the sky, swallowing the sun in seconds and plunging the bustling town into an eerie, premature twilight.\n\nA sudden blast of icy gale tore across the open marketplace like an unleashed beast. Pandemonium erupted instantly. Women shrieked, desperately throwing plastic sheets over mounds of dry fish and salt, while frantic barrow-pushers collided in the narrow lanes. The wind ripped loose market umbrellas from their wooden pegs, hurling them tumbling through the air like gigantic runaway kites. Billowing clouds of red dust stung the eyes of fleeing shoppers as doors slammed violently shut.\n\nThen, the heavens tore open. A blinding flash of blue lightning split the gloom, followed instantly by a deafening thunderclap that rattled teeth and shook the concrete foundations of the shops. Sheets of torrential gray water hammered down with furious violence, drumming on corrugated zinc roofs with the deafening roar of machine-gun fire. Within ten minutes, streets vanished beneath a foot of swirling muddy water, and visibility dropped to barely three meters.\n\nJust as suddenly as it had arrived, the fury of the tempest subsided an hour later into a gentle drizzle. The air was wonderfully cool, cleansed of its former stifling heat. Swollen brown gutters rushed with debris, and barefoot traders emerged from shop verandas, surveying the soaked earth with quiet relief at nature's awe-inspiring power.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  },

  // 60. Narrative: Illustrating 'Pride Goes Before a Fall'

  {

    id: "B7_S4_E_T_10",

    section: "theory",

    questionNumber: 60,

    theoryIndex: 10,

    type: "structured_essay",

    format: "structured_essay",

    level: "B7",

    difficulty: "foundation",

    category: "Narrative Essay",

    title: "The Fall of the Arrogant Champion",

    shortSummary: "Write a narrative story illustrating the proverb: 'Pride goes before a fall.'",

    prompt: "Write a story illustrating the proverb: 'Pride goes before a fall.' Narrate the downfall of a talented athlete or scholar whose boastful arrogance led to public embarrassment during an important school event.",

    wordCountLimit: { min: 180, target: 250, max: 320 },

    points: 30,

    competencyTarget: "Character Flaw Exposition, Dramatic Downfall & Organic Proverb Integration",

    learningCompetency: "B7.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through character conflict, hubris, and moral consequences.",

    hint: "Show the character's boastful arrogance early on. Describe how he neglected preparation or mocked competitors, and weave the proverb into the humiliation of his defeat.",

    guidanceScaffold: {

      genreType: "narrative_proverbial",

      headlineGuide: {

        isRequired: true,

        recommendedStyle: "title_case_underlined",

        modelHeadline: "The Price of Boastfulness",

        rules: ["Must be underlined in Title Case.", "Never end with a period."]

      },

      plotOrSpatialRoadmap: {

        recommendedParagraphs: 4,

        targetWordCount: 250,

        minimumWordCount: 180,

        frameworkDescription: "Narrative plot arc tracing hubris, neglected training, dramatic contest, and humiliation.",

        stagePrompts: [

          { stageIndex: 1, role: "Exposition & Character Hubris", guidingQuestion: "Introduce Kofi, the undefeated school hundred-meter sprint champion, and his insufferable arrogance.", transitionHints: ["Fourteen-year-old Kofi was blessed with blinding athletic speed...", "However, winning three consecutive gold medals had inflated his ego to insufferable heights..."] },

          { stageIndex: 2, role: "Inciting Incident & Neglected Preparation", guidingQuestion: "Describe Kofi mocking a quiet new student and refusing to train for the inter-house championship.", transitionHints: ["When the house sports master called for afternoon training sessions, Kofi scoffed...", "\"Training is for weaklings,\" he boasted publicly, openly ridiculing a quiet new boy named Samuel..."] },

          { stageIndex: 3, role: "The Championship Climax (The Race)", guidingQuestion: "Narrate the hundred-meter final, Kofi showboating halfway through, and Samuel overtaking him at the finish line.", transitionHints: ["On the day of the championship, the hundred-meter race brought the stadium to its feet...", "Kofi surged into a slight lead and arrogantly turned his head to mock the runners behind him..."] },

          { stageIndex: 4, role: "Denouement & Proverbial Realization", guidingQuestion: "Describe Kofi stumbling in his complacency, losing the gold medal, and reflecting on his pride.", transitionHints: ["In that split second of foolish complacency, Samuel accelerated like a cheetah...", "Staring at the silver medal in bitter shame while the crowd cheered for Samuel, Kofi realized: pride goes before a fall..."] }

        ]

      },

      moralOrPerorationGuide: {

        role: "Moral Synthesis",

        proverbOrClosingPhrase: "Pride goes before a fall.",

        integrationRule: "Embed the proverb into Kofi's final realization on the winner's podium."

      }

    },

    rubric: createWAECRubric(

      ["Protagonist's athletic talent and boastfulness established (2 marks)", "Neglected training and public mocking of opponent depicted (4 marks)", "Dramatic race climax, humiliating defeat, and organic proverb integration (4 marks)"],

      ["Character arrogance clear", "Race drama depicted vividly", "Proverb integrated organically"],

      ["Underlined Title Case title (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],

      ["Headline correct", "Paragraph transitions smooth", "Dialogue mechanics accurate"],

      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory adjectives (3 marks)"],

      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]

    ),

    modelAnswer: `The Price of Boastfulness\n_________________________\n\nFourteen-year-old Kofi was blessed with lightning speed. He had won the junior boys' one-hundred-meter dash for three consecutive terms, earning the nickname 'The Bullet' across the district. Regrettably, his undeniable talent had inflated his pride to unbearable heights. He swaggered around the school compound with disdain, openly mocking classmates who could not match his athletic prowess.\n\nWhen the inter-house athletics competition was announced, our sports master, Mr. Okyere, urged all athletes to report for daily conditioning drills. Kofi scoffed at the directive. \"Conditioning is for mediocre runners who need luck to survive,\" he declared loudly under the school pavilion. While a quiet, soft-spoken transfer student named Samuel spent every afternoon running laps and practicing starts in the hot sun, Kofi spent his afternoons playing video games, boasting that he could win the gold medal barefoot with his eyes closed.\n\nOn the afternoon of the grand championship, the stadium was packed with hundreds of roaring spectators. When the starter's pistol cracked, Kofi leaped forward, surging into a narrow lead by the fifty-meter mark. Convinced that victory was already his, he foolishly slowed down and turned his head toward the crowd, waving his arms in arrogant showmanship.\n\nThat split second of complacency proved fatal. Samuel, running with relentless determination and flawless form, sprinted past him on the outside lane like a charging cheetah. Panicking, Kofi tried desperately to accelerate, but his unconditioned legs knotted into painful cramps. He stumbled across the finish line second, watched by the entire school as Samuel breasted the tape to shatter the school record.\n\nStanding on the lower step of the podium in tears of humiliation, Kofi remembered his sports master's unheeded warning. He had learned the hardest lesson of his life: truly, pride goes before a fall.`,

    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"

  }

];

// =========================================================================

// DEPLOYMENT ORCHESTRATION FUNCTION

// =========================================================================

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B7FoundationClean() {
  console.log("Building clean 60-item Strand 4 B7 Foundation Practice Lab...");
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
      id: `B7_S4_E_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B7",
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
      learningCompetency: "B7.4.2.1: Demonstrate foundation mastery of narrative arcs, sensory descriptive writing, article headline-byline rules, and parliamentary debate vocatives."
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
    level: "B7",
    difficulty: "foundation",
    title: "Basic 7 Foundation Writing Lab: 50 Objective Rhetoric Drills + 10 Theory Extended Compositions",
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all60Items.length} items to B7 Foundation Practice Labs!`);
}

deployStrand4B7FoundationClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B7 Foundation Clean 60 Lab:", err);
    process.exit(1);
  });

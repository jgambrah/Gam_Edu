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
  level: "B9";
  difficulty: "advanced";
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
  level: "B9";
  difficulty: "advanced";
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
// Basic 9 Advanced Diagnostic Focus:
// BECE Chief Examiner Standards, Complex Dialectical Refutation, Forensic Deixis,
// Mandative Subjunctive in Policy Writing, Proverbial Structural Synthesis
// =========================================================================
const rawObjective50Data = [
  {
    passage: "A BECE candidate is drafting an illustrative story on the proverb: 'An empty barrel makes the most noise.'",
    question: "Which of the following character developments best exemplifies this aphorism?",
    options: [
      "A boastful student brags loudly about his academic superiority but freezes in panic and fails during the final examination",
      "A village drummer carves an empty wooden barrel and beats it during an evening festival",
      "A student collects empty metal barrels to store rainwater behind the school dormitory",
      "A quiet scholar wins the regional quiz competition without uttering a single boast"
    ],
    answer: "A boastful student brags loudly about his academic superiority but freezes in panic and fails during the final examination",
    hint: "The proverb criticizes individuals with little substance who speak the loudest.",
    solution: "The proverb 'An empty barrel makes the most noise' highlights that shallow, incompetent individuals boast the loudest. Contrasting boastful rhetoric with actual incompetence embodies this moral theme.",
    target: "Proverbial Interpretation & Narrative Conception"
  },
  {
    passage: "In an argumentative composition for BECE Paper 2, what distinguishes a 'concession' from a 'refutation'?",
    question: "Identify the defining distinction between concession and refutation:",
    options: [
      "A concession acknowledges a valid opposing counter-claim, whereas a refutation systematically disproves it with superior evidence",
      "A concession is the title of the essay, while a refutation is the byline",
      "A concession is written in the past tense, while a refutation is in the future tense",
      "A concession is an apology to the examiner, while a refutation is the concluding paragraph"
    ],
    answer: "A concession acknowledges a valid opposing counter-claim, whereas a refutation systematically disproves it with superior evidence",
    hint: "Conceding means granting a point; refuting means knocking it down.",
    solution: "In dialectical argument, a concession grants that the opposition has a point, while the refutation dismantles that opposing point with stronger facts and logic.",
    target: "Argumentative Logic: Concession vs. Refutation"
  },
  {
    passage: "A student writes a headline: '<u>THE THREAT OF CYBERCRIME TO GHANAIAN YOUTH.</u>'.",
    question: "What two mechanical formatting errors are committed in this title?",
    options: [
      "Underlining a headline written in ALL BLOCK CAPITALS and terminating it with an illegal full stop",
      "Failing to write in pencil and omitting quotation marks",
      "Using the preposition 'to' and capitalizing the article",
      "Omitting the author's class stream from the title"
    ],
    answer: "Underlining a headline written in ALL BLOCK CAPITALS and terminating it with an illegal full stop",
    hint: "All-caps headings should not be underlined, and titles never end with periods.",
    solution: "Headlines in all-caps must not be underlined, and titles must never end with a period. Both represent mechanical errors under WAEC rubrics.",
    target: "Headline Typography: Combined Orthography Flaws"
  },
  {
    passage: "In a competitive debate, the second proposition speaker begins: 'My worthy opponent on the opposing bench claimed that solar energy is unreliable, but she failed to account for modern battery storage units.'",
    question: "What technical debate element is executed here?",
    options: [
      "A direct forensic rebuttal",
      "The parliamentary vocative opening",
      "An ad hominem personal insult",
      "A dramatic narrative exposition"
    ],
    answer: "A direct forensic rebuttal",
    hint: "The speaker takes an opponent's specific premise and disproves it.",
    solution: "A forensic rebuttal directly identifies a premise asserted by an opponent and demonstrates its weakness or omission using counter-evidence.",
    target: "Debate Speech: Forensic Rebuttal Mechanics"
  },
  {
    passage: "Examine this dialogue construction: '\"Hand over your answer script immediately!\" the invigilator commanded. \"The examination has ended.\"'",
    question: "Why is the punctuation of this inquit tag and direct speech segment accurate?",
    options: [
      "The inquit tag terminates with a full stop because both spoken clauses are separate complete sentences",
      "Because the dialogue tags are placed inside brackets",
      "Because the word 'commanded' is capitalized",
      "Because quotation marks are omitted around the second sentence"
    ],
    answer: "The inquit tag terminates with a full stop because both spoken clauses are separate complete sentences",
    hint: "Two independent complete sentences spoken by a character require a period after the reporting tag.",
    solution: "When an inquit tag separates two complete spoken sentences, the tag must conclude with a full stop, and the second sentence begins with a capital letter inside quotation marks.",
    target: "Dialogue Mechanics: Separate Utterance Punctuation"
  },
  {
    passage: "A candidate writes: 'The sharp, metallic tang of cold river water tasted like melted iron on his parched tongue.'",
    question: "Which sensory register is primarily engaged by this sentence?",
    options: [
      "Gustatory register (taste)",
      "Auditory register (sound)",
      "Visual register (sight)",
      "Olfactory register (smell)"
    ],
    answer: "Gustatory register (taste)",
    hint: "It describes flavor and taste on the tongue.",
    solution: "'Metallic tang' and 'tasted like melted iron on his parched tongue' appeal directly to the gustatory (taste) faculty.",
    target: "Descriptive Writing: Gustatory Sensory Imagery"
  },
  {
    passage: "In an article written for publication in the *Daily Graphic*, where must the byline be placed?",
    question: "Select the correct location for the byline:",
    options: [
      "Directly below the headline or centered at the conclusion of the article",
      "In the top right corner accompanied by a full postal address",
      "Inside the margin beside each paragraph",
      "Within the concluding moral sentence only"
    ],
    answer: "Directly below the headline or centered at the conclusion of the article",
    hint: "Bylines announce authorship immediately following the title or at the close.",
    solution: "A byline (e.g., 'By Kwame Mensah, Basic 9') belongs immediately beneath the headline or appended at the very end of the article, without postal addresses.",
    target: "Articles for Publication: Byline Positioning"
  },
  {
    passage: "A candidate writes: 'Neither the class prefect nor the candidates was prepared for the unannounced mock test.'",
    question: "Under the Principle of Proximity Concord, how should the finite verb be corrected?",
    options: [
      "were prepared (agreeing in plural number with the nearest nominal 'candidates')",
      "are prepared",
      "has been prepared",
      "is prepared"
    ],
    answer: "were prepared (agreeing in plural number with the nearest nominal 'candidates')",
    hint: "With 'neither... nor', the verb agrees with the subject closest to it.",
    solution: "The Principle of Proximity Concord mandates that with correlative conjunctions ('neither... nor'), the finite verb agrees with the nearest nominal element ('candidates' -> 'were').",
    target: "Concord Mechanics: Correlative Proximity"
  },
  {
    passage: "In an argumentative essay on environmental sanitation, which of the following provides the most persuasive evidence?",
    question: "Select the most credible supporting evidence:",
    options: [
      "Documented empirical data from the Ministry of Health showing a 60% decline in cholera cases after municipal drain covers were installed",
      "The writer's personal opinion that covered gutters look neat",
      "An unconfirmed story told by a street vendor",
      "A poem about clean rivers"
    ],
    answer: "Documented empirical data from the Ministry of Health showing a 60% decline in cholera cases after municipal drain covers were installed",
    hint: "Official statistics and documented facts provide empirical proof.",
    solution: "Empirical data from accredited regulatory bodies carries objective weight, making it far more persuasive than anecdotes or personal feelings.",
    target: "Argumentative Logic: Empirical Evidence"
  },
  {
    passage: "A student writes a headline: 'HOW TO CURB ROAD CARNAGE IN GHANA'.",
    question: "Under WAEC formatting standards, why must this all-caps headline NOT be underlined?",
    options: [
      "Headings written in ALL CAPITAL LETTERS are already typographically prominent, making underlines redundant",
      "Because all-caps headlines are forbidden in English",
      "Because headlines should only be written in green ink",
      "Because underlining causes spelling errors"
    ],
    answer: "Headings written in ALL CAPITAL LETTERS are already typographically prominent, making underlines redundant",
    hint: "Underlining is reserved for Title Case headings.",
    solution: "Block capital titles provide sufficient typographic prominence. Adding an underline is a redundant mechanical flaw penalized under WAEC guidelines.",
    target: "Headline Typography: Block Capital Prominence Rule"
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
    passage: "A writer describes a storm: 'The wind shrieked, the lightning blinded, and the thunder crushed.'",
    question: "What syntactic rhetorical device is demonstrated by this structure?",
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
    passage: "A student writes: 'The market was noisy, loud, chaotic, and deafening.'",
    question: "What expressive defect does this sentence demonstrate?",
    options: [
      "Tautology and auditory redundancy",
      "Grammatical disagreement",
      "Metaphorical contradiction",
      "Passive voice error"
    ],
    answer: "Tautology and auditory redundancy",
    hint: "Using multiple words that mean the same thing wastes expressive space.",
    solution: "'Noisy, loud, and deafening' repeats the same auditory quality without providing sensory contrast or specific imagery, resulting in tautological redundancy.",
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
      "THE MENACE OF GALAMSEY ON WATER TREATMENT.",
      "THE MENACE OF GALAMSEY ON WATER TREATMENT",
      "<u>The Menace of Galamsey on Water Treatment</u>",
      "The Menace of Galamsey on Water Treatment (underlined)"
    ],
    answer: "THE MENACE OF GALAMSEY ON WATER TREATMENT.",
    hint: "Headlines and captions are titles, not sentences, and must never end with a period.",
    solution: "Headlines must never end with a full stop. Placing a terminal period after a title is a mechanical punctuation error under WAEC marking rubrics.",
    target: "Headline Typography: Terminal Period Prohibition"
  },
  {
    passage: "A narrative ends with: 'Looking at his empty trophy case, he remembered the ancient truth: all that glitters is not gold.'",
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
    passage: "In a debate opposing the motion 'Day Schools Are Better Than Boarding Schools,' what should the lead speaker state in paragraph 1?",
    question: "Identify the mandatory opening requirement:",
    options: [
      "Deliver the vocative salutations, explicitly proclaim opposition to the motion, and define key terms operationally",
      "Tell a long humorous story about personal bus rides",
      "Apologize for not having scientific statistics",
      "Direct personal insults at the proposition team"
    ],
    answer: "Deliver the vocative salutations, explicitly proclaim opposition to the motion, and define key terms operationally",
    hint: "The first paragraph must anchor the speaker's stance and define terms.",
    solution: "The opening paragraph of a debate speech must formally state the speaker's stance (proposing or opposing) and establish concise operational definitions for the motion.",
    target: "Debate Speech: Stance and Definitions"
  },
  {
    passage: "Which of the following describes an auditory sensory image?",
    question: "Select the auditory descriptive detail:",
    options: [
      "The deafening rumble of the blast shattered the tranquility of the mountain valley",
      "The sky turned dark with ominous charcoal clouds",
      "The cold mud seeped between his bare toes",
      "The air smelled of burning diesel and rubber"
    ],
    answer: "The deafening rumble of the blast shattered the tranquility of the mountain valley",
    hint: "Auditory imagery appeals to the ear and sound perception.",
    solution: "'Deafening rumble of the blast' appeals directly to the sense of hearing through acoustic texture and volume.",
    target: "Descriptive Writing: Auditory Imagery"
  },
  {
    passage: "A student writing an argumentative essay writes: 'Every citizen knows that technical schools are inferior.'",
    question: "What logical fallacy is present in this claim?",
    options: [
      "Hasty generalization and unsupported sweeping assertion",
      "Valid deductive syllogism",
      "Objective empirical evidence",
      "Proper dialectical concession"
    ],
    answer: "Hasty generalization and unsupported sweeping assertion",
    hint: "Sweeping claims like 'every citizen knows' lack factual evidence.",
    solution: "Sweeping assertions like 'every citizen knows' commit the fallacy of hasty generalization. Argumentative discourse requires objective, evidence-based reasoning.",
    target: "Argumentative Logic: Avoiding Sweeping Generalizations"
  },
  {
    passage: "When a new character speaks in a narrative dialogue, what layout rule must be followed?",
    question: "Select the correct formatting rule:",
    options: [
      "Start a new paragraph on a fresh line, indented from the margin",
      "Continue writing on the same line using capital letters",
      "Put the speech inside square brackets",
      "Underline the character's name"
    ],
    answer: "Start a new paragraph on a fresh line, indented from the margin",
    hint: "New speaker equals new paragraph line.",
    solution: "In standard dialogue mechanics, every shift in speaker requires a brand new paragraph line, maintaining clear narrative speaker boundaries.",
    target: "Dialogue Formatting: Speaker Line Breaks"
  },
  {
    passage: "What is the primary function of the 'peroration' in a debate speech or article?",
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
    passage: "A student writes: 'The hospital was sad, gloomy, and bad.'",
    question: "How can this sentence be revised to create vivid sensory immersion?",
    options: [
      "The hum of heart monitors and the sterile smell of antiseptic filled the dimly lit emergency corridor where anxious relatives waited.",
      "The hospital had plenty sadness and bad sickness.",
      "People were crying because the hospital was gloomy.",
      "The hospital was not good at all."
    ],
    answer: "The hum of heart monitors and the sterile smell of antiseptic filled the dimly lit emergency corridor where anxious relatives waited.",
    hint: "Show, don't tell. Replace generic labels with concrete actions, sounds, and visual details.",
    solution: "The revised version uses concrete sensory nouns ('heart monitors', 'antiseptic') and visual details ('dimly lit corridor') rather than abstract adjectives.",
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
    passage: "A student writes: 'The committee have made their decision.'",
    question: "When 'committee' functions as a single unified collective entity, how should the verb be constructed?",
    options: [
      "has made (singular concord for a unified corporate entity)",
      "have made",
      "are making",
      "were made"
    ],
    answer: "has made (singular concord for a unified corporate entity)",
    hint: "A collective noun acting as a single unit takes a singular verb.",
    solution: "When a collective noun functions as a single unified institution, standard prescriptive concord mandates the singular verb 'has made'.",
    target: "Concord Mechanics: Collective Nouns"
  },
  {
    passage: "Which of the following sentences correctly applies an inverted conditional structure?",
    question: "Select the inverted conditional sentence:",
    options: [
      "Had I known about the revision class, I would have attended punctually.",
      "If I had known about the revision class, I would have attended punctually.",
      "If I would have known about the class, I had attended.",
      "I had known about the class if I attended."
    ],
    answer: "Had I known about the revision class, I would have attended punctually.",
    hint: "Inversion fronts the auxiliary 'Had' and omits 'if'.",
    solution: "'Had I known...' is an inverted third conditional construction that omits the conjunction 'if' by fronting the auxiliary verb, representing sophisticated formal syntax.",
    target: "Advanced Syntax: Inverted Conditionals"
  },
  {
    passage: "In an article, what is the rhetorical effect of a short, punchy single-clause sentence following a long, complex periodic sentence?",
    question: "Identify the stylistic impact:",
    options: [
      "It delivers dramatic emphasis and emotional impact through rhythmic variation",
      "It reveals that the author ran out of ideas",
      "It is a grammatical punctuation error",
      "It confuses the reader unnecessarily"
    ],
    answer: "It delivers dramatic emphasis and emotional impact through rhythmic variation",
    hint: "Varying sentence length creates dramatic contrast.",
    solution: "Juxtaposing a brief, punchy sentence against a long periodic sentence creates rhythmic contrast, focusing intense reader attention on the core takeaway.",
    target: "Syntactic Style: Rhythmic Variation"
  },
  {
    passage: "A narrative includes the sentence: 'The old oak tree groaned in agony as the lightning bolt shattered its trunk.'",
    question: "What figurative device is used to describe the tree's destruction?",
    options: [
      "Personification",
      "Simile",
      "Synecdoche",
      "Alliteration only"
    ],
    answer: "Personification",
    hint: "Attributing human groaning and agony to a tree.",
    solution: "Attributing the human capacity to 'groan in agony' to an inanimate tree personifies nature, heightening dramatic atmospheric intensity.",
    target: "Descriptive Writing: Personification"
  },
  {
    passage: "In a debate speech, why is it vital to define key terms operationally in paragraph 1?",
    question: "State the purpose of operational definitions:",
    options: [
      "To establish clear contextual boundaries for the debate and prevent semantic confusion",
      "To demonstrate that the speaker memorized the dictionary",
      "To use up time on the timekeeper's clock",
      "To insult the opposing team's vocabulary"
    ],
    answer: "To establish clear contextual boundaries for the debate and prevent semantic confusion",
    hint: "It clarifies how contentious words are understood within the scope of the motion.",
    solution: "Operational definitions establish clear conceptual parameters, ensuring that the debate addresses the core issue without drifting into semantic ambiguity.",
    target: "Debate Logic: Operational Definitions"
  },
  {
    passage: "A candidate writes: 'The smell of hot jollof rice was sweet and nice.'",
    question: "How should this weak descriptive sentence be elevated to create mouth-watering culinary imagery?",
    options: [
      "Aromatic steam rose from the steaming cauldron of jollof rice, redolent with smoked bay leaves, crushed rosemary, and caramelized tomato essence.",
      "The jollof rice was sweet and tasted very good.",
      "People liked the jollof rice because the smell was fine.",
      "The rice was hot and had a nice taste."
    ],
    answer: "Aromatic steam rose from the steaming cauldron of jollof rice, redolent with smoked bay leaves, crushed rosemary, and caramelized tomato essence.",
    hint: "Replace vague qualifiers with specific spices, culinary actions, and sensory adjectives.",
    solution: "The elevated version uses concrete culinary nouns ('steaming cauldron', 'bay leaves', 'caramelized tomato essence') and evocative adjectives ('aromatic', 'redolent') to recreate the sensory experience vividly.",
    target: "Descriptive Writing: Culinary Sensory Elevation"
  }
];

// =========================================================================
// 10 THEORY ESSAY WRITING TASKS (QUESTIONS 51 TO 60)
// Basic 9 Advanced Scaffolds & Model Compositions (~250 words each)
// Covering: Narrative Moral Stories, Sensory Travelogues, Articles & Debates
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Narrative: Illustrating 'Cut Your Coat According to Your Cloth'
  {
    id: "B9_S4_E_A_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Narrative Essay",
    title: "The Price of False Living",
    shortSummary: "Write a narrative story illustrating the proverb: 'Cut your coat according to your cloth.'",
    prompt: "Write a story that illustrates the truth of the proverb: 'Cut your coat according to your cloth.' Narrate how an ambitious junior high school candidate pressured his struggling parents into buying an expensive designer smartphone to match wealthy classmates, only for the family to plunge into severe debt and financial humiliation.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Hubris Arc, Socio-Economic Conflict & Organic Proverb Integration",
    learningCompetency: "B9.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through socio-economic tension, character hubris, and moral consequences.",
    hint: "Establish the family's modest means versus the boy's social insecurity. Describe the reckless spending, the immediate debt crisis, and the bitter moral realization.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Price of False Living",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing social pressure, reckless extravagance, financial disaster, and moral enlightenment.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Social Insecurity", guidingQuestion: "Introduce fifteen-year-old Kwesi, whose humble artisan parents sacrificed to send him to a prestigious school in Accra.", transitionHints: ["In the bustling municipality of Tema, fifteen-year-old Kwesi lived in a modest rented room...", "Surrounded by classmates from wealthy diplomatic and corporate homes, Kwesi felt an acute sense of social inferiority..."] },
          { stageIndex: 2, role: "Inciting Incident & Extravagant Pressure", guidingQuestion: "Describe Kwesi coercing his mother into borrowing money to purchase a flagship smartphone to show off.", transitionHints: ["As the final term began, Kwesi refused to carry his modest keypad phone...", "Weeping and threatening to abandon school, he pressured his mother into borrowing high-interest money from a local moneylender..."] },
          { stageIndex: 3, role: "The Fleeting Triumph & The Climax", guidingQuestion: "Narrate the temporary glory of showing off the luxury gadget, followed by the phone being stolen in a commercial minibus.", transitionHints: ["For two weeks, Kwesi basked in the shallow admiration of his peers...", "Disaster struck on a crowded commercial minibus when a pickpocket sliced open his bag, stealing the uninsured device..."] },
          { stageIndex: 4, role: "Denouement, Debt & Proverbial Realization", guidingQuestion: "Describe the humiliating arrival of the moneylender, the seizure of family belongings, and Kwesi's remorse.", transitionHints: ["The illusion of grandeur evaporated when the aggressive moneylender seized his mother's sewing machines...", "Watching his tearful mother stripped of her livelihood, Kwesi learned the bitter truth: cut your coat according to your cloth..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Resolution & Moral Aphorism",
        proverbOrClosingPhrase: "Cut your coat according to your cloth.",
        integrationRule: "Weave the proverb organically into Kwesi's final realization during the family's debt crisis."
      }
    },
    rubric: createWAECRubric(
      ["Modest family background and social pressure established (2 marks)", "Coerced borrowing and phone theft depicted vividly (4 marks)", "Humiliating moneylender raid and organic proverb integration (4 marks)"],
      ["Character insecurity clear", "Theft and debt shown", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and emotional adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Price of False Living\n__________________________\n\nFifteen-year-old Kwesi lived in a modest two-room rented apartment in Tema with his hardworking mother, a humble seamstress. Following his admission to a prestigious private junior secondary school on an academic bursary, Kwesi found himself surrounded by the children of wealthy corporate executives and diplomats. Instead of focusing on his upcoming BECE preparations, an acute sense of social inferiority consumed him. He desperately wanted his affluent peers to believe that he came from a wealthy background.\n\nAs the final school term commenced, Kwesi refused to carry his modest, reliable keypad phone. \"All my friends bring flagship touchscreen smartphones to school,\" he complained bitterly. Threatening to boycott classes, he coerced his distressed mother into taking an emergency loan from a predatory neighborhood moneylender at exorbitant interest. Blinded by maternal affection, she handed him the money, warning him that living beyond their means would bring ruin.\n\nFor two weeks, the gamble appeared triumphant. Kwesi swaggered around the school compound, displaying the imported luxury device and basking in the shallow admiration of his classmates. But disaster struck swiftly. While traveling home on a crowded commercial minibus on Friday afternoon, a skilled pickpocket sliced open his canvas school bag and vanished with the phone into the crowded market crowd. Kwesi arrived home trembling in tears, holding an empty, slashed bag.\n\nThe real nightmare began on Monday morning. The aggressive moneylender stormed their home accompanied by two bailiffs, loudly demanding immediate repayment. When his mother could not produce the cash, the men dragged her commercial sewing machines and fabric bolts onto a waiting truck, stripping her of her only livelihood. Staring at his sobbing mother on the bare floor, Kwesi's heart broke in shame. He realized that false pride had cost them everything. Truly, one must cut one's coat according to one's cloth.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Descriptive: An Excursion to a Forest Canopy Walkway
  {
    id: "B9_S4_E_A_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Descriptive Essay",
    title: "Suspended in the Emerald Canopy",
    shortSummary: "Write a descriptive essay capturing the sensory heights and adrenaline of walking on the Kakum canopy walkway.",
    prompt: "Your school organized a graduation excursion to the Kakum National Park. Write a descriptive essay recreating the breathtaking experience of traversing the suspended canopy walkway forty meters above the rainforest floor, vividly depicting the swaying rope bridges, the towering trees, and the ocean of greenery below.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Spatial Height Progression, Multi-Sensory Rainforest Imagery & Kinesthetic Adrenaline",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions recreating natural monuments through spatial elevation, tactile and kinesthetic registers, and evocative aesthetic reflection.",
    hint: "Use spatial progression: the climb up the mountain trail, stepping onto the first swinging rope bridge, looking down into the sheer green abyss, and the triumphant arrival on the forest platform.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Suspended in the Rainforest Sky",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression from the damp forest floor up onto the forty-meter suspended canopy walkway.",
        stagePrompts: [
          { stageIndex: 1, role: "Ascent through the Rainforest", guidingQuestion: "Describe hiking up the steep, humid trail through dense rainforest undergrowth.", transitionHints: ["The journey into the green heart of Kakum National Park began with a demanding hike...", "Giant buttress roots twisted across the trail like slumbering pythons, while the air hung heavy with..."] },
          { stageIndex: 2, role: "The First Swaying Bridge (Tactile & Fear)", guidingQuestion: "Describe stepping onto the narrow wooden planks of the rope bridge suspended high above the ground.", transitionHints: ["Emerging onto the wooden staging platform, my heart seized with vertigo...", "Suspended forty meters in mid-air by steel cables and netting, the bridge swayed with every tentative step..."] },
          { stageIndex: 3, role: "The Canopy Vista (Visual & Auditory)", guidingQuestion: "Depict the panoramic ocean of tree crowns, swooping hornbills, and the distant rushing stream below.", transitionHints: ["Looking outward, the world was an uninterrupted ocean of shimmering emerald and olive leaves...", "High above the ground, the wind whispered through the tree crowns, while colorful hornbills swooped..."] },
          { stageIndex: 4, role: "Triumphant Crossing & Ecological Reflection", guidingQuestion: "Describe reaching the final platform, the rush of adrenaline, and appreciation for Ghana's rainforest heritage.", transitionHints: ["Stepping onto solid ground at the final tree platform, a profound wave of relief and triumph washed over me...", "Gazing back at the seven swinging bridges, I stood in awe of the ancient rainforest that protects our planet..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Aesthetic Reflection",
        proverbOrClosingPhrase: "The rainforest is the breathing lung of the earth.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating environmental conservation."
      }
    },
    rubric: createWAECRubric(
      ["Rainforest trail and ascent established (2 marks)", "Kinesthetic fear, swaying bridge, and sensory heights conveyed vividly (4 marks)", "Canopy panoramas, birdlife, and environmental reflection captured (4 marks)"],
      ["Setting established", "Height and swaying motion vivid", "Rainforest vistas detailed"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial progression (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified travelogue perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Spatial progression clear"],
      ["Rich sensory and kinesthetic vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Kinesthetic words active", "Apt figurative devices", "Varied sentence patterns"]
    ),
    modelAnswer: `Suspended in the Rainforest Sky\n_______________________________\n\nThe journey into the ancient heart of Kakum National Park began with a demanding hike through dense, humid rainforest. Giant buttress roots of mahogany and ebony trees twisted across the rocky footpath like slumbering pythons. The damp, rich scent of decaying forest humus mingled with the fragrant sweetness of wild tree bark. High above our heads, the thick canopy blocked out the blazing afternoon sun, filtering light into a cool, emerald twilight punctuated by the shrieks of hidden tree hyraxes.\n\nEmerging onto the wooden observation platform, my breath caught in my throat. Before me stretched the famous canopy walkway: seven narrow rope bridges suspended forty meters in the sky, connecting giant emergent trees. Stepping onto the first span, an intense wave of vertigo gripped my stomach. The single-file wooden walkway, barely two handspans wide, bounced and swayed with every tentative footstep. Gripping the taut nylon side-nets with sweating palms, I looked straight down through the wooden slats into the sheer abyss where the forest floor was reduced to a distant, misty green carpet.\n\nYet, terror quickly gave way to wonder. Suspended amid the clouds, the perspective was breathtaking. Looking outward, thousands of treetops rolled across the undulating hills like an ocean of emerald waves. Brightly colored yellow-casqued hornbills soared beneath our feet, their heavy wingbeats audible in the crisp, breezy air. Lianas and orchids draped the branches, creating hanging aerial gardens that have stood for centuries.\n\nStepping onto the final platform, an exhilarating rush of triumph surged through my veins. The trembling in my knees ceased, replaced by deep reverence for the majestic rainforest that protects our planet's ecological balance.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Article for Publication: Restoring Discipline in Junior High Schools
  {
    id: "B9_S4_E_A_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Article for Publication",
    title: "Restoring Discipline in Junior High Schools",
    shortSummary: "Write an article for publication in your school magazine analyzing the causes and remedies of student indiscipline.",
    prompt: "Write an article for publication in your school magazine titled: 'Restoring Discipline in Junior High Schools.' Analyze how truancy, bullying, and defiance of authority undermine academic excellence, examine the breakdown of parental oversight, and propose two constructive disciplinary reforms.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Sociological Problem Analysis & Restorative Policy Proposals",
    learningCompetency: "B9.4.2.1.2: Compose structured articles for publication analyzing behavioral indiscipline, parental negligence, and restorative school policies.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into problem analysis, root causes, and practical remedies.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "RESTORING DISCIPLINE IN JUNIOR HIGH SCHOOLS",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Daniel Osei, Basic 9B",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Manifestations of Indiscipline -> Parental Breakdown -> Restorative Interventions).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and establish discipline as the irreplaceable bedrock of academic excellence.", transitionHints: ["Discipline is the vital engine that drives intellectual achievement and moral character...", "Regrettably, a disturbing wave of indiscipline is eroding the foundations of our junior secondary schools..."] },
          { stageIndex: 2, role: "Manifestations & Academic Fallout", guidingQuestion: "Examine common manifestations: chronic tardiness, classroom disrespect, cyberbullying, and academic decline.", transitionHints: ["The symptoms of this behavioral crisis are evident across classrooms...", "Pupils openly defy prefects, loiter around market centers during lessons, and disrupt instructional time with..."] },
          { stageIndex: 3, role: "Root Causes: Parental Neglect & Media Influence", guidingQuestion: "Analyze how busy modern work schedules and unmonitored television/internet content corrode respect.", transitionHints: ["The root causes of this moral collapse point toward the domestic home...", "With parents working long hours to survive economic pressures, children are left to be raised by television soap operas and..."] },
          { stageIndex: 4, role: "Constructive Remedies & Call to Action", guidingQuestion: "Propose two practical solutions (restorative peer counseling desks and regular parent-teacher accountability dialogues).", transitionHints: ["To reverse this moral decline, schools must abandon purely physical flogging and adopt...", "First, schools should establish peer counseling committees, while parents maintain..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Call to Moral Order",
        proverbOrClosingPhrase: "Discipline is the bridge between educational dreams and actual achievement.",
        integrationRule: "End with an inspiring appeal urging students, teachers, and parents to uphold institutional order."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and importance of school discipline established (2 marks)", "Manifestations and parental/media root causes analyzed (4 marks)", "Two actionable restorative remedies and peroration presented (4 marks)"],
      ["Lead hook clear", "Causes and effects detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive sociological vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `RESTORING DISCIPLINE IN JUNIOR HIGH SCHOOLS\nBy Daniel Osei, Basic 9B\n\nDiscipline is the indispensable bedrock upon which intellectual excellence, civic responsibility, and moral integrity are erected. Without it, the classroom ceases to be a temple of learning and degenerates into an arena of disorder. Regrettably, a troubling wave of student indiscipline is sweeping through our junior high schools, eroding academic standards and compromising the moral foundation of our youth.\n\nThe manifestations of this behavioral crisis are visible on our school compounds daily. Chronic lateness, truancy, defiance of school prefects, and destruction of laboratory furniture have become increasingly normalized. Furthermore, the spread of illicit mobile phones in classrooms has spawned cyberbullying and cheating syndicates, disrupting instructional time and breeding cynicism among pupils. Inevitably, terminal examination scores have plummeted as instructional discipline collapses.\n\nThe root causes of this decay point toward the family home. In the modern economic struggle, many parents leave home before dawn and return late at night, leaving adolescents without moral supervision or emotional mentorship. Children are left to absorb distorted values from violent foreign video games and unregulated internet feeds. When parents abdicate their duty to correct early misbehavior, schools inherit rebellious youngsters who resist institutional authority.\n\nTo restore order, schools must move beyond outdated physical caning and embrace restorative discipline. Instituting peer mediation desks and mandatory character counseling encourages transgressors to take responsibility for their actions and make amends. Furthermore, Parent-Teacher Associations must establish termly parenting accountability workshops to ensure that home discipline reinforces school regulations. Discipline is the bridge between educational dreams and actual achievement; let us rebuild it together.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Debate: Technical Education vs. Grammar Education (Supporting Technical)
  {
    id: "B9_S4_E_A_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Debate Speech",
    title: "Technical and Vocational Education Is More Essential Than Grammar Education",
    shortSummary: "Speak in support of the motion that technical and vocational education is more beneficial for national development.",
    prompt: "You are the principal speaker in an inter-schools debate competition on the motion: 'Technical and Vocational Education Is More Essential for Ghana's Development Than General Grammar Education.' Write your debate speech in support of the motion, presenting at least two compelling arguments regarding youth employment and industrial fabrication, while refuting opposing views.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B9.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on self-employment and industrial manufacturing. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that Technical and Vocational Education is far more essential for Ghana's development than General Grammar Education.",
        prohibitedOpenings: ["Good morning to you all", "I am here to tell you"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Eradicating Youth Unemployment -> Driving Industrial Fabrication -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with unyielding conviction today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Eradicating Youth Unemployment", guidingQuestion: "Explain how technical and vocational training equips youth with practical self-employment skills (carpentry, electricals, coding).", transitionHints: ["First and foremost, Africa's greatest developmental crisis is graduate youth unemployment...", "While grammar schools produce millions of graduates clutching paper certificates chasing non-existent clerical jobs, vocational education trains..."] },
          { stageIndex: 3, role: "Second Argument: Driving Industrialization & Fabrication", guidingQuestion: "Contrast theoretical academic book knowledge with the hands-on engineering that builds infrastructure.", transitionHints: ["Secondly, no nation in history has ever developed solely by reading textbooks...", "It is plumbers, masons, welders, and electrical technicians who construct highways, hospitals, and manufacturing factories..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims that vocational training is for academic failures, deliver an inspiring closing appeal, and say thank you.", transitionHints: ["My worthy opponents will surely claim that vocational education is for academically weak students; however, this outdated prejudice collapses because...", "With these undeniable truths, I urge you all to vote resoundingly for the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Hands that build are nobler than tongues that speak.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Youth unemployment eradication argument developed cogently (4 marks)", "Industrialization evidence and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Technical and Vocational Education Is More Essential for Ghana's Development Than General Grammar Education.\"\n\nFirst and foremost, consider our nation's greatest developmental crisis: graduate unemployment. For decades, our grammar-heavy education system has produced millions of secondary and tertiary graduates armed with paper certificates in Latin, literature, and general arts, roaming the streets chasing non-existent clerical desk jobs. In contrast, technical and vocational education equips learners with practical, market-ready skills: carpentry, masonry, automotive engineering, electrical installation, and digital fabrication. A vocational graduate does not walk the streets with a curriculum vitae begging for employment; they establish workshops, generate self-employment, and hire others. Which system solves poverty faster?\n\nSecondly, industrialization is impossible without technical craftsmanship. No country in human history ever developed by memorizing abstract theories. It is civil technicians, plumbers, welders, and precision mechanics who construct bridges, maintain agricultural machinery, install solar power systems, and build manufacturing factories. When a national hospital's surgical oxygen plant breaks down, we do not summon a grammar scholar to recite poetry; we desperately search for a biomedical technician! Technical hands build the nation's physical infrastructure.\n\nMy worthy opponents have argued passionately that grammar education produces administrators, lawyers, and political leaders. While governance is important, administrators can only manage wealth that technical producers have created. Furthermore, modern technical education integrates mathematics, computer programming, and physics, proving that vocational training demands formidable intellect, not academic inferiority.\n\nMr. Chairman, Germany and Japan built global economic empires on the back of technical apprenticeship. Let us abandon colonial clerk-training and empower Ghanaian youth with practical technical skills. Vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Narrative: Illustrating 'Do Not Put All Your Eggs in One Basket'
  {
    id: "B9_S4_E_A_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Narrative Essay",
    title: "The Ruined Farm Venture",
    shortSummary: "Write a narrative story illustrating the proverb: 'Do not put all your eggs in one basket.'",
    prompt: "Write a story that illustrates the proverb: 'Do not put all your eggs in one basket.' Narrate how an ambitious young farmer invested all his family savings and borrowed loans into a single perishable crop venture, only for an unexpected pest infestation to wipe out his entire harvest, teaching him the value of diversification.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Enterprise Arc, Agricultural Disaster Pacing & Organic Proverb Integration",
    learningCompetency: "B9.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through economic risk, dramatic disaster pacing, and moral resolution.",
    hint: "Show the farmer's ambition and refusal to diversify his investments. Describe the devastating pest invasion, the loss of everything, and the moral realization.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Ruin of Reckless Speculation",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing agricultural venture, warning disregarded, crop blight crisis, and moral synthesis.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Agricultural Ambition", guidingQuestion: "Introduce ambitious young farmer Kwadwo in the agrarian district of Akomadan.", transitionHints: ["In the fertile tomato-growing valleys of Akomadan, twenty-year-old Kwadwo was eager to amass quick wealth...", "Having saved five thousand cedis from three years of farming labor, he decided to embark on a massive farming project..."] },
          { stageIndex: 2, role: "Inciting Incident & Disregarded Advice", guidingQuestion: "Describe Kwadwo investing all his savings and loan money into ten acres of perishable tomatoes, ignoring an elder's advice to diversify with cassava.", transitionHints: ["An elder farmer advised him to divide his capital between tomatoes, drought-resistant cassava, and maize...", "\"Cassava profits are too slow,\" Kwadwo scoffed, sinking every pesewa into ten acres of exotic hybrid tomatoes..."] },
          { stageIndex: 3, role: "Rising Action & Devastating Blight", guidingQuestion: "Narrate the sudden outbreak of bacterial leaf blight and armyworms that decimated the tomato field overnight.", transitionHints: ["Just as the tomato plants began fruiting with heavy green clusters, catastrophe struck without warning...", "A devastating fungal blight swept through the valley, turning the vibrant green fields into blackened, rotten slime..."] },
          { stageIndex: 4, role: "Climax, Ruin & Proverbial Realization", guidingQuestion: "Describe standing in the ruined field penniless and learning the lesson of diversification.", transitionHints: ["Within forty-eight hours, ten acres of crops were completely wiped out, leaving him with mounting bank debts...", "Staring at the blackened field, he realized the wisdom of his elder's ignored counsel: never put all your eggs in one basket..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Moral Synthesis",
        proverbOrClosingPhrase: "Do not put all your eggs in one basket.",
        integrationRule: "Embed the proverb into Kwadwo's final realization while surveying his ruined farm."
      }
    },
    rubric: createWAECRubric(
      ["Agricultural ambition and setting established (2 marks)", "Disregarded elder advice and total single-crop investment depicted vividly (4 marks)", "Devastating blight disaster, financial ruin, and organic proverb integration (4 marks)"],
      ["Character context clear", "Blight crisis vivid and kinetic", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and botanical adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Ruin of Reckless Speculation\n__________________________________\n\nIn the fertile valleys of Akomadan, twenty-year-old Kwadwo was recognized as the most ambitious young farmer in the district. Having saved six thousand cedis from three years of hard labor as a farm laborer, he was impatient to transform himself into an agricultural commercial tycoon. When the major planting season arrived, he secured a matching loan from a rural cooperative bank to acquire ten acres of land.\n\nHis uncle, an experienced elder farmer, offered wise counsel: \"Kwadwo, split your capital. Plant four acres of tomatoes, but dedicate the rest to hardy cassava and maize so you have a financial shield if the rains fail.\" Kwadwo scoffed at the caution. \"Cassava takes twelve months to yield modest profits,\" he replied arrogantly. \"Tomatoes harvest in ninety days with triple returns!\" Convinced of his own genius, Kwadwo sank every pesewa into exotic hybrid tomato seeds, expensive synthetic fertilizers, and drip hoses, leaving himself without a single cedi in reserve.\n\nInitially, the gamble appeared triumphant. Ten acres flourished under the sun, a lush green sea of plants loaded with clusters of heavy green tomatoes. Then, catastrophe struck. Just two weeks before the harvest, an unseasonable heatwave was followed by warm, torrential humidity. A devastating outbreak of bacterial wilt and armyworms attacked the plantation. Within forty-eight hours, the vibrant green stems collapsed into blackened, rotten slime. Desperate applications of chemical pesticides proved useless as the blight consumed the entire crop.\n\nStanding in the center of the foul-smelling, ruined field with tears streaming down his face, Kwadwo surveyed his total financial ruin. His entire capital was gone, and creditors were threatening to seize his motorcycle. His uncle's warning rang in his ears with painful clarity. He had learned the bitter cost of reckless speculation: never put all your eggs in one basket.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Descriptive: The Tense Atmosphere of an Emergency Hospital Ward
  {
    id: "B9_S4_E_A_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Descriptive Essay",
    title: "Shadows and Sirens in the Midnight Ward",
    shortSummary: "Write a descriptive essay recreating the tense sights, sounds, and smells of a hospital casualty ward at midnight.",
    prompt: "While caring for a hospitalized sibling, you spent an unforgettable night in the casualty and emergency ward of a busy municipal hospital. Write a descriptive essay capturing the sterile chemical smells, the rhythmic beep of heart monitors, the hurried footsteps of medical staff, and the atmosphere of human vulnerability.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Atmospheric Sensory Description, Medical Ward Imagery & Spatial Pacing",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions recreating institutional environments through multi-sensory registers, emotional nuance, and spatial coherence.",
    hint: "Use spatial progression: the sterile reception area at midnight, entering the dimly lit ward, the sensory cacophony of medical devices and hushed whispers, and the arrival of an emergency ambulance.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Shadows and Sirens in the Midnight Ward",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory depiction of a hospital emergency ward at midnight.",
        stagePrompts: [
          { stageIndex: 1, role: "Arrival in the Midnight Ward", guidingQuestion: "Set the scene at midnight inside the casualty ward of the municipal hospital.", transitionHints: ["The midnight air inside the casualty ward of Suntreso Hospital was thick with tension...", "Fluorescent tubes hummed overhead with a pale, cold glare that bleached all warmth from the walls..."] },
          { stageIndex: 2, role: "The Olfactory & Auditory Symphony", guidingQuestion: "Describe the sharp smell of antiseptic and alcohol, mingled with the rhythmic beeps of monitors and muffled groans.", transitionHints: ["The air was saturated with the sharp, clinical odor of methylated spirit and chlorine disinfectant...", "The acoustic landscape was dominated by the persistent electronic pulse of cardiac monitors, accompanied by..."] },
          { stageIndex: 3, role: "The Medical Drama & Human Fragility", guidingQuestion: "Depict the hurried rubber-soled footsteps of nurses in white scrubs tending to intravenous drips.", transitionHints: ["Between the drawn sea-green curtains, a relentless drama of human survival unfolded...", "Nurses in crisp white scrubs moved with swift, practiced efficiency, adjusting transparent plastic drip tubes..."] },
          { stageIndex: 4, role: "The Dawn Respite & Emotional Reflection", guidingQuestion: "Describe the arrival of morning light through the high louvres and reflect on the heroic resilience of medical workers.", transitionHints: ["When the first gray fingers of dawn filtered through the frosted louvres, the frantic rhythm eased...", "Sitting beside my sleeping brother's bed, I felt profound reverence for the dedicated men and women who hold the line between life and death..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Reflective Synthesis",
        proverbOrClosingPhrase: "Human compassion is the truest medicine in times of vulnerability.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating clinical devotion and human resilience."
      }
    },
    rubric: createWAECRubric(
      ["Hospital emergency setting and midnight atmosphere established (2 marks)", "Antiseptic smell and electronic auditory cues conveyed vividly (4 marks)", "Medical staff action, human fragility, and dawn reflection depicted (4 marks)"],
      ["Ward setting vivid", "Sensory cues (smell, sound, sight) rich", "Emotional nuance conveyed clearly"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich clinical and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `Shadows and Sirens in the Midnight Ward\n_________________________________________\n\nThe midnight air inside the casualty and emergency ward of the municipal hospital was thick with tension, anxiety, and the fragile rhythm of human life. Overhead, long fluorescent bulbs hummed with a cold, pale glare that cast harsh shadows across the rows of metal hospital cots, bleaching all warmth from the lime-green walls.\n\nThe sensory landscape was intensely clinical. A pungent cocktail of methylated spirit, iodine, chlorine disinfectant, and industrial floor wax saturated the air, stinging the nostrils with every breath. Beneath this chemical curtain, the auditory symphony of the ward never ceased. Electronic heart monitors pulsed with steady, rhythmic beeps that tracked the fragile heartbeats of critically ill patients. Muffled moans of pain rose intermittently from behind drawn plastic curtains, harmonizing with the persistent hiss of an oxygen cylinder delivering life to an asthmatic child.\n\nA ceaseless drama of human devotion unfolded down the narrow linoleum corridor. Nurses in white scrubs glided swiftly on rubber-soled shoes, their eyes heavy with fatigue yet sharp with focus. They adjusted intravenous saline bags, checked dripping fluid regulators, and whispered comforting words to trembling relatives. Suddenly, the double glass doors burst open with a crash as paramedics wheeled in a stretcher bearing an accident victim, shouting vitals to doctors who rushed into action like a well-drilled army.\n\nWhen the first gray light of dawn finally seeped through the high frosted window louvres, the frantic chaos gradually subsided. Watching my younger brother's fever break as he slept peacefully under clean hospital sheets, I felt profound gratitude for the selfless healthcare workers whose vigilance turns midnight terror into morning hope.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Article for Publication: The Toll of Illegal Mining on Agriculture
  {
    id: "B9_S4_E_A_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Article for Publication",
    title: "The Destructive Toll of Illegal Mining on Agriculture",
    shortSummary: "Write an article for publication in a national newspaper on illegal mining destroying cocoa farms and water bodies.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'The Toll of Illegal Mining on Agriculture and Food Security.' Analyze how the destruction of fertile topsoil and the chemical contamination of irrigation rivers threaten national food supply, examine the loss of cocoa farmlands, and recommend two strict national solutions.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Agrarian Ecological Analysis & Legislative Policy Solutions",
    learningCompetency: "B9.4.2.1.2: Compose structured articles for publication analyzing the agrarian consequences of artisanal gold mining, food security risks, and environmental reclamation.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into problem analysis, economic/ecological fallout, and remedies.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "THE TOLL OF ILLEGAL MINING ON AGRICULTURE AND FOOD SECURITY",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Samuel Osei-Mensah, Basic 9A",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Topsoil and Cocoa Devastation -> Heavy Metal River Contamination -> Statutory Solutions).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and declare illegal mining as an existential threat to national food sovereignty.", transitionHints: ["Agriculture has long been celebrated as the backbone of Ghana's economy, yet...", "A catastrophic ecological menace—unregulated illegal gold mining, popularly known as 'galamsey'—is tearing through..."] },
          { stageIndex: 2, role: "Destruction of Fertile Cocoa Farmlands", guidingQuestion: "Analyze how excavators destroy ancient cocoa plantations and fertile arable topsoil for quick gold.", transitionHints: ["Thousands of acres of high-yielding cocoa plantations and fertile vegetable fields have been razed by excavators...", "Topsoil that took nature centuries to build is stripped away in hours, leaving behind toxic, lunar wastelands of..."] },
          { stageIndex: 3, role: "Heavy Metal Water Contamination", guidingQuestion: "Examine how mercury and lead in rivers contaminate irrigation water and enter the human food chain.", transitionHints: ["Equally devastating is the chemical poisoning of our freshwater rivers...", "The Pra, Birim, and Ankobra rivers, which once irrigated agricultural belts, now flow with lethal concentrations of mercury and cyanide..."] },
          { stageIndex: 4, role: "Statutory Enforcement & Call to Action", guidingQuestion: "Propose two actionable solutions (deploying military-drone border guards and confiscating excavators) and conclude with a patriotic appeal.", transitionHints: ["To preserve our nation from starvation, decisive statutory action must be enforced immediately...", "First, the government must deploy satellite drone surveillance to seize and destroy all excavators in farming belts..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & National Appeal",
        proverbOrClosingPhrase: "A nation that destroys its soil destroys itself.",
        integrationRule: "End with an inspiring appeal urging citizens and leaders to protect Ghana's agricultural heritage."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and food security threat established (2 marks)", "Destruction of cocoa lands and river contamination analyzed (4 marks)", "Two actionable enforcement solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Agricultural fallout detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive environmental and economic vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `THE TOLL OF ILLEGAL MINING ON AGRICULTURE AND FOOD SECURITY\nBy Samuel Osei-Mensah, Basic 9A\n\nAgriculture has long been celebrated as the lifeblood of Ghana's economy, employing millions of citizens and sustaining national food sovereignty. Yet, an unprecedented environmental catastrophe—unregulated artisanal gold mining, popularly known as 'galamsey'—is systematically tearing through our agrarian heartlands, threatening to turn our breadbasket regions into toxic, barren wastelands.\n\nThe destruction of fertile agricultural land is taking place at a terrifying pace. In the Ashanti, Western, and Eastern regions, fleets of commercial excavators and bulldozers have uprooted thousands of acres of mature, productive cocoa farms, oil palm plantations, and plantain fields. Topsoil rich in organic nutrients that took nature centuries to accumulate is stripped away in hours. In its place, illegal miners leave behind craggy craters, treacherous pits of stagnant water, and barren gravel where no crop can take root. The loss of cocoa acreage directly undermines national export revenues and impoverishes rural farming families.\n\nEven more catastrophic is the chemical contamination of agricultural water sources. Rivers such as the Pra, Offin, and Birim, which farmers depend upon for dry-season irrigation, have been transformed into thick mud slimes heavily poisoned with mercury, lead, and cyanide. When farmers use this toxic water to irrigate tomatoes, peppers, and leafy vegetables, these heavy metals enter the food chain, exposing millions of urban consumers to kidney failure, birth defects, and chronic cancers.\n\nTo avert an impending national famine, the state must take uncompromising action. The government must deploy drone surveillance and permanent security taskforces to confiscate and burn all heavy machinery operating in designated agricultural zones. Furthermore, traditional rulers who sell ancestral farmlands to mining syndicates must be held legally accountable. A nation that destroys its soil destroys its future; let us protect our fertile lands before it is too late.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Debate: Examinations Are Not the True Test of Ability (Supporting the Motion)
  {
    id: "B9_S4_E_A_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Debate Speech",
    title: "Examinations Are Not the True Test of a Student's Ability",
    shortSummary: "Speak in support of the motion that terminal written examinations fail to accurately measure true human intelligence.",
    prompt: "You are the principal speaker in an inter-schools debate competition on the motion: 'Formal Written Examinations Are Not the True Test of a Student's Ability.' Write your debate speech in support of the motion, presenting at least two compelling arguments regarding rote memorization and psychological anxiety, while refuting opposing views.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B9.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on memorization versus creativity, and test anxiety blinding brilliant minds. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that formal written examinations are not the true test of a student's ability.",
        prohibitedOpenings: ["Good morning to you all", "I am standing here to talk"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Rote Memorization vs. Practical Innovation -> Psychological Test Anxiety Distortion -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with unyielding intellectual conviction today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Rote Memorization vs. True Creativity", guidingQuestion: "Explain how written exams reward temporary cramming ('chew and pour') rather than original problem-solving.", transitionHints: ["First and foremost, traditional written examinations merely test temporary memory recall, not intelligence...", "Our educational system rewards students who cram textbooks the night before, regurgitate words onto answer scripts, and forget everything hours later..."] },
          { stageIndex: 3, role: "Second Argument: Psychological Exam Panic & Extenuating Factors", guidingQuestion: "Show how test anxiety, illness, and artificial time limits blind brilliant, practical minds.", transitionHints: ["Secondly, written examinations compress three years of a student's life into two arbitrary hours...", "A brilliant student suffering from malaria or an anxiety-induced memory blackout can fail an exam, while a dishonest pupil who smuggles notes excels..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims that examinations are objective, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will argue that examinations provide a standardized, objective yardstick; however, this claim collapses because...", "With these unassailable truths, I urge you all to vote for the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Intelligence is multifaceted and cannot be measured by a single two-hour paper.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Rote memorization critique developed cogently (4 marks)", "Test anxiety distortions and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Formal Written Examinations Are Not the True Test of a Student's Ability.\"\n\nFirst and foremost, written examinations reward superficial rote memorization rather than genuine intellectual competence. In our schools, examinations have popularized the toxic culture of 'chew, pour, pass, and forget.' A student with exceptional memory recall can cram definitions from a textbook the night before, regurgitate them onto an answer booklet, and score an 'A' without understanding the practical application of the concepts. Conversely, an inventive student who can repair complex electrical gadgets, design computer algorithms, or paint breathtaking artwork may struggle to write long theoretical essays within artificial time limits. Does a poor essay score mean that the practical genius lacks ability? Incontestably not!\n\nSecondly, written examinations are fundamentally flawed because they reduce three years of continuous learning to a stressful, high-stakes two-hour test. Human performance on any given day is influenced by numerous extenuating factors: sudden malaria, severe headache, family grief, or crippling examination panic. A brilliant, diligent pupil whose hands shake with anxiety during a mathematics paper may freeze and fail, while an average pupil who happened to review the exact five questions that appeared on the paper passes with distinction. How can a system that depends so heavily on circumstance and memory recall claim to be the true test of human potential?\n\nMy worthy opponents will argue that written examinations provide a standardized, objective yardstick for academic grading. While standardized tests may be convenient for educational administrators, convenience must never be confused with truth! Albert Einstein famously remarked that if you judge a fish by its ability to climb a tree, it will live its whole life believing it is stupid.\n\nMr. Chairman, true ability encompasses creativity, resilience, leadership, and practical problem-solving—qualities that cannot be quantified by multiple-choice options or essay questions. I urge this house to vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Narrative: A Daring Rescue During a River Crossing
  {
    id: "B9_S4_E_A_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Narrative Essay",
    title: "Saved from the Raging Torrent",
    shortSummary: "Write a narrative story recounting the heroic rescue of a classmate swept away by a flooded river.",
    prompt: "A sudden rainstorm swelled the local river while you and your classmates were walking home from school. One of your friends slipped from a narrow log bridge into the rushing current. Write a narrative essay recounting the terrifying accident, the courageous rescue operation, and the relief of saving his life.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Dramatic Action Pacing, Suspenseful Climax & Crisis Resolution",
    learningCompetency: "B9.4.2.1.1: Compose suspenseful narrative stories depicting environmental danger, heroic teamwork, and emotional relief.",
    hint: "Build up the torrential rain and the dangerous swollen river. Describe the slip from the log bridge, the panic of watching him drift, the quick thinking with a bamboo pole, and the emotional rescue.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Saved from the Raging Torrent",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing flooded river setting, fatal slip, daring bamboo rescue, and emotional aftermath.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Flooded River", guidingQuestion: "Describe the afternoon torrential downpour that transformed the placid stream into a raging muddy torrent.", transitionHints: ["Following two hours of torrential afternoon rain in Asamang...", "Our walk home from school was halted by the roaring Subin stream, which had burst its banks..."] },
          { stageIndex: 2, role: "Inciting Incident: The Slip from the Log Bridge", guidingQuestion: "Describe crossing the slippery single-log bridge and a classmate slipping into the churning water.", transitionHints: ["The only crossing was a slippery, moss-covered mahogany log spanning the gorge...", "Ten-year-old Kwesi took a nervous step, his wet sandals slipped on the slimy bark, and with a piercing shriek..."] },
          { stageIndex: 3, role: "Rising Action & Daring Bamboo Rescue", guidingQuestion: "Narrate Kwesi being dragged toward the rocky rapids and your team extending a heavy bamboo pole.", transitionHints: ["The turbulent muddy current swept Kwesi away like a dry leaf, dragging him toward the deadly rapids...", "Thinking frantically, our class captain, Yaw, and I seized a long, thick bamboo pole from a nearby thicket..."] },
          { stageIndex: 4, role: "Climax, Rescue & Emotional Denouement", guidingQuestion: "Describe Kwesi grabbing the pole, pulling him out gasping for air, and returning home safely.", transitionHints: ["With a desperate lunge, Kwesi's fingers locked around the bamboo end as we hauled him against the fierce current...", "Dragging him onto the grassy embankment, bruised and coughing muddy water, tears of profound relief broke out..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Heroic Reflection",
        proverbOrClosingPhrase: "Courage and presence of mind turn disaster into deliverance.",
        integrationRule: "Conclude with an emotional synthesis celebrating quick thinking and mutual loyalty."
      }
    },
    rubric: createWAECRubric(
      ["Flooded stream and dangerous log bridge established (2 marks)", "Slipping accident and terrifying drift toward rapids depicted vividly (4 marks)", "Daring bamboo pole rescue and emotional relief conveyed (4 marks)"],
      ["River setting established", "Accident and rescue vivid and kinetic", "Emotional relief clear"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative perspective (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Dynamic action verbs and water imagery (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and emotional adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `Saved from the Raging Torrent\n____________________________\n\nFollowing three hours of unrelenting afternoon rain, the peaceful Subin stream in Asamang was transformed into a violent, churning torrent of muddy brown water. Walking home from school with my classmates, we found the normal footpath completely submerged. The only crossing was an ancient, slippery mahogany tree trunk that served as a makeshift footbridge across the swollen channel, four meters above the churning current.\n\nOur class took turns inching across the wet log with great caution. Disaster struck when ten-year-old Kwesi stepped onto the center span. His wet plastic sandals lost traction on the slimy bark. With a piercing shriek of terror, Kwesi slipped, tumbled through the air, and plunged into the churning torrent with a loud splash.\n\nHorror paralyzed us for a heartbeat as Kwesi's head bobbed to the surface, gasping for air. The fierce current was dragging him downstream toward the jagged boulders of the gorge. \"Help me! I cannot swim!\" he screamed before muddy water engulfed his face again. Thinking with frantic speed, our class captain, Yaw, and I spotted a long, sturdy bamboo pole that fishermen had left in the elephant grass. We hauled the heavy stalk to the bank, leaned over the water's edge, and thrust the tapered end directly into Kwesi's path, shouting for him to grab it.\n\nWith a desperate, thrashing lunge, Kwesi's fingers clamped around the bamboo stalk. Bracing our feet into the muddy embankment, Yaw and I pulled with every ounce of muscle in our bodies against the raging river. Inch by agonizing inch, we dragged him against the powerful current toward the shore until other classmates gripped his wrists and hoisted his trembling body onto the grass. Coughing out mouthfuls of muddy water, bruised and shivering, Kwesi sobbed into our arms. We had pulled our brother back from the edge of death.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Descriptive: The Bustle of a Night Food Market
  {
    id: "B9_S4_E_A_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "advanced",
    category: "Descriptive Essay",
    title: "A Symphony of Flavors Under the Night Sky",
    shortSummary: "Write a descriptive essay capturing the sights, culinary smells, and energy of an urban night market.",
    prompt: "An urban night street food market is a vibrant cultural tapestry of smoke, lights, sizzle, and aroma. Write a descriptive essay capturing the sensory atmosphere of a popular night food market in your town, vividly recreating the glowing charcoal stoves, the sizzling street delicacies, the lively banter of food vendors, and the mouth-watering aromas filling the cool night air.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Culinary Sensory Imagery, Auditory Street Banter & Nocturnal Visual Contrast",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions capturing nocturnal urban street commerce through rich olfactory, gustatory, and auditory sensory registers.",
    hint: "Use spatial progression: entering the brightly lit food street, passing the glowing charcoal grills with sizzling khebab, observing the bubbling pots of waakye, and soaking in the vibrant nighttime commerce.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "A Symphony of Flavors Under the Night Sky",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory journey through a bustling urban night street food market.",
        stagePrompts: [
          { stageIndex: 1, role: "Entering the Night Market", guidingQuestion: "Set the scene at dusk as the street transforms into a corridor of glowing lanterns, smoke, and appetizing smells.", transitionHints: ["As twilight settles over the commercial heart of Osu, the quiet street transforms into...", "Dozens of roadside vendors ignite glowing charcoal braziers, illuminating the night with..."] },
          { stageIndex: 2, role: "The Sizzle and Smoke of the Grills", guidingQuestion: "Describe the sizzling skewers of beef khebab dusted with spicy peanut powder (suya) over fiery coals.", transitionHints: ["The air is saturated with the mouth-watering fragrance of roasted beef skewers and spicy seasonings...", "Sparks erupt like miniature fireworks whenever the khebab vendor fans the glowing coals with cardboard..."] },
          { stageIndex: 3, role: "The Symphony of Pots and Street Banter", guidingQuestion: "Depict the clanging metal spoons, bubbling cauldrons of waakye and spicy shito, and shouting customers.", transitionHints: ["Further down the corridor, the culinary rhythm intensifies...", "Enormous aluminum pots of steaming waakye are ladled out while vendors banter loudly with hungry patrons..."] },
          { stageIndex: 4, role: "Tasting the Delicacies & Cultural Reflection", guidingQuestion: "Describe savoring hot fried plantains and spicy fish, reflecting on the community warmth of street food culture.", transitionHints: ["Biting into a piping-hot, golden-fried ripe plantain seasoned with crushed ginger...", "Sitting under the open night sky among smiling faces, I felt the unmistakable warmth of our culinary heritage..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Cultural Synthesis",
        proverbOrClosingPhrase: "Food enjoyed together is the sweetest bond of community.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating Ghanaian street cuisine and community warmth."
      }
    },
    rubric: createWAECRubric(
      ["Night market setting and dusk illumination established (2 marks)", "Sizzling khebab grills and spicy aromas conveyed vividly (4 marks)", "Street food banter, culinary tastes, and communal warmth captured (4 marks)"],
      ["Night street setting vivid", "Sensory cues (smell, taste, sound) rich", "Culinary culture captured"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich culinary and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `A Symphony of Flavors Under the Night Sky\n_________________________________________\n\nAs twilight settles over the commercial avenues of Osu, the quiet street awakens into a vibrant nocturnal carnival of light, smoke, and mouth-watering aroma. What was an ordinary parking lane during daylight hours transforms into a buzzing open-air corridor of culinary delight, welcoming exhausted office workers, students, and neighborhood families seeking evening sustenance.\n\nThe visual and olfactory atmosphere is intoxicating. Scores of roadside vendors ignite charcoal braziers, filling the cool night air with aromatic clouds of woodsmoke and roasting spices. Skewers of marinated beef khebab sizzle over fiery red coals, their melting fat hissing as it drips onto the embers. Whenever the vendor fans the coals with a piece of stiff cardboard, a golden shower of sparks erupts into the darkness like miniature fireworks, while the rich, nutty fragrance of crushed groundnut powder (kuli-kuli) and hot cayenne pepper draws hungry crowds in droves.\n\nThe acoustic rhythm of the market is a lively urban symphony. Massive metal ladles clang rhythmically against aluminum cauldrons as women serve steaming portions of dark purple waakye, garnished with glistening strands of spaghetti, fried plantains, and rich, black shito pepper sauce. Above the hiss of boiling frying oil and the crackle of firewood, the melodic banter of food vendors bartering with customers mingles with the cheerful laughter of patrons perched on wooden benches.\n\nBiting into a piping-hot slice of kelewele—ripe fried plantain cubes marinated in crushed ginger, cloves, and chili—a burst of sweet and fiery warmth dances across the tongue. Sitting beneath the starlit sky, surrounded by laughter, glowing charcoal embers, and familiar flavors, I was reminded that street food is not merely nourishment; it is the delicious, beating heart of Ghanaian community life.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B9AdvancedClean() {
  console.log("Building clean 60-item Strand 4 B9 Advanced Practice Lab...");
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
      id: `B9_S4_E_A_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B9",
      difficulty: "advanced",
      category: "Composition & Rhetoric Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n"${item.passage}"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: item.answer, // Matches exact string value in finalOptions[targetPos]
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B9.4.2.1: Demonstrate advanced mastery of narrative plot structures, sensory travelogue descriptions, article headline-byline rules, and parliamentary debate mechanics."
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
    level: "B9",
    difficulty: "advanced",
    title: "Basic 9 Advanced Writing Lab: 50 Objective Rhetoric Drills + 10 Theory Extended Compositions",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B9_advanced`
    );
    await targetDoc.set(labPayload);
    console.log(`   ✅ Deployed Practice Lab: ${targetDoc.path}`);

    // 4. Synchronize into the main topical document practice pool (hard)
    for (const parentCol of parentCollections) {
      const mainTopicDoc = db.doc(
        `global_curriculum/jhs/subjects/english/${parentCol}/${docId}`
      );

      await mainTopicDoc.set({
        levels: {
          b9: {
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all60Items.length} items to B9 Advanced Practice Labs!`);
}

deployStrand4B9AdvancedClean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 4 B9 Advanced Clean 60 Lab:", err);
    process.exit(1);
  });

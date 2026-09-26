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
  difficulty: "intermediate";
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
  difficulty: "intermediate";
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
// Basic 9 Intermediate Focus:
// BECE Level Assessment on Dialectical Reasoning, Organic Proverb Synthesis,
// Advanced Sensory Framing, Headline-Byline Orthography & Debate Rebuttals
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
// Basic 9 Intermediate Scaffolds & Model Compositions (~250 words each)
// Covering: Narrative Moral Stories, Sensory Travelogues, Articles & Debates
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Narrative: Illustrating 'An Empty Barrel Makes the Most Noise'
  {
    id: "B9_S4_E_I_T_01",
    section: "theory",
    questionNumber: 51,
    theoryIndex: 1,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Narrative Essay",
    title: "The Boastful Prodigy",
    shortSummary: "Write a narrative story illustrating the proverb: 'An empty barrel makes the most noise.'",
    prompt: "Write a story that illustrates the truth of the proverb: 'An empty barrel makes the most noise.' Narrate how an arrogant student boasted incessantly about his academic brilliance and ridiculed his quiet peers, only to freeze in panic and fail miserably during the final national selection examination.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Hubris Arc, Examination Conflict Pacing & Organic Proverb Integration",
    learningCompetency: "B9.4.2.1.1: Compose coherent narrative compositions illustrating moral proverbs through contrasting character choices, rising adversity, and ethical resolution.",
    hint: "Establish the student's boastful rhetoric versus his quiet peers' diligent study. Describe the tense examination hall climax, his shocking failure, and the moral realization.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Downfall of Loud Boasting",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing boastful arrogance, neglected preparation, examination panic, and moral awakening.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Boastful Rhetoric", guidingQuestion: "Introduce fifteen-year-old Kwesi, who constantly bragged about his superior intelligence while ridiculing quiet classmates.", transitionHints: ["In the bustling corridors of St. Luke's Junior High School in Cape Coast...", "Fifteen-year-old Kwesi was notorious for his loud tongue and insufferable arrogance, constantly belittling peers..."] },
          { stageIndex: 2, role: "Inciting Incident & Mocking Diligent Study", guidingQuestion: "Describe Kwesi openly mocking a quiet peer study group preparing for the national science quiz.", transitionHints: ["When the final trial mock examinations approached, quiet classmates formed an afternoon study syndicate...", "\"Only dullards and empty heads sweat over past questions in study groups,\" Kwesi scoffed loudly, boasting that he could score straight ones without studying..."] },
          { stageIndex: 3, role: "Rising Action & The Examination Panic", guidingQuestion: "Narrate the examination hall scene where Kwesi froze in terror before practical questions, while quiet peers wrote confidently.", transitionHints: ["Inside the silent examination hall, the unsealed papers demanded deep analytical proofs and practical calculations...", "Staring at the questions, Kwesi's palms turned cold with sweat as panic seized his throat; his memorized slogans were completely useless..."] },
          { stageIndex: 4, role: "Climax, Assembly Humiliation & Proverbial Realization", guidingQuestion: "Describe the Headmaster reading the results, the quiet students sweeping the awards, and Kwesi realizing the proverb in tears.", transitionHints: ["When the certified results were published on the school notice board...", "Surrounded by his whispering peers while the quiet students he ridiculed took the top honors, Kwesi wept in humiliation, proving: an empty barrel makes the most noise..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Resolution & Moral Aphorism",
        proverbOrClosingPhrase: "An empty barrel makes the most noise.",
        integrationRule: "Embed the proverb organically into Kwesi's final realization before the school notice board."
      }
    },
    rubric: createWAECRubric(
      ["Boastful character and academic setting established (2 marks)", "Mocking of diligent study group and examination panic depicted vividly (4 marks)", "Notice board humiliation, failure, and organic proverb integration (4 marks)"],
      ["Character context clear", "Panic in exam hall depicted vividly", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and psychological adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Downfall of Loud Boasting\n_____________________________\n\nIn the bustling corridors of St. Luke's Junior High School in Cape Coast, fifteen-year-old Kwesi was notorious for his loud voice and insufferable arrogance. Blessed with superficial verbal fluency, he loved dominating discussions, constantly belittling his classmates and declaring that true genius required no hard work. Whenever test scores were returned, Kwesi bragged about his modest marks, loudly mocking quieter students whose grades did not match his boastful standards.\n\nAs the crucial national science and mathematics selection examination approached, his quiet desk-mate, Emmanuel, organized an afternoon study syndicate. Together with four disciplined peers, Emmanuel spent three hours every evening solving challenging past WAEC papers and reviewing experimental biology setups. Kwesi scoffed at their dedication with open disdain. \"Study groups are pathetic crutches for dullards who lack natural intellect,\" he announced loudly across the veranda. \"A brilliant mind like mine does not need to sweat over dusty books; I could pass this exam with my eyes closed!\"\n\nThe day of reckoning arrived in the quiet hall. When the invigilator commanded candidates to turn over their papers, a cold wave of terror struck Kwesi's chest. The examination was set on the revised Common Core curriculum, demanding rigorous step-by-step mathematical deductions, botanical experimental diagrams, and chemical equations. Kwesi's memorized catchphrases were completely useless. Around him, Emmanuel and his study group wrote with steady, calm focus, while Kwesi's trembling fingers dropped his pen. His mind was a suffocating blank, and tears of panic blurred his vision as the final countdown clock ran out.\n\nTwo weeks later, the certified merit list was pinned to the central notice board. Crowds of students gathered to cheer Emmanuel and his quiet study partners, who had swept the top five positions in the district. Near the bottom of the list, marked in red ink, was Kwesi's name—he had failed dismally. Standing in the back row, burning with humiliation as his former victims walked past in quiet dignity, Kwesi understood the bitter truth at last. Truly, an empty barrel makes the most noise.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Descriptive: A Memorable Visit to the Shai Hills Resource Reserve
  {
    id: "B9_S4_E_I_T_02",
    section: "theory",
    questionNumber: 52,
    theoryIndex: 2,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Descriptive Essay",
    title: "Granite Hills and Baboon Troops",
    shortSummary: "Write a descriptive travelogue capturing the rocky hills, wildlife encounters, and savannah vistas of Shai Hills.",
    prompt: "Your class embarked on an educational field trip to the Shai Hills Resource Reserve in the Greater Accra Region. Write a descriptive essay recreating the rugged granite inselbergs, the playful baboon troops greeting visitors, the ancient ancestral caves, and the sweeping savannah vistas.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Spatial Geological Progression, Wildlife Sensory Imagery & Historical Atmosphere",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions recreating natural reserves through spatial elevation, tactile and auditory registers, and evocative aesthetic reflection.",
    hint: "Use spatial progression: arriving at the sunlit reserve gates, encountering the noisy baboon troops, climbing the craggy granite inselberg to the ancestral caves, and looking out over the golden savannah plains.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Echoes Across the Granite Hills",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression from the reserve entrance plains up into the rocky granite inselbergs and ancient ancestral caves.",
        stagePrompts: [
          { stageIndex: 1, role: "Arrival on the Savannah Plain", guidingQuestion: "Describe arriving at the Shai Hills reserve gates under the bright morning sun as golden grassland meets granite hills.", transitionHints: ["Stepping off our excursion bus at the entrance of the Shai Hills Resource Reserve...", "A brisk morning breeze carried the dry, earthy scent of sun-cured savannah grass and wild acacia blossoms..."] },
          { stageIndex: 2, role: "The Baboon Troop Encounter (Auditory & Visual)", guidingQuestion: "Describe troops of olive baboons chattering, grooming each other, and boldly bounding across the tarmac.", transitionHints: ["Our arrival was heralded by a lively welcoming party of olive baboons...", "Mothers with tiny infants clinging to their bellies scampered across the rocks, while dominant males barked gruffly from..."] },
          { stageIndex: 3, role: "Ascent to the Ancestral Caves (Tactile & Geological)", guidingQuestion: "Depict scrambling up the steep, sun-baked granite boulders to the historic Shai ancestral caves.", transitionHints: ["The demanding climb up the craggy granite inselberg tested our endurance...", "Our fingers gripped sun-warmed, coarse rock faces as we navigated narrow crevices leading into the subterranean caves where..."] },
          { stageIndex: 4, role: "The Summit Vista & Cultural Reflection", guidingQuestion: "Describe emerging onto the windswept summit, gazing across the endless plains, and reflecting on ancestral history.", transitionHints: ["Emerging onto the sun-drenched summit plateau, a breathtaking panorama unfolded...", "Looking down across the boundless savannah stretching toward the distant ocean, I felt the living presence of Ghana's ancestral past..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Aesthetic Reflection",
        proverbOrClosingPhrase: "The granite hills stand as eternal witnesses to ancestral courage.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating Ghana's wildlife and ancestral heritage."
      }
    },
    rubric: createWAECRubric(
      ["Savannah landscape and reserve entrance established (2 marks)", "Baboon troop behavior and auditory chattering conveyed vividly (4 marks)", "Granite rock scramble, cave history, and summit panorama captured (4 marks)"],
      ["Reserve setting vivid", "Sensory cues (sight, sound, touch) rich", "Spatial progression clear"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich geological and wildlife vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `Echoes Across the Granite Hills\n_______________________________\n\nStepping off our school excursion bus at the gates of the Shai Hills Resource Reserve, a vast, sun-drenched landscape opened before our eyes. The crisp morning air was clean and dry, carrying the earthy fragrance of sun-cured savannah grasses and wild acacia blossoms. In the near distance, colossal granite inselbergs rose abruptly from the flat plains like ancient stone fortresses guarding the coastal savanna.\n\nOur arrival was immediately heralded by the reserve's most animated residents: a large troop of olive baboons. Dozens of these intelligent primates lounged along the low stone walls, barking in sharp, throaty greetings. Playful juveniles chased each other through the dry thorn bushes, tumbling and screeching, while attentive mothers with infants clinging securely to their chests groomed each other under the shade of neem trees. A massive alpha male, his silver-tipped fur glistening in the golden sunlight, sat atop a boulder with regal composure, watching our group with piercing amber eyes.\n\nThe demanding trek up the rocky flanks of the tallest inselberg to visit the ancient ancestral caves tested our physical endurance. Our hands gripped coarse, sun-baked granite crevices, feeling the rough, ancient texture of rocks that have endured millions of years of wind and rain. Entering the cool, shadowed cavern of the Sayu Caves, the blistering heat vanished. The air inside was cool, damp, and reverent. Our guide shone a lantern across the dark stone chambers, showing us grinding stones and clay pottery fragments left behind by the Shai ancestors who used these rocky sanctuaries as impregnable natural defensive fortresses during 19th-century colonial wars.\n\nEmerging onto the windswept summit plateau, an astonishing panorama took our breath away. Below us, the golden savannah stretched outward like an endless carpet, dotted with grazing antelopes and winding dirt tracks. Standing atop those ancient stone battlements, cooled by the ocean breeze, I felt an unforgettable connection to the resilient spirit of our ancestors.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Article for Publication: The Menace of High Energy Drinks Among Adolescents
  {
    id: "B9_S4_E_I_T_03",
    section: "theory",
    questionNumber: 53,
    theoryIndex: 3,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Article for Publication",
    title: "The Caffeine Trap: Energy Drinks Threatening Adolescent Health",
    shortSummary: "Write an article for publication in a national daily on the health hazards of high-caffeine energy drinks consumed by teenagers.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'The Hidden Dangers of High-Caffeine Energy Drinks Among School Pupils.' Analyze how aggressive marketing and cheap retail prices have fueled widespread consumption of energy drinks among basic school pupils, examine the severe medical risks (heart palpitations, insomnia, kidney stress), and propose two strict regulatory solutions by the Food and Drugs Authority.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Public Health Analysis & Statutory Regulatory Proposals",
    learningCompetency: "B9.4.2.1.2: Compose structured articles for publication analyzing public health hazards, adolescent commercial exploitation, and statutory food and drug policies.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, advertising drivers, medical hazards, and FDA regulatory solutions.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "THE HIDDEN DANGERS OF HIGH-CAFFEINE ENERGY DRINKS AMONG PUPILS",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Priscilla Nyamekye, Basic 9B",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Commercial Exploitation & Peer Culture -> Physiological & Medical Crises -> Statutory FDA Regulatory Enforcement).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and describe the alarming sight of basic school pupils guzzling cheap, high-caffeine energy drinks before morning sports.", transitionHints: ["Walk around any basic school sports arena or neighborhood corner shop today...", "A disturbing public health time bomb is ticking as school children barely thirteen years old consume brightly colored, highly caffeinated energy drinks..."] },
          { stageIndex: 2, role: "Commercial Marketing & Cheap Pricing", guidingQuestion: "Analyze how aggressive celebrity endorsements, seductive slogans, and cheap prices lure uninformed teenagers.", transitionHints: ["The exponential rise in teenage consumption is driven by predatory commercial marketing...", "Promoted by popular music icons as magical boosters of academic alertness and athletic stamina, these canned stimulants sell for less than five cedis..."] },
          { stageIndex: 3, role: "Physiological Medical Hazards", guidingQuestion: "Examine the medical fallout: cardiac arrhythmias, severe insomnia, anxiety, and long-term renal failure.", transitionHints: ["The clinical reality behind these sweet beverages is alarming...", "A single can contains toxic levels of caffeine and refined sugar equivalent to five cups of strong espresso, triggering violent heart palpitations and..."] },
          { stageIndex: 4, role: "FDA Statutory Enforcement & Call to Action", guidingQuestion: "Propose two actionable solutions (prohibiting sales to minors under eighteen and banning marketing near schools) with a call to action.", transitionHints: ["To safeguard our youth from preventable cardiovascular disease, the state must take decisive regulatory action...", "The Food and Drugs Authority (FDA) must immediately reclassify high-caffeine energy drinks, imposing an outright ban on sales to minors..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Public Health Appeal",
        proverbOrClosingPhrase: "The health of our youth is the sovereign foundation of our national future.",
        integrationRule: "End with an inspiring appeal urging health authorities and parents to protect children from commercial health hazards."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and energy drink consumption crisis established (2 marks)", "Predatory marketing and physiological medical hazards analyzed (4 marks)", "Two actionable FDA regulatory solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Health hazards detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive medical and regulatory vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `THE HIDDEN DANGERS OF HIGH-CAFFEINE ENERGY DRINKS AMONG PUPILS\nBy Priscilla Nyamekye, Basic 9B\n\nA visit to any junior high school sports competition, roadside corner kiosk, or neighborhood market reveals an alarming public health crisis: children barely thirteen years old guzzling brightly colored, canned energy drinks like ordinary soft sodas. What was once marketed strictly as a specialized endurance stimulant for adult athletes has been normalized into a daily beverage for school pupils, setting the stage for a pediatric health catastrophe.\n\nThis dangerous surge in consumption is driven by aggressive, unregulated commercial marketing and predatory pricing. Beverage manufacturers enlist popular musicians and sports celebrities to promote these drinks as magical elixirs that enhance examination memory, boost athletic stamina, and banish fatigue. Packaged in flashy aluminum cans with names evoking raw power and sold for as little as four cedis, these beverages are far cheaper than nutritious dairy milk or fresh fruit juice, making them easily accessible to pupils with pocket money.\n\nYet, the physiological consequences on young bodies are devastating. Medical specialists warn that a single serving of an energy drink contains caffeine concentrations equivalent to five cups of brewed coffee, combined with dangerously high doses of taurine and refined sugars. In developing adolescent bodies, this chemical overload triggers severe cardiac palpitations, elevated blood pressure, tremors, and chronic insomnia. Students who consume these stimulants to study late at night experience sudden daytime crashes, morning headaches, and extreme anxiety. In the long term, pediatric nephrologists warn that excessive consumption causes irreversible kidney damage and early-onset diabetes.\n\nTo avert a generation of chronically ill youth, the Food and Drugs Authority (FDA) must act with uncompromising urgency. First, the regulatory agency must mandate bold warning labels on all energy drinks and pass binding regulations prohibiting their sale to individuals under eighteen years of age. Second, municipal assemblies must ban the advertising and retail sale of energy drinks within a two-hundred-meter radius of all educational institutions. Our children's health is the sovereign foundation of Ghana's future; we must not permit commercial greed to sacrifice it on the altar of profit.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Debate: Science vs. Arts in National Development (Supporting Arts)
  {
    id: "B9_S4_E_I_T_04",
    section: "theory",
    questionNumber: 54,
    theoryIndex: 4,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Debate Speech",
    title: "The Arts Are More Vital to National Development Than Science",
    shortSummary: "Speak in support of the motion that the humanities, law, and arts contribute more to national development than science.",
    prompt: "You are the lead speaker in an inter-schools debate competition on the motion: 'The Humanities, Law, and the Arts Contribute More to Sustainable National Development Than Science and Technology.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding moral governance, constitutional law, and cultural identity, while refuting opposing claims on technology.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B9.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments showing that law, ethics, and governance provide the framework without which science turns destructive. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that the Humanities, Law, and the Arts contribute far more to sustainable national development than Science and Technology.",
        prohibitedOpenings: ["Good morning to you all", "I am here to tell you"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Moral Governance & Constitutional Law -> Cultural Identity & Creative Economy -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with unshakeable intellectual conviction today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Constitutional Law, Justice & Moral Governance", guidingQuestion: "Explain how law, political philosophy, and ethics provide the peace and stability without which scientific development is impossible.", transitionHints: ["First and foremost, what is the prerequisite for any scientific laboratory or engineering project?...", "It is constitutional law, human rights, and political justice—disciplines rooted squarely in the humanities—that maintain civic peace and prevent society from collapsing into anarchy..."] },
          { stageIndex: 3, role: "Second Argument: Cultural Identity, Tourism & Creative Economy", guidingQuestion: "Showcase how literature, music, history, and diplomacy generate massive tourism revenues and define national sovereignty.", transitionHints: ["Secondly, nations are not defined by machines; they are defined by their soul, culture, and creative heritage...", "The creative arts, historical tourism, and diplomatic international relations generate billions in national revenue while uniting..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on technology, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will boast proudly about computers, bridges, and medicines; however, this claim collapses because...", "With these unassailable truths, I urge you all to vote resoundingly in favor of the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Science gives humanity power, but the Arts give humanity wisdom.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Constitutional law and moral governance argument developed cogently (4 marks)", "Cultural creative economy and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"The Humanities, Law, and the Arts Contribute More to Sustainable National Development Than Science and Technology.\"\n\nFirst and foremost, consider the foundational prerequisite for any civilized progress: peace, justice, and good governance. A nation can boast of thousands of brilliant civil engineers and computer scientists, but if that society descends into civil war or dictatorship, its bridges will be bombed and its laboratories abandoned! It is the humanities—constitutional law, philosophy, political science, and jurisprudence—that create the peaceful democratic architecture under which all human life operates. It is lawyers who draft constitutions, judges who protect human rights, and diplomats who avert catastrophic wars. Without the moral and legal compass provided by the humanities, scientific power turns into an instrument of tyranny and destruction!\n\nSecondly, national identity and economic cohesion are forged through the creative arts and human culture. Nations are not celebrated for their mechanical gears; they are remembered for their moral soul, their literature, their music, and their heritage. Ghana's global prestige is elevated far more by our rich kente weaving, our highlife music, and our world-renowned literature than by imported microchips. Furthermore, the creative arts, historical tourism, and cultural festivals inject billions of cedis into our national economy annually, providing employment for millions of artisans, musicians, and historians.\n\nMy worthy opponents will boast proudly about surgical machines, airplanes, and digital computers. But let us unmask that illusion! Science tells us *how* to build something, but it is the arts, philosophy, and ethics that tell us *whether* it is morally right to build it! Science invented dynamite, nuclear weapons, and chemical warfare; it is the humanities that restrained mankind from blowing the planet to ashes. Science gives humanity power, but the Arts give humanity wisdom.\n\nMr. Chairman, machines serve humanity, but the arts define what it means to be human. I urge this entire house to vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Narrative: Illustrating 'A Stitch in Time Saves Nine' (BECE Mock Variant)
  {
    id: "B9_S4_E_I_T_05",
    section: "theory",
    questionNumber: 55,
    theoryIndex: 5,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Narrative Essay",
    title: "The Collapsed Ceiling",
    shortSummary: "Write a narrative story illustrating the proverb: 'A stitch in time saves nine.'",
    prompt: "Write a story that illustrates the truth of the proverb: 'A stitch in time saves nine.' Narrate how a school prefect neglected to report a small roof leak above the school library, only for a heavy torrential storm to cause the entire ceiling to collapse, destroying centuries of rare historical archives and costly computers.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Arc, Institutional Conflict Pacing & Organic Proverb Integration",
    learningCompetency: "B9.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through institutional responsibility, crisis escalation, and moral resolution.",
    hint: "Show the initial minor leak that would have taken ten minutes to fix. Describe the prefect's procrastination, the sudden violent storm, the collapse of the ceiling, and the bitter moral realization.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Ruin of Procrastination",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing neglected roof leak, procrastination, storm crisis, and library destruction.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & The Minor Leak", guidingQuestion: "Introduce Library Prefect Kwame noticing a minor water drip from the library roof above the rare books archive.", transitionHints: ["On a breezy Tuesday morning, Library Prefect Kwame noticed a tiny damp circle on the ceiling...", "A single rusty nail had dislodged on the corrugated zinc sheet, causing a slow, persistent drip into an enamel basin..."] },
          { stageIndex: 2, role: "Inciting Incident & Careless Procrastination", guidingQuestion: "Describe Kwame forgetting to notify the school carpenter because he was distracted by playing table tennis.", transitionHints: ["The school carpenter was working barely twenty meters away across the quadrangle...", "\"I will report it tomorrow; it is only a tiny drip,\" Kwame muttered to himself, rushing off to join an animated table tennis match..."] },
          { stageIndex: 3, role: "Rising Action & The Midnight Tempest", guidingQuestion: "Narrate the arrival of a violent midnight rainstorm that tore through the loosened roof sheet.", transitionHints: ["Catastrophe struck at midnight when a violent gale-force storm battered the coastal town...", "The fierce wind caught the loose zinc sheet, ripping it off the rafters and allowing torrential sheets of rain to hammer directly into..."] },
          { stageIndex: 4, role: "Climax, Ruin & Proverbial Realization", guidingQuestion: "Describe opening the library on Wednesday morning to find collapsed plasterboards, destroyed computers, and rare books turned to pulp.", transitionHints: ["Pushing open the heavy wooden double doors at dawn, horror paralyzed him...", "Staring at the waterlogged pulp of irreplaceable historical archives that twenty minutes of work could have saved, Kwame wept: a stitch in time saves nine..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Moral Synthesis",
        proverbOrClosingPhrase: "A stitch in time saves nine.",
        integrationRule: "Embed the proverb organically into Kwame's reflection while standing amid the ruined library books."
      }
    },
    rubric: createWAECRubric(
      ["Minor roof leak and prefectorial responsibility established (2 marks)", "Careless procrastination and violent midnight storm depicted vividly (4 marks)", "Collapsed ceiling, destroyed library archives, and organic proverb integration (4 marks)"],
      ["Setting established", "Procrastination shown", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and destructive adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Ruin of Procrastination\n___________________________\n\nOn a breezy Tuesday morning at Mfantsipim Basic School, Library Prefect Kwame noticed a small damp circle spreading across the ceiling boards directly above the rare historical archives and digital research computers. A single loose roofing nail had dislodged on the corrugated zinc sheets, allowing a slow, rhythmic drip of water to land inside an empty wastepaper basket. The school carpenter was working barely thirty meters away behind the dining hall, repairing benches.\n\nKwame intended to report the defect immediately. However, as he stepped outside, loud cheers from the table tennis pavilion caught his attention. His best friend had reached the finals of the inter-class championship. \"The leak is tiny,\" Kwame reasoned carelessly to himself. \"I will notify the carpenter tomorrow morning; a few drops of water cannot harm anything.\" Putting the problem completely out of his mind, he spent the rest of the day watching matches and chatting with friends.\n\nNature, however, showed no mercy for his procrastination. At midnight, a ferocious tropical tempest struck the coastal town of Cape Coast. Gale-force winds roared off the Atlantic, shrieking through the trees and ripping off weak branches. The violent gusts caught the loose, unfastened edge of the zinc roofing sheet, peeling it back like a tin can. For four uninterrupted hours, torrential sheets of rain hammered directly into the exposed ceiling cavity. Soaked with hundreds of gallons of water, the heavy plaster ceiling boards softened and gave way.\n\nWhen Kwame unlocked the library double doors the following morning, a scene of absolute devastation met his eyes. The entire ceiling had collapsed in a heap of soggy plaster, splintered rafters, and muddy sludge. Beneath the wreckage lay the school's ten newly donated desktop computers, their internal circuit boards fried by water. Even more heartbreaking was the destruction of century-old historical manuscripts, now reduced to an unreadable, sodden pulp. Standing in the pool of water, tears of bitter regret streaming down his face, Kwame knew that a single five-minute report to the carpenter could have saved thousands of cedis of school property. Truly, a stitch in time saves nine.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Descriptive: The Vibrant Energy of an Artisanal Gold Panning Site
  {
    id: "B9_S4_E_I_T_06",
    section: "theory",
    questionNumber: 56,
    theoryIndex: 6,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Descriptive Essay",
    title: "Mud and Metal: Life at an Artisanal Gold Mine",
    shortSummary: "Write a descriptive essay capturing the sights, sounds, and intense physical labor at an artisanal mining pit.",
    prompt: "During a geography field trip to the Offin River basin, your class observed an artisanal gold mining site from a safe observation hill. Write a descriptive essay recreating the muddy landscape, the roaring roar of diesel washing platforms, the strenuous physical labor of the miners, and the environmental scars on the river valley.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Environmental Sensory Description, Industrial Auditory Imagery & Spatial Landscapes",
    learningCompetency: "B9.4.2.2.1: Write descriptive essays recreating industrial-environmental sites through rich visual contrast, auditory cacophony, and ecological reflection.",
    hint: "Use spatial progression: the panoramic view from the observation ridge, the muddy crater pits below, the thundering roar of the washing machines, and the yellow contaminated river flowing away.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Scars in the Golden Valley",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression from the high observation ridge down into the mining pit and the contaminated riverbed.",
        stagePrompts: [
          { stageIndex: 1, role: "Ridge Panorama & The Scarred Valley", guidingQuestion: "Set the scene from the high observation ridge overlooking the devastated river valley.", transitionHints: ["Standing upon the high observation ridge overlooking the Offin River valley...", "What was once a lush corridor of virgin cocoa farms and towering mahogany trees was reduced to..."] },
          { stageIndex: 2, role: "The Auditory Cacophony of Machinery", guidingQuestion: "Describe the deafening roar of diesel-powered 'changfa' washing machines, clattering gravel, and shouts of laborers.", transitionHints: ["The acoustic landscape was an unrelenting industrial assault...", "Dozens of unmuffled diesel engines throbbed violently, driving heavy iron washing drums that rattled with..."] },
          { stageIndex: 3, role: "The Kinetic Human Labor (Visual & Tactile)", guidingQuestion: "Depict the bare-chested miners wading chest-deep in muddy sludge, hauling heavy sacks of alluvial gravel.", transitionHints: ["Down inside the gaping brown craters, human labor operated at its most exhausting intensity...", "Muscular young men, coated from head to toe in thick yellowish mud, hauled waterlogged buckets of gravel..."] },
          { stageIndex: 4, role: "The Contaminated River & Ecological Grief", guidingQuestion: "Describe the once-clear river flowing away as a thick, sluggish yellow slime, reflecting on environmental loss.", transitionHints: ["At the valley floor, the river itself told the saddest tale of devastation...", "The once-sparkling current of the historic Offin crawled past our feet as an opaque, yellowish-brown sludge, poisoned by human greed..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Ecological Reflection",
        proverbOrClosingPhrase: "Gold blinds the eyes to the death of the land.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating environmental preservation and mourning ecological destruction."
      }
    },
    rubric: createWAECRubric(
      ["Ridge observation setting and scarred valley panorama established (2 marks)", "Industrial acoustic roar and mechanical cacophony conveyed vividly (4 marks)", "Kinetic human labor, river sludge, and ecological grief depicted (4 marks)"],
      ["Valley setting vivid", "Sensory cues (sound, sight, texture) rich", "Ecological tone captured"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich industrial and ecological vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `Scars in the Golden Valley\n___________________________\n\nStanding upon the high observation ridge overlooking the historic Offin River basin, our geography class was confronted with a scene of staggering, apocalyptic devastation. What our textbooks described as an ancient, lush agricultural corridor of towering mahogany trees and fertile cocoa plantations had been transformed into an unearthly, scarred wasteland of raw clay craters, stagnant slime pools, and barren gravel mounds baking under the merciless midday sun.\n\nThe acoustic atmosphere was an overwhelming, violent industrial cacophony. From every corner of the valley, scores of unmuffled, two-stroke diesel engines throbbed with a deafening rhythm that vibrated through the rock under our shoes. Giant metal washing platforms—the notorious 'changfa' machines—clattered violently as revolving iron drums sifted riverbed gravel, spewing high-pressure jets of muddy water across slanted wooden sluice boards lined with green corduroy carpets to trap gold dust. The air hung heavy with the nauseating stench of scorched diesel exhaust, stale motor oil, and damp, decomposing silt.\n\nDown in the gaping mud pits, human labor operated at its most brutal, punishing intensity. Dozens of bare-chested young men, their skin encrusted from head to toe in drying yellowish clay, toiled under the blistering sun like figures sculpted from mud. Chest-deep in turbid water, their muscular shoulders strained as they hoisted heavy woven sacks of waterlogged gravel onto wooden ramps, their faces taut with exhausting physical exertion. Every few minutes, a miner used a plastic bowl to swirl toxic silvery mercury into a concentrate, oblivious to the poisonous fumes curling around his nostrils.\n\nAt the foot of the valley, the river itself offered the most heartbreaking sight. The historic Offin River, once a sparkling sanctuary of freshwater fish and clean drinking water, barely moved. It crawled past the craters as an opaque, thick soup of yellow-brown sludge, its banks stripped bare, its aquatic life extinguished. Looking out over that ruined landscape, I realized with sickening clarity that when human greed exchanges pristine rivers for handfuls of glittering dust, it is our own future that we bury in the mud.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Article for Publication: Promoting Technical and Vocational Training
  {
    id: "B9_S4_E_I_T_07",
    section: "theory",
    questionNumber: 57,
    theoryIndex: 7,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Article for Publication",
    title: "Rebranding Technical and Vocational Education for National Growth",
    shortSummary: "Write an article for publication in a national daily on overcoming prejudices against vocational education.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'Overcoming the Stigma Against Technical and Vocational Education in Ghana.' Examine the colonial prejudice that treats technical education as a reserve for academic failures, demonstrate how industrial economies like Germany thrive on skilled craftsmanship, and propose two national policy reforms to rebrand TVET institutions.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, TVET Policy Analysis & Socio-Economic Reform",
    learningCompetency: "B9.4.2.1.2: Compose structured articles for publication analyzing technical education stigmas, graduate employment dynamics, and national industrialization policies.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, colonial prejudices, economic necessity, and national rebranding solutions.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "OVERCOMING THE STIGMA AGAINST VOCATIONAL EDUCATION IN GHANA",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Christian Dzidula, Basic 9A",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Colonial Prejudice & Stigma -> The Industrial Imperative -> Strategic Rebranding & Funding).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and examine Ghana's paradox of massive graduate unemployment alongside a critical shortage of skilled technical artisans.", transitionHints: ["In Ghana today, an absurd economic paradox confronts our nation...", "While thousands of general arts graduates roam city streets clutching paper certificates in search of non-existent desk jobs, real estate developers struggle to find..."] },
          { stageIndex: 2, role: "The Colonial Legacy of Academic Snobbery", guidingQuestion: "Analyze the outdated colonial prejudice that views vocational training as a dumping ground for academically weak students.", transitionHints: ["The root of this crisis lies in an outdated colonial educational legacy...", "For decades, society conditioned parents to believe that true prestige lies solely in white-collar professions, treating technical schools as..."] },
          { stageIndex: 3, role: "The Industrial Economic Reality", guidingQuestion: "Contrast theoretical academic education with global industrial giants like Germany that built empires on technical apprenticeships.", transitionHints: ["Global economic history completely dismantles this snobbery...", "Industrial powerhouses like Germany, Japan, and South Korea did not build economic dominance through theoretical essays; their wealth was forged by..."] },
          { stageIndex: 4, role: "Strategic Rebranding & Policy Solutions", guidingQuestion: "Propose two actionable solutions (upgrading TVET laboratories with modern CNC/robotics tools and providing state startup toolkits) with a national call to action.", transitionHints: ["To unlock our industrial potential, Ghana must boldly rebrand technical education...", "The Ministry of Education must equip all technical institutes with cutting-edge digital tooling, while the state provides seed toolkits for..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & National Call",
        proverbOrClosingPhrase: "The hands that build the nation are the truest architects of its destiny.",
        integrationRule: "End with an inspiring appeal urging parents, students, and government to celebrate technical craftsmanship."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and graduate unemployment paradox established (2 marks)", "Colonial academic prejudice and industrial reality analyzed (4 marks)", "Two actionable TVET policy solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Socio-economic analysis detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive educational and economic vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `OVERCOMING THE STIGMA AGAINST VOCATIONAL EDUCATION IN GHANA\nBy Christian Dzidula, Basic 9A\n\nIn Ghana today, a baffling economic paradox plays out before our eyes. On one hand, thousands of university graduates with degrees in sociology, political science, and general humanities roam our urban streets, hopelessly distributing resumes for non-existent clerical desk jobs. On the other hand, construction firms, manufacturing plants, and automotive industries are forced to import expatriate welders, precision machinists, and electrical technicians because of an acute national shortage of certified artisans. This mismatch is the direct result of a toxic cultural prejudice against Technical and Vocational Education and Training (TVET).\n\nThe origins of this prejudice are rooted in our colonial educational legacy. For over a century, British colonial education trained African clerks and administrative interpreters to serve civil service bureaucracies, associating prestige with clean white collars and neckties. Consequently, Ghanaian society developed a snobbish mentality that views vocational training as a 'dumping ground' for students who failed academic examinations. Parents openly threaten underperforming children with enrollment in carpentry or tailoring schools as a form of punishment, entrenching the myth that working with one's hands is a badge of intellectual inferiority.\n\nYet, global economic reality thoroughly dismantles this outdated snobbery. Industrial powerhouses like Germany, South Korea, and Switzerland did not construct their world-dominating economies through grammar rote memorization. Their wealth was built upon robust dual-apprenticeship systems where technical professions are celebrated, highly paid, and recognized as the backbone of national productivity. In our own communities, an experienced automotive diagnostic specialist or certified plumber earns far more monthly income than a junior civil servant in an air-conditioned office!\n\nTo transform Ghana into a self-reliant industrial powerhouse, we must aggressively rebrand TVET. The Ministry of Education must modernize all technical and vocational secondary institutes with state-of-the-art computer-numerical-control (CNC) machines, 3D printers, and robotics laboratories. Furthermore, the government should institute a national 'Artisanal Seed Fund' providing graduate technicians with modern toolkits and interest-free startup capital upon graduation. The hands that build the nation are the truest architects of its destiny; let us celebrate technical skill as the highest expression of intellect.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Debate: AI in Education (Opposing the Motion: AI Threatens Education)
  {
    id: "B9_S4_E_I_T_08",
    section: "theory",
    questionNumber: 58,
    theoryIndex: 8,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Debate Speech",
    title: "Artificial Intelligence Enhances Human Learning Rather Than Threatening It",
    shortSummary: "Speak against the motion that artificial intelligence does more harm than good to student education.",
    prompt: "You are the second speaker in an inter-schools debate competition on the motion: 'Artificial Intelligence in Education Does More Harm Than Good to African Students.' Write your debate speech opposing the motion, delivering at least two convincing arguments regarding personalized digital tutoring for rural schools and automated grading, while refuting opposing claims on cheating and brain atrophy.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B9.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments showing how AI democratizes personalized tutoring for understaffed rural schools and accelerates teacher efficiency. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly oppose the motion which asserts that Artificial Intelligence in education does more harm than good to African students.",
        prohibitedOpenings: ["Good morning to you all", "I am standing here to talk"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Personalized Adaptive Tutoring -> Bridging the Rural Teacher Deficit -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion opposition unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with resolute technological conviction today to oppose the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Personalized Adaptive Learning for Every Child", guidingQuestion: "Explain how AI adaptive learning algorithms cater to individual student pacing, diagnosing mathematical misconceptions instantly.", transitionHints: ["First and foremost, traditional classrooms force sixty diverse pupils to learn at a single, rigid pace...", "Intelligent artificial intelligence tutors adapt to each individual learner, identifying specific algebra misconceptions in real time and..."] },
          { stageIndex: 3, role: "Second Argument: Bridging the Severe Rural Teacher Deficit", guidingQuestion: "Demonstrate that AI tools provide under-resourced rural schools with virtual STEM instructors and interactive lab simulations.", transitionHints: ["Secondly, consider the acute structural crisis facing African basic education: the severe deficit of certified STEM teachers...", "In remote rural villages where schools lack qualified physics and mathematics tutors, AI-driven digital assistants provide..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on academic cheating and brain atrophy, deliver an inspiring closing appeal, and say thank you.", transitionHints: ["My worthy opponents will surely wave their hands in panic, crying that AI encourages lazy cheating; however, this claim collapses because...", "With these unassailable truths, I urge you all to vote resoundingly against the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "Do not fear the calculator; learn how to master higher mathematics.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion opposition declared firmly (2 marks)", "Personalized adaptive learning argument developed cogently (4 marks)", "Rural teacher deficit bridging and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly oppose the motion which asserts that: \"Artificial Intelligence in Education Does More Harm Than Good to African Students.\"\n\nFirst and foremost, artificial intelligence fundamentally democratizes personalized, mastery-based education. In our overcrowded public classrooms, a single dedicated teacher is often tasked with managing sixty diverse pupils simultaneously. In such an overwhelming environment, gifted students become bored while struggling learners fall behind in silence. Intelligent AI tutoring platforms solve this ancient pedagogical dilemma. Operating on basic solar-powered tablets, adaptive AI systems analyze each pupil's unique learning pace, pinpointing specific mathematical misconceptions in real time. If a child struggles with fraction division, the AI tutor provides targeted remedial hints and visual analogies until true mastery is achieved. AI does not replace the human teacher; it empowers the teacher by providing an individualized personal tutor for every child!\n\nSecondly, artificial intelligence holds the key to bridging Africa's catastrophic rural educational divide. Across our continent, thousands of rural basic schools suffer from an acute shortage of certified mathematics and integrated science instructors. Must a child born in a remote farming hamlet be condemned to academic failure simply because qualified physics teachers refuse postings to the countryside? AI-driven educational applications deliver interactive laboratory simulations, voice-interactive language tutors, and instant homework feedback directly to rural classrooms without requiring expensive physical infrastructure. AI bridges the geographical chasm between elite urban academies and under-resourced village schools!\n\nMy worthy opponents have painted a hysterical, dystopian portrait of automated cheating and intellectual atrophy. They claim that students will use AI simply to copy essays without thinking. But let us expose that shallow fear! When electronic calculators were introduced into schools fifty years ago, alarmists predicted the total death of mental arithmetic. Did mathematics die? Absolutely not! Calculators freed the human mind from tedious manual arithmetic, enabling students to explore higher-order calculus and computer programming. AI is merely the calculator of human language and logic!\n\nMr. Chairman, let us not run away from the technological revolution; let us harness its power to educate every African child. I urge this house to vote resoundingly against the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Narrative: A Tense Encounter with an Electrical Transformer Fire
  {
    id: "B9_S4_E_I_T_09",
    section: "theory",
    questionNumber: 59,
    theoryIndex: 9,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Narrative Essay",
    title: "The Exploding Transformer",
    shortSummary: "Write a narrative story recounting the terror and rapid community evacuation during an electrical transformer explosion.",
    prompt: "During an evening study prep session in your neighborhood, an overloaded municipal electrical transformer exploded violently outside your house. Write a narrative essay recounting the blinding sparks, the chemical fire, the panicked evacuation of your family, and the timely intervention of firefighters.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Dramatic Action Pacing, Electrical Disaster Imagery & Evacuation Pacing",
    learningCompetency: "B9.4.2.1.1: Compose suspenseful narrative compositions depicting urban infrastructural disasters, family evacuation leadership, and crisis resolution.",
    hint: "Start with the quiet evening study baseline. Describe the strange humming noise, the violent blinding explosion, the shower of sparks onto wooden roofs, the frantic evacuation, and the fire service rescue.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Sparks in the Night Sky",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing peaceful study baseline, sudden electrical explosion, chemical blaze, and emergency rescue.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Baseline Study", guidingQuestion: "Describe a quiet Saturday evening solving past BECE mathematics questions at your desk.", transitionHints: ["It was a humid, peaceful Saturday evening in the residential enclave of Bantama...", "I sat at my study desk under a glowing fluorescent lamp, completely absorbed in solving past geometry questions when..."] },
          { stageIndex: 2, role: "Inciting Incident & The Transformer Blast", guidingQuestion: "Describe a violent humming sound, blinding electrical arc flashes, and an ear-splitting explosion.", transitionHints: ["The tranquil quiet was interrupted by a deep, vibrating mechanical hum from the utility pole outside...", "Suddenly, an apocalyptic flash of blinding blue-white lightning lit the room, followed by an ear-splitting boom that..."] },
          { stageIndex: 3, role: "Rising Action & Chemical Fire Spread", guidingQuestion: "Narrate showers of molten copper sparks raining onto wooden canopies and black chemical smoke filling the house.", transitionHints: ["Looking through the shattered louvres, the metal transformer was an inferno of sizzling blue flames...", "Showers of incandescent sparks rained onto our neighbor's wooden kiosk, igniting the roof as toxic oil smoke billowed..."] },
          { stageIndex: 4, role: "Climax, Evacuation & Firefighter Rescue", guidingQuestion: "Describe guiding your grandmother to safety on the street and the arrival of fire tenders with foaming water.", transitionHints: ["\"Evacuate the house! Turn off the main switch!\" I bellowed, grabbing my elderly grandmother's arm...", "Dragging her through the choking smoke onto the open street, the wailing sirens of the Ghana National Fire Service pierced the night, dousing the blaze..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Heroic Reflection",
        proverbOrClosingPhrase: "Presence of mind in sudden calamity is the true shield of life.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating quick family leadership and gratitude for emergency services."
      }
    },
    rubric: createWAECRubric(
      ["Study baseline and transformer setting established (2 marks)", "Electrical arc explosion and molten spark fire depicted vividly (4 marks)", "Family evacuation, grandmother rescue, and fire service intervention conveyed (4 marks)"],
      ["Urban setting established", "Explosion scene vivid and kinetic", "Evacuation and rescue clear"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative perspective (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Dynamic action verbs and electrical disaster imagery (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and dramatic adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `Sparks in the Night Sky\n_______________________\n\nIt was a humid, peaceful Saturday evening in the residential suburb of Bantama. Inside our living room, the atmosphere was quiet and studious; I was hunched over my desk, completely absorbed in solving circle geometry proofs for our upcoming BECE trial examination. In the armchair behind me, my seventy-year-old grandmother was quietly reciting her evening prayers. Outside, the night crickets chirped peacefully in the hedges.\n\nWithout warning, a strange, menacing mechanical hum began vibrating from the concrete utility pole barely ten meters outside our front veranda. The low drone rapidly escalated into an angry, electrical screech. Before I could stand up to look through the window, an apocalyptic flash of blinding blue-white light turned the room as bright as midday. An ear-splitting explosion shook the ground like a major earthquake, violently shattering two of our glass louvres and plunging the entire neighborhood into pitch darkness.\n\nLooking out through the broken window frame, a terrifying spectacle unfolded. The massive cylindrical transformer on the pole was an erupting volcano of fire. Sizzling electric arcs hissed violently through the air, sending showers of incandescent molten copper sparks raining down onto neighboring rooftops like fiery hail. The mineral cooling oil inside the transformer had ignited, generating a roaring chemical blaze that set our neighbor's wooden grocery kiosk on fire within seconds. Thick, suffocating plumes of acrid, chemical smoke billowed through our doorway, burning our throats.\n\n\"Grandmother, get up! We must evacuate now!\" I shouted through the darkness. Slamming down our house's main electrical breaker switch with a wooden broom handle to prevent a secondary house circuit fire, I seized my trembling grandmother by the waist, threw a wet towel over her face, and guided her through the blinding smoke into the street. Moments later, the wailing sirens of two Ghana National Fire Service tenders tore through the night. The courageous firefighters deployed high-pressure chemical foam, suffocating the blazing transformer before the flames could consume our living room. Shivering on the pavement beside our neighbors, I bowed my head in boundless gratitude for the presence of mind that had steered us through mortal danger.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Descriptive: The Grand Durbar of Chiefs During the Hogbetsotso Festival
  {
    id: "B9_S4_E_I_T_10",
    section: "theory",
    questionNumber: 60,
    theoryIndex: 10,
    type: "structured_essay",
    format: "structured_essay",
    level: "B9",
    difficulty: "intermediate",
    category: "Descriptive Essay",
    title: "Colors and Royalty at the Hogbetsotso Durbar",
    shortSummary: "Write a descriptive essay recreating the visual magnificence, Agbadza drumming, and royal pageantry of the Hogbetsotso festival.",
    prompt: "You attended the grand durbar of the historic Hogbetsotso Za festival in Anloga. Write a descriptive essay recreating the dazzling multi-colored kete and kente regalia of the Ewe chiefs, the thunderous polyrhythms of the Agbadza drums, the rhythmic footwork of warrior dancers, and the palpable cultural unity of the people.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Cultural Royalty Description, Auditory Rhythmic Pacing & Spatial Grandeur",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions capturing traditional royal pageantry through rich sensory registers, regal vocabulary, and spatial progression.",
    hint: "Use spatial progression: the packed ceremonial arena overlooking the Keta Lagoon, the entrance of the warrior Asafo companies, the Awomefia seated in royal state, and the climactic communal Agbadza dance.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "A Tapestry of Heritage at Anloga",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression through the Hogbetsotso royal durbar from lagoon shores to the royal dais.",
        stagePrompts: [
          { stageIndex: 1, role: "Lagoon Shore Arena", guidingQuestion: "Set the scene at the grand ceremonial grounds in Anloga overlooking the shimmering Keta Lagoon.", transitionHints: ["Under the golden tropical sun, the sacred ceremonial grounds of Anloga were transformed into...", "Overlooking the shimmering, silver expanse of the Keta Lagoon, tens of thousands of celebrants packed the arena under..."] },
          { stageIndex: 2, role: "The Warrior Companies & Royal Regalia", guidingQuestion: "Describe the warrior companies firing musketry and paramount chiefs carried high in ornate palanquins draped in royal kete.", transitionHints: ["The royal procession ignited with the entrance of the traditional warrior companies...", "Borne aloft in palanquins carved in the likeness of royal eagles and war canoes, paramount chiefs were draped in..."] },
          { stageIndex: 3, role: "Agbadza Drumming & Kinetic Dance", guidingQuestion: "Capture the complex polyrhythms of master drummers and the synchronized, flapping shoulder movements of Agbadza dancers.", transitionHints: ["The acoustic majesty was an irresistible cultural symphony...", "Master drummers struck the sogo and kidi drums with hypnotic fury, while hundreds of dancers executed the famous shoulder-flapping..."] },
          { stageIndex: 4, role: "The Royal Address & Cultural Unity", guidingQuestion: "Describe the Awomefia addressing his subjects and reflect on the enduring unity and history of the Anlo-Ewe people.", transitionHints: ["As the Awomefia of Anlo rose in state to deliver his festival address, a hushed reverence swept over the vast crowd...", "Standing amid that sea of gold and song, I was filled with immense pride in the living soul of Ghanaian cultural heritage..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Cultural Synthesis",
        proverbOrClosingPhrase: "The unity of a people is stronger than the walls of an empire.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating indigenous African sovereignty and cultural survival."
      }
    },
    rubric: createWAECRubric(
      ["Anloga lagoon setting and durbar crowd established (2 marks)", "Warrior musketry, royal palanquins, and kete regalia depicted vividly (4 marks)", "Agbadza drumming, synchronized dance, and cultural unity conveyed (4 marks)"],
      ["Lagoon setting vivid", "Sensory cues (color, drumming, dance) rich", "Cultural grandeur captured"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich cultural and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `A Tapestry of Heritage at Anloga\n___________________________________\n\nUnder the radiant morning sun, the historic coastal town of Anloga in the Volta Region awoke to a glorious celebration of ancestral memory for the annual Hogbetsotso Za festival. Overlooking the vast, silver sheet of the Keta Lagoon, the grand ceremonial durbar grounds overflowed with an energetic multitude of tens of thousands—citizens, international tourists, and cultural historians—assembled under gigantic, scalloped velvet state umbrellas that swayed gently in the Atlantic sea breeze.\n\nThe festival proceedings ignited with a breathtaking display of ancestral martial heritage. Led by traditional warrior companies, musketeers dressed in ceremonial hunting smocks fired deafening volleys of blank gunpowder into the air, shrouding the arena in aromatic plumes of white smoke that recalled their ancestors' historic escape from the tyranny of King Agorkorli at Notsie. Behind them came the royal procession. Borne aloft on the shoulders of muscular warriors in ornate palanquins, paramount chiefs glided above the crowd, their brows crowned with golden headbands and their bodies wrapped in luminous yards of handwoven kete and kente cloth glowing in geometric patterns of gold, indigo, and scarlet.\n\nThe acoustic power of the festival was an exhilarating, world-renowned musical spectacle. The drumming masterclasses commenced with the thunderous, complex polyrhythms of the sogo, atimevu, and kidi drums. Gankogui iron bells clinked in rapid, hypnotic synchronization, commanding the arena. Onto the sand stepped hundreds of dancers, executing the legendary Agbadza dance. Their bare feet struck the sand in lightning-fast patterns, while their arms and shoulders undulated in synchronized, bird-like flapping motions that depicted the flight of eagles, their beaded waistbands and silver necklaces shimmering in the sunlight.\n\nAs the Awomefia of the Anlo State, Togbi Sri III, rose in state to deliver his royal address, absolute, reverent silence blanketed the immense gathering. Listening to his call for peace, educational excellence, and environmental defense of the coastal wetlands, a deep surge of pride in our enduring African sovereignty swelled in my heart. Hogbetsotso is not merely a festival; it is the undefeated, living soul of a magnificent people.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand4B9IntermediateClean() {
  console.log("Building clean 60-item Strand 4 B9 Intermediate Practice Lab...");
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
      id: `B9_S4_E_I_OBJ_${qNum < 10 ? "0" + qNum : qNum}`,
      section: "objective",
      questionNumber: qNum,
      type: "multiple_choice",
      format: "multiple_choice",
      level: "B9",
      difficulty: "intermediate",
      category: "Composition & Rhetoric Mechanics",
      passageText: item.passage,
      prompt: `📖 PASSAGE / CONTEXT:\n"${item.passage}"\n\n❓ QUESTION ${qNum}:\n${item.question}`,
      options: finalOptions,
      correctAnswer: item.answer, // Matches exact string value in finalOptions[targetPos]
      hint: item.hint,
      workedSolution: item.solution,
      points: 1,
      competencyTarget: item.target,
      learningCompetency: "B9.4.2.1: Demonstrate intermediate mastery of narrative plot structures, sensory travelogue descriptions, article headline-byline rules, and parliamentary debate mechanics."
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
    difficulty: "intermediate",
    title: "Basic 9 Intermediate Writing Lab: 50 Objective Rhetoric Drills + 10 Theory Extended Compositions",
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
      `global_curriculum/jhs/subjects/english/topical/${docId}/practice_labs/B9_intermediate`
    );
    await targetDoc.set(labPayload);
    console.log(`   ✅ Deployed Practice Lab: ${targetDoc.path}`);

    // 4. Synchronize into the main topical document practice pool (medium)
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

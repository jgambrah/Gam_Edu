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
        "Flawless sequence of tenses across complex multi-clause sentences",
        "Absolute absence of run-on sentences and comma splices",
        "Syntactic sophistication, varied clause architecture, and zero informal contraction slips"
      ]
    }
  }
});

// =========================================================================
// 50 UNIQUE OBJECTIVE DRILLS (B9 ADVANCED LEVEL)
// =========================================================================
const rawObjective50Data = [
  {
    passage: "A speaker in a national debate asserts: 'Not only did the municipal policy fail to curb youth truancy, but it also depleted community resources.'",
    question: "What syntactic operation is demonstrated in the opening clause?",
    options: [
      "Negative adverbial fronting with subject-auxiliary inversion",
      "A passive participle dangling clause",
      "An uninflected subjunctive imperative",
      "A correlative conditional clause"
    ],
    answer: "Negative adverbial fronting with subject-auxiliary inversion",
    hint: "Notice 'Not only' at the start followed by the auxiliary 'did' before the subject.",
    solution: "Fronting negative or restrictive adverbials (e.g., 'Not only', 'Scarcely', 'Seldom') triggers subject-auxiliary inversion in formal rhetoric.",
    target: "Advanced Syntax: Inversion with Negative Adverbials"
  },
  {
    passage: "In an editorial article advocating educational reform, the writer states: 'The Minister demanded that every headteacher submit an empirical audit by Friday.'",
    question: "Why is the base verb form 'submit' used instead of 'submits'?",
    options: [
      "The suasive verb 'demanded that' triggers the mandative subjunctive mood",
      "The noun 'headteacher' is plural in this specific context",
      "It is an irregular past tense inflection",
      "The auxiliary 'must' has been elided"
    ],
    answer: "The suasive verb 'demanded that' triggers the mandative subjunctive mood",
    hint: "Verbs of command, insistence, and recommendation take uninflected base verbs in formal clauses.",
    solution: "Suasive verbs such as 'demand that', 'insist that', or 'recommend that' govern the mandative subjunctive, requiring the bare base form of the verb without third-person '-s'.",
    target: "Advanced Grammar: Mandative Subjunctive in Formal Prose"
  },
  {
    passage: "A writer concludes a narrative: 'He bought a golden crown, but lost the head that could wear it.'",
    question: "Which advanced rhetorical device is used to highlight this moral tragedy?",
    options: [
      "Antithesis with synecdoche",
      "Chiasmus with hyperbole",
      "Tautology with personification",
      "Simile with euphemism"
    ],
    answer: "Antithesis with synecdoche",
    hint: "Contrasting ideas are paired, and 'head' represents the person's life or sanity.",
    solution: "The sentence balances contrasting ideas ('bought crown' vs. 'lost head') in balanced antithesis, while 'head' functions synecdochically to represent human life.",
    target: "Rhetorical Tropes: Antithesis & Synecdoche"
  },
  {
    passage: "A candidate writes: 'The school laboratory lacks contemporary equipment; consequently, candidates are crippled in their project work.'",
    question: "What syntactic function does the semicolon and 'consequently' fulfill?",
    options: [
      "Linking two independent clauses with a conjunctive adverb to show cause and effect",
      "Creating an ungrammatical run-on comma splice",
      "Introducing an embedded relative parenthetical clause",
      "Forming an adverbial clause of concession"
    ],
    answer: "Linking two independent clauses with a conjunctive adverb to show cause and effect",
    hint: "A semicolon before a conjunctive adverb properly joins coordinate sentences.",
    solution: "Using a semicolon followed by a conjunctive adverb ('consequently') and a comma correctly coordinates two related independent clauses without creating a comma splice.",
    target: "Sentence Mechanics: Conjunctive Adverb Coordination"
  },
  {
    passage: "A debater asserts: 'Why must we ban single-use plastics? Because our marine ecosystems are choking on our synthetic waste.'",
    question: "What specific rhetorical figure of speech is demonstrated when a speaker asks a question and immediately answers it?",
    options: [
      "Hypophora",
      "Rhetorical question",
      "Apostrophe",
      "Euphemism"
    ],
    answer: "Hypophora",
    hint: "Unlike a regular rhetorical question, the speaker provides the answer themselves.",
    solution: "Hypophora is a rhetorical strategy in which a speaker raises a question and immediately proceeds to answer it, guiding the audience's logical trajectory.",
    target: "Rhetorical Schemes: Hypophora vs. Rhetorical Question"
  },
  {
    passage: "In an essay analyzing rural healthcare, the writer writes: 'Neither the health director nor the resident midwives was prepared to compromise clinical standards.'",
    question: "Under the Principle of Proximity Concord, how must this sentence be revised?",
    options: [
      "Change 'was prepared' to 'were prepared' to agree with the nearest plural noun 'midwives'",
      "Change 'midwives' to the singular form 'midwife'",
      "Replace 'Neither... nor' with 'Either... or'",
      "Invert the verb to 'prepared were they'"
    ],
    answer: "Change 'was prepared' to 'were prepared' to agree with the nearest plural noun 'midwives'",
    hint: "The finite verb in correlative subjects agrees with the subject component nearest to it.",
    solution: "Under Proximity Concord, when subjects are coordinated by 'neither... nor', the verb agrees in number with the closer subject nominal ('midwives' -> 'were prepared').",
    target: "Syntactic Concord: Correlative Proximity Law"
  },
  {
    passage: "A narrative includes the line: '\"Halt!\" the commander bellowed, before turning to his deputy. \"Inspect every container.\"'",
    question: "Why is the punctuation of this interrupted dialogue mechanically sound?",
    options: [
      "The tag completes an action with a period before the second independent imperative sentence begins",
      "Because the word 'deputy' ends with an exclamation point",
      "Because dialogue tags cannot contain prepositional phrases",
      "Because quotation marks are omitted from the second clause"
    ],
    answer: "The tag completes an action with a period before the second independent imperative sentence begins",
    hint: "The reporting phrase includes narrative action terminating in a full sentence.",
    solution: "When a reporting clause contains independent narrative action between two separate spoken sentences, it terminates with a period before the next quotation begins with a capital letter.",
    target: "Dialogue Mechanics: Attributed Narrative Action"
  },
  {
    passage: "In a formal article, what is the stylistic danger of relying excessively on passive voice (e.g., 'A decision was taken by the board that actions should be executed by students')?",
    question: "State the primary stylistic defect:",
    options: [
      "It produces bureaucratic wordiness, obscures agency, and diminishes vigorous prose rhythm",
      "It violates WAEC spelling rubrics directly",
      "It causes unavoidable tense instability errors",
      "It requires double underlining under headline conventions"
    ],
    answer: "It produces bureaucratic wordiness, obscures agency, and diminishes vigorous prose rhythm",
    hint: "Passive constructions often hide who is taking action and inflate word count unnecessarily.",
    solution: "Overusing the passive voice creates impersonal, convoluted sentences that obscure accountability and drain vitality from expository prose.",
    target: "Style & Register: Active vs. Passive Voice Dynamics"
  },
  {
    passage: "A speaker argues: 'He is no fool who trades temporary comfort for eternal knowledge.'",
    question: "What rhetorical device is employed by asserting an affirmative point through the negation of its opposite?",
    options: [
      "Litotes",
      "Hyperbole",
      "Oxymoron",
      "Synecdoche"
    ],
    answer: "Litotes",
    hint: "Using 'no fool' to mean 'very wise'.",
    solution: "Litotes is an understatement achieved by negating the contrary ('no fool' = very wise), lending intellectual nuance to argumentative rhetoric.",
    target: "Rhetorical Tropes: Litotes"
  },
  {
    passage: "A student writes: 'Having finished the examination, the hall was locked by the invigilator.'",
    question: "What structural syntactic error is present in this sentence?",
    options: [
      "A dangling participial modifier (the hall did not finish the examination)",
      "An unpunctuated relative clause",
      "An ungrammatical split infinitive",
      "A comma splice between coordinate clauses"
    ],
    answer: "A dangling participial modifier (the hall did not finish the examination)",
    hint: "The introductory participle must logically modify the subject that immediately follows the comma.",
    solution: "The participial phrase 'Having finished the examination' erroneously modifies 'the hall' instead of the candidate. This dangling modifier must be resolved by recasting the subject.",
    target: "Advanced Syntax: Dangling Participial Modifiers"
  },
  {
    passage: "A debater asserts: 'We shall fight illiteracy in our classrooms; we shall fight indifference in our communities; we shall fight corruption in our institutions.'",
    question: "Identify the primary rhetorical figure based on initial phrase repetition:",
    options: [
      "Anaphora",
      "Epistrophe",
      "Metonymy",
      "Asyndeton"
    ],
    answer: "Anaphora",
    hint: "Repetition of 'We shall fight' at the beginning of each successive clause.",
    solution: "Anaphora is the deliberate repetition of a word or phrase at the beginning of successive clauses, creating rhetorical cadence and emotional resonance.",
    target: "Rhetorical Schemes: Anaphora"
  },
  {
    passage: "A candidate writes: 'The committee, including three regional educational supervisors, has submitted their report.'",
    question: "What concord discrepancy occurs between the subject, verb, and possessive pronoun?",
    options: [
      "The singular verb 'has' clashes with the plural pronoun 'their'; it should be 'its report'",
      "The verb should be 'have submitted'",
      "The parenthetical phrase should be removed",
      "The pronoun 'their' should be deleted entirely"
    ],
    answer: "The singular verb 'has' clashes with the plural pronoun 'their'; it should be 'its report'",
    hint: "If the collective noun takes a singular verb, subsequent pronouns must also be singular.",
    solution: "Consistency in grammatical number is mandatory: if 'the committee' takes the singular verb 'has', the subsequent referential pronoun must be the singular neuter 'its'.",
    target: "Concord Mechanics: Pronoun-Antecedent Agreement"
  },
  {
    passage: "In descriptive prose, what is the term for sensory descriptions that cross perceptual boundaries, such as describing a sound as having a color or smell?",
    question: "Identify this literary device:",
    options: [
      "Synesthesia",
      "Onomatopoeia",
      "Alliteration",
      "Kinesthesia"
    ],
    answer: "Synesthesia",
    hint: "Blending different sensory registers together (e.g., 'a loud yellow shirt', 'a sweet voice').",
    solution: "Synesthesia is a figurative technique where one sensory modality is described in terms of another (e.g., 'a sharp, green sound'), creating vivid sensory texture.",
    target: "Descriptive Writing: Synesthetic Imagery"
  },
  {
    passage: "A narrative includes: 'Had the alarm sounded three minutes earlier, the entire dormitory would have escaped unscathed.'",
    question: "What conditional form is used in this sentence?",
    options: [
      "Inverted Third Conditional (past counterfactual)",
      "First Conditional predictive",
      "Zero Conditional universal truth",
      "Second Conditional present hypothetical"
    ],
    answer: "Inverted Third Conditional (past counterfactual)",
    hint: "Inversion of 'had' and the subject expresses an impossible past counterfactual condition.",
    solution: "'Had the alarm sounded...' is an inverted Third Conditional expressing an unrealized past condition, replacing 'If the alarm had sounded...'.",
    target: "Advanced Syntax: Inverted Third Conditional"
  },
  {
    passage: "A debate speaker argues: 'My opponent's proposal is an open secret: it promises everything but delivers nothing.'",
    question: "Identify the figure of speech demonstrated by the contradictory phrase 'open secret':",
    options: [
      "Oxymoron",
      "Paradox",
      "Irony",
      "Hyperbole"
    ],
    answer: "Oxymoron",
    hint: "Two contradictory terms juxtaposed side by side.",
    solution: "An oxymoron compresses two contradictory terms into a single descriptive phrase ('open secret') to arrest attention.",
    target: "Rhetorical Tropes: Oxymoron"
  },
  {
    passage: "A student writes: 'The minister was visibly shaken, however, he refused to cancel the examination.'",
    question: "What punctuation error is committed with the conjunctive adverb 'however'?",
    options: [
      "A comma splice: 'however' between independent clauses requires a preceding semicolon or period",
      "The word 'however' must always be in capital letters",
      "The comma after 'however' should be omitted",
      "Conjunctive adverbs cannot appear in the middle of a sentence"
    ],
    answer: "A comma splice: 'however' between independent clauses requires a preceding semicolon or period",
    hint: "You cannot join two complete sentences with only a comma before 'however'.",
    solution: "Using a comma before 'however' to join two independent clauses produces a comma splice. It must be written: '...shaken; however, he refused...'.",
    target: "Sentence Mechanics: Conjunctive Adverb Comma Splice"
  },
  {
    passage: "In an expository article, an author uses a periodic sentence: 'After months of bitter public debate, multiple ministerial consultations, and widespread student protests, the controversial bill was finally passed.'",
    question: "What is the rhetorical advantage of placing the main independent clause at the very end?",
    options: [
      "It builds suspense and cognitive momentum by withholding the main idea until the close",
      "It hides the true meaning from the reader",
      "It allows the writer to avoid using subordinate clauses",
      "It fulfills the WAEC minimum word requirement automatically"
    ],
    answer: "It builds suspense and cognitive momentum by withholding the main idea until the close",
    hint: "A periodic sentence delays the main clause until the end to emphasize it.",
    solution: "A periodic sentence suspends the core syntactic resolution until the period, creating rhetorical tension and dramatic emphasis.",
    target: "Syntactic Style: Periodic Sentence Architecture"
  },
  {
    passage: "A speaker in a debate states: 'My worthy opponent attacks my youth, but fails to address my evidence.'",
    question: "What informal fallacy is the speaker exposing in their opponent's argument?",
    options: [
      "Ad hominem (attacking the person instead of the argument)",
      "Straw man fallacy",
      "Post hoc ergo propter hoc",
      "Circular reasoning"
    ],
    answer: "Ad hominem (attacking the person instead of the argument)",
    hint: "Attacking someone's age or background rather than their claims is a personal attack.",
    solution: "An ad hominem fallacy dismisses a claim based on the speaker's personal characteristics (age, gender, origin) rather than logical merit.",
    target: "Debate Logic: Exposing Ad Hominem Fallacies"
  },
  {
    passage: "A candidate writes: 'The aroma of roasted cocoa beans was thick enough to chew.'",
    question: "What figurative device is used to emphasize the density of the smell?",
    options: [
      "Hyperbole",
      "Litotes",
      "Euphemism",
      "Apostrophe"
    ],
    answer: "Hyperbole",
    hint: "An intentional exaggeration for rhetorical emphasis.",
    solution: "Exaggerating that a smell is dense enough to be chewed is hyperbole, heightening the sensory experience.",
    target: "Descriptive Writing: Hyperbolic Imagery"
  },
  {
    passage: "What is the structural role of the 'epilogue' or 'coda' in an extended narrative?",
    question: "Define the function of a narrative coda:",
    options: [
      "A brief concluding reflection that provides distance from the climax and reflects on long-term implications",
      "The opening paragraph introducing the villain",
      "The section where dialogue is introduced",
      "The list of references cited in the story"
    ],
    answer: "A brief concluding reflection that provides distance from the climax and reflects on long-term implications",
    hint: "It steps back after the resolution to summarize the permanent change in the character's world.",
    solution: "A narrative coda or epilogue offers reflective distance from the central crisis, illustrating how the protagonist's life was permanently reshaped by the events.",
    target: "Freytag's Pyramid: Narrative Coda & Reflection"
  },
  {
    passage: "A student writes: 'Rarely do we encounter an individual whose integrity remains uncompromised by power.'",
    question: "What syntactic operation has occurred following the fronted restrictive adverb 'Rarely'?",
    options: [
      "Subject-auxiliary inversion ('do we encounter')",
      "Passive voice transformation",
      "Relative clause deletion",
      "Subordinate clause coordination"
    ],
    answer: "Subject-auxiliary inversion ('do we encounter')",
    hint: "The dummy auxiliary 'do' is placed before the pronoun 'we'.",
    solution: "When restrictive frequency adverbs like 'Rarely', 'Seldom', or 'Hardly' begin a sentence, formal grammar requires inversion of the auxiliary and the subject.",
    target: "Advanced Syntax: Restrictive Adverbial Inversion"
  },
  {
    passage: "In an argumentative essay, what is 'chiasmus'?",
    question: "Identify the definition of chiasmus:",
    options: [
      "A rhetorical structure where concepts or words are repeated in reverse grammatical order (A-B-B-A)",
      "A comparison using the word 'like' or 'as'",
      "An unpunctuated direct speech tag",
      "A quotation from an ancient proverb"
    ],
    answer: "A rhetorical structure where concepts or words are repeated in reverse grammatical order (A-B-B-A)",
    hint: "Think of 'Ask not what your country can do for you; ask what you can do for your country.'",
    solution: "Chiasmus is an inverted parallelism where key terms cross over in reverse order (e.g., 'Never let a fool kiss you or a kiss fool you').",
    target: "Rhetorical Schemes: Chiasmus"
  },
  {
    passage: "A candidate writes: 'The council insisted that the demolished structures are rebuilt immediately.'",
    question: "Under the rules of the mandative subjunctive in administrative English, how should 'are rebuilt' be corrected?",
    options: [
      "be rebuilt (uninflected base form of the passive auxiliary)",
      "were rebuilt",
      "is rebuilt",
      "must be rebuilt"
    ],
    answer: "be rebuilt (uninflected base form of the passive auxiliary)",
    hint: "The mandative subjunctive suppresses inflected forms like 'is/are' in favor of 'be'.",
    solution: "Clauses following suasive verbs ('insisted that') require the bare uninflected subjunctive: '...insisted that the demolished structures be rebuilt...'.",
    target: "Advanced Grammar: Passive Mandative Subjunctive"
  },
  {
    passage: "A debate speaker states: 'My opponent confuses correlation with causation; simply because cockcrows precede dawn does not mean the rooster causes the sun to rise.'",
    question: "What formal logical fallacy is the speaker diagnosing?",
    options: [
      "Post hoc ergo propter hoc (false cause fallacy)",
      "Ad hominem",
      "Appeal to authority",
      "Red herring"
    ],
    answer: "Post hoc ergo propter hoc (false cause fallacy)",
    hint: "Assuming that because event A happened before event B, event A caused event B.",
    solution: "The 'post hoc ergo propter hoc' fallacy falsely assumes that temporal sequence implies causality. Disproving this strengthens forensic debate clash.",
    target: "Debate Logic: False Cause Fallacy"
  },
  {
    passage: "A student writes: 'The room was pitch-black, dark, and lacking in light.'",
    question: "What mechanical editing principle should be applied to eliminate weakness in this sentence?",
    options: [
      "Pruning lexical redundancy (retaining 'pitch-black' and cutting the tautological synonyms)",
      "Adding more sensory adverbs",
      "Converting the sentence to passive voice",
      "Splitting the sentence into three paragraphs"
    ],
    answer: "Pruning lexical redundancy (retaining 'pitch-black' and cutting the tautological synonyms)",
    hint: "Say it powerfully once instead of repeating synonyms.",
    solution: "'Pitch-black' communicates the entire sensory reality. Adding 'dark' and 'lacking in light' dilutes the impact through tautology.",
    target: "Style & Editing: Pruning Lexical Redundancy"
  },
  {
    passage: "A narrative includes: 'The thunder gave a deafening crack, and the rain began to fall in torrents.'",
    question: "How can this sentence be elevated through dynamic transitive verbs to intensify kinetic pacing?",
    options: [
      "A deafening thunderclap shattered the silence, unleashing a torrential deluge across the roof.",
      "The thunder was very loud and plenty rain fell down.",
      "The rain was heavy after the thunder cracked.",
      "Thunder made noise and water rushed everywhere."
    ],
    answer: "A deafening thunderclap shattered the silence, unleashing a torrential deluge across the roof.",
    hint: "Replace weak verbs like 'gave' and 'began to fall' with forceful verbs like 'shattered' and 'unleashed'.",
    solution: "Using kinetic transitive verbs ('shattered', 'unleashed') creates dramatic momentum, elevating basic narrative prose into vivid description.",
    target: "Narrative Craft: Dynamic Transitive Elevation"
  },
  {
    passage: "What is the function of 'zeugma' in advanced literary expression?",
    question: "Identify the definition of zeugma:",
    options: [
      "A figure of speech in which a single verb applies to two nouns in different senses (e.g., 'He took his hat and his leave')",
      "A comparison without using 'like' or 'as'",
      "An unpunctuated direct speech tag",
      "The repetition of vowel sounds"
    ],
    answer: "A figure of speech in which a single verb applies to two nouns in different senses (e.g., 'He took his hat and his leave')",
    hint: "A single verb linking concrete and abstract direct objects.",
    solution: "Zeugma joins two distinct objects to one verb in different senses (one literal, one figurative), creating witty stylistic economy.",
    target: "Rhetorical Tropes: Zeugma"
  },
  {
    passage: "In a formal article, what is the role of an 'asyndetic list' (e.g., 'Governments must act, communities must mobilize, individuals must reform')?",
    question: "Identify the rhetorical effect of omitting conjunctions between clauses:",
    options: [
      "It creates an urgent, rapid rhythm that conveys immediate necessity and momentum",
      "It is an orthographic error penalized under Mechanical Accuracy",
      "It signifies that the author ran out of connecting words",
      "It is permitted only in informal poetry"
    ],
    answer: "It creates an urgent, rapid rhythm that conveys immediate necessity and momentum",
    hint: "Omitting 'and' speeds up the reading pace.",
    solution: "Asyndeton (omitting coordinating conjunctions) speeds up the cadence, imparting urgency and rhythmic decisiveness to persuasive prose.",
    target: "Rhetorical Schemes: Asyndeton"
  },
  {
    passage: "A candidate writes: 'The principal along with the district supervisors was inspecting the testing center.'",
    question: "Why is the singular verb 'was inspecting' grammatically correct?",
    options: [
      "The parenthetical phrase introduced by 'along with' does not compound the singular subject 'principal'",
      "The word 'inspecting' is an intransitive verb",
      "The noun 'supervisors' is functioning as an adjective",
      "The sentence is in the subjunctive mood"
    ],
    answer: "The parenthetical phrase introduced by 'along with' does not compound the singular subject 'principal'",
    hint: "Quasi-coordinators like 'along with' do not create a plural compound subject.",
    solution: "Phrases introduced by 'along with', 'as well as', or 'together with' are parenthetical adjuncts. The head noun ('principal') retains singular control over the verb.",
    target: "Concord Mechanics: Quasi-Coordinators"
  },
  {
    passage: "In a debate speech, a speaker quotes their opponent: 'My opponent asserts that technology isolates humanity, yet she delivered her speech reading from a smartphone!'",
    question: "What forensic debate maneuver is demonstrated here?",
    options: [
      "Highlighting a performative contradiction in the opponent's behavior to undermine their premise",
      "An ad hominem personal insult",
      "A false dichotomy fallacy",
      "A chronological narrative digression"
    ],
    answer: "Highlighting a performative contradiction in the opponent's behavior to undermine their premise",
    hint: "Showing that what the opponent does contradicts what they say.",
    solution: "Exposing a performative contradiction demonstrates that the opponent's own actions invalidate their theoretical claim, providing sharp rhetorical clash.",
    target: "Debate Speech: Performative Contradiction Clash"
  },
  {
    passage: "A candidate writes: 'Scarcely had the invigilator distributed the scripts when the siren sounded.'",
    question: "Which correlative pair is correctly matched in this inverted temporal sentence?",
    options: [
      "Scarcely... when",
      "Scarcely... than",
      "Scarcely... then",
      "Scarcely... but"
    ],
    answer: "Scarcely... when",
    hint: "'Hardly/Scarcely' pairs with 'when', while 'No sooner' pairs with 'than'.",
    solution: "Prescriptive syntax dictates that 'Scarcely' and 'Hardly' correlate strictly with 'when', whereas 'No sooner' correlates with 'than'.",
    target: "Advanced Syntax: Correlative Temporal Inversion"
  },
  {
    passage: "In descriptive travel writing, how does 'macro-to-micro framing' organize a scene?",
    question: "Define macro-to-micro descriptive framing:",
    options: [
      "Opening with a panoramic wide-angle view of the landscape before zooming into fine, tactile details",
      "Describing small insects before mentioning the mountain",
      "Listing the financial value of the land before describing it",
      "Alternating between past and future tense"
    ],
    answer: "Opening with a panoramic wide-angle view of the landscape before zooming into fine, tactile details",
    hint: "Like a movie camera moving from a wide panoramic shot into a close-up detail.",
    solution: "Macro-to-micro framing establishes broad atmospheric orientation (panoramic valley) before focusing the sensory camera on specific textures, faces, and actions.",
    target: "Descriptive Writing: Macro-to-Micro Framing"
  },
  {
    passage: "A narrative includes: 'The old fisherman's face was a map of seventy years of Atlantic gales.'",
    question: "Identify the figurative device employed in this character description:",
    options: [
      "Metaphor",
      "Simile",
      "Personification",
      "Euphemism"
    ],
    answer: "Metaphor",
    hint: "A direct identification of his face as a map without using 'like' or 'as'.",
    solution: "Directly equating his weathered face to a map without using 'like' or 'as' is a direct metaphor.",
    target: "Descriptive Writing: Metaphor Analysis"
  },
  {
    passage: "What is the primary danger of using 'purple prose' (excessively florid, hyperbolic language) in an expository essay?",
    question: "Identify the stylistic flaw:",
    options: [
      "It obscures logical clarity, feels artificial, and distracts from substantive analytical reasoning",
      "It causes spelling errors automatically",
      "It is forbidden by the postal service",
      "It prevents the use of punctuation marks"
    ],
    answer: "It obscures logical clarity, feels artificial, and distracts from substantive analytical reasoning",
    hint: "Overdressing simple ideas in flamboyant adjectives obscures clarity.",
    solution: "'Purple prose' burdens essays with ornate, flowery vocabulary that obscures analytical clarity and signals superficial style over substantive thought.",
    target: "Style & Register: Purple Prose Elimination"
  },
  {
    passage: "A student writes: 'Neither of the proposals are acceptable to the committee.'",
    question: "Under standard formal concord, how should the verb be corrected?",
    options: [
      "is acceptable (the distributive pronoun 'Neither' is strictly singular)",
      "were acceptable",
      "have been acceptable",
      "be acceptable"
    ],
    answer: "is acceptable (the distributive pronoun 'Neither' is strictly singular)",
    hint: "Distributive pronouns like 'Each', 'Neither', and 'Either' govern singular verbs.",
    solution: "In prescriptive formal grammar, the distributive pronoun 'Neither' is singular and mandates the singular verb 'is acceptable'.",
    target: "Concord Mechanics: Distributive Pronoun Concord"
  },
  {
    passage: "In a debate opposing the motion 'Day Schools Are Better Than Boarding Schools,' what constitutes an unassailable point of clash against the proposition's cost argument?",
    question: "Select the most effective counter-argument:",
    options: [
      "Demonstrating that the hidden cumulative costs of daily urban transport, meals, and safety risks in day schools exceed subsidized boarding fees",
      "Claiming that day students never buy books",
      "Asserting that boarding schools give away free pocket money",
      "Arguing that day school teachers do not like teaching"
    ],
    answer: "Demonstrating that the hidden cumulative costs of daily urban transport, meals, and safety risks in day schools exceed subsidized boarding fees",
    hint: "Expose hidden costs to challenge the claim that day schools are automatically cheaper.",
    solution: "Demonstrating that daily transit fares, outside lunch purchases, and time lost in commuting constitute major hidden costs directly dismantles the superficial affordability argument.",
    target: "Debate Logic: Economic Counter-Analysis"
  },
  {
    passage: "A narrative includes: 'The creaking floorboard betrayed his presence; the shadow lengthened; the trap snapped shut.'",
    question: "What syntactic structure creates the breathless, rapid pacing in this climactic moment?",
    options: [
      "Asyndetic parataxis (coordinate independent clauses linked by semicolons without conjunctions)",
      "A long complex periodic sentence",
      "An unpunctuated relative clause",
      "A passive subjunctive inversion"
    ],
    answer: "Asyndetic parataxis (coordinate independent clauses linked by semicolons without conjunctions)",
    hint: "Rapid, equal clauses joined without 'and' to accelerate narrative tempo.",
    solution: "Asyndetic parataxis coordinates short independent clauses with semicolons, stripping away conjunctions to simulate frantic, real-time action.",
    target: "Narrative Craft: Asyndetic Parataxis"
  },
  {
    passage: "What is an 'epistrophe' in rhetorical speechwriting?",
    question: "Define epistrophe:",
    options: [
      "The repetition of a word or phrase at the end of successive clauses (the counterpart to anaphora)",
      "An opening greeting to the audience",
      "A personal attack on the timekeeper",
      "The alphabetical index of an essay"
    ],
    answer: "The repetition of a word or phrase at the end of successive clauses (the counterpart to anaphora)",
    hint: "Think of Lincoln's '...of the people, by the people, for the people.'",
    solution: "Epistrophe is the repetition of the concluding word across successive clauses, driving home rhetorical closure and emotional resonance.",
    target: "Rhetorical Schemes: Epistrophe"
  },
  {
    passage: "A candidate writes: 'The government must ensure that every child has access to clean water, fertile land, and honest leadership.'",
    question: "What semantic flaw occurs in grouping 'clean water', 'fertile land', and 'honest leadership' together under 'child access'?",
    options: [
      "A category mistake: 'clean water' and 'fertile land' are physical resources, while 'honest leadership' is a governance quality",
      "A grammatical concord error",
      "An unpunctuated dialogue tag",
      "A tense shift"
    ],
    answer: "A category mistake: 'clean water' and 'fertile land' are physical resources, while 'honest leadership' is a governance quality",
    hint: "Ensure parallel elements belong to the same logical category.",
    solution: "A category mistake groups disparate conceptual categories together under a single parallel governing verb, muddying analytical precision.",
    target: "Advanced Logic: Category Coherence in Parallelism"
  },
  {
    passage: "In a formal article, what is the 'nut graph'?",
    question: "Define the journalistic nut graph:",
    options: [
      "The paragraph following the lead hook that explains why the story matters now and outlines the central thesis",
      "The title of the newspaper",
      "The signature at the bottom of the article",
      "The photograph caption"
    ],
    answer: "The paragraph following the lead hook that explains why the story matters now and outlines the central thesis",
    hint: "It tells the reader in a nutshell why they should care about the issue.",
    solution: "In professional journalism, the nut graph follows the narrative hook, providing the structural core that explains the broader significance of the topic.",
    target: "Articles for Publication: The Nut Graph"
  },
  {
    passage: "A writer describes an abandoned village: 'Silence draped the deserted huts like a burial shroud.'",
    question: "What sensory and atmospheric mood is evoked by this simile?",
    options: [
      "A somber, eerie mood of mortality and desolation",
      "A joyful, festive atmosphere",
      "A comical, lighthearted tone",
      "A kinetic scene of violent motion"
    ],
    answer: "A somber, eerie mood of mortality and desolation",
    hint: "Comparing silence to a burial shroud evokes death and decay.",
    solution: "Comparing ambient silence to a burial shroud establishes an eerie, mournful mood of desolation through funerary imagery.",
    target: "Descriptive Writing: Atmospheric Mood Creation"
  },
  {
    passage: "A student writes: 'I would have went to the examination hall earlier if the bus had arrived on schedule.'",
    question: "What morphological error is present in the verb construction?",
    options: [
      "Using the simple past 'went' instead of the past participle 'gone' after the auxiliary 'would have'",
      "Using the past perfect in the if-clause",
      "Omitting the subjunctive marker",
      "Failing to capitalize 'examination'"
    ],
    answer: "Using the simple past 'went' instead of the past participle 'gone' after the auxiliary 'would have'",
    hint: "Compound modal auxiliaries mandate the past participle form.",
    solution: "The compound modal auxiliary 'would have' strictly governs the past participle form: 'I would have gone...', not the simple past 'went'.",
    target: "Verb Morphology: Past Participle Concord"
  },
  {
    passage: "In a debate, when a speaker points out that an opponent has failed to define the core terms of the motion, what weakness are they highlighting?",
    question: "Identify the tactical debate defect:",
    options: [
      "A lack of operational boundary and conceptual foundation for the debate",
      "A violation of the timekeeper's bell",
      "A spelling mistake in speech delivery",
      "An offensive ad hominem attack"
    ],
    answer: "A lack of operational boundary and conceptual foundation for the debate",
    hint: "Failing to define terms leaves arguments vague and unanchored.",
    solution: "Omitting operational definitions leaves an argument vulnerable to conceptual drifting, allowing the opponent to exploit the lack of defined parameters.",
    target: "Debate Logic: Definitional Vulnerabilities"
  },
  {
    passage: "A narrative includes: 'The rain ceased. The sky cleared. Hope returned.'",
    question: "What is the stylistic effect of these three short, staccato sentences placed after a lengthy descriptive paragraph?",
    options: [
      "They provide rhythmic relief and emphasize emotional restoration through crisp syntactic simplicity",
      "They demonstrate that the writer ran out of adjectives",
      "They represent an ungrammatical run-on sentence",
      "They confuse the temporal setting"
    ],
    answer: "They provide rhythmic relief and emphasize emotional restoration through crisp syntactic simplicity",
    hint: "Short sentences after long ones create dramatic pause and resolution.",
    solution: "Following complex descriptive prose with staccato, single-clause sentences creates rhythmic contrast, delivering emotional resolution with force.",
    target: "Syntactic Style: Staccato Rhythmic Contrast"
  },
  {
    passage: "In a formal article, what is the purpose of attributing claims to specific organizations (e.g., 'According to the Ghana Statistical Service...')?",
    question: "State the journalistic function:",
    options: [
      "To provide verifiable institutional authority and eliminate subjective bias",
      "To make the essay longer without thinking",
      "To advertise the government agency",
      "To avoid writing in the third person"
    ],
    answer: "To provide verifiable institutional authority and eliminate subjective bias",
    hint: "Attribution grounds arguments in verifiable evidence.",
    solution: "Attributing data to credible statutory authorities grounds an article in objective reality, strengthening persuasive credibility.",
    target: "Journalistic Craft: Authoritative Attribution"
  },
  {
    passage: "A candidate writes: 'The old fortress stood defiant against the crashing waves, a sentinel of forgotten wars.'",
    question: "What two figurative devices are merged in this architectural description?",
    options: [
      "Personification ('stood defiant') and metaphor ('a sentinel')",
      "Simile and hyperbole",
      "Oxymoron and euphemism",
      "Onomatopoeia and alliteration"
    ],
    answer: "Personification ('stood defiant') and metaphor ('a sentinel')",
    hint: "The building has a defiant human attitude and is directly called a guard/sentinel.",
    solution: "Giving human defiance to a fortress personifies the structure, while calling it a 'sentinel' without using 'like' or 'as' is a direct metaphor.",
    target: "Descriptive Writing: Merged Figurative Devices"
  },
  {
    passage: "A candidate applies the pure block address layout on a formal composition.",
    question: "Where must every paragraph line begin in pure block styling?",
    options: [
      "Flush against the left vertical margin without paragraph indentations, separated by blank lines",
      "Indented five spaces from the left margin",
      "Centered on the sheet",
      "Stepped progressively to the right"
    ],
    answer: "Flush against the left vertical margin without paragraph indentations, separated by blank lines",
    hint: "Block formatting removes tab indents in favor of vertical line spaces.",
    solution: "In pure block formatting, all paragraph lines begin flush against the left margin without indentations, with paragraphs demarcated by double vertical line spacing.",
    target: "Layout Formatting: Pure Block Standard"
  },
  {
    passage: "In an argumentative essay on technology, a writer notes: 'To claim that smartphones should be banned because students play games is akin to demanding the abolition of books because students read comic books.'",
    question: "What logical argumentation technique is being deployed?",
    options: [
      "Reductio ad absurdum via parallel analogy",
      "Circular reasoning",
      "Ad hominem",
      "Bandwagon appeal"
    ],
    answer: "Reductio ad absurdum via parallel analogy",
    hint: "Carrying the opponent's logic to its ridiculous extreme to demonstrate its flaw.",
    solution: "'Reductio ad absurdum' demonstrates the invalidity of a premise by showing that following its logic leads to an absurd, indefensible conclusion.",
    target: "Advanced Logic: Reductio ad Absurdum"
  },
  {
    passage: "A student writes: 'The committee have decided to postpone the speech day.'",
    question: "If 'committee' acts as a singular collective unit, what is the grammatical correction?",
    options: [
      "The committee has decided",
      "The committee were deciding",
      "The committees has decided",
      "The committee are decided"
    ],
    answer: "The committee has decided",
    hint: "A collective entity acting as a single corporate body takes a singular verb.",
    solution: "When a collective noun functions as a single unified entity, standard formal concord mandates the singular verb 'has decided'.",
    target: "Concord Mechanics: Collective Nouns"
  },
  {
    passage: "Under the 30-mark WAEC Paper 2 continuous writing rubric, how are marks allocated across criteria?",
    question: "Identify the official distribution:",
    options: [
      "Content: 10 marks, Organization: 5 marks, Expression: 10 marks, Mechanical Accuracy: 5 marks",
      "Content: 15 marks, Organization: 5 marks, Expression: 5 marks, Mechanical Accuracy: 5 marks",
      "Content: 10 marks, Organization: 10 marks, Expression: 5 marks, Mechanical Accuracy: 5 marks",
      "Content: 5 marks, Organization: 5 marks, Expression: 15 marks, Mechanical Accuracy: 5 marks"
    ],
    answer: "Content: 10 marks, Organization: 5 marks, Expression: 10 marks, Mechanical Accuracy: 5 marks",
    hint: "Content and Expression carry 10 marks each; Organization and MA carry 5 marks each.",
    solution: "The WAEC continuous writing rubric evaluates essays across four dimensions: Content (10), Organization (5), Expression (10), and Mechanical Accuracy (5), totaling 30 marks.",
    target: "WAEC Rubrics: Four-Tier Distribution"
  }
];

// =========================================================================
// 10 THEORY ESSAY WRITING TASKS (BASIC 9 ADVANCED LEVEL)
// =========================================================================
const theory10Prompts: TheoryEssayItem[] = [
  // 51. Narrative: Illustrating 'There Is No Shortcut to True Success'
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
    title: "The Price of a Fraudulent Shortcut",
    shortSummary: "Write a narrative story illustrating the truth that there is no shortcut to true success.",
    prompt: "Write a story that illustrates the truth of the saying: 'There is no shortcut to true success.' Narrate how an ambitious candidate neglected diligent revision and spent his family's savings to purchase leaked examination questions from an online fraudster, only to discover blank, mismatched papers in the examination hall, leading to his public disgrace.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Hubris Arc, Academic Tension Pacing & Organic Moral Synthesis",
    learningCompetency: "B9.4.2.1.1: Compose coherent narrative compositions illustrating moral truths through hubris, psychological tension, and ethical resolution.",
    hint: "Establish the student's initial impatience with hard study. Detail the clandestine transaction with the scammer, the panic inside the examination hall, and the bitter moral realization.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Price of a Fraudulent Shortcut",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing examination anxiety, fraudulent temptation, hall discovery climax, and moral ruin.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Academic Impatience", guidingQuestion: "Introduce final-year candidate Kofi, who wanted distinction grades without the grueling labor of revision.", transitionHints: ["With the final BECE examinations barely a fortnight away in Kumasi...", "Fifteen-year-old Kofi was gripped by desperation; having squandered months on social media, he sought an effortless escape..."] },
          { stageIndex: 2, role: "Inciting Incident & The Clandestine Deal", guidingQuestion: "Describe Kofi contacting an anonymous Telegram syndicate promising leaked questions and draining his mother's emergency savings.", transitionHints: ["The trap opened on an encrypted messaging platform where a syndicate promised verified 'WAEC master papers'...", "Stealing his mother's market savings, Kofi paid for the leaked questions, memorizing the answers overnight with arrogant triumph..."] },
          { stageIndex: 3, role: "The Examination Hall Climax", guidingQuestion: "Narrate opening the certified examination paper to discover completely different, unfamiliar questions.", transitionHints: ["Sitting in the tense silence of the examination hall as the invigilator unsealed the envelopes...", "Kofi flipped open the paper; blood drained from his face as he realized every single question was completely foreign..."] },
          { stageIndex: 4, role: "Denouement, Failure & Moral Realization", guidingQuestion: "Describe staring at the blank answer booklet in tears, failing the examination, and realizing the moral lesson.", transitionHints: ["While diligent classmates wrote with steady confidence, Kofi sat paralyzed, tears of bitter humiliation soaking his desk...", "Standing disqualified outside the hall, the ancient truth echoed in his conscience: there is no shortcut to true success..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Resolution & Moral Aphorism",
        proverbOrClosingPhrase: "There is no shortcut to true success.",
        integrationRule: "Embed the moral truth organically into Kofi's final reflection outside the examination center."
      }
    },
    rubric: createWAECRubric(
      ["Examination anxiety and dishonest ambition established (2 marks)", "Online fraud transaction and examination hall shock depicted vividly (4 marks)", "Academic disqualification and organic moral synthesis conveyed (4 marks)"],
      ["Character context clear", "Panic in exam hall depicted vividly", "Moral truth integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and psychological adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Price of a Fraudulent Shortcut\n___________________________________\n\nWith the final Basic Education Certificate Examination barely a fortnight away in Kumasi, fifteen-year-old Kofi was paralyzed by terror. Having squandered three academic terms loitering in video-game arcades and browsing social media, the vast syllabi of Mathematics and Integrated Science towered before him like insurmountable mountains. Instead of joining his disciplined classmates in afternoon past-question revision syndicates, Kofi desperately sought an effortless shortcut to academic distinction.\n\nThe trap sprang shut through an anonymous channel on an encrypted messaging application. A fraudulent operator calling himself 'The Exam Oracle' posted forged WAEC letterheads, guaranteeing authentic, unreleased examination papers in exchange for one thousand cedis. Blinded by panic and reckless vanity, Kofi sneaked into his widowed mother's wardrobe, stole her emergency trade savings, and wired the funds via mobile money. That midnight, a encrypted PDF document landed on his phone. For six feverish hours, Kofi memorized the ten essay answers verbatim, convinced that academic glory was already secured.\n\nThe moment of reckoning arrived in the quiet hall. The external supervisor unsealed the tamper-proof envelopes, and the crisp examination booklets were slapped face-down on the desks. \"You may begin,\" the invigilator commanded. With trembling fingers and an arrogant smirk, Kofi flipped his paper over. The blood drained from his face; his vision blurred in nauseating shock. The printed questions before him were completely different from the fraudulent document he had crammed! Not a single formula, graph, or essay prompt matched the scammer's file.\n\nPanic seized his throat. Around him, his diligent classmates wrote with calm, steady strokes, the rhythmic scratching of their pens mocking his frozen silence. Kofi stared at his empty answer booklet, sweat dripping from his chin onto the blank lines. When the final bell tolled, his booklet was collected completely empty. Disqualified and disgraced before his weeping mother, Kofi understood the bitter lesson etched into his conscience: there is no shortcut to true success.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 52. Descriptive: A Visit to the Stilt Village of Nzulezo
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
    title: "The Village Suspended on Water",
    shortSummary: "Write a descriptive travelogue capturing the sensory sights, canoe voyage, and stilt architecture of Nzulezo.",
    prompt: "Your school organized an educational excursion to the ancient stilt village of Nzulezo in the Western Region. Write a descriptive essay recreating the tranquil canoe voyage through the reed canal, the sudden revelation of the settlement built entirely on stilts over Lake Tadane, the creaking raffia walkways, and the unique aquatic way of life.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Spatial Aquatic Progression, Architectural Sensory Description & Cultural Immersion",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions recreating unique cultural architectures through spatial progression, multi-sensory registers, and evocative aesthetic reflection.",
    hint: "Use spatial progression: the canoe departure from Beyin, navigating the dark swamp canal of water lilies, emerging onto Lake Tadane to see the stilt village, and walking along the creaking timber walkways.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Nzulezo: The Wonder on Lake Tadane",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory journey from the coastal mainland across the swamp canal to the stilt village.",
        stagePrompts: [
          { stageIndex: 1, role: "Canoe Departure at Beyin", guidingQuestion: "Describe boarding the wooden dugout canoe at the marshy departure dock in Beyin.", transitionHints: ["Our journey to Ghana's most extraordinary aquatic settlement began at the coastal village of Beyin...", "Stepping into the narrow, hand-carved wooden dugout canoe, the dark peat water lapped gently against the timber hull..."] },
          { stageIndex: 2, role: "The Swamp Canal Voyage (Sensory Immersion)", guidingQuestion: "Depict paddling through the dark, mirror-like canal bordered by giant raffia palms and white water lilies.", transitionHints: ["The boatman's wooden paddle dipped silently into the black, amber-tinted waters of the Amansuri wetland...", "Towering raffia palms arched overhead, filtering the sunlight into emerald patterns while white water lilies floated like..."] },
          { stageIndex: 3, role: "Emerging onto Lake Tadane & The Stilt Village", guidingQuestion: "Describe bursting onto the wide lake and seeing the entire wooden community built on stilts above the water.", transitionHints: ["Gliding past the final curtain of reeds, the narrow canal opened dramatically into the expansive expanse of Lake Tadane...", "Rising straight out of the sparkling water stood Nzulezo: a complete settlement of wooden houses perched upon thousands of stilts..."] },
          { stageIndex: 4, role: "Walking on the Timber Walkways & Reflection", guidingQuestion: "Describe walking along the creaking raffia footpaths, observing children playing on decks, and reflecting on human harmony with nature.", transitionHints: ["Stepping onto the central wooden walkway, the floorboards creaked underfoot with the gentle swell of the lake below...", "Watching villagers paddle small canoes between doorways, I stood in awe of a people who have lived in perfect harmony with the water for centuries..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Aesthetic Reflection",
        proverbOrClosingPhrase: "Human ingenuity transforms the wildest waters into a sanctuary of home.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating indigenous architectural genius and ecological harmony."
      }
    },
    rubric: createWAECRubric(
      ["Beyin departure and canoe boarding established (2 marks)", "Sensory journey through the wetland canal and water lilies depicted vividly (4 marks)", "Stilt architecture, creaking walkways, and ecological harmony captured (4 marks)"],
      ["Aquatic setting vivid", "Sensory cues (sound, reflection, texture) rich", "Spatial progression clear"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich architectural and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `Nzulezo: The Wonder on Lake Tadane\n___________________________________\n\nOur journey to Ghana's most extraordinary aquatic settlement commenced at the marshy mainland harbor of Beyin in the Western Region. The morning air was crisp and cool, carrying the salty tang of the nearby Atlantic Ocean mingled with the rich, peaty fragrance of the Amansuri wetlands. Stepping cautiously into a long, hand-hewn dugout canoe, the dark, tannin-rich water lapped rhythmically against the weathered wooden hull as our guide took his position at the stern.\n\nThe voyage through the narrow wetland canal was an enchanting sensory immersion. For forty-five tranquil minutes, our boatman's wooden oar dipped silently into the obsidian water, which mirrored the sky like a sheet of black glass. Towering raffia palms and giant ferns leaned inward from both banks, weaving an emerald canopy that filtered the morning sun into dancing golden shafts. Elegant African jacanas strutted gracefully across broad, floating carpets of white water lilies, their long toes barely rippling the surface, while the only sound was the musical drip of water falling from the oar.\n\nWithout warning, the claustrophobic canal opened dramatically into the expansive, sunlit expanse of Lake Tadane. There, suspended miraculously above the calm water, stood Nzulezo. Emerging from the silver lake like an ancient mirage, the entire village—homes, shrines, churches, and school—was constructed entirely of raffia timber and bamboo poles, balanced atop thousands of sturdy hardwood stilts driven deep into the lakebed. Smoke drifted lazily from thatch chimneys, and colorful clotheslines fluttered in the lake breeze.\n\nStepping off the canoe onto the main communal deck, the interlocking wooden planks flexed and creaked gently beneath our shoes, offering glimpses of dark water swirling four meters below. Toddlers played fearlessly on open verandas, while women paddled miniature canoes between houses to trade fresh fish. Standing in that tranquil water-borne world, free from the roar of automotive engines and concrete towers, I marveled at the timeless architectural genius of our ancestors, proving that human ingenuity can build a sanctuary of peace upon the wildest waters.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 53. Article for Publication: Stemming the Tide of Brain Drain in Healthcare
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
    title: "Stemming the Exodus of Healthcare Professionals",
    shortSummary: "Write an article for publication in a national daily analyzing the brain drain of doctors and nurses to foreign countries.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'The Crippling Exodus of Healthcare Professionals: Causes, Consequences, and Remedies.' Analyze how poor working conditions, low remuneration, and lack of medical equipment compel certified Ghanaian doctors and nurses to migrate abroad, examine the resulting collapse of public hospital care, and propose two national policy solutions to retain medical talent.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Public Policy Analysis & Healthcare Retention Reforms",
    learningCompetency: "B9.4.2.1.2: Compose structured articles for publication analyzing specialized labor migration, public health infrastructure vulnerability, and statutory retention policies.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, economic push factors, healthcare collapse, and retention incentives.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "THE CRIPPLING EXODUS OF HEALTHCARE PROFESSIONALS: CAUSES AND REMEDIES",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Emmanuel Addae, Basic 9A",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Economic and Working Condition Push Factors -> Public Hospital Crisis -> Statutory Retention Interventions).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and cite the staggering numbers of registered nurses and doctors emigrating annually.", transitionHints: ["Across public hospital wards in Ghana today, an alarming institutional hemorrhage is underway...", "According to official reports from the Ghana Medical Association, thousands of certified doctors and nurses are abandoning our shores annually..."] },
          { stageIndex: 2, role: "Economic & Logistical Push Factors", guidingQuestion: "Analyze poor salaries, lack of basic diagnostic equipment, and overwhelming doctor-patient ratios.", transitionHints: ["This mass exodus is not driven by unpatriotic malice, but by unbearable professional conditions...", "Medical professionals work seventy-hour weeks in under-resourced wards without basic consumables like oxygen ventilators, earning salaries that..."] },
          { stageIndex: 3, role: "The Public Hospital Collapse", guidingQuestion: "Explain the tragic consequences on citizens: preventable maternal deaths, long surgical queues, and ward closures.", transitionHints: ["The repercussions on ordinary citizens are catastrophic...", "District hospitals are left with a single overworked doctor to attend to thousands of patients, resulting in delayed emergency surgeries and..."] },
          { stageIndex: 4, role: "Retention Policies & Call to Action", guidingQuestion: "Propose two actionable solutions (tax-free vehicle/housing incentives and modernized hospital equipment) with a national call to action.", transitionHints: ["To stem this devastating brain drain, the government must implement bold structural retention packages...", "First, the state must introduce tax-waiver vehicle schemes and subsidized mortgage loans for rural clinicians, while modernizing hospital..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & National Appeal",
        proverbOrClosingPhrase: "A nation that exports its healers mortgages the health of its future.",
        integrationRule: "End with an inspiring appeal urging policymakers to value and retain Ghana's medical professionals."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and healthcare brain drain crisis established (2 marks)", "Professional push factors and hospital care collapse analyzed (4 marks)", "Two actionable retention policy solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Economic and clinical factors detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive healthcare and economic vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `THE CRIPPLING EXODUS OF HEALTHCARE PROFESSIONALS: CAUSES AND REMEDIES\nBy Emmanuel Addae, Basic 9A\n\nInside the casualty wards and maternity corridors of Ghana's public hospitals, a silent and devastating institutional hemorrhage is taking place. According to alarming statistics released by the Ghana Medical Association, over four thousand registered nurses and hundreds of seasoned medical specialists have emigrated to the United Kingdom, North America, and the Middle East within the past twenty-four months alone. The very professionals educated with national taxpayers' funds to safeguard our lives are fleeing the country in search of dignity and survival.\n\nThis mass exodus is driven not by a lack of patriotism, but by unbearable working conditions and demoralizing remuneration. Medical practitioners in our public health centers face crushing workloads, often managing fifty patients per shift in under-equipped clinics lacking basic diagnostic consumables, reliable electricity, and functioning oxygen concentrators. Doctors routinely watch patients succumb to preventable emergencies simply because essential monitoring devices are absent. When this exhausting psychological trauma is paired with meager salaries that are rapidly eroded by inflation, emigration becomes an unavoidable economic escape for survival.\n\nThe human cost to our nation is catastrophic. Rural district hospitals have been stripped of surgical expertise, leaving whole districts with an alarming ratio of one doctor to thirty thousand citizens. Specialized pediatric and intensive care units are forced to turn away critically ill patients due to staffing shortages. Consequently, preventable maternal fatalities, delayed surgeries, and emergency room deaths have spiked across the country, reversing decades of hard-won public health gains.\n\nTo stem this crippling hemorrhage, the government must abandon superficial appeals to patriotism and institute tangible structural retention packages. First, the Ministry of Health must provide duty-free vehicle import waivers, subsidized housing mortgages, and rural hardship allowances to medical professionals stationed outside regional capitals. Second, the state must allocate capital funding to modernize hospital diagnostic laboratories, ensuring that our healers have the cutting-edge equipment necessary to practice their noble craft. A nation that exports its healers mortgages the survival of its future; we must value our health workers before our hospitals become empty monuments.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 54. Debate: Artificial Intelligence in Education (Proposing the Motion)
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
    title: "Artificial Intelligence Poses an Existential Threat to Human Learning",
    shortSummary: "Speak in support of the motion that artificial intelligence tools undermine authentic cognitive development.",
    prompt: "You are the principal speaker in an inter-schools debate competition on the motion: 'The Uncontrolled Integration of Artificial Intelligence in Basic Education Undermines Authentic Human Learning and Critical Thinking.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding cognitive atrophy and the erosion of original analytical writing, while refuting opposing claims on digital convenience.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B9.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on cognitive atrophy, essay plagiarism, and loss of problem-solving resilience. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that the uncontrolled integration of artificial intelligence in basic education severely undermines authentic human learning and critical thinking.",
        prohibitedOpenings: ["Good morning to you all", "I am here to tell you"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Cognitive Atrophy & Intellectual Laziness -> Loss of Original Essay Synthesis -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with unyielding philosophical conviction today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Cognitive Atrophy & Intellectual Passivity", guidingQuestion: "Explain how outsourcing homework to AI algorithms causes cognitive atrophy, destroying student capacity for mental struggle.", transitionHints: ["First and foremost, true human intelligence is forged in the fire of mental struggle...", "When learners outsource their geometry calculations, reading comprehension summaries, and scientific analysis to automated bots, the brain's neural pathways..."] },
          { stageIndex: 3, role: "Second Argument: Destruction of Original Synthesis & Voice", guidingQuestion: "Showcase how generative AI turns students into passive regurgitators of algorithmic prose, eliminating authentic personal voice.", transitionHints: ["Secondly, generative AI obliterates authentic creative voice and analytical synthesis...", "Instead of reading literature to understand human grief and triumph, students generate cookie-cutter essays with a single click, producing..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on personalized tutoring, deliver a fiery closing appeal, and say thank you.", transitionHints: ["My worthy opponents will celebrate AI as an omniscient digital tutor; however, this claim collapses because...", "With these undeniable truths, I urge you all to vote resoundingly in favor of the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "If you outsource your thinking to a machine, you surrender your humanity to an algorithm.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Cognitive atrophy and intellectual struggle argument developed cogently (4 marks)", "Erosion of creative voice and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"The Uncontrolled Integration of Artificial Intelligence in Basic Education Undermines Authentic Human Learning and Critical Thinking.\"\n\nFirst and foremost, genuine human intellect is forged in the crucible of cognitive struggle. Learning is not merely about arriving at a correct final answer; it is the rigorous, often frustrating process of wrestling with complex problems that strengthens neural pathways, cultivates patience, and builds creative resilience. When a junior high school pupil outsources their algebraic equations, reading comprehension summaries, and scientific deductions to generative chatbots, this vital mental struggle is short-circuited. The brain, like any muscle, atrophies when left unexercised. Students who rely on artificial intelligence do not become smarter; they become intellectually passive spectators who can do nothing without a digital prompt!\n\nSecondly, generative artificial intelligence obliterates authentic individual voice, moral reflection, and creative synthesis. Writing a literature essay is an act of deep personal empathy where a student grapples with human grief, justice, and character motives. Generative language models merely recombine statistical word patterns scraped from the internet, generating soulless, standardized prose. When pupils submit machine-generated essays on Akan proverbs or historical events, they bypass the profound emotional and moral growth that literature is designed to cultivate. We are creating a generation of academic mimics who possess vast databases on their screens but empty vaults in their minds.\n\nMy worthy opponents will celebrate artificial intelligence as an omniscient personal tutor that bridges educational gaps. But let us expose that seductive illusion! A tutor who whispers the answer into your ear before you have time to think is not a teacher; they are a saboteur of true education. Real learning demands trial, error, confusion, and breakthrough—qualities no automated algorithm can experience or teach.\n\nMr. Chairman, if you outsource your thinking to a machine, you surrender your intellectual sovereignty to an algorithm. Let us protect the sacred spark of human curiosity and critical thought. I urge this house to vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 55. Narrative: Illustrating 'A Bird in Hand Is Worth Two in the Bush'
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
    title: "Echoes of Disregard",
    shortSummary: "Write a narrative story illustrating the proverb: 'A bird in hand is worth two in the bush.'",
    prompt: "Write a story that illustrates the truth of the proverb: 'A bird in hand is worth two in the bush.' Narrate how an ambitious junior high school leaver abandoned an assured, funded apprenticeship at a respected manufacturing workshop to chase speculative promises of easy money in an illegal gold-trading syndicate, ending up penniless and disgraced.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Narrative Speculative Hubris Arc, Economic Tension & Organic Proverb Integration",
    learningCompetency: "B9.4.2.1.1: Compose coherent narrative stories illustrating moral proverbs through contrasting economic choices, sudden reversals of fortune, and moral resolution.",
    hint: "Show the protagonist's confirmed opportunity early. Contrast this secure, modest path with the glamorous illusion of the speculative venture, building to the decisive trap and moral realization.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Trap of Speculative Greed",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing confirmed apprenticeship, tempting get-rich-quick syndicate, police raid ruin, and moral awakening.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Confirmed Apprenticeship", guidingQuestion: "Introduce fifteen-year-old Kwabena securing an assured four-year mechanical fabrication apprenticeship in Obuasi.", transitionHints: ["Following his final basic school examinations in Obuasi, fifteen-year-old Kwabena stood at a crossroads...", "His uncle had secured him a fully funded four-year apprenticeship at a certified mining fabrication workshop, complete with a monthly stipend..."] },
          { stageIndex: 2, role: "Inciting Incident & The Get-Rich-Quick Mirage", guidingQuestion: "Describe an old acquaintance luring him with tales of fast millions made trading illicit alluvial gold dust.", transitionHints: ["The disruption arrived when an old classmate named Morgan rolled into town driving a rented convertible...", "\"Why spend four years inhaling welding fumes for pennies when you can earn thousands of dollars a week in gold trading?\" he teased..."] },
          { stageIndex: 3, role: "Rising Action & The Illegal Syndicate Raid", guidingQuestion: "Narrate Kwabena surrendering his apprenticeship tools to invest in a black-market gold shipment, only for police to raid the hotel room.", transitionHints: ["Rejecting his uncle's furious warnings, Kwabena sold his mechanical toolkits and handed all his savings to Morgan...", "Inside a dingy transit motel room while inspecting a bag of supposed gold dust, heavy boots kicked the door open as police commandos raided..."] },
          { stageIndex: 4, role: "Climax, Ruin & Proverbial Realization", guidingQuestion: "Describe discovering the gold was brass dust, the arrest of the syndicate, and realizing the proverb in a prison cell.", transitionHints: ["Handcuffed to the radiator, Kwabena watched forensic officers reveal that the 'gold' was worthless brass shavings...", "Stripped of his savings and with his apprenticeship forfeited to another boy, he wept in bitter ruin: a bird in hand is worth two in the bush..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Moral Synthesis",
        proverbOrClosingPhrase: "A bird in hand is worth two in the bush.",
        integrationRule: "Embed the proverb into Kwabena's final realization inside the juvenile detention cell."
      }
    },
    rubric: createWAECRubric(
      ["Confirmed apprenticeship baseline and setting established (2 marks)", "Tempting illicit gold syndicate and tool abandonment depicted vividly (4 marks)", "Police raid climax, brass dust revelation, and organic proverb integration (4 marks)"],
      ["Character context clear", "Temptation depicted vividly", "Proverb integrated organically"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative voice (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Expressive narrative vocabulary (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and suspenseful adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Trap of Speculative Greed\n_____________________________\n\nFollowing the completion of his basic school examinations in the mining town of Obuasi, fifteen-year-old Kwabena held the keys to an assured, honorable future. His paternal uncle, a chief mechanical engineer, had secured him a coveted four-year apprenticeship at a certified mining fabrication workshop. The placement included full protective gear, tool stipends, and a guaranteed technician post upon graduation. His family celebrated the milestone with prayers of gratitude.\n\nHowever, a reckless impatience for wealth poisoned Kwabena's mind. The disruption arrived in the persona of Morgan, a former schoolmate who had vanished two years earlier and now returned driving a flashy rented vehicle, draped in gold chains. Spotting Kwabena in his work overalls, Morgan laughed mockingly: \"Why waste four precious years inhaling welding fumes for a meager monthly allowance? Join our gold-trading network; we buy raw alluvial nuggets from bush miners and flip them to foreign syndicates for ten times the price! You could own your own car before Christmas.\"\n\nBlinded by the illusion of overnight riches, Kwabena ignored his uncle's stern warnings. He sold the professional socket sets and welding helmets his family had purchased for him, emptied his savings, and joined Morgan in a dingy hotel room in Dunkwa to execute his first gold purchase. Clutches of banknotes were exchanged for a heavy leather pouch containing glittering yellow powder. Kwabena's heart raced with euphoric triumph—wealth had arrived so easily!\n\nThe nightmare struck with bone-crushing suddenness. A tactical squad of armed police officers kicked the door inward, shouting orders as laser sights painted their chests. Pinned face-down against the linoleum floor in handcuffs, the devastating truth unfolded. A field forensic assay revealed that the pouch contained worthless chemical-plated brass shavings; Morgan was a con artist who had staged the entire deal to swindle him! Both were arrested. Sitting on the cold concrete floor of the cell, realizing that his savings were gone and his legitimate apprenticeship forfeited forever, Kwabena wept in bitter despair. Truly, a bird in hand is worth two in the bush.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 56. Descriptive: The Anatomy of a Municipal Demolition Exercise
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
    title: "When the Bulldozers Came to Old Fadama",
    shortSummary: "Write a descriptive essay capturing the sights, sounds, and visceral human drama of a municipal slum demolition exercise.",
    prompt: "Municipal authorities deployed heavy excavators to clear an unauthorized commercial settlement built along a protected drainage canal. Write a descriptive essay recreating the dawn arrival of the bulldozers, the deafening roar of crashing masonry, the dust-choked air, and the heartbreaking human tragedy of displaced residents.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Urban Destruction Description, Mechanical Kinetic Imagery & Human Pathos",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions recreating urban crisis events through kinetic verbs, industrial auditory cacophony, and emotional nuance.",
    hint: "Use spatial progression: the tense dawn arrival of police escorts and yellow excavators, the mechanical crunch of timber and concrete, the swirling clouds of gray dust, and the tragic aftermath of scattered livelihoods.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Roar of the Iron Juggernauts",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression through an urban demolition exercise from dawn arrival to the dust-choked aftermath.",
        stagePrompts: [
          { stageIndex: 1, role: "The Dawn Confrontation", guidingQuestion: "Set the scene at dawn as armed police barricades and giant yellow excavators roll into the settlement.", transitionHints: ["The morning broke over Old Fadama not with the usual chatter of market traders, but with...", "A menacing convoy of armored police carriers and three yellow Caterpillar excavators rumbled into the narrow unpaved alleys..."] },
          { stageIndex: 2, role: "The Mechanical Crunch of Destruction", guidingQuestion: "Describe the steel excavator bucket smashing through concrete blocks, tearing zinc sheets, and crushing wooden kiosks.", transitionHints: ["The assault on the illegal structures commenced with mechanical brutality...", "The excavator's massive steel claws tore into the corrugated zinc roofs with an ear-splitting screech of tearing metal, crushing..."] },
          { stageIndex: 3, role: "The Sensory Landscape of Chaos (Dust & Shouts)", guidingQuestion: "Depict the suffocating clouds of gray plaster dust, screams of distraught mothers, and frantically salvaged belongings.", transitionHints: ["A blinding, suffocating blizzard of pulverized cement dust and red clay billowed into the morning air...", "Distraught women shrieked in grief, frantically dragging foam mattresses, plastic basins, and sewing machines from..."] },
          { stageIndex: 4, role: "The Wasteland Aftermath & Emotional Reflection", guidingQuestion: "Describe the smoking ruins after the machines departed and reflect on the tragic clash between city planning and human survival.", transitionHints: ["By midday, where a bustling commercial community had stood hours before, only an apocalyptic wasteland remained...", "Sitting upon the rubble of their livelihoods under the scorching sun, I stood silenced by the brutal tragedy of urban poverty..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Tragic Reflection",
        proverbOrClosingPhrase: "The wheel of urban order crushes the fragile shelters of the poor.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis reflecting on the painful tension between urban law and human survival."
      }
    },
    rubric: createWAECRubric(
      ["Dawn demolition setting and excavator arrival established (2 marks)", "Mechanical crushing action and sensory dust storm depicted vividly (4 marks)", "Human tragedy, salvaged belongings, and tragic aftermath conveyed (4 marks)"],
      ["Urban crisis setting vivid", "Sensory cues (sound, dust, sight) rich", "Emotional pathos captured"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich industrial and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Kinetic words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `The Roar of the Iron Juggernauts\n_______________________________\n\nThe dawn broke over Old Fadama not with the familiar cheerful aroma of brewing porridge and the morning laughter of children, but with a cold, vibrating mechanical dread. A menacing convoy of armored police personnel carriers, flashing crimson strobe lights, rolled into the unpaved streets, flanking three colossal yellow Caterpillar excavators. The heavy steel tracks of the iron juggernauts clattered violently against the gravel, grinding the damp morning silence into powder as armed taskforce officers erected perimeter barriers.\n\nWithout warning, the destruction commenced with unyielding brutality. The lead excavator raised its massive hydraulic arm, paused for a heartbeat against the gray morning sky, and slammed its jagged steel bucket straight through the concrete block walls of an unauthorized pharmacy. An ear-splitting shriek of tearing zinc roofing and splintering timber rafters tore through the air. Brick walls collapsed with thunderous, echoing crashes, pulverizing cement blocks into powdery rubble within seconds. The excavator's tracks rolled forward relentlessly, crushing furniture, television sets, and wooden kiosks into splintered firewood.\n\nThe sensory landscape was an overwhelming storm of chaos. A suffocating, blinding cloud of powdered gray cement and red clay dust billowed twenty meters into the humid air, coating eyelashes and burning throats. Through this apocalyptic fog ran distraught women, shrieking in despair as they desperately hauled foam mattresses, plastic laundry basins, and commercial sewing machines from homes seconds before the steel claws struck. Children clutched their mothers' skirts, weeping in paralyzed terror, while barrow-pushers bellowed frantic warnings amid the choking haze.\n\nBy midday, the machines withdrew, leaving behind a scarred, smoking wasteland of twisted metal reinforcement rods, shattered cinder blocks, and crushed belongings where an energetic community had stood at sunrise. Sitting on the hot rubble under the blazing sun, watching displaced families sift through debris for remnants of their lives, I was haunted by the brutal, heartbreaking collision between urban law and the desperate struggle for human survival.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 57. Article for Publication: Monetized Online Gaming and Teen Addiction
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
    title: "Digital Gamblers: The Rise of Monetized Gaming Addiction",
    shortSummary: "Write an article for publication in a national daily on commercial micro-transactions and betting in online gaming targeting minors.",
    prompt: "Write an article for publication in a national daily newspaper titled: 'The Peril of Monetized Gaming and Youth Betting Addiction.' Examine how online video-game developers use predatory gambling mechanisms like 'loot boxes' and sports betting integrations to entrap teenagers, analyze the resulting financial and academic fallout, and propose two statutory regulatory interventions by the Gaming Commission.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Journalistic Article Architecture, Digital Addiction Analysis & Regulatory Gaming Governance",
    learningCompetency: "B9.4.2.1.2: Compose structured articles for publication analyzing digital micro-transactions, juvenile gambling addiction, and statutory gaming commission oversight.",
    hint: "Do NOT write postal addresses, dates, or 'Yours faithfully,'. Start with a bold headline, add your byline underneath, and structure your essay into lead hook, deceptive gaming mechanics, academic/financial ruin, and statutory gaming regulations.",
    guidanceScaffold: {
      genreType: "article_publication",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "full_caps_no_underline",
        modelHeadline: "THE PERIL OF MONETIZED GAMING AND YOUTH BETTING ADDICTION",
        rules: ["Must be written in ALL CAPITAL LETTERS without an underline.", "Must never end with a period."]
      },
      bylineGuide: {
        isRequired: true,
        modelByline: "By Kelvin Amartey, Basic 9B",
        rules: ["Position directly beneath the headline.", "State author name and class stream."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Expository journalistic article framework (Lead Hook -> Predatory Algorithmic Mechanics -> Psychological & Financial Ruin -> Statutory Regulatory Governance).",
        stagePrompts: [
          { stageIndex: 1, role: "Lead Paragraph", guidingQuestion: "Hook the reader and examine how modern digital video games have evolved from innocent pastimes into predatory gambling hubs.", transitionHints: ["Behind the innocent, flashing screens of mobile video games across Ghana today...", "A dangerous, multi-billion-dollar predatory gambling architecture has quietly ensnared thousands of junior high school pupils..."] },
          { stageIndex: 2, role: "Predatory Algorithmic Mechanics (Loot Boxes)", guidingQuestion: "Analyze how game developers deploy psychological conditioning, 'loot boxes', and betting odds to extract money from minors.", transitionHints: ["Video-game companies no longer sell simple entertainment; they engineer addictive psychological casinos...", "Through deceptive mechanics like randomized 'loot boxes' and virtual currency, children are conditioned to wager real money on fluctuating digital odds..."] },
          { stageIndex: 3, role: "Financial Thefts & Academic Collapse", guidingQuestion: "Examine the real-world fallout: children stealing family credit cards, falling into debt, and experiencing severe academic failure.", transitionHints: ["The real-world consequences of this digital addiction are devastating families...", "Pupils drain their parents' mobile money accounts, fall into chronic debt with peers, and abandon classroom study to..."] },
          { stageIndex: 4, role: "Gaming Commission Regulations & Call to Action", guidingQuestion: "Propose two actionable solutions (reclassifying loot boxes as formal gambling under the Gaming Act and mandatory biometric age-verification).", transitionHints: ["To rescue our youth from this digital trap, the state must establish uncompromising regulatory guardrails...", "The Gaming Commission of Ghana must officially classify in-game loot boxes as illegal gambling for minors, while telecommunications networks..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Digital Protection Appeal",
        proverbOrClosingPhrase: "Childhood curiosity must never be exploited by corporate digital casinos.",
        integrationRule: "End with an inspiring appeal urging telecommunications regulators and parents to shield youth from exploitative gaming."
      }
    },
    rubric: createWAECRubric(
      ["Lead hook and monetized gaming crisis established (2 marks)", "Predatory mechanics and financial/academic devastation analyzed (4 marks)", "Two actionable Gaming Commission regulatory solutions and peroration presented (4 marks)"],
      ["Lead hook clear", "Predatory digital mechanics detailed", "Actionable solutions proposed"],
      ["Un-underlined All-Caps headline (1 mark)", "Byline correctly positioned (1 mark)", "Pure article layout without addresses or sign-offs (1 mark)", "4 coherent expository paragraphs (1 mark)", "Smooth logical transitions (1 mark)"],
      ["Headline correct", "Byline present", "Zero letter format contamination"],
      ["Formal, objective journalistic tone (4 marks)", "Zero informal contractions (3 marks)", "Persuasive technological and regulatory vocabulary (3 marks)"],
      ["Objective register", "No slang or contractions", "Rich academic vocabulary"]
    ),
    modelAnswer: `THE PERIL OF MONETIZED GAMING AND YOUTH BETTING ADDICTION\nBy Kelvin Amartey, Basic 9B\n\nBehind the flashing, vibrant screens of mobile phones and gaming consoles across urban Ghana today, a sinister and highly lucrative psychological trap is destroying young minds. What parents naively assume to be innocent childhood entertainment has been systematically re-engineered by multi-billion-dollar corporate tech syndicates into predatory, virtual gambling casinos designed to addict and exploit adolescents.\n\nModern video-game developers no longer rely on simple game sales. Instead, they embed deceptive behavioral psychology into mobile applications through 'loot boxes' and pay-to-win micro-transactions. A loot box is a virtual treasure chest containing mystery digital items—rare character outfits, weapons, or virtual gold. Because the contents are completely randomized, players are forced to purchase multiple digital keys using real mobile money, wagering cash on minuscule mathematical odds in the hope of striking a rare reward. This is textbook gambling, disguised beneath colorful cartoon animations and flashing sound effects that flood young brains with addictive dopamine rushes.\n\nThe socio-economic fallout in our homes is heartbreaking. Addicted teenagers drain their school lunch allowances, forge parents' signatures, and secretly transfer funds from family mobile money wallets to satisfy their digital cravings. In several basic schools, candidates preparing for the BECE have abandoned revision to trade virtual casino accounts or place bets on simulated soccer matches. When allowances run dry, students fall into debt, suffer severe sleep deprivation, and experience alarming academic failure.\n\nTo dismantle this digital trap, the state must take urgent statutory action. The Gaming Commission of Ghana must formally amend the Gaming Act to classify video-game loot boxes and paid digital chance mechanics as regulated gambling, imposing severe fines on software distribution platforms that market these mechanisms to individuals under eighteen. Furthermore, telecommunications networks must enforce mandatory parental biometric authentication on all mobile micro-transactions. Childhood curiosity must never be monetized by predatory digital casinos; we must safeguard the minds of our youth.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 58. Debate: Indigenous Traditional Governance vs. Western Multiparty Democracy
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
    title: "Indigenous Chieftaincy Promotes Stability Better Than Multiparty Politics",
    shortSummary: "Speak in support of the motion that indigenous traditional governance fosters national cohesion better than Western partisan politics.",
    prompt: "You are the principal speaker in a prestigious inter-schools debate competition on the motion: 'Indigenous Traditional Governance Fosters National Cohesion and Development Far Better Than Western Multiparty Democracy.' Write your debate speech in support of the motion, delivering at least two convincing arguments regarding consensus decision-making and non-partisan unity, while refuting opposing claims on chieftaincy succession conflicts.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Parliamentary Vocative Protocol, Stance Proclamation & Oratorical Refutation",
    learningCompetency: "B9.4.2.1.2: Compose persuasive debate speeches observing parliamentary salutations, explicit stance declarations, logical argument progression, and forensic rebuttals.",
    hint: "Open with the full parliamentary vocative hierarchy. State your stance firmly. Present arguments on consensus governance without divisive political parties, and traditional leaders as permanent custodians of land and peace. Conclude with 'Thank you.'",
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
        stanceProclamationModel: "I stand firmly on this august podium today to stoutly defend the motion which asserts that Indigenous Traditional Governance fosters national cohesion and development far better than Western Multiparty Democracy.",
        prohibitedOpenings: ["Good morning to you all", "I am here to tell you"]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Parliamentary debate speech framework (Vocative & Stance -> Consensus vs. Partisan Polarization -> Long-Term Custodial Stewardship -> Rebuttal & Peroration).",
        stagePrompts: [
          { stageIndex: 1, role: "Vocative Hierarchy & Stance Declaration", guidingQuestion: "Deliver the full parliamentary vocatives and declare your motion support unequivocally.", transitionHints: ["Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen...", "I rise with fearless intellectual conviction today to defend the motion which asserts that..."] },
          { stageIndex: 2, role: "First Argument: Consensus Governance vs. Partisan Warfare", guidingQuestion: "Contrast divisive multiparty political polarization with indigenous consensus-building through councils of elders.", transitionHints: ["First and foremost, Western multiparty democracy has fractured our nation along toxic partisan fault lines...", "Every four years, partisan elections tear communities apart with ethnic hostility, vote-buying, and political violence, whereas indigenous chieftaincy operates on..."] },
          { stageIndex: 3, role: "Second Argument: Long-Term Custodial Stewardship vs. 4-Year Myopia", guidingQuestion: "Showcase traditional rulers as permanent, ancestral custodians of land, natural resources, and cultural cohesion.", transitionHints: ["Secondly, consider the timeline of development...", "While partisan politicians operate on myopic four-year election cycles—abandoning previous projects out of political spite—traditional rulers provide permanent..."] },
          { stageIndex: 4, role: "Rebuttal of Opponent's Claim & Peroration", guidingQuestion: "Refute opponents' claims on chieftaincy disputes, deliver an inspiring closing appeal, and say thank you.", transitionHints: ["My worthy opponents will point trembling fingers at localized chieftaincy succession disputes; however, this claim collapses because...", "With these undeniable truths, I urge you all to vote resoundingly in favor of the motion. Thank you."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Peroration & Final Sign-Off",
        proverbOrClosingPhrase: "A nation that borrows foreign political garments will always shiver in the cold of instability.",
        integrationRule: "End with an oratorical flourish summarizing your stance and terminate strictly with 'Thank you.'"
      }
    },
    rubric: createWAECRubric(
      ["Parliamentary vocatives and motion support declared firmly (2 marks)", "Consensus governance vs. partisan polarization argument developed cogently (4 marks)", "Long-term custodial stewardship and opponent refutation delivered effectively (4 marks)"],
      ["Vocatives correctly ordered", "Two strong arguments presented", "Opponent refuted and thank you provided"],
      ["Strict descending vocative order (1 mark)", "Clear stance declaration in paragraph 1 (1 mark)", "Logical 4-paragraph oratorical progression (1 mark)", "Direct engagement with audience (1 mark)", "Formal 'Thank you' valediction (1 mark)"],
      ["Vocative hierarchy complete", "Stance explicit", "No letter format contamination"],
      ["Persuasive oratorical register (4 marks)", "Effective rhetorical questions and tricolons (3 marks)", "Zero informal contractions (3 marks)"],
      ["Persuasive debate register", "Rhetorical devices active", "No informal slang"]
    ),
    modelAnswer: `Mr. Chairman, Distinguished Panel of Adjudicators, Accurate Timekeeper, Worthy Opponents, Ladies and Gentlemen:\n\nI stand firmly on this august podium today to stoutly defend the motion which asserts that: \"Indigenous Traditional Governance Fosters National Cohesion and Development Far Better Than Western Multiparty Democracy.\"\n\nFirst and foremost, examine the devastating social cost of Western multiparty politics across post-colonial Africa. Far from uniting our people, partisan democracy has fractured our nation along toxic tribal, regional, and ideological fault lines. Every four years, electoral campaigns turn brother against brother, flooding our airwaves with bitter insults, political vigilantism, and multi-million-cedi vote-buying. In stark contrast, indigenous traditional governance is built upon the timeless philosophy of consensus. In a traditional council, decisions are not forced through by a tyrannical fifty-one percent majority; the chief and his council of elders deliberate patiently under the palaver tree until mutual consensus is forged, preserving communal peace and collective harmony.\n\nSecondly, traditional governance guarantees long-term custodial stewardship over national development. Partisan politicians operate within short-sighted, myopic four-year election cycles. Driven by electoral desperation, they launch superficial projects simply to win the next ballot, routinely abandoning previous administrations' uncompleted hospitals, schools, and roads out of political spite. A traditional ruler, however, reigns for life as a sacred custodian holding land, water, and cultural heritage in trust for the ancestors, the living, and generations yet unborn. Look at Otumfuo's educational fund or the Asanteman development initiatives—interventions that have educated thousands regardless of political affiliation! Traditional institutions provide unbroken developmental continuity.\n\nMy worthy opponents will point trembling fingers at localized chieftaincy succession disputes. But let us expose their hypocrisy! Are chieftaincy succession disputes any worse than the bloody civil wars, post-electoral coups, and political riots spawned by partisan elections across Africa? Incontestably not! Chieftaincy conflicts are settled through established customary judicial houses, whereas partisan conflicts burn down parliaments and plunge nations into debt.\n\nMr. Chairman, a nation that borrows foreign political garments will always shiver in the cold of instability. Let us return to the wisdom of our ancestral stools. I urge this house to vote resoundingly in favor of the motion.\n\nThank you.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 59. Narrative: The Catastrophic Fire at the Timber Market
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
    title: "Inferno at the Timber Market",
    shortSummary: "Write a narrative story recounting the catastrophic fire that leveled a regional timber market.",
    prompt: "An accidental fire sparked by an unattended welding torch ignited heaps of dry sawdust and seasoned timber at the municipal wood market. Write a narrative essay recounting the sudden explosion, the towering inferno consuming warehouses, the desperate struggle of artisans to salvage equipment, and the heroic arrival of firefighters.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Dramatic Action Pacing, Industrial Disaster Imagery & Heroic Crisis Resolution",
    learningCompetency: "B9.4.2.1.1: Compose suspenseful narrative stories depicting industrial emergency disasters, communal solidarity, and crisis resolution.",
    hint: "Start with the busy afternoon woodworking baseline. Describe the careless spark hitting dry sawdust, the explosive blaze sweeping through timber stacks, the desperate struggle to save machinery, and the arrival of fire tenders.",
    guidanceScaffold: {
      genreType: "narrative_proverbial",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "The Day the Timber Market Burned",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Narrative plot arc tracing busy timber market baseline, spark ignition, roaring inferno, and firefighting containment.",
        stagePrompts: [
          { stageIndex: 1, role: "Exposition & Commercial Baseline", guidingQuestion: "Describe a bustling Friday afternoon at the Anloga Timber Market with shrieking electric saws and mountains of fragrant cedar sawdust.", transitionHints: ["The Friday afternoon air inside the Anloga Timber Market in Kumasi was charged with bustling industry...", "The high-pitched screech of industrial electric saws slicing through mahogany logs harmonized with the sweet scent of cedar sawdust..."] },
          { stageIndex: 2, role: "Inciting Incident & The Careless Spark", guidingQuestion: "Describe an apprentice welding a steel frame near an uncleaned pile of dry wood shavings, sending a spark into the sawdust.", transitionHints: ["Disaster was born of careless negligence at a metal fabrication shed...", "A rogue shower of red-hot sparks from an electric welding torch drifted onto a towering mountain of dry sawdust..."] },
          { stageIndex: 3, role: "Rising Action & The Roaring Inferno", guidingQuestion: "Narrate the fire leaping across stacked seasoned boards, exploding paint barrels, and the panicked scramble of carpenters.", transitionHints: ["Fed by the dry harmattan wind, a tiny smolder exploded into a roaring monster of flame within seconds...", "Towering columns of crimson fire leaped across seasoned timber stacks, igniting lacquer drums that exploded with deafening booms..."] },
          { stageIndex: 4, role: "Climax, Fire Service Containment & Denouement", guidingQuestion: "Describe the arrival of multiple fire service tenders, the chemical foam battle, and reflecting on the ruin.", transitionHints: ["Sirens wailed as five municipal fire tenders smashed through the perimeter barricades...", "Braving blistering thermal heat, heroic firefighters trained pressurized foam hoses on the blaze, saving adjacent homes as artisans wept..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Heroic Reflection",
        proverbOrClosingPhrase: "A tiny neglected spark burns down the grandest forest.",
        integrationRule: "Conclude with an emotional reflection celebrating vigilant safety discipline and human solidarity."
      }
    },
    rubric: createWAECRubric(
      ["Timber market setting and industrial baseline established (2 marks)", "Careless spark ignition and explosive inferno depicted vividly (4 marks)", "Fire service containment, human tragedy, and safety lesson conveyed (4 marks)"],
      ["Market setting established", "Fire inferno vivid and kinetic", "Containment and aftermath clear"],
      ["Underlined Title Case headline (1 mark)", "Clear 4-paragraph chronological progression (1 mark)", "Smooth transitional markers (1 mark)", "Direct speech dialogue punctuated correctly (1 mark)", "Consistent narrative perspective (1 mark)"],
      ["Headline correct", "Paragraph breaks logical", "Dialogue mechanics accurate"],
      ["Dynamic action verbs and fire disaster imagery (4 marks)", "Consistent past tense aspect (3 marks)", "Vivid sensory and dramatic adjectives (3 marks)"],
      ["Action verbs active", "Consistent tense", "Good vocabulary variety"]
    ),
    modelAnswer: `The Day the Timber Market Burned\n_________________________________\n\nThe Friday afternoon air inside the Anloga Timber Market in Kumasi was charged with deafening industrial enterprise. The high-pitched screech of heavy circular band-saws slicing through massive mahogany logs competed with the rhythmic hammering of carpenters assembling wardrobe frames. The dry, sweet fragrance of freshly planed cedar and pine hung thick in the air, while mountains of golden sawdust blanketed the ground like freshly fallen snow.\n\nDisaster ignited from a single moment of reckless complacency. In an open metal welding stall adjacent to our workshop, an apprentice was operating an electric arc welder. Ignoring standard safety regulations, he failed to erect protective metal screens or sweep away the surrounding debris. A spray of incandescent sparks flew into a towering heap of dry wood shavings. Within seconds, a hidden smolder blossomed into an aggressive flame, quickly fed by the dry, gusty afternoon wind.\n\nWhat followed was an apocalyptic inferno. The fire leaped with terrifying ferocity across thousands of stacked, seasoned timber boards, transforming the wood market into a roaring furnace. Barrels of industrial wood lacquer and paint thinner exploded with earth-shattering booms, hurling balls of orange fire fifty meters into the sky. Pandemonium erupted as hundreds of artisans shrieked in terror, desperately hauling heavy electric plane machines and furniture sets into the central road while choking on blinding, black chemical smoke.\n\nJust as the roaring wall of fire threatened to jump the street and engulf a nearby residential school, five Ghana National Fire Service tenders arrived with sirens screaming. Deploying high-pressure chemical foam hoses, the fearless firefighters formed a human defensive line, battling blistering radiant heat that scorched the paint on their helmets. For three exhausting hours, water cannons pounded the flames until the roaring monster was reduced to hissing, smoldering ash. Standing amid the charred, smoking ruins of our family workshop, my father squeezed my shoulder in grief. A single careless spark had destroyed twenty years of hard labor in three hours. Truly, a tiny neglected spark burns down the grandest forest.`,
    workedSolution: "1. Content: 10/10 | 2. Organization: 5/5 | 3. Expression: 10/10 | 4. Mechanical Accuracy: 5/5 | Total: 30/30 (WAEC Grade 1 - Distinction)"
  },

  // 60. Descriptive: Nocturnal Vigil in a Hospital Trauma Unit
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
    title: "Vigil in the Hall of Shadows",
    shortSummary: "Write a descriptive essay capturing the sights, clinical smells, and emotional tension of an emergency trauma unit at 2:00 a.m.",
    prompt: "While waiting for emergency test results for an injured relative, you spent a nocturnal vigil in the intensive trauma unit of a major teaching hospital. Write a descriptive essay recreating the cold fluorescent glare, the clinical chemical scents, the electronic hum of life-support monitors, and the profound human vulnerability of the night.",
    wordCountLimit: { min: 180, target: 250, max: 320 },
    points: 30,
    competencyTarget: "Clinical Sensory Description, Atmospheric Nocturnal Tension & Emotional Depth",
    learningCompetency: "B9.4.2.2.1: Write descriptive compositions recreating high-stakes medical environments through multi-sensory registers, emotional nuance, and spatial progression.",
    hint: "Use spatial progression: the sterile, brightly lit emergency reception at 2:00 a.m., moving into the intensive trauma corridor, the electronic chorus of life-support monitors, and the quiet arrival of dawn light.",
    guidanceScaffold: {
      genreType: "descriptive_travelogue",
      headlineGuide: {
        isRequired: true,
        recommendedStyle: "title_case_underlined",
        modelHeadline: "Nocturnal Shadows in the Trauma Ward",
        rules: ["Must be underlined in Title Case.", "Never end with a period."]
      },
      plotOrSpatialRoadmap: {
        recommendedParagraphs: 4,
        targetWordCount: 250,
        minimumWordCount: 180,
        frameworkDescription: "Spatial and sensory progression through an emergency trauma ward at 2:00 a.m. from reception to the intensive care bay.",
        stagePrompts: [
          { stageIndex: 1, role: "Arrival in the 2:00 AM Ward", guidingQuestion: "Set the scene at 2:00 a.m. inside the emergency trauma corridor where bright fluorescent light strips away the night.", transitionHints: ["At 2:00 a.m., the intensive trauma unit of Komfo Anokye Teaching Hospital existed in a parallel reality...", "Outside, the city slept in darkness, but inside the emergency wing, harsh fluorescent tubes bleached all shadow from the polished linoleum..."] },
          { stageIndex: 2, role: "The Olfactory & Auditory Symphony", guidingQuestion: "Describe the sharp smell of antiseptic and oxygen, mingled with the persistent electronic pulse of monitors and hurried rubber soles.", transitionHints: ["The sensory landscape was an intoxicating assault of clinical precision...", "The sharp, biting odor of methylated spirit and chlorine bleach hung heavy in the air, beneath which pulsed the relentless electronic heartbeat of..."] },
          { stageIndex: 3, role: "The Human Drama of Fragility (Visual & Emotional)", guidingQuestion: "Depict exhausted surgeons in blood-spattered scrubs, trembling relatives whispering prayers, and plastic intravenous tubes.", transitionHints: ["Down the narrow corridor, the fragility of human existence was laid bare...", "Exhausted surgical interns with shadowed eyes conferenced in hushed tones, while weeping relatives huddled against the walls, clutching..."] },
          { stageIndex: 4, role: "The Dawn Respite & Philosophical Reflection", guidingQuestion: "Describe the arrival of cool morning light through high windows and reflect on the selfless courage of medical workers.", transitionHints: ["When the first pale amber fingers of dawn finally reached through the high frosted louvres, the frantic pace slowed...", "Sitting beside my recovering brother, watching nurses adjust their final shift charts, I felt profound reverence for the healers who hold the line between life and death..."] }
        ]
      },
      moralOrPerorationGuide: {
        role: "Humanitarian Synthesis",
        proverbOrClosingPhrase: "In the darkest corridors of suffering, human compassion burns as the brightest beacon.",
        integrationRule: "Conclude with an appreciative aesthetic synthesis celebrating clinical devotion and human resilience."
      }
    },
    rubric: createWAECRubric(
      ["Hospital trauma setting and 2:00 a.m. atmosphere established (2 marks)", "Antiseptic smell and electronic auditory cues conveyed vividly (4 marks)", "Surgical drama, human fragility, and dawn reflection depicted (4 marks)"],
      ["Clinical setting vivid", "Sensory cues (smell, sound, sight) rich", "Emotional nuance conveyed clearly"],
      ["Underlined Title Case headline (1 mark)", "Logical 4-paragraph spatial flow (1 mark)", "Smooth transitional markers (1 mark)", "Sensory cohesion throughout (1 mark)", "Unified descriptive perspective (1 mark)"],
      ["Headline correct", "Paragraph transitions smooth", "Descriptive focus maintained"],
      ["Rich clinical and sensory vocabulary (4 marks)", "Apt similes and descriptive adjectives (3 marks)", "Varied sentence architecture (3 marks)"],
      ["Sensory words active", "Apt figurative devices", "Varied sentence structures"]
    ),
    modelAnswer: `Nocturnal Shadows in the Trauma Ward\n___________________________________\n\nAt 2:00 a.m., the emergency trauma unit of Komfo Anokye Teaching Hospital operated in a realm disconnected from normal human time. Outside, the city of Kumasi slept beneath a shroud of nocturnal quiet; inside, harsh, buzzing fluorescent tubes bleached every shadow from the polished linoleum floors with a cold, unrelenting glare. The air conditioning hummed with a bone-chilling chill, preserving the sterile atmosphere where life and death waged an uninterrupted war.\n\nThe sensory landscape was an overwhelming, clinical confrontation. A suffocating cocktail of isopropyl alcohol, iodine, and sharp chlorine disinfectant hung thick in the air, stinging the back of the throat. This sterile smell was underscored by the rich, metallic scent of spilled blood and ozone from electronic defibrillators. The acoustic atmosphere was an electronic symphony of survival. Ventilators sighed rhythmically like artificial mechanical lungs, while multi-parameter cardiac monitors chirped in relentless, syncopated pulses, their neon-green lines tracing the fragile heartbeat of wounded bodies.\n\nAlong the central corridor, human vulnerability was stripped of all pretense. Behind drawn sea-green curtains, medical interns in scrubs moved with practiced, urgent precision, adjusting transparent intravenous lines and shouting blood pressure values. Anxious relatives sat huddled on stainless steel benches, their knuckles white as they clutched rosaries and whispered frantic prayers into the cold air. Suddenly, the double pneumatic doors swung open with a hydraulic hiss as paramedics rushed in a gurney bearing a highway accident victim, their rubber soles squeaking furiously against the wet floor as surgeons mobilized like a battle-hardened squad.\n\nWhen the first pale amber fingers of dawn finally crept through the high frosted louvres, the frantic rhythm softened into a quiet, exhausted relief. Watching a senior nurse tenderly sponge the forehead of an orphaned child as her shift ended, my chest tightened with profound reverence. In the darkest corridors of human fragility, selfless compassion burns as the brightest beacon.`,
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

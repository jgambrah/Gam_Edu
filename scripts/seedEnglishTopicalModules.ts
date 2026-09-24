process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';
import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin: any = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
      return { db: new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient }), fbAdmin };
    }
  } catch (e) {
    // fallback
  }

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({
        credential: fbAdmin.credential.applicationDefault(),
      });
    } catch (e) {}
  }
  return { db: fbAdmin.firestore(), fbAdmin };
}

interface QuestionItem {
  id: string;
  level: "B7" | "B8" | "B9";
  difficulty: "low" | "medium" | "hard";
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  learningCompetency: string;
}

interface EnglishTopicModule {
  topicId: string;
  strandId: string;
  strandName: string;
  subStrandTitle: string;
  topicTitle: string;
  summary: string;
  gradeLevels: string[];
  conceptNotes: {
    b7_overview: string;
    b8_progression: string;
    b9_mastery: string;
  };
  questions: QuestionItem[];
}

const englishTopicalCurriculum: EnglishTopicModule[] = [
  {
    "topicId": "oral_phonology_sounds",
    "strandId": "strand_1_oral_language",
    "strandName": "STRAND 1: ORAL LANGUAGE",
    "subStrandTitle": "Speech Sounds, Diphthongs & Stress Patterns",
    "topicTitle": "Phonology, Intonation & Stress",
    "summary": "Master pure vowels (monophthongs), closing/centering diphthongs, consonant clusters, silent letters, word stress, and grammatical intonation contours.",
    "gradeLevels": [
      "B7 (JHS 1)",
      "B8 (JHS 2)",
      "B9 (JHS 3)"
    ],
    "conceptNotes": {
      "b7_overview": "Distinguishing voiced vs. voiceless consonants (/θ/ vs. /ð/, /s/ vs. /z/) and short vs. long vowels (/ɪ/ vs. /iː/, /ʊ/ vs. /uː/).",
      "b8_progression": "Mastering complex initial and final consonant clusters (/str-/, /-sks/, /-mpts/) and identifying silent letters (debt, subtle, receipt, knight, sword).",
      "b9_mastery": "Syllabic stress placement on polysyllabic nouns vs. verbs (RE-cord vs. re-CORD) and terminal intonation contours (falling on declarative statements/Wh-questions; rising on polar Yes/No questions and echo questions)."
    },
    "questions": [
      {
        "id": "oral_01_low",
        "level": "B7",
        "difficulty": "low",
        "prompt": "Which of the following words contains the identical vowel sound as the underlined vowel in 'f<u>i</u>t'?",
        "options": [
          "heat",
          "whim",
          "bite",
          "field"
        ],
        "correctAnswer": "whim",
        "hint": "The vowel in 'fit' is the short close front unrounded vowel /ɪ/.",
        "workedSolution": "The vowel in 'fit' is the short monophthong /ɪ/. 'Whim' (/wɪm/) shares this sound, unlike 'heat' (/iː/), 'bite' (/aɪ/), and 'field' (/iː/).",
        "learningCompetency": "B7.1.1.1: Identify and produce English short front vowels accurately."
      },
      {
        "id": "oral_02_med",
        "level": "B8",
        "difficulty": "medium",
        "prompt": "Which of the following words contains a silent consonant letter that is not pronounced in standard English?",
        "options": [
          "slumber",
          "timber",
          "plumber",
          "member"
        ],
        "correctAnswer": "plumber",
        "hint": "In this word for a tradesperson who fixes pipes, the letter 'b' after 'm' is silent.",
        "workedSolution": "In 'plumber' (/ˈplʌm.ər/), the letter 'b' is completely silent. In 'slumber', 'timber', and 'member', the /b/ sound is articulated.",
        "learningCompetency": "B8.1.1.2: Recognize and pronounce words containing silent letters in connected speech."
      },
      {
        "id": "oral_03_hard",
        "level": "B9",
        "difficulty": "hard",
        "prompt": "When the declarative sentence 'The examination results have arrived' is uttered with a prominent RISING intonation contour (↗), what attitude is communicated?",
        "options": [
          "Definite finality",
          "Surprise, disbelief, or question",
          "A firm command",
          "Aggressive anger"
        ],
        "correctAnswer": "Surprise, disbelief, or question",
        "hint": "Applying a terminal rising pitch to a declarative statement converts it into an echo inquiry expressing doubt or surprise.",
        "workedSolution": "In English suprasegmental phonology, a rising terminal pitch contour (↗) on a declarative clause converts the statement pragmatically into an expression of surprise, doubt, or questioning.",
        "learningCompetency": "B9.1.2.1: Analyze the communicative effects of varied intonation contours in spoken English."
      }
    ]
  },
  {
    "topicId": "oral_listening_conversation",
    "strandId": "strand_1_oral_language",
    "strandName": "STRAND 1: ORAL LANGUAGE",
    "subStrandTitle": "Conversation, Listening & Dialogue",
    "topicTitle": "Listening Comprehension & Public Speaking",
    "summary": "Master active listening skills, conversational turn-taking, polite requests, telephone etiquette, debate delivery, and oral presentation protocols.",
    "gradeLevels": [
      "B7 (JHS 1)",
      "B8 (JHS 2)",
      "B9 (JHS 3)"
    ],
    "conceptNotes": {
      "b7_overview": "Polite conversational registers: making requests, seeking clarification, and appropriate greetings according to social status.",
      "b8_progression": "Engaging in structured panel discussions, maintaining eye contact, avoiding interruptions, and summarizing speakers' arguments.",
      "b9_mastery": "Mastering formal debate elocution: formulating motions, addressing the chair, constructing persuasive counterarguments, and delivery."
    },
    "questions": [
      {
        "id": "oral_conv_01_low",
        "level": "B7",
        "difficulty": "low",
        "prompt": "Which of the following expressions is the most polite and appropriate way to ask a teacher to repeat an explanation?",
        "options": [
          "Repeat what you said!",
          "I didn't hear you, say it again.",
          "Pardon me, sir, could you kindly repeat that point?",
          "What did you say?"
        ],
        "correctAnswer": "Pardon me, sir, could you kindly repeat that point?",
        "hint": "Polite formal requests typically use modal auxiliaries like 'could' and respectful formulas like 'Pardon me'.",
        "workedSolution": "'Pardon me, sir, could you kindly repeat that point?' utilizes appropriate modal courtesy ('could you kindly') and respectful honorifics suitable for teacher-student communication.",
        "learningCompetency": "B7.1.3.1: Demonstrate polite registers and formal communication etiquettes in classroom dialogue."
      },
      {
        "id": "oral_conv_02_med",
        "level": "B8",
        "difficulty": "medium",
        "prompt": "During a formal committee discussion, what is the proper procedure before speaking?",
        "options": [
          "Interrupt the current speaker immediately",
          "Raise one's hand and obtain permission from the presiding Chairperson",
          "Speak louder than others to command attention",
          "Begin speaking as soon as another speaker pauses to breathe"
        ],
        "correctAnswer": "Raise one's hand and obtain permission from the presiding Chairperson",
        "hint": "Formal meeting decorum requires members to address the chair and be recognized before taking the floor.",
        "workedSolution": "In structured meeting protocol, a participant must catch the eye of the presiding Chairperson and be granted the floor before speaking, ensuring disciplined turn-taking.",
        "learningCompetency": "B8.1.3.2: Apply standard meeting procedures and rules of turn-taking in group deliberations."
      },
      {
        "id": "oral_conv_03_hard",
        "level": "B9",
        "difficulty": "hard",
        "prompt": "In a formal parliamentary debate competition, how should a lead speaker opposing the motion open their address?",
        "options": [
          "Start shouting at the proposers to show confidence",
          "Address the Chairperson, Panel of Judges, Timekeeper, and audience before stating their stance",
          "Begin reading arguments immediately without greetings",
          "Attack the personal character of the opposing speakers"
        ],
        "correctAnswer": "Address the Chairperson, Panel of Judges, Timekeeper, and audience before stating their stance",
        "hint": "Formal debate elocution begins with protocol salutations acknowledging the presiding panel and adjudicators.",
        "workedSolution": "In formal debate rhetoric, standard protocol demands acknowledging the hierarchy of the house (Mr. Chairman, Panel of Judges, Timekeeper, Opponents, and Audience) prior to stating the proposition.",
        "learningCompetency": "B9.1.4.1: Construct and deliver structured speeches and debate presentations using formal rhetorical conventions."
      }
    ]
  },
  {
    "topicId": "reading_comprehension_summary",
    "strandId": "strand_2_reading_literature",
    "strandName": "STRAND 2: READING & LITERATURE",
    "subStrandTitle": "Reading Comprehension & Summarization",
    "topicTitle": "Textual Analysis & Summary Skills",
    "summary": "Master skim-and-scan techniques, locating explicit information, making deductive inferences, decoding contextual vocabulary, and writing summaries under strict word limits.",
    "gradeLevels": [
      "B7 (JHS 1)",
      "B8 (JHS 2)",
      "B9 (JHS 3)"
    ],
    "conceptNotes": {
      "b7_overview": "Literal comprehension: identifying topic sentences, main ideas, and locating direct factual answers within narrative passages.",
      "b8_progression": "Inferential comprehension: deducing character motives, decoding figurative and idiomatic expressions from context, and paraphrasing.",
      "b9_mastery": "Summary writing: extracting primary thesis points, discarding illustrative redundancies, and crafting grammatically complete summary sentences within strict word counts."
    },
    "questions": [
      {
        "id": "read_comp_01_low",
        "level": "B7",
        "difficulty": "low",
        "prompt": "Read the excerpt: 'The dry harmattan winds swept across the savannah, withering tender crops and drying shallow streams.' What season is described?",
        "options": [
          "The major rainy season",
          "The harmattan dry season",
          "The wet equinox season",
          "The monsoon season"
        ],
        "correctAnswer": "The harmattan dry season",
        "hint": "Locate the explicit meteorological term mentioned in the opening phrase.",
        "workedSolution": "The passage explicitly names 'the dry harmattan winds' as withering crops and drying streams, identifying the season directly.",
        "learningCompetency": "B7.2.1.1: Locate direct factual details and identify the main topic from written passages."
      },
      {
        "id": "read_comp_02_med",
        "level": "B8",
        "difficulty": "medium",
        "prompt": "In a comprehension passage, the author describes a politician's promises as 'a cosmetic bandage on a gaping wound.' What does this mean?",
        "options": [
          "The politician is a qualified surgeon",
          "The promises are superficial and fail to address the core problem",
          "The promises have solved the healthcare crisis completely",
          "The community requested medical first aid kits"
        ],
        "correctAnswer": "The promises are superficial and fail to address the core problem",
        "hint": "A bandage on a deep gaping wound provides only surface concealment without healing the underlying tissue.",
        "workedSolution": "The metaphorical idiom 'cosmetic bandage on a gaping wound' means a superficial, temporary measure that does not solve the root structural disaster.",
        "learningCompetency": "B8.2.1.2: Interpret contextual figurative expressions and metaphors in prose passages."
      },
      {
        "id": "read_comp_03_hard",
        "level": "B9",
        "difficulty": "hard",
        "prompt": "Which of the following summary sentences best satisfies the WAEC rule: 'In one sentence of not more than eight words, state the author's primary warning'?",
        "options": [
          "The author is trying to say that we must stop illegal sand-winning now before disaster strikes",
          "Unregulated sand-winning causes irreversible environmental collapse.",
          "Because sand-winning is very bad, it destroys our drinking water and soils forever",
          "Stop sand-winning immediately!"
        ],
        "correctAnswer": "Unregulated sand-winning causes irreversible environmental collapse.",
        "hint": "The correct summary must be a complete grammatical sentence with subject and finite verb, containing exactly eight words or fewer.",
        "workedSolution": "'Unregulated sand-winning causes irreversible environmental collapse' is a complete grammatical sentence of exactly seven words that accurately summarizes the core thesis.",
        "learningCompetency": "B9.2.2.1: Synthesize main passage ideas into concise, grammatically complete summary sentences under strict word limits."
      }
    ]
  },
  {
    "topicId": "literature_cockcrow_canon",
    "strandId": "strand_2_reading_literature",
    "strandName": "STRAND 2: READING & LITERATURE",
    "subStrandTitle": "The Cockcrow Anthology & Literary Devices",
    "topicTitle": "Prose, Drama & Poetry Analysis",
    "summary": "Master the prescribed WAEC Cockcrow texts: Dickens' Oliver Twist, Aidoo's The Dilemma of a Ghost, short stories, prescribed poetry, and literary devices.",
    "gradeLevels": [
      "B7 (JHS 1)",
      "B8 (JHS 2)",
      "B9 (JHS 3)"
    ],
    "conceptNotes": {
      "b7_overview": "Foundational figures of speech: Simile (like lump coal lighted), Metaphor (garden of memory), Personification (the snake said, laughs the rose), and Character identification in Oliver Twist.",
      "b8_progression": "Dramatic conventions: Soliloquies, stage directions, choric commentary in The Dilemma of a Ghost, and short story thematic interpretation (Tell My Son to Hold On to His Gun, The Old Man and His Children).",
      "b9_mastery": "In-depth poetic analysis: Rhyme schemes (aabb in A Minor Bird), auditory/tactile imagery in Sleep Without Wake, social critique in Makola, and cultural conflict in The Dilemma of a Ghost."
    },
    "questions": [
      {
        "id": "lit_cock_01_low",
        "level": "B7",
        "difficulty": "low",
        "prompt": "In Charles Dickens' Oliver Twist, why did the workhouse master beat Oliver and lock him in a solitary room?",
        "options": [
          "Oliver stole silver spoons from the pantry",
          "Oliver asked for more gruel",
          "Oliver refused to attend Sunday service",
          "Oliver ran away from the undertaker"
        ],
        "correctAnswer": "Oliver asked for more gruel",
        "hint": "Oliver uttered the famous plea: 'Please, sir, I want some more.'",
        "workedSolution": "In the parish workhouse, Oliver was punished for daring to ask for a second small bowl of gruel ('Please, sir, I want some more').",
        "learningCompetency": "B7.2.3.1: Identify plot milestones, character motivations, and settings in prescribed prose texts."
      },
      {
        "id": "lit_cock_02_med",
        "level": "B8",
        "difficulty": "medium",
        "prompt": "In Ama Ata Aidoo's play 'The Dilemma of a Ghost', what is the dramatic significance of Petu and the elders sprinkling mashed yam (oto) in the courtyard?",
        "options": [
          "They are preparing a welcoming feast for Eulalie",
          "They are performing a traditional spiritual cleansing ritual to cure suspected barrenness",
          "They are marking the boundary lines of the family house",
          "They are celebrating the birth of Ato's first son"
        ],
        "correctAnswer": "They are performing a traditional spiritual cleansing ritual to cure suspected barrenness",
        "hint": "The Odumna clan elders believe evil spirits or ancestors are preventing Eulalie from bearing children.",
        "workedSolution": "In Act 4, Petu and Akroma sprinkle oto and herbal concoctions to purify the house and appease ancestral spirits, believing Eulalie's lack of pregnancy is caused by a spiritual blockage.",
        "learningCompetency": "B8.2.3.2: Analyze dramatic actions, stage directions, and cultural themes in African drama."
      },
      {
        "id": "lit_cock_03_hard",
        "level": "B9",
        "difficulty": "hard",
        "prompt": "Examine the poetic lines from Evelyn Tooley Hunt's 'Mama Is a Sunrise':\n'... she kindles us / like lump coal lighted / and we wake up glowing.'\nWhat is the dominant figure of speech and thematic meaning?",
        "options": [
          "Metaphor describing a domestic kitchen fire",
          "Simile illustrating how Mama's maternal warmth inspires life and joy in her family",
          "Personification showing how coal speaks in the morning",
          "Hyperbole exaggerating physical body heat"
        ],
        "correctAnswer": "Simile illustrating how Mama's maternal warmth inspires life and joy in her family",
        "hint": "The word 'like' connects the kindling of coal to how Mama awakens her children's emotional spirits.",
        "workedSolution": "The line employs a simile ('like lump coal lighted') to illustrate how the mother's radiant presence and warmth dispel sadness and inspire vitality in the household.",
        "learningCompetency": "B9.2.3.3: Evaluate literary devices, sensory imagery, and philosophical themes in prescribed poetry."
      }
    ]
  },
  {
    "topicId": "grammar_parts_of_speech_lexis",
    "strandId": "strand_3_grammar_usage",
    "strandName": "STRAND 3: GRAMMAR USAGE",
    "subStrandTitle": "Parts of Speech, Phrasal Verbs & Prepositions",
    "topicTitle": "Lexis, Cumulative Adjectives & Prepositions",
    "summary": "Master cumulative adjective order, dependent prepositions, phrasal verbs, reciprocal pronouns, non-assertive determiners, and partitive mass quantifiers.",
    "gradeLevels": [
      "B7 (JHS 1)",
      "B8 (JHS 2)",
      "B9 (JHS 3)"
    ],
    "conceptNotes": {
      "b7_overview": "Nouns, pronouns, and verbs: collective nouns, irregular plurals (oxen, criteria), and basic prepositions of place/time.",
      "b8_progression": "Cumulative adjective ordering: Opinion -> Size -> Age -> Shape -> Color -> Origin -> Material -> Purpose + Noun. Phrasal verb semantics (put out vs. put off).",
      "b9_mastery": "Dependent prepositions (allergic to, inferior to, acquitted of, indicted for), non-assertive quantifiers (any, either), and partitive measures (a ream of paper, a clap of thunder)."
    },
    "questions": [
      {
        "id": "gram_lex_01_low",
        "level": "B7",
        "difficulty": "low",
        "prompt": "Choose the correct preposition to complete the sentence: 'The firefighter managed to put ............ the raging inferno.'",
        "options": [
          "off",
          "out",
          "down",
          "away"
        ],
        "correctAnswer": "out",
        "hint": "'Put off' means to postpone, whereas this phrasal verb means to extinguish a flame.",
        "workedSolution": "The phrasal verb 'to put out' means to extinguish a fire or light. ('Put off' means to postpone).",
        "learningCompetency": "B7.3.1.1: Use common phrasal verbs with accurate idiomatic meaning."
      },
      {
        "id": "gram_lex_02_med",
        "level": "B8",
        "difficulty": "medium",
        "prompt": "Choose the option that follows the standard order of cumulative adjectives:\n'The master craftsman manufactured a ............ table.'",
        "options": [
          "mahogany handsome rectangular",
          "handsome rectangular mahogany",
          "rectangular handsome mahogany",
          "handsome mahogany rectangular"
        ],
        "correctAnswer": "handsome rectangular mahogany",
        "hint": "Opinion/Evaluation precedes Shape, which precedes Material before the head noun.",
        "workedSolution": "Standard English cumulative adjective ordering places subjective evaluation ('handsome') before shape ('rectangular') followed by material origin ('mahogany'): 'handsome rectangular mahogany table'.",
        "learningCompetency": "B8.3.1.2: Order cumulative adjectives correctly in descriptive noun phrases."
      },
      {
        "id": "gram_lex_03_hard",
        "level": "B9",
        "difficulty": "hard",
        "prompt": "Choose the grammatically correct option: 'In terms of academic ranking, Mr. Mensah's qualifications are not inferior ............ mine.'",
        "options": [
          "than",
          "from",
          "to",
          "against"
        ],
        "correctAnswer": "to",
        "hint": "Latin comparative adjectives (inferior, superior, junior, senior) collocate with a specific preposition, never 'than'.",
        "workedSolution": "Comparative adjectives of Latin origin such as 'inferior' and 'superior' strictly take the preposition 'to': 'inferior to mine'.",
        "learningCompetency": "B9.3.1.3: Apply correct dependent prepositions with Latin comparative adjectives."
      }
    ]
  },
  {
    "topicId": "grammar_syntax_clauses_concord",
    "strandId": "strand_3_grammar_usage",
    "strandName": "STRAND 3: GRAMMAR USAGE",
    "subStrandTitle": "Syntax, Clauses, Concord & Conditionals",
    "topicTitle": "Complex Syntax, Concord & Conditionals",
    "summary": "Master subject-verb proximity concord, 1st/2nd/3rd conditionals, inverted conditionals, the mandative subjunctive, reported speech backshifts, and passive voice.",
    "gradeLevels": [
      "B7 (JHS 1)",
      "B8 (JHS 2)",
      "B9 (JHS 3)"
    ],
    "conceptNotes": {
      "b7_overview": "Basic subject-verb agreement, simple question tags (positive statement -> negative tag), and active to passive voice in simple tenses.",
      "b8_progression": "Proximity concord with 'neither... nor' and 'either... or', First and Second Conditionals, and reported speech pronoun/tense shifts.",
      "b9_mastery": "Third Conditional counterfactuals, Inverted Conditionals ('Had I known...', 'Should you require...'), Mandative Subjunctive ('insisted that he tender'), and fronted negative adverb inversions ('Seldom do we...')."
    },
    "questions": [
      {
        "id": "gram_syn_01_low",
        "level": "B7",
        "difficulty": "low",
        "prompt": "Complete the question tag: 'You haven't submitted your term project, ............ you?'",
        "options": [
          "hadn't",
          "have",
          "haven't",
          "did"
        ],
        "correctAnswer": "have",
        "hint": "A negative statement with present perfect auxiliary 'haven't' requires an affirmative tag.",
        "workedSolution": "The main clause has negative polarity with present perfect auxiliary 'haven't'. The question tag must have positive polarity: 'have you?'.",
        "learningCompetency": "B7.3.2.1: Construct matching question tags following standard polarity rules."
      },
      {
        "id": "gram_syn_02_med",
        "level": "B8",
        "difficulty": "medium",
        "prompt": "Choose the correct verb form: 'Neither the headmaster nor the senior tutors ............ present at the stadium yesterday.'",
        "options": [
          "was",
          "is",
          "were",
          "are"
        ],
        "correctAnswer": "were",
        "hint": "In 'neither... nor' constructions, the verb agrees with the nearer subject ('the senior tutors').",
        "workedSolution": "By the rule of proximity concord with correlative 'neither... nor', the verb agrees with the closer subject ('senior tutors', plural third-person). In the past tense, the correct verb is 'were'.",
        "learningCompetency": "B8.3.2.2: Apply the rule of proximity concord with correlative conjunctions."
      },
      {
        "id": "gram_syn_03_hard",
        "level": "B9",
        "difficulty": "hard",
        "prompt": "Complete the conditional sentence: 'Had the referee spotted the intentional handball, he ............ a penalty kick.'",
        "options": [
          "will award",
          "would have awarded",
          "will have awarded",
          "would award"
        ],
        "correctAnswer": "would have awarded",
        "hint": "This is an inverted Third Conditional expressing an unfulfilled past condition ('Had + subject + past participle').",
        "workedSolution": "In an inverted Third Conditional clause ('Had the referee spotted...'), the main clause requires a modal past perfect structure: 'would have awarded'.",
        "learningCompetency": "B9.3.2.3: Formulate inverted and counterfactual conditional clauses accurately."
      }
    ]
  },
  {
    "topicId": "writing_letter_formats",
    "strandId": "strand_4_writing_composition",
    "strandName": "STRAND 4: WRITING & COMPOSITION",
    "subStrandTitle": "Formal, Informal & Semi-Formal Letters",
    "topicTitle": "Letter Writing & Petitions",
    "summary": "Master conventions of personal letters, petitions to administrative authorities (DCE, MCE, Ministers), semi-formal correspondence, layout address rules, and appropriate sign-offs.",
    "gradeLevels": [
      "B7 (JHS 1)",
      "B8 (JHS 2)",
      "B9 (JHS 3)"
    ],
    "conceptNotes": {
      "b7_overview": "Informal letters to friends and relatives: single address on top right, date, informal salutation ('Dear Kwame,'), warm conversational tone, and sign-off ('Your affectionate friend,').",
      "b8_progression": "Semi-formal letters to housemasters or class teachers: formal address, polite tone, clear paragraphing, and signature with full name.",
      "b9_mastery": "Formal letters and petitions to administrative heads (Ministers, MCEs, Editors): two addresses, formal date, formal salutation ('Dear Sir,'), capital/underlined heading ('PETITION REGARDING...'), structured development, and sign-off ('Yours faithfully,' followed by signature and printed name)."
    },
    "questions": [
      {
        "id": "write_let_01_low",
        "level": "B7",
        "difficulty": "low",
        "prompt": "Where should the writer's address and date be positioned in a standard informal letter to a cousin?",
        "options": [
          "At the bottom left-hand corner",
          "At the top right-hand corner of the page",
          "At the top left-hand corner below the recipient's address",
          "In the middle of the first page"
        ],
        "correctAnswer": "At the top right-hand corner of the page",
        "hint": "In standard British/Ghanaian letter writing, the sender's address begins at the top right margin.",
        "workedSolution": "In standard epistolary convention, the writer's address and date are positioned at the top right-hand corner of the page.",
        "learningCompetency": "B7.4.1.1: Format informal letters using standard conventions for address and salutation."
      },
      {
        "id": "write_let_02_med",
        "level": "B8",
        "difficulty": "medium",
        "prompt": "Which of the following sign-offs is standard and appropriate for a formal letter addressed to 'The District Chief Executive'?",
        "options": [
          "Yours affectionately, Kwabena",
          "Your loving student, Kwabena Mensah",
          "Yours faithfully, [Signature] Kwabena Mensah",
          "Warm regards, Kwabena"
        ],
        "correctAnswer": "Yours faithfully, [Signature] Kwabena Mensah",
        "hint": "When a formal letter opens with 'Dear Sir' or an official title, standard convention mandates this specific complimentary close.",
        "workedSolution": "When addressing an official whose name is not used in the salutation ('Dear Sir,'), the mandatory formal complimentary close is 'Yours faithfully,' followed by the writer's signature and printed full name.",
        "learningCompetency": "B8.4.1.2: Apply appropriate complimentary closes and signatures according to letter formality."
      },
      {
        "id": "write_let_03_hard",
        "level": "B9",
        "difficulty": "hard",
        "prompt": "What is an essential structural element of a formal petition that must appear immediately between the salutation ('Dear Sir,') and the opening paragraph?",
        "options": [
          "A personal informal inquiry about the recipient's family",
          "A concise, capitalized or underlined Subject Heading outlining the purpose of the letter",
          "A list of all students in the school",
          "A rhyming poem"
        ],
        "correctAnswer": "A concise, capitalized or underlined Subject Heading outlining the purpose of the letter",
        "hint": "Official letters require a title (e.g., 'PETITION REGARDING ROAD REHABILITATION') before the body.",
        "workedSolution": "In formal correspondence, a clear, capitalized or underlined Subject Heading (Reference/Title) must follow the salutation to indicate the subject matter of the letter immediately.",
        "learningCompetency": "B9.4.1.3: Structure formal petitions with clear administrative headers, concise topics, and logical development."
      }
    ]
  },
  {
    "topicId": "writing_essays_articles_debates",
    "strandId": "strand_4_writing_composition",
    "strandName": "STRAND 4: WRITING & COMPOSITION",
    "subStrandTitle": "Narrative, Descriptive, Argumentative & Articles",
    "topicTitle": "Essays, Articles for Publication & Debates",
    "summary": "Master composition writing: narrative moral stories illustrating proverbs, descriptive travelogues, articles for national daily publication, and competitive debate speeches.",
    "gradeLevels": [
      "B7 (JHS 1)",
      "B8 (JHS 2)",
      "B9 (JHS 3)"
    ],
    "conceptNotes": {
      "b7_overview": "Narrative essays: chronological sequencing of events, realistic dialogue, paragraphing, and thematic resolution illustrating moral proverbs.",
      "b8_progression": "Descriptive essays: vivid sensory adjectives, spatial organization, and capturing contrasting geographical or cultural settings.",
      "b9_mastery": "Feature articles and debate speeches: formulating titles with author bylines, logical argumentation, rhetorical appeals, and formal debate vocatives."
    },
    "questions": [
      {
        "id": "write_ess_01_low",
        "level": "B7",
        "difficulty": "low",
        "prompt": "In writing a narrative story that ends with a specific moral statement, where must that given statement appear?",
        "options": [
          "As the first sentence of the introduction",
          "As the concluding sentence of the final paragraph",
          "In the middle of the third paragraph",
          "In a footnote at the bottom of the page"
        ],
        "correctAnswer": "As the concluding sentence of the final paragraph",
        "hint": "The examination instruction specifies: 'Write a story ending with the statement...'",
        "workedSolution": "When an examination prompt requires a story ending with a specific statement, that exact clause must serve as the final resolving sentence of the composition.",
        "learningCompetency": "B7.4.2.1: Develop narrative plots that resolve naturally to satisfy prompt-specified conclusions."
      },
      {
        "id": "write_ess_02_med",
        "level": "B8",
        "difficulty": "medium",
        "prompt": "What are the two mandatory layout conventions required at the beginning of an 'Article for Publication in a National Daily'?",
        "options": [
          "Two postal addresses and a date",
          "A catchy Title (Heading) and a Byline stating the author's name",
          "A formal salutation 'Dear Editor' and a stamp",
          "A table of contents and page numbers"
        ],
        "correctAnswer": "A catchy Title (Heading) and a Byline stating the author's name",
        "hint": "Newspaper articles feature a headline at the top followed by 'By [Author's Name]'.",
        "workedSolution": "An article for publication must open with a prominent, relevant Title/Headline followed immediately by a Byline (e.g., 'By Samuel K. Boateng, Begoro').",
        "learningCompetency": "B8.4.2.2: Format feature articles using appropriate headings and journalistic bylines."
      },
      {
        "id": "write_ess_03_hard",
        "level": "B9",
        "difficulty": "hard",
        "prompt": "When writing an argumentative debate speech, why is it vital to anticipate and refute opposing counterarguments?",
        "options": [
          "To insult the opposing speakers personally",
          "To demonstrate comprehensive understanding and strengthen one's thesis by dismantling counterclaims",
          "To make the speech exceed the word limit",
          "To agree with the opponents and surrender the debate"
        ],
        "correctAnswer": "To demonstrate comprehensive understanding and strengthen one's thesis by dismantling counterclaims",
        "hint": "A strong debater addresses the opponent's best point and logically proves why it is invalid or outweighed.",
        "workedSolution": "In advanced persuasive rhetoric, anticipating and systematically refuting counterclaims demonstrates intellectual depth and invalidates alternative perspectives, strengthening the speaker's core thesis.",
        "learningCompetency": "B9.4.2.3: Construct persuasive debate speeches incorporating rhetorical devices, logical refutation, and evidence."
      }
    ]
  }
];

async function seedEnglishTopicalModules() {
  console.log("Seeding Official NaCCA English Language Topical Modules into Firestore...");
  console.log("Target path: global_curriculum/jhs/subjects/english/topical/[topicId]");

  const { db } = await getDb();
  const batch = db.batch();

  for (const module of englishTopicalCurriculum) {
    const docRef = db.doc(`global_curriculum/jhs/subjects/english/topical/${module.topicId}`);
    
    batch.set(docRef, {
      topicId: module.topicId,
      subjectId: "english",
      strandId: module.strandId,
      strandName: module.strandName,
      subStrandTitle: module.subStrandTitle,
      topicTitle: module.topicTitle,
      summary: module.summary,
      gradeLevels: module.gradeLevels,
      conceptNotes: module.conceptNotes,
      totalQuestions: module.questions.length,
      questions: module.questions,
      metadata: {
        isEnglishLanguage: true,
        curriculum: "NaCCA Common Core Programme (CCP) Standard",
        difficultySpread: ["low", "medium", "hard"],
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });

    console.log(`Prepared topic: [${module.strandName}] -> "${module.topicTitle}" (${module.questions.length} graduated items)`);
  }

  await batch.commit();
  console.log("\n✅ All 8 Official NaCCA English Language Topical Modules successfully deployed to Firestore!");
  console.log("Mathematics topical content remains completely untouched.");
}

seedEnglishTopicalModules()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed English topical modules:", err);
    process.exit(1);
  });

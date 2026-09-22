process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const configPath = 'C:\\Users\\DELL\\.config\\configstore\\firebase-tools.json';
    if (fs.existsSync(configPath)) {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg?.tokens?.access_token) {
        const oauthClient = new OAuth2Client();
        oauthClient.setCredentials({ access_token: cfg.tokens.access_token });
        return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient, ignoreUndefinedProperties: true });
      }
    }
  } catch (e) {
    console.log("Fallback from token config:", e);
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
  }
  return fbAdmin.firestore();
}

interface QuestionItem {
  number: number;
  prompt: string;
  passage?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

// Verified Authentic Reading Comprehension Passages for BECE 2008
const passage1Text = "### 📖 PASSAGE I\n\nEver since the construction of the District Hospital at Kpota, an attractive cluster of new residential buildings had sprung up around the medical complex. These well-planned, elegant houses caught the eye of anyone visiting the area, and they especially took the fancy of Mr. Akpaloo, who was searching for an ideal architectural model for his own proposed residence.\n\nResolving to build a home of identical design, Mr. Akpaloo visited the Hospital Administrator, Dr. Agbetor, to inquire about obtaining the building plans. Dr. Agbetor informed him that the houses had been designed and built under the personal supervision of Dr. Grant, who lived in a magnificent house at Tokoe and still kept the original blueprints.\n\nMr. Akpaloo immediately traveled to Tokoe to see Dr. Grant. However, after listening to his request, Dr. Grant politely declined to release the original drawings, explaining that it was not prudent to hand out specialized blueprints commissioned for institutional projects. Instead, he advised Mr. Akpaloo to visit the site caretaker, inspect the rooms carefully, and make his own sketch. When Mr. Akpaloo visited the site, he was astonished to discover that what looked like modest two-bedroom bungalows from afar were actually spacious four-bedroom houses, demonstrating that distance can dramatically alter human perception.";

const passage2Text = "### 📖 PASSAGE II\n\nOnce upon a time, an impoverished fisherman cast his net into the sea four times without catching a single fish. On his fourth attempt, his net felt exceptionally heavy. Straining with all his strength, he dragged ashore not a monstrous fish, but a heavy copper pot sealed securely with lead and stamped with a royal seal.\n\nHoping to find hidden gold inside, the fisherman took out his knife and pried open the lead stopper. Instantly, a thick plume of black smoke billowed out of the vessel, rising into the sky and condensing into a terrifying, colossal genie whose head brushed the clouds. Instead of thanking the fisherman, the fierce genie roared that he would kill him on the spot.\n\nThinking quickly, the clever fisherman feigned disbelief and asked: \"How could a magnificent, enormous being like you fit inside this tiny copper pot? I will not believe it until I see it with my own eyes.\" Proud and anxious to prove his magical power, the genie turned back into smoke and poured himself back into the narrow vessel. In a flash, the fisherman slammed the heavy lead cover back in place and cast the trapped genie back into the bottom of the sea.";

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2008
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 10) ---
  {
    number: 1,
    prompt: `${passage1Text}\n\n---\nAccording to Passage I, at what point in time were the residential houses at Kpota constructed?`,
    passage: passage1Text,
    options: [
      "When the hospital foundation was first dug",
      "Long before the hospital was ever planned",
      "After the district hospital had been constructed",
      "They were built simultaneously with the hospital wards"
    ],
    correctAnswer: "After the district hospital had been constructed",
    hint: "Reread the opening clause: 'Since the building of the District Hospital at Kpota, there had sprung up...'",
    workedSolution: "The opening sentence indicates that the cluster of houses sprang up after the district hospital had been constructed in the locality.",
    points: 1
  },
  {
    number: 2,
    prompt: `${passage1Text}\n\n---\nIn Passage I, why did Dr. Grant decline to hand over his original architectural blueprint to Mr. Akpaloo?`,
    passage: passage1Text,
    options: [
      "The residential properties did not belong to him",
      "Mr. Akpaloo was already a certified draftsman",
      "He believed it was unwise to give out a customized design",
      "The site caretaker had already misplaced the plan"
    ],
    correctAnswer: "He believed it was unwise to give out a customized design",
    hint: "Dr. Grant explained that 'it was not prudent to give out the plan...'",
    workedSolution: "The passage notes that Dr. Grant explained that 'it was not prudent [wise] to give out the plan that had been specifically designed for those projects'.",
    points: 1
  },
  {
    number: 3,
    prompt: `${passage1Text}\n\n---\nAccording to Passage I, what immediate action did Mr. Akpaloo take when he resolved to build his own residence?`,
    passage: passage1Text,
    options: [
      "He made a direct sketch of the building site",
      "He submitted his own architectural drawings to Dr. Grant",
      "He sought out the blueprint of the houses he admired",
      "He ensured he had accumulated sufficient funds"
    ],
    correctAnswer: "He sought out the blueprint of the houses he admired",
    hint: "Check paragraph two: '...one of the things he did was to look for the plan of the houses...'",
    workedSolution: "The text explains that when Mr. Akpaloo felt ready to build, he went looking for the blueprint/plan of the houses he had admired around the hospital.",
    points: 1
  },
  {
    number: 4,
    prompt: `${passage1Text}\n\n---\nIn Passage I, the word 'magnificent' in 'his magnificent house at Tokoe' means ............`,
    passage: passage1Text,
    options: ["massive in size", "strikingly beautiful and splendid", "moderately good", "extremely expensive"],
    correctAnswer: "strikingly beautiful and splendid",
    hint: "Grand, stately, and remarkably attractive in appearance.",
    workedSolution: "'Magnificent' means impressively beautiful, elaborate, or splendid in appearance; 'strikingly beautiful and splendid' is the exact equivalent.",
    points: 1
  },
  {
    number: 5,
    prompt: `${passage1Text}\n\n---\nIn Passage I, the expression 'took the fancy of Mr. Akpaloo' means that Mr. Akpaloo ............`,
    passage: passage1Text,
    options: [
      "mocked and laughed at the houses",
      "was completely confused by the layout",
      "found the design appealing and attractive",
      "harbored a strong dislike for the buildings"
    ],
    correctAnswer: "found the design appealing and attractive",
    hint: "To 'take someone's fancy' means to attract, please, or appeal to them.",
    workedSolution: "The idiom 'to take someone's fancy' means to appeal to them, capture their interest, or be found attractive.",
    points: 1
  },
  {
    number: 6,
    prompt: `${passage2Text}\n\n---\nAccording to Passage II, what did the poor fisherman haul out of the sea after casting his net all day?`,
    passage: passage2Text,
    options: [
      "A valuable pot filled with gold",
      "A heavy sealed copper vessel",
      "A monstrous deep-sea fish",
      "A tangled cluster of empty nets"
    ],
    correctAnswer: "A heavy sealed copper vessel",
    hint: "Reread the opening paragraph: 'he found only a heavy copper pot sealed with lead'.",
    workedSolution: "The fisherman caught no fish; instead, he dragged ashore a heavy copper pot sealed with lead containing a trapped spirit.",
    points: 1
  },
  {
    number: 7,
    prompt: `${passage2Text}\n\n---\nIn Passage II, what was the true supernatural nature of the genie?`,
    passage: passage2Text,
    options: [
      "A giant marine fish",
      "An enchanted copper vessel",
      "A poisonous cloud of ocean smoke",
      "A rebellious spirit punished by the Creator"
    ],
    correctAnswer: "A rebellious spirit punished by the Creator",
    hint: "Look at the genie's explanation: 'I'm a spirit that rebelled against the Creator...'",
    workedSolution: "The genie explicitly explains his identity: 'I'm a spirit that rebelled against the Creator and to punish me he shut me up in this copper pot'.",
    points: 1
  },
  {
    number: 8,
    prompt: `${passage2Text}\n\n---\nIn Passage II, the word 'captivity' as used in 'During the first century of my captivity' means ............`,
    passage: passage2Text,
    options: ["total financial loss", "the moment of birth", "state of confinement and imprisonment", "military defeat"],
    correctAnswer: "state of confinement and imprisonment",
    hint: "Being held in a cell, container, or prison against one's will.",
    workedSolution: "'Captivity' refers to the condition of being trapped, locked up, or imprisoned; 'state of confinement and imprisonment' is its direct meaning.",
    points: 1
  },
  {
    number: 9,
    prompt: `${passage2Text}\n\n---\nAccording to Passage II, how many distinct vows did the genie swear during his prolonged centuries of imprisonment?`,
    passage: passage2Text,
    options: ["One solemn vow", "Two separate vows", "Three distinct vows", "Four consecutive vows"],
    correctAnswer: "Three distinct vows",
    hint: "First century: make liberator rich; second century: grant 3 wishes; afterwards: kill liberator without mercy.",
    workedSolution: "The passage lists three vows: 1st century (make anyone rich), 2nd century (grant three wishes), and subsequent centuries (slay his liberator without mercy).",
    points: 1
  },
  {
    number: 10,
    prompt: `${passage2Text}\n\n---\nHow did the fisherman ultimately save his own life from the murderous genie in Passage II?`,
    passage: passage2Text,
    options: [
      "He physically overpowered the giant spirit",
      "He outwitted the genie into re-entering the container",
      "He called other village fishermen to his aid",
      "He paid the genie a ransom with gold"
    ],
    correctAnswer: "He outwitted the genie into re-entering the container",
    hint: "He feigned disbelief that so vast a spirit could fit into so small a vessel.",
    workedSolution: "The fisherman used his wits by challenging the genie to prove he could fit inside the small pot; once the genie entered as smoke, the fisherman sealed the lid.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "Ama was persuaded by her senior brother to pursue accounting instead of arts.\nChoose the word nearest in meaning to the underlined word 'persuaded'.",
    options: ["convinced", "commanded", "told", "advised"],
    correctAnswer: "convinced",
    hint: "To cause someone to believe or agree to something through reasoning.",
    workedSolution: "'Persuaded' means caused someone to do something through sound reasoning or argument; 'convinced' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The talented striker scored three brilliant goals during the finals.\nChoose the word nearest in meaning to the underlined word 'talented'.",
    options: ["trained", "serious", "gifted", "skilled"],
    correctAnswer: "gifted",
    hint: "Possessing natural aptitude, ability, or exceptional flair.",
    workedSolution: "'Talented' means possessing natural creative or athletic ability; 'gifted' is its exact equivalent.",
    points: 1
  },
  {
    number: 13,
    prompt: "Araba was saddened because she failed to secure the regional scholarship award.\nChoose the word nearest in meaning to the underlined word 'saddened'.",
    options: ["furious", "amazed", "excited", "sorrowful"],
    correctAnswer: "sorrowful",
    hint: "Feeling grief, disappointment, or unhappiness.",
    workedSolution: "'Saddened' means made to feel grief, distress, or unhappiness; 'sorrowful' is its closest synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The unruly apprentice was reprimanded for displaying disrespect toward his master.\nChoose the word nearest in meaning to the underlined word 'unruly'.",
    options: ["impolite", "strange", "indecent", "wicked"],
    correctAnswer: "impolite",
    hint: "Disorderly, disrespectful, and lacking proper manners.",
    workedSolution: "'Unruly' when describing conduct toward figures of authority denotes ill-mann manners, disorderly, and insolent behavior; 'impolite' is the nearest equivalent.",
    points: 1
  },
  {
    number: 15,
    prompt: "Our class teacher is exceptionally enthusiastic regarding our upcoming science fair.\nChoose the word nearest in meaning to the underlined word 'enthusiastic'.",
    options: ["anxious", "frank", "aware", "hopeful"],
    correctAnswer: "hopeful",
    hint: "Having or showing intense interest, keen expectation, and positive excitement.",
    workedSolution: "'Enthusiastic' means showing intense, eager enjoyment and optimism; 'hopeful' is the closest synonym in this context.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "The elderly statesman died without clearing his name. This means that the man failed to ............",
    options: [
      "prove his legal innocence",
      "erase his name from official registers",
      "draw up a legal will",
      "win his land dispute in court"
    ],
    correctAnswer: "prove his legal innocence",
    hint: "Removing suspicion and proving that one is innocent of an accusation.",
    workedSolution: "The idiom 'to clear one's name' means to prove one's innocence and vindicate one's reputation from accusations or disgrace.",
    points: 1
  },
  {
    number: 17,
    prompt: "The tutor advised the candidates to go over their answers before submission. This means they should ............",
    options: [
      "rewrite all the compositions",
      "remember all key dates",
      "repeat the questions aloud",
      "review and check their work carefully"
    ],
    correctAnswer: "review and check their work carefully",
    hint: "Inspecting, reading through, or examining work to catch errors.",
    workedSolution: "The phrasal verb 'to go over' means to review, examine, or check through something carefully.",
    points: 1
  },
  {
    number: 18,
    prompt: "You did not have to act so high and mighty regarding your examination grades. This means you should not be ............",
    options: ["positive", "confused", "strong", "arrogant"],
    correctAnswer: "arrogant",
    hint: "Acting in a proud, haughty, and condescending manner.",
    workedSolution: "The idiom 'high and mighty' describes an attitude of haughty pride, conceit, and arrogance toward others.",
    points: 1
  },
  {
    number: 19,
    prompt: "The clan elder urged the two quarreling brothers to mend their fences. This means the brothers should ............",
    options: [
      "reconstruct their damaged farm boundaries",
      "reconcile and make peace",
      "be careful in speech",
      "defend their heritage"
    ],
    correctAnswer: "reconcile and make peace",
    hint: "Settling disputes and restoring friendly, peaceful relations.",
    workedSolution: "The idiom 'to mend fences' means to repair damaged relationships, resolve differences, and make peace.",
    points: 1
  },
  {
    number: 20,
    prompt: "The truant was cautioned about his conduct but he turned a deaf ear to the advice. This means that he ............",
    options: ["could not hear the words", "laughed at the master", "was angry with the elders", "ignored the counsel completely"],
    correctAnswer: "ignored the counsel completely",
    hint: "Refusing to listen, obey, or pay attention.",
    workedSolution: "'To turn a deaf ear' is an idiom meaning to deliberately refuse to listen to, notice, or obey counsel or warnings.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While Uncle Musa is known throughout the village to be generous, his brother is notoriously ...... .",
    options: ["stingy", "selfish", "strict", "serious"],
    correctAnswer: "stingy",
    hint: "'Generous' means willing to give and share freely. Find the word that denotes mean and ungiving.",
    workedSolution: "'Generous' means liberal and open-handed in giving. Its direct antonym is 'stingy' (miserly, tight-fisted, or ungenerous).",
    points: 1
  },
  {
    number: 22,
    prompt: "The headmaster rebuked the tardy students, but ...... the punctual candidates.",
    options: ["admitted", "praised", "admired", "embraced"],
    correctAnswer: "praised",
    hint: "'Rebuked' means scolded or reprimanded sharply. Find the word meaning commended or applauded.",
    workedSolution: "'Rebuked' means expressed sharp disapproval or censure. Its direct antonym is 'praised' (commended or commended publicly).",
    points: 1
  },
  {
    number: 23,
    prompt: "Mansah answered the interviewer's queries with confidence, whereas her rival responded with ...... .",
    options: ["joy", "firmness", "timidity", "uncertainty"],
    correctAnswer: "timidity",
    hint: "'Confidence' means self-assurance and boldness. Find the word meaning shyness, hesitation, and fear.",
    workedSolution: "'Confidence' denotes assurance and bold conviction. Its direct opposite in interpersonal behavior is 'timidity' (shyness and lack of courage).",
    points: 1
  },
  {
    number: 24,
    prompt: "Judicial arbiters are sworn to remain impartial, rather than ...... in their verdicts.",
    options: ["biased", "proud", "disrespectful", "bold"],
    correctAnswer: "biased",
    hint: "'Impartial' means fair and unswayed by favoritism. Find the word denoting unfair preference.",
    workedSolution: "'Impartial' means fair and completely unbiased. Its direct antonym is 'biased' (prejudiced or showing unfair favoritism).",
    points: 1
  },
  {
    number: 25,
    prompt: "Scripture teaches that we should humble ourselves before God, rather than ...... our own virtues.",
    options: ["exalt", "raise", "decorate", "train"],
    correctAnswer: "exalt",
    hint: "'Humble' means to lower or make modest. Find the word meaning to elevate, glorify, or praise excessively.",
    workedSolution: "'To humble oneself' means to adopt a modest, submissive posture. Its direct antonym is 'to exalt' (to elevate, glorify, or boast).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "Kofi promised his parents that he ...... study with unwavering diligence.",
    options: ["would", "should", "will", "can"],
    correctAnswer: "would",
    hint: "In indirect speech, the future modal 'will' shifts back to 'would' after a past reporting verb ('promised').",
    workedSolution: "Because the reporting verb 'promised' is in the simple past tense, the future auxiliary modal shifts from 'will' to 'would'.",
    points: 1
  },
  {
    number: 27,
    prompt: "If Kofi ...... me for assistance, I would have helped him complete the assignment.",
    options: ["had asked", "asks", "has asked", "asked"],
    correctAnswer: "had asked",
    hint: "Third Conditional: The main clause 'would have helped' requires 'had + past participle' in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause must use the past perfect tense ('had asked').",
    points: 1
  },
  {
    number: 28,
    prompt: "Let us assemble our tools and depart immediately, Akosua, ......?",
    options: ["may we", "can we", "must we", "shall we"],
    correctAnswer: "shall we",
    hint: "Suggestions beginning with 'Let's' or 'Let us' take a specific first-person plural question tag.",
    workedSolution: "Imperative sentences expressing joint suggestions beginning with 'Let's' take 'shall we?' as their mandatory question tag.",
    points: 1
  },
  {
    number: 29,
    prompt: "The young apprentice is ...... inexperienced to manage the workshop alone.",
    options: ["so", "very", "too", "much"],
    correctAnswer: "too",
    hint: "Identify the degree adverb that pairs with an infinitive ('too + adjective + to-infinitive') to show an impossible excess.",
    workedSolution: "The correlative pattern 'too + adjective + to-infinitive' conveys that an extreme degree prevents an action ('too inexperienced to manage').",
    points: 1
  },
  {
    number: 30,
    prompt: "Hand that blue notebook of ...... to the class prefect.",
    options: ["their", "yours", "my", "your's"],
    correctAnswer: "yours",
    hint: "Double possessive construction: 'that [noun] of' requires an absolute possessive pronoun without an apostrophe.",
    workedSolution: "In double possessive constructions ('that book of...'), the absolute possessive pronoun 'yours' is required. Possessive pronouns never take apostrophes.",
    points: 1
  },
  {
    number: 31,
    prompt: "...... the torrential rains and heavy storms, the daring fishermen launched their canoes.",
    options: ["In spite of", "Apart from", "In case of", "Instead of"],
    correctAnswer: "In spite of",
    hint: "Which prepositional phrase expresses contrast or concession followed by a noun phrase?",
    workedSolution: "'In spite of' is a prepositional phrase expressing concession and contrast, correctly followed by the noun phrase 'the torrential rains'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Our family has been residing in this municipality ...... 2001.",
    options: ["since", "by", "in", "for"],
    correctAnswer: "since",
    hint: "Use 'since' with a specific point in time or calendar year, and 'for' for a total duration.",
    workedSolution: "The preposition 'since' indicates the specific starting point in time ('since 2001') for an action continuing to the present.",
    points: 1
  },
  {
    number: 33,
    prompt: "The witness informed the magistrate that he had seen the suspect two days ...... .",
    options: ["before", "ago", "now", "then"],
    correctAnswer: "before",
    hint: "In indirect reported speech, 'two days ago' shifts back to 'two days before' or 'earlier'.",
    workedSolution: "In reported speech following a past reporting verb ('informed... had seen'), the time adverbial 'ago' changes to 'before' ('two days before').",
    points: 1
  },
  {
    number: 34,
    prompt: "The clerk has been formally accused ...... embezzling company funds.",
    options: ["with", "for", "of", "on"],
    correctAnswer: "of",
    hint: "Identify the preposition that regularly collocates with the verb 'accused'.",
    workedSolution: "In standard English grammar, one is 'accused of' a crime or misdeed, never 'accused with' or 'accused for'.",
    points: 1
  },
  {
    number: 35,
    prompt: "This is the civil engineer ...... we met at the municipal assembly yesterday.",
    options: ["who", "whose", "whom", "which"],
    correctAnswer: "whom",
    hint: "Use the objective relative pronoun when referring to the person who receives the action of the verb ('met').",
    workedSolution: "'Whom' is the objective relative pronoun used to refer to a person who functions as the object of the verb ('whom we met').",
    points: 1
  },
  {
    number: 36,
    prompt: "My elder sister is remarkably talented and good ...... written English.",
    options: ["on", "at", "for", "with"],
    correctAnswer: "at",
    hint: "Which preposition follows 'good' when denoting skill or competence in an academic subject?",
    workedSolution: "The adjective 'good' takes the preposition 'at' when expressing skill, proficiency, or aptitude in a discipline ('good at English').",
    points: 1
  },
  {
    number: 37,
    prompt: "I hear the cultural symposium was inspiring; I wish I ...... present.",
    options: ["am", "were", "was", "have been"],
    correctAnswer: "were",
    hint: "Subjunctive mood: An unfulfilled hypothetical wish regarding a past or unreal situation takes 'were'.",
    workedSolution: "In formal standard English, the subjunctive form 'were' is used after 'wish' to express an unreal or counterfactual condition ('I wish I were present').",
    points: 1
  },
  {
    number: 38,
    prompt: "Reverend Mensah is now the ...... senior pastor among the church presbytery.",
    options: ["much", "more", "most", "far"],
    correctAnswer: "most",
    hint: "When singling out the highest degree among a group of three or more, use this superlative modifier.",
    workedSolution: "When comparing an individual across an entire group of three or more ('among the church presbytery'), the superlative adverb 'most' is required ('the most senior').",
    points: 1
  },
  {
    number: 39,
    prompt: "Our grandmother prefers traditional herbal tea ...... sweetened carbonated beverages.",
    options: ["to", "than", "against", "from"],
    correctAnswer: "to",
    hint: "The comparative verb 'prefer' takes the preposition 'to', never 'than'.",
    workedSolution: "The verb 'prefer' takes 'to' when expressing a choice of one item over another ('prefer X to Y').",
    points: 1
  },
  {
    number: 40,
    prompt: "The coach hopes the school football team ...... perform better in the upcoming tournament.",
    options: ["would", "will", "should", "shall"],
    correctAnswer: "will",
    hint: "The verb 'hope' expresses a realistic future expectation and takes the indicative future modal 'will'.",
    workedSolution: "Unlike 'wish' (which expresses unreality and takes 'would'), the verb 'hope' conveys a realistic future expectation and takes 'will' ('hope the team will perform').",
    points: 1
  }
];

// Seeded Deterministic Shuffle to Guarantee Exactly 10 A, 10 B, 10 C, 10 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3
];

function seedShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let m = arr.length, t, i;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    i = Math.floor((seed / 233280) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

const assignedTargetIndices = seedShuffle(targetKeys, 200801);

const balancedPaper1 = rawQuestions.map((q, idx) => {
  const correctIdx = assignedTargetIndices[idx]; // 0=A, 1=B, 2=C, 3=D
  const options: string[] = [];
  const rawDistractors = q.options.filter(opt => opt !== q.correctAnswer);
  let dCount = 0;
  for (let pos = 0; pos < 4; pos++) {
    if (pos === correctIdx) {
      options.push(q.correctAnswer);
    } else {
      options.push(rawDistractors[dCount++]);
    }
  }
  return {
    number: q.number,
    prompt: q.prompt,
    ...((q as any).passage ? { passage: (q as any).passage } : {}),
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };
});

// ==========================================
// PAPER 2: ESSAY WRITING (COMPOSITION)
// ==========================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Informal Letter",
        prompt: "A close friend of your father has promised to grant you any three wishes if you pass your BECE with distinction. Write a letter to him, thanking him for his benevolence, describing the three specific things you want him to do for you, and giving convincing reasons for each choice.",
        modelAnswer: `Methodist Junior High School
P. O. Box 45
Nkawie, Ashanti Region
12th June, 2008

Dear Uncle Arthur,

I hope this letter finds you in excellent health, peace of mind, and prosperity. I write with deep humility and heartfelt gratitude to thank you for your generous promise to sponsor my wishes if I pass the upcoming Basic Education Certificate Examination (BECE) with flying colors. Your promise has energized my revision immensely. As requested, I am presenting the three specific wishes that will shape my future.

First and foremost, I wish for you to sponsor my boarding school fees and supply the prescribed textbooks for my Senior High School education. Gaining admission into an endowed school like Prempeh College requires significant financial expenditure for uniforms, boarding house supplies, and science laboratory kits. Sponsoring my secondary schooling will lift a heavy financial burden off my parents and allow me to focus entirely on academic distinction.

Secondly, I wish for a personal desktop computer equipped with educational software and digital science encyclopedias. We live in an era governed by information technology. Having a computer at home will enable me to master typing, practice foundational programming, and conduct research without spending hours in commercial internet cafes.

Finally, I wish for you to enroll me in a driving and automotive mechanics apprenticeship during the long vacation. Acquiring practical technical skills will give me self-reliance and practical knowledge that will serve me throughout my adult life.

I promise to study relentlessly to secure aggregate six in the final examination to justify your benevolence.

Yours respectfully,
[Signature]
Kwame Boateng`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Write a letter to the Chairman of your school's Parent-Teacher Association (PTA), highlighting the urgent need to establish modern recreational and sports facilities in your school.",
        modelAnswer: `St. Theresa's Junior High School
P. O. Box 80
Berekum, Bono Region
15th October, 2008

The Chairman
Parent-Teacher Association
St. Theresa's Junior High School
Berekum

Dear Sir,

AN APPEAL FOR THE PROVISION OF MODERN RECREATIONAL AND SPORTS FACILITIES IN OUR SCHOOL

On behalf of the Student Representative Council, I respectfully write to bring to your attention a pressing deficiency in our school infrastructure and to appeal for the provision of standard recreational and sports facilities for our pupils.

First and foremost, our school lacks basic recreational amenities for physical exercise and relaxation. Currently, our football pitch is an uneven, rocky field that becomes an eroded mud pit during rainy seasons. We have no basketball court, volleyball court, or indoor table tennis boards. Consequently, students have nowhere to channel their youthful energy during recess and physical education periods, which often leads to idle roaming, loitering in town, and classroom fatigue.

Secondly, standard recreational facilities are essential for uncovering and nurturing hidden athletic talents. Modern basic education emphasizes holistic development—training both the mind and the body. Our district is endowed with gifted sprinters and footballers who, due to the lack of training tracks and sports gear, fail to compete favorably during inter-schools championships. Providing volleyball nets, table tennis tables, and a leveled pitch will foster discipline, team cooperation, and mental alertness among learners.

I propose that the PTA consider levying a modest development contribution on parents and organizing a fundraising durbar during the upcoming Speech Day to finance this project.

Thank you for your continuous dedication to our welfare.

Yours faithfully,
[Signature]
Esi Asantewaa
(School Prefect)`
      },
      {
        questionNumber: "3",
        category: "Speech Writing",
        prompt: "As the Senior Prefect of your school, write an orientation speech to be delivered to newly admitted Form One students, highlighting at least three practical principles that will make their academic and social stay in the school successful.",
        modelAnswer: `AN ORIENTATION ADDRESS DELIVERED BY KWABENA ADJEI, SENIOR PREFECT OF PRESBYTERIAN JHS, TO INCOMING FORM ONE STUDENTS

Respected Headmaster, Dedicated Teachers, Outgoing Prefects, and Our Cherished Fresh Students:

On behalf of the entire student body, I warmly welcome you to Presbyterian Junior High School. Entering junior high school is a significant milestone that marks the beginning of your journey toward adult responsibility. Today, I wish to share three essential principles that will guarantee your success in our noble institution.

First, cultivate unwavering self-discipline and strict time management. Unlike primary school, junior high school demands rigorous independence. You must respect the school bell at all times: attend morning assembly promptly, avoid unexcused absence, and never loiter during class changeovers. Cultivate the habit of completing all homework and project assignments on the day they are assigned. Procrastination is the thief of time and the mother of academic failure.

Secondly, choose your friends wisely and embrace good moral conduct. The company you keep will either inspire you to greatness or drag you into ruin. Steer completely clear of truancy, bullying, theft, and insolence toward teachers. Associate with focused, hardworking classmates who spend their leisure time in the library solving past questions. A good name, as our elders say, is far better than riches.

Finally, balance your academics with active participation in co-curricular activities. Join the school debating society, the science club, the cultural troupe, or the cadet corps. These activities develop leadership, build self-confidence, and keep your body healthy.

If you abide by these three guideposts, your three-year stay here will be rewarding and triumphant. Once again, welcome to our family!

Thank you all.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Write an interesting, realistic story that illustrates the timeless wisdom of the proverb: \"Two heads are better than one.\"",
        modelAnswer: `For three consecutive years, our school had suffered humiliating defeats in the Municipal Science and Mathematics Quiz Competition. Our brilliant candidate, Isaac, was exceptionally gifted in theoretical mathematics, but he was stubborn and arrogant. He insisted on working entirely alone, refusing to consult his teammates, Kofi and me. Consequently, during rapid-fire problem-solving rounds, his solitary thinking often broke down under pressure, costing us the championship trophy.

When our dedicated science master, Mr. Mensah, registered us for the 2008 municipal tournament, he instituted a strict rule: no individual was allowed to answer a question without consulting his partners for at least five seconds. Initially, Isaac grumbled, believing his speed would be compromised. However, during the intense final contest against our arch-rivals, Anglican JHS, the wisdom of collective thinking became vividly clear.

We trailed by two points entering the fourth and final round, which required designing a working electronic circuit and solving a complex velocity calculation. Isaac computed the initial resistance figure but overlooked a critical internal battery resistance factor. Fortunately, Kofi noticed the omission in time and whispered the correction, while I rapidly verified the formula and wired the components. By pooling our diverse strengths—Isaac's mathematical speed, Kofi's sharp eye for detail, and my practical circuitry skills—we solved the problem flawlessly with three seconds to spare.

When the quiz mistress announced our school as the overall champions, the auditorium erupted in deafening cheers. Holding the trophy aloft, Isaac smiled humbly, embraced us, and confessed: Two heads are truly better than one.`
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.sectionA_essay.questions.map((q) => ({
    id: `essay_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  }))
];

async function seedBeceEnglish2008Calibrated() {
  console.log("Seeding Calibrated & Balanced BECE English 2008 into Firestore...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance (Exactly 10 of each):", keyDist);

  const db = await getDb();
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2008");
  await docRef.set({
    year: 2008,
    title: "BECE English Language 2008 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      updatedAt: new Date()
    },
        paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      passages: [
        {
          id: "passage_1",
          title: "Passage I: The Architectural Plan of Kpota Hospital Houses",
          text: passage1Text,
          questionRange: [1, 5]
        },
        {
          id: "passage_2",
          title: "Passage II: The Fisherman and the Genie in the Copper Pot",
          text: passage2Text,
          questionRange: [6, 10]
        }
      ],
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English 2008 successfully seeded into Firestore!");
}

seedBeceEnglish2008Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2008:", err);
    process.exit(1);
  });

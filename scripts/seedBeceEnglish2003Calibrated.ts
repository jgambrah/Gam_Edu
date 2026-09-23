import * as dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';

import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient, ignoreUndefinedProperties: true });
    }
  } catch (e) {
    console.log("Fallback to admin default credentials...", e);
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.applicationDefault(),
    });
  }
  return fbAdmin.firestore();
}

interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
  passageTitle?: string;
  passageText?: string;
  passage?: string;
}

// =========================================================================
// ISOMORPHIC PASSAGE I: THE GATHERING CLOUDS AND THE DROUGHT (CALIBRATED)
// =========================================================================
const passage1Text = `The school bell clanged for dismissal, and the pupils spilled into the open courtyard chanting the playful nursery verse they had rehearsed all week:
"Rain, rain, go away,
Come again another day,
Little children want to play,
Rain, rain, go away."

Suddenly, the singing ceased. Looking upward toward the horizon, the children noticed heavy, dark storm clouds gathering rapidly across the sky. These unmistakable harbingers of rain filled them with uncontrollable excitement. Instantly, they abandoned their rhyme and burst into a spirited traditional song of celebration:
"The sweet downpour will soon arrive,
The skies will turn radiant,
And festive muskets will boom!"

Hearing the joyous uproar, parents working in the village compounds abandoned their tasks and joined their children in ecstatic dancing. It had been over half a year since the heavens had released a drop of moisture. Throughout those six grueling months, subsistence farmers had prayed fruitlessly for rain. The prolonged drought had triggered severe famine across the valley; the soil had baked into rock, preventing the planting of new seed corn and cementing mature cassava roots into the hardened earth. Community streams and shallow wells had dried to cracked mud, leaving humans and domestic cattle in desperate thirst.

Small wonder, then, that adults cast aside their customary dignity and danced like toddlers, convinced that their prolonged misery was about to end. Everyone was persuaded that the white rams sacrificed by the local fetish priest at the sacred shrine had finally appeased the ancestral spirits.

However, when dawn broke the following morning, a cruel reality greeted the community. The sky was pale and clear, and the parched earth remained bone-dry without a single trace of water. Overcome with fury and betrayal, the villagers seized sticks and machetes and marched on the shrine to lynch the deceptive priest. Fortunately for him, the crafty charlatan had fled under the cover of night before the mob arrived.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "In Passage I, why did the schoolchildren abruptly cease singing their initial playground verse?",
    options: [
      "The village elders commanded them to maintain absolute silence",
      "They spotted dark rain clouds gathering and realized rain was approaching",
      "They had forgotten the remaining stanzas taught by their teacher",
      "They heard the loud booming of celebratory muskets in the distance"
    ],
    correctAnswer: "They spotted dark rain clouds gathering and realized rain was approaching",
    hint: "Reread paragraph two: they stopped when they saw dark clouds racing across the sky, indicating rain.",
    workedSolution: "The children switched songs because the sudden sight of gathering dark clouds signaled an impending downpour, filling them with joy.",
    points: 1
  },
  {
    number: 2,
    prompt: "Why did the adult villagers join the children in dancing and singing in Passage I?",
    options: [
      "They were celebrating the safe return of their wards from school",
      "They firmly believed that the gathering clouds meant the long drought was breaking",
      "The torrential rain had already started drenching the village",
      "They were rejoicing over the fetish priest's sacrificial feast"
    ],
    correctAnswer: "They firmly believed that the gathering clouds meant the long drought was breaking",
    hint: "Check paragraph three: they joined in because they believed their troubles from the six-month drought would soon be over.",
    workedSolution: "The adults danced because they genuinely believed the gathering clouds were the answer to their six months of prayers for rain.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following statements is factually accurate according to Passage I?",
    options: [
      "The angry villagers caught and lynched the priest at his shrine",
      "Torrential rains fell steadily throughout the night until morning",
      "Water was critically scarce for both human beings and livestock",
      "The schoolchildren wished for the dry spell to continue indefinitely"
    ],
    correctAnswer: "Water was critically scarce for both human beings and livestock",
    hint: "Paragraph three notes: streams and wells had dried up, leaving very little water for people and animals.",
    workedSolution: "The passage notes that streams and wells had dried up, leaving scarcely any water for human consumption or cattle.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the word 'abruptly' in 'they stopped abruptly' means ............",
    options: [
      "gradually and smoothly",
      "suddenly and without warning",
      "reluctantly and sadly",
      "quietly and timidly"
    ],
    correctAnswer: "suddenly and without warning",
    hint: "'Abruptly' denotes an unexpected, sudden halt.",
    workedSolution: "'Abruptly' means suddenly, unexpectedly, or without delay; 'suddenly and without warning' is its direct meaning.",
    points: 1
  },
  {
    number: 5,
    prompt: "Why did the villagers resolve to lynch the fetish priest the following morning?",
    options: [
      "He refused to share the meat of the sacrificed rams",
      "He had falsely promised rain and deceived them into believing his sacrifices had worked",
      "He commanded the farmers to stop uprooting cassava tubers",
      "He had desecrated the sacred grove during the night"
    ],
    correctAnswer: "He had falsely promised rain and deceived them into believing his sacrifices had worked",
    hint: "The morning broke completely dry despite the expensive sacrifices, demonstrating that the priest had deceived them.",
    workedSolution: "The villagers felt betrayed and enraged because the priest had deceived them into believing his rituals guaranteed rain.",
    points: 1
  },
  {
    number: 6,
    prompt: "From the narrative development in Passage I, we learn that ............",
    options: [
      "fetish priests always predict seasonal weather accurately",
      "human beings cannot always predict or control the natural elements",
      "schoolchildren are indifferent to community hardship",
      "farmers should never plant cassava in dry weather"
    ],
    correctAnswer: "human beings cannot always predict or control the natural elements",
    hint: "Despite human expectations, songs, and sacrifices, the rain never fell; nature remains outside human mastery.",
    workedSolution: "The story demonstrates that despite human rituals, gathering clouds, and fervent hopes, humanity cannot reliably control natural weather patterns.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: TEACHER AMU'S LESSONS AND ABRE (CALIBRATED)
// =========================================================================
const passage2Text = `Teacher Amu never let slip an opportunity to deliver moral pep-talks to his students. "Variety is the spice of life," he would invariably begin in his booming voice. He would then elaborate on how existence is constituted of necessary contrasts, like light and darkness, virtue and vice. He would describe the infinite varieties of wild birds, the diverse creatures of the oceans, and the countless species of forest timber. His pupils could always predict when his sermon was reaching its climax. Raising his index finger and gazing toward the ceiling, he would conclude with flourish: "God made them all, and He declared, 'It is good'!"

These concluding words left an indelible impression on the class. When instructional periods ended, students would burst into fits of laughter, mimicking his gestures and reciting the phrase. Before long, it was no surprise that pupils began whispering the nickname "God made them all" whenever Teacher Amu turned his back to write on the chalkboard.

However, one pupil, Kofi Abre, found nothing amusing in his classmates' teasing. He was irritated that his peers made a mockery of Teacher Amu's philosophy. Had not the teacher emphasized that the universe was made up of contrasting temperaments, varied individuals, and different habits? Why, then, did his classmates grumble whenever he, Abre, acted according to his own distinct nature?

Just the previous week, Abre had aggressively shouted down a classmate who labeled him sluggish. He had nearly fractured another boy's jaw when that friend rebuked him for failing to complete his homework assignments. Teacher Amu had sternly warned Abre that such violence constituted gross indiscipline and would be severely punished. Abre shook his head in bitter resentment. His friend had provoked him, yet Teacher Amu threatened to punish him merely for being different and reacting in his own unique way.`;

const passage2Questions = [
  {
    number: 7,
    prompt: "In Passage II, the aphorism 'Variety is the spice of life' means that life ............",
    options: [
      "is comparable to heavily seasoned food",
      "is full of unexpected troubles and sorrow",
      "is enriched and made interesting by differences and diversity",
      "demands that everyone behave in the exact same manner"
    ],
    correctAnswer: "is enriched and made interesting by differences and diversity",
    hint: "The proverb expresses that differences, contrasts, and varied experiences make life enjoyable and exciting.",
    workedSolution: "'Variety is the spice of life' is a proverb meaning that diversity, differences, and varied experiences make human existence engaging and interesting.",
    points: 1
  },
  {
    number: 8,
    prompt: "Why did the students nickname Teacher Amu 'God made them all' in Passage II?",
    options: [
      "He was an ordained priest who conducted Sunday chapel sermons",
      "It was his favorite concluding catchphrase during moral pep-talks",
      "He constantly gazed toward the heavens when teaching science",
      "He taught biological classification of plant and animal species"
    ],
    correctAnswer: "It was his favorite concluding catchphrase during moral pep-talks",
    hint: "Paragraph one and two note that he always concluded his speeches with that exact religious phrase, making it memorable.",
    workedSolution: "The students gave him the nickname because he invariably concluded every single one of his moral lectures with that memorable phrase.",
    points: 1
  },
  {
    number: 9,
    prompt: "Why was Kofi Abre displeased when his classmates mocked Teacher Amu's words?",
    options: [
      "He took the philosophical message of diversity seriously to justify his own behavior",
      "He was terrified that the master would cancel morning break",
      "He harbored intense personal hatred toward all his classmates",
      "He was the class prefect tasked with maintaining classroom order"
    ],
    correctAnswer: "He took the philosophical message of diversity seriously to justify his own behavior",
    hint: "Paragraph three reveals that Abre took the words literally to argue that his own different, aggressive conduct was natural.",
    workedSolution: "Abre took Teacher Amu's teachings on diversity seriously and felt that his peers had no right to criticize his unusual or aggressive behavior.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'rebuked' in 'when that friend rebuked him' means ............",
    options: [
      "interrogated closely",
      "scolded and reprimanded sharply",
      "reminded politely",
      "entertained humorously"
    ],
    correctAnswer: "scolded and reprimanded sharply",
    hint: "'Rebuked' (or scolded) means criticized or reprimanded for a fault.",
    workedSolution: "'Rebuked' means expressed sharp disapproval or reprimanded; 'scolded and reprimanded sharply' is its direct meaning.",
    points: 1
  },
  {
    number: 11,
    prompt: "Why did Teacher Amu warn that he would administer disciplinary punishment to Kofi Abre?",
    options: [
      "Because Abre refused to recite the class catchphrase",
      "Because Abre engaged in violent physical aggression and indiscipline",
      "Because Abre neglected to memorize biological species of birds",
      "Because Abre arrived late to the morning lecture"
    ],
    correctAnswer: "Because Abre engaged in violent physical aggression and indiscipline",
    hint: "Paragraph four explains that Abre shouted down peers and almost broke a friend's jaw, which constituted gross indiscipline.",
    workedSolution: "Teacher Amu cautioned Abre because resorting to physical violence and assault against classmates constitutes unacceptable indiscipline.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 2003 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "Abass was not selected for the marathon squad because he lacked adequate stamina.\nChoose the word nearest in meaning to 'stamina'.",
    options: ["agility", "endurance", "enthusiasm", "muscle"],
    correctAnswer: "endurance",
    hint: "The ability to sustain prolonged physical or mental effort.",
    workedSolution: "'Stamina' means the physical or mental ability to sustain prolonged exertion; 'endurance' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The border town was completely deserted after the outbreak of civil war.\nChoose the word nearest in meaning to 'deserted'.",
    options: ["fortified", "shattered", "abandoned", "surrounded"],
    correctAnswer: "abandoned",
    hint: "Empty of people; vacated and left behind.",
    workedSolution: "'Deserted' describes a place empty of residents or left desolate; 'abandoned' is its exact equivalent.",
    points: 1
  },
  {
    number: 14,
    prompt: "The detectives interrogated the prime suspect at the regional police command.\nChoose the word nearest in meaning to 'interrogated'.",
    options: ["cautioned", "questioned", "detained", "admonished"],
    correctAnswer: "questioned",
    hint: "Asked questions formally, aggressively, or systematically.",
    workedSolution: "'Interrogated' means examined or asked questions formally; 'questioned' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The senior master was thoroughly impressed with Kwesi's technical drawing portfolio.\nChoose the word nearest in meaning to 'impressed'.",
    options: ["pleased", "deceived", "calmed", "surprised"],
    correctAnswer: "pleased",
    hint: "Feeling admiration, approval, or deep satisfaction.",
    workedSolution: "'Impressed' means feeling deep admiration or satisfaction with quality; 'pleased' is its closest synonym.",
    points: 1
  },
  {
    number: 16,
    prompt: "Experienced pediatricians are exceedingly cautious when administering potent medications.\nChoose the word nearest in meaning to 'cautious'.",
    options: ["careful", "dexterous", "hesitant", "competent"],
    correctAnswer: "careful",
    hint: "Taking care to avoid risk, error, or danger.",
    workedSolution: "'Cautious' means showing care, wariness, and prudence to avoid hazards; 'careful' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "The chairman was disappointed because barely twelve executive members turned up for the deliberation. This means that twelve members ............",
    options: [
      "avoided the meeting hall",
      "attended the scheduled meeting",
      "voted against the agenda",
      "postponed the conference"
    ],
    correctAnswer: "attended the scheduled meeting",
    hint: "To turn up means to arrive, appear, or be present.",
    workedSolution: "The phrasal verb 'to turn up' means to appear, arrive, or attend an event; 'attended' is its exact meaning.",
    points: 1
  },
  {
    number: 18,
    prompt: "Despite the provocation, Tony held his tongue throughout the angry dispute. This means that Tony ............",
    options: [
      "clenched his jaw in agony",
      "spoke in an aggressive tone",
      "refrained from speaking and kept quiet",
      "laughed sarcastically at his rivals"
    ],
    correctAnswer: "refrained from speaking and kept quiet",
    hint: "To refrain from expressing an opinion; to keep silent.",
    workedSolution: "The idiom 'to hold one's tongue' means to deliberately remain silent and refrain from speaking.",
    points: 1
  },
  {
    number: 19,
    prompt: "Do not invite Jones to the secret briefing, as he is sure to let the cat out of the bag. This means Jones will ............",
    options: [
      "create chaos in the room",
      "reveal the confidential secret",
      "bring an animal into the hall",
      "misplace the official files"
    ],
    correctAnswer: "reveal the confidential secret",
    hint: "To disclose a secret carelessly or prematurely.",
    workedSolution: "The idiom 'to let the cat out of the bag' means to disclose confidential information or reveal a secret.",
    points: 1
  },
  {
    number: 20,
    prompt: "The school principal cleared the air regarding the recent increase in boarding levies. This means the principal ............",
    options: [
      "cancelled the planned increment",
      "opened the classroom windows",
      "explained the reasons and removed misunderstandings",
      "apologized for imposing the fees"
    ],
    correctAnswer: "explained the reasons and removed misunderstandings",
    hint: "To eliminate doubts, misunderstandings, or suspicions through clarification.",
    workedSolution: "The idiom 'to clear the air' means to eliminate confusion, suspicion, or tension by explaining the full truth openly.",
    points: 1
  },
  {
    number: 21,
    prompt: "The striker's powerful shot missed the goalpost by a hair's breadth. This means that ............",
    options: [
      "the ball flew high into the spectator stands",
      "the goalkeeper caught the ball effortlessly",
      "he came extraordinarily close to scoring a goal",
      "the goal was ruled offside by the referee"
    ],
    correctAnswer: "he came extraordinarily close to scoring a goal",
    hint: "By a very narrow margin; barely missing.",
    workedSolution: "The idiom 'by a hair's breadth' means by an extremely tiny margin; the striker came within inches of scoring a goal.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "Applying pure shea butter makes dry skin smooth, whereas exposure to wind makes it ...... .\nChoose the word most nearly opposite in meaning to 'smooth'.",
    options: ["dark", "flaccid", "rough", "moist"],
    correctAnswer: "rough",
    hint: "'Smooth' means having an even, gentle surface. What word denotes uneven, coarse texture?",
    workedSolution: "'Smooth' describes an even, flat surface. Its direct physical antonym regarding skin or texture is 'rough'.",
    points: 1
  },
  {
    number: 23,
    prompt: "It is wrong to despise the poor; rather, we should ...... their honest industry.\nChoose the word most nearly opposite in meaning to 'despise'.",
    options: ["admire", "defraud", "tolerate", "pity"],
    correctAnswer: "admire",
    hint: "'Despise' means to look down on with contempt. Find the word denoting looking up to with respect.",
    workedSolution: "'Despise' means to view with contempt, disdain, or scorn. Its direct antonym is 'admire' (or respect).",
    points: 1
  },
  {
    number: 24,
    prompt: "Sneezing is largely an involuntary reflex, whereas speaking is a completely ...... action.\nChoose the word most nearly opposite in meaning to 'involuntary'.",
    options: ["swift", "complex", "intentional", "natural"],
    correctAnswer: "intentional",
    hint: "'Involuntary' means done without conscious control. What word denotes done on purpose with conscious will?",
    workedSolution: "'Involuntary' describes an action performed unconsciously without deliberate choice. Its direct antonym is 'intentional' (or voluntary).",
    points: 1
  },
  {
    number: 25,
    prompt: "Kofi declared that he would rather live as a generous spendthrift than as a stingy ...... .\nChoose the word most nearly opposite in meaning to 'spendthrift'.",
    options: ["pauper", "miser", "bankrupt", "usurer"],
    correctAnswer: "miser",
    hint: "A 'spendthrift' spends money wastefully and extravagantly. What word denotes someone who hoards money and hates spending?",
    workedSolution: "'Spendthrift' denotes someone who squanders money extravagantly. Its direct economic opposite is 'miser' (one who hoards wealth selfishly).",
    points: 1
  },
  {
    number: 26,
    prompt: "The visiting delegation received a cordial reception from the hosts, but a ...... posture from the protesters.\nChoose the word most nearly opposite in meaning to 'cordial'.",
    options: ["haughty", "hostile", "rigid", "cautious"],
    correctAnswer: "hostile",
    hint: "'Cordial' means warm and welcoming. What word denotes antagonistic, unwelcoming, and aggressive?",
    workedSolution: "'Cordial' means warm, genial, and polite. Its direct behavioral antonym is 'hostile' (antagonistic and unfriendly).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (27 - 40) ---
  {
    number: 27,
    prompt: "Responsible adolescents are strongly counseled to abstain ...... risky behaviors.",
    options: ["in", "on", "from", "against"],
    correctAnswer: "from",
    hint: "Identify the preposition that regularly collocates with the verb 'abstain'.",
    workedSolution: "In standard English grammar, the verb 'abstain' requires the preposition 'from' ('abstain from alcohol/drugs').",
    points: 1
  },
  {
    number: 28,
    prompt: "Father writes with exceptional elegance, ...... he?",
    options: ["wouldn't", "didn't", "doesn't", "won't"],
    correctAnswer: "doesn't",
    hint: "The main verb 'writes' is simple present affirmative with singular subject 'Father'. Form a negative tag with 'does'.",
    workedSolution: "The main clause has an affirmative simple present verb ('writes') with singular subject 'Father'. Its matching tag is 'doesn't he?'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Heavy industrial mining machinery is transported across oceans ...... sea.",
    options: ["through", "to", "on", "by"],
    correctAnswer: "by",
    hint: "General modes of transport (sea, air, road, rail) take the preposition 'by' without an article.",
    workedSolution: "When describing standard modes of transport or shipping without determiners, English uses 'by' ('by sea', 'by air').",
    points: 1
  },
  {
    number: 30,
    prompt: "Social Studies ...... my favorite subject throughout my basic school years.",
    options: ["has been", "were", "was", "have been"],
    correctAnswer: "was",
    hint: "School academic subjects ending in '-s' (Social Studies, Mathematics, Physics) are grammatically singular.",
    workedSolution: "Academic subjects like 'Social Studies' or 'Life Skills' are treated as singular nouns. In a past narrative context, it requires 'was'.",
    points: 1
  },
  {
    number: 31,
    prompt: '"Would you mind if I borrowed your dictionary?"\n"............; please take it."',
    options: [
      "Yes, I do",
      "Yes, I mind",
      "No, I wouldn't",
      "No, I don't mind"
    ],
    correctAnswer: "No, I wouldn't",
    hint: "A polite affirmative grant of permission to 'Would you mind...?' requires a negative modal response: 'No, I wouldn't [mind]'.",
    workedSolution: "When someone asks 'Would you mind...?', replying 'No' means 'I do not object' (granting permission), matching the hypothetical modal: 'No, I wouldn't'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Has Sister Edith ...... her glass of herbal tea this evening?",
    options: ["drank", "drink", "drinks", "drunk"],
    correctAnswer: "drunk",
    hint: "The present perfect auxiliary 'Has' takes the past participle form of 'drink': drink - drank - drunk.",
    workedSolution: "The principal parts of 'drink' are: present 'drink', past 'drank', past participle 'drunk'. Following 'Has', the past participle 'drunk' is required.",
    points: 1
  },
  {
    number: 33,
    prompt: "If my elder brother had arrived from Kumasi, I ...... have received my school fees.",
    options: ["may", "will", "shall", "would"],
    correctAnswer: "would",
    hint: "Third Conditional: 'had arrived' in the if-clause requires 'would + have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the main clause requires the past modal auxiliary 'would' ('would have received').",
    points: 1
  },
  {
    number: 34,
    prompt: "Daily national newspapers are significantly ...... commercial glossy magazines.",
    options: ["cheap as", "cheapest of", "cheaper than", "cheap than"],
    correctAnswer: "cheaper than",
    hint: "Comparative degree of the one-syllable adjective 'cheap' followed by the comparative particle 'than'.",
    workedSolution: "Comparing two items requires the comparative inflection '-er' followed by 'than': 'cheaper than'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The kindergarten teacher taught the pupils a delightful new ...... song.",
    options: ["children", "childrens'", "childrens", "children's"],
    correctAnswer: "children's",
    hint: "The irregular plural noun 'children' forms its possessive by adding apostrophe + 's' ('children's').",
    workedSolution: "'Children' is already plural. Plural nouns that do not end in 's' form their possessive by adding an apostrophe and 's' ('children's song').",
    points: 1
  },
  {
    number: 36,
    prompt: "Kofi informed his mother that he ...... complete his homework before supper.",
    options: ["will", "can", "would", "shall"],
    correctAnswer: "would",
    hint: "Reported speech sequence of tenses: The past reporting verb 'informed' requires the backshift of 'will' to 'would'.",
    workedSolution: "In indirect reported speech governed by a past reporting verb ('informed'), the modal 'will' shifts to its past form 'would'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The championship football match was played ...... two and four o'clock in the afternoon.",
    options: ["by", "toward", "between", "from"],
    correctAnswer: "between",
    hint: "Identify the preposition of temporal interval that pairs with 'and'.",
    workedSolution: "The temporal correlative structure identifying a time interval between two boundary points linked by 'and' is 'between ... and ...'.",
    points: 1
  },
  {
    number: 38,
    prompt: "The girl informed her parents that she ...... from the church rehearsal.",
    options: ["comes", "had come", "has come", "has been coming"],
    correctAnswer: "had come",
    hint: "Reported speech sequence: An action completed prior to the past reporting verb 'informed' takes the past perfect tense.",
    workedSolution: "In indirect reported speech, an action that occurred before the past verb 'informed' shifts to the Past Perfect tense: 'had come'.",
    points: 1
  },
  {
    number: 39,
    prompt: "...... the candidate reported late for the examination, he succeeded in finishing the paper.",
    options: ["Since", "As", "Despite", "Although"],
    correctAnswer: "Although",
    hint: "Subordinating conjunction of concession introducing a clause containing subject and finite verb.",
    workedSolution: "'Although' is a concessive conjunction introducing a finite subordinate clause ('Although the candidate reported late...'). 'Despite' requires a noun phrase.",
    points: 1
  },
  {
    number: 40,
    prompt: "The philosophical treatise was ...... complex for the junior pupils to comprehend.",
    options: ["much", "too", "little", "so"],
    correctAnswer: "too",
    hint: "Correlative degree modifier pairing with an infinitive to denote an excessive quality that prevents success: 'too + adjective + to-infinitive'.",
    workedSolution: "The degree adverb 'too' pairs with the infinitive 'to comprehend' to express an excessive degree that results in inability ('too complex to comprehend').",
    points: 1
  }
];

// Combine all 40 raw questions
const allRawQuestions = [
  ...passage1Questions,
  ...passage2Questions,
  ...generalQuestions
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

const assignedTargetIndices = seedShuffle(targetKeys, 200302);

// Attach Passage I (Q1-6) and Passage II (Q7-11) directly to questions so that
// the passage ALWAYS comes first before any question is displayed!
const balancedPaper1 = allRawQuestions.map((q, idx) => {
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

  const qNum = q.number;
  let passageTitle: string | undefined = undefined;
  let passageText: string | undefined = undefined;
  let passage: string | undefined = undefined;

  if (qNum >= 1 && qNum <= 6) {
    passageTitle = "Passage I: The Gathering Clouds and the Drought";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 7 && qNum <= 11) {
    passageTitle = "Passage II: Teacher Amu's Lessons and Abre";
    passageText = passage2Text;
    passage = passage2Text;
  }

  return {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points,
    ...(passageTitle ? { passageTitle } : {}),
    ...(passageText ? { passageText } : {}),
    ...(passage ? { passage } : {})
  };
});

// Partition Questions for Passage-First UI Rendering
const passage1Items = balancedPaper1.slice(0, 6);
const passage2Items = balancedPaper1.slice(6, 11);
const remainingItems = balancedPaper1.slice(11);

// =========================================================================
// PAPER 2: ESSAY WRITING (COMPOSITION) - FULL ORIGINAL SUITE
// =========================================================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Your school lacks a standard playing field, forcing students to practice sports in hazardous, rocky surroundings. Write a formal petition to your District Chief Executive (DCE) appealing for municipal assistance to construct a modern sports field.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2003

The District Chief Executive
Bekwai Municipal Assembly
Municipal Directorate, Bekwai

Dear Sir,

PETITION FOR MUNICIPAL ASSISTANCE TO CONSTRUCT A MODERN SCHOOL PLAYING FIELD

On behalf of the students and sports department of Methodist Junior Secondary School, Bekwai, I respectfully submit this petition to draw your administrative attention to our acute lack of a standard playing field and to appeal for municipal intervention.

For several years, our school of over four hundred students has had no functional sports pitch. Our pupils are forced to practice soccer, athletics, and volleyball on an uneven, rocky plot littered with exposed roots and gravel. Consequently, our talented athletes suffer recurrent physical injuries—including sprained ankles, deep knee abrasions, and fractured collarbones—during mandatory physical education periods. More discouragingly, our school cannot host inter-school friendly matches or zonal athletic competitions, depriving our youth of wholesome sporting interaction.

Physical education is a vital component of the national basic education curriculum. Engaging in organized sports instills physical discipline, builds mental endurance, and unearths raw athletic talents that could bring national honors and scholarships to our district. Denying our students a safe recreational ground undermines their physical well-being and stifles athletic development.

Fortunately, our school community possesses an undeveloped two-acre parcel of land behind the junior block. We humbly appeal to the District Assembly to assist us by deploying municipal bulldozers and graders to level the ground, clear the rocks, and construct standard goalposts and running tracks.

We count on your visionary leadership and commitment to youth development.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Sports Prefect)`
      },
      {
        questionNumber: "2",
        category: "Informal / Persuasive Letter",
        prompt: "You wish to continue your education in a Senior Secondary School after leaving Junior Secondary School (JSS), but your parents cannot afford the financial expenditure. Write a letter to your affluent uncle giving him at least three reasons why you need his financial sponsorship.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 2003

Dear Uncle Kwesi,

I hope this letter finds you in fine health, peace of mind, and thriving in your business enterprises in Accra. As I approach the conclusion of my final year in junior secondary school, I write to share an urgent personal crisis and to appeal for your benevolent financial sponsorship.

Recently, my parents informed me that due to poor seasonal cocoa harvests, they cannot afford the financial expenditure required to enroll me in Senior Secondary School. They have suggested that I terminate my schooling and learn a manual trade. While I respect their domestic financial constraints, my heart is broken because academic education is my greatest passion. I humbly present three compelling reasons why I need your sponsorship.

First and foremost, I have consistently demonstrated exceptional academic competence, placing first in my class in Mathematics, Integrated Science, and English throughout my three years in basic school. In our recent regional mock examinations, I secured Aggregate Six. My teachers have affirmed that I possess the intellectual discipline to excel in the General Science programme at Prempeh College.

Secondly, my lifelong ambition is to study civil engineering at the university to help design modern bridges and water systems for rural communities. Terminating my schooling now would permanently extinguish this dream.

Finally, obtaining secondary and tertiary education will empower me to become financially self-reliant and break the cycle of poverty in our family, enabling me to support my younger siblings in the future.

I promise to study with relentless diligence to justify your investment. May God richly bless your endeavors.

Your grateful nephew,
[Signature]
Emmanuel Addo`
      },
      {
        questionNumber: "3",
        category: "Descriptive Narrative",
        prompt: "Your school is organizing an educational excursion to a prominent historical or geographical site in your region. Describe in detail the comprehensive preparations your class is making towards the upcoming journey.",
        modelAnswer: `PREPARATIONS TOWARDS OUR CLASS EXCURSION TO KAKUM NATIONAL PARK

Excitement and lively anticipation have engulfed our Form Three classroom over the past month as we make comprehensive preparations for our upcoming educational excursion to the world-renowned Kakum National Park in the Central Region, scheduled for next Friday.

Our preparations commenced with extensive academic research under the guidance of our Integrated Science and Social Studies master, Mr. Mensah. During our weekly club periods, our class was divided into four specialized inquiry committees: the Botanical Team, tasked with documenting tropical rainforest flora; the Wildlife Team, assigned to observe primate species and canopy birds; the Geography Team, responsible for studying rainfall patterns and soil conservation; and the Logistics Committee. Each student has assembled a field notebook, magnifying glasses, and measurement charts to record observations during the tour.

Financially, our class executive organized a series of self-help fundraising initiatives to subsidize the trip. We cultivated and harvested fresh vegetables from our school farm, organized a Saturday car wash, and sold craft items at the local market, successfully raising three hundred thousand cedis to reduce individual travel levies. Our class teacher has finalized arrangements with the State Transport Corporation to charter an air-conditioned passenger bus, ensuring safe and reliable transit.

Domestic preparations are equally well advanced. Our mothers have agreed to prepare portable travel snacks—including roasted chicken, boiled eggs, and meat pies—packed in insulated cooler containers alongside abundant bottled water. Furthermore, our school dispensary has equipped our class prefects with a comprehensive first-aid kit containing bandages, antiseptics, and analgesics.

We are physically and mentally ready to transform our classroom textbook notes into living realities. Kakum promises to be an unforgettable adventure.`
      },
      {
        questionNumber: "4",
        category: "Article for Publication",
        prompt: 'Write a persuasive article for publication in the Junior Graphic on the topic: "Why Candidates Should Not Cheat in Examinations."',
        modelAnswer: `WHY CANDIDATES SHOULD NOT CHEAT IN EXAMINATIONS
By Samuel K. Boateng, Begoro

In contemporary basic and secondary schools across Ghana, the disturbing phenomenon of examination malpractice—popularly known as cheating—has emerged as a dangerous cancer threatening the moral fabric and international credibility of our educational system. Whether it takes the form of sneaking concealed notes into the hall, copying from seatmates, or purchasing leaked question papers, cheating is an intellectual crime that must be resolutely rejected by every disciplined student.

First and foremost, cheating destroys personal integrity and undermines authentic self-confidence. The primary objective of an examination is not merely to obtain a certificate; it is to assess a student's actual mastery of knowledge and critical thinking skills. A candidate who cheats to secure high grades lives in constant fear of exposure and deceit. When such students transition to higher educational institutions or professional workplaces, their intellectual hollowness is swiftly exposed, leading to humiliation and career failure. Real self-worth comes from knowing that your grade reflects your honest labor.

Secondly, examination malpractice attracts catastrophic institutional sanctions. The West African Examinations Council (WAEC) imposes severe penalties on culprits, including the cancellation of entire subject results, outright disqualification of entire school centers, and multi-year bans from sitting national examinations. In severe cases, candidates face public prosecution and criminal detention. Sacrificing years of hard schooling for a fleeting, dishonest advantage is absolute foolishness.

Furthermore, cheating devalues Ghana's educational credentials internationally, making foreign universities skeptical of local certificates.

In conclusion, academic success has no shortcuts. Let every candidate cultivate diligent study habits, revise past questions methodically, and rely on honest preparation. Integrity is the true hallmark of an educated mind.`
      }
    ]
  }
};

async function seedBeceEnglish2003Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2003 into Firestore...");

  const db = await getDb();

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2003");
  await docRef.set({
    year: 2003,
    title: "BECE English Language 2003 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      passageFirstLayout: true,
      updatedAt: new Date()
    },
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      passages: [
        {
          id: "passage_1",
          title: "Passage I: The Gathering Clouds and the Drought",
          text: passage1Text,
          questionRange: "Questions 1 to 6"
        },
        {
          id: "passage_2",
          title: "Passage II: Teacher Amu's Lessons and Abre",
          text: passage2Text,
          questionRange: "Questions 7 to 11"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Gathering Clouds and the Drought",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: Teacher Amu's Lessons and Abre",
          text: passage2Text,
          questionRange: "Questions 7 to 11",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 12 to 40",
        questions: remainingItems
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: paper2Calibrated.sectionA_essay.questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2003 successfully seeded into Firestore!");
}

seedBeceEnglish2003Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2003:", err);
    process.exit(1);
  });

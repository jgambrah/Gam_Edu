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
// ISOMORPHIC PASSAGE I: THE MIDNIGHT RESCUE AND FIRST AID (CALIBRATED)
// =========================================================================
const passage1Title = "Passage I: The Midnight Rescue and First Aid";
const passage1Text = `We were abruptly jolted awake at dawn by piercing shrieks echoing from the tenants in our compound house. They were raising a frantic commotion in the central courtyard. Father bolted instantly from his mattress and lunged for the bedroom door. Barely a minute later, we heard him cry out in acute agony. We sprinted into the central hallway, flicked on the light switch, and found him sprawled flat on his back, clutching his forehead in pain.

In his desperate rush to unlatch the front door, he had neglected to switch on the corridor lights, running straight headlong into the heavy concrete pillar erected in the middle of the hall. When we inspected his brow, we observed a massive lump swelling rapidly, with dark blood oozing from a deep laceration near his right eyebrow.

Mother, a retired nursing sister, issued calm, rapid directives to fetch the domestic first-aid kit, a basin of ice cubes, and Father's towel. When the supplies arrived, she attended immediately to the bleeding wound. Wrapping several ice cubes within the towel, she pressed the cold compress firmly against the cut for about two minutes to constrict the ruptured vessels. Having wiped away the blood gently, she applied a swab of iodine gauze over the wound and secured it with a clean cotton bandage. Turning to the contusion, she gently massaged the lump with ice, noticeably reducing the swelling.

She then unlatched the front door, and we beheld a truly pathetic scene. Stretched across the middle of the courtyard lay the motionless body of one of the tenants. In a desperate attempt to resist an armed robbery attack, he had been butchered mercilessly and his lifeless body abandoned in the yard.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "According to Passage I, what sudden event woke the narrator and the family at dawn?",
    options: [
      "The father crashing his head violently into the concrete pillar",
      "The frantic screams and loud commotion of the tenants in the yard",
      "The shattering sound of the front door being forced open",
      "The arrival of the armed robbery gang on the veranda"
    ],
    correctAnswer: "The frantic screams and loud commotion of the tenants in the yard",
    hint: "Reread paragraph one: they were awakened by the screams of the tenants making a lot of commotion in the yard.",
    workedSolution: "The narrative opens by stating that the family was awakened at dawn by the frantic screams and loud commotion of the compound tenants.",
    points: 1
  },
  {
    number: 2,
    prompt: "Why was the narrator's father discovered lying on his back holding his brow in Passage I?",
    options: [
      "He had suffered an acute muscle spasm and collapsed",
      "He had collided violently with the concrete pillar in the dark",
      "He was attempting to hold his breath to stop internal bleeding",
      "He had been assaulted by an armed robber in the corridor"
    ],
    correctAnswer: "He had collided violently with the concrete pillar in the dark",
    hint: "Check paragraph two: rushing in the dark without switching on the lights caused him to crash headlong into the pillar.",
    workedSolution: "The father was clutching his head because, rushing through the unlit hallway, he ran directly into the concrete pillar.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, what was the primary medical purpose of applying ice cubes to the father's head?",
    options: [
      "To disinfect the cut against infectious bacteria",
      "To accelerate the healing of the skin tissues",
      "To clean the bloodstains off his forehead",
      "To arrest the bleeding and reduce the contusion swelling"
    ],
    correctAnswer: "To arrest the bleeding and reduce the contusion swelling",
    hint: "Reread paragraph three: mother pressed ice on the cut for two minutes and massaged the lump to reduce swelling.",
    workedSolution: "The cold compress was applied to constrict ruptured blood vessels to arrest bleeding and to minimize inflammation and swelling.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the word 'pathetic' in 'beheld a pathetic scene' means ............",
    options: [
      "naughty and disobedient",
      "merciless and cruel",
      "deeply sorrowful, heartbreaking, and distressing",
      "peculiar and unfamiliar"
    ],
    correctAnswer: "deeply sorrowful, heartbreaking, and distressing",
    hint: "'Pathetic' in this context means arousing profound pity, grief, and sadness.",
    workedSolution: "'Pathetic' describes a sight that evokes intense pity, sadness, and grief; 'deeply sorrowful, heartbreaking, and distressing' is its direct meaning.",
    points: 1
  },
  {
    number: 5,
    prompt: "According to the concluding paragraph of Passage I, what happened to the unfortunate tenant?",
    options: [
      "He opened the front gate to admit the medical personnel",
      "He was brutally killed by armed robbers after resisting",
      "He slipped and fell heavily across the concrete drainage ditch",
      "He fled into the adjacent bush to alert the police"
    ],
    correctAnswer: "He was brutally killed by armed robbers after resisting",
    hint: "Look at the final sentence: trying to resist an attack from armed robbers, he had been butchered mercilessly.",
    workedSolution: "The tenant lost his life because he bravely attempted to resist the armed robbers, who attacked and killed him mercilessly.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE ACOUSTICS OF SONGBIRDS (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Title = "Passage II: The Acoustics of Songbirds";
const passage2Text = `Where is the enchanting musical auditorium of songbirds located? It is situated in no gilded concert hall, but rather high upon leafy tree branches, rustic garden fences, and elevated telephone wires. It is from these open perches that our small feathered companions blend their delicate vocal cords in some of the most melodious harmonies heard on earth.

Songbirds do not emit random noise. The male voices in this avian choir, for example, communicate two precise messages through their vocalizations. First, their melody serves as an unmistakable territorial boundary warning to other males to keep away from their partners. Second, it functions as an alluring invitation from bachelor birds seeking to attract prospective female mates. The most intricate and vigorous melodies are produced during the mating and breeding season, when males exert their vocal energies to win the affection of female birds.

Songbirds are truly extraordinary vocalists. They possess the rare biological capability to produce three or four distinct musical notes simultaneously. To the human ear, this intricate acoustic blend registers as a single unified beat, yet birds can decipher the individual notes effortlessly due to their extraordinarily keen auditory perception. At times, what sounds like a song to human listeners is actually a functional social directive designed to maintain flock cohesion during flight, or a sharp warning of an approaching airborne predator.

How birds compose their melodies is a fascinating field of inquiry. Some species have their melodies genetically hardwired into their brains at birth. While certain birds imitate the calls of surrounding species, others compose entirely unique songs, resolutely refusing to mimic whatever notes they hear from their neighbors.`;

const passage2QuestionsRaw = [
  {
    number: 6,
    prompt: "According to Passage II, songbirds are capable of singing melodious tunes effortlessly because they ............",
    options: [
      "are innately gifted natural singers from birth",
      "undergo formal musical training in concert halls",
      "possess vocal cords identical to human singers",
      "are compelled by nature to make loud noise"
    ],
    correctAnswer: "are innately gifted natural singers from birth",
    hint: "Paragraph four notes: some birds have their songs fixed in their brains at birth; they are naturally endowed.",
    workedSolution: "The text explains that songbirds are biologically endowed with innate singing abilities, with songs often hardwired in their brains from birth.",
    points: 1
  },
  {
    number: 7,
    prompt: "According to Passage II, why do male songbirds sing with exceptional vigor during the breeding season?",
    options: [
      "To guide young chicks during migratory flights",
      "To produce four musical notes for human amusement",
      "To attract, impress, and court prospective female partners",
      "To imitate the calls of predatory animals"
    ],
    correctAnswer: "To attract, impress, and court prospective female partners",
    hint: "Check paragraph two: the most vigorous songs are sung during the breeding season to impress the female birds.",
    workedSolution: "Male songbirds sing with great intensity during the breeding season specifically to attract and impress female mates.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following assertions about songbirds is confirmed by Passage II?",
    options: [
      "They sing exclusively during the breeding season",
      "They produce some of the most melodious and sweet songs on earth",
      "Female birds sing to invite bachelor birds to their nests",
      "They can vocalize only a single musical note at a time"
    ],
    correctAnswer: "They produce some of the most melodious and sweet songs on earth",
    hint: "Paragraph one highlights that little feathered creatures blend their voices in some of the most melodious songs in the world.",
    workedSolution: "The author explicitly affirms in paragraph one that songbirds produce some of the sweetest, most melodious melodies in the natural world.",
    points: 1
  },
  {
    number: 9,
    prompt: "In Passage II, the word 'unique' in 'compose songs which are unique' means ............",
    options: [
      "suitable and fitting",
      "similar to others",
      "delightful and exciting",
      "special, distinct, and one-of-a-kind"
    ],
    correctAnswer: "special, distinct, and one-of-a-kind",
    hint: "'Unique' means being the only one of its kind; distinct and unlike anything else.",
    workedSolution: "'Unique' means being the only one of its kind, distinct, or original; 'special, distinct, and one-of-a-kind' is its exact equivalent.",
    points: 1
  },
  {
    number: 10,
    prompt: "What does the passage imply regarding the auditory perception of birds compared to human beings?",
    options: [
      "Human beings possess sharper hearing than songbirds",
      "Birds possess a superior capacity to interpret simultaneous musical notes",
      "Birds produce louder acoustic noise than human musical instruments",
      "Human beings compose more intricate melodies than birds"
    ],
    correctAnswer: "Birds possess a superior capacity to interpret simultaneous musical notes",
    hint: "Paragraph three points out that while humans hear only one beat, birds distinguish three or four notes due to their keen hearing.",
    workedSolution: "The text explains that while humans hear several notes as a single beat, birds' acute hearing allows them to interpret each simultaneous note individually.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// =========================================================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "The dilapidated coastal fortress has been abandoned by the community.\nChoose the word nearest in meaning to 'abandoned'.",
    options: ["demolished", "deserted", "infested", "auctioned"],
    correctAnswer: "deserted",
    hint: "Left behind completely; vacated or forsaken.",
    workedSolution: "'Abandoned' means left permanently empty or forsaken; 'deserted' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The football supporters were optimistic that their national team would lift the continental trophy.\nChoose the word nearest in meaning to 'optimistic'.",
    options: ["reasonable", "cheerful", "anxious", "hopeful"],
    correctAnswer: "hopeful",
    hint: "Confident, positive, and expectant of a favorable outcome.",
    workedSolution: "'Optimistic' means possessing a positive outlook or expecting favorable outcomes; 'hopeful' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The indigenous craftsmen supplied all the timber required to construct the community clinic.\nChoose the word nearest in meaning to 'indigenous'.",
    options: ["skilled", "native", "expatriate", "resident"],
    correctAnswer: "native",
    hint: "Originating or occurring naturally in a particular region; local.",
    workedSolution: "'Indigenous' refers to people, species, or things native to a specific locality; 'native' is its exact equivalent.",
    points: 1
  },
  {
    number: 14,
    prompt: "The vigilance of the security officer that averted the burglary was laudable.\nChoose the word nearest in meaning to 'laudable'.",
    options: ["praiseworthy", "prompt", "genuine", "tireless"],
    correctAnswer: "praiseworthy",
    hint: "Deserving high praise, commendation, or admiration.",
    workedSolution: "'Laudable' means deserving praise and commendation; 'praiseworthy' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "Our self-sacrificing teachers deserve our deepest appreciation.\nChoose the word nearest in meaning to 'appreciation'.",
    options: ["assistance", "gratitude", "sympathy", "encouragement"],
    correctAnswer: "gratitude",
    hint: "The feeling or expression of thankfulness and recognition.",
    workedSolution: "'Appreciation' in the context of recognizing benevolence means thankfulness or 'gratitude'.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "Mr. Taiwoo took the administrative clerk to task for misplacing the confidential letters. This means that Mr. Taiwoo ............",
    options: [
      "dismissed the clerk from service",
      "reprimanded and blamed the clerk sharply",
      "accused the clerk of criminal theft",
      "reassigned the clerk to another department"
    ],
    correctAnswer: "reprimanded and blamed the clerk sharply",
    hint: "To take someone to task means to criticize, reprimand, or scold them for a mistake.",
    workedSolution: "The idiom 'to take someone to task' means to rebuke, criticize, or blame them sharply for an error or fault.",
    points: 1
  },
  {
    number: 17,
    prompt: "During the town meeting, the heated disagreement got out of hand. This means that the dispute ............",
    options: [
      "became completely uncontrollable",
      "was prolonged into the evening",
      "became tiresome and boring",
      "was settled through peaceful arbitration"
    ],
    correctAnswer: "became completely uncontrollable",
    hint: "Beyond management or control.",
    workedSolution: "The idiom 'to get out of hand' means to become chaotic, unmanageable, or uncontrollable.",
    points: 1
  },
  {
    number: 18,
    prompt: "Upon catching sight of the disciplinary master, the truant girl took to her heels. This means the girl ............",
    options: [
      "fainted on the path",
      "trembled with terror",
      "ran away rapidly in flight",
      "hid beneath the veranda"
    ],
    correctAnswer: "ran away rapidly in flight",
    hint: "To run away as fast as possible.",
    workedSolution: "The idiom 'to take to one's heels' means to turn and run away hastily in flight.",
    points: 1
  },
  {
    number: 19,
    prompt: "Joseph lives within a stone's throw from the municipal post office. This means that Joseph ............",
    options: [
      "resides in a house built of stone",
      "lives in very close proximity to the post office",
      "frequently visits the postal station",
      "habitually throws stones along the road"
    ],
    correctAnswer: "lives in very close proximity to the post office",
    hint: "A very short distance away.",
    workedSolution: "The idiom 'a stone's throw' means a very short distance away or in very close proximity.",
    points: 1
  },
  {
    number: 20,
    prompt: "All his ambitious plans for establishing a modern printing press came to naught. This means that ............",
    options: [
      "the printing press was successfully launched",
      "his plans failed completely and yielded nothing",
      "the machinery was destroyed by rain",
      "he secured an institutional bank loan"
    ],
    correctAnswer: "his plans failed completely and yielded nothing",
    hint: "To come to nothing; to fail completely without result.",
    workedSolution: "The idiom 'to come to naught' means to end in total failure or produce zero successful results.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While my father maintains a cordial relationship with his neighbors, the tenant is notoriously ...... .\nChoose the word most nearly opposite in meaning to 'cordial'.",
    options: ["harsh", "hostile", "scornful", "distant"],
    correctAnswer: "hostile",
    hint: "'Cordial' means warm, polite, and friendly. What word denotes aggressive, unwelcoming, and antagonistic?",
    workedSolution: "'Cordial' means warm, genial, and friendly. Its direct behavioral antonym is 'hostile' (antagonistic and unfriendly).",
    points: 1
  },
  {
    number: 22,
    prompt: "The opening act of the theatrical performance was dull, but the climax was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'dull'.",
    options: ["interesting", "informative", "sensible", "instructive"],
    correctAnswer: "interesting",
    hint: "'Dull' means boring, unexciting, and lacking interest. What word denotes engaging, lively, and fascinating?",
    workedSolution: "'Dull' describes something uninteresting, boring, or monotonous. Its direct antonym is 'interesting' (or exciting).",
    points: 1
  },
  {
    number: 23,
    prompt: "The disease left the patient feeble, but following therapy he became remarkably ...... .\nChoose the word most nearly opposite in meaning to 'feeble'.",
    options: ["bold", "strong", "lively", "resilient"],
    correctAnswer: "strong",
    hint: "'Feeble' means physically weak and lacking vigor. What word denotes possessing muscular power and robust health?",
    workedSolution: "'Feeble' means physically weak, frail, or lacking strength. Its direct physical antonym is 'strong'.",
    points: 1
  },
  {
    number: 24,
    prompt: "While the intruder descended the stairs hurriedly, the elderly watchman walked down ...... .\nChoose the word most nearly opposite in meaning to 'hurriedly'.",
    options: ["cautiously", "lazily", "slowly", "quietly"],
    correctAnswer: "slowly",
    hint: "'Hurriedly' means in a rapid rush. What word denotes moving with unhurried, measured pace?",
    workedSolution: "'Hurriedly' means done with speed or haste. Its direct adverbial antonym is 'slowly'.",
    points: 1
  },
  {
    number: 25,
    prompt: "The diligent scholar was awarded a certificate, whereas the ...... pupil failed the examination.\nChoose the word most nearly opposite in meaning to 'diligent'.",
    options: ["careless", "playful", "insolent", "slothful"],
    correctAnswer: "careless",
    hint: "'Diligent' means industrious, painstaking, and attentive. What word denotes inattentive, negligent, and lacking care?",
    workedSolution: "'Diligent' implies persistent care, earnestness, and hard work. Its direct behavioral antonym in academic duties is 'careless' (or lazy).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "Father visited the boarding school to ascertain how Abu was getting ...... in his coursework.",
    options: ["on", "down", "back", "up"],
    correctAnswer: "on",
    hint: "Identify the phrasal verb meaning to make progress, manage, or fare in a situation: 'get on'.",
    workedSolution: "The phrasal verb 'to get on' means to make progress, fare, or manage in a course of study: 'getting on at school'.",
    points: 1
  },
  {
    number: 27,
    prompt: "If the wooden canoe had been properly caulked and maintained, it ...... capsized in the estuary.",
    options: [
      "have not",
      "will not have",
      "would not have",
      "might have not"
    ],
    correctAnswer: "would not have",
    hint: "Third Conditional: 'had been properly maintained' requires 'would not have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the main clause requires 'would not have + past participle': 'would not have capsized'.",
    points: 1
  },
  {
    number: 28,
    prompt: "The thoroughbred white stallion is significantly ...... than the black mare.",
    options: ["faster", "very fast", "fast", "more fast"],
    correctAnswer: "faster",
    hint: "One-syllable comparative adjective paired with the comparative marker 'than': fast - faster.",
    workedSolution: "One-syllable adjectives form their comparative degree with the suffix '-er' followed by 'than': 'faster than'. Forms like *more fast are ungrammatical.",
    points: 1
  },
  {
    number: 29,
    prompt: "They thought he would qualify as a chartered accountant, ......?",
    options: ["wouldn't they", "didn't they", "wasn't they", "isn't they"],
    correctAnswer: "didn't they",
    hint: "The main verb in the main clause is 'thought' (simple past of 'think'), requiring a question tag formed with 'did'.",
    workedSolution: "The governing verb of the sentence is the simple past 'thought' with subject 'they'. The matching question tag is 'didn't they?'.",
    points: 1
  },
  {
    number: 30,
    prompt: "There were only two students in the classroom who ...... any inkling of the correct answer.",
    options: ["have", "had", "has", "would"],
    correctAnswer: "had",
    hint: "Sequence of past narrative tenses: Governed by the past copula 'There were...'.",
    workedSolution: "In a past narrative framework governed by 'There were...', the subordinate relative clause requires the simple past tense: 'had'.",
    points: 1
  },
  {
    number: 31,
    prompt: "The traveler had boarded an express coach, ......?",
    options: ["wouldn't he", "hadn't he", "isn't it", "won't he"],
    correctAnswer: "hadn't he",
    hint: "The main clause contains the affirmative past perfect auxiliary 'had', requiring a negative contracted tag.",
    workedSolution: "The auxiliary verb in the statement is affirmative past perfect 'had'. The corresponding question tag must be negative: 'hadn't he?'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Mrs. Mensah ...... in the municipality of Saltpond since 1970.",
    options: [
      "was living",
      "has been living",
      "has lived",
      "is living"
    ],
    correctAnswer: "has been living",
    hint: "An ongoing action beginning in past time and continuing up to the present with 'since [year]' takes the Present Perfect Continuous.",
    workedSolution: "The duration phrase 'since 1970' indicating an action continuing uninterrupted from the past into the present requires the Present Perfect Continuous: 'has been living'.",
    points: 1
  },
  {
    number: 33,
    prompt: "The transport booking clerk made the passenger ...... an advance reservation deposit.",
    options: ["to pay", "paid", "to be paying", "pay"],
    correctAnswer: "pay",
    hint: "The causative verb 'make' (past: 'made') takes a direct object followed by a bare infinitive without 'to'.",
    workedSolution: "Causative 'made' requires a bare infinitive without 'to': 'made him pay a deposit'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Although all the bridal gowns were exquisite, she selected ...... of them.",
    options: ["any", "none", "neither", "both"],
    correctAnswer: "none",
    hint: "Use the negative indefinite pronoun referring to a choice among three or more items ('all the dresses').",
    workedSolution: "When referring to three or more items ('all the dresses') in a negative sense, standard English requires 'none'. ('Neither' applies to exactly two items).",
    points: 1
  },
  {
    number: 35,
    prompt: "Kwesi and Ama have been affectionate companions for years; they are deeply in love with ......",
    options: ["themselves", "one another", "each other", "ourselves"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action or emotion is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('Kwesi and Ama'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 36,
    prompt: "The mountain hike is ...... for the junior pupils to undertake in a single afternoon.",
    options: [
      "too long and difficult a journey",
      "the journey too long and difficult",
      "long and difficult too a journey",
      "too long and difficult the journey"
    ],
    correctAnswer: "too long and difficult a journey",
    hint: "Standard syntactic modifier order: 'too + compound adjective + a + noun'.",
    workedSolution: "In formal English syntax, the modifier 'too' precedes the adjectives and takes the indefinite article before the noun: 'too long and difficult a journey'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The torrential downpour could not deter the candidates ...... traveling to the examination center.",
    options: ["for", "on", "by", "from"],
    correctAnswer: "from",
    hint: "Identify the preposition that regularly collocates with the verb 'deter'.",
    workedSolution: "The verb 'deter' takes the preposition 'from' followed by a gerund ('deter someone from doing something').",
    points: 1
  },
  {
    number: 38,
    prompt: "Father packed his luggage because he was leaving ...... Kumasi by the morning coach.",
    options: ["for", "to", "by", "from"],
    correctAnswer: "for",
    hint: "When 'leave' indicates the destination of departure, it takes this preposition.",
    workedSolution: "When stating the destination towards which one is traveling, 'leave' takes the preposition 'for' ('leaving for Kumasi').",
    points: 1
  },
  {
    number: 39,
    prompt: "Yesterday, the headmaster met the gentleman ...... in the city.",
    options: [
      "the car of whom I bought",
      "whose car I bought",
      "I bought his car",
      "whom I bought his car"
    ],
    correctAnswer: "whose car I bought",
    hint: "Use the possessive relative pronoun modifying the noun 'car'.",
    workedSolution: "'Whose' is the relative possessive pronoun correctly modifying the object possessed ('whose car I bought').",
    points: 1
  },
  {
    number: 40,
    prompt: "No sooner had the invigilator distributed the question papers ...... the siren sounded.",
    options: ["when", "for", "as", "than"],
    correctAnswer: "than",
    hint: "The negative correlative temporal adverb 'No sooner' is always paired with 'than'.",
    workedSolution: "The correlative pair is 'No sooner ... than' ('No sooner had... than...'). ('Hardly' and 'Scarcely' pair with 'when').",
    points: 1
  }
];

// Combine raw items
const allRawQuestions = [
  ...passage1QuestionsRaw,
  ...passage2QuestionsRaw,
  ...generalQuestionsRaw
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

const assignedTargetIndices = seedShuffle(targetKeys, 200902);

const balancedPaper1: QuestionItem[] = allRawQuestions.map((q, idx) => {
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

  let passageTitle: string | undefined = undefined;
  let passageText: string | undefined = undefined;
  let passage: string | undefined = undefined;

  if (idx < 5) {
    passageTitle = passage1Title;
    passageText = passage1Text;
    passage = passage1Text;
  } else if (idx < 10) {
    passageTitle = passage2Title;
    passageText = passage2Text;
    passage = passage2Text;
  }

  const item: QuestionItem = {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };

  if (passageTitle) {
    item.passageTitle = passageTitle;
    item.passageText = passageText;
    item.passage = passage;
  }

  return item;
});

// Partition Questions for Passage-First UI Rendering
const passage1Items = balancedPaper1.slice(0, 5);
const passage2Items = balancedPaper1.slice(5, 10);
const remainingItems = balancedPaper1.slice(10);

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
        category: "Informal Letter",
        prompt: "An annual traditional festival was recently celebrated in your area. Write a letter to your friend living in another part of the country, describing the festival and explaining how you enjoyed the celebrations.",
        modelAnswer: `Anglican Junior High School
P. O. Box 48
Cape Coast, Central Region
15th September, 2009

Dear Kwesi,

I hope this letter finds you in fine health and peace of mind. I am writing to share with you the excitement and pageantry of our annual Fetu Afahye festival, which was celebrated with grand pomp in Cape Coast last week.

The celebration commenced with the sacred ban on fishing in the Fosu Lagoon, followed by the cleansing of the traditional stool rooms. The highlight of the celebration took place on Saturday, when a colorful procession of the seven Asafo companies marched through the major streets. Dressed in brilliant traditional military regalia and chanting warrior songs, they fired antique muskets while acrobatic drummers displayed exceptional skill.

Later in the afternoon, the paramount chief and sub-chiefs were carried through town in palanquins decorated with velvet and gold ornaments, shaded by majestic, rotating ceremonial umbrellas. The air was filled with drumming, singing, and the firing of musketry as thousands of citizens and foreign tourists cheered. At the grand durbar held at Victoria Park, traditional libations were poured, and chiefs delivered speeches urging the youth to pursue education and preserve our cultural heritage.

I thoroughly enjoyed the festive food, especially the mouth-watering dishes of fante kenkey, fresh fried fish, and spicy gravy. My cousins and I spent the evening enjoying cultural musical performances by the seaside.

You must definitely plan to spend next year's festival with my family. Extend my warmest greetings to your parents.

Your true friend,
[Signature]
Kofi Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Your teachers have expressed serious concern about rising acts of indiscipline in your school. As the Senior Prefect, write a formal letter to the headmaster describing two common acts of indiscipline and suggesting practical ways of correcting them.",
        modelAnswer: `Presbyterian Junior High School
P. O. Box 112
Begoro, Eastern Region
12th October, 2009

The Headmaster
Presbyterian Junior High School
P. O. Box 112
Begoro

Dear Sir,

REPORT ON PREVAILING ACTS OF INDISCIPLINE AND RECOMMENDATIONS FOR REMEDIAL ACTION

On behalf of the Prefectorial Board, I respectfully write to address the growing concerns raised by the teaching staff regarding student indiscipline, and to suggest constructive measures to restore order and academic focus.

The first prevalent act of indiscipline is habitual lateness and truancy. Many students, particularly those residing in distant quarters, arrive at school long after morning assembly has concluded. Some sneak out of class during break periods to visit commercial gaming centers and video parlors in town. This persistent truancy disrupts class instructional periods and reflects badly on our terminal academic performance.

Secondly, there is an alarming disregard for school property and environmental cleanliness. Desks are vandalized, classroom walls are disfigured with ink markings, and plastic food wrappers are discarded indiscriminately into flower beds rather than waste bins.

To curb lateness and truancy, I recommend that the school administration enforce strict gate security by locking the main compound gate at exactly 7:45 a.m., requiring habitual latecomers to serve monitored manual labor after school hours. Furthermore, school authorities should engage the Parent-Teacher Association (PTA) to caution local video parlor operators against admitting students in uniform during school hours.

To promote cleanliness, I suggest instituting a weekly 'Cleanest Classroom Award' to foster healthy competition among classes, alongside appointing dedicated sanitation monitors.

Thank you for your tireless commitment to our moral and academic discipline.

Yours faithfully,
[Signature]
Emmanuel Osei
(Senior Prefect)`
      },
      {
        questionNumber: "3",
        category: "Debate Speech",
        prompt: "You are the principal speaker in an inter-schools debate on the motion: \"The use of mobile phones in school by students should be banned.\" Write your speech arguing either for or against the motion.",
        modelAnswer: `FOR THE MOTION: "THE USE OF MOBILE PHONES IN SCHOOL BY STUDENTS SHOULD BE BANNED"

Mr. Chairman, Distinguished Panel of Judges, Impartial Timekeeper, Co-debaters, and Fellow Students:

I stand firmly before you this morning to argue in favor of the motion: "The use of mobile phones in school by students should be banned." While mobile technology is undeniably useful in adult society, permitting handsets in basic school classrooms is a dangerous recipe for academic disaster.

First and foremost, mobile phones constitute a massive source of classroom distraction. The primary purpose of attending school is to concentrate on instructional delivery and academic discipline. When students possess smartphones in class, their attention is invariably diverted away from chalkboard notes to social media notifications, unauthorized text messaging, and mobile games. Even when devices are switched to silent mode, the constant urge to check screens shatters cognitive concentration, leading to poor absorption of lesson concepts and widespread examination failure.

Secondly, allowing mobile phones in basic schools worsens socio-economic inequality and peer victimization. Basic schools comprise children from diverse financial backgrounds; while children of affluent parents will flaunt expensive, high-end smartphones, underprivileged pupils will experience deep feelings of inferiority, peer pressure, and humiliation. This disparity often fuels theft in dormitories and classrooms as envious students attempt to acquire fashionable devices. Furthermore, unmonitored smartphones facilitate examination malpractice, enabling unscrupulous candidates to circulate leaked examination materials.

In conclusion, school is a sanctuary for moral character training and undivided academic focus. To safeguard classroom discipline, eliminate peer pressure, and promote academic excellence, mobile phones must be banned entirely from our basic schools.

Thank you.`
      },
      {
        questionNumber: "4",
        category: "Formal Report",
        prompt: "Your school performed exceptionally well in the recently concluded inter-zonal athletics competition. As the Sports Prefect, write a formal report to your headmaster highlighting the team's performance, key victories, and recommendations for future competitions.",
        modelAnswer: `REPORT ON OUR SCHOOL'S PARTICIPATION AND PERFORMANCE IN THE 2009 INTER-ZONAL ATHLETICS COMPETITION
To: The Headmaster, St. Peter's Junior High School
From: David Kwarteng (Sports Prefect)
Date: 24th November, 2009

1. INTRODUCTION
The annual Inter-Zonal Basic Schools Athletics Competition was held from 18th to 20th November 2009 at the Municipal Sports Stadium. St. Peter's JHS competed against seven other basic schools across eighteen track and field events.

2. TEAM PERFORMANCE AND KEY ACHIEVEMENTS
Our school contingent delivered an outstanding performance, finishing as the overall first-place champions in the boys' category and second-place runners-up in the girls' category, securing a total of eight gold, five silver, and four bronze medals.

Our track team dominated the sprint events. Master Daniel Mensah won gold in both the 100-meter and 200-meter dashes, setting a new zonal record of 11.2 seconds in the 100-meter event. In field events, Miss Abena Serwaa clinched gold in the high jump competition by clearing a height of 1.45 meters. The climax of our triumph was the boys' 4x100-meter relay, where our quartet secured a breathtaking gold medal, drawing deafening cheers from the packed stadium.

3. CHALLENGES ENCOUNTERED
Despite our resounding victory, our athletes faced severe logistical constraints. Our runners competed without standard spiked running shoes, which caused several slips on the wet grass track. Additionally, our relay team lacked proper batons for baton-exchange practice prior to the tournament.

4. RECOMMENDATIONS
To sustain this sporting excellence in upcoming regional championships, I respectfully recommend that:
a) The school administration invest in ten pairs of standard running spikes for the athletics team;
b) A dedicated training allowance and nutritious glucose supplements be provided during pre-tournament training camps;
c) Outstanding medal winners be publicly recognized and awarded academic book prizes during the next morning assembly.

Respectfully submitted.`
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

async function seedBeceEnglish2009Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2009 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2009");
  await docRef.set({
    year: 2009,
    title: "BECE English Language 2009 (Calibrated National Benchmark)",
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
          title: passage1Title,
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        {
          id: "passage_2",
          title: passage2Title,
          text: passage2Text,
          questionRange: "Questions 6 to 10",
          questions: passage2Items
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: passage1Title,
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: passage2Title,
          text: passage2Text,
          questionRange: "Questions 6 to 10",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 11 to 40",
        questions: remainingItems
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2009 successfully seeded into Firestore!");
}

seedBeceEnglish2009Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2009:", err);
    process.exit(1);
  });

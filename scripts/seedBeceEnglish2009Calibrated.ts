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
        return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
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
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2009
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 10) ---
  {
    number: 1,
    prompt: "According to Passage I, what sudden event woke the household members from sleep at dawn?",
    options: [
      "The father crashing into the pillar",
      "The noise made by the father in the hall",
      "The attack by the armed robbers",
      "The frantic shouting of the tenants in the compound"
    ],
    correctAnswer: "The frantic shouting of the tenants in the compound",
    hint: "Reread the opening sentence: 'We were suddenly awakened at dawn by the screams of the tenants...'",
    workedSolution: "The passage explicitly states in the first sentence that the household was awakened at dawn by the screams and commotion made by the tenants in the yard.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, why was the writer's father holding his forehead when the lights were switched on?",
    options: [
      "He had fallen flat on his back",
      "He had crashed his head against the pillar",
      "He wanted to prevent the blood from flowing",
      "He was confused about what action to take"
    ],
    correctAnswer: "He had crashed his head against the pillar",
    hint: "In his haste in the dark, what obstacle did the father hit?",
    workedSolution: "The narrative explains that in his haste in the dark, the father ran straight into the pillar in the middle of the hall, cutting his forehead.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, what was the primary clinical purpose of applying ice cubes to the father's injury?",
    options: [
      "To disinfect the cut",
      "To heal the skin rapidly",
      "To clean the wound gently",
      "To reduce the swelling and stop bleeding"
    ],
    correctAnswer: "To reduce the swelling and stop bleeding",
    hint: "Ice causes vasoconstriction, which soothes lumps and arrests bleeding.",
    workedSolution: "The passage describes the mother pressing ice cubes on the cut to curb bleeding and massaging the big lump to reduce the swelling.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the word 'pathetic' as used in 'we beheld a pathetic scene' means ............",
    options: ["naughty", "merciless", "sad and distressing", "strange"],
    correctAnswer: "sad and distressing",
    hint: "Evoking deep pity, grief, and emotional sorrow.",
    workedSolution: "'Pathetic' in this context means arousing pity, grief, sorrow, and compassion; 'sad and distressing' is the exact meaning.",
    points: 1
  },
  {
    number: 5,
    prompt: "According to Passage I, what tragic fate befell the tenant?",
    options: [
      "He fell down heavily in the dark hall",
      "He was killed by the armed robbers",
      "He ran out of the compound in fear",
      "He locked the main entrance gate"
    ],
    correctAnswer: "He was killed by the armed robbers",
    hint: "What did the robbers do when the tenant resisted their attack?",
    workedSolution: "The passage concludes by revealing that the tenant had been butchered mercilessly and murdered while attempting to resist the armed intruders.",
    points: 1
  },
  {
    number: 6,
    prompt: "According to Passage II, why do male songbirds sing with exceptional vigor during the breeding season?",
    options: [
      "To instruct younger birds",
      "To practice notes for concert halls",
      "To attract and impress female birds",
      "To copy the melodies of other flocks"
    ],
    correctAnswer: "To attract and impress female birds",
    hint: "Look at the second paragraph: 'produced during the breeding season by the males to impress...'",
    workedSolution: "The text explains that the vigorous songs during breeding season are produced specifically by male birds to impress and attract female partners.",
    points: 1
  },
  {
    number: 7,
    prompt: "According to Passage II, what enables birds to distinguish multiple notes in a song that sound like a single beat to human ears?",
    options: [
      "Their sharp eyesight",
      "Their keen sense of hearing",
      "Their rapid wing beats",
      "Their vocal imitation skills"
    ],
    correctAnswer: "Their keen sense of hearing",
    hint: "Reread paragraph three regarding the sensory capabilities of songbirds.",
    workedSolution: "The author explicitly states that 'birds can identify the different notes because of their keen sense of hearing'.",
    points: 1
  },
  {
    number: 8,
    prompt: "According to Passage II, what non-musical message can a bird's vocalization communicate to its flock?",
    options: [
      "An announcement of pleasant weather",
      "A complaint about scarce food",
      "A warning of approaching danger",
      "An invitation to human listeners"
    ],
    correctAnswer: "A warning of approaching danger",
    hint: "Paragraph three notes: 'It may also be a warning of...'",
    workedSolution: "The passage notes that certain bird calls serve as practical signals to keep the flock united or to warn of impending danger.",
    points: 1
  },
  {
    number: 9,
    prompt: "In Passage II, the word 'unique' in 'compose songs which are unique' means ............",
    options: ["suitable", "similar", "exciting", "distinctive and one of a kind"],
    correctAnswer: "distinctive and one of a kind",
    hint: "Unlike anything else; not copied from others.",
    workedSolution: "'Unique' means being the only one of its kind or having no equal; 'distinctive and one of a kind' is its direct meaning.",
    points: 1
  },
  {
    number: 10,
    prompt: "What major conclusion does the writer suggest regarding the acoustic ability of songbirds in Passage II?",
    options: [
      "Human beings possess better musical hearing than birds",
      "Birds have a superior ability to distinguish intricate musical notes",
      "Birds make louder sounds than other animals",
      "All birds sing the identical song from birth"
    ],
    correctAnswer: "Birds have a superior ability to distinguish intricate musical notes",
    hint: "Humans hear one combined beat, while birds differentiate several individual notes.",
    workedSolution: "The passage demonstrates that because of their keen hearing, birds can separate three or four rapid notes that human ears perceive only as a single beat.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "The dilapidated colonial bungalow by the seashore has been abandoned.\nChoose the word nearest in meaning to the underlined word 'abandoned'.",
    options: ["deserted", "destroyed", "infested", "robbed"],
    correctAnswer: "deserted",
    hint: "Left behind permanently without occupants or care.",
    workedSolution: "'Abandoned' means left empty, neglected, or permanently vacated; 'deserted' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "Most football supporters were optimistic that the national team would win the tournament.\nChoose the word nearest in meaning to the underlined word 'optimistic'.",
    options: ["reasonable", "happy", "concerned", "hopeful"],
    correctAnswer: "hopeful",
    hint: "Confident and expecting a favorable, successful outcome.",
    workedSolution: "'Optimistic' means viewing the future with positive expectation and confidence; 'hopeful' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The indigenous residents of the community provided manual labor during the school project.\nChoose the word nearest in meaning to the underlined word 'indigenous'.",
    options: ["skilled", "native", "expatriate", "urban"],
    correctAnswer: "native",
    hint: "Originating naturally in a particular region; local inhabitants.",
    workedSolution: "'Indigenous' refers to people or species originating or occurring naturally in a particular land; 'native' is its direct equivalent.",
    points: 1
  },
  {
    number: 14,
    prompt: "The brave intervention of the neighborhood watch that foiled the robbery was laudable.\nChoose the word nearest in meaning to the underlined word 'laudable'.",
    options: ["quick", "real", "constant", "praiseworthy"],
    correctAnswer: "praiseworthy",
    hint: "Deserving high commendation, honor, or praise.",
    workedSolution: "'Laudable' means deserving praise and commendation; 'praiseworthy' is its exact synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "Our parents and guardians deserve our deepest appreciation for their sacrifices.\nChoose the word nearest in meaning to the underlined word 'appreciation'.",
    options: ["assistance", "gratitude", "concern", "encouragement"],
    correctAnswer: "gratitude",
    hint: "Thankfulness and heartfelt recognition of kindness.",
    workedSolution: "'Appreciation' in the context of recognizing benevolence means thankfulness; 'gratitude' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "The store manager took the careless clerk to task for misplacing the invoices. This means that the manager ............",
    options: [
      "dismissed the clerk immediately",
      "scolded and reprimanded the clerk",
      "reported the clerk to the police",
      "assigned another task to the clerk"
    ],
    correctAnswer: "scolded and reprimanded the clerk",
    hint: "To criticize severely, scold, or reprimand someone for a fault.",
    workedSolution: "The idiom 'to take someone to task' means to rebuke, reprimand, or severely criticize them for a mistake or misconduct.",
    points: 1
  },
  {
    number: 17,
    prompt: "The argument between the market traders got out of hand. This means that the argument ............",
    options: [
      "became uncontrollable and disorderly",
      "lasted for several days",
      "became uninteresting",
      "was settled peacefully"
    ],
    correctAnswer: "became uncontrollable and disorderly",
    hint: "Escaping restraint and becoming impossible to control.",
    workedSolution: "The idiom 'to get out of hand' means to become chaotic, unruly, or impossible to control.",
    points: 1
  },
  {
    number: 18,
    prompt: "On sighting the stern disciplinary master, the truant student took to his heels. This means that the student ............",
    options: ["collapsed in fear", "felt terrified", "ran away swiftly", "hid behind the door"],
    correctAnswer: "ran away swiftly",
    hint: "Fleeing rapidly to escape punishment.",
    workedSolution: "The idiom 'to take to one's heels' means to turn and run away hastily from danger or trouble.",
    points: 1
  },
  {
    number: 19,
    prompt: "Kwaku resides within a stone's throw of the regional hospital. This means that Kwaku ............",
    options: [
      "lives in a stone building",
      "lives very close to the hospital",
      "walks daily to the hospital",
      "frequently throws stones"
    ],
    correctAnswer: "lives very close to the hospital",
    hint: "A very short physical distance away.",
    workedSolution: "The idiom 'within a stone's throw' signifies a very short, easily walkable distance.",
    points: 1
  },
  {
    number: 20,
    prompt: "All his grandiose schemes for constructing a private library came to naught. This means that ............",
    options: [
      "the library was completed on time",
      "his plans failed completely and yielded nothing",
      "the building developed cracks",
      "the books were stolen"
    ],
    correctAnswer: "his plans failed completely and yielded nothing",
    hint: "'Naught' means zero; achieving nothing or ending in complete failure.",
    workedSolution: "The idiom 'to come to naught' means to end in total failure or produce no positive result.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While our former landlord maintained a cordial relationship with all tenants, the new owner was distinctly ...... .",
    options: ["harsh", "hostile", "scornful", "different"],
    correctAnswer: "hostile",
    hint: "'Cordial' means warm and friendly. Find the word that denotes antagonism and cold unfriendliness.",
    workedSolution: "'Cordial' means warm, polite, and friendly. Its direct antonym in interpersonal relationships is 'hostile' (unfriendly and antagonistic).",
    points: 1
  },
  {
    number: 22,
    prompt: "The introductory scene of the drama was rather dull, but the subsequent acts were remarkably ...... .",
    options: ["interesting", "informative", "sensible", "educative"],
    correctAnswer: "interesting",
    hint: "'Dull' means boring and unexciting. Find the word meaning engaging and captivating.",
    workedSolution: "'Dull' means boring and uninspiring. Its direct antonym is 'interesting' (captivating, engaging, and lively).",
    points: 1
  },
  {
    number: 23,
    prompt: "Although he appeared feeble from illness, the veteran blacksmith was still physically ...... .",
    options: ["bold", "strong", "bright", "successful"],
    correctAnswer: "strong",
    hint: "'Feeble' means weak and lacking physical power. Find the word denoting vigor and power.",
    workedSolution: "'Feeble' means physically weak and frail. Its direct antonym is 'strong' (robust and powerful).",
    points: 1
  },
  {
    number: 24,
    prompt: "Instead of descending the stairs hurriedly, the injured athlete stepped down ...... .",
    options: ["consciously", "lazily", "slowly", "noisily"],
    correctAnswer: "slowly",
    hint: "'Hurriedly' means with great rush and speed. Find the word meaning at a low speed.",
    workedSolution: "'Hurriedly' means quickly and in a rush. Its direct antonym is 'slowly'.",
    points: 1
  },
  {
    number: 25,
    prompt: "The diligent student was rewarded by the committee, while the ...... apprentice was cautioned.",
    options: ["careless", "lucky", "playful", "proud"],
    correctAnswer: "careless",
    hint: "'Diligent' means hardworking, conscientious, and careful. Find the word meaning negligent and untidy.",
    workedSolution: "'Diligent' means showing steady, conscientious effort. Its direct antonym in work habits is 'careless' (negligent or slapdash).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "The guardian visited the boarding house to ascertain how his ward was getting ...... with his studies.",
    options: ["on", "down", "back", "up"],
    correctAnswer: "on",
    hint: "Identify the phrasal verb meaning to make progress or fare in a situation.",
    workedSolution: "The phrasal verb 'to get on' (or 'get along') means to make progress or manage in a situation ('getting on at school').",
    points: 1
  },
  {
    number: 27,
    prompt: "If the wooden ferry had been serviced properly, it ...... capsized during the storm.",
    options: ["have not", "will not have", "would not have", "might have not"],
    correctAnswer: "would not have",
    hint: "Conditional Type 3: 'If + past perfect' requires 'would not have + past participle' in the negative main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition ('If the boat had been maintained'), the main clause takes 'would not have + past participle' ('would not have capsized').",
    points: 1
  },
  {
    number: 28,
    prompt: "The white stallion galloped ...... than the black mare.",
    options: ["faster", "very fast", "fast", "more fast"],
    correctAnswer: "faster",
    hint: "Short one-syllable adverbs/adjectives take the '-er' comparative inflection followed by 'than'.",
    workedSolution: "'Fast' is a monosyllabic word whose comparative degree is formed by adding '-er' ('faster than'). 'More fast' is ungrammatical.",
    points: 1
  },
  {
    number: 29,
    prompt: "The villagers thought Kwame would become an agricultural officer, ......?",
    options: ["wouldn't they", "didn't they", "wasn't they", "isn't they"],
    correctAnswer: "didn't they",
    hint: "The main verb in the independent clause is 'thought' (simple past). Form a past tag with 'did'.",
    workedSolution: "The primary subject and verb governing the sentence are 'They thought' (simple past affirmative). The question tag must be formed using 'did': 'didn't they?'.",
    points: 1
  },
  {
    number: 30,
    prompt: "There were only two students in the classroom who ...... any inkling of the correct answer.",
    options: ["have", "had", "has", "would"],
    correctAnswer: "had",
    hint: "Sequence of tenses: The past copula 'were' requires the past tense 'had' in the relative clause.",
    workedSolution: "Because the main clause is set in the simple past ('There were only two...'), the relative clause must maintain past tense agreement: 'who had any idea'.",
    points: 1
  },
  {
    number: 31,
    prompt: "The passenger had boarded the express train, ......?",
    options: ["wouldn't he", "hadn't he", "isn't it", "won't he"],
    correctAnswer: "hadn't he",
    hint: "An affirmative past perfect clause with 'had' takes a negative tag using 'had'.",
    workedSolution: "The statement contains the past perfect auxiliary 'had' ('had boarded'). The tag must be negative using the same auxiliary: 'hadn't he?'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Mrs. Mensah ...... in this coastal municipality since 1970.",
    options: ["was living", "has been living", "had lived", "is living"],
    correctAnswer: "has been living",
    hint: "An action starting in the past and continuing up to the present with 'since' requires the Present Perfect Continuous.",
    workedSolution: "The preposition 'since' specifying a starting point that extends into the present requires the Present Perfect Continuous tense ('has been living').",
    points: 1
  },
  {
    number: 33,
    prompt: "The ticket clerk made the passenger ...... an advance reservation fee.",
    options: ["to pay", "paid", "to be paying", "pay"],
    correctAnswer: "pay",
    hint: "The causative verb 'made' takes an object followed by a bare infinitive without 'to'.",
    workedSolution: "The causative verb 'make' (past: 'made') is followed by a direct object and a bare infinitive ('pay') without 'to'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Although all the six woven kente cloths were magnificent, the tourist liked ...... of them.",
    options: ["any", "none", "neither", "both"],
    correctAnswer: "none",
    hint: "When choosing zero out of three or more items, use this negative quantifier.",
    workedSolution: "'None' is used to negate three or more items ('all the dresses'). 'Neither' applies strictly when choosing between two.",
    points: 1
  },
  {
    number: 35,
    prompt: "Kwesi and Ama are deeply in love with ......",
    options: ["themselves", "one another", "each other", "ourselves"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('Kwesi and Ama'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 36,
    prompt: "Trekking through the dense forest reserve is ...... to undertake without an experienced guide.",
    options: [
      "too long and difficult a journey",
      "the journey too long and difficult",
      "long and difficult too a journey",
      "too long and difficult the journey"
    ],
    correctAnswer: "too long and difficult a journey",
    hint: "Structure: 'too + adjective + a/an + singular noun'.",
    workedSolution: "In formal English syntax, the modifier 'too' precedes the adjectives and takes the indefinite article before the noun: 'too + adjective + a + noun' ('too long and difficult a journey').",
    points: 1
  },
  {
    number: 37,
    prompt: "The torrential downpour shouldn't deter you ...... attending the community meeting.",
    options: ["for", "on", "by", "from"],
    correctAnswer: "from",
    hint: "Identify the preposition that regularly collocates with the verb 'deter'.",
    workedSolution: "The verb 'deter' takes the preposition 'from' followed by a gerund ('deter someone from doing something').",
    points: 1
  },
  {
    number: 38,
    prompt: "The regional director is leaving ...... Takoradi early this morning.",
    options: ["for", "to", "by", "from"],
    correctAnswer: "for",
    hint: "When 'leave' indicates the destination of departure, it takes this preposition.",
    workedSolution: "When stating the destination towards which one is traveling, 'leave' takes the preposition 'for' ('leaving for Takoradi').",
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
    prompt: "No sooner had the minister opened the exhibition hall ...... the venue was packed to capacity.",
    options: ["when", "for", "as", "than"],
    correctAnswer: "than",
    hint: "The negative correlative temporal adverb 'No sooner' is always paired with 'than'.",
    workedSolution: "The correlative pair is 'No sooner ... than' ('No sooner had... than...'). ('Hardly' and 'Scarcely' pair with 'when').",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200901);

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
  console.log("Seeding Calibrated & Balanced BECE English 2009 into Firestore...");

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
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English 2009 successfully seeded into Firestore!");
}

seedBeceEnglish2009Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2009:", err);
    process.exit(1);
  });

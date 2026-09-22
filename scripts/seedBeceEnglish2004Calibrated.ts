import * as dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2004
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 10) ---
  {
    number: 1,
    prompt: "In Passage I, the expression 'there was a great famine' means that ............",
    options: [
      "all the wild animals died instantly",
      "food was exceedingly scarce in the land",
      "there were no farmers left to cultivate",
      "food was completely prohibited in markets"
    ],
    correctAnswer: "food was exceedingly scarce in the land",
    hint: "A famine is an extreme, widespread scarcity of food.",
    workedSolution: "A famine is defined as a widespread, severe scarcity of food leading to starvation; 'food was exceedingly scarce in the land' is the accurate meaning.",
    points: 1
  },
  {
    number: 2,
    prompt: "According to Passage I, which of the following statements is true regarding Tortoise?",
    options: [
      "Tortoise fasted completely for three months",
      "The villagers freely gave food to Tortoise",
      "Tortoise harvested crops from his own farm",
      "Tortoise stole food from the cooking pots of the villagers"
    ],
    correctAnswer: "Tortoise stole food from the cooking pots of the villagers",
    hint: "Reread the final paragraph: he ran to the village while everyone was at the playground and filled his shell.",
    workedSolution: "The narrative explains that Tortoise capitalized on the villagers' absence to enter their homes and steal their cooking food to feed his family.",
    points: 1
  },
  {
    number: 3,
    prompt: "At what specific time of day did Tortoise arrive at the neighboring village in Passage I?",
    options: ["At early sunset", "In the dead of night", "At the break of dawn", "In the bright afternoon"],
    correctAnswer: "In the dead of night",
    hint: "Paragraph two states: 'He took the bush path and arrived at the village after sunset.'",
    workedSolution: "The text states that Tortoise arrived 'after sunset' when the evening meals were being cooked, which corresponds to the onset of night.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, why did the villagers drop their cooking and rush to the playground?",
    options: [
      "They wanted to catch who made the noise",
      "They believed the ceremonial drum had summoned them for an announcement",
      "They saw Tortoise fall from the tree",
      "The hollow drum had collapsed to the ground"
    ],
    correctAnswer: "They believed the ceremonial drum had summoned them for an announcement",
    hint: "The hollow log was the official community drum used to summon citizens for important royal announcements.",
    workedSolution: "The villagers recognized the 'kpom! kpom!' sound of the ceremonial drum and believed the chiefs had summoned them for an urgent announcement.",
    points: 1
  },
  {
    number: 5,
    prompt: "Why were the villagers unable to spot Tortoise at the playground in Passage I?",
    options: [
      "He swallowed his food rapidly",
      "He climbed inside the hollow drum",
      "He had already fled into the nearby bush",
      "He buried himself in the loose soil"
    ],
    correctAnswer: "He had already fled into the nearby bush",
    hint: "Reread the opening of the final paragraph: 'Very quickly Tortoise disappeared into nearby bush...'",
    workedSolution: "Immediately after accidentally hitting the drum, Tortoise quickly retreated into the safety of the nearby thick bush before the villagers arrived.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage II, why were Sergeant Abora's teeth chattering during the patrol?",
    options: [
      "He was suffering from acute toothache",
      "The night was freezing and intensely cold",
      "He wore a very light singlet",
      "He was terrified by the hooting owl"
    ],
    correctAnswer: "The night was freezing and intensely cold",
    hint: "Look at paragraph two: 'The night was very dark and so cold that in spite of his thick overcoat...'",
    workedSolution: "The narrative explains that despite wearing a thick overcoat, the biting cold of the late night caused the Sergeant's teeth to chatter.",
    points: 1
  },
  {
    number: 7,
    prompt: "According to Passage II, how did the police officers first detect the approach of the nocturnal traveler?",
    options: [
      "They heard a faint sound down the road",
      "They saw blood dripping on the path",
      "The traveler stammered in the dark",
      "They noticed a flashing torchlight"
    ],
    correctAnswer: "They heard a faint sound down the road",
    hint: "Paragraph two states: 'he heard a faint sound down the road that led to the town.'",
    workedSolution: "Both officers first detected the traveler through auditory perception: hearing a faint noise of approaching footsteps on the dusty road.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, why did Sergeant Abora and Constable Abaidoo conceal themselves behind two opposing trees?",
    options: [
      "To shelter from the freezing wind",
      "To avoid being seen while ambushing the suspect",
      "To load their firearms in safety",
      "To take a quick nap after hours of walking"
    ],
    correctAnswer: "To avoid being seen while ambushing the suspect",
    hint: "Taking cover allowed them to observe the traveler without alerting him.",
    workedSolution: "The officers took cover behind trees to remain hidden and surprise the late traveler as he passed between them.",
    points: 1
  },
  {
    number: 9,
    prompt: "Where was the criminal traveler finally apprehended by the police patrol team in Passage II?",
    options: [
      "Behind the trees on the road entering the town",
      "Inside the central charge office",
      "In the market center of the town",
      "Near the boundary of the neighboring village"
    ],
    correctAnswer: "Behind the trees on the road entering the town",
    hint: "Abaidoo sprang out and shouted 'Stop or I shoot!' as the man stumbled near the trees.",
    workedSolution: "The suspect was intercepted and arrested right where he stumbled on the tree root between the two trees on the road leading into town.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the expression 'gave him away' in 'his cutlass and bag... gave him away' means that the items ............",
    options: [
      "terrified him completely",
      "warned him of danger",
      "exposed his hidden guilt",
      "disgraced him before his family"
    ],
    correctAnswer: "exposed his hidden guilt",
    hint: "To betray or reveal someone's secret wrongdoing.",
    workedSolution: "'To give someone away' is an idiom meaning to betray, reveal, or expose their secret guilt or true identity.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "Mary's mother is confident that her daughter will secure distinction in the examination.\nChoose the word nearest in meaning to the underlined word 'confident'.",
    options: ["anxious", "proud", "certain", "determined"],
    correctAnswer: "certain",
    hint: "Having strong belief or full assurance of an outcome.",
    workedSolution: "'Confident' means having strong assurance or conviction; 'certain' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The defensive troops retreated when superior firepower attacked their outpost.\nChoose the word nearest in meaning to the underlined word 'retreated'.",
    options: ["escaped", "scattered", "fought", "withdrew"],
    correctAnswer: "withdrew",
    hint: "Moved back or retired from an offensive position.",
    workedSolution: "'Retreated' in military strategy means moved back or retired from battle; 'withdrew' is its exact equivalent.",
    points: 1
  },
  {
    number: 13,
    prompt: "Our senior housemaster advised all boarders to remain courteous at all times.\nChoose the word nearest in meaning to the underlined word 'courteous'.",
    options: ["punctual", "mannerly", "hard-working", "kind"],
    correctAnswer: "mannerly",
    hint: "Polite, respectful, and displaying refined social manners.",
    workedSolution: "'Courteous' means polite, respectful, and well-mannered; 'mannerly' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The recalcitrant latecomers were promptly cautioned by the senior master.\nChoose the word nearest in meaning to the underlined word 'promptly'.",
    options: ["immediately", "mercilessly", "roughly", "severely"],
    correctAnswer: "immediately",
    hint: "Without delay, hesitation, or lapse of time.",
    workedSolution: "'Promptly' means with speed, punctuality, and without delay; 'immediately' is its exact equivalent.",
    points: 1
  },
  {
    number: 15,
    prompt: "A disciplined athlete must learn to restrain his temper under intense provocation.\nChoose the word nearest in meaning to the underlined word 'restrain'.",
    options: ["avoid", "control", "apply", "delay"],
    correctAnswer: "control",
    hint: "To hold back, check, or curb strong emotional impulses.",
    workedSolution: "'Restrain' means to hold back, suppress, or keep under check; 'control' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "The two committee members are constantly quarreling; they never see eye to eye. This means they do not ............ each other.",
    options: ["agree with", "admire", "respect", "trust"],
    correctAnswer: "agree with",
    hint: "Sharing the same view, opinion, or agreement on an issue.",
    workedSolution: "The idiom 'to see eye to eye' means to have identical opinions, agree, or see things in the same light.",
    points: 1
  },
  {
    number: 17,
    prompt: "You must be off your head if you believe that stones can produce oil. This means that you must be ............",
    options: ["crazy", "joking", "unintelligent", "dreaming"],
    correctAnswer: "crazy",
    hint: "Acting absurdly, out of one's mind, or completely irrational.",
    workedSolution: "The idiom 'off one's head' is an informal expression meaning insane, irrational, or crazy.",
    points: 1
  },
  {
    number: 18,
    prompt: "Though she earns a modest wage, Auntie Mansa always has some money put by. This means she has money ............",
    options: [
      "to live on luxuriously",
      "reserved strictly for charity",
      "saved carefully for future needs",
      "to pay legal fees"
    ],
    correctAnswer: "saved carefully for future needs",
    hint: "Setting aside or banking money for future emergencies.",
    workedSolution: "The phrasal idiom 'to put by' means to save, reserve, or lay aside money for future requirements.",
    points: 1
  },
  {
    number: 19,
    prompt: "The driver survived the fatal road collision by the skin of his teeth. This means that the driver ............",
    options: [
      "escaped death very narrowly",
      "lost all his dental teeth",
      "escaped into the bush",
      "suffered minor facial scratches"
    ],
    correctAnswer: "escaped death very narrowly",
    hint: "Escaping a catastrophe by the narrowest possible margin.",
    workedSolution: "'By the skin of one's teeth' is a biblical idiom meaning by a very narrow margin or barely managing to escape disaster.",
    points: 1
  },
  {
    number: 20,
    prompt: "When the besieged rebels ran out of ammunition, they gave in. This means that they ............",
    options: ["fled in panic", "surrendered to the army", "fired aimlessly", "pleaded for help"],
    correctAnswer: "surrendered to the army",
    hint: "Ceasing resistance and submitting to an opponent.",
    workedSolution: "The phrasal verb 'to give in' means to cease opposition, yield, or surrender.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "The diligent prefect was commended for his integrity, whereas the truant was ...... .",
    options: ["admired", "promoted", "rejected", "rebuked"],
    correctAnswer: "rebuked",
    hint: "'Commended' means praised. Find the word that denotes scolded or criticized severely.",
    workedSolution: "'Commended' means officially praised. Its direct antonym is 'rebuked' (reprimanded or scolded).",
    points: 1
  },
  {
    number: 22,
    prompt: "The master's stern demeanor terrified the pupils, but his assistant had a ...... disposition.",
    options: ["proud", "indifferent", "friendly", "concerned"],
    correctAnswer: "friendly",
    hint: "'Stern' means severe, unsmiling, and harsh. Find the word meaning warm and approachable.",
    workedSolution: "'Stern' means severe, strict, and austere. Its direct antonym in interpersonal disposition is 'friendly' (warm and genial).",
    points: 1
  },
  {
    number: 23,
    prompt: "The assemblyman declined our invitation, but the municipal engineer ...... our request.",
    options: ["regretted", "denied", "rejected", "accepted"],
    correctAnswer: "accepted",
    hint: "'Declined' means turned down or refused. Find the word meaning received or agreed to.",
    workedSolution: "'Declined' means refused an offer. Its direct opposite in formal correspondence is 'accepted'.",
    points: 1
  },
  {
    number: 24,
    prompt: "Though the thirsty child begged for water, the cruel person callously refused him, while the good neighbor treated him ...... .",
    options: ["mercifully", "greedily", "playfully", "intentionally"],
    correctAnswer: "mercifully",
    hint: "'Callously' means cruelly without feeling. Find the word denoting kindness and compassion.",
    workedSolution: "'Callously' means showing insensitive and cruel disregard for others. Its direct antonym is 'mercifully' (compassionately).",
    points: 1
  },
  {
    number: 25,
    prompt: "The afternoon rain made the soil moist for planting, but the intense drought made the ground ...... .",
    options: ["fertile", "loose", "solid", "dry"],
    correctAnswer: "dry",
    hint: "'Moist' means slightly wet or damp. Find the word denoting complete lack of moisture.",
    workedSolution: "'Moist' means damp or humid. Its direct physical antonym is 'dry'.",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "The boarding students can proceed to the dining hall when they ...... the evening chores.",
    options: ["had finished", "finished", "finish", "will finish"],
    correctAnswer: "finish",
    hint: "In subordinate adverbial time clauses ('when...'), use the simple present tense to refer to future completion.",
    workedSolution: "In conditional and temporal clauses introduced by 'when', the simple present tense ('finish') is used to express a future condition, not 'will finish'.",
    points: 1
  },
  {
    number: 27,
    prompt: "Most people are not unkind to domestic animals, ......?",
    options: ["weren't it", "isn't it", "wasn't it", "are they"],
    correctAnswer: "are they",
    hint: "A negative statement with 'are not' and plural subject 'people' takes an affirmative tag: 'are they?'.",
    workedSolution: "The main clause has a negative auxiliary ('are not') and plural subject ('Most people' -> 'they'). The question tag must be affirmative: 'are they?'.",
    points: 1
  },
  {
    number: 28,
    prompt: "Afua washed her laundry and ...... the wet towels on the drying line.",
    options: ["hung", "folded", "hang", "stretched"],
    correctAnswer: "hung",
    hint: "'Hang' (to suspend an object) has the simple past form 'hung'. ('Hanged' is used only for execution).",
    workedSolution: "When 'hang' means to suspend an object like clothing, its past tense and past participle is 'hung'. 'Hanged' refers exclusively to capital punishment by execution.",
    points: 1
  },
  {
    number: 29,
    prompt: "Kwesi departed for school after he ...... his morning meal.",
    options: ["had eaten", "has eaten", "eating", "ate"],
    correctAnswer: "had eaten",
    hint: "Use the past perfect tense ('had + past participle') for an action completed before another past event.",
    workedSolution: "The past perfect tense ('had eaten') expresses an event that occurred before another specified past action ('Kwesi departed').",
    points: 1
  },
  {
    number: 30,
    prompt: "Kate is the ...... candidate in the graduating class.",
    options: ["well-behaved", "more-behaved", "very well-behaved", "most well-behaved"],
    correctAnswer: "most well-behaved",
    hint: "Form the superlative degree of compound hyphenated adjectives with 'most'.",
    workedSolution: "Compound adjectives like 'well-behaved' form their superlative degree by adding the superlative adverb 'most': 'the most well-behaved'.",
    points: 1
  },
  {
    number: 31,
    prompt: "A bag of money, with some documents ...... stolen from the car.",
    options: ["were", "are", "was", "have been"],
    correctAnswer: "was",
    hint: "Parenthetical additions like 'with...' do not alter the singular subject 'A bag of money'.",
    workedSolution: "Parenthetical additions introduced by 'with' do not affect the grammatical number of the subject. The singular head noun 'A bag' takes the singular past verb 'was'.",
    points: 1
  },
  {
    number: 32,
    prompt: "It is unlawful for citizens to resort ...... violent self-help during disputes.",
    options: ["through", "to", "into", "with"],
    correctAnswer: "to",
    hint: "Identify the preposition that regularly collocates with the verb 'resort'.",
    workedSolution: "In standard English grammar, the verb 'resort' is followed by the preposition 'to' ('resort to violence').",
    points: 1
  },
  {
    number: 33,
    prompt: "Clara understood all ...... the tutor demonstrated in the laboratory.",
    options: ["what", "which", "that", "this"],
    correctAnswer: "that",
    hint: "The indefinite pronoun 'all' is followed by the relative pronoun 'that', never 'what'.",
    workedSolution: "In standard English relative clauses, the quantifier 'all' is modified by 'that' ('all that the tutor demonstrated'). Using 'what' here is a grammatical error.",
    points: 1
  },
  {
    number: 34,
    prompt: "The agricultural officer confirmed that the irrigation project was ...... beneficial.",
    options: ["so", "much", "too", "very"],
    correctAnswer: "very",
    hint: "Use 'very' as a standard intensifier modifying a positive base adjective without negative consequence.",
    workedSolution: "'Very' modifies the base adjective 'beneficial' to express a high positive degree. 'Too' carries a negative connotation of excess; 'much' modifies comparatives.",
    points: 1
  },
  {
    number: 35,
    prompt: "Charles does not expect ...... his supervisor at the workshop today.",
    options: ["seeing", "having seen", "being seen", "to see"],
    correctAnswer: "to see",
    hint: "The verb 'expect' takes a to-infinitive complement, not a gerund.",
    workedSolution: "In standard English verb catenation, 'expect' takes a full to-infinitive complement ('expect to see').",
    points: 1
  },
  {
    number: 36,
    prompt: "The veteran craftsman thinks that manual labor becomes strenuous ...... you grow old.",
    options: ["if", "while", "when", "as"],
    correctAnswer: "when",
    hint: "Identify the conjunction denoting the specific time or stage of life.",
    workedSolution: "'When' is used as a temporal conjunction referring to a specific life stage or condition ('when you are old').",
    points: 1
  },
  {
    number: 37,
    prompt: "English is spoken by millions of commercial travelers ...... the globe.",
    options: ["across", "inside", "by", "on"],
    correctAnswer: "across",
    hint: "Preposition meaning throughout every part of an extensive geographic area.",
    workedSolution: "'Across' is the preposition denoting extension throughout all parts of a geographical region ('across the world/globe').",
    points: 1
  },
  {
    number: 38,
    prompt: "\"Do you admire this handwoven kente stole? I crafted ...... myself.\"",
    options: ["for", "that", "which", "it"],
    correctAnswer: "it",
    hint: "Use the direct object pronoun referring to the singular object 'kente stole'.",
    workedSolution: "The singular inanimate noun 'kente stole' functions as the direct object of 'crafted' and is replaced by the pronoun 'it' ('I crafted it myself').",
    points: 1
  },
  {
    number: 39,
    prompt: "Obuasi Gold Mine is the ............",
    options: [
      "nation's producer largest",
      "largest nation's producer",
      "producer nation's largest",
      "nation's largest producer"
    ],
    correctAnswer: "nation's largest producer",
    hint: "Correct word order: Possessive noun ('nation's') + Superlative adjective ('largest') + Head noun ('producer').",
    workedSolution: "In English noun phrase syntax, the possessive modifier ('nation's') precedes the superlative adjective ('largest'), which precedes the head noun ('producer').",
    points: 1
  },
  {
    number: 40,
    prompt: "Neither Kwesi nor Yaw ...... present when the headmaster arrived.",
    options: ["are", "is", "was", "were"],
    correctAnswer: "was",
    hint: "With 'neither... nor' joining two singular subjects in the past, the verb is singular past: 'was'.",
    workedSolution: "Proximity rule: When 'neither... nor' connects two singular subjects ('Kwesi', 'Yaw') in a past narrative, the verb agrees with the nearer singular subject in the simple past: 'was'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200401);

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
        category: "Formal Letter",
        prompt: "Write a letter to the headmaster of a Senior High School applying for admission into the school, stating at least two reasons why you have chosen that institution.",
        modelAnswer: `Methodist Junior High School
P. O. Box 88
Sunyani, Bono Region
12th July, 2004

The Headmaster
Prempeh College
P. O. Box 199
Kumasi

Dear Sir,

APPLICATION FOR ADMISSION INTO SENIOR SECONDARY SCHOOL (GENERAL SCIENCE PROGRAMME)

I respectfully write to submit my formal application for admission into Form One at Prempeh College to pursue the General Science programme for the upcoming academic year, following my completion of the Basic Education Certificate Examination (BECE).

First and foremost, I chose Prempeh College because of your institution's legendary record of academic excellence, particularly in STEM disciplines. Over the decades, your school has consistently dominated national science competitions, including the National Science and Maths Quiz, and produced world-class physicians, biomedical engineers, and research scientists. As an aspiring surgeon, studying under your dedicated science faculty and utilizing your well-equipped laboratories will provide me with the solid academic foundation necessary to achieve my career dreams.

Secondly, I admire your institution's emphasis on holistic moral discipline, leadership development, and co-curricular vibrancy. I am an active student leader, having served as the Senior Compound Prefect and president of our school debating club. Enrolling in Prempeh College will afford me the opportunity to participate in your renowned cadet corps and sports tournaments, honing my leadership skills and instilling in me the virtues of perseverance and patriotism.

My mock examination results indicate that I am poised to secure Aggregate Six in the BECE. My former headmaster has attached an official testimonial attesting to my exemplary conduct and academic diligence.

I trust that your esteemed office will favorably consider my application.

Thank you.

Yours faithfully,
[Signature]
Kwaku Mensah Boateng`
      },
      {
        questionNumber: "2",
        category: "Informal Letter",
        prompt: "Write a letter to your friend living in another town, describing a memorable traditional festival recently celebrated in your community and highlighting what made the occasion colorful and enjoyable.",
        modelAnswer: `Anglican Junior High School
P. O. Box 45
Cape Coast, Central Region
18th September, 2004

Dear Kweku,

I hope this letter finds you in high spirits and good health. I am writing to share with you the pomp, pageantry, and excitement of the annual Fetu Afahye festival, which was commemorated with breathtaking grandeur in Cape Coast last Saturday.

The festivities commenced early in the morning with the firing of antique musketry and the sounding of traditional horns. The highlight of the celebration was the grand procession of the seven Asafo warrior companies through the historical streets. Dressed in brilliant traditional military regalia and holding ornamental swords, they danced with incredible agility while acrobatics and drumming electrified the atmosphere.

Later in the afternoon, our paramount chief, Nana Kwesi Atta II, and his sub-chiefs were carried through the cheering crowds in lavish palanquins shaded by rotating ceremonial umbrellas. The paramount chief was adorned in magnificent kente cloth and heavy gold ornaments that sparkled under the afternoon sun. The air was filled with joyful singing, cultural drumming, and the firing of musketry as thousands of citizens and foreign tourists cheered enthusiastically. At the Victoria Park durbar ground, traditional libations were poured, and chiefs delivered speeches urging the youth to pursue education and protect communal peace.

I thoroughly enjoyed the delicious culinary treats, particularly the spicy fante kenkey with fried fish and hot pepper. My cousins and I spent the evening enjoying cultural musical performances by the seaside.

You must definitely visit us during next year's celebration. Give my warm greetings to your parents.

Your true friend,
[Signature]
Kwesi`
      },
      {
        questionNumber: "3",
        category: "Debate Speech",
        prompt: "You are the principal speaker in an inter-school debate on the motion: \"Students should be allowed to choose their own subjects in Junior Secondary School.\" Write your speech arguing either for or against the motion.",
        modelAnswer: `AGAINST THE MOTION: "STUDENTS SHOULD BE ALLOWED TO CHOOSE THEIR OWN SUBJECTS IN JUNIOR SECONDARY SCHOOL"

Mr. Chairman, Distinguished Panel of Judges, Impartial Timekeeper, Worthy Opponents, and Fellow Students:

I stand firmly before you this morning to oppose the motion that: "Students should be allowed to choose their own subjects in Junior Secondary School." Basic education was deliberately designed by educational experts to provide a broad, holistic foundation; permitting immature adolescents to prematurely specialize is an educational mistake.

First and foremost, basic school students are psychologically and emotionally too young to make definitive career choices. At twelve or thirteen years of age, a pupil lacks the cognitive maturity to determine what professional path suits his or her talents. Many students find mathematics or integrated science challenging; if given the freedom of choice, they would naturally abandon these rigorous subjects for simpler ones. This would permanently truncate their future opportunities, barring them from pursuing crucial fields like medicine, computer engineering, and accounting at higher levels.

Secondly, a broad common curriculum equips students with foundational literacy, numeracy, and technical competencies essential for everyday adult survival. Whether one becomes a carpenter, farmer, lawyer, or business entrepreneur, basic knowledge of English for communication, Mathematics for financial accounting, and Social Studies for civic responsibility is indispensable. Permitting early subject selection would create lopsided individuals who are deficient in critical life skills.

In conclusion, Junior Secondary School must remain a comprehensive training ground that opens doors rather than closes them. I urge you all to reject the motion resoundingly.

Thank you.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Write an interesting, realistic story illustrating how honesty and integrity ultimately triumphed over falsehood and greed, ending with the sentence: \"Honesty is indeed the best policy.\"",
        modelAnswer: `During the long vacation following our Form Two examinations, I assisted my maternal uncle, Mr. Addo, in managing his busy provisions and wholesale store at the Kejetia Market in Kumasi. One bustling Saturday afternoon, a wealthy cocoa merchant purchased fifty cartons of canned fish and milk, paying with a heavy leather pouch of banknotes.

In the confusion of loading the consignment onto the waiting haulage truck, the merchant accidentally left behind a thick brown envelope containing eight million cedis on the wooden counter. When I discovered the envelope under a stack of receipts, my heart raced. My co-apprentice, Kofi, urged me to hide the money, whispering that no one had seen it and that we could divide the fortune and buy motorbikes. Conscience wrestled with greed, but the godly counsel of my parents echoed in my mind: never touch what does not belong to you.

I handed the envelope intact to my uncle, who locked it in the office safe. Two hours later, the cocoa merchant returned to the market in a state of utter hysteria, weeping and clutching his chest. The money was his entire annual operating capital, without which his enterprise would collapse. When Uncle Addo brought out the envelope with its contents untouched, the merchant fell to his knees in tears of joy and disbelief.

Deeply moved by my integrity, the merchant awarded me two million cedis on the spot and pledged to sponsor my Senior Secondary School boarding fees. Kofi stood by, humiliated and ashamed. Smiling through tears of gratitude, I remembered the timeless proverb: Honesty is indeed the best policy.`
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

async function seedBeceEnglish2004Calibrated() {
  console.log("Seeding Calibrated & Balanced BECE English 2004 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2004");
  await docRef.set({
    year: 2004,
    title: "BECE English Language 2004 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2004 successfully seeded into Firestore!");
}

seedBeceEnglish2004Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2004:", err);
    process.exit(1);
  });

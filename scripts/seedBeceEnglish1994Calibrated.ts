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
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

// ==========================================
// PASSAGE I: CROW AND THE HIDDEN TREASURES
// ==========================================
const passage1Text = `A long time ago, the world was in total darkness. There was neither water nor fire. Men lived in this condition for a long time because King Eagle, who was the custodian of the sun, moon, stars, water and fire, had bullied them into accepting that situation.

Meanwhile, Eagle had a charming daughter who had fallen in love with Crow – a handsome, spotless white bird. As their friendship grew stronger, Crow got to know what Eagle was keeping away from men. On one of his visits, therefore, he secretly stole Eagle's hidden treasure that consisted of light, water and fire and flew away with it.

As soon as he got outside, he hung the sun in the sky. Instantly, the whole world was brilliantly lit up. When the sun set, he fixed the moon and spread the stars around it. Then the darkness of the night began to lift. He was so thrilled by his achievement that he glided and swerved in a beautiful display in the sky. While he was doing this, the water fell to the ground and formed rivers, lakes and streams.

He still held fast unto the fire in his beak. Suddenly some strong and violent winds blew smoke from the fire over Crow's beautiful feathers. The smoke made the feathers jet-black, leaving only a band of white feathers around his neck.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "In Passage I, why did mankind endure living in pitch darkness and deprivation without complaining?",
    options: [
      "They believed fire was exceedingly hot",
      "They were terrified of King Eagle's tyrannical power",
      "They were contented with what little they had",
      "They genuinely enjoyed the darkness of the world"
    ],
    correctAnswer: "They were terrified of King Eagle's tyrannical power",
    hint: "Reread paragraph one: 'because King Eagle... had bullied them into accepting that situation.'",
    workedSolution: "The passage notes that King Eagle bullied and intimidated men into accepting darkness, waterlessness, and cold without open revolt.",
    points: 1
  },
  {
    number: 2,
    prompt: "In what chronological sequence were the stolen celestial and earthly elements released to the world in Passage I?",
    options: [
      "Sun, moon and stars, water, fire",
      "Sun, fire, water, moon and stars",
      "Moon and stars, water, fire, sun",
      "Sun, water, moon and stars, fire"
    ],
    correctAnswer: "Sun, moon and stars, water, fire",
    hint: "Crow hung the sun first, then fixed the moon and stars, accidentally spilled the water while swerving, and held the fire last.",
    workedSolution: "Chronological narrative order: Crow released the sun first, the moon and stars at sunset, dropped the water while swerving, and held the fire in his beak.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following occurrences in Passage I was a deliberate, intentional act executed by Crow?",
    options: [
      "The accidental dropping of the water to the earth",
      "The sudden eruption of violent atmospheric winds",
      "The burning and blackening of his clean white feathers",
      "The hanging of the sun in the sky to illuminate the earth"
    ],
    correctAnswer: "The hanging of the sun in the sky to illuminate the earth",
    hint: "Hanging the sun was purposeful; the water dropped accidentally while displaying, and the wind blew smoke unexpectedly.",
    workedSolution: "Crow intentionally hung the sun to illuminate the world. The water dropped by accident while he was gliding, and the wind was an act of nature.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the word 'thrilled' in 'He was so thrilled by his achievement' means ............",
    options: [
      "terrified and fearful",
      "overjoyed and highly excited",
      "deeply surprised",
      "piously thankful"
    ],
    correctAnswer: "overjoyed and highly excited",
    hint: "Filled with intense excitement, joy, and triumph.",
    workedSolution: "'Thrilled' means filled with intense excitement, pleasure, and happiness; 'overjoyed and highly excited' is its direct meaning.",
    points: 1
  },
  {
    number: 5,
    prompt: "King Eagle's conduct in withholding the vital natural elements from mankind can best be evaluated as ............",
    options: [
      "exceptionally clever",
      "cruel, selfish, and tyrannical",
      "illustrious and famous",
      "benevolent and kindly"
    ],
    correctAnswer: "cruel, selfish, and tyrannical",
    hint: "Hoarding life-giving elements (water, fire, light) through bullying constitutes tyranny and cruelty.",
    workedSolution: "Hoarding water, light, and warmth while bullying human beings into misery depicts King Eagle as tyrannical, selfish, and cruel.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: MR. ANANG'S SUPPER
// ==========================================
const passage2Text = `As we were eagerly preparing for our special supper of roasted chicken, pepper sauce and fried yam, we heard another loud knock at the door. Papa opened the door to let in a fast-talking handsome stranger.

According to him, he was traveling to the next village but there were no vehicles available. Therefore, he was stranded. My parents, with their customary generosity, allowed him to stay the rest of the day with us. Soon after, supper was ready. We the younger children had to eat in the kitchen, whilst my parents and the others ate in the dining room.

From where we were eating, we could hear and see the adults. "Now, Mr. Anang," said my father, "you being the last to arrive will share the chicken." "Very well said," agreed Mr. Anang. He began by cutting the head of the chicken, which he gave to Papa saying, "You are the head of the family, so you get the head." To my mother, he said, "You are next to the head; therefore, get the neck." My elder brother, Yoofi, and sister, Aba, had the wings because they were of age and would need wings to fly away from the family nest. The other two guests got the feet in order that they could walk easily to their destinations. Finally, he declared in a loud voice, "I, a poor wandering man, who must treat my kwashiorkor once and for all, will take the rest!" There was a long, stunned silence after this around the dining table.`;

const passage2QuestionsRaw = [
  {
    number: 6,
    prompt: "According to Passage II, the writer's household was eagerly anticipating ............",
    options: [
      "a formal anniversary birthday banquet",
      "a special, extraordinary evening supper",
      "a national civic holiday celebration",
      "their ordinary everyday family meal"
    ],
    correctAnswer: "a special, extraordinary evening supper",
    hint: "Check paragraph one: 'preparing for our special supper of roasted chicken, pepper sauce and fried yam...'",
    workedSolution: "The narrative describes the meal as a 'special supper' featuring delicacy dishes (roasted chicken, fried yam, pepper sauce), making it extraordinary.",
    points: 1
  },
  {
    number: 7,
    prompt: "Why did the fast-talking stranger stop at the writer's family residence in Passage II?",
    options: [
      "He had lost his bearings along the forest path",
      "He had an official appointment with the head of the family",
      "He was completely stranded due to a total lack of vehicular transport",
      "He was sent by community elders"
    ],
    correctAnswer: "He was completely stranded due to a total lack of vehicular transport",
    hint: "Paragraph two states: 'he was passing to the next village but there were no vehicles. Therefore he was stranded.'",
    workedSolution: "The traveler knocked on the door because there was no commercial transport to take him to the next village, leaving him stranded.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the expression 'their customary generosity' indicates that the parents were habitually ............",
    options: ["haughty and proud", "stern and strict", "hospitable and benevolent", "suspicious of visitors"],
    correctAnswer: "hospitable and benevolent",
    hint: "'Customary' means habitual; 'generosity' means kindness and open-handed giving.",
    workedSolution: "The phrase indicates that the parents had a well-established household habit of being warm, welcoming, benevolent, and kind to strangers.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to the passage, how many people in total sat down to consume supper in the main dining room?",
    options: [
      "Four people",
      "Five people",
      "Six people",
      "Seven people"
    ],
    correctAnswer: "Seven people",
    hint: "Count them: Papa (1), Mama (1), Yoofi (1), Aba (1), two other guests (2), and Mr. Anang (1) = 7 adults in the dining room.",
    workedSolution: "The diners in the dining room comprised Papa, Mother, Yoofi, Aba, two additional guests, and Mr. Anang, totaling seven persons.",
    points: 1
  },
  {
    number: 10,
    prompt: "According to Passage II, in what exact anatomical order did Mr. Anang distribute the parts of the roasted chicken?",
    options: [
      "Head, feet, wings, carcass body, neck",
      "Head, wings, neck, carcass body, feet",
      "Head, neck, wings, feet, carcass body",
      "Head, neck, feet, wings, carcass body"
    ],
    correctAnswer: "Head, neck, wings, feet, carcass body",
    hint: "Papa got the head, Mother got the neck, elder siblings got wings, the two guests got feet, and he took the rest (body).",
    workedSolution: "The text outlines the exact order: head (father), neck (mother), wings (brother and sister), feet (the two guests), and the fleshy body (Mr. Anang).",
    points: 1
  },
  {
    number: 11,
    prompt: "Mr. Anang's crafty sharing of the roasted chicken can best be described as ............",
    options: [
      "selfish, greedy, and cunning",
      "loquacious but exceptionally generous",
      "strictly fair, honest, and impartial",
      "cheerful and humble"
    ],
    correctAnswer: "selfish, greedy, and cunning",
    hint: "He used humorous philosophical flattery to distribute bony parts to others while reserving the entire fleshy carcass for himself.",
    workedSolution: "Mr. Anang's distribution was selfish and cunning: he used flattering excuses to give away bony extremities while keeping all the meat for himself.",
    points: 1
  },
  {
    number: 12,
    prompt: "How did the family and guests gathered around the dining table react to Mr. Anang's sharing?",
    options: [
      "They engaged in a heated argument",
      "They wept aloud over their lost meat",
      "They were dumbfounded and struck into long silence by his audacity",
      "They congratulated him warmly on his wit"
    ],
    correctAnswer: "They were dumbfounded and struck into long silence by his audacity",
    hint: "Check the final sentence: 'There was a long silence after this around the dining table.'",
    workedSolution: "The guests and hosts were stunned into speechlessness and complete silence by the stranger's sheer greed and bold manipulation.",
    points: 1
  }
];

// ==========================================
// GENERAL LEXIS AND STRUCTURE (13 - 40)
// ==========================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (13 - 17) ---
  {
    number: 13,
    prompt: "It is always commendable to remain modest in your personal expectations and demands.\nChoose the word nearest in meaning to the underlined word 'modest'.",
    options: ["cheerful", "humble", "pleasant", "smart"],
    correctAnswer: "humble",
    hint: "Unassuming, moderate, or not boasting.",
    workedSolution: "'Modest' means unassuming, unpretentious, or moderate; 'humble' is its closest synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "There is no wisdom in executing rash decisions during a crisis.\nChoose the word nearest in meaning to the underlined word 'rash'.",
    options: ["speedy", "lazy", "busy", "hasty"],
    correctAnswer: "hasty",
    hint: "Done without careful thought or consideration; reckless and rushed.",
    workedSolution: "'Rash' describes an action taken impetuously without due thought or caution; 'hasty' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The children spent their leisure time staring at the acrobatic performer.\nChoose the word nearest in meaning to the underlined word 'staring'.",
    options: [
      "smiling warmly",
      "shouting aloud",
      "looking fixedly",
      "hooting loudly"
    ],
    correctAnswer: "looking fixedly",
    hint: "Gazing continuously and intently with wide-open eyes.",
    workedSolution: "'Staring' means looking fixedly and intently with open eyes; 'looking fixedly' is the exact equivalent.",
    points: 1
  },
  {
    number: 16,
    prompt: "The slippery rocky cliff was considered rather too risky to climb without climbing ropes.\nChoose the word nearest in meaning to the underlined word 'risky'.",
    options: ["rough", "steep", "difficult", "dangerous"],
    correctAnswer: "dangerous",
    hint: "Full of the possibility of harm, hazard, or injury.",
    workedSolution: "'Risky' means involving high probability of injury, loss, or hazard; 'dangerous' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The convicted offender had to plead for executive clemency before the magistrate.\nChoose the word nearest in meaning to the underlined word 'plead'.",
    options: ["beg", "speak", "apply", "stand"],
    correctAnswer: "beg",
    hint: "To make an earnest, humble, or urgent entreaty or appeal.",
    workedSolution: "'Plead' means to make an earnest, humble appeal or supplication; 'beg' is its closest synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (18 - 22) ---
  {
    number: 18,
    prompt: "The counselor urged the youth to stop building castles in the air. This means that the youth should ............",
    options: [
      "stop designing tall buildings",
      "be realistic and practical in their aspirations",
      "refrain from masonry labor",
      "be wealthy and industrious"
    ],
    correctAnswer: "be realistic and practical in their aspirations",
    hint: "Daydreaming about impractical, impossible schemes instead of facing real facts.",
    workedSolution: "The idiom 'to build castles in the air' means to indulge in daydreaming and unrealistic fantasies that have no practical foundation in reality.",
    points: 1
  },
  {
    number: 19,
    prompt: "Although I disagree with his political views, I must give the devil his due. This means that I will ............",
    options: [
      "agree with his philosophy entirely",
      "confess my faults to him",
      "acknowledge his true merits and strengths fairly",
      "treat him with cold hostility"
    ],
    correctAnswer: "acknowledge his true merits and strengths fairly",
    hint: "Giving credit or fair acknowledgment to an opponent or disreputable person where it is truly deserved.",
    workedSolution: "The idiom 'to give the devil his due' means to be fair and acknowledge the good qualities or merits of someone one dislikes or opposes.",
    points: 1
  },
  {
    number: 20,
    prompt: "Kwasi is head over heels in love with Ama. This means that Kwasi ............",
    options: [
      "looks down at his shoes when speaking to Ama",
      "behaves unnaturally around women",
      "cannot balance his footsteps",
      "is deeply and overwhelmingly in love with Ama"
    ],
    correctAnswer: "is deeply and overwhelmingly in love with Ama",
    hint: "Completely, passionately, and deeply infatuated with someone.",
    workedSolution: "'Head over heels in love' is an idiom meaning completely, deeply, and passionately infatuated with someone.",
    points: 1
  },
  {
    number: 21,
    prompt: "The presiding chief instructed his spokesman not to beat about the bush. This means the spokesman must ............",
    options: [
      "avoid stammering in speech",
      "go straight to the core point without evasion",
      "not walk into the forest",
      "conclude the arbitration hastily"
    ],
    correctAnswer: "go straight to the core point without evasion",
    hint: "Discussing an issue directly without wasting time on evasive, irrelevant preliminaries.",
    workedSolution: "'To beat about the bush' means to discuss a matter evasively without addressing the main point. Not doing so means going straight to the point.",
    points: 1
  },
  {
    number: 22,
    prompt: "When Mother returned from town, Kwame let the cat out of the bag regarding the broken vase. This means that Kwame ............",
    options: [
      "asked Mother to step outside",
      "released an animal from the luggage",
      "revealed the hidden truth about what had occurred",
      "removed the damaged shards from the basket"
    ],
    correctAnswer: "revealed the hidden truth about what had occurred",
    hint: "Disclosing a secret or revealing hidden information.",
    workedSolution: "The idiom 'to let the cat out of the bag' means to reveal a secret or disclose hidden information, often by careless mistake or confession.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (23 - 27) ---
  {
    number: 23,
    prompt: "The classroom was too dim for comfortable reading, but the library was exceptionally ...... .",
    options: ["lit", "shining", "bright", "light"],
    correctAnswer: "bright",
    hint: "'Dim' means lacking light. Find the word that denotes radiant, full illumination.",
    workedSolution: "'Dim' means poorly illuminated. Its direct luminous antonym is 'bright' (well-illuminated).",
    points: 1
  },
  {
    number: 24,
    prompt: "While the infant was energetic throughout the morning, he became remarkably ...... by afternoon.",
    options: ["dull", "simple", "bulky", "tall"],
    correctAnswer: "dull",
    hint: "'Energetic' means full of lively activity and vigor. Find the word meaning sluggish, inactive, or listless.",
    workedSolution: "'Energetic' means active and vigorous. Its direct behavioral antonym is 'dull' (sluggish or listless).",
    points: 1
  },
  {
    number: 25,
    prompt: "This decorative floral bouquet is made from artificial fibers, unlike the garden rose which is ...... .",
    options: ["natural", "preserved", "wonderful", "new"],
    correctAnswer: "natural",
    hint: "'Artificial' means synthetic or man-made. Find the word meaning occurring in nature.",
    workedSolution: "'Artificial' denotes synthetic or man-made items. Its direct antonym is 'natural'.",
    points: 1
  },
  {
    number: 26,
    prompt: "Following the trial, two suspects were convicted while the remaining defendants were ...... .",
    options: ["executed", "identified", "addressed", "freed"],
    correctAnswer: "freed",
    hint: "'Convicted' means found guilty and sentenced. Find the word denoting released from custody or acquitted.",
    workedSolution: "'Convicted' means officially declared guilty by a court of law. Its direct judicial antonym is 'freed' (acquitted or released).",
    points: 1
  },
  {
    number: 27,
    prompt: "Security forces patrol the national border because the authorities seek to eliminate smuggling, rather than ...... it.",
    options: ["notice", "encourage", "manage with", "investigate"],
    correctAnswer: "encourage",
    hint: "'Eliminate' means to put an end to or eradicate. Find the word meaning to foster or promote.",
    workedSolution: "'Eliminate' means to eradicate or completely remove. Its direct antonym is 'encourage' (to stimulate, promote, or foster).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (28 - 40) ---
  {
    number: 28,
    prompt: "Your academic success in the upcoming national examination all depends ...... your being hardworking.",
    options: ["by", "with", "in", "upon"],
    correctAnswer: "upon",
    hint: "Identify the preposition that regularly collocates with the verb 'depends' (on / upon).",
    workedSolution: "In standard English grammar, the verb 'depend' is followed by the preposition 'upon' (or 'on').",
    points: 1
  },
  {
    number: 29,
    prompt: "As patriotic citizens, we should always remain proud ...... our national heritage.",
    options: ["in", "of", "for", "by"],
    correctAnswer: "of",
    hint: "Identify the preposition that regularly collocates with the adjective 'proud'.",
    workedSolution: "In standard English, the adjective 'proud' takes the preposition 'of' ('proud of our motherland').",
    points: 1
  },
  {
    number: 30,
    prompt: "...... hearing the announcement of his scholarship, the student leaped high for joy.",
    options: ["Over", "On", "With", "In"],
    correctAnswer: "On",
    hint: "Structure: 'On + gerund' expresses an action taking place immediately at the moment of an event.",
    workedSolution: "The preposition 'On' followed by a gerund ('On hearing') signifies immediately after or at the exact moment of hearing something.",
    points: 1
  },
  {
    number: 31,
    prompt: "An armed burglar was apprehended ...... the residential compound yesterday.",
    options: ["through", "up", "outside", "over"],
    correctAnswer: "outside",
    hint: "Identify the spatial preposition meaning situated on the exterior of a perimeter.",
    workedSolution: "'Outside' is the appropriate spatial preposition indicating position on the exterior of the house or building.",
    points: 1
  },
  {
    number: 32,
    prompt: "The senior master raised an objection ...... your joining the school football squad.",
    options: ["to", "by", "at", "on"],
    correctAnswer: "to",
    hint: "Both the verb 'object' and the noun 'objection' take this specific preposition.",
    workedSolution: "In standard English grammar, the verb 'object' and noun 'objection' are followed by the preposition 'to' ('object to your joining').",
    points: 1
  },
  {
    number: 33,
    prompt: "The security officer searched the hall thoroughly but did not find ...... in the building.",
    options: ["somebody", "no one", "anybody", "someone"],
    correctAnswer: "anybody",
    hint: "Use an open non-assertive pronoun in negative clauses containing 'did not' to avoid a double negative.",
    workedSolution: "Clauses already containing a negative particle ('did not find') require the non-assertive pronoun 'anybody' to avoid an ungrammatical double negative.",
    points: 1
  },
  {
    number: 34,
    prompt: "This is the library reference encyclopedia ...... I retrieved from the reading desk.",
    options: ["whom", "whose", "what", "which"],
    correctAnswer: "which",
    hint: "Use the relative pronoun reserved for inanimate objects and non-human entities.",
    workedSolution: "'Which' (or 'that') is the relative pronoun used to refer to inanimate things like 'the book'. 'Whom' applies only to human beings.",
    points: 1
  },
  {
    number: 35,
    prompt: "The farmer ...... cocoa barn was destroyed by the bushfire is receiving medical attention.",
    options: ["who's", "whom", "whose", "which"],
    correctAnswer: "whose",
    hint: "Use the possessive relative pronoun modifying the noun 'cocoa barn'.",
    workedSolution: "'Whose' is the relative possessive pronoun used to denote ownership belonging to a person ('whose house/barn was burnt').",
    points: 1
  },
  {
    number: 36,
    prompt: "...... boys assembled in the courtyard are exceptionally delighted with their new sports kits.",
    options: ["They", "These", "That", "This"],
    correctAnswer: "These",
    hint: "Plural demonstrative determiner modifying the plural noun 'boys' nearby.",
    workedSolution: "The plural noun 'boys' requires the plural demonstrative determiner 'These' (or 'Those'). 'This' and 'That' are singular.",
    points: 1
  },
  {
    number: 37,
    prompt: "\"Will you have a bottle of cold fruit juice?\"\n\"No, ............, I have already eaten.\"",
    options: ["I don't", "please", "thank you", "I won't"],
    correctAnswer: "thank you",
    hint: "Polite refusal convention in English: pairing 'No' with an expression of gratitude.",
    workedSolution: "In polite English social etiquette, when declining an offer of food or drink, the standard polite response is 'No, thank you'.",
    points: 1
  },
  {
    number: 38,
    prompt: "Let us assemble our tools and tidy the workshop, ......?",
    options: ["shall we", "do we", "will we", "would we"],
    correctAnswer: "shall we",
    hint: "Suggestions beginning with 'Let's' or 'Let us' take a mandatory first-person plural question tag.",
    workedSolution: "Imperative sentences expressing collective suggestions beginning with 'Let us / Let's' take 'shall we?' as their mandatory question tag.",
    points: 1
  },
  {
    number: 39,
    prompt: "Kofi will not meet his father at the office if he ...... not there by five o'clock.",
    options: ["was", "were", "isn't", "is"],
    correctAnswer: "is",
    hint: "First conditional: 'if + subject + is + not'. Do not use a double contraction when 'not' is already printed.",
    workedSolution: "Because the negative particle 'not' is already explicitly printed in the sentence stem ('if he ...... not here'), the affirmative copula 'is' must be inserted to form 'if he is not here'.",
    points: 1
  },
  {
    number: 40,
    prompt: "\"The crying baby needs an immediate warm bath, doesn't it?\"\n\"............, its skin is soiled.\"",
    options: [
      "No, it needs",
      "No, it does",
      "Yes, it doesn't",
      "Yes, it does"
    ],
    correctAnswer: "Yes, it does",
    hint: "Standard English polarity: To confirm an affirmative statement, pair 'Yes' with the matching positive auxiliary.",
    workedSolution: "An affirmative agreement confirming that the baby indeed needs a bath uses 'Yes' paired with the present singular auxiliary: 'Yes, it does'.",
    points: 1
  }
];

// Combine all 40 raw questions
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

const assignedTargetIndices = seedShuffle(targetKeys, 199401);

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

// Partition Questions for Passage-First UI Rendering
const passage1Questions = balancedPaper1.slice(0, 5);
const passage2Questions = balancedPaper1.slice(5, 12);
const remainingQuestions = balancedPaper1.slice(12);

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
        prompt: "Your cousin has warmly invited you to spend your upcoming school vacation with his family in another town. Write a letter accepting the invitation, expressing your gratitude, and outlining at least two specific activities you wish to undertake during the visit.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 48
Konongo, Ashanti Region
12th June, 1994

Dear Cousin Kofi,

I was overjoyed to receive your warm letter last week inviting me to spend the forthcoming August vacation with your family in Cape Coast. I write with great enthusiasm to formally accept your kind invitation and to thank Uncle Kwame and Auntie Mansa for opening their home to me once again.

Our previous holiday together was memorable, but this time I have two specific activities that I am eager to experience. First and foremost, I wish to visit the historic Cape Coast and Elmina Castles. In our JSS Three Social Studies syllabus, we are currently studying the trans-Atlantic slave trade and European colonial forts along the Gold Coast. Touring the dark dungeons, viewing the antique cannons, and walking through the infamous 'Door of No Return' will transform my classroom textbook notes into vivid, unforgettable historical realities.

Secondly, I look forward to exploring the coastal fishing harbor and learning the art of sea canoeing from the local fishermen. Living in an inland forest district, I rarely see ocean trawlers or colorful canoes hauling fresh nets of fish ashore. Spending mornings along the sandy beaches and watching traditional Fante fishermen sing rhythmic sea songs will be both thrilling and educational.

Please inform Auntie that I will arrive by the morning commercial bus on the first Saturday of August. I cannot wait to taste her delicious fante kenkey and fresh grilled mackerel.

Extend my warmest greetings to everyone at home.

Your loving cousin,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Your class intends to embark on an educational excursion to a prominent industrial or scientific landmark in your region. As the Class Prefect, write a formal letter to the director in charge of the facility, requesting permission for the visit and stating three clear educational reasons for your choice.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 112
Begoro, Eastern Region
15th October, 1994

The Director of Operations
Akosombo Hydroelectric Generating Station
Volta River Authority
Akosombo

Dear Sir,

REQUEST FOR PERMISSION TO UNDERTAKE AN EDUCATIONAL VISIT

On behalf of the final-year students of Presbyterian Junior Secondary School, Begoro, I respectfully write to request official permission for our class of forty-five students and three science masters to undertake an educational excursion to your hydroelectric power generation facility on Friday, 18th November 1994.

We have chosen your world-renowned installation for three compelling educational reasons. First, our curriculum in Integrated Science covers energy transformations, specifically the conversion of mechanical and kinetic energy of falling water into electrical energy. A guided tour of your underground turbine chambers and generator hall will provide our candidates with a practical, first-hand understanding of electrical power generation prior to the BECE.

Secondly, our Social Studies coursework emphasizes national infrastructure, industrial development, and environmental conservation. Visiting the majestic Akosombo Dam and the Volta Lake basin will enable us to appreciate the visionary engineering leadership of our founding fathers and understand how artificial lakes affect regional climate, freshwater fisheries, and water transportation.

Finally, observing your dedicated mechanical and electrical engineers at work will inspire many of our students who aspire to pursue careers in science, engineering, and technology.

We assure your administration of our strictest discipline and adherence to all facility safety regulations during the tour. We pray that our request will meet your kind approval.

Thank you.

Yours faithfully,
[Signature]
Emmanuel Addo
(Class Prefect)`
      },
      {
        questionNumber: "3",
        category: "Descriptive / Eye-Witness Disciplinary Report",
        prompt: "You were present when a senior student bullied and assaulted a junior pupil on the school compound. Write an accurate, objective descriptive report on the incident to the teacher on duty.",
        modelAnswer: `REPORT ON AN INCIDENT OF BULLYING AND PHYSICAL ASSAULT INVOLVING MASTER KOFI DARKU AND PUPIL SAMUEL TEYE

To: The Teacher on Duty, Mr. E. K. Mensah
From: Victoria Arthur (JSS Form Two Prefect)
Date: 24th February, 1994

1. INTRODUCTION
I submit this eye-witness report to document an unprovoked incident of senior bullying, harassment, and physical assault that occurred behind the school technical workshop today, Thursday, 24th February 1994, at approximately 10:15 a.m. during mid-morning recess.

2. ACCOUNT OF THE INCIDENT
While inspecting classroom cleanliness near the junior block, I observed Master Kofi Darku, a final-year Form Three student, confront Pupil Samuel Teye, a newly admitted Form One student. Kofi Darku demanded that the junior pupil surrender his daily lunch allowance of five hundred cedis and immediately wash Darku's soiled sports kit in the public tap area.

When Pupil Teye respectfully explained that he had already expended his allowance on food and had to attend a scheduled remedial mathematics lesson, Kofi Darku became furious. He seized the junior boy by the collar of his uniform, shoved him violently against the wooden wall of the workshop, and struck him two heavy blows across the face. As Samuel fell to the ground weeping, Darku kicked his school bag into a muddy puddle, scattering his exercise books.

3. INTERVENTION AND IMMEDIATE ACTION
Hearing the victim's cries, I ran to the scene accompanied by two school monitors. We restrained Kofi Darku from inflicting further physical harm and assisted Samuel Teye to his feet. Samuel sustained a swollen left eye, bleeding lips, and torn uniform buttons. We escorted the weeping junior to the school dispensary for first-aid treatment.

4. CONCLUSION AND RECOMMENDATIONS
The unprovoked assault was an act of gross intimidation and indiscipline that violates school regulations against bullying. I recommend that Kofi Darku be referred to the Disciplinary Committee for appropriate sanctions to serve as a deterrent.

Respectfully submitted.`
      },
      {
        questionNumber: "4",
        category: "Descriptive / Tribute Essay",
        prompt: "Describe your favorite teacher in school, highlighting his or her personal qualities, pedagogical methods, and the positive impact he or she has had on your education and moral character.",
        modelAnswer: `MY INSPIRING MENTOR: MR. EMMANUEL OSEI

In the course of my basic school education, I have encountered many dedicated instructors, but none has left so indelible an imprint on my heart and mind as our Integrated Science master, Mr. Emmanuel Osei. Tall, neatly attired in his crisp khaki trousers and white short-sleeved shirts, Mr. Osei radiates an aura of quiet dignity, intellectual brilliance, and warmth that instantly commands respect.

What sets Mr. Osei apart is his innovative and engaging teaching pedagogy. Before he joined our school, science was widely feared as an abstract and difficult subject involving rote memorization. Mr. Osei revolutionized our learning by transforming our everyday environment into a living laboratory. In a school lacking an elaborate modern science facility, he uses his personal resources to improvise practical teaching aids. He constructs clay models of the human digestive system, collects local soil and plant specimens, and organizes field demonstrations that make complex concepts tangible and exciting. Under his guidance, science became our favorite subject.

Beyond his pedagogical genius, Mr. Osei is an exceptional moral mentor. He possesses boundless patience, never shouting at or humiliating struggling students. Instead, he sacrifices his free afternoons to organize free remedial tutorials for weak candidates and counsels pupils facing domestic hardships. His absolute punctuality, honesty, and impartial fairness inspire us to cultivate personal integrity and self-discipline.

Through his encouragement, my academic grades improved from average scores to distinction, and I developed a passionate dream to study medicine. Mr. Osei is not merely an educator; he is a beacon of hope and an embodiment of true teaching excellence.`
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.sectionA_essay.questions.map((q) => ({
    id: `q${q.questionNumber}`,
    questionNumber: q.questionNumber,
    section: "A",
    category: q.category,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  }))
];

async function seedBeceEnglish1994Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1994 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1994");
  await docRef.set({
    year: 1994,
    title: "BECE English Language 1994 (Calibrated National Benchmark)",
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
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      // Section A: Passage-First Comprehension Architecture
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Crow and the Hidden Treasures",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: Mr. Anang's Supper",
          text: passage2Text,
          questionRange: "Questions 6 to 12",
          questions: passage2Questions
        }
      },
      // Sections B - E: Lexis, Synonyms, Idioms, Antonyms, and Structure
      sectionB_to_E: {
        title: "Sections B - E: Lexis, Idioms, Antonyms and Structure",
        questionRange: "Questions 13 to 40",
        questions: remainingQuestions
      },
      // Complete Flat Sequence for standard computerized test runners
      allQuestions: balancedPaper1,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated & Passage-First BECE English 1994 successfully seeded into Firestore!");
}

seedBeceEnglish1994Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1994:", err);
    process.exit(1);
  });

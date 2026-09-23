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
// ISOMORPHIC PASSAGE I: THE LIBERATION OF THE ELEMENTS (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `In the primordial era of the world, mankind dwelt in perpetual gloom. There was neither running water to quench their thirst nor warm fire to cook their food. Human beings endured this harsh existence for generations because King Hawk, the supreme custodian of the sun, moon, stars, rain, and fire, had intimidated them into submissive resignation.

King Hawk had a graceful daughter who fell deeply in love with Raven—a striking bird of pure, spotless white plumage. As their courtship deepened, Raven discovered the celestial vault where King Hawk kept the vital treasures hidden from mortals. Seizing an opportune moment during one of his evening visits, Raven snatched the sacred casket containing light, water, and fire, and soared into the sky.

Breaking through the upper clouds, he hung the blazing sun high in the heavens. Immediately, the entire earth was bathed in brilliant golden light. As dusk fell, he anchored the silver moon and scattered the shimmering stars across the night sky, rolling back the oppressive darkness. Raven was so elated by his triumph that he began performing acrobatic loops and joyous glides in the sky. During these maneuvers, the water jar slipped from his grasp, spilling torrents to the earth that carved out rivers, lakes, and freshwater streams.

Raven held fast to the embers of fire with his strong beak. Suddenly, a violent tempest arose, blowing plumes of acrid smoke over his radiant white feathers. The dense soot stained his plumage jet-black forever, leaving only a narrow ring of pure white feathers around his throat.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, why did mankind endure their harsh, dark existence without voicing complaints?",
    options: [
      "They believed that fire was too dangerous to handle",
      "They were deeply intimidated by King Hawk's tyrannical authority",
      "They were completely satisfied with living in total darkness",
      "They enjoyed the cold and waterless state of the world"
    ],
    correctAnswer: "They were deeply intimidated by King Hawk's tyrannical authority",
    hint: "Reread paragraph one: King Hawk had intimidated them into submissive resignation.",
    workedSolution: "The narrative explains that men accepted their deprived condition because King Hawk bullied and intimidated them into submission.",
    points: 1
  },
  {
    number: 2,
    prompt: "In what chronological order did Raven distribute the captured elements to the world in Passage I?",
    options: [
      "Sun, moon and stars, water, fire",
      "Sun, fire, water, moon and stars",
      "Moon and stars, water, fire, sun",
      "Sun, water, moon and stars, fire"
    ],
    correctAnswer: "Sun, moon and stars, water, fire",
    hint: "Raven hung the sun first, then the moon and stars, dropped the water while looping, and retained the fire.",
    workedSolution: "Chronological narrative sequence: Raven hung the sun first, the moon and stars at dusk, spilled the water during aerial acrobatics, and held the fire in his beak.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following events in Passage I was a deliberate and calculated act executed by Raven?",
    options: [
      "The accidental spilling of the water to form rivers",
      "The sudden eruption of the violent windstorm",
      "The scorching of his clean white feathers",
      "The hanging of the sun in the sky to illuminate the earth"
    ],
    correctAnswer: "The hanging of the sun in the sky to illuminate the earth",
    hint: "Hanging the sun was an intentional goal; the water fell accidentally and the wind was an act of nature.",
    workedSolution: "Hanging the sun was an intentional, deliberate act to illuminate the earth, whereas dropping the water was accidental.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the word 'elated' in 'Raven was so elated by his triumph' means that he was ............",
    options: [
      "trembling with terror",
      "overjoyed and exultant with happiness",
      "astonished by the brightness",
      "deeply grateful to King Hawk"
    ],
    correctAnswer: "overjoyed and exultant with happiness",
    hint: "Filled with exuberant joy, excitement, and pride.",
    workedSolution: "'Elated' means extremely happy, overjoyed, or exultant; 'overjoyed and exultant with happiness' is its direct meaning.",
    points: 1
  },
  {
    number: 5,
    prompt: "King Hawk's conduct in withholding life-sustaining elements from mortals can best be judged as ............",
    options: [
      "exceptionally clever",
      "tyrannical, selfish, and cruel",
      "illustrious and admirable",
      "benevolent and generous"
    ],
    correctAnswer: "tyrannical, selfish, and cruel",
    hint: "Hoarding vital sunlight, water, and fire while bullying humanity reflects tyrannical selfishness.",
    workedSolution: "Depriving living creatures of light, water, and heat through fear and bullying characterizes King Hawk as tyrannical, selfish, and cruel.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE CUNNING SUPPER GUEST (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Text = `As our household was eagerly anticipating an extraordinary supper of spiced roasted chicken, hot pepper salsa, and crispy fried plantain, a sharp knock rattled our wooden door. Father unlocked it to usher in an eloquent, well-groomed stranger.

The traveler introduced himself as Mr. Danso and explained that he was journeying toward the eastern border, but with commercial passenger vehicles unavailable, he was completely stranded. My parents, following their well-known tradition of hospitable generosity, invited him to share our roof and evening meal. Shortly afterward, dinner was announced. We the younger children were directed to eat in the adjoining kitchen, while our parents, the two elder siblings, two neighborhood visitors, and the stranger dined around the large dining table.

From our vantage point near the kitchen doorway, we could observe the scene clearly. "Now, Mr. Danso," Father announced politely, "as our latest arrival, you shall have the honor of carving and distributing the chicken." "An admirable privilege," Mr. Danso concurred with a bow. He severed the head of the chicken and handed it to Father, declaring, "You are the undisputed head of this household, so the head belongs to you." Turning to Mother, he remarked, "You stand directly beside the head; therefore, receive the neck." To my elder brother, Kofi, and sister, Akosua, he allocated the two wings, explaining that since they had reached maturity, they would soon need wings to fly out of the family compound. To the two visiting neighbors, he presented the feet so they could walk briskly on their homeward journey. Finally, clearing his throat, he announced loudly, "As for me, a wretched, malnourished wanderer who must banish my acute vitamin deficiency once and for all, I shall consume the remainder!" A stunned, heavy silence fell across the dining room.`;

const passage2Questions = [
  {
    number: 6,
    prompt: "According to Passage II, the narrator's family was eagerly preparing for ............",
    options: [
      "an anniversary festival dinner",
      "a special, delicacy evening supper",
      "an official communal celebration",
      "their ordinary everyday family meal"
    ],
    correctAnswer: "a special, delicacy evening supper",
    hint: "Check paragraph one: an extraordinary supper of spiced roasted chicken, pepper salsa, and fried plantain.",
    workedSolution: "The text describes the meal as an 'extraordinary supper' featuring special dishes like roasted chicken, pepper salsa, and fried plantain.",
    points: 1
  },
  {
    number: 7,
    prompt: "Why did Mr. Danso knock on the narrator's family residence in Passage II?",
    options: [
      "He had missed his way along the forest trail",
      "He had a scheduled business appointment with the father",
      "He was completely stranded due to a lack of commercial vehicles",
      "He had been dispatched by the town elders"
    ],
    correctAnswer: "He was completely stranded due to a lack of commercial vehicles",
    hint: "Paragraph two states: 'with commercial passenger vehicles unavailable, he was completely stranded.'",
    workedSolution: "Mr. Danso stopped at the house because there were no passenger vehicles available to take him to his destination, leaving him stranded.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the phrase 'their well-known tradition of hospitable generosity' indicates that the parents were habitually ............",
    options: [
      "proud and boastful",
      "strict and austere",
      "warm, welcoming, and generous to visitors",
      "suspicious of strangers"
    ],
    correctAnswer: "warm, welcoming, and generous to visitors",
    hint: "'Hospitable' means welcoming to guests; 'generosity' means open-handed kindness.",
    workedSolution: "The phrase indicates that the parents had an established reputation for being kind, welcoming, and benevolent to strangers and travelers.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to the details in Passage II, how many persons in total sat down to dine in the main dining room?",
    options: ["Four people", "Five people", "Six people", "Seven people"],
    correctAnswer: "Seven people",
    hint: "Count them: Father (1), Mother (1), Kofi (1), Akosua (1), two neighbors (2), and Mr. Danso (1) = 7 adults in the dining room.",
    workedSolution: "The diners seated at the table comprised Father, Mother, two elder siblings (Kofi and Akosua), two visiting neighbors, and Mr. Danso, totaling seven persons.",
    points: 1
  },
  {
    number: 10,
    prompt: "According to Passage II, in what exact anatomical order did Mr. Danso distribute the parts of the roasted chicken?",
    options: [
      "Head, feet, wings, carcass body, neck",
      "Head, wings, neck, carcass body, feet",
      "Head, neck, wings, feet, carcass body",
      "Head, neck, feet, wings, carcass body"
    ],
    correctAnswer: "Head, neck, wings, feet, carcass body",
    hint: "Father got the head, Mother the neck, siblings the wings, neighbors the feet, and he took the fleshy carcass body.",
    workedSolution: "The narrative details the exact sequence: head (father), neck (mother), wings (brother and sister), feet (neighbors), and the fleshy carcass body (Mr. Danso).",
    points: 1
  },
  {
    number: 11,
    prompt: "Mr. Danso's theatrical sharing of the roasted chicken can best be described as ............",
    options: [
      "selfish, greedy, and cunning",
      "talkative but remarkably generous",
      "strictly fair, honest, and impartial",
      "cheerful and unassuming"
    ],
    correctAnswer: "selfish, greedy, and cunning",
    hint: "He used witty, flattering rationales to give away bones while keeping all the meat for himself.",
    workedSolution: "Mr. Danso acted with selfish cunning: he flattered his hosts and other guests with philosophical excuses for bony portions while reserving the entire meaty carcass for himself.",
    points: 1
  },
  {
    number: 12,
    prompt: "How did the family members and visiting neighbors react to Mr. Danso's allocation?",
    options: [
      "They engaged in an angry shouting match",
      "They wept loudly over their lost portions",
      "They were dumbfounded and struck into stunned silence by his audacity",
      "They congratulated him warmly on his witty performance"
    ],
    correctAnswer: "They were dumbfounded and struck into stunned silence by his audacity",
    hint: "Look at the concluding sentence: 'A stunned, heavy silence fell across the dining room.'",
    workedSolution: "The assembled diners were stunned into complete, shocked speechlessness by the stranger's blatant selfishness and audacity.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 1994 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (13 - 17) ---
  {
    number: 13,
    prompt: "It is always commendable to remain modest in your personal lifestyle and demands.\nChoose the word nearest in meaning to 'modest'.",
    options: ["cheerful", "unassuming", "pleasant", "smart"],
    correctAnswer: "unassuming",
    hint: "Moderate, humble, or not boastful.",
    workedSolution: "'Modest' means unpretentious, moderate, or humble; 'unassuming' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "A prudent leader avoids making rash decisions during a national emergency.\nChoose the word nearest in meaning to 'rash'.",
    options: ["speedy", "indolent", "busy", "hasty"],
    correctAnswer: "hasty",
    hint: "Done without careful thought or reflection; impetuous.",
    workedSolution: "'Rash' describes an action taken impetuously without due thought or consideration; 'hasty' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The village children spent their afternoon gazing at the traditional stilt dancer.\nChoose the phrase nearest in meaning to 'gazing'.",
    options: [
      "smiling warmly",
      "shouting aloud",
      "staring fixedly",
      "hooting loudly"
    ],
    correctAnswer: "staring fixedly",
    hint: "Looking intently and continuously with wide-open eyes.",
    workedSolution: "'Gazing' means looking intently or fixedly with sustained attention; 'staring fixedly' is the exact equivalent.",
    points: 1
  },
  {
    number: 16,
    prompt: "The moss-covered escarpment was considered rather too hazardous to climb without safety ropes.\nChoose the word nearest in meaning to 'hazardous'.",
    options: ["rough", "steep", "difficult", "dangerous"],
    correctAnswer: "dangerous",
    hint: "Involving high risk of injury, harm, or peril.",
    workedSolution: "'Hazardous' means full of peril, hazard, or risk; 'dangerous' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The convicted smuggler had to plead for executive pardon before the tribunal.\nChoose the word nearest in meaning to 'plead'.",
    options: ["beg", "testify", "apply", "stand"],
    correctAnswer: "beg",
    hint: "To make an earnest, humble appeal or supplication.",
    workedSolution: "'Plead' means to make an earnest, humble entreaty; 'beg' is its closest synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (18 - 22) ---
  {
    number: 18,
    prompt: "The counselor urged the unemployed youths to stop building castles in the air. This means the youths should ............",
    options: [
      "stop designing tall stone buildings",
      "abandon unrealistic fantasies and be practical",
      "refrain from working in masonry",
      "seek wealthy patrons in the city"
    ],
    correctAnswer: "abandon unrealistic fantasies and be practical",
    hint: "To build castles in the air means to indulge in daydreaming and impossible dreams.",
    workedSolution: "The idiom 'to build castles in the air' means to indulge in daydreaming, impractical plans, and unrealistic fantasies.",
    points: 1
  },
  {
    number: 19,
    prompt: "Although I oppose the minister's politics, I must give the devil his due. This means that I will ............",
    options: [
      "adopt his political doctrine completely",
      "confess my personal grievances to him",
      "fairly acknowledge his genuine merits and strengths",
      "treat him with cold hostility"
    ],
    correctAnswer: "fairly acknowledge his genuine merits and strengths",
    hint: "To give credit where credit is due, even to an opponent or disreputable person.",
    workedSolution: "The idiom 'give the devil his due' means to be fair and acknowledge the true merits or achievements of someone you dislike or disagree with.",
    points: 1
  },
  {
    number: 20,
    prompt: "Kwame is head over heels in love with Mansa. This means that Kwame ............",
    options: [
      "looks down at his shoes whenever he sees Mansa",
      "acts unnaturally in the presence of women",
      "cannot coordinate his steps when walking",
      "is deeply and overwhelmingly in love with Mansa"
    ],
    correctAnswer: "is deeply and overwhelmingly in love with Mansa",
    hint: "Completely, passionately, and overwhelmingly infatuated.",
    workedSolution: "'Head over heels in love' is an idiom meaning completely, passionately, and deeply infatuated with someone.",
    points: 1
  },
  {
    number: 21,
    prompt: "The paramount chief instructed his linguist not to beat about the bush during the arbitration. This means the linguist must ............",
    options: [
      "avoid stammering in his speech",
      "address the core point directly without evasion",
      "avoid stepping into the sacred grove",
      "bring the dispute to a hasty conclusion"
    ],
    correctAnswer: "address the core point directly without evasion",
    hint: "Speaking directly to the point without wasting time on evasive remarks.",
    workedSolution: "'To beat about the bush' means to discuss a matter evasively without addressing the main point. Being instructed not to do so means speaking directly to the core matter.",
    points: 1
  },
  {
    number: 22,
    prompt: "When Mother returned from the clinic, Yaw let the cat out of the bag regarding the broken tureen. This means that Yaw ............",
    options: [
      "asked Mother to step onto the veranda",
      "released an animal from the market basket",
      "disclosed the secret truth about what had occurred",
      "swept the shattered pieces out of sight"
    ],
    correctAnswer: "disclosed the secret truth about what had occurred",
    hint: "To reveal a secret or disclose hidden information.",
    workedSolution: "The idiom 'to let the cat out of the bag' means to reveal a secret or disclose hidden information, often through an inadvertent confession.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (23 - 27) ---
  {
    number: 23,
    prompt: "The storeroom was too dim for comfortable inspection, but the main office was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'dim'.",
    options: ["lit", "shining", "bright", "spacious"],
    correctAnswer: "bright",
    hint: "'Dim' means poorly illuminated. Find the word that denotes radiant, full illumination.",
    workedSolution: "'Dim' means poorly illuminated. Its direct antonym regarding illumination is 'bright' (well-lit).",
    points: 1
  },
  {
    number: 24,
    prompt: "While the infant was energetic throughout the morning, he became remarkably ...... by afternoon.\nChoose the word most nearly opposite in meaning to 'energetic'.",
    options: ["sluggish", "simple", "bulky", "sturdy"],
    correctAnswer: "sluggish",
    hint: "'Energetic' means full of lively activity and vigor. Find the word meaning slow, inactive, or dull.",
    workedSolution: "'Energetic' means active and vigorous. Its direct behavioral antonym is 'sluggish' (or dull/inactive).",
    points: 1
  },
  {
    number: 25,
    prompt: "This ceremonial ornament is fashioned from artificial polymers, unlike the chief's beads which are ...... .\nChoose the word most nearly opposite in meaning to 'artificial'.",
    options: ["natural", "preserved", "splendid", "refined"],
    correctAnswer: "natural",
    hint: "'Artificial' means synthetic or man-made. Find the word meaning derived from nature.",
    workedSolution: "'Artificial' denotes synthetic or man-made items. Its direct antonym is 'natural'.",
    points: 1
  },
  {
    number: 26,
    prompt: "Following the tribunal hearing, the ringleader was convicted while his accomplices were ...... .\nChoose the word most nearly opposite in meaning to 'convicted'.",
    options: ["executed", "identified", "cautioned", "acquitted"],
    correctAnswer: "acquitted",
    hint: "'Convicted' means found guilty by law. Find the judicial term meaning officially declared not guilty and freed.",
    workedSolution: "'Convicted' means found guilty of an offense. Its direct judicial antonym is 'acquitted' (or freed/discharged).",
    points: 1
  },
  {
    number: 27,
    prompt: "Border guards patrol the frontier because the government seeks to eliminate smuggling, rather than ...... it.\nChoose the word most nearly opposite in meaning to 'eliminate'.",
    options: ["notice", "foster", "manage", "monitor"],
    correctAnswer: "foster",
    hint: "'Eliminate' means to eradicate or stamp out. Find the word meaning to encourage, promote, or nurture.",
    workedSolution: "'Eliminate' means to completely eradicate. Its direct antonym is 'foster' (to encourage, stimulate, or promote).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (28 - 40) ---
  {
    number: 28,
    prompt: "Your academic success in the forthcoming examination all depends ...... your consistent dedication.",
    options: ["by", "with", "in", "upon"],
    correctAnswer: "upon",
    hint: "Identify the preposition that regularly collocates with the verb 'depends' (on / upon).",
    workedSolution: "In standard English grammar, the verb 'depend' takes the preposition 'upon' (or 'on').",
    points: 1
  },
  {
    number: 29,
    prompt: "As patriotic citizens, we should always remain proud ...... our cultural heritage.",
    options: ["in", "of", "for", "by"],
    correctAnswer: "of",
    hint: "Identify the preposition that regularly collocates with the adjective 'proud'.",
    workedSolution: "In standard English, the adjective 'proud' takes the preposition 'of' ('proud of our heritage').",
    points: 1
  },
  {
    number: 30,
    prompt: "...... hearing the announcement of her scholarship, the student leaped high for joy.",
    options: ["Over", "On", "With", "In"],
    correctAnswer: "On",
    hint: "Structure: 'On + gerund' expresses an action taking place immediately at the moment of an event.",
    workedSolution: "The preposition 'On' followed by a gerund ('On hearing') signifies immediately at the moment of hearing the news.",
    points: 1
  },
  {
    number: 31,
    prompt: "A dangerous burglar was apprehended ...... the school compound yesterday.",
    options: ["through", "up", "outside", "over"],
    correctAnswer: "outside",
    hint: "Identify the spatial preposition meaning situated on the exterior of a perimeter.",
    workedSolution: "'Outside' is the appropriate spatial preposition indicating position on the exterior of the compound.",
    points: 1
  },
  {
    number: 32,
    prompt: "The senior master raised an objection ...... your joining the school athletic squad.",
    options: ["to", "by", "at", "on"],
    correctAnswer: "to",
    hint: "Both the verb 'object' and the noun 'objection' take this specific preposition.",
    workedSolution: "In standard English grammar, the noun 'objection' and verb 'object' take the preposition 'to' ('objection to your joining').",
    points: 1
  },
  {
    number: 33,
    prompt: "The security officer searched the hall thoroughly but did not find ...... in the building.",
    options: ["somebody", "no one", "anybody", "someone"],
    correctAnswer: "anybody",
    hint: "Use an open non-assertive pronoun in negative clauses containing 'did not' to avoid a double negative.",
    workedSolution: "Clauses containing a negative particle ('did not find') require the non-assertive pronoun 'anybody' to avoid an ungrammatical double negative.",
    points: 1
  },
  {
    number: 34,
    prompt: "This is the library reference encyclopedia ...... I retrieved from the reading desk.",
    options: ["whom", "whose", "what", "which"],
    correctAnswer: "which",
    hint: "Use the relative pronoun reserved for inanimate objects and non-human entities.",
    workedSolution: "'Which' (or 'that') is the relative pronoun used to refer to inanimate objects like 'the encyclopedia'. 'Whom' applies only to human beings.",
    points: 1
  },
  {
    number: 35,
    prompt: "The cocoa farmer ...... barn was destroyed by the bushfire is receiving medical attention.",
    options: ["who's", "whom", "whose", "which"],
    correctAnswer: "whose",
    hint: "Use the possessive relative pronoun modifying the noun 'barn'.",
    workedSolution: "'Whose' is the relative possessive pronoun used to denote ownership belonging to a person ('whose barn was destroyed').",
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
    prompt: "\"Will you have a cup of warm tea?\"\n\"No, ............, I have already eaten breakfast.\"",
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
    workedSolution: "Because the negative particle 'not' is already explicitly printed in the sentence stem ('if he ...... not there'), the affirmative copula 'is' must be inserted to form 'if he is not there'.",
    points: 1
  },
  {
    number: 40,
    prompt: "\"The crying baby needs an immediate warm bath, doesn't it?\"\n\"............, its clothing is soiled.\"",
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

// Combine all raw items
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

const assignedTargetIndices = seedShuffle(targetKeys, 199402);

// Attach Passage I and Passage II directly to questions 1-12 so that
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

  if (qNum >= 1 && qNum <= 5) {
    passageTitle = "Passage I: The Liberation of the Celestial Elements";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 6 && qNum <= 12) {
    passageTitle = "Passage II: The Cunning Supper Guest";
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
const passage1Items = balancedPaper1.slice(0, 5);
const passage2Items = balancedPaper1.slice(5, 12);
const remainingItems = balancedPaper1.slice(12);

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

async function seedBeceEnglish1994Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1994 into Firestore...");

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
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      passages: [
        {
          id: "passage_1",
          title: "Passage I: The Liberation of the Celestial Elements",
          text: passage1Text,
          questionRange: "Questions 1 to 5"
        },
        {
          id: "passage_2",
          title: "Passage II: The Cunning Supper Guest",
          text: passage2Text,
          questionRange: "Questions 6 to 12"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Liberation of the Celestial Elements",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: The Cunning Supper Guest",
          text: passage2Text,
          questionRange: "Questions 6 to 12",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 13 to 40",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1994 successfully seeded into Firestore!");
}

seedBeceEnglish1994Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1994:", err);
    process.exit(1);
  });

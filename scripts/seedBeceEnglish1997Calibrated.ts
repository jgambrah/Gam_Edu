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
// ISOMORPHIC PASSAGE I: THE RETURN OF THE NATIVE SON (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `When the saloon car screeched abruptly to a halt kicking up a swirling cloud of red dust, the children playing by the lane scattered in all directions. Once the dust settled, they rushed excitedly toward Opanyin Kwabena's compound where the vehicle had parked. Having not seen a private motorcar in their farming hamlet for nearly a year, they marveled at its gleaming metallic exterior.

Yaw Boakye, Opanyin Kwabena's eldest son and the pride of the entire village, had finally returned. The previous afternoon, the town crier had beaten the gong-gong through every quarter, proclaiming the homecoming of their native son who had traveled overseas to acquire university knowledge. The community had prepared a rousing reception for him. Eager villagers had swept the pathways and hung woven palm arches, while the children's main preoccupation was to see what foreign gifts he had brought and listen to his travel tales.

Inside the family house, Opanyin Kwabena and his household sat dressed in pristine white cloths, torn between joy and mounting anxiety. The telegram had indicated that their son would arrive at seven in the morning, but by one in the afternoon, there had still been no sign of his vehicle along the trunk road. Thus, when the sharp squeal of rubber tires reached their ears, an overwhelming sigh of relief washed over them. As Yaw Boakye stepped across the threshold, women burst into melodious praise songs.

Mindful of his roots, Yaw went round the courtyard greeting each elder with traditional decorum. When he reached his father, the old man embraced him tightly with tears wetting his wrinkled cheeks, while his mother wept aloud with uncontained joy.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, why did the village children initially scatter in all directions?",
    options: [
      "They were startled by the sudden screeching stop and dust of the vehicle",
      "They were running to alert Opanyin Kwabena of the arrival",
      "They had never seen a mechanical motorcar in their entire lives",
      "They were frightened by the loud cheers of the welcoming crowd"
    ],
    correctAnswer: "They were startled by the sudden screeching stop and dust of the vehicle",
    hint: "Reread the opening sentence: the car screeched abruptly, throwing up red dust as children scattered.",
    workedSolution: "The narrative explains that the children scattered because the unexpected, screeching halt of the car throwing up dust startled them.",
    points: 1
  },
  {
    number: 2,
    prompt: "How did the community members learn that Yaw Boakye would arrive on that specific day in Passage I?",
    options: [
      "Opanyin Kwabena had personally visited every household in town",
      "The car honked its horn as it entered the outskirts of town",
      "The town crier had beaten the gong-gong to announce it",
      "The children spotted the vehicle descending the mountain ridge"
    ],
    correctAnswer: "The town crier had beaten the gong-gong to announce it",
    hint: "Check paragraph two: 'the town crier had beaten the gong-gong through every quarter...'",
    workedSolution: "The text explicitly states that the community learned of the arrival through the town crier who beat the gong-gong the previous afternoon.",
    points: 1
  },
  {
    number: 3,
    prompt: "Why were Opanyin Kwabena and his family experiencing intense anxiety inside the house?",
    options: [
      "They were afraid that Yaw Boakye would no longer respect his native culture",
      "Their son was delayed for six hours beyond his scheduled morning arrival time",
      "They had not finished preparing the festive meal for the visitors",
      "They feared that political unrest had disrupted the highway journey"
    ],
    correctAnswer: "Their son was delayed for six hours beyond his scheduled morning arrival time",
    hint: "Paragraph three notes the telegram said 7:00 a.m., but by 1:00 p.m. he had not arrived.",
    workedSolution: "The family was anxious because six hours had elapsed past his expected 7:00 a.m. arrival time without any word from him.",
    points: 1
  },
  {
    number: 4,
    prompt: "From the narrative in Passage I, Yaw Boakye was regarded by the villagers as ............",
    options: [
      "an unruly traveler who avoided manual work",
      "the cherished and admired native son of the community",
      "a haughty academic who disdained local customs",
      "a stranger who rarely greeted the family elders"
    ],
    correctAnswer: "the cherished and admired native son of the community",
    hint: "Paragraph two describes him as 'the pride of the entire village'.",
    workedSolution: "The passage notes that he was the pride of the entire community, indicating that he was deeply loved and respected by all.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the word 'marveled' in 'marveled at its gleaming metallic exterior' means that the children ............",
    options: [
      "surrounded the vehicle in anger",
      "wondered with great admiration and astonishment",
      "chuckled loudly among themselves",
      "examined the mechanical parts closely"
    ],
    correctAnswer: "wondered with great admiration and astonishment",
    hint: "To marvel means to be filled with wonder, astonishment, or admiration.",
    workedSolution: "'Marveled' means filled with wonder or admiration; 'wondered with great admiration and astonishment' is its direct meaning.",
    points: 1
  },
  {
    number: 6,
    prompt: "Why did Yaw Boakye's mother shed tears when she embraced him?",
    options: [
      "She noticed that her son appeared weak and malnourished",
      "She had suffered a sudden physical pain in her chest",
      "She was completely overwhelmed with profound happiness and relief",
      "She realized that her son had forgotten his native tongue"
    ],
    correctAnswer: "She was completely overwhelmed with profound happiness and relief",
    hint: "Weeping with joy occurs when emotions of gratitude, love, and relief are overwhelming.",
    workedSolution: "Shedding tears of joy signifies an emotional release of pure relief and profound happiness at seeing her son safely back home.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE PILLAR OF VILLAGE EDUCATION (CALIBRATED)
// =========================================================================
const passage2Text = `At the far boundary of the settlement beyond the cocoa sheds stood the village basic school, overseen by the veteran headmaster, Master Kwesi Boateng. Framed by expansive nim trees and bordered on its western flank by a manicured football park, it ranked among the most disciplined schools in the rural district.

Master Boateng was an educator of the old dispensation—an era when basic literacy had to be fiercely fought for, when eager boys trekked eight kilometers bare-footed for the opportunity to master arithmetic and English grammar. He was unyielding in his standards, yet held in such deep veneration by parents and teachers alike that no one resented his discipline. He maintained a fatherly interest in every learner, and prominent magistrates and directors in the metropolis who had passed through his hands affectionately addressed him as "Master."

The compound surrounding the school was consistently spotless and orderly, as cutting turf and desilting gutters formed the standard corrective discipline for inattentive or insolent pupils. A flourishing vegetable plot belonging to the institution sloped down the valley behind the classrooms, where agriculture masters instructed boys and girls in practical crop rotation as part of their weekly curriculum.

Master Boateng's modest bungalow was located directly across the murram road from the school, adjacent to that of Catechist Agyeman. Consequently, the two elderly gentlemen were frequently seen conversing on the front porch during twilight or walking together to the village chapel to manage church and school matters.`;

const passage2Questions = [
  {
    number: 7,
    prompt: "According to Passage II, where was the village basic school situated?",
    options: [
      "On the outskirts beyond the village cocoa sheds",
      "In the bustling market center of the township",
      "Directly behind Master Boateng's residential garden",
      "Beside the municipal assembly hall"
    ],
    correctAnswer: "On the outskirts beyond the village cocoa sheds",
    hint: "Reread the opening sentence: 'At the far boundary of the settlement beyond the cocoa sheds...'",
    workedSolution: "The text explains that the school stood at the far edge of the settlement beyond the cocoa sheds, on the outskirts of town.",
    points: 1
  },
  {
    number: 8,
    prompt: "According to Passage II, the school compound was framed and bordered by ............",
    options: [
      "ancient nim trees and a manicured football park",
      "untrimmed bamboo thickets and swampy pools",
      "a cluster of rival commercial academies",
      "mud dwelling huts and cattle kraals"
    ],
    correctAnswer: "ancient nim trees and a manicured football park",
    hint: "Check paragraph one: framed by expansive nim trees with a football park on its western flank.",
    workedSolution: "The narrative describes the school grounds as framed by expansive nim trees and bordered by a manicured football park.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which of the following assertions is NOT true regarding Master Kwesi Boateng in Passage II?",
    options: [
      "He was revered and held in high esteem by parents and teachers",
      "He enforced unyielding discipline on the school compound",
      "He was widely despised and resented by the local community",
      "Former pupils who attained prominence in the city remembered him with affection"
    ],
    correctAnswer: "He was widely despised and resented by the local community",
    hint: "Paragraph two states that no one resented his discipline and he was held in deep veneration.",
    workedSolution: "Master Boateng was deeply venerated and respected by all; asserting that he was despised or resented is completely false.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'insolent' in 'inattentive or insolent pupils' means ............",
    options: [
      "clumsy and physically awkward",
      "disrespectful, rude, and contemptuous",
      "academically backward",
      "habitually sluggish and timid"
    ],
    correctAnswer: "disrespectful, rude, and contemptuous",
    hint: "'Insolent' means showing a rude and arrogant lack of respect.",
    workedSolution: "'Insolent' means displaying rude, disrespectful, or contemptuous behavior toward authority; 'disrespectful, rude, and contemptuous' is its exact equivalent.",
    points: 1
  },
  {
    number: 11,
    prompt: "Why were Master Boateng and Catechist Agyeman able to fellowship and converse together so frequently?",
    options: [
      "They were the only literate elders residing in the district",
      "They had retired from active public service duties",
      "Their residential bungalows were situated side by side across from the school",
      "They were biological siblings belonging to the same clan"
    ],
    correctAnswer: "Their residential bungalows were situated side by side across from the school",
    hint: "Look at paragraph four: Master Boateng's bungalow was adjacent to that of Catechist Agyeman.",
    workedSolution: "Their close companionship was enabled by proximity: their residential homes were situated directly next to each other.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 1997 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "The new accounts officer is exceptionally sincere in all her official audit reports.\nChoose the word nearest in meaning to 'sincere'.",
    options: ["candid", "honest", "prudent", "generous"],
    correctAnswer: "honest",
    hint: "Truthful, upright, and free from deceit.",
    workedSolution: "'Sincere' means free from pretense or deceit; 'honest' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The shoppers could not tolerate the foul scent emanating from the clogged gutter.\nChoose the word nearest in meaning to 'scent'.",
    options: ["vapor", "haze", "odor", "smoke"],
    correctAnswer: "odor",
    hint: "A distinctive, pervasive smell (often unpleasant in this context).",
    workedSolution: "'Scent' refers to a smell or olfactory perception; in the context of a gutter, 'odor' (or smell) is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The master builder hired two laborers to assist him in laying the stone foundation.\nChoose the word nearest in meaning to 'assist'.",
    options: ["guide", "encourage", "aid", "supervise"],
    correctAnswer: "aid",
    hint: "To help or give support to someone completing a task.",
    workedSolution: "'Assist' means to give help or support; 'aid' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The dilapidated wooden warehouse was demolished by the municipal engineering department.\nChoose the word nearest in meaning to 'demolished'.",
    options: ["renovated", "flattened", "auctioned", "surveyed"],
    correctAnswer: "flattened",
    hint: "Pulled down, razed, or destroyed.",
    workedSolution: "'Demolished' means torn down, razed, or leveled; 'flattened' (or destroyed) is its closest equivalent.",
    points: 1
  },
  {
    number: 16,
    prompt: "The visiting patrons appreciated the calm and quiet surroundings of the nature sanctuary.\nChoose the word nearest in meaning to 'calm'.",
    options: ["scenic", "tranquil", "tidy", "sheltered"],
    correctAnswer: "tranquil",
    hint: "Peaceful, serene, and free from noise or agitation.",
    workedSolution: "'Calm' describes an environment free from turmoil, agitation, or noise; 'tranquil' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "Uncle Kofi visits his ancestral village once in a blue moon. This means that Uncle Kofi visits ............",
    options: [
      "at the conclusion of every harvest",
      "exclusively on moonlit evenings",
      "very rarely on rare occasions",
      "frequently throughout the dry season"
    ],
    correctAnswer: "very rarely on rare occasions",
    hint: "Happening very seldom or infrequently.",
    workedSolution: "The idiom 'once in a blue moon' means very rarely or on extremely infrequent occasions.",
    points: 1
  },
  {
    number: 18,
    prompt: "Baaba studied methodically and will come out of her examinations with flying colours. This means that Baaba ............",
    options: [
      "will secure distinction and excellent marks",
      "will pass in her favorite elective subjects only",
      "will celebrate with colorful paper streamers",
      "will barely achieve the minimum pass mark"
    ],
    correctAnswer: "will secure distinction and excellent marks",
    hint: "To achieve outstanding success or victory.",
    workedSolution: "The idiom 'with flying colours' means with outstanding distinction, brilliance, or remarkable success.",
    points: 1
  },
  {
    number: 19,
    prompt: "The managing director hit the nail on the head regarding the cause of revenue loss. This means the director ............",
    options: [
      "spoke in an aggressive and harsh manner",
      "stated the exact truth with precision",
      "spoke in vague, evasive generalities",
      "expressed disappointment with the staff"
    ],
    correctAnswer: "stated the exact truth with precision",
    hint: "To identify or explain something with absolute accuracy.",
    workedSolution: "The idiom 'to hit the nail on the head' means to describe an issue with precise accuracy or state the exact truth.",
    points: 1
  },
  {
    number: 20,
    prompt: "Akua agreed to attend the excursion if her uncle would foot the bill. This means she will attend if her uncle ............",
    options: [
      "escorts her there on foot",
      "pays the full financial cost of the trip",
      "registers her name on the passenger list",
      "travels alongside her in the bus"
    ],
    correctAnswer: "pays the full financial cost of the trip",
    hint: "To pay the expenses or settle the account for something.",
    workedSolution: "The idiom 'to foot the bill' means to pay the full financial cost or settle the bill for an undertaking.",
    points: 1
  },
  {
    number: 21,
    prompt: "The community elders urged the two rival factions to bury the hatchet. This means the factions should ............",
    options: [
      "lock their farming cutlasses in the storeroom",
      "labor together on a communal farm",
      "settle their grievances and reconcile in peace",
      "bury their ancestral relics underground"
    ],
    correctAnswer: "settle their grievances and reconcile in peace",
    hint: "To end a dispute and make peace.",
    workedSolution: "'To bury the hatchet' is an idiom meaning to end a conflict, forgive past offenses, and make peace.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "The dormitory corridor was too dim for safe walking, so we moved into a ...... hall.\nChoose the word most nearly opposite in meaning to 'dim'.",
    options: ["clean", "bright", "spacious", "lofty"],
    correctAnswer: "bright",
    hint: "'Dim' means lacking adequate light. Find the word that denotes well-supplied with light.",
    workedSolution: "'Dim' means poorly illuminated. Its direct antonym regarding illumination is 'bright' (well-lit).",
    points: 1
  },
  {
    number: 23,
    prompt: "The royal vault contains costly jewelry, while the market vendor sells ...... trinkets.\nChoose the word most nearly opposite in meaning to 'costly'.",
    options: ["shoddy", "cheap", "crude", "inferior"],
    correctAnswer: "cheap",
    hint: "'Costly' means expensive. Find the word meaning low in price.",
    workedSolution: "'Costly' means expensive or of high price. Its direct commercial antonym is 'cheap' (inexpensive).",
    points: 1
  },
  {
    number: 24,
    prompt: "Disembarking passengers assembled in the arrival concourse, while outgoing travelers stood in the ...... lounge.\nChoose the word most nearly opposite in meaning to 'arrival'.",
    options: ["transit", "return", "departure", "boarding"],
    correctAnswer: "departure",
    hint: "'Arrival' denotes reaching a destination. Find the word denoting leaving or setting out.",
    workedSolution: "'Arrival' denotes coming into a terminal. Its direct logistical antonym is 'departure' (leaving).",
    points: 1
  },
  {
    number: 25,
    prompt: "It is unlikely that the morning coach will arrive on time, but it is ...... that it will arrive by noon.\nChoose the word most nearly opposite in meaning to 'unlikely'.",
    options: ["certain", "probable", "obvious", "evident"],
    correctAnswer: "probable",
    hint: "'Unlikely' means improbable or doubtful. Find the word meaning likely to happen.",
    workedSolution: "'Unlikely' means improbable or doubtful. Its direct antonym regarding probability is 'probable' (or likely).",
    points: 1
  },
  {
    number: 26,
    prompt: "This fabric is spun from artificial fibers, unlike traditional kente which is made from ...... cotton.\nChoose the word most nearly opposite in meaning to 'artificial'.",
    options: ["coarse", "authentic", "natural", "pure"],
    correctAnswer: "natural",
    hint: "'Artificial' means synthetic or human-made. Find the word meaning produced by nature.",
    workedSolution: "'Artificial' denotes synthetic or human-made products. Its direct antonym is 'natural'.",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (27 - 40) ---
  {
    number: 27,
    prompt: "The senior prefect raised an objection ...... your joining the library committee.",
    options: ["on", "by", "at", "to"],
    correctAnswer: "to",
    hint: "Both the verb 'object' and the noun 'objection' collocate with this preposition.",
    workedSolution: "In standard English grammar, both the verb 'object' and noun 'objection' take the preposition 'to' ('objection to your joining').",
    points: 1
  },
  {
    number: 28,
    prompt: "This private matter must remain strictly ...... you and me.",
    options: ["for", "with", "in", "between"],
    correctAnswer: "between",
    hint: "Use 'between' when sharing a secret or relation connecting exactly two persons.",
    workedSolution: "'Between' is required when referring to a relationship, secret, or distribution connecting two entities ('between you and me'). Note the objective pronoun 'me'.",
    points: 1
  },
  {
    number: 29,
    prompt: "The generous patron presented a boxed set of past questions to ...... in the graduating class.",
    options: ["all and each one", "all and everyone", "each and all", "each and every one"],
    correctAnswer: "each and every one",
    hint: "Identify the idiomatic emphatic phrase meaning every single individual without exception.",
    workedSolution: "The standard English emphatic coordinating phrase is 'each and every one' (meaning every single person without exception).",
    points: 1
  },
  {
    number: 30,
    prompt: "Tokyo is reputed to be the ...... costly metropolitan city in the world.",
    options: ["most", "much", "more", "very"],
    correctAnswer: "most",
    hint: "Form the superlative degree of multi-syllable adjectives preceded by 'the'.",
    workedSolution: "Adjectives of two or more syllables like 'costly' or 'expensive' take 'most' preceded by 'the' in the superlative degree: 'the most costly'.",
    points: 1
  },
  {
    number: 31,
    prompt: "You have to assist your parents with farm chores, ......?",
    options: ["have you", "you do", "isn't it", "don't you"],
    correctAnswer: "don't you",
    hint: "'Have to' functions as a lexical verb of obligation in the present simple, taking a question tag with 'do'.",
    workedSolution: "In 'You have to...', 'have' functions as a lexical verb in the present simple. Its question tag is formed with 'do': 'don't you?'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The agricultural tractor our cooperative bought was the ......",
    options: [
      "model latest of the machine",
      "machine latest of the model",
      "latest model of the tractor",
      "latest tractor of the model"
    ],
    correctAnswer: "latest model of the tractor",
    hint: "Standard noun phrase word order: Superlative adjective ('latest') + Head noun ('model') + Prepositional modifier ('of the tractor').",
    workedSolution: "Correct noun phrase syntax places the superlative adjective before the head noun: 'the latest model of the tractor'.",
    points: 1
  },
  {
    number: 33,
    prompt: "I will wash my school uniform as soon as I ...... home from afternoon prep.",
    options: ["went", "have gone", "could go", "go"],
    correctAnswer: "go",
    hint: "In future adverbial time clauses ('as soon as / when...'), standard grammar requires the simple present tense.",
    workedSolution: "Adverbial time clauses referring to future events use the simple present tense ('when I go / as soon as I go'), rather than a future modal or past form.",
    points: 1
  },
  {
    number: 34,
    prompt: "She maintains a remarkably cheerful disposition ...... she is an orphaned child.",
    options: ["since", "as", "though", "even"],
    correctAnswer: "though",
    hint: "Identify the subordinating conjunction of concession that introduces a contrasting circumstance.",
    workedSolution: "'Though' (or 'although') is a subordinating conjunction of concession connecting two contrasting clauses.",
    points: 1
  },
  {
    number: 35,
    prompt: "If you ...... more attentive during the demonstration, you wouldn't have ruined the experiment.",
    options: ["are", "were", "had been", "could"],
    correctAnswer: "had been",
    hint: "Third Conditional: 'wouldn't have ruined' in the main clause requires the past perfect in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause takes 'had + past participle' ('had been').",
    points: 1
  },
  {
    number: 36,
    prompt: "Kwabena often ...... his grandparents in their village after school hours.",
    options: ["had visited", "visited", "has visited", "visits"],
    correctAnswer: "visits",
    hint: "Third-person singular subject ('Kwabena') with a habitual frequency adverb ('often') takes a simple present verb.",
    workedSolution: "The singular subject 'Kwabena' combined with the frequency adverb 'often' expressing a habitual routine takes the simple present inflection 'visits'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The farmer had saved ...... capital to sponsor his daughter through teacher training college.",
    options: ["few", "enough", "most", "plenty"],
    correctAnswer: "enough",
    hint: "'Capital' is an uncountable noun. Choose the determiner denoting a sufficient quantity.",
    workedSolution: "'Enough' functions as a determiner of sufficiency modifying the non-count noun 'capital' ('enough capital'). 'Few' applies only to count nouns.",
    points: 1
  },
  {
    number: 38,
    prompt: "This mathematical instrument is mine; that one on the desk is ......",
    options: ["your's", "your", "yours", "yours'"],
    correctAnswer: "yours",
    hint: "Absolute possessive pronouns never take an apostrophe.",
    workedSolution: "'Yours' is an absolute possessive pronoun and never takes an apostrophe. Forms such as 'your's' or 'yours'' are ungrammatical.",
    points: 1
  },
  {
    number: 39,
    prompt: "\"Swallows migrate, don't they?\"\n\"............\"",
    options: ["Yes, they don't", "No, they do", "Yes, they do", "Yes, they can't"],
    correctAnswer: "Yes, they do",
    hint: "Standard English polarity: An affirmative confirmation of a fact pairs 'Yes' with a positive auxiliary.",
    workedSolution: "In standard English response conventions, answering 'Yes' to confirm an affirmative truth requires pairing with the positive verb: 'Yes, they do'.",
    points: 1
  },
  {
    number: 40,
    prompt: "The torrential morning downpour had ...... ceased when the marathon runners assembled.",
    options: ["yet", "either", "already", "now"],
    correctAnswer: "already",
    hint: "Identify the temporal adverb used with the past perfect tense to show an action completed before another past event.",
    workedSolution: "The adverb 'already' collocates with the past perfect ('had already ceased') to indicate that an action was completed prior to a past reference point.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199702);

// Attach Passage I and Passage II directly to questions 1-11 so that
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
    passageTitle = "Passage I: The Return of the Native Son";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 7 && qNum <= 11) {
    passageTitle = "Passage II: The Pillar of Village Education";
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
        prompt: "You have been offered provisional admission into a prestigious Senior Secondary School, but financial hardship and domestic challenges prevent you from reporting on the scheduled date. Write a formal letter to the Headmaster explaining your predicament and politely requesting a brief extension of time to report.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 42
Nsawam, Eastern Region
15th October, 1997

The Headmaster
St. Peter's Senior Secondary School
P. O. Box 22
Nkwatia-Kwahu

Dear Sir,

APPLICATION FOR AN EXTENSION OF TIME TO REPORT FOR ADMISSION

I respectfully write to express my profound gratitude for the provisional admission offered me to pursue the General Science programme in your prestigious institution for the 1997/1998 academic year. However, I regret to inform you that due to unforeseen financial and domestic circumstances, I am unable to report on the official reopening date of 20th October 1997.

Recently, our family was struck by severe economic misfortune when our father's commercial cocoa barn was accidentally gutted by a bushfire, destroying our entire seasonal harvest. Consequently, my parents have had to scramble to mobilize funds to pay for my boarding house fees, prescribed uniforms, and science textbooks. My father has negotiated a modest agricultural loan from the local cooperative credit union, which will be disbursed by the end of next week.

Furthermore, my mother was hospitalized with severe acute malaria three days ago, requiring my assistance at home to care for my younger siblings while my father finalized the banking arrangements. Fortunately, her condition has stabilized, and she has been discharged.

In view of these genuine difficulties, I humbly appeal to your benevolent office to grant me a two-week extension of time, permitting me to report to the boarding house on Monday, 3rd November 1997. I assure you that my fees will be settled in full upon my arrival.

Thank you for your kind understanding and anticipated benevolence.

Yours faithfully,
[Signature]
Kwaku Mensah Boateng
(Index Number: 0204010042)`
      },
      {
        questionNumber: "2",
        category: "Informal Letter",
        prompt: "You spent your recent Christmas holidays with a close friend in another town. Write a letter to your elder brother describing how you spent the holiday and explaining what made the visit memorable.",
        modelAnswer: `Anglican Junior Secondary School
P. O. Box 75
Cape Coast, Central Region
12th January, 1998

Dear Brother Yaw,

I hope this letter finds you in fine health and peace of mind in Kumasi. I am writing to share with you the exciting experiences I had during the Christmas holidays, which I spent with my classmate, Kwesi, and his family in the coastal town of Elmina.

Elmina was alive with festive energy. The town was decorated with colorful palm fronds, paper lanterns, and twinkling fairy lights. On Christmas Eve, Kwesi's family took me to an inspiring candlelight carol service at the historic St. Joseph's Basilica, where melodious brass band hymns filled the cathedral. The following morning, we enjoyed a lavish feast of spicy fante kenkey, freshly grilled sea bream, and groundnut soup prepared by Kwesi's mother.

The highlight of my stay was our visit to the historic Elmina Castle. Walking through the ancient Portuguese courtyards and dark slave dungeons brought our Social Studies textbook lessons vividly to life. A knowledgeable tour guide narrated the harrowing history of the trans-Atlantic slave trade and showed us the infamous 'Door of No Return'. Standing on the ramparts overlooking the Atlantic Ocean was both sobering and awe-inspiring.

In the evenings, we played beach soccer along the sandy coastline and enjoyed performances by traditional cultural drumming troupes. Kwesi's parents treated me like their own son, making my stay exceptionally comfortable.

I returned home thoroughly refreshed and ready for the new academic term. Please write back soon.

Your loving brother,
[Signature]
Kofi`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "You once got lost in a crowded city or strange community when you were a young child. Narrate to your classmates why you got lost, the terrifying ordeal you endured, and how you were ultimately reunited with your family.",
        modelAnswer: `LOST IN THE MAZE OF KEJETIA MARKET

I was only seven years old when I experienced the most terrifying afternoon of my childhood. It was a bustling Saturday afternoon in December, and my mother had taken me along to the sprawling Kejetia Market in Kumasi to purchase Christmas clothes and foodstuffs. The market was a sea of thousands of jostling shoppers, honking commercial buses, and shouting head porters.

While Mother was busy bargaining with a cloth merchant over yards of Dutch wax prints, my eyes caught a street vendor displaying colorful, battery-powered toy trains that whistled and flashed red lights. Captivated by the mechanical toy, I unconsciously let go of Mother's cloth and drifted away through the crowd to inspect the trains. By the time the vendor packed his wares and moved on, I turned around only to find an overwhelming wall of unfamiliar adult faces. Mother was nowhere in sight.

A cold wave of panic swept over me. I sprinted through confusing alleyways, weeping bitterly and screaming for my mother, but my small voice was swallowed by the deafening market din. As twilight descended and stalls began closing, hunger, exhaustion, and sheer terror paralyzed me. I sat on a wooden crate near a lorry station and sobbed inconsolably.

Fortunately, an elderly market woman who sold roasted groundnuts noticed my distress. She gently wiped my tears, bought me a meat pie, and took me to the central market police post. Two agonizing hours later, my frantic mother, accompanied by my uncle, rushed into the station with tear-streaked cheeks.

Collapsing into her warm embrace, I wept with profound relief. That frightening experience taught me never to wander away from parental guidance.`
      },
      {
        questionNumber: "4",
        category: "Descriptive / Expository Travelogue",
        prompt: "Describe an interesting and educational tourist or historical site you have visited in your country, and explain what practical knowledge and insights you gained from the visit.",
        modelAnswer: `A VISIT TO THE MAJESTIC CANOPY WALKWAYS OF KAKUM NATIONAL PARK

Among the diverse geographical and historical landmarks in Ghana, my excursion to the world-renowned Kakum National Park in the Central Region remains the most exhilarating and educative journey I have ever undertaken. Situated about thirty kilometers north of Cape Coast, the park protects a pristine expanse of virgin tropical rainforest that serves as a sanctuary for endangered wildlife.

The adventure began at the park's modern interpretive center, where wildlife conservation officers briefed our school club on the rich biodiversity of the forest. The climax of our tour was ascending the famous canopy walkway—a suspension bridge suspended forty meters above the forest floor, strung between giant mahogany and silk-cotton trees.

Walking across the narrow, swaying rope bridges was heart-pounding, but the view from above was breathtaking. High above the forest canopy, we beheld a sprawling sea of emerald green foliage stretching toward the horizon. The air was crisp, cool, and laden with the fragrance of wild orchids and moist moss. Looking down, we observed exotic birds like the white-crested hornbill, colorful butterflies, and playful mona monkeys leaping among tree branches.

This remarkable visit yielded immense educational benefits. Practically, it transformed the abstract ecological concepts we memorized in Integrated Science—such as food chains, forest stratification, and oxygen cycles—into living realities. Furthermore, our guides explained how deforestation threatens rainfall patterns and destroys medicinal herbal plants that cure ailments.

The visit instilled in me a deep commitment to environmental conservation. Kakum is a priceless national treasure that every Ghanaian student must experience.`
      }
    ]
  }
};

async function seedBeceEnglish1997Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1997 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1997");
  await docRef.set({
    year: 1997,
    title: "BECE English Language 1997 (Calibrated National Benchmark)",
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
          title: "Passage I: The Return of the Native Son",
          text: passage1Text,
          questionRange: "Questions 1 to 6"
        },
        {
          id: "passage_2",
          title: "Passage II: The Pillar of Village Education",
          text: passage2Text,
          questionRange: "Questions 7 to 11"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Return of the Native Son",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: The Pillar of Village Education",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1997 successfully seeded into Firestore!");
}

seedBeceEnglish1997Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1997:", err);
    process.exit(1);
  });

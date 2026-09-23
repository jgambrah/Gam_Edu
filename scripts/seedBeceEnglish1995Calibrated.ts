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
// ISOMORPHIC PASSAGE I: THE STOLEN HARVEST AND THE TRACKING HOUND
// =========================================================================
const passage1Text = `Papa Mensah walked through his outlying plantain grove early on Tuesday morning, humming a quiet tune. His contentment evaporated instantly when he reached the southern edge of the plot. Three massive bunches of ripe horn-plantain, which he had earmarked for the regional market, had been cleanly harvested and hauled away. Fresh footprints pressed deeply into the damp clay soil showed clearly that the intruder had departed under the cover of darkness.

Refusing to let the culprit escape, Papa Mensah hurried back to the village and enlisted the aid of Opanyin Donkor, the owner of an agile tracking hound named Hunter. The brown dog sniffed a shredded burlap sack left behind by the trespasser and immediately broke into an eager bark. Pointing his snout toward the forest trail, Hunter sprang forward with powerful strides, his nose skimming the fallen foliage. Papa Mensah and two young neighbors hurried in pursuit, clutching wooden walking sticks.

The trail wound through thickets of bamboo and crossed a trickling stream before leading directly toward an isolated farm hut at the edge of the adjoining village. As they drew near, thin wisps of smoke drifted through the trees, carrying the unmistakable fragrance of roasted plantain. Hunter bounded into the clearing and barked furiously outside the bamboo fence.

Caught completely off guard, a young man named Kwadwo dropped a blackened roasting grate and raised his trembling hands. Behind his earthen hearth lay the freshly severed plantain stalks, still leaking sticky sap. Faced with the undeniable evidence, Kwadwo knelt on the ground and pleaded for mercy, confessing that hunger and greed had driven him to harvest where he had not sown. The elders bound his wrists with raffia twine and marched him toward the chief's palace.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, why did Papa Mensah's initial cheerful mood vanish upon reaching his farm?",
    options: [
      "Heavy torrential rains had flooded his entire plantation",
      "He discovered that three prime bunches of ripe plantain had been stolen",
      "Stray cattle had grazed down all his young suckers",
      "He realized he had misplaced his farming cutlass on the trail"
    ],
    correctAnswer: "He discovered that three prime bunches of ripe plantain had been stolen",
    hint: "Reread paragraph one: his contentment evaporated when he found his marked bunches stolen.",
    workedSolution: "The narrative explains that his happiness disappeared because someone had entered his grove under darkness and stolen his ripe plantain bunches.",
    points: 1
  },
  {
    number: 2,
    prompt: "How did the tracking hound, Hunter, pick up the scent of the thief in Passage I?",
    options: [
      "He followed the footprints left on the damp clay soil",
      "He sniffed a shredded burlap sack abandoned at the scene by the intruder",
      "He was guided by the smoke rising from the forest clearing",
      "He heard Kwadwo shouting in the neighboring settlement"
    ],
    correctAnswer: "He sniffed a shredded burlap sack abandoned at the scene by the intruder",
    hint: "Look at paragraph two: 'The brown dog sniffed a shredded burlap sack left behind...'",
    workedSolution: "The text explicitly states that Hunter acquired the scent after sniffing an abandoned burlap sack left behind in the grove.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, what immediate sign alerted the search party that they were closing in on the culprit?",
    options: [
      "The loud shouts of neighboring farmers clearing land",
      "Footprints leading across the bamboo footbridge",
      "Wisps of smoke carrying the aroma of roasted plantain",
      "Kwadwo running into the deep thicket"
    ],
    correctAnswer: "Wisps of smoke carrying the aroma of roasted plantain",
    hint: "Check paragraph three: wisps of smoke and the unmistakable fragrance of roasted plantain.",
    workedSolution: "As they approached the clearing, rising smoke and the appetizing scent of roasted plantain confirmed the culprit's immediate presence.",
    points: 1
  },
  {
    number: 4,
    prompt: "Which of the following items provided irrefutable proof of Kwadwo's guilt in Passage I?",
    options: [
      "A bundle of raffia twine lying on the veranda",
      "The bamboo fence surrounding his isolated compound",
      "The freshly cut plantain stalks still oozing sticky sap",
      "The metal cutlass hidden beneath his sleeping mat"
    ],
    correctAnswer: "The freshly cut plantain stalks still oozing sticky sap",
    hint: "Reread paragraph four: behind his hearth lay the severed stalks still leaking sap.",
    workedSolution: "The freshly severed plantain stalks leaking sap behind his hearth served as direct physical proof linking him to the grove theft.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the word 'agile' in 'an agile tracking hound' means that the dog was ............",
    options: [
      "aggressive and vicious toward strangers",
      "quick, nimble, and athletic in movement",
      "excessively hungry and thin",
      "well-trained in retrieving game birds"
    ],
    correctAnswer: "quick, nimble, and athletic in movement",
    hint: "'Agile' means able to move quickly and easily.",
    workedSolution: "'Agile' describes physical swiftness, flexibility, and coordination; 'quick, nimble, and athletic in movement' is its direct meaning.",
    points: 1
  },
  {
    number: 6,
    prompt: "What final action did the search party take after apprehending Kwadwo in Passage I?",
    options: [
      "They beat him severely and confiscated his hearth",
      "They demanded immediate monetary compensation for the plantain",
      "They secured his hands and escorted him to the royal palace for arbitration",
      "They banished him from the district forever"
    ],
    correctAnswer: "They secured his hands and escorted him to the royal palace for arbitration",
    hint: "Check the final sentence: they bound his wrists and marched him to the chief's palace.",
    workedSolution: "The elders bound his wrists with twine and took him directly to the traditional authority (the chief's palace) for formal justice.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE MENACE OF BUSHFIRES (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Text = `Throughout the arid harmattan season, across the transition and savanna belts of West Africa, uncontrolled bushfires represent an immense ecological and economic catastrophe. When dry northeasterly trade winds sweep parched vegetation, a single stray spark can ignite an uncontrollable blaze capable of devouring square miles of virgin forest and cultivated farmland within hours.

The primary catalysts behind this recurring crisis are careless human practices. Nocturnal game hunters frequently ignite dry grasslands to flush out grasscutters and antelopes, while careless palm-wine tappers leave open fires burning beside tapped felled oil palms. Similarly, thoughtless travelers discard lit cigarette butts into dry roadside grasses, and farmers clearing land fail to construct adequate firebreaks before applying match flames.

The consequences of these seasonal infernos are devastating. Hundreds of acres of mature cocoa plantations, oil palm groves, and staple food barns are incinerated, plunging industrious agrarian families into sudden poverty and destitution. Furthermore, the intense radiant heat strips the soil of vital organic humus, destroying beneficial microorganisms and exposing bare topsoil to severe wind and gully erosion. Wild animals perish in the infernos, while others lose their natural habitats and flee into human settlements.

To arrest this recurrent environmental devastation, local district assemblies must abandon passive lamentation and institute rigorous preventative enforcement. Environmental bye-laws against indiscriminate burning must be strictly implemented, with deterrent fines and prison sentences imposed on culprits. Simultaneously, communities should train and equip volunteer anti-bushfire squads, while educating citizens to recognize that safeguarding vegetation is safeguarding national survival.`;

const passage2Questions = [
  {
    number: 7,
    prompt: "According to Passage II, why are bushfires particularly prevalent during the harmattan season?",
    options: [
      "Farmers burn their fields to invite early rainfall",
      "Dry winds and desiccated brush allow a single spark to spread with terrifying speed",
      "Wild rodents deliberately ignite grasses to escape predators",
      "The sun's rays automatically set dry trees ablaze at noon"
    ],
    correctAnswer: "Dry winds and desiccated brush allow a single spark to spread with terrifying speed",
    hint: "Reread paragraph one: dry northeasterly trade winds and parched vegetation allow fires to spread in hours.",
    workedSolution: "The passage explains that dry harmattan winds combined with dry, parched vegetation create ideal conditions for tiny sparks to ignite massive blazes.",
    points: 1
  },
  {
    number: 8,
    prompt: "According to Passage II, which of the following is identified as a major human cause of uncontrolled bushfires?",
    options: [
      "Constructing deep drainage gutters along public roads",
      "Hunters setting fire to dry bush to trap wild game animals",
      "Farmers applying chemical weedkillers to their crops",
      "Planting boundary hedges around cocoa plantations"
    ],
    correctAnswer: "Hunters setting fire to dry bush to trap wild game animals",
    hint: "Paragraph two notes that hunters set fires to flush out grasscutters and antelopes.",
    workedSolution: "The text explicitly cites game hunters setting fires to smoke out rodents and antelopes as a leading cause of bushfires.",
    points: 1
  },
  {
    number: 9,
    prompt: "In Passage II, how do recurring infernos undermine agricultural soil fertility?",
    options: [
      "They deposit excessive nitrogen into the subsoil",
      "They burn away vital organic humus and destroy beneficial soil microorganisms",
      "They harden the soil and prevent roots from absorbing rainwater",
      "They stimulate the growth of invasive deep-rooted weeds"
    ],
    correctAnswer: "They burn away vital organic humus and destroy beneficial soil microorganisms",
    hint: "Check paragraph three: heat strips organic humus, kills microorganisms, and exposes topsoil.",
    workedSolution: "The intense heat destroys the organic top layer (humus) and kills microscopic organisms essential for natural soil fertility.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'devastating' in 'consequences of these seasonal infernos are devastating' means ............",
    options: [
      "mild and temporary",
      "highly destructive, ruinous, and disastrous",
      "peculiar and surprising",
      "gradual and unnoticeable"
    ],
    correctAnswer: "highly destructive, ruinous, and disastrous",
    hint: "'Devastating' means causing severe shock, distress, or total ruin.",
    workedSolution: "'Devastating' denotes overwhelming destruction, ruin, or calamity; 'highly destructive, ruinous, and disastrous' is the accurate equivalent.",
    points: 1
  },
  {
    number: 11,
    prompt: "What practical recommendation does the author propose in Passage II to permanently curb the bushfire menace?",
    options: [
      "Banning all agricultural cultivation during the dry harmattan months",
      "Strictly enforcing anti-burning bye-laws with harsh deterrent sanctions and training volunteer squads",
      "Encouraging farmers to migrate to coastal urban districts",
      "Spraying chemical fire retardants across all open grasslands"
    ],
    correctAnswer: "Strictly enforcing anti-burning bye-laws with harsh deterrent sanctions and training volunteer squads",
    hint: "Look at the final paragraph: enforcing bye-laws, imposing fines, and training volunteer fire squads.",
    workedSolution: "The author advocates enforcing environmental bye-laws with deterrent penalties and establishing trained community volunteer fire-fighting squads.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 1995 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "The market inspector was furious when he discovered contaminated meat on sale.\nChoose the word nearest in meaning to 'furious'.",
    options: ["troubled", "enraged", "weary", "stern"],
    correctAnswer: "enraged",
    hint: "Extremely, violently angry.",
    workedSolution: "'Furious' means violently angry or full of fury; 'enraged' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The inhabitants abandoned the coastal settlement after the sea erosion breached the barrier.\nChoose the word nearest in meaning to 'abandoned'.",
    options: ["fortified", "deserted", "surveyed", "cleared"],
    correctAnswer: "deserted",
    hint: "Left behind completely; vacated.",
    workedSolution: "'Abandoned' means left permanently empty or vacated; 'deserted' is its exact equivalent.",
    points: 1
  },
  {
    number: 14,
    prompt: "A diligent scholar rarely leaves his homework unfinished before nightfall.\nChoose the word nearest in meaning to 'diligent'.",
    options: ["hardworking", "ambitious", "punctual", "competent"],
    correctAnswer: "hardworking",
    hint: "Showing persistent, careful, and steady effort.",
    workedSolution: "'Diligent' means showing steady, earnest application and care in duties; 'hardworking' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The smuggler concealed the contraband gold bars beneath the spare tire of his vehicle.\nChoose the word nearest in meaning to 'concealed'.",
    options: ["secured", "hidden", "packed", "disguised"],
    correctAnswer: "hidden",
    hint: "Placed out of sight; kept secret.",
    workedSolution: "'Concealed' means kept out of sight or hidden from view; 'hidden' is its direct equivalent.",
    points: 1
  },
  {
    number: 16,
    prompt: "Navigating the flooded estuary during the squall proved to be a perilous venture.\nChoose the word nearest in meaning to 'perilous'.",
    options: ["tiresome", "laborious", "dangerous", "unpleasant"],
    correctAnswer: "dangerous",
    hint: "Full of danger, hazard, or risk to life.",
    workedSolution: "'Perilous' means full of danger or grave risk; 'dangerous' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "To secure admission into medical school, Kwesi had to burn the midnight oil for months. This means that Kwesi ............",
    options: [
      "spent considerable money on kerosene fuel",
      "studied late into the night with great determination",
      "worked as a nighttime security watchman",
      "suffered from chronic insomnia"
    ],
    correctAnswer: "studied late into the night with great determination",
    hint: "To work or study late into the night.",
    workedSolution: "The idiom 'to burn the midnight oil' means to read, study, or work late into the night.",
    points: 1
  },
  {
    number: 18,
    prompt: "Esi felt like a fish out of water at the gathering of civil engineers. This means that Esi felt ............",
    options: [
      "suffocated by the warm room temperature",
      "thirsty and desperately in need of water",
      "uncomfortable, awkward, and out of her natural element",
      "eager to display her technical knowledge"
    ],
    correctAnswer: "uncomfortable, awkward, and out of her natural element",
    hint: "Feeling awkward or unsuited in an unfamiliar environment.",
    workedSolution: "The idiom 'like a fish out of water' describes someone who feels uneasy, awkward, or out of place in an unfamiliar setting.",
    points: 1
  },
  {
    number: 19,
    prompt: "Before the surprise party could take place, Kofi spilled the beans. This means that Kofi ............",
    options: [
      "accidentally dropped the food bowls on the floor",
      "revealed confidential plans prematurely to others",
      "refused to attend the celebration",
      "prepared the banquet dishes poorly"
    ],
    correctAnswer: "revealed confidential plans prematurely to others",
    hint: "To disclose a secret prematurely or indiscreetly.",
    workedSolution: "The idiom 'to spill the beans' means to disclose confidential information or reveal a secret prematurely.",
    points: 1
  },
  {
    number: 20,
    prompt: "The two business partners rarely see eye to eye on financial investments. This means they rarely ............",
    options: [
      "look into each other's eyes during negotiations",
      "agree completely on strategic financial policies",
      "meet face-to-face in the corporate boardroom",
      "dispute account balances presented by auditors"
    ],
    correctAnswer: "agree completely on strategic financial policies",
    hint: "To see eye to eye means to have the same opinion or agree.",
    workedSolution: "The idiom 'to see eye to eye' means to agree with someone or share the exact same opinion.",
    points: 1
  },
  {
    number: 21,
    prompt: "The delinquent student submitted his term project at the eleventh hour. This means he submitted it ............",
    options: [
      "at precisely eleven o'clock in the morning",
      "at the last possible moment before the deadline",
      "long after the official deadline had elapsed",
      "earlier than all his fellow classmates"
    ],
    correctAnswer: "at the last possible moment before the deadline",
    hint: "At the very last possible moment.",
    workedSolution: "The idiom 'at the eleventh hour' means at the very last moment or right before it is too late.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "While the alluvial valley soil was fertile, the highland ridge was completely ...... .\nChoose the word most nearly opposite in meaning to 'fertile'.",
    options: ["porous", "barren", "shallow", "dry"],
    correctAnswer: "barren",
    hint: "'Fertile' means highly productive of plant life. Find the agricultural term meaning unproductive or infertile.",
    workedSolution: "'Fertile' describes soil rich in nutrients capable of bearing abundant crops. Its direct antonym is 'barren' (incapable of producing life/crops).",
    points: 1
  },
  {
    number: 23,
    prompt: "The community elders gathered to praise the honest youth, but chose to ...... the unrepentant thief.\nChoose the word most nearly opposite in meaning to 'praise'.",
    options: ["caution", "condemn", "sentence", "ignore"],
    correctAnswer: "condemn",
    hint: "'Praise' means to express high approval. Find the word that denotes expressing severe disapproval or censure.",
    workedSolution: "'Praise' means to express warm approval or admiration. Its direct antonym is 'condemn' (to express complete disapproval or censure).",
    points: 1
  },
  {
    number: 24,
    prompt: "Potable water was scarce during the dry season, but became ...... after the heavy rains.\nChoose the word most nearly opposite in meaning to 'scarce'.",
    options: ["pure", "plentiful", "flowing", "accessible"],
    correctAnswer: "plentiful",
    hint: "'Scarce' means insufficient or rare in supply. Find the word denoting existing in abundant supply.",
    workedSolution: "'Scarce' means available in small quantities or rare. Its direct antonym is 'plentiful' (abundant or available in large amounts).",
    points: 1
  },
  {
    number: 25,
    prompt: "The former manager was haughty and dismissive, unlike his successor who was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'haughty'.",
    options: ["gentle", "humble", "cheerful", "courteous"],
    correctAnswer: "humble",
    hint: "'Haughty' means proud and arrogant. Find the word meaning modest and unpretentious.",
    workedSolution: "'Haughty' means arrogantly proud and disdainful. Its direct antonym is 'humble' (modest and unpretentious).",
    points: 1
  },
  {
    number: 26,
    prompt: "After the rainstorm passed, the raging floodwaters subsided, but the reservoir level ...... rapidly overnight.\nChoose the word most nearly opposite in meaning to 'subsided'.",
    options: ["crept", "surged", "cleared", "calmed"],
    correctAnswer: "surged",
    hint: "'Subsided' means receded, dropped, or decreased. Find the word meaning rose or increased sharply.",
    workedSolution: "'Subsided' means receded, declined, or dropped. Its direct physical antonym in water movement is 'surged' (rose powerfully and rapidly).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & GRAMMAR (27 - 40) ---
  {
    number: 27,
    prompt: "Sister Akosua is an exceptionally talented organist, ......?",
    options: ["isn't it", "wasn't she", "is she", "isn't she"],
    correctAnswer: "isn't she",
    hint: "An affirmative present statement with copula 'is' and a feminine subject takes the negative tag 'isn't she?'.",
    workedSolution: "The statement is affirmative in the simple present tense with 'is' and subject 'Akosua'. The tag must be negative: 'isn't she?'.",
    points: 1
  },
  {
    number: 28,
    prompt: "Diligent candidates always complete their assignments before dusk, ......?",
    options: ["don't they", "shouldn't they", "can't they", "haven't they"],
    correctAnswer: "don't they",
    hint: "The affirmative simple present verb 'complete' with plural subject 'candidates' takes a negative tag formed with 'do'.",
    workedSolution: "The main clause has an affirmative present simple verb ('complete') with plural subject ('candidates' -> 'they'). The tag is 'don't they?'.",
    points: 1
  },
  {
    number: 29,
    prompt: "You can decipher this ancient script without a dictionary, ......?",
    options: ["can you", "can't you", "do you", "won't you"],
    correctAnswer: "can't you",
    hint: "An affirmative modal statement with 'can' and subject 'you' takes the negative tag 'can't you?'.",
    workedSolution: "The affirmative modal 'can' in the main clause pairs with the negative contracted tag 'can't you?'.",
    points: 1
  },
  {
    number: 30,
    prompt: "The commercial bus ...... before we arrived at the inter-city station.",
    options: ["departed", "has departed", "had departed", "was departing"],
    correctAnswer: "had departed",
    hint: "Use the past perfect tense ('had + past participle') for an action completed prior to another past event.",
    workedSolution: "The bus leaving occurred before the past arrival at the terminal, requiring the Past Perfect tense: 'had departed'.",
    points: 1
  },
  {
    number: 31,
    prompt: "The carpenter brought the carved wooden chest ...... was commissioned by the chief.",
    options: ["who", "whose", "which", "whom"],
    correctAnswer: "which",
    hint: "Use the relative pronoun reserved for inanimate objects and non-human entities.",
    workedSolution: "'Which' (or 'that') is the relative pronoun used to refer to inanimate objects like 'the carved wooden chest'.",
    points: 1
  },
  {
    number: 32,
    prompt: "If the apprentice studies with dedication, he ...... his trade certification comfortably.",
    options: ["will earn", "earned", "has earned", "would earn"],
    correctAnswer: "will earn",
    hint: "First Conditional: Simple present in the if-clause ('studies') requires the future modal in the main clause.",
    workedSolution: "In a First Conditional sentence expressing a realistic future outcome, the main clause requires 'will + base verb': 'will earn'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Arrogant individuals are in the habit of looking ...... the poor.",
    options: ["down on", "down at", "down to", "down for"],
    correctAnswer: "down on",
    hint: "Identify the three-word phrasal verb meaning to view someone with contempt or superiority.",
    workedSolution: "The phrasal verb 'to look down on' means to regard someone with disdain, contempt, or superiority.",
    points: 1
  },
  {
    number: 34,
    prompt: "Bulky cargo containers are usually transported across continents ...... sea.",
    options: ["through", "to", "on", "by"],
    correctAnswer: "by",
    hint: "General modes of transport (sea, air, road, rail) take the preposition 'by' without determiners.",
    workedSolution: "When describing standard means or routes of cargo transit without articles, English uses 'by' ('by sea', 'by air').",
    points: 1
  },
  {
    number: 35,
    prompt: "The headmaster announced that ...... Kwabena or Kofi must represent the school in the debate.",
    options: ["neither", "either", "both", "also"],
    correctAnswer: "either",
    hint: "Identify the correlative conjunction that pairs with 'or'.",
    workedSolution: "In correlative coordination, 'either' pairs with 'or' ('either Kwabena or Kofi'). 'Neither' pairs with 'nor'.",
    points: 1
  },
  {
    number: 36,
    prompt: "Everyone in the examination hall ...... given a sealed test booklet.",
    options: ["were", "was", "have been", "are"],
    correctAnswer: "was",
    hint: "Indefinite pronouns ending in '-one' (everyone, someone, anyone) are grammatically singular.",
    workedSolution: "'Everyone' is a singular indefinite pronoun. In a past passive frame, it takes the singular past auxiliary 'was'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The nurse heard the frightened child ...... out in pain during the injection.",
    options: ["cried", "cry", "to cry", "cries"],
    correctAnswer: "cry",
    hint: "Verbs of perception (hear, see, watch) take a bare infinitive without 'to' for a completed action.",
    workedSolution: "Following verbs of sensory perception ('heard'), English uses a bare infinitive ('cry') without 'to' to denote perceiving the action.",
    points: 1
  },
  {
    number: 38,
    prompt: "The senior prefect ordered the unruly junior to stand ...... his feet immediately.",
    options: ["on", "upon", "at", "by"],
    correctAnswer: "on",
    hint: "Identify the preposition used in the standard idiom 'to stand on one's feet'.",
    workedSolution: "The idiomatic prepositional phrase is 'stand on one's feet' (or 'get on one's feet').",
    points: 1
  },
  {
    number: 39,
    prompt: "The mathematical riddle was ...... intricate for the junior pupils to solve unaided.",
    options: ["so", "much", "too", "very"],
    correctAnswer: "too",
    hint: "Correlative degree structure: 'too + adjective + to-infinitive'.",
    workedSolution: "The degree modifier 'too' pairs with the infinitive 'to solve' to indicate an excessive degree that prevents success ('too intricate to solve').",
    points: 1
  },
  {
    number: 40,
    prompt: "If the motorist ...... heed to the warning sign, he would not have crashed into the ditch.",
    options: ["paid", "has paid", "had paid", "was paying"],
    correctAnswer: "had paid",
    hint: "Third Conditional: 'would not have crashed' in the main clause requires the past perfect in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause requires 'had + past participle': 'had paid'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199502);

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
    passageTitle = "Passage I: The Stolen Harvest and the Tracking Hound";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 7 && qNum <= 11) {
    passageTitle = "Passage II: The Menace of Bushfires";
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
        prompt: "Your district lacks a public library, forcing students to study under difficult conditions. Write a formal petition to your Municipal Chief Executive (MCE) explaining how this deficit affects education and appealing for the construction of a modern community library.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
12th May, 1995

The Municipal Chief Executive
Bekwai Municipal Assembly
Municipal Directorate, Bekwai

Dear Sir,

PETITION FOR THE CONSTRUCTION OF A MODERN COMMUNITY LIBRARY IN BEKWAI

On behalf of the basic and secondary school students of the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the acute lack of a public library in our township, and to appeal for the assembly's intervention.

Currently, over twenty basic and secondary schools in our municipality lack functional school libraries. Students depend entirely on brief classroom chalkboard notes, as our families cannot afford expensive imported textbooks, encyclopedias, and past question compendiums. Furthermore, most residential homes lack quiet study spaces and electricity, making evening study nearly impossible for young scholars. Consequently, academic performance in national examinations like the BECE and SSSCE has declined markedly.

Constructing a modern, well-equipped community library will transform the educational fortunes of our youth. A public library provides a serene learning sanctuary, fosters independent research habits, and nurtures a lifelong reading culture. In an era driven by scientific knowledge and technological literacy, our youth need access to reference literature and digital learning materials to compete with their urban peers.

We humbly appeal to the Municipal Assembly to allocate resources from the District Assembly Common Fund to rehabilitate the old town hall into a public library stocked with contemporary educational materials.

We trust in your visionary leadership and commitment to youth development.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Student Representative)`
      },
      {
        questionNumber: "2",
        category: "Informal Letter",
        prompt: "You are preparing for your final Basic Education Certificate Examination (BECE) and find Mathematics and Integrated Science challenging. Write a letter to your elder sister attending university, asking for her advice and study strategies to overcome these academic difficulties.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 1995

Dear Sister Yaa,

I hope this letter finds you in fine health and excelling in your second-year medical studies at the University of Ghana. I am writing to seek your academic mentorship and practical advice as I prepare for our upcoming final BECE.

Over the past two terms, I have experienced persistent anxiety regarding my performance in Mathematics and Integrated Science. While my grades in English Language and Social Studies are consistently high, I struggle with algebraic equations, geometric proofs, and chemical formulas. Whenever our masters administer timed mock tests, I become flustered, lose my train of thought, and run out of time before completing the quantitative sections.

Knowing how brilliantly you navigated these same subjects during your secondary school days, I would be immensely grateful if you could share the study routines and mnemonic techniques you employed. Specifically, how did you master complex scientific definitions and overcome panic during examination sessions?

If your weekend schedule permits, could you recommend supplementary revision workbooks that break down past questions into simple, step-by-step solutions? I am determined to secure Grade One in all subjects to qualify for admission into Wesley Girls' High School.

Thank you for always being my role model. Extend my warmest regards to your roommates.

Your loving brother,
[Signature]
Emmanuel Addo`
      },
      {
        questionNumber: "3",
        category: "Descriptive Essay",
        prompt: "Describe in vivid, colorful detail an agricultural and trade fair recently held in your district, highlighting the exhibits, cultural activities, and benefits to local farmers.",
        modelAnswer: `THE ANNUAL DISTRICT AGRICULTURAL AND TRADE EXHIBITION

Last Friday, the Jubilee Park in Bekwai was transformed into a vibrant commercial carnival as farmers, agro-processors, and traditional craftsmen gathered for the 1995 Municipal Agricultural and Trade Fair. The event celebrated agrarian excellence and served as a marketing platform for rural producers.

The exhibition grounds presented a stunning feast for the senses. Agricultural pavilions were overflowing with giant tubers of white yam, clusters of golden oil palm, crates of plump tomatoes, and massive bunches of plantain displayed by competing farming cooperatives. In the livestock enclosure, prize-winning West African dwarf sheep, robust Boer goats, and healthy commercial poultry attracted large crowds of prospective buyers and veterinary students.

Beyond raw farm produce, the trade fair featured modern agricultural machinery and innovative rural technology. Local fabricators showcased pedal-powered cassava graters, mechanized solar crop dryers, and hand-operated water pumps designed to assist smallholder vegetable growers during dry seasons. Agricultural extension officers conducted live demonstrations on compost preparation and organic pest control.

The atmosphere was further electrified by traditional cultural troupes. Dancers dressed in colorful smocks performed energetic warrior dances to fontomfrom drums, while savory aromas of sizzling kebabs, roasted plantain, and spiced fried fish filled the air.

The fair concluded with the presentation of awards by the regional minister, who presented motor-tricycles, mist-blowers, and knapsack sprayers to the best district farmers. It was a triumphant event that highlighted the dignity and economic vitality of agriculture.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Narrate an engaging and suspenseful account of a harrowing evening when a violent rainstorm struck your community while you were alone at home, recounting what happened and how you survived.",
        modelAnswer: `A NIGHT OF TERROR IN THE STORM

It was a suffocating Friday evening in March, and my parents had traveled to a neighboring town for an elder's funeral, leaving me alone in our four-room family bungalow. At around eight o'clock, the oppressive heat was abruptly shattered by a howling wind that slammed our wooden window shutters violently against the walls.

Within minutes, the sky turned ink-black, illuminated only by blinding forks of lightning that split the heavens. Deafening claps of thunder shook the foundation of our house, followed immediately by a torrential downpour of rain and hail pounding against our corrugated zinc roof like thousands of metallic bullets. Suddenly, a blinding flash accompanied by an explosive crack struck our backyard transformer, plunging the entire neighborhood into terrifying darkness.

As the wind reached gale force, a horrifying screeching sound echoed above me. To my utter horror, the storm ripped off a large section of our living room roof, allowing sheets of icy rainwater to pour inside. Furniture, books, and family albums were soaked in seconds. Panic gripped my chest as the water level on the floor rose toward my ankles.

Remembering my father's emergency instructions, I forced my way against the roaring gale to the central utility closet, retrieved a heavy rubber raincoat and a battery torch, and secured our family's vital document box wrapped in plastic sheets. Crawling carefully along the dark hallway, I took refuge under the concrete lintel of the bathroom archway, shivering violently as the storm raged for two grueling hours.

When dawn finally broke, revealing fallen trees and torn roofs across the village, my neighbors found me huddled safely in the corridor. Surviving that furious tempest taught me resilience and profound respect for the majestic power of nature.`
      }
    ]
  }
};

async function seedBeceEnglish1995Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1995 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1995");
  await docRef.set({
    year: 1995,
    title: "BECE English Language 1995 (Calibrated National Benchmark)",
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
          title: "Passage I: The Stolen Harvest and the Tracking Hound",
          text: passage1Text,
          questionRange: "Questions 1 to 6"
        },
        {
          id: "passage_2",
          title: "Passage II: The Menace of Bushfires",
          text: passage2Text,
          questionRange: "Questions 7 to 11"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Stolen Harvest and the Tracking Hound",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: The Menace of Bushfires",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1995 successfully seeded into Firestore!");
}

seedBeceEnglish1995Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1995:", err);
    process.exit(1);
  });

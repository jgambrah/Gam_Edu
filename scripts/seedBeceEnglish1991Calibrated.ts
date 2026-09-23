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
// PASSAGE I: SIGHTSEEING IN ACCRA
// ==========================================
const passage1Text = `When Mr. Appiah looked at the two happy faces of his nephews, he forgot about his aching feet and smiled. He had spent the whole day showing Asare and Attah, who came from the village, around Accra. He was satisfied that they were happy. It was not until they were seated on a bench in the public garden that he realized how hot, tired and dusty he was.

It was a long time since he had walked so much. Like many other successful men, Mr. Appiah had acquired the habit of going everywhere in his car, so that day's sight-seeing expedition had worn him out.

"Well, what do you think of Accra?" he asked the boys.

"Oh!" exclaimed Attah. "It's a wonderful place!"

"I didn't imagine any place could be like this, Uncle," said Asare. "Everything is so splendid. The roads are very wide and the buildings magnificent."

"Boys, don't get the wrong impression. Today you've seen the best parts of our city, but there are bad areas with buildings falling apart, narrow streets and insanitary conditions. However, these buildings are being demolished," said Mr. Appiah.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "According to Passage I, why was Mr. Appiah hot, tired, and dusty by late afternoon?",
    options: [
      "He had traveled on foot to bring his nephews from their distant village",
      "He had climbed to the topmost floors of the skyscrapers",
      "He had spent the entire day walking around Accra guiding his nephews on tour",
      "He had physically assisted the workers demolishing dilapidated structures"
    ],
    correctAnswer: "He had spent the entire day walking around Accra guiding his nephews on tour",
    hint: "Reread paragraph one: he had spent the whole day showing Asare and Attah around Accra on foot.",
    workedSolution: "Mr. Appiah was exhausted because he spent the entire day walking on foot guiding his visiting nephews around the sights of the capital city.",
    points: 1
  },
  {
    number: 2,
    prompt: "Where did Asare and Attah reside prior to their excursion to Accra in Passage I?",
    options: [
      "In the tall commercial skyscrapers",
      "In their rural country village",
      "In modern suburban bungalows",
      "In the landscaped public gardens"
    ],
    correctAnswer: "In their rural country village",
    hint: "Paragraph one notes that his nephews 'came from the village'.",
    workedSolution: "The narrative explicitly notes that the two boys had traveled from their rural village to visit Accra.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, the expression 'Everything is so splendid' means that everything is ............",
    options: [
      "merely satisfactory and adequate",
      "grand, magnificent, and strikingly impressive",
      "politically important to the nation",
      "radiantly illuminated with lights"
    ],
    correctAnswer: "grand, magnificent, and strikingly impressive",
    hint: "'Splendid' denotes magnificent, glorious, and grand in quality or appearance.",
    workedSolution: "'Splendid' means magnificent, grand, or impressive; 'grand, magnificent, and strikingly impressive' is its direct meaning.",
    points: 1
  },
  {
    number: 4,
    prompt: "According to Passage I, what daily transport habit is common among many successful urban gentlemen?",
    options: [
      "Walking extensive distances around the city center",
      "Commuting daily by public transport buses",
      "Driving everywhere in their private motorcars rather than walking",
      "Resting on public benches in the gardens"
    ],
    correctAnswer: "Driving everywhere in their private motorcars rather than walking",
    hint: "Check paragraph two: 'Like many other successful men, Mr. Appiah had acquired the habit of going everywhere in his car...'",
    workedSolution: "The passage notes that affluent professionals habitually drive their private cars everywhere and rarely walk on foot.",
    points: 1
  },
  {
    number: 5,
    prompt: "Which of the following assertions is NOT true according to Passage I?",
    options: [
      "Every single neighborhood across the capital city of Accra is splendid and luxurious",
      "Mr. Appiah routinely relies on his private automobile for movement",
      "Asare and Attah were experiencing the capital city for the first time",
      "The uncle and his nephews sat to rest on a bench in the public gardens"
    ],
    correctAnswer: "Every single neighborhood across the capital city of Accra is splendid and luxurious",
    hint: "Mr. Appiah cautions the boys that there are poor, crowded areas with narrow streets and insanitary conditions.",
    workedSolution: "Mr. Appiah explicitly corrects the boys by explaining that there are blighted slum areas falling apart; claiming that every part of the city is splendid is false.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage I, the term 'insanitary conditions' in the final paragraph refers to places that are ............",
    options: [
      "inhabited by mentally disordered individuals",
      "filthy, unhygienic, dirty, and hazardous to health",
      "experiencing extreme atmospheric heat",
      "unreported in public municipal newspapers"
    ],
    correctAnswer: "filthy, unhygienic, dirty, and hazardous to health",
    hint: "Sanitation deals with cleanliness and public hygiene. 'Insanitary' means unhygienic and dirty.",
    workedSolution: "'Insanitary' describes unhygienic, dirty, and polluted environments that harbor disease; 'filthy, unhygienic, dirty, and hazardous to health' is the exact equivalent.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage I, the word 'demolished' in 'these buildings are being demolished' means ............",
    options: [
      "renovated and re-roofed",
      "freshly painted with white wash",
      "pulled down and razed to the ground",
      "sold to private developers"
    ],
    correctAnswer: "pulled down and razed to the ground",
    hint: "To tear down, raze, or destroy dilapidated structures.",
    workedSolution: "'Demolished' means torn down, dismantled, or razed to the ground; 'pulled down and razed to the ground' is the direct synonym.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: THE AKOSOMBO DAM AND POWER
// ==========================================
const passage2Text = `The Akosombo Dam and the great Volta Lake are famous all over the world. The two main reasons for building the dam were to generate electricity and to use the electricity for the production of aluminium from bauxite. Aluminium is used throughout the world; so both the production of electricity and the production of aluminium are of great value to Ghana.

It may seem strange to talk about producing electricity by building a dam, but in fact a lot of dams have been built all over the world for this purpose. What happens is that a concrete wall, called a dam, is constructed across a river at a narrow point. A large lake then develops behind the wall. Tunnels are made in the dam so that water from the lake can rush fiercely through them. This powerful flow of water is used to drive huge machines called turbines, to generate electricity. All that the engineers need is the water rushing down from the lake, and all this costs them nothing! But of course the building of the dam and the fixing of the machines cost a great deal of money.

Big dams have been built in many parts of the world. The Akosombo Dam is one of the biggest. However, the lake which has been formed is in fact the biggest man-made lake in the world.`;

const passage2QuestionsRaw = [
  {
    number: 8,
    prompt: "According to Passage II, what were the primary statutory objectives behind constructing the Akosombo Dam?",
    options: [
      "To generate hydroelectric power and utilize it to smelt aluminum from bauxite ore",
      "To extract bauxite directly from the depths of the riverbed",
      "To build tourist holiday resorts along the riverbanks",
      "To supply drinking water exclusively to the city of Accra"
    ],
    correctAnswer: "To generate hydroelectric power and utilize it to smelt aluminum from bauxite ore",
    hint: "Reread paragraph one: 'to generate electricity and to use the electricity for the production of aluminium from bauxite.'",
    workedSolution: "The dam was constructed to generate hydroelectricity and use that electrical power to process local bauxite into aluminum.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, what raw natural mineral ore is refined to produce aluminum?",
    options: ["Concrete", "Bauxite", "Turbine rock", "Granite gravel"],
    correctAnswer: "Bauxite",
    hint: "Check paragraph one: 'production of aluminium from bauxite.'",
    workedSolution: "The text identifies 'bauxite' as the primary mineral resource mined and smelted into metallic aluminum.",
    points: 1
  },
  {
    number: 10,
    prompt: "Across the world, concrete river dams are constructed primarily to ............",
    options: [
      "extract mineral ores from inland reservoirs",
      "impound water under high pressure to drive turbines and generate electricity",
      "dredge river bottoms for commercial irrigation",
      "provide municipal treated drinking water"
    ],
    correctAnswer: "impound water under high pressure to drive turbines and generate electricity",
    hint: "Paragraph two explains that water rushing through tunnels drives massive turbines to produce electric power.",
    workedSolution: "Dams block rivers to create deep lakes whose rushing water turns mechanical turbines to generate electrical power.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which of the following assertions is NOT true according to Passage II?",
    options: [
      "The Akosombo Dam structure itself is the largest concrete dam in the world",
      "Both electricity generation and aluminum production are of enormous economic value to Ghana",
      "High-pressure water from the Volta Lake rushes through specialized intake tunnels",
      "The engineering infrastructure of the dam required heavy capital investment"
    ],
    correctAnswer: "The Akosombo Dam structure itself is the largest concrete dam in the world",
    hint: "Paragraph three states the dam is 'one of the biggest', but the *lake* is the biggest man-made lake.",
    workedSolution: "The passage notes that the Volta Lake is the biggest man-made lake in the world, while the dam is only 'one of the biggest'. Claiming the dam itself is the biggest in the world is false.",
    points: 1
  },
  {
    number: 12,
    prompt: "According to the operational details in Passage II, which statement is factually true?",
    options: [
      "Engineers dam rivers at their widest floodplain points",
      "The mechanical kinetic energy of rushing water is harnessed to generate electricity",
      "Constructing concrete dams and installing heavy turbines costs zero capital",
      "Hydroelectric power generation requires immense quantities of petroleum fuel"
    ],
    correctAnswer: "The mechanical kinetic energy of rushing water is harnessed to generate electricity",
    hint: "Rushing water turning turbines generates clean hydroelectric energy without burning fuel.",
    workedSolution: "The text explains that the force of water rushing through tunnels drives turbines to generate electricity.",
    points: 1
  },
  {
    number: 13,
    prompt: "Which of the following headings serves as the most suitable title for Passage II?",
    options: [
      "Bauxite Mining in Ghana",
      "Hydroelectric Power Generation from Water",
      "Global Shipping and River Dams",
      "Industrial Aluminium Smelting"
    ],
    correctAnswer: "Hydroelectric Power Generation from Water",
    hint: "The central thesis of the passage explains how dams block rivers to produce electricity using rushing water.",
    workedSolution: "The passage focuses on the technical principles and national value of building dams to generate electricity from rushing water; 'Hydroelectric Power Generation from Water' is the best title.",
    points: 1
  }
];

// ==========================================
// GENERAL LEXIS AND STRUCTURE (14 - 40)
// ==========================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (14 - 17) ---
  {
    number: 14,
    prompt: "Your woven fabric is inferior to what was imported from the textile factory. This means that your fabric is ............",
    options: [
      "of poor quality and lower standard",
      "exceptionally beautiful",
      "brightly colored",
      "costly and expensive"
    ],
    correctAnswer: "of poor quality and lower standard",
    hint: "Lower in rank, status, quality, or standard.",
    workedSolution: "'Inferior' means lower in quality or standard; 'of poor quality and lower standard' is its direct meaning.",
    points: 1
  },
  {
    number: 15,
    prompt: "The apprentice is a spendthrift who squandered all his savings on expensive shoes. This means he is ............",
    options: ["careless in work", "bold and audacious", "extravagant and wasteful with money", "benevolent and kind"],
    correctAnswer: "extravagant and wasteful with money",
    hint: "A person who spends money wastefully and extravagantly.",
    workedSolution: "'Spendthrift' describes an individual who spends money recklessly and wastefully; 'extravagant and wasteful with money' is its exact equivalent.",
    points: 1
  },
  {
    number: 16,
    prompt: "The basic school pupils often participate actively in communal activities. This means they assist in ............",
    options: [
      "all recreational sports",
      "intellectually interesting tasks",
      "shared public community activities",
      "routine personal chores"
    ],
    correctAnswer: "shared public community activities",
    hint: "Shared, collective, and belonging to the entire local community.",
    workedSolution: "'Communal' means shared by all members of a community; 'shared public community activities' is its direct definition.",
    points: 1
  },
  {
    number: 17,
    prompt: "The mouth-watering aroma of Auntie Mansa's soup made the guests hungry. This means the food ............",
    options: [
      "has a pleasant and appetizing smell",
      "is excessively hot to the taste",
      "contains expensive condiments",
      "is highly valuable"
    ],
    correctAnswer: "has a pleasant and appetizing smell",
    hint: "A distinctive, pervasive, and pleasant smell, typically of food or spices.",
    workedSolution: "'Aroma' refers specifically to a pleasant, savory smell; 'has a pleasant and appetizing smell' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: QUESTION TAGS & CLAUSES (18 - 25) ---
  {
    number: 18,
    prompt: "Kwame wasn't present at the scene of the vehicular collision, ......?",
    options: ["wasn't he", "isn't it", "did he", "was he"],
    correctAnswer: "was he",
    hint: "A negative past statement with 'wasn't' takes an affirmative tag: 'was he?'.",
    workedSolution: "The main clause has a negative past auxiliary ('wasn't'). The question tag must be affirmative: 'was he?'.",
    points: 1
  },
  {
    number: 19,
    prompt: "You don't understand the Chinese language, ......?",
    options: ["do you", "can you", "don't you", "won't you"],
    correctAnswer: "do you",
    hint: "A negative present statement with 'don't' takes an affirmative tag: 'do you?'.",
    workedSolution: "The statement contains a negative auxiliary ('don't'). Its corresponding question tag must be affirmative: 'do you?'.",
    points: 1
  },
  {
    number: 20,
    prompt: "We worked relentlessly during our final academic year, ......?",
    options: ["did we", "isn't it", "aren't we", "didn't we"],
    correctAnswer: "didn't we",
    hint: "The main verb 'worked' is affirmative simple past with subject 'we'. Form a negative tag with 'did'.",
    workedSolution: "The main clause is affirmative simple past ('worked'). The question tag must be negative: 'didn't we?'.",
    points: 1
  },
  {
    number: 21,
    prompt: "The national soccer squad have lost the championship match, ......?",
    options: ["didn't they", "isn't it", "haven't they", "is it"],
    correctAnswer: "haven't they",
    hint: "An affirmative present perfect clause with 'have' takes a negative tag using 'have'.",
    workedSolution: "The statement has an affirmative auxiliary ('have lost') with plural subject ('They'). The question tag must be negative: 'haven't they?'.",
    points: 1
  },
  {
    number: 22,
    prompt: "The burglar has stolen the carved wooden box ............",
    options: [
      "in which we kept the ancestral gold chain",
      "which we kept in the ancestral gold chain",
      "we kept the gold chain inside",
      "where we kept the ancestral gold chain"
    ],
    correctAnswer: "in which we kept the ancestral gold chain",
    hint: "Formal relative clause: The preposition 'in' precedes the relative pronoun 'which' modifying 'box'.",
    workedSolution: "Formal standard English requires the prepositional relative clause 'in which we kept...', correctly indicating containment inside the box.",
    points: 1
  },
  {
    number: 23,
    prompt: "...... hard the candidate tried, he could not solve the complex mathematical riddle.",
    options: ["Whatever", "How", "Whenever", "However"],
    correctAnswer: "However",
    hint: "Concessive adverb of degree modifying an adjective/adverb: 'However + hard + subject + verb'.",
    workedSolution: "'However' functions as a concessive adverb of degree ('However hard he tried...'), meaning 'no matter how hard'.",
    points: 1
  },
  {
    number: 24,
    prompt: "Akwetey completed the athletic cross-country race ............",
    options: [
      "even though he was severely fatigued",
      "during which he was severely fatigued",
      "but he was severely fatigued",
      "for which he was severely fatigued"
    ],
    correctAnswer: "even though he was severely fatigued",
    hint: "Identify the subordinating conjunction of concession that introduces an adverse condition.",
    workedSolution: "'Even though' is a subordinating conjunction of concession introducing a subordinate clause contrasting with the main achievement.",
    points: 1
  },
  {
    number: 25,
    prompt: "Basic school pupils are strictly forbidden ............",
    options: [
      "to walk at the lawn",
      "to be walking across the lawn",
      "walking across the lawn",
      "to walk across the lawn"
    ],
    correctAnswer: "to walk across the lawn",
    hint: "The passive verb 'are not allowed / forbidden' takes a full to-infinitive complement with 'across'.",
    workedSolution: "In standard English verb catenation, the passive 'not allowed' takes a to-infinitive followed by the directional preposition 'across' ('to walk across the lawn').",
    points: 1
  },

  // --- SECTION C (CONT.): PREPOSITIONS, PHRASALS & CONDITIONALS (26 - 35) ---
  {
    number: 26,
    prompt: "The entire congregation was deeply pleased ...... the visiting pastor's inspiring sermon.",
    options: ["for", "in", "with", "at"],
    correctAnswer: "with",
    hint: "Identify the preposition that regularly collocates with the adjective 'pleased' regarding an object or person.",
    workedSolution: "The adjective 'pleased' takes the preposition 'with' when expressing satisfaction with something ('pleased with the sermon').",
    points: 1
  },
  {
    number: 27,
    prompt: "The headmaster warmly congratulated the senior prefect ...... his academic triumph in the BECE.",
    options: ["on", "during", "at", "to"],
    correctAnswer: "on",
    hint: "Identify the preposition that regularly collocates with the verb 'congratulate'.",
    workedSolution: "In standard English, one 'congratulates' someone 'on' an achievement or milestone, never 'for' or 'at'.",
    points: 1
  },
  {
    number: 28,
    prompt: "The clinic patient is steadily recovering ...... his acute bout of typhoid fever.",
    options: ["from", "with", "for", "during"],
    correctAnswer: "from",
    hint: "Identify the preposition that regularly collocates with the verb 'recover'.",
    workedSolution: "The verb 'recover' takes the preposition 'from' when indicating the illness or injury being overcome ('recovering from his illness').",
    points: 1
  },
  {
    number: 29,
    prompt: "The boarders have resided in this dormitory facility ...... three continuous years now.",
    options: ["since", "in", "by", "for"],
    correctAnswer: "for",
    hint: "Use 'for' to denote a total duration of elapsed time, and 'since' for a specific starting point.",
    workedSolution: "The preposition 'for' is used to measure a duration or period of time ('for three years').",
    points: 1
  },
  {
    number: 30,
    prompt: "It would be utterly foolish to ...... the golden opportunity of studying abroad.",
    options: ["throw away", "throw in", "throw over", "throw by"],
    correctAnswer: "throw away",
    hint: "Identify the phrasal verb meaning to waste, discard, or fail to exploit a valuable opportunity.",
    workedSolution: "The phrasal verb 'to throw away' means to waste, squander, or discard an advantageous opportunity.",
    points: 1
  },
  {
    number: 31,
    prompt: "Koku grieved deeply over the loss of his mother, but with time he will ...... the sorrow.",
    options: ["get along", "get on", "get by", "get over"],
    correctAnswer: "get over",
    hint: "Identify the phrasal verb meaning to recover from an illness, shock, or grief.",
    workedSolution: "The phrasal verb 'to get over' means to overcome, recover from, or heal after an emotional shock or bereavement.",
    points: 1
  },
  {
    number: 32,
    prompt: "When you encounter technical jargon, ...... the definitions in an encyclopedia.",
    options: ["Look around", "Look on", "Look up", "Look about"],
    correctAnswer: "Look up",
    hint: "Identify the phrasal verb meaning to search for information in a reference dictionary or book.",
    workedSolution: "The phrasal verb 'to look up' means to consult a reference book to locate facts or definitions.",
    points: 1
  },
  {
    number: 33,
    prompt: "If the candidate ...... the municipal primary election, he would have become an assemblyman.",
    options: ["won", "has won", "had won", "should win"],
    correctAnswer: "had won",
    hint: "Third Conditional: 'would have become' in the main clause requires 'had + past participle' in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause takes the past perfect tense: 'had won'.",
    points: 1
  },
  {
    number: 34,
    prompt: "If Kofi continues to revise with dedication, he ...... his final examinations with flying colors.",
    options: ["will pass", "is passing", "has passed", "would pass"],
    correctAnswer: "will pass",
    hint: "First Conditional: Simple present in the if-clause ('continues') requires the future modal in the main clause.",
    workedSolution: "In a First Conditional sentence expressing a realistic future outcome, the main clause requires 'will + base verb': 'will pass'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The radio news broadcast concerning the industrial disaster ...... distressing.",
    options: ["are", "were", "has been", "was"],
    correctAnswer: "was",
    hint: "'News' is an uncountable noun that takes a singular verb, despite ending in '-s'.",
    workedSolution: "'News' is a singular non-count noun. In a past narrative frame, it requires the singular past copula 'was'.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (36 - 40) ---
  {
    number: 36,
    prompt: "The school management commended the tutors for a wonderful performance, but criticized the janitor for ...... work.",
    options: ["quick", "difficult", "big", "bad"],
    correctAnswer: "bad",
    hint: "'Wonderful' means exceptionally good and admirable. Find the word meaning substandard or poor.",
    workedSolution: "'Wonderful' means extraordinarily good. Its direct evaluative antonym in work performance is 'bad'.",
    points: 1
  },
  {
    number: 37,
    prompt: "While irresponsible youths indulge in narcotics abuse, disciplined students ...... such vices.",
    options: ["avoid", "increase", "discourage", "disallow"],
    correctAnswer: "avoid",
    hint: "'Indulge in' means to participate freely and excessively in an activity. Find the word meaning to shun or stay away from.",
    workedSolution: "'Indulge in' means to allow oneself to partake in a habit. Its direct behavioral antonym is 'avoid' (to shun or steer clear of).",
    points: 1
  },
  {
    number: 38,
    prompt: "Our grandmother prefers lean beef, whereas my father enjoys ...... meat.",
    options: ["uncooked", "fatty", "spoilt", "bloody"],
    correctAnswer: "fatty",
    hint: "'Lean' meat contains little or no fat. Find the word meaning containing abundant fat.",
    workedSolution: "'Lean' in meat describes meat having minimal or no fat. Its direct dietary antonym is 'fatty'.",
    points: 1
  },
  {
    number: 39,
    prompt: "The headmistress was reluctant to accept the truant's excuse, but ...... to assist the disciplined orphan.",
    options: ["willing", "afraid", "unable", "planning"],
    correctAnswer: "willing",
    hint: "'Reluctant' means hesitant and unwilling. Find the word meaning ready, inclined, and eager.",
    workedSolution: "'Reluctant' means unwilling or hesitant. Its direct opposite is 'willing' (ready and inclined).",
    points: 1
  },
  {
    number: 40,
    prompt: "The trade union executive decided to hold the scheduled congress, while management wanted them to ...... it.",
    options: ["continue", "delay", "cancel", "support"],
    correctAnswer: "cancel",
    hint: "'Hold' in reference to a meeting means to proceed with and conduct it. Find the word meaning to call off completely.",
    workedSolution: "'To hold' an event means to convene and conduct it. Its direct organizational antonym is 'cancel' (to call off).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199101);

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
const passage1Questions = balancedPaper1.slice(0, 7);
const passage2Questions = balancedPaper1.slice(7, 13);
const remainingQuestions = balancedPaper1.slice(13);

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
        prompt: "Your class teacher has punished you severely for an act of indiscipline that you did not commit. Write a formal letter of appeal to your Headmaster explaining the truth of what transpired and politely requesting that your disciplinary record be cleared.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 1991

The Headmaster
Methodist Junior Secondary School
P. O. Box 54
Bekwai

Dear Sir,

PETITION AGAINST UNJUST DISCIPLINARY SANCTION AND APPEAL FOR INVESTIGATION

I respectfully write to place before your high office a formal appeal regarding a severe disciplinary punishment imposed on me by my class teacher, Mr. J. K. Mensah, for an offense of which I am entirely innocent.

Yesterday morning, during the mid-morning changeover of periods, someone defaced the classroom blackboard with vulgar drawings and broke two wooden dual desks in Form Two Blue. Upon entering the room, Mr. Mensah discovered the damage. In a state of intense anger, he singled me out because I was standing near the blackboard and accused me of being the perpetrator. Despite my respectful protestations that I had just returned from delivering laboratory exercise books to the staff room, he refused to listen and sentenced me to two days of manual labor weeding the school football park.

I wish to state categorically that I had no hand in that act of vandalism. My science master, Mr. Emmanuel Osei, can confirm that I was in his office assisting him to sort test scripts during the entire ten-minute recess. Furthermore, two of my classmates, Kwaku Boateng and Samuel Addo, witnessed two Form Three students rushing out of our classroom moments before the teacher arrived.

I have always upheld exemplary moral discipline, having served as our classroom library monitor without blemish. Suffering this undeserved punishment publicly stains my academic reputation and causes me deep emotional distress.

I humbly appeal that your benevolent office investigate this incident, clear my name, and cancel the unwarranted punishment.

Thank you for your fatherly justice and consideration.

Yours faithfully,
[Signature]
Francisca Donkor
(Form Two Blue - Index No: 0204010054)`
      },
      {
        questionNumber: "2",
        category: "Informal / Persuasive Letter",
        prompt: "You wish to continue your education in a Senior Secondary School, but your parents, facing financial constraints, want you to terminate your education after basic school. Write a persuasive letter to an affluent relative explaining why you want to continue your studies and asking for financial sponsorship.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 1991

Dear Uncle Kwesi,

I hope this letter finds you in fine health, peace of mind, and thriving in your business enterprises in Accra. As I approach the conclusion of my final year in junior secondary school, I write to share an urgent personal crisis and to appeal for your benevolent financial sponsorship.

Recently, my parents informed me that due to recurring crop failures on our family cocoa farm, they cannot afford the financial expenditure required to enroll me in Senior Secondary School. They have suggested that I terminate my formal schooling and learn commercial tailoring in town. While I respect their domestic constraints, my heart is deeply broken because academic learning is my greatest passion.

Throughout my three years at Begoro Presbyterian JSS, I have consistently achieved academic distinction, placing first in my class in Mathematics, Integrated Science, and English. In the recently conducted regional mock examinations, I secured Aggregate Six. My teachers have affirmed that I possess the scholastic aptitude to pursue the General Science programme at Prempeh College and eventually study human medicine at the university.

Abandoning my schooling now would extinguish these dreams permanently. I humbly appeal to your generosity to sponsor my secondary school education—covering my boarding fees, uniforms, and textbooks. I promise to study with relentless diligence and secure distinction in the Senior Secondary Certificate Examination to justify your benevolence.

May the Almighty reward and expand your financial endeavors.

Your grateful nephew,
[Signature]
Emmanuel Addo`
      },
      {
        questionNumber: "3",
        category: "Descriptive Narrative",
        prompt: "Describe in vivid, colorful detail a bustling, crowded market scene in your town or village on an official market day.",
        modelAnswer: `A VIBRANT MARKET DAY AT BEGORO CENTRAL MARKET

Thursday is the official commercial market day in Begoro, and from the crack of dawn, our quiet rural town transforms into a kaleidoscope of radiant colors, pungent aromas, and deafening human clamor. Farmers, traders, and wholesale buyers from distant metropolises converge at the sprawling market square, eager to trade.

The market is an exhilarating sensory experience. Stalls and wooden sheds are arranged in bustling, narrow alleyways according to commodities. In the agricultural produce section, giant heaps of freshly harvested plantains, tubers of white yam, and baskets of scarlet garden eggs and tomatoes are displayed on jute sacks. Women traders with colorful headscarves shout catchy rhymes to advertise their wares, passionately haggling with buyers over the price of smoked river fish and dried bushmeat.

In another bustling lane, tailors operate rhythmic treadle sewing machines, while cloth merchants display dazzling yards of traditional kente prints and vibrant wax fabrics that flutter in the warm afternoon breeze. Head porters, popularly known as 'kayayei', balance enormous aluminum pans laden with yams on their heads, navigating the crowded passages with breathtaking balance while shouting "Agoo! Agoo!" to clear their path.

The air is filled with a rich blend of competing scents—roasted corn and groundnuts mingling with the sharp aroma of dried salted tilapia, fresh ginger, and fried plantain. Children run errands between stalls while the laughter of reunited friends echoes through the air.

As dusk settles and kerosene lanterns flicker to life, weary traders count their banknotes and pack their unsold wares. Begoro market is more than a commercial center; it is the beating heart of our community's culture and enterprise.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Write an engaging, realistic story that concludes with the sentence: \"I suddenly woke up and realised it was all a dream.\"",
        modelAnswer: `It was the eve of our national sports championship, and tension hung heavily over our dormitory. In my subconscious mind that night, a thrilling drama unfolded.

In the dream, I was standing on the Olympic-standard synthetic track of an enormous sports stadium packed with over fifty thousand cheering spectators. The afternoon sun sparkled off giant silver and gold trophies arrayed on the VIP dais. I looked down and found myself wearing the golden athletic vest of Ghana, laced with sleek spiked running shoes that felt as light as air.

The stadium announcer's voice boomed through the loudspeakers: "Finals of the Men's 100-Meter World Championship!" My heart pounded with excitement as I walked to lane four alongside towering international sprint champions. We crouched into our starting blocks in absolute, breathless silence. The starter raised his pistol.

Bang! The starter's gun fired. I surged out of the blocks with the speed of a cheetah. The wind roared past my ears as the crowd erupted into a deafening wall of sound. Fifty meters... seventy meters... eighty meters! I was running neck and neck with the world record holder. Digging my spikes deep into the rubber track, I lunged forward with every fiber of my muscle and crossed the white finish line inches ahead of my rivals.

Flashbulbs exploded everywhere. The stadium rose in a standing ovation as officials draped our national flag over my shoulders and handed me the golden world championship medal. The gold felt cool and solid in my hands.

Suddenly, a loud bell began clanging relentlessly. I blinked against the morning sunlight streaming through our dormitory window, clutching my pillow tightly to my chest. The prefect was ringing the rising bell. I suddenly woke up and realised it was all a dream.`
      }
    ]
  }
};

const flattenedPaper2Questions = paper2Calibrated.sectionA_essay.questions;

async function seedBeceEnglish1991Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1991 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1991");
  await docRef.set({
    year: 1991,
    title: "BECE English Language 1991 (Calibrated National Benchmark)",
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
          passageTitle: "Passage I: Sightseeing in Accra",
          text: passage1Text,
          questionRange: "Questions 1 to 7",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: The Akosombo Dam and Power",
          text: passage2Text,
          questionRange: "Questions 8 to 13",
          questions: passage2Questions
        }
      },
      // Sections B - D: Lexis, Synonyms, Structure, and Antonyms
      sectionB_to_D: {
        title: "Sections B - D: Lexis, Question Tags, Structure and Antonyms",
        questionRange: "Questions 14 to 40",
        questions: remainingQuestions
      },
      // Flat Sequences for test runners and compatibility
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

  console.log("✅ Calibrated & Passage-First BECE English 1991 successfully seeded into Firestore!");
}

seedBeceEnglish1991Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1991:", err);
    process.exit(1);
  });

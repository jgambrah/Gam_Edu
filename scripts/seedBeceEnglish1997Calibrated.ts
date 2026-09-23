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
// PASSAGE I: AKWASI SETH'S HOMECOMING
// ==========================================
const passage1Text = `When the car suddenly screeched to a halt sending tons of dust into the air, the children of the village ran helter-skelter. Then they rushed to Mr. Opiah's compound where the car had stopped. They were delighted to see a car again after a very long time and marvelled at its beauty.

Akwasi Seth, Mr. Opiah's eldest son, the darling boy of the village, had finally arrived. The day before, the gong-gong had been beaten to announce the arrival of the first son of the village who had gone to learn the ways of the white man. Everybody was prepared to give him a rousing welcome. Fervent preparations started there and then. However, the children's only anxiety was to see what the man had brought and listen to what he had to say.

Meanwhile, Mr. Opiah and his family, immaculately dressed and full of joy and anxiety, were seated in the house. There was great expectation written all over their faces. They had been told that their son would arrive at 7 a.m. but by 1 p.m. there was still no sign of him. So when they heard the screeching of the car, they all heaved sighs of relief. They were extremely happy when Akwasi Seth entered the compound. The women began to sing his praises.

Akwasi had not forgotten his culture. He went round shaking hands with everybody. When it was his father's turn, the old man hugged him beaming with smiles. His mother also hugged him and shed tears of joy.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "In Passage I, why did the village children initially scatter helter-skelter?",
    options: [
      "They were eagerly awaiting a vehicle",
      "They were startled by the sudden screeching halt and dust of the vehicle",
      "They had never seen a mechanical motorcar before",
      "The car was extraordinarily marvelous"
    ],
    correctAnswer: "They were startled by the sudden screeching halt and dust of the vehicle",
    hint: "Reread the opening sentence: the sudden screeching noise and cloud of dust startled them into running in all directions.",
    workedSolution: "The children ran in wild confusion because the unexpected, violent screeching stop of the car kicking up dust frightened them.",
    points: 1
  },
  {
    number: 2,
    prompt: "How did the entire community learn that Akwasi Seth would be arriving on that specific day in Passage I?",
    options: [
      "The vehicle parked directly in front of Mr. Opiah's house",
      "The traditional town crier had beaten the gong-gong to broadcast it",
      "Mr. Opiah had personally visited every household",
      "The children shouted the news across the village"
    ],
    correctAnswer: "The traditional town crier had beaten the gong-gong to broadcast it",
    hint: "Check paragraph two: 'The day before, the gong-gong had been beaten to announce the arrival...'",
    workedSolution: "The arrival was formally announced to the village the previous day by beating the traditional gong-gong.",
    points: 1
  },
  {
    number: 3,
    prompt: "Why were members of Mr. Opiah's household filled with anxiety while waiting inside the house?",
    options: [
      "Their son had delayed for six hours beyond his scheduled morning arrival time",
      "They were still organizing welcoming gifts for him",
      "They feared Akwasi Seth would no longer recognize his relatives",
      "They were astonished by how much he had changed"
    ],
    correctAnswer: "Their son had delayed for six hours beyond his scheduled morning arrival time",
    hint: "He was scheduled to arrive at 7 a.m., but by 1 p.m. he had still not appeared.",
    workedSolution: "The family was anxious because six hours had passed past his 7 a.m. expected arrival time without any word or sight of him.",
    points: 1
  },
  {
    number: 4,
    prompt: "According to Passage I, Akwasi Seth was ............",
    options: [
      "an unruly truant who avoided chores",
      "the only person who was immaculately dressed",
      "weeping bitterly on his knees",
      "the cherished and beloved native son of the community"
    ],
    correctAnswer: "the cherished and beloved native son of the community",
    hint: "He is described in paragraph two as 'the darling boy of the village'.",
    workedSolution: "The passage explicitly describes Akwasi Seth as 'the darling boy of the village', indicating he was deeply loved by everyone.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the word 'marvelled' in 'marvelled at its beauty' means ............",
    options: [
      "laughed boisterously",
      "gathered closely around",
      "wondered with great admiration",
      "entered inside"
    ],
    correctAnswer: "wondered with great admiration",
    hint: "To be filled with wonder, astonishment, or pleasant surprise.",
    workedSolution: "'Marvelled' means filled with wonder, astonishment, or admiration; 'wondered with great admiration' is the exact equivalent.",
    points: 1
  },
  {
    number: 6,
    prompt: "Why did Akwasi Seth's mother weep tears of joy upon seeing him?",
    options: [
      "Akwasi appeared sickly and pale",
      "She was suffering from physical pain",
      "She was overwhelmed with supreme happiness and relief",
      "Akwasi had forgotten his native tongue"
    ],
    correctAnswer: "She was overwhelmed with supreme happiness and relief",
    hint: "Tears of joy are shed when happiness and emotional relief are intensely felt.",
    workedSolution: "Shedding 'tears of joy' signifies an overwhelming emotional release of pure happiness, gratitude, and relief at seeing her son safely back.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: MASTER TWUM'S SCHOOL
// ==========================================
const passage2Text = `At the far end of the village beyond the houses, in its grounds, stood the village school, ruled over by the head teacher, Mr. Kodwo Twum. Surrounded by shady trees and with a large games field to one side, it was one of the best schools in the area.

Mr. Twum himself was a teacher of the old school, of the days when education had to be fought for, for the boys walked many kilometres for a chance to read and write. He was very strict, but was held in such esteem by both parents and teachers that no one resented his discipline. He took a personal interest in all his pupils and was affectionately known as "Master" by the big men in the city who had passed through his hands.

The ground round the school was always well kept and tidy, for cutting and weeding the grass was one of the punishments given to inattentive or insolent children. A small farm belonging to the school stretched down the hillside behind it and the children were taught the elements of farming as part of their lessons.

Master Twum's house was across the road from the school and next to that belonging to John Agyemang the catechist, so that the two men were often seen gossiping together in the evenings or going into the small village church to discuss parish affairs.`;

const passage2QuestionsRaw = [
  {
    number: 7,
    prompt: "According to Passage II, where was the village basic school situated?",
    options: [
      "On the outskirts beyond the village houses",
      "In the bustling commercial center of the town",
      "Directly behind the district palace",
      "In the middle of the residential streets"
    ],
    correctAnswer: "On the outskirts beyond the village houses",
    hint: "Reread the opening sentence: 'At the far end of the village beyond the houses...'",
    workedSolution: "The passage notes that the school was located at the far end of the community beyond the settlement, which corresponds to the outskirts.",
    points: 1
  },
  {
    number: 8,
    prompt: "According to Passage II, the school grounds were bordered and surrounded by ............",
    options: ["shady trees", "a bustling sports stadium", "other competing schools", "mud residential houses"],
    correctAnswer: "shady trees",
    hint: "Check paragraph one: 'Surrounded by shady trees and with large games field to one side...'",
    workedSolution: "The narrative describes the school compound as being surrounded by green, shady trees.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which of the following statements is NOT true concerning Mr. Kodwo Twum in Passage II?",
    options: [
      "He was revered and held in high esteem by parents",
      "He was a firm, strict disciplinarian",
      "He was widely hated and resented by the community",
      "He took a dedicated personal interest in all his pupils"
    ],
    correctAnswer: "He was widely hated and resented by the community",
    hint: "Paragraph two states that no one resented his discipline and he was held in high esteem.",
    workedSolution: "Mr. Twum was universally respected and admired; asserting that he was hated or resented by people is completely false.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'insolent' in 'inattentive or insolent children' means ............",
    options: ["ruffian", "stubbornly difficult", "disrespectful and rude", "habitually lazy"],
    correctAnswer: "disrespectful and rude",
    hint: "Showing a rude and arrogant lack of respect toward authority.",
    workedSolution: "'Insolent' means showing insolence, rudeness, or contemptuous disrespect; 'disrespectful and rude' is its exact equivalent.",
    points: 1
  },
  {
    number: 11,
    prompt: "Why were Master Twum and Catechist John Agyemang able to converse and fellowship together so frequently?",
    options: [
      "They were the only literate adults in the village",
      "They had abundant idle leisure time",
      "They lived as immediate next-door neighbors across from the school",
      "They were both full-time church administrators"
    ],
    correctAnswer: "They lived as immediate next-door neighbors across from the school",
    hint: "Look at paragraph four: Master Twum's house was next to that of the catechist across the road.",
    workedSolution: "Their frequent companionship was facilitated by geographical proximity: their residential houses were situated side by side.",
    points: 1
  }
];

// ==========================================
// GENERAL LEXIS AND STRUCTURE (12 - 40)
// ==========================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "The new accountant is exceptionally sincere in all her official financial dealings.\nChoose the word nearest in meaning to the underlined word 'sincere'.",
    options: ["free", "careful", "good", "honest"],
    correctAnswer: "honest",
    hint: "Free from pretense or deceit; truthful and genuine.",
    workedSolution: "'Sincere' means free from deceit or hypocrisy; 'honest' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The shoppers could not stand the foul scent emanating from the clogged gutter.\nChoose the word nearest in meaning to the underlined word 'scent'.",
    options: ["rush", "sight", "smell", "noise"],
    correctAnswer: "smell",
    hint: "A distinctive odor or aroma.",
    workedSolution: "'Scent' refers to an odor or olfactory impression; 'smell' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "My elder brother needs an apprentice to assist him complete the carpentry order.\nChoose the word nearest in meaning to the underlined word 'assist'.",
    options: ["help", "encourage", "join", "guide"],
    correctAnswer: "help",
    hint: "To give support, aid, or help in completing a task.",
    workedSolution: "'Assist' means to give support or aid to someone in undertaking work; 'help' is its direct equivalent.",
    points: 1
  },
  {
    number: 15,
    prompt: "The historic mud courthouse was demolished by the violent rainstorm.\nChoose the word nearest in meaning to the underlined word 'demolished'.",
    options: ["opened", "built", "destroyed", "painted"],
    correctAnswer: "destroyed",
    hint: "Pulled down, broken to pieces, or completely ruined.",
    workedSolution: "'Demolished' means torn down, razed, or shattered; 'destroyed' is its closest synonym.",
    points: 1
  },
  {
    number: 16,
    prompt: "The visiting tourists admired the calm and serene atmosphere of the coastal village.\nChoose the word nearest in meaning to the underlined word 'calm'.",
    options: ["neat", "good", "lovely", "peaceful"],
    correctAnswer: "peaceful",
    hint: "Tranquil, quiet, and free from disturbance or agitation.",
    workedSolution: "'Calm' describes an environment free from agitation, turmoil, or noise; 'peaceful' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "Ekua visits her aged grandmother in the village once in a blue moon. This means that Ekua visits her grandmother ............",
    options: ["every month", "once a week", "occasionally and very rarely", "quite often"],
    correctAnswer: "occasionally and very rarely",
    hint: "Very seldom; happening on rare occasions.",
    workedSolution: "The idiom 'once in a blue moon' means very rarely or on very infrequent occasions.",
    points: 1
  },
  {
    number: 18,
    prompt: "Joana is a brilliant scholar and will come out of her examinations with flying colours. This means that ............",
    options: [
      "she will pass in her favorite subjects only",
      "she will excel in a few subjects",
      "her examination results will be exceptionally good",
      "she will work harder next term"
    ],
    correctAnswer: "her examination results will be exceptionally good",
    hint: "Passing or succeeding with distinction and great honor.",
    workedSolution: "'With flying colours' is an idiom meaning with outstanding distinction, brilliance, or remarkable success.",
    points: 1
  },
  {
    number: 19,
    prompt: "The general manager hit the nail on the head regarding the causes of revenue decline. This means the manager ............",
    options: [
      "spoke the exact truth accurately",
      "was evasive and not straightforward",
      "criticized the workers harshly",
      "was displeased with the executive board"
    ],
    correctAnswer: "spoke the exact truth accurately",
    hint: "Identifying or describing a situation with precise accuracy.",
    workedSolution: "The idiom 'to hit the nail on the head' means to describe a situation with precise accuracy or state the exact truth.",
    points: 1
  },
  {
    number: 20,
    prompt: "Akosua agreed to attend the musical concert if Adjei would foot the bill. This means that she will attend if ............",
    options: [
      "Adjei escorts her there on foot",
      "the two of them travel together",
      "Adjei pays all her expenses",
      "she walks alongside her classmates"
    ],
    correctAnswer: "Adjei pays all her expenses",
    hint: "To settle or pay the entire financial cost of an undertaking.",
    workedSolution: "The idiom 'to foot the bill' means to pay the full financial expense or settle the account for something.",
    points: 1
  },
  {
    number: 21,
    prompt: "The traditional priest urged the two rival factions to bury the hatchet. This means they must ............",
    options: [
      "hide their farming implements in the barn",
      "collaborate on a communal farm",
      "forget their grievances and make peace",
      "bury their ancestral relics"
    ],
    correctAnswer: "forget their grievances and make peace",
    hint: "To cease fighting, settle a dispute, and reconcile.",
    workedSolution: "'To bury the hatchet' is an idiom meaning to end a conflict, forgive past offenses, and make peace.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "The reading hall was too dim for comfortable study, so we relocated to a ...... room.",
    options: ["bright", "shining", "clear", "lit"],
    correctAnswer: "bright",
    hint: "'Dim' means poorly illuminated. Find the word that denotes well supplied with light.",
    workedSolution: "'Dim' means lacking light or poorly lit. Its direct luminous antonym is 'bright' (well-illuminated).",
    points: 1
  },
  {
    number: 23,
    prompt: "The royal vault contains expensive ornaments, but the local market sells ...... beads.",
    options: ["beautiful", "cheap", "better", "fine"],
    correctAnswer: "cheap",
    hint: "'Expensive' means costing a high price. Find the word meaning low in price.",
    workedSolution: "'Expensive' means high-priced or costly. Its direct commercial antonym is 'cheap' (inexpensive).",
    points: 1
  },
  {
    number: 24,
    prompt: "The transit passengers assembled in the arrival hall while travelers awaiting boarding gathered in the ...... hall.",
    options: ["departure", "return", "acceptance", "common"],
    correctAnswer: "departure",
    hint: "'Arrival' means coming in. Find the word meaning leaving or taking off.",
    workedSolution: "'Arrival' denotes the act of reaching a terminal. Its direct logistical and operational antonym is 'departure' (leaving).",
    points: 1
  },
  {
    number: 25,
    prompt: "It is unlikely that the delayed coach will arrive today, but it is ...... that it will appear tomorrow.",
    options: ["similar", "credible", "close", "possible"],
    correctAnswer: "possible",
    hint: "'Unlikely' means improbable or not expected to happen. Find the word meaning capable of happening.",
    workedSolution: "'Unlikely' means improbable or doubtful. Its direct antonym regarding probability is 'possible' (or likely).",
    points: 1
  },
  {
    number: 26,
    prompt: "While this laboratory sample is made of artificial fibers, that traditional fabric is composed of ...... cotton.",
    options: ["new", "preserved", "wonderful", "natural"],
    correctAnswer: "natural",
    hint: "'Artificial' means human-made or synthetic. Find the word meaning produced by nature.",
    workedSolution: "'Artificial' denotes synthetic, man-made materials. Its direct antonym is 'natural' (derived from nature).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (27 - 40) ---
  {
    number: 27,
    prompt: "The senior master raised an objection ...... your participating in the regional debate.",
    options: ["on", "by", "at", "to"],
    correctAnswer: "to",
    hint: "The noun 'objection' and verb 'object' collocate with this specific preposition.",
    workedSolution: "In standard English grammar, both the verb 'object' and noun 'objection' take the preposition 'to' ('object to / objection to').",
    points: 1
  },
  {
    number: 28,
    prompt: "This confidential matter must remain strictly ...... you and me.",
    options: ["for", "with", "in", "between"],
    correctAnswer: "between",
    hint: "Use 'between' when connecting or sharing confidentiality between exactly two persons.",
    workedSolution: "'Between' is required when referring to a relationship, secret, or distribution connecting two entities ('between you and me'). Note the objective pronoun 'me'.",
    points: 1
  },
  {
    number: 29,
    prompt: "The benevolent patron presented a parcel of books to ...... in the graduating class.",
    options: ["all and each one", "all and everyone", "each and all", "each and everyone"],
    correctAnswer: "each and everyone",
    hint: "Identify the idiomatic emphatic pronoun phrase meaning every single individual without exception.",
    workedSolution: "The standard English emphatic coordinating phrase is 'each and everyone' (meaning every single person without exception).",
    points: 1
  },
  {
    number: 30,
    prompt: "Tokyo is reputed to be the ...... expensive metropolitan capital in the world.",
    options: ["most", "much", "more", "very"],
    correctAnswer: "most",
    hint: "Form the superlative degree of multi-syllable adjectives preceded by 'the'.",
    workedSolution: "Adjectives of three or more syllables ('expensive') form their superlative degree using 'most' preceded by 'the': 'the most expensive'.",
    points: 1
  },
  {
    number: 31,
    prompt: "You have to assist your aged parents with farm chores, ......?",
    options: ["have you", "you do", "isn't it", "don't you"],
    correctAnswer: "don't you",
    hint: "'Have to' functions as a semi-modal in the present simple, requiring a question tag formed with 'do'.",
    workedSolution: "In 'You have to...', 'have' functions as a lexical verb of obligation in the present simple. Its question tag is formed with 'do': 'don't you?'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The saloon vehicle my uncle purchased was the ......",
    options: [
      "model latest of the Benz",
      "Benz latest of the model",
      "latest model of the Benz",
      "latest Benz of the model"
    ],
    correctAnswer: "latest model of the Benz",
    hint: "Standard noun phrase word order: Superlative adjective ('latest') + Head noun ('model') + Prepositional modifier ('of the Benz').",
    workedSolution: "Correct noun phrase syntax places the superlative adjective before the head noun: 'the latest model of the Benz'.",
    points: 1
  },
  {
    number: 33,
    prompt: "I will wash my school uniform as soon as I ...... home from class.",
    options: ["went", "have gone", "could go", "go"],
    correctAnswer: "go",
    hint: "In future conditional and time clauses ('as soon as / when...'), use the simple present tense.",
    workedSolution: "Adverbial time clauses referring to future events use the simple present tense ('when I go home'), rather than a future or past form.",
    points: 1
  },
  {
    number: 34,
    prompt: "She maintains a remarkably cheerful disposition ...... she is an orphaned child.",
    options: ["since", "as", "though", "even"],
    correctAnswer: "though",
    hint: "Identify the subordinating conjunction of concession that introduces a contrasting circumstance.",
    workedSolution: "'Though' (or 'although') is a subordinating conjunction of concession connecting two contrasting propositions.",
    points: 1
  },
  {
    number: 35,
    prompt: "If you ...... more attentive during the demonstration, you wouldn't have been in this predicament.",
    options: ["are", "were", "had been", "could"],
    correctAnswer: "had been",
    hint: "Third Conditional: 'wouldn't have been' in the main clause requires the past perfect in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause requires 'had + past participle' ('had been').",
    points: 1
  },
  {
    number: 36,
    prompt: "Kwabena often ...... his grandparents in the village after school hours.",
    options: ["had visited", "visited", "has visited", "visits"],
    correctAnswer: "visits",
    hint: "Singular third-person subject ('Kwabena') with a habitual frequency adverb ('often') takes a simple present verb.",
    workedSolution: "The singular subject 'Kwabena' combined with the frequency adverb 'often' expressing a habitual routine requires the simple present inflection 'visits'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The farmer had saved ...... money to sponsor his daughter through nursing college.",
    options: ["few", "enough", "most", "plenty"],
    correctAnswer: "enough",
    hint: "'Money' is an uncountable noun. Choose the determiner meaning a sufficient quantity.",
    workedSolution: "'Enough' functions as a determiner of sufficiency modifying the non-count noun 'money' ('enough money'). 'Few' applies only to count nouns.",
    points: 1
  },
  {
    number: 38,
    prompt: "This mathematical compass is mine; that one on the desk is ......",
    options: ["your's", "your", "yours", "yours'"],
    correctAnswer: "yours",
    hint: "Absolute possessive pronouns never take an apostrophe.",
    workedSolution: "'Yours' is an absolute possessive pronoun and never takes an apostrophe. Forms such as 'your's' or 'yours'' are ungrammatical.",
    points: 1
  },
  {
    number: 39,
    prompt: "\"Birds fly, don't they?\"\n\"............\"",
    options: ["Yes, they don't", "No, they do", "Yes, they do", "Yes, they can't"],
    correctAnswer: "Yes, they do",
    hint: "Standard English polarity: An affirmative confirmation of a fact uses 'Yes' paired with a positive auxiliary.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199701);

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

// Partition Questions for Passage-First Rendering
const passage1Questions = balancedPaper1.slice(0, 6);
const passage2Questions = balancedPaper1.slice(6, 11);
const remainingQuestions = balancedPaper1.slice(11);

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
        prompt: "You have been offered admission into a Senior Secondary School, but financial and domestic hardships have prevented you from reporting on the scheduled reopening date. Write a letter to the headmaster explaining your predicament and politely requesting a brief extension of time to report.",
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

Recently, our family was struck by a severe economic misfortune when our father's commercial cocoa barn was accidentally gutted by a bushfire, destroying our entire seasonal harvest. Consequently, my parents have had to scramble to mobilize funds to pay for my boarding house fees, prescribed uniforms, and science textbooks. My father has negotiated a modest agricultural loan from the local cooperative credit union, which will be disbursed by the end of next week.

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

async function seedBeceEnglish1997Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1997 into Firestore...");

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
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      // Section A: Passage-First Comprehension Architecture
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Akwasi Seth's Homecoming",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: Master Kodwo Twum's School",
          text: passage2Text,
          questionRange: "Questions 7 to 11",
          questions: passage2Questions
        }
      },
      // Sections B - E: Lexis, Synonyms, Idioms, Antonyms, and Structure
      sectionB_to_E: {
        title: "Sections B - E: Lexis, Idioms, Antonyms and Structure",
        questionRange: "Questions 12 to 40",
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

  console.log("✅ Calibrated & Passage-First BECE English 1997 successfully seeded into Firestore!");
}

seedBeceEnglish1997Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1997:", err);
    process.exit(1);
  });

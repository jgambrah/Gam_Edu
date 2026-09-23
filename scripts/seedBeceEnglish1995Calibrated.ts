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
// PASSAGE I: THE MUSICAL PERFORMANCE OF SONGBIRDS
// ==========================================
const passage1Text = `Where is the musical performance of songbirds held? It is not in any concert hall but rather on trees, fences and telephone wires. It is from these places that little feathered creatures blend their voices in some of the most melodious songs sung in the world.

Songbirds do not just make noise. The male voices in the choir, for instance, have two different messages. Firstly, it is a warning to other males not to come near their partners. Secondly, it is an invitation from the bachelors to the female birds. The most interesting songs which are sung with a lot of vigour are produced during the breeding season by the males to impress the lady birds.

Songbirds are very remarkable. They sing three or four notes at a time. To the human ear it sounds like one beat but the birds can identify the different notes because of their keen sense of hearing. At times, what is heard may not be a song of our winged friends but simply an instruction to keep the flock together. It may also be a warning of an approaching danger.

Just how birds compose their songs is an interesting subject. Some birds have their songs fixed in their brains at birth. Whilst some imitate others, other birds try to compose songs which are unique. They will never copy what they hear others sing.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "According to Passage I, members of the chorus can sing without any difficulty because they ............",
    options: [
      "have to sing",
      "easily learn to sing",
      "have good songs",
      "are born good singers"
    ],
    correctAnswer: "are born good singers",
    hint: "Reread paragraph four: 'Some birds have their songs fixed in their brains at birth.'",
    workedSolution: "The passage explains that birds do not struggle to sing because singing ability is innate and biologically fixed in their brains at birth.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, the male songbirds sing primarily to ............",
    options: [
      "encourage others",
      "attract the females",
      "entertain others",
      "praise nature"
    ],
    correctAnswer: "attract the females",
    hint: "Check paragraph two: the songs serve as 'an invitation from the bachelors to the female birds' and 'to impress the lady birds'.",
    workedSolution: "Male songbirds produce vigorous songs as courtship calls to attract and impress female birds during the breeding season.",
    points: 1
  },
  {
    number: 3,
    prompt: "According to Passage I, the most interesting songs are produced ............",
    options: [
      "during competitions",
      "in the morning",
      "during mating periods",
      "in the evening"
    ],
    correctAnswer: "during mating periods",
    hint: "Look at paragraph two: 'produced during the breeding season by the males to impress the lady birds.'",
    workedSolution: "The breeding season corresponds directly to mating periods when males exert maximum vocal energy to court partners.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the word 'unique' in 'compose songs which are unique' means ............",
    options: ["suitable", "similar", "exciting", "special"],
    correctAnswer: "special",
    hint: "The text says 'They will never copy what they hear others sing,' meaning one of a kind and distinct.",
    workedSolution: "'Unique' means one of a kind, original, or distinct; among the options, 'special' best captures this sense.",
    points: 1
  },
  {
    number: 5,
    prompt: "According to the passage, which of the following is true? Birds ............",
    options: [
      "are impressive",
      "are awesome",
      "make too much noise",
      "are ridiculous"
    ],
    correctAnswer: "are impressive",
    hint: "The passage notes that songbirds are 'very remarkable', singing 3 or 4 notes simultaneously to impress females.",
    workedSolution: "The author portrays songbirds as remarkable creatures capable of extraordinary musical feats that are truly impressive.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: THE DESCENT OF THE LOCUSTS
// ==========================================
const passage2Text = `"Locusts are descending" was joyfully chanted everywhere. Men, women and children left their work or their play and ran into the open to see the unfamiliar sight. The locusts had not come for many years, and only the old people had seen them before.

At first, a fairly small swarm came. And then, there appeared a slow-moving mass like a sheet of black cloud drifting towards the villages. Soon it covered half the sky. It was an amazing sight full of power and beauty.

Everyone was now about praying that the locust should stay in the village for the night. Although most people had never seen locusts before, they knew by instinct that they were good to eat. At last they descended. They settled on roofs and covered the bare ground. Tree branches broke under them and the whole village turned to brown earth colour with locusts.

Many people who went out with baskets trying to catch them were advised to wait until nightfall. And they were right. The locusts settled in the bushes for the night and their wings became wet with dew. Then all the village folks turned out, in spite of the cold harmattan, to fill their bags and pots with locusts. The next morning they were roasted and spread in the sun until they became dry. For many days after, this rare food was mixed with oil and eaten with relish.`;

const passage2QuestionsRaw = [
  {
    number: 6,
    prompt: "In Passage II, most of the village people were excited about the coming of the locusts because they ............",
    options: [
      "were moving slowly",
      "had come in a swarm",
      "were not common",
      "had covered the sky"
    ],
    correctAnswer: "were not common",
    hint: "Reread paragraph one: 'The locusts had not come for many years, and only the old people had seen them before.'",
    workedSolution: "The arrival excited everyone because locust swarms were an unfamiliar and rare phenomenon that had not occurred in decades.",
    points: 1
  },
  {
    number: 7,
    prompt: "Why was it easier to catch the locusts in the night according to Passage II? Because the locusts ............",
    options: [
      "could not fly",
      "were settling down",
      "did not like darkness",
      "were feeling sleepy"
    ],
    correctAnswer: "could not fly",
    hint: "Check paragraph four: 'their wings became wet with dew', which grounded them and prevented flight.",
    workedSolution: "Nighttime dew soaked their delicate wings, rendering the locusts heavy and unable to fly away from collectors.",
    points: 1
  },
  {
    number: 8,
    prompt: "According to Passage II, the locusts were ............",
    options: ["brown", "black", "blind", "bold"],
    correctAnswer: "brown",
    hint: "Check paragraph three: 'and the whole village turned to brown earth colour with locusts.'",
    workedSolution: "The author explicitly describes the village taking on a 'brown earth colour' due to the vast blanket of brown locusts.",
    points: 1
  },
  {
    number: 9,
    prompt: "In Passage II, the phrase 'turned out' in 'all the village folks turned out' means ............",
    options: ["played outside", "slept out", "cried aloud", "came out"],
    correctAnswer: "came out",
    hint: "Gathering and emerging from homes into the open in large numbers.",
    workedSolution: "The phrasal verb 'turned out' means to assemble, emerge, or come out in a group for an activity.",
    points: 1
  },
  {
    number: 10,
    prompt: "Which of the following expressions from Passage II indicates that there were a vast number of locusts?",
    options: [
      "amazing sight",
      "fairly small swarm",
      "unfamiliar sight",
      "slow-moving mass"
    ],
    correctAnswer: "slow-moving mass",
    hint: "Look for the metaphor describing a massive, sky-covering cloud.",
    workedSolution: "'Slow-moving mass' describing a cloud covering half the sky directly conveys the enormous volume and density of the locusts.",
    points: 1
  },
  {
    number: 11,
    prompt: "According to Passage II, which of the following statements is NOT true?",
    options: [
      "Locusts are delicious",
      "Only the aged knew about the locusts",
      "The locusts come only in the dry season",
      "The locusts created a beautiful sight"
    ],
    correctAnswer: "The locusts come only in the dry season",
    hint: "Find the assertion not supported or verified by the narrative text.",
    workedSolution: "The passage notes that the harmattan was present, but never claims that locusts appear exclusively during the dry season.",
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
    prompt: "The government has banned the use of hard drugs in the country.\nChoose the word nearest in meaning to the underlined word 'banned'.",
    options: ["destroyed", "forbidden", "controlled", "reduced"],
    correctAnswer: "forbidden",
    hint: "Officially prohibited or made illegal by state authority.",
    workedSolution: "'Banned' means officially prohibited or outlawed; 'forbidden' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "Our Headmaster invited many prominent citizens to our speech day.\nChoose the word nearest in meaning to the underlined word 'prominent'.",
    options: ["known", "popular", "distinguished", "good"],
    correctAnswer: "distinguished",
    hint: "Important, eminent, and held in high public esteem.",
    workedSolution: "'Prominent' refers to individuals of high standing, eminence, or renown; 'distinguished' is its closest synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The dry season is imminent.\nChoose the word nearest in meaning to the underlined word 'imminent'.",
    options: ["very close", "partly over", "severe", "gone"],
    correctAnswer: "very close",
    hint: "About to happen at any moment; impending.",
    workedSolution: "'Imminent' means impending or likely to occur very soon; 'very close' is its direct definition.",
    points: 1
  },
  {
    number: 15,
    prompt: "The meeting was postponed to another date.\nChoose the word nearest in meaning to the underlined word 'postponed'.",
    options: ["cancelled", "removed", "called", "shifted"],
    correctAnswer: "shifted",
    hint: "Rescheduled or moved to a later time.",
    workedSolution: "'Postponed' means delayed or rescheduled to a later date; 'shifted' is its closest equivalent here.",
    points: 1
  },
  {
    number: 16,
    prompt: "The man was furious when his son failed the examination.\nChoose the word nearest in meaning to the underlined word 'furious'.",
    options: ["angry", "anxious", "shocked", "frightened"],
    correctAnswer: "angry",
    hint: "Extremely enraged or expressing fierce displeasure.",
    workedSolution: "'Furious' means violently angry or full of fury; 'angry' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 20) ---
  {
    number: 17,
    prompt: "By the end of the lesson, we were completely at sea. This means that we were ............",
    options: ["fast asleep", "totally confused", "quite disturbed", "very inspired"],
    correctAnswer: "totally confused",
    hint: "Perplexed, bewildered, or unable to understand what is being taught.",
    workedSolution: "The idiom 'at sea' means completely lost, perplexed, or bewildered; 'totally confused' is the exact meaning.",
    points: 1
  },
  {
    number: 18,
    prompt: "She did her best to keep on the right side of her teacher. This means she did her best not to ...... her teacher.",
    options: ["interrupt", "mislead", "misunderstand", "offend"],
    correctAnswer: "offend",
    hint: "Remaining in someone's good graces and avoiding irritating or displeasing them.",
    workedSolution: "To 'keep on the right side of someone' means to maintain their favor and goodwill by taking care not to annoy or offend them.",
    points: 1
  },
  {
    number: 19,
    prompt: "You shouldn't have hit Kuuku so hard; it was rather unkind of you. From this we know that Kuuku was ............",
    options: ["being naughty", "hurt", "kind", "hit"],
    correctAnswer: "hit",
    hint: "Identify the indisputable, stated factual event in the sentence.",
    workedSolution: "The statement unequivocally confirms that the physical action took place: Kuuku was definitely 'hit'.",
    points: 1
  },
  {
    number: 20,
    prompt: "If we hadn't gone to the beach so early, we would have met our visitor. This means that ............",
    options: [
      "we went to the beach late",
      "we did not meet our visitor",
      "our visitor waited for us",
      "we met our visitor at the beach"
    ],
    correctAnswer: "we did not meet our visitor",
    hint: "Counterfactual conditional: The past condition was fulfilled, leading to a missed opportunity.",
    workedSolution: "The past conditional implies the real outcome: because they left early for the beach, they missed and did not meet their visitor.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "There are guards on our border because the government wants to eliminate smuggling.\nChoose the word most nearly opposite in meaning to 'eliminate'.",
    options: ["notice", "manage with", "encourage", "investigate"],
    correctAnswer: "encourage",
    hint: "'Eliminate' means to eradicate or stamp out. Find the word meaning to foster or promote.",
    workedSolution: "'Eliminate' means to remove, eradicate, or eradicate. Its direct antonym is 'encourage' (to foster or promote).",
    points: 1
  },
  {
    number: 22,
    prompt: "The candidate worked the problem with a great deal of precision.\nChoose the word most nearly opposite in meaning to 'precision'.",
    options: ["sense", "energy", "inaccuracy", "detail"],
    correctAnswer: "inaccuracy",
    hint: "'Precision' means exactness and meticulous accuracy. Find the word denoting errors or mistakes.",
    workedSolution: "'Precision' denotes exact correctness and precision. Its direct antonym is 'inaccuracy'.",
    points: 1
  },
  {
    number: 23,
    prompt: "My grandmother likes old fashioned clothes.\nChoose the word most nearly opposite in meaning to 'old fashioned'.",
    options: ["special", "decorated", "modern", "stylish"],
    correctAnswer: "modern",
    hint: "'Old-fashioned' means antiquated or from a bygone era. Find the word meaning contemporary or current.",
    workedSolution: "'Old-fashioned' means outdated or traditional. Its direct chronological antonym is 'modern'.",
    points: 1
  },
  {
    number: 24,
    prompt: "I am going to arrange the books in the cupboard.\nChoose the word most nearly opposite in meaning to 'arrange'.",
    options: ["display", "scatter", "list", "spill"],
    correctAnswer: "scatter",
    hint: "'Arrange' means to set in neat, orderly positions. Find the word meaning to disperse haphazardly.",
    workedSolution: "'Arrange' means to place in methodical order. Its direct opposite is 'scatter' (to throw loosely in all directions).",
    points: 1
  },
  {
    number: 25,
    prompt: "Most of the men were sacked by the company.\nChoose the word most nearly opposite in meaning to 'sacked'.",
    options: ["used", "punished", "warned", "employed"],
    correctAnswer: "employed",
    hint: "'Sacked' means dismissed from employment. Find the word meaning hired or given a job.",
    workedSolution: "'Sacked' means terminated or fired from a job. Its direct vocational antonym is 'employed' (hired).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "It's a pity I have hardly ...... food to give you.",
    options: ["a little", "too much", "some", "any"],
    correctAnswer: "any",
    hint: "The semi-negative adverb 'hardly' requires a non-assertive quantifier.",
    workedSolution: "'Hardly' conveys a negative sense ('almost no'), which in standard English pairs grammatically with 'any'.",
    points: 1
  },
  {
    number: 27,
    prompt: "I was given ...... money than you were given.",
    options: ["much more", "many", "much", "many more"],
    correctAnswer: "much more",
    hint: "'Money' is an uncountable noun requiring a mass quantifier modified for comparison with 'than'.",
    workedSolution: "Non-count nouns like 'money' take comparative mass quantifiers: 'much more money than'. 'Many' is restricted to count nouns.",
    points: 1
  },
  {
    number: 28,
    prompt: "The book you gave me was not ...... than the one I had before.",
    options: ["any better", "much better", "any good", "very better"],
    correctAnswer: "any better",
    hint: "In negative comparative clauses ('was not... than'), use this idiomatic comparative degree phrase.",
    workedSolution: "In negative clauses with a comparative degree, 'not any better than' is the standard idiomatic construction.",
    points: 1
  },
  {
    number: 29,
    prompt: "Are you sure ...... shirts on that table were the ones I gave you?",
    options: ["that", "these", "those", "some"],
    correctAnswer: "those",
    hint: "Use the plural demonstrative determiner referring to objects located at a distance ('on that table').",
    workedSolution: "The plural noun 'shirts' located away from the speaker ('on that table') takes the distal demonstrative determiner 'those'.",
    points: 1
  },
  {
    number: 30,
    prompt: "Give me the book ...... I lent you yesterday.",
    options: ["whom", "what", "whose", "which"],
    correctAnswer: "which",
    hint: "Use the relative pronoun that refers to inanimate objects ('the book').",
    workedSolution: "'Which' (or 'that') is the appropriate relative pronoun for referring to non-human objects and items like 'the book'.",
    points: 1
  },
  {
    number: 31,
    prompt: "Of the three girls, Awo is the ......",
    options: ["shorter", "more shortest", "most short", "shortest"],
    correctAnswer: "shortest",
    hint: "When comparing three or more entities, grammar mandates the superlative degree.",
    workedSolution: "Comparison among three or more items ('of the three girls') requires the superlative form with -est: 'the shortest'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The soldier was promoted because he was the ...... among the lot.",
    options: [
      "most courageous",
      "courageous",
      "more courageous",
      "much courageous"
    ],
    correctAnswer: "most courageous",
    hint: "Superlative degree of a multi-syllable adjective preceded by 'the' when comparing a group.",
    workedSolution: "When distinguishing one individual above an entire group ('among the lot'), the superlative degree ('the most courageous') is required.",
    points: 1
  },
  {
    number: 33,
    prompt: "Your nephew could not pass the interview because he was not ...... before the panel members.",
    options: [
      "confident much",
      "confident quite",
      "confident enough",
      "confident somehow"
    ],
    correctAnswer: "confident enough",
    hint: "The adverb of sufficiency 'enough' is positioned immediately after the adjective it modifies.",
    workedSolution: "In English grammar, 'enough' post-modifies adjectives ('confident enough'), never precedes them or pairs awkwardly with 'much'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Mr. Amakye has been robbed ...... his property.",
    options: ["from", "for", "by", "of"],
    correctAnswer: "of",
    hint: "Identify the preposition that collocates with 'rob someone ... something'.",
    workedSolution: "The standard English verbal collocation is 'to rob someone of something'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The patient went ...... a lot of body exercises.",
    options: ["in out", "out", "through", "ahead"],
    correctAnswer: "through",
    hint: "Identify the phrasal verb meaning to undergo, complete, or endure a regimen.",
    workedSolution: "The phrasal verb 'to go through' means to undergo, perform, or experience a series of activities or exercises.",
    points: 1
  },
  {
    number: 36,
    prompt: "Can I have a chat ...... you?",
    options: ["to", "with", "by", "on"],
    correctAnswer: "with",
    hint: "Identify the preposition of mutual conversation that collocates with 'chat'.",
    workedSolution: "In conversational English, one has a chat 'with' someone, denoting mutual, two-way interaction.",
    points: 1
  },
  {
    number: 37,
    prompt: "Kwesi learnt harder so he ...... the examination.",
    options: ["passed", "would have passed", "can pass", "passes"],
    correctAnswer: "passed",
    hint: "Consistent past tense sequence of cause and effect: 'learnt harder so he [past verb]'.",
    workedSolution: "The narrative clause establishes a completed past event ('learnt harder'), requiring the simple past indicative 'passed' to express the achieved result.",
    points: 1
  },
  {
    number: 38,
    prompt: "Let's go out and play, ......?",
    options: ["will we", "do we", "would we", "shall we"],
    correctAnswer: "shall we",
    hint: "Imperative cohortative proposals beginning with 'Let's' invariably take this question tag.",
    workedSolution: "First-person plural proposals beginning with 'Let's' (let us) take the canonical question tag 'shall we?'.",
    points: 1
  },
  {
    number: 39,
    prompt: "Can I come to your house on Saturday, ......?",
    options: ["all right", "of course", "certainly", "please"],
    correctAnswer: "please",
    hint: "Polite discourse marker used to soften a personal request.",
    workedSolution: "'Please' functions as a polite closing marker for questions soliciting permission or hospitality.",
    points: 1
  },
  {
    number: 40,
    prompt: "\"You aren't hungry, are you?\"\n\"............\"",
    options: [
      "No, you aren't",
      "Yes, I am not",
      "No, I am not",
      "No, I am"
    ],
    correctAnswer: "No, I am not",
    hint: "In standard English polarity, confirming a negative truth requires 'No' paired with a negative verb.",
    workedSolution: "To confirm that you are indeed not hungry, standard English requires matching negative polarity: 'No, I am not.'",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199501);

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
const passage1Questions = balancedPaper1.slice(0, 5);
const passage2Questions = balancedPaper1.slice(5, 11);
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
        category: "Informal Letter",
        prompt: "You do not want to go to a boarding school. Write a letter to your sister who is in another town giving her three reasons why you will like to go to a day school.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Koforidua, Eastern Region
12th June, 1995

Dear Sister Mansa,

I hope this letter finds you in good health and flourishing in your nursing career in Kumasi. As our BECE results will be released soon, Father and Mother have been encouraging me to choose a boarding school. However, after deep reflection, I have resolved that attending a day school is the best choice for me. I am writing to share three convincing reasons for this decision and to appeal for your support in persuading our parents.

First and foremost, attending a day school will significantly alleviate the financial burden on our family. Boarding fees—including charges for feeding, boarding house maintenance, and bulky trunk purchases—are exorbitant. By living at home and commuting daily to a local secondary school, our parents can save substantial funds to cater for my textbooks, stationery, and extra tuition, while ensuring my younger siblings' school fees are paid promptly.

Secondly, remaining at home guarantees me wholesome, nutritious home-cooked meals and superior healthcare. In boarding houses, food rations are notoriously meager and unpalatable, leading many students to suffer from malnutrition and chronic ulcers. Living under Mother's watchful care will ensure I eat balanced meals and receive immediate medical attention whenever I feel unwell.

Finally, staying at home provides a calm, disciplined environment free from the menace of senior bullying and nighttime disturbances common in boarding dormitories. I can study peacefully at my desk without fear of harassment.

Please talk to Father on my behalf during your upcoming weekend visit.

Your loving brother,
[Signature]
Kofi Boateng`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "As the Head Prefect of your school, write a letter to the Chairman of your Parent-Teacher Association telling him about two problems in the school which you want the Association to help solve.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 36
Abetifi-Kwahu, Eastern Region
24th October, 1995

The Chairman
Parent-Teacher Association
Presbyterian JSS
Abetifi-Kwahu

Dear Sir,

PETITION REGARDING ACUTE WATER SHORTAGE AND INADEQUATE CLASSROOM FURNITURE

On behalf of the entire student body of Presbyterian Junior Secondary School, I respectfully write to congratulate the executive committee on your continued dedication to our welfare and to draw your urgent attention to two critical problems that severely impede teaching and learning in our school.

First, our school suffers from a persistent shortage of potable drinking water. Our mechanized borehole broke down four months ago, compelling students to trek over two kilometers daily during instructional hours to fetch untreated water from a nearby stream. This chore causes chronic fatigue, widespread lateness, and frequent outbreaks of water-borne illnesses such as typhoid and dysentery. We earnestly appeal to the PTA to finance the replacement of the borehole pump and install two poly-tanks for rainwater harvesting.

Secondly, our classrooms face a severe deficit of dual desks and tables. Over seventy students currently sit on bare concrete floors or perch uncomfortably on broken wooden benches during lessons. This unacceptable condition causes physical discomfort, ruins school uniforms, and produces poor, illegible handwriting among candidates preparing for national examinations. Constructing fifty new dual desks will restore dignity and academic focus to our classrooms.

We trust in your paternal benevolence to deliberate on these pressing needs at your upcoming executive meeting.

Thank you.

Yours faithfully,
[Signature]
Emmanuel Kwabena Osei
(Head Prefect)`
      },
      {
        questionNumber: "3",
        category: "Descriptive / Expository Essay",
        prompt: "Describe how your favorite game is played. Give two reasons why you like it.",
        modelAnswer: `THE NOBLE GAME OF TABLE TENNIS: RULES AND ENDURING APPEAL

Among the diverse sporting activities played in basic schools, table tennis stands out as my undisputed favorite game. It is a fast-paced, highly engaging indoor sport that tests agility, hand-eye coordination, and strategic reflexes.

Table tennis is played between two competing players in a singles match or four players in doubles, on a hard rectangular table divided equally by a six-inch net. Each player holds a wooden racket laminated with rubber to strike a lightweight, hollow celluloid ball across the net. The match commences with a service: the server must toss the ball upward at least six inches from an open palm and strike it so that it bounces once on their own side before bouncing on the opponent's side. The receiver must then return the ball over the net before it bounces twice. A rally continues until a player fails to return the ball correctly, hits it off the table, or allows it to touch the net without crossing. Points are scored on every rally, and the first player to accumulate twenty-one points with a two-point margin wins the game.

I am deeply fond of table tennis for two major reasons. First, it provides exceptional cardiovascular exercise and sharpens mental concentration without exposing players to violent physical collisions, unlike football. It demands lightning-fast decision-making within milliseconds.

Secondly, table tennis is remarkably convenient and weather-resistant. Because it is played indoors, training sessions are never disrupted by heavy tropical rainstorms or scorching midday heat. Playing this noble sport keeps me physically fit, disciplined, and mentally alert.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Describe a day you will never forget in your life.",
        modelAnswer: `AN UNFORGETTABLE DAY OF BRAVERY AND HONOR

Among all the days etched in my memory, Wednesday, the 18th of October 1995, remains the most unforgettable day of my life. It was a day that began in ordinary tranquility but culminated in a terrifying emergency that tested my courage and saved a human life.

It was a sweltering afternoon, and I was walking home along the banks of the Birim River after closing from school. Suddenly, piercing screams shattered the quiet air. Looking toward the wooden footbridge, I was horrified to see a seven-year-old primary school pupil, little Yaw, thrashing helplessly in the swollen, swirling river. He had slipped from the mossy wooden bridge while chasing a soccer ball and was being rapidly dragged downstream toward deep rapids.

Without a second thought, I hurled my school bag onto the grassy bank, kicked off my sandals, and plunged into the churning torrent. The powerful current battered my chest, but remembering the swimming techniques taught by my grandfather, I stroked furiously toward the drowning boy. Grabbing his collar just as his head sank beneath the surface, I swam with all my might against the ferocious undertow toward an overhanging tree root near the bank.

Clinging to the root with one hand and supporting the choking boy with the other, I screamed for help. Two nearby palm-wine tappers heard my cries, rushed forward with long bamboo poles, and pulled both of us out of the water to safety. They administered mouth-to-mouth resuscitation until Yaw coughed up muddy water and breathed steadily.

The following morning at school assembly, the District Director of Education presented me with a National Civic Heroism Certificate amidst deafening cheers from my teachers and peers. Knowing that my quick action saved a child's life filled me with a deep sense of purpose that will remain with me forever.`
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

async function seedBeceEnglish1995Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1995 into Firestore...");

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
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      // Section A: Passage-First Comprehension Architecture
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Musical Performance of Songbirds",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: The Descent of the Locusts",
          text: passage2Text,
          questionRange: "Questions 6 to 11",
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

  console.log("✅ Calibrated & Passage-First BECE English 1995 successfully seeded into Firestore!");
}

seedBeceEnglish1995Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1995:", err);
    process.exit(1);
  });

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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2007
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 10) ---
  {
    number: 1,
    prompt: "According to Passage I, why did Barimah urge his wife Fosua to remain indoors when the alarm sounded?",
    options: [
      "People were running about in wild confusion",
      "The noise outside was deafening",
      "He suspected that grave physical danger lurked outside",
      "The compound was completely dark"
    ],
    correctAnswer: "He suspected that grave physical danger lurked outside",
    hint: "Think about why a husband would warn his wife not to step out into a chaotic, dark compound.",
    workedSolution: "Barimah advised his wife to stay inside to protect her from the unknown, lethal hazards of the raging fire and falling debris outside.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, what dramatic sight confronted Barimah immediately as he stepped outside?",
    options: [
      "Araba fighting the blaze single-handedly",
      "Neighbors hastily packing salvaged goods",
      "A crowd shouting across the street",
      "Agya Atta's residential building engulfed in flames"
    ],
    correctAnswer: "Agya Atta's residential building engulfed in flames",
    hint: "Reread paragraph two: 'the only light came from the flaming house of Agya Atta...'",
    workedSolution: "The narrative notes that the pitch-dark night was illuminated solely by the blazing fire consuming Agya Atta's house.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, the phrase 'put out' as used in 'to put out the fire' means ............",
    options: ["control", "extinguish", "reduce", "destroy"],
    correctAnswer: "extinguish",
    hint: "To quench or stop a fire from burning.",
    workedSolution: "The phrasal verb 'to put out' in reference to flames or a blaze means to quench or 'extinguish'.",
    points: 1
  },
  {
    number: 4,
    prompt: "From the actions described in Passage I, what was the true relationship between the Barimahs and the Agya Attas?",
    options: [
      "School classmates",
      "Kind, supportive, and caring neighbors",
      "Close matrimonial in-laws",
      "Members of the same youth age-grade"
    ],
    correctAnswer: "Kind, supportive, and caring neighbors",
    hint: "Barimah risked his life to fight the fire, sheltered Atta's family, and protected their property.",
    workedSolution: "Barimah's readiness to protect Agya Atta's family and safeguard their salvaged goods demonstrates that they were devoted, supportive neighbors.",
    points: 1
  },
  {
    number: 5,
    prompt: "According to Passage I, why did the community show immense sympathy toward Araba?",
    options: [
      "She had been deserted by her husband",
      "She had labored alongside her husband to build the house",
      "She was a kind-hearted woman known for her good deeds",
      "She was deeply sorrowful and weeping"
    ],
    correctAnswer: "She was a kind-hearted woman known for her good deeds",
    hint: "Check the final paragraph: 'Araba had won the hearts of many people by her good deeds and kindness...'",
    workedSolution: "The passage explicitly notes that the community grieved with Araba because her benevolence and good deeds had won the hearts of everyone.",
    points: 1
  },
  {
    number: 6,
    prompt: "According to Passage II, what collective action has modern society taken against the menace of smoking?",
    options: [
      "It has prosecuted all smokers in court",
      "It has provided free medical drugs to smokers",
      "It has completely ignored tobacco use",
      "It has launched public campaigns and opposed the habit"
    ],
    correctAnswer: "It has launched public campaigns and opposed the habit",
    hint: "Reread paragraph one: 'there is a national campaign against the habit. The United Nations has set aside a day...'",
    workedSolution: "The author notes that both national governments and the United Nations actively campaign against and oppose tobacco consumption.",
    points: 1
  },
  {
    number: 7,
    prompt: "According to scientific findings cited in Passage II, which lethal condition is directly linked to tobacco smoking?",
    options: [
      "Severe acute malaria",
      "Infectious measles",
      "Malignant cancer of the lungs",
      "Pulmonary tuberculosis"
    ],
    correctAnswer: "Malignant cancer of the lungs",
    hint: "Paragraph three mentions smokers dying of 'lung cancer and heart failure'.",
    workedSolution: "The passage specifically identifies lung cancer and heart failure as primary fatal diseases caused by tobacco smoking.",
    points: 1
  },
  {
    number: 8,
    prompt: "According to Passage II, what grave risk confronts pregnant women who smoke cigarettes?",
    options: [
      "They are likely to deliver stillborn or underweight infants",
      "They completely lose the ability to breastfeed",
      "They are genetically predisposed to having twins",
      "They experience sudden dramatic weight loss"
    ],
    correctAnswer: "They are likely to deliver stillborn or underweight infants",
    hint: "Check paragraph four regarding maternal smoking and pregnancy complications.",
    workedSolution: "The text explains that pregnant smokers produce underweight babies and run high risks of miscarriage and stillbirth.",
    points: 1
  },
  {
    number: 9,
    prompt: "In Passage II, passive smokers are defined as individuals who ............",
    options: [
      "befriend chronic smokers in public",
      "are hopelessly addicted to tobacco",
      "abstain completely from lighting cigarettes",
      "inhale secondhand smoke from others' cigarettes"
    ],
    correctAnswer: "inhale secondhand smoke from others' cigarettes",
    hint: "Paragraph five explains the danger to non-smokers breathing in smoke from other people's pipes and cigarettes.",
    workedSolution: "Passive smokers are non-smokers who involuntary breathe in secondhand smoke produced by active smokers in their environment.",
    points: 1
  },
  {
    number: 10,
    prompt: "According to Passage II, why do non-smokers view the chronic smoker as a social misfit?",
    options: [
      "He is completely fearless of death",
      "He is selfish, pursuing his habit without regard for others' health",
      "He is arrogant and boastful",
      "He speaks disrespectfully to elders"
    ],
    correctAnswer: "He is selfish, pursuing his habit without regard for others' health",
    hint: "Look at the final sentence: 'one who does not consider the welfare of others but his own interest...'",
    workedSolution: "The author notes that society regards the smoker as selfish because he prioritizes his own pleasure while disregarding the health and welfare of innocent people.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "Senyo struggled in vain to prevent his companion from stealing the orchard fruits.\nChoose the word nearest in meaning to the underlined phrase 'in vain'.",
    options: ["hard", "timidly", "angrily", "unsuccessfully"],
    correctAnswer: "unsuccessfully",
    hint: "Without producing any intended or positive result.",
    workedSolution: "'In vain' is an idiomatic phrase meaning without success or to no effect; 'unsuccessfully' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "Through persistent diligence and resilience, the community can overcome any crisis.\nChoose the word nearest in meaning to the underlined word 'overcome'.",
    options: ["get", "avoid", "stop", "solve"],
    correctAnswer: "solve",
    hint: "To conquer, master, surmount, or resolve a difficulty.",
    workedSolution: "'To overcome' a problem means to conquer or successfully resolve it; 'solve' is the closest equivalent in this context.",
    points: 1
  },
  {
    number: 13,
    prompt: "The food prepared for the festival guests was exceptionally delicious.\nChoose the word nearest in meaning to the underlined word 'delicious'.",
    options: ["fine", "tasty", "sweet", "nutritious"],
    correctAnswer: "tasty",
    hint: "Highly pleasing to the sense of taste; appetizing.",
    workedSolution: "'Delicious' refers to food that is highly pleasing and appetizing to the palate; 'tasty' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The audience enthusiastically applauded the young actors at the conclusion of the play.\nChoose the word nearest in meaning to the underlined word 'applauded'.",
    options: ["booed", "invited", "rewarded", "cheered"],
    correctAnswer: "cheered",
    hint: "Clapped, praised, or acclaimed with enthusiastic approval.",
    workedSolution: "'Applauded' means expressed approval by clapping or shouting acclaim; 'cheered' is its closest synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The young shepherd lamented the tragic loss of his faithful hunting dog.\nChoose the word nearest in meaning to the underlined word 'lamented'.",
    options: ["regretted", "mourned", "remembered", "discovered"],
    correctAnswer: "mourned",
    hint: "Expressed deep sorrow, grief, or mourning for someone lost.",
    workedSolution: "'Lamented' means expressed passionate grief, sorrow, or mourning over a loss; 'mourned' is its direct equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "Kofi remains remarkably light-hearted despite his family's economic hardships. This means that Kofi is always ............",
    options: ["careless", "cheerful", "cool", "proud"],
    correctAnswer: "cheerful",
    hint: "Carefree, cheerful, optimistic, and merry in spirit.",
    workedSolution: "The idiom 'light-hearted' describes a person who is cheerful, buoyant, optimistic, and free from gloomy cares.",
    points: 1
  },
  {
    number: 17,
    prompt: "Following the fatal road crash, Ayorkor has really gone through the mill. This means that Ayorkor has ............",
    options: [
      "radically altered her daily habits",
      "acquired worldly wisdom",
      "suffered a lot of severe hardship",
      "received substantial compensation"
    ],
    correctAnswer: "suffered a lot of severe hardship",
    hint: "Undergoing an intense, grinding, and painful trial or ordeal.",
    workedSolution: "The idiom 'to go through the mill' means to experience a prolonged period of severe suffering, trial, or grueling hardship.",
    points: 1
  },
  {
    number: 18,
    prompt: "Moro felt very much at home throughout his stay at the boarding house. This means that Moro was ............",
    options: [
      "familiar with the architecture",
      "comfortable, relaxed, and at ease",
      "disappointed with the food",
      "living with his biological relatives"
    ],
    correctAnswer: "comfortable, relaxed, and at ease",
    hint: "Feeling welcome, relaxed, and unconstrained as if in one's own home.",
    workedSolution: "'At home' is an idiom meaning comfortable, relaxed, completely at ease, and welcome in a setting.",
    points: 1
  },
  {
    number: 19,
    prompt: "The pupils were all ears during the storytelling session. This means that the pupils ............",
    options: [
      "shouted answers continuously",
      "gazed around the hall",
      "covered their ears",
      "listened with rapt attention"
    ],
    correctAnswer: "listened with rapt attention",
    hint: "Listening with complete, undivided, and eager concentration.",
    workedSolution: "The idiom 'all ears' means listening with keen, total, and undivided attention.",
    points: 1
  },
  {
    number: 20,
    prompt: "It took our newly appointed senior prefect several weeks to find his feet. This means that he took time before he ............",
    options: [
      "recognized every pupil",
      "gained confidence and competence",
      "won a leadership prize",
      "became popular among teachers"
    ],
    correctAnswer: "gained confidence and competence",
    hint: "Becoming familiar with and confident in managing a new role.",
    workedSolution: "The idiom 'to find one's feet' means to become confident, competent, and accustomed to managing a new role or responsibility.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While the assemblyman is renowned for being generous, his deputy is notoriously ...... to constituents.",
    options: ["honourable", "proud", "talkative", "unkind"],
    correctAnswer: "unkind",
    hint: "'Generous' means benevolent, giving, and helpful. Find the word denoting mean and harsh behavior.",
    workedSolution: "'Generous' implies open-hearted benevolence and giving. In describing moral disposition, its direct antonym is 'unkind' (or ungenerous/harsh).",
    points: 1
  },
  {
    number: 22,
    prompt: "If you are indolent during class hours, you will fail, but if you are ...... you will triumph.",
    options: ["hardworking", "rude", "careless", "honest"],
    correctAnswer: "hardworking",
    hint: "'Indolent' means lazy and avoiding physical or mental labor. Find the word meaning industrious.",
    workedSolution: "'Indolent' means habitually lazy and slothful. Its direct antonym in academic study is 'hardworking' (diligent or industrious).",
    points: 1
  },
  {
    number: 23,
    prompt: "When interrogated about the theft, Kwame pleaded that he was guilty, but his partner was proven ...... .",
    options: ["surprised", "afraid", "absent", "innocent"],
    correctAnswer: "innocent",
    hint: "'Guilty' means having committed an offense. Find the legal and moral word meaning free from blame.",
    workedSolution: "'Guilty' denotes culpability for a crime. Its direct legal and ethical antonym is 'innocent' (free from blame).",
    points: 1
  },
  {
    number: 24,
    prompt: "Handle the porcelain vase with care because it is fragile, unlike the metal cup which is ...... .",
    options: ["rigid", "beautiful", "unbreakable", "new"],
    correctAnswer: "unbreakable",
    hint: "'Fragile' means easily broken or delicate. Find the word meaning incapable of being shattered.",
    workedSolution: "'Fragile' means delicate and easily shattered. Its direct antonym regarding durability is 'unbreakable'.",
    points: 1
  },
  {
    number: 25,
    prompt: "While some ancient practices are old-fashioned, our community embraces ...... sanitation methods.",
    options: ["modern", "attractive", "interesting", "funny"],
    correctAnswer: "modern",
    hint: "'Old-fashioned' means antiquated and out of date. Find the word meaning contemporary and current.",
    workedSolution: "'Old-fashioned' refers to styles or practices belonging to the past. Its direct antonym is 'modern' (contemporary).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "Of all the seven siblings in the Brown family, Ato is undoubtedly ......",
    options: ["the short", "the shorter", "the shortest", "short"],
    correctAnswer: "the shortest",
    hint: "Comparing more than two individuals to show the highest or lowest degree requires 'the' + superlative adjective.",
    workedSolution: "When comparing an individual against a group of three or more ('seven siblings'), the superlative degree preceded by 'the' ('the shortest') is required.",
    points: 1
  },
  {
    number: 27,
    prompt: "Amma was so frightened by the sudden lightning flash ...... she collapsed onto the floor.",
    options: ["so", "as", "then", "that"],
    correctAnswer: "that",
    hint: "Identify the subordinating conjunction that pairs with 'so' to express cause and result ('so + adjective + that').",
    workedSolution: "The correlative construction 'so + adjective + that' expresses a degree that produces a specific result ('so frightened that she collapsed').",
    points: 1
  },
  {
    number: 28,
    prompt: "Grandmother has ...... loyal friends who regularly visit her cottage.",
    options: ["few", "much", "a little", "a few"],
    correctAnswer: "a few",
    hint: "'Friends' is a countable plural noun. To show a small but positive number, use this quantifier with an article.",
    workedSolution: "'Friends' is a countable plural noun. 'A few' has a positive meaning denoting some/a small number. 'Few' without an article has a negative meaning (almost none).",
    points: 1
  },
  {
    number: 29,
    prompt: "Kofi is the hardworking student to ...... the scholarship prize was awarded.",
    options: ["whose", "which", "whom", "who"],
    correctAnswer: "whom",
    hint: "When referring to a person immediately following a preposition ('to'), use the objective relative pronoun.",
    workedSolution: "'Whom' is the objective relative pronoun required immediately after a preposition ('to whom'). 'Who' is used only as a subject.",
    points: 1
  },
  {
    number: 30,
    prompt: "You are feeling exhausted after that long marathon race, ......?",
    options: ["aren't you", "don't you", "isn't it", "not so"],
    correctAnswer: "aren't you",
    hint: "An affirmative present statement with the primary auxiliary 'are' takes a negative tag using 'are'.",
    workedSolution: "The statement is affirmative present using the verb 'are' with subject 'you'. Its tag must be negative: 'aren't you?'.",
    points: 1
  },
  {
    number: 31,
    prompt: "The guest speaker promised that he ...... attend our Speech Day celebration.",
    options: ["will", "would", "has", "have"],
    correctAnswer: "would",
    hint: "In reported speech following a past reporting verb ('promised'), 'will' shifts back to 'would'.",
    workedSolution: "Because the reporting verb 'promised' is in the simple past tense, the future modal auxiliary 'will' shifts to its past equivalent 'would'.",
    points: 1
  },
  {
    number: 32,
    prompt: "By the time Father arrived from the farm, Mother ...... preparing the evening supper.",
    options: ["has", "had", "have", "having"],
    correctAnswer: "had",
    hint: "Use the past perfect auxiliary ('had + past participle') for an action completed before another past event.",
    workedSolution: "The past perfect tense ('had finished') is used to describe an action completed prior to another past event ('When Daddy arrived').",
    points: 1
  },
  {
    number: 33,
    prompt: "The athlete was ...... fatigued that he could not complete the final lap.",
    options: ["much", "too", "so", "very"],
    correctAnswer: "so",
    hint: "Identify the intensifier that pairs with 'that' to indicate cause and effect.",
    workedSolution: "The correlative pattern 'so + adjective + that' indicates an extreme degree leading to a result ('so fatigued that he could not finish').",
    points: 1
  },
  {
    number: 34,
    prompt: "While weeding the cocoa plot, the farmer was ...... by a venomous viper.",
    options: ["bitten", "beaten", "bit", "beat"],
    correctAnswer: "bitten",
    hint: "Passive voice: Auxiliary 'was' requires the past participle of 'bite'.",
    workedSolution: "The verb 'bite' has the principal forms bite - bit - bitten. In the passive voice ('was + past participle'), the correct form is 'bitten'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The canteen cook has put too ...... sugar into the kettle of porridge.",
    options: ["many", "much", "few", "small"],
    correctAnswer: "much",
    hint: "'Sugar' is an uncountable noun. Use 'too much' to indicate an excessive quantity.",
    workedSolution: "'Sugar' is an uncountable (mass) noun, which requires 'much' ('too much sugar'). 'Many' and 'few' apply strictly to count nouns.",
    points: 1
  },
  {
    number: 36,
    prompt: "Our senior housemaster is a ......",
    options: [
      "handsome, tall man",
      "handsome man tall",
      "tall, handsome man",
      "man, tall, handsome"
    ],
    correctAnswer: "tall, handsome man",
    hint: "General physical dimension/height ('tall') commonly precedes subjective aesthetic evaluation ('handsome') before the noun.",
    workedSolution: "In standard descriptive noun phrases, the physical dimension adjective ('tall') combines naturally with aesthetic opinion ('handsome') immediately before the head noun ('tall, handsome man').",
    points: 1
  },
  {
    number: 37,
    prompt: "Having lived in the countryside for years, I am ...... to walking long distances daily.",
    options: ["using", "uses", "use", "used"],
    correctAnswer: "used",
    hint: "The structure 'to be used to' means accustomed or habituated to something.",
    workedSolution: "The predicate adjective construction 'to be used to' means accustomed to something and takes a gerund or noun ('used to walking').",
    points: 1
  },
  {
    number: 38,
    prompt: "The auto-mechanic succeeded ...... the faulty diesel generator.",
    options: ["at repairing", "in repairing", "to repair", "with repairing"],
    correctAnswer: "in repairing",
    hint: "Identify the preposition that regularly collocates with the verb 'succeeded'.",
    workedSolution: "In standard English, the verb 'succeed' takes the preposition 'in' followed by a gerund ('succeeded in repairing').",
    points: 1
  },
  {
    number: 39,
    prompt: "If I ...... with my grandparents in the village, I would have enjoyed traditional folklore.",
    options: ["had lived", "have lived", "have been living", "am living"],
    correctAnswer: "had lived",
    hint: "Third Conditional: The main clause 'would have enjoyed' requires 'had + past participle' in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause requires the past perfect tense ('had lived').",
    points: 1
  },
  {
    number: 40,
    prompt: "Following the doctor's stern warning, Uncle Atia has finally given ...... his pipe smoking.",
    options: ["off", "out", "up", "in"],
    correctAnswer: "up",
    hint: "Identify the phrasal verb meaning to quit, abandon, or cease a chronic habit.",
    workedSolution: "The phrasal verb 'to give up' means to quit, discontinue, or abandon an unhealthy habit ('given up smoking').",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200701);

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
        prompt: "Write a letter to your pen friend living abroad, explaining the historical significance of Ghana's Independence Day celebrations and describing how the anniversary is commemorated across schools and communities.",
        modelAnswer: `Anglican Junior High School
P. O. Box 85
Koforidua, Eastern Region
15th March, 2007

Dear David,

I hope this letter finds you in fine health and high spirits in London. I was thrilled to receive your recent letter asking about the historical significance of our national holidays. I am excited to explain how Ghana commemorates our historic Independence Day every 6th of March.

Independence Day marks the momentous occasion in 1957 when our beloved nation broke free from British colonial rule, becoming the first sub-Saharan African nation to achieve sovereignty. It is a day of profound national pride, honoring the visionary leadership of Osagyefo Dr. Kwame Nkrumah and our founding patriots who sacrificed their lives for our liberation.

Across the country, the day is commemorated with magnificent military and school parades. In our regional capital, the celebration takes place at the municipal sports stadium. Contingents of pupils from basic and secondary schools, smartly turned out in immaculate uniforms, march past the presidential dais to the stirring tunes of brass bands. Security services—the army, police, and fire service—display thrilling drills and precision maneuvers. The atmosphere is electrified with traditional drumming, cultural dances, and the singing of our patriotic national anthem.

At the climax of the ceremony, the regional minister reads the national presidential address, reminding the youth of our duty to protect our hard-won freedom and work toward economic self-reliance. Families spend the afternoon picnicking and enjoying local dishes like jollof rice and fried plantain.

I hope you will visit Ghana someday to experience this patriotic spectacle firsthand.

Your true friend,
[Signature]
Kwaku Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Write a formal letter to your District Chief Executive (DCE) highlighting the acute shortage of potable drinking water in your community and suggesting at least two practical measures to solve the crisis.",
        modelAnswer: `Presbyterian Junior High School
P. O. Box 44
Nsawam, Eastern Region
18th October, 2007

The District Chief Executive
Akuapem South Municipal Assembly
Nsawam

Dear Sir,

PETITION REGARDING THE SEVERE WATER CRISIS IN NSAWAM COMMUNITY AND PROPOSALS FOR INTERVENTION

On behalf of the youth and citizens of Nsawam, I respectfully write to draw your urgent attention to the acute shortage of potable drinking water confronting our community, and to propose sustainable solutions to avert an impending public health catastrophe.

For over four months, our community taps have run completely dry due to broken distribution pipelines. Consequently, women and school children walk several miles daily to fetch untreated water from the polluted Densu River. Pupils spend early morning hours queuing at private hand-dug wells instead of attending school, resulting in chronic classroom lateness and physical fatigue. Even worse, the consumption of contaminated water has triggered recurrent outbreaks of waterborne diseases, including cholera, dysentery, and bilharzia among children.

To resolve this crisis, I suggest that the District Assembly collaborate with the Ghana Water Company Limited to urgently repair the damaged intake valves at the municipal pumping station and replace decayed distribution pipelines that have paralyzed water delivery.

Secondly, I recommend that your administration allocate emergency funds to drill and mechanize four commercial boreholes equipped with solar-powered overhead storage tanks at strategic locations, including our school compound and the central market square. These mechanized boreholes will provide reliable, clean groundwater and serve as a permanent buffer against municipal supply disruptions.

We trust that your esteemed office will treat this humanitarian appeal with the utmost urgency.

Thank you.

Yours faithfully,
[Signature]
Samuel Addo
(Youth Secretary)`
      },
      {
        questionNumber: "3",
        category: "Speech Writing",
        prompt: "As the Senior Prefect, write the valedictory speech you will deliver at your school's annual Speech and Prize-Giving Day, evaluating the school's achievements and appealing for infrastructural support.",
        modelAnswer: `A SPEECH DELIVERED BY KWASI BOATENG, SENIOR PREFECT OF METHODIST JHS, AT THE 12TH ANNUAL SPEECH AND PRIZE-GIVING DAY

Mr. Chairman, Respected Headmaster, Dedicated Teachers, Revered Traditional Elders, Cherished Parents, and Fellow Students:

It is a distinct honor to address this distinguished gathering on this memorable occasion marking our annual Speech and Prize-Giving Day.

This academic year has been one of extraordinary milestones for our institution. Academically, our school placed first in the District Science and Technology Fair, designing an innovative solar water purifier. In sports, our football team won the zonal championship trophy, while our cultural troupe represented the municipality at the regional cultural festival with distinction. These successes testify to the dedication of our hardworking teachers and the discipline of our students.

However, our progress is seriously threatened by acute infrastructural deficits. Our school library lacks foundational textbooks and reference materials, forcing learners to rely entirely on classroom notes. Furthermore, our information technology laboratory contains only three functioning desktop computers for over three hundred students, making practical computer lessons nearly impossible. Our classrooms are also overcrowded, with students squeezed onto damaged dual desks.

I therefore use this momentous platform to appeal passionately to our Member of Parliament, the District Assembly, our generous alumni, and the PTA to come to our aid. We urgently require thirty modern computers, two hundred dual desks, and contemporary library books to sustain our academic excellence.

To my fellow students and prize winners, I congratulate you and urge you to remain disciplined, for hard work is the sole bridge between dreams and reality.

Long live our noble school! Thank you all.`
      },
      {
        questionNumber: "4",
        category: "Expository / Descriptive Essay",
        prompt: "Write an engaging and clear expository essay describing to a foreign friend how your favorite traditional Ghanaian game is played and explaining why it is beneficial.",
        modelAnswer: `THE ART AND STRATEGY OF PLAYING 'OWARE': GHANA'S ANCIENT BOARD GAME

Among the diverse traditional games played across Ghana, my absolute favorite is 'Oware', an ancient and intellectually stimulating board game that has entertained generations of Ghanaians for centuries. Carved from fine hardwood, the game is a contest of foresight, mathematical precision, and tactical cunning.

The game is played by two contestants seated opposite each other across an elongated wooden board containing two parallel rows of six hollow circular pits (cups), with a large storage cup carved at either end. The game begins with forty-eight smooth round seeds, usually gray marble-like 'oware' seeds, placed evenly four into each of the twelve playing cups.

The objective is to capture the majority of the opponent's seeds. Players take turns selecting all the seeds from one of the cups on their side of the board and distributing them, one by one, counter-clockwise into consecutive cups in a rhythmic process known as sowing. If the final seed of a turn lands in an opponent's cup containing one or two seeds, raising the total to exactly two or three, the player captures those seeds and stores them in his end cup. If the preceding cups also contain two or three seeds, they are captured in a rewarding chain reaction. A player must always sow seeds in a manner that leaves the opponent with legal moves. The game concludes when one player captures twenty-five or more seeds.

'Oware' is far more than entertainment; it sharpens mental arithmetic, quickens calculation speed, and teaches strategic planning. It fosters patience, sportsmanship, and deep social camaraderie among players.`
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

async function seedBeceEnglish2007Calibrated() {
  console.log("Seeding Calibrated & Balanced BECE English 2007 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2007");
  await docRef.set({
    year: 2007,
    title: "BECE English Language 2007 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2007 successfully seeded into Firestore!");
}

seedBeceEnglish2007Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2007:", err);
    process.exit(1);
  });

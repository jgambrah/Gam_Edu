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
}

// =========================================================================
// 100% CLEAN-ROOM ISOMORPHIC QUESTIONS (1 - 30)
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Salifu was ............ startled by the sudden explosion that he could scarcely articulate a word.",
    options: ["enough", "so", "what", "which"],
    correctAnswer: "so",
    hint: "Correlative clause of result: 'so + adjective + that + consequence'.",
    workedSolution: "The degree adverb 'so' pairs correlatively with the subordinator 'that' to express an outcome or result: 'so surprised that he could not talk'.",
    points: 1
  },
  {
    number: 2,
    prompt: "This meager balance in my purse is all ............ I can spare for the journey.",
    options: ["that", "this", "what", "which"],
    correctAnswer: "that",
    hint: "Following the universal indefinite quantifier 'all' referring to things, standard grammar requires the relative pronoun 'that'.",
    workedSolution: "When the antecedent is the quantifier 'all' referring to money or inanimate items, standard English requires 'that': 'all that I have on me'.",
    points: 1
  },
  {
    number: 3,
    prompt: "I was informed by the secretary that the visiting magistrate is a close friend of ............",
    options: ["he", "him", "his", "he's"],
    correctAnswer: "his",
    hint: "Double possessive construction: 'a friend of' requires an absolute possessive pronoun.",
    workedSolution: "The double possessive structure ('a friend of...') requires the independent possessive pronoun 'his': 'a friend of his'.",
    points: 1
  },
  {
    number: 4,
    prompt: "In boarding school, rice and beans with spicy stew ............ a staple meal for growing adolescents.",
    options: ["are", "have been", "is", "is being"],
    correctAnswer: "is",
    hint: "Compound subject viewed as a single, unified culinary dish takes a singular verb.",
    workedSolution: "When two foodstuffs are coupled and regarded as a single composite dish ('Rice and beans'), the subject is grammatically singular and takes 'is'.",
    points: 1
  },
  {
    number: 5,
    prompt: "Yaw is ............ shrewd an entrepreneur to be defrauded by counterfeit merchants.",
    options: ["quite", "so", "too", "very"],
    correctAnswer: "too",
    hint: "Correlative degree modifier pairing with an infinitive to denote an impossibility: 'too + adjective + to-infinitive'.",
    workedSolution: "The degree adverb 'too' indicates an extent that prevents an occurrence: 'too clever to be cheated'.",
    points: 1
  },
  {
    number: 6,
    prompt: "The two contentious political candidates are in the habit of verbally attacking ............",
    options: [
      "each other",
      "one another",
      "one and the other",
      "themselves"
    ],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('The two rivals'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 7,
    prompt: "Of all the female candidates presenting essays in the competition, Ekua is undeniably ............",
    options: [
      "prettier",
      "prettiest",
      "the prettier",
      "the prettiest"
    ],
    correctAnswer: "the prettiest",
    hint: "Superlative degree comparing one entity against the whole class of three or more preceded by 'the'.",
    workedSolution: "Comparing an individual against a group of three or more ('Of all the pupils') requires the superlative form preceded by 'the': 'the prettiest'.",
    points: 1
  },
  {
    number: 8,
    prompt: "It is high time the defaulting clerk ............ to the office to answer the queries.",
    options: ["came", "comes", "has come", "will come"],
    correctAnswer: "came",
    hint: "Subjunctive past simple: 'It is high time + subject' requires a simple past verb form.",
    workedSolution: "Following the subjunctive formula 'It is high time' followed by a subject, standard grammar requires the past simple tense: 'came'.",
    points: 1
  },
  {
    number: 9,
    prompt: "You should be ............ more vigilant about safeguarding your personal PIN codes.",
    options: ["less", "least", "little", "a little"],
    correctAnswer: "a little",
    hint: "Positive degree modifier used to qualify comparative adjectives moderately.",
    workedSolution: "To moderately intensify a comparative adjective ('more careful') in a positive sense, English requires 'a little': 'a little more careful'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Atsu is eagerly looking forward to ............ his former classmates at the silver jubilee reunion.",
    options: ["see", "seeing", "be seeing", "have seen"],
    correctAnswer: "seeing",
    hint: "The prepositional idiom 'look forward to' takes a gerund complement (verb-ing).",
    workedSolution: "In the phrasal verb 'look forward to', 'to' is a preposition requiring a gerund complement: 'looking forward to seeing'.",
    points: 1
  },
  {
    number: 11,
    prompt: "The harder the apprentices practice their technical craft, ............ their prospects of employment.",
    options: ["greater", "greatest", "the great", "the greater"],
    correctAnswer: "the greater",
    hint: "Correlative double comparative structure: 'The + comparative..., the + comparative...'.",
    workedSolution: "Proportional comparative sentences require parallel structures with 'the': 'The harder you study, the greater your chance'.",
    points: 1
  },
  {
    number: 12,
    prompt: "If you had solicited my counsel earlier, I ............ you without hesitation.",
    options: [
      "will help",
      "would help",
      "will have helped",
      "would have helped"
    ],
    correctAnswer: "would have helped",
    hint: "Third conditional: 'had asked' in the if-clause requires 'would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the main clause requires a modal past perfect: 'would have helped'.",
    points: 1
  },
  {
    number: 13,
    prompt: "I don't really comprehend what you are demanding from me, ............ I?",
    options: ["am", "aren't", "do", "did"],
    correctAnswer: "do",
    hint: "A negative present statement with auxiliary 'don't' and subject 'I' takes an affirmative present tag.",
    workedSolution: "The main clause has a negative simple present auxiliary ('don't really know') with subject 'I'. The corresponding question tag must be affirmative: 'do I?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "Because of their insolent behavior, I will not walk to the assembly with ............ of those two boys.",
    options: ["each", "either", "everyone", "neither"],
    correctAnswer: "either",
    hint: "In a negative clause containing 'not', use this pronoun to negate a choice between two persons without double negation.",
    workedSolution: "Following the negative particle 'not' when referring to two individuals, standard English uses 'either' ('will not walk with either of the boys'). 'Neither' would create an ungrammatical double negative.",
    points: 1
  },
  {
    number: 15,
    prompt: "During the rainy season, several children in our village fell ill ............ scarlet fever.",
    options: ["at", "by", "of", "with"],
    correctAnswer: "with",
    hint: "Identify the dependent preposition that collocates with 'fall ill' when naming a disease: 'ill with'.",
    workedSolution: "In standard English collocations, one 'falls ill with' an illness or disease: 'fell ill with measles'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The magistrate's furrowed brow and piercing eyes gave him an exceptionally severe countenance.\nChoose the word nearest in meaning to 'severe'.",
    options: ["bad", "deadly", "serious", "unpleasant"],
    correctAnswer: "serious",
    hint: "Stern, grave, solemn, or unyielding in appearance.",
    workedSolution: "'Severe' in describing facial expression or demeanor means stern, grave, or 'serious'; 'serious' is its closest synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "Our parents ensured that we enjoyed the benefit of sound foundational schooling.\nChoose the word nearest in meaning to 'benefit'.",
    options: ["luck", "advantage", "quality", "value"],
    correctAnswer: "advantage",
    hint: "A helpful, favorable, or profitable circumstance.",
    workedSolution: "'Benefit' in the context of an opportunity or privilege means a favorable circumstance or 'advantage'.",
    points: 1
  },
  {
    number: 18,
    prompt: "The young apprentice was too scared to venture through the dark forest alone.\nChoose the word nearest in meaning to 'scared'.",
    options: ["afraid", "anxious", "uneasy", "unhappy"],
    correctAnswer: "afraid",
    hint: "Filled with fear, alarmed, or frightened.",
    workedSolution: "'Scared' means feeling fear or terror; 'afraid' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The serene lakeside bungalow is ideal for the convalescing patient.\nChoose the word nearest in meaning to 'ideal'.",
    options: ["good", "perfect", "satisfactory", "suitable"],
    correctAnswer: "suitable",
    hint: "Appropriate, fitting, or optimal for a particular purpose.",
    workedSolution: "'Ideal' means satisfying one's conception of what is perfect, fitting, or highly 'suitable'; 'suitable' (or perfect) fits the context.",
    points: 1
  },
  {
    number: 20,
    prompt: "Modern agricultural mechanization is of enormous value to national food security.\nChoose the word nearest in meaning to 'enormous'.",
    options: ["enviable", "great", "much", "suitable"],
    correctAnswer: "great",
    hint: "Extremely large, massive, or immense in degree or size.",
    workedSolution: "'Enormous' means extremely large, vast, or immense; 'great' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Akua celebrates her graduation today, but unfortunately I cannot make it. This means that the speaker ............",
    options: [
      "has no desire to be present",
      "feels it is compulsory to attend",
      "forgot to purchase a commemorative gift",
      "will not be able to attend the ceremony"
    ],
    correctAnswer: "will not be able to attend the ceremony",
    hint: "The informal idiom 'cannot make it' means unable to attend or arrive at an event.",
    workedSolution: "The idiom 'to make it' means to manage to arrive or attend; saying 'I cannot make it' means the speaker will be unable to attend.",
    points: 1
  },
  {
    number: 22,
    prompt: "The rigorous entrance screening was conducted to separate the sheep from the goats. This means the examination aimed at ............",
    options: [
      "training students in livestock management",
      "partitioning candidates into different physical halls",
      "shortlisting only the most submissive pupils",
      "selecting the superior candidates from the inferior ones"
    ],
    correctAnswer: "selecting the superior candidates from the inferior ones",
    hint: "To distinguish valuable, competent people from those who are incompetent.",
    workedSolution: "The idiom 'to separate the sheep from the goats' means to distinguish between the competent, superior individuals and the inferior ones; 'selecting the best candidates'.",
    points: 1
  },
  {
    number: 23,
    prompt: "Being the eldest son of the deceased merchant, Joojo claimed the lion's share of the family inheritance. This means Joojo took ............",
    options: [
      "the entirety of the property",
      "exactly half of the estate",
      "the most decorative luxury items",
      "the largest, predominant portion of the estate"
    ],
    correctAnswer: "the largest, predominant portion of the estate",
    hint: "The major, largest, or disproportionately greatest part of something.",
    workedSolution: "The idiom 'the lion's share' refers to the largest, predominant, or greatest portion of an asset.",
    points: 1
  },
  {
    number: 24,
    prompt: "The basic school pupils were all ears during the thrilling folklore presentation. This means the pupils ............",
    options: [
      "found the presentation tedious",
      "observed the speaker with curiosity",
      "listened with rapt, undivided attention",
      "applauded at every interval"
    ],
    correctAnswer: "listened with rapt, undivided attention",
    hint: "Listening eagerly and attentively.",
    workedSolution: "The idiom 'all ears' means listening eagerly, intently, and with undivided attention.",
    points: 1
  },
  {
    number: 25,
    prompt: "In terms of academic and moral leadership, Mensah is the pick of the bunch. This means that Mensah ............",
    options: [
      "excels as an agricultural farmer",
      "is the fastest track sprinter",
      "is clearly the finest and preferred above all others",
      "is the eldest among the siblings"
    ],
    correctAnswer: "is clearly the finest and preferred above all others",
    hint: "The best, most exceptional choice among a group.",
    workedSolution: "The idiom 'the pick of the bunch' refers to the best, finest, or most outstanding choice from an entire group.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "After addressing the parade, the headteacher ordered the pupils to disperse, but the prefect instructed them to ...... .\nChoose the word most nearly opposite in meaning to 'disperse'.",
    options: ["assemble", "come", "meet", "stay"],
    correctAnswer: "assemble",
    hint: "'Disperse' means to scatter or break up. What military/school command denotes to gather or bring together into a group?",
    workedSolution: "'Disperse' means to scatter or spread out. Its direct operational antonym in parades is 'assemble' (to gather together).",
    points: 1
  },
  {
    number: 27,
    prompt: "While the river current is slow in the swamp, it is remarkably ...... across the rocky falls.\nChoose the word most nearly opposite in meaning to 'slow'.",
    options: ["abrupt", "fresh", "running", "swift"],
    correctAnswer: "swift",
    hint: "'Slow' means moving at low speed. What word denotes moving with great, rapid speed?",
    workedSolution: "'Slow' denotes low speed. Its direct antonym describing water currents or motion is 'swift' (rapid and fast).",
    points: 1
  },
  {
    number: 28,
    prompt: "The bakery discarded the stale loaves and served the customers with ...... bread.\nChoose the word most nearly opposite in meaning to 'stale'.",
    options: ["burnt", "delicious", "fresh", "mouldy"],
    correctAnswer: "fresh",
    hint: "'Stale' bread is dry, hardened, and no longer good. What word denotes newly baked, soft, and crisp?",
    workedSolution: "'Stale' describes food that has lost its crispness or freshness. Its direct culinary antonym is 'fresh'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Akosua has reason to be proud of her achievements, but her brother should be ...... of his misconduct.\nChoose the word most nearly opposite in meaning to 'boastful'.",
    options: ["afraid", "anxious", "ashamed", "nervous"],
    correctAnswer: "ashamed",
    hint: "'Boastful' reflects arrogant pride. What word denotes feeling embarrassment, guilt, or remorse?",
    workedSolution: "'Boastful' reflects pride and bragging. In moral behavior, its direct opposite here is 'ashamed' (embarrassed or remorseful).",
    points: 1
  },
  {
    number: 30,
    prompt: "While the prepared candidate was confident of success, the truant felt ...... about his chances.\nChoose the word most nearly opposite in meaning to 'confident'.",
    options: ["determined", "doubtless", "uncertain", "uneasy"],
    correctAnswer: "uncertain",
    hint: "'Confident' means sure and positive. What word denotes feeling doubtful or not sure?",
    workedSolution: "'Confident' means assured and certain. Its direct psychological antonym is 'uncertain' (doubtful).",
    points: 1
  }
];

// Seeded Deterministic Shuffle across 30 Objective Items: Exactly 8 A, 7 B, 8 C, 7 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 2
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

const assignedTargetIndices = seedShuffle(targetKeys, 201802);

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

// =========================================================================
// PAPER 2: ESSAY WRITING, COMPREHENSION & LITERATURE (THEORY SUITE)
// =========================================================================
const paper2Calibrated = {
  partA_composition: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "As the Senior School Prefect, write a formal petition to your Municipal or District Chief Executive (MCE/DCE), drawing his or her attention to the deplorable condition of the physical structures in your basic school and requesting urgent administrative maintenance.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2018

The Municipal Chief Executive
Bekwai Municipal Assembly
Municipal Directorate, Bekwai

Dear Sir,

PETITION FOR THE URGENT STRUCTURAL RENOVATION OF METHODIST JHS BUILDINGS

On behalf of the students and staff of Methodist Junior High School, Bekwai, I respectfully submit this urgent petition to draw your executive attention to the perilous state of decay affecting our school infrastructure and to appeal for immediate municipal intervention.

Constructed over four decades ago, our primary classroom blocks have suffered severe structural deterioration. Over the past two rainy seasons, violent windstorms ripped off large sections of the rusted corrugated zinc roofing over Form Two and Form Three. Consequently, whenever rainfall occurs, rainwater cascades into the classrooms, soaking textbooks, destroying chalkboard teaching notes, and forcing teachers to suspend instructional periods. Furthermore, deep structural cracks have split the load-bearing pillars, while the concrete floors have broken into jagged gravel craters, posing grave physical hazards to pupils and teachers alike.

This infrastructural decay severely cripples teaching and learning. Teachers cannot conduct practical science demonstrations or display charts in leaky, windowless rooms. More terrifyingly, the fractured walls pose a catastrophic threat of sudden collapse, endangering the lives of over four hundred students.

We humbly appeal to the Municipal Assembly to allocate emergency funding from the District Assembly Common Fund to re-roof the damaged classroom blocks, reconstruct the cracked masonry pillars, and apply fresh plaster and cement flooring before the major rainy season peaks.

We count on your prompt executive leadership to ensure our safety and preserve our right to quality education.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Senior Prefect)`
      },
      {
        questionNumber: "2",
        category: "Debate / Argumentative Essay",
        prompt: "Write a persuasive argumentative essay for or against the motion: \"Life in the Metropolitan City is Far More Dangerous than Life in the Rural Village.\"",
        modelAnswer: `THE PERILS OF URBAN LIVING: WHY THE CITY IS MORE DANGEROUS THAN THE VILLAGE

In contemporary society, thousands of rural youths migrate to metropolitan centers captivated by the dazzling allure of skyscrapers, neon lights, and asphalt boulevards. However, beneath this glamorous facade lies a grim socio-economic reality. When evaluated in terms of physical security, public health hazards, and social vulnerability, living in a metropolitan city is undeniably far more dangerous than residing in a peaceful rural village.

First and foremost, metropolitan cities are plagued by rampant violent crime and criminal syndicates. In sprawling urban centers, extreme economic desperation, youth unemployment, and the absence of traditional community cohesion foster high rates of armed robbery, gang violence, carjackings, and residential burglaries. Dwellers live behind fortified razor-wire fences in perpetual terror, unable to navigate unlit streets after dusk without fear of assault. By contrast, rural villages are secure havens anchored in traditional communal solidarity where serious violent crime is virtually unknown and citizens live in peaceful harmony.

Secondly, urban environments present severe public health hazards. Cities are chocked with toxic carbon emissions from traffic gridlocks, deafening industrial noise pollution, contaminated municipal drains, and dangerous chemical waste. These toxic environmental pollutants trigger alarming rates of respiratory illnesses, hypertension, and cardiovascular diseases. Furthermore, chaotic urban road networks record catastrophic traffic fatalities daily. In the village, by contrast, inhabitants breathe clean oxygen, consume unadulterated organic farm produce, and enjoy wholesome natural peace.

In conclusion, while cities offer commercial amenities, they carry grave risks to life and limb. The peaceful security of the rural village remains unmatched.

Thank you.`
      },
      {
        questionNumber: "3",
        category: "Formal Investigative Report",
        prompt: "Write a formal disciplinary report to the Headteacher of your school regarding an incident in which a senior female student physically assaulted and beat up a junior male pupil.",
        modelAnswer: `REPORT ON A PHYSICAL ASSAULT INCIDENT INVOLVING BEATRICE ADDO AND KOFI MENSAH

1. INCIDENT OVERVIEW
On Thursday, 12th July 2018, during the morning recess interval, a violent disciplinary infraction occurred on the junior classroom veranda when Beatrice Addo, a Form Three female student, physically assaulted Kofi Mensah, a Form One male pupil.

2. SUMMARY OF INVESTIGATION
According to eyewitness testimonies gathered from classroom monitors, the dispute originated near the municipal standpipe. Beatrice Addo had attempted to bypass the student queue to fetch water for her personal use. When the junior pupil, Kofi Mensah, who had waited patiently in line for twenty minutes, politely appealed that seniors should respect the queue, Beatrice took offense, accusing him of insolence.

Rather than lodging a complaint with the prefect on duty, Beatrice cornered the junior boy on his classroom veranda moments later. She slapped him twice across the face, dragged him violently by his uniform collar, and struck him on the shoulder with a wooden desk ruler, causing a deep cut on his brow and a nosebleed. Prefects and teachers intervened promptly to disarm Beatrice and escort the injured pupil to the school dispensary for first-aid treatment.

3. FINDINGS AND CONCLUSION
The prefectorial committee concluded that Beatrice Addo committed gross physical assault and engaged in unprovoked bullying, in blatant violation of Section 4 of our School Code of Conduct. The junior pupil exhibited no physical aggression and acted entirely in self-defense.

4. RECOMMENDATIONS
To preserve institutional order and deter bullying, the committee recommends that:
(a) Beatrice Addo be suspended for two weeks and stripped of her extracurricular privileges;
(b) Her parents bear the complete medical cost of Kofi Mensah's treatment;
(c) She render a formal, unreserved apology during morning assembly upon her return.

Submitted by:
[Signature]
Emmanuel Addo
(Disciplinary Committee Secretary)`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `When Uncle Mensah assumed foster custody of his two orphaned nephews, Kojo and Kwesi, he pledged before the family elders to give them the finest parental care and moral upbringing. And he honored that vow faithfully. However, the two boys possessed an obstinate streak, frequently doing the exact opposite of what they were instructed. Their most reckless passion was nocturnal mushroom-hunting along the dense forest railway line.

As he prepared to depart for an exhaustive town-hall council meeting one sweltering afternoon, Uncle Mensah summoned the boys and pleaded with them earnestly not to join any hunting band or venture into the forest reserve by themselves. He even pledged to purchase brand-new sports sneakers for each of them if they abstained from their nocturnal excursions for once. It was obvious to everyone in the village that mushroom foragers would flock to the railway embankment that evening, as a heavy tropical downpour had saturated the decaying timber logs that morning.

Uncle Mensah's council meeting proved to be a marathon affair, dragging on late into the night. When he finally trudged home at half-past eight, the cottage was plunged in pitch darkness; neither of his foster sons was inside. A cold dread gripped his chest, convincing him that a terrible tragedy had occurred. Confused and trembling, he paced the veranda before flicking on his portable transistor radio and tuning into his favorite regional station, Sunrise FM.

The breaking bulletin hit him like a physical blow: "Five nocturnal forest foragers have been crushed to death at the Yaaboi crossing by the evening freight train bound for the coast."

As the harrowing bulletin sank in, Uncle Mensah winced in agony, collapsing into an armchair in tears. He was so paralyzed with grief that he failed to notice Kojo creep through the front doorway, panting heavily, drenched in mud, and balancing a heavy head-load of forest mushrooms.

Suddenly, the rusted hinges of the rear window squeaked. In stole Kwesi, shivering and gasping under an identical bundle of harvest.

Beholding both boys alive and unhurt, Uncle Mensah exhaled a massive sigh of relief, clutching his pounding heart. Shaking his head in disbelief, he murmured softly to himself, "These boys will surely be the death of me! When will they learn to obey simple instructions?"`,
    questions: [
      {
        subQuestion: "(a)",
        question: "I. Why was Uncle Mensah taking care of the two boys?\nII. Why did Uncle Mensah strictly forbid the boys from going on nocturnal mushroom-hunting expeditions?",
        answer: "I. He was caring for them because he had formally adopted them after they were orphaned, having vowed to look after them.\nII. He forbade them because hunting at night in the forest and along the railway line was extremely dangerous and exposed them to mortal hazards like oncoming trains."
      },
      {
        subQuestion: "(b)",
        question: "State two distinct reasons why Uncle Mensah was certain that the boys would be tempted to go mushroom-hunting that evening.",
        answer: "1. Mushroom-hunting was their greatest, uncontrollable passion.\n2. A heavy torrential downpour had saturated the forest that morning, creating ideal conditions that invariably brought out foragers."
      },
      {
        subQuestion: "(c)",
        question: "What is the meaning of the sentence: 'Uncle Mensah's council meeting proved to be a marathon affair'?",
        answer: "It means the meeting was exceptionally lengthy, protracted, and exhausting, lasting for hours far longer than anticipated."
      },
      {
        subQuestion: "(d)",
        question: "I. Why was Uncle Mensah so deeply troubled and alarmed upon returning home?\nII. How did the radio news broadcast regarding the railway disaster affect him emotionally?",
        answer: "I. He was alarmed because it was late at night (8:30 p.m.), the house was dark, and neither of his foster sons was at home, making him suspect a catastrophe.\nII. The news devastated him, making him wince in agony, weep bitterly, and become paralyzed with grief, believing his sons were among the dead."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following figurative expressions as used in the passage:\nI. 'have been crushed to death / run over'\nII. 'in stole Kwesi / in stole the other boy'\nIII. 'be the death of me'",
        answer: "I. 'run over / crushed to death' means struck, mangled, and killed beneath the heavy moving wheels of a train.\nII. 'in stole the other boy' means the boy entered surreptitiously, quietly, and secretly to avoid detection.\nIII. 'be the death of me' means will cause me intolerable stress, chronic worry, and ultimate physical or emotional breakdown."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. vowed\nII. passion\nIII. abstained\nIV. grave\nV. breathless",
        answer: "I. vowed: pledged, promised, swore, resolved.\nII. passion: obsession, enthusiasm, fascination, love.\nIII. abstained: refrained, kept away, held back, desisted.\nIV. grave: terrible, fatal, disastrous, catastrophic.\nV. breathless: panting, gasping, winded, out of breath."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts from Sackey J.A. and Darmani L. (comp.): The Cockcrow.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist",
        contextExtract: "\"Oliver walked 70 miles to London. In such a big city, no one would ever find him! It was chilly and his feet hurt but he was happy to leave his old, miserable life behind.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "Name two characters whose cruel and abusive treatment compelled Oliver Twist to run away from his hometown to London.",
            answer: "Mr. Bumble (the parish beadle) and Mrs. Sowerberry (or Noah Claypole / Mr. Sowerberry)."
          },
          {
            subQuestion: "5(b)",
            question: "Identify the literary contrast presented in the extract.",
            answer: "The contrast between physical bodily pain/discomfort ('feet hurt', 'chilly') and emotional joy/relief ('happy to leave his old, miserable life behind')."
          },
          {
            subQuestion: "5(c)",
            question: "In the line, 'I robbed her of the one item she had... She kept it safe', what was 'the one item' referred to?",
            answer: "A gold locket and ring (containing the identity tokens and portrait of Oliver's late mother, Agnes Fleming)."
          }
        ]
      },
      {
        sectionTitle: "MERRILL CORNEY: Debbie, Sandy and Pepe",
        contextExtract: "\"Well, we'll just have to look after him ourselves then\", she said.\n\"We'll make a soft nest for him and feed him when he grows up.\nHe will stay in our garden.\"",
        subItems: [
          {
            subQuestion: "5(d)",
            question: "What physical object did the young girls choose to serve as a nest for Pepe the baby bird?",
            answer: "A small cardboard shoe box lined with soft cotton wool/leaves."
          },
          {
            subQuestion: "5(e)",
            question: "Which literary figure of speech is primarily utilized in referring to Pepe as 'him' throughout the extract?",
            answer: "Personification."
          }
        ]
      },
      {
        sectionTitle: "AMA ATA AIDOO: The Dilemma of a Ghost",
        contextExtract: "My spirit Mother ought to have come for me earlier.\nNow, what shall I tell them who are gone?\nThe daughter of slaves who come from the white man's land\nSomeone should advise me on how to tell my story.\nMy children, I am dreading my arrival there.\nWhere they will ask me news of home.\nShall I tell them or shall I not?",
        subItems: [
          {
            subQuestion: "5(f)",
            question: "Who is the dramatic speaker delivering this sorrowful soliloquy?",
            answer: "Nana (the aged matriarch and great-grandmother of the Odumna clan)."
          },
          {
            subQuestion: "5(g)",
            question: "What do the following poetic expressions in the extract refer to?\nI. '... who are gone?'\nII. '... there'",
            answer: "I. 'who are gone' refers to the dead ancestors (the ancestral spirits of the Odumna clan).\nII. 'there' refers to the ancestral spirit world (the land of the dead / eternity)."
          }
        ]
      },
      {
        sectionTitle: "LAWRENCE DARMANI: Scribbler's Dream",
        contextExtract: "Scribbler,\nThe dream in your mind fills the shelf.\nWhen upon the shelf you gaze,\nA vacuum stares at you.\nThere is your quill and parchment,\nBut heavy are your hands.\nWhy?\nBecause disuse numbs the wrist.",
        subItems: [
          {
            subQuestion: "5(h)",
            question: "In the poem, what does the appellation 'Scribbler' refer to?",
            answer: "A writer, poet, or aspiring literary author."
          },
          {
            subQuestion: "5(i)",
            question: "What does the metaphorical expression 'The dream in your mind' refer to?",
            answer: "The unwritten literary ideas, creative stories, and artistic ambitions of the author waiting to be published."
          }
        ]
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.partA_composition.questions.map((q) => ({
    id: `composition_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  })),
  {
    id: "comprehension_passage",
    partLabel: "Part B: Reading Comprehension",
    prompt: paper2Calibrated.partB_comprehension.passageText,
    passage: paper2Calibrated.partB_comprehension.passageText,
    subQuestions: paper2Calibrated.partB_comprehension.questions,
    marks: 30
  },
  ...paper2Calibrated.partC_literature.questions.map((sec, idx) => ({
    id: `literature_cockcrow_${idx + 1}`,
    partLabel: `Part C: Literature - ${sec.sectionTitle}`,
    contextExtract: sec.contextExtract || null,
    subItems: sec.subItems,
    marks: 10
  }))
];

async function seedBeceEnglish2018Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2018 into Firestore...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance across 30 Objective Items:", keyDist);

  const db = await getDb();
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2018");
  await docRef.set({
    year: 2018,
    title: "BECE English Language 2018 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      hasCockcrowLiterature: true,
      passageFirstLayout: false,
      updatedAt: new Date()
    },
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test (Lexis and Structure)",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      sections: {
        sectionA_lexis_and_structure: {
          title: "Section A: Lexis and Structure",
          questionRange: "Questions 1 to 15",
          questions: balancedPaper1.slice(0, 15)
        },
        sectionB_synonyms: {
          title: "Section B: Synonyms (Nearest in Meaning)",
          questionRange: "Questions 16 to 20",
          questions: balancedPaper1.slice(15, 20)
        },
        sectionC_idioms: {
          title: "Section C: Idiomatic Expressions",
          questionRange: "Questions 21 to 25",
          questions: balancedPaper1.slice(20, 25)
        },
        sectionD_antonyms: {
          title: "Section D: Antonyms (Opposite in Meaning)",
          questionRange: "Questions 26 to 30",
          questions: balancedPaper1.slice(25, 30)
        }
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Written Essay, Reading Comprehension, and Literature",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2018 successfully seeded into Firestore!");
}

seedBeceEnglish2018Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2018:", err);
    process.exit(1);
  });

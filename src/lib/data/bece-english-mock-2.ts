/**
 * JHS Curriculum Data - BECE English Language Mock 2
 * Standardized Isomorphic Examination Suite (Paper 1 CBT + Paper 2 Theory)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

export const allRawEnglishMock2Questions: QuestionItem[] = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "I would rather the headmaster ............ the disciplinary committee meeting until next Tuesday.",
    options: ["postpones", "postponed", "has postponed", "should postpone"],
    correctAnswer: "postponed",
    hint: "The structure 'would rather + different subject' requires a simple past subjunctive verb form to express present/future preference.",
    workedSolution: "When 'would rather' is followed by a different subject clause ('the headmaster'), standard English requires the past subjunctive form: 'postponed'.",
    points: 1
  },
  {
    number: 2,
    prompt: "During the cultural durbar, the four paramount chiefs exchanged ceremonial gifts with ............",
    options: ["themselves", "each other", "one another", "theirselves"],
    correctAnswer: "one another",
    hint: "Prescriptive reciprocal pronoun used when an action is mutually shared among three or more entities ('four paramount chiefs').",
    workedSolution: "When reciprocal interaction occurs among three or more individuals, 'one another' is prescriptively standard. ('Each other' applies strictly to two).",
    points: 1
  },
  {
    number: 3,
    prompt: "The contractor inspecting the damaged school bridge is an uncle of ............",
    options: ["me", "myself", "mine", "my"],
    correctAnswer: "mine",
    hint: "Double possessive construction: 'an [noun] of' requires an absolute possessive pronoun.",
    workedSolution: "In double possessive constructions ('an uncle of...'), standard grammar requires the independent possessive pronoun 'mine'.",
    points: 1
  },
  {
    number: 4,
    prompt: "The chief surgeon requested a ............ instrument to perform the emergency operation.",
    options: [
      "sharp German surgical scalpel",
      "German sharp surgical scalpel",
      "surgical sharp German scalpel",
      "sharp surgical German scalpel"
    ],
    correctAnswer: "sharp German surgical scalpel",
    hint: "Cumulative adjective ordering: Physical Quality ('sharp') precedes Origin/Nationality ('German') which precedes Purpose ('surgical') before the noun.",
    workedSolution: "Standard English adjective order places physical description ('sharp') before origin/nationality ('German') followed by purpose ('surgical'): 'sharp German surgical scalpel'.",
    points: 1
  },
  {
    number: 5,
    prompt: "No matter how vigorously the lawyer argued, the magistrate ............ him bail.",
    options: ["denied", "has denied", "denies", "had denied"],
    correctAnswer: "denied",
    hint: "Past narrative consistency: Governed by the past tense concessive clause 'No matter how vigorously the lawyer argued...'.",
    workedSolution: "To maintain narrative past tense consistency with 'argued', the simple past indicative 'denied' is required.",
    points: 1
  },
  {
    number: 6,
    prompt: "The jury ............ delivered its unanimous verdict after three hours of closed deliberation.",
    options: ["have", "has", "are", "were"],
    correctAnswer: "has",
    hint: "Collective noun concord: When a collective noun acts as a single, harmonious unit indicated by 'its', it takes a singular verb.",
    workedSolution: "The singular possessive pronoun 'its' indicates that the collective noun 'The jury' is acting as a single unified entity, requiring singular 'has'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Scarcely had the assembly bell chimed ............ the students lined up in front of their classrooms.",
    options: ["than", "then", "when", "before"],
    correctAnswer: "when",
    hint: "Correlative negative time inversion: 'Scarcely / Hardly had...' strictly pairs with 'when'. ('No sooner had...' pairs with 'than').",
    workedSolution: "In standard English correlative temporal inversions, 'Scarcely had...' is strictly paired with 'when'.",
    points: 1
  },
  {
    number: 8,
    prompt: "Auntie Mansa requested the shopkeeper to give her a ............ of scented toilet soap.",
    options: ["piece", "cake", "tablet", "block"],
    correctAnswer: "cake",
    hint: "Identify the standard partitive noun quantifier that collocates traditionally with manufactured soap.",
    workedSolution: "In standard English idiomatic collocations, soap is measured partitively as a 'bar' or a 'cake of soap' (or 'tablet'). 'Cake of soap' is standard in WAEC syllabus registers.",
    points: 1
  },
  {
    number: 9,
    prompt: "Let us assemble our cleaning tools and weed the school compound, ............?",
    options: ["will you", "shall we", "can we", "would we"],
    correctAnswer: "shall we",
    hint: "Cohort imperatives and suggestions beginning with 'Let us / Let's' require a first-person plural question tag.",
    workedSolution: "Imperative sentences expressing collective suggestions beginning with 'Let us' take 'shall we?' as their mandatory question tag.",
    points: 1
  },
  {
    number: 10,
    prompt: "If the masonry team had possessed sufficient cement, they ............ the foundation wall before sunset.",
    options: [
      "could have completed",
      "could complete",
      "will have completed",
      "would complete"
    ],
    correctAnswer: "could have completed",
    hint: "Third conditional counterfactual: 'had possessed' requires 'could have / would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unreal past circumstance, the main clause requires a modal past perfect: 'could have completed'.",
    points: 1
  },
  {
    number: 11,
    prompt: "The suspicious intruder was seen ............ the administrative block through the back window.",
    options: ["enter", "entered", "to enter", "to entering"],
    correctAnswer: "to enter",
    hint: "Verbs of sensory perception in the passive voice take a full to-infinitive (contrasting with the bare infinitive in the active voice).",
    workedSolution: "While sensory verbs take a bare infinitive in the active voice ('saw him enter'), their passive transformations require a full to-infinitive: 'was seen to enter'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The judicial council has recommended the barrister ............ the President appointed last week.",
    options: ["who", "whom", "whose", "which"],
    correctAnswer: "whom",
    hint: "Objective relative pronoun used when referring to a human being functioning as the grammatical object of 'appointed'.",
    workedSolution: "The relative pronoun functions as the grammatical object of the transitive verb 'appointed' (the President appointed him), requiring objective 'whom'.",
    points: 1
  },
  {
    number: 13,
    prompt: "Neither the class prefect nor his desk-mates ............ ready for the mathematics quiz.",
    options: ["is", "was", "are", "has been"],
    correctAnswer: "are",
    hint: "Proximity rule with 'neither... nor': The verb agrees in number with the nearer plural subject ('his desk-mates').",
    workedSolution: "In 'neither... nor' constructions, the verb agrees with the subject closer to it ('his desk-mates', plural third-person), requiring the plural present verb 'are'.",
    points: 1
  },
  {
    number: 14,
    prompt: "The regional commander praised the ............ during the emergency rescue operation.",
    options: [
      "firemen courage",
      "firemen's courage",
      "firemens' courage",
      "fireman's courages"
    ],
    correctAnswer: "firemen's courage",
    hint: "'Firemen' is an irregular plural noun; plurals not ending in -s form their possessive case by adding 's.",
    workedSolution: "'Firemen' is an irregular plural. It forms its possessive case by adding apostrophe + 's': 'firemen's courage'. Furthermore, 'courage' is an uncountable noun.",
    points: 1
  },
  {
    number: 15,
    prompt: "The candidate was ............ exhausted after the long walk that he collapsed on the porch.",
    options: ["too", "very", "much", "so"],
    correctAnswer: "so",
    hint: "Correlative clause of result: 'so + adjective + that + consequence'.",
    workedSolution: "The degree adverb 'so' pairs correlatively with 'that' to introduce an adverbial clause of result: 'so exhausted that he collapsed'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The forensic auditor conducted a meticulous examination of the financial records.\nChoose the word nearest in meaning to 'meticulous'.",
    options: ["careful", "rapid", "casual", "secret"],
    correctAnswer: "careful",
    hint: "Showing great attention to detail; very careful and precise.",
    workedSolution: "'Meticulous' means taking extreme care about minute details; 'careful' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "A fair judge must remain impartial throughout judicial proceedings.\nChoose the word nearest in meaning to 'impartial'.",
    options: ["friendly", "strict", "neutral", "severe"],
    correctAnswer: "neutral",
    hint: "Treating all rivals or disputants equally; unbiased and fair.",
    workedSolution: "'Impartial' means unbiased, unprejudiced, or 'neutral'; 'neutral' is its exact equivalent.",
    points: 1
  },
  {
    number: 18,
    prompt: "Commercial ginger farming during the harvest season proved highly lucrative.\nChoose the word nearest in meaning to 'lucrative'.",
    options: ["difficult", "profitable", "convenient", "essential"],
    correctAnswer: "profitable",
    hint: "Producing a great deal of financial profit or monetary gain.",
    workedSolution: "'Lucrative' describes an enterprise yielding substantial financial returns; 'profitable' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The incessant rainfall caused severe flooding along the coastal plains.\nChoose the word nearest in meaning to 'incessant'.",
    options: ["torrential", "heavy", "ceaseless", "seasonal"],
    correctAnswer: "ceaseless",
    hint: "Continuing without pause, interruption, or stopping.",
    workedSolution: "'Incessant' means continuing without interruption; 'ceaseless' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "Trekking through the dense mangrove swamp at midnight is a perilous venture.\nChoose the word nearest in meaning to 'perilous'.",
    options: ["hazardous", "tiring", "fearful", "tedious"],
    correctAnswer: "hazardous",
    hint: "Full of danger, hazard, or risk of harm.",
    workedSolution: "'Perilous' means full of danger or peril; 'hazardous' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "During the final examination week, Kwabena was burning the candle at both ends. This means that Kwabena ............",
    options: [
      "wasted his study candles carelessly",
      "studied and worked exhaustingly from early morning till late night",
      "set fire to his study desk",
      "suffered from acute fever"
    ],
    correctAnswer: "studied and worked exhaustingly from early morning till late night",
    hint: "To exhaust oneself by doing too much, waking up early and staying up late to work.",
    workedSolution: "The idiom 'to burn the candle at both ends' means to overwork oneself exhaustingly from early morning until late at night.",
    points: 1
  },
  {
    number: 22,
    prompt: "We pleaded with Yaw not to spill the beans regarding our surprise party. This means we warned Yaw not to ............",
    options: [
      "waste the party food",
      "reveal the confidential secret prematurely",
      "arrive late at the venue",
      "invite uninvited strangers"
    ],
    correctAnswer: "reveal the confidential secret prematurely",
    hint: "To disclose a secret prematurely or indiscreetly.",
    workedSolution: "The idiom 'to spill the beans' means to reveal secret or confidential information prematurely.",
    points: 1
  },
  {
    number: 23,
    prompt: "The union executives and the managing director do not see eye to eye on salary increments. This means they ............",
    options: [
      "refuse to attend meetings together",
      "stare at each other aggressively",
      "do not agree completely with each other",
      "cannot see each other clearly"
    ],
    correctAnswer: "do not agree completely with each other",
    hint: "To have the same opinion or agree completely.",
    workedSolution: "The idiom 'to see eye to eye' means to agree completely; saying they do not see eye to eye means they have strong disagreements.",
    points: 1
  },
  {
    number: 24,
    prompt: "After being cautioned by the magistrate, the young truant resolved to turn over a new leaf. This means he decided to ............",
    options: [
      "abandon his old ways and reform his moral conduct",
      "relocate to another town",
      "read new textbooks",
      "take up farming"
    ],
    correctAnswer: "abandon his old ways and reform his moral conduct",
    hint: "To start behaving in a better, more responsible manner; reform oneself.",
    workedSolution: "The idiom 'to turn over a new leaf' means to reform one's moral behavior and start anew responsibly.",
    points: 1
  },
  {
    number: 25,
    prompt: "By challenging the corrupt town council alone, the young clerk was skating on thin ice. This means the clerk was ............",
    options: [
      "traveling across frozen lakes",
      "acting with extreme cowardice",
      "taking highly dangerous and risky chances",
      "wasting public time"
    ],
    correctAnswer: "taking highly dangerous and risky chances",
    hint: "To be in a risky, precarious, or dangerous situation.",
    workedSolution: "The idiom 'skating on thin ice' means putting oneself in a precarious situation or taking dangerous risks.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the junior housemaster was remarkably lenient with errant pupils, the senior headmaster was ...... .\nChoose the word most nearly opposite in meaning to 'lenient'.",
    options: ["hostile", "strict", "wicked", "arrogant"],
    correctAnswer: "strict",
    hint: "'Lenient' means tolerant, merciful, and not severe. What word denotes demanding that rules be strictly obeyed?",
    workedSolution: "'Lenient' means mild or merciful in discipline. Its direct institutional antonym is 'strict' (rigorous).",
    points: 1
  },
  {
    number: 27,
    prompt: "The defense lawyer's account was fictitious, whereas the forensic report was entirely ...... .\nChoose the word most nearly opposite in meaning to 'fictitious'.",
    options: ["genuine", "complex", "lengthy", "interesting"],
    correctAnswer: "genuine",
    hint: "'Fictitious' means fabricated, invented, or false. What word denotes authentic, real, and true?",
    workedSolution: "'Fictitious' means invented or untrue. Its direct antonym is 'genuine' (authentic or real).",
    points: 1
  },
  {
    number: 28,
    prompt: "Metals typically expand when subjected to intense heat, but ...... upon cooling.\nChoose the word most nearly opposite in meaning to 'expand'.",
    options: ["bend", "soften", "contract", "melt"],
    correctAnswer: "contract",
    hint: "'Expand' means to increase in size or volume. What scientific word denotes to decrease in size or shrink?",
    workedSolution: "In physics and thermal science, the direct antonym of 'expand' (increase in size) is 'contract' (shrink in volume).",
    points: 1
  },
  {
    number: 29,
    prompt: "The instructor's initial explanation was obscure, but his summary was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'obscure'.",
    options: ["lucid", "brief", "loud", "useful"],
    correctAnswer: "lucid",
    hint: "'Obscure' means unclear, dim, and difficult to comprehend. What word denotes clear, transparent, and easily understood?",
    workedSolution: "'Obscure' means vague, unclear, or difficult to understand. Its direct intellectual antonym is 'lucid' (clear and transparent).",
    points: 1
  },
  {
    number: 30,
    prompt: "The novice driver was condemned for being reckless, but his mentor was praised for being ...... .\nChoose the word most nearly opposite in meaning to 'reckless'.",
    options: ["slow", "cautious", "fearful", "obedient"],
    correctAnswer: "cautious",
    hint: "'Reckless' means heedless of danger or rash. What word denotes careful to avoid potential hazards?",
    workedSolution: "'Reckless' means heedless of danger or careless. Its direct behavioral antonym is 'cautious' (prudent and careful).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (JUDICIAL TRIAL REGISTER) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"The high court session commenced when the accused artisan was formally ---31--- on charges of fraudulent breach of trust.\"\nChoose the most suitable word:",
    options: ["arraigned", "summoned", "captured", "called"],
    correctAnswer: "arraigned",
    hint: "The formal legal term for bringing an accused person before a court to answer an indictment is 'to arraign'.",
    workedSolution: "In legal and courtroom procedure, bringing a prisoner to the bar of the court to answer an accusation is formally termed 'arraigned'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"When the indictment was read aloud by the registrar, the defendant firmly ---32--- not guilty.\"\nChoose the most suitable word:",
    options: ["claimed", "pleaded", "denied", "shouted"],
    correctAnswer: "pleaded",
    hint: "The formal legal verb for a defendant's official answer of guilty or not guilty is 'to plead'.",
    workedSolution: "In criminal trials, a defendant enters a formal response by using the verb 'plead': 'pleaded not guilty'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"The principal witness mounted the witness box, swore an oath, and delivered her key ---33--- under cross-examination.\"\nChoose the most suitable word:",
    options: ["speech", "account", "testimony", "rumour"],
    correctAnswer: "testimony",
    hint: "A formal written or spoken statement given under oath in a court of law is testimony.",
    workedSolution: "In judicial proceedings, formal evidence given by a witness under oath is legally classified as 'testimony'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"Having concluded the examination of witnesses, the state ---34--- delivered an impassioned closing address urging conviction.\"\nChoose the most suitable word:",
    options: ["advocate", "prosecutor", "judge", "bailiff"],
    correctAnswer: "prosecutor",
    hint: "The legal representative who conducts criminal proceedings on behalf of the state against an accused person is the prosecutor.",
    workedSolution: "In criminal jurisprudence, the state counsel instituting legal prosecution is the 'prosecutor'.",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"After retiring to chambers to review the exhibits, the magistrate returned to the courtroom and pronounced the final ---35---.\"\nChoose the most suitable word:",
    options: ["sentence", "verdict", "decision", "counsel"],
    correctAnswer: "verdict",
    hint: "The formal finding or decision of a judge or jury on matters submitted to trial: 'the verdict'.",
    workedSolution: "The formal finding of guilt or innocence pronounced by a court is the 'verdict'. (The 'sentence' is the subsequent punishment).",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiced dental fricative consonant sound as the underlined digraph in:\n\"**<u>Th</u>en** the town crier sounded the morning gong.\"",
    options: ["think", "breathe", "breath", "path"],
    correctAnswer: "breathe",
    hint: "'Then' begins with the voiced dental fricative /ð/. 'Breathe' terminates in the identical voiced /ð/ sound. ('Think', 'breath', and 'path' have voiceless /θ/).",
    workedSolution: "The word 'then' starts with the voiced dental fricative /ð/. Among the options, 'breathe' (/briːð/) contains the identical voiced /ð/ sound.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical short vowel sound as the underlined vowel in:\n\"The apprentice injured his left **f<u>oo</u>t**.\"",
    options: ["food", "book", "pool", "shoot"],
    correctAnswer: "book",
    hint: "The vowel in 'foot' is the short near-close near-back rounded vowel /ʊ/. 'Book' (/bʊk/) contains the identical short /ʊ/ sound.",
    workedSolution: "The word 'foot' contains the short monophthong /ʊ/. 'Book' shares the exact same short vowel sound /bʊk/, unlike 'food', 'pool', and 'shoot' which have long /uː/.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical initial consonant cluster sound as:\n\"We must **<u>str</u>ive** to maintain academic excellence.\"",
    options: ["stripe", "shrine", "spring", "scream"],
    correctAnswer: "stripe",
    hint: "Identify the word beginning with the identical three-consonant cluster /str/.",
    workedSolution: "The word 'strive' begins with the cluster /str/. 'Stripe' begins with the exact same /str/ cluster.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not voiced?",
    options: ["kitten", "knight", "kindle", "kernel"],
    correctAnswer: "knight",
    hint: "In this word for a medieval warrior, the initial letter 'k' before 'n' is completely silent.",
    workedSolution: "In 'knight' (pronounced /naɪt/), the initial consonant letter 'k' is completely silent.",
    points: 1
  },
  {
    number: 40,
    prompt: "When the interrogative question \"Where did you hide the ledger?\" is uttered in standard English, what intonation contour is normally used?",
    options: [
      "Rising intonation",
      "Falling intonation",
      "Rise-fall intonation",
      "Level intonation"
    ],
    correctAnswer: "Falling intonation",
    hint: "Standard information-seeking Wh-questions in English normally terminate with a falling pitch contour (↘).",
    workedSolution: "In English suprasegmental phonology, standard Wh-questions (who, what, where, why, when) take a falling intonation contour (↘).",
    points: 1
  }
];

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

const assignedTargetIndices = seedShuffle(targetKeys, 202602);

export const balancedMock2EnglishP1: QuestionItem[] = allRawEnglishMock2Questions.map((q, idx) => {
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

export const paper2EnglishMock2Calibrated = {
  partA_composition: {
    title: "Part A: Writing (Composition)",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a letter to your District Director of Education, drawing attention to the acute shortage of trained Science and Mathematics teachers in basic schools across your district, and suggesting at least two practical measures to attract and retain qualified teachers in rural schools.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The District Director of Education
Ghana Education Service
Bekwai Municipal Directorate
Bekwai

Dear Sir,

PETITION REGARDING ACUTE SHORTAGE OF SCIENCE AND MATHEMATICS TEACHERS

On behalf of the basic school students within the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the acute deficit of qualified Science and Mathematics teachers in our rural schools, and to suggest two practical interventions to resolve this crisis.

In over ten basic schools across our agrarian hinterlands, students preparing for the national BECE examinations have gone without permanent Mathematics and Integrated Science teachers for two consecutive terms. Consequently, schools rely on untrained pupil teachers or combine classes, severely eroding foundational quantitative skills and causing pervasive exam anxiety. If left unaddressed, this deficit will precipitate mass failure in STEM disciplines.

To attract and retain competent teachers, I suggest, first, that the Municipal Directorate collaborate with local traditional councils and the Municipal Assembly to provide subsidized, furnished residential accommodation for teachers posted to rural stations. Many newly posted educators reject rural postings because decent housing is non-existent, forcing them to commute twenty kilometers daily on eroded feeder roads. Guaranteeing decent accommodation will boost retention.

Secondly, the directorate should institute an attractive Rural Deprived-Area Incentive Allowance, alongside accelerated study-leave sponsorships for educators who complete three continuous years of rural service. Recognizing and compensating teachers who make immense sacrifices in rural classrooms will restore professional morale and motivate top graduates to accept rural appointments.

We count on your prompt leadership to secure our educational future.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Students' Representative)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"The Role of Extracurricular Clubs in Molding Leadership and Moral Character in Basic School Students.\"",
        modelAnswer: `BEYOND THE CHALKBOARD: CLUBS AS CRUCIBLES OF CHARACTER
By Samuel K. Boateng, Begoro

In contemporary public discourse on educational reform, primary attention is invariably focused on academic syllabi, textbook ratios, and examination grades. While intellectual training is vital, genuine education extends beyond memorizing classroom definitions. Co-curricular school clubs—such as the Boy Scouts, Red Cross Society, Debate Club, and Environmental Conservation Club—serve as the indispensable crucibles where leadership skills, civic responsibility, and moral character are forged in young learners.

First and foremost, participation in student clubs instills practical leadership competencies and organizational discipline. In clubs, students elect their own executives, draft meeting agendas, manage modest subscription funds, and resolve peer conflicts democratically. When a junior pupil serves as a troop patrol leader or society secretary, he learns the values of accountability, teamwork, and transparent communication. These real-world collaborative experiences build self-confidence and prepare adolescents to assume future civic, corporate, and political leadership roles with integrity.

Secondly, service-oriented clubs cultivate empathy, altruism, and moral uprightness. Clubs like the Red Cross and Girl Guides engage in humanitarian community activities, including visiting orphanages, providing emergency first aid during sports festivals, and cleaning public market squares. By actively assisting the vulnerable and laboring without monetary rewards, students internalize the virtue of selfless service, counteracting the toxic culture of greed and individualism prevalent in society today.

To build a disciplined nation, the Ministry of Education and school heads must revitalize extracurricular clubs, allocating dedicated hours on school timetables for club activities. 

An educated mind without character is a societal hazard; clubs provide the moral anchor our youth urgently need.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"A slip of the foot is better than a slip of the tongue.\"",
        modelAnswer: `A SLIP OF THE TONGUE

During our final term in junior high school, my close friend, Kwesi, was exceptionally brilliant but notoriously undisciplined with his speech. He loved boasting, exaggerating rumors, and making careless sarcastic jokes without considering their destructive consequences. Our wise class tutor, Master Asiedu, continually cautioned him that "a slip of the foot is better than a slip of the tongue," because physical wounds heal, but destructive words can never be recalled. Kwesi laughed off the warning.

His recklessness reached a catastrophic climax during the campaign for the election of the Senior School Prefect. Kwesi's closest friend, Emmanuel, an orphan who had won the admiration of everyone through humility and hard work, was the leading aspirant. At a crowded campaign gathering behind the canteen, Kwesi, intoxicated by the cheers of his supporters, sought to make a cheap comical joke at Emmanuel's expense. Loosening his tongue, he loudly proclaimed: "Why should we elect Emmanuel as our head? Do you know his late father was dismissed from the civil service for embezzlement?"

The words dropped like a toxic bomb. The crowd gasped in stunned silence. The rumor spread across the township within hours, devastating Emmanuel. Overwhelmed by shame and grief over the cruel defamation of his honorable late father, Emmanuel broke down in tears and withdrew from the election, falling into acute depression.

When the headmaster investigated, it was verified that Emmanuel's father had been an honorable teacher who died in a road accident. Kwesi was stripped of all leadership positions and suspended for four weeks for defamation. Weeping outside the school gate, shunned by all his former friends, Kwesi learned the bitter truth: A slip of the foot is truly better than a slip of the tongue.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `For generations, the agrarian settlement of Beposo was celebrated as the breadbasket of the district. Nestling against the foot of the green Kwahu escarpment, the village enjoyed reliable rainfall and rich loamy soils that yielded bountiful harvests of plantain, cocoa, and white yams. The community lived in tranquil harmony, with families pooling labor during planting seasons and celebrating festivals with traditional fontomfrom pageantry.

However, the discovery of alluvial gold deposits beneath the fertile riverbeds three years ago unleashed an environmental catastrophe. Lured by the prospect of instant riches, foreign prospecting syndicates and adventurous local youths invaded the agricultural belt, introducing mechanized bulldozers and toxic chemical washing plants. Almost overnight, thousands of fertile cocoa trees were ruthlessly felled to make way for deep mining trenches.

The most catastrophic impact was suffered by the sacred Bepo River, which had supplied the settlement with pristine drinking water since time immemorial. The miners diverted the natural watercourse into muddy settling ponds, washing gold slurries with lethal doses of mercury and cyanide. Within months, the crystal-clear stream was converted into a foul, brownish sludge of toxic sediment. The freshwater fish and river clams died en masse, floating belly-up on the surface.

To compound the crisis, dangerous, uncovered mining craters were left abandoned across the countryside. When torrential rains fell, these deep pits filled with stagnant water, becoming perilous death traps for domestic livestock and young school children. Two months ago, tragedy struck when two primary school pupils slipped into an abandoned pit on their way from school and drowned before help could arrive.

The Town Development Committee convened an emergency durbar. The elderly queenmother weeping openly, appealed passionately to the government to declare a total moratorium on surface mining in the district. She argued that gold could never be eaten, warning that if the rampant destruction of farmlands and river bodies was not arrested immediately, Beposo would face permanent famine and extinction.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State the primary economic activity of the inhabitants of Beposo before gold mining commenced.",
        answer: "Farming (agriculture / cultivating plantain, cocoa, and white yams)."
      },
      {
        subQuestion: "(b)",
        question: "Mention two specific ways in which the environment was destroyed by mining activities.",
        answer: "1. Thousands of fertile cocoa trees were cut down (farmlands were destroyed).\n2. The sacred Bepo River was heavily polluted with mud and toxic chemicals (or dangerous uncovered mining craters were left abandoned)."
      },
      {
        subQuestion: "(c)",
        question: "State two lethal chemicals utilized by the gold searchers to wash their mineral extractions.",
        answer: "Mercury and cyanide."
      },
      {
        subQuestion: "(d)",
        question: "What tragic human incident occurred as a direct result of the uncovered mining pits?",
        answer: "Two primary school children slipped into an abandoned, water-filled mining pit and drowned."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... since time immemorial;\nII. ... died en masse;\nIII. ... face permanent famine.",
        answer: "I. 'since time immemorial' means for an extremely long period extending beyond memory or historical record.\nII. 'died en masse' means perished all together in large numbers or as a whole group.\nIII. 'face permanent famine' means suffer from chronic, enduring, and severe starvation or food scarcity."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. bountiful;\nII. ruthlessly;\nIII. pristine;\nIV. perilous.",
        answer: "I. bountiful: abundant, plentiful, copious, generous.\nII. ruthlessly: mercilessly, cruelly, harshly, brutally.\nIII. pristine: pure, clean, clear, unpolluted, immaculate.\nIV. perilous: dangerous, hazardous, risky, treacherous."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major dangers posed by the mining pits.",
        answer: "1. Abandoned pits become deadly drowning traps.\n2. Stagnant pits breed dangerous disease-carrying mosquitoes."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts from Sackey J.A. and Darmani L. (comp.): The Cockcrow.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist",
        contextExtract: "\"The old gentleman took out his handkerchief from his pocket and laid it on the table. He then walked about the room, pretending to be searching for something, while the two boys slipped their hands into his pockets.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "Who is the 'old gentleman' training the young boys in this pocket-picking game?",
            answer: "Fagin (the old Jewish fence / criminal gang leader)."
          },
          {
            subQuestion: "5(b)",
            question: "Who were the two boys practicing the art of pocket-picking in the extract?",
            answer: "The Artful Dodger (Jack Dawkins) and Charley Bates."
          }
        ]
      },
      {
        sectionTitle: "AMA ATA AIDOO: The Dilemma of a Ghost",
        contextExtract: "ESI KOM: \"Come, my child. Come, Eulalie, let us go into the room. It is cold out here... My young woman, come.\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "What dramatic shift in relationship does Esi Kom's gesture towards Eulalie represent at this climax of the play?",
            answer: "Reconciliation, acceptance, maternal love, and healing of the cultural conflict between the African family and the African-American wife."
          },
          {
            subQuestion: "5(d)",
            question: "Where was Ato Yawson standing while his mother led his wife inside the room?",
            answer: "He was left standing alone in the courtyard, confused, paralyzed, and bewildered between the two cultures (acting as the metaphorical ghost)."
          }
        ]
      },
      {
        sectionTitle: "KAAKYIRE AKOSOMO NYANTAKYI: Tell My Son to Hold On to His Gun",
        contextExtract: "\"The thick coils of the giant beast tightened. My hands trembled on the trigger. In my ears, my dying father's voice echoed: 'Kwame, be courageous!'\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "What dangerous forest creature was Kwame confronting in the extract?",
            answer: "A ferocious giant python (or wild python/beast)."
          },
          {
            subQuestion: "5(f)",
            question: "What moral character trait did Kwame demonstrate by pulling the trigger successfully?",
            answer: "Filial courage, heroic bravery, and steadfastness in honoring his father's dying charge."
          }
        ]
      },
      {
        sectionTitle: "ERNEST HEMINGWAY: A Day's Wait",
        contextExtract: "\"How long will it be before I die?\" the boy asked, looking away at the bare foot of the bed.",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "What misunderstanding made young Schatz believe he was going to die from his fever?",
            answer: "He confused the Fahrenheit temperature scale (used in America, where 102° is moderate) with the Celsius scale (taught in France, where 44° is fatal)."
          },
          {
            subQuestion: "5(h)",
            question: "What does Schatz's behavior throughout the day reveal about his emotional character?",
            answer: "He displayed remarkable stoicism, quiet courage, and self-restraint, suffering in silence so as not to burden his father."
          }
        ]
      },
      {
        sectionTitle: "THERESA ENNIN: Makola",
        contextExtract: "\"Head bent, rags all around the upside down pan\nPicking her nose, shuffling her feet, oblivious to the bustle\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "What economic social group of laborers in Accra's Makola market is described in this excerpt?",
            answer: "The kayayei (female head-load porters / head-porters)."
          },
          {
            subQuestion: "5(j)",
            question: "What does the word 'oblivious' suggest about the young porter's mental state amid the market chaos?",
            answer: "She is utterly exhausted, detached, resigned, and emotionally numb to the chaotic noise around her."
          }
        ]
      }
    ]
  }
};

export const flattenedEnglishMock2Paper2Questions = [
  ...paper2EnglishMock2Calibrated.partA_composition.questions.map((q: any, idx: number) => ({
    number: idx + 1,
    questionNumber: q.questionNumber,
    section: "Part A: Writing (Composition)",
    category: q.category,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    points: 30
  })),
  {
    number: 4,
    questionNumber: "4",
    section: "Part B: Reading Comprehension",
    instructions: paper2EnglishMock2Calibrated.partB_comprehension.instructions,
    passageText: paper2EnglishMock2Calibrated.partB_comprehension.passageText,
    subQuestions: paper2EnglishMock2Calibrated.partB_comprehension.questions,
    points: 30
  },
  ...paper2EnglishMock2Calibrated.partC_literature.questions.map((q: any, idx: number) => ({
    number: 5 + idx,
    questionNumber: `5${String.fromCharCode(97 + idx)}`,
    section: "Part C: Literature in English (The Cockcrow)",
    textTitle: q.sectionTitle,
    contextExtract: q.contextExtract,
    subQuestions: q.subItems,
    points: 2
  }))
];

export const SET_BECE_MOCK_2_ENGLISH_P1 = {
  year: "Mock 2",
  isMock: true,
  setNumber: 2,
  subject: "English Language",
  examination: "WAEC BECE English Language (National Mock 2)",
  title: "Paper 1: Objective Test (Mock 2)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedMock2EnglishP1,
  allQuestions: balancedMock2EnglishP1
};

export const SET_BECE_MOCK_2_ENGLISH_P2 = {
  year: "Mock 2",
  isMock: true,
  setNumber: 2,
  subject: "English Language",
  examination: "WAEC BECE English Language (National Mock 2)",
  title: "Paper 2: Written Essay, Comprehension & Literature (Mock 2)",
  durationMinutes: 90,
  totalQuestions: 9,
  instructions: "Answer three questions in all: one from Part A, all questions in Part B, and all questions in Part C.",
  sections: paper2EnglishMock2Calibrated,
  questions: flattenedEnglishMock2Paper2Questions
};

export const SET_BECE_MOCK_2_ENGLISH_COMPLETE = {
  year: "Mock 2",
  isMock: true,
  setNumber: 2,
  subject: "English Language",
  examination: "WAEC BECE English Language (National Mock 2)",
  paper1: SET_BECE_MOCK_2_ENGLISH_P1,
  paper2: SET_BECE_MOCK_2_ENGLISH_P2
};

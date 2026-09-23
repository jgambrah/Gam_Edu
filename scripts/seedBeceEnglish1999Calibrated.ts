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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 1999
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 11) ---
  {
    number: 1,
    prompt: "In Passage I, why was everyone in the school taken by surprise when the big bell tolled?",
    options: [
      "The students bumped into each other along the corridors",
      "They had to sprint urgently to the assembly hall",
      "They saw the headmaster standing grimly on the dais",
      "The bell was rung unexpectedly outside the normal scheduled hours"
    ],
    correctAnswer: "The bell was rung unexpectedly outside the normal scheduled hours",
    hint: "Reread the opening sentence: 'The persistent sound of the big bell at that time of the day surprised everybody.'",
    workedSolution: "The surprise was caused by the timing: the school bell was rung at an unusual hour when students were not expecting an assembly.",
    points: 1
  },
  {
    number: 2,
    prompt: "Why did the students race frantically to the assembly hall in Passage I?",
    options: [
      "The headmaster was visibly angry",
      "The headmaster commanded them to gather immediately",
      "The emergency bell tolled repeatedly and persistently",
      "The bell signaled the end of the school day"
    ],
    correctAnswer: "The emergency bell tolled repeatedly and persistently",
    hint: "A persistent, continuous bell signals an emergency summons requiring an instant response.",
    workedSolution: "The persistent ringing of the big bell signaled an urgent emergency, compelling all pupils to run to the assembly hall at once.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, why did the students burst into spontaneous, uncontrollable laughter?",
    options: [
      "Mr. Amoh stood before them with a grim countenance",
      "Kofi Smith the school footballer was among the thieves",
      "Akwesi Ameko the class prefect was unmasked",
      "Akwasi Osei, who was physically challenged on a crutch, was revealed as one of the thieves"
    ],
    correctAnswer: "Akwasi Osei, who was physically challenged on a crutch, was revealed as one of the thieves",
    hint: "The spectacle of a student with a withered leg on crutches participating in a burglary struck the crowd as absurd.",
    workedSolution: "The students exploded into laughter when Akwasi Osei appeared on a crutch, as no one expected a physically challenged student to engage in stealing.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the idiomatic expression 'at a loss' in 'Everybody was at a loss' means ............",
    options: ["dissatisfied", "angry", "completely bewildered and confused", "deeply sorrowful"],
    correctAnswer: "completely bewildered and confused",
    hint: "Puzzled, unable to understand or explain why something occurred.",
    workedSolution: "'At a loss' is an idiom meaning completely puzzled, perplexed, or unable to understand; 'completely bewildered and confused' is the exact meaning.",
    points: 1
  },
  {
    number: 5,
    prompt: "What statutory disciplinary sanction did the headmaster impose on the three culprits in Passage I?",
    options: [
      "He cautioned them sternly never to repeat the offense",
      "He ordered the senior housemaster to cane them publicly",
      "He summoned their parents for a formal conference",
      "He suspended them from attending school for two weeks"
    ],
    correctAnswer: "He suspended them from attending school for two weeks",
    hint: "Check the final sentence: 'the headmaster handed down the punishment – two weeks' suspension.'",
    workedSolution: "The headmaster officially handed down a disciplinary sentence of two weeks' rustication/suspension from the school.",
    points: 1
  },
  {
    number: 6,
    prompt: "According to Passage II, why was Obu hopelessly inattentive throughout the Christmas church service?",
    options: [
      "He was exhausted by the Christmas celebrations",
      "The harmattan haze was irritating his eyes",
      "He was completely captivated by admiring his new festive clothes and shoes",
      "He was fascinated by the church decorations"
    ],
    correctAnswer: "He was completely captivated by admiring his new festive clothes and shoes",
    hint: "Paragraph two notes that he caught himself admiring his clothes and shoes whenever the congregation sat down.",
    workedSolution: "Obu's vanity and total absorption in admiring his brand-new clothes and shoes made him inattentive to the church sermon.",
    points: 1
  },
  {
    number: 7,
    prompt: "Why were Obu's shoes particularly special and treasured by him in Passage II?",
    options: [
      "They were popularly nicknamed 'stand by'",
      "They represented the very first pair of footwear he had ever owned",
      "They made loud creaking noises as he walked",
      "They were imported from abroad"
    ],
    correctAnswer: "They represented the very first pair of footwear he had ever owned",
    hint: "Check paragraph two: '...his shoes, nicknamed \"stand by\", his first pair ever.'",
    workedSolution: "The narrative emphasizes that the shoes were precious to Obu because they were the first pair of shoes he had ever possessed in his life.",
    points: 1
  },
  {
    number: 8,
    prompt: "What does Passage II reveal concerning the conduct of the church choristers that morning?",
    options: [
      "They refused to wear their traditional choir robes",
      "They disliked singing Christmas hymns",
      "They sat in the pews to display their new festive clothes",
      "They felt too exhausted to stand during the procession"
    ],
    correctAnswer: "They sat in the pews to display their new festive clothes",
    hint: "Paragraph two states: 'Even the choristers who should have joined the procession preferred to sit with the rest of the congregation in order to show off their new clothes.'",
    workedSolution: "Like Obu, the choristers prioritized showing off their new holiday attire over their liturgical duties in the procession.",
    points: 1
  },
  {
    number: 9,
    prompt: "What was Obu's real motive for fabricating an excuse to go outside the chapel in Passage II?",
    options: [
      "The interior of the chapel had become unbearably warm",
      "He disliked the catechist's preaching style",
      "He genuinely needed to use the restroom",
      "He wanted to wear and display his embroidered cap in public"
    ],
    correctAnswer: "He wanted to wear and display his embroidered cap in public",
    hint: "He could not wear his cap inside church, so he preferred the dusty outdoor weather where his cap could be seen.",
    workedSolution: "Obu went outside specifically so he could put on his embroidered cap, which church etiquette forbade him from wearing indoors.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the observation 'He was not alone' signifies that Obu ............",
    options: [
      "was accompanied by his biological brothers",
      "sat beside his mother in the pew",
      "was not the only person eager to flaunt new holiday clothing",
      "walked with the church warden"
    ],
    correctAnswer: "was not the only person eager to flaunt new holiday clothing",
    hint: "The author observes that other churchgoers and even choristers were displaying their new garments.",
    workedSolution: "The phrase indicates that many other congregation members shared the same vanity of showing off their new clothes on Christmas Day.",
    points: 1
  },
  {
    number: 11,
    prompt: "In Passage II, the word 'relieve' in 'relieve himself outside' functions as a polite euphemism meaning to ............",
    options: [
      "alleviate his physical pain",
      "display his festive attire",
      "urinate or empty one's bowels",
      "rest from the church singing"
    ],
    correctAnswer: "urinate or empty one's bowels",
    hint: "A standard polite euphemism for using the toilet.",
    workedSolution: "'To relieve oneself' is a formal euphemism meaning to urinate or defecate; 'urinate or empty one's bowels' is the exact literal meaning.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "The team's lackluster performance made the head coach very anxious.\nChoose the word nearest in meaning to the underlined word 'anxious'.",
    options: ["hopeful", "angry", "jealous", "worried"],
    correctAnswer: "worried",
    hint: "Experiencing worry, nervousness, or unease about an uncertain outcome.",
    workedSolution: "'Anxious' means experiencing apprehension, nervousness, or concern; 'worried' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The Disciplinary Committee was directed to investigate the laboratory break-in.\nChoose the word nearest in meaning to the underlined word 'investigate'.",
    options: ["condemn", "go into", "determine", "look for"],
    correctAnswer: "go into",
    hint: "To inquire into, examine systematically, or probe deeply.",
    workedSolution: "The phrasal verb 'to go into' means to investigate, probe, or examine the details of a matter.",
    points: 1
  },
  {
    number: 14,
    prompt: "The invigilator could not bear the persistent whispering in the examination hall.\nChoose the word nearest in meaning to the underlined word 'bear'.",
    options: ["tolerate", "understand", "take in", "make out"],
    correctAnswer: "tolerate",
    hint: "To endure, put up with, or suffer without surrender.",
    workedSolution: "'Bear' in the context of enduring unpleasant conditions means to endure or 'tolerate'.",
    points: 1
  },
  {
    number: 15,
    prompt: "In a fit of temper, the student spoke to the headmaster in an impolite manner.\nChoose the word nearest in meaning to the underlined word 'impolite'.",
    options: ["foolish", "loud", "brave", "rude"],
    correctAnswer: "rude",
    hint: "Lacking good manners, civility, or proper respect.",
    workedSolution: "'Impolite' means discourteous, ill-mannered, and disrespectful; 'rude' is its direct equivalent.",
    points: 1
  },
  {
    number: 16,
    prompt: "Florence Nightingale was a renowned humanitarian and pioneer of modern nursing.\nChoose the word nearest in meaning to the underlined word 'renowned'.",
    options: ["strict", "humble", "brave", "famous"],
    correctAnswer: "famous",
    hint: "Known, celebrated, or acclaimed by many people.",
    workedSolution: "'Renowned' means famous, celebrated, and widely acclaimed; 'famous' is its exact synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "The announcement of the director's sudden inspection kept the prefects on their toes. This means the prefects ............",
    options: ["stood up immediately", "ran away from school", "were alert and ready for action", "became thoroughly fatigued"],
    correctAnswer: "were alert and ready for action",
    hint: "Staying vigilant, prepared, and actively attentive.",
    workedSolution: "The idiom 'on one's toes' means alert, watchful, energetic, and fully prepared for any immediate duty.",
    points: 1
  },
  {
    number: 18,
    prompt: "During his revision for the national examinations, Kwame left no stone unturned. This means that Kwame ............",
    options: [
      "found the syllabus difficult to master",
      "investigated and studied everything thoroughly",
      "was guaranteed a distinction",
      "cleared all stones from the compound"
    ],
    correctAnswer: "investigated and studied everything thoroughly",
    hint: "Doing everything possible and exploring every avenue to achieve a goal.",
    workedSolution: "The idiom 'to leave no stone unturned' means to do everything possible and explore every resource or method thoroughly.",
    points: 1
  },
  {
    number: 19,
    prompt: "For the sake of peaceful reconciliation, Kofi gave in to his brother after their bitter dispute. This means that Kofi ............",
    options: [
      "admitted defeat and yielded",
      "avoided his brother completely",
      "abandoned his family home",
      "defeated his brother in court"
    ],
    correctAnswer: "admitted defeat and yielded",
    hint: "Ceasing resistance and surrendering to another's position.",
    workedSolution: "The phrasal idiom 'to give in' means to cease opposition, yield, surrender, or admit defeat.",
    points: 1
  },
  {
    number: 20,
    prompt: "John was initially ahead of the class in mathematics, but we soon caught up with him. This means that ............",
    options: [
      "John was the tallest student in the class",
      "John withdrew himself from group studies",
      "we stood directly in front of John",
      "we reached the exact same level of achievement as John"
    ],
    correctAnswer: "we reached the exact same level of achievement as John",
    hint: "Closing a distance or gap and attaining parity with a competitor.",
    workedSolution: "'To catch up with someone' means to reach the same standard, level, or position after lagging behind.",
    points: 1
  },
  {
    number: 21,
    prompt: "Kwadwo turned a deaf ear to his mother's wise counsel. This means that Kwadwo ............",
    options: [
      "turned his damaged ear toward her",
      "deliberately refused to listen or obey",
      "blocked his ears with cotton",
      "had impaired hearing ability"
    ],
    correctAnswer: "deliberately refused to listen or obey",
    hint: "Refusing to pay attention, listen, or comply with advice.",
    workedSolution: "'To turn a deaf ear' is an idiom meaning to deliberately ignore, disregard, or refuse to listen to counsel.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "While Mensah was hopeful of securing the academic scholarship, his sister was remarkably ...... .",
    options: ["mindful", "afraid", "careful", "doubtful"],
    correctAnswer: "doubtful",
    hint: "'Hopeful' means feeling optimistic expectation. Find the word denoting uncertainty or lack of confidence.",
    workedSolution: "'Hopeful' means optimistic and expectant. Its direct antonym regarding expectations is 'doubtful' (uncertain or skeptical).",
    points: 1
  },
  {
    number: 23,
    prompt: "The headmaster condemned the prefect's unruly conduct, but ...... the library monitor's honesty.",
    options: ["reported", "pardoned", "confirmed", "praised"],
    correctAnswer: "praised",
    hint: "'Condemned' means expressed severe disapproval. Find the word that denotes expressing high approval.",
    workedSolution: "'Condemned' means officially denounced or criticized. Its direct antonym is 'praised' (commended or lauded).",
    points: 1
  },
  {
    number: 24,
    prompt: "Mary looked exceptionally attractive in her new ceremonial attire, whereas her partner appeared rather ...... .",
    options: ["comfortable", "clumsy", "happy", "proud"],
    correctAnswer: "clumsy",
    hint: "'Attractive' means pleasing, neat, and appealing in appearance. Find the word meaning awkward, inelegant, or unappealing.",
    workedSolution: "'Attractive' implies elegance and pleasing grace. In describing aesthetic posture and appearance, its antonym here is 'clumsy' (inelegant and awkward).",
    points: 1
  },
  {
    number: 25,
    prompt: "The melodious hymn soothed the congregation, whereas the brass band sounded harsh and ...... .",
    options: ["triumphant", "old", "strange", "discordant"],
    correctAnswer: "discordant",
    hint: "'Melodious' means sweet-sounding and harmonious. Find the word denoting clashing, unharmonious, and harsh sounds.",
    workedSolution: "'Melodious' means sweet and harmonious in sound. Its direct musical antonym is 'discordant' (harsh, clashing, and lacking harmony).",
    points: 1
  },
  {
    number: 26,
    prompt: "The landlord was indifferent to the tenant's domestic plight, but the neighbors were deeply ...... .",
    options: ["similar", "concerned", "stern", "kind"],
    correctAnswer: "concerned",
    hint: "'Indifferent' means uncaring, unconcerned, or cold. Find the word meaning caring and anxious about someone's welfare.",
    workedSolution: "'Indifferent' means showing a lack of interest, care, or sympathy. Its direct antonym is 'concerned' (caring, interested, and attentive).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (27 - 40) ---
  {
    number: 27,
    prompt: "Children should always look ...... their parents and guardians for guidance and moral support.",
    options: ["about", "up to", "at", "up for"],
    correctAnswer: "up to",
    hint: "Identify the phrasal verb meaning to view someone with respect, admiration, and expectation of guidance.",
    workedSolution: "The phrasal verb 'to look up to someone' means to respect, admire, and look to them as a role model or source of help.",
    points: 1
  },
  {
    number: 28,
    prompt: "Complete the mathematics test promptly and ...... your answer scripts to the invigilator.",
    options: ["hand up", "hand out", "hand down", "hand over"],
    correctAnswer: "hand over",
    hint: "Identify the phrasal verb meaning to submit, surrender, or deliver something formally into someone's custody.",
    workedSolution: "The phrasal verb 'to hand over' means to deliver, surrender, or submit documents or authority formally to an official.",
    points: 1
  },
  {
    number: 29,
    prompt: "You don't believe that superstitious rumor, ......?",
    options: ["isn't it", "do you", "won't you", "don't you"],
    correctAnswer: "do you",
    hint: "A negative statement with 'don't' takes an affirmative tag using the same present auxiliary: 'do you?'.",
    workedSolution: "The main clause has a negative present auxiliary ('don't believe') with subject 'you'. The matching question tag must be affirmative: 'do you?'.",
    points: 1
  },
  {
    number: 30,
    prompt: "Amina is an exceptionally well-behaved girl, ......?",
    options: ["isn't it", "doesn't she", "does she", "isn't she"],
    correctAnswer: "isn't she",
    hint: "An affirmative present statement with the linking verb 'is' and subject 'Amina' takes a negative tag: 'isn't she?'.",
    workedSolution: "The statement is affirmative with the copula 'is' and feminine subject 'Amina'. Its question tag must be negative: 'isn't she?'.",
    points: 1
  },
  {
    number: 31,
    prompt: "Do not disburse the wages to the laborer ...... he completes the weeding.",
    options: ["since", "until", "as", "yet"],
    correctAnswer: "until",
    hint: "Identify the conjunction denoting up to the specific point in time when an action is accomplished.",
    workedSolution: "'Until' (or 'till') is used to express up to the point in time that a condition is fulfilled ('until he finishes').",
    points: 1
  },
  {
    number: 32,
    prompt: "This is the brilliant schoolboy ...... notebook I borrowed yesterday.",
    options: ["whom", "which", "who", "whose"],
    correctAnswer: "whose",
    hint: "Use the possessive relative pronoun that modifies the noun 'notebook'.",
    workedSolution: "'Whose' is the relative possessive pronoun correctly showing ownership of the noun 'notebook'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Akosua ...... the classroom floor when the headmaster entered.",
    options: ["swept", "is sweeping", "has swept", "was sweeping"],
    correctAnswer: "was sweeping",
    hint: "An ongoing past continuous action interrupted by a sudden past simple event ('called / entered').",
    workedSolution: "The past continuous tense ('was sweeping') is required to express an ongoing past background activity interrupted by another past action.",
    points: 1
  },
  {
    number: 34,
    prompt: "After the grueling boxing tournament, the two competitors warmly congratulated ......",
    options: ["one another", "each other", "one other", "each another"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('the two boxers'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 35,
    prompt: "The villagers testified that Mr. Mensah was the ...... hardworking cocoa farmer in the district.",
    options: ["very most", "very more", "most", "more"],
    correctAnswer: "most",
    hint: "Form the superlative degree of multi-syllable adjectives preceded by 'the'.",
    workedSolution: "Multi-syllable adjectives like 'hardworking' form their superlative degree with 'most' ('the most hardworking'). 'Very most' is redundant.",
    points: 1
  },
  {
    number: 36,
    prompt: "The paramount chief traveled to the grand durbar grounds ...... horseback.",
    options: ["on", "by", "from", "above"],
    correctAnswer: "on",
    hint: "Identify the preposition used for riding an animal (horse, donkey, camel).",
    workedSolution: "In standard English idiomatic usage, animal riding is expressed as 'on horseback', never 'by horseback'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The supervisor is not in the office; in fact, he is ...... near this facility today.",
    options: ["thereby", "sometimes", "somewhat", "nowhere"],
    correctAnswer: "nowhere",
    hint: "Identify the negative locative adverb meaning not in or at any place.",
    workedSolution: "The phrase 'nowhere near' is an emphatic idiom meaning not close to or far away from a place.",
    points: 1
  },
  {
    number: 38,
    prompt: "Kweku discovered through bitter experience that ...... brings lasting peace of mind.",
    options: ["to be telling the truth", "tell the truth", "having told the truth", "telling the truth"],
    correctAnswer: "telling the truth",
    hint: "Use a gerund phrase functioning as the subject of the subordinate noun clause.",
    workedSolution: "The gerund phrase 'telling the truth' functions smoothly and grammatically as the subject of the clause.",
    points: 1
  },
  {
    number: 39,
    prompt: "The Oseis are our reliable neighbors; they ...... beside our compound for twenty years now.",
    options: ["stay", "were stayed", "stayed", "have stayed"],
    correctAnswer: "have stayed",
    hint: "An action that began in the past and continues up to the present with 'for twenty years now' requires the Present Perfect tense.",
    workedSolution: "The duration phrase 'for twenty years now' indicating an ongoing state from the past into the present requires the Present Perfect tense ('have stayed').",
    points: 1
  },
  {
    number: 40,
    prompt: "The clerk was certain that he had handed the ledger to ...... else in the office.",
    options: ["anyone", "someone", "somebody", "everybody"],
    correctAnswer: "someone",
    hint: "Use 'someone' in affirmative statements to denote an unspecified person.",
    workedSolution: "In affirmative declarative sentences, 'someone' is standard when referring to an unspecified person ('someone else'). 'Anyone' is used in questions and negative clauses.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199901);

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
        prompt: "Write a letter to your younger brother who is about to complete primary school, giving him at least two convincing reasons why he should choose to attend your Junior Secondary School.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 45
Nkawkaw, Eastern Region
12th June, 1999

Dear Kweku,

I hope this letter finds you in good health and studying hard as your final primary school examinations approach. I am writing to strongly advise you to select my school, Methodist Junior Secondary School, for your basic three-year secondary education.

First and foremost, our school possesses a dedicated teaching staff and a legendary record of academic distinction in the Basic Education Certificate Examination (BECE). Unlike other schools where teachers frequently miss instructional periods, our masters are punctual, thorough, and patient. They organize free remedial classes in Mathematics and Integrated Science and provide past examination questions for practice. For four consecutive years, our school has achieved a one hundred percent pass rate, with over eighty percent of candidates gaining admission into first-class Senior Secondary Schools. Enrolling here guarantees you a solid intellectual foundation.

Secondly, our school provides modern practical training facilities. We have a well-equipped technical workshop where students learn practical woodwork and technical drawing, as well as a functional science laboratory. Beyond academics, our school boasts an active sports club, an award-winning cultural dance troupe, and a disciplined cadet corps that instills leadership and self-confidence.

Our headmaster emphasizes moral discipline, and bullying is strictly prohibited. I will be here to mentor and guide you through your first year.

Please inform Father and Mother of your decision. I look forward to welcoming you to our school.

Your loving elder brother,
[Signature]
Kwabena Osei`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Write a letter to your local Assemblyman or Assemblywoman highlighting two pressing social amenities that should be urgently provided for the people in your electoral area.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Dormaa Ahenkro, Bono Region
18th October, 1999

The Assemblyman
Dormaa Central Electoral Area
Municipal Assembly, Dormaa Ahenkro

Dear Sir,

PETITION FOR THE PROVISION OF POTABLE WATER AND A COMMUNITY CLINIC IN OUR ELECTORAL AREA

On behalf of the youth and residents of Dormaa Central, I respectfully write to congratulate you on your civic leadership and to draw your urgent attention to two critical infrastructure projects that are desperately needed to safeguard the health and well-being of our community.

First, our electoral area suffers from an acute shortage of potable drinking water. For over six months, the community hand-dug wells have dried up, forcing women and schoolchildren to trek more than four kilometers daily to fetch untreated, stagnant water from the Pamu stream. Children spend early morning hours carrying water basins instead of studying, resulting in chronic school lateness and fatigue. Even worse, the consumption of contaminated water has triggered recurrent outbreaks of cholera, bilharzia, and dysentery. We urgently appeal to the Municipal Assembly to drill and mechanize two commercial boreholes equipped with overhead storage tanks.

Secondly, our community requires a functional primary health post. Currently, pregnant mothers and accident victims must travel twenty kilometers over rough roads to reach the district hospital. On several occasions, critically ill infants have died in transit. Constructing a modest community clinic staffed by a resident midwife and community health nurse will provide immediate emergency care, maternal delivery services, and immunizations.

We trust that your esteemed office will champion these vital amenities in the upcoming assembly budget.

Thank you.

Yours faithfully,
[Signature]
Emmanuel Addo
(Youth Secretary)`
      },
      {
        questionNumber: "3",
        category: "Descriptive Report / Narrative",
        prompt: "The schools in your district recently held an annual inter-zonal athletics and sports competition. Describe what happened during the memorable three-day event.",
        modelAnswer: `THE 1999 DISTRICT INTER-ZONAL ATHLETICS COMPETITION

The municipal sports stadium erupted in a carnival of vibrant colors, beating drums, and athletic excellence as eight basic schools in our district assembled for the annual three-day Inter-Zonal Sports Competition last Wednesday.

The tournament opened with an impressive ceremonial parade. Dressed in crisp school sportswear, the athlete contingents marched past the presidential dais to stirring brass band melodies, saluting the District Director of Education. The competitive spirit was ignited on the first day during the track heats, where our school sprinter, Master Kofi Smith, dominated both the 100-meter and 200-meter dashes, setting a new district record of 11.4 seconds.

The field events on Thursday produced thrilling drama. In the senior high jump, Miss Abena Serwaa cleared an incredible height of 1.48 meters, clinching a gold medal that threw our supporters into deafening cheers. However, the undisputed climax of the entire championship took place on Friday afternoon during the boys' 4x100-meter relay finals.

Trailing behind Anglican JSS in the third leg, our anchor runner received the baton smoothly, accelerated around the final bend like a speeding locomotive, and lunged across the finish line inches ahead of his rival. The entire stadium rose to its feet in wild jubilation as our school contingent danced around the oval carrying the championship trophy aloft.

The competition closed with the presentation of trophies and certificates by the District Chief Executive, who commended all participants for their exemplary sportsmanship. It was a triumphant week that brought immense pride and glory to our institution.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Your parents traveled out of town and left you in charge of the family house for an entire day. Narrate to your friends what you did and how you managed the household responsibilities.",
        modelAnswer: `MY DAY AS HEAD OF THE HOUSEHOLD

Last Saturday, my parents traveled to Kumasi to attend the funeral of an elderly relative, leaving me in complete charge of our four-bedroom family house and my two younger siblings, Kwaku and Akosua. It was my first time shouldering such domestic responsibility, and I was determined to prove my maturity.

Immediately after their commercial bus departed at dawn, I convened a brief meeting with my siblings at the breakfast table. I assigned morning chores systematically: while Kwaku swept the compound and fed our domestic poultry, Akosua washed the breakfast dishes, and I scrubbed the bathroom and mopped the living room floor. By eight o'clock, the entire compound was immaculate.

At noon, I took charge of the kitchen. Remembering Mother's culinary instructions, I peeled plantains and cocoyams, boiled fresh garden eggs and tomatoes, and prepared a delicious pot of vegetable stew with smoked mackerel. My siblings commended my cooking and cleared their plates within minutes. After lunch, I enforced a strict ninety-minute study period where I supervised Kwaku and Akosua in completing their Mathematics and English weekend homework.

The only moment of anxiety occurred late in the afternoon when our neighboring farmer's stray goat broke into our vegetable garden. I mobilized my brother, chased the animal out, and repaired the wooden fence with hammer and nails. When dusk settled, I locked all security gates, ensured the windows were latched, and switched on the security floodlights.

When Mother and Father returned at nine o'clock that evening to find the house peaceful, clean, and secure, Father shook my hand proudly, while Mother gave me a warm embrace. It was an exhausting day, but I felt deeply fulfilled knowing that I had earned my parents' absolute trust.`
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

async function seedBeceEnglish1999Calibrated() {
  console.log("Seeding Calibrated & Balanced BECE English 1999 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1999");
  await docRef.set({
    year: 1999,
    title: "BECE English Language 1999 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 1999 successfully seeded into Firestore!");
}

seedBeceEnglish1999Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1999:", err);
    process.exit(1);
  });

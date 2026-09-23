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
// ISOMORPHIC PASSAGE I: THE RETIRING HEADMASTER'S SEND-OFF (CALIBRATED)
// =========================================================================
const passage1Text = `Mr. Kobi, taking the podium as the next guest speaker, remarked that although several years had elapsed since he completed his basic education, he still remembered with profound gratitude all that the headmaster had done to ensure that pupils under his tutelage were thoroughly equipped for future life. He voiced deep sorrow that the headmaster had chosen to retire at so young an age. This untimely decision, he noted, would deny future cohorts of students the benefit of his seasoned guidance long before such departure was necessary. Nevertheless, he wished the veteran administrator abundant success and longevity in his retirement, presenting him with an engraved silver tray as a token of the deep respect and high esteem in which his former pupils held him.

Following the formal presentation of the tray, the retiring headmaster stepped forward to deliver his valedictory address. He opened his speech by offering a brief retrospective of his stewardship at the helm of the institution. He emphasized that his steadfast objective had always been to give his absolute best to every pupil entrusted to his care. He expressed heartfelt appreciation to the dedicated tutors on his teaching staff for their diligence, patience, and self-sacrifice over the years.

Finally, he spoke of his delight that he was being succeeded in office by Mr. Smith, a veteran tutor who had taught in the school for many years. He affirmed his conviction that Mr. Smith enjoyed the widespread admiration and respect of all who interacted with him. He concluded by urging all alumni to maintain an active interest in the progress of the school after his departure, pledging that he would personally continue to do so.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, why was Mr. Kobi unhappy about the headmaster's early retirement?",
    options: [
      "The headmaster had not served long enough to receive a pension",
      "The departure would deprive current and future pupils of his valuable guidance",
      "The alumni association had not finished preparing their gifts",
      "The incoming headmaster was unfamiliar with the school traditions"
    ],
    correctAnswer: "The departure would deprive current and future pupils of his valuable guidance",
    hint: "Reread paragraph one: he noted that early retirement would deprive the pupils of his assistance long before it was necessary.",
    workedSolution: "Mr. Kobi regretted the early departure because it would deny pupils the benefit of the headmaster's seasoned mentorship prematurely.",
    points: 1
  },
  {
    number: 2,
    prompt: "Which of the following assertions is NOT true of the retiring headmaster according to Passage I?",
    options: [
      "He was widely despised and resented by the community",
      "He had labored diligently during his tenure as administrator",
      "He felt genuine satisfaction and happiness about his successor",
      "He had dedicated many years of service to the institution"
    ],
    correctAnswer: "He was widely despised and resented by the community",
    hint: "Paragraph one notes he was held in high esteem, and former pupils respected him deeply.",
    workedSolution: "The passage emphasizes that the headmaster was held in high esteem and revered by both alumni and staff; claiming he was hated or despised is completely false.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, the word 'brief' in 'a brief retrospective of his stewardship' means ............",
    options: [
      "absolutely essential",
      "truthful and accurate",
      "short and concise",
      "admirable in quality"
    ],
    correctAnswer: "short and concise",
    hint: "'Brief' means of short duration or concise.",
    workedSolution: "'Brief' means short in duration or concise in form; 'short and concise' is its direct meaning.",
    points: 1
  },
  {
    number: 4,
    prompt: "According to Passage I, what reputation did the incoming headmaster, Mr. Smith, possess?",
    options: [
      "He was admired and respected by many people who knew him",
      "He was favoured only by the retiring headmaster",
      "He was known primarily as an unyielding disciplinarian",
      "He had only recently joined the school staff"
    ],
    correctAnswer: "He was admired and respected by many people who knew him",
    hint: "Check paragraph three: 'Mr. Smith was generally admired and respected by all who knew him.'",
    workedSolution: "The retiring headmaster noted that Mr. Smith was widely admired, respected, and held in high regard by everyone in the school community.",
    points: 1
  },
  {
    number: 5,
    prompt: "What explicit pledge did the retiring headmaster make regarding the school after his exit?",
    options: [
      "He promised to continue teaching part-time classes",
      "He pledged to continue taking an active interest in the school",
      "He vowed to inspect classroom lesson notes regularly",
      "He promised to purchase modern equipment for the science lab"
    ],
    correctAnswer: "He pledged to continue taking an active interest in the school",
    hint: "Look at the final sentence: he urged alumni to take an interest and promised that he would certainly do so himself.",
    workedSolution: "The headmaster promised that even in retirement, he would personally continue to take a keen interest in the school's progress.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: TELEVISION AND ITS INFLUENCE (CALIBRATED)
// =========================================================================
const passage2Text = `It is not difficult to understand why television holds such powerful appeal for both children and adults. Situated comfortably within the home, it can be viewed at leisure whenever one desires. Moreover, it serves as a welcome avenue for rest and recreation following a strenuous day of labor. Television also broadens our horizon, enabling viewers to observe unfamiliar lands, diverse cultures, and contemporary global developments. Even individuals with minimal or no formal literacy can watch and appreciate its visual presentations.

Regrettably, television consumes an excessive portion of our daily hours. To watch a broadcast, an individual must remain seated before the screen for its entire duration, accomplishing virtually nothing else. This monopolizing nature of television—the reality that it crowds out other productive endeavors—generates far more grave consequences than is commonly acknowledged. While television may afford tired adults a harmless means of relaxation after office hours, it deprives school-going children of vital time that ought to be dedicated to study and household responsibilities.

Furthermore, by no means is every program broadcast on television wholesome or beneficial. Even where dedicated children's broadcasts exist, parents cannot guarantee that their wards will restrict themselves to such content. Indeed, contemporary observations show that young children frequently view programs produced exclusively for adult audiences. A probable consequence of this unchecked exposure is that children are introduced to adult themes prematurely, at an impressionable age when they are most susceptible to negative influence.`;

const passage2Questions = [
  {
    number: 6,
    prompt: "According to Passage II, why is television viewing widely attractive to adult audiences?",
    options: [
      "It resolves complicated domestic and economic crises",
      "It provides a convenient and restful means of relaxation after work",
      "It is an extraordinarily beautiful electrical appliance",
      "It replaces the need for formal schooling entirely"
    ],
    correctAnswer: "It provides a convenient and restful means of relaxation after work",
    hint: "Reread paragraph one: it is accessible in the home and provides entertainment after a day's work.",
    workedSolution: "The text explains that adults are drawn to television because it provides comfort, convenient entertainment, and relaxation after working hours.",
    points: 1
  },
  {
    number: 7,
    prompt: "What is the author's primary concern regarding children's television habits in Passage II?",
    options: [
      "Children should watch television exclusively in the company of parents",
      "Children should refrain from watching all programs indiscriminately",
      "Children must complete their meals while watching screens",
      "Children ought to master adult themes as early as possible"
    ],
    correctAnswer: "Children should refrain from watching all programs indiscriminately",
    hint: "Paragraph two and three warn that not everything on television is good and children should not watch adult content.",
    workedSolution: "The author argues that children should be protected from adult content and should not be allowed to watch programs indiscriminately.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the word 'poses' in 'poses more serious problems' means ............",
    options: [
      "alleviates",
      "presents and creates",
      "increases",
      "determines"
    ],
    correctAnswer: "presents and creates",
    hint: "To pose a problem means to present, produce, or bring about a difficulty.",
    workedSolution: "'Poses' in this context means presents, constitutes, or creates; 'presents and creates' is its exact equivalent.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which of the following statements is NOT true about television according to Passage II?",
    options: [
      "Television offers entertainment to tired viewers",
      "Television enables people to explore distant cultures and communities",
      "Individuals without formal literacy can watch and enjoy its programs",
      "Every single household in the country owns a television set"
    ],
    correctAnswer: "Every single household in the country owns a television set",
    hint: "The author discusses television's benefits and drawbacks, but never claims that everyone owns one.",
    workedSolution: "The passage discusses the nature and risks of television viewing, but nowhere does it assert that every person or home possesses one.",
    points: 1
  },
  {
    number: 10,
    prompt: "From the overall tone of Passage II, the author can best be described as ............",
    options: [
      "deeply concerned and troubled by the prevailing situation",
      "advocating for the total prohibition of television broadcasting",
      "an executive producer of children's television films",
      "indifferent to the cultural effects of modern mass media"
    ],
    correctAnswer: "deeply concerned and troubled by the prevailing situation",
    hint: "Notice the author's warnings about time-wasting and children being exposed to adult themes too early.",
    workedSolution: "The author is unhappy with how television monopolizes time and exposes impressionable children to adult content, showing deep concern about the current situation.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 2000 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "The senior housemaster directed the prefect to summon an emergency meeting of the student council.\nChoose the word nearest in meaning to 'summon'.",
    options: ["preside over", "call", "cancel", "adjourn"],
    correctAnswer: "call",
    hint: "To order someone to come, or to convene a formal gathering.",
    workedSolution: "'Summon' means to convene, assemble, or 'call' a meeting; 'call' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The attitude of the security gatekeeper was remarkably hostile toward visitors.\nChoose the word nearest in meaning to 'hostile'.",
    options: ["unfriendly", "puzzling", "disturbing", "curious"],
    correctAnswer: "unfriendly",
    hint: "Unwelcoming, harsh, antagonistic, or aggressive.",
    workedSolution: "'Hostile' means antagonistic, aggressive, or 'unfriendly'; 'unfriendly' is its exact equivalent.",
    points: 1
  },
  {
    number: 13,
    prompt: "After weeding two acres under the blazing afternoon sun, the farmhand returned home exhausted.\nChoose the word nearest in meaning to 'exhausted'.",
    options: ["disturbed", "broken down", "disheartened", "worn out"],
    correctAnswer: "worn out",
    hint: "Depleted of energy; completely tired out.",
    workedSolution: "'Exhausted' means completely depleted of physical energy; 'worn out' (or tired) is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The external auditor was appointed to go over the commercial firm's financial accounts thoroughly.\nChoose the word nearest in meaning to 'go over'.",
    options: ["calculate", "settle", "inspect", "present"],
    correctAnswer: "inspect",
    hint: "To examine, check, or audit carefully for accuracy.",
    workedSolution: "The phrasal verb 'to go over' records or accounts means to examine, check, or 'inspect' them carefully.",
    points: 1
  },
  {
    number: 15,
    prompt: "The emulsion coating applied to the exterior walls of the library was durable.\nChoose the word nearest in meaning to 'durable'.",
    options: ["lasting", "costly", "decorative", "attractive"],
    correctAnswer: "lasting",
    hint: "Able to withstand wear, pressure, or damage over a long period.",
    workedSolution: "'Durable' means long-lasting, sturdy, and capable of enduring wear; 'lasting' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "Musa sternly advised his classmate to mind his own business. This means that Musa's classmate should ............",
    options: [
      "concentrate on commercial buying and selling",
      "refrain from meddling in other people's personal affairs",
      "worry about his own family chores only",
      "refuse to offer assistance to his neighbors"
    ],
    correctAnswer: "refrain from meddling in other people's personal affairs",
    hint: "To not interfere in matters that do not concern you.",
    workedSolution: "The idiom 'to mind one's own business' means to refrain from interfering or meddling in the private affairs of others.",
    points: 1
  },
  {
    number: 17,
    prompt: "Mother reserves the sweetest mangoes for Patrick because he is the apple of her eye. This means that Patrick is ............",
    options: [
      "her most obedient and respectful child",
      "her youngest biological son",
      "the person she cherishes and loves most",
      "the most industrious student in the home"
    ],
    correctAnswer: "the person she cherishes and loves most",
    hint: "Someone who is cherished above all others.",
    workedSolution: "The idiom 'the apple of one's eye' refers to someone who is cherished, treasured, and loved above all others.",
    points: 1
  },
  {
    number: 18,
    prompt: "During periods of high food inflation, many wage earners struggle to make ends meet. This means they ............",
    options: [
      "fail to prepare delicious meals",
      "struggle to live within their financial income",
      "reside in cramped rented apartments",
      "purchase expensive luxury commodities"
    ],
    correctAnswer: "struggle to live within their financial income",
    hint: "Having barely enough income to cover necessary expenses.",
    workedSolution: "The idiom 'to make ends meet' means to earn just enough money to cover essential living costs or live within one's income.",
    points: 1
  },
  {
    number: 19,
    prompt: "Esi proved to be such an exemplary school prefect that we were urged to take a leaf out of her book. This means we were encouraged to ............",
    options: [
      "follow her praiseworthy example",
      "attempt to break her athletic records",
      "seek her private advice frequently",
      "read through her personal library books"
    ],
    correctAnswer: "follow her praiseworthy example",
    hint: "To emulate or imitate someone's good behavior.",
    workedSolution: "The idiom 'to take a leaf out of someone's book' means to emulate, imitate, or follow their admirable example.",
    points: 1
  },
  {
    number: 20,
    prompt: "Before leaving for the market, Auntie Mansa requested her neighbor to keep an eye on her children. This means the neighbor should ............",
    options: [
      "play outdoor games with the children",
      "watch and look after the children attentively",
      "follow the children wherever they walk",
      "stare at the children continuously"
    ],
    correctAnswer: "watch and look after the children attentively",
    hint: "To watch over or take care of someone for a period.",
    workedSolution: "The idiom 'to keep an eye on someone' means to watch over, guard, or look after them attentively.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "Rather than doing anything to hinder my revision, my study partner did everything to ...... me.\nChoose the word most nearly opposite in meaning to 'hinder'.",
    options: ["reduce", "assist", "comprehend", "excuse"],
    correctAnswer: "assist",
    hint: "'Hinder' means to obstruct, delay, or impede. What word denotes helping or giving aid?",
    workedSolution: "'Hinder' means to create difficulties or impede progress. Its direct antonym is 'assist' (or help).",
    points: 1
  },
  {
    number: 22,
    prompt: "While civilized societies seek to preserve historical monuments, vandals often attempt to ...... them.\nChoose the word most nearly opposite in meaning to 'preserve'.",
    options: ["abolish", "condemn", "destroy", "produce"],
    correctAnswer: "destroy",
    hint: "'Preserve' means to keep safe, maintain, or protect. What word denotes ruining or tearing down completely?",
    workedSolution: "'Preserve' means to protect or keep intact. Its direct antonym is 'destroy' (to ruin or demolish).",
    points: 1
  },
  {
    number: 23,
    prompt: "The commercial firm engaged Mary as a sales representative, but ...... her colleague for gross indiscipline.\nChoose the word most nearly opposite in meaning to 'engaged'.",
    options: ["dismissed", "exempted", "disqualified", "suspended"],
    correctAnswer: "dismissed",
    hint: "'Engaged' in employment means hired or employed. What word means terminated or fired from service?",
    workedSolution: "'Engaged' in labor contexts means hired or employed. Its direct opposite is 'dismissed' (discharged or fired).",
    points: 1
  },
  {
    number: 24,
    prompt: "While the valley soil is fertile, the rocky hillside ground is remarkably ...... .\nChoose the word most nearly opposite in meaning to 'fertile'.",
    options: ["shallow", "porous", "poor", "hard"],
    correctAnswer: "poor",
    hint: "'Fertile' soil produces abundant crops. What word denotes lacking nutrients or unproductive?",
    workedSolution: "'Fertile' describes soil rich in nutrients. In agricultural grading, its common antonym is 'poor' (or barren/infertile).",
    points: 1
  },
  {
    number: 25,
    prompt: "Formerly, basic school pupils trekked eight miles to class, but ...... modern transit buses convey them.\nChoose the word most nearly opposite in meaning to 'formerly'.",
    options: ["sometimes", "now", "recently", "usually"],
    correctAnswer: "now",
    hint: "'Formerly' refers to a past era. What temporal adverb refers to the present time?",
    workedSolution: "'Formerly' refers to the past. Its direct temporal antonym contrasting past conditions with the present is 'now'.",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "When the electric lights suddenly went off, Kwame ...... his evening meal.",
    options: ["have eaten", "am eating", "have been eating", "was eating"],
    correctAnswer: "was eating",
    hint: "An ongoing past continuous action ('was eating') interrupted by a sudden past simple event ('went off').",
    workedSolution: "A continuous background activity in the past interrupted by a sudden action takes the Past Continuous tense: 'was eating'.",
    points: 1
  },
  {
    number: 27,
    prompt: "The textile factory had to ...... fifty workers due to a severe decline in demand.",
    options: ["lay down", "put off", "put away", "lay off"],
    correctAnswer: "lay off",
    hint: "Identify the phrasal verb meaning to terminate or dismiss workers because of economic redundancy.",
    workedSolution: "The phrasal verb 'to lay off' means to discharge or dismiss employees because of a lack of production or work.",
    points: 1
  },
  {
    number: 28,
    prompt: "We ...... to play an inter-schools return match last Friday.",
    options: ["have", "were", "ought", "are"],
    correctAnswer: "were",
    hint: "Past obligation/arrangement: 'were to [infinitive]' expresses a scheduled past arrangement.",
    workedSolution: "In expressing a past scheduled arrangement or plan ('last Friday'), English requires 'were to play'. 'Ought' would require 'to' already in its auxiliary form.",
    points: 1
  },
  {
    number: 29,
    prompt: "In the thick fog, it was not obvious ...... signboard he was pointing to.",
    options: ["the one to which", "which one", "one which", "as to that"],
    correctAnswer: "which one",
    hint: "Indirect question/noun clause asking for selection among alternatives: 'which one'.",
    workedSolution: "The interrogative phrase 'which one' smoothly introduces the dependent noun clause: 'It was not obvious which one he was pointing to.'",
    points: 1
  },
  {
    number: 30,
    prompt: "The candidate had forgotten all ...... the instructor explained the previous week.",
    options: ["that", "which", "what", "those"],
    correctAnswer: "that",
    hint: "Following the universal indefinite pronoun 'all', standard grammar prefers the relative pronoun 'that'.",
    workedSolution: "When the antecedent is the quantifier 'all' referring to things, the relative pronoun 'that' is preferred over 'which': 'all that you told me'.",
    points: 1
  },
  {
    number: 31,
    prompt: "Selfish individuals are in the habit of considering ...... before anyone else.",
    options: ["oneself", "yourselves", "themselves", "himself"],
    correctAnswer: "themselves",
    hint: "The plural antecedent 'Selfish people' requires the third-person plural reflexive pronoun.",
    workedSolution: "The plural subject 'Selfish people' requires the plural reflexive pronoun 'themselves'.",
    points: 1
  },
  {
    number: 32,
    prompt: "...... the wristwatch is quite old, it still keeps accurate time.",
    options: ["Although", "Despite", "Since", "Because"],
    correctAnswer: "Although",
    hint: "Subordinating conjunction of concession introducing a clause with subject and verb: 'Although + subject + verb'.",
    workedSolution: "'Although' is a concessive conjunction that introduces a finite clause ('Although the watch is old...'). 'Despite' is a preposition requiring a noun phrase.",
    points: 1
  },
  {
    number: 33,
    prompt: "The language tutor asked the new pupil how ...... French he had learned in primary school.",
    options: ["many", "few", "little", "much"],
    correctAnswer: "much",
    hint: "'French' (language ability) is an uncountable non-count noun. Use this interrogative quantifier.",
    workedSolution: "Language proficiency is treated as an uncountable noun, requiring the quantifier 'much' ('how much French'). 'Many' applies only to countable nouns.",
    points: 1
  },
  {
    number: 34,
    prompt: "Kwaku's eyewitness testimony ...... to be thoroughly cross-checked by the police.",
    options: ["needing", "needs", "is needing", "will have need"],
    correctAnswer: "needs",
    hint: "Singular non-count subject 'testimony/evidence' with a stative verb takes the simple present singular inflection.",
    workedSolution: "The singular subject 'evidence/testimony' takes the simple present verb 'needs'. Stative verbs like 'need' are not used in continuous forms (*is needing).",
    points: 1
  },
  {
    number: 35,
    prompt: "The headmistress announced that they could not postpone ...... the school any longer.",
    options: ["re-opening", "re-open", "to have re-opened", "having re-opened"],
    correctAnswer: "re-opening",
    hint: "The transitive verb 'postpone' is followed by a gerund (verb-ing), not an infinitive.",
    workedSolution: "In English verb catenation, the verb 'postpone' requires a gerund complement: 'postpone re-opening'.",
    points: 1
  },
  {
    number: 36,
    prompt: "You know very well that the laboratory accident was no fault of ......",
    options: ["my", "I", "me", "mine"],
    correctAnswer: "mine",
    hint: "Double possessive construction: 'no fault of' requires an absolute possessive pronoun.",
    workedSolution: "The idiomatic prepositional phrase is 'no fault of mine', which uses the absolute possessive pronoun 'mine'.",
    points: 1
  },
  {
    number: 37,
    prompt: "You are not seriously injured, ......?",
    options: ["were you", "did you", "are you", "do you"],
    correctAnswer: "are you",
    hint: "A negative present statement with 'are not' and subject 'you' takes the affirmative tag 'are you?'.",
    workedSolution: "The statement is negative present with auxiliary 'are not'. Its corresponding question tag must be affirmative: 'are you?'.",
    points: 1
  },
  {
    number: 38,
    prompt: "The hostel master stated that he did not mind ...... early to attend the lecture.",
    options: ["you go", "your go", "you to go", "your going"],
    correctAnswer: "your going",
    hint: "The verb 'mind' takes a gerund, which is formally modified by a possessive determiner ('your going').",
    workedSolution: "In formal prescriptive English, the verb 'mind' is followed by a gerund preceded by a possessive pronoun: 'your going home early'.",
    points: 1
  },
  {
    number: 39,
    prompt: "All ...... to achieve distinction in the examination is consistent revision.",
    options: ["what I need", "to need", "that I need", "to be needed"],
    correctAnswer: "that I need",
    hint: "When 'all' means the only thing, it is modified by a relative clause introduced by 'that'.",
    workedSolution: "The relative clause modifying 'All' (meaning the single thing) takes 'that': 'All that I need is...'. Standard English rejects *All what I need.",
    points: 1
  },
  {
    number: 40,
    prompt: "Whenever anyone greets you courteously, it is proper manners to return ...... greeting.",
    options: ["your", "its", "their", "anyone"],
    correctAnswer: "their",
    hint: "Indefinite singular pronouns like 'anyone' or 'someone' are referenced by the gender-neutral singular pronoun 'their'.",
    workedSolution: "In modern standard English, the singular indefinite pronoun 'anyone' is referred to by the gender-neutral pronoun 'their' ('return their greeting').",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200003);

// Attach Passage I (Q1-5) and Passage II (Q6-10) directly to questions so that
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
    passageTitle = "Passage I: The Retiring Headmaster's Send-off";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 6 && qNum <= 10) {
    passageTitle = "Passage II: Television and its Influence";
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
const passage2Items = balancedPaper1.slice(5, 10);
const remainingItems = balancedPaper1.slice(10);

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
        prompt: "Write a letter to the Chairman of the Town Development Committee of your area, drawing his attention to the deplorable sanitation situation in your community and suggesting at least two practical measures to improve it.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
12th May, 2000

The Chairman
Town Development Committee
Bekwai Municipal Directorate
Bekwai

Dear Sir,

PETITION REGARDING POOR SANITATION AND PROPOSALS FOR IMPROVEMENT

I respectfully write to draw your urgent attention to the deplorable state of environmental sanitation in the Bekwai township, and to suggest two practical measures that our community can implement to avert an impending public health crisis.

Over the past few months, refuse heaps in our residential quarters have remained uncollected for weeks, spilling onto main streets and blocking drainage channels. Swarms of flies, mosquitoes, and scavenging animals now infest these dumpsites. When it rains, filthy run-off washes into open roadside gutters, emitting nauseating odors and contaminating shallow hand-dug wells. Consequently, our local clinic has recorded an alarming surge in preventable waterborne diseases such as cholera, malaria, and dysentery, with children being the most vulnerable victims.

To address this crisis effectively, I suggest, first, that the Town Development Committee collaborate with the Municipal Environmental Health Directorate to procure communal waste containers for every electoral zone. These containers must be emptied by municipal sanitation trucks on a strict bi-weekly schedule to prevent overflow. Additionally, households should be supplied with covered bins and educated on proper domestic waste segregation.

Secondly, our committee should revive the traditional communal labor system by designating the first Saturday of every month as a mandatory Community Clean-up Day. Mobilizing residents, market traders, and youth groups to desilt choked gutters, clear overgrown bushy plots, and sweep public avenues will foster civic pride and keep our surroundings clean.

We count on your proactive leadership to restore cleanliness and health to our beloved town.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Representative)`
      },
      {
        questionNumber: "2",
        category: "Informal Letter",
        prompt: "Write a letter to your friend attending school in another town, describing not less than two fascinating landmarks or cultural features of your hometown and inviting him or her to visit.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 2000

Dear Kwaku,

I hope this letter finds you in fine health and high spirits in Kumasi. I am writing to share with you some of the extraordinary and fascinating features of my hometown, Begoro, and to warmly invite you to spend our upcoming mid-term vacation with my family.

Begoro is blessed with two breathtaking geographical and cultural attractions that leave every visitor spellbound. First, our town is home to the majestic Osuben Mountain Waterfalls. Tucked away within a pristine virgin forest, the waterfall cascades down a sixty-meter rocky escarpment into a clear, natural swimming pool surrounded by emerald ferns and singing tropical birds. The air is delightfully cool and misty, offering a serene escape from the heat and noise of urban life. Walking through the mountain trails leading to the falls feels like stepping into a paradise.

Secondly, our town is celebrated for the historic Begoro Sacred Stone Sanctuary and the vibrant annual Odweira Festival. According to ancient oral tradition, our founding ancestors were guided to this fertile ridge by spiritual signs manifested on sacred granite monoliths. During the festival, the paramount chief and divisional rulers are carried through the streets in majestic palanquins accompanied by thunderous fontomfrom drumming, musket volleys, and colorful traditional dancing. The hospitality of our people during this festive season is legendary, with households preparing delicious pots of spiced game soup and pounded fufu for visitors.

My parents have already prepared our guest room for you. Please write back to confirm your arrival date so I can meet you at the central lorry station.

Your true friend,
[Signature]
Emmanuel Addo`
      },
      {
        questionNumber: "3",
        category: "Narrative Traditional Story",
        prompt: "Narrate to your classmates an engaging, moral traditional story that your grandmother told you during moonlight evenings.",
        modelAnswer: `THE GREEDY TORTOISE AND THE CELESTIAL BANQUET

On a cool, moonlit evening in our village compound, my grandmother gathered my siblings and me around a crackling hearth and shared a fascinating folktale about Ananse the spider and his cunning friend, Kweku Tortoise.

During an unprecedented famine on earth, the birds of the air held a grand feast in the heavens. Desperate for food, the smooth-shelled Tortoise persuaded the compassionate birds to each lend him a feather, enabling him to fashion wings and fly alongside them to the feast. Upon arriving in the celestial realm, the cunning Tortoise introduced himself to the hosts as "All of You," claiming that was his official ceremonial title.

When the heavenly hosts served massive platters of delicious roasted meats, fried yams, and sweet palm wine, they announced: "This feast is prepared for all of you." Tortoise stepped forward and devoured almost everything, leaving the generous birds with only dry bones and crumbs.

Furious at this brazen treachery, the hungry birds reclaimed their borrowed feathers one by one and flew back to earth, leaving the greedy Tortoise stranded high in the sky. Desperate to return home, Tortoise pleaded with Parrot to deliver a message to his wife to lay soft mattresses and cushions beneath his compound tree so he could jump down safely. But the bitter Parrot delivered the opposite message, instructing the wife to pile hard rocks, machetes, and pestles under the tree.

Tortoise leaped from the heavens and crashed violently onto the rocks. His smooth shell was shattered into a hundred fragments. Although a skillful medicine man patched his shell with herbal resin, the jagged cracks remained forever.

My grandmother concluded that selfishness and greed inevitably bring pain and public disgrace.`
      },
      {
        questionNumber: "4",
        category: "Speech / Public Address",
        prompt: "As the Senior Prefect of your school, you have been invited to address the Parent-Teacher Association (PTA) on what your school needs most. Write your speech.",
        modelAnswer: `A SPEECH DELIVERED BY THE SENIOR PREFECT TO THE PARENT-TEACHER ASSOCIATION OF ST. PETER'S JSS

Mr. Chairman, Respected Headmaster, Dedicated Teachers, and Esteemed Parents:

I count it a singular honor to stand before you today on behalf of the entire student body of St. Peter's Junior Secondary School to express our profound gratitude for your continuous sacrifices, and to present to you our three most pressing institutional needs.

First and foremost, our school suffers from an acute shortage of classroom furniture. In Form One and Form Two, over eighty students are compelled to squeeze three to a dual desk designed for two pupils, while others sit on bare concrete blocks. Writing in such uncomfortable, contorted postures causes severe spinal strain, leads to untidy work, and fragments students' concentration during lessons. We humbly appeal to the PTA to fund the construction of one hundred standard dual desks before the new academic term begins.

Secondly, our technical skills workshop and science laboratory are virtually bare. Although our curriculum requires practical mastery of carpentry tools, circuit wiring, and basic biology experiments, our dedicated teachers are forced to teach purely theoretically on the chalkboard. Procuring basic hand tools, measuring instruments, and simple test-tubes will enable our students to develop employable technical competencies and excel in the BECE.

Finally, our school compound lacks potable drinking water and modern sanitation facilities. Students must trek to distant neighborhood boreholes during recess, causing chronic lateness and exposing us to traffic hazards. Constructing a mechanized borehole on the compound will safeguard our health and maximize instructional hours.

We have faith in your parental benevolence and commitment to our future. Together, let us build a brighter future for St. Peter's.

Thank you.`
      }
    ]
  }
};

async function seedBeceEnglish2000Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2000 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2000");
  await docRef.set({
    year: 2000,
    title: "BECE English Language 2000 (Calibrated National Benchmark)",
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
          title: "Passage I: The Retiring Headmaster's Send-off",
          text: passage1Text,
          questionRange: "Questions 1 to 5"
        },
        {
          id: "passage_2",
          title: "Passage II: Television and its Influence",
          text: passage2Text,
          questionRange: "Questions 6 to 10"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Retiring Headmaster's Send-off",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: Television and its Influence",
          text: passage2Text,
          questionRange: "Questions 6 to 10",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 11 to 40",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2000 successfully seeded into Firestore!");
}

seedBeceEnglish2000Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2000:", err);
    process.exit(1);
  });

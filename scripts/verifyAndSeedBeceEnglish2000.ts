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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2000
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 10) ---
  {
    number: 1,
    prompt: "According to Passage I, why did Mr. Kobi express regret regarding the headmaster's decision to retire?",
    options: [
      "The headmaster was required to step down by law",
      "His departure would prematurely deprive the pupils of his valuable mentorship",
      "The headmaster had not accomplished much for the school",
      "The pupils were already fully prepared for adult life"
    ],
    correctAnswer: "His departure would prematurely deprive the pupils of his valuable mentorship",
    hint: "Check paragraph one: 'He was sorry that the headmaster had decided to retire at so early an age. This would deprive the pupils of his assistance...'",
    workedSolution: "The speaker felt regret because retiring at such an early age meant the school and students would lose the headmaster's guidance long before it was necessary.",
    points: 1
  },
  {
    number: 2,
    prompt: "Which of the following statements is NOT true concerning the retiring headmaster in Passage I?",
    options: [
      "He was disliked and rejected by the school community",
      "He had dedicated long years of hard work to the school",
      "He felt happy and grateful on his retirement day",
      "He had served the institution for an extensive period"
    ],
    correctAnswer: "He was disliked and rejected by the school community",
    hint: "The old pupils held him in high esteem and presented him with a silver tray.",
    workedSolution: "The headmaster was held in high esteem, admired, and praised; stating that he was disliked or hated is completely false.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, the word 'brief' in 'giving a brief summary' means ............",
    options: ["necessary", "good", "factual", "short"],
    correctAnswer: "short",
    hint: "Lasting only a short time or using few words.",
    workedSolution: "'Brief' means of short duration or concise; 'short' is its direct synonym.",
    points: 1
  },
  {
    number: 4,
    prompt: "According to Passage I, what was the general opinion of the school community regarding Mr. Smith, the incoming headmaster?",
    options: [
      "He was admired and respected by everyone who knew him",
      "He was favored solely by the retiring headmaster",
      "He was an excessively harsh disciplinarian",
      "He was an unfamiliar newcomer to the school"
    ],
    correctAnswer: "He was admired and respected by everyone who knew him",
    hint: "Reread paragraph two: 'He believed that Mr. Smith was generally admired and respected by all who knew him.'",
    workedSolution: "The passage notes that Mr. Smith had taught in the school for many years and enjoyed widespread admiration and respect from all who knew him.",
    points: 1
  },
  {
    number: 5,
    prompt: "At the conclusion of his farewell address in Passage I, what commitment did the retiring headmaster make?",
    options: [
      "He would continue praising his former teachers",
      "He would continue teaching part-time in the school",
      "He would never visit the school again",
      "He would personally maintain an active interest in the school's progress"
    ],
    correctAnswer: "He would personally maintain an active interest in the school's progress",
    hint: "Look at the final sentence: 'and promised that he would certainly do so himself.'",
    workedSolution: "The retiring headmaster urged alumni to stay interested in the school and promised that he himself would continue taking an active interest in its welfare.",
    points: 1
  },
  {
    number: 6,
    prompt: "According to Passage II, why is television viewing so attractive to adults after a day's work?",
    options: [
      "It is an exquisite piece of household furniture",
      "It effortlessly resolves complex personal challenges",
      "It is readily accessible in the home and provides relaxation",
      "It is compulsory for modern citizenship"
    ],
    correctAnswer: "It is readily accessible in the home and provides relaxation",
    hint: "Check paragraph one: 'It is available in the home... provides entertainment after a day's work.'",
    workedSolution: "The author notes that television appeals to people because it offers comfortable in-home entertainment and mental relaxation after a strenuous day.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage II, what caution does the writer give concerning children's television habits?",
    options: [
      "Children should watch television exclusively in the dark",
      "Children should avoid television entirely throughout childhood",
      "Children should not be left unmonitored to watch adult-oriented programmes",
      "Children must learn adult behavior as early as possible"
    ],
    correctAnswer: "Children should not be left unmonitored to watch adult-oriented programmes",
    hint: "Paragraph two cautions that children watch more adult programmes than children's shows, exposing them prematurely to adult concepts.",
    workedSolution: "The writer warns that children watch too many adult programmes that can prematurely influence their impressionable minds.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the word 'poses' in 'poses more serious problems' means ............",
    options: ["solves", "increases", "presents", "determines"],
    correctAnswer: "presents",
    hint: "To present, constitute, or create a problem or danger.",
    workedSolution: "'Poses' in this context means presents, constitutes, or brings about; 'presents' is the exact synonym.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, which of the following assertions about television is NOT true?",
    options: [
      "It serves as a popular source of relaxation",
      "It exposes viewers to diverse cultures and distant places",
      "People with little or no formal schooling can enjoy it",
      "Every single household in the country owns a television set"
    ],
    correctAnswer: "Every single household in the country owns a television set",
    hint: "The text never claims that everyone owns a television set.",
    workedSolution: "While television is widely available, claiming that every single person or household possesses one is inaccurate and unsupported by the text.",
    points: 1
  },
  {
    number: 10,
    prompt: "What is the writer's overall attitude toward the influence of television on young people in Passage II?",
    options: [
      "He despises all forms of television entertainment",
      "He is deeply concerned about its negative effects on children's study time",
      "He advocates for a total national ban on television broadcasting",
      "He produces educational children's television shows"
    ],
    correctAnswer: "He is deeply concerned about its negative effects on children's study time",
    hint: "He warns that television robs children of time needed for learning and exposes them to premature influences.",
    workedSolution: "The author is uneasy and troubled by the reality that television displaces children's learning time and exposes them to unsuitable adult content.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "The headmaster instructed the senior prefect to summon an emergency meeting of the student council.\nChoose the word nearest in meaning to the underlined word 'summon'.",
    options: ["chair", "call", "cancel", "postpone"],
    correctAnswer: "call",
    hint: "To convene, gather, or officially demand people to assemble.",
    workedSolution: "'Summon' means to officially call together, convene, or assemble; 'call' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The demeanor of the municipal security guard was distinctly hostile.\nChoose the word nearest in meaning to the underlined word 'hostile'.",
    options: ["strange", "disturbing", "unfriendly", "interesting"],
    correctAnswer: "unfriendly",
    hint: "Showing open opposition, coldness, or enmity.",
    workedSolution: "'Hostile' means showing ill will, antagonism, or cold unfriendliness; 'unfriendly' is its closest synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "After a long day of farming under the blazing sun, he returned home completely exhausted.\nChoose the word nearest in meaning to the underlined word 'exhausted'.",
    options: ["disturbed", "worn out", "unhappy", "broken down"],
    correctAnswer: "worn out",
    hint: "Drained of physical strength and completely tired.",
    workedSolution: "'Exhausted' means completely fatigued or drained of physical energy; 'worn out' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The primary duty of the internal auditor is to go over the financial accounts meticulously.\nChoose the word nearest in meaning to the underlined phrase 'go over'.",
    options: ["present", "calculate", "settle", "inspect"],
    correctAnswer: "inspect",
    hint: "To examine, review, or check through carefully.",
    workedSolution: "'To go over' means to examine, check, audit, or 'inspect' records carefully for accuracy.",
    points: 1
  },
  {
    number: 15,
    prompt: "The exterior emulsion paint used for the new school library is exceptionally durable.\nChoose the word nearest in meaning to the underlined word 'durable'.",
    options: ["lasting", "expensive", "attractive", "decorative"],
    correctAnswer: "lasting",
    hint: "Able to withstand wear, pressure, or damage over a long period.",
    workedSolution: "'Durable' means able to endure and resist wear over a prolonged period; 'lasting' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "Musa warned his seatmate to mind his own business. This means that Musa's friend should ............",
    options: [
      "concentrate exclusively on trading",
      "worry about his own homework only",
      "refrain from meddling in other people's private affairs",
      "refuse to assist his neighbors"
    ],
    correctAnswer: "refrain from meddling in other people's private affairs",
    hint: "Not interfering in matters that do not concern one.",
    workedSolution: "The idiom 'to mind one's own business' means to refrain from meddling, interfering, or intruding in affairs that are none of one's concern.",
    points: 1
  },
  {
    number: 17,
    prompt: "Mother buys the finest shoes for Patrick because he is the apple of her eye. This means that Patrick is ............",
    options: [
      "her most cherished and beloved child",
      "her most hardworking son",
      "her most respectful son",
      "her youngest infant"
    ],
    correctAnswer: "her most cherished and beloved child",
    hint: "A person who is treasured and loved above all others.",
    workedSolution: "The idiom 'the apple of one's eye' refers to a person who is cherished, favored, and loved more than anyone else.",
    points: 1
  },
  {
    number: 18,
    prompt: "With rising living costs, it is difficult for many families to make ends meet. This means they ............",
    options: [
      "live in luxurious comfort",
      "struggle to live within their limited financial income",
      "cannot purchase expensive clothing",
      "fail to eat balanced meals"
    ],
    correctAnswer: "struggle to live within their limited financial income",
    hint: "Having barely enough income to cover basic living expenses.",
    workedSolution: "'To make ends meet' is an idiom meaning to earn just enough money to pay for one's essential living costs.",
    points: 1
  },
  {
    number: 19,
    prompt: "Esi was such an exemplary leader that we were all encouraged to take a leaf out of her book. This means we should ............",
    options: [
      "surpass her academic records",
      "borrow her study notes",
      "emulate her worthy example",
      "show her deep respect"
    ],
    correctAnswer: "emulate her worthy example",
    hint: "To copy or follow the good behavior or habits of another person.",
    workedSolution: "The idiom 'to take a leaf out of someone's book' means to follow their good example or imitate their positive conduct.",
    points: 1
  },
  {
    number: 20,
    prompt: "Before departing for the farm, the mother asked her neighbor to keep an eye on her children. This means the neighbor should ............",
    options: [
      "play games with the children",
      "watch over and care for the children attentively",
      "follow the children around town",
      "stare at the children continuously"
    ],
    correctAnswer: "watch over and care for the children attentively",
    hint: "To watch, guard, or supervise someone carefully.",
    workedSolution: "'To keep an eye on' means to watch over, guard, supervise, or care for someone attentively.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While the disloyal worker did everything to hinder our progress, the supervisor sought to ...... us.",
    options: ["reduce", "do", "understand", "assist"],
    correctAnswer: "assist",
    hint: "'Hinder' means to obstruct, delay, or impede. Find the word that denotes giving help.",
    workedSolution: "'Hinder' means to create difficulties that result in obstruction. Its direct antonym is 'assist' (to help or aid).",
    points: 1
  },
  {
    number: 22,
    prompt: "It is wise for a nation to preserve its historical monuments, rather than ...... them.",
    options: ["produce", "destroy", "condemn", "abolish"],
    correctAnswer: "destroy",
    hint: "'Preserve' means to protect and keep intact. Find the word meaning to ruin or pull down.",
    workedSolution: "'Preserve' means to protect, conserve, and keep safe from decay. Its direct opposite is 'destroy' (to ruin or demolish).",
    points: 1
  },
  {
    number: 23,
    prompt: "The commercial enterprise engaged ten new sales representatives and ...... three negligent workers.",
    options: ["disqualified", "exempted", "dismissed", "excused"],
    correctAnswer: "dismissed",
    hint: "'Engaged' means hired or employed. Find the word meaning terminated from employment.",
    workedSolution: "'Engaged' in employment contexts means hired or recruited. Its direct workplace antonym is 'dismissed' (discharged or fired).",
    points: 1
  },
  {
    number: 24,
    prompt: "While the valley soil is fertile for vegetable cultivation, the highland soil is remarkably ...... .",
    options: ["poor", "shallow", "porous", "hard"],
    correctAnswer: "poor",
    hint: "'Fertile' means rich in nutrients and producing abundant vegetation. Find the word meaning lacking nutrients.",
    workedSolution: "'Fertile' describes soil capable of producing abundant vegetation. Its direct agricultural antonym is 'poor' (barren or infertile).",
    points: 1
  },
  {
    number: 25,
    prompt: "Formerly, pupils walked several miles to attend school, but ...... commercial buses ply every route.",
    options: ["sometimes", "now", "recently", "usually"],
    correctAnswer: "now",
    hint: "'Formerly' refers to a past era. Find the word referring to the present time.",
    workedSolution: "'Formerly' refers to in the past. Its direct chronological antonym is 'now' (at present).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "When the power outage suddenly occurred, I ...... my evening meal in the dining hall.",
    options: ["have eaten", "am eating", "have been eating", "was eating"],
    correctAnswer: "was eating",
    hint: "An ongoing past continuous action interrupted by a sudden simple past event ('the lights went off').",
    workedSolution: "The past continuous tense ('was eating') describes an ongoing background action in the past interrupted by a specific past event ('the lights went off').",
    points: 1
  },
  {
    number: 27,
    prompt: "The manufacturing company had to ...... fifty factory hands due to declining revenue.",
    options: ["lay down", "put off", "put away", "lay off"],
    correctAnswer: "lay off",
    hint: "Identify the phrasal verb meaning to terminate employees temporarily or permanently due to economic shortage.",
    workedSolution: "The phrasal verb 'to lay off' means to discharge or terminate workers because of a downturn in production or business.",
    points: 1
  },
  {
    number: 28,
    prompt: "The school team ...... to play a return soccer match last Friday, but the rain disrupted it.",
    options: ["have", "were", "ought", "are"],
    correctAnswer: "were",
    hint: "Structure: 'were to play' expresses a past scheduled arrangement or obligation.",
    workedSolution: "The semi-modal structure 'were to + base verb' is used to denote a scheduled event or arrangement in the past ('were to play last Friday').",
    points: 1
  },
  {
    number: 29,
    prompt: "It was not immediately obvious ...... of the three suspects the witness was pointing to.",
    options: ["the one to which", "which one", "one which", "as to that"],
    correctAnswer: "which one",
    hint: "Identify the embedded interrogative noun clause selecting among a limited group of people.",
    workedSolution: "The indirect interrogative phrase 'which one' acts as the complement clause selecting among specific distinct options ('which one he was pointing to').",
    points: 1
  },
  {
    number: 30,
    prompt: "I have forgotten all ...... you advised me during yesterday's counseling session.",
    options: ["that", "which", "what", "those"],
    correctAnswer: "that",
    hint: "The indefinite pronoun 'all' is followed by the relative pronoun 'that', never 'what'.",
    workedSolution: "In standard English relative clauses, the pronoun 'all' is modified by 'that' ('all that you told me'). Using 'what' here is a common grammatical error.",
    points: 1
  },
  {
    number: 31,
    prompt: "Selfish individuals invariably consider ...... before thinking about the welfare of others.",
    options: ["oneself", "yourselves", "themselves", "himself"],
    correctAnswer: "themselves",
    hint: "The plural third-person subject 'Selfish individuals/people' requires the matching plural reflexive pronoun.",
    workedSolution: "The plural third-person subject 'Selfish people' requires the matching plural reflexive pronoun 'themselves'.",
    points: 1
  },
  {
    number: 32,
    prompt: "...... the antique wall clock is old, it still chimes with remarkable precision.",
    options: ["Although", "Despite", "Since", "Because"],
    correctAnswer: "Although",
    hint: "Identify the subordinating conjunction of concession that introduces a contrasting clause.",
    workedSolution: "'Although' is a subordinating conjunction of concession used to connect contrasting facts in a complex sentence. 'Despite' requires a noun phrase, not a finite clause.",
    points: 1
  },
  {
    number: 33,
    prompt: "The foreign tourist asked me how ...... French I could comprehend.",
    options: ["many", "few", "little", "much"],
    correctAnswer: "much",
    hint: "Language ability or knowledge is an uncountable noun measured by degree.",
    workedSolution: "'French' (as a language/knowledge) is an uncountable non-count noun, requiring the quantifier 'much' ('how much French'). 'Many' and 'few' apply only to count nouns.",
    points: 1
  },
  {
    number: 34,
    prompt: "Kwaku's testimonial evidence ...... to be checked thoroughly before the magistrate.",
    options: ["needing", "needs", "is needing", "will have need"],
    correctAnswer: "needs",
    hint: "The singular non-count subject 'evidence' requires a simple present singular stative verb.",
    workedSolution: "'Evidence' is an uncountable singular noun. The semi-modal/lexical verb 'need' in the simple present takes the singular third-person inflection: 'needs to be checked'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The school authorities stated that they could not postpone ...... the boarding house any longer.",
    options: ["re-opening", "re-open", "to have re-opened", "having re-opened"],
    correctAnswer: "re-opening",
    hint: "The verb 'postpone' is followed by a gerund (verb-ing), not an infinitive.",
    workedSolution: "In standard English verb catenation, the transitive verb 'postpone' requires a gerund complement ('postpone re-opening').",
    points: 1
  },
  {
    number: 36,
    prompt: "You know very well that the accidental breakage was no fault of ......",
    options: ["my", "I", "me", "mine"],
    correctAnswer: "mine",
    hint: "Double possessive construction: 'no fault of' requires an absolute possessive pronoun.",
    workedSolution: "In standard English genitive idioms, 'no fault of' is followed by the absolute possessive pronoun 'mine' ('no fault of mine').",
    points: 1
  },
  {
    number: 37,
    prompt: "You are not injured by that fall, ......?",
    options: ["were you", "did you", "are you", "do you"],
    correctAnswer: "are you",
    hint: "A negative statement with 'are not' and subject 'you' takes an affirmative tag: 'are you?'.",
    workedSolution: "The main clause has a negative auxiliary ('are not') with subject 'you'. The corresponding question tag must be affirmative: 'are you?'.",
    points: 1
  },
  {
    number: 38,
    prompt: "I do not mind ...... home early if you have finished all your assignments.",
    options: ["you go", "your go", "you to go", "your going"],
    correctAnswer: "your going",
    hint: "In formal English, a gerund complement ('going') after 'mind' is modified by a possessive determiner ('your').",
    workedSolution: "Formal standard English requires the possessive determiner before a gerund functioning as the direct object of 'mind' ('mind your going home').",
    points: 1
  },
  {
    number: 39,
    prompt: "All ...... to pass the examination is disciplined revision.",
    options: ["what I need", "to need", "that I need", "to be needed"],
    correctAnswer: "that I need",
    hint: "The quantifier 'All' is modified by the relative pronoun 'that' in pseudo-cleft sentences.",
    workedSolution: "In pseudo-cleft structures, 'All' is modified by a relative clause introduced by 'that' ('All that I need is...'). Using 'what' here is non-standard.",
    points: 1
  },
  {
    number: 40,
    prompt: "If a stranger greets you courteously, it is polite to return ...... greeting.",
    options: ["your", "its", "their", "anyone"],
    correctAnswer: "their",
    hint: "Use the singular gender-neutral possessive determiner to refer back to the indefinite antecedent 'anyone/stranger'.",
    workedSolution: "Modern standard English uses the gender-neutral singular possessive determiner 'their' to refer back to an indefinite antecedent ('anyone' or 'a stranger').",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200001);

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
        category: "Formal Letter",
        prompt: "Write a letter to the Chairman of the Town Development Committee in your area, drawing his attention to the deplorable sanitation conditions in your community and suggesting at least two practical measures to improve environmental hygiene.",
        modelAnswer: `Methodist Junior High School
P. O. Box 42
Nsawam, Eastern Region
12th May, 2000

The Chairman
Town Development Committee
Nsawam Urban Council
Nsawam

Dear Sir,

PETITION ON DEPLORABLE SANITATION CONDITIONS AND RECOMMENDATIONS FOR ACTION

On behalf of the youth and residents of the Nsawam Central Electoral Area, I respectfully write to draw your urgent attention to the worsening sanitation conditions confronting our community and to propose practical solutions to avert an impending public health catastrophe.

In recent months, our township has been overwhelmed by massive heaps of uncollected domestic refuse, particularly around the central market square and near residential waterways. Open drainage gutters are heavily choked with plastic waste, silt, and stagnant wastewater. During rainy periods, these clogged gutters overflow into streets and homes, creating breeding grounds for swarms of mosquitoes and houseflies. Consequently, our local clinics have recorded an alarming surge in cholera, typhoid, and malaria cases among infants and schoolchildren.

To curb this growing menace, I suggest that the Town Development Committee collaborate with the Municipal Environmental Health Directorate to position large, covered communal refuse containers at strategic locations. Ensuring that waste haulage trucks empty these skips on a strict thrice-weekly schedule will eliminate indiscriminate roadside dumping.

Secondly, I recommend the immediate re-institution of mandatory monthly communal labor clean-up exercises. The town crier should mobilize youth, traders, and church groups on the first Saturday of every month to desilt gutters, weed overgrown alleys, and clear public spaces. Furthermore, environmental health inspectors must strictly enforce local sanitation bye-laws, imposing deterrent fines on landlords lacking household toilet facilities.

We trust that your committee will act with utmost urgency to restore cleanliness and dignity to our town.

Thank you.

Yours faithfully,
[Signature]
Kwaku Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Informal Letter",
        prompt: "Write a letter to your friend residing in another town, describing at least two fascinating cultural or geographical landmarks in your hometown and inviting him or her to visit during the upcoming vacation.",
        modelAnswer: `Anglican Junior High School
P. O. Box 18
Mampong, Ashanti Region
18th June, 2000

Dear Yaw,

I hope this letter finds you in fine health and high spirits in Kumasi. I am writing to share with you two extraordinary landmarks that make my hometown, Mampong, a fascinating destination, and to warmly invite you to spend the upcoming long vacation with my family.

First, you will be captivated by the breathtaking Mampong Scarp and its famous natural water springs. Perched on a high geological ridge, our town overlooks the vast Afram Plains, offering a panoramic view that leaves every visitor speechless. A short hike down the forest trail leads to a pristine, icy mountain spring that cascades over mossy rocks into a crystal-clear natural pool. The crisp, clean mountain air and lush green canopy provide a tranquil haven for relaxation, far away from urban noise and vehicular smog.

Secondly, our town is home to the historic Asante Mampong Traditional Palace and Museum. Built over a century ago, the palace is an architectural treasure house of Asante historical heritage. Inside the museum, you will see ancient royal regalia, sacred stools, ancestral brass drums, and ceremonial gold swords used by heroic warrior chiefs during ancient battles. The palace linguists narrate captivating oral folklore that brings our glorious history alive.

My parents have already prepared our guest room, and Mother has promised to prepare your favorite fufu and light goat soup. Please speak with your parents so we can finalize your travel arrangements.

Your true friend,
[Signature]
Kofi Boateng`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "Narrate an interesting, traditional moral story that your grandmother told you around the evening hearth, explaining the moral lesson it teaches.",
        modelAnswer: `THE GREEDY SPIDER AND THE POT OF WISDOM

On moonlit evenings in our village of Asiakwa, my grandmother would gather us around the crackling hearth to narrate ancient Ananse folktales. My absolute favorite among her stories is the timeless tale of how Kweku Ananse tried to monopolize all the wisdom in the world.

Long ago, when the world was young, wisdom was scattered everywhere. Greedy Kweku Ananse decided that he alone must possess all of it so that kings and animals would bow down and pay homage to him. He traveled from village to village, collecting every drop of insight, cleverness, and knowledge, and sealed them securely inside a hollow clay gourd. Seeking to hide the treasure where no mortal could ever find it, Ananse resolved to tie the gourd to the top of the tallest silk-cotton tree in the sacred forest.

Ananse tied the heavy pot to his belly and began to climb the giant tree. However, because the bulky pot was strapped directly in front of him, his knees constantly knocked against it, preventing his hands from gripping the tree trunk securely. He slipped and fell repeatedly, panting in frustration.

Sitting quietly beneath a bush nearby was his young son, Ntikuma, who was watching him. Ntikuma shouted innocently: "Father, wouldn't it be much easier to tie the pot to your back so that your chest and arms are free to climb?"

Ananse froze in shock. He realized that despite collecting all the world's wisdom into his pot, his tiny son still possessed a piece of practical common sense that had eluded him! In a fit of furious embarrassment, Ananse hurled the clay pot to the ground, shattering it into a million fragments. A sudden gust of wind swept the released wisdom to every corner of the earth.

Grandmother concluded by reminding us: No single individual possesses all the wisdom in the world, and true intellect requires humility.`
      },
      {
        questionNumber: "4",
        category: "Speech Writing",
        prompt: "As the Senior Prefect of your school, you have been invited to address the annual general meeting of the Parent-Teacher Association (PTA) on what your school needs most to enhance academic performance. Write your speech.",
        modelAnswer: `A SPEECH DELIVERED BY EMMANUEL ADDO, SENIOR PREFECT OF METHODIST JHS, AT THE 10TH ANNUAL GENERAL MEETING OF THE PTA

Mr. Chairman, Respected Headmaster, Dedicated Teachers, Cherished Parents, and Guardians:

It is a distinct honor to stand before you today on behalf of the entire student body to express our profound gratitude for your continuous sacrifices toward our welfare, and to present the two most pressing infrastructural needs of our noble school.

First and foremost, our school urgently requires a well-stocked library and reference learning center. Currently, our students depend entirely on brief classroom chalkboard notes dictated by teachers. We lack supplementary storybooks, encyclopedias, and past question compendiums necessary for independent revision. Reading is the bedrock of language proficiency and academic distinction; without books, our candidates are severely handicapped when writing English compositions in the BECE. We plead with the PTA to convert the unused storeroom into a modern library stocked with contemporary textbooks.

Secondly, our school is in desperate need of a functional computer laboratory. We live in an era driven by digital technology, yet out of our three hundred students, over ninety percent have never touched a computer keyboard. Our teachers teach Information and Communication Technology theoretically on the chalkboard, drawing monitors and mice with chalk. To prepare us adequately for Senior High School STEM education and modern career demands, our school requires at least fifteen desktop computers and a reliable generator.

Dear parents, your investment in our education is an investment in the future leaders of our community. With your benevolence and support, we promise to study diligently and achieve historic distinctions in the upcoming BECE.

Thank you all for your kind attention!`
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

async function verifyAndSeedBeceEnglish2000() {
  console.log("Auditing and verifying BECE English 2000 document in Firestore...");

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

  console.log("✅ Calibrated BECE English 2000 successfully verified and seeded into Firestore!");
}

verifyAndSeedBeceEnglish2000()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to verify/seed Calibrated BECE English 2000:", err);
    process.exit(1);
  });

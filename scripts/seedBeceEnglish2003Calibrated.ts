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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2003
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 11) ---
  {
    number: 1,
    prompt: "In Passage I, why did the school children suddenly alter their song as they rushed out of class?",
    options: [
      "They heard ceremonial musketry firing in the village",
      "They observed dark rain clouds racing across the sky",
      "Their parents had consulted the traditional shrine",
      "They disliked the verse taught by their teacher"
    ],
    correctAnswer: "They observed dark rain clouds racing across the sky",
    hint: "Reread paragraph two: 'they looked up and saw dark clouds racing across the sky. These were signs of rain...'",
    workedSolution: "The children switched from begging the rain to go away to welcoming it because dark clouds indicated that the long-awaited rain was about to fall.",
    points: 1
  },
  {
    number: 2,
    prompt: "According to Passage I, why did the adult villagers join the children in dancing and singing?",
    options: [
      "They were celebrating a festive holiday",
      "The children had returned safely from school",
      "Torrential rain had finally started pouring",
      "They firmly believed the prolonged drought was ending"
    ],
    correctAnswer: "They firmly believed the prolonged drought was ending",
    hint: "The farmers had endured six months without rain; they hoped their troubles were over.",
    workedSolution: "The adults joined in joyous celebration because they believed the gathering rain clouds signaled the end of their six-month drought and famine.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following historical facts is true according to Passage I?",
    options: [
      "The villagers assaulted the shrine priest",
      "It had rained continuously for six months",
      "Streams and wells had dried up, causing acute water shortage",
      "The children were opposed to the arrival of rain"
    ],
    correctAnswer: "Streams and wells had dried up, causing acute water shortage",
    hint: "Paragraph two describes the drying up of water bodies and the suffering of livestock.",
    workedSolution: "The text explicitly states: 'The streams and the wells had also dried up and the people could find very little water for themselves and their livestock.'",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the word 'abruptly' in 'stopped abruptly' means ............",
    options: ["soon", "totally", "slowly", "suddenly"],
    correctAnswer: "suddenly",
    hint: "Happening quickly, unexpectedly, and without warning.",
    workedSolution: "'Abruptly' means suddenly, unexpectedly, or precipitously; 'suddenly' is its exact equivalent.",
    points: 1
  },
  {
    number: 5,
    prompt: "Why did the furious villagers pursue the fetish priest with the intention of lynching him?",
    options: [
      "Famine had struck the land",
      "The local streams had dried up",
      "They had forgotten to perform the sacrifices",
      "His promises failed and he had deceived them"
    ],
    correctAnswer: "His promises failed and he had deceived them",
    hint: "The sacrifices promised rain, but morning came with completely dry ground.",
    workedSolution: "The villagers felt betrayed and cheated because the priest had guaranteed that his sacrifices would bring rain, yet the ground remained bone dry.",
    points: 1
  },
  {
    number: 6,
    prompt: "What profound philosophical lesson does the reader learn from the event in Passage I?",
    options: [
      "Children are completely naive",
      "Human beings cannot manipulate or guarantee the forces of nature",
      "Adults invariably act like immature children",
      "Droughts last only for a few days"
    ],
    correctAnswer: "Human beings cannot manipulate or guarantee the forces of nature",
    hint: "Despite rituals and desperate hopes, nature remained unyielding.",
    workedSolution: "The passage illustrates that human rituals and predictions cannot dictate the unpredictable forces of nature and weather.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage II, the proverb 'Variety is the spice of life' implies that human existence ............",
    options: [
      "has its inevitable sorrows",
      "resembles a seasoned meal",
      "must be treated with rigid seriousness",
      "is enriched by diversity and different interesting experiences"
    ],
    correctAnswer: "is enriched by diversity and different interesting experiences",
    hint: "Life is made lively and enjoyable by having diverse things, people, and habits.",
    workedSolution: "The idiom 'Variety is the spice of life' means that diversity, differences, and varied experiences make life stimulating, enjoyable, and rich.",
    points: 1
  },
  {
    number: 8,
    prompt: "Why did the pupils affectionately nickname Teacher Amu 'God made them all'?",
    options: [
      "It was his favorite concluding phrase in every sermon",
      "He constantly gazed upward at the roof",
      "His pep-talks were comically humorous",
      "He had a deep passion for preaching"
    ],
    correctAnswer: "It was his favorite concluding phrase in every sermon",
    hint: "Check paragraph one: 'He would raise his voice...: God made them all...'",
    workedSolution: "The students gave him the nickname because he invariably concluded every assembly pep-talk with the dramatic proclamation: 'God made them all and He said, It is good.'",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, why did Kofi Abre resent his classmates' jokes regarding Teacher Amu's words?",
    options: [
      "He harbored hatred toward his schoolmates",
      "He was terrified of the school headmaster",
      "He took the teacher's philosophy literally to justify his own eccentric behavior",
      "He was chronically indolent"
    ],
    correctAnswer: "He took the teacher's philosophy literally to justify his own eccentric behavior",
    hint: "He thought if the world is full of different people, why should anyone correct his laziness or anger?",
    workedSolution: "Abre took the sermon literally to mean that everyone is entitled to act however they please without question, resenting any criticism of his own misconduct.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'scolded' in 'when his friend scolded him' means ............",
    options: ["reminded", "annoyed", "rebuked", "questioned"],
    correctAnswer: "rebuked",
    hint: "To reprimand or criticize someone angrily for a fault.",
    workedSolution: "'Scolded' means reprimanded, criticized, or chided sharply; 'rebuked' is its direct synonym.",
    points: 1
  },
  {
    number: 11,
    prompt: "Why did Teacher Amu resolve to punish Kofi Abre despite his preaching on diversity?",
    options: [
      "Abre refused to complete his homework",
      "Abre exhibited violent and undisciplined behavior toward peers",
      "Abre rejected the teacher's sermons",
      "Abre shook his head in disrespect"
    ],
    correctAnswer: "Abre exhibited violent and undisciplined behavior toward peers",
    hint: "Abre shouted down a peer and nearly bloodied a friend's nose.",
    workedSolution: "Teacher Amu punished him because physical violence and assault constitute acts of gross indiscipline that cannot be excused under the guise of being 'different'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "Abass was not selected for the marathon team because he possessed little stamina.\nChoose the word nearest in meaning to the underlined word 'stamina'.",
    options: ["love", "potential", "endurance", "skill"],
    correctAnswer: "endurance",
    hint: "The physical or mental strength to sustain prolonged physical effort.",
    workedSolution: "'Stamina' refers to the physical capacity to sustain prolonged effort or activity; 'endurance' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The border community was completely deserted after the civil conflict erupted.\nChoose the word nearest in meaning to the underlined word 'deserted'.",
    options: ["destroyed", "built", "quiet", "abandoned"],
    correctAnswer: "abandoned",
    hint: "Vacated, left empty, or having no occupants.",
    workedSolution: "'Deserted' means abandoned by inhabitants or left empty; 'abandoned' is its exact equivalent.",
    points: 1
  },
  {
    number: 14,
    prompt: "Detectives rigorously interrogated the suspect regarding the missing government bonds.\nChoose the word nearest in meaning to the underlined word 'interrogated'.",
    options: ["warned", "questioned", "detained", "beat"],
    correctAnswer: "questioned",
    hint: "To ask questions formally, closely, or thoroughly.",
    workedSolution: "'Interrogated' means examined through systematic formal questioning; 'questioned' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The headmistress was deeply impressed with the prefect's terminal leadership report.\nChoose the word nearest in meaning to the underlined word 'impressed'.",
    options: ["moved", "deceived", "calmed", "pleased"],
    correctAnswer: "pleased",
    hint: "Filled with admiration, approval, or positive satisfaction.",
    workedSolution: "'Impressed' means feeling admiration, approval, or satisfaction; 'pleased' is the closest synonym in this context.",
    points: 1
  },
  {
    number: 16,
    prompt: "Experienced clinical surgeons are exceptionally cautious during complex operations.\nChoose the word nearest in meaning to the underlined word 'cautious'.",
    options: ["careful", "good", "experienced", "friendly"],
    correctAnswer: "careful",
    hint: "Taking great care to avoid risk, error, or danger.",
    workedSolution: "'Cautious' means alert, prudent, and taking care to avoid harm or error; 'careful' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "The convener was disappointed because only fifteen delegates turned up for the summit. This means that fifteen delegates ............ the summit.",
    options: ["attended", "avoided", "postponed", "disturbed"],
    correctAnswer: "attended",
    hint: "Arrived, appeared, or made a physical presence at an event.",
    workedSolution: "The phrasal verb 'to turn up' means to arrive, appear, or attend a scheduled gathering.",
    points: 1
  },
  {
    number: 18,
    prompt: "Kwame held his tongue throughout the heated dispute between the elders. This means that Kwame ............",
    options: ["was furious", "was joyful", "smiled broadly", "kept quiet"],
    correctAnswer: "kept quiet",
    hint: "Refraining from speaking or keeping silent.",
    workedSolution: "The idiom 'to hold one's tongue' means to maintain silence and refrain from speaking.",
    points: 1
  },
  {
    number: 19,
    prompt: "Jones will let the cat out of the bag if he attends the meeting. This means he will ............",
    options: ["provoke trouble", "confuse the house", "reveal the secret", "release an animal"],
    correctAnswer: "reveal the secret",
    hint: "Disclosing a confidential matter carelessly or prematurely.",
    workedSolution: "'To let the cat out of the bag' is an idiom meaning to reveal a secret or disclose confidential information.",
    points: 1
  },
  {
    number: 20,
    prompt: "The municipal engineer cleared the air regarding the delayed water project. This means that he ............",
    options: [
      "explained the reasons and dispelled doubts",
      "broadcasted the contract costs",
      "advertised in the national press",
      "apologized for his incompetence"
    ],
    correctAnswer: "explained the reasons and dispelled doubts",
    hint: "Removing suspicion, confusion, or misunderstanding through clarification.",
    workedSolution: "The idiom 'to clear the air' means to clarify a confusing situation, resolve misunderstandings, and dispel doubts.",
    points: 1
  },
  {
    number: 21,
    prompt: "The striker's shot missed the goalpost by a hair's breadth. This means that ............",
    options: [
      "he shot wide into the crowd",
      "the goal was ruled offside",
      "he came extremely close to scoring a goal",
      "the goalkeeper blocked the shot easily"
    ],
    correctAnswer: "he came extremely close to scoring a goal",
    hint: "By a minute, tiny margin of distance.",
    workedSolution: "The idiom 'by a hair's breadth' means by an extremely tiny, narrow margin; in sports, it means narrowly missing or nearly scoring.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "Applying pure shea butter to the skin makes it smooth, but severe harmattan winds make it ...... .",
    options: ["soft", "rough", "warm", "dark"],
    correctAnswer: "rough",
    hint: "'Smooth' means having an even, gentle surface. Find the word meaning uneven or coarse.",
    workedSolution: "'Smooth' describes an even, gentle texture. Its direct physical antonym is 'rough' (coarse or uneven).",
    points: 1
  },
  {
    number: 23,
    prompt: "Never despise underprivileged individuals because of your current wealth, but learn to ...... their endurance.",
    options: ["cheat", "avoid", "admire", "annoy"],
    correctAnswer: "admire",
    hint: "'Despise' means to look down on with contempt. Find the word meaning to regard with high respect and approval.",
    workedSolution: "'Despise' means to hold in contempt or disdain. Its direct antonym is 'admire' (to respect, appreciate, or esteem).",
    points: 1
  },
  {
    number: 24,
    prompt: "Blinking when dust blows into the eye is an involuntary reflex, whereas raising your hand is ...... .",
    options: ["difficult", "slow", "quick", "intentional"],
    correctAnswer: "intentional",
    hint: "'Involuntary' means done automatically without conscious will. Find the word meaning done on purpose.",
    workedSolution: "'Involuntary' describes an action done without conscious choice. Its direct antonym is 'intentional' (or voluntary/deliberate).",
    points: 1
  },
  {
    number: 25,
    prompt: "While Kojo was a reckless spendthrift, his elder brother was a cautious ...... .",
    options: ["miser", "pauper", "weakling", "thief"],
    correctAnswer: "miser",
    hint: "'Spendthrift' means someone who squanders money wastefully. Find the word for someone who hoards money and hates spending.",
    workedSolution: "'Spendthrift' denotes a person who spends money wastefully. Its direct financial antonym is 'miser' (a hoarder who hates spending).",
    points: 1
  },
  {
    number: 26,
    prompt: "The visiting delegation expected a cordial reception, but received a distinctly ...... encounter.",
    options: ["plain", "hostile", "calm", "steady"],
    correctAnswer: "hostile",
    hint: "'Cordial' means warm and friendly. Find the word denoting antagonism and cold enmity.",
    workedSolution: "'Cordial' means warm, polite, and genial. Its direct opposite in human relations is 'hostile' (unfriendly, cold, and antagonistic).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (27 - 40) ---
  {
    number: 27,
    prompt: "Adolescents are strongly counseled to abstain ...... substance abuse and risky habits.",
    options: ["in", "on", "from", "through"],
    correctAnswer: "from",
    hint: "Identify the preposition that regularly collocates with the verb 'abstain'.",
    workedSolution: "In standard English, the verb 'abstain' is followed by the preposition 'from' ('abstain from alcohol / smoking / sex').",
    points: 1
  },
  {
    number: 28,
    prompt: "Our father writes with exceptional elegance, ......?",
    options: ["would he", "wouldn't he", "doesn't he", "didn't he"],
    correctAnswer: "doesn't he",
    hint: "The main verb 'writes' is in the simple present tense (habitual action) with a singular subject ('father').",
    workedSolution: "The main clause has a singular subject and a positive present tense verb ('writes'). The question tag must be negative and use 'does': 'doesn't he?'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Heavy commercial commodities are usually transported ...... sea.",
    options: ["through", "to", "on", "by"],
    correctAnswer: "by",
    hint: "General modes of transport (sea, air, road, rail) take the preposition 'by' without determiners.",
    workedSolution: "When describing standard means or routes of cargo transit without articles, English uses 'by' ('by sea', 'by air', 'by rail').",
    points: 1
  },
  {
    number: 30,
    prompt: "Life Skills ...... my favorite academic subject when I was a junior high student.",
    options: ["has been", "were", "was", "have been"],
    correctAnswer: "was",
    hint: "School subjects ending in '-s' (Life Skills, Mathematics, Physics) are treated as singular nouns.",
    workedSolution: "Names of school subjects and academic disciplines ending in '-s' ('Life Skills') take a singular verb. In the past narrative frame ('when I was...'), the verb is 'was'.",
    points: 1
  },
  {
    number: 31,
    prompt: "\"Would you mind if I borrowed your dictionary for a moment?\"\n\"............, go right ahead.\"",
    options: ["Yes, I do", "Yes, I mind", "No, I don't", "No, I wouldn't"],
    correctAnswer: "No, I wouldn't",
    hint: "To grant permission politely to a 'Would you mind' request, answer in the negative with the matching conditional auxiliary.",
    workedSolution: "Answering 'No, I wouldn't [mind]' politely grants permission (meaning 'I do not object'). 'Yes' would mean you object and refuse permission.",
    points: 1
  },
  {
    number: 32,
    prompt: "Has Sister Edith ...... her evening dose of herbal tonic?",
    options: ["drunk", "drink", "drinks", "drank"],
    correctAnswer: "drunk",
    hint: "The present perfect auxiliary 'has' requires the past participle form of 'drink'.",
    workedSolution: "The principal parts of 'drink' are drink (base) - drank (simple past) - drunk (past participle). Following 'has', the past participle 'drunk' is required.",
    points: 1
  },
  {
    number: 33,
    prompt: "If my elder uncle had arrived on time, I ...... have received my school supplies.",
    options: ["may", "will", "shall", "would"],
    correctAnswer: "would",
    hint: "Third Conditional: 'If + past perfect' takes 'would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition ('If my uncle had come'), the main clause takes 'would have' followed by the past participle.",
    points: 1
  },
  {
    number: 34,
    prompt: "Daily newspapers are generally ...... weekly magazines.",
    options: ["cheap as", "cheaper than", "cheapest of", "cheap than"],
    correctAnswer: "cheaper than",
    hint: "Comparing two items using the comparative inflection '-er' followed by 'than'.",
    workedSolution: "When comparing two things, the comparative form followed by 'than' ('cheaper than') is required.",
    points: 1
  },
  {
    number: 35,
    prompt: "The music master has composed a delightful new ...... rhyme.",
    options: ["children", "childrens'", "children's", "childrens"],
    correctAnswer: "children's",
    hint: "'Children' is an irregular plural noun that forms its possessive by adding an apostrophe and 's'.",
    workedSolution: "'Children' is already plural. Its possessive is formed by attaching ''s' ('children's rhyme').",
    points: 1
  },
  {
    number: 36,
    prompt: "Kofi informed his mother that he ...... eat his lunch later in the afternoon.",
    options: ["will", "can", "would", "shall"],
    correctAnswer: "would",
    hint: "In indirect reported speech following a past reporting verb ('informed'), 'will' shifts back to 'would'.",
    workedSolution: "Because the reporting verb 'informed/told' is in the past tense, the future modal auxiliary 'will' shifts to its past form 'would'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The championship match was scheduled to take place ...... two and four o'clock.",
    options: ["by", "toward", "from", "between"],
    correctAnswer: "between",
    hint: "Identify the preposition that pairs with 'and' to define a time span connecting two specific points.",
    workedSolution: "The correlative structure is 'between [time] and [time]'. ('From' pairs with 'to').",
    points: 1
  },
  {
    number: 38,
    prompt: "The girl told her mother that she ...... from the church service.",
    options: ["comes", "had come", "has come", "has been coming"],
    correctAnswer: "had come",
    hint: "In indirect speech, a past action that occurred before the reporting takes the past perfect tense.",
    workedSolution: "In reported speech following the past reporting verb 'told', the action completed prior to the conversation takes the past perfect tense ('had come').",
    points: 1
  },
  {
    number: 39,
    prompt: "...... the candidate joined the revision class late, he managed to pass with distinction.",
    options: ["Since", "As", "Despite", "Although"],
    correctAnswer: "Although",
    hint: "Identify the subordinating conjunction of concession that joins two contrasting clauses.",
    workedSolution: "'Although' is a subordinating conjunction of concession introducing a subordinate clause. 'Despite' requires a noun phrase or gerund, not a full subject-verb clause.",
    points: 1
  },
  {
    number: 40,
    prompt: "The philosophical treatise was ...... complex for the junior students to comprehend.",
    options: ["much", "too", "little", "so"],
    correctAnswer: "too",
    hint: "Look for the correlative structure 'too + adjective + to-infinitive'.",
    workedSolution: "The degree modifier 'too' pairs with the infinitive 'to comprehend' to show an excessive degree that prevents successful execution ('too complex to comprehend').",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200301);

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
        prompt: "Your school lacks a standard playing field for sporting activities. Write a formal letter to your District Chief Executive (DCE) appealing for municipal assistance to construct and equip a standard sports field for your school.",
        modelAnswer: `Anglican Junior High School
P. O. Box 24
Dormaa Ahenkro, Bono Region
15th May, 2003

The District Chief Executive
Dormaa District Assembly
Dormaa Ahenkro

Dear Sir,

AN APPEAL FOR ASSISTANCE TO DEVELOP A STANDARD PLAYING FIELD FOR OUR SCHOOL

On behalf of the students and staff of Anglican Junior High School, I respectfully write to appeal for the intervention of the District Assembly in leveling, constructing, and equipping a standard playing field for our school.

Currently, our school has an undulating, rocky clearing that serves as our recreation ground. During rainy seasons, the field degenerates into an eroded mud trap filled with deep gullies and pools of water. During physical education lessons and inter-school football matches, pupils frequently suffer twisted ankles, sprains, and abrasions from exposed rocks. Consequently, our school is unable to host inter-schools sports tournaments or provide safe physical recreation for our three hundred pupils.

Developing a standard playing field is vital for discovering and nurturing raw athletic talent. Our district is richly blessed with gifted young sprinters, footballers, and volleyball players. Providing a leveled turf and athletic track will foster physical health, instill teamwork, and curb truancy by keeping students engaged in wholesome co-curricular activities.

We humbly request that the District Assembly assist us with an earth-moving grader and bulldozer from the Works Department to level the field and excavate drainage channels. The youth and Parent-Teacher Association have already pledged to provide communal labor to plant lawn grass and construct spectator benches.

We pray that your esteemed office will favorably consider our appeal to uplift sports in our district.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Sports Prefect)`
      },
      {
        questionNumber: "2",
        category: "Informal / Persuasive Letter",
        prompt: "You wish to further your education after completing Junior Secondary School (JSS). Write a letter to your uncle giving him at least three compelling reasons why you need his financial sponsorship to attend Senior Secondary School.",
        modelAnswer: `Presbyterian Junior High School
P. O. Box 80
Begoro, Eastern Region
12th July, 2003

Dear Uncle Kwesi,

I hope this letter finds you in fine health, peace of mind, and prosperity in Accra. As our final BECE examinations approach, I write with deep humility and hope to share my educational plans and to appeal for your kind financial sponsorship to enable me to attend Senior Secondary School.

First, my biological parents are aged subsistence peasant farmers whose modest cocoa yield has dwindled due to recurring droughts. The meager income from the farm is barely sufficient to feed my younger siblings and pay their basic school levies. Sponsoring my secondary education—covering boarding fees, uniforms, and textbooks—will relieve my parents of a crushing financial burden and keep my academic dreams alive.

Secondly, I have demonstrated consistent academic excellence and dedication throughout my three years in junior secondary school. I have consistently placed first in my class in Mathematics and Integrated Science, and my teachers have endorsed me as the school's top candidate to secure Aggregate Six in the BECE. Investing in my education is planting a seed in fertile soil that will yield generational dividends for our entire extended family.

Finally, my ultimate career goal is to become an agricultural engineer. Gaining secondary STEM education will equip me with the technical expertise needed to modernize farming methods in our village and manage our family lands profitably.

I promise to study with relentless diligence to justify your investment. May God bless your business abundantly.

Your grateful nephew,
[Signature]
Emmanuel Osei`
      },
      {
        questionNumber: "3",
        category: "Descriptive / Expository Essay",
        prompt: "Your school is organizing an educational excursion to a prominent historical or industrial site in your region. Describe the meticulous preparations you and your schoolmates are making toward the journey.",
        modelAnswer: `PREPARATIONS FOR OUR MEMORABLE EXCURSION TO THE AKOSOMBO DAM

Excitement has gripped every classroom at Methodist Junior High School as our Science and Social Studies clubs finalize preparations for our upcoming educational excursion to the Akosombo Hydroelectric Dam and the Shai Hills Game Reserve scheduled for next Friday.

Our preparations began several weeks ago under the guidance of our lead patron, Mr. Mensah. First, we held a series of classroom orientation meetings to outline the objectives of the tour. We studied maps of the Volta River basin, researched the history of the dam's construction under Dr. Kwame Nkrumah, and prepared structured interview questionnaires to administer to Volta River Authority engineers. Every student procured a durable hard-cover notebook and pens to record observations.

Secondly, the student planning committee worked hand-in-hand with our parents to mobilize the excursion fees. Many of us took up minor holiday gardening errands and saved our weekly allowances to pay for the return commercial bus fare and guided site entry permits. The school health committee assembled an emergency first-aid box stocked with bandages, methylated spirit, paracetamol, and motion-sickness tablets.

On our part, we have prepared our neat ceremonial school uniforms and organized food rations. My mother has agreed to bake crispy meat pies and pack bottles of chilled water for my journey. We have also formed peer accountability pairs to ensure that no student wanders away from the group during the guided tours.

With all logistics smoothly settled, we are eagerly counting down the days to embark on what promises to be an educational and adventurous experience.`
      },
      {
        questionNumber: "4",
        category: "Article for Publication",
        prompt: "Write an article for publication in the Junior Graphic on the topic: \"Why Candidates Should Not Cheat in National Examinations.\"",
        modelAnswer: `THE POISON OF EXAMINATION MALPRACTICE: WHY INTEGRITY MUST PREVAIL
By Rebecca Arthur, JHS 3

In recent years, national examinations conducted by the West African Examinations Council (WAEC) have been plagued by the disturbing menace of examination malpractice. From smuggling foreign materials into examination halls to relying on leaked question papers, cheating has become a dangerous shortcut for many basic school candidates. However, candidates must realize that examination fraud is an intellectual poison with devastating consequences.

First and foremost, examination malpractice destroys authentic learning habits and personal self-confidence. The primary purpose of schooling is to acquire genuine knowledge, critical problem-solving skills, and intellectual competence. When candidates rely on cheating, they abandon disciplined study, library research, and homework. In the long run, students who cheat their way into Senior Secondary Schools and universities find themselves academically deficient, unable to cope with advanced academic work, and often suffer disgraceful dismissal.

Secondly, cheating attracts severe legal, institutional, and social penalties. WAEC regulations prescribe harsh sanctions: candidates caught cheating suffer the cancellation of their entire results, while schools face prolonged bans as examination centers. Furthermore, candidates risk arrest and imprisonment under national examination laws, bringing indelible shame, stigma, and heartbreak to their families.

On a national scale, examination malpractice degrades the international credibility of Ghanaian academic certificates and produces incompetent professionals who endanger public safety.

In conclusion, honesty is the cornerstone of true success. Candidates must study diligently, revise past questions thoroughly, and trust in their own preparations. A humble, honest pass is infinitely superior to a fraudulent distinction.`
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

async function seedBeceEnglish2003Calibrated() {
  console.log("Seeding Calibrated & Balanced BECE English 2003 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2003");
  await docRef.set({
    year: 2003,
    title: "BECE English Language 2003 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2003 successfully seeded into Firestore!");
}

seedBeceEnglish2003Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2003:", err);
    process.exit(1);
  });

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
// ISOMORPHIC PASSAGE I: THE UNSCHEDULED ASSEMBLY (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `The persistent, clanging toll of the brass bell at that unusual hour of the morning took everyone by surprise. What emergency could have occurred? Jostling and bumping into one another along the verandas, the pupils sprinted toward the assembly hall. Within moments, Mr. Darko, the headmaster, stood upon the dais with a stern, unyielding expression. He lifted his right palm, and instant silence fell across the hall.

"Students," he began in measured tones, "the reason I have summoned this emergency gathering is to inform you that, at long last, the school authorities have uncovered the culprits who broke into the staff room and stole the school's public address microphones. Bring them forward!" he commanded.

Heads turned and necks craned eagerly to catch sight of the thieves. First to emerge was Kofi Badu, the school's star football striker. Eyes widened in disbelief. "Good heavens!" gasped several pupils in astonishment. Next stepped Kwabena Ofori. "Impossible!" someone whispered from the back row. "Is that not our respected Form Two Class Prefect?" To crown the spectacle, Kwame Asare appeared last, his withered leg swinging between a pair of wooden crutches. The assembly hall exploded into uncontrollable laughter. The Senior Prefect had to shout at the top of his lungs before order could be restored. Everyone was utterly at a loss as to what had possessed the unlikely trio to commit such an ignominious crime.

In a voice that brooked no debate, the headmaster announced their penalty—two weeks' rustication.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "In Passage I, why was everyone surprised when the brass bell began tolling?",
    options: [
      "The students were bumping into each other along the veranda",
      "They had to abandon their classes and sprint to the hall",
      "The headmaster was standing sternly on the raised platform",
      "The bell was sounded unexpectedly outside the scheduled timetable"
    ],
    correctAnswer: "The bell was sounded unexpectedly outside the scheduled timetable",
    hint: "Reread the opening sentence: the persistent tolling at that unusual hour took everyone by surprise.",
    workedSolution: "The surprise was caused by the timing: the school bell was rung at an unexpected hour outside the regular school schedule.",
    points: 1
  },
  {
    number: 2,
    prompt: "Why did the students race frantically toward the assembly hall in Passage I?",
    options: [
      "The headmaster was visibly furious with them",
      "The class prefects instructed them to assemble immediately",
      "The persistent and continuous ringing signaled an urgent emergency",
      "The bell signified the formal close of the school session"
    ],
    correctAnswer: "The persistent and continuous ringing signaled an urgent emergency",
    hint: "A continuous, persistent bell outside scheduled hours communicates an urgent summons.",
    workedSolution: "The persistent ringing of the bell signaled an emergency, compelling all pupils to rush to the assembly hall without delay.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, why did the students burst into spontaneous, uncontrollable laughter?",
    options: [
      "Mr. Darko looked comical as he mounted the dais",
      "Kofi Badu the footballer attempted to deny the charges",
      "Kwabena Ofori the class prefect looked confused",
      "Kwame Asare, who was physically challenged on crutches, was among the thieves"
    ],
    correctAnswer: "Kwame Asare, who was physically challenged on crutches, was among the thieves",
    hint: "Paragraph three describes how the sight of a crippled boy on crutches participating in a burglary struck the crowd as absurd.",
    workedSolution: "The students exploded into laughter when Kwame Asare appeared on crutches, as no one expected a physically challenged pupil to take part in stealing.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the idiomatic phrase 'at a loss' in 'Everyone was utterly at a loss' means ............",
    options: [
      "deeply sorrowful",
      "indignant and angry",
      "completely bewildered and unable to comprehend",
      "dissatisfied with the investigation"
    ],
    correctAnswer: "completely bewildered and unable to comprehend",
    hint: "Perplexed, baffled, or unable to understand how something happened.",
    workedSolution: "'At a loss' is an idiom meaning completely puzzled, perplexed, or unable to comprehend a situation; 'completely bewildered and unable to comprehend' is its exact meaning.",
    points: 1
  },
  {
    number: 5,
    prompt: "What disciplinary sanction did the headmaster impose on the three culprits in Passage I?",
    options: [
      "He cautioned them sternly never to repeat the misconduct",
      "He directed the senior housemaster to cane them publicly",
      "He summoned their parents to reimburse the cost of the microphones",
      "He suspended them from attending school for two weeks"
    ],
    correctAnswer: "He suspended them from attending school for two weeks",
    hint: "Check the final sentence: the headmaster announced their penalty—two weeks' rustication.",
    workedSolution: "The headmaster officially handed down a disciplinary sentence of two weeks' rustication (suspension) from the school.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: FESTIVE VANITY AT CHRISTMAS (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Text = `Before Kofi Mensah stepped out of his house that bright morning for the Christmas church service, he spent twenty minutes admiring his brand-new attire and a velvet cap richly embroidered with radiant yellow thread. He tilted the cap at various fashionable angles, consulting a pocket mirror to determine the most dashing posture.

Throughout the chapel liturgy, Kofi caught himself constantly stroking his new clothes. Whenever the congregation sat down, he transferred his attention from his tunic to his shiny new shoes, nicknamed "Walking Jet"—the very first pair of footwear he had ever possessed. He was not alone in this display. Even the choristers, who ought to have marched in the liturgical procession, chose to sit among the ordinary worshippers in the nave so that everyone could admire their festive outfits. The chapel itself wore a radiant holiday appearance, decorated with palm fronds, crepe ribbons, and fresh lilies.

Kofi's sole irritation was that traditional chapel etiquette forbade males from wearing caps indoors. Outside, the harmattan winds blew dry and dusty, parching one's throat. One could scarcely smile without chapping one's lips. In spite of the biting haze, Kofi preferred loitering outdoors where he could proudly flaunt his embroidered cap. Consequently, when the resident pastor ascended the pulpit to deliver the holiday homily, Kofi fabricated an excuse to the church warden, claiming that he needed to relieve himself outside.`;

const passage2Questions = [
  {
    number: 6,
    prompt: "According to Passage II, why was Kofi Mensah thoroughly inattentive during the chapel service?",
    options: [
      "He was overwhelmed by physical fatigue from Christmas preparations",
      "The harmattan haze was irritating his eyes and throat",
      "He was completely absorbed in admiring his new clothes and footwear",
      "He was captivated by the floral decorations in the sanctuary"
    ],
    correctAnswer: "He was completely absorbed in admiring his new clothes and footwear",
    hint: "Paragraph two notes that he constantly stroked his tunic and admired his shoes whenever the congregation sat down.",
    workedSolution: "Kofi's vanity and total absorption in admiring his brand-new festive clothes and shoes made him inattentive to the church service.",
    points: 1
  },
  {
    number: 7,
    prompt: "Why were Kofi Mensah's shoes exceptionally precious to him in Passage II?",
    options: [
      "They carried the fashionable nickname 'Walking Jet'",
      "They represented the very first pair of footwear he had ever owned",
      "They produced a rhythmic creaking sound as he walked",
      "They had been imported from an overseas metropolitan city"
    ],
    correctAnswer: "They represented the very first pair of footwear he had ever owned",
    hint: "Check paragraph two: '...his shoes, nicknamed \'Walking Jet\'—the very first pair of footwear he had ever possessed.'",
    workedSolution: "The narrative emphasizes that the shoes were precious to Kofi because they were the very first pair of shoes he had ever owned in his life.",
    points: 1
  },
  {
    number: 8,
    prompt: "According to Passage II, what unusual choice did the church choristers make that morning?",
    options: [
      "They refused to sing the prescribed Christmas hymns",
      "They boycotted the service due to the harmattan haze",
      "They sat in the pews with the congregation to display their new clothes",
      "They remained outside because they disliked their choir gowns"
    ],
    correctAnswer: "They sat in the pews with the congregation to display their new clothes",
    hint: "Paragraph two states: 'Even the choristers... chose to sit among the ordinary worshippers in the nave so that everyone could admire their festive outfits.'",
    workedSolution: "Like Kofi, the choristers prioritized displaying their new holiday outfits over their formal role in the choir procession.",
    points: 1
  },
  {
    number: 9,
    prompt: "What was Kofi Mensah's real motive for asking permission to leave the chapel in Passage II?",
    options: [
      "The interior of the sanctuary had become uncomfortably warm",
      "He disliked the pastor's preaching style and sermon topic",
      "He genuinely needed to make use of the washroom facilities",
      "He wished to wear and exhibit his embroidered cap in public"
    ],
    correctAnswer: "He wished to wear and exhibit his embroidered cap in public",
    hint: "He could not wear his cap inside the chapel, so he slipped outside where he could display it despite the dusty harmattan.",
    workedSolution: "Kofi went outside specifically so he could put on his embroidered cap, which church decorum prohibited him from wearing indoors.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the statement 'He was not alone in this display' signifies that Kofi ............",
    options: [
      "was accompanied by his biological brothers in church",
      "was seated beside his parents on the wooden pew",
      "was not the only worshipper eager to flaunt new holiday clothing",
      "walked out of the chapel in the company of the church warden"
    ],
    correctAnswer: "was not the only worshipper eager to flaunt new holiday clothing",
    hint: "The narrator observes that other congregants and even the choristers were eager to show off their new clothes.",
    workedSolution: "The phrase indicates that many other worshippers in the chapel shared the same vanity of showing off their new holiday outfits on Christmas Day.",
    points: 1
  },
  {
    number: 11,
    prompt: "In Passage II, the phrase 'relieve himself' functions as a polite euphemism meaning to ............",
    options: [
      "alleviate his physical bodily pain",
      "display his festive embroidered attire",
      "urinate or empty one's bowels",
      "rest from singing the liturgical hymns"
    ],
    correctAnswer: "urinate or empty one's bowels",
    hint: "A standard polite English euphemism for using the toilet.",
    workedSolution: "'To relieve oneself' is a formal euphemism meaning to urinate or defecate; 'urinate or empty one's bowels' is the exact literal meaning.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 1999 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "The candidate's poor performance in the trial test made the head coach very anxious.\nChoose the word nearest in meaning to 'anxious'.",
    options: ["hopeful", "indignant", "envious", "apprehensive"],
    correctAnswer: "apprehensive",
    hint: "Experiencing worry, nervousness, or unease about an uncertain outcome.",
    workedSolution: "'Anxious' means experiencing worry, nervousness, or unease; 'apprehensive' (or worried) is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The disciplinary panel was directed to investigate the laboratory burglary.\nChoose the phrase nearest in meaning to 'investigate'.",
    options: ["condemn", "probe into", "settle", "search for"],
    correctAnswer: "probe into",
    hint: "To inquire into, examine systematically, or look into the details.",
    workedSolution: "The phrasal verb 'to probe into' (or 'go into') means to investigate or examine the facts of an issue systematically.",
    points: 1
  },
  {
    number: 14,
    prompt: "The invigilator could not bear the incessant whispering in the examination hall.\nChoose the word nearest in meaning to 'bear'.",
    options: ["endure", "comprehend", "absorb", "discern"],
    correctAnswer: "endure",
    hint: "To put up with, tolerate, or suffer without surrender.",
    workedSolution: "'Bear' in the sense of putting up with unpleasant circumstances means to 'endure' or tolerate.",
    points: 1
  },
  {
    number: 15,
    prompt: "In a fit of temper, the student spoke to the teacher in an impolite manner.\nChoose the word nearest in meaning to 'impolite'.",
    options: ["foolish", "boisterous", "insolent", "fearless"],
    correctAnswer: "insolent",
    hint: "Lacking good manners, civility, or proper respect.",
    workedSolution: "'Impolite' means discourteous, rude, or ill-mannered; 'insolent' (or rude) is its direct synonym.",
    points: 1
  },
  {
    number: 16,
    prompt: "Dr. Mensah was a renowned surgeon who pioneered rural healthcare.\nChoose the word nearest in meaning to 'renowned'.",
    options: ["austere", "modest", "valiant", "celebrated"],
    correctAnswer: "celebrated",
    hint: "Widely known, acclaimed, or famous.",
    workedSolution: "'Renowned' means famous, acclaimed, and widely recognized; 'celebrated' is its exact synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "The news of the director's surprise inspection kept all the school prefects on their toes. This means the prefects ............",
    options: [
      "stood up immediately in the corridor",
      "fled from the school compound",
      "were watchful, alert, and fully prepared for duty",
      "became completely exhausted"
    ],
    correctAnswer: "were watchful, alert, and fully prepared for duty",
    hint: "Staying vigilant, prepared, and actively attentive.",
    workedSolution: "The idiom 'on one's toes' means alert, watchful, and fully prepared to act or handle any emergency.",
    points: 1
  },
  {
    number: 18,
    prompt: "During his preparation for the national examinations, Kwame left no stone unturned. This means that Kwame ............",
    options: [
      "found the syllabus difficult to comprehend",
      "explored every possible avenue and studied thoroughly",
      "was guaranteed a distinction beforehand",
      "cleared all the loose gravel from the compound"
    ],
    correctAnswer: "explored every possible avenue and studied thoroughly",
    hint: "Doing everything possible and using every resource to achieve a goal.",
    workedSolution: "The idiom 'to leave no stone unturned' means to do everything possible and explore every resource or method thoroughly.",
    points: 1
  },
  {
    number: 19,
    prompt: "For the sake of peaceful reconciliation, Kofi gave in to his partner after their bitter dispute. This means that Kofi ............",
    options: [
      "yielded and surrendered his position",
      "avoided his partner completely",
      "abandoned his commercial enterprise",
      "defeated his partner in court"
    ],
    correctAnswer: "yielded and surrendered his position",
    hint: "Ceasing resistance and surrendering to another's position.",
    workedSolution: "The phrasal idiom 'to give in' means to cease opposition, yield, or surrender to another person's demands.",
    points: 1
  },
  {
    number: 20,
    prompt: "John was initially ahead of the class in mathematics, but we soon caught up with him. This means that ............",
    options: [
      "John was the tallest student in the class",
      "John withdrew himself from group studies",
      "we stood directly in front of John",
      "we attained the exact same standard of achievement as John"
    ],
    correctAnswer: "we attained the exact same standard of achievement as John",
    hint: "Closing a gap and reaching the same level as someone ahead.",
    workedSolution: "'To catch up with someone' means to reach the same standard, level, or position after lagging behind.",
    points: 1
  },
  {
    number: 21,
    prompt: "Kwadwo turned a deaf ear to his mother's wise counsel. This means that Kwadwo ............",
    options: [
      "turned his damaged ear toward her",
      "deliberately refused to listen or comply",
      "blocked his ears with cotton wool",
      "suffered from acute hearing impairment"
    ],
    correctAnswer: "deliberately refused to listen or comply",
    hint: "Refusing to pay attention, listen, or comply with advice.",
    workedSolution: "'To turn a deaf ear' is an idiom meaning to deliberately ignore, disregard, or refuse to listen to counsel.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "While Mensah was hopeful of securing the scholarship, his sister was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'hopeful'.",
    options: ["mindful", "fearful", "prudent", "skeptical"],
    correctAnswer: "skeptical",
    hint: "'Hopeful' means optimistic. Find the word denoting doubt or lack of confidence.",
    workedSolution: "'Hopeful' means optimistic and expectant. Its direct antonym regarding expectations is 'skeptical' (or doubtful).",
    points: 1
  },
  {
    number: 23,
    prompt: "The headmaster condemned the prefect's unruly conduct, but ...... the library monitor's honesty.\nChoose the word most nearly opposite in meaning to 'condemned'.",
    options: ["recorded", "excused", "certified", "lauded"],
    correctAnswer: "lauded",
    hint: "'Condemned' means expressed severe disapproval. Find the word denoting high praise.",
    workedSolution: "'Condemned' means officially denounced or criticized. Its direct antonym is 'lauded' (praised or commended).",
    points: 1
  },
  {
    number: 24,
    prompt: "Mary looked exceptionally attractive in her new ceremonial attire, whereas her partner appeared rather ...... .\nChoose the word most nearly opposite in meaning to 'attractive'.",
    options: ["comfortable", "shabby", "cheerful", "proud"],
    correctAnswer: "shabby",
    hint: "'Attractive' means elegant and pleasing in appearance. Find the word meaning untidy, inelegant, or unappealing.",
    workedSolution: "'Attractive' implies elegance and neat appeal. In describing aesthetic posture and clothing, its antonym here is 'shabby' (or clumsy/untidy).",
    points: 1
  },
  {
    number: 25,
    prompt: "The melodious hymn soothed the congregation, whereas the brass band sounded harsh and ...... .\nChoose the word most nearly opposite in meaning to 'melodious'.",
    options: ["triumphant", "archaic", "unfamiliar", "discordant"],
    correctAnswer: "discordant",
    hint: "'Melodious' means sweet-sounding and harmonious. Find the word denoting clashing, unharmonious sounds.",
    workedSolution: "'Melodious' means sweet and harmonious in sound. Its direct musical antonym is 'discordant' (harsh and clashing).",
    points: 1
  },
  {
    number: 26,
    prompt: "The landlord was indifferent to the tenant's domestic plight, but the neighbors were deeply ...... .\nChoose the word most nearly opposite in meaning to 'indifferent'.",
    options: ["similar", "compassionate", "austere", "courteous"],
    correctAnswer: "compassionate",
    hint: "'Indifferent' means uncaring and unconcerned. Find the word meaning caring and sympathetic.",
    workedSolution: "'Indifferent' means showing a lack of care or interest. Its direct antonym is 'compassionate' (concerned or sympathetic).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (27 - 40) ---
  {
    number: 27,
    prompt: "Children should always look ...... their parents and teachers for moral guidance.",
    options: ["about", "up to", "at", "up for"],
    correctAnswer: "up to",
    hint: "Identify the phrasal verb meaning to view someone with respect, admiration, and expectation of guidance.",
    workedSolution: "The phrasal verb 'to look up to someone' means to respect, admire, and look to them as a role model.",
    points: 1
  },
  {
    number: 28,
    prompt: "Complete the mathematics test promptly and ...... your answer scripts to the invigilator.",
    options: ["hand up", "hand out", "hand in", "hand down"],
    correctAnswer: "hand in",
    hint: "Identify the phrasal verb meaning to submit, surrender, or deliver completed schoolwork to an authority.",
    workedSolution: "The phrasal verb 'to hand in' (or 'hand over') means to submit or deliver documents formally to an official.",
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
    hint: "An affirmative present statement with copula 'is' and feminine subject takes the negative tag 'isn't she?'.",
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
    hint: "An ongoing past continuous action interrupted by a sudden past simple event ('entered').",
    workedSolution: "The past continuous tense ('was sweeping') is required to express an ongoing past background activity interrupted by another past event.",
    points: 1
  },
  {
    number: 34,
    prompt: "After the grueling boxing tournament, the two competitors warmly congratulated ......",
    options: ["one another", "each other", "one other", "each another"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('the two competitors'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 35,
    prompt: "The villagers testified that Mr. Mensah was the ...... industrious cocoa farmer in the district.",
    options: ["very most", "very more", "most", "more"],
    correctAnswer: "most",
    hint: "Form the superlative degree of multi-syllable adjectives preceded by 'the'.",
    workedSolution: "Multi-syllable adjectives like 'industrious' form their superlative degree with 'most' preceded by 'the' ('the most industrious').",
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
    options: ["stay", "were stayed", "stayed", "have resided"],
    correctAnswer: "have resided",
    hint: "An action that began in the past and continues up to the present with 'for twenty years now' requires the Present Perfect tense.",
    workedSolution: "The duration phrase 'for twenty years now' indicating an ongoing state from the past into the present requires the Present Perfect tense ('have resided' / 'have stayed').",
    points: 1
  },
  {
    number: 40,
    prompt: "The storekeeper was certain that he had handed the change to ...... else in the shop.",
    options: ["anyone", "someone", "somebody", "everybody"],
    correctAnswer: "someone",
    hint: "Use 'someone' in affirmative statements to denote an unspecified person.",
    workedSolution: "In affirmative declarative sentences, 'someone' is standard when referring to an unspecified person ('someone else'). 'Anyone' is used primarily in negatives and interrogatives.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199902);

// Attach Passage I (Q1-5) and Passage II (Q6-11) directly to questions so that
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
    passageTitle = "Passage I: The Unscheduled Assembly";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 6 && qNum <= 11) {
    passageTitle = "Passage II: Festive Vanity at Christmas";
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
const passage2Items = balancedPaper1.slice(5, 11);
const remainingItems = balancedPaper1.slice(11);

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
        prompt: "Write a letter to your local Assemblywoman highlighting two pressing social amenities that should be urgently provided for the people in your electoral area.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Dormaa Ahenkro, Bono Region
18th October, 1999

The Assemblywoman
Dormaa Central Electoral Area
Municipal Assembly, Dormaa Ahenkro

Dear Madam,

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
        prompt: "Your parents traveled out of town and left you in charge of the house for an entire day. Narrate to your friends what you did and how you managed the household responsibilities.",
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

async function seedBeceEnglish1999Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1999 into Firestore...");

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
          title: "Passage I: The Unscheduled Assembly",
          text: passage1Text,
          questionRange: "Questions 1 to 5"
        },
        {
          id: "passage_2",
          title: "Passage II: Festive Vanity at Christmas",
          text: passage2Text,
          questionRange: "Questions 6 to 11"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Unscheduled Assembly",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: Festive Vanity at Christmas",
          text: passage2Text,
          questionRange: "Questions 6 to 11",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 12 to 40",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1999 successfully seeded into Firestore!");
}

seedBeceEnglish1999Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1999:", err);
    process.exit(1);
  });

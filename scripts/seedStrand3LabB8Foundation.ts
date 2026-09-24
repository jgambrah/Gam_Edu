import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin: any = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
    }
  } catch (e) {
    console.warn("OAuth fallback failed, trying default admin credential:", e);
  }

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
    } catch (e) {}
  }
  return fbAdmin.firestore();
}

interface LabQuestion {
  id: string;
  level: "B8";
  difficulty: "foundation";
  questionNumber: number;
  isCapstoneExamPassage: boolean;
  passageText: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  competencyTarget: string;
  learningCompetency: string;
}

// =========================================================================
// CAPSTONE MULTI-PARAGRAPH PASSAGE (QUESTIONS 51 TO 55)
// Strand 3 B8 Focus: Cumulative Adjective Hierarchy (OSASCOMP) &
// Phrasal Verb Particle Movement (The Pronoun Movement Law)
// =========================================================================
const b8GrammarFoundationCapstonePassage = 
`Mr. Mensah, the proprietor of an antique furniture workshop in Kumasi, recently completed a prestigious restoration contract for the regional cultural centre. In the centre of his showroom stood an exquisite large antique circular brown Ghanaian mahogany dining table that had been carved by royal craftsmen over eight decades ago. The polished timber possessed a rich grain that drew admiration from every visiting patron. To complement the centerpiece, his apprentices assembled six magnificent tall modern rectangular black Ashanti wooden chairs upholstered with woven velvet.

While preparing the consignment for delivery, the senior apprentice noticed that the workshop radio was playing at a deafening volume, disturbing the craftsmen as they packed the delicate carved cornices. Mr. Mensah instructed the young apprentice to turn the noise down immediately. Because the boy was holding a heavy polishing cloth, he walked over to the electrical switch and turned it off with his forearm. The proprietor commended the quick action, reminding the workers that loud distractions could easily cause someone to scratch the hand-rubbed varnish.

Moments later, a freight dispatch driver arrived at the loading bay with a flatbed truck to transport the furniture. However, halfway through the loading process, the old delivery vehicle experienced mechanical trouble: the diesel engine began to cough black smoke and broke down directly in front of the warehouse gates. The driver and the apprentices quickly banded together to push the lorry aside so other traffic would not be blocked along the commercial avenue.

Rather than becoming disheartened by the transport delay, Mr. Mensah decided to call off the afternoon delivery run until a reliable recovery truck arrived. He gathered his team to review their safety procedures, warning them never to look down on routine mechanical inspections before long journeys. By nightfall, a replacement vehicle had been secured, allowing the team to deliver the historic furniture safely without a single scratch.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Strand 3 B8 Foundation Competencies:
// 1. Cumulative Adjective Ordering (OSASCOMP Formula & Zero-Comma Rule)
// 2. Transitive Separable Phrasal Verbs & The Pronoun Movement Law
// 3. Common Inseparable and Intransitive Phrasal Verbs
// 4. Elementary Three-Part Phrasal-Prepositional Verbs
// =========================================================================
const unique50B8GrammarFoundationDrills = [
  {
    passage: "The queenmother wore a ________ necklace that shimmered under the golden palace chandeliers.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "beautiful small antique gold",
      "small beautiful antique gold",
      "gold antique beautiful small",
      "beautiful gold small antique"
    ],
    answer: "beautiful small antique gold",
    hint: "Apply the OSASCOMP formula: Opinion (beautiful) -> Size (small) -> Age (antique) -> Material (gold).",
    solution: "According to the OSASCOMP hierarchy, Opinion ('beautiful') precedes Size ('small'), which precedes Age ('antique'), followed by Material ('gold'). Therefore, 'beautiful small antique gold' is the only correct sequence.",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The radio was blaring loud highlife music in the bedroom, so Kofi walked over and ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "turned it off",
      "turned off it",
      "turned off them",
      "turned it on off"
    ],
    answer: "turned it off",
    hint: "When the object of a separable phrasal verb is a pronoun ('it'), the particle must follow the pronoun.",
    solution: "The Pronoun Movement Law mandates that when a personal pronoun ('it') serves as the direct object of a transitive separable phrasal verb ('turn off'), the particle must move after the pronoun: 'turned it off'. 'Turned off it' is ungrammatical.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The headmaster sat behind a ________ desk in his newly renovated administrative office.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent large rectangular wooden",
      "wooden large magnificent rectangular",
      "large magnificent wooden rectangular",
      "rectangular magnificent large wooden"
    ],
    answer: "magnificent large rectangular wooden",
    hint: "OSASCOMP order: Opinion (magnificent) -> Size (large) -> Shape (rectangular) -> Material (wooden).",
    solution: "Opinion ('magnificent') comes first, followed by Size ('large'), Shape ('rectangular'), and Material ('wooden').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Due to the torrential harmattan rains, the sports master had to ________ the inter-house athletic competition.",
    question: "Choose the correct phrasal verb meaning 'to cancel':",
    options: [
      "call off",
      "call on",
      "put on",
      "give up"
    ],
    answer: "call off",
    hint: "'Call off' means to cancel an event, while 'put off' means to postpone it.",
    solution: "The phrasal verb 'call off' means to cancel a scheduled event. 'Call on' means to visit or invite to speak.",
    target: "Phrasal Verbs: Semantic Identification"
  },
  {
    passage: "The potter shaped a ________ water jug on his spinning clay wheel.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "charming small round clay",
      "clay charming small round",
      "round small charming clay",
      "small round clay charming"
    ],
    answer: "charming small round clay",
    hint: "OSASCOMP: Opinion (charming) -> Size (small) -> Shape (round) -> Material (clay).",
    solution: "Opinion ('charming') leads the sequence, followed by Size ('small'), Shape ('round'), and Material ('clay').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Kofi took off his dirty running shoes and ________ neatly on the shoe rack.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "put them away",
      "put away them",
      "put away it",
      "put it away"
    ],
    answer: "put them away",
    hint: "'Shoes' is plural (pronoun 'them'), and the pronoun must sit between the verb and the particle.",
    solution: "Because the direct object is the pronoun 'them', the separable phrasal verb 'put away' must split: 'put them away'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The museum curator unveiled an ________ ceremonial stool carved from sacred timber.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "exquisite ancient Ashanti wooden",
      "Ashanti ancient exquisite wooden",
      "wooden ancient Ashanti exquisite",
      "exquisite wooden ancient Ashanti"
    ],
    answer: "exquisite ancient Ashanti wooden",
    hint: "OSASCOMP: Opinion (exquisite) -> Age (ancient) -> Origin (Ashanti) -> Material (wooden).",
    solution: "Opinion ('exquisite') precedes Age ('ancient'), which precedes Origin ('Ashanti'), followed by Material ('wooden').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The old haulage truck ________ on the steep incline of the mountain road, causing a severe traffic jam.",
    question: "Choose the correct intransitive phrasal verb meaning 'ceased to function':",
    options: [
      "broke down",
      "broke up",
      "broke in",
      "broke out"
    ],
    answer: "broke down",
    hint: "When mechanical vehicles or engines stop working, they...",
    solution: "'Break down' is an intransitive phrasal verb meaning a machine or vehicle has stopped working due to mechanical failure.",
    target: "Phrasal Verbs: Intransitive Verbs"
  },
  {
    passage: "Mother purchased a ________ basket to carry ripe plantains from the farm.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "splendid huge oval cane",
      "huge splendid oval cane",
      "cane splendid huge oval",
      "oval huge splendid cane"
    ],
    answer: "splendid huge oval cane",
    hint: "OSASCOMP: Opinion (splendid) -> Size (huge) -> Shape (oval) -> Material (cane).",
    solution: "Opinion ('splendid') comes before Size ('huge'), followed by Shape ('oval') and Material ('cane').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The fire alarm was so deafening that the teacher told the class captain to ________.",
    question: "Choose the grammatically correct construction:",
    options: [
      "switch it off",
      "switch off it",
      "switch off them",
      "switch down it"
    ],
    answer: "switch it off",
    hint: "The pronoun 'it' must precede the particle 'off'.",
    solution: "The Pronoun Movement Law dictates that pronoun objects must be placed between the verb and particle: 'switch it off'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The tailor stitched an elegant gown from ________ silk brought from abroad.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "expensive modern blue Chinese",
      "blue modern Chinese expensive",
      "Chinese blue modern expensive",
      "modern expensive blue Chinese"
    ],
    answer: "expensive modern blue Chinese",
    hint: "OSASCOMP: Opinion (expensive) -> Age (modern) -> Colour (blue) -> Origin (Chinese).",
    solution: "Opinion ('expensive') precedes Age ('modern'), which precedes Colour ('blue'), followed by Origin ('Chinese').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The examination council decided to ________ the start of the paper by two hours due to flooded roads.",
    question: "Choose the correct phrasal verb meaning 'to postpone':",
    options: [
      "put off",
      "put on",
      "put out",
      "put away"
    ],
    answer: "put off",
    hint: "'Put off' means to delay or postpone to a later time.",
    solution: "'Put off' means to postpone or delay an event. 'Put out' means to extinguish a fire.",
    target: "Phrasal Verbs: Semantic Identification"
  },
  {
    passage: "The village carpenter built a ________ dining bench for the school cafeteria.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "solid long rectangular wooden",
      "wooden solid long rectangular",
      "rectangular long solid wooden",
      "solid rectangular wooden long"
    ],
    answer: "solid long rectangular wooden",
    hint: "OSASCOMP: Opinion (solid) -> Size (long) -> Shape (rectangular) -> Material (wooden).",
    solution: "Opinion ('solid') comes before Size ('long'), followed by Shape ('rectangular') and Material ('wooden').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "When you write an incorrect word in your essay, you should neatly ________ with a single line.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "cross it out",
      "cross out it",
      "cross out them",
      "cross down it"
    ],
    answer: "cross it out",
    hint: "The pronoun 'it' must be placed between 'cross' and 'out'.",
    solution: "With separable transitive verbs like 'cross out', a pronoun direct object ('it') must precede the particle: 'cross it out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The paramount chief stepped out wearing a ________ kente cloth during the Yam Festival.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent heavy new multicolored",
      "multicolored heavy magnificent new",
      "new magnificent multicolored heavy",
      "heavy multicolored new magnificent"
    ],
    answer: "magnificent heavy new multicolored",
    hint: "OSASCOMP: Opinion (magnificent) -> Size/Weight (heavy) -> Age (new) -> Colour (multicolored).",
    solution: "Opinion ('magnificent') precedes Size/Weight ('heavy'), which precedes Age ('new'), followed by Colour ('multicolored').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The local police detectives were instructed to ________ the mysterious burglary at the district bank.",
    question: "Choose the correct inseparable phrasal verb meaning 'to investigate':",
    options: [
      "look into",
      "look after",
      "look for",
      "look down"
    ],
    answer: "look into",
    hint: "'Look into' means to investigate thoroughly.",
    solution: "'Look into' is an inseparable prepositional/phrasal verb meaning to investigate or examine the facts of a situation.",
    target: "Phrasal Verbs: Inseparable Verbs"
  },
  {
    passage: "The blacksmith forged a ________ cutlass for clearing thick forest vegetation.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "useful long curved iron",
      "iron long useful curved",
      "curved long useful iron",
      "useful iron curved long"
    ],
    answer: "useful long curved iron",
    hint: "OSASCOMP: Opinion (useful) -> Size (long) -> Shape (curved) -> Material (iron).",
    solution: "Opinion ('useful') leads, followed by Size ('long'), Shape ('curved'), and Material ('iron').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Here is your library book; please make sure you ________ before the due date tomorrow.",
    question: "Choose the grammatically correct construction:",
    options: [
      "give it back",
      "give back it",
      "give them back",
      "give back them"
    ],
    answer: "give it back",
    hint: "'Book' is singular (pronoun 'it'), which must sit between 'give' and 'back'.",
    solution: "The pronoun 'it' must separate the verb and particle in separable phrasal verbs: 'give it back'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The tourist admired the ________ fortress overlooking the roaring Atlantic waves.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "imposing ancient stone",
      "stone imposing ancient",
      "ancient stone imposing",
      "imposing stone ancient"
    ],
    answer: "imposing ancient stone",
    hint: "OSASCOMP: Opinion (imposing) -> Age (ancient) -> Material (stone).",
    solution: "Opinion ('imposing') comes before Age ('ancient'), which precedes Material ('stone').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Kwaku resembles his grandfather so closely that everybody says he ________ him.",
    question: "Choose the correct inseparable phrasal verb meaning 'to resemble in appearance or character':",
    options: [
      "takes after",
      "takes on",
      "takes up",
      "takes in"
    ],
    answer: "takes after",
    hint: "When a child inherits traits from an older family member, he...",
    solution: "'Take after' is an inseparable phrasal verb meaning to resemble a parent or ancestor in appearance or behavior.",
    target: "Phrasal Verbs: Inseparable Verbs"
  },
  {
    passage: "The athlete put on a pair of ________ running shoes before stepping onto the track.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "durable light new white",
      "white new light durable",
      "new durable white light",
      "light white new durable"
    ],
    answer: "durable light new white",
    hint: "OSASCOMP: Opinion (durable) -> Size/Weight (light) -> Age (new) -> Colour (white).",
    solution: "Opinion ('durable') precedes Size/Weight ('light'), which precedes Age ('new'), followed by Colour ('white').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "If you cannot find the meaning of that unfamiliar word, you should ________ in your dictionary.",
    question: "Choose the grammatically correct construction:",
    options: [
      "look it up",
      "look up it",
      "look down it",
      "look out it"
    ],
    answer: "look it up",
    hint: "The pronoun 'it' must be placed between 'look' and 'up'.",
    solution: "In the separable phrasal verb 'look up', a pronoun direct object ('it') must sit between the verb and particle: 'look it up'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The interior decorator installed a ________ mirror above the marble washbasin.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "charming large oval glass",
      "glass oval large charming",
      "large charming glass oval",
      "oval large charming glass"
    ],
    answer: "charming large oval glass",
    hint: "OSASCOMP: Opinion (charming) -> Size (large) -> Shape (oval) -> Material (glass).",
    solution: "Opinion ('charming') comes first, followed by Size ('large'), Shape ('oval'), and Material ('glass').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The teacher instructed the pupils not to ________ their impoverished classmates who lacked school uniforms.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to despise':",
    options: [
      "look down on",
      "look up to",
      "put up with",
      "run out of"
    ],
    answer: "look down on",
    hint: "'Look down on' means to view someone with contempt or disdain.",
    solution: "The three-part idiom 'look down on' means to despise or consider oneself superior to someone else.",
    target: "Phrasal-Prepositional Verbs: Look Down On"
  },
  {
    passage: "Father bought a ________ briefcase for his new job at the ministry.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "handsome slim rectangular black leather",
      "black leather handsome slim rectangular",
      "leather handsome black slim rectangular",
      "slim rectangular handsome black leather"
    ],
    answer: "handsome slim rectangular black leather",
    hint: "OSASCOMP: Opinion (handsome) -> Size (slim) -> Shape (rectangular) -> Colour (black) -> Material (leather).",
    solution: "Opinion ('handsome') -> Size ('slim') -> Shape ('rectangular') -> Colour ('black') -> Material ('leather').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The candles were burning dangerously close to the curtains, so Ama quickly ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "blew them out",
      "blew out them",
      "blew out it",
      "blew it out"
    ],
    answer: "blew them out",
    hint: "'Candles' is plural, requiring 'them', which must precede the particle 'out'.",
    solution: "The plural pronoun 'them' must be positioned between the verb and particle in the separable phrasal verb 'blow out': 'blew them out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The archaeologist discovered a ________ coin buried beneath the ancient temple ruins.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "rare tiny circular bronze",
      "circular bronze tiny rare",
      "bronze rare circular tiny",
      "tiny circular bronze rare"
    ],
    answer: "rare tiny circular bronze",
    hint: "OSASCOMP: Opinion (rare) -> Size (tiny) -> Shape (circular) -> Material (bronze).",
    solution: "Opinion ('rare') precedes Size ('tiny'), which precedes Shape ('circular'), followed by Material ('bronze').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The clinic ran out of bandages, but the dedicated nurses refused to ________ their patients.",
    question: "Choose the correct phrasal verb meaning 'to abandon or surrender':",
    options: [
      "give up on",
      "put up with",
      "look into",
      "call off"
    ],
    answer: "give up on",
    hint: "'Give up on' means to stop trying or stop having faith in someone.",
    solution: "'Give up on' is a three-part phrasal verb meaning to abandon hope or cease efforts regarding someone or something.",
    target: "Phrasal-Prepositional Verbs: Give Up On"
  },
  {
    passage: "Grandmother keeps her savings in a ________ clay pot tucked behind the cupboard.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "delightful small round traditional",
      "traditional small round delightful",
      "round small delightful traditional",
      "delightful traditional round small"
    ],
    answer: "delightful small round traditional",
    hint: "OSASCOMP: Opinion (delightful) -> Size (small) -> Shape (round) -> Origin/Type (traditional).",
    solution: "Opinion ('delightful') -> Size ('small') -> Shape ('round') -> Origin/Type ('traditional').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "When you enter a mosque or traditional shrine, it is customary to remove your sandals and ________.",
    question: "Choose the grammatically correct construction:",
    options: [
      "leave them outside",
      "leave outside them",
      "leave outside it",
      "leave it outside"
    ],
    answer: "leave them outside",
    hint: "'Sandals' is plural (pronoun 'them'), which must precede the particle/adverb 'outside'.",
    solution: "The pronoun 'them' must precede the adverbial particle 'outside': 'leave them outside'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The artisan displayed a ________ walking stick crafted for the paramount chief.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent slender long wooden",
      "wooden magnificent slender long",
      "long wooden magnificent slender",
      "slender wooden long magnificent"
    ],
    answer: "magnificent slender long wooden",
    hint: "OSASCOMP: Opinion (magnificent) -> Size/Girth (slender) -> Size/Length (long) -> Material (wooden).",
    solution: "Opinion ('magnificent') precedes Size dimensions ('slender long'), followed by Material ('wooden').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The school generator exhausted its diesel fuel because the bursar had forgotten to ________ the storage tank.",
    question: "Choose the correct phrasal verb meaning 'to replenish completely':",
    options: [
      "fill up",
      "fill in",
      "fill out",
      "fill with"
    ],
    answer: "fill up",
    hint: "'Fill up' means to fill a container completely to the top.",
    solution: "'Fill up' means to make completely full of liquid or fuel. 'Fill in' and 'fill out' apply primarily to forms.",
    target: "Phrasal Verbs: Semantic Identification"
  },
  {
    passage: "The school choir wore ________ waistcoats during their performance at the national theater.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "smart modern black woolen",
      "woolen black smart modern",
      "black modern smart woolen",
      "modern smart black woolen"
    ],
    answer: "smart modern black woolen",
    hint: "OSASCOMP: Opinion (smart) -> Age (modern) -> Colour (black) -> Material (woolen).",
    solution: "Opinion ('smart') -> Age ('modern') -> Colour ('black') -> Material ('woolen').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The rubbish bins were overflowing with waste, so the sanitation prefect instructed the boys to ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "empty them out",
      "empty out them",
      "empty out it",
      "empty it out"
    ],
    answer: "empty them out",
    hint: "'Bins' is plural, requiring 'them' positioned before 'out'.",
    solution: "With the plural noun 'bins', the pronoun 'them' must sit between the verb 'empty' and the particle 'out': 'empty them out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The farmer planted his crops in a ________ garden plot behind his village cottage.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "lovely small rectangular vegetable",
      "vegetable small lovely rectangular",
      "rectangular lovely small vegetable",
      "small rectangular lovely vegetable"
    ],
    answer: "lovely small rectangular vegetable",
    hint: "OSASCOMP: Opinion (lovely) -> Size (small) -> Shape (rectangular) -> Purpose (vegetable).",
    solution: "Opinion ('lovely') precedes Size ('small'), followed by Shape ('rectangular') and Purpose noun adjunct ('vegetable').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The village elders refused to ________ the unruly behavior of the aggressive youth group.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to tolerate':",
    options: [
      "put up with",
      "look down on",
      "run out of",
      "catch up with"
    ],
    answer: "put up with",
    hint: "'Put up with' means to endure or tolerate bad behavior without protesting.",
    solution: "'Put up with' is a three-part phrasal-prepositional verb meaning to tolerate or endure patiently.",
    target: "Phrasal-Prepositional Verbs: Put Up With"
  },
  {
    passage: "The queen received an ________ brooch from the visiting European diplomatic envoy.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "exquisite antique golden",
      "golden antique exquisite",
      "antique golden exquisite",
      "exquisite golden antique"
    ],
    answer: "exquisite antique golden",
    hint: "OSASCOMP: Opinion (exquisite) -> Age (antique) -> Material/Colour (golden).",
    solution: "Opinion ('exquisite') precedes Age ('antique'), which precedes Material ('golden').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The teacher noticed an extra desk in the hallway and asked two boys to ________ into the classroom.",
    question: "Choose the grammatically correct construction:",
    options: [
      "bring it in",
      "bring in it",
      "bring them in",
      "bring in them"
    ],
    answer: "bring it in",
    hint: "'Desk' is singular (pronoun 'it'), which must precede the particle 'in'.",
    solution: "The singular pronoun 'it' must be placed between 'bring' and 'in': 'bring it in'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The weaver crafted a ________ sun hat to protect farmers working under the blazing sun.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "sturdy broad round straw",
      "straw broad sturdy round",
      "round sturdy straw broad",
      "broad straw round sturdy"
    ],
    answer: "sturdy broad round straw",
    hint: "OSASCOMP: Opinion (sturdy) -> Size (broad) -> Shape (round) -> Material (straw).",
    solution: "Opinion ('sturdy') -> Size ('broad') -> Shape ('round') -> Material ('straw').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "After running for ten kilometers under the hot sun, the athlete ________ from physical exhaustion.",
    question: "Choose the correct intransitive phrasal verb meaning 'lost consciousness':",
    options: [
      "passed out",
      "passed away",
      "passed by",
      "passed on"
    ],
    answer: "passed out",
    hint: "'Pass out' means to faint or collapse; 'pass away' means to die.",
    solution: "'Pass out' is an intransitive phrasal verb meaning to faint or lose consciousness temporarily.",
    target: "Phrasal Verbs: Intransitive Verbs"
  },
  {
    passage: "The museum displayed a ________ war drum captured during the eighteenth century.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "formidable large cylindrical wooden",
      "wooden large formidable cylindrical",
      "cylindrical large wooden formidable",
      "large formidable cylindrical wooden"
    ],
    answer: "formidable large cylindrical wooden",
    hint: "OSASCOMP: Opinion (formidable) -> Size (large) -> Shape (cylindrical) -> Material (wooden).",
    solution: "Opinion ('formidable') precedes Size ('large'), followed by Shape ('cylindrical') and Material ('wooden').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Before submitting your examination script, make sure you carefully ________ to correct spelling errors.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "read it over",
      "read over it",
      "read out it",
      "read them over"
    ],
    answer: "read it over",
    hint: "'Script' is singular, so 'it' must be positioned between 'read' and 'over'.",
    solution: "The singular pronoun 'it' must sit between the verb and particle in 'read over': 'read it over'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The goldsmith shaped an ________ ring for the bride's wedding finger.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "elegant tiny circular diamond",
      "diamond tiny elegant circular",
      "circular elegant tiny diamond",
      "tiny circular diamond elegant"
    ],
    answer: "elegant tiny circular diamond",
    hint: "OSASCOMP: Opinion (elegant) -> Size (tiny) -> Shape (circular) -> Material (diamond).",
    solution: "Opinion ('elegant') -> Size ('tiny') -> Shape ('circular') -> Material ('diamond').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The municipal assembly resolved to ________ all unauthorized wooden kiosks along the main highway.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to abolish or remove':",
    options: [
      "do away with",
      "look down on",
      "run out of",
      "put up with"
    ],
    answer: "do away with",
    hint: "'Do away with' means to eliminate, abolish, or remove.",
    solution: "The three-part idiom 'do away with' means to abolish, eliminate, or discard completely.",
    target: "Phrasal-Prepositional Verbs: Do Away With"
  },
  {
    passage: "The chef cooked spicy goat soup in a ________ copper cauldron.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "heavy deep round",
      "copper round heavy deep",
      "deep copper heavy round",
      "round heavy deep copper"
    ],
    answer: "heavy deep round",
    hint: "OSASCOMP: Opinion/Weight (heavy) -> Size/Depth (deep) -> Shape (round).",
    solution: "Weight/Opinion ('heavy') precedes Depth/Size ('deep'), followed by Shape ('round') before the material 'copper'.",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The laboratory fire was spreading rapidly toward the chemicals, but the brave teacher quickly ________ using a fire extinguisher.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "put it out",
      "put out it",
      "put them out",
      "put out them"
    ],
    answer: "put it out",
    hint: "'Fire' is singular (pronoun 'it'), which must precede the particle 'out'.",
    solution: "The singular pronoun 'it' must be placed between 'put' and 'out': 'put it out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The hunter carried a ________ hunting rifle across his shoulder.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "valuable long modern German",
      "German modern long valuable",
      "long valuable German modern",
      "modern German long valuable"
    ],
    answer: "valuable long modern German",
    hint: "OSASCOMP: Opinion (valuable) -> Size (long) -> Age (modern) -> Origin (German).",
    solution: "Opinion ('valuable') -> Size ('long') -> Age ('modern') -> Origin ('German').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The village dispensary unfortunately ________ penicillin tablets during the severe epidemic.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'completely exhausted supply':",
    options: [
      "ran out of",
      "put up with",
      "looked down on",
      "gave up on"
    ],
    answer: "ran out of",
    hint: "When stocks or inventories become empty, you have...",
    solution: "'Run out of' means to deplete or completely exhaust one's supply of a resource.",
    target: "Phrasal-Prepositional Verbs: Run Out Of"
  },
  {
    passage: "The seamstress cut a ________ pattern from the paper roll.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "neat small triangular sewing",
      "sewing small neat triangular",
      "triangular neat small sewing",
      "small triangular neat sewing"
    ],
    answer: "neat small triangular sewing",
    hint: "OSASCOMP: Opinion (neat) -> Size (small) -> Shape (triangular) -> Purpose (sewing).",
    solution: "Opinion ('neat') precedes Size ('small'), followed by Shape ('triangular') and Purpose ('sewing').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Here is the form for your school identity card; please take your blue pen and ________ neatly.",
    question: "Choose the grammatically correct construction:",
    options: [
      "fill it in",
      "fill in it",
      "fill out them",
      "fill in them"
    ],
    answer: "fill it in",
    hint: "'Form' is singular (pronoun 'it'), which must sit between 'fill' and 'in'.",
    solution: "The singular pronoun 'it' must be positioned between the verb 'fill' and the particle 'in': 'fill it in'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 B8 Focus: OSASCOMP Adjective Hierarchy & Phrasal Verbs
// =========================================================================
const capstone5B8GrammarFoundationQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, how does the phrase 'an exquisite large antique circular brown Ghanaian mahogany dining table' illustrate the OSASCOMP cumulative adjective rule?",
    options: [
      "It follows exact OSASCOMP order: Opinion, Size, Age, Shape, Colour, Origin, Material, Purpose without commas",
      "It randomly arranges descriptive words to sound poetic",
      "It uses coordinate adjectives that should all be separated by commas",
      "It places material before size and purpose before origin"
    ],
    answer: "It follows exact OSASCOMP order: Opinion, Size, Age, Shape, Colour, Origin, Material, Purpose without commas",
    hint: "Check the order of adjectives modifying 'table': exquisite (Opinion), large (Size), antique (Age), circular (Shape), brown (Colour), Ghanaian (Origin), mahogany (Material), dining (Purpose).",
    solution: "The phrase represents a textbook application of the OSASCOMP formula: Opinion -> Size -> Age -> Shape -> Colour -> Origin -> Material -> Purpose without commas.",
    target: "Capstone Exam: OSASCOMP Hierarchical Stacking"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, why is the construction 'turned it off' used instead of 'turned off it' when referring to the electrical switch?",
    options: [
      "Because the Pronoun Movement Law mandates that when the object of a separable phrasal verb is a pronoun ('it'), the particle must follow the pronoun",
      "Because 'it' is an adverb that cannot touch the word 'turned'",
      "Because 'turned off' can never take any direct object in English",
      "Because the sentence is in the passive voice"
    ],
    answer: "Because the Pronoun Movement Law mandates that when the object of a separable phrasal verb is a pronoun ('it'), the particle must follow the pronoun",
    hint: "Recall the rule governing separable phrasal verbs when the object is a personal pronoun.",
    solution: "With separable transitive phrasal verbs ('turn off'), personal pronoun objects ('it') must precede the particle: 'turned it off'. 'Turned off it' violates standard grammar.",
    target: "Capstone Exam: The Pronoun Movement Law"
  },
  {
    questionNumber: 53,
    question: "In paragraph 3, what type of multi-word verb is 'broke down', and how does it function syntactically in the sentence?",
    options: [
      "It is an intransitive phrasal verb meaning ceased to function mechanically, taking no direct object",
      "It is a transitive separable verb taking the truck as its object",
      "It is a three-part phrasal-prepositional verb requiring two prepositions",
      "It is a linking verb followed by an adjective complement"
    ],
    answer: "It is an intransitive phrasal verb meaning ceased to function mechanically, taking no direct object",
    hint: "Does 'broke down' act directly on a noun object after the particle, or does it stand alone?",
    solution: "'Broke down' is an intransitive phrasal verb: it expresses the complete mechanical failure of the engine without requiring a direct object.",
    target: "Capstone Exam: Intransitive Phrasal Verbs"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, what is the meaning of the phrasal-prepositional verb 'look down on' in the sentence 'warning them never to look down on routine mechanical inspections'?",
    options: [
      "To despise, undervalue, or regard with contempt and dismissiveness",
      "To physically inspect an object from a higher platform",
      "To cancel an event due to bad weather",
      "To postpone an activity until tomorrow"
    ],
    answer: "To despise, undervalue, or regard with contempt and dismissiveness",
    hint: "Consider the idiomatic meaning of 'look down on' when applied to rules or advice.",
    solution: "The three-part idiom 'look down on' means to regard with disdain or undervalue something as unworthy of serious attention.",
    target: "Capstone Exam: Phrasal-Prepositional Verbs"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the grammatical rule governing cumulative adjectives in paragraph 1.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Cumulative adjectives follow OSASCOMP order without commas.",
      "Because adjectives are cumulative in English, they must always follow the OSASCOMP hierarchy without commas.",
      "Stacking cumulative adjectives in proper grammatical order before English nouns.",
      "Cumulative adjective order."
    ],
    answer: "Cumulative adjectives follow OSASCOMP order without commas.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Cumulative adjectives follow OSASCOMP order without commas' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and states the grammatical rule directly. Option C is a fragment (0 marks), and Option B has 15 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand3B8Foundation() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Strand 3 Grammar Foundation Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B8GrammarFoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_G_F_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B8",
      difficulty: "foundation",
      questionNumber: qNum,
      isCapstoneExamPassage: false,
      passageText: item.passage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.3.1.1: Demonstrate grammatical mastery of cumulative adjective ordering (OSASCOMP), transitive separable phrasal verbs, the Pronoun Movement Law, and multi-word verbal idioms."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8GrammarFoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b8GrammarFoundationCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_G_F_${item.questionNumber}`,
      level: "B8",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b8GrammarFoundationCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.3.1.1 / B8.3.1.2: Synthesize multi-paragraph contextual grammar, evaluating cumulative adjective stacking without commas, phrasal verb particle movement, and concise rule summaries."
    });
  });

  // 3. Write directly to Firestore subcollections across both topic IDs and all parent paths
  const topicIds = [
    "grammar_lexis_prepositions_and_phrasal_verbs",
    "parts_of_speech_phrasal_verbs_prepositions"
  ];
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B8_foundation)...");
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B8_foundation`);
      await subDocRef.set({
        level: "B8",
        difficulty: "foundation",
        title: "Basic 8 Foundation Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (OSASCOMP Hierarchy, Pronoun Movement Law, Phrasal Verbs) + 5 Capstone Full-Passage Questions",
          passageVisibility: "Passage embedded both in passageText and at the top of prompt",
          curriculum: "NaCCA Common Core Programme (CCP) Standard",
          strand: "Strand 3: Grammar & Usage",
          subStrand: "Sub-Strand 1: Parts of Speech, Phrasal Verbs & Prepositions",
          canonicalTopicPath: `${parent}/${topicId}`,
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
      console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
    }
  }

  // 4. Synchronize into main document practicePool.low for b8
  console.log("\nSynchronizing main document practicePool.low for b8...");
  const mappedLowQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'low' as const,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1
  }));

  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const mainRef = db.doc(`${parent}/${topicId}`);
      const snap = await mainRef.get();
      if (snap.exists) {
        const data = snap.data() || {};
        const existingLevels = data.levels || {};
        const b8Level = existingLevels.b8 || {};

        const updatedLevels: any = {
          ...existingLevels,
          b8: {
            ...b8Level,
            practicePool: {
              ...(b8Level.practicePool || {}),
              low: mappedLowQuestions
            }
          }
        };

        await mainRef.set({
          ...data,
          levels: updatedLevels,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log(`✅ Updated main document practicePool.low at: ${mainRef.path}`);
      }
    }
  }

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Strand 3 B8 Foundation Lab!`);
}

deployStrand3B8Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B8 Foundation Lab:", err);
    process.exit(1);
  });

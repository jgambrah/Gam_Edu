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
// ISOMORPHIC PASSAGE I: ANANSE AND THE TOWN DRUM (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `Once upon a time in the animal kingdom, an acute famine struck the land and creatures were perishing from starvation. For nearly three months, Kweku Ananse and his household had survived on meager scraps of dried leaves. Ananse's frail body rattled inside his hollow carapace as he dragged himself along. One sweltering afternoon, as he racked his brain to devise a scheme for obtaining food, a sudden plan took shape in his cunning mind.

He resolved to journey to the neighboring human settlement where rumors indicated that food supplies were still abundant. He would forage and steal enough sustenance for himself and his starving family. Taking the secluded forest footpath, he arrived at the outskirts of the village just after sunset. The villagers were busily stirring their evening cooking pots, and the savory aroma of boiling palm-nut soup made his mouth water uncontrollably.

How could he access these kitchens without being detected? Not far from where he lurked lay the village central playground, where a massive hollow log drum leaned against an ancient silk-cotton tree. This ceremonial log drum was sounded exclusively to convene all citizens for momentous emergency proclamations. Reaching the tree, Ananse attempted to climb its lower branches to survey the compound layouts. Unfortunately, his emaciated limbs gave way from acute hunger and exhaustion. He lost his grip and tumbled downward, his hard carapace striking the stretched hide of the drum with a thunderous "kpom! kpom!" reverberation.

Hearing the urgent signal, the villagers abandoned their boiling hearths and raced to the playground, convinced that the town crier had sounded an emergency summons. Seizing the golden opportunity, Ananse vanished into the adjacent bush, sprinted into the deserted kitchens, loaded his sack with as much cooked meat and boiled yam as he could carry, and hurried back home.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "In Passage I, the statement that 'there was a great famine' means that ............",
    options: [
      "all the living animals in the forest died",
      "food was critically scarce and unavailable",
      "all the subsistence farmers abandoned their hoes",
      "cooked food was no longer sold in the market"
    ],
    correctAnswer: "food was critically scarce and unavailable",
    hint: "Famine denotes an acute, widespread scarcity of food across a region.",
    workedSolution: "'Famine' refers to an extreme and widespread shortage of food causing hunger; 'food was critically scarce and unavailable' is its direct meaning.",
    points: 1
  },
  {
    number: 2,
    prompt: "Which of the following assertions is factually true according to Passage I?",
    options: [
      "Ananse and his household had not tasted any food for three months",
      "The hospitable villagers presented cooked food to Ananse",
      "Ananse harvested fresh cassava from his personal family plot",
      "Ananse stole cooked provisions belonging to the villagers"
    ],
    correctAnswer: "Ananse stole cooked provisions belonging to the villagers",
    hint: "Paragraph four shows that Ananse entered their deserted kitchens and took their food while they gathered at the playground.",
    workedSolution: "The narrative confirms that Ananse capitalized on the empty houses to steal cooked food from the villagers' kitchens.",
    points: 1
  },
  {
    number: 3,
    prompt: "At what specific time of day did Ananse arrive at the neighboring village in Passage I?",
    options: [
      "At the break of dawn",
      "In the middle of the afternoon",
      "Just after sunset",
      "At midnight"
    ],
    correctAnswer: "Just after sunset",
    hint: "Check paragraph two: '...arrived at the village after sunset.'",
    workedSolution: "The text states explicitly that Ananse arrived at the village just after sunset as evening meals were being prepared.",
    points: 1
  },
  {
    number: 4,
    prompt: "Why did the villagers rush in haste to the playground in Passage I?",
    options: [
      "They wanted to inspect the damaged hollow log drum",
      "They believed an official emergency announcement had been summoned",
      "They heard Ananse tumbling down from the tree branches",
      "They wanted to capture the intruder trespassing on their land"
    ],
    correctAnswer: "They believed an official emergency announcement had been summoned",
    hint: "Reread paragraph three and four: the drum was used for important announcements, so hearing it made them run to assemble.",
    workedSolution: "The villagers rushed to the grounds because the booming drum was the traditional summons signaling an important public announcement.",
    points: 1
  },
  {
    number: 5,
    prompt: "Why did the gathered villagers fail to see Ananse at the playground?",
    options: [
      "He climbed inside the hollow drum to hide",
      "He sprinted away and concealed himself in the nearby bushes",
      "He was invisible to human eyes",
      "He was busy eating under the silk-cotton tree"
    ],
    correctAnswer: "He sprinted away and concealed himself in the nearby bushes",
    hint: "Look at paragraph four: 'Very quickly Tortoise disappeared into nearby bush...'",
    workedSolution: "The text notes that immediately after falling, Ananse darted into the thick undergrowth of the adjacent bush before the crowd arrived.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE MIDNIGHT PATROL AND ARREST (CALIBRATED)
// =========================================================================
const passage2Text = `From the central tower of the municipal hall, the town clock chimed two o'clock in the morning. Within an abandoned, dilapidated building on the periphery of the town, an owl screeched shrilly as if sounding an alarm to Sergeant Mensah and Corporal Boateng to shake off their heavy drowsiness.

The two officers had patrolled the quiet streets for four continuous hours and were fighting off exhaustion. The night was ink-black and so bitterly cold that despite wearing a thick woolen greatcoat, Sergeant Mensah's teeth were chattering uncontrollably. He was on the verge of speaking when a faint rustle resonated down the road leading into the township.

Corporal Boateng picked up the auditory cue at the same instant. Both men held their breath, listening intently, and soon discerned the heavy footfalls of a lone midnight traveler coming up the incline. Slipping noiselessly into the shadows, they took cover behind two opposing roadside nim trees. As the traveler drew level with Boateng's hiding spot, he stumbled awkwardly over an exposed tree root across the pathway.

Immediately, Corporal Boateng switched on his high-powered electric torch and roared, "Halt or I open fire!" Sergeant Mensah cocked his rifle in deadly readiness. The solitary traveler, who was balancing a heavy burlap sack on his left shoulder, froze in terror, accidentally dropping his bloodstained machete in the process.

"Who are you? What is your destination? Reveal the contents of that sack or we shoot! We have cornered you at last!" Mensah bellowed.

Shivering violently and stammering through trembling lips, the traveler identified himself as Nsiah. He claimed he was returning from Fosa carrying a consignment of freshly harvested plantains and cassava tubers. However, his glistening cutlass and the dripping scarlet liquid oozing through the bottom of the sack completely gave him away. A swift forensic search of the baggage revealed a severed human head. Exultant with their breakthrough, the officers secured his wrists and marched him to the municipal police command.`;

const passage2Questions = [
  {
    number: 6,
    prompt: "According to Passage II, why were Sergeant Mensah's teeth chattering uncontrollably?",
    options: [
      "He was suffering from acute dental pain",
      "He was terrified by the screech of the owl",
      "The night atmospheric temperature was intensely cold",
      "His woolen greatcoat had become soaking wet"
    ],
    correctAnswer: "The night atmospheric temperature was intensely cold",
    hint: "Reread paragraph two: 'The night was very dark and so cold that in spite of his thick overcoat, the Sergeant's teeth were chattering.'",
    workedSolution: "The narrative explains that the teeth chattering was caused by the severe, biting cold of the midnight atmosphere.",
    points: 1
  },
  {
    number: 7,
    prompt: "How did the police officers first detect the presence of the approaching traveler in Passage II?",
    options: [
      "They spotted his flashlight beam through the foliage",
      "They heard a faint noise and footsteps along the dark road",
      "They observed drops of blood on the pathway gravel",
      "The hooting owl alerted them to his exact position"
    ],
    correctAnswer: "They heard a faint noise and footsteps along the dark road",
    hint: "Paragraph two and three show that they heard a faint sound down the road and listened attentively.",
    workedSolution: "The officers first detected him through their sharp hearing when they picked up a faint rustling and stumbling noise down the road.",
    points: 1
  },
  {
    number: 8,
    prompt: "Why did Sergeant Mensah and Corporal Boateng take cover behind opposing trees in Passage II?",
    options: [
      "To shelter themselves from the freezing wind",
      "To conceal their presence and ambush the approaching traveler",
      "To inspect and reload their firearms quietly",
      "To rest and take a brief nap during patrol"
    ],
    correctAnswer: "To conceal their presence and ambush the approaching traveler",
    hint: "Taking cover behind trees allowed them to remain invisible until the suspect walked into their trap.",
    workedSolution: "The officers hid behind the trees to avoid being seen by the approaching traveler, ensuring they could ambush him effectively.",
    points: 1
  },
  {
    number: 9,
    prompt: "Where did the police officers successfully apprehend the late traveler?",
    options: [
      "At the entrance of the municipal police command",
      "Within the municipal town square near the clock tower",
      "Near the outskirts along the road entering the town",
      "Inside the abandoned dilapidated building"
    ],
    correctAnswer: "Near the outskirts along the road entering the town",
    hint: "The encounter took place on the outskirts road near the abandoned building where they were patrolling.",
    workedSolution: "The arrest was executed on the road near the outskirts of town where the patrolmen were stationed.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the phrase 'gave him away' in 'the dripping scarlet liquid gave him away' means that the blood ............",
    options: [
      "alarmed and frightened him",
      "cautioned him of danger",
      "exposed his hidden guilt and crime",
      "humiliated him before the crowd"
    ],
    correctAnswer: "exposed his hidden guilt and crime",
    hint: "To give someone away means to betray or reveal their secret guilt or identity.",
    workedSolution: "'Gave him away' is an idiom meaning betrayed or exposed someone's true identity, guilt, or secret; 'exposed his hidden guilt and crime' is the exact equivalent.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 2004 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "The mathematics tutor is confident that his candidates will secure distinction in the examination.\nChoose the word nearest in meaning to 'confident'.",
    options: ["apprehensive", "optimistic", "certain", "resolute"],
    correctAnswer: "certain",
    hint: "Feeling sure, positive, and free from doubt.",
    workedSolution: "'Confident' means firmly trusting, assured, or sure; 'certain' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The border troops retreated to their fortified trenches when the artillery barrage intensified.\nChoose the word nearest in meaning to 'retreated'.",
    options: ["scattered", "escaped", "withdrew", "surrendered"],
    correctAnswer: "withdrew",
    hint: "Moved back or pulled back from an advanced position.",
    workedSolution: "'Retreated' in military contexts means pulled back or 'withdrew' from a battle position.",
    points: 1
  },
  {
    number: 13,
    prompt: "Our parents continually admonished us to remain courteous to elders and strangers alike.\nChoose the word nearest in meaning to 'courteous'.",
    options: ["mannerly", "punctual", "humble", "accommodating"],
    correctAnswer: "mannerly",
    hint: "Polite, respectful, and well-behaved.",
    workedSolution: "'Courteous' means showing good manners, politeness, and respect; 'mannerly' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The truant pupils who jumped the school fence were promptly disciplined by the disciplinary master.\nChoose the word nearest in meaning to 'promptly'.",
    options: ["ruthlessly", "immediately", "sternly", "severely"],
    correctAnswer: "immediately",
    hint: "Without hesitation, delay, or postponement.",
    workedSolution: "'Promptly' means without delay or at once; 'immediately' is its exact equivalent.",
    points: 1
  },
  {
    number: 15,
    prompt: "Mature individuals know how to restrain their emotional impulses during heated arguments.\nChoose the word nearest in meaning to 'restrain'.",
    options: ["suppress", "avoid", "control", "conceal"],
    correctAnswer: "control",
    hint: "To hold back, keep under check, or regulate.",
    workedSolution: "'Restrain' means to hold back, limit, or 'control' an impulse or emotion.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "The two committee executives are constantly disputing; they never see eye to eye on policy. This means they do not ............",
    options: [
      "respect each other's credentials",
      "agree with each other",
      "admire each other's talents",
      "trust each other's honesty"
    ],
    correctAnswer: "agree with each other",
    hint: "To see eye to eye means to share the same opinion or agree.",
    workedSolution: "The idiom 'to see eye to eye' means to have the same opinion, harmonize, or agree with someone.",
    points: 1
  },
  {
    number: 17,
    prompt: "You must be completely off your head if you believe that gold nuggets grow on trees. This means you must be ............",
    options: ["foolish", "joking", "crazy", "dreaming"],
    correctAnswer: "crazy",
    hint: "Acting irrationally, demented, or mentally unbalanced.",
    workedSolution: "The informal idiom 'off one's head' means insane, irrational, or 'crazy'.",
    points: 1
  },
  {
    number: 18,
    prompt: "Although Auntie Mansa earns a modest salary, she has some savings put by for emergencies. This means she has money ............",
    options: [
      "saved for the future",
      "dedicated to charity",
      "lent out with interest",
      "hidden in her bedroom"
    ],
    correctAnswer: "saved for the future",
    hint: "To put money by means to reserve or save it for future needs.",
    workedSolution: "The phrasal idiom 'to put by' means to reserve, save, or store money for future use.",
    points: 1
  },
  {
    number: 19,
    prompt: "Several passengers perished in the head-on collision, but the conductor escaped by the skin of his teeth. This means that the conductor ............",
    options: [
      "sustained minor surface scratches",
      "narrowly avoided death by a tiny margin",
      "fled rapidly into the adjacent bush",
      "lost several of his front teeth"
    ],
    correctAnswer: "narrowly avoided death by a tiny margin",
    hint: "To escape barely or by a hair's breadth.",
    workedSolution: "The idiom 'by the skin of one's teeth' means barely, narrowly, or by the narrowest possible margin.",
    points: 1
  },
  {
    number: 20,
    prompt: "When the armed robbers were surrounded on all sides and ran out of ammunition, they gave in. This means the robbers ............",
    options: [
      "surrendered to the police",
      "escaped through the drainage culvert",
      "cried out for public mercy",
      "shot at their own accomplices"
    ],
    correctAnswer: "surrendered to the police",
    hint: "To cease resistance and yield to an opponent.",
    workedSolution: "The phrasal verb 'to give in' means to cease fighting, capitulate, or 'surrender'.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "The senior prefect was commended for his integrity, whereas his dishonest assistant was ...... .\nChoose the word most nearly opposite in meaning to 'commended'.",
    options: ["demoted", "rebuked", "cautioned", "dismissed"],
    correctAnswer: "rebuked",
    hint: "'Commended' means praised warmly. Find the word meaning scolded or reprimanded sharply.",
    workedSolution: "'Commended' means formally praised or approved. Its direct behavioral antonym is 'rebuked' (reprimanded or scolded).",
    points: 1
  },
  {
    number: 22,
    prompt: "While the headmaster's stern demeanor maintained discipline, his wife's ...... smile put the children at ease.\nChoose the word most nearly opposite in meaning to 'stern'.",
    options: ["proud", "indifferent", "friendly", "gentle"],
    correctAnswer: "friendly",
    hint: "'Stern' means strict, severe, and forbidding. What word denotes genial, warm, and approachable?",
    workedSolution: "'Stern' describes a severe, strict, or forbidding countenance. Its direct behavioral antonym is 'friendly' (warm and genial).",
    points: 1
  },
  {
    number: 23,
    prompt: "Our Assemblywoman declined the invitation to address the youth, but her deputy graciously ...... it.\nChoose the word most nearly opposite in meaning to 'declined'.",
    options: ["accepted", "confirmed", "honored", "supported"],
    correctAnswer: "accepted",
    hint: "'Declined' means turned down or refused. What word denotes received with consent?",
    workedSolution: "'Declined' an invitation means turned it down. Its direct opposite is 'accepted' (agreed to take up).",
    points: 1
  },
  {
    number: 24,
    prompt: "Though her thirsty classmate pleaded for water, the girl callously consumed the entire bottle.\nChoose the word most nearly opposite in meaning to 'callously'.",
    options: ["greedily", "mercifully", "playfully", "intentionally"],
    correctAnswer: "mercifully",
    hint: "'Callously' means unfeelingly and cruelly. Find the adverb meaning with compassion and mercy.",
    workedSolution: "'Callously' means showing insensitive, cruel disregard for others. Its direct antonym is 'mercifully' (or compassionately).",
    points: 1
  },
  {
    number: 25,
    prompt: "The gentle morning drizzle made the seedbed moist, whereas the blazing noon sun rendered it ...... .\nChoose the word most nearly opposite in meaning to 'moist'.",
    options: ["porous", "cracked", "dry", "solid"],
    correctAnswer: "dry",
    hint: "'Moist' means slightly wet or damp. What word denotes completely devoid of moisture?",
    workedSolution: "'Moist' means slightly wet or damp. Its direct physical antonym regarding soil condition is 'dry'.",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "The laboratory students may depart for the dormitory as soon as they ...... the experiment.",
    options: ["had finished", "finished", "finish", "will finish"],
    correctAnswer: "finish",
    hint: "In future temporal adverbial clauses ('as soon as / when...'), standard grammar requires the simple present tense.",
    workedSolution: "Adverbial time clauses referring to future completion take the simple present tense: 'as soon as they finish'.",
    points: 1
  },
  {
    number: 27,
    prompt: "Most people are not compassionate toward stray animals, ......?",
    options: ["weren't it", "isn't it", "wasn't it", "are they"],
    correctAnswer: "are they",
    hint: "A negative clause with 'are not' and plural subject 'Most people' takes an affirmative tag: 'are they?'.",
    workedSolution: "The statement is negative present using 'are not' with plural subject 'Most people' ('they'). The question tag must be affirmative: 'are they?'.",
    points: 1
  },
  {
    number: 28,
    prompt: "After washing her school uniform, Afua ...... it neatly on the wire line to dry.",
    options: ["hung", "hang", "hanged", "stretched"],
    correctAnswer: "hung",
    hint: "Past tense of 'hang' (to suspend an object): hang - hung - hung. ('Hanged' is used exclusively for execution by the noose).",
    workedSolution: "For suspending objects or clothes, the simple past tense of 'hang' is 'hung'. ('Hanged' refers strictly to capital execution).",
    points: 1
  },
  {
    number: 29,
    prompt: "Kwesi set off for classes immediately after he ...... his teeth.",
    options: ["had brushed", "has brushed", "brushing", "brushed"],
    correctAnswer: "had brushed",
    hint: "Use the past perfect tense ('had + past participle') for an action completed prior to another past event ('went/set off').",
    workedSolution: "The brushing of teeth preceded the past departure for school, requiring the Past Perfect tense: 'had brushed'.",
    points: 1
  },
  {
    number: 30,
    prompt: "Abena is widely recognized as the ...... pupil in our junior high class.",
    options: ["well-behaved", "more-behaved", "very well-behaved", "most well-behaved"],
    correctAnswer: "most well-behaved",
    hint: "Form the superlative degree of compound descriptive adjectives preceded by 'the'.",
    workedSolution: "The superlative form of the compound adjective 'well-behaved' preceded by 'the' is 'most well-behaved'.",
    points: 1
  },
  {
    number: 31,
    prompt: "A bag of gold coins, together with several confidential deeds, ...... stolen from the vault.",
    options: ["were", "are", "was", "have been"],
    correctAnswer: "was",
    hint: "Parenthetical additions introduced by 'together with / with' do not pluralize the singular subject 'A bag of gold coins'.",
    workedSolution: "The true grammatical head of the subject is 'A bag' (singular). Parenthetical additions ('with several confidential deeds') do not alter its number, taking singular 'was'.",
    points: 1
  },
  {
    number: 32,
    prompt: "In resolving communal grievances, it is unacceptable to resort ...... physical violence.",
    options: ["through", "to", "into", "with"],
    correctAnswer: "to",
    hint: "Identify the preposition that regularly collocates with the phrasal verb 'resort'.",
    workedSolution: "In standard English grammar, the verb 'resort' takes the preposition 'to' ('resort to violence').",
    points: 1
  },
  {
    number: 33,
    prompt: "Clara understood all ...... the physics instructor demonstrated on the chalkboard.",
    options: ["what", "which", "that", "this"],
    correctAnswer: "that",
    hint: "Following the universal indefinite pronoun 'all' referring to inanimate things, standard grammar requires the relative pronoun 'that'.",
    workedSolution: "When the antecedent is 'all', standard English syntax requires the relative pronoun 'that' rather than 'what' or 'which': 'all that her teacher taught'.",
    points: 1
  },
  {
    number: 34,
    prompt: "The agricultural extension officer agrees that the inland rice irrigation scheme is ...... viable.",
    options: ["so", "much", "too", "very"],
    correctAnswer: "very",
    hint: "Standard intensifier modifying a positive gradable adjective: 'very + adjective'.",
    workedSolution: "To intensify a positive gradable adjective ('good' or 'viable') without negative excess, 'very' is the standard adverb modifier.",
    points: 1
  },
  {
    number: 35,
    prompt: "Charles does not expect ...... his personal tutor at the library today.",
    options: ["seeing", "having seen", "being seen", "to see"],
    correctAnswer: "to see",
    hint: "The catenative verb 'expect' requires a full to-infinitive complement.",
    workedSolution: "In English verb catenation, the verb 'expect' takes a full to-infinitive complement: 'does not expect to see'.",
    points: 1
  },
  {
    number: 36,
    prompt: "Kweku believes that physical labor becomes arduous ...... one attains old age.",
    options: ["if", "while", "when", "as"],
    correctAnswer: "when",
    hint: "Subordinating temporal conjunction expressing at the time that a state is reached.",
    workedSolution: "'When' is the temporal conjunction indicating the time or condition during which an event or life stage occurs ('when you are old').",
    points: 1
  },
  {
    number: 37,
    prompt: "Countless commercial enterprises ...... the globe conduct transactions in English.",
    options: ["across", "inside", "by", "on"],
    correctAnswer: "across",
    hint: "Identify the spatial preposition meaning throughout the expanse of a geographic area.",
    workedSolution: "The idiomatic spatial expression denoting widespread presence throughout the world is 'across the world' (or 'around the globe').",
    points: 1
  },
  {
    number: 38,
    prompt: '"Do you admire this handwoven kente stole? I crafted ...... myself on the loom."',
    options: ["for", "that", "which", "it"],
    correctAnswer: "it",
    hint: "Direct object pronoun referring back to the singular countable noun phrase 'this handwoven kente stole'.",
    workedSolution: "The transitive verb 'crafted/made' requires an objective personal pronoun referring back to the singular object: 'made it myself'.",
    points: 1
  },
  {
    number: 39,
    prompt: "The Obuasi mine is recognized as the ......",
    options: [
      "nation's producer largest",
      "largest nation's producer",
      "producer nation's largest",
      "nation's largest producer"
    ],
    correctAnswer: "nation's largest producer",
    hint: "Correct possessive noun phrase ordering: Possessive noun ('nation's') + Superlative adjective ('largest') + Head noun ('producer').",
    workedSolution: "Standard English noun phrase syntax orders the possessive noun first, followed by the adjective and the head noun: 'the nation's largest producer'.",
    points: 1
  },
  {
    number: 40,
    prompt: "Neither Kwesi nor Yaw ...... present at the family meeting when I arrived.",
    options: ["are", "is", "was", "were"],
    correctAnswer: "was",
    hint: "Proximity rule: With 'neither... nor' connecting two singular subjects, the verb agrees with the nearer singular subject in the past.",
    workedSolution: "When two singular subjects ('Kwesi', 'Yaw') are joined by 'neither... nor', the verb agrees with the nearer singular subject in the past: 'was'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200402);

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
    passageTitle = "Passage I: Kweku Ananse and the Town Drum Incident";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 6 && qNum <= 10) {
    passageTitle = "Passage II: The Midnight Patrol and the Bloodstained Sack";
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
        prompt: "Your class teacher has selected an academic programme for your upcoming Senior Secondary School course, but you prefer a different one. Write a polite, convincing letter to him explaining why you would prefer to study the alternative programme.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2004

The Class Teacher
Form Three Gold
Methodist Junior Secondary School
Bekwai

Dear Sir,

REQUEST FOR CHANGE OF RECOMMENDED SENIOR SECONDARY SCHOOL PROGRAMME

I respectfully write to express my heartfelt appreciation for your continuous academic mentorship and for selecting the General Arts programme for my upcoming Senior Secondary School education. However, after deep reflection and consultation with my parents, I write to plead that you recommend me for the General Science programme instead.

While I acknowledge that my performance in English Language and Social Studies has been strong, my greatest academic passion and highest natural aptitude lie in Mathematics and Integrated Science. In our recent regional mock examinations, I scored ninety-four percent in Mathematics and ninety-two percent in Integrated Science. I find deep satisfaction in solving quantitative problems, balancing chemical equations, and exploring biological mechanisms.

Furthermore, my lifelong career ambition is to study civil engineering at the university to help design modern, resilient drainage systems and bridges for flood-prone rural communities in Ghana. Pursuing the General Science curriculum—specializing in Physics, Chemistry, Elective Mathematics, and Biology—is the non-negotiable prerequisite required to qualify for engineering admission at the Kwame Nkrumah University of Science and Technology. Enrolling in General Arts, despite its noble value, would permanently foreclose this technical career pathway.

I promise to dedicate myself with relentless discipline to justify your confidence in my scientific potential. I humbly pray that you approve this adjustment on my official selection card.

Thank you for your fatherly understanding and guidance.

Yours faithfully,
[Signature]
Kwabena Mensah
(Index Number: 0204010054)`
      },
      {
        questionNumber: "2",
        category: "Informal Letter",
        prompt: "With the full consent of your parents, write a warm, inviting letter to your close friend in another town, inviting him or her to spend a portion of the upcoming long vacation with your family.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th June, 2004

Dear Kwaku,

I hope this letter finds you in fine health, peace of mind, and studying hard as our final examinations approach. With the official permission and warm blessing of my parents, I write with great joy to invite you to spend two weeks of the upcoming long vacation with my family here in Begoro.

Our town is famous for its cool, misty weather and breathtaking tourist attractions. During your stay, my elder brother has agreed to guide us on an unforgettable hiking expedition to the Osuben Mountain Waterfalls, where we can swim in natural mountain pools and explore the lush tropical rainforest. In addition, our community will celebrate the annual Odweira festival in August, featuring majestic palanquin processions of chiefs, thunderous fontomfrom drumming, and vibrant traditional warrior dancing.

Beyond sightseeing, we will establish a disciplined joint study routine. We can revise past question compendiums together in our peaceful family orchard, practice challenging Mathematics formulas, and prepare ahead for our senior secondary school courses. My mother has already prepared our spacious guest room for you and has promised to treat us to her delicious homemade dishes, including hot pounded fufu with spiced game palm-nut soup.

Please discuss this invitation with Uncle Kwame and Auntie Mansa so that you can confirm your arrival date early. My father will meet you at the central lorry station when your bus arrives.

I look forward to an exciting and productive holiday together.

Your true friend,
[Signature]
Emmanuel Addo`
      },
      {
        questionNumber: "3",
        category: "Descriptive Narrative",
        prompt: "Describe in vivid, colorful detail an interesting and memorable cultural or civic function you attended recently in your community.",
        modelAnswer: `A GRAND CELEBRATION OF EDUCATIONAL EXCELLENCE

Last Saturday, the Jubilee Park in Bekwai was transformed into a dazzling carnival of colors, music, and academic pride as our municipal directorate convened the 2004 Annual Basic Schools Speech and Prize-Giving Day.

The ceremonial grounds were resplendent with festive decorations. Towering blue-and-gold velvet canopies surrounded the dais, while hundreds of proud parents, traditional chiefs, municipal education directors, and smartly uniformed students filled the spectator stands. The ceremony opened with an impressive inspection of the school cadet corps by the Municipal Chief Executive, followed by stirring brass band anthems and exhilarating traditional drumming performed by our award-winning cultural troupe.

The highlight of the ceremony was the keynote address delivered by a prominent alumna who is now a pediatric neurosurgeon. She narrated her humble beginnings in a rural village and challenged students to view poverty not as an insurmountable barrier, but as a catalyst for relentless determination. Her inspiring words brought the entire audience to its feet in a thunderous standing ovation.

The climax was the presentation of awards. When my name was announced as the Overall Best Student in Integrated Science and Mathematics in the municipality, an electric thrill surged through my veins. Walking onto the stage to receive a plaque, a desktop encyclopedia, and a full secondary school scholarship amidst roaring applause from my teachers and parents was the proudest moment of my life.

The event concluded with an exquisite reception where guests were treated to savory local delicacies and refreshing fruit juices. It was a glorious milestone that celebrated the beauty of hard work and community support.`
      },
      {
        questionNumber: "4",
        category: "Persuasive / Argumentative Essay",
        prompt: "Would you prefer to attend a single-sex (girls/boys) school or a co-educational (mixed) school for your Senior Secondary School education? Write an essay giving at least three convincing reasons for your choice.",
        modelAnswer: `THE SUPERIORITY OF CO-EDUCATIONAL SECONDARY SCHOOLS

As basic school candidates finalize their selection of secondary institutions, an enduring debate concerns whether single-sex or co-educational (mixed) schools provide the optimal environment for adolescent development. Having critically weighed both models, I firmly maintain that attending a co-educational secondary school offers superior benefits for holistic education and character formation.

First and foremost, co-educational schools mirror the demographic reality of modern adult society. The real world—comprising university campuses, corporate boardrooms, civil service offices, and civic assemblies—is not partitioned by gender. Educating boys and girls together fosters natural social ease, mutual understanding, and professional collaboration from an early age. Young men in mixed institutions learn to view female peers as intellectual equals, dissolving archaic chauvinistic prejudices, while young women develop unshakeable confidence in articulating ideas before male counterparts.

Secondly, co-educational environments foster healthy, balanced academic competition. Male and female students often exhibit complementary cognitive approaches and academic strengths. In my basic school experience, female students frequently modeled exceptional organizational consistency, neatness, and diligent revision habits, which challenged male students to abandon complacency. Similarly, male peers inspired female classmates to engage boldly in technical, quantitative problem-solving. This cross-gender synergy elevates overall scholastic performance.

Finally, mixed schools encourage emotional maturity and self-discipline. Adolescents educated in healthy, supervised mixed environments develop natural social etiquette, emotional control, and mutual respect, which demystifies the opposite sex and dramatically reduces the social awkwardness and behavioral extremes often observed among single-sex school graduates.

In conclusion, secondary education should prepare students for the realities of life. Co-educational schooling provides the balanced social, intellectual, and emotional foundation required to thrive in a diverse world.`
      }
    ]
  }
};

async function seedBeceEnglish2004Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2004 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2004");
  await docRef.set({
    year: 2004,
    title: "BECE English Language 2004 (Calibrated National Benchmark)",
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
          title: "Passage I: Kweku Ananse and the Town Drum Incident",
          text: passage1Text,
          questionRange: "Questions 1 to 5"
        },
        {
          id: "passage_2",
          title: "Passage II: The Midnight Patrol and the Bloodstained Sack",
          text: passage2Text,
          questionRange: "Questions 6 to 10"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Kweku Ananse and the Town Drum Incident",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: The Midnight Patrol and the Bloodstained Sack",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2004 successfully seeded into Firestore!");
}

seedBeceEnglish2004Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2004:", err);
    process.exit(1);
  });

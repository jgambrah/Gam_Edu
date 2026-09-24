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
// =========================================================================
const marinePlasticsFullPassage = 
`Along the Gulf of Guinea coastline, the relentless accumulation of non-biodegradable synthetic plastics has escalated into an acute environmental and economic crisis. Millions of single-use polythene carrier bags, polystyrene food packs, and discarded beverage bottles are washed into coastal lagoons and ocean surf through choked urban storm drains. Because standard commercial polymers take centuries to decompose under natural marine conditions, ocean currents disperse this buoyant refuse across critical artisanal fishing zones.

The consequences for coastal marine biodiversity are immediate and catastrophic. Pelagic marine fauna, particularly endangered olive ridley sea turtles, frequently mistake floating translucent plastic bags for jellyfish, their preferred dietary staple. Ingested plastics block gastrointestinal tracts, causing fatal intestinal impaction and eventual starvation. Concurrently, abandoned monofilament fishing gear, popularly designated by marine biologists as 'ghost nets,' drifts indefinitely through coastal shallows, indiscriminately entangling dolphins, juvenile sharks, and benthic sea turtles.

Furthermore, mechanical wave action and ultraviolet solar radiation gradually break macro-plastics down into microscopic fragments measuring less than five millimeters in diameter. These ubiquitous microplastics absorb toxic organic pollutants from surrounding seawater. When filter-feeding organisms, such as oysters, mussels, and juvenile sardinella, ingest these toxic particles, foreign heavy compounds enter the marine food web. Consequently, human populations in coastal communities inadvertently consume concentrated chemical toxins when eating fresh marine seafood.

To reverse this marine devastation, coastal municipal assemblies must institute a multi-pronged mitigation strategy. Authorities must establish community-managed recycling buy-back centers, ban non-essential single-use packaging, and construct engineered silt-and-trash booms across storm drainage canals discharging into coastal lagoons.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B8FoundationDrills = [
  {
    passage: "The agronomist carefully surveyed the **arable** land—soil that is fertile and suitable for growing crops—before deciding to cultivate high-yield hybrid maize.",
    question: "Using the definition clue provided in the sentence, what is the meaning of the word 'arable'?",
    options: [
      "Rocky, steep, and completely dry",
      "Fertile and suitable for growing crops",
      "Flooded with industrial salt water",
      "Reserved exclusively for wildlife sanctuaries"
    ],
    answer: "Fertile and suitable for growing crops",
    hint: "The word is defined directly between the dashes in the text.",
    solution: "The parenthetical definition dash ('—soil that is fertile and suitable for growing crops—') explicitly defines 'arable'.",
    target: "Context Clue: Definition"
  },
  {
    passage: "While her elder brother was notoriously **garrulous**, talking incessantly about irrelevant matters, Akua remained completely taciturn throughout dinner.",
    question: "Using the contrast clue in the excerpt, what does the word 'garrulous' mean?",
    options: [
      "Extremely silent and thoughtful",
      "Excessively talkative about trivial matters",
      "Generous with money and gifts",
      "Afraid of darkness and strangers"
    ],
    answer: "Excessively talkative about trivial matters",
    hint: "Contrast the brother's behavior ('talking incessantly') with Akua's silence.",
    solution: "The phrase 'talking incessantly about irrelevant matters' contrasts directly with Akua's silence, identifying 'garrulous' as excessively talkative.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the community stream was poisoned with toxic mercury runoff from illegal alluvial mining, the water was rendered completely **unpotable**.",
    question: "Using the cause-and-effect clue in the passage, what does 'unpotable' mean?",
    options: [
      "Safe and refreshing to drink",
      "Unfit or unsafe for drinking",
      "Ideal for swimming and sports",
      "Extremely cold and sweet"
    ],
    answer: "Unfit or unsafe for drinking",
    hint: "What happens to drinking water when poisoned with toxic mercury?",
    solution: "The causal prefix 'Because the stream was poisoned...' indicates that the water became dangerous and unfit for human consumption.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The coastal district suffered from various severe **calamities**, including flash floods, locust invasions, and prolonged dry season droughts.",
    question: "Based on the exemplification clue ('including...'), what is the meaning of 'calamities'?",
    options: [
      "Disastrous events or great misfortunes",
      "Festivals of joy and thanksgiving",
      "Technological breakthroughs in farming",
      "Educational scholarships for youth"
    ],
    answer: "Disastrous events or great misfortunes",
    hint: "Examine the shared category of flash floods, locust swarms, and droughts.",
    solution: "The examples provided (floods, locust swarms, droughts) represent natural catastrophes, defining 'calamities' as severe disasters.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The young apprentice was exceptionally **meticulous**; he measured every joint with precision, verified his angles twice, and cleaned his instruments thoroughly.",
    question: "What is the contextual meaning of 'meticulous' as demonstrated by the apprentice's actions?",
    options: [
      "Careless, hurried, and clumsy",
      "Showing extreme care, thoroughness, and attention to detail",
      "Lazy and avoiding physical exertion",
      "Proud and unwilling to take advice"
    ],
    answer: "Showing extreme care, thoroughness, and attention to detail",
    hint: "Look at the evidence: measuring with precision, verifying angles twice, and cleaning tools thoroughly.",
    solution: "The apprentice's thoroughness and double-checking illustrate that 'meticulous' means showing painstaking care and attention to detail.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "Unlike synthetic fabrics that retain heat, cotton garments are **breathable**; that is, they permit air to circulate freely through the weave to keep the wearer cool.",
    question: "According to the definition clue in the sentence, what does 'breathable' mean?",
    options: [
      "Waterproof and air-tight",
      "Permitting air to circulate freely through the fabric weave",
      "Heavy and heavily insulated",
      "Easily torn when washed"
    ],
    answer: "Permitting air to circulate freely through the fabric weave",
    hint: "Read the definition introduced by the signal phrase 'that is'.",
    solution: "The restatement signal 'that is' directly defines breathable as permitting air to circulate freely through the weave.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "While Kwame was thoroughly **reckless** with his earnings, spending every cedi on lavish entertainment, his sister was remarkably frugal, saving half her wages weekly.",
    question: "Using the contrast marker 'While', what is the meaning of 'frugal'?",
    options: [
      "Careful and economical in the use of money",
      "Extravagant and wasteful with money",
      "Greedy and unwilling to eat food",
      "Indifferent to business profits"
    ],
    answer: "Careful and economical in the use of money",
    hint: "Contrast Kwame's reckless spending with his sister saving half her wages.",
    solution: "Saving half her wages weekly contrasts with reckless spending, demonstrating that 'frugal' means economical and careful with money.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the old timber bridge was **dilapidated** after years of termite damage and weathering, the district engineer declared it unsafe for vehicular traffic.",
    question: "What does 'dilapidated' mean as indicated by the cause-and-effect relationship?",
    options: [
      "Newly painted and modern",
      "In a state of severe disrepair and decay",
      "Extremely wide and strong",
      "Constructed entirely of steel"
    ],
    answer: "In a state of severe disrepair and decay",
    hint: "Connect termite damage, weathering, and being declared unsafe for traffic.",
    solution: "Termite damage and weathering that render a bridge unsafe identify 'dilapidated' as being in a state of ruinous decay.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The farmer planted several **drought-tolerant** crops, such as millet, sorghum, and cowpeas, which thrive even when seasonal rains fail completely.",
    question: "Based on the examples provided ('such as...'), what does 'drought-tolerant' mean?",
    options: [
      "Requiring daily irrigation floods",
      "Able to survive and yield harvests with minimal water or rainfall",
      "Growing only during cold winter snow",
      "Poisonous to livestock animals"
    ],
    answer: "Able to survive and yield harvests with minimal water or rainfall",
    hint: "Examine what millet, sorghum, and cowpeas achieve when rains fail.",
    solution: "The examples of crops that thrive when seasonal rains fail illustrate that 'drought-tolerant' means capable of surviving on minimal moisture.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The old hunter possessed **acute** hearing; he could detect the faint rustle of a dry leaf or the soft footfall of an antelope hundreds of meters away.",
    question: "What is the meaning of 'acute' as shown by the hunter's listening ability?",
    options: [
      "Weak and failing",
      "Sharp, keen, and highly sensitive",
      "Painful and diseased",
      "Completely deaf"
    ],
    answer: "Sharp, keen, and highly sensitive",
    hint: "Consider how someone detects faint rustles hundreds of meters away.",
    solution: "The descriptive details showing he could detect faint sounds from vast distances prove that 'acute' means sharp, keen, and sensitive.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "The company's finances were in a **precarious** condition—that is to say, dangerously unstable and on the verge of total bankruptcy.",
    question: "Using the restatement clue 'that is to say', what does 'precarious' mean?",
    options: [
      "Secure and highly profitable",
      "Dangerously unstable and insecure",
      "Well-known to international banks",
      "Completely free of debt"
    ],
    answer: "Dangerously unstable and insecure",
    hint: "Look at the definition following the signal phrase 'that is to say'.",
    solution: "The restatement signal defines 'precarious' directly as 'dangerously unstable and on the verge of bankruptcy'.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "Whereas the coastal plain is hot and **arid**, receiving less than six hundred millimeters of rainfall annually, the southwestern forest zone is humid and receives torrential rains.",
    question: "Using the contrast signaled by 'Whereas', what is the meaning of 'arid'?",
    options: [
      "Extremely dry with little or no rainfall",
      "Covered in thick mud and marshes",
      "Cold and breezy all year",
      "Surrounded by deep ocean water"
    ],
    answer: "Extremely dry with little or no rainfall",
    hint: "Contrast receiving under 600 mm of rain with the humid zone's torrential rains.",
    solution: "Receiving under 600 mm of rain contrasted with humid, torrential conditions defines 'arid' as dry and barren of moisture.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Due to the driver's **negligence** in failing to inspect his brake fluid levels before the mountain trip, the passenger bus lost control on the steep descent.",
    question: "What does 'negligence' mean as determined by the cause-and-effect clue in the text?",
    options: [
      "Carelessness and failure to exercise proper care",
      "Expert driving skill and focus",
      "A mechanical breakdown caused by bad roads",
      "Fear of driving on mountain paths"
    ],
    answer: "Carelessness and failure to exercise proper care",
    hint: "Identify what failing to inspect brake fluid demonstrates.",
    solution: "Failing to perform an essential safety check represents carelessness, defining 'negligence' as failure to take reasonable care.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The clinic treated various **dermatological** conditions, including eczema, scabies, fungal ringworm, and severe solar dermatitis.",
    question: "Based on the medical examples listed, what does 'dermatological' mean?",
    options: [
      "Relating to the health and disorders of the skin",
      "Relating to bone fractures in children",
      "Relating to tooth and gum decay",
      "Relating to infectious eye diseases"
    ],
    answer: "Relating to the health and disorders of the skin",
    hint: "What do eczema, scabies, ringworm, and sunburn have in common?",
    solution: "The medical examples (eczema, scabies, ringworm) are all skin afflictions, establishing that 'dermatological' relates to skin health.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The chief was widely respected for his **equanimity**; even when angry protesters surrounded the palace demanding lower land taxes, he spoke with gentle calm and never raised his voice.",
    question: "What does 'equanimity' mean as demonstrated by the chief's behavior?",
    options: [
      "Violent anger and shouting",
      "Calmness, composure, and emotional balance under stress",
      "Fear of confrontation with youths",
      "Inability to make political decisions"
    ],
    answer: "Calmness, composure, and emotional balance under stress",
    hint: "Notice how the chief reacted to angry protesters by remaining calm and gentle.",
    solution: "Remaining calm, gentle, and unprovoked when facing angry protesters illustrates that 'equanimity' means emotional composure under pressure.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "The botanist classified the shrub as **indigenous**—meaning that it originated naturally in local forests rather than being imported from abroad.",
    question: "According to the definition clue in the sentence, what does 'indigenous' mean?",
    options: [
      "Imported recently from foreign countries",
      "Originating and growing naturally in a particular local region",
      "Dangerous to touch or eat",
      "Grown exclusively inside glass greenhouses"
    ],
    answer: "Originating and growing naturally in a particular local region",
    hint: "Read the phrase following '—meaning that...'.",
    solution: "The definition phrase explicitly explains that 'indigenous' means originating naturally in local forests rather than imported.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "Unlike her brother who was notoriously **obstinate** and refused to change his mind even when proven wrong, Mansa was pliable and open to suggestions.",
    question: "Using the contrast clue in the excerpt, what is the meaning of 'obstinate'?",
    options: [
      "Stubborn and refusing to change one's opinion",
      "Gentle, humble, and polite",
      "Intelligent and good at mathematics",
      "Generous with personal belongings"
    ],
    answer: "Stubborn and refusing to change one's opinion",
    hint: "Contrast refusing to change one's mind with being pliable and open.",
    solution: "Refusing to change one's mind contrasted with being pliable defines 'obstinate' as stubborn and inflexible.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the market women stored fresh tomatoes in **ventilated** wooden crates that allowed air to circulate, the produce did not rot before market day.",
    question: "What does 'ventilated' mean as revealed by the causal clue in the sentence?",
    options: [
      "Airtight and sealed with wax",
      "Provided with openings allowing air to pass freely",
      "Submerged in cold river water",
      "Painted with bright red colors"
    ],
    answer: "Provided with openings allowing air to pass freely",
    hint: "Look at the phrase explaining what the crates allowed.",
    solution: "The clause 'that allowed air to circulate' directly defines ventilated crates as having openings for air movement.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The wildlife sanctuary is home to numerous **herbivores**, such as zebras, giraffes, buffaloes, and antelopes.",
    question: "Based on the animal examples provided, what is a 'herbivore'?",
    options: [
      "An animal that hunts and eats other animals",
      "An animal that feeds primarily on plants and vegetative matter",
      "A bird that flies across oceans",
      "A reptile that lives in underground burrows"
    ],
    answer: "An animal that feeds primarily on plants and vegetative matter",
    hint: "What diet do zebras, giraffes, and antelopes share?",
    solution: "The animal examples (zebras, giraffes, antelopes) are plant-eaters, defining 'herbivores' as plant-feeding animals.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The candidate gave an **evasive** answer; rather than answering the journalist's direct question about missing funds, he talked about the weather and walked away.",
    question: "What is the contextual meaning of 'evasive' based on the candidate's response?",
    options: [
      "Honest, transparent, and direct",
      "Avoiding giving a direct or clear answer",
      "Angry and physically violent",
      "Extremely humorous and witty"
    ],
    answer: "Avoiding giving a direct or clear answer",
    hint: "Notice that he avoided the question by talking about the weather.",
    solution: "Diverting attention to the weather rather than answering directly demonstrates that 'evasive' means avoiding a direct answer.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "The committee agreed that the proposal was **feasible**—in other words, capable of being carried out successfully with existing local resources.",
    question: "Using the restatement signal 'in other words', what does 'feasible' mean?",
    options: [
      "Impractical and bound to fail",
      "Possible and practical to accomplish successfully",
      "Extremely expensive and wasteful",
      "Illegal under national constitution"
    ],
    answer: "Possible and practical to accomplish successfully",
    hint: "Read the definition introduced by 'in other words'.",
    solution: "The restatement signal defines 'feasible' directly as capable of being carried out successfully with existing resources.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "While previous governors were notoriously **corrupt**, embezzling public funds for personal luxury, the new administrator was incorruptible and accounted for every pesewa.",
    question: "Using the contrast between governors, what does 'incorruptible' mean?",
    options: [
      "Too honest to take bribes or act dishonestly",
      "Easily bribed by wealthy merchants",
      "Lazy and unwilling to go to work",
      "Afraid of public criticism"
    ],
    answer: "Too honest to take bribes or act dishonestly",
    hint: "Contrast embezzling public funds with accounting for every pesewa.",
    solution: "Accounting for every pesewa and contrasting with embezzlement proves that 'incorruptible' means utterly honest and incapable of being bribed.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the factory discharged **noxious** chemical fumes into the residential neighborhood, dozens of schoolchildren suffered acute coughing fits and nausea.",
    question: "What does 'noxious' mean based on the physiological effect on the schoolchildren?",
    options: [
      "Pleasant and sweetly scented",
      "Harmful, poisonous, or very unpleasant",
      "Completely harmless to humans",
      "Cold and refreshing"
    ],
    answer: "Harmful, poisonous, or very unpleasant",
    hint: "Consider what chemical fumes causing coughing and nausea are like.",
    solution: "Fumes causing coughing fits and nausea are toxic, defining 'noxious' as harmful and poisonous.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The village carpenter made various **utilitarian** household items, such as mortar-and-pestle sets, sturdy benches, washstools, and wooden ladles.",
    question: "Based on the examples ('such as...'), what does 'utilitarian' mean?",
    options: [
      "Purely decorative and useless in daily life",
      "Designed to be useful, practical, and functional",
      "Made of expensive imported gold",
      "Extremely fragile and easily broken"
    ],
    answer: "Designed to be useful, practical, and functional",
    hint: "Examine the everyday domestic functions of mortars, benches, stools, and ladles.",
    solution: "The examples (mortars, benches, ladles) are practical household tools, defining 'utilitarian' as functional and useful.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The marathon runner appeared **exhausted** at the finish line; his knees buckled, his skin was pale, and he collapsed onto the grass gasping for breath.",
    question: "What is the meaning of 'exhausted' as demonstrated by the runner's physical condition?",
    options: [
      "Full of energy and ready to run again",
      "Completely drained of physical energy and strength",
      "Angry at the race judges",
      "Proud and boastful"
    ],
    answer: "Completely drained of physical energy and strength",
    hint: "Observe the physical signs: buckled knees, pale skin, collapsing, gasping for breath.",
    solution: "Buckled knees, pale skin, and collapsing onto the grass gasping show that 'exhausted' means thoroughly drained of energy.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "The document was authenticated as **veritable**—that is, genuine and completely true to the original historical record.",
    question: "According to the restatement clue 'that is', what does 'veritable' mean?",
    options: [
      "Fake, forged, and untrustworthy",
      "True, genuine, and authentic",
      "Illegible and difficult to read",
      "Written in pencil"
    ],
    answer: "True, genuine, and authentic",
    hint: "Look at the phrase directly following 'that is'.",
    solution: "The signal phrase 'that is' defines 'veritable' directly as genuine and completely true to the original record.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "Whereas wild lions are fierce and **ferocious**, domestic sheep are docile and easily managed by small children.",
    question: "Using the contrast between lions and sheep, what does 'docile' mean?",
    options: [
      "Violent and dangerous to humans",
      "Gentle, calm, and easily managed or led",
      "Extremely fast when running",
      "Nocturnal animals that sleep by day"
    ],
    answer: "Gentle, calm, and easily managed or led",
    hint: "Contrast ferocious lions with sheep that are easily managed by small children.",
    solution: "Being easily managed by children and contrasting with ferocious beasts defines 'docile' as gentle and calm.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the hospital lacked a backup electrical generator during the sudden blackout, surgeons faced a **grave** crisis during emergency procedures.",
    question: "What does 'grave' mean in the context of this emergency surgery crisis?",
    options: [
      "Trivial and unimportant",
      "Extremely serious, critical, and dangerous",
      "Humorous and amusing",
      "Easily solved in five minutes"
    ],
    answer: "Extremely serious, critical, and dangerous",
    hint: "What happens when operating rooms lose electricity during emergency surgery?",
    solution: "A blackout during emergency surgery is life-threatening, defining 'grave' as extremely serious and perilous.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The school farm reared various **poultry** birds, including chickens, guinea fowls, ducks, and domestic turkeys.",
    question: "Based on the examples listed, what is the collective meaning of 'poultry'?",
    options: [
      "Four-legged grazing livestock",
      "Domesticated birds raised for meat or eggs",
      "Wild predators of the forest",
      "Fish reared in artificial ponds"
    ],
    answer: "Domesticated birds raised for meat or eggs",
    hint: "What do chickens, guinea fowls, ducks, and turkeys have in common?",
    solution: "The avian examples (chickens, guinea fowls, ducks, turkeys) define 'poultry' as domestic birds raised for food.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The defense lawyer was remarkably **eloquent**; she spoke with fluent grace, chose persuasive vocabulary, and held the jurors spellbound with her argument.",
    question: "What is the meaning of 'eloquent' as illustrated by the lawyer's speech?",
    options: [
      "Stuttering, hesitant, and hard to hear",
      "Fluent, forceful, and persuasively expressive in speech",
      "Rude, disrespectful, and shouting insults",
      "Boring and speaking in a whisper"
    ],
    answer: "Fluent, forceful, and persuasively expressive in speech",
    hint: "Notice the description: fluent grace, persuasive vocabulary, spellbound listeners.",
    solution: "Speaking with fluent grace and holding jurors spellbound proves that 'eloquent' means articulate and persuasively expressive.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "The headmaster imposed a **moratorium**—meaning a temporary prohibition or suspension—on all weekend entertainment until academic grades improved.",
    question: "Using the definition clue set between dashes, what is a 'moratorium'?",
    options: [
      "A permanent celebration festival",
      "A temporary prohibition or suspension of an activity",
      "A financial prize for top students",
      "A newly built school classroom"
    ],
    answer: "A temporary prohibition or suspension of an activity",
    hint: "Read the phrase following '—meaning...'.",
    solution: "The definition dash explicitly explains that a 'moratorium' is a temporary prohibition or suspension.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "Unlike her brother who was notoriously **extravagant**, buying luxury watches he could not afford, Abena was frugal and spent only on essentials.",
    question: "Using the contrast between Abena and her brother, what does 'extravagant' mean?",
    options: [
      "Spending money excessively and wastefully",
      "Careful and saving money in bank accounts",
      "Very poor and lacking basic food",
      "Generous in paying taxes"
    ],
    answer: "Spending money excessively and wastefully",
    hint: "Contrast buying luxury watches one cannot afford with spending only on essentials.",
    solution: "Buying unaffordable luxury watches contrasted with spending only on essentials identifies 'extravagant' as wasteful and excessive with money.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the mechanic used **substandard** spare parts to repair the car's steering rack, the vehicle broke down only three days after leaving the garage.",
    question: "What does 'substandard' mean based on the cause of the immediate breakdown?",
    options: [
      "Of superior, first-class quality",
      "Below the acceptable quality or standard",
      "Imported from abroad",
      "Extremely expensive to purchase"
    ],
    answer: "Below the acceptable quality or standard",
    hint: "Why did the vehicle break down just three days after repairs?",
    solution: "The rapid failure of the vehicle points to parts of inferior grade, defining 'substandard' as below acceptable quality.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The traditional priest displayed various **talismans**, including cowrie-shell armlets, inscribed leather amulets, and consecrated brass rings.",
    question: "Based on the examples provided ('including...'), what is a 'talisman'?",
    options: [
      "An object inscribed with symbols believed to offer spiritual protection or power",
      "A heavy iron cooking pot",
      "A musical instrument played with sticks",
      "A type of foreign currency"
    ],
    answer: "An object inscribed with symbols believed to offer spiritual protection or power",
    hint: "What do cowrie armlets, leather amulets, and consecrated brass rings represent?",
    solution: "The ritual items (amulets, inscribed armlets) illustrate that 'talismans' are objects believed to possess protective or spiritual power.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The witness was **inconsolable** after the traffic accident; she wept uncontrollably, refused all offers of food, and clutched her head in despair.",
    question: "What does 'inconsolable' mean as shown by the witness's emotional state?",
    options: [
      "Calm, relaxed, and cheerful",
      "So deeply grieving or devastated that no comfort can soothe them",
      "Guilty and trying to run away",
      "Hungry and asking for dinner"
    ],
    answer: "So deeply grieving or devastated that no comfort can soothe them",
    hint: "Weeping uncontrollably and refusing all comfort shows deep distress.",
    solution: "Uncontrollable weeping and inability to be comforted show that 'inconsolable' means devastated beyond comfort.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "The scientist declared the chemical **volatile**—that is to say, it evaporates rapidly at normal room temperatures.",
    question: "According to the restatement clue 'that is to say', what does 'volatile' mean in this context?",
    options: [
      "Solid and impossible to melt",
      "Evaporating rapidly at normal room temperatures",
      "Completely odorless and invisible",
      "Safe to drink like fresh water"
    ],
    answer: "Evaporating rapidly at normal room temperatures",
    hint: "Read the definition directly following 'that is to say'.",
    solution: "The signal phrase 'that is to say' directly defines 'volatile' as evaporating rapidly at room temperature.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "While commercial timber felling is **destructive** to native forest biodiversity, organic agroforestry is beneficial, regenerating soil nutrients and planting tree canopies.",
    question: "Using the contrast between timber felling and agroforestry, what does 'beneficial' mean?",
    options: [
      "Producing good, favorable, or helpful results",
      "Harmful, toxic, and causing destruction",
      "Extremely slow and unproductive",
      "Illegal under environmental law"
    ],
    answer: "Producing good, favorable, or helpful results",
    hint: "Contrast 'destructive' with regenerating nutrients and planting trees.",
    solution: "Regenerating nutrients and contrasting with destructive timber felling shows that 'beneficial' means helpful and advantageous.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the student was **chronically** tardy, arriving thirty minutes late to every morning assembly for a full term, the disciplinary committee suspended him.",
    question: "What does 'chronically' mean based on the student's habitual lateness?",
    options: [
      "Only once by accident",
      "Persistently, habitually, and constantly over a long duration",
      "Quickly and politely",
      "Early before anyone else arrives"
    ],
    answer: "Persistently, habitually, and constantly over a long duration",
    hint: "Notice that he was late 'to every morning assembly for a full term'.",
    solution: "Being late every morning for an entire term illustrates that 'chronically' means persistently and habitually over time.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The carpenter used various **abrasives**, such as coarse sandpaper, steel wool, and emery cloth, to smooth down rough mahogany planks.",
    question: "Based on the examples provided ('such as...'), what is an 'abrasive'?",
    options: [
      "A material used for rubbing, grinding, or smoothing a surface",
      "A type of liquid paint for wood",
      "A metal nail used to join furniture",
      "A wooden ruler for measuring"
    ],
    answer: "A material used for rubbing, grinding, or smoothing a surface",
    hint: "What do sandpaper, steel wool, and emery cloth do to rough wood?",
    solution: "The examples (sandpaper, steel wool, emery cloth) are materials used to rub and smooth surfaces, defining 'abrasives'.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The soldier remained **resolute**; despite being surrounded by advancing enemy troops, he held his defensive position and refused to retreat.",
    question: "What is the meaning of 'resolute' as demonstrated by the soldier's defiance?",
    options: [
      "Cowardly and running away in fear",
      "Admirably purposeful, determined, and unwavering",
      "Confused about which way to march",
      "Severely wounded and asleep"
    ],
    answer: "Admirably purposeful, determined, and unwavering",
    hint: "Look at the evidence: holding his defensive position and refusing to retreat.",
    solution: "Holding his position and refusing to retreat under fire proves that 'resolute' means steadfast and firmly determined.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "The mineral was certified as **synthetic**—meaning that it was produced artificially in a laboratory rather than formed naturally by geological processes.",
    question: "According to the definition clue in the sentence, what does 'synthetic' mean?",
    options: [
      "Formed naturally over millions of years",
      "Made by chemical synthesis and artificial means rather than occurring naturally",
      "Made of solid pure gold",
      "Discovered deep inside ocean trenches"
    ],
    answer: "Made by chemical synthesis and artificial means rather than occurring naturally",
    hint: "Read the phrase following '—meaning that...'.",
    solution: "The definition phrase explicitly states that 'synthetic' means produced artificially in a lab rather than naturally formed.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "Whereas the juvenile baboon was **timid**, darting behind its mother at the slightest noise, the alpha male was bold, standing his ground and baring his teeth.",
    question: "Using the contrast between the juvenile and the alpha male, what does 'timid' mean?",
    options: [
      "Showing a lack of courage, fearful, and easily frightened",
      "Aggressive, violent, and eager to fight",
      "Playful and friendly to human visitors",
      "Extremely old and tired"
    ],
    answer: "Showing a lack of courage, fearful, and easily frightened",
    hint: "Contrast darting away in fear with standing ground and baring teeth.",
    solution: "Darting behind its mother in fear contrasted with the bold alpha male defines 'timid' as easily frightened and shy.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the commercial fisherman operated without a valid navigational compass in dense sea fog, his vessel became **disoriented** and drifted miles off course.",
    question: "What does 'disoriented' mean based on the cause-and-effect relationship?",
    options: [
      "Anchored safely in the harbor",
      "Having lost one's sense of direction or bearings",
      "Moving faster than a speed boat",
      "Sinking to the ocean floor"
    ],
    answer: "Having lost one's sense of direction or bearings",
    hint: "What happens when operating in fog without a compass?",
    solution: "Lacking a compass in dense fog and drifting off course demonstrates that 'disoriented' means losing sense of direction.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The botanical garden cultivated various **succulents**, such as aloe vera, jade plants, and desert cacti, which store moisture in fleshy stems.",
    question: "Based on the examples provided ('such as...'), what is a 'succulent'?",
    options: [
      "A plant with thick, fleshy tissues adapted to storing water",
      "A tall deciduous forest timber tree",
      "A water plant that floats on lakes",
      "A fungus that grows on rotting logs"
    ],
    answer: "A plant with thick, fleshy tissues adapted to storing water",
    hint: "What common physical trait is noted about aloe vera and desert cacti?",
    solution: "The plant examples and the detail 'which store moisture in fleshy stems' define 'succulents' as water-storing plants.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The public speaker was notoriously **monotonous**; he spoke in a flat, unvarying tone without changing his pitch or volume for an hour, putting his audience to sleep.",
    question: "What is the meaning of 'monotonous' as illustrated by the speaker's delivery?",
    options: [
      "Dull, tedious, and repetitiously unvarying in tone",
      "Exciting, theatrical, and dramatic",
      "Speaking in many foreign languages",
      "Singing melodious traditional songs"
    ],
    answer: "Dull, tedious, and repetitiously unvarying in tone",
    hint: "Notice that he spoke in a flat, unvarying tone and put people to sleep.",
    solution: "Speaking in an unvarying pitch that puts listeners to sleep defines 'monotonous' as tediously unvarying in tone.",
    target: "Context Clue: Descriptive Expansion"
  },
  {
    passage: "The magistrate issued an **injunction**—that is to say, an authoritative judicial order restraining the developers from demolishing the historical schoolhouse.",
    question: "Using the restatement clue 'that is to say', what is an 'injunction'?",
    options: [
      "A financial receipt for paying court fines",
      "An authoritative judicial court order restraining an action",
      "A public apology published in newspapers",
      "A letter of recommendation for employment"
    ],
    answer: "An authoritative judicial court order restraining an action",
    hint: "Read the phrase following 'that is to say'.",
    solution: "The signal phrase 'that is to say' directly defines 'injunction' as an authoritative court order restraining an action.",
    target: "Context Clue: Definition / Restatement"
  },
  {
    passage: "Unlike her cousin who was **pessimistic**, always predicting examination failure and financial ruin, Afia was cheerful and remained optimistic about her future.",
    question: "Using the contrast between the two cousins, what does 'pessimistic' mean?",
    options: [
      "Tending to see the worst aspect of things or believe the worst will happen",
      "Full of hope and confidence about the future",
      "Generous with food and school supplies",
      "Hardworking and waking up at dawn"
    ],
    answer: "Tending to see the worst aspect of things or believe the worst will happen",
    hint: "Contrast predicting failure and ruin with being cheerful and optimistic.",
    solution: "Predicting failure and ruin contrasted with being optimistic proves that 'pessimistic' means expecting the worst outcome.",
    target: "Context Clue: Contrast"
  },
  {
    passage: "Because the factory neglected to lubricate the heavy steel rollers, the machinery produced **cacophonous** screeches that forced nearby workers to cover their ears.",
    question: "What does 'cacophonous' mean based on the workers covering their ears?",
    options: [
      "Melodious, gentle, and pleasing to hear",
      "Involving a harsh, discordant, and ear-splitting mixture of sounds",
      "Completely silent and soundless",
      "Sweet like orchestral flute music"
    ],
    answer: "Involving a harsh, discordant, and ear-splitting mixture of sounds",
    hint: "Why did the unlubricated rollers force workers to cover their ears?",
    solution: "Screeches so harsh that workers must cover their ears define 'cacophonous' as discordant, harsh, and grating.",
    target: "Context Clue: Cause and Effect"
  },
  {
    passage: "The wildlife biology student studied several **marsupials**, including kangaroos, koalas, wallabies, and opossums, which carry their young in pouches.",
    question: "Based on the animal examples provided, what is a 'marsupial'?",
    options: [
      "A mammal whose young are carried in an external maternal pouch",
      "A cold-blooded reptile that lays eggs in sand",
      "A sea creature with eight tentacles",
      "A predatory bird that hunts by night"
    ],
    answer: "A mammal whose young are carried in an external maternal pouch",
    hint: "Look at the shared biological trait: 'which carry their young in pouches'.",
    solution: "The examples (kangaroos, koalas) and the defining trait 'carry their young in pouches' define 'marsupials'.",
    target: "Context Clue: Exemplification"
  },
  {
    passage: "The diplomat was exceptionally **tactful**; during the tense border meeting, she corrected the minister's error politely without embarrassing him in front of his peers.",
    question: "What is the meaning of 'tactful' as demonstrated by the diplomat's diplomatic conduct?",
    options: [
      "Rude, blunt, and insulting",
      "Showing skill and sensitivity in dealing with others or difficult issues",
      "Afraid to speak at official meetings",
      "Late to all government negotiations"
    ],
    answer: "Showing skill and sensitivity in dealing with others or difficult issues",
    hint: "Observe how she corrected an error politely without causing embarrassment.",
    solution: "Correcting a superior politely without causing embarrassment illustrates that 'tactful' means sensitive, diplomatic, and discreet.",
    target: "Context Clue: Descriptive Expansion"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH MARINE PLASTICS PASSAGE (51 TO 55)
// =========================================================================
const capstone5B8FoundationQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 2, why do endangered olive ridley sea turtles ingest translucent plastic bags?",
    options: [
      "Because plastics taste sweet like ocean seaweed",
      "Because they mistake floating translucent bags for jellyfish, their natural food",
      "Because plastic bags protect turtles from ocean predators",
      "Because turtles use plastic bags to build underwater nests"
    ],
    answer: "Because they mistake floating translucent bags for jellyfish, their natural food",
    hint: "Review paragraph 2 regarding the dietary habits of sea turtles.",
    solution: "Paragraph 2 states explicitly that sea turtles 'frequently mistake floating translucent plastic bags for jellyfish, their preferred dietary staple.'",
    target: "Capstone Exam: Literal Fact Retrieval"
  },
  {
    questionNumber: 52,
    question: "What term is used in paragraph 2 by marine biologists to describe abandoned monofilament fishing gear that drifts through coastal shallows?",
    options: ["'Ghost nets'", "'Plastic reefs'", "'Floating booms'", "'Silt traps'"],
    answer: "'Ghost nets'",
    hint: "Scan paragraph 2 for the two-word phrase set in quotation marks.",
    solution: "Paragraph 2 explicitly names abandoned gear 'popularly designated by marine biologists as \"ghost nets\"'.",
    target: "Capstone Exam: Scanning Specific Terminology"
  },
  {
    questionNumber: 53,
    question: "As used in paragraph 3, what does the word 'ubiquitous' mean ('These ubiquitous microplastics absorb toxic organic pollutants...')?",
    options: [
      "Extremely rare and hard to discover",
      "Present, appearing, or found everywhere",
      "Completely non-toxic and healthy",
      "Large and easily visible to the naked eye"
    ],
    answer: "Present, appearing, or found everywhere",
    hint: "Connect the word with microscopic fragments dispersed widely throughout ocean waters.",
    solution: "In this environmental context, 'ubiquitous' means omnipresent—found everywhere throughout marine habitats.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    questionNumber: 54,
    question: "How do chemical toxins from microplastics end up in the human body according to paragraph 3?",
    options: [
      "Through breathing ocean beach air during harmattan",
      "By swimming in coastal resort swimming pools",
      "When filter-feeders ingest toxic microplastics and are subsequently eaten as fresh seafood by humans",
      "Through walking barefoot on sandy beaches"
    ],
    answer: "When filter-feeders ingest toxic microplastics and are subsequently eaten as fresh seafood by humans",
    hint: "Trace the biological food chain: toxic particles -> oysters/sardinella -> human seafood consumption.",
    solution: "Paragraph 3 explains that filter-feeders ingest toxic microplastics, allowing toxins to bioaccumulate up the food web until humans consume the contaminated seafood.",
    target: "Capstone Exam: Causal Analysis"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary municipal solution to drainage plastic discharge in paragraph 4.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Authorities must build trash booms across canals.",
      "Constructing engineered silt-and-trash booms across storm drainage canals.",
      "Because plastics kill sea turtles, coastal assemblies must definitely construct trash barriers.",
      "Building canal barriers."
    ],
    answer: "Authorities must build trash booms across canals.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Authorities must build trash booms across canals' is exactly 7 words, possesses complete Subject-Verb-Object syntax, and captures the core engineering remedy. Option B is a participial fragment (lacks finite verb).",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB8Foundation() {
  console.log("Building 55 UNIQUE questions for Basic 8 Foundation...");
  const db = await getDb();

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50B8FoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_F_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B8.2.1.1: Deduce the contextual meanings of unfamiliar vocabulary using structural context clues."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8FoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${marinePlasticsFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_F_${item.questionNumber}`,
      level: "B8",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: marinePlasticsFullPassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.2.1.1 / B8.2.2.1: Multi-paragraph textual analysis, contextual vocabulary deduction, and constrained summary synthesis."
    });
  });

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  // 3. Write to subcollection B8_foundation across all paths
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B8_foundation`);
    await targetDoc.set({
      level: "B8",
      difficulty: "foundation",
      title: "Basic 8 Foundation Lab: 50 Unique Context Clue Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (4 Context Clue Types) + 5 Capstone Full-Passage Questions",
        passageVisibility: "Passage embedded both in passageText and at the top of prompt",
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${targetDoc.path}`);
  }

  // 4. Synchronize into main topical document practicePool.low for TopicalLabRunner (level: b8)
  console.log("\nSynchronizing main topical document practicePool.low for b8 (keeping b7, b8, b9 only)...");
  const mappedLowQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'low' as const,
    prompt: q.prompt,
    passageText: q.passageText,
    isCapstoneExamPassage: q.isCapstoneExamPassage,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1,
    learningCompetency: q.learningCompetency
  }));

  for (const mainPath of paths) {
    const mainRef = db.doc(mainPath);
    const snap = await mainRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      
      const cleanLevels: Record<string, any> = {
        b7: existingLevels.b7 || {},
        b8: {
          ...(existingLevels.b8 || {}),
          practicePool: {
            ...(existingLevels.b8?.practicePool || {}),
            low: mappedLowQuestions
          }
        },
        b9: existingLevels.b9 || {}
      };

      const { questions, ...cleanData } = data;

      await mainRef.set({
        ...cleanData,
        levels: cleanLevels,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated main document practicePool.low for b8 at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B8 Foundation!`);
}

deployUniqueB8Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B8 Foundation:", err);
    process.exit(1);
  });

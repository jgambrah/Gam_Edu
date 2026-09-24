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
  difficulty: "intermediate";
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
const solarMiniGridFullPassage = 
`For decades, isolated agrarian and fishing island settlements across Lake Volta remained completely severed from the national electricity grid. Because extending underwater high-voltage transmission cables across wide expanses of water was deemed commercially unviable by state utility agencies, islanders relied exclusively on polluting kerosene lamps, costly dry-cell battery torches, and noisy petrol generators operated for only a few evening hours by affluent merchants.

This chronic energy deprivation crippled local public infrastructure and truncated educational development. Nighttime commercial activities ground to a premature halt as darkness enveloped the hamlets at dusk. Island health outposts were incapable of operating cold-chain refrigeration units to store temperature-sensitive childhood vaccines and antivenom serums, forcing nurses to transport critically ill snakebite victims across choppy waters in wooden motorized canoes. Furthermore, schoolchildren squinted under toxic kerosene smoke to complete daily homework assignments, resulting in persistent respiratory inflammation and declining literacy performance.

The commissioning of decentralized photovoltaic solar mini-grids has fundamentally transformed the socioeconomic fabric of these lake communities. Built on centralized communal plots, arrays of solar panels coupled with industrial lithium-iron phosphate battery banks now supply uninterrupted alternating current directly to domestic households, schools, and civic clinics. Commercial refrigeration hubs now allow artisanal fishermen to chill fresh catches of tilapia and mudfish immediately after landing, drastically curtailing post-harvest spoilage and eliminating exploitative price gouging by middlemen from mainland towns.

Moreover, the availability of nighttime illumination has extended productive working hours for micro-enterprises and revitalized evening adult literacy classes in community basic schools. To guarantee long-term operational sustainability, local town development committees have instituted transparent, mobile-money token systems where domestic tariffs finance preventive mechanical maintenance and spare-part replenishment.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B8IntermediateDrills = [
  {
    passage: "Kwame walked out of the scholarship interview room, loosened his tight necktie with trembling fingers, and stared blankly at his muddy shoes with slumping shoulders. When his mother asked how it went, he turned his face away in silence.",
    question: "What can be inferred about the outcome of Kwame's interview?",
    options: [
      "He was immediately offered the scholarship with highest honors",
      "The interview went very poorly and he was deeply disappointed",
      "He was angry because the interviewers were his close friends",
      "He forgot to bring his academic certificates into the room"
    ],
    answer: "The interview went very poorly and he was deeply disappointed",
    hint: "Combine the physical gestures: trembling fingers, slumping shoulders, silent turning away.",
    solution: "Slumping shoulders, blank stares, trembling hands, and avoiding his mother's eyes point logically to distress and failure.",
    target: "Deductive Inference: Emotional State"
  },
  {
    passage: "As dark cumulonimbus clouds gathered overhead and thunder rumbled in the distance, the market women hurriedly packed their dried fish and grains into plastic tarpaulins, fastening the ropes firmly to their wooden stalls.",
    question: "What impending event prompted the market women's urgent actions?",
    options: [
      "The sudden arrival of municipal tax collectors",
      "An imminent torrential rainstorm",
      "A surprise visit by the Paramount Chief",
      "The town's evening curfew siren sounding"
    ],
    answer: "An imminent torrential rainstorm",
    hint: "Connect 'cumulonimbus clouds' and 'thunder' with tying down waterproof tarpaulins.",
    solution: "Dark cumulonimbus clouds accompanied by thunder signal heavy rainstorms, prompting the women to protect perishable goods.",
    target: "Deductive Inference: Environmental Cues"
  },
  {
    passage: "Although Mr. Mensah's provision shop was small, his account ledgers were spotless, every sales receipt was filed in numerical order, and his balance sheet matched the bank statements to the exact pesewa.",
    question: "What does the passage imply about Mr. Mensah's professional character?",
    options: [
      "He was a careless shopkeeper who lost money regularly",
      "He was exceptionally honest, disciplined, and financially organized",
      "He was secretly preparing to close down his commercial shop",
      "He did not know how to record financial transactions"
    ],
    answer: "He was exceptionally honest, disciplined, and financially organized",
    hint: "Spotless ledgers and matching bank statements to the exact pesewa indicate rigorous discipline.",
    solution: "Maintaining pristine records and balancing accounts to the exact pesewa shows organizational discipline and financial integrity.",
    target: "Character Inference: Traits"
  },
  {
    passage: "The doctor looked grave as she reviewed the diagnostic MRI scans. She requested the head nurse to invite the patient's family into the private consultation room before speaking.",
    question: "What does the doctor's behavior suggest about the patient's medical condition?",
    options: [
      "The patient had fully recovered and was being discharged immediately",
      "The scan revealed a serious or critical health condition",
      "The doctor misplaced the medical files and needed help searching",
      "The hospital was having a staff celebration in the ward"
    ],
    answer: "The scan revealed a serious or critical health condition",
    hint: "A 'grave' expression and summoning family into a private room are clinical indicators of serious news.",
    solution: "A grave expression and a request for family members to enter a private room imply serious medical news rather than a routine discharge.",
    target: "Situational Inference: Professional Context"
  },
  {
    passage: "Every evening, grandfather sat under the ancient baobab tree. As soon as he cleared his throat, children from across the compound gathered silently in a semicircle at his feet, their eyes wide with anticipation.",
    question: "Why did the children gather around grandfather when he cleared his throat?",
    options: [
      "They feared he was about to punish them for missing school",
      "They eagerly anticipated his evening storytelling session",
      "They wanted to borrow money from his leather purse",
      "He had prepared an evening meal for the entire village"
    ],
    answer: "They eagerly anticipated his evening storytelling session",
    hint: "Sitting in a semicircle with wide, expectant eyes under an ancestral tree is traditional storytelling behavior.",
    solution: "Children gathering in a semicircle at an elder's feet with expectant eyes denotes eagerness to hear folklore and moral tales.",
    target: "Cultural & Behavioral Inference"
  },
  {
    passage: "Kojo arrived at the bus terminal two hours before departure. He checked his ticket three times, verified the bus registration number with the station master, and kept his bag tightly clutched on his lap.",
    question: "What does Kojo's behavior reveal about his personality?",
    options: [
      "He is an anxious and cautious traveler",
      "He is indifferent to travel schedules",
      "He has traveled on this route hundreds of times",
      "He forgot his travel fare at home"
    ],
    answer: "He is an anxious and cautious traveler",
    hint: "Arriving two hours early, checking tickets thrice, and clutching bags indicates nervousness.",
    solution: "Repeated verification, excessive early arrival, and physical vigilance indicate an anxious, highly cautious demeanor.",
    target: "Character Inference: Personality"
  },
  {
    passage: "The kitchen was filled with the pungent smell of burnt palm oil. Black smoke curled toward the ceiling, and the frying pan lay discarded in the zinc sink with charred plantain crusts clinging to its base.",
    question: "What event took place in the kitchen shortly before this scene?",
    options: [
      "Someone successfully baked a sweet sponge cake",
      "Cooking food was left unattended on the fire and burned",
      "The family washed their dishes with hot soapy water",
      "A professional chef prepared a feast for a wedding"
    ],
    answer: "Cooking food was left unattended on the fire and burned",
    hint: "Look at the evidence: smoke, burnt oil smell, and charred crusts on the pan in the sink.",
    solution: "Burnt oil, billowing smoke, and charred food stuck to the pan indicate that food was left on the burner too long and scorched.",
    target: "Situational Inference: Prior Events"
  },
  {
    passage: "When the headmistress announced that Saturday morning extra classes would be canceled, the assembly hall erupted into spontaneous cheers, and pupils threw their notebooks into the air with joy.",
    question: "How did the students feel about the canceled Saturday classes?",
    options: [
      "Deeply saddened because they loved weekend tests",
      "Thrilled and relieved to have free weekend time",
      "Angry at the headmistress for canceling the classes",
      "Confused about the academic calendar"
    ],
    answer: "Thrilled and relieved to have free weekend time",
    hint: "Spontaneous cheers and throwing books in the air indicate joy and celebration.",
    solution: "Cheering and joyful outbursts are unmistakable signs of relief and excitement over having the weekend off.",
    target: "Deductive Inference: Reactions"
  },
  {
    passage: "The farmer noticed that the leaves of his maize plants had curled inward and turned pale yellow. The topsoil around the roots was crisscrossed with deep fissures and crumbled into dry dust when touched.",
    question: "What underlying condition was affecting the farmer's crops?",
    options: [
      "Severe drought and lack of soil moisture",
      "An excess of standing flood water",
      "An infestation of underground burrowing rodents",
      "Excessive chemical fertilizer application"
    ],
    answer: "Severe drought and lack of soil moisture",
    hint: "Curled leaves, cracked soil (fissures), and dry dust point to extreme dehydration.",
    solution: "Deep soil fissures and dusty earth combined with curled, wilting leaves are clear physical indicators of prolonged drought.",
    target: "Deductive Inference: Natural Processes"
  },
  {
    passage: "Ama packed three thick woolen sweaters, heavy leather gloves, and a fur-lined thermal jacket into her suitcase before boarding the outbound flight at Kotoka International Airport.",
    question: "What can be inferred about Ama's travel destination?",
    options: [
      "She is traveling to a hot, humid coastal beach resort",
      "She is traveling to a cold or freezing climate region",
      "She is traveling to a tropical desert oasis",
      "She is traveling to a nearby Ghanaian farming village"
    ],
    answer: "She is traveling to a cold or freezing climate region",
    hint: "Woolen sweaters, leather gloves, and thermal jackets are designed for low temperatures.",
    solution: "Packing thermal jackets, gloves, and heavy wool garments implies that the destination has very cold or freezing weather.",
    target: "Deductive Inference: Motives"
  },
  {
    passage: "The mechanic peered into the radiator, shook his head slowly, and pointed to a cracked rubber hose dripping green coolant onto the hot exhaust manifold. 'You were lucky to make it here,' he murmured.",
    question: "What would likely have happened if the driver had continued driving further?",
    options: [
      "The car would have consumed less petrol",
      "The engine would have overheated and suffered catastrophic breakdown",
      "The car's air conditioning would have become ice cold",
      "The tires would have lost air pressure"
    ],
    answer: "The engine would have overheated and suffered catastrophic breakdown",
    hint: "Leaking coolant from a cracked hose prevents engine cooling.",
    solution: "Coolant fluid regulates engine heat; a cracked hose causing fluid loss will lead to severe engine overheating and seizure.",
    target: "Causal Inference: Potential Outcomes"
  },
  {
    passage: "The hunter carefully inspected the moist riverbank mud. Two deep, two-toed hoof prints were pressed into the clay, water still seeping into the impressions from the edges.",
    question: "What does the seeping water in the animal tracks indicate?",
    options: [
      "The tracks were made several weeks ago during the dry spell",
      "An animal had walked past only a few moments earlier",
      "The tracks were carved into the mud with a wooden stick",
      "No wild animals inhabit the river valley"
    ],
    answer: "An animal had walked past only a few moments earlier",
    hint: "Water takes only seconds or minutes to fill fresh footprints in wet mud.",
    solution: "Water still seeping into freshly pressed tracks indicates that the prints are very fresh and the animal passed by recently.",
    target: "Deductive Inference: Temporal Clues"
  },
  {
    passage: "The candidate refused to make eye contact with the debate moderator. When asked about his educational background, his voice faltered, and beads of perspiration broke out across his forehead despite the air-conditioned hall.",
    question: "What can be deduced about the candidate's reaction to the question?",
    options: [
      "He was completely relaxed and confident in his answers",
      "He was nervous, uncomfortable, or hiding something about his background",
      "He was suffering from extreme hypothermia from cold air",
      "He was amused by the humorous question"
    ],
    answer: "He was nervous, uncomfortable, or hiding something about his background",
    hint: "Sweating in a cold room, avoiding eye contact, and a faltering voice reveal high anxiety.",
    solution: "Physical signs like sweating despite air conditioning, avoiding eye contact, and a shaky voice signify intense discomfort and anxiety.",
    target: "Character Inference: Truthfulness"
  },
  {
    passage: "Aba tapped her pencil rapidly on the wooden desk, glanced at the wall clock every thirty seconds, and chewed on her lower lip while waiting for the mathematics test papers to be distributed.",
    question: "What emotional state is Aba experiencing?",
    options: [
      "Deep drowsiness and boredom",
      "Intense nervousness and exam anxiety",
      "Overwhelming joy and amusement",
      "Anger toward her mathematics teacher"
    ],
    answer: "Intense nervousness and exam anxiety",
    hint: "Desk-tapping, clock-watching every 30 seconds, and lip-biting are classic signs of anxiety.",
    solution: "Fidgety actions like pencil tapping, lip biting, and repeated clock-watching reveal nervous anticipation and test anxiety.",
    target: "Deductive Inference: Emotional State"
  },
  {
    passage: "The ancient stone walls of the castle were two meters thick, with narrow vertical slits instead of standard windows, and a wide moat filled with stagnant water surrounding the perimeter.",
    question: "What was the primary historical purpose of this building's architecture?",
    options: [
      "To serve as a bright, airy greenhouse for growing flowers",
      "To provide military defense and repel hostile armed attacks",
      "To function as a public market for village merchants",
      "To house a school for small children"
    ],
    answer: "To provide military defense and repel hostile armed attacks",
    hint: "Thick walls, arrow slits, and moats are structural elements of military fortification.",
    solution: "Massive stone walls, defensive slits, and surrounding moats were engineered for fortification and defense against invaders.",
    target: "Deductive Inference: Historical Purpose"
  },
  {
    passage: "After the court clerk read the guilty verdict, the defendant bowed his head, placed his hands behind his back, and offered no resistance as the police officers produced handcuffs.",
    question: "What does the defendant's reaction convey?",
    options: [
      "Fierce defiance and intention to fight the police",
      "Resignation and acceptance of the court's judgment",
      "Celebration over winning his freedom",
      "Confusion about where he was standing"
    ],
    answer: "Resignation and acceptance of the court's judgment",
    hint: "Bowing the head and presenting hands for handcuffs without resistance shows submission.",
    solution: "Bowing one's head and offering hands for handcuffs without resistance signifies resignation and submission to the court's decision.",
    target: "Character Inference: Subtext"
  },
  {
    passage: "The bicycle's front wheel was bent into a figure-eight shape, the handlebars were twisted backward, and bits of broken plastic from a car headlight were scattered on the asphalt around it.",
    question: "What happened to the bicycle shortly before this observation?",
    options: [
      "It was assembled incorrectly at the bicycle factory",
      "It was struck by an automobile in a traffic collision",
      "It was left outdoors in heavy rain",
      "It was neatly parked in the school bicycle shed"
    ],
    answer: "It was struck by an automobile in a traffic collision",
    hint: "A twisted frame combined with broken car headlight plastic indicates a vehicular crash.",
    solution: "A crushed bicycle frame surrounded by shattered automobile headlight shards is clear physical evidence of a vehicle collision.",
    target: "Situational Inference: Reconstruction"
  },
  {
    passage: "The shopkeeper locked his front metal grilles, padlocked the deadbolts, switched on the exterior security floodlights, and set the alarm chime before walking toward his home.",
    question: "What time of day is it, and what is the shopkeeper doing?",
    options: [
      "Early morning; he is preparing to open for customers",
      "Nightfall; he is closing the shop securely for the night",
      "Midday; he is taking a quick five-minute lunch break",
      "Afternoon; he is remodeling the storefront"
    ],
    answer: "Nightfall; he is closing the shop securely for the night",
    hint: "Turning on floodlights, padlocking grilles, and arming alarms are end-of-day closing rituals.",
    solution: "Padlocking grilles, arming alarms, and switching on floodlights are actions performed when shutting down a business at night.",
    target: "Deductive Inference: Time & Context"
  },
  {
    passage: "When the traveler reached into his pocket at the ticket counter, his fingers felt only a gaping rip in the fabric lining. His face drained of color as he frantically searched his other pockets.",
    question: "What had happened to the traveler?",
    options: [
      "He found an unexpected wad of currency notes",
      "His wallet or money had fallen through the torn pocket or been stolen",
      "He decided to cancel his trip because he felt unwell",
      "He bought a brand-new suit with deep pockets"
    ],
    answer: "His wallet or money had fallen through the torn pocket or been stolen",
    hint: "A torn pocket lining and a paled face when reaching for money indicate lost funds.",
    solution: "Discovering a ripped pocket and turning pale while trying to pay for a ticket implies the traveler's money was lost or pickpocketed.",
    target: "Situational Inference: Conflict"
  },
  {
    passage: "The river was swollen to twice its normal width. The wooden footbridge was submerged under roaring brown water, and several uprooted plantain trees drifted swiftly past in the current.",
    question: "What recent environmental event caused this river condition?",
    options: [
      "A prolonged harmattan drought",
      "Heavy upstream rainfall and flash flooding",
      "The construction of a concrete dam downstream",
      "A dry season grass fire"
    ],
    answer: "Heavy upstream rainfall and flash flooding",
    hint: "A swollen, muddy river carrying uprooted trees indicates severe floodwaters from rain.",
    solution: "A swollen river carrying uprooted vegetation and submerging bridges is unmistakable evidence of recent heavy rains and flooding upstream.",
    target: "Causal Inference: Natural Events"
  },
  {
    passage: "The teacher placed a gold star on Esi's essay, pinned the paper onto the front bulletin board, and asked the entire class to give her a round of applause.",
    question: "What does the teacher's action imply about Esi's essay?",
    options: [
      "The essay was full of grammatical mistakes and needed rewriting",
      "The essay was exceptional and served as a model for the class",
      "The teacher wanted to shame Esi in front of her peers",
      "The essay was written in a foreign language nobody understood"
    ],
    answer: "The essay was exceptional and served as a model for the class",
    hint: "Awarding gold stars, bulletin board display, and class applause are badges of excellence.",
    solution: "Rewarding work with stars, public display, and peer applause signifies that the essay was of outstanding quality.",
    target: "Situational Inference: Recognition"
  },
  {
    passage: "Kweku walked into the house with wet sand caked between his toes, smelling strongly of saltwater and carrying a plastic bucket filled with small sea shells.",
    question: "Where had Kweku spent his afternoon?",
    options: [
      "In the dense northern savannah forest",
      "At the ocean beach",
      "In a high-tech computer laboratory",
      "Inside a commercial gold mine"
    ],
    answer: "At the ocean beach",
    hint: "Wet sand, smelling of saltwater, and collecting shells are coastal beach experiences.",
    solution: "Saltwater aroma, sea shells, and beach sand point directly to an afternoon spent along the seashore.",
    target: "Deductive Inference: Setting"
  },
  {
    passage: "The dog stood between the baby's cot and the open door, with its hackles raised, its teeth bared in a silent snarl, and its eyes locked onto the dark hallway.",
    question: "What is the dog doing, and why?",
    options: [
      "The dog is playing a game with the baby",
      "The dog is protecting the baby from an apparent threat in the hallway",
      "The dog is begging for food from the kitchen",
      "The dog is preparing to fall asleep"
    ],
    answer: "The dog is protecting the baby from an apparent threat in the hallway",
    hint: "Positioning between a child and an open door with raised hackles and bared teeth is protective.",
    solution: "Standing defensively between a baby and an entrance with bared teeth and raised hackles indicates guard behavior against a perceived threat.",
    target: "Behavioral Inference: Motivation"
  },
  {
    passage: "The letter was crumpled into a tight ball, stained with tear marks, and lay in the wastebasket beside an envelope that had been torn open violently.",
    question: "What can be inferred about the contents of the letter?",
    options: [
      "It contained joyful news of winning a lottery prize",
      "It contained distressing, painful, or heartbreaking news",
      "It was a routine grocery shopping list",
      "It was an invitation to a birthday party"
    ],
    answer: "It contained distressing, painful, or heartbreaking news",
    hint: "Violently torn envelopes, crumpled paper, and tear stains are physical markers of bad news.",
    solution: "Tears on a crumpled paper and an aggressively ripped envelope reveal that the message caused deep sorrow or distress.",
    target: "Deductive Inference: Subtext"
  },
  {
    passage: "The mechanic wiped his greasy hands on a rag, adjusted his goggles, and tapped the vehicle's engine block with a wrench. The engine purred smoothly with a quiet, steady hum.",
    question: "What had the mechanic just accomplished?",
    options: [
      "He broke the engine beyond repair",
      "He successfully repaired and tuned the engine",
      "He ran out of tools and gave up",
      "He decided to scrap the car for metal"
    ],
    answer: "He successfully repaired and tuned the engine",
    hint: "A purring, steady hum indicates a healthy, functioning engine.",
    solution: "An engine running with a smooth, quiet hum after a mechanic's work shows that the repair was successful.",
    target: "Situational Inference: Outcomes"
  },
  {
    passage: "The runner looked up at the digital clock at the 40-kilometer mark, broke into a wide smile, and began waving enthusiastically to the cheering crowds lining the stadium route.",
    question: "What did the digital clock reveal to the runner?",
    options: [
      "That she was far behind the qualifying time and had lost the race",
      "That she was on pace to win or set a record time",
      "That the race had been cancelled due to weather",
      "That the clock had stopped working"
    ],
    answer: "That she was on pace to win or set a record time",
    hint: "Smiling and waving to cheering spectators while nearing the finish implies success.",
    solution: "Smiling and waving at the 40 km mark (near the end of a 42 km marathon) indicates that the runner saw a winning or record time on the clock.",
    target: "Deductive Inference: Motivation"
  },
  {
    passage: "The customer pushed the bowl of soup away after a single spoonful, grimaced with puckered lips, and immediately drank an entire tall glass of cold water.",
    question: "What was wrong with the soup according to the customer's reaction?",
    options: [
      "The soup was completely cold and tasteless",
      "The soup was excessively salty, sour, or intensely spicy",
      "The soup was delicious and perfectly seasoned",
      "The customer was not hungry at all"
    ],
    answer: "The soup was excessively salty, sour, or intensely spicy",
    hint: "Grimacing with puckered lips and downing water immediately indicates overpowering taste or heat.",
    solution: "Puckering lips and chugging cold water after one spoonful points to an overwhelming taste like excessive salt, pepper, or acid.",
    target: "Sensory Inference: Reactions"
  },
  {
    passage: "The young apprentice carefully held the magnifying eyepiece in place, used delicate brass tweezers to position a tiny hairspring, and gently oiled the miniature cog wheels.",
    question: "What craft or profession is the apprentice learning?",
    options: [
      "Blacksmithing heavy iron gates",
      "Watchmaking or fine horology",
      "Bricklaying on construction sites",
      "Commercial deep-sea fishing"
    ],
    answer: "Watchmaking or fine horology",
    hint: "Tweezers, magnifying eyepieces, hairsprings, and miniature cogs are watchmaker tools.",
    solution: "Using magnifying loupes, tweezers, hairsprings, and microscopic cogs characterizes watchmaking and precision mechanical repairs.",
    target: "Contextual Inference: Occupation"
  },
  {
    passage: "The birds suddenly stopped chirping in the forest canopy. Squirrels scurried up tree trunks in frantic silence, and a sudden heavy stillness settled over the undergrowth.",
    question: "What does the sudden silence of the forest animals imply?",
    options: [
      "The animals were preparing for sleep at midnight",
      "A dangerous predator was approaching nearby",
      "The forest was enjoying pleasant morning sunshine",
      "The animals had migrated to another continent"
    ],
    answer: "A dangerous predator was approaching nearby",
    hint: "Wild animals fall silent and seek high shelter when a dangerous hunter approaches.",
    solution: "Sudden collective silence and scurrying to tree heights is an innate defense mechanism signaling the nearby presence of a predator.",
    target: "Behavioral Inference: Threat Cues"
  },
  {
    passage: "The applicant entered the office wearing polished formal shoes, a well-ironed buttoned shirt, and carried his curriculum vitae neatly enclosed in a crisp leather folder.",
    question: "What is the applicant's purpose in visiting this office?",
    options: [
      "He is attending a casual weekend party with friends",
      "He is attending a formal job interview",
      "He is looking for an apartment to rent",
      "He is delivering mail as a dispatch courier"
    ],
    answer: "He is attending a formal job interview",
    hint: "Polished shoes, formal shirt, and a CV in a leather folder signify a job interview.",
    solution: "Professional formal attire paired with carrying a CV indicates preparation for an employment interview.",
    target: "Situational Inference: Purpose"
  },
  {
    passage: "The farmer found several large, round holes dug beneath his hen coop, accompanied by scattered feathers and distinctive long reptilian belly-slide marks in the dust.",
    question: "What predator had raided the hen coop?",
    options: [
      "A pack of stray hunting dogs",
      "A large snake or monitor lizard",
      "A bird of prey flying overhead",
      "A herd of grazing antelopes"
    ],
    answer: "A large snake or monitor lizard",
    hint: "Belly-slide tracks and underground burrow holes are reptilian traits.",
    solution: "Belly slides in the dust and burrowed holes under coops are characteristic traces of large reptiles like monitor lizards or pythons.",
    target: "Deductive Inference: Physical Evidence"
  },
  {
    passage: "The boy's school shorts were torn at the right knee and coated in red dust, his lower lip was swollen, and he refused to tell his older brother why he was crying.",
    question: "What most likely happened to the boy on his way home from school?",
    options: [
      "He won first prize in an academic spelling bee",
      "He had a physical fight or suffered a bad fall on the dusty road",
      "He took a swim in a clean swimming pool",
      "He ate a heavy lunch at the school cafeteria"
    ],
    answer: "He had a physical fight or suffered a bad fall on the dusty road",
    hint: "Torn knees, red dust, swollen lips, and tears point to an accident or a fight.",
    solution: "Dusty, torn clothing, facial injuries, and crying indicate a physical scuffle or a hard tumble on an unpaved road.",
    target: "Situational Inference: Prior Events"
  },
  {
    passage: "The pilot announced that the aircraft was entering a holding pattern and would circle the destination airport for forty minutes because heavy thunderstorms had reduced visibility on the tarmac to zero.",
    question: "Why was the aircraft unable to land immediately?",
    options: [
      "The airplane had run out of jet fuel",
      "Severe weather made landing on the runway dangerous due to zero visibility",
      "The airport had closed permanently",
      "The passengers asked to view the city lights longer"
    ],
    answer: "Severe weather made landing on the runway dangerous due to zero visibility",
    hint: "Connect thunderstorms, zero runway visibility, and circling in a holding pattern.",
    solution: "Zero visibility caused by storm conditions creates landing hazards, forcing aircraft to circle until weather improves.",
    target: "Causal Inference: Operational Decisions"
  },
  {
    passage: "The merchant looked down at the currency note, held it up against the bright midday sun to inspect the watermark, and rubbed the raised intaglio ink with his thumb before putting it in his cash drawer.",
    question: "Why did the merchant inspect the currency note so carefully?",
    options: [
      "He wanted to see if the note was dirty",
      "He was verifying that the note was genuine and not counterfeit",
      "He was admiring the artistic portrait of the president",
      "He had never seen a currency note before"
    ],
    answer: "He was verifying that the note was genuine and not counterfeit",
    hint: "Holding notes to sunlight for watermarks and feeling raised ink are tests for authentic money.",
    solution: "Checking watermarks against sunlight and feeling intaglio ink are standard methods for detecting counterfeit currency.",
    target: "Behavioral Inference: Motivation"
  },
  {
    passage: "The village well produced only a thick, rusty sludge when the handle was pumped. Women stood around the concrete apron with empty aluminum basins, murmuring among themselves with troubled faces.",
    question: "What crisis is confronting the village?",
    options: [
      "An acute shortage of drinking water due to well failure",
      "An excess of clean spring water flooding the streets",
      "A dispute over who owns the aluminum basins",
      "A disagreement over school fees"
    ],
    answer: "An acute shortage of drinking water due to well failure",
    hint: "Rusty sludge from the pump and empty basins point to a broken water supply.",
    solution: "Pumping only mud or sludge and holding empty basins shows that the community water supply has failed, creating a water crisis.",
    target: "Situational Inference: Community Crisis"
  },
  {
    passage: "The traveler checked his compass, looked up at the position of the sun in the western sky, and noticed that the moss on the tree trunks grew on the side facing away from him.",
    question: "What is the traveler trying to accomplish?",
    options: [
      "He is looking for wild honey in the trees",
      "He is determining his cardinal direction to avoid getting lost",
      "He is preparing to build a timber house",
      "He is searching for wild fruit to eat"
    ],
    answer: "He is determining his cardinal direction to avoid getting lost",
    hint: "Using compasses, solar positions, and moss growth are navigational techniques.",
    solution: "Observing sun position, moss growth, and checking a compass are navigational methods used to determine direction and course.",
    target: "Behavioral Inference: Intent"
  },
  {
    passage: "The student opened the envelope containing his national examination results. His hands began to shake, a wide grin spread across his face, and he ran into the street shouting with joy.",
    question: "What did the results slip reveal?",
    options: [
      "He failed every subject on the examination",
      "He passed with outstanding or excellent grades",
      "His results were withheld by the examination council",
      "He was disqualified from graduating"
    ],
    answer: "He passed with outstanding or excellent grades",
    hint: "Shaking hands, a wide grin, and running into the street shouting with joy indicate success.",
    solution: "Ecstatic celebrations and shouting with joy after viewing results signify outstanding academic performance.",
    target: "Deductive Inference: Outcomes"
  },
  {
    passage: "The librarian walked toward the study table, placed her index finger across her lips, and pointed to the large painted wooden sign on the wall behind the students.",
    question: "What does the sign on the wall most likely say?",
    options: [
      "'Cafeteria and Hot Meals'",
      "'Silence Please — Quiet Study Zone'",
      "'Loud Music Allowed'",
      "'Soccer Practice at 4 PM'"
    ],
    answer: "'Silence Please — Quiet Study Zone'",
    hint: "A finger on the lips is a universal non-verbal gesture for quiet.",
    solution: "Placing a finger to lips signals silence, implying that the wall sign requests quiet in the library.",
    target: "Non-Verbal Inference: Library Decorum"
  },
  {
    passage: "The elderly man leaned heavily on his carved walking stick, paused at every third step to catch his breath, and placed a trembling hand on his lower back with a grimace.",
    question: "What physical condition is the elderly man dealing with?",
    options: [
      "High athletic fitness and speed",
      "Physical frailty, joint fatigue, or chronic back pain",
      "Extreme cold weather shivering",
      "Excitement over winning a foot race"
    ],
    answer: "Physical frailty, joint fatigue, or chronic back pain",
    hint: "Relying on a stick, pausing every three steps, and grimacing while touching the lower back indicates pain.",
    solution: "Frequent pauses to breathe, grimacing, and leaning on a walking stick show physical frailty and chronic pain.",
    target: "Physical Inference: Health State"
  },
  {
    passage: "The fisherman pulled up his net and found it surprisingly light. Upon examining the mesh, he found a gaping hole with jagged, cut cords and several sharp shark teeth caught in the webbing.",
    question: "What happened to the fisherman's net while submerged in the water?",
    options: [
      "It became caught on a coral reef without any fish",
      "A large shark bit through the netting and escaped with the catch",
      "The net dissolved because of seawater salt",
      "Other fishermen stole the net with knives"
    ],
    answer: "A large shark bit through the netting and escaped with the catch",
    hint: "Jagged tears and shark teeth embedded in the cords tell the story.",
    solution: "Torn mesh containing embedded shark teeth proves that a shark bit through the netting to escape or feed.",
    target: "Situational Inference: Evidence"
  },
  {
    passage: "The seamstress removed the pins from the dress, turned the hem upward by two inches, and pinned it in place while asking the client to inspect the length in the mirror.",
    question: "What modification was the seamstress making to the dress?",
    options: [
      "She was making the dress longer",
      "She was shortening the dress to fit the client's height",
      "She was changing the dress's color",
      "She was adding heavy sleeves"
    ],
    answer: "She was shortening the dress to fit the client's height",
    hint: "Turning the hem upward by two inches shortens the overall length.",
    solution: "Folding a hem upward reduces the distance to the floor, shortening the garment to match the wearer's height.",
    target: "Contextual Inference: Procedure"
  },
  {
    passage: "The stadium gates were locked with heavy chains. Handbills pasted across the ticket booths read 'Match Postponed — Unplayable Pitch' above pools of standing water on the field.",
    question: "Why was the soccer match called off?",
    options: [
      "The players refused to play without new jerseys",
      "Heavy rains had waterlogged and flooded the playing field",
      "The stadium lights ran out of electricity",
      "Both teams forgot to bring their soccer balls"
    ],
    answer: "Heavy rains had waterlogged and flooded the playing field",
    hint: "Connect 'Unplayable Pitch' with pools of standing water on the field.",
    solution: "Standing water flooding a pitch renders it unplayable and hazardous, necessitating a match postponement.",
    target: "Causal Inference: Environmental Reasons"
  },
  {
    passage: "The young girl looked down at the shattered clay water pot on the kitchen floor, listened to her mother's approaching footsteps in the corridor, and quickly ducked behind the wooden wardrobe.",
    question: "Why did the girl hide behind the wardrobe?",
    options: [
      "She was playing hide-and-seek with her sister",
      "She feared her mother's anger and punishment for breaking the pot",
      "She wanted to surprise her mother with a gift",
      "The wardrobe was the coolest spot in the room"
    ],
    answer: "She feared her mother's anger and punishment for breaking the pot",
    hint: "Breaking a valuable household item and hiding upon hearing footsteps indicates fear of punishment.",
    solution: "Hiding immediately after breaking a household pot upon hearing an adult approach shows fear of reprimand.",
    target: "Behavioral Inference: Motives"
  },
  {
    passage: "The driver switched off his headlights, cut the engine, and allowed the vehicle to coast silently down the dark dirt road toward the darkened warehouse without making a sound.",
    question: "What does the driver's stealthy approach suggest about his intentions?",
    options: [
      "He was trying to save battery power because his alternator was broken",
      "He was attempting to arrive secretly without being detected",
      "He had forgotten how to turn on the vehicle's lights",
      "He was testing the vehicle's brake pads"
    ],
    answer: "He was attempting to arrive secretly without being detected",
    hint: "Cutting lights and engine to coast silently in the dark indicates clandestine behavior.",
    solution: "Approaching in the dark with lights off and engine silenced points to stealthy or clandestine intent to avoid detection.",
    target: "Character Inference: Subtext"
  },
  {
    passage: "The farmer noticed that the leaves of his cocoa trees were covered with fine white cobwebs, accompanied by thousands of tiny red insects sucking sap from the tender stems.",
    question: "What problem is confronting the farmer's cocoa trees?",
    options: [
      "A severe insect pest infestation threatening crop health",
      "The trees are producing cotton for textile harvesting",
      "The trees are receiving too much irrigation water",
      "The cocoa beans are already ripe for chocolate making"
    ],
    answer: "A severe insect pest infestation threatening crop health",
    hint: "Cobwebs and sap-sucking insects on stems are agricultural pest markers.",
    solution: "Dense webs and sap-sucking insects on plant stems indicate a destructive pest infestation that threatens tree viability.",
    target: "Situational Inference: Agriculture"
  },
  {
    passage: "The boy stood before the class with downcast eyes, shifting his weight from foot to foot, and mumbled inaudible words when the teacher asked why his homework was unfinished.",
    question: "What can be deduced about the boy's excuse?",
    options: [
      "He had a brilliant, verified excuse that impressed the teacher",
      "He had no valid excuse and felt embarrassed or guilty",
      "He was proud of not doing the homework",
      "He was speaking a foreign language taught in school"
    ],
    answer: "He had no valid excuse and felt embarrassed or guilty",
    hint: "Downcast eyes, shifting feet, and inaudible mumbling show embarrassment and lack of an excuse.",
    solution: "Avoiding eye contact, mumbling incoherently, and restless shifting indicate guilt and embarrassment over missing work.",
    target: "Behavioral Inference: Guilt & Embarrassment"
  },
  {
    passage: "The bird flew back and forth from the hedge to the high branch, carrying small twigs, dry grass blades, and discarded feathers in its beak.",
    question: "What activity was the bird engaged in?",
    options: [
      "Gathering food for its winter hibernation",
      "Constructing a nest for laying eggs and sheltering young",
      "Cleaning the lawn for the homeowner",
      "Playing a game with other forest birds"
    ],
    answer: "Constructing a nest for laying eggs and sheltering young",
    hint: "Collecting twigs, dried grass, and feathers is nest-building behavior.",
    solution: "Transporting twigs, dried grass, and soft feathers is classic avian nest-building behavior.",
    target: "Deductive Inference: Natural Behavior"
  },
  {
    passage: "The boy had a circular bruise on his forehead, his knuckles were scraped raw, and he avoided looking at his father when asked how his soccer jersey had become torn.",
    question: "What can be inferred about how the boy's jersey was damaged?",
    options: [
      "The jersey was torn on a washing line while drying",
      "The boy was involved in a rough physical altercation or fight",
      "The jersey was damaged by moths in the closet",
      "The boy bought the jersey second-hand from the market"
    ],
    answer: "The boy was involved in a rough physical altercation or fight",
    hint: "Raw knuckles, bruised forehead, torn jersey, and evasive behavior signify a fight.",
    solution: "Bruises, scraped knuckles, and evasiveness when questioned about torn clothing strongly imply a physical fight.",
    target: "Situational Inference: Conflict"
  },
  {
    passage: "The doctor removed the plaster cast from the boy's forearm, tested his wrist flexibility by gently rotating it, and nodded with satisfaction when the boy moved his fingers without pain.",
    question: "What does the doctor's reaction indicate about the boy's arm?",
    options: [
      "The bone had healed properly and recovery was complete",
      "The bone was still broken and needed emergency surgery",
      "The boy would never be able to use his fingers again",
      "The cast had been placed on the wrong arm"
    ],
    answer: "The bone had healed properly and recovery was complete",
    hint: "Removing a cast and nodding with satisfaction after painless movement shows successful healing.",
    solution: "Painless joint rotation and a doctor's satisfied nod after cast removal confirm that the bone fracture has healed.",
    target: "Situational Inference: Medical Recovery"
  },
  {
    passage: "The traveler found that the desert tracks had vanished beneath smooth, wind-rippled sand dunes. The midday sun was directly overhead, offering no shadows to determine cardinal directions.",
    question: "What dangerous predicament does the traveler face?",
    options: [
      "The traveler is in immediate danger of being arrested",
      "The traveler is completely lost with no visible landmarks or direction markers",
      "The traveler is about to enter an air-conditioned city hotel",
      "The traveler has too many maps to read"
    ],
    answer: "The traveler is completely lost with no visible landmarks or direction markers",
    hint: "Erased tracks, featureless dunes, overhead sun, and lack of shadows mean lost bearings.",
    solution: "Erased tracks, lack of shadows from an overhead sun, and uniform sand dunes indicate that the traveler is lost without navigational cues.",
    target: "Situational Inference: Peril"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH SOLAR MINI-GRID PASSAGE (51 TO 55)
// =========================================================================
const capstone5B8IntermediateQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 1, why had state utility agencies refused to extend the national electricity grid to island communities on Lake Volta?",
    options: [
      "Because islanders refused to use electricity",
      "Because running underwater high-voltage cables across wide water expanses was deemed commercially unviable",
      "Because solar panels were banned in Ghana",
      "Because there were no human settlements on the islands"
    ],
    answer: "Because running underwater high-voltage cables across wide water expanses was deemed commercially unviable",
    hint: "Review paragraph 1 regarding the commercial feasibility of underwater cabling.",
    solution: "Paragraph 1 states that underwater cables were 'deemed commercially unviable by state utility agencies' due to vast water expanses.",
    target: "Capstone Exam: Literal Fact Retrieval"
  },
  {
    questionNumber: 52,
    question: "What life-threatening medical challenge did island health clinics face prior to the solar mini-grid installation according to paragraph 2?",
    options: [
      "They could not perform open-heart surgeries on islands",
      "They could not refrigerate essential vaccines and antivenom serums for snakebite victims",
      "They had no clean cotton bandages or medical scissors",
      "Doctors refused to travel by water"
    ],
    answer: "They could not refrigerate essential vaccines and antivenom serums for snakebite victims",
    hint: "Scan paragraph 2 for the consequences of lacking cold-chain refrigeration.",
    solution: "Paragraph 2 notes outposts were 'incapable of operating cold-chain refrigeration units to store temperature-sensitive childhood vaccines and antivenom serums.'",
    target: "Capstone Exam: Cause and Effect"
  },
  {
    questionNumber: 53,
    question: "As used in paragraph 3, what is the meaning of the word 'gouging' ('eliminating exploitative price gouging by middlemen')?",
    options: [
      "Selling fresh fish at a substantial loss",
      "Overcharging or setting unfairly exorbitant, predatory prices",
      "Donating free food to impoverished families",
      "Weighing goods accurately on digital scales"
    ],
    answer: "Overcharging or setting unfairly exorbitant, predatory prices",
    hint: "Look at the context of exploitative middlemen taking advantage of unchilled fish.",
    solution: "In this commercial context, price 'gouging' refers to predatory, unfair pricing imposed when buyers have an unfair advantage over perishable goods.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    questionNumber: 54,
    question: "What can be inferred about the broader economic relationship between mainland middlemen and island fishermen prior to solar refrigeration?",
    options: [
      "Middlemen paid fishermen generous bonuses every week",
      "Middlemen exploited fishermen's lack of refrigeration by offering unfairly low prices before fish spoiled",
      "Fishermen refused to sell fish to anyone from the mainland",
      "Both groups shared profits equally through government cooperatives"
    ],
    answer: "Middlemen exploited fishermen's lack of refrigeration by offering unfairly low prices before fish spoiled",
    hint: "Connect perishable unchilled fish, rapid spoilage, and the power of middlemen.",
    solution: "Without refrigeration, fishermen were forced to sell immediately at whatever deflated price middlemen offered before their catch rotted, resulting in exploitation.",
    target: "Capstone Exam: Deductive Inference"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state how island communities fund ongoing mini-grid maintenance in paragraph 4.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Domestic mobile-money tariffs fund preventive maintenance.",
      "Funding preventive maintenance and spare-part replenishment through token systems.",
      "Because solar equipment breaks down, island communities collect money through mobile phones.",
      "Mobile-money tokens."
    ],
    answer: "Domestic mobile-money tariffs fund preventive maintenance.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Domestic mobile-money tariffs fund preventive maintenance' is exactly 6 words, possesses complete Subject-Verb-Object syntax, and answers the prompt directly. Option B is a participial fragment (0 marks).",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB8Intermediate() {
  console.log("Building 55 UNIQUE questions for Basic 8 Intermediate...");
  const db = await getDb();

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50B8IntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_I_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B8",
      difficulty: "intermediate",
      questionNumber: qNum,
      isCapstoneExamPassage: false,
      passageText: item.passage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.2.1.1: Draw valid deductive inferences, interpret underlying subtext, and identify implicit motivations."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8IntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${solarMiniGridFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_I_${item.questionNumber}`,
      level: "B8",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: solarMiniGridFullPassage,
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

  // 3. Write to subcollection B8_intermediate across all paths
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B8_intermediate`);
    await targetDoc.set({
      level: "B8",
      difficulty: "intermediate",
      title: "Basic 8 Intermediate Lab: 50 Unique Inference Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (Deductive Inferences & Subtext) + 5 Capstone Full-Passage Questions",
        passageVisibility: "Passage embedded both in passageText and at the top of prompt",
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${targetDoc.path}`);
  }

  // 4. Synchronize into main topical document practicePool.medium for TopicalLabRunner (level: b8)
  console.log("\nSynchronizing main topical document practicePool.medium for b8 (keeping b7, b8, b9 only)...");
  const mappedMediumQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'medium' as const,
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
            medium: mappedMediumQuestions
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
      console.log(`✅ Updated main document practicePool.medium for b8 at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B8 Intermediate!`);
}

deployUniqueB8Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B8 Intermediate:", err);
    process.exit(1);
  });

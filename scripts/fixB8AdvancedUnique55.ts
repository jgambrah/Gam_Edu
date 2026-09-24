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
  difficulty: "advanced";
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
const nationalTheatreFullPassage = 
`Rising majestically above the central urban intersection of Liberia Road and Independence Avenue in Accra, the National Theatre of Ghana stands as an audacious monument of modernist civic architecture. Commissioned in 1992 through bilateral cultural diplomacy between the governments of Ghana and the People's Republic of China, the complex was engineered to provide a monumental permanent sanctuary for national dramatic arts, orchestral music, and choreography.

From an aesthetic perspective, the building's exterior silhouette represents a daring departure from traditional colonial masonry. Conceived by Chinese architects Cheng Taining and Ye Xianghan in close collaboration with Ghanaian artisans, the dramatic sweeping rooflines evoke the curvilinear grace of an oceanic vessel navigating surging ocean waves, or alternatively, a giant sea bird extending its wings in soaring flight. Rather than mimicking sterile European rectilinear concrete blocks, the building deliberately integrates the fiery rhythms, energetic sweeps, and dramatic kinetic gestures intrinsic to traditional West African dance choreographies.

Beyond its striking external envelope, the theatre represents an acoustic and spatial masterpiece designed to foster civic solidarity. Housing three distinguished resident artistic institutions—the National Symphony Orchestra, the National Dance Company, and the National Theatre Players—its massive 1,490-seat central auditorium incorporates undulating clay surfaces and calculated interior contours that eliminate acoustic distortion. By serving as an accessible democratic forum where traditional folklore converges with contemporary post-colonial theatrical drama, the edifice celebrates indigenous artistic identity.

However, three decades of relentless tropical humidity, marine sea-salt aerosols from the adjacent Gulf of Guinea, and inconsistent budgetary subventions have threatened the structural preservation of this cultural temple. Preserving this architectural treasure demands consistent engineering retrofitting, modernized stage technology, and institutionalized maintenance funding to ensure that future generations inherit this vibrant cathedral of African artistic expression.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B8AdvancedDrills = [
  {
    passage: "The politician mounted the rostrum, showering the crowd with lavish promises of gold-paved streets and free mansions for all. The sensible villagers merely shook their heads at this cosmetic circus.",
    question: "What is the author's tone toward the politician's campaign promises?",
    options: [
      "Adoring and deeply respectful",
      "Skeptical, critical, and mocking",
      "Objective and scientifically neutral",
      "Fearful and intimidated"
    ],
    answer: "Skeptical, critical, and mocking",
    hint: "Words like 'lavish promises' and 'cosmetic circus' reveal the author's attitude.",
    solution: "Describing promises as 'gold-paved streets' and branding the rally a 'cosmetic circus' conveys deep cynicism, skepticism, and mockery.",
    target: "Author's Tone: Skepticism"
  },
  {
    passage: "The abandoned colonial mansion stood shrouded in thick nocturnal mist. Broken shutters banged against rotted timbers in the whistling wind, like skeletal fingers clawing at the dark.",
    question: "What mood does the author evoke in this descriptive passage?",
    options: [
      "Joyful and celebratory",
      "Eerie, suspenseful, and ominous",
      "Peaceful and relaxing",
      "Humorous and cheerful"
    ],
    answer: "Eerie, suspenseful, and ominous",
    hint: "Identify the emotional atmosphere created by nocturnal mist, rotted timbers, and skeletal fingers.",
    solution: "Imagery of rotted wood, howling wind, and skeletal fingers creates an eerie, tense, and ominous atmosphere in the reader's mind.",
    target: "Literary Mood: Suspense & Dread"
  },
  {
    passage: "Examine the expression: 'The prosecutor described the corporate embezzlement as a cancer eating away at the economic vitals of the municipality.'",
    question: "What figure of speech is employed in the underlined expression, and what is its contextual meaning?",
    options: [
      "Simile; meaning the municipality needs medical doctors immediately",
      "Metaphor; meaning the corruption is an insidious, destructive evil destroying the town's wealth",
      "Hyperbole; meaning municipal funds were spent on cancer research",
      "Personification; meaning money has the power to talk"
    ],
    answer: "Metaphor; meaning the corruption is an insidious, destructive evil destroying the town's wealth",
    hint: "Direct comparison equating embezzlement to a destructive disease without using 'like' or 'as'.",
    solution: "The phrase directly compares financial embezzlement to a malignant disease (cancer) without comparative words, making it a metaphor denoting destruction.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The logging company's glossy brochure claimed they were 'responsibly grooming the forest canopy,' yet satellite photographs revealed thousands of hectares of completely bulldozed, charred wasteland.",
    question: "What literary device is present between the company's claim and the satellite reality?",
    options: [
      "Irony (Discrepancy between stated claim and harsh reality)",
      "Alliteration (Repetition of consonant sounds)",
      "Onomatopoeia (Sound imitation)",
      "Apostrophe (Addressing an absent person)"
    ],
    answer: "Irony (Discrepancy between stated claim and harsh reality)",
    hint: "Notice the sharp contradiction between what was claimed and the actual reality.",
    solution: "The stark contrast between the deceptive corporate claim of environmental stewardship and the factual photographic evidence of devastation constitutes situational irony.",
    target: "Literary Devices: Irony"
  },
  {
    passage: "The fiery sun beat down mercilessly upon the desert travelers, an angry furnace in the cloudless sky that baked the cracked clay until it groaned.",
    question: "What figure of speech is used in the phrase 'that baked the cracked clay until it groaned'?",
    options: [
      "Personification (Attributing the human sensation of groaning to inanimate clay)",
      "Euphemism (Softening harsh words)",
      "Oxymoron (Juxtaposing contradictory words)",
      "Pun (Humorous word play)"
    ],
    answer: "Personification (Attributing the human sensation of groaning to inanimate clay)",
    hint: "Can clay literally 'groan' in pain?",
    solution: "Giving inanimate, cracked clay the human ability to 'groan' in pain under excessive heat is an example of personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The headmaster's voice was like rolling thunder as he addressed the delinquent students, shaking the very glass louvers of the assembly hall.",
    question: "What figure of speech is employed in the phrase 'voice was like rolling thunder'?",
    options: [
      "Metaphor",
      "Simile",
      "Irony",
      "Understatement"
    ],
    answer: "Simile",
    hint: "Identify the explicit comparison using the word 'like'.",
    solution: "Comparing the loud, booming voice to rolling thunder using the preposition 'like' makes the phrase a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The municipal audit report was cold, clinical, and detached. It listed missing receipts in chronological tables without adjectives, letting the bare figures speak for themselves.",
    question: "What is the author's tone in this passage?",
    options: [
      "Objective, neutral, and matter-of-fact",
      "Passionate and full of outrage",
      "Sarcastic and humorous",
      "Sympathetic and apologetic"
    ],
    answer: "Objective, neutral, and matter-of-fact",
    hint: "Words like 'clinical', 'detached', and 'bare figures without adjectives' indicate impartiality.",
    solution: "A clinical presentation relying strictly on unembellished figures denotes an objective, neutral, and detached tone.",
    target: "Author's Tone: Objectivity"
  },
  {
    passage: "The old widow waited patiently in the dilapidated government clinic for six hours, only to be told by a yawning clerk that the doctor had left early to play tennis.",
    question: "What emotional mood or reaction does this situation evoke in the reader?",
    options: [
      "Amusement and joy",
      "Indignation, frustration, and sympathy",
      "Deep relief and contentment",
      "Terror and panic"
    ],
    answer: "Indignation, frustration, and sympathy",
    hint: "Consider how a reader feels when a vulnerable elder is neglected by an indifferent civil servant.",
    solution: "The contrast between an elderly patient's prolonged suffering and the clerk's casual apathy evokes indignation and moral frustration.",
    target: "Literary Mood: Indignation"
  },
  {
    passage: "The warrior fought bravely, a raging lion on the battlefield who tore through the ranks of the enemy without flinching.",
    question: "What figure of speech is used in calling the warrior 'a raging lion'?",
    options: [
      "Simile",
      "Metaphor",
      "Personification",
      "Euphemism"
    ],
    answer: "Metaphor",
    hint: "A direct identification equating the warrior to a lion without using 'like' or 'as'.",
    solution: "Directly describing the fighter as 'a raging lion' without comparative connectives constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The drought had lasted so long that even the ancient riverbed had forgotten what moving water felt like, gaping dryly at the scorching clouds.",
    question: "What literary device is present in the phrase 'the riverbed had forgotten what moving water felt like'?",
    options: [
      "Personification",
      "Hyperbole",
      "Alliteration",
      "Synecdoche"
    ],
    answer: "Personification",
    hint: "Attributing the cognitive human faculty of 'remembering or forgetting' to a physical riverbed.",
    solution: "Giving a geological riverbed the human psychological capacity of memory and forgetting is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The fire station was situated at the end of the avenue. Ironically, while firefighters were away celebrating Fire Prevention Week, their own wooden headquarters caught fire and burned to the ground.",
    question: "What literary device characterizes this event?",
    options: [
      "Dramatic hyperbole",
      "Situational irony",
      "Poetic justice",
      "Metaphorical exaggeration"
    ],
    answer: "Situational irony",
    hint: "Consider the contrast between an agency dedicated to extinguishing fires having its own station burn down.",
    solution: "A fire station catching fire while its staff promotes fire safety is a classic manifestation of situational irony.",
    target: "Literary Devices: Irony"
  },
  {
    passage: "The boy carried a school bag that weighed at least a million kilograms, bending his slender spine double under its colossal weight.",
    question: "What figure of speech is used to describe the weight of the bag?",
    options: [
      "Understatement",
      "Hyperbole",
      "Metaphor",
      "Oxymoron"
    ],
    answer: "Hyperbole",
    hint: "Can a child's school bag literally weigh one million kilograms?",
    solution: "Claiming a school bag weighs a million kilograms is a deliberate, dramatic exaggeration for effect, known as hyperbole.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "The editorial condemned the municipal sanitation board as 'an unmitigated disgrace that feasts on taxpayers' money while residents choke on mountainous garbage heaps.'",
    question: "What tone is displayed by the writer in this editorial excerpt?",
    options: [
      "Admiring and congratulatory",
      "Fiercely indignant, scathing, and condemnatory",
      "Cautious and hesitant",
      "Whimsical and light-hearted"
    ],
    answer: "Fiercely indignant, scathing, and condemnatory",
    hint: "Phrases like 'unmitigated disgrace' and 'feasts on taxpayers' money' show fierce anger.",
    solution: "Diction such as 'unmitigated disgrace' and 'feasts on taxpayers' money' communicates a scathing, indignant, and condemnatory tone.",
    target: "Author's Tone: Scathing Indignation"
  },
  {
    passage: "The night wrapped the sleepy fishing village in a velvet cloak of darkness, whispering lullabies through the gentle rustle of coconut palm fronds.",
    question: "What mood does the author evoke in this descriptive excerpt?",
    options: [
      "Serene, tranquil, and comforting",
      "Frantic, anxious, and chaotic",
      "Terrifying and menacing",
      "Boring and depressing"
    ],
    answer: "Serene, tranquil, and comforting",
    hint: "Imagery like 'velvet cloak', 'gentle rustle', and 'whispering lullabies' sets a calming mood.",
    solution: "Images of a soft velvet cloak, whispering palms, and lullabies create a peaceful, tranquil, and soothing mood.",
    target: "Literary Mood: Tranquility"
  },
  {
    passage: "The speaker praised the brave nurse who stepped into the cholera ward, describing her as 'an angel of mercy walking fearlessly through the valley of the shadow of death.'",
    question: "What figure of speech is used in calling the nurse 'an angel of mercy'?",
    options: [
      "Metaphor",
      "Simile",
      "Apostrophe",
      "Euphemism"
    ],
    answer: "Metaphor",
    hint: "Direct identification of the nurse as an angel without 'like' or 'as'.",
    solution: "Equating the nurse directly to an angel without comparative connectives constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The car's ancient engine coughed, spat black soot from its rusted tailpipe, and shuddered violently before dying in the middle of the crowded roundabout.",
    question: "What literary device is employed when the engine 'coughed, spat black soot, and shuddered violently'?",
    options: [
      "Personification",
      "Litotes",
      "Synecdoche",
      "Chiasmus"
    ],
    answer: "Personification",
    hint: "Attributing human involuntary biological actions (coughing, spitting) to a mechanical engine.",
    solution: "Describing an engine as coughing, spitting, and shuddering attributes human physical actions to a machine, which is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The defense attorney smiled warmly at the witness, yet her cross-examination questions were razor blades disguised in honeyed words, slicing through his alibi.",
    question: "What figure of speech is used in 'razor blades disguised in honeyed words'?",
    options: [
      "Simile",
      "Metaphor",
      "Onomatopoeia",
      "Alliteration"
    ],
    answer: "Metaphor",
    hint: "Directly describing sharp questions as razor blades wrapped in honey.",
    solution: "Calling incisive questions 'razor blades disguised in honeyed words' without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The minister assured the parliament that national debt was 'merely a temporary fiscal recalibration,' while inflation soared past forty percent.",
    question: "What rhetorical device is the minister employing in using the phrase 'temporary fiscal recalibration'?",
    options: [
      "Hyperbole",
      "Euphemism (Softening a harsh financial reality with bureaucratic terminology)",
      "Personification",
      "Oxymoron"
    ],
    answer: "Euphemism (Softening a harsh financial reality with bureaucratic terminology)",
    hint: "Notice how complex, mild-sounding words are used to downplay severe national debt.",
    solution: "Using a polite, mild, or roundabout term to mask a harsh financial crisis is an example of euphemism.",
    target: "Rhetorical Devices: Euphemism"
  },
  {
    passage: "The author concluded his travelogue: 'Accra is an intoxicating tapestry of blaring horns, fragrant street food, brilliant kente colors, and warm hospitality.'",
    question: "What figure of speech is used in calling the city 'an intoxicating tapestry'?",
    options: [
      "Metaphor",
      "Simile",
      "Irony",
      "Pun"
    ],
    answer: "Metaphor",
    hint: "Direct identification of a multi-faceted city as a woven fabric (tapestry).",
    solution: "Directly calling the city a woven tapestry of sensory experiences without 'like' or 'as' is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The surgeon emerged from the twelve-hour operation and whispered: 'That was a rather minor procedure,' as sweat poured down his exhausted face.",
    question: "What figure of speech is present in calling a grueling twelve-hour surgery 'a rather minor procedure'?",
    options: [
      "Hyperbole",
      "Understatement (Litotes)",
      "Metaphor",
      "Personification"
    ],
    answer: "Understatement (Litotes)",
    hint: "Deliberately minimizing the seriousness or difficulty of a massive twelve-hour operation.",
    solution: "Minimizing an exhausting, critical twelve-hour operation as 'minor' is a deliberate understatement.",
    target: "Figurative Language: Understatement"
  },
  {
    passage: "The ocean waved its white crests at the beachgoers, inviting them into its cool, refreshing turquoise depths.",
    question: "What literary device is used in the phrase 'The ocean waved its white crests... inviting them'?",
    options: [
      "Personification",
      "Metaphor",
      "Irony",
      "Hyperbole"
    ],
    answer: "Personification",
    hint: "Can the ocean literally 'wave' a hand or 'invite' people like a human host?",
    solution: "Attributing social human actions like waving and extending invitations to ocean waves is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The politician's speech was honey on the lips but venom in the heart, charming the listeners while preparing to take their land.",
    question: "What literary device is found in the contrasting imagery 'honey on the lips but venom in the heart'?",
    options: [
      "Antithesis / Contrastive Metaphor",
      "Hyperbole",
      "Simile",
      "Onomatopoeia"
    ],
    answer: "Antithesis / Contrastive Metaphor",
    hint: "Notice the direct contrast between sweet honey and deadly poison placed in opposition.",
    solution: "Balancing two opposing ideas (honey vs. venom) in parallel grammatical structures forms an antithesis.",
    target: "Figurative Language: Antithesis"
  },
  {
    passage: "The market was a swirling whirlpool of screaming vendors, jostling shoppers, and honking wheelbarrows.",
    question: "What figure of speech is used in calling the market 'a swirling whirlpool'?",
    options: [
      "Simile",
      "Metaphor",
      "Personification",
      "Understatement"
    ],
    answer: "Metaphor",
    hint: "Equating the crowded, chaotic market directly to a turbulent body of water without using 'like'.",
    solution: "Comparing the chaotic market directly to a whirlpool without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The teacher warned the tardy boy: 'If you arrive late one more time, I will make you run across the entire African continent on foot!'",
    question: "What figure of speech is the teacher using?",
    options: [
      "Hyperbole",
      "Metaphor",
      "Simile",
      "Irony"
    ],
    answer: "Hyperbole",
    hint: "Can a student literally run across the entire African continent as a school penalty?",
    solution: "Threatening to make someone run across an entire continent is an obvious exaggeration for dramatic emphasis, which is hyperbole.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "The newspaper columnist observed wryly: 'Our municipal leaders are remarkably punctual; they arrive exactly three hours late to every scheduled town hall.'",
    question: "What literary device is the columnist employing?",
    options: [
      "Irony (Sarcasm)",
      "Metaphor",
      "Simile",
      "Personification"
    ],
    answer: "Irony (Sarcasm)",
    hint: "Saying leaders are 'remarkably punctual' while pointing out they are three hours late.",
    solution: "Praising punctuality while demonstrating severe tardiness is verbal irony (sarcasm).",
    target: "Literary Devices: Irony"
  },
  {
    passage: "The dry soil drank the sudden afternoon rain hungrily, thirsting for every drop that fell from the sky.",
    question: "What figure of speech is used when the soil 'drank... hungrily, thirsting for every drop'?",
    options: [
      "Personification",
      "Metaphor",
      "Hyperbole",
      "Simile"
    ],
    answer: "Personification",
    hint: "Attributing human appetite (hunger, thirst, drinking) to soil.",
    solution: "Giving earth human physical sensations like drinking, hungering, and thirsting is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "Her smile was as bright as the morning sun breaking over the eastern mountains of Volta.",
    question: "What figure of speech is used to describe the smile?",
    options: [
      "Simile",
      "Metaphor",
      "Personification",
      "Irony"
    ],
    answer: "Simile",
    hint: "Look for the comparative structure using 'as... as'.",
    solution: "Comparing a smile directly to the morning sun using the construction 'as bright as' creates a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The company spokesman announced: 'We are simply reorganizing personnel to enhance operational synergies,' as two thousand factory workers were dismissed without compensation.",
    question: "What rhetorical device is being used in the phrase 'reorganizing personnel to enhance operational synergies'?",
    options: [
      "Euphemism",
      "Hyperbole",
      "Simile",
      "Apostrophe"
    ],
    answer: "Euphemism",
    hint: "Using soft, clinical business jargon to mask mass layoffs.",
    solution: "Using vague corporate language to disguise mass layoffs is an example of euphemism.",
    target: "Rhetorical Devices: Euphemism"
  },
  {
    passage: "The wind was a howling phantom through the keyhole of the ancient wooden door.",
    question: "What figure of speech is employed in describing the wind as 'a howling phantom'?",
    options: [
      "Metaphor",
      "Simile",
      "Hyperbole",
      "Oxymoron"
    ],
    answer: "Metaphor",
    hint: "Directly equating wind to a phantom without 'like' or 'as'.",
    solution: "Directly identifying the wind as a howling phantom without comparative words is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The examination hall was as silent as a graveyard; not a single cough or rustle of paper could be heard.",
    question: "What figure of speech is used in 'as silent as a graveyard'?",
    options: [
      "Simile",
      "Metaphor",
      "Irony",
      "Euphemism"
    ],
    answer: "Simile",
    hint: "A comparison using 'as... as'.",
    solution: "Comparing the silence of the room to a graveyard using 'as silent as' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The athlete ran with such blinding speed that the stopwatch seemed to stand still in amazement.",
    question: "What two figures of speech are combined in this sentence?",
    options: [
      "Hyperbole and Personification",
      "Simile and Irony",
      "Metaphor and Euphemism",
      "Understatement and Oxymoron"
    ],
    answer: "Hyperbole and Personification",
    hint: "'Blinding speed' is exaggeration; a stopwatch 'standing still in amazement' gives human emotion to a clock.",
    solution: "Exaggerating speed is hyperbole, while giving a stopwatch the human capacity for amazement is personification.",
    target: "Figurative Language: Combined Devices"
  },
  {
    passage: "The author described the slum settlement as 'a festering wound on the polished marble floor of the capital city.'",
    question: "What figure of speech is used to describe the slum?",
    options: [
      "Metaphor",
      "Simile",
      "Personification",
      "Irony"
    ],
    answer: "Metaphor",
    hint: "Directly equating the slum to a festering wound without using comparative words.",
    solution: "Calling the slum a 'festering wound' directly without comparative particles is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The rain fell in endless sheets for forty days and forty nights, washing away everything except the mountain peaks.",
    question: "What literary device is used to emphasize the intensity of the downpour?",
    options: [
      "Hyperbole",
      "Irony",
      "Personification",
      "Understatement"
    ],
    answer: "Hyperbole",
    hint: "Exaggerating rainfall duration and effects to emphasize relentless weather.",
    solution: "Describing rain as falling in endless sheets for 40 days to submerge everything is hyperbolic exaggeration.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "The corrupt official's house was burgled by the very thieves he had accepted bribes to protect from prosecution.",
    question: "What literary device is highlighted in this occurrence?",
    options: [
      "Situational irony",
      "Simile",
      "Hyperbole",
      "Onomatopoeia"
    ],
    answer: "Situational irony",
    hint: "An outcome that directly contradicts what was expected in a meaningful way.",
    solution: "A corrupt official being robbed by the exact criminals he took bribes to shield illustrates situational irony.",
    target: "Literary Devices: Irony"
  },
  {
    passage: "Her laughter was a bubbling brook, clear and joyful, refreshing everyone sitting in the courtyard.",
    question: "What figure of speech is used in calling her laughter 'a bubbling brook'?",
    options: [
      "Metaphor",
      "Simile",
      "Personification",
      "Understatement"
    ],
    answer: "Metaphor",
    hint: "Direct comparison between laughter and a stream without 'like' or 'as'.",
    solution: "Equating laughter directly to a bubbling brook without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The tractor groaned in protest as it attempted to haul the massive mahogany log up the steep muddy embankment.",
    question: "What figure of speech is used in saying the tractor 'groaned in protest'?",
    options: [
      "Personification",
      "Hyperbole",
      "Simile",
      "Irony"
    ],
    answer: "Personification",
    hint: "Attributing human vocal complaint (groaning in protest) to an engine.",
    solution: "Giving a machine human emotional vocalizations (groaning in protest) is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The soldier stood like an unyielding rock amidst the crashing waves of enemy assault.",
    question: "What figure of speech is used in comparing the soldier to 'an unyielding rock'?",
    options: [
      "Simile",
      "Metaphor",
      "Personification",
      "Euphemism"
    ],
    answer: "Simile",
    hint: "Look for the comparison marked by 'like'.",
    solution: "Comparing the soldier's steadfastness to a rock using 'like' makes it a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The government spokesperson explained that the closure of thirty public schools was merely 'a strategic consolidation of academic assets.'",
    question: "What device is being used in calling school closures 'a strategic consolidation of academic assets'?",
    options: [
      "Euphemism",
      "Hyperbole",
      "Simile",
      "Irony"
    ],
    answer: "Euphemism",
    hint: "Substituting a bureaucratic, pleasant phrase for a painful shutdown.",
    solution: "Using grand corporate wording to mask painful school closures is an example of euphemism.",
    target: "Rhetorical Devices: Euphemism"
  },
  {
    passage: "The city never slept; its neon veins pulsed with energy from sunset until the rooster crowed at dawn.",
    question: "What figure of speech is used in the phrase 'its neon veins pulsed with energy'?",
    options: [
      "Metaphor",
      "Simile",
      "Understatement",
      "Irony"
    ],
    answer: "Metaphor",
    hint: "Comparing illuminated city streets directly to circulatory veins pulsing with blood.",
    solution: "Directly describing streets and neon lights as biological 'veins pulsing with energy' is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The news of his scholarship traveled through the village like wildfire, igniting celebrations in every compound.",
    question: "What figure of speech is used in the phrase 'traveled... like wildfire'?",
    options: [
      "Simile",
      "Metaphor",
      "Personification",
      "Irony"
    ],
    answer: "Simile",
    hint: "A comparison using the preposition 'like'.",
    solution: "Comparing the rapid spread of news to a brushfire using 'like' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The elderly judge had a heart of stone; no plea for mercy could soften his sentencing.",
    question: "What figure of speech is used in calling the judge's heart 'a heart of stone'?",
    options: [
      "Metaphor",
      "Simile",
      "Personification",
      "Hyperbole"
    ],
    answer: "Metaphor",
    hint: "Equating an unfeeling attitude directly to hard mineral rock without 'like'.",
    solution: "Describing an unyielding emotional disposition directly as 'stone' is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The thunder shouted angrily across the darkening valley, warning the farmers to take shelter.",
    question: "What literary device is used when the thunder 'shouted angrily'?",
    options: [
      "Personification",
      "Hyperbole",
      "Simile",
      "Irony"
    ],
    answer: "Personification",
    hint: "Giving human emotional vocalization (shouting angrily) to natural weather.",
    solution: "Attributing human emotional yelling to an atmospheric sound is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The child's tears were a torrential river that threatened to drown the entire classroom in sorrow.",
    question: "What figure of speech is used to describe the child's tears?",
    options: [
      "Hyperbole",
      "Understatement",
      "Irony",
      "Simile"
    ],
    answer: "Hyperbole",
    hint: "Exaggerating crying to a river threatening to drown a room.",
    solution: "Claiming tears could drown a room is an extreme exaggeration for dramatic effect (hyperbole).",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "The commercial airliner was an enormous silver bird slicing smoothly through the cotton clouds.",
    question: "What figure of speech is used in calling the airplane 'an enormous silver bird'?",
    options: [
      "Metaphor",
      "Simile",
      "Personification",
      "Irony"
    ],
    answer: "Metaphor",
    hint: "Directly equating an aircraft to an avian bird without using 'like' or 'as'.",
    solution: "Describing an airplane directly as a silver bird is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The guard was as alert as a hawk scanning the field for field mice.",
    question: "What figure of speech is used in comparing the guard to a hawk?",
    options: [
      "Simile",
      "Metaphor",
      "Personification",
      "Euphemism"
    ],
    answer: "Simile",
    hint: "A comparison using 'as... as'.",
    solution: "Comparing alertness to a predatory hawk using 'as alert as' creates a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The author praised the selfless volunteer who spent forty years in rural clinics, calling her 'a solitary candle burning brightly in the deep darkness of poverty.'",
    question: "What figure of speech is used to describe the volunteer?",
    options: [
      "Metaphor",
      "Simile",
      "Hyperbole",
      "Irony"
    ],
    answer: "Metaphor",
    hint: "Directly equating an individual's service to a candle in darkness without 'like'.",
    solution: "Describing a person's life directly as a burning candle in darkness is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The dentist smiled calmly and told the frightened boy: 'This large extraction needle will feel like a tiny mosquito tickle.'",
    question: "What figure of speech is used in describing the needle's pain?",
    options: [
      "Simile (with Understatement)",
      "Metaphor",
      "Irony",
      "Personification"
    ],
    answer: "Simile (with Understatement)",
    hint: "Comparing dental needle pain to an insect tickle using 'like' to minimize pain.",
    solution: "Comparing extraction pain to a mosquito tickle using 'like' combines a simile with deliberate understatement.",
    target: "Figurative Language: Simile & Understatement"
  },
  {
    passage: "The clock on the wall mocked the student as its hands marched relentlessly toward the end of the examination period.",
    question: "What literary device is present when the clock 'mocked the student'?",
    options: [
      "Personification",
      "Simile",
      "Hyperbole",
      "Euphemism"
    ],
    answer: "Personification",
    hint: "Can an inanimate mechanical clock feel or express human mockery?",
    solution: "Attributing human psychological mockery to a timepiece is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The boxer's punch was an explosive lightning bolt that knocked his opponent onto the canvas in the first round.",
    question: "What figure of speech is used in calling the punch 'an explosive lightning bolt'?",
    options: [
      "Metaphor",
      "Simile",
      "Irony",
      "Personification"
    ],
    answer: "Metaphor",
    hint: "Direct identification of a punch as a lightning strike without using 'like' or 'as'.",
    solution: "Calling a punch an explosive lightning bolt directly is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The chief environmental officer remarked: 'Our rivers are sparkling mirrors of pristine purity,' while standing before a river choked with yellowish-brown mining sludge.",
    question: "What literary device is the officer using, either intentionally or through dramatic contrast?",
    options: [
      "Irony (Sarcasm / Sharp contrast between speech and reality)",
      "Simile",
      "Hyperbole",
      "Onomatopoeia"
    ],
    answer: "Irony (Sarcasm / Sharp contrast between speech and reality)",
    hint: "Calling a polluted, sludge-filled river a 'sparkling mirror' contradicts visible reality.",
    solution: "Praising a visibly toxic river as a 'sparkling mirror of purity' is a direct demonstration of verbal or situational irony.",
    target: "Literary Devices: Irony"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH NATIONAL THEATRE PASSAGE (51 TO 55)
// =========================================================================
const capstone5B8AdvancedQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 2, what two natural and dynamic forms are evoked by the sweeping roofline of the National Theatre?",
    options: [
      "A soaring eagle and a mountain ridge",
      "An oceanic vessel riding waves, or a giant sea bird extending its wings in flight",
      "A traditional mud hut and a ceremonial stool",
      "A military fortress and a church steeple"
    ],
    answer: "An oceanic vessel riding waves, or a giant sea bird extending its wings in flight",
    hint: "Scan paragraph 2 for the architectural metaphors comparing the roof to marine life.",
    solution: "Paragraph 2 explicitly states that the rooflines evoke 'the curvilinear grace of an oceanic vessel navigating surging ocean waves, or alternatively, a giant sea bird extending its wings...'",
    target: "Capstone Exam: Architectural Metaphor Analysis"
  },
  {
    questionNumber: 52,
    question: "What cultural principle inspired the building's design instead of standard European rectilinear architecture according to paragraph 2?",
    options: [
      "The layout of ancient Roman colosseums",
      "The fiery rhythms, energetic sweeps, and kinetic gestures of traditional West African dances",
      "Modern American skyscrapers",
      "The structure of medieval stone castles"
    ],
    answer: "The fiery rhythms, energetic sweeps, and kinetic gestures of traditional West African dances",
    hint: "Review paragraph 2 regarding indigenous artistic movements.",
    solution: "Paragraph 2 explains that the architects integrated 'the fiery rhythms, energetic sweeps, and dramatic kinetic gestures intrinsic to traditional West African dance choreographies.'",
    target: "Capstone Exam: Cultural Subtext & Inspiration"
  },
  {
    questionNumber: 53,
    question: "As used in paragraph 3, what does the word 'undulating' mean ('undulating clay surfaces')?",
    options: [
      "Completely flat and rigid like glass",
      "Wavy, having a smooth rising and falling outline",
      "Broken into sharp, jagged fragments",
      "Painted with bright geometric stripes"
    ],
    answer: "Wavy, having a smooth rising and falling outline",
    hint: "Connect the word with acoustic curves that eliminate sound distortion.",
    solution: "In architectural acoustics, 'undulating' describes curved, wave-like surfaces that prevent echoes and eliminate acoustic distortion.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    questionNumber: 54,
    question: "What is the author's primary tone toward the National Theatre in this passage?",
    options: [
      "Deeply appreciative, respectful, and celebratory of its cultural and architectural brilliance",
      "Critical, contemptuous, and mocking of its construction costs",
      "Completely neutral and indifferent to its artistic value",
      "Fearful of its environmental impact"
    ],
    answer: "Deeply appreciative, respectful, and celebratory of its cultural and architectural brilliance",
    hint: "Notice phrases like 'rising majestically', 'audacious monument', 'masterpiece', and 'vibrant cathedral of African artistic expression'.",
    solution: "Elevated and respectful diction ('majestically', 'sanctuary', 'masterpiece', 'vibrant cathedral') conveys a deeply appreciative and celebratory tone.",
    target: "Capstone Exam: Author's Tone"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the National Theatre requires for long-term preservation in paragraph 4.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Authorities must provide modernized technology and funding.",
      "Providing modernized stage technology and consistent institutionalized maintenance funding.",
      "Because the sea air corrodes the theatre, the government must definitely provide maintenance funds.",
      "Preserving the National Theatre."
    ],
    answer: "Authorities must provide modernized technology and funding.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Authorities must provide modernized technology and funding' is exactly 8 words, possesses complete Subject-Verb-Object syntax, and answers the prompt directly. Option B is an unattached participial fragment.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB8Advanced() {
  console.log("Building 55 UNIQUE questions for Basic 8 Advanced...");
  const db = await getDb();

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50B8AdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_A_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B8",
      difficulty: "advanced",
      questionNumber: qNum,
      isCapstoneExamPassage: false,
      passageText: item.passage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.2.1.1: Analyze author's tone, literary mood, and decode figurative devices in prose."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8AdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${nationalTheatreFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_A_${item.questionNumber}`,
      level: "B8",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: nationalTheatreFullPassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.2.1.1 / B8.2.2.1: Multi-paragraph textual analysis, architectural symbolism, tone evaluation, and constrained summary synthesis."
    });
  });

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  // 3. Write to subcollection B8_advanced across all paths
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B8_advanced`);
    await targetDoc.set({
      level: "B8",
      difficulty: "advanced",
      title: "Basic 8 Advanced Lab: 50 Unique Figurative & Tone Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (Tone, Mood & Figurative Language) + 5 Capstone Full-Passage Questions",
        passageVisibility: "Passage embedded both in passageText and at the top of prompt",
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${targetDoc.path}`);
  }

  // 4. Synchronize into main topical document practicePool.hard for TopicalLabRunner (level: b8)
  console.log("\nSynchronizing main topical document practicePool.hard for b8 (keeping b7, b8, b9 only)...");
  const mappedHardQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'hard' as const,
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
            hard: mappedHardQuestions
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
      console.log(`✅ Updated main document practicePool.hard for b8 at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B8 Advanced!`);
}

deployUniqueB8Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B8 Advanced:", err);
    process.exit(1);
  });

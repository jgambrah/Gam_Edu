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
  level: "B7";
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
// Comparative Synthesis: Aidoo's "The Girl Who Can" & Hemingway's "A Day's Wait"
// =========================================================================
const b7AdvancedComparativePassage = 
`In literature, heroic resilience often manifests not through thunderous battlefield exploits, but within the quiet dignity of vulnerable children navigating rigid cultural expectations. Both Ama Ata Aidoo in 'The Girl Who Can' and Ernest Hemingway in 'A Day's Wait' construct poignant portraits of young protagonists confronting severe misunderstandings imposed by the adult world. While seven-year-old Adjoa in rural Ghana endures the oppressive skepticism of her grandmother Nana regarding her spindly legs, nine-year-old Schatz in an American winter household confronts what he mistakenly perceives as his imminent mortality due to an unaddressed cultural temperature divide.

The societal architecture of Hasodzi village reduces female bodily value strictly to domestic utility—demanding robust calves capable of balancing heavy water pots and enduring the physical strain of childbearing. Nana's dismissive metaphor branding Adjoa's legs as 'two dry sticks' reflects an agrarian patriarchal system that silences children and evaluates human worth solely through functional labor. Conversely, Schatz's crisis is solitary and psychological; having attended school in France where a temperature of forty-four degrees Celsius signifies lethal collapse, he interprets his American physician's reading of one hundred and two degrees Fahrenheit as an absolute death sentence. Rather than succumbing to hysterical lamentation, Schatz displays remarkable stoicism, selflessly ordering his beloved father out of the bedroom to avert viral contagion.

Crucially, both authors utilize sudden contextual shifts to overturn adult misconceptions. In Aidoo's narrative, the institutional arena of the primary school athletics track liberates Adjoa, transforming her slender legs from physical liabilities into instruments of championship triumph. Nana's eventual symbolic march through Hasodzi, balancing the silver cup upon her head like a ceremonial vessel, illustrates how traditional matriarchal structures can adapt to honor modern female agency. In Hemingway's story, paternal dialogue finally bridges the measurement divide—comparing Fahrenheit and Celsius to miles and kilometers—which dissolves Schatz's rigid emotional armor and allows his repressed vulnerability to surface in tears.

Ultimately, these masterworks converge on a profound humanistic thesis: human capability and emotional endurance cannot be measured by traditional prejudice or surface appearances. Whether breaking village stereotypes on a running track or quietly awaiting death to protect a parent, both Adjoa and Schatz demonstrate that genuine courage resides in quiet resilience.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Advanced Literary Analysis: Synecdoche, Metonymy, Apostrophe, Tone,
// Structural Irony, Complex Character Motivations & Poetic Synthesis
// =========================================================================
const unique50B7AdvancedDrills = [
  {
    passage: "Nana declared that Hasodzi required strong hands to harvest the cassava before the torrential monsoon downpours began.",
    question: "What figure of speech is employed in the phrase 'strong hands' to represent the village laborers?",
    options: ["Synecdoche", "Metaphor", "Personification", "Hyperbole"],
    answer: "Synecdoche",
    hint: "A physical part of the human anatomy (hands) is used to represent the complete worker.",
    solution: "Using a constituent anatomical part ('hands') to represent the whole human beings (laborers) is a classic synecdoche.",
    target: "Figurative Language: Synecdoche"
  },
  {
    passage: "The Golden Stool issued an unyielding royal summons to all paramount divisional chiefs across the forest state.",
    question: "What figure of speech is used when 'The Golden Stool' represents the authority of the reigning monarch?",
    options: ["Metonymy", "Simile", "Litotes", "Apostrophe"],
    answer: "Metonymy",
    hint: "An associated object or royal regalia stands for the king or national royal institution.",
    solution: "Substituting an associated royal emblem ('The Golden Stool') for the monarch or kingdom's authority is an example of metonymy.",
    target: "Figurative Language: Metonymy"
  },
  {
    passage: "In 'The Girl Who Can', Nana routinely laments that Adjoa's spindly legs are an outright tragedy. Yet those exact legs earn the school an inter-district championship trophy.",
    question: "What specific literary device characterizes the contrast between Nana's prediction and Adjoa's athletic triumph?",
    options: ["Situational Irony", "Dramatic Irony", "Onomatopoeia", "Sarcasm"],
    answer: "Situational Irony",
    hint: "The actual outcome directly contradicts what was logically expected by the characters.",
    solution: "Situational irony occurs when the very physical trait dismissed as useless and tragic becomes the precise vehicle for communal victory and celebration.",
    target: "Literary Devices: Situational Irony"
  },
  {
    passage: "The weary soldier turned toward the sky and cried: 'O Liberty, why have you forsaken our bleeding motherland in her darkest hour?'",
    question: "What figure of speech is demonstrated by directly addressing the abstract concept of 'Liberty'?",
    options: ["Apostrophe", "Metaphor", "Synecdoche", "Alliteration"],
    answer: "Apostrophe",
    hint: "An emotional, direct address to an absent person or an abstract concept as if it were present.",
    solution: "Directly speaking to an abstract idea, personified quality, or absent entity ('O Liberty') is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'A Day's Wait', Hemingway describes the frozen landscape where all the bare trees and bushes looked as though they had been 'varnished with ice.'",
    question: "What does this aesthetic description of the landscape contribute to the story's atmosphere?",
    options: [
      "It mirrors the cold, frozen, and paralyzed emotional state of Schatz inside the house",
      "It shows that the father was an expert woodworker who enjoyed varnishing furniture",
      "It suggests that a destructive forest fire was approaching the family homestead",
      "It indicates that the doctor gave the wrong medicine to the child"
    ],
    answer: "It mirrors the cold, frozen, and paralyzed emotional state of Schatz inside the house",
    hint: "Connect the brittle, rigid ice outdoors with the boy's rigid, quiet death vigil indoors.",
    solution: "The imagery of a landscape frozen rigid and varnished with ice serves as an objective correlative, reflecting Schatz's frozen, unyielding emotional vigil inside.",
    target: "Atmospheric & Symbolic Analysis: 'A Day's Wait'"
  },
  {
    passage: "The politician's sudden resignation was no minor setback for the ruling parliamentary coalition.",
    question: "What figure of speech is used in describing a major disaster as 'no minor setback'?",
    options: ["Litotes", "Hyperbole", "Personification", "Simile"],
    answer: "Litotes",
    hint: "An affirmative point (a huge catastrophe) is expressed by negating its opposite ('no minor setback').",
    solution: "Litotes is an intentional understatement wherein an affirmative truth is stated by negating its contrary.",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Girl Who Can', Nana's eventual choice to carry Adjoa's sprinting cup on her head like a water pot illustrates an essential thematic shift. What is this shift?",
    options: [
      "The complete destruction of traditional African values by European sports",
      "The adaptation of indigenous rituals of honor to celebrate modern female achievement",
      "Nana's refusal to admit that Adjoa won the running race fairly",
      "A mother's total surrender of parental authority to village elders"
    ],
    answer: "The adaptation of indigenous rituals of honor to celebrate modern female achievement",
    hint: "How does Nana's physical action bridge traditional reverence with school sports trophies?",
    solution: "By utilizing the traditional posture of balancing a precious vessel on her head, Nana incorporates modern female achievement into her customary cultural vocabulary.",
    target: "Thematic Synthesis: 'The Girl Who Can'"
  },
  {
    passage: "The courtroom gavel fell with an explosive thud, extinguishing the hopes of the corrupt syndicate.",
    question: "What literary device is prominent in the word 'thud'?",
    options: ["Onomatopoeia", "Synecdoche", "Apostrophe", "Understatement"],
    answer: "Onomatopoeia",
    hint: "The word phonetically imitates the heavy, dull sound of a wooden hammer striking a desk.",
    solution: "'Thud' directly mimics the physical, acoustic sound of an impact, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'A Day's Wait', Schatz asks his father if the medicine will do any good, and looks straight ahead, 'holding tight onto himself about something.'",
    question: "What does the phrase 'holding tight onto himself' indicate about Schatz's character?",
    options: [
      "He was experiencing severe stomach spasms from food poisoning",
      "He was exerting supreme psychological self-control to conceal his terror and die bravely",
      "He was trying to prevent his father from reading pirate adventures",
      "He was physically holding his blankets so they would not slide off the bed"
    ],
    answer: "He was exerting supreme psychological self-control to conceal his terror and die bravely",
    hint: "Consider Hemingway's recurring literary motif of 'grace under pressure.'",
    solution: "The phrase highlights Schatz's intense internal discipline—he is actively repressing fear and tears to face what he believes is death with quiet stoicism.",
    target: "Character Psychology: 'A Day's Wait'"
  },
  {
    passage: "The weary traveler muttered under his breath: 'Ah, cruel Fate, why do you mock my sincere endeavors?'",
    question: "What figure of speech is present in addressing 'cruel Fate' directly?",
    options: ["Apostrophe", "Metaphor", "Simile", "Litotes"],
    answer: "Apostrophe",
    hint: "Speaking directly to an abstract force (Fate) that cannot physically respond.",
    solution: "Directly crying out to an abstract, personified force ('cruel Fate') is apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'The Girl Who Can', Adjoa describes the village of Hasodzi with gentle humor, stating that when all of Africa is not raining, Hasodzi is raining.",
    question: "What figure of speech is used in the claim that Hasodzi rains when all of Africa is dry?",
    options: ["Hyperbole", "Understatement", "Metaphor", "Onomatopoeia"],
    answer: "Hyperbole",
    hint: "Is it geographically factual that one small village receives rain while an entire continent dries up?",
    solution: "Claiming that Hasodzi rains while the entire continent of Africa experiences drought is a dramatic exaggeration (hyperbole) emphasizing local fertility.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "The palace declared that thirty crowns had gathered in London for the royal coronation.",
    question: "What figure of speech is used when 'crowns' is used to denote reigning monarchs?",
    options: ["Metonymy", "Synecdoche", "Simile", "Apostrophe"],
    answer: "Metonymy",
    hint: "A crown is a symbolic accessory closely associated with the office of a king or queen.",
    solution: "Using the royal accessory ('crowns') to represent the kings and queens who wear them is metonymy.",
    target: "Figurative Language: Metonymy"
  },
  {
    passage: "In 'A Day's Wait', the narrative point of view is strictly first-person, told entirely through the father's eyes.",
    question: "How does this specific narrative point of view heighten the dramatic irony of the story?",
    options: [
      "It allows the reader to hear Schatz's thoughts while hiding the father's feelings",
      "It limits the reader's view to the father's casual observations, keeping Schatz's silent crisis hidden until the climax",
      "It proves that the father did not care whether Schatz survived or died",
      "It makes the story historically inaccurate because fathers cannot write stories"
    ],
    answer: "It limits the reader's view to the father's casual observations, keeping Schatz's silent crisis hidden until the climax",
    hint: "We only see what the father sees: a child who looks a bit detached, not a child preparing to die.",
    solution: "Because the father is unaware of the Celsius-Fahrenheit confusion, his first-person perspective blinds the reader to the true nature of Schatz's torment until the boy speaks.",
    target: "Narrative Technique: 'A Day's Wait'"
  },
  {
    passage: "The fleet consisted of twenty sail, skimming across the azure expanse of the Atlantic Ocean.",
    question: "What figure of speech is used when 'sail' represents complete seafaring ships?",
    options: ["Synecdoche", "Metaphor", "Personification", "Irony"],
    answer: "Synecdoche",
    hint: "A part of a sailing vessel (the sail) represents the entire ship.",
    solution: "Using a constituent mechanical part of a vessel ('sail') to represent the complete vessel is synecdoche.",
    target: "Figurative Language: Synecdoche"
  },
  {
    passage: "In 'The Girl Who Can', what is the fundamental irony of Nana's constant obsession with fleshy calves for childbearing?",
    options: [
      "Adjoa was already a married mother of two infants",
      "Adjoa was only seven years old, making discussions of her marital fertility absurdly premature",
      "Nana herself had never given birth to any children",
      "Hasodzi village had banned marriage for women with thin legs"
    ],
    answer: "Adjoa was only seven years old, making discussions of her marital fertility absurdly premature",
    hint: "Consider Adjoa's chronological age while Nana evaluates her hips and legs.",
    solution: "Aidoo employs situational irony: Nana is passionately judging the childbearing hips and calves of an innocent seven-year-old child whose life has barely begun.",
    target: "Critical Irony: 'The Girl Who Can'"
  },
  {
    passage: "The classroom was an acoustic chamber of soft sibilant whispers as the examination papers were distributed.",
    question: "What sound device is prominent in the repetition of the 's' sound in 'soft sibilant whispers'?",
    options: ["Alliteration / Sibilance", "Assonance", "Onomatopoeia", "Rhyme"],
    answer: "Alliteration / Sibilance",
    hint: "Notice the hissing, soft sound produced by the repeated initial 's'.",
    solution: "The repetition of the soft 's' consonant sound is alliteration, specifically categorized as sibilance.",
    target: "Sound Devices: Sibilance"
  },
  {
    passage: "The dying soldier gasped into the cold darkness: 'O Motherland, I give thee my final breath without regret!'",
    question: "What literary device is featured in this dying utterance?",
    options: ["Apostrophe", "Litotes", "Simile", "Understatement"],
    answer: "Apostrophe",
    hint: "The speaker addresses his personified country directly as if it were standing before him.",
    solution: "Addressing an absent entity or abstract nation ('O Motherland') with emotional reverence is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'A Day's Wait', what does the resolution reveal about the psychological toll of Schatz's ordeal?",
    options: [
      "He immediately ran outside to play baseball without any emotional distress",
      "The next day he cried very easily at little things of no importance, showing his nervous exhaustion",
      "He remained permanently mute and refused to speak to his family ever again",
      "He blamed his French schoolteachers and demanded to return to Europe"
    ],
    answer: "The next day he cried very easily at little things of no importance, showing his nervous exhaustion",
    hint: "How does his nervous system react after holding in terror for twelve consecutive hours?",
    solution: "The sudden relaxation of his extreme stoic self-control left Schatz emotionally spent, causing him to weep over trivial occurrences the following day.",
    target: "Character Development: 'A Day's Wait'"
  },
  {
    passage: "The detective whispered that the suspect was not entirely innocent of the corporate embezzlement.",
    question: "What figure of speech is used in saying someone is 'not entirely innocent'?",
    options: ["Litotes", "Hyperbole", "Metaphor", "Personification"],
    answer: "Litotes",
    hint: "Negating innocence ('not entirely innocent') affirms guilt in an understated manner.",
    solution: "Litotes expresses an affirmative truth (that the suspect is guilty) by negating its contrary ('not entirely innocent').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Girl Who Can', Adjoa notes that her mother, Maami, seemed to be constantly apologizing for giving birth to her.",
    question: "What does this poignant observation reveal about patriarchal and matriarchal pressure in the village?",
    options: [
      "Maami disliked Adjoa and wished she had a son instead",
      "Women who do not produce children meeting community bodily standards are made to feel deeply inadequate",
      "Nana was planning to banish Maami from Hasodzi village forever",
      "Adjoa was born with a fatal contagious disease that endangered the village"
    ],
    answer: "Women who do not produce children meeting community bodily standards are made to feel deeply inadequate",
    hint: "Why would a mother apologize for her own daughter's natural physical appearance?",
    solution: "Aidoo highlights how deeply women internalize communal guilt when their offspring deviate from the community's rigid functional ideals.",
    target: "Sociocultural Critique: 'The Girl Who Can'"
  },
  {
    passage: "The raging fire devoured three hundred hectares of virgin forest in an unquenchable fury.",
    question: "What figure of speech is used when the fire 'devoured' the forest in 'unquenchable fury'?",
    options: ["Personification", "Simile", "Synecdoche", "Litotes"],
    answer: "Personification",
    hint: "Fire is given an insatiable appetite and the emotional state of fury.",
    solution: "Attributing biological hunger (devouring) and psychological rage (fury) to fire is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'A Day's Wait', Hemingway's prose style is characterized by short, declarative sentences, restrained dialogue, and minimal emotional commentary.",
    question: "What is this celebrated Hemingway literary technique formally called?",
    options: [
      "The Iceberg Theory / Theory of Omission",
      "Stream of Consciousness",
      "Gothic Romanticism",
      "Epistolary Exposition"
    ],
    answer: "The Iceberg Theory / Theory of Omission",
    hint: "Only the tip of the emotional reality is shown in dialogue, while the bulk lies under the surface.",
    solution: "Hemingway's minimalist technique is the 'Iceberg Theory,' where the dignity of the narrative lies in the unstated, submerged emotional depths.",
    target: "Literary Craft: Hemingway's Style"
  },
  {
    passage: "The press reported that the White House had dispatched emergency disaster relief to the coastal flood zone.",
    question: "What figure of speech is used when 'the White House' represents the American presidential administration?",
    options: ["Metonymy", "Synecdoche", "Simile", "Hyperbole"],
    answer: "Metonymy",
    hint: "A building associated with the presidency stands for the executive leadership.",
    solution: "Using the physical residence and office ('the White House') to denote the governing presidential administration is metonymy.",
    target: "Figurative Language: Metonymy"
  },
  {
    passage: "In 'The Girl Who Can', what is the deeper symbolic significance of Adjoa's spindly legs within the context of African literature?",
    options: [
      "They demonstrate that African children are genetically weaker than European children",
      "They symbolize how modern opportunities can transform perceived physical and social limitations into triumph",
      "They show that rural agriculture is the only valid occupation for Ghanaian women",
      "They prove that traditional elders are always entirely wrong about everything"
    ],
    answer: "They symbolize how modern opportunities can transform perceived physical and social limitations into triumph",
    hint: "Think beyond anatomy to the broader empowerment of marginalized girls.",
    solution: "Adjoa's legs symbolize marginalized female potential: an apparent weakness under old agrarian norms becomes an extraordinary gift when granted modern educational platforms.",
    target: "Symbolic Synthesis: 'The Girl Who Can'"
  },
  {
    passage: "The hunter waited patiently as the silent shadows slithered across the sleeping savanna.",
    question: "What sound device is demonstrated by the repetition of the 's' sound in 'silent shadows slithered across the sleeping savanna'?",
    options: ["Alliteration / Sibilance", "Assonance", "Onomatopoeia", "Rhyme"],
    answer: "Alliteration / Sibilance",
    hint: "The prominent whispering sound created by the repeated initial 's'.",
    solution: "The continuous recurrence of the initial consonant 's' across successive words is alliteration (sibilance).",
    target: "Sound Devices: Sibilance"
  },
  {
    passage: "In 'A Day's Wait', Schatz tells his father: 'You don't have to stay in here with me, Papa, if it bothers you.'",
    question: "What underlying assumption causes Schatz to make this remark?",
    options: [
      "He thinks his father finds the room untidy",
      "He believes his death will be gruesome and wishes to spare his father the pain and contagion",
      "He wants to get out of bed to play with the Irish setter dog",
      "He is waiting for the physician to return with better pirate stories"
    ],
    answer: "He believes his death will be gruesome and wishes to spare his father the pain and contagion",
    hint: "Schatz thinks he is at death's door and does not want his father to suffer witnessing it.",
    solution: "Schatz assumes his impending death might be distressing and contagious; his remark is a heroic attempt to shield his father from trauma.",
    target: "Subtext Analysis: 'A Day's Wait'"
  },
  {
    passage: "The old general possessed an iron will that could not be bent by political bribes or military threats.",
    question: "What figure of speech is used in describing his determination as 'an iron will'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "A direct identification equating determination to a rigid metal without 'like' or 'as'.",
    solution: "Directly describing psychological firmness as solid iron without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Girl Who Can', how does Adjoa's athletic victory affect the traditional power balance between Nana and Maami?",
    options: [
      "Maami is permanently evicted from the family household",
      "Nana's rigid authority softens, vindicating Maami's gentle belief that Adjoa's legs had a divine purpose",
      "Nana refuses to eat any food prepared by Maami",
      "Maami gives all of Adjoa's sports prizes to the village chief"
    ],
    answer: "Nana's rigid authority softens, vindicating Maami's gentle belief that Adjoa's legs had a divine purpose",
    hint: "Recall Maami's earlier quiet defense: 'God gave her those legs, and perhaps they have a purpose.'",
    solution: "Adjoa's triumph validates Maami's gentle faith that her daughter's body had a purpose, causing Nana's vocal dominance to dissolve into quiet, humble pride.",
    target: "Character Dynamics: 'The Girl Who Can'"
  },
  {
    passage: "The dry autumn leaves rustled, scraped, and whispered against the cobblestone pavement.",
    question: "What literary device is present in the words 'rustled, scraped, and whispered'?",
    options: ["Onomatopoeia", "Synecdoche", "Hyperbole", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words mimic the frictional sounds of dry foliage moving against stone.",
    solution: "Words like 'rustled' and 'scraped' echo the actual physical sounds of friction, making them onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'A Day's Wait', what is the fundamental thematic difference between the boy's internal reality and his external demeanor?",
    options: [
      "He feels joyful inside while pretending to be miserable on the outside",
      "He is terrified of imminent death inside, yet presents an external face of quiet, uncomplaining composure",
      "He knows his fever is minor, but acts dramatic to gain parental sympathy",
      "He wants to go hunting, but pretends to have broken legs"
    ],
    answer: "He is terrified of imminent death inside, yet presents an external face of quiet, uncomplaining composure",
    hint: "Look at the profound gap between his inner crisis and his outer stoicism.",
    solution: "Hemingway constructs a masterclass in stoicism: Schatz experiences total existential dread internally, but maintains perfect heroic calm on the exterior.",
    target: "Thematic Duality: 'A Day's Wait'"
  },
  {
    passage: "The young scholar was no fool when it came to corporate financial accounting.",
    question: "What figure of speech is used in saying the scholar was 'no fool'?",
    options: ["Litotes", "Hyperbole", "Simile", "Personification"],
    answer: "Litotes",
    hint: "Affirming that someone is very clever by stating they are 'no fool'.",
    solution: "Litotes asserts an affirmative truth (that the scholar is highly intelligent) by negating its contrary ('no fool').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Girl Who Can', what is the primary societal reason Adjoa's village valued robust, fleshy legs over slender legs?",
    options: [
      "Hasodzi village held annual swimming competitions across ocean lagoons",
      "The agrarian economy required physical endurance for carrying farm loads and surviving childbirth",
      "Slender legs were considered a sign of witchcraft and sorcery",
      "The village elders traded fleshy calves for gold dust"
    ],
    answer: "The agrarian economy required physical endurance for carrying farm loads and surviving childbirth",
    hint: "Look at the practical economic and reproductive duties of rural village women.",
    solution: "Hasodzi's cultural values were tied to survival: women needed physical stamina to harvest cassava, haul firewood, and bear children.",
    target: "Sociological Analysis: 'The Girl Who Can'"
  },
  {
    passage: "The thunder roared across the black sky like an enraged beast breaking its heavy chains.",
    question: "What two figures of speech are combined in this sentence?",
    options: [
      "Personification and Simile",
      "Metaphor and Litotes",
      "Hyperbole and Synecdoche",
      "Alliteration and Apostrophe"
    ],
    answer: "Personification and Simile",
    hint: "Thunder 'roared' (giving sound a living voice) and is compared using 'like an enraged beast'.",
    solution: "Giving thunder the roaring action of an animal is personification, while comparing it using 'like' constitutes a simile.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'A Day's Wait', how does the father explain the difference between the two thermometers to Schatz?",
    options: [
      "He tells him that French doctors are completely incompetent",
      "He uses the familiar comparison of miles and kilometers to explain different measurement scales",
      "He buys him a new pirate book with temperature diagrams",
      "He forces him to drink cold river water to test his blood"
    ],
    answer: "He uses the familiar comparison of miles and kilometers to explain different measurement scales",
    hint: "Recall the automotive analogy: 'like how many kilometers we make when we do seventy miles in the car.'",
    solution: "The father successfully demystifies the medical confusion by drawing an analogy to distance measurement: miles versus kilometers.",
    target: "Textual Understanding: 'A Day's Wait'"
  },
  {
    passage: "The heavy bronze church bell tolled mournfully, weeping for the fallen heroes of the nation.",
    question: "What figure of speech is present when the bell 'tolled mournfully, weeping'?",
    options: ["Personification", "Simile", "Metaphor", "Litotes"],
    answer: "Personification",
    hint: "Attributing human sorrow and weeping to an inanimate metal bell.",
    solution: "Giving a bronze church bell the human emotional capacity to mourn and weep is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', what is the author's tone when depicting Adjoa's private contemplation of adult arguments?",
    options: [
      "Bitter, resentful, and aggressive",
      "Gently satirical, humorous, and empathetic",
      "Cold, scientific, and utterly clinical",
      "Terrified and full of despair"
    ],
    answer: "Gently satirical, humorous, and empathetic",
    hint: "Notice how Adjoa finds Nana's endless complaints slightly funny rather than devastating.",
    solution: "Aidoo employs a gently satirical and humorous tone, allowing Adjoa's innocent child's eye to playfully expose adult absurdities.",
    target: "Tone Analysis: 'The Girl Who Can'"
  },
  {
    passage: "The angry mob screamed at the courthouse gates, demanding thirty heads on pikes before sunset.",
    question: "What figure of speech is used when 'thirty heads' represents thirty executing human bodies?",
    options: ["Synecdoche", "Metaphor", "Apostrophe", "Simile"],
    answer: "Synecdoche",
    hint: "An anatomical part (heads) is used to represent whole people.",
    solution: "Using a physical part of the human body ('heads') to represent the entire person is synecdoche.",
    target: "Figurative Language: Synecdoche"
  },
  {
    passage: "In 'A Day's Wait', what does the father do immediately after giving Schatz his medicine at eleven o'clock?",
    options: [
      "He goes out for a walk with his Irish setter dog on the frozen sleet",
      "He drives to the hospital to confront the doctor",
      "He burns Howard Pyle's Book of Pirates in the fireplace",
      "He packs his luggage to return to France"
    ],
    answer: "He goes out for a walk with his Irish setter dog on the frozen sleet",
    hint: "Review the sequence of events before the hunting episode.",
    solution: "Believing Schatz is merely lightheaded and resting comfortably, the father takes the young dog for a walk along the frozen creek.",
    target: "Chronological Sequence: 'A Day's Wait'"
  },
  {
    passage: "The athlete's legs were piston rods, pumping tirelessly across the synthetic track.",
    question: "What figure of speech is used in calling the legs 'piston rods'?",
    options: ["Metaphor", "Simile", "Personification", "Litotes"],
    answer: "Metaphor",
    hint: "Direct equation of human legs to mechanical piston rods without 'like' or 'as'.",
    solution: "Equating human legs directly to mechanical engine pistons without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Girl Who Can', Nana's habit of constantly spitting on the floor when discussing Adjoa's legs conveys what dramatic emotion?",
    options: [
      "Deep reverence and spiritual blessing",
      "Contempt, physical disgust, and dramatic dismissal",
      "Severe physical pain from tooth decay",
      "Joy that her granddaughter is healthy"
    ],
    answer: "Contempt, physical disgust, and dramatic dismissal",
    hint: "Spitting emphatically during an argument is a traditional gesture of disgust.",
    solution: "Nana's dramatic spitting emphasizes her complete contempt and disdain for physical traits she considers useless.",
    target: "Dramatic Characterization: 'The Girl Who Can'"
  },
  {
    passage: "The night wind wailed through the keyhole like a grieving widow at an ancestral funeral.",
    question: "What figure of speech is used in 'like a grieving widow'?",
    options: ["Simile", "Metaphor", "Synecdoche", "Apostrophe"],
    answer: "Simile",
    hint: "Look for the comparative word 'like'.",
    solution: "Comparing the sound of the wind to a mourning widow using 'like' creates a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'A Day's Wait', what does the doctor identify as the main danger to be avoided during influenza?",
    options: [
      "Extreme dehydration",
      "Pneumonia",
      "Broken bones",
      "Loss of eyesight"
    ],
    answer: "Pneumonia",
    hint: "The doctor says there is no danger if you avoid this secondary lung infection.",
    solution: "The physician explicitly states: 'there was no danger if you avoided pneumonia.'",
    target: "Textual Recall: 'A Day's Wait'"
  },
  {
    passage: "The fortress walls had witnessed three centuries of bloody warfare along the disputed frontier.",
    question: "What figure of speech is present in saying the stone walls 'had witnessed' warfare?",
    options: ["Personification", "Simile", "Metaphor", "Hyperbole"],
    answer: "Personification",
    hint: "Can inanimate stone masonry act as a conscious eyewitness to historical events?",
    solution: "Attributing human sensory observation (witnessing) to inanimate stone structures is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', how does the author convey the theme of generational transition?",
    options: [
      "By showing how Nana, Maami, and Adjoa represent three differing perspectives on female potential",
      "By showing that all three women agree completely on every village issue",
      "By having Adjoa move to Europe to escape her family",
      "By showing that grandmothers are legally superior to local district courts"
    ],
    answer: "By showing how Nana, Maami, and Adjoa represent three differing perspectives on female potential",
    hint: "Nana represents ancient custom, Maami is the quiet transition, and Adjoa represents modern agency.",
    solution: "Aidoo uses the three generations—Nana (tradition), Maami (transitional hesitation), and Adjoa (modern empowerment)—to illustrate changing gender expectations.",
    target: "Thematic Structure: 'The Girl Who Can'"
  },
  {
    passage: "The old man was no novice when it came to tracking wild bushbucks through the virgin forest.",
    question: "What figure of speech is used in describing an expert hunter as 'no novice'?",
    options: ["Litotes", "Hyperbole", "Personification", "Simile"],
    answer: "Litotes",
    hint: "Negating the idea of inexperience ('no novice') asserts that he is an expert.",
    solution: "Litotes expresses high expertise by negating its opposite ('no novice').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'A Day's Wait', what detail shows that Schatz's father tried his best to comfort his son while sitting by the bed?",
    options: [
      "He offered to read aloud from Howard Pyle's Book of Pirates and stayed beside him",
      "He took Schatz outside to hunt quails on the ice",
      "He bought Schatz a ticket to travel back to France",
      "He called the village priest to administer funeral rites"
    ],
    answer: "He offered to read aloud from Howard Pyle's Book of Pirates and stayed beside him",
    hint: "Look at the gentle domestic care the father provides in the bedroom.",
    solution: "The father sits by the bed, keeps track of the medicine schedule, and reads aloud from an adventure book to comfort his sick boy.",
    target: "Textual Understanding: 'A Day's Wait'"
  },
  {
    passage: "The classroom was an erupting volcano of joy when the headmaster announced a three-day holiday.",
    question: "What figure of speech is used in calling the classroom 'an erupting volcano of joy'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "Direct equation of an excited room to an erupting volcano without comparative markers.",
    solution: "Directly describing the joyful classroom as an erupting volcano is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Girl Who Can', what is the final moral realization that Nana arrives at regarding her granddaughter?",
    options: [
      "That Adjoa must immediately leave school to plant cassava full-time",
      "That thin legs that can run fast and bring communal honor are just as valuable as fleshy legs that carry firewood",
      "That sprinting is ungodly and should never be practiced in Hasodzi",
      "That Maami was a bad mother who should be punished by the village elders"
    ],
    answer: "That thin legs that can run fast and bring communal honor are just as valuable as fleshy legs that carry firewood",
    hint: "Nana's walk with the cup shows she recognizes that different legs have different valuable purposes.",
    solution: "Nana realizes that Adjoa's slender legs possess a distinct, honorable purpose—running swiftly and earning dignity for her community.",
    target: "Moral Resolution: 'The Girl Who Can'"
  },
  {
    passage: "The silver creek gurgled, babble-chattered, and splashed merrily over the smooth river stones.",
    question: "What literary device is demonstrated by the words 'gurgled, babble-chattered, and splashed'?",
    options: ["Onomatopoeia", "Hyperbole", "Synecdoche", "Litotes"],
    answer: "Onomatopoeia",
    hint: "These sound-words reproduce the natural acoustic murmur of moving water.",
    solution: "Words whose sounds phonetically recreate the physical noise of flowing water are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'A Day's Wait', what is the primary thematic message Hemingway conveys regarding courage?",
    options: [
      "Courage is loud, aggressive, and displayed only in physical combat",
      "True courage is often quiet, private, and rooted in dignified self-control under perceived peril",
      "Children are incapable of understanding what courage means",
      "Courage requires boasting about one's achievements to others"
    ],
    answer: "True courage is often quiet, private, and rooted in dignified self-control under perceived peril",
    hint: "Consider how Schatz kept his fear entirely to himself to protect his father.",
    solution: "Hemingway celebrates quiet, uncomplaining fortitude: Schatz faces death with dignified, internal self-restraint rather than theatrical panic.",
    target: "Core Theme: 'A Day's Wait'"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON COMPARATIVE PASSAGE (51 TO 55)
// Comparative Synthesis: Aidoo & Hemingway
// =========================================================================
const capstone5B7AdvancedQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 2, what fundamental cultural difference exists between the societal pressures facing Adjoa and the crisis confronting Schatz?",
    options: [
      "Adjoa faces public agrarian expectations of physical labor, while Schatz endures an isolated, psychological crisis of perceived mortality",
      "Adjoa is suffering from viral influenza, while Schatz is training for an inter-district athletic championship",
      "Adjoa is forced to attend a French school, while Schatz is forbidden to speak by his grandmother",
      "Both characters suffer from identical bacterial infections in Hasodzi village"
    ],
    answer: "Adjoa faces public agrarian expectations of physical labor, while Schatz endures an isolated, psychological crisis of perceived mortality",
    hint: "Contrast the communal, public criticism in Hasodzi with Schatz's private, bedroom crisis.",
    solution: "Paragraph 2 contrasts Adjoa's external, communal struggle against agrarian female utility with Schatz's solitary, internal struggle against perceived medical death.",
    target: "Capstone Exam: Comparative Cultural Analysis"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what literary device is used by Nana when she dismisses Adjoa's legs as 'two dry sticks', and what does it reveal about her values?",
    options: [
      "Simile; it reveals that Nana enjoys collecting firewood for cooking",
      "Metaphor; it reveals that Nana evaluates human anatomy strictly through functional agricultural labor and childbearing capacity",
      "Personification; it reveals that dry sticks can speak in Hasodzi village",
      "Litotes; it reveals that Nana was secretly very proud of Adjoa's running ability"
    ],
    answer: "Metaphor; it reveals that Nana evaluates human anatomy strictly through functional agricultural labor and childbearing capacity",
    hint: "Directly calling legs 'two dry sticks' without comparative connectives constitutes a derogatory metaphor.",
    solution: "Nana uses a metaphor equating Adjoa's legs to brittle sticks, revealing her traditional view that bodies lacking heavy farm utility are valueless liabilities.",
    target: "Capstone Exam: Metaphorical Analysis"
  },
  {
    questionNumber: 53,
    question: "According to paragraph 3, what specific institutional and communicative mechanisms overturn the adult misunderstandings in both stories?",
    options: [
      "Traditional village courts for Adjoa, and herbal medicine for Schatz",
      "The primary school athletic field for Adjoa, and a clarifying paternal measurement analogy for Schatz",
      "A foreign hospital in France for Adjoa, and an inter-district trophy for Schatz",
      "Strict physical punishment by Nana for Adjoa, and Howard Pyle's pirate book for Schatz"
    ],
    answer: "The primary school athletic field for Adjoa, and a clarifying paternal measurement analogy for Schatz",
    hint: "Identify the modern institution that liberates Adjoa, and the conversation that frees Schatz.",
    solution: "Paragraph 3 explains that the school athletic track proves Adjoa's physical value, while the father's analogy (miles vs. kilometers) demystifies the temperature scale for Schatz.",
    target: "Capstone Exam: Thematic Resolution & Structural Mechanisms"
  },
  {
    questionNumber: 54,
    question: "What is the symbolic significance of Nana carrying the silver cup on her head like a ceremonial water pot in paragraph 3?",
    options: [
      "She was complaining that the metal trophy was too heavy to carry in her hands",
      "She adapted an indigenous ritual of female respect and honor to celebrate her granddaughter's modern athletic victory",
      "She intended to carry the trophy to the river to fill it with drinking water",
      "She was trying to hide the trophy from the school sports master"
    ],
    answer: "She adapted an indigenous ritual of female respect and honor to celebrate her granddaughter's modern athletic victory",
    hint: "In Ghanaian culture, balancing an honorable item on the head is a public act of pride and reverence.",
    solution: "By balancing the trophy on her head like a cherished vessel, Nana uses a traditional custom of dignity to publicly affirm Adjoa's modern accomplishment.",
    target: "Capstone Exam: Symbolic Interpretation"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the shared thesis of both masterworks as described in the final paragraph.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Genuine human capability defies traditional surface prejudices.",
      "Because Adjoa and Schatz were young children, they proved that courage resides in quiet resilience.",
      "Quiet resilience and heroic endurance across differing cultural expectations and adult prejudices.",
      "Children can be brave."
    ],
    answer: "Genuine human capability defies traditional surface prejudices.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Genuine human capability defies traditional surface prejudices' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and captures the comparative moral. Option C is a fragment (0 marks), and Option B has 14 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployCockcrowB7Advanced() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();
  console.log("Building 55 UNIQUE questions for Basic 7 (JHS 1) Cockcrow Advanced Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B7AdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_C_A_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B7",
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
      learningCompetency: "B7.2.2.1 / B7.2.3.1: Evaluate advanced figures of speech (Synecdoche, Metonymy, Apostrophe, Litotes), atmospheric setting, and complex narrative perspectives in Cockcrow prose."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B7AdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b7AdvancedComparativePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_C_A_${item.questionNumber}`,
      level: "B7",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b7AdvancedComparativePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B7.2.2.1 / B7.2.3.1: Comparative textual synthesis across prescribed Cockcrow literature, analyzing cross-cultural conflicts, structural symbolism, and formulating concise thematic summaries."
    });
  });

  // 3. Write directly to Firestore subcollections
  const topicIds = ["literature_cockcrow_canon", "cockcrow_literary_devices"];
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B7_advanced)...");
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B7_advanced`);
      await subDocRef.set({
        level: "B7",
        difficulty: "advanced",
        title: "Basic 7 Advanced Lab: 50 Unique Advanced Literary Drills + 5 Capstone Comparative Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Synecdoche, Metonymy, Apostrophe, Litotes & Thematic Nuance) + 5 Capstone Comparative Exam Questions",
          passageVisibility: "Passage embedded both in passageText and at the top of prompt",
          curriculum: "NaCCA Common Core Programme (CCP) Standard",
          prescribedTextsCovered: ["The Girl Who Can by Ama Ata Aidoo", "A Day's Wait by Ernest Hemingway"],
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
      console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
    }
  }

  // 4. Synchronize into main document practicePool.hard for b7 and jhs1
  console.log("\nSynchronizing main document practicePool.hard for b7 and jhs1...");
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

  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const mainRef = db.doc(`${parent}/${topicId}`);
      const snap = await mainRef.get();
      if (snap.exists) {
        const data = snap.data() || {};
        const existingLevels = data.levels || {};
        const b7Level = existingLevels.b7 || {};
        const jhs1Level = existingLevels.jhs1 || {};

        const updatedLevels = {
          ...existingLevels,
          b7: {
            ...b7Level,
            practicePool: {
              ...(b7Level.practicePool || {}),
              hard: mappedHardQuestions
            }
          },
          jhs1: {
            ...jhs1Level,
            practicePool: {
              ...(jhs1Level.practicePool || {}),
              hard: mappedHardQuestions
            }
          }
        };

        await mainRef.set({
          ...data,
          levels: updatedLevels,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log(`✅ Updated main document practicePool.hard at: ${mainRef.path}`);
      }
    }
  }

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B7 Advanced!`);
}

deployCockcrowB7Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B7 Advanced Lab:", err);
    process.exit(1);
  });

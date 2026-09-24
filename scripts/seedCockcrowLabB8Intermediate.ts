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
// Prescribed Text: Charles Dickens' "Oliver Twist" (Nancy's Secret Meeting on London Bridge)
// =========================================================================
const nancyLondonBridgeCapstonePassage = 
`The church clock chimed three quarters past eleven, as two figures emerged on London Bridge. One was a young woman, wrapped in a coarse dark shawl, who walked with hurried, agitated steps, glancing behind her at every step as if pursued by a phantom; the other, an elderly gentleman, accompanied by a young lady dressed in deep mourning. They descended the steep, dark flight of stone stairs leading down to the river bank on the Surrey side of the bridge, where the water lapped sullenly against the heavy, slimy piles, and the mist from the Thames hung like a funeral shroud over the river.

'Why have you brought us to this dark and dismal place?' inquired the young lady, shivering as she glanced around at the damp, gloomy arches. 'Speak without fear, my poor girl; you are with friends who wish to save you.'

'This is the only place where I felt safe to speak,' whispered Nancy, her teeth chattering with fear and cold. 'If I was seen talking with you in the open street, my life would not be worth twenty minutes' purchase. Bill Sikes would murder me with his bare hands if he knew I was here tonight.'

'Then leave him!' urged the gentleman earnestly. 'Come with us now. We have the power and the will to place you beyond the reach of these ruthless criminals forever. You shall have a quiet, peaceful home far away in the countryside, where none of these dreadful people can ever find you.'

'No,' replied Nancy, shaking her head sorrowfully while bitter tears rolled down her pale cheeks. 'I cannot leave him. You do not know what it is to have loved someone through years of brutality and misery, until you cannot break away, even though you know he will drag your soul to ruin. I am tied to him, and to the life I lead. But I could not sleep until I told you what I overheard between Fagin and the strange man who calls himself Monks. It is Oliver's own half-brother who is paying Fagin to make the boy a convicted felon, so that he may keep the entire inheritance left by their dead father. The gold locket and wedding ring that proved Oliver's identity were bought from the workhouse nurse and thrown into the river where the mill-wheel turns.'

'Take this money, at least,' pleaded the young lady, offering her purse. 'Use it to help yourself when danger comes.'

'Not a penny,' said Nancy, thrusting the purse gently back. 'I came here for the child's sake, not for gold. God bless you both for speaking kindly to a wretched outcast like me. Remember my words, and save Oliver!'

With a stifled sob, Nancy turned and fled up the dark stone steps into the nocturnal fog, completely unaware that in the deep shadow beneath the stone wall, Noah Claypole had crouched in silence, listening to every syllable she had uttered.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Intermediate Literary Analysis: Dickens' "Oliver Twist" & Poetic/Literary Devices
// Character Motivations, Moral Conflict, Social Satire, Symbolism & Devices
// =========================================================================
const unique50B8IntermediateDrills = [
  {
    passage: "Nancy looked down into the muddy waters of the Thames, murmuring that the dark river looked like a cold grave waiting to swallow her up.",
    question: "What figure of speech is used in the phrase 'looked like a cold grave'?",
    options: ["Simile", "Metaphor", "Personification", "Litotes"],
    answer: "Simile",
    hint: "Notice the comparative conjunction 'like'.",
    solution: "Comparing the dark river explicitly to a cold grave using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', Nancy refuses Mr. Brownlow's offer of a peaceful life in the countryside, choosing instead to return to the violent Bill Sikes.",
    question: "What profound moral conflict does Nancy's tragic refusal illustrate?",
    options: [
      "Her deep-seated fear of open countryside environments",
      "Her self-destructive emotional attachment to her abuser despite knowing the danger",
      "Her desire to steal Mr. Brownlow's carriage horses",
      "Her ambition to become the undisputed leader of Fagin's criminal gang"
    ],
    answer: "Her self-destructive emotional attachment to her abuser despite knowing the danger",
    hint: "Consider her statement: 'I cannot leave him... even though you know he will drag your soul to ruin.'",
    solution: "Nancy embodies moral complexity: while she acts selflessly to save Oliver, she is psychologically trapped by her tragic devotion to Sikes.",
    target: "Character Psychology: 'Oliver Twist'"
  },
  {
    passage: "The city of London was a vast spiderweb, with Fagin sitting quietly in the center spinning threads of crime.",
    question: "What figure of speech is used in calling London 'a vast spiderweb'?",
    options: ["Metaphor", "Simile", "Onomatopoeia", "Apostrophe"],
    answer: "Metaphor",
    hint: "The city is directly equated to a web without using 'like' or 'as'.",
    solution: "Directly describing London as a spiderweb without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', Dickens repeatedly contrasts the physical appearance of the fat, well-fed board members with the emaciated, skeletal workhouse boys.",
    question: "What satirical technique does Dickens employ through this physical contrast?",
    options: [
      "Juxtaposition to expose the greed and institutional hypocrisy of the Poor Law administrators",
      "Scientific documentation of childhood nutritional deficiencies in the Victorian era",
      "Humorous celebration of Victorian culinary arts and luxury banquets",
      "Dramatic monologue explaining the rules of workhouse etiquette"
    ],
    answer: "Juxtaposition to expose the greed and institutional hypocrisy of the Poor Law administrators",
    hint: "Placing two stark opposites side-by-side highlights institutional injustice.",
    solution: "Juxtaposing well-fed managers against starving orphans exposes the hypocrisy of Victorian institutions that neglected the poor while enriching themselves.",
    target: "Satirical Technique: 'Oliver Twist'"
  },
  {
    passage: "The old church bell wept in the foggy tower, tolling a mournful dirge for the forgotten souls of London.",
    question: "What figure of speech is used when the bell 'wept in the foggy tower'?",
    options: ["Personification", "Simile", "Metonymy", "Litotes"],
    answer: "Personification",
    hint: "Can an inanimate bronze bell weep tears of sorrow?",
    solution: "Attributing the human emotional act of weeping to a church bell is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', what is the symbolic significance of the small gold locket that belonged to Oliver's mother?",
    options: [
      "It was a magical charm that cured childhood illnesses",
      "It represented Oliver's true identity, noble heritage, and lawful inheritance",
      "It was a stolen piece of jewelry that proved Oliver was a pickpocket",
      "It was the official insignia of the parish workhouse board"
    ],
    answer: "It represented Oliver's true identity, noble heritage, and lawful inheritance",
    hint: "Inside the locket were two locks of hair and a wedding ring inscribed with the name 'Agnes'.",
    solution: "The gold locket is the central tangible symbol of Oliver's lost lineage and lawful inheritance, which Monks sought to destroy.",
    target: "Symbolism: 'Oliver Twist'"
  },
  {
    passage: "Bill Sikes was no gentle lamb when provoked by the London police patrols.",
    question: "What figure of speech is employed in the phrase 'no gentle lamb'?",
    options: ["Litotes", "Hyperbole", "Personification", "Simile"],
    answer: "Litotes",
    hint: "An affirmative point (he was extraordinarily violent) is made by negating its contrary.",
    solution: "Litotes affirms that Sikes was brutal and dangerous by stating he was 'no gentle lamb'.",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'Oliver Twist', why does Monks pay Fagin a large sum of money to ensnare Oliver into a life of crime?",
    options: [
      "He wants Oliver to become a wealthy commercial banker in London",
      "Under their father's will, Oliver forfeits his inheritance if he is convicted of a criminal offense",
      "He wants Oliver to protect him from Bill Sikes",
      "He believes Oliver stole his gold watch at the train terminal"
    ],
    answer: "Under their father's will, Oliver forfeits his inheritance if he is convicted of a criminal offense",
    hint: "Their father's testament stipulated that Oliver would inherit wealth only if his record remained untarnished.",
    solution: "Monks plots to make Oliver a convicted felon because their father's will disqualified Oliver from his inheritance if he committed a crime.",
    target: "Plot Mechanisms: 'Oliver Twist'"
  },
  {
    passage: "The rusty iron hinges shrieked like a wounded animal as Sikes forced open the heavy cellar door.",
    question: "What two literary devices are present in 'shrieked like a wounded animal'?",
    options: [
      "Personification and Simile",
      "Metaphor and Litotes",
      "Alliteration and Synecdoche",
      "Hyperbole and Apostrophe"
    ],
    answer: "Personification and Simile",
    hint: "'Shrieked' gives hinges a human vocal cry; 'like a wounded animal' makes an explicit comparison.",
    solution: "Giving hinges the biological act of shrieking is personification, while comparing the sound using 'like' is a simile.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'Oliver Twist', what role does Mr. Brownlow play in the resolution of the novella?",
    options: [
      "He prosecutes Oliver in the high court for stealing books",
      "He acts as an instrument of justice, uncovering the conspiracy and adopting Oliver as his legal son",
      "He assists Fagin in escaping from Newgate Prison",
      "He purchases the parish workhouse and becomes the new beadle"
    ],
    answer: "He acts as an instrument of justice, uncovering the conspiracy and adopting Oliver as his legal son",
    hint: "He reconstructs the mystery of Oliver's parentage and provides him with a loving home.",
    solution: "Mr. Brownlow represents benevolence and moral order, uncovering Monks's plot, clearing Oliver's name, and formally adopting him.",
    target: "Character Functions: 'Oliver Twist'"
  },
  {
    passage: "The cold rain drummed, clattered, and hissed against the zinc roof of Fagin's dark garret.",
    question: "What literary device is demonstrated by the words 'drummed, clattered, and hissed'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Understatement"],
    answer: "Onomatopoeia",
    hint: "These sound-words directly mimic the acoustic rhythm of falling raindrops.",
    solution: "Words whose sounds phonetically reproduce the noises they describe are examples of onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', how does Dickens use dramatic irony during Oliver's first pickpocketing expedition with the Artful Dodger and Charley Bates?",
    options: [
      "Oliver knows the police are waiting behind the bookstall to arrest them",
      "Oliver innocently believes the boys are running an honest trade, while the reader knows they are pickpocketing Mr. Brownlow",
      "Mr. Brownlow knows Oliver's mother personally before he even turns around",
      "The Artful Dodger accidentally puts his own watch into Mr. Brownlow's pocket"
    ],
    answer: "Oliver innocently believes the boys are running an honest trade, while the reader knows they are pickpocketing Mr. Brownlow",
    hint: "Oliver marvels at how quickly the boys make handkerchiefs, unaware they are stealing them.",
    solution: "Dramatic irony occurs because the reader understands that the boys are criminals, while naive Oliver assumes they are respectable craftsmen.",
    target: "Dramatic Irony: 'Oliver Twist'"
  },
  {
    passage: "The magistrate's heart was a block of solid granite, unaffected by the tears of the starving street children.",
    question: "What figure of speech is used in calling the heart 'a block of solid granite'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "A direct equation without using 'like' or 'as'.",
    solution: "Directly describing an unfeeling disposition as granite without comparative connectives constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', what happens to the villainous Mr. Bumble by the conclusion of the novella?",
    options: [
      "He is knighted by the Queen for his charitable management of the workhouse",
      "He loses his official beadle post due to fraud and ends his days as an impoverished pauper in the very workhouse he once ruled",
      "He becomes the chief magistrate of the London criminal court",
      "He inherits all of Monks's ancestral property in the West Indies"
    ],
    answer: "He loses his official beadle post due to fraud and ends his days as an impoverished pauper in the very workhouse he once ruled",
    hint: "Consider the poetic justice of his downfall.",
    solution: "Dickens delivers poetic justice: Mr. Bumble is stripped of his office for his complicity in concealing Oliver's heritage and becomes a pauper in his own workhouse.",
    target: "Poetic Justice: 'Oliver Twist'"
  },
  {
    passage: "The shadows slithered stealthily across the stone steps of London Bridge as midnight approached.",
    question: "What sound device is highlighted by the repetition of the 's' consonant sound?",
    options: ["Alliteration / Sibilance", "Assonance", "Onomatopoeia", "Rhyme"],
    answer: "Alliteration / Sibilance",
    hint: "Notice the prominent whispering sound produced by the repeated initial 's'.",
    solution: "The continuous recurrence of the initial consonant 's' creates alliteration, specifically known as sibilance.",
    target: "Sound Devices: Sibilance"
  },
  {
    passage: "In 'Oliver Twist', why does Bill Sikes violently murder Nancy in her bedroom?",
    options: [
      "Noah Claypole followed her to London Bridge and reported her secret conversation with Mr. Brownlow to Fagin, who manipulated Sikes into a murderous rage",
      "Nancy stole Sikes's dog Bull's-eye and sold him to a butcher",
      "Nancy refused to cook dinner for the criminal gang",
      "Sikes discovered that Nancy was secretly working as a police constable"
    ],
    answer: "Noah Claypole followed her to London Bridge and reported her secret conversation with Mr. Brownlow to Fagin, who manipulated Sikes into a murderous rage",
    hint: "Fagin used Noah's spying report to convince Sikes that Nancy had betrayed their lives to the authorities.",
    solution: "Fagin distorted Noah's espionage report to make Sikes believe Nancy had betrayed him, triggering Sikes's brutal murder of Nancy.",
    target: "Climactic Causality: 'Oliver Twist'"
  },
  {
    passage: "The moon peered through the ragged clouds like a nervous witness watching a nocturnal crime.",
    question: "What figure of speech is used in 'like a nervous witness'?",
    options: ["Simile", "Metaphor", "Litotes", "Synecdoche"],
    answer: "Simile",
    hint: "Look for the comparative word 'like'.",
    solution: "Comparing the moon's pale light to a frightened human witness using 'like' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', how does Dickens characterize the setting of Jacob's Island where Sikes attempts his final escape?",
    options: [
      "A picturesque, sunlit garden filled with singing birds and fresh flowers",
      "A filthy, repulsive labyrinth of decaying wooden shanties, stagnant black mud, and open sewers",
      "A wealthy residential square inhabited by London's aristocratic elite",
      "A busy commercial seaport crowded with international luxury steamships"
    ],
    answer: "A filthy, repulsive labyrinth of decaying wooden shanties, stagnant black mud, and open sewers",
    hint: "Consider the squalid, dangerous swamp environment of Folly Ditch.",
    solution: "Jacob's Island is described as the most wretched and squalid slum in London, reflecting the moral degradation of Sikes's criminal life.",
    target: "Setting Analysis: 'Oliver Twist'"
  },
  {
    passage: "The terrified fugitive ran through the labyrinth of alleys, hearing a thousand pursuing footsteps behind him.",
    question: "What figure of speech is used in the phrase 'a thousand pursuing footsteps'?",
    options: ["Hyperbole", "Understatement", "Metaphor", "Personification"],
    answer: "Hyperbole",
    hint: "Is it literally a thousand feet, or a dramatic exaggeration of his paranoia?",
    solution: "Exaggerating the sound of pursuit to 'a thousand footsteps' to convey extreme panic is hyperbole.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In 'Oliver Twist', how does Bill Sikes's dog, Bull's-eye, inadvertently cause Sikes's death on the roof?",
    options: [
      "Bull's-eye bites through the chimney rope, causing Sikes to fall into the street",
      "The dog's presence on the rooftop draws the mob's attention, and when the dog leaps toward his master, Sikes slips and hangs himself",
      "Bull's-eye pushes Sikes off the roof into the mud ditch",
      "The dog barks so loudly that Sikes loses his hearing and steps off the ledge"
    ],
    answer: "The dog's presence on the rooftop draws the mob's attention, and when the dog leaps toward his master, Sikes slips and hangs himself",
    hint: "The dog attempts to jump to Sikes on the rope, contributing to the fatal accident.",
    solution: "While Sikes is trying to escape, the dog's attempt to leap to him causes him to lose his footing; the loop slips around his neck, hanging him instantly.",
    target: "Plot Details: 'Oliver Twist'"
  },
  {
    passage: "The courtroom was an icy cavern where justice was measured out in years of penal servitude.",
    question: "What figure of speech is used in calling the courtroom 'an icy cavern'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "Direct equation without using 'like' or 'as'.",
    solution: "Describing the hostile, unfeeling courtroom directly as an icy cavern is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', what is the ultimate fate of the Artful Dodger after he is captured by the authorities?",
    options: [
      "He is pardoned and becomes a clerk in Mr. Brownlow's office",
      "He is sentenced to penal transportation to an overseas penal colony (Australia)",
      "He escapes from custody and becomes a theatrical actor in London",
      "He returns to the workhouse to work as a schoolmaster"
    ],
    answer: "He is sentenced to penal transportation to an overseas penal colony (Australia)",
    hint: "Transportation was the common Victorian punishment for incorrigible thieves.",
    solution: "The Artful Dodger is arrested with a stolen silver snuffbox, convicted, and sentenced to transportation overseas.",
    target: "Character Fate: 'Oliver Twist'"
  },
  {
    passage: "The heavy wooden shutters rattled, clapped, and banged as the winter squall tore through the street.",
    question: "What literary device is prominent in 'rattled, clapped, and banged'?",
    options: ["Onomatopoeia", "Simile", "Hyperbole", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words mimic the real physical sounds of colliding wooden fixtures.",
    solution: "Words whose sounds phonetically echo mechanical collisions are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', what does Rose Maylie discover about her biological relationship to Oliver at the conclusion of the story?",
    options: [
      "She is Oliver's long-lost maternal aunt (the younger sister of his mother, Agnes)",
      "She is Oliver's stepmother",
      "She is Oliver's older half-sister from their father's second marriage",
      "She has no biological connection to Oliver whatsoever"
    ],
    answer: "She is Oliver's long-lost maternal aunt (the younger sister of his mother, Agnes)",
    hint: "Rose was raised by Mrs. Maylie after Agnes Fleming's family scattered.",
    solution: "Mr. Brownlow uncovers that Rose is Agnes Fleming's younger sister, making her Oliver's maternal aunt.",
    target: "Kinship Revelations: 'Oliver Twist'"
  },
  {
    passage: "The condemned prisoner sat in his dark stone cell, awaiting the cold kiss of the executioner's rope.",
    question: "What figure of speech is used in calling the hanging rope's touch 'the cold kiss'?",
    options: ["Metaphor / Personification", "Simile", "Litotes", "Synecdoche"],
    answer: "Metaphor / Personification",
    hint: "The fatal impact of a noose is described through an intimate, ironic human action (kiss).",
    solution: "Describing the noose's fatal contact as a 'cold kiss' blends metaphor with personification.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', how does Dickens portray the legal courtroom of Magistrate Fang during Oliver's trial?",
    options: [
      "As a fair, dignified temple of impartial justice and mercy",
      "As a corrupt, tyrannical mockery of justice where an arrogant magistrate condemns innocent paupers without evidence",
      "As a modern scientific laboratory evaluating criminal psychology",
      "As an empty room where no trials ever took place"
    ],
    answer: "As a corrupt, tyrannical mockery of justice where an arrogant magistrate condemns innocent paupers without evidence",
    hint: "Magistrate Fang is abusive, bad-tempered, and eager to sentence Oliver to hard labor without hearing testimony.",
    solution: "Dickens uses Magistrate Fang to satirize the harsh, biased magistrates of London who treated poor defendants with cruelty.",
    target: "Institutional Satire: 'Oliver Twist'"
  },
  {
    passage: "The young apprentice was not unacquainted with hard physical labor, having scrubbed floors from dawn to dusk.",
    question: "What rhetorical figure of speech is present in 'not unacquainted with hard physical labor'?",
    options: ["Litotes", "Hyperbole", "Simile", "Apostrophe"],
    answer: "Litotes",
    hint: "Negating 'unacquainted' affirms that he is very familiar with hard work.",
    solution: "Litotes affirms familiarity with labor by negating its contrary ('not unacquainted').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'Oliver Twist', what happens to the inheritance left to Monks after the full conspiracy is unmasked by Mr. Brownlow?",
    options: [
      "Monks is executed alongside Fagin at Newgate",
      "Oliver generously shares his inheritance with Monks, who squanders it in the West Indies and dies in a debtors' prison",
      "The entire fortune is confiscated by the British royal treasury",
      "Monks uses the money to build a memorial library for his mother"
    ],
    answer: "Oliver generously shares his inheritance with Monks, who squanders it in the West Indies and dies in a debtors' prison",
    hint: "Oliver shows Christian charity by splitting the inheritance with his villainous half-brother.",
    solution: "Despite Monks's malice, Oliver shares his father's estate; Monks wastes his portion in the Americas and dies in prison.",
    target: "Plot Resolution: 'Oliver Twist'"
  },
  {
    passage: "The dark Thames lapped sullenly against the slimy bridge pilings, whispering murky tales of drowned men.",
    question: "What figure of speech is used when the river lapped 'sullenly... whispering murky tales'?",
    options: ["Personification", "Simile", "Litotes", "Metonymy"],
    answer: "Personification",
    hint: "Attributing human moodiness (sullenly) and speech (whispering tales) to river currents.",
    solution: "Giving river water human moods and storytelling actions is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', what thematic contrast does Dickens draw between the characters of Fagin and Mr. Brownlow?",
    options: [
      "Fagin represents corrupt exploitation and moral degradation, while Mr. Brownlow embodies genuine benevolence and Christian charity",
      "Fagin is a successful merchant, while Mr. Brownlow is an impoverished beggar",
      "Fagin represents the rural countryside, while Mr. Brownlow represents the urban slums",
      "Both characters share identical criminal philosophies regarding destitute youth"
    ],
    answer: "Fagin represents corrupt exploitation and moral degradation, while Mr. Brownlow embodies genuine benevolence and Christian charity",
    hint: "One uses children for theft; the other protects and educates children with selfless love.",
    solution: "Dickens structures the novella around this moral contrast: Fagin exploits youth for personal gain, whereas Brownlow redeems them with compassionate justice.",
    target: "Thematic Duality: 'Oliver Twist'"
  },
  {
    passage: "The old miser clutched his bag of gold sovereigns as tightly as a drowning sailor clings to a wooden spar.",
    question: "What figure of speech is used in 'as tightly as a drowning sailor clings'?",
    options: ["Simile", "Metaphor", "Personification", "Understatement"],
    answer: "Simile",
    hint: "Look for the comparison formula 'as... as'.",
    solution: "Comparing the tight grip to a drowning sailor's grasp using 'as tightly as' forms an explicit simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', what did the old nurse, Old Sally, steal from Oliver's dying mother on her deathbed?",
    options: [
      "A gold locket and ring containing the clues to his identity",
      "A bag of silver sovereigns left by his father",
      "A pair of velvet infant shoes",
      "A signed legal will"
    ],
    answer: "A gold locket and ring containing the clues to his identity",
    hint: "She confessed this theft to Mrs. Corney right before she died.",
    solution: "Old Sally stole the gold locket and wedding ring from Agnes Fleming's body, which Mrs. Corney later sold to Monks.",
    target: "Plot Mechanisms: 'Oliver Twist'"
  },
  {
    passage: "The icy wind blew with such ferocity that it seemed ready to rip the stone gargoyles from the cathedral roof.",
    question: "What figure of speech is used to emphasize the wind's power?",
    options: ["Hyperbole", "Simile", "Litotes", "Metonymy"],
    answer: "Hyperbole",
    hint: "A dramatic overstatement describing the extreme intensity of the gale.",
    solution: "Claiming wind could rip stone masonry from cathedral roofs is an exaggeration for dramatic effect (hyperbole).",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In 'Oliver Twist', what happens to the parish undertaker, Mr. Sowerberry, and his wife?",
    options: [
      "They are imprisoned for poisoning their apprentices",
      "They continue their parochial business, though dominated by Mrs. Sowerberry's shrewish temper",
      "They leave England to join a traveling circus",
      "They adopt Noah Claypole as their legitimate heir"
    ],
    answer: "They continue their parochial business, though dominated by Mrs. Sowerberry's shrewish temper",
    hint: "Mr. Sowerberry was weak-willed and henpecked by his cruel wife.",
    solution: "The Sowerberrys remain in their grim trade, with Mr. Sowerberry continuously cowed by his domineering wife.",
    target: "Secondary Characters: 'Oliver Twist'"
  },
  {
    passage: "The old man was an encyclopaedia of local folklore, having memorized every village legend for sixty years.",
    question: "What figure of speech is used in calling the man 'an encyclopaedia of local folklore'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "Direct identification of a human being as a reference book without 'like' or 'as'.",
    solution: "Equating a knowledgeable individual directly to an encyclopedia without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', why did Dickens include the character of Dick, the dying workhouse boy who blesses Oliver as he runs away to London?",
    options: [
      "To show that all children in workhouses were wicked thieves",
      "To underscore the tragic, unrecorded deaths of innocent children caused by workhouse neglect",
      "To give Oliver a companion during his walk to London",
      "To deliver a letter from the parish board to the Queen"
    ],
    answer: "To underscore the tragic, unrecorded deaths of innocent children caused by workhouse neglect",
    hint: "Dick is frail, dying of malnutrition, yet gives Oliver his pure, loving blessing.",
    solution: "Dick's quiet, untimely death emphasizes the human toll of the Poor Law workhouse system, where vulnerable children perished unnoticed.",
    target: "Thematic Significance: 'Oliver Twist'"
  },
  {
    passage: "The flames leaped, crackled, and snapped hungrily in the dry hearth.",
    question: "What two devices are combined in 'crackled, and snapped hungrily'?",
    options: [
      "Onomatopoeia and Personification",
      "Simile and Metaphor",
      "Litotes and Hyperbole",
      "Alliteration and Synecdoche"
    ],
    answer: "Onomatopoeia and Personification",
    hint: "'Crackled' and 'snapped' mimic sound; 'hungrily' attributes a biological appetite to fire.",
    solution: "'Crackled' and 'snapped' are onomatopoeic, while acting 'hungrily' personifies the fire.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'Oliver Twist', how does Charles Dickens depict the criminal mob that pursues Bill Sikes across the rooftops of Jacob's Island?",
    options: [
      "As a compassionate group of citizens seeking to offer medical aid",
      "As a furious, roaring sea of vengeance demanding retribution for Nancy's murder",
      "As a quiet line of police officers executing a routine warrant",
      "As a gathering of Fagin's friends trying to help Sikes escape"
    ],
    answer: "As a furious, roaring sea of vengeance demanding retribution for Nancy's murder",
    hint: "The mob is depicted as an unstoppable elemental force driven by moral outrage.",
    solution: "Dickens describes the pursuing crowd using oceanic metaphors—a surging, roaring wave of collective fury demanding justice for Nancy.",
    target: "Prose Imagery: 'Oliver Twist'"
  },
  {
    passage: "The lawyer was no amateur in cross-examining hostile witnesses in the magistrate's court.",
    question: "What figure of speech is used in describing an expert advocate as 'no amateur'?",
    options: ["Litotes", "Hyperbole", "Simile", "Personification"],
    answer: "Litotes",
    hint: "Negating 'amateur' asserts strong professional mastery.",
    solution: "Litotes affirms deep courtroom expertise by negating its contrary ('no amateur').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'Oliver Twist', why does Nancy refuse to accept the purse of gold offered by Rose Maylie on London Bridge?",
    options: [
      "She believes the money was stolen from a church collection box",
      "She came out of genuine concern for Oliver's welfare, refusing to profit from her moral act",
      "She was afraid the gold coins were poisoned by Monks",
      "She was already wealthier than Mr. Brownlow"
    ],
    answer: "She came out of genuine concern for Oliver's welfare, refusing to profit from her moral act",
    hint: "She says: 'I came here for the child's sake, not for gold.'",
    solution: "Nancy's refusal proves her moral integrity: her actions stem from genuine love for the child, not financial opportunism.",
    target: "Character Nobility: 'Oliver Twist'"
  },
  {
    passage: "The grandfather clock chimed the midnight hour with twelve heavy, solemn, echoing strokes.",
    question: "What sound device is demonstrated by the word 'chimed'?",
    options: ["Onomatopoeia", "Alliteration", "Assonance", "Consonance"],
    answer: "Onomatopoeia",
    hint: "The word echoes the acoustic resonance of a bell striking.",
    solution: "'Chimed' directly reproduces the bell's ringing sound, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', what is the significance of Oliver's final visit to Fagin in the condemned cell at Newgate Prison?",
    options: [
      "Oliver goes to taunt and mock his former tormentor before he dies",
      "Oliver demonstrates pure, uncorrupted Christian forgiveness by praying for Fagin's soul",
      "Oliver asks Fagin to give him the keys to his secret jewel vault",
      "Oliver helps Fagin escape through the barred prison window"
    ],
    answer: "Oliver demonstrates pure, uncorrupted Christian forgiveness by praying for Fagin's soul",
    hint: "Oliver weeps and kneels, praying for the man who tried to corrupt him.",
    solution: "Oliver's prayers for Fagin illustrate his incorruptible purity: even in the presence of evil, he responds with forgiveness and pity.",
    target: "Moral Resolution: 'Oliver Twist'"
  },
  {
    passage: "The thief's boots were lead weights dragging him down as he fled from the mounted constables.",
    question: "What figure of speech is used in calling the boots 'lead weights'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation without using 'like' or 'as'.",
    solution: "Equating his heavy boots directly to lead weights without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', what message does Dickens deliver through the character of Charley Bates after Nancy's murder?",
    options: [
      "Even hardened young criminals can feel moral horror and reject murder",
      "Charley Bates becomes a more violent killer than Bill Sikes",
      "Charley Bates opens a new pickpocket school in Paris",
      "Charley Bates inherits the parish workhouse"
    ],
    answer: "Even hardened young criminals can feel moral horror and reject murder",
    hint: "Master Charley Bates turns on Sikes in horror when he learns of Nancy's death.",
    solution: "Charley's refusal to shield Sikes reveals that even street thieves draw the line at savage murder, eventually leading Charley to reform.",
    target: "Moral Transformation: 'Oliver Twist'"
  },
  {
    passage: "The church steeple pointed a silent finger toward the starry heavens, reminding mortals of eternity.",
    question: "What figure of speech is used when the steeple 'pointed a silent finger'?",
    options: ["Personification", "Simile", "Understatement", "Apostrophe"],
    answer: "Personification",
    hint: "Giving an architectural spire an anatomical finger and deliberate human gestures.",
    solution: "Attributing a human finger and intentional pointing to a building spire is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', how does the character of Agnes Fleming (Oliver's mother) challenge Victorian moral assumptions?",
    options: [
      "She was an armed highway robber who was feared across London",
      "Although branded by society as an unwed mother, Dickens portrays her with deep pathos, purity, and tragic dignity",
      "She became a wealthy magistrate who abolished the workhouses",
      "She refused to name Oliver because she disliked children"
    ],
    answer: "Although branded by society as an unwed mother, Dickens portrays her with deep pathos, purity, and tragic dignity",
    hint: "Victorian society condemned unwed mothers, but Dickens treats her with reverence and pity.",
    solution: "Dickens challenges the harsh judgment of Victorian society by treating the unmarried, abandoned Agnes as a tragic victim deserving compassion.",
    target: "Social Critique: 'Oliver Twist'"
  },
  {
    passage: "The river rushed through the gorge as wild as a herd of stampeding horses.",
    question: "What figure of speech is used in comparing the river to 'stampeding horses'?",
    options: ["Simile", "Metaphor", "Litotes", "Synecdoche"],
    answer: "Simile",
    hint: "Notice the comparison formula 'as... as'.",
    solution: "Comparing the violent rush of water to horses using 'as wild as' forms an explicit simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', how is the theme of 'Nature versus Nurture' resolved through Oliver's character?",
    options: [
      "Oliver becomes a hardened criminal because he was raised by Fagin and Sikes",
      "Oliver's innate goodness and gentle nature survive untainted despite being nurtured in corrupt, abusive environments",
      "Oliver abandons all morals and moves to the underworld",
      "Oliver's character is shaped entirely by Mr. Bumble's beatings"
    ],
    answer: "Oliver's innate goodness and gentle nature survive untainted despite being nurtured in corrupt, abusive environments",
    hint: "Does his corrupt environment corrupt his soul, or does his inherent purity prevail?",
    solution: "Dickens champions the primacy of innate moral purity: despite workhouse cruelty and Fagin's criminal training, Oliver remains gentle and honest.",
    target: "Core Theme: 'Oliver Twist'"
  },
  {
    passage: "The autumn breeze sighed softly through the weeping willow branches beside the quiet pond.",
    question: "What figure of speech is used when the breeze 'sighed softly'?",
    options: ["Personification", "Simile", "Hyperbole", "Metonymy"],
    answer: "Personification",
    hint: "Giving natural air currents the human emotional act of sighing.",
    solution: "Attributing human vocal respiration and emotional sighing to a breeze is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', what is the central social moral that Charles Dickens leaves with his readers?",
    options: [
      "Paupers and street children are naturally born criminals who deserve imprisonment",
      "Society must treat the poor and vulnerable with compassion, justice, and protection rather than institutional cruelty",
      "Criminal gangs in London should receive state funding to run workhouses",
      "Inheritances should always be confiscated by parish beadles"
    ],
    answer: "Society must treat the poor and vulnerable with compassion, justice, and protection rather than institutional cruelty",
    hint: "Consider the moral outcome of the entire novella.",
    solution: "Dickens' overarching moral appeal is for humanitarian compassion and institutional justice toward the impoverished and vulnerable.",
    target: "Core Moral Vision: 'Oliver Twist'"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Prescribed Text: Charles Dickens' "Oliver Twist" (Nancy on London Bridge)
// =========================================================================
const capstone5B8IntermediateQuestions = [
  {
    questionNumber: 51,
    question: "According to the passage, why did Nancy insist on meeting Mr. Brownlow and Rose Maylie on the dark, slimy stone steps of London Bridge instead of a public street?",
    options: [
      "She wanted to show them the beautiful scenery along the River Thames",
      "She feared for her life, knowing that Bill Sikes would murder her if he saw her speaking with them in public",
      "She was waiting for a passenger ferry to take her to America",
      "Mr. Brownlow preferred the damp river mist to the city streets"
    ],
    answer: "She feared for her life, knowing that Bill Sikes would murder her if he saw her speaking with them in public",
    hint: "Review Nancy's words in paragraph 3: 'If I was seen talking with you in the open street, my life would not be worth twenty minutes' purchase.'",
    solution: "Nancy explains in paragraph 3 that meeting in the open street would cost her life, as Sikes would kill her if he discovered she was meeting them.",
    target: "Capstone Exam: Character Motivation"
  },
  {
    questionNumber: 52,
    question: "What figure of speech is employed in paragraph 1 when Dickens describes the river atmosphere: 'the mist from the Thames hung like a funeral shroud over the river'?",
    options: [
      "Simile (comparing the hanging mist to a burial garment using 'like')",
      "Metaphor (directly identifying the mist as a corpse without 'like')",
      "Onomatopoeia (imitating the sound of river waves)",
      "Apostrophe (addressing the river directly)"
    ],
    answer: "Simile (comparing the hanging mist to a burial garment using 'like')",
    hint: "Notice the comparison formula 'hung like a funeral shroud'.",
    solution: "Comparing the thick, gloomy river mist to a burial cloth ('funeral shroud') using 'like' constitutes an evocative simile foreshadowing death.",
    target: "Capstone Exam: Figurative Language Decoding"
  },
  {
    questionNumber: 53,
    question: "According to paragraph 5, what crucial conspiracy regarding Oliver's identity and inheritance does Nancy disclose to Mr. Brownlow?",
    options: [
      "Oliver is the rightful heir to the British monarchy",
      "Monks is Oliver's own half-brother, who paid Fagin to make Oliver a convicted criminal so Monks could keep their father's entire estate",
      "Mr. Bumble was Oliver's biological father who hid his identity",
      "Oliver was an apprentice to an undertaker who stole all of his family's jewels"
    ],
    answer: "Monks is Oliver's own half-brother, who paid Fagin to make Oliver a convicted criminal so Monks could keep their father's entire estate",
    hint: "Look at the revelation in paragraph 5 regarding Monks and their dead father's inheritance.",
    solution: "Nancy discloses that Monks is Oliver's half-brother, who plotted with Fagin to ruin Oliver criminally to secure their deceased father's entire fortune.",
    target: "Capstone Exam: Plot Analysis"
  },
  {
    questionNumber: 54,
    question: "What dramatic irony is revealed in the final sentence of the passage?",
    options: [
      "The reader and narrator know that Noah Claypole was hiding in the shadows eavesdropping on Nancy, while Nancy is completely unaware of his presence",
      "Mr. Brownlow was secretly working with Bill Sikes all along",
      "Rose Maylie was actually Oliver's mother in disguise",
      "Nancy took the purse of gold and escaped to the countryside"
    ],
    answer: "The reader and narrator know that Noah Claypole was hiding in the shadows eavesdropping on Nancy, while Nancy is completely unaware of his presence",
    hint: "Notice the contrast between Nancy's departure and Noah crouched listening in the dark.",
    solution: "Dramatic irony exists because the reader is shown that Noah Claypole overheard Nancy's disclosures, while Nancy flees believing her secret is safe, sealing her doom.",
    target: "Capstone Exam: Dramatic Irony Analysis"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the central noble virtue Nancy displays in this excerpt.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Nancy risks her life selflessly to protect Oliver.",
      "Because Nancy loved Oliver, she met Mr. Brownlow on London Bridge to save the boy.",
      "Meeting Mr. Brownlow on the dark stone steps of London Bridge to save Oliver.",
      "Selfless love."
    ],
    answer: "Nancy risks her life selflessly to protect Oliver.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Nancy risks her life selflessly to protect Oliver' is exactly 8 words, forms a complete Subject-Verb-Object sentence, and captures her noble virtue. Option C is a fragment (0 marks), and Option B has 15 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployCockcrowB8Intermediate() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();
  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Cockcrow Intermediate Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B8IntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_C_I_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B8.2.2.1 / B8.2.3.1: Analyze character motivations, moral conflicts, social satire, dramatic irony, and symbolic motifs in Charles Dickens' 'Oliver Twist'."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8IntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${nancyLondonBridgeCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_C_I_${item.questionNumber}`,
      level: "B8",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: nancyLondonBridgeCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.2.2.1 / B8.2.3.1: Multi-paragraph textual analysis of Victorian dramatic prose, evaluating dramatic irony, moral sacrifice, and formulating concise thematic summaries."
    });
  });

  // 3. Write directly to Firestore subcollections
  const topicIds = ["literature_cockcrow_canon", "cockcrow_literary_devices"];
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B8_intermediate)...");
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B8_intermediate`);
      await subDocRef.set({
        level: "B8",
        difficulty: "intermediate",
        title: "Basic 8 Intermediate Lab: 50 Unique Oliver Twist Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Literary Nuance, Social Satire & Character Motivations) + 5 Capstone Full-Passage Questions",
          passageVisibility: "Passage embedded both in passageText and at the top of prompt",
          curriculum: "NaCCA Common Core Programme (CCP) Standard",
          prescribedTextsCovered: ["Oliver Twist by Charles Dickens"],
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
      console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
    }
  }

  // 4. Synchronize into main document practicePool.medium for b8 and jhs2
  console.log("\nSynchronizing main document practicePool.medium for b8 and jhs2...");
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

  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const mainRef = db.doc(`${parent}/${topicId}`);
      const snap = await mainRef.get();
      if (snap.exists) {
        const data = snap.data() || {};
        const existingLevels = data.levels || {};
        const b8Level = existingLevels.b8 || {};
        const jhs2Level = existingLevels.jhs2 || {};

        const updatedLevels = {
          ...existingLevels,
          b8: {
            ...b8Level,
            practicePool: {
              ...(b8Level.practicePool || {}),
              medium: mappedMediumQuestions
            }
          },
          jhs2: {
            ...jhs2Level,
            practicePool: {
              ...(jhs2Level.practicePool || {}),
              medium: mappedMediumQuestions
            }
          }
        };

        await mainRef.set({
          ...data,
          levels: updatedLevels,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log(`✅ Updated main document practicePool.medium at: ${mainRef.path}`);
      }
    }
  }

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B8 Intermediate!`);
}

deployCockcrowB8Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B8 Intermediate Lab:", err);
    process.exit(1);
  });

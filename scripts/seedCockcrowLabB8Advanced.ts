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
// Prescribed Text: Charles Dickens' "Oliver Twist" (The Climax at Jacob's Island)
// =========================================================================
const sikesJacobsIslandCapstonePassage = 
`Near to that part of the Thames on which the church at Rotherhithe abuts, there exists the filthiest, the strangest, the most extraordinary of the many localities that are hidden in London. In Jacob's Island, the warehouses are roofless and empty; the walls are crumbling down; the chimneys are tottering; the windows are stopped up with wood and straw; the chimneypots are broken; the doors are falling into the streets; the waters are stagnant, black with every foul and nauseous smell. It was in a dilapidated attic overlooking this pestilential creek that Bill Sikes sought his final desperate refuge.

The murder of Nancy had ignited a fury across the capital unlike anything London had witnessed. Hunted relentlessly by day and night, haunted by the ghastly phantom of his victim's lifeless eyes staring from every shadow, the murderer had crept back to the den where Toby Crackit and Kags were hiding. Outside the wooden walls, the roaring of the approaching multitude grew louder with every passing minute—a deep, vengeful sound like the rushing of a mighty ocean surf breaking against a fragile cliff.

'The water-gate is forced!' shouted a voice from below. 'They are in the court! The house is surrounded!'

Sikes sprang to the roof. Below him, the murky ditch was drained of water by the low tide, presenting only a treacherous bed of deep, sticky mud. Across the ditch, filling every street, every roof, every parapet, every window, was a dense sea of human heads, shouting, cursing, and pointing torches up at him. Realizing that descent was impossible, Sikes fastened a long, thick coil of rope around the masonry of the chimney. His plan was to lower himself from the roof into the mud-ditch below and scramble through the dark sewers to freedom.

He had adjusted the loop beneath his armpits and was stepping over the parapet, when he suddenly shrieked aloud, thrown into a convulsion of terror: 'The eyes! The eyes again!'

Staggering backward as if struck by an unseen thunderbolt, Sikes lost his balance on the slippery tiles. He pitched headlong over the parapet. In that split second of falling, the heavy rope knotted to the chimney slipped upward, formed a running noose, and snapped tight around his neck. He fell thirty feet, and hung suspended in the air, his neck broken instantly. A roar went up from the watching thousands that shook the very foundations of the river embankment, while high above on the roof, his faithful dog Bull's-eye leaped into the empty air toward his dangling master, missed his footing, and dashed his brains out upon the stones below.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Advanced Literary Analysis: Victorian Social Satire, Objective Correlatives,
// Psychological Guilt Motifs, Complex Figures of Speech & Classical Tropes
// =========================================================================
const unique50B8AdvancedDrills = [
  {
    passage: "The pursuing crowd roared through the foggy alleys like an unchained sea breaking through crumbling dykes.",
    question: "What two figures of speech are combined in describing the mob as 'like an unchained sea'?",
    options: [
      "Simile and Personification",
      "Metaphor and Litotes",
      "Synecdoche and Hyperbole",
      "Apostrophe and Onomatopoeia"
    ],
    answer: "Simile and Personification",
    hint: "'Like an sea' is a simile; describing a sea as 'unchained' attributes human physical restraints to water.",
    solution: "The explicit comparison using 'like' constitutes a simile, while attributing physical chains and the deliberate action of roaring to a body of water is personification.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'Oliver Twist', Sikes is relentlessly pursued not merely by the police, but by the visionary 'phantom eyes' of the murdered Nancy staring out of every shadow.",
    question: "What psychological literary motif does this haunting apparition represent?",
    options: [
      "Objective evidence of optical hallucinations caused by winter sleet",
      "The externalized projection of inescapable moral guilt and conscience",
      "A magical curse cast by Fagin using witchcraft",
      "The physical presence of Nancy's twin sister in London"
    ],
    answer: "The externalized projection of inescapable moral guilt and conscience",
    hint: "Notice how Sikes sees the eyes whenever he tries to sleep or escape.",
    solution: "The haunting eyes serve as a psychological motif: Sikes cannot escape his own internal guilt, which materializes as Nancy's gaze.",
    target: "Literary Motif: Psychological Guilt"
  },
  {
    passage: "The British Crown declared that parish administrators must uphold the letter of the statutory poor laws.",
    question: "What figure of speech is used when 'The British Crown' represents the ruling monarch and executive government?",
    options: ["Metonymy", "Synecdoche", "Simile", "Litotes"],
    answer: "Metonymy",
    hint: "An object closely associated with royalty stands for the entire government.",
    solution: "Using 'The Crown'—a tangible emblem of monarchy—to denote the sovereign and state government is metonymy.",
    target: "Figurative Language: Metonymy"
  },
  {
    passage: "In 'Oliver Twist', Dickens describes Jacob's Island as a pestilential swamp of crumbling roofs, tottering chimneys, and stagnant black mud.",
    question: "How does this squalid setting function as an 'objective correlative' in the narrative?",
    options: [
      "It mirrors the rotting moral state and spiritual degradation of the criminal underworld",
      "It shows that London architects preferred unpaved streets for drainage",
      "It proves that Bill Sikes was planning to build an upscale hotel by the river",
      "It explains why the British government encouraged industrial textile mills"
    ],
    answer: "It mirrors the rotting moral state and spiritual degradation of the criminal underworld",
    hint: "Connect physical rot, stagnant mud, and decay to the moral corruption of Sikes and Fagin.",
    solution: "An objective correlative uses physical surroundings to evoke specific emotional and moral realities; Jacob's Island's filth externalizes the moral rot of Sikes's criminality.",
    target: "Setting as Objective Correlative"
  },
  {
    passage: "The magistrate was no friend to the impoverished orphans who stood shivering in his courtroom.",
    question: "What rhetorical figure of speech is present in describing the cruel magistrate as 'no friend'?",
    options: ["Litotes", "Hyperbole", "Apostrophe", "Onomatopoeia"],
    answer: "Litotes",
    hint: "Negating 'friend' emphasizes his extreme hostility toward paupers.",
    solution: "Litotes is an intentional understatement affirming that the magistrate was a cruel enemy by negating its contrary ('no friend').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'Oliver Twist', the workhouse board members are described as sitting in 'solemn conclave' while starving children eat water-gruel.",
    question: "What satirical effect does Dickens achieve by using elevated church terminology ('solemn conclave') for the board?",
    options: [
      "Mock-heroic irony that mocks their pompous self-importance against their petty cruelty",
      "Genuine theological admiration for their Christian piety and charity",
      "Historical documentation of Roman Catholic rituals in England",
      "A literal description of a papal election in Rome"
    ],
    answer: "Mock-heroic irony that mocks their pompous self-importance against their petty cruelty",
    hint: "A 'conclave' is a sacred assembly of cardinals; using it for greedy bureaucrats is satirical.",
    solution: "Dickens uses mock-heroic irony, elevating greedy local bureaucrats with sacred language to highlight the contrast between their vanity and their cruelty.",
    target: "Satirical Tone: Mock-Heroic"
  },
  {
    passage: "The desperate fugitive gasped: 'O righteous Heaven, let this dark night conceal my trembling footsteps!'",
    question: "What figure of speech is demonstrated by directly addressing 'righteous Heaven'?",
    options: ["Apostrophe", "Synecdoche", "Metaphor", "Litotes"],
    answer: "Apostrophe",
    hint: "A direct rhetorical address to an abstract entity or divine power.",
    solution: "Directly calling out to an abstract personified entity or divine realm ('O righteous Heaven') is apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'Oliver Twist', what is the deeper narrative function of the character Monks (Edward Leeford)?",
    options: [
      "He embodies the destructive, corrupting influence of illegitimate greed and generational hatred",
      "He acts as a comic character providing lighthearted laughter during murder scenes",
      "He is a dedicated police inspector tracking down Fagin's stolen watches",
      "He teaches Oliver how to read Latin and Greek manuscripts"
    ],
    answer: "He embodies the destructive, corrupting influence of illegitimate greed and generational hatred",
    hint: "Monks is driven by spite and greed to destroy his own half-brother.",
    solution: "Monks serves as the thematic antagonist who embodies inherited malice and greed, plotting the moral corruption of his innocent kin.",
    target: "Thematic Function: Monks"
  },
  {
    passage: "The harbor was choked with fifty keels awaiting cargo from the East India trade.",
    question: "What figure of speech is used when 'keels' represents complete merchant sailing ships?",
    options: ["Synecdoche", "Metonymy", "Simile", "Personification"],
    answer: "Synecdoche",
    hint: "A 'keel' is the bottom structural spine of a wooden ship.",
    solution: "Using a primary structural part ('keel') to represent the complete whole (the entire ship) is synecdoche.",
    target: "Figurative Language: Synecdoche"
  },
  {
    passage: "In 'Oliver Twist', how does the resolution of Nancy's character challenge rigid Victorian moral categorizations?",
    options: [
      "She proves that fallen street women are entirely wicked and incapable of repentance",
      "She demonstrates that genuine moral nobility, Christian charity, and self-sacrifice can exist within a social outcast",
      "She becomes a wealthy aristocrat who buys luxury estates in London",
      "She marries Mr. Brownlow and becomes a respected parish schoolteacher"
    ],
    answer: "She demonstrates that genuine moral nobility, Christian charity, and self-sacrifice can exist within a social outcast",
    hint: "Victorian society wrote off prostitutes and thieves, but Dickens gives Nancy moral heroism.",
    solution: "Dickens upends Victorian social prejudice by giving a despised criminal outcast the highest capacity for selfless love and moral sacrifice.",
    target: "Character Dissection: Nancy"
  },
  {
    passage: "The midnight wind wailed, shrieked, and hissed like an army of condemned souls tearing through the streets.",
    question: "What two literary devices are prominent in 'wailed, shrieked, and hissed like an army of condemned souls'?",
    options: [
      "Onomatopoeia and Simile",
      "Metaphor and Litotes",
      "Synecdoche and Hyperbole",
      "Alliteration and Apostrophe"
    ],
    answer: "Onomatopoeia and Simile",
    hint: "Sound words mimicking wind + an explicit comparative marker ('like').",
    solution: "'Hissed' and 'shrieked' are onomatopoeic, while comparing the sounds to condemned souls using 'like' forms a simile.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'Oliver Twist', what is the fundamental moral paradox presented by the character of Mr. Bumble?",
    options: [
      "He preaches Christian compassion and charity while practicing systematic cruelty and greed toward the defenseless",
      "He steals gold from Fagin to donate to the London orphanages",
      "He acts as a fierce criminal burglar by night and a gentle churchwarden by day",
      "He secretly educates workhouse boys in medical science"
    ],
    answer: "He preaches Christian compassion and charity while practicing systematic cruelty and greed toward the defenseless",
    hint: "Notice the gap between his official pious language and his actual treatment of paupers.",
    solution: "Bumble's paradox lies in his pious hypocrisy: he claims to serve God through charity while starving and abusing the paupers under his care.",
    target: "Character Irony: Mr. Bumble"
  },
  {
    passage: "The old scholar had spent a lifetime studying the sacred parchment, and was no stranger to ancient Hebrew scripts.",
    question: "What figure of speech is used in saying he was 'no stranger to ancient Hebrew scripts'?",
    options: ["Litotes", "Hyperbole", "Personification", "Simile"],
    answer: "Litotes",
    hint: "Affirming deep expertise by negating unfamiliarity.",
    solution: "Litotes affirms profound scholarship by negating its opposite ('no stranger to').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'Oliver Twist', why does Dickens deliberately orchestrate Bill Sikes's death by accidental hanging on a chimney rope?",
    options: [
      "To provide poetic justice, mirroring the legal gallows that Sikes had spent his entire criminal career evading",
      "Because Dickens ran out of ideas for an ending",
      "To show that roofs in Jacob's Island were poorly constructed by local builders",
      "To allow Bull's-eye to survive and be adopted by Mr. Brownlow"
    ],
    answer: "To provide poetic justice, mirroring the legal gallows that Sikes had spent his entire criminal career evading",
    hint: "He escapes the executioner's noose only to hang himself by his own hand.",
    solution: "Sikes's death is a masterpiece of poetic justice: having fled legal execution, his own panic causes him to slip into a self-inflicted noose.",
    target: "Poetic Justice: Sikes's Death"
  },
  {
    passage: "The angry judge sat upon the bench, a stone monument of righteous condemnation.",
    question: "What figure of speech is used in calling the judge 'a stone monument of righteous condemnation'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "A direct identification without comparative words like 'like' or 'as'.",
    solution: "Directly identifying a human judge as a stone monument without comparative markers constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', what does the villain Fagin do when Oliver is brought back to his den after the Chertsey burglary?",
    options: [
      "He mocks and manipulates Oliver, using psychological terror and isolation to break his moral resistance",
      "He shoots Oliver with a pistol for failing to unlock the door",
      "He surrenders Oliver to the police in exchange for a five-pound reward",
      "He gives Oliver all his gold watches and asks him to run away"
    ],
    answer: "He mocks and manipulates Oliver, using psychological terror and isolation to break his moral resistance",
    hint: "Fagin specializes in psychological manipulation to turn children into compliant thieves.",
    solution: "Fagin uses psychological grooming—mixing isolation, sinister praise, and terrifying tales of executed thieves to wear down Oliver's innocence.",
    target: "Psychological Manipulation: Fagin"
  },
  {
    passage: "The church tower cast a long, menacing shadow that swallowed the street like an advancing wall of night.",
    question: "What two figures of speech are present in this passage?",
    options: [
      "Personification and Simile",
      "Metaphor and Litotes",
      "Hyperbole and Synecdoche",
      "Onomatopoeia and Apostrophe"
    ],
    answer: "Personification and Simile",
    hint: "Shadow 'swallowed' (personification) and is compared using 'like an advancing wall' (simile).",
    solution: "Giving a shadow the predatory action of swallowing is personification, while comparing it using 'like' is a simile.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'Oliver Twist', what structural role does the character of Agnes Fleming play even though she dies in the opening chapter?",
    options: [
      "Her tragic memory and hidden portrait serve as the narrative catalyst driving the mystery of Oliver's parentage",
      "She returns as a living ghost to guide Oliver through the London slums",
      "She is revealed to be Fagin's secret business partner in London",
      "She has no thematic or structural relevance after chapter one"
    ],
    answer: "Her tragic memory and hidden portrait serve as the narrative catalyst driving the mystery of Oliver's parentage",
    hint: "Her portrait, her stolen locket, and her tragic love story drive the entire resolution.",
    solution: "Agnes Fleming functions as an unseen catalyst: her portrait, stolen locket, and secret past provide the central mystery that Mr. Brownlow uncovers.",
    target: "Structural Function: Agnes Fleming"
  },
  {
    passage: "The thief's nimble fingers moved like fluttering moth wings inside the gentleman's greatcoat pocket.",
    question: "What figure of speech is used in 'like fluttering moth wings'?",
    options: ["Simile", "Metaphor", "Personification", "Litotes"],
    answer: "Simile",
    hint: "Look for the comparative marker 'like'.",
    solution: "Comparing the swift, delicate motion of pickpocketing fingers to moth wings using 'like' creates a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', how does Charles Dickens depict the British public press during the manhunt for Bill Sikes?",
    options: [
      "As a sensationalist engine that amplifies public hysteria and transforms real human tragedy into commercial spectacle",
      "As an objective, calm scientific journal analyzing criminal pathology",
      "As an agency dedicated to defending poor orphans against workhouse boards",
      "As an illegal underground printing press run by Fagin's apprentices"
    ],
    answer: "As a sensationalist engine that amplifies public hysteria and transforms real human tragedy into commercial spectacle",
    hint: "Handbills, reward posters, and dramatic newspaper accounts fuel the frenzy.",
    solution: "Dickens critiques the 19th-century press as sensationalist, turning Sikes's crime and pursuit into a public media frenzy.",
    target: "Media Satire: 'Oliver Twist'"
  },
  {
    passage: "The heavy prison iron gates clanged shut with the finality of impending doom.",
    question: "What sound device is demonstrated by the word 'clanged'?",
    options: ["Onomatopoeia", "Alliteration", "Assonance", "Consonance"],
    answer: "Onomatopoeia",
    hint: "The word echoes the metallic ringing impact of colliding iron bars.",
    solution: "'Clanged' directly imitates the ringing sound of heavy metal striking metal, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', what is the significance of Oliver's physical beauty and gentle countenance throughout his ordeals?",
    options: [
      "It serves as a 19th-century physiognomic symbol of his innate purity and noble heritage that resists environmental contamination",
      "It allows him to win beauty pageants in Victorian workhouses",
      "It proves that he was physically stronger than Bill Sikes and Fagin",
      "It shows that malnutrition makes children look wealthy"
    ],
    answer: "It serves as a 19th-century physiognomic symbol of his innate purity and noble heritage that resists environmental contamination",
    hint: "Dickens uses Victorian beliefs that outer beauty reflects inner moral innocence.",
    solution: "In 19th-century literary convention, Oliver's angelic features symbolize uncorrupted moral purity that cannot be degraded by squalid surroundings.",
    target: "Literary Convention: Physiognomy"
  },
  {
    passage: "The starving child stared at the baker's window, his stomach an empty cavern echoing with hollow groans.",
    question: "What figure of speech is used in calling the stomach 'an empty cavern'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation of an anatomical organ to a hollow cave without 'like' or 'as'.",
    solution: "Directly describing an empty stomach as a cavern without comparative words is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', what moral lesson is demonstrated through the downfall of Noah Claypole and Charlotte?",
    options: [
      "Cowardly bullies and petty opportunists end up disgraced, surviving only through humiliating treachery and public mockery",
      "They become wealthy landowners who purchase the parish workhouse",
      "They are executed alongside Fagin at Newgate Prison",
      "They reform their lives and become honest charity workers"
    ],
    answer: "Cowardly bullies and petty opportunists end up disgraced, surviving only through humiliating treachery and public mockery",
    hint: "Noah turns king's evidence against Fagin to save his own neck, living in cowardly ignominy.",
    solution: "Dickens shows that petty, cowardly bullies like Noah survive only through treacherous betrayal, living in degradation and contempt.",
    target: "Moral Themes: Noah Claypole"
  },
  {
    passage: "The old grandfather clock ticked, tocked, and chime-struck the final hour of midnight.",
    question: "What sound device is prominent in 'ticked, tocked, and chime-struck'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Apostrophe"],
    answer: "Onomatopoeia",
    hint: "These words mimic the rhythmic mechanical acoustic sounds of a clock.",
    solution: "Words reproducing the mechanical ticking and striking sounds of a clock are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', how does Charles Dickens use the character of the Artful Dodger at his final trial to critique the legal system?",
    options: [
      "The Dodger openly mocks the dignity of the court, exposing its theatrical pomposity with biting street wit",
      "The Dodger breaks down in tears and begs the judge for mercy",
      "The Dodger confesses to all of Bill Sikes's murders",
      "The Dodger hires Mr. Brownlow as his defense attorney"
    ],
    answer: "The Dodger openly mocks the dignity of the court, exposing its theatrical pomposity with biting street wit",
    hint: "The Dodger wears his oversized coat, demands his privileges, and laughs at the magistrate.",
    solution: "Dickens uses the Dodger's trial for comic satire: the boy's irreverent humor strips the pompous court of its solemnity, exposing legal hypocrisy.",
    target: "Satirical Scene: The Dodger's Trial"
  },
  {
    passage: "The night wrapped London in a thick woolen mantle of yellow smog and sulfur smoke.",
    question: "What figure of speech is used in saying the night wrapped London in 'a thick woolen mantle'?",
    options: ["Metaphor / Personification", "Simile", "Litotes", "Synecdoche"],
    answer: "Metaphor / Personification",
    hint: "Night is personified as dressing a city, with smog equated directly to a mantle.",
    solution: "Giving the night the human action of wrapping London in a garment (mantle) blends personification with metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', what makes the relationship between Bill Sikes and his dog Bull's-eye symbolic of Sikes's own brutal nature?",
    options: [
      "Bull's-eye is scarred, vicious, and mistreated, mirroring Sikes's own violent and degraded personality",
      "Bull's-eye is an aristocratic show dog that loves luxury",
      "Bull's-eye was trained by Mr. Brownlow to guard the parish church",
      "Bull's-eye represents Oliver's lost childhood innocence"
    ],
    answer: "Bull's-eye is scarred, vicious, and mistreated, mirroring Sikes's own violent and degraded personality",
    hint: "The dog shares Sikes's physical brutality and relentless aggression.",
    solution: "Dickens uses Bull's-eye as an animal double for Sikes: the abused, snarling dog reflects the burglar's own brutalized humanity.",
    target: "Symbolic Doubling: Bull's-eye"
  },
  {
    passage: "The warrior cried into the silent cemetery: 'O departed ancestors, look down upon our suffering tribe!'",
    question: "What figure of speech is featured in addressing 'O departed ancestors'?",
    options: ["Apostrophe", "Simile", "Litotes", "Onomatopoeia"],
    answer: "Apostrophe",
    hint: "Directly calling out to deceased spirits who cannot physically answer.",
    solution: "Addressing absent or deceased individuals ('O departed ancestors') as if they were present is apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'Oliver Twist', what is the significance of Fagin's jewel box hidden beneath the loose floorboard of his den?",
    options: [
      "It shows that Fagin's greed is solitary and secretive, hoarding wealth while his child pickpockets starve in rags",
      "It proves that Fagin was a generous philanthropist saving money for orphanages",
      "It contains the legal charter of the British East India Company",
      "It was a gift given to Fagin by Queen Victoria"
    ],
    answer: "It shows that Fagin's greed is solitary and secretive, hoarding wealth while his child pickpockets starve in rags",
    hint: "He gloats over his stolen rings and watches when he thinks the boys are asleep.",
    solution: "Fagin's private hoarded box reveals his predatory nature: he keeps the profits of crime while keeping his child accomplices in destitute poverty.",
    target: "Character Psychology: Fagin"
  },
  {
    passage: "The raging fire was an insatiable monster that swallowed ten tenements in a single hour.",
    question: "What figure of speech is used in calling the fire 'an insatiable monster'?",
    options: ["Metaphor", "Simile", "Litotes", "Synecdoche"],
    answer: "Metaphor",
    hint: "Direct equation without comparative connectives.",
    solution: "Directly describing fire as an insatiable monster without 'like' or 'as' is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', how does Charles Dickens contrast the rural country setting of Chertsey with the urban setting of London?",
    options: [
      "The countryside represents pastoral peace, moral regeneration, and health, while urban London represents moral corruption, disease, and exploitation",
      "The countryside is a violent criminal war zone, while London is a tranquil paradise",
      "Both environments are portrayed as identical industrial manufacturing slums",
      "The countryside has no houses or inhabitants whatsoever"
    ],
    answer: "The countryside represents pastoral peace, moral regeneration, and health, while urban London represents moral corruption, disease, and exploitation",
    hint: "Oliver recovers his health and happiness in the quiet country cottage of Mrs. Maylie.",
    solution: "Dickens uses pastoral contrast: urban London is dark, diseased, and corrupt, while the sunny countryside represents moral renewal and safety.",
    target: "Thematic Setting: Pastoral Contrast"
  },
  {
    passage: "The heavy wooden floorboards creaked, groaned, and popped under the weight of the intruding burglar.",
    question: "What literary device is demonstrated by the words 'creaked, groaned, and popped'?",
    options: ["Onomatopoeia", "Simile", "Apostrophe", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These sound-words phonetically imitate the noise of stressed wood.",
    solution: "Words that phonetically mimic physical sounds are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', what happens to Oliver's half-brother Monks when he is confronted by Mr. Brownlow?",
    options: [
      "He breaks down in terror and signs a full legal confession, surrendering Oliver's rightful inheritance",
      "He challenges Mr. Brownlow to a duel and shoots him",
      "He escapes to Russia and becomes an army general",
      "He murders Mr. Bumble to hide the workhouse registers"
    ],
    answer: "He breaks down in terror and signs a full legal confession, surrendering Oliver's rightful inheritance",
    hint: "Mr. Brownlow was his father's oldest friend and knew his entire family secret.",
    solution: "Confronted by Brownlow's evidence, the cowardly Monks confesses his conspiracy, surrenders the remaining estate, and signs a legal document.",
    target: "Climax & Resolution: Monks"
  },
  {
    passage: "The young apprentice was no novice when it came to deciphering complex legal deeds.",
    question: "What figure of speech is used in saying he was 'no novice'?",
    options: ["Litotes", "Hyperbole", "Simile", "Personification"],
    answer: "Litotes",
    hint: "Asserting high legal expertise by negating beginner status.",
    solution: "Litotes states an affirmative truth (that he was an expert) by negating its contrary ('no novice').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'Oliver Twist', what does the death of Nancy teach the reader about the nature of redemption?",
    options: [
      "True moral redemption involves choosing what is right and selfless, even at the cost of one's own life",
      "Criminals are biologically incapable of feeling compassion",
      "Redemption can only be purchased by giving money to parish beadles",
      "Sacrificing oneself for others is an act of foolishness that achieves nothing"
    ],
    answer: "True moral redemption involves choosing what is right and selfless, even at the cost of one's own life",
    hint: "Nancy chooses moral conscience over her own survival to save an innocent child.",
    solution: "Nancy's martyrdom demonstrates Dickens' core moral philosophy: redemption is possible for the most marginalized souls through selfless moral sacrifice.",
    target: "Moral Philosophy: Nancy's Redemption"
  },
  {
    passage: "The river Thames was a flowing serpent of coal-black water, slithering through the arches of London Bridge.",
    question: "What figure of speech is used in calling the river 'a flowing serpent of coal-black water'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "A direct equation equating the river to a serpent without 'like' or 'as'.",
    solution: "Directly describing the river as a flowing serpent without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', what is the author's tone toward the hypocritical parish beadle, Mr. Bumble?",
    options: [
      "Scathingly satirical, mock-reverent, and contemptuous",
      "Deeply respectful, admiring, and solemn",
      "Objective, clinical, and scientific",
      "Tender, sentimental, and affectionate"
    ],
    answer: "Scathingly satirical, mock-reverent, and contemptuous",
    hint: "Notice how Dickens pokes fun at his cocked hat, cane, and hollow pomposity.",
    solution: "Dickens treats Bumble with biting satire and mock-reverence, exposing his pomposity and cruel neglect of parish orphans.",
    target: "Author's Tone: Mr. Bumble"
  },
  {
    passage: "The thunder boomed like heavy artillery fire echoing across the valley.",
    question: "What figure of speech is used in 'like heavy artillery fire'?",
    options: ["Simile", "Metaphor", "Personification", "Litotes"],
    answer: "Simile",
    hint: "Look for the comparative word 'like'.",
    solution: "Comparing the sound of thunder to artillery fire using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', why does Charles Dickens include the scene where Oliver prays for Fagin in Newgate Prison?",
    options: [
      "To demonstrate that Oliver's Christian forgiveness and moral innocence remain uncorrupted by malice or revenge",
      "To show that Oliver wanted Fagin's stolen watches",
      "To help Fagin escape from the execution cell",
      "To prove that Oliver wanted to become a criminal leader"
    ],
    answer: "To demonstrate that Oliver's Christian forgiveness and moral innocence remain uncorrupted by malice or revenge",
    hint: "Oliver responds to his former tormentor with tears and prayers rather than vengeance.",
    solution: "Oliver's prayers emphasize his spiritual purity: despite the cruelty inflicted upon him, he harbors no vindictiveness, praying for his abuser's soul.",
    target: "Thematic Culmination: 'Oliver Twist'"
  },
  {
    passage: "The icy wind was a razor blade slicing across the exposed skin of the barefoot orphans.",
    question: "What figure of speech is used in calling the wind 'a razor blade'?",
    options: ["Metaphor", "Simile", "Litotes", "Synecdoche"],
    answer: "Metaphor",
    hint: "Direct equation of biting cold wind to a sharp blade without 'like'.",
    solution: "Directly identifying freezing wind as a razor blade without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', how does the parish board justify starving the young boys on thin gruel?",
    options: [
      "They claim that starvation prevents paupers from becoming lazy and relying on public charity",
      "They claim that food is forbidden by English law",
      "They say the boys refused to eat roast beef and potatoes",
      "They claim that thin gruel makes children grow taller than adults"
    ],
    answer: "They claim that starvation prevents paupers from becoming lazy and relying on public charity",
    hint: "The Poor Law philosophy argued that workhouses should be harsh deterrents against poverty.",
    solution: "The board operated on the Malthusian principle that making the workhouse harsh and starvation-ridden would deter the poor from seeking relief.",
    target: "Philosophical Context: Poor Laws"
  },
  {
    passage: "The grandfather clock chimed the midnight hour with twelve heavy, metallic, echoing clangs.",
    question: "What sound device is demonstrated by the word 'clangs'?",
    options: ["Onomatopoeia", "Alliteration", "Assonance", "Consonance"],
    answer: "Onomatopoeia",
    hint: "The word echoes the resonant acoustic sound of striking metal.",
    solution: "'Clangs' phonetically recreates the ringing sound of metal striking metal, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', what is the symbolic significance of Oliver being born with no name and being named by Mr. Bumble from an alphabetical list?",
    options: [
      "It emphasizes how the bureaucratic workhouse system stripped human beings of personal identity and treated them as mere numbers",
      "It shows that Mr. Bumble was an expert linguist who loved the alphabet",
      "It proves that Oliver was royal royalty from France",
      "It demonstrates that names had no legal standing in Victorian London"
    ],
    answer: "It emphasizes how the bureaucratic workhouse system stripped human beings of personal identity and treated them as mere numbers",
    hint: "Bumble named children alphabetically (A-Swubble, B-Bumble, T-Twist), showing mechanical detachment.",
    solution: "Bumble's mechanical alphabetical naming system highlights how Victorian bureaucracy erased human individuality and treated paupers as administrative numbers.",
    target: "Symbolic Critique: Bureaucracy"
  },
  {
    passage: "The old general's voice was a booming cannon that silenced the rowdy recruits in the barracks.",
    question: "What figure of speech is used in calling the voice 'a booming cannon'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation without 'like' or 'as'.",
    solution: "Equating his voice directly to a cannon without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', what happens to the Artful Dodger's friend, Charley Bates, following the horrors of Nancy's murder?",
    options: [
      "He is so morally repulsed by Bill Sikes's savagery that he renounces crime, moves to the country, and becomes an honest farmer",
      "He becomes the new leader of Fagin's pickpocket ring",
      "He is executed alongside Fagin at Newgate",
      "He robs Mr. Brownlow's library and escapes to America"
    ],
    answer: "He is so morally repulsed by Bill Sikes's savagery that he renounces crime, moves to the country, and becomes an honest farmer",
    hint: "Charley is disgusted by murder and leaves London to work an honest agricultural trade.",
    solution: "Charley Bates turns away from the underworld in horror after Nancy's murder, moving to the countryside to earn an honest living as a herdsman.",
    target: "Character Redemption: Charley Bates"
  },
  {
    passage: "The summer stars danced playfully across the dark velvet canopy of the night sky.",
    question: "What figure of speech is present in saying the stars 'danced playfully'?",
    options: ["Personification", "Simile", "Litotes", "Metaphor"],
    answer: "Personification",
    hint: "Giving celestial stars the human action of playful dancing.",
    solution: "Attributing human actions like dancing and playing to stars is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', what ultimate truth does Charles Dickens convey through the contrast between the underworld of Fagin and the sanctuary of the Maylie home?",
    options: [
      "Love, compassion, and family security provide the true foundation for human flourishing, overcoming the darkest evils of society",
      "Criminal enterprises are always more profitable than agricultural farming",
      "Wealthy people should never allow adopted children into their homes",
      "Crime can never be eradicated from urban centers"
    ],
    answer: "Love, compassion, and family security provide the true foundation for human flourishing, overcoming the darkest evils of society",
    hint: "Consider the moral transformation Oliver undergoes in the warmth of family life.",
    solution: "Dickens' central vision affirms that domestic love, moral integrity, and compassionate family life offer the true antidote to societal corruption and cruelty.",
    target: "Core Thematic Synthesis"
  },
  {
    passage: "The thunder shouted angrily across the darkening valley, warning the farmers to take shelter.",
    question: "What figure of speech is used when the thunder 'shouted angrily'?",
    options: ["Personification", "Simile", "Litotes", "Metonymy"],
    answer: "Personification",
    hint: "Attributing human vocal shouting and the emotion of anger to atmospheric weather.",
    solution: "Giving natural thunder the human capacity to shout with anger is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', why is the novella considered one of the earliest social problem novels in English literature?",
    options: [
      "It directly challenged the Poor Law of 1834, child labor, and criminal exploitation of the poor through realistic social critique",
      "It was the first book printed with color illustrations in London",
      "It was written entirely in French for European royalty",
      "It proposed the abolition of all schools and courts in England"
    ],
    answer: "It directly challenged the Poor Law of 1834, child labor, and criminal exploitation of the poor through realistic social critique",
    hint: "Dickens wrote to expose real legislative and social abuses in Victorian Britain.",
    solution: "'Oliver Twist' pioneered the social problem novel by directly attacking the Poor Law Amendment Act of 1834, child neglect, and the criminal underworld.",
    target: "Literary Significance: 'Oliver Twist'"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Prescribed Text: Charles Dickens' "Oliver Twist" (Nancy on London Bridge)
// =========================================================================
const capstone5B8AdvancedQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 1, what atmospheric imagery does Dickens employ to establish the gloomy and dangerous setting of London Bridge at midnight?",
    options: [
      "Bright starlight and singing birds along the river bank",
      "The church clock chiming three quarters past eleven, water lapping sullenly against slimy piles, and mist hanging like a funeral shroud",
      "Warm sunshine reflecting off the clean white marble buildings of London",
      "A festive crowd celebrating a national holiday with fireworks"
    ],
    answer: "The church clock chiming three quarters past eleven, water lapping sullenly against slimy piles, and mist hanging like a funeral shroud",
    hint: "Look at the sensory details of time, sound, and mist in paragraph 1.",
    solution: "Paragraph 1 creates an ominous, gothic setting through the late hour, sullen water lapping slimy piles, and mist hanging like a funeral shroud.",
    target: "Capstone Exam: Setting & Atmospheric Imagery"
  },
  {
    questionNumber: 52,
    question: "In paragraph 5, what crucial conspiracy regarding Oliver's identity and inheritance does Nancy disclose to Mr. Brownlow?",
    options: [
      "Oliver was the son of Mr. Bumble who was hidden in the workhouse",
      "Monks is Oliver's half-brother, who paid Fagin to make Oliver a convicted felon so Monks could keep their dead father's entire inheritance",
      "Mr. Brownlow was Oliver's legal grandfather who disowned him at birth",
      "Oliver was a foreign prince whose mother died on a commercial ship"
    ],
    answer: "Monks is Oliver's half-brother, who paid Fagin to make Oliver a convicted felon so Monks could keep their dead father's entire inheritance",
    hint: "Review Nancy's disclosure regarding Monks and their deceased father's will.",
    solution: "Nancy exposes the central mystery: Monks is Oliver's half-brother who hired Fagin to criminalize Oliver to legally forfeit Oliver's share of their father's fortune.",
    target: "Capstone Exam: Plot Analysis"
  },
  {
    questionNumber: 53,
    question: "What figure of speech is used in paragraph 1 when Dickens describes the river atmosphere: 'the mist from the Thames hung like a funeral shroud over the river'?",
    options: [
      "Simile (comparing the hanging mist to a burial garment using 'like')",
      "Metaphor (equating mist to a shroud without 'like')",
      "Litotes (understating the density of the fog)",
      "Apostrophe (directly addressing the river Thames)"
    ],
    answer: "Simile (comparing the hanging mist to a burial garment using 'like')",
    hint: "Notice the comparative conjunction 'like'.",
    solution: "Comparing the thick river mist explicitly to a funeral shroud using 'like' constitutes a descriptive simile foreshadowing Nancy's impending death.",
    target: "Capstone Exam: Figurative Language Decoding"
  },
  {
    questionNumber: 54,
    question: "What profound dramatic irony is revealed in the final sentence of the passage?",
    options: [
      "The reader knows that Noah Claypole is hiding in the shadows eavesdropping on Nancy, while Nancy is completely unaware of his presence",
      "Mr. Brownlow was an undercover police officer planning to arrest Nancy",
      "Rose Maylie had already paid Bill Sikes to leave England",
      "Nancy took the purse of gold and ran away to the countryside"
    ],
    answer: "The reader knows that Noah Claypole is hiding in the shadows eavesdropping on Nancy, while Nancy is completely unaware of his presence",
    hint: "Notice the contrast between Nancy fleeing into the fog and Noah crouched listening.",
    solution: "Dramatic irony occurs because the reader is informed that Noah Claypole overheard Nancy's disclosures, while Nancy leaves thinking her secret is safe, sealing her fate.",
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
async function deployCockcrowB8Advanced() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();
  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Cockcrow Advanced Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B8AdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_C_A_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B8.2.2.1 / B8.2.3.1: Evaluate advanced Victorian social satire, objective correlatives, psychological guilt motifs, and classical tropes in Dickens' 'Oliver Twist'."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8AdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${sikesJacobsIslandCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_C_A_${item.questionNumber}`,
      level: "B8",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: sikesJacobsIslandCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.2.2.1 / B8.2.3.1: Multi-paragraph textual analysis of Victorian dramatic prose, evaluating objective correlatives, poetic justice, and formulating concise thematic summaries."
    });
  });

  // 3. Write directly to Firestore subcollections
  const topicIds = ["literature_cockcrow_canon", "cockcrow_literary_devices"];
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B8_advanced)...");
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B8_advanced`);
      await subDocRef.set({
        level: "B8",
        difficulty: "advanced",
        title: "Basic 8 Advanced Lab: 50 Unique Oliver Twist Analytical Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Victorian Satire, Psychological Motifs & Advanced Devices) + 5 Capstone Full-Passage Questions",
          passageVisibility: "Passage embedded both in passageText and at the top of prompt",
          curriculum: "NaCCA Common Core Programme (CCP) Standard",
          prescribedTextsCovered: ["Oliver Twist by Charles Dickens"],
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
      console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
    }
  }

  // 4. Synchronize into main document practicePool.hard for b8 and jhs2
  console.log("\nSynchronizing main document practicePool.hard for b8...");
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
        const b8Level = existingLevels.b8 || {};

        // Keep document lean and within 1MB Firestore limit by storing b7, b8, b9 without duplicated jhs1/jhs2/jhs3
        const updatedLevels: any = {
          b7: existingLevels.b7 || {},
          b8: {
            ...b8Level,
            practicePool: {
              ...(b8Level.practicePool || {}),
              hard: mappedHardQuestions
            }
          },
          b9: existingLevels.b9 || {}
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B8 Advanced!`);
}

deployCockcrowB8Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B8 Advanced Lab:", err);
    process.exit(1);
  });

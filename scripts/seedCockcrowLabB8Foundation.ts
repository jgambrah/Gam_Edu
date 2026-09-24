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
// Prescribed Text: Charles Dickens' "Oliver Twist" (The Workhouse & Gruel Scene)
// =========================================================================
const oliverTwistCapstonePassage = 
`The room in which the boys were fed, was a large stone hall, with a copper boiler at one end, out of which the master, dressed in an apron for the purpose, and assisted by one or two women, ladled the gruel at meal-times. Of this festive composition each boy had one porringer, and no more—except on occasions of great public rejoicing, when he had two ounces and a quarter of bread besides. The bowls never wanted washing. The boys polished them with their spoons till they shone again; and when they had performed this operation (which never took very long, the spoons being nearly as large as the bowls), they would sit staring at the copper with such eager eyes, as if they could have devoured the very bricks of which it was built; employing themselves, meanwhile, in sucking their fingers most assiduously, with the view of catching up any stray splashes of gruel that might have been cast thereon. Boys have generally excellent appetites. Oliver Twist and his companions suffered the tortures of slow starvation for three months: at last they got so voracious and wild with hunger, that one boy, who was tall for his age, and hadn't been used to that sort of thing (for his father had kept a small cook-shop), hinted darkly to his companions, that unless he had another basin of gruel per diem, he was afraid he might some night happen to eat the boy who slept next to him, who happened to be a weakly youth of tender age. He had a wild, hungry eye; and they implicitly believed him. 

A council was held; lots were cast who should walk up to the master after supper that evening, and speak to him; and it fell to Oliver Twist.

The evening arrived; the boys took their places. The master, in his cook's uniform, stationed himself at the copper; his pauper assistants ranged themselves behind him; the gruel was served out; and a long grace was said over the short commons. The gruel disappeared; the boys whispered to each other, and winked at Oliver; while his next neighbours nudged him. Child as he was, he was desperate with hunger, and reckless with misery. He rose from the table; and advancing to the master, basin and spoon in hand, said: somewhat alarmed at his own temerity:

'Please, sir, I want some more.'

The master was a fat, healthy man; but he turned very pale. He gazed in stupefied astonishment on the small rebel for some seconds, and then clung for support to the copper. The assistants were paralysed with wonder; the boys with fear.

'What!' said the master at length, in a faint voice.

'Please, sir,' replied Oliver, 'I want some more.'

The master aimed a blow at Oliver's head with the ladle; pinioned him in his arms; and shrieked aloud for the beadle.

The board were sitting in solemn conclave, when Mr. Bumble rushed into the room in great excitement, and addressing the gentleman in the high chair, said, 'Mr. Limbkins, I beg your pardon, sir! Oliver Twist has asked for more!'

There was a general start. Horror was depicted on every countenance.

'For more!' said Mr. Limbkins. 'Compose yourself, Bumble, and answer me distinctly. Do I understand that he asked for more, after he had eaten the supper allotted by the dietary?'

'He did, sir,' replied Bumble.

'That boy will be hung,' said the gentleman in the white waistcoat. 'I know that boy will be hung.'

Nobody contradicted the prophetic gentleman's opinion. An animated discussion took place. Oliver was ordered into instant confinement; and a bill was next morning pasted on the outside of the gate, offering a reward of five pounds to anybody who would take Oliver Twist off the hands of the parish. In other words, five pounds and Oliver Twist were offered to any man or woman who wanted an apprentice to any trade, business, or calling.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Covering B8 Cockcrow Novella ("Oliver Twist") & Foundational Literary Devices
// =========================================================================
const unique50B8FoundationDrills = [
  {
    passage: "Oliver walked timidly toward the master, basin and spoon in hand, his heart pounding like a hammer against his ribs.",
    question: "What figure of speech is used in the phrase 'his heart pounding like a hammer'?",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    answer: "Simile",
    hint: "Identify the explicit comparison using the word 'like'.",
    solution: "Comparing the pounding heart to a hammer using the comparative marker 'like' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "Mr. Bumble was a pompous peacock strutting through the workhouse corridors, admiring his own brass buttons.",
    question: "What figure of speech is used in describing Mr. Bumble as 'a pompous peacock'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "He is directly called a peacock without using 'like' or 'as'.",
    solution: "Directly identifying Mr. Bumble as a peacock without comparative connectives constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In Charles Dickens' 'Oliver Twist', what official administrative post does Mr. Bumble hold in the parish?",
    options: [
      "The parish beadle",
      "The medical doctor",
      "The master of the workhouse",
      "The chief magistrate of London"
    ],
    answer: "The parish beadle",
    hint: "He wears a cocked hat and carries a cane, serving as the church and parish officer.",
    solution: "Mr. Bumble holds the formal position of parish beadle, responsible for church and workhouse order.",
    target: "Character Facts: 'Oliver Twist'"
  },
  {
    passage: "The howling wind shrieked through the broken window panes of the cold workhouse dormitory.",
    question: "What figure of speech is used when the wind 'shrieked'?",
    options: ["Personification", "Simile", "Hyperbole", "Metonymy"],
    answer: "Personification",
    hint: "Can wind literally emit a human or animal shriek of fear or anger?",
    solution: "Attributing the human vocal action of shrieking to natural wind is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The gentleman in the white waistcoat insisted that Oliver Twist would definitely be hung on the gallows a million times over.",
    question: "What figure of speech is used in saying Oliver would be hung 'a million times over'?",
    options: ["Hyperbole", "Understatement", "Simile", "Metaphor"],
    answer: "Hyperbole",
    hint: "Can a human being be executed a million times on the gallows?",
    solution: "Stating that someone will be executed a million times is an intentional dramatic exaggeration (hyperbole).",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In 'Oliver Twist', where was Oliver born?",
    options: [
      "In a private luxury hospital in London",
      "In a parish workhouse",
      "On a commercial fishing vessel",
      "In a criminal den managed by Fagin"
    ],
    answer: "In a parish workhouse",
    hint: "Recall the bleak institutional setting where his mother passed away shortly after giving birth.",
    solution: "Oliver was born inside a parish workhouse, an institution for the destitute and impoverished.",
    target: "Plot Details: 'Oliver Twist'"
  },
  {
    passage: "The heavy wooden door slammed shut with a thunderous clatter that startled the workhouse inmates.",
    question: "What sound device is prominent in the word 'clatter'?",
    options: ["Onomatopoeia", "Alliteration", "Assonance", "Rhyme"],
    answer: "Onomatopoeia",
    hint: "The word phonetically echoes the rattling, striking sound it describes.",
    solution: "'Clatter' directly imitates the physical acoustic sound of a hard impact, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "Cruel Mr. Bumble brutally beat the barren floor with his black cane.",
    question: "What sound device is highlighted by the repetition of the 'b' consonant sound?",
    options: ["Alliteration", "Assonance", "Consonance", "Onomatopoeia"],
    answer: "Alliteration",
    hint: "Notice the recurrence of the initial 'b' consonant across consecutive words.",
    solution: "The repetition of the initial consonant 'b' in closely connected words is alliteration.",
    target: "Sound Devices: Alliteration"
  },
  {
    passage: "In 'Oliver Twist', what was Oliver's mother doing immediately before she died?",
    options: [
      "She asked to see the child and kissed his forehead before expiring",
      "She wrote a long letter revealing her wealthy noble family",
      "She escaped from the workhouse into the woods",
      "She gave Mr. Bumble a purse filled with gold coins"
    ],
    answer: "She asked to see the child and kissed his forehead before expiring",
    hint: "She feebly embraced her newborn infant before passing away.",
    solution: "Oliver's mother feebly placed her cold lips to the baby's face, kissed his forehead, and expired.",
    target: "Textual Recall: 'Oliver Twist'"
  },
  {
    passage: "The cold gruel tasted as bland as puddle water scooped from a muddy road.",
    question: "What figure of speech is used to describe the taste of the gruel?",
    options: ["Simile", "Metaphor", "Personification", "Irony"],
    answer: "Simile",
    hint: "Notice the comparative formula 'as... as'.",
    solution: "Comparing the taste of gruel to muddy puddle water using 'as bland as' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', what trade did Mr. Sowerberry practice when he took Oliver as an apprentice?",
    options: [
      "Parish undertaker and coffin-maker",
      "Commercial baker",
      "Blacksmith and tool sharpener",
      "Textile weaver"
    ],
    answer: "Parish undertaker and coffin-maker",
    hint: "He dealt with measuring corpses and manufacturing funeral coffins.",
    solution: "Mr. Sowerberry was the parochial undertaker who took Oliver as an apprentice to prepare coffins.",
    target: "Character Facts: 'Oliver Twist'"
  },
  {
    passage: "The city of London was a murky swamp of crime, poverty, and smoke in the nineteenth century.",
    question: "What figure of speech is used in calling London 'a murky swamp'?",
    options: ["Metaphor", "Simile", "Personification", "Understatement"],
    answer: "Metaphor",
    hint: "The city is directly called a swamp without using 'like' or 'as'.",
    solution: "Directly describing London as a murky swamp without comparative words is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The rusted iron hinges of the gate squeaked in pain whenever visitors entered the courtyard.",
    question: "What figure of speech is used when the hinges squeaked 'in pain'?",
    options: ["Personification", "Simile", "Hyperbole", "Synecdoche"],
    answer: "Personification",
    hint: "Can inanimate metal hinges experience the human feeling of physical pain?",
    solution: "Attributing the human physical sensation of pain to metal gate hinges is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', why did Oliver attack and beat Noah Claypole at the undertaker's shop?",
    options: [
      "Noah stole Oliver's daily breakfast bread",
      "Noah insulted Oliver's dead mother, calling her a bad woman",
      "Noah broke Mrs. Sowerberry's porcelain plates",
      "Noah refused to help Oliver carry a small coffin"
    ],
    answer: "Noah insulted Oliver's dead mother, calling her a bad woman",
    hint: "Noah taunted Oliver about his parentage, saying his mother was a 'regular right-down bad 'un.'",
    solution: "Oliver flew into an uncontrollable rage and struck Noah because Noah maliciously insulted his deceased mother.",
    target: "Plot Conflict: 'Oliver Twist'"
  },
  {
    passage: "Oliver was so famished after days of starvation that he felt he could have swallowed the moon whole.",
    question: "What figure of speech is used to emphasize Oliver's hunger?",
    options: ["Hyperbole", "Litotes", "Simile", "Metaphor"],
    answer: "Hyperbole",
    hint: "Can a human being literally swallow a celestial body?",
    solution: "Claiming to be able to swallow the moon is an extravagant, dramatic exaggeration (hyperbole).",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In 'Oliver Twist', who was the colorful juvenile pickpocket that introduced Oliver to Fagin in London?",
    options: [
      "Jack Dawkins (The Artful Dodger)",
      "Noah Claypole",
      "Charley Bates",
      "Dick"
    ],
    answer: "Jack Dawkins (The Artful Dodger)",
    hint: "He wore an oversized gentleman's coat with turned-up cuffs and was known for his clever street manners.",
    solution: "Jack Dawkins, popularly known as 'The Artful Dodger', befriended Oliver in Barnet and introduced him to Fagin.",
    target: "Character Identification: 'Oliver Twist'"
  },
  {
    passage: "The flickering candle flame danced merrily upon the damp stone walls of the cellar.",
    question: "What figure of speech is used in saying the flame 'danced merrily'?",
    options: ["Personification", "Simile", "Metaphor", "Irony"],
    answer: "Personification",
    hint: "Giving a fire flame the human emotional ability to dance with merriment.",
    solution: "Attributing human joy and dancing actions to an inanimate flame is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The thief moved through the misty night as silent as a shadow stalking its prey.",
    question: "What figure of speech is used in the phrase 'as silent as a shadow'?",
    options: ["Simile", "Metaphor", "Hyperbole", "Apostrophe"],
    answer: "Simile",
    hint: "Look for the comparative structure 'as... as'.",
    solution: "Comparing the thief's silent movement to a shadow using 'as silent as' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', what trade did Fagin secretly teach the homeless boys gathered in his den?",
    options: [
      "Carpentry and bricklaying",
      "Pickpocketing and thievery",
      "Bookbinding and printing",
      "Shoemaking and leather tanning"
    ],
    answer: "Pickpocketing and thievery",
    hint: "They practiced taking handkerchiefs and pocketbooks out of his pockets without being noticed.",
    solution: "Fagin operated an underground school training destitute youths in pickpocketing and petty theft.",
    target: "Plot Details: 'Oliver Twist'"
  },
  {
    passage: "The coins jingled, clinked, and rattled in the old miser's heavy leather purse.",
    question: "What literary device is present in the words 'jingled, clinked, and rattled'?",
    options: ["Onomatopoeia", "Simile", "Litotes", "Metaphor"],
    answer: "Onomatopoeia",
    hint: "These words directly reproduce the metallic clatter of colliding coins.",
    solution: "Words that phonetically imitate the metallic ringing of coins are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', what crime was Oliver falsely accused of committing outside the bookstall?",
    options: [
      "Stealing Mr. Brownlow's silk handkerchief",
      "Setting fire to the bookstore owner's cart",
      "Robbing a jewellery shop with Bill Sikes",
      "Passing counterfeit sovereign coins"
    ],
    answer: "Stealing Mr. Brownlow's silk handkerchief",
    hint: "The Artful Dodger and Charley Bates stole it, but Oliver ran away and was chased by the mob.",
    solution: "The Dodger pickpocketed Mr. Brownlow's handkerchief; when Oliver fled in panic, bystanders accused him.",
    target: "Plot Details: 'Oliver Twist'"
  },
  {
    passage: "Fagin was an old venomous snake coiled in his subterranean lair, watching his young apprentices.",
    question: "What figure of speech is used in calling Fagin 'an old venomous snake'?",
    options: ["Metaphor", "Simile", "Personification", "Understatement"],
    answer: "Metaphor",
    hint: "Direct identification of a human criminal as a snake without 'like' or 'as'.",
    solution: "Equating Fagin directly to a poisonous snake without comparative words constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The angry magistrate stared down at Oliver with eyes like blazing coals of fire.",
    question: "What figure of speech is used in comparing his eyes to 'blazing coals of fire'?",
    options: ["Simile", "Metaphor", "Litotes", "Hyperbole"],
    answer: "Simile",
    hint: "Notice the comparative preposition 'like'.",
    solution: "Comparing eyes to glowing embers using 'like' is an explicit simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', who took Oliver into his home and nursed him back to health after the trial at the police court?",
    options: [
      "Mr. Brownlow",
      "Mr. Bumble",
      "Bill Sikes",
      "Mr. Limbkins"
    ],
    answer: "Mr. Brownlow",
    hint: "The kind elderly gentleman whose handkerchief had been stolen.",
    solution: "Mr. Brownlow took pity on the frail, feverish boy, brought him to his residence, and provided medical care.",
    target: "Character Roles: 'Oliver Twist'"
  },
  {
    passage: "The heavy wooden shutters banged loudly against the brick walls as the squall swept through the alley.",
    question: "What sound device is demonstrated by the word 'banged'?",
    options: ["Onomatopoeia", "Alliteration", "Assonance", "Consonance"],
    answer: "Onomatopoeia",
    hint: "The word imitates the sudden acoustic crash of wood striking brick.",
    solution: "'Banged' phonetically recreates the sound of a hard impact, making it onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', what striking portrait hung in Mr. Brownlow's residence that bore an uncanny resemblance to Oliver?",
    options: [
      "A portrait of a young lady (Agnes Fleming, his mother)",
      "A portrait of the King of England",
      "A portrait of Mr. Bumble in his beadle regalia",
      "A portrait of an ancient Roman soldier"
    ],
    answer: "A portrait of a young lady (Agnes Fleming, his mother)",
    hint: "Mr. Brownlow and Mrs. Bedwin noticed the startling likeness between Oliver's face and the painting.",
    solution: "The portrait of a beautiful young lady hanging on the wall depicted Oliver's deceased mother, Agnes Fleming.",
    target: "Foreshadowing & Plot: 'Oliver Twist'"
  },
  {
    passage: "The cruel night froze the very marrow in the bones of the homeless street urchins.",
    question: "What figure of speech is used when the night 'froze the very marrow'?",
    options: ["Hyperbole", "Simile", "Understatement", "Apostrophe"],
    answer: "Hyperbole",
    hint: "An extreme exaggeration emphasizing the harshness of the winter temperature.",
    solution: "Exaggerating the cold to freezing bone marrow is hyperbole used to emphasize extreme weather.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In 'Oliver Twist', who was Bill Sikes?",
    options: [
      "A brutal, violent housebreaker and burglar associated with Fagin",
      "A kindly parish schoolmaster who taught Oliver Latin",
      "A wealthy London merchant who adopted Oliver's brother",
      "The chief doctor of the parish workhouse"
    ],
    answer: "A brutal, violent housebreaker and burglar associated with Fagin",
    hint: "He owned a vicious white dog named Bull's-eye and resorted to physical violence.",
    solution: "Bill Sikes was a ruthless, terrifying burglar who used intimidation and violence throughout the novella.",
    target: "Character Identification: 'Oliver Twist'"
  },
  {
    passage: "The morning fog crept silently through the dark streets of Victorian London on padded paws.",
    question: "What figure of speech is used when the fog 'crept silently... on padded paws'?",
    options: ["Personification / Metaphor", "Simile", "Litotes", "Irony"],
    answer: "Personification / Metaphor",
    hint: "Fog is given the physical, creeping movement of an animal with paws.",
    solution: "Giving the fog animal traits (padded paws, creeping stealthily) is personification through metaphorical imagery.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', what was the name of Bill Sikes's abused yet fiercely loyal dog?",
    options: ["Bull's-eye", "Fang", "Rover", "Jowler"],
    answer: "Bull's-eye",
    hint: "The dog had a scarred face and followed Sikes everywhere.",
    solution: "Bill Sikes's mistreated dog was named Bull's-eye.",
    target: "Textual Recall: 'Oliver Twist'"
  },
  {
    passage: "The rain poured in relentless sheets, drumming a somber funeral march on the cemetery headstones.",
    question: "What figure of speech is used in describing the rain drumming 'a somber funeral march'?",
    options: ["Metaphor", "Simile", "Hyperbole", "Litotes"],
    answer: "Metaphor",
    hint: "The drumming sound of raindrops is directly equated to a funeral march.",
    solution: "Directly describing the rhythmic fall of rain as a funeral march without 'like' or 'as' is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', why did Fagin and Bill Sikes want Oliver back after he was rescued by Mr. Brownlow?",
    options: [
      "They feared Oliver would reveal their criminal hideout to the police",
      "They wanted Oliver to become the next head of the gang",
      "They missed Oliver's cheerful singing voice",
      "They wanted to enroll Oliver in an elite private school"
    ],
    answer: "They feared Oliver would reveal their criminal hideout to the police",
    hint: "Oliver knew the location of their secret den and could lead law officers to them.",
    solution: "The gang panicked that Oliver's disclosures to his new benefactor would lead to their capture and execution.",
    target: "Plot Conflict: 'Oliver Twist'"
  },
  {
    passage: "Oliver's face was as white as freshly driven snow when Bill Sikes pointed the loaded pistol at him.",
    question: "What figure of speech is used to describe Oliver's face?",
    options: ["Simile", "Metaphor", "Personification", "Understatement"],
    answer: "Simile",
    hint: "Look for the comparison marker 'as... as'.",
    solution: "Comparing the pallor of his frightened face to snow using 'as white as' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'Oliver Twist', which female character in Fagin's gang displayed moral conscience and deep sympathy toward Oliver?",
    options: ["Nancy", "Mrs. Corney", "Mrs. Sowerberry", "Charlotte"],
    answer: "Nancy",
    hint: "She risked her life to protect the boy from Bill Sikes and Fagin.",
    solution: "Nancy demonstrated moral courage by standing up to Sikes and Fagin to shield Oliver from further corruption.",
    target: "Character Roles: 'Oliver Twist'"
  },
  {
    passage: "The old floorboards groaned under the burglar's heavy boots as he crept toward the locked safe.",
    question: "What figure of speech is used when the floorboards 'groaned'?",
    options: ["Personification", "Simile", "Litotes", "Apostrophe"],
    answer: "Personification",
    hint: "Giving inanimate wooden boards the human vocal sound of groaning.",
    solution: "Attributing human vocal complaint (groaning) to wooden planks is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', why did Sikes require Oliver specifically to assist in the Chertsey burglary?",
    options: [
      "Oliver was small enough to be put through a tiny lattice window to unbolt the main door",
      "Oliver was an expert locksmith who could pick iron safes",
      "Oliver knew the owners of the mansion personally",
      "Oliver was the fastest runner in the criminal gang"
    ],
    answer: "Oliver was small enough to be put through a tiny lattice window to unbolt the main door",
    hint: "The window was too narrow for an adult burglar to squeeze through.",
    solution: "Sikes needed a child of slight stature who could squeeze through a small window and unlock the doors from inside.",
    target: "Plot Mechanisms: 'Oliver Twist'"
  },
  {
    passage: "The angry river roared and lashed at the wooden bridge piers with violent watery fists.",
    question: "What figure of speech is used in saying the river lashed with 'violent watery fists'?",
    options: ["Personification", "Simile", "Understatement", "Apostrophe"],
    answer: "Personification",
    hint: "Can a river possess anatomical fists and throw violent strikes?",
    solution: "Attributing human limbs (fists) and aggressive physical assault to river currents is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'Oliver Twist', what happens to Oliver during the botched burglary at the Maylie household?",
    options: [
      "He is shot in the arm and abandoned in a ditch by Sikes",
      "He steals all the silver plate and escapes to France",
      "He defeats the armed guards single-handedly",
      "He is captured and executed by the local magistrate that night"
    ],
    answer: "He is shot in the arm and abandoned in a ditch by Sikes",
    hint: "A servant fires a gun, wounding Oliver, and the fleeing burglars drop him.",
    solution: "Oliver is wounded by gunfire; Sikes carries him briefly but then abandons the bleeding boy in a roadside ditch.",
    target: "Plot Details: 'Oliver Twist'"
  },
  {
    passage: "The miser loved his sparkling gold sovereigns more than his own breathing soul.",
    question: "What figure of speech is used to highlight the miser's extreme greed?",
    options: ["Hyperbole", "Simile", "Litotes", "Onomatopoeia"],
    answer: "Hyperbole",
    hint: "An extravagant emotional exaggeration describing greed.",
    solution: "Claiming someone loves metal coins more than his own living soul is dramatic exaggeration (hyperbole).",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In 'Oliver Twist', who took Oliver in and showed him kindness after he crawled back to the Maylie house wounded?",
    options: [
      "Mrs. Maylie and Rose Maylie",
      "Mr. Bumble and Mrs. Corney",
      "Fagin and the Artful Dodger",
      "Noah Claypole and Charlotte"
    ],
    answer: "Mrs. Maylie and Rose Maylie",
    hint: "The compassionate occupants of the country house Sikes had tried to rob.",
    solution: "Mrs. Maylie and her adopted niece Rose treated Oliver with tender compassion, protecting him from arrest.",
    target: "Character Roles: 'Oliver Twist'"
  },
  {
    passage: "The wind whistled through the keyhole of the abandoned warehouse like a mourning spirit.",
    question: "What two devices are present in 'whistled... like a mourning spirit'?",
    options: [
      "Onomatopoeia and Simile",
      "Metaphor and Litotes",
      "Hyperbole and Synecdoche",
      "Personification and Assonance"
    ],
    answer: "Onomatopoeia and Simile",
    hint: "'Whistled' reproduces sound; 'like a mourning spirit' establishes an explicit comparison.",
    solution: "'Whistled' is onomatopoeic, while comparing the sound using 'like a mourning spirit' is a simile.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'Oliver Twist', who is the sinister villain that conspires with Fagin to ruin Oliver and conceal his birthright?",
    options: [
      "Monks (Edward Leeford, Oliver's half-brother)",
      "Mr. Brownlow",
      "Mr. Fang",
      "Mr. Sowerberry"
    ],
    answer: "Monks (Edward Leeford, Oliver's half-brother)",
    hint: "A mysterious man with a red birthmark on his neck who suffers from violent seizures.",
    solution: "Monks, whose real name is Edward Leeford, plotted to destroy Oliver to keep the entirety of their father's inheritance.",
    target: "Character Identification: 'Oliver Twist'"
  },
  {
    passage: "His mind was a turbulent whirlwind of guilt, terror, and despair after committing the crime.",
    question: "What figure of speech is used in calling his mind 'a turbulent whirlwind'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation of mental state to a meteorological storm without 'like' or 'as'.",
    solution: "Directly describing psychological distress as a whirlwind without comparative words is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', how does Nancy demonstrate extraordinary self-sacrifice for Oliver's welfare?",
    options: [
      "She secretly meets Rose Maylie and Mr. Brownlow on London Bridge to disclose Monks's plot",
      "She poisons Fagin's food to let Oliver escape",
      "She robs Mr. Brownlow's safe to pay Oliver's school fees",
      "She joins the police force to arrest Bill Sikes"
    ],
    answer: "She secretly meets Rose Maylie and Mr. Brownlow on London Bridge to disclose Monks's plot",
    hint: "She held clandestine nocturnal meetings on London Bridge to reveal the conspiracy.",
    solution: "Nancy risked her life by meeting Mr. Brownlow and Rose Maylie on London Bridge to uncover the plot against Oliver.",
    target: "Plot Analysis: 'Oliver Twist'"
  },
  {
    passage: "The church bell clanged and tolled, announcing the solemn midnight hour across the city.",
    question: "What literary device is demonstrated by the words 'clanged and tolled'?",
    options: ["Onomatopoeia", "Hyperbole", "Simile", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words mimic the resonant acoustic chime of heavy metal bells.",
    solution: "'Clanged' and 'tolled' phonetically recreate the ringing sounds of bronze bells, making them onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'Oliver Twist', what brutal tragedy occurs when Bill Sikes discovers that Nancy met with Mr. Brownlow?",
    options: [
      "Sikes brutally murders Nancy in a fit of savage rage",
      "Sikes leaves England forever on a cargo ship with Nancy",
      "Sikes surrenders himself peacefully to the police",
      "Sikes asks Mr. Brownlow for forgiveness"
    ],
    answer: "Sikes brutally murders Nancy in a fit of savage rage",
    hint: "Fagin manipulates Sikes into believing Nancy betrayed the whole gang, leading to her death.",
    solution: "Enraged by the perceived betrayal, Sikes viciously bludgeons Nancy to death in her bed.",
    target: "Climactic Events: 'Oliver Twist'"
  },
  {
    passage: "The guilty murderer ran through the dark streets, pursued by the phantom eyes of his victim.",
    question: "What figure of speech is used in saying he was 'pursued by the phantom eyes of his victim'?",
    options: ["Personification / Metaphor", "Simile", "Understatement", "Apostrophe"],
    answer: "Personification / Metaphor",
    hint: "Internal psychological guilt is personified as relentless staring eyes following his steps.",
    solution: "Representing guilt as ghostly eyes pursuing a criminal combines personification and psychological metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'Oliver Twist', how does Bill Sikes meet his dramatic end?",
    options: [
      "He accidentally hangs himself from a rooftop while trying to escape an angry mob",
      "He is shot by Mr. Brownlow in a duel",
      "He lives peacefully on a farm in Scotland",
      "He drowns inside the hold of a sinking ship"
    ],
    answer: "He accidentally hangs himself from a rooftop while trying to escape an angry mob",
    hint: "A rope tied around a chimney slips around his neck as he loses his balance on the roof.",
    solution: "While attempting to lower himself from a roof at Jacob's Island to evade a furious mob, the rope catches his neck and he hangs himself.",
    target: "Resolution: 'Oliver Twist'"
  },
  {
    passage: "The young boy was no coward when defending his mother's honor against the neighborhood bullies.",
    question: "What figure of speech is used in stating that the boy was 'no coward'?",
    options: ["Litotes", "Hyperbole", "Simile", "Personification"],
    answer: "Litotes",
    hint: "Asserting that he was exceptionally brave by negating its opposite ('no coward').",
    solution: "Litotes asserts bravery by negating the trait of cowardice ('no coward').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'Oliver Twist', what is the final fate of the criminal mastermind Fagin?",
    options: [
      "He is tried in court, convicted, and executed on the gallows at Newgate Prison",
      "He escapes to America with all his stolen jewels",
      "He is pardoned by the King and becomes a respectable shopkeeper",
      "He adopts Noah Claypole as his legal son"
    ],
    answer: "He is tried in court, convicted, and executed on the gallows at Newgate Prison",
    hint: "Oliver visits him in his condemned cell before his public execution.",
    solution: "Fagin is arrested, convicted of criminal conspiracy, and executed by hanging at Newgate Prison.",
    target: "Plot Resolution: 'Oliver Twist'"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// "Oliver Twist" (The Gruel Scene) by Charles Dickens
// =========================================================================
const capstone5B8FoundationQuestions = [
  {
    questionNumber: 51,
    question: "According to the passage, why did the boys hold a council and cast lots to decide who should ask for more food?",
    options: [
      "They wanted to play a practical joke on the master of the workhouse",
      "They suffered the tortures of slow starvation for three months, and one tall boy hinted he might eat his roommate unless he had more gruel",
      "They had plenty of food but wanted extra bread for an upcoming festival",
      "Mr. Bumble ordered the boys to select an apprentice for the chimney sweep"
    ],
    answer: "They suffered the tortures of slow starvation for three months, and one tall boy hinted he might eat his roommate unless he had more gruel",
    hint: "Review paragraph 1 regarding the boys' extreme hunger and the tall boy's threat.",
    solution: "Paragraph 1 explains that after three months of starvation, a tall boy warned he might be driven to eat his neighbor; terrified, the boys held a council and cast lots.",
    target: "Capstone Exam: Literal Comprehension"
  },
  {
    questionNumber: 52,
    question: "What literary device is employed in paragraph 1 when Dickens describes the thin, watery gruel as a 'festive composition'?",
    options: [
      "Verbal Irony (sarcastic contrast between a meager meal and a festive banquet)",
      "Simile (comparing gruel to a holiday dinner using 'like')",
      "Onomatopoeia (imitating the sound of boiling water)",
      "Apostrophe (directly addressing the master's copper pot)"
    ],
    answer: "Verbal Irony (sarcastic contrast between a meager meal and a festive banquet)",
    hint: "Is a single bowl of thin gruel given to starving orphans truly 'festive'?",
    solution: "Dickens uses verbal irony and biting sarcasm by calling a tasteless, starvation-level bowl of gruel a 'festive composition' to mock workhouse administrators.",
    target: "Capstone Exam: Irony & Authorial Voice"
  },
  {
    questionNumber: 53,
    question: "How did the workhouse board react when Mr. Bumble reported that Oliver Twist had asked for more gruel?",
    options: [
      "They burst into laughter and offered him double portions of beef",
      "They reacted with horror and shock, with one gentleman declaring that the boy would definitely be hung",
      "They congratulated Oliver for his bravery and awarded him five pounds",
      "They immediately dismissed the master for underfeeding the children"
    ],
    answer: "They reacted with horror and shock, with one gentleman declaring that the boy would definitely be hung",
    hint: "Examine the reaction of Mr. Limbkins and the gentleman in the white waistcoat.",
    solution: "The board was horrified, treating Oliver's simple plea of hunger as criminal rebellion, with the gentleman in the white waistcoat predicting Oliver would be hung.",
    target: "Capstone Exam: Character Reactions & Subtext"
  },
  {
    questionNumber: 54,
    question: "What immediate administrative measure did the workhouse authorities take against Oliver the following morning?",
    options: [
      "They gave Oliver a scholarship to attend grammar school in London",
      "They locked him in confinement and pasted a bill offering five pounds to anyone who would take him as an apprentice",
      "They sent him home to live with his wealthy relatives",
      "They appointed him as an assistant to help ladle the gruel"
    ],
    answer: "They locked him in confinement and pasted a bill offering five pounds to anyone who would take him as an apprentice",
    hint: "Check the final paragraph for the five-pound offer on the workhouse gate.",
    solution: "The board placed Oliver in solitary confinement and pasted a notice on the gate offering five pounds to any tradesman willing to take Oliver off their hands.",
    target: "Capstone Exam: Textual Recall & Institutional Critique"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the central social critique conveyed in this famous excerpt.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Workhouses treated starving children with shocking institutional cruelty.",
      "Because Oliver asked for more gruel, the gentleman said he would be hung on gallows.",
      "Starving children in nineteenth-century Victorian workhouses asking for more food.",
      "Cruel workhouses."
    ],
    answer: "Workhouses treated starving children with shocking institutional cruelty.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Workhouses treated starving children with shocking institutional cruelty' is exactly 8 words, forms a complete Subject-Verb-Object sentence, and encapsulates Dickens' critique. Option C is a fragment (0 marks), and Option B has 15 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployCockcrowB8Foundation() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();
  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Cockcrow Foundation Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B8FoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_C_F_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B8.2.2.1 / B8.2.3.1: Analyze foundational literary devices and plot, character, and thematic elements in Charles Dickens' 'Oliver Twist'."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8FoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${oliverTwistCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_C_F_${item.questionNumber}`,
      level: "B8",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: oliverTwistCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.2.2.1 / B8.2.3.1: Multi-paragraph textual analysis of Victorian prose, decoding satire, verbal irony, institutional critique, and formulating concise thematic summaries."
    });
  });

  // 3. Write directly to Firestore subcollections
  const topicIds = ["literature_cockcrow_canon", "cockcrow_literary_devices"];
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
        title: "Basic 8 Foundation Lab: 50 Unique Oliver Twist Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Literary Devices & Oliver Twist) + 5 Capstone Full-Passage Questions",
          passageVisibility: "Passage embedded both in passageText and at the top of prompt",
          curriculum: "NaCCA Common Core Programme (CCP) Standard",
          prescribedTextsCovered: ["Oliver Twist by Charles Dickens"],
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
      console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
    }
  }

  // 4. Synchronize into main document practicePool.low for b8 and jhs2
  console.log("\nSynchronizing main document practicePool.low for b8 and jhs2...");
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
              low: mappedLowQuestions
            }
          },
          jhs2: {
            ...jhs2Level,
            practicePool: {
              ...(jhs2Level.practicePool || {}),
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B8 Foundation!`);
}

deployCockcrowB8Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B8 Foundation Lab:", err);
    process.exit(1);
  });

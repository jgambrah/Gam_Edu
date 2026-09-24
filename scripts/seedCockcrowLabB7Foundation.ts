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
// Prescribed Text: "The Girl Who Can" by Ama Ata Aidoo
// =========================================================================
const theGirlWhoCanCapstonePassage = 
`They say that I was born in Hasodzi; and it is a very big village in the central region of our country, Ghana. They also say that when all of Africa is not raining, Hasodzi is raining. Everything about my birth was normal, except my legs. Nana says that when she first saw me, she almost threw me away into the nearest bush. Why? Because of my legs. She said they were too thin, too long, and had no meat on them at all. 

In our village, a woman's legs are very important. Nana was always telling Maami, my mother, that a woman must have solid, fleshy legs so that when she marries, she can carry heavy loads from the farm—big baskets of cassava, bundles of firewood, and pots of water on her head—without her legs buckling under the weight. Even worse, Nana argued that a woman with thin, spindly legs like mine could never support a child in her womb or endure the physical strain of childbirth. 

My mother would try to defend me, but her voice was always small and soft. She would say, 'Mother, let us wait and see. God gave her those legs, and perhaps they have a purpose.' Then Nana would snort in contempt and snap, 'What purpose can two dry sticks have? A child who cannot carry cassava cannot help her family!' Because I was only seven years old, I was forbidden to speak. Nana always warned me that children must keep their mouths shut when adults are conversing.

Then I started attending the local primary school. One afternoon, during physical education, the sports master lined us up on the field to run. When the whistle blew, my long, slender legs carried me across the grass so swiftly that I left every other runner far behind. I was selected to represent the school at the inter-district athletic championship. When I won the first-place cup for sprinting, Nana did something extraordinary: she lifted the shiny silver cup, placed it squarely upon her head like a water pot, and marched proudly through the village streets for everyone to see.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Covering B7 Cockcrow Texts & Foundational Literary Devices
// =========================================================================
const unique50B7FoundationDrills = [
  {
    passage: "Nana looked at Adjoa's legs and shook her head, muttering that they were as thin as dry broomsticks.",
    question: "What figure of speech is used in the phrase 'as thin as dry broomsticks'?",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    answer: "Simile",
    hint: "Notice the explicit comparative marker 'as... as'.",
    solution: "The explicit comparison of Adjoa's slender legs to broomsticks using 'as... as' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The harmattan wind howled through the village roofs, screaming like an angry ghost searching for its lost children.",
    question: "Which literary device is present when the wind 'screaming like an angry ghost'?",
    options: ["Simile and Personification", "Metaphor only", "Irony", "Understatement"],
    answer: "Simile and Personification",
    hint: "The wind is given a human action (screaming) and compared using 'like'.",
    solution: "Giving the wind the human action of screaming is personification, and comparing it using 'like an angry ghost' is a simile.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'The Girl Who Can', Adjoa describes her grandmother's constant complaints by saying Nana repeated them a million times every morning.",
    question: "What figure of speech is used in the expression 'repeated them a million times'?",
    options: ["Understatement", "Hyperbole", "Metaphor", "Alliteration"],
    answer: "Hyperbole",
    hint: "Did Nana literally say it 1,000,000 times, or is it an exaggeration?",
    solution: "Claiming someone repeated something 'a million times' is an intentional dramatic exaggeration, known as hyperbole.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "The blazing afternoon sun was an angry furnace baking the red clay paths of Hasodzi village.",
    question: "What literary device is used in calling the sun 'an angry furnace'?",
    options: ["Simile", "Metaphor", "Onomatopoeia", "Apostrophe"],
    answer: "Metaphor",
    hint: "The sun is directly called an angry furnace without using 'like' or 'as'.",
    solution: "Directly equating the sun to a furnace without comparative connectives constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "Peter Piper picked a peck of pickled peppers in the morning market.",
    question: "What sound device is demonstrated by the repetition of the 'p' sound?",
    options: ["Assonance", "Alliteration", "Onomatopoeia", "Rhyme"],
    answer: "Alliteration",
    hint: "Identify the repetition of the same initial consonant sound.",
    solution: "The repetition of the initial consonant 'p' across closely connected words is alliteration.",
    target: "Sound Devices: Alliteration"
  },
  {
    passage: "In 'A Day's Wait', young Schatz contracts a severe fever. When his father enters the room, the boy tells him not to come near so he does not catch the sickness.",
    question: "What character trait does Schatz demonstrate by warning his father away?",
    options: [
      "Selfishness and hatred toward his father",
      "Selflessness and protective concern for his father",
      "Cowardice and panic",
      "Disobedience toward adult instructions"
    ],
    answer: "Selflessness and protective concern for his father",
    hint: "Why would a sick child tell his parent to stay away from illness?",
    solution: "Schatz puts his father's safety above his own comfort, displaying deep selflessness and courage.",
    target: "Character Analysis: 'A Day's Wait'"
  },
  {
    passage: "The dry autumn leaves crunched, crackled, and snapped beneath the hunter's heavy boots.",
    question: "What literary device is employed by the words 'crunched, crackled, and snapped'?",
    options: ["Onomatopoeia", "Simile", "Hyperbole", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words imitate the actual physical sounds they describe.",
    solution: "Words whose sounds imitate their real-world acoustic actions are examples of onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Girl Who Can', Nana believes that a woman's legs are primarily useful if they are fleshy and solid enough to carry heavy loads and support childbirth.",
    question: "What traditional belief system does Nana's perspective represent?",
    options: [
      "Modern Western individualism",
      "Traditional agrarian expectations of female utility",
      "Scientific medical training",
      "Professional sports administration"
    ],
    answer: "Traditional agrarian expectations of female utility",
    hint: "Consider how rural farm societies traditionally evaluated physical strength.",
    solution: "Nana judges female value strictly through the lens of traditional agrarian utility—farm work and childbearing.",
    target: "Thematic Analysis: 'The Girl Who Can'"
  },
  {
    passage: "The classroom was as quiet as a graveyard during the final examination.",
    question: "What figure of speech is used in the phrase 'as quiet as a graveyard'?",
    options: ["Simile", "Metaphor", "Personification", "Irony"],
    answer: "Simile",
    hint: "Notice the comparison introduced by 'as... as'.",
    solution: "Explicitly comparing the quietness of a room to a graveyard using 'as... as' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The ancient grandfather clock in the hallway ticked mournfully, counting down the lonely hours of the night.",
    question: "What figure of speech is present when the clock ticks 'mournfully'?",
    options: ["Personification", "Simile", "Hyperbole", "Synecdoche"],
    answer: "Personification",
    hint: "Can a mechanical clock experience the human emotion of mourning?",
    solution: "Attributing the human emotional state of mourning to an inanimate clock is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', why was Adjoa forbidden from participating in conversations with her mother and grandmother?",
    options: [
      "She had lost her voice due to illness",
      "Village custom dictated that children must not speak when elders are conversing",
      "She did not understand the local Fante dialect",
      "Nana locked her inside her bedroom"
    ],
    answer: "Village custom dictated that children must not speak when elders are conversing",
    hint: "Recall the cultural rule Adjoa repeats regarding elders and children.",
    solution: "Adjoa repeatedly notes that village tradition strictly forbids children from talking when elders are discussing matters.",
    target: "Cultural Context: 'The Girl Who Can'"
  },
  {
    passage: "The sudden lightning bolt tore the dark sky apart like a jagged silver zipper.",
    question: "What figure of speech is used in the phrase 'like a jagged silver zipper'?",
    options: ["Simile", "Metaphor", "Understatement", "Apostrophe"],
    answer: "Simile",
    hint: "Look for the comparative word 'like'.",
    solution: "Comparing the flash of lightning to a zipper using 'like' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "Kofi was a roaring lion on the football pitch, tackling every opponent who approached his goal area.",
    question: "What figure of speech is used in describing Kofi as 'a roaring lion'?",
    options: ["Metaphor", "Simile", "Personification", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "He is directly called a lion without using 'like' or 'as'.",
    solution: "Directly identifying Kofi as a lion without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'A Day's Wait', the boy's father goes out to hunt quails on the frozen sleet while Schatz stays in bed.",
    question: "Why does the father go hunting while his son lies in bed?",
    options: [
      "He wants to punish the boy for catching a cold",
      "He understands the fever is mild and has no idea Schatz believes he is dying",
      "He needs to find medicinal herbs in the forest",
      "The doctor instructed him to leave the house"
    ],
    answer: "He understands the fever is mild and has no idea Schatz believes he is dying",
    hint: "Consider the dramatic irony between the father's perspective and the son's.",
    solution: "The father knows a 102-degree Fahrenheit fever is manageable, completely unaware that Schatz expects to die.",
    target: "Dramatic Irony: 'A Day's Wait'"
  },
  {
    passage: "The squeaky wheel seeks the green street.",
    question: "What sound device is highlighted by the repetition of the long 'ee' vowel sound?",
    options: ["Assonance", "Alliteration", "Consonance", "Onomatopoeia"],
    answer: "Assonance",
    hint: "Focus on the repetition of the internal vowel sound 'ee'.",
    solution: "The repetition of identical vowel sounds ('ee') within nearby words is assonance.",
    target: "Sound Devices: Assonance"
  },
  {
    passage: "The old wooden canoe groaned in protest as four heavy fishermen stepped into it at the beach.",
    question: "What figure of speech is used when the canoe 'groaned in protest'?",
    options: ["Personification", "Simile", "Hyperbole", "Metonymy"],
    answer: "Personification",
    hint: "Attributing human vocal complaint (groaning in protest) to an inanimate wooden boat.",
    solution: "Giving an inanimate boat human feelings and the ability to groan in protest is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', who discovers Adjoa's running ability?",
    options: [
      "Her grandmother, Nana",
      "Her mother, Maami",
      "The school sports master",
      "The village chief"
    ],
    answer: "The school sports master",
    hint: "Who organizes athletic activities at the primary school?",
    solution: "Adjoa's athletic talent is identified during physical training by the primary school sports master.",
    target: "Plot Details: 'The Girl Who Can'"
  },
  {
    passage: "The athlete ran so fast that the wind stopped to catch its breath in astonishment.",
    question: "What two literary devices are combined in this sentence?",
    options: [
      "Hyperbole and Personification",
      "Simile and Metaphor",
      "Irony and Understatement",
      "Alliteration and Onomatopoeia"
    ],
    answer: "Hyperbole and Personification",
    hint: "Exaggerating speed is one; giving the wind lungs to 'catch its breath' is the other.",
    solution: "Extreme exaggeration is hyperbole, while giving the wind human breath and astonishment is personification.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "The bees buzzed and hummed busily among the sweet yellow blossoms in the garden.",
    question: "What literary device is present in the words 'buzzed' and 'hummed'?",
    options: ["Onomatopoeia", "Metaphor", "Personification", "Hyperbole"],
    answer: "Onomatopoeia",
    hint: "The words imitate the actual sounds made by bees.",
    solution: "Words like 'buzzed' and 'hummed' recreate the physical sound of insect flight, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'A Day's Wait', what was the core misunderstanding that caused Schatz to believe he was about to die?",
    options: [
      "The doctor gave him the wrong prescription",
      "He confused Fahrenheit temperature with Celsius temperature",
      "He overheard his father crying in the kitchen",
      "A classmate told him influenza was incurable"
    ],
    answer: "He confused Fahrenheit temperature with Celsius temperature",
    hint: "Remember that Schatz previously lived and attended school in France.",
    solution: "Schatz learned in France that normal body temperature is around 37°C and 44°C is lethal; he thought his 102°F was on the Celsius scale.",
    target: "Core Plot Mechanism: 'A Day's Wait'"
  },
  {
    passage: "The flood waters swallowed the entire cocoa farm in a matter of minutes.",
    question: "What figure of speech is used in saying the waters 'swallowed' the farm?",
    options: ["Personification", "Simile", "Litotes", "Apostrophe"],
    answer: "Personification",
    hint: "Can moving water literally chew and swallow food like a living creature?",
    solution: "Giving water the biological digestive action of swallowing is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "Her skin was as smooth as polished ivory under the morning light.",
    question: "What figure of speech is used to describe her skin?",
    options: ["Simile", "Metaphor", "Hyperbole", "Irony"],
    answer: "Simile",
    hint: "Look for the comparison formula 'as [adjective] as'.",
    solution: "Comparing skin directly to polished ivory using 'as smooth as' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'The Girl Who Can', how does Nana's attitude toward Adjoa change at the end of the story?",
    options: [
      "She becomes more bitter and refuses to feed Adjoa",
      "She sends Adjoa away to work on a distant cassava farm",
      "She shows immense pride by carrying Adjoa's athletic trophy on her head",
      "She forbids Adjoa from ever attending school again"
    ],
    answer: "She shows immense pride by carrying Adjoa's athletic trophy on her head",
    hint: "How does Nana carry the shiny silver cup through Hasodzi village?",
    solution: "Nana carries the championship cup on her head like a ceremonial vessel, showing public pride in Adjoa's accomplishment.",
    target: "Character Development: 'The Girl Who Can'"
  },
  {
    passage: "The little boy told his father: 'I am so hungry I could eat an entire elephant with its tusks!'",
    question: "What figure of speech is the boy using to describe his hunger?",
    options: ["Hyperbole", "Simile", "Metaphor", "Understatement"],
    answer: "Hyperbole",
    hint: "Can a human child literally devour an entire elephant?",
    solution: "Claiming to be able to eat an entire elephant is an extreme dramatic exaggeration (hyperbole).",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "Big brown bears bake bright berry buns.",
    question: "What poetic device is prominent in this playful sentence?",
    options: ["Alliteration", "Assonance", "Onomatopoeia", "Rhyme"],
    answer: "Alliteration",
    hint: "Notice the repetition of the starting 'b' sound in nearly every word.",
    solution: "The repetition of the initial consonant 'b' across consecutive words is alliteration.",
    target: "Sound Devices: Alliteration"
  },
  {
    passage: "In 'A Day's Wait', what book does the father read aloud to Schatz while sitting by his bed?",
    options: [
      "Howard Pyle's 'Book of Pirates'",
      "Charles Dickens' 'Oliver Twist'",
      "Daniel Defoe's 'Robinson Crusoe'",
      "Aesop's Fables"
    ],
    answer: "Howard Pyle's 'Book of Pirates'",
    hint: "The text specifies a book about famous seafaring buccaneers.",
    solution: "Hemingway specifies that the father reads from Howard Pyle's 'Book of Pirates' to entertain the sick boy.",
    target: "Textual Recall: 'A Day's Wait'"
  },
  {
    passage: "The moon looked down with a gentle maternal smile upon the sleeping children in the village.",
    question: "What figure of speech is used when the moon looks down with 'a gentle maternal smile'?",
    options: ["Personification", "Simile", "Metaphor", "Irony"],
    answer: "Personification",
    hint: "Attributing human facial expressions (smiling maternally) to a celestial body.",
    solution: "Giving the moon human maternal facial expressions and emotions is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "The warrior's shield was a solid wall of brass repelling every enemy arrow.",
    question: "What figure of speech is used in calling the shield 'a solid wall of brass'?",
    options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
    answer: "Metaphor",
    hint: "The shield is directly stated to be a wall without using 'like' or 'as'.",
    solution: "Directly equating the shield to a brass wall without comparative connectives constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Girl Who Can', what is the name of Adjoa's mother?",
    options: ["Maami", "Ekua", "Araba", "Mansah"],
    answer: "Maami",
    hint: "Adjoa refers to her mother throughout the story by this affectionate title.",
    solution: "Adjoa consistently refers to her gentle mother as 'Maami'.",
    target: "Character Identification: 'The Girl Who Can'"
  },
  {
    passage: "The thunder boomed and crashed over the hills, rattling every glass window in the chapel.",
    question: "What literary device is present in the words 'boomed and crashed'?",
    options: ["Onomatopoeia", "Simile", "Understatement", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These sound-words reproduce the explosive noise of atmospheric thunder.",
    solution: "Words like 'boomed' and 'crashed' imitate the actual acoustic shock of thunder, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'A Day's Wait', what was Schatz's exact body temperature when the physician measured it?",
    options: ["98.6 degrees", "100 degrees", "102 degrees", "105 degrees"],
    answer: "102 degrees",
    hint: "Scan for the specific Fahrenheit reading mentioned by the doctor.",
    solution: "The physician informs the father that the boy's temperature is 102° Fahrenheit.",
    target: "Textual Recall: 'A Day's Wait'"
  },
  {
    passage: "Her tears fell like heavy raindrops on a tin roof as she heard the sorrowful news.",
    question: "What figure of speech is used in 'fell like heavy raindrops'?",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    answer: "Simile",
    hint: "Look for the comparative word 'like'.",
    solution: "Comparing falling tears to heavy raindrops using 'like' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The old truck groaned and coughed black smoke before dying in the middle of the street.",
    question: "What literary device is used when the truck 'groaned and coughed'?",
    options: ["Personification", "Simile", "Metaphor", "Synecdoche"],
    answer: "Personification",
    hint: "Human physiological actions (groaning, coughing) are applied to a mechanical engine.",
    solution: "Attributing biological coughing and groaning to a machine is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', what sport does Adjoa compete in to win the championship cup?",
    options: ["High jump", "Running / Sprinting", "Football", "Volleyball"],
    answer: "Running / Sprinting",
    hint: "Her long, thin legs are ideal for this track event.",
    solution: "Adjoa participates in running (sprinting), utilizing her long legs to outrun all competitors.",
    target: "Plot Details: 'The Girl Who Can'"
  },
  {
    passage: "I have told you a thousand times to wash your hands before sitting at the dinner table!",
    question: "What figure of speech is demonstrated in 'told you a thousand times'?",
    options: ["Hyperbole", "Simile", "Metaphor", "Litotes"],
    answer: "Hyperbole",
    hint: "A common parent exaggeration for dramatic emphasis.",
    solution: "Claiming to have repeated a command a thousand times is an exaggeration for rhetorical emphasis, which is hyperbole.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "Silently, softly, the silver snow slipped through the slumbering trees.",
    question: "What sound device is demonstrated by the repetition of the 's' consonant sound?",
    options: ["Alliteration", "Assonance", "Onomatopoeia", "Rhyme"],
    answer: "Alliteration",
    hint: "Notice the recurrence of the initial 's' sound in consecutive words.",
    solution: "The repetition of the initial 's' sound across adjacent words is alliteration.",
    target: "Sound Devices: Alliteration"
  },
  {
    passage: "In 'A Day's Wait', what did Schatz do all day while lying in bed that showed he was waiting to die?",
    options: [
      "He cried loudly and demanded gifts",
      "He stared quietly at the foot of his bed, refusing to sleep or relax",
      "He tried to escape from the house",
      "He played board games with his father"
    ],
    answer: "He stared quietly at the foot of his bed, refusing to sleep or relax",
    hint: "Notice his quiet, tense physical posture throughout the entire day.",
    solution: "Schatz maintained a rigid, quiet posture staring at the foot of the bed, holding onto his composure because he believed his death was imminent.",
    target: "Character Analysis: 'A Day's Wait'"
  },
  {
    passage: "The classroom was a bustling beehive of eager students completing their science models.",
    question: "What figure of speech is used in calling the classroom 'a bustling beehive'?",
    options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
    answer: "Metaphor",
    hint: "The classroom is directly called a beehive without using 'like' or 'as'.",
    solution: "Directly describing the active classroom as a beehive without comparative words is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The dry branches tapped, tapped, tapped on the window pane during the storm.",
    question: "What literary device is used in the repetition of the word 'tapped'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Understatement"],
    answer: "Onomatopoeia",
    hint: "The word echoes the actual sound made by wood striking glass.",
    solution: "'Tapped' directly imitates the physical clicking sound of branches against glass, making it onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Girl Who Can', what is the setting of the story?",
    options: [
      "A coastal fishing town in Accra",
      "Hasodzi, a village in the Central Region of Ghana",
      "A mining community in Obuasi",
      "A secondary school boarding house in Kumasi"
    ],
    answer: "Hasodzi, a village in the Central Region of Ghana",
    hint: "Adjoa names her village directly in the opening lines of the text.",
    solution: "The story is set in the rural village of Hasodzi in the Central Region of Ghana.",
    target: "Setting: 'The Girl Who Can'"
  },
  {
    passage: "The cold winter wind bit fiercely into the traveler's uncovered cheeks.",
    question: "What figure of speech is used when the wind 'bit fiercely'?",
    options: ["Personification", "Simile", "Litotes", "Metaphor"],
    answer: "Personification",
    hint: "Can the weather have teeth to bite a human being?",
    solution: "Giving the natural wind the animal or human action of biting is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "His words were as sweet as pure wild honey dripping from the comb.",
    question: "What figure of speech is used to describe his words?",
    options: ["Simile", "Metaphor", "Personification", "Irony"],
    answer: "Simile",
    hint: "Look for the comparative marker 'as... as'.",
    solution: "Comparing spoken words to honey using 'as sweet as' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'A Day's Wait', what does the title of the story refer to?",
    options: [
      "A boy waiting for a bus to take him to school",
      "A boy spending an entire day waiting for what he believed was certain death",
      "A father waiting for a doctor to arrive from the city",
      "A hunter waiting for birds to fly over frozen hills"
    ],
    answer: "A boy spending an entire day waiting for what he believed was certain death",
    hint: "What was Schatz anticipating while lying in bed all day?",
    solution: "The title refers to Schatz stoically spending an entire day awaiting what he mistakenly believed to be his inevitable death.",
    target: "Title Significance: 'A Day's Wait'"
  },
  {
    passage: "The mountain stood like a giant stone sentinel guarding the entrance to the valley.",
    question: "What figure of speech is used in comparing the mountain to a 'giant stone sentinel'?",
    options: ["Simile", "Metaphor", "Hyperbole", "Onomatopoeia"],
    answer: "Simile",
    hint: "Notice the comparative conjunction 'like'.",
    solution: "Comparing the mountain to a sentinel using the word 'like' creates a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The morning sun kissed the sleepy petals of the red hibiscus flower.",
    question: "What figure of speech is present in 'sun kissed the sleepy petals'?",
    options: ["Personification", "Simile", "Hyperbole", "Litotes"],
    answer: "Personification",
    hint: "Both 'kissed' and 'sleepy' are human traits applied to sun and flowers.",
    solution: "Attributing human actions (kissing) and states (sleepy) to nature is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', how old is the narrator Adjoa when the events take place?",
    options: ["Seven years old", "Twelve years old", "Fifteen years old", "Four years old"],
    answer: "Seven years old",
    hint: "Adjoa states her exact age when reflecting on adult conversations.",
    solution: "Adjoa explicitly informs the reader that she is seven years old.",
    target: "Character Facts: 'The Girl Who Can'"
  },
  {
    passage: "The heavy iron door slammed shut with a deafening bang that echoed down the stone corridor.",
    question: "What literary device is demonstrated by the word 'bang'?",
    options: ["Onomatopoeia", "Metaphor", "Simile", "Personification"],
    answer: "Onomatopoeia",
    hint: "The word phonetically echoes the loud slamming impact.",
    solution: "'Bang' directly imitates the physical acoustic impact of the door closing, making it onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "My grandfather is older than the rolling hills surrounding our ancestral village.",
    question: "What figure of speech is used to describe the grandfather's age?",
    options: ["Hyperbole", "Simile", "Metaphor", "Understatement"],
    answer: "Hyperbole",
    hint: "Can any living human being be older than geological hills?",
    solution: "Claiming an elderly person is older than geological hills is an extravagant exaggeration, which is hyperbole.",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In 'A Day's Wait', how does Schatz react once he learns that 102 degrees Fahrenheit is not fatal?",
    options: [
      "He becomes furious and runs out into the snow",
      "His emotional tension dissolves and he cries easily over little things the next day",
      "He refuses to take his medicine",
      "He laughs loudly and goes hunting immediately"
    ],
    answer: "His emotional tension dissolves and he cries easily over little things the next day",
    hint: "Notice how his tight emotional self-control relaxes once the danger has passed.",
    solution: "Hemingway notes that the next day, once the extreme tension had relaxed, the boy cried very easily at little things of no importance.",
    target: "Psychological Resolution: 'A Day's Wait'"
  },
  {
    passage: "The golden stars danced playfully in the dark velvet sky.",
    question: "What figure of speech is used in saying the stars 'danced playfully'?",
    options: ["Personification", "Simile", "Metaphor", "Hyperbole"],
    answer: "Personification",
    hint: "Giving stars the human capacity to dance and play.",
    solution: "Attributing human actions like dancing and playing to stars is personification.",
    target: "Figurative Language: Personification"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// "The Girl Who Can" by Ama Ata Aidoo
// =========================================================================
const capstone5B7Questions = [
  {
    questionNumber: 51,
    question: "According to the passage, why did Nana almost throw Adjoa into the bush when she was born?",
    options: [
      "Because Adjoa was born during a terrible drought",
      "Because Adjoa had thin, spindly legs with no meat on them",
      "Because Adjoa's mother refused to name her after Nana",
      "Because Adjoa cried constantly day and night"
    ],
    answer: "Because Adjoa had thin, spindly legs with no meat on them",
    hint: "Look at paragraph 1 for Nana's initial physical assessment of the baby.",
    solution: "Paragraph 1 explicitly notes Nana almost threw her away because 'her legs were too thin, too long, and had no meat on them at all.'",
    target: "Capstone Exam: Literal Comprehension"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what two essential traditional functions did Nana argue women's legs must perform in Hasodzi?",
    options: [
      "Running athletic races and dancing at royal festivals",
      "Carrying heavy farm loads on their heads and supporting successful childbearing",
      "Climbing palm trees and swimming across rivers",
      "Wading through floodwaters and chasing stray livestock"
    ],
    answer: "Carrying heavy farm loads on their heads and supporting successful childbearing",
    hint: "Examine the practical farm and reproductive duties described in paragraph 2.",
    solution: "Paragraph 2 states legs must be solid enough to carry heavy loads (firewood, cassava, water) and support a child during pregnancy and childbirth.",
    target: "Capstone Exam: Cultural & Thematic Analysis"
  },
  {
    questionNumber: 53,
    question: "What figure of speech does Nana employ when she contemptuously asks: 'What purpose can two dry sticks have?'",
    options: [
      "Metaphor (comparing Adjoa's thin legs directly to dry sticks)",
      "Simile (comparing legs using 'like' or 'as')",
      "Personification (giving dry sticks human emotions)",
      "Onomatopoeia (imitating the sound of breaking wood)"
    ],
    answer: "Metaphor (comparing Adjoa's thin legs directly to dry sticks)",
    hint: "Nana equates the legs directly to 'dry sticks' without using 'like' or 'as'.",
    solution: "Directly describing Adjoa's legs as 'two dry sticks' without comparative markers is a derogatory metaphor.",
    target: "Capstone Exam: Figurative Language Decoding"
  },
  {
    questionNumber: 54,
    question: "What is the symbolic significance of Nana carrying the shiny silver trophy on her head through the village streets at the end of the passage?",
    options: [
      "She wanted to take the cup to the village market to sell it for money",
      "She recognized Adjoa's worth and used a traditional gesture of honor to celebrate modern athletic success",
      "She was carrying it home to wash it in the river",
      "She was mocking Adjoa's teachers in front of the elders"
    ],
    answer: "She recognized Adjoa's worth and used a traditional gesture of honor to celebrate modern athletic success",
    hint: "In Ghanaian tradition, carrying something of great value on the head is a gesture of public celebration and respect.",
    solution: "By placing the cup on her head like a prized pot, Nana adapts traditional honor customs to celebrate Adjoa's modern athletic victory, accepting her granddaughter's capability.",
    target: "Capstone Exam: Symbolic Interpretation"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the central lesson of 'The Girl Who Can'.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Apparent physical liabilities can become extraordinary strengths.",
      "Because Adjoa won the race, Nana was very proud of her shiny silver cup.",
      "Winning the district athletic championship cup for Hasodzi primary school.",
      "Thin legs can run fast."
    ],
    answer: "Apparent physical liabilities can become extraordinary strengths.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Apparent physical liabilities can become extraordinary strengths' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and encapsulates the moral of the story. Option C is a fragment (0 marks), and Option B has 14 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployCockcrowB7Foundation() {
  console.log("Building 55 UNIQUE questions for Basic 7 (JHS 1) Cockcrow Foundation Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B7FoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_C_F_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B7",
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
      learningCompetency: "B7.2.2.1 / B7.2.3.1: Identify foundational literary devices and analyze themes, characters, and plot in prescribed Cockcrow short stories."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B7Questions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${theGirlWhoCanCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_C_F_${item.questionNumber}`,
      level: "B7",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: theGirlWhoCanCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B7.2.2.1 / B7.2.3.1: Multi-paragraph textual analysis of prescribed literature, decoding symbolism, character development, and formulating concise moral summaries."
    });
  });

  const db = await getDb();

  // Target both canonical topic IDs so it works everywhere!
  const topicIds = ["literature_cockcrow_canon", "cockcrow_literary_devices"];
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  // 3. Write practice_labs/B7_foundation subcollections
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B7_foundation`);
      await subDocRef.set({
        level: "B7",
        difficulty: "foundation",
        title: "Basic 7 Foundation Lab: 50 Unique Cockcrow Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Literary Devices & Short Stories) + 5 Capstone Full-Passage Questions",
          passageVisibility: "Passage embedded both in passageText and at the top of prompt",
          curriculum: "NaCCA Common Core Programme (CCP) Standard",
          prescribedTextsCovered: ["The Girl Who Can by Ama Ata Aidoo", "A Day's Wait by Ernest Hemingway"],
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
      console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
    }
  }

  // 4. Synchronize into main document practicePool.low for b7 and jhs1
  console.log("\nSynchronizing main document practicePool.low for b7 and jhs1...");
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
        const b7Level = existingLevels.b7 || {};
        const jhs1Level = existingLevels.jhs1 || {};

        const updatedLevels = {
          ...existingLevels,
          b7: {
            ...b7Level,
            practicePool: {
              ...(b7Level.practicePool || {}),
              low: mappedLowQuestions
            }
          },
          jhs1: {
            ...jhs1Level,
            practicePool: {
              ...(jhs1Level.practicePool || {}),
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B7 Foundation!`);
}

deployCockcrowB7Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B7 Foundation Lab:", err);
    process.exit(1);
  });

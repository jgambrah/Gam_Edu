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
// Prescribed Text: "A Day's Wait" by Ernest Hemingway
// =========================================================================
const aDaysWaitCapstonePassage = 
`He came into the room to shut the windows while we were still in bed and I saw he looked ill. He was shivering, his face was white, and he walked slowly as though it ached to move. 'What's the matter, Schatz?' 'I've got a headache.' 'You'd better go back to bed.' 'No. I'm all right.' 'You go to bed. I'll see you when I'm dressed.' But when I came downstairs he was dressed, sitting by the fire, looking a very sick and miserable boy of nine years. When I put my hand on his forehead I knew he had a fever. 'You go up to bed,' I said, 'you're sick.' 'I'm all right,' he said.

When the doctor came he took the boy's temperature. 'What is it?' I asked him. 'One hundred and two.' Downstairs the doctor left three different medicines in different colored capsules with instructions for giving them. One was to bring down the fever, another a purgative, the third to overcome an acid condition. The germs of influenza can only exist in an acid condition, he explained. He seemed to know all about influenza and said there was nothing to worry about if the fever did not go above one hundred and four degrees. This was a light epidemic of flu and there was no danger if you avoided pneumonia.

Back in the room I wrote the boy's temperature down on a pad of paper and at what time to give the various capsules. 'Do you want me to read to you?' 'All right. If you want to,' said the boy. His face was very white and there were dark areas under his eyes. He lay still in the bed and seemed very detached from what was going on. I read aloud from Howard Pyle's Book of Pirates, but I could see he was not following what I was reading. 'How do you feel, Schatz?' I asked him. 'Just the same, so far,' he said.

I sat at the foot of the bed and read to myself while I waited for it to be time to give another capsule. It would have been natural for him to go to sleep, but when I looked up he was looking at the foot of the bed, looking very strangely. 'Why don't you try to go to sleep? I'll wake you up for the medicine.' 'I'd rather stay awake,' he said. After a while he said to me, 'You don't have to stay in here with me, Papa, if it bothers you.' 'It doesn't bother me.' 'No, I mean you don't have to stay if it's going to bother you.' I thought perhaps he was lightheaded and after giving him the prescribed capsules at eleven o'clock I went out for a while.

It was a bright, cold day, the ground covered with a sleet that had frozen so it seemed as though all the bare trees, the bushes, the cut brush and all the grass and the bare ground had been varnished with ice. I took the young Irish setter for a walk up the road and along a frozen creek... At the house they said the boy had refused to let anyone come into the room. 'You can't come in,' he had said. 'You mustn't get what I have.' I went up to him and found him in exactly the position I had left him, white-faced, but with the tops of his cheeks flushed by the fever, staring still, as he had stared, at the foot of the bed.

I took his temperature. 'What is it?' 'Something like a hundred,' I said. It was one hundred and two and four tenths. 'It was a hundred and two,' he said. 'Who said so?' 'The doctor.' 'Well, your temperature is all right,' I said. 'It's nothing to worry about.' 'I don't worry,' he said, 'but I can't keep from thinking.' 'Don't think,' I said. 'Just take it easy.' 'I'm taking it easy,' he said and looked straight ahead. He was evidently holding tight onto himself about something.

'Take this with water.' 'Do you think it will do any good?' 'Of course it will.' I sat down and opened the Pirate book and commenced to read, but I could see he was not following, so I stopped. 'About what time do you think I'm going to die?' he asked. 'What?' 'About how long will it be before I die?' 'You aren't going to die. What's the matter with you?' 'Oh, yes, I am. I heard him say a hundred and two.' 'People don't die with a fever of one hundred and two. That's a silly way to talk.' 'I know they do. At school in France the boys told me you can't live with forty-four degrees. I've got a hundred and two.'

He had been waiting to die all day, ever since nine o'clock in the morning. 'You poor Schatz,' I said. 'Poor old Schatz. It's like miles and kilometers. You aren't going to die. That's a different thermometer. On that thermometer thirty-seven is normal. On this kind it's ninety-eight.' 'Are you sure?' 'Absolutely,' I said. 'It's like miles and kilometers. You know, like how many kilometers we make when we do seventy miles in the car?' 'Oh,' he said. And the look of being held together relaxed, but the next day he cried very easily at little things that were of no importance.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Literary Devices, Textual Nuance, Tone, Theme & Character Motivations
// =========================================================================
const unique50B7IntermediateDrills = [
  {
    passage: "In 'A Day's Wait', Schatz asks his father: 'About what time do you think I'm going to die?' The father is stunned by the inquiry because he knows a fever of 102 degrees is not fatal.",
    question: "What literary device creates the tension between the father's calm attitude and the boy's question?",
    options: [
      "Dramatic Irony",
      "Hyperbole",
      "Metaphor",
      "Onomatopoeia"
    ],
    answer: "Dramatic Irony",
    hint: "The tension stems from one person knowing a critical piece of information that the other misunderstands.",
    solution: "Dramatic irony occurs because the reader and the father understand that a 102-degree Fahrenheit fever is mild, while Schatz mistakenly believes it means inevitable death.",
    target: "Dramatic Irony: 'A Day's Wait'"
  },
  {
    passage: "In 'The Girl Who Can', Nana repeatedly complains that Adjoa's spindly legs are useless because they cannot support the weight of heavy water pots or bundles of firewood from the farm.",
    question: "What socio-cultural perspective does Nana's attitude illustrate?",
    options: [
      "Judging female value strictly through physical capacity for domestic and farm labor",
      "Encouraging young girls to pursue international university education",
      "Rejecting communal agricultural traditions in favor of modern urban commerce",
      "Promoting professional competitive sports for rural youth"
    ],
    answer: "Judging female value strictly through physical capacity for domestic and farm labor",
    hint: "Notice how Nana connects bodily shape directly to carrying firewood and farm harvests.",
    solution: "Nana represents the traditional agrarian mindset that assesses a woman's bodily worth based on her utility for heavy manual labor and childbearing.",
    target: "Thematic Analysis: 'The Girl Who Can'"
  },
  {
    passage: "The sun was a ruthless taskmaster, whipping the weary farmers across the barren fields until their backs ached with exhaustion.",
    question: "What figure of speech is used in calling the sun 'a ruthless taskmaster'?",
    options: ["Metaphor", "Simile", "Understatement", "Apostrophe"],
    answer: "Metaphor",
    hint: "The sun is directly identified as a taskmaster without using 'like' or 'as'.",
    solution: "Equating the sun directly to an unforgiving overseer without comparative markers forms a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'A Day's Wait', the father compares Fahrenheit and Celsius thermometers to the relationship between miles and kilometers.",
    question: "What rhetorical method does the father employ to resolve his son's confusion?",
    options: [
      "Analogy",
      "Personification",
      "Sarcasm",
      "Hyperbole"
    ],
    answer: "Analogy",
    hint: "He explains an unfamiliar concept by comparing it to an everyday measurement system the boy understands.",
    solution: "The father uses an analogy, drawing a parallel between different temperature scales and the familiar relationship between miles and kilometers.",
    target: "Literary Techniques: Analogy"
  },
  {
    passage: "The torrential rains wept all night long over the devastated village, mourning the loss of the ancient sacred baobab tree.",
    question: "What literary device is present when the rains 'wept all night long... mourning the loss'?",
    options: [
      "Personification",
      "Metonymy",
      "Litotes",
      "Alliteration"
    ],
    answer: "Personification",
    hint: "Can falling rain experience grief and shed tears of human mourning?",
    solution: "Attributing the emotional capacity of weeping and mourning to rainfall is an example of personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', Adjoa says that when she won the district cup, Nana carried it on her head like a pot of fresh water from the stream.",
    question: "What is the symbolic significance of Nana carrying the cup on her head like a water pot?",
    options: [
      "She was mocking the sports master's Western athletic training",
      "She used a traditional gesture of honor to celebrate Adjoa's modern achievement",
      "She was complaining that the metal cup was too heavy for her hands",
      "She wanted to take the trophy to the market to sell it"
    ],
    answer: "She used a traditional gesture of honor to celebrate Adjoa's modern achievement",
    hint: "In Ghanaian village culture, carrying a prized object on the head is a public demonstration of dignity and pride.",
    solution: "Nana bridges the gap between custom and modern accomplishment by applying a traditional gesture of honor (balancing a precious vessel on her head) to celebrate Adjoa's athletic cup.",
    target: "Symbolism: 'The Girl Who Can'"
  },
  {
    passage: "The courtroom was as silent as a tomb as the jury foreman stood up to deliver the final verdict.",
    question: "What figure of speech is used in the phrase 'as silent as a tomb'?",
    options: ["Simile", "Metaphor", "Synecdoche", "Irony"],
    answer: "Simile",
    hint: "Look for the explicit comparison established with 'as... as'.",
    solution: "Comparing the silence of the room to a tomb using 'as silent as' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'A Day's Wait', Hemingway describes Schatz lying in bed staring rigidly at the foot of his bed, refusing to let his father read or talk to him.",
    question: "What internal psychological conflict is Schatz experiencing during this scene?",
    options: [
      "He is angry that his father went hunting without his permission",
      "He is holding himself together stoically because he believes he is waiting to die",
      "He is faking illness so he does not have to attend French classes",
      "He is frightened by the pirate stories his father read aloud"
    ],
    answer: "He is holding himself together stoically because he believes he is waiting to die",
    hint: "Notice his extreme emotional self-control and detachment throughout the day.",
    solution: "Schatz believes his death is imminent; his rigid posture represents an intense effort to face death with quiet dignity.",
    target: "Character Psychology: 'A Day's Wait'"
  },
  {
    passage: "The politician spoke with honeyed words, yet a sharp dagger of malice was hidden behind his diplomatic smile.",
    question: "What literary device is featured in the contrasting imagery of 'honeyed words' and 'sharp dagger of malice'?",
    options: [
      "Antithesis / Contrastive Metaphor",
      "Onomatopoeia",
      "Hyperbole",
      "Assonance"
    ],
    answer: "Antithesis / Contrastive Metaphor",
    hint: "Notice the juxtaposition of sweet speech against dangerous intent.",
    solution: "The contrast between sweet spoken words (honey) and destructive inner malice (dagger) creates an antithesis through metaphorical imagery.",
    target: "Figurative Language: Antithesis"
  },
  {
    passage: "In 'The Girl Who Can', Maami speaks in a small, soft voice whenever Nana criticizes Adjoa's physical build.",
    question: "What does Maami's subdued tone reveal about her position in the household?",
    options: [
      "She dislikes Adjoa and agrees with Nana's harsh criticisms",
      "She is socially and traditionally subordinate to the elder matriarch, Nana",
      "She is recovering from a throat disease that took away her voice",
      "She has no interest in whether Adjoa succeeds or fails"
    ],
    answer: "She is socially and traditionally subordinate to the elder matriarch, Nana",
    hint: "In traditional extended families, younger mothers defer to senior grandmothers.",
    solution: "Maami's quiet voice highlights her traditional deference to Nana, showing how family hierarchy restricts younger mothers from openly defying elders.",
    target: "Character Dynamics: 'The Girl Who Can'"
  },
  {
    passage: "The ancient oak tree stood like an unbending fortress, defying the ferocious squall that battered the countryside.",
    question: "What figure of speech is used in comparing the tree to 'an unbending fortress'?",
    options: ["Simile", "Metaphor", "Litotes", "Apostrophe"],
    answer: "Simile",
    hint: "Identify the explicit comparative preposition 'like'.",
    solution: "Comparing the tree's resilience to a fortress using 'like' makes it a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'A Day's Wait', how does the outdoor sleet-hunting scene provide a contrast to what is occurring inside the house?",
    options: [
      "It shows the father's cruelty and neglect toward his suffering child",
      "It contrasts the father's vigorous outdoor activity with the boy's quiet, paralyzed vigil indoors",
      "It proves that wild game was scarce during that winter season",
      "It suggests that hunting quails cures viral influenza"
    ],
    answer: "It contrasts the father's vigorous outdoor activity with the boy's quiet, paralyzed vigil indoors",
    hint: "Compare the energy and movement of hunting on ice with the silence of the bedroom.",
    solution: "Hemingway uses the brisk hunting episode to heighten the contrast between the father's active world and the boy's silent, isolated confrontation with perceived death.",
    target: "Structural Analysis: 'A Day's Wait'"
  },
  {
    passage: "The old man was no stranger to adversity, having survived three devastating droughts and a civil war.",
    question: "What rhetorical figure of speech is employed in the phrase 'no stranger to adversity'?",
    options: ["Litotes (Understatement)", "Hyperbole", "Personification", "Simile"],
    answer: "Litotes (Understatement)",
    hint: "An affirmative point is made by negating its opposite ('no stranger' means 'very experienced').",
    solution: "Expressing that someone is deeply experienced with hardship by stating they are 'no stranger' to it is a classic litotes (ironic understatement).",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Girl Who Can', Nana repeatedly refers to Adjoa's legs as 'two dry sticks'.",
    question: "What underlying emotion does this recurring metaphor convey?",
    options: [
      "Admiration for Adjoa's athletic speed",
      "Frustration and disdain over physical traits seen as lacking domestic utility",
      "Joy that Adjoa will not have to work on the farm",
      "Fear that Adjoa will become a hunter"
    ],
    answer: "Frustration and disdain over physical traits seen as lacking domestic utility",
    hint: "Consider why brittle sticks would be considered useless in an agrarian community.",
    solution: "Describing her legs as dry sticks reflects Nana's frustration that Adjoa lacks the muscular calves valued in village life.",
    target: "Metaphorical Analysis: 'The Girl Who Can'"
  },
  {
    passage: "The screech of the car tires pierced the quiet evening air like a terrified scream.",
    question: "What two literary devices are combined in this description?",
    options: [
      "Onomatopoeia and Simile",
      "Metaphor and Hyperbole",
      "Alliteration and Irony",
      "Personification and Litotes"
    ],
    answer: "Onomatopoeia and Simile",
    hint: "'Screech' mimics sound; 'like a terrified scream' makes an explicit comparison.",
    solution: "'Screech' is an onomatopoeic word imitating sound, while 'like a terrified scream' forms a simile.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'A Day's Wait', why does Schatz cry easily over trivial matters the day after his temperature misunderstanding is resolved?",
    options: [
      "He was disappointed that he did not receive gifts while sick",
      "The immense emotional tension he had maintained during his death vigil finally dissolved",
      "His fever worsened into severe pneumonia",
      "He was angry with the physician for giving him capsules"
    ],
    answer: "The immense emotional tension he had maintained during his death vigil finally dissolved",
    hint: "Think about what happens psychologically when prolonged fear is suddenly lifted.",
    solution: "Having held his emotions together all day under the belief that he was dying, the sudden relief released his bottled-up stress, making him emotionally vulnerable.",
    target: "Character Psychology: 'A Day's Wait'"
  },
  {
    passage: "The angry storm clouds marched across the valley, beating their dark drums in preparation for battle.",
    question: "What figure of speech is present in saying the clouds 'marched... beating their dark drums'?",
    options: ["Personification", "Simile", "Understatement", "Synecdoche"],
    answer: "Personification",
    hint: "Clouds are described as soldiers marching and drumming.",
    solution: "Giving storm clouds the human behaviors of marching soldiers and drummers is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', the central conflict begins as an argument between Nana and Maami over Adjoa's legs. How does this dispute resolve?",
    options: [
      "Adjoa breaks her legs in an accident, proving Nana was right",
      "Adjoa uses those same legs to win an inter-district athletic championship, proving their value",
      "Maami leaves Hasodzi village with Adjoa to live in Accra",
      "Nana gives Adjoa traditional medicine to make her calves thicker"
    ],
    answer: "Adjoa uses those same legs to win an inter-district athletic championship, proving their value",
    hint: "The physical trait criticized by tradition becomes the vehicle for modern success.",
    solution: "The conflict reaches situational irony when the slender legs dismissed by Nana earn school and district glory through sprinting.",
    target: "Plot Resolution: 'The Girl Who Can'"
  },
  {
    passage: "The boy felt like an outcast in the crowded cafeteria, a desert island surrounded by a sea of laughing faces.",
    question: "What figure of speech is used in calling the boy 'a desert island surrounded by a sea of laughing faces'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "He is directly called an island in a sea without comparative words.",
    solution: "Equating the lonely student directly to a desert island amid an ocean of faces is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'A Day's Wait', what is the author's primary attitude (tone) toward young Schatz?",
    options: [
      "Mocking and contemptuous of the boy's foolish mistake",
      "Sympathetic, tender, and quietly admiring of his courage",
      "Cold, clinical, and completely indifferent",
      "Frustrated and annoyed by the child's silence"
    ],
    answer: "Sympathetic, tender, and quietly admiring of his courage",
    hint: "Notice how gently the father comforts 'poor old Schatz' once he understands.",
    solution: "The narrator depicts Schatz with quiet admiration for his dignity and deep tenderness once the misunderstanding comes to light.",
    target: "Author's Tone: 'A Day's Wait'"
  },
  {
    passage: "The wind whispered ancient secrets through the slender reeds bordering the lagoon.",
    question: "What figure of speech is used when the wind 'whispered ancient secrets'?",
    options: ["Personification", "Simile", "Hyperbole", "Metonymy"],
    answer: "Personification",
    hint: "Can the movement of air whisper secrets like a human confidant?",
    solution: "Attributing the human verbal capacity to whisper secrets to natural air currents is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', Adjoa reflects that she had to keep her opinions inside her head because children were not allowed to speak when adults were present.",
    question: "What major theme is highlighted by Adjoa's private inner thoughts?",
    options: [
      "The silencing of children in traditional cultural settings",
      "The importance of learning foreign European languages",
      "The physical dangers of childhood diseases",
      "The necessity of farming over attending school"
    ],
    answer: "The silencing of children in traditional cultural settings",
    hint: "Adjoa has deep observations but cannot express them to her elders.",
    solution: "Adjoa's inner monologue highlights how traditional societies often suppress children's viewpoints in favor of adult authority.",
    target: "Thematic Analysis: 'The Girl Who Can'"
  },
  {
    passage: "His mind was an intricate clockwork mechanism, calculating every possibility before taking a single step.",
    question: "What figure of speech is used in calling his mind 'an intricate clockwork mechanism'?",
    options: ["Metaphor", "Simile", "Litotes", "Irony"],
    answer: "Metaphor",
    hint: "A direct equation without using 'like' or 'as'.",
    solution: "Directly describing his mind as a clockwork mechanism without comparative words is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'A Day's Wait', what does the doctor leave behind besides medicine?",
    options: [
      "A written explanation that influenza germs only thrive in an acid condition",
      "A new thermometer for the boy to use",
      "A French medical dictionary",
      "A bottle of surgical spirit"
    ],
    answer: "A written explanation that influenza germs only thrive in an acid condition",
    hint: "Review the doctor's explanation regarding the capsules and flu germs.",
    solution: "The doctor leaves instructions and explains that one medicine is a purgative and another overcomes an acid condition, in which flu germs thrive.",
    target: "Textual Recall: 'A Day's Wait'"
  },
  {
    passage: "The bees droned lazily in the heavy, humid heat of the mid-afternoon.",
    question: "What sound device is demonstrated by the word 'droned'?",
    options: ["Onomatopoeia", "Hyperbole", "Simile", "Apostrophe"],
    answer: "Onomatopoeia",
    hint: "The word phonetically echoes the low, steady hum of flying insects.",
    solution: "'Droned' phonetically reproduces the sound of insect flight, making it an example of onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Girl Who Can', how does the community of Hasodzi treat physical traits that deviate from standard expectations?",
    options: [
      "With immediate praise and royal honors",
      "With suspicion, skepticism, and verbal lamentation",
      "By sending the child out of the country",
      "By electing the child as a village chief"
    ],
    answer: "With suspicion, skepticism, and verbal lamentation",
    hint: "Recall how Nana initially reacted to Adjoa's slender legs.",
    solution: "Hasodzi society is conservative; unconventional traits (such as thin, long legs) are treated with doubt and concern about practicality.",
    target: "Sociocultural Analysis: 'The Girl Who Can'"
  },
  {
    passage: "Her smile was a beacon of light piercing through the heavy gloom of the hospital waiting room.",
    question: "What figure of speech is used in calling her smile 'a beacon of light'?",
    options: ["Metaphor", "Simile", "Personification", "Understatement"],
    answer: "Metaphor",
    hint: "Her smile is directly called a beacon without 'like' or 'as'.",
    solution: "Directly equating a comforting smile to a guiding light without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'A Day's Wait', how does Schatz show consideration for his father even while believing he is dying?",
    options: [
      "He tells his father to leave the bedroom so he will not get sick",
      "He writes his father a detailed financial will",
      "He asks his father to cook him a lavish meal",
      "He gives his father all his pocket money"
    ],
    answer: "He tells his father to leave the bedroom so he will not get sick",
    hint: "Schatz says: 'You don't have to stay in here with me, Papa, if it bothers you...'",
    solution: "Schatz's concern that his father might contract the fatal illness highlights his selflessness.",
    target: "Character Trait: 'A Day's Wait'"
  },
  {
    passage: "The dry branches clattered and scratched against the zinc roof throughout the stormy night.",
    question: "What literary device is employed by the words 'clattered and scratched'?",
    options: ["Onomatopoeia", "Simile", "Litotes", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words mimic the harsh physical sounds of wood scraping against metal.",
    solution: "Words like 'clattered' and 'scratched' phonetically imitate the sounds they describe, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Girl Who Can', what is the author's primary message regarding human capability?",
    options: [
      "Only children with robust, muscular bodies can succeed in life",
      "True potential cannot be judged by traditional physical expectations alone",
      "Athletics should be banned in rural primary schools",
      "Grandmothers are always correct about children's futures"
    ],
    answer: "True potential cannot be judged by traditional physical expectations alone",
    hint: "Adjoa's success challenges Nana's rigid definitions of physical value.",
    solution: "The story demonstrates that individuals have diverse gifts that may not fit traditional definitions of physical utility.",
    target: "Central Theme: 'The Girl Who Can'"
  },
  {
    passage: "The firefighter stood like an immovable rock amid the swirling wall of flames.",
    question: "What figure of speech is used in comparing the firefighter to 'an immovable rock'?",
    options: ["Simile", "Metaphor", "Hyperbole", "Personification"],
    answer: "Simile",
    hint: "Look for the explicit comparison introduced by 'like'.",
    solution: "Comparing the firefighter's bravery to a rock using 'like' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'A Day's Wait', how does the father's reading of pirate stories contrast with Schatz's mental state?",
    options: [
      "Schatz loves the pirate tales and asks for more chapters",
      "The father uses adventurous fiction to pass time, unaware that Schatz is detached and facing perceived mortality",
      "The pirate book frightens Schatz into having a higher fever",
      "The father stops reading because Schatz falls asleep immediately"
    ],
    answer: "The father uses adventurous fiction to pass time, unaware that Schatz is detached and facing perceived mortality",
    hint: "Notice how detached the boy is from the pirate narrative.",
    solution: "The lightheartedness of reading pirate adventures emphasizes the emotional gap between the father and the boy's internal crisis.",
    target: "Structural Irony: 'A Day's Wait'"
  },
  {
    passage: "The city was an enormous iron beast that swallowed thousands of rural migrants every morning.",
    question: "What figure of speech is used in calling the city 'an enormous iron beast'?",
    options: ["Metaphor", "Simile", "Understatement", "Apostrophe"],
    answer: "Metaphor",
    hint: "The city is directly called a beast without using comparative words.",
    solution: "Directly describing an urban center as an iron beast is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Girl Who Can', what role does the primary school play in Adjoa's life?",
    options: [
      "It makes her forget her native Fante language",
      "It provides a modern platform where her unique physical talent is recognized and developed",
      "It forces her to carry heavier agricultural loads",
      "It causes her to disown her family"
    ],
    answer: "It provides a modern platform where her unique physical talent is recognized and developed",
    hint: "Where is Adjoa's running ability first noticed and supported?",
    solution: "The school serves as an institution of empowerment, identifying Adjoa's talent and offering an arena beyond village expectations.",
    target: "Institutional Role: 'The Girl Who Can'"
  },
  {
    passage: "The old wooden gate squeaked, groaned, and finally banged shut in the gusting wind.",
    question: "What two sound and figurative devices are present in 'squeaked, groaned, and banged'?",
    options: [
      "Onomatopoeia and Personification",
      "Simile and Metaphor",
      "Hyperbole and Litotes",
      "Alliteration and Assonance"
    ],
    answer: "Onomatopoeia and Personification",
    hint: "'Squeaked' and 'banged' are sound words; 'groaned' gives the gate a human vocal response.",
    solution: "'Squeaked' and 'banged' are onomatopoeic, while 'groaned' personifies the inanimate wooden gate.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'A Day's Wait', what does the boy's nickname 'Schatz' reveal about his relationship with his father?",
    options: [
      "It is a harsh military rank showing strict discipline",
      "It is an affectionate German term of endearment meaning 'treasure', showing paternal love",
      "It is a nickname given to children who fail in school",
      "It was the name of the attending physician"
    ],
    answer: "It is an affectionate German term of endearment meaning 'treasure', showing paternal love",
    hint: "'Schatz' is a common European term of endearment used by loving parents.",
    solution: "The father uses 'Schatz' (German for 'treasure' or 'darling') as a term of endearment, underscoring their close bond.",
    target: "Contextual Nuance: 'A Day's Wait'"
  },
  {
    passage: "The athlete's heart pounded like a war drum as she took her place on the starting blocks.",
    question: "What figure of speech is used in comparing the heartbeat to 'a war drum'?",
    options: ["Simile", "Metaphor", "Personification", "Irony"],
    answer: "Simile",
    hint: "Notice the comparison word 'like'.",
    solution: "Comparing the rhythm of a racing heart to a drum using 'like' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'The Girl Who Can', how does Adjoa view her grandmother's long speeches about her legs?",
    options: [
      "With quiet, thoughtful curiosity and private amusement",
      "With violent rage and shouting matches",
      "With total indifference because she never listened",
      "With fear that Nana would harm her physically"
    ],
    answer: "With quiet, thoughtful curiosity and private amusement",
    hint: "Review Adjoa's reflective narrative voice throughout the opening paragraphs.",
    solution: "Adjoa narrates with a child's quiet curiosity, analyzing Nana's complaints with gentle detachment.",
    target: "Narrative Voice: 'The Girl Who Can'"
  },
  {
    passage: "The classroom was an inferno during the sweltering harmattan afternoon.",
    question: "What figure of speech is used in calling the classroom 'an inferno'?",
    options: ["Metaphor", "Simile", "Understatement", "Apostrophe"],
    answer: "Metaphor",
    hint: "The room is directly called an inferno without 'like' or 'as'.",
    solution: "Calling a hot room directly an inferno without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'A Day's Wait', what physical evidence during the morning reveals that Schatz is unwell before the doctor arrives?",
    options: [
      "He was shivering, his face was white, and he walked slowly as though it ached to move",
      "He had broken his ankle while playing outside in the sleet",
      "He was coughing up blood and had lost his voice completely",
      "He refused to eat breakfast because his teeth were loose"
    ],
    answer: "He was shivering, his face was white, and he walked slowly as though it ached to move",
    hint: "Scan the opening paragraph for the narrator's first observation of the boy.",
    solution: "The opening lines state that Schatz was shivering, pale, and moving slowly with noticeable physical ache.",
    target: "Textual Recall: 'A Day's Wait'"
  },
  {
    passage: "The stars blinked nervously in the dark sky as the black storm clouds rolled over the mountain ridge.",
    question: "What figure of speech is present in saying the stars 'blinked nervously'?",
    options: ["Personification", "Simile", "Metaphor", "Litotes"],
    answer: "Personification",
    hint: "Attributing human anxiety (nervousness) and physiological actions (blinking) to stars.",
    solution: "Giving stars the human capacity to experience nervousness and blink intentionally is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Girl Who Can', what is the significance of the story being narrated from a seven-year-old child's point of view?",
    options: [
      "It allows the author to expose the absurdities of adult prejudices through fresh, uncorrupted eyes",
      "It makes the story confusing because children cannot understand adult matters",
      "It proves that children should run village administrative councils",
      "It shows that children are incapable of telling the truth"
    ],
    answer: "It allows the author to expose the absurdities of adult prejudices through fresh, uncorrupted eyes",
    hint: "A child's perspective often highlights contradictions in adult traditions that adults take for granted.",
    solution: "Using Adjoa's innocent first-person voice allows Aidoo to critique restrictive gender norms with gentle clarity.",
    target: "Narrative Technique: 'The Girl Who Can'"
  },
  {
    passage: "The sudden thunderclap was an explosion that shook the foundations of the ancestral stone cottage.",
    question: "What figure of speech is used in calling the thunderclap 'an explosion'?",
    options: ["Metaphor", "Simile", "Onomatopoeia", "Personification"],
    answer: "Metaphor",
    hint: "Direct equation of thunder to an explosion without 'like' or 'as'.",
    solution: "Directly describing the loud thunderclap as an explosion without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'A Day's Wait', what does the father's walk with the Irish setter reveal about his assumptions during the day?",
    options: [
      "He loved his hunting dog more than his son",
      "He genuinely believed the illness was routine and had no inkling of his son's terror",
      "He was searching for a doctor who knew how to treat French diseases",
      "He was trying to escape from his household responsibilities"
    ],
    answer: "He genuinely believed the illness was routine and had no inkling of his son's terror",
    hint: "The father enjoys his walk on the frozen creek because he trusts the doctor's assessment.",
    solution: "The outdoor walk illustrates the father's confidence that the fever was manageable, underscoring the dramatic irony of the situation.",
    target: "Character Motivation: 'A Day's Wait'"
  },
  {
    passage: "The kettle hissed and whistled loudly on the stove as the boiling water bubbled over the rim.",
    question: "What literary device is prominent in the words 'hissed and whistled'?",
    options: ["Onomatopoeia", "Hyperbole", "Simile", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words mimic the real sound of escaping steam.",
    solution: "Words like 'hissed' and 'whistled' imitate the sounds made by boiling steam, which is onomatopoeia.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Girl Who Can', Nana's eventual acceptance of Adjoa's running success shows that:",
    options: [
      "Tradition can be broadened when practical success demonstrates the value of modern opportunities",
      "Nana decided to abandon all village customs and move to the capital",
      "Adjoa was forced to stop running after winning the first cup",
      "Traditional elders never change their opinions under any circumstances"
    ],
    answer: "Tradition can be broadened when practical success demonstrates the value of modern opportunities",
    hint: "Consider how Nana incorporates the trophy into her village walk.",
    solution: "Nana's pride shows that traditional viewpoints can evolve when new achievements clearly bring honor to the family.",
    target: "Thematic Resolution: 'The Girl Who Can'"
  },
  {
    passage: "The hunter was as cunning as a desert fox stalking its prey in the brush.",
    question: "What figure of speech is used in comparing the hunter to a 'desert fox'?",
    options: ["Simile", "Metaphor", "Personification", "Litotes"],
    answer: "Simile",
    hint: "Look for the comparison formula 'as... as'.",
    solution: "Comparing the hunter's sharpness to a fox using 'as cunning as' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'A Day's Wait', what does the resolution teach about the importance of open communication between parents and children?",
    options: [
      "Children should never ask doctors about their health",
      "Unspoken assumptions and concealed fears can lead to deep, unnecessary suffering",
      "Parents should never take their children to foreign schools",
      "Thermometers should be kept locked away from young children"
    ],
    answer: "Unspoken assumptions and concealed fears can lead to deep, unnecessary suffering",
    hint: "A single question from Schatz in the morning would have avoided a full day of fear.",
    solution: "The story highlights that Schatz endured an agonizing day simply because neither he nor his father discussed what the temperature reading meant to him.",
    target: "Moral & Theme: 'A Day's Wait'"
  },
  {
    passage: "The river snaked gracefully through the wide green valley toward the distant blue ocean.",
    question: "What figure of speech is used in saying the river 'snaked gracefully'?",
    options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
    answer: "Metaphor",
    hint: "The winding movement of the river is directly described using the motion of a serpent.",
    solution: "Using 'snaked' as an active verb to capture the winding path of a river is a metaphorical description.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Girl Who Can', the author, Ama Ata Aidoo, uses humor and irony to address a serious social issue. What is that issue?",
    options: [
      "The spread of tropical diseases in rural Ghana",
      "The narrow, restrictive expectations placed on girls and women in traditional societies",
      "The lack of proper sports stadiums in regional capitals",
      "The high cost of school uniforms in rural districts"
    ],
    answer: "The narrow, restrictive expectations placed on girls and women in traditional societies",
    hint: "Look at the central conflict between domestic utility and personal potential.",
    solution: "Aidoo uses a blend of humor and irony to examine how traditional social structures limit girls' identities to domestic labor and childbearing.",
    target: "Author's Purpose: 'The Girl Who Can'"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// "A Day's Wait" by Ernest Hemingway
// =========================================================================
const capstone5B7IntermediateQuestions = [
  {
    questionNumber: 51,
    question: "According to the passage, why did Schatz refuse to let his father or anyone else stay in his bedroom?",
    options: [
      "He wanted to sleep without being disturbed by pirate stories",
      "He believed his illness was lethal and selflessly wanted to protect his family from catching it",
      "He was angry with his father for going hunting on the frozen creek",
      "He was trying to hide a thermometer he had broken on the floor"
    ],
    answer: "He believed his illness was lethal and selflessly wanted to protect his family from catching it",
    hint: "Review his statement in the text: 'You can't come in... You mustn't get what I have.'",
    solution: "Schatz believed he had a fatal condition and told his father, 'You mustn't get what I have,' showing he was protecting his loved ones from infection.",
    target: "Capstone Exam: Character Motivation"
  },
  {
    questionNumber: 52,
    question: "What physical detail in paragraph 3 indicates that Schatz was emotionally detached from his surroundings while his father read aloud?",
    options: [
      "He fell into a deep, peaceful sleep with the dog beside him",
      "His face was very white, he had dark areas under his eyes, and he lay still, not following the story",
      "He asked his father to explain difficult words from the pirate book",
      "He complained loudly that the room was too cold"
    ],
    answer: "His face was very white, he had dark areas under his eyes, and he lay still, not following the story",
    hint: "Look at how Hemingway describes Schatz's face, eyes, and stillness in paragraph 3.",
    solution: "Paragraph 3 notes: 'His face was very white and there were dark areas under his eyes. He lay still in the bed and seemed very detached from what was going on.'",
    target: "Capstone Exam: Textual Evidence"
  },
  {
    questionNumber: 53,
    question: "What is the core misunderstanding between the French Celsius scale and the American Fahrenheit scale that caused Schatz's fear?",
    options: [
      "In France, a temperature of 102 degrees means freezing, while in America it means hot",
      "Schatz learned in France that a fever above 44 degrees Celsius is fatal, so he thought 102 degrees Fahrenheit was well beyond survival",
      "The doctor used a broken French thermometer that gave an inaccurate reading",
      "Schatz believed that forty-four degrees Fahrenheit was the normal human temperature"
    ],
    answer: "Schatz learned in France that a fever above 44 degrees Celsius is fatal, so he thought 102 degrees Fahrenheit was well beyond survival",
    hint: "Check Schatz's explanation near the end: 'At school in France the boys told me you can't live with forty-four degrees. I've got a hundred and two.'",
    solution: "Schatz was applying the Celsius scale where 44°C is lethal; hearing that he had 102°, he assumed he had exceeded the survival threshold by more than double.",
    target: "Capstone Exam: Plot Analysis"
  },
  {
    questionNumber: 54,
    question: "What figure of speech does Hemingway use in describing the frozen landscape: 'it seemed as though all the bare trees... had been varnished with ice'?",
    options: [
      "Simile (comparing the icy coating on the trees to a layer of varnish using 'as though')",
      "Personification (giving the ice human emotions)",
      "Onomatopoeia (imitating the sound of cracking ice)",
      "Hyperbole (exaggerating the weight of the ice)"
    ],
    answer: "Simile (comparing the icy coating on the trees to a layer of varnish using 'as though')",
    hint: "Notice the comparison formula 'it seemed as though... varnished with ice'.",
    solution: "Comparing the shiny layer of frozen sleet on trees to a wood varnish using 'as though' constitutes a descriptive simile.",
    target: "Capstone Exam: Figurative Language Decoding"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the central cause of Schatz's day-long ordeal.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Schatz confused Fahrenheit temperature with Celsius degrees.",
      "Because of the French thermometer, the young boy thought he was going to die all day.",
      "Confusing two different thermometers during a light epidemic of winter influenza.",
      "A light fever."
    ],
    answer: "Schatz confused Fahrenheit temperature with Celsius degrees.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Schatz confused Fahrenheit temperature with Celsius degrees' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and captures the core cause. Option C is a fragment (0 marks), and Option B has 15 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployCockcrowB7Intermediate() {
  console.log("Building 55 UNIQUE questions for Basic 7 (JHS 1) Cockcrow Intermediate Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B7IntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_C_I_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B7",
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
      learningCompetency: "B7.2.2.1 / B7.2.3.1: Analyze dramatic irony, thematic conflicts, authorial tone, and character psychology in prescribed Cockcrow short stories."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B7IntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${aDaysWaitCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_C_I_${item.questionNumber}`,
      level: "B7",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: aDaysWaitCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B7.2.2.1 / B7.2.3.1: Comprehensive multi-paragraph textual analysis of prescribed literature, evaluating dramatic irony, narrative structure, and formulating concise thematic summaries."
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

  // 3. Write practice_labs/B7_intermediate subcollections
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B7_intermediate`);
      await subDocRef.set({
        level: "B7",
        difficulty: "intermediate",
        title: "Basic 7 Intermediate Lab: 50 Unique Cockcrow Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Literary Nuance, Dramatic Irony & Themes) + 5 Capstone Full-Passage Questions",
          passageVisibility: "Passage embedded both in passageText and at the top of prompt",
          curriculum: "NaCCA Common Core Programme (CCP) Standard",
          prescribedTextsCovered: ["A Day's Wait by Ernest Hemingway", "The Girl Who Can by Ama Ata Aidoo"],
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
      console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
    }
  }

  // 4. Synchronize into main document practicePool.medium for b7 and jhs1
  console.log("\nSynchronizing main document practicePool.medium for b7 and jhs1...");
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
        const b7Level = existingLevels.b7 || {};
        const jhs1Level = existingLevels.jhs1 || {};

        const updatedLevels = {
          ...existingLevels,
          b7: {
            ...b7Level,
            practicePool: {
              ...(b7Level.practicePool || {}),
              medium: mappedMediumQuestions
            }
          },
          jhs1: {
            ...jhs1Level,
            practicePool: {
              ...(jhs1Level.practicePool || {}),
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B7 Intermediate!`);
}

deployCockcrowB7Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B7 Intermediate Lab:", err);
    process.exit(1);
  });

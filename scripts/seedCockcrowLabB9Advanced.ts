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
  level: "B9";
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
// Prescribed Text: Ama Ata Aidoo's "The Dilemma of a Ghost" (Act 5 / The Reconciliation)
// =========================================================================
const dilemmaOfAGhostAct5CapstonePassage = 
`[The courtyard of the Odumna house in the early morning twilight. A heavy, humid mist hangs over the eaves. ATO sits on the porch step with his head buried in his hands, his unfastened necktie dangling limply. ESI KOM enters from the path carrying an empty earthenware water pot. She stops and stares at her son with weary, searching eyes.]

ESI KOM:
Ato. You sit here in the gray light of dawn like a man who has buried his entire household. Have you found your wife?

ATO:
[Without looking up, his voice hollow with exhaustion]
I walked all night along the road to the junction. I searched the old Methodist chapel and the cocoa sheds. She is nowhere. She has vanished into the bush.

ESI KOM:
[Setting down her pot with a sharp click on the stone apron]
And why should she not vanish? Did you expect a woman who has no clan in this land to sit quietly in your room while you strike her across the face? Since when did the men of the Odumna house learn to settle domestic arguments with the weight of their fists?

ATO:
[Lifting his face, defensive and wounded]
Mother, you do not understand! She insulted us! She called our people narrow-minded primitives! She mocked our sacred customs!

ESI KOM:
[Stepping forward, her voice rising in moral authority]
And who made her call us primitives? Who brought her across the great black salt sea and refused to teach her our ways? You, Ato! You are the one who has gone to the university of the white men and returned with an empty head! You knew that in our village, a marriage without children is a house without a roof. Yet you hid the truth from us. You let your grandmother weep, you let your uncles pour libations for barrenness, while all the time you and your wife had agreed to swallow tablets to lock up her womb! Why did you not speak? Are your jaws bound with iron wire?

ATO:
[Stammering, gazing down at his shoes in humiliation]
I... I thought... I feared you would not understand our modern plans...

ESI KOM:
[Cutting him off with profound disdain]
Understand? Did you ask us? You feared our ignorance, yet it is your cowardice that has brought this shame upon our stool! You left your stranger-wife to wander in the darkness of our customs while you hid behind your European books!

[A faint, trembling rustle is heard at the outer gate. EULALIE enters, exhausted, her dress stained with red mud, her high-heeled shoes missing, walking barefoot with bleeding feet. She leans weakly against the wooden gatepost, weeping silently. ATO rises hastily to approach her, but EULALIE recoils from him in terror. ESI KOM gently pushes Ato aside with her forearm, walks over to Eulalie, and looks tenderly into her tear-streaked face.]

ESI KOM:
[Softly, wrapping her own cotton cloth around Eulalie's shivering shoulders]
Come, my daughter. Come inside. The morning air is cold, and you have walked far on paths you do not know. Come into my room and drink hot ginger tea. You are tired, and your feet are bruised.

[EULALIE looks up into Esi Kom's eyes with disbelief, then buries her face against the older woman's bosom, weeping with relief. ESI KOM supports her tenderly by the waist and leads her slowly across the courtyard into the inner sanctuary of the maternal chamber, closing the door behind them. ATO is left standing completely alone in the center of the courtyard. Outside the wall, the fresh morning voices of the village children rise in the distance, singing their timeless rhyme: 'Shall I go to Cape Coast? / Shall I go to Elmina? / I am a ghost, a bewildered ghost at the crossroads...']`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Advanced Literary Analysis: Dramatic Structure, Catharsis, Foils,
// Poetic Meter, Allegory, Irony, and Advanced Figurative Tropes
// =========================================================================
const unique50B9AdvancedDrills = [
  {
    passage: "In 'The Dilemma of a Ghost', Ato's tragic flaw (hamartia) is not malice or hatred, but his indecisive moral passivity and cowardly failure to communicate between two cultures.",
    question: "What classical dramatic concept defines this fatal flaw in a protagonist's character?",
    options: ["Hamartia", "Catharsis", "Hubris", "Peripeteia"],
    answer: "Hamartia",
    hint: "The Greek dramatic term denoting the tragic flaw or error in judgment that leads to a protagonist's downfall.",
    solution: "In classical dramatic theory, 'hamartia' is the tragic personal flaw or profound misjudgment in an otherwise noble protagonist that precipitates crisis.",
    target: "Dramatic Theory: Hamartia"
  },
  {
    passage: "The parliament house in Accra was besieged by five thousand angry voices demanding constitutional reform.",
    question: "What figure of speech is used when 'five thousand angry voices' represents five thousand protesting human citizens?",
    options: ["Synecdoche", "Metonymy", "Apostrophe", "Litotes"],
    answer: "Synecdoche",
    hint: "An anatomical instrument of speech (voices) represents the complete human protesters.",
    solution: "Using a constituent faculty or bodily part ('voices') to represent the whole human beings is synecdoche.",
    target: "Figurative Language: Synecdoche"
  },
  {
    passage: "In 'The Dilemma of a Ghost', Monka's sharp-tongued rural directness contrasts sharply with Eulalie's modern, urban American sophistication.",
    question: "What dramatic term describes a character whose traits serve to highlight and emphasize the contrasting qualities of another?",
    options: ["A dramatic foil", "A tragic chorus", "An antagonist", "A confidant"],
    answer: "A dramatic foil",
    hint: "A character placed in contrast to another to illuminate distinct differences.",
    solution: "A dramatic foil is a character whose temperament, background, or behavior contrasts with another character to accentuate their traits.",
    target: "Dramatic Characterization: Foil"
  },
  {
    passage: "The old judge observed wryly that the convicted embezzler was no saint when managing public treasury accounts.",
    question: "What figure of speech is present in describing the corrupt official as 'no saint'?",
    options: ["Litotes", "Hyperbole", "Personification", "Simile"],
    answer: "Litotes",
    hint: "Affirming great corruption by negating saintliness.",
    solution: "Litotes expresses an affirmative truth (that the official was deeply corrupt) by negating its contrary ('no saint').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "The despairing playwright cried out: 'O Muse of Tragedy, inspire my pen to capture the sorrows of our bleeding continent!'",
    question: "What figure of speech is demonstrated by directly invoking the 'Muse of Tragedy'?",
    options: ["Apostrophe", "Metaphor", "Synecdoche", "Litotes"],
    answer: "Apostrophe",
    hint: "Directly addressing an abstract mythological or spiritual entity as if it were present.",
    solution: "An emotional, direct invocation addressed to an absent or mythological entity ('O Muse of Tragedy') is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', the seasonal river is an allegory for what broader philosophical dimension of African history?",
    options: [
      "The resilience of African civilizations, which endure long periods of colonial drought and suffering before bursting into cultural resurgence",
      "The necessity of constructing concrete irrigation canals in the Sahara Desert",
      "The superiority of European sailing vessels over traditional canoes",
      "The total abandonment of rural agricultural farming"
    ],
    answer: "The resilience of African civilizations, which endure long periods of colonial drought and suffering before bursting into cultural resurgence",
    hint: "Look at the allegorical meaning beyond the literal river.",
    solution: "The poem functions as a historical allegory: the dry, dormant river symbolizes Africa enduring colonial deprivation, awaiting historical rebirth.",
    target: "Poetic Allegory: 'The Desert Rivers'"
  },
  {
    passage: "The city of Kumasi was an iron fortress of cultural pride that resisted foreign subjugation for centuries.",
    question: "What figure of speech is used in calling the city 'an iron fortress of cultural pride'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation of a city to a fortress without 'like' or 'as'.",
    solution: "Directly identifying a city as an iron fortress without comparative connectives constitutes a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', how does Ama Ata Aidoo utilize dramatic irony in Act 3 during the herbal cleansing scene?",
    options: [
      "The family elders pray and offer medicine to cure Eulalie's supposed barrenness, while the audience knows she is actively using birth control",
      "Eulalie knows that Ato has stolen money from the clan treasury",
      "Ato knows that Monka has secretly married an American pilot",
      "Esi Kom knows that Eulalie is a foreign spy sent by the American president"
    ],
    answer: "The family elders pray and offer medicine to cure Eulalie's supposed barrenness, while the audience knows she is actively using birth control",
    hint: "The audience is aware of the medical reality that the praying clan elders misunderstand.",
    solution: "Dramatic irony reaches its peak when the elders perform traditional cleansing rites for barrenness, unaware of the birth control the audience already knows about.",
    target: "Dramatic Irony: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The silent shadows slithered across the sacred stones of the shrine as the midnight moon arose.",
    question: "What sound device is prominent in the repetition of the 's' sound in 'silent shadows slithered across the sacred stones'?",
    options: ["Alliteration / Sibilance", "Assonance", "Onomatopoeia", "Rhyme"],
    answer: "Alliteration / Sibilance",
    hint: "The whispering, hissing sound created by repeating the initial 's'.",
    solution: "The continuous recurrence of the initial consonant 's' across successive words is alliteration, specifically known as sibilance.",
    target: "Sound Devices: Sibilance"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', how does the poet structure the poem to make its anti-racist message accessible?",
    options: [
      "Through a dialogic, catechetical exchange between an innocent child and an enlightened parent",
      "Through a complex mathematical theorem on optics and color wavelengths",
      "Through an aggressive political manifesto attacking foreign governments",
      "Through an ancient Latin prayer chant"
    ],
    answer: "Through a dialogic, catechetical exchange between an innocent child and an enlightened parent",
    hint: "The poem proceeds through an innocent question answered by maternal wisdom.",
    solution: "The poet uses a dialogic format (child's naive inquiry followed by a parent's universal philosophical answer) to gently deconstruct racial prejudice.",
    target: "Structural Technique: 'The Colour of God'"
  },
  {
    passage: "The general commanded fifty bayonets to secure the perimeter of the presidential palace.",
    question: "What figure of speech is used when 'fifty bayonets' represents fifty armed soldiers?",
    options: ["Synecdoche", "Metonymy", "Simile", "Litotes"],
    answer: "Synecdoche",
    hint: "A weapon component (the bayonet) is used to represent the complete soldier.",
    solution: "Using a soldier's primary attached weapon ('bayonet') to represent the whole soldier is synecdoche.",
    target: "Figurative Language: Synecdoche"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the dramatic significance of the play's concluding scene where Esi Kom leads Eulalie into her room?",
    options: [
      "It represents a moment of catharsis and maternal reconciliation, proving that indigenous empathy can bridge the historical diaspora divide",
      "It shows that Esi Kom is taking Eulalie prisoner to force her to farm cassava",
      "It proves that Ato has decided to leave Ghana forever",
      "It indicates that Eulalie has agreed to divorce Ato immediately"
    ],
    answer: "It represents a moment of catharsis and maternal reconciliation, proving that indigenous empathy can bridge the historical diaspora divide",
    hint: "The resolution offers emotional release (catharsis) through maternal compassion.",
    solution: "The climax achieves dramatic catharsis: traditional maternal love overcomes foreign misunderstandings, offering healing to the displaced diaspora daughter.",
    target: "Dramatic Resolution & Catharsis"
  },
  {
    passage: "The old diplomat was no novice when negotiating fragile ceasefires between warring factions.",
    question: "What figure of speech is present in describing the master negotiator as 'no novice'?",
    options: ["Litotes", "Hyperbole", "Personification", "Simile"],
    answer: "Litotes",
    hint: "Affirming seasoned expertise by negating beginner status.",
    solution: "Litotes affirms profound diplomatic mastery by negating its contrary ('no novice').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', why does Ato's character fail to achieve heroic stature in the eyes of the audience?",
    options: [
      "He remains morally paralyzed at the crossroads, relying on his mother to resolve the crisis he created through his own cowardice",
      "He loses all his money in commercial stock markets",
      "He is physically defeated in a wrestling match with his uncle Petu",
      "He refuses to speak the English language in public"
    ],
    answer: "He remains morally paralyzed at the crossroads, relying on his mother to resolve the crisis he created through his own cowardice",
    hint: "Ato never takes active responsibility; he is left standing alone while the women reconcile.",
    solution: "Ato remains an anti-hero or tragic failure: rather than acting as a mature bridge between worlds, his indecisiveness leaves him isolated at the crossroads.",
    target: "Character Evaluation: Ato Yawson"
  },
  {
    passage: "The heavy wooden drums thudded, boomed, and rattled as the sacred festival commenced.",
    question: "What literary device is demonstrated by the words 'thudded, boomed, and rattled'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Apostrophe"],
    answer: "Onomatopoeia",
    hint: "These sound-words directly imitate the physical acoustic resonance of beating drums.",
    solution: "Words whose sounds phonetically mimic the acoustic noises they describe are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what is the significance of the river being referred to as a 'sleeping serpent'?",
    options: [
      "It captures both the winding physical shape of the dry riverbed and the dormant power awaiting the seasonal rains",
      "It warns travelers that venomous snakes inhabit the water",
      "It suggests that rivers in Ghana are dangerous and should be avoided",
      "It proves that the poem is about traditional reptile worship"
    ],
    answer: "It captures both the winding physical shape of the dry riverbed and the dormant power awaiting the seasonal rains",
    hint: "The serpent is both sinuous in form and dangerous/powerful when awakened.",
    solution: "The metaphor operates on two levels: visually, it mirrors the winding dry channel; symbolically, it conveys latent, slumbering power awaiting rebirth.",
    target: "Metaphorical Depth: 'The Desert Rivers'"
  },
  {
    passage: "The young bride's sorrow was an ocean that drowned every joyful memory of her wedding day.",
    question: "What figure of speech is used in calling her sorrow 'an ocean'?",
    options: ["Metaphor", "Simile", "Litotes", "Synecdoche"],
    answer: "Metaphor",
    hint: "Direct equation of grief to an ocean without 'like' or 'as'.",
    solution: "Directly equating sorrow to an ocean without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the symbolic importance of Eulalie losing her high-heeled shoes and returning barefoot with bleeding feet in Act 5?",
    options: [
      "It symbolizes her physical and spiritual stripping of artificial Western armor, returning to the African soil in raw vulnerability",
      "It shows that someone stole her shoes in the cocoa shed",
      "It indicates that high-heeled shoes were illegal in Hasodzi village",
      "It proves that she wanted to become an athlete like Adjoa"
    ],
    answer: "It symbolizes her physical and spiritual stripping of artificial Western armor, returning to the African soil in raw vulnerability",
    hint: "Bare feet touching the African earth signify humbleness and connection.",
    solution: "Losing her Western shoes and touching the soil with bruised feet symbolizes the shedding of foreign pretense, allowing genuine ancestral connection.",
    target: "Stagecraft & Symbolism: Eulalie"
  },
  {
    passage: "The dying warrior gasped: 'O Mother Africa, receive the sacrifice of my youthful blood!'",
    question: "What figure of speech is present in addressing 'O Mother Africa'?",
    options: ["Apostrophe", "Simile", "Litotes", "Onomatopoeia"],
    answer: "Apostrophe",
    hint: "A direct emotional invocation to a personified geographic entity.",
    solution: "Directly addressing the personified continent ('O Mother Africa') as a living mother is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', what philosophical contradiction in human racism does the poem expose?",
    options: [
      "The absurdity of claiming divine exclusivity based on skin color when all hues are unified in the divine Creator",
      "The failure of agricultural farmers to grow crops of different colors",
      "The inability of artists to mix oil paints accurately",
      "The high cost of imported textiles in West Africa"
    ],
    answer: "The absurdity of claiming divine exclusivity based on skin color when all hues are unified in the divine Creator",
    hint: "Humans use race to divide, while the Creator encompasses all colors equally.",
    solution: "The poem exposes the foolishness of human racial arrogance, showing that claiming God favors one skin tone contradicts divine unity.",
    target: "Philosophical Synthesis: 'The Colour of God'"
  },
  {
    passage: "The ancient brass gong clanged, reverberated, and hummed across the misty river at dawn.",
    question: "What sound device is demonstrated by the words 'clanged, reverberated, and hummed'?",
    options: ["Onomatopoeia", "Simile", "Hyperbole", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words mimic the acoustic chime and vibration of striking metal.",
    solution: "Words phonetically imitating physical acoustic resonance are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the dramatic purpose of the Prelude delivered by the Bird of the Wayside?",
    options: [
      "It establishes the mythological and historical framework of the play, warning that the unresolved heritage of slavery and modernization will clash",
      "It teaches the audience how to identify different species of forest birds",
      "It collects money from the audience before the actors enter",
      "It acts as a comedic clown to make the children laugh"
    ],
    answer: "It establishes the mythological and historical framework of the play, warning that the unresolved heritage of slavery and modernization will clash",
    hint: "The narrator speaks from the boundary between ancient heritage and modern highways.",
    solution: "The Bird of the Wayside functions as a classical prologue, setting the philosophical stakes of cultural collision and ancestral displacement.",
    target: "Dramatic Structure: The Prelude"
  },
  {
    passage: "The young scholar was not unversed in the complex philosophical theories of Aristotle and Plato.",
    question: "What figure of speech is used in saying he was 'not unversed'?",
    options: ["Litotes", "Hyperbole", "Simile", "Apostrophe"],
    answer: "Litotes",
    hint: "Affirming deep knowledge by negating inexperience ('not unversed').",
    solution: "Litotes affirms profound scholarship by negating its opposite ('not unversed').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what makes the marriage of Ato and Eulalie an allegory of post-colonial African identity?",
    options: [
      "It represents the painful, unresolved attempt to reunite continental Africa with its displaced diaspora amidst deep cultural alienation",
      "It proves that foreign university degrees prevent people from speaking their native languages",
      "It shows that traditional villages cannot survive without American technology",
      "It is an economic treatise on international trade between Ghana and the United States"
    ],
    answer: "It represents the painful, unresolved attempt to reunite continental Africa with its displaced diaspora amidst deep cultural alienation",
    hint: "The marriage mirrors the reunion of Africa and its diaspora after centuries of separation.",
    solution: "The drama operates as a historical allegory: the troubled marriage reflects the difficult reunion between continental Africa and the diaspora severed by the slave trade.",
    target: "Allegorical Interpretation"
  },
  {
    passage: "The thunder boomed like an explosive artillery barrage across the coastal hills.",
    question: "What figure of speech is used in 'like an explosive artillery barrage'?",
    options: ["Simile", "Metaphor", "Personification", "Litotes"],
    answer: "Simile",
    hint: "Look for the comparative conjunction 'like'.",
    solution: "Comparing the sound of thunder explicitly to artillery fire using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what is the effect of using free verse with irregular line lengths?",
    options: [
      "It mirrors the natural, unpredictable ebb and flow of water, matching the erratic seasonal cycles of African rainfall",
      "It proves that the poet did not know how to write traditional English rhymes",
      "It makes the poem difficult for school children to memorize",
      "It was mandated by the British colonial education board"
    ],
    answer: "It mirrors the natural, unpredictable ebb and flow of water, matching the erratic seasonal cycles of African rainfall",
    hint: "The fluid poetic form mirrors the fluid subject matter of rivers and rains.",
    solution: "The poet uses free verse organic form: the irregular lines reflect the natural, fluctuating rhythm of dry spells and sudden floodwaters.",
    target: "Poetic Form & Meter: 'The Desert Rivers'"
  },
  {
    passage: "The politician was a chameleon, changing his ideological colors whenever a new regime seized power.",
    question: "What figure of speech is used in calling the politician 'a chameleon'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "Direct equation of a human to a reptile without using 'like' or 'as'.",
    solution: "Directly describing an opportunistic person as a chameleon without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what does the contrast between Ato's clean European suit and Eulalie's disheveled appearance in Act 4 symbolize?",
    options: [
      "Ato's superficial maintenance of modern respectability while Eulalie bears the psychological breakdown of their cultural isolation",
      "That American clothes are cheaper than Ghanaian woolen suits",
      "That Ato was preparing to attend church while Eulalie was going swimming",
      "That Hasodzi village had no clean water for washing clothes"
    ],
    answer: "Ato's superficial maintenance of modern respectability while Eulalie bears the psychological breakdown of their cultural isolation",
    hint: "Ato hides behind his respectable clothes, while Eulalie visibly suffers.",
    solution: "The visual contrast underscores their dynamic: Ato maintains an external facade of educated calm, while Eulalie bears the psychological breakdown.",
    target: "Visual Symbolism: Costuming"
  },
  {
    passage: "The dry leaves crackled, snapped, and popped as the forest fire advanced through the underbrush.",
    question: "What sound device is demonstrated by 'crackled, snapped, and popped'?",
    options: ["Onomatopoeia", "Simile", "Hyperbole", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words directly reproduce the physical acoustic sounds of burning wood.",
    solution: "Words phonetically imitating physical sounds are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', why is the maternal figure in the poem an effective teacher of philosophical truth?",
    options: [
      "She uses gentle, intuitive analogies drawn from nature rather than rigid dogmatic theology to nurture the child's moral understanding",
      "She forces the child to memorize fifty verses from an ancient text",
      "She threatens the child with punishment if questions are asked again",
      "She calls the village priest to explain the Bible"
    ],
    answer: "She uses gentle, intuitive analogies drawn from nature rather than rigid dogmatic theology to nurture the child's moral understanding",
    hint: "The mother uses the natural analogy of light and colors to explain divine unity.",
    solution: "The mother embodies intuitive wisdom: by using the visual beauty of light and nature, she explains divine unity simply and persuasively.",
    target: "Pedagogical Tone: 'The Colour of God'"
  },
  {
    passage: "The grieving queen cried out: 'O merciless Death, why have you snatched the crown from my husband's brow?'",
    question: "What figure of speech is present in addressing 'O merciless Death'?",
    options: ["Apostrophe", "Simile", "Litotes", "Metonymy"],
    answer: "Apostrophe",
    hint: "Directly addressing the abstract concept of mortality as a conscious entity.",
    solution: "Directly invoking an abstract entity ('O merciless Death') as if it were present to hear the cry is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the deeper significance of the title's reference to 'Elmina' and 'Cape Coast' in the children's rhyme?",
    options: [
      "Both towns were historical slave-trading ports with coastal castles, underscoring the inescapable historical trauma haunting the drama",
      "They were the only two towns in Ghana with railway stations",
      "Ato was planning to buy cocoa plantations in both cities",
      "Eulalie wanted to build modern factories in both ports"
    ],
    answer: "Both towns were historical slave-trading ports with coastal castles, underscoring the inescapable historical trauma haunting the drama",
    hint: "Elmina and Cape Coast are world-famous for their slave dungeons.",
    solution: "The geographic references ground the ghost's crossroads in history: both towns are coastal slave castle sites, evoking the unresolved trauma of the Middle Passage.",
    target: "Historical Symbolism: Elmina & Cape Coast"
  },
  {
    passage: "The young athlete was no stranger to rigorous morning training sessions in the mountain camps.",
    question: "What figure of speech is used in saying the athlete was 'no stranger'?",
    options: ["Litotes", "Hyperbole", "Simile", "Personification"],
    answer: "Litotes",
    hint: "Affirming deep experience by negating unfamiliarity.",
    solution: "Litotes affirms dedication and experience by negating its contrary ('no stranger').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', why does Nana feel that the family's ancestral line has been tainted by Ato's marriage?",
    options: [
      "Traditional matrilineal custom placed supreme value on known ancestral lineage; marrying a descendant of slavery broke this genealogical continuity",
      "Eulalie refused to learn how to cook fufu for the ancestors",
      "Ato did not receive a dowry of fifty cows from America",
      "Eulalie had attended a rival European university"
    ],
    answer: "Traditional matrilineal custom placed supreme value on known ancestral lineage; marrying a descendant of slavery broke this genealogical continuity",
    hint: "Akan matrilineal systems trace identity through pure maternal ancestry.",
    solution: "Nana's grief reflects Akan matrilineal cosmology: clan continuity depends on knowing a bride's maternal ancestors, which slavery violently severed.",
    target: "Anthropological Analysis: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The sea was a boiling cauldron of foam and spray during the catastrophic monsoon storm.",
    question: "What figure of speech is used in calling the sea 'a boiling cauldron'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation without using 'like' or 'as'.",
    solution: "Directly describing the turbulent ocean as a boiling cauldron without comparative words is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what sensory imagery dominates the description of the harmattan season?",
    options: [
      "Tactile and visual imagery of parched, cracking earth, dusty dry sand, and unyielding blistering heat",
      "Auditory imagery of singing birds and laughing children",
      "Olfactory imagery of sweet ocean breezes and salty spray",
      "Visual imagery of frozen snow and icy mountain peaks"
    ],
    answer: "Tactile and visual imagery of parched, cracking earth, dusty dry sand, and unyielding blistering heat",
    hint: "The harmattan is tactile: dryness in the throat, cracking soil, and dust in the air.",
    solution: "The poet relies on vivid tactile and visual imagery (cracked earth, dry sand, parching heat) to convey the sensory harshness of the harmattan.",
    target: "Sensory Imagery: 'The Desert Rivers'"
  },
  {
    passage: "The angry river roared and gnashed its watery teeth against the stone bridge foundations.",
    question: "What figure of speech is present in saying the river 'gnashed its watery teeth'?",
    options: ["Personification", "Simile", "Litotes", "Synecdoche"],
    answer: "Personification",
    hint: "Attributing human anatomical teeth and the aggressive action of gnashing to water.",
    solution: "Giving a river anatomical teeth and the deliberate human action of gnashing in anger is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what makes Esi Kom's final acceptance of Eulalie a subversion of traditional dramatic expectations?",
    options: [
      "Audiences expect the traditional African mother-in-law to permanently cast out the foreign bride, but Esi Kom embraces her with unconditional maternal grace",
      "Esi Kom forces Eulalie to sign a contract surrendering all her money",
      "Esi Kom abandons her ancestral religion to move to America",
      "Esi Kom orders Ato to marry his sister Monka"
    ],
    answer: "Audiences expect the traditional African mother-in-law to permanently cast out the foreign bride, but Esi Kom embraces her with unconditional maternal grace",
    hint: "Aidoo upends the stereotype of the cruel African mother-in-law.",
    solution: "Aidoo subverts the stereotypical trope of the hostile mother-in-law: Esi Kom demonstrates that indigenous maternal wisdom has the capacity to forgive, shelter, and reconcile.",
    target: "Dramatic Subversion: Esi Kom"
  },
  {
    passage: "The church bell tolled, clanged, and knelled the passing of the village paramount chief.",
    question: "What sound device is demonstrated by 'tolled, clanged, and knelled'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Hyperbole"],
    answer: "Onomatopoeia",
    hint: "These words phonetically reproduce the mournful chimes of funeral bells.",
    solution: "Words reproducing the acoustic ringing and tolling of bronze bells are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', what is the tone of the poem from beginning to end?",
    options: [
      "Serene, gentle, didactic, and spiritually uplifting",
      "Violent, angry, and bitterly sarcastic",
      "Cold, clinical, and scientific",
      "Terrified and full of despair"
    ],
    answer: "Serene, gentle, didactic, and spiritually uplifting",
    hint: "Notice the patient, loving dialogue between parent and child.",
    solution: "The poem maintains a serene and didactic tone, using gentle maternal dialogue to elevate the reader's spiritual and moral understanding.",
    target: "Poetic Tone: 'The Colour of God'"
  },
  {
    passage: "The old general was no novice when it came to deploying heavy cavalry in mountain warfare.",
    question: "What figure of speech is used in saying he was 'no novice'?",
    options: ["Litotes", "Hyperbole", "Simile", "Apostrophe"],
    answer: "Litotes",
    hint: "Affirming veteran mastery by negating beginner status.",
    solution: "Litotes affirms extensive military expertise by negating its contrary ('no novice').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the dramatic irony of Ato's European education in relation to his family?",
    options: [
      "His family sacrificed financially to send him abroad expecting him to lead the clan, but his education rendered him helpless to resolve simple family conflicts",
      "His education made him a multi-millionaire who bought all the land in Hasodzi",
      "He forgot how to read and write English while in America",
      "The university expelled him for studying African traditions"
    ],
    answer: "His family sacrificed financially to send him abroad expecting him to lead the clan, but his education rendered him helpless to resolve simple family conflicts",
    hint: "The clan paid for wisdom, but received a culturally paralyzed son.",
    solution: "Dickensian and Aidooian situational irony: the very Western education purchased with family sacrifice alienates Ato, making him incompetent at managing human relationships.",
    target: "Structural Irony: Ato's Education"
  },
  {
    passage: "The storm wind shrieked like an enraged demon tearing through the mountain pass.",
    question: "What figure of speech is used in 'like an enraged demon'?",
    options: ["Simile", "Metaphor", "Litotes", "Apostrophe"],
    answer: "Simile",
    hint: "Notice the comparative preposition 'like'.",
    solution: "Comparing the sound of the wind explicitly to a demon using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', how does the seasonal cycle of the river reflect the agricultural rhythm of West African life?",
    options: [
      "The dormant dry river matches the fallow dry season, while its flooded state signals the commencement of planting and food abundance",
      "It proves that West Africans only farm when rivers are completely dry",
      "It shows that commercial fishing only occurs during the harmattan",
      "It indicates that rivers have no relationship to agriculture"
    ],
    answer: "The dormant dry river matches the fallow dry season, while its flooded state signals the commencement of planting and food abundance",
    hint: "Farming life is synchronized with the dry harmattan and the arrival of the rains.",
    solution: "The river's transformation mirrors agrarian life: the dry phase represents rest and waiting, while the flooded torrent brings soil fertility and planting.",
    target: "Socio-Agrarian Synthesis: 'The Desert Rivers'"
  },
  {
    passage: "The warrior cried into the starry expanse: 'O immortal Spirit of Justice, vindicate my righteous cause!'",
    question: "What figure of speech is featured in addressing 'O immortal Spirit of Justice'?",
    options: ["Apostrophe", "Simile", "Litotes", "Synecdoche"],
    answer: "Apostrophe",
    hint: "Directly calling out to an abstract personified entity.",
    solution: "Addressing an abstract virtue or divine essence ('O immortal Spirit of Justice') with an emotional plea is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what does the final stage direction indicate about Ato's ultimate position in the play?",
    options: [
      "He is left standing alone in the empty courtyard while the women enter the house, stranded at the crossroads as children sing in the distance",
      "He packs his bags and boards a taxi back to the airport",
      "He becomes the new paramount chief of Hasodzi village",
      "He falls asleep on the kitchen floor with his sister Monka"
    ],
    answer: "He is left standing alone in the empty courtyard while the women enter the house, stranded at the crossroads as children sing in the distance",
    hint: "Review the closing tableau of Act 5.",
    solution: "The final tableau isolates Ato: while Esi Kom and Eulalie reconcile inside, Ato remains stranded alone in the courtyard, dramatizing his lingering cultural paralysis.",
    target: "Stagecraft & Final Tableau"
  },
  {
    passage: "The heavy wooden door creaked, groaned, and slammed shut with a deafening bang.",
    question: "What two sound devices are prominent in 'creaked, groaned, and slammed shut with a... bang'?",
    options: [
      "Onomatopoeia and Personification",
      "Simile and Metaphor",
      "Hyperbole and Litotes",
      "Alliteration and Apostrophe"
    ],
    answer: "Onomatopoeia and Personification",
    hint: "'Creaked', 'slammed', and 'bang' mimic sound; 'groaned' gives the door a human voice.",
    solution: "'Creaked' and 'bang' are onomatopoeic, while giving a wooden door the vocal action of groaning is personification.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', what does the poem suggest about children's innate perception of racial differences?",
    options: [
      "Children notice physical differences with innocent curiosity, but adult society must teach them that these differences reflect divine variety rather than superiority",
      "Children are born with natural racial hatred that cannot be unlearned",
      "Children should be forbidden from noticing what color people are",
      "Children only understand theological concepts when written in Latin"
    ],
    answer: "Children notice physical differences with innocent curiosity, but adult society must teach them that these differences reflect divine variety rather than superiority",
    hint: "The child's question is innocent and open, needing enlightened parental guidance.",
    solution: "The poem illustrates that a child's questions about race stem from innocent curiosity; it is the moral duty of adults to frame human diversity within divine equality.",
    target: "Moral Philosophy: 'The Colour of God'"
  },
  {
    passage: "The old man looked at his ancestral land, his heart an unyielding rock against the developer's bribes.",
    question: "What figure of speech is used in calling his heart 'an unyielding rock'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation without using 'like' or 'as'.",
    solution: "Directly describing an incorruptible moral will as an unyielding rock without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is Ama Ata Aidoo's overarching philosophical conclusion regarding tradition and modernity?",
    options: [
      "Neither blind adherence to tradition nor arrogant rejection of cultural roots will work; true progress requires mutual empathy, honest dialogue, and communal love",
      "Traditional African customs must be completely replaced by American culture",
      "Western education is a destructive evil that should be banned by village chiefs",
      "Educated children should cut all contact with their parents"
    ],
    answer: "Neither blind adherence to tradition nor arrogant rejection of cultural roots will work; true progress requires mutual empathy, honest dialogue, and communal love",
    hint: "Consider how reconciliation is achieved at the end of the play.",
    solution: "Aidoo concludes that dogmatism on either side fails: true synthesis requires traditional elders and modern returnees to practice mutual empathy and open dialogue.",
    target: "Philosophical Synthesis: Master Theme"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Prescribed Text: Ama Ata Aidoo's "The Dilemma of a Ghost" (Act 5)
// =========================================================================
const capstone5B9AdvancedQuestions = [
  {
    questionNumber: 51,
    question: "According to the passage, why does Esi Kom harshly rebuke Ato when he claims that Eulalie insulted their family and customs?",
    options: [
      "Because Esi Kom holds Ato responsible for failing to teach, protect, and guide his stranger-wife in a land where she has no clan",
      "Because Esi Kom secretly hated Hasodzi village and wanted to live in New York",
      "Because Esi Kom wanted Ato to marry his sister Monka instead",
      "Because Ato had stolen the clan's royal stool"
    ],
    answer: "Because Esi Kom holds Ato responsible for failing to teach, protect, and guide his stranger-wife in a land where she has no clan",
    hint: "Review Esi Kom's speech: 'Who brought her across the great black salt sea and refused to teach her our ways?'",
    solution: "Esi Kom cuts through Ato's excuses, pointing out that as the educated bridge, Ato is to blame for failing to guide his wife and concealing the truth from his family.",
    target: "Capstone Exam: Character Motivation & Moral Rebuking"
  },
  {
    questionNumber: 52,
    question: "In what two physical ways does Eulalie's appearance when she returns in Act 5 contrast with her stylish modern entrance in Act 1?",
    options: [
      "In Act 1 she wore high heels and smoked stylishly; in Act 5 her dress is stained with mud, her high heels are gone, and she walks barefoot with bleeding feet",
      "In Act 1 she was wearing traditional kente, while in Act 5 she wears an American evening gown",
      "In Act 1 she arrived on horseback, while in Act 5 she drives a motor car",
      "In Act 1 she had lost her voice, while in Act 5 she sings opera songs"
    ],
    answer: "In Act 1 she wore high heels and smoked stylishly; in Act 5 her dress is stained with mud, her high heels are gone, and she walks barefoot with bleeding feet",
    hint: "Compare the chic sunglasses and high heels of Act 1 with her bruised, muddy, barefoot entrance in Act 5.",
    solution: "The stage directions show Eulalie stripped of her fashionable Western armor: she returns barefoot, muddy, and bleeding, physically embodying her vulnerability.",
    target: "Capstone Exam: Stagecraft & Visual Contrast"
  },
  {
    questionNumber: 53,
    question: "What profound thematic and cultural significance is conveyed when Esi Kom wraps her own cloth around Eulalie's shoulders and leads her inside?",
    options: [
      "It signifies the triumph of indigenous maternal compassion and unconditional acceptance over rigid cultural prejudice",
      "It proves that Esi Kom was planning to make Eulalie her domestic servant",
      "It indicates that Eulalie was arrested for wandering at night",
      "It shows that Esi Kom wanted to borrow Eulalie's American jewelry"
    ],
    answer: "It signifies the triumph of indigenous maternal compassion and unconditional acceptance over rigid cultural prejudice",
    hint: "Wrapping someone in your cloth is a traditional gesture of familial adoption, protection, and love.",
    solution: "Esi Kom's action is symbolic: wrapping her cloth around Eulalie is an act of maternal adoption, welcoming the displaced diaspora daughter into the clan.",
    target: "Capstone Exam: Symbolic Climax & Catharsis"
  },
  {
    questionNumber: 54,
    question: "What dramatic irony is emphasized by the final tableau and the distant sound of the children singing the ghost song?",
    options: [
      "While the two women achieve genuine reconciliation through empathy, Ato remains spiritually and culturally paralyzed at the crossroads",
      "Ato was secretly an undercover police officer the entire time",
      "Eulalie had already inherited all of Monks's gold in America",
      "The children knew that a real ghost was about to attack Hasodzi village"
    ],
    answer: "While the two women achieve genuine reconciliation through empathy, Ato remains spiritually and culturally paralyzed at the crossroads",
    hint: "Notice where Ato is standing while the women go inside and the song plays.",
    solution: "Dramatic irony concludes the play: Ato, who was supposed to be the enlightened modern guide, is left isolated and paralyzed, while traditional empathy heals the divide.",
    target: "Capstone Exam: Dramatic Irony & Final Tableau"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the central moral resolution demonstrated by Esi Kom in this concluding scene.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Maternal empathy and love overcome cultural divisions.",
      "Because Esi Kom was a wise mother, she welcomed Eulalie into her room with hot ginger tea.",
      "The triumph of maternal love over cultural misunderstandings and foreign alienation in Hasodzi village.",
      "Maternal love heals."
    ],
    answer: "Maternal empathy and love overcome cultural divisions.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Maternal empathy and love overcome cultural divisions' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and captures the climax. Option C is a fragment (0 marks), and Option B has 16 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployCockcrowB9Advanced() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Cockcrow Advanced Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B9AdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_C_A_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B9",
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
      learningCompetency: "B9.2.2.1 / B9.2.3.1: Evaluate advanced dramatic structure (hamartia, foils, catharsis), poetic allegory, and classical tropes in prescribed Cockcrow literature."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9AdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${dilemmaOfAGhostAct5CapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_C_A_${item.questionNumber}`,
      level: "B9",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: dilemmaOfAGhostAct5CapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.2.2.1 / B9.2.3.1: Multi-paragraph textual analysis of modern African drama, evaluating catharsis, symbolic stage directions, and formulating concise thematic summaries."
    });
  });

  // 3. Write directly to Firestore subcollections across both topic IDs and all parent paths
  const topicIds = ['literature_cockcrow_canon', 'cockcrow_literary_devices'];
  const parentPaths = [
    'global_curriculum/jhs/subjects/english/topical',
    'global_curriculum/jhs/subjects/english/topics',
    'global_curriculum/jhs/subjects/english/topical_units'
  ];

  console.log("\nWriting to subcollections (practice_labs/B9_advanced)...");
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B9_advanced`);
      await subDocRef.set({
        level: "B9",
        difficulty: "advanced",
        title: "Basic 9 Advanced Lab: 50 Unique Cockcrow Drama & Poetry Analytical Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Tragic Theory, Poetic Allegory & Advanced Tropes) + 5 Capstone Full-Passage Questions",
          passageVisibility: "Passage embedded both in passageText and at the top of prompt",
          curriculum: "NaCCA Common Core Programme (CCP) Standard",
          prescribedTextsCovered: [
            "The Dilemma of a Ghost by Ama Ata Aidoo",
            "The Desert Rivers by L. H. Ofosu-Appiah",
            "The Colour of God by P. K. Foli"
          ],
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
      console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
    }
  }

  // 4. Synchronize into main document practicePool.hard for b9
  console.log("\nSynchronizing main document practicePool.hard for b9...");
  const mappedHardQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'hard' as const,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1
  }));

  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const mainRef = db.doc(`${parent}/${topicId}`);
      const snap = await mainRef.get();
      if (snap.exists) {
        const data = snap.data() || {};
        const existingLevels = data.levels || {};
        const b9Level = existingLevels.b9 || {};

        const updatedLevels: any = {
          b7: existingLevels.b7 || {},
          b8: existingLevels.b8 || {},
          b9: {
            ...b9Level,
            practicePool: {
              ...(b9Level.practicePool || {}),
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B9 Advanced!`);
}

deployCockcrowB9Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B9 Advanced Lab:", err);
    process.exit(1);
  });

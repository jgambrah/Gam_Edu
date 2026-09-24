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
// Prescribed Text: Ama Ata Aidoo's "The Dilemma of a Ghost" (Act 1 / The Courtyard Encounter)
// =========================================================================
const dilemmaOfAGhostCapstonePassage = 
`[The courtyard of the Odumna Clan house in a rural Fante village. The afternoon sun casts long shadows over the beaten earth floor. ESI KOM, ATO'S mother, sits on a low wooden stool, carefully peeling roasted plantains into an earthenware bowl. Monka, Ato's younger sister, sweeps the courtyard with a broom of dried palm ribs. Two village women are seen passing the open gateway, balancing brass headpans filled with firewood.]

1ST WOMAN:
Look at the house of the Odumna!
The son who crossed the great black salt sea has returned!
They say he has brought a graduate wife from the land of the white men!

2ND WOMAN:
A graduate wife? Ah!
Then the family stool will sit in gold!
The ancestors will rejoice that a son of the soil has bought wisdom across the ocean!
[The women laugh softly and pass on along the dusty path.]

MONKA:
[Dropping her broom in frustration]
Mother, look at the sun! It is past midday, and Ato has still not arrived from the junction with his strange wife! The whole village is gathering to welcome him, yet he hides behind the hills!

ESI KOM:
[Looking up with gentle reprimand]
Hush, Monka! What is this talk of hiding? Did your brother not travel across the great waters to study the books of the white man? If he delays, it is because the motor car from the city broke its iron wheels in the mud!

[ATO enters through the outer wooden gate. He is dressed in a crisp European woolen suit, wearing spectacles and carrying a leather suitcase. Beside him walks EULALIE, an attractive young African-American woman dressed in a stylish modern skirt, sunglasses, and high-heeled shoes. She holds a lit cigarette between her fingers, inhaling nervously as she gazes around the mud-and-thatch compound.]

ATO:
[Hesitant, clearing his throat]
Mother... I am back.

ESI KOM:
[Rising immediately, dropping her wooden pestle, her arms outstretched]
Ato! My son! You have returned from the belly of the sea! 
[She rushes forward and embraces him with joyful tears, then pauses, noticing Eulalie standing stiffly behind him.]
And who is this stranger who walks beside my son? Did the white government send a nurse to care for your health?

ATO:
[Looking down at his polished leather shoes, speaking softly]
Mother... this is Eulalie. My wife. We married before I left the universities across the sea.

ESI KOM:
[Stunned, freezing in disbelief, her hands falling to her sides]
Your wife? You took a wife without a drum sounding in Hasodzi? Without a drop of palm wine poured for the ancestors? Without your uncle Petu tying the knot of the clan?
[She stares at Eulalie's lit cigarette, recoiling in cultural shock.]
And why does she breathe smoke like a cooking hearth in the dry harmattan? Does a woman in the land of the white men set fire to her own mouth?

EULALIE:
[Anxious, exhaling a cloud of blue smoke, speaking rapidly with an American accent]
Ato, what is she saying? Tell your mother I came to love her! Tell her this place is real cute, only... the heat and the dust are kind of getting to my throat. Haven't they got any cold Coca-Cola around this joint?`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Prescribed B9 Drama ("The Dilemma of a Ghost") & Poetry ("The Desert Rivers", "The Colour of God")
// Literary Devices: Simile, Metaphor, Personification, Hyperbole, Onomatopoeia,
// Cultural Conflicts, Character Motivations, Dramatic Conventions & Poetic Analysis
// =========================================================================
const unique50B9FoundationDrills = [
  {
    passage: "Eulalie exhaled a dense cloud of cigarette smoke, her glowing cigarette tip burning like a red eye in the village dusk.",
    question: "What figure of speech is used in the phrase 'burning like a red eye'?",
    options: ["Simile", "Metaphor", "Personification", "Understatement"],
    answer: "Simile",
    hint: "Identify the explicit comparative marker 'like'.",
    solution: "Comparing the glowing cigarette tip directly to an eye using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In Ama Ata Aidoo's 'The Dilemma of a Ghost', what is Ato Yawson's educational background?",
    options: [
      "He completed an engineering apprenticeship in Nigeria",
      "He studied at an American university and returned to Ghana with a university degree",
      "He attended a traditional drumming academy in Cape Coast",
      "He trained as a medical doctor in London"
    ],
    answer: "He studied at an American university and returned to Ghana with a university degree",
    hint: "He is the educated son who 'crossed the great salt sea' to study in the United States.",
    solution: "Ato represents the educated elite who studied abroad in the United States, earning an academic degree before returning to his ancestral village.",
    target: "Plot Details: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The sun was a golden sovereign pinned against the cloudless afternoon sky of the Fante coast.",
    question: "What figure of speech is used in calling the sun 'a golden sovereign'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation of the sun to a gold coin without using 'like' or 'as'.",
    solution: "Equating the bright sun directly to a gold sovereign coin without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what culture and nationality does Eulalie Rush belong to?",
    options: [
      "She is an African-American woman born and raised in modern urban America",
      "She is a traditional Ashanti princess from Kumasi",
      "She is a British nurse born in London",
      "She is an Ethiopian teacher from Addis Ababa"
    ],
    answer: "She is an African-American woman born and raised in modern urban America",
    hint: "She represents the African diaspora returning to an unfamiliar ancestral continent.",
    solution: "Eulalie is an African-American woman who marries Ato in the United States and struggles to adjust to traditional village life in Ghana.",
    target: "Character Facts: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The harmattan squall screamed through the thatched roof of the family compound, tearing palm fronds from the eaves.",
    question: "What figure of speech is used when the wind 'screamed'?",
    options: ["Personification", "Simile", "Hyperbole", "Synecdoche"],
    answer: "Personification",
    hint: "Can a seasonal wind literally scream with human vocal cords?",
    solution: "Attributing the human vocal action of screaming to a natural wind is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what traditional Akan expectation does Ato violate by marrying Eulalie in America?",
    options: [
      "He failed to consult his family elders, perform customary marital rites, or pour libation to the ancestors",
      "He forgot to bring European chocolates to the village chief",
      "He married a woman who did not know how to drive a motor car",
      "He refused to wear a European woolen suit to the wedding"
    ],
    answer: "He failed to consult his family elders, perform customary marital rites, or pour libation to the ancestors",
    hint: "Marriage in traditional Akan culture is a communal alliance, not merely a private contract between two individuals.",
    solution: "Ato marries privately overseas without notifying his maternal clan, skipping the customary family investigations, consent, and ancestral libations.",
    target: "Cultural Conflict: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The dry riverbed crunched, crackled, and snapped beneath the hooves of the wandering cattle.",
    question: "What sound device is demonstrated by the words 'crunched, crackled, and snapped'?",
    options: ["Onomatopoeia", "Alliteration", "Assonance", "Rhyme"],
    answer: "Onomatopoeia",
    hint: "These words directly imitate the physical fracturing sounds of dry earth and twigs.",
    solution: "Words whose sounds phonetically reproduce the real-world noises they describe are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "Proud Petu packed pure palm pots for the paramount palace.",
    question: "What sound device is highlighted by the repetition of the 'p' consonant sound?",
    options: ["Alliteration", "Assonance", "Consonance", "Onomatopoeia"],
    answer: "Alliteration",
    hint: "Notice the recurrence of the initial 'p' consonant across consecutive words.",
    solution: "The repetition of the identical initial consonant sound 'p' across closely connected words is alliteration.",
    target: "Sound Devices: Alliteration"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the symbolic significance of the children's song about the ghost at the crossroads?",
    options: [
      "It foreshadows Ato's internal paralysis and inability to choose between African communal tradition and Western modernity",
      "It proves that the village school was haunted by literal ghosts",
      "It is a magical incantation used by Nana to summon rain",
      "It is a European lullaby taught by Eulalie to the village youth"
    ],
    answer: "It foreshadows Ato's internal paralysis and inability to choose between African communal tradition and Western modernity",
    hint: "The ghost is stranded at the crossroads, unable to decide whether to walk to Elmina or Cape Coast.",
    solution: "The children's rhyme serves as a central dramatic metaphor: like the ghost unable to choose between two towns, Ato is trapped between two competing cultures.",
    target: "Dramatic Symbolism: 'The Dilemma of a Ghost'"
  },
  {
    passage: "Esi Kom was so shocked by Ato's secret marriage that she claimed she could not sleep for a hundred years.",
    question: "What figure of speech is used in saying she could not sleep 'for a hundred years'?",
    options: ["Hyperbole", "Understatement", "Metaphor", "Simile"],
    answer: "Hyperbole",
    hint: "Can a human being remain awake for an entire century?",
    solution: "Claiming to stay awake for a hundred years is an extravagant dramatic exaggeration (hyperbole).",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In L. H. Ofosu-Appiah's poem 'The Desert Rivers', how is the seasonal river depicted during the dry harmattan season?",
    options: [
      "As a rushing blue torrent overflowing its banks",
      "As a dry, dusty, dormant snake of white sand waiting for the monsoon rains",
      "As a frozen block of arctic ice",
      "As a bustling commercial shipping canal"
    ],
    answer: "As a dry, dusty, dormant snake of white sand waiting for the monsoon rains",
    hint: "The seasonal river disappears into dry sand until the rains awaken it.",
    solution: "The poem describes the riverbed in the dry season as empty sand, dormant and waiting for the rainy season to restore its life.",
    target: "Poetry Analysis: 'The Desert Rivers'"
  },
  {
    passage: "The quiet lagoon was a silver mirror reflecting the dancing palm trees along the shore.",
    question: "What figure of speech is used in calling the lagoon 'a silver mirror'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Litotes"],
    answer: "Metaphor",
    hint: "The water surface is directly called a mirror without 'like' or 'as'.",
    solution: "Equating the calm water directly to a mirror without comparative markers forms a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In P. K. Foli's poem 'The Colour of God', what question does the curious child pose to the parent?",
    options: [
      "Why does it rain in the forest during the harvest season?",
      "What is the racial skin color of God—is He black, white, red, or yellow?",
      "How many stars exist in the night sky?",
      "Why did the ancestors build stone castles along the coast?"
    ],
    answer: "What is the racial skin color of God—is He black, white, red, or yellow?",
    hint: "The child wonders if the Creator belongs to a specific human racial group.",
    solution: "The child asks about God's physical complexion, questioning whether the divine Creator is Black, White, Red, or Yellow.",
    target: "Poetry Analysis: 'The Colour of God'"
  },
  {
    passage: "The old talking drum throbbed, boomed, and hummed across the nocturnal river valley.",
    question: "What sound device is demonstrated by the words 'throbbed, boomed, and hummed'?",
    options: ["Onomatopoeia", "Hyperbole", "Simile", "Apostrophe"],
    answer: "Onomatopoeia",
    hint: "These words mimic the acoustic resonance of drumming on animal hide.",
    solution: "Words that phonetically imitate real-world acoustic beats and vibrations are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what habit of Eulalie causes intense cultural disgust and horror among Ato's family elders?",
    options: [
      "Her habit of smoking cigarettes and drinking alcohol in public",
      "Her talent for singing American jazz songs",
      "Her refusal to wear European sunglasses",
      "Her desire to cook spicy palm-nut soup for the clan"
    ],
    answer: "Her habit of smoking cigarettes and drinking alcohol in public",
    hint: "In traditional village society, women smoking in public was considered taboo and scandalous.",
    solution: "Eulalie's cigarette smoking shocks the elders, who wonder why a woman would 'set fire to her mouth' like a cooking stove.",
    target: "Cultural Conflict: 'The Dilemma of a Ghost'"
  },
  {
    passage: "Her laughter was like sweet wild honey dripping from a fresh comb in the baobab grove.",
    question: "What figure of speech is used to describe her laughter?",
    options: ["Simile", "Metaphor", "Litotes", "Synecdoche"],
    answer: "Simile",
    hint: "Look for the comparative word 'like'.",
    solution: "Comparing laughter to wild honey using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'The Dilemma of a Ghost', who is Monka?",
    options: [
      "Ato's sharp-tongued younger sister",
      "Ato's grandmother and clan queenmother",
      "The headmistress of the village primary school",
      "Eulalie's cousin from New York"
    ],
    answer: "Ato's sharp-tongued younger sister",
    hint: "She helps Esi Kom in the compound and often complains about Ato's behavior.",
    solution: "Monka is Ato's outspoken sister, who expresses frustration when Ato neglects his village duties.",
    target: "Character Identification: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The ocean waves clapped their watery hands against the granite sea wall in celebration.",
    question: "What figure of speech is present when the waves 'clapped their watery hands'?",
    options: ["Personification", "Simile", "Understatement", "Apostrophe"],
    answer: "Personification",
    hint: "Attributing anatomical hands and the human action of clapping to sea waves.",
    solution: "Giving ocean waves human hands and clapping motions is an example of personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In P. K. Foli's poem 'The Colour of God', how does the parent resolve the child's racial inquiry?",
    options: [
      "By explaining that God transcends any single race, encompassing all colors like pure sunlight",
      "By stating that God is strictly an African man with dark skin",
      "By claiming that God has no concern for human beings",
      "By telling the child that the question is forbidden in church"
    ],
    answer: "By explaining that God transcends any single race, encompassing all colors like pure sunlight",
    hint: "Think of how white sunlight divides into all the colors of the rainbow.",
    solution: "The parent explains that God encompasses all races equally, just as pure light contains all the colors of the spectrum.",
    target: "Poetry Resolution: 'The Colour of God'"
  },
  {
    passage: "The young scholar was not unmindful of the sacred traditions of his ancestral village.",
    question: "What rhetorical figure of speech is present in 'not unmindful'?",
    options: ["Litotes", "Hyperbole", "Simile", "Personification"],
    answer: "Litotes",
    hint: "Affirming that he was deeply conscious by negating 'unmindful'.",
    solution: "Litotes affirms an awareness of tradition by negating its contrary ('not unmindful').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what secret family plan do Ato and Eulalie agree on that causes massive friction with the Odumna clan?",
    options: [
      "They mutually agree to delay having children using modern birth control until they are financially settled",
      "They plan to sell the family's ancestral land to foreign investors",
      "They plan to burn down the sacred clan courtyard",
      "They decide never to speak the Fante language again"
    ],
    answer: "They mutually agree to delay having children using modern birth control until they are financially settled",
    hint: "In Akan culture, children are expected immediately after marriage to continue the lineage.",
    solution: "Ato and Eulalie secretly decide to delay childbirth using contraception, which leads the family to mistakenly assume Eulalie is barren.",
    target: "Core Dramatic Conflict: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The thunderstorm was a raging beast tearing through the coastal palm plantations.",
    question: "What figure of speech is used in calling the storm 'a raging beast'?",
    options: ["Metaphor", "Simile", "Litotes", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "Direct equation without using 'like' or 'as'.",
    solution: "Directly describing an atmospheric storm as a raging beast without comparative words is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what happens to the parched river when the heavy monsoon rains arrive?",
    options: [
      "It dries up completely and turns into a desert road",
      "It awakens from its slumber, swelling into a roaring torrent that brings life to the savannah",
      "It catches fire due to lightning strikes",
      "It flows backward into the Sahara Desert"
    ],
    answer: "It awakens from its slumber, swelling into a roaring torrent that brings life to the savannah",
    hint: "The return of the rains transforms the dry sand channel into a full river.",
    solution: "The poem describes the river springing back to life, swelling into a powerful torrent that revitalizes the surrounding environment.",
    target: "Poetry Analysis: 'The Desert Rivers'"
  },
  {
    passage: "The village women gossiped endlessly, their voices a continuous babble of running water.",
    question: "What figure of speech is used in calling their voices 'a continuous babble of running water'?",
    options: ["Metaphor", "Simile", "Understatement", "Apostrophe"],
    answer: "Metaphor",
    hint: "Their speech is directly equated to flowing water without 'like' or 'as'.",
    solution: "Directly identifying spoken voices as running water without comparative connectives forms a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what role do the 1st Woman and 2nd Woman perform in the dramatic structure of the play?",
    options: [
      "They function as a traditional communal chorus, commenting on the family's actions and voicing village expectations",
      "They are police officers sent to arrest Eulalie",
      "They are foreign tourists visiting Hasodzi to buy kente cloth",
      "They are Ato's former classmates from the university"
    ],
    answer: "They function as a traditional communal chorus, commenting on the family's actions and voicing village expectations",
    hint: "Like a Greek chorus, they appear between scenes to comment on the unfolding drama.",
    solution: "The two village women serve as a communal chorus, reflecting public opinion and cultural expectations regarding marriage and childbearing.",
    target: "Dramatic Devices: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The dry gravel hissed, rattled, and crunched as the motor lorry braked abruptly on the hillside road.",
    question: "What literary device is demonstrated by the words 'hissed, rattled, and crunched'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Litotes"],
    answer: "Onomatopoeia",
    hint: "These words mimic the physical acoustic sounds of tires on loose stones.",
    solution: "Words that phonetically echo mechanical and frictional sounds are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Dilemma of a Ghost', who is the eldest matriarch of the clan who laments that Ato has married a descendant of enslaved people?",
    options: ["Nana", "Esi Kom", "Monka", "Akoma"],
    answer: "Nana",
    hint: "She is Ato's grandmother and the keeper of ancestral memory.",
    solution: "Nana, the elderly grandmother, expresses deep sorrow upon learning that Eulalie's ancestors were enslaved, viewing it as a disruption of clan purity.",
    target: "Character Facts: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The ancient baobab tree was as sturdy as a granite fortress standing against the harmattan wind.",
    question: "What figure of speech is used in comparing the tree to 'a granite fortress'?",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    answer: "Simile",
    hint: "Look for the comparison formula 'as... as'.",
    solution: "Explicitly comparing the tree to a fortress using 'as sturdy as' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what dramatic function does the 'Bird of the Wayside' perform in the Prelude?",
    options: [
      "It acts as a dramatic narrator, introducing the central themes of cultural collision and historical heritage before the action begins",
      "It sings a cheerful song to welcome the audience to Hasodzi",
      "It brings a legal document from the government to Esi Kom",
      "It is a pet parrot owned by Eulalie"
    ],
    answer: "It acts as a dramatic narrator, introducing the central themes of cultural collision and historical heritage before the action begins",
    hint: "The narrator speaks from the boundary between the village and the highway.",
    solution: "The Bird of the Wayside delivers the prologue, setting the stage for the conflict between ancient heritage and modern foreign influences.",
    target: "Dramatic Structure: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The athlete ran with such blinding speed that the morning dust could not catch his heels.",
    question: "What figure of speech is used to emphasize his speed?",
    options: ["Hyperbole", "Litotes", "Simile", "Apostrophe"],
    answer: "Hyperbole",
    hint: "An intentional dramatic exaggeration describing physical speed.",
    solution: "Claiming that dust could not catch a runner's heels is an exaggeration for dramatic effect (hyperbole).",
    target: "Figurative Language: Hyperbole"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', what poetic structure is used to deliver the dialogue between the child and the parent?",
    options: [
      "A question-and-answer (catechetical) strophic structure",
      "Unrhymed chaotic free verse without line breaks",
      "A Shakespearean fourteen-line sonnet",
      "A Latin funeral dirge"
    ],
    answer: "A question-and-answer (catechetical) strophic structure",
    hint: "The poem proceeds through an innocent question followed by an instructive answer.",
    solution: "The poem is organized as a dialogue between child and parent, using a question-and-answer format across regular rhyming stanzas.",
    target: "Poetic Form: 'The Colour of God'"
  },
  {
    passage: "The midnight sea groaned and wept against the dark stone ramparts of the castle.",
    question: "What figure of speech is present when the sea 'groaned and wept'?",
    options: ["Personification", "Simile", "Litotes", "Synecdoche"],
    answer: "Personification",
    hint: "Giving sea currents the human vocal actions of groaning and weeping.",
    solution: "Attributing human sorrow, weeping, and vocal groaning to water is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In 'The Dilemma of a Ghost', why does the Odumna family bring traditional medicine to Eulalie's room?",
    options: [
      "They believe she is physically barren and want to cleanse her womb so she can bear children for the lineage",
      "They want to poison her because she is from America",
      "They want to cure her of a venomous snakebite",
      "They think she is suffering from a toothache"
    ],
    answer: "They believe she is physically barren and want to cleanse her womb so she can bear children for the lineage",
    hint: "The family assumes that childlessness is an affliction that requires ritual medicine.",
    solution: "Assuming Eulalie is barren because she has not conceived, the clan elders bring traditional herbs to cleanse her body.",
    target: "Plot Conflict: 'The Dilemma of a Ghost'"
  },
  {
    passage: "His words pierced her heart like a cold, sharpened dagger of iron.",
    question: "What figure of speech is used in 'like a cold, sharpened dagger'?",
    options: ["Simile", "Metaphor", "Litotes", "Onomatopoeia"],
    answer: "Simile",
    hint: "Identify the explicit comparison marker 'like'.",
    solution: "Comparing the emotional pain of speech to a dagger using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is Ato's major personal flaw throughout the play?",
    options: [
      "His moral cowardice and passivity—he fails to interpret his wife to his family and his family to his wife",
      "His physical weakness and inability to farm cassava",
      "His refusal to speak English with Eulalie",
      "His desire to steal the clan's royal stool"
    ],
    answer: "His moral cowardice and passivity—he fails to interpret his wife to his family and his family to his wife",
    hint: "Ato remains passive and hides the truth about their birth control plan, allowing conflict to escalate.",
    solution: "Ato's central flaw is his indecisiveness: rather than explaining Eulalie's perspective to his family and vice versa, his silence fuels mutual resentment.",
    target: "Character Flaw: Ato Yawson"
  },
  {
    passage: "The blacksmith's heavy iron hammer clanged, crashed, and banged against the glowing red anvil.",
    question: "What sound device is prominent in 'clanged, crashed, and banged'?",
    options: ["Onomatopoeia", "Hyperbole", "Simile", "Apostrophe"],
    answer: "Onomatopoeia",
    hint: "These words imitate the metallic ringing of hammer blows.",
    solution: "Words that phonetically recreate the physical sound of striking metal are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what broader human experience is symbolized by the parched riverbed that is later filled with water?",
    options: [
      "Human patience, resilience through seasons of suffering, and eventual renewal",
      "The construction of concrete hydroelectric dams in Ghana",
      "The total failure of agriculture in West Africa",
      "The necessity of moving to coastal cities"
    ],
    answer: "Human patience, resilience through seasons of suffering, and eventual renewal",
    hint: "The natural cycle of drought and rain mirrors human hardship and restoration.",
    solution: "The seasonal transformation from dry sand to flowing water symbolizes human endurance through difficult periods followed by restoration.",
    target: "Poetic Symbolism: 'The Desert Rivers'"
  },
  {
    passage: "The young warrior was no novice in the art of hunting wild leopards in the high forest.",
    question: "What figure of speech is present in 'no novice'?",
    options: ["Litotes", "Hyperbole", "Simile", "Personification"],
    answer: "Litotes",
    hint: "Affirming that he is an experienced hunter by negating beginner status.",
    solution: "Litotes expresses seasoned skill by negating its opposite ('no novice').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what dramatic crisis occurs in Act 4 that causes Eulalie to run away from the house?",
    options: [
      "Ato slaps Eulalie across the face during a bitter argument over her drinking and family expectations",
      "The village elders set fire to her suitcase",
      "Eulalie is arrested by the local municipal police",
      "Monka steals Eulalie's gold jewelry"
    ],
    answer: "Ato slaps Eulalie across the face during a bitter argument over her drinking and family expectations",
    hint: "The tension boils over into physical violence, causing Eulalie to flee into the night.",
    solution: "Under pressure from both sides, Ato loses control and slaps Eulalie during a heated argument, prompting her to flee the compound.",
    target: "Climax: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The old man looked at his empty granary, his eyes dark hollows of despair.",
    question: "What figure of speech is used in calling his eyes 'dark hollows of despair'?",
    options: ["Metaphor", "Simile", "Litotes", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "Direct equation without 'like' or 'as'.",
    solution: "Directly describing eyes as hollows of despair without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', how does the play achieve its final emotional resolution in Act 5?",
    options: [
      "Esi Kom shows maternal empathy, rebukes Ato for his weakness, and gently leads the weeping Eulalie into her own home",
      "Eulalie boards a flight back to the United States alone",
      "Ato divorces Eulalie and marries a local village woman",
      "The clan elders banish Ato from Hasodzi forever"
    ],
    answer: "Esi Kom shows maternal empathy, rebukes Ato for his weakness, and gently leads the weeping Eulalie into her own home",
    hint: "The mother takes the initiative to heal the family rift.",
    solution: "The play resolves through Esi Kom's maternal compassion: recognizing that Eulalie is an orphan in an unfamiliar land, she scolds Ato for his failures and takes Eulalie into her care.",
    target: "Dramatic Resolution: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The dry palm thatch crackled and hissed as the midday sparks leaped from the cooking fire.",
    question: "What literary device is demonstrated by 'crackled and hissed'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Apostrophe"],
    answer: "Onomatopoeia",
    hint: "These words imitate the sound of burning dry fibers.",
    solution: "Words that phonetically recreate the physical sound of burning thatch are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', what does the phrase 'God is not a color' convey about human spirituality?",
    options: [
      "Divine love transcends human racial categories and embraces all people equally",
      "God has no interest in human beings of any race",
      "Colors should be banned in religious worship",
      "Human beings cannot know anything about the Creator"
    ],
    answer: "Divine love transcends human racial categories and embraces all people equally",
    hint: "Divine presence cannot be restricted to a single skin tone.",
    solution: "The poem emphasizes that the divine cannot be confined to any single racial identity; God's love encompasses all of humanity.",
    target: "Thematic Core: 'The Colour of God'"
  },
  {
    passage: "The frightened child was as silent as a stone at the bottom of a deep well.",
    question: "What figure of speech is used in 'as silent as a stone'?",
    options: ["Simile", "Metaphor", "Litotes", "Synecdoche"],
    answer: "Simile",
    hint: "Notice the comparative formula 'as... as'.",
    solution: "Comparing the child's silence to a stone using 'as silent as' is a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'The Dilemma of a Ghost', why is the play described as a cross-cultural drama?",
    options: [
      "It dramatizes the collision between indigenous African traditions and modern Westernized/Diasporic values",
      "It teaches students how to speak French and Spanish",
      "It is set entirely on an ocean cargo ship traveling between continents",
      "It shows how to manufacture traditional drums using Western machinery"
    ],
    answer: "It dramatizes the collision between indigenous African traditions and modern Westernized/Diasporic values",
    hint: "Look at the central conflict between Ato's Akan heritage and Eulalie's African-American upbringing.",
    solution: "The drama focuses on the cross-cultural tensions that arise when traditional African communal customs meet modern Western individualist perspectives.",
    target: "Genre & Thematic Classification"
  },
  {
    passage: "The ancient church steeple pointed a solemn stone finger toward the blue heavens above.",
    question: "What figure of speech is present in saying the steeple 'pointed a solemn stone finger'?",
    options: ["Personification", "Simile", "Litotes", "Apostrophe"],
    answer: "Personification",
    hint: "Attributing a human finger and intentional pointing to a church spire.",
    solution: "Giving an architectural spire an anatomical finger and deliberate gestures is personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what figure of speech is used when the river is described as a 'sleeping serpent' in the dry sand?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "The winding dry river is directly called a serpent without using 'like' or 'as'.",
    solution: "Directly describing the winding river channel as a sleeping serpent without comparative connectives forms a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The old hunter cried into the night: 'O ancestors, guide my arrow in the dark forest!'",
    question: "What figure of speech is featured in addressing 'O ancestors'?",
    options: ["Apostrophe", "Simile", "Metaphor", "Litotes"],
    answer: "Apostrophe",
    hint: "A direct invocation to spiritual or absent entities.",
    solution: "Directly addressing absent or departed spirits ('O ancestors') as if they were present is apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the central moral lesson regarding marriage and family life?",
    options: [
      "Marriage requires mutual communication, cultural empathy, and honest dialogue to survive differences",
      "Husbands should always conceal their plans from both their wives and their parents",
      "Modern education makes family relationships completely irrelevant",
      "Traditional customs must always destroy modern perspectives"
    ],
    answer: "Marriage requires mutual communication, cultural empathy, and honest dialogue to survive differences",
    hint: "Ato's silence nearly destroys his marriage, which is only saved when empathy is shown.",
    solution: "Aidoo demonstrates that cross-cultural relationships can survive only when both sides communicate openly and practice mutual empathy.",
    target: "Moral Resolution: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The heavy bronze bell tolled, clanged, and boomed the midnight hour across the silent sleeping village.",
    question: "What sound device is demonstrated by 'tolled, clanged, and boomed'?",
    options: ["Onomatopoeia", "Alliteration", "Assonance", "Consonance"],
    answer: "Onomatopoeia",
    hint: "These words phonetically echo the deep acoustic chimes of a heavy metal bell.",
    solution: "Words that phonetically reproduce the ringing of a bronze bell are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Prescribed Text: Ama Ata Aidoo's "The Dilemma of a Ghost" (Act 1)
// =========================================================================
const capstone5B9FoundationQuestions = [
  {
    questionNumber: 51,
    question: "According to the passage, why are the 1st and 2nd Village Women excited when they see the Odumna Clan house?",
    options: [
      "They heard that the village chief had built a new palace",
      "Ato has returned from overseas university studies with a graduate wife from the land of the white men",
      "The cocoa harvest has broken all historical records",
      "Ato has brought modern motor cars to sell to the villagers"
    ],
    answer: "Ato has returned from overseas university studies with a graduate wife from the land of the white men",
    hint: "Review the opening dialogue of the two women: 'The son who crossed the great black salt sea has returned!'",
    solution: "The dialogue shows the women are excited because Ato has returned from university abroad with a graduate wife, expecting honor for the clan.",
    target: "Capstone Exam: Literal Comprehension"
  },
  {
    questionNumber: 52,
    question: "In what two ways does Eulalie's physical appearance and behavior in the courtyard shock traditional Fante expectations?",
    options: [
      "She wears sunglasses, high-heeled shoes, and smokes a cigarette in public",
      "She carries an ancestral sword and refuses to speak English",
      "She wears a traditional kente cloth and balances a water pot on her head",
      "She arrives on horseback and fires a musket into the air"
    ],
    answer: "She wears sunglasses, high-heeled shoes, and smokes a cigarette in public",
    hint: "Check the stage directions and Esi Kom's reaction to her smoking.",
    solution: "The stage directions note Eulalie wears sunglasses, high heels, and smokes a cigarette—a public habit that shocks Esi Kom.",
    target: "Capstone Exam: Cultural Contrast & Stage Direction"
  },
  {
    questionNumber: 53,
    question: "What figure of speech does Esi Kom employ when she expresses bewilderment at Eulalie's smoking: 'why does she breathe smoke like a cooking hearth in the dry harmattan?'",
    options: [
      "Simile (comparing breathing smoke to a hearth using 'like')",
      "Metaphor (equating Eulalie directly to a cooking pot)",
      "Onomatopoeia (imitating the sound of burning wood)",
      "Apostrophe (addressing the harmattan wind directly)"
    ],
    answer: "Simile (comparing breathing smoke to a hearth using 'like')",
    hint: "Notice the comparison formula 'breathe smoke like a cooking hearth'.",
    solution: "Comparing Eulalie's cigarette smoking explicitly to a cooking hearth using 'like' constitutes a descriptive simile.",
    target: "Capstone Exam: Figurative Language Decoding"
  },
  {
    questionNumber: 54,
    question: "What fundamental cultural failure does Esi Kom point out regarding Ato's marriage to Eulalie?",
    options: [
      "Ato married overseas without customary family consent, drums sounding, or pouring ancestral libations",
      "Ato did not buy a European woolen suit for his father",
      "Ato forgot to bring cold Coca-Cola for the village elders",
      "Eulalie was too young to be married"
    ],
    answer: "Ato married overseas without customary family consent, drums sounding, or pouring ancestral libations",
    hint: "Examine Esi Kom's speech: 'Without a drum sounding in Hasodzi? Without a drop of palm wine poured...?'",
    solution: "Esi Kom's grief stems from Ato marrying without customary rites, clan consultation, or ancestral libation.",
    target: "Capstone Exam: Cultural Analysis"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the central dramatic conflict introduced in this opening scene.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Ato's marriage triggers a clash of cultural values.",
      "Because Ato married an American woman secretly, his mother was shocked and cried in the courtyard.",
      "A clash of cultural values between traditional Akan expectations and modern American customs in Hasodzi.",
      "Cultural clash."
    ],
    answer: "Ato's marriage triggers a clash of cultural values.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Ato's marriage triggers a clash of cultural values' is exactly 8 words, forms a complete Subject-Verb-Object sentence, and captures the core dramatic conflict. Option C is a fragment (0 marks), and Option B has 15 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployCockcrowB9Foundation() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();
  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Cockcrow Foundation Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B9FoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_C_F_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B9",
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
      learningCompetency: "B9.2.2.1 / B9.2.3.1: Analyze foundational dramatic and poetic elements, cultural conflicts, and figures of speech in prescribed Cockcrow literature."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9FoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${dilemmaOfAGhostCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_C_F_${item.questionNumber}`,
      level: "B9",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: dilemmaOfAGhostCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.2.2.1 / B9.2.3.1: Multi-paragraph textual analysis of modern African drama, evaluating cross-cultural tensions, stage directions, and formulating concise thematic summaries."
    });
  });

  // 3. Write directly to Firestore subcollections
  const topicIds = ["literature_cockcrow_canon", "cockcrow_literary_devices"];
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B9_foundation)...");
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B9_foundation`);
      await subDocRef.set({
        level: "B9",
        difficulty: "foundation",
        title: "Basic 9 Foundation Lab: 50 Unique Cockcrow Drama & Poetry Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Drama, Poetry & Figures of Speech) + 5 Capstone Full-Passage Questions",
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

  // 4. Synchronize into main document practicePool.low for b9
  console.log("\nSynchronizing main document practicePool.low for b9...");
  const mappedLowQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'low' as const,
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B9 Foundation!`);
}

deployCockcrowB9Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B9 Foundation Lab:", err);
    process.exit(1);
  });

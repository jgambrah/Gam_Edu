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
// Prescribed Text: Ama Ata Aidoo's "The Dilemma of a Ghost" (Act 4 Climax)
// =========================================================================
const dilemmaOfAGhostAct4CapstonePassage = 
`[The courtyard of the Odumna house on a sweltering Sunday morning. EULALIE sits on a low kitchen stool, holding a glass of gin in one trembling hand and a lit cigarette in the other. Her hair is disheveled and her eyes are bloodshot with sleeplessness. ATO enters from the inner chamber, dressed in his trousers and an unbuttoned white shirt, looking visibly agitated.]

ATO:
[Stopping abruptly, his eyes fixed on the glass in her hand]
Eulalie! Drinking again? On a Sunday morning, before the church bells have even finished ringing? Have you completely lost your senses?

EULALIE:
[Laughing bitterly, taking a deliberate sip from the glass]
And what if I am drinking, native boy? What else is there to do in this godforsaken village where everybody watches me like I was an animal in a zoo? Your people look at my clothes, look at my cigarettes, look at my stomach—always waiting, whispering, gossiping! 'Where are the babies? Why hasn't the black-white stranger dropped a child for the clan?'

ATO:
[Clenching his fists, his voice dropping to a tense, furious whisper]
Keep your voice down! Do you want my mother and Monka to hear you shouting like a market brawler? You know how sensitive my family is!

EULALIE:
[Rising abruptly from the stool, swaying slightly, confronting him]
Sensitive? Your family? They are narrow-minded, superstitious primitives! Yes, I said it! They think children drop out of heaven like ripe mangoes! They don't know anything about planned parenthood! And whose fault is that, Ato? Who refused to tell them that we decided—together, in New York—not to have children until we had settled down and saved money? You were too cowardly to tell your mother! You let them bring evil-smelling herbs to wash my body because you let them believe I am a barren mule!

ATO:
[Trembling with rage, his voice choking]
Shut up, Eulalie! Don't you dare call my people primitives!

EULALIE:
[Sneering, stepping closer, blowing smoke directly into his face]
Primitives, Ato! Primitives! And you are the biggest primitive of all—a cowardly ghost who cannot tell his mother the truth, a little boy masquerading as a modern intellectual!

[ATO, overwhelmed by humiliated fury, raises his open palm and slaps Eulalie violently across the face. The glass falls from her hand and shatters on the beaten earth floor. EULALIE freezes, her hand clutching her burning cheek, staring at him in utter disbelief. A dead, suffocating silence falls over the courtyard. Then, without a word, she turns and runs blindly out through the wooden gate into the dusty road, sobbing violently. ATO stands alone, staring down at his trembling hand in horror as the village church bells toll in the distance.]`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Advanced Themes, Dramatic Irony, Stagecraft, Poetic Imagery & Devices
// =========================================================================
const unique50B9IntermediateDrills = [
  {
    passage: "In 'The Dilemma of a Ghost', Eulalie refers to Ato as 'a cowardly ghost masquerading as a modern intellectual.'",
    question: "What figure of speech is used in calling Ato 'a cowardly ghost', and what does it signify?",
    options: [
      "Metaphor; signifying his spiritual and cultural paralysis between African tradition and Western modernity",
      "Simile; meaning Ato is wearing a white hospital gown",
      "Personification; meaning ghosts have the ability to attend American universities",
      "Onomatopoeia; imitating the sound of village wind"
    ],
    answer: "Metaphor; signifying his spiritual and cultural paralysis between African tradition and Western modernity",
    hint: "Direct equation of Ato to a ghost without comparative words like 'like' or 'as'.",
    solution: "Calling Ato a ghost directly is a metaphor, linking him to the children's rhyme of the bewildered ghost stranded at the crossroads.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', Ato's family believes Eulalie is barren because she has not conceived, while the audience knows the couple is secretly using modern contraception.",
    question: "What specific literary technique creates this central dramatic tension?",
    options: [
      "Dramatic Irony",
      "Poetic Justice",
      "Hyperbole",
      "Understatement"
    ],
    answer: "Dramatic Irony",
    hint: "The audience possesses vital knowledge that the Odumna family elders do not know.",
    solution: "Dramatic irony exists because the audience knows about the planned birth control, while the family mistakenly attributes childlessness to barrenness.",
    target: "Dramatic Devices: Dramatic Irony"
  },
  {
    passage: "The sun was an unpitying sovereign, searing the cracked clay of Hasodzi village with relentless golden spears.",
    question: "What figure of speech is used in describing the sun's rays as 'relentless golden spears'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Litotes"],
    answer: "Metaphor",
    hint: "The rays are directly identified as spears without using 'like' or 'as'.",
    solution: "Directly describing beams of sunlight as weapons (spears) without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In L. H. Ofosu-Appiah's poem 'The Desert Rivers', the riverbed lies parched and dormant in the harmattan, only to awaken into a roaring torrent when the rains arrive.",
    question: "What thematic parallel does the seasonal transformation of the river represent?",
    options: [
      "The cyclical nature of human suffering followed by renewal and hope",
      "The superiority of desert sand over agricultural crops",
      "The total destruction of West African fishing communities",
      "The commercial trade value of bottled spring water"
    ],
    answer: "The cyclical nature of human suffering followed by renewal and hope",
    hint: "Nature's movement from extreme drought to vibrant flow mirrors human perseverance.",
    solution: "The poem uses the river's revival to symbolize human resilience: periods of arid deprivation are inevitably followed by renewal and vitality.",
    target: "Poetic Symbolism: 'The Desert Rivers'"
  },
  {
    passage: "The ancient church tower stood like a silent stone sentinel, watching over the generations of villagers sleeping in the cemetery.",
    question: "What figure of speech is used in comparing the tower to a 'silent stone sentinel'?",
    options: ["Simile", "Metaphor", "Synecdoche", "Litotes"],
    answer: "Simile",
    hint: "Look for the explicit comparative preposition 'like'.",
    solution: "Comparing the stone tower to a guard (sentinel) using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'The Dilemma of a Ghost', why does Ato refuse to openly tell his mother about his and Eulalie's decision to delay having children?",
    options: [
      "He fears being condemned by his traditional family for using foreign birth control to disrupt the ancestral lineage",
      "He forgot the English word for planned parenthood",
      "Eulalie ordered him never to speak to his mother again",
      "He wanted his mother to spend all her money on herbal medicines"
    ],
    answer: "He fears being condemned by his traditional family for using foreign birth control to disrupt the ancestral lineage",
    hint: "Ato is intimidated by traditional expectations surrounding childbearing.",
    solution: "Ato's moral weakness and fear of communal disapproval prevent him from explaining their choice, letting his family assume Eulalie is barren.",
    target: "Character Motivation: Ato Yawson"
  },
  {
    passage: "Esi Kom's heart was a crushed calabash when she realized her educated son had married without the clan's blessing.",
    question: "What figure of speech is used in calling her heart 'a crushed calabash'?",
    options: ["Metaphor", "Simile", "Personification", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "A direct identification equating emotional heartbreak to a broken vessel without 'like'.",
    solution: "Directly describing deep emotional heartbreak as a shattered calabash without comparative connectives forms a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In P. K. Foli's poem 'The Colour of God', what profound universal message does the parent communicate to the questioning child?",
    options: [
      "God's divine essence transcends human racial divisions, uniting all humanity under universal equality",
      "God belongs exclusively to one chosen geographical continent",
      "Skin color determines an individual's moral goodness",
      "Children should never ask philosophical questions about faith"
    ],
    answer: "God's divine essence transcends human racial divisions, uniting all humanity under universal equality",
    hint: "Consider the mother's explanation comparing God's presence to pure sunlight.",
    solution: "The poem argues for universal human equality: divine love cannot be restricted to any single racial identity, reflecting all human colors like light.",
    target: "Philosophical Synthesis: 'The Colour of God'"
  },
  {
    passage: "The dry palm fronds clattered, rustled, and hissed as the midnight storm wind swept over the compound.",
    question: "What sound device is demonstrated by the words 'clattered, rustled, and hissed'?",
    options: ["Onomatopoeia", "Simile", "Hyperbole", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words directly imitate the physical acoustic noises made by dry leaves in wind.",
    solution: "Words whose sounds phonetically mimic the real-world noises they describe are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the cultural significance of the ritual libation poured by Petu, the clan elder?",
    options: [
      "It is an indigenous prayer to the ancestors, seeking spiritual blessings, protection, and progeny for the clan",
      "It is a social drinking game played by village men on festival days",
      "It is a foreign European ceremony introduced by Christian missionaries",
      "It is an agricultural method used to test the fertility of farm soil"
    ],
    answer: "It is an indigenous prayer to the ancestors, seeking spiritual blessings, protection, and progeny for the clan",
    hint: "Libation bridges the living community with the spirit world of the ancestors.",
    solution: "Pouring palm wine or spirits to the earth is a sacred Akan rite invoking ancestral blessing, fertility, and guidance for the lineage.",
    target: "Cultural Context: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The young scholar was no stranger to cultural alienation, having lived for years between two opposing worlds.",
    question: "What figure of speech is present in 'no stranger to cultural alienation'?",
    options: ["Litotes", "Hyperbole", "Apostrophe", "Simile"],
    answer: "Litotes",
    hint: "Affirming deep familiarity by negating its contrary ('no stranger').",
    solution: "Litotes is an understatement that affirms an individual's deep experience with hardship by negating its opposite.",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', how does Eulalie's African-American background influence her expectations of Ghana?",
    options: [
      "She romanticized Africa as an idyllic ancestral homeland, but is shocked by the rural realities, dust, and communal scrutiny",
      "She expected Ghana to be an industrial European country with cold snow",
      "She came specifically to purchase gold mines in the western region",
      "She was sent by the American government as an agricultural diplomat"
    ],
    answer: "She romanticized Africa as an idyllic ancestral homeland, but is shocked by the rural realities, dust, and communal scrutiny",
    hint: "She yearned for roots, but struggles with the practical culture shock of village life.",
    solution: "Eulalie experiences the diaspora dilemma: having idealized her ancestral continent, she is unprepared for the cultural demands and lack of Western comforts in a rural village.",
    target: "Character Dissection: Eulalie"
  },
  {
    passage: "The night wrapped the silent village in a suffocating velvet blanket of tropical heat.",
    question: "What figure of speech is used in saying the night wrapped the village in 'a suffocating velvet blanket'?",
    options: ["Metaphor / Personification", "Simile", "Litotes", "Synecdoche"],
    answer: "Metaphor / Personification",
    hint: "Night is given human actions, and heat is directly called a blanket without 'like'.",
    solution: "Giving the night the human action of wrapping a village in a fabric blanket blends personification with metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the dramatic function of the 1st and 2nd Village Women throughout the play?",
    options: [
      "They act as a communal chorus, reflecting the conservative standards, gossip, and collective expectations of Hasodzi society",
      "They are rival wives competing for Ato's romantic affection",
      "They provide comic relief by performing Western acrobatics",
      "They serve as legal magistrates who judge marital disputes in court"
    ],
    answer: "They act as a communal chorus, reflecting the conservative standards, gossip, and collective expectations of Hasodzi society",
    hint: "Like a classical chorus, their commentary frames the communal pressure exerted on the family.",
    solution: "The two village women serve as an indigenous chorus, vocalizing community gossip, traditional values, and societal scrutiny regarding marriage and children.",
    target: "Dramatic Conventions: The Chorus"
  },
  {
    passage: "The grief-stricken mother cried into the wind: 'O departed ancestors, why have you allowed our royal house to crumble?'",
    question: "What figure of speech is demonstrated by directly addressing 'O departed ancestors'?",
    options: ["Apostrophe", "Simile", "Litotes", "Metaphor"],
    answer: "Apostrophe",
    hint: "Directly calling out to spiritual or absent beings who cannot physically answer.",
    solution: "Addressing deceased ancestral spirits ('O departed ancestors') with emotional invocation is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what symbolic meaning does the family compound's 'old courtyard' carry?",
    options: [
      "It represents ancestral tradition, communal solidarity, and the continuity of the matrilineal clan",
      "It is an abandoned building waiting to be demolished for a modern railway",
      "It represents the superiority of Western European domestic architecture",
      "It was a commercial marketplace for selling imported textiles"
    ],
    answer: "It represents ancestral tradition, communal solidarity, and the continuity of the matrilineal clan",
    hint: "The courtyard is where the family gathers, cooks, pours libations, and confronts one another.",
    solution: "The ancestral courtyard symbolizes the traditional Akan domestic space—a realm governed by communal solidarity, shared duties, and ancestral presence.",
    target: "Setting & Symbolism: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The motor car engine sputtered, coughed, and died with a sickening metallic clunk in the muddy ditch.",
    question: "What two literary devices are present in 'sputtered, coughed, and died with a... clunk'?",
    options: [
      "Onomatopoeia and Personification",
      "Simile and Metaphor",
      "Hyperbole and Litotes",
      "Alliteration and Apostrophe"
    ],
    answer: "Onomatopoeia and Personification",
    hint: "'Sputtered' and 'clunk' are sound words; 'coughed and died' attribute human biology to a machine.",
    solution: "'Sputtered' and 'clunk' are onomatopoeic, while giving a vehicle the biological actions of coughing and dying is personification.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', how does the poet use contrasting imagery to structure the poem?",
    options: [
      "By contrasting the bone-dry, dusty riverbed of the harmattan with the torrential, life-giving currents of the rainy season",
      "By contrasting the Atlantic Ocean with the Pacific Ocean",
      "By contrasting modern steamships with traditional fishing canoes",
      "By contrasting city skyscrapers with mud huts"
    ],
    answer: "By contrasting the bone-dry, dusty riverbed of the harmattan with the torrential, life-giving currents of the rainy season",
    hint: "Look at the two distinct seasonal states of the river described in the stanzas.",
    solution: "The poem is organized around a dual seasonal contrast: the barren, parched harmattan channel juxtaposed against the revitalized, overflowing river of the rainy season.",
    target: "Poetic Structure: 'The Desert Rivers'"
  },
  {
    passage: "His mind was a stormy sea of conflicting loyalties, torn between filial duty to his mother and romantic devotion to his wife.",
    question: "What figure of speech is used in calling his mind 'a stormy sea'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation of an emotional state to a turbulent ocean without 'like' or 'as'.",
    solution: "Directly describing internal psychological turmoil as a stormy sea without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the significance of Eulalie throwing away the native snails brought to her by Esi Kom?",
    options: [
      "It marks a severe cultural misunderstanding: Esi Kom brought a prized culinary gift, but Eulalie found the live snails repulsive",
      "Eulalie wanted to keep the snails as pets in her bedroom",
      "The snails were venomous and nearly bit Ato's sister",
      "Esi Kom told her that the snails were poisonous"
    ],
    answer: "It marks a severe cultural misunderstanding: Esi Kom brought a prized culinary gift, but Eulalie found the live snails repulsive",
    hint: "In Akan culture, snails are a treasured delicacy; to an urban American, they appeared disgusting.",
    solution: "The snail incident highlights the cultural divide: Esi Kom offers an expensive, loving traditional gift, which Eulalie discards in horror, deeply insulting the matriarch.",
    target: "Cultural Collision: Snail Incident"
  },
  {
    passage: "The old storyteller's voice was as smooth as liquid shea butter, soothing the restless children gathered around the hearth.",
    question: "What figure of speech is used in comparing the voice to 'liquid shea butter'?",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    answer: "Simile",
    hint: "Look for the comparison marker 'as... as'.",
    solution: "Comparing the vocal quality to shea butter using 'as smooth as' forms an explicit simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what historical trauma haunts Eulalie's subconscious thoughts throughout the play?",
    options: [
      "The painful historical legacy of the transatlantic slave trade and her desire to find belonging in an ancestral home",
      "Her fear of European steamships and naval battles",
      "Her memory of working in American gold mines",
      "Her childhood fear of thunder and lightning"
    ],
    answer: "The painful historical legacy of the transatlantic slave trade and her desire to find belonging in an ancestral home",
    hint: "Eulalie often reflects on her ancestors who were taken away in slave ships from the African coast.",
    solution: "Eulalie carries the ancestral grief of the Middle Passage; she returns to Africa seeking healing and belonging, only to find herself treated as an outsider.",
    target: "Historical & Thematic Analysis"
  },
  {
    passage: "The heavy wooden drums thundered with a fury that shook the very foundations of the village earth.",
    question: "What figure of speech is used in saying the drums 'thundered with a fury'?",
    options: ["Personification / Metaphor", "Simile", "Litotes", "Synecdoche"],
    answer: "Personification / Metaphor",
    hint: "Giving an acoustic instrument emotional rage (fury) and comparing it to thunder.",
    solution: "Attributing human emotional fury to musical instruments while equating their sound to thunder blends metaphor with personification.",
    target: "Figurative Language: Personification"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', what image does the poet use to illustrate that all human skin tones are unified in God?",
    options: [
      "The image of white sunlight passing through a prism to reveal all the diverse colors of the rainbow",
      "The image of a clay pot painted with four different stripes",
      "The image of a stormy ocean carrying ships of all nations",
      "The image of a royal kente cloth woven with gold thread"
    ],
    answer: "The image of white sunlight passing through a prism to reveal all the diverse colors of the rainbow",
    hint: "Light appears clear or white, but contains every shade of the visual spectrum.",
    solution: "The poet uses light as a central metaphor: just as pure sunlight refracts into all shades of the spectrum, God's divine essence encompasses all human complexions.",
    target: "Poetic Imagery: 'The Colour of God'"
  },
  {
    passage: "The young prince was no coward on the battlefield, charging fearlessly into the thickest ranks of the enemy.",
    question: "What figure of speech is present in describing the prince as 'no coward'?",
    options: ["Litotes", "Hyperbole", "Simile", "Apostrophe"],
    answer: "Litotes",
    hint: "Affirming great bravery by negating cowardice.",
    solution: "Litotes affirms courage by negating its contrary ('no coward').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the symbolic significance of Ato's European woolen suit in the sweltering tropical heat?",
    options: [
      "It symbolizes his superficial adoption of Western culture, which is uncomfortable, stifling, and unsuited to his native environment",
      "It proves that he was the wealthiest businessman in West Africa",
      "It was a traditional ceremonial outfit worn by Akan paramount chiefs",
      "It protected him from venomous insect stings in the forest"
    ],
    answer: "It symbolizes his superficial adoption of Western culture, which is uncomfortable, stifling, and unsuited to his native environment",
    hint: "Wearing heavy wool in a humid African village highlights cultural mismatch.",
    solution: "Ato's heavy suit serves as an external symbol of his cultural displacement: Western education has dressed him in values that are stifling and ill-suited to his community.",
    target: "Costume & Symbolism: Ato Yawson"
  },
  {
    passage: "The dry leaves whispered, scraped, and crackled along the deserted stone corridor.",
    question: "What sound device is demonstrated by 'whispered, scraped, and crackled'?",
    options: ["Onomatopoeia", "Hyperbole", "Simile", "Apostrophe"],
    answer: "Onomatopoeia",
    hint: "These words directly reproduce the physical sounds of dry foliage moving on stone.",
    solution: "Words whose sounds phonetically recreate the physical noises they describe are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Dilemma of a Ghost', why does Nana refer to Eulalie as a 'human being without a clan'?",
    options: [
      "Because Eulalie's ancestors were enslaved and forcibly stripped of their African genealogical lineage and clan identity",
      "Because Eulalie refused to tell anyone her family name",
      "Because Eulalie had lost her American passport",
      "Because Hasodzi village did not recognize marriages conducted in churches"
    ],
    answer: "Because Eulalie's ancestors were enslaved and forcibly stripped of their African genealogical lineage and clan identity",
    hint: "In Akan society, identity is rooted in the maternal clan (Abusua); diaspora descendants were severed from this knowledge.",
    solution: "Nana laments that Eulalie has no recognizable clan heritage, highlighting the historical tragedy of slavery which erased diaspora genealogical roots.",
    target: "Cultural & Historical Analysis"
  },
  {
    passage: "The sudden lightning bolt was a flaming cutlass slicing through the dark belly of the storm clouds.",
    question: "What figure of speech is used in calling the lightning bolt 'a flaming cutlass'?",
    options: ["Metaphor", "Simile", "Litotes", "Synecdoche"],
    answer: "Metaphor",
    hint: "Direct equation of lightning to a weapon without 'like' or 'as'.",
    solution: "Directly describing a lightning strike as a flaming cutlass without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what literary device is used when the parched riverbed is described as a 'sleeping serpent'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "The winding dry river is directly identified as a serpent without using 'like'.",
    solution: "Equating the winding, dry sand channel directly to a sleeping serpent without comparative connectives forms a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "The distressed traveler cried out: 'O treacherous Fortune, why have you led my steps into this wilderness?'",
    question: "What figure of speech is present in addressing 'O treacherous Fortune'?",
    options: ["Apostrophe", "Simile", "Litotes", "Metonymy"],
    answer: "Apostrophe",
    hint: "Directly calling out to an abstract, personified force as if it were present.",
    solution: "Addressing an abstract concept or fate ('O treacherous Fortune') with an emotional plea is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the climactic physical act that shatters the marital peace between Ato and Eulalie in Act 4?",
    options: [
      "Ato slaps Eulalie across the face during a furious argument over her drinking and his cowardice",
      "Eulalie burns Ato's university degree in the courtyard fire",
      "Ato locks Eulalie inside the kitchen storeroom",
      "Monka throws cold water over Eulalie's bed"
    ],
    answer: "Ato slaps Eulalie across the face during a furious argument over her drinking and his cowardice",
    hint: "The argument over 'primitives' and cowardice escalates into physical domestic violence.",
    solution: "Overwhelmed by wounded pride and cultural frustration, Ato strikes Eulalie, causing her to flee and bringing their conflict to a crisis.",
    target: "Climax: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The blacksmith's forge roared with the hunger of a caged beast demanding more coal.",
    question: "What two figures of speech are combined in this description?",
    options: [
      "Personification and Simile",
      "Metaphor and Litotes",
      "Hyperbole and Synecdoche",
      "Onomatopoeia and Apostrophe"
    ],
    answer: "Personification and Simile",
    hint: "The forge 'roared with hunger' (personification) and is compared using 'like/of a caged beast' (simile).",
    solution: "Giving a fire forge an animal's appetite and roar is personification, while comparing it using 'of a caged beast' acts as a simile.",
    target: "Literary Devices: Combined Devices"
  },
  {
    passage: "In 'The Dilemma of a Ghost', why does Esi Kom ultimately rebuke Ato at the end of Act 5?",
    options: [
      "She blames Ato for failing to guide, protect, and explain his wife to the family, recognizing that Eulalie is an orphan in an unfamiliar culture",
      "She scolds him for not buying her modern European shoes",
      "She is angry that Ato did not become a doctor in America",
      "She wants him to leave Ghana and return to New York permanently"
    ],
    answer: "She blames Ato for failing to guide, protect, and explain his wife to the family, recognizing that Eulalie is an orphan in an unfamiliar culture",
    hint: "Esi Kom realizes that Ato's passivity and silence were the root cause of the family's hostility.",
    solution: "Esi Kom shows maternal wisdom by holding Ato accountable: as the educated son, it was his duty to bridge the two cultures rather than allowing his wife to be ostracized.",
    target: "Dramatic Resolution: Esi Kom"
  },
  {
    passage: "The ancient brass church bell clanged, boomed, and echoed through the foggy morning valley.",
    question: "What sound device is prominent in 'clanged, boomed, and echoed'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Hyperbole"],
    answer: "Onomatopoeia",
    hint: "These words phonetically reproduce the resonant chimes of a bronze bell.",
    solution: "Words that phonetically recreate the physical ringing sound of bells are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', what is the poetic form and rhyme scheme employed across the regular quatrains?",
    options: [
      "Structured rhyming stanzas using an accessible AABB or ABAB lyric scheme",
      "Unrhymed chaotic free verse without line divisions",
      "A classical Latin epic written in dactylic hexameter",
      "A fourteen-line Shakespearean sonnet ending with a rhyming couplet"
    ],
    answer: "Structured rhyming stanzas using an accessible AABB or ABAB lyric scheme",
    hint: "The poem uses accessible four-line stanzas with regular, musical rhyme.",
    solution: "The poem is composed in regular four-line stanzas (quatrains) with simple, melodic rhyme patterns that make its moral clear.",
    target: "Poetic Form: 'The Colour of God'"
  },
  {
    passage: "The old fisherman was no amateur when it came to navigating treacherous ocean surf.",
    question: "What figure of speech is used in describing the master mariner as 'no amateur'?",
    options: ["Litotes", "Hyperbole", "Personification", "Simile"],
    answer: "Litotes",
    hint: "Affirming seasoned mastery by negating beginner status.",
    solution: "Litotes affirms seasoned maritime skill by negating its contrary ('no amateur').",
    target: "Figurative Language: Litotes"
  },
  {
    passage: "In 'The Dilemma of a Ghost', how does the resolution show the strength of traditional African maternal compassion?",
    options: [
      "Esi Kom overcomes her initial prejudices, takes Eulalie by the hand, and leads her into her own home with maternal tenderness",
      "Esi Kom banishes both Ato and Eulalie from the village forever",
      "Esi Kom demands a huge sum of money before speaking to Eulalie",
      "Esi Kom orders Monka to burn all of Eulalie's American dresses"
    ],
    answer: "Esi Kom overcomes her initial prejudices, takes Eulalie by the hand, and leads her into her own home with maternal tenderness",
    hint: "The play ends with the mother embracing the weeping daughter-in-law.",
    solution: "The play resolves through traditional maternal empathy: Esi Kom looks past cultural misunderstandings, welcomes Eulalie into her home, and models cross-cultural healing.",
    target: "Moral & Thematic Resolution"
  },
  {
    passage: "The river rushed through the narrow gorge like a herd of stampeding white stallions.",
    question: "What figure of speech is used in comparing the river to 'stampeding white stallions'?",
    options: ["Simile", "Metaphor", "Litotes", "Apostrophe"],
    answer: "Simile",
    hint: "Look for the comparative word 'like'.",
    solution: "Explicitly comparing violent river rapids to horses using 'like' constitutes a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what figure of speech is used when the dry riverbed is described as awaiting the rains like a 'thirsty wanderer'?",
    options: ["Simile", "Metaphor", "Litotes", "Synecdoche"],
    answer: "Simile",
    hint: "Notice the comparison formula using the preposition 'like'.",
    solution: "Comparing the parched earth to a thirsty traveler using 'like' forms a simile.",
    target: "Figurative Language: Simile"
  },
  {
    passage: "The old man looked at his withered cocoa trees, his face an unreadable mask of stoic sorrow.",
    question: "What figure of speech is used in calling his face 'an unreadable mask of stoic sorrow'?",
    options: ["Metaphor", "Simile", "Apostrophe", "Onomatopoeia"],
    answer: "Metaphor",
    hint: "Direct equation without using 'like' or 'as'.",
    solution: "Directly describing a sorrowful face as an unreadable mask without comparative connectives is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is the dramatic significance of the children singing the ghost song outside the courtyard at the end of the play?",
    options: [
      "It reminds the audience that Ato remains morally and culturally paralyzed at the crossroads, even as the two women find reconciliation",
      "It shows that the village children were practicing for a school concert",
      "It indicates that Eulalie has decided to become a professional singer",
      "It proves that Hasodzi village was attacked by enemy warriors"
    ],
    answer: "It reminds the audience that Ato remains morally and culturally paralyzed at the crossroads, even as the two women find reconciliation",
    hint: "While Esi Kom leads Eulalie inside, Ato is left standing alone in the courtyard listening to the song.",
    solution: "The final reprise of the song emphasizes Ato's tragedy: while the women achieve reconciliation through empathy, Ato remains spiritually stranded at the crossroads.",
    target: "Symbolic Ending: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The dry branches tapped, scratched, and clattered against the window panes as the midnight storm raged.",
    question: "What sound device is demonstrated by 'tapped, scratched, and clattered'?",
    options: ["Onomatopoeia", "Simile", "Hyperbole", "Metonymy"],
    answer: "Onomatopoeia",
    hint: "These words phonetically echo the physical sounds of wood striking glass.",
    solution: "Words that phonetically imitate the acoustic sounds of mechanical contact are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In P. K. Foli's 'The Colour of God', why is the poem described as an anti-racist philosophical dialogue?",
    options: [
      "It uses simple family dialogue to dismantle racial superiority and assert that all human skin tones reflect divine beauty equally",
      "It encourages people to move to countries with warmer climates",
      "It argues that only artists who paint portraits understand the divine",
      "It proposes the creation of a new international currency"
    ],
    answer: "It uses simple family dialogue to dismantle racial superiority and assert that all human skin tones reflect divine beauty equally",
    hint: "The poem uses accessible family conversation to reject racial hierarchies.",
    solution: "The poem rejects racial supremacy, framing God's love as inclusive and affirming that every human color is an equal reflection of divine beauty.",
    target: "Philosophical Synthesis: 'The Colour of God'"
  },
  {
    passage: "The dying chief whispered into the night: 'O Mother Earth, receive my tired bones into thy sweet embrace!'",
    question: "What figure of speech is featured in addressing 'O Mother Earth'?",
    options: ["Apostrophe", "Simile", "Litotes", "Onomatopoeia"],
    answer: "Apostrophe",
    hint: "Directly addressing the earth as a living mother who can listen.",
    solution: "Invoking an inanimate natural entity ('O Mother Earth') as a conscious listening figure is an apostrophe.",
    target: "Figurative Language: Apostrophe"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what does the title itself literally and symbolically mean?",
    options: [
      "Literally, a ghost stranded at a crossroads in a children's rhyme; symbolically, an educated African torn between Western culture and indigenous tradition",
      "A story about a haunted castle along the coast of Cape Coast",
      "A medical textbook about viral fevers contracted in foreign universities",
      "A fictional adventure about fishermen lost at sea"
    ],
    answer: "Literally, a ghost stranded at a crossroads in a children's rhyme; symbolically, an educated African torn between Western culture and indigenous tradition",
    hint: "Connect the literal children's song to Ato's cultural indecisiveness.",
    solution: "The title refers literally to the ghost at the crossroads in the song and symbolically to Ato, who is culturally paralyzed between African tradition and Western ways.",
    target: "Title Significance: 'The Dilemma of a Ghost'"
  },
  {
    passage: "The warrior's shield was a solid wall of bronze that turned away every whistling arrow.",
    question: "What figure of speech is used in calling the shield 'a solid wall of bronze'?",
    options: ["Metaphor", "Simile", "Litotes", "Apostrophe"],
    answer: "Metaphor",
    hint: "Direct equation without using 'like' or 'as'.",
    solution: "Directly describing a battle shield as a bronze wall without comparative markers is a metaphor.",
    target: "Figurative Language: Metaphor"
  },
  {
    passage: "In L. H. Ofosu-Appiah's 'The Desert Rivers', what is the author's tone toward the seasonal river throughout its cycles?",
    options: [
      "Contemplative, reverent, and admiring of nature's cyclical power of endurance and restoration",
      "Bitter, angry, and mocking of rural African climates",
      "Cold, clinical, and completely disinterested",
      "Terrified and full of apocalyptic dread"
    ],
    answer: "Contemplative, reverent, and admiring of nature's cyclical power of endurance and restoration",
    hint: "Notice the poet's quiet respect for the river's patience and rebirth.",
    solution: "The poet writes with reflective reverence, admiring the river's ability to endure hardship and burst back to life.",
    target: "Poetic Tone: 'The Desert Rivers'"
  },
  {
    passage: "The dry twigs crackled, snapped, and popped under the hunter's cautious footsteps.",
    question: "What literary device is prominent in 'crackled, snapped, and popped'?",
    options: ["Onomatopoeia", "Simile", "Metaphor", "Hyperbole"],
    answer: "Onomatopoeia",
    hint: "These words phonetically recreate the physical sounds of breaking dry wood.",
    solution: "Words that phonetically reproduce the sharp noises of breaking twigs are onomatopoeic.",
    target: "Sound Devices: Onomatopoeia"
  },
  {
    passage: "In 'The Dilemma of a Ghost', what is Ama Ata Aidoo's overarching message to post-colonial African societies regarding Western education?",
    options: [
      "Western education is useless and should be completely abolished across Africa",
      "Western education must be balanced with cultural self-knowledge and empathy; otherwise, it produces alienated individuals who bring division rather than progress",
      "Educated Africans should cut all ties with their illiterate rural families",
      "Foreign marriages are legally forbidden under traditional Akan law"
    ],
    answer: "Western education must be balanced with cultural self-knowledge and empathy; otherwise, it produces alienated individuals who bring division rather than progress",
    hint: "Education without cultural grounding leaves individuals like Ato stranded at the crossroads.",
    solution: "Aidoo warns that Western education without cultural self-awareness alienates African returnees, creating internal division rather than communal progress.",
    target: "Core Thematic Synthesis"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Prescribed Text: Ama Ata Aidoo's "The Dilemma of a Ghost" (Act 4 Climax)
// =========================================================================
const capstone5B9IntermediateQuestions = [
  {
    questionNumber: 51,
    question: "According to the passage, what specific behavior of Eulalie triggers Ato's fury on Sunday morning?",
    options: [
      "She was singing American jazz songs at the top of her voice",
      "She was drinking gin and smoking a cigarette in the open courtyard before church bells had finished ringing",
      "She threw hot soup over Esi Kom's head",
      "She was packing her suitcases to return to New York"
    ],
    answer: "She was drinking gin and smoking a cigarette in the open courtyard before church bells had finished ringing",
    hint: "Look at the opening stage directions and Ato's first line of dialogue.",
    solution: "Ato is shocked to find Eulalie drinking gin and smoking in the courtyard on a Sunday morning before church services have concluded.",
    target: "Capstone Exam: Literal Comprehension & Stage Directions"
  },
  {
    questionNumber: 52,
    question: "In what way does Eulalie expose Ato's cowardice regarding their mutual decision to delay childbearing?",
    options: [
      "She reveals that they agreed together in New York to delay having children, but Ato was too cowardly to tell his mother, letting the family believe Eulalie was barren",
      "She tells him that she never wanted to marry him in the first place",
      "She says that Ato failed his university examinations in America",
      "She reveals that Ato spent all their savings on expensive European suits"
    ],
    answer: "She reveals that they agreed together in New York to delay having children, but Ato was too cowardly to tell his mother, letting the family believe Eulalie was barren",
    hint: "Review Eulalie's speech: 'Who refused to tell them that we decided—together, in New York—not to have children...?'",
    solution: "Eulalie exposes Ato's hypocrisy: they planned to delay childbirth, but Ato's fear of his family led him to keep it secret, leaving Eulalie to bear the blame for being barren.",
    target: "Capstone Exam: Character Motivation & Plot Analysis"
  },
  {
    questionNumber: 53,
    question: "What figure of speech does Eulalie employ when she angrily describes how the family elders view conception: 'They think children drop out of heaven like ripe mangoes'?",
    options: [
      "Simile (comparing children falling from heaven to ripe mangoes using 'like')",
      "Metaphor (equating children directly to mango trees)",
      "Onomatopoeia (imitating the sound of falling fruit)",
      "Apostrophe (addressing the mango tree directly)"
    ],
    answer: "Simile (comparing children falling from heaven to ripe mangoes using 'like')",
    hint: "Notice the comparison formula 'like ripe mangoes'.",
    solution: "Comparing the arrival of children to ripe mangoes falling from trees using 'like' constitutes a satirical simile mocking traditional assumptions.",
    target: "Capstone Exam: Figurative Language Decoding"
  },
  {
    questionNumber: 54,
    question: "What dramatic crisis concludes this heated exchange, and what does it reveal about Ato's character under extreme pressure?",
    options: [
      "Ato slaps Eulalie violently, revealing that when stripped of his modern intellectual veneer, he resorts to domestic violence out of humiliated weakness",
      "Eulalie burns the family house down with her cigarette",
      "Esi Kom enters with a cutlass and forces Eulalie out of the village",
      "Ato surrenders his university degree to the church pastor"
    ],
    answer: "Ato slaps Eulalie violently, revealing that when stripped of his modern intellectual veneer, he resorts to domestic violence out of humiliated weakness",
    hint: "Review the physical climax in the stage directions and Ato's horrified reaction to his own hand.",
    solution: "Ato's violent slap reveals his tragic collapse: unable to bridge the cultural divide with mature dialogue, his frustration erupts into physical violence.",
    target: "Capstone Exam: Dramatic Climax & Character Analysis"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the central tragedy of Ato's marriage in this scene.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Ato's cowardice and silence destroy his cross-cultural marriage.",
      "Because Ato slapped Eulalie across the face, she ran out of the courtyard crying.",
      "The breakdown of a cross-cultural marriage caused by silence and domestic violence in Hasodzi.",
      "A broken marriage."
    ],
    answer: "Ato's cowardice and silence destroy his cross-cultural marriage.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Ato's cowardice and silence destroy his cross-cultural marriage' is exactly 8 words, forms a complete Subject-Verb-Object sentence, and captures the tragic theme. Option C is a fragment (0 marks), and Option B has 15 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployCockcrowB9Intermediate() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();
  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Cockcrow Intermediate Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B9IntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_C_I_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B9",
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
      learningCompetency: "B9.2.2.1 / B9.2.3.1: Analyze dramatic irony, cultural conflicts, character psychology, and poetic forms in prescribed Cockcrow drama and poetry."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9IntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${dilemmaOfAGhostAct4CapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_C_I_${item.questionNumber}`,
      level: "B9",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: dilemmaOfAGhostAct4CapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.2.2.1 / B9.2.3.1: Multi-paragraph textual analysis of modern African drama, evaluating dramatic climax, character collapse, and formulating concise thematic summaries."
    });
  });

  // 3. Write directly to Firestore subcollections
  const topicIds = ["literature_cockcrow_canon", "cockcrow_literary_devices"];
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B9_intermediate)...");
  for (const topicId of topicIds) {
    for (const parent of parentPaths) {
      const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B9_intermediate`);
      await subDocRef.set({
        level: "B9",
        difficulty: "intermediate",
        title: "Basic 9 Intermediate Lab: 50 Unique Cockcrow Drama & Poetry Drills + 5 Capstone Exam Questions",
        totalQuestions: all55Questions.length,
        shortDrillsCount: 50,
        capstoneExamQuestionsCount: 5,
        questions: all55Questions,
        metadata: {
          hasDuplicateQuestions: false,
          uniqueQuestionsCount: 55,
          structure: "50 Unique Short Drills (Drama Climax, Poetic Nuance & Intermediate Devices) + 5 Capstone Full-Passage Questions",
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

  // 4. Synchronize into main document practicePool.medium for b9
  console.log("\nSynchronizing main document practicePool.medium for b9...");
  const mappedMediumQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'medium' as const,
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

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Cockcrow B9 Intermediate!`);
}

deployCockcrowB9Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Cockcrow B9 Intermediate Lab:", err);
    process.exit(1);
  });

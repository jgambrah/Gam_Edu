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
// =========================================================================
const akosomboFullPassage = 
`In the early years of Ghana's independence, the construction of the Akosombo Hydroelectric Dam represented the nation's boldest industrial ambition. Spearheaded by President Kwame Nkrumah and formally commissioned in 1965, the monumental project aimed to harness the immense flow of the Volta River. Engineers flooded the river gorge to create Lake Volta, which remains one of the largest artificial reservoirs by surface area in the world.

The primary objective of the dam was to generate abundant, low-cost electrical energy to drive national economic modernization. Heavy industries, particularly the commercial aluminum smelter at Tema, depended entirely on the dam's power generation. In addition to powering urban manufacturing hubs, the hydroelectric grid stimulated local rural economies by powering irrigation pumping schemes and cold-storage facilities for coastal fishing communities.

However, the creation of the massive reservoir introduced severe socioeconomic disruptions. Over eighty thousand inhabitants living in the submerged river valleys were displaced from their ancestral farmlands. The government resettled these communities into newly constructed townships, though many families endured prolonged hardships adapting to unfamiliar soil types and altered livelihoods. Furthermore, the downstream river ecosystem experienced ecological changes, including shifts in seasonal salinity and the proliferation of waterborne vectors such as freshwater snails carrying bilharzia.

Despite these environmental and social hurdles, the Akosombo Dam stands as an enduring pillar of Ghana's energy architecture. It continues to provide base-load electricity to millions of domestic households while exporting power to neighboring West African nations.`;

// =========================================================================
// 50 COMPLETELY UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50ShortDrills = [
  {
    passage: "Cocoa seedlings require moderate shade and fertile, well-drained loam soil. Farmers typically transplant young shoots at the onset of the major rainy season in May to ensure root establishment before the dry spell.",
    question: "According to the passage, in which month do farmers transplant young cocoa seedlings?",
    options: ["March", "May", "August", "December"],
    answer: "May",
    hint: "Scan specifically for the calendar month linked to the major rainy season.",
    solution: "The passage explicitly states that farmers transplant young shoots 'in May to ensure root establishment.'",
    target: "Scanning Specific Details"
  },
  {
    passage: "During the dry harmattan season, humidity drops drastically across the northern savannah, causing dry dusty winds to blow from the Sahara Desert across West Africa.",
    question: "From which geographic region do the dry harmattan winds blow?",
    options: ["The Atlantic Ocean", "The Sahara Desert", "The Guinea Highlands", "The Congo Basin"],
    answer: "The Sahara Desert",
    hint: "Scan for the proper noun indicating the source of the dusty winds.",
    solution: "The text directly states the winds blow 'from the Sahara Desert across West Africa.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "Unlike speed reading, skimming involves purposefully glancing through a passage to identify the main theme, author's purpose, and general layout without reading every individual word.",
    question: "What is the primary objective of skimming a text?",
    options: [
      "To count every punctuation mark",
      "To extract the main theme, purpose, and general layout",
      "To memorize all names and numbers",
      "To correct spelling errors in the manuscript"
    ],
    answer: "To extract the main theme, purpose, and general layout",
    hint: "Check the definition of skimming given in the sentence.",
    solution: "Skimming is defined as glancing 'to identify the main theme, author's purpose, and general layout.'",
    target: "Reading Methodology"
  },
  {
    passage: "The human skeletal system contains 206 individual bones in adulthood. It provides structural support, shields delicate internal organs, and serves as an anchor for muscular movement.",
    question: "How many bones are present in the adult human skeleton according to the text?",
    options: ["105", "206", "312", "500"],
    answer: "206",
    hint: "Scan for the three-digit numeral.",
    solution: "The text states explicitly: 'contains 206 individual bones in adulthood.'",
    target: "Scanning Numerals"
  },
  {
    passage: "Mangrove ecosystems along tropical coastlines serve as vital marine nurseries. Their tangled root systems trap silt, prevent shoreline erosion, and shield offshore coral reefs from sediments.",
    question: "How do mangrove roots help protect coastal shorelines?",
    options: [
      "By producing table salt",
      "By trapping silt and preventing shoreline erosion",
      "By killing off juvenile fish",
      "By warming the surrounding ocean water"
    ],
    answer: "By trapping silt and preventing shoreline erosion",
    hint: "Look at the direct functions performed by the tangled roots.",
    solution: "The passage notes that the roots 'trap silt, prevent shoreline erosion, and shield offshore coral reefs.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "Clean drinking water is indispensable for human life. Without adequate daily hydration, body organs cease to function efficiently. Furthermore, safe water protects rural villages from cholera outbreaks.",
    question: "What is the topic sentence of this paragraph?",
    options: [
      "Clean drinking water is indispensable for human life.",
      "Without adequate daily hydration, body organs cease to function.",
      "Safe water protects rural villages from cholera.",
      "Water is often stored in clay pots."
    ],
    answer: "Clean drinking water is indispensable for human life.",
    hint: "The topic sentence is the main statement opening the paragraph.",
    solution: "The first sentence sets out the core assertion, which the rest of the sentences support with health facts.",
    target: "Topic Sentence Identification"
  },
  {
    passage: "Deforestation in tropical zones causes rapid soil degradation. When heavy logging removes tree canopies, torrential rains wash away fertile topsoil, turning productive farmlands into barren scrubland.",
    question: "What is the primary consequence of removing protective forest canopies?",
    options: [
      "It encourages wild animal migration",
      "Torrential rains wash away fertile topsoil, causing soil degradation",
      "It makes farm work cooler and easier",
      "It increases annual rainfall"
    ],
    answer: "Torrential rains wash away fertile topsoil, causing soil degradation",
    hint: "Trace the cause-and-effect relationship between logging and topsoil.",
    solution: "The text explains that logging allows rains to wash away topsoil, causing soil degradation.",
    target: "Cause and Effect"
  },
  {
    passage: "Solar photovoltaic panels convert sunlight directly into electric current. Because they have no moving mechanical gears, these systems require very little routine maintenance once installed on rooftops.",
    question: "Why do solar panel installations require minimal maintenance?",
    options: [
      "Because they are made entirely of plastic",
      "Because they have no moving mechanical gears",
      "Because they operate only on cloudy days",
      "Because the government cleans them daily"
    ],
    answer: "Because they have no moving mechanical gears",
    hint: "Look for the clause starting with 'Because they have no...'",
    solution: "The text states explicitly: 'Because they have no moving mechanical gears, these systems require very little routine maintenance...'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "Before the cock crowed at dawn, Kofi strapped on his cutlass and slung his water canteen over his shoulder. Next, he unlatched the wooden gate and walked briskly down the narrow path toward his cassava farm.",
    question: "What action did Kofi take immediately after strapping on his cutlass and canteen?",
    options: [
      "He harvested ripe cassava tubers",
      "He unlatched the wooden gate and walked down the path",
      "He ate breakfast with his family",
      "He bought a new hoe at the village market"
    ],
    answer: "He unlatched the wooden gate and walked down the path",
    hint: "Look for the action signaled by the temporal transition word 'Next'.",
    solution: "The text follows chronological order: 'Next, he unlatched the wooden gate and walked briskly...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Honeybees play an essential role in commercial agriculture as pollinators. While collecting nectar, bees transfer pollen grains between blossoms, enabling fruit trees to produce fertile seeds and heavy fruit crops.",
    question: "How do honeybees assist fruit trees according to the text?",
    options: [
      "By building hives inside tree trunks",
      "By transferring pollen grains between blossoms during nectar collection",
      "By eating destructive caterpillars",
      "By providing shade with their wings"
    ],
    answer: "By transferring pollen grains between blossoms during nectar collection",
    hint: "Identify the agricultural service performed by bees while collecting nectar.",
    solution: "The passage notes bees 'transfer pollen grains between blossoms, enabling fruit trees to produce fertile seeds...'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "Scanning is an efficient search method used when a reader wants to locate a specific entry, such as a word in a dictionary, a passenger on a flight manifest, or an index entry in a textbook.",
    question: "Under which circumstance is scanning the most appropriate reading technique?",
    options: [
      "When enjoying a fictional adventure story for pleasure",
      "When searching for a specific item like a word in a dictionary",
      "When evaluating an author's philosophical arguments",
      "When proofreading a handwritten composition"
    ],
    answer: "When searching for a specific item like a word in a dictionary",
    hint: "Scanning focuses on locating a target data point rapidly.",
    solution: "Scanning is used specifically to locate pinpointed entries like words in a dictionary or flight manifests.",
    target: "Reading Methodology"
  },
  {
    passage: "The Cape Coast Castle was erected along the Gulf of Guinea by European trading enterprises. Initially used for gold and timber commerce, it later became a central transit dungeon for the transatlantic slave trade.",
    question: "What commodity was traded at Cape Coast Castle before it became a slave dungeon?",
    options: ["Cocoa and rubber", "Gold and timber", "Textiles and gunpowder", "Salt and ivory"],
    answer: "Gold and timber",
    hint: "Scan for the two commercial products traded initially.",
    solution: "The text explicitly states: 'Initially used for gold and timber commerce...'",
    target: "Scanning Specific Details"
  },
  {
    passage: "Photosynthesis is the biological mechanism by which green plants utilize solar radiation, water, and atmospheric carbon dioxide to synthesize glucose and release oxygen into the air.",
    question: "Which essential gas is released into the atmosphere as a product of photosynthesis?",
    options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Methane"],
    answer: "Oxygen",
    hint: "Scan for the gas released at the end of the sentence.",
    solution: "The passage notes plants 'synthesize glucose and release oxygen into the air.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "Kwame Nkrumah University of Science and Technology was established in Kumasi in 1951. Its founding charter aimed to advance technical engineering competencies and agricultural modernization in Ghana.",
    question: "In what year was the university founded according to the passage?",
    options: ["1948", "1951", "1957", "1966"],
    answer: "1951",
    hint: "Scan for the four-digit numeral following 'Kumasi in'.",
    solution: "The text directly states the institution 'was established in Kumasi in 1951.'",
    target: "Scanning Numerals"
  },
  {
    passage: "Mosquitoes require stagnant, calm pools of water to lay their eggs. Community health workers advise families to cover open barrels, bury discarded tin cans, and drain stagnant puddles to suppress breeding.",
    question: "Why do health officers advise families to empty stagnant water containers?",
    options: [
      "To prevent animals from drinking",
      "To eliminate the breeding grounds of mosquitoes",
      "To save tap water for cooking",
      "To keep the compound dry for sports"
    ],
    answer: "To eliminate the breeding grounds of mosquitoes",
    hint: "Relate stagnant water to where mosquitoes lay their eggs.",
    solution: "Emptying containers removes the stagnant pools where mosquitoes lay eggs, suppressing breeding.",
    target: "Causal Analysis"
  },
  {
    passage: "Traditional Kente cloth is handwoven on horizontal wooden treadle looms. Master weavers in communities like Bonwire combine colorful rayon and silk threads to form geometric motifs that symbolize royal proverbs.",
    question: "Which town is mentioned as an authentic hub for traditional Kente weaving?",
    options: ["Tamale", "Bonwire", "Tema", "Tarkwa"],
    answer: "Bonwire",
    hint: "Scan for the capitalized town name beginning with 'B'.",
    solution: "The text mentions: 'Master weavers in communities like Bonwire...'",
    target: "Scanning Proper Nouns"
  },
  {
    passage: "Unlike internal combustion engines that burn petrol and expel exhaust smoke, electric vehicles use rechargeable lithium-ion battery packs that emit no tailpipe emissions into city air.",
    question: "What is an environmental advantage of electric vehicles cited in the text?",
    options: [
      "They are made entirely of recycled glass",
      "They produce zero tailpipe emissions",
      "They can fly over traffic jams",
      "They require no battery charging"
    ],
    answer: "They produce zero tailpipe emissions",
    hint: "Look at the direct consequence of using rechargeable battery packs.",
    solution: "The passage notes electric vehicles 'emit no tailpipe emissions into city air.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "A topic sentence acts as the steering wheel of a paragraph. It states the primary thesis of the paragraph and keeps all following supporting sentences aligned with that single main idea.",
    question: "What is the primary role of a topic sentence according to this excerpt?",
    options: [
      "To list dictionary definitions",
      "To state the main thesis and keep supporting sentences unified",
      "To conclude the entire essay",
      "To introduce a joke to the reader"
    ],
    answer: "To state the main thesis and keep supporting sentences unified",
    hint: "Check what the topic sentence steers and unifies.",
    solution: "The text explains it 'states the primary thesis... and keeps all following supporting sentences aligned.'",
    target: "Textual Architecture"
  },
  {
    passage: "The Mole National Park in northern Ghana covers over four thousand square kilometers of Guinea savannah. It serves as a protected sanctuary for African elephants, roan antelopes, and spotted hyenas.",
    question: "What type of ecological vegetation characterizes Mole National Park?",
    options: ["Dense tropical rain forest", "Guinea savannah", "Coastal mangrove swamp", "Desert sand dunes"],
    answer: "Guinea savannah",
    hint: "Scan for the ecosystem words paired with 'savannah'.",
    solution: "The text states the park covers 'over four thousand square kilometers of Guinea savannah.'",
    target: "Scanning Specific Details"
  },
  {
    passage: "In standard formal writing, supporting details provide evidence for an author's main assertion. These details may include verifiable statistical metrics, factual case studies, or expert testimonies.",
    question: "Which of the following is considered a supporting detail in a paragraph?",
    options: [
      "Verifiable statistical metrics and factual case studies",
      "Unrelated rumors heard in the street",
      "Random drawings on the margin",
      "The title of another book"
    ],
    answer: "Verifiable statistical metrics and factual case studies",
    hint: "Look at the list of items supporting details may include.",
    solution: "The excerpt notes supporting details 'may include verifiable statistical metrics, factual case studies, or expert testimonies.'",
    target: "Textual Architecture"
  },
  {
    passage: "Cassava roots are rich in starch and dietary carbohydrates, providing substantial energy. However, fresh tubers deteriorate rapidly within forty-eight hours of harvesting unless processed into gari or flour.",
    question: "Within what timeframe do freshly harvested cassava roots begin to spoil if left unprocessed?",
    options: ["Twelve hours", "Twenty-four hours", "Forty-eight hours", "One week"],
    answer: "Forty-eight hours",
    hint: "Scan for the hyphenated time phrase.",
    solution: "The passage notes tubers 'deteriorate rapidly within forty-eight hours of harvesting...'",
    target: "Scanning Numerals"
  },
  {
    passage: "The human eye contains two main types of light-sensitive photoreceptor cells. Rods detect dim light and enable night vision, while cones distinguish sharp details and bright color hues.",
    question: "Which photoreceptor cells are responsible for distinguishing colors in the human eye?",
    options: ["Rods", "Cones", "Corneas", "Pupils"],
    answer: "Cones",
    hint: "Check the cell type linked to 'bright color hues'.",
    solution: "The text explicitly states: 'while cones distinguish sharp details and bright color hues.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "During the Homowo festival, Ga communities prepare and sprinkle kpokpoi, a traditional dish of steamed fermented cornmeal. The celebration commemorates the historical triumph of ancestors over severe famine.",
    question: "What historical triumph does the Homowo festival commemorate?",
    options: [
      "Victory in an ancient sea battle",
      "The triumph of ancestors over severe famine",
      "The discovery of gold mines",
      "The building of the first stone house"
    ],
    answer: "The triumph of ancestors over severe famine",
    hint: "Look at what the celebration commemorates in the second sentence.",
    solution: "The text states: 'The celebration commemorates the historical triumph of ancestors over severe famine.'",
    target: "Cultural Knowledge"
  },
  {
    passage: "Thermal power stations combust natural gas or heavy crude oil to boil water into high-pressure steam. This steam turns heavy turbine blades, which drive electrical generators.",
    question: "What physical force turns the turbine blades in a thermal plant?",
    options: ["Cold ocean currents", "High-pressure steam produced from boiling water", "Wind gusts", "Falling gravel"],
    answer: "High-pressure steam produced from boiling water",
    hint: "Identify what turns the turbine blades in sentence 2.",
    solution: "The passage explains that 'This steam turns heavy turbine blades, which drive electrical generators.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "A dictionary entry provides more than simple spellings. It indicates word pronunciation using phonetic scripts, marks syllable divisions, and lists the grammatical part of speech for each word.",
    question: "What additional detail does a dictionary provide alongside spellings?",
    options: [
      "The personal biography of the printer",
      "Phonetic pronunciations, syllable divisions, and parts of speech",
      "The current retail price of the book",
      "A full list of all students in school"
    ],
    answer: "Phonetic pronunciations, syllable divisions, and parts of speech",
    hint: "Review the features listed in sentence 2.",
    solution: "The text notes it 'indicates word pronunciation using phonetic scripts, marks syllable divisions, and lists... part of speech.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "Earthworms ingest soil particles as they burrow through topsoil. As organic matter passes through their digestive tracts, worms excrete nutrient-dense castings that aerate and enrich farm soil.",
    question: "How do earthworms benefit agricultural soil?",
    options: [
      "By drying out plant roots",
      "By excreting nutrient-dense castings that aerate and enrich the soil",
      "By attracting destructive rodents",
      "By blocking rainwater drainage"
    ],
    answer: "By excreting nutrient-dense castings that aerate and enrich the soil",
    hint: "Look at the effect of worm castings on the soil.",
    solution: "The passage states earthworms 'excrete nutrient-dense castings that aerate and enrich farm soil.'",
    target: "Cause and Effect"
  },
  {
    passage: "The ozone layer located in the stratosphere absorbs harmful ultraviolet radiation emitted by the sun. Without this protective atmospheric shield, terrestrial life would suffer severe cellular damage.",
    question: "What dangerous form of solar radiation is absorbed by the ozone layer?",
    options: ["Infrared heat waves", "Harmful ultraviolet radiation", "Microwave signals", "Visible red light"],
    answer: "Harmful ultraviolet radiation",
    hint: "Scan for the word 'radiation' and check its modifier.",
    solution: "The text states the ozone layer 'absorbs harmful ultraviolet radiation emitted by the sun.'",
    target: "Scanning Specific Details"
  },
  {
    passage: "A reliable index at the back of a reference book is arranged alphabetically. It enables a student to locate specific topics and page numbers rapidly without flipping through every page.",
    question: "How is an index typically organized at the back of a reference book?",
    options: ["By the size of words", "Alphabetically by topic keywords", "From longest page to shortest", "Chronologically by date"],
    answer: "Alphabetically by topic keywords",
    hint: "Check how the index is arranged in the first sentence.",
    solution: "The passage explicitly notes that 'A reliable index at the back of a reference book is arranged alphabetically.'",
    target: "Locational Reading Skills"
  },
  {
    passage: "Vaccines stimulate the human immune system to produce targeted antibodies against pathogenic bacteria and viruses, granting long-term protective immunity without causing the actual illness.",
    question: "How do vaccines protect the human body according to the excerpt?",
    options: [
      "By destroying all red blood cells",
      "By stimulating the immune system to produce targeted protective antibodies",
      "By replacing vitamins in food",
      "By lowering body temperature permanently"
    ],
    answer: "By stimulating the immune system to produce targeted protective antibodies",
    hint: "Look at what vaccines stimulate in the first sentence.",
    solution: "The text explains that vaccines 'stimulate the human immune system to produce targeted antibodies...'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "The dry north-easterly trade winds carry fine mineral dust across thousands of miles. This dust settles on crops and rooftops, lowering visibility on regional highways during December and January.",
    question: "In which two months is highway visibility reduced by trade wind dust?",
    options: ["June and July", "December and January", "March and April", "August and September"],
    answer: "December and January",
    hint: "Scan for the two consecutive calendar months named at the end.",
    solution: "The text notes dust lowers visibility 'during December and January.'",
    target: "Scanning Specific Details"
  },
  {
    passage: "The circulatory system relies on the heart as an involuntary muscular pump. The right ventricle pumps deoxygenated blood to the lungs, while the left ventricle delivers oxygenated blood to the body.",
    question: "Which chamber of the heart pumps oxygenated blood to the rest of the body?",
    options: ["The right atrium", "The right ventricle", "The left ventricle", "The pulmonary artery"],
    answer: "The left ventricle",
    hint: "Check the chamber paired with 'oxygenated blood to the body'.",
    solution: "The text specifies: 'while the left ventricle delivers oxygenated blood to the body.'",
    target: "Scanning Specific Details"
  },
  {
    passage: "Recycling plastic containers conserves municipal landfill space and lowers oil consumption. When waste polymers are melted and remolded into wash basins, less virgin petroleum is drilled.",
    question: "What raw fossil fuel is conserved when plastics are recycled?",
    options: ["Coal dust", "Virgin petroleum", "Natural peat", "Liquid kerosene"],
    answer: "Virgin petroleum",
    hint: "Check the final two words of the excerpt.",
    solution: "The passage notes that through remolding, 'less virgin petroleum is drilled.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "The speed of sound travels through dry air at approximately 343 meters per second. However, sound waves propagate much faster through liquids and solid metals due to denser molecular arrangements.",
    question: "Through which medium does sound travel fastest according to the passage?",
    options: ["Outer space vacuum", "Liquids and solid metals", "Dry warm air", "Cold smoke"],
    answer: "Liquids and solid metals",
    hint: "Check the mediums where sound travels 'much faster'.",
    solution: "The text notes 'sound waves propagate much faster through liquids and solid metals due to denser molecular arrangements.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "During the Damba festival celebrated in northern Ghana, chiefs ride richly adorned horses through public avenues. The celebration combines martial equestrian displays with royal praise drumming.",
    question: "What animal display is featured during the Damba festival?",
    options: ["Racing camels", "Richly adorned horses ridden by chiefs", "Trained falcons", "Oxen cart parades"],
    answer: "Richly adorned horses ridden by chiefs",
    hint: "Scan for the animal ridden by chiefs.",
    solution: "The text mentions: 'chiefs ride richly adorned horses through public avenues.'",
    target: "Cultural Knowledge"
  },
  {
    passage: "An encyclopedia is an extensive reference work providing informative summaries across many branches of knowledge. Entries are typically written by scholarly specialists and ordered alphabetically.",
    question: "How are encyclopedia entries primarily organized for readers?",
    options: ["Randomly by page color", "Alphabetically by subject topic", "By date of publication", "By author's age"],
    answer: "Alphabetically by subject topic",
    hint: "Scan for the word 'ordered' at the end of the text.",
    solution: "The passage notes that entries are 'ordered alphabetically.'",
    target: "Locational Reading Skills"
  },
  {
    passage: "Oil palm trees yield two distinct types of commercial oil: red palm oil extracted from the fleshy outer mesocarp, and clear palm kernel oil obtained by crushing the hard inner nut.",
    question: "From which part of the palm fruit is red palm oil extracted?",
    options: ["The deep underground roots", "The fleshy outer mesocarp", "The dry leaves", "The hard wood trunk"],
    answer: "The fleshy outer mesocarp",
    hint: "Check where red palm oil is extracted from in sentence 1.",
    solution: "The text states: 'red palm oil extracted from the fleshy outer mesocarp...'",
    target: "Scanning Specific Details"
  },
  {
    passage: "The Sahara Desert is the largest hot desert on Earth, encompassing over nine million square kilometers. It stretches across North Africa from the Red Sea in the east to the Atlantic Ocean in the west.",
    question: "Which ocean borders the Sahara Desert along its western perimeter?",
    options: ["The Indian Ocean", "The Pacific Ocean", "The Atlantic Ocean", "The Arctic Ocean"],
    answer: "The Atlantic Ocean",
    hint: "Scan for the body of water linked to 'in the west'.",
    solution: "The text directly states: 'to the Atlantic Ocean in the west.'",
    target: "Scanning Proper Nouns"
  },
  {
    passage: "Proper food preservation techniques prevent microbial decomposition. Salting fresh tilapia draws out cellular moisture through osmosis, creating an environment where destructive bacteria cannot multiply.",
    question: "How does salting fish preserve it from bacterial spoilage?",
    options: [
      "By adding artificial food colors",
      "By drawing out cellular moisture through osmosis",
      "By cooking the fish on an open flame",
      "By softening the fish bones"
    ],
    answer: "By drawing out cellular moisture through osmosis",
    hint: "Look at the scientific action performed by salt.",
    solution: "The passage explains that salting 'draws out cellular moisture through osmosis, creating an environment where destructive bacteria cannot multiply.'",
    target: "Cause and Effect"
  },
  {
    passage: "The national flag of Ghana was designed by Theodosia Okoh in 1957. It features horizontal stripes of red, gold, and green, centered with a prominent five-pointed black star.",
    question: "Who designed the national flag of Ghana according to the text?",
    options: ["Ephraim Amu", "Theodosia Okoh", "Kwame Nkrumah", "Kofi Antubam"],
    answer: "Theodosia Okoh",
    hint: "Scan for the proper name in the first sentence.",
    solution: "The text explicitly states: 'The national flag of Ghana was designed by Theodosia Okoh in 1957.'",
    target: "Scanning Proper Nouns"
  },
  {
    passage: "A table of contents appears at the beginning of a book. It outlines chapter titles, major thematic subdivisions, and their corresponding starting page numbers in chronological order.",
    question: "Where is a table of contents located in a book?",
    options: [
      "At the very end of the index",
      "At the beginning of the book",
      "In the middle of the glossary",
      "On the outer spine"
    ],
    answer: "At the beginning of the book",
    hint: "Scan for the position specified in sentence 1.",
    solution: "The passage directly states: 'A table of contents appears at the beginning of a book.'",
    target: "Locational Reading Skills"
  },
  {
    passage: "Chlorophyll is the green pigment housed within plant chloroplasts. It plays an indispensable role in trapping red and blue wavelengths of solar light needed to power sugar synthesis.",
    question: "What is the primary role of chlorophyll in green leaves?",
    options: [
      "To produce pleasant flower fragrance",
      "To trap solar light wavelengths needed for photosynthesis",
      "To protect plants from insects",
      "To absorb nitrogen gas from soil"
    ],
    answer: "To trap solar light wavelengths needed for photosynthesis",
    hint: "Check what chlorophyll traps in sentence 2.",
    solution: "The text explains it 'plays an indispensable role in trapping red and blue wavelengths of solar light...'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "The human respiratory tract is lined with microscopic hair-like structures called cilia. These cilia beat upward in coordinated waves to sweep trapped dust and mucus out of the airways.",
    question: "What function do cilia perform in the respiratory system?",
    options: [
      "They absorb oxygen directly into blood",
      "They sweep trapped dust and mucus upward out of the airways",
      "They cool down inhaled warm air",
      "They help in digesting food"
    ],
    answer: "They sweep trapped dust and mucus upward out of the airways",
    hint: "Look at the action performed by the upward beating waves.",
    solution: "The passage explains cilia 'beat upward in coordinated waves to sweep trapped dust and mucus out of the airways.'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "Leguminous plants such as cowpeas, groundnuts, and soybeans develop root nodules harboring symbiotic bacteria. These bacteria convert atmospheric nitrogen into nitrates that naturally fertilize agricultural soil.",
    question: "Which chemical compound is produced by symbiotic bacteria in legume roots to fertilize soil?",
    options: ["Carbon monoxide", "Nitrates", "Sulfur dioxide", "Chlorine gas"],
    answer: "Nitrates",
    hint: "Scan for the nutrient compound into which nitrogen is converted.",
    solution: "The passage notes bacteria 'convert atmospheric nitrogen into nitrates that naturally fertilize agricultural soil.'",
    target: "Scanning Specific Details"
  },
  {
    passage: "Boiling contaminated river water for at least five minutes kills pathogenic bacteria, amoebic cysts, and viruses, rendering the water microbiologically safe for domestic consumption.",
    question: "For how many minutes must water be boiled to kill harmful pathogens according to the text?",
    options: ["One minute", "At least five minutes", "Twenty minutes", "One hour"],
    answer: "At least five minutes",
    hint: "Scan for the time duration stated in sentence 1.",
    solution: "The text specifies: 'Boiling contaminated river water for at least five minutes kills pathogenic bacteria...'",
    target: "Scanning Numerals"
  },
  {
    passage: "The Densu River supplies raw water to the Weija water treatment plant, which produces drinking water for western Accra. However, improper sewage disposal and quarrying along the river banks threaten this water source.",
    question: "Which water treatment plant receives its raw water from the Densu River?",
    options: ["The Kpong treatment plant", "The Weija water treatment plant", "The Barekese dam plant", "The Akosombo station"],
    answer: "The Weija water treatment plant",
    hint: "Scan for the capitalized proper noun before 'water treatment plant'.",
    solution: "The text explicitly states: 'The Densu River supplies raw water to the Weija water treatment plant...'",
    target: "Scanning Proper Nouns"
  },
  {
    passage: "Paraphrasing requires a student to restate a passage's core meaning using their own words and sentence structure, without omitting key facts or adding unsupported personal opinions.",
    question: "What is an essential rule of paraphrasing according to the text?",
    options: [
      "To copy every sentence word-for-word",
      "To restate the core meaning using one's own words without altering the facts",
      "To add personal insults to the text",
      "To delete all verbs from the sentences"
    ],
    answer: "To restate the core meaning using one's own words without altering the facts",
    hint: "Check what paraphrasing requires in the first sentence.",
    solution: "The passage defines paraphrasing as restating 'a passage's core meaning using their own words... without omitting key facts.'",
    target: "Reading Methodology"
  },
  {
    passage: "The human digestive process begins in the mouth. Teeth mechanically crush solid food into smaller pieces, while salivary amylase enzymes break complex starch molecules into maltose sugars.",
    question: "Which enzyme in human saliva begins the chemical digestion of dietary starch?",
    options: ["Gastric pepsin", "Salivary amylase", "Hydrochloric acid", "Pancreatic lipase"],
    answer: "Salivary amylase",
    hint: "Scan for the enzyme name paired with saliva.",
    solution: "The text specifies: 'while salivary amylase enzymes break complex starch molecules into maltose sugars.'",
    target: "Scanning Specific Details"
  },
  {
    passage: "Solar eclipses occur when the moon orbits directly between the sun and the Earth, casting a dark lunar shadow upon the Earth's surface and temporarily obscuring the solar disk.",
    question: "What celestial body passes directly between the Earth and the sun during a solar eclipse?",
    options: ["The planet Mars", "The moon", "A passing comet", "The pole star"],
    answer: "The moon",
    hint: "Identify which body orbits between the Earth and the sun.",
    solution: "The text states: 'when the moon orbits directly between the sun and the Earth...'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "The Larabanga Mosque in northern Ghana is celebrated as one of the oldest Islamic architectural structures in West Africa. Built using mud and timber reed framing, it features distinctive pyramidal towers.",
    question: "What primary building materials were used to construct the historic Larabanga Mosque?",
    options: ["Precast concrete and steel", "Mud and timber reed framing", "Imported red bricks", "Carved granite slabs"],
    answer: "Mud and timber reed framing",
    hint: "Check the building materials mentioned in sentence 2.",
    solution: "The passage states it was: 'Built using mud and timber reed framing...'",
    target: "Literal Fact Retrieval"
  },
  {
    passage: "A glossary is an alphabetical list of specialized or technical terms with accompanying definitions, usually positioned at the very end of a non-fiction textbook.",
    question: "Where is a glossary typically situated within a textbook?",
    options: [
      "On the front book cover",
      "At the very end of the textbook",
      "Between the introduction and chapter one",
      "Inside the publisher's copyright box"
    ],
    answer: "At the very end of the textbook",
    hint: "Check the location described in the final clause.",
    solution: "The passage explicitly notes it is 'usually positioned at the very end of a non-fiction textbook.'",
    target: "Locational Reading Skills"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH AKOSOMBO DAM PASSAGE (51 TO 55)
// =========================================================================
const capstone5Questions = [
  {
    questionNumber: 51,
    question: "According to paragraph 1, in what year was the Akosombo Dam officially commissioned?",
    options: ["1957", "1960", "1965", "1972"],
    answer: "1965",
    hint: "Scan paragraph 1 for the four-digit year following the word 'commissioned'.",
    solution: "Paragraph 1 states explicitly that the dam was 'formally commissioned in 1965'.",
    target: "Capstone Exam: Scanning Numerals"
  },
  {
    questionNumber: 52,
    question: "Which major industrial enterprise at Tema depended entirely on the dam's power output?",
    options: ["A commercial aluminum smelter", "A cotton textile factory", "A motor assembly plant", "A gold refinery"],
    answer: "A commercial aluminum smelter",
    hint: "Look at paragraph 2 for industrial operations in the port city of Tema.",
    solution: "Paragraph 2 explicitly names 'the commercial aluminum smelter at Tema' as depending entirely on the dam.",
    target: "Capstone Exam: Literal Fact Retrieval"
  },
  {
    questionNumber: 53,
    question: "As used in paragraph 1, what is the meaning of the word 'monumental'?",
    options: ["Insignificant and minor", "Massive, historic, and grand in scale", "Fragile and temporary", "Extremely inexpensive"],
    answer: "Massive, historic, and grand in scale",
    hint: "Consider the scale of creating one of the world's largest man-made reservoirs.",
    solution: "'Monumental' refers to an undertaking of immense size and lasting historical significance.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    questionNumber: 54,
    question: "Why did displaced farming families suffer prolonged hardships in the resettlement townships?",
    options: [
      "They had to adapt to unfamiliar soil types and altered livelihoods",
      "The government prohibited farming entirely",
      "They refused to build homes",
      "They could not access river water"
    ],
    answer: "They had to adapt to unfamiliar soil types and altered livelihoods",
    hint: "Review paragraph 3 for the challenges experienced by resettled families.",
    solution: "Paragraph 3 notes families endured hardships 'adapting to unfamiliar soil types and altered livelihoods.'",
    target: "Capstone Exam: Causal Analysis"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary domestic purpose of the Akosombo Dam.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "The dam generates low-cost electrical energy.",
      "Generating electrical energy for Ghanaian citizens.",
      "Because Ghana needed industrialization, Nkrumah constructed the dam to produce electricity.",
      "Electricity generation."
    ],
    answer: "The dam generates low-cost electrical energy.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'The dam generates low-cost electrical energy' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and captures the core purpose. Option B is a fragment (lacks finite verb).",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB7Foundation() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Building 55 UNIQUE questions for Basic 7 Foundation...");

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50ShortDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_F_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B7.2.1.1: Practice targeted reading and decoding skills on short textual excerpts."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5Questions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${akosomboFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_F_${item.questionNumber}`,
      level: "B7",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: akosomboFullPassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B7.2.1.1 / B7.2.2.1: Comprehensive textual analysis and summary synthesis on an authentic full-length exam passage."
    });
  });

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  // 3. Write to subcollection B7_foundation across all paths (separate docs, ~45 KB each)
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B7_foundation`);
    await targetDoc.set({
      level: "B7",
      difficulty: "foundation",
      title: "Basic 7 Foundation Lab: 50 Unique Targeted Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills + 5 Capstone Full-Passage Questions",
        passageVisibility: "Passage embedded both in passageText and at the top of prompt",
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${targetDoc.path}`);
  }

  // 4. Synchronize into main topical document practicePool.low for TopicalLabRunner
  // OPTIMIZATION: Keep ONLY b7, b8, b9 in levels (omit redundant jhs1/jhs2/jhs3 aliases which double the size)
  console.log("\nOptimizing main topical document: storing b7, b8, b9 without duplicated jhs1/jhs2/jhs3 keys...");
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

  for (const mainPath of paths) {
    const mainRef = db.doc(mainPath);
    const snap = await mainRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      
      // Build clean levels with b7, b8, b9 only
      const cleanLevels: Record<string, any> = {
        b7: {
          ...(existingLevels.b7 || {}),
          practicePool: {
            ...(existingLevels.b7?.practicePool || {}),
            low: mappedLowQuestions
          }
        },
        b8: existingLevels.b8 || {},
        b9: existingLevels.b9 || {}
      };

      // Exclude redundant root questions duplicate array if present to keep document compact
      const { questions, ...cleanData } = data;

      await mainRef.set({
        ...cleanData,
        levels: cleanLevels,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated main document practicePool.low at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B7 Foundation!`);
}

deployUniqueB7Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B7 Foundation:", err);
    process.exit(1);
  });

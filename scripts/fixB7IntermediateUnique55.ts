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
// =========================================================================
const feederRoadsFullPassage = 
`In agrarian economies across West Africa, rural feeder roads constitute the vital circulatory system connecting farming hinterlands to bustling urban consumer markets. Smallholder farmers cultivate staples such as plantain, cassava, maize, and perishable leafy vegetables on fertile forest soils. However, the true economic value of these harvests depends on the efficiency with which produce can be evacuated from farm gates to urban wholesale centers.

During the dry months, unpaved laterite tracks allow cargo trucks and tricycle haulers to transport produce with relative ease. Village trading centers thrive as regional middlemen purchase fresh harvests directly from agrarian households. This direct market access provides farmers with steady household income to purchase inputs, pay school levies, and invest in expanded cultivation for the following planting season.

However, the onset of torrential monsoon rains transforms these vital corridors into impassable muddy quagmires. Heavy transport lorries frequently become stuck in deep wheel ruts, stranding tons of agricultural foodstuff in transit. While urban families in coastal capitals endure soaring food prices, perishable vegetables rot in roadside baskets only a few kilometers away. Agrarian communities suffer devastating post-harvest financial losses through no fault of their own.

To resolve this chronic bottleneck, local district assemblies must shift from temporary post-rain grading to permanent road engineering. Constructing reinforced concrete culverts, grading gravel surfaces, and sealing primary feeder arteries with durable bitumen will safeguard food security and stabilize food inflation throughout the year.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50IntermediateDrills = [
  {
    passage: "Clean drinking water is indispensable for human life. Without adequate daily hydration, vital organs fail to eliminate biochemical wastes efficiently. Furthermore, safe communal water sources protect rural settlements against lethal waterborne outbreaks such as cholera and dysentery.",
    question: "Which statement best expresses the main topic idea of this paragraph?",
    options: [
      "Without adequate daily hydration, vital organs fail to eliminate wastes.",
      "Clean drinking water is indispensable for human life.",
      "Safe communal water sources protect settlements against cholera.",
      "Rural settlements often lack running tap water."
    ],
    answer: "Clean drinking water is indispensable for human life.",
    hint: "Identify the overarching anchor claim that opens the deductive paragraph.",
    solution: "The first sentence is the topic sentence; it asserts the overarching claim that water is indispensable, while subsequent sentences supply physiological and public health justifications.",
    target: "Topic Sentence Identification"
  },
  {
    passage: "Deforestation in tropical zones causes rapid agricultural soil degradation. When heavy logging completely clears protective forest canopies, torrential downpours wash away loose topsoil nutrients. Deprived of fertility, productive crop lands quickly transform into barren scrubland.",
    question: "What is the primary focus of this paragraph?",
    options: [
      "The commercial trade value of tropical timber logs",
      "How deforestation triggers topsoil degradation and agricultural loss",
      "Methods used by peasant farmers to dig drainage ditches",
      "The migration patterns of forest birds"
    ],
    answer: "How deforestation triggers topsoil degradation and agricultural loss",
    hint: "Synthesize the cause (felling canopies) and its effect on topsoil.",
    solution: "The paragraph focuses systematically on the direct causal link between forest clearing and the subsequent degradation of agricultural topsoil.",
    target: "Paragraph Gist"
  },
  {
    passage: "Regular physical exercise strengthens cardiovascular health. It enhances coronary blood circulation, reduces arterial pressure, and helps maintain a healthy body mass index. In addition, physical workouts stimulate the release of endorphins that alleviate psychological stress.",
    question: "Where is the topic sentence positioned in this paragraph?",
    options: [
      "At the very beginning of the paragraph",
      "In the middle of the second sentence",
      "At the very end of the paragraph",
      "The paragraph contains no topic sentence"
    ],
    answer: "At the very beginning of the paragraph",
    hint: "Check where the main assertion about cardiovascular health is stated.",
    solution: "This passage follows a standard deductive architecture: the topic sentence ('Regular physical exercise strengthens cardiovascular health') leads the paragraph.",
    target: "Paragraph Structure"
  },
  {
    passage: "Solar photovoltaic energy is completely renewable, emitting zero greenhouse gases during operation. Unlike thermal power plants that combust heavy crude oil, rooftop solar installations require minimal mechanical maintenance once deployed.",
    question: "What makes solar energy environmentally preferable according to the excerpt?",
    options: [
      "It requires heavy combustion of crude oil",
      "It is an inexhaustible resource that generates electricity without greenhouse emissions",
      "It operates exclusively during nocturnal hours",
      "It costs more to maintain than diesel engines"
    ],
    answer: "It is an inexhaustible resource that generates electricity without greenhouse emissions",
    hint: "Focus on the primary environmental advantage cited in the first sentence.",
    solution: "The author explicitly emphasizes that solar energy is renewable and emits zero greenhouse gases during electrical generation.",
    target: "Core Idea Synthesis"
  },
  {
    passage: "In standard formal essays, supporting details serve to explain, illustrate, or prove the main topic sentence. These details may consist of verifiable statistics, factual historical precedents, or causal scientific explanations.",
    question: "What is the primary function of supporting details in an expository paragraph?",
    options: [
      "To introduce an unrelated topic to confuse the reader",
      "To explain, illustrate, or validate the anchor topic sentence",
      "To fill empty space when an author runs out of ideas",
      "To replace the topic sentence completely"
    ],
    answer: "To explain, illustrate, or validate the anchor topic sentence",
    hint: "Supporting details expand and defend the core premise.",
    solution: "Supporting details substantiate the topic sentence by providing explanations, evidence, examples, or data.",
    target: "Textual Architecture"
  },
  {
    passage: "Before synthetic fertilizers became widely available, farmers relied heavily on leguminous cover crops. Legumes host nitrogen-fixing bacteria in their root nodules, which absorb inert atmospheric nitrogen and convert it into soluble soil nitrates that nourish companion crops.",
    question: "What natural mechanism enabled traditional farmers to replenish soil nitrogen?",
    options: [
      "Spreading crushed seashells across farm fields",
      "Growing leguminous cover crops that host nitrogen-fixing bacteria",
      "Burning forest trees to make ash",
      "Plowing farms only during full moon cycles"
    ],
    answer: "Growing leguminous cover crops that host nitrogen-fixing bacteria",
    hint: "Identify the agricultural role performed by legume root nodules.",
    solution: "The excerpt explains that legumes host bacteria in their root nodules that convert atmospheric nitrogen into nitrates.",
    target: "Literal Comprehension"
  },
  {
    passage: "Bush burning at the height of the dry season inflicts severe damage on wild ecosystems. Intense surface fires incinerate dormant plant seeds, destroy beneficial soil microorganisms, and drive away pollinating insects essential for food crop production.",
    question: "Which of the following is an ecological consequence of bush burning stated in the text?",
    options: [
      "It lowers atmospheric temperatures immediately",
      "It incinerates dormant seeds and destroys beneficial soil microorganisms",
      "It encourages rapid growth of cocoa trees",
      "It purifies natural rivers and springs"
    ],
    answer: "It incinerates dormant seeds and destroys beneficial soil microorganisms",
    hint: "Examine the specific biological damages listed in the second sentence.",
    solution: "The passage notes fires 'incinerate dormant plant seeds, destroy beneficial soil microorganisms, and drive away pollinating insects.'",
    target: "Cause and Effect"
  },
  {
    passage: "Public libraries are indispensable cornerstones of democratic education. They offer community members unrestricted access to diverse books, digital learning portals, and quiet study areas regardless of individual socioeconomic background.",
    question: "What makes public libraries vital for democratic education according to the text?",
    options: [
      "They charge expensive subscription fees to readers",
      "They provide free access to diverse knowledge resources for all citizens",
      "They only admit university professors and researchers",
      "They sell second-hand novels at a discount"
    ],
    answer: "They provide free access to diverse knowledge resources for all citizens",
    hint: "Consider what unrestricted access means for people from diverse backgrounds.",
    solution: "The passage asserts libraries provide unrestricted access to learning resources regardless of individual socioeconomic standing.",
    target: "Core Idea Synthesis"
  },
  {
    passage: "Proper ventilation in classroom architecture enhances academic engagement. When fresh air circulates continuously, ambient carbon dioxide levels drop, keeping pupils alert and preventing afternoon drowsiness during intensive study sessions.",
    question: "How does continuous fresh air circulation benefit pupils during class?",
    options: [
      "It makes students fall asleep faster",
      "It lowers carbon dioxide levels, maintaining alertness and preventing drowsiness",
      "It cleans the chalkboard automatically",
      "It lowers student performance in examinations"
    ],
    answer: "It lowers carbon dioxide levels, maintaining alertness and preventing drowsiness",
    hint: "Trace the physiological outcome of lower carbon dioxide levels.",
    solution: "The text explains that lower carbon dioxide levels keep pupils alert and prevent afternoon drowsiness.",
    target: "Cause and Effect"
  },
  {
    passage: "Unlike shallow wells that easily dry up during the harmattan season, mechanized boreholes penetrate deep bedrock aquifers. These deep groundwater reservoirs remain protected from surface contamination and guarantee year-round potable water.",
    question: "Why are mechanized boreholes more reliable than shallow hand-dug wells?",
    options: [
      "They are cheaper to install by villagers",
      "They penetrate deep bedrock aquifers that resist drought and contamination",
      "They collect rain water directly from rooftops",
      "They do not require water pipes"
    ],
    answer: "They penetrate deep bedrock aquifers that resist drought and contamination",
    hint: "Identify the geological advantage of deep bedrock aquifers.",
    solution: "The text notes boreholes penetrate deep aquifers that remain protected from surface pollution and do not dry up seasonally.",
    target: "Contrast Analysis"
  },
  {
    passage: "Vaccines have eradicated smallpox and brought polio to the verge of global extinction. By introducing weakened or inactivated viral fragments, vaccines train the human immune defense system to neutralize live pathogens before infection can occur.",
    question: "What is the biological mechanism by which vaccines grant disease immunity?",
    options: [
      "By replacing all digestive enzymes in the stomach",
      "By training the immune system to recognize and neutralize specific pathogens",
      "By permanently increasing human body temperature",
      "By eliminating the need for daily nutrition"
    ],
    answer: "By training the immune system to recognize and neutralize specific pathogens",
    hint: "Review how weakened viral fragments train immune defenses.",
    solution: "The passage explains that vaccines train the immune system to neutralize live pathogens before infection develops.",
    target: "Literal Comprehension"
  },
  {
    passage: "Soil erosion on steep hillsides can be halted through terraced farming. By carving a sequence of flat, stepped platforms into the slopes, farmers break the velocity of descending rainwater runoff, allowing moisture to soak deep into the soil.",
    question: "How does terracing on steep slopes prevent water erosion?",
    options: [
      "By converting rainwater into steam",
      "By carving flat stepped platforms that reduce the velocity of runoff",
      "By covering the entire hillside with plastic sheets",
      "By removing all crops from the slope"
    ],
    answer: "By carving flat stepped platforms that reduce the velocity of runoff",
    hint: "Identify what happens to the velocity of descending rainwater on stepped platforms.",
    solution: "The text states that stepped platforms 'break the velocity of descending rainwater runoff, allowing moisture to soak deep.'",
    target: "Cause and Effect"
  },
  {
    passage: "Regular handwashing with soap disrupts the lipid bilayer membrane surrounding enveloped respiratory viruses. Once this fatty protective coat is chemically dissolved by soap molecules, the virus breaks apart and loses its ability to infect human cells.",
    question: "What biochemical action does soap perform on enveloped viruses?",
    options: [
      "It multiplies the viral genetic material",
      "It chemically dissolves their protective lipid bilayer membrane",
      "It makes the viral shell harder and stronger",
      "It freezes the virus into solid crystals"
    ],
    answer: "It chemically dissolves their protective lipid bilayer membrane",
    hint: "Look at what soap molecules do to the fatty protective coat.",
    solution: "The passage notes that soap 'chemically dissolves' the lipid bilayer membrane, causing the virus to break apart.",
    target: "Literal Comprehension"
  },
  {
    passage: "The invention of the printing press by Johannes Gutenberg in the fifteenth century democratized literacy. Before movable metal type, manuscripts had to be laboriously hand-copied by scribes, making books exclusive luxury possessions reserved for wealthy aristocrats.",
    question: "Why were books extremely rare and expensive prior to the printing press?",
    options: [
      "Paper was illegal across Europe",
      "Manuscripts had to be laboriously copied by hand by scribes",
      "Ancient rulers banned public reading",
      "There were no authors writing books"
    ],
    answer: "Manuscripts had to be laboriously copied by hand by scribes",
    hint: "Look at the production method used before movable metal type.",
    solution: "The text explains that before the press, 'manuscripts had to be laboriously hand-copied by scribes,' making them exclusive luxury items.",
    target: "Historical Context"
  },
  {
    passage: "Overgrazing by cattle herds strips arid grasslands of their vegetative cover. Without grass root systems to bind topsoil particles together, dry winds carry away fine soil silt, accelerating the desertification of Sahelian grazing corridors.",
    question: "What ecological disaster is triggered when excessive cattle grazing removes grassland cover?",
    options: [
      "Rapid expansion of freshwater lakes",
      "Accelerated desertification due to wind erosion of unbound topsoil",
      "Sudden growth of tropical rainforests",
      "A complete stop to harmattan winds"
    ],
    answer: "Accelerated desertification due to wind erosion of unbound topsoil",
    hint: "Connect overgrazing with the loss of root systems and wind action.",
    solution: "The text concludes that wind carries away topsoil, 'accelerating the desertification of Sahelian grazing corridors.'",
    target: "Cause and Effect"
  },
  {
    passage: "A thesis statement serves as the intellectual backbone of an academic composition. Positioned typically in the introductory paragraph, it asserts the author's primary argument and outlines the analytical scope of the entire text.",
    question: "What is the primary role of a thesis statement in an essay?",
    options: [
      "To provide the author's personal phone number",
      "To assert the primary argument and outline the scope of the essay",
      "To summarize dictionary definitions alphabetically",
      "To conclude the final paragraph with a poem"
    ],
    answer: "To assert the primary argument and outline the scope of the essay",
    hint: "Check what the thesis statement asserts and outlines.",
    solution: "The excerpt states that a thesis statement 'asserts the author's primary argument and outlines the analytical scope of the entire text.'",
    target: "Textual Architecture"
  },
  {
    passage: "In coastal salt-making lagoons, ocean brine is channeled into shallow evaporation pans. Under the intense tropical sun and steady ocean breezes, water evaporates rapidly, leaving behind pure crystallised sea salt for commercial packaging.",
    question: "What physical process separates table salt from ocean brine in coastal lagoons?",
    options: [
      "Rapid chemical freezing",
      "Evaporation of water driven by solar heat and wind",
      "Boiling brine with electric stoves",
      "Filtering water through paper napkins"
    ],
    answer: "Evaporation of water driven by solar heat and wind",
    hint: "Identify the natural process taking place in the shallow pans.",
    solution: "The passage notes: 'Under the intense tropical sun and steady ocean breezes, water evaporates rapidly, leaving behind pure crystallised sea salt...'",
    target: "Literal Comprehension"
  },
  {
    passage: "Termites perform an essential ecological recycling service in tropical forests. By feeding on dead logs and fibrous cellulose, these social insects decompose fallen timber and return vital organic carbon to the forest soil.",
    question: "What ecological benefit do termites provide to tropical forest ecosystems?",
    options: [
      "They destroy live cocoa plantations exclusively",
      "They decompose dead timber and return organic carbon to the soil",
      "They build mounds to block river flow",
      "They consume all rainwater falling on the forest floor"
    ],
    answer: "They decompose dead timber and return organic carbon to the soil",
    hint: "Look at what termites do with dead wood and cellulose.",
    solution: "The text states termites 'decompose fallen timber and return vital organic carbon to the forest soil.'",
    target: "Literal Comprehension"
  },
  {
    passage: "Proper physical ergonomics while studying prevents long-term skeletal strain. Adjusting a chair so the feet rest flat on the floor, positioning computer screens at eye level, and keeping the lower back supported reduces spinal tension.",
    question: "What is the main topic sentence of this paragraph?",
    options: [
      "Proper physical ergonomics while studying prevents long-term skeletal strain.",
      "Adjusting a chair keeps feet flat.",
      "Computer screens should be positioned at eye level.",
      "Studying is tiring for students."
    ],
    answer: "Proper physical ergonomics while studying prevents long-term skeletal strain.",
    hint: "Identify the opening thesis that summarizes all the ergonomic advice that follows.",
    solution: "Sentence 1 is the topic sentence asserting the overarching claim, while the subsequent clauses provide specific ergonomic instructions.",
    target: "Topic Sentence Identification"
  },
  {
    passage: "During the annual Aboakyer festival celebrated by the Efutu people of Winneba, two competing Asafo companies hunt for a live bushbuck without weapons. The company that first captures and presents an uninjured deer to the Paramount Chief wins royal honor.",
    question: "What is the central ritual contest of the Aboakyer festival?",
    options: [
      "A canoe rowing regatta across the ocean",
      "Capturing a live, uninjured bushbuck without weapons",
      "A wrestling match between warrior chiefs",
      "A drum carving competition"
    ],
    answer: "Capturing a live, uninjured bushbuck without weapons",
    hint: "Identify what the Asafo companies hunt and present to the chief.",
    solution: "The passage explains that competing companies 'hunt for a live bushbuck without weapons' and present it uninjured to the chief.",
    target: "Cultural Knowledge"
  },
  {
    passage: "Plastic bags present a lethal choking hazard to livestock in peri-urban grazing lands. Roaming cattle and goats frequently ingest discarded polythene wrappers coated in food residues, which form indigestible blockages in their rumens and lead to fatal starvation.",
    question: "Why do roaming livestock ingest discarded polythene bags?",
    options: [
      "Because the plastic tastes sweet naturally",
      "Because the bags are coated in enticing food residues",
      "Because cows cannot digest grass",
      "Because herders feed plastic to their herds"
    ],
    answer: "Because the bags are coated in enticing food residues",
    hint: "Look for why cattle consume the wrappers.",
    solution: "The text notes livestock ingest wrappers 'coated in food residues,' causing fatal digestive blockages.",
    target: "Cause and Effect"
  },
  {
    passage: "A well-written conclusion does not merely copy the introductory paragraph. Instead, it synthesizes the principal arguments developed throughout the essay, highlights their broader significance, and leaves the reader with a clear final insight.",
    question: "What is the true function of an essay conclusion according to the excerpt?",
    options: [
      "To copy the introduction verbatim",
      "To synthesize arguments and provide a clear final insight",
      "To introduce three new arguments never mentioned before",
      "To apologize for poor writing"
    ],
    answer: "To synthesize arguments and provide a clear final insight",
    hint: "Look at what a conclusion does 'Instead' of copying.",
    solution: "The passage states a conclusion 'synthesizes the principal arguments... highlights their broader significance, and leaves the reader with a clear final insight.'",
    target: "Textual Architecture"
  },
  {
    passage: "The neem tree has been celebrated for centuries across the tropics as a natural pharmacy. Aqueous extracts brewed from its bitter leaves possess potent antibacterial and antifungal properties used to treat skin infections and deter agricultural pests.",
    question: "What medicinal properties do extracts from neem tree leaves possess?",
    options: [
      "Sweet sugar for confectionery",
      "Potent antibacterial and antifungal properties",
      "Chemicals that make skin darker",
      "Substances that cause malaria"
    ],
    answer: "Potent antibacterial and antifungal properties",
    hint: "Scan for the medical terms paired with 'properties'.",
    solution: "The excerpt explicitly notes that leaf extracts 'possess potent antibacterial and antifungal properties.'",
    target: "Literal Comprehension"
  },
  {
    passage: "In desert regions, the date palm serves as a life-giving agricultural keystone. Its high canopy provides cooling shade for citrus crops, its nutritious sugary fruits sustain nomadic families, and its fibrous leaves are woven into durable baskets and sleeping mats.",
    question: "How does the date palm canopy protect smaller orchard crops in arid oases?",
    options: [
      "By producing heavy rain clouds",
      "By providing cooling shade that shields crops from intense sun",
      "By heating the soil at night",
      "By spraying water over orange trees"
    ],
    answer: "By providing cooling shade that shields crops from intense sun",
    hint: "Check how the high canopy interacts with citrus crops.",
    solution: "The passage notes 'Its high canopy provides cooling shade for citrus crops...'",
    target: "Literal Comprehension"
  },
  {
    passage: "Composting organic kitchen scraps creates rich, natural humus for backyard gardening. Decomposing plant trimmings, yam peelings, and dried leaves creates a dark, crumbly soil conditioner that improves soil water retention and nourishes vegetables.",
    question: "What valuable agricultural resource is produced by composting kitchen scraps?",
    options: [
      "Dangerous chemical fumes",
      "Rich, natural humus that enhances soil water retention",
      "Hard building stones",
      "Plastic mulch"
    ],
    answer: "Rich, natural humus that enhances soil water retention",
    hint: "Identify the product described as a dark, crumbly soil conditioner.",
    solution: "The text explains that composting creates 'rich, natural humus' and a soil conditioner that improves water retention.",
    target: "Literal Comprehension"
  },
  {
    passage: "Honey possesses natural preservative qualities that prevent bacterial decomposition. Because it has very low moisture content and a naturally acidic pH, bacteria and wild fungi cannot survive or multiply in pure raw honey.",
    question: "Why can bacteria and fungi not survive in pure raw honey?",
    options: [
      "Because honey is extremely hot",
      "Because honey has very low moisture content and an acidic pH",
      "Because bees add salt to honey",
      "Because honey contains synthetic chemicals"
    ],
    answer: "Because honey has very low moisture content and an acidic pH",
    hint: "Scan for the two chemical properties explained in sentence 2.",
    solution: "The excerpt notes that honey's 'low moisture content and a naturally acidic pH' prevent bacterial survival.",
    target: "Cause and Effect"
  },
  {
    passage: "The human ear contains three minute auditory bones known as the ossicles: the malleus, incus, and stapes. These bones mechanically amplify acoustic vibrations from the eardrum and transmit them into the fluid-filled cochlea.",
    question: "What physical function do the three auditory ossicles perform?",
    options: [
      "They filter dust from inhaled air",
      "They mechanically amplify acoustic vibrations from the eardrum",
      "They produce earwax to clean the canal",
      "They balance the weight of the head"
    ],
    answer: "They mechanically amplify acoustic vibrations from the eardrum",
    hint: "Check what these three bones do to acoustic vibrations.",
    solution: "The passage explains that the ossicles 'mechanically amplify acoustic vibrations from the eardrum.'",
    target: "Literal Comprehension"
  },
  {
    passage: "A well-structured narrative essay follows a chronological arc: an exposition introducing characters and setting, a rising action with escalating conflicts, a turning point climax, and a resolving denouement.",
    question: "What is the peak emotional turning point of a narrative called?",
    options: ["The exposition", "The rising action", "The climax", "The denouement"],
    answer: "The climax",
    hint: "Scan for the term paired with 'turning point'.",
    solution: "The text defines the turning point where conflicts peak as 'a turning point climax.'",
    target: "Textual Architecture"
  },
  {
    passage: "Bicycle transportation provides an eco-friendly urban commuting alternative. Bicycles consume no imported petroleum, produce zero greenhouse exhaust emissions, and reduce gridlock congestion in dense city centers.",
    question: "What is an urban advantage of bicycle transportation mentioned in the passage?",
    options: [
      "It consumes vast amounts of diesel fuel",
      "It produces zero exhaust emissions and eases traffic congestion",
      "It requires wide multi-lane highways",
      "It causes heavy smog in city centers"
    ],
    answer: "It produces zero exhaust emissions and eases traffic congestion",
    hint: "Look at the environmental and traffic benefits listed.",
    solution: "The passage notes bicycles 'produce zero greenhouse exhaust emissions, and reduce gridlock congestion.'",
    target: "Literal Comprehension"
  },
  {
    passage: "Citrus fruits such as oranges, lemons, and grapefruits contain high concentrations of ascorbic acid (vitamin C). Regular consumption of these fruits fortifies the body's collagen synthesis, accelerates wound healing, and boosts resistance to infectious colds.",
    question: "What essential nutrient is found in high concentrations in citrus fruits?",
    options: ["Vitamin D", "Ascorbic acid (Vitamin C)", "Calcium carbonate", "Dietary iron"],
    answer: "Ascorbic acid (Vitamin C)",
    hint: "Scan for the chemical name of the vitamin in parentheses.",
    solution: "The text explicitly states: 'contain high concentrations of ascorbic acid (vitamin C).'",
    target: "Scanning Specific Details"
  },
  {
    passage: "Overfishing in coastal waters severely depletes pelagic fish stocks. When industrial trawlers use illegal fine-mesh monofilament nets, they capture juvenile fish before they reach sexual maturity, collapsing the reproductive cycle of marine fisheries.",
    question: "Why are fine-mesh monofilament nets destructive to marine fisheries?",
    options: [
      "They make the sea water too salty",
      "They capture juvenile fish before they reach reproductive maturity",
      "They attract dangerous sharks to beaches",
      "They tear apart wooden fishing canoes"
    ],
    answer: "They capture juvenile fish before they reach reproductive maturity",
    hint: "Identify what happens to young fish caught in fine-mesh nets.",
    solution: "The text explains nets 'capture juvenile fish before they reach sexual maturity, collapsing the reproductive cycle.'",
    target: "Cause and Effect"
  },
  {
    passage: "The liver is the human body's primary biochemical filtration laboratory. It detoxifies metabolic waste products, metabolizes prescription medications, and produces bile salts essential for the digestion of dietary fats.",
    question: "What digestive fluid is synthesized by the liver according to the text?",
    options: ["Salivary amylase", "Gastric hydrochloric acid", "Bile salts", "Pancreatic insulin"],
    answer: "Bile salts",
    hint: "Scan for the fluid produced for digesting dietary fats.",
    solution: "The excerpt notes the liver 'produces bile salts essential for the digestion of dietary fats.'",
    target: "Literal Comprehension"
  },
  {
    passage: "A chronological text structure presents events in the exact sequential order in which they unfolded over time. Common transitional signposts used in chronological writing include 'first', 'subsequently', 'meanwhile', and 'ultimately'.",
    question: "How does a chronological text structure organize information?",
    options: [
      "By placing the most expensive items first",
      "In the exact sequential order in which events unfolded over time",
      "From shortest sentence to longest sentence",
      "In reverse alphabetical order"
    ],
    answer: "In the exact sequential order in which events unfolded over time",
    hint: "Identify the principle governing chronological writing in sentence 1.",
    solution: "The passage notes that it 'presents events in the exact sequential order in which they unfolded over time.'",
    target: "Textual Architecture"
  },
  {
    passage: "Deep plowing on loose sandy soils accelerates wind erosion during dry harmattan spells. When tractors break down the protective surface crust, dry winds easily blow away lightweight topsoil particles, leaving behind coarse, infertile gravel.",
    question: "What happens when loose sandy soils are plowed too deeply during dry weather?",
    options: [
      "The soil becomes fertile and moist",
      "Dry winds blow away lightweight topsoil particles, leaving infertile gravel",
      "The soil turns into hard building stone",
      "Heavy rains fall immediately"
    ],
    answer: "Dry winds blow away lightweight topsoil particles, leaving infertile gravel",
    hint: "Trace what winds do to broken surface crusts.",
    solution: "The text explains: 'dry winds easily blow away lightweight topsoil particles, leaving behind coarse, infertile gravel.'",
    target: "Cause and Effect"
  },
  {
    passage: "The stomach lining is protected from its own concentrated hydrochloric acid by a thick mucosal barrier. If this protective mucus layer is degraded by bacterial infections or anti-inflammatory drugs, painful gastric ulcers develop.",
    question: "What protects the internal stomach lining from being corroded by acid?",
    options: [
      "A layer of undigested bread",
      "A thick protective mucosal barrier",
      "Large quantities of drinking water",
      "A network of tiny bones"
    ],
    answer: "A thick protective mucosal barrier",
    hint: "Look at what shields the stomach in sentence 1.",
    solution: "The text states the stomach 'is protected from its own concentrated hydrochloric acid by a thick mucosal barrier.'",
    target: "Literal Comprehension"
  },
  {
    passage: "Traditional mud-brick architecture provides natural thermal insulation in hot climates. Because dense earthen walls have high thermal mass, they absorb scorching daytime heat slowly and release it into rooms during cold desert nights.",
    question: "Why are traditional earthen buildings cool during scorching daytime hours?",
    options: [
      "They have electric air conditioning inside the walls",
      "Their dense earthen walls have high thermal mass that absorbs heat slowly",
      "They are painted with modern silver chemicals",
      "They are built deep under ocean water"
    ],
    answer: "Their dense earthen walls have high thermal mass that absorbs heat slowly",
    hint: "Check the physical property of dense earthen walls explained in sentence 2.",
    solution: "The passage notes: 'Because dense earthen walls have high thermal mass, they absorb scorching daytime heat slowly...'",
    target: "Literal Comprehension"
  },
  {
    passage: "Planting vetiver grass strips across agricultural contours prevents rainfall runoff from washing away topsoil. The grass develops an interlocking root network reaching three meters deep, creating a biological barrier that anchors the soil.",
    question: "How deep do vetiver grass root networks penetrate to anchor farm soil?",
    options: ["Ten centimeters", "One meter", "Three meters", "Ten meters"],
    answer: "Three meters",
    hint: "Scan for the depth numeral paired with 'meters'.",
    solution: "The text explicitly states: 'interlocking root network reaching three meters deep...'",
    target: "Scanning Numerals"
  },
  {
    passage: "An introductory paragraph in an expository essay should achieve three goals: capture the reader's interest with a compelling hook, provide relevant background context, and present a clear thesis statement.",
    question: "Which of the following is an essential component of an introductory paragraph?",
    options: [
      "A detailed bibliography of fifty books",
      "A hook, background context, and a clear thesis statement",
      "The full signatures of all school teachers",
      "A numbered list of exam marks"
    ],
    answer: "A hook, background context, and a clear thesis statement",
    hint: "Identify the three goals listed in the sentence.",
    solution: "The excerpt lists three goals: 'a compelling hook, provide relevant background context, and present a clear thesis statement.'",
    target: "Textual Architecture"
  },
  {
    passage: "The kidney contains roughly one million microscopic functional filtering units known as nephrons. These nephrons filter blood under pressure, reabsorbing essential sugars and water while excreting toxic urea in urine.",
    question: "What is the biological name of the microscopic filtering units in the human kidney?",
    options: ["Alveoli", "Nephrons", "Neurons", "Platelets"],
    answer: "Nephrons",
    hint: "Scan for the biological term ending in '-ons' associated with kidneys.",
    solution: "The text explicitly notes: 'microscopic functional filtering units known as nephrons.'",
    target: "Scanning Specific Details"
  },
  {
    passage: "During the Fetu Afahye festival celebrated in Cape Coast, seven traditional Asafo companies parade in distinct regalia. The festival concludes with the Omanhene shooting a musket into the ocean to declare peace and prosperity.",
    question: "How many traditional Asafo companies parade during the Fetu Afahye festival?",
    options: ["Three", "Five", "Seven", "Twelve"],
    answer: "Seven",
    hint: "Scan for the number word preceding 'traditional Asafo companies'.",
    solution: "The passage states: 'seven traditional Asafo companies parade in distinct regalia.'",
    target: "Cultural Knowledge"
  },
  {
    passage: "Defective vehicular exhaust systems release dangerous carbon monoxide gas into congested street air. Carbon monoxide binds tightly to human hemoglobin, preventing oxygen delivery to vital body organs and causing headaches and dizziness.",
    question: "Why is inhaling carbon monoxide gas hazardous to human physiology?",
    options: [
      "It tastes bitter in the mouth",
      "It binds to hemoglobin and blocks oxygen delivery to body organs",
      "It turns human skin pale blue instantly",
      "It makes people hungry"
    ],
    answer: "It binds to hemoglobin and blocks oxygen delivery to body organs",
    hint: "Look at what happens when carbon monoxide binds to hemoglobin.",
    solution: "The passage explains: 'Carbon monoxide binds tightly to human hemoglobin, preventing oxygen delivery to vital body organs...'",
    target: "Cause and Effect"
  },
  {
    passage: "A cause-and-effect organizational structure analyzes why an event took place and what resulting consequences unfolded. Common transition signposts used in this structure include 'consequently', 'therefore', 'as a result', and 'due to'.",
    question: "Which of the following transition markers signals a cause-and-effect relationship?",
    options: ["'Meanwhile'", "'Therefore'", "'Firstly'", "'In contrast'"],
    answer: "'Therefore'",
    hint: "Select the word from the list given in the passage that denotes a resulting consequence.",
    solution: "The text lists 'consequently', 'therefore', 'as a result', and 'due to' as cause-and-effect markers.",
    target: "Textual Architecture"
  },
  {
    passage: "Boiling home drinking water for five minutes kills waterborne bacteria, protozoan cysts, and viral pathogens. Once cooled and stored in clean, covered ceramic vessels, the water remains safe for household consumption.",
    question: "Why should boiled drinking water be stored in covered ceramic vessels?",
    options: [
      "To keep the water freezing cold like ice",
      "To prevent airborne dirt and insects from re-contaminating the safe water",
      "To change the color of the water",
      "To make the water evaporate faster"
    ],
    answer: "To prevent airborne dirt and insects from re-contaminating the safe water",
    hint: "Consider what covering vessels achieves after boiling.",
    solution: "Covering vessels ensures that purified water does not suffer re-contamination from ambient airborne dust or insects.",
    target: "Inference & Hygiene Logic"
  },
  {
    passage: "The tropical coconut palm is often described as the 'tree of life'. Its husk yields resilient coir fibers for ropes and door mats, its shell is carved into domestic bowls, and its meat produces nutritional cooking oil.",
    question: "What industrial item is manufactured from the resilient fibers of the coconut husk?",
    options: ["Refined diesel fuel", "Ropes and door mats", "Cotton shirts", "Ceramic cups"],
    answer: "Ropes and door mats",
    hint: "Scan for the items produced from 'coir fibers'.",
    solution: "The passage notes: 'Its husk yields resilient coir fibers for ropes and door mats...'",
    target: "Literal Comprehension"
  },
  {
    passage: "Excessive consumption of refined table sugar promotes dental caries. Oral bacteria ferment sugar residues stuck between teeth, producing acidic by-products that dissolve tooth enamel and form painful cavities.",
    question: "How does sugar lead to the formation of dental cavities?",
    options: [
      "Sugar breaks teeth mechanically like stones",
      "Oral bacteria ferment sugar into enamel-dissolving acid",
      "Sugar freezes saliva in the mouth",
      "Sugar pulls teeth out of the gums"
    ],
    answer: "Oral bacteria ferment sugar into enamel-dissolving acid",
    hint: "Look at what oral bacteria produce when fermenting sugar.",
    solution: "The text explains that bacteria ferment sugar residues, 'producing acidic by-products that dissolve tooth enamel.'",
    target: "Cause and Effect"
  },
  {
    passage: "A compare-and-contrast essay structure evaluates the similarities and differences between two subjects. Signal markers such as 'similarly', 'likewise', 'on the other hand', and 'whereas' guide the reader through the comparison.",
    question: "Which transitional phrase signals a contrast between two ideas?",
    options: ["'Similarly'", "'On the other hand'", "'Furthermore'", "'In conclusion'"],
    answer: "'On the other hand'",
    hint: "Identify the signal phrase that shows a difference or opposite side.",
    solution: "The passage identifies 'on the other hand' and 'whereas' as contrast markers.",
    target: "Textual Architecture"
  },
  {
    passage: "Albinism is an inherited genetic condition characterized by the absence of melanin pigment in the skin, hair, and eyes. Individuals with albinism require protective sunglasses and sunscreen lotions to prevent solar burns and skin lesions.",
    question: "What protective items are essential for individuals with albinism according to the text?",
    options: [
      "Heavy wool sweaters and boots",
      "Protective sunglasses and sunscreen lotions",
      "Plastic raincoats and umbrellas",
      "Leather gloves and face masks"
    ],
    answer: "Protective sunglasses and sunscreen lotions",
    hint: "Scan for the two health care items recommended in the second sentence.",
    solution: "The text explicitly states: 'require protective sunglasses and sunscreen lotions to prevent solar burns...'",
    target: "Literal Comprehension"
  },
  {
    passage: "The pancreas serves both endocrine and exocrine functions. It secretes the hormone insulin into the bloodstream to regulate blood glucose, while pumping digestive enzymes into the duodenum to break down carbohydrates and proteins.",
    question: "Which essential hormone is secreted by the pancreas to regulate blood glucose levels?",
    options: ["Adrenaline", "Insulin", "Thyroxine", "Estrogen"],
    answer: "Insulin",
    hint: "Scan for the hormone paired with regulating blood glucose.",
    solution: "The passage explicitly notes that the pancreas 'secretes the hormone insulin into the bloodstream to regulate blood glucose...'",
    target: "Scanning Specific Details"
  },
  {
    passage: "Organic mulching around garden vegetable beds suppresses weed growth and conserves soil moisture. A layer of dried grass or wood chips blocks sunlight from weed seedlings while shielding topsoil from direct evaporative heat.",
    question: "How does organic mulching suppress weed growth around vegetable beds?",
    options: [
      "By poisoning weeds with synthetic chemicals",
      "By blocking sunlight from germinating weed seedlings",
      "By flooding garden beds with water",
      "By freezing the soil surface"
    ],
    answer: "By blocking sunlight from germinating weed seedlings",
    hint: "Look at what dried grass or wood chips block.",
    solution: "The text states that mulch 'blocks sunlight from weed seedlings while shielding topsoil from direct evaporative heat.'",
    target: "Literal Comprehension"
  },
  {
    passage: "An effective summary strips away all illustrative padding, parenthetical examples, and statistical data. It isolates the author's primary proposition and expresses it in a fresh, grammatically complete sentence with an active finite verb.",
    question: "What must be removed when condensing a passage into an effective summary sentence?",
    options: [
      "All capital letters and full stops",
      "Illustrative padding, parenthetical examples, and statistical data",
      "The main subject and verb",
      "All adjectives and prepositions completely"
    ],
    answer: "Illustrative padding, parenthetical examples, and statistical data",
    hint: "Review what the summary strips away in sentence 1.",
    solution: "The passage states an effective summary 'strips away all illustrative padding, parenthetical examples, and statistical data.'",
    target: "Summary Methodology"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH FEEDER ROADS PASSAGE (51 TO 55)
// =========================================================================
const capstone5IntermediateQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 1, why is the economic value of agricultural harvests dependent on rural feeder roads?",
    options: [
      "Because roads store cassava tubers during harmattan",
      "Because produce must be evacuated efficiently from farm gates to urban markets",
      "Because farmers sell cars on rural tracks",
      "Because trucks are manufactured on agricultural farms"
    ],
    answer: "Because produce must be evacuated efficiently from farm gates to urban markets",
    hint: "Review the concluding sentence of paragraph 1.",
    solution: "Paragraph 1 states that the true economic value 'depends on the efficiency with which produce can be evacuated from farm gates to urban wholesale centers.'",
    target: "Capstone Exam: Literal Comprehension"
  },
  {
    questionNumber: 52,
    question: "What positive economic cycle unfolds for agrarian households during the dry season according to paragraph 2?",
    options: [
      "Farmers abandon farming and move to coastal towns",
      "Direct market access provides steady income to purchase farm inputs and pay school levies",
      "Middlemen give free tractors to all village youth",
      "Government bans food transportation to cities"
    ],
    answer: "Direct market access provides steady income to purchase farm inputs and pay school levies",
    hint: "Scan paragraph 2 for the benefits of steady household income.",
    solution: "Paragraph 2 notes that direct market access provides farmers with steady income 'to purchase inputs, pay school levies, and invest in expanded cultivation...'",
    target: "Capstone Exam: Literal Retrieval"
  },
  {
    questionNumber: 53,
    question: "As used in paragraph 3, what is the meaning of the word 'quagmires' ('impassable muddy quagmires')?",
    options: [
      "Smooth, paved concrete highways",
      "Soft, wet, swampy bog areas where vehicles easily sink",
      "Dry, dusty desert expanses",
      "Narrow bridges over ocean water"
    ],
    answer: "Soft, wet, swampy bog areas where vehicles easily sink",
    hint: "Connect the word with the description of heavy transport lorries becoming stuck in deep mud ruts.",
    solution: "In this context, a 'quagmire' describes soft, muddy, waterlogged terrain that traps vehicles and halts transit.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    questionNumber: 54,
    question: "What sharp economic paradox occurs during the rainy season between coastal cities and rural farming villages?",
    options: [
      "Cities have excess food while villages starve completely",
      "Urban families endure soaring food prices while perishable vegetables rot in nearby rural baskets",
      "Both cities and villages celebrate surplus food",
      "Food prices drop to zero pesewas across the country"
    ],
    answer: "Urban families endure soaring food prices while perishable vegetables rot in nearby rural baskets",
    hint: "Compare what happens to coastal capitals versus rural roadside baskets in paragraph 3.",
    solution: "Paragraph 3 highlights the contrast: urban consumers face high prices while fresh food rots unsold just miles away due to blocked transport.",
    target: "Capstone Exam: Inference & Contrast"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the author's primary solution to feeder road deterioration.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Assemblies must construct culverts and bitumen roads.",
      "Constructing culverts and bitumen roads across rural villages.",
      "Because roads deteriorate, local district assemblies should definitely build concrete culverts and paved surfaces.",
      "Paving rural roads."
    ],
    answer: "Assemblies must construct culverts and bitumen roads.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Assemblies must construct culverts and bitumen roads' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and captures the core engineering remedies. Option B is a fragment (lacks finite verb).",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB7Intermediate() {
  console.log("Building 55 UNIQUE questions for Basic 7 Intermediate...");
  const db = await getDb();

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50IntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_I_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B7.2.1.1: Identify topic sentences, parse paragraph gist, and analyze supporting details."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5IntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${feederRoadsFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_I_${item.questionNumber}`,
      level: "B7",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: feederRoadsFullPassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B7.2.1.1 / B7.2.2.1: Multi-paragraph textual analysis, contextual vocabulary deduction, and constrained summary synthesis."
    });
  });

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  // 3. Write to subcollection B7_intermediate across all paths
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B7_intermediate`);
    await targetDoc.set({
      level: "B7",
      difficulty: "intermediate",
      title: "Basic 7 Intermediate Lab: 50 Unique Targeted Drills + 5 Capstone Exam Questions",
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

  // 4. Synchronize into main topical document practicePool.medium for TopicalLabRunner
  console.log("\nSynchronizing main topical document practicePool.medium (keeping b7, b8, b9 only)...");
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

  for (const mainPath of paths) {
    const mainRef = db.doc(mainPath);
    const snap = await mainRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      
      const cleanLevels: Record<string, any> = {
        b7: {
          ...(existingLevels.b7 || {}),
          practicePool: {
            ...(existingLevels.b7?.practicePool || {}),
            medium: mappedMediumQuestions
          }
        },
        b8: existingLevels.b8 || {},
        b9: existingLevels.b9 || {}
      };

      const { questions, ...cleanData } = data;

      await mainRef.set({
        ...cleanData,
        levels: cleanLevels,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated main document practicePool.medium at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B7 Intermediate!`);
}

deployUniqueB7Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B7 Intermediate:", err);
    process.exit(1);
  });

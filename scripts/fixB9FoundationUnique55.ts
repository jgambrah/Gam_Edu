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
// =========================================================================
const cassavaProcessingFullPassage = 
`In rural agrarian districts across southern and middle Ghana, cassava cultivation represents the indispensable foundation of household food security and subsistence livelihood. As a remarkably resilient root crop that tolerates nutrient-depleted soils and erratic seasonal rainfall patterns, cassava produces abundant starch-rich tubers. However, the commercial potential of this staple is severely undermined by rapid post-harvest physiological deterioration. Once severed from the parent root system, fresh cassava roots succumb to enzymatic vascular streaking within forty-eight hours, rendering the crop unmarketable and unwholesome for human consumption.

To overcome this perishable bottleneck, smallholder farming communities have traditionally relied on rudimentary artisanal processing techniques. Tubers are manually peeled with hand knives, grated on perforated metal sheets, fermented in jute sacks under heavy stones to expel volatile hydrocyanic acid toxins, and roasted over open firewood hearths to produce gari. While this craft provides valuable shelf-stable domestic food, artisanal roasting exposes women processors to chronic carbon monoxide inhalation, consumes vast quantities of scarce local fuelwood, and yields irregular granular quality that fails to meet stringent commercial packaging benchmarks.

Industrializing the cassava value chain offers an extraordinary economic opportunity for national import substitution. Modern agro-processing factories can transform fresh roots into high-grade industrial cassava flour, native starches, and ethanol for pharmaceutical manufacturing. When properly processed within specialized flash-drying plants, native cassava starch can substitute for expensive imported wheat flour in commercial bakery applications, conserving millions of dollars in foreign exchange reserves annually.

Realizing this agro-industrial transformation requires synchronized public-private interventions. The Ministry of Food and Agriculture must establish mechanized processing clusters equipped with solar-hybrid flash dryers in high-density cassava farming districts, while financial institutions provide patient working capital to outgrower farming cooperatives. Modernizing post-harvest cassava infrastructure will stabilize rural farm gate prices, generate skilled employment for youth, and anchor industrial manufacturing.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B9FoundationDrills = [
  {
    passage: "To combat youth unemployment, the ministry must fund vocational technical institutes. For instance, in Germany, over sixty percent of secondary school leavers enroll in dual-track apprenticeships like joinery, welding, and software coding.",
    question: "In extracting the main point for a summary sentence, which portion of the text constitutes illustrative padding that MUST be discarded?",
    options: [
      "'the ministry must fund vocational technical institutes'",
      "'To combat youth unemployment'",
      "'For instance, in Germany, over sixty percent... apprenticeships like joinery, welding, and software coding'",
      "All words must be retained in the summary"
    ],
    answer: "'For instance, in Germany, over sixty percent... apprenticeships like joinery, welding, and software coding'",
    hint: "Identify the example introduced by 'For instance' containing foreign statistics and specific occupational lists.",
    solution: "In summary mechanics, foreign country examples, statistics, and itemized trade lists are illustrative padding and must be excised.",
    target: "Pruning Illustrative Details"
  },
  {
    passage: "Plastic pollution inflicts catastrophic damage on marine ecology. Sea turtles, dolphins, and pelicans frequently ingest polythene bags, mistaking them for jellyfish, which blocks their digestive tracts and causes premature death.",
    question: "Which core proposition should be retained for a summary sentence?",
    options: [
      "Sea turtles mistake polythene bags for translucent jellyfish",
      "Pelicans have fragile digestive tracts",
      "Plastic waste severely harms marine organisms",
      "Polythene bags resemble jellyfish in ocean waters"
    ],
    answer: "Plastic waste severely harms marine organisms",
    hint: "Focus on the macro-claim rather than specific animal species and dietary habits.",
    solution: "The overarching thesis is that plastic waste harms marine organisms; naming specific animals (turtles, pelicans) represents subordinate detail.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Epidemiologists recommend regular handwashing with soap under running water. Studies conducted across ten regional pediatric hospitals proved this habit reduced gastrointestinal infections by forty-eight percent among school-aged children.",
    question: "What portion of this excerpt should be stripped away during summary condensation?",
    options: [
      "The recommendation to wash hands with soap",
      "The hospital survey statistics and percentage reductions",
      "The phrase 'running water'",
      "The term 'infections'"
    ],
    answer: "The hospital survey statistics and percentage reductions",
    hint: "Supporting empirical data, sample sizes, and percentage metrics must be pruned in summaries.",
    solution: "The statistical proof ('forty-eight percent across ten pediatric hospitals') provides evidence rather than the central instructional recommendation.",
    target: "Pruning Statistical Details"
  },
  {
    passage: "Modern cities require green urban parks. As the famous urban planner Ebenezer Howard noted in his landmark 1898 treatise, trees act as biological lungs, absorbing carbon dioxide and cooling asphalt avenues.",
    question: "Why must the mention of 'Ebenezer Howard and his 1898 treatise' be excluded from a summary?",
    options: [
      "Because Ebenezer Howard was an architect",
      "Because historical names, dates, and rhetorical attributions are illustrative padding",
      "Because the summary must only talk about asphalt avenues",
      "Because 1898 occurred in the nineteenth century"
    ],
    answer: "Because historical names, dates, and rhetorical attributions are illustrative padding",
    hint: "Attribution to specific historical figures and publication dates is extraneous to the core thesis.",
    solution: "Summary answers capture the core thesis (parks benefit cities); citing authority figures and dates adds word count without adding core substance.",
    target: "Pruning Authority Quotes"
  },
  {
    passage: "Deforestation causes severe agricultural soil erosion. For example, during the 2022 monsoon downpours in the Kwahu valley, three hundred hectares of terraced cocoa farms were completely washed away by mudslides.",
    question: "Which element represents the core thesis that belongs in a summary?",
    options: [
      "The 2022 monsoon downpours in Kwahu valley",
      "Three hundred hectares of cocoa washed away by mudslides",
      "Deforestation causes severe soil erosion",
      "Terraced farming techniques on hillsides"
    ],
    answer: "Deforestation causes severe soil erosion",
    hint: "Identify the primary cause-and-effect principle asserted in the first sentence.",
    solution: "'Deforestation causes severe soil erosion' is the main thesis; the Kwahu valley disaster is an illustrative example.",
    target: "Thesis Identification"
  },
  {
    passage: "Commercial solar farms require vast expanses of flat land. In desert regions like the Sahara, thousands of photovoltaic panels can be mounted across arid plains without displacing farming communities or felling forest canopies.",
    question: "In summarizing this passage, which element constitutes subordinate illustration?",
    options: [
      "The primary assertion that solar farms require vast flat land",
      "The specific mention of the Sahara Desert and mounting panels across arid plains",
      "The concept of solar energy generation",
      "The term 'photovoltaic panels'"
    ],
    answer: "The specific mention of the Sahara Desert and mounting panels across arid plains",
    hint: "Look for the specific regional example illustrating the broader requirement.",
    solution: "Naming the Sahara Desert provides an illustrative example of flat land; the essential claim is that solar farms require expansive terrain.",
    target: "Pruning Geographic Examples"
  },
  {
    passage: "Regular reading expands an individual's lexical vocabulary. Cognitive neuroscientists at Cambridge University observed that adolescents who read twenty minutes daily acquired over one thousand new words annually.",
    question: "What is the central macro-proposition of this excerpt?",
    options: [
      "Neuroscientists work at Cambridge University",
      "Reading regularly enhances an individual's vocabulary",
      "Adolescents must read for exactly twenty minutes by the clock",
      "Cambridge University conducts neurological examinations"
    ],
    answer: "Reading regularly enhances an individual's vocabulary",
    hint: "Separate the overarching educational claim from the university research statistics.",
    solution: "The opening sentence establishes the core proposition: reading expands vocabulary. The university study is supporting evidence.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Organic composting restores depleted soil nutrients. By combining decaying food peelings, dry leaves, and livestock manure, farmers produce rich humus that stimulates earthworm activity and enhances moisture retention.",
    question: "Which of the following contains non-essential illustrative detail?",
    options: [
      "The broad claim that composting restores soil nutrients",
      "The itemized list of ingredients like food peelings, dry leaves, and livestock manure",
      "The concept of agricultural soil fertility",
      "The noun 'composting'"
    ],
    answer: "The itemized list of ingredients like food peelings, dry leaves, and livestock manure",
    hint: "Lists of raw ingredients provide recipe detail rather than the core proposition.",
    solution: "Listing specific components (peelings, dry leaves, manure) represents illustrative detail; the core point is that composting regenerates soil.",
    target: "Pruning Itemized Lists"
  },
  {
    passage: "Uncontrolled urbanization threatens regional food security. As real estate developers pave over fertile peri-urban farmland with concrete residential estates, local vegetable production plummets and city food prices soar.",
    question: "Which statement best captures the main thesis for a summary sentence?",
    options: [
      "Real estate developers prefer concrete foundations",
      "Urban sprawl destroys fertile farmland and threatens food security",
      "Residential estates require high boundary walls",
      "City dwellers like eating fresh vegetables"
    ],
    answer: "Urban sprawl destroys fertile farmland and threatens food security",
    hint: "Synthesize the cause (urbanization paving farms) and its macro-consequence (food security threat).",
    solution: "The essential thesis connects urban expansion to the loss of agricultural land and food insecurity.",
    target: "Thesis Identification"
  },
  {
    passage: "Proper dental hygiene prevents painful periodontal infections. Dental surgeons recommend brushing teeth twice daily with fluoridated toothpaste, cleaning interdental spaces with floss, and undergoing annual tartar scaling.",
    question: "What represents the supporting procedural details in this passage?",
    options: [
      "The medical assertion that dental hygiene prevents infections",
      "The specific hygiene routines like flossing, fluoridated paste, and tartar scaling",
      "The human mouth and teeth",
      "The importance of personal health"
    ],
    answer: "The specific hygiene routines like flossing, fluoridated paste, and tartar scaling",
    hint: "Identify the specific practices recommended to achieve the main health outcome.",
    solution: "The itemized practices (flossing, fluoridated toothpaste, scaling) are supporting procedural details defending the central claim.",
    target: "Pruning Procedural Details"
  },
  {
    passage: "Overfishing collapses marine biodiversity. When commercial industrial trawlers deploy illegal fine-mesh monofilament nets, they capture juvenile fingerlings before reproductive maturity, decimating local sardinella populations.",
    question: "What core message should a summary student extract from this excerpt?",
    options: [
      "Industrial trawlers have large diesel engines",
      "Fine-mesh nets are manufactured from monofilament nylon",
      "Overfishing decimates marine fish populations",
      "Sardinella fingerlings taste delicious"
    ],
    answer: "Overfishing decimates marine fish populations",
    hint: "Strip away the technical net specifications and focus on the primary environmental impact.",
    solution: "The macro-proposition is that overfishing destroys fish stocks; net specifications and specific fish types are subordinate details.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Physical sports cultivate leadership competencies among youth. Team captains learn to resolve interpersonal disputes, allocate playing roles, and motivate peers during tense competitive matches.",
    question: "In crafting a summary, what is the role of the second sentence?",
    options: [
      "It contradicts the first sentence completely",
      "It provides supporting explanations detailing how sports foster leadership",
      "It introduces an unrelated academic argument",
      "It acts as the central thesis statement of the entire passage"
    ],
    answer: "It provides supporting explanations detailing how sports foster leadership",
    hint: "Examine how dispute resolution and motivating peers relate to leadership competencies.",
    solution: "Sentence 2 explains the mechanics of how leadership is developed, functioning as supporting explanation for the main claim in sentence 1.",
    target: "Textual Architecture Analysis"
  },
  {
    passage: "Wetland conservation shields human settlements from catastrophic flash floods. Natural swamps and marshes act like gigantic biological sponges, absorbing millions of liters of surface runoff before releasing it slowly into rivers.",
    question: "Which figurative element is illustrative padding and must be excluded from an objective summary?",
    options: [
      "The claim that wetlands protect settlements from floods",
      "The analogy comparing swamps to gigantic biological sponges",
      "The concept of surface water runoff",
      "The term 'wetland conservation'"
    ],
    answer: "The analogy comparing swamps to gigantic biological sponges",
    hint: "Metaphors, similes, and colorful rhetorical analogies are never permitted in formal summaries.",
    solution: "The metaphorical analogy ('gigantic biological sponges') is rhetorical ornament; summaries require literal, objective propositions.",
    target: "Pruning Figurative Analogies"
  },
  {
    passage: "Vaccines have eradicated lethal infectious contagions worldwide. Smallpox, which killed an estimated three hundred million humans in the twentieth century alone, was officially declared wiped out by the World Health Organization in 1980.",
    question: "What portion of this excerpt should be pruned in a summary?",
    options: [
      "The claim that vaccines have eliminated deadly contagions",
      "The specific death statistics of smallpox and the 1980 WHO declaration date",
      "The concept of immunization",
      "The word 'contagions'"
    ],
    answer: "The specific death statistics of smallpox and the 1980 WHO declaration date",
    hint: "Look for historical dates, agency acronyms, and historical death figures.",
    solution: "The smallpox death count (300 million) and the 1980 declaration date are historical illustrative details supporting the broader claim.",
    target: "Pruning Historical Evidence"
  },
  {
    passage: "Excessive smartphone usage among adolescents impairs academic focus. Secondary school students who check social media notifications during homework take twice as long to complete assignments and commit frequent calculation errors.",
    question: "What is the primary thesis of this paragraph?",
    options: [
      "Social media apps send audible notifications",
      "Excessive smartphone usage harms teenage academic focus",
      "Calculation errors are common in secondary mathematics",
      "Homework should be abolished in secondary schools"
    ],
    answer: "Excessive smartphone usage harms teenage academic focus",
    hint: "Identify the opening overarching assertion regarding smartphone habits.",
    solution: "The opening sentence states the main assertion: smartphone overuse damages focus. The homework calculation errors illustrate this claim.",
    target: "Thesis Identification"
  },
  {
    passage: "Installing rainwater harvesting infrastructure enhances household water independence. By routing rooftop runoff through gutters into storage tanks, families secure clean water for domestic chores and reduce municipal utility bills.",
    question: "Which of the following represents subordinate technical detail?",
    options: [
      "Rainwater harvesting fosters household water independence",
      "Routing rooftop runoff through gutters into storage tanks",
      "The general idea of conserving water",
      "The concept of household utility bills"
    ],
    answer: "Routing rooftop runoff through gutters into storage tanks",
    hint: "Identify the mechanical description of how rainwater harvesting is plumbed.",
    solution: "The mechanical plumbing instructions (gutters, tanks, routing) explain how the system functions, serving as subordinate detail.",
    target: "Pruning Mechanical Descriptions"
  },
  {
    passage: "Defective vehicular brakes trigger fatal highway accidents. Transport safety investigators revealed that seventy percent of heavy truck crashes along the Accra-Kumasi highway in 2023 resulted from uninspected pneumatic brake pads.",
    question: "What core premise should a summary student extract from this text?",
    options: [
      "Pneumatic brake pads require specialized mechanics",
      "The Accra-Kumasi highway was built in 2023",
      "Faulty brakes cause fatal highway collisions",
      "Heavy trucks transport cargo across the country"
    ],
    answer: "Faulty brakes cause fatal highway collisions",
    hint: "Focus on the direct cause-and-effect principle, ignoring highway names and yearly statistics.",
    solution: "The central premise is that defective brakes cause fatal accidents; the 2023 Accra-Kumasi statistics serve as supporting evidence.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Solar street lighting deters nocturnal street crime in suburban communities. When public lanes are brightly illuminated, petty thieves and armed muggers lose the dark cover required to ambush unsuspecting pedestrians.",
    question: "Why should the description of 'petty thieves and armed muggers losing dark cover' be condensed?",
    options: [
      "Because thieves do not operate at night",
      "Because it explains the detailed mechanism of how illumination prevents crime, which can be stated concisely",
      "Because the passage is about street lights, not criminals",
      "Because the author made up the scenario"
    ],
    answer: "Because it explains the detailed mechanism of how illumination prevents crime, which can be stated concisely",
    hint: "Mechanisms explaining how or why a measure works are condensed in summary writing.",
    solution: "The narrative description of thieves losing cover explains why lights work; a summary condenses this to 'lighting reduces street crime.'",
    target: "Summary Condensation Logic"
  },
  {
    passage: "Drip irrigation optimizes water efficiency in commercial vegetable farming. Unlike flood irrigation that wastes up to sixty percent of applied water through surface evaporation, drip tubing delivers water directly to plant root zones.",
    question: "Which element represents the main thesis of the excerpt?",
    options: [
      "Drip irrigation maximizes water efficiency in vegetable cultivation",
      "Flood irrigation loses sixty percent of water through evaporation",
      "Drip tubing is manufactured from black plastic",
      "Vegetables require daily watering"
    ],
    answer: "Drip irrigation maximizes water efficiency in vegetable cultivation",
    hint: "Look for the central claim comparing water efficiency in the opening sentence.",
    solution: "Sentence 1 is the anchor thesis: drip irrigation optimizes water efficiency. The evaporation figures for flood irrigation provide contrasting evidence.",
    target: "Thesis Identification"
  },
  {
    passage: "Early childhood malnutrition inflicts irreversible neurological impairment. Pediatric studies confirm that infants deprived of essential proteins and micronutrients during their first one thousand days develop permanently stunted cognitive capacities.",
    question: "What is the primary message of this passage?",
    options: [
      "Infants sleep for one thousand days",
      "Early malnutrition permanently damages childhood brain development",
      "Proteins are found in meat and eggs",
      "Pediatricians work in regional hospitals"
    ],
    answer: "Early malnutrition permanently damages childhood brain development",
    hint: "Extract the core medical reality asserted in sentence 1.",
    solution: "The essential proposition is that early malnutrition causes permanent neurological and cognitive impairment in children.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Constructing concrete sea defense revetments halts coastal erosion. In communities like Keta and Ada, massive boulder barricades have successfully stabilized receding coastlines against heavy Atlantic breakers.",
    question: "In summarizing this excerpt, why must the towns of 'Keta and Ada' be omitted?",
    options: [
      "Because Keta and Ada are located on the coast",
      "Because specific community names are geographic illustrations that pad summaries",
      "Because the sea defense walls broke down",
      "Because the author lives in Keta"
    ],
    answer: "Because specific community names are geographic illustrations that pad summaries",
    hint: "Specific geographic location names serve as local evidence rather than the central proposition.",
    solution: "Naming specific settlements (Keta, Ada) provides local proof; summaries discard specific place names to state the general principle.",
    target: "Pruning Geographic Examples"
  },
  {
    passage: "Regular physical stretching enhances joint mobility. Physiotherapists note that performing daily hamstring and shoulder stretches increases synovial fluid secretion, preventing arthritis in advancing age.",
    question: "What represents the supporting biological explanation in this text?",
    options: [
      "Stretching improves joint mobility",
      "The technical detail regarding synovial fluid secretion and arthritis prevention",
      "The human body's skeletal framework",
      "The importance of daily physical exercise"
    ],
    answer: "The technical detail regarding synovial fluid secretion and arthritis prevention",
    hint: "Differentiate the main claim from the internal biological mechanism.",
    solution: "Synovial fluid secretion is the biological mechanism supporting the claim that stretching enhances joint mobility.",
    target: "Pruning Biological Mechanisms"
  },
  {
    passage: "Mangrove forests are vital planetary carbon sinks. Scientific measurements reveal that one hectare of coastal mangrove wetlands sequesters four times more atmospheric carbon than an equivalent area of terrestrial rainforest.",
    question: "What core thesis must be captured in a summary of this text?",
    options: [
      "Mangroves are exceptional at absorbing and storing atmospheric carbon",
      "Terrestrial rainforests do not absorb any carbon dioxide",
      "One hectare contains ten thousand square meters",
      "Mangrove wood is harvested for charcoal production"
    ],
    answer: "Mangroves are exceptional at absorbing and storing atmospheric carbon",
    hint: "Focus on the macro-claim regarding carbon absorption, bypassing the exact comparative ratios.",
    solution: "The macro-proposition is that mangroves are powerful carbon sinks; the four-fold comparative metric is supporting evidence.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Indiscriminate bush burning destroys soil fertility. The intense heat incinerates organic leaf mulch, kills beneficial nitrifying earthworms, and volatilizes vital nitrogen gas into the atmosphere.",
    question: "Which of the following is an illustrative list that should be condensed in a summary?",
    options: [
      "The claim that bush burning ruins soil fertility",
      "The detailed breakdown of burning mulch, killing earthworms, and volatilizing nitrogen",
      "The practice of farming during dry season",
      "The concept of agricultural soil"
    ],
    answer: "The detailed breakdown of burning mulch, killing earthworms, and volatilizing nitrogen",
    hint: "Identify the list of specific biological damage mechanisms.",
    solution: "The itemized consequences (mulch, earthworms, volatilization) explain how fertility is lost; in a summary, they are condensed into 'destroys soil fertility.'",
    target: "Pruning Itemized Mechanisms"
  },
  {
    passage: "Civic volunteerism strengthens community resilience. When residents clean communal drains, repair neighborhood footbridges, and organize security watch patrols without government pay, communities become safer and cleaner.",
    question: "What is the overarching thesis of this passage?",
    options: [
      "Residents should clean gutters on Saturday mornings",
      "Civic volunteerism enhances community strength and safety",
      "Government refuses to pay civil servants",
      "Footbridges must be built with timber"
    ],
    answer: "Civic volunteerism enhances community strength and safety",
    hint: "Identify the central social assertion that opens the excerpt.",
    solution: "Sentence 1 states the thesis: volunteerism strengthens resilience. The activities (clearing drains, footbridges, patrols) illustrate civic actions.",
    target: "Thesis Identification"
  },
  {
    passage: "Reforestation replenishes depleted groundwater aquifers. Deep tree roots perforate compacted soil, creating permeable drainage fissures that allow torrential monsoon rains to percolate into underground aquifers.",
    question: "What technical detail should be pruned in a concise summary?",
    options: [
      "Reforestation restores underground water aquifers",
      "The anatomical description of roots perforating soil to create permeable fissures",
      "The value of planting trees",
      "The existence of groundwater"
    ],
    answer: "The anatomical description of roots perforating soil to create permeable fissures",
    hint: "Identify the mechanical description of root penetration.",
    solution: "Describing how roots perforate soil to create drainage fissures explains the process; the main point is that reforestation restores groundwater.",
    target: "Pruning Mechanical Descriptions"
  },
  {
    passage: "Excessive consumption of refined sugar fuels pediatric obesity. Nutrition surveys indicate that children who consume two cans of carbonated soda daily ingest over fifty grams of empty calories, leading to rapid adipose accumulation.",
    question: "What is the core health proposition of this passage?",
    options: [
      "Carbonated soda is packaged in metal cans",
      "Refined sugar consumption drives childhood obesity",
      "Adipose tissue is necessary for human survival",
      "Nutritionists conduct surveys in primary schools"
    ],
    answer: "Refined sugar consumption drives childhood obesity",
    hint: "Extract the causal link between sugar and childhood weight gain.",
    solution: "The core proposition is that sugar consumption causes pediatric obesity; the soda statistics and gram measurements are supporting data.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Digital mobile banking expands rural financial inclusion. Smallholder cocoa farmers can now deposit earnings, transfer remittances, and access micro-crop insurance directly via mobile phones without visiting distant urban banking halls.",
    question: "Which portion represents subordinate operational examples?",
    options: [
      "Mobile banking enhances financial inclusion in rural areas",
      "Specific mobile transactions like depositing earnings, transferring remittances, and micro-insurance",
      "The importance of rural banking halls",
      "The role of mobile phones in modern life"
    ],
    answer: "Specific mobile transactions like depositing earnings, transferring remittances, and micro-insurance",
    hint: "Lists of specific banking transactions illustrate the broader concept of financial inclusion.",
    solution: "The list of transactions (deposits, remittances, insurance) illustrates financial inclusion; in a summary, the general principle suffices.",
    target: "Pruning Operational Lists"
  },
  {
    passage: "Untreated industrial sewage poisons aquatic ecosystems. Effluents loaded with heavy metals like lead and cadmium wipe out river fish and render water bodies toxic for downstream human use.",
    question: "What is the primary message of this text?",
    options: [
      "Lead and cadmium are heavy metals",
      "Untreated industrial sewage devastates water bodies and marine life",
      "Fish are sensitive to heavy metals",
      "Factories operate in industrial zones"
    ],
    answer: "Untreated industrial sewage devastates water bodies and marine life",
    hint: "Focus on the macro-assertion regarding industrial pollution.",
    solution: "The central proposition is that untreated industrial waste destroys aquatic ecosystems and poisons water; specific chemical names are secondary.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Strict building codes prevent structural building collapses during earthquakes. Engineers mandate reinforced concrete beams, ductile steel rebar, and deep bedrock pilings in seismically active geological zones.",
    question: "In drafting a summary, what is the status of 'reinforced concrete beams and ductile steel rebar'?",
    options: [
      "They are the primary thesis of the text",
      "They are specific engineering materials illustrating the enforcement of building codes",
      "They are historical details from nineteenth-century architecture",
      "They are unnecessary grammatical errors"
    ],
    answer: "They are specific engineering materials illustrating the enforcement of building codes",
    hint: "Identify how concrete beams and rebar relate to building codes.",
    solution: "Specific building materials illustrate how strict building codes are enforced; the core claim is that building codes prevent structural collapses.",
    target: "Pruning Material Specifications"
  },
  {
    passage: "Public libraries foster lifelong community literacy. They provide free access to diverse literature, quiet study environments, and adult reading classes for individuals of all socioeconomic backgrounds.",
    question: "What is the central assertion of this paragraph?",
    options: [
      "Libraries provide quiet study desks",
      "Public libraries promote community literacy across all social classes",
      "Adults attend evening classes in libraries",
      "Books are arranged alphabetically on wooden shelves"
    ],
    answer: "Public libraries promote community literacy across all social classes",
    hint: "Identify the opening thesis asserting the public value of libraries.",
    solution: "The topic sentence asserts that libraries foster lifelong literacy; the specific services (literature, desks, adult classes) illustrate this claim.",
    target: "Thesis Identification"
  },
  {
    passage: "Over-reliance on synthetic nitrogen fertilizers degrades soil microbial health. While chemical pellets provide a temporary surge in crop greenness, they acidify the topsoil over time, killing off earthworms and beneficial bacteria.",
    question: "What core warning is communicated in this text?",
    options: [
      "Chemical pellets make crops turn bright green",
      "Synthetic nitrogen fertilizers harm long-term soil health",
      "Earthworms consume synthetic nitrogen pellets",
      "Farmers should apply fertilizers weekly"
    ],
    answer: "Synthetic nitrogen fertilizers harm long-term soil health",
    hint: "Extract the primary environmental consequence of overusing synthetic fertilizers.",
    solution: "The macro-proposition is that synthetic nitrogen fertilizers damage soil health; the details about acidification and earthworms explain how.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Compulsory primary education eradicates generational illiteracy. In nations where eight years of primary schooling was made legally mandatory, national adult literacy rates rose above ninety percent within two decades.",
    question: "What represents illustrative statistical evidence in this excerpt?",
    options: [
      "Compulsory primary education wipes out generational illiteracy",
      "The mention of eight years of mandatory schooling and adult literacy rising above ninety percent",
      "The definition of primary schooling",
      "The concept of national illiteracy"
    ],
    answer: "The mention of eight years of mandatory schooling and adult literacy rising above ninety percent",
    hint: "Identify the empirical metrics illustrating the broader educational principle.",
    solution: "The specific figures ('eight years', 'ninety percent in two decades') serve as supporting historical evidence for the main claim.",
    target: "Pruning Statistical Evidence"
  },
  {
    passage: "Boiling home drinking water eliminates deadly biological pathogens. Bringing water to a rolling boil for five minutes destroys bacteria, viral particles, and amoebic cysts, preventing debilitating waterborne illnesses like cholera.",
    question: "What is the primary instructional takeaway of this excerpt?",
    options: [
      "Water should be boiled in metal kettles",
      "Boiling water effectively neutralizes harmful pathogens to prevent disease",
      "Cholera is caused by amoebic cysts",
      "Pathogens multiply rapidly when water is heated"
    ],
    answer: "Boiling water effectively neutralizes harmful pathogens to prevent disease",
    hint: "Focus on the primary health action and its direct benefit.",
    solution: "The central proposition is that boiling water destroys dangerous pathogens; the duration and specific pathogen types are supporting details.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Crop rotation disrupts agricultural pest cycles. When farmers alternate maize crops with nitrogen-fixing cowpeas each season, stem-borer larvae starve because their specific host crop is removed from the field.",
    question: "Which portion constitutes subordinate biological detail?",
    options: [
      "Crop rotation breaks agricultural pest cycles",
      "The detailed explanation of stem-borer larvae starving when maize is alternated with cowpeas",
      "The practice of seasonal crop planting",
      "The existence of agricultural pests"
    ],
    answer: "The detailed explanation of stem-borer larvae starving when maize is alternated with cowpeas",
    hint: "Identify the specific pest species and crop pairing used to explain the concept.",
    solution: "The stem-borer and maize/cowpea example illustrates how the pest cycle breaks; the core thesis is that crop rotation disrupts pest cycles.",
    target: "Pruning Illustrative Details"
  },
  {
    passage: "Regular cardiovascular exercise lowers resting arterial blood pressure. Aerobic workouts like brisk walking, cycling, and swimming expand blood vessels and reduce muscular strain on the heart during circulation.",
    question: "What is the main thesis of this excerpt?",
    options: [
      "Swimming is an enjoyable weekend pastime",
      "Cardiovascular exercise reduces resting blood pressure",
      "Blood vessels expand during hot weather",
      "Walking requires athletic running shoes"
    ],
    answer: "Cardiovascular exercise reduces resting blood pressure",
    hint: "Extract the central physiological claim opening the paragraph.",
    solution: "Sentence 1 is the main thesis: exercise lowers blood pressure. The specific sports (walking, cycling, swimming) are itemized examples.",
    target: "Thesis Identification"
  },
  {
    passage: "Preserving primary tropical rainforests stabilizes global climate patterns. Vast forest canopies absorb millions of tons of greenhouse gases annually, regulate precipitation cycles, and prevent terrestrial temperatures from rising.",
    question: "In a summary, what is the role of sentence 2 ('Vast forest canopies absorb...')?",
    options: [
      "It contradicts sentence 1",
      "It provides explanatory details showing how rainforests stabilize climate",
      "It introduces an unrelated geological theory",
      "It represents a personal opinion of the author"
    ],
    answer: "It provides explanatory details showing how rainforests stabilize climate",
    hint: "Examine how absorbing gases and regulating precipitation support the main thesis.",
    solution: "Sentence 2 explains the mechanisms of climate stabilization, acting as supporting elaboration for the main claim in sentence 1.",
    target: "Textual Architecture Analysis"
  },
  {
    passage: "Routine immunizations safeguard infants against debilitating viral contagions. Administering oral polio drops, measles shots, and hepatitis vaccines guarantees life-long antibody protection against crippling childhood illnesses.",
    question: "Which of the following represents an illustrative list to be pruned in a summary?",
    options: [
      "Routine immunizations protect infants from serious viral diseases",
      "The specific list of oral polio drops, measles shots, and hepatitis vaccines",
      "The concept of childhood healthcare",
      "The importance of pediatric clinics"
    ],
    answer: "The specific list of oral polio drops, measles shots, and hepatitis vaccines",
    hint: "Identify the list of individual vaccine medications.",
    solution: "Listing specific vaccines (polio, measles, hepatitis) provides illustrative medical detail; in a summary, the category 'immunizations' is sufficient.",
    target: "Pruning Itemized Lists"
  },
  {
    passage: "Excessive vehicular exhaust emissions exacerbate urban respiratory illnesses. Dense clouds of uncombusted soot, carbon monoxide, and sulfur dioxide from congested traffic corridors trigger acute asthma attacks and chronic bronchitis in pedestrians.",
    question: "What core environmental health proposition is communicated in this text?",
    options: [
      "Vehicular exhaust fumes worsen urban respiratory illnesses",
      "Carbon monoxide is an odorless gas",
      "Pedestrians should wear running shoes on highways",
      "Traffic congestion occurs during rush hour"
    ],
    answer: "Vehicular exhaust fumes worsen urban respiratory illnesses",
    hint: "Focus on the macro-claim linking exhaust fumes to respiratory health.",
    solution: "The main thesis is that vehicular exhaust triggers respiratory disease; the specific chemical compounds and clinical terms are supporting details.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Installing solar-powered water heaters curtails domestic energy expenditures. Rooftop solar thermal collectors absorb natural sunlight to heat household water directly, reducing reliance on expensive electric geysers by up to seventy percent.",
    question: "What is the primary message of this passage?",
    options: [
      "Electric geysers are manufactured in factories",
      "Solar water heaters significantly lower domestic energy costs",
      "Rooftops are constructed from corrugated iron sheets",
      "Sunlight is warm during the dry season"
    ],
    answer: "Solar water heaters significantly lower domestic energy costs",
    hint: "Extract the economic claim asserted in sentence 1.",
    solution: "The main thesis is that solar water heaters reduce household energy bills; the seventy-percent savings figure is supporting evidence.",
    target: "Thesis Identification"
  },
  {
    passage: "Indiscriminate disposal of polythene bags creates recurring urban drainage disasters. When monsoon downpours arrive, thousands of discarded plastic wrappers choke storm drains, causing catastrophic flash floods in low-lying commercial basins.",
    question: "What core relationship must be preserved in a summary sentence?",
    options: [
      "Plastic waste blocks storm drains and triggers urban flooding",
      "Monsoon rains occur during specific calendar months",
      "Low-lying basins have active commercial stores",
      "Polythene bags are manufactured from petrochemicals"
    ],
    answer: "Plastic waste blocks storm drains and triggers urban flooding",
    hint: "Connect discarded plastic to blocked drains and resulting flood disasters.",
    solution: "The essential causal proposition is that discarded plastics clog storm drains and cause urban flooding.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Cover cropping protects agricultural topsoil from torrential rainfall erosion. Planting low-growing mucuna beans or cowpeas forms a dense green carpet that cushions the impact of descending raindrops and holds loose soil particles firmly in place.",
    question: "Which element represents subordinate botanical detail?",
    options: [
      "Cover cropping prevents agricultural soil erosion",
      "The specific mention of planting mucuna beans or cowpeas to form a green carpet",
      "The concept of soil conservation",
      "The danger of heavy rainfall"
    ],
    answer: "The specific mention of planting mucuna beans or cowpeas to form a green carpet",
    hint: "Identify the specific plant names and visual descriptions illustrating the practice.",
    solution: "Naming mucuna beans and describing a green carpet illustrates how cover cropping works; the core claim is that cover cropping stops erosion.",
    target: "Pruning Botanical Details"
  },
  {
    passage: "Early detection of ocular glaucoma preserves vision in aging adults. Routine annual eye pressure measurements enable optometrists to prescribe optic nerve drops before irreversible blindness ensues.",
    question: "What is the primary health thesis of this excerpt?",
    options: [
      "Optometrists use specialized diagnostic tools",
      "Early detection of glaucoma prevents permanent vision loss",
      "Aging adults experience difficulty walking",
      "Eye drops are liquid medications"
    ],
    answer: "Early detection of glaucoma prevents permanent vision loss",
    hint: "Identify the main medical claim asserted in the first sentence.",
    solution: "The overarching proposition is that early detection of glaucoma saves sight; the procedural details about pressure measurements are secondary.",
    target: "Thesis Identification"
  },
  {
    passage: "Industrial timber logging fragments primary wildlife habitats. When logging roads slice through pristine forest canopies, arboreal primates such as colobus monkeys cannot cross between forest patches to forage for food.",
    question: "What core ecological claim should be extracted for a summary?",
    options: [
      "Logging roads are unpaved dirt tracks",
      "Industrial timber logging fragments wildlife habitats",
      "Colobus monkeys live high in forest canopies",
      "Arboreal primates feed on forest berries"
    ],
    answer: "Industrial timber logging fragments wildlife habitats",
    hint: "Extract the central environmental premise, ignoring specific primate examples.",
    solution: "The main thesis is that industrial logging fragments wildlife habitats; the colobus monkey example illustrates the consequence.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Organic mulching conserves precious soil moisture in vegetable gardens. Spreading a ten-centimeter layer of dry grass cuttings over garden beds suppresses surface evaporation and keeps soil roots cool during blistering dry spells.",
    question: "Which of the following is non-essential illustrative padding?",
    options: [
      "Mulching conserves soil moisture in gardens",
      "The specific thickness measurement of ten centimeters and naming dry grass cuttings",
      "The importance of vegetable farming",
      "The concept of garden moisture"
    ],
    answer: "The specific thickness measurement of ten centimeters and naming dry grass cuttings",
    hint: "Look for specific metric measurements and ingredient choices.",
    solution: "The ten-centimeter measurement and dry grass specification are practical gardening details; the core thesis is that mulching preserves moisture.",
    target: "Pruning Metric Details"
  },
  {
    passage: "Universal immunization eradicates lethal childhood communicable infections. In medical history, the systematic worldwide administration of the bifurcated needle vaccine eradicated smallpox completely from the face of the Earth.",
    question: "What is the central proposition of this text?",
    options: [
      "Bifurcated needles are made of surgical steel",
      "Universal immunization successfully eradicates deadly childhood contagions",
      "Smallpox left scars on human skin",
      "Medical history is taught in universities"
    ],
    answer: "Universal immunization successfully eradicates deadly childhood contagions",
    hint: "Separate the overarching thesis from the historical smallpox eradication example.",
    solution: "The main thesis is that universal immunization eliminates deadly diseases; the smallpox eradication campaign is historical evidence.",
    target: "Thesis Identification"
  },
  {
    passage: "Acoustic insulation reduces noise pollution in modern residential apartments. Installing double-glazed window panes and acoustic ceiling tiles dampens intrusive street traffic rumble by up to thirty-five decibels.",
    question: "What is the core architectural claim in this passage?",
    options: [
      "Double-glazed windows are manufactured from heavy glass",
      "Acoustic insulation effectively curbs residential noise pollution",
      "Street traffic rumble is thirty-five decibels loud",
      "Apartment buildings have ceiling tiles"
    ],
    answer: "Acoustic insulation effectively curbs residential noise pollution",
    hint: "Extract the primary functional benefit of acoustic insulation.",
    solution: "Sentence 1 states the thesis: acoustic insulation dampens noise pollution. The materials and decibel reduction figures serve as technical elaboration.",
    target: "Core Proposition Extraction"
  },
  {
    passage: "Adopting agroforestry systems regenerates depleted agricultural landscapes. Integrating indigenous nitrogen-fixing acacia trees with cereal crops restores topsoil fertility, shelters companion crops from scorching winds, and yields valuable fuelwood.",
    question: "Which portion constitutes supporting operational elaboration?",
    options: [
      "Agroforestry systems regenerate degraded agricultural landscapes",
      "The itemized benefits of planting acacia trees to restore fertility, block winds, and produce fuelwood",
      "The practice of farming cereal crops",
      "The reality of land degradation"
    ],
    answer: "The itemized benefits of planting acacia trees to restore fertility, block winds, and produce fuelwood",
    hint: "Identify the list of specific agronomic benefits derived from acacia trees.",
    solution: "The list of benefits (fertility, wind protection, fuelwood) explains how agroforestry works, supporting the main claim that it regenerates landscapes.",
    target: "Pruning Operational Elaboration"
  },
  {
    passage: "Prompt municipal waste evacuation averts lethal cholera outbreaks in urban centers. When refuse transfer stations are cleared daily before organic decomposition begins, disease-carrying houseflies and rodents cannot multiply to contaminate community food stalls.",
    question: "What is the central public health thesis of this excerpt?",
    options: [
      "Houseflies and rodents carry infectious diseases",
      "Prompt waste evacuation prevents deadly cholera outbreaks",
      "Refuse transfer stations smell unpleasant",
      "Community food stalls sell hot cooked meals"
    ],
    answer: "Prompt waste evacuation prevents deadly cholera outbreaks",
    hint: "Extract the primary causal relationship between waste evacuation and disease prevention.",
    solution: "Sentence 1 states the core thesis: timely waste removal stops cholera. The biological mechanism regarding flies and rodents is supporting detail.",
    target: "Thesis Identification"
  },
  {
    passage: "Digital speed cameras curb reckless vehicular speeding along national highways. Highway police data proved that fatal speed-related collisions fell by forty percent within six months of installing speed radars on the Accra-Cape Coast corridor.",
    question: "In summarizing this passage, which elements represent illustrative evidence that should be pruned?",
    options: [
      "The assertion that digital speed cameras reduce speeding",
      "The forty percent reduction figure and the specific mention of the Accra-Cape Coast corridor",
      "The concept of highway vehicular safety",
      "The phrase 'reckless vehicular speeding'"
    ],
    answer: "The forty percent reduction figure and the specific mention of the Accra-Cape Coast corridor",
    hint: "Look for the specific percentage stat and the named geographic highway corridor.",
    solution: "The statistical percentage (40%) and highway name (Accra-Cape Coast) are empirical evidence and must be omitted from a concise summary.",
    target: "Pruning Statistical & Geographic Evidence"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CASSAVA PROCESSING PASSAGE (51 TO 55)
// =========================================================================
const capstone5B9FoundationQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 1, what physiological process ruins fresh cassava tubers within forty-eight hours of harvest?",
    options: [
      "Bacterial soft rot caused by soil bacteria",
      "Enzymatic vascular streaking",
      "Excessive sugar crystallization",
      "Dehydration from bright sunlight"
    ],
    answer: "Enzymatic vascular streaking",
    hint: "Scan paragraph 1 for the two-word physiological term ending in '-ing'.",
    solution: "Paragraph 1 explicitly identifies 'enzymatic vascular streaking within forty-eight hours' as the cause of spoilage.",
    target: "Capstone Exam: Literal Fact Retrieval"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what toxic chemical compound is expelled by fermenting grated cassava under heavy stones?",
    options: [
      "Hydrochloric acid",
      "Volatile hydrocyanic acid",
      "Sulfuric acid",
      "Nitric acid"
    ],
    answer: "Volatile hydrocyanic acid",
    hint: "Scan paragraph 2 for the chemical compound name following 'volatile'.",
    solution: "Paragraph 2 states that fermentation expels 'volatile hydrocyanic acid toxins'.",
    target: "Capstone Exam: Technical Retrieval"
  },
  {
    questionNumber: 53,
    question: "In evaluating paragraph 2 for a summary, which of the following represents illustrative detail that MUST be pruned?",
    options: [
      "The reality that smallholders rely on artisanal processing",
      "The detailed procedure of grating on perforated metal sheets, pressing with stones, and roasting over firewood",
      "The health hazard of carbon monoxide inhalation",
      "The term 'artisanal processing'"
    ],
    answer: "The detailed procedure of grating on perforated metal sheets, pressing with stones, and roasting over firewood",
    hint: "Identify the mechanical, step-by-step cooking description of traditional gari making.",
    solution: "The physical mechanics of gari roasting (metal sheets, stones, firewood hearths) are procedural illustrations that must be pruned in summaries.",
    target: "Capstone Exam: Pruning Procedural Details"
  },
  {
    questionNumber: 54,
    question: "As used in paragraph 3, what does the word 'substitution' mean ('national import substitution')?",
    options: [
      "Replacing imported foreign goods with locally produced domestic products",
      "Exporting unprocessed raw materials abroad for free",
      "Banning all commercial bakeries and supermarkets",
      "Increasing foreign currency loans from international banks"
    ],
    answer: "Replacing imported foreign goods with locally produced domestic products",
    hint: "Notice how cassava flour replaces expensive imported wheat flour.",
    solution: "In macroeconomic policy, 'import substitution' means producing domestic alternatives to replace costly imported foreign commodities.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary intervention required to modernize cassava processing in paragraph 4.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Government must establish mechanized solar processing clusters.",
      "Establishing mechanized solar processing clusters and providing working capital to cooperatives.",
      "Because cassava rots quickly, authorities should definitely build modern factories in all villages.",
      "Modernizing cassava processing."
    ],
    answer: "Government must establish mechanized solar processing clusters.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Government must establish mechanized solar processing clusters' is exactly 7 words, possesses complete Subject-Verb-Object syntax, and answers the prompt directly. Option B is a participial fragment (0 marks).",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB9Foundation() {
  console.log("Building 55 UNIQUE questions for Basic 9 Foundation...");
  const db = await getDb();

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50B9FoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_F_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B9.2.2.1: Isolate primary macro-propositions, prune subordinate illustrative padding, and identify thesis claims."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9FoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${cassavaProcessingFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_F_${item.questionNumber}`,
      level: "B9",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: cassavaProcessingFullPassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.2.2.1: Multi-paragraph macro-proposition extraction, pruning procedural details, and constrained 8-word summary formulation."
    });
  });

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  // 3. Write to subcollection B9_foundation across all paths
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B9_foundation`);
    await targetDoc.set({
      level: "B9",
      difficulty: "foundation",
      title: "Basic 9 Foundation Lab: 50 Unique Summary Pruning Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (Pruning Illustrative Details) + 5 Capstone Full-Passage Questions",
        passageVisibility: "Passage embedded both in passageText and at the top of prompt",
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${targetDoc.path}`);
  }

  // 4. Synchronize into main topical document practicePool.low for TopicalLabRunner (level: b9)
  console.log("\nSynchronizing main topical document practicePool.low for b9 (keeping b7, b8, b9 only)...");
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
      
      const cleanLevels: Record<string, any> = {
        b7: existingLevels.b7 || {},
        b8: existingLevels.b8 || {},
        b9: {
          ...(existingLevels.b9 || {}),
          practicePool: {
            ...(existingLevels.b9?.practicePool || {}),
            low: mappedLowQuestions
          }
        }
      };

      const { questions, ...cleanData } = data;

      await mainRef.set({
        ...cleanData,
        levels: cleanLevels,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated main document practicePool.low for b9 at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B9 Foundation!`);
}

deployUniqueB9Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B9 Foundation:", err);
    process.exit(1);
  });

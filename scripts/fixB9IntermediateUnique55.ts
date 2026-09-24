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
// =========================================================================
const densuBasinFullPassage = 
`Meandering over one hundred and sixteen kilometers from the verdant Atewa Range to the Gulf of Guinea, the Densu River constitutes the indispensable ecological lifeline for the metropolitan population of western Accra. Impounded at the Weija Dam in 1978, the reservoir impoundment processes and delivers over forty million gallons of treated drinking water daily to approximately two million urban residents. In addition to powering municipal water grids, the lower river delta sustains lucrative tilapia aquaculture and supports expansive vegetable farming irrigation schemes along the coastal littoral.

However, unchecked anthropogenic encroachment along the riparian corridor has triggered acute ecological degradation. Commercial stone-quarrying concessions on the adjacent Weija hills blast fragile slopes with dynamite, releasing tons of loose granite silt that wash directly into the reservoir during torrential rains. Simultaneously, unregulated residential developers have encroached upon the statutory buffer zones, discharging untreated domestic sewage and septic overflow into feeder tributaries. Heavy siltation has dramatically reduced the reservoir's water-holding capacity, compelling dam engineers to execute emergency floodwater spillages during monsoon downpours that inundate downstream communities.

Compounding this hydrological crisis is the heavy inflow of chemical agro-pollutants from upstream pineapple and vegetable plantations. Intensive runoff of organophosphate pesticides and synthetic nitrate fertilizers has stimulated explosive algal blooms and the rapid proliferation of invasive water hyacinths across the lake surface. These aquatic weeds carpet the water, blocking sunlight penetration, suffocating benthic fish species, and forcing the Ghana Water Company Limited to spend millions of cedis on imported water-clarifying aluminum sulfate and chlorine reagents to render the water potable.

Reversing this environmental hemorrhage demands aggressive, multi-sectoral watershed governance. The Ministry of Sanitation and Water Resources must partner with traditional custodians to evict illegal developers from the statutory riparian reservation. Constructing protective vegetative green belts along the banks, banning unauthorized quarrying within three kilometers of the reservoir, and enforcing statutory wastewater treatment standards will safeguard this vital aquatic artery for generations to come.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B9IntermediateDrills = [
  {
    passage: "Text: 'Municipal authorities must enforce strict hygiene standards in public food markets to prevent lethal outbreaks of waterborne cholera.'",
    question: "Which of the following demonstrates an active, grammatically complete summary sentence?",
    options: [
      "Strict hygiene standards in public food markets.",
      "Enforcing standards to prevent waterborne cholera.",
      "Authorities must enforce market hygiene standards.",
      "Because cholera is lethal in public markets."
    ],
    answer: "Authorities must enforce market hygiene standards.",
    hint: "Ensure the sentence contains an active Subject, Finite Verb, and Object.",
    solution: "Option C has a complete grammatical Subject ('Authorities'), Modal Finite Verb ('must enforce'), and Object ('market hygiene standards'). Options A, B, and D are fragments.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The government ought to invest aggressively in solar energy infrastructure to reduce national dependence on imported fossil fuels.'",
    question: "Which option provides a valid, grammatically complete summary sentence?",
    options: [
      "Government must invest in solar energy.",
      "Investing aggressively in solar energy infrastructure.",
      "Solar infrastructure instead of imported fossil fuels.",
      "To reduce national dependence on fuels."
    ],
    answer: "Government must invest in solar energy.",
    hint: "Identify the option with an active Subject and Finite Verb.",
    solution: "'Government must invest in solar energy' is a complete grammatical sentence. The other options are noun phrases or infinitive fragments.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Agricultural extension officers should train peasant farmers in organic composting techniques to restore depleted soil fertility.'",
    question: "Which option represents a properly encoded active summary sentence?",
    options: [
      "Training peasant farmers in organic composting techniques.",
      "Officers must train farmers in composting.",
      "Organic composting for depleted soil fertility.",
      "Depleted soil fertility restoration."
    ],
    answer: "Officers must train farmers in composting.",
    hint: "Check for the presence of a finite verb ('must train') agreeing with a subject ('Officers').",
    solution: "Option B provides an active grammatical architecture: Subject ('Officers') + Verb ('must train') + Object ('farmers in composting').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The highway authority must install digital speed-monitoring cameras on accident-prone highways to curb reckless driving.'",
    question: "Which of the following is a grammatically complete summary statement?",
    options: [
      "Authorities must install speed cameras on highways.",
      "Speed cameras on accident-prone highways.",
      "Installing digital speed-monitoring cameras to curb speeding.",
      "Because reckless drivers speed on highways."
    ],
    answer: "Authorities must install speed cameras on highways.",
    hint: "Look for an explicit Subject paired with a Finite Verb.",
    solution: "Option A forms a complete grammatical sentence ('Authorities must install speed cameras on highways'). The others are fragments.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Community water boards should drill mechanized boreholes to provide rural inhabitants with reliable potable water.'",
    question: "Which option constitutes a valid grammatical summary?",
    options: [
      "Boards should drill mechanized rural boreholes.",
      "Drilling mechanized boreholes for rural inhabitants.",
      "Reliable potable water from mechanized boreholes.",
      "For providing rural inhabitants with water."
    ],
    answer: "Boards should drill mechanized rural boreholes.",
    hint: "Avoid participial phrases ('Drilling...') and choose a complete finite clause.",
    solution: "Option A is a complete active sentence with an auxiliary and main verb ('should drill').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Public health agencies must vaccinate livestock against anthrax to prevent zoonotic contagion in pastoral grazing settlements.'",
    question: "Which candidate summary demonstrates complete Subject-Verb-Object architecture?",
    options: [
      "Agencies must vaccinate livestock against anthrax.",
      "Vaccinating livestock against dangerous anthrax contagions.",
      "Anthrax prevention in pastoral grazing settlements.",
      "To prevent zoonotic contagion in livestock."
    ],
    answer: "Agencies must vaccinate livestock against anthrax.",
    hint: "Select the sentence with an active Subject ('Agencies') and finite modal verb ('must vaccinate').",
    solution: "Option A is grammatically complete. Options B and D are verb fragments, while Option C is a noun phrase.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The ministry of education should construct modern science laboratories in rural secondary schools to promote STEM education.'",
    question: "Which sentence accurately and grammatically encodes this educational policy?",
    options: [
      "Ministry must build rural science laboratories.",
      "Constructing modern science laboratories in rural schools.",
      "Modern science laboratories for STEM education.",
      "Because rural secondary schools need science."
    ],
    answer: "Ministry must build rural science laboratories.",
    hint: "Check for the presence of a finite verb ('must build') with an explicit subject.",
    solution: "'Ministry must build rural science laboratories' is an active, complete grammatical clause with finite verb syntax.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Forestry rangers ought to arrest illegal loggers operating inside protected wildlife reserves to preserve endangered tree species.'",
    question: "Which option represents a grammatically complete summary statement?",
    options: [
      "Rangers must arrest illegal forest loggers.",
      "Arresting illegal loggers inside protected wildlife reserves.",
      "Protected wildlife reserves and endangered tree species.",
      "To preserve endangered tree species from loggers."
    ],
    answer: "Rangers must arrest illegal forest loggers.",
    hint: "Look for the complete clause: Subject ('Rangers') + Verb ('must arrest') + Object ('loggers').",
    solution: "Option A contains an explicit Subject and Finite Verb, avoiding participial fragment penalties.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'District assemblies should pave rural market centers with concrete blocks to eliminate mud hazards during rainy seasons.'",
    question: "Which candidate sentence satisfies standard summary grammar rules?",
    options: [
      "Assemblies should pave rural market centers.",
      "Paving rural market centers with concrete blocks.",
      "Concrete blocks to eliminate mud hazards.",
      "During rainy seasons in rural market centers."
    ],
    answer: "Assemblies should pave rural market centers.",
    hint: "Identify the sentence that possesses an active finite verb rather than a participle.",
    solution: "Option A features Subject ('Assemblies') + Modal Auxiliary & Verb ('should pave') + Object ('market centers').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Fisheries commissions must prohibit monofilament fine-mesh nets to prevent the collapse of pelagic marine fish breeding cycles.'",
    question: "Which candidate represents a complete, grammatically sound summary?",
    options: [
      "Commissions must prohibit fine-mesh fishing nets.",
      "Prohibiting monofilament fine-mesh nets in marine waters.",
      "Fine-mesh fishing nets and marine breeding cycles.",
      "In order to prevent the collapse of fish."
    ],
    answer: "Commissions must prohibit fine-mesh fishing nets.",
    hint: "Ensure the sentence contains an active subject and finite verb.",
    solution: "Option A is a complete active sentence. Options B, C, and D lack finite verbs and receive zero marks in exam summaries.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Urban planning departments must dredge natural drainage canals before monsoon rains begin to prevent severe street flooding.'",
    question: "Which summary formulation is encoded into a complete grammatical sentence?",
    options: [
      "Planners must dredge urban drainage canals.",
      "Dredging natural drainage canals before monsoon rains.",
      "Natural drainage canals to prevent street flooding.",
      "Before monsoon rains begin in urban centers."
    ],
    answer: "Planners must dredge urban drainage canals.",
    hint: "Select the option with an explicit subject and finite verb.",
    solution: "Option A provides an active Subject-Verb-Object architecture ('Planners must dredge urban drainage canals').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Veterinary officers ought to quarantine infected poultry flocks immediately to stop the spread of avian influenza across farms.'",
    question: "Which option represents a valid, complete summary sentence?",
    options: [
      "Officers must quarantine infected poultry flocks.",
      "Quarantining infected poultry flocks across farms.",
      "Infected poultry flocks and avian influenza.",
      "To stop the spread of avian influenza."
    ],
    answer: "Officers must quarantine infected poultry flocks.",
    hint: "Look for an explicit grammatical subject paired with a finite verb ('must quarantine').",
    solution: "Option A is grammatically complete, while Option B is a participial fragment and Option D is an infinitive fragment.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The environmental agency should shut down illegal gold smelting workshops to curb toxic mercury emissions into urban atmospheres.'",
    question: "Which candidate sentence avoids grammatical fragment penalties?",
    options: [
      "Agency must close illegal smelting workshops.",
      "Shutting down illegal gold smelting workshops.",
      "Illegal gold smelting workshops and toxic mercury emissions.",
      "To curb toxic mercury emissions into urban air."
    ],
    answer: "Agency must close illegal smelting workshops.",
    hint: "Choose the active clause with Subject + Finite Verb + Object.",
    solution: "'Agency must close illegal smelting workshops' has a finite verb ('must close') and complete clause structure.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Secondary school administrations must install solar panel arrays to lower prohibitive monthly commercial electricity bills.'",
    question: "Which summary sentence demonstrates complete grammatical syntax?",
    options: [
      "Schools must install solar panel arrays.",
      "Installing solar panel arrays in secondary schools.",
      "Solar panel arrays to lower electricity bills.",
      "Because commercial electricity bills are prohibitive."
    ],
    answer: "Schools must install solar panel arrays.",
    hint: "Select the complete independent sentence.",
    solution: "Option A is an independent clause with Subject ('Schools'), Verb ('must install'), and Object ('solar panel arrays').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Agricultural cooperatives should build communal grain silos to protect harvested maize from weevils and rodent destruction.'",
    question: "Which option represents a properly encoded active summary sentence?",
    options: [
      "Cooperatives should construct communal grain silos.",
      "Building communal grain silos for harvested maize.",
      "Communal grain silos against weevils and rodents.",
      "For protecting harvested maize from weevils."
    ],
    answer: "Cooperatives should construct communal grain silos.",
    hint: "Ensure the statement contains a finite verb rather than a participle or prepositional phrase.",
    solution: "Option A uses the finite modal construction 'should construct' with an explicit subject and direct object.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The civil aviation authority must inspect commercial passenger aircraft engines regularly to ensure maximum passenger flight safety.'",
    question: "Which candidate sentence is grammatically complete?",
    options: [
      "Authorities must inspect passenger aircraft engines.",
      "Inspecting commercial passenger aircraft engines regularly.",
      "Commercial aircraft engines and passenger flight safety.",
      "To ensure maximum passenger flight safety."
    ],
    answer: "Authorities must inspect passenger aircraft engines.",
    hint: "Look for an explicit Subject paired with a Finite Verb.",
    solution: "Option A provides complete Subject-Verb-Object syntax ('Authorities must inspect passenger aircraft engines').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The road safety commission ought to repaint faded pedestrian crosswalk markings to protect schoolchildren from speeding traffic.'",
    question: "Which sentence provides an active, grammatically complete summary?",
    options: [
      "Commission must repaint pedestrian crosswalk markings.",
      "Repainting faded pedestrian crosswalk markings.",
      "Pedestrian crosswalk markings to protect schoolchildren.",
      "From speeding traffic near school zones."
    ],
    answer: "Commission must repaint pedestrian crosswalk markings.",
    hint: "Select the option with an active subject and finite verb.",
    solution: "Option A is a complete active sentence. The remaining options are participial, infinitive, and prepositional fragments.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Municipal authorities should establish specialized recycling buy-back depots to encourage households to segregate plastic waste.'",
    question: "Which option constitutes a valid grammatical summary statement?",
    options: [
      "Authorities should create plastic recycling depots.",
      "Establishing specialized recycling buy-back depots.",
      "Specialized recycling depots for household waste.",
      "To encourage households to segregate plastic."
    ],
    answer: "Authorities should create plastic recycling depots.",
    hint: "Look for the finite modal verb ('should create') attached to a subject ('Authorities').",
    solution: "Option A features complete Subject-Verb-Object syntax. The others lack finite verbs.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Agricultural banks ought to provide low-interest credit facilities to outgrower farmers to finance the purchase of certified seeds.'",
    question: "Which candidate represents a properly encoded active summary sentence?",
    options: [
      "Banks must offer low-interest farming credit.",
      "Providing low-interest credit facilities to farmers.",
      "Low-interest credit facilities for certified seeds.",
      "To finance the purchase of certified seeds."
    ],
    answer: "Banks must offer low-interest farming credit.",
    hint: "Identify the sentence with an active subject and finite verb.",
    solution: "'Banks must offer low-interest farming credit' has complete Subject-Verb-Object syntax.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The ministry of communications should expand broadband fiber-optic networks into rural farming hamlets to stimulate e-commerce.'",
    question: "Which summary statement avoids grammatical incompleteness penalties?",
    options: [
      "Ministry must expand rural broadband networks.",
      "Expanding broadband fiber-optic networks into hamlets.",
      "Broadband fiber-optic networks for rural e-commerce.",
      "To stimulate e-commerce in farming hamlets."
    ],
    answer: "Ministry must expand rural broadband networks.",
    hint: "Select the option that can stand alone as an independent grammatical sentence.",
    solution: "Option A is an independent clause with Subject ('Ministry'), Verb ('must expand'), and Object ('rural broadband networks').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Regional hospital administrations must procure backup oxygen generation plants to prevent patient mortality during supply shortages.'",
    question: "Which sentence represents a grammatically complete summary?",
    options: [
      "Hospitals must procure backup oxygen plants.",
      "Procuring backup oxygen generation plants for hospitals.",
      "Backup oxygen plants to prevent patient mortality.",
      "During unexpected clinical supply shortages."
    ],
    answer: "Hospitals must procure backup oxygen plants.",
    hint: "Ensure the sentence contains an active finite verb ('must procure').",
    solution: "Option A is a complete active sentence with an auxiliary and main verb.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Local district assemblies ought to construct ventilated improved pit latrines in public schools to eradicate open defecation.'",
    question: "Which candidate sentence satisfies standard WAEC grammatical rules?",
    options: [
      "Assemblies should build school pit latrines.",
      "Constructing ventilated improved pit latrines in schools.",
      "School pit latrines to eradicate open defecation.",
      "For eradicating open defecation in public schools."
    ],
    answer: "Assemblies should build school pit latrines.",
    hint: "Identify the clause with an explicit subject and finite verb.",
    solution: "Option A is grammatically complete ('Assemblies should build school pit latrines').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The environmental protection agency should revoke the mining permits of alluvial gold dredgers operating inside river channels.'",
    question: "Which option represents a properly encoded active summary sentence?",
    options: [
      "Agency must revoke river mining permits.",
      "Revoking mining permits of alluvial gold dredgers.",
      "River mining permits of alluvial gold dredgers.",
      "Inside protected river channels across the nation."
    ],
    answer: "Agency must revoke river mining permits.",
    hint: "Look for an explicit Subject paired with a Finite Verb.",
    solution: "Option A features Subject ('Agency') + Verb ('must revoke') + Object ('river mining permits').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'National transport authorities should mandate reflective warning tape on heavy cargo haulage trucks to avert rear-end nocturnal crashes.'",
    question: "Which statement represents a complete grammatical summary?",
    options: [
      "Authorities must mandate reflective truck tape.",
      "Mandating reflective warning tape on cargo trucks.",
      "Reflective warning tape for nocturnal cargo trucks.",
      "To avert rear-end nocturnal traffic crashes."
    ],
    answer: "Authorities must mandate reflective truck tape.",
    hint: "Select the sentence with complete Subject-Verb-Object architecture.",
    solution: "Option A is a complete active sentence. The remaining options are participial, noun, and infinitive fragments.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Community health clinics ought to distribute insecticide-treated bed nets to pregnant women to suppress clinical malaria transmission.'",
    question: "Which candidate sentence is encoded into a complete grammatical sentence?",
    options: [
      "Clinics must distribute treated bed nets.",
      "Distributing insecticide-treated bed nets to pregnant women.",
      "Treated bed nets to suppress malaria transmission.",
      "Because pregnant women suffer from malaria."
    ],
    answer: "Clinics must distribute treated bed nets.",
    hint: "Ensure the sentence contains a finite verb rather than a participle or dependent clause.",
    solution: "Option A features Subject ('Clinics') + Verb ('must distribute') + Object ('treated bed nets').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The standards authority should seize expired pharmaceutical drugs from retail chemical shops to safeguard public consumer health.'",
    question: "Which summary statement avoids grammatical fragment penalties?",
    options: [
      "Authority must confiscate expired pharmaceutical drugs.",
      "Seizing expired pharmaceutical drugs from retail shops.",
      "Expired pharmaceutical drugs in retail chemical shops.",
      "To safeguard public consumer health from expired drugs."
    ],
    answer: "Authority must confiscate expired pharmaceutical drugs.",
    hint: "Look for an explicit subject paired with a finite verb ('must confiscate').",
    solution: "Option A is an independent clause with complete Subject-Verb-Object syntax.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Forestry commissions ought to plant vegetative shelterbelts along desert margins to halt the advancing spread of Sahelian sand dunes.'",
    question: "Which sentence provides an active, grammatically complete summary?",
    options: [
      "Commissions must plant vegetative desert shelterbelts.",
      "Planting vegetative shelterbelts along desert margins.",
      "Vegetative shelterbelts against Sahelian sand dunes.",
      "To halt the advancing spread of sand dunes."
    ],
    answer: "Commissions must plant vegetative desert shelterbelts.",
    hint: "Select the complete independent sentence.",
    solution: "Option A is a complete active sentence with an auxiliary and main verb ('must plant').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Municipal sanitation departments should deploy vacuum desludging trucks to evacuate communal public septic tanks regularly.'",
    question: "Which option represents a valid grammatical summary sentence?",
    options: [
      "Departments must deploy vacuum desludging trucks.",
      "Deploying vacuum desludging trucks for septic tanks.",
      "Vacuum desludging trucks for communal septic tanks.",
      "To evacuate communal public septic tanks regularly."
    ],
    answer: "Departments must deploy vacuum desludging trucks.",
    hint: "Ensure the sentence contains an active Subject, Finite Verb, and Object.",
    solution: "Option A possesses complete grammatical syntax: Subject ('Departments') + Verb ('must deploy') + Object ('desludging trucks').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The ministry of food and agriculture should subsidize organic bio-fertilizers to reduce peasant reliance on imported chemicals.'",
    question: "Which candidate sentence is encoded into a complete grammatical sentence?",
    options: [
      "Ministry should subsidize organic bio-fertilizers.",
      "Subsidizing organic bio-fertilizers for peasant farmers.",
      "Organic bio-fertilizers instead of imported chemicals.",
      "To reduce peasant reliance on imported chemicals."
    ],
    answer: "Ministry should subsidize organic bio-fertilizers.",
    hint: "Identify the option with an active Subject and Finite Verb.",
    solution: "Option A is an active, grammatically complete sentence with a modal auxiliary and main verb.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Water resources commissions ought to demarcate physical buffer zones along riverbanks to prevent agricultural chemical runoff.'",
    question: "Which summary statement avoids grammatical incompleteness penalties?",
    options: [
      "Commissions must demarcate river buffer zones.",
      "Demarcating physical buffer zones along riverbanks.",
      "Physical river buffer zones against chemical runoff.",
      "To prevent agricultural chemical runoff into rivers."
    ],
    answer: "Commissions must demarcate river buffer zones.",
    hint: "Look for an explicit Subject paired with a Finite Verb.",
    solution: "Option A forms a complete grammatical sentence ('Commissions must demarcate river buffer zones').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The national fire service should enforce firebreak strips around forestry plantations to prevent dry season wildfire devastation.'",
    question: "Which option provides an active, grammatically complete summary?",
    options: [
      "Service must enforce plantation firebreak strips.",
      "Enforcing firebreak strips around forestry plantations.",
      "Plantation firebreak strips against dry season wildfires.",
      "To prevent dry season wildfire devastation."
    ],
    answer: "Service must enforce plantation firebreak strips.",
    hint: "Select the sentence with an active subject and finite verb.",
    solution: "Option A features Subject ('Service') + Verb ('must enforce') + Object ('firebreak strips').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Urban development authorities ought to pave pedestrian footpaths with porous concrete pavers to facilitate stormwater infiltration.'",
    question: "Which candidate sentence satisfies standard summary grammar rules?",
    options: [
      "Authorities should pave footpaths with porous pavers.",
      "Paving pedestrian footpaths with porous concrete pavers.",
      "Porous concrete pavers for stormwater infiltration.",
      "To facilitate stormwater infiltration in cities."
    ],
    answer: "Authorities should pave footpaths with porous pavers.",
    hint: "Ensure the sentence contains a finite verb rather than a participle or prepositional phrase.",
    solution: "Option A is a complete active sentence with an auxiliary and main verb ('should pave').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The maritime authority must impound unseaworthy wooden passenger boats to prevent fatal maritime capsizing tragedies on the lake.'",
    question: "Which option represents a properly encoded active summary sentence?",
    options: [
      "Authority must impound unseaworthy passenger boats.",
      "Impounding unseaworthy wooden passenger boats on lakes.",
      "Unseaworthy passenger boats and maritime capsizing tragedies.",
      "To prevent fatal maritime capsizing tragedies."
    ],
    answer: "Authority must impound unseaworthy passenger boats.",
    hint: "Look for an explicit Subject paired with a Finite Verb.",
    solution: "Option A provides complete Subject-Verb-Object syntax ('Authority must impound unseaworthy passenger boats').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The ministry of youth and sports should establish community athletic tracks to promote adolescent cardiovascular fitness.'",
    question: "Which candidate sentence is grammatically complete?",
    options: [
      "Ministry must construct community athletic tracks.",
      "Establishing community athletic tracks for adolescents.",
      "Community athletic tracks for cardiovascular fitness.",
      "Because adolescents need cardiovascular fitness."
    ],
    answer: "Ministry must construct community athletic tracks.",
    hint: "Identify the sentence that possesses an active finite verb rather than a participle.",
    solution: "Option A has an explicit Subject ('Ministry'), Finite Verb ('must construct'), and Object ('athletic tracks').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Public veterinary clinics should administer rabies vaccines to domestic dogs to prevent fatal viral transmission to humans.'",
    question: "Which summary statement avoids grammatical incompleteness penalties?",
    options: [
      "Clinics must vaccinate domestic dogs against rabies.",
      "Administering rabies vaccines to domestic dogs.",
      "Domestic dog vaccines against viral rabies.",
      "To prevent fatal viral transmission to humans."
    ],
    answer: "Clinics must vaccinate domestic dogs against rabies.",
    hint: "Select the complete independent sentence.",
    solution: "Option A is a complete active sentence with an auxiliary and main verb ('must vaccinate').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The energy commission ought to mandate star-rated energy efficiency labels on electrical appliances to curb power wastage.'",
    question: "Which option represents a valid grammatical summary sentence?",
    options: [
      "Commission must mandate appliance efficiency labels.",
      "Mandating star-rated energy efficiency labels on appliances.",
      "Energy efficiency labels to curb power wastage.",
      "To curb household electrical power wastage."
    ],
    answer: "Commission must mandate appliance efficiency labels.",
    hint: "Ensure the sentence contains an active Subject, Finite Verb, and Object.",
    solution: "Option A possesses complete grammatical syntax: Subject ('Commission') + Verb ('must mandate') + Object ('efficiency labels').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Agricultural research institutes should develop drought-tolerant cassava stem cuttings to safeguard food security during dry spells.'",
    question: "Which candidate sentence is encoded into a complete grammatical sentence?",
    options: [
      "Institutes must develop drought-tolerant cassava varieties.",
      "Developing drought-tolerant cassava stem cuttings for farmers.",
      "Drought-tolerant cassava varieties for food security.",
      "To safeguard food security during dry spells."
    ],
    answer: "Institutes must develop drought-tolerant cassava varieties.",
    hint: "Look for an explicit Subject paired with a Finite Verb.",
    solution: "Option A features Subject ('Institutes') + Verb ('must develop') + Object ('cassava varieties').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Municipal traffic police should impound overloaded commercial minibuses to protect passengers from catastrophic highway collisions.'",
    question: "Which summary statement avoids grammatical incompleteness penalties?",
    options: [
      "Police must impound overloaded commercial minibuses.",
      "Impounding overloaded commercial minibuses on highways.",
      "Overloaded commercial minibuses and highway collisions.",
      "In order to protect passengers from collisions."
    ],
    answer: "Police must impound overloaded commercial minibuses.",
    hint: "Select the option with an active subject and finite verb.",
    solution: "Option A is an independent clause with complete Subject-Verb-Object syntax.",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The postal service should automate parcel sorting systems to eliminate delivery delays and logistical tracking errors.'",
    question: "Which sentence provides an active, grammatically complete summary?",
    options: [
      "Service should automate parcel sorting systems.",
      "Automating parcel sorting systems in post offices.",
      "Automated parcel sorting against logistical tracking errors.",
      "To eliminate delivery delays and tracking errors."
    ],
    answer: "Service should automate parcel sorting systems.",
    hint: "Look for an explicit Subject paired with a Finite Verb ('should automate').",
    solution: "Option A is a complete active sentence with an auxiliary and main verb.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Regional water boards should flush municipal distribution pipes regularly to prevent rust accumulation and water discoloration.'",
    question: "Which candidate sentence satisfies standard summary grammar rules?",
    options: [
      "Boards must flush municipal water pipes.",
      "Flushing municipal distribution pipes to prevent rust.",
      "Municipal water pipes and water discoloration.",
      "To prevent rust accumulation and discoloration."
    ],
    answer: "Boards must flush municipal water pipes.",
    hint: "Ensure the sentence contains an active Subject, Finite Verb, and Object.",
    solution: "Option A features Subject ('Boards') + Verb ('must flush') + Object ('water pipes').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Environmental protection agencies must penalize stone quarry operators who fail to execute dust suppression spraying.'",
    question: "Which option represents a properly encoded active summary sentence?",
    options: [
      "Agencies must penalize negligent quarry operators.",
      "Penalizing stone quarry operators for dust emissions.",
      "Negligent quarry operators and dust suppression spraying.",
      "Because quarries fail to execute dust spraying."
    ],
    answer: "Agencies must penalize negligent quarry operators.",
    hint: "Identify the sentence that possesses an active finite verb rather than a participle.",
    solution: "Option A is an independent clause with Subject ('Agencies') + Verb ('must penalize') + Object ('operators').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Secondary school science departments should construct biosand water filters to supply students with clean laboratory drinking water.'",
    question: "Which candidate sentence is grammatically complete?",
    options: [
      "Departments should build biosand water filters.",
      "Constructing biosand water filters for science laboratories.",
      "Biosand water filters for clean drinking water.",
      "To supply students with clean drinking water."
    ],
    answer: "Departments should build biosand water filters.",
    hint: "Look for an explicit Subject paired with a Finite Verb ('should build').",
    solution: "Option A provides complete Subject-Verb-Object syntax ('Departments should build biosand water filters').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'Agricultural extension officers must educate vegetable growers on biological pest control to reduce synthetic pesticide hazards.'",
    question: "Which summary statement avoids grammatical incompleteness penalties?",
    options: [
      "Officers must teach biological pest control.",
      "Educating vegetable growers on biological pest control.",
      "Biological pest control against synthetic pesticide hazards.",
      "To reduce synthetic pesticide hazards on farms."
    ],
    answer: "Officers must teach biological pest control.",
    hint: "Select the option with an active subject and finite verb.",
    solution: "Option A is an independent clause with complete Subject-Verb-Object syntax.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The environmental health directorate should inspect public restaurant kitchens regularly to enforce food safety and sanitary standards.'",
    question: "Which sentence provides an active, grammatically complete summary?",
    options: [
      "Directorate must inspect public restaurant kitchens.",
      "Inspecting public restaurant kitchens for food safety.",
      "Public restaurant kitchens and sanitary food standards.",
      "To enforce food safety and sanitary standards."
    ],
    answer: "Directorate must inspect public restaurant kitchens.",
    hint: "Look for an explicit Subject paired with a Finite Verb.",
    solution: "Option A is a complete active sentence with an auxiliary and main verb ('must inspect').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The national blood service should organize mobile blood donation drives in tertiary universities to replenish depleted hospital banks.'",
    question: "Which candidate sentence is encoded into a complete grammatical sentence?",
    options: [
      "Service must organize university blood drives.",
      "Organizing mobile blood donation drives in universities.",
      "Mobile blood donation drives for hospital banks.",
      "To replenish depleted hospital blood banks."
    ],
    answer: "Service must organize university blood drives.",
    hint: "Ensure the sentence contains an active Subject, Finite Verb, and Object.",
    solution: "Option A features Subject ('Service') + Verb ('must organize') + Object ('blood drives').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Municipal works departments should install cast-iron drainage grates across roadside gutters to prevent pedestrian foot injuries.'",
    question: "Which summary statement avoids grammatical incompleteness penalties?",
    options: [
      "Departments must install roadside drainage grates.",
      "Installing cast-iron drainage grates across gutters.",
      "Cast-iron drainage grates to prevent foot injuries.",
      "To prevent pedestrian foot injuries in gutters."
    ],
    answer: "Departments must install roadside drainage grates.",
    hint: "Select the complete independent sentence.",
    solution: "Option A forms a complete grammatical sentence ('Departments must install roadside drainage grates').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The geological survey authority ought to map landslide-prone mountain slopes to restrict residential construction in hazard zones.'",
    question: "Which option represents a properly encoded active summary sentence?",
    options: [
      "Authority must map hazardous mountain slopes.",
      "Mapping landslide-prone mountain slopes for safety.",
      "Landslide-prone mountain slopes and hazard zones.",
      "To restrict residential construction in hazard zones."
    ],
    answer: "Authority must map hazardous mountain slopes.",
    hint: "Identify the sentence that possesses an active finite verb rather than a participle.",
    solution: "Option A has an explicit Subject ('Authority'), Finite Verb ('must map'), and Object ('hazardous mountain slopes').",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'The maritime police should intercept artisanal fishing canoes operating without approved navigation lamps during nocturnal hours.'",
    question: "Which candidate sentence satisfies standard summary grammar rules?",
    options: [
      "Police must intercept unlit fishing canoes.",
      "Intercepting artisanal fishing canoes without navigation lamps.",
      "Artisanal fishing canoes and approved navigation lamps.",
      "During nocturnal hours on coastal fishing waters."
    ],
    answer: "Police must intercept unlit fishing canoes.",
    hint: "Ensure the statement contains a finite verb rather than a participle or prepositional phrase.",
    solution: "Option A features Subject ('Police') + Verb ('must intercept') + Object ('unlit fishing canoes').",
    target: "Grammatical Sentence Integrity"
  },
  {
    passage: "Text: 'The ministry of education should digitize secondary school library catalogs to enhance student academic research capabilities.'",
    question: "Which sentence provides an active, grammatically complete summary?",
    options: [
      "Ministry must digitize school library catalogs.",
      "Digitizing secondary school library catalogs for research.",
      "Secondary school library catalogs and academic research.",
      "To enhance student academic research capabilities."
    ],
    answer: "Ministry must digitize school library catalogs.",
    hint: "Look for an explicit Subject paired with a Finite Verb ('must digitize').",
    solution: "Option A is a complete active sentence with an auxiliary and main verb.",
    target: "Active Sentence Encoding"
  },
  {
    passage: "Text: 'Public health authorities must fumigate urban storm drains periodically to suppress mosquito breeding and lower malaria incidence.'",
    question: "Which candidate sentence is encoded into a complete grammatical sentence?",
    options: [
      "Authorities must fumigate urban storm drains.",
      "Fumigating urban storm drains to suppress mosquitoes.",
      "Urban storm drains and clinical malaria incidence.",
      "Because mosquitoes breed rapidly in storm drains."
    ],
    answer: "Authorities must fumigate urban storm drains.",
    hint: "Identify the option with an active Subject and Finite Verb.",
    solution: "Option A is an independent clause with complete Subject-Verb-Object syntax.",
    target: "Grammatical Sentence Integrity"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH DENSU RIVER BASIN PASSAGE (51 TO 55)
// =========================================================================
const capstone5B9IntermediateQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 1, how much treated drinking water does the Weija water treatment plant deliver daily to western Accra?",
    options: [
      "Ten thousand gallons",
      "Over forty million gallons",
      "One hundred million gallons",
      "Five hundred thousand gallons"
    ],
    answer: "Over forty million gallons",
    hint: "Scan paragraph 1 for the numerical figure following 'delivers over'.",
    solution: "Paragraph 1 states explicitly: 'delivers over forty million gallons of treated drinking water daily...'",
    target: "Capstone Exam: Scanning Specific Data"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what two specific human activities on the surrounding hills trigger heavy siltation in the Weija reservoir?",
    options: [
      "Commercial stone-quarrying blasting and encroaching residential developments",
      "Traditional pottery weaving and commercial swimming",
      "Planting cocoa trees and digging fish ponds",
      "Building hydroelectric power lines"
    ],
    answer: "Commercial stone-quarrying blasting and encroaching residential developments",
    hint: "Review paragraph 2 regarding granite silt and encroaching residential buffer zones.",
    solution: "Paragraph 2 identifies commercial stone quarrying dynamite blasts and residential encroachment into buffer zones as the primary drivers of siltation.",
    target: "Capstone Exam: Causal Analysis"
  },
  {
    questionNumber: 53,
    question: "What figure of speech is employed in the phrase 'aquatic weeds carpet the water' in paragraph 3, and what does it mean?",
    options: [
      "Simile; meaning water hyacinths look like wool",
      "Metaphor; meaning dense invasive weeds completely cover the surface of the lake",
      "Personification; meaning weeds can walk across water",
      "Hyperbole; meaning the lake has dried up into mud"
    ],
    answer: "Metaphor; meaning dense invasive weeds completely cover the surface of the lake",
    hint: "Direct comparison equating weed growth to an indoor floor carpet without using 'like' or 'as'.",
    solution: "Comparing the thick growth of invasive weeds directly to a floor carpet without comparative connectives constitutes a metaphor denoting complete surface coverage.",
    target: "Capstone Exam: Figurative Language Decoding"
  },
  {
    questionNumber: 54,
    question: "What grammatical function does the underlined clause perform in: 'When monsoon downpours arrive, dam engineers execute emergency spillages'?",
    options: [
      "Noun clause, subject of the verb 'execute'",
      "Adverbial clause of time, modifying the main verb 'execute'",
      "Adjectival clause qualifying 'dam engineers'",
      "Prepositional phrase modifying 'spillages'"
    ],
    answer: "Adverbial clause of time, modifying the main verb 'execute'",
    hint: "Notice the temporal subordinating conjunction 'When' indicating the time an action occurs.",
    solution: "'When monsoon downpours arrive' functions as an adverbial clause of time modifying the main action verb 'execute'.",
    target: "Capstone Exam: Grammatical Clause Analysis"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what authorities must construct along the riverbanks in paragraph 4.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Authorities must construct protective vegetative green belts.",
      "Constructing protective vegetative green belts along the riverbanks.",
      "Because silt pollutes the water, authorities should definitely construct vegetative green belts.",
      "Constructing green belts."
    ],
    answer: "Authorities must construct protective vegetative green belts.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Authorities must construct protective vegetative green belts' is exactly 7 words, possesses complete Subject-Verb-Object syntax, and answers the prompt directly. Option B is an unattached participial fragment.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB9Intermediate() {
  console.log("Building 55 UNIQUE questions for Basic 9 Intermediate...");
  const db = await getDb();

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50B9IntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_I_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B9.2.2.1: Encode summary propositions into grammatically complete active sentences with finite verbs."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9IntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${densuBasinFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_I_${item.questionNumber}`,
      level: "B9",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: densuBasinFullPassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.2.1.1 / B9.2.2.1: Multi-paragraph textual analysis, grammatical clause parsing, and active summary sentence encoding."
    });
  });

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  // 3. Write to subcollection B9_intermediate across all paths
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B9_intermediate`);
    await targetDoc.set({
      level: "B9",
      difficulty: "intermediate",
      title: "Basic 9 Intermediate Lab: 50 Unique Active Sentence Encoding Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (Active Sentence Encoding) + 5 Capstone Full-Passage Questions",
        passageVisibility: "Passage embedded both in passageText and at the top of prompt",
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${targetDoc.path}`);
  }

  // 4. Synchronize into main topical document practicePool.medium for TopicalLabRunner (level: b9)
  console.log("\nSynchronizing main topical document practicePool.medium for b9 (keeping b7, b8, b9 only)...");
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
        b7: existingLevels.b7 || {},
        b8: existingLevels.b8 || {},
        b9: {
          ...(existingLevels.b9 || {}),
          practicePool: {
            ...(existingLevels.b9?.practicePool || {}),
            medium: mappedMediumQuestions
          }
        }
      };

      const { questions, ...cleanData } = data;

      await mainRef.set({
        ...cleanData,
        levels: cleanLevels,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated main document practicePool.medium for b9 at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B9 Intermediate!`);
}

deployUniqueB9Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B9 Intermediate:", err);
    process.exit(1);
  });

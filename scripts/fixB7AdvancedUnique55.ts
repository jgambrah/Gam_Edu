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
// =========================================================================
const sacredGrovesFullPassage = 
`Across the tropical forest and coastal savannah belts of West Africa, sacred groves—patches of climax virgin forest traditionally protected by religious taboos and customary customary laws—represent one of the oldest forms of indigenous conservation. Designated by traditional custodians as the ancestral burial grounds of royal lineages or the spiritual sanctuaries of riverine deities, these communal enclaves have historically remained immune to bush burning, commercial farming, and indiscriminate tree felling.

The primary environmental function of sacred groves lies in their ability to serve as invaluable biological islands and ecological refugia. While the surrounding landscapes have been extensively cleared for monoculture cash crops and residential developments, groves harbor rare species of flora, medicinal shrubs, and indigenous fauna that have vanished from the broader regional ecosystem. Furthermore, dense vegetative canopies act as essential water catchments, moderating microclimates, preventing soil desiccation, and preserving the perennial flow of local streams that sustain rural settlements.

However, rapid modernization, urbanization, and changing socio-religious values have exerted unprecedented pressure on these ancestral conservation areas. Traditional reverence for ancestral taboos has weakened among younger generations, while commercial land speculators and illegal timber operators exploit community leadership vacuums to fell prized mahogany trees. Consequently, these once-unbroken ecological corridors are suffering severe fragmentation, leaving remnant wildlife populations vulnerable to extinction.

To preserve these surviving biodiversity storehouses, formal environmental protection authorities must integrate indigenous conservation mechanisms into statutory forestry frameworks. Granting official legal protection to traditional groves, demarcating physical buffer zones, and partnering with local traditional councils will safeguard both Ghana's ecological heritage and its living cultural history.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50AdvancedDrills = [
  {
    passage: "Before the sun had risen above the horizon, Kofi loaded his hunting rifle and strapped on his cutlass. Next, he whistled for his faithful hound, Bingo, who bounded eagerly out of the kennel. Together, they quietly slipped through the sleeping village toward the virgin forest.",
    question: "What chronological action did Kofi perform immediately before whistling for his dog?",
    options: [
      "He slipped through the sleeping village",
      "He loaded his hunting rifle and strapped on his cutlass",
      "He shot a wild boar in the forest",
      "He ate a heavy breakfast in the kitchen"
    ],
    answer: "He loaded his hunting rifle and strapped on his cutlass",
    hint: "Identify the temporal marker 'Next' and check what preceded it.",
    solution: "The text states: 'Kofi loaded his hunting rifle and strapped on his cutlass. Next, he whistled for his faithful hound...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The sudden torrential downpour compelled the sports master to cancel the annual inter-house athletics competition.'",
    question: "Which of the following represents the most accurate paraphrase of the sentence without altering its core meaning?",
    options: [
      "The sports master cancelled the sports games because of heavy rain.",
      "The sports master disliked the rainy weather and stayed home.",
      "The athletics games continued despite the storm.",
      "Torrential rains always happen during annual inter-house sports competitions."
    ],
    answer: "The sports master cancelled the sports games because of heavy rain.",
    hint: "A faithful paraphrase preserves meaning while using simpler, distinct phrasing.",
    solution: "Option A captures both the cause (heavy rain) and the effect (cancellation of sports) accurately and concisely.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "After digging a two-meter trench, the workers laid perforated PVC drainage pipes along the embankment. Finally, they backfilled the excavation with gravel to allow surface runoff to percolate freely.",
    question: "What was the final engineering action executed by the workers?",
    options: [
      "Digging a two-meter trench",
      "Laying perforated PVC drainage pipes",
      "Backfilling the excavation with gravel",
      "Constructing a concrete bridge"
    ],
    answer: "Backfilling the excavation with gravel",
    hint: "Locate the sequence signaled by the transition word 'Finally'.",
    solution: "The text explicitly uses the chronological signpost 'Finally, they backfilled the excavation with gravel...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'Because the commercial driver was exhausted after driving for twelve continuous hours, he failed to negotiate the sharp hairpin curve.'",
    question: "Which statement accurately paraphrases the causal relationship described in the excerpt?",
    options: [
      "The vehicle's brakes failed because the road was curved.",
      "Extreme driver fatigue from prolonged driving led to the steering accident on the curve.",
      "The driver drove for twelve hours because he missed the curve.",
      "Hairpin curves are easy to drive when a driver is tired."
    ],
    answer: "Extreme driver fatigue from prolonged driving led to the steering accident on the curve.",
    hint: "Link the driver's state of fatigue directly to his failure to steer.",
    solution: "Option B preserves the causal nexus: driver exhaustion caused by 12 hours of driving resulted in the failure to navigate the curve.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The royal linguist poured libation to invoke the blessings of the departed ancestors. Thereafter, the Paramount Chief beat the sacred talking drum, signaling that the annual yam harvest festival had formally commenced.",
    question: "What event occurred immediately following the pouring of libation?",
    options: [
      "The Paramount Chief beat the sacred talking drum",
      "The villagers harvested all the yams on the farm",
      "The linguist went home to rest",
      "The youth started dancing in the street"
    ],
    answer: "The Paramount Chief beat the sacred talking drum",
    hint: "Identify the action signaled by the transition 'Thereafter'.",
    solution: "The text indicates: 'The royal linguist poured libation... Thereafter, the Paramount Chief beat the sacred talking drum...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The excessive accumulation of synthetic plastics in communal gutters impedes storm drainage, creating perennial urban flood hazards during monsoon downpours.'",
    question: "Which statement best paraphrases this environmental warning?",
    options: [
      "Plastic waste blocks city gutters, causing recurring floods during heavy rains.",
      "Monsoon downpours wash plastic waste out to sea cleanly.",
      "People should throw synthetic plastics directly into running rivers.",
      "Gutters are constructed to collect plastic bags for recycling."
    ],
    answer: "Plastic waste blocks city gutters, causing recurring floods during heavy rains.",
    hint: "Look for an option that maintains the exact relationship between blocked gutters and floods.",
    solution: "Option A accurately rephrases the relationship: accumulated plastic blocks drainage, leading to floods during heavy rains.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "First, the potter kneaded the raw clay to eliminate trapped air pockets. Subsequently, she centered the lump on the revolving wheel and shaped the vessel walls with moistened fingertips before kiln firing.",
    question: "Why did the potter knead the raw clay before placing it on the wheel?",
    options: [
      "To change the color of the clay to bright blue",
      "To eliminate trapped air pockets that could cause flaws",
      "To cool the revolving wooden wheel",
      "To dry the clay out into hard stone"
    ],
    answer: "To eliminate trapped air pockets that could cause flaws",
    hint: "Scan for the immediate purpose linked to the kneading action.",
    solution: "The passage notes: 'First, the potter kneaded the raw clay to eliminate trapped air pockets.'",
    target: "Cause and Effect"
  },
  {
    passage: "Original statement: 'The municipal assembly enacted stringent bylaws mandating periodic domestic sanitary inspections to suppress waterborne disease transmission.'",
    question: "Which option provides an accurate, clear paraphrase of this policy?",
    options: [
      "The assembly abolished sanitary inspections to save public revenue.",
      "The assembly introduced strict laws requiring regular home health checks to curb waterborne diseases.",
      "Waterborne diseases were cured by passing assembly resolutions.",
      "Inspectors visit homes only when residents invite them."
    ],
    answer: "The assembly introduced strict laws requiring regular home health checks to curb waterborne diseases.",
    hint: "Rephrase 'stringent bylaws mandating periodic domestic sanitary inspections'.",
    solution: "Option B preserves all core components: strict laws (stringent bylaws), regular home checks (periodic domestic inspections), and curbing diseases.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The silversmith heated the metallic ingot in the charcoal crucible until it liquefied into glowing orange slag. Next, he poured the molten silver into a carved sandstone mold to cast the royal ceremonial armlet.",
    question: "What action took place immediately after the silver liquefied?",
    options: [
      "The silversmith carved the sandstone mold with a chisel",
      "The silversmith poured the molten silver into a carved sandstone mold",
      "The silversmith presented the armlet to the chief",
      "The charcoal was extinguished with cold water"
    ],
    answer: "The silversmith poured the molten silver into a carved sandstone mold",
    hint: "Follow the sequential step signaled by 'Next'.",
    solution: "The text follows chronological order: 'Next, he poured the molten silver into a carved sandstone mold...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The introduction of mobile telephony into rural agrarian communities eliminated predatory transport middlemen by granting farmers instantaneous access to urban commodity pricing.'",
    question: "Which statement represents a faithful paraphrase of the passage?",
    options: [
      "Mobile phones allowed farmers to check city crop prices instantly, bypassing exploitative middlemen.",
      "Middlemen bought mobile phones for rural farmers to increase transport fees.",
      "Farmers moved to urban commodity markets to sell mobile phones.",
      "Transport lorries refuse to carry farm produce unless drivers receive phone calls."
    ],
    answer: "Mobile phones allowed farmers to check city crop prices instantly, bypassing exploitative middlemen.",
    hint: "Connect mobile phones, direct price access, and removing predatory middlemen.",
    solution: "Option A captures the complete meaning: real-time price access via phones enabled farmers to bypass exploitative middlemen.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "At the initial sounding of the bell, examinees took their assigned seats and placed their identity cards on the desks. Afterward, the chief invigilator distributed sealed question packets and gave the signal to begin.",
    question: "What did examinees do before the chief invigilator distributed question packets?",
    options: [
      "They began writing their essay compositions",
      "They took their assigned seats and placed identity cards on their desks",
      "They handed in their finished answer booklets",
      "They went out to the school field for physical exercise"
    ],
    answer: "They took their assigned seats and placed identity cards on their desks",
    hint: "Check what occurred at 'the initial sounding of the bell'.",
    solution: "The sequence indicates candidates sat down and placed IDs on desks before packets were distributed.",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'Prolonged exposure to loud ambient decibel levels inside industrial manufacturing workshops irreversibly impairs the delicate auditory sensory mechanism of the human inner ear.'",
    question: "Which option best paraphrases this medical statement?",
    options: [
      "Loud factory noise causes permanent damage to human hearing.",
      "Industrial workers enjoy loud noise because it keeps them awake.",
      "Inner ear mechanisms can be repaired easily with factory oil.",
      "Temporary hearing loss occurs only when factories close."
    ],
    answer: "Loud factory noise causes permanent damage to human hearing.",
    hint: "Find the concise sentence that matches 'prolonged exposure... irreversibly impairs auditory mechanism'.",
    solution: "Option A accurately condenses the statement: excessive industrial sound causes permanent (irreversible) auditory damage.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "Before deploying the survey drone across the wildlife reserve, the rangers calibrated its navigational GPS sensors. Then, they verified the lithium battery charge level before launching the aircraft above the canopy.",
    question: "What technical check was conducted immediately prior to launching the drone?",
    options: [
      "The rangers built a landing strip on the grass",
      "The rangers verified the lithium battery charge level",
      "The rangers captured an injured antelope",
      "The rangers calibrated the GPS sensors for the first time"
    ],
    answer: "The rangers verified the lithium battery charge level",
    hint: "Identify the action directly preceding the launch.",
    solution: "The text explains: 'Then, they verified the lithium battery charge level before launching the aircraft...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The preservation of primary coastal mangrove forests mitigates the devastating impact of storm surges by absorbing wave energy along vulnerable shorelines.'",
    question: "Which of the following is the most accurate paraphrase of this ecological claim?",
    options: [
      "Coastal mangroves protect vulnerable shorelines by dampening destructive storm waves.",
      "Storm surges destroy all mangrove forests along the coast.",
      "Mangrove forests should be cleared to let storm waves pass freely.",
      "Shorelines are safe from storm surges without vegetation."
    ],
    answer: "Coastal mangroves protect vulnerable shorelines by dampening destructive storm waves.",
    hint: "Focus on the protective function of mangroves absorbing wave energy.",
    solution: "Option A captures the essence: mangroves protect coasts by absorbing and dampening wave energy from storm surges.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "First, the laboratory assistant wiped the glass slide with absolute ethanol to remove greasy fingerprints. Following this, he positioned the microbial specimen under the objective lens and adjusted the fine focus knob.",
    question: "What was the purpose of wiping the glass slide with absolute ethanol?",
    options: [
      "To break the glass slide into two halves",
      "To remove greasy fingerprints from the surface",
      "To color the microbial specimen bright red",
      "To heat the microscope stage"
    ],
    answer: "To remove greasy fingerprints from the surface",
    hint: "Check the explicit purpose following 'ethanol to...'.",
    solution: "The text explicitly states the slide was wiped 'to remove greasy fingerprints.'",
    target: "Cause and Effect"
  },
  {
    passage: "Original statement: 'The construction of decentralized solar-powered boreholes in remote hamlets eliminates the grueling daily burden of girls walking long distances to fetch river water.'",
    question: "Which sentence accurately paraphrases this social benefit?",
    options: [
      "Local solar boreholes spare young girls from trekking long distances for water.",
      "Young girls prefer walking to distant rivers rather than using local boreholes.",
      "Solar boreholes require young girls to carry heavier buckets.",
      "Remote hamlets have no need for drinking water."
    ],
    answer: "Local solar boreholes spare young girls from trekking long distances for water.",
    hint: "Connect solar boreholes with freeing girls from long walks to rivers.",
    solution: "Option A captures the core relief: local boreholes remove the need for girls to trek long distances to collect water.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The scout leader demonstrated the safe way to build an elevated cooking fire. Immediately after, the patrol members collected dry kindling and stacked the stones in a secure circle.",
    question: "What did the patrol members do right after the demonstration?",
    options: [
      "They went to sleep in their tents",
      "They collected dry kindling and stacked stones in a secure circle",
      "They cooked a three-course dinner for the camp",
      "They swam across the nearby river"
    ],
    answer: "They collected dry kindling and stacked stones in a secure circle",
    hint: "Look at the action signaled by 'Immediately after'.",
    solution: "The passage notes: 'Immediately after, the patrol members collected dry kindling and stacked the stones...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The adoption of organic agro-forestry techniques enriches depleted agricultural soil while providing peasant households with secondary timber and fruit income.'",
    question: "Which statement provides an accurate paraphrase of this farming method?",
    options: [
      "Agro-forestry restores soil fertility and generates extra fruit and timber income for farming families.",
      "Peasant households cut down all trees to enrich farm soils quickly.",
      "Organic techniques cause crops to fail completely.",
      "Fruit and timber income is abolished when trees are planted on farms."
    ],
    answer: "Agro-forestry restores soil fertility and generates extra fruit and timber income for farming families.",
    hint: "Preserve both benefits: improving soil and providing supplementary income.",
    solution: "Option A accurately reflects both outcomes: replenishing depleted soil and providing supplementary fruit and timber revenue.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "Prior to entering the sterile surgical theatre, the surgeon scrubbed her hands for five minutes with antiseptic detergent. Afterward, the nurse helped her slip into a sterilized gown and latex gloves.",
    question: "What procedure did the surgeon complete prior to putting on the sterilized gown?",
    options: [
      "She spoke on her mobile phone",
      "She scrubbed her hands for five minutes with antiseptic detergent",
      "She performed the operation immediately",
      "She walked out to the parking lot"
    ],
    answer: "She scrubbed her hands for five minutes with antiseptic detergent",
    hint: "Look at what occurred 'Prior to entering...'.",
    solution: "The text explains: 'the surgeon scrubbed her hands for five minutes with antiseptic detergent. Afterward, the nurse helped her slip into a sterilized gown...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The uncontrolled disposal of raw industrial effluents into urban water bodies contaminates marine habitats and undermines coastal fishing livelihoods.'",
    question: "Which option best paraphrases this environmental issue?",
    options: [
      "Dumping untreated factory waste into rivers poisons marine life and hurts local fishermen.",
      "Industrial factories build clean aquariums for coastal fishermen.",
      "Urban water bodies are improved when industrial chemicals are added.",
      "Fishermen catch more fish near factory drainage pipes."
    ],
    answer: "Dumping untreated factory waste into rivers poisons marine life and hurts local fishermen.",
    hint: "Find the rephrasing for raw industrial effluents, marine contamination, and damaged fishing livelihoods.",
    solution: "Option A directly paraphrases the elements: untreated waste (raw effluents) poisons marine life and damages fishermen's income.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "Initially, the archaeologists marked out a five-meter grid using twine and wooden pegs. Next, they methodically scraped away the topsoil with hand trowels to uncover ancestral clay potsherds.",
    question: "What did the archaeologists do immediately after marking out the grid?",
    options: [
      "They published their final textbook in London",
      "They methodically scraped away the topsoil with hand trowels",
      "They poured concrete over the site",
      "They planted corn seeds inside the grid"
    ],
    answer: "They methodically scraped away the topsoil with hand trowels",
    hint: "Follow the sequence indicated by 'Next'.",
    solution: "The text indicates: 'Next, they methodically scraped away the topsoil with hand trowels...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The application of lime to acidic soils neutralizes excess soil acidity, unlocking previously bound phosphorus for root absorption.'",
    question: "Which statement accurately paraphrases the agricultural benefit of lime?",
    options: [
      "Adding lime reduces soil acidity, enabling plant roots to absorb trapped phosphorus.",
      "Lime makes soil too sour for crop production.",
      "Phosphorus is destroyed completely when lime touches farm soil.",
      "Farmers should apply lime to kill all crop roots."
    ],
    answer: "Adding lime reduces soil acidity, enabling plant roots to absorb trapped phosphorus.",
    hint: "Connect neutralizing acidity with freeing up bound phosphorus.",
    solution: "Option A captures the exact chemical mechanism: lime reduces acidity and unlocks phosphorus for plants.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "Once the master tailor measured the client's chest and inseam, he sketched the pattern chalk outlines onto the wool fabric. Subsequently, he sheared the cloth with heavy brass shears along the markings.",
    question: "What action followed the chalk outline sketching?",
    options: [
      "The tailor sent the client home with uncut fabric",
      "The tailor sheared the cloth with heavy brass shears along the markings",
      "The tailor washed the wool in boiling water",
      "The tailor measured the client's chest a second time"
    ],
    answer: "The tailor sheared the cloth with heavy brass shears along the markings",
    hint: "Check the action marked by 'Subsequently'.",
    solution: "The text states: 'Subsequently, he sheared the cloth with heavy brass shears along the markings.'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The rapid proliferation of motorized tricycles has revolutionized peri-urban transport by offering affordable point-to-point transit across narrow, unpaved suburban lanes.'",
    question: "Which of the following is an accurate paraphrase of the excerpt?",
    options: [
      "Motorized tricycles have transformed transport by providing cheap rides through narrow unpaved roads.",
      "Motorized tricycles are banned on unpaved suburban lanes.",
      "Suburban roads are too wide for motorized tricycles to operate.",
      "Tricycles cost more to ride than luxury private taxis."
    ],
    answer: "Motorized tricycles have transformed transport by providing cheap rides through narrow unpaved roads.",
    hint: "Preserve the core points: revolutionized transport, affordable fares, navigating narrow lanes.",
    solution: "Option A accurately captures all components: transformed transit, affordable pricing, and navigating narrow lanes.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "First, the carver selected a mature block of seasoned sesedro wood. Having shaved off the rough bark, he outlined the ancestral stool contours using a sharp adze before carving the delicate central pillar.",
    question: "What step took place before carving the delicate central pillar?",
    options: [
      "Selling the stool at the airport craft market",
      "Outlining the stool contours with a sharp adze after shaving off the bark",
      "Painting the stool with bright glossy enamel",
      "Submerging the finished wood in river water"
    ],
    answer: "Outlining the stool contours with a sharp adze after shaving off the bark",
    hint: "Look at what was completed 'before carving the delicate central pillar'.",
    solution: "The passage notes he shaved the bark and outlined contours with an adze before carving the central pillar.",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'Consistently sleeping fewer than six hours per night undermines cognitive synthesis, diminishes short-term recall, and elevates emotional irritability in adolescent learners.'",
    question: "Which option best paraphrases this sleep health warning?",
    options: [
      "Inadequate sleep harms memory, weakens thinking skills, and increases irritability in teenagers.",
      "Adolescent learners perform best on examinations when they sleep four hours.",
      "Sleeping long hours prevents students from learning new words.",
      "Emotional irritability is cured by waking up early every night."
    ],
    answer: "Inadequate sleep harms memory, weakens thinking skills, and increases irritability in teenagers.",
    hint: "Find the concise version covering memory impairment, weakened cognition, and irritability.",
    solution: "Option A summarizes the three impacts: impaired recall (memory), undermined synthesis (thinking), and increased irritability in teens.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The meteorological department observed a sudden drop in barometric pressure. Soon after, gale-force winds began buffeting coastal coconut palms, heralding the arrival of an intense squall line.",
    question: "What physical weather phenomenon heralded the arrival of the squall line?",
    options: [
      "A complete absence of any wind",
      "Gale-force winds buffeting coastal coconut palms",
      "A sudden rise in afternoon temperature to fifty degrees",
      "The sun shining brightly on the beach"
    ],
    answer: "Gale-force winds buffeting coastal coconut palms",
    hint: "Look at the event occurring 'Soon after' the barometric drop.",
    solution: "The text states: 'Soon after, gale-force winds began buffeting coastal coconut palms, heralding the arrival...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The widespread adoption of drought-resistant hybrid maize seeds has fortified food security across semi-arid farming districts against unpredictable rainfall patterns.'",
    question: "Which sentence provides an accurate paraphrase of this agricultural development?",
    options: [
      "Drought-resistant hybrid maize protects food supplies in dry districts from erratic rainfall.",
      "Hybrid maize seeds require heavy rainfall every single day to survive.",
      "Semi-arid farming districts have stopped planting maize entirely.",
      "Food security is weakened when farmers plant drought-resistant seeds."
    ],
    answer: "Drought-resistant hybrid maize protects food supplies in dry districts from erratic rainfall.",
    hint: "Connect drought-resistant seeds, protected food supplies, and erratic rainfall.",
    solution: "Option A accurately reflects the premise: drought-resistant hybrid seeds protect food security against erratic weather.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The mechanic first drained the contaminated black lubricant from the oil sump. He then unscrewed the worn oil filter cartridge and threaded in a new component before refilling the engine with fresh grade-A oil.",
    question: "What was the final maintenance procedure executed by the mechanic?",
    options: [
      "Draining the contaminated lubricant from the sump",
      "Refilling the engine with fresh grade-A oil",
      "Removing the tires from the vehicle",
      "Unscrewing the worn oil filter cartridge"
    ],
    answer: "Refilling the engine with fresh grade-A oil",
    hint: "Identify the action executed 'before' finishing, at the very end of the sequence.",
    solution: "The sequence concludes with: 'before refilling the engine with fresh grade-A oil.'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The systematic digitization of land title registries eradicates fraudulent double-selling of real estate parcels by establishing an immutable public ledger of property ownership.'",
    question: "Which option best paraphrases this governance reform?",
    options: [
      "Digital land registries prevent land fraud by maintaining a permanent, unalterable record of ownership.",
      "Land titles are easier to forge when records are stored on computers.",
      "Double-selling of land is encouraged by digital registries.",
      "Property owners lose their land when title deeds are digitized."
    ],
    answer: "Digital land registries prevent land fraud by maintaining a permanent, unalterable record of ownership.",
    hint: "Look for the sentence that links digital registries, eliminating fraud, and unalterable ownership records.",
    solution: "Option A faithfully captures the meaning: digitization stops double-selling fraud by creating permanent, unalterable ownership records.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The baker mixed the flour, yeast, and warm water into an elastic dough. She covered the ceramic bowl with a clean cotton towel, allowing the yeast to ferment and double the dough's volume before baking.",
    question: "Why did the baker cover the dough bowl with a cotton towel before baking?",
    options: [
      "To keep the dough freezing cold",
      "To allow the yeast to ferment and double the dough's volume",
      "To bake the bread without using an oven",
      "To dry out the dough into hard crackers"
    ],
    answer: "To allow the yeast to ferment and double the dough's volume",
    hint: "Look at the purpose clause starting with 'allowing the yeast...'.",
    solution: "The passage explains the bowl was covered 'allowing the yeast to ferment and double the dough's volume before baking.'",
    target: "Cause and Effect"
  },
  {
    passage: "Original statement: 'The widespread substitution of traditional incandescent light bulbs with solid-state light-emitting diodes (LEDs) drastically curtails domestic household electricity consumption.'",
    question: "Which statement accurately paraphrases the benefit of LED bulbs?",
    options: [
      "Replacing incandescent bulbs with LEDs significantly cuts household electricity use.",
      "LED bulbs consume far more power than incandescent light bulbs.",
      "Domestic households should avoid LEDs to save money.",
      "Incandescent bulbs are cooler and use less electricity than LEDs."
    ],
    answer: "Replacing incandescent bulbs with LEDs significantly cuts household electricity use.",
    hint: "Connect substituting incandescent bulbs with LEDs to reduced energy consumption.",
    solution: "Option A captures the essence: switching from older bulbs to LEDs significantly reduces home electricity use.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The youth group cleared the weeds along the communal path with sharp cutlasses. Thereafter, they raked the debris into a heap and spread clean white river gravel along the footpath.",
    question: "What action did the youth group take immediately after clearing the weeds?",
    options: [
      "They went swimming in the river",
      "They raked the debris into a heap",
      "They built a wooden footbridge",
      "They planted corn along the path"
    ],
    answer: "They raked the debris into a heap",
    hint: "Check the action marked by 'Thereafter'.",
    solution: "The text explains: 'Thereafter, they raked the debris into a heap and spread clean white river gravel...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The construction of concrete sea defense revetments along eroding coastal communities halts shoreline retreat and safeguards historical heritage structures.'",
    question: "Which option provides an accurate paraphrase of this coastal engineering project?",
    options: [
      "Building concrete sea defense walls stops beach erosion and protects historic landmarks.",
      "Concrete sea walls accelerate the destruction of coastal heritage structures.",
      "Historical landmarks should be moved into the ocean.",
      "Shoreline retreat cannot be stopped by engineering barriers."
    ],
    answer: "Building concrete sea defense walls stops beach erosion and protects historic landmarks.",
    hint: "Look for an option that preserves preventing shoreline retreat and protecting historic buildings.",
    solution: "Option A accurately reflects both points: concrete sea defenses halt erosion and safeguard heritage structures.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "Before starting the formal debate, the lead proposer adjusted the microphone stand to mouth level. She then cleared her throat, acknowledged the panel of adjudicators, and delivered her opening contention.",
    question: "What protocol action did the speaker perform right before stating her opening contention?",
    options: [
      "She argued with the opposing team",
      "She acknowledged the panel of adjudicators",
      "She drank a glass of cold water",
      "She walked off the stage"
    ],
    answer: "She acknowledged the panel of adjudicators",
    hint: "Identify the action immediately preceding 'delivered her opening contention'.",
    solution: "The sequence states she 'cleared her throat, acknowledged the panel of adjudicators, and delivered her opening contention.'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'Over-reliance on chemical pesticides in vegetable farming eliminates predatory insects, precipitating secondary pest outbreaks that are resistant to standard agro-chemicals.'",
    question: "Which statement best paraphrases this agricultural warning?",
    options: [
      "Overusing chemical pesticides kills beneficial predator bugs, triggering outbreaks of resistant pests.",
      "Chemical pesticides make all vegetable crops immune to every pest.",
      "Predatory insects destroy vegetables faster than chemical pesticides.",
      "Farmers should double their pesticide spraying to kill all secondary pests."
    ],
    answer: "Overusing chemical pesticides kills beneficial predator bugs, triggering outbreaks of resistant pests.",
    hint: "Preserve the cause-and-effect chain: pesticide overuse kills helpful bugs and leads to resistant pest outbreaks.",
    solution: "Option A accurately rephrases the warning: excessive pesticide use kills beneficial predators, creating outbreaks of resistant pests.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The goldsmith first melted scrap jewelry in an earthenware crucible. Having poured the red-hot liquid into a narrow ingot mold, he cooled it in water before drawing it through a steel drawplate into fine filigree wire.",
    question: "What did the goldsmith do immediately prior to drawing the metal through the steel drawplate?",
    options: [
      "He sold the finished ring to a customer",
      "He cooled the molded silver ingot in water",
      "He melted scrap jewelry a second time",
      "He carved an adze handle"
    ],
    answer: "He cooled the molded silver ingot in water",
    hint: "Check the step executed right 'before drawing it through a steel drawplate'.",
    solution: "The text explains he poured it into a mold, 'cooled it in water before drawing it through a steel drawplate...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'Periodic desilting of municipal storm culverts before the onset of the major rainy season averts devastating urban inundations in low-lying commercial basins.'",
    question: "Which option represents a faithful paraphrase of this maintenance guideline?",
    options: [
      "Clearing silt from city drains before the rains prevents catastrophic flooding in low-lying areas.",
      "Municipal culverts should be filled with silt to block flood water.",
      "Rainy seasons cause no flooding in commercial basins.",
      "Desilting culverts is unnecessary if commercial basins are low-lying."
    ],
    answer: "Clearing silt from city drains before the rains prevents catastrophic flooding in low-lying areas.",
    hint: "Focus on desilting drains before rain to prevent floods.",
    solution: "Option A accurately restates the policy: clearing silt from drains prior to the rainy season prevents urban flooding in low-lying areas.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "First, the librarian logged the newly delivered textbooks into the acquisitions ledger. Subsequently, she stamped the institutional crest on the title page and affixed barcoded spine labels before shelving the volumes.",
    question: "What procedure did the librarian execute immediately following the ledger entry?",
    options: [
      "She burned the old textbooks in the yard",
      "She stamped the institutional crest on the title page",
      "She checked out the books to senior students",
      "She painted the wooden library shelves"
    ],
    answer: "She stamped the institutional crest on the title page",
    hint: "Identify the action marked by 'Subsequently'.",
    solution: "The text states: 'Subsequently, she stamped the institutional crest on the title page and affixed barcoded spine labels...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The deployment of community-based health planning services has significantly reduced maternal mortality rates across isolated rural districts.'",
    question: "Which statement accurately paraphrases this public health achievement?",
    options: [
      "Local community health services have markedly lowered maternal deaths in remote rural areas.",
      "Maternal deaths increased after community clinics were opened.",
      "Rural mothers prefer travelling to distant capital hospitals for basic care.",
      "Community health services operate exclusively in large urban cities."
    ],
    answer: "Local community health services have markedly lowered maternal deaths in remote rural areas.",
    hint: "Find the sentence that captures community health services reducing maternal deaths in rural areas.",
    solution: "Option A captures the exact outcome: community healthcare services have significantly lowered maternal deaths in remote areas.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The farmer dug four corner holes and drove in treated cedar posts. Next, she unrolled galvanized chain-link fencing along the perimeter and secured the wire mesh with heavy steel staples.",
    question: "What action took place immediately after driving in the cedar posts?",
    options: [
      "The farmer harvested ears of corn",
      "The farmer unrolled galvanized chain-link fencing along the perimeter",
      "The farmer painted the farmhouse roof",
      "The farmer opened the farm to stray animals"
    ],
    answer: "The farmer unrolled galvanized chain-link fencing along the perimeter",
    hint: "Follow the sequence indicated by 'Next'.",
    solution: "The text states: 'Next, she unrolled galvanized chain-link fencing along the perimeter...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The inclusion of leafy green vegetables in daily diets provides essential micro-nutrients that prevent dietary anemia and bolster immunological resistance.'",
    question: "Which option best paraphrases this nutritional fact?",
    options: [
      "Eating green vegetables daily supplies vital micro-nutrients that prevent anemia and strengthen immunity.",
      "Leafy green vegetables cause severe dietary anemia in young children.",
      "Dietary micro-nutrients are harmful to human immunological resistance.",
      "Vegetables should be avoided in daily household diets."
    ],
    answer: "Eating green vegetables daily supplies vital micro-nutrients that prevent anemia and strengthen immunity.",
    hint: "Look for an option that keeps green vegetables preventing anemia and strengthening immunity.",
    solution: "Option A faithfully captures both benefits: green vegetables supply nutrients that prevent anemia and bolster immunity.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "Prior to pouring the concrete foundation slab, the masons compacted the gravel hardcore with a vibrating tamper. They then laid heavy polyethylene damp-proof sheeting over the gravel to block rising ground moisture.",
    question: "Why did the masons lay polyethylene sheeting over the compacted gravel?",
    options: [
      "To color the concrete slab bright green",
      "To block rising ground moisture from penetrating the foundation",
      "To make the gravel dry out into fine dust",
      "To eliminate the need for cement in the concrete"
    ],
    answer: "To block rising ground moisture from penetrating the foundation",
    hint: "Scan for the purpose clause starting with 'to block...'.",
    solution: "The text explicitly states the sheeting was laid 'to block rising ground moisture.'",
    target: "Cause and Effect"
  },
  {
    passage: "Original statement: 'The excessive extraction of groundwater from coastal aquifers causes saltwater intrusion, rendering local borehole water undrinkable.'",
    question: "Which statement provides an accurate paraphrase of this hydrologic hazard?",
    options: [
      "Over-pumping groundwater near coasts draws in seawater, making borehole water unfit to drink.",
      "Coastal aquifers produce sweet drinking water when seawater is pumped inside.",
      "Saltwater intrusion purifies underground drinking water wells naturally.",
      "Boreholes along the coast should be pumped day and night without stopping."
    ],
    answer: "Over-pumping groundwater near coasts draws in seawater, making borehole water unfit to drink.",
    hint: "Connect over-pumping with seawater entering wells and making water undrinkable.",
    solution: "Option A captures the cause-and-effect relationship: excessive pumping draws in saltwater, making well water undrinkable.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The laboratory technician calibrated the digital electronic balance with a certified brass weight. Afterward, he placed a clean watch glass on the pan, tared the display to zero, and weighed the chemical reagent.",
    question: "What step occurred immediately following the calibration of the balance?",
    options: [
      "The technician cleaned the floor with a mop",
      "The technician placed a clean watch glass on the pan and tared the display",
      "The technician dissolved the chemicals in boiling water",
      "The technician turned off the laboratory lights"
    ],
    answer: "The technician placed a clean watch glass on the pan and tared the display",
    hint: "Identify the action marked by 'Afterward'.",
    solution: "The text states: 'Afterward, he placed a clean watch glass on the pan, tared the display to zero...'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The introduction of computerized enrollment records in public schools has streamlined admissions processing while drastically curtailing administrative paperwork errors.'",
    question: "Which option best paraphrases this school administrative reform?",
    options: [
      "Computerizing student records has made admissions faster and significantly reduced paperwork mistakes.",
      "Paperwork errors have increased since schools adopted computerized enrollment records.",
      "Public schools have banned computers to keep admissions processing manual.",
      "Admissions processing takes much longer when computers are utilized."
    ],
    answer: "Computerizing student records has made admissions faster and significantly reduced paperwork mistakes.",
    hint: "Preserve both gains: streamlined admissions and reduced paperwork errors.",
    solution: "Option A accurately reflects both outcomes: streamlining admissions and reducing paperwork errors through computerization.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "First, the welder positioned the two steel angle bars in a heavy iron clamp. Having wiped the joints with acetone, he struck an electric arc and welded the seam with smooth, overlapping passes.",
    question: "What procedure was performed before the electric arc was struck?",
    options: [
      "The welder painted the finished gate",
      "The welder positioned the angle bars in a clamp and wiped the joints with acetone",
      "The welder broke the iron clamp with a sledgehammer",
      "The welder tested the weld underwater"
    ],
    answer: "The welder positioned the angle bars in a clamp and wiped the joints with acetone",
    hint: "Review the actions that took place prior to striking the arc.",
    solution: "The sequence shows the bars were clamped and wiped with acetone before the arc was struck.",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The construction of bypass arterial ring roads around bustling commercial capitals alleviates central city traffic gridlock by diverting through-transit haulage.'",
    question: "Which statement provides a faithful paraphrase of this traffic management solution?",
    options: [
      "Building outer bypass roads reduces city center traffic jams by redirecting heavy long-distance trucks.",
      "Arterial ring roads force all heavy freight trucks to drive through the middle of city markets.",
      "Traffic gridlock in city centers is unaffected by bypass roads.",
      "Commercial capitals should ban roads completely to eliminate traffic jams."
    ],
    answer: "Building outer bypass roads reduces city center traffic jams by redirecting heavy long-distance trucks.",
    hint: "Connect bypass ring roads with diverting through-traffic and easing central gridlock.",
    solution: "Option A captures the core concept: outer bypass roads ease city center congestion by redirecting heavy transit haulage around the city.",
    target: "Paraphrasing Competence"
  },
  {
    passage: "The archivist carefully unfurled the century-old parchment using cotton gloves. She inspected the calligraphy under a magnifying glass, documented existing creases, and transferred the document into an acid-free folder.",
    question: "What was the final preservation action executed by the archivist?",
    options: [
      "Unfurling the century-old parchment with cotton gloves",
      "Transferring the document into an acid-free folder",
      "Inspecting the calligraphy under a magnifying glass",
      "Exposing the document to direct sunlight"
    ],
    answer: "Transferring the document into an acid-free folder",
    hint: "Look at the concluding action in the chronological sequence.",
    solution: "The text concludes by stating she 'documented existing creases, and transferred the document into an acid-free folder.'",
    target: "Chronological Sequencing"
  },
  {
    passage: "Original statement: 'The integration of interactive digital simulations into secondary school science pedagogy enhances conceptual comprehension by enabling learners to visualize abstract microscopic phenomena.'",
    question: "Which option best paraphrases this educational advantage?",
    options: [
      "Using digital simulations in science teaching improves understanding by helping students visualize abstract microscopic concepts.",
      "Science simulations confuse students by making simple lessons too visual.",
      "Microscopic phenomena can only be understood by memorizing written textbooks without diagrams.",
      "Secondary schools should avoid digital technology in science classrooms."
    ],
    answer: "Using digital simulations in science teaching improves understanding by helping students visualize abstract microscopic concepts.",
    hint: "Find the sentence that links digital simulations with visualizing abstract ideas and improving comprehension.",
    solution: "Option A accurately restates the advantage: digital simulations improve understanding by visualizing abstract microscopic phenomena.",
    target: "Paraphrasing Competence"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH SACRED GROVES PASSAGE (51 TO 55)
// =========================================================================
const capstone5AdvancedQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 1, what two traditional mechanisms have historically preserved sacred groves from exploitation?",
    options: [
      "Modern police patrols and military wire fences",
      "Religious taboos and customary laws enforced by traditional custodians",
      "United Nations environmental grants and foreign tourism",
      "Commercial timber concessions and mining leases"
    ],
    answer: "Religious taboos and customary laws enforced by traditional custodians",
    hint: "Scan paragraph 1 for the cultural rules that shielded these forests.",
    solution: "Paragraph 1 states explicitly that groves are 'traditionally protected by religious taboos and customary laws... designated by traditional custodians.'",
    target: "Capstone Exam: Literal Retrieval"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what crucial hydrological function do sacred groves perform for surrounding rural communities?",
    options: [
      "They generate hydroelectric power for village lights",
      "Their dense canopies serve as water catchments that preserve the perennial flow of local streams",
      "They store salt water during coastal floods",
      "They dry out muddy village footpaths"
    ],
    answer: "Their dense canopies serve as water catchments that preserve the perennial flow of local streams",
    hint: "Review paragraph 2 regarding water catchments and stream preservation.",
    solution: "Paragraph 2 notes that dense vegetative canopies act as essential water catchments that 'preserve the perennial flow of local streams that sustain rural settlements.'",
    target: "Capstone Exam: Ecological Analysis"
  },
  {
    questionNumber: 53,
    question: "As used in paragraph 2, what is the meaning of the word 'refugia' ('ecological refugia')?",
    options: [
      "Hazardous waste dumps for industrial debris",
      "Safe, protected sanctuary areas where surviving species can persist and thrive",
      "Heavily logged commercial timber farms",
      "Barren deserts devoid of plant life"
    ],
    answer: "Safe, protected sanctuary areas where surviving species can persist and thrive",
    hint: "Connect the term with 'biological islands' that shelter species that have vanished elsewhere.",
    solution: "An ecological 'refugium' (plural: refugia) is a secure environmental sanctuary where plant and animal species survive during periods of surrounding habitat destruction.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    questionNumber: 54,
    question: "What socio-cultural shift among younger generations has contributed to the degradation of sacred groves according to paragraph 3?",
    options: [
      "Younger generations have planted too many mahogany trees",
      "Traditional reverence for ancestral taboos has weakened among younger generations",
      "Younger people have banned all timber companies from village lands",
      "Young people refuse to live in urban cities"
    ],
    answer: "Traditional reverence for ancestral taboos has weakened among younger generations",
    hint: "Review paragraph 3 for how modern religious and cultural values have shifted.",
    solution: "Paragraph 3 explicitly explains: 'Traditional reverence for ancestral taboos has weakened among younger generations...'",
    target: "Capstone Exam: Inference & Sociological Analysis"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the author's primary policy recommendation in the final paragraph.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Authorities must integrate indigenous conservation into forestry frameworks.",
      "Integrating indigenous conservation mechanisms into statutory forestry frameworks across Ghana.",
      "Because sacred groves are dying, the forestry commission must definitely protect them legally.",
      "Protecting sacred groves."
    ],
    answer: "Authorities must integrate indigenous conservation into forestry frameworks.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Authorities must integrate indigenous conservation into forestry frameworks' is exactly 8 words, possesses complete Subject-Verb-Object syntax, and captures the core policy proposal. Option B is an unattached participial fragment.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB7Advanced() {
  console.log("Building 55 UNIQUE questions for Basic 7 Advanced...");
  const db = await getDb();

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50AdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_A_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B7",
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
      learningCompetency: "B7.2.1.1: Trace chronological events, understand narrative sequencing, and produce faithful paraphrases."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5AdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${sacredGrovesFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_A_${item.questionNumber}`,
      level: "B7",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: sacredGrovesFullPassage,
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

  // 3. Write to subcollection B7_advanced across all paths
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B7_advanced`);
    await targetDoc.set({
      level: "B7",
      difficulty: "advanced",
      title: "Basic 7 Advanced Lab: 50 Unique Targeted Drills + 5 Capstone Exam Questions",
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

  // 4. Synchronize into main topical document practicePool.hard for TopicalLabRunner
  console.log("\nSynchronizing main topical document practicePool.hard (keeping b7, b8, b9 only)...");
  const mappedHardQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'hard' as const,
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
            hard: mappedHardQuestions
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
      console.log(`✅ Updated main document practicePool.hard at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B7 Advanced!`);
}

deployUniqueB7Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B7 Advanced:", err);
    process.exit(1);
  });

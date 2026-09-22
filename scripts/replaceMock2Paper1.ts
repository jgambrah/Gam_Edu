process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';
import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
    const oauthClient = new OAuth2Client();
    oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
    return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
  } catch (e) {
    if (!fbAdmin.apps?.length) {
      fbAdmin.initializeApp({
        credential: fbAdmin.credential.applicationDefault(),
      });
    }
    return fbAdmin.firestore();
  }
}

interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

const freshMock2Paper1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following blood groups is designated as the universal recipient in blood transfusions?",
    "options": [
      "Group A",
      "Group B",
      "Group AB",
      "Group O"
    ],
    "correctAnswer": "Group AB",
    "hint": "Lacks both anti-A and anti-B antibodies in its plasma.",
    "workedSolution": "Blood group AB individuals have both A and B antigens on their red blood cells and produce neither anti-A nor anti-B antibodies, enabling them to receive red blood cells from any ABO blood group safely.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "The temporary hardness of water can be removed through",
    "options": [
      "boiling.",
      "filtration.",
      "chlorination.",
      "decantation."
    ],
    "correctAnswer": "boiling.",
    "hint": "Decomposes soluble calcium hydrogencarbonate into insoluble calcium carbonate.",
    "workedSolution": "Boiling decomposes dissolved calcium hydrogencarbonate into insoluble calcium carbonate precipitate (scale), water, and carbon dioxide, removing temporary hardness.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following devices operates primarily on the principle of fluid pressure?",
    "options": [
      "Windmill",
      "Bicycle pump",
      "Electric motor",
      "Convex lens"
    ],
    "correctAnswer": "Bicycle pump",
    "hint": "Compresses air to force it through a one-way valve into a tire.",
    "workedSolution": "A bicycle pump works by increasing air pressure within a cylinder to overcome the internal pressure of the tire tube, forcing air through the valve.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "An atom of an element has an atomic number of 15. How many electrons are present in its outermost shell?",
    "options": [
      "2",
      "3",
      "5",
      "8"
    ],
    "correctAnswer": "5",
    "hint": "Write the electron arrangement: 2 in the first shell, 8 in the second.",
    "workedSolution": "The atomic number 15 (Phosphorus) has an electronic configuration of 2, 8, 5. The outermost valence shell contains 5 electrons.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "What type of joint is found at the human shoulder and hip?",
    "options": [
      "Hinge joint",
      "Pivot joint",
      "Gliding joint",
      "Ball-and-socket joint"
    ],
    "correctAnswer": "Ball-and-socket joint",
    "hint": "Allows rotational movement in all planes.",
    "workedSolution": "Ball-and-socket joints consist of a spherical bone head fitting into a cup-like socket, providing rotational movement in multiple planes at the shoulder and hip.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which of the following farming practices involves growing crops and raising livestock on the same farm?",
    "options": [
      "Mixed farming",
      "Mixed cropping",
      "Crop rotation",
      "Shifting cultivation"
    ],
    "correctAnswer": "Mixed farming",
    "hint": "Integrates animal production with crop production.",
    "workedSolution": "Mixed farming is an agricultural system where arable crop production and livestock rearing are integrated on the same farm holding.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "When a person steps out of a boat onto the riverbank, the boat moves backwards into the water. This observation illustrates Newton's",
    "options": [
      "First Law of Motion.",
      "Second Law of Motion.",
      "Third Law of Motion.",
      "Law of Universal Gravitation."
    ],
    "correctAnswer": "Third Law of Motion.",
    "hint": "For every action, there is an equal and opposite reaction.",
    "workedSolution": "The backward motion of the boat is a reaction force equal and opposite to the forward action force exerted by the person's foot, illustrating Newton's Third Law.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "The process by which decomposers convert dead organic matter into ammonia in the nitrogen cycle is known as",
    "options": [
      "nitrification.",
      "ammonification.",
      "denitrification.",
      "nitrogen fixation."
    ],
    "correctAnswer": "ammonification.",
    "hint": "Breakdown of organic nitrogen compounds into ammonia.",
    "workedSolution": "Ammonification is the mineralization process where saprophytic bacteria and fungi break down organic nitrogenous waste and dead tissues into ammonia.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "An opaque object placed in front of a light source forms a shadow primarily because light",
    "options": [
      "travels in straight lines.",
      "can be completely refracted.",
      "travels faster in air than in water.",
      "can be dispersed into several colors."
    ],
    "correctAnswer": "travels in straight lines.",
    "hint": "Rectilinear propagation prevents light from bending around obstacles.",
    "workedSolution": "Because light travels in straight lines (rectilinear propagation), it cannot curve around opaque obstacles, casting an area of darkness (shadow) behind the object.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "Which part of the human tooth contains blood vessels and nerve fibers?",
    "options": [
      "Enamel",
      "Dentine",
      "Cement",
      "Pulp cavity"
    ],
    "correctAnswer": "Pulp cavity",
    "hint": "The central living core of the tooth.",
    "workedSolution": "The pulp cavity is the central living vascular chamber of the tooth containing sensory nerves, blood vessels, and connective tissue.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "A steel needle can be magnetized by placing it inside a coil carrying",
    "options": [
      "alternating current.",
      "direct current.",
      "static charge.",
      "high voltage."
    ],
    "correctAnswer": "direct current.",
    "hint": "Requires a steady unidirectional magnetic field to align magnetic domains.",
    "workedSolution": "Direct current (DC) flowing through a solenoid creates a steady, unidirectional magnetic field that aligns the magnetic domains in steel, magnetizing it.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "Which of the following plant nutrients is classified as a micronutrient?",
    "options": [
      "Nitrogen",
      "Phosphorus",
      "Potassium",
      "Zinc"
    ],
    "correctAnswer": "Zinc",
    "hint": "Required by plants in trace amounts.",
    "workedSolution": "Zinc, copper, iron, and boron are plant micronutrients required in trace quantities. Nitrogen, phosphorus, and potassium are primary macronutrients.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "The conversion of atmospheric water vapor directly into liquid clouds is termed",
    "options": [
      "evaporation.",
      "condensation.",
      "precipitation.",
      "transpiration."
    ],
    "correctAnswer": "condensation.",
    "hint": "Phase change from gas to liquid.",
    "workedSolution": "Condensation is the physical phase change where ascending water vapor cools and transforms into liquid water droplets that form clouds.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Which structure of the human ear is responsible for maintaining dynamic body balance?",
    "options": [
      "Cochlea",
      "Tympanic membrane",
      "Eustachian tube",
      "Semicircular canals"
    ],
    "correctAnswer": "Semicircular canals",
    "hint": "Three fluid-filled loops oriented at right angles.",
    "workedSolution": "The three fluid-filled semicircular canals in the inner ear detect rotational head movements and help maintain dynamic body balance.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "An example of an incomplete metamorphosis is observed in the life cycle of the",
    "options": [
      "mosquito.",
      "housefly.",
      "butterfly.",
      "grasshopper."
    ],
    "correctAnswer": "grasshopper.",
    "hint": "Development proceeds through egg, nymph, and adult without a pupa.",
    "workedSolution": "Grasshoppers undergo incomplete metamorphosis involving three stages: Egg -> Nymph -> Adult, lacking a pupal stage.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which of the following substances forms a colloidal dispersion when mixed with water?",
    "options": [
      "Milk powder",
      "Sodium chloride",
      "Cane sugar",
      "Clean quartz sand"
    ],
    "correctAnswer": "Milk powder",
    "hint": "Exhibits intermediate particle size and scatters light.",
    "workedSolution": "Milk is a colloid (emulsion) containing fat and protein particles dispersed uniformly in water that scatter light without settling quickly.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "A force of 120 N moves a trolley through a distance of 5 m. Calculate the work done on the trolley.",
    "options": [
      "24 J",
      "125 J",
      "600 J",
      "1200 J"
    ],
    "correctAnswer": "600 J",
    "hint": "Work done = Force x Distance.",
    "workedSolution": "Work Done = Force x Distance = 120 N x 5 m = 600 J.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "The feeling of moist soil between the thumb and fingers is used by farmers to determine soil",
    "options": [
      "texture.",
      "structure.",
      "profile.",
      "fertility."
    ],
    "correctAnswer": "texture.",
    "hint": "Determines the relative proportion of sand, silt, and clay particles.",
    "workedSolution": "The finger-feel method is a field technique used to determine soil texture by assessing grittiness (sand), silkiness (silt), or stickiness (clay).",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which gas in the atmosphere is the most abundant by volume?",
    "options": [
      "Oxygen",
      "Nitrogen",
      "Carbon dioxide",
      "Argon"
    ],
    "correctAnswer": "Nitrogen",
    "hint": "Makes up approximately 78% of air.",
    "workedSolution": "Nitrogen gas constitutes approximately 78% of the Earth's atmosphere by volume, making it the most abundant atmospheric gas.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "A child suffering from swollen bleeding gums and loose teeth is most likely deficient in",
    "options": [
      "Vitamin A.",
      "Vitamin B.",
      "Vitamin C.",
      "Vitamin D."
    ],
    "correctAnswer": "Vitamin C.",
    "hint": "Known as ascorbic acid; deficiency causes scurvy.",
    "workedSolution": "Scurvy is caused by a deficiency of Vitamin C (ascorbic acid), which is required for collagen synthesis, leading to bleeding gums and poor wound healing.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "What happens to the volume of a given mass of water when it is heated from 0°C to 4°C?",
    "options": [
      "It increases continuously.",
      "It decreases.",
      "It remains constant.",
      "It doubles immediately."
    ],
    "correctAnswer": "It decreases.",
    "hint": "Anomalous expansion causes water to reach maximum density at 4°C.",
    "workedSolution": "Between 0°C and 4°C, water contracts rather than expands (anomalous expansion). Its volume decreases and reaches minimum volume (maximum density) at 4°C.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Which instrument is used to determine the relative humidity of the atmosphere?",
    "options": [
      "Hydrometer",
      "Barometer",
      "Anemometer",
      "Hygrometer"
    ],
    "correctAnswer": "Hygrometer",
    "hint": "Often consists of wet-and-dry bulb thermometers.",
    "workedSolution": "A hygrometer (such as a wet-and-dry bulb psychrometer) measures relative humidity. Barometers measure pressure; hydrometers measure liquid density.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "The transfer of pollen grains from the anther of one plant to the stigma of a flower on a different plant of the same species is called",
    "options": [
      "self-pollination.",
      "cross-pollination.",
      "fertilization.",
      "germination."
    ],
    "correctAnswer": "cross-pollination.",
    "hint": "Transfer between two distinct plants of the same species.",
    "workedSolution": "Cross-pollination is the transfer of pollen grains from the anther of one plant to the receptive stigma of a flower on another plant of the same species.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "What is the systematic name of the compound with the formula Cu₂O?",
    "options": [
      "Copper(I) oxide",
      "Copper(II) oxide",
      "Copper dioxide",
      "Copper trioxide"
    ],
    "correctAnswer": "Copper(I) oxide",
    "hint": "Copper has an oxidation state of +1 in this compound.",
    "workedSolution": "In Cu₂O, oxygen has a valency of -2, meaning each copper atom carries a +1 charge. Its systematic IUPAC name is Copper(I) oxide.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Which of the following farm animals is classified as a ruminant?",
    "options": [
      "Pig",
      "Rabbit",
      "Domestic fowl",
      "Sheep"
    ],
    "correctAnswer": "Sheep",
    "hint": "Possesses a four-chambered stomach and chews cud.",
    "workedSolution": "Sheep (along with goats and cattle) are ruminants with a four-chambered stomach (rumen, reticulum, omasum, abomasum). Pigs, rabbits, and fowls are non-ruminants.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "An electric iron rated 1000 W is used for 3 hours. Calculate the energy consumed in kilowatt-hours.",
    "options": [
      "0.3 kWh",
      "3.0 kWh",
      "30.0 kWh",
      "300.0 kWh"
    ],
    "correctAnswer": "3.0 kWh",
    "hint": "Energy = Power (in kW) x Time (in hours).",
    "workedSolution": "Power in kW = 1000 W / 1000 = 1.0 kW. Energy = 1.0 kW x 3 h = 3.0 kWh.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Soil water that rises through tiny pore spaces against the pull of gravity does so by",
    "options": [
      "capillarity.",
      "leaching.",
      "drainage.",
      "sedimentation."
    ],
    "correctAnswer": "capillarity.",
    "hint": "Adhesive and cohesive forces pull water through narrow pores.",
    "workedSolution": "Capillarity is the upward movement of water through narrow soil micropores caused by adhesion between water and soil particles and water cohesion.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which of the following elements is a noble gas?",
    "options": [
      "Chlorine",
      "Nitrogen",
      "Hydrogen",
      "Neon"
    ],
    "correctAnswer": "Neon",
    "hint": "Group 18 element with a complete outer octet of 8 electrons.",
    "workedSolution": "Neon is a noble gas (Group 18) with a stable, complete outer shell of 8 valence electrons (2, 8), making it chemically unreactive.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "The main reason for pruning tomato plants during cultivation is to",
    "options": [
      "prevent soil erosion.",
      "improve fruit size and quality.",
      "reduce the rate of pollination.",
      "kill weed seeds around the base."
    ],
    "correctAnswer": "improve fruit size and quality.",
    "hint": "Removes excess vegetative side shoots to direct nutrients to fruits.",
    "workedSolution": "Pruning removes unwanted suckers and excess leafy foliage, directing the plant's nutrients toward developing larger, healthier fruits.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "In which part of the female reproductive system does fertilization usually occur?",
    "options": [
      "Ovary",
      "Uterus",
      "Fallopian tube",
      "Vagina"
    ],
    "correctAnswer": "Fallopian tube",
    "hint": "The muscular oviduct linking ovary to uterus.",
    "workedSolution": "Fertilization (the fusion of sperm and ovum nuclei) normally takes place within the upper third of the Fallopian tube (oviduct).",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "A rectangular block of weight 300 N rests on a table with a contact area of 0.5 m². What pressure is exerted on the table?",
    "options": [
      "150 Pa",
      "300 Pa",
      "600 Pa",
      "1500 Pa"
    ],
    "correctAnswer": "600 Pa",
    "hint": "Pressure = Force / Area.",
    "workedSolution": "Pressure = Force / Area = 300 N / 0.5 m² = 600 Pa.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "The process of removing unproductive or sick birds from a poultry flock is known as",
    "options": [
      "culling.",
      "candling.",
      "debeaking.",
      "brooding."
    ],
    "correctAnswer": "culling.",
    "hint": "Separates poor producers to save feed and control disease.",
    "workedSolution": "Culling is the identification and removal of unproductive, diseased, or defective birds from a flock to maintain health and profitability.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which of the following materials is an electrical insulator?",
    "options": [
      "Copper wire",
      "Aluminum foil",
      "Graphite rod",
      "Vulcanized rubber"
    ],
    "correctAnswer": "Vulcanized rubber",
    "hint": "Lacks free mobile electrons to conduct current.",
    "workedSolution": "Rubber has no free mobile electrons and exhibits high electrical resistance, making it an effective electrical insulator. Copper, aluminum, and graphite conduct electricity.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "What is the valency of Aluminum in the compound Al₂O₃?",
    "options": [
      "1",
      "2",
      "3",
      "6"
    ],
    "correctAnswer": "3",
    "hint": "Check the subscript cross-over with oxygen (valency 2).",
    "workedSolution": "In Al₂O₃, oxygen has a valency of 2 and aluminum has a combining power (valency) of 3, forming Al³⁺ ions.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "The movement of digested food molecules from the small intestine into the bloodstream occurs by",
    "options": [
      "filtration.",
      "transpiration.",
      "diffusion.",
      "evaporation."
    ],
    "correctAnswer": "diffusion.",
    "hint": "Molecules move from a higher concentration to a lower concentration across villi.",
    "workedSolution": "Soluble nutrients (glucose, amino acids) pass from the lumen of the ileum across the epithelium of the villi into blood capillaries by diffusion and active transport.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which of the following methods is used to separate a mixture of iodine and sodium chloride?",
    "options": [
      "Sublimation",
      "Filtration",
      "Evaporation",
      "Decantation"
    ],
    "correctAnswer": "Sublimation",
    "hint": "Iodine transitions directly from solid to gas on gentle heating.",
    "workedSolution": "Iodine sublimes on heating into purple vapor and deposits as pure crystals on a cold surface, leaving non-volatile sodium chloride behind.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "A body of mass 4 kg is moving with a uniform velocity of 5 m s⁻¹. Calculate its kinetic energy.",
    "options": [
      "10 J",
      "20 J",
      "50 J",
      "100 J"
    ],
    "correctAnswer": "50 J",
    "hint": "K.E. = 1/2 x m x v².",
    "workedSolution": "K.E. = 0.5 x 4 kg x (5 m s⁻¹)² = 2 x 25 = 50 J.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "The primary vector responsible for the transmission of river blindness is the",
    "options": [
      "tsetse fly.",
      "black fly.",
      "housefly.",
      "mosquito."
    ],
    "correctAnswer": "black fly.",
    "hint": "Breeds in fast-flowing rivers and transmits Onchocerca volvulus.",
    "workedSolution": "River blindness (onchocerciasis) is transmitted to humans by the bite of the black fly (*Simulium damnosum*), which breeds along fast-flowing rivers.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "Which color change is observed when dilute sodium hydroxide solution is tested with phenolphthalein indicator?",
    "options": [
      "Colorless to pink",
      "Pink to colorless",
      "Blue to red",
      "Yellow to red"
    ],
    "correctAnswer": "Colorless to pink",
    "hint": "Phenolphthalein turns pink in alkaline solutions (pH > 8.2).",
    "workedSolution": "Phenolphthalein is colorless in acidic and neutral solutions but turns pink or magenta in basic (alkaline) solutions like sodium hydroxide.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "An example of a second-class lever used on a building site is the",
    "options": [
      "crowbar.",
      "claw hammer.",
      "pair of pliers.",
      "wheelbarrow."
    ],
    "correctAnswer": "wheelbarrow.",
    "hint": "The load is positioned between the wheel axle (fulcrum) and handles (effort).",
    "workedSolution": "In a wheelbarrow, the load basin is situated between the front wheel axle (pivot) and the lifting handles (effort), making it a Class 2 lever.",
    "points": 1
  }
];

async function updateMock2Paper1() {
  console.log('Replacing Paper 1 in mock_exams/mock_2 with fresh, balanced questions...');

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  freshMock2Paper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Paper 1 Key Distribution:', keyDist);

  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Key balancing failed!');
  }

  const db = await getDb();
  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_2');
  await docRef.set({
    paper1: {
      title: "Paper 1: Objective Test (Mock 2 - Recalibrated)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: freshMock2Paper1
    },
    metadata: {
      paper1RefreshedAt: new Date(),
      optionsBalanced: true
    }
  }, { merge: true });

  console.log('✅ Mock 2 Paper 1 successfully replaced in Firestore.');
}

updateMock2Paper1()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to update Mock 2 Paper 1:', err);
    process.exit(1);
  });

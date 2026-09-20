import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const adminInstance: any = (admin as any).default || admin;

async function getFirestore(): Promise<any> {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.split(String.fromCharCode(92) + 'n').join(String.fromCharCode(10)) : undefined;
  const serviceAccountEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

  if (!adminInstance.apps?.length) {
    if (clientEmail && privateKey) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert({ projectId, clientEmail, privateKey }),
        projectId
      });
      return adminInstance.firestore();
    } else if (serviceAccountEnv && fs.existsSync(serviceAccountEnv)) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert(serviceAccountEnv),
        projectId
      });
      return adminInstance.firestore();
    } else if (fs.existsSync(fallbackKeyPath)) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert(fallbackKeyPath),
        projectId
      });
      return adminInstance.firestore();
    }
  } else {
    return adminInstance.firestore();
  }

  try {
    const { Firestore } = require('@google-cloud/firestore');
    const { OAuth2Client } = require('google-auth-library');
    const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({
        access_token: tokenObj.access_token,
        refresh_token: account.tokens.refresh_token
      });
      return new Firestore({
        projectId: 'gamedu-69888475-f5783',
        authClient: oauthClient
      });
    }
  } catch (e) {
    console.log('Falling back to default initialization...');
  }

  adminInstance.initializeApp({
    credential: adminInstance.credential.applicationDefault(),
    projectId
  });
  return adminInstance.firestore();
}

// Vector SVGs
const svgQ1aElevatedBall = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 220' width='100%' height='200' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='30' y1='55' x2='180' y2='55' stroke='#94a3b8' stroke-width='4'/><line x1='180' y1='55' x2='180' y2='190' stroke='#94a3b8' stroke-width='4'/><line x1='180' y1='190' x2='330' y2='190' stroke='#64748b' stroke-width='4'/><text x='95' y='45' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>First Floor Level</text><text x='260' y='205' font-size='11' font-weight='bold' fill='#94a3b8' text-anchor='middle'>Ground Surface</text><circle cx='165' cy='38' r='16' fill='#0284c7' stroke='#38bdf8' stroke-width='2'/><text x='165' y='42' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>m = 5 kg</text><line x1='110' y1='38' x2='140' y2='38' stroke='#f59e0b' stroke-width='2.5'/><polygon points='136,34 145,38 136,42' fill='#f59e0b'/><text x='125' y='28' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Push</text><path d='M 185 45 Q 215 55 215 180' fill='none' stroke='#ef4444' stroke-width='2' stroke-dasharray='4,3'/><polygon points='210,175 215,185 220,175' fill='#ef4444'/><line x1='245' y1='55' x2='245' y2='190' stroke='#38bdf8' stroke-width='1.5'/><line x1='238' y1='55' x2='252' y2='55' stroke='#38bdf8' stroke-width='1.5'/><line x1='238' y1='190' x2='252' y2='190' stroke='#38bdf8' stroke-width='1.5'/><text x='255' y='125' font-size='12' font-weight='bold' fill='#38bdf8'>h = 20 m</text></svg></div>`;
const svgQ1bTeethAnatomy = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 220' width='100%' height='200' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(50, 20)'><path d='M 20 20 L 70 20 L 65 80 L 25 80 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/><line x1='23' y1='80' x2='67' y2='80' stroke='#f43f5e' stroke-width='2'/><path d='M 25 80 L 40 160 L 50 160 L 65 80 Z' fill='#fed7aa' stroke='#ea580c' stroke-width='1.8'/><text x='45' y='185' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Tooth A</text></g><g transform='translate(200, 20)'><path d='M 45 10 L 75 45 L 68 80 L 22 80 L 15 45 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/><circle cx='45' cy='10' r='2' fill='#ef4444'/><line x1='20' y1='80' x2='70' y2='80' stroke='#f43f5e' stroke-width='2'/><path d='M 22 80 L 40 170 L 50 170 L 68 80 Z' fill='#fed7aa' stroke='#ea580c' stroke-width='1.8'/><text x='45' y='185' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Tooth B</text></g><g transform='translate(135, 20)'><line x1='5' y1='20' x2='5' y2='75' stroke='#38bdf8' stroke-width='1.5'/><text x='12' y='50' font-size='11' font-weight='bold' fill='#38bdf8'>I</text><line x1='0' y1='80' x2='25' y2='80' stroke='#f43f5e' stroke-width='1.5'/><text x='28' y='83' font-size='10' font-weight='bold' fill='#f43f5e'>II</text><line x1='5' y1='85' x2='5' y2='165' stroke='#fb923c' stroke-width='1.5'/><text x='12' y='130' font-size='11' font-weight='bold' fill='#fb923c'>III</text></g></svg></div>`;
const svgQ1dPhaseChanges = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='20' y='65' width='80' height='50' rx='6' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><text x='60' y='90' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>ICE</text><text x='60' y='104' font-size='9' fill='#94a3b8' text-anchor='middle'>(Solid State)</text><rect x='150' y='65' width='80' height='50' rx='6' fill='#1e293b' stroke='#10b981' stroke-width='2'/><text x='190' y='90' font-size='12' font-weight='bold' fill='#10b981' text-anchor='middle'>WATER</text><text x='190' y='104' font-size='9' fill='#94a3b8' text-anchor='middle'>(Liquid State)</text><rect x='280' y='65' width='80' height='50' rx='6' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='320' y='90' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>STEAM</text><text x='320' y='104' font-size='9' fill='#94a3b8' text-anchor='middle'>(Gaseous State)</text><line x1='102' y1='75' x2='146' y2='75' stroke='#ef4444' stroke-width='2'/><polygon points='142,71 148,75 142,79' fill='#ef4444'/><text x='125' y='68' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>I</text><line x1='232' y1='75' x2='276' y2='75' stroke='#ef4444' stroke-width='2'/><polygon points='272,71 278,75 272,79' fill='#ef4444'/><text x='255' y='68' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>II</text><line x1='276' y1='105' x2='232' y2='105' stroke='#38bdf8' stroke-width='2'/><polygon points='236,101 230,105 236,109' fill='#38bdf8'/><text x='255' y='125' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text><line x1='146' y1='105' x2='102' y2='105' stroke='#38bdf8' stroke-width='2'/><polygon points='106,101 100,105 106,109' fill='#38bdf8'/><text x='125' y='125' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>IV</text><text x='190' y='160' font-size='9' font-weight='bold' fill='#94a3b8' text-anchor='middle'>INTER-CONVERSION OF STATES OF MATTER</text></svg></div>`;
const svgQ4cForwardBiasedDiode = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 160' width='100%' height='145' style='max-width: 430px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='40' x2='120' y2='40' stroke='#94a3b8' stroke-width='2'/><line x1='120' y1='25' x2='120' y2='55' stroke='#10b981' stroke-width='3'/><text x='112' y='22' font-size='11' font-weight='bold' fill='#10b981'>+</text><line x1='130' y1='32' x2='130' y2='48' stroke='#ef4444' stroke-width='4'/><text x='136' y='22' font-size='11' font-weight='bold' fill='#ef4444'>-</text><line x1='130' y1='40' x2='300' y2='40' stroke='#94a3b8' stroke-width='2'/><line x1='300' y1='40' x2='300' y2='120' stroke='#94a3b8' stroke-width='2'/><line x1='300' y1='120' x2='230' y2='120' stroke='#94a3b8' stroke-width='2'/><rect x='170' y='110' width='50' height='20' rx='2' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='195' y='124' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>R</text><line x1='170' y1='120' x2='130' y2='120' stroke='#94a3b8' stroke-width='2'/><polygon points='95,110 120,120 95,130' fill='#38bdf8' stroke='#0284c7'/><line x1='120' y1='108' x2='120' y2='132' stroke='#38bdf8' stroke-width='3'/><text x='92' y='145' font-size='10' font-weight='bold' fill='#10b981'>P (Anode)</text><text x='125' y='145' font-size='10' font-weight='bold' fill='#ef4444'>N (Cathode)</text><line x1='95' y1='120' x2='40' y2='120' stroke='#94a3b8' stroke-width='2'/><line x1='40' y1='120' x2='40' y2='40' stroke='#94a3b8' stroke-width='2'/></svg></div>`;

const paper2Science2021Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `The diagram below illustrates a bowling ball of mass $m = 5.0\\text{ kg}$ resting on the edge of the first-floor balcony of a building at a vertical height $h = 20.0\\text{ m}$ above the ground. The ball is nudged gently and falls freely under gravity to the ground below:

${svgQ1aElevatedBall}

(i) Name the specific form of mechanical energy possessed by the ball while stationary on the first floor.

(ii) State the name of the downward gravitational force acting on the ball as it accelerates toward the ground.

(iii) Calculate the magnitude of the potential energy possessed by the ball on the first floor. [Take acceleration due to gravity, $g = 10\\text{ m s}^{-2}$].

(iv) State the continuous energy transformation taking place as the ball falls from the balcony toward the ground.

(v) Applying the law of conservation of mechanical energy, calculate the velocity of the ball just before it strikes the ground.

(vi) Name two fundamental or contact forces in nature other than the gravitational force identified in (a)(ii).`,
        workedSolution: `(i) Form of mechanical energy:
Gravitational Potential Energy (P.E.).

(ii) Name of downward force:
Gravitational force (or weight of the ball, $W = mg$).

(iii) Potential energy calculation:
Formula:
$$\\text{P.E.} = mgh$$
Substitute the given parameters ($m = 5.0\\text{ kg}$, $g = 10\\text{ m s}^{-2}$, $h = 20.0\\text{ m}$):
$$\\text{P.E.} = 5.0 \\times 10 \\times 20.0 = 1,000\\text{ J}$$
Answer: $1,000\\text{ Joules (J)}$.

(iv) Energy transformation during free-fall:
Gravitational Potential Energy is continuously converted into Kinetic Energy ($P.E. \\to K.E.$).

(v) Velocity calculation:
By the Law of Conservation of Energy, loss in $P.E.$ equals gain in $K.E.$:
$$mgh = \\frac{1}{2}mv^2 \\implies v = \\sqrt{2gh}$$
Substitute values ($g = 10\\text{ m s}^{-2}$, $h = 20.0\\text{ m}$):
$$v = \\sqrt{2 \\times 10 \\times 20} = \\sqrt{400} = 20\\text{ m s}^{-1}$$
Answer: $20\\text{ m s}^{-1}$.

(vi) Other types of force:
1. Frictional force
2. Electrostatic force
3. Magnetic force
4. Upthrust (buoyant force)
5. Tension / Centripetal force`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagrams below illustrate two distinct types of mammalian teeth found in the human dentition:

${svgQ1bTeethAnatomy}

(i) Name the specific type of tooth represented by:
  (α) Tooth A;
  (β) Tooth B.

(ii) Identify each of the three morphological regions labelled I, II, and III.

(iii) State two observable structural differences between Tooth A and Tooth B.

(iv) State the primary functional role performed by each tooth during the mechanical breakdown of food:
  (α) Tooth A;
  (β) Tooth B.

(v) State two oral hygiene practices recommended to maintain healthy teeth and gums.`,
        workedSolution: `(i) Name of teeth:
• (α) Tooth A: Incisor
• (β) Tooth B: Canine

(ii) Morphological regions:
• I: Crown (the visible enamel-covered portion above the gum line)
• II: Neck (the narrow transitional zone at the gum margin)
• III: Root (the region embedded firmly within the alveolar jawbone socket)

(iii) Structural differences:
1. Crown shape: Tooth A has a flat, broad, horizontal chisel-like cutting edge, whereas Tooth B has a single, sharp, pointed conical cusp.
2. Root morphology: Tooth B possesses a longer, more robust single root compared to the relatively shorter root of Tooth A.

(iv) Functions:
• (α) Tooth A (Incisor): Biting, cutting, and shearing off pieces of food.
• (β) Tooth B (Canine): Piercing, gripping, and tearing tough, fibrous food materials (such as meat).

(v) Oral care practices:
1. Brushing teeth thoroughly twice daily with a fluoride toothpaste using a soft-bristled brush.
2. Daily flossing to remove plaque and food particles trapped between teeth.
3. Reducing the intake of refined sugary sweets, sodas, and sticky carbohydrates.
4. Regular clinical visits to a dentist for prophylactic cleanings and cavity checks.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `The following names correspond to common horticultural vegetable crops cultivated in Ghana:
**Tomato, Carrot, Onion, Sweet Pepper, Cabbage, and Garden Egg.**

(i) Classify each of the vegetables into:
  (α) Fruit vegetables;
  (β) Leafy vegetables;
  (γ) Root and bulb vegetables.

(ii) Name the specific planting material (seed, bulb, or cutting) used for propagating:
  (α) Onion;
  (β) Tomato.

(iii) State the primary edible botanical portion consumed by humans for:
  (α) Carrot;
  (β) Cabbage.

(iv) State two field cultural practices routinely carried out during the cultivation of tomato plants to:
  (α) prevent fungal fruit rot and support weak stems;
  (β) encourage the development of larger, premium fruits.`,
        workedSolution: `(i) Classification of vegetables:
• (α) Fruit vegetables: Tomato, Sweet Pepper, Garden Egg.
• (β) Leafy vegetables: Cabbage.
• (γ) Root and bulb vegetables: Carrot (taproot) and Onion (bulb).

(ii) Propagating materials:
• (α) Onion: Sets (small bulbs) or true botanical seeds.
• (β) Tomato: Viable true seeds (raised in nursery beds).

(iii) Edible botanical portions:
• (α) Carrot: Modified swollen taproot.
• (β) Cabbage: Enlarged, compact vegetative foliage bud (leaves).

(iv) Cultural practices on tomato:
• (α) To prevent fruit rot and support weak stems: Staking (tying stems to sturdy wooden or bamboo poles) and mulching.
• (β) To increase fruit size: Pruning / pinching out (selectively removing lateral auxiliary shoots and thinning excessive flower clusters).`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `The diagram below illustrates the physical inter-conversion of water through its three distinct states of matter:

${svgQ1dPhaseChanges}

(i) State the precise physical phase change taking place at each of the stages labelled I, II, III, and IV.

(ii) Identify the two stages in which thermal heat energy is absorbed by the water molecules (endothermic process).

(iii) Identify the two stages in which thermal heat energy is released to the surrounding environment (exothermic process).

(iv) What happens to the measured temperature of the water during:
  (α) Stage I (while ice is actively melting);
  (β) Stage IV (while water is actively freezing)?

(v) Describe the spatial arrangement and movement of water molecules in solid ice.`,
        workedSolution: `(i) Physical phase changes:
• Stage I: Melting (or Fusion) [Solid $\\to$ Liquid]
• Stage II: Boiling (or Evaporation / Vaporization) [Liquid $\\to$ Gas]
• Stage III: Condensation (or Liquefaction) [Gas $\\to$ Liquid]
• Stage IV: Freezing (or Solidification) [Liquid $\\to$ Solid]

(ii) Stages where heat is added (absorbed):
Stage I (Melting) and Stage II (Boiling) [absorbs latent heat of fusion and vaporization].

(iii) Stages where heat is removed (released):
Stage III (Condensation) and Stage IV (Freezing) [releases latent heat].

(iv) Temperature behavior:
• (α) Stage I: Temperature remains strictly constant at $0^\\circ\\text{C}$ until all ice has melted completely.
• (β) Stage IV: Temperature remains strictly constant at $0^\\circ\\text{C}$ until all liquid has solidified.

(v) Molecular arrangement in ice:
Water molecules are arranged in a rigid, ordered, hexagonal open crystal lattice held by fixed intermolecular hydrogen bonds. The particles cannot move from place to place and vibrate only in fixed positions.`,
        maxMarks: 10
      }
    ]
  },

  // ==========================================
  // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER 4 ONLY)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "List four atmospheric physical elements that collectively define the climate of a geographic region.",
        workedSolution: `1. Atmospheric Temperature
2. Rainfall / Precipitation
3. Atmospheric Pressure
4. Relative Humidity
5. Wind velocity (speed and direction)
6. Solar sunshine duration and light intensity`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) Name the four primary floral whorls that constitute a complete angiosperm flower.\n\n(ii) State the reproductive function of one of the whorls named in (b)(i).",
        workedSolution: `(i) Four floral parts (whorls):
1. Calyx (consisting of sepals)
2. Corolla (consisting of petals)
3. Androecium (the male stamens: anther and filament)
4. Gynoecium / Pistil (the female carpels: stigma, style, and ovary)

(ii) Functional role:
• Corolla (Petals): Brightly coloured and scented to attract insect pollinators like bees for cross-pollination.
• Androecium (Stamens): Synthesizes and disperses pollen grains containing male gametes.
• Gynoecium (Carpel): Receives pollen on the sticky stigma, facilitates fertilization, and matures into seed-bearing fruit.
• Calyx (Sepals): Protects the delicate inner floral bud prior to opening.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "(i) Explain briefly the agronomic meaning of the term thinning out in vegetable crop husbandry.\n\n(ii) State one practical reason why selective pruning of lateral shoots is important in crop production.",
        workedSolution: `(i) Thinning out:
The selective manual removal of weak, overcrowded, or malformed excess seedlings from a seedbed or planting station to achieve recommended spacing and eliminate inter-plant competition for light, water, and soil nutrients.

(ii) Importance of pruning:
Improves air circulation and sunlight penetration through the crop canopy (reducing fungal blight diseases) and redirects photosynthetic nutrients away from vegetative leaves toward the development of larger, higher-yielding fruits.`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "(i) What is a chemical change?\n\n(ii) Name one universal polar solvent capable of dissolving crystalline cane sugar.",
        workedSolution: `(i) Chemical change:
A chemical reaction in which chemical bonds are broken and formed, resulting in the production of one or more entirely new substances with different chemical compositions and properties, which is permanent and irreversible by physical means.

(ii) Solvent for sugar:
Water ($\\text{H}_2\\text{O}$).`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) State two recognized farming systems practiced in West African agriculture.\n\n(ii) State three physical, environmental, or socio-economic factors that account for differences in farming systems across different geographic regions.",
        workedSolution: `(i) Farming systems:
Crop rotation, Mixed farming, Land rotation (bush fallowing), Mixed cropping, or Organic farming.

(ii) Factors determining farming systems:
1. Climatic factors: Annual rainfall distribution, ambient temperature, and length of the vegetative growing season.
2. Soil characteristics: Soil fertility, drainage capacity, topography, and erosion susceptibility.
3. Land availability and population density: High population pressure limits land fallowing and necessitates intensive continuous cropping.
4. Capital, technology, and market access: Availability of mechanical tractors, irrigation infrastructure, and commercial market demand.`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "Using scientific principles of friction and road safety, explain briefly why motor vehicles should never be operated with smooth, worn-out tyres.",
        workedSolution: `Tyre treads are designed with deep grooves to channel away rainwater and maintain direct contact between tyre rubber and the asphalt road. 
Worn-out, smooth tyres lack tread depth and cannot displace water, creating a thin film of liquid between the tyre and the road (hydroplaning). This drastically reduces the coefficient of friction, resulting in loss of traction, longer braking distances, and severe skidding that can lead to fatal road collisions.`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "(i) What is vegetative propagation in plant reproduction?\n\n(ii) Name the specific vegetative organ used to propagate each of the following crop plants:\n  (α) Bulb onion;\n  (β) Cocoyam.",
        workedSolution: `(i) Vegetative propagation:
An asexual form of plant reproduction in which a new independent plant develops from a specialized vegetative structure (stem, root, leaf, or bud) of the parent plant without the fusion of gametes or production of seeds.

(ii) Vegetative organs:
• (α) Bulb onion: Bulb (swollen underground shoot with fleshy scale leaves).
• (β) Cocoyam: Corm (or cormels / underground swollen stem base).`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "A neutral atom of calcium has an atomic number of 20 ($Ca = 20$). State its electronic configuration across Bohr energy shells and describe its distribution.",
        workedSolution: `Configuration:
Atomic number $Z = 20 \\implies 20\\text{ electrons}$.
Filling energy shells in sequence:
• Shell 1 (K): 2 electrons
• Shell 2 (L): 8 electrons
• Shell 3 (M): 8 electrons
• Shell 4 (N): 2 valence electrons
Configuration: $$2, 8, 8, 2$$

Description:
The innermost shell contains 2 electrons, the second shell contains 8 electrons, the third shell contains 8 electrons, and the outermost valence shell contains 2 electrons.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "In a laboratory investigation into the conditions required for the corrosion of iron nails, one sealed test tube contained anhydrous calcium chloride:\n(i) State the chemical role played by the anhydrous calcium chloride granules.\n(ii) State one essential environmental condition necessary for the rusting of iron.",
        workedSolution: `(i) Role of anhydrous calcium chloride:
Acts as a drying agent (desiccant) that absorbs all water vapour and moisture from the air within the tube, maintaining a completely dry air environment.

(ii) Condition necessary for rusting:
The presence of oxygen gas (air) or the presence of moisture (liquid water). *(Both must be present simultaneously for rusting to occur).*`,
        maxMarks: 2
      },
      {
        subId: "(b)",
        prompt: "(i) What are dietary vitamins in animal nutrition?\n\n(ii) Name the specific nutritional deficiency disease associated with a prolonged lack of:\n  (α) Vitamin A;\n  (β) Vitamin D.",
        workedSolution: `(i) Definition of vitamins:
Essential organic micronutrients required by the body in minute quantities to catalyze metabolic biochemical reactions, maintain physiological health, and boost immune defense, which cannot be synthesized in adequate quantities by the organism.

(ii) Deficiency diseases:
• (α) Vitamin A (Retinol): Night blindness (Nyctalopia) / Xerophthalmia.
• (β) Vitamin D (Calciferol): Rickets in growing children (or Osteomalacia in adults).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `With the aid of a circuit diagram, explain briefly the term forward bias as applied to a semiconductor p-n junction diode:

${svgQ4cForwardBiasedDiode}`,
        workedSolution: `Explanation:
Forward bias occurs when an external direct current (DC) power source is connected such that its positive terminal is linked to the p-type semiconductor material (anode) and its negative terminal is linked to the n-type semiconductor material (cathode) of the diode.

Operation:
The external positive potential repels positive holes in the p-region toward the junction, while the negative terminal repels electrons in the n-region toward the junction. This opposes and collapses the internal depletion layer, reducing junction resistance and permitting electric current to flow freely through the circuit.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: "Give two examples each of:\n(i) Elementary simple machines;\n(ii) Compound (complex) machines.",
        workedSolution: `(i) Simple machines:
1. Crowbar (or lever)
2. Wheel and axle
3. Single fixed pulley
4. Inclined plane (ramp)
5. Screw / Wedge

(ii) Compound (complex) machines:
1. Bicycle
2. Motor vehicle (car or tractor)
3. Sewing machine
4. Wheelbarrow (incorporates both a lever and a wheel-and-axle)
5. Electric lawnmower`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "State three environmental conditions essential for the germination of viable crop seeds.",
        workedSolution: `1. Water (moisture): Softens the protective seed coat, hydrates protoplasm, and activates dormant metabolic digestive enzymes.
2. Oxygen (air): Drives aerobic cellular respiration in the embryo cells to generate ATP energy for seedling growth.
3. Suitable temperature (warmth): Provides the optimum thermal kinetic energy required for enzymatic reactions (typically between $20^\\circ\\text{C}$ and $35^\\circ\\text{C}$). `,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "State three agronomic benefits of regular field weeding in a vegetable crop farm.",
        workedSolution: `1. Eliminates fierce weed competition for soil mineral nutrients, capillary moisture, and sunlight.
2. Destroys alternative secondary host plants that shelter destructive insect vectors and fungal pathogens.
3. Facilitates unrestricted air circulation through the crop rows and eases harvesting operations.
4. Prevents weed root exudates from inhibiting crop growth.`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "Describe briefly how chemical ions are formed from neutral parent atoms during chemical bonding.",
        workedSolution: `Ions are formed when neutral atoms lose or gain valence electrons to achieve a stable electronic configuration (duplet or octet):
• Cations (positive ions): Metallic atoms with 1, 2, or 3 valence electrons lose their outer electrons; because positive nuclear protons now outnumber orbiting electrons, they acquire a net positive charge (e.g., $\\text{Na} \\to \\text{Na}^+ + e^-$).
• Anions (negative ions): Non-metallic atoms with 5, 6, or 7 valence electrons gain extra electrons into their outer shell; because negative electrons now outnumber positive protons, they acquire a net negative charge (e.g., $\\text{Cl} + e^- \\to \\text{Cl}^-$).`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "The following mechanical implements are commonly used in laboratories and households:\n**A. Kitchen knife, B. Nutcracker, C. Yard broom, D. Pair of scissors.**\n(i) What general mechanical classification is shared by all four tools?\n(ii) State the specific lever class (Class 1, Class 2, or Class 3) to which each tool belongs.",
        workedSolution: `(i) General classification:
Simple machines (specifically, mechanical levers).

(ii) Lever classes:
• Tool A (Kitchen knife): Class 3 lever (when cutting by pressing, effort is applied between the handle pivot and the blade tip; or wedge).
• Tool B (Nutcracker): Class 2 lever (the nut/load rests in the middle between the hinged pivot and the hand handles).
• Tool C (Yard broom): Class 3 lever (the upper hand acts as the pivot, the lower hand applies effort in the middle, and the brush head sweeps the load at the base).
• Tool D (Pair of scissors): Class 1 lever (the central screw pivot is situated between the finger handle effort and the blade cutting load).`,
        maxMarks: 5
      }
    ]
  },
  {
    questionNumber: "6",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) Define electric current in physical science.\n\n(ii) Name the scientific instrument used to measure electric current.\n\n(iii) State the S.I. unit of electric current.",
        workedSolution: `(i) Definition of electric current:
The rate of flow of electric charge (electrons) through a cross-section of a conductor per unit time ($I = \\frac{Q}{t}$).

(ii) Measuring instrument:
An Ammeter.

(iii) S.I. Unit:
The Ampere (symbol: A).`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) State two reasons why selective pruning of shoots is beneficial to fruit trees.\n\n(ii) State one vital physiological role played by capillary soil water in plant growth.",
        workedSolution: `(i) Benefits of pruning:
• Removes dead, broken, or diseased branches, preventing the spread of wood-decay fungi.
• Opens up the inner canopy to sunlight, improving fruit color and photosynthetic efficiency.
• Balances vegetative growth with fruit production, preventing branch breakage under heavy crop loads.

(ii) Role of capillary soil water:
Dissolves essential mineral nutrient ions (nitrates, phosphates, potassium) so they can be absorbed by root hairs and translocated through the xylem stream.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "List four physical processes by which matter transforms from one physical state into another.",
        workedSolution: `1. Melting / Fusion (Solid $\\to$ Liquid)
2. Boiling / Vaporization / Evaporation (Liquid $\\to$ Gas)
3. Condensation / Liquefaction (Gas $\\to$ Liquid)
4. Freezing / Solidification (Liquid $\\to$ Solid)
5. Sublimation (Solid $\\to$ Gas directly)
6. Deposition (Gas $\\to$ Solid directly)`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "In a tabular format, state three distinct biological and chemical differences between the processes of photosynthesis and aerobic cellular respiration.",
        workedSolution: `Differences Table:

| Feature | Photosynthesis | Aerobic Cellular Respiration |
| :--- | :--- | :--- |
| **Primary Occurrence** | Occurs exclusively in green cells containing chlorophyll | Occurs in all living active cells of plants and animals |
| **Energy Transformation** | Endothermic reaction: traps light energy and stores it as chemical energy | Exothermic reaction: breaks down chemical food to release usable ATP energy |
| **Raw Materials (Reactants)** | Consumes Carbon (IV) oxide ($CO_2$) and water ($H_2O$) | Consumes glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$) and oxygen ($O_2$) |
| **By-products (Outputs)** | Releases oxygen ($O_2$) and glucose | Releases Carbon (IV) oxide ($CO_2$) and water ($H_2O$) |
| **Organelle Site** | Takes place within chloroplasts | Takes place within mitochondria and cytoplasm |`,
        maxMarks: 3
      }
    ]
  }
];

async function seedBece2021SciencePaper2Variant() {
  console.log('Seeding 2021 BECE Integrated Science Paper 2 Variant (Set 87) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2021_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer five questions in all. Answer Question 1 from Section A (compulsory), and any four questions from Section B. All working must be clearly shown.",
      totalQuestions: 6,
      questions: paper2Science2021Questions
    },
    'metadata.paper2Calibrated': true,
    'metadata.set87Verified': true,
    'metadata.updatedAt': new Date()
  }, { merge: true });

  console.log('✅ Successfully seeded Set 87 (2021 Science Paper 2 Variant) into past_papers/paper_2021_variant.');
}

seedBece2021SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 87 Science Paper 2:', err);
    process.exit(1);
  });

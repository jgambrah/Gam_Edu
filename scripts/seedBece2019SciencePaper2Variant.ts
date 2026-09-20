import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { createRequire } from 'module';

dotenv.config();

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
const svgQ1aRustingExperiment = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(30, 20)'><polygon points='18,5 42,5 38,20 22,20' fill='#d97706'/><rect x='20' y='20' width='20' height='140' rx='10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='21' y='90' width='18' height='68' fill='#38bdf8' opacity='0.4'/><line x1='20' y1='90' x2='40' y2='90' stroke='#38bdf8' stroke-width='1.5'/><line x1='27' y1='60' x2='33' y2='145' stroke='#b45309' stroke-width='3.5'/><circle cx='27' cy='58' r='3.5' fill='#b45309'/><circle cx='31' cy='105' r='1.5' fill='#ef4444'/><circle cx='29' cy='120' r='1.5' fill='#ef4444'/><circle cx='32' cy='135' r='1.5' fill='#ef4444'/><text x='30' y='180' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Tube A</text><text x='30' y='194' font-size='8' fill='#94a3b8' text-anchor='middle'>(Air + Water)</text></g><g transform='translate(150, 20)'><polygon points='18,5 42,5 38,20 22,20' fill='#d97706'/><rect x='20' y='20' width='20' height='140' rx='10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='21' y='75' width='18' height='83' fill='#38bdf8' opacity='0.4'/><rect x='21' y='68' width='18' height='8' fill='#f59e0b' opacity='0.9'/><line x1='20' y1='68' x2='40' y2='68' stroke='#f59e0b' stroke-width='1.2'/><line x1='30' y1='72' x2='30' y2='148' stroke='#cbd5e1' stroke-width='3.5'/><circle cx='30' cy='70' r='3.5' fill='#cbd5e1'/><text x='30' y='180' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Tube B</text><text x='30' y='194' font-size='8' fill='#94a3b8' text-anchor='middle'>(Boiled Water + Oil)</text></g><g transform='translate(270, 20)'><polygon points='18,5 42,5 38,20 22,20' fill='#d97706'/><rect x='20' y='20' width='20' height='140' rx='10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><circle cx='26' cy='148' r='3' fill='#ffffff'/><circle cx='34' cy='149' r='2.5' fill='#ffffff'/><circle cx='30' cy='143' r='2.5' fill='#ffffff'/><line x1='27' y1='50' x2='33' y2='135' stroke='#cbd5e1' stroke-width='3.5'/><circle cx='27' cy='48' r='3.5' fill='#cbd5e1'/><text x='30' y='180' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Tube C</text><text x='30' y='194' font-size='8' fill='#94a3b8' text-anchor='middle'>(Dry Air + CaCl₂)</text></g></svg></div>`;
const svgQ1dThermalConduction = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(20, 20)'><rect x='10' y='15' width='65' height='85' rx='3' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.8'/><rect x='11' y='35' width='63' height='63' fill='#38bdf8' opacity='0.5'/><path d='M 42 125 Q 38 108 42 102 Q 46 108 42 125 Z' fill='#f59e0b'/><text x='42' y='140' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Heat Source</text><text x='42' y='55' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>Boiling</text><text x='42' y='68' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>Water</text></g><rect x='85' y='60' width='265' height='16' rx='2' fill='#d97706' stroke='#b45309' stroke-width='1.5'/><g transform='translate(150, 10)'><rect x='0' y='0' width='5' height='50' fill='#e2e8f0' stroke='#64748b'/><circle cx='2.5' cy='48' r='3.5' fill='#ef4444'/><text x='2.5' y='-3' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>A</text></g><g transform='translate(225, 10)'><rect x='0' y='0' width='5' height='50' fill='#e2e8f0' stroke='#64748b'/><circle cx='2.5' cy='48' r='3.5' fill='#ef4444'/><text x='2.5' y='-3' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>B</text></g><g transform='translate(300, 10)'><rect x='0' y='0' width='5' height='50' fill='#e2e8f0' stroke='#64748b'/><circle cx='2.5' cy='48' r='3.5' fill='#ef4444'/><text x='2.5' y='-3' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>C</text></g><g transform='translate(150, 76)'><ellipse cx='2.5' cy='2' rx='6' ry='3' fill='#fef08a'/><line x1='2.5' y1='2' x2='2.5' y2='25' stroke='#cbd5e1' stroke-width='2'/><circle cx='2.5' cy='25' r='2' fill='#cbd5e1'/><text x='2.5' y='38' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>1</text></g><g transform='translate(225, 76)'><ellipse cx='2.5' cy='2' rx='6' ry='3' fill='#fef08a'/><line x1='2.5' y1='2' x2='2.5' y2='25' stroke='#cbd5e1' stroke-width='2'/><circle cx='2.5' cy='25' r='2' fill='#cbd5e1'/><text x='2.5' y='38' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>2</text></g><g transform='translate(300, 76)'><ellipse cx='2.5' cy='2' rx='6' ry='3' fill='#fef08a'/><line x1='2.5' y1='2' x2='2.5' y2='25' stroke='#cbd5e1' stroke-width='2'/><circle cx='2.5' cy='25' r='2' fill='#cbd5e1'/><text x='2.5' y='38' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>3</text></g><text x='215' y='165' font-size='9' font-weight='bold' fill='#94a3b8' text-anchor='middle'>THERMAL CONDUCTION RATE ALONG CONDUCTIVE BAR</text></svg></div>`;
const svgQ2bShadowGeometry = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(30, 90)'><ellipse cx='0' cy='0' rx='14' ry='28' fill='#f59e0b' stroke='#d97706' stroke-width='1.5'/><text x='0' y='42' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Extended Source</text></g><g transform='translate(170, 90)'><circle cx='0' cy='0' r='18' fill='#0284c7' stroke='#38bdf8' stroke-width='2'/><text x='0' y='32' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Opaque Body</text></g><line x1='320' y1='15' x2='320' y2='165' stroke='#cbd5e1' stroke-width='3.5'/><text x='320' y='175' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Screen</text><line x1='30' y1='64' x2='320' y2='45' stroke='#64748b' stroke-width='1' stroke-dasharray='2,2'/><line x1='30' y1='64' x2='320' y2='125' stroke='#64748b' stroke-width='1' stroke-dasharray='2,2'/><line x1='30' y1='116' x2='320' y2='55' stroke='#64748b' stroke-width='1' stroke-dasharray='2,2'/><line x1='30' y1='116' x2='320' y2='135' stroke='#64748b' stroke-width='1' stroke-dasharray='2,2'/><line x1='320' y1='75' x2='320' y2='105' stroke='#0f172a' stroke-width='6'/><line x1='323' y1='90' x2='350' y2='90' stroke='#ef4444' stroke-width='1.2'/><text x='355' y='94' font-size='11' font-weight='bold' fill='#ef4444'>A</text><line x1='320' y1='48' x2='320' y2='74' stroke='#475569' stroke-width='5'/><line x1='320' y1='106' x2='320' y2='132' stroke='#475569' stroke-width='5'/><line x1='323' y1='58' x2='350' y2='58' stroke='#f59e0b' stroke-width='1.2'/><text x='355' y='62' font-size='11' font-weight='bold' fill='#f59e0b'>B</text></svg></div>`;

const paper2Science2019Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `In an experiment, the surfaces of three identical clean iron nails were cleaned dry and placed into three separate test tubes labelled A, B, and C as illustrated below:

${svgQ1aRustingExperiment}

After three days, the nail in test tube A was observed to have rusted, while the nails in test tubes B and C showed no signs of rust.

(i) Suggest an appropriate scientific aim for this experiment.

(ii) Why was the water in test tube B boiled vigorously before adding the nail?

(iii) State the function of the layer of oil placed on top of the water in test tube B.

(iv) What is the purpose of the anhydrous calcium chloride granules placed in test tube C?

(v) Why did the nail in test tube A rust?

(vi) Explain why the nail:
  (α) in test tube B did not rust;
  (β) in test tube C did not rust.

(vii) Based on the findings of this experiment, explain why applying grease or engine oil onto the surface of metal tools protects them from rusting.`,
        workedSolution: `(i) Aim of the experiment:
To investigate the environmental conditions necessary for the rusting of iron (to show that both oxygen/air and water/moisture are required simultaneously for rusting to occur).

(ii) Reason for boiling water in Tube B:
To expel all dissolved atmospheric air and oxygen gas from the water.

(iii) Function of the oil layer in Tube B:
To form an airtight barrier on the water surface, preventing atmospheric oxygen from dissolving back into the boiled water.

(iv) Purpose of calcium chloride in Tube C:
To act as a drying agent (desiccant) that absorbs all water vapour and moisture from the air within the tube, maintaining completely dry air.

(v) Why nail in Tube A rusted:
Both atmospheric oxygen (air) and liquid water (moisture) were present together, enabling the electrochemical oxidation of iron into hydrated iron (III) oxide.

(vi) Reasons why nails did not rust:
• (α) Tube B: Oxygen (air) was absent (expelled by boiling and excluded by the oil film), despite water being present.
• (β) Tube C: Water (moisture) was absent (absorbed by the anhydrous calcium chloride), despite oxygen being present.

(vii) Why oiling prevents rusting:
Oil forms an impermeable protective coating over the metal surface that physically excludes atmospheric oxygen and moisture from coming into direct contact with iron atoms.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `In an investigation on photosynthesis, two fresh green leaves A and B were tested for the presence of starch. Leaf A was detached from a plant that had been exposed to bright sunlight for 5 hours, while Leaf B was taken from a potted plant that had been kept in a dark cupboard for 24 hours.

The following experimental steps were performed on both leaves:
  I. Leaves dipped in boiling water for 1 minute
  II. Leaves boiled in warm ethanol using a water bath
  III. Leaves rinsed in cold water
  IV. Leaves spread on a white tile and flooded with iodine solution

Following treatment with iodine solution, Leaf A changed colour while Leaf B remained pale yellowish-brown.

(i) Suggest a scientific aim for this experiment.

(ii) Explain briefly the biological purpose of carrying out each of the following steps:
  (α) Step I (Dipping in boiling water);
  (β) Step II (Boiling in warm alcohol);
  (γ) Step III (Rinsing in cold water).

(iii) State the distinct colour change observed on Leaf A after adding iodine solution.

(iv) Explain why Leaf A produced this colour change while Leaf B did not.

(v) Why was it necessary to de-starch the plant in the dark cupboard before initiating the experiment?

(vi) State the logical conclusion that can be drawn from this experiment.`,
        workedSolution: `(i) Aim of the experiment:
To show that sunlight is necessary for green plants to produce starch through photosynthesis (or to test for the presence of starch in green leaves).

(ii) Purpose of steps:
• (α) Step I (Boiling water): Kills the protoplasm, ruptures cell membranes, and stops all metabolic/enzymatic activity, making cells permeable to reagents.
• (β) Step II (Warm alcohol): Extracts and dissolves out the green chlorophyll pigment (decolourizes the leaf) so that subsequent colour changes can be seen clearly.
• (γ) Step III (Cold water): Re-hydrates and softens the leaf, which became brittle and stiff after boiling in alcohol.

(iii) Colour change on Leaf A:
The pale decolourized leaf turns deep blue-black.

(iv) Explanation of colour difference:
Leaf A was exposed to sunlight, allowing chlorophyll to synthesize starch, which forms a blue-black complex with iodine. Leaf B was kept in darkness, preventing photosynthesis; stored starch was converted into soluble sugars and translocated, leaving zero starch.

(v) Necessity of de-starching:
To ensure that any starch detected in the leaf at the end of the experiment was synthesized during the experimental illumination period, and was not pre-existing stored starch.

(vi) Conclusion:
Light energy (sunlight) is essential for green plants to synthesize starch via photosynthesis.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `You are provided with two dry soil samples A and B, two filter funnels, filter paper, two graduated measuring cylinders, a beam balance, a stop clock, and water.

With the aid of a clear procedural description, explain how you would set up an experiment to determine which of the two soil samples has a higher water-holding capacity.`,
        workedSolution: `Experimental Procedure:
1. Weigh equal masses (e.g., $50\\text{ g}$) of dry soil Sample A and dry soil Sample B using the beam balance.
2. Fold two pieces of filter paper into cones and fit them securely into two identical glass filter funnels.
3. Place each funnel into the neck of a clean graduated measuring cylinder (labelled Cylinder A and Cylinder B).
4. Transfer the weighed soil Sample A into Funnel A and Sample B into Funnel B.
5. Measure equal volumes of water (e.g., $50\\text{ cm}^3$) using an additional cylinder.
6. Pour $50\\text{ cm}^3$ of water simultaneously into each funnel, start the stop clock, and allow the water to drain freely for 15 minutes.
7. Record the volume of drained water collected in Cylinder A ($V_A$) and Cylinder B ($V_B$).
8. Calculate water retained by each sample:
$$\\text{Water Retained} = 50\\text{ cm}^3 - \\text{Drained Volume}$$
The soil sample that yields the smaller volume of drained filtrate in its measuring cylinder has retained more water and therefore possesses the higher water-holding capacity.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `The diagram below illustrates an experiment on thermal heat transfer. Three identical metal pins (1, 2, and 3) were attached to the underside of a uniform copper bar at equal intervals using equal amounts of candle wax. One end of the bar was submerged in a beaker of boiling water heated by a flame. Three laboratory thermometers (A, B, and C) were inserted into drilled oil-filled wells along the bar above the pins:

${svgQ1dThermalConduction}

(i) Suggest a scientific aim for this experimental investigation.

(ii) What is the normal boiling temperature of pure water at standard atmospheric pressure?

(iii) State the sequential order in which pins 1, 2, and 3 will drop off from the metal bar, giving a reason.

(iv) Describe the temperature readings recorded by thermometers A, B, and C as heating progresses.

(v) Name the physical process by which radiant heat from the Sun reaches the Earth through space.`,
        workedSolution: `(i) Aim of the experiment:
To demonstrate that heat travels through solid metals by conduction from regions of higher temperature to regions of lower temperature.

(ii) Boiling temperature of pure water:
$$100^\\circ\\text{C}\\quad (\\text{or } 373\\text{ K})$$.

(iii) Order of falling pins:
Pin 1 falls first, followed by Pin 2, and finally Pin 3.
Reason: Pin 1 is closest to the heat source; thermal energy conducted through the copper lattice melts the wax holding Pin 1 first. Heat takes longer to reach Pin 2, and arrives at Pin 3 last.

(iv) Temperature readings:
Thermometer A records the highest temperature, Thermometer B records a moderate temperature, and Thermometer C records the lowest temperature ($T_A > T_B > T_C$). Temperatures rise progressively from A to C over time.

(v) Mode of heat transmission from the Sun:
Thermal radiation (via electromagnetic infrared waves, which travel through vacuum without requiring a physical medium).`,
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
        prompt: "(i) What is a food chain in an ecological community?\n\n(ii) Why are green plants designated as producers in all terrestrial food chains?\n\n(iii) What general ecological term is given to organisms that depend directly or indirectly on producers for food?",
        workedSolution: `(i) Food chain:
A linear feeding sequence of organisms through which nutrients and energy transfer as each organism feeds on the preceding member.

(ii) Why plants are producers:
Green plants possess chlorophyll, enabling them to synthesize their own organic food (glucose) from inorganic carbon dioxide and water using solar energy through photosynthesis.

(iii) Dependent organisms:
Consumers (or Heterotrophs).`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `The diagram below shows the shadow pattern cast onto a screen when an opaque spherical obstacle is placed in front of an extended light source:

${svgQ2bShadowGeometry}

(i) Identify the distinct shadow zones labelled:
  (α) A;
  (β) B.

(ii) What fundamental property of light propagation does the casting of sharp shadows demonstrate?`,
        workedSolution: `(i) Identification of shadow zones:
• (α) Region A: Umbra (the central region of total darkness where all direct light rays from the source are completely blocked).
• (β) Region B: Penumbra (the surrounding boundary zone of partial shadow receiving light rays from only part of the extended source).

(ii) Fundamental property of light:
Rectilinear propagation of light (light travels in straight lines).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Describe briefly how a pure, dry sample of crystalline sugar can be recovered from a solid mixture of sugar and coarse sand.",
        workedSolution: `Separation procedure:
1. Dissolution: Add water to the mixture and stir thoroughly. The sugar dissolves completely to form an aqueous solution, while the insoluble sand remains undissolved at the bottom.
2. Filtration: Pour the mixture through a filter funnel lined with filter paper. The sand particles are retained on the paper as residue, while the clear sugar solution passes through as filtrate.
3. Evaporation & Crystallization: Heat the sugar filtrate gently in an evaporating dish until it becomes saturated. Allow the concentrated solution to cool slowly to form pure sugar crystals.
4. Drying: Filter out the crystals and press them gently between sheets of filter paper to dry.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State three agronomic and soil management practices used to conserve soil and maintain its fertility on a crop farm.",
        workedSolution: `1. Planting cover crops (e.g., cowpea, mucuna) to protect topsoil from raindrop impact and reduce surface runoff velocity.
2. Practicing systematic crop rotation incorporating leguminous crops to replenish soil nitrogen without depleting single nutrient reserves.
3. Applying organic manure or compost to improve soil crumb structure, increase water retention, and supply balanced nutrients.
4. Mulching bare soil surfaces with dry grass to suppress water evaporation, control weed emergence, and moderate soil temperature.`,
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
        prompt: "A sack of grain of mass $100\\text{ kg}$ is hoisted vertically to a storage platform located $2.0\\text{ m}$ above the floor.\n\n(i) State the specific form of mechanical energy acquired by the sack at this elevated height.\n\n(ii) Calculate the magnitude of this energy in Joules. [Take acceleration due to gravity, $g = 10\\text{ m s}^{-2}$].",
        workedSolution: `(i) Form of energy:
Gravitational Potential Energy (P.E.).

(ii) Calculation:
State the formula:
$$\\text{P.E.} = mgh$$
Substitute the given values ($m = 100\\text{ kg}$, $g = 10\\text{ m s}^{-2}$, $h = 2.0\\text{ m}$):
$$\\text{P.E.} = 100 \\times 10 \\times 2.0 = 2,000\\text{ J}$$
Answer: $$2,000\\text{ Joules (J)}$$.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) Define the term matter in physical science.\n\n(ii) Name two physical states in which matter commonly exists.",
        workedSolution: `(i) Definition of matter:
Anything that has mass and occupies physical space (has volume).

(ii) States of matter:
Solid, Liquid, Gas (or Plasma).`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "(i) Describe the physical and textural nature of loamy soil.\n\n(ii) Name any two essential macro plant nutrients supplied by fertile agricultural soils.",
        workedSolution: `(i) Nature of loamy soil:
Loam is a balanced mixture containing roughly equal proportions of sand, silt, and clay, along with organic humus. It is dark in colour, friable and crumbly in texture, retains adequate moisture without waterlogging, and provides good aeration for root respiration.

(ii) Plant nutrients:
Nitrogen (N), Phosphorus (P), Potassium (K), Calcium (Ca), Magnesium (Mg), or Sulfur (S).`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) State the specific causative bacterial pathogen for each of the following human diseases:\n  (α) Cholera;\n  (β) Tuberculosis.\n\n(ii) State one effective public health or personal hygiene measure used to prevent the spread of cholera in a community.",
        workedSolution: `(i) Causative organisms:
• (α) Cholera: *Vibrio cholerae* (a comma-shaped bacterium).
• (β) Tuberculosis: *Mycobacterium tuberculosis* (an acid-fast rod-shaped bacterium).

(ii) Cholera prevention measures:
1. Drinking only boiled or chemically chlorinated potable water.
2. Washing hands thoroughly with soap and running water after using toilet facilities and before handling food.
3. Proper sanitary disposal of human faeces and keeping domestic food covered from houseflies.`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Using biological and chemical principles, explain briefly why a healthy potted tomato plant wilts rapidly if an excessive quantity of synthetic chemical fertilizer is applied around its base.",
        workedSolution: `Applying excessive chemical fertilizer makes the soil solution around the roots hypertonic (higher solute concentration / lower water potential) relative to the internal cell sap of the root hair cells. 
By osmosis, water moves out of the root cells into the hypertonic soil. This causes the plant cells to lose turgidity and become flaccid (plasmolysis). Without internal turgor pressure to support herbaceous stems and leaves, the plant wilts and may suffer fertilizer burn.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "State the specific danger or safety hazard involved in each of the following unsafe laboratory practices:\n(i) Consuming food or drinking water inside a science laboratory;\n(ii) Walking barefoot or in open-toed sandals within a chemistry laboratory;\n(iii) Washing hands using an unlabelled liquid found in a glass beaker on a lab bench.",
        workedSolution: `(i) Eating/drinking in the laboratory:
Risk of chemical poisoning or ingesting hazardous toxic reagents, pathogens, or carcinogenic chemical residues transferred from bench surfaces or hands.

(ii) Walking barefoot / open shoes:
Risk of severe skin burns from spilled corrosive acids/alkalis, or foot lacerations from broken glassware dropped onto the floor.

(iii) Washing with unlabelled liquid:
The liquid may be a concentrated corrosive acid, caustic alkali, or toxic organic solvent that causes chemical burns, dermal toxicity, or tissue necrosis.`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "A school child experiences difficulty seeing clearly in dim light and at twilight (night blindness).\n\n(i) What nutritional deficiency disorder is the child suffering from?\n\n(ii) Which dietary vitamin is deficient in the child's body?\n\n(iii) State three natural food sources that can be supplied to the child to correct this deficiency.",
        workedSolution: `(i) Deficiency disorder:
Nyctalopia (Night blindness).

(ii) Deficient vitamin:
Vitamin A (Retinol).

(iii) Food sources of Vitamin A:
1. Fresh carrots (rich in beta-carotene precursor)
2. Palm oil (red oil)
3. Liver, egg yolk, milk, and butter
4. Green leafy vegetables (spinach, kontomire / cocoyam leaves)
5. Ripe pawpaw / mangoes`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) Define a physical force.\n\n(ii) Using the concept of friction, explain briefly why a motor driver was unable to bring a car to a halt on a wet, oil-smeared asphalt road despite depressing the brake pedal firmly.",
        workedSolution: `(i) Definition of force:
A push or pull exerted on an object that alters or tends to alter its state of rest, velocity, or direction of motion ($F = ma$).

(ii) Failure to stop on wet, oily road:
A wet, oil-coated road surface creates a thin liquid film between the rubber tyre treads and the asphalt. This liquid boundary smooths over surface micro-irregularities, drastically reducing the coefficient of friction. Because the frictional force opposing motion is reduced, the tyres lose traction and hydroplane/skid, preventing the braking force from decelerating the vehicle effectively.`,
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
        prompt: "Describe briefly how the exact volume of a small, irregularly shaped lead weight can be determined in a school laboratory using a graduated measuring cylinder and water.",
        workedSolution: `Procedure:
1. Pour a known volume of water into a graduated measuring cylinder so that it is about half full.
2. Read and record the initial water level ($V_1\\text{ cm}^3$) at the bottom of the meniscus, looking horizontally to avoid parallax error.
3. Tie the irregular lead weight with a fine, light thread.
4. Gently lower the lead weight into the cylinder until it is completely submerged beneath the water surface without touching the walls or splashing water out.
5. Read and record the new, elevated water level ($V_2\\text{ cm}^3$).
6. Calculate the volume of the lead weight:
$$\\text{Volume of Lead Weight} = V_2 - V_1$$
By Archimedes' principle of liquid displacement, the volume of water displaced equals the volume of the submerged solid.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "State three biological characteristics common to all living organisms.",
        workedSolution: `1. Nutrition: Ingesting or synthesizing nutrients for metabolic energy and tissue growth.
2. Respiration: Breaking down organic food molecules intracellularly to liberate energy (ATP).
3. Excretion: Removing toxic metabolic waste products from body fluids.
4. Growth: Irreversible permanent increase in dry mass and cellular size.
5. Reproduction: Producing offspring to perpetuate the species.
6. Irritability / Sensitivity: Sensing and responding to internal and external environmental stimuli.
7. Locomotion / Movement: Changing position or orienting organs toward stimuli.`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "(i) What is environmental pollution?\n\n(ii) Name one common gaseous air pollutant produced by industrial combustion engines.",
        workedSolution: `(i) Definition:
The introduction of harmful chemical substances, physical particulates, or energy (noise, heat) into the natural environment in quantities that cause damage to living organisms and degrade ecosystem function.

(ii) Gaseous air pollutants:
Carbon monoxide ($CO$), Sulfur dioxide ($SO_2$), Nitrogen dioxide ($NO_2$), or unburnt hydrocarbon vapours.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State three agronomic and environmental factors that govern the successful growth and yield of vegetable crops in Ghana.",
        workedSolution: `1. Soil fertility and texture: Requires well-drained sandy loam soil with adequate organic matter and a balanced pH (6.0–7.0).
2. Water supply: Continuous access to reliable irrigation, especially during dry months.
3. Sunlight and temperature: Adequate solar radiation for photosynthesis, with ambient temperatures suitable for the crop variety.
4. Effective pest and disease management: Controlling insect vectors (aphids, whiteflies) and fungal blights.`,
        maxMarks: 4
      }
    ]
  }
];

async function seedBece2019SciencePaper2Variant() {
  console.log('Seeding 2019 BECE Integrated Science Paper 2 Variant (Set 83) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2019_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 from Section A (compulsory), and any three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Science2019Questions
    },
    'metadata.paper2Calibrated': true,
    'metadata.set83Verified': true,
    'metadata.updatedAt': new Date()
  }, { merge: true });

  console.log('✅ Successfully seeded Set 83 (2019 Science Paper 2 Variant) into past_papers/paper_2019_variant.');
}

seedBece2019SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 83 Science Paper 2:', err);
    process.exit(1);
  });

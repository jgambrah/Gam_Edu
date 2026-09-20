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
const svgQ1aBonyFish = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 60 110 C 90 40 250 40 300 110 C 250 180 90 180 60 110 Z' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='2'/><path d='M 300 110 L 350 65 C 335 110 335 110 350 155 Z' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.8'/><path d='M 130 54 Q 190 20 250 54 Z' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><path d='M 190 166 Q 230 185 260 166 Z' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><path d='M 60 110 L 50 106 L 62 115' fill='none' stroke='#cbd5e1' stroke-width='2'/><line x1='50' y1='106' x2='20' y2='80' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='15' y='75' font-size='11' font-weight='bold' fill='#cbd5e1'>I</text><circle cx='85' cy='95' r='8' fill='#ffffff' stroke='#0f172a' stroke-width='1.5'/><circle cx='85' cy='95' r='4' fill='#0f172a'/><line x1='85' y1='87' x2='85' y2='35' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='85' y='28' font-size='11' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>VI</text><path d='M 115 80 C 130 95 130 125 115 140' fill='none' stroke='#f59e0b' stroke-width='2.5'/><line x1='125' y1='130' x2='125' y2='195' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='125' y='208' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><path d='M 135 115 Q 165 110 170 135 Q 145 135 135 115 Z' fill='#38bdf8' opacity='0.7' stroke='#cbd5e1' stroke-width='1.5'/><line x1='155' y1='130' x2='180' y2='195' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='185' y='208' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text><path d='M 170 85 Q 178 80 186 85 M 180 92 Q 188 87 196 92 M 172 100 Q 180 95 188 100' fill='none' stroke='#94a3b8' stroke-width='1.5'/><line x1='186' y1='85' x2='220' y2='35' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='225' y='30' font-size='11' font-weight='bold' fill='#cbd5e1'>IV</text><line x1='125' y1='110' x2='295' y2='110' stroke='#ef4444' stroke-width='1.8' stroke-dasharray='4,3'/><line x1='230' y1='110' x2='265' y2='135' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='270' y='145' font-size='11' font-weight='bold' fill='#ef4444'>V</text></svg></div>`;
const svgQ1bSoilProfile = `<div class="my-4 flex justify-center"><svg viewBox='0 0 320 260' width='100%' height='240' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='40' y='20' width='160' height='210' fill='none' stroke='#64748b' stroke-width='2'/><rect x='41' y='21' width='158' height='45' fill='#451a03' opacity='0.9'/><path d='M 50 20 L 55 10 L 60 20 M 75 20 L 80 8 L 85 20 M 110 20 L 115 10 L 120 20 M 150 20 L 155 8 L 160 20' stroke='#22c55e' stroke-width='2'/><line x1='205' y1='43' x2='240' y2='43' stroke='#94a3b8' stroke-width='1.5'/><text x='245' y='47' font-size='11' font-weight='bold' fill='#f59e0b'>I</text><rect x='41' y='66' width='158' height='65' fill='#9a3412' opacity='0.75'/><circle cx='70' cy='95' r='5' fill='#78350f'/><circle cx='130' cy='85' r='7' fill='#78350f'/><circle cx='165' cy='110' r='6' fill='#78350f'/><line x1='205' y1='98' x2='240' y2='98' stroke='#94a3b8' stroke-width='1.5'/><text x='245' y='102' font-size='11' font-weight='bold' fill='#fb923c'>II</text><rect x='41' y='131' width='158' height='50' fill='#475569' opacity='0.8'/><polygon points='55,145 75,138 85,155 60,165' fill='#334155' stroke='#94a3b8'/><polygon points='105,140 135,135 145,155 115,160' fill='#334155' stroke='#94a3b8'/><polygon points='155,142 185,146 175,165 150,158' fill='#334155' stroke='#94a3b8'/><line x1='205' y1='156' x2='240' y2='156' stroke='#94a3b8' stroke-width='1.5'/><text x='245' y='160' font-size='11' font-weight='bold' fill='#cbd5e1'>III</text><rect x='41' y='181' width='158' height='48' fill='#1e293b' stroke='#475569'/><line x1='41' y1='195' x2='199' y2='195' stroke='#334155' stroke-width='2'/><line x1='41' y1='210' x2='199' y2='210' stroke='#334155' stroke-width='2'/><line x1='205' y1='205' x2='240' y2='205' stroke='#94a3b8' stroke-width='1.5'/><text x='245' y='209' font-size='11' font-weight='bold' fill='#94a3b8'>IV</text></svg></div>`;
const svgQ1cCircuitInvestigation = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 200' width='100%' height='180' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='45' x2='95' y2='45' stroke='#94a3b8' stroke-width='2'/><line x1='95' y1='33' x2='95' y2='57' stroke='#38bdf8' stroke-width='2'/><line x1='103' y1='39' x2='103' y2='51' stroke='#38bdf8' stroke-width='3.5'/><text x='99' y='27' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><line x1='103' y1='45' x2='165' y2='45' stroke='#94a3b8' stroke-width='2'/><circle cx='168' cy='45' r='3' fill='#e2e8f0'/><line x1='168' y1='45' x2='195' y2='33' stroke='#e2e8f0' stroke-width='2'/><circle cx='200' cy='45' r='3' fill='#e2e8f0'/><text x='185' y='27' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>II</text><line x1='200' y1='45' x2='310' y2='45' stroke='#94a3b8' stroke-width='2'/><line x1='310' y1='45' x2='310' y2='80' stroke='#94a3b8' stroke-width='2'/><circle cx='310' cy='100' r='15' fill='#1e293b' stroke='#10b981' stroke-width='2'/><text x='310' y='105' font-size='13' font-weight='bold' fill='#10b981' text-anchor='middle'>A</text><text x='332' y='104' font-size='10' font-weight='bold' fill='#10b981'>III</text><line x1='310' y1='115' x2='310' y2='155' stroke='#94a3b8' stroke-width='2'/><line x1='310' y1='155' x2='255' y2='155' stroke='#94a3b8' stroke-width='2'/><rect x='195' y='145' width='60' height='20' rx='2' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='225' y='159' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>IV</text><line x1='195' y1='155' x2='145' y2='155' stroke='#94a3b8' stroke-width='2'/><rect x='75' y='145' width='70' height='20' rx='2' fill='#1e293b' stroke='#a855f7' stroke-width='2'/><line x1='80' y1='172' x2='140' y2='138' stroke='#a855f7' stroke-width='2'/><polygon points='136,136 145,135 140,144' fill='#a855f7'/><text x='110' y='140' font-size='10' font-weight='bold' fill='#c084fc' text-anchor='middle'>VI</text><line x1='75' y1='155' x2='40' y2='155' stroke='#94a3b8' stroke-width='2'/><line x1='40' y1='155' x2='40' y2='45' stroke='#94a3b8' stroke-width='2'/><path d='M 185 155 L 185 185 L 208 185' fill='none' stroke='#38bdf8' stroke-width='1.5'/><circle cx='225' cy='185' r='14' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><text x='225' y='190' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>V</text><path d='M 242 185 L 265 185 L 265 155' fill='none' stroke='#38bdf8' stroke-width='1.5'/></svg></div>`;

const paper2Science2018Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `The diagram below is an illustration of a typical bony fish (Tilapia). Study the anatomical diagram carefully and answer the questions that follow:

${svgQ1aBonyFish}

(i) Identify the common or scientific name of the fish illustrated.

(ii) Name each of the external anatomical parts labelled I, II, IV, and V.

(iii) Name the natural aquatic habitat in which this fish lives.

(iv) Explain how each of the structures labelled III (pectoral fin) and VI (eye) enables the fish to adapt to its aquatic environment.`,
        workedSolution: `(i) Identity of fish:
Tilapia (or Bony fish / Oreochromis niloticus).

(ii) External anatomical parts:
• I: Mouth (terminal mouth)
• II: Operculum (gill cover)
• IV: Scales (ctenoid / cycloid scales)
• V: Lateral line

(iii) Natural habitat:
Freshwater habitat (rivers, lakes, ponds, lagoons, streams).

(iv) Adaptive features:
• Part III (Pectoral fin): Acts as a paddle for steering, balancing, braking, changing direction, and controlling pitching movements during locomotion in water.
• Part VI (Eye): Lacks eyelids and possesses a round, rigid crystalline lens providing a wide lateral field of view in water; kept moist continuously by the surrounding aquatic medium.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagram below illustrates a vertical cross-section through the soil (soil profile) showing distinct horizontal layers:

${svgQ1bSoilProfile}

(i) What does the complete diagram represent in pedology?

(ii) Name each of the distinct layers (horizons) labelled I, II, III, and IV.

(iii) Which specific layer (I, II, III, or IV) of the soil profile:
  (α) Is the richest in decayed organic matter (humus)?
  (β) Serves as the primary biological habitat for soil-dwelling microorganisms and plant roots?
  (γ) Consists of partially broken rock fragments actively undergoing physical and chemical weathering?

(iv) What is the destructive physical effect of heavy torrential rainfall on the exposed top layer labelled I if left unmanaged?`,
        workedSolution: `(i) Representation:
Soil profile (a vertical cross-section of soil from the surface down to the underlying parent bedrock).

(ii) Names of layers (horizons):
• I: Topsoil (Horizon A)
• II: Subsoil (Horizon B)
• III: Weathered parent material / rock fragments (Horizon C)
• IV: Unweathered solid bedrock (Horizon D / Horizon R)

(iii) Soil profile zones:
• (α) Richest in humus: Layer I (Topsoil / Horizon A).
• (β) Primary habitat for soil organisms and roots: Layer I (Topsoil / Horizon A).
• (γ) Undergoing active weathering: Layer III (Parent material / Horizon C).

(iv) Effect of heavy rainfall on Layer I:
Soil erosion (sheet or rill erosion) and nutrient leaching, which washes away fertile topsoil, organic humus, and dissolved mineral salts.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `The diagram below is an illustration of an electrical circuit assembled to investigate the relationship between potential difference and electric current:

${svgQ1cCircuitInvestigation}

(i) Name each of the circuit components labelled I, II, IV, and VI.

(ii) State the primary energy transformation that takes place in:
  (α) Component I (when supplying current);
  (β) Component IV (when electric current flows through it).

(iii) State the S.I. unit of the electrical quantity measured by each of the instruments labelled:
  (α) III;
  (β) V.

(iv) State the functional role of the component labelled VI in this experimental circuit.`,
        workedSolution: `(i) Circuit components:
• I: Electric cell (or DC battery source)
• II: Switch (or Key)
• IV: Fixed resistor (R)
• VI: Rheostat (variable resistor)

(ii) Energy transformations:
• (α) In Component I (Cell): Chemical energy is converted into electrical energy.
• (β) In Component IV (Resistor): Electrical energy is converted into heat energy (thermal dissipation).

(iii) S.I. Units:
• (α) Measured by III (Ammeter): Ampere (A) [measures electric current].
• (β) Measured by V (Voltmeter): Volt (V) [measures potential difference / voltage].

(iv) Function of Part VI (Rheostat):
To vary the total resistance of the circuit, thereby adjusting and regulating the electric current flowing through the fixed resistor to obtain multiple voltage-current readings.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `In a chemistry experiment, equal volumes and equal concentrations of dilute hydrochloric acid ($\\text{HCl}$) and dilute sodium hydroxide ($\\text{NaOH}$) solutions were prepared in separate test tubes:

Read the following sequential experimental steps carefully:
  I. Both red and blue litmus papers were dipped into each of the original solutions in turn.
  II. Equal volumes of both solutions were mixed thoroughly together in a third test tube to obtain a resultant mixture.
  III. Both red and blue litmus papers were dipped into this third mixture.

(i) Explain briefly how you would identify each of the starting solutions using the litmus test in Step I:
  (α) Hydrochloric acid;
  (β) Sodium hydroxide.

(ii) State the specific type of chemical reaction that occurred when the two solutions were mixed together in Step II.

(iii) What type of chemical solution was formed in the third test tube following the reaction?

(iv) State the observation made when both red and blue litmus papers were dipped into the third solution in Step III.

(v) Explain briefly how dry solid crystals of the compound formed in the third solution could be recovered.`,
        workedSolution: `(i) Identification of solutions:
• (α) Hydrochloric acid: Turns blue litmus paper red, while red litmus paper remains unchanged (confirms an acidic solution).
• (β) Sodium hydroxide: Turns red litmus paper blue, while blue litmus paper remains unchanged (confirms a basic/alkaline solution).

(ii) Type of chemical reaction:
Neutralization reaction.
$$\\text{HCl}_{(aq)} + \\text{NaOH}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$

(iii) Type of solution formed:
A neutral salt solution (aqueous sodium chloride, brine).

(iv) Litmus observation on third solution:
Neither litmus paper changes colour: blue litmus paper remains blue and red litmus paper remains red (confirming the solution is neutral with $pH = 7$).

(v) Recovery of solid crystals:
Pour the neutral solution into an evaporating dish and heat gently over a Bunsen flame to evaporate water until saturation point, then allow it to cool and crystallize (or evaporate completely to dryness) to leave white sodium chloride crystals.`,
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
        prompt: "(i) What is an ion in chemistry?\n\n(ii) State two physical or chemical methods used to soften hard water.",
        workedSolution: `(i) Definition of ion:
An atom or chemically bonded group of atoms (radical) that carries a net electrical charge as a result of losing or gaining one or more valence electrons.

(ii) Methods of softening hard water:
1. Boiling: Decomposes dissolved calcium and magnesium hydrogencarbonates (for temporary hardness).
2. Addition of washing soda (sodium carbonate, $\\text{Na}_2\\text{CO}_3$): Precipitates dissolved calcium and magnesium ions as insoluble carbonates.
3. Ion exchange (zeolite / permutit process): Replaces $\\text{Ca}^{2+}$ and $\\text{Mg}^{2+}$ ions with soluble $\\text{Na}^+$ ions.
4. Distillation: Evaporates pure water vapor away from dissolved mineral salts.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) Differentiate between a crop pest and a livestock parasite as used in agriculture.\n\n(ii) Give one example each of an agricultural:\n  (α) Crop pest;\n  (β) Livestock parasite.",
        workedSolution: `(i) Differentiation:
• Crop Pest: An organism (typically an insect, rodent, or bird) that attacks, damages, or feeds on cultivated crop plants, reducing harvest yield or quality.
• Livestock Parasite: An organism that lives on (ectoparasite) or inside (endoparasite) the body of a farm animal, deriving nourishment and shelter at the expense of the host's health.

(ii) Examples:
• (α) Crop pest: Stem borer, variegated grasshopper, aphid, weevil, weaver bird.
• (β) Livestock parasite: Tick, louse, flea, tapeworm, liver fluke, roundworm.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) What is mechanical work done in physics?\n\n(ii) A constant horizontal force of $10\\text{ N}$ pulls a wooden crate across a floor through a distance of $5.2\\text{ m}$ in the direction of the force. Calculate the work done in Joules.",
        workedSolution: `(i) Definition of work:
The product of the magnitude of an applied force and the displacement moved by the object in the direction of the force ($W = F \\times d$).

(ii) Calculation:
Formula:
$$\\text{Work Done } (W) = F \\times d$$
Substitute the given values ($F = 10\\text{ N}$, $d = 5.2\\text{ m}$):
$$W = 10\\text{ N} \\times 5.2\\text{ m} = 52\\text{ J}$$
Answer: $52\\text{ Joules (J)}$.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Name two non-communicable clinical diseases or disorders associated with the human circulatory system.",
        workedSolution: `1. Hypertension (persistently elevated arterial blood pressure).
2. Arteriosclerosis / Atherosclerosis (narrowing and hardening of arteries by plaque deposits).
3. Coronary heart disease / Coronary thrombosis (myocardial infarction).
4. Stroke (cerebrovascular accident).`,
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
        prompt: "(i) What is malnutrition in human health?\n\n(ii) State one visible clinical symptom for each of the following nutritional deficiency diseases:\n  (α) Scurvy;\n  (β) Rickets.",
        workedSolution: `(i) Definition of malnutrition:
A pathological condition resulting from an unbalanced diet characterized by an inadequate, excessive, or disproportionate intake of essential nutrients.

(ii) Clinical symptoms:
• (α) Scurvy (Vitamin C deficiency): Spongy, swollen, bleeding gums, loose teeth, poor wound healing, and subcutaneous capillary hemorrhages.
• (β) Rickets (Vitamin D/Calcium deficiency): Softened, malformed bones resulting in bow-legs, knock-knees, pigeon chest, and swollen wrists/ankles in children.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "A neutral potassium atom has an atomic number of 19 ($K = 19$). State its electron configuration across Bohr shells and draw its electron distribution diagram.",
        workedSolution: `Electron configuration:
Atomic number $Z = 19 \\implies 19\\text{ electrons}$.
Bohr shell capacity rules:
• Shell 1 (K): 2 electrons
• Shell 2 (L): 8 electrons
• Shell 3 (M): 8 electrons
• Shell 4 (N): 1 electron
Configuration: $$2, 8, 8, 1$$

Diagrammatic representation:
Four concentric circles surrounding a central nucleus ($19p, 20n$): the innermost ring bears 2 electrons, the second bears 8, the third bears 8, and the outermost valence ring bears 1 electron.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) Define potential energy in mechanics.\n\n(ii) A mass of $10\\text{ kg}$ is moving with a constant velocity of $2.0\\text{ m s}^{-1}$. Calculate the kinetic energy possessed by the moving body.",
        workedSolution: `(i) Definition of potential energy:
The stored energy possessed by a body as a consequence of its vertical elevation in a gravitational field or its elastic deformation.

(ii) Kinetic energy calculation:
Formula:
$$\\text{K.E.} = \\frac{1}{2}mv^2$$
Substitute given values ($m = 10\\text{ kg}$, $v = 2.0\\text{ m s}^{-1}$):
$$\\text{K.E.} = \\frac{1}{2} \\times 10 \\times (2.0)^2 = 5 \\times 4 = 20\\text{ J}$$
Answer: $20\\text{ Joules (J)}$.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Give one specific example each of a mineral nutrient required by agricultural crops classified as:\n(i) A soil macro-nutrient;\n(ii) A soil micro-nutrient (trace element).",
        workedSolution: `(i) Macro-nutrient:
Nitrogen (N), Phosphorus (P), Potassium (K), Calcium (Ca), Magnesium (Mg), or Sulfur (S).

(ii) Micro-nutrient:
Iron (Fe), Zinc (Zn), Copper (Cu), Boron (B), Manganese (Mn), or Molybdenum (Mo).`,
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
        prompt: "(i) Explain what is meant by a hazard in a school science laboratory.\n\n(ii) List two essential safety precautions observed to protect students against hazards during practical science lessons.",
        workedSolution: `(i) Hazard definition:
Any situation, chemical substance, piece of equipment, or activity with the potential to cause physical injury, chemical burns, health impairment, or property damage.

(ii) Safety precautions:
1. Always wearing personal protective equipment (PPE), including safety eye goggles, lab coats, and closed-toe shoes.
2. Never eating, tasting, drinking, or running inside the laboratory.
3. Conducting reactions that release toxic or volatile fumes inside a functional fume chamber.
4. Washing hands thoroughly with soap and clean water before exiting the laboratory.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "In a tabular format, state three scientific differences between the processes of osmosis and diffusion.",
        workedSolution: `Differences Table:

| Feature | Osmosis | Diffusion |
| :--- | :--- | :--- |
| **Particles Moving** | Solvent (water) molecules only | Solute particles, liquids, or gas molecules |
| **Membrane Requirement** | Strictly requires a selectively permeable membrane | Does not require a membrane |
| **Medium of Occurrence** | Occurs exclusively in aqueous liquid solutions | Occurs in gases, liquids, and solutions |
| **Concentration Gradient** | Water moves from higher water potential to lower water potential | Particles move from higher solute concentration to lower concentration |`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) What is weather?\n\n(ii) State two clear differences between weather and season.",
        workedSolution: `(i) Weather:
The physical state and atmospheric conditions of a particular locality (temperature, rainfall, pressure, humidity, wind) recorded over a short period of time (hours or days).

(ii) Differences between weather and season:
1. Duration: Weather changes from hour to hour or day to day, whereas a season lasts for a prolonged period of several months (e.g., dry harmattan season or rainy season).
2. Predictability: Weather exhibits day-to-day fluctuations, whereas seasons follow a repeating, predictable annual cycle.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) What is meant by fertile soil in crop husbandry?\n\n(ii) State two natural or human-induced factors that cause the depletion of soil fertility.",
        workedSolution: `(i) Fertile soil:
Soil that possesses the physical structure, aeration, moisture capacity, and chemical nutrients required in optimal balance to support healthy, vigorous plant growth and crop yields.

(ii) Factors causing loss of soil fertility:
1. Soil erosion: Running water or wind sweeps away topsoil and organic humus.
2. Leaching: Heavy rainfall percolates soluble nitrates and potassium beyond the root zone.
3. Continuous monoculture without fallowing or manure application.
4. Bush burning, which incinerates soil organic matter and beneficial microflora.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) What is a magnetic field?\n\n(ii) Name two distinct methods used to make artificial permanent magnets from ferromagnetic materials.",
        workedSolution: `(i) Magnetic field:
A region of space surrounding a permanent magnet, moving electric charge, or current-carrying conductor in which magnetic forces can be experienced by magnetic materials.

(ii) Methods of making magnets:
1. Electrical method: Placing a steel bar inside a cylindrical coil (solenoid) and passing direct current (DC) through it.
2. Stroking method: Stroking a steel bar repeatedly in one direction from end to end with the pole of a permanent magnet (single touch or divided touch).
3. Magnetic induction.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Explain briefly what is meant by teenage pregnancy and state two socio-economic or educational consequences on the teenage mother.",
        workedSolution: `Definition:
Pregnancy occurring in an adolescent female between the ages of 13 and 19 years before physiological, emotional, or financial maturity.

Consequences:
1. Disruption and premature termination of formal schooling and academic education.
2. Financial distress and deepened poverty due to lack of employable skills.
3. Elevated risk of obstetric complications (e.g., obstructed labor, obstetric fistula, high maternal mortality).
4. Social stigma, emotional depression, and parental rejection.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Write down the systematic chemical formula for each of the following inorganic compounds:\n\n(i) Calcium chloride;\n(ii) Copper (I) oxide;\n(iii) Nitrogen (IV) oxide;\n(iv) Ammonia gas.",
        workedSolution: `Chemical Formulae:
• (i) Calcium chloride: $\\text{CaCl}_2$
• (ii) Copper (I) oxide: $\\text{Cu}_2\\text{O}$
• (iii) Nitrogen (IV) oxide: $\\text{NO}_2$
• (iv) Ammonia: $\\text{NH}_3$`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) List three physical properties of agricultural soils.\n\n(ii) What is the characteristic tactile texture of a wet clayey soil?",
        workedSolution: `(i) Physical properties:
1. Soil texture (particle size distribution of sand, silt, and clay)
2. Soil structure (arrangement of particles into aggregates/peds)
3. Water-holding capacity and permeability
4. Soil color and bulk density

(ii) Texture of wet clayey soil:
It feels sticky, smooth, plastic, and heavy, and can be easily molded into ribbons without cracking.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "6",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) What are derived physical quantities in scientific measurement?\n\n(ii) State the standard S.I. units for each of the following derived quantities:\n  (α) Area;\n  (β) Volume.",
        workedSolution: `(i) Derived quantities:
Physical quantities that are not fundamental, but are derived mathematically from combinations (products or quotients) of base S.I. quantities (such as length, mass, and time).

(ii) S.I. Units:
• (α) Area: Square metre ($\\text{m}^2$)
• (β) Volume: Cubic metre ($\\text{m}^3$)`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) State two external environmental factors necessary for photosynthesis in green leaves.\n\n(ii) Explain the specific physiological function of each of the two factors named in (b)(i).",
        workedSolution: `(i) Environmental factors:
Sunlight (radiant light energy) and Carbon (IV) oxide ($CO_2$) gas. *(Water and chlorophyll are also essential).*

(ii) Functions:
• Sunlight: Provides radiant photon energy that is absorbed by chlorophyll to drive the photolysis (splitting) of water molecules and energize ATP synthesis.
• Carbon (IV) oxide ($CO_2$): Enters leaf stomata to serve as the raw carbon source reduced during dark reactions (Calvin cycle) into glucose carbohydrates.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Explain each of the following terms in water chemistry:\n\n(i) Soft water;\n(ii) Hard water.",
        workedSolution: `(i) Soft water:
Water that is free from dissolved calcium ($\\text{Ca}^{2+}$) and magnesium ($\\text{Mg}^{2+}$) ions, and therefore lathers easily and immediately with soap without forming insoluble scum.

(ii) Hard water:
Water that contains dissolved mineral salts of calcium and magnesium (such as hydrogencarbonates, sulfates, or chlorides), which precipitate soap into an insoluble grey scum before a lather can form.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State three agronomic reasons why certain vegetable and tree crop seeds are sown in a nursery bed before transplanting into the field.",
        workedSolution: `1. Protection of tiny, fragile seeds from harsh environmental factors like heavy beating raindrops, scorching solar heat, and surface runoff.
2. Easier management and protection against field pests, fungal damping-off diseases, and weed competition.
3. Allows the farmer to select only vigorous, healthy, disease-free seedlings for field transplanting.
4. Facilitates intensive watering, shading, and thinning out in a concentrated, manageable space.`,
        maxMarks: 3
      }
    ]
  }
];

async function seedBece2018SciencePaper2Variant() {
  console.log('Seeding 2018 BECE Integrated Science Paper 2 Variant (Set 85) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2018_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer five questions in all. Answer Question 1 from Section A (compulsory), and any four questions from Section B. All working must be clearly shown.",
      totalQuestions: 6,
      questions: paper2Science2018Questions
    },
    'metadata.paper2Calibrated': true,
    'metadata.set85Verified': true,
    'metadata.updatedAt': new Date()
  }, { merge: true });

  console.log('✅ Successfully seeded Set 85 (2018 Science Paper 2 Variant) into past_papers/paper_2018_variant.');
}

seedBece2018SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 85 Science Paper 2:', err);
    process.exit(1);
  });

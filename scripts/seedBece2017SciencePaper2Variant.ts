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
  } catch (cliErr) {}

  try {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
    return adminInstance.firestore();
  } catch (e) {
    return adminInstance.firestore();
  }
}

const svgQ1aCanineTooth = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 240' width='100%' height='220' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 140 25 Q 170 10 200 25 L 205 95 L 135 95 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/><line x1='195' y1='40' x2='260' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='44' font-size='12' font-weight='bold' fill='#f8fafc'>I</text><path d='M 145 45 Q 170 30 195 45 L 198 160 L 142 160 Z' fill='#fed7aa' stroke='#f97316' stroke-width='1.5'/><line x1='190' y1='75' x2='260' y2='75' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='79' font-size='12' font-weight='bold' fill='#fb923c'>II</text><path d='M 160 70 Q 170 60 180 70 L 175 175 L 165 175 Z' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/><circle cx='170' cy='85' r='4' fill='#fef08a'/><line x1='160' y1='85' x2='60' y2='85' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='89' font-size='12' font-weight='bold' fill='#ef4444' text-anchor='end'>V</text><path d='M 110 95 Q 135 90 135 105 L 135 125' fill='none' stroke='#f43f5e' stroke-width='3'/><path d='M 230 95 Q 205 90 205 105 L 205 125' fill='none' stroke='#f43f5e' stroke-width='3'/><text x='95' y='115' font-size='10' font-weight='bold' fill='#f43f5e'>Gum</text><path d='M 135 105 L 140 195 L 145 195 L 140 105 Z' fill='#38bdf8' opacity='0.7'/><path d='M 205 105 L 200 195 L 195 195 L 200 105 Z' fill='#38bdf8' opacity='0.7'/><line x1='138' y1='145' x2='60' y2='145' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='149' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='end'>III</text><line x1='205' y1='165' x2='260' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='169' font-size='12' font-weight='bold' fill='#cbd5e1'>IV</text><rect x='115' y='130' width='20' height='75' fill='#334155' opacity='0.5'/><rect x='205' y='130' width='20' height='75' fill='#334155' opacity='0.5'/></svg></div>`;
const svgQ1bRefractionInterface = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 210' width='100%' height='190' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='40' y='105' width='280' height='90' fill='#0284c7' opacity='0.25'/><line x1='30' y1='105' x2='330' y2='105' stroke='#38bdf8' stroke-width='2'/><text x='45' y='95' font-size='11' font-weight='bold' fill='#38bdf8'>Air (Less Dense)</text><text x='45' y='125' font-size='11' font-weight='bold' fill='#0284c7'>Water (Denser)</text><line x1='180' y1='25' x2='180' y2='185' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='4,3'/><text x='185' y='35' font-size='12' font-weight='bold' fill='#94a3b8'>I</text><line x1='80' y1='30' x2='180' y2='105' stroke='#ef4444' stroke-width='2.5'/><polygon points='125,62 133,65 131,57' fill='#ef4444'/><text x='95' y='45' font-size='12' font-weight='bold' fill='#ef4444'>II</text><path d='M 180 80 A 25 25 0 0 0 155 86' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='148' y='75' font-size='12' font-weight='bold' fill='#f59e0b'>III</text><path d='M 180 135 A 30 30 0 0 0 196 128' fill='none' stroke='#10b981' stroke-width='1.5'/><text x='192' y='145' font-size='12' font-weight='bold' fill='#10b981'>IV</text><line x1='180' y1='105' x2='235' y2='185' stroke='#10b981' stroke-width='2.5'/><polygon points='208,143 216,149 214,141' fill='#10b981'/><text x='245' y='175' font-size='12' font-weight='bold' fill='#10b981'>V</text></svg></div>`;
const svgQ1cFiltrationApparatus = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 220' width='100%' height='200' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='60' y1='195' x2='120' y2='195' stroke='#cbd5e1' stroke-width='4'/><line x1='90' y1='195' x2='90' y2='25' stroke='#cbd5e1' stroke-width='3.5'/><line x1='90' y1='80' x2='155' y2='80' stroke='#cbd5e1' stroke-width='2'/><text x='45' y='40' font-size='12' font-weight='bold' fill='#cbd5e1'>I</text><polygon points='120,60 210,60 170,110 160,110' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='162' y='110' width='6' height='35' fill='#38bdf8' opacity='0.5'/><line x1='210' y1='75' x2='265' y2='75' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='270' y='79' font-size='12' font-weight='bold' fill='#38bdf8'>III</text><polygon points='126,62 204,62 165,108' fill='#78350f' opacity='0.8' stroke='#f59e0b' stroke-width='1.5'/><line x1='135' y1='70' x2='45' y2='70' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='40' y='74' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='end'>II</text><rect x='135' y='135' width='60' height='60' rx='3' fill='#0284c7' opacity='0.15' stroke='#64748b' stroke-width='1.5'/><rect x='136' y='165' width='58' height='29' fill='#38bdf8' opacity='0.4'/><circle cx='165' cy='152' r='2' fill='#38bdf8'/><line x1='195' y1='175' x2='265' y2='175' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='270' y='179' font-size='11' font-weight='bold' fill='#38bdf8'>Filtrate</text></svg></div>`;
const svgQ1dSlopedFarmland = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><polygon points='30,40 350,140 350,165 30,165' fill='#334155' stroke='#64748b' stroke-width='2'/><line x1='30' y1='40' x2='350' y2='140' stroke='#10b981' stroke-width='3.5'/><line x1='60' y1='30' x2='220' y2='80' stroke='#ef4444' stroke-width='2.5'/><polygon points='215,73 228,82 220,88' fill='#ef4444'/><text x='140' y='45' font-size='11' font-weight='bold' fill='#ef4444' transform='rotate(17 140 45)'>Slope Gradient / Water Runoff</text><g transform='translate(80, 50)'><path d='M 0 0 Q -4 -10 0 -15 Q 4 -10 0 0' fill='#22c55e'/></g><g transform='translate(140, 70)'><path d='M 0 0 Q -4 -10 0 -15 Q 4 -10 0 0' fill='#22c55e'/></g><g transform='translate(200, 90)'><path d='M 0 0 Q -4 -10 0 -15 Q 4 -10 0 0' fill='#22c55e'/></g><g transform='translate(260, 110)'><path d='M 0 0 Q -4 -10 0 -15 Q 4 -10 0 0' fill='#22c55e'/></g><path d='M 100 65 Q 160 95 240 125' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='4,3'/><text x='190' y='165' font-size='9' font-weight='bold' fill='#94a3b8' text-anchor='middle'>FARMLAND LOCATED ON GENTLE HILL SLOPE</text></svg></div>`;

const paper2Science2017Questions = [
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `The diagram below is a longitudinal section of a canine tooth in humans. Study the anatomical diagram carefully and answer the questions that follow:

${svgQ1aCanineTooth}

(i) Name each of the anatomical structures labelled I, II, III, IV, and V.

(ii) State one physiological function for each of the parts labelled I and III.

(iii) Which of the labelled anatomical parts is the living core containing blood vessels and nerve fibers that becomes exposed during advanced tooth decay?

(iv) State three hygienic habits or preventive measures that should be adopted to prevent tooth and gum decay.`,
        workedSolution: `(i) Anatomical structures:
• I: Enamel (or Crown)
• II: Dentine
• III: Cementum (or Periodontal membrane / ligament)
• IV: Jawbone socket (or Root)
• V: Pulp cavity

(ii) Physiological functions:
• Part I (Enamel): Provides a hard, mineralized outer protective shield capable of withstanding biting/tearing pressures and protects inner sensitive tissues from bacterial invasion.
• Part III (Cementum / Periodontal membrane): Anchors the tooth firmly into the bony socket of the jawbone and absorbs shock during chewing.

(iii) Living core affected by decay:
Part V (Pulp cavity), which contains blood capillaries and sensory nerve endings.

(iv) Preventative dental care practices:
1. Brushing teeth thoroughly twice daily with a fluoride toothpaste (especially after meals and before sleeping).
2. Daily flossing to remove trapped food debris and plaque from interdental spaces.
3. Reducing the frequency and intake of refined sugary sweets, acidic sodas, and sticky confections.
4. Regular clinical visits to a dentist for routine prophylactic cleanings and examinations.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagram below illustrates an optical phenomenon that occurs when a ray of light transitions obliquely across a planar boundary between air and water:

${svgQ1bRefractionInterface}

(i) What specific physical phenomenon does the optical diagram illustrate?

(ii) Identify each of the lines, rays, and angles labelled I, II, III, IV, and V.

(iii) Using the wave behaviour of light, explain why a straight wooden ruler or fish swimming at the bottom of a pond appears closer to the surface than its true depth.`,
        workedSolution: `(i) Optical phenomenon:
Refraction of light (bending of light at an optical boundary).

(ii) Identification:
• I: Normal line (perpendicular to interface at point of incidence)
• II: Incident ray (in air)
• III: Angle of incidence ($i$ or $\\theta_1$)
• IV: Angle of refraction ($r$ or $\\theta_2$)
• V: Refracted ray (in water)

(iii) Explanation of apparent depth:
Light rays reflecting from an object at the bottom of the pond travel through water (optically denser medium) toward the air (optically less dense medium). As the rays cross the water-air interface, their velocity increases, causing them to bend away from the normal. When these diverging rays enter the observer's eye, the brain projects them straight backwards in a linear path, forming a virtual image positioned noticeably higher than the actual object.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `The diagram below shows a standard laboratory apparatus setup assembled to separate the constituents of muddy water:

${svgQ1cFiltrationApparatus}

(i) Name each of the apparatus components labelled I, II, and III.

(ii) State the physical function performed by the part labelled II in this separation process.

(iii) Name the clear liquid substance collected in the beaker as the filtrate.

(iv) State three physical properties of pure water obtained from this filtrate after subsequent distillation.

(v) Name two alternative porous everyday materials that could be used in place of part II in rural field conditions.`,
        workedSolution: `(i) Name of components:
• I: Retort stand (with iron ring clamp)
• II: Filter paper (folded into a cone)
• III: Filter funnel (glass or plastic)

(ii) Function of Part II (Filter paper):
Acts as a semi-permeable porous physical barrier that retains insoluble mud and suspended clay particles (residue) while allowing the liquid solvent to pass through into the beaker.

(iii) Name of filtrate:
Water (clarified water).

(iv) Physical properties of pure water:
1. Density of exactly $1.0\\text{ g cm}^{-3}$ ($1000\\text{ kg m}^{-3}$) at $4^\\circ\\text{C}$.
2. Normal boiling point of $100^\\circ\\text{C}$ at $1\\text{ atmosphere}$ of pressure.
3. Standard freezing point of $0^\\circ\\text{C}$.
4. Odourless, tasteless, and colourless liquid with neutral $pH = 7$.

(v) Alternative field filtration materials:
1. Clean white cotton cloth (or linen fabric).
2. Clean cotton wool.
3. Clean fine sand and charcoal bed (bio-sand filter).`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `The diagram below illustrates a cultivated crop field located on a sloping hillside:

${svgQ1dSlopedFarmland}

(i) What destructive physical process is most likely to take place on this farmland during a heavy, torrential rainstorm?

(ii) State two unsustainable farming practices that exacerbate or accelerate the process identified in (d)(i).

(iii) List four soil conservation practices that a farmer should adopt on this field to arrest and control the process mentioned in (d)(i).

(iv) Mention three vital soil components or agricultural resources that are washed away and lost from the field during heavy surface runoff.`,
        workedSolution: `(i) Destructive physical process:
Soil erosion (specifically water runoff erosion / sheet and rill erosion).

(ii) Unsustainable farming practices accelerating erosion:
• Clear-felling trees and complete deforestation of hillsides.
• Indiscriminate slash-and-burn clearing that exposes bare topsoil.
• Ploughing and cultivating down the slope (along the gradient) instead of across contours.
• Overgrazing by livestock, which removes protective vegetative ground cover.

(iii) Soil conservation practices:
1. Contour ploughing: Tilling across the hill slope to create natural ridges that impede downhill water flow.
2. Terracing: Carving stepped horizontal benches along steep hillsides to break runoff velocity.
3. Planting cover crops: Establishing low-growing leguminous crops (e.g., mucuna, cowpea) to shield bare soil from raindrop impact.
4. Constructing stone bunds or diversion ditches along contours to guide runoff safely.
5. Heavy organic mulching across crop rows.

(iv) Soil resources depleted:
1. Fertile topsoil particles (mineral matter: silt, clay, sand).
2. Organic matter / Humus.
3. Soluble macro and micro plant nutrients (nitrogen, phosphorus, potassium).
4. Beneficial soil microorganisms (bacteria, fungi, earthworms).`,
        maxMarks: 10
      }
    ]
  },

  // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER 4 ONLY)
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "An atom of an element Y has an atomic number of 12. In order to achieve a stable electronic configuration, it loses two electrons.\n\n(i) State the proton number of atom Y before it loses electrons.\n\n(ii) State the total number of electrons in atom Y:\n  (α) before it loses electrons;\n  (β) after losing two electrons.\n\n(iii) Name the specific type of electrical ion formed by atom Y.",
        workedSolution: `(i) Proton number:
Protons $= \\text{Atomic number} = 12$.

(ii) Electron counts:
• (α) Before losing electrons: 12 electrons (neutral atom where electrons $=$ protons).
• (β) After losing two electrons: $12 - 2 = 10\\text{ electrons}$.

(iii) Type of ion formed:
Cation (a positively charged ion: $\\text{Y}^{2+}$, specifically a magnesium cation $\\text{Mg}^{2+}$).`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Name four recognized farming systems practiced in commercial crop and livestock production in Ghana.",
        workedSolution: `1. Crop rotation
2. Mixed farming
3. Mixed cropping (intercropping)
4. Land rotation (bush fallowing)
5. Organic farming
6. Monoculture`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) What is meant by the term seed dispersal in botany?\n\n(ii) State two morphological adaptations characteristic of seeds and fruits dispersed by wind currents.",
        workedSolution: `(i) Definition of seed dispersal:
The biological mechanism or process by which plant seeds or fruits are transported away from the parent plant to distant locations to prevent overcrowding and colonize new habitats.

(ii) Adaptations for wind dispersal (anemochory):
• Seeds are minute, dry, and extremely lightweight.
• Possession of silky, feathery tufts of hair (pappus) forming natural parachutes (e.g., *Tridax*, cotton).
• Possession of flattened, papery wing-like expansions (e.g., mahogany, *Combretum*).`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Explain what is meant by the forward bias of a semiconductor p-n junction diode, describing its effect on electric current flow.",
        workedSolution: `Forward bias occurs when an external direct current (DC) voltage source is connected such that its positive terminal is linked to the p-type semiconductor material and its negative terminal is linked to the n-type material of the diode. 
This external potential opposes and overcomes the internal barrier potential, narrowing the depletion layer and allowing majority charge carriers to cross the junction, permitting electric current to flow freely through the circuit.`,
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
        prompt: "(i) Define an acid according to the Arrhenius theory.\n\n(ii) In a tabular format, state two distinct physical differences between a dilute acid and an alkaline base in terms of taste and tactile feel.",
        workedSolution: `(i) Definition of acid:
A chemical substance that contains hydrogen and dissociates in aqueous solution to produce excess hydrogen ions ($H^+$ or hydronium ions, $H_3O^+$) as the only positive ions. (Alternatively: A proton donor).

(ii) Physical differences Table:

| Criterion | Acid | Base / Alkali |
| :--- | :--- | :--- |
| **Taste** | Has a sharp, sour taste | Has a characteristic bitter taste |
| **Tactile Feel** | Stinging, watery, non-slippery feel | Slippery, soapy, and lubricous to the touch |`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) Define the physical quantity pressure.\n\n(ii) A concrete foundation block exerts a normal downward force of $200\\text{ N}$ distributed uniformly over a surface area of $50\\text{ m}^2$. Calculate the pressure exerted on the ground in S.I. units.",
        workedSolution: `(i) Definition of pressure:
The perpendicular (normal) force exerted per unit surface area ($P = \\frac{F}{A}$).

(ii) Calculation:
Formula:
$$\\text{Pressure } (P) = \\frac{\\text{Normal Force } (F)}{\\text{Surface Area } (A)}$$
Substitute given values ($F = 200\\text{ N}$, $A = 50\\text{ m}^2$):
$$P = \\frac{200\\text{ N}}{50\\text{ m}^2} = 4\\text{ N m}^{-2}\\quad (\\text{or } 4\\text{ Pa})$$
Answer: $$4\\text{ Pascals (Pa)}$$.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "Explain the following biological terms as applied to living organisms, giving one valid example of each:\n\n(i) Unicellular organism;\n\n(ii) Multicellular organism.",
        workedSolution: `(i) Unicellular organism:
An organism whose entire body is composed of a single solitary cell that independently performs all vital metabolic and reproductive life functions.
Example: *Amoeba*, *Paramecium*, *Euglena*, or Bacterium.

(ii) Multicellular organism:
An organism composed of many differentiated cells organized into specialized tissues, organs, and organ systems working collaboratively.
Example: Flowering plant (maize, onion), domestic fowl, human.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State two reasons why the presence of air in soil pores is essential for agricultural crop production.",
        workedSolution: `1. Supplies oxygen gas required by plant roots for aerobic cellular respiration to drive active absorption of mineral salts.
2. Supplies oxygen to aerobic soil microorganisms (e.g., nitrifying bacteria) that decompose organic humus into plant-available nitrates.
3. Prevents anaerobic denitrification and stops the formation of toxic reduced compounds (e.g., hydrogen sulfide).`,
        maxMarks: 2
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) Explain the terms work input and work output as applied to mechanical simple machines.\n\n(ii) State one physical factor that inevitably limits the work output of any real simple machine, keeping its efficiency below 100%.",
        workedSolution: `(i) Definitions:
• Work Input: The total work or energy supplied to a machine by the operator, calculated as the effort force multiplied by the distance moved by the effort ($W_{\\text{in}} = E \\times d_E$).
• Work Output: The useful work performed by the machine directly on the load, calculated as the load force multiplied by the distance through which the load is lifted ($W_{\\text{out}} = L \\times d_L$).

(ii) Limiting physical factor:
Friction between moving mechanical contact parts (and the mass/weight of the machine parts themselves), which converts a portion of input energy into wasted thermal heat.`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "(i) What is a chloroplast?\n\n(ii) State two biochemical differences between aerobic respiration and anaerobic respiration.",
        workedSolution: `(i) Chloroplast:
A specialized double-membrane sub-cellular organelle found in green plant cells containing the pigment chlorophyll, within which photosynthesis takes place.

(ii) Differences:
1. Oxygen dependency: Aerobic respiration strictly requires molecular oxygen, whereas anaerobic respiration proceeds in the total absence of oxygen.
2. Energy yield: Aerobic respiration completely oxidizes glucose to produce a large amount of ATP energy, whereas anaerobic respiration produces a small amount of ATP.
3. End-products: Aerobic respiration yields carbon dioxide and water, while anaerobic respiration in humans yields lactic acid (or ethanol and $CO_2$ in yeast).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) State the colour change observed when moist blue litmus paper is dipped into: (α) Dilute vinegar; (β) Wood ash solution.\n\n(ii) Name the two chemical products formed when hydrochloric acid undergoes neutralization with sodium hydroxide.",
        workedSolution: `(i) Colour changes:
• (α) Vinegar: Turns red (acidic medium).
• (β) Wood ash solution: Remains blue (basic/alkaline solution containing potassium carbonate).

(ii) Neutralization products:
Sodium chloride (table salt, $\\text{NaCl}$) and Water ($\\text{H}_2\\text{O}$).
$$\\text{HCl} + \\text{NaOH} \\to \\text{NaCl} + \\text{H}_2\\text{O}$$`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "List two nutritional or physiological benefits of including leafy and fruity vegetables in the human diet.",
        workedSolution: `1. Provides essential dietary vitamins (Vitamins A, C, K) and minerals (iron, calcium) that boost immunity and prevent deficiency diseases.
2. Supplies dietary fibre (roughage) that adds bulk to feces, stimulates gastrointestinal peristalsis, and prevents constipation.`,
        maxMarks: 2
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) Differentiate between digestion and egestion in animal nutrition.\n\n(ii) Name three absorbable end-products resulting from the complete digestion of human food.",
        workedSolution: `(i) Differentiation:
• Digestion: The biochemical and mechanical breakdown of large, complex, insoluble food polymers into small, simple, water-soluble monomers capable of being absorbed into the blood.
• Egestion: The physiological expulsion of undigested, unabsorbed solid waste matter (feces) from the alimentary canal through the anus.

(ii) End-products of digestion:
1. Glucose (from carbohydrates/starches)
2. Amino acids (from proteins)
3. Fatty acids and Glycerol (from lipids and fats)`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Give one specific example of a chemical compound routinely utilized in:\n\n(i) Clinical medicine;\n\n(ii) Agriculture;\n\n(iii) Manufacturing industry.",
        workedSolution: `(i) Medicine:
Paracetamol / Aspirin (acetylsalicylic acid), Sodium chloride intravenous saline ($0.9\\%\\text{ NaCl}$), or Magnesium hydroxide [$\\text{Mg(OH)}_2$ antacid].

(ii) Agriculture:
Ammonium nitrate [$\\text{NH}_4\\text{NO}_3$], Urea [$\\text{CO(NH}_2\\text{)}_2$], or Copper (II) sulfate [$\\text{CuSO}_4$ fungicide].

(iii) Industry:
Sulfuric acid [$\\text{H}_2\\text{SO}_4$], Sodium hydroxide [$\\text{NaOH}$ soap making], or Ethanol [$\\text{C}_2\\text{H}_5\\text{OH}$ solvent].`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "(i) Define the term soil profile.\n\n(ii) State two ways in which understanding the soil profile of an area assists a farmer in crop husbandry.",
        workedSolution: `(i) Definition:
The vertical cross-section of the soil extending from the surface down to the parent bedrock, displaying the distinct horizontal layers known as soil horizons.

(ii) Importance to crop husbandry:
1. Guides the selection of appropriate crops based on the depth of the topsoil horizon (Horizon A).
2. Informs tillage depth and reveals impermeable subsurface clay or iron pans that impede root growth.
3. Indicates soil drainage, aeration, and water-table levels across root zones.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) State two sequential steps followed by scientists in scientific investigations.\n\n(ii) Give two academic disciplines classified as applied sciences.",
        workedSolution: `(i) Steps in the scientific method:
1. Identifying and defining a problem based on initial observation.
2. Formulating a testable hypothesis.
3. Conducting controlled laboratory or field experiments.
4. Analyzing empirical data and drawing logical conclusions.

(ii) Applied sciences:
Medicine, Agricultural Science, Engineering, Pharmacy, Computer Technology.`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "6",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) What is an alloy?\n\n(ii) State two environmental conditions that cause the atmospheric corrosion (rusting) of ferrous metals.",
        workedSolution: `(i) Definition of alloy:
A homogeneous solid solution or uniform metallic mixture composed of two or more metals, or a metal combined with a non-metal, fused together to enhance properties like hardness and corrosion resistance.

(ii) Conditions causing corrosion (rusting):
1. Presence of oxygen gas (air).
2. Presence of liquid water or atmospheric moisture (humidity).
*(Accelerated by airborne salts or acidic atmospheric pollutants).*`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) What is an astronomical planet?\n\n(ii) Name the two inner planets whose orbits lie between the Sun and planet Earth.",
        workedSolution: `(i) Definition of planet:
A large celestial body that orbits a central star (such as the Sun), has sufficient mass for its self-gravity to maintain a nearly round shape, and has cleared the neighborhood around its orbit.

(ii) Inner planets between Sun and Earth:
Mercury and Venus.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "State four physiological functions of the blood circulatory system in the human body.",
        workedSolution: `1. Transport of respiratory gases: Transports oxygen from lungs to systemic tissues via red blood cells, and carries carbon dioxide back to lungs.
2. Nutrient and waste transport: Conveys dissolved glucose, amino acids, and vitamins to cells, and carries urea to the kidneys.
3. Immune defense: White blood cells engulf foreign pathogens and synthesize neutralizing antibodies.
4. Thermoregulation: Regulates core body temperature by dilating or constricting superficial cutaneous capillaries.
5. Hemostasis: Blood platelets and clotting factors seal damaged blood vessels to prevent blood loss.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) Define the term crop rotation.\n\n(ii) Give one example of a chemical method used to control insect pests on a vegetable farm.",
        workedSolution: `(i) Definition:
A systematic farming practice in which different types of crops belonging to distinct plant families are grown on the same land parcel in a recurring cycle over several seasons.

(ii) Chemical control method:
Spraying calibrated formulations of synthetic insecticides (e.g., pyrethroids or organophosphates) onto crop foliage using a knapsack sprayer.`,
        maxMarks: 3
      }
    ]
  }
];

async function seedBece2017SciencePaper2Variant() {
  console.log('Seeding 2017 BECE Integrated Science Paper 2 Variant (Set 81) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2017_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 from Section A (compulsory), and any three questions from Section B. All working must be clearly shown.",
      totalQuestions: 6,
      questions: paper2Science2017Questions
    },
    'metadata.paper2Calibrated': true,
    'metadata.set81Verified': true,
    'metadata.updatedAt': new Date()
  }, { merge: true });

  console.log('✅ Successfully seeded Set 81 (2017 Science Paper 2 Variant) into past_papers/paper_2017_variant.');
}

seedBece2017SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 81 Science Paper 2:', err);
    process.exit(1);
  });

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

const svgQ1aParasitesVar = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(25, 25)'><ellipse cx='35' cy='60' rx='20' ry='28' fill='#cbd5e1' stroke='#475569' stroke-width='1.8'/><ellipse cx='35' cy='26' rx='12' ry='10' fill='#94a3b8' stroke='#475569' stroke-width='1.5'/><circle cx='35' cy='12' r='7' fill='#64748b' stroke='#334155'/><path d='M 23 26 L 5 18 L 2 24' fill='none' stroke='#334155' stroke-width='2'/><path d='M 47 26 L 65 18 L 68 24' fill='none' stroke='#334155' stroke-width='2'/><path d='M 20 45 L 3 48 L 2 55' fill='none' stroke='#334155' stroke-width='2'/><path d='M 50 45 L 67 48 L 68 55' fill='none' stroke='#334155' stroke-width='2'/><text x='35' y='118' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Organism I</text></g><g transform='translate(150, 25)'><ellipse cx='40' cy='52' rx='14' ry='22' fill='#d97706' stroke='#78350f' stroke-width='1.5'/><circle cx='40' cy='25' r='10' fill='#b45309'/><line x1='40' y1='15' x2='40' y2='3' stroke='#dc2626' stroke-width='2'/><polygon points='34,35 46,35 44,85 36,85' fill='#fef3c7' opacity='0.7' stroke='#92400e'/><line x1='30' y1='35' x2='12' y2='25' stroke='#451a03' stroke-width='1.5'/><line x1='50' y1='35' x2='68' y2='25' stroke='#451a03' stroke-width='1.5'/><line x1='28' y1='50' x2='10' y2='65' stroke='#451a03' stroke-width='1.5'/><line x1='52' y1='50' x2='70' y2='65' stroke='#451a03' stroke-width='1.5'/><text x='40' y='118' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Organism II</text></g><g transform='translate(265, 15)'><circle cx='35' cy='20' r='9' fill='#f8fafc' stroke='#475569' stroke-width='1.8'/><circle cx='31' cy='18' r='2' fill='#0284c7'/><circle cx='39' cy='18' r='2' fill='#0284c7'/><path d='M 35 29 C 15 45 60 65 30 85 C 10 100 55 115 35 130' fill='none' stroke='#e2e8f0' stroke-width='6'/><path d='M 35 29 C 15 45 60 65 30 85 C 10 100 55 115 35 130' fill='none' stroke='#475569' stroke-width='6' stroke-dasharray='2,3'/><text x='35' y='152' font-size='12' font-weight='bold' fill='#34d399' text-anchor='middle'>Organism III</text></g></svg></div>`;
const svgQ1bReflection = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 210' width='100%' height='190' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='130' x2='320' y2='130' stroke='#38bdf8' stroke-width='2.5'/><text x='40' y='122' font-size='11' font-weight='bold' fill='#38bdf8'>M</text><text x='320' y='122' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='end'>M'</text><line x1='50' y1='130' x2='42' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='80' y1='130' x2='72' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='110' y1='130' x2='102' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='140' y1='130' x2='132' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='170' y1='130' x2='162' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='200' y1='130' x2='192' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='230' y1='130' x2='222' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='260' y1='130' x2='252' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='290' y1='130' x2='282' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='315' y1='130' x2='307' y2='140' stroke='#64748b' stroke-width='1.2'/><g transform='translate(85, 60)'><rect x='-6' y='20' width='12' height='50' fill='#f1f5f9' stroke='#94a3b8' stroke-width='1.5'/><path d='M 0 20 Q -4 10 0 0 Q 4 10 0 20 Z' fill='#f59e0b'/><text x='0' y='-8' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Object</text></g><line x1='180' y1='30' x2='180' y2='130' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='4,4'/><text x='185' y='45' font-size='11' font-weight='bold' fill='#94a3b8'>II</text><line x1='85' y1='60' x2='180' y2='130' stroke='#ef4444' stroke-width='2'/><polygon points='130,95 137,97 135,90' fill='#ef4444'/><text x='115' y='80' font-size='11' font-weight='bold' fill='#ef4444'>I</text><line x1='180' y1='130' x2='275' y2='60' stroke='#10b981' stroke-width='2'/><polygon points='230,90 232,97 225,95' fill='#10b981'/><text x='250' y='80' font-size='11' font-weight='bold' fill='#10b981'>III</text><path d='M 180 100 A 30 30 0 0 0 160 115' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='162' y='105' font-size='10' font-weight='bold' fill='#f59e0b'>θ₁</text><path d='M 180 100 A 30 30 0 0 1 200 115' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='192' y='105' font-size='10' font-weight='bold' fill='#f59e0b'>θ₂</text><g transform='translate(275, 130)'><rect x='-6' y='0' width='12' height='50' fill='none' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='3,3'/><path d='M 0 50 Q -4 60 0 70 Q 4 60 0 50 Z' fill='none' stroke='#f59e0b' stroke-width='1.5' stroke-dasharray='2,2'/><text x='0' y='65' font-size='11' font-weight='bold' fill='#94a3b8' text-anchor='middle'>IV</text></g></svg></div>`;
const svgQ1cSodiumWater = `<div class="my-4 flex justify-center"><svg viewBox='0 0 320 200' width='100%' height='170' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='80' y='35' width='160' height='135' rx='4' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='2'/><rect x='82' y='75' width='156' height='93' fill='#38bdf8' opacity='0.4'/><line x1='80' y1='75' x2='240' y2='75' stroke='#38bdf8' stroke-width='2'/><text x='160' y='125' font-size='11' font-weight='bold' fill='#0369a1' text-anchor='middle'>Water</text><circle cx='140' cy='74' r='7' fill='#f59e0b' stroke='#b45309' stroke-width='1.5'/><line x1='140' y1='67' x2='140' y2='45' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='140' y='38' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Sodium metal</text><circle cx='132' cy='82' r='2' fill='#ffffff'/><circle cx='146' cy='85' r='2.5' fill='#ffffff'/><circle cx='138' cy='92' r='2' fill='#ffffff'/><circle cx='144' cy='78' r='1.5' fill='#ffffff'/><g transform='translate(195, 30)'><line x1='0' y1='0' x2='35' y2='0' stroke='#b45309' stroke-width='3.5'/><circle cx='0' cy='0' r='3.5' fill='#ef4444'/><text x='42' y='4' font-size='10' font-weight='bold' fill='#ef4444'>Glowing splint</text></g><path d='M 135 60 Q 130 50 135 40' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><path d='M 145 62 Q 150 52 145 42' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><text x='160' y='185' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>REACTION OF SODIUM WITH WATER</text></svg></div>`;
const svgQ1dGerminationBeakers = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(25, 20)'><rect x='10' y='20' width='70' height='95' rx='3' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><rect x='12' y='95' width='66' height='18' fill='#e2e8f0' opacity='0.7'/><circle cx='30' cy='92' r='4' fill='#ea580c'/><circle cx='45' cy='92' r='4' fill='#ea580c'/><circle cx='60' cy='92' r='4' fill='#ea580c'/><text x='45' y='136' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Beaker A</text></g><g transform='translate(145, 20)'><rect x='10' y='20' width='70' height='95' rx='3' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><rect x='12' y='95' width='66' height='18' fill='#0284c7' opacity='0.5'/><g transform='translate(30, 92)'><circle cx='0' cy='0' r='4' fill='#16a34a'/><path d='M 0 -4 Q -3 -12 -1 -16' fill='none' stroke='#4ade80' stroke-width='1.8'/><path d='M 0 4 Q 3 10 2 14' fill='none' stroke='#fde047' stroke-width='1.5'/></g><g transform='translate(55, 92)'><circle cx='0' cy='0' r='4' fill='#16a34a'/><path d='M 0 -4 Q -3 -12 -1 -16' fill='none' stroke='#4ade80' stroke-width='1.8'/></g><text x='45' y='136' font-size='12' font-weight='bold' fill='#4ade80' text-anchor='middle'>Beaker B</text></g><g transform='translate(265, 20)'><rect x='10' y='20' width='70' height='95' rx='3' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><rect x='12' y='50' width='66' height='63' fill='#0284c7' opacity='0.35'/><rect x='12' y='46' width='66' height='8' fill='#f59e0b' opacity='0.85'/><circle cx='30' cy='105' r='4' fill='#ea580c'/><circle cx='45' cy='105' r='4' fill='#ea580c'/><circle cx='60' cy='105' r='4' fill='#ea580c'/><text x='45' y='136' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Beaker C</text></g></svg></div>`;

const paper2Science2015Questions = [
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `The diagrams below illustrate three different organisms (I, II, and III) that are harmful to domestic farm animals. Study the diagrams carefully and answer the questions that follow:

${svgQ1aParasitesVar}

(i) Identify each of the organisms labelled I, II, and III.

(ii) Classify each of the organisms as:
  (α) an ectoparasite;
  (β) an endoparasite;
  (γ) an insect vector.

(iii) State one adverse pathological effect that each of the organisms produces on infected farm animals.

(iv) State three hygienic or management methods used to control the organism labelled III in a livestock herd.`,
        workedSolution: `(i) Identification of organisms:
• Organism I: Body louse (plural: lice)
• Organism II: Tsetse fly
• Organism III: Tapeworm (*Taenia spp.*)

(ii) Classification:
• (α) Ectoparasite: Organism I (Louse) [lives on skin/hair].
• (β) Endoparasite: Organism III (Tapeworm) [lives in small intestine].
• (γ) Insect vector: Organism II (Tsetse fly) [transmits *Trypanosoma*].

(iii) Adverse pathological effects:
• Organism I (Louse): Pierces host skin to suck blood, producing intense pruritus (skin irritation), restlessness, loss of hair, and anaemia.
• Organism II (Tsetse fly): Transmits microscopic flagellate protozoa (*Trypanosoma*), causing animal trypanosomiasis (Nagana), marked by high fever, severe emaciation, and death.
• Organism III (Tapeworm): Attaches its scolex to the intestinal wall, absorbing pre-digested nutrients, leading to emaciation, stunted growth, abdominal pain, and intestinal blockage.

(iv) Methods of controlling Organism III (Tapeworm):
• Routine deworming of farm animals using recommended veterinary anthelminthics (e.g., albendazole).
• Proper sanitary disposal of human and animal faecal wastes to prevent pasture contamination.
• Inspecting and cooking animal feedstuffs and ensuring clean rotational grazing on safe paddocks.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagram below illustrates a burning candle placed in front of a flat plane mirror MM', forming an image behind the mirror. Study the optical ray diagram carefully and answer the questions that follow:

${svgQ1bReflection}

(i) Name each of the ray and normal lines labelled I, II, III, and IV.

(ii) State the exact mathematical relationship between the angle of incidence (θ₁) and the angle of reflection (θ₂).

(iii) Give three physical characteristics of the image labelled IV formed by the plane mirror.

(iv) Explain why image IV is represented using broken lines rather than solid lines.`,
        workedSolution: `(i) Identification of ray diagram parts:
• I: Incident ray
• II: Normal (perpendicular line to mirror at point of incidence)
• III: Reflected ray
• IV: Virtual image of the candle

(ii) Mathematical relationship:
According to the First Law of Reflection:
$$\\theta_1 = \\theta_2\\quad (\\text{Angle of incidence } = \\text{Angle of reflection})$$

(iii) Characteristics of Image IV:
1. It is virtual (cannot be formed or captured on a physical screen).
2. It is erect (upright) and the same size as the real object.
3. It is laterally inverted (left and right sides are reversed).
4. Its distance behind the mirror equals the perpendicular distance of the object in front of the mirror.

(iv) Why Image IV is drawn in broken lines:
Image IV is a virtual image. The light rays do not actually originate from or pass through the image location; they only appear to diverge from that point when projected backward.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `In a laboratory demonstration to investigate the reactivity of Group 1 alkali metals, a small freshly cut piece of sodium metal was carefully dropped into a beaker containing cold water:

${svgQ1cSodiumWater}

(i) State what observation would be made if a glowing wooden splint were held at the mouth of the beaker.

(ii) Name the flammable gas evolved during the vigorous chemical reaction.

(iii) Write a balanced chemical equation for the reaction that occurred between sodium and water.

(iv) Name two other metallic elements in the Periodic Table that react vigorously with cold water in a similar manner.`,
        workedSolution: `(i) Observation with glowing splint:
The glowing splint is ignited immediately and burns with a characteristic sharp "pop" sound (or burns with a pale blue flame).

(ii) Name of gas evolved:
Hydrogen gas ($H_2$).

(iii) Balanced chemical equation:
$$2\\text{Na}_{(s)} + 2\\text{H}_2\\text{O}_{(l)} \\to 2\\text{NaOH}_{(aq)} + \\text{H}_{2(g)}$$

(iv) Other similarly reactive metals:
Lithium (Li) and Potassium (K) [Group 1 alkali metals].`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `An experiment was performed to investigate the physical conditions necessary for the germination of viable bean seeds. Three glass beakers labelled A, B, and C containing viable seeds were set up at room temperature as shown below:

${svgQ1dGerminationBeakers}

(i) State what would happen to the seeds in each of the beakers labelled A, B, and C when inspected after five days.

(ii) Provide a scientific reason for your observation in each beaker in (d)(i).

(iii) Explain why a layer of boiled vegetable oil was poured on the surface of the water in Beaker C.`,
        workedSolution: `(i) Observations after five days:
• Beaker A: The seeds do not germinate.
• Beaker B: The seeds germinate successfully (radicles and plumules emerge).
• Beaker C: The seeds do not germinate (or rot).

(ii) Scientific reasons:
• Beaker A: Seeds do not germinate because water (moisture) is absent; dry seeds cannot activate metabolic respiratory enzymes.
• Beaker B: Seeds germinate because all essential environmental requirements—water (moisture), atmospheric oxygen (air), and optimum warmth (room temperature)—are present.
• Beaker C: Seeds do not germinate because dissolved oxygen (air) is completely absent. Boiling drives out dissolved air, and the oil layer prevents atmospheric oxygen from re-dissolving.

(iii) Purpose of the oil layer in Beaker C:
To form an impermeable physical barrier that prevents atmospheric oxygen (air) from dissolving into the boiled water and reaching the submerged seeds.`,
        maxMarks: 10
      }
    ]
  },
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) Define the term weather.\n\n(ii) State two clear differences between weather and climate.",
        workedSolution: `(i) Definition of weather:
The atmospheric condition of a specific geographic locality recorded over a short period of time (hours or days), defined by temperature, humidity, rainfall, and wind.

(ii) Differences between weather and climate:
1. Time scale: Weather describes day-to-day atmospheric changes over short intervals, whereas climate represents the long-term average atmospheric pattern observed over 30 to 35 years.
2. Predictability and variability: Weather fluctuates rapidly and is less predictable, while climate exhibits stable, predictable seasonal cycles.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "State the elemental composition of each of the following commercial alloys:\n\n(i) Carbon steel;\n\n(ii) Stainless steel.",
        workedSolution: `(i) Carbon steel:
Iron (Fe) and Carbon (C).

(ii) Stainless steel:
Iron (Fe), Carbon (C), Chromium (Cr), and Nickel (Ni).`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "List four physiological health benefits derived by humans from including fresh vegetables in their daily diet.",
        workedSolution: `1. Provides essential vitamins (such as Vitamin A and Vitamin C) that enhance immune resistance against pathogenic infections.
2. Supplies vital mineral salts (calcium, iron, magnesium) required for metabolic co-factors and blood formation.
3. Supplies dietary fibre (roughage) that promotes gastrointestinal peristalsis and prevents constipation.
4. Rich in phytochemical antioxidants that scavenge free radicals, reducing the risk of chronic cardiovascular diseases and cancer.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Name four sequential stages in the reproductive and developmental life cycle of an angiosperm (flowering plant).",
        workedSolution: `Sequential stages:
1. Seed germination and seedling emergence
2. Vegetative growth into a mature leafy plant
3. Floral bud development and flowering
4. Pollination and double fertilization
5. Seed and fruit development followed by seed dispersal`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Using the concept of electronic configuration and octet stability, explain how:\n\n(i) A neutral Lithium atom ($_{3}\\text{Li}$) becomes a positively charged cation;\n\n(ii) A neutral Oxygen atom ($_{8}\\text{O}$) becomes a negatively charged anion.",
        workedSolution: `(i) Lithium cation formation:
A neutral lithium atom has an electron configuration of $2, 1$. To achieve a stable duplet configuration like helium, it readily loses its single valence electron from its outer shell:
$$\\text{Li} \\to \\text{Li}^+ + e^-$$
The resulting ion retains 3 positive protons in its nucleus but only 2 orbiting negative electrons, acquiring a net positive charge of $+1$.

(ii) Oxide anion formation:
A neutral oxygen atom has an electron configuration of $2, 6$. To attain a stable octet configuration, it gains two electrons into its outer shell:
$$\\text{O} + 2e^- \\to \\text{O}^{2-}$$
Because it now possesses 10 negative electrons against 8 positive nuclear protons, it carries a net negative charge of $-2$.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) What is gravitational potential energy?\n\n(ii) A coconut fruit of mass $2.0\\text{ kg}$ hangs from a palm tree at a height of $5.0\\text{ m}$ above the ground. Calculate the potential energy possessed by the coconut. [Take acceleration due to gravity, $g = 10\\text{ m s}^{-2}$].",
        workedSolution: `(i) Potential energy definition:
The energy stored in a physical body as a consequence of its vertical position, elevation, or configuration in a gravitational field.

(ii) Calculation:
Formula:
$$\\text{P.E.} = mgh$$
Substitute the given values ($m = 2.0\\text{ kg}$, $g = 10\\text{ m s}^{-2}$, $h = 5.0\\text{ m}$):
$$\\text{P.E.} = 2.0 \\times 10 \\times 5.0 = 100\\text{ J}$$
Answer: $$100\\text{ Joules (J)}$$.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "State four socio-economic, educational, or behavioral causes of teenage pregnancy in developing communities.",
        workedSolution: `1. Inadequate sexual and reproductive health education in homes and schools.
2. Household poverty and financial deprivation pushing young girls into transactional sexual relationships.
3. Negative peer influence and exposure to unrated sexually explicit digital media.
4. Parental neglect, breakdown in family supervision, and lack of accessible contraceptive counseling services.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State two distinct agricultural functions of soil in crop husbandry.",
        workedSolution: `1. Mechanical anchorage: Provides physical root support that anchors crops upright against wind lodging.
2. Reservoir of water and nutrients: Holds capillary moisture and dissolved mineral ions (nitrogen, phosphorus, potassium) for root absorption.
3. Aeration: Soil macropores contain air supplying oxygen for root respiration and beneficial microbial decomposition.`,
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
        prompt: "Outline four essential physiological roles of water in maintaining human health.",
        workedSolution: `1. Universal solvent: Dissolves and transports digested nutrients, respiratory gases, and metabolic waste products in blood plasma.
2. Thermoregulation: Evaporation of sweat from skin pores dissipates latent heat, regulating internal body temperature.
3. Lubrication: Lubricates articular joints, pleural membranes, and the digestive tract to reduce friction.
4. Excretion: Facilitates renal filtration and elimination of metabolic nitrogenous wastes in urine.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) State two agronomic benefits of practicing systematic crop rotation.\n\n(ii) Distinguish between mixed cropping and mixed farming.",
        workedSolution: `(i) Benefits of crop rotation:
• Maintains soil fertility by alternating heavy nutrient-depleting crops with nitrogen-fixing leguminous crops.
• Breaks pest and disease cycles by depriving host-specific pathogens of continuous nourishment across seasons.

(ii) Distinction:
• Mixed cropping: The simultaneous cultivation of two or more different crop species on the same piece of land during the same farming season.
• Mixed farming: An integrated agricultural system where crop cultivation is combined with the rearing of livestock on the same farm parcel.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) What is an electrical fuse?\n\n(ii) State the international standard insulation colour code of the live conductor wire to which a fuse is connected inside a 3-pin plug.",
        workedSolution: `(i) Definition of fuse:
An electrical safety device containing a thin metallic strip with a low melting point designed to melt and open the circuit when current exceeds a predetermined safe rating.

(ii) Colour code:
Brown (or Red in older British wiring systems).`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "(i) In a tabular format, state three scientific differences between osmosis and diffusion.\n\n(ii) State one fundamental physical similarity between osmosis and diffusion.",
        workedSolution: `(i) Differences Table:

| Feature | Osmosis | Diffusion |
| :--- | :--- | :--- |
| **Molecules Moving** | Solvent (water) molecules only | Solute, liquid, or gas particles |
| **Membrane Requirement** | Requires a selectively permeable membrane | Does not require a membrane |
| **Medium of Occurrence** | Occurs exclusively in liquid solutions | Occurs in gases, liquids, and solutions |

(ii) Similarity:
Both are passive transport processes driven by random thermal kinetic energy down a concentration gradient without requiring metabolic ATP energy.`,
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
        prompt: "(i) What is a balanced ration in animal nutrition?\n\n(ii) State two economic benefits of feeding balanced rations to commercial egg-laying poultry birds.",
        workedSolution: `(i) Definition of balanced ration:
A formulated daily feed allowance that provides all essential dietary nutrients (carbohydrates, proteins, fats, vitamins, minerals, and water) in the exact amounts and proportions required to support growth, reproduction, and maintenance.

(ii) Benefits to poultry:
1. Maximizes egg production rates and improves eggshell thickness and internal yolk quality.
2. Accelerates broiler growth rates, improves feed conversion ratios, and prevents metabolic deficiency diseases.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "List four laboratory safety hazards encountered during science practical lessons and state one precaution for each.",
        workedSolution: `1. Chemical burns from corrosive acids/alkalis: Wear protective safety goggles and acid-resistant rubber gloves.
2. Inhalation of toxic or irritating fumes: Conduct volatile chemical reactions inside a certified fume chamber.
3. Thermal burns from open Bunsen flames: Tie back long hair, avoid loose clothing, and handle hot glassware with crucible tongs.
4. Physical cuts from broken glassware: Inspect glassware for cracks before heating and dispose of broken glass in designated sharps bins.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Name three anatomical components of the human circulatory system.",
        workedSolution: `1. The Heart (muscular pump).
2. The Blood (circulating fluid connective tissue).
3. The Blood Vessels (arteries, veins, and microscopic capillaries).`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "(i) Define the term simple machine.\n\n(ii) State two mechanical methods used to minimize frictional resistance between moving parts of machines.",
        workedSolution: `(i) Definition:
A mechanical tool or device that alters the magnitude, speed, or direction of an applied effort force, making mechanical work easier to accomplish.

(ii) Methods of minimizing friction:
1. Lubrication: Applying engine oil, grease, or graphite between rubbing surfaces to form a slippery separating film.
2. Using ball bearings or roller bearings to replace sliding friction with rolling friction.
3. Polishing and smoothing contact surfaces to remove microscopic projections.`,
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
        prompt: "(i) What is a magnetic field?\n\n(ii) Classify each of the following everyday materials into a solid-in-gas mixture, gas-in-gas mixture, or solid-in-solid mixture:\n  (α) Air;\n  (β) Dense smoke;\n  (γ) Bronze alloy.",
        workedSolution: `(i) Definition:
A region of space surrounding a permanent magnet or current-carrying conductor where magnetic forces of attraction or repulsion can be detected.

(ii) Mixture classification:
• (α) Air: Gas-in-gas mixture (primarily nitrogen and oxygen).
• (β) Dense smoke: Solid-in-gas mixture (fine solid carbon soot suspended in air).
• (γ) Bronze: Solid-in-solid mixture (interstitial alloy of copper and tin).`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) What is dental plaque in human dentition?\n\n(ii) State the biochemical role played by chlorophyll during the process of photosynthesis in green leaves.",
        workedSolution: `(i) Dental plaque:
A sticky, colorless film of bacteria, salivary glycoproteins, and food residues that continuously accumulates on tooth enamel and along gum margins.

(ii) Role of chlorophyll:
Chlorophyll absorbs radiant photons from sunlight, converting solar energy into chemical energy to drive the photolysis of water and the synthesis of carbohydrates.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Identify the primary scientific or biochemical principle underlying each of the following traditional food processing and renewable energy industries in Ghana:\n\n(i) Kenkey production;\n\n(ii) Commercial solar salt production;\n\n(iii) Fish smoking;\n\n(iv) Domestic biogas generation.",
        workedSolution: `Scientific principles:
• (i) Kenkey production: Anaerobic microbial fermentation (lactic acid fermentation of maize dough).
• (ii) Solar salt production: Evaporation of water from concentrated brine using solar radiation.
• (iii) Fish smoking: Food preservation by thermal dehydration and surface deposition of antimicrobial phenolic compounds from wood smoke.
• (iv) Biogas generation: Anaerobic microbial digestion (methanogenesis) of animal manure by methanogenic bacteria.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) What is a plant parasite?\n\n(ii) Give two biological examples of parasitic plants that obtain nutrients from host trees.",
        workedSolution: `(i) Definition:
A plant that lives on or within another host plant, deriving some or all of its water, mineral salts, and synthesized carbohydrates via specialized roots (haustoria), causing harm to the host.

(ii) Examples:
• Mistletoe (*Tapinanthus spp.*)
• Dodder (*Cuscuta spp.*)
• Witchweed (*Striga spp.*)`,
        maxMarks: 3
      }
    ]
  }
];

async function seedBece2015SciencePaper2Variant() {
  console.log('Seeding 2015 BECE Integrated Science Paper 2 Variant (Set 77) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2015_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 from Section A (compulsory), and any three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Science2015Questions
    },
    'metadata.paper2Calibrated': true,
    'metadata.set77Verified': true,
    'metadata.updatedAt': new Date()
  }, { merge: true });

  console.log('✅ Successfully seeded Set 77 (2015 Science Paper 2 Variant) into past_papers/paper_2015_variant.');
}

seedBece2015SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 77 Science Paper 2:', err);
    process.exit(1);
  });

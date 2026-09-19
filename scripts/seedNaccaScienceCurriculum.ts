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
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
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

  // CLI OAuth fallback
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
  } catch (cliErr) {
    // Continue to applicationDefault
  }

  try {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
    return adminInstance.firestore();
  } catch (e) {
    return adminInstance.firestore();
  }
}

// 1. Vector SVG: Three Types of Mixtures (Solution, Colloid, Suspension) [NaCCA Item 1]
const svgMixturesColloid = `
<svg viewBox='0 0 360 140' width='100%' height='130' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Beaker I: True Solution -->
  <rect x='30' y='30' width='70' height='75' rx='4' fill='#e0f2fe' stroke='#0284c7' stroke-width='2'/>
  <rect x='32' y='55' width='66' height='48' fill='#38bdf8' opacity='0.4'/>
  <text x='65' y='122' font-size='11' font-weight='bold' fill='#0369a1' text-anchor='middle'>I (Solution)</text>
  <!-- Beaker II: Colloid -->
  <rect x='145' y='30' width='70' height='75' rx='4' fill='#f1f5f9' stroke='#475569' stroke-width='2'/>
  <rect x='147' y='55' width='66' height='48' fill='#94a3b8' opacity='0.5'/>
  <!-- Microscopic suspended particles -->
  <circle cx='160' cy='65' r='1.5' fill='#334155'/><circle cx='175' cy='72' r='1.5' fill='#334155'/>
  <circle cx='195' cy='68' r='1.5' fill='#334155'/><circle cx='165' cy='85' r='1.5' fill='#334155'/>
  <circle cx='185' cy='88' r='1.5' fill='#334155'/><circle cx='200' cy='80' r='1.5' fill='#334155'/>
  <text x='180' y='122' font-size='11' font-weight='bold' fill='#334155' text-anchor='middle'>II (Colloid)</text>
  <!-- Beaker III: Suspension -->
  <rect x='260' y='30' width='70' height='75' rx='4' fill='#f8fafc' stroke='#0f172a' stroke-width='2'/>
  <rect x='262' y='55' width='66' height='48' fill='#cbd5e1' opacity='0.3'/>
  <!-- Large visible settling particles -->
  <circle cx='275' cy='70' r='3.5' fill='#0284c7'/><circle cx='295' cy='65' r='4' fill='#0284c7'/>
  <circle cx='315' cy='75' r='3' fill='#0284c7'/><circle cx='285' cy='85' r='4' fill='#0284c7'/>
  <circle cx='305' cy='92' r='3.5' fill='#0284c7'/><circle cx='270' cy='95' r='4' fill='#0284c7'/>
  <text x='295' y='122' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>III (Suspension)</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG: Atomic Structure (Nucleus & Electron Shells) [NaCCA Item 3]
const svgAtomicStructure = `
<svg viewBox='0 0 280 200' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Outer Orbit Shell -->
  <circle cx='140' cy='100' r='70' fill='none' stroke='#64748b' stroke-width='1.5' stroke-dasharray='4,4'/>
  <!-- Nucleus Region (IV) -->
  <circle cx='140' cy='100' r='28' fill='#eff6ff' stroke='#2563eb' stroke-width='2'/>
  <text x='140' y='105' font-size='13' font-weight='bold' fill='#1e40af' text-anchor='middle'>IV</text>
  <!-- Orbiting Electron (V) -->
  <circle cx='210' cy='100' r='10' fill='#fee2e2' stroke='#dc2626' stroke-width='1.5'/>
  <text x='210' y='104' font-size='11' font-weight='bold' fill='#b91c1c' text-anchor='middle'>V</text>
  <!-- Pointer Labels -->
  <text x='140' y='155' font-size='10' font-weight='bold' fill='#1e40af' text-anchor='middle'>Part IV: Nucleus</text>
  <text x='210' y='130' font-size='10' font-weight='bold' fill='#b91c1c' text-anchor='middle'>Part V: Electron</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG: Mammalian Dentition Types (Incisor, Canine, Premolar, Molar) [NaCCA Item 11]
const svgMammalianDentition = `
<svg viewBox='0 0 360 160' width='100%' height='140' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- I: Incisor (Chisel-shaped) -->
  <g transform='translate(35, 20)'>
    <path d='M 10 10 Q 25 5 40 10 L 32 75 L 18 75 Z' fill='#ffffff' stroke='#0f172a' stroke-width='1.8'/>
    <text x='25' y='105' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>I (Incisor)</text>
    <text x='25' y='120' font-size='9' fill='#64748b' text-anchor='middle'>Biting/Cutting</text>
  </g>
  <!-- II: Canine (Pointed) -->
  <g transform='translate(115, 20)'>
    <path d='M 10 20 Q 25 5 40 20 L 28 85 L 22 85 Z' fill='#ffffff' stroke='#0f172a' stroke-width='1.8'/>
    <text x='25' y='105' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>II (Canine)</text>
    <text x='25' y='120' font-size='9' fill='#64748b' text-anchor='middle'>Tearing flesh</text>
  </g>
  <!-- III: Premolar (Two Cusps) -->
  <g transform='translate(195, 20)'>
    <path d='M 8 20 Q 18 10 28 20 Q 38 10 48 20 L 40 80 L 16 80 Z' fill='#ffffff' stroke='#0f172a' stroke-width='1.8'/>
    <text x='28' y='105' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>III (Premolar)</text>
    <text x='28' y='120' font-size='9' fill='#64748b' text-anchor='middle'>Grinding/Chewing</text>
  </g>
  <!-- IV: Molar (Broad Cusps with multiple roots) -->
  <g transform='translate(275, 20)'>
    <path d='M 6 20 Q 18 8 30 20 Q 42 8 54 20 L 50 65 L 42 85 L 32 65 L 20 85 L 12 65 Z' fill='#ffffff' stroke='#0f172a' stroke-width='1.8'/>
    <text x='30' y='105' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>IV (Molar)</text>
    <text x='30' y='120' font-size='9' fill='#64748b' text-anchor='middle'>Crushing/Grinding</text>
  </g>
</svg>
`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG: Rectilinear Propagation of Light Apparatus [NaCCA Item 47]
const svgLightPropagation = `
<svg viewBox='0 0 360 160' width='100%' height='140' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Lighted Candle -->
  <rect x='30' y='90' width='16' height='40' fill='#cbd5e1' stroke='#475569' stroke-width='1.5'/>
  <path d='M 38 90 Q 33 75 38 65 Q 43 75 38 90 Z' fill='#f59e0b' stroke='#d97706'/>
  <circle cx='38' cy='77' r='3' fill='#fef08a'/>
  <!-- Three Cardboards with Pinholes in a straight line -->
  <rect x='95' y='40' width='10' height='95' fill='#94a3b8' stroke='#334155'/>
  <circle cx='100' cy='80' r='2' fill='#ffffff'/>
  <rect x='175' y='40' width='10' height='95' fill='#94a3b8' stroke='#334155'/>
  <circle cx='180' cy='80' r='2' fill='#ffffff'/>
  <rect x='255' y='40' width='10' height='95' fill='#94a3b8' stroke='#334155'/>
  <circle cx='260' cy='80' r='2' fill='#ffffff'/>
  <!-- Straight Light Ray Line -->
  <line x1='38' y1='77' x2='310' y2='77' stroke='#dc2626' stroke-width='1.8' stroke-dasharray='3,2'/>
  <!-- Observer Eye -->
  <path d='M 315 70 Q 335 77 315 84 Z' fill='none' stroke='#1e293b' stroke-width='2'/>
  <circle cx='322' cy='77' r='3' fill='#1e293b'/>
  <text x='180' y='150' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>RECTILINEAR PROPAGATION OF LIGHT</text>
</svg>
`.trim().replace(/\n\s*/g, '');

const scienceTopicalUnits = [
  // ==========================================
  // BASIC 7 (BS7 / JHS 1) UNITS
  // ==========================================
  {
    id: "b7_strand1_materials_states",
    gradeLevel: "BS7",
    strandNumber: 1,
    strandTitle: "Diversity of Matter",
    subStrandTitle: "Materials: States of Matter & Physical Properties",
    naccaCode: "B7.1.1.1",
    order: 1,
    notes: {
      summaryMarkdown: `### States of Matter and Particulate Theory
Matter is anything that has mass and occupies space. It exists in three primary physical states: **solids, liquids, and gases**.

* **Particulate Arrangement & Behavior:**
  - **Solids:** Particles are closely packed in fixed positions, held by strong intermolecular forces; they vibrate in fixed positions and maintain a definite shape and volume.
  - **Liquids:** Particles are close together but can slide past one another; they possess a definite volume but take the shape of their container.
  - **Gases:** Particles are widely separated with negligible intermolecular attractions; they move rapidly in random directions and fill any available space.
* **Thermal Changes:** Heating increases the kinetic energy of particles, causing solids to melt into liquids and liquids to vaporize into gases.`,
      keyTerms: [
        { term: "Kinetic Theory of Matter", definition: "A theory stating that all matter consists of tiny particles that are constantly in motion." },
        { term: "Melting Point", definition: "The constant temperature at which a solid transforms into a liquid at atmospheric pressure." },
        { term: "Incompressibility", definition: "The inability of solids and liquids to significantly decrease in volume under applied pressure." }
      ],
      diagramSvg: svgMixturesColloid
    },
    sampleWorkedProblems: [
      {
        id: "b7_mat_sp1",
        questionPrompt: "Explain why a gas exerts pressure on the interior walls of its container while a solid does not.",
        stepByStepSolution: `1. State the particle motion: Gas particles have high kinetic energy and move randomly at high speeds.
2. Link motion to wall impacts: As gas particles bombard the inner surface of the container, each collision exerts a microscopic force over an area ($P = \\frac{F}{A}$).
3. Contrast with solids: Solid particles vibrate in fixed positions and do not move freely to collide with container walls.`,
        examinerTip: "Always refer to the kinetic energy and continuous collision of particles when explaining gas pressure."
      }
    ],
    drillQuestions: [
      {
        id: "b7_mat_q1",
        difficulty: "low",
        type: "objective",
        prompt: "Which of the following statements correctly describes the arrangement of particles in a solid?",
        options: [
          "Tightly packed in fixed positions with vibrational motion",
          "Widely separated with random high-speed motion",
          "Loosely arranged with freedom to slide past one another",
          "Dispersed uniformly with zero intermolecular attraction"
        ],
        correctAnswer: "Tightly packed in fixed positions with vibrational motion",
        hint: "Recall that solids have definite shape and volume.",
        workedSolution: "In solids, strong intermolecular bonds hold particles in fixed positions, restricting their movement to vibrations.",
        points: 1
      },
      {
        id: "b7_mat_q2",
        difficulty: "medium",
        type: "objective",
        prompt: "What happens to the kinetic energy of liquid particles as a liquid cools down and freezes into a solid?",
        options: [
          "Kinetic energy decreases and particles move into fixed positions",
          "Kinetic energy increases and particles move further apart",
          "Kinetic energy remains constant while intermolecular bonds break",
          "Kinetic energy doubles until vaporization occurs"
        ],
        correctAnswer: "Kinetic energy decreases and particles move into fixed positions",
        hint: "Cooling involves removal of thermal energy.",
        workedSolution: "Cooling reduces thermal energy and molecular velocities. The particles slow down until intermolecular forces lock them into fixed lattice sites.",
        points: 1
      },
      {
        id: "b7_mat_q3",
        difficulty: "high",
        type: "structured",
        prompt: "Using the particulate theory of matter, explain why water expands slightly and becomes less dense when it freezes into ice.",
        correctAnswer: "When water freezes, hydrogen bonds hold the water molecules in an open, rigid hexagonal crystalline lattice with more empty spaces between molecules than in liquid water, increasing volume and decreasing density.",
        hint: "Consider the open crystalline structure formed by water molecules upon freezing.",
        workedSolution: "As water cools below 4°C and freezes at 0°C, molecules form an open hexagonal lattice due to fixed hydrogen bonds. This open cage structure occupies a larger volume than liquid water, resulting in lower density.",
        points: 4
      }
    ]
  },

  // ==========================================
  // BASIC 8 (BS8 / JHS 2) UNITS
  // ==========================================
  {
    id: "b8_strand1_matter_atoms_bonding",
    gradeLevel: "BS8",
    strandNumber: 1,
    strandTitle: "Diversity of Matter",
    subStrandTitle: "Atomic Structure, Elements & Chemical Bonding",
    naccaCode: "B8.1.1.2",
    order: 2,
    notes: {
      summaryMarkdown: `### Atomic Structure & Sub-Atomic Particles
An atom is the smallest unit of an element that retains the chemical properties of that element.

* **Sub-Atomic Particles:**
  - **Protons ($p^+$):** Positively charged ($+1$), located in the dense central nucleus. Relative mass = 1.
  - **Neutrons ($n^0$):** Neutral / no charge ($0$), located in the nucleus. Relative mass = 1.
  - **Electrons ($e^-$):** Negatively charged ($-1$), orbiting the nucleus in energy shells. Relative mass = $\\frac{1}{1840}$.
* **Atomic Number ($Z$) & Mass Number ($A$):**
  - $Z = \\text{Number of protons in the nucleus}$.
  - $A = \\text{Protons} + \\text{Neutrons}$.
  - In a neutral atom: $\\text{Number of protons} = \\text{Number of electrons}$.
* **Ion Formation:**
  - **Cations:** Formed when metals lose valence electrons (e.g., $\\text{Na} \\to \\text{Na}^+ + e^-$).
  - **Anions:** Formed when non-metals gain valence electrons (e.g., $\\text{Cl} + e^- \\to \\text{Cl}^-$).`,
      keyTerms: [
        { term: "Nucleus", definition: "The central core of an atom containing protons and neutrons, contributing virtually all atomic mass." },
        { term: "Valency", definition: "The combining capacity of an atom, determined by the number of electrons lost, gained, or shared." },
        { term: "Octet Rule", definition: "The tendency of atoms to attain a stable electron configuration of 8 valence electrons in their outermost shell." }
      ],
      diagramSvg: svgAtomicStructure
    },
    sampleWorkedProblems: [
      {
        id: "b8_atom_sp1",
        questionPrompt: "An atom of element $X$ has an atomic number of 11 and a mass number of 23. Determine the number of protons, electrons, and neutrons, and state its electron configuration.",
        stepByStepSolution: `1. Protons: Number of protons $= Z = 11$.
2. Electrons: For a neutral atom, electrons $= \\text{protons} = 11$.
3. Neutrons: $A - Z = 23 - 11 = 12\\text{ neutrons}$.
4. Electron Configuration: Filling shells (max 2 in 1st, 8 in 2nd): $2, 8, 1$.`,
        examinerTip: "Remember that cations have fewer electrons than protons, while neutral atoms have equal numbers."
      }
    ],
    drillQuestions: [
      {
        id: "b8_atom_q1",
        difficulty: "low",
        type: "objective",
        prompt: `Based on the atomic structure diagram below, which sub-atomic particles are located in the part labelled IV?<br/>${svgAtomicStructure}`,
        options: [
          "Protons and neutrons",
          "Protons and electrons",
          "Neutrons and electrons",
          "Electrons only"
        ],
        correctAnswer: "Protons and neutrons",
        hint: "Part IV identifies the central dense nucleus.",
        workedSolution: "Part IV represents the atomic nucleus, which contains the heavy nucleons: protons and neutrons.",
        points: 1
      },
      {
        id: "b8_atom_q2",
        difficulty: "medium",
        type: "objective",
        prompt: "A neutral magnesium atom ($_{12}^{24}\\text{Mg}$) loses two valence electrons to form an ion ($\\text{Mg}^{2+}$). What is the total number of electrons in this ion?",
        options: ["10", "12", "14", "24"],
        correctAnswer: "10",
        hint: "Subtract the lost electrons from the atomic number.",
        workedSolution: "A neutral magnesium atom has 12 electrons. Losing 2 electrons yields $12 - 2 = 10$ electrons.",
        points: 1
      },
      {
        id: "b8_atom_q3",
        difficulty: "high",
        type: "structured",
        prompt: "Explain why noble gases (Group 8/18 elements such as Helium, Neon, and Argon) are chemically unreactive and do not readily form chemical bonds.",
        correctAnswer: "Noble gases possess completely filled valence electron shells (a stable duplet configuration for Helium and a stable octet configuration of 8 valence electrons for others), so they do not need to gain, lose, or share electrons.",
        hint: "Focus on the electron arrangement in their outermost shells.",
        workedSolution: "Chemical reactivity is driven by the tendency to achieve a stable electronic configuration. Because noble gases already possess full outermost energy shells, they exhibit chemical stability and zero valency.",
        points: 3
      }
    ]
  },

  {
    id: "b8_strand3_human_body_dentition",
    gradeLevel: "BS8",
    strandNumber: 3,
    strandTitle: "Systems",
    subStrandTitle: "The Human Body: Mammalian Dentition & Digestive Health",
    naccaCode: "B8.3.1.1",
    order: 3,
    notes: {
      summaryMarkdown: `### Types of Teeth and Mastication
Humans have four specialized types of teeth that facilitate mechanical breakdown of food.

* **Tooth Types & Adaptations:**
  - **Incisors (I):** Chisel-shaped with sharp, flat edges; adapted for biting and cutting food pieces.
  - **Canines (II):** Sharp, pointed crowns; adapted for piercing, tearing, and holding tough food.
  - **Premolars (III):** Broad crowns with two distinct cusps; adapted for chewing, crushing, and grinding.
  - **Molars (IV):** Large, broad surface with 4–5 cusps and multiple roots; adapted for crushing and fine grinding.
* **Dental Formula (Adult Humans):** $2\\left(I\\frac{2}{2}, C\\frac{1}{1}, PM\\frac{2}{2}, M\\frac{3}{3}\\right) = 32\\text{ teeth}$.
* **Tooth Decay Prevention:** Brushing twice daily with fluoride toothpaste, reducing refined sugars, and flossing prevent plaque bacteria from producing lactic acid that demineralizes enamel.`,
      keyTerms: [
        { term: "Enamel", definition: "The hard, highly mineralized outer covering of the tooth crown, composed of calcium hydroxyapatite." },
        { term: "Dentine", definition: "The bone-like living tissue forming the bulk of the tooth beneath the enamel." },
        { term: "Plaque", definition: "A sticky bio-film of bacteria, food remnants, and saliva that forms on teeth." }
      ],
      diagramSvg: svgMammalianDentition
    },
    sampleWorkedProblems: [
      {
        id: "b8_dent_sp1",
        questionPrompt: "State the biological process that leads to dental caries (tooth decay) and explain how fluoride protects teeth.",
        stepByStepSolution: `1. Bacteria in dental plaque ferment refined sugars from food to produce organic acids (mainly lactic acid).
2. The acid lowers the oral pH below 5.5, dissolving calcium and phosphate ions from enamel (demineralization).
3. Fluoride incorporates into enamel to form fluorapatite, which resists acid attacks and promotes remineralization.`,
        examinerTip: "Do not say 'sugar rots teeth.' Clarify that bacteria metabolize sugars to release enamel-dissolving acids."
      }
    ],
    drillQuestions: [
      {
        id: "b8_dent_q1",
        difficulty: "low",
        type: "objective",
        prompt: `Which of the following best describes the primary function of the tooth labelled I in the diagram below?<br/>${svgMammalianDentition}`,
        options: [
          "Biting and cutting food",
          "Tearing and grasping tough food",
          "Crushing and fine grinding",
          "Holding prey firmly"
        ],
        correctAnswer: "Biting and cutting food",
        hint: "Tooth I is a front incisor.",
        workedSolution: "Tooth I is a chisel-shaped incisor designed for cutting and biting food.",
        points: 1
      },
      {
        id: "b8_dent_q2",
        difficulty: "medium",
        type: "objective",
        prompt: "Which layer of the tooth contains blood vessels and nerve fibers that transmit sensitivity and pain?",
        options: ["Pulp cavity", "Enamel", "Cementum", "Crown surface"],
        correctAnswer: "Pulp cavity",
        hint: "The soft innermost living core of the tooth.",
        workedSolution: "The central pulp cavity houses capillaries that nourish the tooth and nerve endings that sense pressure and pain.",
        points: 1
      },
      {
        id: "b8_dent_q3",
        difficulty: "high",
        type: "structured",
        prompt: "Describe the structural adaptation of the molar tooth (IV) that makes it suitable for masticating fibrous plant material.",
        correctAnswer: "Molars have a wide, broad surface area equipped with multiple ridges and cusps that increase grinding efficiency, supported by multiple deep roots that anchor the tooth firmly into the jawbone against high chewing forces.",
        hint: "Discuss both the surface shape (cusps) and the anchoring roots.",
        workedSolution: "Molars have broad crowns with multiple raised cusps to crush plant cell walls. They are anchored into the jaw by two or three sturdy divergent roots that distribute high mastication stresses.",
        points: 3
      }
    ]
  },

  // ==========================================
  // BASIC 9 (BS9 / JHS 3) UNITS
  // ==========================================
  {
    id: "b9_strand1_matter_acids_bases",
    gradeLevel: "BS9",
    strandNumber: 1,
    strandTitle: "Diversity of Matter",
    subStrandTitle: "Binary Compounds: Acids, Bases, Salts & Neutralization",
    naccaCode: "B9.1.1.1",
    order: 4,
    notes: {
      summaryMarkdown: `### Acids, Bases, and Neutralization Reactions
Acids and bases are fundamental classes of chemical compounds with distinct chemical and physical properties.

* **Properties of Acids:**
  - Sour taste, turn blue litmus paper red, pH < 7.
  - Release hydrogen ions ($H^+$ or $H_3O^+$) in aqueous solution.
  - React with reactive metals to produce hydrogen gas: $\\text{Zn} + 2\\text{HCl} \\to \\text{ZnCl}_2 + \\text{H}_2\\uparrow$.
  - React with carbonates to liberate carbon dioxide gas: $\\text{CaCO}_3 + 2\\text{HCl} \\to \\text{CaCl}_2 + \\text{H}_2\\text{O} + \\text{CO}_2\\uparrow$.
* **Properties of Bases & Alkalis:**
  - Bitter taste, slippery/soapy feel, turn red litmus paper blue, pH > 7.
  - Alkalis are water-soluble bases that liberate hydroxide ions ($OH^-$) in solution.
* **Neutralization Reaction:**
  - An acid reacts with a base to produce a neutral salt and water:
    $$\\text{Acid} + \\text{Base} \\to \\text{Salt} + \\text{Water}$$
    $$\\text{HCl}_{(aq)} + \\text{NaOH}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$`,
      keyTerms: [
        { term: "pH Scale", definition: "A logarithmic scale from 0 to 14 indicating the acidity or alkalinity of a solution." },
        { term: "Neutralization", definition: "A chemical reaction in which hydrogen ions from an acid react with hydroxide ions from a base to form water." },
        { term: "Indicator", definition: "A chemical dye that changes color reversibly at specific pH thresholds." }
      ]
    },
    sampleWorkedProblems: [
      {
        id: "b9_acid_sp1",
        questionPrompt: "Write a balanced chemical equation for the reaction between dilute hydrochloric acid and calcium hydroxide, and name the salt formed.",
        stepByStepSolution: `1. Identify reactants: Hydrochloric acid ($HCl$) and Calcium hydroxide ($Ca(OH)_2$).
2. Identify products: Salt (Calcium chloride, $CaCl_2$) and Water ($H_2O$).
3. Formulate and balance equation:
   $$2\\text{HCl}_{(aq)} + \\text{Ca(OH)}_{2(aq)} \\to \\text{CaCl}_{2(aq)} + 2\\text{H}_2\\text{O}_{(l)}$$
4. Salt Name: Calcium chloride.`,
        examinerTip: "Ensure the formula for calcium chloride is written as CaCl₂ because Calcium has a valency of 2."
      }
    ],
    drillQuestions: [
      {
        id: "b9_acid_q1",
        difficulty: "low",
        type: "objective",
        prompt: "Which of the following pairs of substances react to form a salt and water only in a neutralization reaction?",
        options: [
          "Sodium hydroxide and hydrochloric acid",
          "Zinc metal and sulfuric acid",
          "Calcium carbonate and nitric acid",
          "Copper oxide and carbon dioxide"
        ],
        correctAnswer: "Sodium hydroxide and hydrochloric acid",
        hint: "Select an acid reacting directly with a soluble base.",
        workedSolution: "$\\text{NaOH} + \\text{HCl} \\to \\text{NaCl} + \\text{H}_2\\text{O}$ represents a classic neutralization yielding only a salt and water.",
        points: 1
      },
      {
        id: "b9_acid_q2",
        difficulty: "medium",
        type: "objective",
        prompt: "When carbon dioxide gas exhaled from human lungs is bubbled through limewater (aqueous calcium hydroxide), the solution turns milky. What is the chemical identity of this white precipitate?",
        options: [
          "Calcium carbonate",
          "Calcium chloride",
          "Calcium nitrate",
          "Calcium hydrogen carbonate"
        ],
        correctAnswer: "Calcium carbonate",
        hint: "$\\text{CO}_2 + \\text{Ca(OH)}_2 \\to \\text{insoluble white solid} + \\text{H}_2\\text{O}$.",
        workedSolution: "Carbon dioxide reacts with calcium hydroxide to precipitate insoluble white calcium carbonate: $\\text{Ca(OH)}_2 + \\text{CO}_2 \\to \\text{CaCO}_3\\downarrow + \\text{H}_2\\text{O}$.",
        points: 1
      },
      {
        id: "b9_acid_q3",
        difficulty: "high",
        type: "structured",
        prompt: "A farmer notices that crops in his field are wilting and soil tests indicate a pH of 4.8. Recommend a scientific soil treatment, explaining the chemical principle involved.",
        correctAnswer: "Apply agricultural lime (calcium hydroxide or calcium carbonate) to the soil. The basic lime neutralizes the excess soil acidity, raising the pH to an optimal range (6.0–7.0) for nutrient uptake.",
        hint: "Consider how an alkaline substance counteracts high acidity.",
        workedSolution: "A pH of 4.8 indicates strongly acidic soil. Adding agricultural lime ($\\text{CaCO}_3$ or $\\text{Ca(OH)}_2$) undergoes a neutralization reaction with the hydronium ions, restoring soil pH to between 6.0 and 7.0.",
        points: 4
      }
    ]
  },

  {
    id: "b9_strand4_energy_light_rectilinear",
    gradeLevel: "BS9",
    strandNumber: 4,
    strandTitle: "Forces and Energy",
    subStrandTitle: "Properties of Light: Rectilinear Propagation, Reflection & Refraction",
    naccaCode: "B9.4.1.3",
    order: 5,
    notes: {
      summaryMarkdown: `### Optical Physics: Behavior of Light Rays
Light is a form of electromagnetic radiation that enables vision.

* **Fundamental Properties:**
  - **Rectilinear Propagation:** Light travels in straight lines in a uniform, transparent medium. This causes shadow formation, eclipses, and the operation of the pinhole camera.
  - **Reflection:** The bouncing back of light rays from a boundary surface.
    * *First Law of Reflection:* Angle of incidence ($i$) = Angle of reflection ($r$).
    * *Second Law:* The incident ray, reflected ray, and normal all lie in the same plane.
  - **Refraction:** The bending of light as it passes obliquely from one optical medium to another of different optical density, caused by changes in light velocity.
    * Passing from less dense to denser medium (Air to Water): Ray bends **toward the normal**.
    * Passing from denser to less dense medium (Glass to Air): Ray bends **away from the normal**.
* **Dispersion:** The separation of white light into its component spectral colors (ROYGBIV) when passing through a triangular glass prism due to differing refraction angles.`,
      keyTerms: [
        { term: "Umbra", definition: "The complete, darkest inner region of a shadow where all direct light is blocked." },
        { term: "Penumbra", definition: "The lighter, partial outer shadow surrounding the umbra where light is only partially blocked." },
        { term: "Refractive Index", definition: "The ratio of the speed of light in a vacuum to its speed in a given optical medium." }
      ],
      diagramSvg: svgLightPropagation
    },
    sampleWorkedProblems: [
      {
        id: "b9_light_sp1",
        questionPrompt: "Explain why a straight wooden ruler placed partially in a glass beaker of clear water appears bent at the water surface.",
        stepByStepSolution: `1. Light travels from water (optically denser) into air (optically less dense).
2. As light rays cross the boundary, their speed increases, causing them to bend away from the normal.
3. The human eye projects these refracted rays straight back, causing the submerged part of the ruler to appear displaced upwards.`,
        examinerTip: "Specify that the ray travels from water to air into the observer's eye, bending away from the normal."
      }
    ],
    drillQuestions: [
      {
        id: "b9_light_q1",
        difficulty: "low",
        type: "objective",
        prompt: `Which optical principle is demonstrated by the apparatus shown below?<br/>${svgLightPropagation}`,
        options: [
          "Light travels in straight lines (Rectilinear propagation)",
          "Dispersion of white light into spectral colors",
          "Total internal reflection of light rays",
          "Polarization of electromagnetic waves"
        ],
        correctAnswer: "Light travels in straight lines (Rectilinear propagation)",
        hint: "Notice that the candle flame is visible only when all pinholes are aligned in a direct line.",
        workedSolution: "Light from the candle reaches the eye only when the three card pinholes are aligned, proving rectilinear propagation.",
        points: 1
      },
      {
        id: "b9_light_q2",
        difficulty: "medium",
        type: "objective",
        prompt: "A ray of light strikes a smooth plane mirror at an angle of 35° to the mirror surface. What is the angle of reflection?",
        options: ["55°", "35°", "70°", "90°"],
        correctAnswer: "55°",
        hint: "Angle of incidence is measured relative to the normal (perpendicular): $90^\\circ - 35^\\circ$.",
        workedSolution: "The normal is at 90° to the surface. Angle of incidence $i = 90^\\circ - 35^\\circ = 55^\\circ$. By the law of reflection, $r = i = 55^\\circ$.",
        points: 1
      },
      {
        id: "b9_light_q3",
        difficulty: "high",
        type: "structured",
        prompt: "Differentiate between an umbra and a penumbra in shadow formation, and describe the conditions under which both regions are produced.",
        correctAnswer: "An umbra is the completely dark region receiving no light from the source, whereas a penumbra is the partially illuminated perimeter region receiving light from only some parts of the source. Both are formed when an opaque object blocks light from an extended or broad light source.",
        hint: "Compare point light sources with extended light sources.",
        workedSolution: "An umbra is the central zone of total darkness where light is completely occluded. A penumbra is a blurred surrounding boundary where light is partially occluded. Both occur simultaneously only with extended (non-point) light sources.",
        points: 4
      }
    ]
  }
];

async function seedNaccaScienceCurriculum() {
  console.log("Seeding NaCCA Common Core Science Topical Units into Firestore...");
  const db = await getFirestore();

  for (const unit of scienceTopicalUnits) {
    const docRef = db.doc(`global_curriculum/jhs/subjects/science/topical_units/${unit.id}`);
    await docRef.set({
      ...unit,
      metadata: {
        curriculum: "NaCCA Common Core Programme (CCP)",
        jurisdiction: "Ghana Ministry of Education",
        licensee: "GAM IT Solutions (GAM EDU)",
        updatedAt: adminInstance.firestore.FieldValue.serverTimestamp()
      }
    }, { merge: true });
    console.log(`✓ Seeded NaCCA Unit: [${unit.gradeLevel}] ${unit.subStrandTitle} (${unit.id})`);
  }

  console.log("✅ NaCCA Science Curriculum hierarchy and Topical Labs seeded successfully.");
}

seedNaccaScienceCurriculum()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed NaCCA Science Curriculum:", err);
    process.exit(1);
  });

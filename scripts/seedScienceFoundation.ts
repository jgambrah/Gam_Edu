import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const adminInstance: any = (admin as any).default || admin;

// Robust Firestore connection initializer supporting standard Admin SDK and CLI OAuth fallback
async function getFirestore(): Promise<any> {
  const serviceAccountEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountEnv && fs.existsSync(serviceAccountEnv)) {
    try {
      if (!adminInstance.apps?.length) {
        adminInstance.initializeApp({
          credential: adminInstance.credential.cert(serviceAccountEnv),
          projectId: 'gamedu-69888475-f5783',
        });
      }
      return adminInstance.firestore();
    } catch (e) {
      console.warn('Admin init with GOOGLE_APPLICATION_CREDENTIALS failed, falling back:', e);
    }
  }

  // Fallback to local authenticated CLI OAuth session
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
    console.warn('CLI OAuth fallback error:', cliErr);
  }

  if (!adminInstance.apps?.length) {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
  }
  return adminInstance.firestore();
}

export interface ScienceTopicalUnit {
  id: string; // e.g. "bs7_diversity_matter_cells"
  gradeLevel: "BS7" | "BS8" | "BS9";
  strandNumber: 1 | 2 | 3 | 4 | 5;
  strandTitle: string; // e.g. "Diversity of Matter"
  subStrandTitle: string; // e.g. "Living Cells"
  order: number;
  notes: {
    summaryMarkdown: string;
    keyTerms: Array<{ term: string; definition: string }>;
    diagramSvg?: string; // Inline responsive vector SVG
  };
  sampleWorkedProblems: Array<{
    id: string;
    questionPrompt: string;
    stepByStepSolution: string;
    examinerTip: string;
  }>;
  drillQuestions: Array<{
    id: string;
    difficulty: "low" | "medium" | "high";
    type: "objective" | "structured";
    prompt: string;
    diagramSvg?: string;
    options?: string[]; // for objective items
    correctAnswer: string;
    hint: string;
    workedSolution: string;
    points: number;
  }>;
}

// SVG 1: Plant Cell Diagram (Diversity of Matter)
const svgPlantCell = `
<svg viewBox='0 0 340 220' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Outer Cell Wall -->
  <polygon points='50,30 290,30 310,180 70,190' fill='#dcfce7' stroke='#166534' stroke-width='3.5'/>
  <!-- Inner Cell Membrane -->
  <polygon points='56,36 284,36 304,174 76,184' fill='#f0fdf4' stroke='#15803d' stroke-width='1.5'/>
  <!-- Large Central Vacuole -->
  <path d='M 120,60 Q 220,50 250,110 Q 230,160 140,150 Q 100,120 120,60 Z' fill='#e0f2fe' stroke='#0284c7' stroke-width='1.5'/>
  <text x='170' y='110' font-size='11' font-weight='bold' fill='#0369a1' text-anchor='middle'>Vacuole</text>
  <!-- Nucleus -->
  <circle cx='95' cy='90' r='22' fill='#fef08a' stroke='#ca8a04' stroke-width='2'/>
  <circle cx='95' cy='90' r='8' fill='#ca8a04'/>
  <text x='95' y='125' font-size='10' font-weight='bold' fill='#854d0e' text-anchor='middle'>Nucleus</text>
  <!-- Chloroplasts -->
  <ellipse cx='260' cy='60' rx='14' ry='8' fill='#22c55e' stroke='#15803d'/>
  <ellipse cx='100' cy='160' rx='14' ry='8' fill='#22c55e' stroke='#15803d'/>
  <ellipse cx='220' cy='165' rx='14' ry='8' fill='#22c55e' stroke='#15803d'/>
  <!-- Labels -->
  <text x='170' y='210' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>TYPICAL PLANT CELL (NOT DRAWN TO SCALE)</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// SVG 2: First Class Lever (Forces & Energy - Simple Machines)
const svgLeverApparatus = `
<svg viewBox='0 0 340 160' width='100%' height='140' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Ground Level -->
  <line x1='30' y1='125' x2='310' y2='125' stroke='#64748b' stroke-width='2'/>
  <!-- Fulcrum (Pivot) -->
  <polygon points='160,85 145,125 175,125' fill='#3b82f6' stroke='#1d4ed8' stroke-width='2'/>
  <circle cx='160' cy='85' r='3.5' fill='#ffffff'/>
  <text x='160' y='142' font-size='10' font-weight='bold' fill='#1d4ed8' text-anchor='middle'>Fulcrum (Pivot)</text>
  <!-- Lever Beam -->
  <line x1='50' y1='85' x2='290' y2='85' stroke='#1e293b' stroke-width='4'/>
  <!-- Load on Left -->
  <rect x='60' y='55' width='30' height='30' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/>
  <text x='75' y='45' font-size='10' font-weight='bold' fill='#b91c1c' text-anchor='middle'>Load (L)</text>
  <line x1='75' y1='85' x2='75' y2='100' stroke='#b91c1c' stroke-width='1.5' stroke-dasharray='2,2'/>
  <!-- Effort on Right -->
  <line x1='270' y1='50' x2='270' y2='82' stroke='#16a34a' stroke-width='2.5'/>
  <polygon points='266,78 270,85 274,78' fill='#16a34a'/>
  <text x='270' y='42' font-size='10' font-weight='bold' fill='#16a34a' text-anchor='middle'>Effort (E)</text>
  <!-- Distance Markers -->
  <text x='115' y='75' font-size='9' fill='#475569' text-anchor='middle'>Load arm (0.5 m)</text>
  <text x='215' y='75' font-size='9' fill='#475569' text-anchor='middle'>Effort arm (1.0 m)</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// SVG 3: Nitrogen Cycle / Ecosystem Diagram (Cycles & Systems - BS 9)
const svgNitrogenCycle = `
<svg viewBox='0 0 360 200' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Atmosphere Box -->
  <rect x='40' y='18' width='280' height='35' rx='6' fill='#e0f2fe' stroke='#0284c7' stroke-width='1.5'/>
  <text x='180' y='40' font-size='11' font-weight='bold' fill='#0369a1' text-anchor='middle'>Atmospheric Nitrogen (N₂ - 78%)</text>
  <!-- Soil Level -->
  <line x1='20' y1='100' x2='340' y2='100' stroke='#15803d' stroke-width='2'/>
  <text x='50' y='93' font-size='10' font-weight='bold' fill='#15803d'>Soil Surface</text>
  <!-- Nitrogen-Fixing Bacteria -->
  <rect x='30' y='120' width='95' height='40' rx='5' fill='#dcfce7' stroke='#16a34a' stroke-width='1.5'/>
  <text x='77' y='137' font-size='9' font-weight='bold' fill='#166534' text-anchor='middle'>N₂-Fixing Bacteria</text>
  <text x='77' y='150' font-size='8' fill='#166534' text-anchor='middle'>(Rhizobium in roots)</text>
  <!-- Nitrification (Nitrites to Nitrates) -->
  <rect x='140' y='120' width='95' height='40' rx='5' fill='#fef9c3' stroke='#ca8a04' stroke-width='1.5'/>
  <text x='187' y='137' font-size='9' font-weight='bold' fill='#854d0e' text-anchor='middle'>Nitrification</text>
  <text x='187' y='150' font-size='8' fill='#854d0e' text-anchor='middle'>NH₄⁺ → NO₂⁻ → NO₃⁻</text>
  <!-- Plant Assimilation -->
  <rect x='250' y='120' width='90' height='40' rx='5' fill='#fee2e2' stroke='#dc2626' stroke-width='1.5'/>
  <text x='295' y='137' font-size='9' font-weight='bold' fill='#991b1b' text-anchor='middle'>Plant Absorption</text>
  <text x='295' y='150' font-size='8' fill='#991b1b' text-anchor='middle'>Proteins synthesized</text>
  <!-- Connecting Arrows -->
  <path d='M 80,53 L 80,115' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='3,3'/>
  <path d='M 125,140 L 138,140' stroke='#ca8a04' stroke-width='1.5'/>
  <path d='M 235,140 L 248,140' stroke='#15803d' stroke-width='1.5'/>
</svg>
`.trim().replace(/\n\s*/g, '');

const sampleScienceUnits: ScienceTopicalUnit[] = [
  {
    id: "bs7_strand1_living_cells",
    gradeLevel: "BS7",
    strandNumber: 1,
    strandTitle: "Diversity of Matter",
    subStrandTitle: "Living Cells & Cell Structure",
    order: 1,
    notes: {
      summaryMarkdown: `### Living Cells: Fundamental Units of Life
All living organisms are composed of cells. Cells carry out fundamental metabolic, genetic, and structural functions.

* **Animal vs. Plant Cells:**
  - **Plant Cells:** Possess a rigid cellulose cell wall, large central vacuole, and chloroplasts containing chlorophyll.
  - **Animal Cells:** Enclosed only by a flexible cell surface membrane; lack a cell wall and chloroplasts; possess small, temporary vacuoles.
* **Organelle Functions:**
  - **Nucleus:** Stores genetic material (DNA) and coordinates cellular activities.
  - **Mitochondria:** Sites of aerobic respiration where energy (ATP) is released.
  - **Cell Wall:** Provides structural rigidity and turgor support.`,
      keyTerms: [
        { term: "Protoplasm", definition: "The living contents of a cell surrounded by a plasma membrane." },
        { term: "Chloroplast", definition: "A plastid containing chlorophyll in which photosynthesis takes place." },
        { term: "Turgidity", definition: "The state of being swollen and firm due to internal fluid hydrostatic pressure." }
      ],
      diagramSvg: svgPlantCell
    },
    sampleWorkedProblems: [
      {
        id: "sp1",
        questionPrompt: "State two distinct structural differences between a typical plant cell and an animal cell.",
        stepByStepSolution: `1. Identify the cellular boundaries: Plant cells possess a cellulose cell wall outside the cell membrane, whereas animal cells possess only a cell membrane.
2. Examine the plastids and organelles: Plant cells possess chloroplasts for photosynthesis and a large single central vacuole, while animal cells lack chloroplasts and have small, scattered, temporary vacuoles.`,
        examinerTip: "Avoid vague statements like 'Plant cells are green.' State the organelle responsible (chloroplasts)."
      }
    ],
    drillQuestions: [
      {
        id: "bs7_c1_q1",
        difficulty: "low",
        type: "objective",
        prompt: "Which of the following cellular structures is present in plant cells but absent in animal cells?",
        options: ["Cell wall", "Mitochondrion", "Cell membrane", "Cytoplasm"],
        correctAnswer: "Cell wall",
        hint: "Look for the rigid outer protective layer made of cellulose.",
        workedSolution: "A rigid cellulose cell wall is characteristic of plant cells and is absent in animal cells.",
        points: 1
      },
      {
        id: "bs7_c1_q2",
        difficulty: "medium",
        type: "objective",
        prompt: "What is the primary function of the mitochondrion in an active living cell?",
        options: [
          "Releasing energy through aerobic respiration",
          "Synthesis of carbohydrates via photosynthesis",
          "Controlling the entry and exit of minerals",
          "Storage of waste products and cell sap"
        ],
        correctAnswer: "Releasing energy through aerobic respiration",
        hint: "Often referred to as the powerhouse of the cell.",
        workedSolution: "Mitochondria produce ATP by oxidizing glucose during cellular respiration.",
        points: 1
      },
      {
        id: "bs7_c1_q3",
        difficulty: "high",
        type: "structured",
        prompt: "Explain what happens to a plant cell when it is placed into pure distilled water for two hours.",
        correctAnswer: "Water enters the cell by osmosis, causing the central vacuole to expand and exert pressure on the cell wall until the cell becomes fully turgid without bursting.",
        hint: "Consider water potential and the protective role of the cell wall.",
        workedSolution: "Because pure water has a higher water potential than the cell sap, water moves into the cell via osmosis. The cell swells and becomes turgid. The rigid cellulose cell wall prevents the cell from lysing (bursting).",
        points: 3
      }
    ]
  },
  {
    id: "bs8_strand4_simple_machines",
    gradeLevel: "BS8",
    strandNumber: 4,
    strandTitle: "Forces and Energy",
    subStrandTitle: "Simple Machines & Levers",
    order: 2,
    notes: {
      summaryMarkdown: `### Levers and Mechanical Advantage
A simple machine is a mechanical device that changes the direction or magnitude of a force, making work easier.

* **Key Formulas:**
  - $$\\text{Mechanical Advantage (M.A.)} = \\frac{\\text{Load (L)}}{\\text{Effort (E)}}$$
  - $$\\text{Velocity Ratio (V.R.)} = \\frac{\\text{Distance moved by Effort}}{\\text{Distance moved by Load}} = \\frac{\\text{Effort Arm}}{\\text{Load Arm}}$$
  - $$\\text{Efficiency (}\\eta\\text{)} = \\frac{\\text{M.A.}}{\\text{V.R.}} \\times 100\\%$$
* **First Class Lever:** Fulcrum is positioned between Load and Effort (e.g., crowbar, pair of scissors, see-saw).`,
      keyTerms: [
        { term: "Mechanical Advantage", definition: "The factor by which a mechanism multiplies the force applied to it." },
        { term: "Fulcrum", definition: "The fixed pivot point around which a lever turns." }
      ],
      diagramSvg: svgLeverApparatus
    },
    sampleWorkedProblems: [
      {
        id: "sp2",
        questionPrompt: "A first class lever has an effort arm of 1.2 m and a load arm of 0.3 m. Calculate its velocity ratio (V.R.).",
        stepByStepSolution: `1. State the formula: $$\\text{V.R.} = \\frac{\\text{Effort Arm}}{\\text{Load Arm}}$$
2. Substitute the values: $$\\text{V.R.} = \\frac{1.2\\text{ m}}{0.3\\text{ m}} = 4$$.
3. Since V.R. is a ratio of two distances, it has no units.`,
        examinerTip: "Always confirm that units are matching (metres to metres or cm to cm) before dividing."
      }
    ],
    drillQuestions: [
      {
        id: "bs8_sm_q1",
        difficulty: "low",
        type: "objective",
        prompt: "In a first class lever, which component is situated between the other two?",
        options: ["Pivot (Fulcrum)", "Effort", "Load", "Load arm"],
        correctAnswer: "Pivot (Fulcrum)",
        hint: "Remember the sequence: Load - Fulcrum - Effort.",
        workedSolution: "In first class levers, the pivot (fulcrum) is located between the effort and the load.",
        points: 1
      },
      {
        id: "bs8_sm_q2",
        difficulty: "medium",
        type: "objective",
        prompt: "A load of 300 N is lifted using an effort of 75 N with a simple machine. Calculate the mechanical advantage (M.A.).",
        options: ["4.0", "0.25", "225", "375"],
        correctAnswer: "4.0",
        hint: "Divide Load by Effort.",
        workedSolution: "$$\\text{M.A.} = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{300\\text{ N}}{75\\text{ N}} = 4.0$$.",
        points: 1
      },
      {
        id: "bs8_sm_q3",
        difficulty: "high",
        type: "structured",
        prompt: "A machine with a velocity ratio of 5 has an efficiency of 80%. Calculate the effort required to lift a load of 400 N.",
        correctAnswer: "100 N",
        hint: "First find M.A. from efficiency, then calculate Effort = Load / M.A.",
        workedSolution: "$$\\text{Efficiency} = \\frac{\\text{M.A.}}{\\text{V.R.}} \\times 100\\% \\implies 80 = \\frac{\\text{M.A.}}{5} \\times 100 \\implies \\text{M.A.} = 4$$\n$$\\text{M.A.} = \\frac{\\text{Load}}{\\text{Effort}} \\implies 4 = \\frac{400}{\\text{Effort}} \\implies \\text{Effort} = 100\\text{ N}$$.",
        points: 4
      }
    ]
  },
  {
    id: "bs9_strand2_cycles_crop_production",
    gradeLevel: "BS9",
    strandNumber: 2,
    strandTitle: "Cycles",
    subStrandTitle: "Nutrient Cycles & Crop Production",
    order: 3,
    notes: {
      summaryMarkdown: `### Biogeochemical Cycles and Crop Growth
Nutrient cycles ensure the circulation of essential chemical elements between the biotic and abiotic parts of the environment.

* **The Nitrogen Cycle:**
  - **Atmospheric Fixation:** Electrical discharges (lightning) convert $N_2$ and $O_2$ into oxides of nitrogen.
  - **Biological Nitrogen Fixation:** Nitrogen-fixing bacteria (such as *Rhizobium* in root nodules of leguminous plants) convert gaseous nitrogen into ammonium and nitrates.
  - **Nitrification:** Chemoautotrophic bacteria (*Nitrosomonas* and *Nitrobacter*) convert ammonia to nitrites ($NO_2^-$) and nitrates ($NO_3^-$).
  - **Denitrification:** Anaerobic bacteria (*Pseudomonas*) return nitrogen from nitrates back into the atmosphere.`,
      keyTerms: [
        { term: "Rhizobium", definition: "Symbiotic bacteria residing in root nodules of legumes that convert atmospheric nitrogen into nitrates." },
        { term: "Nitrification", definition: "Biological oxidation of ammonia into nitrites followed by conversion to nitrates." },
        { term: "Crop Rotation", definition: "The system of growing a series of different crops in the same area across sequential seasons to maintain soil fertility." }
      ],
      diagramSvg: svgNitrogenCycle
    },
    sampleWorkedProblems: [
      {
        id: "sp3",
        questionPrompt: "Explain the role of leguminous crops in maintaining soil fertility in a 4-year crop rotation system.",
        stepByStepSolution: `1. Identify the anatomical feature: Leguminous crops possess root nodules harboring symbiotic *Rhizobium* bacteria.
2. Explain the mechanism: These bacteria fix atmospheric nitrogen ($N_2$) into soluble nitrates that enrich the soil.
3. Conclude the agricultural benefit: Subsequent leafy crops that require high nitrogen can absorb these residues, reducing chemical fertilizer dependency.`,
        examinerTip: "Always mention the specific bacterium (*Rhizobium*) and the location (root nodules) for full marks."
      }
    ],
    drillQuestions: [
      {
        id: "bs9_cy_q1",
        difficulty: "low",
        type: "objective",
        prompt: "Which organism is primarily responsible for fixing atmospheric nitrogen in the root nodules of leguminous plants?",
        options: ["Rhizobium bacteria", "Yeast fungi", "Amoeba", "Spirogyra"],
        correctAnswer: "Rhizobium bacteria",
        hint: "A symbiotic bacterium found in beans, peas, and groundnuts.",
        workedSolution: "Rhizobium is the symbiotic bacterium that converts inert atmospheric nitrogen into plant-absorbable ammonium/nitrates.",
        points: 1
      },
      {
        id: "bs9_cy_q2",
        difficulty: "medium",
        type: "objective",
        prompt: "Which process describes the return of nitrogen from nitrates in waterlogged soil back into atmospheric nitrogen gas?",
        options: ["Denitrification", "Nitrification", "Ammonification", "Assimilation"],
        correctAnswer: "Denitrification",
        hint: "Carried out by anaerobic bacteria like Pseudomonas.",
        workedSolution: "Denitrifying bacteria reduce soil nitrates back to nitrogen gas under anaerobic conditions.",
        points: 1
      },
      {
        id: "bs9_cy_q3",
        difficulty: "high",
        type: "structured",
        prompt: "A farmer observes stunting and yellowing of older leaves in a maize plot. (i) Identify the nutrient deficiency. (ii) Suggest one organic remedy.",
        correctAnswer: "(i) Nitrogen deficiency (chlorosis). (ii) Apply compost, farmyard manure, or rotate with leguminous crops.",
        hint: "Nitrogen is essential for chlorophyll synthesis; deficiency causes chlorosis.",
        workedSolution: "(i) Nitrogen deficiency causes general yellowing (chlorosis) beginning in older leaves. (ii) Application of well-decomposed animal manure or incorporating nitrogen-fixing green manure crops restores soil nitrogen balance.",
        points: 3
      }
    ]
  }
];

// Subject manifest for JHS Science
const scienceManifest = {
  subject: "Integrated Science",
  tier: "Junior Secondary (JHS)",
  totalStrands: 5,
  strands: [
    { number: 1, title: "Diversity of Matter", subStrands: ["Materials", "Living Cells", "Elements & Compounds"] },
    { number: 2, title: "Cycles", subStrands: ["Earth Science", "Life Cycles", "Crop Production", "Animal Nutrition"] },
    { number: 3, title: "Systems", subStrands: ["Human Body Systems", "Ecosystems", "Farming Systems", "Solar System"] },
    { number: 4, title: "Forces and Energy", subStrands: ["Energy Forms", "Simple Machines", "Electricity & Magnetism"] },
    { number: 5, title: "Humans and the Environment", subStrands: ["Waste Management", "Diseases", "Climate Change"] }
  ],
  topics: [
    {
      id: "bs7_strand1_living_cells",
      title: "Living Cells & Cell Structure",
      strandCode: "S1",
      strandName: "STRAND 1: DIVERSITY OF MATTER",
      subStrand: "Living Cells",
      levelsAvailable: ["B7"],
      status: "ready",
      hasNotes: true,
      questionCount: 3,
      description: "Fundamental units of life, plant vs. animal cell organelle structures, and cellular transport."
    },
    {
      id: "bs8_strand4_simple_machines",
      title: "Simple Machines & Levers",
      strandCode: "S4",
      strandName: "STRAND 4: FORCES AND ENERGY",
      subStrand: "Simple Machines",
      levelsAvailable: ["B8"],
      status: "ready",
      hasNotes: true,
      questionCount: 3,
      description: "Mechanical advantage, velocity ratio, efficiency, and classes of levers."
    },
    {
      id: "bs9_strand2_cycles_crop_production",
      title: "Nutrient Cycles & Crop Production",
      strandCode: "S2",
      strandName: "STRAND 2: CYCLES",
      subStrand: "Crop Production & Life Cycles",
      levelsAvailable: ["B9"],
      status: "ready",
      hasNotes: true,
      questionCount: 3,
      description: "Biogeochemical nitrogen cycle, Rhizobium symbiosis, and crop rotation soil fertility."
    }
  ],
  metadata: {
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
    isomorphic: true,
    updatedAt: new Date().toISOString()
  }
};

async function seedScienceFoundation() {
  console.log("Seeding Integrated Science Foundation into global_curriculum/jhs/subjects/science/...");
  const db = await getFirestore();

  // 1. Seed Subject Document & Manifest
  const subjectDocRef = db.doc("global_curriculum/jhs/subjects/science");
  await subjectDocRef.set(scienceManifest, { merge: true });
  console.log("✓ Seeded Subject Manifest at global_curriculum/jhs/subjects/science");

  const manifestRef = db.doc("global_curriculum/jhs/subjects/science/manifests/topical_labs");
  await manifestRef.set(scienceManifest, { merge: true });
  console.log("✓ Seeded Topical Labs Manifest at global_curriculum/jhs/subjects/science/manifests/topical_labs");

  // 2. Seed Topical Units
  for (const unit of sampleScienceUnits) {
    const unitRef = db.doc(`global_curriculum/jhs/subjects/science/topical_units/${unit.id}`);
    await unitRef.set({
      ...unit,
      metadata: {
        copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✓ Seeded Topical Unit: ${unit.id}`);
  }

  // 3. Initialize Past Papers Index Collection Scaffold
  const pastPapersIndexRef = db.doc("global_curriculum/jhs/subjects/science/past_papers/index");
  await pastPapersIndexRef.set({
    level: "jhs",
    subject: "science",
    subjectName: "Integrated Science",
    availableYears: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    variants: true,
    updatedAt: new Date().toISOString(),
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }, { merge: true });
  console.log("✓ Initialized Past Papers Scaffold at global_curriculum/jhs/subjects/science/past_papers/index");

  console.log("✅ Integrated Science Topical Practice Labs & Curriculum Foundation created successfully.");
}

seedScienceFoundation()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Science seeding failed:", err);
    process.exit(1);
  });

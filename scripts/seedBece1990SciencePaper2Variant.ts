import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
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
    console.log('Falling back to default initialization...', e);
  }

  adminInstance.initializeApp({
    credential: adminInstance.credential.applicationDefault(),
    projectId
  });
  return adminInstance.firestore();
}

/**
 * 1990 BECE Integrated Science Paper 2 (Set 99 Theory & Practical Essay Test)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_1990_variant
 * Set Number: Set 99
 * Format: Structured essay & theory/practical with sanitized responsive vector SVGs
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export const svgQ1cFlowerStructure = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 240' width='100%' height='220' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Flower Stem Pedicel & Swollen Receptacle --><path d='M 190 225 L 190 185' stroke='#15803d' stroke-width='6'/><path d='M 160 185 Q 190 195 220 185 L 205 165 L 175 165 Z' fill='#16a34a' stroke='#15803d' stroke-width='1.5'/><text x='190' y='210' font-size='9' font-weight='bold' fill='#4ade80' text-anchor='middle'>Receptacle</text><!-- Sepals (Calyx) --><path d='M 165 175 Q 130 170 120 150 Q 145 160 170 168' fill='#22c55e' stroke='#15803d' stroke-width='1.2'/><path d='M 215 175 Q 250 170 260 150 Q 235 160 210 168' fill='#22c55e' stroke='#15803d' stroke-width='1.2'/><text x='105' y='160' font-size='10' font-weight='bold' fill='#22c55e'>Sepal (Calyx)</text><!-- Petals (Corolla) --><path d='M 165 165 C 100 130 90 60 140 45 C 160 85 170 125 175 165 Z' fill='#f43f5e' opacity='0.7' stroke='#e11d48' stroke-width='1.8'/><path d='M 215 165 C 280 130 290 60 240 45 C 220 85 210 125 205 165 Z' fill='#f43f5e' opacity='0.7' stroke='#e11d48' stroke-width='1.8'/><text x='65' y='55' font-size='10' font-weight='bold' fill='#fb7185'>Petal (Corolla)</text><!-- Male Stamen: Left & Right (Filament + Anther) --><g transform='translate(0, 0)'><!-- Left Stamen --><path d='M 175 165 Q 145 110 155 65' fill='none' stroke='#fde047' stroke-width='2'/><ellipse cx='155' cy='60' rx='6' ry='4' fill='#f59e0b' stroke='#d97706' stroke-width='1.2'/><!-- Right Stamen --><path d='M 205 165 Q 235 110 225 65' fill='none' stroke='#fde047' stroke-width='2'/><ellipse cx='225' cy='60' rx='6' ry='4' fill='#f59e0b' stroke='#d97706' stroke-width='1.2'/><line x1='232' y1='60' x2='290' y2='60' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='295' y='64' font-size='10' font-weight='bold' fill='#fde047'>Anther (Pollen)</text><line x1='222' y1='105' x2='290' y2='105' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='295' y='109' font-size='10' font-weight='bold' fill='#fde047'>Filament</text></g><!-- Female Pistil / Carpel (Ovary, Style, Stigma) --><g transform='translate(190, 0)'><!-- Swollen Ovary at base --><ellipse cx='0' cy='145' rx='18' ry='20' fill='#bbf7d0' stroke='#16a34a' stroke-width='2'/><!-- Internal Ovules --><circle cx='-5' cy='145' r='3.5' fill='#15803d'/><circle cx='5' cy='145' r='3.5' fill='#15803d'/><circle cx='0' cy='136' r='3.5' fill='#15803d'/><circle cx='0' cy='154' r='3.5' fill='#15803d'/><!-- Slender Style --><line x1='0' y1='125' x2='0' y2='55' stroke='#86efac' stroke-width='4'/><!-- Terminal Sticky Stigma --><ellipse cx='0' cy='52' rx='10' ry='5' fill='#4ade80' stroke='#16a34a' stroke-width='1.5'/><!-- Pointer Lines --><line x1='12' y1='52' x2='75' y2='35' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='38' font-size='10' font-weight='bold' fill='#4ade80'>Stigma</text><line x1='3' y1='85' x2='75' y2='85' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='89' font-size='10' font-weight='bold' fill='#4ade80'>Style</text><line x1='20' y1='145' x2='75' y2='145' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='149' font-size='10' font-weight='bold' fill='#4ade80'>Ovary (with Ovules)</text></g><text x='190' y='232' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LONGITUDINAL SECTION OF A COMPLETE FLOWER</text></svg></div>";

export const svgQ3bSeparationTrain = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 180' width='100%' height='165' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Stage 1: Filtration (Left) --><g transform='translate(30, 20)'><!-- Retort Stand & Ring --><line x1='10' y1='135' x2='50' y2='135' stroke='#cbd5e1' stroke-width='3'/><line x1='20' y1='135' x2='20' y2='15' stroke='#cbd5e1' stroke-width='2.5'/><line x1='20' y1='55' x2='55' y2='55' stroke='#cbd5e1' stroke-width='1.5'/><!-- Funnel & Filter Paper with Sand Residue --><polygon points='40,40 90,40 70,75 62,75' fill='#334155' stroke='#38bdf8' stroke-width='1.2'/><polygon points='44,42 86,42 68,73 64,73' fill='#78350f' stroke='#f59e0b' stroke-width='1.2'/><line x1='66' y1='75' x2='66' y2='95' stroke='#38bdf8' stroke-width='2.5'/><text x='65' y='32' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Insoluble Sand Residue</text><!-- Beaker Collecting Clear Salt Filtrate --><rect x='48' y='95' width='36' height='42' rx='2' fill='#0284c7' opacity='0.15' stroke='#64748b' stroke-width='1.2'/><rect x='49' y='115' width='34' height='21' fill='#38bdf8' opacity='0.4'/><circle cx='66' cy='105' r='1.5' fill='#38bdf8'/><text x='65' y='152' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>1. Filtration</text></g><!-- Transition Process Arrow --><g transform='translate(165, 80)'><line x1='0' y1='0' x2='35' y2='0' stroke='#10b981' stroke-width='2.5'/><polygon points='32,-4 40,0 32,4' fill='#10b981'/><text x='18' y='-8' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>Filtrate</text></g><!-- Stage 2: Evaporation to Recover Salt (Right) --><g transform='translate(235, 20)'><!-- Tripod & Wire Gauze --><line x1='25' y1='95' x2='95' y2='95' stroke='#cbd5e1' stroke-width='2'/><line x1='35' y1='95' x2='20' y2='135' stroke='#94a3b8' stroke-width='2'/><line x1='85' y1='95' x2='100' y2='135' stroke='#94a3b8' stroke-width='2'/><!-- Evaporating Dish with Concentrated Brine --><path d='M 35 90 Q 60 105 85 90 Z' fill='#e2e8f0' stroke='#94a3b8' stroke-width='1.5'/><path d='M 40 91 Q 60 101 80 91 Z' fill='#38bdf8' opacity='0.6'/><!-- Water Vapor Rising --><path d='M 52 82 Q 48 72 52 64' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><path d='M 60 80 Q 64 70 60 62' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><path d='M 68 82 Q 64 72 68 64' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><text x='60' y='55' font-size='8' fill='#cbd5e1' text-anchor='middle'>Steam Vapor</text><!-- Heat Flame Underneath --><path d='M 60 132 Q 54 115 60 108 Q 66 115 60 132 Z' fill='#f59e0b'/><text x='60' y='145' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Bunsen Heat</text><text x='60' y='165' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>2. Evaporation</text></g></svg></div>";

export const svgQ4cAtomStructure = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 180' width='100%' height='160' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Central Nucleus --><circle cx='140' cy='90' r='24' fill='#1e293b' stroke='#f59e0b' stroke-width='1.8'/><!-- Protons (+1) --><circle cx='133' cy='85' r='5' fill='#ef4444'/><text x='133' y='88' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>+</text><circle cx='145' cy='95' r='5' fill='#ef4444'/><text x='145' y='98' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>+</text><!-- Neutrons (0) --><circle cx='145' cy='84' r='5' fill='#94a3b8'/><text x='145' y='87' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>n</text><circle cx='133' cy='96' r='5' fill='#94a3b8'/><text x='133' y='99' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>n</text><!-- Electron Shell Orbit --><ellipse cx='140' cy='90' rx='80' ry='50' fill='none' stroke='#38bdf8' stroke-width='1.2' stroke-dasharray='4,3' transform='rotate(-20 140 90)'/><!-- Orbiting Electrons (-1) --><circle cx='68' cy='65' r='4.5' fill='#38bdf8'/><text x='68' y='68' font-size='7' font-weight='bold' fill='#0f172a' text-anchor='middle'>-</text><circle cx='212' cy='115' r='4.5' fill='#38bdf8'/><text x='212' y='118' font-size='7' font-weight='bold' fill='#0f172a' text-anchor='middle'>-</text><!-- Labels --><text x='140' y='25' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Electrons: Negative Charge (-1)</text><text x='140' y='155' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='middle'>Nucleus: Protons (+1) and Neutrons (0)</text></svg></div>";

export const SET_BECE_1990_SCIENCE_P2: any = {
  "id": "paper_1990_variant_p2",
  "title": "1990 BECE Integrated Science Paper 2 (Set 99 Theory & Practical)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Integrated Science",
  "topic": "1990 BECE Standardized Theory & Practical Essay Examination",
  "variantType": "past_paper_variant",
  "year": 1990,
  "paperType": 2,
  "setNumber": 99,
  "era": "vintage",
  "totalQuestions": 4,
  "version": 1,
  "format": "structured_essay",
  "durationMinutes": 60,
  "instructions": "Answer three questions only from this section. Illustrate your answers wherever possible with large, clear, fully labelled diagrams. All questions carry equal marks (20 marks each).",
  "questions": [
    {
      "id": "q01",
      "questionNumber": "1",
      "isPracticalSectionA": false,
      "subQuestions": [
        {
          "subId": "(a)",
          "id": "q01_a",
          "prompt": "Define each of the following chemical terms and give one valid scientific example of each:\n(i) Compound;\n(ii) Mixture;\n(iii) Element;\n(iv) Solute.",
          "workedSolution": "(i) Compound:\nA pure chemical substance composed of two or more different chemical elements chemically bonded together in a fixed, definite stoichiometric ratio by mass, which can only be broken down into its constituents by chemical reactions.\n• Example: Water ($\\text{H}_2\\text{O}$), Carbon dioxide ($\\text{CO}_2$), or Sodium chloride ($\\text{NaCl}$).\n\n(ii) Mixture:\nA physical combination of two or more distinct chemical substances in any proportion, where each individual constituent retains its unique chemical identity and properties, and can be separated by physical separation methods.\n• Example: Atmospheric air, Brine (salt solution), or Brass alloy.\n\n(iii) Element:\nA fundamental pure chemical substance composed of only one type of atom that cannot be broken down or decomposed into simpler substances by ordinary chemical means.\n• Example: Iron ($\\text{Fe}$), Copper ($\\text{Cu}$), Oxygen gas ($\\text{O}_2$), or Gold ($\\text{Au}$).\n\n(iv) Solute:\nThe solid, liquid, or gaseous chemical substance that dissolves in a continuous liquid medium (solvent) to form a homogeneous solution.\n• Example: Common table salt (sodium chloride crystals) or cane sugar dissolved in water.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(b)",
          "id": "q01_b",
          "prompt": "State the continuous sequence of energy transformations that take place during each of the following everyday events:\n(i) A ripe mango fruit detaches from a branch and drops freely to the ground;\n(ii) A carpenter vigorously strikes a metallic nail with a heavy hammer;\n(iii) A portable electric torch is switched on.",
          "workedSolution": "(i) Mango fruit dropping:\nGravitational Potential Energy $\\to$ Mechanical Kinetic Energy $\\to$ Sound and Heat Energy (upon impact with the ground).\n\n(ii) Carpenter hammering a nail:\nMechanical Kinetic Energy (of the swinging hammer) $\\to$ Mechanical Kinetic Energy (of the driven nail) $+$ Sound Energy $+$ Thermal Heat Energy (in the deformed nail head).\n\n(iii) Torch switched on:\nChemical Potential Energy (stored in the dry cell battery) $\\to$ Electrical Energy (moving electrons through the circuit) $\\to$ Radiant Light Energy $+$ Thermal Heat Energy (in the filament/diode).",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(c)",
          "id": "q01_c",
          "prompt": "The diagram below is an illustration of a longitudinal section of an angiosperm flower:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 240' width='100%' height='220' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Flower Stem Pedicel & Swollen Receptacle --><path d='M 190 225 L 190 185' stroke='#15803d' stroke-width='6'/><path d='M 160 185 Q 190 195 220 185 L 205 165 L 175 165 Z' fill='#16a34a' stroke='#15803d' stroke-width='1.5'/><text x='190' y='210' font-size='9' font-weight='bold' fill='#4ade80' text-anchor='middle'>Receptacle</text><!-- Sepals (Calyx) --><path d='M 165 175 Q 130 170 120 150 Q 145 160 170 168' fill='#22c55e' stroke='#15803d' stroke-width='1.2'/><path d='M 215 175 Q 250 170 260 150 Q 235 160 210 168' fill='#22c55e' stroke='#15803d' stroke-width='1.2'/><text x='105' y='160' font-size='10' font-weight='bold' fill='#22c55e'>Sepal (Calyx)</text><!-- Petals (Corolla) --><path d='M 165 165 C 100 130 90 60 140 45 C 160 85 170 125 175 165 Z' fill='#f43f5e' opacity='0.7' stroke='#e11d48' stroke-width='1.8'/><path d='M 215 165 C 280 130 290 60 240 45 C 220 85 210 125 205 165 Z' fill='#f43f5e' opacity='0.7' stroke='#e11d48' stroke-width='1.8'/><text x='65' y='55' font-size='10' font-weight='bold' fill='#fb7185'>Petal (Corolla)</text><!-- Male Stamen: Left & Right (Filament + Anther) --><g transform='translate(0, 0)'><!-- Left Stamen --><path d='M 175 165 Q 145 110 155 65' fill='none' stroke='#fde047' stroke-width='2'/><ellipse cx='155' cy='60' rx='6' ry='4' fill='#f59e0b' stroke='#d97706' stroke-width='1.2'/><!-- Right Stamen --><path d='M 205 165 Q 235 110 225 65' fill='none' stroke='#fde047' stroke-width='2'/><ellipse cx='225' cy='60' rx='6' ry='4' fill='#f59e0b' stroke='#d97706' stroke-width='1.2'/><line x1='232' y1='60' x2='290' y2='60' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='295' y='64' font-size='10' font-weight='bold' fill='#fde047'>Anther (Pollen)</text><line x1='222' y1='105' x2='290' y2='105' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='295' y='109' font-size='10' font-weight='bold' fill='#fde047'>Filament</text></g><!-- Female Pistil / Carpel (Ovary, Style, Stigma) --><g transform='translate(190, 0)'><!-- Swollen Ovary at base --><ellipse cx='0' cy='145' rx='18' ry='20' fill='#bbf7d0' stroke='#16a34a' stroke-width='2'/><!-- Internal Ovules --><circle cx='-5' cy='145' r='3.5' fill='#15803d'/><circle cx='5' cy='145' r='3.5' fill='#15803d'/><circle cx='0' cy='136' r='3.5' fill='#15803d'/><circle cx='0' cy='154' r='3.5' fill='#15803d'/><!-- Slender Style --><line x1='0' y1='125' x2='0' y2='55' stroke='#86efac' stroke-width='4'/><!-- Terminal Sticky Stigma --><ellipse cx='0' cy='52' rx='10' ry='5' fill='#4ade80' stroke='#16a34a' stroke-width='1.5'/><!-- Pointer Lines --><line x1='12' y1='52' x2='75' y2='35' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='38' font-size='10' font-weight='bold' fill='#4ade80'>Stigma</text><line x1='3' y1='85' x2='75' y2='85' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='89' font-size='10' font-weight='bold' fill='#4ade80'>Style</text><line x1='20' y1='145' x2='75' y2='145' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='149' font-size='10' font-weight='bold' fill='#4ade80'>Ovary (with Ovules)</text></g><text x='190' y='232' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LONGITUDINAL SECTION OF A COMPLETE FLOWER</text></svg></div>\n\n(i) Describe the morphological structure of a complete angiosperm flower as shown in the diagram.\n\n(ii) State two vital biological reasons why the flower is important to the life cycle of a flowering plant.",
          "workedSolution": "(i) Floral Structure (refer to diagram):\nA complete angiosperm flower is organized into four concentric whorls on a swollen receptacle:\n1. Calyx (outer whorl of green Sepals): Protects the inner floral parts during the immature bud stage.\n2. Corolla (whorl of brightly colored Petals): Attracts insect pollinators with vivid colors and nectar guides.\n3. Androecium (male reproductive organ / Stamen): Composed of a slender Filament supporting a bilobed Anther that synthesizes pollen grains.\n4. Gynoecium / Pistil (female reproductive organ / Carpel): Centrally positioned, consisting of a sticky Stigma to capture pollen, an elongated Style, and a basal Ovary enclosing one or more Ovules.\n\n(ii) Biological importance of the flower:\n1. It is the primary organ of sexual reproduction in flowering plants, facilitating pollination and double fertilization.\n2. The fertilized ovules mature into viable seeds, while the ovary wall develops into a fruit that encloses, protects, and aids in the dispersal of seeds to colonize new habitats.",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(d)",
          "id": "q01_d",
          "prompt": "Name the five mammalian sense organs and state the primary physiological receptor function performed by each organ.",
          "workedSolution": "1. The Eye: Organ of sight / vision (contains retinal photoreceptors that detect light intensity and color).\n2. The Ear: Organ of hearing and balance (contains phonoreceptors in the cochlea to detect sound waves, and semicircular canals to detect head equilibrium/gravity).\n3. The Nose (Nasal olfactory mucosa): Organ of smell (contains olfactory chemoreceptors that detect volatile airborne chemical vapors).\n4. The Tongue (Gustatory taste buds): Organ of taste (contains chemoreceptors that detect dissolved chemicals: sweet, sour, salty, bitter, umami).\n5. The Skin (Integument): Organ of touch (contains cutaneous mechanoreceptors, thermoreceptors, and nociceptors sensitive to touch, pressure, temperature, and pain).",
          "maxMarks": 6,
          "marks": 6
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q01_a",
          "prompt": "Define each of the following chemical terms and give one valid scientific example of each:\n(i) Compound;\n(ii) Mixture;\n(iii) Element;\n(iv) Solute.",
          "workedSolution": "(i) Compound:\nA pure chemical substance composed of two or more different chemical elements chemically bonded together in a fixed, definite stoichiometric ratio by mass, which can only be broken down into its constituents by chemical reactions.\n• Example: Water ($\\text{H}_2\\text{O}$), Carbon dioxide ($\\text{CO}_2$), or Sodium chloride ($\\text{NaCl}$).\n\n(ii) Mixture:\nA physical combination of two or more distinct chemical substances in any proportion, where each individual constituent retains its unique chemical identity and properties, and can be separated by physical separation methods.\n• Example: Atmospheric air, Brine (salt solution), or Brass alloy.\n\n(iii) Element:\nA fundamental pure chemical substance composed of only one type of atom that cannot be broken down or decomposed into simpler substances by ordinary chemical means.\n• Example: Iron ($\\text{Fe}$), Copper ($\\text{Cu}$), Oxygen gas ($\\text{O}_2$), or Gold ($\\text{Au}$).\n\n(iv) Solute:\nThe solid, liquid, or gaseous chemical substance that dissolves in a continuous liquid medium (solvent) to form a homogeneous solution.\n• Example: Common table salt (sodium chloride crystals) or cane sugar dissolved in water.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(b)",
          "id": "q01_b",
          "prompt": "State the continuous sequence of energy transformations that take place during each of the following everyday events:\n(i) A ripe mango fruit detaches from a branch and drops freely to the ground;\n(ii) A carpenter vigorously strikes a metallic nail with a heavy hammer;\n(iii) A portable electric torch is switched on.",
          "workedSolution": "(i) Mango fruit dropping:\nGravitational Potential Energy $\\to$ Mechanical Kinetic Energy $\\to$ Sound and Heat Energy (upon impact with the ground).\n\n(ii) Carpenter hammering a nail:\nMechanical Kinetic Energy (of the swinging hammer) $\\to$ Mechanical Kinetic Energy (of the driven nail) $+$ Sound Energy $+$ Thermal Heat Energy (in the deformed nail head).\n\n(iii) Torch switched on:\nChemical Potential Energy (stored in the dry cell battery) $\\to$ Electrical Energy (moving electrons through the circuit) $\\to$ Radiant Light Energy $+$ Thermal Heat Energy (in the filament/diode).",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(c)",
          "id": "q01_c",
          "prompt": "The diagram below is an illustration of a longitudinal section of an angiosperm flower:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 240' width='100%' height='220' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Flower Stem Pedicel & Swollen Receptacle --><path d='M 190 225 L 190 185' stroke='#15803d' stroke-width='6'/><path d='M 160 185 Q 190 195 220 185 L 205 165 L 175 165 Z' fill='#16a34a' stroke='#15803d' stroke-width='1.5'/><text x='190' y='210' font-size='9' font-weight='bold' fill='#4ade80' text-anchor='middle'>Receptacle</text><!-- Sepals (Calyx) --><path d='M 165 175 Q 130 170 120 150 Q 145 160 170 168' fill='#22c55e' stroke='#15803d' stroke-width='1.2'/><path d='M 215 175 Q 250 170 260 150 Q 235 160 210 168' fill='#22c55e' stroke='#15803d' stroke-width='1.2'/><text x='105' y='160' font-size='10' font-weight='bold' fill='#22c55e'>Sepal (Calyx)</text><!-- Petals (Corolla) --><path d='M 165 165 C 100 130 90 60 140 45 C 160 85 170 125 175 165 Z' fill='#f43f5e' opacity='0.7' stroke='#e11d48' stroke-width='1.8'/><path d='M 215 165 C 280 130 290 60 240 45 C 220 85 210 125 205 165 Z' fill='#f43f5e' opacity='0.7' stroke='#e11d48' stroke-width='1.8'/><text x='65' y='55' font-size='10' font-weight='bold' fill='#fb7185'>Petal (Corolla)</text><!-- Male Stamen: Left & Right (Filament + Anther) --><g transform='translate(0, 0)'><!-- Left Stamen --><path d='M 175 165 Q 145 110 155 65' fill='none' stroke='#fde047' stroke-width='2'/><ellipse cx='155' cy='60' rx='6' ry='4' fill='#f59e0b' stroke='#d97706' stroke-width='1.2'/><!-- Right Stamen --><path d='M 205 165 Q 235 110 225 65' fill='none' stroke='#fde047' stroke-width='2'/><ellipse cx='225' cy='60' rx='6' ry='4' fill='#f59e0b' stroke='#d97706' stroke-width='1.2'/><line x1='232' y1='60' x2='290' y2='60' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='295' y='64' font-size='10' font-weight='bold' fill='#fde047'>Anther (Pollen)</text><line x1='222' y1='105' x2='290' y2='105' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='295' y='109' font-size='10' font-weight='bold' fill='#fde047'>Filament</text></g><!-- Female Pistil / Carpel (Ovary, Style, Stigma) --><g transform='translate(190, 0)'><!-- Swollen Ovary at base --><ellipse cx='0' cy='145' rx='18' ry='20' fill='#bbf7d0' stroke='#16a34a' stroke-width='2'/><!-- Internal Ovules --><circle cx='-5' cy='145' r='3.5' fill='#15803d'/><circle cx='5' cy='145' r='3.5' fill='#15803d'/><circle cx='0' cy='136' r='3.5' fill='#15803d'/><circle cx='0' cy='154' r='3.5' fill='#15803d'/><!-- Slender Style --><line x1='0' y1='125' x2='0' y2='55' stroke='#86efac' stroke-width='4'/><!-- Terminal Sticky Stigma --><ellipse cx='0' cy='52' rx='10' ry='5' fill='#4ade80' stroke='#16a34a' stroke-width='1.5'/><!-- Pointer Lines --><line x1='12' y1='52' x2='75' y2='35' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='38' font-size='10' font-weight='bold' fill='#4ade80'>Stigma</text><line x1='3' y1='85' x2='75' y2='85' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='89' font-size='10' font-weight='bold' fill='#4ade80'>Style</text><line x1='20' y1='145' x2='75' y2='145' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='80' y='149' font-size='10' font-weight='bold' fill='#4ade80'>Ovary (with Ovules)</text></g><text x='190' y='232' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LONGITUDINAL SECTION OF A COMPLETE FLOWER</text></svg></div>\n\n(i) Describe the morphological structure of a complete angiosperm flower as shown in the diagram.\n\n(ii) State two vital biological reasons why the flower is important to the life cycle of a flowering plant.",
          "workedSolution": "(i) Floral Structure (refer to diagram):\nA complete angiosperm flower is organized into four concentric whorls on a swollen receptacle:\n1. Calyx (outer whorl of green Sepals): Protects the inner floral parts during the immature bud stage.\n2. Corolla (whorl of brightly colored Petals): Attracts insect pollinators with vivid colors and nectar guides.\n3. Androecium (male reproductive organ / Stamen): Composed of a slender Filament supporting a bilobed Anther that synthesizes pollen grains.\n4. Gynoecium / Pistil (female reproductive organ / Carpel): Centrally positioned, consisting of a sticky Stigma to capture pollen, an elongated Style, and a basal Ovary enclosing one or more Ovules.\n\n(ii) Biological importance of the flower:\n1. It is the primary organ of sexual reproduction in flowering plants, facilitating pollination and double fertilization.\n2. The fertilized ovules mature into viable seeds, while the ovary wall develops into a fruit that encloses, protects, and aids in the dispersal of seeds to colonize new habitats.",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(d)",
          "id": "q01_d",
          "prompt": "Name the five mammalian sense organs and state the primary physiological receptor function performed by each organ.",
          "workedSolution": "1. The Eye: Organ of sight / vision (contains retinal photoreceptors that detect light intensity and color).\n2. The Ear: Organ of hearing and balance (contains phonoreceptors in the cochlea to detect sound waves, and semicircular canals to detect head equilibrium/gravity).\n3. The Nose (Nasal olfactory mucosa): Organ of smell (contains olfactory chemoreceptors that detect volatile airborne chemical vapors).\n4. The Tongue (Gustatory taste buds): Organ of taste (contains chemoreceptors that detect dissolved chemicals: sweet, sour, salty, bitter, umami).\n5. The Skin (Integument): Organ of touch (contains cutaneous mechanoreceptors, thermoreceptors, and nociceptors sensitive to touch, pressure, temperature, and pain).",
          "maxMarks": 6,
          "marks": 6
        }
      ]
    },
    {
      "id": "q02",
      "questionNumber": "2",
      "isPracticalSectionA": false,
      "subQuestions": [
        {
          "subId": "(a)",
          "id": "q02_a",
          "prompt": "(i) What is soil erosion? Name two distinct physical types of soil erosion caused by running water.\n(ii) State three unsustainable agricultural or environmental activities of man that accelerate soil erosion.\n(iii) List three agronomic or engineering practices by which soil can be conserved on a farm.",
          "workedSolution": "(i) Soil erosion & types:\nSoil erosion is the detachment, washing away, or blowing away of the fertile topsoil layer from one geographic location to another by natural physical agents, primarily moving water or wind.\n• Types caused by water: Sheet erosion, Rill erosion, Gully erosion, or Splash (raindrop) erosion.\n\n(ii) Human activities causing erosion:\n1. Deforestation and clear-felling of trees, which removes the protective leaf canopy and vegetative root network that anchors soil particles.\n2. Indiscriminate bush burning, which incinerates soil organic matter (humus) and leaves the bare topsoil exposed to beating rain.\n3. Overgrazing by livestock (cattle, goats), which strips pasture vegetation and compacts soil with hooves, reducing infiltration and accelerating surface runoff.\n4. Ploughing up and down hill slopes (along the slope gradient) instead of across contours.\n\n(iii) Soil conservation methods:\n1. Contour ploughing: Tilling ridges across the slope to create natural barriers that slow surface runoff.\n2. Terracing: Carving stepped horizontal benches into steep hillsides to break runoff velocity.\n3. Cover cropping: Planting low-growing legumes (e.g., cowpea, mucuna) to shield the bare soil from raindrop impact.\n4. Mulching: Spreading dry crop residues across soil to reduce evaporation and impede runoff.",
          "maxMarks": 7,
          "marks": 7
        },
        {
          "subId": "(b)",
          "id": "q02_b",
          "prompt": "(i) What is a mechanical lever?\n(ii) Classify each of the following everyday tools under first-class, second-class, or third-class levers:\n• Sugar tongs\n• Bottle opener\n• Paper cutter\n• A pair of scissors\n• Fishing rod\n• Claw hammer (used for pulling nails)",
          "workedSolution": "(i) Definition of a lever:\nA simple machine consisting of a rigid bar that is pivoted and capable of turning freely about a fixed support point called the fulcrum (pivot) to overcome a load resistance by applying an effort force.\n\n(ii) Classification of levers:\n• First-Class Levers (Fulcrum situated between Effort and Load):\n  1. A pair of scissors (central pivot screw between finger handles and cutting blades).\n  2. Claw hammer pulling nails (curved head acts as pivot between hand effort on handle and nail load in claw).\n• Second-Class Levers (Load situated between Fulcrum and Effort):\n  1. Bottle opener (lip hook acts as pivot at tip, bottle cap load in middle, upward effort at handle end).\n  2. Paper cutter (hinge pivot at one end, paper cutting load in the middle, downward effort on lever arm).\n• Third-Class Levers (Effort applied between Fulcrum and Load):\n  1. Sugar tongs (joined bend acts as pivot, finger effort squeezed in middle, sugar cube load gripped at tips).\n  2. Fishing rod (hand pivot at base, lifting muscular effort in middle, fish load dangling from the tip).",
          "maxMarks": 7,
          "marks": 7
        },
        {
          "subId": "(c)",
          "id": "q02_c",
          "prompt": "In each of the following everyday activities, state whether the change that occurred is:\n(1) physical or chemical;\n(2) reversible or irreversible:\n\n(α) Boiled cassava roots and ripe plantain fingers were pounded together in a wooden mortar into smooth fufu.\n(β) A solid block of ice is placed into an open drinking glass. After 30 minutes, the ice converts entirely into liquid water.\n(γ) A clean iron nail is submerged in a beaker of water open to the air. After five days, flaky red-brown patches appear on its surface.",
          "workedSolution": "(α) Pounding cassava and plantain into fufu:\n1. Physical change (the cells are mechanically crushed, mashed, and blended without altering the molecular chemical structures of starches and sugars).\n2. Irreversible (the mashed starch matrix cannot be reconstituted into whole, unboiled cassava roots and plantains by physical means).\n\n(β) Melting block of ice into liquid water:\n1. Physical change (only a physical phase transition from solid to liquid occurred; molecular identity $\\text{H}_2\\text{O}$ remains intact).\n2. Reversible (placing the liquid water back into a freezer re-solidifies it into solid ice).\n\n(γ) Iron nail rusting in damp water:\n1. Chemical change (metallic iron reacts with dissolved oxygen and water in an electrochemical oxidation to form a new chemical compound: hydrated iron (III) oxide, $\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$).\n2. Irreversible (the flaky crumbly rust cannot be converted back into solid metallic iron by simple physical reversal).",
          "maxMarks": 6,
          "marks": 6
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q02_a",
          "prompt": "(i) What is soil erosion? Name two distinct physical types of soil erosion caused by running water.\n(ii) State three unsustainable agricultural or environmental activities of man that accelerate soil erosion.\n(iii) List three agronomic or engineering practices by which soil can be conserved on a farm.",
          "workedSolution": "(i) Soil erosion & types:\nSoil erosion is the detachment, washing away, or blowing away of the fertile topsoil layer from one geographic location to another by natural physical agents, primarily moving water or wind.\n• Types caused by water: Sheet erosion, Rill erosion, Gully erosion, or Splash (raindrop) erosion.\n\n(ii) Human activities causing erosion:\n1. Deforestation and clear-felling of trees, which removes the protective leaf canopy and vegetative root network that anchors soil particles.\n2. Indiscriminate bush burning, which incinerates soil organic matter (humus) and leaves the bare topsoil exposed to beating rain.\n3. Overgrazing by livestock (cattle, goats), which strips pasture vegetation and compacts soil with hooves, reducing infiltration and accelerating surface runoff.\n4. Ploughing up and down hill slopes (along the slope gradient) instead of across contours.\n\n(iii) Soil conservation methods:\n1. Contour ploughing: Tilling ridges across the slope to create natural barriers that slow surface runoff.\n2. Terracing: Carving stepped horizontal benches into steep hillsides to break runoff velocity.\n3. Cover cropping: Planting low-growing legumes (e.g., cowpea, mucuna) to shield the bare soil from raindrop impact.\n4. Mulching: Spreading dry crop residues across soil to reduce evaporation and impede runoff.",
          "maxMarks": 7,
          "marks": 7
        },
        {
          "subId": "(b)",
          "id": "q02_b",
          "prompt": "(i) What is a mechanical lever?\n(ii) Classify each of the following everyday tools under first-class, second-class, or third-class levers:\n• Sugar tongs\n• Bottle opener\n• Paper cutter\n• A pair of scissors\n• Fishing rod\n• Claw hammer (used for pulling nails)",
          "workedSolution": "(i) Definition of a lever:\nA simple machine consisting of a rigid bar that is pivoted and capable of turning freely about a fixed support point called the fulcrum (pivot) to overcome a load resistance by applying an effort force.\n\n(ii) Classification of levers:\n• First-Class Levers (Fulcrum situated between Effort and Load):\n  1. A pair of scissors (central pivot screw between finger handles and cutting blades).\n  2. Claw hammer pulling nails (curved head acts as pivot between hand effort on handle and nail load in claw).\n• Second-Class Levers (Load situated between Fulcrum and Effort):\n  1. Bottle opener (lip hook acts as pivot at tip, bottle cap load in middle, upward effort at handle end).\n  2. Paper cutter (hinge pivot at one end, paper cutting load in the middle, downward effort on lever arm).\n• Third-Class Levers (Effort applied between Fulcrum and Load):\n  1. Sugar tongs (joined bend acts as pivot, finger effort squeezed in middle, sugar cube load gripped at tips).\n  2. Fishing rod (hand pivot at base, lifting muscular effort in middle, fish load dangling from the tip).",
          "maxMarks": 7,
          "marks": 7
        },
        {
          "subId": "(c)",
          "id": "q02_c",
          "prompt": "In each of the following everyday activities, state whether the change that occurred is:\n(1) physical or chemical;\n(2) reversible or irreversible:\n\n(α) Boiled cassava roots and ripe plantain fingers were pounded together in a wooden mortar into smooth fufu.\n(β) A solid block of ice is placed into an open drinking glass. After 30 minutes, the ice converts entirely into liquid water.\n(γ) A clean iron nail is submerged in a beaker of water open to the air. After five days, flaky red-brown patches appear on its surface.",
          "workedSolution": "(α) Pounding cassava and plantain into fufu:\n1. Physical change (the cells are mechanically crushed, mashed, and blended without altering the molecular chemical structures of starches and sugars).\n2. Irreversible (the mashed starch matrix cannot be reconstituted into whole, unboiled cassava roots and plantains by physical means).\n\n(β) Melting block of ice into liquid water:\n1. Physical change (only a physical phase transition from solid to liquid occurred; molecular identity $\\text{H}_2\\text{O}$ remains intact).\n2. Reversible (placing the liquid water back into a freezer re-solidifies it into solid ice).\n\n(γ) Iron nail rusting in damp water:\n1. Chemical change (metallic iron reacts with dissolved oxygen and water in an electrochemical oxidation to form a new chemical compound: hydrated iron (III) oxide, $\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$).\n2. Irreversible (the flaky crumbly rust cannot be converted back into solid metallic iron by simple physical reversal).",
          "maxMarks": 6,
          "marks": 6
        }
      ]
    },
    {
      "id": "q03",
      "questionNumber": "3",
      "isPracticalSectionA": false,
      "subQuestions": [
        {
          "subId": "(a)",
          "id": "q03_a",
          "prompt": "For each of the following infectious communicable diseases, name the specific causative organism (pathogen) and state one effective public health or medical method of prevention:\n(i) Cholera;\n(ii) Bilharzia (Schistosomiasis);\n(iii) Malaria;\n(iv) Pulmonary Tuberculosis.",
          "workedSolution": "(i) Cholera:\n• Causative organism: *Vibrio cholerae* (a comma-shaped, flagellated bacterium).\n• Prevention: Drinking only boiled or chlorinated potable water, maintaining proper sanitary disposal of human fecal wastes, and washing hands thoroughly with soap before food handling.\n\n(ii) Bilharzia (Schistosomiasis):\n• Causative organism: *Schistosoma spp.* (parasitic blood flukes / flatworms, e.g., *Schistosoma haematobium*).\n• Prevention: Avoiding swimming, wading, or bathing in stagnant freshwater bodies harboring intermediate host snails (*Bulinus*), and chemically eradicating water snails.\n\n(iii) Malaria:\n• Causative organism: *Plasmodium spp.* (protozoan blood parasite, e.g., *Plasmodium falciparum*, transmitted by female *Anopheles* mosquitoes).\n• Prevention: Sleeping under insecticide-treated bed nets (ITNs), draining stagnant surface water around dwellings to eliminate mosquito breeding sites, and indoor residual spraying.\n\n(iv) Pulmonary Tuberculosis:\n• Causative organism: *Mycobacterium tuberculosis* (an acid-fast rod-shaped bacterium).\n• Prevention: Immunization of newborn infants with the BCG vaccine, avoiding crowded poorly ventilated rooms, and isolating and treating active pulmonary patients with antibiotics.",
          "maxMarks": 8,
          "marks": 8
        },
        {
          "subId": "(b)",
          "id": "q03_b",
          "prompt": "Describe step-by-step how you would separate the constituents of each of the following mixtures in a school laboratory:\n(i) A solid heterogeneous mixture of common salt (sodium chloride) and quartz sand;\n(ii) A turbid suspension of muddy water.\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 180' width='100%' height='165' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Stage 1: Filtration (Left) --><g transform='translate(30, 20)'><!-- Retort Stand & Ring --><line x1='10' y1='135' x2='50' y2='135' stroke='#cbd5e1' stroke-width='3'/><line x1='20' y1='135' x2='20' y2='15' stroke='#cbd5e1' stroke-width='2.5'/><line x1='20' y1='55' x2='55' y2='55' stroke='#cbd5e1' stroke-width='1.5'/><!-- Funnel & Filter Paper with Sand Residue --><polygon points='40,40 90,40 70,75 62,75' fill='#334155' stroke='#38bdf8' stroke-width='1.2'/><polygon points='44,42 86,42 68,73 64,73' fill='#78350f' stroke='#f59e0b' stroke-width='1.2'/><line x1='66' y1='75' x2='66' y2='95' stroke='#38bdf8' stroke-width='2.5'/><text x='65' y='32' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Insoluble Sand Residue</text><!-- Beaker Collecting Clear Salt Filtrate --><rect x='48' y='95' width='36' height='42' rx='2' fill='#0284c7' opacity='0.15' stroke='#64748b' stroke-width='1.2'/><rect x='49' y='115' width='34' height='21' fill='#38bdf8' opacity='0.4'/><circle cx='66' cy='105' r='1.5' fill='#38bdf8'/><text x='65' y='152' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>1. Filtration</text></g><!-- Transition Process Arrow --><g transform='translate(165, 80)'><line x1='0' y1='0' x2='35' y2='0' stroke='#10b981' stroke-width='2.5'/><polygon points='32,-4 40,0 32,4' fill='#10b981'/><text x='18' y='-8' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>Filtrate</text></g><!-- Stage 2: Evaporation to Recover Salt (Right) --><g transform='translate(235, 20)'><!-- Tripod & Wire Gauze --><line x1='25' y1='95' x2='95' y2='95' stroke='#cbd5e1' stroke-width='2'/><line x1='35' y1='95' x2='20' y2='135' stroke='#94a3b8' stroke-width='2'/><line x1='85' y1='95' x2='100' y2='135' stroke='#94a3b8' stroke-width='2'/><!-- Evaporating Dish with Concentrated Brine --><path d='M 35 90 Q 60 105 85 90 Z' fill='#e2e8f0' stroke='#94a3b8' stroke-width='1.5'/><path d='M 40 91 Q 60 101 80 91 Z' fill='#38bdf8' opacity='0.6'/><!-- Water Vapor Rising --><path d='M 52 82 Q 48 72 52 64' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><path d='M 60 80 Q 64 70 60 62' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><path d='M 68 82 Q 64 72 68 64' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><text x='60' y='55' font-size='8' fill='#cbd5e1' text-anchor='middle'>Steam Vapor</text><!-- Heat Flame Underneath --><path d='M 60 132 Q 54 115 60 108 Q 66 115 60 132 Z' fill='#f59e0b'/><text x='60' y='145' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Bunsen Heat</text><text x='60' y='165' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>2. Evaporation</text></g></svg></div>",
          "workedSolution": "(i) Separation of Common Salt and Sand (refer to diagram):\n1. Dissolution: Place the solid salt-sand mixture into a glass beaker, add distilled water, and stir thoroughly with a glass rod. The soluble sodium chloride salt dissolves completely to form an aqueous brine solution, while the insoluble quartz sand settles to the bottom.\n2. Filtration: Pour the heterogeneous mixture through a filter funnel lined with a folded cone of filter paper into a receiving flask. The insoluble sand particles are too large to pass through the pores and are retained on the paper as residue. Wash the residue with a fine jet of distilled water and dry it in an oven to obtain pure, dry sand.\n3. Evaporation & Crystallization: Pour the clear salt filtrate into an evaporating dish and heat it gently over a Bunsen flame on a wire gauze. Evaporate the water until the crystallization point is reached, then allow the concentrated brine to cool slowly to yield pure, dry sodium chloride crystals.\n\n(ii) Separation of Muddy Water:\n1. Coagulation & Flocculation: Add a small quantity of crushed potash alum (aluminum sulfate) to the muddy water and stir briefly. The alum neutralizes electrostatic charges on the microscopic colloidal clay particles, causing them to aggregate into dense, settleable clumps (flocs) that settle rapidly to the bottom.\n2. Filtration: Pour the settled supernatant liquid through a glass filter funnel fitted with a cone of high-density filter paper (or a clean sand bed). The porous paper retains the suspended mud particles as residue, allowing clear, clarified water to collect in the beaker as the filtrate.",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(c)",
          "id": "q03_c",
          "prompt": "Explain scientifically why the eight planets and their natural moons orbit continuously around the Sun without colliding into one another.",
          "workedSolution": "Planets and their moons orbit without colliding because:\n1. Distinct Orbital Paths: Each planet occupies a distinct, separate elliptical orbit situated at a unique average radius from the Sun, revolving in roughly the same orbital plane without intersecting.\n2. Gravitational Centripetal Balance: The immense gravitational attraction exerted by the Sun's mass acts as an inward centripetal force that exactly balances the forward tangential velocity and inertia of each planet ($F = \\frac{G M m}{r^2} = \\frac{m v^2}{r}$), keeping each planet locked into a stable, closed orbital trajectory according to Kepler's and Newton's laws of planetary motion.\n3. Orbital Speed Differences: Planets closer to the Sun experience stronger gravity and travel at higher orbital speeds, while outer planets move at slower speeds, maintaining safe spatial separation across billions of kilometers.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(d)",
          "id": "q03_d",
          "prompt": "State two practical uses of the Sun's radiant energy in everyday domestic and industrial life.",
          "workedSolution": "1. Solar Electricity Generation: Photovoltaic solar panels absorb radiant sunlight photons to generate direct-current electricity for domestic lighting, water pumping, and commercial power grids.\n2. Open-Air Solar Dehydration: Harnessing solar heat and air currents to dry harvested agricultural crops (cocoa beans, maize grains, cassava chips) and preserve smoked/salted fish without fuel costs.\n3. Solar Water Heating: Solar thermal collectors absorb solar radiation to heat water for domestic bathrooms, laundries, and hospital sterilization.",
          "maxMarks": 3,
          "marks": 3
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q03_a",
          "prompt": "For each of the following infectious communicable diseases, name the specific causative organism (pathogen) and state one effective public health or medical method of prevention:\n(i) Cholera;\n(ii) Bilharzia (Schistosomiasis);\n(iii) Malaria;\n(iv) Pulmonary Tuberculosis.",
          "workedSolution": "(i) Cholera:\n• Causative organism: *Vibrio cholerae* (a comma-shaped, flagellated bacterium).\n• Prevention: Drinking only boiled or chlorinated potable water, maintaining proper sanitary disposal of human fecal wastes, and washing hands thoroughly with soap before food handling.\n\n(ii) Bilharzia (Schistosomiasis):\n• Causative organism: *Schistosoma spp.* (parasitic blood flukes / flatworms, e.g., *Schistosoma haematobium*).\n• Prevention: Avoiding swimming, wading, or bathing in stagnant freshwater bodies harboring intermediate host snails (*Bulinus*), and chemically eradicating water snails.\n\n(iii) Malaria:\n• Causative organism: *Plasmodium spp.* (protozoan blood parasite, e.g., *Plasmodium falciparum*, transmitted by female *Anopheles* mosquitoes).\n• Prevention: Sleeping under insecticide-treated bed nets (ITNs), draining stagnant surface water around dwellings to eliminate mosquito breeding sites, and indoor residual spraying.\n\n(iv) Pulmonary Tuberculosis:\n• Causative organism: *Mycobacterium tuberculosis* (an acid-fast rod-shaped bacterium).\n• Prevention: Immunization of newborn infants with the BCG vaccine, avoiding crowded poorly ventilated rooms, and isolating and treating active pulmonary patients with antibiotics.",
          "maxMarks": 8,
          "marks": 8
        },
        {
          "subId": "(b)",
          "id": "q03_b",
          "prompt": "Describe step-by-step how you would separate the constituents of each of the following mixtures in a school laboratory:\n(i) A solid heterogeneous mixture of common salt (sodium chloride) and quartz sand;\n(ii) A turbid suspension of muddy water.\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 180' width='100%' height='165' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Stage 1: Filtration (Left) --><g transform='translate(30, 20)'><!-- Retort Stand & Ring --><line x1='10' y1='135' x2='50' y2='135' stroke='#cbd5e1' stroke-width='3'/><line x1='20' y1='135' x2='20' y2='15' stroke='#cbd5e1' stroke-width='2.5'/><line x1='20' y1='55' x2='55' y2='55' stroke='#cbd5e1' stroke-width='1.5'/><!-- Funnel & Filter Paper with Sand Residue --><polygon points='40,40 90,40 70,75 62,75' fill='#334155' stroke='#38bdf8' stroke-width='1.2'/><polygon points='44,42 86,42 68,73 64,73' fill='#78350f' stroke='#f59e0b' stroke-width='1.2'/><line x1='66' y1='75' x2='66' y2='95' stroke='#38bdf8' stroke-width='2.5'/><text x='65' y='32' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Insoluble Sand Residue</text><!-- Beaker Collecting Clear Salt Filtrate --><rect x='48' y='95' width='36' height='42' rx='2' fill='#0284c7' opacity='0.15' stroke='#64748b' stroke-width='1.2'/><rect x='49' y='115' width='34' height='21' fill='#38bdf8' opacity='0.4'/><circle cx='66' cy='105' r='1.5' fill='#38bdf8'/><text x='65' y='152' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>1. Filtration</text></g><!-- Transition Process Arrow --><g transform='translate(165, 80)'><line x1='0' y1='0' x2='35' y2='0' stroke='#10b981' stroke-width='2.5'/><polygon points='32,-4 40,0 32,4' fill='#10b981'/><text x='18' y='-8' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>Filtrate</text></g><!-- Stage 2: Evaporation to Recover Salt (Right) --><g transform='translate(235, 20)'><!-- Tripod & Wire Gauze --><line x1='25' y1='95' x2='95' y2='95' stroke='#cbd5e1' stroke-width='2'/><line x1='35' y1='95' x2='20' y2='135' stroke='#94a3b8' stroke-width='2'/><line x1='85' y1='95' x2='100' y2='135' stroke='#94a3b8' stroke-width='2'/><!-- Evaporating Dish with Concentrated Brine --><path d='M 35 90 Q 60 105 85 90 Z' fill='#e2e8f0' stroke='#94a3b8' stroke-width='1.5'/><path d='M 40 91 Q 60 101 80 91 Z' fill='#38bdf8' opacity='0.6'/><!-- Water Vapor Rising --><path d='M 52 82 Q 48 72 52 64' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><path d='M 60 80 Q 64 70 60 62' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><path d='M 68 82 Q 64 72 68 64' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><text x='60' y='55' font-size='8' fill='#cbd5e1' text-anchor='middle'>Steam Vapor</text><!-- Heat Flame Underneath --><path d='M 60 132 Q 54 115 60 108 Q 66 115 60 132 Z' fill='#f59e0b'/><text x='60' y='145' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Bunsen Heat</text><text x='60' y='165' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>2. Evaporation</text></g></svg></div>",
          "workedSolution": "(i) Separation of Common Salt and Sand (refer to diagram):\n1. Dissolution: Place the solid salt-sand mixture into a glass beaker, add distilled water, and stir thoroughly with a glass rod. The soluble sodium chloride salt dissolves completely to form an aqueous brine solution, while the insoluble quartz sand settles to the bottom.\n2. Filtration: Pour the heterogeneous mixture through a filter funnel lined with a folded cone of filter paper into a receiving flask. The insoluble sand particles are too large to pass through the pores and are retained on the paper as residue. Wash the residue with a fine jet of distilled water and dry it in an oven to obtain pure, dry sand.\n3. Evaporation & Crystallization: Pour the clear salt filtrate into an evaporating dish and heat it gently over a Bunsen flame on a wire gauze. Evaporate the water until the crystallization point is reached, then allow the concentrated brine to cool slowly to yield pure, dry sodium chloride crystals.\n\n(ii) Separation of Muddy Water:\n1. Coagulation & Flocculation: Add a small quantity of crushed potash alum (aluminum sulfate) to the muddy water and stir briefly. The alum neutralizes electrostatic charges on the microscopic colloidal clay particles, causing them to aggregate into dense, settleable clumps (flocs) that settle rapidly to the bottom.\n2. Filtration: Pour the settled supernatant liquid through a glass filter funnel fitted with a cone of high-density filter paper (or a clean sand bed). The porous paper retains the suspended mud particles as residue, allowing clear, clarified water to collect in the beaker as the filtrate.",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(c)",
          "id": "q03_c",
          "prompt": "Explain scientifically why the eight planets and their natural moons orbit continuously around the Sun without colliding into one another.",
          "workedSolution": "Planets and their moons orbit without colliding because:\n1. Distinct Orbital Paths: Each planet occupies a distinct, separate elliptical orbit situated at a unique average radius from the Sun, revolving in roughly the same orbital plane without intersecting.\n2. Gravitational Centripetal Balance: The immense gravitational attraction exerted by the Sun's mass acts as an inward centripetal force that exactly balances the forward tangential velocity and inertia of each planet ($F = \\frac{G M m}{r^2} = \\frac{m v^2}{r}$), keeping each planet locked into a stable, closed orbital trajectory according to Kepler's and Newton's laws of planetary motion.\n3. Orbital Speed Differences: Planets closer to the Sun experience stronger gravity and travel at higher orbital speeds, while outer planets move at slower speeds, maintaining safe spatial separation across billions of kilometers.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(d)",
          "id": "q03_d",
          "prompt": "State two practical uses of the Sun's radiant energy in everyday domestic and industrial life.",
          "workedSolution": "1. Solar Electricity Generation: Photovoltaic solar panels absorb radiant sunlight photons to generate direct-current electricity for domestic lighting, water pumping, and commercial power grids.\n2. Open-Air Solar Dehydration: Harnessing solar heat and air currents to dry harvested agricultural crops (cocoa beans, maize grains, cassava chips) and preserve smoked/salted fish without fuel costs.\n3. Solar Water Heating: Solar thermal collectors absorb solar radiation to heat water for domestic bathrooms, laundries, and hospital sterilization.",
          "maxMarks": 3,
          "marks": 3
        }
      ]
    },
    {
      "id": "q04",
      "questionNumber": "4",
      "isPracticalSectionA": false,
      "subQuestions": [
        {
          "subId": "(a)",
          "id": "q04_a",
          "prompt": "(i) What is environmental pollution?\n(ii) Name two distinct types of environmental pollution. For each type named, identify one major pollutant and its primary human or industrial source.",
          "workedSolution": "(i) Definition of environmental pollution:\nThe introduction of harmful chemical substances, solid particulates, or forms of energy (such as heat, noise, or radiation) into the natural environment in concentrations that cause adverse physiological damage to living organisms and degrade ecosystem quality.\n\n(ii) Types, pollutants, and sources:\n• Type 1: Air Pollution\n  - Pollutant: Carbon monoxide ($CO$) or Sulfur dioxide ($SO_2$) / Particulate soot.\n  - Source: Incomplete combustion of fossil fuels in motor vehicle exhaust engines, oil refineries, and industrial coal-fired factory furnaces.\n• Type 2: Water Pollution\n  - Pollutant: Untreated domestic sewage / Synthetic chemical pesticide and fertilizer runoff.\n  - Source: Municipal open gutter discharge, illegal alluvial gold mining (galamsey) washing silt and mercury into rivers, and agricultural runoff.\n• Type 3: Land / Soil Pollution\n  - Pollutant: Non-biodegradable polythene plastic waste / Heavy metal industrial effluents.\n  - Source: Indiscriminate municipal littering and battery recycling workshops.",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(b)",
          "id": "q04_b",
          "prompt": "(i) Explain what is meant by vegetative reproduction in plants.\n(ii) Give two agricultural examples of crop plants that reproduce vegetatively, stating the specific plant organ used in each case.",
          "workedSolution": "(i) Vegetative reproduction:\nA form of asexual plant reproduction in which a new independent daughter plant develops directly from a specialized vegetative somatic organ of the parent plant (such as a stem, root, leaf, or bud) without the production of flowers, seeds, or the fusion of male and female gametes.\n\n(ii) Examples:\n1. Cassava (*Manihot esculenta*): Propagated using mature woody stem cuttings.\n2. Sweet potato (*Ipomoea batatas*): Propagated using apical vine stem cuttings or tuberous roots.\n3. Bulb Onion (*Allium cepa*): Propagated using underground swollen bulbs (modified shoot with fleshy scale leaves).\n4. Sugarcane (*Saccharum officinarum*): Propagated using stem setts bearing nodal buds.\n5. *Bryophyllum*: Propagated via adventitious foliar plantlets formed along leaf margins.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(c)",
          "id": "q04_c",
          "prompt": "The diagram below illustrates the sub-atomic particle architecture of an atom:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 180' width='100%' height='160' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Central Nucleus --><circle cx='140' cy='90' r='24' fill='#1e293b' stroke='#f59e0b' stroke-width='1.8'/><!-- Protons (+1) --><circle cx='133' cy='85' r='5' fill='#ef4444'/><text x='133' y='88' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>+</text><circle cx='145' cy='95' r='5' fill='#ef4444'/><text x='145' y='98' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>+</text><!-- Neutrons (0) --><circle cx='145' cy='84' r='5' fill='#94a3b8'/><text x='145' y='87' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>n</text><circle cx='133' cy='96' r='5' fill='#94a3b8'/><text x='133' y='99' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>n</text><!-- Electron Shell Orbit --><ellipse cx='140' cy='90' rx='80' ry='50' fill='none' stroke='#38bdf8' stroke-width='1.2' stroke-dasharray='4,3' transform='rotate(-20 140 90)'/><!-- Orbiting Electrons (-1) --><circle cx='68' cy='65' r='4.5' fill='#38bdf8'/><text x='68' y='68' font-size='7' font-weight='bold' fill='#0f172a' text-anchor='middle'>-</text><circle cx='212' cy='115' r='4.5' fill='#38bdf8'/><text x='212' y='118' font-size='7' font-weight='bold' fill='#0f172a' text-anchor='middle'>-</text><!-- Labels --><text x='140' y='25' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Electrons: Negative Charge (-1)</text><text x='140' y='155' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='middle'>Nucleus: Protons (+1) and Neutrons (0)</text></svg></div>\n\n(i) List the three fundamental sub-atomic particles that constitute an atom, state the relative electrical charge of each, and indicate where they reside in the atomic structure.\n\n(ii) Explain the precise scientific meaning of the term mechanical work.\n\n(iii) In a clear tabular format, distinguish between heat and temperature, stating the official S.I. unit for each physical quantity.",
          "workedSolution": "(i) Sub-atomic particles (refer to diagram):\n1. Protons: Carry a relative electrical charge of $+1$ (positive charge) and reside tightly bound within the central atomic nucleus.\n2. Neutrons: Carry zero electrical charge (electrically neutral, charge of $0$) and reside alongside protons within the central atomic nucleus.\n3. Electrons: Carry a relative electrical charge of $-1$ (negative charge) and orbit at high speeds in discrete energy levels (shells) surrounding the nucleus.\n\n(ii) Definition of work:\nMechanical work is done whenever an applied unbalanced force ($F$) acts on a physical body and causes it to move through a displacement distance ($d$) in the direction of the applied force ($W = F \\times d$).\n\n(iii) Distinction Table between Heat and Temperature:\n\n| Feature | Heat Energy | Temperature |\n| :--- | :--- | :--- |\n| **Physical Definition** | The total thermal energy transferred between two systems as a direct consequence of a temperature difference | The measure of the degree of hotness or coldness of a body (proportional to the average kinetic energy of its particles) |\n| **Nature of Quantity** | A form of energy (extensive property dependent on mass) | An intensive thermal state property (independent of the quantity of matter) |\n| **Measuring Instrument** | Joule meter / Calorimeter | Thermometer (liquid-in-glass, digital, thermocouple) |\n| **Official S.I. Unit** | **Joule [J]** | **Kelvin [K]** *(degree Celsius, °C, is an accepted metric scale)* |",
          "maxMarks": 10,
          "marks": 10
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q04_a",
          "prompt": "(i) What is environmental pollution?\n(ii) Name two distinct types of environmental pollution. For each type named, identify one major pollutant and its primary human or industrial source.",
          "workedSolution": "(i) Definition of environmental pollution:\nThe introduction of harmful chemical substances, solid particulates, or forms of energy (such as heat, noise, or radiation) into the natural environment in concentrations that cause adverse physiological damage to living organisms and degrade ecosystem quality.\n\n(ii) Types, pollutants, and sources:\n• Type 1: Air Pollution\n  - Pollutant: Carbon monoxide ($CO$) or Sulfur dioxide ($SO_2$) / Particulate soot.\n  - Source: Incomplete combustion of fossil fuels in motor vehicle exhaust engines, oil refineries, and industrial coal-fired factory furnaces.\n• Type 2: Water Pollution\n  - Pollutant: Untreated domestic sewage / Synthetic chemical pesticide and fertilizer runoff.\n  - Source: Municipal open gutter discharge, illegal alluvial gold mining (galamsey) washing silt and mercury into rivers, and agricultural runoff.\n• Type 3: Land / Soil Pollution\n  - Pollutant: Non-biodegradable polythene plastic waste / Heavy metal industrial effluents.\n  - Source: Indiscriminate municipal littering and battery recycling workshops.",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(b)",
          "id": "q04_b",
          "prompt": "(i) Explain what is meant by vegetative reproduction in plants.\n(ii) Give two agricultural examples of crop plants that reproduce vegetatively, stating the specific plant organ used in each case.",
          "workedSolution": "(i) Vegetative reproduction:\nA form of asexual plant reproduction in which a new independent daughter plant develops directly from a specialized vegetative somatic organ of the parent plant (such as a stem, root, leaf, or bud) without the production of flowers, seeds, or the fusion of male and female gametes.\n\n(ii) Examples:\n1. Cassava (*Manihot esculenta*): Propagated using mature woody stem cuttings.\n2. Sweet potato (*Ipomoea batatas*): Propagated using apical vine stem cuttings or tuberous roots.\n3. Bulb Onion (*Allium cepa*): Propagated using underground swollen bulbs (modified shoot with fleshy scale leaves).\n4. Sugarcane (*Saccharum officinarum*): Propagated using stem setts bearing nodal buds.\n5. *Bryophyllum*: Propagated via adventitious foliar plantlets formed along leaf margins.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(c)",
          "id": "q04_c",
          "prompt": "The diagram below illustrates the sub-atomic particle architecture of an atom:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 180' width='100%' height='160' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Central Nucleus --><circle cx='140' cy='90' r='24' fill='#1e293b' stroke='#f59e0b' stroke-width='1.8'/><!-- Protons (+1) --><circle cx='133' cy='85' r='5' fill='#ef4444'/><text x='133' y='88' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>+</text><circle cx='145' cy='95' r='5' fill='#ef4444'/><text x='145' y='98' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>+</text><!-- Neutrons (0) --><circle cx='145' cy='84' r='5' fill='#94a3b8'/><text x='145' y='87' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>n</text><circle cx='133' cy='96' r='5' fill='#94a3b8'/><text x='133' y='99' font-size='6' font-weight='bold' fill='#ffffff' text-anchor='middle'>n</text><!-- Electron Shell Orbit --><ellipse cx='140' cy='90' rx='80' ry='50' fill='none' stroke='#38bdf8' stroke-width='1.2' stroke-dasharray='4,3' transform='rotate(-20 140 90)'/><!-- Orbiting Electrons (-1) --><circle cx='68' cy='65' r='4.5' fill='#38bdf8'/><text x='68' y='68' font-size='7' font-weight='bold' fill='#0f172a' text-anchor='middle'>-</text><circle cx='212' cy='115' r='4.5' fill='#38bdf8'/><text x='212' y='118' font-size='7' font-weight='bold' fill='#0f172a' text-anchor='middle'>-</text><!-- Labels --><text x='140' y='25' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Electrons: Negative Charge (-1)</text><text x='140' y='155' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='middle'>Nucleus: Protons (+1) and Neutrons (0)</text></svg></div>\n\n(i) List the three fundamental sub-atomic particles that constitute an atom, state the relative electrical charge of each, and indicate where they reside in the atomic structure.\n\n(ii) Explain the precise scientific meaning of the term mechanical work.\n\n(iii) In a clear tabular format, distinguish between heat and temperature, stating the official S.I. unit for each physical quantity.",
          "workedSolution": "(i) Sub-atomic particles (refer to diagram):\n1. Protons: Carry a relative electrical charge of $+1$ (positive charge) and reside tightly bound within the central atomic nucleus.\n2. Neutrons: Carry zero electrical charge (electrically neutral, charge of $0$) and reside alongside protons within the central atomic nucleus.\n3. Electrons: Carry a relative electrical charge of $-1$ (negative charge) and orbit at high speeds in discrete energy levels (shells) surrounding the nucleus.\n\n(ii) Definition of work:\nMechanical work is done whenever an applied unbalanced force ($F$) acts on a physical body and causes it to move through a displacement distance ($d$) in the direction of the applied force ($W = F \\times d$).\n\n(iii) Distinction Table between Heat and Temperature:\n\n| Feature | Heat Energy | Temperature |\n| :--- | :--- | :--- |\n| **Physical Definition** | The total thermal energy transferred between two systems as a direct consequence of a temperature difference | The measure of the degree of hotness or coldness of a body (proportional to the average kinetic energy of its particles) |\n| **Nature of Quantity** | A form of energy (extensive property dependent on mass) | An intensive thermal state property (independent of the quantity of matter) |\n| **Measuring Instrument** | Joule meter / Calorimeter | Thermometer (liquid-in-glass, digital, thermocouple) |\n| **Official S.I. Unit** | **Joule [J]** | **Kelvin [K]** *(degree Celsius, °C, is an accepted metric scale)* |",
          "maxMarks": 10,
          "marks": 10
        }
      ]
    }
  ]
};


async function seedBece1990SciencePaper2Variant() {
  console.log('Seeding 1990 BECE Integrated Science Paper 2 Variant (Set 99) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_1990_variant');

  await docRef.set({
    paper2: {
      id: "paper_1990_variant_p2",
      title: "Paper 2: Theory & Practical Essay (Variant)",
      durationMinutes: 60,
      instructions: "Answer three questions only from this section. Illustrate your answers wherever possible with large, clear, fully labelled diagrams. All questions carry equal marks (20 marks each).",
      totalQuestions: 4,
      questions: SET_BECE_1990_SCIENCE_P2.questions
    },
    metadata: {
      paper2Calibrated: true,
      set99Verified: true,
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });
  console.log('✅ Ingested into past_papers/paper_1990_variant.');

  const topicDocRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_1990_variant_p2');
  await topicDocRef.set({
    ...SET_BECE_1990_SCIENCE_P2,
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  }, { merge: true });
  console.log('✅ Ingested into topics/bece_past_papers/question_sets/paper_1990_variant_p2.');

  console.log('🌟 Successfully seeded Set 99 (1990 Science Paper 2 Variant) into Firestore.');
}

seedBece1990SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 99 Science Paper 2:', err);
    process.exit(1);
  });

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
 * 1990 BECE Integrated Science Paper 1 (Set 98 Objective Test Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_1990_variant
 * Set Number: Set 98
 * Modernized: 4-Option (A-D) Framework from vintage 5-option format
 * Balanced Distribution: Exactly 10 A, 10 B, 10 C, 10 D (0% skew)
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export const svgQ03SimpleDistillation = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Heat Flame on Left --><path d='M 75 160 Q 70 145 75 138 Q 80 145 75 160 Z' fill='#f59e0b'/><!-- Round-bottom Distillation Flask --><ellipse cx='75' cy='115' rx='30' ry='28' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='72' y='55' width='6' height='35' fill='#38bdf8' opacity='0.3'/><!-- Boiling Brine Solution --><path d='M 50 120 Q 75 138 100 120 Z' fill='#38bdf8' opacity='0.5'/><text x='75' y='180' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Heat Source</text><text x='75' y='118' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Brine Solution</text><!-- Thermometer in Neck --><line x1='75' y1='40' x2='75' y2='80' stroke='#ef4444' stroke-width='1.5'/><!-- Condenser Tube (Angled downward to right) --><line x1='78' y1='65' x2='270' y2='135' stroke='#38bdf8' stroke-width='3.5'/><!-- Outer Water Jacket --><line x1='110' y1='77' x2='240' y2='125' stroke='#64748b' stroke-width='12' stroke-linecap='round' opacity='0.6'/><text x='175' y='95' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Liebig Condenser</text><!-- Cooling Water Ports --><text x='140' y='125' font-size='7' fill='#38bdf8'>Water In</text><text x='220' y='75' font-size='7' fill='#38bdf8'>Water Out</text><!-- Receiving Conical Flask & Pure Distillate --><g transform='translate(265, 120)'><polygon points='15,20 25,20 38,60 2,60' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='5' y='50' width='30' height='10' fill='#38bdf8' opacity='0.6'/><!-- Falling droplets --><circle cx='20' cy='28' r='1.5' fill='#38bdf8'/><text x='20' y='75' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pure Water</text></g><text x='190' y='192' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DISTILLATION: SEPARATING PURE WATER FROM SALT</text></svg></div>";

export const svgQ14FirstClassLever = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Ground Level --><line x1='30' y1='105' x2='310' y2='105' stroke='#64748b' stroke-width='2'/><!-- Central Pivot / Fulcrum --><polygon points='170,70 155,105 185,105' fill='#3b82f6' stroke='#1d4ed8' stroke-width='2'/><circle cx='170' cy='70' r='4' fill='#ffffff'/><text x='170' y='122' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pivot (Fulcrum in Middle)</text><!-- Rigid Lever Beam --><line x1='50' y1='70' x2='290' y2='70' stroke='#cbd5e1' stroke-width='4'/><!-- Load on Left Side --><rect x='60' y='45' width='35' height='25' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/><text x='77' y='61' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>LOAD</text><!-- Downward Effort on Right Side --><line x1='275' y1='35' x2='275' y2='68' stroke='#10b981' stroke-width='2.5'/><polygon points='271,62 275,70 279,62' fill='#10b981'/><text x='275' y='28' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort</text><text x='170' y='132' font-size='8' font-weight='bold' fill='#64748b' text-anchor='middle'>CLASS 1 LEVER: FULCRUM POSITIONED BETWEEN EFFORT AND LOAD</text></svg></div>";

export const svgQ16EyePupilIris = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 320 170' width='100%' height='155' style='max-width: 400px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- White Sclera Eyeball --><ellipse cx='160' cy='85' rx='105' ry='55' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/><!-- Colored Iris Ring --><circle cx='160' cy='85' r='38' fill='#0284c7' stroke='#0369a1' stroke-width='2'/><!-- Central Pupil Aperture --><circle cx='160' cy='85' r='16' fill='#0f172a'/><!-- Light Reflection Highlight --><circle cx='154' cy='79' r='3' fill='#ffffff' opacity='0.8'/><!-- Pointer Labels --><line x1='160' y1='85' x2='250' y2='45' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='3,2'/><text x='255' y='48' font-size='11' font-weight='bold' fill='#38bdf8'>Pupil (Aperture)</text><line x1='180' y1='105' x2='250' y2='125' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='3,2'/><text x='255' y='129' font-size='11' font-weight='bold' fill='#0284c7'>Iris (Regulates Light)</text><text x='160' y='155' font-size='8' font-weight='bold' fill='#94a3b8' text-anchor='middle'>PUPIL APERTURE DILATES AND CONSTRICTS TO REGULATE LIGHT</text></svg></div>";

export const SET_BECE_1990_SCIENCE_P1: any = {
  "id": "paper_1990_variant",
  "title": "1990 BECE Integrated Science Paper 1 (Set 98 Objective)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Integrated Science",
  "topic": "1990 BECE Standardized Objective Examination",
  "variantType": "past_paper_variant",
  "year": 1990,
  "paperType": 1,
  "setNumber": 98,
  "era": "vintage",
  "totalQuestions": 40,
  "version": 1,
  "format": "multiple_choice",
  "durationMinutes": 45,
  "instructions": "Answer all forty questions. Each question is followed by four options lettered A to D. Choose the correct option for each question.",
  "questions": [
    {
      "id": "q01",
      "number": 1,
      "prompt": "Which of the following metallic elements exists as a dense liquid under standard ambient room conditions (25°C)?",
      "options": [
        "Solid iron [Fe]",
        "Mercury [Hg]",
        "Commercial brass [Cu-Zn alloy]",
        "Solid gold [Au]"
      ],
      "correctAnswer": "Mercury [Hg]",
      "hint": "A heavy, silvery transition metal that remains liquid at room temperature.",
      "workedSolution": "Mercury ($\\text{Hg}$) has a melting point of $-38.8^\\circ\\text{C}$ and is the only metallic element that remains liquid at standard room temperature ($25^\\circ\\text{C}$).",
      "points": 1
    },
    {
      "id": "q02",
      "number": 2,
      "prompt": "In physical science and geometry, the amount of three-dimensional space occupied by a physical body or matter is defined as its:",
      "options": [
        "Surface area",
        "Linear length",
        "Volume",
        "Perimeter"
      ],
      "correctAnswer": "Volume",
      "hint": "Measured in cubic units such as cubic metres ($\\text{m}^3$) or cubic centimetres ($\\text{cm}^3$).",
      "workedSolution": "Volume is the measure of the three-dimensional space enclosed by a boundary or occupied by matter ($V = l \\times b \\times h$).",
      "points": 1
    },
    {
      "id": "q03",
      "number": 3,
      "prompt": "Which of the following laboratory processes is utilized to recover pure distilled water from a homogeneous saline solution (salt water)?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Heat Flame on Left --><path d='M 75 160 Q 70 145 75 138 Q 80 145 75 160 Z' fill='#f59e0b'/><!-- Round-bottom Distillation Flask --><ellipse cx='75' cy='115' rx='30' ry='28' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='72' y='55' width='6' height='35' fill='#38bdf8' opacity='0.3'/><!-- Boiling Brine Solution --><path d='M 50 120 Q 75 138 100 120 Z' fill='#38bdf8' opacity='0.5'/><text x='75' y='180' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Heat Source</text><text x='75' y='118' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Brine Solution</text><!-- Thermometer in Neck --><line x1='75' y1='40' x2='75' y2='80' stroke='#ef4444' stroke-width='1.5'/><!-- Condenser Tube (Angled downward to right) --><line x1='78' y1='65' x2='270' y2='135' stroke='#38bdf8' stroke-width='3.5'/><!-- Outer Water Jacket --><line x1='110' y1='77' x2='240' y2='125' stroke='#64748b' stroke-width='12' stroke-linecap='round' opacity='0.6'/><text x='175' y='95' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Liebig Condenser</text><!-- Cooling Water Ports --><text x='140' y='125' font-size='7' fill='#38bdf8'>Water In</text><text x='220' y='75' font-size='7' fill='#38bdf8'>Water Out</text><!-- Receiving Conical Flask & Pure Distillate --><g transform='translate(265, 120)'><polygon points='15,20 25,20 38,60 2,60' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='5' y='50' width='30' height='10' fill='#38bdf8' opacity='0.6'/><!-- Falling droplets --><circle cx='20' cy='28' r='1.5' fill='#38bdf8'/><text x='20' y='75' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pure Water</text></g><text x='190' y='192' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DISTILLATION: SEPARATING PURE WATER FROM SALT</text></svg></div>",
      "options": [
        "Gravity filtration",
        "Simple distillation",
        "Simple decantation",
        "Centrifugal sedimentation"
      ],
      "correctAnswer": "Simple distillation",
      "hint": "Involves boiling the mixture to generate steam and condensing the pure vapor using a Liebig condenser.",
      "workedSolution": "Distillation vaporizes the volatile solvent (water) away from the non-volatile solute (salt), condensing the pure vapor into liquid water.",
      "points": 1
    },
    {
      "id": "q04",
      "number": 4,
      "prompt": "Which atmospheric gas is consumed as the vital chemical oxidizer that actively supports the burning and combustion of organic fuels?",
      "options": [
        "Diatomic oxygen gas [O₂]",
        "Diatomic nitrogen gas [N₂]",
        "Carbon dioxide gas [CO₂]",
        "Water vapor"
      ],
      "correctAnswer": "Diatomic oxygen gas [O₂]",
      "hint": "Constitutes about 21% of clean atmospheric air and relights a glowing wooden splint.",
      "workedSolution": "Combustion is an exothermic oxidation reaction requiring oxygen gas ($\\text{O}_2$) to react chemically with the fuel.",
      "points": 1
    },
    {
      "id": "q05",
      "number": 5,
      "prompt": "In chemical science, the substance known as brine is defined as a saturated aqueous solution of:",
      "options": [
        "Calcium carbonate in kerosene",
        "Sodium hydroxide in alcohol",
        "Magnesium sulfate in acetone",
        "Sodium chloride salt in water"
      ],
      "correctAnswer": "Sodium chloride salt in water",
      "hint": "Concentrated salt water commonly used in food preservation and chlorine production.",
      "workedSolution": "Brine is a high-concentration or saturated aqueous solution of common table salt, sodium chloride ($\\text{NaCl}$), dissolved in water.",
      "points": 1
    },
    {
      "id": "q06",
      "number": 6,
      "prompt": "What is the standard international chemical symbol assigned to the metallic element Iron?",
      "options": [
        "Fe",
        "I",
        "Ir",
        "In"
      ],
      "correctAnswer": "Fe",
      "hint": "Derived from its classical Latin name *Ferrum*.",
      "workedSolution": "The chemical symbol for iron is $\\text{Fe}$, derived from the Latin *Ferrum*. Symbol 'I' is iodine, while 'Ir' is iridium.",
      "points": 1
    },
    {
      "id": "q07",
      "number": 7,
      "prompt": "A portable battery-operated torch derives its electrical energy from:",
      "options": [
        "A mechanical dynamo alone",
        "A permanent bar magnet",
        "A chemical dry cell",
        "An uncharged electrostatic capacitor"
      ],
      "correctAnswer": "A chemical dry cell",
      "hint": "Converts stored chemical potential energy into direct-current electricity.",
      "workedSolution": "Dry cells (such as zinc-carbon or alkaline batteries) store chemical potential energy and convert it into electrical current to light torch bulbs.",
      "points": 1
    },
    {
      "id": "q08",
      "number": 8,
      "prompt": "A pure chemical substance that cannot be broken down or decomposed into simpler substances by ordinary chemical means is called:",
      "options": [
        "A compound",
        "A homogeneous mixture",
        "An element",
        "A polyatomic molecule"
      ],
      "correctAnswer": "An element",
      "hint": "Consists of only one specific type of atom (e.g., oxygen, gold, copper).",
      "workedSolution": "An element is a pure chemical substance composed of atoms with the same nuclear charge (atomic number) that cannot be split into simpler constituents.",
      "points": 1
    },
    {
      "id": "q09",
      "number": 9,
      "prompt": "During vigorous physical exercise, what specific form of thermal energy is absorbed and carried away from the skin surface as sweat evaporates?",
      "options": [
        "Acoustic sound energy",
        "Mechanical kinetic energy",
        "Thermal heat energy (Latent heat of vaporization)",
        "Nuclear binding energy"
      ],
      "correctAnswer": "Thermal heat energy (Latent heat of vaporization)",
      "hint": "Liquid water absorbs latent heat from cutaneous capillaries to vaporize into the air, cooling the body.",
      "workedSolution": "Evaporating sweat absorbs latent heat of vaporization from the cutaneous blood vessels, cooling the body to regulate internal core temperature.",
      "points": 1
    },
    {
      "id": "q10",
      "number": 10,
      "prompt": "What is the physical phase change process called when water vapor (steam) loses heat and transforms into liquid water droplets?",
      "options": [
        "Vaporization",
        "Condensation",
        "Sublimation",
        "Melting"
      ],
      "correctAnswer": "Condensation",
      "hint": "The exothermic process seen when steam contacts a cool glass window or mirror.",
      "workedSolution": "Condensation is the physical phase transition where a gas or vapor releases latent heat to convert into a liquid.",
      "points": 1
    },
    {
      "id": "q11",
      "number": 11,
      "prompt": "Which of the following statements concerning mechanical friction is SCIENTIFICALLY INCORRECT?",
      "options": [
        "Frictional force always opposes relative motion between surfaces",
        "Friction converts mechanical energy into waste heat in machines",
        "Frictional force spontaneously increases and accelerates motion",
        "Friction causes wear and tear on vehicular tyres and bearings"
      ],
      "correctAnswer": "Frictional force spontaneously increases and accelerates motion",
      "hint": "Friction acts as a retarding resistance against relative sliding motion.",
      "workedSolution": "Friction is a resistive contact force that opposes motion and decelerates moving bodies; it does not accelerate or increase motion.",
      "points": 1
    },
    {
      "id": "q12",
      "number": 12,
      "prompt": "Which meteorological instrument is specifically calibrated to measure the kinetic speed (velocity) of atmospheric wind?",
      "options": [
        "A wind vane",
        "A wet-and-dry bulb hygrometer",
        "A mercury barometer",
        "A cup anemometer"
      ],
      "correctAnswer": "A cup anemometer",
      "hint": "A wind vane indicates direction, whereas rotating cups measure speed.",
      "workedSolution": "An anemometer consists of rotating hemispherical cups that spin at a rate proportional to wind speed, quantifying wind velocity.",
      "points": 1
    },
    {
      "id": "q13",
      "number": 13,
      "prompt": "When a football rolls along a level grassy field, which contact force acts to slow down and eventually bring the rolling ball to a halt?",
      "options": [
        "Electrostatic attraction force",
        "Magnetic force",
        "Centripetal tension force",
        "Rolling frictional force"
      ],
      "correctAnswer": "Rolling frictional force",
      "hint": "The contact resistance between the leather ball surface and the grass blades.",
      "workedSolution": "Rolling friction opposes the ball's motion, dissipating its kinetic energy as thermal energy and bringing it to rest.",
      "points": 1
    },
    {
      "id": "q14",
      "number": 14,
      "prompt": "Which of the following statements correctly describes the mechanical configuration of a first-class lever?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Ground Level --><line x1='30' y1='105' x2='310' y2='105' stroke='#64748b' stroke-width='2'/><!-- Central Pivot / Fulcrum --><polygon points='170,70 155,105 185,105' fill='#3b82f6' stroke='#1d4ed8' stroke-width='2'/><circle cx='170' cy='70' r='4' fill='#ffffff'/><text x='170' y='122' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pivot (Fulcrum in Middle)</text><!-- Rigid Lever Beam --><line x1='50' y1='70' x2='290' y2='70' stroke='#cbd5e1' stroke-width='4'/><!-- Load on Left Side --><rect x='60' y='45' width='35' height='25' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/><text x='77' y='61' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>LOAD</text><!-- Downward Effort on Right Side --><line x1='275' y1='35' x2='275' y2='68' stroke='#10b981' stroke-width='2.5'/><polygon points='271,62 275,70 279,62' fill='#10b981'/><text x='275' y='28' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort</text><text x='170' y='132' font-size='8' font-weight='bold' fill='#64748b' text-anchor='middle'>CLASS 1 LEVER: FULCRUM POSITIONED BETWEEN EFFORT AND LOAD</text></svg></div>",
      "options": [
        "The load is situated between the fulcrum and the effort",
        "The fulcrum (pivot) is situated between the applied effort and the load",
        "The applied effort is situated between the fulcrum and the load",
        "The load and the effort are applied at the exact same point"
      ],
      "correctAnswer": "The fulcrum (pivot) is situated between the applied effort and the load",
      "hint": "Think of a see-saw or a pair of scissors: the pivot screw is in the center.",
      "workedSolution": "In a Class 1 lever, the fulcrum lies between the effort force and the load resistance (e.g., crowbars, scissors, see-saws).",
      "points": 1
    },
    {
      "id": "q15",
      "number": 15,
      "prompt": "In which of the following physical situations is NO mechanical work done in the scientific sense ($W = F \\times d$)?",
      "options": [
        "A ripe coconut fruit falls freely from a tall palm tree",
        "A heavy textbook rests stationary on top of a flat study desk",
        "A laborer pushes a loaded wheelbarrow across a building site",
        "A player kicks a stationary football into the goal net"
      ],
      "correctAnswer": "A heavy textbook rests stationary on top of a flat study desk",
      "hint": "Work requires an applied force to move an object through a displacement ($d > 0$).",
      "workedSolution": "Work done requires displacement in the direction of force ($W = F \\times d$). A stationary book has $d = 0$, so work done is zero.",
      "points": 1
    },
    {
      "id": "q16",
      "number": 16,
      "prompt": "In the human eye, which anatomical structure dilates and constricts to regulate the amount of light entering the vitreous chamber?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 320 170' width='100%' height='155' style='max-width: 400px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- White Sclera Eyeball --><ellipse cx='160' cy='85' rx='105' ry='55' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/><!-- Colored Iris Ring --><circle cx='160' cy='85' r='38' fill='#0284c7' stroke='#0369a1' stroke-width='2'/><!-- Central Pupil Aperture --><circle cx='160' cy='85' r='16' fill='#0f172a'/><!-- Light Reflection Highlight --><circle cx='154' cy='79' r='3' fill='#ffffff' opacity='0.8'/><!-- Pointer Labels --><line x1='160' y1='85' x2='250' y2='45' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='3,2'/><text x='255' y='48' font-size='11' font-weight='bold' fill='#38bdf8'>Pupil (Aperture)</text><line x1='180' y1='105' x2='250' y2='125' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='3,2'/><text x='255' y='129' font-size='11' font-weight='bold' fill='#0284c7'>Iris (Regulates Light)</text><text x='160' y='155' font-size='8' font-weight='bold' fill='#94a3b8' text-anchor='middle'>PUPIL APERTURE DILATES AND CONSTRICTS TO REGULATE LIGHT</text></svg></div>",
      "options": [
        "The light-sensitive retina",
        "The pupil (controlled by the pigmented iris)",
        "The transparent outer cornea",
        "The choroid blood layer"
      ],
      "correctAnswer": "The pupil (controlled by the pigmented iris)",
      "hint": "The dark central circular opening in the center of the colored iris.",
      "workedSolution": "The iris adjusts pupil diameter via circular and radial smooth muscles, constricting in bright light and dilating in dim light to regulate incoming light.",
      "points": 1
    },
    {
      "id": "q17",
      "number": 17,
      "prompt": "Which of the following animals is classified as a carnivorous predator or scavenger rather than an obligate herbivore?",
      "options": [
        "A domestic dog",
        "A domestic sheep",
        "A domestic goat",
        "A wild grasscutter (cane rat)"
      ],
      "correctAnswer": "A domestic dog",
      "hint": "Sheep, goats, and grasscutters feed exclusively on plants; canines are adapted to consume meat.",
      "workedSolution": "Dogs belong to the order Carnivora and are adapted to eat animal flesh and omnivorous diets, whereas sheep and goats are obligate herbivores.",
      "points": 1
    },
    {
      "id": "q18",
      "number": 18,
      "prompt": "In mammalian human anatomy, the brain and the spinal cord together form the:",
      "options": [
        "Central nervous system",
        "Peripheral autonomic network",
        "Cardiovascular circulatory system",
        "Endocrine hormonal system"
      ],
      "correctAnswer": "Central nervous system",
      "hint": "The central processing unit coordinating all bodily responses and sensory signals.",
      "workedSolution": "The Central Nervous System (CNS) consists of the brain and spinal cord, functioning as the central processing center for sensory and motor commands.",
      "points": 1
    },
    {
      "id": "q19",
      "number": 19,
      "prompt": "Which atmospheric gas do green plants absorb continuously to perform aerobic cellular respiration within their mitochondria?",
      "options": [
        "Oxygen gas [O₂]",
        "Carbon dioxide gas [CO₂]",
        "Diatomic nitrogen gas [N₂]",
        "Methane gas [CH₄]"
      ],
      "correctAnswer": "Oxygen gas [O₂]",
      "hint": "Plants use $\\text{CO}_2$ for daytime photosynthesis, but require $\\text{O}_2$ day and night to respire.",
      "workedSolution": "Plants carry out aerobic respiration like animals, consuming oxygen gas ($\\text{O}_2$) to break down synthesized glucose into ATP energy.",
      "points": 1
    },
    {
      "id": "q20",
      "number": 20,
      "prompt": "When a live bony fish is removed from water and placed on dry land, it suffocates and dies rapidly because its:",
      "options": [
        "Scales prevent heat loss to the surrounding dry air",
        "Gill filaments collapse, dry out, and cannot absorb gaseous atmospheric oxygen",
        "Muscular fins are incapable of swimming on grass",
        "Lateral line pores become waterlogged in air"
      ],
      "correctAnswer": "Gill filaments collapse, dry out, and cannot absorb gaseous atmospheric oxygen",
      "hint": "Gills require water buoyancy to keep delicate filaments separated for gas exchange.",
      "workedSolution": "In air, fish gill filaments adhere together due to surface tension, drastically reducing surface area and causing rapid suffocation.",
      "points": 1
    },
    {
      "id": "q21",
      "number": 21,
      "prompt": "In which of the following natural ecological habitats are you most likely to discover breeding amphibian tadpoles?",
      "options": [
        "A saline oceanic seashore",
        "A dry open savanna bush",
        "A cultivated vegetable seedbed",
        "A calm freshwater pond"
      ],
      "correctAnswer": "A calm freshwater pond",
      "hint": "Amphibian eggs lack waterproof shells and must be laid in calm standing fresh water.",
      "workedSolution": "Frogs and toads lay gelatinous egg clutches in calm freshwater ponds, where aquatic gilled tadpoles hatch and undergo metamorphosis.",
      "points": 1
    },
    {
      "id": "q22",
      "number": 22,
      "prompt": "Which of the following biological processes is specific to terrestrial vascular plants rather than a universal characteristic of all living organisms?",
      "options": [
        "Foliar transpiration",
        "Cellular respiration",
        "Growth and development",
        "Biological reproduction"
      ],
      "correctAnswer": "Foliar transpiration",
      "hint": "Universal characteristics include the seven MR NIGER D traits (Movement, Respiration, Nutrition, etc.).",
      "workedSolution": "Transpiration (evaporative water loss through stomata) is specific to vascular plants, whereas respiration, growth, and reproduction occur in all living things.",
      "points": 1
    },
    {
      "id": "q23",
      "number": 23,
      "prompt": "Certain desert and arid plants develop sharp thorns and spines on their stems primarily to:",
      "options": [
        "Directly absorb nitrogen gas from the atmosphere",
        "Protect themselves against browsing herbivores and reduce surface water loss",
        "Assist the plant stems to climb neighboring forest trees",
        "Release toxic chemicals that sterilize the surrounding soil"
      ],
      "correctAnswer": "Protect themselves against browsing herbivores and reduce surface water loss",
      "hint": "Acts as a physical deterrent against grazing livestock.",
      "workedSolution": "Thorns and spines deter browsing animals from eating plant tissues, and modified needle leaves reduce surface area to conserve water in arid zones.",
      "points": 1
    },
    {
      "id": "q24",
      "number": 24,
      "prompt": "Which agricultural soil type is characteristic of low-lying, poorly drained wetland areas prone to prolonged seasonal waterlogging?",
      "options": [
        "Coarse quartz sandy soil",
        "Gravelly subsoil",
        "Heavy clayey soil",
        "Well-drained sandy loam"
      ],
      "correctAnswer": "Heavy clayey soil",
      "hint": "Contains microscopic micropores that hold water tenaciously, impeding drainage.",
      "workedSolution": "Clayey soils have tiny micropores and high plasticity, retaining water tenaciously and causing waterlogging in low-lying areas.",
      "points": 1
    },
    {
      "id": "q25",
      "number": 25,
      "prompt": "Which beneficial macro-invertebrate soil organism burrows through topsoil, aerating the ground and increasing soil fertility with its nutrient-rich organic casts?",
      "options": [
        "The ant-lion larva",
        "The predatory red ant",
        "The earthworm",
        "The millipede"
      ],
      "correctAnswer": "The earthworm",
      "hint": "Ingests soil and decaying organic litter, depositing nutrient-rich casts.",
      "workedSolution": "Earthworms burrow through topsoil, enhancing aeration and drainage, while their digested organic casts enrich soil with plant-available nitrates and phosphorus.",
      "points": 1
    },
    {
      "id": "q26",
      "number": 26,
      "prompt": "Which of the following perennial economic cash crops is grown in extensive monoculture on large-scale commercial plantations?",
      "options": [
        "Natural rubber [Hevea brasiliensis]",
        "Fresh tomato",
        "Okro",
        "Garden lettuce"
      ],
      "correctAnswer": "Natural rubber [Hevea brasiliensis]",
      "hint": "Tapped for milky latex over many years across extensive estates.",
      "workedSolution": "Rubber is a perennial tree crop grown on large industrial plantations for latex harvesting, unlike annual vegetable crops.",
      "points": 1
    },
    {
      "id": "q27",
      "number": 27,
      "prompt": "The morphological architectural shape of a child's nose may closely resemble that of the biological mother due to:",
      "options": [
        "Physical similarity",
        "Psychological familiarity",
        "Nutritional mimicry",
        "Genetic heredity"
      ],
      "correctAnswer": "Genetic heredity",
      "hint": "The transmission of genetic alleles from parents to progeny.",
      "workedSolution": "Facial morphology is an inherited phenotypic trait governed by alleles passed from biological parents to offspring through genetic inheritance.",
      "points": 1
    },
    {
      "id": "q28",
      "number": 28,
      "prompt": "Which of the following cultivated food crops is propagated predominantly through asexual vegetative propagation rather than through true botanical seeds?",
      "options": [
        "Pawpaw tree [Carica papaya]",
        "Sweet potato [Ipomoea batatas] (via vine cuttings)",
        "Apple fruit [Malus domestica]",
        "Coconut palm [Cocos nucifera]"
      ],
      "correctAnswer": "Sweet potato [Ipomoea batatas] (via vine cuttings)",
      "hint": "Farmers plant stem vine cuttings or tuberous roots to produce clones.",
      "workedSolution": "Sweet potatoes are propagated vegetatively using apical vine cuttings or tubers, whereas pawpaw and coconut are grown from true botanical seeds.",
      "points": 1
    },
    {
      "id": "q29",
      "number": 29,
      "prompt": "Which of the following warm-blooded vertebrate animals is classified as an avian bird rather than a viviparous mammal?",
      "options": [
        "An aquatic blue whale",
        "A flying fruit bat",
        "A house mouse",
        "A domestic fowl (chicken)"
      ],
      "correctAnswer": "A domestic fowl (chicken)",
      "hint": "Possesses feathers, a beak, and reproduces by laying hard-shelled eggs.",
      "workedSolution": "The domestic fowl is an avian bird (feathers, beaks, oviparous), while whales, bats, and mice are viviparous mammals with mammary glands.",
      "points": 1
    },
    {
      "id": "q30",
      "number": 30,
      "prompt": "The physiological loss of water in the form of vapor through the microscopic stomatal apertures of plant leaves is termed:",
      "options": [
        "Photosynthesis",
        "Foliar respiration",
        "Gutting filtration",
        "Transpiration"
      ],
      "correctAnswer": "Transpiration",
      "hint": "The physical evaporation process that drives the transpiration pull in xylem.",
      "workedSolution": "Transpiration is the evaporative loss of water vapor from aerial plant tissues through stomata, generating tension that pulls water up from the roots.",
      "points": 1
    },
    {
      "id": "q31",
      "number": 31,
      "prompt": "Following successful pollination and double fertilization in an angiosperm flower, the fertilized ovules develop directly into:",
      "options": [
        "Fleshy pericarp fruits",
        "Embryonic plumules only",
        "Seeds",
        "Green sepals"
      ],
      "correctAnswer": "Seeds",
      "hint": "The ovary wall becomes the fruit pericarp, while the ovules inside become seeds.",
      "workedSolution": "After fertilization, each ovule matures into a seed enclosing an embryo and endosperm, while the surrounding floral ovary becomes the fruit.",
      "points": 1
    },
    {
      "id": "q32",
      "number": 32,
      "prompt": "In human male reproductive anatomy, viable spermatozoa and testosterone are synthesized within the:",
      "options": [
        "Urinary ureters",
        "Testes (seminiferous tubules)",
        "Prostate gland",
        "Penile urethra"
      ],
      "correctAnswer": "Testes (seminiferous tubules)",
      "hint": "The primary male gonads suspended inside the external scrotal sac.",
      "workedSolution": "Spermatozoa are produced via spermatogenesis in the seminiferous tubules of the testes, which also secrete testosterone.",
      "points": 1
    },
    {
      "id": "q33",
      "number": 33,
      "prompt": "Complex dietary carbohydrates like cooked starch are enzymatically broken down and absorbed across intestinal villi into the blood as:",
      "options": [
        "Soluble starch polymers",
        "Fatty acids and glycerol",
        "Polypeptide chains",
        "Monomeric glucose"
      ],
      "correctAnswer": "Monomeric glucose",
      "hint": "Amylase and maltase hydrolyze starch polysaccharides into this simple monosaccharide.",
      "workedSolution": "Starch is enzymatically digested by salivary and pancreatic amylase and maltase into glucose monosaccharides, which are absorbed into mesenteric capillaries.",
      "points": 1
    },
    {
      "id": "q34",
      "number": 34,
      "prompt": "In the human excretory urinary system, the two muscular tubular ducts that convey urine from the kidneys to the urinary bladder are called:",
      "options": [
        "The urethra",
        "The renal veins",
        "The mesenteric arteries",
        "The ureters"
      ],
      "correctAnswer": "The ureters",
      "hint": "Ureters connect kidneys to bladder; the single urethra conveys urine from bladder to exterior.",
      "workedSolution": "The ureters are bilateral muscular tubes that carry urine from the renal pelvis of each kidney down into the urinary bladder via peristaltic waves.",
      "points": 1
    },
    {
      "id": "q35",
      "number": 35,
      "prompt": "A clinical patient presenting with chronic persistent coughing, chest pain, night sweats, and coughing up blood (hemoptysis) is likely suffering from:",
      "options": [
        "Pulmonary tuberculosis",
        "Bronchial asthma",
        "Measles virus",
        "Common influenza"
      ],
      "correctAnswer": "Pulmonary tuberculosis",
      "hint": "A contagious airborne bacterial infection caused by *Mycobacterium tuberculosis*.",
      "workedSolution": "Pulmonary tuberculosis, caused by *Mycobacterium tuberculosis*, causes cavitation of lung tissue leading to chronic cough, weight loss, and hemoptysis.",
      "points": 1
    },
    {
      "id": "q36",
      "number": 36,
      "prompt": "Which of the following personal or domestic hygiene habits DOES NOT promote community health and is harmful to human physiology?",
      "options": [
        "Disposing of domestic liquid and solid waste sanitarily",
        "Consuming a scientifically balanced daily diet",
        "Bleaching the skin using caustic hydroquinone creams",
        "Maintaining clean surroundings free from stagnant pools"
      ],
      "correctAnswer": "Bleaching the skin using caustic hydroquinone creams",
      "hint": "Chemical skin bleaching destroys protective melanin pigments and damages dermal tissue.",
      "workedSolution": "Skin bleaching disrupts dermal melanin, thinning the skin and increasing susceptibility to UV damage, skin cancers, and dermatitis.",
      "points": 1
    },
    {
      "id": "q37",
      "number": 37,
      "prompt": "Which public health officer is legally empowered to inspect residential premises and summon individuals who maintain unsanitary surroundings to court?",
      "options": [
        "The Environmental Health Officer (Sanitary inspector)",
        "The court registrar",
        "The state prosecutor",
        "The prison warden"
      ],
      "correctAnswer": "The Environmental Health Officer (Sanitary inspector)",
      "hint": "Commonly known historically in Ghanaian towns as 'Saman Saman'.",
      "workedSolution": "Environmental Health Officers (sanitary inspectors) inspect premises, enforce public hygiene standards, and issue court summons for health code violations.",
      "points": 1
    },
    {
      "id": "q38",
      "number": 38,
      "prompt": "Which of the following climatological and environmental statements is INCORRECT regarding the wet (rainy) season in Ghana?",
      "options": [
        "Vegetative weeds and tree canopies experience rapid active growth",
        "Small animal, frog, and insect populations proliferate rapidly",
        "Uncontrolled bush fires rage frequently through the savannas",
        "Ambient atmospheric temperatures are generally cooler and humid"
      ],
      "correctAnswer": "Uncontrolled bush fires rage frequently through the savannas",
      "hint": "Bush fires occur during the dry harmattan season when dry brushwood ignites easily.",
      "workedSolution": "Wildfires require dry combustible vegetation and low humidity (harmattan season); wet vegetation during the rainy season inhibits fire ignition.",
      "points": 1
    },
    {
      "id": "q39",
      "number": 39,
      "prompt": "A smooth glass mirror directs a beam of incident sunlight onto an opposite classroom wall primarily through the optical process of:",
      "options": [
        "Specular reflection of light rays",
        "Electromagnetic radiation",
        "Thermal convection",
        "Wave diffraction"
      ],
      "correctAnswer": "Specular reflection of light rays",
      "hint": "The bouncing of light rays off a polished silvered boundary without changing media.",
      "workedSolution": "Specular reflection occurs when parallel rays of light strike a smooth, polished plane mirror and bounce off at equal angles ($i = r$) to form a reflected beam.",
      "points": 1
    },
    {
      "id": "q40",
      "number": 40,
      "prompt": "Our central star, the Sun, together with the eight orbiting major planets, their moons, and smaller celestial bodies, form the:",
      "options": [
        "Andromeda Galaxy",
        "Ursa Major Constellation",
        "Terrestrial Atmosphere",
        "Solar System"
      ],
      "correctAnswer": "Solar System",
      "hint": "The planetary gravitational system centered on our Sun.",
      "workedSolution": "The Solar System consists of the Sun and all celestial bodies bound to it by gravity, including the eight major planets, dwarf planets, and asteroids.",
      "points": 1
    }
  ]
};


async function seedBece1990SciencePaper1Variant() {
  console.log('Seeding 1990 BECE Integrated Science Paper 1 Variant (Set 98) into Firestore...');
  const db = await getFirestore();

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  SET_BECE_1990_SCIENCE_P1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Key Distribution across 40 items:', keyDist);

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_1990_variant');
  await docRef.set({
    year: 1990,
    isVariant: true,
    setNumber: 98,
    subject: "Integrated Science",
    examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
    paper1: {
      title: "Paper 1: Objective Test (Variant)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: SET_BECE_1990_SCIENCE_P1.questions
    },
    metadata: {
      sanitized: true,
      optionsBalanced: true,
      modernizedOptions: "Converted 5-option vintage format (A-E) to standard WAEC 4-option framework (A-D).",
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });
  console.log('✅ Ingested into past_papers/paper_1990_variant.');

  const topicDocRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_1990_variant');
  await topicDocRef.set({
    ...SET_BECE_1990_SCIENCE_P1,
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  }, { merge: true });
  console.log('✅ Ingested into topics/bece_past_papers/question_sets/paper_1990_variant.');

  console.log('🌟 Successfully seeded Set 98 (1990 Science Paper 1 Variant) into Firestore.');
}

seedBece1990SciencePaper1Variant()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed ingestion for Set 98 Science Paper 1:', err);
    process.exit(1);
  });

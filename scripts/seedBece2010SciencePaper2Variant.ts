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
 * 2010 BECE Integrated Science Paper 2 (Set 97 Practical & Theory Essay Test)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2010_variant
 * Set Number: Set 97
 * Format: Structured essay & laboratory practicals with sanitized responsive vector SVGs
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export const svgQ1aCircuitDiagram = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 180' width='100%' height='165' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Top Wire with DC Cell E and Switch K --><line x1='40' y1='40' x2='120' y2='40' stroke='#38bdf8' stroke-width='2.5'/><!-- Cell E (Long thin positive plate, short thick negative plate) --><line x1='120' y1='24' x2='120' y2='56' stroke='#10b981' stroke-width='2.5'/><text x='112' y='20' font-size='11' font-weight='bold' fill='#10b981'>+</text><line x1='130' y1='32' x2='130' y2='48' stroke='#ef4444' stroke-width='4'/><text x='136' y='20' font-size='11' font-weight='bold' fill='#ef4444'>-</text><text x='125' y='14' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>E (Cell)</text><line x1='130' y1='40' x2='190' y2='40' stroke='#38bdf8' stroke-width='2.5'/><!-- Key / Switch K (Open position) --><circle cx='194' cy='40' r='3' fill='#e2e8f0'/><line x1='194' y1='40' x2='220' y2='28' stroke='#e2e8f0' stroke-width='2.5'/><circle cx='224' cy='40' r='3' fill='#e2e8f0'/><text x='210' y='20' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>K (Switch)</text><!-- Right Connecting Wire D --><line x1='224' y1='40' x2='290' y2='40' stroke='#38bdf8' stroke-width='2.5'/><line x1='290' y1='40' x2='290' y2='130' stroke='#38bdf8' stroke-width='2.5'/><line x1='290' y1='85' x2='325' y2='85' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='330' y='89' font-size='11' font-weight='bold' fill='#38bdf8'>D (Wire)</text><!-- Bottom Wire with Load Resistor P --><line x1='290' y1='130' x2='205' y2='130' stroke='#38bdf8' stroke-width='2.5'/><!-- Resistor P --><rect x='135' y='118' width='70' height='24' rx='3' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='170' y='134' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>P (Resistor)</text><line x1='135' y1='130' x2='40' y2='130' stroke='#38bdf8' stroke-width='2.5'/><!-- Left Wire Return --><line x1='40' y1='130' x2='40' y2='40' stroke='#38bdf8' stroke-width='2.5'/></svg></div>";

export const svgQ1cDigestiveTract = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 260' width='100%' height='240' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Mouth and Part I: Salivary Glands / Pharynx --><circle cx='170' cy='30' r='5' fill='#f59e0b'/><line x1='175' y1='30' x2='235' y2='30' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='34' font-size='10' font-weight='bold' fill='#f59e0b'>I (Salivary Gland)</text><!-- Part II: Oesophagus (Gullet) --><line x1='170' y1='35' x2='170' y2='80' stroke='#cbd5e1' stroke-width='5'/><line x1='173' y1='55' x2='235' y2='55' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='59' font-size='10' font-weight='bold' fill='#cbd5e1'>II (Oesophagus)</text><!-- Part III: Stomach (J-shaped pouch) --><path d='M 170 80 C 140 80 135 120 165 120 C 190 120 195 90 170 80 Z' fill='#881337' stroke='#f43f5e' stroke-width='2'/><line x1='185' y1='100' x2='240' y2='100' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='245' y='104' font-size='10' font-weight='bold' fill='#f43f5e'>III (Stomach)</text><!-- Part IV: Liver & Part V: Gallbladder --><path d='M 130 80 C 105 80 105 115 135 115 C 145 115 150 95 130 80 Z' fill='#991b1b' stroke='#dc2626' stroke-width='1.5'/><line x1='120' y1='90' x2='60' y2='90' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='94' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='end'>IV (Liver)</text><!-- Gallbladder V --><ellipse cx='138' cy='105' rx='4' ry='6' fill='#16a34a'/><line x1='134' y1='105' x2='60' y2='115' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='119' font-size='10' font-weight='bold' fill='#22c55e' text-anchor='end'>V (Gallbladder)</text><!-- Part VI: Pancreas (elongated gland below stomach) --><path d='M 160 122 Q 185 118 200 126' stroke='#eab308' stroke-width='4' stroke-linecap='round'/><line x1='200' y1='125' x2='245' y2='125' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='250' y='129' font-size='10' font-weight='bold' fill='#eab308'>VI (Pancreas)</text><!-- Part VIII: Large Intestine (Colon perimeter) --><path d='M 125 135 L 125 195 L 215 195 L 215 135 L 125 135' fill='none' stroke='#38bdf8' stroke-width='8'/><line x1='121' y1='165' x2='60' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='169' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='end'>VIII (Colon)</text><!-- Part VII: Small Intestine (Coiled central ileum) --><path d='M 140 150 Q 170 140 190 155 Q 150 175 180 185' fill='none' stroke='#fed7aa' stroke-width='4'/><line x1='170' y1='165' x2='235' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='169' font-size='10' font-weight='bold' fill='#fb923c'>VII (Ileum)</text><!-- Part IX: Rectum & Part X: Anus --><rect x='164' y='199' width='12' height='20' fill='#cbd5e1' stroke='#94a3b8'/><line x1='176' y1='205' x2='235' y2='205' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='209' font-size='10' font-weight='bold' fill='#cbd5e1'>IX (Rectum)</text><circle cx='170' cy='224' r='3' fill='#f43f5e'/><line x1='174' y1='224' x2='235' y2='224' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='228' font-size='10' font-weight='bold' fill='#f43f5e'>X (Anus)</text></svg></div>";

export const svgQ1dCutlass = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Cutlass Blade and Handle --><g transform='translate(40, 45)'><!-- Wooden/Plastic Handle Grip --><rect x='10' y='20' width='45' height='16' rx='3' fill='#d97706' stroke='#b45309' stroke-width='1.5'/><circle cx='20' cy='28' r='2' fill='#0f172a'/><circle cx='45' cy='28' r='2' fill='#0f172a'/><text x='32' y='52' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>Handle</text><!-- Steel Blade: Straight spine, curved widened tip --><path d='M 55 20 L 230 15 Q 260 20 255 35 Q 240 45 200 40 L 55 36 Z' fill='#cbd5e1' stroke='#94a3b8' stroke-width='2'/><!-- Sharp cutting edge lower line --><path d='M 55 36 L 200 40 Q 240 45 255 35' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='150' y='58' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Cutting Edge</text></g><text x='170' y='122' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>GARDEN CUTLASS (MACHETE)</text></svg></div>";

export const svgQ4dSulfurBohr = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 180' width='100%' height='165' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Central Nucleus --><circle cx='140' cy='90' r='18' fill='#ef4444' stroke='#b91c1c' stroke-width='2'/><text x='140' y='94' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>16p, 16n</text><!-- Shell 1 (K): 2 electrons (r=35) --><circle cx='140' cy='90' r='35' fill='none' stroke='#64748b' stroke-width='1.2' stroke-dasharray='3,2'/><circle cx='140' cy='55' r='3' fill='#38bdf8'/><circle cx='140' cy='125' r='3' fill='#38bdf8'/><!-- Shell 2 (L): 8 electrons (r=55) --><circle cx='140' cy='90' r='55' fill='none' stroke='#64748b' stroke-width='1.2' stroke-dasharray='3,2'/><circle cx='140' cy='35' r='3' fill='#38bdf8'/><circle cx='140' cy='145' r='3' fill='#38bdf8'/><circle cx='85' cy='90' r='3' fill='#38bdf8'/><circle cx='195' cy='90' r='3' fill='#38bdf8'/><circle cx='101' cy='51' r='3' fill='#38bdf8'/><circle cx='179' cy='129' r='3' fill='#38bdf8'/><circle cx='101' cy='129' r='3' fill='#38bdf8'/><circle cx='179' cy='51' r='3' fill='#38bdf8'/><!-- Shell 3 (M): 6 valence electrons (r=75) --><circle cx='140' cy='90' r='75' fill='none' stroke='#f59e0b' stroke-width='1.5'/><circle cx='140' cy='15' r='3.5' fill='#f59e0b'/><circle cx='140' cy='165' r='3.5' fill='#f59e0b'/><circle cx='65' cy='90' r='3.5' fill='#f59e0b'/><circle cx='215' cy='90' r='3.5' fill='#f59e0b'/><circle cx='87' cy='37' r='3.5' fill='#f59e0b'/><circle cx='193' cy='143' r='3.5' fill='#f59e0b'/><text x='140' y='176' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>SULFUR (Z = 16): 2, 8, 6</text></svg></div>";

export const SET_BECE_2010_SCIENCE_P2: any = {
  "id": "paper_2010_variant_p2",
  "title": "2010 BECE Integrated Science Paper 2 (Set 97 Practical & Theory)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Integrated Science",
  "topic": "2010 BECE Practical & Theory Essay Test",
  "variantType": "past_paper_variant",
  "year": 2010,
  "paperType": 2,
  "setNumber": 97,
  "era": "classic",
  "totalQuestions": 6,
  "version": 1,
  "format": "structured_essay",
  "durationMinutes": 75,
  "instructions": "Answer four questions in all. Answer Question 1 from Section A (compulsory, 40 marks), and any three questions from Section B (60 marks). All working must be clearly shown.",
  "questions": [
    {
      "id": "q01",
      "questionNumber": "1",
      "isPracticalSectionA": true,
      "subQuestions": [
        {
          "subId": "(a)",
          "id": "q01_a",
          "prompt": "The diagram below is an illustration of an electrical circuit assembled in a physics laboratory:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 180' width='100%' height='165' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Top Wire with DC Cell E and Switch K --><line x1='40' y1='40' x2='120' y2='40' stroke='#38bdf8' stroke-width='2.5'/><!-- Cell E (Long thin positive plate, short thick negative plate) --><line x1='120' y1='24' x2='120' y2='56' stroke='#10b981' stroke-width='2.5'/><text x='112' y='20' font-size='11' font-weight='bold' fill='#10b981'>+</text><line x1='130' y1='32' x2='130' y2='48' stroke='#ef4444' stroke-width='4'/><text x='136' y='20' font-size='11' font-weight='bold' fill='#ef4444'>-</text><text x='125' y='14' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>E (Cell)</text><line x1='130' y1='40' x2='190' y2='40' stroke='#38bdf8' stroke-width='2.5'/><!-- Key / Switch K (Open position) --><circle cx='194' cy='40' r='3' fill='#e2e8f0'/><line x1='194' y1='40' x2='220' y2='28' stroke='#e2e8f0' stroke-width='2.5'/><circle cx='224' cy='40' r='3' fill='#e2e8f0'/><text x='210' y='20' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>K (Switch)</text><!-- Right Connecting Wire D --><line x1='224' y1='40' x2='290' y2='40' stroke='#38bdf8' stroke-width='2.5'/><line x1='290' y1='40' x2='290' y2='130' stroke='#38bdf8' stroke-width='2.5'/><line x1='290' y1='85' x2='325' y2='85' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='330' y='89' font-size='11' font-weight='bold' fill='#38bdf8'>D (Wire)</text><!-- Bottom Wire with Load Resistor P --><line x1='290' y1='130' x2='205' y2='130' stroke='#38bdf8' stroke-width='2.5'/><!-- Resistor P --><rect x='135' y='118' width='70' height='24' rx='3' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='170' y='134' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>P (Resistor)</text><line x1='135' y1='130' x2='40' y2='130' stroke='#38bdf8' stroke-width='2.5'/><!-- Left Wire Return --><line x1='40' y1='130' x2='40' y2='40' stroke='#38bdf8' stroke-width='2.5'/></svg></div>\n\n(i) What does the complete diagram represent?\n\n(ii) Identify the circuit components labelled D, E, K, and P.\n\n(iii) State one specific functional role performed by each of the parts labelled D, E, K, and P in the circuit.\n\n(iv) Mention the primary energy transformation that takes place within component E when switch K is closed.",
          "workedSolution": "(i) Representation:\nAn electric circuit (or a simple DC series electric circuit).\n\n(ii) Identification of components:\n• D: Connecting wire (conductor)\n• E: Electric cell (or direct-current chemical battery source)\n• K: Switch (or Key)\n• P: Resistor (or load resistance / electrical appliance)\n\n(iii) Functional roles:\n• Part D (Connecting wire): Conducts electric charge (electrons) with negligible resistance between circuit components.\n• Part E (Cell): Acts as a voltage source that maintains an electrical potential difference across the circuit.\n• Part K (Switch): Opens (breaks) or closes (completes) the circuit to control current flow.\n• Part P (Resistor): Opposes the flow of electric current and converts electrical energy into heat or other useful energy forms.\n\n(iv) Energy transformation in E:\nChemical potential energy is converted into electrical energy.",
          "maxMarks": 10,
          "marks": 10
        },
        {
          "subId": "(b)",
          "id": "q01_b",
          "prompt": "In a laboratory chemistry investigation, strips of red and blue litmus papers were dipped separately into three test tubes, each containing one of the test liquids listed below:\n\n| Test Substance | Red Litmus Paper | Blue Litmus Paper | Conclusion |\n| :--- | :--- | :--- | :--- |\n| **Lemon juice** | | | |\n| **Calcium hydroxide solution** | | | |\n| **Dilute hydrochloric acid** | | | |\n\n(i) Copy and complete the table by recording the expected observations and scientific conclusion for each test substance.\n\n(ii) Name the two test substances from the table that will react chemically with each other in a neutralization reaction to produce a neutral salt and water.\n\n(iii) Write down a balanced chemical equation for the neutralization reaction identified in (b)(ii).",
          "workedSolution": "(i) Completed Observation Table:\n\n| Test Substance | Red Litmus Paper | Blue Litmus Paper | Conclusion |\n| :--- | :--- | :--- | :--- |\n| **Lemon juice** | Remains red | Turns red | Acidic substance ($pH < 7$) |\n| **Calcium hydroxide solution** | Turns blue | Remains blue | Basic / Alkaline substance ($pH > 7$) |\n| **Dilute hydrochloric acid** | Remains red | Turns red | Acidic substance ($pH < 7$) |\n\n(ii) Neutralization reactants:\nCalcium hydroxide solution and Dilute hydrochloric acid.\n\n(iii) Balanced chemical equation:\n$$2\\text{HCl}_{(aq)} + \\text{Ca(OH)}_{2(aq)} \\to \\text{CaCl}_{2(aq)} + 2\\text{H}_2\\text{O}_{(l)}$$",
          "maxMarks": 10,
          "marks": 10
        },
        {
          "subId": "(c)",
          "id": "q01_c",
          "prompt": "The diagram below is an illustration of the human alimentary canal (digestive system):\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 260' width='100%' height='240' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Mouth and Part I: Salivary Glands / Pharynx --><circle cx='170' cy='30' r='5' fill='#f59e0b'/><line x1='175' y1='30' x2='235' y2='30' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='34' font-size='10' font-weight='bold' fill='#f59e0b'>I (Salivary Gland)</text><!-- Part II: Oesophagus (Gullet) --><line x1='170' y1='35' x2='170' y2='80' stroke='#cbd5e1' stroke-width='5'/><line x1='173' y1='55' x2='235' y2='55' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='59' font-size='10' font-weight='bold' fill='#cbd5e1'>II (Oesophagus)</text><!-- Part III: Stomach (J-shaped pouch) --><path d='M 170 80 C 140 80 135 120 165 120 C 190 120 195 90 170 80 Z' fill='#881337' stroke='#f43f5e' stroke-width='2'/><line x1='185' y1='100' x2='240' y2='100' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='245' y='104' font-size='10' font-weight='bold' fill='#f43f5e'>III (Stomach)</text><!-- Part IV: Liver & Part V: Gallbladder --><path d='M 130 80 C 105 80 105 115 135 115 C 145 115 150 95 130 80 Z' fill='#991b1b' stroke='#dc2626' stroke-width='1.5'/><line x1='120' y1='90' x2='60' y2='90' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='94' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='end'>IV (Liver)</text><!-- Gallbladder V --><ellipse cx='138' cy='105' rx='4' ry='6' fill='#16a34a'/><line x1='134' y1='105' x2='60' y2='115' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='119' font-size='10' font-weight='bold' fill='#22c55e' text-anchor='end'>V (Gallbladder)</text><!-- Part VI: Pancreas (elongated gland below stomach) --><path d='M 160 122 Q 185 118 200 126' stroke='#eab308' stroke-width='4' stroke-linecap='round'/><line x1='200' y1='125' x2='245' y2='125' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='250' y='129' font-size='10' font-weight='bold' fill='#eab308'>VI (Pancreas)</text><!-- Part VIII: Large Intestine (Colon perimeter) --><path d='M 125 135 L 125 195 L 215 195 L 215 135 L 125 135' fill='none' stroke='#38bdf8' stroke-width='8'/><line x1='121' y1='165' x2='60' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='169' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='end'>VIII (Colon)</text><!-- Part VII: Small Intestine (Coiled central ileum) --><path d='M 140 150 Q 170 140 190 155 Q 150 175 180 185' fill='none' stroke='#fed7aa' stroke-width='4'/><line x1='170' y1='165' x2='235' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='169' font-size='10' font-weight='bold' fill='#fb923c'>VII (Ileum)</text><!-- Part IX: Rectum & Part X: Anus --><rect x='164' y='199' width='12' height='20' fill='#cbd5e1' stroke='#94a3b8'/><line x1='176' y1='205' x2='235' y2='205' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='209' font-size='10' font-weight='bold' fill='#cbd5e1'>IX (Rectum)</text><circle cx='170' cy='224' r='3' fill='#f43f5e'/><line x1='174' y1='224' x2='235' y2='224' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='228' font-size='10' font-weight='bold' fill='#f43f5e'>X (Anus)</text></svg></div>\n\n(i) Name each of the anatomical organs labelled I, II, III, and IV.\n\n(ii) State one vital digestive function performed by each of the organs labelled V and VI.\n\n(iii) Name the specific organ where the chemical digestion of dietary proteins initiates.\n\n(iv) Identify the anatomical part (using roman numerals I to X) where:\n  (α) Re-absorption of water from undigested food residue takes place;\n  (β) Final absorption of digested food end-products into the bloodstream occurs;\n  (γ) Final egestion of solid faecal waste takes place.",
          "workedSolution": "(i) Anatomical organs:\n• I: Salivary gland (or Pharynx)\n• II: Oesophagus (gullet)\n• III: Stomach\n• IV: Liver\n\n(ii) Functions of organs V and VI:\n• Part V (Gallbladder): Stores and concentrates bile secreted by the liver, and releases it into the duodenum to emulsify dietary fats.\n• Part VI (Pancreas): Secretes alkaline pancreatic juice containing digestive enzymes (pancreatic amylase, trypsin, and lipase) into the duodenum to digest carbohydrates, proteins, and fats.\n\n(iii) Initiation of protein digestion:\nPart III (The Stomach), through the action of pepsin in acidic gastric juice.\n\n(iv) Identification of functional sites:\n• (α) Water re-absorption: Part VIII (Large intestine / Colon)\n• (β) Absorption of digested end-products: Part VII (Small intestine / Ileum)\n• (γ) Egestion: Part X (Anus)",
          "maxMarks": 10,
          "marks": 10
        },
        {
          "subId": "(d)",
          "id": "q01_d",
          "prompt": "The diagram below illustrates a common agricultural hand tool used in farming:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Cutlass Blade and Handle --><g transform='translate(40, 45)'><!-- Wooden/Plastic Handle Grip --><rect x='10' y='20' width='45' height='16' rx='3' fill='#d97706' stroke='#b45309' stroke-width='1.5'/><circle cx='20' cy='28' r='2' fill='#0f172a'/><circle cx='45' cy='28' r='2' fill='#0f172a'/><text x='32' y='52' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>Handle</text><!-- Steel Blade: Straight spine, curved widened tip --><path d='M 55 20 L 230 15 Q 260 20 255 35 Q 240 45 200 40 L 55 36 Z' fill='#cbd5e1' stroke='#94a3b8' stroke-width='2'/><!-- Sharp cutting edge lower line --><path d='M 55 36 L 200 40 Q 240 45 255 35' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='150' y='58' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Cutting Edge</text></g><text x='170' y='122' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>GARDEN CUTLASS (MACHETE)</text></svg></div>\n\n(i) Identify the agricultural tool illustrated.\n\n(ii) State three practical agricultural operations performed on a farm using this tool.\n\n(iii) Mention three routine maintenance practices that should be carried out on this tool to prevent damage and extend its working lifespan.",
          "workedSolution": "(i) Tool identification:\nCutlass (or Machete).\n\n(ii) Agricultural operations:\n1. Slashing and clearing tall grasses, weeds, and secondary bush during land preparation.\n2. Cutting seed yams into setts and harvesting root/tuber crops (e.g., cassava, yams).\n3. Pruning overgrown vegetative shoots and trimming fencing hedges.\n4. Digging shallow planting holes and weeding between crop rows.\n\n(iii) Maintenance practices:\n1. Regularly sharpening the cutting blade on a whetstone or using a flat file to maintain a sharp edge.\n2. Washing and drying the blade thoroughly after field use to remove damp soil and sap.\n3. Applying oil or grease to the metallic blade before storage to prevent atmospheric rusting.\n4. Storing in a dry, secure tool rack or sheath away from rain and moisture.",
          "maxMarks": 10,
          "marks": 10
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q01_a",
          "prompt": "The diagram below is an illustration of an electrical circuit assembled in a physics laboratory:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 180' width='100%' height='165' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Top Wire with DC Cell E and Switch K --><line x1='40' y1='40' x2='120' y2='40' stroke='#38bdf8' stroke-width='2.5'/><!-- Cell E (Long thin positive plate, short thick negative plate) --><line x1='120' y1='24' x2='120' y2='56' stroke='#10b981' stroke-width='2.5'/><text x='112' y='20' font-size='11' font-weight='bold' fill='#10b981'>+</text><line x1='130' y1='32' x2='130' y2='48' stroke='#ef4444' stroke-width='4'/><text x='136' y='20' font-size='11' font-weight='bold' fill='#ef4444'>-</text><text x='125' y='14' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>E (Cell)</text><line x1='130' y1='40' x2='190' y2='40' stroke='#38bdf8' stroke-width='2.5'/><!-- Key / Switch K (Open position) --><circle cx='194' cy='40' r='3' fill='#e2e8f0'/><line x1='194' y1='40' x2='220' y2='28' stroke='#e2e8f0' stroke-width='2.5'/><circle cx='224' cy='40' r='3' fill='#e2e8f0'/><text x='210' y='20' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>K (Switch)</text><!-- Right Connecting Wire D --><line x1='224' y1='40' x2='290' y2='40' stroke='#38bdf8' stroke-width='2.5'/><line x1='290' y1='40' x2='290' y2='130' stroke='#38bdf8' stroke-width='2.5'/><line x1='290' y1='85' x2='325' y2='85' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='330' y='89' font-size='11' font-weight='bold' fill='#38bdf8'>D (Wire)</text><!-- Bottom Wire with Load Resistor P --><line x1='290' y1='130' x2='205' y2='130' stroke='#38bdf8' stroke-width='2.5'/><!-- Resistor P --><rect x='135' y='118' width='70' height='24' rx='3' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='170' y='134' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>P (Resistor)</text><line x1='135' y1='130' x2='40' y2='130' stroke='#38bdf8' stroke-width='2.5'/><!-- Left Wire Return --><line x1='40' y1='130' x2='40' y2='40' stroke='#38bdf8' stroke-width='2.5'/></svg></div>\n\n(i) What does the complete diagram represent?\n\n(ii) Identify the circuit components labelled D, E, K, and P.\n\n(iii) State one specific functional role performed by each of the parts labelled D, E, K, and P in the circuit.\n\n(iv) Mention the primary energy transformation that takes place within component E when switch K is closed.",
          "workedSolution": "(i) Representation:\nAn electric circuit (or a simple DC series electric circuit).\n\n(ii) Identification of components:\n• D: Connecting wire (conductor)\n• E: Electric cell (or direct-current chemical battery source)\n• K: Switch (or Key)\n• P: Resistor (or load resistance / electrical appliance)\n\n(iii) Functional roles:\n• Part D (Connecting wire): Conducts electric charge (electrons) with negligible resistance between circuit components.\n• Part E (Cell): Acts as a voltage source that maintains an electrical potential difference across the circuit.\n• Part K (Switch): Opens (breaks) or closes (completes) the circuit to control current flow.\n• Part P (Resistor): Opposes the flow of electric current and converts electrical energy into heat or other useful energy forms.\n\n(iv) Energy transformation in E:\nChemical potential energy is converted into electrical energy.",
          "maxMarks": 10,
          "marks": 10
        },
        {
          "subId": "(b)",
          "id": "q01_b",
          "prompt": "In a laboratory chemistry investigation, strips of red and blue litmus papers were dipped separately into three test tubes, each containing one of the test liquids listed below:\n\n| Test Substance | Red Litmus Paper | Blue Litmus Paper | Conclusion |\n| :--- | :--- | :--- | :--- |\n| **Lemon juice** | | | |\n| **Calcium hydroxide solution** | | | |\n| **Dilute hydrochloric acid** | | | |\n\n(i) Copy and complete the table by recording the expected observations and scientific conclusion for each test substance.\n\n(ii) Name the two test substances from the table that will react chemically with each other in a neutralization reaction to produce a neutral salt and water.\n\n(iii) Write down a balanced chemical equation for the neutralization reaction identified in (b)(ii).",
          "workedSolution": "(i) Completed Observation Table:\n\n| Test Substance | Red Litmus Paper | Blue Litmus Paper | Conclusion |\n| :--- | :--- | :--- | :--- |\n| **Lemon juice** | Remains red | Turns red | Acidic substance ($pH < 7$) |\n| **Calcium hydroxide solution** | Turns blue | Remains blue | Basic / Alkaline substance ($pH > 7$) |\n| **Dilute hydrochloric acid** | Remains red | Turns red | Acidic substance ($pH < 7$) |\n\n(ii) Neutralization reactants:\nCalcium hydroxide solution and Dilute hydrochloric acid.\n\n(iii) Balanced chemical equation:\n$$2\\text{HCl}_{(aq)} + \\text{Ca(OH)}_{2(aq)} \\to \\text{CaCl}_{2(aq)} + 2\\text{H}_2\\text{O}_{(l)}$$",
          "maxMarks": 10,
          "marks": 10
        },
        {
          "subId": "(c)",
          "id": "q01_c",
          "prompt": "The diagram below is an illustration of the human alimentary canal (digestive system):\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 260' width='100%' height='240' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Mouth and Part I: Salivary Glands / Pharynx --><circle cx='170' cy='30' r='5' fill='#f59e0b'/><line x1='175' y1='30' x2='235' y2='30' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='34' font-size='10' font-weight='bold' fill='#f59e0b'>I (Salivary Gland)</text><!-- Part II: Oesophagus (Gullet) --><line x1='170' y1='35' x2='170' y2='80' stroke='#cbd5e1' stroke-width='5'/><line x1='173' y1='55' x2='235' y2='55' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='59' font-size='10' font-weight='bold' fill='#cbd5e1'>II (Oesophagus)</text><!-- Part III: Stomach (J-shaped pouch) --><path d='M 170 80 C 140 80 135 120 165 120 C 190 120 195 90 170 80 Z' fill='#881337' stroke='#f43f5e' stroke-width='2'/><line x1='185' y1='100' x2='240' y2='100' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='245' y='104' font-size='10' font-weight='bold' fill='#f43f5e'>III (Stomach)</text><!-- Part IV: Liver & Part V: Gallbladder --><path d='M 130 80 C 105 80 105 115 135 115 C 145 115 150 95 130 80 Z' fill='#991b1b' stroke='#dc2626' stroke-width='1.5'/><line x1='120' y1='90' x2='60' y2='90' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='94' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='end'>IV (Liver)</text><!-- Gallbladder V --><ellipse cx='138' cy='105' rx='4' ry='6' fill='#16a34a'/><line x1='134' y1='105' x2='60' y2='115' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='119' font-size='10' font-weight='bold' fill='#22c55e' text-anchor='end'>V (Gallbladder)</text><!-- Part VI: Pancreas (elongated gland below stomach) --><path d='M 160 122 Q 185 118 200 126' stroke='#eab308' stroke-width='4' stroke-linecap='round'/><line x1='200' y1='125' x2='245' y2='125' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='250' y='129' font-size='10' font-weight='bold' fill='#eab308'>VI (Pancreas)</text><!-- Part VIII: Large Intestine (Colon perimeter) --><path d='M 125 135 L 125 195 L 215 195 L 215 135 L 125 135' fill='none' stroke='#38bdf8' stroke-width='8'/><line x1='121' y1='165' x2='60' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='169' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='end'>VIII (Colon)</text><!-- Part VII: Small Intestine (Coiled central ileum) --><path d='M 140 150 Q 170 140 190 155 Q 150 175 180 185' fill='none' stroke='#fed7aa' stroke-width='4'/><line x1='170' y1='165' x2='235' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='169' font-size='10' font-weight='bold' fill='#fb923c'>VII (Ileum)</text><!-- Part IX: Rectum & Part X: Anus --><rect x='164' y='199' width='12' height='20' fill='#cbd5e1' stroke='#94a3b8'/><line x1='176' y1='205' x2='235' y2='205' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='209' font-size='10' font-weight='bold' fill='#cbd5e1'>IX (Rectum)</text><circle cx='170' cy='224' r='3' fill='#f43f5e'/><line x1='174' y1='224' x2='235' y2='224' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='240' y='228' font-size='10' font-weight='bold' fill='#f43f5e'>X (Anus)</text></svg></div>\n\n(i) Name each of the anatomical organs labelled I, II, III, and IV.\n\n(ii) State one vital digestive function performed by each of the organs labelled V and VI.\n\n(iii) Name the specific organ where the chemical digestion of dietary proteins initiates.\n\n(iv) Identify the anatomical part (using roman numerals I to X) where:\n  (α) Re-absorption of water from undigested food residue takes place;\n  (β) Final absorption of digested food end-products into the bloodstream occurs;\n  (γ) Final egestion of solid faecal waste takes place.",
          "workedSolution": "(i) Anatomical organs:\n• I: Salivary gland (or Pharynx)\n• II: Oesophagus (gullet)\n• III: Stomach\n• IV: Liver\n\n(ii) Functions of organs V and VI:\n• Part V (Gallbladder): Stores and concentrates bile secreted by the liver, and releases it into the duodenum to emulsify dietary fats.\n• Part VI (Pancreas): Secretes alkaline pancreatic juice containing digestive enzymes (pancreatic amylase, trypsin, and lipase) into the duodenum to digest carbohydrates, proteins, and fats.\n\n(iii) Initiation of protein digestion:\nPart III (The Stomach), through the action of pepsin in acidic gastric juice.\n\n(iv) Identification of functional sites:\n• (α) Water re-absorption: Part VIII (Large intestine / Colon)\n• (β) Absorption of digested end-products: Part VII (Small intestine / Ileum)\n• (γ) Egestion: Part X (Anus)",
          "maxMarks": 10,
          "marks": 10
        },
        {
          "subId": "(d)",
          "id": "q01_d",
          "prompt": "The diagram below illustrates a common agricultural hand tool used in farming:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Cutlass Blade and Handle --><g transform='translate(40, 45)'><!-- Wooden/Plastic Handle Grip --><rect x='10' y='20' width='45' height='16' rx='3' fill='#d97706' stroke='#b45309' stroke-width='1.5'/><circle cx='20' cy='28' r='2' fill='#0f172a'/><circle cx='45' cy='28' r='2' fill='#0f172a'/><text x='32' y='52' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>Handle</text><!-- Steel Blade: Straight spine, curved widened tip --><path d='M 55 20 L 230 15 Q 260 20 255 35 Q 240 45 200 40 L 55 36 Z' fill='#cbd5e1' stroke='#94a3b8' stroke-width='2'/><!-- Sharp cutting edge lower line --><path d='M 55 36 L 200 40 Q 240 45 255 35' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='150' y='58' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Cutting Edge</text></g><text x='170' y='122' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>GARDEN CUTLASS (MACHETE)</text></svg></div>\n\n(i) Identify the agricultural tool illustrated.\n\n(ii) State three practical agricultural operations performed on a farm using this tool.\n\n(iii) Mention three routine maintenance practices that should be carried out on this tool to prevent damage and extend its working lifespan.",
          "workedSolution": "(i) Tool identification:\nCutlass (or Machete).\n\n(ii) Agricultural operations:\n1. Slashing and clearing tall grasses, weeds, and secondary bush during land preparation.\n2. Cutting seed yams into setts and harvesting root/tuber crops (e.g., cassava, yams).\n3. Pruning overgrown vegetative shoots and trimming fencing hedges.\n4. Digging shallow planting holes and weeding between crop rows.\n\n(iii) Maintenance practices:\n1. Regularly sharpening the cutting blade on a whetstone or using a flat file to maintain a sharp edge.\n2. Washing and drying the blade thoroughly after field use to remove damp soil and sap.\n3. Applying oil or grease to the metallic blade before storage to prevent atmospheric rusting.\n4. Storing in a dry, secure tool rack or sheath away from rain and moisture.",
          "maxMarks": 10,
          "marks": 10
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
          "prompt": "(i) What is a chemical neutralization reaction?\n(ii) Write a balanced chemical equation for the reaction between:\n  (α) Solid sodium metal and dilute hydrochloric acid;\n  (β) Aqueous sodium hydroxide and dilute hydrochloric acid.",
          "workedSolution": "(i) Definition of neutralization:\nA chemical reaction between an acid and a base (or alkali) that react together quantitatively to produce a salt and water as the only products.\n$$\\text{H}^+_{(aq)} + \\text{OH}^-_{(aq)} \\to \\text{H}_2\\text{O}_{(l)}$$\n\n(ii) Balanced chemical equations:\n• (α) Sodium metal and hydrochloric acid (single displacement redox reaction):\n$$2\\text{Na}_{(s)} + 2\\text{HCl}_{(aq)} \\to 2\\text{NaCl}_{(aq)} + \\text{H}_{2(g)}$$\n• (β) Sodium hydroxide and hydrochloric acid (neutralization reaction):\n$$\\text{NaOH}_{(aq)} + \\text{HCl}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(b)",
          "id": "q02_b",
          "prompt": "Explain the term weaning as practiced in domestic animal husbandry.",
          "workedSolution": "Weaning is the management practice of permanently separating young livestock (such as piglets, calves, lambs, or kids) from their mothers to terminate suckling of maternal milk, transitioning them onto solid forage and concentrate feed rations.",
          "maxMarks": 2,
          "marks": 2
        },
        {
          "subId": "(c)",
          "id": "q02_c",
          "prompt": "(i) What is the Milky Way in astronomy?\n(ii) State two practical uses of manufactured artificial satellites orbiting the Earth.",
          "workedSolution": "(i) Definition of Milky Way:\nThe barred spiral galaxy that contains our Solar System, consisting of hundreds of billions of stars, interstellar gas, and dust bound together by gravity, appearing as a hazy band of light across the night sky.\n\n(ii) Uses of artificial satellites:\n1. Global telecommunications and internet data relay.\n2. Weather observation and tropical cyclone forecasting.\n3. Global Positioning System (GPS) satellite navigation for aviation, shipping, and road transport.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(d)",
          "id": "q02_d",
          "prompt": "(i) What is an ecological habitat?\n(ii) Give two distinct biological examples of habitats.",
          "workedSolution": "(i) Definition of habitat:\nThe specific natural geographic locality or physical environment where an organism naturally lives, feeds, finds shelter, and reproduces successfully.\n\n(ii) Examples:\n1. Freshwater pond / river\n2. Tropical rainforest floor\n3. Estuarine mangrove swamp\n4. Savanna grassland",
          "maxMarks": 4,
          "marks": 4
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q02_a",
          "prompt": "(i) What is a chemical neutralization reaction?\n(ii) Write a balanced chemical equation for the reaction between:\n  (α) Solid sodium metal and dilute hydrochloric acid;\n  (β) Aqueous sodium hydroxide and dilute hydrochloric acid.",
          "workedSolution": "(i) Definition of neutralization:\nA chemical reaction between an acid and a base (or alkali) that react together quantitatively to produce a salt and water as the only products.\n$$\\text{H}^+_{(aq)} + \\text{OH}^-_{(aq)} \\to \\text{H}_2\\text{O}_{(l)}$$\n\n(ii) Balanced chemical equations:\n• (α) Sodium metal and hydrochloric acid (single displacement redox reaction):\n$$2\\text{Na}_{(s)} + 2\\text{HCl}_{(aq)} \\to 2\\text{NaCl}_{(aq)} + \\text{H}_{2(g)}$$\n• (β) Sodium hydroxide and hydrochloric acid (neutralization reaction):\n$$\\text{NaOH}_{(aq)} + \\text{HCl}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(b)",
          "id": "q02_b",
          "prompt": "Explain the term weaning as practiced in domestic animal husbandry.",
          "workedSolution": "Weaning is the management practice of permanently separating young livestock (such as piglets, calves, lambs, or kids) from their mothers to terminate suckling of maternal milk, transitioning them onto solid forage and concentrate feed rations.",
          "maxMarks": 2,
          "marks": 2
        },
        {
          "subId": "(c)",
          "id": "q02_c",
          "prompt": "(i) What is the Milky Way in astronomy?\n(ii) State two practical uses of manufactured artificial satellites orbiting the Earth.",
          "workedSolution": "(i) Definition of Milky Way:\nThe barred spiral galaxy that contains our Solar System, consisting of hundreds of billions of stars, interstellar gas, and dust bound together by gravity, appearing as a hazy band of light across the night sky.\n\n(ii) Uses of artificial satellites:\n1. Global telecommunications and internet data relay.\n2. Weather observation and tropical cyclone forecasting.\n3. Global Positioning System (GPS) satellite navigation for aviation, shipping, and road transport.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(d)",
          "id": "q02_d",
          "prompt": "(i) What is an ecological habitat?\n(ii) Give two distinct biological examples of habitats.",
          "workedSolution": "(i) Definition of habitat:\nThe specific natural geographic locality or physical environment where an organism naturally lives, feeds, finds shelter, and reproduces successfully.\n\n(ii) Examples:\n1. Freshwater pond / river\n2. Tropical rainforest floor\n3. Estuarine mangrove swamp\n4. Savanna grassland",
          "maxMarks": 4,
          "marks": 4
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
          "prompt": "(i) Define the physical quantity pressure.\n(ii) Using the principles of force and surface area, explain why it is essential to sharpen a kitchen knife before slicing meat.",
          "workedSolution": "(i) Definition of pressure:\nThe perpendicular (normal) force exerted per unit surface area ($P = \\frac{F}{A}$).\n\n(ii) Why sharpening is essential:\nPressure is inversely proportional to surface area for a given applied force. Sharpening a knife reduces the surface area of the cutting edge to an extremely fine line. Consequently, even a modest downward muscular force generates a very high cutting pressure that easily shears through tough muscle fibers and gristle.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(b)",
          "id": "q03_b",
          "prompt": "(i) State two physical differences between metals and non-metals.\n(ii) What is an alloy?\n(iii) Mention the primary constituent elements present in each of the following commercial alloys: (α) Carbon steel; (β) Brass.",
          "workedSolution": "(i) Differences:\n1. Conductivity: Metals are good conductors of heat and electricity due to free delocalized valence electrons, whereas non-metals are poor conductors (insulators, except graphite).\n2. Malleability and ductility: Metals can be hammered into thin sheets (malleable) and drawn into wires (ductile), whereas solid non-metals are brittle and fracture under impact.\n\n(ii) Definition of alloy:\nA homogeneous solid mixture composed of two or more metals, or a metal combined with a non-metal, melted together to enhance mechanical properties like hardness and corrosion resistance.\n\n(iii) Constituents:\n• (α) Carbon steel: Iron (Fe) and Carbon (C)\n• (β) Brass: Copper (Cu) and Zinc (Zn)",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(c)",
          "id": "q03_c",
          "prompt": "Mention three environmental and water quality conditions necessary for successfully rearing freshwater tilapia in a fishpond.",
          "workedSolution": "1. Adequate dissolved oxygen content in the pond water (maintained via aeration or flowing clean water).\n2. Optimum water temperature (ideally between $25^\\circ\\text{C}$ and $30^\\circ\\text{C}$).\n3. Neutral or slightly alkaline water pH (between $6.5$ and $8.5$).\n4. Absence of toxic agricultural chemical pollutants and excessive turbidity.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(d)",
          "id": "q03_d",
          "prompt": "Explain how the streamlined body shape of a bony fish enables it to live and move successfully in an aquatic habitat.",
          "workedSolution": "A streamlined (fusiform) body is pointed at the anterior head, broad in the middle, and tapers smoothly toward the posterior tail. This hydrodynamic contour minimizes water drag and turbulence, allowing the fish to cut through water with minimal resistance and energy expenditure.",
          "maxMarks": 2,
          "marks": 2
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q03_a",
          "prompt": "(i) Define the physical quantity pressure.\n(ii) Using the principles of force and surface area, explain why it is essential to sharpen a kitchen knife before slicing meat.",
          "workedSolution": "(i) Definition of pressure:\nThe perpendicular (normal) force exerted per unit surface area ($P = \\frac{F}{A}$).\n\n(ii) Why sharpening is essential:\nPressure is inversely proportional to surface area for a given applied force. Sharpening a knife reduces the surface area of the cutting edge to an extremely fine line. Consequently, even a modest downward muscular force generates a very high cutting pressure that easily shears through tough muscle fibers and gristle.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(b)",
          "id": "q03_b",
          "prompt": "(i) State two physical differences between metals and non-metals.\n(ii) What is an alloy?\n(iii) Mention the primary constituent elements present in each of the following commercial alloys: (α) Carbon steel; (β) Brass.",
          "workedSolution": "(i) Differences:\n1. Conductivity: Metals are good conductors of heat and electricity due to free delocalized valence electrons, whereas non-metals are poor conductors (insulators, except graphite).\n2. Malleability and ductility: Metals can be hammered into thin sheets (malleable) and drawn into wires (ductile), whereas solid non-metals are brittle and fracture under impact.\n\n(ii) Definition of alloy:\nA homogeneous solid mixture composed of two or more metals, or a metal combined with a non-metal, melted together to enhance mechanical properties like hardness and corrosion resistance.\n\n(iii) Constituents:\n• (α) Carbon steel: Iron (Fe) and Carbon (C)\n• (β) Brass: Copper (Cu) and Zinc (Zn)",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(c)",
          "id": "q03_c",
          "prompt": "Mention three environmental and water quality conditions necessary for successfully rearing freshwater tilapia in a fishpond.",
          "workedSolution": "1. Adequate dissolved oxygen content in the pond water (maintained via aeration or flowing clean water).\n2. Optimum water temperature (ideally between $25^\\circ\\text{C}$ and $30^\\circ\\text{C}$).\n3. Neutral or slightly alkaline water pH (between $6.5$ and $8.5$).\n4. Absence of toxic agricultural chemical pollutants and excessive turbidity.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(d)",
          "id": "q03_d",
          "prompt": "Explain how the streamlined body shape of a bony fish enables it to live and move successfully in an aquatic habitat.",
          "workedSolution": "A streamlined (fusiform) body is pointed at the anterior head, broad in the middle, and tapers smoothly toward the posterior tail. This hydrodynamic contour minimizes water drag and turbulence, allowing the fish to cut through water with minimal resistance and energy expenditure.",
          "maxMarks": 2,
          "marks": 2
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
          "prompt": "(i) What is an epidemiological disease vector?\n(ii) Mention two management methods used to control each of the following categories of farm animal pests: (α) Ectoparasites; (β) Endoparasites.",
          "workedSolution": "(i) Definition of disease vector:\nAn organism (frequently an arthropod such as an insect or tick) that carries and transmits infectious pathogens from an infected animal host to a healthy individual without necessarily suffering from the disease itself.\n\n(ii) Control methods:\n• (α) Ectoparasites (ticks, lice, mites):\n  1. Dipping livestock in chemical plunge baths containing acaricides.\n  2. Hand-picking large ticks or spraying animals with contact insecticides.\n• (β) Endoparasites (tapeworms, roundworms):\n  1. Routine oral drenching with liquid anthelmintic dewormers.\n  2. Practicing clean rotational grazing on uninfected pastures and proper sanitary disposal of manure.\n\n(iii) Examples of disease vectors:\nTsetse flies (nagana/trypanosomiasis), Ticks (heartwater/babesiosis), Mosquitoes (avian malaria).",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(b)",
          "id": "q04_b",
          "prompt": "(i) State two clinical symptoms of nitrogen deficiency in a tomato crop.\n(ii) Describe side-dressing as an agronomic method of chemical fertilizer application.",
          "workedSolution": "(i) Symptoms of nitrogen deficiency:\n1. Generalized chlorosis (stunted yellowing of older lower leaves due to impaired chlorophyll synthesis).\n2. Stunted, thin, spindly vegetative stem growth and poor fruit development.\n\n(ii) Description of side-dressing:\nAn agronomic method where chemical fertilizer is applied in shallow continuous bands or furrows placed along the sides of growing crop rows, spaced 5 to 10 cm away from the plant stems, and covered lightly with soil to prevent root scorching and volatilization.",
          "maxMarks": 5,
          "marks": 5
        },
        {
          "subId": "(c)",
          "id": "q04_c",
          "prompt": "(i) Define the physical quantity power in mechanics.\n(ii) State the standard S.I. unit of power.",
          "workedSolution": "(i) Definition of power:\nThe rate of performing mechanical work or the rate at which energy is transformed per unit time ($P = \\frac{W}{t}$).\n\n(ii) S.I. Unit:\nThe Watt (symbol: W), where $1\\text{ W} = 1\\text{ Joule per second } (\\text{J s}^{-1})$.",
          "maxMarks": 2,
          "marks": 2
        },
        {
          "subId": "(d)",
          "id": "q04_d",
          "prompt": "A neutral atom of sulfur has an atomic number of 16 ($Z = 16$). State its electron configuration across Bohr shells and draw its electron distribution diagram:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 180' width='100%' height='165' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Central Nucleus --><circle cx='140' cy='90' r='18' fill='#ef4444' stroke='#b91c1c' stroke-width='2'/><text x='140' y='94' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>16p, 16n</text><!-- Shell 1 (K): 2 electrons (r=35) --><circle cx='140' cy='90' r='35' fill='none' stroke='#64748b' stroke-width='1.2' stroke-dasharray='3,2'/><circle cx='140' cy='55' r='3' fill='#38bdf8'/><circle cx='140' cy='125' r='3' fill='#38bdf8'/><!-- Shell 2 (L): 8 electrons (r=55) --><circle cx='140' cy='90' r='55' fill='none' stroke='#64748b' stroke-width='1.2' stroke-dasharray='3,2'/><circle cx='140' cy='35' r='3' fill='#38bdf8'/><circle cx='140' cy='145' r='3' fill='#38bdf8'/><circle cx='85' cy='90' r='3' fill='#38bdf8'/><circle cx='195' cy='90' r='3' fill='#38bdf8'/><circle cx='101' cy='51' r='3' fill='#38bdf8'/><circle cx='179' cy='129' r='3' fill='#38bdf8'/><circle cx='101' cy='129' r='3' fill='#38bdf8'/><circle cx='179' cy='51' r='3' fill='#38bdf8'/><!-- Shell 3 (M): 6 valence electrons (r=75) --><circle cx='140' cy='90' r='75' fill='none' stroke='#f59e0b' stroke-width='1.5'/><circle cx='140' cy='15' r='3.5' fill='#f59e0b'/><circle cx='140' cy='165' r='3.5' fill='#f59e0b'/><circle cx='65' cy='90' r='3.5' fill='#f59e0b'/><circle cx='215' cy='90' r='3.5' fill='#f59e0b'/><circle cx='87' cy='37' r='3.5' fill='#f59e0b'/><circle cx='193' cy='143' r='3.5' fill='#f59e0b'/><text x='140' y='176' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>SULFUR (Z = 16): 2, 8, 6</text></svg></div>",
          "workedSolution": "Configuration:\nAtomic number $Z = 16 \\implies 16\\text{ electrons}$ in the neutral atom.\nFilling Bohr shells:\n• Shell 1 (K): 2 electrons\n• Shell 2 (L): 8 electrons\n• Shell 3 (M): 6 valence electrons\nConfiguration: $$2, 8, 6$$\n\nDiagram:\nThree concentric orbital shells centered on a nucleus containing 16 protons and 16 neutrons: 2 electrons in the innermost ring, 8 in the middle ring, and 6 in the outermost valence ring.",
          "maxMarks": 2,
          "marks": 2
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q04_a",
          "prompt": "(i) What is an epidemiological disease vector?\n(ii) Mention two management methods used to control each of the following categories of farm animal pests: (α) Ectoparasites; (β) Endoparasites.",
          "workedSolution": "(i) Definition of disease vector:\nAn organism (frequently an arthropod such as an insect or tick) that carries and transmits infectious pathogens from an infected animal host to a healthy individual without necessarily suffering from the disease itself.\n\n(ii) Control methods:\n• (α) Ectoparasites (ticks, lice, mites):\n  1. Dipping livestock in chemical plunge baths containing acaricides.\n  2. Hand-picking large ticks or spraying animals with contact insecticides.\n• (β) Endoparasites (tapeworms, roundworms):\n  1. Routine oral drenching with liquid anthelmintic dewormers.\n  2. Practicing clean rotational grazing on uninfected pastures and proper sanitary disposal of manure.\n\n(iii) Examples of disease vectors:\nTsetse flies (nagana/trypanosomiasis), Ticks (heartwater/babesiosis), Mosquitoes (avian malaria).",
          "maxMarks": 6,
          "marks": 6
        },
        {
          "subId": "(b)",
          "id": "q04_b",
          "prompt": "(i) State two clinical symptoms of nitrogen deficiency in a tomato crop.\n(ii) Describe side-dressing as an agronomic method of chemical fertilizer application.",
          "workedSolution": "(i) Symptoms of nitrogen deficiency:\n1. Generalized chlorosis (stunted yellowing of older lower leaves due to impaired chlorophyll synthesis).\n2. Stunted, thin, spindly vegetative stem growth and poor fruit development.\n\n(ii) Description of side-dressing:\nAn agronomic method where chemical fertilizer is applied in shallow continuous bands or furrows placed along the sides of growing crop rows, spaced 5 to 10 cm away from the plant stems, and covered lightly with soil to prevent root scorching and volatilization.",
          "maxMarks": 5,
          "marks": 5
        },
        {
          "subId": "(c)",
          "id": "q04_c",
          "prompt": "(i) Define the physical quantity power in mechanics.\n(ii) State the standard S.I. unit of power.",
          "workedSolution": "(i) Definition of power:\nThe rate of performing mechanical work or the rate at which energy is transformed per unit time ($P = \\frac{W}{t}$).\n\n(ii) S.I. Unit:\nThe Watt (symbol: W), where $1\\text{ W} = 1\\text{ Joule per second } (\\text{J s}^{-1})$.",
          "maxMarks": 2,
          "marks": 2
        },
        {
          "subId": "(d)",
          "id": "q04_d",
          "prompt": "A neutral atom of sulfur has an atomic number of 16 ($Z = 16$). State its electron configuration across Bohr shells and draw its electron distribution diagram:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 180' width='100%' height='165' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Central Nucleus --><circle cx='140' cy='90' r='18' fill='#ef4444' stroke='#b91c1c' stroke-width='2'/><text x='140' y='94' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>16p, 16n</text><!-- Shell 1 (K): 2 electrons (r=35) --><circle cx='140' cy='90' r='35' fill='none' stroke='#64748b' stroke-width='1.2' stroke-dasharray='3,2'/><circle cx='140' cy='55' r='3' fill='#38bdf8'/><circle cx='140' cy='125' r='3' fill='#38bdf8'/><!-- Shell 2 (L): 8 electrons (r=55) --><circle cx='140' cy='90' r='55' fill='none' stroke='#64748b' stroke-width='1.2' stroke-dasharray='3,2'/><circle cx='140' cy='35' r='3' fill='#38bdf8'/><circle cx='140' cy='145' r='3' fill='#38bdf8'/><circle cx='85' cy='90' r='3' fill='#38bdf8'/><circle cx='195' cy='90' r='3' fill='#38bdf8'/><circle cx='101' cy='51' r='3' fill='#38bdf8'/><circle cx='179' cy='129' r='3' fill='#38bdf8'/><circle cx='101' cy='129' r='3' fill='#38bdf8'/><circle cx='179' cy='51' r='3' fill='#38bdf8'/><!-- Shell 3 (M): 6 valence electrons (r=75) --><circle cx='140' cy='90' r='75' fill='none' stroke='#f59e0b' stroke-width='1.5'/><circle cx='140' cy='15' r='3.5' fill='#f59e0b'/><circle cx='140' cy='165' r='3.5' fill='#f59e0b'/><circle cx='65' cy='90' r='3.5' fill='#f59e0b'/><circle cx='215' cy='90' r='3.5' fill='#f59e0b'/><circle cx='87' cy='37' r='3.5' fill='#f59e0b'/><circle cx='193' cy='143' r='3.5' fill='#f59e0b'/><text x='140' y='176' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>SULFUR (Z = 16): 2, 8, 6</text></svg></div>",
          "workedSolution": "Configuration:\nAtomic number $Z = 16 \\implies 16\\text{ electrons}$ in the neutral atom.\nFilling Bohr shells:\n• Shell 1 (K): 2 electrons\n• Shell 2 (L): 8 electrons\n• Shell 3 (M): 6 valence electrons\nConfiguration: $$2, 8, 6$$\n\nDiagram:\nThree concentric orbital shells centered on a nucleus containing 16 protons and 16 neutrons: 2 electrons in the innermost ring, 8 in the middle ring, and 6 in the outermost valence ring.",
          "maxMarks": 2,
          "marks": 2
        }
      ]
    },
    {
      "id": "q05",
      "questionNumber": "5",
      "isPracticalSectionA": false,
      "subQuestions": [
        {
          "subId": "(a)",
          "id": "q05_a",
          "prompt": "(i) What is cellular respiration?\n(ii) Name the two physiological types of respiration that occur in human tissues.",
          "workedSolution": "(i) Definition of respiration:\nThe catabolic biochemical process taking place within living cells whereby organic food molecules (primarily glucose) are broken down enzymatically to release usable chemical energy in the form of ATP.\n\n(ii) Types of respiration:\n1. Aerobic respiration (requires molecular oxygen).\n2. Anaerobic respiration (occurs in the absence of oxygen, producing lactic acid in muscle tissue).",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(b)",
          "id": "q05_b",
          "prompt": "List three agricultural practices that maintain and enhance soil fertility on a crop farm.",
          "workedSolution": "1. Practicing systematic crop rotation incorporating leguminous crops to fix atmospheric nitrogen.\n2. Applying decomposed organic compost or farmyard manure to replenish soil humus and improve structure.\n3. Establishing green manure cover crops and applying organic mulch to protect topsoil from erosion and evaporation.\n4. Controlled application of balanced chemical fertilizers based on soil testing.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(c)",
          "id": "q05_c",
          "prompt": "(i) Write down the systematic IUPAC chemical name for: (α) $\\text{FeS}$; (β) $\\text{SO}_2$; (γ) $\\text{CO}_2$.\n(ii) Give one chemical reason why noble metals like copper, silver, and gold are widely preferred for manufacturing ornaments and fine jewelry.",
          "workedSolution": "(i) Systematic IUPAC names:\n• (α) $\\text{FeS}$: Iron (II) sulfide\n• (β) $\\text{SO}_2$: Sulfur dioxide (or Sulfur (IV) oxide)\n• (γ) $\\text{CO}_2$: Carbon dioxide (or Carbon (IV) oxide)\n\n(ii) Reason for jewelry use:\nThey are chemically unreactive and resist corrosion, meaning they do not oxidize or tarnish when exposed to atmospheric oxygen, moisture, or sweat, permanently retaining their lustrous shine.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(d)",
          "id": "q05_d",
          "prompt": "(i) What is an electrical fuse?\n(ii) Explain why an electrical fuse is an indispensable safety device in domestic circuits.",
          "workedSolution": "(i) Definition of fuse:\nAn electrical safety protective device containing a short length of metal wire with a low melting point that is connected in series with the live conductor.\n\n(ii) Why it is indispensable:\nIf an electrical fault, short-circuit, or severe current overload occurs, the excessive current heats the fuse wire past its melting point, causing it to melt (blow) and break the circuit. This disconnects current immediately, preventing appliance damage, cable melting, and household fires.",
          "maxMarks": 4,
          "marks": 4
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q05_a",
          "prompt": "(i) What is cellular respiration?\n(ii) Name the two physiological types of respiration that occur in human tissues.",
          "workedSolution": "(i) Definition of respiration:\nThe catabolic biochemical process taking place within living cells whereby organic food molecules (primarily glucose) are broken down enzymatically to release usable chemical energy in the form of ATP.\n\n(ii) Types of respiration:\n1. Aerobic respiration (requires molecular oxygen).\n2. Anaerobic respiration (occurs in the absence of oxygen, producing lactic acid in muscle tissue).",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(b)",
          "id": "q05_b",
          "prompt": "List three agricultural practices that maintain and enhance soil fertility on a crop farm.",
          "workedSolution": "1. Practicing systematic crop rotation incorporating leguminous crops to fix atmospheric nitrogen.\n2. Applying decomposed organic compost or farmyard manure to replenish soil humus and improve structure.\n3. Establishing green manure cover crops and applying organic mulch to protect topsoil from erosion and evaporation.\n4. Controlled application of balanced chemical fertilizers based on soil testing.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(c)",
          "id": "q05_c",
          "prompt": "(i) Write down the systematic IUPAC chemical name for: (α) $\\text{FeS}$; (β) $\\text{SO}_2$; (γ) $\\text{CO}_2$.\n(ii) Give one chemical reason why noble metals like copper, silver, and gold are widely preferred for manufacturing ornaments and fine jewelry.",
          "workedSolution": "(i) Systematic IUPAC names:\n• (α) $\\text{FeS}$: Iron (II) sulfide\n• (β) $\\text{SO}_2$: Sulfur dioxide (or Sulfur (IV) oxide)\n• (γ) $\\text{CO}_2$: Carbon dioxide (or Carbon (IV) oxide)\n\n(ii) Reason for jewelry use:\nThey are chemically unreactive and resist corrosion, meaning they do not oxidize or tarnish when exposed to atmospheric oxygen, moisture, or sweat, permanently retaining their lustrous shine.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(d)",
          "id": "q05_d",
          "prompt": "(i) What is an electrical fuse?\n(ii) Explain why an electrical fuse is an indispensable safety device in domestic circuits.",
          "workedSolution": "(i) Definition of fuse:\nAn electrical safety protective device containing a short length of metal wire with a low melting point that is connected in series with the live conductor.\n\n(ii) Why it is indispensable:\nIf an electrical fault, short-circuit, or severe current overload occurs, the excessive current heats the fuse wire past its melting point, causing it to melt (blow) and break the circuit. This disconnects current immediately, preventing appliance damage, cable melting, and household fires.",
          "maxMarks": 4,
          "marks": 4
        }
      ]
    },
    {
      "id": "q06",
      "questionNumber": "6",
      "isPracticalSectionA": false,
      "subQuestions": [
        {
          "subId": "(a)",
          "id": "q06_a",
          "prompt": "(i) What is the fundamental biological difference between a unicellular organism and a multicellular organism?\n(ii) State two dietary or nutritional reasons why vegetable crops are important to human health.",
          "workedSolution": "(i) Difference:\nA unicellular organism consists of a single solitary cell that carries out all metabolic and reproductive life functions independently (e.g., *Amoeba*, Bacterium), whereas a multicellular organism consists of many differentiated cells organized into specialized tissues, organs, and organ systems (e.g., humans, flowering plants).\n\n(ii) Importance of vegetables:\n1. Provides essential dietary vitamins (Vitamins A, C, K) and mineral salts (iron, calcium) that boost immune defense and prevent deficiency disorders.\n2. Supplies dietary fiber (roughage) that adds bulk to feces, stimulates intestinal peristalsis, and prevents constipation.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(b)",
          "id": "q06_b",
          "prompt": "(i) State two atmospheric physical elements of climate.\n(ii) In terms of timescale and geographical stability, distinguish between climate and weather.",
          "workedSolution": "(i) Elements of climate:\nAtmospheric temperature, rainfall (precipitation), atmospheric pressure, relative humidity, wind speed, and sunshine duration.\n\n(ii) Distinction:\n• Weather: The atmospheric condition of a specific locality recorded over a short period of time (hours or days), which fluctuates rapidly.\n• Climate: The average weather pattern and atmospheric behavior of a large geographical region recorded over a prolonged period of time (typically 30 to 35 years).",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(c)",
          "id": "q06_c",
          "prompt": "Mention three agronomic advantages of staking indeterminate vegetable crops (such as tomatoes and yams) in crop production.",
          "workedSolution": "1. Keeps heavy developing fruits and foliage elevated above damp soil, preventing fungal rotting and soil contamination.\n2. Exposes leaves to maximum solar radiation for efficient photosynthesis.\n3. Improves air circulation through the crop canopy, reducing humidity that encourages foliar blights.\n4. Makes weeding, chemical spraying, and harvesting operations easier.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(d)",
          "id": "q06_d",
          "prompt": "Explain each of the following physical and chemical processes:\n(i) Metallic corrosion;\n(ii) Sublimation.",
          "workedSolution": "(i) Corrosion:\nThe gradual chemical or electrochemical degradation and destruction of a refined metal into oxides, hydroxides, or sulfides through reaction with environmental agents (such as atmospheric oxygen, moisture, acids, or salts).\n\n(ii) Sublimation:\nThe endothermic physical phase transition in which a solid changes directly into a gas (vapor) upon heating without passing through an intermediate liquid phase (e.g., iodine crystals, ammonium chloride, camphor).",
          "maxMarks": 4,
          "marks": 4
        }
      ],
      "parts": [
        {
          "subId": "(a)",
          "id": "q06_a",
          "prompt": "(i) What is the fundamental biological difference between a unicellular organism and a multicellular organism?\n(ii) State two dietary or nutritional reasons why vegetable crops are important to human health.",
          "workedSolution": "(i) Difference:\nA unicellular organism consists of a single solitary cell that carries out all metabolic and reproductive life functions independently (e.g., *Amoeba*, Bacterium), whereas a multicellular organism consists of many differentiated cells organized into specialized tissues, organs, and organ systems (e.g., humans, flowering plants).\n\n(ii) Importance of vegetables:\n1. Provides essential dietary vitamins (Vitamins A, C, K) and mineral salts (iron, calcium) that boost immune defense and prevent deficiency disorders.\n2. Supplies dietary fiber (roughage) that adds bulk to feces, stimulates intestinal peristalsis, and prevents constipation.",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(b)",
          "id": "q06_b",
          "prompt": "(i) State two atmospheric physical elements of climate.\n(ii) In terms of timescale and geographical stability, distinguish between climate and weather.",
          "workedSolution": "(i) Elements of climate:\nAtmospheric temperature, rainfall (precipitation), atmospheric pressure, relative humidity, wind speed, and sunshine duration.\n\n(ii) Distinction:\n• Weather: The atmospheric condition of a specific locality recorded over a short period of time (hours or days), which fluctuates rapidly.\n• Climate: The average weather pattern and atmospheric behavior of a large geographical region recorded over a prolonged period of time (typically 30 to 35 years).",
          "maxMarks": 4,
          "marks": 4
        },
        {
          "subId": "(c)",
          "id": "q06_c",
          "prompt": "Mention three agronomic advantages of staking indeterminate vegetable crops (such as tomatoes and yams) in crop production.",
          "workedSolution": "1. Keeps heavy developing fruits and foliage elevated above damp soil, preventing fungal rotting and soil contamination.\n2. Exposes leaves to maximum solar radiation for efficient photosynthesis.\n3. Improves air circulation through the crop canopy, reducing humidity that encourages foliar blights.\n4. Makes weeding, chemical spraying, and harvesting operations easier.",
          "maxMarks": 3,
          "marks": 3
        },
        {
          "subId": "(d)",
          "id": "q06_d",
          "prompt": "Explain each of the following physical and chemical processes:\n(i) Metallic corrosion;\n(ii) Sublimation.",
          "workedSolution": "(i) Corrosion:\nThe gradual chemical or electrochemical degradation and destruction of a refined metal into oxides, hydroxides, or sulfides through reaction with environmental agents (such as atmospheric oxygen, moisture, acids, or salts).\n\n(ii) Sublimation:\nThe endothermic physical phase transition in which a solid changes directly into a gas (vapor) upon heating without passing through an intermediate liquid phase (e.g., iodine crystals, ammonium chloride, camphor).",
          "maxMarks": 4,
          "marks": 4
        }
      ]
    }
  ]
};


async function seedBece2010SciencePaper2Variant() {
  console.log('Seeding 2010 BECE Integrated Science Paper 2 Variant (Set 97) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2010_variant');

  await docRef.set({
    paper2: {
      id: "paper_2010_variant_p2",
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 from Section A (compulsory), and any three questions from Section B. All working must be clearly shown.",
      totalQuestions: 6,
      questions: SET_BECE_2010_SCIENCE_P2.questions
    },
    metadata: {
      paper2Calibrated: true,
      set97Verified: true,
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });
  console.log('✅ Ingested into past_papers/paper_2010_variant.');

  const topicDocRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2010_variant_p2');
  await topicDocRef.set({
    ...SET_BECE_2010_SCIENCE_P2,
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  }, { merge: true });
  console.log('✅ Ingested into topics/bece_past_papers/question_sets/paper_2010_variant_p2.');

  console.log('🌟 Successfully seeded Set 97 (2010 Science Paper 2 Variant) into Firestore.');
}

seedBece2010SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 97 Science Paper 2:', err);
    process.exit(1);
  });

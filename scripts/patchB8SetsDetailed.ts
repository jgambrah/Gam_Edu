/**
 * Script: Elevate Basic 8 Sets & Venn Diagrams with 5-Pillar Scaffolding
 * Path: scripts/patchB8SetsDetailed.ts
 * Target: global_curriculum/jhs/subjects/math/topics/topic_sets_and_venn_diagrams
 */

import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue, Firestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

let adminApp: App | null = null;
let db: Firestore | null = null;

try {
  if (!getApps().length) {
    if (clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } else if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      adminApp = initializeApp({ credential: cert(serviceAccountPath) });
    } else if (fs.existsSync(fallbackKeyPath)) {
      adminApp = initializeApp({ credential: cert(fallbackKeyPath) });
    } else {
      adminApp = initializeApp({ projectId });
    }
  }
  db = getFirestore();
} catch (error) {
  console.warn('[patchB8SetsDetailed] Firebase Admin initialization error:', error);
}

const b8NotesElevated = `### 1. The Two-Set Universe: Real-World Mental Model

Imagine a school sports coach surveying 60 students: 35 play football and 30 play volleyball. If you simply add $35 + 30 = 65$, the total exceeds the 60 students surveyed! 

Why? Because some students are counted twice—they play **both** sports. 

A two-set Venn diagram inside a Universal Set ($U$) organizes groups into **four mutually exclusive (non-overlapping) zones** so that no person or item is counted twice.

---

### 2. Deconstructing the 4 Disjoint Regions

Every standard two-set problem consists of four specific regions:

1. **Region 1: Only Set A ($A \\cap B'$):**
   * Members belonging strictly to $A$, excluding anyone who also touches $B$.
   * Formula: $$n(A \\text{ only}) = n(A) - n(A \\cap B)$$

2. **Region 2: Only Set B ($B \\cap A'$):**
   * Members belonging strictly to $B$, excluding anyone who also touches $A$.
   * Formula: $$n(B \\text{ only}) = n(B) - n(A \\cap B)$$

3. **Region 3: The Intersection ($A \\cap B$):**
   * Members shared simultaneously by both groups ($A$ AND $B$).
   * In algebra problems, this middle overlap is assigned variable $x$.

4. **Region 4: The Neither Zone ($(A \\cup B)'$):**
   * Members in the universal universe $U$ who belong to neither $A$ nor $B$.

---

### 3. The Master Partition Equation

Because the four regions do not overlap, their sum must equal the total Universal Set $n(U)$:\n
$$\\text{Total Universe } n(U) = n(A \\text{ only}) + n(A \\cap B) + n(B \\text{ only}) + n(A \\cup B)'$$

Substituting the algebraic terms:
$$n(U) = [n(A) - x] + x + [n(B) - x] + \\text{Neither}$$

Notice that $-x + x$ cancels out, giving the practical computational equation:
$$n(U) = n(A) + n(B) - x + \\text{Neither}$$

Where:
* $x = n(A \\cap B)$ (Both)
* If every member belongs to at least one group, then $\\text{Neither} = 0$.

---

### 4. Common Exam Traps & Pitfalls

> ⚠️ **TRAP 1: "Set A" vs. "Only Set A"**
> When a problem states *"50 farmers cultivate maize"*, $50$ belongs to the **entire circle of A**, NOT the outer crescent! You must subtract the middle intersection: $\\text{Maize only} = 50 - x$.

> ⚠️ **TRAP 2: Confusing $(A \\cup B)'$ with $A' \\cup B'$**
> * $(A \\cup B)'$ means **Neither** (outside both circles).
> * De Morgan's Law proves that $(A \\cup B)' = A' \\cap B'$.`;

const b8WorkedExamplesElevated = [
  {
    id: 'we_sets_b8_01',
    title: 'Two-Set Venn Agricultural Survey Modeling',
    problem: 'In a farming community of 80 farmers, 50 cultivate maize and 60 cultivate rice. Every farmer cultivates at least one of the two crops.\n(i) Illustrate the information on a Venn diagram.\n(ii) Find the number of farmers who cultivate both crops.\n(iii) Find the number of farmers who cultivate maize only.',
    steps: [
      'Step 1 (Why we do this: Define the universe and sets symbolically): Identify the given quantities: Total farmers $n(U) = 80$, Maize farmers $n(M) = 50$, and Rice farmers $n(R) = 60$.',
      "Step 2 (Why we do this: Assign an unknown to the intersection): The phrase 'both crops' represents $M \\cap R$. Let $n(M \\cap R) = x$.",
      "Step 3 (Why we do this: Account for the complement condition): The prompt states that *'Every farmer cultivates at least one of the two crops'*. This means nobody is outside both circles, so $\\text{Neither } n(M \\cup R)' = 0$.",
      'Step 4 (Why we do this: Express \'only\' regions in terms of x): \n  * Maize only $= n(M) - x = 50 - x$\n  * Rice only $= n(R) - x = 60 - x$',
      'Step 5 (Why we do this: Build the Master Partition Equation): The sum of all disjoint regions must equal the total universe:\n  $$(50 - x) + x + (60 - x) + 0 = 80$$',
      'Step 6 (Why we do this: Solve for the intersection x algebraically): Combine like terms: $110 - x = 80 \\implies x = 110 - 80 = 30$. Exactly 30 farmers grow both crops.',
      'Step 7 (Why we do this: Evaluate the specific sub-question): Substitute $x = 30$ to find maize only: $50 - x = 50 - 30 = 20\\text{ farmers}$.',
    ],
    finalAnswer: '$$\\text{Both crops } [n(M \\cap R)] = 30, \\quad \\text{Maize only} = 20$$',
  },
  {
    id: 'we_sets_b8_02',
    title: 'Venn Diagram with an External Neither Complement',
    problem: 'In a class of 45 students, 28 study French, 22 study Spanish, and 5 study neither language.\n(i) Calculate the number of students who study both French and Spanish.\n(ii) Calculate the number of students who study Spanish only.',
    steps: [
      'Step 1 (Why we do this: Isolate the total union population): The universal set is $n(U) = 45$. Because 5 students study neither, the active union of students studying languages is $n(F \\cup S) = n(U) - \\text{Neither} = 45 - 5 = 40$.',
      'Step 2 (Why we do this: Apply the fundamental addition theorem for two sets): Use $n(F \\cup S) = n(F) + n(S) - n(F \\cap S)$, letting $x = n(F \\cap S)$.',
      'Step 3 (Why we do this: Set up the equation with known values): \n  $$40 = 28 + 22 - x \\implies 40 = 50 - x$$',
      'Step 4 (Why we do this: Isolate x to find students studying both): \n  $$x = 50 - 40 = 10\\text{ students}$$',
      'Step 5 (Why we do this: Deduce the single-subject crescent): The prompt specifically asks for Spanish only ($S \\cap F\'). Subtract the middle overlap: $n(S \\text{ only}) = n(S) - x = 22 - 10 = 12\\text{ students}$.',
    ],
    finalAnswer: '$$\\text{Both languages } [n(F \\cap S)] = 10, \\quad \\text{Spanish only} = 12$$',
  },
  {
    id: 'we_sets_b8_03',
    title: 'Comparative Word Problem with Difference Conditions',
    problem: 'In a cohort of 80 students, 15 passed both Mathematics and French. Eleven (11) more students passed French than Mathematics. If each student passed in at least one subject, find the number of students who passed French.',
    steps: [
      'Step 1 (Why we do this: Translate verbal comparison into an algebraic variable): Let the number of students who passed Mathematics be $m$. Since 11 more passed French, the number of French students is $m + 11$.',
      'Step 2 (Why we do this: Identify known quantities): Total $n(U) = 80$, Both $n(M \\cap F) = 15$, and $\\text{Neither} = 0$.',
      'Step 3 (Why we do this: Set up the union formula): \n  $$n(M \\cup F) = n(M) + n(F) - n(M \\cap F)$$\n  $$80 = m + (m + 11) - 15$$',
      'Step 4 (Why we do this: Solve for the base variable m): \n  $$80 = 2m - 4 \\implies 2m = 84 \\implies m = 42\\text{ (Math passed)}$$',
      'Step 5 (Why we do this: Answer the specific question asked): Calculate French passers: $n(F) = m + 11 = 42 + 11 = 53\\text{ students}$.',
    ],
    finalAnswer: '$$\\text{Passed French } [n(F)] = 53$$',
  },
];

async function patch() {
  if (!db) {
    throw new Error('Firestore database instance could not be initialized.');
  }

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_sets_and_venn_diagrams');
  
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new Error('Document topic_sets_and_venn_diagrams not found.');
  }

  const data = snap.data();
  const existingB8 = data?.levels?.b8 || data?.levels?.jhs2 || {};
  const existingPracticePool = existingB8.practicePool || {};
  const existingDiagramSvg = existingB8.diagramSvg || "<svg viewBox='0 0 380 220' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><rect width='370' height='210' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U</text><circle cx='140' cy='115' r='68' fill='#dbeafe' fill-opacity='0.45' stroke='#2563eb' stroke-width='2'/><circle cx='235' cy='115' r='68' fill='#dcfce7' fill-opacity='0.45' stroke='#16a34a' stroke-width='2'/><text x='105' y='42' font-size='12' font-weight='bold' fill='#2563eb'>Set A</text><text x='245' y='42' font-size='12' font-weight='bold' fill='#16a34a'>Set B</text><text x='100' y='120' font-size='12' fill='#1e293b'>Only A</text><text x='180' y='120' font-size='12' font-weight='bold' fill='#dc2626'>A ∩ B</text><text x='245' y='120' font-size='12' fill='#1e293b'>Only B</text><text x='25' y='190' font-size='11' fill='#64748b'>(A ∪ B)'</text></svg>";

  const updatedB8 = {
    ...existingB8,
    diagramSvg: existingDiagramSvg,
    notes: b8NotesElevated,
    workedExamples: b8WorkedExamplesElevated,
    practicePool: existingPracticePool,
  };

  await docRef.update({
    'levels.b8': updatedB8,
    'levels.jhs2': updatedB8,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log('✅ Successfully updated levels.b8 and levels.jhs2 with 5-Pillar self-teaching scaffolding.');

  // Synchronize local JSON payloads
  ['payloads/topic_sets_and_venn_diagrams.json', 'payloads/topics/topic_sets_and_venn_diagrams.json'].forEach((relPath) => {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const payload = JSON.parse(raw);
      if (payload.levels?.b8) {
        payload.levels.b8.notes = b8NotesElevated;
        payload.levels.b8.workedExamples = b8WorkedExamplesElevated;
        payload.levels.b8.diagramSvg = existingDiagramSvg;
      }
      if (payload.levels?.jhs2) {
        payload.levels.jhs2.notes = b8NotesElevated;
        payload.levels.jhs2.workedExamples = b8WorkedExamplesElevated;
        payload.levels.jhs2.diagramSvg = existingDiagramSvg;
      }
      fs.writeFileSync(fullPath, JSON.stringify(payload, null, 2), 'utf-8');
      console.log(`✅ Synchronized ${relPath}`);
    }
  });
}

patch()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Patch error:', err);
    process.exit(1);
  });

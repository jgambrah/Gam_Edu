/**
 * Script: Elevate Basic 9 Sets & Venn Diagrams with 5-Pillar Scaffolding
 * Path: scripts/patchB9SetsDetailed.ts
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
  console.warn('[patchB9SetsDetailed] Firebase Admin initialization error:', error);
}

const b9NotesElevated = `### 1. The Real Number Continuum ($\\mathbb{R}$): The Big Picture

Every number encountered at the Basic School level lives somewhere within the **Real Number Continuum ($\\mathbb{R}$)**. Set theory provides the logical map that organizes these numbers into concentric subsets:

$$\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$$

* **Natural Numbers ($\\mathbb{N}$):** The positive counting integers:
  $$\\mathbb{N} = \\{1, 2, 3, 4, 5, \\dots\\}$$
* **Whole Numbers ($\\mathbb{W}$):** Natural numbers united with zero:
  $$\\mathbb{W} = \\{0, 1, 2, 3, 4, \\dots\\}$$
* **Integers ($\\mathbb{Z}$):** Whole numbers and their negative opposites:
  $$\\mathbb{Z} = \\{\\dots, -3, -2, -1, 0, 1, 2, 3, \\dots\\}$$
* **Rational Numbers ($\\mathbb{Q}$):** Any number that can be expressed as a ratio of two integers $\\frac{a}{b}$, where $a, b \\in \\mathbb{Z}$ and $b \\ne 0$. This includes terminating decimals ($0.75 = \\frac{3}{4}$) and repeating decimals ($0.\\bar{3} = \\frac{1}{3}$).
* **Irrational Numbers ($\\mathbb{Q}'$):** Numbers that CANNOT be expressed as a ratio of integers. Their decimal representations are non-terminating and non-repeating (e.g., $\\sqrt{2}, \\sqrt{3}, \\sqrt{5}, \\pi$).
* **The Real Number Set ($\\mathbb{R}$):** The complete union of rational and irrational numbers:
  $$\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{Q}', \\quad \\text{where } \\mathbb{Q} \\cap \\mathbb{Q}' = \\emptyset$$

---

### 2. Multi-Variable 2-Set Venn Modeling

In Basic 9, questions often introduce relational statements between regions (such as *"Region A is twice Region B"* or *"3 more than the intersection"*). 

To solve these without confusion, assign a variable to the independent unknown region, express all other regions in terms of that variable, and set their total sum equal to $n(U)$:
$$\\text{Only } A + \\text{Both } (A \\cap B) + \\text{Only } B + \\text{Neither } (A \\cup B)' = n(U)$$

---

### 3. Introductory 3-Set Venn Partitions (The 8 Regions)

When three sets ($A$, $B$, and $C$) interact inside a universal space $U$, the plane is partitioned into **8 disjoint non-overlapping zones**:
1. Only $A$, Only $B$, Only $C$ (3 regions)
2. Exactly two sets: $(A \\cap B \\text{ only})$, $(B \\cap C \\text{ only})$, $(A \\cap C \\text{ only})$ (3 regions)
3. All three sets: $(A \\cap B \\cap C)$ (the central overlap) (1 region)
4. None of the three: $(A \\cup B \\cup C)'$ (the outside region) (1 region)

**The Inclusion-Exclusion Principle for 3 Sets:**
$$n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - n(A \\cap B) - n(A \\cap C) - n(B \\cap C) + n(A \\cap B \\cap C)$$

> 💡 **Why we add back the center ($A \\cap B \\cap C$):**
> When you subtract the three pairwise intersections ($A \\cap B, A \\cap C, B \\cap C$), the central overlap where all three sets meet gets subtracted three times! Adding it back once restores exact mathematical balance.`;

const b9WorkedExamplesElevated = [
  {
    id: 'we_sets_b9_01',
    title: 'Real Number Hierarchy Classification',
    problem: 'Given the set of real numbers:\n$$S = \\left\\{ -5, \\, 0, \\, \\frac{3}{8}, \\, \\sqrt{7}, \\, 11, \\, -0.45, \\, \\sqrt{25}, \\, \\pi \\right\\}$$\nClassify and group the elements into:\n(i) Natural numbers ($\\mathbb{N}$)\n(ii) Integers ($\\mathbb{Z}$)\n(iii) Rational numbers ($\\mathbb{Q}$)\n(iv) Irrational numbers ($\\mathbb{Q}\'$)',
    steps: [
      'Step 1 (Why we do this: Simplify radicals first before evaluating): Inspect and evaluate all root terms: $\\sqrt{25} = 5$ (an integer). However, $\\sqrt{7}$ cannot be simplified to an integer root (it remains a surd).',
      'Step 2 (Why we do this: Filter Natural Numbers N): Natural numbers are strictly positive non-zero counting numbers: $11$ and $\\sqrt{25}$ (which equals 5). Thus, $\\mathbb{N} = \\{11, \\sqrt{25}\\}$.',
      'Step 3 (Why we do this: Filter Integers Z): Integers contain all natural numbers, their negative opposites, and zero: $\\{-5, 0, 11, \\sqrt{25}\\}$.',
      'Step 4 (Why we do this: Filter Rational Numbers Q): Any value expressible as a fraction of integers or terminating/repeating decimal belongs to $\\mathbb{Q}$. Include all integers, plus fractions and terminating decimals: $\\{-5, 0, \\frac{3}{8}, 11, -0.45, \\sqrt{25}\\}$.',
      'Step 5 (Why we do this: Filter Irrational Numbers Q\'): Elements that cannot be written as a fraction of integers: $\\sqrt{7}$ and $\\pi$.',
    ],
    finalAnswer: '$$\\mathbb{N} = \\{11, \\sqrt{25}\\}, \\ \\mathbb{Z} = \\{-5, 0, 11, \\sqrt{25}\\}, \\ \\mathbb{Q} = \\left\\{-5, 0, \\frac{3}{8}, 11, -0.45, \\sqrt{25}\\right\\}, \\ \\mathbb{Q}\' = \\{\\sqrt{7}, \\pi\\}$$',
  },
  {
    id: 'we_sets_b9_02',
    title: 'Multi-Variable Relative 2-Set Word Problem',
    problem: 'In a cohort of 100 junior high school candidates, 60 registered for General Science ($S$) and 50 registered for Business Studies ($B$). The number of candidates who registered for Business only is twice the number of candidates who registered for neither subject. Each candidate belongs to the universal set. Find:\n(i) The number of candidates who registered for neither subject.\n(ii) The number of candidates who registered for both subjects.\n(iii) The number of candidates who registered for General Science only.',
    steps: [
      "Step 1 (Why we do this: Identify the independent baseline variable): The problem links 'Business only' directly to 'Neither'. Let the number of candidates taking neither subject be $y$. Then, $\\text{Neither } [n(S \\cup B)'] = y$.",
      "Step 2 (Why we do this: Express related regions using the variable y): \n  * Business only $= 2y$\n  * Since total Business $n(B) = 50$, the overlap 'Both' is: $\\text{Both } [n(S \\cap B)] = 50 - 2y$\n  * Science only $= n(S) - \\text{Both} = 60 - (50 - 2y) = 10 + 2y$",
      'Step 3 (Why we do this: Form the Master Partition Equation): Sum all 4 disjoint regions to match the universal cohort of 100:\n  $$(10 + 2y) + (50 - 2y) + 2y + y = 100$$',
      'Step 4 (Why we do this: Solve for y algebraically):\n  $$60 + 2y = 100 \\implies 2y = 100 - 60 = 40 \\implies y = 20$$',
      'Step 5 (Why we do this: Substitute y = 20 to determine each specific requested quantity):\n  * (i) Neither $= y = 20$\n  * (ii) Both $= 50 - 2(20) = 50 - 40 = 10$\n  * (iii) Science only $= 10 + 2(20) = 10 + 40 = 50$',
      'Step 6 (Why we do this: Complete audit check): $\\text{Science only (50)} + \\text{Both (10)} + \\text{Business only (20)} + \\text{Neither (20)} = 100$. Data is verified.',
    ],
    finalAnswer: '$$\\text{Neither} = 20, \\quad \\text{Both } [n(S \\cap B)] = 10, \\quad \\text{Science only} = 50$$',
  },
  {
    id: 'we_sets_b9_03',
    title: 'Introductory 3-Set Venn Inclusion-Exclusion Verification',
    problem: 'In a school club of 75 learners, every learner participates in at least one of three sports: Athletics ($A$), Basketball ($B$), or Cricket ($C$). The memberships are:\n* $n(A) = 40, \\ n(B) = 35, \\ n(C) = 30$\n* Pairwise overlaps: $n(A \\cap B) = 15, \\ n(B \\cap C) = 12, \\ n(A \\cap C) = 10$\n* All three sports: $n(A \\cap B \\cap C) = 5$\nCalculate how many learners participate in at least one sport and verify whether any learner was omitted.',
    steps: [
      'Step 1 (Why we do this: Identify the appropriate theorem): For 3 intersecting sets, use the Inclusion-Exclusion formula: $n(A \\cup B \\cup C) = \\sum n(\\text{single}) - \\sum n(\\text{pairs}) + n(\\text{all three})$.',
      'Step 2 (Why we do this: Sum individual memberships): \n  $$n(A) + n(B) + n(C) = 40 + 35 + 30 = 105$$',
      'Step 3 (Why we do this: Subtract pairwise duplicate counts): \n  $$n(A \\cap B) + n(B \\cap C) + n(A \\cap C) = 15 + 12 + 10 = 37$$\n  $$105 - 37 = 68$$',
      'Step 4 (Why we do this: Add back the central triple intersection): \n  $$n(A \\cup B \\cup C) = 68 + n(A \\cap B \\cap C) = 68 + 5 = 73$$',
      'Step 5 (Why we do this: Compare with total club enrollment): Total club enrollment is 75, but the union of sports participants is 73. Therefore, $75 - 73 = 2$ learners participate in none of the three sports.',
    ],
    finalAnswer: '$$n(A \\cup B \\cup C) = 73 \\text{ active participants}, \\quad 2 \\text{ learners participate in none}$$',
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
  const existingB9 = data?.levels?.b9 || data?.levels?.jhs3 || {};
  const existingPracticePool = existingB9.practicePool || {};

  const updatedB9 = {
    ...existingB9,
    notes: b9NotesElevated,
    workedExamples: b9WorkedExamplesElevated,
    practicePool: existingPracticePool,
  };

  await docRef.update({
    'levels.b9': updatedB9,
    'levels.jhs3': updatedB9,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log('✅ Successfully updated levels.b9 and levels.jhs3 with 5-Pillar self-teaching scaffolding.');

  // Synchronize local JSON payloads
  ['payloads/topic_sets_and_venn_diagrams.json', 'payloads/topics/topic_sets_and_venn_diagrams.json'].forEach((relPath) => {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const payload = JSON.parse(raw);
      if (payload.levels?.b9) {
        payload.levels.b9.notes = b9NotesElevated;
        payload.levels.b9.workedExamples = b9WorkedExamplesElevated;
      }
      if (payload.levels?.jhs3) {
        payload.levels.jhs3.notes = b9NotesElevated;
        payload.levels.jhs3.workedExamples = b9WorkedExamplesElevated;
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

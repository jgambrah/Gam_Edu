/**
 * Script: Update Basic 9 Numbers & Numeration with Interactive Markdown & Deep Pedagogical Scaffolding
 * Path: scripts/patchB9NumbersInteractive.ts
 * Target: global_curriculum/jhs/subjects/math/topics/topic_numbers_and_numeration
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
  console.warn('[patchB9NumbersInteractive] Firebase Admin initialization error:', error);
}

const b9InteractiveNotes = `### 1. The Real Number System ($\\mathbb{R}$) & Continuum Hierarchy

Every number at the junior secondary level belongs to the **Real Number System ($\\mathbb{R}$)**. It is divided into two mutually exclusive, disjoint domains: **Rational Numbers ($\\mathbb{Q}$)** and **Irrational Numbers ($\\mathbb{Q}'$):**

$$\\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{Q}', \\quad \\text{where } \\mathbb{Q} \\cap \\mathbb{Q}' = \\emptyset$$

$$\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$$

* **Natural Numbers ($\\mathbb{N}$):** $\\{1, 2, 3, 4, 5, \\dots\\}$
* **Whole Numbers ($\\mathbb{W}$):** $\\{0, 1, 2, 3, 4, \\dots\\}$
* **Integers ($\\mathbb{Z}$):** $\\{\\dots, -3, -2, -1, 0, 1, 2, 3, \\dots\\}$
* **Rational Numbers ($\\mathbb{Q}$):** Numbers expressible in the form $\\frac{a}{b}$ where $a, b \\in \\mathbb{Z}$ and $b \\ne 0$. Includes all terminating decimals (e.g., $0.35 = \\frac{7}{20}$) and recurring decimals (e.g., $0.\\dot{6} = \\frac{2}{3}$).
* **Irrational Numbers ($\\mathbb{Q}'$):** Non-terminating, non-repeating decimals that cannot be written as a ratio of two integers (e.g., $\\sqrt{2}, \\sqrt{3}, \\sqrt{5}, \\pi$).

<details>
<summary>🔍 <b>Self-Check Challenge: Rational vs. Irrational</b> (Click to test yourself)</summary>

> **Question:** Is $\\sqrt{\\frac{49}{4}}$ rational or irrational? What about $\\sqrt{8}$?
>
> **Explanation:**
> * $\\sqrt{\\frac{49}{4}} = \\frac{\\sqrt{49}}{\\sqrt{4}} = \\frac{7}{2}$ (a ratio of two integers), so it is **Rational ($\\mathbb{Q}$)**.
> * $\\sqrt{8} = \\sqrt{4 \\times 2} = 2\\sqrt{2}$. Since $\\sqrt{2}$ is non-terminating and non-repeating, $2\\sqrt{2}$ is **Irrational ($\\mathbb{Q}'$)**.
</details>

---

### 2. Definition & Axioms of Surds

A **surd** is an irrational root of a rational number. When a radical $\\sqrt[n]{x}$ cannot be evaluated to an exact integer or simple fraction, it remains in radical surd form.

* **Radical Identities (The Rules of Surds):**
  1. **Product Rule:** $\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b}$
  2. **Quotient Rule:** $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$ ($b \\ne 0$)
  3. **Square of a Root:** $(\\sqrt{a})^2 = \\sqrt{a} \\times \\sqrt{a} = a$
  4. **Linear Combinations (Like Surds):** $m\\sqrt{k} \\pm n\\sqrt{k} = (m \\pm n)\\sqrt{k}$

<details>
<summary>⚠️ <b>Critical Exam Warning: Addition Under the Radical</b> (Click to inspect)</summary>

> * **Never split addition or subtraction across radicals!**
>   $$\\sqrt{a + b} \\ne \\sqrt{a} + \\sqrt{b}$$
> * Counter-example:
>   $$\\sqrt{9 + 16} = \\sqrt{25} = 5$$
>   $$\\sqrt{9} + \\sqrt{16} = 3 + 4 = 7 \\quad (5 \\ne 7)$$
</details>

---

### 3. Simplifying Surds to Basic Form ($k\\sqrt{a}$)

A surd is in its **simplest form** when the radicand (the number under the radical) contains no factor that is a perfect square:
1. Find the largest perfect square factor ($4, 9, 16, 25, 36, 49, 64, 81, 100, \\dots$) dividing the radicand.
2. Factor the radical using the Product Rule.
3. Extract the root of the perfect square to the outside coefficient.

*Example:* $\\sqrt{72} = \\sqrt{36 \\times 2} = \\sqrt{36} \\times \\sqrt{2} = 6\\sqrt{2}$.

---

### 4. Rationalizing Monomial Denominators

In mathematics, an irrational surd must not be left in the denominator of a fraction. **Rationalization** converts the denominator into a rational integer without changing the value of the expression:

$$\\frac{a}{\\sqrt{b}} = \\frac{a}{\\sqrt{b}} \\times \\frac{\\sqrt{b}}{\\sqrt{b}} = \\frac{a\\sqrt{b}}{(\\sqrt{b})^2} = \\frac{a\\sqrt{b}}{b}$$

---

### 5. Approximating Non-Perfect Squares without Calculators

To estimate $\\sqrt{n}$ where $n$ is not a perfect square:
1. Bound $n$ between two consecutive perfect squares: $a^2 < n < b^2$.
2. Identify the closest integer root.
3. Apply linear interpolation: $\\sqrt{n} \\approx a + \\frac{n - a^2}{b^2 - a^2}$.

*Example for $\\sqrt{10}$:* $3^2 < 10 < 4^2 \\implies 9 < 10 < 16$. Thus, $\\sqrt{10} \\approx 3 + \\frac{10 - 9}{16 - 9} = 3 + \\frac{1}{7} \\approx 3.14$.`;

const b9InteractiveWorkedExamples = [
  {
    id: 'we_num_j3_01',
    title: 'Simplification & Arithmetic of Compound Surds',
    problem: 'Simplify completely without using tables or calculators:\n$$\\sqrt{75} - 2\\sqrt{48} + \\sqrt{108}$$',
    steps: [
      'Step 1 (Why we do this: Identify the largest perfect square factor in each radicand): Deconstruct each number into a product containing a square factor: $75 = 25 \\times 3$, $48 = 16 \\times 3$, and $108 = 36 \\times 3$.',
      'Step 2 (Why we do this: Apply the product identity to extract integer roots): \n  * $\\sqrt{75} = \\sqrt{25 \\times 3} = 5\\sqrt{3}$\n  * $2\\sqrt{48} = 2\\sqrt{16 \\times 3} = 2(4\\sqrt{3}) = 8\\sqrt{3}$\n  * $\\sqrt{108} = \\sqrt{36 \\times 3} = 6\\sqrt{3}$',
      'Step 3 (Why we do this: Collect and combine like radical terms): All three terms share the common like radicand $\\sqrt{3}$. Combine the rational coefficients:\n  $$(5 - 8 + 6)\\sqrt{3} = 3\\sqrt{3}$$',
    ],
    finalAnswer: '$$3\\sqrt{3}$$',
  },
  {
    id: 'we_num_j3_02',
    title: 'Rationalizing a Monomial Surd Denominator',
    problem: 'Simplify the expression by rationalizing the denominator:\n$$\\frac{15}{\\sqrt{5}}$$',
    steps: [
      'Step 1 (Why we do this: Eliminate the irrational radical from the denominator): Multiply numerator and denominator by $\\frac{\\sqrt{5}}{\\sqrt{5}}$, which is equivalent to multiplying by 1.',
      'Step 2 (Why we do this: Evaluate the product of radicals): \n  $$\\frac{15}{\\sqrt{5}} \\times \\frac{\\sqrt{5}}{\\sqrt{5}} = \\frac{15\\sqrt{5}}{(\\sqrt{5})^2} = \\frac{15\\sqrt{5}}{5}$$',
      'Step 3 (Why we do this: Reduce rational integers to simplest terms): Divide the whole-number coefficient: $\\frac{15}{5} = 3$.',
    ],
    finalAnswer: '$$3\\sqrt{5}$$',
  },
  {
    id: 'we_num_j3_03',
    title: 'Rationalizing Denominators with Compound Fractions',
    problem: 'Evaluate and simplify:\n$$\\frac{\\sqrt{18} + \\sqrt{32}}{\\sqrt{2}}$$',
    steps: [
      'Step 1 (Why we do this: Method 1 - Simplify each numerator radical first): \n  * $\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}$\n  * $\\sqrt{32} = \\sqrt{16 \\times 2} = 4\\sqrt{2}$',
      'Step 2 (Why we do this: Combine like surds in the numerator): \n  $$3\\sqrt{2} + 4\\sqrt{2} = 7\\sqrt{2}$$',
      'Step 3 (Why we do this: Cancel common radical factors): \n  $$\\frac{7\\sqrt{2}}{\\sqrt{2}} = 7$$',
      'Step 4 (Alternative Method - Distribute the denominator using the quotient rule): \n  $$\\frac{\\sqrt{18}}{\\sqrt{2}} + \\frac{\\sqrt{32}}{\\sqrt{2}} = \\sqrt{\\frac{18}{2}} + \\sqrt{\\frac{32}{2}} = \\sqrt{9} + \\sqrt{16} = 3 + 4 = 7$$',
    ],
    finalAnswer: '$$7$$',
  },
  {
    id: 'we_num_j3_04',
    title: 'Multi-Step Place-Value Arithmetic Problem',
    problem: 'A 6-digit number has the following properties:\n* First digit is 5 more than the last digit.\n* First digit is 2 less than the second digit.\n* Second digit is the third multiple of 3.\n* Fourth digit is the second multiple of 3.\n* Third digit is the quotient of the fourth digit divided by the last digit.\n* Fourth and fifth digits are consecutive descending numbers.\nDetermine the number and express it in scientific standard form.',
    steps: [
      'Step 1 (Why we do this: Identify explicit anchor values): \n  * Second digit $= 3 \\times 3 = 9$\n  * Fourth digit $= 2 \\times 3 = 6$',
      'Step 2 (Why we do this: Determine related dependent digits): \n  * First digit $= 9 - 2 = 7$\n  * Last (6th) digit: Since first digit is 5 more than last, last digit $= 7 - 5 = 2$',
      'Step 3 (Why we do this: Determine remaining intermediate positions): \n  * Fifth digit is consecutive descending from fourth: $6 - 1 = 5$\n  * Third digit is the quotient of fourth $\\div$ last: $6 \\div 2 = 3$',
      'Step 4 (Why we do this: Assemble and convert to standard form): The digits are $7, 9, 3, 6, 5, 2$.\n  $$\\text{Number} = 793,652 = 7.93652 \\times 10^5$$',
    ],
    finalAnswer: '$$793,652 = 7.93652 \\times 10^5$$',
  },
];

async function patch() {
  if (!db) {
    throw new Error('Firestore database instance could not be initialized.');
  }

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_numbers_and_numeration');
  
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new Error('Document topic_numbers_and_numeration not found.');
  }

  const existingData = snap.data();
  const b9Data = existingData?.levels?.b9 || existingData?.levels?.jhs3 || {};
  const existingPracticePool = b9Data.practicePool || {};

  const updatedB9 = {
    ...b9Data,
    levelCode: 'B9',
    gradeLabel: 'Basic 9 (JHS 3)',
    contentStandard: 'B9.1.1.2 / B9.1.2.4: Real number system structure, surd identities, simplification, and radical operations.',
    notes: b9InteractiveNotes,
    workedExamples: b9InteractiveWorkedExamples,
    practicePool: existingPracticePool,
  };

  // Perform atomic update on levels.b9 and mirror to levels.jhs3
  await docRef.update({
    'levels.b9': updatedB9,
    'levels.jhs3': updatedB9,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log('✅ Successfully updated B9 Numbers notes & workedExamples with interactive self-study scaffolding in Firestore.');

  // Synchronize local JSON payloads
  const localJsonPath = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');
  if (fs.existsSync(localJsonPath)) {
    const raw = fs.readFileSync(localJsonPath, 'utf-8');
    const localData = JSON.parse(raw);
    if (localData.levels?.jhs3) {
      localData.levels.jhs3 = { ...localData.levels.jhs3, ...updatedB9 };
    }
    if (localData.levels?.b9) {
      localData.levels.b9 = { ...localData.levels.b9, ...updatedB9 };
    }
    fs.writeFileSync(localJsonPath, JSON.stringify(localData, null, 2), 'utf-8');
    console.log('✅ Synchronized local payload file scripts/payloads/topics/topic_numbers_and_numeration.json');
  }
}

patch()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Patch error:', err);
    process.exit(1);
  });

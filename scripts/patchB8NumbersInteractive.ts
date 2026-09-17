/**
 * Script: Update Basic 8 Numbers & Numeration with Interactive Markdown & Deep Pedagogical Scaffolding
 * Path: scripts/patchB8NumbersInteractive.ts
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
  console.warn('[patchB8NumbersInteractive] Firebase Admin initialization error:', error);
}

const b8InteractiveNotes = `### 1. Scientific Notation (Standard Form)

Scientific notation standardizes extremely large astronomical measurements or microscopic quantities into a uniform decimal format:

$$A \\times 10^n$$

where **$1 \\le A < 10$** (the mantissa contains exactly one non-zero digit before the decimal point) and **$n \\in \\mathbb{Z}$** (an integer exponent).

* **Large Numbers ($n > 0$):** Move the decimal point to the left.
  $$8,765,000 = 8.765 \\times 10^6$$
* **Small Decimals ($n < 0$):** Move the decimal point to the right.
  $$0.00042 = 4.2 \\times 10^{-4}$$

<details>
<summary>🔍 <b>Self-Check Challenge: Standard Form Traps</b> (Click to test yourself)</summary>

> **Question:** Is $24.5 \\times 10^3$ in standard form? If not, convert it correctly.
>
> **Explanation:**
> * No, because $24.5$ is greater than $10$.
> * Rewrite the mantissa: $24.5 = 2.45 \\times 10^1$.
> * Combine powers: $2.45 \\times 10^1 \\times 10^3 = \\mathbf{2.45 \\times 10^4}$.
</details>

---

### 2. Significant Figures & Rounding Protocols

Significant figures indicate the precision of measured quantities:

* All non-zero digits ($1$ through $9$) are significant.
* **Captive Zeros:** Zeros trapped between non-zero digits are always significant (e.g., $4.005$ has 4 sig. figs.).
* **Leading Zeros:** Zeros preceding the first non-zero digit are place-holders and are NOT significant (e.g., $0.0035$ has 2 sig. figs.).
* **Trailing Zeros in Decimals:** Trailing zeros to the right of a decimal point are significant (e.g., $2.500$ has 4 sig. figs.).

<details>
<summary>⚠️ <b>Common Exam Trap: Whole Number Trailing Zeros</b> (Click to inspect)</summary>

> Round $56,734$ correct to two significant figures:
> * Inspect the third digit: $7 \\ge 5$, so round the second digit up ($6 \\to 7$).
> * Replace discarded places with place-holding zeros: **$57,000$**.
> * *Never write $57$; trailing zeros are mandatory to preserve the place value of tens of thousands!*
</details>

---

### 3. Master Laws of Indices

For non-zero real bases $a, b$ and integer indices $m, n$:

1. **Product Law:** Multiply like bases by adding powers:
   $$a^m \\times a^n = a^{m+n}$$
2. **Quotient Law:** Divide like bases by subtracting powers:
   $$a^m \\div a^n = a^{m-n}$$
3. **Power Law:** Raise a power to a power by multiplying indices:
   $$(a^m)^n = a^{m \\times n}$$
4. **Zero Power Law:** Any non-zero base with zero exponent equals 1:
   $$a^0 = 1 \\quad (a \\ne 0)$$
5. **Negative Index Law:** A negative exponent indicates the reciprocal:
   $$a^{-n} = \\frac{1}{a^n}$$
6. **Power of a Product:** Distribute the exponent to each factor:
   $$(ab)^n = a^n b^n$$

<details>
<summary>💡 <b>Why is $a^0 = 1$?</b> (Click to see the mathematical proof)</summary>

> Consider $\\frac{a^3}{a^3}$:
> * By basic arithmetic division, any non-zero quantity divided by itself equals $1$:
>   $$\\frac{a^3}{a^3} = 1$$
> * By the Quotient Law of Indices:
>   $$\\frac{a^3}{a^3} = a^{3 - 3} = a^0$$
> * Therefore: $$a^0 = 1$$
</details>

---

### 4. Exponential Equations (Indicial Equations)

To solve equations where the unknown variable is in the exponent ($a^{f(x)} = a^k$):
1. Express both sides of the equation using the **same prime base**.
2. Equate the exponents directly: $f(x) = k$.
3. Solve the resulting linear equation.

---

### 5. Perfect Squares & Consecutive Odd Subtractions

A perfect square $n$ can be established and its square root computed by subtracting consecutive odd numbers ($1, 3, 5, 7, 9, \\dots$) from $n$ until reaching zero. The total count of subtractions performed equals $\\sqrt{n}$.`;

const b8InteractiveWorkedExamples = [
  {
    id: 'we_num_j2_01',
    title: 'Standard Form Compound Evaluation',
    problem: 'Evaluate $(0.00036 \\times 40,000) \\div 0.0012$ and express your final answer in standard scientific form.',
    steps: [
      'Step 1 (Why we do this: Convert all terms to standard form first): Convert each decimal and whole number into $A \\times 10^n$: $0.00036 = 3.6 \\times 10^{-4}$, $40,000 = 4.0 \\times 10^4$, and $0.0012 = 1.2 \\times 10^{-3}$.',
      'Step 2 (Why we do this: Multiply the numerator terms using index product rules): Group mantissas and combine powers of 10: $(3.6 \\times 4.0) \\times 10^{-4 + 4} = 14.4 \\times 10^0 = 14.4$.',
      'Step 3 (Why we do this: Divide by denominator using index quotient rules): $\\frac{14.4}{1.2 \\times 10^{-3}} = \\left(\\frac{14.4}{1.2}\\right) \\times 10^{0 - (-3)} = 12 \\times 10^3$.',
      'Step 4 (Why we do this: Re-align to valid scientific notation 1 ≤ A < 10): The mantissa 12 is greater than 10. Write $12 = 1.2 \\times 10^1$. Therefore, $1.2 \\times 10^1 \\times 10^3 = 1.2 \\times 10^4$.',
    ],
    finalAnswer: '$$1.2 \\times 10^4$$',
  },
  {
    id: 'we_num_j2_02',
    title: 'Solving Exponential Equations with Common Bases',
    problem: 'Solve for $x$ in the equation: $2^{x+2} = 16$.',
    steps: [
      'Step 1 (Why we do this: Re-write the non-base side into powers of 2): Express 16 as an exponent of base 2: $16 = 2 \\times 2 \\times 2 \\times 2 = 2^4$.',
      'Step 2 (Why we do this: Equate exponents across equal bases): Since the bases on both sides are identical (base 2), equate their powers: $x + 2 = 4$.',
      'Step 3 (Why we do this: Solve the one-step linear equation): Subtract 2 from both sides: $x = 4 - 2 = 2$.',
      'Step 4 (Why we do this: Substitute to verify): Check the result: $2^{2 + 2} = 2^4 = 16$. The equation holds.',
    ],
    finalAnswer: '$$x = 2$$',
  },
  {
    id: 'we_num_j2_03',
    title: 'Square Root Evaluation via Consecutive Odd Subtractions',
    problem: 'Determine $\\sqrt{49}$ using the consecutive odd subtraction method.',
    steps: [
      'Step 1 (Why we do this: Apply the sum of first n odd numbers theorem): The sum of the first $n$ odd integers equals $n^2$. Subtracting consecutive odd numbers from a perfect square until zero counts $\\sqrt{n}$.',
      'Step 2 (Why we do this: Execute consecutive subtractions systematically):\n  1. $49 - 1 = 48$\n  2. $48 - 3 = 45$\n  3. $45 - 5 = 40$\n  4. $40 - 7 = 33$\n  5. $33 - 9 = 24$\n  6. $24 - 11 = 13$\n  7. $13 - 13 = 0$',
      'Step 3 (Why we do this: Count the completed steps): Exactly 7 subtractions were required to reach zero. Thus, $\\sqrt{49} = 7$.',
    ],
    finalAnswer: '$$\\sqrt{49} = 7$$',
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
  const b8Data = existingData?.levels?.b8 || existingData?.levels?.jhs2 || {};
  const existingPracticePool = b8Data.practicePool || {};

  const updatedB8 = {
    ...b8Data,
    notes: b8InteractiveNotes,
    workedExamples: b8InteractiveWorkedExamples,
    practicePool: existingPracticePool,
  };

  // Perform atomic update on levels.b8 and mirror to levels.jhs2
  await docRef.update({
    'levels.b8': updatedB8,
    'levels.jhs2': updatedB8,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log('✅ Successfully updated B8 Numbers notes and worked examples with interactive elements in Firestore.');

  // Synchronize local JSON payloads
  const localJsonPath = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');
  if (fs.existsSync(localJsonPath)) {
    const raw = fs.readFileSync(localJsonPath, 'utf-8');
    const localData = JSON.parse(raw);
    if (localData.levels?.jhs2) {
      localData.levels.jhs2.notes = b8InteractiveNotes;
      localData.levels.jhs2.workedExamples = b8InteractiveWorkedExamples;
    }
    if (localData.levels?.b8) {
      localData.levels.b8.notes = b8InteractiveNotes;
      localData.levels.b8.workedExamples = b8InteractiveWorkedExamples;
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

/**
 * Patch Script: Elevate Basic 8 (JHS 2) & Basic 9 (JHS 3) Conceptual Notes and Worked Examples
 * Path: scripts/patchB8B9Notes.ts
 *
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
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      adminApp = initializeApp({
        credential: cert(serviceAccountPath),
      });
    } else if (fs.existsSync(fallbackKeyPath)) {
      adminApp = initializeApp({
        credential: cert(fallbackKeyPath),
      });
    } else {
      adminApp = initializeApp({ projectId });
    }
  }
  db = getFirestore();
} catch (error) {
  console.warn('[patchB8B9Notes] Firebase Admin initialization error:', error);
}

const b8Notes = `### 1. Scientific Notation (Standard Form)

A quantity is expressed in standard form when written as:
$$A \\times 10^n$$
where $1 \\le A < 10$ and $n \\in \\mathbb{Z}$ (an integer).
* **Positive Power ($n > 0$):** Numbers $\\ge 10$ (e.g., $8,765,000 = 8.765 \\times 10^6$).
* **Negative Power ($n < 0$):** Numbers between 0 and 1 (e.g., $0.00042 = 4.2 \\times 10^{-4}$).

---

### 2. Significant Figures & Decimal Places

* Non-zero digits are always significant.
* Zeros between non-zero digits are significant (e.g., $4.005$ has 4 sig figs).
* Leading zeros serving as place-holders are not significant (e.g., $0.0035$ has 2 sig figs).
* Trailing zeros in a decimal are significant (e.g., $2.500$ has 4 sig figs).

---

### 3. Laws of Indices

For real bases $a, b \\ne 0$ and integers $m, n$:
* **Product Law:** $a^m \\times a^n = a^{m+n}$
* **Quotient Law:** $a^m \\div a^n = a^{m-n}$
* **Power Law:** $(a^m)^n = a^{m \\times n}$
* **Zero Index:** $a^0 = 1$
* **Negative Index:** $a^{-n} = \\frac{1}{a^n}$
* **Power of a Product:** $(ab)^n = a^n b^n$

---

### 4. Perfect Squares & Consecutive Odd Subtractions

A perfect square $n = k^2$ can be verified by successively subtracting consecutive odd numbers starting from 1 until the remainder reaches 0. The count of subtractions is $\\sqrt{n}$.`;

const b8WorkedExamples = [
  {
    id: 'we_num_j2_01',
    title: 'Standard Form Multiplication & Division',
    problem: 'Evaluate $(0.00036 \\times 40,000) \\div 0.0012$ and leave your answer in standard form.',
    steps: [
      'Convert each term to standard form: $3.6 \\times 10^{-4}$, $4.0 \\times 10^4$, and $1.2 \\times 10^{-3}$.',
      'Multiply numerators: $(3.6 \\times 4.0) \\times 10^{-4 + 4} = 14.4 \\times 10^0 = 14.4$.',
      'Divide: $\\frac{14.4}{1.2 \\times 10^{-3}} = \\frac{14.4}{1.2} \\times 10^3 = 12 \\times 10^3$.',
      'Adjust to standard form ($1 \\le A < 10$): $1.2 \\times 10^1 \\times 10^3 = 1.2 \\times 10^4$.',
    ],
    finalAnswer: '$$1.2 \\times 10^4$$',
  },
  {
    id: 'we_num_j2_02',
    title: 'Solving Exponential Equations',
    problem: 'Solve for $x$ in the equation: $2^{x+2} = 16$.',
    steps: [
      'Express the right-hand side in base 2: $16 = 2^4$.',
      'Equate powers since bases are equal: $x + 2 = 4$.',
      'Solve for $x$: $x = 4 - 2 = 2$.',
    ],
    finalAnswer: '$$x = 2$$',
  },
  {
    id: 'we_num_j2_03',
    title: 'Square Root by Consecutive Odd Subtraction',
    problem: 'Determine $\\sqrt{49}$ using the consecutive odd subtraction method.',
    steps: [
      'Subtract consecutive odd numbers starting from 1 until reaching 0:\n1. $49 - 1 = 48$\n2. $48 - 3 = 45$\n3. $45 - 5 = 40$\n4. $40 - 7 = 33$\n5. $33 - 9 = 24$\n6. $24 - 11 = 13$\n7. $13 - 13 = 0$',
      'Count the total number of subtractions performed: 7.',
    ],
    finalAnswer: '$$\\sqrt{49} = 7$$',
  },
];

const b9Notes = `### 1. The Real Number System ($\\mathbb{R}$)

* **Natural Numbers ($\\mathbb{N}$):** $\\{1, 2, 3, \\dots\\}$
* **Whole Numbers ($\\mathbb{W}$):** $\\{0, 1, 2, 3, \\dots\\}$
* **Integers ($\\mathbb{Z}$):** $\\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$
* **Rational Numbers ($\\mathbb{Q}$):** Numbers expressible as $\\frac{a}{b}$ where $a, b \\in \\mathbb{Z}$ and $b \\ne 0$.
* **Irrational Numbers ($\\mathbb{Q}'$):** Non-terminating, non-recurring decimals (e.g., $\\sqrt{2}, \\sqrt{3}, \\pi$).
$$\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$$

---

### 2. Definition & Rules of Surds

A surd is an irrational root of a rational number.
* **Product Rule:** $\\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b}$
* **Quotient Rule:** $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$
* **Combining Like Surds:** $a\\sqrt{c} \\pm b\\sqrt{c} = (a \\pm b)\\sqrt{c}$
* **Rationalizing Monomial Denominators:**
  $$\\frac{a}{\\sqrt{b}} = \\frac{a}{\\sqrt{b}} \\times \\frac{\\sqrt{b}}{\\sqrt{b}} = \\frac{a\\sqrt{b}}{b}$$`;

const b9WorkedExamples = [
  {
    id: 'we_num_j3_01',
    title: 'Simplifying and Combining Surds',
    problem: 'Simplify: $\\sqrt{72} + \\sqrt{50} - \\sqrt{18}$.',
    steps: [
      'Decompose each term into a product containing a perfect square factor:\n* $\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$\n* $\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$\n* $\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}$',
      'Combine like surds: $6\\sqrt{2} + 5\\sqrt{2} - 3\\sqrt{2} = (6 + 5 - 3)\\sqrt{2} = 8\\sqrt{2}$.',
    ],
    finalAnswer: '$$8\\sqrt{2}$$',
  },
  {
    id: 'we_num_j3_02',
    title: 'Rationalizing the Denominator',
    problem: 'Simplify by rationalizing the denominator: $\\frac{12}{\\sqrt{3}}$.',
    steps: [
      'Multiply numerator and denominator by $\\sqrt{3}$:\n$$\\frac{12}{\\sqrt{3}} \\times \\frac{\\sqrt{3}}{\\sqrt{3}} = \\frac{12\\sqrt{3}}{3}$$',
      'Simplify the rational fraction: $\\frac{12}{3} = 4$.',
    ],
    finalAnswer: '$$4\\sqrt{3}$$',
  },
  {
    id: 'we_num_j3_03',
    title: 'Place-Value Multi-Digit Deduction',
    problem: 'I am a 6-digit number. My first digit is 5 more than my last digit, but 2 less than my second digit. My second digit is the third multiple of 3, and my fourth digit is the second multiple of 3. My third digit is the quotient when the fourth digit is divided by the last digit. My fourth and fifth digits are consecutive numbers. Find the number and write it in standard form.',
    steps: [
      'Find 2nd digit: $3 \\times 3 = 9$.',
      'Find 4th digit: $2 \\times 3 = 6$.',
      'Find 1st digit: $9 - 2 = 7$.',
      'Find last (6th) digit: $7 - 5 = 2$.',
      'Find 5th digit: consecutive with 4th digit (6), so $6 - 1 = 5$.',
      'Find 3rd digit: $6 \\div 2 = 3$.',
      'Assemble the number: $793,652$.',
      'Convert to standard form: $7.93652 \\times 10^5$.',
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

  const data = snap.data();
  const existingB8 = data?.levels?.b8 || data?.levels?.jhs2 || {};
  const existingB9 = data?.levels?.b9 || data?.levels?.jhs3 || {};

  const existingB8PracticePool = existingB8.practicePool || {};
  const existingB9PracticePool = existingB9.practicePool || {};

  console.log('Existing B8 practicePool counts:', {
    low: existingB8PracticePool.low?.length || 0,
    medium: existingB8PracticePool.medium?.length || 0,
    hard: existingB8PracticePool.hard?.length || 0,
  });

  console.log('Existing B9 practicePool counts:', {
    low: existingB9PracticePool.low?.length || 0,
    medium: existingB9PracticePool.medium?.length || 0,
    hard: existingB9PracticePool.hard?.length || 0,
  });

  const updatedB8 = {
    ...existingB8,
    levelCode: 'B8',
    gradeLabel: 'Basic 8 (JHS 2)',
    contentStandard: 'B8.1.1.1 / B8.1.2.3: Express quantities in standard form, round to significant figures, and apply the laws of indices to solve problems.',
    notes: b8Notes,
    workedExamples: b8WorkedExamples,
    practicePool: existingB8PracticePool,
  };

  const updatedB9 = {
    ...existingB9,
    levelCode: 'B9',
    gradeLabel: 'Basic 9 (JHS 3)',
    contentStandard: 'B9.1.1.2 / B9.1.2.4: Real number system structure, surd rules, and operations on radical numbers.',
    notes: b9Notes,
    workedExamples: b9WorkedExamples,
    practicePool: existingB9PracticePool,
  };

  // Atomic update merging b8, b9 and mirroring to jhs2, jhs3
  await docRef.update({
    'levels.b8': updatedB8,
    'levels.jhs2': updatedB8,
    'levels.b9': updatedB9,
    'levels.jhs3': updatedB9,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log('✅ Successfully updated levels.b8, levels.jhs2, levels.b9, and levels.jhs3 in Firestore.');

  // Sync with local payload file
  const localJsonPath = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');
  if (fs.existsSync(localJsonPath)) {
    const raw = fs.readFileSync(localJsonPath, 'utf-8');
    const localData = JSON.parse(raw);
    
    if (localData.levels?.jhs2) {
      localData.levels.jhs2 = { ...localData.levels.jhs2, ...updatedB8 };
    }
    if (localData.levels?.b8) {
      localData.levels.b8 = { ...localData.levels.b8, ...updatedB8 };
    }
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

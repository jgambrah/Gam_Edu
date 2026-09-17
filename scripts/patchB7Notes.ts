/**
 * Patch Script: Elevate Basic 7 (JHS 1) Conceptual Notes and Worked Examples
 * Path: scripts/patchB7Notes.ts
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
  console.warn('[patchB7Notes] Firebase Admin initialization error:', error);
}

const b7Notes = `### 1. Place Value, Ordering & Large Quantities

* **The Base-10 Positional System:** The position of a digit determines its absolute value. Moving one place to the left increases a digit's value by a factor of 10:
  $$\\text{Value} = \\text{Digit} \\times 10^k \\quad (k \\in \\mathbb{W})$$

* **Expanded Form:**
  $$6,245,789 = (6 \\times 10^6) + (2 \\times 10^5) + (4 \\times 10^4) + (5 \\times 10^3) + (7 \\times 10^2) + (8 \\times 10^1) + (9 \\times 10^0)$$

* **Order Relations:**
  * Strict inequality: $a > b$ ($a$ exceeds $b$) or $a < b$ ($a$ is less than $b$).
  * Equivalence: $a = b$.
  * Compare digits column-by-column starting from the highest place value.

---

### 2. Rounding Axioms: Round Off, Round Up & Round Down

* **Round Off (Standard Rule):** Identify the digit $d$ at place value $10^k$ and inspect the digit immediately to its right ($r$):
  $$\\text{Action} = \\begin{cases} d \\text{ remains unchanged}, & \\text{if } r \\in \\{0, 1, 2, 3, 4\\} \\\\ d \\leftarrow d + 1, & \\text{if } r \\in \\{5, 6, 7, 8, 9\\} \\end{cases}$$

* **Round Up (Ceiling $\\lceil x \\rceil$):** Always advance to the next multiple of $10^k$ if any remainder exists.
* **Round Down (Floor $\\lfloor x \\rfloor$):** Always truncate to the lower multiple of $10^k$, discarding remainders.

---

### 3. Factors, Multiples & Prime Decomposition

* **Divisibility:** An integer $d$ is a factor of $n$ ($d \\mid n$) if and only if there exists an integer $q$ such that $n = d \\times q$.
* **Prime & Composite Numbers:**
  * **Prime:** An integer $p > 1$ having exactly two distinct positive divisors: $1$ and $p$.
  * **Composite:** An integer $n > 1$ with more than two divisors.
  * **Unit:** $1$ has only one divisor; it is neither prime nor composite.
* **Fundamental Theorem of Arithmetic:** Every integer $n \\ge 2$ can be uniquely expressed as a product of prime powers:
  $$n = p_1^{a_1} \\times p_2^{a_2} \\times \\dots \\times p_k^{a_k} \\quad (p_1 < p_2 < \\dots < p_k, \\ a_i \\ge 1)$$

---

### 4. Highest Common Factor (HCF) & Lowest Common Multiple (LCM)

For two numbers $A = \\prod p_i^{a_i}$ and $B = \\prod p_i^{b_i}$:
* **Highest Common Factor (HCF):** Product of the lowest power of each common prime factor:
  $$\\text{HCF}(A, B) = \\prod p_i^{\\min(a_i, b_i)}$$
* **Lowest Common Multiple (LCM):** Product of the highest power of every prime factor present:
  $$\\text{LCM}(A, B) = \\prod p_i^{\\max(a_i, b_i)}$$
* **Product Identity:**
  $$\\text{HCF}(A, B) \\times \\text{LCM}(A, B) = A \\times B$$

---

### 5. Standard Divisibility Rules

* **Divisibility by 2:** Last digit is an even integer ($0, 2, 4, 6, 8$).
* **Divisibility by 3:** The sum of digits $\\sum d_i$ is divisible by 3.
* **Divisibility by 4:** The number formed by the last two digits is divisible by 4.
* **Divisibility by 5:** Last digit is $0$ or $5$.
* **Divisibility by 6:** Divisible by both 2 and 3.
* **Divisibility by 7:** Double the last digit and subtract it from the remaining truncated number; the result must be 0 or a multiple of 7.
* **Divisibility by 9:** The sum of digits $\\sum d_i$ is divisible by 9.

---

### 6. Non-Decimal Bases (Bases 2, 5, and 10)

A number $N$ in base $b$ uses digits $\\{0, 1, \\dots, b-1\\}$:
$$N_b = \\sum_{i=0}^k d_i b^i = (d_k \\times b^k) + \\dots + (d_1 \\times b^1) + (d_0 \\times b^0)$$
* **Base 2 (Binary):** Digits $\\{0, 1\\}$. Place values: $1, 2, 4, 8, 16, 32, \\dots$
* **Base 5 (Quinary):** Digits $\\{0, 1, 2, 3, 4\\}$. Place values: $1, 5, 25, 125, \\dots$
* **Conversion Methods:**
  * **Base $b \\to$ Base 10:** Expand using powers of $b$.
  * **Base 10 $\\to$ Base $b$:** Divide repeatedly by $b$ and read remainders from bottom to top.`;

const b7WorkedExamples = [
  {
    id: 'we_num_j1_01',
    title: 'Prime Factor Decomposition & Systematic HCF/LCM',
    problem: 'Given the numbers $72$ and $108$:\n(i) Express each number as a product of prime factors in index notation.\n(ii) Determine their Highest Common Factor (HCF).\n(iii) Determine their Lowest Common Multiple (LCM).',
    steps: [
      'Prime factorize 72: $72 = 2 \\times 36 = 2 \\times 2 \\times 18 = 2^3 \\times 3^2$.',
      'Prime factorize 108: $108 = 2 \\times 54 = 2 \\times 2 \\times 27 = 2^2 \\times 3^3$.',
      'Calculate HCF using minimum powers: $\\text{HCF} = 2^{\\min(3, 2)} \\times 3^{\\min(2, 3)} = 2^2 \\times 3^2 = 4 \\times 9 = 36$.',
      'Calculate LCM using maximum powers: $\\text{LCM} = 2^{\\max(3, 2)} \\times 3^{\\max(2, 3)} = 2^3 \\times 3^3 = 8 \\times 27 = 216$.',
    ],
    finalAnswer: '$$\\text{HCF} = 36, \\quad \\text{LCM} = 216$$',
  },
  {
    id: 'we_num_j1_02',
    title: 'Real-World Periodic Interval Modeling (LCM)',
    problem: 'Three irrigation pumps activate at intervals of $12\\text{ minutes}$, $18\\text{ minutes}$, and $24\\text{ minutes}$ respectively. If all three turn on together at $6:00\\text{ a.m.}$, at what time will they next activate simultaneously?',
    steps: [
      'Identify that the simultaneous activation requires the Lowest Common Multiple (LCM) of 12, 18, and 24.',
      'Factor each interval: $12 = 2^2 \\times 3^1$, $18 = 2^1 \\times 3^2$, $24 = 2^3 \\times 3^1$.',
      'Determine LCM: $2^{\\max(2, 1, 3)} \\times 3^{\\max(1, 2, 1)} = 2^3 \\times 3^2 = 8 \\times 9 = 72\\text{ minutes}$.',
      'Convert to hours and minutes: $72\\text{ minutes} = 1\\text{ hr } 12\\text{ min}$.',
      'Add to start time: $6:00\\text{ a.m.} + 1\\text{ hr } 12\\text{ min} = 7:12\\text{ a.m.}$',
    ],
    finalAnswer: '$$7:12\\text{ a.m.}$$',
  },
  {
    id: 'we_num_j1_03',
    title: 'Multi-Base Conversion (Base 5 to Base 2 via Base 10)',
    problem: 'Convert the base five numeral $234_{\\text{five}}$ into a base two (binary) numeral.',
    steps: [
      'Convert $234_{\\text{five}}$ to base ten: $(2 \\times 5^2) + (3 \\times 5^1) + (4 \\times 5^0) = 50 + 15 + 4 = 69_{\\text{ten}}$.',
      'Divide 69 successively by 2, recording remainders:\n  * $69 \\div 2 = 34 \\text{ R } 1$\n  * $34 \\div 2 = 17 \\text{ R } 0$\n  * $17 \\div 2 = 8 \\text{ R } 1$\n  * $8 \\div 2 = 4 \\text{ R } 0$\n  * $4 \\div 2 = 2 \\text{ R } 0$\n  * $2 \\div 2 = 1 \\text{ R } 0$\n  * $1 \\div 2 = 0 \\text{ R } 1$',
      'Read remainders from bottom to top: $1000101$.',
    ],
    finalAnswer: '$$1000101_{\\text{two}}$$',
  },
  {
    id: 'we_num_j1_04',
    title: 'Unknown Radix Equation Resolution',
    problem: 'If $43_x = 31_{\\text{ten}}$, find the value of the unknown integer base $x$.',
    steps: [
      'Expand the left-hand side in powers of $x$: $(4 \\times x^1) + (3 \\times x^0) = 4x + 3$.',
      'Set up the equation: $4x + 3 = 31$.',
      'Solve for $x$: $4x = 31 - 3 = 28 \\implies x = 28 / 4 = 7$.',
      'Verify: Digits 4 and 3 are strictly less than the base 7, so the base is valid.',
    ],
    finalAnswer: '$$x = 7 \\quad (\\text{Base Seven})$$',
  },
];

async function patch() {
  if (!db) {
    throw new Error('Firestore database instance could not be initialized.');
  }

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_numbers_and_numeration');
  
  // Read existing document to verify structure and practicePool
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new Error('Document topic_numbers_and_numeration not found.');
  }

  const existingData = snap.data();
  console.log('Found existing topic doc. Existing levels:', Object.keys(existingData?.levels || {}));

  // Preserve existing practicePool and level metadata
  const existingB7 = existingData?.levels?.b7 || existingData?.levels?.jhs1 || {};
  const existingPracticePool = existingB7.practicePool || {};
  
  console.log('Existing practicePool question counts:', {
    low: existingPracticePool.low?.length || 0,
    medium: existingPracticePool.medium?.length || 0,
    hard: existingPracticePool.hard?.length || 0,
  });

  const updatedB7 = {
    ...existingB7,
    levelTitle: existingB7.levelTitle || 'Basic 7 (JHS 1): Foundations of Numbers, Factors & Place Value',
    summary: existingB7.summary || 'Prime factors, index notation, HCF, LCM, and non-decimal base operations (Base Five & Binary).',
    notes: b7Notes,
    workedExamples: b7WorkedExamples,
    practicePool: existingPracticePool,
  };

  // Perform atomic update on levels.b7 (and mirror to levels.jhs1 for dual compatibility)
  const updatePayload: Record<string, any> = {
    'levels.b7': updatedB7,
    'levels.jhs1': updatedB7,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await docRef.update(updatePayload);
  console.log('✅ Successfully patched levels.b7 and levels.jhs1 in topic_numbers_and_numeration in Firestore.');

  // Verify updated document
  const verifySnap = await docRef.get();
  const verifyData = verifySnap.data();
  const verifiedB7 = verifyData?.levels?.b7;

  console.log('Verification:');
  console.log('- Notes length:', verifiedB7?.notes?.length);
  console.log('- Worked Examples count:', verifiedB7?.workedExamples?.length);
  console.log('- Practice Pool low count:', verifiedB7?.practicePool?.low?.length);
  console.log('- Practice Pool medium count:', verifiedB7?.practicePool?.medium?.length);
  console.log('- Practice Pool hard count:', verifiedB7?.practicePool?.hard?.length);

  // Sync with local payload file if present
  const localJsonPath = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');
  if (fs.existsSync(localJsonPath)) {
    const raw = fs.readFileSync(localJsonPath, 'utf-8');
    const localData = JSON.parse(raw);
    if (localData.levels?.jhs1) {
      localData.levels.jhs1.notes = b7Notes;
      localData.levels.jhs1.workedExamples = b7WorkedExamples;
    }
    if (localData.levels?.b7) {
      localData.levels.b7.notes = b7Notes;
      localData.levels.b7.workedExamples = b7WorkedExamples;
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

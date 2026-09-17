/**
 * Script: Update Basic 7 Numbers & Numeration with Interactive Markdown & Deep Pedagogical Scaffolding
 * Path: scripts/patchB7NumbersInteractive.ts
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
  console.warn('[patchB7NumbersInteractive] Firebase Admin initialization error:', error);
}

const b7InteractiveNotes = `### 1. Place Value & The Positional Decimal System

Numbers are built on a base-10 positional system. The place an individual digit occupies determines its total value. Moving one step to the left multiplies value by 10; moving one step to the right divides it by 10:

$$\\text{Value} = \\text{Digit} \\times 10^k \\quad (k \\in \\mathbb{W})$$

* **Expanded Form Decomposition:**
  $$6,245,789 = (6 \\times 10^6) + (2 \\times 10^5) + (4 \\times 10^4) + (5 \\times 10^3) + (7 \\times 10^2) + (8 \\times 10^1) + (9 \\times 10^0)$$

<details>
<summary>🔍 <b>Self-Check Challenge: Value vs. Place Value</b> (Click to test yourself)</summary>

> **Question:** In the number $4,582,319$, what is the *place value* of 8, and what is its *total value*?
>
> **Explanation:**
> * **Place value** refers to the column: **Ten-thousands** ($10^4$).
> * **Total value** multiplies digit by column: $8 \\times 10,000 = \\mathbf{80,000}$.
</details>

---

### 2. Rounding Axioms: Round Off, Round Up & Round Down

In real-life budgeting and commerce, numbers are rounded to simplify estimations:

* **Round Off (Standard Rule):** Look at the target place value digit $d$. Examine the digit immediately to its right ($r$):
  $$\\text{Action} = \\begin{cases} d \\text{ stays unchanged (truncate)}, & \\text{if } r \\in \\{0, 1, 2, 3, 4\\} \\\\ d \\leftarrow d + 1 \\text{ (round up)}, & \\text{if } r \\in \\{5, 6, 7, 8, 9\\} \\end{cases}$$
* **Round Up (Ceiling $\\lceil x \\rceil$):** Advance to the next value whenever any excess exists (e.g., buying full bags of cement or reserving buses).
* **Round Down (Floor $\\lfloor x \\rfloor$):** Truncate excess remainders (e.g., determining completed items or units).

<details>
<summary>⚠️ <b>Common Exam Trap: Consecutive 9s</b> (Click to inspect)</summary>

> Round $49,962$ to the nearest hundred:
> * Target digit: hundreds column ($9$). Next digit: $6$ (round up).
> * $9 + 1 = 10$ (write 0 and carry 1 to thousands column).
> * $49 + 1 = 50$, producing **$50,000$**.
</details>

---

### 3. Prime Numbers & Prime Factor Decomposition

* **Divisibility:** An integer $d$ divides $n$ ($d \\mid n$) if $n = d \\times q$ with no remainder.
* **Prime Number:** An integer greater than 1 with exactly two distinct positive divisors: 1 and itself.
* **The Number 1:** Has only one divisor ($1$); it is neither prime nor composite.
* **Fundamental Theorem of Arithmetic:** Every integer $n \\ge 2$ can be uniquely expressed as a product of prime powers in index form:
  $$n = p_1^{a_1} \\times p_2^{a_2} \\times \\dots \\times p_k^{a_k}$$

---

### 4. Systematic HCF & LCM Algorithms

For two numbers decomposed into prime factors $A = \\prod p_i^{a_i}$ and $B = \\prod p_i^{b_i}$:

1. **Highest Common Factor (HCF):** Take only common prime bases raised to the **smallest (minimum)** exponent:
   $$\\text{HCF}(A, B) = \\prod p_i^{\\min(a_i, b_i)}$$
2. **Lowest Common Multiple (LCM):** Take every prime base appearing across either number raised to the **largest (maximum)** exponent:
   $$\\text{LCM}(A, B) = \\prod p_i^{\\max(a_i, b_i)}$$
3. **Product Theorem:** $\\text{HCF}(A, B) \\times \\text{LCM}(A, B) = A \\times B$.

---

### 5. Non-Decimal Positional Systems (Bases 2, 5, and 10)

Every base $b$ uses digits from $0$ up to $b-1$:
* **Base 2 (Binary):** Digits $\\{0, 1\\}$. Place values: $2^0=1, 2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5=32, \\dots$
* **Base 5 (Quinary):** Digits $\\{0, 1, 2, 3, 4\\}$. Place values: $5^0=1, 5^1=5, 5^2=25, 5^3=125, \\dots$

* **Conversion Procedures:**
  * **Base $b \\to$ Base 10:** Multiply each digit by its positional power $b^k$ and sum the terms.
  * **Base 10 $\\to$ Base $b$:** Divide repeatedly by base $b$, recording integer remainders until quotient is 0. Read remainders from bottom to top.`;

const b7InteractiveWorkedExamples = [
  {
    id: 'we_num_j1_01',
    title: 'Prime Factor Decomposition & Systematic HCF/LCM',
    problem: 'Given the numbers $72$ and $108$:\n(i) Express each number as a product of prime factors in index notation.\n(ii) Determine their Highest Common Factor (HCF).\n(iii) Determine their Lowest Common Multiple (LCM).',
    steps: [
      'Step 1 (Why we do this: Break each number into prime bases): Factorize 72 by successive division: $72 = 2 \\times 36 = 2^2 \\times 18 = 2^3 \\times 9 = 2^3 \\times 3^2$. Factorize 108: $108 = 2 \\times 54 = 2^2 \\times 27 = 2^2 \\times 3^3$.',
      'Step 2 (Why we do this: Calculate HCF using the lowest shared powers): The common prime bases are 2 and 3. Minimum power of 2 is $2^2$; minimum power of 3 is $3^2$. $\\text{HCF} = 2^2 \\times 3^2 = 4 \\times 9 = 36$.',
      'Step 3 (Why we do this: Calculate LCM using the highest occurring powers): Highest power of 2 is $2^3$; highest power of 3 is $3^3$. $\\text{LCM} = 2^3 \\times 3^3 = 8 \\times 27 = 216$.',
      'Step 4 (Why we do this: Verify with the Product Identity): Check whether $\\text{HCF} \\times \\text{LCM} = A \\times B$: $36 \\times 216 = 7,776$ and $72 \\times 108 = 7,776$. The identity holds.',
    ],
    finalAnswer: '$$\\text{HCF} = 36, \\quad \\text{LCM} = 216$$',
  },
  {
    id: 'we_num_j1_02',
    title: 'Real-World Periodic Interval Modeling (LCM)',
    problem: 'Three irrigation pumps activate at intervals of $12\\text{ minutes}$, $18\\text{ minutes}$, and $24\\text{ minutes}$ respectively. If all three turn on together at $6:00\\text{ a.m.}$, at what time will they next activate simultaneously?',
    steps: [
      'Step 1 (Why we do this: Identify the core mathematical operation): Simultaneous cyclic repetitions require the Lowest Common Multiple (LCM) of the three numbers.',
      'Step 2 (Why we do this: Express intervals in prime index form): $12 = 2^2 \\times 3^1$, $18 = 2^1 \\times 3^2$, $24 = 2^3 \\times 3^1$.',
      'Step 3 (Why we do this: Evaluate the LCM): Take the highest exponent for each prime factor: $2^{\\max(2,1,3)} \\times 3^{\\max(1,2,1)} = 2^3 \\times 3^2 = 8 \\times 9 = 72\\text{ minutes}$.',
      'Step 4 (Why we do this: Convert elapsed minutes to clock time): $72\\text{ minutes} = 1\\text{ hour and } 12\\text{ minutes}$. Add to the base time: $6:00\\text{ a.m.} + 1\\text{ hr } 12\\text{ min} = 7:12\\text{ a.m.}$',
    ],
    finalAnswer: '$$7:12\\text{ a.m.}$$',
  },
  {
    id: 'we_num_j1_03',
    title: 'Multi-Base Conversion (Base 5 to Base 2 via Base 10)',
    problem: 'Convert the base five numeral $234_{\\text{five}}$ into a base two (binary) numeral.',
    steps: [
      'Step 1 (Why we do this: Bridge through Base 10 decimal notation): Expand $234_{\\text{five}}$ across powers of 5: $(2 \\times 5^2) + (3 \\times 5^1) + (4 \\times 5^0) = (2 \\times 25) + (3 \\times 5) + (4 \\times 1) = 50 + 15 + 4 = 69_{\\text{ten}}$.',
      'Step 2 (Why we do this: Convert decimal into binary using repeated division): Divide 69 repeatedly by 2, recording remainders:\n  * $69 \\div 2 = 34 \\text{ R } 1$\n  * $34 \\div 2 = 17 \\text{ R } 0$\n  * $17 \\div 2 = 8 \\text{ R } 1$\n  * $8 \\div 2 = 4 \\text{ R } 0$\n  * $4 \\div 2 = 2 \\text{ R } 0$\n  * $2 \\div 2 = 1 \\text{ R } 0$\n  * $1 \\div 2 = 0 \\text{ R } 1$',
      'Step 3 (Why we do this: Read remainders in order of significance): Read remainders upwards from the last division to the first: $1000101_{\\text{two}}$.',
    ],
    finalAnswer: '$$1000101_{\\text{two}}$$',
  },
  {
    id: 'we_num_j1_04',
    title: 'Unknown Radix Equation Resolution',
    problem: 'If $43_x = 31_{\\text{ten}}$, find the value of the unknown integer base $x$.',
    steps: [
      'Step 1 (Why we do this: Translate positional digits into an algebraic polynomial): Expand the LHS in base $x$: $(4 \\times x^1) + (3 \\times x^0) = 4x + 3$.',
      'Step 2 (Why we do this: Formulate and balance the linear equation): $4x + 3 = 31$. Subtract 3 from both sides: $4x = 28$.',
      'Step 3 (Why we do this: Solve for base x): $x = \\frac{28}{4} = 7$.',
      'Step 4 (Why we do this: Verify digits against the base): Digits in $43_x$ are 4 and 3. Since both digits are strictly less than 7, base 7 is valid.',
    ],
    finalAnswer: '$$x = 7 \\quad (\\text{Base Seven})$$',
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
  const b7Data = existingData?.levels?.b7 || existingData?.levels?.jhs1 || {};
  const existingPracticePool = b7Data.practicePool || {};

  const updatedB7 = {
    ...b7Data,
    notes: b7InteractiveNotes,
    workedExamples: b7InteractiveWorkedExamples,
    practicePool: existingPracticePool,
  };

  // Perform atomic update on levels.b7 and mirror to levels.jhs1
  await docRef.update({
    'levels.b7': updatedB7,
    'levels.jhs1': updatedB7,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log('✅ Successfully updated B7 Numbers notes and worked examples with interactive elements in Firestore.');

  // Synchronize local JSON payloads
  const localJsonPath = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');
  if (fs.existsSync(localJsonPath)) {
    const raw = fs.readFileSync(localJsonPath, 'utf-8');
    const localData = JSON.parse(raw);
    if (localData.levels?.jhs1) {
      localData.levels.jhs1.notes = b7InteractiveNotes;
      localData.levels.jhs1.workedExamples = b7InteractiveWorkedExamples;
    }
    if (localData.levels?.b7) {
      localData.levels.b7.notes = b7InteractiveNotes;
      localData.levels.b7.workedExamples = b7InteractiveWorkedExamples;
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

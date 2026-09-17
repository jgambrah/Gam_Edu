/**
 * Script: Elevate B7 Sets & Venn Diagrams with 5-Pillar Independent Learning Scaffolding
 * Path: scripts/patchB7Sets5Pillars.ts
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
  console.warn('[patchB7Sets5Pillars] Firebase Admin initialization error:', error);
}

const b7NotesElevated = `### 1. What is a Set? (The Core Mental Model & Everyday Hook)

Imagine organizing songs on your phone into playlists, or sorting fruits in a market stall into separate baskets of mangoes, oranges, and pineapples. A **set** is simply a well-defined collection of distinct items or numbers called **elements** or **members**.

* **"Well-Defined" means there is zero doubt:**
  * *"All prime numbers less than 10"* is a mathematical set because anyone can verify the exact members: $\\{2, 3, 5, 7\\}$.
  * *"All brilliant students in JHS 1"* is **NOT** a set because "brilliant" is subjective, opinion-based, and cannot be objectively measured.

#### Mathematical Symbols You Must Master:
* $\\in$ means **"is an element of"** (e.g., $3 \\in \\{1, 3, 5\\}$).
* $\\notin$ means **"is NOT an element of"** (e.g., $4 \\notin \\{1, 3, 5\\}$).
* $n(A)$ means **"the number of elements in set A"** (if $A = \\{a, b, c\\}$, then $n(A) = 3$).

---

### 2. The Two Ways to Write Sets (Step-by-Step Micro-Breakdown)

1. **The Listing (Roster) Method:**
   Write out every item inside curly brackets $\\{\\}$, separated by commas.
   * Example: $E = \\{2, 4, 6, 8, 10\\}$ (Even numbers up to 10).
2. **The Set-Builder Method (Mathematical Code):**
   State the property that members must satisfy.
   * Format: $\\{x : \\text{conditions on } x\\}$ (Read as: *"The set of all numbers $x$ such that..."*)
   * Example: $\\{x : x \\text{ is an even integer, } 2 \\le x \\le 10\\}$.

---

### 3. Special Types of Sets & Common Exam Traps

* **Finite Set:** The counting stops (e.g., days of the week, $n = 7$).
* **Infinite Set:** Goes on forever; indicated by ellipsis ($\\dots$) (e.g., whole numbers $\\mathbb{W} = \\{0, 1, 2, 3, \\dots\\}$).
* **Empty (Null) Set ($\\emptyset$ or $\\{\\}$):** Contains zero elements ($n = 0$).

> ⚠️ **CRITICAL EXAM TRAP:**
> * Never write $\\{\\emptyset\\}$ or $\\{0\\}$ for an empty set! 
> * $\\{0\\}$ is a set containing the number zero (it has 1 element!).
> * $\\{\\emptyset\\}$ is a set containing the symbol empty set (it has 1 element!).
> * Write only $\\emptyset$ or $\\{\\}$.

---

### 4. Subsets & How Many You Can Form (The Mental Model)

A set $A$ is a **subset** of $B$ ($A \\subseteq B$) if every element in $A$ also lives inside $B$.
* **The Empty Set Axiom:** The empty set $\\emptyset$ is a subset of **every** set ($\\emptyset \\subseteq A$).
* **The Self Axiom:** Every set is a subset of itself ($A \\subseteq A$).
* **The Master Formula:** If a set has $n$ elements, the total number of subsets is:
  $$\\text{Total Subsets} = 2^n$$
* **Proper Subsets:** A proper subset ($A \\subset B$) cannot be equal to $B$.
  $$\\text{Proper Subsets} = 2^n - 1$$

*Step-by-Step Walkthrough: Finding all subsets of $S = \\{x, y\\}$ ($n = 2$ elements)*
1. Calculate expected total: $2^2 = 4 \\text{ subsets}$.
2. Subsets with 0 elements: $\\emptyset$
3. Subsets with 1 element: $\\{x\\}, \\{y\\}$
4. Subsets with 2 elements: $\\{x, y\\}$
Complete list: $\\emptyset, \\{x\\}, \\{y\\}, \\{x, y\\}$.

---

### 5. Combining Sets: Intersection ($\\cap$) vs. Union ($\\cup$)

Think of set operations like combining team rosters:
* **Intersection ($A \\cap B$ — The "AND" Bridge):**
  Only take what is **shared** in common. If they share nothing, $A \\cap B = \\emptyset$ (Disjoint sets).
  $$A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}$$
* **Union ($A \\cup B$ — The "OR" Bridge):**
  Dump **everything** from both sets into one big basket.
  *Crucial rule: Never write duplicate elements twice!*
  $$A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}$$

---

### 6. Self-Check "Try It Now" Mini-Prompts

Test your understanding before attempting the Practice Lab:
* **Prompt 1:** If set $K = \\{3, 7, 11, 15\\}$, find $n(K)$ and calculate the total number of subsets.
  * *Solution:* $n(K) = 4$. Total subsets $= 2^4 = 16$. Proper subsets $= 16 - 1 = 15$.
* **Prompt 2:** Is $\\{x : x \\text{ is an odd prime less than 3}\\}$ an empty set?
  * *Solution:* Yes! The only prime less than 3 is 2, which is even. Hence the set contains no elements: $\\emptyset$.`;

const b7WorkedExamplesElevated = [
  {
    id: 'we_sets_b7_01',
    title: 'Listing Elements, Prime Filtering & Set Operations',
    problem: 'Let the universal set $U = \\{x : x \\text{ is an integer, } 1 \\le x \\le 15\\}$, $A = \\{\\text{prime numbers} \\le 15\\}$, and $B = \\{\\text{odd numbers} \\le 15\\}$.\n(i) List the members of $A$ and $B$.\n(ii) Find $A \\cap B$.\n(iii) Find $A \\cup B$.',
    steps: [
      '**Step 1 (Why we do this: Establish the boundaries of Set A):** Identify prime numbers between 1 and 15. Primes have exactly two distinct factors ($1$ and itself; remember $1$ is not prime). Result: $A = \\{2, 3, 5, 7, 11, 13\\}$.',
      '**Step 2 (Why we do this: Establish the boundaries of Set B):** List all odd numbers from 1 up to 15. Result: $B = \\{1, 3, 5, 7, 9, 11, 13, 15\\}$.',
      '**Step 3 (Why we do this: Find the shared elements for Intersection):** Compare both sets item-by-item and extract only those numbers appearing simultaneously in both lists ($A$ AND $B$): $A \\cap B = \\{3, 5, 7, 11, 13\\}$.',
      '**Step 4 (Why we do this: Merge for Union without duplicating):** Combine all unique members from $A$ and $B$ into a single collection ($A$ OR $B$), writing shared members only once: $A \\cup B = \\{1, 2, 3, 5, 7, 9, 11, 13, 15\\}$.',
    ],
    finalAnswer: '$$A \\cap B = \\{3, 5, 7, 11, 13\\}, \\quad A \\cup B = \\{1, 2, 3, 5, 7, 9, 11, 13, 15\\}$$',
  },
  {
    id: 'we_sets_b7_02',
    title: 'Systematic Power Set & Subset Generation',
    problem: 'A set $S$ is defined as $S = \\{a, b, c\\}$.\n(i) Calculate the total number of subsets and proper subsets of $S$.\n(ii) Systematically list all the subsets of $S$.',
    steps: [
      '**Step 1 (Why we do this: Pre-calculate the target count using the Master Formula):** Count the elements in $S$: $n(S) = 3$. Total subsets $= 2^n = 2^3 = 8$. Proper subsets $= 2^n - 1 = 8 - 1 = 7$.',
      '**Step 2 (Why we do this: The null set is a mandatory subset of every set):** List the 0-element subset: $\\emptyset$. (1 subset)',
      '**Step 3 (Why we do this: Group single-element subsets):** List all singleton sets: $\\{a\\}, \\{b\\}, \\{c\\}$. (3 subsets)',
      '**Step 4 (Why we do this: Pair combinations systematically):** List all 2-element combinations without repeats: $\\{a, b\\}, \\{a, c\\}, \\{b, c\\}$. (3 subsets)',
      '**Step 5 (Why we do this: Include the full set itself):** List the 3-element subset: $\\{a, b, c\\}$. (1 subset). Total tally: $1 + 3 + 3 + 1 = 8$ subsets verified.',
    ],
    finalAnswer: '$$\\text{Total Subsets} = 8, \\ \\text{Proper Subsets} = 7: \\quad \\emptyset, \\{a\\}, \\{b\\}, \\{c\\}, \\{a, b\\}, \\{a, c\\}, \\{b, c\\}, \\{a, b, c\\}$$',
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
  const existingB7 = data?.levels?.b7 || data?.levels?.jhs1 || {};
  const existingPracticePool = existingB7.practicePool || {};

  const updatedB7 = {
    ...existingB7,
    notes: b7NotesElevated,
    workedExamples: b7WorkedExamplesElevated,
    practicePool: existingPracticePool,
  };

  await docRef.update({
    'levels.b7': updatedB7,
    'levels.jhs1': updatedB7,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log('✅ Successfully elevated levels.b7 and levels.jhs1 with 5-Pillar Scaffolding in Firestore.');

  // Sync JSON payload files
  ['payloads/topic_sets_and_venn_diagrams.json', 'payloads/topics/topic_sets_and_venn_diagrams.json'].forEach((relPath) => {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const payload = JSON.parse(raw);
      if (payload.levels?.b7) {
        payload.levels.b7.notes = b7NotesElevated;
        payload.levels.b7.workedExamples = b7WorkedExamplesElevated;
      }
      if (payload.levels?.jhs1) {
        payload.levels.jhs1.notes = b7NotesElevated;
        payload.levels.jhs1.workedExamples = b7WorkedExamplesElevated;
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

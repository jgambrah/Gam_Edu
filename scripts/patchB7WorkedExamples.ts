/**
 * Script: Update Basic 7 Worked Examples with Self-Teaching Pedagogical Scaffolding
 * Path: scripts/patchB7WorkedExamples.ts
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
  console.warn('[patchB7WorkedExamples] Firebase Admin initialization error:', error);
}

const updatedWorkedExamples = [
  {
    id: 'we_sets_b7_01',
    title: 'Listing Elements, Prime Filtering & Set Operations',
    problem: 'Let the universal set $U = \\{x : x \\text{ is an integer, } 1 \\le x \\le 15\\}$, $A = \\{\\text{prime numbers} \\le 15\\}$, and $B = \\{\\text{odd numbers} \\le 15\\}$.\n(i) List the members of sets $A$ and $B$.\n(ii) Find $A \\cap B$.\n(iii) Find $A \\cup B$.\n(iv) Find $A\'$ (the complement of set $A$).',
    steps: [
      'Step 1 (Why we do this: Establish the boundaries of Set A): Identify prime numbers between 1 and 15. A prime number has exactly two distinct factors: 1 and itself (remember that 1 is not prime because it has only one factor). Result: $A = \\{2, 3, 5, 7, 11, 13\\}$.',
      'Step 2 (Why we do this: Establish the boundaries of Set B): List all odd numbers starting from 1 up to 15. Result: $B = \\{1, 3, 5, 7, 9, 11, 13, 15\\}$.',
      'Step 3 (Why we do this: Find shared members for the Intersection): Compare both sets item-by-item and extract only those numbers appearing simultaneously in both lists ($A$ AND $B$): $A \\cap B = \\{3, 5, 7, 11, 13\\}$.',
      'Step 4 (Why we do this: Merge for Union without duplicating): Combine all unique members from $A$ and $B$ into a single collection ($A$ OR $B$), writing shared members only once: $A \\cup B = \\{1, 2, 3, 5, 7, 9, 11, 13, 15\\}$.',
      'Step 5 (Why we do this: Determine the Complement relative to the Universal Set): The complement $A\'$ consists of all elements in $U$ that are NOT in set $A$. Remove $\\{2, 3, 5, 7, 11, 13\\}$ from $\\{1, 2, 3, \\dots, 15\\}$: $A\' = \\{1, 4, 6, 8, 9, 10, 12, 14, 15\\}.',
    ],
    finalAnswer: '$$A \\cap B = \\{3, 5, 7, 11, 13\\}, \\quad A \\cup B = \\{1, 2, 3, 5, 7, 9, 11, 13, 15\\}, \\quad A\' = \\{1, 4, 6, 8, 9, 10, 12, 14, 15\\}$$',
  },
  {
    id: 'we_sets_b7_02',
    title: 'Systematic Power Set & Subset Generation',
    problem: 'A set $S$ is defined as $S = \\{a, b, c\\}$.\n(i) Calculate the total number of subsets and proper subsets of $S$.\n(ii) Systematically list all the subsets of $S$.',
    steps: [
      'Step 1 (Why we do this: Pre-calculate the target count using the Master Formula): Count the elements in $S$: $n(S) = 3$. Total subsets $= 2^n = 2^3 = 8$. Proper subsets $= 2^n - 1 = 8 - 1 = 7$.',
      'Step 2 (Why we do this: The null set is a mandatory subset of every set): List the 0-element subset: $\\emptyset$. (1 subset)',
      'Step 3 (Why we do this: Group single-element subsets): List all singleton sets: $\\{a\\}, \\{b\\}, \\{c\\}$. (3 subsets)',
      'Step 4 (Why we do this: Pair combinations systematically): List all 2-element combinations without repeats: $\\{a, b\\}, \\{a, c\\}, \\{b, c\\}$. (3 subsets)',
      'Step 5 (Why we do this: Include the full set itself): List the 3-element subset: $\\{a, b, c\\}$. (1 subset). Total tally: $1 + 3 + 3 + 1 = 8$ subsets verified.',
    ],
    finalAnswer: '$$\\text{Total Subsets} = 8, \\quad \\text{Proper Subsets} = 7$$\n$$\\text{Subsets: } \\emptyset, \\{a\\}, \\{b\\}, \\{c\\}, \\{a, b\\}, \\{a, c\\}, \\{b, c\\}, \\{a, b, c\\}$$',
  },
  {
    id: 'we_sets_b7_03',
    title: 'Equal Sets & Unknown Value Deduction',
    problem: 'Given that set $P = \\{2x - 1, \\, 7, \\, 12\\}$ and set $Q = \\{7, \\, 12, \\, 15\\}$. If $P = Q$, determine the numerical value of $x$.',
    steps: [
      'Step 1 (Why we do this: Understand the definition of Equal Sets): Equal sets ($P = Q$) contain the exact same elements, regardless of arrangement.',
      'Step 2 (Why we do this: Match known corresponding terms): Elements 7 and 12 are already present in both sets.',
      'Step 3 (Why we do this: Equate the remaining expressions): The remaining term in $P$ must equal the remaining term in $Q$: $2x - 1 = 15$.',
      'Step 4 (Why we do this: Solve the resulting linear equation): Add 1 to both sides: $2x = 15 + 1 = 16$. Divide by 2: $x = \\frac{16}{2} = 8$.',
      'Step 5 (Why we do this: Verify consistency): Substitute $x = 8$ back into $P$: $2(8) - 1 = 16 - 1 = 15$. Set $P = \\{15, 7, 12\\}$, which is identical to set $Q$.',
    ],
    finalAnswer: '$$x = 8$$',
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

  const existingData = snap.data();
  console.log('Current document found. Levels present:', Object.keys(existingData?.levels || {}));

  // Perform atomic update on b7.workedExamples and jhs1.workedExamples
  await docRef.update({
    'levels.b7.workedExamples': updatedWorkedExamples,
    'levels.jhs1.workedExamples': updatedWorkedExamples,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log('✅ Successfully patched levels.b7.workedExamples and levels.jhs1.workedExamples with self-teaching scaffolding.');

  // Synchronize local JSON payloads
  ['payloads/topic_sets_and_venn_diagrams.json', 'payloads/topics/topic_sets_and_venn_diagrams.json'].forEach((relPath) => {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const payload = JSON.parse(raw);
      if (payload.levels?.b7) {
        payload.levels.b7.workedExamples = updatedWorkedExamples;
      }
      if (payload.levels?.jhs1) {
        payload.levels.jhs1.workedExamples = updatedWorkedExamples;
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

/**
 * Seeding Script for Topical Practice Labs (Unit & Strand Drills)
 * Path: scripts/seedTopicalLabs.ts
 *
 * Populates:
 * 1. Subject manifest at: global_curriculum/jhs/subjects/math
 * 2. Topic documents at: global_curriculum/jhs/subjects/math/topics/topic_<slug>
 *
 * Adheres strictly to:
 * - 1-document read guarantee (all tiers and pools stored within the single topic doc)
 * - Payload size verification against Firestore 1 MiB limit
 *
 * Run with:
 *   npx tsx scripts/seedTopicalLabs.ts
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
        credential: cert(serviceAccountPath)
      });
    } else if (fs.existsSync(fallbackKeyPath)) {
      adminApp = initializeApp({
        credential: cert(fallbackKeyPath)
      });
    } else {
      adminApp = initializeApp({ projectId });
    }
  }
  db = getFirestore();
} catch (error) {
  console.warn('[seedTopicalLabs] Firebase Admin initialization error:', error);
}

const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('--validate-only');

// All 8 Core Topics for JHS Mathematics (Ghanaian National Curriculum / BECE)
const JHS_MATH_MANIFEST = {
  subject: 'Mathematics',
  tier: 'Junior Secondary (JHS)',
  totalTopics: 8,
  topics: [
    {
      id: 'topic_ratio_and_proportion',
      title: 'Ratio, Proportion & Rates',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 27,
      hasNotes: true,
      description: 'Master foundational direct comparison, multi-tier sharing, inverse proportions, and compound commercial rates.'
    },
    {
      id: 'topic_algebraic_expressions',
      title: 'Algebraic Expressions & Equations',
      strand: 'Strand 2: Patterns & Algebra',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 27,
      hasNotes: true,
      description: 'Algebraic terminology, simplification, linear equations, factorization, and change of subject.'
    },
    {
      id: 'topic_numbers_and_numeration',
      title: 'Numbers, Numeration & Operations',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 27,
      hasNotes: true,
      description: 'Comprehensive mastery of integers, place values, prime factorization, non-decimal bases, index laws, fractions, and standard form.'
    },
    {
      id: 'topic_linear_equations_and_inequalities',
      title: 'Linear Equations & Inequalities',
      strand: 'Strand 2: Patterns & Algebra',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Single-variable linear inequalities, truth sets, number line graphs, and word problem modeling.'
    },
    {
      id: 'topic_geometry_and_construction',
      title: 'Plane Geometry & Geometric Construction',
      strand: 'Strand 3: Geometry & Measurement',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Angles, parallel lines, compass triangle constructions, mediators, and circumcircles.'
    },
    {
      id: 'topic_mensuration_perimeter_area_volume',
      title: 'Mensuration: Perimeter, Area & Volume',
      strand: 'Strand 3: Geometry & Measurement',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Polygons, circles, surface areas of prisms, cylinders, and volumetric displacement.'
    },
    {
      id: 'topic_data_handling_and_probability',
      title: 'Data Handling, Statistics & Probability',
      strand: 'Strand 4: Data & Statistics',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Frequency tables, bar charts, pie charts, mean, median, mode, and simple experimental probability.'
    },
    {
      id: 'topic_sets_and_operations',
      title: 'Set Theory, Operations & Venn Modeling',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Listing elements, set builder notation, union, intersection, and universal two-set Venn diagrams.'
    }
  ]
};

async function seedTopicLabDoc(payloadFile: string): Promise<void> {
  const filePath = path.join(__dirname, 'payloads', 'topics', payloadFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Payload file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  const payload = {
    ...data,
    seededAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const jsonString = JSON.stringify(payload);
  const sizeBytes = Buffer.byteLength(jsonString, 'utf8');
  const sizeKb = (sizeBytes / 1024).toFixed(2);
  const MAX_LIMIT = 1048576; // 1 MiB

  console.log(`\n----------------------------------------------------------------`);
  console.log(`📦 Preparing Topic Lab: "${data.title}" [ID: ${data.id}]`);
  console.log(`   Document Size: ${sizeBytes} bytes (~${sizeKb} KB) [Limit: 1 MiB, ${(sizeBytes / MAX_LIMIT * 100).toFixed(2)}% used]`);

  if (sizeBytes >= MAX_LIMIT) {
    throw new Error(`Document exceeds Firestore 1 MiB cap! Size: ${sizeBytes} bytes`);
  }

  const docPath = `global_curriculum/jhs/subjects/math/topics/${data.id}`;

  if (isDryRun || !db) {
    console.log(`🔍 [VALIDATED] Target: ${docPath}`);
  } else {
    const docRef = db.doc(docPath);
    await docRef.set({
      ...payload,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`✅ [WRITTEN] ${docPath}`);
  }
}

async function runSeeding() {
  console.log('================================================================');
  console.log('🚀 SEEDING TOPICAL PRACTICE LABS (UNIT & STRAND DRILLS)');
  console.log('================================================================');

  // 1. Seed Subject Topics Manifest
  const manifestPath = 'global_curriculum/jhs/subjects/math/manifests/topical_labs';
  const legacyManifestPath = 'global_curriculum/jhs/subjects/math';
  console.log(`\n📋 Ingesting Subject Topics Manifest at: ${manifestPath}...`);
  if (!isDryRun && db) {
    const manifestRef = db.doc(manifestPath);
    await manifestRef.set({
      ...JHS_MATH_MANIFEST,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    // Also keep root subject doc synchronized
    const legacyRef = db.doc(legacyManifestPath);
    await legacyRef.set({
      ...JHS_MATH_MANIFEST,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ [WRITTEN] Subject manifest synchronized with ${JHS_MATH_MANIFEST.totalTopics} topics at ${manifestPath}.`);
  } else {
    console.log(`🔍 [VALIDATED] Manifest with ${JHS_MATH_MANIFEST.totalTopics} topics ready.`);
  }

  // 2. Seed Topics
  await seedTopicLabDoc('topic_ratio_and_proportion.json');
  await seedTopicLabDoc('topic_algebraic_expressions.json');
  await seedTopicLabDoc('topic_numbers_and_numeration.json');

  console.log('\n================================================================');
  console.log('🎉 TOPICAL PRACTICE LABS SEEDING COMPLETE!');
  console.log('================================================================\n');
}

runSeeding().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});

/**
 * Script to seed the Global Shared Curriculum Repository in Firestore.
 * 
 * Path Structure:
 * global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicId}/question_sets/{setId}
 * 
 * Run with:
 * npx tsx scripts/seed-global-curriculum.ts
 */

import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import {
  SAMPLE_GLOBAL_QUESTION_SETS,
  getGlobalQuestionSetDocPath,
  validateCurriculumQuestionSet
} from '../src/lib/global-curriculum-service';
import { GlobalCurriculumLevelId } from '../src/lib/global-curriculum-types';

dotenv.config();

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    initializeApp({ projectId });
  }
}

const db = getFirestore();

async function seedGlobalCurriculum() {
  console.log('🚀 Starting Global Shared Curriculum Seeding...');

  const levels: GlobalCurriculumLevelId[] = ['lower_primary', 'upper_primary', 'jhs', 'shs'];
  let totalSeeded = 0;

  for (const levelId of levels) {
    const items = SAMPLE_GLOBAL_QUESTION_SETS[levelId] || [];
    console.log(`\n📚 Processing level: "${levelId}" (${items.length} question set(s))...`);

    // Ensure the level root doc exists with metadata
    await db.collection('global_curriculum').doc(levelId).set({
      levelId,
      updatedAt: FieldValue.serverTimestamp(),
      active: true
    }, { merge: true });

    for (const item of items) {
      const { subjectId, topicId, questionSet } = item;
      
      // Validate schema
      const validation = validateCurriculumQuestionSet(questionSet);
      if (!validation.valid) {
        console.error(`❌ Validation failed for set "${questionSet.id}":`, validation.errors);
        continue;
      }

      // Ensure subject document exists
      const subjectDocRef = db
        .collection('global_curriculum')
        .doc(levelId)
        .collection('subjects')
        .doc(subjectId);
      
      await subjectDocRef.set({
        id: subjectId,
        name: questionSet.subject,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      // Ensure topic document exists
      const topicDocRef = subjectDocRef
        .collection('topics')
        .doc(topicId);
      
      await topicDocRef.set({
        id: topicId,
        title: questionSet.topic,
        subjectId,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      // Save question set
      const questionSetDocRef = topicDocRef
        .collection('question_sets')
        .doc(questionSet.id);

      await questionSetDocRef.set({
        ...questionSet,
        seededAt: FieldValue.serverTimestamp(),
        lastUpdated: FieldValue.serverTimestamp()
      });

      const docPath = getGlobalQuestionSetDocPath(levelId, subjectId, topicId, questionSet.id);
      console.log(`  ✅ Seeded: ${docPath} ("${questionSet.title}")`);
      totalSeeded++;
    }
  }

  console.log(`\n🎉 Successfully verified and seeded ${totalSeeded} question set(s) into global_curriculum!`);
}

seedGlobalCurriculum().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});

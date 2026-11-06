import fs from 'fs';
import path from 'path';

for (const envFile of ['.env.local', '.env']) {
  const fullPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(fullPath)) {
    const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

export type MigrationMode = 'dry-run' | 'write-private' | 'sanitize-public';

export interface SchoolParadoxPublicDoc {
  id: string;
  schoolId: string;
  question: string;
  targetGroup: string;
  difficulty: string | null;
  isCentral: false;
  createdAt: unknown;
}

export interface SchoolParadoxPrivateDoc {
  id: string;
  schoolId: string;
  answer: string;
  explanation: string;
  evaluation?: Record<string, unknown>;
  migratedAt?: unknown;
  schemaVersion: 2;
}

export interface MigrationReport {
  mode: MigrationMode;
  projectId: string;
  sourceParadoxCount: number;
  eligibleCount: number;
  missingSchoolIdIds: string[];
  missingQuestionIds: string[];
  missingAnswerOrExplanationIds: string[];
  duplicateOrInvalidIds: string[];
  privateDocsWritten: number;
  privateDocsVerified: number;
  existingPublicDocsModified: number;
  publicDocsSanitized: number;
  publicDocsAlreadySanitized: number;
  publicDocsContainingPrivateFieldsAfter: number;
}

const FORBIDDEN_PUBLIC_FIELDS = [
  'answer',
  'explanation',
  'evaluation',
  'acceptedExpressions',
  'partialConcepts',
  'commonTraps',
  'coachingHint',
  'acceptedConclusions',
  'prohibitedConclusions',
  'reasoningKeywords',
  'contradictionPairs',
];

const ALLOWED_PUBLIC_KEYS = new Set([
  'id',
  'schoolId',
  'question',
  'targetGroup',
  'difficulty',
  'isCentral',
  'createdAt',
]);

export function buildPublicSchoolParadoxDoc(
  docId: string,
  raw: Record<string, any>
): SchoolParadoxPublicDoc {
  return {
    id: docId,
    schoolId: String(raw.schoolId ?? '').trim(),
    question: String(raw.question ?? '').trim(),
    targetGroup:
      typeof raw.targetGroup === 'string' && raw.targetGroup.trim()
        ? raw.targetGroup.trim()
        : 'Scholar (JHS)',
    difficulty:
      typeof raw.difficulty === 'string' && raw.difficulty.trim()
        ? raw.difficulty.trim()
        : null,
    isCentral: false,
    createdAt: raw.createdAt ?? null,
  };
}

export function buildPrivateSchoolParadoxDoc(
  docId: string,
  raw: Record<string, any>,
  migratedAtValue: unknown
): SchoolParadoxPrivateDoc {
  const doc: SchoolParadoxPrivateDoc = {
    id: docId,
    schoolId: String(raw.schoolId ?? '').trim(),
    answer: String(raw.answer ?? '').trim(),
    explanation: String(raw.explanation ?? '').trim(),
    migratedAt: migratedAtValue,
    schemaVersion: 2,
  };

  if (raw.evaluation && typeof raw.evaluation === 'object' && !Array.isArray(raw.evaluation)) {
    doc.evaluation = raw.evaluation as Record<string, unknown>;
  }

  return doc;
}

function isAlreadySanitizedPublicDoc(
  raw: Record<string, any>,
  expected: SchoolParadoxPublicDoc
): boolean {
  const rawKeys = Object.keys(raw);
  if (rawKeys.some((k) => !ALLOWED_PUBLIC_KEYS.has(k))) {
    return false;
  }
  if (rawKeys.some((k) => FORBIDDEN_PUBLIC_FIELDS.includes(k))) {
    return false;
  }
  return (
    raw.id === expected.id &&
    raw.schoolId === expected.schoolId &&
    raw.question === expected.question &&
    raw.targetGroup === expected.targetGroup &&
    (raw.difficulty ?? null) === expected.difficulty &&
    raw.isCentral === false
  );
}

const EXPECTED_PROJECT_ID = 'gamedu-69888475-f5783';

async function runMigration() {
  const mode: MigrationMode = process.argv.includes('--sanitize-public')
    ? 'sanitize-public'
    : process.argv.includes('--write-private')
    ? 'write-private'
    : 'dry-run';

  if (mode === 'dry-run') {
    console.log('DRY RUN: No Firestore documents will be modified.');
  }

  const { getAdminApp, getAdminDb, FieldValue } = await import('@/lib/firebaseAdmin');
  const adminApp = getAdminApp();
  const db = getAdminDb();

  const resolvedProjectId =
    String((db as any).projectId || adminApp.options.projectId || '').trim();

  if (resolvedProjectId !== EXPECTED_PROJECT_ID) {
    throw new Error(
      `Unexpected Firebase project: "${resolvedProjectId}" (expected "${EXPECTED_PROJECT_ID}")`
    );
  }
  const projectId = resolvedProjectId;

  const [v1Snap, v2Snap, sourceSnap] = await Promise.all([
    db.collection('global_curriculum').doc('think_tank_v1').get(),
    db.collection('global_curriculum').doc('think_tank_v2').get(),
    db.collection('think_tank_paradoxes').get(),
  ]);

  if (v1Snap.exists && v2Snap.exists) {
    const v1 = v1Snap.data()!;
    const v2 = v2Snap.data()!;
    console.log('=== Canonical v1 vs v2 Manifest Parity Check ===');
    console.log(
      `  v1 (${v1.version}): paradoxes=${v1.paradoxCount}, cases=${v1.caseCount}, riddles=${v1.riddleCount}, debates=${v1.debateCount}, total=${v1.totalCount}`
    );
    console.log(
      `  v2 (${v2.version}): paradoxes=${v2.paradoxCount}, cases=${v2.caseCount}, riddles=${v2.riddleCount}, debates=${v2.debateCount}, total=${v2.totalCount}`
    );
  }

  const report: MigrationReport = {
    mode,
    projectId,
    sourceParadoxCount: sourceSnap.size,
    eligibleCount: 0,
    missingSchoolIdIds: [],
    missingQuestionIds: [],
    missingAnswerOrExplanationIds: [],
    duplicateOrInvalidIds: [],
    privateDocsWritten: 0,
    privateDocsVerified: 0,
    existingPublicDocsModified: 0,
    publicDocsSanitized: 0,
    publicDocsAlreadySanitized: 0,
    publicDocsContainingPrivateFieldsAfter: 0,
  };

  if (mode === 'sanitize-public') {
    for (const docSnap of sourceSnap.docs) {
      const paradoxId = docSnap.id;
      const publicRef = db.collection('think_tank_paradoxes').doc(paradoxId);
      const privateRef = db.collection('think_tank_private_paradoxes').doc(paradoxId);

      let wasModified = false;

      await db.runTransaction(async (tx) => {
        const [pubTxSnap, privTxSnap] = await Promise.all([
          tx.get(publicRef),
          tx.get(privateRef),
        ]);

        if (!pubTxSnap.exists) {
          throw new Error(`Public paradox document missing: think_tank_paradoxes/${paradoxId}`);
        }
        if (!privTxSnap.exists) {
          throw new Error(
            `Private paradox document missing for think_tank_paradoxes/${paradoxId}. Aborting sanitization.`
          );
        }

        const original = (pubTxSnap.data() ?? {}) as Record<string, any>;
        const privateData = (privTxSnap.data() ?? {}) as Record<string, any>;

        const pubSchoolId = typeof original.schoolId === 'string' ? original.schoolId.trim() : '';
        const privSchoolId =
          typeof privateData.schoolId === 'string' ? privateData.schoolId.trim() : '';

        if (!pubSchoolId || !privSchoolId || pubSchoolId !== privSchoolId) {
          throw new Error(
            `School ID mismatch or missing for paradox ${paradoxId} (public="${pubSchoolId}", private="${privSchoolId}")`
          );
        }

        const question = typeof original.question === 'string' ? original.question.trim() : '';
        if (!question) {
          throw new Error(`Public paradox ${paradoxId} is missing a valid question.`);
        }

        const answer = typeof privateData.answer === 'string' ? privateData.answer.trim() : '';
        const explanation =
          typeof privateData.explanation === 'string' ? privateData.explanation.trim() : '';
        if (!answer || !explanation) {
          throw new Error(
            `Private paradox ${paradoxId} is missing valid answer or explanation. Aborting sanitization.`
          );
        }

        if (
          privateData.evaluation !== undefined &&
          privateData.evaluation !== null &&
          (typeof privateData.evaluation !== 'object' || Array.isArray(privateData.evaluation))
        ) {
          throw new Error(`Private paradox ${paradoxId} has malformed evaluation rubric.`);
        }

        const publicData = buildPublicSchoolParadoxDoc(paradoxId, original);
        const alreadyClean = isAlreadySanitizedPublicDoc(original, publicData);

        if (!alreadyClean) {
          tx.set(publicRef, publicData);
          wasModified = true;
        }
      });

      report.eligibleCount++;
      if (wasModified) {
        report.existingPublicDocsModified++;
        report.publicDocsSanitized++;
      } else {
        report.publicDocsAlreadySanitized++;
      }

      // Read back both documents and verify contents
      const [verifyPubSnap, verifyPrivSnap] = await Promise.all([
        publicRef.get(),
        privateRef.get(),
      ]);

      if (!verifyPubSnap.exists || !verifyPrivSnap.exists) {
        throw new Error(`Post-sanitization readback failed for ${paradoxId}`);
      }

      const verifyPub = (verifyPubSnap.data() ?? {}) as Record<string, any>;
      const verifyPriv = (verifyPrivSnap.data() ?? {}) as Record<string, any>;

      const leakedFields = FORBIDDEN_PUBLIC_FIELDS.filter((f) => f in verifyPub);
      const unexpectedKeys = Object.keys(verifyPub).filter((k) => !ALLOWED_PUBLIC_KEYS.has(k));

      if (leakedFields.length > 0 || unexpectedKeys.length > 0) {
        report.publicDocsContainingPrivateFieldsAfter++;
        throw new Error(
          `Sanitized public document ${paradoxId} still contains forbidden/unexpected keys: ${[
            ...leakedFields,
            ...unexpectedKeys,
          ].join(', ')}`
        );
      }

      if (
        verifyPub.id !== paradoxId ||
        !verifyPub.schoolId ||
        verifyPub.schoolId !== verifyPriv.schoolId ||
        !verifyPub.question ||
        verifyPub.isCentral !== false
      ) {
        throw new Error(`Sanitized public document ${paradoxId} failed metadata verification.`);
      }

      if (!verifyPriv.answer || !verifyPriv.explanation) {
        throw new Error(`Private document ${paradoxId} was damaged or incomplete after sanitization.`);
      }

      report.privateDocsVerified++;
    }

    console.log('\n=== School-Created Paradoxes Sanitization Report ===');
    console.log(`  Mode:                                        ${report.mode}`);
    console.log(`  Firebase Project ID:                         ${report.projectId}`);
    console.log(`  Original public records:                     ${report.sourceParadoxCount}`);
    console.log(`  Matching private records verified:           ${report.privateDocsVerified}`);
    console.log(`  Public records sanitized (modified):         ${report.publicDocsSanitized}`);
    console.log(`  Public records already sanitized (no-op):    ${report.publicDocsAlreadySanitized}`);
    console.log(`  Public docs containing private fields after: ${report.publicDocsContainingPrivateFieldsAfter}`);
    return;
  }

  const seenIds = new Set<string>();
  const eligiblePairs: Array<{
    id: string;
    publicDoc: SchoolParadoxPublicDoc;
    privateDoc: SchoolParadoxPrivateDoc;
  }> = [];

  for (const docSnap of sourceSnap.docs) {
    const docId = docSnap.id;
    const raw = (docSnap.data() ?? {}) as Record<string, any>;

    if (!docId || typeof docId !== 'string' || docId.length > 200 || seenIds.has(docId)) {
      report.duplicateOrInvalidIds.push(docId || '<empty-id>');
      continue;
    }
    seenIds.add(docId);

    const schoolId = typeof raw.schoolId === 'string' ? raw.schoolId.trim() : '';
    if (!schoolId) {
      report.missingSchoolIdIds.push(docId);
      continue;
    }

    const question = typeof raw.question === 'string' ? raw.question.trim() : '';
    if (!question) {
      report.missingQuestionIds.push(docId);
      continue;
    }

    const answer = typeof raw.answer === 'string' ? raw.answer.trim() : '';
    const explanation = typeof raw.explanation === 'string' ? raw.explanation.trim() : '';
    if (!answer || !explanation) {
      report.missingAnswerOrExplanationIds.push(docId);
      continue;
    }

    const publicDoc = buildPublicSchoolParadoxDoc(docId, raw);
    const privateDoc = buildPrivateSchoolParadoxDoc(
      docId,
      raw,
      mode === 'write-private' ? FieldValue.serverTimestamp() : 'DRY_RUN_TIMESTAMP'
    );

    eligiblePairs.push({ id: docId, publicDoc, privateDoc });
    report.eligibleCount++;
  }

  if (mode === 'write-private') {
    for (const item of eligiblePairs) {
      const privRef = db.collection('think_tank_private_paradoxes').doc(item.id);
      const existingSnap = await privRef.get();

      if (existingSnap.exists) {
        const existingData = (existingSnap.data() ?? {}) as Record<string, any>;
        if (
          existingData.schoolId !== item.privateDoc.schoolId ||
          existingData.answer !== item.privateDoc.answer ||
          existingData.explanation !== item.privateDoc.explanation
        ) {
          throw new Error(
            `Refusing to overwrite existing think_tank_private_paradoxes/${item.id} with conflicting data.`
          );
        }
      } else {
        await privRef.create(item.privateDoc);
        report.privateDocsWritten++;
      }

      const verifySnap = await privRef.get();
      const verifiedData = verifySnap.data() as Record<string, any> | undefined;
      if (
        !verifySnap.exists ||
        !verifiedData ||
        verifiedData.schoolId !== item.privateDoc.schoolId ||
        verifiedData.answer !== item.privateDoc.answer ||
        verifiedData.explanation !== item.privateDoc.explanation
      ) {
        throw new Error(`Verification failed for think_tank_private_paradoxes/${item.id}`);
      }
      report.privateDocsVerified++;
    }
  }

  console.log('\n=== School-Created Paradoxes Migration Report ===');
  console.log(`  Mode:                                ${report.mode}`);
  console.log(`  Firebase Project ID:                 ${report.projectId}`);
  console.log(`  Source paradox count:                ${report.sourceParadoxCount}`);
  console.log(`  Eligible for migration:              ${report.eligibleCount}`);
  console.log(`  Missing schoolId:                    ${report.missingSchoolIdIds.length}`);
  console.log(`  Missing question:                    ${report.missingQuestionIds.length}`);
  console.log(`  Missing canonical answer/explanation:${report.missingAnswerOrExplanationIds.length}`);
  console.log(`  Duplicate/invalid IDs:               ${report.duplicateOrInvalidIds.length}`);
  console.log(`  Private document writes:             ${report.privateDocsWritten}`);
  console.log(`  Private documents verified:          ${report.privateDocsVerified}`);
  console.log(`  Existing public documents modified:  ${report.existingPublicDocsModified}`);
}

runMigration().catch((err) => {
  console.error('Migration failed:', err?.message || err);
  process.exit(1);
});

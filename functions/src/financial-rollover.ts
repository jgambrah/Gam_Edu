import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function getAdminDb() {
  const existingApps = getApps();
  const adminApp = existingApps.find(app => app.name === 'admin');
  if (adminApp) return getFirestore(adminApp);
  if (existingApps.length > 0) return getFirestore(existingApps[0]);

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    const formattedKey = privateKeyRaw.replace(/\\n/g, '\n').replace(/"/g, '');
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
    }, 'admin');
    return getFirestore(app);
  }

  const defaultApp = initializeApp();
  return getFirestore(defaultApp);
}

export interface ItemizedArrears {
  tuitionArrears: number;
  busArrears: number;
  canteenArrears: number;
  examArrears: number;
  otherArrears: number;
  totalArrears: number;
}

/**
 * executeTermFinancialRollover
 *
 * Idempotent serverless routine to calculate itemized unpaid balances at term end,
 * write opening "Arrears Brought Forward" documents with deterministic IDs,
 * and mark raw term financial records as archived.
 */
export async function executeTermFinancialRollover(
  schoolId: string,
  currentTermId: string,
  nextTermId: string
): Promise<{ success: boolean; processedStudents: number; totalArrearsCarried: number }> {
  const db = getAdminDb();

  // 1. Fetch active students for this school
  const studentsSnap = await db.collection('students')
    .where('schoolId', '==', schoolId)
    .where('isArchived', '!=', true)
    .get();

  const studentMap = new Map<string, string>();
  studentsSnap.forEach(sDoc => {
    const s = sDoc.data();
    if (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) {
      studentMap.set(sDoc.id, `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student');
    }
  });

  // 2. Fetch current term financial records for this school
  const recordsSnap = await db.collection('financialRecords')
    .where('schoolId', '==', schoolId)
    .where('termId', '==', currentTermId)
    .where('isArchived', '!=', true)
    .get();

  const studentBalances: Record<string, ItemizedArrears> = {};

  recordsSnap.forEach(doc => {
    const r = doc.data();
    const studentId = r.studentId as string;
    if (!studentId || !studentMap.has(studentId)) return;

    if (!studentBalances[studentId]) {
      studentBalances[studentId] = {
        tuitionArrears: 0,
        busArrears: 0,
        canteenArrears: 0,
        examArrears: 0,
        otherArrears: 0,
        totalArrears: 0,
      };
    }

    const billed = Number(r.billedAmount ?? r.amount ?? 0);
    const paid = Number(r.amountPaid ?? 0);
    const waiver = Number(r.waiverAmount ?? 0);
    const balance = billed - paid - waiver;

    if (balance <= 0.01) return;

    const category = (r.category || r.type || 'tuition').toLowerCase();
    if (category.includes('bus') || category.includes('transport')) {
      studentBalances[studentId].busArrears += balance;
    } else if (category.includes('canteen') || category.includes('feeding') || category.includes('mess')) {
      studentBalances[studentId].canteenArrears += balance;
    } else if (category.includes('exam') || category.includes('test')) {
      studentBalances[studentId].examArrears += balance;
    } else if (category.includes('tuition') || category.includes('fee')) {
      studentBalances[studentId].tuitionArrears += balance;
    } else {
      studentBalances[studentId].otherArrears += balance;
    }

    studentBalances[studentId].totalArrears += balance;
  });

  // 3. Batch write itemized "Arrears Brought Forward" opening balance & archive raw records
  const batch = db.batch();
  let totalArrearsCarried = 0;
  let processedCount = 0;

  for (const [studentId, arrears] of Object.entries(studentBalances)) {
    if (arrears.totalArrears <= 0.01) continue;

    // Strict Idempotent Document ID: arrears_${schoolId}_${studentId}_${nextTermId}
    const docId = `arrears_${schoolId}_${studentId}_${nextTermId}`;
    const arrearsRef = db.collection('financialRecords').doc(docId);

    batch.set(arrearsRef, {
      id: docId,
      schoolId,
      studentId,
      studentName: studentMap.get(studentId) || 'Student',
      termId: nextTermId,
      title: 'Arrears Brought Forward',
      category: 'Arrears',
      billedAmount: arrears.totalArrears,
      amountPaid: 0,
      waiverAmount: 0,
      itemizedArrears: {
        tuitionArrears: arrears.tuitionArrears,
        busArrears: arrears.busArrears,
        canteenArrears: arrears.canteenArrears,
        examArrears: arrears.examArrears,
        otherArrears: arrears.otherArrears,
      },
      status: 'Pending',
      isArchived: false,
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    totalArrearsCarried += arrears.totalArrears;
    processedCount++;
  }

  // 4. Flag raw financial records for ending term as archived (non-destructive)
  recordsSnap.forEach(rDoc => {
    batch.update(rDoc.ref, { isArchived: true });
  });

  // 5. Update school settings term pointers
  const schoolRef = db.collection('schoolSettings').doc(schoolId);
  batch.set(schoolRef, {
    currentTermId: nextTermId,
    lastTermRolloverAt: FieldValue.serverTimestamp(),
    termStatus: 'Active',
  }, { merge: true });

  await batch.commit();

  return {
    success: true,
    processedStudents: processedCount,
    totalArrearsCarried,
  };
}

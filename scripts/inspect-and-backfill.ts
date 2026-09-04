import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

dotenv.config();

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
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

function classifyCategory(item: any): 'tuition' | 'canteen' | 'transport' | 'boarding' | 'uniforms' | 'other' {
  if (!item) return 'tuition';
  const text = `${item.type || ''} ${item.category || ''} ${item.description || ''} ${item.feeType || ''} ${item.notes || ''} ${item.name || ''} ${item.title || ''} ${item.paymentType || ''} ${item.narration || ''} ${item.paymentNarration || ''} ${item.item || ''}`.toLowerCase();

  if (text.includes('canteen') || text.includes('feed') || text.includes('lunch') || text.includes('meal') || text.includes('food') || text.includes('cafeteria')) {
    return 'canteen';
  }
  if (text.includes('bus') || text.includes('transport') || text.includes('fare') || text.includes('shuttle') || text.includes('transit') || text.includes('vehicle')) {
    return 'transport';
  }
  if (text.includes('boarding') || text.includes('hostel') || text.includes('dorm') || text.includes('accommodation')) {
    return 'boarding';
  }
  if (text.includes('uniform') || text.includes('book') || text.includes('textbook') || text.includes('stationery') || text.includes('crest') || text.includes('jersey') || text.includes('exercise')) {
    return 'uniforms';
  }
  if (text.includes('rent') || text.includes('hire') || text.includes('fine') || text.includes('penalty') || text.includes('transcript') || text.includes('certificate')) {
    return 'other';
  }
  return 'tuition';
}

async function inspectAndBackfill() {
  console.log('=== Inspecting Firestore Financial Collections ===\n');

  // Fetch all schools
  const schoolsSnap = await db.collection('schools').get();
  const schoolIds = new Set<string>();
  schoolsSnap.forEach(s => schoolIds.add(s.id));

  // Also search staff for schoolIds
  const staffSnap = await db.collection('staff').get();
  staffSnap.forEach(doc => {
    const sId = doc.data().schoolId;
    if (sId) schoolIds.add(sId);
  });

  console.log(`Found ${schoolIds.size} school IDs:`, Array.from(schoolIds));

  for (const schoolId of schoolIds) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Processing School ID: ${schoolId}`);

    // Active students
    const studentsSnap = await db.collection('students').where('schoolId', '==', schoolId).get();
    const activeStudentIds = new Set<string>();
    let totalStudents = 0, activeStudents = 0, withdrawnStudents = 0;
    studentsSnap.forEach(doc => {
      const d = doc.data();
      totalStudents++;
      if (d.enrollmentStatus === 'Active' || !d.enrollmentStatus) {
        activeStudents++;
        activeStudentIds.add(doc.id);
      } else if (d.enrollmentStatus === 'Withdrawn') {
        withdrawnStudents++;
      }
    });

    // 1. Fetch financialRecords
    const finSnap = await db.collection('financialRecords').where('schoolId', '==', schoolId).get();
    console.log(`  Financial Records count: ${finSnap.size}`);

    // 2. Fetch payments collectionGroup
    let paymentsSnap;
    try {
      paymentsSnap = await db.collectionGroup('payments').where('schoolId', '==', schoolId).get();
      console.log(`  Payments collectionGroup count: ${paymentsSnap.size}`);
    } catch (e: any) {
      console.log(`  Payments collectionGroup query error:`, e.message);
      paymentsSnap = { docs: [], forEach: () => {} } as any;
    }

    // 3. Fetch tills / transactions collectionGroup if any
    let tillsTransactionsSnap;
    try {
      tillsTransactionsSnap = await db.collectionGroup('transactions').where('schoolId', '==', schoolId).get();
      console.log(`  Transactions collectionGroup count: ${tillsTransactionsSnap.size}`);
    } catch (e: any) {
      console.log(`  Transactions collectionGroup query error:`, e.message);
      tillsTransactionsSnap = { docs: [], forEach: () => {} } as any;
    }

    let totalBilled = 0;
    let totalOutstanding = 0;
    let arrearsCount = 0;
    let current = 0, age30 = 0, age60 = 0, age90 = 0, overpayments = 0;

    const todayMs = new Date().setHours(0, 0, 0, 0);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthMs = monthStart.getTime();

    // Process billing metrics from financialRecords
    finSnap.forEach(doc => {
      const r = doc.data();
      if (r.status === 'Pending Reversal') return;
      if (r.studentId && !activeStudentIds.has(r.studentId) && activeStudentIds.size > 0) return;

      const billed = Number(r.billedAmount ?? r.amount ?? 0);
      const paid = Number(r.amountPaid ?? 0);
      const waiver = Number(r.waiverAmount ?? 0);
      const balance = billed - paid - waiver;

      totalBilled += billed;

      if (balance < 0) {
        overpayments += Math.abs(balance);
        return;
      }
      if (balance <= 0.01) return;

      totalOutstanding += balance;
      arrearsCount++;

      const dueTs = r.dueDate as Timestamp | undefined;
      const dueMs = dueTs?.toMillis?.() ?? (r.dueDate ? new Date(r.dueDate).getTime() : todayMs);
      const diffDays = Math.ceil((Date.now() - dueMs) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) current += balance;
      else if (diffDays <= 30) age30 += balance;
      else if (diffDays <= 60) age60 += balance;
      else age90 += balance;
    });

    // Process all payment records and transactions
    let totalRevenue = 0;
    let totalCollectedToday = 0;
    let totalCollectedThisMonth = 0;
    let totalCollectedThisTerm = 0;

    let tuitionStream = 0;
    let canteenStream = 0;
    let transportStream = 0;
    let boardingStream = 0;
    let uniformsStream = 0;
    let otherStream = 0;

    const processedKeys = new Set<string>();

    const processItem = (p: any, docId: string) => {
      if (!p) return;
      if (p.status === 'Reversed' || p.status === 'Cancelled' || p.status === 'Pending Reversal') return;
      const amount = Number(p.amount) || Number(p.amountPaid) || Number(p.totalAmount) || 0;
      if (amount <= 0) return;

      const refNo = p.referenceNo || p.reference_no || p.transactionId || p.receiptNo || docId;
      if (processedKeys.has(refNo)) return;
      processedKeys.add(refNo);

      const dateVal = p.paidAt || p.createdAt || p.date || p.timestamp;
      let pMs = 0;
      if (dateVal) {
        pMs = (dateVal as Timestamp).toMillis?.() ?? new Date(dateVal).getTime();
      }

      totalRevenue += amount;

      if (pMs >= todayMs) totalCollectedToday += amount;
      if (pMs >= monthMs) totalCollectedThisMonth += amount;
      totalCollectedThisTerm += amount; // cumulative

      const cat = classifyCategory(p);
      if (cat === 'tuition') tuitionStream += amount;
      else if (cat === 'canteen') canteenStream += amount;
      else if (cat === 'transport') transportStream += amount;
      else if (cat === 'boarding') boardingStream += amount;
      else if (cat === 'uniforms') uniformsStream += amount;
      else otherStream += amount;
    };

    if (paymentsSnap.docs) {
      paymentsSnap.docs.forEach((doc: any) => processItem(doc.data(), doc.id));
    }

    if (tillsTransactionsSnap.docs) {
      tillsTransactionsSnap.docs.forEach((doc: any) => processItem(doc.data(), doc.id));
    }

    // Also check financialRecords for payments array or lastPaymentAmount
    finSnap.forEach(doc => {
      const r = doc.data();
      if (r.payments && Array.isArray(r.payments) && r.payments.length > 0) {
        r.payments.forEach((p: any) => processItem(p, p.id || doc.id));
      } else if (r.amountPaid && Number(r.amountPaid) > 0) {
        processItem({
          amount: Number(r.amountPaid),
          paidAt: r.lastPaymentDate || r.createdAt || r.date,
          type: r.type || r.category || 'Tuition',
          description: r.description
        }, `record-${doc.id}`);
      }
    });

    const collectionRate = totalBilled > 0 ? Math.round((totalRevenue / totalBilled) * 100) : 0;

    console.log(`  SUMMARY RESULTS for ${schoolId}:`);
    console.log(`    Total Billed:          GH₵ ${totalBilled.toLocaleString()}`);
    console.log(`    Total Revenue:         GH₵ ${totalRevenue.toLocaleString()}`);
    console.log(`    Total Outstanding:     GH₵ ${totalOutstanding.toLocaleString()}`);
    console.log(`    Collection Rate:       ${collectionRate}%`);
    console.log(`    Streams:`);
    console.log(`      Tuition:   GH₵ ${tuitionStream.toLocaleString()}`);
    console.log(`      Canteen:   GH₵ ${canteenStream.toLocaleString()}`);
    console.log(`      Transport: GH₵ ${transportStream.toLocaleString()}`);
    console.log(`      Boarding:  GH₵ ${boardingStream.toLocaleString()}`);
    console.log(`      Uniforms:  GH₵ ${uniformsStream.toLocaleString()}`);
    console.log(`      Other:     GH₵ ${otherStream.toLocaleString()}`);

    // Update dashboard_summaries document in Firestore
    const summaryData = {
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      studentCount: { total: totalStudents, active: activeStudents, withdrawn: withdrawnStudents, new_this_month: 0 },
      financials: {
        totalCollectedToday,
        totalCollectedThisMonth,
        totalCollectedThisTerm: totalRevenue,
        totalCollectedThisYear: totalRevenue,
        totalOutstanding,
        totalBilled,
        totalRevenue,
        collectionRate,
        arrearsCount,
        lastPaymentAt: null,
        lastPaymentAmount: 0,
        streamBreakdown: {
          tuition: tuitionStream,
          canteen: canteenStream,
          transport: transportStream,
          auxiliary: boardingStream + uniformsStream + otherStream
        }
      },
      debtAging: {
        current,
        age30,
        age60,
        age90,
        overpayments,
      }
    };

    await db.collection('dashboard_summaries').doc(schoolId).set(summaryData, { merge: true });
    console.log(`  ✅ Successfully updated dashboard_summaries for school ${schoolId}`);
  }
}

inspectAndBackfill().catch(console.error);

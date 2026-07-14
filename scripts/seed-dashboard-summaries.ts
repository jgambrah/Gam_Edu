/**
 * seed-dashboard-summaries.ts
 *
 * One-time migration script. Run ONCE to backfill the dashboard_summaries
 * collection for all existing schools from historical data.
 *
 * Usage:
 *   npx ts-node scripts/seed-dashboard-summaries.ts
 */

import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

dotenv.config();

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
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
    initializeApp();
  }
}

const db = getFirestore();


function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function todayStartMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

async function seedSchool(schoolId: string): Promise<void> {
  console.log(`\n[${schoolId}] Starting seed...`);

  // 1. Student counts
  const studentsSnap = await db.collection('students').where('schoolId', '==', schoolId).get();
  let totalStudents = 0, activeStudents = 0, withdrawnStudents = 0;
  const activeStudentIds = new Set<string>();
  studentsSnap.forEach(doc => {
    const d = doc.data();
    totalStudents++;
    const isStudentActive = d.enrollmentStatus === 'Active' || !d.enrollmentStatus;
    if (isStudentActive) {
      activeStudents++;
      activeStudentIds.add(doc.id);
    }
    if (d.enrollmentStatus === 'Withdrawn') withdrawnStudents++;
  });
  console.log(`  Students: total=${totalStudents}, active=${activeStudents}, withdrawn=${withdrawnStudents}`);

  // 2. Staff counts
  const staffSnap = await db.collection('staff').where('schoolId', '==', schoolId).get();
  const totalStaff = staffSnap.size;
  console.log(`  Staff: ${totalStaff}`);

  // 3. Today's attendance
  const today = todayStr();
  const startOfToday = new Date(today + 'T00:00:00.000Z');
  const todayTimestamp = Timestamp.fromDate(startOfToday);

  const attSnap = await db.collection('attendance')
    .where('schoolId', '==', schoolId)
    .where('date', '==', todayTimestamp)
    .get();

  let present = 0, absent = 0, late = 0;
  const absentIds: string[] = [];
  attSnap.forEach(doc => {
    const d = doc.data();
    if (d.status === 'Present') present++;
    else if (d.status === 'Absent') { absent++; if (absentIds.length < 25) absentIds.push(d.studentId); }
    else if (d.status === 'Late') late++;
  });
  const total = present + absent + late;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  // 4. Financial aggregates
  const finSnap = await db.collection('financialRecords').where('schoolId', '==', schoolId).get();
  const paymentsSnap = await db.collectionGroup('payments').where('schoolId', '==', schoolId).get();

  let totalOutstanding = 0, arrearsCount = 0, totalCollectedToday = 0, totalCollectedThisMonth = 0;
  let totalBilled = 0, totalRevenue = 0;
  let current = 0, age30 = 0, age60 = 0, age90 = 0, overpayments = 0;

  const todayMs = todayStartMs();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthMs = monthStart.getTime();

  // Process billing metrics from parent financial records
  finSnap.forEach(doc => {
    const r = doc.data();
    if (r.status === 'Pending Reversal') return;
    if (!activeStudentIds.has(r.studentId)) return;

    const billed = Number(r.billedAmount ?? r.amount ?? 0);
    const paid = Number(r.amountPaid ?? 0);
    const waiver = Number(r.waiverAmount ?? 0);
    const balance = billed - paid - waiver;

    totalBilled += billed;
    totalRevenue += paid;

    if (balance < 0) {
      overpayments += Math.abs(balance);
      return;
    }
    if (balance <= 0.01) return;

    totalOutstanding += balance;
    arrearsCount++;

    const dueTs = r.dueDate as Timestamp | undefined;
    const dueMs = dueTs?.toMillis?.() ?? (r.dueDate ? new Date(r.dueDate).getTime() : todayMs);
    const diffTime = new Date().getTime() - dueMs;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      current += balance;
    } else if (diffDays <= 30) {
      age30 += balance;
    } else if (diffDays <= 60) {
      age60 += balance;
    } else {
      age90 += balance;
    }
  });

  // Process collections from payments collectionGroup
  paymentsSnap.forEach(pDoc => {
    const p = pDoc.data();
    if (p.studentId && !activeStudentIds.has(p.studentId)) return;

    const amount = Number(p.amount) || 0;
    if (amount <= 0) return;

    const dateVal = p.paidAt || p.createdAt || p.date;
    if (!dateVal) return;

    const pTs = dateVal as Timestamp;
    const pMs = pTs.toMillis?.() ?? (dateVal ? new Date(dateVal).getTime() : 0);

    if (pMs >= todayMs) {
      totalCollectedToday += amount;
    }
    if (pMs >= monthMs) {
      totalCollectedThisMonth += amount;
    }
  });

  const collectionRate = totalBilled > 0 
    ? Math.round((totalRevenue / totalBilled) * 100) 
    : 0;

  // 5. Pending admissions
  const admSnap = await db.collection('admissionApplications').where('schoolId', '==', schoolId).where('status', '==', 'Pending Review').get();
  const pendingAdmissions = admSnap.size;

  // 6. Behavioral this week
  const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const behSnap = await db.collection('behavioral_records').where('schoolId', '==', schoolId).get();
  let incidentsThisWeek = 0, positiveThisWeek = 0;
  behSnap.forEach(doc => {
    const d = doc.data();
    const ms = (d.date as Timestamp)?.toMillis?.() ?? 0;
    if (ms >= weekAgoMs) {
      if (d.incidentType === 'Infraction') incidentsThisWeek++;
      if (d.incidentType === 'Positive Behavior') positiveThisWeek++;
    }
  });

  // 7. Staff present today
  const staffAttSnap = await db.collection('staff_attendance').where('schoolId', '==', schoolId).where('type', '==', 'In').get();
  const presentStaffSet = new Set<string>();
  let staffLate = 0;
  staffAttSnap.forEach(doc => {
    const d = doc.data();
    const ms = (d.timestamp as Timestamp)?.toMillis?.() ?? 0;
    if (ms >= todayMs) { presentStaffSet.add(d.staffId); if (d.status === 'Late') staffLate++; }
  });

  // 8. Parent counts
  const parentsSnap = await db.collection('parents').where('schoolId', '==', schoolId).get();
  const parentCount = parentsSnap.size;

  // Write the summary document
  const summaryData = {
    schoolId,
    lastUpdated: FieldValue.serverTimestamp(),
    studentCount: { total: totalStudents, active: activeStudents, withdrawn: withdrawnStudents, new_this_month: 0 },
    attendance: { date: today, totalPresent: present, totalAbsent: absent, totalLate: late, attendanceRate, absentStudentIds: absentIds },
    financials: {
      totalCollectedToday,
      totalCollectedThisMonth,
      totalCollectedThisTerm: totalCollectedThisMonth,
      totalOutstanding,
      totalBilled,
      totalRevenue,
      collectionRate,
      arrearsCount,
      lastPaymentAt: null,
      lastPaymentAmount: 0
    },
    debtAging: {
      current,
      age30,
      age60,
      age90,
      overpayments,
    },
    parentCount,
    staff: { total: totalStaff, presentToday: presentStaffSet.size, absentToday: Math.max(0, totalStaff - presentStaffSet.size), lateToday: staffLate },
    academics: { avgScorePercent: 0, passingRatePercent: 0, activeAlerts: 0, pendingAssessments: 0 },
    admissions: { pendingCount: pendingAdmissions, approvedThisMonth: 0 },
    behavioral: { incidentsThisWeek, positiveThisWeek },
    system: { parentEngagementScore: 0, lessonPlanComplianceRate: 0 },
  };

  await db.collection('dashboard_summaries').doc(schoolId).set(summaryData);
  console.log(`  ✅ Summary seeded for school ${schoolId}`);
}

async function main() {
  console.log('=== Dashboard Summary Seeder ===');
  const schoolIdsSet = new Set<string>();

  console.log('Fetching all schools from schools collection...');
  const schoolsSnap = await db.collection('schools').get();
  schoolsSnap.forEach(d => { if (d.id) schoolIdsSet.add(d.id); });

  console.log('Fetching school IDs from staff...');
  const staffSnap = await db.collection('staff').get();
  staffSnap.forEach(doc => {
    const data = doc.data();
    if (data.schoolId) schoolIdsSet.add(data.schoolId);
  });

  console.log('Fetching school IDs from students...');
  const studentsSnap = await db.collection('students').get();
  studentsSnap.forEach(doc => {
    const data = doc.data();
    if (data.schoolId) schoolIdsSet.add(data.schoolId);
  });

  console.log('Fetching school IDs from financialRecords...');
  const finSnap = await db.collection('financialRecords').get();
  finSnap.forEach(doc => {
    const data = doc.data();
    if (data.schoolId) schoolIdsSet.add(data.schoolId);
  });

  const schoolIds = Array.from(schoolIdsSet).filter(Boolean);
  console.log(`Found ${schoolIds.length} unique schools across collections to process.`);

  for (const schoolId of schoolIds) {
    try {
      await seedSchool(schoolId);
    } catch (err) {
      console.error(`  ❌ Failed for school ${schoolId}:`, err);
    }
  }

  console.log('\n=== Seeding Complete ===');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });


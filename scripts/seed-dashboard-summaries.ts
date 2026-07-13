/**
 * seed-dashboard-summaries.ts
 *
 * One-time migration script. Run ONCE to backfill the dashboard_summaries
 * collection for all existing schools from historical data.
 *
 * Usage:
 *   npx ts-node scripts/seed-dashboard-summaries.ts
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp();
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
  studentsSnap.forEach(doc => {
    const d = doc.data();
    totalStudents++;
    if (d.enrollmentStatus === 'Active' || !d.enrollmentStatus) activeStudents++;
    if (d.enrollmentStatus === 'Withdrawn') withdrawnStudents++;
  });
  console.log(`  Students: total=${totalStudents}, active=${activeStudents}, withdrawn=${withdrawnStudents}`);

  // 2. Staff counts
  const staffSnap = await db.collection('staff').where('schoolId', '==', schoolId).get();
  const totalStaff = staffSnap.size;
  console.log(`  Staff: ${totalStaff}`);

  // 3. Today's attendance
  const today = todayStr();
  const attSnap = await db.collection('attendance').where('schoolId', '==', schoolId).where('date', '==', today).get();
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
  let totalOutstanding = 0, arrearsCount = 0, totalCollectedToday = 0, totalCollectedThisMonth = 0;
  const todayMs = todayStartMs();
  const monthMs = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  finSnap.forEach(doc => {
    const d = doc.data();
    const outstanding = Number(d.outstandingBalance ?? d.balance ?? 0);
    totalOutstanding += outstanding;
    if (outstanding > 0) arrearsCount++;
    const paidMs = (d.paidAt as FirebaseFirestore.Timestamp)?.toMillis?.() ?? 0;
    const amt = Number(d.amountPaid ?? 0);
    if (paidMs >= todayMs) totalCollectedToday += amt;
    if (paidMs >= monthMs) totalCollectedThisMonth += amt;
  });

  // 5. Pending admissions
  const admSnap = await db.collection('admissionApplications').where('schoolId', '==', schoolId).where('status', '==', 'Pending Review').get();
  const pendingAdmissions = admSnap.size;

  // 6. Behavioral this week
  const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const behSnap = await db.collection('behavioral_records').where('schoolId', '==', schoolId).get();
  let incidentsThisWeek = 0, positiveThisWeek = 0;
  behSnap.forEach(doc => {
    const d = doc.data();
    const ms = (d.date as FirebaseFirestore.Timestamp)?.toMillis?.() ?? 0;
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
    const ms = (d.timestamp as FirebaseFirestore.Timestamp)?.toMillis?.() ?? 0;
    if (ms >= todayMs) { presentStaffSet.add(d.staffId); if (d.status === 'Late') staffLate++; }
  });

  // Write the summary document
  const summaryData = {
    schoolId,
    lastUpdated: FieldValue.serverTimestamp(),
    studentCount: { total: totalStudents, active: activeStudents, withdrawn: withdrawnStudents, new_this_month: 0 },
    attendance: { date: today, totalPresent: present, totalAbsent: absent, totalLate: late, attendanceRate, absentStudentIds: absentIds },
    financials: { totalCollectedToday, totalCollectedThisMonth, totalCollectedThisTerm: totalCollectedThisMonth, totalOutstanding, arrearsCount, lastPaymentAt: null, lastPaymentAmount: 0 },
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
  console.log('Fetching all schools...');
  const schoolsSnap = await db.collection('schools').get();
  const schoolIds = schoolsSnap.docs.map(d => d.id);
  console.log(`Found ${schoolIds.length} schools to process.`);

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

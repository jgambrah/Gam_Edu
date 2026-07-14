import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

if (!getApps().length) initializeApp();
const db = getFirestore();

/** Reference to the summary doc for a school */
const SUMMARY = (schoolId: string) =>
  db.collection('dashboard_summaries').doc(schoolId);

/** "YYYY-MM-DD" for today on the server */
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Epoch ms for start of today */
function todayStartMs(): number {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

/** Robust helper to get YYYY-MM-DD from Timestamp, Date, or string */
function getYYYYMMDD(val: any): string {
  if (!val) return '';
  let d: Date;
  if (typeof val.toDate === 'function') {
    d = val.toDate();
  } else if (val instanceof Date) {
    d = val;
  } else {
    d = new Date(val);
  }
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

/** Helper to recalculate financial metrics for a school considering active students */
async function recalculateSchoolFinancials(schoolId: string): Promise<void> {
  // Fetch active students first
  const studentsSnap = await db.collection('students')
    .where('schoolId', '==', schoolId)
    .get();
  
  const activeStudentIds = new Set<string>();
  studentsSnap.forEach(sDoc => {
    const s = sDoc.data();
    if (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) {
      activeStudentIds.add(sDoc.id);
    }
  });

  // Fetch all financial records for this school to calculate full, accurate aggregates
  const snap = await db.collection('financialRecords')
    .where('schoolId', '==', schoolId)
    .get();

  // Fetch all payments for this school via collectionGroup to calculate collections today/this month
  const paymentsSnap = await db.collectionGroup('payments')
    .where('schoolId', '==', schoolId)
    .get();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalBilled = 0;
  let totalRevenue = 0;
  let totalOutstanding = 0;
  let arrearsCount = 0;

  let current = 0;
  let age30 = 0;
  let age60 = 0;
  let age90 = 0;
  let overpayments = 0;

  let totalCollectedToday = 0;
  let totalCollectedThisMonth = 0;
  let totalCollectedThisTerm = 0;
  let lastPaymentAmount = 0;
  let lastPaymentAt: Timestamp | null = null;

  const todayMs = todayStartMs();
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const monthMs = monthStart.getTime();

  // 1. Process parent financial records (billing, arrears, and debt aging)
  snap.forEach(doc => {
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

    // Debt aging buckets
    const dueTs = r.dueDate as FirebaseFirestore.Timestamp | undefined;
    const dueMs = dueTs?.toMillis?.() ?? (r.dueDate ? new Date(r.dueDate).getTime() : todayMs);
    const diffTime = today.getTime() - dueMs;
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

  // 2. Process payments for actual collection sums (today, this month, this term)
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
      if (amount > lastPaymentAmount) {
        lastPaymentAmount = amount;
        lastPaymentAt = pTs;
      }
    }
    if (pMs >= monthMs) {
      totalCollectedThisMonth += amount;
    }
  });
  totalCollectedThisTerm = totalCollectedThisMonth;

  const collectionRate = totalBilled > 0 
    ? Math.round((totalRevenue / totalBilled) * 100) 
    : 0;

  await SUMMARY(schoolId).set({
    schoolId,
    lastUpdated: FieldValue.serverTimestamp(),
    financials: {
      totalCollectedToday,
      totalCollectedThisMonth,
      totalCollectedThisTerm,
      totalOutstanding,
      totalBilled,
      totalRevenue,
      collectionRate,
      arrearsCount,
      lastPaymentAmount,
      lastPaymentAt,
    },
    debtAging: {
      current,
      age30,
      age60,
      age90,
      overpayments,
    }
  }, { merge: true });
}



// ── TRIGGER 1: Students ────────────────────────────────────────────────────────
export const onStudentWrite = onDocumentWritten(
  'students/{studentId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    const wasActive = !!(before && (before.enrollmentStatus === 'Active' || !before.enrollmentStatus));
    const isActive  = !!(after  && (after.enrollmentStatus  === 'Active' || !after.enrollmentStatus));
    const wasWithdrawn = before?.enrollmentStatus === 'Withdrawn';
    const isWithdrawn  = after?.enrollmentStatus  === 'Withdrawn';

    let totalDelta = 0, activeDelta = 0, withdrawnDelta = 0;

    if (!before && after)       { totalDelta = 1;  activeDelta = isActive ? 1 : 0;   withdrawnDelta = isWithdrawn ? 1 : 0; }
    else if (before && !after)  { totalDelta = -1; activeDelta = wasActive ? -1 : 0; withdrawnDelta = wasWithdrawn ? -1 : 0; }
    else                        { activeDelta = (isActive ? 1 : 0) - (wasActive ? 1 : 0); withdrawnDelta = (isWithdrawn ? 1 : 0) - (wasWithdrawn ? 1 : 0); }

    if (totalDelta === 0 && activeDelta === 0 && withdrawnDelta === 0) return;

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      'studentCount.total':     FieldValue.increment(totalDelta),
      'studentCount.active':    FieldValue.increment(activeDelta),
      'studentCount.withdrawn': FieldValue.increment(withdrawnDelta),
    }, { merge: true });

    if (activeDelta !== 0) {
      await recalculateSchoolFinancials(schoolId);
    }
  }
);

// ── TRIGGER 2: Student Attendance ─────────────────────────────────────────────
export const onAttendanceWrite = onDocumentWritten(
  'attendance/{recordId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    const dateVal = after?.date ?? before?.date;
    const dateStr = getYYYYMMDD(dateVal);
    if (!dateStr || dateStr !== todayStr()) return;

    // Convert dateStr (e.g. "2026-07-13") to the exact Timestamp object to query Firestore
    const startOfToday = new Date(dateStr + 'T00:00:00.000Z');
    const todayTimestamp = Timestamp.fromDate(startOfToday);

    const snap = await db.collection('attendance')
      .where('schoolId', '==', schoolId)
      .where('date', '==', todayTimestamp)
      .get();

    let present = 0, absent = 0, late = 0;
    const absentIds: string[] = [];

    snap.forEach(doc => {
      const d = doc.data();
      if (d.status === 'Present') present++;
      else if (d.status === 'Absent') { absent++; if (absentIds.length < 25) absentIds.push(d.studentId as string); }
      else if (d.status === 'Late') late++;
    });

    const total = present + absent + late;
    const rate  = total > 0 ? Math.round((present / total) * 100) : 0;

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      attendance: { date: dateStr, totalPresent: present, totalAbsent: absent, totalLate: late, attendanceRate: rate, absentStudentIds: absentIds },
    }, { merge: true });
  }
);

// ── TRIGGER 3: Financial Records ──────────────────────────────────────────────
export const onFinancialRecordWrite = onDocumentWritten(
  'financialRecords/{recordId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    await recalculateSchoolFinancials(schoolId);
  }
);

// ── TRIGGER 3.5: Payments Subcollection ─────────────────────────────────────────
export const onPaymentSubcollectionWrite = onDocumentWritten(
  'financialRecords/{recordId}/payments/{paymentId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    await recalculateSchoolFinancials(schoolId);
  }
);

// ── TRIGGER 4: Staff Attendance ───────────────────────────────────────────────
export const onStaffAttendanceWrite = onDocumentWritten(
  'staff_attendance/{recordId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    const ts = after?.timestamp as FirebaseFirestore.Timestamp | undefined;
    const tsMs = ts?.toMillis?.() ?? 0;
    if (tsMs < todayStartMs()) return;

    const snap = await db.collection('staff_attendance')
      .where('schoolId', '==', schoolId)
      .where('type', '==', 'In')
      .get();

    const todayMs = todayStartMs();
    const presentSet = new Set<string>();
    let lateCount = 0;

    snap.forEach(doc => {
      const d = doc.data();
      const docTs = d.timestamp as FirebaseFirestore.Timestamp | undefined;
      const ms = docTs?.toMillis?.() ?? 0;
      if (ms >= todayMs) {
        presentSet.add(d.staffId as string);
        if (d.status === 'Late') lateCount++;
      }
    });

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      'staff.presentToday': presentSet.size,
      'staff.lateToday':    lateCount,
    }, { merge: true });
  }
);

// ── TRIGGER 5: Admissions ─────────────────────────────────────────────────────
export const onAdmissionWrite = onDocumentWritten(
  'admissionApplications/{appId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    const wasPending  = before?.status === 'Pending Review';
    const isPending   = after?.status  === 'Pending Review';
    const wasAdmitted = before?.status === 'Admitted';
    const isAdmitted  = after?.status  === 'Admitted';

    const pendingDelta  = (isPending  ? 1 : 0) - (wasPending  ? 1 : 0);
    const admittedDelta = (isAdmitted ? 1 : 0) - (wasAdmitted ? 1 : 0);
    if (pendingDelta === 0 && admittedDelta === 0) return;

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      'admissions.pendingCount':      FieldValue.increment(pendingDelta),
      'admissions.approvedThisMonth': FieldValue.increment(admittedDelta),
    }, { merge: true });
  }
);

// ── TRIGGER 6: Behavioral Records ────────────────────────────────────────────
export const onBehavioralWrite = onDocumentWritten(
  'behavioral_records/{recordId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const dateTs = after?.date as FirebaseFirestore.Timestamp | undefined;
    const createdMs = dateTs?.toMillis?.() ?? 0;
    if (createdMs < weekAgoMs) return;

    const wasInfraction = before?.incidentType === 'Infraction';
    const isInfraction  = after?.incidentType  === 'Infraction';
    const wasPositive   = before?.incidentType === 'Positive Behavior';
    const isPositive    = after?.incidentType  === 'Positive Behavior';

    let infDelta = 0, posDelta = 0;
    if (!before && after)       { infDelta = isInfraction ? 1 : 0; posDelta = isPositive ? 1 : 0; }
    else if (before && !after)  { infDelta = wasInfraction ? -1 : 0; posDelta = wasPositive ? -1 : 0; }
    else                        { infDelta = (isInfraction ? 1 : 0) - (wasInfraction ? 1 : 0); posDelta = (isPositive ? 1 : 0) - (wasPositive ? 1 : 0); }

    if (infDelta === 0 && posDelta === 0) return;

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      'behavioral.incidentsThisWeek': FieldValue.increment(infDelta),
      'behavioral.positiveThisWeek':  FieldValue.increment(posDelta),
    }, { merge: true });
  }
);

// ── TRIGGER 7: Parents ─────────────────────────────────────────────────────────
export const onParentWrite = onDocumentWritten(
  'parents/{parentId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    let delta = 0;
    if (!before && after)       { delta = 1; }
    else if (before && !after)  { delta = -1; }

    if (delta === 0) return;

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      parentCount: FieldValue.increment(delta),
    }, { merge: true });
  }
);








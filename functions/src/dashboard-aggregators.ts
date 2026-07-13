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
  d.setHours(0, 0, 0, 0);
  return d.getTime();
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

    const dateStr: string = after?.date ?? before?.date ?? '';
    if (dateStr !== todayStr()) return;

    const snap = await db.collection('attendance')
      .where('schoolId', '==', schoolId)
      .where('date', '==', dateStr)
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
    if (!after?.schoolId) return;

    const schoolId: string = after.schoolId as string;
    const balBefore = Number(before?.outstandingBalance ?? before?.balance ?? 0);
    const balAfter  = Number(after.outstandingBalance  ?? after.balance  ?? 0);
    const balDelta  = balAfter - balBefore;

    const paidAt = after.paidAt as FirebaseFirestore.Timestamp | undefined;
    const paidAtMs   = paidAt?.toMillis?.() ?? 0;
    const isPaidToday = paidAtMs >= todayStartMs();
    const amountDelta = Number(after.amountPaid ?? 0) - Number(before?.amountPaid ?? 0);

    const wasInArrears = (Number(before?.outstandingBalance ?? 0)) > 0;
    const isInArrears  = balAfter > 0;
    const arrearsDelta = (isInArrears ? 1 : 0) - (wasInArrears ? 1 : 0);

    const update: Record<string, unknown> = {
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      'financials.totalOutstanding': FieldValue.increment(balDelta),
      'financials.arrearsCount':     FieldValue.increment(arrearsDelta),
    };

    if (isPaidToday && amountDelta > 0) {
      update['financials.totalCollectedToday']     = FieldValue.increment(amountDelta);
      update['financials.totalCollectedThisMonth'] = FieldValue.increment(amountDelta);
      update['financials.totalCollectedThisTerm']  = FieldValue.increment(amountDelta);
      update['financials.lastPaymentAmount']        = amountDelta;
      update['financials.lastPaymentAt']            = Timestamp.now();
    }

    await SUMMARY(schoolId).set(update, { merge: true });
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

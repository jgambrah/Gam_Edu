import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, FieldPath, Timestamp } from 'firebase-admin/firestore';
import { termStampOfRecord, currentTermFromProfile, normalizeYear } from './term-utils';

if (!getApps().length) initializeApp();
const db = getFirestore();

/** Reference to the summary doc for a school */
const SUMMARY = (schoolId: string) =>
  db.collection('dashboard_summaries').doc(schoolId);

/**
 * Per-student balance index: studentBalances/{schoolId} = { byStudent: { <bill studentId>: { debt, credit } } }.
 * Student Billing reads this ONE document to show every student's balance, highest debt first, without
 * reading any bills. Kept current by the bill trigger below (no reads) and rebuilt exactly every night.
 */
const BALANCES = (schoolId: string) => db.collection('studentBalances').doc(schoolId);

/** Writes the whole balance index; drops the per-year/aging detail if a very large school would exceed 1 MiB. */
async function writeBalanceIndex(schoolId: string, byStudent: Record<string, any>, extra: Record<string, any>): Promise<void> {
  let data = byStudent;
  if (Buffer.byteLength(JSON.stringify(data), 'utf8') > 900_000) {
    data = Object.fromEntries(Object.entries(byStudent).map(([k, v]: [string, any]) => [k, { debt: v.debt, credit: v.credit }]));
  }
  await BALANCES(schoolId).set({ schoolId, byStudent: data, updatedAt: FieldValue.serverTimestamp(), ...extra });
}

/**
 * Student roster for Student Billing: studentRoster/{schoolId} = { students: { <docId>: {...billing fields} } }.
 * The page reads this ONE document instead of every student document (and instead of a live listener).
 * Kept current by onStudentWrite (no reads) and rebuilt every night from the students already read.
 */
const ROSTER = (schoolId: string) => db.collection('studentRoster').doc(schoolId);
const ROSTER_FIELDS = ['uid', 'studentId', 'admissionNo', 'admissionNumber', 'firstName', 'lastName', 'classId',
  'enrollmentStatus', 'isArchived', 'photoURL', 'email', 'isSponsored', 'sponsorId', 'usesBusService',
  'transportBillingModel', 'routeId', 'canteenBillingMode', 'usesCanteen', 'hasAccountCredit', 'accountCreditBalance'];
function rosterEntry(s: any): Record<string, any> | null {
  if (!s) return null;
  const e: Record<string, any> = {};
  ROSTER_FIELDS.forEach(f => { if (s[f] !== undefined && s[f] !== null && s[f] !== '') e[f] = s[f]; });
  return e;
}
const ROSTER_MAX_BYTES = 900_000; // stay under Firestore's 1 MiB document limit

async function writeRoster(schoolId: string, docs: FirebaseFirestore.QueryDocumentSnapshot[]): Promise<void> {
  const students: Record<string, any> = {};
  docs.forEach(d => { const e = rosterEntry(d.data()); if (e) students[d.id] = e; });
  const size = Buffer.byteLength(JSON.stringify(students), 'utf8');
  if (size > ROSTER_MAX_BYTES) {
    // Too big for one document: the page keeps reading the students collection for this school.
    await ROSTER(schoolId).set({ schoolId, tooLarge: true, rebuiltAt: FieldValue.serverTimestamp() });
    return;
  }
  await ROSTER(schoolId).set({ schoolId, students, rebuiltAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
}
/**
 * One student's entry in the balance index:
 *   debt / credit   — unpaid balances / over-payments (all terms)                    (live: trigger)
 *   years[Y]        — { b, p, w } billed / paid / waived on that academic year's bills (live: trigger)
 *   aging           — { c, a30, a60, a90 } unpaid by age (not due / 1–30 / 31–60 / 61+) (nightly)
 *   oldestDue       — ms of the oldest unpaid bill's due date                            (nightly)
 * Lets Student Billing show the aged-debt call list, debt aging and class pace without reading bills.
 */
type StudentIdx = { debt: number; credit: number; years: Record<string, { b: number; p: number; w: number }>; aging: { c: number; a30: number; a60: number; a90: number }; oldestDue: number };
const emptyIdx = (): StudentIdx => ({ debt: 0, credit: 0, years: {}, aging: { c: 0, a30: 0, a60: 0, a90: 0 }, oldestDue: 0 });
const AGING_KEY: Record<string, 'c' | 'a30' | 'a60' | 'a90'> = { current: 'c', age30: 'a30', age60: 'a60', age90: 'a90' };
function billDueMs(r: any): number { return anyMs(r?.dueDate) || anyMs(r?.date) || anyMs(r?.createdAt); }
function roundIdx(e: StudentIdx) {
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return {
    debt: r2(e.debt), credit: r2(e.credit),
    years: Object.fromEntries(Object.entries(e.years).map(([y, v]) => [y, { b: r2(v.b), p: r2(v.p), w: r2(v.w) }])),
    aging: { c: r2(e.aging.c), a30: r2(e.aging.a30), a60: r2(e.aging.a60), a90: r2(e.aging.a90) },
    oldestDue: e.oldestDue || 0,
  };
}

/** Same balance the Student Billing ledger shows for a bill (billed − paid − waived). */
function ledgerBalance(r: any): number {
  if (!r || r.isArchived === true || r.status === 'Pending Reversal') return 0;
  return (Number(r.billedAmount) || 0) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0);
}

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

/**
 * Full recompute of a school's financial summary. EXPENSIVE (reads every bill and payment), so it is
 * only run by the nightly scheduler / manual rebuilds. Live writes use the incremental triggers below.
 * `_eventTermId` is accepted for backward compatibility but no longer narrows the totals (bills are not
 * stamped with termId, so filtering by it produced partial totals that overwrote the summary).
 */
export async function recalculateSchoolFinancials(schoolId: string, _eventTermId?: string): Promise<void> {
  // Fetch students; filter archived/inactive in memory. (A `where('isArchived','!=',true)` query silently
  // drops every document that has no isArchived field at all — i.e. most students, bills and payments.)
  const studentsSnap = await db.collection('students')
    .where('schoolId', '==', schoolId)
    .get();
  
  const activeStudentIds = new Set<string>();
  studentsSnap.forEach(sDoc => {
    const s = sDoc.data();
    if (s.isArchived === true) return;
    if (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) {
      // Same identifiers the Accounts page matches bills on (some older bills use the admission number).
      [sDoc.id, s.uid, s.studentId, s.admissionNo, s.admissionNumber].forEach(k => { if (k) activeStudentIds.add(String(k)); });
    }
  });

  // Once every bill of the school carries isArchived (backfill-term-stamps.js --apply sets
  // schoolSettings.billsHaveArchiveFlag), only open bills are read — archived terms are skipped entirely,
  // so the nightly cost stops growing with the school's history.
  const settingsForFlag = await db.collection('schoolSettings').doc(schoolId).get();
  const openOnly = settingsForFlag.data()?.billsHaveArchiveFlag === true;
  const recordsSnapRaw = openOnly
    ? await db.collection('financialRecords').where('schoolId', '==', schoolId).where('isArchived', '==', false).get()
    : await db.collection('financialRecords').where('schoolId', '==', schoolId).get();
  const recordDocs = recordsSnapRaw.docs.filter(d => d.data().isArchived !== true);
  const openRecordIds = new Set(recordDocs.map(d => d.id));
  const snap = { forEach: (fn: (d: FirebaseFirestore.QueryDocumentSnapshot) => void) => recordDocs.forEach(fn) };

  const paymentsSnapRaw = await db.collectionGroup('payments')
    .where('schoolId', '==', schoolId)
    .get();
  // Payments on bills archived by a term rollover belong to a closed term, and carried-forward credit is
  // not new cash — neither counts towards current collections.
  const archivedRecordIds = new Set(recordsSnapRaw.docs.filter(d => d.data().isArchived === true).map(d => d.id));
  const paymentDocs = paymentsSnapRaw.docs.filter(d => {
    const p = d.data();
    if (p.isArchived === true || p.isCarryForward === true) return false;
    const parentId = d.ref.parent.parent?.id;
    if (openOnly) return !!parentId && openRecordIds.has(parentId); // archived bills were not read
    return !(parentId && archivedRecordIds.has(parentId));
  });
  const paymentsSnap = { docs: paymentDocs };
  // Bills that have itemised payment docs must not ALSO be counted through their amountPaid field.
  const recordsWithPaymentDocs = new Set<string>();
  paymentDocs.forEach(d => { const parentId = d.ref.parent.parent?.id; if (parentId) recordsWithPaymentDocs.add(parentId); });

  let tillsTransactionsSnap: any;
  try {
    tillsTransactionsSnap = await db.collectionGroup('transactions').where('schoolId', '==', schoolId).get();
  } catch (e) {
    tillsTransactionsSnap = { docs: [] };
  }

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

  const currentAccounts = new Set<string>();
  const age30Accounts = new Set<string>();
  const age60Accounts = new Set<string>();
  const age90Accounts = new Set<string>();

  let totalCollectedToday = 0;
  let totalCollectedThisMonth = 0;
  let totalCollectedThisTerm = 0;
  let latestPaymentMs = 0;
  let lastPaymentAmount = 0;
  let lastPaymentAt: Timestamp | null = null;

  let tuitionStream = 0;
  let canteenStream = 0;
  let transportStream = 0;
  let boardingStream = 0;
  let uniformsStream = 0;
  let otherStream = 0;

  let outstandingTuition = 0;
  let outstandingCanteen = 0;
  let outstandingTransport = 0;
  let otherDebt = 0;

  const categoryMap: Record<string, { billed: number; paid: number; waived: number; owed: number }> = {
    'Tuition': { billed: 0, paid: 0, waived: 0, owed: 0 },
    'Canteen': { billed: 0, paid: 0, waived: 0, owed: 0 },
    'Transport': { billed: 0, paid: 0, waived: 0, owed: 0 },
    'PTA Levy': { billed: 0, paid: 0, waived: 0, owed: 0 },
    'Other': { billed: 0, paid: 0, waived: 0, owed: 0 },
  };
  let billPaidTotal = 0;
  let billWaivedTotal = 0;
  // Billing per academic year ({ "2026-2027": { billed, paid, waived } }). The dashboards measure collection
  // performance on the CURRENT academic year's bills, exactly like Accounts > Student Billing; older years'
  // unpaid bills still count in the debt figures.
  const yearBills: Record<string, { billed: number; paid: number; waived: number }> = {};
  // Same, per fee category ({ "2026-2027": { Tuition: {...}, Canteen: {...} } }) for the per-fee rates.
  const yearCats: Record<string, Record<string, { billed: number; paid: number; waived: number }>> = {};
  const [schoolProfileSnap, schoolSettingsSnap] = await Promise.all([
    db.collection('schools').doc(schoolId).get(),
    db.collection('schoolSettings').doc(schoolId).get(),
  ]);
  const currentStamp = currentTermFromProfile(schoolProfileSnap.data()) || currentTermFromProfile(schoolSettingsSnap.data());
  const currentAcademicYear = currentStamp?.academicYear || '';

  const todayMs = todayStartMs();
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const monthMs = monthStart.getTime();

  // Balance index for Student Billing (every student, active or not; the page shows its own roster).
  const byStudent: Record<string, StudentIdx> = {};

  // 1. Process parent financial records (billing, arrears, and debt aging)
  snap.forEach(doc => {
    const r = doc.data();
    if (r.status === 'Pending Reversal') return;
    if (r.studentId) {
      const e = (byStudent[String(r.studentId)] = byStudent[String(r.studentId)] || emptyIdx());
      const yk0 = recordYearKey(r);
      const yv = (e.years[yk0] = e.years[yk0] || { b: 0, p: 0, w: 0 });
      yv.b += Number(r.billedAmount) || 0;
      yv.p += Number(r.amountPaid) || 0;
      yv.w += Number(r.waiverAmount) || 0;
      const lb = ledgerBalance(r);
      if (lb > 0.009) {
        e.debt += lb;
        e.aging[AGING_KEY[agingBucket(r)]] += lb;
        const due = billDueMs(r);
        if (due && (!e.oldestDue || due < e.oldestDue)) e.oldestDue = due;
      } else if (lb < -0.009) {
        e.credit -= lb;
      }
    }
    if (r.studentId && !activeStudentIds.has(r.studentId) && activeStudentIds.size > 0) return;

    const billed = Number(r.billedAmount ?? r.amount ?? 0);
    const paid = Number(r.amountPaid ?? 0);
    const waiver = Number(r.waiverAmount ?? 0);
    const balance = billed - paid - waiver;

    totalBilled += billed;

    const typeLower = (r.type || r.category || '').toLowerCase();
    let catKey = 'Other';
    if (typeLower.includes('tuition')) catKey = 'Tuition';
    else if (typeLower.includes('canteen')) catKey = 'Canteen';
    else if (typeLower.includes('transport')) catKey = 'Transport';
    else if (typeLower.includes('pta')) catKey = 'PTA Levy';

    if (categoryMap[catKey]) {
      // Per-fee rates use this academic year's bills (like the overall rate); "owed" covers all terms.
      if (!currentAcademicYear || recordYearKey(r) === currentAcademicYear) {
        categoryMap[catKey].billed += billed;
        categoryMap[catKey].paid += paid;
        categoryMap[catKey].waived += waiver;
      }
      if (balance > 0.01) categoryMap[catKey].owed += balance;
    }
    billPaidTotal += paid;
    billWaivedTotal += waiver;
    const yk = recordYearKey(r);
    if (!yearBills[yk]) yearBills[yk] = { billed: 0, paid: 0, waived: 0 };
    yearBills[yk].billed += billed;
    yearBills[yk].paid += paid;
    yearBills[yk].waived += waiver;
    const yc = (yearCats[yk] = yearCats[yk] || {});
    const yce = (yc[catKey] = yc[catKey] || { billed: 0, paid: 0, waived: 0 });
    yce.billed += billed;
    yce.paid += paid;
    yce.waived += waiver;

    if (balance < 0) {
      overpayments += Math.abs(balance);
      return;
    }
    if (balance <= 0.01) return;

    totalOutstanding += balance;
    arrearsCount++;

    if (typeLower.includes('tuition')) outstandingTuition += balance;
    else if (typeLower.includes('canteen')) outstandingCanteen += balance;
    else if (typeLower.includes('transport')) outstandingTransport += balance;
    else otherDebt += balance;

    // Debt aging buckets (shared rule with the incremental trigger and the Accounts page)
    const accountId = String(r.studentId || r.studentUid || r.accountId || r.studentName || '').trim();
    const bucket = agingBucket(r);
    if (bucket === 'current') {
      current += balance;
      if (accountId) currentAccounts.add(accountId);
    } else if (bucket === 'age30') {
      age30 += balance;
      if (accountId) age30Accounts.add(accountId);
    } else if (bucket === 'age60') {
      age60 += balance;
      if (accountId) age60Accounts.add(accountId);
    } else {
      age90 += balance;
      if (accountId) age90Accounts.add(accountId);
    }
  });

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
      const pTs = dateVal as Timestamp;
      pMs = pTs.toMillis?.() ?? new Date(dateVal).getTime();
      if (pMs > latestPaymentMs) {
        latestPaymentMs = pMs;
        lastPaymentAmount = amount;
        lastPaymentAt = pTs;
      }
    }

    totalRevenue += amount;

    if (pMs >= todayMs) totalCollectedToday += amount;
    if (pMs >= monthMs) totalCollectedThisMonth += amount;
    totalCollectedThisTerm += amount;

    const cat = classifyCategory(p);
    if (cat === 'tuition') tuitionStream += amount;
    else if (cat === 'canteen') canteenStream += amount;
    else if (cat === 'transport') transportStream += amount;
    else if (cat === 'boarding') boardingStream += amount;
    else if (cat === 'uniforms') uniformsStream += amount;
    else otherStream += amount;
  };

  // 2. Process payments for actual collection sums & category streams
  if (paymentsSnap.docs) {
    paymentsSnap.docs.forEach((pDoc: any) => processItem(pDoc.data(), pDoc.id));
  }

  if (tillsTransactionsSnap.docs) {
    tillsTransactionsSnap.docs.forEach((tDoc: any) => processItem(tDoc.data(), tDoc.id));
  }

  snap.forEach(doc => {
    const r = doc.data();
    if (recordsWithPaymentDocs.has(doc.id)) return; // already counted via its payment docs
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

  // Collection rate = paid on bills ÷ (billed − waivers), the same formula as the per-fee rates and the
  // Accounts page. (It used to divide ALL money received — including till sales that are not bill payments —
  // by gross billing, which ignored waivers and mixed in non-bill income.)
  const rateOf = (billed: number, paid: number, waived: number) =>
    billed - waived > 0 ? Math.min(100, Math.round((paid / (billed - waived)) * 1000) / 10) : 0;
  const cy = currentAcademicYear ? yearBills[currentAcademicYear] : undefined;
  // This academic year's rate (same as the Accounts page); all-time rate if the year is not set.
  const collectionRate = cy ? rateOf(cy.billed, cy.paid, cy.waived) : rateOf(totalBilled, billPaidTotal, billWaivedTotal);
  const collectionRateAllTime = rateOf(totalBilled, billPaidTotal, billWaivedTotal);
  const round2y = (n: number) => Math.round(n * 100) / 100;
  const yearBillsOut = Object.fromEntries(Object.entries(yearBills).map(([k, v]) =>
    [k, { billed: round2y(v.billed), paid: round2y(v.paid), waived: round2y(v.waived) }]));

  await SUMMARY(schoolId).set({
    schoolId,
    lastUpdated: FieldValue.serverTimestamp(),
    financials: {
      totalCollectedToday,
      totalCollectedThisMonth,
      totalCollectedThisTerm: totalRevenue,
      totalCollectedThisYear: totalRevenue,
      totalOutstanding,
      totalBilled,
      totalRevenue,
      collectionRate,
      collectionRateAllTime,
      currentAcademicYear,
      yearBills: yearBillsOut,
      yearCats: Object.fromEntries(Object.entries(yearCats).map(([y, cats]) => [y, Object.fromEntries(Object.entries(cats).map(([c, v]) =>
        [c, { billed: round2y(v.billed), paid: round2y(v.paid), waived: round2y(v.waived) }]))])),
      arrearsCount,
      lastPaymentAmount,
      lastPaymentAt,
      streamBreakdown: {
        tuition: tuitionStream,
        canteen: canteenStream,
        transport: transportStream,
        auxiliary: boardingStream + uniformsStream + otherStream
      },
      streamDebts: {
        tuition: outstandingTuition,
        canteen: outstandingCanteen,
        transport: outstandingTransport,
        other: otherDebt,
      },
      categoryCollections: Object.entries(categoryMap).map(([name, catStats]) => {
        const netBilled = catStats.billed - catStats.waived;
        const rate = netBilled > 0 ? Math.min(100, (catStats.paid / netBilled) * 100) : (catStats.owed > 0.01 ? 0 : 100);
        return {
          name,
          billed: catStats.billed,
          paid: catStats.paid,
          waived: catStats.waived,
          // Unpaid balances of this fee (matches streamDebts); overpayments are reported as advance credits.
          outstanding: catStats.owed,
          rate,
        };
      }),
    },
    debtAging: {
      // Buckets (same as the Accounts page): current = not yet due, age30 = 1–30 days overdue,
      // age60 = 31–60, age90 = more than 60 days overdue.
      current,
      age30,
      age60,
      age90,
      overpayments,
      rebuiltAt: FieldValue.serverTimestamp(),
      accountCounts: {
        current: currentAccounts.size,
        age30: age30Accounts.size,
        lessThan30: new Set([...currentAccounts, ...age30Accounts]).size,
        age60: age60Accounts.size,
        age90: age90Accounts.size,
        over90: 0,
        totalOverdue: new Set([...age30Accounts, ...age60Accounts, ...age90Accounts]).size,
        overdue60Plus: age90Accounts.size, // age90 = more than 60 days overdue
      }
    }
  }, { merge: true });

  // Exact rebuild of the balance index (replaces the document, removing any drift).
  await writeBalanceIndex(schoolId, Object.fromEntries(Object.entries(byStudent).map(([k, v]) => [k, roundIdx(v)])), { rebuiltAt: FieldValue.serverTimestamp() });
  await writeRoster(schoolId, studentsSnap.docs);
}



/**
 * DAILY LIGHT REFRESH (much cheaper than the full rebuild): reads only the school's students and its
 * UNPAID bills (status other than 'Paid') — no paid bills, no payments. Re-buckets debt aging as bills age,
 * and refreshes debts, per-fee "owed", per-fee rates and the per-student debts from those bills. Everything
 * else (collections, credits, billing totals per year) is kept current by the triggers. The full rebuild
 * still runs weekly to remove any drift. Throws if the query cannot run (e.g. index not deployed yet);
 * the scheduler then falls back to the full rebuild.
 */
export async function refreshOpenDebts(schoolId: string): Promise<void> {
  const [studentsSnap, unpaidSnap, summarySnap, balancesSnap, profileSnap, settingsSnap] = await Promise.all([
    db.collection('students').where('schoolId', '==', schoolId).get(),
    db.collection('financialRecords').where('schoolId', '==', schoolId).where('status', '!=', 'Paid').get(),
    SUMMARY(schoolId).get(),
    BALANCES(schoolId).get(),
    db.collection('schools').doc(schoolId).get(),
    db.collection('schoolSettings').doc(schoolId).get(),
  ]);
  const summary: any = summarySnap.data() || {};
  if (!summary.financials?.yearCats) throw new Error('No per-year totals yet — run the full rebuild first.');

  const activeStudentIds = new Set<string>();
  studentsSnap.forEach(sDoc => {
    const st = sDoc.data();
    if (st.isArchived === true) return;
    if (st.enrollmentStatus === 'Active' || !st.enrollmentStatus) {
      [sDoc.id, st.uid, st.studentId, st.admissionNo, st.admissionNumber].forEach(k => { if (k) activeStudentIds.add(String(k)); });
    }
  });

  let current = 0, age30 = 0, age60 = 0, age90 = 0, totalOutstanding = 0, arrearsCount = 0;
  const sets = { current: new Set<string>(), age30: new Set<string>(), age60: new Set<string>(), age90: new Set<string>() };
  const streamDebts = { tuition: 0, canteen: 0, transport: 0, other: 0 };
  const owedByCat: Record<string, number> = { 'Tuition': 0, 'Canteen': 0, 'Transport': 0, 'PTA Levy': 0, 'Other': 0 };
  const debtByStudent: Record<string, number> = {};
  const agingByStudent: Record<string, { c: number; a30: number; a60: number; a90: number; oldestDue: number }> = {};

  unpaidSnap.forEach(d => {
    const r: any = d.data();
    if (r.isArchived === true || r.status === 'Pending Reversal') return;
    const lb = ledgerBalance(r);
    if (r.studentId && lb > 0.009) {
      const k = String(r.studentId);
      debtByStudent[k] = (debtByStudent[k] || 0) + lb;
      const ag = (agingByStudent[k] = agingByStudent[k] || { c: 0, a30: 0, a60: 0, a90: 0, oldestDue: 0 });
      ag[AGING_KEY[agingBucket(r)]] += lb;
      const due = billDueMs(r);
      if (due && (!ag.oldestDue || due < ag.oldestDue)) ag.oldestDue = due;
    }
    if (r.studentId && !activeStudentIds.has(r.studentId) && activeStudentIds.size > 0) return;
    const billed = Number(r.billedAmount ?? r.amount ?? 0);
    const balance = billed - Number(r.amountPaid ?? 0) - Number(r.waiverAmount ?? 0);
    if (balance <= 0.01) return;
    totalOutstanding += balance;
    arrearsCount++;
    streamDebts[debtKey(r)] += balance;
    owedByCat[feeCatOf(r)] += balance;
    const acc = String(r.studentId || r.studentUid || r.accountId || r.studentName || '').trim();
    const bucket = agingBucket(r);
    if (bucket === 'current') current += balance; else if (bucket === 'age30') age30 += balance; else if (bucket === 'age60') age60 += balance; else age90 += balance;
    if (acc) sets[bucket].add(acc);
  });

  const r2 = (n: number) => Math.round(n * 100) / 100;
  const currentStamp = currentTermFromProfile(profileSnap.data()) || currentTermFromProfile(settingsSnap.data());
  const currentAcademicYear = currentStamp?.academicYear || summary.financials?.currentAcademicYear || '';
  const cats: Record<string, any> = (currentAcademicYear && summary.financials.yearCats[currentAcademicYear]) || {};
  const categoryCollections = Object.keys(owedByCat).map(name => {
    const v = cats[name] || { billed: 0, paid: 0, waived: 0 };
    const nb = (Number(v.billed) || 0) - (Number(v.waived) || 0);
    const owed = r2(owedByCat[name]);
    return { name, billed: r2(Number(v.billed) || 0), paid: r2(Number(v.paid) || 0), waived: r2(Number(v.waived) || 0), outstanding: owed,
      rate: nb > 0 ? Math.min(100, ((Number(v.paid) || 0) / nb) * 100) : (owed > 0.01 ? 0 : 100) };
  });
  const yb = currentAcademicYear ? summary.financials?.yearBills?.[currentAcademicYear] : null;
  const collectible = yb ? (Number(yb.billed) || 0) - (Number(yb.waived) || 0) : 0;

  await SUMMARY(schoolId).set({
    schoolId,
    lastUpdated: FieldValue.serverTimestamp(),
    financials: {
      totalOutstanding: r2(totalOutstanding),
      arrearsCount,
      streamDebts: { tuition: r2(streamDebts.tuition), canteen: r2(streamDebts.canteen), transport: r2(streamDebts.transport), other: r2(streamDebts.other) },
      categoryCollections,
      currentAcademicYear,
      ...(yb ? { collectionRate: collectible > 0 ? Math.min(100, Math.round(((Number(yb.paid) || 0) / collectible) * 1000) / 10) : 0 } : {}),
    },
    debtAging: {
      current: r2(current), age30: r2(age30), age60: r2(age60), age90: r2(age90),
      rebuiltAt: FieldValue.serverTimestamp(),
      accountCounts: {
        current: sets.current.size, age30: sets.age30.size,
        lessThan30: new Set([...sets.current, ...sets.age30]).size,
        age60: sets.age60.size, age90: sets.age90.size, over90: 0,
        totalOverdue: new Set([...sets.age30, ...sets.age60, ...sets.age90]).size,
        overdue60Plus: sets.age90.size,
      },
    },
  }, { merge: true });

  // Per-student debts recomputed; credits (from over-paid bills, which are 'Paid') kept from the index.
  const oldBy: Record<string, any> = (balancesSnap.data() || {}).byStudent || {};
  const byStudent: Record<string, any> = {};
  new Set([...Object.keys(oldBy), ...Object.keys(debtByStudent)]).forEach(k => {
    const debt = r2(debtByStudent[k] || 0);
    const credit = r2(Number(oldBy[k]?.credit) || 0);
    const years = oldBy[k]?.years || {};
    const ag = agingByStudent[k] || { c: 0, a30: 0, a60: 0, a90: 0, oldestDue: 0 };
    if (debt > 0.009 || credit > 0.009 || Object.keys(years).length) {
      byStudent[k] = { debt, credit, years, aging: { c: r2(ag.c), a30: r2(ag.a30), a60: r2(ag.a60), a90: r2(ag.a90) }, oldestDue: ag.oldestDue || 0 };
    }
  });
  await writeBalanceIndex(schoolId, byStudent, { refreshedAt: FieldValue.serverTimestamp() });
  await writeRoster(schoolId, studentsSnap.docs);
}

// ── TRIGGER 1: Students ────────────────────────────────────────────────────────
export const onStudentWrite = onDocumentWritten(
  'students/{studentId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    // Keep the Student Billing roster in step (only when a field it shows changed; no reads).
    try {
      const id = event.params.studentId;
      const eb = rosterEntry(before);
      const ea = rosterEntry(after);
      const oldSchool = before?.schoolId;
      const newSchool = after?.schoolId;
      if (oldSchool && oldSchool !== newSchool) {
        await ROSTER(oldSchool).set({ students: { [id]: FieldValue.delete() }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      }
      if (newSchool && ea && (JSON.stringify(eb) !== JSON.stringify(ea) || oldSchool !== newSchool)) {
        // mergeFields replaces this student's whole entry (so cleared fields disappear) and nothing else.
        await ROSTER(newSchool).set(
          { students: { [id]: ea }, updatedAt: FieldValue.serverTimestamp() },
          { mergeFields: [new FieldPath('students', id), 'updatedAt'] },
        );
      } else if (!after && oldSchool) {
        await ROSTER(oldSchool).set({ students: { [id]: FieldValue.delete() }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      }
    } catch (rosterErr: any) {
      console.warn('[studentRoster] update failed:', rosterErr?.message);
    }

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

    // Financial totals are no longer fully recomputed on every enrolment change (a bulk import of N
    // students used to trigger N whole-school recomputes); the nightly rebuild picks this up.
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

    // COST GUARD: Only process class-level aggregated attendance documents (${schoolId}_${classId}_${dateStr})
    // Skip individual student attendance records (prefixed with 'att-') which otherwise cause an O(N^2) read cascade!
    const recordId = event.params.recordId;
    if (recordId && recordId.startsWith('att-')) {
      return;
    }

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
    const submittedClassIds = new Set<string>();

    snap.forEach(doc => {
      if (doc.id.startsWith('att-')) return;
      const d = doc.data();
      if (d.classId) submittedClassIds.add(d.classId);
      if (typeof d.presentCount === 'number') {
        present += d.presentCount;
        absent += (d.absentCount || 0);
        late += (d.lateCount || 0);
        if (d.studentsMap && typeof d.studentsMap === 'object') {
          Object.values(d.studentsMap).forEach((s: any) => {
            if (s.status === 'Absent' && absentIds.length < 25) {
              absentIds.push(s.studentId);
            }
          });
        }
      } else {
        if (d.status === 'Present') present++;
        else if (d.status === 'Absent') { absent++; if (absentIds.length < 25) absentIds.push(d.studentId as string); }
        else if (d.status === 'Late') late++;
      }
    });

    const total = present + absent + late;
    const rate  = total > 0 ? Math.round((present / total) * 100) : 0;

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      attendance: { date: dateStr, totalPresent: present, totalAbsent: absent, totalLate: late, attendanceRate: rate, absentStudentIds: absentIds, submittedClassIds: Array.from(submittedClassIds) },
    }, { merge: true });
  }
);

/** Fee category used by the per-fee rates (same names as the Accounts page). */
function feeCatOf(r: any): string {
  const t = String(r?.type || r?.category || '').toLowerCase();
  if (t.includes('tuition')) return 'Tuition';
  if (t.includes('canteen')) return 'Canteen';
  if (t.includes('transport')) return 'Transport';
  if (t.includes('pta')) return 'PTA Levy';
  return 'Other';
}

/** Academic-year key of a bill (term stamp, else its academicYear field); 'unknown' when it has none. */
function recordYearKey(r: any): string {
  const st = termStampOfRecord(r);
  return st?.academicYear || normalizeYear(r?.academicYear) || 'unknown';
}

// ── Incremental financial helpers ────────────────────────────────────────────────
// Each bill / payment write applies only the DIFFERENCE between its before and after state using
// FieldValue.increment — zero reads per write. The nightly rebuild (term-safety-net) recomputes
// everything exactly (aging, categories, collection rate) and removes any drift.
const round2 = (n: number) => Math.round(n * 100) / 100;

function debtKey(r: any): 'tuition' | 'canteen' | 'transport' | 'other' {
  const t = String(r?.type || r?.category || '').toLowerCase();
  if (t.includes('tuition')) return 'tuition';
  if (t.includes('canteen')) return 'canteen';
  if (t.includes('transport')) return 'transport';
  return 'other';
}

function anyMs(v: any): number {
  if (!v) return 0;
  if (typeof v?.toMillis === 'function') return v.toMillis();
  if (typeof v?.seconds === 'number') return v.seconds * 1000;
  if (typeof v?._seconds === 'number') return v._seconds * 1000;
  const t = new Date(v).getTime();
  return isNaN(t) ? 0 : t;
}

/** Same rule as the Accounts page: due date, else bill date, else creation date; none = not yet due. */
function agingBucket(r: any): 'current' | 'age30' | 'age60' | 'age90' {
  const due = anyMs(r?.dueDate) || anyMs(r?.date) || anyMs(r?.createdAt);
  if (!due) return 'current';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(due);
  d.setHours(0, 0, 0, 0);
  const days = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'current';
  if (days <= 30) return 'age30';
  if (days <= 60) return 'age60';
  return 'age90';
}

function recordContribution(r: any): { billed: number; outstanding: number; overpaid: number; key: string; bucket: string; paid: number; waived: number; year: string; cat: string } {
  if (!r || r.isArchived === true || r.status === 'Pending Reversal') return { billed: 0, outstanding: 0, overpaid: 0, key: 'other', bucket: 'current', paid: 0, waived: 0, year: 'unknown', cat: 'Other' };
  const billed = Number(r.billedAmount ?? r.amount ?? 0) || 0;
  const balance = billed - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0);
  return {
    billed,
    outstanding: balance > 0.01 ? balance : 0,
    overpaid: balance < 0 ? -balance : 0,
    key: debtKey(r),
    bucket: agingBucket(r),
    paid: Number(r.amountPaid) || 0,
    waived: Number(r.waiverAmount) || 0,
    year: recordYearKey(r),
    cat: feeCatOf(r),
  };
}

function streamKey(p: any): 'tuition' | 'canteen' | 'transport' | 'auxiliary' {
  const c = classifyCategory(p);
  return c === 'tuition' || c === 'canteen' || c === 'transport' ? c : 'auxiliary';
}

function paymentContribution(p: any): { amount: number; ms: number; stream: string } | null {
  if (!p || p.isArchived === true || p.isCarryForward === true) return null;
  if (p.status === 'Reversed' || p.status === 'Cancelled' || p.status === 'Pending Reversal') return null;
  const amount = Number(p.amount) || Number(p.amountPaid) || Number(p.totalAmount) || 0;
  if (amount <= 0) return null;
  const dv = p.paidAt || p.createdAt || p.date || p.timestamp;
  const ms = dv ? (dv.toMillis?.() ?? new Date(dv).getTime()) : 0;
  return { amount, ms: isNaN(ms) ? 0 : ms, stream: streamKey(p) };
}

// ── TRIGGER 3: Financial Records (incremental) ──────────────────────────────────────
export const onFinancialRecordWrite = onDocumentWritten(
  'financialRecords/{recordId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    // Every bill must carry isArchived so ledgers can query only open bills (isArchived == false).
    // Bills created by any screen without the field get it here, within a second of being written.
    if (after && after.isArchived === undefined && event.data?.after?.ref) {
      await event.data.after.ref.update({ isArchived: false }).catch(() => undefined);
    }

    // Per-student balance index (no reads: increments only). A bill moving between students is handled too.
    {
      const parts = (r: any) => {
        const lb = ledgerBalance(r);
        const live = !!r && r.isArchived !== true && r.status !== 'Pending Reversal';
        return {
          sid: r?.studentId ? String(r.studentId) : '', debt: lb > 0 ? lb : 0, credit: lb < 0 ? -lb : 0,
          year: recordYearKey(r),
          b: live ? Number(r.billedAmount) || 0 : 0, p: live ? Number(r.amountPaid) || 0 : 0, w: live ? Number(r.waiverAmount) || 0 : 0,
        };
      };
      const pb = parts(before);
      const pa = parts(after);
      const inc: Record<string, { debt: number; credit: number; years: Record<string, { b: number; p: number; w: number }> }> = {};
      const add = (p: typeof pa, sign: number) => {
        if (!p.sid) return;
        const e = (inc[p.sid] = inc[p.sid] || { debt: 0, credit: 0, years: {} });
        e.debt = round2(e.debt + sign * p.debt);
        e.credit = round2(e.credit + sign * p.credit);
        if (p.b || p.p || p.w) {
          const y = (e.years[p.year] = e.years[p.year] || { b: 0, p: 0, w: 0 });
          y.b = round2(y.b + sign * p.b);
          y.p = round2(y.p + sign * p.p);
          y.w = round2(y.w + sign * p.w);
        }
      };
      add(pb, -1);
      add(pa, 1);
      const big = (n: number) => Math.abs(n) > 0.001;
      const out: Record<string, any> = {};
      Object.entries(inc).forEach(([k, v]) => {
        const entry: Record<string, any> = {};
        if (big(v.debt)) entry.debt = FieldValue.increment(v.debt);
        if (big(v.credit)) entry.credit = FieldValue.increment(v.credit);
        const yrs: Record<string, any> = {};
        Object.entries(v.years).forEach(([y, t]) => {
          const yi: Record<string, any> = {};
          if (big(t.b)) yi.b = FieldValue.increment(t.b);
          if (big(t.p)) yi.p = FieldValue.increment(t.p);
          if (big(t.w)) yi.w = FieldValue.increment(t.w);
          if (Object.keys(yi).length) yrs[y] = yi;
        });
        if (Object.keys(yrs).length) entry.years = yrs;
        if (Object.keys(entry).length) out[k] = entry;
      });
      if (Object.keys(out).length) {
        await BALANCES(schoolId).set({
          schoolId,
          byStudent: out,
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true }).catch(e => console.warn('[studentBalances] increment failed:', e?.message));
      }
    }

    const b = recordContribution(before);
    const a = recordContribution(after);
    const billedDelta = round2(a.billed - b.billed);
    const outstandingDelta = round2(a.outstanding - b.outstanding);

    const streamDebts: Record<string, number> = {};
    if (b.outstanding) streamDebts[b.key] = round2((streamDebts[b.key] || 0) - b.outstanding);
    if (a.outstanding) streamDebts[a.key] = round2((streamDebts[a.key] || 0) + a.outstanding);
    const debtEntries = Object.entries(streamDebts).filter(([, v]) => Math.abs(v) > 0.001);

    // Keep the aging buckets and credit total in step too, so the Director dashboard matches the Accounts
    // page during the day (the nightly rebuild re-buckets bills as they age).
    const aging: Record<string, number> = {};
    if (b.outstanding) aging[b.bucket] = round2((aging[b.bucket] || 0) - b.outstanding);
    if (a.outstanding) aging[a.bucket] = round2((aging[a.bucket] || 0) + a.outstanding);
    const overpaidDelta = round2(a.overpaid - b.overpaid);
    const agingEntries = Object.entries(aging).filter(([, v]) => Math.abs(v) > 0.001);

    const paidOrWaivedChanged = Math.abs(a.paid - b.paid) > 0.001 || Math.abs(a.waived - b.waived) > 0.001 || a.year !== b.year;
    if (Math.abs(billedDelta) < 0.001 && Math.abs(outstandingDelta) < 0.001 && debtEntries.length === 0
      && agingEntries.length === 0 && Math.abs(overpaidDelta) < 0.001 && !paidOrWaivedChanged) return;

    const financials: Record<string, any> = {
      totalBilled: FieldValue.increment(billedDelta),
      totalOutstanding: FieldValue.increment(outstandingDelta),
    };
    if (debtEntries.length) {
      financials.streamDebts = Object.fromEntries(debtEntries.map(([k, v]) => [k, FieldValue.increment(v)]));
    }
    const debtAging: Record<string, any> = Object.fromEntries(agingEntries.map(([k, v]) => [k, FieldValue.increment(v)]));
    // Per-year billing totals (used for the collection rate), keyed by each bill's own academic year.
    const yb: Record<string, Record<string, number>> = {};
    const addYear = (c: typeof a, sign: number) => {
      if (!c.billed && !c.paid && !c.waived) return;
      const y = (yb[c.year] = yb[c.year] || { billed: 0, paid: 0, waived: 0 });
      y.billed = round2(y.billed + sign * c.billed);
      y.paid = round2(y.paid + sign * c.paid);
      y.waived = round2(y.waived + sign * c.waived);
    };
    addYear(b, -1);
    addYear(a, 1);
    const yearBillsInc: Record<string, any> = {};
    Object.entries(yb).forEach(([year, v]) => {
      const inc: Record<string, any> = {};
      (['billed', 'paid', 'waived'] as const).forEach(f => { if (Math.abs(v[f]) > 0.001) inc[f] = FieldValue.increment(v[f]); });
      if (Object.keys(inc).length) yearBillsInc[year] = inc;
    });
    if (Object.keys(yearBillsInc).length) financials.yearBills = yearBillsInc;
    // Per-year, per-fee totals (for the per-fee collection rates between full rebuilds).
    const ycInc: Record<string, Record<string, Record<string, any>>> = {};
    const addCat = (c: typeof a, sign: number) => {
      if (!c.billed && !c.paid && !c.waived) return;
      const y = (ycInc[c.year] = ycInc[c.year] || {});
      const e = (y[c.cat] = y[c.cat] || { billed: 0, paid: 0, waived: 0 });
      e.billed = round2(e.billed + sign * c.billed);
      e.paid = round2(e.paid + sign * c.paid);
      e.waived = round2(e.waived + sign * c.waived);
    };
    addCat(b, -1);
    addCat(a, 1);
    const ycOut: Record<string, any> = {};
    Object.entries(ycInc).forEach(([y, cats]) => Object.entries(cats).forEach(([c, v]) => {
      const inc: Record<string, any> = {};
      (['billed', 'paid', 'waived'] as const).forEach(f => { if (Math.abs(v[f]) > 0.001) inc[f] = FieldValue.increment(v[f]); });
      if (Object.keys(inc).length) { ycOut[y] = ycOut[y] || {}; ycOut[y][c] = inc; }
    }));
    if (Object.keys(ycOut).length) financials.yearCats = ycOut;
    if (Math.abs(overpaidDelta) >= 0.001) debtAging.overpayments = FieldValue.increment(overpaidDelta);

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      financials,
      ...(Object.keys(debtAging).length ? { debtAging } : {}),
    }, { merge: true });
  }
);

// ── TRIGGER 3.5: Payments Subcollection (incremental) ───────────────────────────────
export const onPaymentSubcollectionWrite = onDocumentWritten(
  'financialRecords/{recordId}/payments/{paymentId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    const schoolId: string | undefined = after?.schoolId ?? before?.schoolId;
    if (!schoolId) return;

    const b = paymentContribution(before);
    const a = paymentContribution(after);
    if (!a && !b) return;

    const todayMs = todayStartMs();
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const monthMs = monthStart.getTime();

    const amt = (c: typeof a) => (c ? c.amount : 0);
    const inWindow = (c: typeof a, from: number) => (c && c.ms >= from ? c.amount : 0);

    const revenueDelta = round2(amt(a) - amt(b));
    const todayDelta = round2(inWindow(a, todayMs) - inWindow(b, todayMs));
    const monthDelta = round2(inWindow(a, monthMs) - inWindow(b, monthMs));

    const streams: Record<string, number> = {};
    if (b) streams[b.stream] = round2((streams[b.stream] || 0) - b.amount);
    if (a) streams[a.stream] = round2((streams[a.stream] || 0) + a.amount);
    const streamEntries = Object.entries(streams).filter(([, v]) => Math.abs(v) > 0.001);

    const isNewRealPayment = !before && !!a && !after?.isAllocation;
    if (Math.abs(revenueDelta) < 0.001 && streamEntries.length === 0 && !isNewRealPayment) return;

    const financials: Record<string, any> = {
      totalRevenue: FieldValue.increment(revenueDelta),
      totalCollectedThisTerm: FieldValue.increment(revenueDelta),
      totalCollectedThisYear: FieldValue.increment(revenueDelta),
      totalCollectedToday: FieldValue.increment(todayDelta),
      totalCollectedThisMonth: FieldValue.increment(monthDelta),
    };
    if (streamEntries.length) {
      financials.streamBreakdown = Object.fromEntries(streamEntries.map(([k, v]) => [k, FieldValue.increment(v)]));
    }
    if (isNewRealPayment && a && a.ms >= todayMs) {
      financials.lastPaymentAmount = a.amount;
      financials.lastPaymentAt = after?.paidAt || after?.createdAt || FieldValue.serverTimestamp();
    }

    await SUMMARY(schoolId).set({
      schoolId,
      lastUpdated: FieldValue.serverTimestamp(),
      financials,
    }, { merge: true });
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

    const todayMs = todayStartMs();
    const todayTimestamp = Timestamp.fromMillis(todayMs);

    // COST GUARD: Filter by timestamp >= todayTimestamp in Firestore directly (avoids reading historical clock-ins)
    const snap = await db.collection('staff_attendance')
      .where('schoolId', '==', schoolId)
      .where('type', '==', 'In')
      .where('timestamp', '>=', todayTimestamp)
      .get();

    const presentSet = new Set<string>();
    let lateCount = 0;

    snap.forEach(doc => {
      const d = doc.data();
      presentSet.add(d.staffId as string);
      if (d.status === 'Late') lateCount++;
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

// ── PHASE 2: ATTENDANCE SUMMARIZATION ENGINE ─────────────────────────────────
export async function summarizeTermAttendance(schoolId: string, termId: string): Promise<void> {
  const snap = await db.collection('attendance')
    .where('schoolId', '==', schoolId)
    .where('termId', '==', termId)
    .get();

  const studentStats: Record<string, { present: number; absent: number; late: number; total: number }> = {};
  const batch = db.batch();

  snap.forEach(d => {
    const data = d.data();
    const studentId = data.studentId as string;
    if (!studentId) return;

    if (!studentStats[studentId]) {
      studentStats[studentId] = { present: 0, absent: 0, late: 0, total: 0 };
    }

    studentStats[studentId].total++;
    if (data.status === 'Present') studentStats[studentId].present++;
    else if (data.status === 'Absent') studentStats[studentId].absent++;
    else if (data.status === 'Late') studentStats[studentId].late++;

    // Mark raw daily attendance doc as archived (idempotent)
    batch.update(d.ref, { isArchived: true });
  });

  // Write deterministic summary doc per student: att_summary_${schoolId}_${studentId}_${termId}
  for (const [studentId, stats] of Object.entries(studentStats)) {
    const docId = `att_summary_${schoolId}_${studentId}_${termId}`;
    const rate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

    const summaryRef = db.collection('attendance_summaries').doc(docId);
    batch.set(summaryRef, {
      schoolId,
      studentId,
      termId,
      totalPresent: stats.present,
      totalAbsent: stats.absent,
      totalLate: stats.late,
      totalDays: stats.total,
      attendanceRate: rate,
      isArchived: true,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  await batch.commit();
}

// ── PHASE 2: ACADEMIC REPORT CARD & GRADEBOOK LOCKING ────────────────────────
export async function lockTermReportCards(schoolId: string, termId: string): Promise<void> {
  const reportsSnap = await db.collection('report-cards')
    .where('schoolId', '==', schoolId)
    .where('termId', '==', termId)
    .get();

  const batch = db.batch();

  reportsSnap.forEach(docSnap => {
    const data = docSnap.data();
    const studentId = data.studentId as string;
    if (!studentId) return;

    // Deterministic frozen summary doc ID: term_report_card_${schoolId}_${studentId}_${termId}
    const docId = `term_report_card_${schoolId}_${studentId}_${termId}`;
    const lockedRef = db.collection('term_report_cards').doc(docId);

    batch.set(lockedRef, {
      ...data,
      id: docId,
      schoolId,
      studentId,
      termId,
      isLocked: true,
      isArchived: true,
      lockedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    batch.update(docSnap.ref, { isArchived: true });
  });

  const assessmentsSnap = await db.collection('assessments')
    .where('schoolId', '==', schoolId)
    .where('termId', '==', termId)
    .get();

  assessmentsSnap.forEach(aDoc => {
    batch.update(aDoc.ref, { isArchived: true });
  });

  await batch.commit();
}








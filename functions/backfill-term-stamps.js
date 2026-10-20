/**
 * ONE-TIME BACKFILL: stamp termId / academicYear / term on existing bills and payments.
 *
 * Run from the `functions` folder:
 *   npm run build                                   (compiles lib/term-utils.js, the shared term logic)
 *   node backfill-term-stamps.js                    (REPORT ONLY — nothing is written)
 *   node backfill-term-stamps.js --apply            (writes the stamps)
 *   node backfill-term-stamps.js --school <id>      (one school only; combine with --apply)
 *
 * Uses the same .env credentials as the inspect-*.js scripts (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL,
 * FIREBASE_PRIVATE_KEY in ../.env).
 *
 * Rules (a bill that already has a valid termId is never changed):
 *   1. Bill has academicYear + term           → stamped from those.
 *   2. Otherwise, dated on/after the current term's start date (School Profile) → current term.
 *   3. Otherwise                              → left unstamped and counted as "older, no term info".
 *      These are still included by the end-of-term rollover (it carries every open bill that is not in
 *      the new term), so nothing is lost; they just won't show under a specific historic term.
 * Also sets isArchived:false where the field is missing, and stamps each payment with its bill's term.
 * With --apply it then marks the school (schoolSettings.billsHaveArchiveFlag) so Student Billing and the
 * nightly summary read only open bills instead of the school's whole history.
 * Deploy the functions first (they give new bills the isArchived field).
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const { currentTermFromProfile, termStampOfRecord, stampFromTermId } = require('./lib/term-utils');

dotenv.config({ path: '../.env' });

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in ../.env');
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();

const toMs = v => {
  if (!v) return 0;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (typeof v._seconds === 'number') return v._seconds * 1000;
  const t = new Date(v).getTime();
  return isNaN(t) ? 0 : t;
};

async function commit(ops) {
  for (let i = 0; i < ops.length; i += 400) {
    const batch = db.batch();
    ops.slice(i, i + 400).forEach(([ref, data]) => batch.update(ref, data));
    await batch.commit();
  }
}

async function backfillSchool(schoolId) {
  const [schoolSnap, settingsSnap] = await Promise.all([
    db.collection('schools').doc(schoolId).get(),
    db.collection('schoolSettings').doc(schoolId).get(),
  ]);
  const profile = { ...(settingsSnap.data() || {}), ...(schoolSnap.data() || {}) };
  const current = currentTermFromProfile(profile);
  const startMs = profile.termStartDate ? new Date(`${profile.termStartDate}T00:00:00`).getTime() : 0;

  const stats = { school: schoolId, name: profile.name || '', currentTerm: current ? current.termId : '(not set)',
    bills: 0, alreadyStamped: 0, fromYearAndTerm: 0, fromDate: 0, noTermInfo: 0, addedIsArchived: 0,
    payments: 0, paymentsStamped: 0 };

  const billOps = [];
  const billStamp = new Map();
  const recs = await db.collection('financialRecords').where('schoolId', '==', schoolId).get();
  recs.docs.forEach(d => {
    const r = d.data();
    stats.bills++;
    const update = {};
    let stamp = stampFromTermId(r.termId);
    if (stamp) {
      stats.alreadyStamped++;
    } else {
      stamp = termStampOfRecord(r);
      if (stamp) {
        stats.fromYearAndTerm++;
      } else if (current && startMs && Math.max(toMs(r.dueDate), toMs(r.createdAt)) >= startMs) {
        stamp = current;
        stats.fromDate++;
      } else {
        stats.noTermInfo++;
      }
      if (stamp) {
        update.termId = stamp.termId;
        if (!r.academicYear) update.academicYear = stamp.academicYear;
        if (!r.term) update.term = stamp.term;
      }
    }
    if (r.isArchived === undefined) { update.isArchived = false; stats.addedIsArchived++; }
    if (stamp) billStamp.set(d.id, stamp);
    if (Object.keys(update).length) billOps.push([d.ref, update]);
  });

  const payOps = [];
  const pays = await db.collectionGroup('payments').where('schoolId', '==', schoolId).get();
  pays.docs.forEach(d => {
    const p = d.data();
    const parentId = d.ref.parent.parent && d.ref.parent.parent.id;
    if (!parentId || d.ref.parent.parent.parent.id !== 'financialRecords') return;
    stats.payments++;
    if (stampFromTermId(p.termId)) return;
    const stamp = billStamp.get(parentId);
    if (!stamp) return;
    payOps.push([d.ref, { termId: stamp.termId, academicYear: p.academicYear || stamp.academicYear }]);
    stats.paymentsStamped++;
  });

  if (APPLY) {
    await commit(billOps);
    await commit(payOps);
    // Every bill now has isArchived, so the ledger and the nightly summary can read open bills only
    // (bills created later get the field from the onFinancialRecordWrite function).
    await db.collection('schoolSettings').doc(schoolId).set({ billsHaveArchiveFlag: true }, { merge: true });
    stats.archiveFlagReady = true;
  }
  return stats;
}

(async () => {
  const ids = schoolArg ? [schoolArg] : (await db.collection('schoolSettings').get()).docs.map(d => d.id);
  console.log(APPLY ? 'APPLYING term stamps…' : 'REPORT ONLY (add --apply to write)');
  for (const id of ids) {
    try {
      const s = await backfillSchool(id);
      console.log(
        `\n${s.name || s.school} [${s.school}]  current term: ${s.currentTerm}\n` +
        `  bills: ${s.bills}  already stamped: ${s.alreadyStamped}  from year+term: ${s.fromYearAndTerm}  ` +
        `from date (current term): ${s.fromDate}  older, no term info: ${s.noTermInfo}  isArchived added: ${s.addedIsArchived}\n` +
        `  payments: ${s.payments}  payments stamped: ${s.paymentsStamped}` +
        (s.archiveFlagReady ? `\n  ledger now reads open bills only (billsHaveArchiveFlag set)` : '')
      );
    } catch (e) {
      console.error(`School ${id} failed:`, e.message);
    }
  }
  console.log(APPLY ? '\nDone.' : '\nNothing was written.');
})().catch(e => { console.error(e); process.exit(1); });

/**
 * Fix bills filed under the wrong academic year/term.
 *
 * If this term's fees were created before School Profile was switched to the new year/term, they carry
 * last year's stamp — so "Collected This Year" and the collection rate leave them out. This finds open
 * (not archived) bills DATED ON OR AFTER the current term's start date (School Profile → Term Start Date)
 * that carry an OLDER term, and re-stamps them with the current term.
 *
 * Run from the `functions` folder (after `npm run build`):
 *   node restamp-term-bills.js                     REPORT ONLY — nothing is written
 *   node restamp-term-bills.js --school <id>       one school
 *   node restamp-term-bills.js --apply             re-stamp (combine with --school to do one school)
 *
 * Check the report first: a bill for LAST term that was only entered after this term started would also
 * be listed (it is dated in this term). If you see such bills, re-stamp them by hand instead.
 *
 * FUTURE-TERM bills (stamped Term 2 / Term 3 while the school is still in Term 1) are left alone by default,
 * because they may be genuine advance fees. To check them and, if they are really this term's fees filed
 * under the wrong term, move them to the current term:
 *   node restamp-term-bills.js --school <id> --future                 lists every such bill (nothing written)
 *   node restamp-term-bills.js --school <id> --future --type tuition  only bills whose fee type contains "tuition"
 *   node restamp-term-bills.js --school <id> --future --apply         moves the listed bills to the current term
 *
 * Never touches: archived bills, carried-forward balances (Arrears/Credit Brought Forward, opening
 * balances), bills dated before the term start, or bills already stamped with the current term.
 * Payments on re-stamped bills get the same term. Then run node rebuild-dashboard-summaries.js.
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const { currentTermFromProfile, termStampOfRecord, compareTermIds } = require('./lib/term-utils');
dotenv.config({ path: '../.env' });

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;
const FUTURE = args.includes('--future');
const typeFilter = args.includes('--type') ? String(args[args.indexOf('--type') + 1] || '').toLowerCase() : '';

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
const isCarried = r => r.isCarryForward === true || r.isOpeningBalance === true || r.category === 'Arrears' ||
  /brought forward/i.test(`${r.title || ''} ${r.description || ''}`);

async function run(schoolId) {
  const [schoolSnap, settingsSnap] = await Promise.all([
    db.collection('schools').doc(schoolId).get(),
    db.collection('schoolSettings').doc(schoolId).get(),
  ]);
  const profile = { ...(settingsSnap.data() || {}), ...(schoolSnap.data() || {}) };
  const current = currentTermFromProfile(profile);
  const name = profile.name || schoolId;
  if (!current) { console.log(`\n${name} [${schoolId}]: no term set in School Profile — skipped`); return; }
  const startMs = profile.termStartDate ? new Date(`${profile.termStartDate}T00:00:00`).getTime() : 0;
  if (!startMs) { console.log(`\n${name} [${schoolId}]: no Term Start Date in School Profile — skipped (set it first)`); return; }

  const snap = await db.collection('financialRecords').where('schoolId', '==', schoolId).get();
  const fixes = [];
  const byFrom = {};
  const details = [];
  snap.docs.forEach(d => {
    const r = d.data();
    if (r.isArchived === true || isCarried(r)) return;
    const dated = Math.max(toMs(r.dueDate), toMs(r.date), toMs(r.createdAt));
    if (!dated || dated < startMs) return;
    const st = termStampOfRecord(r);
    if (st && st.termId === current.termId) return;
    const isFuture = !!st && compareTermIds(st.termId, current.termId) > 0;
    if (FUTURE !== isFuture) return; // default: older/unstamped only; --future: later-term bills only
    if (typeFilter && !String(r.type || r.category || '').toLowerCase().includes(typeFilter)) return;
    if (FUTURE) {
      const paid = Number(r.amountPaid) || 0;
      details.push(`    ${st.termId}  ${new Date(dated).toISOString().slice(0, 10)}  ${(r.studentName || r.studentId || '').slice(0, 26).padEnd(26)} ${(r.type || 'Other').slice(0, 22).padEnd(22)} GH₵${(Number(r.billedAmount) || 0).toFixed(2).padStart(9)}  paid ${paid.toFixed(2).padStart(9)}  ${(r.description || '').slice(0, 40)}`);
    }
    const from = st ? st.termId : '(no term)';
    const k = `${from} | ${r.type || 'Other'}`;
    byFrom[k] = byFrom[k] || { count: 0, billed: 0 };
    byFrom[k].count++;
    byFrom[k].billed += Number(r.billedAmount) || 0;
    fixes.push(d);
  });

  console.log(`\n${name} [${schoolId}]  current term ${current.termId} (starts ${profile.termStartDate})${FUTURE ? '  — FUTURE-TERM bills' : ''}`);
  if (!fixes.length) { console.log(FUTURE ? '  no bills filed under a later term' : '  nothing to re-stamp'); return; }
  Object.entries(byFrom).sort().forEach(([k, v]) => console.log(`  ${k.padEnd(45)} ${String(v.count).padStart(6)} bills  GH₵${v.billed.toFixed(2)}`));
  if (FUTURE) {
    console.log('\n    filed as     dated       pupil                      fee type               billed           paid  description');
    details.sort().forEach(l => console.log(l));
    if (!APPLY) console.log('\n  If these are THIS term\'s fees (not real advance billing), add --apply to move them to ' + current.termId + '.');
  }

  if (!APPLY) return;
  const update = { termId: current.termId, academicYear: current.academicYear, term: current.term, restampedAt: admin.firestore.FieldValue.serverTimestamp() };
  let batch = db.batch();
  let ops = 0;
  const flush = async () => { if (ops) { await batch.commit(); batch = db.batch(); ops = 0; } };
  for (const d of fixes) {
    const pays = await d.ref.collection('payments').get();
    if (ops + 1 + pays.size > 400) await flush();
    batch.update(d.ref, { ...update, restampedFrom: termStampOfRecord(d.data())?.termId || null });
    ops++;
    pays.docs.forEach(p => {
      if (p.data().isCarryForward) return;
      batch.update(p.ref, { termId: current.termId, academicYear: current.academicYear });
      ops++;
    });
  }
  await flush();
  console.log(`  re-stamped ${fixes.length} bills to ${current.termId}`);
}

(async () => {
  const ids = schoolArg ? [schoolArg] : (await db.collection('schoolSettings').get()).docs.map(d => d.id);
  console.log(APPLY ? 'RE-STAMPING…' : 'REPORT ONLY (add --apply to re-stamp)');
  for (const id of ids) {
    try { await run(id); } catch (e) { console.error(`School ${id} failed:`, e.message); }
  }
  console.log(APPLY ? '\nDone. Now run: node rebuild-dashboard-summaries.js' : '\nNothing was written.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

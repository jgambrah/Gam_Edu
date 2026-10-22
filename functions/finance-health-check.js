/**
 * READ-ONLY check of a school's billing figures — explains what the dashboards show.
 * Nothing is ever written.
 *
 * Run from the `functions` folder (after `npm run build`; uses ../.env):
 *   node finance-health-check.js --school <schoolId>
 *
 * It prints, for ACTIVE pupils' open bills:
 *   1. per academic year the bills are filed under: billed / paid / waived / still owed, Tuition separately
 *      ("unknown" = the bill has no year or term on it);
 *   2. bills filed under an OLDER year/term but created on or after this term's start date — these are this
 *      term's fees filed under last year (they leave the collection rate too high); fix with
 *      node restamp-term-bills.js --school <id>   (report first, then --apply);
 *   3. pupils with no Tuition bill this term, and pupils with MORE THAN ONE Tuition bill this term
 *      (possible double billing);
 *   4. the collection rate the dashboards show, worked out the same way, and what it would be if every
 *      open bill dated in this term were counted as this year's.
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const { currentTermFromProfile, termStampOfRecord, normalizeYear } = require('./lib/term-utils');
dotenv.config({ path: '../.env' });

const args = process.argv.slice(2);
const schoolId = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;
if (!schoolId) { console.error('Usage: node finance-health-check.js --school <schoolId>'); process.exit(1); }

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
if (!projectId || !clientEmail || !privateKey) { console.error('Missing FIREBASE_* in ../.env'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();

const n = v => { const x = Number(v); return Number.isFinite(x) ? x : 0; };
const money = v => n(v).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padStart(13);
const ms = v => !v ? 0 : (typeof v.toMillis === 'function' ? v.toMillis() : (typeof v === 'object' && v.seconds ? v.seconds * 1000 : new Date(v).getTime() || 0));
const isTuition = r => String(r.type || r.category || '').toLowerCase().includes('tuition');
const isCarried = r => /brought forward|opening balance/i.test(`${r.type || ''} ${r.description || ''}`) || /^(abf|cbf)_/.test(String(r._id || ''));
const yearOf = r => { const st = termStampOfRecord(r); return st ? st.academicYear : (normalizeYear(r.academicYear) || 'unknown'); };

(async () => {
  const [school, settings, studentsSnap, billsSnap] = await Promise.all([
    db.collection('schools').doc(schoolId).get(),
    db.collection('schoolSettings').doc(schoolId).get(),
    db.collection('students').where('schoolId', '==', schoolId).get(),
    db.collection('financialRecords').where('schoolId', '==', schoolId).get(),
  ]);
  const profile = { ...(settings.data() || {}), ...(school.data() || {}) };
  const term = currentTermFromProfile(school.data()) || currentTermFromProfile(settings.data());
  const termStart = profile.termStartDate ? new Date(`${profile.termStartDate}T00:00:00`).getTime() : 0;
  console.log(`\n${profile.name || schoolId}`);
  console.log(`Current term: ${term ? `${term.term} ${term.academicYear} (${term.termId})` : 'NOT SET in School Profile'}   term start: ${profile.termStartDate || 'NOT SET'}\n`);

  const active = new Map(); // any id -> student doc id
  const pupils = {};
  studentsSnap.forEach(d => {
    const s = d.data();
    if (s.isArchived === true || !(s.enrollmentStatus === 'Active' || !s.enrollmentStatus)) return;
    pupils[d.id] = `${s.firstName || ''} ${s.lastName || ''}`.trim();
    [d.id, s.uid, s.studentId, s.admissionNo, s.admissionNumber].filter(Boolean).forEach(k => active.set(String(k), d.id));
  });

  const byYear = {};
  const misfiled = [];
  const tuitionThisTerm = {};
  let thisTermBilled = 0, thisTermPaid = 0, thisTermWaived = 0;
  billsSnap.forEach(d => {
    const r = { ...d.data(), _id: d.id };
    if (r.isArchived === true || r.status === 'Pending Reversal' || r.voided === true) return;
    const pupil = active.get(String(r.studentId || ''));
    if (!pupil) return;
    const y = yearOf(r);
    const row = (byYear[y] = byYear[y] || { bills: 0, billed: 0, paid: 0, waived: 0, owed: 0, tBilled: 0, tOwed: 0 });
    const bal = n(r.billedAmount) - n(r.amountPaid) - n(r.waiverAmount);
    row.bills++; row.billed += n(r.billedAmount); row.paid += n(r.amountPaid); row.waived += n(r.waiverAmount);
    if (bal > 0.01) row.owed += bal;
    if (isTuition(r)) { row.tBilled += n(r.billedAmount); if (bal > 0.01) row.tOwed += bal; }

    const st = termStampOfRecord(r);
    const created = ms(r.createdAt) || ms(r.date) || ms(r.dueDate);
    const inThisTerm = term && (st ? st.termId === term.termId : (termStart && created >= termStart));
    if (term && st && st.termId !== term.termId && termStart && created >= termStart && !isCarried(r)) {
      misfiled.push(`${pupils[pupil] || pupil} · ${r.type || 'Bill'} · GH₵${n(r.billedAmount).toFixed(2)} · filed as ${st.termId}`);
    }
    if (inThisTerm || (termStart && created >= termStart)) {
      thisTermBilled += n(r.billedAmount); thisTermPaid += n(r.amountPaid); thisTermWaived += n(r.waiverAmount);
    }
    if (term && isTuition(r) && (st ? st.termId === term.termId : (termStart && created >= termStart))) {
      tuitionThisTerm[pupil] = (tuitionThisTerm[pupil] || 0) + 1;
    }
  });

  console.log('1. Open bills of active pupils, by the academic year they are filed under');
  console.log('   year          bills        billed          paid        waived          OWED   tuition billed   TUITION OWED');
  let totOwed = 0, totTOwed = 0;
  Object.entries(byYear).sort().forEach(([y, v]) => {
    totOwed += v.owed; totTOwed += v.tOwed;
    console.log(`   ${y.padEnd(10)} ${String(v.bills).padStart(7)} ${money(v.billed)} ${money(v.paid)} ${money(v.waived)} ${money(v.owed)}  ${money(v.tBilled)}  ${money(v.tOwed)}`);
  });
  console.log(`   ${'TOTAL'.padEnd(10)} ${''.padStart(7)} ${''.padStart(13)} ${''.padStart(13)} ${''.padStart(13)} ${money(totOwed)}  ${''.padStart(13)}  ${money(totTOwed)}`);
  console.log('   (compare: "Gross Outstanding" and "Tuition Debt" on Student Billing)\n');

  console.log(`2. Bills created this term but filed under an older term: ${misfiled.length}`);
  misfiled.slice(0, 25).forEach(l => console.log(`   - ${l}`));
  if (misfiled.length > 25) console.log(`   … and ${misfiled.length - 25} more`);
  if (misfiled.length) console.log('   → these leave the collection rate too high. Fix: node restamp-term-bills.js --school ' + schoolId);
  console.log('');

  const noTuition = Object.keys(pupils).filter(id => !tuitionThisTerm[id]);
  const multi = Object.entries(tuitionThisTerm).filter(([, c]) => c > 1);
  console.log(`3. Tuition bills this term: ${Object.keys(pupils).length - noTuition.length} of ${Object.keys(pupils).length} active pupils have one`);
  console.log(`   no Tuition bill this term: ${noTuition.length}${noTuition.length ? ' — e.g. ' + noTuition.slice(0, 8).map(id => pupils[id] || id).join(', ') : ''}`);
  console.log(`   MORE than one Tuition bill this term: ${multi.length}${multi.length ? ' — e.g. ' + multi.slice(0, 8).map(([id, c]) => `${pupils[id] || id} (${c})`).join(', ') : ''}\n`);

  const cy = term && byYear[term.academicYear];
  const rate = (b, p, w) => (b - w > 0 ? Math.min(100, (p / (b - w)) * 100) : 0);
  console.log('4. Collection rate');
  if (cy) console.log(`   as on the dashboards (bills filed under ${term.academicYear}): ${rate(cy.billed, cy.paid, cy.waived).toFixed(1)}%  (billed ${cy.billed.toFixed(2)}, paid ${cy.paid.toFixed(2)})`);
  console.log(`   all bills dated in this term, however they are filed:     ${rate(thisTermBilled, thisTermPaid, thisTermWaived).toFixed(1)}%  (billed ${thisTermBilled.toFixed(2)}, paid ${thisTermPaid.toFixed(2)})`);
  console.log('   If these two differ a lot, this term\'s bills are filed under the wrong year (see 2).\n');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

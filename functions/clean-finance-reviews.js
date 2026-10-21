/**
 * One-off clean-up of the Director's "Fee Changes to Review" list.
 *
 * The first version of the review trail listed EVERY change to a bill — including automatic ones (term
 * stamping scripts, attendance billing, credit moves, status updates) — so thousands of items piled up.
 * From now on only deliberate changes are listed (an "Edit Record" save, a deleted bill, a reversed
 * payment, expenses, salary changes, payroll runs, attendance cancellations).
 *
 * This script marks the automatic leftovers as "auto-cleared" (they stay in the database for the record,
 * they just leave the Director's list). It KEEPS:
 *   • reversed payments, deleted bills, expenses, salary changes, payroll runs, attendance cancellations;
 *   • bill edits made by a person with a reason, on bills that are not daily canteen/transport bills,
 *     where something other than the term label changed (amount, fee type, description, student).
 *   • anything the Director has already queried or that has been answered.
 *
 * Run from the `functions` folder (uses ../.env):
 *   node clean-finance-reviews.js                     REPORT ONLY — nothing is written
 *   node clean-finance-reviews.js --apply             clear the automatic items
 *   node clean-finance-reviews.js --school <id>       one school (combine with --apply)
 *   node clean-finance-reviews.js --all --apply       clear EVERY pending item (start the list afresh)
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in ../.env');
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const ALL = args.includes('--all');
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;

const ALWAYS_KEEP = new Set(['reversed', 'deleted', 'expense', 'salary', 'payroll', 'cancelled']);
const TERM_ONLY = new Set(['termId', 'academicYear', 'term']);
const isDaily = (t) => /canteen|transport/i.test(String(t || '')) && /daily/i.test(String(t || ''));

function keep(r) {
  if (ALL) return false;
  if (ALWAYS_KEEP.has(r.kind)) return !!r.editedBy || r.kind !== 'deleted';
  const person = !!r.editedBy && r.editedByName !== 'System (server)';
  const reason = String(r.reason || '').trim().length >= 3;
  const meaningful = Object.keys(r.changes || {}).some(k => !TERM_ONLY.has(k));
  return person && reason && meaningful && !isDaily(r.billType);
}

(async () => {
  let q = db.collection('financeReviews').where('status', '==', 'pending');
  if (schoolArg) q = q.where('schoolId', '==', schoolArg);
  const snap = await q.get();

  const toClear = [];
  const summary = {};
  let kept = 0;
  snap.docs.forEach(d => {
    const r = d.data();
    const k = keep(r);
    const key = `${r.schoolId} | ${k ? 'KEEP ' : 'CLEAR'} | ${r.kind} | ${r.editedByRole || (r.editedByName === 'System (server)' ? 'server' : 'unknown')}`;
    summary[key] = (summary[key] || 0) + 1;
    if (k) kept++; else toClear.push(d.ref);
  });

  console.log(`${APPLY ? 'APPLYING' : 'REPORT ONLY (add --apply to write)'}${ALL ? ' — clearing ALL pending items' : ''}\n`);
  Object.entries(summary).sort().forEach(([k, n]) => console.log(`  ${String(n).padStart(6)}  ${k}`));
  console.log(`\nPending: ${snap.size}   keep: ${kept}   clear: ${toClear.length}`);

  if (APPLY && toClear.length) {
    for (let i = 0; i < toClear.length; i += 450) {
      const batch = db.batch();
      toClear.slice(i, i + 450).forEach(ref => batch.update(ref, {
        status: 'auto-cleared',
        clearedAt: admin.firestore.FieldValue.serverTimestamp(),
        clearedNote: 'Automatic change (not a staff edit) — cleared from the review list.',
      }));
      await batch.commit();
    }
    console.log(`Cleared ${toClear.length}.`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

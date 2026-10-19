/**
 * Rebuild the Director dashboard's financial summary now (instead of waiting for the midnight rebuild).
 * Same calculation the nightly job runs, so the Director dashboard matches Accounts > Student Billing.
 *
 * Run from the `functions` folder (after `npm run build`):
 *   node rebuild-dashboard-summaries.js                  (every school)
 *   node rebuild-dashboard-summaries.js --school <id>    (one school)
 * Uses FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY from ../.env.
 * It only rewrites dashboard_summaries documents; bills and payments are read, never changed.
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
const { recalculateSchoolFinancials } = require('./lib/dashboard-aggregators');

const args = process.argv.slice(2);
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;

(async () => {
  const ids = schoolArg ? [schoolArg] : (await admin.firestore().collection('schoolSettings').get()).docs.map(d => d.id);
  for (const id of ids) {
    try {
      await recalculateSchoolFinancials(id);
      const sum = (await admin.firestore().collection('dashboard_summaries').doc(id).get()).data() || {};
      const fin = sum.financials || {};
      const da = sum.debtAging || {};
      const gross = ['current', 'age30', 'age60', 'age90'].reduce((t, k) => t + (Number(da[k]) || 0), 0);
      console.log(`\nRebuilt ${id}  current year: ${fin.currentAcademicYear || '(not set in School Profile)'}`);
      console.log(`  debt GH₵${gross.toFixed(2)}  credits GH₵${(Number(da.overpayments) || 0).toFixed(2)}  rate this year ${fin.collectionRate}%`);
      // Billing per academic year: if this term's fees appear under last year (or "unknown"), the bills were
      // created before School Profile was switched to the new year, and the collection rate will look wrong.
      Object.entries(fin.yearBills || {}).sort().forEach(([y, v]) => {
        console.log(`    ${y.padEnd(10)} billed ${Number(v.billed).toFixed(2).padStart(12)}  paid ${Number(v.paid).toFixed(2).padStart(12)}  waived ${Number(v.waived).toFixed(2).padStart(10)}`);
      });
    } catch (e) {
      console.error(`Failed ${id}:`, e.message);
    }
  }
  console.log('Done.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

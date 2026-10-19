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
      console.log(`Rebuilt ${id}`);
    } catch (e) {
      console.error(`Failed ${id}:`, e.message);
    }
  }
  console.log('Done.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

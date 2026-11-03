/**
 * Recounts the admissions figures on each school's dashboard summary (dashboard_summaries/{schoolId}.admissions):
 * pendingCount (applications waiting for review) and admittedByMonth (admitted per month).
 * Run ONCE after deploying the functions (the trigger keeps them up to date afterwards).
 *   cd functions && npm run build
 *   node rebuild-admissions-summary.js                  every school
 *   node rebuild-admissions-summary.js --school <id>    one school
 * Reads each school's applications once. Also removes the stray "admissions.pendingCount" /
 * "admissions.approvedThisMonth" fields the old trigger wrote.
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
if (!projectId || !clientEmail || !privateKey) { console.error('Missing FIREBASE_* in ../.env'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();
const { FieldValue, FieldPath } = admin.firestore;
const args = process.argv.slice(2);
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;

const ms = v => !v ? 0 : (typeof v.toMillis === 'function' ? v.toMillis() : (v.seconds ? v.seconds * 1000 : new Date(v).getTime() || 0));

(async () => {
  const ids = schoolArg ? [schoolArg] : (await db.collection('schoolSettings').get()).docs.map(d => d.id);
  for (const schoolId of ids) {
    const snap = await db.collection('admissionApplications').where('schoolId', '==', schoolId).get();
    let pending = 0;
    const byMonth = {};
    snap.forEach(d => {
      const a = d.data();
      if (a.isArchived === true) return;
      if (a.status === 'Pending Review') pending++;
      if (a.status === 'Admitted') {
        const t = ms(a.reviewedAt) || ms(a.submittedAt);
        if (t) { const m = new Date(t).toISOString().slice(0, 7); byMonth[m] = (byMonth[m] || 0) + 1; }
      }
    });
    const ref = db.collection('dashboard_summaries').doc(schoolId);
    await ref.set({ admissions: { pendingCount: pending, admittedByMonth: byMonth } }, { merge: true });
    try {
      await ref.update(new FieldPath('admissions.pendingCount'), FieldValue.delete(), new FieldPath('admissions.approvedThisMonth'), FieldValue.delete());
    } catch (e) { /* the stray fields may not exist */ }
    console.log(`${schoolId}: ${snap.size} applications · ${pending} pending · admitted by month ${JSON.stringify(byMonth)}`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

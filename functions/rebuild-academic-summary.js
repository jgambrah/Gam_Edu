/**
 * Builds the academic summaries (academicSummary/{schoolId}__{termId}) from all existing marks.
 * Run ONCE after deploying the functions (new marks are then counted automatically).
 *   cd functions && npm run build
 *   node rebuild-academic-summary.js                  every school
 *   node rebuild-academic-summary.js --school <id>    one school
 * Reads every mark of the school(s) once; writes one document per school and term (replacing it).
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
if (!projectId || !clientEmail || !privateKey) { console.error('Missing FIREBASE_* in ../.env'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const { markPart, contribution } = require('./lib/academic-summary');
const db = admin.firestore();
const args = process.argv.slice(2);
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;

// Deep-add a contribution object (plain numbers) into an accumulator.
function addInto(acc, obj) {
  Object.entries(obj).forEach(([k, v]) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) { acc[k] = acc[k] || {}; addInto(acc[k], v); }
    else if (typeof v === 'number') acc[k] = (acc[k] || 0) + v;
    else acc[k] = v;
  });
}

(async () => {
  const ids = schoolArg ? [schoolArg] : (await db.collection('schoolSettings').get()).docs.map(d => d.id);
  for (const schoolId of ids) {
    const snap = await db.collection('assessments').where('schoolId', '==', schoolId).get();
    const byTerm = {};
    snap.forEach(d => {
      const m = markPart(d.data());
      if (!m) return;
      byTerm[m.termId] = byTerm[m.termId] || {};
      addInto(byTerm[m.termId], contribution(m, 1, n => n));
    });
    for (const [termId, data] of Object.entries(byTerm)) {
      await db.collection('academicSummary').doc(`${schoolId}__${termId}`).set({ ...data, schoolId, termId, rebuiltAt: admin.firestore.FieldValue.serverTimestamp() });
    }
    console.log(`${schoolId}: ${snap.size} marks → ${Object.keys(byTerm).length} term summaries (${Object.keys(byTerm).sort().join(', ') || 'none'})`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

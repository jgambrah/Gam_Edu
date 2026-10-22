/**
 * Builds the parent-safe class averages (classAverages/{schoolId}__{termId}__{classId}) for the CURRENT
 * academic year only. Run ONCE after deploying the functions (new marks are then counted automatically).
 *   cd functions && npm run build
 *   node rebuild-class-averages.js                  every school
 *   node rebuild-class-averages.js --school <id>    one school
 * Reads only this academic year's marks of each school (not the full history); writes one small document
 * per class and term (replacing it). Contains no pupil names or ids.
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
if (!projectId || !clientEmail || !privateKey) { console.error('Missing FIREBASE_* in ../.env'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const { markPart, classContribution } = require('./lib/academic-summary');
const { currentTermFromProfile } = require('./lib/term-utils');
const db = admin.firestore();
const args = process.argv.slice(2);
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;

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
    const [school, settings] = await Promise.all([db.collection('schools').doc(schoolId).get(), db.collection('schoolSettings').doc(schoolId).get()]);
    const term = currentTermFromProfile(school.data()) || currentTermFromProfile(settings.data());
    if (!term) { console.log(`${schoolId}: no current term set — skipped`); continue; }
    // Marks carry the year as the school typed it ("2025/2026", "2025-2026"…); read each spelling once.
    const spellings = Array.from(new Set([school.data()?.academicYear, settings.data()?.academicYear, term.academicYear,
      term.academicYear.replace('-', '/'), term.academicYear.replace('-', ' - ')].filter(Boolean)));
    const seen = new Set();
    const byDoc = {};
    let read = 0;
    for (const y of spellings) {
      const snap = await db.collection('assessments').where('schoolId', '==', schoolId).where('academicYear', '==', y).get();
      read += snap.size;
      snap.forEach(d => {
        if (seen.has(d.id)) return; seen.add(d.id);
        const m = markPart(d.data());
        if (!m || !m.classId || !m.subjectId || m.termId === 'unknown') return;
        const key = `${schoolId}__${m.termId}__${m.classId}`;
        byDoc[key] = byDoc[key] || {};
        addInto(byDoc[key], classContribution(m, 1, n => n));
      });
    }
    for (const [key, data] of Object.entries(byDoc)) {
      await db.collection('classAverages').doc(key).set({ ...data, rebuiltAt: admin.firestore.FieldValue.serverTimestamp() });
    }
    console.log(`${schoolId}: ${read} marks of ${term.academicYear} → ${Object.keys(byDoc).length} class averages`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

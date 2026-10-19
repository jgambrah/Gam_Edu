/**
 * ONE-TIME MIGRATION: move payment / messaging keys out of public documents.
 *
 * Moves paystackSecKey, smsApiKey (and legacy arkeselApiKey), waInstanceId and waToken from
 * `schools/{id}` and `schoolSettings/{id}` into `schoolSecrets/{id}`, which only the server can read,
 * then deletes them from the old documents.
 *
 * Run from the `functions` folder, AFTER the new web app version is live (it reads the new location):
 *   node migrate-school-secrets.js            REPORT ONLY — shows which schools have keys to move
 *   node migrate-school-secrets.js --apply    moves them
 *
 * Safe to run more than once. A key already in schoolSecrets is never overwritten.
 * After this, issue NEW keys at Paystack / your SMS provider / UltraMsg and enter them in School Profile:
 * the old keys were readable and must be treated as exposed.
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const APPLY = process.argv.includes('--apply');
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in ../.env');
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();
const { FieldValue } = admin.firestore;

const FIELDS = ['paystackSecKey', 'smsApiKey', 'waInstanceId', 'waToken'];
const ALIASES = { smsApiKey: ['arkeselApiKey'] };
const LEGACY_KEYS = [...FIELDS, ...Object.values(ALIASES).flat()];
const clean = v => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const legacy = (doc, f) => doc && (clean(doc[f]) || (ALIASES[f] || []).map(a => clean(doc[a])).find(Boolean));

(async () => {
  console.log(APPLY ? 'MOVING KEYS…' : 'REPORT ONLY (add --apply to move the keys)');
  const ids = new Set();
  (await db.collection('schools').get()).docs.forEach(d => ids.add(d.id));
  (await db.collection('schoolSettings').get()).docs.forEach(d => ids.add(d.id));

  let schoolsWithKeys = 0;
  for (const id of ids) {
    const secureRef = db.collection('schoolSecrets').doc(id);
    const settingsRef = db.collection('schoolSettings').doc(id);
    const schoolRef = db.collection('schools').doc(id);
    const [secureSnap, settingsSnap, schoolSnap] = await db.getAll(secureRef, settingsRef, schoolRef);
    const secure = secureSnap.exists ? secureSnap.data() : {};
    const settings = settingsSnap.exists ? settingsSnap.data() : null;
    const school = schoolSnap.exists ? schoolSnap.data() : null;

    const inSettings = settings ? LEGACY_KEYS.filter(k => k in settings) : [];
    const inSchool = school ? LEGACY_KEYS.filter(k => k in school) : [];
    if (!inSettings.length && !inSchool.length) continue;
    schoolsWithKeys++;

    const toWrite = {};
    FIELDS.forEach(f => {
      if (clean(secure[f])) return;
      const v = legacy(settings, f) || legacy(school, f);
      if (v) toWrite[f] = v;
    });

    console.log(`${(school && school.name) || (settings && settings.name) || id} [${id}]: ` +
      `public keys in schools: ${inSchool.join(', ') || '-'}; in schoolSettings: ${inSettings.join(', ') || '-'}; ` +
      `moving: ${Object.keys(toWrite).join(', ') || '(already in secure store)'}`);

    if (APPLY) {
      const removal = Object.fromEntries(LEGACY_KEYS.map(k => [k, FieldValue.delete()]));
      const batch = db.batch();
      if (Object.keys(toWrite).length) batch.set(secureRef, { ...toWrite, schoolId: id, updatedAt: FieldValue.serverTimestamp(), updatedBy: 'migration' }, { merge: true });
      if (inSettings.length) batch.update(settingsRef, removal);
      if (inSchool.length) batch.update(schoolRef, removal);
      await batch.commit();
    }
  }
  console.log(`\n${schoolsWithKeys} school(s) had keys in public documents. ${APPLY ? 'Moved.' : 'Nothing was written.'}`);
})().catch(e => { console.error(e); process.exit(1); });

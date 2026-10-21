/**
 * One-off: create the public website copies (publicSites/{slug}, publicDomains/{domain}) for every school.
 * Run ONCE after deploying the functions, and BEFORE deploying the new security rules:
 *   cd functions && npm run build && node rebuild-public-sites.js
 * Afterwards the copies are kept current automatically whenever a school's profile or website is saved.
 * Uses FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY from ../.env.
 * Only publicSites/publicDomains are written; school documents are read, never changed.
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
const { syncPublicSite } = require('./lib/public-site');

(async () => {
  const snap = await admin.firestore().collection('schools').get();
  let ok = 0, noSlug = 0, failed = 0;
  for (const d of snap.docs) {
    const data = d.data();
    if (!data.slug) { noSlug++; console.log(`- ${d.id} (${data.name || 'no name'}): no web address (slug) yet — skipped`); continue; }
    try {
      await syncPublicSite(d.id, null, data);
      ok++;
      console.log(`✓ ${data.name || d.id}  →  /s/${String(data.slug).toLowerCase()}${data.customDomain ? `  +  ${data.customDomain}` : ''}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${d.id}:`, e.message);
    }
  }
  console.log(`\nDone. Published ${ok}, without slug ${noSlug}, failed ${failed}.`);
  process.exit(failed ? 1 : 0);
})();

/**
 * Junior Campus (Nursery Bloom): records which school older items belong to.
 *
 *   junior_stickers  -> schoolId from the pupil (userId)    (so the teacher dashboard shows your school's stickers)
 *   junior_stories   -> schoolId from the creator (createdBy)
 *   junior_science   -> schoolId from the creator (createdBy)
 *   other activity content with a createdBy -> schoolId from the creator
 *
 * Items with no creator stay shared (no schoolId), exactly as today.
 * Run ONCE after deploying:
 *   cd functions && node backfill-junior-school.js --dry     (counts only, writes nothing)
 *   cd functions && node backfill-junior-school.js
 * Reads each item without a schoolId once, plus one users/staff/students lookup per distinct person.
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
const DRY = process.argv.includes('--dry');

const JOBS = [
  { coll: 'junior_stickers', owner: 'userId' },
  { coll: 'junior_stories', owner: 'createdBy' },
  { coll: 'junior_science', owner: 'createdBy' },
  { coll: 'junior_phonics', owner: 'createdBy' },
  { coll: 'junior_phonics_sounds', owner: 'createdBy' },
  { coll: 'junior_phonics_rhymes', owner: 'createdBy' },
  { coll: 'junior_abc_words', owner: 'createdBy' },
  { coll: 'junior_sorter_items', owner: 'createdBy' },
  { coll: 'junior_science_materials', owner: 'createdBy' },
  { coll: 'junior_art_quests', owner: 'createdBy' },
];

const schoolOf = new Map();
async function lookupSchool(uid) {
  if (schoolOf.has(uid)) return schoolOf.get(uid);
  let sid = null;
  for (const c of ['users', 'staff', 'students', 'parents']) {
    const d = await db.collection(c).doc(uid).get();
    if (d.exists && d.data().schoolId) { sid = d.data().schoolId; break; }
  }
  if (!sid) {
    // Pupils whose document id is not their login id
    const q = await db.collection('students').where('uid', '==', uid).limit(1).get();
    if (!q.empty && q.docs[0].data().schoolId) sid = q.docs[0].data().schoolId;
  }
  schoolOf.set(uid, sid);
  return sid;
}

(async () => {
  for (const { coll, owner } of JOBS) {
    const snap = await db.collection(coll).get();
    let set = 0, shared = 0, unknown = 0;
    let batch = db.batch(), inBatch = 0;
    for (const d of snap.docs) {
      const data = d.data();
      if (data.schoolId) continue;
      const uid = data[owner];
      if (!uid || typeof uid !== 'string') { shared++; continue; }
      const sid = await lookupSchool(uid);
      if (!sid) { unknown++; continue; }
      set++;
      if (!DRY) {
        batch.update(d.ref, { schoolId: sid });
        if (++inBatch >= 400) { await batch.commit(); batch = db.batch(); inBatch = 0; }
      }
    }
    if (!DRY && inBatch) await batch.commit();
    console.log(`${coll}: ${snap.size} items, ${set} given a school${DRY ? ' (dry run)' : ''}, ${shared} left shared (no creator), ${unknown} creator's school not found`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

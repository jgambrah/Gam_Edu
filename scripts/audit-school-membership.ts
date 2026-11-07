/**
 * audit-school-membership.ts — READ-ONLY. Writes nothing.
 *
 * Before the new Storage rules go live, find people who would be locked out of their school's files because
 * the rules decide membership from Firestore profile documents (users/{uid}.schoolId, staff/{uid}.schoolId,
 * students/{uid}.schoolId, parents/{uid}.schoolId).
 *
 * Reports (as JSON files in ./membership-audit/, no personal data beyond uid, role, school id):
 *   - staff documents with no users/{uid} document, or whose schoolId differs from users/{uid}.schoolId
 *   - staff / users / students / parents documents with an empty schoolId
 *   - users whose schoolId points at a school that does not exist
 *
 * Usage (same env vars as the other scripts):  npx ts-node scripts/audit-school-membership.ts
 */
import * as dotenv from 'dotenv';
import { mkdirSync, writeFileSync } from 'node:fs';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();
if (!getApps().length) {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  initializeApp(clientEmail && privateKey
    ? { credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail, privateKey }) }
    : undefined);
}
const db = getFirestore();

async function main() {
  const [users, staff, students, parents, schools] = await Promise.all(
    ['users', 'staff', 'students', 'parents', 'schools'].map(c => db.collection(c).select('schoolId', 'role').get()),
  );
  const schoolIds = new Set(schools.docs.map(d => d.id));
  const userMap = new Map(users.docs.map(d => [d.id, d.data() as any]));
  const report: Record<string, any[]> = {
    staffWithoutUsersDoc: [], staffSchoolMismatch: [], emptySchoolId: [], unknownSchool: [],
  };

  for (const d of staff.docs) {
    const s: any = d.data(), u = userMap.get(d.id);
    if (!u) report.staffWithoutUsersDoc.push({ uid: d.id, role: s.role, schoolId: s.schoolId });
    else if (u.schoolId && s.schoolId && u.schoolId !== s.schoolId)
      report.staffSchoolMismatch.push({ uid: d.id, staffSchoolId: s.schoolId, usersSchoolId: u.schoolId });
  }
  for (const [name, snap] of [['users', users], ['staff', staff], ['students', students], ['parents', parents]] as const)
    for (const d of snap.docs) {
      const sid = (d.data() as any).schoolId;
      if (!sid) report.emptySchoolId.push({ collection: name, uid: d.id });
      else if (name === 'users' && !schoolIds.has(sid)) report.unknownSchool.push({ uid: d.id, schoolId: sid });
    }

  mkdirSync('membership-audit', { recursive: true });
  for (const [k, v] of Object.entries(report)) {
    writeFileSync(`membership-audit/${k}.json`, JSON.stringify(v, null, 2));
    console.log(`${k.padEnd(24)} ${v.length}`);
  }
  console.log('Read-only run complete. Nothing was changed.');
}
main().catch(e => { console.error(e); process.exit(1); });

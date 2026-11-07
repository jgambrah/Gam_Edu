/**
 * audit-school-membership.ts — READ-ONLY. It never writes to Firestore (only `.get()` calls).
 *
 * Finds accounts that could lose Storage access when the school-scoped rules go live, because the rules decide
 * membership from Firestore profile documents (users/staff/students/parents → schoolId).
 *
 * PRIVACY: it never reads names, emails, phone numbers or any other personal field — only `schoolId` and `role`.
 *   Default output  : COUNTS only (console).
 *   --report        : also writes membership-audit/findings.json with each uid replaced by a short one-way hash
 *                     (sha256 + a random salt that is printed once and not stored), so the report can be shared safely.
 *   --show-ids      : writes the real uids instead of hashes, for the person who will fix the accounts. Keep that file private.
 *
 * Usage:  npx ts-node scripts/audit-school-membership.ts [--report] [--show-ids]
 * To run it against the Firebase emulator instead of production, set FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 first.
 */
import * as dotenv from 'dotenv';
import { createHash, randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { classifyMembership, type Profile } from '../src/lib/membership-audit';

dotenv.config();
if (!getApps().length) {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  initializeApp(clientEmail && privateKey
    ? { credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail, privateKey }) }
    : { projectId: process.env.FIREBASE_PROJECT_ID || 'demo-gam-edu' });
}
const db = getFirestore();
const args = new Set(process.argv.slice(2));

async function load(c: string): Promise<Map<string, Profile>> {
  const snap = await db.collection(c).select('schoolId', 'role').get(); // field mask: nothing else is read
  return new Map(snap.docs.map(d => [d.id, d.data() as Profile]));
}

async function main() {
  const [users, staff, students, parents] = await Promise.all(['users', 'staff', 'students', 'parents'].map(load));
  const schoolIds = new Set((await db.collection('schools').select().get()).docs.map(d => d.id));
  const findings = classifyMembership({ users, staff, students, parents, schoolIds });

  const counts: Record<string, number> = {};
  for (const f of findings) counts[`${f.kind} (${f.collection})`] = (counts[`${f.kind} (${f.collection})`] ?? 0) + 1;
  console.log(`Scanned: users ${users.size}, staff ${staff.size}, students ${students.size}, parents ${parents.size}, schools ${schoolIds.size}`);
  console.log(Object.keys(counts).length ? counts : 'No findings.');

  if (args.has('--report') || args.has('--show-ids')) {
    const salt = randomBytes(8).toString('hex');
    const id = (uid: string) => args.has('--show-ids') ? uid : createHash('sha256').update(salt + uid).digest('hex').slice(0, 10);
    mkdirSync('membership-audit', { recursive: true });
    writeFileSync('membership-audit/findings.json', JSON.stringify(findings.map(f => ({ ...f, uid: id(f.uid) })), null, 2));
    console.log(`Wrote membership-audit/findings.json (${args.has('--show-ids') ? 'REAL uids — keep private' : 'hashed ids'}).`);
  }
  console.log('Read-only run complete. Nothing was changed.');
}
main().catch(e => { console.error(e); process.exit(1); });

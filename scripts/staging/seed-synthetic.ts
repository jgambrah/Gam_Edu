/**
 * Seeds SYNTHETIC data (fake schools, staff, pupils, parents — no real people, no real money) into a STAGING project
 * or the emulator, so every Storage/Firestore workflow can be exercised against the proposed rules.
 *
 * REFUSES to run against production or any project whose id does not start with "gamedu-staging".
 *
 *   FIREBASE_PROJECT_ID=gamedu-staging-xyz  (+ service-account env vars)  npx tsx scripts/staging/seed-synthetic.ts
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_PROJECT_ID=demo-gam-edu npx tsx scripts/staging/seed-synthetic.ts
 *
 * Auth accounts are NOT created here (Admin SDK `createUser` would need your staging credentials); create the logins
 * listed in docs/STAGING-RUNBOOK.md in the staging console, then run with --link-auth to attach their uids.
 */
import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { checkStagingTarget } from '../../src/lib/staging-guard';

dotenv.config();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!getApps().length) {
  initializeApp(clientEmail && privateKey
    ? { credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail, privateKey }) }
    : { projectId: process.env.FIREBASE_PROJECT_ID || 'demo-gam-edu' });
}
const projectId = getApps()[0].options.projectId || process.env.FIREBASE_PROJECT_ID;
const problem = checkStagingTarget(projectId, { emulator: !!process.env.FIRESTORE_EMULATOR_HOST });
if (problem) { console.error(problem); process.exit(2); }

const SCHOOLS = { stagingA: 'Synthetic School A', stagingB: 'Synthetic School B' };
// login e-mail (create these in the staging console) → profile
const PEOPLE: Array<{ email: string; role: string; school: 'stagingA' | 'stagingB'; kind: 'staff' | 'student' | 'parent' }> = [
  { email: 'director.a@staging.example', role: 'Director', school: 'stagingA', kind: 'staff' },
  { email: 'registrar.a@staging.example', role: 'Registrar', school: 'stagingA', kind: 'staff' },
  { email: 'teacher.a@staging.example', role: 'Teacher', school: 'stagingA', kind: 'staff' },
  { email: 'accountant.a@staging.example', role: 'Accountant', school: 'stagingA', kind: 'staff' },
  { email: 'pupil.a@staging.example', role: 'Student', school: 'stagingA', kind: 'student' },
  { email: 'parent.a@staging.example', role: 'Parent', school: 'stagingA', kind: 'parent' },
  { email: 'director.b@staging.example', role: 'Director', school: 'stagingB', kind: 'staff' },
  { email: 'teacher.b@staging.example', role: 'Teacher', school: 'stagingB', kind: 'staff' },
  { email: 'pupil.b@staging.example', role: 'Student', school: 'stagingB', kind: 'student' },
  { email: 'parent.b@staging.example', role: 'Parent', school: 'stagingB', kind: 'parent' },
];

async function main() {
  const db = getFirestore();
  const auth = getAuth();
  for (const [id, name] of Object.entries(SCHOOLS)) await db.collection('schools').doc(id).set({ name, aiCredits: 100, synthetic: true }, { merge: true });
  let linked = 0, skipped = 0;
  for (const p of PEOPLE) {
    let uid: string | null = null;
    try { uid = (await auth.getUserByEmail(p.email)).uid; } catch { /* login not created yet */ }
    if (!uid) { skipped++; continue; }
    await db.collection('users').doc(uid).set({ role: p.role, schoolId: p.school, synthetic: true }, { merge: true });
    if (p.kind === 'staff') await db.collection('staff').doc(uid).set({ uid, role: p.role, schoolId: p.school, firstName: p.role, lastName: p.school, synthetic: true }, { merge: true });
    if (p.kind === 'student') await db.collection('students').doc(uid).set({ uid, schoolId: p.school, firstName: 'Pupil', lastName: p.school, synthetic: true }, { merge: true });
    if (p.kind === 'parent') await db.collection('parents').doc(uid).set({ uid, schoolId: p.school, studentIds: [], synthetic: true }, { merge: true });
    linked++;
  }
  console.log(`Project ${projectId}: 2 synthetic schools written; ${linked} people linked, ${skipped} skipped (create their logins first).`);
}
main().catch(e => { console.error(e); process.exit(1); });

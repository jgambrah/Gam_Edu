/**
 * Parents' credit (over-paid bills) and canteen collections — review and repair.
 *
 * Why: before automatic allocation existed, money paid in advance (often canteen money) stayed as an
 * over-payment on ONE bill, while the daily canteen bills it was meant for stayed unpaid. That shows as a
 * large "Advance Credits" figure AND low canteen collection at the same time.
 *
 * Run from the project root (the folder with package.json):
 *   npx tsx scripts/reconcile-credits.ts                    REPORT ONLY — nothing is written
 *   npx tsx scripts/reconcile-credits.ts --school <id>      one school
 *   npx tsx scripts/reconcile-credits.ts --apply            move each student's credit onto their own unpaid bills
 *
 * --apply uses exactly the same allocation as the app (same fee type first, then oldest bill; receipts are
 * split, never duplicated, so cash totals do not change). Credit with no unpaid bill to cover stays as the
 * student's credit and is used automatically on their next bills. Suspected DUPLICATE payments are only
 * listed — check them by hand. Afterwards run: cd functions && node rebuild-dashboard-summaries.js
 */
import * as dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { applyHeldCreditAfterBillingServer } from '../src/lib/credit-allocation-server';

dotenv.config({ path: '.env' });
const APPLY = process.argv.includes('--apply');
const schoolArg = process.argv.includes('--school') ? process.argv[process.argv.indexOf('--school') + 1] : null;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '');
if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in .env');
  process.exit(1);
}
initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

const round2 = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) => `GH₵${round2(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const bal = (r: any) => round2((Number(r.billedAmount) || 0) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0));
const usable = (r: any) => r && r.isArchived !== true && r.status !== 'Pending Reversal' && r.status !== 'Void' && r.type !== 'Correction / Reversal';
const fee = (r: any) => {
  const t = String(r.type || '').toLowerCase();
  return t.includes('tuition') ? 'Tuition' : t.includes('canteen') ? 'Canteen' : t.includes('transport') ? 'Transport' : t.includes('pta') ? 'PTA' : 'Other';
};
const ms = (v: any) => (v?.toMillis ? v.toMillis() : v?._seconds ? v._seconds * 1000 : v ? new Date(v).getTime() || 0 : 0);
const day = (v: any) => { const m = ms(v); return m ? new Date(m).toISOString().slice(0, 10) : ''; };

async function run(schoolId: string) {
  const [studentsSnap, recSnap, settingsSnap] = await Promise.all([
    db.collection('students').where('schoolId', '==', schoolId).get(),
    db.collection('financialRecords').where('schoolId', '==', schoolId).get(),
    db.collection('schoolSettings').doc(schoolId).get(),
  ]);
  const name = settingsSnap.data()?.name || settingsSnap.data()?.schoolName || schoolId;
  const students = studentsSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  const keyToStudent = new Map<string, any>();
  students.forEach(s => [s.id, s.uid, s.studentId, s.admissionNo, s.admissionNumber].filter(Boolean).forEach((k: string) => keyToStudent.set(String(k), s)));

  const perStudent = new Map<string, { s: any; credit: number; debt: number; creditBy: Record<string, number>; debtBy: Record<string, number> }>();
  const creditSitsOn: Record<string, number> = {};
  const canteen = { billed: 0, paid: 0, waived: 0, notUsingCanteen: 0, notUsingCanteenAmt: 0 };
  let unmatchedCredit = 0;

  recSnap.docs.forEach(d => {
    const r: any = d.data();
    if (!usable(r)) return;
    const b = bal(r);
    const f = fee(r);
    const s = keyToStudent.get(String(r.studentId || ''));
    if (f === 'Canteen') {
      canteen.billed += Number(r.billedAmount) || 0;
      canteen.paid += Number(r.amountPaid) || 0;
      canteen.waived += Number(r.waiverAmount) || 0;
      if (s && s.usesCanteen === false && b > 0.009) { canteen.notUsingCanteen++; canteen.notUsingCanteenAmt += b; }
    }
    if (!s) { if (b < -0.009) unmatchedCredit += -b; return; }
    const e = perStudent.get(s.id) || { s, credit: 0, debt: 0, creditBy: {}, debtBy: {} };
    if (b < -0.009) { e.credit += -b; e.creditBy[f] = (e.creditBy[f] || 0) - b; creditSitsOn[f] = (creditSitsOn[f] || 0) - b; }
    else if (b > 0.009) { e.debt += b; e.debtBy[f] = (e.debtBy[f] || 0) + b; }
    perStudent.set(s.id, e);
  });

  const withCredit = [...perStudent.values()].filter(e => e.credit > 0.009);
  const totalCredit = withCredit.reduce((t, e) => t + e.credit, 0);
  const applicable = withCredit.reduce((t, e) => t + Math.min(e.credit, e.debt), 0);

  console.log(`\n══ ${name} [${schoolId}] ══`);
  console.log(`Parents' credit on over-paid bills: ${money(totalCredit)} across ${withCredit.length} students`);
  console.log(`  can be applied to the same students' unpaid bills: ${money(applicable)}`);
  console.log(`  genuine prepayment left after that (no unpaid bill to cover): ${money(totalCredit - applicable)}`);
  if (unmatchedCredit > 0.009) console.log(`  credit on bills of students no longer on the roll: ${money(unmatchedCredit)}`);
  console.log(`  credit currently sits on: ${Object.entries(creditSitsOn).map(([k, v]) => `${k} ${money(v)}`).join(', ') || '—'}`);
  const cNet = canteen.billed - canteen.waived;
  console.log(`Canteen: billed ${money(canteen.billed)}, paid on canteen bills ${money(canteen.paid)} (${cNet > 0 ? ((canteen.paid / cNet) * 100).toFixed(1) : '0'}%)`);
  if (canteen.notUsingCanteen) console.log(`  ⚠ ${canteen.notUsingCanteen} unpaid canteen bills (${money(canteen.notUsingCanteenAmt)}) belong to students marked "does not use canteen" — check them`);

  console.log('Top 10 credits:');
  withCredit.sort((a, b) => b.credit - a.credit).slice(0, 10).forEach(e => {
    const nm = `${e.s.firstName || ''} ${e.s.lastName || ''}`.trim() || e.s.id;
    console.log(`  ${nm.padEnd(28)} credit ${money(e.credit).padStart(12)} (${Object.entries(e.creditBy).map(([k, v]) => `${k} ${money(v)}`).join(', ')})  unpaid ${money(e.debt)}`);
  });

  // Suspected duplicate receipts: same student, same amount, same day, same method, different receipt.
  const paySnap = await db.collectionGroup('payments').where('schoolId', '==', schoolId).get();
  const seen = new Map<string, string[]>();
  paySnap.docs.forEach(p => {
    const x: any = p.data();
    if (x.isAllocation || x.isCarryForward || x.status === 'Reversed' || x.isReversal) return;
    const amt = Number(x.originalAmount ?? x.amount) || 0;
    if (amt <= 0) return;
    const k = `${x.studentId}|${amt}|${day(x.paidAt)}|${x.method || ''}`;
    const list = seen.get(k) || [];
    list.push(`${p.ref.parent.parent?.id}/${p.id}`);
    seen.set(k, list);
  });
  const dups = [...seen.entries()].filter(([, v]) => v.length > 1);
  console.log(`Suspected duplicate payments (same student, amount, day and method): ${dups.length}`);
  dups.slice(0, 15).forEach(([k, v]) => {
    const [sid, amt, d, m] = k.split('|');
    const s = keyToStudent.get(sid);
    const nm = s ? `${s.firstName || ''} ${s.lastName || ''}`.trim() : sid;
    console.log(`  ${nm.padEnd(28)} ${money(Number(amt)).padStart(12)} on ${d} by ${m || '?'} × ${v.length}   ${v.join('  ')}`);
  });
  if (dups.length > 15) console.log(`  … and ${dups.length - 15} more`);

  if (!APPLY) return;
  let moved = 0;
  for (const e of withCredit) {
    if (e.debt <= 0.009) {
      // Nothing to cover now: just make sure the credit is used automatically on the next bills.
      await db.collection('students').doc(e.s.id).update({ hasAccountCredit: true, accountCreditBalance: round2(e.credit) }).catch(() => undefined);
      continue;
    }
    moved += await applyHeldCreditAfterBillingServer(db, schoolId, { ...e.s, hasAccountCredit: true });
  }
  console.log(`Applied ${money(moved)} of credit to unpaid bills.`);
}

(async () => {
  const ids = schoolArg ? [schoolArg] : (await db.collection('schoolSettings').get()).docs.map(d => d.id);
  console.log(APPLY ? 'APPLYING credit to unpaid bills…' : 'REPORT ONLY (add --apply to move credit onto unpaid bills)');
  for (const id of ids) {
    try { await run(id); } catch (e: any) { console.error(`School ${id} failed:`, e.message); }
  }
  console.log(APPLY ? '\nDone. Now run: cd functions && node rebuild-dashboard-summaries.js' : '\nNothing was written.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

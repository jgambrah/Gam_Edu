/**
 * One-off: give every EXISTING Premium school a paid-up date (paidUntil), worked out from its real payment.
 *
 * Before this fix, any payment made a school Premium for ever. Now a school is reminded 7 days before its
 * paid period ends and locked 7 days after it ends. This script sets the date for schools upgraded before
 * the fix, so:
 *   • schools still inside their paid period keep working until it ends (nothing changes for them now);
 *   • schools whose period ended in the last 7 days get the normal 7-day grace from that date;
 *   • schools whose period ended longer ago are locked as soon as this is applied.
 *
 * How the period is found, per school:
 *   1. its last Paystack payment (paymentReference) is looked up at Paystack: amount + payment date
 *      → GHS 3,000 = 1 year, GHS 300 = 1 month (31 days) per GHS 300, same as the live webhook;
 *   2. no reference but a lastPaymentDate → assumed ONE month from that date (shown as "assumed");
 *   3. no payment record at all (made Premium by hand) → NOT changed; listed so you can set the date in
 *      Super Admin → Change Plan → "Paid up to".
 *
 * Run from the `functions` folder (uses ../.env: FIREBASE_* and PAYSTACK_SECRET_KEY):
 *   node set-subscription-periods.js                      REPORT ONLY — nothing is written
 *   node set-subscription-periods.js --apply              write the dates
 *   node set-subscription-periods.js --school <id>        one school (combine with --apply)
 *   node set-subscription-periods.js --notice-days 3      overdue schools get 3 more days (from today)
 *                                                         before the lock, instead of being locked at once
 */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '') : undefined;
const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in ../.env');
  process.exit(1);
}
if (!paystackSecret) console.warn('PAYSTACK_SECRET_KEY not found in ../.env — payments cannot be looked up; dates will be assumed (1 month).\n');
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
const db = admin.firestore();

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const schoolArg = args.includes('--school') ? args[args.indexOf('--school') + 1] : null;
const noticeDays = args.includes('--notice-days') ? Math.max(0, Number(args[args.indexOf('--notice-days') + 1]) || 0) : 0;

const DAY = 24 * 60 * 60 * 1000;
const GRACE_DAYS = 7; // must match src/app/dashboard/layout.tsx
const MONTHLY = 300, ANNUAL = 3000; // must match src/app/api/webhooks/paystack/route.ts
const daysFor = (paid) => paid >= ANNUAL
  ? 365 * Math.floor(paid / ANNUAL) + 31 * Math.floor((paid % ANNUAL) / MONTHLY)
  : 31 * Math.floor(paid / MONTHLY);
const toDate = (v) => (v && typeof v.toDate === 'function') ? v.toDate() : (v ? new Date(v) : null);
const fmt = (d) => d ? d.toISOString().slice(0, 10) : '—';

async function lookupPaystack(reference) {
  if (!paystackSecret || !reference) return null;
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });
    const body = await res.json();
    const tx = body && body.data;
    if (!res.ok || !body.status || !tx || tx.status !== 'success') return null;
    return { amount: Number(tx.amount || 0) / 100, paidAt: new Date(tx.paid_at || tx.paidAt || tx.created_at), currency: String(tx.currency || 'GHS') };
  } catch (e) {
    return null;
  }
}

(async () => {
  let snap;
  if (schoolArg) {
    const d = await db.collection('schools').doc(schoolArg).get();
    snap = { docs: d.exists ? [d] : [] };
  } else {
    snap = await db.collection('schools').where('plan', '==', 'Premium').get();
  }

  const now = Date.now();
  const rows = [];
  for (const d of snap.docs) {
    const s = d.data();
    if (s.plan !== 'Premium') continue;
    if (s.paidUntil) { rows.push({ id: d.id, name: s.name, note: `already has paid-up date ${fmt(toDate(s.paidUntil))} — unchanged` }); continue; }

    let basis = null, paidUntil = null, amount = null, paidAt = null;
    const ps = await lookupPaystack(s.paymentReference);
    if (ps && ps.currency.toUpperCase() === 'GHS' && ps.amount > 0) {
      amount = ps.amount; paidAt = ps.paidAt;
      const days = daysFor(ps.amount);
      if (days > 0) { paidUntil = new Date(paidAt.getTime() + days * DAY); basis = `Paystack GHS ${amount} on ${fmt(paidAt)} → ${days} days`; }
      else { paidUntil = paidAt; basis = `Paystack GHS ${amount} on ${fmt(paidAt)} — less than one month's fee, so no paid period`; }
    } else if (s.lastPaymentDate) {
      paidAt = toDate(s.lastPaymentDate);
      paidUntil = new Date(paidAt.getTime() + 31 * DAY);
      basis = `ASSUMED 1 month from last payment ${fmt(paidAt)}${s.paymentReference ? ' (Paystack lookup failed)' : ''}`;
    } else {
      rows.push({ id: d.id, name: s.name, note: 'NO PAYMENT RECORD (made Premium by hand) — not changed; set "Paid up to" in Super Admin' });
      continue;
    }

    // Overdue schools: optional notice period from today instead of an immediate lock.
    let finalUntil = paidUntil;
    const lockAt = paidUntil.getTime() + GRACE_DAYS * DAY;
    if (lockAt < now && noticeDays > 0) finalUntil = new Date(now + noticeDays * DAY - GRACE_DAYS * DAY);
    const finalLock = finalUntil.getTime() + GRACE_DAYS * DAY;
    const state = finalUntil.getTime() >= now
      ? `ACTIVE until ${fmt(finalUntil)}`
      : finalLock >= now ? `ENDED ${fmt(paidUntil)} — reminder now, LOCKS on ${fmt(new Date(finalLock))}` : `ENDED ${fmt(paidUntil)} — LOCKED when applied`;

    rows.push({ id: d.id, name: s.name, basis, state, paidUntil: finalUntil, amount });
  }

  console.log(`${APPLY ? 'APPLYING' : 'REPORT ONLY (add --apply to write)'} — ${rows.length} Premium school(s)\n`);
  for (const r of rows) {
    console.log(`• ${r.name || r.id} (${r.id})`);
    if (r.note) { console.log(`    ${r.note}`); continue; }
    console.log(`    ${r.basis}`);
    console.log(`    → ${r.state}`);
  }

  if (APPLY) {
    let n = 0;
    for (const r of rows) {
      if (!r.paidUntil) continue;
      await db.collection('schools').doc(r.id).update({ paidUntil: r.paidUntil, paidUntilSetBy: 'set-subscription-periods', ...(r.amount ? { lastPaymentAmount: r.amount } : {}) });
      n++;
    }
    console.log(`\nWritten: ${n} school(s).`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

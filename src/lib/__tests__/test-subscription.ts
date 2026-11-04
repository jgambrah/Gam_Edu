import { ANNUAL_FEE, MONTHLY_FEE, daysForPayment, daysUntil, effectivePaidUntil, paymentCoversUntil } from '../subscription';

/** Run with: npx tsx --tsconfig tsconfig.json src/lib/__tests__/test-subscription.ts */
let failures = 0;
const check = (label: string, ok: boolean, detail = '') => { if (ok) console.log(`  ok   ${label}`); else { failures++; console.error(`  FAIL ${label} ${detail}`); } };
const DAY = 86400000;
const d = (iso: string) => new Date(iso);
const ts = (iso: string) => ({ toDate: () => new Date(iso) });

console.log('=== days bought by a payment (must match the live webhook) ===');
check('fees are 300 / 3000', MONTHLY_FEE === 300 && ANNUAL_FEE === 3000);
check('GHS 3,000 = 365 days', daysForPayment(3000) === 365);
check('GHS 300 = 31 days', daysForPayment(300) === 31);
check('GHS 600 = 62 days', daysForPayment(600) === 62);
check('GHS 3,300 = 1 year + 1 month', daysForPayment(3300) === 396);
check('GHS 6,000 = 2 years', daysForPayment(6000) === 730);
check('below one month buys nothing', daysForPayment(299) === 0 && daysForPayment(0) === 0 && daysForPayment(NaN) === 0);

console.log('=== Mercy Springfield: paid 3,000 on 6 Oct 2026, stored as a 1-month period ===');
const mercy = { plan: 'Premium', lastPaymentAmount: 3000, lastPaymentDate: ts('2026-10-06T10:00:00Z'), paidUntil: ts('2026-11-06T10:00:00Z') };
const now = d('2026-11-04T12:00:00Z').getTime();
check('stored date alone would say 2 days left', daysUntil(mercy.paidUntil.toDate(), now) === 2);
const eff = effectivePaidUntil(mercy)!;
check('effective date is one year after payment (6 Oct 2027)', eff.toISOString().slice(0, 10) === '2027-10-06', eff.toISOString());
check('so the school sees ~336 days left, not 2', daysUntil(eff, now) > 300);

console.log('=== the safety net never shortens or overrides correct data ===');
const correct = { plan: 'Premium', lastPaymentAmount: 3000, lastPaymentDate: ts('2026-10-06T10:00:00Z'), paidUntil: ts('2027-10-06T10:00:00Z') };
check('correct yearly record is unchanged', effectivePaidUntil(correct)!.toISOString() === '2027-10-06T10:00:00.000Z');
const stacked = { plan: 'Premium', lastPaymentAmount: 300, lastPaymentDate: ts('2026-10-06T10:00:00Z'), paidUntil: ts('2027-03-01T00:00:00Z') };
check('renewals that stacked past the last payment keep the later stored date', effectivePaidUntil(stacked)!.toISOString() === '2027-03-01T00:00:00.000Z');
check('monthly payer who is genuinely ending soon is NOT extended', (() => {
  const m = { plan: 'Premium', lastPaymentAmount: 300, lastPaymentDate: ts('2026-10-06T10:00:00Z'), paidUntil: ts('2026-11-06T10:00:00Z') };
  return effectivePaidUntil(m)!.toISOString() === '2026-11-06T10:00:00.000Z';
})());
check('date set by hand in Super Admin (paidUntilManual) is respected, even if shorter', (() => {
  const m = { ...mercy, paidUntilManual: true };
  return effectivePaidUntil(m)!.toISOString() === '2026-11-06T10:00:00.000Z';
})());
check('no paid-up date → null (untracked schools behave as before)', effectivePaidUntil({ plan: 'Premium', lastPaymentAmount: 3000, lastPaymentDate: ts('2026-10-06T10:00:00Z') }) === null && effectivePaidUntil({}) === null && effectivePaidUntil(null) === null);
check('no recorded payment → stored date used', effectivePaidUntil({ paidUntil: ts('2026-12-01T00:00:00Z') })!.toISOString() === '2026-12-01T00:00:00.000Z');
check('paymentCoversUntil needs both date and amount', paymentCoversUntil({ lastPaymentAmount: 3000 }) === null && paymentCoversUntil({ lastPaymentDate: ts('2026-10-06T00:00:00Z') }) === null);
check('plain Date / ISO strings are accepted too', effectivePaidUntil({ paidUntil: '2026-12-01T00:00:00Z' })!.getTime() === d('2026-12-01T00:00:00Z').getTime());

if (failures) { console.error(`\n${failures} FAILED`); process.exit(1); }
console.log('\nAll checks passed.');

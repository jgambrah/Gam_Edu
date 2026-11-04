import { mayHaveOtherParts, mergeReceiptParts, partsTotal, receiptKeyOf } from '../receipt-parts';

/** Run with: npx tsx --tsconfig tsconfig.json src/lib/__tests__/test-receipt-parts.ts */
let failures = 0;
const check = (label: string, ok: boolean, detail = '') => { if (ok) console.log(`  ok   ${label}`); else { failures++; console.error(`  FAIL ${label} ${detail}`); } };

// Scenario from the school: GH₵800 paid = 500 (this term) + 300 (last term's arrears).
check('receipt key prefers receiptNo', receiptKeyOf({ receiptNo: 'R-9', id: 'R-9-ALLOC-abc123' }) === 'R-9');
check('receipt key falls back to id', receiptKeyOf({ id: 'R-9' }) === 'R-9' && receiptKeyOf(null) === '');

check('cash split: source payment (receiptTotal 800 > amount 500) looks for other parts', mayHaveOtherParts({ id: 'R-9', amount: 500, receiptTotal: 800 }));
check('allocated part looks for other parts', mayHaveOtherParts({ id: 'R-9', amount: 300, isAllocation: true, receiptTotal: 800 }));
check('online split source (allocatedOut) looks for other parts', mayHaveOtherParts({ id: 'ONLINE-AB12CD34', amount: 500, allocatedOut: 300, originalAmount: 800 }));
check('ordinary single-bill payment does NOT trigger extra reads', !mayHaveOtherParts({ id: 'R-5', amount: 400, receiptTotal: 400 }) && !mayHaveOtherParts({ id: 'R-5', amount: 400 }));
check('consolidated / legacy pseudo-receipts do not trigger reads', !mayHaveOtherParts({ id: 'consolidated-x', amount: 1, isAllocation: true }) && !mayHaveOtherParts({ id: 'legacy-x', amount: 1, isAllocation: true }));

const parts = mergeReceiptParts([
  { recordId: 'b1', paymentDocId: 'R-9', description: 'Term 2 Tuition', feeType: 'Tuition Fee', amount: 500 },
  { recordId: 'b1', paymentDocId: 'R-9', description: 'Term 2 Tuition', feeType: 'Tuition Fee', amount: 500 }, // matched by both lookups
  { recordId: 'b2', paymentDocId: 'R-9', description: 'Arrears Brought Forward', feeType: 'Other', amount: 300 },
  { recordId: 'b3', paymentDocId: 'R-9-REV', description: 'zero', feeType: 'Other', amount: 0 },
]);
check('duplicates and zero parts are dropped', parts.length === 2, JSON.stringify(parts));
check('parts add up to the 800 actually paid', partsTotal(parts) === 800);
check('floating point is tidy', partsTotal(mergeReceiptParts([
  { recordId: 'a', paymentDocId: '1', description: '', feeType: '', amount: 0.1 },
  { recordId: 'b', paymentDocId: '1', description: '', feeType: '', amount: 0.2 },
])) === 0.3);

if (failures) { console.error(`\n${failures} FAILED`); process.exit(1); }
console.log('\nAll checks passed.');

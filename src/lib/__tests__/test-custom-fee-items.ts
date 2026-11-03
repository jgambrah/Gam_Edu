import {
  BUILT_IN_FEE_TYPES,
  customFeeBillFields,
  explicitFeeCategory,
  normalizeFeeName,
  parseCustomFeeItems,
  validateCustomFeeName,
} from '../custom-fee-items';
import { feeCategoryOf } from '../finance-summary';
import { classifyFeeCategory } from '../financial-analytics';

/**
 * CUSTOM FEE ITEMS TEST — run with:  npx tsx src/lib/__tests__/test-custom-fee-items.ts
 * Proves (1) names are validated safely, (2) a custom item maps to the fee family the school chose,
 * and (3) bills WITHOUT a custom mapping are classified exactly as they were before this feature.
 */
let failures = 0;
const check = (label: string, ok: boolean, detail = '') => {
  if (ok) console.log(`  ok   ${label}`);
  else { failures++; console.error(`  FAIL ${label} ${detail}`); }
};

console.log('=== validateCustomFeeName ===');
const existing = [{ name: 'Graduation Gown' }];
check('accepts a normal new name', validateCustomFeeName('Excursion', existing) === null);
check('accepts digits / punctuation like "Club Dues (JHS 3)"', validateCustomFeeName('Club Dues (JHS 3)', existing) === null);
check('rejects empty', validateCustomFeeName('   ', existing) !== null);
check('rejects 1 character', validateCustomFeeName('A', existing) !== null);
check('rejects > 60 characters', validateCustomFeeName('x'.repeat(61), existing) !== null);
check('rejects punctuation-only', validateCustomFeeName('!!!', existing) !== null);
check('rejects angle brackets / slashes', validateCustomFeeName('Gown <b>', existing) !== null && validateCustomFeeName('A/B Fee', existing) !== null);
check('rejects every built-in name (case-insensitive)', BUILT_IN_FEE_TYPES.every(t => validateCustomFeeName(t, []) !== null) && validateCustomFeeName('tuition fee', []) !== null);
check('rejects duplicate custom name ignoring case & spaces', validateCustomFeeName('  graduation   GOWN ', existing) !== null);
check('rejects (Daily)/(Termly) suffix — would merge with canteen/transport grouping', validateCustomFeeName('Snack (Daily)', []) !== null && validateCustomFeeName('Bus (termly)', []) !== null);
check('rejects names that look like opening-balance / reversal records', validateCustomFeeName('Opening Balance 2025', []) !== null && validateCustomFeeName('Arrears', []) !== null && validateCustomFeeName('Correction late', []) !== null);
check('normalizeFeeName collapses whitespace', normalizeFeeName('  A   B ') === 'A B');

console.log('=== parseCustomFeeItems (tolerates bad stored data) ===');
const parsed = parseCustomFeeItems({ items: [
  { id: 'a', name: 'Zebra Club', category: 'Other' },
  { id: 'b', name: 'Gown', category: 'NotARealCategory' },
  { id: 'c', name: 'gown', category: 'Tuition' },        // duplicate of b (case-insensitive) → dropped
  { name: 'No id' },                                      // no id → dropped
  null,
] });
check('keeps 2 valid items, sorted by name', parsed.length === 2 && parsed[0].name === 'Gown' && parsed[1].name === 'Zebra Club', JSON.stringify(parsed));
check('unknown category falls back to Other', parsed[0].category === 'Other');
check('missing / non-array data → empty list', parseCustomFeeItems(null).length === 0 && parseCustomFeeItems({ items: 'x' }).length === 0);

console.log('=== customFeeBillFields ===');
const items = parseCustomFeeItems({ items: [
  { id: '1', name: 'Graduation Gown Fee', category: 'Other' },
  { id: '2', name: 'Science Camp', category: 'Tuition' },
  { id: '3', name: 'Choir Bus Hire', category: 'Transport' },
] });
check('built-in type adds nothing (bill unchanged)', Object.keys(customFeeBillFields('Tuition Fee', items)).length === 0);
check('unknown type adds nothing', Object.keys(customFeeBillFields('Mystery', items)).length === 0);
const f = customFeeBillFields('science camp', items);
check('custom item stamps feeCategory + lowercase category + isCustomFee', f.feeCategory === 'Tuition' && f.category === 'tuition' && f.isCustomFee === true, JSON.stringify(f));

console.log('=== classification: custom mapping honoured ===');
const gown = { type: 'Graduation Gown Fee', ...customFeeBillFields('Graduation Gown Fee', items) };
check('feeCategoryOf → Other (not misread from the word "Fee")', feeCategoryOf(gown) === 'Other');
const bus = { type: 'Choir Bus Hire', ...customFeeBillFields('Choir Bus Hire', items) };
check('feeCategoryOf → Transport as chosen', feeCategoryOf(bus) === 'Transport');
check('classifyFeeCategory → other for a gown mapped to Other (default would be tuition)', classifyFeeCategory(gown) === 'other');
check('classifyFeeCategory → transport when mapped to Transport', classifyFeeCategory(bus) === 'transport');
check('classifyFeeCategory → tuition when mapped to Tuition', classifyFeeCategory({ type: 'Science Camp', ...customFeeBillFields('Science Camp', items) }) === 'tuition');

console.log('=== classification: EXISTING bills behave exactly as before ===');
check('explicitFeeCategory ignores bills without mapping', explicitFeeCategory({ type: 'Tuition Fee' }) === null && explicitFeeCategory({ feeCategory: 'bogus' }) === null && explicitFeeCategory(null) === null);
const legacy: [any, string, string][] = [
  [{ type: 'Tuition Fee' }, 'Tuition', 'tuition'],
  [{ type: 'Canteen Fee (Daily)' }, 'Canteen', 'canteen'],
  [{ type: 'Transport Fee (Termly)' }, 'Transport', 'transport'],
  [{ type: 'PTA Levy' }, 'PTA Levy', 'tuition'],
  [{ type: 'Other', description: 'Opening Balance (Arrears from previous term)' }, 'Other', 'tuition'],
  [{ type: 'Library Fine' }, 'Other', 'other'],
];
for (const [rec, wantA, wantB] of legacy) {
  check(`legacy ${JSON.stringify(rec.type)} → ${wantA} / ${wantB}`, feeCategoryOf(rec) === wantA && classifyFeeCategory(rec) === wantB, `got ${feeCategoryOf(rec)} / ${classifyFeeCategory(rec)}`);
}

if (failures) { console.error(`\n${failures} check(s) FAILED`); process.exit(1); }
console.log('\nAll checks passed.');

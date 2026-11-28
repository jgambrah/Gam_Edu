// Runs (or reads) `tsc --noEmit` output, categorises the errors, and enforces a ratchet.
// Usage:
//   node scripts/audit/tsc-report.mjs                      # run tsc, print summary
//   node scripts/audit/tsc-report.mjs --input tsc.txt      # read previously captured output
//   node scripts/audit/tsc-report.mjs --ratchet            # exit 1 if the count exceeds docs/tsc-baseline.json
//   node scripts/audit/tsc-report.mjs --json out.json      # write the categorised report
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };

let text;
if (val('--input')) text = fs.readFileSync(val('--input'), 'utf8');
else {
  const r = spawnSync('npx', ['tsc', '--noEmit', '-p', 'tsconfig.json'], { encoding: 'utf8', shell: true, maxBuffer: 1 << 28 });
  text = (r.stdout || '') + (r.stderr || '');
}

const re = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/;
const errors = [];
for (const line of text.split(/\r?\n/)) {
  const m = re.exec(line.replace(/\\/g, '/'));
  if (m) errors.push({ file: m[1].replace(/^.*?(src|scripts|functions)\//, '$1/'), line: Number(m[2]), code: m[4], msg: m[5] });
}

const areaOf = (f) => {
  if (f.startsWith('scripts/')) return 'scripts (one-off tooling, not shipped)';
  if (f.startsWith('functions/')) return 'cloud functions';
  if (/^src\/lib\/data\//.test(f)) return 'src/lib/data (seed/curriculum data typing)';
  if (/narrated-lessons|construction-lab|math-evaluator|sort-classify|student-enrichment|boolean-logic|sql-practice|python|pseudocode/.test(f)) return 'student enrichment';
  if (/^src\/app\/dashboard\/(finance|financials|accounts|payroll|hr|attendance|admin|students|staff|boarding|transport|reports)/.test(f)) return 'CORE school management (finance/HR/attendance/admin)';
  if (f.startsWith('src/app/dashboard/')) return 'dashboard pages (other)';
  if (f.startsWith('src/app/api/')) return 'API routes';
  if (f.startsWith('src/components/')) return 'components';
  if (f.startsWith('src/lib/')) return 'src/lib (other)';
  if (f.startsWith('src/app/')) return 'app (other)';
  return 'other';
};

// Error codes that indicate a possible RUNTIME failure rather than only a typing mismatch.
const RUNTIME_RISK = new Map([
  ['TS2304', 'Cannot find name: ReferenceError at runtime if the line executes'],
  ['TS2552', 'Cannot find name (did you mean): ReferenceError at runtime'],
  ['TS2339', 'Property does not exist: may read undefined'],
  ['TS18048', 'Possibly undefined: may throw'],
  ['TS18047', 'Possibly null: may throw'],
  ['TS2532', 'Object possibly undefined: may throw'],
  ['TS2345', 'Argument type mismatch'],
  ['TS2322', 'Type not assignable'],
]);

const by = (keyFn) => {
  const m = new Map();
  for (const e of errors) { const k = keyFn(e); m.set(k, (m.get(k) || 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const report = {
  total: errors.length,
  byArea: Object.fromEntries(by((e) => areaOf(e.file))),
  byCode: Object.fromEntries(by((e) => e.code).slice(0, 25)),
  topFiles: by((e) => e.file).slice(0, 25).map(([file, count]) => ({ file, count, area: areaOf(file) })),
  possibleRuntimeBugs: errors.filter((e) => e.code === 'TS2304' || e.code === 'TS2552').map((e) => `${e.file}:${e.line} ${e.msg}`),
};

console.log(`TypeScript errors: ${report.total}`);
console.log('\nBy area:'); for (const [k, v] of Object.entries(report.byArea)) console.log(String(v).padStart(5), k);
console.log('\nBy error code (top):'); for (const [k, v] of Object.entries(report.byCode).slice(0, 12)) console.log(String(v).padStart(5), k, RUNTIME_RISK.get(k) ?? '');
console.log(`\nPossible runtime ReferenceErrors (TS2304/TS2552): ${report.possibleRuntimeBugs.length}`);
report.possibleRuntimeBugs.slice(0, 25).forEach((l) => console.log('  ' + l));

if (val('--json')) fs.writeFileSync(val('--json'), JSON.stringify(report, null, 2) + '\n');

if (flag('--ratchet')) {
  const base = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs/tsc-baseline.json'), 'utf8').replace(/^﻿/, ''));
  if (report.total > base.total) {
    console.error(`\nRATCHET FAILED: ${report.total} errors > baseline ${base.total}. Fix the new errors (do not raise the baseline).`);
    process.exit(1);
  }
  // Audit CP3: an undeclared name in SHIPPED code is a ReferenceError at runtime (cause of D-023 supplier delete and D-024
  // practice quiz). Independent of the total, none may exist outside one-off scripts/.
  const shippedUndeclared = report.possibleRuntimeBugs.filter((l) => !l.startsWith('scripts/'));
  if (shippedUndeclared.length > 0) {
    console.error(`\nRATCHET FAILED: ${shippedUndeclared.length} undeclared-name error(s) (TS2304/TS2552) in shipped code:\n  ` + shippedUndeclared.slice(0, 10).join('\n  '));
    process.exit(1);
  }
  const enrichment = report.byArea['student enrichment'] ?? 0;
  if (enrichment > (base.studentEnrichment ?? 0)) {
    console.error(`\nRATCHET FAILED: ${enrichment} student-enrichment errors > baseline ${base.studentEnrichment ?? 0}.`);
    process.exit(1);
  }
  console.log(`\nRatchet OK: ${report.total} <= ${base.total}` + (report.total < base.total ? ' (lower the baseline in docs/tsc-baseline.json!)' : ''));
}

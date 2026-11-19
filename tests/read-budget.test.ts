import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

describe('Firestore Read-Budget Guardrails', () => {
  it('enforces scan & read caps across 245-write Gradebook batches, 700 quiz/trickle writes, term close/unlock, Master List, My Grades, Report Card Manager, and Custom Claims', () => {
    const scriptPath = resolve(__dirname, '../scripts/verify-read-budgets.mjs');
    const output = execFileSync(process.execPath, [scriptPath], { encoding: 'utf8' });
    assert.match(output, /ALL READ-BUDGET ACCEPTANCE TESTS PASSED\./);
  });
});

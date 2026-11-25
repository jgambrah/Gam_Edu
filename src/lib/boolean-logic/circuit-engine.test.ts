import { describe, it, expect } from 'vitest';
import {
  evaluateCircuit,
  generateTruthTable,
  gradeCircuit,
  validateCircuit,
  type LogicCircuitNetlist,
} from './circuit-engine';
import { CH10_BOOLEAN_ACTIVITIES, toNetlist } from '@/lib/narrated-lessons/ch10-boolean-activities';
import { runPseudocode } from '@/lib/pseudocode-runner';
import { executeIgcseSql } from '@/lib/sql-practice/igcse-sql-engine';

describe('Chapter 10 Boolean Logic Circuit Engine & Editors', () => {
  it('validates and rejects cycles, missing inputs, multiple drivers, and invalid arity', () => {
    const cycle: LogicCircuitNetlist = {
      inputs: ['A'],
      gates: [
        { id: 'D', op: 'AND', inputs: ['A', 'E'] },
        { id: 'E', op: 'NOT', inputs: ['D'] },
      ],
      output: 'E',
    };
    expect(validateCircuit(cycle).ok).toBe(false);
    expect(validateCircuit(cycle).errors.some((e) => /Cycle/i.test(e))).toBe(true);

    const badArity: LogicCircuitNetlist = {
      inputs: ['A'],
      gates: [{ id: 'Y', op: 'AND', inputs: ['A'] }],
      output: 'Y',
    };
    expect(validateCircuit(badArity).ok).toBe(false);
    expect(validateCircuit(badArity).errors.some((e) => /Invalid arity/i.test(e))).toBe(true);

    const multiDriver: LogicCircuitNetlist = {
      inputs: ['A', 'B'],
      gates: [
        { id: 'Y', op: 'AND', inputs: ['A', 'B'] },
        { id: 'Y', op: 'OR', inputs: ['A', 'B'] },
      ],
      output: 'Y',
    };
    expect(validateCircuit(multiDriver).ok).toBe(false);
    expect(validateCircuit(multiDriver).errors.some((e) => /Multiple drivers/i.test(e))).toBe(true);

    const missingPin: LogicCircuitNetlist = {
      inputs: ['A'],
      gates: [{ id: 'Y', op: 'AND', inputs: ['A', 'Z'] }],
      output: 'Y',
    };
    expect(validateCircuit(missingPin).ok).toBe(false);
    expect(validateCircuit(missingPin).errors.some((e) => /Missing input/i.test(e))).toBe(true);
  });

  it('grades Functional Equivalence vs Specified-Expression Exam Mode accurately', () => {
    // Target: NOR(A, B)
    const target: LogicCircuitNetlist = {
      inputs: ['A', 'B'],
      gates: [{ id: 'Y', op: 'NOR', inputs: ['A', 'B'] }],
      output: 'Y',
    };

    // Commutative input swap: NOR(B, A) -> passes BOTH modes
    const swapped: LogicCircuitNetlist = {
      inputs: ['A', 'B'],
      gates: [{ id: 'OUT', op: 'NOR', inputs: ['B', 'A'] }],
      output: 'OUT',
    };
    expect(gradeCircuit(swapped, target, 'functional-equivalence').passed).toBe(true);
    expect(gradeCircuit(swapped, target, 'specified-gate-structure').passed).toBe(true);

    // De Morgan equivalent: (NOT A) AND (NOT B) -> passes Functional, fails Specified-Expression Exam Mode
    const deMorgan: LogicCircuitNetlist = {
      inputs: ['A', 'B'],
      gates: [
        { id: 'NA', op: 'NOT', inputs: ['A'] },
        { id: 'NB', op: 'NOT', inputs: ['B'] },
        { id: 'Y', op: 'AND', inputs: ['NA', 'NB'] },
      ],
      output: 'Y',
    };
    expect(gradeCircuit(deMorgan, target, 'functional-equivalence').passed).toBe(true);
    expect(gradeCircuit(deMorgan, target, 'specified-gate-structure').passed).toBe(false);
  });

  it('validates all 23 Chapter 10 Boolean Logic netlists and generates exhaustive truth tables', () => {
    expect(CH10_BOOLEAN_ACTIVITIES).toHaveLength(23);
    let totalRows = 0;
    for (const act of CH10_BOOLEAN_ACTIVITIES) {
      const net = toNetlist(act);
      const val = validateCircuit(net);
      expect(val.ok, `Invalid circuit ${act.id}: ${val.errors.join('; ')}`).toBe(true);
      const tt = generateTruthTable(net);
      expect(tt.ok).toBe(true);
      expect(tt.rows).toHaveLength(1 << act.inputs.length);
      totalRows += tt.rows.length;
      const sampleInputs: Record<string, 0 | 1> = {};
      const stdinParts = act.publicSample.stdin.split('\n');
      act.inputs.forEach((inp, i) => {
        sampleInputs[inp] = stdinParts[i] === '1' ? 1 : 0;
      });
      const ev = evaluateCircuit(net, sampleInputs);
      expect(ev.ok).toBe(true);
      expect(String(ev.output)).toBe(act.publicSample.expectedStdout);
    }
    expect(totalRows).toBe(140);
  });

  it('runs Cambridge 0478 Boolean pseudocode natively with 0/1 inputs', () => {
    const xorCode = `DECLARE A : BOOLEAN
DECLARE B : BOOLEAN
DECLARE Y : BOOLEAN
INPUT A
INPUT B
Y ← (A AND NOT B) OR (NOT A AND B)
IF Y THEN
    OUTPUT 1
ELSE
    OUTPUT 0
ENDIF`;
    expect(runPseudocode(xorCode, '0\n0').output).toEqual(['0']);
    expect(runPseudocode(xorCode, '0\n1').output).toEqual(['1']);
    expect(runPseudocode(xorCode, '1\n0').output).toEqual(['1']);
    expect(runPseudocode(xorCode, '1\n1').output).toEqual(['0']);
  });

  it('executes all 3 Chapter 10 SQL enrichment queries against the isolated Sensors fixture', () => {
    const qAnd = executeIgcseSql('SELECT id FROM Sensors WHERE a = 1 AND b = 1 ORDER BY id;');
    expect(qAnd.ok).toBe(true);
    expect(qAnd.rows).toEqual([[4]]);

    const qOr = executeIgcseSql('SELECT id FROM Sensors WHERE a = 1 OR b = 1 ORDER BY id;');
    expect(qOr.ok).toBe(true);
    expect(qOr.rows).toEqual([[2], [3], [4]]);

    const qNot = executeIgcseSql('SELECT id FROM Sensors WHERE NOT (a = 1) ORDER BY id;');
    expect(qNot.ok).toBe(true);
    expect(qNot.rows).toEqual([[1], [2]]);
  });
});

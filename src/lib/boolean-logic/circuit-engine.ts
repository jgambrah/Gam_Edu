/**
 * Cambridge IGCSE Computer Science (0478 / 2210) Chapter 10: Boolean Logic
 * Pure logic-circuit validation, simulation, truth-table generation, and grading engine.
 */

export type LogicGateOp = 'NOT' | 'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR';

export interface LogicGateNode {
  id: string;
  op: LogicGateOp;
  inputs: string[];
}

export interface LogicCircuitNetlist {
  inputs: string[];
  gates: LogicGateNode[];
  output: string;
}

export interface CircuitValidationResult {
  ok: boolean;
  errors: string[];
  order: string[]; // Topological evaluation order of gate IDs
}

export interface CircuitEvaluationResult {
  ok: boolean;
  values: Record<string, 0 | 1>;
  output?: 0 | 1;
  errors: string[];
}

export interface TruthTableRow {
  values: Record<string, 0 | 1>;
  output: 0 | 1;
}

export type CircuitGradingMode = 'functional-equivalence' | 'specified-gate-structure';

export interface CircuitGradeResult {
  passed: boolean;
  mode: CircuitGradingMode;
  message: string;
  mismatchedRow?: Record<string, 0 | 1>;
  expectedOutput?: 0 | 1;
  actualOutput?: 0 | 1;
}

export const GATE_ARITY: Record<LogicGateOp, number> = {
  NOT: 1,
  AND: 2,
  OR: 2,
  NAND: 2,
  NOR: 2,
  XOR: 2,
};

export const COMMUTATIVE_GATES = new Set<LogicGateOp>(['AND', 'OR', 'NAND', 'NOR', 'XOR']);

export function evalGate(op: LogicGateOp, ins: (0 | 1)[]): 0 | 1 {
  const a = ins[0] ? 1 : 0;
  const b = ins[1] ? 1 : 0;
  switch (op) {
    case 'NOT':
      return a ? 0 : 1;
    case 'AND':
      return a && b ? 1 : 0;
    case 'OR':
      return a || b ? 1 : 0;
    case 'NAND':
      return a && b ? 0 : 1;
    case 'NOR':
      return a || b ? 0 : 1;
    case 'XOR':
      return a !== b ? 1 : 0;
  }
}

export function validateCircuit(netlist: LogicCircuitNetlist): CircuitValidationResult {
  const errors: string[] = [];
  const inputSet = new Set<string>();

  for (const inp of netlist.inputs) {
    if (!inp.trim()) {
      errors.push('Circuit contains an empty input label.');
      continue;
    }
    if (inputSet.has(inp)) {
      errors.push(`Duplicate input signal "${inp}".`);
    }
    inputSet.add(inp);
  }

  const gateMap = new Map<string, LogicGateNode>();
  for (const gate of netlist.gates) {
    if (!gate.id.trim()) {
      errors.push('A gate is missing a signal label.');
      continue;
    }
    if (inputSet.has(gate.id)) {
      errors.push(`Multiple drivers on "${gate.id}": cannot reuse a primary input label as a gate output.`);
      continue;
    }
    if (gateMap.has(gate.id)) {
      errors.push(`Multiple drivers on "${gate.id}": each signal can only be driven by one gate.`);
      continue;
    }
    const expectedArity = GATE_ARITY[gate.op];
    if (!expectedArity) {
      errors.push(`Unsupported gate type "${String(gate.op)}" on "${gate.id}".`);
      continue;
    }
    if (gate.inputs.length !== expectedArity) {
      errors.push(
        `Invalid arity on ${gate.op} gate "${gate.id}": expected ${expectedArity} input(s), got ${gate.inputs.length}.`,
      );
    }
    gateMap.set(gate.id, gate);
  }

  // Check all referenced inputs exist
  for (const gate of netlist.gates) {
    for (let i = 0; i < gate.inputs.length; i++) {
      const src = gate.inputs[i];
      if (!src || (!inputSet.has(src) && !gateMap.has(src))) {
        errors.push(`Missing input connection on ${gate.op} gate "${gate.id}" (pin ${i + 1}: "${src || 'unconnected'}").`);
      }
    }
  }

  if (!netlist.output || (!inputSet.has(netlist.output) && !gateMap.has(netlist.output))) {
    errors.push(`Output signal "${netlist.output || '(none)'}" is not connected to any input or gate.`);
  }

  // Cycle detection & topological sort via DFS
  const visitState = new Map<string, 0 | 1 | 2>(); // 0=unvisited, 1=visiting, 2=done
  const order: string[] = [];
  let hasCycle = false;

  const dfs = (id: string) => {
    if (inputSet.has(id) || !gateMap.has(id)) return;
    const state = visitState.get(id) ?? 0;
    if (state === 1) {
      hasCycle = true;
      return;
    }
    if (state === 2) return;
    visitState.set(id, 1);
    const gate = gateMap.get(id)!;
    for (const src of gate.inputs) {
      dfs(src);
    }
    visitState.set(id, 2);
    order.push(id);
  };

  for (const gate of netlist.gates) {
    if ((visitState.get(gate.id) ?? 0) === 0) {
      dfs(gate.id);
    }
  }

  if (hasCycle) {
    errors.push('Cycle detected: combinational logic circuits cannot contain feedback loops.');
  }

  return { ok: errors.length === 0, errors, order };
}

export function evaluateCircuit(
  netlist: LogicCircuitNetlist,
  inputValues: Record<string, 0 | 1>,
): CircuitEvaluationResult {
  const validation = validateCircuit(netlist);
  if (!validation.ok) {
    return { ok: false, values: {}, errors: validation.errors };
  }

  const gateMap = new Map(netlist.gates.map((g) => [g.id, g]));
  const values: Record<string, 0 | 1> = {};

  for (const inp of netlist.inputs) {
    values[inp] = inputValues[inp] ? 1 : 0;
  }

  for (const gateId of validation.order) {
    const gate = gateMap.get(gateId)!;
    const ins = gate.inputs.map((src) => values[src] ?? 0);
    values[gate.id] = evalGate(gate.op, ins);
  }

  return {
    ok: true,
    values,
    output: values[netlist.output] ?? 0,
    errors: [],
  };
}

export function generateTruthTable(netlist: LogicCircuitNetlist): {
  ok: boolean;
  columns: string[];
  rows: TruthTableRow[];
  errors: string[];
} {
  const validation = validateCircuit(netlist);
  if (!validation.ok) {
    return { ok: false, columns: [], rows: [], errors: validation.errors };
  }

  const n = netlist.inputs.length;
  const totalRows = 1 << n;
  const intermediateIds = validation.order.filter((id) => id !== netlist.output);
  const columns = [...netlist.inputs, ...intermediateIds, netlist.output];
  const rows: TruthTableRow[] = [];

  for (let mask = 0; mask < totalRows; mask++) {
    const inputVals: Record<string, 0 | 1> = {};
    for (let i = 0; i < n; i++) {
      inputVals[netlist.inputs[i]] = (mask >> (n - 1 - i)) & 1 ? 1 : 0;
    }
    const res = evaluateCircuit(netlist, inputVals);
    rows.push({ values: res.values, output: res.output ?? 0 });
  }

  return { ok: true, columns, rows, errors: [] };
}

/**
 * Canonical structural signature from the output node, ignoring internal gate IDs
 * and allowing input-order swaps on commutative gates (AND, OR, NAND, NOR, XOR).
 */
function canonicalStructureSignature(netlist: LogicCircuitNetlist): string {
  const gateMap = new Map(netlist.gates.map((g) => [g.id, g]));
  const build = (signalId: string): string => {
    const gate = gateMap.get(signalId);
    if (!gate) return `IN:${signalId}`;
    const childSigs = gate.inputs.map((src) => build(src));
    if (COMMUTATIVE_GATES.has(gate.op)) {
      childSigs.sort();
    }
    return `${gate.op}(${childSigs.join(',')})`;
  };
  return build(netlist.output);
}

export function gradeCircuit(
  studentNetlist: LogicCircuitNetlist,
  targetNetlist: LogicCircuitNetlist,
  mode: CircuitGradingMode,
): CircuitGradeResult {
  const studentValidation = validateCircuit(studentNetlist);
  if (!studentValidation.ok) {
    return {
      passed: false,
      mode,
      message: studentValidation.errors[0],
    };
  }

  const targetTable = generateTruthTable(targetNetlist);
  if (!targetTable.ok) {
    return { passed: false, mode, message: 'Reference circuit is invalid.' };
  }

  // 1. Exhaustive functional equivalence check across all 2^n rows
  for (const row of targetTable.rows) {
    const inputVals: Record<string, 0 | 1> = {};
    for (const inp of targetNetlist.inputs) {
      inputVals[inp] = row.values[inp];
    }
    const studentEval = evaluateCircuit(studentNetlist, inputVals);
    if (!studentEval.ok || studentEval.output !== row.output) {
      const combo = targetNetlist.inputs.map((inp) => `${inp}=${inputVals[inp]}`).join(', ');
      return {
        passed: false,
        mode,
        message: `Output mismatch for ${combo}: expected ${row.output}, got ${studentEval.output ?? 'error'}.`,
        mismatchedRow: inputVals,
        expectedOutput: row.output,
        actualOutput: studentEval.output,
      };
    }
  }

  if (mode === 'functional-equivalence') {
    return {
      passed: true,
      mode,
      message: `Passed all ${targetTable.rows.length}/${targetTable.rows.length} exhaustive truth-table rows (logically equivalent circuit).`,
    };
  }

  // 2. Specified-expression exam mode: check exact gate structure without simplification
  const studentSig = canonicalStructureSignature(studentNetlist);
  const targetSig = canonicalStructureSignature(targetNetlist);
  if (studentSig !== targetSig) {
    return {
      passed: false,
      mode,
      message:
        'Truth table matches all rows, but Specified-Expression Exam Mode requires the exact specified gate structure without simplification.',
    };
  }

  return {
    passed: true,
    mode,
    message: `Passed all ${targetTable.rows.length}/${targetTable.rows.length} rows and matched the exact specified gate structure!`,
  };
}

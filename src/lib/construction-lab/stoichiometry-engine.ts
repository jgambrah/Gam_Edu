/**
 * GAM EDU — Step 4D Domain 1: Pure TypeScript Chemical Equation Balancer Engine
 *
 * Deterministic atom & electric charge conservation validator for:
 * - Neutral molecular equations (H2 + O2 -> H2O, N2 + H2 <=> NH3)
 * - Parenthesised compounds (Ca(OH)2, Al2(SO4)3, bounded nesting <= 2)
 * - Ionic equations & redox half-equations with explicit structured charge & electrons (e-)
 * - Simplest whole-number ratio verification (GCD = 1)
 * - Authoring-time solvability verification within 1..maxCoefficient
 *
 * Zero React dependencies, zero eval(), zero external libraries.
 */

export const VALID_ELEMENT_SYMBOLS = new Set<string>([
  'H', 'He',
  'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
  'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
  'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
  'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',
  'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
  'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
  'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
]);

export const STOICHIOMETRY_LIMITS = {
  maxSpeciesPerSide: 6,
  maxFormulaLength: 40,
  maxParenDepth: 2,
  maxSubscript: 99,
  minCoefficient: 1,
  maxCoefficientHardCap: 15,
} as const;

export type ChemicalStateSymbol = 's' | 'l' | 'g' | 'aq';

export interface ChemicalSpeciesDef {
  formula: string;
  display?: string;
  charge?: number;
  state?: ChemicalStateSymbol;
  isElectron?: boolean;
}

export interface ParsedFormulaResult {
  ok: boolean;
  atoms: Record<string, number>;
  error?: string;
}

export interface ElementBalanceRow {
  element: string;
  lhs: number;
  rhs: number;
  balanced: boolean;
}

export interface EquationBalanceEvaluation {
  ok: boolean;
  isAtomsBalanced: boolean;
  isChargeBalanced: boolean;
  isBalanced: boolean;
  isSimplestRatio: boolean;
  gcd: number;
  lhsCharge: number;
  rhsCharge: number;
  hasIonicSpecies: boolean;
  elements: ElementBalanceRow[];
  feedback: string;
  error?: string;
}

function gcdTwo(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function gcdList(nums: readonly number[]): number {
  if (nums.length === 0) return 1;
  return nums.reduce((acc, n) => gcdTwo(acc, n), Math.abs(nums[0]));
}

/**
 * Parses a chemical formula (e.g. "Ca(OH)2", "Al2(SO4)3", "H2O") into element atom counts.
 * Rejects unknown element symbols, zero/negative/oversized subscripts, unbalanced parentheses,
 * and excessive nesting (> 2).
 */
export function parseChemicalFormula(formula: string, isElectron = false): ParsedFormulaResult {
  const trimmed = formula.trim();
  if (isElectron || trimmed === 'e-' || trimmed === 'e⁻') {
    return { ok: true, atoms: {} };
  }
  if (!trimmed || trimmed.length > STOICHIOMETRY_LIMITS.maxFormulaLength) {
    return {
      ok: false,
      atoms: {},
      error: `Formula "${formula}" must be 1 to ${STOICHIOMETRY_LIMITS.maxFormulaLength} characters.`,
    };
  }

  const stack: Array<Record<string, number>> = [Object.create(null) as Record<string, number>];
  let i = 0;

  while (i < trimmed.length) {
    const ch = trimmed[i];

    if (ch === '(') {
      if (stack.length - 1 >= STOICHIOMETRY_LIMITS.maxParenDepth) {
        return { ok: false, atoms: {}, error: `Formula "${formula}" exceeds maximum parenthesis nesting depth (${STOICHIOMETRY_LIMITS.maxParenDepth}).` };
      }
      stack.push(Object.create(null) as Record<string, number>);
      i++;
      continue;
    }

    if (ch === ')') {
      if (stack.length <= 1) {
        return { ok: false, atoms: {}, error: `Formula "${formula}" has an unmatched closing parenthesis.` };
      }
      const group = stack.pop()!;
      if (Object.keys(group).length === 0) {
        return { ok: false, atoms: {}, error: `Formula "${formula}" contains empty parentheses.` };
      }
      i++;
      let numStr = '';
      while (i < trimmed.length && trimmed[i] >= '0' && trimmed[i] <= '9') {
        numStr += trimmed[i++];
      }
      const mult = numStr ? Number(numStr) : 1;
      if (!Number.isInteger(mult) || mult < 1 || mult > STOICHIOMETRY_LIMITS.maxSubscript) {
        return { ok: false, atoms: {}, error: `Formula "${formula}" has invalid group subscript "${numStr}".` };
      }
      const top = stack[stack.length - 1];
      for (const [el, count] of Object.entries(group)) {
        top[el] = (top[el] ?? 0) + count * mult;
      }
      continue;
    }

    if (ch >= 'A' && ch <= 'Z') {
      let sym = ch;
      i++;
      while (i < trimmed.length && trimmed[i] >= 'a' && trimmed[i] <= 'z') {
        sym += trimmed[i++];
      }
      if (!VALID_ELEMENT_SYMBOLS.has(sym)) {
        return { ok: false, atoms: {}, error: `Unknown chemical element symbol "${sym}" in "${formula}".` };
      }
      let numStr = '';
      while (i < trimmed.length && trimmed[i] >= '0' && trimmed[i] <= '9') {
        numStr += trimmed[i++];
      }
      const count = numStr ? Number(numStr) : 1;
      if (!Number.isInteger(count) || count < 1 || count > STOICHIOMETRY_LIMITS.maxSubscript) {
        return { ok: false, atoms: {}, error: `Invalid subscript "${numStr}" on "${sym}" in "${formula}".` };
      }
      const top = stack[stack.length - 1];
      top[sym] = (top[sym] ?? 0) + count;
      continue;
    }

    return { ok: false, atoms: {}, error: `Unsupported character "${ch}" in chemical formula "${formula}".` };
  }

  if (stack.length !== 1) {
    return { ok: false, atoms: {}, error: `Formula "${formula}" has an unclosed parenthesis.` };
  }

  const result: Record<string, number> = {};
  for (const [el, count] of Object.entries(stack[0])) {
    result[el] = count;
  }
  if (Object.keys(result).length === 0) {
    return { ok: false, atoms: {}, error: `Formula "${formula}" contains no chemical elements.` };
  }
  return { ok: true, atoms: result };
}

export function getSpeciesCharge(species: ChemicalSpeciesDef): number {
  if (species.isElectron || species.formula.trim() === 'e-' || species.formula.trim() === 'e⁻') {
    return species.charge ?? -1;
  }
  return species.charge ?? 0;
}

export function formatSpeciesDisplay(species: ChemicalSpeciesDef): string {
  if (species.display && species.display.trim()) return species.display.trim();
  if (species.isElectron || species.formula.trim() === 'e-' || species.formula.trim() === 'e⁻') {
    return 'e⁻';
  }
  const subDigits: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  };
  const supDigits: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  };
  let base = species.formula.replace(/[0-9]/g, (d) => subDigits[d] ?? d);
  const charge = getSpeciesCharge(species);
  if (charge !== 0) {
    const absMag = Math.abs(charge);
    const magStr = absMag === 1 ? '' : String(absMag).replace(/[0-9]/g, (d) => supDigits[d] ?? d);
    base += `${magStr}${charge > 0 ? '⁺' : '⁻'}`;
  }
  return base;
}

/**
 * Evaluates atom and charge conservation for a candidate set of stoichiometric coefficients.
 */
export function evaluateEquationBalance(
  reactants: readonly ChemicalSpeciesDef[],
  products: readonly ChemicalSpeciesDef[],
  reactantCoeffs: readonly number[],
  productCoeffs: readonly number[],
  options: { requireSimplestRatio?: boolean; maxCoefficient?: number } = {},
): EquationBalanceEvaluation {
  const maxCoeff = Math.min(
    STOICHIOMETRY_LIMITS.maxCoefficientHardCap,
    options.maxCoefficient ?? 12,
  );
  const requireSimplest = options.requireSimplestRatio ?? true;

  if (reactants.length !== reactantCoeffs.length || products.length !== productCoeffs.length) {
    return {
      ok: false,
      isAtomsBalanced: false,
      isChargeBalanced: false,
      isBalanced: false,
      isSimplestRatio: false,
      gcd: 1,
      lhsCharge: 0,
      rhsCharge: 0,
      hasIonicSpecies: false,
      elements: [],
      feedback: 'Coefficient count does not match equation species.',
      error: 'Coefficient array length mismatch.',
    };
  }

  const allCoeffs = [...reactantCoeffs, ...productCoeffs];
  for (const c of allCoeffs) {
    if (!Number.isInteger(c) || c < STOICHIOMETRY_LIMITS.minCoefficient || c > maxCoeff) {
      return {
        ok: false,
        isAtomsBalanced: false,
        isChargeBalanced: false,
        isBalanced: false,
        isSimplestRatio: false,
        gcd: 1,
        lhsCharge: 0,
        rhsCharge: 0,
        hasIonicSpecies: false,
        elements: [],
        feedback: `Each coefficient must be a whole number between 1 and ${maxCoeff}.`,
        error: `Coefficient ${c} out of range 1..${maxCoeff}.`,
      };
    }
  }

  const lhsAtoms = Object.create(null) as Record<string, number>;
  const rhsAtoms = Object.create(null) as Record<string, number>;
  const elementOrder: string[] = [];
  let lhsCharge = 0;
  let rhsCharge = 0;
  let hasIonicSpecies = false;

  for (let i = 0; i < reactants.length; i++) {
    const sp = reactants[i];
    const parsed = parseChemicalFormula(sp.formula, sp.isElectron);
    if (!parsed.ok) {
      return {
        ok: false,
        isAtomsBalanced: false,
        isChargeBalanced: false,
        isBalanced: false,
        isSimplestRatio: false,
        gcd: 1,
        lhsCharge: 0,
        rhsCharge: 0,
        hasIonicSpecies: false,
        elements: [],
        feedback: parsed.error ?? 'Invalid reactant formula.',
        error: parsed.error,
      };
    }
    const coeff = reactantCoeffs[i];
    for (const [el, cnt] of Object.entries(parsed.atoms)) {
      if (!elementOrder.includes(el)) elementOrder.push(el);
      lhsAtoms[el] = (lhsAtoms[el] ?? 0) + cnt * coeff;
    }
    const q = getSpeciesCharge(sp);
    if (q !== 0 || sp.isElectron) hasIonicSpecies = true;
    lhsCharge += q * coeff;
  }

  for (let i = 0; i < products.length; i++) {
    const sp = products[i];
    const parsed = parseChemicalFormula(sp.formula, sp.isElectron);
    if (!parsed.ok) {
      return {
        ok: false,
        isAtomsBalanced: false,
        isChargeBalanced: false,
        isBalanced: false,
        isSimplestRatio: false,
        gcd: 1,
        lhsCharge: 0,
        rhsCharge: 0,
        hasIonicSpecies: false,
        elements: [],
        feedback: parsed.error ?? 'Invalid product formula.',
        error: parsed.error,
      };
    }
    const coeff = productCoeffs[i];
    for (const [el, cnt] of Object.entries(parsed.atoms)) {
      if (!elementOrder.includes(el)) elementOrder.push(el);
      rhsAtoms[el] = (rhsAtoms[el] ?? 0) + cnt * coeff;
    }
    const q = getSpeciesCharge(sp);
    if (q !== 0 || sp.isElectron) hasIonicSpecies = true;
    rhsCharge += q * coeff;
  }

  const elements: ElementBalanceRow[] = elementOrder.map((el) => {
    const lhs = lhsAtoms[el] ?? 0;
    const rhs = rhsAtoms[el] ?? 0;
    return { element: el, lhs, rhs, balanced: lhs === rhs };
  });

  const isAtomsBalanced = elements.every((row) => row.balanced);
  const isChargeBalanced = lhsCharge === rhsCharge;
  const isBalanced = isAtomsBalanced && isChargeBalanced;
  const gcd = gcdList(allCoeffs);
  const isSimplestRatio = gcd === 1;

  let feedback: string;
  if (!isAtomsBalanced) {
    const unbalanced = elements
      .filter((r) => !r.balanced)
      .map((r) => `${r.element} (${r.lhs} on left vs ${r.rhs} on right)`);
    feedback = `Atoms are not yet conserved: check ${unbalanced.join(', ')}. Adjust whole-number coefficients only—never change subscripts.`;
  } else if (!isChargeBalanced) {
    feedback = `All atoms are balanced, but total electric charge is not conserved (${lhsCharge >= 0 ? `+${lhsCharge}` : lhsCharge} on left vs ${rhsCharge >= 0 ? `+${rhsCharge}` : rhsCharge} on right). Check ion or electron (e⁻) coefficients.`;
  } else if (requireSimplest && !isSimplestRatio) {
    feedback = `Atoms and charge are balanced, but all coefficients share a common factor of ${gcd}. Divide every coefficient by ${gcd} to obtain the simplest whole-number ratio.`;
  } else {
    feedback = hasIonicSpecies
      ? 'Balanced! Both atoms and total electric charge are conserved in the simplest whole-number ratio.'
      : 'Balanced! Every element has equal atoms on both sides in the simplest whole-number ratio.';
  }

  return {
    ok: true,
    isAtomsBalanced,
    isChargeBalanced,
    isBalanced,
    isSimplestRatio,
    gcd,
    lhsCharge,
    rhsCharge,
    hasIonicSpecies,
    elements,
    feedback,
  };
}

/**
 * Authoring-time solvability check: verifies via bounded exact rational Gaussian elimination
 * (with fallback bounded search for small systems) that at least one valid positive integer
 * solution exists within 1..maxCoefficient.
 */
export function hasValidEquationSolution(
  reactants: readonly ChemicalSpeciesDef[],
  products: readonly ChemicalSpeciesDef[],
  maxCoefficient = 10,
): { solvable: boolean; sampleSolution?: { reactants: number[]; products: number[] } } {
  const nReact = reactants.length;
  const nProd = products.length;
  const totalVars = nReact + nProd;
  if (nReact === 0 || nProd === 0 || totalVars > 12) return { solvable: false };

  const parsedR = reactants.map((s) => parseChemicalFormula(s.formula, s.isElectron));
  const parsedP = products.map((s) => parseChemicalFormula(s.formula, s.isElectron));
  if (parsedR.some((p) => !p.ok) || parsedP.some((p) => !p.ok)) return { solvable: false };

  const elements = new Set<string>();
  for (const p of [...parsedR, ...parsedP]) {
    for (const el of Object.keys(p.atoms)) elements.add(el);
  }

  // Build integer matrix rows: each element + net charge row
  const matrix: number[][] = [];
  for (const el of elements) {
    const row: number[] = [];
    for (let i = 0; i < nReact; i++) row.push(parsedR[i].atoms[el] ?? 0);
    for (let j = 0; j < nProd; j++) row.push(-(parsedP[j].atoms[el] ?? 0));
    matrix.push(row);
  }
  const chargeRow: number[] = [
    ...reactants.map((s) => getSpeciesCharge(s)),
    ...products.map((s) => -getSpeciesCharge(s)),
  ];
  if (chargeRow.some((q) => q !== 0)) {
    matrix.push(chargeRow);
  }

  // Exact RREF using rational pairs [num, den]
  type Rat = [number, number];
  const norm = (n: number, d: number): Rat => {
    if (n === 0) return [0, 1];
    const s = d < 0 ? -1 : 1;
    const g = gcdTwo(Math.abs(n), Math.abs(d));
    return [(s * n) / g, (s * d) / g];
  };
  const add = (a: Rat, b: Rat): Rat => norm(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const sub = (a: Rat, b: Rat): Rat => norm(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const mul = (a: Rat, b: Rat): Rat => norm(a[0] * b[0], a[1] * b[1]);
  const div = (a: Rat, b: Rat): Rat => norm(a[0] * b[1], a[1] * b[0]);

  const R: Rat[][] = matrix.map((row) => row.map((v) => [v, 1] as Rat));
  const m = R.length;
  const n = totalVars;
  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < n && pivotRow < m; col++) {
    let sel = -1;
    for (let r = pivotRow; r < m; r++) {
      if (R[r][col][0] !== 0) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue;
    [R[pivotRow], R[sel]] = [R[sel], R[pivotRow]];
    const pv = R[pivotRow][col];
    for (let c = col; c < n; c++) R[pivotRow][c] = div(R[pivotRow][c], pv);
    for (let r = 0; r < m; r++) {
      if (r === pivotRow || R[r][col][0] === 0) continue;
      const factor = R[r][col];
      for (let c = col; c < n; c++) {
        R[r][c] = sub(R[r][c], mul(factor, R[pivotRow][c]));
      }
    }
    pivotCols.push(col);
    pivotRow++;
  }

  const freeCols: number[] = [];
  for (let c = 0; c < n; c++) {
    if (!pivotCols.includes(c)) freeCols.push(c);
  }
  if (freeCols.length === 0) return { solvable: false };

  // Build nullspace basis vectors; test simple positive combinations (free = 1, or small integers if 2D)
  const testFreeAssignments: number[][] = [];
  if (freeCols.length === 1) {
    testFreeAssignments.push([1]);
  } else if (freeCols.length === 2) {
    for (let a = 1; a <= 4; a++) {
      for (let b = 1; b <= 4; b++) {
        testFreeAssignments.push([a, b]);
      }
    }
  } else {
    testFreeAssignments.push(freeCols.map(() => 1));
  }

  const lcm = (a: number, b: number) => (a / gcdTwo(a, b)) * b;

  for (const freeVals of testFreeAssignments) {
    const sol: Rat[] = Array.from({ length: n }, () => [0, 1] as Rat);
    freeCols.forEach((fc, idx) => {
      sol[fc] = [freeVals[idx], 1];
    });
    for (let r = 0; r < pivotCols.length; r++) {
      const pc = pivotCols[r];
      let acc: Rat = [0, 1];
      for (let fi = 0; fi < freeCols.length; fi++) {
        const fc = freeCols[fi];
        acc = add(acc, mul(R[r][fc], [freeVals[fi], 1]));
      }
      sol[pc] = [-acc[0], acc[1]];
    }

    if (sol.some(([num]) => num <= 0)) continue;
    let commonDen = 1;
    for (const [, den] of sol) commonDen = lcm(commonDen, den);
    const ints = sol.map(([num, den]) => (num * commonDen) / den);
    const g = gcdList(ints);
    const reduced = ints.map((v) => v / g);
    if (reduced.every((v) => Number.isInteger(v) && v >= 1 && v <= maxCoefficient)) {
      return {
        solvable: true,
        sampleSolution: {
          reactants: reduced.slice(0, nReact),
          products: reduced.slice(nReact),
        },
      };
    }
  }

  return { solvable: false };
}

/** Independent chemistry helpers for audit tests: own formula parser + exact rational nullspace balancer. Not used by production code. */
import type { ChemicalSpeciesDef } from './stoichiometry-engine';

export function parseF(f: string): Record<string, number> {
  let i = 0;
  function group(): Record<string, number> {
    const out: Record<string, number> = {};
    while (i < f.length && f[i] !== ')') {
      if (f[i] === '(') { i++; const inner = group(); i++; let n = ''; while (/\d/.test(f[i] ?? '')) n += f[i++]; const k = n ? +n : 1; for (const [e, c] of Object.entries(inner)) out[e] = (out[e] ?? 0) + c * k; }
      else { let e = f[i++]; while (/[a-z]/.test(f[i] ?? '')) e += f[i++]; let n = ''; while (/\d/.test(f[i] ?? '')) n += f[i++]; out[e] = (out[e] ?? 0) + (n ? +n : 1); }
    }
    return out;
  }
  return group();
}
/** Exact minimal positive-integer solution via rational Gauss-Jordan on BigInt fractions; null when none or non-unique-sign. */
export function independentSolve(reac: ChemicalSpeciesDef[], prod: ChemicalSpeciesDef[]): number[] | null {
  const cols = [...reac, ...prod];
  const els = [...new Set(cols.flatMap((s) => Object.keys(parseF(s.formula))))];
  const rows: bigint[][] = els.map((e) => cols.map((s, j) => BigInt((parseF(s.formula)[e] ?? 0) * (j < reac.length ? 1 : -1))));
  if (cols.some((s) => s.charge)) rows.push(cols.map((s, j) => BigInt((s.charge ?? 0) * (j < reac.length ? 1 : -1))));
  const n = cols.length;
  type Fr = [bigint, bigint];
  const g = (a: bigint, b: bigint): bigint => { a = a < BigInt(0) ? -a : a; b = b < BigInt(0) ? -b : b; while (b) [a, b] = [b, a % b]; return a || BigInt(1); };
  const norm = ([p, q]: Fr): Fr => { if (q < BigInt(0)) { p = -p; q = -q; } const d = g(p, q); return [p / d, q / d]; };
  const sub = (a: Fr, b: Fr): Fr => norm([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
  const mul = (a: Fr, b: Fr): Fr => norm([a[0] * b[0], a[1] * b[1]]);
  const div = (a: Fr, b: Fr): Fr => norm([a[0] * b[1], a[1] * b[0]]);
  const M: Fr[][] = rows.map((r) => r.map((x) => [x, BigInt(1)] as Fr));
  const piv: number[] = []; let r = 0;
  for (let c = 0; c < n && r < M.length; c++) {
    let p = -1; for (let k = r; k < M.length; k++) if (M[k][c][0] !== BigInt(0)) { p = k; break; }
    if (p < 0) continue; [M[r], M[p]] = [M[p], M[r]];
    const pv = M[r][c]; M[r] = M[r].map((x) => div(x, pv));
    for (let k = 0; k < M.length; k++) if (k !== r && M[k][c][0] !== BigInt(0)) { const f = M[k][c]; M[k] = M[k].map((x, j) => sub(x, mul(f, M[r][j]))); }
    piv.push(c); r++;
  }
  const free = [...Array(n).keys()].filter((c) => !piv.includes(c));
  if (free.length !== 1) return free.length === 0 ? null : null; // only the unique-ray case is used by this oracle
  const fcol = free[0]; const sol: Fr[] = Array(n).fill([BigInt(0), BigInt(1)]); sol[fcol] = [BigInt(1), BigInt(1)];
  piv.forEach((c, k) => { sol[c] = norm([-M[k][fcol][0], M[k][fcol][1]]); });
  let L = BigInt(1); for (const [, q] of sol) L = (L * q) / g(L, q);
  const ints = sol.map(([p, q]) => (p * L) / q);
  if (ints.some((x) => x <= BigInt(0))) return null;
  let G = ints[0]; for (const x of ints) G = g(G, x);
  return ints.map((x) => Number(x / G));
}

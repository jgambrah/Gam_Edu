// @vitest-environment node
/**
 * Independent exhaustive verification of the cube-net engine (comprehensive audit).
 *
 * Ground truth is produced by a DIFFERENT algorithm from the engine under test:
 *   1. enumerate all fixed hexominoes by polyomino growth, canonicalise under the 8 symmetries of the square
 *      -> must give exactly 35 free hexominoes (a published combinatorial constant);
 *   2. decide foldability by simulating a die ROLLING over the net (labelled-face state machine),
 *      not by rotating orthonormal frames as the engine does;
 *   3. the count of foldable free hexominoes must be exactly 11 (24 are not).
 * The engine must agree with the oracle for every one of the 35 shapes, in all 8 orientations and under
 * translation, and must reject malformed input.
 */
import { describe, expect, it } from 'vitest';
import { evaluateCubeNet, type GridCell } from './geometry-step5e';

type P = [number, number];
const key = (p: P) => `${p[0]},${p[1]}`;

function normalise(cells: P[]): P[] {
  const minR = Math.min(...cells.map(c => c[0]));
  const minC = Math.min(...cells.map(c => c[1]));
  return cells.map(([r, c]) => [r - minR, c - minC] as P).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
const sig = (cells: P[]) => normalise(cells).map(key).join('|');

const transforms: Array<(p: P) => P> = [
  ([r, c]) => [r, c],
  ([r, c]) => [c, -r],
  ([r, c]) => [-r, -c],
  ([r, c]) => [-c, r],
  ([r, c]) => [r, -c],
  ([r, c]) => [-r, c],
  ([r, c]) => [c, r],
  ([r, c]) => [-c, -r],
];

function canonical(cells: P[]): string {
  return transforms.map(t => sig(cells.map(t))).sort()[0];
}

function enumerateFree(n: number): P[][] {
  let level = new Map<string, P[]>([[canonical([[0, 0]]), [[0, 0]]]]);
  for (let size = 2; size <= n; size++) {
    const next = new Map<string, P[]>();
    for (const shape of level.values()) {
      const set = new Set(shape.map(key));
      for (const [r, c] of shape) {
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const q: P = [r + dr, c + dc];
          if (set.has(key(q))) continue;
          const grown = [...shape, q];
          const k = canonical(grown);
          if (!next.has(k)) next.set(k, normalise(grown));
        }
      }
    }
    level = next;
  }
  return [...level.values()];
}

/** Rolling-die oracle: each cell's cube face = the die face touching the table when the die is rolled to that cell. */
function foldsToCubeByRolling(cells: P[]): boolean {
  if (cells.length !== 6) return false;
  const set = new Set(cells.map(key));
  // die state: faces touching [bottom, top, north, south, east, west]; labels are face ids 0..5
  type Die = { bottom: number; top: number; north: number; south: number; east: number; west: number };
  const start: Die = { bottom: 0, top: 1, north: 2, south: 3, east: 4, west: 5 };
  const roll = (d: Die, dr: number, dc: number): Die => {
    if (dc === 1) return { bottom: d.east, east: d.top, top: d.west, west: d.bottom, north: d.north, south: d.south };
    if (dc === -1) return { bottom: d.west, west: d.top, top: d.east, east: d.bottom, north: d.north, south: d.south };
    if (dr === 1) return { bottom: d.south, south: d.top, top: d.north, north: d.bottom, east: d.east, west: d.west };
    return { bottom: d.north, north: d.top, top: d.south, south: d.bottom, east: d.east, west: d.west };
  };
  const seen = new Map<string, Die>([[key(cells[0]), start]]);
  const queue: P[] = [cells[0]];
  while (queue.length) {
    const cur = queue.shift()!;
    const die = seen.get(key(cur))!;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nxt: P = [cur[0] + dr, cur[1] + dc];
      if (set.has(key(nxt)) && !seen.has(key(nxt))) {
        seen.set(key(nxt), roll(die, dr, dc));
        queue.push(nxt);
      }
    }
  }
  if (seen.size !== 6) return false; // disconnected
  const faces = new Set([...seen.values()].map(d => d.bottom));
  return faces.size === 6;
}

const toCells = (cells: P[]): GridCell[] => cells.map(([r, c]) => ({ r, c }));

describe('independent exhaustive cube-net verification', () => {
  const free = enumerateFree(6);

  it('enumerates exactly 35 free hexominoes (published constant)', () => {
    expect(free).toHaveLength(35);
  });

  it('exactly 11 free hexominoes fold into a cube and 24 do not (oracle)', () => {
    const foldable = free.filter(foldsToCubeByRolling);
    expect(foldable).toHaveLength(11);
    expect(free.length - foldable.length).toBe(24);
  });

  it('engine agrees with the oracle on all 35 free hexominoes under all 8 orientations and translations', () => {
    const disagreements: string[] = [];
    let checked = 0;
    for (const shape of free) {
      const truth = foldsToCubeByRolling(shape);
      transforms.forEach((t, ti) => {
        const oriented = shape.map(t);
        for (const [shiftR, shiftC] of [[0, 0], [3, 2]]) {
          const placed = oriented.map(([r, c]) => [r + shiftR, c + shiftC] as P);
          // also vary which cell the engine starts its traversal from
          for (const rot of [0, 3]) {
            const order = [...placed.slice(rot), ...placed.slice(0, rot)];
            const engine = evaluateCubeNet(toCells(order)).valid;
            checked++;
            if (engine !== truth) disagreements.push(`${sig(shape)} t${ti} shift${shiftR},${shiftC} rot${rot}: engine=${engine} oracle=${truth}`);
          }
        }
      });
    }
    expect(disagreements).toEqual([]);
    expect(checked).toBe(35 * 8 * 2 * 2);
  });

  it('the 11 foldable shapes match the textbook families by longest straight run: 4 (six 1-4-1 nets), 3 (three 2-3-1 + the 3-3 net), 2 (the 2-2-2 staircase)', () => {
    const longestRun = (shape: P[]) => {
      const set = new Set(shape.map(key));
      let best = 1;
      for (const [r, c] of shape) {
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          if (set.has(key([r - dr, c - dc]))) continue; // only start at run starts
          let len = 1;
          while (set.has(key([r + dr * len, c + dc * len]))) len++;
          best = Math.max(best, len);
        }
      }
      return best;
    };
    const byRun: Record<number, number> = {};
    for (const shape of free.filter(foldsToCubeByRolling)) {
      const run = longestRun(shape);
      byRun[run] = (byRun[run] ?? 0) + 1;
    }
    expect(byRun).toEqual({ 4: 6, 3: 4, 2: 1 });
  });

  it('rejects malformed input: duplicates, non-integers, wrong counts, disconnected pieces', () => {
    expect(evaluateCubeNet([]).valid).toBe(false);
    expect(evaluateCubeNet(toCells([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]])).valid).toBe(false); // 5 cells
    expect(evaluateCubeNet(toCells([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]])).valid).toBe(false); // 7 cells
    expect(evaluateCubeNet(toCells([[0, 0], [0, 0], [0, 1], [0, 2], [0, 3], [1, 1]])).valid).toBe(false); // duplicate
    expect(evaluateCubeNet([{ r: 0.5, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 1, c: 1 }, { r: -1, c: 1 }]).valid).toBe(false);
    expect(evaluateCubeNet(toCells([[0, 0], [0, 1], [0, 2], [5, 5], [5, 6], [5, 7]])).valid).toBe(false); // disconnected
    expect(evaluateCubeNet([{ r: NaN, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 1, c: 1 }, { r: -1, c: 1 }]).valid).toBe(false);
  });
});

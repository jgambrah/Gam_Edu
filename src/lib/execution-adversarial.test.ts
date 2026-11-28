// @vitest-environment node
/**
 * Adversarial execution tests for the in-browser SQL and Cambridge-pseudocode interpreters (audit checkpoint 2).
 * Both are hand-written interpreters (no real database, no eval), so the questions are: do they refuse anything that
 * is not a read-only SELECT, stay inside resource limits, keep no shared mutable state, and give Cambridge-correct results?
 */
import { describe, expect, it } from 'vitest';
import { CH9_TABLES, executeIgcseSql } from './sql-practice/igcse-sql-engine';
import { runPseudocode } from './pseudocode-runner';

const timed = <T,>(fn: () => T): { value: T; ms: number } => {
  const t0 = performance.now();
  const value = fn();
  return { value, ms: performance.now() - t0 };
};

describe('SQL practice engine — read-only and bounded', () => {
  const refuse = [
    'DROP TABLE Stock',
    'DELETE FROM Stock',
    "INSERT INTO Stock VALUES ('X',1)",
    "UPDATE Stock SET Price = 0",
    'CREATE TABLE t (a INT)',
    'ALTER TABLE Stock ADD x INT',
    'TRUNCATE TABLE Stock',
    "ATTACH DATABASE 'x.db' AS x",
    'PRAGMA table_info(Stock)',
    'VACUUM',
    'WITH x AS (SELECT 1) SELECT * FROM x',
    '  drop table Stock  ',
    '\n\nDELETE\nFROM Stock',
  ];
  for (const q of refuse) {
    it(`refuses non-SELECT: ${JSON.stringify(q).slice(0, 40)}`, () => {
      const r = executeIgcseSql(q);
      expect(r.ok).toBe(false);
      expect(r.rows).toEqual([]);
    });
  }

  it('does not run a second statement after a SELECT (stacked queries)', () => {
    const tableBefore = JSON.stringify(CH9_TABLES);
    for (const q of ['SELECT * FROM Stock; DROP TABLE Stock;', 'SELECT * FROM Stock; DELETE FROM Stock', "SELECT ItemName FROM Stock; UPDATE Stock SET Price = 1"]) {
      const r = executeIgcseSql(q);
      // Either rejected, or only the first SELECT is honoured; nothing is ever modified.
      if (r.ok) expect(r.rows.length).toBeGreaterThan(0);
    }
    expect(JSON.stringify(CH9_TABLES)).toBe(tableBefore);
  });

  it('comment and quote tricks do not smuggle a second statement', () => {
    for (const q of ["SELECT * FROM Stock WHERE ItemName = 'x'; DROP TABLE Stock; --'", 'SELECT * FROM Stock -- ; DROP TABLE Stock', "SELECT * FROM Stock WHERE ItemName = 'a''; DROP TABLE Stock; --'"]) {
      const r = executeIgcseSql(q);
      expect(r.rows.every((row) => row.every((v) => v === null || ['string', 'number'].includes(typeof v)))).toBe(true);
    }
    expect(Object.keys(CH9_TABLES).length).toBeGreaterThan(0);
  });

  it('unknown tables / columns give an error, not an exception or partial data', () => {
    expect(executeIgcseSql('SELECT * FROM sqlite_master').ok).toBe(false);
    expect(executeIgcseSql('SELECT * FROM information_schema.tables').ok).toBe(false);
    expect(executeIgcseSql('SELECT nonexistent FROM Stock').ok).toBe(false);
  });

  it('no shared mutable state: changing a returned result never alters later queries or the tables', () => {
    const a = executeIgcseSql('SELECT ItemName, Price FROM Stock');
    expect(a.ok).toBe(true);
    const snapshot = JSON.stringify(executeIgcseSql('SELECT * FROM Stock').rows);
    a.rows.forEach((row) => row.fill('HACKED' as any));
    a.rows.length = 0;
    a.columns.push('x');
    expect(JSON.stringify(executeIgcseSql('SELECT * FROM Stock').rows)).toBe(snapshot);
  });

  it('huge, deeply nested and pathological queries stay fast and never throw', () => {
    const cases: string[] = [
      'SELECT ' + 'ItemName,'.repeat(5000) + 'Price FROM Stock',
      'SELECT * FROM Stock WHERE ' + '('.repeat(5000) + 'Price > 1' + ')'.repeat(5000),
      'SELECT * FROM Stock WHERE ' + Array.from({ length: 3000 }, () => 'Price > 1').join(' AND '),
      'SELECT * FROM Stock WHERE ItemName = ' + "'" + 'a'.repeat(1_000_000) + "'",
      'SELECT ' + 'x'.repeat(2_000_000),
      'SELECT * FROM Stock ORDER BY ' + 'Price,'.repeat(2000) + 'Price',
    ];
    for (const q of cases) {
      const { value, ms } = timed(() => executeIgcseSql(q));
      expect(typeof value.ok).toBe('boolean');
      expect(ms, `took ${Math.round(ms)}ms for ${q.slice(0, 30)}…`).toBeLessThan(2000);
    }
  });

  it('known good query still gives the documented answer', () => {
    const r = executeIgcseSql('SELECT ItemName, Price FROM Stock WHERE Quantity < 6 ORDER BY Price DESC;');
    expect(r.ok).toBe(true);
    expect(r.rows).toEqual([['Bag', 35], ['Ruler', 4], ['Pencil', 1.5]]);
  });
});

describe('Cambridge pseudocode runner — semantics and limits', () => {
  const run = (src: string, stdin = '') => runPseudocode(src, stdin);

  it('DIV and MOD follow the syllabus for positive integers (operator and function forms)', () => {
    const cases: Array<[number, number, number, number]> = [[23, 5, 4, 3], [7, 2, 3, 1], [10, 5, 2, 0], [0, 4, 0, 0], [1, 9, 0, 1]];
    for (const [a, b, q, r] of cases) {
      const res = run(`OUTPUT ${a} DIV ${b}\nOUTPUT ${a} MOD ${b}\nOUTPUT DIV(${a}, ${b})\nOUTPUT MOD(${a}, ${b})`);
      expect(res.ok, res.error).toBe(true);
      expect(res.output).toEqual([String(q), String(r), String(q), String(r)]);
    }
  });

  it('division by zero is a clean error, never Infinity/NaN output', () => {
    for (const expr of ['5 DIV 0', '5 MOD 0', '5 / 0', 'DIV(5, 0)', 'MOD(5, 0)']) {
      const res = run(`OUTPUT ${expr}`);
      expect(res.ok, expr).toBe(false);
      expect(res.output.join('')).not.toMatch(/Infinity|NaN/);
    }
  });

  it('arrays are 1-based by declaration, bounds-checked, and 2D arrays work', () => {
    const ok = run('DECLARE A : ARRAY[1:3] OF INTEGER\nA[1] <- 10\nA[3] <- 30\nOUTPUT A[1] + A[3]');
    expect(ok.output).toEqual(['40']);
    expect(run('DECLARE A : ARRAY[1:3] OF INTEGER\nA[0] <- 1').ok).toBe(false);
    expect(run('DECLARE A : ARRAY[1:3] OF INTEGER\nA[4] <- 1').ok).toBe(false);
    expect(run('OUTPUT B[1]').ok).toBe(false);
    const two = run('DECLARE G : ARRAY[1:2, 1:2] OF INTEGER\nG[2, 1] <- 7\nOUTPUT G[2, 1]');
    expect(two.output).toEqual(['7']);
  });

  it('functions return values, procedures run, recursion works within limits', () => {
    const src = `FUNCTION Fact(N : INTEGER) RETURNS INTEGER
  IF N <= 1 THEN
    RETURN 1
  ELSE
    RETURN N * Fact(N - 1)
  ENDIF
ENDFUNCTION
PROCEDURE Show(X : INTEGER)
  OUTPUT X
ENDPROCEDURE
CALL Show(Fact(5))`;
    const res = run(src);
    expect(res.ok, res.error).toBe(true);
    expect(res.output).toEqual(['120']);
  });

  it('infinite loops and infinite recursion stop with a clear error and bounded time', () => {
    for (const src of [
      'WHILE TRUE DO\n  OUTPUT 1\nENDWHILE',
      'REPEAT\n  X <- 1\nUNTIL FALSE',
      'FUNCTION F(N : INTEGER) RETURNS INTEGER\n  RETURN F(N + 1)\nENDFUNCTION\nOUTPUT F(1)',
      'PROCEDURE P()\n  CALL P()\nENDPROCEDURE\nCALL P()',
    ]) {
      const { value, ms } = timed(() => run(src));
      expect(value.ok, src).toBe(false);
      expect(ms).toBeLessThan(3000);
    }
  });

  it('memory-exhaustion attempts fail cleanly instead of crashing the page', () => {
    const grow = run('DECLARE S : STRING\nS <- "ab"\nFOR I <- 1 TO 60\n  S <- S & S\nNEXT I\nOUTPUT LENGTH(S)');
    expect(grow.ok).toBe(false); // either a step/size limit error or a JS length error, never a hang/crash
    for (const src of [
      'DECLARE A : ARRAY[1:2000000000] OF INTEGER\nOUTPUT "allocated"',
      'DECLARE G : ARRAY[1:100000, 1:100000] OF INTEGER\nOUTPUT "allocated"',
      'DECLARE A : ARRAY[1:50000000] OF INTEGER\nOUTPUT "allocated"',
      'DECLARE A, B, C, D, E, F, G, H : ARRAY[1:90000] OF INTEGER\nOUTPUT "allocated"',
      'DECLARE A : ARRAY[5:1] OF INTEGER\nOUTPUT "allocated"',
    ]) {
      const { value, ms } = timed(() => run(src));
      expect(value.ok, src).toBe(false); // refused up front, not after a multi-second freeze
      expect(ms, `took ${Math.round(ms)}ms for ${src.slice(0, 40)}`).toBeLessThan(500);
    }
    // ordinary sized arrays still work, including at the limit
    expect(run('DECLARE A : ARRAY[1:100000] OF INTEGER\nA[100000] <- 1\nOUTPUT A[100000]').output).toEqual(['1']);
  });

  it('output volume is bounded', () => {
    const res = run('FOR I <- 1 TO 100000\n  OUTPUT "line"\nNEXT I');
    expect(res.output.length).toBeLessThanOrEqual(20000);
  });

  it('file handling is virtual: real paths are never read or written', () => {
    const res = run('DECLARE L : STRING\nOPENFILE "/etc/passwd" FOR READ\nREADFILE "/etc/passwd", L\nOUTPUT L\nCLOSEFILE "/etc/passwd"');
    expect(res.ok === false || !/root:|:x:/.test(res.output.join('\n'))).toBe(true);
    const win = run('OPENFILE "C:\\Windows\\win.ini" FOR READ\nREADFILE "C:\\Windows\\win.ini", L\nOUTPUT L');
    expect(win.output.join('')).not.toMatch(/\[fonts\]|\[extensions\]/i);
  });

  it('malformed and hostile source never throws out of runPseudocode', () => {
    const hostile = ['', '((((((', 'ENDIF', 'OUTPUT "unterminated', 'X <- <- 1', 'FOR I <- 1 TO', 'IF THEN', 'DECLARE', 'CALL', '\u0000\u0001\u0002', 'OUTPUT ' + '('.repeat(20000) + '1' + ')'.repeat(20000), 'OUTPUT ' + '1+'.repeat(20000) + '1', '"'.repeat(100000)];
    for (const src of hostile) {
      let res: ReturnType<typeof runPseudocode> | undefined;
      expect(() => { res = runPseudocode(src, ''); }).not.toThrow();
      expect(typeof res!.ok).toBe('boolean');
    }
  });
});

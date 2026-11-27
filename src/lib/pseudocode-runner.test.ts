import { describe, it, expect } from 'vitest';
import { runPseudocode } from './pseudocode-runner';

describe('Cambridge IGCSE 0478 Pseudocode Runner', () => {
  it('runs IPO, arithmetic, DIV, and MOD', () => {
    const code = `
      DECLARE Sweets, Children, Each, LeftOver : INTEGER
      INPUT Sweets
      INPUT Children
      Each ← Sweets DIV Children
      LeftOver <- Sweets MOD Children
      OUTPUT Each
      OUTPUT LeftOver
    `;
    const res = runPseudocode(code, '23\n5');
    expect(res.ok).toBe(true);
    expect(res.output).toEqual(['4', '3']);
  });

  it('supports Cambridge function-call DIV(A, B), MOD(A, B), and power ^ operator', () => {
    const code = `
      DECLARE A : INTEGER
      DECLARE B : INTEGER
      OUTPUT "Enter values for A and B"
      INPUT A
      INPUT B
      quot ← DIV(A, B)
      rem ← MOD(A, B)
      pow ← A ^ B
      OUTPUT quot, rem, pow
    `;
    const res = runPseudocode(code, '18\n3');
    expect(res.ok).toBe(true);
    expect(res.output).toEqual(['Enter values for A and B', '6 0 5832']);

    expect(runPseudocode('OUTPUT DIV(10, 0)').ok).toBe(false);
    expect(runPseudocode('OUTPUT MOD(10, 0)').ok).toBe(false);
  });

  it('runs IF/ELSE, FOR loop, WHILE sentinel, and REPEAT...UNTIL', () => {
    const code = `
      DECLARE Total, Count : INTEGER
      Total ← 0
      FOR Count ← 1 TO 5
        Total ← Total + Count
      NEXT Count
      IF Total >= 15 THEN
        OUTPUT "Pass", Total
      ELSE
        OUTPUT "Fail"
      ENDIF
    `;
    const res = runPseudocode(code);
    expect(res.ok).toBe(true);
    expect(res.output).toEqual(['Pass 15']);

    const whileCode = `
      DECLARE Num, Sum : INTEGER
      Sum ← 0
      INPUT Num
      WHILE Num <> -1 DO
        Sum ← Sum + Num
        INPUT Num
      ENDWHILE
      OUTPUT Sum
    `;
    const wRes = runPseudocode(whileCode, '10\n20\n5\n-1');
    expect(wRes.ok).toBe(true);
    expect(wRes.output).toEqual(['35']);

    const repeatCode = `
      DECLARE X : INTEGER
      X ← 1
      REPEAT
        OUTPUT X
        X ← X + 1
      UNTIL X > 3
    `;
    const rRes = runPseudocode(repeatCode);
    expect(rRes.ok).toBe(true);
    expect(rRes.output).toEqual(['1', '2', '3']);
  });

  it('runs FUNCTION, PROCEDURE, 1-based ARRAY, strings, and virtual files', () => {
    const code = `
      FUNCTION Area(W : REAL, H : REAL) RETURNS REAL
        RETURN W * H
      ENDFUNCTION

      DECLARE Scores : ARRAY[1:3] OF INTEGER
      Scores[1] ← 78
      Scores[2] ← 92
      Scores[3] ← 85
      OUTPUT Area(5, 4)
      OUTPUT UCASE(SUBSTRING("igcse0478", 1, 5)), LENGTH("igcse0478")
      OUTPUT Scores[2]

      OPENFILE "scores.txt" FOR WRITE
      WRITEFILE "scores.txt", "Ama:92"
      CLOSEFILE "scores.txt"

      DECLARE Line : STRING
      OPENFILE "scores.txt" FOR READ
      WHILE NOT EOF("scores.txt") DO
        READFILE "scores.txt", Line
        OUTPUT Line
      ENDWHILE
      CLOSEFILE "scores.txt"
    `;
    const res = runPseudocode(code);
    expect(res.ok).toBe(true);
    expect(res.output).toEqual(['20', 'IGCSE 9', '92', 'Ama:92']);
  });

  it('supports BOOLEAN 0/1 inputs and XOR, NAND, NOR operators', () => {
    const code = `
      DECLARE A, B, Y : BOOLEAN
      INPUT A
      INPUT B
      Y ← A XOR B
      OUTPUT Y
      OUTPUT A NAND B
      OUTPUT A NOR B
    `;
    const res = runPseudocode(code, '0\n1');
    expect(res.ok).toBe(true);
    expect(res.output).toEqual(['TRUE', 'TRUE', 'FALSE']);
  });

  it('guards against infinite loops and missing input cleanly', () => {
    const inf = runPseudocode('WHILE TRUE DO\n  OUTPUT "x"\nENDWHILE');
    expect(inf.ok).toBe(false);
    expect(inf.error).toMatch(/infinite loop/i);

    const noInput = runPseudocode('DECLARE X : INTEGER\nINPUT X\nOUTPUT X', '');
    expect(noInput.ok).toBe(false);
    expect(noInput.error).toMatch(/Program Input/i);
  });
});

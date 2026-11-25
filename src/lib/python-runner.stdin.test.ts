import { describe, it, expect } from 'vitest';
import { createStdinReader } from './python-runner';

describe('python-runner createStdinReader (opt-in strictInput vs legacy fallback)', () => {
  it('feeds sufficient multiline input and signals EOF (undefined) when exhausted in strict mode', () => {
    const read = createStdinReader('Ama\n42\n3.5', true, 'int(input())');
    expect(read()).toBe('Ama');
    expect(read()).toBe('42');
    expect(read()).toBe('3.5');
    // Exhausted: must return undefined (EOF), never invented '18' or 'blue'
    expect(read()).toBeUndefined();
    expect(read()).toBeUndefined();
  });

  it('distinguishes empty supplied lines from exhausted input in strict mode', () => {
    const read = createStdinReader('\nhello\n', true, 'input()');
    expect(read()).toBe('');
    expect(read()).toBe('hello');
    expect(read()).toBe('');
    expect(read()).toBeUndefined();

    const singleEmpty = createStdinReader('', true, 'input()');
    expect(singleEmpty()).toBe('');
    expect(singleEmpty()).toBeUndefined();

    const noneSupplied = createStdinReader(undefined, true, 'input()');
    expect(noneSupplied()).toBeUndefined();
  });

  it('normalizes CRLF line endings in strict mode', () => {
    const read = createStdinReader('10\r\n20', true, 'int(input())');
    expect(read()).toBe('10');
    expect(read()).toBe('20');
    expect(read()).toBeUndefined();
  });

  it('preserves legacy fallback behavior when strictInput is false', () => {
    const readNum = createStdinReader('', false, 'x = int(input("Age: "))');
    expect(readNum()).toBe('18');
    const readStr = createStdinReader('', false, 'c = input("Colour: ")');
    expect(readStr()).toBe('blue');
  });
});

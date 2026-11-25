import type { PythonAcademyPhase } from './python-academy-data';

/**
 * Cambridge IGCSE 0478 — Chapter 8: Programming
 * In-app hands-on Python practice missions mapped 1:1 to the 3 narrated lessons:
 * - Part 1: Programming Basics (Variables, Data Types, I/O, Arithmetic, DIV/MOD)
 * - Part 2: Selection & Iteration (IF/ELIF/ELSE, Boolean logic, FOR/WHILE loops)
 * - Part 3: Strings, Subroutines, Arrays & Files
 */
export const IGCSE_CH8_PYTHON_PHASE: PythonAcademyPhase = {
  phase: 'Cambridge IGCSE Ch. 8',
  title: 'IGCSE CS: Chapter 8 Programming',
  mainTopics: [
    {
      title: 'Part 1: Basics, I/O & Arithmetic',
      lessons: [
        {
          id: 'igcse-ch8-1-ipo',
          title: '1.1 Input, Process & Output (Total Cost)',
          theory:
            'Every program follows Input → Process → Output. In Python, `input()` returns a string, so convert whole numbers with `int(...)` and decimals with `float(...)`.',
          task: 'Read a unit price (float) and a quantity (int) from Program input (already prefilled with 4.5 and 3), compute `total = price * quantity`, and print `total`.',
          startingCode: 'price = float(input())\nquantity = int(input())\ntotal = price * quantity\nprint(total)',
          mustUse: ['input(', 'float(', 'int(', 'print('],
          expectOutput: '13.5',
          strictInput: true,
          defaultStdin: '4.5\n3',
        },
        {
          id: 'igcse-ch8-1-divmod',
          title: '1.2 Integer Division (DIV) & Remainder (MOD)',
          theory:
            'Cambridge pseudocode `DIV` is Python `//` (whole-number quotient) and `MOD` is Python `%` (remainder).',
          task: 'Given `sweets = 23` and `children = 5`, compute `each = sweets // children` and `left_over = sweets % children`, then print `each` on the first line and `left_over` on the second line.',
          startingCode: 'sweets = 23\nchildren = 5\neach = sweets // children\nleft_over = sweets % children\nprint(each)\nprint(left_over)',
          mustUse: ['//', '%', 'print('],
          expectOutput: '4\n3',
          validation: "globals().get('each') == 4 and globals().get('left_over') == 3",
        },
        {
          id: 'igcse-ch8-1-types',
          title: '1.3 Constants, Types & Formatted Output',
          theory:
            'Use UPPERCASE names for constants whose value never changes during execution (e.g., `VAT_RATE = 0.15`), and check types cleanly.',
          task: 'Create constant `PASS_MARK = 50`, variable `score = 68`, and boolean `passed = score >= PASS_MARK`. Print `passed`.',
          startingCode: 'PASS_MARK = 50\nscore = 68\npassed = score >= PASS_MARK\nprint(passed)',
          mustUse: ['>=', 'print('],
          expectOutput: 'True',
          validation: "globals().get('PASS_MARK') == 50 and globals().get('passed') is True",
        },
      ],
    },
    {
      title: 'Part 2: Selection & Iteration',
      lessons: [
        {
          id: 'igcse-ch8-2-grade',
          title: '2.1 IF / ELIF / ELSE Grade Classifier',
          theory:
            'Selection chooses one branch based on a Boolean condition. Check the highest threshold first so boundaries do not overlap.',
          task: 'Read an integer `mark` from Program input (prefilled with 72). Print `Distinction` if `mark >= 80`, `Merit` if `mark >= 65`, `Pass` if `mark >= 50`, otherwise `Retry`.',
          startingCode: 'mark = int(input())\nif mark >= 80:\n    print("Distinction")\nelif mark >= 65:\n    print("Merit")\nelif mark >= 50:\n    print("Pass")\nelse:\n    print("Retry")',
          mustUse: ['if ', 'elif ', 'else:', 'print('],
          expectOutput: 'Merit',
          strictInput: true,
          defaultStdin: '72',
        },
        {
          id: 'igcse-ch8-2-for-total',
          title: '2.2 Count-Controlled FOR Loop & Running Total',
          theory:
            'A count-controlled loop (`FOR Count ← 1 TO 5`) maps to `for count in range(1, 6):` in Python. Remember `range(start, stop)` stops one before `stop`!',
          task: 'Use a `for` loop with `range(1, 6)` to add the numbers 1 through 5 into `total`, then print `total`.',
          startingCode: 'total = 0\nfor count in range(1, 6):\n    total = total + count\nprint(total)',
          mustUse: ['for ', 'range(', 'print('],
          expectOutput: '15',
          validation: "globals().get('total') == 15",
        },
        {
          id: 'igcse-ch8-2-while-sentinel',
          title: '2.3 Pre-Condition WHILE Loop with Sentinel',
          theory:
            'A `WHILE` loop repeats while a condition stays true. Read the first value before the loop and read the next value at the end of the loop body.',
          task: 'Read integers from Program input until `-1` is entered (prefilled: 10, 25, 5, -1). Print the sum of all numbers entered before `-1`.',
          startingCode: 'total = 0\nnum = int(input())\nwhile num != -1:\n    total = total + num\n    num = int(input())\nprint(total)',
          mustUse: ['while ', 'input(', 'print('],
          expectOutput: '40',
          strictInput: true,
          defaultStdin: '10\n25\n5\n-1',
        },
      ],
    },
    {
      title: 'Part 3: Strings, Subroutines, Arrays & Files',
      lessons: [
        {
          id: 'igcse-ch8-3-func',
          title: '3.1 Defining & Calling a Function',
          theory:
            'A function takes parameters, computes a result, and sends it back with `return`. Calling it lets you reuse logic without duplicating code.',
          task: 'Define `def area(width, height):` that returns `width * height`, then print `area(7, 4)`.',
          startingCode: 'def area(width, height):\n    return width * height\n\nprint(area(7, 4))',
          mustUse: ['def ', 'return', 'print('],
          expectOutput: '28',
          validation: "callable(globals().get('area')) and globals()['area'](7, 4) == 28",
        },
        {
          id: 'igcse-ch8-3-string',
          title: '3.2 String Length, Case & Slicing',
          theory:
            'IGCSE string operations map cleanly to Python: `LENGTH(s)` → `len(s)`, `UCASE(s)` → `s.upper()`, and `SUBSTRING` → slicing `s[start:end]`.',
          task: 'Given `code = "igcse0478"`, print `code[:5].upper()` on line 1 and `len(code)` on line 2.',
          startingCode: 'code = "igcse0478"\nprint(code[:5].upper())\nprint(len(code))',
          mustUse: ['.upper()', 'len(', 'print('],
          expectOutput: 'IGCSE\n9',
        },
        {
          id: 'igcse-ch8-3-array',
          title: '3.3 1D Array Traversal & Maximum Value',
          theory:
            'In Python, a 1D array is stored as a list. Traverse it with a loop to compute totals, counts, or maximum values.',
          task: 'Given `scores = [78, 92, 85, 64]`, use a `for` loop to find the highest score in `highest` (do not just hardcode 92), then print `highest`.',
          startingCode: 'scores = [78, 92, 85, 64]\nhighest = scores[0]\nfor s in scores:\n    if s > highest:\n        highest = s\nprint(highest)',
          mustUse: ['for ', 'if ', 'print('],
          expectOutput: '92',
          validation: "globals().get('highest') == 92",
        },
      ],
    },
  ],
};


export interface Mission {
  id: number;
  section: string;
  title: string;
  category: string;
  theory: string; // Markdown supported
  task: string;
  expectedOutput: string;
  hint: string;
  availableBlocks: string[];
}

export const CURRICULUM: Mission[] = [
  // --- MISSION 1: INTRODUCTION ---
  {
    id: 0,
    section: "Mission 1: Introduction",
    title: "Variables & Literals",
    category: "Basics",
    theory: "### Variables\nA variable is a named storage for data. In Python, we assign values using `=`.\n\n`score = 100`",
    task: "Assign 'SuperBot' to a variable named 'hero' and print it.",
    expectedOutput: "SuperBot",
    hint: "Connect the variable name, equals sign, and value.",
    availableBlocks: ["hero", "=", "'SuperBot'", "print(", ")", "score", "100"]
  },
  {
    id: 1,
    section: "Mission 1: Introduction",
    title: "Input and Output",
    category: "Basics",
    theory: "### Input & Output\n`print()` shows data to the user.\n`input()` gets data from the user.",
    task: "Print the exact phrase 'Hello Python'.",
    expectedOutput: "Hello Python",
    hint: "Use print with the string literal.",
    availableBlocks: ["print(", "'Hello Python'", ")", "input(", "name ="]
  },
  {
    id: 2,
    section: "Mission 1: Introduction",
    title: "Type Conversion",
    category: "Data Types",
    theory: "### Types\nPython has types like Integer (`int`), Float (`float`), and String (`str`).\nYou can convert strings to numbers: `int('5')`.",
    task: "Convert the string '10' to an integer, add 5 to it, and print the result.",
    expectedOutput: "15",
    hint: "Wrap the string in int(), then add 5.",
    availableBlocks: ["print(", "int(", "'10'", ")", "+", "5", ")"]
  },
  {
    id: 3,
    section: "Mission 1: Introduction",
    title: "Operations",
    category: "Math",
    theory: "### Math\nStandard operators:\n`+` (Add)\n`-` (Subtract)\n`*` (Multiply)\n`/` (Divide)\n`%` (Modulus/Remainder)",
    task: "Calculate 10 multiplied by 5 and print the result.",
    expectedOutput: "50",
    hint: "Use the asterisk * for multiplication.",
    availableBlocks: ["print(", "10", "*", "5", ")", "+", "/"]
  },
  {
    id: 4,
    section: "Mission 1: Introduction",
    title: "Mission 1 Quiz",
    category: "Quiz",
    theory: "### Quiz Time!\nCombine what you learned. Create a variable `age`, set it to `12`, and print `age + 1`.",
    task: "Create variable age = 12, then print age + 1.",
    expectedOutput: "13",
    hint: "Two lines of code needed.",
    availableBlocks: ["age", "=", "12", "print(", "age", "+", "1", ")"]
  },

  // --- MISSION 2: DECISION MAKING & LOOPS ---
  {
    id: 5,
    section: "Mission 2: Decision Making",
    title: "Boolean Expressions",
    category: "Logic",
    theory: "### Booleans\nValues are either `True` or `False`. Comparison operators: `==`, `!=`, `>`, `<`.",
    task: "Print True if 5 is less than 10.",
    expectedOutput: "True",
    hint: "Use the < operator.",
    availableBlocks: ["print(", "5", "<", "10", ")", ">", "=="]
  },
  {
    id: 6,
    section: "Mission 2: Decision Making",
    title: "If Else Statement",
    category: "Logic",
    theory: "### If/Else\nMake decisions based on conditions.\n\n```python\nif x > 5:\n  print('Big')\nelse:\n  print('Small')\n```",
    task: "Write logic: If 10 > 5, print 'Bigger'.",
    expectedOutput: "Bigger",
    hint: "Remember the colon : and indentation is simulated by order here.",
    availableBlocks: ["if", "10", ">", "5", ":", "print('Bigger')", "else:", "print('Smaller')"]
  },
  {
    id: 7,
    section: "Mission 2: Decision Making",
    title: "While Loops",
    category: "Loops",
    theory: "### While Loops\nRepeats code while a condition is true.\n\n`while x < 5:`",
    task: "Set x = 1. While x < 3, print x, then increment x by 1.",
    expectedOutput: "1\n2",
    hint: "Initialize, Condition, Action, Update.",
    availableBlocks: ["x = 1", "while", "x", "<", "3", ":", "print(x)", "x = x + 1"]
  },
  {
    id: 8,
    section: "Mission 2: Decision Making",
    title: "For Loops",
    category: "Loops",
    theory: "### For Loops\nIterates over a sequence. `range(3)` creates [0, 1, 2].",
    task: "Use a for loop with range(3) to print numbers 0, 1, 2.",
    expectedOutput: "0\n1\n2",
    hint: "for i in range(...)",
    availableBlocks: ["for", "i", "in", "range(3)", ":", "print(i)"]
  },
  {
    id: 9,
    section: "Mission 2: Decision Making",
    title: "Break and Continue",
    category: "Loops",
    theory: "### Control\n`break`: Stops the loop.\n`continue`: Skips to next iteration.",
    task: "Loop range(5). If i == 3, break. Else print i.",
    expectedOutput: "0\n1\n2",
    hint: "Combine loop with if/break.",
    availableBlocks: ["for", "i", "in", "range(5)", ":", "if", "i", "==", "3", ":", "break", "print(i)"]
  },
  {
    id: 10,
    section: "Mission 2: Decision Making",
    title: "Pass",
    category: "Logic",
    theory: "### Pass\n`pass` does nothing. It is a placeholder for empty code blocks.",
    task: "If 5 > 2, pass. Else print 'No'. (Output should be empty/nothing).",
    expectedOutput: "",
    hint: "Just use pass in the if block.",
    availableBlocks: ["if", "5", ">", "2", ":", "pass", "else:", "print('No')"]
  },
  {
    id: 11,
    section: "Mission 2: Decision Making",
    title: "Control Flow Example",
    category: "Logic",
    theory: "### Putting it together\nCombining If, Elif, and Else.",
    task: "Set score = 80. If score > 90 print 'A', elif score > 70 print 'B'.",
    expectedOutput: "B",
    hint: "Use elif for the second condition.",
    availableBlocks: ["score = 80", "if", "score > 90", ":", "print('A')", "elif", "score > 70", ":", "print('B')"]
  },
  {
    id: 12,
    section: "Mission 2: Decision Making",
    title: "Mission 2 Quiz",
    category: "Quiz",
    theory: "### Quiz\nTest your knowledge of loops and conditions.",
    task: "Print 'Go' 2 times using a for loop and range(2).",
    expectedOutput: "Go\nGo",
    hint: "for loop with range(2)",
    availableBlocks: ["for", "x", "in", "range(2)", ":", "print('Go')", "print('Stop')"]
  },

  // --- MISSION 3: FUNCTIONS ---
  {
    id: 13,
    section: "Mission 3: Functions",
    title: "Variable Scope",
    category: "Functions",
    theory: "### Scope\nVariables inside a function are 'local'. Variables outside are 'global'.",
    task: "Define a function that sets x = 5 and prints x. Call it.",
    expectedOutput: "5",
    hint: "Define, indent content, then call.",
    availableBlocks: ["def", "my_func():", "x = 5", "print(x)", "my_func()"]
  },
  {
    id: 14,
    section: "Mission 3: Functions",
    title: "Function Arguments",
    category: "Functions",
    theory: "### Arguments\nYou can pass data into functions. `def add(a, b):`",
    task: "Define function `greet(name)` that prints 'Hello ' + name. Call `greet('Sam')`.",
    expectedOutput: "Hello Sam",
    hint: "Use the parameter inside the print.",
    availableBlocks: ["def", "greet(name):", "print(", "'Hello '", "+", "name", ")", "greet('Sam')"]
  },
  {
    id: 15,
    section: "Mission 3: Functions",
    title: "Anonymous Function",
    category: "Functions",
    theory: "### Lambda\nA short, one-line function. `lambda x: x + 1`",
    task: "Create a lambda `add = lambda x: x + 5`. Print `add(10)`.",
    expectedOutput: "15",
    hint: "Assign lambda to a variable then call it.",
    availableBlocks: ["add =", "lambda x:", "x + 5", "print(", "add(10)", ")"]
  },
  {
    id: 16,
    section: "Mission 3: Functions",
    title: "Recursion",
    category: "Functions",
    theory: "### Recursion\nA function that calls itself.",
    task: "Write a recursive function to print 'A' once. (Simulated for block logic). Just Call a function `rec()` that prints 'A'.",
    expectedOutput: "A",
    hint: "Just define and call for this simple test.",
    availableBlocks: ["def", "rec():", "print('A')", "rec()"]
  },
  {
    id: 17,
    section: "Mission 3: Functions",
    title: "Mission 3 Quiz",
    category: "Quiz",
    theory: "### Quiz\nCombine functions and arguments.",
    task: "Define `square(n)` that prints `n * n`. Call `square(4)`.",
    expectedOutput: "16",
    hint: "Math inside the function.",
    availableBlocks: ["def", "square(n):", "print(n * n)", "square(4)", "square(2)"]
  },

  // --- MISSION 4: COLLECTIONS ---
  {
    id: 18,
    section: "Mission 4: Collection Data Type",
    title: "Lists",
    category: "Collections",
    theory: "### Lists\nOrdered collection. `[1, 2, 3]`",
    task: "Create a list `nums = [1, 2]`. Print `nums[0]`.",
    expectedOutput: "1",
    hint: "Index 0 is the first item.",
    availableBlocks: ["nums =", "[1, 2]", "print(", "nums[0]", ")", "nums[1]"]
  },
  {
    id: 19,
    section: "Mission 4: Collection Data Type",
    title: "Tuples",
    category: "Collections",
    theory: "### Tuples\nLike lists but unchangeable (immutable). Uses `()`.",
    task: "Create `tup = (10, 20)`. Print `tup[1]`.",
    expectedOutput: "20",
    hint: "Use parentheses.",
    availableBlocks: ["tup =", "(10, 20)", "print(", "tup[1]", ")"]
  },
  {
    id: 20,
    section: "Mission 4: Collection Data Type",
    title: "Strings (Advanced)",
    category: "Collections",
    theory: "### Strings\nStrings are arrays of characters. You can slice them.",
    task: "Print the first letter of 'Python' using index 0.",
    expectedOutput: "P",
    hint: "String indices works like lists.",
    availableBlocks: ["text =", "'Python'", "print(", "text[0]", ")"]
  },
  {
    id: 21,
    section: "Mission 4: Collection Data Type",
    title: "Sets",
    category: "Collections",
    theory: "### Sets\nUnordered, unique items. `{1, 2}`.",
    task: "Create a set `s = {1, 1, 2}`. Print `s`. (Note duplicates are removed).",
    expectedOutput: "{1, 2}",
    hint: "Use curly braces.",
    availableBlocks: ["s =", "{1, 1, 2}", "print(", "s", ")"]
  },
  {
    id: 22,
    section: "Mission 4: Collection Data Type",
    title: "Dictionaries",
    category: "Collections",
    theory: "### Dictionaries\nKey-Value pairs. `{'key': 'value'}`.",
    task: "Create `d = {'a': 1}`. Print `d['a']`.",
    expectedOutput: "1",
    hint: "Access by key.",
    availableBlocks: ["d =", "{'a': 1}", "print(", "d['a']", ")"]
  },
  {
    id: 23,
    section: "Mission 4: Collection Data Type",
    title: "Mission 4 Quiz",
    category: "Quiz",
    theory: "### Quiz\nTest your collection knowledge.",
    task: "Create a list `x = [5, 6]`. Change index 0 to 9. Print x.",
    expectedOutput: "[9, 6]",
    hint: "Assign to the index.",
    availableBlocks: ["x =", "[5, 6]", "x[0] = 9", "print(x)", "x[1] = 9"]
  },

  // --- MISSION 5: MODULES AND FILES ---
  {
    id: 24,
    section: "Mission 5: Modules and Files",
    title: "Modules",
    category: "Modules",
    theory: "### Modules\nLibraries of code. `import math`.",
    task: "Import math and print `math.sqrt(16)`.",
    expectedOutput: "4.0",
    hint: "Use import first.",
    availableBlocks: ["import math", "print(", "math.sqrt(16)", ")"]
  },
  {
    id: 25,
    section: "Mission 5: Modules and Files",
    title: "Files",
    category: "IO",
    theory: "### Files\n`open('file.txt', 'w')` to write.",
    task: "Simulate writing: Print 'Writing to file...'.",
    expectedOutput: "Writing to file...",
    hint: "We simulate file ops with print for now.",
    availableBlocks: ["print('Writing to file...')", "f = open('test.txt')", "f.write('Hi')"]
  },
  {
    id: 26,
    section: "Mission 5: Modules and Files",
    title: "Directory",
    category: "IO",
    theory: "### OS Module\nUse `os` to interact with directories.",
    task: "Import os. Print 'os.getcwd()' (Simulated output: /home).",
    expectedOutput: "/home",
    hint: "Combine the strings to simulate output.",
    availableBlocks: ["import os", "print('/home')", "os.getcwd()"]
  },
  {
    id: 27,
    section: "Mission 5: Modules and Files",
    title: "Mission 5 Quiz",
    category: "Quiz",
    theory: "### Quiz\nModules check.",
    task: "Import random. Print 'Random Number'.",
    expectedOutput: "Random Number",
    hint: "Just printing a string placeholder.",
    availableBlocks: ["import random", "print('Random Number')", "random.randint(1,10)"]
  },

  // --- MISSION 6: EXCEPTION HANDLING ---
  {
    id: 28,
    section: "Mission 6: Exception Handling",
    title: "Exceptions",
    category: "Errors",
    theory: "### Errors\nWhen code fails, it raises an Exception. e.g., Dividing by zero.",
    task: "Print 'Error' to simulate an exception caught.",
    expectedOutput: "Error",
    hint: "Simulate the output.",
    availableBlocks: ["print('Error')", "1 / 0", "raise Exception"]
  },
  {
    id: 29,
    section: "Mission 6: Exception Handling",
    title: "Exception Handling",
    category: "Errors",
    theory: "### Try / Except\nCatch errors gracefully.",
    task: "Try to divide 1/0. Except: print 'Cannot divide'.",
    expectedOutput: "Cannot divide",
    hint: "Use try/except blocks.",
    availableBlocks: ["try:", "x = 1 / 0", "except:", "print('Cannot divide')"]
  },
  {
    id: 30,
    section: "Mission 6: Exception Handling",
    title: "Custom Exceptions",
    category: "Errors",
    theory: "### Raising Errors\nYou can trigger your own errors using `raise`.",
    task: "Raise a ValueError. (Simulated output: 'ValueError Raised').",
    expectedOutput: "ValueError Raised",
    hint: "Just print the simulation string.",
    availableBlocks: ["print('ValueError Raised')", "raise ValueError"]
  },
  {
    id: 31,
    section: "Mission 6: Exception Handling",
    title: "Mission 6 Quiz",
    category: "Quiz",
    theory: "### Quiz\nHandle an error.",
    task: "Try printing variable 'y' (undefined). Except: print 'Not Found'.",
    expectedOutput: "Not Found",
    hint: "try/except structure.",
    availableBlocks: ["try:", "print(y)", "except:", "print('Not Found')"]
  },

  // --- MISSION 7: OOP ---
  {
    id: 32,
    section: "Mission 7: Object-Oriented Programming",
    title: "Class and Objects",
    category: "OOP",
    theory: "### Classes\nA blueprint for objects. `class Dog:`",
    task: "Define class Dog with a pass. Print 'Dog class created'.",
    expectedOutput: "Dog class created",
    hint: "Define class then print.",
    availableBlocks: ["class Dog:", "pass", "print('Dog class created')"]
  },
  {
    id: 33,
    section: "Mission 7: Object-Oriented Programming",
    title: "Constructors",
    category: "OOP",
    theory: "### __init__\nThe constructor method initializes the object.",
    task: "Define class with `__init__` that prints 'Init'. Create object.",
    expectedOutput: "Init",
    hint: "Define class, init, then instantiate.",
    availableBlocks: ["class A:", "def __init__(self):", "print('Init')", "a = A()"]
  },
  {
    id: 34,
    section: "Mission 7: Object-Oriented Programming",
    title: "Inheritance",
    category: "OOP",
    theory: "### Inheritance\nChild classes inherit from Parent classes.",
    task: "Class B inherits from A. A has method `hi()`. Call `B().hi()`.",
    expectedOutput: "Hi",
    hint: "Class B(A):",
    availableBlocks: ["class A:", "def hi(self): print('Hi')", "class B(A): pass", "b = B()", "b.hi()"]
  },
  {
    id: 35,
    section: "Mission 7: Object-Oriented Programming",
    title: "Namespaces",
    category: "OOP",
    theory: "### Namespaces\nScope of variables within classes.",
    task: "Set class variable `x=1`. Print `MyClass.x`.",
    expectedOutput: "1",
    hint: "Access variable via class name.",
    availableBlocks: ["class MyClass:", "x = 1", "print(MyClass.x)"]
  },
  {
    id: 36,
    section: "Mission 7: Object-Oriented Programming",
    title: "Mission 7 Quiz",
    category: "Quiz",
    theory: "### Quiz\nOOP Concepts.",
    task: "Create object `p = Person()`. Print 'Person created'.",
    expectedOutput: "Person created",
    hint: "Simulate object creation output.",
    availableBlocks: ["class Person: pass", "p = Person()", "print('Person created')"]
  },

  // --- MISSION 8: ADVANCED ---
  {
    id: 37,
    section: "Mission 8: Advanced Topics",
    title: "Iterators",
    category: "Advanced",
    theory: "### Iterators\nObjects that can be looped over using `next()`.",
    task: "Create iterator for list [1, 2]. Print next(it).",
    expectedOutput: "1",
    hint: "Use iter() then next().",
    availableBlocks: ["it = iter([1, 2])", "print(next(it))"]
  },
  {
    id: 38,
    section: "Mission 8: Advanced Topics",
    title: "Generators",
    category: "Advanced",
    theory: "### Generators\nFunctions that `yield` values one by one.",
    task: "Define gen that yields 5. Print next(gen()).",
    expectedOutput: "5",
    hint: "Use yield keyword.",
    availableBlocks: ["def gen():", "yield 5", "print(next(gen()))"]
  },
  {
    id: 39,
    section: "Mission 8: Advanced Topics",
    title: "Closures",
    category: "Advanced",
    theory: "### Closures\nA nested function that remembers outside variables.",
    task: "Define outer function returning inner function that prints 'Secret'. Call it.",
    expectedOutput: "Secret",
    hint: "Nested def.",
    availableBlocks: ["def outer():", "def inner(): print('Secret')", "return inner", "fn = outer()", "fn()"]
  },
  {
    id: 40,
    section: "Mission 8: Advanced Topics",
    title: "Decorators",
    category: "Advanced",
    theory: "### Decorators\nWrappers that modify function behavior. `@my_decorator`.",
    task: "Use @dec on func. (Simulate output 'Decorated').",
    expectedOutput: "Decorated",
    hint: "Print the simulation.",
    availableBlocks: ["@dec", "def func(): pass", "print('Decorated')"]
  },
  {
    id: 41,
    section: "Mission 8: Advanced Topics",
    title: "Python @property",
    category: "Advanced",
    theory: "### @property\nTreats a method like a variable.",
    task: "Define class with @property name returning 'Bob'. Print obj.name.",
    expectedOutput: "Bob",
    hint: "Use @property decorator.",
    availableBlocks: ["class P:", "@property", "def name(self): return 'Bob'", "obj = P()", "print(obj.name)"]
  },
  {
    id: 42,
    section: "Mission 8: Advanced Topics",
    title: "Mission 8 Quiz",
    category: "Quiz",
    theory: "### Quiz\nAdvanced Final.",
    task: "Create a generator that yields 'End'. Print it.",
    expectedOutput: "End",
    hint: "yield + next.",
    availableBlocks: ["def g(): yield 'End'", "print(next(g()))"]
  }
];


export interface Mission {
  id: number;
  section: string; // e.g. "Mission 1: Introduction"
  title: string;   // e.g. "Variables & Literals"
  category: string;
  theory: string;  // Markdown content
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
    theory: "### Variables\nIn coding, a **variable** is like a box where you store information. You give the box a name (like `score` or `playerName`) and put data inside it.\n\n### Literals\nA **literal** is the raw data itself, like the number `10` or the text `'Hello'`.",
    task: "Create a variable named 'hero' and assign it the value 'SuperBot'. Then print the hero variable.",
    expectedOutput: "SuperBot",
    hint: "Use the assignment block (=) and then the print block.",
    availableBlocks: ["hero", "=", "'SuperBot'", "print(", ")"]
  },
  {
    id: 1,
    section: "Mission 1: Introduction",
    title: "Input and Output",
    category: "Basics",
    theory: "### Input & Output\nComputers need to talk to humans!\n* **Output:** The computer showing you something (using `print`).\n* **Input:** The computer asking you for something.",
    task: "Print the phrase 'Hello World' to the console.",
    expectedOutput: "Hello World",
    hint: "Just use the print block with the text string.",
    availableBlocks: ["print(", "'Hello World'", ")", "'Welcome'", "input("]
  },
  {
    id: 2,
    section: "Mission 1: Introduction",
    title: "Operations",
    category: "Math",
    theory: "### Math Operations\nComputers are great calculators.\n* `+` Adds\n* `-` Subtracts\n* `*` Multiplies\n* `/` Divides",
    task: "Calculate 5 plus 3 and print the result.",
    expectedOutput: "8",
    hint: "Combine the numbers with the + symbol inside the print statement.",
    availableBlocks: ["print(", "5", "+", "3", ")", "10", "-"]
  },

  // --- MISSION 2: DECISION MAKING ---
  {
    id: 3,
    section: "Mission 2: Decision Making",
    title: "Boolean Expressions",
    category: "Logic",
    theory: "### Booleans\nA **Boolean** is a value that can only be `True` or `False`. It's like a light switch.\n\nWe compare things using:\n* `>` Greater than\n* `<` Less than\n* `==` Equal to",
    task: "Check if 10 is greater than 5. Print the result.",
    expectedOutput: "True",
    hint: "Use the > symbol inside print.",
    availableBlocks: ["print(", "10", ">", "5", ")", "<", "=="]
  },
  {
    id: 4,
    section: "Mission 2: Decision Making",
    title: "If Else Statement",
    category: "Logic",
    theory: "### If / Else\nThis allows the code to make decisions.\n\n`if condition:` -> Do this if true.\n`else:` -> Do this if false.",
    task: "Write logic: If 5 > 2, print 'Yes'.",
    expectedOutput: "Yes",
    hint: "Start with the 'if' block.",
    availableBlocks: ["if", "5", ">", "2", ":", "print(", "'Yes'", ")", "else:"]
  },
  {
    id: 5,
    section: "Mission 2: Decision Making",
    title: "While Loops",
    category: "Loops",
    theory: "### While Loops\nA `while` loop keeps running code over and over again **as long as** a condition is True.",
    task: "Create a loop that runs while x < 3. (Assume x starts at 0 and increases). Print 'Looping'.",
    expectedOutput: "Looping\nLooping\nLooping",
    hint: "You need a 'while' block and a condition.",
    availableBlocks: ["x = 0", "while", "x", "<", "3", ":", "print('Looping')", "x = x + 1"]
  },

  // --- MISSION 3: FUNCTIONS ---
  {
    id: 6,
    section: "Mission 3: Functions",
    title: "Defining Functions",
    category: "Functions",
    theory: "### Functions\nA function is a reusable block of code. You define it once using `def`, and call it many times.",
    task: "Define a function named `greet` that prints 'Hi'. Call the function.",
    expectedOutput: "Hi",
    hint: "Use 'def' to start.",
    availableBlocks: ["def", "greet():", "print('Hi')", "greet()"]
  },

  // --- MISSION 4: COLLECTIONS ---
  {
    id: 7,
    section: "Mission 4: Collection Data Type",
    title: "Lists",
    category: "Data",
    theory: "### Lists\nA list holds multiple items in order. `fruits = ['apple', 'banana']`.",
    task: "Create a list of numbers [1, 2, 3] and print it.",
    expectedOutput: "[1, 2, 3]",
    hint: "Use square brackets [ ].",
    availableBlocks: ["nums =", "[1, 2, 3]", "print(", "nums", ")"]
  }
  
  // Note: Add remaining missions (5-8) following this pattern...
];

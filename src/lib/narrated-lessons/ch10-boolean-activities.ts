/**
 * Student-safe Chapter 10 (Boolean Logic) slide-mapped activities.
 * Teacher reference code and full expected truth-table arrays are intentionally excluded.
 */
import type { LogicCircuitNetlist, LogicGateNode } from '@/lib/boolean-logic/circuit-engine';

export interface Ch10BooleanActivity {
  id: string;
  lessonId: string;
  afterSlideId: string;
  title: string;
  task: string;
  inputs: string[];
  gates: LogicGateNode[];
  output: string;
  pythonStarter: string;
  pseudocodeStarter: string;
  sqlStarter: string;
  publicSample: { stdin: string; expectedStdout: string };
}

export const CH10_BOOLEAN_ACTIVITIES: readonly Ch10BooleanActivity[] = [
  {
    "id": "igcse-cs-boolean-logic-a-s01",
    "lessonId": "igcse-cs-boolean-logic-a",
    "afterSlideId": "s01",
    "title": "Binary signals and logic",
    "task": "Build or code the Boolean logic circuit for \"Binary signals and logic\" with inputs A and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A"
    ],
    "gates": [
      {
        "id": "Y",
        "op": "NOT",
        "inputs": [
          "A"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-a-s02",
    "lessonId": "igcse-cs-boolean-logic-a",
    "afterSlideId": "s02",
    "title": "NOT gate",
    "task": "Build or code the Boolean logic circuit for \"NOT gate\" with inputs A and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A"
    ],
    "gates": [
      {
        "id": "Y",
        "op": "NOT",
        "inputs": [
          "A"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-a-s03",
    "lessonId": "igcse-cs-boolean-logic-a",
    "afterSlideId": "s03",
    "title": "AND gate",
    "task": "Build or code the Boolean logic circuit for \"AND gate\" with inputs A, B and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B"
    ],
    "gates": [
      {
        "id": "Y",
        "op": "AND",
        "inputs": [
          "A",
          "B"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "1\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-a-s04",
    "lessonId": "igcse-cs-boolean-logic-a",
    "afterSlideId": "s04",
    "title": "OR gate",
    "task": "Build or code the Boolean logic circuit for \"OR gate\" with inputs A, B and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B"
    ],
    "gates": [
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "A",
          "B"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-a-s05",
    "lessonId": "igcse-cs-boolean-logic-a",
    "afterSlideId": "s05",
    "title": "NAND gate",
    "task": "Build or code the Boolean logic circuit for \"NAND gate\" with inputs A, B and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B"
    ],
    "gates": [
      {
        "id": "Y",
        "op": "NAND",
        "inputs": [
          "A",
          "B"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-a-s06",
    "lessonId": "igcse-cs-boolean-logic-a",
    "afterSlideId": "s06",
    "title": "NOR gate",
    "task": "Build or code the Boolean logic circuit for \"NOR gate\" with inputs A, B and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B"
    ],
    "gates": [
      {
        "id": "Y",
        "op": "NOR",
        "inputs": [
          "A",
          "B"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-a-s07",
    "lessonId": "igcse-cs-boolean-logic-a",
    "afterSlideId": "s07",
    "title": "XOR gate",
    "task": "Build or code the Boolean logic circuit for \"XOR gate\" with inputs A, B and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B"
    ],
    "gates": [
      {
        "id": "Y",
        "op": "XOR",
        "inputs": [
          "A",
          "B"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-a-s08",
    "lessonId": "igcse-cs-boolean-logic-a",
    "afterSlideId": "s08",
    "title": "Compare and identify gates",
    "task": "Build or code the Boolean logic circuit for \"Compare and identify gates\" with inputs A, B and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B"
    ],
    "gates": [
      {
        "id": "Y",
        "op": "XOR",
        "inputs": [
          "A",
          "B"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s01",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s01",
    "title": "Trace intermediate outputs",
    "task": "Build or code the Boolean logic circuit for \"Trace intermediate outputs\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "OR",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "E",
        "op": "NOT",
        "inputs": [
          "C"
        ]
      },
      {
        "id": "Y",
        "op": "AND",
        "inputs": [
          "D",
          "E"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1\n0",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s02",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s02",
    "title": "Read a circuit as an expression",
    "task": "Build or code the Boolean logic circuit for \"Read a circuit as an expression\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NOT",
        "inputs": [
          "B"
        ]
      },
      {
        "id": "E",
        "op": "AND",
        "inputs": [
          "D",
          "C"
        ]
      },
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "A",
          "E"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s03",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s03",
    "title": "Trace a four-gate circuit",
    "task": "Build or code the Boolean logic circuit for \"Trace a four-gate circuit\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NAND",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "E",
        "op": "NOT",
        "inputs": [
          "B"
        ]
      },
      {
        "id": "F",
        "op": "XOR",
        "inputs": [
          "D",
          "E"
        ]
      },
      {
        "id": "Y",
        "op": "AND",
        "inputs": [
          "F",
          "C"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE F : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s04",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s04",
    "title": "Truth table to one product",
    "task": "Build or code the Boolean logic circuit for \"Truth table to one product\" with inputs A, B and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NOT",
        "inputs": [
          "A"
        ]
      },
      {
        "id": "Y",
        "op": "AND",
        "inputs": [
          "D",
          "B"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s05",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s05",
    "title": "Sum of products",
    "task": "Build or code the Boolean logic circuit for \"Sum of products\" with inputs A, B and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NOT",
        "inputs": [
          "A"
        ]
      },
      {
        "id": "E",
        "op": "AND",
        "inputs": [
          "D",
          "B"
        ]
      },
      {
        "id": "F",
        "op": "AND",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "E",
          "F"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE F : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s06",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s06",
    "title": "Three-input truth table synthesis",
    "task": "Build or code the Boolean logic circuit for \"Three-input truth table synthesis\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NOT",
        "inputs": [
          "A"
        ]
      },
      {
        "id": "E",
        "op": "NOT",
        "inputs": [
          "B"
        ]
      },
      {
        "id": "F",
        "op": "AND",
        "inputs": [
          "D",
          "E"
        ]
      },
      {
        "id": "G",
        "op": "AND",
        "inputs": [
          "F",
          "C"
        ]
      },
      {
        "id": "H",
        "op": "AND",
        "inputs": [
          "A",
          "E"
        ]
      },
      {
        "id": "I",
        "op": "AND",
        "inputs": [
          "H",
          "C"
        ]
      },
      {
        "id": "J",
        "op": "AND",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "K",
        "op": "AND",
        "inputs": [
          "J",
          "C"
        ]
      },
      {
        "id": "L",
        "op": "OR",
        "inputs": [
          "G",
          "I"
        ]
      },
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "L",
          "K"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE F : BOOLEAN\nDECLARE G : BOOLEAN\nDECLARE H : BOOLEAN\nDECLARE I : BOOLEAN\nDECLARE J : BOOLEAN\nDECLARE K : BOOLEAN\nDECLARE L : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s07",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s07",
    "title": "Simplify by grouping rows",
    "task": "Build or code the Boolean logic circuit for \"Simplify by grouping rows\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NOT",
        "inputs": [
          "B"
        ]
      },
      {
        "id": "E",
        "op": "AND",
        "inputs": [
          "D",
          "C"
        ]
      },
      {
        "id": "F",
        "op": "AND",
        "inputs": [
          "A",
          "C"
        ]
      },
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "E",
          "F"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE F : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s08",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s08",
    "title": "Expression to circuit",
    "task": "Build or code the Boolean logic circuit for \"Expression to circuit\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "AND",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "E",
        "op": "AND",
        "inputs": [
          "A",
          "C"
        ]
      },
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "D",
          "E"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "1\n0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-b-s09",
    "lessonId": "igcse-cs-boolean-logic-b",
    "afterSlideId": "s09",
    "title": "Nested expressions",
    "task": "Build or code the Boolean logic circuit for \"Nested expressions\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "AND",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "E",
        "op": "NOT",
        "inputs": [
          "C"
        ]
      },
      {
        "id": "F",
        "op": "OR",
        "inputs": [
          "D",
          "E"
        ]
      },
      {
        "id": "G",
        "op": "NOR",
        "inputs": [
          "B",
          "C"
        ]
      },
      {
        "id": "Y",
        "op": "XOR",
        "inputs": [
          "F",
          "G"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE F : BOOLEAN\nDECLARE G : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1\n0",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-c-s01",
    "lessonId": "igcse-cs-boolean-logic-c",
    "afterSlideId": "s01",
    "title": "Translate sensor definitions",
    "task": "Build or code the Boolean logic circuit for \"Translate sensor definitions\" with inputs A, T, P and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "T",
      "P"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NOT",
        "inputs": [
          "T"
        ]
      },
      {
        "id": "E",
        "op": "NOT",
        "inputs": [
          "A"
        ]
      },
      {
        "id": "F",
        "op": "AND",
        "inputs": [
          "P",
          "D"
        ]
      },
      {
        "id": "G",
        "op": "AND",
        "inputs": [
          "T",
          "E"
        ]
      },
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "F",
          "G"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nT = input(\"T (0 or 1): \") == \"1\"\nP = input(\"P (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE T : BOOLEAN\nDECLARE P : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE F : BOOLEAN\nDECLARE G : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT T\nINPUT P\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-c-s02",
    "lessonId": "igcse-cs-boolean-logic-c",
    "afterSlideId": "s02",
    "title": "Greenhouse alarm",
    "task": "Build or code the Boolean logic circuit for \"Greenhouse alarm\" with inputs M, T, H and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "M",
      "T",
      "H"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NOT",
        "inputs": [
          "M"
        ]
      },
      {
        "id": "E",
        "op": "NOT",
        "inputs": [
          "H"
        ]
      },
      {
        "id": "F",
        "op": "AND",
        "inputs": [
          "D",
          "E"
        ]
      },
      {
        "id": "G",
        "op": "AND",
        "inputs": [
          "T",
          "H"
        ]
      },
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "F",
          "G"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nM = input(\"M (0 or 1): \") == \"1\"\nT = input(\"T (0 or 1): \") == \"1\"\nH = input(\"H (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE M : BOOLEAN\nDECLARE T : BOOLEAN\nDECLARE H : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE F : BOOLEAN\nDECLARE G : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT M\nINPUT T\nINPUT H\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0\n0",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-c-s03",
    "lessonId": "igcse-cs-boolean-logic-c",
    "afterSlideId": "s03",
    "title": "Design a school access rule",
    "task": "Build or code the Boolean logic circuit for \"Design a school access rule\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "AND",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "Y",
        "op": "OR",
        "inputs": [
          "D",
          "C"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-c-s04",
    "lessonId": "igcse-cs-boolean-logic-c",
    "afterSlideId": "s04",
    "title": "Examination circuit tracing",
    "task": "Build or code the Boolean logic circuit for \"Examination circuit tracing\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "NOT",
        "inputs": [
          "A"
        ]
      },
      {
        "id": "E",
        "op": "AND",
        "inputs": [
          "D",
          "B"
        ]
      },
      {
        "id": "F",
        "op": "NOR",
        "inputs": [
          "A",
          "C"
        ]
      },
      {
        "id": "Y",
        "op": "NAND",
        "inputs": [
          "E",
          "F"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE F : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n0\n0",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-c-s05",
    "lessonId": "igcse-cs-boolean-logic-c",
    "afterSlideId": "s05",
    "title": "Examination synthesis and checking",
    "task": "Build or code the Boolean logic circuit for \"Examination synthesis and checking\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "XOR",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "Y",
        "op": "AND",
        "inputs": [
          "D",
          "C"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "0\n1\n1",
      "expectedStdout": "1"
    }
  },
  {
    "id": "igcse-cs-boolean-logic-c-s06",
    "lessonId": "igcse-cs-boolean-logic-c",
    "afterSlideId": "s06",
    "title": "Independent design and verification",
    "task": "Build or code the Boolean logic circuit for \"Independent design and verification\" with inputs A, B, C and output Y. Print 1 for TRUE or 0 for FALSE.",
    "inputs": [
      "A",
      "B",
      "C"
    ],
    "gates": [
      {
        "id": "D",
        "op": "AND",
        "inputs": [
          "A",
          "B"
        ]
      },
      {
        "id": "E",
        "op": "NOT",
        "inputs": [
          "C"
        ]
      },
      {
        "id": "Y",
        "op": "AND",
        "inputs": [
          "D",
          "E"
        ]
      }
    ],
    "output": "Y",
    "pythonStarter": "# Read each input as 0 or 1. Convert to Boolean.\nA = input(\"A (0 or 1): \") == \"1\"\nB = input(\"B (0 or 1): \") == \"1\"\nC = input(\"C (0 or 1): \") == \"1\"\n# TODO: calculate the intermediate signals and output.",
    "pseudocodeStarter": "DECLARE A : BOOLEAN\nDECLARE B : BOOLEAN\nDECLARE C : BOOLEAN\nDECLARE D : BOOLEAN\nDECLARE E : BOOLEAN\nDECLARE Y : BOOLEAN\nINPUT A\nINPUT B\nINPUT C\n// TODO: calculate intermediate signals and output.",
    "sqlStarter": "-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;",
    "publicSample": {
      "stdin": "1\n1\n0",
      "expectedStdout": "1"
    }
  }
];

export function getCh10ActivitiesForLesson(lessonId: string): Ch10BooleanActivity[] {
  const id = (lessonId || '').toLowerCase();
  return CH10_BOOLEAN_ACTIVITIES.filter((a) => a.lessonId === id);
}

export function getCh10ActivityForSlide(lessonId: string, slideId?: string): Ch10BooleanActivity | null {
  if (!slideId) return null;
  const id = (lessonId || '').toLowerCase();
  return CH10_BOOLEAN_ACTIVITIES.find((a) => a.lessonId === id && a.afterSlideId === slideId) ?? null;
}

export function toNetlist(activity: Ch10BooleanActivity): LogicCircuitNetlist {
  return { inputs: activity.inputs, gates: activity.gates, output: activity.output };
}

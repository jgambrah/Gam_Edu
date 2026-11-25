/**
 * Student-safe Chapter 11 V4 inline workshop activities (mapped by lessonId + afterSlideId).
 * Teacher references, worked pseudocode listings, and hidden grading tests are intentionally excluded.
 */

export type WorkshopLanguage = 'python' | 'pseudocode' | 'sql';

export interface PublicSampleTest {
  stdin: string;
  expectedStdout: string;
}

export interface InlineWorkshopActivity {
  id: string;
  lessonId: string;
  afterSlideId: string;
  title: string;
  task: string;
  languages: WorkshopLanguage[];
  pythonStarter?: string;
  pseudocodeStarter?: string;
  sqlStarter?: string;
  publicTests: PublicSampleTest[];
  expectedSqlRows?: (string | number | null)[][];
  pseudocodeNote?: string;
}

export const CH11_WORKSHOP_ACTIVITIES: readonly InlineWorkshopActivity[] = [
  {
    "id": "ch11-calculator",
    "lessonId": "igcse-cs-scenarios-a",
    "afterSlideId": "s05",
    "title": "Calculator",
    "task": "Read two integers and an operator on separate lines (first integer, operator, second integer). Print result or Invalid operation. Powers: 0–10, not 0^0.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "8\n+\n3",
        "expectedStdout": "11"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-fare",
    "lessonId": "igcse-cs-scenarios-a",
    "afterSlideId": "s07",
    "title": "Bus fare",
    "task": "Read an integer age; print fare 2 (5–12), 3 (13–17), 5 (18–100), or Invalid.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "4",
        "expectedStdout": "Invalid"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-word",
    "lessonId": "igcse-cs-scenarios-b",
    "afterSlideId": "s04",
    "title": "Word guessing",
    "task": "Read an uppercase five-letter secret, then ten pairs of uppercase letter and five-letter guess, stopping on a win. Print matching one-based positions separated by spaces or Absent, then Won N or Lost SECRET.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "LEVEL\nE\nLEVEL",
        "expectedStdout": "2 4\nWon 1"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-sales",
    "lessonId": "igcse-cs-scenarios-b",
    "afterSlideId": "s08",
    "title": "Sales menu",
    "task": "Read three price-in-pesewas / quantity pairs (one integer per line), then menu 1 units, 2 revenue in pesewas, 3 types below 10, 4 types at least 10. Inputs nonnegative; print Invalid for other choices.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "200\n5\n800\n10\n300\n0\n1",
        "expectedStdout": "15"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-move",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s01",
    "title": "Bounded movement",
    "task": "Read X, Y and direction. Valid starting coordinates 0–200, 0–150. Print final coordinates separated by space; invalid direction prints Invalid.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "200\n150\nright",
        "expectedStdout": "200 150"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-guess",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s02",
    "title": "Number guessing",
    "task": "Secret 42. Read guesses until correct or ten valid attempts. Ignore out-of-range integers. Print Too high/Too low, Won N or Lost 42.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "0\n30\n50\n42",
        "expectedStdout": "Too low\nToo high\nWon 3"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-hex",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s03",
    "title": "Hex conversion",
    "task": "Read exactly two uppercase hexadecimal digits. Print denary and eight binary digits separated by a space; invalid input prints Invalid.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "00",
        "expectedStdout": "0 00000000"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-threshold",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s04",
    "title": "Cost threshold",
    "task": "Read positive integer rate in pesewas per kg, then positive integer kg weights until total reaches 10000 pesewas. Print count and total pesewas.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "2500\n2\n2",
        "expectedStdout": "2 10000"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-register",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s05",
    "title": "Fictional registration",
    "task": "Existing username Ama. Read proposed username and fictional practice token. Token needs at least eight characters, ASCII letter and digit. Print Accepted or Rejected. Never enter real credentials.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "Kojo\nDemo1234",
        "expectedStdout": "Accepted"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-rps",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s06",
    "title": "Rock paper scissors",
    "task": "Read two valid lowercase moves. Print 0 draw, 1 first player wins, 2 second player wins.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "rock\nrock",
        "expectedStdout": "0"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-divisibility",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s07",
    "title": "Divisibility",
    "task": "Read positive N. Print each applicable pair i divisor, in ascending i order, divisor 5 before 7.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "1",
        "expectedStdout": ""
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-stats",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s09",
    "title": "Cost statistics",
    "task": "Read 100 nonnegative integer costs. Print total, average (Python numeric format), minimum, maximum.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n",
        "expectedStdout": "100 1.0 1 1"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-words",
    "lessonId": "igcse-cs-scenarios-c",
    "afterSlideId": "s10",
    "title": "Word analysis",
    "task": "Read 1000 nonempty words then menu 1 count length >=5, 2 longest, 3 shortest. First occurrence wins ties.",
    "languages": [
      "python",
      "pseudocode"
    ],
    "pythonStarter": "# Write your solution here.\n",
    "pseudocodeStarter": "// Declare variables and write your algorithm here.\n",
    "publicTests": [
      {
        "stdin": "cat\nLEVEL\nAPPLE\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\n1",
        "expectedStdout": "2"
      }
    ],
    "pseudocodeNote": "Teacher review until editor supports verified Cambridge semantics; worked listing may use different I/O or units; do not apply Python stdout tests blindly."
  },
  {
    "id": "ch11-sql-units",
    "lessonId": "igcse-cs-scenarios-b",
    "afterSlideId": "s08",
    "title": "Optional database extension",
    "task": "Return total units sold.",
    "languages": [
      "sql"
    ],
    "sqlStarter": "SELECT ",
    "publicTests": [],
    "expectedSqlRows": [
      [
        15
      ]
    ]
  },
  {
    "id": "ch11-sql-revenue",
    "lessonId": "igcse-cs-scenarios-b",
    "afterSlideId": "s08",
    "title": "Optional database extension",
    "task": "Return total revenue in pesewas.",
    "languages": [
      "sql"
    ],
    "sqlStarter": "SELECT ",
    "publicTests": [],
    "expectedSqlRows": [
      [
        9000
      ]
    ]
  },
  {
    "id": "ch11-sql-low",
    "lessonId": "igcse-cs-scenarios-b",
    "afterSlideId": "s08",
    "title": "Optional database extension",
    "task": "Return number of product types with quantity below 10.",
    "languages": [
      "sql"
    ],
    "sqlStarter": "SELECT ",
    "publicTests": [],
    "expectedSqlRows": [
      [
        2
      ]
    ]
  }
];

export function getWorkshopActivitiesForLesson(lessonId: string): InlineWorkshopActivity[] {
  return CH11_WORKSHOP_ACTIVITIES.filter((a) => a.lessonId === lessonId);
}

export function getWorkshopActivitiesForSlide(lessonId: string, slideId: string): InlineWorkshopActivity[] {
  return CH11_WORKSHOP_ACTIVITIES.filter((a) => a.lessonId === lessonId && a.afterSlideId === slideId);
}

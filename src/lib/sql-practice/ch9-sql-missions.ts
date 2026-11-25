import { executeIgcseSql, type SqlExecutionResult, type SqlValue } from './igcse-sql-engine';

export type Ch9SqlPart = 'a' | 'b' | 'transfer';

export interface Ch9SqlMission {
  id: string;
  part: Ch9SqlPart;
  partLabel: string;
  title: string;
  table: 'Stock' | 'Equipment';
  marks: number;
  prompt: string;
  hint: string;
  starterSql: string;
  /** Expected output columns (case-insensitive check; omit for single aggregate cell). */
  expectedColumns?: string[];
  /** Expected result rows. */
  expectedRows: SqlValue[][];
  /** If true, row order must match exactly (e.g. ORDER BY). If false, any row order is accepted. */
  orderMatters?: boolean;
  /** If true, ties on the first sort column may appear in either order (Part B Q1). */
  allowTieSwap?: boolean;
  /** Required SQL keywords (case-insensitive) so students use the target SQL feature. */
  requiredKeywords?: string[];
}

export const CH9_SQL_MISSIONS: Ch9SqlMission[] = [
  // ================= PART A — Basic SELECT (Stock) =================
  {
    id: 'ch9a-1',
    part: 'a',
    partLabel: 'Part A · Basic SQL',
    title: 'A1. Select ItemName and Price',
    table: 'Stock',
    marks: 3,
    prompt: 'Write an SQL query returning ItemName and Price from the Stock table, in that exact column order.',
    hint: 'Separate field names with a comma: SELECT Field1, Field2 FROM TableName;',
    starterSql: '-- Return ItemName and Price from Stock\nSELECT ',
    expectedColumns: ['ItemName', 'Price'],
    expectedRows: [
      ['Pen', 2.5],
      ['Ruler', 4.0],
      ['Book', 8.0],
      ['Bag', 35.0],
      ['Pencil', 1.5],
    ],
    orderMatters: false,
  },
  {
    id: 'ch9a-2',
    part: 'a',
    partLabel: 'Part A · Basic SQL',
    title: 'A2. Select Colour Only',
    table: 'Stock',
    marks: 2,
    prompt: 'Write an SQL query returning the Colour field only from the Stock table.',
    hint: 'Use SELECT followed by a single column name and FROM Stock.',
    starterSql: '-- Return only the Colour column from Stock\nSELECT ',
    expectedColumns: ['Colour'],
    expectedRows: [['Blue'], ['Red'], ['Blue'], ['Red'], ['Green']],
    orderMatters: false,
  },
  {
    id: 'ch9a-3',
    part: 'a',
    partLabel: 'Part A · Basic SQL',
    title: 'A3. Debug Missing Comma',
    table: 'Stock',
    marks: 3,
    prompt: 'Fix the broken query below so that it returns both ItemID and Quantity from the Stock table.',
    hint: 'In SQL, multiple columns after SELECT must be separated by a comma.',
    starterSql: 'SELECT ItemID Quantity FROM Stock;',
    expectedColumns: ['ItemID', 'Quantity'],
    expectedRows: [
      ['A01', 12],
      ['A02', 5],
      ['A03', 20],
      ['A04', 5],
      ['A05', 0],
    ],
    orderMatters: false,
  },

  // ================= PART B — Filtering, Sorting & Aggregates (Stock) =================
  {
    id: 'ch9b-1',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B1. Low Stock Sorted Ascending',
    table: 'Stock',
    marks: 3,
    prompt: 'Return ItemName and Quantity for products with Quantity below 6, sorted by Quantity ascending (ties may appear in either order).',
    hint: 'Combine WHERE Quantity < 6 with ORDER BY Quantity ASC.',
    starterSql: '-- Names and quantities with Quantity < 6, lowest quantity first\nSELECT ',
    expectedColumns: ['ItemName', 'Quantity'],
    expectedRows: [
      ['Pencil', 0],
      ['Ruler', 5],
      ['Bag', 5],
    ],
    orderMatters: true,
    allowTieSwap: true,
    requiredKeywords: ['WHERE', 'ORDER BY'],
  },
  {
    id: 'ch9b-2',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B2. Red Products with ≥ 5 Units',
    table: 'Stock',
    marks: 3,
    prompt: 'Return the ItemID of red products that have at least 5 units in stock.',
    hint: 'Use WHERE Colour = \'Red\' AND Quantity >= 5.',
    starterSql: '-- IDs of Red items with Quantity >= 5\nSELECT ',
    expectedColumns: ['ItemID'],
    expectedRows: [['A02'], ['A04']],
    orderMatters: false,
    requiredKeywords: ['WHERE', 'AND'],
  },
  {
    id: 'ch9b-3',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B3. Blue OR Zero Quantity',
    table: 'Stock',
    marks: 3,
    prompt: 'Return the ItemID of products that are Blue OR have a Quantity of 0.',
    hint: 'Use OR between the two conditions in the WHERE clause.',
    starterSql: '-- IDs of Blue items or items with Quantity = 0\nSELECT ',
    expectedColumns: ['ItemID'],
    expectedRows: [['A01'], ['A03'], ['A05']],
    orderMatters: false,
    requiredKeywords: ['WHERE', 'OR'],
  },
  {
    id: 'ch9b-4',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B4. Items Not Yet Ordered',
    table: 'Stock',
    marks: 3,
    prompt: 'Return the ItemName of items that have NOT yet been ordered (Ordered is a Boolean: FALSE / 0).',
    hint: 'Use WHERE Ordered = FALSE (or WHERE Ordered = 0).',
    starterSql: '-- Names of items not yet ordered\nSELECT ',
    expectedColumns: ['ItemName'],
    expectedRows: [['Pen'], ['Book'], ['Bag']],
    orderMatters: false,
    requiredKeywords: ['WHERE'],
  },
  {
    id: 'ch9b-5',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B5. Sort by Highest Price First',
    table: 'Stock',
    marks: 3,
    prompt: 'Return ItemName and Price for all items in Stock, sorted from highest price to lowest price.',
    hint: 'Use ORDER BY Price DESC.',
    starterSql: '-- All items sorted by highest price first\nSELECT ',
    expectedColumns: ['ItemName', 'Price'],
    expectedRows: [
      ['Bag', 35.0],
      ['Book', 8.0],
      ['Ruler', 4.0],
      ['Pen', 2.5],
      ['Pencil', 1.5],
    ],
    orderMatters: true,
    requiredKeywords: ['ORDER BY', 'DESC'],
  },
  {
    id: 'ch9b-6',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B6. Total Quantity of Blue Products',
    table: 'Stock',
    marks: 3,
    prompt: 'Write an SQL query to calculate the total quantity of all Blue products in Stock.',
    hint: 'Use SUM(Quantity) with WHERE Colour = \'Blue\'.',
    starterSql: '-- Total quantity of Blue products\nSELECT ',
    expectedRows: [[32]],
    orderMatters: true,
    requiredKeywords: ['SUM', 'WHERE'],
  },
  {
    id: 'ch9b-7',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B7. Count Red Product Records',
    table: 'Stock',
    marks: 3,
    prompt: 'Write an SQL query to find the number of Red product records in Stock.',
    hint: 'Use COUNT(*) or COUNT(ItemID) with WHERE Colour = \'Red\'.',
    starterSql: '-- Number of Red product records\nSELECT ',
    expectedRows: [[2]],
    orderMatters: true,
    requiredKeywords: ['COUNT', 'WHERE'],
  },
  {
    id: 'ch9b-8',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B8. Count Items Priced ≥ 8',
    table: 'Stock',
    marks: 3,
    prompt: 'Write an SQL query to count how many items have a Price of at least 8.',
    hint: 'Use COUNT(...) with WHERE Price >= 8.',
    starterSql: '-- Number of items with Price >= 8\nSELECT ',
    expectedRows: [[2]],
    orderMatters: true,
    requiredKeywords: ['COUNT', 'WHERE'],
  },
  {
    id: 'ch9b-9',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B9. Total Quantity Across Stock',
    table: 'Stock',
    marks: 3,
    prompt: 'Write an SQL query to find the total Quantity across the entire Stock table.',
    hint: 'Use SUM(Quantity) without a WHERE filter.',
    starterSql: '-- Total quantity across the whole Stock table\nSELECT ',
    expectedRows: [[42]],
    orderMatters: true,
    requiredKeywords: ['SUM'],
  },
  {
    id: 'ch9b-10',
    part: 'b',
    partLabel: 'Part B · WHERE, ORDER BY & Aggregates',
    title: 'B10. Fix COUNT vs SUM Bug',
    table: 'Stock',
    marks: 3,
    prompt: 'The query below counts rows instead of adding up the total number of units. Fix it so it returns the total number of units in Stock.',
    hint: 'Replace COUNT with SUM to add numeric values instead of counting records.',
    starterSql: 'SELECT COUNT(Quantity) FROM Stock;',
    expectedRows: [[42]],
    orderMatters: true,
    requiredKeywords: ['SUM'],
  },

  // ================= TRANSFER CHALLENGE (Equipment) =================
  {
    id: 'ch9c-1',
    part: 'transfer',
    partLabel: 'Transfer Challenge · Equipment Table',
    title: 'T1. Available Equipment (≥ 4 Units)',
    table: 'Equipment',
    marks: 3,
    prompt: 'Using the Equipment table, return the EquipmentName of available equipment with at least 4 units.',
    hint: 'Query FROM Equipment with WHERE Available = TRUE AND Quantity >= 4.',
    starterSql: '-- Available equipment with Quantity >= 4\nSELECT ',
    expectedColumns: ['EquipmentName'],
    expectedRows: [['Ball'], ['Cone'], ['Racket']],
    orderMatters: false,
    requiredKeywords: ['WHERE', 'AND'],
  },
  {
    id: 'ch9c-2',
    part: 'transfer',
    partLabel: 'Transfer Challenge · Equipment Table',
    title: 'T2. Total Available Equipment Units',
    table: 'Equipment',
    marks: 2,
    prompt: 'Using the Equipment table, return the total Quantity (SUM) of all available equipment.',
    hint: 'Use SUM(Quantity) FROM Equipment WHERE Available = TRUE.',
    starterSql: '-- Total units of available equipment\nSELECT ',
    expectedRows: [[24]],
    orderMatters: true,
    requiredKeywords: ['SUM', 'WHERE'],
  },
  {
    id: 'ch9c-3',
    part: 'transfer',
    partLabel: 'Transfer Challenge · Equipment Table',
    title: 'T3. Count Available Equipment Records',
    table: 'Equipment',
    marks: 2,
    prompt: 'Using the Equipment table, return the number of records (COUNT) where Available is TRUE.',
    hint: 'Use COUNT(*) FROM Equipment WHERE Available = TRUE. Notice how COUNT returns 3 rows while SUM returns 24 units!',
    starterSql: '-- Count of available equipment records\nSELECT ',
    expectedRows: [[3]],
    orderMatters: true,
    requiredKeywords: ['COUNT', 'WHERE'],
  },
];

export interface SqlMissionCheck {
  passed: boolean;
  feedback: string;
  result: SqlExecutionResult;
}

function normalizeRows(rows: SqlValue[][]): string[] {
  return rows.map((r) => JSON.stringify(r));
}

export function checkCh9SqlMission(mission: Ch9SqlMission, rawSql: string): SqlMissionCheck {
  const result = executeIgcseSql(rawSql);
  if (!result.ok) {
    return { passed: false, feedback: result.error || 'SQL syntax error.', result };
  }

  // Strip SQL comments before keyword check
  const sqlNoComments = rawSql
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join(' ')
    .toUpperCase();

  if (mission.requiredKeywords) {
    for (const kw of mission.requiredKeywords) {
      if (!sqlNoComments.includes(kw.toUpperCase())) {
        return {
          passed: false,
          feedback: `Your query ran, but make sure you use ${kw} as required by the task.`,
          result,
        };
      }
    }
  }

  if (mission.expectedColumns) {
    const actualCols = result.columns.map((c) => c.toLowerCase());
    const expCols = mission.expectedColumns.map((c) => c.toLowerCase());
    if (actualCols.length !== expCols.length || actualCols.some((c, i) => c !== expCols[i])) {
      return {
        passed: false,
        feedback: `Expected columns (${mission.expectedColumns.join(', ')}) in that exact order, but got (${result.columns.join(', ')}).`,
        result,
      };
    }
  }

  const actualNorm = normalizeRows(result.rows);
  const expectedNorm = normalizeRows(mission.expectedRows);

  if (actualNorm.length !== expectedNorm.length) {
    return {
      passed: false,
      feedback: `Expected ${expectedNorm.length} row(s), but your query returned ${actualNorm.length} row(s). Check your WHERE condition.`,
      result,
    };
  }

  if (mission.orderMatters) {
    if (mission.allowTieSwap) {
      // Verify quantities are non-decreasing and multiset of rows matches
      const sortedActual = [...actualNorm].sort();
      const sortedExpected = [...expectedNorm].sort();
      const sameMultiset = sortedActual.every((v, i) => v === sortedExpected[i]);
      const qtyColIdx = result.columns.findIndex((c) => c.toLowerCase() === 'quantity');
      const isNonDecreasing =
        qtyColIdx === -1 ||
        result.rows.every((r, i) => i === 0 || Number(r[qtyColIdx]) >= Number(result.rows[i - 1][qtyColIdx]));
      if (!sameMultiset || !isNonDecreasing) {
        return {
          passed: false,
          feedback: 'The rows or sort order do not match yet. Check your WHERE filter and ORDER BY direction.',
          result,
        };
      }
    } else if (actualNorm.some((v, i) => v !== expectedNorm[i])) {
      return {
        passed: false,
        feedback: 'The returned values or row order do not match yet. Double-check your condition and ORDER BY.',
        result,
      };
    }
  } else {
    const sortedActual = [...actualNorm].sort();
    const sortedExpected = [...expectedNorm].sort();
    if (sortedActual.some((v, i) => v !== sortedExpected[i])) {
      return {
        passed: false,
        feedback: 'The returned rows do not match the expected records. Check your WHERE condition.',
        result,
      };
    }
  }

  return {
    passed: true,
    feedback: `Spot on! Query passed (${mission.marks}/${mission.marks} marks).`,
    result,
  };
}

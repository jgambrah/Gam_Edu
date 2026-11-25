/**
 * Lightweight, zero-dependency, read-only Cambridge IGCSE 0478 SQL engine
 * for in-browser student practice (Chapter 9: Databases & SQL).
 *
 * Supports:
 * - SELECT *, column lists, DISTINCT, COUNT(*), COUNT(col), SUM(col), AVG(col), MIN(col), MAX(col), AS aliases
 * - FROM <Table> (Stock, Weather, Equipment — exact schema & fixtures from stock.sql)
 * - WHERE with =, <>, !=, <, <=, >, >=, AND, OR, NOT, parentheses, TRUE/FALSE/0/1, strings & numbers
 * - ORDER BY <col> [ASC|DESC] (, ...)
 */

export type SqlValue = string | number | null;
export type SqlRow = Record<string, SqlValue>;

export interface SqlTableDef {
  name: string;
  primaryKey: string[];
  columns: { name: string; type: 'TEXT' | 'INTEGER' | 'REAL' | 'BOOLEAN' }[];
  rows: SqlRow[];
}

export const CH9_TABLES: Record<string, SqlTableDef> = {
  Stock: {
    name: 'Stock',
    primaryKey: ['ItemID'],
    columns: [
      { name: 'ItemID', type: 'TEXT' },
      { name: 'ItemName', type: 'TEXT' },
      { name: 'Colour', type: 'TEXT' },
      { name: 'Quantity', type: 'INTEGER' },
      { name: 'Price', type: 'REAL' },
      { name: 'Ordered', type: 'BOOLEAN' },
    ],
    rows: [
      { ItemID: 'A01', ItemName: 'Pen', Colour: 'Blue', Quantity: 12, Price: 2.5, Ordered: 0 },
      { ItemID: 'A02', ItemName: 'Ruler', Colour: 'Red', Quantity: 5, Price: 4.0, Ordered: 1 },
      { ItemID: 'A03', ItemName: 'Book', Colour: 'Blue', Quantity: 20, Price: 8.0, Ordered: 0 },
      { ItemID: 'A04', ItemName: 'Bag', Colour: 'Red', Quantity: 5, Price: 35.0, Ordered: 0 },
      { ItemID: 'A05', ItemName: 'Pencil', Colour: 'Green', Quantity: 0, Price: 1.5, Ordered: 1 },
    ],
  },
  Equipment: {
    name: 'Equipment',
    primaryKey: ['EquipmentID'],
    columns: [
      { name: 'EquipmentID', type: 'TEXT' },
      { name: 'EquipmentName', type: 'TEXT' },
      { name: 'Quantity', type: 'INTEGER' },
      { name: 'Available', type: 'BOOLEAN' },
    ],
    rows: [
      { EquipmentID: 'E01', EquipmentName: 'Ball', Quantity: 8, Available: 1 },
      { EquipmentID: 'E02', EquipmentName: 'Net', Quantity: 0, Available: 0 },
      { EquipmentID: 'E03', EquipmentName: 'Cone', Quantity: 12, Available: 1 },
      { EquipmentID: 'E04', EquipmentName: 'Racket', Quantity: 4, Available: 1 },
      { EquipmentID: 'E05', EquipmentName: 'Mat', Quantity: 4, Available: 0 },
    ],
  },
  Weather: {
    name: 'Weather',
    primaryKey: ['ReadingDate', 'ReadingTime'],
    columns: [
      { name: 'ReadingDate', type: 'TEXT' },
      { name: 'ReadingTime', type: 'TEXT' },
      { name: 'Temperature', type: 'REAL' },
    ],
    rows: [
      { ReadingDate: '2026-11-25', ReadingTime: '09:30', Temperature: 24.5 },
      { ReadingDate: '2026-11-25', ReadingTime: '14:30', Temperature: 29.0 },
      { ReadingDate: '2026-11-25', ReadingTime: '15:00', Temperature: 28.5 },
    ],
  },
  Sales: {
    name: 'Sales',
    primaryKey: ['Product'],
    columns: [
      { name: 'Product', type: 'TEXT' },
      { name: 'PricePesewas', type: 'INTEGER' },
      { name: 'Quantity', type: 'INTEGER' },
    ],
    rows: [
      { Product: 'Pen', PricePesewas: 200, Quantity: 5 },
      { Product: 'Book', PricePesewas: 800, Quantity: 10 },
      { Product: 'Ruler', PricePesewas: 300, Quantity: 0 },
    ],
  },
  Sensors: {
    name: 'Sensors',
    primaryKey: ['id'],
    columns: [
      { name: 'id', type: 'INTEGER' },
      { name: 'a', type: 'INTEGER' },
      { name: 'b', type: 'INTEGER' },
    ],
    rows: [
      { id: 1, a: 0, b: 0 },
      { id: 2, a: 0, b: 1 },
      { id: 3, a: 1, b: 0 },
      { id: 4, a: 1, b: 1 },
    ],
  },
};

export interface SqlExecutionResult {
  ok: boolean;
  columns: string[];
  rows: SqlValue[][];
  error?: string;
}

type TokenType = 'WORD' | 'STRING' | 'NUMBER' | 'OP' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'STAR' | 'SEMI';
interface Token {
  type: TokenType;
  value: string;
}

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    // Line comments --
    if (ch === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
      continue;
    }
    if (ch === "'" || ch === '"') {
      const quote = ch;
      let str = '';
      i++;
      while (i < sql.length) {
        if (sql[i] === quote && sql[i + 1] === quote) {
          str += quote;
          i += 2;
        } else if (sql[i] === quote) {
          i++;
          break;
        } else {
          str += sql[i++];
        }
      }
      tokens.push({ type: 'STRING', value: str });
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(sql[i + 1] || ''))) {
      let num = ch;
      i++;
      while (i < sql.length && /[0-9.]/.test(sql[i])) num += sql[i++];
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }
    if (ch === '<' && (sql[i + 1] === '=' || sql[i + 1] === '>')) {
      tokens.push({ type: 'OP', value: ch + sql[i + 1] });
      i += 2;
      continue;
    }
    if ((ch === '>' || ch === '!') && sql[i + 1] === '=') {
      tokens.push({ type: 'OP', value: ch + sql[i + 1] });
      i += 2;
      continue;
    }
    if (ch === '=' || ch === '<' || ch === '>') {
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }
    if (ch === '(') { tokens.push({ type: 'LPAREN', value: ch }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'RPAREN', value: ch }); i++; continue; }
    if (ch === ',') { tokens.push({ type: 'COMMA', value: ch }); i++; continue; }
    if (ch === '*') { tokens.push({ type: 'STAR', value: ch }); i++; continue; }
    if (ch === ';') { tokens.push({ type: 'SEMI', value: ch }); i++; continue; }
    if (/[A-Za-z_]/.test(ch)) {
      let word = '';
      while (i < sql.length && /[A-Za-z0-9_]/.test(sql[i])) word += sql[i++];
      tokens.push({ type: 'WORD', value: word });
      continue;
    }
    throw new Error(`Unexpected character "${ch}" in SQL query.`);
  }
  return tokens;
}

function findColumn(table: SqlTableDef, colName: string): string | null {
  const lower = colName.toLowerCase();
  const match = table.columns.find((c) => c.name.toLowerCase() === lower);
  return match ? match.name : null;
}

function findTable(name: string): SqlTableDef | null {
  const lower = name.toLowerCase();
  const key = Object.keys(CH9_TABLES).find((k) => k.toLowerCase() === lower);
  return key ? CH9_TABLES[key] : null;
}

interface SelectItem {
  kind: 'star' | 'column' | 'agg';
  fn?: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
  column?: string; // '*' or canonical column name
  mulColumn?: string; // optional second column for SUM(colA * colB)
  alias?: string;
}

function normalizeBoolOrValue(val: SqlValue): SqlValue {
  return val;
}

function compareValues(left: SqlValue, op: string, right: SqlValue): boolean {
  if (left === null || right === null) return false;
  const bothNum = typeof left === 'number' && typeof right === 'number';
  const l = bothNum ? left : String(left);
  const r = bothNum ? right : String(right);
  switch (op) {
    case '=': return l === r;
    case '<>':
    case '!=': return l !== r;
    case '<': return l < r;
    case '<=': return l <= r;
    case '>': return l > r;
    case '>=': return l >= r;
    default: throw new Error(`Unsupported operator "${op}".`);
  }
}

export function executeIgcseSql(rawSql: string): SqlExecutionResult {
  try {
    const trimmed = rawSql.trim();
    if (!trimmed) {
      return { ok: false, columns: [], rows: [], error: 'Write a SELECT query first.' };
    }

    const tokens = tokenize(trimmed).filter((t) => t.type !== 'SEMI');
    if (tokens.length === 0) {
      return { ok: false, columns: [], rows: [], error: 'Write a SELECT query first.' };
    }

    const firstWord = tokens[0].type === 'WORD' ? tokens[0].value.toUpperCase() : '';
    if (firstWord !== 'SELECT') {
      return {
        ok: false,
        columns: [],
        rows: [],
        error: 'This practice lab only runs read-only SELECT queries (Cambridge IGCSE 0478 Topic 9).',
      };
    }

    let pos = 1;
    let isDistinct = false;
    if (tokens[pos]?.type === 'WORD' && tokens[pos].value.toUpperCase() === 'DISTINCT') {
      isDistinct = true;
      pos++;
    }

    // Parse SELECT list until FROM
    const fromIdx = tokens.findIndex((t, i) => i >= pos && t.type === 'WORD' && t.value.toUpperCase() === 'FROM');
    if (fromIdx === -1) {
      return { ok: false, columns: [], rows: [], error: 'Missing FROM clause. Example: SELECT ItemName FROM Stock;' };
    }

    const selectTokens = tokens.slice(pos, fromIdx);
    if (selectTokens.length === 0) {
      return { ok: false, columns: [], rows: [], error: 'Missing field names after SELECT.' };
    }

    // Parse table name right after FROM
    const tableTok = tokens[fromIdx + 1];
    if (!tableTok || tableTok.type !== 'WORD') {
      return { ok: false, columns: [], rows: [], error: 'Missing table name after FROM (available: Stock, Equipment, Weather).' };
    }
    const table = findTable(tableTok.value);
    if (!table) {
      return {
        ok: false,
        columns: [],
        rows: [],
        error: `Unknown table "${tableTok.value}". Available tables: Stock, Equipment, Weather.`,
      };
    }

    // Parse SELECT items (strict comma checking so "SELECT ItemID Quantity FROM Stock" gives a helpful error!)
    const selectItems: SelectItem[] = [];
    let sPos = 0;
    while (sPos < selectTokens.length) {
      const tok = selectTokens[sPos];
      if (tok.type === 'STAR') {
        selectItems.push({ kind: 'star' });
        sPos++;
      } else if (
        tok.type === 'WORD' &&
        ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(tok.value.toUpperCase()) &&
        selectTokens[sPos + 1]?.type === 'LPAREN'
      ) {
        const fn = tok.value.toUpperCase() as SelectItem['fn'];
        sPos += 2; // skip FN and (
        const argTok = selectTokens[sPos];
        if (!argTok) {
          return { ok: false, columns: [], rows: [], error: `Incomplete ${fn}(...) expression.` };
        }
        let colArg: string;
        let mulColArg: string | undefined;
        if (argTok.type === 'STAR') {
          if (fn !== 'COUNT') {
            return { ok: false, columns: [], rows: [], error: `${fn}(*) is not valid — pass a numeric column name.` };
          }
          colArg = '*';
          sPos++;
        } else if (argTok.type === 'WORD') {
          const canonical = findColumn(table, argTok.value);
          if (!canonical) {
            return { ok: false, columns: [], rows: [], error: `Unknown field "${argTok.value}" in table ${table.name}.` };
          }
          colArg = canonical;
          sPos++;
          // Support SUM(ColA * ColB) e.g. SUM(PricePesewas * Quantity)
          if (selectTokens[sPos]?.type === 'STAR' && selectTokens[sPos + 1]?.type === 'WORD') {
            const canonical2 = findColumn(table, selectTokens[sPos + 1].value);
            if (!canonical2) {
              return { ok: false, columns: [], rows: [], error: `Unknown field "${selectTokens[sPos + 1].value}" in table ${table.name}.` };
            }
            mulColArg = canonical2;
            sPos += 2;
          }
        } else {
          return { ok: false, columns: [], rows: [], error: `Invalid argument inside ${fn}(...).` };
        }
        if (selectTokens[sPos]?.type !== 'RPAREN') {
          return { ok: false, columns: [], rows: [], error: `Missing closing ")" in ${fn}(${colArg}).` };
        }
        sPos++;
        let alias: string | undefined;
        if (selectTokens[sPos]?.type === 'WORD' && selectTokens[sPos].value.toUpperCase() === 'AS') {
          sPos++;
          if (!selectTokens[sPos] || (selectTokens[sPos].type !== 'WORD' && selectTokens[sPos].type !== 'STRING')) {
            return { ok: false, columns: [], rows: [], error: 'Missing alias name after AS.' };
          }
          alias = selectTokens[sPos].value;
          sPos++;
        }
        selectItems.push({ kind: 'agg', fn, column: colArg, mulColumn: mulColArg, alias });
      } else if (tok.type === 'WORD') {
        const canonical = findColumn(table, tok.value);
        if (!canonical) {
          return { ok: false, columns: [], rows: [], error: `Unknown field "${tok.value}" in table ${table.name}.` };
        }
        sPos++;
        let alias: string | undefined;
        if (selectTokens[sPos]?.type === 'WORD' && selectTokens[sPos].value.toUpperCase() === 'AS') {
          sPos++;
          if (!selectTokens[sPos] || (selectTokens[sPos].type !== 'WORD' && selectTokens[sPos].type !== 'STRING')) {
            return { ok: false, columns: [], rows: [], error: 'Missing alias name after AS.' };
          }
          alias = selectTokens[sPos].value;
          sPos++;
        } else if (selectTokens[sPos]?.type === 'WORD') {
          const maybeCol = findColumn(table, selectTokens[sPos].value);
          if (maybeCol) {
            return {
              ok: false,
              columns: [],
              rows: [],
              error: `Missing comma between "${tok.value}" and "${selectTokens[sPos].value}". Separate column names with a comma (e.g. SELECT ${canonical}, ${maybeCol} FROM ${table.name};).`,
            };
          }
          return {
            ok: false,
            columns: [],
            rows: [],
            error: `Unexpected token "${selectTokens[sPos].value}" after "${tok.value}". Did you forget a comma or AS?`,
          };
        }
        selectItems.push({ kind: 'column', column: canonical, alias });
      } else {
        return { ok: false, columns: [], rows: [], error: `Unexpected token "${tok.value}" in SELECT list.` };
      }

      if (sPos < selectTokens.length) {
        if (selectTokens[sPos].type !== 'COMMA') {
          return {
            ok: false,
            columns: [],
            rows: [],
            error: `Expected a comma "," before "${selectTokens[sPos].value}" in SELECT list.`,
          };
        }
        sPos++;
        if (sPos >= selectTokens.length) {
          return { ok: false, columns: [], rows: [], error: 'Remove the trailing comma before FROM.' };
        }
      }
    }

    // Parse optional WHERE and ORDER BY clauses
    let restPos = fromIdx + 2;
    let whereTokens: Token[] = [];
    let orderTokens: Token[] = [];

    const orderIdx = tokens.findIndex(
      (t, i) =>
        i >= restPos &&
        t.type === 'WORD' &&
        t.value.toUpperCase() === 'ORDER' &&
        tokens[i + 1]?.type === 'WORD' &&
        tokens[i + 1].value.toUpperCase() === 'BY'
    );

    if (tokens[restPos]?.type === 'WORD' && tokens[restPos].value.toUpperCase() === 'WHERE') {
      const endWhere = orderIdx !== -1 ? orderIdx : tokens.length;
      whereTokens = tokens.slice(restPos + 1, endWhere);
      if (whereTokens.length === 0) {
        return { ok: false, columns: [], rows: [], error: 'Missing condition after WHERE.' };
      }
      restPos = endWhere;
    }

    if (orderIdx !== -1) {
      if (restPos !== orderIdx) {
        return { ok: false, columns: [], rows: [], error: `Unexpected token "${tokens[restPos]?.value}" before ORDER BY.` };
      }
      orderTokens = tokens.slice(orderIdx + 2);
      if (orderTokens.length === 0) {
        return { ok: false, columns: [], rows: [], error: 'Missing column name after ORDER BY.' };
      }
      restPos = tokens.length;
    }

    if (restPos < tokens.length) {
      return { ok: false, columns: [], rows: [], error: `Unexpected clause starting at "${tokens[restPos].value}".` };
    }

    // Evaluate WHERE recursive-descent parser
    let filteredRows = [...table.rows];
    if (whereTokens.length > 0) {
      const evalWhere = (row: SqlRow): boolean => {
        let wPos = 0;

        const parseOr = (): boolean => {
          let left = parseAnd();
          while (whereTokens[wPos]?.type === 'WORD' && whereTokens[wPos].value.toUpperCase() === 'OR') {
            wPos++;
            const right = parseAnd();
            left = left || right;
          }
          return left;
        };

        const parseAnd = (): boolean => {
          let left = parseNot();
          while (whereTokens[wPos]?.type === 'WORD' && whereTokens[wPos].value.toUpperCase() === 'AND') {
            wPos++;
            const right = parseNot();
            left = left && right;
          }
          return left;
        };

        const parseNot = (): boolean => {
          if (whereTokens[wPos]?.type === 'WORD' && whereTokens[wPos].value.toUpperCase() === 'NOT') {
            wPos++;
            return !parseNot();
          }
          return parsePrimary();
        };

        const parseValue = (): SqlValue => {
          const tok = whereTokens[wPos];
          if (!tok) throw new Error('Incomplete WHERE condition.');
          wPos++;
          if (tok.type === 'STRING') return tok.value;
          if (tok.type === 'NUMBER') return Number(tok.value);
          if (tok.type === 'WORD') {
            const upper = tok.value.toUpperCase();
            if (upper === 'TRUE') return 1;
            if (upper === 'FALSE') return 0;
            if (upper === 'NULL') return null;
            const col = findColumn(table, tok.value);
            if (!col) throw new Error(`Unknown field "${tok.value}" in WHERE clause.`);
            return normalizeBoolOrValue(row[col]);
          }
          throw new Error(`Unexpected token "${tok.value}" in WHERE clause.`);
        };

        const parsePrimary = (): boolean => {
          if (whereTokens[wPos]?.type === 'LPAREN') {
            wPos++;
            const val = parseOr();
            if (whereTokens[wPos]?.type !== 'RPAREN') {
              throw new Error('Missing closing ")" in WHERE clause.');
            }
            wPos++;
            return val;
          }
          const left = parseValue();
          const opTok = whereTokens[wPos];
          if (!opTok || opTok.type !== 'OP') {
            // Allow bare boolean field e.g. WHERE Available or WHERE NOT Ordered
            return left === 1;
          }
          wPos++;
          const right = parseValue();
          return compareValues(left, opTok.value, right);
        };

        const result = parseOr();
        if (wPos < whereTokens.length) {
          throw new Error(`Unexpected token "${whereTokens[wPos].value}" in WHERE clause.`);
        }
        return result;
      };

      filteredRows = filteredRows.filter(evalWhere);
    }

    // Parse and apply ORDER BY
    if (orderTokens.length > 0) {
      const specs: { col: string; dir: 'ASC' | 'DESC' }[] = [];
      let oPos = 0;
      while (oPos < orderTokens.length) {
        const colTok = orderTokens[oPos];
        if (!colTok || colTok.type !== 'WORD') {
          return { ok: false, columns: [], rows: [], error: 'Invalid column in ORDER BY.' };
        }
        const canonical = findColumn(table, colTok.value);
        if (!canonical) {
          return { ok: false, columns: [], rows: [], error: `Unknown field "${colTok.value}" in ORDER BY.` };
        }
        oPos++;
        let dir: 'ASC' | 'DESC' = 'ASC';
        if (orderTokens[oPos]?.type === 'WORD') {
          const upper = orderTokens[oPos].value.toUpperCase();
          if (upper === 'ASC' || upper === 'DESC') {
            dir = upper;
            oPos++;
          }
        }
        specs.push({ col: canonical, dir });
        if (oPos < orderTokens.length) {
          if (orderTokens[oPos].type !== 'COMMA') {
            return { ok: false, columns: [], rows: [], error: `Expected "," in ORDER BY before "${orderTokens[oPos].value}".` };
          }
          oPos++;
        }
      }

      filteredRows.sort((a, b) => {
        for (const spec of specs) {
          const av = a[spec.col];
          const bv = b[spec.col];
          if (av === bv) continue;
          if (av === null) return 1;
          if (bv === null) return -1;
          const cmp = typeof av === 'number' && typeof bv === 'number'
            ? av - bv
            : String(av).localeCompare(String(bv));
          if (cmp !== 0) return spec.dir === 'ASC' ? cmp : -cmp;
        }
        return 0;
      });
    }

    // Project SELECT items
    const hasAgg = selectItems.some((item) => item.kind === 'agg');
    const hasNonAgg = selectItems.some((item) => item.kind !== 'agg');
    if (hasAgg && hasNonAgg) {
      return {
        ok: false,
        columns: [],
        rows: [],
        error: 'Do not mix aggregate functions (COUNT/SUM) with plain fields without GROUP BY.',
      };
    }

    if (hasAgg) {
      const columns: string[] = [];
      const rowOut: SqlValue[] = [];
      for (const item of selectItems) {
        const exprLabel = item.mulColumn ? `${item.column} * ${item.mulColumn}` : item.column;
        const label = item.alias ?? `${item.fn}(${exprLabel})`;
        columns.push(label);
        if (item.fn === 'COUNT') {
          if (item.column === '*') {
            rowOut.push(filteredRows.length);
          } else {
            rowOut.push(filteredRows.filter((r) => r[item.column!] !== null && r[item.column!] !== undefined).length);
          }
        } else {
          const nums = filteredRows
            .map((r) => {
              const a = r[item.column!];
              if (typeof a !== 'number') return null;
              if (item.mulColumn) {
                const b = r[item.mulColumn];
                return typeof b === 'number' ? a * b : null;
              }
              return a;
            })
            .filter((v): v is number => typeof v === 'number');
          if (nums.length === 0) {
            rowOut.push(null);
          } else if (item.fn === 'SUM') {
            rowOut.push(Number(nums.reduce((a, b) => a + b, 0).toFixed(4)));
          } else if (item.fn === 'AVG') {
            rowOut.push(Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(4)));
          } else if (item.fn === 'MIN') {
            rowOut.push(Math.min(...nums));
          } else if (item.fn === 'MAX') {
            rowOut.push(Math.max(...nums));
          }
        }
      }
      return { ok: true, columns, rows: [rowOut] };
    }

    // Plain projection
    const outCols: { header: string; source: string }[] = [];
    for (const item of selectItems) {
      if (item.kind === 'star') {
        for (const col of table.columns) {
          outCols.push({ header: col.name, source: col.name });
        }
      } else if (item.kind === 'column' && item.column) {
        outCols.push({ header: item.alias ?? item.column, source: item.column });
      }
    }

    let outRows: SqlValue[][] = filteredRows.map((r) => outCols.map((c) => r[c.source]));
    if (isDistinct) {
      const seen = new Set<string>();
      outRows = outRows.filter((row) => {
        const key = JSON.stringify(row);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return {
      ok: true,
      columns: outCols.map((c) => c.header),
      rows: outRows,
    };
  } catch (err) {
    return {
      ok: false,
      columns: [],
      rows: [],
      error: err instanceof Error ? err.message : 'Invalid SQL syntax.',
    };
  }
}

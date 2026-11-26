/**
 * Lightweight, zero-dependency Cambridge IGCSE 0478 Pseudocode Interpreter.
 * Runs 100% in-browser with a strict execution step limit so infinite loops
 * never freeze the UI.
 */

export interface PseudocodeRunResult {
  ok: boolean;
  output: string[];
  error?: string;
}

type PValue = number | string | boolean | null;

interface ArrayMeta {
  low1: number;
  high1: number;
  low2?: number;
  high2?: number;
  data: Map<string, PValue>;
}

interface SubDef {
  kind: 'PROCEDURE' | 'FUNCTION';
  name: string;
  params: string[];
  body: string[];
}

interface Env {
  vars: Map<string, PValue>;
  types: Map<string, string>;
  constants: Set<string>;
  arrays: Map<string, ArrayMeta>;
  parent?: Env;
}

const MAX_STEPS = 10_000;

function createEnv(parent?: Env): Env {
  return {
    vars: new Map(),
    types: new Map(),
    constants: new Set(),
    arrays: new Map(),
    parent,
  };
}

function getVar(env: Env, name: string): { found: boolean; value: PValue; owner?: Env } {
  const key = name.toLowerCase();
  let cur: Env | undefined = env;
  while (cur) {
    if (cur.vars.has(key)) return { found: true, value: cur.vars.get(key)!, owner: cur };
    cur = cur.parent;
  }
  return { found: false, value: null };
}

function getArray(env: Env, name: string): ArrayMeta | undefined {
  const key = name.toLowerCase();
  let cur: Env | undefined = env;
  while (cur) {
    if (cur.arrays.has(key)) return cur.arrays.get(key);
    cur = cur.parent;
  }
  return undefined;
}

function getType(env: Env, name: string): string | undefined {
  const key = name.toLowerCase();
  let cur: Env | undefined = env;
  while (cur) {
    if (cur.types.has(key)) return cur.types.get(key);
    cur = cur.parent;
  }
  return undefined;
}

function isConstant(env: Env, name: string): boolean {
  const key = name.toLowerCase();
  let cur: Env | undefined = env;
  while (cur) {
    if (cur.constants.has(key)) return true;
    cur = cur.parent;
  }
  return false;
}

function setVar(env: Env, name: string, value: PValue) {
  const key = name.toLowerCase();
  if (isConstant(env, name)) {
    throw new Error(`Cannot reassign CONSTANT "${name}".`);
  }
  const existing = getVar(env, name);
  if (existing.found && existing.owner) {
    existing.owner.vars.set(key, value);
  } else {
    env.vars.set(key, value);
  }
}

function defaultValueForType(typeName: string): PValue {
  switch (typeName.toUpperCase()) {
    case 'INTEGER':
    case 'REAL':
      return 0;
    case 'BOOLEAN':
      return false;
    case 'CHAR':
    case 'STRING':
    default:
      return '';
  }
}

function stripComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (!inSingle && !inDouble && ch === '/' && line[i + 1] === '/') {
      return line.slice(0, i);
    }
  }
  return line;
}

function splitTopLevelCommas(expr: string): string[] {
  const parts: string[] = [];
  let cur = '';
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (!inSingle && !inDouble) {
      if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth--;
      else if (ch === ',' && depth === 0) {
        parts.push(cur.trim());
        cur = '';
        continue;
      }
    }
    cur += ch;
  }
  if (cur.trim() !== '') parts.push(cur.trim());
  return parts;
}

// ================= EXPRESSION PARSER =================
type ETokType = 'NUM' | 'STR' | 'IDENT' | 'OP' | 'LP' | 'RP' | 'LB' | 'RB' | 'COMMA';
interface ETok {
  type: ETokType;
  value: string;
}

function tokenizeExpr(src: string): ETok[] {
  const toks: ETok[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '"' || ch === "'") {
      const q = ch;
      let s = '';
      i++;
      while (i < src.length && src[i] !== q) {
        s += src[i++];
      }
      if (src[i] !== q) throw new Error('Unterminated string literal.');
      i++;
      toks.push({ type: 'STR', value: s });
      continue;
    }
    if (/[0-9]/.test(ch)) {
      let n = '';
      while (i < src.length && /[0-9.]/.test(src[i])) n += src[i++];
      toks.push({ type: 'NUM', value: n });
      continue;
    }
    if (ch === '<' && (src[i + 1] === '=' || src[i + 1] === '>')) {
      toks.push({ type: 'OP', value: ch + src[i + 1] });
      i += 2;
      continue;
    }
    if ((ch === '>' || ch === '!') && src[i + 1] === '=') {
      toks.push({ type: 'OP', value: ch + src[i + 1] });
      i += 2;
      continue;
    }
    if ('+-*/^=<>&'.includes(ch)) {
      toks.push({ type: 'OP', value: ch });
      i++;
      continue;
    }
    if (ch === '(') { toks.push({ type: 'LP', value: ch }); i++; continue; }
    if (ch === ')') { toks.push({ type: 'RP', value: ch }); i++; continue; }
    if (ch === '[') { toks.push({ type: 'LB', value: ch }); i++; continue; }
    if (ch === ']') { toks.push({ type: 'RB', value: ch }); i++; continue; }
    if (ch === ',') { toks.push({ type: 'COMMA', value: ch }); i++; continue; }
    if (/[A-Za-z_]/.test(ch)) {
      let w = '';
      while (i < src.length && /[A-Za-z0-9_]/.test(src[i])) w += src[i++];
      toks.push({ type: 'IDENT', value: w });
      continue;
    }
    throw new Error(`Unexpected character "${ch}" in expression.`);
  }
  return toks;
}

class Runtime {
  output: string[] = [];
  stdinLines: string[];
  stdinIdx = 0;
  steps = 0;
  subs = new Map<string, SubDef>();
  files = new Map<string, { mode: 'READ' | 'WRITE' | 'APPEND'; lines: string[]; pos: number }>();
  fileStore = new Map<string, string[]>();

  constructor(stdin: string) {
    const normalized = stdin.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    this.stdinLines = normalized === '' ? [] : normalized.split('\n');
  }

  tick() {
    this.steps++;
    if (this.steps > MAX_STEPS) {
      throw new Error('Program stopped: exceeded 10,000 steps (check for an infinite loop).');
    }
  }

  readInput(varType?: string): PValue {
    if (this.stdinIdx >= this.stdinLines.length) {
      throw new Error(
        'INPUT ran out of values. Type one input value per line in the "Program Input" box above.'
      );
    }
    const raw = this.stdinLines[this.stdinIdx++];
    const trimmed = raw.trim();
    if (varType === 'STRING' || varType === 'CHAR') return raw;
    if (varType === 'BOOLEAN') {
      const up = trimmed.toUpperCase();
      if (up === 'TRUE' || up === '1') return true;
      if (up === 'FALSE' || up === '0') return false;
      throw new Error(`Expected TRUE/FALSE (or 1/0) for BOOLEAN input, got "${raw}".`);
    }
    if (varType === 'INTEGER') {
      const n = Number(trimmed);
      if (!Number.isInteger(n) || trimmed === '') throw new Error(`Expected INTEGER input, got "${raw}".`);
      return n;
    }
    if (varType === 'REAL') {
      const n = Number(trimmed);
      if (Number.isNaN(n) || trimmed === '') throw new Error(`Expected REAL input, got "${raw}".`);
      return n;
    }
    // Untyped INPUT: auto-parse numbers/booleans when unambiguous
    if (trimmed !== '' && !Number.isNaN(Number(trimmed))) return Number(trimmed);
    if (trimmed.toUpperCase() === 'TRUE') return true;
    if (trimmed.toUpperCase() === 'FALSE') return false;
    return raw;
  }

  evalExpr(src: string, env: Env): PValue {
    const toks = tokenizeExpr(src);
    let pos = 0;

    const peek = () => toks[pos];
    const next = () => toks[pos++];

    const parseOr = (): PValue => {
      let left = parseAnd();
      while (peek()?.type === 'IDENT' && peek().value.toUpperCase() === 'OR') {
        next();
        const right = parseAnd();
        left = Boolean(left) || Boolean(right);
      }
      return left;
    };

    const parseAnd = (): PValue => {
      let left = parseNot();
      while (peek()?.type === 'IDENT' && peek().value.toUpperCase() === 'AND') {
        next();
        const right = parseNot();
        left = Boolean(left) && Boolean(right);
      }
      return left;
    };

    const parseNot = (): PValue => {
      if (peek()?.type === 'IDENT' && peek().value.toUpperCase() === 'NOT') {
        next();
        return !Boolean(parseNot());
      }
      return parseCompare();
    };

    const parseCompare = (): PValue => {
      let left = parseAdd();
      while (peek()?.type === 'OP' && ['=', '<>', '!=', '<', '<=', '>', '>='].includes(peek().value)) {
        const op = next().value;
        const right = parseAdd();
        switch (op) {
          case '=': left = left === right; break;
          case '<>':
          case '!=': left = left !== right; break;
          case '<': left = (left as any) < (right as any); break;
          case '<=': left = (left as any) <= (right as any); break;
          case '>': left = (left as any) > (right as any); break;
          case '>=': left = (left as any) >= (right as any); break;
        }
      }
      return left;
    };

    const parseAdd = (): PValue => {
      let left = parseMul();
      while (peek()?.type === 'OP' && ['+', '-', '&'].includes(peek().value)) {
        const op = next().value;
        const right = parseMul();
        if (op === '&') {
          left = `${left ?? ''}${right ?? ''}`;
        } else if (op === '+') {
          if (typeof left === 'string' || typeof right === 'string') {
            left = `${left ?? ''}${right ?? ''}`;
          } else {
            left = Number(left) + Number(right);
          }
        } else {
          left = Number(left) - Number(right);
        }
      }
      return left;
    };

    const parseMul = (): PValue => {
      let left = parsePow();
      while (
        (peek()?.type === 'OP' && (peek().value === '*' || peek().value === '/')) ||
        (peek()?.type === 'IDENT' && (peek().value.toUpperCase() === 'DIV' || peek().value.toUpperCase() === 'MOD'))
      ) {
        const op = next().value.toUpperCase();
        const right = parsePow();
        if (op === '*') left = Number(left) * Number(right);
        else if (op === '/') {
          if (Number(right) === 0) throw new Error('Division by zero.');
          left = Number(left) / Number(right);
        } else if (op === 'DIV') {
          if (Number(right) === 0) throw new Error('Division by zero in DIV.');
          left = Math.trunc(Number(left) / Number(right));
        } else if (op === 'MOD') {
          if (Number(right) === 0) throw new Error('Division by zero in MOD.');
          left = Number(left) % Number(right);
        }
      }
      return left;
    };

    const parsePow = (): PValue => {
      let left = parseUnary();
      if (peek()?.type === 'OP' && peek().value === '^') {
        next();
        const right = parsePow();
        left = Math.pow(Number(left), Number(right));
      }
      return left;
    };

    const parseUnary = (): PValue => {
      if (peek()?.type === 'OP' && peek().value === '-') {
        next();
        return -Number(parseUnary());
      }
      if (peek()?.type === 'OP' && peek().value === '+') {
        next();
        return Number(parseUnary());
      }
      return parsePrimary();
    };

    const parsePrimary = (): PValue => {
      const tok = peek();
      if (!tok) throw new Error('Unexpected end of expression.');
      if (tok.type === 'NUM') { next(); return Number(tok.value); }
      if (tok.type === 'STR') { next(); return tok.value; }
      if (tok.type === 'LP') {
        next();
        const v = parseOr();
        if (peek()?.type !== 'RP') throw new Error('Missing closing ")".');
        next();
        return v;
      }
      if (tok.type === 'IDENT') {
        next();
        const upper = tok.value.toUpperCase();
        if (upper === 'TRUE') return true;
        if (upper === 'FALSE') return false;

        // Function call
        if (peek()?.type === 'LP') {
          next();
          const args: PValue[] = [];
          if (peek()?.type !== 'RP') {
            args.push(parseOr());
            while (peek()?.type === 'COMMA') {
              next();
              args.push(parseOr());
            }
          }
          if (peek()?.type !== 'RP') throw new Error(`Missing ")" in call to ${tok.value}.`);
          next();
          return this.callFunction(tok.value, args, env);
        }

        // Array indexing: Arr[i] or Arr[r, c]
        if (peek()?.type === 'LB') {
          next();
          const idx1 = Number(parseOr());
          let idx2: number | undefined;
          if (peek()?.type === 'COMMA') {
            next();
            idx2 = Number(parseOr());
          }
          if (peek()?.type !== 'RB') throw new Error(`Missing "]" after index on ${tok.value}.`);
          next();
          const arr = getArray(env, tok.value);
          if (!arr) throw new Error(`Array "${tok.value}" has not been declared.`);
          if (idx1 < arr.low1 || idx1 > arr.high1) {
            throw new Error(`Array index ${idx1} out of bounds [${arr.low1}:${arr.high1}] for "${tok.value}".`);
          }
          if (arr.low2 !== undefined && arr.high2 !== undefined) {
            if (idx2 === undefined || idx2 < arr.low2 || idx2 > arr.high2) {
              throw new Error(`2D array index out of bounds for "${tok.value}".`);
            }
            return arr.data.get(`${idx1},${idx2}`) ?? null;
          }
          return arr.data.get(`${idx1}`) ?? null;
        }

        const found = getVar(env, tok.value);
        if (!found.found) {
          throw new Error(`Variable "${tok.value}" is used before being assigned or declared.`);
        }
        return found.value;
      }
      throw new Error(`Unexpected token "${tok.value}" in expression.`);
    };

    const val = parseOr();
    if (pos < toks.length) {
      throw new Error(`Unexpected token "${toks[pos].value}" in expression.`);
    }
    return val;
  }

  callFunction(name: string, args: PValue[], callerEnv: Env): PValue {
    const upper = name.toUpperCase();
    switch (upper) {
      case 'LENGTH':
        return String(args[0] ?? '').length;
      case 'UCASE':
        return String(args[0] ?? '').toUpperCase();
      case 'LCASE':
        return String(args[0] ?? '').toLowerCase();
      case 'SUBSTRING': {
        // Cambridge IGCSE SUBSTRING(s, start1Based, length)
        const s = String(args[0] ?? '');
        const start = Math.max(1, Number(args[1] ?? 1)) - 1;
        const len = Math.max(0, Number(args[2] ?? 0));
        return s.slice(start, start + len);
      }
      case 'ROUND': {
        const n = Number(args[0] ?? 0);
        const dp = Number(args[1] ?? 0);
        return Number(n.toFixed(dp));
      }
      case 'RANDOM':
        return Math.random();
      case 'INT':
        return Math.trunc(Number(args[0] ?? 0));
      case 'REAL':
        return Number(args[0] ?? 0);
      case 'STRING':
        return String(args[0] ?? '');
      case 'EOF': {
        const fname = String(args[0] ?? '');
        const f = this.files.get(fname);
        if (!f) throw new Error(`File "${fname}" is not open.`);
        return f.pos >= f.lines.length;
      }
    }

    const sub = this.subs.get(name.toLowerCase());
    if (!sub || sub.kind !== 'FUNCTION') {
      throw new Error(`Unknown function "${name}".`);
    }
    const localEnv = createEnv(callerEnv);
    sub.params.forEach((p, i) => {
      localEnv.vars.set(p.toLowerCase(), args[i] ?? null);
    });
    const ret = this.execBlock(sub.body, localEnv);
    if (ret.returned) return ret.returnValue ?? null;
    return null;
  }

  execBlock(lines: string[], env: Env): { returned?: boolean; returnValue?: PValue } {
    let i = 0;
    while (i < lines.length) {
      this.tick();
      const line = lines[i].trim();
      if (!line) { i++; continue; }

      const upper = line.toUpperCase();

      // DECLARE
      if (upper.startsWith('DECLARE ')) {
        const rest = line.slice(8).trim();
        const colonIdx = rest.indexOf(':');
        if (colonIdx === -1) throw new Error(`Invalid DECLARE syntax: "${line}". Use DECLARE Name : TYPE.`);
        const namesPart = rest.slice(0, colonIdx).trim();
        const typePart = rest.slice(colonIdx + 1).trim();
        const arrMatch = typePart.match(/^ARRAY\s*\[\s*(-?\d+)\s*:\s*(-?\d+)(?:\s*,\s*(-?\d+)\s*:\s*(-?\d+))?\s*\]\s*OF\s+(\w+)$/i);
        if (arrMatch) {
          const low1 = Number(arrMatch[1]);
          const high1 = Number(arrMatch[2]);
          const low2 = arrMatch[3] !== undefined ? Number(arrMatch[3]) : undefined;
          const high2 = arrMatch[4] !== undefined ? Number(arrMatch[4]) : undefined;
          const elemType = arrMatch[5].toUpperCase();
          const defVal = defaultValueForType(elemType);
          for (const rawName of namesPart.split(',')) {
            const key = rawName.trim().toLowerCase();
            const data = new Map<string, PValue>();
            if (low2 !== undefined && high2 !== undefined) {
              for (let r = low1; r <= high1; r++) {
                for (let c = low2; c <= high2; c++) data.set(`${r},${c}`, defVal);
              }
            } else {
              for (let idx = low1; idx <= high1; idx++) data.set(`${idx}`, defVal);
            }
            env.arrays.set(key, { low1, high1, low2, high2, data });
          }
        } else {
          const tName = typePart.toUpperCase();
          for (const rawName of namesPart.split(',')) {
            const key = rawName.trim().toLowerCase();
            env.types.set(key, tName);
            if (!env.vars.has(key)) env.vars.set(key, defaultValueForType(tName));
          }
        }
        i++;
        continue;
      }

      // CONSTANT
      if (upper.startsWith('CONSTANT ')) {
        const rest = line.slice(9).trim();
        const m = rest.match(/^([A-Za-z_]\w*)\s*(?:=|←|<-)\s*(.+)$/);
        if (!m) throw new Error(`Invalid CONSTANT syntax: "${line}".`);
        const key = m[1].toLowerCase();
        env.vars.set(key, this.evalExpr(m[2], env));
        env.constants.add(key);
        i++;
        continue;
      }

      // INPUT
      if (upper.startsWith('INPUT ')) {
        const target = line.slice(6).trim();
        const arrM = target.match(/^([A-Za-z_]\w*)\s*\[(.+)\]$/);
        if (arrM) {
          const arr = getArray(env, arrM[1]);
          if (!arr) throw new Error(`Array "${arrM[1]}" has not been declared.`);
          const idxs = splitTopLevelCommas(arrM[2]).map((e) => Number(this.evalExpr(e, env)));
          const val = this.readInput();
          arr.data.set(idxs.length === 2 ? `${idxs[0]},${idxs[1]}` : `${idxs[0]}`, val);
        } else {
          const vType = getType(env, target);
          setVar(env, target, this.readInput(vType));
        }
        i++;
        continue;
      }

      // OUTPUT / PRINT
      if (upper.startsWith('OUTPUT ') || upper.startsWith('PRINT ')) {
        const rest = line.replace(/^(OUTPUT|PRINT)\s+/i, '');
        const parts = splitTopLevelCommas(rest);
        const rendered = parts
          .map((p) => {
            const v = this.evalExpr(p, env);
            if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
            return v === null ? '' : String(v);
          })
          .join(' ');
        this.output.push(rendered);
        i++;
        continue;
      }

      // OPENFILE
      if (upper.startsWith('OPENFILE ')) {
        const m = line.match(/^OPENFILE\s+(.+?)\s+FOR\s+(READ|WRITE|APPEND)$/i);
        if (!m) throw new Error(`Invalid OPENFILE syntax: "${line}".`);
        const fname = String(this.evalExpr(m[1], env));
        const mode = m[2].toUpperCase() as 'READ' | 'WRITE' | 'APPEND';
        if (mode === 'WRITE') {
          this.fileStore.set(fname, []);
          this.files.set(fname, { mode, lines: [], pos: 0 });
        } else if (mode === 'APPEND') {
          const existing = this.fileStore.get(fname) ?? [];
          this.fileStore.set(fname, existing);
          this.files.set(fname, { mode, lines: existing, pos: existing.length });
        } else {
          const existing = this.fileStore.get(fname) ?? [];
          this.files.set(fname, { mode, lines: [...existing], pos: 0 });
        }
        i++;
        continue;
      }

      // WRITEFILE
      if (upper.startsWith('WRITEFILE ')) {
        const parts = splitTopLevelCommas(line.slice(10));
        if (parts.length < 2) throw new Error(`Invalid WRITEFILE syntax: "${line}".`);
        const fname = String(this.evalExpr(parts[0], env));
        const data = String(this.evalExpr(parts[1], env) ?? '');
        const f = this.files.get(fname);
        if (!f || (f.mode !== 'WRITE' && f.mode !== 'APPEND')) {
          throw new Error(`File "${fname}" is not open for WRITE/APPEND.`);
        }
        f.lines.push(data);
        this.fileStore.set(fname, [...f.lines]);
        i++;
        continue;
      }

      // READFILE
      if (upper.startsWith('READFILE ')) {
        const parts = splitTopLevelCommas(line.slice(9));
        if (parts.length < 2) throw new Error(`Invalid READFILE syntax: "${line}".`);
        const fname = String(this.evalExpr(parts[0], env));
        const target = parts[1].trim();
        const f = this.files.get(fname);
        if (!f || f.mode !== 'READ') throw new Error(`File "${fname}" is not open for READ.`);
        if (f.pos >= f.lines.length) throw new Error(`Reached end of file "${fname}".`);
        setVar(env, target, f.lines[f.pos++]);
        i++;
        continue;
      }

      // CLOSEFILE
      if (upper.startsWith('CLOSEFILE ')) {
        const fname = String(this.evalExpr(line.slice(10).trim(), env));
        this.files.delete(fname);
        i++;
        continue;
      }

      // CALL Procedure
      if (upper.startsWith('CALL ')) {
        const callStr = line.slice(5).trim();
        const m = callStr.match(/^([A-Za-z_]\w*)(?:\s*\((.*)\))?$/);
        if (!m) throw new Error(`Invalid CALL syntax: "${line}".`);
        const sub = this.subs.get(m[1].toLowerCase());
        if (!sub || sub.kind !== 'PROCEDURE') throw new Error(`Unknown procedure "${m[1]}".`);
        const argExprs = m[2] && m[2].trim() ? splitTopLevelCommas(m[2]) : [];
        const localEnv = createEnv(env);
        sub.params.forEach((p, idx) => {
          localEnv.vars.set(p.toLowerCase(), argExprs[idx] ? this.evalExpr(argExprs[idx], env) : null);
        });
        this.execBlock(sub.body, localEnv);
        i++;
        continue;
      }

      // RETURN
      if (upper.startsWith('RETURN ') || upper === 'RETURN') {
        const expr = line.slice(6).trim();
        return { returned: true, returnValue: expr ? this.evalExpr(expr, env) : null };
      }

      // IF ... THEN ... [ELSE ...] ENDIF
      if (upper.startsWith('IF ')) {
        // Check single-line IF cond THEN stmt
        const inlineThen = line.match(/^IF\s+(.+?)\s+THEN\s+(.+)$/i);
        if (inlineThen && !/^THEN\s*$/i.test(inlineThen[2])) {
          if (Boolean(this.evalExpr(inlineThen[1], env))) {
            const res = this.execBlock([inlineThen[2]], env);
            if (res.returned) return res;
          }
          i++;
          continue;
        }
        const condMatch = line.match(/^IF\s+(.+?)(?:\s+THEN)?$/i);
        if (!condMatch) throw new Error(`Invalid IF syntax: "${line}".`);
        let depth = 1;
        let elseIdx = -1;
        let endIdx = -1;
        let j = i + 1;
        // Handle THEN on the next line
        if (lines[j]?.trim().toUpperCase() === 'THEN') j++;
        const thenStart = j;
        while (j < lines.length) {
          const u = lines[j].trim().toUpperCase();
          if (u.startsWith('IF ') && !/^IF\s+.+\s+THEN\s+.+$/i.test(lines[j].trim())) depth++;
          else if (u === 'ENDIF') {
            depth--;
            if (depth === 0) { endIdx = j; break; }
          } else if (u === 'ELSE' && depth === 1 && elseIdx === -1) {
            elseIdx = j;
          }
          j++;
        }
        if (endIdx === -1) throw new Error('Missing ENDIF for IF statement.');
        const condVal = Boolean(this.evalExpr(condMatch[1], env));
        const branch = condVal
          ? lines.slice(thenStart, elseIdx !== -1 ? elseIdx : endIdx)
          : elseIdx !== -1
            ? lines.slice(elseIdx + 1, endIdx)
            : [];
        const res = this.execBlock(branch, env);
        if (res.returned) return res;
        i = endIdx + 1;
        continue;
      }

      // CASE OF expr ... ENDCASE
      if (upper.startsWith('CASE OF ')) {
        const expr = line.slice(8).trim();
        let depth = 1;
        let endIdx = -1;
        for (let j = i + 1; j < lines.length; j++) {
          const u = lines[j].trim().toUpperCase();
          if (u.startsWith('CASE OF ')) depth++;
          else if (u === 'ENDCASE') {
            depth--;
            if (depth === 0) { endIdx = j; break; }
          }
        }
        if (endIdx === -1) throw new Error('Missing ENDCASE for CASE OF statement.');
        const targetVal = this.evalExpr(expr, env);
        let matched = false;
        let otherwiseStmts: string[] = [];
        for (let j = i + 1; j < endIdx; j++) {
          const cl = lines[j].trim();
          if (!cl) continue;
          if (/^OTHERWISE\b/i.test(cl)) {
            const after = cl.replace(/^OTHERWISE\s*:?\s*/i, '').trim();
            if (after) otherwiseStmts.push(after);
            continue;
          }
          const colon = cl.indexOf(':');
          if (colon !== -1) {
            const label = cl.slice(0, colon).trim();
            const stmt = cl.slice(colon + 1).trim();
            const rangeM = label.match(/^(.+?)\s+TO\s+(.+)$/i);
            let hit = false;
            if (rangeM) {
              const lo = this.evalExpr(rangeM[1], env);
              const hi = this.evalExpr(rangeM[2], env);
              hit = (targetVal as any) >= (lo as any) && (targetVal as any) <= (hi as any);
            } else {
              hit = targetVal === this.evalExpr(label, env);
            }
            if (hit && !matched) {
              matched = true;
              if (stmt) {
                const res = this.execBlock([stmt], env);
                if (res.returned) return res;
              }
            }
          }
        }
        if (!matched && otherwiseStmts.length > 0) {
          const res = this.execBlock(otherwiseStmts, env);
          if (res.returned) return res;
        }
        i = endIdx + 1;
        continue;
      }

      // FOR var ← start TO end [STEP step] ... NEXT var
      if (upper.startsWith('FOR ')) {
        const m = line.match(/^FOR\s+([A-Za-z_]\w*)\s*(?:←|<-|=)\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(.+))?$/i);
        if (!m) throw new Error(`Invalid FOR loop header: "${line}".`);
        const loopVar = m[1];
        const startVal = Number(this.evalExpr(m[2], env));
        const endVal = Number(this.evalExpr(m[3], env));
        const stepVal = m[4] ? Number(this.evalExpr(m[4], env)) : 1;
        if (stepVal === 0) throw new Error('FOR loop STEP cannot be 0.');

        let depth = 1;
        let endIdx = -1;
        for (let j = i + 1; j < lines.length; j++) {
          const u = lines[j].trim().toUpperCase();
          if (u.startsWith('FOR ')) depth++;
          else if (u.startsWith('NEXT')) {
            depth--;
            if (depth === 0) { endIdx = j; break; }
          }
        }
        if (endIdx === -1) throw new Error(`Missing NEXT ${loopVar} for FOR loop.`);
        const body = lines.slice(i + 1, endIdx);
        for (
          let v = startVal;
          stepVal > 0 ? v <= endVal : v >= endVal;
          v += stepVal
        ) {
          this.tick();
          setVar(env, loopVar, v);
          const res = this.execBlock(body, env);
          if (res.returned) return res;
        }
        i = endIdx + 1;
        continue;
      }

      // WHILE cond [DO] ... ENDWHILE
      if (upper.startsWith('WHILE ')) {
        const condExpr = line.replace(/^WHILE\s+/i, '').replace(/\s+DO$/i, '').trim();
        let depth = 1;
        let endIdx = -1;
        let bodyStart = i + 1;
        if (lines[bodyStart]?.trim().toUpperCase() === 'DO') bodyStart++;
        for (let j = bodyStart; j < lines.length; j++) {
          const u = lines[j].trim().toUpperCase();
          if (u.startsWith('WHILE ')) depth++;
          else if (u === 'ENDWHILE') {
            depth--;
            if (depth === 0) { endIdx = j; break; }
          }
        }
        if (endIdx === -1) throw new Error('Missing ENDWHILE for WHILE loop.');
        const body = lines.slice(bodyStart, endIdx);
        while (Boolean(this.evalExpr(condExpr, env))) {
          this.tick();
          const res = this.execBlock(body, env);
          if (res.returned) return res;
        }
        i = endIdx + 1;
        continue;
      }

      // REPEAT ... UNTIL cond
      if (upper === 'REPEAT') {
        let depth = 1;
        let endIdx = -1;
        for (let j = i + 1; j < lines.length; j++) {
          const u = lines[j].trim().toUpperCase();
          if (u === 'REPEAT') depth++;
          else if (u.startsWith('UNTIL ')) {
            depth--;
            if (depth === 0) { endIdx = j; break; }
          }
        }
        if (endIdx === -1) throw new Error('Missing UNTIL <condition> for REPEAT loop.');
        const untilCond = lines[endIdx].trim().slice(6).trim();
        const body = lines.slice(i + 1, endIdx);
        do {
          this.tick();
          const res = this.execBlock(body, env);
          if (res.returned) return res;
        } while (!Boolean(this.evalExpr(untilCond, env)));
        i = endIdx + 1;
        continue;
      }

      // Assignment: Var ← expr  OR  Arr[i] ← expr  OR  Grid[r, c] ← expr
      const assignM = line.match(/^([A-Za-z_]\w*)(?:\s*\[(.+?)\])?\s*(?:←|<-)\s*(.+)$/);
      if (assignM) {
        const name = assignM[1];
        const idxExpr = assignM[2];
        const rhsVal = this.evalExpr(assignM[3], env);
        if (idxExpr !== undefined) {
          const arr = getArray(env, name);
          if (!arr) throw new Error(`Array "${name}" has not been declared.`);
          const idxs = splitTopLevelCommas(idxExpr).map((e) => Number(this.evalExpr(e, env)));
          if (idxs[0] < arr.low1 || idxs[0] > arr.high1) {
            throw new Error(`Array index ${idxs[0]} out of bounds [${arr.low1}:${arr.high1}] for "${name}".`);
          }
          if (arr.low2 !== undefined && arr.high2 !== undefined) {
            if (idxs.length < 2 || idxs[1] < arr.low2 || idxs[1] > arr.high2) {
              throw new Error(`2D array index out of bounds for "${name}".`);
            }
            arr.data.set(`${idxs[0]},${idxs[1]}`, rhsVal);
          } else {
            arr.data.set(`${idxs[0]}`, rhsVal);
          }
        } else {
          setVar(env, name, rhsVal);
        }
        i++;
        continue;
      }

      throw new Error(`Unrecognised pseudocode statement: "${line}". Use ← (or <-) for assignment.`);
    }
    return {};
  }
}

export function runPseudocode(source: string, stdin = ''): PseudocodeRunResult {
  try {
    const rawLines = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const cleanLines = rawLines.map((l) => stripComment(l).trim()).filter((l) => l.length > 0);
    if (cleanLines.length === 0) {
      return { ok: false, output: [], error: 'Write some Cambridge pseudocode first.' };
    }

    const rt = new Runtime(stdin);
    const mainLines: string[] = [];

    // Extract PROCEDURE and FUNCTION definitions first
    for (let i = 0; i < cleanLines.length; i++) {
      const line = cleanLines[i];
      const procM = line.match(/^PROCEDURE\s+([A-Za-z_]\w*)\s*(?:\((.*)\))?$/i);
      const funcM = line.match(/^FUNCTION\s+([A-Za-z_]\w*)\s*(?:\((.*)\))?\s+RETURNS\s+\w+$/i);
      if (procM || funcM) {
        const isFunc = Boolean(funcM);
        const name = (funcM ?? procM)![1];
        const paramsRaw = (funcM ?? procM)![2] ?? '';
        const params = paramsRaw.trim()
          ? splitTopLevelCommas(paramsRaw).map((p) => p.split(':')[0].replace(/^BYVAL\s+|^BYREF\s+/i, '').trim())
          : [];
        const endKw = isFunc ? 'ENDFUNCTION' : 'ENDPROCEDURE';
        let endIdx = -1;
        for (let j = i + 1; j < cleanLines.length; j++) {
          if (cleanLines[j].toUpperCase() === endKw) { endIdx = j; break; }
        }
        if (endIdx === -1) throw new Error(`Missing ${endKw} for ${name}.`);
        rt.subs.set(name.toLowerCase(), {
          kind: isFunc ? 'FUNCTION' : 'PROCEDURE',
          name,
          params,
          body: cleanLines.slice(i + 1, endIdx),
        });
        i = endIdx;
      } else {
        mainLines.push(line);
      }
    }

    const rootEnv = createEnv();
    rt.execBlock(mainLines, rootEnv);
    return { ok: true, output: rt.output };
  } catch (err) {
    return {
      ok: false,
      output: [],
      error: err instanceof Error ? err.message : 'Pseudocode runtime error.',
    };
  }
}

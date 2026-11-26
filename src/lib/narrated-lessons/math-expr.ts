/**
 * Pure, zero-dependency, restricted mathematical expression tokenizer, parser,
 * and bounded AST evaluator for GAM EDU's GraphSliderEngine (Step 4A).
 *
 * Security & Correctness Guarantees:
 * - Zero eval(), zero new Function(), zero dynamic property access, zero global object access.
 * - Parse and validate once into a bounded AST; evaluate repeatedly against variable bindings.
 * - Explicit operator precedence:
 *     1. + / - (left-associative)
 *     2. * / / (left-associative)
 *     3. Unary + / - (binds looser than ^ so -2^2 = -4 and (-2)^2 = 4)
 *     4. ^ (right-associative so 2^3^2 = 512; exponent allows unary +/- so 2^-3 = 0.125)
 *     5. Primary (number literals, PI, E, declared variables, parentheses, allowlisted functions)
 * - Explicit function arity:
 *     - Unary (arity 1): abs, sin, cos, tan, sqrt, ln, log10, exp, deg2rad, rad2deg, floor, ceil, round
 *     - Multi-arg (arity 2..4): min, max
 * - Strict mathematical domain checks & non-finite / overflow guards.
 */

export const MATH_EXPR_LIMITS = {
  maxSourceLength: 256,
  maxAstDepth: 8,
  maxAstNodes: 48,
  maxAbsIntermediate: 1e12,
  maxExponentAbs: 100,
} as const;

export type MathConstName = 'PI' | 'E';

export type UnaryMathFn =
  | 'abs'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'sqrt'
  | 'ln'
  | 'log10'
  | 'exp'
  | 'deg2rad'
  | 'rad2deg'
  | 'floor'
  | 'ceil'
  | 'round';

export type MultiArgMathFn = 'min' | 'max';

export type MathFnName = UnaryMathFn | MultiArgMathFn;

export const MATH_FUNCTION_ARITY: Record<MathFnName, { min: number; max: number }> = {
  abs: { min: 1, max: 1 },
  sin: { min: 1, max: 1 },
  cos: { min: 1, max: 1 },
  tan: { min: 1, max: 1 },
  sqrt: { min: 1, max: 1 },
  ln: { min: 1, max: 1 },
  log10: { min: 1, max: 1 },
  exp: { min: 1, max: 1 },
  deg2rad: { min: 1, max: 1 },
  rad2deg: { min: 1, max: 1 },
  floor: { min: 1, max: 1 },
  ceil: { min: 1, max: 1 },
  round: { min: 1, max: 1 },
  min: { min: 2, max: 4 },
  max: { min: 2, max: 4 },
};

const CONSTANTS: Record<MathConstName, number> = {
  PI: Math.PI,
  E: Math.E,
};

export type MathAstNode =
  | { type: 'number'; value: number }
  | { type: 'const'; name: MathConstName }
  | { type: 'var'; name: string }
  | { type: 'unary'; op: '+' | '-'; arg: MathAstNode }
  | { type: 'binary'; op: '+' | '-' | '*' | '/' | '^'; left: MathAstNode; right: MathAstNode }
  | { type: 'call'; name: MathFnName; args: MathAstNode[] };

type Token =
  | { kind: 'number'; value: number }
  | { kind: 'ident'; value: string }
  | { kind: 'op'; value: '+' | '-' | '*' | '/' | '^' }
  | { kind: 'lparen' }
  | { kind: 'rparen' }
  | { kind: 'comma' }
  | { kind: 'eof' };

function tokenize(source: string): Token[] {
  if (typeof source !== 'string' || source.trim().length === 0) {
    throw new Error('Mathematical expression must be a non-empty string.');
  }
  if (source.length > MATH_EXPR_LIMITS.maxSourceLength) {
    throw new Error(`Mathematical expression exceeds maximum length (${MATH_EXPR_LIMITS.maxSourceLength} chars).`);
  }

  const tokens: Token[] = [];
  let i = 0;
  const n = source.length;

  while (i < n) {
    const ch = source[i];
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i++;
      continue;
    }

    if ((ch >= '0' && ch <= '9') || (ch === '.' && i + 1 < n && source[i + 1] >= '0' && source[i + 1] <= '9')) {
      const start = i;
      let seenDot = false;
      while (i < n && ((source[i] >= '0' && source[i] <= '9') || (!seenDot && source[i] === '.'))) {
        if (source[i] === '.') seenDot = true;
        i++;
      }
      // Optional scientific notation e.g. 1e-3 or 2.5e4
      if (i < n && (source[i] === 'e' || source[i] === 'E')) {
        const expPos = i;
        i++;
        if (i < n && (source[i] === '+' || source[i] === '-')) i++;
        const digitsStart = i;
        while (i < n && source[i] >= '0' && source[i] <= '9') i++;
        if (i === digitsStart) {
          throw new Error(`Invalid numeric exponent near position ${expPos}.`);
        }
      }
      const raw = source.slice(start, i);
      const val = Number(raw);
      if (!Number.isFinite(val)) {
        throw new Error(`Invalid numeric literal "${raw}".`);
      }
      tokens.push({ kind: 'number', value: val });
      continue;
    }

    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_') {
      const start = i;
      i++;
      while (
        i < n &&
        ((source[i] >= 'a' && source[i] <= 'z') ||
          (source[i] >= 'A' && source[i] <= 'Z') ||
          (source[i] >= '0' && source[i] <= '9') ||
          source[i] === '_')
      ) {
        i++;
      }
      tokens.push({ kind: 'ident', value: source.slice(start, i) });
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      tokens.push({ kind: 'op', value: ch });
      i++;
      continue;
    }
    if (ch === '(') {
      tokens.push({ kind: 'lparen' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ kind: 'rparen' });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ kind: 'comma' });
      i++;
      continue;
    }

    throw new Error(`Unexpected character "${ch}" in mathematical expression.`);
  }

  tokens.push({ kind: 'eof' });
  return tokens;
}

export interface ParsedMathExpr {
  source: string;
  ast: MathAstNode;
  nodeCount: number;
  maxDepth: number;
  usedVariables: string[];
}

export function parseMathExpr(
  source: string,
  allowedVariables: Iterable<string>
): ParsedMathExpr {
  const allowedSet = new Set(allowedVariables);
  const tokens = tokenize(source);
  let pos = 0;
  let nodeCount = 0;
  let maxDepth = 0;
  const usedVars = new Set<string>();

  const peek = (): Token => tokens[pos];
  const consume = (): Token => tokens[pos++];

  const trackNode = (depth: number) => {
    nodeCount += 1;
    if (depth > maxDepth) maxDepth = depth;
    if (nodeCount > MATH_EXPR_LIMITS.maxAstNodes) {
      throw new Error(`Mathematical expression exceeds maximum AST nodes (${MATH_EXPR_LIMITS.maxAstNodes}).`);
    }
    if (depth > MATH_EXPR_LIMITS.maxAstDepth) {
      throw new Error(`Mathematical expression exceeds maximum AST depth (${MATH_EXPR_LIMITS.maxAstDepth}).`);
    }
  };

  // addSub := mulDiv ( ('+' | '-') mulDiv )*
  const parseAddSub = (depth: number): MathAstNode => {
    let left = parseMulDiv(depth);
    while (peek().kind === 'op' && ((peek() as { value: string }).value === '+' || (peek() as { value: string }).value === '-')) {
      const op = (consume() as { kind: 'op'; value: '+' | '-' }).value;
      const right = parseMulDiv(depth + 1);
      trackNode(depth + 1);
      left = { type: 'binary', op, left, right };
    }
    return left;
  };

  // mulDiv := unary ( ('*' | '/') unary )*
  const parseMulDiv = (depth: number): MathAstNode => {
    let left = parseUnary(depth);
    while (peek().kind === 'op' && ((peek() as { value: string }).value === '*' || (peek() as { value: string }).value === '/')) {
      const op = (consume() as { kind: 'op'; value: '*' | '/' }).value;
      const right = parseUnary(depth + 1);
      trackNode(depth + 1);
      left = { type: 'binary', op, left, right };
    }
    return left;
  };

  // unary := ('+' | '-') unary | power
  // Note: unary binds looser than power so -2^2 === -(2^2) === -4
  const parseUnary = (depth: number): MathAstNode => {
    if (peek().kind === 'op' && ((peek() as { value: string }).value === '+' || (peek() as { value: string }).value === '-')) {
      const op = (consume() as { kind: 'op'; value: '+' | '-' }).value;
      const arg = parseUnary(depth + 1);
      trackNode(depth + 1);
      return { type: 'unary', op, arg };
    }
    return parsePower(depth);
  };

  // power := primary ('^' unary)?   (right-associative, and allows 2^-3)
  const parsePower = (depth: number): MathAstNode => {
    const left = parsePrimary(depth);
    if (peek().kind === 'op' && (peek() as { value: string }).value === '^') {
      consume();
      const right = parseUnary(depth + 1);
      trackNode(depth + 1);
      return { type: 'binary', op: '^', left, right };
    }
    return left;
  };

  // primary := number | ident | ident '(' argList ')' | '(' addSub ')'
  const parsePrimary = (depth: number): MathAstNode => {
    const tok = peek();

    if (tok.kind === 'number') {
      consume();
      trackNode(depth + 1);
      return { type: 'number', value: tok.value };
    }

    if (tok.kind === 'lparen') {
      consume();
      const inner = parseAddSub(depth + 1);
      if (peek().kind !== 'rparen') {
        throw new Error('Missing closing parenthesis ")" in mathematical expression.');
      }
      consume();
      return inner;
    }

    if (tok.kind === 'ident') {
      consume();
      const name = tok.value;

      // Function call
      if (peek().kind === 'lparen') {
        consume();
        if (!Object.prototype.hasOwnProperty.call(MATH_FUNCTION_ARITY, name)) {
          throw new Error(`Unknown or disallowed math function "${name}".`);
        }
        const fnName = name as MathFnName;
        const args: MathAstNode[] = [];
        if (peek().kind !== 'rparen') {
          args.push(parseAddSub(depth + 1));
          while (peek().kind === 'comma') {
            consume();
            args.push(parseAddSub(depth + 1));
          }
        }
        if (peek().kind !== 'rparen') {
          throw new Error(`Missing closing parenthesis ")" in call to "${fnName}".`);
        }
        consume();

        const arity = MATH_FUNCTION_ARITY[fnName];
        if (args.length < arity.min || args.length > arity.max) {
          const expected = arity.min === arity.max ? `${arity.min}` : `${arity.min} to ${arity.max}`;
          throw new Error(
            `Function "${fnName}" expects ${expected} argument(s), received ${args.length}.`
          );
        }
        trackNode(depth + 1);
        return { type: 'call', name: fnName, args };
      }

      // Built-in constant
      if (name === 'PI' || name === 'E') {
        trackNode(depth + 1);
        return { type: 'const', name };
      }

      // Variable reference
      if (!allowedSet.has(name)) {
        throw new Error(`Unknown variable "${name}" in mathematical expression.`);
      }
      usedVars.add(name);
      trackNode(depth + 1);
      return { type: 'var', name };
    }

    throw new Error(`Unexpected token "${tok.kind}" in mathematical expression.`);
  };

  const ast = parseAddSub(0);
  if (peek().kind !== 'eof') {
    throw new Error(`Unexpected trailing token "${peek().kind}" in mathematical expression.`);
  }

  return {
    source,
    ast,
    nodeCount,
    maxDepth,
    usedVariables: Array.from(usedVars),
  };
}

function guardFinite(v: number): number {
  if (!Number.isFinite(v) || Math.abs(v) > MATH_EXPR_LIMITS.maxAbsIntermediate) {
    return Number.NaN;
  }
  return v;
}

/**
 * Evaluates a pre-parsed MathAstNode against numeric variable bindings.
 * Returns `NaN` for domain violations (division by 0, sqrt(<0), ln(<=0), tan pole, overflow).
 */
export function evaluateMathAst(
  node: MathAstNode,
  variables: Readonly<Record<string, number>>
): number {
  switch (node.type) {
    case 'number':
      return guardFinite(node.value);
    case 'const':
      return CONSTANTS[node.name];
    case 'var': {
      if (!Object.prototype.hasOwnProperty.call(variables, node.name)) return Number.NaN;
      const v = variables[node.name];
      return typeof v === 'number' ? guardFinite(v) : Number.NaN;
    }
    case 'unary': {
      const a = evaluateMathAst(node.arg, variables);
      if (Number.isNaN(a)) return Number.NaN;
      return guardFinite(node.op === '-' ? -a : a);
    }
    case 'binary': {
      const l = evaluateMathAst(node.left, variables);
      const r = evaluateMathAst(node.right, variables);
      if (Number.isNaN(l) || Number.isNaN(r)) return Number.NaN;
      switch (node.op) {
        case '+':
          return guardFinite(l + r);
        case '-':
          return guardFinite(l - r);
        case '*':
          return guardFinite(l * r);
        case '/':
          if (r === 0) return Number.NaN;
          return guardFinite(l / r);
        case '^': {
          if (Math.abs(r) > MATH_EXPR_LIMITS.maxExponentAbs) return Number.NaN;
          if (l === 0 && r < 0) return Number.NaN;
          if (l < 0 && !Number.isInteger(r)) return Number.NaN;
          return guardFinite(Math.pow(l, r));
        }
      }
    }
    case 'call': {
      const vals = node.args.map((arg) => evaluateMathAst(arg, variables));
      if (vals.some((v) => Number.isNaN(v))) return Number.NaN;
      switch (node.name) {
        case 'abs':
          return guardFinite(Math.abs(vals[0]));
        case 'sin':
          return guardFinite(Math.sin(vals[0]));
        case 'cos':
          return guardFinite(Math.cos(vals[0]));
        case 'tan':
          if (Math.abs(Math.cos(vals[0])) < 1e-12) return Number.NaN;
          return guardFinite(Math.tan(vals[0]));
        case 'sqrt':
          if (vals[0] < 0) return Number.NaN;
          return guardFinite(Math.sqrt(vals[0]));
        case 'ln':
          if (vals[0] <= 0) return Number.NaN;
          return guardFinite(Math.log(vals[0]));
        case 'log10':
          if (vals[0] <= 0) return Number.NaN;
          return guardFinite(Math.log10(vals[0]));
        case 'exp':
          if (vals[0] > 27) return Number.NaN; // e^27 ~ 5.3e11 < 1e12 guard
          return guardFinite(Math.exp(vals[0]));
        case 'deg2rad':
          return guardFinite((vals[0] * Math.PI) / 180);
        case 'rad2deg':
          return guardFinite((vals[0] * 180) / Math.PI);
        case 'floor':
          return guardFinite(Math.floor(vals[0]));
        case 'ceil':
          return guardFinite(Math.ceil(vals[0]));
        case 'round':
          return guardFinite(Math.round(vals[0]));
        case 'min':
          return guardFinite(Math.min(...vals));
        case 'max':
          return guardFinite(Math.max(...vals));
      }
    }
  }
}

export function tryParseMathExpr(
  source: string,
  allowedVariables: Iterable<string>
): { ok: true; parsed: ParsedMathExpr } | { ok: false; error: string } {
  try {
    return { ok: true, parsed: parseMathExpr(source, allowedVariables) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid mathematical expression.' };
  }
}

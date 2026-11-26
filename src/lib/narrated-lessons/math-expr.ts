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

export type MathEvalStatus =
  | 'ok'
  | 'undefined'
  | 'outside-real-domain'
  | 'exceeds-numeric-limit';

export type MathEvalResult =
  | { status: 'ok'; value: number }
  | { status: 'undefined'; reason: string }
  | { status: 'outside-real-domain'; reason: string }
  | { status: 'exceeds-numeric-limit'; reason: string };

function wrapFinite(v: number): MathEvalResult {
  if (!Number.isFinite(v) || Math.abs(v) > MATH_EXPR_LIMITS.maxAbsIntermediate) {
    return {
      status: 'exceeds-numeric-limit',
      reason: `Result exceeds supported display range (±${MATH_EXPR_LIMITS.maxAbsIntermediate.toExponential(0)}).`,
    };
  }
  return { status: 'ok', value: v };
}

/**
 * Evaluates a pre-parsed MathAstNode and distinguishes:
 * - Mathematically undefined operations (e.g. 1/0, ln(0), tan(PI/2))
 * - Values outside the supported real-number domain (e.g. sqrt(-4), ln(-2), (-2)^0.5)
 * - Valid mathematical results exceeding the engine's numerical display/safety limit (e.g. 10^50)
 */
export function evaluateMathAstDetailed(
  node: MathAstNode,
  variables: Readonly<Record<string, number>>
): MathEvalResult {
  switch (node.type) {
    case 'number':
      return wrapFinite(node.value);
    case 'const':
      return { status: 'ok', value: CONSTANTS[node.name] };
    case 'var': {
      if (!Object.prototype.hasOwnProperty.call(variables, node.name)) {
        return { status: 'undefined', reason: `Variable "${node.name}" has no value.` };
      }
      const v = variables[node.name];
      return typeof v === 'number'
        ? wrapFinite(v)
        : { status: 'undefined', reason: `Variable "${node.name}" is not numeric.` };
    }
    case 'unary': {
      const a = evaluateMathAstDetailed(node.arg, variables);
      if (a.status !== 'ok') return a;
      return wrapFinite(node.op === '-' ? -a.value : a.value);
    }
    case 'binary': {
      const l = evaluateMathAstDetailed(node.left, variables);
      if (l.status !== 'ok') return l;
      const r = evaluateMathAstDetailed(node.right, variables);
      if (r.status !== 'ok') return r;
      switch (node.op) {
        case '+':
          return wrapFinite(l.value + r.value);
        case '-':
          return wrapFinite(l.value - r.value);
        case '*':
          return wrapFinite(l.value * r.value);
        case '/':
          if (r.value === 0) {
            return { status: 'undefined', reason: 'Division by zero is undefined.' };
          }
          return wrapFinite(l.value / r.value);
        case '^': {
          if (l.value === 0 && r.value < 0) {
            return { status: 'undefined', reason: 'Zero raised to a negative power is undefined.' };
          }
          if (l.value < 0 && !Number.isInteger(r.value)) {
            return {
              status: 'outside-real-domain',
              reason: 'Negative base with fractional exponent is outside the real numbers.',
            };
          }
          if (Math.abs(r.value) > MATH_EXPR_LIMITS.maxExponentAbs) {
            return {
              status: 'exceeds-numeric-limit',
              reason: `Exponent magnitude exceeds supported limit (${MATH_EXPR_LIMITS.maxExponentAbs}).`,
            };
          }
          return wrapFinite(Math.pow(l.value, r.value));
        }
      }
    }
    case 'call': {
      const vals: number[] = [];
      for (const arg of node.args) {
        const res = evaluateMathAstDetailed(arg, variables);
        if (res.status !== 'ok') return res;
        vals.push(res.value);
      }
      switch (node.name) {
        case 'abs':
          return wrapFinite(Math.abs(vals[0]));
        case 'sin':
          return wrapFinite(Math.sin(vals[0]));
        case 'cos':
          return wrapFinite(Math.cos(vals[0]));
        case 'tan':
          if (Math.abs(Math.cos(vals[0])) < 1e-12) {
            return { status: 'undefined', reason: 'Tangent is undefined at odd multiples of π/2.' };
          }
          return wrapFinite(Math.tan(vals[0]));
        case 'sqrt':
          if (vals[0] < 0) {
            return {
              status: 'outside-real-domain',
              reason: 'Square root of a negative number is outside the real numbers.',
            };
          }
          return wrapFinite(Math.sqrt(vals[0]));
        case 'ln':
          if (vals[0] === 0) {
            return { status: 'undefined', reason: 'ln(0) is undefined.' };
          }
          if (vals[0] < 0) {
            return {
              status: 'outside-real-domain',
              reason: 'Natural logarithm of a negative number is outside the real numbers.',
            };
          }
          return wrapFinite(Math.log(vals[0]));
        case 'log10':
          if (vals[0] === 0) {
            return { status: 'undefined', reason: 'log10(0) is undefined.' };
          }
          if (vals[0] < 0) {
            return {
              status: 'outside-real-domain',
              reason: 'Base-10 logarithm of a negative number is outside the real numbers.',
            };
          }
          return wrapFinite(Math.log10(vals[0]));
        case 'exp':
          if (vals[0] > 27) {
            return {
              status: 'exceeds-numeric-limit',
              reason: 'Exponential result exceeds supported display range.',
            };
          }
          return wrapFinite(Math.exp(vals[0]));
        case 'deg2rad':
          return wrapFinite((vals[0] * Math.PI) / 180);
        case 'rad2deg':
          return wrapFinite((vals[0] * 180) / Math.PI);
        case 'floor':
          return wrapFinite(Math.floor(vals[0]));
        case 'ceil':
          return wrapFinite(Math.ceil(vals[0]));
        case 'round':
          return wrapFinite(Math.round(vals[0]));
        case 'min':
          return wrapFinite(Math.min(...vals));
        case 'max':
          return wrapFinite(Math.max(...vals));
      }
    }
  }
}

/**
 * Fast numeric wrapper returning `number` (`NaN` for non-ok statuses) for curve sampling.
 */
export function evaluateMathAst(
  node: MathAstNode,
  variables: Readonly<Record<string, number>>
): number {
  const res = evaluateMathAstDetailed(node, variables);
  return res.status === 'ok' ? res.value : Number.NaN;
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

/**
 * GAM EDU — Step 5A Pure Module 2: Safe Mathematical Expression Tokenizer, Parser & Plain-Text Printer
 *
 * Pure TypeScript, zero eval(), zero new Function(), zero React/DOM dependencies.
 * Preserves existing `math-expr.ts` completely untouched for `GraphSliderEngine`.
 *
 * Strict Grammar & Disambiguation Guarantees:
 * - `-2^2` === `-(2^2)` === `-4`; `(-2)^2` === `4`
 * - `2^3^2` === `2^(3^2)` === `512`; `2^-3` === `0.125`
 * - `2/3x` -> REJECTED as AMBIGUOUS_NOTATION (require `(2/3)x` or `2/(3x)`)
 * - `sin x` / `sqrt x` without parentheses -> REJECTED as SYNTAX_ERROR
 * - `2sin(x)`, `sin(x)^2`, `2(x+1)`, `(x+1)(x-1)`, `xy`, `3xy` -> SUPPORTED (declared single-letter vars)
 * - Scientific notation `3.00e8` / `3.00E-4` distinguished from constant `e` (`e^x`, `2e`)
 * - Preserves raw numeric literal strings (`raw`) for exact significant-figure & decimal-place analysis
 * - Supports `|x|` absolute value bars (e.g. `ln|x|` or `|x - 2|`)
 */

import { FORBIDDEN_IDENTIFIERS, MATH_EVAL_LIMITS, MathEvalLimitError } from './math-eval-limits';

export type EvalFnName = 'abs' | 'sqrt' | 'cbrt' | 'sin' | 'cos' | 'tan' | 'ln' | 'log10' | 'exp';
export type EvalConstName = 'pi' | 'e' | 'inf';

export const ALLOWED_EVAL_FUNCTIONS = new Set<EvalFnName>([
  'abs',
  'sqrt',
  'cbrt',
  'sin',
  'cos',
  'tan',
  'ln',
  'log10',
  'exp',
]);

export type EvalAstNode =
  | { type: 'number'; raw: string; value: number }
  | { type: 'const'; name: EvalConstName }
  | { type: 'var'; name: string }
  | { type: 'unary'; op: '+' | '-'; arg: EvalAstNode }
  | { type: 'binary'; op: '+' | '-' | '*' | '/' | '^'; left: EvalAstNode; right: EvalAstNode; implicit?: boolean }
  | { type: 'call'; name: EvalFnName; arg: EvalAstNode };

export interface ParsedEvalExpr {
  rawSource: string;
  normalisedSource: string;
  ast: EvalAstNode;
  nodeCount: number;
  maxDepth: number;
  usedVariables: string[];
}

export type EvalToken =
  | { kind: 'number'; raw: string; value: number; pos: number }
  | { kind: 'ident'; value: string; pos: number }
  | { kind: 'op'; value: '+' | '-' | '*' | '/' | '^'; pos: number }
  | { kind: 'lparen'; pos: number }
  | { kind: 'rparen'; pos: number }
  | { kind: 'bar'; pos: number }
  | { kind: 'eof'; pos: number };

/** Normalises common Unicode mathematical characters into ASCII grammar tokens. */
export function normaliseUnicodeMath(input: string): string {
  if (typeof input !== 'string') {
    throw new MathEvalLimitError('SYNTAX_ERROR', 'Expression must be a string.');
  }
  // Reject control characters and unpaired surrogates
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFD]/.test(input)) {
    throw new MathEvalLimitError('SYNTAX_ERROR', 'Expression contains invalid or corrupted characters.');
  }
  return input
    .replace(/[\u2212\u2013\u2014]/g, '-') // minus, en-dash, em-dash
    .replace(/[\u00D7\u22C5\u00B7]/g, '*') // ×, ⋅, ·
    .replace(/\u00F7/g, '/') // ÷
    .replace(/\u00B2/g, '^2') // ²
    .replace(/\u00B3/g, '^3') // ³
    .replace(/\u2074/g, '^4') // ⁴
    .replace(/\u03C0/g, 'pi') // π
    .replace(/\u221A\s*\(/g, 'sqrt(') // √(
    .replace(/\u221A\s*([0-9]+(?:\.[0-9]+)?|[a-zA-Z])/g, 'sqrt($1)') // √3 -> sqrt(3)
    .replace(/\u221E/g, 'inf') // ∞
    .replace(/\u2264/g, '<=') // ≤
    .replace(/\u2265/g, '>=') // ≥
    .replace(/\u2260/g, '!=') // ≠
    .replace(/\u222A/g, ' U '); // ∪
}

export interface ParseEvalOptions {
  allowedVariables?: Iterable<string>;
  allowInfinity?: boolean;
  /** Optional constant of integration variable name (e.g. 'C') */
  allowConstantC?: boolean;
}

function tokenizeEvalExpr(source: string, allowedVars: Set<string>, allowInf: boolean): EvalToken[] {
  if (source.trim().length === 0) {
    throw new MathEvalLimitError('SYNTAX_ERROR', 'Enter a mathematical expression.');
  }
  if (source.length > MATH_EVAL_LIMITS.maxInputLength) {
    throw new MathEvalLimitError(
      'LIMIT_EXCEEDED',
      `Expression exceeds maximum length of ${MATH_EVAL_LIMITS.maxInputLength} characters.`,
    );
  }

  const tokens: EvalToken[] = [];
  let i = 0;
  const n = source.length;

  const pushTok = (tok: EvalToken) => {
    if (tokens.length >= MATH_EVAL_LIMITS.maxTokens) {
      throw new MathEvalLimitError(
        'LIMIT_EXCEEDED',
        `Expression exceeds maximum token count (${MATH_EVAL_LIMITS.maxTokens}).`,
      );
    }
    tokens.push(tok);
  };

  while (i < n) {
    const ch = source[i];
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i++;
      continue;
    }

    // Number literal (preserving raw text + distinguishing scientific notation 1.5e-3 from 2e)
    if ((ch >= '0' && ch <= '9') || (ch === '.' && i + 1 < n && source[i + 1] >= '0' && source[i + 1] <= '9')) {
      const start = i;
      let seenDot = false;
      while (i < n && ((source[i] >= '0' && source[i] <= '9') || (!seenDot && source[i] === '.'))) {
        if (source[i] === '.') seenDot = true;
        i++;
      }
      // Scientific notation ONLY when followed by optional +/- AND at least one digit (so `2e` stays `2 * e`!)
      if (i < n && (source[i] === 'e' || source[i] === 'E')) {
        let j = i + 1;
        if (j < n && (source[j] === '+' || source[j] === '-')) j++;
        if (j < n && source[j] >= '0' && source[j] <= '9') {
          while (j < n && source[j] >= '0' && source[j] <= '9') j++;
          i = j;
        }
      }
      const raw = source.slice(start, i);
      const val = Number(raw);
      if (!Number.isFinite(val)) {
        throw new MathEvalLimitError('SYNTAX_ERROR', `Invalid or non-finite numeric literal "${raw}".`);
      }
      pushTok({ kind: 'number', raw, value: val, pos: start });
      continue;
    }

    // Identifier / function / constant / implicit multi-letter variable sequence (e.g. xy)
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
      const rawIdent = source.slice(start, i);
      if (FORBIDDEN_IDENTIFIERS.has(rawIdent)) {
        throw new MathEvalLimitError('SYNTAX_ERROR', `Disallowed identifier "${rawIdent}".`);
      }

      const lower = rawIdent.toLowerCase();
      // Exact match for recognised function, constant, or declared variable
      if (
        ALLOWED_EVAL_FUNCTIONS.has(lower as EvalFnName) ||
        lower === 'pi' ||
        rawIdent === 'e' ||
        (allowInf && lower === 'inf') ||
        allowedVars.has(rawIdent)
      ) {
        pushTok({ kind: 'ident', value: rawIdent, pos: start });
        continue;
      }

      // Check M2: adjacent declared single-letter variables (e.g. `xy` when x and y are declared, or `xsin`? No, protect functions!)
      // Only split if EVERY character is a declared single-letter variable (or 'e' when not ambiguous)
      if (/^[a-zA-Z]{2,6}$/.test(rawIdent)) {
        const chars = rawIdent.split('');
        if (chars.every((c) => allowedVars.has(c))) {
          for (let k = 0; k < chars.length; k++) {
            pushTok({ kind: 'ident', value: chars[k], pos: start + k });
          }
          continue;
        }
      }

      throw new MathEvalLimitError(
        'SYNTAX_ERROR',
        `Unknown or undeclared identifier "${rawIdent}". Allowed variables: ${allowedVars.size > 0 ? Array.from(allowedVars).join(', ') : 'none'}.`,
      );
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      pushTok({ kind: 'op', value: ch, pos: i });
      i++;
      continue;
    }
    if (ch === '(') {
      pushTok({ kind: 'lparen', pos: i });
      i++;
      continue;
    }
    if (ch === ')') {
      pushTok({ kind: 'rparen', pos: i });
      i++;
      continue;
    }
    if (ch === '|') {
      pushTok({ kind: 'bar', pos: i });
      i++;
      continue;
    }

    throw new MathEvalLimitError('SYNTAX_ERROR', `Unexpected character "${ch}" at position ${i + 1}.`);
  }

  pushTok({ kind: 'eof', pos: n });
  return tokens;
}

export function parseEvalExpr(rawSource: string, options: ParseEvalOptions = {}): ParsedEvalExpr {
  const allowedVars = new Set<string>(options.allowedVariables ?? []);
  if (options.allowConstantC) allowedVars.add('C');
  const allowInf = Boolean(options.allowInfinity);

  const normalised = normaliseUnicodeMath(rawSource);
  const tokens = tokenizeEvalExpr(normalised, allowedVars, allowInf);

  let pos = 0;
  let nodeCount = 0;
  let maxDepth = 0;
  const usedVars = new Set<string>();

  const peek = (): EvalToken => tokens[pos];
  const consume = (): EvalToken => tokens[pos++];

  const trackNode = (depth: number) => {
    nodeCount += 1;
    if (depth > maxDepth) maxDepth = depth;
    if (nodeCount > MATH_EVAL_LIMITS.maxAstNodes) {
      throw new MathEvalLimitError(
        'LIMIT_EXCEEDED',
        `Expression exceeds maximum AST node count (${MATH_EVAL_LIMITS.maxAstNodes}).`,
      );
    }
    if (depth > MATH_EVAL_LIMITS.maxAstDepth) {
      throw new MathEvalLimitError(
        'LIMIT_EXCEEDED',
        `Expression exceeds maximum nesting depth (${MATH_EVAL_LIMITS.maxAstDepth}).`,
      );
    }
  };

  const canStartImplicitFactor = (tok: EvalToken): boolean =>
    tok.kind === 'ident' || tok.kind === 'lparen';

  // addSub := mulDiv ( ('+' | '-') mulDiv )*
  const parseAddSub = (depth: number): EvalAstNode => {
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
  // Explicitly detects ambiguous `2/3x` (division immediately followed by implicit multiplication!)
  const parseMulDiv = (depth: number): EvalAstNode => {
    let left = parseUnary(depth);
    while (peek().kind === 'op' && ((peek() as { value: string }).value === '*' || (peek() as { value: string }).value === '/')) {
      const op = (consume() as { kind: 'op'; value: '*' | '/' }).value;
      const rhsStartPos = pos;
      const right = parseUnary(depth + 1);
      if (
        op === '/' &&
        tokens[rhsStartPos]?.kind !== 'lparen' &&
        right.type === 'binary' &&
        right.op === '*' &&
        right.implicit
      ) {
        const snippet = normalised.slice(Math.max(0, tokens[rhsStartPos - 1]?.pos - 4), (peek().pos || normalised.length));
        throw new MathEvalLimitError(
          'AMBIGUOUS_NOTATION',
          `Ambiguous division with implicit multiplication near "${snippet.trim()}". Use brackets such as (2/3)x or 2/(3x).`,
        );
      }
      trackNode(depth + 1);
      left = { type: 'binary', op, left, right };
    }
    return left;
  };

  // unary := ('+' | '-') unary | implicitMul
  // Unary binds LOOSER than power so `-2^2 === -(2^2) === -4`
  const parseUnary = (depth: number): EvalAstNode => {
    if (peek().kind === 'op' && ((peek() as { value: string }).value === '+' || (peek() as { value: string }).value === '-')) {
      const op = (consume() as { kind: 'op'; value: '+' | '-' }).value;
      const arg = parseUnary(depth + 1);
      trackNode(depth + 1);
      return { type: 'unary', op, arg };
    }
    return parseImplicitMul(depth);
  };

  // implicitMul := power ( power )* when next token starts an implicit factor (ident or '(')
  const parseImplicitMul = (depth: number): EvalAstNode => {
    let left = parsePower(depth);
    while (canStartImplicitFactor(peek())) {
      const right = parsePower(depth + 1);
      trackNode(depth + 1);
      left = { type: 'binary', op: '*', left, right, implicit: true };
    }
    return left;
  };

  // power := primary ('^' unary)?   (right-associative: 2^3^2 === 2^(3^2), 2^-3 === 2^(-3))
  const parsePower = (depth: number): EvalAstNode => {
    const left = parsePrimary(depth);
    if (peek().kind === 'op' && (peek() as { value: string }).value === '^') {
      consume();
      const right = parseUnary(depth + 1);
      trackNode(depth + 1);
      return { type: 'binary', op: '^', left, right };
    }
    return left;
  };

  // primary := number | '|' addSub '|' | '(' addSub ')' | fn '(' addSub ')' | fn '|' addSub '|' | const | var
  const parsePrimary = (depth: number): EvalAstNode => {
    const tok = peek();

    if (tok.kind === 'number') {
      consume();
      trackNode(depth + 1);
      return { type: 'number', raw: tok.raw, value: tok.value };
    }

    if (tok.kind === 'lparen') {
      consume();
      const inner = parseAddSub(depth + 1);
      if (peek().kind !== 'rparen') {
        throw new MathEvalLimitError('SYNTAX_ERROR', 'Missing closing parenthesis ")".');
      }
      consume();
      return inner;
    }

    if (tok.kind === 'bar') {
      consume();
      const inner = parseAddSub(depth + 1);
      if (peek().kind !== 'bar') {
        throw new MathEvalLimitError('SYNTAX_ERROR', 'Missing closing absolute-value bar "|".');
      }
      consume();
      trackNode(depth + 1);
      return { type: 'call', name: 'abs', arg: inner };
    }

    if (tok.kind === 'ident') {
      consume();
      const rawName = tok.value;
      const lower = rawName.toLowerCase();

      if (ALLOWED_EVAL_FUNCTIONS.has(lower as EvalFnName)) {
        const fnName = lower as EvalFnName;
        // Support `ln|x|` directly as `ln(abs(x))`!
        if (fnName === 'ln' && peek().kind === 'bar') {
          consume();
          const inner = parseAddSub(depth + 2);
          if (peek().kind !== 'bar') {
            throw new MathEvalLimitError('SYNTAX_ERROR', 'Missing closing "|" in ln|...|. ');
          }
          consume();
          trackNode(depth + 2);
          trackNode(depth + 1);
          return { type: 'call', name: 'ln', arg: { type: 'call', name: 'abs', arg: inner } };
        }

        if (peek().kind !== 'lparen') {
          throw new MathEvalLimitError(
            'SYNTAX_ERROR',
            `Function "${fnName}" requires parentheses around its argument, e.g. ${fnName}(x).`,
          );
        }
        consume();
        const arg = parseAddSub(depth + 1);
        if (peek().kind !== 'rparen') {
          throw new MathEvalLimitError('SYNTAX_ERROR', `Missing closing parenthesis ")" for ${fnName}(...).`);
        }
        consume();
        trackNode(depth + 1);
        return { type: 'call', name: fnName, arg };
      }

      if (lower === 'pi') {
        trackNode(depth + 1);
        return { type: 'const', name: 'pi' };
      }
      if (rawName === 'e') {
        trackNode(depth + 1);
        return { type: 'const', name: 'e' };
      }
      if (allowInf && lower === 'inf') {
        trackNode(depth + 1);
        return { type: 'const', name: 'inf' };
      }

      if (allowedVars.has(rawName)) {
        if (peek().kind === 'lparen') {
          // Implicit multiplication like `x(x+1)` is handled by parseImplicitMul, NOT function call!
        }
        usedVars.add(rawName);
        trackNode(depth + 1);
        return { type: 'var', name: rawName };
      }

      throw new MathEvalLimitError('SYNTAX_ERROR', `Unexpected identifier "${rawName}".`);
    }

    throw new MathEvalLimitError('SYNTAX_ERROR', 'Incomplete or malformed mathematical expression.');
  };

  const ast = parseAddSub(0);
  if (peek().kind !== 'eof') {
    throw new MathEvalLimitError('SYNTAX_ERROR', 'Unexpected trailing symbols in mathematical expression.');
  }

  return {
    rawSource,
    normalisedSource: normalised,
    ast,
    nodeCount,
    maxDepth,
    usedVariables: Array.from(usedVars),
  };
}

/** Accessible plain-text / screen-reader spoken rendering of a parsed AST. */
export function astToPlainText(node: EvalAstNode): string {
  switch (node.type) {
    case 'number':
      return node.raw;
    case 'const':
      return node.name === 'pi' ? 'pi' : node.name === 'inf' ? 'infinity' : 'e';
    case 'var':
      return node.name;
    case 'unary':
      return node.op === '-' ? `negative ${astToPlainText(node.arg)}` : astToPlainText(node.arg);
    case 'call':
      if (node.name === 'sqrt') return `square root of (${astToPlainText(node.arg)})`;
      if (node.name === 'cbrt') return `cube root of (${astToPlainText(node.arg)})`;
      if (node.name === 'abs') return `absolute value of (${astToPlainText(node.arg)})`;
      return `${node.name} of (${astToPlainText(node.arg)})`;
    case 'binary':
      if (node.op === '+') return `${astToPlainText(node.left)} plus ${astToPlainText(node.right)}`;
      if (node.op === '-') return `${astToPlainText(node.left)} minus ${astToPlainText(node.right)}`;
      if (node.op === '*') return `${astToPlainText(node.left)} times ${astToPlainText(node.right)}`;
      if (node.op === '/') return `(${astToPlainText(node.left)}) divided by (${astToPlainText(node.right)})`;
      return `(${astToPlainText(node.left)}) to the power of (${astToPlainText(node.right)})`;
  }
}

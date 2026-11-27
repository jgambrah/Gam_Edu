/**
 * GAM EDU — Step 5A Pure Module 1: Resource Limits, Security Guards & Operation Budget
 *
 * Pure TypeScript, zero React/DOM dependencies.
 * All limits are enforced BEFORE expensive intermediate symbolic or BigInt operations.
 */

export const MATH_EVAL_LIMITS = {
  maxInputLength: 200,
  maxTokens: 96,
  maxAstDepth: 10,
  maxAstNodes: 64,
  maxVariables: 3,
  maxPolyDegree: 6,
  maxPolyTerms: 32,
  maxBigIntDigits: 24,
  maxNumericExponentAbs: 100,
  maxSymbolicPower: 6,
  maxCandidateRoots: 6,
  maxIntervals: 4,
  maxUnitTokens: 12,
  maxRewrites: 32,
  maxEvalOps: 2_000,
  maxSurdRadicand: 10_000,
  numericSampleCount: 16,
} as const;

export const FORBIDDEN_IDENTIFIERS = new Set([
  '__proto__',
  'prototype',
  'constructor',
  'toString',
  'valueOf',
  'hasOwnProperty',
  'eval',
  'Function',
  'window',
  'globalThis',
  'process',
]);

export class MathEvalLimitError extends Error {
  readonly code: 'LIMIT_EXCEEDED' | 'SYNTAX_ERROR' | 'AMBIGUOUS_NOTATION' | 'UNSUPPORTED';

  constructor(
    code: 'LIMIT_EXCEEDED' | 'SYNTAX_ERROR' | 'AMBIGUOUS_NOTATION' | 'UNSUPPORTED',
    message: string,
  ) {
    super(message);
    this.name = 'MathEvalLimitError';
    this.code = code;
  }
}

export class EvalOpBudget {
  private ops = 0;
  readonly maxOps: number;

  constructor(maxOps: number = MATH_EVAL_LIMITS.maxEvalOps) {
    this.maxOps = maxOps;
  }

  tick(cost = 1): void {
    this.ops += cost;
    if (this.ops > this.maxOps) {
      throw new MathEvalLimitError(
        'LIMIT_EXCEEDED',
        `Expression evaluation exceeded the maximum operation budget (${this.maxOps} operations). Simplify the expression.`,
      );
    }
  }

  get used(): number {
    return this.ops;
  }
}

const BIGINT_ZERO = BigInt(0);
const BIGINT_MAX_ABS = BigInt('1000000000000000000000000');

export function assertBigIntWithinLimit(val: bigint): void {
  const absVal = val < BIGINT_ZERO ? -val : val;
  // 10^24 limit check
  if (absVal > BIGINT_MAX_ABS) {
    throw new MathEvalLimitError(
      'LIMIT_EXCEEDED',
      `Exact integer magnitude exceeded the ${MATH_EVAL_LIMITS.maxBigIntDigits}-digit safety limit.`,
    );
  }
}

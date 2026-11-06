import type {
  ThinkTankParadoxItem,
  ThinkTankDetectiveCaseItem,
  ThinkTankRiddleItem,
  ThinkTankDebateItem,
} from './think-tank-data';
import { evaluateParadoxSubmission } from './think-tank-evaluator';

export interface ThinkTankAuditViolation {
  id: string;
  category: 'paradox' | 'detectiveCase' | 'riddle' | 'debate';
  rule: string;
  message: string;
}

export interface ThinkTankAuditReport {
  passed: boolean;
  checkedCounts: {
    paradoxes: number;
    detectiveCases: number;
    riddles: number;
    debates: number;
    total: number;
  };
  violations: ThinkTankAuditViolation[];
}

const VALID_GROUPS = new Set([
  'Novice (Basic 1-3)',
  'Apprentice (Basic 4-6)',
  'Scholar (JHS)',
  'Master (SHS)',
]);

const VALID_RIDDLE_CATEGORIES = new Set([
  'Word Riddle',
  'Math & Logic',
  'Science & Nature',
  'African Wisdom',
  'Lateral Thinking',
]);

/**
 * Evaluates a 3-box medal/prize statement ("Box X says the medal is [not] in Y")
 * for a candidate box placement ('A' | 'B' | 'C').
 */
function evaluateThreeBoxStatement(
  stmt: { speaker: string; target: string; negated: boolean },
  actualBox: string
): boolean {
  const isInTarget = actualBox === stmt.target;
  return stmt.negated ? !isInTarget : isInTarget;
}

/**
 * Checks 3-box truth-teller puzzles of the form:
 * "Exactly one of three boxes contains a [item]. Box A says ..., Box B says ..., Box C says ... If exactly K statement(s) are true..."
 */
function checkThreeBoxUniqueness(p: ThinkTankParadoxItem): string | null {
  const q = p.question;
  if (!/Exactly one of three boxes contains/i.test(q)) return null;

  const stmtRegex =
    /Box\s+([ABC])\s+says\s+the\s+\w+\s+is\s+(not\s+)?in\s+(?:Box\s+)?([ABC])/gi;
  const statements: Array<{ speaker: string; target: string; negated: boolean }> = [];
  let match: RegExpExecArray | null;
  while ((match = stmtRegex.exec(q)) !== null) {
    statements.push({
      speaker: match[1].toUpperCase(),
      negated: Boolean(match[2]),
      target: match[3].toUpperCase(),
    });
  }
  if (statements.length !== 3) return null;

  const trueCountMatch = q.match(
    /If\s+(?:only\s+|exactly\s+)?(one|two|three|1|2|3)\s+statements?\s+(?:is|are)\s+true/i
  );
  if (!trueCountMatch) return null;

  const wordToNum: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    '1': 1,
    '2': 2,
    '3': 3,
  };
  const requiredTrue = wordToNum[trueCountMatch[1].toLowerCase()];
  if (!requiredTrue) return null;

  const validBoxes: string[] = [];
  for (const candidate of ['A', 'B', 'C']) {
    const trueStmts = statements.filter((s) => evaluateThreeBoxStatement(s, candidate)).length;
    if (trueStmts === requiredTrue) {
      validBoxes.push(candidate);
    }
  }

  if (validBoxes.length === 0) {
    return `3-box puzzle has 0 valid solutions for "${requiredTrue} true statement(s)"`;
  }
  if (validBoxes.length > 1) {
    return `3-box puzzle is ambiguous: multiple boxes (${validBoxes.join(', ')}) satisfy "${requiredTrue} true statement(s)"`;
  }

  const expectedBox = validBoxes[0];
  const answerMentionsBox = new RegExp(`\\bBox\\s+${expectedBox}\\b|\\bin\\s+${expectedBox}\\b`, 'i').test(
    p.answer
  );
  if (!answerMentionsBox) {
    return `3-box puzzle unique solution is Box ${expectedBox}, but canonical answer states "${p.answer}"`;
  }

  return null;
}

/**
 * Checks numeric digit-sum and place-value riddles for consistency between question clues and answer.
 */
function checkRiddleMathConsistency(r: ThinkTankRiddleItem): string | null {
  const ansTrimmed = r.answer.trim();
  if (!/^\d{2,4}$/.test(ansTrimmed)) return null;

  const digits = ansTrimmed.split('').map(Number);
  const digitSum = digits.reduce((acc, d) => acc + d, 0);

  const sumMatch = r.question.match(
    /(?:digits\s+(?:add\s+up\s+to|sum\s+to|total)|sum\s+of\s+my\s+digits\s+is)\s+(\d+)/i
  );
  if (sumMatch) {
    const expectedSum = Number(sumMatch[1]);
    if (digitSum !== expectedSum) {
      return `Riddle answer "${ansTrimmed}" has digit sum ${digitSum}, but question states ${expectedSum}`;
    }
  }

  // Check 3-digit place-value constraints if present
  if (digits.length === 3) {
    const [hundreds, tens, units] = digits;
    const tensMoreUnits = r.question.match(
      /tens\s+digit\s+is\s+(one|two|three|four|five|six|seven|eight|nine|\d+)\s+more\s+than\s+(?:my\s+)?(?:units|ones)\s+digit/i
    );
    const wordMap: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
    };
    if (tensMoreUnits) {
      const diff = wordMap[tensMoreUnits[1].toLowerCase()] ?? Number(tensMoreUnits[1]);
      if (tens - units !== diff) {
        return `Riddle answer "${ansTrimmed}" has tens (${tens}) - units (${units}) = ${tens - units}, but question requires ${diff}`;
      }
    }
    if (/hundreds\s+digit\s+is\s+twice\s+(?:my\s+)?(?:units|ones)\s+digit/i.test(r.question)) {
      if (hundreds !== 2 * units) {
        return `Riddle answer "${ansTrimmed}" has hundreds (${hundreds}) != 2 * units (${units})`;
      }
    }
  }

  return null;
}

export function auditThinkTankRepository(data: {
  paradoxes: ThinkTankParadoxItem[];
  detectiveCases: ThinkTankDetectiveCaseItem[];
  riddles: ThinkTankRiddleItem[];
  debates: ThinkTankDebateItem[];
}): ThinkTankAuditReport {
  const violations: ThinkTankAuditViolation[] = [];

  for (const p of data.paradoxes) {
    if (!VALID_GROUPS.has(p.targetGroup)) {
      violations.push({
        id: p.id,
        category: 'paradox',
        rule: 'valid_target_group',
        message: `Invalid targetGroup "${p.targetGroup}"`,
      });
    }

    if (/\bwait:/i.test(p.explanation) || /\bwait:/i.test(p.answer)) {
      violations.push({
        id: p.id,
        category: 'paradox',
        rule: 'no_draft_reasoning',
        message: `Contains leaked draft self-correction ("wait:") in answer or explanation`,
      });
    }

    const boxErr = checkThreeBoxUniqueness(p);
    if (boxErr) {
      violations.push({
        id: p.id,
        category: 'paradox',
        rule: 'unique_logical_solution',
        message: boxErr,
      });
    }

    if (p.evaluation) {
      const canonicalEval = evaluateParadoxSubmission({
        id: p.id,
        question: p.question,
        answer: p.answer,
        explanation: p.explanation,
        userConclusion: p.answer,
        userTheory: p.explanation,
        evaluation: p.evaluation,
      });
      if (canonicalEval.tier !== 'Mastered') {
        violations.push({
          id: p.id,
          category: 'paradox',
          rule: 'rubric_canonical_mastery',
          message: `Canonical answer+explanation evaluated as "${canonicalEval.tier}" instead of "Mastered"`,
        });
      }

      for (const trap of p.evaluation.commonTraps || []) {
        const trapEval = evaluateParadoxSubmission({
          id: p.id,
          question: p.question,
          answer: p.answer,
          explanation: p.explanation,
          userConclusion: trap,
          userTheory: '',
          evaluation: p.evaluation,
        });
        if (trapEval.tier !== 'Needs Revision') {
          violations.push({
            id: p.id,
            category: 'paradox',
            rule: 'rubric_trap_rejection',
            message: `Common trap "${trap}" evaluated as "${trapEval.tier}" instead of "Needs Revision"`,
          });
        }
      }
    }
  }

  for (const c of data.detectiveCases) {
    if (!VALID_GROUPS.has(c.targetGroup)) {
      violations.push({
        id: c.id,
        category: 'detectiveCase',
        rule: 'valid_target_group',
        message: `Invalid targetGroup "${c.targetGroup}"`,
      });
    }
    if (!Array.isArray(c.options) || c.options.length !== 4 || new Set(c.options).size !== 4) {
      violations.push({
        id: c.id,
        category: 'detectiveCase',
        rule: 'four_distinct_options',
        message: `Detective case must have exactly 4 distinct options`,
      });
    } else if (!c.options.includes(c.correctAnswer)) {
      violations.push({
        id: c.id,
        category: 'detectiveCase',
        rule: 'correct_answer_in_options',
        message: `correctAnswer "${c.correctAnswer}" is not present in options`,
      });
    }
  }

  for (const r of data.riddles) {
    if (!VALID_GROUPS.has(r.targetGroup)) {
      violations.push({
        id: r.id,
        category: 'riddle',
        rule: 'valid_target_group',
        message: `Invalid targetGroup "${r.targetGroup}"`,
      });
    }
    if (!VALID_RIDDLE_CATEGORIES.has(r.category)) {
      violations.push({
        id: r.id,
        category: 'riddle',
        rule: 'valid_riddle_category',
        message: `Invalid riddle category "${r.category}"`,
      });
    }
    if (!Array.isArray(r.acceptedKeywords) || r.acceptedKeywords.length < 2) {
      violations.push({
        id: r.id,
        category: 'riddle',
        rule: 'min_two_accepted_keywords',
        message: `Riddle has ${r.acceptedKeywords?.length ?? 0} acceptedKeywords (minimum 2 required)`,
      });
    }
    const mathErr = checkRiddleMathConsistency(r);
    if (mathErr) {
      violations.push({
        id: r.id,
        category: 'riddle',
        rule: 'riddle_math_consistency',
        message: mathErr,
      });
    }
  }

  for (const d of data.debates) {
    if (!VALID_GROUPS.has(d.targetGroup)) {
      violations.push({
        id: d.id,
        category: 'debate',
        rule: 'valid_target_group',
        message: `Invalid targetGroup "${d.targetGroup}"`,
      });
    }
  }

  return {
    passed: violations.length === 0,
    checkedCounts: {
      paradoxes: data.paradoxes.length,
      detectiveCases: data.detectiveCases.length,
      riddles: data.riddles.length,
      debates: data.debates.length,
      total:
        data.paradoxes.length +
        data.detectiveCases.length +
        data.riddles.length +
        data.debates.length,
    },
    violations,
  };
}


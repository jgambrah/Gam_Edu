import type { ThinkTankParadoxItem } from '@/lib/think-tank-data';

export interface ThinkTankParadoxEvaluation {
  type: 'conceptual' | 'numeric' | 'polarity' | 'deductive' | 'self_reference_paradox';
  requiredConcepts?: Array<string | string[]>;
  acceptedExpressions?: string[];
  partialConcepts?: string[];
  commonTraps?: string[];
  coachingHint?: string;
  maxXp?: number;
}

export type ParadoxGradeTier = 'Mastered' | 'Partially Correct' | 'Needs Revision' | 'Uncertain';

export interface ParadoxEvaluationResult {
  tier: ParadoxGradeTier;
  xpAwarded: number;
  xpEarned: number;
  maxXp: number;
  headline: string;
  feedback: string;
  coachingHint: string;
}

const NEGATION_TOKENS = new Set([
  'not',
  'no',
  'never',
  'cannot',
  'cant',
  'isnt',
  'arent',
  'wasnt',
  'werent',
  'doesnt',
  'dont',
  'didnt',
  'wont',
  'wouldnt',
  'shouldnt',
]);

const NEGATION_BRIDGE_TOKENS = new Set([
  'a',
  'an',
  'the',
  'any',
  'really',
  'actually',
  'even',
  'simply',
  'just',
  'logical',
  'logically',
  'self',
  'referential',
  'true',
  'real',
  'valid',
  'at',
  'all',
  'be',
  'have',
  'create',
  'creates',
  'produce',
  'produces',
]);

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'that',
  'this',
  'with',
  'from',
  'have',
  'has',
  'had',
  'are',
  'was',
  'were',
  'will',
  'would',
  'could',
  'should',
  'into',
  'onto',
  'upon',
  'about',
  'than',
  'then',
  'them',
  'they',
  'their',
  'there',
  'here',
  'when',
  'where',
  'what',
  'which',
  'while',
  'because',
  'since',
  'does',
  'mean',
  'means',
  'make',
  'makes',
  'made',
  'only',
  'also',
  'very',
  'much',
  'more',
  'most',
  'some',
  'such',
  'each',
  'every',
  'both',
  'either',
  'other',
  'another',
  'after',
  'before',
  'under',
  'over',
  'between',
  'through',
  'during',
  'still',
  'even',
  'just',
]);

const NUMBER_WORDS: Record<string, string> = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  thirteen: '13',
  fourteen: '14',
  fifteen: '15',
  sixteen: '16',
  seventeen: '17',
  eighteen: '18',
  nineteen: '19',
  twenty: '20',
  thirty: '30',
  forty: '40',
  fifty: '50',
  sixty: '60',
  seventy: '70',
  eighty: '80',
  ninety: '90',
  hundred: '100',
};

export function normalizeReasoningText(input: string): string {
  let s = input
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/(?<![0-9])\.|\.(?![0-9])/g, ' ')
    .replace(/[^a-z0-9.%/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Normalize number words so "forty" and "40" match consistently
  s = s
    .split(/\s+/)
    .map((tok) => NUMBER_WORDS[tok] ?? tok)
    .join(' ');
  return s;
}

const CONDITIONAL_TOKENS = new Set([
  'if',
  'suppose',
  'assuming',
  'assume',
  'whether',
  'when',
  'whenever',
  'case',
]);

/**
 * Checks whether `phrase` appears in `normalizedText` WITHOUT being directly negated
 * (where a negation word precedes `phrase` separated only by optional bridge/determiner words).
 */
export function matchesAffirmativePhrase(normalizedText: string, rawPhrase: string): boolean {
  const phrase = normalizeReasoningText(rawPhrase);
  if (!phrase) return false;
  let searchStart = 0;
  while (searchStart < normalizedText.length) {
    const idx = normalizedText.indexOf(phrase, searchStart);
    if (idx === -1) return false;

    const beforeChar = idx > 0 ? normalizedText[idx - 1] : ' ';
    const afterChar =
      idx + phrase.length < normalizedText.length ? normalizedText[idx + phrase.length] : ' ';
    const isWordBoundary = beforeChar === ' ' && afterChar === ' ';

    if (isWordBoundary) {
      if (!isMatchAtIndexNegated(normalizedText, idx)) {
        return true;
      }
    }
    searchStart = idx + 1;
  }
  return false;
}

function isMatchAtIndexNegated(normalizedText: string, matchIdx: number): boolean {
  const prefixTokens = normalizedText.slice(0, matchIdx).trim().split(/\s+/).filter(Boolean);
  const windowTokens = prefixTokens.slice(-4);
  for (let i = windowTokens.length - 1; i >= 0; i--) {
    const tok = windowTokens[i];
    if (NEGATION_TOKENS.has(tok)) {
      return true;
    }
    if (!NEGATION_BRIDGE_TOKENS.has(tok)) {
      // Hit a content word (e.g. "growing" in "not growing contradict"), so any earlier "not" modified that word, not our target phrase
      return false;
    }
  }
  return false;
}

/**
 * Checks whether a trap phrase is asserted as an unconditioned conclusion (not inside an "if/suppose" hypothesis).
 */
export function matchesUnconditionedTrap(normalizedText: string, rawTrap: string): boolean {
  const phrase = normalizeReasoningText(rawTrap);
  if (!phrase) return false;
  let searchStart = 0;
  while (searchStart < normalizedText.length) {
    const idx = normalizedText.indexOf(phrase, searchStart);
    if (idx === -1) return false;

    const beforeChar = idx > 0 ? normalizedText[idx - 1] : ' ';
    const afterChar =
      idx + phrase.length < normalizedText.length ? normalizedText[idx + phrase.length] : ' ';
    const isWordBoundary = beforeChar === ' ' && afterChar === ' ';

    if (isWordBoundary) {
      const prefixTokens = normalizedText.slice(0, idx).trim().split(/\s+/).filter(Boolean);
      const windowTokens = prefixTokens.slice(-5);
      const isNegated = isMatchAtIndexNegated(normalizedText, idx);
      const isConditional = windowTokens.some((tok) => CONDITIONAL_TOKENS.has(tok));
      const forcesSingleOutcome = /\b(definitely|simply|certainly|because he is lying|about to)\b/.test(phrase);
      if (!isNegated && (!isConditional || forcesSingleOutcome)) {
        return true;
      }
    }
    searchStart = idx + 1;
  }
  return false;
}

/**
 * Checks whether `phrase` appears in `normalizedText` AND IS directly negated.
 */
export function isPhraseExplicitlyNegated(normalizedText: string, rawPhrase: string): boolean {
  const phrase = normalizeReasoningText(rawPhrase);
  if (!phrase) return false;
  let searchStart = 0;
  while (searchStart < normalizedText.length) {
    const idx = normalizedText.indexOf(phrase, searchStart);
    if (idx === -1) return false;

    const beforeChar = idx > 0 ? normalizedText[idx - 1] : ' ';
    const afterChar =
      idx + phrase.length < normalizedText.length ? normalizedText[idx + phrase.length] : ' ';
    const isWordBoundary = beforeChar === ' ' && afterChar === ' ';

    if (isWordBoundary && isMatchAtIndexNegated(normalizedText, idx)) {
      return true;
    }
    searchStart = idx + 1;
  }
  return false;
}

/**
 * Built-in curated rubrics for classic/self-referential paradoxes and high-precision challenges.
 */
const BUILTIN_PARADOX_RUBRICS: Record<string, ThinkTankParadoxEvaluation> = {
  'tt-paradox-sch-5': {
    type: 'conceptual',
    requiredConcepts: ['self-referential contradiction'],
    acceptedExpressions: [
      'logical paradox',
      'self referential',
      'self-referential',
      'contradict the rule',
      'contradicts the rule',
      'contradiction',
      'logical loop',
      'infinite loop',
      'cannot happen consistently',
      'no consistent outcome',
      'no logically consistent outcome',
      'impossible under that rule',
      'both possibilities contradict',
      'both outcomes contradict',
      'neither outcome works',
      'true makes it false',
      'false makes it true',
      'liar paradox',
      'pinocchio paradox',
    ],
    partialConcepts: [
      'if his nose grows he was telling the truth',
      'if his nose grows then he was telling the truth',
      'if his nose grows he is telling the truth',
      'if his nose grows then it was true',
      'if his nose grows it was not a lie',
      'if his nose does not grow he was lying',
      'if his nose doesnt grow he lied',
      'if it does not grow it becomes a lie',
      'if it grows it becomes true',
    ],
    commonTraps: [
      'he is about to tell a lie',
      'he is lying',
      'he told a lie',
      'his nose simply grows',
      'his nose will definitely grow',
      'his nose will grow',
      'his nose will not grow',
      'his nose stays the same',
      'nothing happens',
    ],
    coachingHint:
      'Test both possibilities against the rule: (1) Suppose his nose grows — was his prediction true or a lie? (2) Suppose his nose does not grow — what does that make his prediction?',
    maxXp: 15,
  },
  'tt-paradox-sch-7010': {
    type: 'conceptual',
    requiredConcepts: ['liar paradox', 'self-reference'],
    acceptedExpressions: [
      'liar paradox',
      'self referential',
      'self-reference',
      'contradiction',
      'logical paradox',
      'if true then false',
      'both true and false contradict',
    ],
    partialConcepts: [
      'if it is true it must be false',
      'if it is false it becomes true',
    ],
    commonTraps: [
      'the sentence is true',
      'the sentence is simply false',
      'he is lying',
    ],
    coachingHint:
      'Notice how the sentence refers to its own truth value: what happens if you assume it is true, and what happens if you assume it is false?',
    maxXp: 15,
  },
};

function extractSignificantTokens(text: string): string[] {
  const norm = normalizeReasoningText(text);
  return norm
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w) && !NEGATION_TOKENS.has(w));
}

export interface EvaluateParadoxInput {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  difficulty?: string;
  userConclusion?: string;
  userTheory?: string;
  evaluation?: ThinkTankParadoxEvaluation;
}

/**
 * Evaluates a student's conclusion and optional supporting theory against a Paradox item.
 * Never awards full XP blindly; distinguishes Mastered (15 XP), Partially Correct (8 XP),
 * Needs Revision (0 XP), and Uncertain (0 XP with targeted coaching hint).
 */
export function evaluateParadoxSubmission(
  paradoxOrInput: (ThinkTankParadoxItem & { evaluation?: ThinkTankParadoxEvaluation }) | EvaluateParadoxInput,
  rawConclusionArg?: string,
  rawTheoryArg: string = ''
): ParadoxEvaluationResult {
  const rawConclusion =
    typeof rawConclusionArg === 'string'
      ? rawConclusionArg
      : (paradoxOrInput as EvaluateParadoxInput).userConclusion || '';
  const rawTheory =
    typeof rawConclusionArg === 'string'
      ? rawTheoryArg
      : (paradoxOrInput as EvaluateParadoxInput).userTheory || '';
  const paradox = paradoxOrInput;
  const combinedRaw = `${rawConclusion.trim()} ${rawTheory.trim()}`.trim();
  const normUser = normalizeReasoningText(combinedRaw);
  const normConclusion = normalizeReasoningText(rawConclusion);
  const builtInRubric = BUILTIN_PARADOX_RUBRICS[paradox.id];
  const itemRubric = paradox.evaluation;
  const rubric: ThinkTankParadoxEvaluation | undefined =
    builtInRubric && itemRubric
      ? {
          ...builtInRubric,
          ...itemRubric,
          acceptedExpressions: Array.from(
            new Set([...(builtInRubric.acceptedExpressions || []), ...(itemRubric.acceptedExpressions || [])])
          ),
          partialConcepts: Array.from(
            new Set([...(builtInRubric.partialConcepts || []), ...(itemRubric.partialConcepts || [])])
          ),
          commonTraps: Array.from(
            new Set([...(builtInRubric.commonTraps || []), ...(itemRubric.commonTraps || [])])
          ),
        }
      : itemRubric || builtInRubric;
  const maxXp = rubric?.maxXp ?? 15;

  const defaultHint =
    rubric?.coachingHint ||
    `Look closely at the exact wording of the question and test whether your assumption holds in every case. (${paradox.difficulty || 'Logic Check'})`;

  // Guard 0: Too brief / gibberish submission
  const userWords = normUser.split(/\s+/).filter(Boolean);
  if (userWords.length === 0 || combinedRaw.length < 2) {
    return {
      tier: 'Needs Revision',
      xpAwarded: 0,
      xpEarned: 0,
      maxXp,
      headline: 'Needs Revision — State Your Conclusion & Reasoning',
      feedback: 'Please provide a clear conclusion and explain why it follows from the conditions in the question.',
      coachingHint: defaultHint,
    };
  }

  // 1. If an explicit structured rubric exists, evaluate with negation-aware phrase matching
  if (rubric) {
    // Check explicit negation of core mastery/paradox expressions first (e.g. "It is not a paradox")
    const coreOutcomePhrases = [
      ...(rubric.acceptedExpressions || []),
      'paradox',
      'contradiction',
    ];
    const negatedCore = coreOutcomePhrases.some((phrase) => isPhraseExplicitlyNegated(normUser, phrase));
    if (negatedCore) {
      return {
        tier: 'Needs Revision',
        xpAwarded: 0,
        xpEarned: 0,
        maxXp,
        headline: 'Needs Revision — Contradicts the Logical Rule',
        feedback:
          'Your response negates the core logical outcome of this scenario. Trace both possibilities step by step against the rule in the question.',
        coachingHint: defaultHint,
      };
    }

    const matchedMastery = (rubric.acceptedExpressions || []).some((phrase) =>
      matchesAffirmativePhrase(normUser, phrase)
    );
    const mentionsParadoxKeyword = matchesAffirmativePhrase(normUser, 'paradox');
    const matchedTrap = (rubric.commonTraps || []).some((trap) => matchesUnconditionedTrap(normUser, trap));

    // Guard against self-contradictory answers (e.g. "This is a paradox, but his nose will definitely grow because he is lying")
    if (matchedTrap && (matchedMastery || mentionsParadoxKeyword)) {
      return {
        tier: 'Needs Revision',
        xpAwarded: 0,
        xpEarned: 0,
        maxXp,
        headline: 'Needs Revision — Self-Contradictory Conclusion',
        feedback:
          'You referred to a paradox, but then asserted a single definitive outcome (such as his nose growing because he is lying). In a true paradox, neither outcome can occur consistently under the rule.',
        coachingHint: defaultHint,
      };
    }

    // Check common traps before awarding mastery or partial credit
    if (matchedTrap) {
      return {
        tier: 'Needs Revision',
        xpAwarded: 0,
        xpEarned: 0,
        maxXp,
        headline: 'Needs Revision — Intuitive Trap Detected',
        feedback:
          'That conclusion assumes a single outcome without checking whether that outcome contradicts the rule stated in the prompt.',
        coachingHint: defaultHint,
      };
    }

    // Check affirmative mastery expressions
    if (matchedMastery) {
      return {
        tier: 'Mastered',
        xpAwarded: maxXp,
        xpEarned: maxXp,
        maxXp,
        headline: `Mastered! (+${maxXp} Logic XP)`,
        feedback: 'Excellent logical deduction — you identified the core mechanism of the paradox.',
        coachingHint: defaultHint,
      };
    }

    // Check partial concepts (e.g., identified one side of the loop without completing the contradiction)
    const matchedPartial = (rubric.partialConcepts || []).some((phrase) =>
      matchesAffirmativePhrase(normUser, phrase)
    );
    if (matchedPartial) {
      const partialXp = Math.round(maxXp * 0.53); // 8 XP out of 15
      return {
        tier: 'Partially Correct',
        xpAwarded: partialXp,
        xpEarned: partialXp,
        maxXp,
        headline: `Partially Correct (+${partialXp} XP earned — Revise for +${maxXp - partialXp} more XP)`,
        feedback:
          'You correctly traced one branch of the problem, but you have not yet explained what happens when both possibilities are tested against the rule.',
        coachingHint: defaultHint,
      };
    }
  }

  // 2. Fallback Structured Analysis for all 582 Paradoxes (Polarity + Numeric + Concept Overlap)
  const normAns = normalizeReasoningText(paradox.answer);
  const normExp = normalizeReasoningText(paradox.explanation);
  const normQuestion = normalizeReasoningText(paradox.question);

  // 2a. Check Yes/No polarity if canonical answer starts with "yes" or "no"
  const ansStartsNo = /^no\b/.test(paradox.answer.trim().toLowerCase());
  const ansStartsYes = /^yes\b/.test(paradox.answer.trim().toLowerCase());
  const userStartsNo =
    /^no\b/.test(normConclusion) ||
    /\b(no it is not|no they do not|no it does not|not necessarily|cannot conclude|false)\b/.test(normUser);
  const userStartsYes =
    /^yes\b/.test(normConclusion) || /\b(yes it is|yes they do|yes he does|yes she does)\b/.test(normUser);

  if ((ansStartsNo && userStartsYes && !userStartsNo) || (ansStartsYes && userStartsNo && !userStartsYes)) {
    return {
      tier: 'Needs Revision',
      xpAwarded: 0,
      xpEarned: 0,
      maxXp,
      headline: 'Needs Revision — Check Your Conclusion Polarity',
      feedback: ansStartsNo
        ? 'You concluded that the claim holds, but there is a flaw, counter-example, or hidden variable in the scenario.'
        : 'You rejected the claim, but careful analysis of the definitions or quantities shows that it actually holds.',
      coachingHint: defaultHint,
    };
  }

  // 2b. Check key numeric target vs. question trap numbers
  const ansNums: string[] = normAns.match(/\b\d+(?:\.\d+)?\b/g) || [];
  const qNums: string[] = normQuestion.match(/\b\d+(?:\.\d+)?\b/g) || [];
  const userNums: string[] = normUser.match(/\b\d+(?:\.\d+)?\b/g) || [];

  // Target numbers in the answer that weren't just parroting the setup, or the primary number in the answer
  const primaryAnsNums = ansNums.filter((n) => !paradox.answer.toLowerCase().includes(`not ${n}`));
  const explicitTrapNums = (paradox.answer.toLowerCase().match(/not\s+(\d+(?:\.\d+)?)/g) || []).map((m) =>
    m.replace(/^not\s+/i, '')
  );

  if (explicitTrapNums.length > 0 && explicitTrapNums.some((tn) => userNums.includes(tn)) && !primaryAnsNums.some((an) => userNums.includes(an))) {
    return {
      tier: 'Needs Revision',
      xpAwarded: 0,
      xpEarned: 0,
      maxXp,
      headline: 'Needs Revision — Common Numerical Trap',
      feedback:
        'That number is the intuitive trap value! Re-check the rates, gaps, or base quantities step by step.',
      coachingHint: defaultHint,
    };
  }

  // If the canonical answer has a specific numeric result (e.g. "40 kilometres per hour", "16 pupils", "96 percent")
  const hasNumericTarget = primaryAnsNums.length > 0;
  const matchedNumericTarget = hasNumericTarget && primaryAnsNums.some((n) => userNums.includes(n));

  if (hasNumericTarget && userNums.length > 0 && !matchedNumericTarget) {
    // Student gave a different number than the canonical answer
    return {
      tier: 'Needs Revision',
      xpAwarded: 0,
      xpEarned: 0,
      maxXp,
      headline: 'Needs Revision — Numerical Calculation Mismatch',
      feedback:
        'Your numerical value does not match the result of the conditions in the problem. Double-check the arithmetic and what the question asks for.',
      coachingHint: defaultHint,
    };
  }

  // 2c. Concept token overlap (negation-checked)
  const targetConcepts = Array.from(
    new Set([...extractSignificantTokens(paradox.answer), ...extractSignificantTokens(paradox.explanation)])
  ).filter((tok) => !extractSignificantTokens(paradox.question).includes(tok) || extractSignificantTokens(paradox.answer).includes(tok));

  const matchedConcepts = targetConcepts.filter(
    (tok) => normUser.includes(tok) && !isPhraseExplicitlyNegated(normUser, tok)
  );
  const negatedConcepts = targetConcepts.filter((tok) => isPhraseExplicitlyNegated(normUser, tok));

  if (negatedConcepts.length > 0 && matchedConcepts.length === 0) {
    return {
      tier: 'Needs Revision',
      xpAwarded: 0,
      xpEarned: 0,
      maxXp,
      headline: 'Needs Revision — Re-check the Underlying Principle',
      feedback:
        'Your explanation rules out the key factor that actually explains this scenario. Consider what physical or logical rule applies here.',
      coachingHint: defaultHint,
    };
  }

  const polarityMatched = (ansStartsNo && userStartsNo) || (ansStartsYes && userStartsYes);

  // Mastery criteria:
  // - Matched numeric target AND (polarity matched OR at least 1 concept token OR non-polarity numeric question)
  // - OR matched >= 2 distinct target concept tokens with no polarity conflict
  if (
    (matchedNumericTarget && (!ansStartsNo && !ansStartsYes ? true : polarityMatched || matchedConcepts.length >= 1)) ||
    (matchedConcepts.length >= 2 && (!ansStartsNo && !ansStartsYes ? true : polarityMatched || matchedConcepts.length >= 3))
  ) {
    return {
      tier: 'Mastered',
      xpAwarded: maxXp,
      xpEarned: maxXp,
      maxXp,
      headline: `Mastered! (+${maxXp} Logic XP)`,
      feedback: 'Spot-on reasoning! Your conclusion and explanation align with the logical blueprint.',
      coachingHint: defaultHint,
    };
  }

  // Partial criteria:
  // - Got the right Yes/No polarity AND gave a partial reason (or at least 4 words), OR matched 1 key concept token
  if ((polarityMatched && userWords.length >= 3) || matchedConcepts.length === 1 || matchedNumericTarget) {
    const partialXp = Math.round(maxXp * 0.53); // 8 XP
    return {
      tier: 'Partially Correct',
      xpAwarded: partialXp,
      xpEarned: partialXp,
      maxXp,
      headline: `Partially Correct (+${partialXp} XP earned — Revise for +${maxXp - partialXp} more XP)`,
      feedback:
        'Your conclusion points in the right direction, but your explanation is missing the specific mechanism or exact value.',
      coachingHint: defaultHint,
    };
  }

  // If the student only wrote 1-2 generic words without matching numeric/concept targets
  if (userWords.length < 4) {
    return {
      tier: 'Needs Revision',
      xpAwarded: 0,
      xpEarned: 0,
      maxXp,
      headline: 'Needs Revision — Explain Why',
      feedback:
        'A short guess is not enough to solve a paradox. State both what happens and the logical or scientific reason why.',
      coachingHint: defaultHint,
    };
  }

  // Uncertain fallback: student wrote a longer sentence that didn't hit a trap, negation, or canonical tokens
  return {
    tier: 'Uncertain',
    xpAwarded: 0,
    xpEarned: 0,
    maxXp,
    headline: 'Refine Your Reasoning — Check the Hint Below',
    feedback:
      'Your response does not yet clearly state the specific logical or physical mechanism we are looking for. Use the coaching hint below to sharpen your conclusion!',
    coachingHint: defaultHint,
  };
}

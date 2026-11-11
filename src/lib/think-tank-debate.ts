/**
 * Think Tank debate: prompts for the AI Debater and the AI Judge, and the XP earned from a judged debate.
 *
 * The students are basic-school pupils (Basic 1 to JHS 3, about 6 to 16 years old), so the debater must
 * speak simple English and use points from a pupil's everyday life. The judge must mark what the pupil
 * actually said in THIS debate, and the XP follows the judge's marks (it used to come out as a fixed 30).
 *
 * Kept free of server-only imports so it can be unit tested.
 */

export type DebateTurn = { role: 'user' | 'model'; text: string };

export interface DebateScores {
  logicScore: number;
  clarityScore: number;
  rebuttalScore: number;
}

export const DEBATE_MIN_XP = 10;
export const DEBATE_MAX_XP = 100;

const DEFAULT_AUDIENCE = 'Basic school pupils (Upper Primary to JHS 3), about 10 to 16 years old';

/** Describes who the AI is talking to, from the debate's target group (e.g. "Novice (Basic 1-3)"). */
export function describeDebateAudience(targetGroup?: string | null): string {
  const group = (targetGroup || '').trim();
  if (!group) return DEFAULT_AUDIENCE;
  const g = group.toLowerCase();
  if (g.includes('basic 1') || g.includes('novice')) return `${group} pupils, about 6 to 9 years old`;
  if (g.includes('basic 4') || g.includes('apprentice')) return `${group} pupils, about 9 to 12 years old`;
  if (g.includes('jhs') || g.includes('scholar')) return `${group} pupils, about 12 to 16 years old`;
  if (g.includes('shs') || g.includes('master')) return `${group} students, about 15 to 18 years old`;
  return `${group} school pupils, about 16 years old at most`;
}

function transcriptOf(turns: DebateTurn[], pupil: string, ai: string): string {
  return turns.map((m) => `${m.role === 'user' ? pupil : ai}: ${m.text}`).join('\n');
}

export interface OpponentPromptInput {
  topic: string;
  history: DebateTurn[];
  lastMessage: string;
  context?: string | null;
  targetGroup?: string | null;
}

/** Prompt for the AI Debater (the pupil's opponent). */
export function buildDebateOpponentPrompt(input: OpponentPromptInput): string {
  const background = (input.context || '').trim();

  return `
    You are a friendly debate partner for a school pupil. You argue the OTHER side so the pupil can practise.
    MOTION: "${input.topic}"
    ${background ? `BACKGROUND: ${background}` : ''}
    YOU ARE TALKING TO: ${describeDebateAudience(input.targetGroup)}.

    HOW TO SPEAK (VERY IMPORTANT):
    - Use simple, everyday English that this pupil can read easily. Short sentences. Common words.
    - Do NOT use hard or adult words such as "furthermore", "paradigm", "socioeconomic", "infrastructure",
      "detrimental", "stakeholders" or "fallacy". If you must use a harder word, explain it in a few simple words.
    - No statistics, research studies, laws, politics or adult topics the pupil would not know about.
    - Be kind and respectful. Never mock the pupil. You may start with a few warm words about their point.

    WHAT TO SAY:
    - First find out which side the pupil is on (FOR or AGAINST the motion) from the conversation, and take the opposite side.
      If the pupil has not chosen a side yet, kindly ask them to choose one.
    - Reply to the exact point the pupil just made. Do not ignore it and do not repeat a point you already used.
    - Give ONE clear counter-point with ONE example from a pupil's own life: school, home, friends, chores,
      homework, sports, food, the market, the farm, phones, church or mosque, and the community.
    - Your point must make sense to a child of this age and be something they could answer.
    - Keep the whole reply to 3 short sentences at most.
    - End with ONE simple question that asks the pupil to defend their side.

    CONVERSATION SO FAR:
    ${transcriptOf(input.history, 'Pupil', 'You')}

    PUPIL'S NEW ARGUMENT: "${input.lastMessage}"

    YOUR REPLY:
  `;
}

export interface JudgePromptInput {
  topic: string;
  messages: DebateTurn[];
  context?: string | null;
  targetGroup?: string | null;
}

/** Prompt for the AI Judge. The marks must come from what the pupil actually wrote in this debate. */
export function buildDebateJudgePrompt(input: JudgePromptInput): string {
  const pupilTurns = input.messages.filter((m) => m.role === 'user');
  const pupilWords = pupilTurns.reduce((n, m) => n + m.text.trim().split(/\s+/).filter(Boolean).length, 0);
  const background = (input.context || '').trim();

  const transcript = input.messages
    .map((m) => `${m.role === 'user' ? '[[STUDENT]]' : '[[OPPONENT]]'}: ${m.text}`)
    .join('\n\n');

  return `
    You are a fair and kind debate judge for a school debate club.
    DEBATE MOTION: "${input.topic}"
    ${background ? `BACKGROUND: ${background}` : ''}
    THE STUDENT IS: one of ${describeDebateAudience(input.targetGroup)}.

    Judge ONLY the [[STUDENT]] in the transcript below. Ignore how well the [[OPPONENT]] argued.
    The student spoke ${pupilTurns.length} time(s) and wrote about ${pupilWords} word(s) in total.

    TRANSCRIPT START:
    ${transcript}
    TRANSCRIPT END.

    HOW TO JUDGE (VERY IMPORTANT):
    - Base every mark on what the student ACTUALLY wrote in this transcript. Read each student turn before you decide.
    - There are no fixed, default or "safe" marks. Two different debates must not get the same marks unless
      the students really performed the same. Do not give 5, 6 or 7 just to be safe.
    - The three marks are separate. A student can be clear but not logical, or logical but weak at answering back.
    - Judge by the standard of a pupil of this age, not an adult or a university debater.
      Simple words and small grammar or spelling mistakes must NOT lower the marks if the meaning is clear.
    - Do not reward length alone, and do not reward copying the opponent's words.

    MARKS (each from 1 to 10, whole numbers):
    1. logicScore — the student's points and reasons about the motion.
       1-2: no real point (off-topic, one or two words, nonsense, or only "yes"/"no").
       3-4: gives an opinion but no reason, or the reason does not fit the motion.
       5-6: at least one sensible reason that fits the motion.
       7-8: two or more sensible reasons, with an example or explanation.
       9-10: strong, well-linked reasons with good examples, staying on the same side throughout.
    2. clarityScore — how easy the student's ideas are to follow.
       1-2: cannot be understood. 3-4: hard to follow. 5-6: understandable. 7-8: clear. 9-10: very clear and well ordered.
    3. rebuttalScore — how well the student answered the OPPONENT's points and questions.
       1-2: never answered the opponent (or spoke only once, before the opponent made a point).
       3-4: answered but only repeated their first point.
       5-6: answered at least one of the opponent's questions directly.
       7-8: answered the opponent's points and gave a reason why the opponent is wrong.
       9-10: answered every challenge and turned it in favour of their own side.

    FEEDBACK (write to the student, in simple, warm English they can read; no hard words):
    - feedback: 2 to 3 short sentences. Mention at least one point the student really made, in your own words,
      and say why they got these marks.
    - keyStrength: ONE specific thing this student did well in THIS debate (not general praise).
    - areaForImprovement: ONE specific, practical thing to do better next time, with a short example of how.
  `;
}

/**
 * XP for a judged debate: it follows the judge's three marks, so a stronger debate earns more.
 * An average of 1/10 earns 10 XP and 10/10 earns 100 XP.
 */
export function calculateDebateXp(scores: DebateScores): number {
  const values = [scores.logicScore, scores.clarityScore, scores.rebuttalScore].map((v) =>
    Number.isFinite(v) ? Math.max(1, Math.min(10, v)) : 1
  );
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.max(DEBATE_MIN_XP, Math.min(DEBATE_MAX_XP, Math.round(average * 10)));
}

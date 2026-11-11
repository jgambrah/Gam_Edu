import { describe, it, expect } from 'vitest';
import {
  DEBATE_MAX_XP,
  DEBATE_MIN_XP,
  buildDebateJudgePrompt,
  buildDebateOpponentPrompt,
  calculateDebateXp,
  describeDebateAudience,
  type DebateTurn,
} from './think-tank-debate';

const MOTION = 'Pupils should wear school uniforms';
const DEBATE: DebateTurn[] = [
  { role: 'model', text: 'Welcome to the debate! Are you For or Against this motion?' },
  { role: 'user', text: 'I am for it because uniforms make all pupils look equal.' },
  { role: 'model', text: 'But some families find uniforms costly. What about them?' },
  { role: 'user', text: 'One uniform is cheaper than buying many different clothes for school.' },
];

describe('AI Debater — speaks to basic-school pupils', () => {
  const prompt = buildDebateOpponentPrompt({
    topic: MOTION,
    history: DEBATE.slice(0, 3),
    lastMessage: DEBATE[3].text,
    context: 'Many schools in Ghana ask pupils to wear a uniform.',
    targetGroup: 'Scholar (JHS)',
  });

  it('USE CASE: is told to use simple English and avoid hard, adult words', () => {
    expect(prompt).toMatch(/simple, everyday English/);
    expect(prompt).toMatch(/Short sentences/);
    expect(prompt).toMatch(/Do NOT use hard or adult words/);
    expect(prompt).toMatch(/No statistics, research studies, laws, politics/);
  });

  it('USE CASE: is told who the pupil is, from the debate level', () => {
    expect(prompt).toContain('YOU ARE TALKING TO: Scholar (JHS) pupils, about 12 to 16 years old.');
  });

  it("USE CASE: must give a point from a pupil's own life that a child can answer", () => {
    expect(prompt).toMatch(/ONE example from a pupil's own life/);
    expect(prompt).toMatch(/make sense to a child of this age/);
  });

  it("USE CASE: must answer the pupil's actual point, take the other side, stay short and end with one question", () => {
    expect(prompt).toMatch(/take the opposite side/);
    expect(prompt).toMatch(/Reply to the exact point the pupil just made/);
    expect(prompt).toMatch(/3 short sentences at most/);
    expect(prompt).toMatch(/End with ONE simple question/);
  });

  it('includes the motion, the background, the conversation and the new argument', () => {
    expect(prompt).toContain(`MOTION: "${MOTION}"`);
    expect(prompt).toContain('BACKGROUND: Many schools in Ghana ask pupils to wear a uniform.');
    expect(prompt).toContain('Pupil: I am for it because uniforms make all pupils look equal.');
    expect(prompt).toContain('You: But some families find uniforms costly. What about them?');
    expect(prompt).toContain(`PUPIL'S NEW ARGUMENT: "${DEBATE[3].text}"`);
  });

  it('must be kind to the pupil', () => {
    expect(prompt).toMatch(/Never mock the pupil/);
  });
});

describe('AI Debater — audience by level', () => {
  it.each([
    ['Novice (Basic 1-3)', '6 to 9'],
    ['Apprentice (Basic 4-6)', '9 to 12'],
    ['Scholar (JHS)', '12 to 16'],
    ['Master (SHS)', '15 to 18'],
  ])('%s is described as about %s years old', (group, ages) => {
    expect(describeDebateAudience(group)).toContain(ages);
  });

  it('falls back to basic-school pupils up to 16 when the level is unknown', () => {
    expect(describeDebateAudience(undefined)).toMatch(/10 to 16 years old/);
    expect(describeDebateAudience('Club')).toMatch(/16 years old at most/);
  });
});

describe('AI Judge — marks come from the debate itself', () => {
  const prompt = buildDebateJudgePrompt({ topic: MOTION, messages: DEBATE, targetGroup: 'Scholar (JHS)' });

  it('USE CASE: is given the whole transcript and the motion', () => {
    expect(prompt).toContain(`DEBATE MOTION: "${MOTION}"`);
    expect(prompt).toContain('[[STUDENT]]: I am for it because uniforms make all pupils look equal.');
    expect(prompt).toContain('[[OPPONENT]]: But some families find uniforms costly. What about them?');
    expect(prompt).toContain('[[STUDENT]]: One uniform is cheaper than buying many different clothes for school.');
  });

  it('USE CASE: must mark what the student actually wrote, with no fixed or "safe" marks', () => {
    expect(prompt).toMatch(/Base every mark on what the student ACTUALLY wrote/);
    expect(prompt).toMatch(/no fixed, default or "safe" marks/);
    expect(prompt).toMatch(/The three marks are separate/);
  });

  it('USE CASE: has a clear guide for low, middle and high marks on each of the three skills', () => {
    expect(prompt).toMatch(/logicScore/);
    expect(prompt).toMatch(/clarityScore/);
    expect(prompt).toMatch(/rebuttalScore/);
    expect(prompt).toMatch(/1-2: no real point/);
    expect(prompt).toMatch(/9-10: strong, well-linked reasons/);
    expect(prompt).toMatch(/1-2: never answered the opponent/);
  });

  it('USE CASE: judges by the standard of a pupil, not an adult, and ignores small spelling mistakes', () => {
    expect(prompt).toMatch(/standard of a pupil of this age, not an adult/);
    expect(prompt).toMatch(/spelling mistakes must NOT lower the marks/);
    expect(prompt).toContain('Scholar (JHS) pupils, about 12 to 16 years old');
  });

  it('USE CASE: feedback must be in simple English and mention a point the student really made', () => {
    expect(prompt).toMatch(/simple, warm English/);
    expect(prompt).toMatch(/Mention at least one point the student really made/);
    expect(prompt).toMatch(/ONE specific thing this student did well in THIS debate/);
  });

  it('tells the judge how much the student took part, so a one-line debate cannot score like a full one', () => {
    expect(prompt).toContain('The student spoke 2 time(s) and wrote about 22 word(s) in total.');

    const short = buildDebateJudgePrompt({ topic: MOTION, messages: [DEBATE[0], { role: 'user', text: 'yes i agree' }] });
    expect(short).toContain('The student spoke 1 time(s) and wrote about 3 word(s) in total.');
    expect(short).toMatch(/Do not reward length alone/);
  });
});

describe('Debate XP — follows the judge\'s marks instead of a fixed number', () => {
  it('USE CASE: a weak, an average and a strong debate earn different XP', () => {
    const weak = calculateDebateXp({ logicScore: 2, clarityScore: 3, rebuttalScore: 1 });
    const average = calculateDebateXp({ logicScore: 6, clarityScore: 6, rebuttalScore: 5 });
    const strong = calculateDebateXp({ logicScore: 9, clarityScore: 9, rebuttalScore: 9 });

    expect(weak).toBe(10);
    expect(average).toBe(28);
    expect(strong).toBe(45);
    expect(weak).toBeLessThan(average);
    expect(average).toBeLessThan(strong);
  });

  it('uses all three marks, not only logic', () => {
    expect(calculateDebateXp({ logicScore: 8, clarityScore: 8, rebuttalScore: 8 })).toBeGreaterThan(
      calculateDebateXp({ logicScore: 8, clarityScore: 4, rebuttalScore: 2 })
    );
  });

  it('stays between the minimum and maximum, even with odd values', () => {
    expect(calculateDebateXp({ logicScore: 1, clarityScore: 1, rebuttalScore: 1 })).toBe(DEBATE_MIN_XP);
    expect(calculateDebateXp({ logicScore: 10, clarityScore: 10, rebuttalScore: 10 })).toBe(DEBATE_MAX_XP);
    expect(calculateDebateXp({ logicScore: 99, clarityScore: -5, rebuttalScore: NaN })).toBe(20);
  });
});

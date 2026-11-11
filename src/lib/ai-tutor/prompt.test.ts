import { describe, it, expect } from 'vitest';
import { buildTutorPrompt } from './prompt';

const base = {
  history: [
    { role: 'model' as const, content: 'Hello JAMES! What concept are we exploring today?' },
    { role: 'user' as const, content: 'Linear equation' },
  ],
  message: 'finding a mystery number',
};

describe('Dr. Gam prompt: keeps the "understanding first" teaching feature', () => {
  it('tells the tutor to find out what the student knows before explaining', () => {
    const prompt = buildTutorPrompt(base);
    expect(prompt).toContain('Understanding First');
    expect(prompt).toMatch(/Before you explain a new concept, ask ONE short, friendly question/);
    expect(prompt).toMatch(/Build your next step on THEIR answer/);
    expect(prompt).toMatch(/End every reply with a single clear question/);
  });

  it('still narrows a broad subject down to a topic first', () => {
    const prompt = buildTutorPrompt(base);
    expect(prompt).toContain('Narrow Down First (CRITICAL)');
    expect(prompt).toMatch(/ask them which \*\*Branch\*\* or \*\*Topic\*\*/);
  });

  it('keeps the Socratic rule of guiding with hints instead of giving the answer', () => {
    expect(buildTutorPrompt(base)).toMatch(/\*\*Socratic\*\*: Never give the direct answer/);
  });

  it('asks one question at a time and helps a stuck student with a worked step', () => {
    const prompt = buildTutorPrompt(base);
    expect(prompt).toMatch(/Ask only ONE question per reply/);
    expect(prompt).toMatch(/show ONE worked step on a similar example/);
  });

  it('includes the conversation so far and the new message', () => {
    const prompt = buildTutorPrompt(base);
    expect(prompt).toContain('Tutor: Hello JAMES! What concept are we exploring today?');
    expect(prompt).toContain('Student: Linear equation');
    expect(prompt).toContain('finding a mystery number');
  });

  it('uses the chosen level, style and subject, with sensible defaults', () => {
    const custom = buildTutorPrompt({
      ...base,
      difficulty: 'Senior High School',
      teachingStyle: 'Exam Challenge',
      subject: 'Mathematics',
    });
    expect(custom).toContain('**Target Grade/Difficulty level:** Senior High School');
    expect(custom).toContain('**Teaching Style Preference:** Exam Challenge');
    expect(custom).toContain('**Current Subject Focus:** Mathematics');

    const defaults = buildTutorPrompt(base);
    expect(defaults).toContain('**Target Grade/Difficulty level:** Junior High School');
    expect(defaults).toMatch(/\*\*Teaching Style Preference:\*\* Socratic/);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AUTO_VOICE_STORAGE_KEY,
  cleanTextForSpeech,
  detectVoiceCommand,
  loadAutoVoicePreference,
  saveAutoVoicePreference,
} from './voice';

describe('Dr. Gam voice: preference', () => {
  beforeEach(() => window.localStorage.clear());

  it('is OFF by default for a student who has never chosen', () => {
    expect(loadAutoVoicePreference()).toBe(false);
  });

  it('remembers the student turning voice on, then off again', () => {
    saveAutoVoicePreference(true);
    expect(window.localStorage.getItem(AUTO_VOICE_STORAGE_KEY)).toBe('on');
    expect(loadAutoVoicePreference()).toBe(true);

    saveAutoVoicePreference(false);
    expect(loadAutoVoicePreference()).toBe(false);
  });
});

describe('Dr. Gam voice: requests typed in the chat', () => {
  it.each([
    'turn on voice',
    'Turn on the audio please',
    'voice on',
    'Enable voice',
    'Dr. Gam, can you turn the sound on?',
    'talk to me',
    'read your answers aloud',
    'unmute',
  ])('"%s" switches voice on', (msg) => {
    expect(detectVoiceCommand(msg)).toBe('enable');
  });

  it.each([
    'stop voice',
    'Stop talking!',
    'mute',
    'turn off the audio',
    'please turn the voice off',
    'voice off',
    "don't read aloud",
    'no audio please',
    'text only',
  ])('"%s" switches voice off', (msg) => {
    expect(detectVoiceCommand(msg)).toBe('disable');
  });

  it.each([
    'read it aloud',
    'Read that out loud please',
    'read aloud',
    'say that again',
    'can you read it to me?',
    'let me hear it',
  ])('"%s" reads the last reply once', (msg) => {
    expect(detectVoiceCommand(msg)).toBe('read-last');
  });

  it.each([
    'Hi',
    'Linear equation',
    'finding a mystery number',
    'subtract 5',
    'What is the active voice in English?',
    'What is the difference between active voice and passive voice?',
    'How does sound travel through air?',
    'Why do we read aloud in class?',
    'Explain how to stop a chemical reaction',
    'How do I turn on a circuit with a switch?',
    '',
  ])('"%s" is a normal study message, not a voice request', (msg) => {
    expect(detectVoiceCommand(msg)).toBeNull();
  });
});

describe('Dr. Gam voice: text prepared for speech', () => {
  it('removes emojis and Markdown marks', () => {
    expect(cleanTextForSpeech("Hi! 👋 I'm **Dr. Gam**, and I'm so pumped! 📐✨")).toBe(
      "Hi! I'm Dr. Gam, and I'm so pumped!"
    );
  });

  it('reads an equation as words instead of symbols', () => {
    expect(cleanTextForSpeech('If we have the equation $x + 5 = 12$, what could we do?')).toBe(
      'If we have the equation x plus 5 equals 12, what could we do?'
    );
  });

  it('reads the real reply from the Linear Equations chat cleanly', () => {
    const reply =
      'Finding that mystery $x$ is like being a math detective! 🕵️‍♂️ To keep things fair, we must always do the same thing to both sides of the **"="** sign. ⚖️✨';
    const spoken = cleanTextForSpeech(reply);
    expect(spoken).not.toMatch(/[$*]/);
    expect(spoken).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(spoken).toContain('Finding that mystery x is like being a math detective!');
  });

  it('handles subtraction, negatives, powers, fractions and roots', () => {
    expect(cleanTextForSpeech('$2x - 3 = 7$')).toBe('2x minus 3 equals 7');
    expect(cleanTextForSpeech('$x = -4$')).toBe('x equals negative 4');
    expect(cleanTextForSpeech('$a^2 + b^2 = c^2$')).toBe('a squared plus b squared equals c squared');
    expect(cleanTextForSpeech('$\\frac{1}{2}$')).toBe('1 over 2');
    expect(cleanTextForSpeech('$\\sqrt{16} = 4$')).toBe('the square root of 16 equals 4');
    expect(cleanTextForSpeech('$3 \\times 4 = 12$')).toBe('3 times 4 equals 12');
  });

  it('keeps ordinary hyphenated words and list items readable', () => {
    expect(cleanTextForSpeech('- A step-by-step, well-known method\n- Try it')).toBe(
      'A step-by-step, well-known method Try it'
    );
  });

  it('drops the whiteboard instruction and returns empty text for emoji-only content', () => {
    expect(cleanTextForSpeech('Look here. SHOW BOARD: graph')).toBe('Look here.');
    expect(cleanTextForSpeech('🚀✨')).toBe('');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ---- Shared test state (hoisted so the vi.mock factories can read it) ----
const h = vi.hoisted(() => ({
  chatWithAiTutor: vi.fn(),
  toast: vi.fn(),
}));

vi.mock('@/firebase', () => ({ useUser: () => ({ user: { uid: 'u1', displayName: 'JAMES GAMBRAH' } }) }));
vi.mock('@/ai/flows/ai-tutor-flow', () => ({ chatWithAiTutor: (...a: any[]) => h.chatWithAiTutor(...a) }));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: h.toast }) }));
vi.mock('@/hooks/use-current-school', () => ({ useCurrentSchool: () => ({ schoolId: 'school1' }) }));
vi.mock('@/components/curriculum/MathRenderer', () => ({
  MathRenderer: ({ content }: any) => <div data-testid="tutor-reply">{content}</div>,
}));

import { AITutor } from './ai-tutor';
import { AUTO_VOICE_STORAGE_KEY } from '@/lib/ai-tutor/voice';

// ---- Fake browser speech engine ----
const speak = vi.fn();
const cancel = vi.fn();
class FakeUtterance {
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public text: string) {}
}
const spokenTexts = () => speak.mock.calls.map(([u]) => (u as FakeUtterance).text);

const TUTOR_REPLY =
  '**Linear equations!** Excellent choice! 🚀 If $x + 5 = 12$, what could we do to both sides? ⚖️';

async function ask(text: string) {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText(/Ask Dr. Gam/i), `${text}{Enter}`);
}

beforeEach(() => {
  speak.mockReset();
  cancel.mockReset();
  h.toast.mockReset();
  h.chatWithAiTutor.mockReset();
  h.chatWithAiTutor.mockResolvedValue({ success: true, text: TUTOR_REPLY });
  window.localStorage.clear();
  (window as any).speechSynthesis = { speak, cancel };
  (window as any).SpeechSynthesisUtterance = FakeUtterance;
  (globalThis as any).SpeechSynthesisUtterance = FakeUtterance;
  Element.prototype.scrollIntoView = vi.fn();
});

describe('Dr. Gam tutor — voice is optional', () => {
  it('USE CASE 1: voice is off by default, so a reply appears as text and is NOT read aloud', async () => {
    render(<AITutor subject="Mathematics" />);
    expect(screen.getByRole('button', { name: /Voice Off/i })).toHaveAttribute('aria-pressed', 'false');

    await ask('Linear equation');

    await waitFor(() => expect(screen.getAllByTestId('tutor-reply')).toHaveLength(2));
    expect(h.chatWithAiTutor).toHaveBeenCalledTimes(1);
    expect(speak).not.toHaveBeenCalled();
  });

  it('USE CASE 2: the student taps the speaker on one reply to hear just that reply, and taps again to stop', async () => {
    const user = userEvent.setup();
    render(<AITutor subject="Mathematics" />);
    await ask('Linear equation');
    await waitFor(() => expect(screen.getAllByTestId('tutor-reply')).toHaveLength(2));

    const listenButtons = screen.getAllByRole('button', { name: /Listen to this reply/i });
    await user.click(listenButtons[listenButtons.length - 1]);

    expect(spokenTexts()).toEqual([
      'Linear equations! Excellent choice! If x plus 5 equals 12, what could we do to both sides?',
    ]);

    await user.click(screen.getByRole('button', { name: /Stop listening/i }));
    expect(cancel).toHaveBeenCalled();
    // Auto-voice stays off: listening once does not switch it on.
    expect(screen.getByRole('button', { name: /Voice Off/i })).toBeInTheDocument();
  });

  it('USE CASE 3: the student switches Auto-Voice on, new replies are read aloud and the choice is remembered', async () => {
    const user = userEvent.setup();
    render(<AITutor subject="Mathematics" />);

    await user.click(screen.getByRole('button', { name: /Voice Off/i }));
    expect(screen.getByRole('button', { name: /Auto-Voice On/i })).toHaveAttribute('aria-pressed', 'true');
    expect(window.localStorage.getItem(AUTO_VOICE_STORAGE_KEY)).toBe('on');

    await ask('Linear equation');
    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    expect(spokenTexts()[0]).toContain('x plus 5 equals 12');

    await user.click(screen.getByRole('button', { name: /Auto-Voice On/i }));
    expect(window.localStorage.getItem(AUTO_VOICE_STORAGE_KEY)).toBe('off');
    expect(cancel).toHaveBeenCalled();
  });

  it('USE CASE 4: a student who chose voice before gets it back on their next visit', async () => {
    window.localStorage.setItem(AUTO_VOICE_STORAGE_KEY, 'on');
    render(<AITutor subject="Mathematics" />);

    expect(await screen.findByRole('button', { name: /Auto-Voice On/i })).toBeInTheDocument();
    await ask('Linear equation');
    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
  });
});

describe('Dr. Gam tutor — voice on request in the chat', () => {
  it('USE CASE 5: typing "turn on voice" switches voice on without calling the AI or spending a Spark', async () => {
    render(<AITutor subject="Mathematics" />);
    await ask('turn on voice');

    expect(await screen.findByText(/Voice is on/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Auto-Voice On/i })).toBeInTheDocument();
    expect(h.chatWithAiTutor).not.toHaveBeenCalled();
    expect(spokenTexts()[0]).toMatch(/^Voice is on/);

    await ask('Linear equation');
    await waitFor(() => expect(speak).toHaveBeenCalledTimes(2));
    expect(h.chatWithAiTutor).toHaveBeenCalledTimes(1);
  });

  it('USE CASE 6: typing "stop talking" silences Dr. Gam and later replies stay silent', async () => {
    window.localStorage.setItem(AUTO_VOICE_STORAGE_KEY, 'on');
    render(<AITutor subject="Mathematics" />);
    await screen.findByRole('button', { name: /Auto-Voice On/i });

    await ask('stop talking');

    expect(await screen.findByText(/Voice is off/i)).toBeInTheDocument();
    expect(cancel).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Voice Off/i })).toBeInTheDocument();
    expect(h.chatWithAiTutor).not.toHaveBeenCalled();

    await ask('Linear equation');
    await waitFor(() => expect(h.chatWithAiTutor).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getAllByTestId('tutor-reply')).toHaveLength(3));
    expect(speak).not.toHaveBeenCalled();
  });

  it('USE CASE 7: typing "read it aloud" reads the last lesson reply once and leaves Auto-Voice off', async () => {
    render(<AITutor subject="Mathematics" />);
    await ask('Linear equation');
    await waitFor(() => expect(screen.getAllByTestId('tutor-reply')).toHaveLength(2));
    expect(speak).not.toHaveBeenCalled();

    await ask('read it aloud');

    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    expect(spokenTexts()[0]).toContain('x plus 5 equals 12');
    expect(h.chatWithAiTutor).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Voice Off/i })).toBeInTheDocument();
  });

  it('USE CASE 8: a real question that mentions voice goes to the tutor as normal', async () => {
    render(<AITutor subject="English & Arts" />);
    await ask('What is the active voice in English?');

    await waitFor(() => expect(h.chatWithAiTutor).toHaveBeenCalledTimes(1));
    expect(h.chatWithAiTutor.mock.calls[0][0].message).toBe('What is the active voice in English?');
    expect(screen.getByRole('button', { name: /Voice Off/i })).toBeInTheDocument();
  });

  it('USE CASE 9: voice requests are kept out of the lesson history sent to the AI', async () => {
    render(<AITutor subject="Mathematics" />);
    await ask('turn on voice');
    await screen.findByText(/Voice is on/i);
    await ask('Linear equation');

    await waitFor(() => expect(h.chatWithAiTutor).toHaveBeenCalledTimes(1));
    const sent = h.chatWithAiTutor.mock.calls[0][0];
    expect(sent.message).toBe('Linear equation');
    const historyText = sent.history.map((m: any) => m.content).join(' | ');
    expect(historyText).toContain("I'm Dr. Gam");
    expect(historyText).not.toMatch(/turn on voice|Voice is on/i);
  });

  it('USE CASE 10: on a browser with no speech support, asking for voice explains this instead of failing', async () => {
    delete (window as any).speechSynthesis;
    render(<AITutor subject="Mathematics" />);
    await ask('turn on voice');

    expect(await screen.findByText(/this browser can't read aloud/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Voice Off/i })).toBeInTheDocument();
    expect(h.chatWithAiTutor).not.toHaveBeenCalled();
  });
});

describe('Dr. Gam tutor — lesson flow is unchanged', () => {
  it('USE CASE 11: sends the chosen level, style and subject with the conversation so the tutor can check understanding first', async () => {
    render(<AITutor subject="Mathematics" difficulty="Junior High School" />);
    await ask('Linear equation');

    await waitFor(() => expect(h.chatWithAiTutor).toHaveBeenCalledTimes(1));
    expect(h.chatWithAiTutor.mock.calls[0][0]).toMatchObject({
      message: 'Linear equation',
      userId: 'u1',
      schoolId: 'school1',
      subject: 'Mathematics',
      difficulty: 'Junior High School',
    });
    expect(h.chatWithAiTutor.mock.calls[0][0].teachingStyle).toMatch(/^Socratic/);
    expect(h.chatWithAiTutor.mock.calls[0][0].history[0].content).toMatch(/^Hello JAMES!/);
  });
});

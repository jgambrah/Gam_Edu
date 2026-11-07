import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ---- Shared, mutable test state (hoisted so the vi.mock factories below can read it) ----
const h = vi.hoisted(() => ({
  savedStories: [] as any[],
  juniorSchoolId: 'school1' as string | null,
  currentSchoolId: 'school1' as string | null,
  toast: vi.fn(),
  addDoc: vi.fn(),
  uploadString: vi.fn(),
  getDownloadURL: vi.fn(),
  generateJuniorStory: vi.fn(),
  generateLessonImageAction: vi.fn(),
  forceRefetch: vi.fn(),
}));

vi.mock('@/firebase', () => ({
  useUser: () => ({ user: { uid: 'u1' } }),
  useFirestore: () => ({}),
}));
vi.mock('@/context/role-context', () => ({ useRole: () => ({ role: 'Teacher' }) }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  addDoc: (...a: any[]) => h.addDoc(...a),
  serverTimestamp: () => 'SERVER_TS',
}));
vi.mock('firebase/storage', () => ({
  getStorage: () => ({}),
  ref: (_s: any, path: string) => ({ fullPath: path }),
  uploadString: (...a: any[]) => h.uploadString(...a),
  getDownloadURL: (...a: any[]) => h.getDownloadURL(...a),
}));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('@/ai/flows/junior-actions', () => ({
  generateJuniorStory: (...a: any[]) => h.generateJuniorStory(...a),
  generateLessonImageAction: (...a: any[]) => h.generateLessonImageAction(...a),
  generateWordDetails: vi.fn(),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: h.toast }) }));
vi.mock('@/hooks/use-current-school', () => ({ useCurrentSchool: () => ({ schoolId: h.currentSchoolId }) }));
vi.mock('../junior-shared', () => ({
  useJuniorSchoolId: () => h.juniorSchoolId,
  juniorStamp: (schoolId: string | null) => ({ schoolId: schoolId || null, createdBy: 'u1' }),
  removeJuniorDoc: vi.fn().mockResolvedValue(true),
  useSchoolAndMine: () => ({ data: h.savedStories, forceRefetch: h.forceRefetch }),
}));

vi.mock('./StoryReader', () => ({ StoryReader: ({ story, onClose }: any) => (<div data-testid="reader">READER:{story.title}<button onClick={onClose}>shut</button></div>) }));
import { StorySpark } from './StorySpark';

// ---- Fixtures ----
const LEGACY_STORY = {
  id: 'legacy1',
  title: 'The Dragon Who Loved Cupcakes',
  emojiIcon: '🐉',
  content: 'Dax the dragon loved cupcakes.\nEvery day he baked one.\n\nThen he shared them.',
  topic: 'dragons',
  wordCount: 14,
  questions: [
    { question: 'What did Dax love?', answer: 'cupcakes' },
    { question: 'What did Dax do every day?', answer: 'baked' },
    { question: 'What did he do with them?', answer: 'shared' },
  ],
};

const PAGES_STORY = {
  id: 'pages1',
  title: 'Mia and the Moon',
  emojiIcon: '🌙',
  pages: [{ text: 'Mia looked up at the moon.' }, { text: 'The moon smiled back.' }],
};

const TWO_QUESTION_STORY = {
  id: 'two1',
  title: 'Two Question Tale',
  emojiIcon: '🦊',
  content: 'A fox found a berry.',
  questions: [
    { question: 'Who found a berry?', answer: 'fox' },
    { question: 'What did the fox find?', answer: 'berry' },
  ],
};

// ---- Browser API stubs jsdom does not provide ----
class FakeUtterance {
  text: string;
  pitch = 1;
  rate = 1;
  voice: any = null;
  onstart: any = null;
  onend: any = null;
  onerror: any = null;
  onboundary: any = null;
  constructor(text: string) {
    this.text = text;
  }
}
const speech = { speak: vi.fn(), cancel: vi.fn(), getVoices: vi.fn(() => []), onvoiceschanged: null as any };

beforeEach(() => {
  vi.clearAllMocks();
  h.savedStories = [];
  h.juniorSchoolId = 'school1';
  h.currentSchoolId = 'school1';
  h.addDoc.mockResolvedValue({ id: 'new' });
  h.uploadString.mockImplementation(async (r: any) => ({ ref: r }));
  h.getDownloadURL.mockResolvedValue('https://storage.example/cover.png?token=abc');
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  (window as any).speechSynthesis = speech;
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const openLibraryStory = async (user: ReturnType<typeof userEvent.setup>, title: string) => {
  await user.click(screen.getByText(title));
  speech.speak.mockClear();
  speech.cancel.mockClear();
};

describe('Story Spark — existing stories still open', () => {
  it('shows the built-in toddler story (a `pages` story) instead of a blank page', () => {
    render(<StorySpark canEdit={false} activeAgeTier="ages2-3" />);
    expect(screen.getByText(/The Happy Little Puppy/)).toBeInTheDocument();
    expect(screen.getByText('Goodnight')).toBeInTheDocument();
    expect(screen.getByText('Woof')).toBeInTheDocument();
  });

  it('shows no quiz for a story without questions, and does not crash', () => {
    render(<StorySpark canEdit={false} activeAgeTier="ages2-3" />);
    expect(screen.queryByText(/Question \d+ of/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Read Aloud/i })).toBeInTheDocument();
  });

  it('opens nothing on the other age tiers until a story is chosen', () => {
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    expect(screen.queryByRole('button', { name: /Read Aloud/i })).not.toBeInTheDocument();
  });

  it('opens a legacy saved `content` story from the library, text intact, with its 3-question quiz', async () => {
    h.savedStories = [LEGACY_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await openLibraryStory(user, LEGACY_STORY.title);

    for (const word of ['Dax', 'cupcakes.', 'baked', 'shared']) {
      expect(screen.getByText(word)).toBeInTheDocument();
    }
    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
  });

  it('opens a saved `pages` story from the library, shows its text, and has no quiz', async () => {
    h.savedStories = [PAGES_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await openLibraryStory(user, PAGES_STORY.title);

    expect(screen.getByText('moon.')).toBeInTheDocument();
    expect(screen.getByText('smiled')).toBeInTheDocument();
    expect(screen.queryByText(/Question \d+ of/)).not.toBeInTheDocument();
  });
});

describe('Story Spark — quiz follows the story, not a fixed three', () => {
  it('runs a 3-question quiz to a final score', async () => {
    h.savedStories = [LEGACY_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await openLibraryStory(user, LEGACY_STORY.title);

    const answers = ['cupcakes', 'baked', 'shared'];
    for (let i = 0; i < 3; i++) {
      expect(screen.getByText(`Question ${i + 1} of 3`)).toBeInTheDocument();
      await user.type(screen.getByPlaceholderText('Type your answer here...'), answers[i]);
      await user.click(screen.getByRole('button', { name: 'Check' }));
      expect(screen.getByText(/Great Thinking/)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: i < 2 ? /Next Question/ : /See Final Score/ }));
    }
    expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
    expect(screen.getByText('You got 3 out of 3 correct!')).toBeInTheDocument();
    expect(screen.getByText(/Superstar Reader/)).toBeInTheDocument();
  });

  it('reveals the right answer kindly when a guess is wrong, and still finishes', async () => {
    h.savedStories = [TWO_QUESTION_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await openLibraryStory(user, TWO_QUESTION_STORY.title);

    await user.type(screen.getByPlaceholderText('Type your answer here...'), 'banana');
    await user.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByText(/Not Quite/)).toBeInTheDocument();
    // the correct answer is shown ("fox" also appears in the story text, so look inside the feedback line)
    expect(screen.getByText(/The correct answer is/).textContent).toContain('fox');

    // ...and the quiz carries on to a final score that counts only the right answer
    await user.click(screen.getByRole('button', { name: /Next Question/ }));
    await user.type(screen.getByPlaceholderText('Type your answer here...'), 'berry');
    await user.click(screen.getByRole('button', { name: 'Check' }));
    await user.click(screen.getByRole('button', { name: /See Final Score/ }));
    expect(screen.getByText('You got 1 out of 2 correct!')).toBeInTheDocument();
    expect(screen.getByText(/Junior Explorer/)).toBeInTheDocument();
  });

  it('uses the real number of questions (2), including in the final score', async () => {
    h.savedStories = [TWO_QUESTION_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await openLibraryStory(user, TWO_QUESTION_STORY.title);

    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Type your answer here...'), 'fox');
    await user.click(screen.getByRole('button', { name: 'Check' }));
    await user.click(screen.getByRole('button', { name: /Next Question/ }));
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Type your answer here...'), 'berry');
    await user.click(screen.getByRole('button', { name: 'Check' }));
    await user.click(screen.getByRole('button', { name: /See Final Score/ }));
    expect(screen.getByText('You got 2 out of 2 correct!')).toBeInTheDocument();
  });
});

describe('Story Spark — audio playback (browser voice)', () => {
  it('reads the whole story text aloud and highlights the spoken word', async () => {
    h.savedStories = [LEGACY_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await openLibraryStory(user, LEGACY_STORY.title);

    await user.click(screen.getByRole('button', { name: /Read Aloud/i }));
    expect(speech.speak).toHaveBeenCalledTimes(1);
    const utterance = speech.speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toBe(LEGACY_STORY.content);

    act(() => utterance.onboundary({ name: 'word', charIndex: 0 }));
    expect(screen.getByText('Dax')).toHaveClass('story-word-active');
    expect(screen.getByText('the')).not.toHaveClass('story-word-active');

    // moving to a later word moves the highlight (offset of "baked" in the story text)
    act(() => utterance.onboundary({ name: 'word', charIndex: LEGACY_STORY.content.indexOf('baked') }));
    expect(screen.getByText('baked')).toHaveClass('story-word-active');
    expect(screen.getByText('Dax')).not.toHaveClass('story-word-active');
  });

  it('reads a `pages` story as well (all pages, in order)', async () => {
    h.savedStories = [PAGES_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await openLibraryStory(user, PAGES_STORY.title);

    await user.click(screen.getByRole('button', { name: /Read Aloud/i }));
    const utterance = speech.speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance.text).toBe('Mia looked up at the moon.\nThe moon smiled back.');
  });

  it('pauses: cancels speech and clears the highlight', async () => {
    h.savedStories = [LEGACY_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await openLibraryStory(user, LEGACY_STORY.title);

    await user.click(screen.getByRole('button', { name: /Read Aloud/i }));
    const utterance = speech.speak.mock.calls[0][0] as FakeUtterance;
    act(() => utterance.onboundary({ name: 'word', charIndex: 0 }));
    expect(screen.getByText('Dax')).toHaveClass('story-word-active');

    await user.click(screen.getByRole('button', { name: /Pause Reading/i }));
    expect(speech.cancel).toHaveBeenCalled();
    expect(screen.getByText('Dax')).not.toHaveClass('story-word-active');
    expect(screen.getByRole('button', { name: /Read Aloud/i })).toBeInTheDocument();
  });

  it('does not crash when the browser has no speech support', async () => {
    delete (window as any).speechSynthesis;
    h.savedStories = [LEGACY_STORY];
    const user = userEvent.setup();
    render(<StorySpark canEdit={false} activeAgeTier="ages3-4" />);
    await user.click(screen.getByText(LEGACY_STORY.title));
    await user.click(screen.getByRole('button', { name: /Read Aloud/i }));
    expect(screen.getByText('Dax')).toBeInTheDocument();
  });
});

describe('Story Spark — saving a generated story with its cover illustration', () => {
  const generate = async (user: ReturnType<typeof userEvent.setup>) => {
    h.generateJuniorStory.mockResolvedValue({
      success: true,
      data: {
        title: 'Generated Tale',
        emojiIcon: '🦄',
        content: 'A unicorn danced in the rain.',
        questions: [
          { question: 'Who danced?', answer: 'unicorn' },
          { question: 'Where?', answer: 'rain' },
          { question: 'What kind?', answer: 'rain' },
        ],
      },
    });
    h.generateLessonImageAction.mockResolvedValue({ success: true, data: 'data:image/png;base64,AAAA' });
    await user.type(screen.getByPlaceholderText(/What is the story about/), 'a dancing unicorn');
    await user.click(screen.getByRole('button', { name: 'Create Story' }));
    await waitFor(() => expect(screen.getByText('Save to Library')).toBeInTheDocument());
  };

  it('uploads the cover under schools/{schoolId}/… (a path storage.rules allows) and saves the download URL', async () => {
    const user = userEvent.setup();
    render(<StorySpark canEdit={true} activeAgeTier="ages3-4" />);
    await generate(user);
    await user.click(screen.getByRole('button', { name: /Save to Library/ }));

    await waitFor(() => expect(h.addDoc).toHaveBeenCalledTimes(1));
    expect(h.uploadString).toHaveBeenCalledTimes(1);
    const uploadedTo = h.uploadString.mock.calls[0][0].fullPath as string;
    expect(uploadedTo).toMatch(/^schools\/school1\/junior_stories\/u1_\d+_cover\.png$/);
    expect(uploadedTo.startsWith('junior_stories/')).toBe(false); // the old, denied path

    const saved = h.addDoc.mock.calls[0][1];
    expect(saved.imageUrl).toBe('https://storage.example/cover.png?token=abc');
    expect(saved.schoolId).toBe('school1');
    expect(saved.createdBy).toBe('u1');
    expect(saved.content).toBe('A unicorn danced in the rain.');
    expect(saved.wordCount).toBe(6);
    // never store the raw base64 picture in Firestore
    expect(JSON.stringify(saved)).not.toContain('base64');
  });

  it('still saves the story, tells the teacher, and never stores base64, when the upload fails', async () => {
    h.uploadString.mockRejectedValue(new Error('storage/unauthorized'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<StorySpark canEdit={true} activeAgeTier="ages3-4" />);
    await generate(user);
    await user.click(screen.getByRole('button', { name: /Save to Library/ }));

    await waitFor(() => expect(h.addDoc).toHaveBeenCalledTimes(1));
    expect(h.addDoc.mock.calls[0][1].imageUrl).toBe('');
    expect(h.toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Saved without the picture', variant: 'destructive' }));
  });

  it('does not attempt an upload when there is no school to file the picture under', async () => {
    h.juniorSchoolId = null;
    h.currentSchoolId = null;
    const user = userEvent.setup();
    render(<StorySpark canEdit={true} activeAgeTier="ages3-4" />);
    await generate(user);
    await user.click(screen.getByRole('button', { name: /Save to Library/ }));

    await waitFor(() => expect(h.addDoc).toHaveBeenCalledTimes(1));
    expect(h.uploadString).not.toHaveBeenCalled();
    expect(h.addDoc.mock.calls[0][1].imageUrl).toBe('');
    expect(h.toast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Saved without the picture' }));
  });

  it('keeps a generated story without a cover picture saveable (no upload, no warning)', async () => {
    h.generateLessonImageAction.mockResolvedValue({ success: true, data: null });
    const user = userEvent.setup();
    render(<StorySpark canEdit={true} activeAgeTier="ages3-4" />);
    h.generateJuniorStory.mockResolvedValue({
      success: true,
      data: { title: 'No Pic', emojiIcon: '📖', content: 'Just words.', questions: [{ question: 'q', answer: 'a' }] },
    });
    await user.type(screen.getByPlaceholderText(/What is the story about/), 'words');
    await user.click(screen.getByRole('button', { name: 'Create Story' }));
    await waitFor(() => expect(screen.getByText('Save to Library')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: /Save to Library/ }));

    await waitFor(() => expect(h.addDoc).toHaveBeenCalledTimes(1));
    expect(h.uploadString).not.toHaveBeenCalled();
    expect(h.toast).not.toHaveBeenCalledWith(expect.objectContaining({ title: 'Saved without the picture' }));
  });
});

describe('Story Spark — editor controls', () => {
  it('hides the Story Lab and Save button from people who cannot edit', () => {
    render(<StorySpark canEdit={false} activeAgeTier="ages2-3" />);
    expect(screen.queryByText('Story Lab')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Save to Library/ })).not.toBeInTheDocument();
  });

  it('shows the Story Lab to editors', () => {
    render(<StorySpark canEdit={true} activeAgeTier="ages3-4" />);
    expect(within(screen.getByText('Story Lab').closest('div')!.parentElement!).getByRole('button', { name: 'Create Story' })).toBeInTheDocument();
  });
});

describe('Story Spark — opening the story book', () => {
  it('offers the immersive book for the open story, passes the normalised story and age tier, and closes again', async () => {
    const user = userEvent.setup();
    render(<StorySpark canEdit={true} activeAgeTier="ages2-3" />);
    expect(screen.queryByTestId('reader')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open the story book' }));
    expect(screen.getByTestId('reader')).toHaveTextContent('READER:The Happy Little Puppy');
    await user.click(screen.getByRole('button', { name: 'shut' }));
    expect(screen.queryByTestId('reader')).not.toBeInTheDocument();
  });
});

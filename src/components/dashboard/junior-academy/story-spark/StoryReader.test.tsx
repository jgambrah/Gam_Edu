import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Fake narrator + piano so the tests can drive speech events and see what the reader asked for.
const h = vi.hoisted(() => ({
  speak: vi.fn(), cancel: vi.fn(), supported: true,
  pianoStart: vi.fn(() => true), pianoStop: vi.fn(), pianoDuck: vi.fn(), pianoVolume: vi.fn(), pianoDispose: vi.fn(),
  last: null as any,
}));
vi.mock('@/lib/story-spark/narration', () => ({
  pickVoice: () => null,
  Narrator: class {
    get supported() { return h.supported; }
    speak(text: string, o: any) { if (!h.supported) { o.onError?.(); return; } h.last = { text, ...o }; h.speak(text, o); }
    cancel() { h.cancel(); }
    pause() {} resume() {}
  },
}));
vi.mock('@/lib/story-spark/piano', () => ({
  Piano: class { start() { return h.pianoStart(); } stop() { h.pianoStop(); } duck(v: boolean) { h.pianoDuck(v); } setVolume(v: number) { h.pianoVolume(v); } dispose() { h.pianoDispose(); } },
}));

import { StoryReader } from './StoryReader';
import { normalizeStory } from '@/lib/story-spark/normalize';

const story = normalizeStory({
  title: 'Ama and the Little Goat', emojiIcon: '🐐',
  pages: [
    { text: 'Ama had a little goat.', emoji: '🐐' },
    { text: 'The goat ran to the river.', emoji: '🌊' },
    { text: 'Ama found it. The end!', emoji: '🎉', imageUrl: 'https://img.example/p3.png' },
  ],
});

beforeEach(() => {
  vi.clearAllMocks(); h.supported = true; h.last = null;
  localStorage.clear();
  (window as any).matchMedia = (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });
});
afterEach(() => vi.useRealTimers());

const open = async (tier = 'ages4-5', props: any = {}) => {
  const user = userEvent.setup();
  render(<StoryReader story={story} ageTier={tier} {...props} />);
  return user;
};
const startReading = async (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: /Start reading/ }));

describe('StoryReader — cover and modes', () => {
  it('opens on a cover with the title, page count, three reading modes and a Start button; nothing speaks yet', async () => {
    await open();
    expect(screen.getByRole('heading', { name: 'Ama and the Little Goat' })).toBeInTheDocument();
    expect(screen.getByText('3 pages')).toBeInTheDocument();
    const group = screen.getByRole('radiogroup', { name: /How would you like to read/ });
    expect(within(group).getAllByRole('radio').map((r) => r.textContent)).toEqual([
      expect.stringContaining('Read to me'), expect.stringContaining('Read with me'), expect.stringContaining('I read'),
    ]);
    expect(h.speak).not.toHaveBeenCalled(); // needs a tap first (browsers block audio until then)
  });

  it('starts in the mode that suits the age band', async () => {
    await open('ages2-3');
    expect(screen.getByRole('radio', { name: /Read to me/ })).toHaveAttribute('aria-checked', 'true');
  });
  it('remembers the chosen mode for next time', async () => {
    const user = await open('ages4-5');
    await user.click(screen.getByRole('radio', { name: /^I read/ }));
    expect(JSON.parse(localStorage.getItem('storyspark.reader.prefs.v1')!).mode).toBe('solo');
  });
  it('never turns the piano on by itself, even if it was on last time', async () => {
    localStorage.setItem('storyspark.reader.prefs.v1', JSON.stringify({ piano: true }));
    const user = await open(); await startReading(user);
    expect(h.pianoStart).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Soft piano off/ })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('StoryReader — Read to me', () => {
  it('reads page 1 as soon as Start is pressed, lights up words, and turns pages by itself, then shows The End', async () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    render(<StoryReader story={story} ageTier="ages2-3" onFinish={onFinish} />);
    act(() => { screen.getByRole('button', { name: /Start reading/ }).click(); });
    expect(h.speak).toHaveBeenCalledTimes(1);
    expect(h.last.text).toBe('Ama had a little goat.');
    expect(h.last.rate).toBe(0.7); // young children: slow voice

    act(() => h.last.onWord(2));
    expect(document.querySelector('[data-word="2"]')).toHaveAttribute('data-active', 'true');
    expect(document.querySelector('[data-word="1"]')).not.toHaveAttribute('data-active');

    act(() => { h.last.onEnd(); vi.advanceTimersByTime(800); });
    expect(h.last.text).toBe('The goat ran to the river.');
    act(() => { h.last.onEnd(); vi.advanceTimersByTime(800); });
    expect(h.last.text).toBe('Ama found it. The end!');
    act(() => { h.last.onEnd(); vi.advanceTimersByTime(800); });
    expect(screen.getByRole('heading', { name: 'The End' })).toBeInTheDocument();
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});

describe('StoryReader — Read with me', () => {
  it('reads a page, then waits for the child to turn it', async () => {
    vi.useFakeTimers();
    render(<StoryReader story={story} ageTier="ages4-5" />);
    act(() => { screen.getByRole('button', { name: /Start reading/ }).click(); });
    expect(h.last.text).toBe('Ama had a little goat.');
    act(() => { h.last.onEnd(); vi.advanceTimersByTime(5000); });
    expect(screen.getByTestId('page-text').textContent).toContain('Ama had a little goat.'); // still page 1
    act(() => { screen.getByRole('button', { name: 'Next page' }).click(); });
    expect(h.last.text).toBe('The goat ran to the river.');
  });
});

describe('StoryReader — I read', () => {
  it('stays silent until the child asks, and does not highlight', async () => {
    const user = await open('ages4-5');
    await user.click(screen.getByRole('radio', { name: /^I read/ }));
    await startReading(user);
    expect(h.speak).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /Hear this page/ }));
    expect(h.speak).toHaveBeenCalledTimes(1);
    act(() => h.last.onWord(1));
    expect(document.querySelector('[data-active="true"]')).toBeNull();
  });
});

describe('StoryReader — help with words and pages', () => {
  it('tapping a word says just that word (punctuation removed)', async () => {
    const user = await open('ages4-5'); await user.click(screen.getByRole('radio', { name: /^I read/ })); await startReading(user);
    await user.click(screen.getByText('goat.'));
    expect(h.last.text).toBe('goat');
    expect(h.last.rate).toBeLessThanOrEqual(0.8);
  });
  it('“Stop” stops the voice', async () => {
    const user = await open('ages4-5'); await startReading(user);
    expect(screen.getByRole('button', { name: /Stop/ })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: /Stop/ }));
    expect(h.cancel).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Hear this page/ })).toBeInTheDocument();
  });
  it('changing the voice speed changes the speaking rate', async () => {
    const user = await open('ages4-5'); await startReading(user);
    await user.selectOptions(screen.getByLabelText(/Voice speed/), 'quick');
    await user.click(screen.getByRole('button', { name: /Stop/ }));
    await user.click(screen.getByRole('button', { name: /Hear this page/ }));
    expect(h.last.rate).toBe(1.1);
  });
});

describe('StoryReader — navigation, pictures and accessibility', () => {
  it('Back is disabled on page 1; Next / Back move through pages and announce the page number', async () => {
    const user = await open('ages4-5'); await user.click(screen.getByRole('radio', { name: /^I read/ })); await startReading(user);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
  });
  it('arrow keys turn pages and Space reads', async () => {
    const user = await open('ages4-5'); await user.click(screen.getByRole('radio', { name: /^I read/ })); await startReading(user);
    screen.getByRole('region', { name: /Story book/ }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
    await user.keyboard(' ');
    expect(h.speak).toHaveBeenCalled();
  });
  it('shows the page picture when there is one, otherwise a big emoji (hidden from screen readers)', async () => {
    const user = await open('ages4-5'); await user.click(screen.getByRole('radio', { name: /^I read/ })); await startReading(user);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getAllByText('🐐').length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: 'Next page' })); await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('img', { name: /Illustration for page 3/ })).toHaveAttribute('src', 'https://img.example/p3.png');
  });
  it('text can be made bigger and smaller, within limits', async () => {
    const user = await open('ages4-5'); await user.click(screen.getByRole('radio', { name: /^I read/ })); await startReading(user);
    const size = () => parseFloat((screen.getByTestId('page-text') as HTMLElement).style.fontSize);
    const base = size();
    await user.click(screen.getByRole('button', { name: 'Bigger text' }));
    expect(size()).toBeGreaterThan(base);
    expect(screen.getByRole('button', { name: 'Smaller text' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Bigger text' }));
    expect(screen.getByRole('button', { name: 'Bigger text' })).toBeDisabled();
  });
  it('every control has an accessible name', async () => {
    const user = await open('ages4-5'); await startReading(user);
    for (const b of screen.getAllByRole('button')) expect((b.textContent || '').trim() || b.getAttribute('aria-label')).toBeTruthy();
  });
  it('respects reduced-motion: the lit word does not zoom', async () => {
    (window as any).matchMedia = (q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} });
    const user = await open('ages4-5'); await startReading(user);
    act(() => h.last.onWord(0));
    expect(document.querySelector('[data-word="0"]')!.className).not.toContain('scale-110');
  });
});

describe('StoryReader — soft piano', () => {
  it('turns on only when asked, shows a volume control, ducks while the voice speaks, and stops when switched off', async () => {
    const user = await open('ages4-5'); await startReading(user);
    expect(h.pianoDuck).toHaveBeenLastCalledWith(true); // page 1 is being read
    await user.click(screen.getByRole('button', { name: /Soft piano off/ }));
    expect(h.pianoStart).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(/Music volume/)).toBeInTheDocument();
    act(() => h.last.onEnd());
    expect(h.pianoDuck).toHaveBeenLastCalledWith(false);
    await user.click(screen.getByRole('button', { name: /Soft piano on/ }));
    expect(h.pianoStop).toHaveBeenCalled();
    expect(screen.queryByLabelText(/Music volume/)).not.toBeInTheDocument();
  });
  it('falls back to “off” if the browser cannot play audio', async () => {
    h.pianoStart.mockReturnValueOnce(false);
    const user = await open('ages4-5'); await startReading(user);
    await user.click(screen.getByRole('button', { name: /Soft piano off/ }));
    expect(screen.getByRole('button', { name: /Soft piano off/ })).toBeInTheDocument();
  });
  it('releases audio and speech when the book is closed', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<StoryReader story={story} ageTier="ages4-5" />);
    await user.click(screen.getByRole('button', { name: /Start reading/ }));
    unmount();
    expect(h.pianoDispose).toHaveBeenCalled(); expect(h.cancel).toHaveBeenCalled();
  });
});

describe('StoryReader — edge cases', () => {
  it('tells the child kindly when the device cannot read aloud, and the story is still readable', async () => {
    h.supported = false;
    await open();
    expect(screen.getByRole('alert')).toHaveTextContent(/can’t read aloud/);
    const user = userEvent.setup(); await user.click(screen.getByRole('button', { name: /Start reading/ }));
    expect(screen.getByTestId('page-text').textContent).toContain('Ama had a little goat.');
    expect(screen.getByRole('button', { name: /Hear this page/ })).toBeDisabled();
  });
  it('handles a story with no pages', () => {
    render(<StoryReader story={normalizeStory(null)} />);
    expect(screen.getByRole('status')).toHaveTextContent(/no pages/);
  });
  it('turns an old one-block story into several pages', async () => {
    const legacy = normalizeStory({ title: 'Old', content: Array.from({ length: 12 }, (_, i) => `Sentence number ${i + 1} is here.`).join(' ') });
    const user = userEvent.setup(); render(<StoryReader story={legacy} ageTier="ages4-5" />);
    expect(screen.getByText(/\d+ pages/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Start reading/ }));
    expect(screen.getByRole('status')).toHaveTextContent(/Page 1 of [2-9]/);
  });
  it('“Read again” goes back to page 1', async () => {
    vi.useFakeTimers();
    render(<StoryReader story={story} ageTier="ages2-3" />);
    act(() => { screen.getByRole('button', { name: /Start reading/ }).click(); });
    for (let i = 0; i < 3; i++) act(() => { h.last.onEnd(); vi.advanceTimersByTime(800); });
    act(() => { screen.getByRole('button', { name: /Read again/ }).click(); });
    expect(h.last.text).toBe('Ama had a little goat.');
  });
});

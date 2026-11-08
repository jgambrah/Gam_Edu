import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { LibraryDashboard } from './LibraryDashboard';
import { StoryNotes } from './StoryNotes';
import { createPreviewSource } from '@/lib/story-library/library-source';

// Serve the REAL built preview files from /public through a fetch stub (no network, no Firebase).
const pub = path.resolve(__dirname, '../../../public');
const fileFetch = (async (u: string) => {
  const p = path.join(pub, u.startsWith('/') ? u.slice(1) : u);
  try { const buf = readFileSync(p); return new Response(buf, { status: 200 }); } catch { return new Response('missing', { status: 404 }); }
}) as unknown as typeof fetch;

beforeEach(() => { localStorage.clear(); (globalThis as any).URL.createObjectURL = vi.fn(() => 'blob:x'); });
const make = () => createPreviewSource('/story-spark-preview', fileFetch);

describe('LibraryDashboard (real preview data)', () => {
  it('lists the forty-four stories with clean production badges', async () => {
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(44));
    for (const card of screen.getAllByTestId('story-card')) expect(within(card).getByText('🎨 Illustrated')).toBeTruthy();
  });

  it('filters by class, genre, reading level and age through the real catalogue client', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(44));
    const titles = () => screen.getAllByTestId('story-card').map((c) => within(c).getByRole('heading').textContent);
    await user.selectOptions(screen.getByLabelText('Class'), 'jhs-1');
    await waitFor(() => expect(titles().sort()).toEqual([
      'Abena Buys a Piece of a Company',
      'Abena and the Beginning of Everything',
      'Adwoa Refused to Be Limited',
      'Efua and the Business That Almost Failed',
      'Efua’s Honest Business',
      'From Kumasi to the World: The Girl Who Built a Billion-Dollar Idea',
      'Grandpa Mensah’s Secret to a Peaceful Retirement',
      'The App That Created a Hundred Jobs',
      'The Courage of Yaa Asantewaa',
      'The Door That Remembered',
      'The Dream That Powered a Nation',
      'The Girl Who Taught a Drone to See',
      'The Money That Worked While Afia Slept',
      'The Ocean That Hides a Thousand Secrets',
      'The River That Lost Its Voice',
      'The Umbrella Before the Rain',
      'The Village That Refused to Give Up',
      'We Built It Here in Ghana',
      'Yaa and the Mystery of Changing Life',
    ]));
    await user.selectOptions(screen.getByLabelText('Class'), 'nursery-2');
    await waitFor(() => expect(titles().sort()).toEqual(['Ama and the Lost Little Goat', 'The Little Star That Loved to Shine']));
    await user.selectOptions(screen.getByLabelText('Genre'), 'bedtime');
    await waitFor(() => expect(titles()).toEqual(['The Little Star That Loved to Shine']));
    await user.click(screen.getByText('Clear filters'));
    await user.selectOptions(screen.getByLabelText('Reading level'), 'developing');
    await waitFor(() => expect(titles().sort()).toEqual([
      'Adwoa and the Missing Market Change',
      'Ama’s Journey Above the Rainforest',
      'Esi and the Elephant’s Secret Path',
      'Kojo and the Forest of a Thousand Lives',
      'The Butterfly That Knew the Way',
      'The Clever Tortoise and the Rain',
      'The Town Where Everybody Waited',
      'Yaa and the Blocked Drain',
    ]));
  });

  it('shows a friendly empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(44));
    await user.selectOptions(screen.getByLabelText('Class'), 'nursery-1');
    await user.selectOptions(screen.getByLabelText('Genre'), 'mystery');
    await waitFor(() => expect(screen.getByTestId('empty')).toBeTruthy());
  });

  it('opens a story into the reader with the three reading modes and the right default for the age group', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(44));
    await user.click(screen.getByLabelText('Open Efua’s Honest Business'));
    await waitFor(() => expect(screen.getByTestId('reader')).toBeTruthy());
    expect(screen.getByTestId('reader').getAttribute('data-presentation')).toBe('jhs');
    expect(screen.getAllByRole('radio').map((r) => r.textContent)).toEqual(expect.arrayContaining(['Listen to Me', 'Read With Me', 'Let Me Read']));
    expect(screen.getByRole('radio', { name: 'Let Me Read' }).getAttribute('aria-checked')).toBe('true'); // JHS default: read it yourself
    expect(screen.getByTestId('sync-status').textContent).toMatch(/No narration in this mode/);
  });

  it('Efua and every Batch 1–5 story render their teacher’s guide without errors', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(44));
    await user.click(screen.getByLabelText('Open Efua’s Honest Business'));
    await waitFor(() => expect(screen.getByTestId('story-notes')).toBeTruthy());
    expect(screen.getByTestId('teacher-guide').textContent).toMatch(/Reflection: use it in real life/);

    // Verify every single story in preview.json renders StoryNotes cleanly
    const previewJson = JSON.parse(readFileSync(path.join(pub, 'story-spark-preview/preview.json'), 'utf8'));
    for (const [, info] of Object.entries(previewJson)) {
      const { unmount } = render(<StoryNotes info={info as any} />);
      unmount();
    }
  });

  it('shows a clear error, not a blank screen, when the library cannot be loaded', async () => {
    const failing = (async () => new Response('x', { status: 500 })) as unknown as typeof fetch;
    render(<LibraryDashboard createSource={() => createPreviewSource('/story-spark-preview', failing)} />);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/could not be loaded/));
  });
});

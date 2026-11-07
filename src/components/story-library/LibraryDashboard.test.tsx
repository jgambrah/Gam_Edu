import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { LibraryDashboard } from './LibraryDashboard';
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
  it('lists the eight sample stories with the preview notice, and every card says what is a placeholder', async () => {
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(8));
    expect(screen.getAllByText(/not published content/i).length).toBeGreaterThan(0);
    for (const card of screen.getAllByTestId('story-card')) expect(within(card).getByText(/Placeholder art|Art sample \(page 1\)/)).toBeTruthy();
  });

  it('filters by class, genre, reading level and age through the real catalogue client', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(8));
    const titles = () => screen.getAllByTestId('story-card').map((c) => within(c).getByRole('heading').textContent);
    await user.selectOptions(screen.getByLabelText('Class'), 'jhs-1');
    await waitFor(() => expect(titles()).toEqual(['Efua’s Honest Business']));
    await user.selectOptions(screen.getByLabelText('Class'), 'nursery-2');
    await waitFor(() => expect(titles().sort()).toEqual(['Ama and the Lost Little Goat', 'The Little Star That Loved to Shine']));
    await user.selectOptions(screen.getByLabelText('Genre'), 'bedtime');
    await waitFor(() => expect(titles()).toEqual(['The Little Star That Loved to Shine']));
    await user.click(screen.getByText('Clear filters'));
    await user.selectOptions(screen.getByLabelText('Reading level'), 'developing');
    await waitFor(() => expect(titles().sort()).toEqual(['The Clever Tortoise and the Rain', 'Yaa and the Blocked Drain']));
  });

  it('shows a friendly empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(8));
    await user.selectOptions(screen.getByLabelText('Class'), 'nursery-1');
    await user.selectOptions(screen.getByLabelText('Genre'), 'mystery');
    await waitFor(() => expect(screen.getByTestId('empty')).toBeTruthy());
  });

  it('opens a story into the reader with the three reading modes and the right default for the age group', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(8));
    await user.click(screen.getByLabelText('Open Efua’s Honest Business'));
    await waitFor(() => expect(screen.getByTestId('reader')).toBeTruthy());
    expect(screen.getByTestId('reader').getAttribute('data-presentation')).toBe('jhs');
    expect(screen.getAllByRole('radio').map((r) => r.textContent)).toEqual(expect.arrayContaining(['Listen to Me', 'Read With Me', 'Let Me Read']));
    expect(screen.getByRole('radio', { name: 'Let Me Read' }).getAttribute('aria-checked')).toBe('true'); // JHS default: read it yourself
    expect(screen.getByTestId('sync-status').textContent).toMatch(/No narration in this mode/);
  });

  it('Efua shows an honest status panel and the teacher’s guide; nothing claims illustrations or verified names exist', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(8));
    await user.click(screen.getByLabelText('Open Efua’s Honest Business'));
    await waitFor(() => expect(screen.getByTestId('story-notes')).toBeTruthy());
    expect(screen.getByTestId('illustration-status').textContent).toMatch(/0 of 13 approved image files exist/);
    expect(screen.getByTestId('teacher-guide').textContent).toMatch(/Reflection: use it in real life/);
    expect(screen.getByTestId('story-notes').textContent).toMatch(/NONE verified by a native speaker/);
    expect(screen.getByTestId('story-notes').textContent).toMatch(/awaiting native-speaker review/);
  });

  it('shows a clear error, not a blank screen, when the library cannot be loaded', async () => {
    const failing = (async () => new Response('x', { status: 500 })) as unknown as typeof fetch;
    render(<LibraryDashboard createSource={() => createPreviewSource('/story-spark-preview', failing)} />);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/could not be loaded/));
  });
});

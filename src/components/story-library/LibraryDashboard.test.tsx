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
// Baseline timestamp before any 2026+ 48h batch releaseAt, keeping the 228 legacy public-shelf assertions deterministic forever.
const LEGACY_PUBLIC_NOW_MS = 1_700_000_000_000;

describe('LibraryDashboard (real preview data)', () => {
  it('lists the two hundred and twenty-eight stories with clean production badges', async () => {
    render(<LibraryDashboard createSource={make} nowMs={LEGACY_PUBLIC_NOW_MS} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(228));
    for (const card of screen.getAllByTestId('story-card')) expect(within(card).getByText('🎨 Illustrated')).toBeTruthy();
  });

  it('filters by class, genre, reading level and age through the real catalogue client', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} nowMs={LEGACY_PUBLIC_NOW_MS} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(228));
    const titles = () => screen.getAllByTestId('story-card').map((c) => within(c).getByRole('heading').textContent);
    await user.selectOptions(screen.getByLabelText('Class'), 'jhs-1');
    await waitFor(() => expect(titles().sort()).toEqual([
      'Abena Buys a Piece of a Company',
      'Abena and the Beginning of Everything',
      'Adwoa Refused to Be Limited',
      'Behind the Estate Gate',
      'Black Star Rising (a poem)',
      'Chop Box Night',
      'Colours Day at Red House',
      'Community Day on the Open Ground',
      'Dear Cousin, Guess What!',
      'Dear Madam, Not Dear Cousin',
      'Down Where the Light Ends',
      'Efua and the Business That Almost Failed',
      'Efua’s Honest Business',
      'Faces That Look Like Ours',
      'Farming Is Not for Failures',
      'Friday in the Zongo',
      'From Kumasi to the World: The Girl Who Built a Billion-Dollar Idea',
      'Grandpa Mensah’s Secret to a Peaceful Retirement',
      'June the Third',
      'Late Again, Bismark?',
      'Many Sticks, One Bundle',
      'Milk, Middlemen and a Cooperative',
      'Ninety-Two Minutes',
      'One Trotro, Four Worlds',
      'Pause Before You Post',
      'Poku Leaves the Classroom',
      'Six Men and One Licence',
      'The App That Created a Hundred Jobs',
      'The Bacterium in the Insulin Bottle',
      'The Bag That Keeps the Weevils Out',
      'The Boy Who Built a Voice',
      'The Castle Built for Gold',
      'The Chain From Seed to Shelf',
      'The Chief’s Long Night',
      'The Clay Dog of Kintampo',
      'The Cocoa Farm and the Offer',
      'The Code in the Iron Box',
      'The Courage of Yaa Asantewaa',
      'The Door That Remembered',
      'The Door and the Dungeon',
      'The Drain Detectives',
      'The Dream That Powered a Nation',
      'The Dust That Danced',
      'The Freezer That Keeps Tomorrow',
      'The Girl Who Carries the Market',
      'The Girl Who Taught a Drone to See',
      'The Girl Who Wrote Down the Stories',
      'The Gold Road to Manso',
      'The Island That Sank in a Night',
      'The Lagoon Side Cup',
      'The Lake That Fell From the Sky',
      'The Lantern on the Lake',
      'The Last Question',
      'The Last Saturday',
      'The Loom That Clicked at Midnight',
      'The Lost Capital of Old Ghana',
      'The Midge That Makes the Chocolate',
      'The Money Pit of Oak Island',
      'The Money That Worked While Afia Slept',
      'The Monkeys of Boabeng-Fiema',
      'The Mosque Built in a Dream',
      'The New Girl and the Joke That Stung',
      'The Night the Stars Asked Questions',
      'The Ocean That Hides a Thousand Secrets',
      'The Red Hunter and the Drummers',
      'The River That Learned to Smile',
      'The River That Lost Its Voice',
      'The River They Called Dead',
      'The River in Twenty Years',
      'The Science Fair and the Free Rider',
      'The Sculpture That Keeps a Secret',
      'The Secrets of the Great Pyramid',
      'The Small Plan That Can Grow',
      'The Stones of Stonehenge',
      'The Stool from the Sky',
      'The Stream Under the Road',
      'The Teacher Who Drew the Flag',
      'The Town That Vanished from the Map',
      'The True Reasons',
      'The Tuck Shop Economist',
      'The Umbrella Before the Rain',
      'The Village That Owned a Factory',
      'The Village That Refused to Give Up',
      'The Voice Note',
      'The Wall of Notsé',
      'The Weights That Whisper Proverbs',
      'The Woman Who Asked for Trees',
      'Two Kinds of Truth',
      'Two Women and a Cold Room',
      'Typing Like You Talk',
      'Voices Along the River',
      'We Built It Here in Ghana',
      'What Is Hiding in the Gold?',
      'Whose Drain Is It?',
      'Yaa and the Mystery of Changing Life',
    ]));
    await user.selectOptions(screen.getByLabelText('Class'), 'nursery-2');
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(18));
    await waitFor(() => expect(titles().sort()).toEqual([
      'Ama and the Lost Little Goat',
      'Brush, Brush, Brush (a tooth-brushing chant)',
      'Buzz Finds a Flower',
      'Colours at the Market (a colour rhyme)',
      'Dede and the Puddle',
      'Five Ripe Mangoes (a counting rhyme)',
      'Goodnight, Little Compound',
      'Kente Colours (a rhyme)',
      'Little Hen’s Big Sneeze',
      'Little Turtle’s Big Swim',
      'Moon and Stars (a bedtime lullaby)',
      'My Busy Body (an action rhyme)',
      'Stop, Look, Listen!',
      'Ten Little Fingers (a counting rhyme)',
      'The Little Star That Loved to Shine',
      'Wash, Wash, Wash!',
      'Who Says What? (an animal sounds rhyme)',
      'Zenabu’s Net Night',
    ]));
    await user.selectOptions(screen.getByLabelText('Genre'), 'bedtime');
    await waitFor(() => expect(titles().sort()).toEqual([
      'Goodnight, Little Compound',
      'Moon and Stars (a bedtime lullaby)',
      'The Little Star That Loved to Shine',
      'Zenabu’s Net Night',
    ]));
    await user.click(screen.getByText('Clear filters'));
    await user.selectOptions(screen.getByLabelText('Reading level'), 'developing');
    await waitFor(() => expect(titles().sort()).toEqual([
      'Adoley and the Racing Heart',
      'Adwoa and the Missing Market Change',
      'Akrofi and the Sugar Test',
      'Ama’s Journey Above the Rainforest',
      'Ananse and the Midnight Thread',
      'Ananse and the Pot of Wisdom',
      'Awuku and the Peel Heap',
      'Esi and the Elephant’s Secret Path',
      'Fiifi Goes Back for His Book',
      'Fosuaa Joins Class Three',
      'Habiba and the Hot Spoon',
      'Kojo and the Forest of a Thousand Lives',
      'Lekettey and the Kite Tin',
      'Market Day Song (a poem)',
      'Okai’s Sack Garden',
      'Sumaila and the Question at the Back',
      'Sun, Earth and Moon (a poem)',
      'The Boy Who Came Out of the Forest',
      'The Butterfly That Knew the Way',
      'The Case of the Missing Kenkey',
      'The Clever Tortoise and the Rain',
      'The Frogs Who Sang Too Loud',
      'The Girl Who Asked Why',
      'The Girl Who Wrote Down the Stories',
      'The Little People of the Forest',
      'The Night the Lights Went Out',
      'The Queen of the Market',
      'The Slowest Drummer',
      'The Town Where Everybody Waited',
      'The Treasure Under the Mango Tree',
      'The Trees Say Thank You (a poem)',
      'The Water Under the Water',
      'Two Kinds of Truth',
      'Two Ways to Say Thank You',
      'When the River Turned Brown',
      'Yaa and the Blocked Drain',
    ]));
  }, 15000);

  it('shows a friendly empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} nowMs={LEGACY_PUBLIC_NOW_MS} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(228));
    await user.selectOptions(screen.getByLabelText('Class'), 'nursery-1');
    await user.selectOptions(screen.getByLabelText('Genre'), 'mystery');
    await waitFor(() => expect(screen.getByTestId('empty')).toBeTruthy());
  });

  it('opens a story into the reader with the three reading modes and the right default for the age group', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} nowMs={LEGACY_PUBLIC_NOW_MS} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(228));
    await user.click(screen.getByLabelText('Open Efua’s Honest Business'));
    await waitFor(() => expect(screen.getByTestId('reader')).toBeTruthy());
    expect(screen.getByTestId('reader').getAttribute('data-presentation')).toBe('jhs');
    expect(screen.getAllByRole('radio').map((r) => r.textContent)).toEqual(expect.arrayContaining(['Listen to Me', 'Read With Me', 'Let Me Read']));
    expect(screen.getByRole('radio', { name: 'Let Me Read' }).getAttribute('aria-checked')).toBe('true'); // JHS default: read it yourself
    expect(screen.getByTestId('sync-status').textContent).toMatch(/No narration in this mode/);
  }, 15000);

  it('Efua and every Batch 1–35 story render their teacher’s guide without errors', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} nowMs={LEGACY_PUBLIC_NOW_MS} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(228));
    await user.click(screen.getByLabelText('Open Efua’s Honest Business'));
    await waitFor(() => expect(screen.getByTestId('story-notes')).toBeTruthy());
    expect(screen.getByTestId('teacher-guide').textContent).toMatch(/Reflection: use it in real life/);

    // Verify every single story in preview.json renders StoryNotes cleanly
    const previewJson = JSON.parse(readFileSync(path.join(pub, 'story-spark-preview/preview.json'), 'utf8'));
    for (const [, info] of Object.entries(previewJson)) {
      const { unmount } = render(<StoryNotes info={info as any} />);
      unmount();
    }
  }, 15000);

  it('updates In Progress, Finished, and Favourites counters accurately', async () => {
    const user = userEvent.setup();
    render(<LibraryDashboard createSource={make} nowMs={LEGACY_PUBLIC_NOW_MS} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(228));
    const stats = () => screen.getByTestId('hero-stats').textContent ?? '';
    expect(stats()).toContain('228');

    // Toggle a favourite heart on the first story card
    const firstCard = screen.getAllByTestId('story-card')[0];
    const favBtn = within(firstCard).getByRole('button', { name: /Save .* to favourites/i });
    await user.click(favBtn);
    expect(stats()).toMatch(/1\s*❤️ Favourites/);

    // Open a story on Page 1 and return to library -> counts as 1 In Progress
    await user.click(screen.getByLabelText('Open Efua’s Honest Business'));
    await waitFor(() => expect(screen.getByTestId('reader')).toBeTruthy());
    await user.click(screen.getByRole('button', { name: /Library/i }));
    await waitFor(() => expect(screen.getByTestId('hero-stats')).toBeTruthy());
    expect(stats()).toMatch(/1\s*▶️ In Progress/);
  }, 15000);

  it('shows a clear error, not a blank screen, when the library cannot be loaded', async () => {
    const failing = (async () => new Response('x', { status: 500 })) as unknown as typeof fetch;
    render(<LibraryDashboard createSource={() => createPreviewSource('/story-spark-preview', failing)} />);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/could not be loaded/));
  });

  it('enforces the 48-hour developer quarantine in the UI and exposes Under Review + Hold controls only to jamesgambrah@gmail.com', async () => {
    const user = userEvent.setup();
    const fixedNow = 1_800_000_000_000;
    const quarantineFetch = (async (u: string) => {
      if (u.endsWith('/catalogue.json')) {
        const raw = JSON.parse(readFileSync(path.join(pub, 'story-spark-preview/catalogue.json'), 'utf8'));
        const publicBaseEntries = raw.entries.filter((e: any) => !e.releaseAt);
        const base = publicBaseEntries[0];
        const quarantinedEntry = {
          ...base,
          storyKey: 'quarantine-batch-test-story',
          title: 'Quarantined Batch Preview Story',
          sortKey: 229,
          publishedAt: fixedNow,
          releaseAt: fixedNow + 48 * 60 * 60 * 1000,
        };
        const body = JSON.stringify({
          ...raw,
          catalogueVersion: raw.catalogueVersion + 1,
          totalPublished: publicBaseEntries.length + 1,
          entries: [...publicBaseEntries, quarantinedEntry],
        });
        return new Response(body, { status: 200 });
      }
      return fileFetch(u);
    }) as unknown as typeof fetch;

    const makeWithQuarantine = () => createPreviewSource('/story-spark-preview', quarantineFetch);

    // 1. Non-developer viewer: sees 228 public stories, hides quarantined story & hides Under Review tab
    const { unmount } = render(
      <LibraryDashboard createSource={makeWithQuarantine} viewerEmail="teacher@school.edu.gh" nowMs={fixedNow + 60_000} />,
    );
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(228));
    expect(screen.queryByText('Quarantined Batch Preview Story')).toBeNull();
    expect(screen.queryByTestId('under-review-tab')).toBeNull();
    expect(screen.getByTestId('hero-stats').textContent).toContain('228');
    unmount();

    // 2. Developer viewer (jamesgambrah@gmail.com): sees all 229 stories, Under Review (48h) tab, countdown badge, and Hold button
    const { unmount: unmountDev } = render(
      <LibraryDashboard createSource={makeWithQuarantine} viewerEmail="jamesgambrah@gmail.com" nowMs={fixedNow + 60_000} />,
    );
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(229));
    expect(screen.getByTestId('under-review-tab').textContent).toContain('Under Review (48h) (1)');

    await user.click(screen.getByTestId('under-review-tab'));
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(1));
    expect(screen.getByText('Quarantined Batch Preview Story')).toBeTruthy();
    expect(screen.getByTestId('quarantine-badge').textContent).toMatch(/Under Review • 48h left/);

    // Hold / Flag before 48h expires
    await user.click(screen.getByRole('button', { name: /Hold \/ Flag/i }));
    await waitFor(() => expect(screen.getByTestId('quarantine-badge').textContent).toBe('🚩 Held from Release'));
    unmountDev();

    // 3. After 48 hours have elapsed (with clean overrides): auto-promoted to general readers with zero cron jobs
    localStorage.clear();
    render(
      <LibraryDashboard
        createSource={makeWithQuarantine}
        viewerEmail="pupil@school.edu.gh"
        nowMs={fixedNow + 49 * 60 * 60 * 1000}
      />,
    );
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(229));
    expect(screen.getByText('Quarantined Batch Preview Story')).toBeTruthy();
  }, 15000);

  it('exposes all 246 real catalogue stories (including Quarantined Batches 33–35) to jamesgambrah@gmail.com immediately and to everyone after 48h', async () => {
    const rawCat = JSON.parse(readFileSync(path.join(pub, 'story-spark-preview/catalogue.json'), 'utf8'));
    const newEntries = rawCat.entries.filter((e: any) => e.sortKey > 228);
    expect(newEntries).toHaveLength(18);
    const duringQuarantineMs = Math.max(...newEntries.map((e: any) => e.publishedAt)) + 60_000;
    const afterQuarantineMs = Math.max(...newEntries.map((e: any) => e.releaseAt)) + 60_000;

    const { unmount: unmountPublic } = render(
      <LibraryDashboard createSource={make} viewerEmail="pupil@school.edu.gh" nowMs={duringQuarantineMs} />,
    );
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(228));
    unmountPublic();

    const { unmount: unmountDev } = render(
      <LibraryDashboard createSource={make} viewerEmail="jamesgambrah@gmail.com" nowMs={duringQuarantineMs} />,
    );
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(246));
    expect(screen.getByTestId('under-review-tab').textContent).toContain('Under Review (48h) (18)');
    unmountDev();

    render(<LibraryDashboard createSource={make} viewerEmail="pupil@school.edu.gh" nowMs={afterQuarantineMs} />);
    await waitFor(() => expect(screen.getAllByTestId('story-card')).toHaveLength(246));
  }, 15000);
});

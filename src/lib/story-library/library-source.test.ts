// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createPreviewSource, resolveCdnMediaUrl } from './library-source';

describe('library-source Storage CDN & content-hashed infoPath resolution', () => {
  it('resolves Firebase Storage /o base URLs with encoded object keys and ?alt=media', () => {
    const cdn = 'https://firebasestorage.googleapis.com/v0/b/gamedu-69888475-f5783.firebasestorage.app/o';
    expect(resolveCdnMediaUrl('/story-spark-preview/catalogue.json', cdn)).toBe(
      'https://firebasestorage.googleapis.com/v0/b/gamedu-69888475-f5783.firebasestorage.app/o/story-spark-preview%2Fcatalogue.json?alt=media',
    );
    expect(resolveCdnMediaUrl('/story-spark-preview/info/ama-lost-little-goat.a1b2c3d4e5f6.json', cdn)).toBe(
      'https://firebasestorage.googleapis.com/v0/b/gamedu-69888475-f5783.firebasestorage.app/o/story-spark-preview%2Finfo%2Fama-lost-little-goat.a1b2c3d4e5f6.json?alt=media',
    );
  });

  it('fetches content-hashed info/<storyKey>.<infoHash12>.json via catalogue entry infoPath', async () => {
    const requestedUrls: string[] = [];
    const cdn = 'https://firebasestorage.googleapis.com/v0/b/gamedu-69888475-f5783.firebasestorage.app/o';
    const fakeFetch: typeof fetch = async (input) => {
      const url = String(input);
      requestedUrls.push(url);
      if (url.includes('story-spark-preview%2Fcatalogue.json')) {
        return new Response(
          JSON.stringify({
            catalogueVersion: 71,
            totalPublished: 1,
            entries: [
              {
                storyKey: 'ama-lost-little-goat',
                version: 1,
                packageVersion: 1,
                status: 'published',
                title: "Ama's Lost Little Goat",
                ageTiers: ['early'],
                pageCount: 6,
                packagePath: '/story-spark-preview/packages/ama-lost-little-goat.112233445566.json',
                packageHash: `sha256:${'1'.repeat(64)}`,
                infoPath: '/story-spark-preview/info/ama-lost-little-goat.aabbccddeeff.json',
                infoHash: `sha256:${'a'.repeat(64)}`,
                contentHash: `sha256:${'2'.repeat(64)}`,
                publishedBy: 'story-publish',
              },
            ],
          }),
          { status: 200 },
        );
      }
      if (url.includes('story-spark-preview%2Finfo%2Fama-lost-little-goat.aabbccddeeff.json')) {
        return new Response(
          JSON.stringify({
            set: 'pilot',
            status: 'approved',
            palette: ['#fde68a', '#f59e0b'],
            characters: ['Ama'],
            narrationPlan: { voice: 'Kore', pace: 'warm', notes: [] },
            music: 'gentle',
            culturalNotes: [],
            reviewQuestions: [],
            pages: [],
            assetStatus: { text: 'approved' },
          }),
          { status: 200 },
        );
      }
      return new Response('Not found', { status: 404 });
    };

    const src = await createPreviewSource('/story-spark-preview', fakeFetch, { cdnBaseUrl: cdn });
    const info = await src.loadInfo?.('ama-lost-little-goat');
    expect(info?.characters).toEqual(['Ama']);
    expect(requestedUrls).toContain(
      'https://firebasestorage.googleapis.com/v0/b/gamedu-69888475-f5783.firebasestorage.app/o/story-spark-preview%2Finfo%2Fama-lost-little-goat.aabbccddeeff.json?alt=media',
    );
    expect(requestedUrls.some((u) => u.includes('ama-lost-little-goat.json'))).toBe(false);
  });

  it('falls back to plain info/<storyKey>.json when catalogue entry has no infoPath (rollback compatibility)', async () => {
    const requestedUrls: string[] = [];
    const fakeFetch: typeof fetch = async (input) => {
      const url = String(input);
      requestedUrls.push(url);
      if (url === '/story-spark-preview/catalogue.json') {
        return new Response(
          JSON.stringify({
            catalogueVersion: 68,
            totalPublished: 1,
            entries: [
              {
                storyKey: 'ama-lost-little-goat',
                version: 1,
                packageVersion: 1,
                status: 'published',
                title: "Ama's Lost Little Goat",
                ageTiers: ['early'],
                pageCount: 6,
                packagePath: '/story-spark-preview/packages/ama-lost-little-goat.json',
                packageHash: `sha256:${'1'.repeat(64)}`,
                contentHash: `sha256:${'2'.repeat(64)}`,
                publishedBy: 'preview-build',
              },
            ],
          }),
          { status: 200 },
        );
      }
      if (url === '/story-spark-preview/info/ama-lost-little-goat.json') {
        return new Response(
          JSON.stringify({
            set: 'pilot',
            status: 'approved',
            palette: ['#fde68a', '#f59e0b'],
            characters: ['Ama', 'Pepe'],
            narrationPlan: { voice: 'Kore', pace: 'warm', notes: [] },
            music: 'gentle',
            culturalNotes: [],
            reviewQuestions: [],
            pages: [],
            assetStatus: { text: 'approved' },
          }),
          { status: 200 },
        );
      }
      return new Response('Not found', { status: 404 });
    };

    const src = await createPreviewSource('/story-spark-preview', fakeFetch, { cdnBaseUrl: '' });
    const info = await src.loadInfo?.('ama-lost-little-goat');
    expect(info?.characters).toEqual(['Ama', 'Pepe']);
    expect(requestedUrls).toEqual([
      '/story-spark-preview/catalogue.json',
      '/story-spark-preview/info/ama-lost-little-goat.json',
    ]);
  });
});


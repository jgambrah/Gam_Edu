import { describe, it, expect } from 'vitest';
import { buildStoryCoverPath } from './storage-path';

describe('buildStoryCoverPath', () => {
  it('builds a path under schools/{schoolId}/ — the only story-adjacent path storage.rules currently allows', () => {
    const p = buildStoryCoverPath('oHr3BrGdK2eS5MQ5zmZU', 'user_1', 1700000000000);
    expect(p).toBe('schools/oHr3BrGdK2eS5MQ5zmZU/junior_stories/user_1_1700000000000_cover.png');
    // Mirrors the rule `match /schools/{schoolId}/{allPaths=**}`.
    expect(p!.startsWith('schools/oHr3BrGdK2eS5MQ5zmZU/')).toBe(true);
  });

  it('never returns the old path that storage.rules denied', () => {
    expect(buildStoryCoverPath('s1', 'u1', 1)!.startsWith('junior_stories/')).toBe(false);
  });

  it.each([
    [null, 'u1'],
    [undefined, 'u1'],
    ['', 'u1'],
    ['s1', null],
    ['s1', undefined],
    ['s1', ''],
  ])('returns null when the school or user is missing (%p, %p)', (school, uid) => {
    expect(buildStoryCoverPath(school as any, uid as any)).toBeNull();
  });

  it.each(['../other', 'a/b', 'a b', 'a.b', 'a%2Fb', '..', 'x'.repeat(129)])(
    'refuses ids that could escape their folder (%p)',
    (bad) => {
      expect(buildStoryCoverPath(bad, 'u1')).toBeNull();
      expect(buildStoryCoverPath('s1', bad)).toBeNull();
    },
  );

  it('uses the current time when none is given', () => {
    const p = buildStoryCoverPath('s1', 'u1');
    expect(p).toMatch(/^schools\/s1\/junior_stories\/u1_\d{13}_cover\.png$/);
  });
});

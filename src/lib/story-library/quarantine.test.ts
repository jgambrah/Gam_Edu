// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  DEVELOPER_REVIEWER_EMAIL,
  REVIEW_QUARANTINE_MS,
  formatQuarantineBadge,
  getStoryQuarantineStatus,
  isDeveloperReviewer,
  isStoryVisibleToViewer,
} from './quarantine';
import type { CatalogueEntry } from './types';

function mockEntry(overrides: Partial<CatalogueEntry> = {}): CatalogueEntry {
  return {
    storyKey: 'test-quarantine-story',
    version: 1,
    packageVersion: 1,
    status: 'published',
    title: 'Test Quarantine Story',
    ageTiers: ['7-8'],
    pageCount: 6,
    packagePath: 'story_library/published/packages/test-quarantine-story/v1/package.json',
    packageHash: `sha256:${'a'.repeat(64)}`,
    contentHash: `sha256:${'b'.repeat(64)}`,
    publishedBy: 'pub-1',
    ...overrides,
  };
}

describe('48-Hour Developer Review Quarantine (jamesgambrah@gmail.com)', () => {
  const T0 = 1_800_000_000_000;

  it('recognises only jamesgambrah@gmail.com (case-insensitive) as the developer reviewer', () => {
    expect(isDeveloperReviewer('jamesgambrah@gmail.com')).toBe(true);
    expect(isDeveloperReviewer('  JamesGambrah@Gmail.com ')).toBe(true);
    expect(isDeveloperReviewer('teacher@school.edu.gh')).toBe(false);
    expect(isDeveloperReviewer('atampokaadongo@gmail.com')).toBe(false);
    expect(isDeveloperReviewer(null)).toBe(false);
    expect(isDeveloperReviewer(undefined)).toBe(false);
  });

  it('keeps legacy stories (no releaseAt) immediately visible to everyone', () => {
    const legacy = mockEntry({ storyKey: 'how-ananse-won-the-stories', releaseAt: undefined });
    expect(isStoryVisibleToViewer(legacy, { viewerEmail: null, nowMs: T0 })).toBe(true);
    expect(isStoryVisibleToViewer(legacy, { viewerEmail: 'pupil@school.edu.gh', nowMs: T0 })).toBe(true);
    expect(isStoryVisibleToViewer(legacy, { viewerEmail: DEVELOPER_REVIEWER_EMAIL, nowMs: T0 })).toBe(true);
  });

  it('hides newly seeded stories during the first 48 hours from everyone except jamesgambrah@gmail.com', () => {
    const fresh = mockEntry({
      publishedAt: T0,
      releaseAt: T0 + REVIEW_QUARANTINE_MS,
    });

    // At +12 hours: hidden from anonymous and school accounts, visible to developer
    const t12h = T0 + 12 * 60 * 60 * 1000;
    expect(isStoryVisibleToViewer(fresh, { viewerEmail: null, nowMs: t12h })).toBe(false);
    expect(isStoryVisibleToViewer(fresh, { viewerEmail: 'director@school.edu.gh', nowMs: t12h })).toBe(false);
    expect(isStoryVisibleToViewer(fresh, { viewerEmail: DEVELOPER_REVIEWER_EMAIL, nowMs: t12h })).toBe(true);

    const status = getStoryQuarantineStatus(fresh, { nowMs: t12h });
    expect(status.isQuarantined).toBe(true);
    expect(status.inWindow).toBe(true);
    expect(formatQuarantineBadge(status)).toBe('⏳ Under Review • 36h left');
  });

  it('auto-promotes to every school and reader once 48 hours have elapsed without cron jobs', () => {
    const fresh = mockEntry({
      publishedAt: T0,
      releaseAt: T0 + REVIEW_QUARANTINE_MS,
    });

    const after48h = T0 + REVIEW_QUARANTINE_MS;
    expect(isStoryVisibleToViewer(fresh, { viewerEmail: null, nowMs: after48h })).toBe(true);
    expect(isStoryVisibleToViewer(fresh, { viewerEmail: 'pupil@school.edu.gh', nowMs: after48h })).toBe(true);
    expect(getStoryQuarantineStatus(fresh, { nowMs: after48h }).isQuarantined).toBe(false);
  });

  it('keeps held/flagged stories out of the general repository even after 48 hours expire, until unheld or released', () => {
    const fresh = mockEntry({
      storyKey: 'flagged-story',
      publishedAt: T0,
      releaseAt: T0 + REVIEW_QUARANTINE_MS,
    });
    const after72h = T0 + 72 * 60 * 60 * 1000;
    const heldKeys = new Set(['flagged-story']);

    expect(isStoryVisibleToViewer(fresh, { viewerEmail: null, nowMs: after72h, heldKeys })).toBe(false);
    expect(isStoryVisibleToViewer(fresh, { viewerEmail: 'teacher@school.edu.gh', nowMs: after72h, heldKeys })).toBe(false);
    expect(isStoryVisibleToViewer(fresh, { viewerEmail: DEVELOPER_REVIEWER_EMAIL, nowMs: after72h, heldKeys })).toBe(true);
    expect(formatQuarantineBadge(getStoryQuarantineStatus(fresh, { nowMs: after72h, heldKeys }))).toBe('🚩 Held from Release');

    // Early/explicit approval releases it immediately
    const approvedKeys = new Set(['flagged-story']);
    expect(isStoryVisibleToViewer(fresh, { viewerEmail: null, nowMs: T0 + 1000, approvedKeys })).toBe(true);
  });
});


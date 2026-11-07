import { describe, it, expect } from 'vitest';
import { checkStagingTarget, PRODUCTION_PROJECT_ID } from './staging-guard';

describe('checkStagingTarget', () => {
  it('refuses production by id', () => expect(checkStagingTarget(PRODUCTION_PROJECT_ID, { emulator: false })).toContain('PRODUCTION'));
  it('refuses any non-staging id', () => expect(checkStagingTarget('some-other-project', { emulator: false })).toContain('not a staging project'));
  it('refuses a look-alike id', () => expect(checkStagingTarget('prod-gamedu-staging', { emulator: false })).toContain('not a staging project'));
  it('refuses a missing id', () => expect(checkStagingTarget(undefined, { emulator: false })).toContain('FIREBASE_PROJECT_ID'));
  it('accepts a staging id', () => expect(checkStagingTarget('gamedu-staging-1', { emulator: false })).toBeNull());
  it('accepts the emulator even with the production id configured (no real data is reachable)', () =>
    expect(checkStagingTarget(PRODUCTION_PROJECT_ID, { emulator: true })).toBeNull());
});

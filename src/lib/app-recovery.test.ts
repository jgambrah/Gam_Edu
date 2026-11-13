import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { claimAutoReload, describeErrorForSupport, isStaleBuildError, reloadAppFresh } from './app-recovery';

function fakeStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => { data[k] = v; },
  };
}

describe('App recovery — spotting a phone that is running an old version', () => {
  it.each([
    [Object.assign(new Error('Loading chunk 8839 failed.\n(error: https://x/_next/static/chunks/8839.js)'), { name: 'ChunkLoadError' })],
    [new Error('Loading chunk app/dashboard/page failed.')],
    [new Error('Loading CSS chunk 12 failed.')],
    [new TypeError('Failed to fetch dynamically imported module: https://x/_next/static/chunks/1.js')],
    [new TypeError('Importing a module script failed.')],
  ])('USE CASE: "%s" is an old-version error', (error) => {
    expect(isStaleBuildError(error)).toBe(true);
  });

  it.each([
    [new Error('Missing or insufficient permissions')],
    [new Error("Cannot read properties of undefined (reading 'map')")],
    [new TypeError('Failed to fetch')],
    [null],
    [undefined],
  ])('USE CASE: "%s" is NOT an old-version error', (error) => {
    expect(isStaleBuildError(error)).toBe(false);
  });
});

describe('App recovery — automatic reload happens once, never in a loop', () => {
  it('USE CASE: the first failure reloads automatically; a second within a minute does not', () => {
    const storage = fakeStorage();
    expect(claimAutoReload(storage, 1_000_000)).toBe(true);
    expect(claimAutoReload(storage, 1_000_000 + 5_000)).toBe(false);
    expect(claimAutoReload(storage, 1_000_000 + 59_000)).toBe(false);
  });

  it('allows another automatic reload after a minute', () => {
    const storage = fakeStorage();
    expect(claimAutoReload(storage, 1_000_000)).toBe(true);
    expect(claimAutoReload(storage, 1_000_000 + 61_000)).toBe(true);
  });

  it('SAFETY: with no storage, or blocked storage, it never reloads automatically', () => {
    expect(claimAutoReload(null)).toBe(false);
    expect(claimAutoReload(undefined)).toBe(false);
    const blocked = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
    expect(claimAutoReload(blocked)).toBe(false);
  });

  it('ignores a corrupted saved time', () => {
    expect(claimAutoReload(fakeStorage({ gam_auto_reload_at: 'not-a-number' }), 5_000)).toBe(true);
  });
});

describe('App recovery — details shown for support', () => {
  it('USE CASE: an ordinary error shows its name and message', () => {
    expect(describeErrorForSupport(new TypeError("Cannot read properties of undefined (reading 'map')"))).toBe(
      "TypeError: Cannot read properties of undefined (reading 'map')"
    );
  });

  it("USE CASE: a database error shows what was refused, but never the signed-in person's details", () => {
    const error = Object.assign(new Error(
      'Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n' +
      JSON.stringify({ auth: { uid: 'u1', token: { email: 'someone@example.com', name: 'Some One' } }, method: 'list', path: '/databases/(default)/documents/quizAttempts' }, null, 2)
    ), { name: 'FirebaseError' });
    const line = describeErrorForSupport(error, 'abc123');

    expect(line).toContain('FirebaseError: Missing or insufficient permissions');
    expect(line).toContain('list quizAttempts');
    expect(line).toContain('Ref abc123');
    expect(line).not.toContain('someone@example.com');
    expect(line).not.toContain('Some One');
    expect(line).not.toContain('u1');
  });

  it('reads the request from the error object when it has one, and copes with odd values', () => {
    expect(describeErrorForSupport({ name: 'FirebaseError', message: 'Denied', request: { method: 'get', path: '/databases/(default)/documents/users/abc' } }))
      .toBe('FirebaseError: Denied • get users/abc');
    expect(describeErrorForSupport(null)).toBe('Error');
    expect(describeErrorForSupport('plain text')).toBe('Error: plain text');
    expect(describeErrorForSupport(new Error('x'.repeat(500))).length).toBeLessThan(180);
  });
});

describe('App recovery — Reload app', () => {
  const originalLocation = window.location;
  const reload = vi.fn();

  beforeEach(() => {
    reload.mockReset();
    Object.defineProperty(window, 'location', { configurable: true, value: { ...originalLocation, reload } });
  });
  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
    delete (navigator as any).serviceWorker;
    delete (window as any).caches;
    vi.useRealTimers();
  });

  it('USE CASE: removes the saved app shell and file cache, then reloads', async () => {
    const unregister = vi.fn().mockResolvedValue(true);
    const cacheDelete = vi.fn().mockResolvedValue(true);
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { getRegistrations: vi.fn().mockResolvedValue([{ unregister }, { unregister }]) } });
    (window as any).caches = { keys: vi.fn().mockResolvedValue(['gam-edu-cache-v4']), delete: cacheDelete };

    await reloadAppFresh();

    expect(unregister).toHaveBeenCalledTimes(2);
    expect(cacheDelete).toHaveBeenCalledWith('gam-edu-cache-v4');
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('USE CASE: still reloads when the phone has no saved app shell at all', async () => {
    await reloadAppFresh();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('SAFETY: still reloads when the clean-up fails', async () => {
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { getRegistrations: vi.fn().mockRejectedValue(new Error('nope')) } });
    await reloadAppFresh();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('SAFETY: still reloads when the clean-up never finishes', async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { getRegistrations: () => new Promise(() => {}) } });
    const done = reloadAppFresh();
    await vi.advanceTimersByTimeAsync(1600);
    await done;
    expect(reload).toHaveBeenCalledTimes(1);
  });
});

/**
 * App recovery helpers for the error screens.
 *
 * The installed phone app (PWA) has no browser refresh button, so the error screens must offer their own
 * way to reload, and must recover by themselves from the most common cause: the phone is still running an
 * older build after a new version was deployed ("Loading chunk … failed").
 *
 * Pure where possible so it can be unit tested.
 */

const AUTO_RELOAD_KEY = 'gam_auto_reload_at';
const AUTO_RELOAD_WINDOW_MS = 60 * 1000;

/** True when the error means this device is running an out-of-date build of the app. */
export function isStaleBuildError(error: unknown): boolean {
  const name = String((error as any)?.name || '');
  const message = String((error as any)?.message || error || '');
  return (
    name === 'ChunkLoadError' ||
    /Loading (CSS )?chunk \S+ failed|ChunkLoadError|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message)
  );
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Allows ONE automatic reload per minute, so a device that keeps failing does not reload in a loop.
 * Returns true (and records the time) when an automatic reload may go ahead.
 */
export function claimAutoReload(storage: StorageLike | null | undefined, now: number = Date.now()): boolean {
  if (!storage) return false;
  try {
    const last = Number(storage.getItem(AUTO_RELOAD_KEY) || 0);
    if (Number.isFinite(last) && last > 0 && now - last < AUTO_RELOAD_WINDOW_MS) return false;
    storage.setItem(AUTO_RELOAD_KEY, String(now));
    return true;
  } catch {
    // Storage blocked (private mode): without a record we cannot prevent a loop, so do not auto-reload.
    return false;
  }
}

/**
 * A short, safe line describing the error, shown on the error screen so a screenshot tells support what
 * failed. Never includes the signed-in person's details (database errors carry them in their full text).
 */
export function describeErrorForSupport(error: unknown, digest?: string): string {
  const name = String((error as any)?.name || 'Error');
  const full = String((error as any)?.message || error || '');
  const firstLine = full.split('\n')[0].trim().slice(0, 160);
  const parts = [firstLine ? `${name}: ${firstLine}` : name];

  const request = (error as any)?.request;
  const method = typeof request?.method === 'string' ? request.method : /"method":\s*"([^"]+)"/.exec(full)?.[1];
  const path = typeof request?.path === 'string' ? request.path : /"path":\s*"([^"]+)"/.exec(full)?.[1];
  if (method || path) {
    parts.push(`${method || 'request'} ${String(path || '').replace('/databases/(default)/documents/', '')}`.trim().slice(0, 160));
  }
  if (digest) parts.push(`Ref ${digest}`);
  return parts.join(' • ');
}

/**
 * Reloads the app with a clean start: the saved app shell (service worker and its file cache) is removed
 * first so the newest version is fetched. The person stays signed in. Always reloads, even if the clean-up
 * fails or is slow.
 */
export async function reloadAppFresh(): Promise<void> {
  if (typeof window === 'undefined') return;
  const cleanUp = (async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
      }
    } catch {
      /* reload anyway */
    }
  })();
  await Promise.race([cleanUp, new Promise((resolve) => setTimeout(resolve, 1500))]);
  window.location.reload();
}

'use client';

import { useEffect, useState } from 'react';
import { claimAutoReload, describeErrorForSupport, isStaleBuildError, reloadAppFresh } from '@/lib/app-recovery';

/**
 * The last-resort error screen (used by src/app/global-error.tsx).
 *
 * It replaces the whole app, so the app's stylesheet and components cannot be relied on: everything here is
 * styled inline. The installed phone app has no browser refresh button, so this screen provides real,
 * clearly visible buttons — and reloads by itself once when the device is simply running an old build.
 */
export function AppCrashScreen({
  error,
  reset,
}: {
  error: (Error & { digest?: string }) | null | undefined;
  reset: () => void;
}) {
  const [reloading, setReloading] = useState(false);
  const staleBuild = isStaleBuildError(error);

  useEffect(() => {
    if (error) console.error('[GAM Edu] App error screen shown:', error);
    if (!staleBuild) return;
    let storage: Storage | null = null;
    try { storage = window.sessionStorage; } catch { storage = null; }
    if (claimAutoReload(storage)) {
      setReloading(true);
      void reloadAppFresh();
    }
  }, [error, staleBuild]);

  const reload = () => {
    if (reloading) return;
    setReloading(true);
    void reloadAppFresh();
  };

  const button: React.CSSProperties = {
    display: 'block',
    width: '100%',
    minHeight: 52,
    padding: '14px 20px',
    borderRadius: 14,
    fontSize: 17,
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <div
      role="alert"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div
          aria-hidden="true"
          style={{
            width: 64, height: 64, margin: '0 auto 20px', borderRadius: 20, background: '#eef2ff', color: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800,
          }}
        >
          !
        </div>
        <h1 style={{ fontSize: 24, lineHeight: 1.25, fontWeight: 800, margin: '0 0 10px' }}>
          {reloading ? 'Getting the latest version…' : 'Something went wrong'}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.5, color: '#475569', margin: '0 0 26px' }}>
          {reloading
            ? 'Please wait a moment while GAM Edu reloads.'
            : 'GAM Edu could not open this page. Tap Reload app to start again.'}
        </p>

        <button
          type="button"
          onClick={reload}
          disabled={reloading}
          style={{ ...button, background: '#4f46e5', color: '#ffffff', border: '2px solid #4f46e5', opacity: reloading ? 0.7 : 1 }}
        >
          {reloading ? 'Reloading…' : 'Reload app'}
        </button>
        {!reloading && (
          <button
            type="button"
            onClick={() => reset()}
            style={{ ...button, marginTop: 12, background: '#ffffff', color: '#4f46e5', border: '2px solid #c7d2fe' }}
          >
            Try again
          </button>
        )}

        {!reloading && (
          <p style={{ fontSize: 14, lineHeight: 1.5, color: '#64748b', margin: '22px 0 0' }}>
            Still not working? Check your internet connection, then close the app fully and open it again.
          </p>
        )}

        {error && !reloading && (
          <p
            data-testid="crash-details"
            style={{
              fontSize: 11, lineHeight: 1.5, color: '#94a3b8', margin: '18px 0 0', wordBreak: 'break-word',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            Details for support: {describeErrorForSupport(error, error.digest)}
          </p>
        )}
      </div>
    </div>
  );
}

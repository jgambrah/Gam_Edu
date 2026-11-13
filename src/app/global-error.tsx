// src/app/global-error.tsx
'use client';

import { AppCrashScreen } from '@/components/app-crash-screen';

/**
 * Last-resort error screen: shown when the app's outer shell itself fails. It replaces the whole page, so it
 * renders its own <html> and <body>. See AppCrashScreen for the buttons and the automatic recovery.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>GAM Edu</title>
      </head>
      <body style={{ margin: 0 }}>
        <AppCrashScreen error={error} reset={reset} />
      </body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';

/**
 * PWARegister handles the registration of the browser service worker.
 * This enables PWA features like home screen installation and basic offline support.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Bypass service worker in development mode to prevent cached chunk loading timeouts
    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister().then(() => {
            console.log('Successfully unregistered stale service worker for development');
          });
        }
      });
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Check for service worker updates periodically and whenever the user switches back to the tab
        const checkForUpdates = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => {});
          }
        };

        document.addEventListener('visibilitychange', checkForUpdates);
        window.addEventListener('focus', checkForUpdates);

        // Immediate check on load
        registration.update().catch(() => {});

        // Listen for new service worker installation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // A new version has been deployed: tell it to activate immediately
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });

        // When a new service worker takes control, reload once so the user immediately runs the latest build
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            console.log('[PWA] New version activated, reloading with latest build...');
            window.location.reload();
          }
        });
      } catch (err) {
        console.log('ServiceWorker registration failed: ', err);
      }
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }
  }, []);

  return null;
}

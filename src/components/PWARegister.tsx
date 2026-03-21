'use client';

import { useEffect } from 'react';

/**
 * PWARegister handles the registration of the browser service worker.
 * This enables PWA features like home screen installation and basic offline support.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return null; // This component is functional only and does not render UI
}

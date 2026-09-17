importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBwTYgwwcHA5C1UdHGBvhyVoE_-sULCyHI", 
  authDomain: "gamedu-69888475-f5783.firebaseapp.com",
  projectId: "gamedu-69888475-f5783",
  storageBucket: "gamedu-69888475-f5783.firebasestorage.app",
  messagingSenderId: "667443968578",
  appId: "1:667443968578:web:bfddf34703726808e60bdb"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'GAM Edu';
  const notificationOptions = {
    body: payload.notification?.body || 'New Update Available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: payload.data
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// ============================================================================
// 2. PWA CACHING STRATEGY: Live-First, Never Cache Dashboard HTML
// ============================================================================

const CACHE_NAME = 'gam-edu-cache-v4';

// Immediately take over when a new service worker is installed
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Purge all old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Purging cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;
  if (event.request.url.includes('/_next/webpack-hmr')) return;
  if (event.request.url.includes('/api/')) return;

  // 1. Navigation requests (HTML documents) & Dashboard routes: ALWAYS fetch live from network!
  if (event.request.mode === 'navigate' || event.request.url.includes('/dashboard')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        return new Response('Offline or Network unavailable', { 
          status: 503, 
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' } 
        });
      })
    );
    return;
  }

  // 2. Static media assets (images, icons, fonts) - cache for performance
  const isStaticMedia = event.request.url.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/i);
  if (isStaticMedia) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Next.js script chunks and styles: Network first, never lock out new builds
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      return new Response('Resource unavailable offline', { status: 408 });
    })
  );
});

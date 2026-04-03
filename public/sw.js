// 1. Firebase Background Messaging
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// REPLACE "YOUR_API_KEY" with the raw string from your Firebase Console
firebase.initializeApp({
  apiKey: "YOUR_API_KEY", 
  authDomain: "nursery-bloom-825774943692.firebaseapp.com",
  projectId: "nursery-bloom-825774943692",
  storageBucket: "nursery-bloom-825774943692.appspot.com",
  messagingSenderId: "525105839",
  appId: "1:525105839:web:3555a75225f187513b8655"
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
// 2. NEW PWA CACHING STRATEGY: Network-First
// ============================================================================

const CACHE_NAME = 'gam-edu-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); 
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  if (!event.request.url.startsWith(self.location.origin)) return;
  if (event.request.url.includes('/_next/webpack-hmr')) return;

  // NETWORK FIRST STRATEGY
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

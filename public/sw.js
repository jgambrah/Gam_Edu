// 1. Import Firebase Scripts for the Background Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// 2. Initialize Firebase in the Worker
// PLEASE REPLACE THESE WITH YOUR ACTUAL config.ts VALUES
firebase.initializeApp({
  apiKey: AIzaSyBwTYgwwcHA5C1UdHGBvhyVoE_-sULCyHI,
  authDomain: gamedu-69888475-f5783.firebaseapp.com,
  projectId: gamedu-69888475-f5783,
  storageBucket: gamedu-69888475-f5783.firebasestorage.app,
  messagingSenderId: 667443968578,
  appId: 1:667443968578:web:bfddf34703726808e60bdb
});

const messaging = firebase.messaging();

// 3. Background Message Handler (When app is closed)
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'GAM Edu';
  const notificationOptions = {
    body: payload.notification?.body || 'New message received',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/dashboard';
  event.waitUntil(clients.openWindow(urlToOpen));
});

// --- CACHING LOGIC ---
const CACHE_NAME = 'gam-edu-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((name) => {
        if (name !== CACHE_NAME) return caches.delete(name);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
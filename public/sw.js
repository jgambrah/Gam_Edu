// 1. Import Firebase Scripts for the Background Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// 2. Initialize Firebase in the Worker 
// YOU MUST REPLACE THESE WITH YOUR ACTUAL config.ts VALUES
firebase.initializeApp({
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
});

const messaging = firebase.messaging();

// 3. Background Message Handler (When app is closed)
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'GAM Edu';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png', // Your app icon
    badge: '/icon-192x192.png', // Small icon for Android status bar
    data: payload.data // Pass URL to open when clicked
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. Notification Click Handler (When user taps the notification)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Open the URL sent in the data payload, or default to dashboard
  const urlToOpen = event.notification.data?.url || '/dashboard';
  event.waitUntil(clients.openWindow(urlToOpen));
});

// --- EXISTING CACHING LOGIC ---
const CACHE_NAME = 'gam-edu-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests (like Firebase API calls)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
      });
    })
  );
});
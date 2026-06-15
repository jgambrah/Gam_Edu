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


/*
* Service Worker for GAM Edu
* Handles background push notifications
*/

self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.notification.body,
        icon: '/icon-512x512.png',
        badge: '/icon-512x512.png',
        vibrate: [100, 50, 100],
        data: {
          url: data.data.url || '/dashboard'
        },
        actions: [
          { action: 'open', title: 'View Update' }
        ]
      };

      event.waitUntil(
        self.registration.showNotification(data.notification.title, options)
      );
    } catch (e) {
      console.error('Error handling push event:', e);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
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

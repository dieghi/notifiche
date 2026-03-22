/* Service worker Firebase pronto per la fase 2.
   Finche il VAPID key resta placeholder, l'app continua a funzionare in modalita mock-first. */

importScripts('https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBrXVsvF_8bNIAapn_Qeoy3PpXDQsJRgLU',
  authDomain: 'notifiche-fb2d2.firebaseapp.com',
  projectId: 'notifiche-fb2d2',
  storageBucket: 'notifiche-fb2d2.firebasestorage.app',
  messagingSenderId: '286912767730',
  appId: '1:286912767730:web:cd34c27890a2c1fdc5126b',
  measurementId: 'G-R0G4CGXTWZ'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Nuova notifica';
  const options = {
    body: payload.notification?.body,
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const channelCode = event.notification.data?.channelCode;
  const scopeUrl = self.registration.scope.endsWith('/')
    ? self.registration.scope
    : `${self.registration.scope}/`;
  const targetUrl = channelCode ? `${scopeUrl}#/channels/${channelCode}` : `${scopeUrl}#/home`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return undefined;
    })
  );
});

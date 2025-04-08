// Firebase service worker for handling background notifications
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js');

// Firebase configuration
firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const { title, body } = payload.notification || {};
  
  if (title && body) {
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: payload.data
    });
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const { data } = event.notification;
  
  if (data && data.type === 'negotiation_request' && data.booking_id) {
    // Open the booking details page
    event.waitUntil(
      clients.openWindow(`/admin/bookings/negotiated/${data.booking_id}`)
    );
  } else if (data && data.type === 'negotiation_update' && data.booking_id) {
    // Open the booking details page
    event.waitUntil(
      clients.openWindow(`/user/bookings/${data.booking_id}`)
    );
  }
}); 
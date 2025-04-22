// Firebase service worker for handling background notifications
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js');

// Firebase configuration from environment
firebase.initializeApp({
  apiKey: "AIzaSyAGVJJdwXlwxGNd_hOFj6yTSQFqTdxLkdM",
  authDomain: "dejair-booking.firebaseapp.com",
  projectId: "dejair-booking",
  storageBucket: "dejair-booking.appspot.com",
  messagingSenderId: "186331542288",
  appId: "1:186331542288:web:c5c7b5d9f5c5c5d5c5c5c5"
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
  
  if (data && data.type === 'chat_message' && data.booking_id) {
    // For chat messages, determine the role and open chat
    const role = data.role || 'user';
    event.waitUntil(
      clients.openWindow(`/${role}/bookings/${data.booking_id}/chat`)
    );
  } else if (data && data.type === 'negotiation_request' && data.booking_id) {
    // Open the booking details page for negotiation
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
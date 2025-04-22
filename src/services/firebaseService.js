// Firebase service for DejAir helicopter booking system
// Handles Firebase Cloud Messaging (FCM) for notifications

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import authService from './authService';
import firebaseConfig from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.error('Error initializing Firebase messaging:', error);
}

const API_URL = import.meta.env.VITE_API_URL 

const firebaseService = {
  // Initialize notifications
  async setupNotifications() {
    try {
      // Request permission and get token
      const token = await this.requestPermissionAndGetToken();
      
      if (!token) {
        console.warn('Failed to get FCM token');
        return false;
      }
      
      // Set up message handler for notifications
      this.setupMessageHandler();
      
      return true;
    } catch (error) {
      console.error('Error setting up notifications:', error);
      return false;
    }
  },
  // Request permission and get FCM token
  async requestPermissionAndGetToken() {
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      
      // Save token to backend
      await this.saveTokenToBackend(token);
      
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },
  
  // Save FCM token to backend
  async saveTokenToBackend(token) {
    try {
      const response = await fetch(`${API_URL}/fcm-token`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save FCM token');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving FCM token:', error);
      return false;
    }
  },
  
  // Refresh FCM token if needed
  async refreshTokenIfNeeded() {
    try {
      // Get current token
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      // Save to backend
      await this.saveTokenToBackend(currentToken);
      
      return currentToken;
    } catch (error) {
      console.error('Error refreshing FCM token:', error);
      return null;
    }
  },
  
  // Send notification through backend
  async sendNotification(notificationData) {
    try {
      await this.refreshTokenIfNeeded();

      let body;
      // If admin is responding to negotiation
      if (notificationData.data.negotiation_action) {
        body = JSON.stringify({
          negotiation_action: notificationData.data.negotiation_action,
          final_amount: notificationData.data.final_amount,
          notes: notificationData.data.notes
        });
      } else {
        // Client negotiation request
        body = JSON.stringify({
          negotiation_request: true,
          negotiated_amount: parseFloat(notificationData.data.negotiated_amount),
          notes: notificationData.data.notes
        });
      }

      const response = await fetch(`${API_URL}/booking/${notificationData.booking_id}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send notification');
      }

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },
  
  // Set up message handler
  setupMessageHandler(callback) {
    onMessage(messaging, (payload) => {
      
      // Call the callback with the notification data
      if (callback && typeof callback === 'function') {
        callback(payload);
      }
      
      // Show notification if in browser
      if (Notification.permission === 'granted') {
        const { title, body } = payload.notification || {};
        const { type, booking_id } = payload.data || {};
        
        // Create notification options
        const options = {
          body,
          icon: '/favicon.ico',
          data: { booking_id, type },
          requireInteraction: true, // Keep notification until user interacts
          badge: '/favicon.ico'
        };
        
        // Show the notification using service worker if available
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, options);
            
            // Handle notification click in service worker
            navigator.serviceWorker.addEventListener('notificationclick', event => {
              event.notification.close();
              if (type === 'chat_message' && booking_id) {
                const role = authService.isAdmin() ? 'admin' : 'user';
                const chatUrl = `/${role}/bookings/${booking_id}/chat`;
                // Focus on existing chat tab if open
                event.waitUntil(
                  clients.matchAll({ type: 'window' }).then(windowClients => {
                    for (let client of windowClients) {
                      if (client.url.includes(chatUrl)) {
                        return client.focus();
                      }
                    }
                    // Open new window if none exists
                    return clients.openWindow(chatUrl);
                  })
                );
              }
            });
          });
        } else {
          // Fallback to basic notification if service worker not available
          const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            requireInteraction: true
          });
          
          notification.onclick = () => {
            if (type === 'chat_message' && booking_id) {
              const role = authService.isAdmin() ? 'admin' : 'user';
              window.location.href = `/${role}/bookings/${booking_id}/chat`;
            }
            notification.close();
          };
        }
      }
    });
  },
  
  // Handle negotiation notifications
  handleNegotiationNotification(payload, navigate) {
    const { data } = payload;
    
    if (data && data.type === 'negotiation_request') {
      // Navigate to the booking details page
      if (navigate && data.booking_id) {
        navigate(`/admin/bookings/negotiated/${data.booking_id}`);
      }
    } else if (data && data.type === 'negotiation_update') {
      // Navigate to the booking details page
      if (navigate && data.booking_id) {
        navigate(`/user/bookings/${data.booking_id}`);
      }
    }
  }
};

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      return token;
    }
    throw new Error('Notification permission denied');
  } catch (error) {
    console.error('Error getting notification permission:', error);
    throw error;
  }
};

// Handle foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

// Update FCM token in backend
export const updateFCMToken = async (userId, token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/fcm-token`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ fcm_token: token })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update FCM token');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating FCM token:', error);
    throw error;
  }
};

export default firebaseService;
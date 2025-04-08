// Firebase service for DejAir helicopter booking system
// Handles Firebase Cloud Messaging (FCM) for notifications

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import authService from './authService';
import firebaseConfig from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const API_URL = import.meta.env.VITE_API_URL 

const firebaseService = {
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
      
      console.log('FCM Token:', token);
      
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
      
      if (!response.ok) {
        const data = await response.json();
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
      // First refresh token to ensure it's valid
      await this.refreshTokenIfNeeded();
      
      const response = await fetch(`${API_URL}/booking/${notificationData.booking_id}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiation_request: true,
          negotiated_amount: parseFloat(notificationData.data.negotiated_amount),
          notes: notificationData.data.notes
        }),
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
      console.log('Message received:', payload);
      
      // Call the callback with the notification data
      if (callback && typeof callback === 'function') {
        callback(payload);
      }
      
      // Show notification if in browser
      if (Notification.permission === 'granted') {
        const { title, body } = payload.notification || {};
        
        if (title && body) {
          new Notification(title, {
            body,
            icon: '/favicon.ico'
          });
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
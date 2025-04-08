import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
      return token;
    } else {
      throw new Error('Notification permission denied');
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    throw error;
  }
};

// Register FCM token with the backend
const registerFCMToken = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/api/notifications/register`, { token });
    return response.data;
  } catch (error) {
    console.error('Error registering FCM token:', error);
    throw error;
  }
};

// Unregister FCM token from the backend
const unregisterFCMToken = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/api/notifications/unregister`, { token });
    return response.data;
  } catch (error) {
    console.error('Error unregistering FCM token:', error);
    throw error;
  }
};

// Subscribe to a topic
const subscribeToTopic = async (topic) => {
  try {
    const token = await requestPermissionAndGetToken();
    const response = await axios.post(`${API_URL}/api/notifications/subscribe`, { token, topic });
    return response.data;
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    throw error;
  }
};

// Unsubscribe from a topic
const unsubscribeFromTopic = async (topic) => {
  try {
    const token = await requestPermissionAndGetToken();
    const response = await axios.post(`${API_URL}/api/notifications/unsubscribe`, { token, topic });
    return response.data;
  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    throw error;
  }
};

// Set up message listener
const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export const notificationService = {
  requestPermissionAndGetToken,
  registerFCMToken,
  unregisterFCMToken,
  subscribeToTopic,
  unsubscribeFromTopic,
  onMessageListener
}; 
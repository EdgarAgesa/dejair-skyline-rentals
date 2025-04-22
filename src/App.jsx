import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentConfirmation from './pages/PaymentConfirmation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import firebaseService from './services/firebaseService';
import authService from './services/authService';

const App = () => {
  useEffect(() => {
    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
      });
    } else {
      console.warn('Service Worker not supported');
    }
    // Set up notifications when the app starts if user is logged in
    const setupNotifications = async () => {
      if (authService.isLoggedIn()) {
        try {
          await firebaseService.setupNotifications();
        } catch (error) {
          console.warn('Could not set up notifications:', error);
        }
      }
    };

    setupNotifications();

    // Listen for storage events (login/logout)
    const handleStorageChange = () => {
      setupNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <Routes>
      <Route path="/payment-confirmation/:bookingId" element={<PaymentConfirmation />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
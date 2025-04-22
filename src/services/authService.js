// Authentication service for DejAir helicopter booking system
// Handles user authentication and token management

import firebaseService from './firebaseService';


const API_URL = import.meta.env.VITE_API_URL

const authService = {
  // Register a new client
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      if (data.access_token) {
        localStorage.setItem('user', JSON.stringify({
          token: data.access_token,
          role: 'user'
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login as client
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-cache',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.access_token) {
        const userData = {
          token: data.access_token,
          role: 'user',
          client_id: data.client_id,
          name: data.name,
          email: data.email
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set up notifications
        try {
          await firebaseService.setupNotifications();
        } catch (error) {
          console.warn('Could not enable notifications:', error);
        }
        
        // Verify token is stored
        const storedData = localStorage.getItem('user');
        
        // Dispatch storage event
        window.dispatchEvent(new Event('storage'));
      } else {
        console.error('No access token in response');
        throw new Error('No access token received');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Login as admin
  async adminLogin(email, password) {
    try {
      // Use more efficient fetch options
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        // Add cache control headers to prevent caching
        cache: 'no-cache',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }
      
      // Store user info with correct admin role
      if (data.access_token) {
        const userInfo = {
          token: data.access_token,
          role: data.is_superadmin ? 'superadmin' : 'admin',
          adminId: data.admin_id
        };
        
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        // Set up notifications and subscribe to admin notifications
        try {
          const success = await firebaseService.setupNotifications();
          if (success) {
            // Get the current FCM token
            const fcmToken = await firebaseService.refreshTokenIfNeeded();
            if (fcmToken) {
              await fetch(`${API_URL}/fcm-token`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${data.access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  token: fcmToken,
                  topic: 'admin_notifications'
                }),
              });
            }
          }
        } catch (error) {
          console.warn('Could not enable notifications:', error);
        }
        
        // Dispatch a storage event to notify other components of the login
        window.dispatchEvent(new Event('storage'));
      }
      
      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },
  
  // Logout user
  async logout() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      try {
        // Tell backend to invalidate the token
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Always clear local storage and notify components
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
      }
    } else {
      // If no user/token, just clear storage
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('storage'));
    }
  },
  
  // Get current user data
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  // Check if user is logged in
  isLoggedIn() {
    const user = this.getCurrentUser();
    return !!user;
  },
  
  // Check if user is admin or superadmin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'superadmin');
  },
  
  // Check if user is superadmin
  isSuperAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'superadmin';
  },
  
  // Get auth header for API requests
  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      // Log token for debugging
      return { 'Authorization': `Bearer ${user.token}` };
    } else {
      console.warn('No token found in localStorage');
      // If no token, force logout to clean up
      this.logout();
      return {};
    }
  }
};

export default authService;

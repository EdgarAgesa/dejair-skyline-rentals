
// Authentication service for DejAir booking system
// Handles API calls to the backend auth endpoints

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
      
      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
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
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
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
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }
      
      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout() {
    localStorage.removeItem('user');
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
  
  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'superadmin');
  },
  
  // Get auth header
  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return {};
    }
  }
};

export default authService;

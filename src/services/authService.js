// Authentication service for DejAir booking system
// Handles API calls to the backend auth endpoints

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
      // Use more efficient fetch options
      const response = await fetch(`${API_URL}/auth/login`, {
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
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.access_token) {
        localStorage.setItem('user', JSON.stringify({
          token: data.access_token,
          role: 'user'
        }));
        
        // Dispatch storage event immediately
        window.dispatchEvent(new Event('storage'));
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
        
        // Subscribe to admin notifications topic
        if (data.fcm_token) {
          try {
            await fetch(`${API_URL}/fcm-token`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${data.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                token: data.fcm_token,
                topic: 'admin_notifications'
              }),
            });
          } catch (error) {
            console.error('Error subscribing to admin notifications:', error);
          }
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
  logout() {
    localStorage.removeItem('user');
    // Dispatch a storage event to notify other components of the logout
    window.dispatchEvent(new Event('storage'));
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
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return {};
    }
  }
};

export default authService;


// Chat service for DejAir helicopter booking system
// Handles API calls to the backend chat endpoints

import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'https://heli-91dn.onrender.com';

const chatService = {
  // Get chat messages for a booking
  async getChatMessages(bookingId) {
    try {
      const response = await fetch(`${API_URL}/booking/${bookingId}/chat`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // Ensure fresh data
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch chat messages');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  },
  
  // Send a chat message
  async sendChatMessage(bookingId, message) {
    try {
      const response = await fetch(`${API_URL}/booking/${bookingId}/chat`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }
      
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Mark messages as read
  async markMessagesAsRead(bookingId) {
    try {
      const response = await fetch(`${API_URL}/booking/${bookingId}/chat/read`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark messages as read');
      }
      
      return data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },
  
  // Get unread message count
  async getUnreadMessageCount() {
    try {
      const response = await fetch(`${API_URL}/chat/unread`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // Ensure fresh data
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch unread count');
      }
      
      return data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
};

export default chatService;

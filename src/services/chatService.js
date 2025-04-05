
// Chat service for DejAir helicopter booking system
// Handles API calls to the backend chat endpoints

import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  
  // Get negotiation chats
  async getNegotiationChats() {
    try {
      const response = await fetch(`${API_URL}/negotiation-chats`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch negotiation chats');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching negotiation chats:', error);
      throw error;
    }
  }
};

export default chatService;


// Booking service for DejAir helicopter booking system
// Handles API calls to the backend booking endpoints

import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const bookingService = {
  // Get client's bookings
  async getClientBookings() {
    try {
      const response = await fetch(`${API_URL}/booking`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },
  
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  // Update a booking
  async updateBooking(id, bookingData) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },
  
  // Get a specific booking
  async getBooking(id) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },
  
  // Get negotiation history for a booking
  async getNegotiationHistory(id) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}/negotiation-history`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch negotiation history');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching negotiation history:', error);
      throw error;
    }
  },
  
  // Request price negotiation
  async requestNegotiation(id, negotiationData) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiation_request: true,
          negotiated_amount: negotiationData.negotiatedAmount,
          notes: negotiationData.notes
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to request negotiation');
      }
      
      return data;
    } catch (error) {
      console.error('Error requesting negotiation:', error);
      throw error;
    }
  },
  
  // Process direct payment
  async processDirectPayment(id, paymentData) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment: true,
          phone_number: paymentData.phoneNumber
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process payment');
      }
      
      return data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },
  
  // Process negotiated payment
  async processNegotiatedPayment(id, paymentData) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}/pay-negotiated`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: paymentData.phoneNumber
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process payment');
      }
      
      return data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },
  
  // Admin: Get negotiated bookings
  async getAdminNegotiatedBookings() {
    try {
      const response = await fetch(`${API_URL}/admin/bookings/negotiated`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch negotiated bookings');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching negotiated bookings:', error);
      throw error;
    }
  },
  
  // Admin: Get incomplete bookings
  async getAdminIncompleteBookings() {
    try {
      const response = await fetch(`${API_URL}/admin/bookings/incomplete`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch incomplete bookings');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching incomplete bookings:', error);
      throw error;
    }
  },
  
  // Admin: Get completed bookings
  async getAdminCompletedBookings() {
    try {
      const response = await fetch(`${API_URL}/admin/bookings/completed`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch completed bookings');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
      throw error;
    }
  },
  
  // Admin: Handle negotiation (accept/reject/counter)
  async handleNegotiation(id, negotiationData) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negotiation_action: negotiationData.action,
          final_amount: negotiationData.finalAmount,
          notes: negotiationData.notes
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to handle negotiation');
      }
      
      return data;
    } catch (error) {
      console.error('Error handling negotiation:', error);
      throw error;
    }
  }
};

export default bookingService;

// Booking service for DejAir helicopter booking system
// Handles API calls to the backend booking endpoints

import authService from './authService';
// import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 

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
  
  // Update booking status to pending_payment before processing payment
  async updateBookingStatusForPayment(id) {
    try {
      // First get the current booking status
      const booking = await this.getBooking(id);
      
      // If already in pending_payment status, no need to update
      if (booking.status === 'pending_payment') {
        console.log(`Booking ${id} is already in pending_payment status`);
        return { message: 'Booking already in pending_payment status', booking };
      }
      
      console.log(`Updating booking ${id} status to pending_payment`);
      
      const response = await fetch(`${API_URL}/booking/${id}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'pending_payment'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking status');
      }
      
      console.log('Booking status updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
  
  // Process direct payment
  async processDirectPayment(id, paymentData) {
    const MAX_RETRIES = 2;
    let retryCount = 0;
    
    // First, try to update the booking status to pending_payment
    try {
      await this.updateBookingStatusForPayment(id);
    } catch (statusError) {
      console.warn('Could not update booking status, will try payment anyway:', statusError);
      // Continue with payment attempt even if status update fails
    }
    
    while (retryCount <= MAX_RETRIES) {
      try {
        console.log(`Attempting to process direct payment for booking ${id} with phone number ${paymentData.phoneNumber} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
        
        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout (increased from 30)
        
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
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`Payment response status: ${response.status}`);
        
        // Try to parse the response as JSON, but handle non-JSON responses
        let data;
        try {
          data = await response.json();
          console.log('Payment response data:', data);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error(`Server returned invalid JSON: ${await response.text()}`);
        }
        
        if (!response.ok) {
          console.error('Payment failed with status:', response.status, 'Data:', data);
          
          // If it's a server error (500), retry
          if (response.status >= 500 && retryCount < MAX_RETRIES) {
            console.log(`Server error, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
            retryCount++;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            continue;
          }
          
          // Provide more specific error messages based on the status code
          if (response.status === 400) {
            throw new Error(data.message || 'Invalid payment request. Please check your phone number and try again.');
          } else if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          } else if (response.status === 404) {
            throw new Error('Booking not found. Please refresh the page and try again.');
          } else {
            throw new Error(data.message || `Payment failed with status ${response.status}`);
          }
        }
        
        console.log('Payment processed successfully:', data);
        return data;
      } catch (error) {
        console.error('Error processing payment:', error);
        
        // If it's a timeout error and we haven't exceeded retries, retry
        if (error.name === 'AbortError' && retryCount < MAX_RETRIES) {
          console.log(`Request timed out, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          retryCount++;
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          continue;
        }
        
        // Provide more specific error messages based on the error type
        if (error.name === 'AbortError') {
          throw new Error('Payment request timed out. Please try again later.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Could not connect to the payment server. Please check your internet connection and try again.');
        } else {
          throw error;
        }
      }
    }
    
    // If we've exhausted all retries, throw a generic error
    throw new Error('Payment processing failed after multiple attempts. Please try again later or contact support.');
  },
  
  // Process negotiated payment
  async processNegotiatedPayment(id, paymentData) {
    const MAX_RETRIES = 2;
    let retryCount = 0;
    
    while (retryCount <= MAX_RETRIES) {
      try {
        console.log(`Attempting to process negotiated payment for booking ${id} with phone number ${paymentData.phoneNumber} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
        
        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout (increased from 30)
        
        const response = await fetch(`${API_URL}/booking/${id}/pay-negotiated`, {
          method: 'POST',
          headers: {
            ...authService.getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: paymentData.phoneNumber
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`Payment response status: ${response.status}`);
        
        // Try to parse the response as JSON, but handle non-JSON responses
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error(`Server returned invalid JSON: ${await response.text()}`);
        }
        
        if (!response.ok) {
          console.error('Payment failed with status:', response.status, 'Data:', data);
          
          // If it's a server error (500), retry
          if (response.status >= 500 && retryCount < MAX_RETRIES) {
            console.log(`Server error, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
            retryCount++;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            continue;
          }
          
          throw new Error(data.message || `Payment failed with status ${response.status}`);
        }
        
        console.log('Payment processed successfully:', data);
        return data;
      } catch (error) {
        console.error('Error processing payment:', error);
        
        // If it's a timeout error and we haven't exceeded retries, retry
        if (error.name === 'AbortError' && retryCount < MAX_RETRIES) {
          console.log(`Request timed out, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          retryCount++;
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          continue;
        }
        
        // Provide more specific error messages based on the error type
        if (error.name === 'AbortError') {
          throw new Error('Payment request timed out. Please try again later.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Could not connect to the payment server. Please check your internet connection and try again.');
        } else {
          throw error;
        }
      }
    }
    
    // If we've exhausted all retries, throw a generic error
    throw new Error('Payment processing failed after multiple attempts. Please try again later or contact support.');
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
  },
  
  // Get booking status
  async getBookingStatus(id) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}/status`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking status');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching booking status:', error);
      throw error;
    }
  },
  
  // Admin: Get negotiation history
  async getNegotiationHistory(id) {
    try {
      const response = await fetch(`${API_URL}/booking/${id}/negotiations`, {
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
  
  // Admin: Request negotiation
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
  }
};

export default bookingService;

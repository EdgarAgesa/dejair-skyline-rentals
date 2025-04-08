// Helicopter service for DejAir helicopter booking system
// Handles API calls to the backend helicopter endpoints

import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL 

const helicopterService = {
  // Get all helicopters
  async getAllHelicopters() {
    try {
      const response = await fetch(`${API_URL}/helicopter`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch helicopters');
      }
      
      // Transform the data to match the expected format in the frontend
      return data.map(helicopter => ({
        id: helicopter.id,
        model: helicopter.model,
        capacity: helicopter.capacity,
        image_url: helicopter.image_url || 'https://images.unsplash.com/photo-1608236467814-a74be259b612?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80',
        // Additional fields for the public view
        name: helicopter.model,
        shortDescription: `Luxury ${helicopter.model} helicopter with premium comfort`,
        description: `The ${helicopter.model} is a premium helicopter offering exceptional comfort and performance for your aerial journey.`,
        speed: "140 knots",
        range: "330 nautical miles",
        hourlyRate: 1500,
        features: ["Leather interior", "Air conditioning", "Noise cancellation", "Panoramic windows", "Entertainment system"],
        tours: [
          { id: 101, name: "Grand Canyon Explorer", duration: 3, price: 3500 },
          { id: 102, name: "City Skyline Tour", duration: 1, price: 1800 },
          { id: 103, name: "Mountain Adventure", duration: 2, price: 2600 }
        ],
        availability: "High"
      }));
    } catch (error) {
      console.error('Error fetching helicopters:', error);
      throw error;
    }
  },
  
  // Get a specific helicopter by ID
  async getHelicopterById(id) {
    try {
      const response = await fetch(`${API_URL}/helicopter/${id}`, {
        method: 'GET',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch helicopter');
      }
      
      // Transform the data to match the expected format in the frontend
      return {
        id: data.id,
        name: data.model,
        image: data.image_url || 'https://images.unsplash.com/photo-1608236467814-a74be259b612?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80',
        shortDescription: `Luxury ${data.model} helicopter with premium comfort`,
        description: `The ${data.model} is a premium helicopter offering exceptional comfort and performance for your aerial journey.`,
        capacity: data.capacity,
        speed: "140 knots", // Default values for these fields
        range: "330 nautical miles",
        hourlyRate: 1500, // Default hourly rate
        features: ["Leather interior", "Air conditioning", "Noise cancellation", "Panoramic windows", "Entertainment system"],
        tours: [
          { id: 101, name: "Grand Canyon Explorer", duration: 3, price: 3500 },
          { id: 102, name: "City Skyline Tour", duration: 1, price: 1800 },
          { id: 103, name: "Mountain Adventure", duration: 2, price: 2600 }
        ],
        availability: "High" // Default availability
      };
    } catch (error) {
      console.error('Error fetching helicopter:', error);
      throw error;
    }
  },
  
  // Admin: Add a new helicopter
  async addHelicopter(helicopterData) {
    try {
      const response = await fetch(`${API_URL}/helicopter`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: helicopterData.model,
          capacity: helicopterData.capacity,
          image_url: helicopterData.image_url
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add helicopter');
      }
      
      return data;
    } catch (error) {
      console.error('Error adding helicopter:', error);
      throw error;
    }
  },
  
  // Admin: Update a helicopter
  async updateHelicopter(id, helicopterData) {
    try {
      const response = await fetch(`${API_URL}/helicopter/${id}`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: helicopterData.model,
          capacity: helicopterData.capacity,
          image_url: helicopterData.image_url
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update helicopter');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating helicopter:', error);
      throw error;
    }
  },
  
  // Admin: Delete a helicopter
  async deleteHelicopter(id) {
    try {
      const response = await fetch(`${API_URL}/helicopter/${id}`, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete helicopter');
      }
      
      return { success: true, message: 'Helicopter deleted successfully' };
    } catch (error) {
      console.error('Error deleting helicopter:', error);
      throw error;
    }
  }
};

export default helicopterService; 
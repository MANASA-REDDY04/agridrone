import api from './api';

const operatorService = {
  // Get available service requests
  getAvailableRequests: async () => {
    try {
      const response = await api.get('/operators/service-requests/available');
      return response.data.service_requests;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Get assigned service requests
  getAssignedRequests: async () => {
    try {
      const response = await api.get('/operators/service-requests');
      return response.data.service_requests;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Accept a service request
  acceptRequest: async (requestId) => {
    try {
      const response = await api.post(`/operators/service-requests/${requestId}/accept`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Complete a service request
  completeRequest: async (requestId) => {
    try {
      const response = await api.post(`/operators/service-requests/${requestId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Get details of a specific service request
  getServiceRequest: async (requestId) => {
    try {
      const response = await api.get(`/operators/service-requests/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Update availability calendar
  updateAvailability: async (availabilityData) => {
    try {
      const response = await api.post('/operators/availability', availabilityData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Update operator's location and availability
  updateLocation: async (locationData) => {
    try {
      const response = await api.post('/operators/update-location', locationData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  }
};

export default operatorService;

import api from './api';

const farmerService = {
  // Get all fields for the current farmer
  getFields: async () => {
    try {
      const response = await api.get('/farmers/fields');
      return response.data.fields;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Get a specific field
  getField: async (fieldId) => {
    try {
      const response = await api.get(`/farmers/fields/${fieldId}`);
      return response.data.field;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Create a new field
  createField: async (fieldData) => {
    try {
      const response = await api.post('/farmers/fields', fieldData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Update a field
  updateField: async (fieldId, fieldData) => {
    try {
      const response = await api.put(`/farmers/fields/${fieldId}`, fieldData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Delete a field
  deleteField: async (fieldId) => {
    try {
      const response = await api.delete(`/farmers/fields/${fieldId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Get all service requests for the current farmer
  getServiceRequests: async () => {
    try {
      const response = await api.get('/farmers/service-requests');
      return response.data.service_requests;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Get a specific service request
  getServiceRequest: async (requestId) => {
    try {
      const response = await api.get(`/farmers/service-requests/${requestId}`);
      return response.data.service_request;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Create a new service request
  createServiceRequest: async (requestData) => {
    try {
      const response = await api.post('/farmers/service-requests', requestData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Update a service request
  updateServiceRequest: async (requestId, requestData) => {
    try {
      const response = await api.put(`/farmers/service-requests/${requestId}`, requestData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Cancel a service request
  cancelServiceRequest: async (requestId) => {
    try {
      const response = await api.delete(`/farmers/service-requests/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Find nearby drone operators
  findNearbyOperators: async () => {
    try {
      const response = await api.get('/farmers/nearby-operators');
      return response.data.operators;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  },

  // Get nearby operators based on location
  getNearbyOperators: async (latitude, longitude, radius) => {
    try {
      const response = await api.get('/farmers/nearby-operators', {
        params: { latitude, longitude, radius }
      });
      // Ensure we're returning the operators array, not the whole response data
      return response.data.operators || [];
    } catch (error) {
      console.error('Error in getNearbyOperators:', error);
      // Return an empty array on error to prevent map errors
      return [];
    }
  },
  
  // Get operator details by ID
  getOperatorById: async (operatorId) => {
    try {
      const response = await api.get(`/farmers/operators/${operatorId}`);
      return response.data.operator;
    } catch (error) {
      throw error.response ? error.response.data : { error: 'Network error' };
    }
  }
};

export default farmerService;

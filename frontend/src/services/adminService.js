import api from './api';

// Admin service for handling API calls related to admin functionalities

// Get all users
const getUsers = async (role) => {
  try {
    const params = role ? { role } : {};
    const response = await api.get('/admin/users', { params });
    return response.data.users;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch users' };
  }
};

// Get a specific user
const getUser = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch user' };
  }
};

// Create a new user
const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create user' };
  }
};

// Update an existing user
const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update user' };
  }
};

// Delete a user
const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete user' };
  }
};

// Get all service requests
const getServiceRequests = async (status) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/admin/service-requests', { params });
    return response.data.service_requests;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch service requests' };
  }
};

// Get a specific service request
const getServiceRequest = async (requestId) => {
  try {
    const response = await api.get(`/admin/service-requests/${requestId}`);
    return response.data.service_request;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch service request' };
  }
};

// Assign an operator to a service request
const assignOperatorToRequest = async (requestId, operatorId) => {
  try {
    const response = await api.put(`/admin/service-requests/${requestId}/assign`, { operator_id: operatorId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to assign operator to request' };
  }
};

// Cancel a service request
const cancelServiceRequest = async (requestId) => {
  try {
    const response = await api.put(`/admin/service-requests/${requestId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to cancel service request' };
  }
};

// Update a service request
const updateServiceRequest = async (requestId, requestData) => {
  try {
    const response = await api.put(`/admin/service-requests/${requestId}`, requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update service request' };
  }
};

// Get all operators
const getOperators = async () => {
  try {
    const response = await api.get('/admin/operators');
    return response.data.operators || [];
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch operators' };
  }
};

// Get dashboard statistics
const getStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch stats' };
  }
};

const adminService = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getServiceRequests,
  getServiceRequest,
  assignOperatorToRequest,
  cancelServiceRequest,
  updateServiceRequest,
  getOperators,
  getStats
};

export default adminService;

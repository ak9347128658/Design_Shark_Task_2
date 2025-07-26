import api from './api';
import { isDemoMode, mockApiResponses } from './mockData';

export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      if (isDemoMode) {
        return mockApiResponses.getAllUsers();
      }

      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      if (isDemoMode) {
        const users = mockApiResponses.getAllUsers();
        const user = users.find(u => u._id === id);
        if (!user) throw new Error('User not found');
        return user;
      }

      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    try {
      if (isDemoMode) {
        return mockApiResponses.createUser(userData);
      }

      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      if (isDemoMode) {
        return mockApiResponses.updateUser(id, userData);
      }

      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    try {
      if (isDemoMode) {
        return mockApiResponses.deleteUser(id);
      }

      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};


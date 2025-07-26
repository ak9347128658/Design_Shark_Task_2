import api from './api';
import Cookies from 'js-cookie';
import { isDemoMode, mockApiResponses } from './mockData';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      if (isDemoMode) {
        const response = mockApiResponses.login(email, password);
        const { token, user } = response;
        
        // Store token in cookie
        Cookies.set('token', token, { expires: 30 }); // 30 days
        
        return { token, user };
      }

      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 30 }); // 30 days
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register user
  register: async (name, email, password) => {
    try {
      if (isDemoMode) {
        const response = mockApiResponses.register(name, email, password);
        const { token, user } = response;
        
        // Store token in cookie
        Cookies.set('token', token, { expires: 30 });
        
        return { token, user };
      }

      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 30 });
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      if (isDemoMode) {
        const token = Cookies.get('token');
        if (!token) throw new Error('No token found');
        return mockApiResponses.getCurrentUser(token);
      }

      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout user
  logout: () => {
    Cookies.remove('token');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!Cookies.get('token');
  },

  // Get token
  getToken: () => {
    return Cookies.get('token');
  }
};


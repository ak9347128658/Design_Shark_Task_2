import api from './api';
import Cookies from 'js-cookie';
import { isDemoMode, mockApiResponses } from './mockData';
import { AuthUser, LoginCredentials, RegisterCredentials } from '../types';

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      if (isDemoMode) {
        const response = mockApiResponses.login(credentials.email, credentials.password);
        const { token, user } = response;
        
        // Store token in cookie
        Cookies.set('token', token, { expires: 30 }); // 30 days
        
        return { token, user };
      }

      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 30 }); // 30 days
      
      return { token, user };
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Register user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      if (isDemoMode) {
        const response = mockApiResponses.register(
          credentials.username, 
          credentials.email, 
          credentials.password
        );
        const { token, user } = response;
        
        // Store token in cookie
        Cookies.set('token', token, { expires: 30 });
        
        return { token, user };
      }

      const response = await api.post<AuthResponse>('/auth/register', credentials);
      const { token, user } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 30 });
      
      return { token, user };
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthUser> => {
    try {
      if (isDemoMode) {
        const token = Cookies.get('token');
        if (!token) throw new Error('No token found');
        return mockApiResponses.getCurrentUser(token);
      }

      const response = await api.get<AuthUser>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // Logout user
  logout: (): void => {
    Cookies.remove('token');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!Cookies.get('token');
  },

  // Get token
  getToken: (): string | undefined => {
    return Cookies.get('token');
  }
};

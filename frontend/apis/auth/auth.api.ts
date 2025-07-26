import axiosInstance from '../axiosInstance';
import { LoginInputs, RegisterInputs, AuthResponse } from './auth.types';

export const login = async (data: LoginInputs): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterInputs): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

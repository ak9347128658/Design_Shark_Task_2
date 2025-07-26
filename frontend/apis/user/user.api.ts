import axiosInstance from '../axiosInstance';
import { 
  PaginationParams, 
  UpdateUserInputs, 
  UsersResponse, 
  UserResponse, 
  UserUpdateResponse, 
  UserDeleteResponse 
} from './user.types';

export const getUsers = async (params?: PaginationParams): Promise<UsersResponse> => {
  const response = await axiosInstance.get('/users', { params });
  return response.data;
};

export const getUser = async (userId: string): Promise<UserResponse> => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId: string, data: UpdateUserInputs): Promise<UserUpdateResponse> => {
  const response = await axiosInstance.put(`/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<UserDeleteResponse> => {
  const response = await axiosInstance.delete(`/users/${userId}`);
  return response.data;
};

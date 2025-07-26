import { z } from 'zod';
import { UserSchema } from '../auth/auth.types';

export type User = z.infer<typeof UserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export type UpdateUserInputs = z.infer<typeof UpdateUserSchema>;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  pagination: PaginationMeta;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UserUpdateResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UserDeleteResponse {
  success: boolean;
  message: string;
}

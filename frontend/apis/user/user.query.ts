import { useQuery } from '@tanstack/react-query';
import { getUsers, getUser } from './user.api';
import { PaginationParams } from './user.types';

export const useUsersQuery = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });
};

export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};

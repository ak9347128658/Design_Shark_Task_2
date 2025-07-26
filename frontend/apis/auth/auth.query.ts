import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from './auth.api';

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser(),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  });
};

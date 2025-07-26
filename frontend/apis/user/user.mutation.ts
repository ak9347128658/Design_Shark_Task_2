import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, deleteUser } from './user.api';
import { UpdateUserInputs } from './user.types';

export const useUpdateUserMutation = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserInputs) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

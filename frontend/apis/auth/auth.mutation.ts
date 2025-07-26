import { useMutation } from '@tanstack/react-query';
import { login, register } from './auth.api';
import { LoginInputs, RegisterInputs } from './auth.types';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginInputs) => login(data),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterInputs) => register(data),
  });
};

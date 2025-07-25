// @/apis/class/class.mutation.ts
import { useMutation } from '@tanstack/react-query';
import { createClass, updateClass, deleteClass } from './class.api';
import { ClassPayload, ClassResponse, UpdateClassResponse, DeleteClassResponse } from './class.types';
import { queryClient } from '@/providers/query-provider';

export const useCreateClassMutation = () => {

  return useMutation<ClassResponse, Error, ClassPayload>({
    mutationFn: createClass,
    mutationKey: ['createClass'],
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['classes', 'schoolStats', data.data?.schoolId] });
      }
    },
    onError: (error) => {
      console.error('Class creation error:', error);
    },
  });
};

export const useUpdateClassMutation = () => {

  return useMutation<UpdateClassResponse, Error, { id: string; payload: ClassPayload }>({
    mutationFn: ({ id, payload }) => updateClass(id, payload),
    mutationKey: ['updateClass'],
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['classes', 'schoolStats', data.data?.class.schoolId] });
        queryClient.invalidateQueries({ queryKey: ['class', data.data?.class.id] });
      }
    },
    onError: (error) => {
      console.error('Class update error:', error);
    },
  });
};

export const useDeleteClassMutation = () => {

  return useMutation<DeleteClassResponse, Error, string>({
    mutationKey: ['deleteClass'],
    mutationFn: deleteClass,
    onSuccess: (data, classId) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        queryClient.invalidateQueries({ queryKey: ['class', classId] });
      }
    },
    onError: (error) => {
      console.error('Class deletion error:', error);
    },
  });
};
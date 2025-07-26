import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createFolder, 
  uploadFile, 
  updateFile, 
  deleteFile,
  shareFile,
  unshareFile
} from './files.api';
import { 
  CreateFolderInputs,
  UpdateFileInputs,
  ShareFileInputs 
} from './files.types';

export const useCreateFolderMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFolderInputs) => createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useUploadFileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, parent }: { file: File; parent?: string | null }) => 
      uploadFile(file, parent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useUpdateFileMutation = (fileId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateFileInputs) => updateFile(fileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
    },
  });
};

export const useDeleteFileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useShareFileMutation = (fileId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ShareFileInputs) => shareFile(fileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
    },
  });
};

export const useUnshareFileMutation = (fileId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => unshareFile(fileId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
    },
  });
};

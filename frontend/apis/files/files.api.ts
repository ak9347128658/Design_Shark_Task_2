import axiosInstance from '../axiosInstance';
import { 
  FileParams, 
  CreateFolderInputs, 
  UpdateFileInputs, 
  ShareFileInputs,
  FilesResponse,
  FileResponse,
  FileCreateResponse,
  FileUpdateResponse,
  FileDeleteResponse
} from './files.types';

export const getFiles = async (params?: FileParams): Promise<FilesResponse> => {
  // Clean up params to ensure null values are properly handled
  const cleanParams = { ...params };
  
  // Log the request for debugging
  console.log("Getting files with params:", cleanParams);
  
  const response = await axiosInstance.get('/files', { params: cleanParams });
  console.log("Files API response:", response.data);
  return response.data;
};

export const getFileById = async (fileId: string): Promise<FileResponse> => {
  const response = await axiosInstance.get(`/files/${fileId}`);
  return response.data;
};

export const createFolder = async (data: CreateFolderInputs): Promise<FileCreateResponse> => {
  const response = await axiosInstance.post('/files/folders', data);
  return response.data;
};

export const uploadFile = async (file: File, parent?: string | null): Promise<FileCreateResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (parent) {
    formData.append('parent', parent);
  }
  
  const response = await axiosInstance.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const updateFile = async (fileId: string, data: UpdateFileInputs): Promise<FileUpdateResponse> => {
  const response = await axiosInstance.put(`/files/${fileId}`, data);
  return response.data;
};

export const deleteFile = async (fileId: string): Promise<FileDeleteResponse> => {
  const response = await axiosInstance.delete(`/files/${fileId}`);
  return response.data;
};

export const shareFile = async (fileId: string, data: ShareFileInputs): Promise<FileUpdateResponse> => {
  const response = await axiosInstance.post(`/files/${fileId}/share`, data);
  return response.data;
};

export const unshareFile = async (fileId: string, userId: string): Promise<FileUpdateResponse> => {
  const response = await axiosInstance.delete(`/files/${fileId}/share/${userId}`);
  return response.data;
};

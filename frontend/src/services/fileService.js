import api from './api';
import { isDemoMode, mockApiResponses } from './mockData';

export const fileService = {
  // Get files and folders
  getFiles: async (parentId = null) => {
    try {
      if (isDemoMode) {
        return mockApiResponses.getFiles(parentId);
      }

      const response = await api.get('/files', {
        params: { parent: parentId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload file
  uploadFile: async (file, parentId = null) => {
    try {
      if (isDemoMode) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockApiResponses.uploadFile(file, parentId);
      }

      const formData = new FormData();
      formData.append('file', file);
      if (parentId) {
        formData.append('parent', parentId);
      }

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload multiple files
  uploadFiles: async (files, parentId = null) => {
    try {
      if (isDemoMode) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        const uploadedFiles = [];
        for (const file of files) {
          uploadedFiles.push(mockApiResponses.uploadFile(file, parentId));
        }
        return uploadedFiles;
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      if (parentId) {
        formData.append('parent', parentId);
      }

      const response = await api.post('/files/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create folder
  createFolder: async (folderData) => {
    try {
      if (isDemoMode) {
        return mockApiResponses.createFolder(folderData);
      }

      const response = await api.post('/folders', folderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete file or folder
  deleteItem: async (id) => {
    try {
      if (isDemoMode) {
        return mockApiResponses.deleteFile(id);
      }

      const response = await api.delete(`/files/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get file details
  getFileDetails: async (id) => {
    try {
      if (isDemoMode) {
        const allItems = [...mockApiResponses.getFiles(), ...mockApiResponses.getFiles('folder1')];
        const item = allItems.find(item => item._id === id);
        if (!item) throw new Error('File not found');
        return item;
      }

      const response = await api.get(`/files/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download file
  downloadFile: async (id) => {
    try {
      if (isDemoMode) {
        // In demo mode, just return a placeholder URL
        return '/placeholder-download.zip';
      }

      // First get the file details which will include the downloadUrl (SAS URL)
      const response = await api.get(`/files/${id}`);
      
      // Return the downloadUrl from the response if available
      if (response.data && response.data.data && response.data.data.downloadUrl) {
        return response.data.data.downloadUrl.url;
      }
      
      // Fallback to the old method if downloadUrl is not available
      const downloadResponse = await api.get(`/files/${id}/download`, {
        responseType: 'blob',
      });
      return downloadResponse.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};


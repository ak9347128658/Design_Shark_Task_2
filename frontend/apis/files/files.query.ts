import { useQuery } from '@tanstack/react-query';
import { getFiles, getFileById } from './files.api';
import { FileParams } from './files.types';

export const useFilesQuery = (params?: FileParams) => {
  return useQuery({
    queryKey: ['files', params],
    queryFn: async () => {
      console.log("Fetching files with params:", params);
      try {
        const result = await getFiles(params);
        console.log("Files API response:", result);
        return result;
      } catch (error) {
        console.error("Error fetching files:", error);
        throw error;
      }
    },
  });
};

export const useFileQuery = (fileId: string) => {
  return useQuery({
    queryKey: ['file', fileId],
    queryFn: () => getFileById(fileId),
    enabled: !!fileId,
  });
};

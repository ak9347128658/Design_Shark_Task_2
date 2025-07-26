import { z } from 'zod';

export const FileSchema = z.object({
  _id: z.string(),
  name: z.string(),
  type: z.string().optional(),
  size: z.number().optional(),
  path: z.string().optional(),
  owner: z.string(),
  parent: z.string().nullable(),
  sharedWith: z.array(z.string()).optional(),
  isFolder: z.boolean(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type File = z.infer<typeof FileSchema>;

export const CreateFolderSchema = z.object({
  name: z.string().min(1, { message: 'Folder name is required' }),
  parent: z.string().nullable().optional(),
});

export type CreateFolderInputs = z.infer<typeof CreateFolderSchema>;

export const UpdateFileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  parent: z.string().nullable().optional(),
});

export type UpdateFileInputs = z.infer<typeof UpdateFileSchema>;

export const ShareFileSchema = z.object({
  userIds: z.array(z.string()),
});

export type ShareFileInputs = z.infer<typeof ShareFileSchema>;

export interface PresignedUrl {
  url: string;
  expiresAt: string;
}

export interface FileParams {
  search?: string;
  parent?: string | null;
  isFolder?: boolean;
  shared?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export interface FilesResponse {
  success: boolean;
  count: number;
  pagination: PaginationMeta;
  data: File[];
}

export interface FileResponse {
  success: boolean;
  data: {
    file: File;
    downloadUrl?: PresignedUrl;
  };
}

export interface FileCreateResponse {
  success: boolean;
  message: string;
  data: File;
}

export interface FileUpdateResponse {
  success: boolean;
  message: string;
  data: File;
}

export interface FileDeleteResponse {
  success: boolean;
  message: string;
}

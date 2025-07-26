// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// File related types
export interface FileItem {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  userId: string;
  parentId: string | null;
  isFolder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Folder extends FileItem {
  isFolder: true;
}

export interface File extends FileItem {
  isFolder: false;
}

export interface FileUpload {
  file: File;
  parentId?: string | null;
}

export interface CreateFolderData {
  folderName: string;
  parentId?: string | null;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

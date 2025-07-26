// Mock data for demo mode
export const mockUsers = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
];

export const mockFolders = [
  {
    _id: 'folder1',
    name: 'Brochures',
    type: 'folder',
    itemCount: 9,
    owner: mockUsers[0],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'folder2',
    name: 'Offline Marketing',
    type: 'folder',
    itemCount: 15,
    owner: mockUsers[0],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'folder3',
    name: 'Reels',
    type: 'folder',
    itemCount: 28,
    owner: mockUsers[0],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'folder4',
    name: 'Static Posts',
    type: 'folder',
    itemCount: 46,
    owner: mockUsers[0],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'folder5',
    name: 'LOGOs',
    type: 'folder',
    itemCount: 4,
    owner: mockUsers[0],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'folder6',
    name: 'WEBSITES',
    type: 'folder',
    itemCount: 8,
    owner: mockUsers[0],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockFiles = [
  {
    _id: 'file1',
    name: '11.2.png',
    type: 'file',
    mimeType: 'image/png',
    size: 2150000,
    owner: mockUsers[0],
    parent: 'folder1',
    url: '/placeholder-image.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'file2',
    name: '12.png',
    type: 'file',
    mimeType: 'image/png',
    size: 1800000,
    owner: mockUsers[0],
    parent: 'folder1',
    url: '/placeholder-image.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'file3',
    name: '13.2.png',
    type: 'file',
    mimeType: 'image/png',
    size: 2200000,
    owner: mockUsers[0],
    parent: 'folder1',
    url: '/placeholder-image.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: 'file4',
    name: '95.png',
    type: 'file',
    mimeType: 'image/png',
    size: 1950000,
    owner: mockUsers[0],
    parent: 'folder1',
    url: '/placeholder-image.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Demo mode flag
export const isDemoMode = true;

// Mock API responses
export const mockApiResponses = {
  login: (email, password) => {
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'demo123') {
      return {
        token: 'demo-token-' + user._id,
        user: user
      };
    }
    throw new Error('Invalid credentials');
  },
  
  register: (name, email, password) => {
    const newUser = {
      _id: 'user' + Date.now(),
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return {
      token: 'demo-token-' + newUser._id,
      user: newUser
    };
  },
  
  getCurrentUser: (token) => {
    const userId = token.replace('demo-token-', '');
    const user = mockUsers.find(u => u._id === userId);
    if (!user) throw new Error('User not found');
    return user;
  },
  
  getFiles: (parentId = null) => {
    if (!parentId) {
      return mockFolders;
    }
    return mockFiles.filter(file => file.parent === parentId);
  },
  
  getAllUsers: () => mockUsers,
  
  createUser: (userData) => {
    const newUser = {
      _id: 'user' + Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  },
  
  updateUser: (id, userData) => {
    const index = mockUsers.findIndex(u => u._id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = { ...mockUsers[index], ...userData, updatedAt: new Date().toISOString() };
    return mockUsers[index];
  },
  
  deleteUser: (id) => {
    const index = mockUsers.findIndex(u => u._id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
    return { message: 'User deleted successfully' };
  },
  
  createFolder: (folderData) => {
    const newFolder = {
      _id: 'folder' + Date.now(),
      ...folderData,
      type: 'folder',
      itemCount: 0,
      owner: mockUsers[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockFolders.push(newFolder);
    return newFolder;
  },
  
  uploadFile: (file, parentId) => {
    const newFile = {
      _id: 'file' + Date.now(),
      name: file.name,
      type: 'file',
      mimeType: file.type,
      size: file.size,
      owner: mockUsers[0],
      parent: parentId,
      url: '/placeholder-image.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockFiles.push(newFile);
    return newFile;
  },
  
  deleteFile: (id) => {
    const folderIndex = mockFolders.findIndex(f => f._id === id);
    if (folderIndex !== -1) {
      mockFolders.splice(folderIndex, 1);
      return { message: 'Folder deleted successfully' };
    }
    
    const fileIndex = mockFiles.findIndex(f => f._id === id);
    if (fileIndex !== -1) {
      mockFiles.splice(fileIndex, 1);
      return { message: 'File deleted successfully' };
    }
    
    throw new Error('Item not found');
  }
};


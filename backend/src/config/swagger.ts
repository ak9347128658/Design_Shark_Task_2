import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Document Management System API',
      version: '1.0.0',
      description: 'API documentation for Document Management System',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of user creation',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last user update',
            },
          },
        },
        RegisterUserDto: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role (optional)',
            },
          },
        },
        LoginUserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
            },
          },
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role',
            },
          },
        },
        File: {
          type: 'object',
          required: ['name', 'owner'],
          properties: {
            id: {
              type: 'string',
              description: 'File or folder ID',
            },
            name: {
              type: 'string',
              description: 'File or folder name',
            },
            type: {
              type: 'string',
              description: 'File type/MIME type (only for files)',
            },
            size: {
              type: 'number',
              description: 'File size in bytes (only for files)',
            },
            path: {
              type: 'string',
              description: 'File storage path (only for files)',
            },
            owner: {
              type: 'string',
              description: 'Owner user ID',
            },
            parent: {
              type: 'string',
              description: 'Parent folder ID (null for root items)',
              nullable: true,
            },
            sharedWith: {
              type: 'array',
              items: {
                type: 'string',
                description: 'User IDs',
              },
              description: 'Users this file/folder is shared with',
            },
            isFolder: {
              type: 'boolean',
              description: 'Whether this is a folder or a file',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of file/folder creation',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last file/folder update',
            },
          },
        },
        CreateFolderDto: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'Folder name',
            },
            parent: {
              type: 'string',
              description: 'Parent folder ID (null for root folder)',
              nullable: true,
            },
          },
        },
        CreateFileDto: {
          type: 'object',
          required: ['name', 'type', 'size'],
          properties: {
            name: {
              type: 'string',
              description: 'File name',
            },
            type: {
              type: 'string',
              description: 'File type/MIME type',
            },
            size: {
              type: 'number',
              description: 'File size in bytes',
            },
            parent: {
              type: 'string',
              description: 'Parent folder ID (null for root level)',
              nullable: true,
            },
          },
        },
        UpdateFileDto: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'File or folder name',
            },
            parent: {
              type: 'string',
              description: 'Parent folder ID (null for root level)',
              nullable: true,
            },
          },
        },
        ShareFileDto: {
          type: 'object',
          required: ['userIds'],
          properties: {
            userIds: {
              type: 'array',
              items: {
                type: 'string',
                description: 'User IDs',
              },
              description: 'List of user IDs to share with',
            },
          },
        },
        PresignedUrl: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Pre-signed URL for upload or download',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'Expiration timestamp of the URL',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'API for user authentication',
      },
      {
        name: 'Users',
        description: 'API for user management',
      },
      {
        name: 'Files',
        description: 'API for file and folder management',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export default swaggerJsdoc(options);

# Document Management System - Backend

A full-featured document management system backend built with Node.js (TypeScript), MongoDB, and Azure Blob Storage. This backend provides APIs for user authentication, file/folder management, and document search capabilities with role-based access control.

## Technologies Used

- Node.js with TypeScript
- MongoDB with Mongoose ODM
- Express.js for API routes
- JWT-based Authentication
- Role-Based Access Control (RBAC)
- Azure Blob Storage for file storage
- class-validator and class-transformer for DTO validation
- Swagger/OpenAPI for API documentation

## Features

- User authentication (register, login, logout)
- Role-based access control (Admin and User roles)
- File and folder management (create, read, update, delete)
- File sharing capabilities
- Document search with MongoDB indexes
- Presigned URLs for secure file access
- Complete API documentation with Swagger

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Azure Storage Account

### Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/document-manager
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d

AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_CONTAINER_NAME=uploads
AZURE_ACCOUNT_NAME=yourstorageaccount
AZURE_ACCOUNT_KEY=youraccountkey
```

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Build the TypeScript code:
   ```
   npm run build
   ```

3. Seed the database with an admin user:
   ```
   npm run seed
   ```
   
   This creates an admin user with the credentials defined in your .env file:
   - Name: ADMIN_NAME (defaults to "Admin User")
   - Email: ADMIN_EMAIL (defaults to "admin@example.com") 
   - Password: ADMIN_PASSWORD (defaults to "admin123")

4. Start the development server:
   ```
   npm run dev
   ```

5. Access Swagger API documentation:
   ```
   http://localhost:5000/api-docs
   ```

## Database Management

The project includes a comprehensive database management system:

### Interactive Database Manager

The easiest way to manage the database is through the interactive manager:

```
npm run db:manager
```

This will display a menu with all available database operations.

### Individual Database Operations

1. Create a database dump:
   ```
   npm run db:dump
   ```
   This will provide an interactive menu to select which database to dump, or dump all databases.

2. Restore a database from a dump:
   ```
   npm run db:restore
   ```
   This will provide an interactive selection of available dumps.

3. Restore from the most recent dump:
   ```
   npm run db:restore:latest
   ```

4. Full database process (dump, restore, seed):
   ```
   npm run db:all
   ```

5. Reset database (restore latest and seed):
   ```
   npm run db:reset
   ```

### Docker Management

The project includes scripts for Docker management:

1. Start Docker containers:
   ```
   npm run docker:start
   ```

2. Stop Docker containers:
   ```
   npm run docker:stop
   ```

3. Restart Docker containers:
   ```
   npm run docker:restart
   ```

4. Build Docker containers:
   ```
   npm run docker:build
   ```

5. Complete Docker setup (build, start, seed):
   ```
   npm run docker:setup
   ```

## API Overview

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### User Management Endpoints (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### File/Folder Management Endpoints

- `POST /api/files` - Create file/folder
- `GET /api/files` - List files/folders
- `GET /api/files/:id` - Get file/folder details
- `PUT /api/files/:id` - Update file/folder
- `DELETE /api/files/:id` - Delete file/folder
- `POST /api/files/:id/share` - Share file/folder with users
- `POST /api/files/upload` - Upload a file to Azure Blob Storage
- `GET /api/files/:id/download` - Get a presigned URL to download file
- `POST /api/files/search` - Search for files/folders

## Project Structure

```
src/
├── config/          # Database and swagger configuration
├── controllers/     # API controllers
├── dto/             # Data Transfer Objects for validation
├── middleware/      # Express middleware
├── models/          # MongoDB schema models
├── routes/          # API routes
├── scripts/         # Database seed scripts
├── services/        # Business logic
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
└── index.ts         # Express app entry point
```

# Document Management System

A full-featured document management system with a Node.js (TypeScript) backend and a frontend (to be implemented).

## Project Structure

The project consists of two main components:

- **Backend**: A RESTful API built with Node.js, TypeScript, Express, and MongoDB
- **Frontend**: (To be implemented)

## Backend

The backend provides a complete API for document management with the following features:

- User authentication (JWT-based)
- Role-based access control (Admin and User roles)
- File and folder management
- File sharing between users
- Document search functionality
- Integration with Azure Blob Storage for file storage
- Presigned URLs with 24-hour validity for secure file access

For more details, see the [Backend README](./backend/README.md).

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Azure Storage Account (or use Azurite for local development)
- Docker and Docker Compose (optional, for containerized setup)

### Using Docker Compose (Recommended)

1. Clone the repository
2. Set up environment variables:
   ```
   cp backend/.env.example backend/.env
   ```
   Edit the `.env` file with your Azure Storage credentials.

3. Start the services:
   ```
   docker-compose up -d
   ```

4. Access the API at http://localhost:5000
5. Access Swagger documentation at http://localhost:5000/api-docs

### Manual Setup

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   npm install
   npm run build
   npm run seed   # Creates admin user
   npm run dev    # Starts development server
   ```

3. Access the API at http://localhost:5000
4. Access Swagger documentation at http://localhost:5000/api-docs

## API Documentation

The API documentation is available through Swagger UI at `/api-docs` when the server is running.

## Authentication

The system uses JWT-based authentication. To access protected endpoints:

1. Register a user or use the default admin credentials:
   - Email: admin@example.com
   - Password: admin123

2. Login to receive a JWT token
3. Include the token in the Authorization header for subsequent requests:
   ```
   Authorization: Bearer <your-token>
   ```

## Default Admin User

The system comes with a default admin user that is created when you run the seed script:

- Email: admin@example.com
- Password: admin123

## License

This project is licensed under the MIT License.

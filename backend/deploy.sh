#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting deployment script..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the project
echo "Building project..."
npm run build

# Seed the database with admin user
echo "Seeding database..."
npm run seed

# Start the server
echo "Starting server..."
npm start

echo "Deployment completed successfully!"

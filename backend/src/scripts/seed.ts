import 'reflect-metadata';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import User from '../models/User';
import { UserRole } from '../types';
import connectDB from '../config/database';

// Load environment variables
dotenv.config();

// Function to seed database with admin user
async function seedAdmin() {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    // Get admin credentials from environment variables
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin user exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin user already exists');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await hash(adminPassword, 10);
    
    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await admin.save();
    
    console.log('Admin user created successfully');
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin();

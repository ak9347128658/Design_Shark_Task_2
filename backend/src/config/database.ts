import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection options
const options = {
  autoIndex: true,
};

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      authSource: 'admin',
    } as ConnectOptions);
    console.log('MongoDB connected successfully');
    // console.log(`MongoDB Connected: ${process.env.MONGODB_URI}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

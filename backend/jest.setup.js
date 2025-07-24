// Setup environment variables for tests
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// Increase timeout for all tests
jest.setTimeout(30000);

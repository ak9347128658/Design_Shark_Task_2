import 'reflect-metadata';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import readline from 'readline';

// Load environment variables
dotenv.config();

console.log('=== Database Management Tool ===');
console.log('This tool helps you perform database operations');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const options = [
  { id: 1, name: 'Dump database', command: 'npm run db:dump' },
  { id: 2, name: 'Restore database', command: 'npm run db:restore' },
  { id: 3, name: 'Restore latest dump', command: 'npm run db:restore:latest' },
  { id: 4, name: 'Seed database with admin user', command: 'npm run seed' },
  { id: 5, name: 'Full process: dump, restore latest, and seed', command: 'npm run db:all' },
  { id: 6, name: 'Reset database: restore latest and seed', command: 'npm run db:reset' },
  { id: 7, name: 'Docker: Start containers', command: 'npm run docker:start' },
  { id: 8, name: 'Docker: Stop containers', command: 'npm run docker:stop' },
  { id: 9, name: 'Docker: Restart containers', command: 'npm run docker:restart' },
  { id: 10, name: 'Docker: Build containers', command: 'npm run docker:build' },
  { id: 11, name: 'Docker: View logs', command: 'npm run docker:logs' },
  { id: 12, name: 'Docker: Complete setup (build, start, seed)', command: 'npm run docker:setup' },
  { id: 13, name: 'Exit', command: '' }
];

console.log('\nAvailable operations:');
options.forEach(option => {
  console.log(`[${option.id}] ${option.name}`);
});

rl.question('\nSelect an operation (number): ', (answer) => {
  rl.close();
  
  if (/^\d+$/.test(answer)) {
    const selection = parseInt(answer);
    const option = options.find(opt => opt.id === selection);
    
    if (option) {
      if (option.id === 13) {
        console.log('Exiting...');
        process.exit(0);
      }
      
      try {
        console.log(`\nExecuting: ${option.name}`);
        execSync(option.command, { stdio: 'inherit' });
        console.log(`\n${option.name} completed successfully.`);
        process.exit(0);
      } catch (error) {
        console.error(`\nError executing ${option.name}:`, error);
        process.exit(1);
      }
    } else {
      console.error('Invalid selection');
      process.exit(1);
    }
  } else {
    console.error('Please enter a valid number');
    process.exit(1);
  }
});

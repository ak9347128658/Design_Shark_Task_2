import 'reflect-metadata';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/document-manager';
const DB_NAME = MONGODB_URI.split('/').pop() || 'document-manager';
const DUMPS_DIR = path.join(__dirname, '../../dumps');

// Check if dumps directory exists
if (!fs.existsSync(DUMPS_DIR)) {
  console.error('No database dumps found. Please run the dump-db script first.');
  process.exit(1);
}

// List all available dumps
const dumpFolders = fs.readdirSync(DUMPS_DIR)
  .filter(folder => folder.startsWith(DB_NAME))
  .sort()
  .reverse(); // Most recent first

if (dumpFolders.length === 0) {
  console.error(`No dumps found for database ${DB_NAME}`);
  process.exit(1);
}

// Process command line arguments
const args = process.argv.slice(2);
let dumpPath: string;

if (args[0] === '--latest') {
  // Use the most recent dump
  dumpPath = path.join(DUMPS_DIR, dumpFolders[0]);
  console.log(`Using the latest dump: ${dumpFolders[0]}`);
} else if (args[0] && dumpFolders.includes(args[0])) {
  // Use the specified dump
  dumpPath = path.join(DUMPS_DIR, args[0]);
  console.log(`Using specified dump: ${args[0]}`);
} else {
  // Interactive selection
  console.log('Available database dumps:');
  dumpFolders.forEach((folder, index) => {
    console.log(`[${index + 1}] ${folder}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Select a dump to restore (number or full name): ', (answer) => {
    rl.close();
    
    let selectedDump: string;
    
    if (/^\d+$/.test(answer)) {
      const index = parseInt(answer) - 1;
      if (index >= 0 && index < dumpFolders.length) {
        selectedDump = dumpFolders[index];
      } else {
        console.error('Invalid selection');
        process.exit(1);
      }
    } else if (dumpFolders.includes(answer)) {
      selectedDump = answer;
    } else {
      console.error('Invalid dump name');
      process.exit(1);
    }
    
    const selectedDumpPath = path.join(DUMPS_DIR, selectedDump);
    restoreDatabase(selectedDumpPath);
  });
  
  // Exit - we'll restore via the callback
  process.exit(0);
}

// If we're here, we have a dump path from command line args
restoreDatabase(dumpPath);

function restoreDatabase(dumpPath: string): void {
  try {
    console.log(`Restoring database ${DB_NAME} from ${dumpPath}...`);
    
    // Execute mongorestore command
    execSync(
      `mongorestore --uri="${MONGODB_URI}" --drop "${path.join(dumpPath, DB_NAME)}"`, 
      { stdio: 'inherit' }
    );
    
    console.log('Database restore completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error restoring database:', err);
    process.exit(1);
  }
}

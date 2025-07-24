import 'reflect-metadata';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/document-manager';
const DEFAULT_DB_NAME = MONGODB_URI.split('/').pop() || 'document-manager';
const DUMPS_DIR = path.join(__dirname, '../../dumps');

// Create dumps directory if it doesn't exist
if (!fs.existsSync(DUMPS_DIR)) {
  fs.mkdirSync(DUMPS_DIR, { recursive: true });
}

// Process command line arguments
const args = process.argv.slice(2);
let dbName = DEFAULT_DB_NAME;

if (args[0] === '--db' && args[1]) {
  // Use specified DB name from command line
  dbName = args[1];
  performDump(dbName);
} else if (args[0] === '--all') {
  // Dump all databases
  performDumpAll();
} else {
  // Interactive mode - ask for the database
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // List available databases
  try {
    console.log('Fetching available databases...');
    const result = execSync('mongosh --eval "db.adminCommand(\'listDatabases\')" --quiet').toString();
    
    // Parse the database list
    const match = result.match(/databases: \[(.*?)\]/s);
    if (match && match[1]) {
      const dbList = match[1].split('},').map(db => {
        const nameMatch = db.match(/name: ['"]([^'"]+)['"]/);
        return nameMatch ? nameMatch[1] : null;
      }).filter((name): name is string => name !== null);
      
      console.log('\nAvailable databases:');
      dbList.forEach((db, index) => {
        console.log(`[${index + 1}] ${db}`);
      });
      console.log(`[${dbList.length + 1}] All databases`);
      console.log(`[${dbList.length + 2}] Default database (${DEFAULT_DB_NAME})`);
      
      rl.question('\nSelect a database to dump (number or name): ', (answer) => {
        rl.close();
        
        if (/^\d+$/.test(answer)) {
          const index = parseInt(answer) - 1;
          if (index >= 0 && index < dbList.length) {
            performDump(dbList[index]);
          } else if (index === dbList.length) {
            performDumpAll();
          } else if (index === dbList.length + 1) {
            performDump(DEFAULT_DB_NAME);
          } else {
            console.error('Invalid selection');
            process.exit(1);
          }
        } else if (answer.toLowerCase() === 'all') {
          performDumpAll();
        } else if (dbList.includes(answer)) {
          performDump(answer);
        } else {
          console.log(`Database '${answer}' not found in list. Using it anyway...`);
          performDump(answer);
        }
      });
    } else {
      console.log(`Could not parse database list. Using default database (${DEFAULT_DB_NAME}).`);
      performDump(DEFAULT_DB_NAME);
    }
  } catch (error) {
    console.error('Could not fetch database list:', error);
    console.log(`Falling back to default database (${DEFAULT_DB_NAME})...`);
    performDump(DEFAULT_DB_NAME);
  }
}

function performDump(dbName: string): void {
  try {
    // Generate timestamp for the dump filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dumpPath = path.join(DUMPS_DIR, `${dbName}-${timestamp}`);

    console.log(`Creating database dump for ${dbName} at ${dumpPath}...`);
    
    // Extract host from URI
    const uriParts = MONGODB_URI.split('/');
    const hostPart = uriParts.slice(0, uriParts.length - 1).join('/');
    const uri = `${hostPart}/${dbName}`;
    
    // Execute mongodump command
    execSync(`mongodump --uri="${uri}" --out="${dumpPath}"`, { stdio: 'inherit' });
    
    console.log('Database dump completed successfully!');
    console.log(`Dump saved to: ${dumpPath}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating database dump:', err);
    process.exit(1);
  }
}

function performDumpAll(): void {
  try {
    // Generate timestamp for the dump filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dumpPath = path.join(DUMPS_DIR, `all-databases-${timestamp}`);

    console.log(`Creating dump of all databases at ${dumpPath}...`);
    
    // Extract host from URI without db name
    const hostPart = MONGODB_URI.split('/').slice(0, -1).join('/');
    
    // Execute mongodump command for all databases
    execSync(`mongodump --uri="${hostPart}" --out="${dumpPath}"`, { stdio: 'inherit' });
    
    console.log('All databases dump completed successfully!');
    console.log(`Dump saved to: ${dumpPath}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating database dump:', err);
    process.exit(1);
  }
}

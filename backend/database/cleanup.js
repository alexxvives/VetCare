import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple approach: just delete the database files and recreate
const dbFiles = [
  'vetcare_dev.db',
  'vetcare_dev.db-shm', 
  'vetcare_dev.db-wal'
];

console.log('Deleting old database files...');
dbFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${file}`);
    }
  } catch (error) {
    console.log(`Could not delete ${file}:`, error.message);
  }
});

console.log('Database files deleted. You can now run the setup script.');
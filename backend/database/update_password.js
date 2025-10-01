import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updatePassword() {
  try {
    // Generate the hash for 'password'
    const newPasswordHash = await bcrypt.hash('password', 10);
    console.log('Generated hash:', newPasswordHash);
    
    // Connect to the database
    const dbPath = path.join(__dirname, 'vetcare_dev.db');
    const db = new sqlite3.Database(dbPath);
    
    // Update the super admin password
    db.run(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [newPasswordHash, 'superadmin@vetcare.com'],
      function(err) {
        if (err) {
          console.error('Error updating password:', err.message);
        } else {
          console.log(`Password updated successfully. Rows affected: ${this.changes}`);
        }
        
        // Close the database connection
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database connection closed.');
          }
        });
      }
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

updatePassword();
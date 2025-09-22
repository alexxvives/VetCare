import knex from 'knex';
import { Model } from 'objection';
import config from '../../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

// Initialize Knex instance
const db = knex(knexConfig);

// Bind Objection.js to Knex instance
Model.knex(db);

// Test database connection
const testConnection = async () => {
  try {
    await db.raw('SELECT 1+1 as result');
    console.log('✅ SQLite database connection established successfully');
    
    // Enable foreign key constraints
    await db.raw('PRAGMA foreign_keys = ON');
    console.log('✅ SQLite foreign key constraints enabled');
    
    // Set journal mode for better performance
    await db.raw('PRAGMA journal_mode = WAL');
    console.log('✅ SQLite WAL mode enabled for better performance');
    
    return true;
  } catch (error) {
    console.error('❌ SQLite database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown
const closeConnection = async () => {
  try {
    await db.destroy();
    console.log('✅ SQLite database connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing SQLite database connection:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

export {
  db,
  testConnection,
  closeConnection
};
#!/usr/bin/env node
/**
 * Migration Test Script
 * Tests all migration up and down procedures
 * Run this after setting up MySQL and Redis locally
 */

const { exec } = require('child_process');
const path = require('path');

const runCommand = (command, description) => {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 ${description}`);
    console.log(`   Command: ${command}`);
    
    exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ Failed: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.log(`⚠️  Warning: ${stderr}`);
      }
      
      if (stdout) {
        console.log(`✅ Output: ${stdout.trim()}`);
      }
      
      resolve(stdout);
    });
  });
};

async function testMigrations() {
  try {
    console.log('🧪 Testing VetCare Database Migrations');
    console.log('=====================================');
    
    // Check migration status
    await runCommand('npx knex migrate:status', 'Checking migration status');
    
    // Run all migrations
    await runCommand('npx knex migrate:latest', 'Running all migrations UP');
    
    // Check status after migrations
    await runCommand('npx knex migrate:status', 'Checking migration status after UP');
    
    // Test rollback (rollback last batch)
    await runCommand('npx knex migrate:rollback', 'Testing migration rollback (last batch)');
    
    // Check status after rollback
    await runCommand('npx knex migrate:status', 'Checking migration status after rollback');
    
    // Run migrations again
    await runCommand('npx knex migrate:latest', 'Running migrations UP again');
    
    // Run seed data
    await runCommand('npx knex seed:run', 'Running seed data');
    
    // Test rollback all
    await runCommand('npx knex migrate:rollback --all', 'Testing rollback ALL migrations');
    
    // Final status check
    await runCommand('npx knex migrate:status', 'Final migration status check');
    
    console.log('\n✅ All migration tests completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Install MySQL 8.0 locally');
    console.log('2. Install Redis 7.x locally');
    console.log('3. Update .env file with database credentials');
    console.log('4. Run: npm run test-migrations');
    
  } catch (error) {
    console.log('\n❌ Migration test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure MySQL server is running');
    console.log('2. Ensure Redis server is running');
    console.log('3. Check database credentials in .env file');
    console.log('4. Verify database user has proper permissions');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testMigrations();
}

module.exports = { testMigrations };
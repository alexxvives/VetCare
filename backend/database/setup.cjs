const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

console.log('🏥 VetCare MVP Database Setup');
console.log('Creating database with simple SQL approach...\n');

// Database file path
const dbPath = path.join(__dirname, 'vetcare_dev.db');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Removed existing database');
}

// Create new database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error creating database:', err.message);
        return;
    }
    console.log('✅ Created new SQLite database');
});

// Read and execute schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
    if (err) {
        console.error('❌ Error creating schema:', err.message);
        return;
    }
    console.log('✅ Created database schema (4 tables)');
    
    // Read and execute sample data
    const dataPath = path.join(__dirname, 'sample_data.sql');
    const sampleData = fs.readFileSync(dataPath, 'utf8');
    
    db.exec(sampleData, (err) => {
        if (err) {
            console.error('❌ Error inserting sample data:', err.message);
            return;
        }
        console.log('✅ Inserted sample data');
        
        // Verify data was inserted
        db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
            if (err) {
                console.error('❌ Error verifying data:', err.message);
                return;
            }
            console.log(`✅ Database ready with ${row.count} users`);
            
            // Show sample accounts
            console.log('\n🔑 Sample Login Accounts:');
            console.log('Super Admin: superadmin@vetcare.com / password');
            console.log('Clinic Admin: admin@vetcare-demo.com / Admin123!');
            console.log('Veterinarian: dr.smith@vetcare-demo.com / Vet123!');
            console.log('Client: john.doe@email.com / Client123!');
            console.log('\n🚀 Database setup complete! Ready for development.');
            
            // Close database
            db.close();
        });
    });
});
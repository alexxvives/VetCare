# VetCare Database Setup

## Simple SQL Approach (MVP)

We're using a simple SQL approach for the MVP instead of migrations. This makes it easier to understand and modify.

## Database Files

- `schema.sql` - Creates all tables and indexes
- `sample_data.sql` - Inserts test data for development
- `vetcare_dev.db` - SQLite database file (auto-created)

## Setup Instructions

### Option 1: Using SQLite Command Line
```bash
# Create database and run schema
sqlite3 vetcare_dev.db < schema.sql

# Insert sample data
sqlite3 vetcare_dev.db < sample_data.sql
```

### Option 2: Using DBeaver
1. Create new SQLite connection
2. Point to `vetcare_dev.db` file
3. Run `schema.sql` first
4. Run `sample_data.sql` second

### Option 3: Programmatic Setup (Node.js)
```javascript
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Create database
const db = new sqlite3.Database('./vetcare_dev.db');

// Run schema
const schema = fs.readFileSync('./schema.sql', 'utf8');
db.exec(schema);

// Run sample data
const sampleData = fs.readFileSync('./sample_data.sql', 'utf8');
db.exec(sampleData);
```

## Sample Accounts

### Super Admin
- Email: `superadmin@vetcare.com`
- Password: `SuperAdmin123!`

### Clinic Admin  
- Email: `admin@vetcare-demo.com`
- Password: `Admin123!`

### Veterinarians
- Email: `dr.smith@vetcare-demo.com`
- Password: `Vet123!`
- Email: `dr.wilson@vetcare-demo.com`  
- Password: `Vet123!`

### Clients
- Email: `john.doe@email.com`
- Password: `Client123!`
- Email: `mary.smith@email.com`
- Password: `Client123!`
- Email: `bob.jones@email.com`
- Password: `Client123!`

## Database Schema Overview

### 4 Core Tables:
1. **users** - All user types (super_admin, clinic_admin, veterinarian, client)
2. **clinics** - Clinic information
3. **pets** - Animals owned by clients
4. **appointments** - Bookings between pets and vets

### Key Features:
- Single table for all user types with role-based fields
- Foreign key relationships between tables
- Proper indexes for performance
- Sample data for immediate testing
- No complex migrations - just simple SQL files

## Connecting from Backend

Update your database config to point to the SQLite file:

```javascript
// backend/src/config/database.js
const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '../database/vetcare_dev.db')
    },
    useNullAsDefault: true
  }
};
```

## No More Migrations!

For the MVP, we're keeping it simple:
- Direct SQL files instead of migration system
- Easy to understand and modify
- Can implement proper migrations later after MVP
- Focus on functionality, not infrastructure complexity

### Core Tables

1. **organizations** - Multi-tenant organization structure
2. **clinics** - Individual veterinary clinics
3. **users** - System users with role-based access
4. **clients** - Pet owners and client information
5. **pets** - Patient records for animals
6. **medical_records** - Medical history and treatments
7. **appointments** - Scheduling system
8. **vaccinations** - Vaccination tracking
9. **lab_results** - Laboratory test results
10. **audit_logs** - System activity tracking

### Key Features

- **Multi-tenancy**: Organization-based data isolation
- **HIPAA Compliance**: Audit logging and data encryption
- **Foreign Key Constraints**: Data integrity enforcement
- **Indexes**: Optimized query performance
- **Soft Deletes**: Data retention for compliance

## 🔧 Migration Management

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Create new migration
npm run migrate:make migration_name
```

### Migration Files

Migrations are timestamped and run in chronological order:

- `20250922022551_create_organizations_table.js`
- `20250922022619_create_clinics_table.js`
- `20250922022633_create_users_table.js`
- ... (additional tables)

## 🌱 Seeding Data

### Development Seeds

```bash
# Run all seed files
npm run seed

# Create new seed file
npm run seed:make seed_name
```

The seed file `01_initial_data.js` provides:
- Sample organizations and clinics
- Test user accounts
- Demo pet records
- Sample medical data

### Production Considerations

- Seeds should only be used in development
- Production data should use proper backup/restore procedures
- Sensitive data should never be in seed files

## 🔍 Database Schema

### Organizations Table
```sql
- id (PRIMARY KEY)
- name (VARCHAR)
- settings (JSON)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Clinics Table
```sql
- id (PRIMARY KEY)
- organization_id (FOREIGN KEY)
- name (VARCHAR)
- address (TEXT)
- phone (VARCHAR)
- email (VARCHAR)
- settings (JSON)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Users Table
```sql
- id (PRIMARY KEY)
- organization_id (FOREIGN KEY)
- clinic_id (FOREIGN KEY, nullable)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- role (ENUM: admin, staff, receptionist)
- is_active (BOOLEAN)
- last_login (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Pets Table
```sql
- id (PRIMARY KEY)
- clinic_id (FOREIGN KEY)
- client_id (FOREIGN KEY)
- name (VARCHAR)
- species (VARCHAR)
- breed (VARCHAR)
- gender (ENUM: male, female, unknown)
- date_of_birth (DATE)
- weight (DECIMAL)
- microchip_id (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔒 Security & Compliance

### Data Protection
- Password hashing with bcrypt
- Sensitive fields encrypted at rest
- Access control via organization/clinic isolation
- Audit logging for all data changes

### HIPAA Compliance
- Complete audit trail in `audit_logs` table
- Data retention policies implemented
- Secure deletion procedures
- Access logging and monitoring

## 🚀 Performance Optimization

### Indexes
- Primary keys on all tables
- Foreign key indexes for joins
- Composite indexes for common queries
- Email uniqueness constraints

### Query Optimization
- Use of prepared statements via Knex.js
- Connection pooling
- Query result caching where appropriate
- Efficient pagination patterns

## 🔧 Maintenance

### Regular Tasks
```bash
# Check database integrity
sqlite3 vetcare_dev.db "PRAGMA integrity_check;"

# Vacuum database (reclaim space)
sqlite3 vetcare_dev.db "VACUUM;"

# Analyze query performance
sqlite3 vetcare_dev.db "EXPLAIN QUERY PLAN SELECT ..."
```

### Backup Strategy
- Regular SQLite backups using `.backup` command
- Version control for schema migrations
- Data export capabilities for compliance
- Point-in-time recovery procedures

## 📊 Monitoring

### Key Metrics
- Database file size growth
- Query execution times
- Connection pool usage
- Migration execution status

### Troubleshooting
- Check SQLite error logs
- Verify foreign key constraints
- Monitor disk space usage
- Review slow query patterns
# VetCare Database

SQLite database schema and migration files for the VetCare SaaS platform.

## 📊 Database Overview

The VetCare database uses SQLite with Knex.js as the query builder and migration tool. It's designed for multi-tenant architecture with proper data isolation.

## 📁 Directory Structure

```
database/
├── migrations/          # Database schema migrations
├── seeds/              # Sample data for development
├── vetcare_dev.db      # SQLite database file (development)
├── vetcare_dev.db-shm  # SQLite shared memory file
└── vetcare_dev.db-wal  # SQLite write-ahead log file
```

## 🏗️ Schema Design

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
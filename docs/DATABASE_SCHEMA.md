# VetCare Database Schema Design

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐         ┌─────────────────┐
│  organizations  │         │    clinics      │
│                 │         │                 │
│ • id (PK)       │◄────────┤ • id (PK)       │
│ • name          │    1:N  │ • org_id (FK)   │
│ • subscription  │         │ • name          │
│ • created_at    │         │ • timezone      │
│ • updated_at    │         │ • settings      │
└─────────────────┘         │ • created_at    │
                            │ • updated_at    │
                            └─────────────────┘
                                      │
                                      │ 1:N
                                      ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     clients     │         │      users      │         │      pets       │
│                 │         │                 │         │                 │
│ • id (PK)       │         │ • id (PK)       │         │ • id (PK)       │
│ • clinic_id (FK)│◄────┐   │ • clinic_id (FK)│   ┌────►│ • clinic_id (FK)│
│ • first_name    │     │   │ • email         │   │     │ • client_id (FK)│
│ • last_name     │     │   │ • password_hash │   │     │ • name          │
│ • email         │     │   │ • role          │   │     │ • species       │
│ • phone         │     │   │ • mfa_secret    │   │     │ • breed         │
│ • address       │     │   │ • last_login    │   │     │ • birth_date    │
│ • created_at    │     │   │ • created_at    │   │     │ • microchip_id  │
│ • updated_at    │     │   │ • updated_at    │   │     │ • is_deceased   │
└─────────────────┘     │   └─────────────────┘   │     │ • created_at    │
          │             │             │           │     │ • updated_at    │
          │ 1:N         │             │ 1:N       │     └─────────────────┘
          └─────────────┼─────────────┘           │               │
                        │                         │               │ 1:N
                        │ N:1                     │ 1:N           ▼
            ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
            │  appointments   │         │ medical_records │         │  vaccinations   │
            │                 │         │                 │         │                 │
            │ • id (PK)       │         │ • id (PK)       │         │ • id (PK)       │
            │ • clinic_id (FK)│         │ • clinic_id (FK)│         │ • clinic_id (FK)│
            │ • client_id (FK)│         │ • pet_id (FK)   │         │ • pet_id (FK)   │
            │ • pet_id (FK)   │         │ • vet_id (FK)   │         │ • vaccine_name  │
            │ • vet_id (FK)   │         │ • visit_date    │         │ • date_given    │
            │ • start_time    │         │ • subjective    │         │ • next_due_date │
            │ • end_time      │         │ • objective     │         │ • lot_number    │
            │ • status        │         │ • assessment    │         │ • created_at    │
            │ • type          │         │ • plan          │         │ • updated_at    │
            │ • priority      │         │ • vitals (JSON) │         └─────────────────┘
            │ • notes         │         │ • created_at    │
            │ • created_at    │         │ • updated_at    │                   │
            │ • updated_at    │         └─────────────────┘                   │ 1:N
            └─────────────────┘                   │                           ▼
                      │                           │ 1:N             ┌─────────────────┐
                      │ 1:N                       ▼                 │   lab_results   │
                      ▼                 ┌─────────────────┐         │                 │
            ┌─────────────────┐         │   diagnoses     │         │ • id (PK)       │
            │ apt_reminders   │         │                 │         │ • clinic_id (FK)│
            │                 │         │ • id (PK)       │         │ • pet_id (FK)   │
            │ • id (PK)       │         │ • clinic_id (FK)│         │ • test_name     │
            │ • clinic_id (FK)│         │ • record_id (FK)│         │ • result_value  │
            │ • apt_id (FK)   │         │ • diagnosis_code│         │ • reference_range│
            │ • type          │         │ • description   │         │ • status        │
            │ • send_at       │         │ • created_at    │         │ • test_date     │
            │ • status        │         │ • updated_at    │         │ • created_at    │
            │ • sent_at       │         └─────────────────┘         │ • updated_at    │
            │ • created_at    │                                     └─────────────────┘
            │ • updated_at    │
            └─────────────────┘                           ┌─────────────────┐
                                                          │   audit_logs    │
                                                          │                 │
                                                          │ • id (PK)       │
                                                          │ • clinic_id (FK)│
                                                          │ • user_id (FK)  │
                                                          │ • entity_type   │
                                                          │ • entity_id     │
                                                          │ • action        │
                                                          │ • old_values    │
                                                          │ • new_values    │
                                                          │ • ip_address    │
                                                          │ • user_agent    │
                                                          │ • created_at    │
                                                          └─────────────────┘
```

## Multi-Tenancy Strategy

### Shared Database, Shared Schema Pattern

**Design Principles:**
- Single database instance for all tenants
- `clinic_id` as discriminator column in all tenant-specific tables
- Row-level security (RLS) for automatic tenant isolation
- Query interceptors for additional security layer

**Benefits:**
- Cost-effective for MVP with 10 clinics
- Easier maintenance and updates
- Shared resources optimization
- Centralized backup and monitoring

**Security Measures:**
- Automatic `clinic_id` injection in all queries
- Database views with built-in tenant filtering
- Audit logging for all data access
- Encrypted PHI fields

## Table Specifications

### Core Tenant Tables

#### organizations
```sql
CREATE TABLE organizations (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  subscription_tier ENUM('starter', 'professional', 'enterprise') DEFAULT 'starter',
  max_clinics INT DEFAULT 1,
  max_users_per_clinic INT DEFAULT 10,
  settings JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_org_created (created_at),
  INDEX idx_org_subscription (subscription_tier)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### clinics
```sql
CREATE TABLE clinics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  organization_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'US',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  working_hours JSON DEFAULT NULL,
  settings JSON DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  INDEX idx_clinic_org (organization_id),
  INDEX idx_clinic_active (is_active),
  INDEX idx_clinic_name (name)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### User Management

#### users
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'veterinarian', 'technician', 'receptionist') NOT NULL,
  phone VARCHAR(20),
  license_number VARCHAR(100),
  mfa_secret VARCHAR(32),
  mfa_backup_codes JSON DEFAULT NULL,
  last_login TIMESTAMP NULL,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  INDEX idx_user_clinic (clinic_id),
  INDEX idx_user_email (email),
  INDEX idx_user_role (role),
  INDEX idx_user_active (is_active)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Client and Pet Management

#### clients
```sql
CREATE TABLE clients (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  mobile VARCHAR(20),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  communication_preferences JSON DEFAULT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  INDEX idx_client_clinic (clinic_id),
  INDEX idx_client_name (first_name, last_name),
  INDEX idx_client_email (email),
  INDEX idx_client_phone (phone),
  INDEX idx_client_active (is_active)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### pets
```sql
CREATE TABLE pets (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  client_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  species ENUM('dog', 'cat', 'bird', 'reptile', 'rabbit', 'horse', 'other') NOT NULL,
  breed VARCHAR(100),
  color VARCHAR(100),
  sex ENUM('male', 'female', 'unknown') NOT NULL,
  birth_date DATE,
  weight DECIMAL(8,2),
  microchip_id VARCHAR(50),
  tattoo VARCHAR(50),
  insurance_provider VARCHAR(100),
  insurance_policy VARCHAR(100),
  special_instructions TEXT,
  allergies TEXT,
  is_deceased BOOLEAN DEFAULT FALSE,
  deceased_date DATE NULL,
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_pet_clinic_client (clinic_id, client_id),
  INDEX idx_pet_name (name),
  INDEX idx_pet_species (species),
  INDEX idx_pet_microchip (microchip_id),
  INDEX idx_pet_active (is_deceased)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Medical Records

#### medical_records (SOAP Notes)
```sql
CREATE TABLE medical_records (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  pet_id VARCHAR(36) NOT NULL,
  veterinarian_id VARCHAR(36) NOT NULL,
  visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  chief_complaint TEXT,
  subjective TEXT, -- Encrypted
  objective TEXT, -- Encrypted
  assessment TEXT, -- Encrypted
  plan TEXT, -- Encrypted
  vitals JSON DEFAULT NULL,
  temperature DECIMAL(4,1),
  heart_rate INT,
  respiratory_rate INT,
  weight DECIMAL(8,2),
  body_condition_score TINYINT,
  visit_type ENUM('wellness', 'sick', 'surgery', 'emergency', 'follow_up') DEFAULT 'wellness',
  follow_up_date DATE NULL,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  FOREIGN KEY (veterinarian_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_record_clinic_date (clinic_id, visit_date DESC),
  INDEX idx_record_pet_date (pet_id, visit_date DESC),
  INDEX idx_record_vet (veterinarian_id),
  INDEX idx_record_type (visit_type)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### diagnoses
```sql
CREATE TABLE diagnoses (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  medical_record_id VARCHAR(36) NOT NULL,
  diagnosis_code VARCHAR(20), -- ICD-10 or custom codes
  description TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'resolved', 'chronic') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
  INDEX idx_diagnosis_clinic (clinic_id),
  INDEX idx_diagnosis_record (medical_record_id),
  INDEX idx_diagnosis_code (diagnosis_code)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Appointments

#### appointments
```sql
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  client_id VARCHAR(36) NOT NULL,
  pet_id VARCHAR(36) NOT NULL,
  veterinarian_id VARCHAR(36) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status ENUM('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  type ENUM('wellness', 'sick', 'surgery', 'emergency', 'follow_up', 'consultation') NOT NULL,
  priority ENUM('routine', 'urgent', 'emergency') DEFAULT 'routine',
  reason TEXT,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  FOREIGN KEY (veterinarian_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_apt_clinic_date (clinic_id, start_time),
  INDEX idx_apt_vet_date (veterinarian_id, start_time),
  INDEX idx_apt_status (status),
  INDEX idx_apt_type (type),
  INDEX idx_apt_priority (priority)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### appointment_reminders
```sql
CREATE TABLE appointment_reminders (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  appointment_id VARCHAR(36) NOT NULL,
  type ENUM('email', 'sms', 'call') NOT NULL,
  send_at TIMESTAMP NOT NULL,
  status ENUM('pending', 'sent', 'failed', 'cancelled') DEFAULT 'pending',
  sent_at TIMESTAMP NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  INDEX idx_reminder_clinic (clinic_id),
  INDEX idx_reminder_apt (appointment_id),
  INDEX idx_reminder_send_at (send_at),
  INDEX idx_reminder_status (status)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Vaccinations and Lab Results

#### vaccinations
```sql
CREATE TABLE vaccinations (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  pet_id VARCHAR(36) NOT NULL,
  vaccine_name VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100),
  lot_number VARCHAR(50),
  date_given DATE NOT NULL,
  next_due_date DATE NOT NULL,
  administered_by VARCHAR(36) NOT NULL,
  route ENUM('subcutaneous', 'intramuscular', 'intranasal', 'oral') DEFAULT 'subcutaneous',
  site VARCHAR(100),
  volume_ml DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  FOREIGN KEY (administered_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_vaccination_clinic_pet (clinic_id, pet_id),
  INDEX idx_vaccination_due_date (next_due_date),
  INDEX idx_vaccination_vaccine (vaccine_name)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### lab_results
```sql
CREATE TABLE lab_results (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  pet_id VARCHAR(36) NOT NULL,
  test_name VARCHAR(200) NOT NULL,
  test_code VARCHAR(50),
  result_value VARCHAR(500),
  reference_range VARCHAR(200),
  unit VARCHAR(50),
  status ENUM('normal', 'abnormal', 'critical', 'pending') DEFAULT 'pending',
  test_date DATE NOT NULL,
  received_date DATE,
  lab_provider VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  INDEX idx_lab_clinic_pet (clinic_id, pet_id),
  INDEX idx_lab_test_date (test_date DESC),
  INDEX idx_lab_status (status),
  INDEX idx_lab_test_name (test_name)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Audit and Compliance

#### audit_logs
```sql
CREATE TABLE audit_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  clinic_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36),
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(36) NOT NULL,
  action ENUM('create', 'read', 'update', 'delete', 'login', 'logout') NOT NULL,
  old_values JSON DEFAULT NULL,
  new_values JSON DEFAULT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_clinic_date (clinic_id, created_at DESC),
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_action (action)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Indexing Strategy

### Primary Indexes (Performance Critical)
- `clinic_id` + `date` composite indexes for time-based queries
- `clinic_id` + `foreign_key` for tenant isolation
- Full-text search indexes on searchable text fields

### Secondary Indexes (Query Optimization)
- Status fields for filtering
- Name fields for searching
- Date fields for chronological queries

### Composite Indexes
- Multi-column indexes for common query patterns
- Cover indexes for read-heavy operations

## Data Retention Policies

### HIPAA Compliance (7 Years)
- Medical records: 7 years after last visit
- Audit logs: 7 years retention
- Appointment history: 7 years

### Operational Data
- User sessions: 30 days
- Temporary tokens: 24 hours
- Cache data: Variable (1 hour - 30 days)

### Automated Cleanup
- Scheduled jobs for expired data removal
- Archiving strategy for compliance
- Soft deletes for critical records

## Security Considerations

### Data Encryption
- PHI fields encrypted at application level
- Database encryption at rest
- TLS encryption in transit

### Access Controls
- Row-level security with clinic_id
- Role-based permissions
- Audit logging for all PHI access

### Multi-Tenant Isolation
- Automatic clinic_id injection
- Query interceptors
- Database connection context
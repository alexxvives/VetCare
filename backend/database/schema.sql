-- VetCare MVP Database Schema
-- Simple 4-table setup for veterinary clinic management
-- Run this file to create the database from scratch

-- =============================================================================
-- 1. USERS TABLE - All user types in one table
-- =============================================================================
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    
    -- Role-based access
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'clinic_admin', 'veterinarian', 'client')),
    
    -- Profile info
    address TEXT,
    date_of_birth DATE,
    
    -- Vet-specific fields (only used if role = 'veterinarian')
    license_number TEXT,
    specialization TEXT,
    years_experience INTEGER,
    
    -- Client-specific fields (only used if role = 'client')
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    -- Account status
    is_active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    
    -- Login tracking
    last_login_at DATETIME,
    last_login_ip TEXT,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. CLINICS TABLE - Single clinic info
-- =============================================================================
CREATE TABLE clinics (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'US',
    timezone TEXT DEFAULT 'America/New_York',
    
    -- Business info
    business_hours TEXT, -- JSON string
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. PETS TABLE - Animals belonging to clients
-- =============================================================================
CREATE TABLE pets (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species TEXT NOT NULL, -- Dog, Cat, Bird, etc.
    breed TEXT,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'unknown')),
    color TEXT,
    date_of_birth DATE,
    weight_kg REAL,
    
    -- Medical info
    microchip_number TEXT,
    spayed_neutered BOOLEAN DEFAULT 0,
    allergies TEXT,
    medical_notes TEXT,
    photo_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT 1,
    is_deceased BOOLEAN DEFAULT 0,
    deceased_date DATE,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4. APPOINTMENTS TABLE - Bookings between pets and vets
-- =============================================================================
CREATE TABLE appointments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    veterinarian_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Appointment timing
    scheduled_start DATETIME NOT NULL,
    scheduled_end DATETIME NOT NULL,
    actual_start DATETIME,
    actual_end DATETIME,
    
    -- Appointment details
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show')),
    type TEXT NOT NULL CHECK (type IN ('wellness', 'sick_visit', 'surgery', 'emergency', 'follow_up', 'consultation')),
    priority TEXT DEFAULT 'routine' CHECK (priority IN ('routine', 'urgent', 'emergency')),
    
    -- Notes and details
    reason TEXT,
    client_notes TEXT,
    vet_notes TEXT,
    estimated_cost REAL,
    actual_cost REAL,
    
    -- Tracking
    created_by TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reminder_sent BOOLEAN DEFAULT 0,
    reminder_sent_at DATETIME,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Pets indexes
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_active ON pets(is_active);

-- Appointments indexes
CREATE INDEX idx_appointments_pet ON appointments(pet_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_vet ON appointments(veterinarian_id);
CREATE INDEX idx_appointments_date ON appointments(scheduled_start);
CREATE INDEX idx_appointments_status ON appointments(status);
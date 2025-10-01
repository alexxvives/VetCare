# VetCare Basic Database Schema

## 🎯 **Core Entities Overview**

This simplified schema focuses on the essential tables needed for a veterinary booking platform:

1. **users** - All system users (super admin, clinic admin, vets, clients)
2. **clinics** - Veterinary clinic locations  
3. **pets** - Animal patients
4. **appointments** - Booking/scheduling system

---

## 🏗️ **Basic Schema Design**

### **1. Users Table (Universal)**
```sql
-- All users in the system (admins, vets, clients)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    
    -- Role-based access
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'super_admin',      -- Platform administrator
        'clinic_admin',     -- Clinic owner/manager
        'veterinarian',     -- Licensed vet
        'client'            -- Pet owner
    )),
    
    -- Profile info
    profile_picture_url VARCHAR(500),
    date_of_birth DATE,
    address TEXT,
    
    -- Account status
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Security
    last_login_at TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
```

### **2. Clinics Table**
```sql
-- Veterinary clinic locations
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    
    -- Settings
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Business hours (JSON format for flexibility)
    business_hours JSONB DEFAULT '{
        "monday": {"open": "08:00", "close": "18:00"},
        "tuesday": {"open": "08:00", "close": "18:00"},
        "wednesday": {"open": "08:00", "close": "18:00"},
        "thursday": {"open": "08:00", "close": "18:00"},
        "friday": {"open": "08:00", "close": "18:00"},
        "saturday": {"open": "09:00", "close": "15:00"},
        "sunday": {"closed": true}
    }',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clinics_name ON clinics(name);
CREATE INDEX idx_clinics_active ON clinics(is_active);
```

### **3. User-Clinic Relationships**
```sql
-- Many-to-many relationship between users and clinics
CREATE TABLE user_clinic_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    
    -- Role at this specific clinic (can be different from global role)
    clinic_role VARCHAR(50) NOT NULL CHECK (clinic_role IN (
        'admin',           -- Clinic administrator
        'veterinarian',    -- Practicing vet
        'client'           -- Pet owner/customer
    )),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Unique constraint - one role per user per clinic
    UNIQUE(user_id, clinic_id)
);

-- Indexes
CREATE INDEX idx_user_clinic_user ON user_clinic_access(user_id);
CREATE INDEX idx_user_clinic_clinic ON user_clinic_access(clinic_id);
CREATE INDEX idx_user_clinic_role ON user_clinic_access(clinic_role);
```

### **4. Pets Table**
```sql
-- Animal patients
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    
    -- Basic info
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL, -- 'dog', 'cat', 'bird', etc.
    breed VARCHAR(100),
    color VARCHAR(100),
    
    -- Physical details
    sex VARCHAR(20) CHECK (sex IN ('male', 'female', 'unknown')),
    date_of_birth DATE,
    weight_kg DECIMAL(8,2),
    microchip_id VARCHAR(50),
    
    -- Medical info
    allergies TEXT,
    medical_notes TEXT,
    special_instructions TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_deceased BOOLEAN DEFAULT FALSE,
    deceased_date DATE,
    
    -- Media
    profile_picture_url VARCHAR(500),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_pets_clinic ON pets(clinic_id);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_active ON pets(is_active);
CREATE INDEX idx_pets_microchip ON pets(microchip_id);
```

### **5. Appointments Table**
```sql
-- Booking and scheduling system
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    veterinarian_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Scheduling
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    
    -- Appointment details
    appointment_type VARCHAR(100) NOT NULL DEFAULT 'checkup', -- 'checkup', 'vaccination', 'surgery', etc.
    reason TEXT,
    symptoms TEXT,
    special_requests TEXT,
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled',        -- Initial booking
        'confirmed',        -- Clinic confirmed
        'in_progress',      -- Currently happening
        'completed',        -- Finished successfully
        'cancelled',        -- Cancelled by client/clinic
        'no_show'          -- Client didn't show up
    )),
    
    -- Booking info
    booked_by_client BOOLEAN DEFAULT FALSE,
    booking_method VARCHAR(50) DEFAULT 'online', -- 'online', 'phone', 'walk_in'
    
    -- Pricing
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    
    -- Notes
    client_notes TEXT,
    vet_notes TEXT,
    internal_notes TEXT,
    
    -- Cancellation
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Critical indexes for booking queries
CREATE INDEX idx_appointments_clinic_date ON appointments(clinic_id, appointment_date);
CREATE INDEX idx_appointments_vet_date ON appointments(veterinarian_id, appointment_date);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_pet ON appointments(pet_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, start_time);

-- Unique constraint to prevent double-booking
CREATE UNIQUE INDEX idx_appointments_vet_time 
ON appointments(veterinarian_id, appointment_date, start_time) 
WHERE status NOT IN ('cancelled', 'no_show');
```

---

## 🔍 **Key Design Decisions**

### **1. Unified Users Table**
- Single table for all user types (admins, vets, clients)
- Role-based access control through `role` field
- Flexible relationship with clinics via junction table

### **2. Multi-Clinic Support**
- Users can be associated with multiple clinics
- Each user-clinic relationship has its own role
- Super admins have global access

### **3. Simple Appointment System**
- Date + time-based scheduling
- Flexible appointment types
- Status tracking for booking flow
- Prevents double-booking with unique constraints

### **4. Scalable Design**
- UUID primary keys for distributed systems
- JSON fields for flexible configuration
- Proper indexing for performance
- Foreign key constraints for data integrity

---

## 📊 **Sample Data Flow**

### **Client Books Appointment:**
1. Client logs in with `role='client'`
2. Selects their pet from `pets` table
3. Views available vet time slots
4. Creates appointment with `status='scheduled'`
5. Clinic admin confirms → `status='confirmed'`

### **Vet Sets Availability:**
1. Vet logs in with `role='veterinarian'`
2. System queries available time slots
3. Blocks/unblocks time periods
4. Clients see real-time availability

---

## 🚀 **Next Steps for Expansion**

When ready to add more features:
1. **Medical Records** table
2. **Vaccinations** tracking
3. **Billing/Payments** system
4. **Notifications** queue
5. **File Uploads** for documents/images

This basic schema provides a solid foundation that can grow with your platform's needs!
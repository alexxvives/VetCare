# Customer Booking Platform - Database Schema Design

## 🎯 **Core Requirements Analysis**

### **Customer-Facing Features:**
- ✅ Book appointments online
- ✅ View pet medical history
- ✅ Manage multiple pets
- ✅ Reschedule/cancel appointments
- ✅ Receive notifications
- ✅ View vet availability in real-time

### **Vet-Facing Features:**
- ✅ Set availability schedules
- ✅ Automatic schedule optimization
- ✅ Block/unblock time slots
- ✅ Handle emergencies
- ✅ View daily/weekly schedules

---

## 🏗️ **Enhanced Database Schema**

### **1. Customer Authentication & Profile Management**

```sql
-- Enhanced clients table for customer portal access
CREATE TABLE client_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verification_code VARCHAR(6),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{
        "email_reminders": true,
        "sms_reminders": true,
        "appointment_confirmations": true,
        "medical_updates": true
    }',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Client portal sessions for security
CREATE TABLE client_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Veterinarian Availability Management**

```sql
-- Vet base schedules (recurring weekly patterns)
CREATE TABLE vet_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    veterinarian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE NOT NULL,
    effective_until DATE, -- NULL for indefinite
    appointment_duration_minutes INTEGER DEFAULT 30,
    buffer_time_minutes INTEGER DEFAULT 10, -- Time between appointments
    max_appointments_per_slot INTEGER DEFAULT 1,
    break_times JSONB DEFAULT '[]', -- Array of {start, end, description}
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(veterinarian_id, day_of_week, start_time, effective_from)
);

-- Specific availability overrides (holidays, sick days, etc.)
CREATE TABLE vet_availability_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    veterinarian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    override_date DATE NOT NULL,
    override_type VARCHAR(50) NOT NULL, -- 'unavailable', 'custom_hours', 'emergency_only'
    start_time TIME,
    end_time TIME,
    reason VARCHAR(255),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB, -- For recurring overrides like monthly meetings
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(veterinarian_id, override_date)
);

-- Time slots generated from schedules for efficient booking
CREATE TABLE available_time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    veterinarian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    max_appointments INTEGER DEFAULT 1,
    current_appointments INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    appointment_types JSONB DEFAULT '["routine", "checkup", "consultation"]',
    booking_cutoff_hours INTEGER DEFAULT 24, -- How far in advance can be booked
    generated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(veterinarian_id, slot_date, start_time)
);

-- Index for fast availability queries
CREATE INDEX idx_available_slots_search 
ON available_time_slots(clinic_id, slot_date, is_available, veterinarian_id);
```

### **3. Enhanced Appointment System**

```sql
-- Appointment types with booking rules
CREATE TABLE appointment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    buffer_time_minutes INTEGER DEFAULT 10,
    base_price DECIMAL(10,2),
    color_code VARCHAR(7), -- Hex color for calendar display
    requires_approval BOOLEAN DEFAULT FALSE,
    advance_booking_days INTEGER DEFAULT 30, -- Max days in advance
    min_advance_hours INTEGER DEFAULT 24, -- Min hours in advance
    cancellation_cutoff_hours INTEGER DEFAULT 24,
    is_active BOOLEAN DEFAULT TRUE,
    veterinarian_roles JSONB DEFAULT '["veterinarian"]', -- Which roles can handle
    booking_form_fields JSONB DEFAULT '[]', -- Custom fields for this type
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced appointments with customer booking features
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    appointment_type_id UUID REFERENCES appointment_types(id),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    veterinarian_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Scheduling
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    
    -- Booking details
    booking_method VARCHAR(50) DEFAULT 'online', -- 'online', 'phone', 'walk_in', 'admin'
    booked_by_client BOOLEAN DEFAULT FALSE,
    booking_reference VARCHAR(20) UNIQUE,
    
    -- Status management
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Customer booked, needs confirmation
        'confirmed',    -- Clinic confirmed
        'reminded',     -- Reminder sent
        'checked_in',   -- Customer arrived
        'in_progress',  -- Currently being seen
        'completed',    -- Visit finished
        'cancelled',    -- Cancelled by customer/clinic
        'no_show',      -- Customer didn't arrive
        'rescheduled'   -- Moved to different time
    )),
    
    -- Details
    reason TEXT,
    symptoms TEXT,
    special_requests TEXT,
    customer_notes TEXT,
    internal_notes TEXT,
    
    -- Pricing
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    
    -- Cancellation/Rescheduling
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,
    reschedule_count INTEGER DEFAULT 0,
    previous_appointment_id UUID REFERENCES appointments(id),
    
    -- Reminders & Notifications
    reminder_sent_at TIMESTAMP,
    confirmation_sent_at TIMESTAMP,
    follow_up_sent_at TIMESTAMP,
    
    -- Recurring appointments
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB,
    parent_series_id UUID REFERENCES appointments(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointment booking form submissions
CREATE TABLE appointment_form_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_value TEXT,
    field_type VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **4. Customer Notification System**

```sql
-- Notification templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    template_type VARCHAR(50) NOT NULL, -- 'booking_confirmation', 'reminder', 'cancellation'
    channel VARCHAR(20) NOT NULL, -- 'email', 'sms', 'push'
    subject VARCHAR(255),
    body_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]', -- Available template variables
    is_active BOOLEAN DEFAULT TRUE,
    send_timing_minutes INTEGER, -- When to send (e.g., -1440 for 24h before)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification queue
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
    
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    
    subject VARCHAR(255),
    message TEXT NOT NULL,
    
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
    scheduled_for TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    error_message TEXT,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **5. Booking History & Analytics**

```sql
-- Track booking patterns for optimization
CREATE TABLE booking_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hour_of_day INTEGER CHECK (hour_of_day BETWEEN 0 AND 23),
    
    -- Metrics
    total_bookings INTEGER DEFAULT 0,
    successful_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    no_show_count INTEGER DEFAULT 0,
    
    -- Popular appointment types
    appointment_type_stats JSONB DEFAULT '{}',
    
    -- Average booking lead time
    avg_booking_lead_hours DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(clinic_id, date, hour_of_day)
);

-- Client booking preferences learned from history
CREATE TABLE client_booking_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Learned preferences
    preferred_times JSONB DEFAULT '[]', -- Array of preferred time ranges
    preferred_days JSONB DEFAULT '[]', -- Array of preferred days of week
    preferred_veterinarians JSONB DEFAULT '[]',
    preferred_appointment_types JSONB DEFAULT '[]',
    
    -- Behavioral patterns
    typical_booking_lead_hours INTEGER,
    cancellation_rate DECIMAL(5,2) DEFAULT 0,
    no_show_rate DECIMAL(5,2) DEFAULT 0,
    reschedule_frequency DECIMAL(5,2) DEFAULT 0,
    
    last_calculated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(client_id)
);
```

---

## 🔍 **Key Database Design Decisions**

### **1. Time Slot Pre-Generation Strategy**
```sql
-- Automatically generate time slots for efficient booking queries
CREATE OR REPLACE FUNCTION generate_time_slots_for_week(
    p_clinic_id UUID,
    p_start_date DATE
) RETURNS VOID AS $$
DECLARE
    schedule_record RECORD;
    slot_start TIME;
    slot_end TIME;
    current_date DATE;
BEGIN
    -- Loop through each day of the week
    FOR i IN 0..6 LOOP
        current_date := p_start_date + i;
        
        -- Get vet schedules for this day of week
        FOR schedule_record IN 
            SELECT vs.*, u.id as vet_id
            FROM vet_schedules vs
            JOIN users u ON u.id = vs.veterinarian_id
            WHERE vs.clinic_id = p_clinic_id
            AND vs.day_of_week = EXTRACT(DOW FROM current_date)
            AND vs.is_active = TRUE
            AND (vs.effective_until IS NULL OR current_date <= vs.effective_until)
            AND current_date >= vs.effective_from
        LOOP
            -- Generate slots for this vet's schedule
            slot_start := schedule_record.start_time;
            
            WHILE slot_start < schedule_record.end_time LOOP
                slot_end := slot_start + (schedule_record.appointment_duration_minutes || ' minutes')::INTERVAL;
                
                -- Insert time slot if it doesn't exist
                INSERT INTO available_time_slots (
                    clinic_id, veterinarian_id, slot_date, start_time, end_time,
                    duration_minutes, max_appointments
                ) VALUES (
                    p_clinic_id, schedule_record.vet_id, current_date,
                    slot_start, slot_end::TIME,
                    schedule_record.appointment_duration_minutes,
                    schedule_record.max_appointments_per_slot
                ) ON CONFLICT (veterinarian_id, slot_date, start_time) DO NOTHING;
                
                -- Move to next slot
                slot_start := slot_end::TIME + (schedule_record.buffer_time_minutes || ' minutes')::INTERVAL;
            END LOOP;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### **2. Real-Time Availability Checking**
```sql
-- Optimized query for customer booking interface
CREATE VIEW customer_available_slots AS
SELECT 
    ats.id,
    ats.clinic_id,
    ats.veterinarian_id,
    u.first_name || ' ' || u.last_name as vet_name,
    ats.slot_date,
    ats.start_time,
    ats.end_time,
    ats.duration_minutes,
    (ats.max_appointments - ats.current_appointments) as available_spots,
    at.name as appointment_types_available
FROM available_time_slots ats
JOIN users u ON u.id = ats.veterinarian_id
LEFT JOIN appointment_types at ON at.clinic_id = ats.clinic_id
WHERE ats.is_available = TRUE
AND ats.current_appointments < ats.max_appointments
AND ats.slot_date >= CURRENT_DATE
AND (ats.slot_date > CURRENT_DATE OR ats.start_time > CURRENT_TIME);
```

### **3. Indexes for Performance**
```sql
-- Critical indexes for booking queries
CREATE INDEX idx_time_slots_availability ON available_time_slots 
    (clinic_id, slot_date, is_available) 
    WHERE is_available = TRUE;

CREATE INDEX idx_appointments_scheduling ON appointments 
    (clinic_id, scheduled_start, status);

CREATE INDEX idx_vet_schedules_lookup ON vet_schedules 
    (clinic_id, veterinarian_id, day_of_week, is_active);

CREATE INDEX idx_client_appointments ON appointments 
    (client_id, scheduled_start DESC);
```

---

## 📱 **Customer Portal API Endpoints**

### **Booking Flow:**
1. `GET /api/customer/clinics/{clinicId}/availability?date=2025-10-01&duration=30`
2. `POST /api/customer/appointments/book` - Create booking
3. `PUT /api/customer/appointments/{id}/reschedule` - Reschedule
4. `DELETE /api/customer/appointments/{id}` - Cancel

### **Customer Dashboard:**
1. `GET /api/customer/pets` - List customer's pets
2. `GET /api/customer/appointments` - Upcoming/past appointments
3. `GET /api/customer/pets/{petId}/medical-history` - Pet medical records

---

## 🚀 **Implementation Priority**

### **Phase 1: Core Booking System**
1. ✅ Client accounts & authentication
2. ✅ Vet schedule management
3. ✅ Time slot generation
4. ✅ Basic appointment booking

### **Phase 2: Enhanced Features**
1. ✅ Notification system
2. ✅ Booking preferences
3. ✅ Analytics & optimization
4. ✅ Mobile app support

### **Phase 3: Advanced Features**
1. ✅ AI-powered schedule optimization
2. ✅ Automated reminder sequences
3. ✅ Waitlist management
4. ✅ Group appointments

This schema provides a solid foundation for a customer-facing booking platform while maintaining the existing clinic management functionality!
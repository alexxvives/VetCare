# Database Foreign Key Relationships

## Relationship Hierarchy

### Organization Level (Top Level)
```
organizations (1) ──────► clinics (N)
```

### Clinic Level (Tenant Boundary)
```
clinics (1) ──────► users (N)
clinics (1) ──────► clients (N)  
clinics (1) ──────► pets (N)
clinics (1) ──────► appointments (N)
clinics (1) ──────► medical_records (N)
clinics (1) ──────► vaccinations (N)
clinics (1) ──────► lab_results (N)
clinics (1) ──────► audit_logs (N)
```

### Client-Pet Relationships
```
clients (1) ──────► pets (N)
```

### Medical Relationships
```
pets (1) ──────► medical_records (N)
pets (1) ──────► vaccinations (N)
pets (1) ──────► lab_results (N)
pets (1) ──────► appointments (N)

medical_records (1) ──────► diagnoses (N)
```

### User Relationships
```
users (1) ──────► appointments (N) [as veterinarian]
users (1) ──────► medical_records (N) [as veterinarian]
users (1) ──────► vaccinations (N) [as administrator]
users (1) ──────► appointments (N) [as creator]
users (1) ──────► audit_logs (N) [as actor]
```

### Appointment Relationships
```
appointments (1) ──────► appointment_reminders (N)
```

## Detailed Foreign Key Constraints

### CASCADE Deletes (Data Hierarchy)
```sql
-- Organization deletion cascades to all clinics
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE

-- Clinic deletion cascades to all clinic data
FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
```

### RESTRICT Deletes (Preserve References)
```sql
-- Cannot delete users if they have appointments/records
FOREIGN KEY (veterinarian_id) REFERENCES users(id) ON DELETE RESTRICT
FOREIGN KEY (administered_by) REFERENCES users(id) ON DELETE RESTRICT
```

### SET NULL (Optional References)
```sql
-- User deletion nullifies audit log user reference
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
```

## Referential Integrity Rules

### Multi-Tenant Consistency
Every child record must belong to the same clinic as its parent:

```sql
-- Example: Pet must belong to same clinic as client
CONSTRAINT chk_pet_client_clinic 
CHECK (
  pet.clinic_id = (SELECT clinic_id FROM clients WHERE id = pet.client_id)
)
```

### Business Logic Constraints
```sql
-- Appointment end time must be after start time
CONSTRAINT chk_appointment_times 
CHECK (end_time > start_time)

-- Pet birth date cannot be in the future
CONSTRAINT chk_pet_birth_date 
CHECK (birth_date <= CURDATE())

-- Vaccination due date must be after given date
CONSTRAINT chk_vaccination_dates 
CHECK (next_due_date >= date_given)
```

## Relationship Validation Queries

### Orphaned Record Detection
```sql
-- Find pets without valid clients
SELECT p.* FROM pets p 
LEFT JOIN clients c ON p.client_id = c.id 
WHERE c.id IS NULL;

-- Find appointments with invalid pet references
SELECT a.* FROM appointments a 
LEFT JOIN pets p ON a.pet_id = p.id 
WHERE p.id IS NULL;
```

### Cross-Clinic Data Leakage Check
```sql
-- Ensure no cross-clinic references exist
SELECT 'appointments-pets' as issue, a.id, a.clinic_id, p.clinic_id
FROM appointments a 
JOIN pets p ON a.pet_id = p.id 
WHERE a.clinic_id != p.clinic_id

UNION ALL

SELECT 'appointments-clients' as issue, a.id, a.clinic_id, c.clinic_id
FROM appointments a 
JOIN clients c ON a.client_id = c.id 
WHERE a.clinic_id != c.clinic_id;
```

## Data Consistency Views

### Clinic Data Summary
```sql
CREATE VIEW clinic_data_summary AS
SELECT 
  c.id as clinic_id,
  c.name as clinic_name,
  COUNT(DISTINCT u.id) as user_count,
  COUNT(DISTINCT cl.id) as client_count,
  COUNT(DISTINCT p.id) as pet_count,
  COUNT(DISTINCT a.id) as appointment_count,
  COUNT(DISTINCT mr.id) as medical_record_count
FROM clinics c
LEFT JOIN users u ON c.id = u.clinic_id AND u.is_active = 1
LEFT JOIN clients cl ON c.id = cl.clinic_id AND cl.is_active = 1
LEFT JOIN pets p ON c.id = p.clinic_id AND p.is_deceased = 0
LEFT JOIN appointments a ON c.id = a.clinic_id
LEFT JOIN medical_records mr ON c.id = mr.clinic_id
GROUP BY c.id, c.name;
```

### Pet Medical History View
```sql
CREATE VIEW pet_medical_history AS
SELECT 
  p.id as pet_id,
  p.name as pet_name,
  c.first_name as owner_first_name,
  c.last_name as owner_last_name,
  mr.visit_date,
  mr.visit_type,
  mr.chief_complaint,
  u.first_name as vet_first_name,
  u.last_name as vet_last_name
FROM pets p
JOIN clients c ON p.client_id = c.id
LEFT JOIN medical_records mr ON p.id = mr.pet_id
LEFT JOIN users u ON mr.veterinarian_id = u.id
WHERE p.is_deceased = 0
ORDER BY p.id, mr.visit_date DESC;
```

## Performance Considerations

### Foreign Key Index Requirements
All foreign key columns automatically have indexes, but composite queries may need additional indexes:

```sql
-- Composite index for clinic + date queries
CREATE INDEX idx_medical_records_clinic_date ON medical_records(clinic_id, visit_date DESC);

-- Covering index for appointment searches
CREATE INDEX idx_appointments_search ON appointments(clinic_id, start_time, status, veterinarian_id);
```

### Query Optimization Tips
1. Always include `clinic_id` in WHERE clauses
2. Use composite indexes for multi-column filters
3. Consider partitioning for large tables (>1M records)
4. Use EXISTS instead of IN for subqueries

## Data Migration Considerations

### Order of Table Creation
1. `organizations` (independent)
2. `clinics` (depends on organizations)
3. `users` (depends on clinics)
4. `clients` (depends on clinics)
5. `pets` (depends on clinics, clients)
6. `appointments` (depends on clinics, clients, pets, users)
7. `medical_records` (depends on clinics, pets, users)
8. `diagnoses` (depends on clinics, medical_records)
9. `vaccinations` (depends on clinics, pets, users)
10. `lab_results` (depends on clinics, pets)
11. `appointment_reminders` (depends on clinics, appointments)
12. `audit_logs` (depends on clinics, users)

### Data Validation Scripts
```sql
-- Validate all foreign key relationships
SELECT 
  TABLE_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_SCHEMA = 'vetcare_dev' 
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```
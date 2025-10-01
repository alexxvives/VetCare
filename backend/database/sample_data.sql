-- VetCare MVP Sample Data
-- Insert test data for development and testing

-- =============================================================================
-- SAMPLE CLINICS
-- =============================================================================
INSERT INTO clinics (id, name, email, phone, address, city, state, postal_code, business_hours, description) VALUES
('clinic_001', 'VetCare Animal Hospital', 'info@vetcare-demo.com', '(555) 123-4567', '123 Main Street', 'Springfield', 'IL', '62701', 
 '{"monday": "8:00-18:00", "tuesday": "8:00-18:00", "wednesday": "8:00-18:00", "thursday": "8:00-18:00", "friday": "8:00-18:00", "saturday": "9:00-17:00", "sunday": "closed"}',
 'Full-service veterinary hospital providing comprehensive care for cats, dogs, and exotic pets.');

-- =============================================================================
-- SAMPLE USERS
-- =============================================================================

-- Super Admin (password: password)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, email_verified) VALUES
('user_super_001', 'superadmin@vetcare.com', '$2a$10$XVS83XrFGuTJmnKaX93/gOQFPWGikqq.TdIf2I9DG.BKbAa71J81W', 'Super', 'Admin', 'super_admin', 1, 1);

-- Clinic Admin (password: Admin123!)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified) VALUES
('user_admin_001', 'admin@vetcare-demo.com', '$2a$10$E4mGV7JrF6Kx1SZvE2aZzOpL3lLfJ6UfGh2EyKy.V8/9vKJ4.p0Pu', 'Sarah', 'Johnson', '(555) 123-4567', 'clinic_admin', 1, 1);

-- Veterinarians (password: Vet123!)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, license_number, specialization, years_experience, is_active, email_verified) VALUES
('user_vet_001', 'dr.smith@vetcare-demo.com', '$2a$10$F5nHW8KsG7Lz2TAqQ3bZeP4M6mMgK7VgIi3HzKz.W9/0wLK5.q1Rv', 'Michael', 'Smith', '(555) 234-5678', 'veterinarian', 'VET-IL-2019-001', 'Small Animal Medicine', 8, 1, 1),
('user_vet_002', 'dr.wilson@vetcare-demo.com', '$2a$10$G6oIX9LtH8M{3UBrR4cAhQ5N7nNhL8WgJj4IzLz.X0/1xML6.r2Sw', 'Emily', 'Wilson', '(555) 345-6789', 'veterinarian', 'VET-IL-2021-002', 'Emergency Medicine', 5, 1, 1);

-- Clients (password: Client123!)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, address, emergency_contact_name, emergency_contact_phone, is_active, email_verified) VALUES
('user_client_001', 'john.doe@email.com', '$2a$10$H7pJY0MuI9N{4VCsS5dBiR6O8oOiM9XhKk5JzMz.Y1/2yNM7.s3Tx', 'John', 'Doe', '(555) 456-7890', 'client', '456 Oak Avenue, Springfield, IL 62702', 'Jane Doe', '(555) 567-8901', 1, 1),
('user_client_002', 'mary.smith@email.com', '$2a$10$I8qKZ1NvJ0O{5WDtT6eCjS7P9pPjN0YiLl6KzNz.Z2/3zOM8.t4Uy', 'Mary', 'Smith', '(555) 678-9012', 'client', '789 Pine Street, Springfield, IL 62703', 'Bob Smith', '(555) 789-0123', 1, 1),
('user_client_003', 'bob.jones@email.com', '$2a$10$J9rLA2OwK1P{6XEuU7fDkT8Q0qQkO1ZjMm7LzOz.A3/4AON9.u5Vz', 'Bob', 'Jones', '(555) 890-1234', 'client', '321 Elm Drive, Springfield, IL 62704', 'Alice Jones', '(555) 901-2345', 1, 1);

-- =============================================================================
-- SAMPLE PETS
-- =============================================================================
INSERT INTO pets (id, owner_id, name, species, breed, gender, color, date_of_birth, weight_kg, microchip_number, spayed_neutered, allergies, medical_notes) VALUES
('pet_001', 'user_client_001', 'Buddy', 'Dog', 'Golden Retriever', 'male', 'Golden', '2020-03-15', 28.5, 'MC123456789012345', 1, 'None known', 'Friendly and energetic. Up to date on all vaccinations.'),
('pet_002', 'user_client_001', 'Luna', 'Cat', 'Maine Coon', 'female', 'Gray and White', '2019-07-22', 5.2, 'MC234567890123456', 1, 'Seafood', 'Indoor cat. Slightly overweight, needs diet management.'),
('pet_003', 'user_client_002', 'Max', 'Dog', 'German Shepherd', 'male', 'Black and Tan', '2018-11-08', 35.8, 'MC345678901234567', 1, 'None known', 'Well-trained working dog. Joint supplements recommended.'),
('pet_004', 'user_client_002', 'Whiskers', 'Cat', 'Siamese', 'female', 'Cream Point', '2021-01-30', 3.8, 'MC456789012345678', 1, 'Chicken', 'Young and playful. Requires special diet due to food allergies.'),
('pet_005', 'user_client_003', 'Rocky', 'Dog', 'Mixed Breed', 'male', 'Brown and White', '2017-05-12', 22.3, 'MC567890123456789', 1, 'Grass pollen', 'Rescue dog. Some anxiety issues, responds well to calm environments.');

-- =============================================================================
-- SAMPLE APPOINTMENTS
-- =============================================================================
INSERT INTO appointments (id, pet_id, client_id, veterinarian_id, scheduled_start, scheduled_end, status, type, priority, reason, client_notes, created_by) VALUES
('appt_001', 'pet_001', 'user_client_001', 'user_vet_001', '2024-01-15 09:00:00', '2024-01-15 09:30:00', 'completed', 'wellness', 'routine', 'Annual wellness exam and vaccinations', 'Buddy has been eating well and very active', 'user_admin_001'),
('appt_002', 'pet_002', 'user_client_001', 'user_vet_002', '2024-01-20 14:00:00', '2024-01-20 14:30:00', 'completed', 'sick_visit', 'urgent', 'Vomiting and lethargy for 2 days', 'Luna has been hiding and not eating much', 'user_client_001'),
('appt_003', 'pet_003', 'user_client_002', 'user_vet_001', '2024-01-25 10:30:00', '2024-01-25 11:00:00', 'scheduled', 'follow_up', 'routine', 'Follow-up for joint supplement response', 'Max seems to be moving better since starting supplements', 'user_admin_001'),
('appt_004', 'pet_004', 'user_client_002', 'user_vet_002', '2024-01-30 15:30:00', '2024-01-30 16:00:00', 'confirmed', 'wellness', 'routine', 'Kitten wellness check and second round of vaccinations', 'Whiskers is very playful and seems healthy', 'user_client_002');

-- =============================================================================
-- UPDATE TIMESTAMPS
-- =============================================================================
UPDATE users SET updated_at = CURRENT_TIMESTAMP;
UPDATE clinics SET updated_at = CURRENT_TIMESTAMP;
UPDATE pets SET updated_at = CURRENT_TIMESTAMP;
UPDATE appointments SET updated_at = CURRENT_TIMESTAMP;
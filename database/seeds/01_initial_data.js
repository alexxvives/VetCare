import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export const seed = async function(knex) {
  // Deletes ALL existing entries (in reverse order due to foreign keys)
  await knex('audit_logs').del();
  await knex('lab_results').del();
  await knex('vaccinations').del();
  await knex('appointments').del();
  await knex('medical_records').del();
  await knex('pets').del();
  await knex('clients').del();
  await knex('users').del();
  await knex('clinics').del();
  await knex('organizations').del();

  // Insert seed data
  
  // Organizations
  const orgId1 = uuidv4();
  const orgId2 = uuidv4();
  
  await knex('organizations').insert([
    {
      id: orgId1,
      name: 'VetCare Solutions',
      description: 'Multi-location veterinary practice group',
      address: '123 Main St, Anytown, USA',
      phone: '+1-555-0100',
      email: 'info@vetcaresolutions.com',
      website: 'https://vetcaresolutions.com',
      status: 'active',
      settings: JSON.stringify({
        timezone: 'America/New_York',
        currency: 'USD',
        features: ['telemedicine', 'inventory', 'billing']
      })
    },
    {
      id: orgId2,
      name: 'Pet Health Network',
      description: 'Independent veterinary clinics network',
      address: '456 Oak Ave, Another City, USA',
      phone: '+1-555-0200',
      email: 'contact@pethealthnetwork.com',
      website: 'https://pethealthnetwork.com',
      status: 'active',
      settings: JSON.stringify({
        timezone: 'America/Los_Angeles',
        currency: 'USD',
        features: ['basic']
      })
    }
  ]);

  // Clinics
  const clinicId1 = uuidv4();
  const clinicId2 = uuidv4();
  const clinicId3 = uuidv4();
  
  await knex('clinics').insert([
    {
      id: clinicId1,
      organization_id: orgId1,
      name: 'Downtown Animal Hospital',
      description: 'Full-service veterinary hospital in downtown area',
      address: '789 City Center, Downtown, USA',
      phone: '+1-555-0101',
      email: 'downtown@vetcaresolutions.com',
      status: 'active',
      working_hours: JSON.stringify({
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '15:00' },
        sunday: { closed: true }
      }),
      timezone: 'America/New_York'
    },
    {
      id: clinicId2,
      organization_id: orgId1,
      name: 'Suburban Pet Clinic',
      description: 'Family-friendly pet clinic in suburban location',
      address: '321 Maple Street, Suburb, USA',
      phone: '+1-555-0102',
      email: 'suburban@vetcaresolutions.com',
      status: 'active',
      working_hours: JSON.stringify({
        monday: { open: '09:00', close: '17:00' },
        tuesday: { open: '09:00', close: '17:00' },
        wednesday: { open: '09:00', close: '17:00' },
        thursday: { open: '09:00', close: '17:00' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { open: '09:00', close: '13:00' },
        sunday: { closed: true }
      }),
      timezone: 'America/New_York'
    },
    {
      id: clinicId3,
      organization_id: orgId2,
      name: 'West Coast Animal Care',
      description: 'Modern veterinary facility on the west coast',
      address: '654 Pacific Blvd, Coastal City, CA',
      phone: '+1-555-0201',
      email: 'westcoast@pethealthnetwork.com',
      status: 'active',
      working_hours: JSON.stringify({
        monday: { open: '07:00', close: '19:00' },
        tuesday: { open: '07:00', close: '19:00' },
        wednesday: { open: '07:00', close: '19:00' },
        thursday: { open: '07:00', close: '19:00' },
        friday: { open: '07:00', close: '19:00' },
        saturday: { open: '08:00', close: '16:00' },
        sunday: { open: '10:00', close: '14:00' }
      }),
      timezone: 'America/Los_Angeles'
    }
  ]);

  // Users
  const userId1 = uuidv4(); // Super Admin
  const userId2 = uuidv4(); // Organization Admin
  const userId3 = uuidv4(); // Veterinarian
  const userId4 = uuidv4(); // Technician
  const userId5 = uuidv4(); // Receptionist
  
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  await knex('users').insert([
    {
      id: userId1,
      organization_id: orgId1,
      email: 'admin@vetcaresolutions.com',
      password_hash: hashedPassword,
      first_name: 'System',
      last_name: 'Administrator',
      phone: '+1-555-0110',
      role: 'super_admin',
      status: 'active',
      permissions: JSON.stringify(['*']),
      clinic_access: JSON.stringify([clinicId1, clinicId2]),
      mfa_enabled: false
    },
    {
      id: userId2,
      organization_id: orgId1,
      email: 'orgadmin@vetcaresolutions.com',
      password_hash: hashedPassword,
      first_name: 'Sarah',
      last_name: 'Johnson',
      phone: '+1-555-0111',
      role: 'organization_admin',
      status: 'active',
      permissions: JSON.stringify(['manage_clinics', 'manage_users', 'view_reports']),
      clinic_access: JSON.stringify([clinicId1, clinicId2]),
      mfa_enabled: false
    },
    {
      id: userId3,
      organization_id: orgId1,
      email: 'dr.smith@vetcaresolutions.com',
      password_hash: hashedPassword,
      first_name: 'Michael',
      last_name: 'Smith',
      phone: '+1-555-0112',
      role: 'veterinarian',
      status: 'active',
      permissions: JSON.stringify(['manage_medical_records', 'manage_appointments', 'prescribe_medications']),
      clinic_access: JSON.stringify([clinicId1]),
      mfa_enabled: false
    },
    {
      id: userId4,
      organization_id: orgId1,
      email: 'jane.tech@vetcaresolutions.com',
      password_hash: hashedPassword,
      first_name: 'Jane',
      last_name: 'Williams',
      phone: '+1-555-0113',
      role: 'technician',
      status: 'active',
      permissions: JSON.stringify(['view_medical_records', 'manage_appointments', 'record_vitals']),
      clinic_access: JSON.stringify([clinicId1]),
      mfa_enabled: false
    },
    {
      id: userId5,
      organization_id: orgId1,
      email: 'receptionist@vetcaresolutions.com',
      password_hash: hashedPassword,
      first_name: 'Emily',
      last_name: 'Davis',
      phone: '+1-555-0114',
      role: 'receptionist',
      status: 'active',
      permissions: JSON.stringify(['manage_appointments', 'manage_clients', 'basic_billing']),
      clinic_access: JSON.stringify([clinicId1]),
      mfa_enabled: false
    }
  ]);

  // Clients
  const clientId1 = uuidv4();
  const clientId2 = uuidv4();
  const clientId3 = uuidv4();
  
  await knex('clients').insert([
    {
      id: clientId1,
      clinic_id: clinicId1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-1001',
      address: '123 Pet Owner Lane',
      city: 'Downtown',
      state: 'NY',
      zip_code: '10001',
      country: 'US',
      date_of_birth: '1985-03-15',
      status: 'active',
      notes: 'Prefers evening appointments',
      emergency_contact: JSON.stringify({
        name: 'Jane Doe',
        phone: '+1-555-1002',
        relationship: 'spouse'
      }),
      communication_preferences: JSON.stringify({
        email: true,
        sms: true,
        phone: false
      }),
      marketing_consent: true
    },
    {
      id: clientId2,
      clinic_id: clinicId1,
      first_name: 'Maria',
      last_name: 'Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1-555-2001',
      address: '456 Animal Lover Ave',
      city: 'Downtown',
      state: 'NY',
      zip_code: '10002',
      country: 'US',
      date_of_birth: '1990-07-22',
      status: 'active',
      notes: 'Has multiple pets, very caring owner',
      emergency_contact: JSON.stringify({
        name: 'Carlos Garcia',
        phone: '+1-555-2002',
        relationship: 'brother'
      }),
      communication_preferences: JSON.stringify({
        email: true,
        sms: false,
        phone: true
      }),
      marketing_consent: false
    },
    {
      id: clientId3,
      clinic_id: clinicId2,
      first_name: 'Robert',
      last_name: 'Brown',
      email: 'robert.brown@email.com',
      phone: '+1-555-3001',
      address: '789 Suburban Street',
      city: 'Suburb',
      state: 'NY',
      zip_code: '10003',
      country: 'US',
      date_of_birth: '1978-11-05',
      status: 'active',
      notes: 'First-time pet owner, needs extra guidance',
      emergency_contact: JSON.stringify({
        name: 'Lisa Brown',
        phone: '+1-555-3002',
        relationship: 'wife'
      }),
      communication_preferences: JSON.stringify({
        email: true,
        sms: true,
        phone: true
      }),
      marketing_consent: true
    }
  ]);

  // Pets
  const petId1 = uuidv4();
  const petId2 = uuidv4();
  const petId3 = uuidv4();
  const petId4 = uuidv4();
  
  await knex('pets').insert([
    {
      id: petId1,
      clinic_id: clinicId1,
      client_id: clientId1,
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      gender: 'male',
      spayed_neutered: true,
      date_of_birth: '2020-05-15',
      weight: 65.5,
      color: 'Golden',
      microchip_number: 'MC001234567890',
      status: 'active',
      notes: 'Very friendly, loves treats',
      allergies: JSON.stringify(['chicken']),
      medical_conditions: JSON.stringify(['hip dysplasia'])
    },
    {
      id: petId2,
      clinic_id: clinicId1,
      client_id: clientId2,
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Domestic Shorthair',
      gender: 'female',
      spayed_neutered: true,
      date_of_birth: '2019-08-20',
      weight: 8.2,
      color: 'Calico',
      microchip_number: 'MC002345678901',
      status: 'active',
      notes: 'Indoor cat, shy with strangers',
      allergies: JSON.stringify([]),
      medical_conditions: JSON.stringify([])
    },
    {
      id: petId3,
      clinic_id: clinicId1,
      client_id: clientId2,
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      gender: 'female',
      spayed_neutered: true,
      date_of_birth: '2021-01-10',
      weight: 6.8,
      color: 'White',
      microchip_number: 'MC003456789012',
      status: 'active',
      notes: 'Requires regular grooming',
      allergies: JSON.stringify(['fish']),
      medical_conditions: JSON.stringify(['kidney disease'])
    },
    {
      id: petId4,
      clinic_id: clinicId2,
      client_id: clientId3,
      name: 'Rex',
      species: 'Dog',
      breed: 'German Shepherd',
      gender: 'male',
      spayed_neutered: false,
      date_of_birth: '2022-03-08',
      weight: 75.0,
      color: 'Black and Tan',
      microchip_number: 'MC004567890123',
      status: 'active',
      notes: 'Young and energetic, needs training',
      allergies: JSON.stringify([]),
      medical_conditions: JSON.stringify([])
    }
  ]);

  console.log('✅ Seed data inserted successfully!');
  console.log(`Organizations: 2`);
  console.log(`Clinics: 3`);
  console.log(`Users: 5`);
  console.log(`Clients: 3`);
  console.log(`Pets: 4`);
  console.log('');
  console.log('Test credentials:');
  console.log('Super Admin: admin@vetcaresolutions.com / password123');
  console.log('Org Admin: orgadmin@vetcaresolutions.com / password123');
  console.log('Veterinarian: dr.smith@vetcaresolutions.com / password123');
  console.log('Technician: jane.tech@vetcaresolutions.com / password123');
  console.log('Receptionist: receptionist@vetcaresolutions.com / password123');
};
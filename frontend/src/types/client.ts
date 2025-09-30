import { BaseEntity, Gender } from './common';

export interface Client extends BaseEntity {
  clinic_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address: ClientAddress;
  emergency_contact?: EmergencyContact;
  preferences: ClientPreferences;
  notes?: string;
  status: 'active' | 'inactive' | 'archived';
  total_pets: number;
  last_visit_date?: string;
  next_appointment_date?: string;
  account_balance: number;
  credit_limit: number;
}

export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface ClientPreferences {
  preferred_communication: 'email' | 'phone' | 'sms';
  reminder_preferences: {
    email: boolean;
    sms: boolean;
    call: boolean;
  };
  appointment_preferences: {
    preferred_days: string[];
    preferred_times: string[];
    preferred_veterinarian_id?: string;
  };
  marketing_consent: boolean;
  data_sharing_consent: boolean;
}

export interface Pet extends BaseEntity {
  clinic_id: string;
  client_id: string;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  gender: Gender;
  date_of_birth?: string;
  weight?: number;
  weight_unit: 'kg' | 'lbs';
  microchip_number?: string;
  registration_number?: string;
  insurance_info?: PetInsurance;
  status: 'active' | 'inactive' | 'deceased';
  deceased_date?: string;
  deceased_reason?: string;
  notes?: string;
  photo_url?: string;
  client?: Client;
  medical_summary: PetMedicalSummary;
}

export interface PetInsurance {
  provider: string;
  policy_number: string;
  coverage_type: string;
  deductible: number;
  coverage_limit: number;
  expiry_date: string;
  contact_info: string;
}

export interface PetMedicalSummary {
  allergies: string[];
  chronic_conditions: string[];
  current_medications: string[];
  last_vaccination_date?: string;
  next_vaccination_due?: string;
  spayed_neutered: boolean;
  spay_neuter_date?: string;
  last_exam_date?: string;
  last_weight: number;
  last_weight_date?: string;
  total_visits: number;
  flags: MedicalFlag[];
}

export interface MedicalFlag {
  id: string;
  type: 'allergy' | 'condition' | 'behavior' | 'medication' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
  created_at: string;
}

// Form types for creating/updating
export interface CreateClientRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address: ClientAddress;
  emergency_contact?: EmergencyContact;
  preferences?: Partial<ClientPreferences>;
  notes?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  status?: 'active' | 'inactive' | 'archived';
}

export interface CreatePetRequest {
  client_id: string;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  gender: Gender;
  date_of_birth?: string;
  weight?: number;
  weight_unit: 'kg' | 'lbs';
  microchip_number?: string;
  registration_number?: string;
  insurance_info?: PetInsurance;
  notes?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  current_medications?: string[];
  spayed_neutered?: boolean;
  spay_neuter_date?: string;
}

export interface UpdatePetRequest extends Partial<CreatePetRequest> {
  status?: 'active' | 'inactive' | 'deceased';
  deceased_date?: string;
  deceased_reason?: string;
}

export interface ClientSearchParams {
  search?: string;
  status?: 'active' | 'inactive' | 'archived';
  has_appointments?: boolean;
  last_visit_before?: string;
  last_visit_after?: string;
  sort_by?: 'name' | 'last_visit' | 'created_at' | 'total_pets';
  sort_order?: 'asc' | 'desc';
}

export interface PetSearchParams {
  search?: string;
  species?: string;
  breed?: string;
  status?: 'active' | 'inactive' | 'deceased';
  client_id?: string;
  has_upcoming_appointments?: boolean;
  vaccination_due?: boolean;
  sort_by?: 'name' | 'species' | 'last_visit' | 'created_at';
  sort_order?: 'asc' | 'desc';
}
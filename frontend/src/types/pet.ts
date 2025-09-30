import { BaseEntity, Gender } from './common';

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
  client?: import('./client').Client;
  medical_summary: PetMedicalSummary;
  vital_signs?: VitalSigns[];
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

export interface VitalSigns {
  id: string;
  pet_id: string;
  recorded_at: string;
  recorded_by: string; // user_id
  weight?: number;
  weight_unit?: 'kg' | 'lbs';
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  heart_rate?: number;
  respiratory_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  body_condition_score?: number;
  hydration_status?: 'normal' | 'mild_dehydration' | 'moderate_dehydration' | 'severe_dehydration';
  mucous_membrane_color?: 'pink' | 'pale' | 'yellow' | 'blue' | 'red';
  capillary_refill_time?: number;
  notes?: string;
}

export interface PetSpecies {
  id: string;
  name: string;
  common_breeds: string[];
  average_lifespan: {
    min: number;
    max: number;
  };
  common_health_issues: string[];
  vaccination_schedule: VaccinationScheduleTemplate[];
}

export interface VaccinationScheduleTemplate {
  vaccine_name: string;
  age_at_first_dose: number; // in weeks
  booster_intervals: number[]; // in weeks
  annual_booster: boolean;
  is_core: boolean;
  description: string;
}

export interface PetBreed {
  id: string;
  species_id: string;
  name: string;
  size_category: 'toy' | 'small' | 'medium' | 'large' | 'giant';
  average_weight: {
    min: number;
    max: number;
    unit: 'kg' | 'lbs';
  };
  common_health_issues: string[];
  grooming_requirements: string;
  exercise_needs: 'low' | 'moderate' | 'high';
  temperament: string[];
}

// Form types
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

export interface RecordVitalSignsRequest {
  pet_id: string;
  weight?: number;
  weight_unit?: 'kg' | 'lbs';
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  heart_rate?: number;
  respiratory_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  body_condition_score?: number;
  hydration_status?: 'normal' | 'mild_dehydration' | 'moderate_dehydration' | 'severe_dehydration';
  mucous_membrane_color?: 'pink' | 'pale' | 'yellow' | 'blue' | 'red';
  capillary_refill_time?: number;
  notes?: string;
}

export interface PetSearchParams {
  search?: string;
  species?: string;
  breed?: string;
  status?: 'active' | 'inactive' | 'deceased';
  client_id?: string;
  has_upcoming_appointments?: boolean;
  vaccination_due?: boolean;
  age_min?: number;
  age_max?: number;
  weight_min?: number;
  weight_max?: number;
  sort_by?: 'name' | 'species' | 'breed' | 'age' | 'last_visit' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface PetStats {
  total_pets: number;
  active_pets: number;
  inactive_pets: number;
  deceased_pets: number;
  species_breakdown: Record<string, number>;
  breed_breakdown: Record<string, number>;
  age_distribution: {
    puppy_kitten: number; // 0-1 year
    young: number; // 1-3 years
    adult: number; // 3-7 years
    senior: number; // 7+ years
  };
  upcoming_vaccinations: number;
  overdue_vaccinations: number;
}
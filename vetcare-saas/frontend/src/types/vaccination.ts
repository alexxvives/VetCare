import { BaseEntity } from './common';
import { Pet } from './pet';

export interface VaccinationRecord extends BaseEntity {
  clinic_id: string;
  pet_id: string;
  vaccine_id: string;
  vaccine_name: string;
  manufacturer: string;
  lot_number: string;
  expiration_date: string;
  administration_date: string;
  administered_by: string; // user_id
  site_of_injection: string;
  route: 'subcutaneous' | 'intramuscular' | 'intranasal' | 'oral';
  dosage: string;
  reactions?: string;
  next_due_date?: string;
  is_core_vaccine: boolean;
  is_overdue: boolean;
  notes?: string;
  pet?: Pet;
  vaccine?: Vaccine;
  administered_by_user?: import('./user').User;
}

export interface Vaccine extends BaseEntity {
  name: string;
  manufacturer: string;
  type: 'core' | 'non_core' | 'lifestyle';
  species: string[];
  description: string;
  protection_against: string[];
  administration_route: string[];
  dosage_forms: string[];
  age_restrictions: {
    min_age_weeks?: number;
    max_age_weeks?: number;
  };
  schedule: VaccineSchedule;
  contraindications: string[];
  side_effects: string[];
  storage_requirements: string;
  is_active: boolean;
}

export interface VaccineSchedule {
  initial_series: {
    age_start_weeks: number;
    doses_required: number;
    interval_weeks: number;
  };
  booster_schedule: {
    first_booster_weeks: number;
    subsequent_interval_years: number;
  };
  special_instructions?: string;
}

export interface VaccinationProtocol extends BaseEntity {
  clinic_id: string;
  name: string;
  species: string;
  age_group: 'puppy' | 'kitten' | 'adult' | 'senior';
  vaccines: VaccinationProtocolItem[];
  is_default: boolean;
  is_active: boolean;
  notes?: string;
}

export interface VaccinationProtocolItem {
  vaccine_id: string;
  sequence_order: number;
  age_weeks: number;
  is_required: boolean;
  notes?: string;
}

export interface VaccinationSchedule extends BaseEntity {
  pet_id: string;
  protocol_id?: string;
  scheduled_vaccinations: ScheduledVaccination[];
  custom_schedule: boolean;
  notes?: string;
}

export interface ScheduledVaccination {
  id: string;
  vaccine_id: string;
  vaccine_name: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'overdue' | 'skipped' | 'cancelled';
  completion_date?: string;
  vaccination_record_id?: string;
  notes?: string;
  reminder_sent: boolean;
  is_required: boolean;
}

export interface VaccinationReminder {
  id: string;
  pet_id: string;
  vaccine_name: string;
  due_date: string;
  days_overdue: number;
  reminder_type: 'upcoming' | 'due' | 'overdue';
  client_notified: boolean;
  last_notification_date?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface VaccinationReport {
  clinic_id: string;
  period: {
    start_date: string;
    end_date: string;
  };
  total_vaccinations: number;
  by_vaccine: {
    vaccine_name: string;
    count: number;
  }[];
  by_species: {
    species: string;
    count: number;
  }[];
  overdue_vaccinations: number;
  compliance_rate: number;
  revenue_generated: number;
}

// Form types
export interface CreateVaccinationRecordRequest {
  pet_id: string;
  vaccine_id: string;
  lot_number: string;
  expiration_date: string;
  administration_date: string;
  site_of_injection: string;
  route: 'subcutaneous' | 'intramuscular' | 'intranasal' | 'oral';
  dosage: string;
  reactions?: string;
  next_due_date?: string;
  notes?: string;
}

export interface UpdateVaccinationRecordRequest extends Partial<CreateVaccinationRecordRequest> {
  reactions?: string;
  notes?: string;
}

export interface CreateVaccineRequest {
  name: string;
  manufacturer: string;
  type: 'core' | 'non_core' | 'lifestyle';
  species: string[];
  description: string;
  protection_against: string[];
  administration_route: string[];
  dosage_forms: string[];
  age_restrictions: {
    min_age_weeks?: number;
    max_age_weeks?: number;
  };
  schedule: VaccineSchedule;
  contraindications: string[];
  side_effects: string[];
  storage_requirements: string;
}

export interface CreateVaccinationProtocolRequest {
  name: string;
  species: string;
  age_group: 'puppy' | 'kitten' | 'adult' | 'senior';
  vaccines: VaccinationProtocolItem[];
  is_default?: boolean;
  notes?: string;
}

export interface VaccinationSearchParams {
  pet_id?: string;
  vaccine_id?: string;
  date_from?: string;
  date_to?: string;
  is_overdue?: boolean;
  is_due_soon?: boolean; // due within next 30 days
  administered_by?: string;
  species?: string;
  vaccine_type?: 'core' | 'non_core' | 'lifestyle';
  sort_by?: 'administration_date' | 'due_date' | 'pet_name' | 'vaccine_name';
  sort_order?: 'asc' | 'desc';
}

export interface VaccinationStats {
  total_vaccinations_today: number;
  total_vaccinations_this_month: number;
  upcoming_vaccinations_7_days: number;
  upcoming_vaccinations_30_days: number;
  overdue_vaccinations: number;
  compliance_rate: number;
  most_common_vaccines: {
    vaccine_name: string;
    count: number;
  }[];
  vaccination_trends: {
    date: string;
    count: number;
  }[];
}
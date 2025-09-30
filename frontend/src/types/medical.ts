import { BaseEntity } from './common';
import { User } from './user';
import { Pet } from './pet';

export interface MedicalRecord extends BaseEntity {
  clinic_id: string;
  pet_id: string;
  appointment_id?: string;
  veterinarian_id: string;
  visit_date: string;
  chief_complaint: string;
  soap_notes: SOAPNotes;
  diagnosis: Diagnosis[];
  treatments: Treatment[];
  prescriptions: Prescription[];
  vital_signs?: VitalSigns;
  lab_results?: string[]; // lab_result IDs
  imaging_results?: string[]; // imaging_result IDs
  follow_up_instructions?: string;
  next_visit_date?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  is_confidential: boolean;
  tags: string[];
  attachments: MedicalAttachment[];
  pet?: Pet;
  veterinarian?: User;
}

export interface SOAPNotes {
  subjective: string; // What the client reports
  objective: string; // Clinical observations
  assessment: string; // Diagnosis or clinical impression
  plan: string; // Treatment plan and recommendations
}

export interface Diagnosis {
  id: string;
  code?: string; // ICD-10 or similar
  primary_diagnosis: string;
  secondary_diagnoses?: string[];
  differential_diagnoses?: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  prognosis: 'excellent' | 'good' | 'fair' | 'poor' | 'grave';
  notes?: string;
}

export interface Treatment {
  id: string;
  type: 'medical' | 'surgical' | 'therapeutic' | 'preventive';
  name: string;
  description: string;
  performed_by: string; // user_id
  performed_at: string;
  duration?: number; // in minutes
  anesthesia_used?: AnesthesiaInfo;
  complications?: string;
  outcome: 'successful' | 'partially_successful' | 'unsuccessful';
  notes?: string;
  cost?: number;
}

export interface AnesthesiaInfo {
  type: string;
  agent: string;
  dosage: string;
  route: 'intravenous' | 'intramuscular' | 'inhalation' | 'topical' | 'oral';
  start_time: string;
  end_time?: string;
  complications?: string;
  recovery_notes?: string;
}

export interface Prescription {
  id: string;
  medication_name: string;
  active_ingredient?: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical' | 'other';
  dosage: string;
  frequency: string;
  route: 'oral' | 'topical' | 'injection' | 'intravenous' | 'other';
  duration: string;
  quantity: number;
  refills: number;
  refills_used: number;
  prescribing_veterinarian: string; // user_id
  prescribed_date: string;
  start_date: string;
  end_date?: string;
  instructions: string;
  warnings?: string[];
  side_effects?: string[];
  contraindications?: string[];
  is_controlled_substance: boolean;
  status: 'active' | 'completed' | 'discontinued' | 'expired';
  discontinuation_reason?: string;
  notes?: string;
}

export interface VitalSigns {
  weight?: number;
  weight_unit?: 'kg' | 'lbs';
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  heart_rate?: number;
  respiratory_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  body_condition_score?: number; // 1-9 scale
  hydration_status?: 'normal' | 'mild_dehydration' | 'moderate_dehydration' | 'severe_dehydration';
  mucous_membrane_color?: 'pink' | 'pale' | 'yellow' | 'blue' | 'red';
  capillary_refill_time?: number; // in seconds
  pain_score?: number; // 0-10 scale
  notes?: string;
}

export interface MedicalAttachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  category: 'image' | 'document' | 'lab_result' | 'xray' | 'other';
  description?: string;
  uploaded_by: string; // user_id
  uploaded_at: string;
}

export interface MedicalHistory {
  pet_id: string;
  records: MedicalRecord[];
  chronic_conditions: ChronicCondition[];
  allergies: Allergy[];
  surgical_history: SurgicalHistory[];
  vaccination_history: VaccinationRecord[];
  medication_history: MedicationHistory[];
}

export interface ChronicCondition {
  id: string;
  condition_name: string;
  diagnosed_date: string;
  severity: 'mild' | 'moderate' | 'severe';
  current_status: 'stable' | 'improving' | 'worsening' | 'resolved';
  treatment_plan: string;
  monitoring_frequency: string;
  notes?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  type: 'food' | 'environmental' | 'medication' | 'contact' | 'other';
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  first_occurrence: string;
  last_occurrence?: string;
  treatment: string;
  notes?: string;
}

export interface SurgicalHistory {
  id: string;
  procedure_name: string;
  procedure_date: string;
  surgeon: string;
  anesthesia_type: string;
  complications?: string;
  outcome: string;
  recovery_notes?: string;
  follow_up_required: boolean;
  pathology_results?: string;
}

export interface VaccinationRecord {
  id: string;
  vaccine_name: string;
  manufacturer: string;
  lot_number: string;
  expiration_date: string;
  administration_date: string;
  administered_by: string; // user_id
  site_of_injection: string;
  route: 'subcutaneous' | 'intramuscular' | 'intranasal' | 'oral';
  reactions?: string;
  next_due_date?: string;
  is_core_vaccine: boolean;
  notes?: string;
}

export interface MedicationHistory {
  id: string;
  medication_name: string;
  start_date: string;
  end_date?: string;
  reason: string;
  dosage: string;
  frequency: string;
  prescribed_by: string; // user_id
  effectiveness: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  side_effects?: string[];
  discontinued_reason?: string;
}

// Form types
export interface CreateMedicalRecordRequest {
  pet_id: string;
  appointment_id?: string;
  visit_date: string;
  chief_complaint: string;
  soap_notes: SOAPNotes;
  vital_signs?: Partial<VitalSigns>;
  is_confidential?: boolean;
  tags?: string[];
}

export interface UpdateMedicalRecordRequest extends Partial<CreateMedicalRecordRequest> {
  status?: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  follow_up_instructions?: string;
  next_visit_date?: string;
}

export interface AddDiagnosisRequest {
  medical_record_id: string;
  primary_diagnosis: string;
  secondary_diagnoses?: string[];
  differential_diagnoses?: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  prognosis: 'excellent' | 'good' | 'fair' | 'poor' | 'grave';
  notes?: string;
}

export interface AddTreatmentRequest {
  medical_record_id: string;
  type: 'medical' | 'surgical' | 'therapeutic' | 'preventive';
  name: string;
  description: string;
  duration?: number;
  anesthesia_used?: AnesthesiaInfo;
  notes?: string;
  cost?: number;
}

export interface AddPrescriptionRequest {
  medical_record_id: string;
  medication_name: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical' | 'other';
  dosage: string;
  frequency: string;
  route: 'oral' | 'topical' | 'injection' | 'intravenous' | 'other';
  duration: string;
  quantity: number;
  refills: number;
  instructions: string;
  warnings?: string[];
  is_controlled_substance?: boolean;
}

export interface MedicalRecordSearchParams {
  pet_id?: string;
  veterinarian_id?: string;
  date_from?: string;
  date_to?: string;
  diagnosis?: string;
  treatment?: string;
  medication?: string;
  status?: 'draft' | 'in_progress' | 'completed' | 'reviewed';
  is_confidential?: boolean;
  tags?: string[];
  search?: string;
  sort_by?: 'visit_date' | 'created_at' | 'pet_name' | 'veterinarian_name';
  sort_order?: 'asc' | 'desc';
}
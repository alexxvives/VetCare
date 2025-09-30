import { BaseEntity } from './common';
import { Pet } from './pet';

export interface LabResult extends BaseEntity {
  clinic_id: string;
  pet_id: string;
  lab_order_id?: string;
  test_type: string;
  test_name: string;
  lab_name: string;
  ordered_by: string; // user_id
  collected_date: string;
  received_date: string;
  reported_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  priority: 'routine' | 'urgent' | 'stat';
  specimen_type: string;
  collection_method: string;
  results: LabTestResult[];
  interpretation?: string;
  reference_ranges: ReferenceRange[];
  abnormal_flags: AbnormalFlag[];
  technician_notes?: string;
  veterinarian_notes?: string;
  attachments: LabAttachment[];
  cost?: number;
  external_lab_id?: string;
  pet?: Pet;
  ordered_by_user?: import('./user').User;
}

export interface LabTestResult {
  id: string;
  test_code: string;
  test_name: string;
  result_value: string;
  result_unit?: string;
  result_type: 'numeric' | 'text' | 'boolean' | 'image';
  normal_range?: string;
  reference_range?: {
    min?: number;
    max?: number;
    unit?: string;
  };
  is_abnormal: boolean;
  abnormal_type?: 'high' | 'low' | 'critical_high' | 'critical_low' | 'abnormal';
  flags: string[];
  notes?: string;
}

export interface ReferenceRange {
  test_code: string;
  species: string;
  age_group?: 'young' | 'adult' | 'senior';
  gender?: 'male' | 'female';
  min_value?: number;
  max_value?: number;
  unit: string;
  normal_range_text?: string;
}

export interface AbnormalFlag {
  test_code: string;
  flag_type: 'high' | 'low' | 'critical_high' | 'critical_low' | 'abnormal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommended_action?: string;
}

export interface LabAttachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  thumbnail_url?: string;
  category: 'report' | 'image' | 'document' | 'other';
  description?: string;
  uploaded_at: string;
}

export interface LabOrder extends BaseEntity {
  clinic_id: string;
  pet_id: string;
  appointment_id?: string;
  ordered_by: string; // user_id
  lab_name: string;
  order_date: string;
  collection_date?: string;
  status: 'ordered' | 'collected' | 'sent' | 'received' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  tests_ordered: LabTestOrder[];
  special_instructions?: string;
  fasting_required: boolean;
  collection_instructions: string;
  estimated_completion: string;
  total_cost?: number;
  external_order_id?: string;
  tracking_number?: string;
  results?: LabResult[];
}

export interface LabTestOrder {
  test_code: string;
  test_name: string;
  specimen_type: string;
  collection_method: string;
  special_requirements?: string;
  cost?: number;
}

export interface LabTestCatalog extends BaseEntity {
  test_code: string;
  test_name: string;
  category: string;
  subcategory?: string;
  description: string;
  specimen_types: string[];
  collection_methods: string[];
  species_applicable: string[];
  turnaround_time: string;
  special_requirements?: string[];
  fasting_required: boolean;
  cost: number;
  reference_ranges: ReferenceRange[];
  common_indications: string[];
  is_active: boolean;
  lab_provider: string;
}

export interface LabProvider extends BaseEntity {
  name: string;
  contact_info: {
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
  services_offered: string[];
  turnaround_times: {
    routine: string;
    urgent: string;
    stat: string;
  };
  pickup_schedule: string;
  billing_info: {
    payment_terms: string;
    billing_contact: string;
    account_number?: string;
  };
  integration_type: 'manual' | 'api' | 'edi';
  api_config?: {
    endpoint: string;
    api_key: string;
    format: 'hl7' | 'json' | 'xml';
  };
  is_active: boolean;
}

export interface LabResultTrend {
  pet_id: string;
  test_code: string;
  test_name: string;
  results: {
    date: string;
    value: number;
    unit: string;
    is_abnormal: boolean;
  }[];
  trend_direction: 'improving' | 'stable' | 'worsening' | 'unknown';
  reference_range: {
    min?: number;
    max?: number;
    unit: string;
  };
}

// Form types
export interface CreateLabOrderRequest {
  pet_id: string;
  appointment_id?: string;
  lab_name: string;
  tests_ordered: LabTestOrder[];
  priority: 'routine' | 'urgent' | 'stat';
  collection_date?: string;
  special_instructions?: string;
  fasting_required: boolean;
  collection_instructions: string;
}

export interface UpdateLabOrderRequest extends Partial<CreateLabOrderRequest> {
  status?: 'ordered' | 'collected' | 'sent' | 'received' | 'completed' | 'cancelled';
  tracking_number?: string;
  external_order_id?: string;
}

export interface CreateLabResultRequest {
  lab_order_id?: string;
  pet_id: string;
  test_type: string;
  test_name: string;
  lab_name: string;
  collected_date: string;
  received_date: string;
  reported_date: string;
  specimen_type: string;
  collection_method: string;
  results: Omit<LabTestResult, 'id'>[];
  interpretation?: string;
  technician_notes?: string;
  external_lab_id?: string;
}

export interface UpdateLabResultRequest extends Partial<CreateLabResultRequest> {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  veterinarian_notes?: string;
}

export interface LabSearchParams {
  pet_id?: string;
  lab_order_id?: string;
  test_type?: string;
  lab_name?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  priority?: 'routine' | 'urgent' | 'stat';
  date_from?: string;
  date_to?: string;
  has_abnormal_results?: boolean;
  ordered_by?: string;
  search?: string;
  sort_by?: 'reported_date' | 'collected_date' | 'test_name' | 'pet_name';
  sort_order?: 'asc' | 'desc';
}

export interface LabStats {
  total_orders_today: number;
  total_orders_this_month: number;
  pending_results: number;
  abnormal_results_today: number;
  most_ordered_tests: {
    test_name: string;
    count: number;
  }[];
  turnaround_times: {
    average_days: number;
    median_days: number;
  };
  lab_provider_performance: {
    provider_name: string;
    average_turnaround: number;
    total_orders: number;
    on_time_delivery_rate: number;
  }[];
}
import { BaseEntity, UserRole } from './common';

export interface Organization extends BaseEntity {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription_tier: 'basic' | 'premium' | 'enterprise';
  max_clinics: number;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  timezone: string;
  date_format: string;
  time_format: '12h' | '24h';
  currency: string;
  language: string;
  branding: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
  };
}

export interface Clinic extends BaseEntity {
  organization_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  license_number?: string;
  tax_id?: string;
  status: 'active' | 'inactive' | 'suspended';
  settings: ClinicSettings;
  organization?: Organization;
}

export interface ClinicSettings {
  appointment_duration: number; // in minutes
  appointment_buffer: number; // in minutes
  working_hours: WorkingHours;
  appointment_types: AppointmentType[];
  reminder_settings: ReminderSettings;
  billing_settings: BillingSettings;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  is_open: boolean;
  open_time?: string; // HH:mm format
  close_time?: string; // HH:mm format
  break_start?: string;
  break_end?: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number; // in minutes
  color: string;
  description?: string;
  is_active: boolean;
}

export interface ReminderSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  email_templates: {
    confirmation: string;
    reminder_24h: string;
    reminder_2h: string;
    cancellation: string;
  };
  sms_templates: {
    confirmation: string;
    reminder_24h: string;
    reminder_2h: string;
    cancellation: string;
  };
}

export interface BillingSettings {
  tax_rate: number;
  currency: string;
  payment_terms: string;
  invoice_prefix: string;
  next_invoice_number: number;
}

// Form and API types
export interface CreateClinicRequest {
  organization_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  license_number?: string;
  tax_id?: string;
}

export interface UpdateClinicRequest extends Partial<CreateClinicRequest> {
  status?: 'active' | 'inactive' | 'suspended';
  settings?: Partial<ClinicSettings>;
}

export interface ClinicSearchParams {
  organization_id?: string;
  status?: 'active' | 'inactive' | 'suspended';
  city?: string;
  state?: string;
  country?: string;
  search?: string;
  sort_by?: 'name' | 'created_at' | 'city' | 'status';
  sort_order?: 'asc' | 'desc';
}

export interface ClinicStats {
  total_appointments_today: number;
  total_appointments_this_month: number;
  total_clients: number;
  total_pets: number;
  revenue_today: number;
  revenue_this_month: number;
  upcoming_appointments: number;
  no_shows_this_month: number;
  average_appointment_duration: number;
  most_popular_services: {
    service_name: string;
    count: number;
  }[];
  appointment_trends: {
    date: string;
    appointments: number;
    revenue: number;
  }[];
  client_acquisition: {
    new_clients_this_month: number;
    total_active_clients: number;
    client_retention_rate: number;
  };
}
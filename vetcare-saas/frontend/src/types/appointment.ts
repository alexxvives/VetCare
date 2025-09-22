import { BaseEntity, AppointmentStatus } from './common';
import { User } from './user';
import { Client } from './client';
import { Pet } from './pet';

export interface Appointment extends BaseEntity {
  clinic_id: string;
  client_id: string;
  pet_id: string;
  veterinarian_id: string;
  appointment_type_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  reason: string;
  notes?: string;
  internal_notes?: string;
  check_in_time?: string;
  check_out_time?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;
  no_show_reason?: string;
  recurring_appointment_id?: string;
  room_id?: string;
  estimated_cost?: number;
  actual_cost?: number;
  client?: Client;
  pet?: Pet;
  veterinarian?: User;
  appointment_type?: AppointmentType;
  room?: Room;
  services?: AppointmentService[];
  reminders?: AppointmentReminder[];
}

export interface AppointmentType extends BaseEntity {
  clinic_id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  color: string;
  is_active: boolean;
  requires_deposit: boolean;
  deposit_amount?: number;
  category: 'consultation' | 'surgery' | 'vaccination' | 'grooming' | 'emergency' | 'other';
  default_services: string[]; // service IDs
}

export interface Room extends BaseEntity {
  clinic_id: string;
  name: string;
  type: 'examination' | 'surgery' | 'treatment' | 'grooming' | 'other';
  capacity: number;
  equipment: string[];
  is_active: boolean;
  notes?: string;
}

export interface AppointmentService {
  id: string;
  appointment_id: string;
  service_id: string;
  service_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  performed_by?: string; // user_id
  completed: boolean;
  notes?: string;
}

export interface AppointmentReminder {
  id: string;
  appointment_id: string;
  type: 'email' | 'sms' | 'call';
  scheduled_time: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  content: string;
  failure_reason?: string;
}

export interface RecurringAppointment extends BaseEntity {
  clinic_id: string;
  client_id: string;
  pet_id: string;
  veterinarian_id: string;
  appointment_type_id: string;
  title: string;
  description?: string;
  duration: number;
  reason: string;
  recurrence_pattern: RecurrencePattern;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  total_appointments: number;
  completed_appointments: number;
  next_appointment_date?: string;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every X days/weeks/months/years
  days_of_week?: number[]; // 0-6 (Sunday-Saturday) for weekly
  day_of_month?: number; // 1-31 for monthly
  month_of_year?: number; // 1-12 for yearly
  max_occurrences?: number;
}

export interface AppointmentSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  veterinarian_id: string;
  room_id?: string;
  appointment_id?: string; // if occupied
}

// Form types
export interface CreateAppointmentRequest {
  client_id: string;
  pet_id: string;
  veterinarian_id: string;
  appointment_type_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  scheduled_time: string;
  duration?: number;
  priority?: 'low' | 'medium' | 'high' | 'emergency';
  reason: string;
  notes?: string;
  room_id?: string;
  services?: string[]; // service IDs
  send_reminders?: boolean;
}

export interface UpdateAppointmentRequest extends Partial<CreateAppointmentRequest> {
  status?: AppointmentStatus;
  internal_notes?: string;
  cancellation_reason?: string;
  no_show_reason?: string;
  actual_start_time?: string;
  actual_end_time?: string;
}

export interface RescheduleAppointmentRequest {
  new_date: string;
  new_time: string;
  new_veterinarian_id?: string;
  new_room_id?: string;
  reason?: string;
  notify_client?: boolean;
}

export interface CheckInRequest {
  appointment_id: string;
  check_in_time?: string;
  notes?: string;
  update_pet_weight?: number;
  update_pet_weight_unit?: 'kg' | 'lbs';
}

export interface CreateRecurringAppointmentRequest {
  client_id: string;
  pet_id: string;
  veterinarian_id: string;
  appointment_type_id: string;
  title: string;
  description?: string;
  duration?: number;
  reason: string;
  recurrence_pattern: RecurrencePattern;
  start_date: string;
  end_date?: string;
  preferred_time: string;
  room_id?: string;
}

export interface AppointmentSearchParams {
  date_from?: string;
  date_to?: string;
  veterinarian_id?: string;
  client_id?: string;
  pet_id?: string;
  status?: AppointmentStatus[];
  appointment_type_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'emergency';
  room_id?: string;
  search?: string;
  sort_by?: 'scheduled_date' | 'created_at' | 'client_name' | 'pet_name';
  sort_order?: 'asc' | 'desc';
}

export interface AppointmentStats {
  total_appointments: number;
  today_appointments: number;
  upcoming_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  no_show_appointments: number;
  status_breakdown: Record<AppointmentStatus, number>;
  weekly_trend: {
    date: string;
    count: number;
  }[];
  monthly_revenue: number;
  average_duration: number;
  most_popular_services: {
    service_name: string;
    count: number;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
  color?: string;
  textColor?: string;
}
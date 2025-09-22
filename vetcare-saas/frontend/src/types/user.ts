import { BaseEntity, UserRole } from './common';
import { Clinic } from './clinic';

export interface User extends BaseEntity {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  clinic_access: string[]; // Array of clinic IDs
  last_login_at?: string;
  email_verified_at?: string;
  profile: UserProfile;
  preferences: UserPreferences;
  permissions: UserPermissions;
}

export interface UserProfile {
  title?: string; // Dr., DVM, etc.
  license_number?: string;
  specializations?: string[];
  bio?: string;
  avatar_url?: string;
  emergency_contact?: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface UserPreferences {
  timezone: string;
  language: string;
  date_format: string;
  time_format: '12h' | '24h';
  notifications: NotificationPreferences;
  dashboard_layout: DashboardLayout;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  appointment_reminders: boolean;
  system_alerts: boolean;
  marketing_emails: boolean;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  theme: 'light' | 'dark' | 'auto';
}

export interface DashboardWidget {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  is_visible: boolean;
}

export interface UserPermissions {
  can_manage_users: boolean;
  can_manage_clinics: boolean;
  can_view_reports: boolean;
  can_manage_appointments: boolean;
  can_access_medical_records: boolean;
  can_manage_clients: boolean;
  can_manage_pets: boolean;
  can_process_payments: boolean;
  can_manage_inventory: boolean;
  can_export_data: boolean;
  custom_permissions: Record<string, boolean>;
}

// Authentication related types
export interface LoginCredentials {
  email: string;
  password: string;
  clinic_id?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  clinic_id?: string;
  two_factor_token?: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  clinic: Clinic;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

export interface TwoFactorSetupResponse {
  secret: string;
  qr_code: string;
  backup_codes: string[];
}

export interface TwoFactorVerifyRequest {
  token: string;
  backup_code?: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  clinic_id?: string;
  phone?: string;
  title?: string;
  license_number?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  title?: string;
  license_number?: string;
  specializations?: string[];
  bio?: string;
}

export interface UpdatePreferencesRequest {
  timezone?: string;
  language?: string;
  date_format?: string;
  time_format?: '12h' | '24h';
  notifications?: Partial<NotificationPreferences>;
  dashboard_layout?: Partial<DashboardLayout>;
}
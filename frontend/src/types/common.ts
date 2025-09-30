// Common types used across the application

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: PaginationMeta;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  message?: string;
  errors?: Record<string, string[]>;
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  status_code: number;
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T = any> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

export type UserRole = 'super_admin' | 'clinic_admin' | 'veterinarian' | 'technician' | 'receptionist' | 'read_only';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type PetStatus = 'active' | 'inactive' | 'deceased';

export type Gender = 'male' | 'female' | 'unknown';
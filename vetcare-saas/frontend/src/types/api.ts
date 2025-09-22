import { ApiResponse, PaginationParams, PaginatedResponse } from './common';
import { User, LoginResponse, RegisterData, PasswordResetRequest, PasswordResetConfirm, ChangePasswordRequest } from './user';
import { Organization, Clinic } from './clinic';
import { Client, Pet } from './client';
import { Appointment, AppointmentType, RecurringAppointment } from './appointment';
import { MedicalRecord, Diagnosis, Treatment, Prescription } from './medical';

// Additional API types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
  timestamp: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
  [key: string]: any; // Allow other axios config properties
}

// File upload progress tracking
export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number;
  timeRemaining?: number;
}

// API Response types for all endpoints

// Authentication API responses
export interface AuthApiResponses {
  login: ApiResponse<LoginResponse>;
  register: ApiResponse<{ user: User; message: string }>;
  logout: ApiResponse<{ message: string }>;
  refresh: ApiResponse<{ access_token: string; expires_in: number }>;
  forgotPassword: ApiResponse<{ message: string }>;
  resetPassword: ApiResponse<{ message: string }>;
  changePassword: ApiResponse<{ message: string }>;
  verifyEmail: ApiResponse<{ message: string }>;
  resendVerification: ApiResponse<{ message: string }>;
}

// User API responses
export interface UserApiResponses {
  getProfile: ApiResponse<User>;
  updateProfile: ApiResponse<User>;
  getUsers: ApiResponse<User[]>;
  createUser: ApiResponse<User>;
  updateUser: ApiResponse<User>;
  deleteUser: ApiResponse<{ message: string }>;
  getUserById: ApiResponse<User>;
}

// Organization API responses
export interface OrganizationApiResponses {
  getOrganizations: ApiResponse<Organization[]>;
  createOrganization: ApiResponse<Organization>;
  updateOrganization: ApiResponse<Organization>;
  deleteOrganization: ApiResponse<{ message: string }>;
  getOrganizationById: ApiResponse<Organization>;
}

// Clinic API responses
export interface ClinicApiResponses {
  getClinics: ApiResponse<Clinic[]>;
  createClinic: ApiResponse<Clinic>;
  updateClinic: ApiResponse<Clinic>;
  deleteClinic: ApiResponse<{ message: string }>;
  getClinicById: ApiResponse<Clinic>;
  getClinicSettings: ApiResponse<any>;
  updateClinicSettings: ApiResponse<any>;
}

// Client API responses
export interface ClientApiResponses {
  getClients: ApiResponse<Client[]>;
  createClient: ApiResponse<Client>;
  updateClient: ApiResponse<Client>;
  deleteClient: ApiResponse<{ message: string }>;
  getClientById: ApiResponse<Client>;
  searchClients: ApiResponse<Client[]>;
  getClientPets: ApiResponse<Pet[]>;
  getClientAppointments: ApiResponse<Appointment[]>;
}

// Pet API responses
export interface PetApiResponses {
  getPets: ApiResponse<Pet[]>;
  createPet: ApiResponse<Pet>;
  updatePet: ApiResponse<Pet>;
  deletePet: ApiResponse<{ message: string }>;
  getPetById: ApiResponse<Pet>;
  searchPets: ApiResponse<Pet[]>;
  getPetMedicalHistory: ApiResponse<MedicalRecord[]>;
  updatePetVitals: ApiResponse<Pet>;
  uploadPetPhoto: ApiResponse<{ photo_url: string }>;
}

// Appointment API responses
export interface AppointmentApiResponses {
  getAppointments: ApiResponse<Appointment[]>;
  createAppointment: ApiResponse<Appointment>;
  updateAppointment: ApiResponse<Appointment>;
  deleteAppointment: ApiResponse<{ message: string }>;
  getAppointmentById: ApiResponse<Appointment>;
  rescheduleAppointment: ApiResponse<Appointment>;
  checkInAppointment: ApiResponse<Appointment>;
  checkOutAppointment: ApiResponse<Appointment>;
  cancelAppointment: ApiResponse<Appointment>;
  getAppointmentTypes: ApiResponse<AppointmentType[]>;
  createRecurringAppointment: ApiResponse<RecurringAppointment>;
  getAvailableSlots: ApiResponse<any[]>;
  searchAppointments: ApiResponse<Appointment[]>;
}

// Medical Record API responses
export interface MedicalApiResponses {
  getMedicalRecords: ApiResponse<MedicalRecord[]>;
  createMedicalRecord: ApiResponse<MedicalRecord>;
  updateMedicalRecord: ApiResponse<MedicalRecord>;
  deleteMedicalRecord: ApiResponse<{ message: string }>;
  getMedicalRecordById: ApiResponse<MedicalRecord>;
  addDiagnosis: ApiResponse<Diagnosis>;
  updateDiagnosis: ApiResponse<Diagnosis>;
  addTreatment: ApiResponse<Treatment>;
  updateTreatment: ApiResponse<Treatment>;
  addPrescription: ApiResponse<Prescription>;
  updatePrescription: ApiResponse<Prescription>;
  uploadAttachment: ApiResponse<{ file_url: string; file_id: string }>;
  searchMedicalRecords: ApiResponse<MedicalRecord[]>;
}

// API Request types
export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface ApiEndpoints {
  // Authentication
  auth: {
    login: string;
    register: string;
    logout: string;
    refresh: string;
    forgotPassword: string;
    resetPassword: string;
    changePassword: string;
    verifyEmail: string;
    resendVerification: string;
  };
  // Users
  users: {
    profile: string;
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
  };
  // Organizations
  organizations: {
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
  };
  // Clinics
  clinics: {
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
    settings: (id: string) => string;
  };
  // Clients
  clients: {
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
    search: string;
    pets: (id: string) => string;
    appointments: (id: string) => string;
  };
  // Pets
  pets: {
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
    search: string;
    medicalHistory: (id: string) => string;
    vitals: (id: string) => string;
    photo: (id: string) => string;
  };
  // Appointments
  appointments: {
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
    reschedule: (id: string) => string;
    checkIn: (id: string) => string;
    checkOut: (id: string) => string;
    cancel: (id: string) => string;
    types: string;
    recurring: string;
    availableSlots: string;
    search: string;
  };
  // Medical Records
  medical: {
    records: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    getById: (id: string) => string;
    diagnosis: (recordId: string) => string;
    treatment: (recordId: string) => string;
    prescription: (recordId: string) => string;
    attachment: (recordId: string) => string;
    search: string;
  };
}

// API Error types
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  status_code: number;
  timestamp: string;
  path: string;
}

// Generic API service types
export interface ApiServiceConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface ApiInterceptors {
  request: {
    onFulfilled?: (config: any) => any;
    onRejected?: (error: any) => Promise<any>;
  };
  response: {
    onFulfilled?: (response: any) => any;
    onRejected?: (error: any) => Promise<any>;
  };
}

// File upload types
export interface FileUploadResponse {
  success: boolean;
  file_url: string;
  file_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  thumbnail_url?: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  user_id?: string;
  clinic_id?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}
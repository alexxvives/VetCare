// Application Constants
// Global constants and configuration values

export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  CLINICS: '/clinics',
  CLIENTS: '/clients',
  PETS: '/pets',
  APPOINTMENTS: '/appointments',
  MEDICAL: '/medical',
  VACCINATIONS: '/vaccinations',
  LABS: '/labs',
  FILES: '/files'
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'organization_admin',
  CLINIC_ADMIN: 'clinic_admin',
  VETERINARIAN: 'veterinarian',
  TECHNICIAN: 'technician',
  RECEPTIONIST: 'receptionist'
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
} as const;

export const PET_SPECIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  RABBIT: 'rabbit',
  REPTILE: 'reptile',
  EXOTIC: 'exotic',
  OTHER: 'other'
} as const;
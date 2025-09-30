import React from 'react';

// Base form field props
export interface BaseFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  'data-testid'?: string;
}

// Form validation
export interface ValidationRule {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: any) => boolean | string | Promise<boolean | string>;
  custom?: (value: any, formValues: any) => boolean | string;
}

export interface FormField extends BaseFieldProps {
  type: FormFieldType;
  validation?: ValidationRule;
  options?: FormFieldOption[];
  multiple?: boolean;
  defaultValue?: any;
  dependsOn?: string[];
  conditionalLogic?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
    action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
  }[];
  grid?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  props?: Record<string, any>;
}

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'image'
  | 'color'
  | 'range'
  | 'rating'
  | 'autocomplete'
  | 'richtext'
  | 'address'
  | 'phone'
  | 'currency'
  | 'percentage'
  | 'json'
  | 'custom';

export interface FormFieldOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
  description?: string;
}

// Form configuration
export interface FormConfig {
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  fields: FormField[];
  sections?: FormSection[];
  layout?: 'vertical' | 'horizontal' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showRequiredIndicator?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  confirmOnCancel?: boolean;
  allowReset?: boolean;
  className?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  collapsible?: boolean;
  collapsed?: boolean;
  grid?: {
    columns?: number;
    gap?: number;
  };
  conditionalLogic?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
    action: 'show' | 'hide';
  }[];
}

// Form state and handlers
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isValid: boolean;
  submitCount: number;
}

export interface FormHandlers {
  handleSubmit: (event: React.FormEvent) => void;
  handleReset: () => void;
  handleCancel: () => void;
  handleFieldChange: (name: string, value: any) => void;
  handleFieldBlur: (name: string) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  validateField: (name: string) => Promise<void>;
  validateForm: () => Promise<boolean>;
  resetForm: () => void;
  clearErrors: () => void;
}

export interface FormProps {
  config: FormConfig;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  onReset?: () => void;
  onChange?: (values: Record<string, any>) => void;
  onFieldChange?: (name: string, value: any, allValues: Record<string, any>) => void;
  validationSchema?: any; // Yup schema or similar
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

// Specific form types for VetCare entities
export interface PetFormData {
  name: string;
  species: string;
  breed: string;
  gender: 'male' | 'female';
  date_of_birth: string;
  color?: string;
  markings?: string;
  microchip_number?: string;
  weight?: number;
  is_active: boolean;
  special_needs?: string;
  allergies?: string[];
  medications?: string[];
  insurance_info?: {
    provider: string;
    policy_number: string;
    coverage_percentage: number;
  };
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  photos?: File[];
}

export interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  date_of_birth?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  communication_preferences: {
    email_reminders: boolean;
    sms_reminders: boolean;
    marketing_emails: boolean;
  };
  notes?: string;
  is_active: boolean;
}

export interface AppointmentFormData {
  pet_id: string;
  appointment_type_id: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  send_reminders: boolean;
  reminder_settings?: {
    email_hours_before: number[];
    sms_hours_before: number[];
  };
  follow_up_required: boolean;
  follow_up_date?: string;
}

export interface MedicalRecordFormData {
  pet_id: string;
  visit_date: string;
  weight?: number;
  temperature?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  chief_complaint: string;
  history: string;
  physical_exam_findings: string;
  assessment: string;
  plan: string;
  diagnoses: string[];
  treatments: {
    treatment: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    notes?: string;
  }[];
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions: string;
  }[];
  follow_up_instructions?: string;
  next_visit_date?: string;
  attachments?: File[];
}

export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  permissions: string[];
  clinic_access: string[];
  is_active: boolean;
  profile_settings: {
    timezone: string;
    language: string;
    date_format: string;
    time_format: string;
  };
  notification_preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
    appointment_reminders: boolean;
    system_alerts: boolean;
  };
  two_factor_enabled: boolean;
}

export interface ClinicFormData {
  name: string;
  description?: string;
  phone: string;
  email: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  working_hours: {
    [key: string]: {
      is_open: boolean;
      open_time?: string;
      close_time?: string;
      break_start?: string;
      break_end?: string;
    };
  };
  appointment_settings: {
    default_duration: number;
    booking_window_days: number;
    cancellation_window_hours: number;
    allow_online_booking: boolean;
    require_deposits: boolean;
    deposit_percentage?: number;
  };
  billing_settings: {
    currency: string;
    tax_rate: number;
    payment_methods: string[];
    invoice_terms: string;
    late_fee_percentage?: number;
  };
  notification_settings: {
    appointment_reminders: boolean;
    reminder_hours_before: number[];
    send_confirmation_emails: boolean;
    send_follow_up_surveys: boolean;
  };
  branding: {
    logo?: File;
    color_scheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
    custom_css?: string;
  };
}

// Form wizards and multi-step forms
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  validation?: ValidationRule;
  canSkip?: boolean;
  isOptional?: boolean;
  showInProgress?: boolean;
}

export interface WizardFormConfig extends Omit<FormConfig, 'fields'> {
  steps: FormStep[];
  showStepIndicator?: boolean;
  allowStepNavigation?: boolean;
  validateStepOnNext?: boolean;
  showStepValidation?: boolean;
  onStepChange?: (currentStep: number, nextStep: number) => boolean | Promise<boolean>;
  onStepComplete?: (stepId: string, values: Record<string, any>) => void;
}

export interface WizardFormState extends FormState {
  currentStep: number;
  completedSteps: string[];
  stepErrors: Record<string, string[]>;
}

// Dynamic forms
export interface DynamicFormField extends FormField {
  id: string;
  order: number;
  isCustom?: boolean;
  customComponent?: React.ComponentType<any>;
}

export interface DynamicFormConfig {
  id: string;
  name: string;
  description?: string;
  entity_type: 'pet' | 'client' | 'appointment' | 'medical_record' | 'generic';
  fields: DynamicFormField[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Form templates and presets
export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  config: FormConfig;
  preview_image?: string;
  usage_count: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface FormPreset {
  id: string;
  name: string;
  values: Record<string, any>;
  form_config_id?: string;
  is_global: boolean;
  created_by: string;
  created_at: string;
}

// Form analytics and tracking
export interface FormAnalytics {
  form_id: string;
  total_submissions: number;
  successful_submissions: number;
  failed_submissions: number;
  average_completion_time: number;
  abandonment_rate: number;
  field_analytics: {
    field_name: string;
    completion_rate: number;
    error_rate: number;
    average_time_spent: number;
  }[];
  conversion_funnel: {
    step: string;
    visitors: number;
    completion_rate: number;
  }[];
  submission_trends: {
    date: string;
    submissions: number;
    completions: number;
  }[];
}

// Form submission and storage
export interface FormSubmission {
  id: string;
  form_id: string;
  submitted_values: Record<string, any>;
  submitted_by?: string;
  submitted_at: string;
  ip_address: string;
  user_agent: string;
  completion_time: number;
  status: 'draft' | 'submitted' | 'processed' | 'archived';
  validation_errors?: Record<string, string>;
  attachments: string[];
}

export interface FormDraft {
  id: string;
  form_id: string;
  draft_values: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}
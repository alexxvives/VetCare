import { BaseEntity } from './common';

export interface FileUpload extends BaseEntity {
  clinic_id: string;
  file_name: string;
  original_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  file_url: string;
  thumbnail_url?: string;
  category: FileCategory;
  tags: string[];
  description?: string;
  uploaded_by: string; // user_id
  uploaded_at: string;
  last_accessed?: string;
  access_count: number;
  is_public: boolean;
  expiry_date?: string;
  virus_scan_status: 'pending' | 'clean' | 'infected' | 'failed';
  virus_scan_date?: string;
  metadata: FileMetadata;
  storage_provider: 'local' | 'aws_s3' | 'google_cloud' | 'azure_blob';
  storage_path: string;
  compression_ratio?: number;
  checksum: string;
  versions: FileVersion[];
  permissions: FilePermission[];
  related_entity_type?: 'pet' | 'client' | 'appointment' | 'medical_record' | 'user';
  related_entity_id?: string;
}

export type FileCategory = 
  | 'medical_image' 
  | 'lab_report' 
  | 'document' 
  | 'vaccination_certificate' 
  | 'prescription' 
  | 'invoice' 
  | 'receipt' 
  | 'consent_form' 
  | 'profile_picture' 
  | 'clinic_logo' 
  | 'other';

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number; // for videos
  page_count?: number; // for PDFs
  created_with?: string;
  camera_info?: {
    make?: string;
    model?: string;
    settings?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  keywords?: string[];
  custom_fields: Record<string, any>;
}

export interface FileVersion extends BaseEntity {
  file_id: string;
  version_number: number;
  file_name: string;
  file_size: number;
  file_path: string;
  file_url: string;
  changes_description?: string;
  uploaded_by: string;
  uploaded_at: string;
  is_current: boolean;
  checksum: string;
}

export interface FilePermission {
  user_id?: string;
  role?: string;
  permission_type: 'read' | 'write' | 'delete' | 'share';
  granted_by: string;
  granted_at: string;
  expires_at?: string;
}

export interface FileShare extends BaseEntity {
  file_id: string;
  shared_by: string; // user_id
  shared_with_email?: string;
  shared_with_user_id?: string;
  permission_type: 'read' | 'write';
  share_token: string;
  expires_at?: string;
  password_protected: boolean;
  download_limit?: number;
  download_count: number;
  access_log: FileAccessLog[];
  is_active: boolean;
  message?: string;
}

export interface FileAccessLog {
  accessed_at: string;
  ip_address: string;
  user_agent: string;
  user_id?: string;
  action: 'view' | 'download' | 'share' | 'delete';
  success: boolean;
  error_message?: string;
}

export interface FileFolder extends BaseEntity {
  clinic_id: string;
  name: string;
  description?: string;
  parent_folder_id?: string;
  path: string;
  color?: string;
  icon?: string;
  created_by: string;
  file_count: number;
  subfolder_count: number;
  total_size: number;
  permissions: FilePermission[];
  is_system_folder: boolean;
}

export interface FileTemplate extends BaseEntity {
  clinic_id: string;
  name: string;
  description?: string;
  category: FileCategory;
  template_type: 'document' | 'form' | 'certificate';
  file_type: string;
  template_file_id: string;
  placeholders: TemplatePlaceholder[];
  usage_count: number;
  is_active: boolean;
  created_by: string;
}

export interface TemplatePlaceholder {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'image' | 'signature';
  required: boolean;
  default_value?: string;
  validation_rules?: {
    min_length?: number;
    max_length?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface FileUploadProgress {
  file_id: string;
  file_name: string;
  file_size: number;
  uploaded_bytes: number;
  upload_speed: number; // bytes per second
  time_remaining: number; // seconds
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled';
  error_message?: string;
}

export interface FileCompressionSettings {
  enabled: boolean;
  quality: number; // 1-100
  max_width?: number;
  max_height?: number;
  format?: 'original' | 'jpeg' | 'webp' | 'png';
  preserve_exif: boolean;
}

export interface FileBackupSettings {
  enabled: boolean;
  retention_days: number;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  storage_provider: 'local' | 'aws_s3' | 'google_cloud' | 'azure_blob';
  encryption_enabled: boolean;
  compression_enabled: boolean;
}

// Form types
export interface FileUploadRequest {
  files: File[];
  category: FileCategory;
  description?: string;
  tags?: string[];
  folder_id?: string;
  related_entity_type?: 'pet' | 'client' | 'appointment' | 'medical_record' | 'user';
  related_entity_id?: string;
  compression_settings?: FileCompressionSettings;
  is_public?: boolean;
  expiry_date?: string;
}

export interface FileUpdateRequest {
  file_name?: string;
  description?: string;
  tags?: string[];
  category?: FileCategory;
  folder_id?: string;
  is_public?: boolean;
  expiry_date?: string;
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  parent_folder_id?: string;
  color?: string;
  icon?: string;
}

export interface CreateFileShareRequest {
  file_id: string;
  shared_with_email?: string;
  shared_with_user_id?: string;
  permission_type: 'read' | 'write';
  expires_at?: string;
  password_protected?: boolean;
  download_limit?: number;
  message?: string;
}

export interface GenerateFileFromTemplateRequest {
  template_id: string;
  file_name: string;
  placeholder_values: Record<string, any>;
  folder_id?: string;
  related_entity_type?: 'pet' | 'client' | 'appointment' | 'medical_record' | 'user';
  related_entity_id?: string;
}

export interface FileSearchParams {
  category?: FileCategory;
  file_type?: string;
  tags?: string[];
  uploaded_by?: string;
  folder_id?: string;
  date_from?: string;
  date_to?: string;
  size_min?: number;
  size_max?: number;
  has_virus_scan?: boolean;
  is_public?: boolean;
  related_entity_type?: 'pet' | 'client' | 'appointment' | 'medical_record' | 'user';
  related_entity_id?: string;
  search?: string;
  sort_by?: 'uploaded_at' | 'file_name' | 'file_size' | 'last_accessed';
  sort_order?: 'asc' | 'desc';
}

export interface FileStats {
  total_files: number;
  total_size: number;
  files_today: number;
  size_today: number;
  files_by_category: {
    category: FileCategory;
    count: number;
    total_size: number;
  }[];
  files_by_type: {
    file_type: string;
    count: number;
    total_size: number;
  }[];
  storage_usage: {
    used: number;
    total: number;
    percentage: number;
  };
  most_accessed_files: {
    file_id: string;
    file_name: string;
    access_count: number;
  }[];
  recent_uploads: {
    file_id: string;
    file_name: string;
    uploaded_at: string;
    uploaded_by: string;
  }[];
}

export interface FileValidationRules {
  allowed_types: string[];
  max_file_size: number;
  max_files_per_upload: number;
  virus_scan_required: boolean;
  require_description: boolean;
  allowed_categories: FileCategory[];
  auto_expire_days?: number;
}

export interface BulkFileOperation {
  operation: 'move' | 'copy' | 'delete' | 'tag' | 'compress';
  file_ids: string[];
  target_folder_id?: string;
  tags?: string[];
  compression_settings?: FileCompressionSettings;
}

export interface FileAuditLog extends BaseEntity {
  file_id: string;
  user_id: string;
  action: 'upload' | 'download' | 'view' | 'edit' | 'delete' | 'share' | 'move' | 'copy';
  details: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  success: boolean;
  error_message?: string;
}
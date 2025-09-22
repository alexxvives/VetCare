import { apiClient } from './apiClient';
import { 
  Clinic, 
  Organization,
  CreateClinicRequest,
  UpdateClinicRequest,
  ClinicSearchParams,
  ClinicSettings,
  AppointmentType,
  WorkingHours,
  ClinicStats
} from '../types/clinic';
import { ApiResponse, PaginatedResponse } from '../types/common';

/**
 * Clinic Service
 * Handles all clinic-related API operations
 */
class ClinicService {
  /**
   * Fetch all clinics with search parameters
   */
  async getClinics(params?: ClinicSearchParams): Promise<PaginatedResponse<Clinic>> {
    return await apiClient.getPaginated<Clinic>('/clinics', params);
  }

  /**
   * Get specific clinic by ID
   */
  async getClinicById(clinicId: string): Promise<ApiResponse<Clinic>> {
    return await apiClient.get<Clinic>(`/clinics/${clinicId}`);
  }

  /**
   * Create new clinic
   */
  async createClinic(data: CreateClinicRequest): Promise<ApiResponse<Clinic>> {
    return await apiClient.post<Clinic>('/clinics', data);
  }

  /**
   * Update existing clinic
   */
  async updateClinic(clinicId: string, data: UpdateClinicRequest): Promise<ApiResponse<Clinic>> {
    return await apiClient.put<Clinic>(`/clinics/${clinicId}`, data);
  }

  /**
   * Delete clinic
   */
  async deleteClinic(clinicId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`/clinics/${clinicId}`);
  }

  /**
   * Get clinic settings
   */
  async getClinicSettings(clinicId: string): Promise<ApiResponse<ClinicSettings>> {
    return await apiClient.get<ClinicSettings>(`/clinics/${clinicId}/settings`);
  }

  /**
   * Update clinic settings
   */
  async updateClinicSettings(
    clinicId: string, 
    settings: Partial<ClinicSettings>
  ): Promise<ApiResponse<ClinicSettings>> {
    return await apiClient.put<ClinicSettings>(`/clinics/${clinicId}/settings`, settings);
  }

  /**
   * Get clinic appointment types
   */
  async getAppointmentTypes(clinicId: string): Promise<ApiResponse<AppointmentType[]>> {
    return await apiClient.get<AppointmentType[]>(`/clinics/${clinicId}/appointment-types`);
  }

  /**
   * Create appointment type
   */
  async createAppointmentType(
    clinicId: string, 
    appointmentType: Omit<AppointmentType, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<AppointmentType>> {
    return await apiClient.post<AppointmentType>(`/clinics/${clinicId}/appointment-types`, appointmentType);
  }

  /**
   * Update appointment type
   */
  async updateAppointmentType(
    clinicId: string,
    appointmentTypeId: string,
    appointmentType: Partial<AppointmentType>
  ): Promise<ApiResponse<AppointmentType>> {
    return await apiClient.put<AppointmentType>(`/clinics/${clinicId}/appointment-types/${appointmentTypeId}`, appointmentType);
  }

  /**
   * Delete appointment type
   */
  async deleteAppointmentType(
    clinicId: string,
    appointmentTypeId: string
  ): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`/clinics/${clinicId}/appointment-types/${appointmentTypeId}`);
  }

  /**
   * Get clinic working hours
   */
  async getWorkingHours(clinicId: string): Promise<ApiResponse<WorkingHours[]>> {
    return await apiClient.get<WorkingHours[]>(`/clinics/${clinicId}/working-hours`);
  }

  /**
   * Update clinic working hours
   */
  async updateWorkingHours(
    clinicId: string,
    workingHours: WorkingHours[]
  ): Promise<ApiResponse<WorkingHours[]>> {
    return await apiClient.put<WorkingHours[]>(`/clinics/${clinicId}/working-hours`, workingHours);
  }

  /**
   * Get clinic statistics
   */
  async getStats(
    clinicId: string,
    dateRange?: { start_date: string; end_date: string }
  ): Promise<ApiResponse<ClinicStats>> {
    const params = dateRange ? { ...dateRange } : {};
    return await apiClient.get<ClinicStats>(`/clinics/${clinicId}/stats`, { params });
  }

  /**
   * Upload clinic logo
   */
  async uploadLogo(
    clinicId: string, 
    file: File
  ): Promise<ApiResponse<{ url: string }>> {
    return await apiClient.uploadFile(`/clinics/${clinicId}/logo`, file);
  }

  /**
   * Remove clinic logo
   */
  async removeLogo(clinicId: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`/clinics/${clinicId}/logo`);
  }

  /**
   * Get clinic organization information
   */
  async getOrganization(clinicId: string): Promise<ApiResponse<Organization>> {
    return await apiClient.get<Organization>(`/clinics/${clinicId}/organization`);
  }

  /**
   * Update clinic organization information
   */
  async updateOrganization(
    clinicId: string,
    organization: Partial<Organization>
  ): Promise<ApiResponse<Organization>> {
    return await apiClient.put<Organization>(`/clinics/${clinicId}/organization`, organization);
  }

  /**
   * Search clinics by location
   */
  async searchByLocation(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<ApiResponse<Clinic[]>> {
    return await apiClient.get<Clinic[]>('/clinics/search/location', {
      params: { latitude, longitude, radius }
    });
  }

  /**
   * Get clinic availability
   */
  async getAvailability(
    clinicId: string,
    date: string,
    timeSlot?: string
  ): Promise<ApiResponse<any[]>> {
    const params = { date, time_slot: timeSlot };
    return await apiClient.get<any[]>(`/clinics/${clinicId}/availability`, { params });
  }

  /**
   * Get clinic calendar events
   */
  async getCalendarEvents(
    clinicId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<any[]>> {
    const params = { start_date: startDate, end_date: endDate };
    return await apiClient.get<any[]>(`/clinics/${clinicId}/calendar`, { params });
  }

  /**
   * Export clinic data
   */
  async exportData(
    clinicId: string,
    format: 'csv' | 'excel' | 'pdf',
    dataType: 'appointments' | 'clients' | 'pets' | 'medical_records'
  ): Promise<Blob> {
    return await apiClient.downloadFile(`/clinics/${clinicId}/export?format=${format}&data_type=${dataType}`);
  }

  /**
   * Backup clinic data
   */
  async backupData(clinicId: string): Promise<ApiResponse<{ backup_id: string; download_url: string }>> {
    return await apiClient.post<{ backup_id: string; download_url: string }>(`/clinics/${clinicId}/backup`);
  }

  /**
   * Restore clinic data from backup
   */
  async restoreData(
    clinicId: string, 
    backupId: string
  ): Promise<ApiResponse<void>> {
    return await apiClient.post<void>(`/clinics/${clinicId}/restore`, { backup_id: backupId });
  }
}

// Export singleton instance
export const clinicService = new ClinicService();
export default clinicService;
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  ApiResponse,
  PaginatedResponse
} from '../types/common';
import {
  ApiError,
  ApiRequestConfig,
  AuthTokens
} from '../types/api';

// Extend Axios config to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 30000; // 30 seconds

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add clinic context if available
        const clinicId = this.getCurrentClinicId();
        if (clinicId && config.headers) {
          config.headers['X-Clinic-ID'] = clinicId;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth and errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Add response time for monitoring
        const config = response.config as ExtendedAxiosRequestConfig;
        if (config.metadata?.startTime) {
          const responseTime = new Date().getTime() - config.metadata.startTime.getTime();
          console.debug(`API Request to ${response.config.url} took ${responseTime}ms`);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.instance(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.processQueue(null, newToken);
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleAuthError();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other HTTP errors
        const apiError = this.transformError(error);
        return Promise.reject(apiError);
      }
    );
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });
    
    this.failedQueue = [];
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<ApiResponse<AuthTokens>>(
        `${API_BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken }
      );

      const { access_token, refresh_token: newRefreshToken } = response.data.data!;
      this.setTokens({ access_token, refresh_token: newRefreshToken });
      
      return access_token;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private transformError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        message: data?.message || `HTTP Error ${status}`,
        code: data?.code || `HTTP_${status}`,
        status,
        details: data?.details || null,
        timestamp: new Date().toISOString(),
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - no response received',
        code: 'NETWORK_ERROR',
        status: 0,
        details: null,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
        status: 0,
        details: null,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private handleAuthError(): void {
    this.clearTokens();
    // Dispatch logout action or redirect to login
    // This will be handled by the Redux store later
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private getCurrentClinicId(): string | null {
    return localStorage.getItem('current_clinic_id');
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_clinic_id');
  }

  // Public API methods
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Paginated requests
  public async getPaginated<T>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<PaginatedResponse<T>> {
    const response = await this.instance.get<PaginatedResponse<T>>(url, {
      ...config,
      params,
    });
    return response.data;
  }

  // File upload
  public async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  // Multiple file upload
  public async uploadFiles<T>(
    url: string,
    files: File[],
    onProgress?: (progress: number) => void,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  // Download file
  public async downloadFile(
    url: string,
    filename?: string,
    config?: ApiRequestConfig
  ): Promise<Blob> {
    const response = await this.instance.get(url, {
      ...config,
      responseType: 'blob',
    });

    // Create download link if filename provided
    if (filename) {
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }

    return response.data;
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Set clinic context
  public setCurrentClinic(clinicId: string): void {
    localStorage.setItem('current_clinic_id', clinicId);
  }

  // Clear clinic context
  public clearCurrentClinic(): void {
    localStorage.removeItem('current_clinic_id');
  }

  // Get raw axios instance for custom requests
  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
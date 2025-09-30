import { apiClient } from './apiClient';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterData, 
  PasswordResetRequest, 
  PasswordResetConfirm, 
  ChangePasswordRequest,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest
} from '../types/user';
import { ApiResponse } from '../types/common';

export class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return await apiClient.post<LoginResponse>('/auth/login', credentials);
  }

  /**
   * Register new user account
   */
  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; message: string }>> {
    return await apiClient.post<{ user: User; message: string }>('/auth/register', userData);
  }

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    
    // Clear local storage on successful logout
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_clinic_id');
    
    return response;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<{ access_token: string; expires_in: number }>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return await apiClient.post<{ access_token: string; expires_in: number }>('/auth/refresh', {
      refresh_token: refreshToken
    });
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/forgot-password', data);
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: PasswordResetConfirm): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/reset-password', data);
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/change-password', data);
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/verify-email', { token });
  }

  /**
   * Resend email verification
   */
  async resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/resend-verification', { email });
  }

  /**
   * Setup two-factor authentication
   */
  async setupTwoFactor(): Promise<ApiResponse<TwoFactorSetupResponse>> {
    return await apiClient.post<TwoFactorSetupResponse>('/auth/2fa/setup');
  }

  /**
   * Verify two-factor authentication setup
   */
  async verifyTwoFactorSetup(data: TwoFactorVerifyRequest): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/2fa/verify-setup', data);
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(password: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/auth/2fa/disable', { password });
  }

  /**
   * Verify two-factor authentication token during login
   */
  async verifyTwoFactor(data: TwoFactorVerifyRequest): Promise<ApiResponse<LoginResponse>> {
    return await apiClient.post<LoginResponse>('/auth/2fa/verify', data);
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>('/auth/me');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Set authentication tokens
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  /**
   * Clear authentication tokens
   */
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_clinic_id');
  }

  /**
   * Decode JWT token payload
   */
  decodeToken(token?: string): any {
    const tokenToUse = token || this.getAccessToken();
    if (!tokenToUse) return null;

    try {
      return JSON.parse(atob(tokenToUse.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  /**
   * Get user role from token
   */
  getUserRole(): string | null {
    const payload = this.decodeToken();
    return payload?.role || null;
  }

  /**
   * Get user permissions from token
   */
  getUserPermissions(): string[] {
    const payload = this.decodeToken();
    return payload?.permissions || [];
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasRole(roles: string | string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(userRole);
  }

  /**
   * Get clinic access for current user
   */
  getClinicAccess(): string[] {
    const payload = this.decodeToken();
    return payload?.clinic_access || [];
  }

  /**
   * Check if user has access to specific clinic
   */
  hasClinicAccess(clinicId: string): boolean {
    const clinicAccess = this.getClinicAccess();
    return clinicAccess.includes(clinicId);
  }

  /**
   * Get current selected clinic ID
   */
  getCurrentClinicId(): string | null {
    return localStorage.getItem('current_clinic_id');
  }

  /**
   * Set current selected clinic ID
   */
  setCurrentClinicId(clinicId: string): void {
    if (this.hasClinicAccess(clinicId)) {
      localStorage.setItem('current_clinic_id', clinicId);
      apiClient.setCurrentClinic(clinicId);
    } else {
      throw new Error('User does not have access to this clinic');
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;
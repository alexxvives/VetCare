import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginRequest, LoginResponse, RegisterData } from '../../types/user';
import { authService } from '../../services/authService';
import { ApiResponse } from '../../types/common';

// State interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  isAccountLocked: boolean;
  lockoutExpiry: string | null;
  rememberMe: boolean;
  twoFactorRequired: boolean;
  tempToken: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  isAccountLocked: false,
  lockoutExpiry: null,
  rememberMe: false,
  twoFactorRequired: false,
  tempToken: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error during login');
    }
  }
);

export const registerUser = createAsyncThunk<
  { user: User; message: string },
  RegisterData,
  { rejectValue: string }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error during registration');
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      // Even if logout API fails, we should clear local state
      console.warn('Logout API failed:', error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get user data');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const refreshToken = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      if (response.success && response.data) {
        return response.data.access_token;
      } else {
        return rejectWithValue(response.message || 'Token refresh failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const changePassword = createAsyncThunk<
  string,
  { currentPassword: string; newPassword: string; newPasswordConfirmation: string },
  { rejectValue: string }
>(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.newPasswordConfirmation,
      });
      if (response.success) {
        return response.message || 'Password changed successfully';
      } else {
        return rejectWithValue(response.message || 'Password change failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      Object.assign(state, initialState);
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
      if (state.loginAttempts >= 5) {
        state.isAccountLocked = true;
        state.lockoutExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
      }
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.isAccountLocked = false;
      state.lockoutExpiry = null;
    },
    checkLockoutExpiry: (state) => {
      if (state.lockoutExpiry && new Date() > new Date(state.lockoutExpiry)) {
        state.isAccountLocked = false;
        state.lockoutExpiry = null;
        state.loginAttempts = 0;
      }
    },
    setTwoFactorRequired: (state, action: PayloadAction<{ required: boolean; tempToken?: string }>) => {
      state.twoFactorRequired = action.payload.required;
      state.tempToken = action.payload.tempToken || null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    checkAuthStatus: (state) => {
      const isAuth = authService.isAuthenticated();
      state.isAuthenticated = isAuth;
      if (!isAuth) {
        state.user = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        state.loginAttempts = 0;
        state.isAccountLocked = false;
        state.lockoutExpiry = null;
        state.twoFactorRequired = false;
        state.tempToken = null;
        
        // Store tokens
        authService.setTokens(
          action.payload.tokens.access_token,
          action.payload.tokens.refresh_token
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
        
        // Handle specific error cases
        if (action.payload?.includes('two-factor') || action.payload?.includes('2FA')) {
          state.twoFactorRequired = true;
        } else {
          state.loginAttempts += 1;
          if (state.loginAttempts >= 5) {
            state.isAccountLocked = true;
            state.lockoutExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
          }
        }
      });

    // Register cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Don't auto-login after registration, user needs to verify email
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Logout cases
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear state even if logout API fails
        Object.assign(state, initialState);
      });

    // Get current user cases
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get user data';
        state.isAuthenticated = false;
        state.user = null;
      });

    // Refresh token cases
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        // Token refreshed successfully, update stored token
        authService.setTokens(action.payload);
      })
      .addCase(refreshToken.rejected, (state) => {
        // Token refresh failed, logout user
        Object.assign(state, initialState);
      });

    // Change password cases
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Password change failed';
      });
  },
});

// Export actions
export const {
  clearError,
  clearAuthState,
  setRememberMe,
  incrementLoginAttempts,
  resetLoginAttempts,
  checkLockoutExpiry,
  setTwoFactorRequired,
  updateUserProfile,
  checkAuthStatus,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectUserPermissions = (state: { auth: AuthState }) => state.auth.user?.permissions;
export const selectTwoFactorRequired = (state: { auth: AuthState }) => state.auth.twoFactorRequired;
export const selectIsAccountLocked = (state: { auth: AuthState }) => state.auth.isAccountLocked;

// Export reducer
export default authSlice.reducer;
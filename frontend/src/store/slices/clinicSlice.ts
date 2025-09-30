import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Clinic, ClinicSettings, AppointmentType, ClinicStats } from '../../types/clinic';
import { clinicService } from '../../services/clinicService';

// State interface
export interface ClinicState {
  currentClinic: Clinic | null;
  availableClinics: Clinic[];
  clinicSettings: ClinicSettings | null;
  appointmentTypes: AppointmentType[];
  clinicStats: ClinicStats | null;
  isLoading: boolean;
  error: string | null;
  settingsLoading: boolean;
  statsLoading: boolean;
  lastUpdated: string | null;
}

// Initial state
const initialState: ClinicState = {
  currentClinic: null,
  availableClinics: [],
  clinicSettings: null,
  appointmentTypes: [],
  clinicStats: null,
  isLoading: false,
  error: null,
  settingsLoading: false,
  statsLoading: false,
  lastUpdated: null,
};

// Async thunks
export const fetchAvailableClinics = createAsyncThunk<
  Clinic[],
  void,
  { rejectValue: string }
>(
  'clinic/fetchAvailableClinics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clinicService.getClinics();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch clinics');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchClinicById = createAsyncThunk<
  Clinic,
  string,
  { rejectValue: string }
>(
  'clinic/fetchClinicById',
  async (clinicId, { rejectWithValue }) => {
    try {
      const response = await clinicService.getClinicById(clinicId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch clinic');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchClinicSettings = createAsyncThunk<
  ClinicSettings,
  string,
  { rejectValue: string }
>(
  'clinic/fetchClinicSettings',
  async (clinicId, { rejectWithValue }) => {
    try {
      const response = await clinicService.getClinicSettings(clinicId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch clinic settings');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateClinicSettings = createAsyncThunk<
  ClinicSettings,
  { clinicId: string; settings: Partial<ClinicSettings> },
  { rejectValue: string }
>(
  'clinic/updateClinicSettings',
  async ({ clinicId, settings }, { rejectWithValue }) => {
    try {
      const response = await clinicService.updateClinicSettings(clinicId, settings);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update clinic settings');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchAppointmentTypes = createAsyncThunk<
  AppointmentType[],
  string,
  { rejectValue: string }
>(
  'clinic/fetchAppointmentTypes',
  async (clinicId, { rejectWithValue }) => {
    try {
      const response = await clinicService.getAppointmentTypes(clinicId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch appointment types');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const createAppointmentType = createAsyncThunk<
  AppointmentType,
  { clinicId: string; appointmentType: Omit<AppointmentType, 'id'> },
  { rejectValue: string }
>(
  'clinic/createAppointmentType',
  async ({ clinicId, appointmentType }, { rejectWithValue }) => {
    try {
      const response = await clinicService.createAppointmentType(clinicId, appointmentType);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create appointment type');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchClinicStats = createAsyncThunk<
  ClinicStats,
  { clinicId: string; dateRange?: { start_date: string; end_date: string } },
  { rejectValue: string }
>(
  'clinic/fetchClinicStats',
  async ({ clinicId, dateRange }, { rejectWithValue }) => {
    try {
      const response = await clinicService.getStats(clinicId, dateRange);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch clinic stats');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const switchClinic = createAsyncThunk<
  Clinic,
  string,
  { rejectValue: string }
>(
  'clinic/switchClinic',
  async (clinicId, { rejectWithValue }) => {
    try {
      const response = await clinicService.getClinicById(clinicId);
      if (response.success && response.data) {
        // Store the active clinic ID in localStorage
        localStorage.setItem('current_clinic_id', clinicId);
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to switch clinic');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Access denied or network error');
    }
  }
);

// Clinic slice
const clinicSlice = createSlice({
  name: 'clinic',
  initialState,
  reducers: {
    clearClinicError: (state) => {
      state.error = null;
    },
    clearClinicState: (state) => {
      Object.assign(state, initialState);
    },
    setCurrentClinic: (state, action: PayloadAction<Clinic>) => {
      state.currentClinic = action.payload;
      localStorage.setItem('current_clinic_id', action.payload.id);
    },
    clearCurrentClinic: (state) => {
      state.currentClinic = null;
      state.clinicSettings = null;
      state.appointmentTypes = [];
      state.clinicStats = null;
      localStorage.removeItem('current_clinic_id');
    },
    updateAppointmentType: (state, action: PayloadAction<AppointmentType>) => {
      const index = state.appointmentTypes.findIndex(type => type.id === action.payload.id);
      if (index !== -1) {
        state.appointmentTypes[index] = action.payload;
      }
    },
    deleteAppointmentType: (state, action: PayloadAction<string>) => {
      state.appointmentTypes = state.appointmentTypes.filter(type => type.id !== action.payload);
    },
    refreshLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
    updateClinicData: (state, action: PayloadAction<Partial<Clinic>>) => {
      if (state.currentClinic) {
        state.currentClinic = { ...state.currentClinic, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch available clinics
    builder
      .addCase(fetchAvailableClinics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableClinics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableClinics = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAvailableClinics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch clinics';
      });

    // Fetch clinic by ID
    builder
      .addCase(fetchClinicById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClinicById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClinic = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchClinicById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch clinic';
      });

    // Fetch clinic settings
    builder
      .addCase(fetchClinicSettings.pending, (state) => {
        state.settingsLoading = true;
        state.error = null;
      })
      .addCase(fetchClinicSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.clinicSettings = action.payload;
        state.error = null;
      })
      .addCase(fetchClinicSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload || 'Failed to fetch clinic settings';
      });

    // Update clinic settings
    builder
      .addCase(updateClinicSettings.pending, (state) => {
        state.settingsLoading = true;
        state.error = null;
      })
      .addCase(updateClinicSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.clinicSettings = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateClinicSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload || 'Failed to update clinic settings';
      });

    // Fetch appointment types
    builder
      .addCase(fetchAppointmentTypes.fulfilled, (state, action) => {
        state.appointmentTypes = action.payload;
      })
      .addCase(fetchAppointmentTypes.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch appointment types';
      });

    // Create appointment type
    builder
      .addCase(createAppointmentType.fulfilled, (state, action) => {
        state.appointmentTypes.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createAppointmentType.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create appointment type';
      });

    // Fetch clinic stats
    builder
      .addCase(fetchClinicStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchClinicStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.clinicStats = action.payload;
        state.error = null;
      })
      .addCase(fetchClinicStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload || 'Failed to fetch clinic stats';
      });

    // Switch clinic
    builder
      .addCase(switchClinic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(switchClinic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClinic = action.payload;
        state.error = null;
        // Clear previous clinic data
        state.clinicSettings = null;
        state.appointmentTypes = [];
        state.clinicStats = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(switchClinic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to switch clinic';
      });
  },
});

// Export actions
export const {
  clearClinicError,
  clearClinicState,
  setCurrentClinic,
  clearCurrentClinic,
  updateAppointmentType,
  deleteAppointmentType,
  refreshLastUpdated,
  updateClinicData,
} = clinicSlice.actions;

// Selectors
export const selectClinic = (state: { clinic: ClinicState }) => state.clinic;
export const selectCurrentClinic = (state: { clinic: ClinicState }) => state.clinic.currentClinic;
export const selectAvailableClinics = (state: { clinic: ClinicState }) => state.clinic.availableClinics;
export const selectClinicSettings = (state: { clinic: ClinicState }) => state.clinic.clinicSettings;
export const selectAppointmentTypes = (state: { clinic: ClinicState }) => state.clinic.appointmentTypes;
export const selectClinicStats = (state: { clinic: ClinicState }) => state.clinic.clinicStats;
export const selectClinicLoading = (state: { clinic: ClinicState }) => state.clinic.isLoading;
export const selectClinicError = (state: { clinic: ClinicState }) => state.clinic.error;
export const selectSettingsLoading = (state: { clinic: ClinicState }) => state.clinic.settingsLoading;
export const selectStatsLoading = (state: { clinic: ClinicState }) => state.clinic.statsLoading;
export const selectCurrentClinicId = (state: { clinic: ClinicState }) => state.clinic.currentClinic?.id;

// Export reducer
export default clinicSlice.reducer;
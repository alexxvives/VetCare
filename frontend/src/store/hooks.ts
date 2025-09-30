import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from './rootReducer';
import type { AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for common selector patterns
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useClinic = () => {
  return useAppSelector((state) => state.clinic);
};

export const useUI = () => {
  return useAppSelector((state) => state.ui);
};

// Specific auth selectors
export const useCurrentUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

export const useAuthLoading = () => {
  return useAppSelector((state) => state.auth.isLoading);
};

export const useAuthError = () => {
  return useAppSelector((state) => state.auth.error);
};

// Specific clinic selectors
export const useCurrentClinic = () => {
  return useAppSelector((state) => state.clinic.currentClinic);
};

export const useAvailableClinics = () => {
  return useAppSelector((state) => state.clinic.availableClinics);
};

export const useClinicSettings = () => {
  return useAppSelector((state) => state.clinic.clinicSettings);
};

// Specific UI selectors
export const useNotifications = () => {
  return useAppSelector((state) => state.ui.notifications);
};

export const useModals = () => {
  return useAppSelector((state) => state.ui.modals);
};

export const useTheme = () => {
  return useAppSelector((state) => state.ui.theme);
};

export const useIsMobile = () => {
  return useAppSelector((state) => state.ui.isMobile);
};

// Loading state hook
export const useLoading = (key: string) => {
  return useAppSelector((state) => state.ui.loading[key] || false);
};

// Feature flag hook
export const useFeature = (feature: string) => {
  return useAppSelector((state) => state.ui.features[feature] || false);
};
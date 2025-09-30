// Redux Store Configuration
// Main store setup and slice exports

// Store configuration
export { store, persistor, purgePersistedState, flushPersistor } from './store';
export type { AppStore, AppDispatch, AppState, RootState } from './store';

// Root reducer
export { default as rootReducer } from './rootReducer';

// Redux hooks
export * from './hooks';

// Slice exports (completed)
export { default as authSlice } from './slices/authSlice';
export { default as clinicSlice } from './slices/clinicSlice';
export { default as uiSlice } from './slices/uiSlice';

// Re-export all slice actions (will be used by components)
export * from './slices/authSlice';
export * from './slices/clinicSlice';
export * from './slices/uiSlice';

// Default store export for Provider
export { store as default } from './store';
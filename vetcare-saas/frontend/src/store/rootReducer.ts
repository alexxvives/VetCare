import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clinicReducer from './slices/clinicSlice';
import uiReducer from './slices/uiSlice';

// Root reducer combining all slices
const rootReducer = combineReducers({
  auth: authReducer,
  clinic: clinicReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
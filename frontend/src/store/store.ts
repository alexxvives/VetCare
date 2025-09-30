import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';
import rootReducer, { RootState } from './rootReducer';

// Transform to exclude sensitive data from persistence
const authTransform = createTransform(
  // Transform state on its way to being serialized and persisted
  (inboundState: any) => {
    // Remove sensitive data before persisting
    const { tempToken, ...persistedState } = inboundState;
    return persistedState;
  },
  // Transform state being rehydrated
  (outboundState: any) => {
    // Add back default values for non-persisted fields
    return {
      ...outboundState,
      tempToken: null,
      isLoading: false,
      error: null,
    };
  },
  // Define which reducers this transform is applied to
  { whitelist: ['auth'] }
);

// Transform to exclude UI loading states from persistence
const uiTransform = createTransform(
  (inboundState: any) => {
    // Don't persist loading states, modals, or temporary UI state
    const {
      loading,
      modals,
      globalSearch,
      ...persistedState
    } = inboundState;
    return persistedState;
  },
  (outboundState: any) => {
    return {
      ...outboundState,
      loading: {},
      modals: [],
      globalSearch: {
        isOpen: false,
        query: '',
        results: [],
        isLoading: false,
      },
    };
  },
  { whitelist: ['ui'] }
);

// Redux persist configuration
const persistConfig = {
  key: 'vetcare-root',
  version: 1,
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
  blacklist: ['clinic'], // Don't persist clinic data (refetch on reload)
  transforms: [authTransform, uiTransform],
  // Migrate function for handling version changes
  migrate: (state: any) => {
    // Handle migrations when persisted state structure changes
    return Promise.resolve(state);
  },
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
// @ts-ignore - Redux Persist typing issue
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['ui.modals', 'ui.notifications'],
      },
      // Enable additional checks in development
      immutableCheck: process.env.NODE_ENV === 'development',
      thunk: {
        extraArgument: {
          // You can inject additional dependencies here if needed
        },
      },
    }).concat([
      // Add custom middleware here if needed
    ]),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV === 'development' && {
    name: 'VetCare Redux Store',
    trace: true,
    traceLimit: 25,
  },
  // Preloaded state (useful for SSR or testing)
  preloadedState: undefined,
});

// Create persistor
export const persistor = persistStore(store);

// Type definitions for TypeScript
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export type { RootState };

// Helper function to get current state
export const getCurrentState = () => store.getState();

// Helper function to check if store is rehydrated
export const isStoreRehydrated = (state: AppState): boolean => {
  return (state as any)._persist?.rehydrated || false;
};

// Action to purge persisted state (useful for logout)
export const purgePersistedState = async (): Promise<void> => {
  await persistor.purge();
};

// Action to flush pending persistor operations
export const flushPersistor = async (): Promise<void> => {
  await persistor.flush();
};

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Make store available in browser console for debugging
  (window as any).__VETCARE_STORE__ = store;
  (window as any).__VETCARE_PERSISTOR__ = persistor;
}

export default store;
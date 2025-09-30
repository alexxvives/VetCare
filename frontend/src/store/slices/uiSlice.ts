import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types for notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  timestamp: string;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

// Types for modals
export interface Modal {
  id: string;
  type: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  data?: any;
  onClose?: () => void;
}

// Types for loading states
export interface LoadingState {
  [key: string]: boolean;
}

// UI State interface
export interface UIState {
  // Layout
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Theme
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  
  // Notifications
  notifications: Notification[];
  maxNotifications: number;
  
  // Modals
  modals: Modal[];
  
  // Loading states
  loading: LoadingState;
  
  // Search
  globalSearch: {
    isOpen: boolean;
    query: string;
    results: any[];
    isLoading: boolean;
  };
  
  // Page settings
  pageTitle: string;
  breadcrumbs: { label: string; path?: string }[];
  
  // Mobile responsiveness
  isMobile: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Feature flags
  features: Record<string, boolean>;
  
  // User preferences
  preferences: {
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    timezone: string;
    itemsPerPage: number;
    autoRefresh: boolean;
    autoRefreshInterval: number;
  };
  
  // Quick actions menu
  quickActions: {
    isOpen: boolean;
    recentActions: string[];
  };
}

// Initial state
const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'light',
  primaryColor: '#1976d2',
  notifications: [],
  maxNotifications: 5,
  modals: [],
  loading: {},
  globalSearch: {
    isOpen: false,
    query: '',
    results: [],
    isLoading: false,
  },
  pageTitle: 'VetCare',
  breadcrumbs: [],
  isMobile: false,
  screenSize: 'lg',
  features: {
    darkMode: true,
    notifications: true,
    autoSave: true,
    advancedSearch: true,
    exportData: true,
    bulkActions: true,
  },
  preferences: {
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: 'America/New_York',
    itemsPerPage: 25,
    autoRefresh: false,
    autoRefreshInterval: 30000, // 30 seconds
  },
  quickActions: {
    isOpen: false,
    recentActions: [],
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },

    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      
      state.notifications.unshift(notification);
      
      // Limit number of notifications
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        // You could add a 'read' property to the notification type if needed
      }
    },

    // Modal actions
    openModal: (state, action: PayloadAction<Omit<Modal, 'id'>>) => {
      const modal: Modal = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      };
      state.modals.push(modal);
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(m => m.id !== action.payload);
    },
    closeAllModals: (state) => {
      state.modals = [];
    },
    closeTopModal: (state) => {
      if (state.modals.length > 0) {
        state.modals.pop();
      }
    },

    // Loading actions
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },
    clearAllLoading: (state) => {
      state.loading = {};
    },

    // Global search actions
    openGlobalSearch: (state) => {
      state.globalSearch.isOpen = true;
    },
    closeGlobalSearch: (state) => {
      state.globalSearch.isOpen = false;
      state.globalSearch.query = '';
      state.globalSearch.results = [];
    },
    setGlobalSearchQuery: (state, action: PayloadAction<string>) => {
      state.globalSearch.query = action.payload;
    },
    setGlobalSearchResults: (state, action: PayloadAction<any[]>) => {
      state.globalSearch.results = action.payload;
    },
    setGlobalSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.globalSearch.isLoading = action.payload;
    },

    // Page actions
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
      document.title = `${action.payload} - VetCare`;
    },
    setBreadcrumbs: (state, action: PayloadAction<{ label: string; path?: string }[]>) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<{ label: string; path?: string }>) => {
      state.breadcrumbs.push(action.payload);
    },

    // Responsive actions
    setScreenSize: (state, action: PayloadAction<'xs' | 'sm' | 'md' | 'lg' | 'xl'>) => {
      state.screenSize = action.payload;
      state.isMobile = ['xs', 'sm'].includes(action.payload);
      
      // Auto-collapse sidebar on mobile
      if (state.isMobile) {
        state.sidebarOpen = false;
      }
    },

    // Feature flags
    setFeature: (state, action: PayloadAction<{ feature: string; enabled: boolean }>) => {
      state.features[action.payload.feature] = action.payload.enabled;
    },
    toggleFeature: (state, action: PayloadAction<string>) => {
      state.features[action.payload] = !state.features[action.payload];
    },

    // Preferences
    updatePreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    // Quick actions
    toggleQuickActions: (state) => {
      state.quickActions.isOpen = !state.quickActions.isOpen;
    },
    setQuickActionsOpen: (state, action: PayloadAction<boolean>) => {
      state.quickActions.isOpen = action.payload;
    },
    addRecentAction: (state, action: PayloadAction<string>) => {
      const actions = state.quickActions.recentActions;
      const actionIndex = actions.indexOf(action.payload);
      
      if (actionIndex > -1) {
        // Move to front if already exists
        actions.splice(actionIndex, 1);
      }
      
      actions.unshift(action.payload);
      
      // Keep only last 10 actions
      if (actions.length > 10) {
        actions.pop();
      }
    },

    // Utility actions
    resetUIState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Export actions
export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setTheme,
  setPrimaryColor,
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  openModal,
  closeModal,
  closeAllModals,
  closeTopModal,
  setLoading,
  clearLoading,
  clearAllLoading,
  openGlobalSearch,
  closeGlobalSearch,
  setGlobalSearchQuery,
  setGlobalSearchResults,
  setGlobalSearchLoading,
  setPageTitle,
  setBreadcrumbs,
  addBreadcrumb,
  setScreenSize,
  setFeature,
  toggleFeature,
  updatePreferences,
  toggleQuickActions,
  setQuickActionsOpen,
  addRecentAction,
  resetUIState,
} = uiSlice.actions;

// Selectors
export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectLoading = (state: { ui: UIState }) => state.ui.loading;
export const selectGlobalSearch = (state: { ui: UIState }) => state.ui.globalSearch;
export const selectPageTitle = (state: { ui: UIState }) => state.ui.pageTitle;
export const selectBreadcrumbs = (state: { ui: UIState }) => state.ui.breadcrumbs;
export const selectIsMobile = (state: { ui: UIState }) => state.ui.isMobile;
export const selectScreenSize = (state: { ui: UIState }) => state.ui.screenSize;
export const selectFeatures = (state: { ui: UIState }) => state.ui.features;
export const selectPreferences = (state: { ui: UIState }) => state.ui.preferences;
export const selectQuickActions = (state: { ui: UIState }) => state.ui.quickActions;

// Helper selectors
export const selectIsLoading = (key: string) => (state: { ui: UIState }) => 
  state.ui.loading[key] || false;

export const selectIsFeatureEnabled = (feature: string) => (state: { ui: UIState }) => 
  state.ui.features[feature] || false;

export const selectTopModal = (state: { ui: UIState }) => 
  state.ui.modals.length > 0 ? state.ui.modals[state.ui.modals.length - 1] : null;

// Export reducer
export default uiSlice.reducer;
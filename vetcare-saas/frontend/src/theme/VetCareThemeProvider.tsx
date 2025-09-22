import React, { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vetCareTheme } from './index';

interface VetCareThemeProviderProps {
  children: ReactNode;
}

/**
 * VetCare Theme Provider
 * Wraps the application with Material-UI theme, CSS baseline, and date picker localization
 */
export const VetCareThemeProvider: React.FC<VetCareThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={vetCareTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default VetCareThemeProvider;
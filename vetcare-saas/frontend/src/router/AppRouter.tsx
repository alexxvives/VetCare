import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Route Components (will be created)
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AppointmentsPage from '../pages/appointments/AppointmentsPage';
import ClientsPage from '../pages/clients/ClientsPage';
import PetsPage from '../pages/pets/PetsPage';
import MedicalRecordsPage from '../pages/medical/MedicalRecordsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';

// Route Guards
import ProtectedRoute from './guards/ProtectedRoute';
import RoleGuard from './guards/RoleGuard';
import ClinicGuard from './guards/ClinicGuard';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';

// Types
import { RootState } from '../store/store';

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Authentication */}
        <Route
          path="/auth/*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout />
            )
          }
        >
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Protected Routes - Main Application */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ClinicGuard>
                <AppLayout />
              </ClinicGuard>
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Appointments */}
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/:id" element={<AppointmentsPage />} />
          
          {/* Clients Management */}
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientsPage />} />
          
          {/* Pets Management */}
          <Route path="pets" element={<PetsPage />} />
          <Route path="pets/:id" element={<PetsPage />} />
          
          {/* Medical Records */}
          <Route path="medical" element={<MedicalRecordsPage />} />
          <Route path="medical/:id" element={<MedicalRecordsPage />} />
          
          {/* Reports - Admin/Vet Only */}
          <Route
            path="reports"
            element={
              <RoleGuard allowedRoles={['clinic_admin', 'veterinarian']}>
                <ReportsPage />
              </RoleGuard>
            }
          />
          
          {/* Settings - Admin Only */}
          <Route
            path="settings"
            element={
              <RoleGuard allowedRoles={['clinic_admin']}>
                <SettingsPage />
              </RoleGuard>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
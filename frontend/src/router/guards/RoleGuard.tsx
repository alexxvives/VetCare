import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { UserRole } from '../../types/common';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: string;
  showError?: boolean;
}

/**
 * RoleGuard Component
 * Protects routes based on user roles
 * Redirects unauthorized users or shows error message
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = '/app/dashboard',
  showError = false 
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Check if user has required role
  const hasPermission = user && allowedRoles.includes(user.role);

  if (!hasPermission) {
    if (showError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl text-red-500 mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required roles: {allowedRoles.join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Your role: {user?.role || 'none'}
            </p>
          </div>
        </div>
      );
    }

    // Redirect to fallback route
    return <Navigate to={fallback} replace />;
  }

  // Render protected content
  return <>{children}</>;
};

export default RoleGuard;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: string;
}

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = '/auth/login' 
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallback} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
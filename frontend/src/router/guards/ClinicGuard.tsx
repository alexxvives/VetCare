import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

interface ClinicGuardProps {
  children: React.ReactNode;
}

/**
 * ClinicGuard Component
 * Ensures user has access to a clinic context
 * Handles clinic selection and context switching
 */
const ClinicGuard: React.FC<ClinicGuardProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentClinic, availableClinics, isLoading } = useSelector((state: RootState) => state.clinic);

  useEffect(() => {
    // If user is authenticated but no clinic context is set
    if (user && !currentClinic && user.clinic_access.length > 0) {
      // Check if there's a stored clinic ID in localStorage
      const storedClinicId = localStorage.getItem('current_clinic_id');
      
      if (storedClinicId && user.clinic_access.includes(storedClinicId)) {
        // Restore the clinic context from localStorage
        // dispatch(switchClinic(storedClinicId));
      } else {
        // Default to the first available clinic
        // const defaultClinicId = user.clinic_access[0];
        // dispatch(switchClinic(defaultClinicId));
      }
    }
  }, [user, currentClinic, dispatch]);

  // Show loading state while setting up clinic context
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up clinic context...</p>
        </div>
      </div>
    );
  }

  // Show clinic selection if user has no clinic access
  if (user && user.clinic_access.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl text-yellow-500 mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Clinic Access</h1>
          <p className="text-gray-600 mb-4">
            You don't have access to any clinics. Please contact your administrator.
          </p>
          <button 
            onClick={() => window.location.href = '/auth/logout'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Show clinic selection if user has multiple clinics but none selected
  if (user && user.clinic_access.length > 1 && !currentClinic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Select Clinic</h1>
          <p className="text-gray-600 mb-6">
            Please select which clinic you'd like to access:
          </p>
          <div className="space-y-3">
            {availableClinics.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => {
                  // dispatch(switchClinic(clinic.id));
                }}
                className="w-full p-3 text-left border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="font-medium">{clinic.name}</div>
                <div className="text-sm text-gray-500">{clinic.address}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render protected content with clinic context
  return <>{children}</>;
};

export default ClinicGuard;
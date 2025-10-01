import React from 'react';

interface ClinicGuardProps {
  children: React.ReactNode;
}

/**
 * ClinicGuard Component
 * Simplified for MVP - allows all authenticated users
 * TODO: Implement proper clinic access control in future iterations
 */
const ClinicGuard: React.FC<ClinicGuardProps> = ({ children }) => {
  // For MVP, just render children - no clinic access restrictions
  return <>{children}</>;
};

export default ClinicGuard;
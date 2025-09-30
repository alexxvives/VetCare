import express from 'express';
import { 
  requireAuth, 
  requireRole, 
  requirePermission, 
  requireClinicAccess,
  injectTenantContext 
} from '../middleware/auth.js';

const router = express.Router();

/**
 * Protected Routes Example
 * Demonstrates how to use authentication middleware
 */

// Basic protected route
router.get('/profile', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role,
      clinic_access: req.user.clinic_access,
      organization_id: req.user.organization_id
    }
  });
});

// Role-based protection
router.get('/admin-only', [
  requireAuth,
  requireRole('super_admin', 'organization_admin')
], (req, res) => {
  res.json({
    success: true,
    message: 'Admin access granted',
    user_role: req.user.role
  });
});

// Permission-based protection
router.get('/view-medical-records', [
  requireAuth,
  requirePermission('medical_records.read')
], (req, res) => {
  res.json({
    success: true,
    message: 'Medical records access granted',
    permissions: req.user.getPermissions()
  });
});

// Clinic-specific access
router.get('/clinic/:clinic_id/dashboard', [
  requireAuth,
  requireClinicAccess('clinic_id'),
  injectTenantContext
], (req, res) => {
  res.json({
    success: true,
    message: 'Clinic dashboard access granted',
    clinic_id: req.clinicId,
    tenant_context: req.tenant
  });
});

// Combined middleware example
router.post('/clinic/:clinic_id/medical-records', [
  requireAuth,
  requireClinicAccess('clinic_id'),
  requirePermission('medical_records.create'),
  injectTenantContext
], (req, res) => {
  res.json({
    success: true,
    message: 'Can create medical records for this clinic',
    clinic_id: req.clinicId,
    user_permissions: req.user.getPermissions()
  });
});

export default router;
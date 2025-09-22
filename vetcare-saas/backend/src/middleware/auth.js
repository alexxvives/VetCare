import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { cache, getCacheKey } from '../config/cache.js';

/**
 * Authentication Middleware
 * Handles JWT token verification, user authentication, and authorization
 */

/**
 * Verify JWT token and authenticate user
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER || 'vetcare-api',
        audience: process.env.JWT_AUDIENCE || 'vetcare-app'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Check token type
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type'
      });
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    // Check if password was changed after token was issued
    const passwordChangedAt = new Date(user.password_changed_at || user.created_at);
    const tokenIssuedAt = new Date(decoded.iat * 1000);
    
    if (passwordChangedAt > tokenIssuedAt) {
      return res.status(401).json({
        success: false,
        error: 'Token expired due to password change',
        code: 'PASSWORD_CHANGED'
      });
    }

    // Add user and token info to request
    req.user = user;
    req.token = decoded;
    req.currentClinicId = decoded.clinic_id || null;

    next();

  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    req.token = null;
    return next();
  }

  // Use regular auth if token is provided
  return authenticateToken(req, res, next);
};

/**
 * Role-based access control middleware
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient privileges',
        required_role: allowedRoles,
        user_role: req.user.role
      });
    }

    next();
  };
};

/**
 * Permission-based access control middleware
 */
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userPermissions = req.user.getPermissions();

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(permission => {
      return req.user.hasPermission(permission);
    });

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        required_permissions: requiredPermissions,
        user_permissions: userPermissions
      });
    }

    next();
  };
};

/**
 * Clinic access middleware - ensures user has access to specified clinic
 */
export const requireClinicAccess = (clinicIdParam = 'clinic_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Get clinic ID from params, body, or query
    const clinicId = req.params[clinicIdParam] || 
                    req.body[clinicIdParam] || 
                    req.query[clinicIdParam] ||
                    req.currentClinicId;

    if (!clinicId) {
      return res.status(400).json({
        success: false,
        error: 'Clinic ID required'
      });
    }

    if (!req.user.hasClinicAccess(clinicId)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to specified clinic',
        clinic_id: clinicId
      });
    }

    // Add clinic ID to request for easy access
    req.clinicId = clinicId;
    next();
  };
};

/**
 * Multi-tenancy context injection middleware
 */
export const injectTenantContext = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  // Add tenant context to request
  req.tenant = {
    organizationId: req.user.organization_id,
    clinicId: req.currentClinicId || req.clinicId,
    userId: req.user.id,
    userRole: req.user.role,
    permissions: req.user.getPermissions(),
    clinicAccess: req.user.clinic_access || []
  };

  // Add helper function to check multi-tenant access
  req.checkTenantAccess = (resourceClinicId) => {
    if (!resourceClinicId) return true; // No clinic restriction
    
    // Super admin and org admin have access to all clinics in their org
    if (['super_admin', 'organization_admin'].includes(req.user.role)) {
      return true;
    }
    
    return req.user.hasClinicAccess(resourceClinicId);
  };

  next();
};

/**
 * Rate limiting middleware for authentication endpoints
 */
export const authRateLimit = (maxAttempts = 5, windowMinutes = 15) => {
  return async (req, res, next) => {
    try {
      const identifier = req.ip + ':' + (req.body.email || 'unknown');
      const key = getCacheKey.rate_limit(identifier);
      
      const attempts = await cache.get(key) || 0;
      
      if (attempts >= maxAttempts) {
        return res.status(429).json({
          success: false,
          error: `Too many attempts. Please try again in ${windowMinutes} minutes.`,
          retry_after: windowMinutes * 60
        });
      }
      
      // Increment attempts
      await cache.set(key, attempts + 1, windowMinutes * 60);
      
      next();

    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Continue on error - don't block legitimate requests
    }
  };
};

/**
 * Combine multiple middleware functions
 */
export const requireAuth = authenticateToken;
export const requireRoleAndPermission = (roles, permissions) => {
  return [
    authenticateToken,
    requireRole(...roles),
    requirePermission(...permissions)
  ];
};

/**
 * Admin-only access (super_admin or organization_admin)
 */
export const requireAdmin = [
  authenticateToken,
  requireRole('super_admin', 'organization_admin')
];

/**
 * Veterinarian-level access (veterinarian or higher)
 */
export const requireVeterinarian = [
  authenticateToken,
  requireRole('super_admin', 'organization_admin', 'clinic_admin', 'veterinarian')
];

/**
 * Staff-level access (any authenticated user)
 */
export const requireStaff = [
  authenticateToken,
  requireRole('super_admin', 'organization_admin', 'clinic_admin', 'veterinarian', 'technician', 'receptionist')
];

export default {
  authenticateToken,
  optionalAuth,
  requireRole,
  requirePermission,
  requireClinicAccess,
  injectTenantContext,
  authRateLimit,
  requireAuth,
  requireRoleAndPermission,
  requireAdmin,
  requireVeterinarian,
  requireStaff
};
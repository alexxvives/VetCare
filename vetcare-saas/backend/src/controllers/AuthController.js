import User from '../models/User.js';
import { cache, getCacheKey, CACHE_TTL } from '../config/cache.js';
import jwt from 'jsonwebtoken';

/**
 * Authentication Controller
 * Handles login, logout, token refresh, and session management
 */
class AuthController {
  /**
   * User login
   * POST /api/v1/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password, clinic_id, remember_me = false } = req.body;
      
      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Rate limiting check
      const attemptKey = getCacheKey.auth_attempts(email);
      const attempts = await cache.get(attemptKey) || 0;
      
      if (attempts >= 5) {
        await AuthController.logAuthEvent('login_rate_limited', { email }, req);
        return res.status(429).json({
          success: false,
          error: 'Too many login attempts. Please try again in 15 minutes.'
        });
      }

      // Validate credentials
      const result = await User.validateLogin(email, password);
      
      if (!result.success) {
        // Increment failed attempts
        await cache.set(attemptKey, attempts + 1, CACHE_TTL.auth_attempts);
        
        await AuthController.logAuthEvent('login_failed', { 
          email, 
          reason: result.error 
        }, req);
        
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const user = result.user;

      // Multi-clinic access verification
      if (clinic_id) {
        if (!user.hasClinicAccess(clinic_id)) {
          await AuthController.logAuthEvent('login_denied_clinic_access', { 
            email, 
            clinic_id 
          }, req);
          
          return res.status(403).json({
            success: false,
            error: 'Access denied to specified clinic'
          });
        }
      }

      // Clear failed attempts on successful login
      await cache.del(attemptKey);

      // Update last login
      await user.updateLastLogin(req.ip);

      // Generate tokens
      const tokens = user.generateTokens();
      
      // Store refresh token in cache
      const refreshKey = getCacheKey.session(user.id);
      const sessionData = {
        user_id: user.id,
        refresh_token: tokens.refresh_token,
        clinic_id: clinic_id || null,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + (remember_me ? 30 : 7) * 24 * 60 * 60 * 1000).toISOString()
      };
      
      await cache.set(
        refreshKey, 
        sessionData, 
        remember_me ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30 days or 7 days
      );

      // Log successful login
      await AuthController.logAuthEvent('login_success', { 
        user_id: user.id, 
        email: user.email,
        clinic_id 
      }, req);

      // Prepare user data for response
      const userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        organization_id: user.organization_id,
        clinic_access: user.clinic_access,
        permissions: user.getPermissions(),
        current_clinic_id: clinic_id,
        mfa_enabled: user.isMfaEnabled,
        needs_password_change: user.needsPasswordChange
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userData,
          tokens: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: tokens.expires_in,
            token_type: 'Bearer'
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      
      await AuthController.logAuthEvent('login_error', { 
        error: error.message 
      }, req);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * User logout
   * POST /api/v1/auth/logout
   */
  static async logout(req, res) {
    try {
      const user = req.user; // From auth middleware
      
      if (user) {
        // Remove session from cache
        const refreshKey = getCacheKey.session(user.id);
        await cache.del(refreshKey);

        // Log logout
        await AuthController.logAuthEvent('logout_success', { 
          user_id: user.id,
          email: user.email 
        }, req);
      }

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  static async refresh(req, res) {
    try {
      const { refresh_token } = req.body;
      
      if (!refresh_token) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }

      // Verify refresh token
      let decoded;
      try {
        decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }

      // Check if token is refresh type
      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          success: false,
          error: 'Invalid token type'
        });
      }

      // Get session from cache
      const refreshKey = getCacheKey.session(decoded.id);
      const session = await cache.get(refreshKey);
      
      if (!session || session.refresh_token !== refresh_token) {
        return res.status(401).json({
          success: false,
          error: 'Invalid session'
        });
      }

      // Get user
      const user = await User.findById(decoded.id);
      
      if (!user || user.status !== 'active') {
        await cache.del(refreshKey);
        return res.status(401).json({
          success: false,
          error: 'User not found or inactive'
        });
      }

      // Check if password was changed after token was issued
      const passwordChangedAt = new Date(user.password_changed_at || user.created_at);
      const tokenIssuedAt = new Date(decoded.iat * 1000);
      
      if (passwordChangedAt > tokenIssuedAt) {
        await cache.del(refreshKey);
        return res.status(401).json({
          success: false,
          error: 'Token expired due to password change'
        });
      }

      // Generate new tokens
      const tokens = user.generateTokens();
      
      // Update session with new refresh token
      session.refresh_token = tokens.refresh_token;
      session.updated_at = new Date().toISOString();
      
      await cache.set(refreshKey, session, CACHE_TTL.session);

      // Log token refresh
      await AuthController.logAuthEvent('token_refresh', { 
        user_id: user.id,
        email: user.email 
      }, req);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          tokens: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: tokens.expires_in,
            token_type: 'Bearer'
          }
        }
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Switch clinic context
   * POST /api/v1/auth/switch-clinic
   */
  static async switchClinic(req, res) {
    try {
      const { clinic_id } = req.body;
      const user = req.user;
      
      if (!clinic_id) {
        return res.status(400).json({
          success: false,
          error: 'Clinic ID is required'
        });
      }

      // Verify clinic access
      if (!user.hasClinicAccess(clinic_id)) {
        await AuthController.logAuthEvent('clinic_switch_denied', { 
          user_id: user.id,
          clinic_id 
        }, req);
        
        return res.status(403).json({
          success: false,
          error: 'Access denied to specified clinic'
        });
      }

      // Update session
      const refreshKey = getCacheKey.session(user.id);
      const session = await cache.get(refreshKey);
      
      if (session) {
        session.clinic_id = clinic_id;
        session.updated_at = new Date().toISOString();
        await cache.set(refreshKey, session, CACHE_TTL.session);
      }

      // Generate new access token with updated clinic context
      const newUser = await User.findById(user.id);
      const tokens = newUser.generateTokens();

      // Log clinic switch
      await AuthController.logAuthEvent('clinic_switch_success', { 
        user_id: user.id,
        clinic_id 
      }, req);

      res.status(200).json({
        success: true,
        message: 'Clinic switched successfully',
        data: {
          current_clinic_id: clinic_id,
          access_token: tokens.access_token
        }
      });

    } catch (error) {
      console.error('Clinic switch error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  static async getProfile(req, res) {
    try {
      const user = req.user;
      
      // Get fresh user data
      const freshUser = await User.findById(user.id);
      
      if (!freshUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const userData = {
        id: freshUser.id,
        email: freshUser.email,
        first_name: freshUser.first_name,
        last_name: freshUser.last_name,
        phone: freshUser.phone,
        role: freshUser.role,
        organization_id: freshUser.organization_id,
        clinic_access: freshUser.clinic_access,
        permissions: freshUser.getPermissions(),
        mfa_enabled: freshUser.isMfaEnabled,
        needs_password_change: freshUser.needsPasswordChange,
        last_login_at: freshUser.last_login_at,
        created_at: freshUser.created_at
      };

      res.status(200).json({
        success: true,
        data: { user: userData }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Log authentication events for audit trail
   */
  static async logAuthEvent(action, details, req) {
    try {
      // In a real implementation, this would write to audit_logs table
      // For now, we'll use console logging with structured data
      const logEntry = {
        timestamp: new Date().toISOString(),
        action,
        details,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        session_id: req.sessionID || 'unknown'
      };
      
      console.log('AUTH_AUDIT:', JSON.stringify(logEntry));
      
      // TODO: Implement actual audit log database insertion
      // await AuditLog.create({
      //   action,
      //   resource_type: 'authentication',
      //   details: JSON.stringify(details),
      //   ip_address: req.ip,
      //   user_agent: req.get('User-Agent'),
      //   severity: action.includes('failed') || action.includes('denied') ? 'high' : 'medium'
      // });
      
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }
}

export default AuthController;
import BaseModel from './BaseModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * User Model
 * Handles user authentication, authorization, and profile management
 */
class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['organization_id', 'email', 'password_hash', 'first_name', 'last_name', 'role'],
      
      properties: {
        ...BaseModel.jsonSchema.properties,
        organization_id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email', maxLength: 255 },
        password_hash: { type: 'string', maxLength: 255 },
        first_name: { type: 'string', minLength: 1, maxLength: 100 },
        last_name: { type: 'string', minLength: 1, maxLength: 100 },
        phone: { type: ['string', 'null'], maxLength: 20 },
        role: { 
          type: 'string', 
          enum: ['super_admin', 'organization_admin', 'clinic_admin', 'veterinarian', 'technician', 'receptionist'] 
        },
        status: { 
          type: 'string', 
          enum: ['active', 'inactive', 'suspended'],
          default: 'active'
        },
        permissions: { type: ['object', 'null'] },
        clinic_access: { type: ['object', 'null'] },
        mfa_secret: { type: ['string', 'null'], maxLength: 255 },
        mfa_enabled: { type: 'boolean', default: false },
        mfa_backup_codes: { type: ['object', 'null'] },
        last_login_at: { type: ['string', 'null'], format: 'date-time' },
        last_login_ip: { type: ['string', 'null'], maxLength: 45 },
        password_changed_at: { type: ['string', 'null'], format: 'date-time' },
        force_password_change: { type: 'boolean', default: false }
      }
    };
  }

  /**
   * JSON attributes that should be parsed from strings
   */
  static get jsonAttributes() {
    return ['permissions', 'clinic_access', 'mfa_backup_codes'];
  }

  /**
   * Relationships
   */
  static get relationMappings() {
    return {
      organization: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Organization',
        join: {
          from: 'users.organization_id',
          to: 'organizations.id'
        }
      },
      
      clinicAccess: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'Clinic',
        join: {
          from: 'users.id',
          through: {
            from: 'user_clinic_access.user_id',
            to: 'user_clinic_access.clinic_id'
          },
          to: 'clinics.id'
        }
      }
    };
  }

  /**
   * Hash password before storing
   */
  static async hashPassword(password) {
    try {
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  /**
   * Verify password
   */
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password_hash);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Set password (hashes automatically)
   */
  async setPassword(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    this.password_hash = await User.hashPassword(password);
    this.password_changed_at = new Date().toISOString();
    this.force_password_change = false;
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken() {
    const payload = {
      id: this.id,
      email: this.email,
      role: this.role,
      organization_id: this.organization_id,
      clinic_access: this.clinic_access || [],
      permissions: this.getPermissions(),
      type: 'access'
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m', // 15 minutes
      issuer: 'vetcare-api',
      audience: 'vetcare-app'
    });
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken() {
    const payload = {
      id: this.id,
      email: this.email,
      type: 'refresh',
      version: this.password_changed_at || this.created_at
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d', // 7 days
      issuer: 'vetcare-api',
      audience: 'vetcare-app'
    });
  }

  /**
   * Generate both tokens
   */
  generateTokens() {
    return {
      access_token: this.generateAccessToken(),
      refresh_token: this.generateRefreshToken(),
      expires_in: 900 // 15 minutes in seconds
    };
  }

  /**
   * Get user permissions based on role
   */
  getPermissions() {
    // Base permissions by role
    const rolePermissions = {
      super_admin: ['*'], // All permissions
      
      organization_admin: [
        'organizations.read',
        'organizations.update',
        'clinics.*',
        'users.*',
        'reports.read'
      ],
      
      clinic_admin: [
        'clinics.read',
        'clinics.update',
        'users.read',
        'users.create',
        'users.update',
        'clients.*',
        'pets.*',
        'appointments.*',
        'medical_records.*',
        'reports.read'
      ],
      
      veterinarian: [
        'clients.read',
        'pets.*',
        'appointments.*',
        'medical_records.*',
        'prescriptions.*',
        'lab_results.*',
        'vaccinations.*'
      ],
      
      technician: [
        'clients.read',
        'pets.read',
        'pets.update',
        'appointments.read',
        'appointments.update',
        'medical_records.read',
        'medical_records.create',
        'lab_results.read',
        'lab_results.create',
        'vaccinations.*'
      ],
      
      receptionist: [
        'clients.*',
        'pets.read',
        'pets.create',
        'appointments.*',
        'billing.read',
        'billing.create'
      ]
    };

    // Get base permissions for role
    let permissions = rolePermissions[this.role] || [];
    
    // Add any additional permissions from database
    if (this.permissions && Array.isArray(this.permissions)) {
      permissions = [...permissions, ...this.permissions];
    }
    
    return [...new Set(permissions)]; // Remove duplicates
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission) {
    const permissions = this.getPermissions();
    
    // Super admin has all permissions
    if (permissions.includes('*')) {
      return true;
    }
    
    // Exact match
    if (permissions.includes(permission)) {
      return true;
    }
    
    // Wildcard match (e.g., 'clients.*' matches 'clients.read')
    return permissions.some(p => {
      if (p.endsWith('.*')) {
        const prefix = p.slice(0, -2);
        return permission.startsWith(prefix + '.');
      }
      return false;
    });
  }

  /**
   * Check if user has access to specific clinic
   */
  hasClinicAccess(clinicId) {
    // Super admin and org admin have access to all clinics
    if (['super_admin', 'organization_admin'].includes(this.role)) {
      return true;
    }
    
    // Check clinic_access array
    const clinicAccess = this.clinic_access || [];
    return clinicAccess.includes(clinicId);
  }

  /**
   * Update last login information
   */
  async updateLastLogin(ipAddress) {
    return await this.$query().patch({
      last_login_at: new Date().toISOString(),
      last_login_ip: ipAddress
    });
  }

  /**
   * Get user's full name
   */
  get fullName() {
    return `${this.first_name} ${this.last_name}`.trim();
  }

  /**
   * Get user's display name for UI
   */
  get displayName() {
    return this.fullName || this.email;
  }

  /**
   * Check if password needs to be changed
   */
  get needsPasswordChange() {
    return this.force_password_change;
  }

  /**
   * Check if MFA is enabled
   */
  get isMfaEnabled() {
    return this.mfa_enabled && this.mfa_secret;
  }

  /**
   * Serialize user for API responses (excludes sensitive fields)
   */
  $formatJson(json) {
    json = super.$formatJson(json);
    
    // Remove sensitive fields
    delete json.password_hash;
    delete json.mfa_secret;
    delete json.mfa_backup_codes;
    
    return json;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    return await this.query()
      .findOne({ email: email.toLowerCase() })
      .modify('notDeleted');
  }

  /**
   * Create user with hashed password
   */
  static async createUser(userData) {
    const { password, ...userInfo } = userData;
    
    // Hash password
    const password_hash = await this.hashPassword(password);
    
    // Normalize email
    userInfo.email = userInfo.email.toLowerCase();
    
    return await this.query().insert({
      ...userInfo,
      password_hash,
      password_changed_at: new Date().toISOString()
    });
  }

  /**
   * Validate login credentials
   */
  static async validateLogin(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    if (user.status !== 'active') {
      return { success: false, error: 'Account is not active' };
    }
    
    const isPasswordValid = await user.verifyPassword(password);
    
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    return { success: true, user };
  }
}

export default User;
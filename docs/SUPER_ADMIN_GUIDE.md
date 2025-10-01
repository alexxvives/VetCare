# Super Admin Guide

## 🛡️ Super Admin Account Overview

The VetCare platform includes a **Super Administrator** account that provides global system access across all organizations, clinics, and users. This account is designed for platform management and oversight.

## 📍 Super Admin Credentials Location

### **Database Storage:**
- **Table**: `users`
- **Email**: `superadmin@vetcare.com`
- **Password**: `SuperAdmin123!`
- **Role**: `super_admin`
- **Organization**: VetCare Solutions (first organization)
- **Clinic Access**: `["*"]` (all clinics)
- **Permissions**: `["*"]` (all permissions)

### **Seed File Location:**
```
VetCare/database/seeds/01_initial_data.js
```

The super admin account is created during the initial database seeding process.

## 🔐 Account Details

| Field | Value |
|-------|-------|
| **Email** | `superadmin@vetcare.com` |
| **Password** | `SuperAdmin123!` |
| **Role** | `super_admin` |
| **First Name** | Super |
| **Last Name** | Administrator |
| **Phone** | +1-555-0001 |
| **Status** | Active |
| **MFA Enabled** | No |
| **Force Password Change** | No |

## 🚀 Super Admin Capabilities

### **Global Access:**
- ✅ Access to all organizations
- ✅ Access to all clinics (`"*"` in clinic_access)
- ✅ All system permissions (`"*"` in permissions)
- ✅ Override any role-based restrictions

### **User Model Methods:**
```javascript
user.isSuperAdmin()        // Returns true
user.hasPermission(any)    // Returns true for any permission
user.hasClinicAccess(any)  // Returns true for any clinic
user.getPermissions()      // Returns ["*"]
```

### **Management Capabilities:**
- 🏥 Create/edit/delete organizations
- 🏪 Create/edit/delete clinics
- 👥 Create/edit/delete users (all roles)
- 📊 View all reports and analytics
- ⚙️ Access system configuration
- 🔧 Database management
- 📝 Audit log access

## 🔄 Accessing Super Admin

### **Via Login Page:**
1. Navigate to `http://localhost:3000/auth/login`
2. Use credentials:
   - **Email**: `superadmin@vetcare.com`
   - **Password**: `SuperAdmin123!`
3. Click "Sign In"

### **Demo Credentials Displayed:**
The login page shows demo accounts including:
```
🛡️ Super Admin: superadmin@vetcare.com / SuperAdmin123!
🏥 Clinic Admin: admin@vetcare.com / demo123
👨‍⚕️ Veterinarian: vet@vetcare.com / demo123
```

## 💾 Database Management

### **Recreating Super Admin:**
```bash
# From backend directory
npm run migrate:rollback
npm run migrate
npm run seed
```

### **Manual Database Query:**
```sql
SELECT * FROM users WHERE role = 'super_admin';
```

### **Password Reset:**
If you need to reset the super admin password:
```javascript
// In backend console or script
import bcryptjs from 'bcryptjs';
const newPasswordHash = await bcryptjs.hash('NewPassword123!', 12);

// Update in database
UPDATE users 
SET password_hash = '[newPasswordHash]'
WHERE email = 'superadmin@vetcare.com';
```

## 🛡️ Security Considerations

### **Production Environment:**
- ⚠️ **CRITICAL**: Change default password in production
- ✅ Enable MFA for super admin account
- ✅ Use strong, unique password
- ✅ Limit super admin access to essential personnel
- ✅ Monitor super admin activity via audit logs
- ✅ Regular password rotation policy

### **Development Environment:**
- ✅ Demo credentials are acceptable
- ✅ Easy access for development and testing
- ✅ Clear documentation for team members

## 🏗️ Architecture Notes

### **Multi-Tenancy Design:**
- Super admin can access multiple organizations
- Bypasses organization-level isolation
- Can switch between different clinic contexts
- Full visibility across tenant boundaries

### **Permission System:**
- `"*"` permission grants everything
- Role-based access control (RBAC)
- Hierarchical permission structure
- Granular permission checking

### **Code Implementation:**
```javascript
// In User model (backend/src/models/User.js)
hasPermission(permission) {
  const permissions = this.getPermissions();
  
  // Super admin has all permissions
  if (permissions.includes('*')) {
    return true;
  }
  // ... other permission checks
}
```

## 📋 Demo Account Hierarchy

```
🛡️ Super Admin (Global Access)
├── 🏢 Organization Admin (Org-wide access)
│   ├── 🏥 Clinic Admin (Clinic-specific)
│   ├── 👨‍⚕️ Veterinarian (Medical access)
│   ├── 🧪 Technician (Limited medical)
│   └── 📞 Receptionist (Front desk)
```

## 🚨 Emergency Access

If super admin access is lost:

1. **Database Access**: Direct SQL query to reset password
2. **Seed Reset**: Run fresh migrations and seeds
3. **Environment Variables**: Could store backup credentials
4. **Manual Creation**: Insert super admin via SQL

## 📞 Support

For super admin issues:
- Check database seeding logs
- Verify password hashing
- Confirm role assignment
- Review audit logs for access attempts

---

**Last Updated**: September 30, 2025  
**Version**: 1.0.0  
**Maintained By**: VetCare Development Team
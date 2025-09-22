# VetCare Development Environment Setup Guide

## Prerequisites Installation

### 1. MySQL 8.0 Installation (Windows)

1. **Download MySQL Installer**
   - Go to https://dev.mysql.com/downloads/mysql/
   - Download MySQL Installer for Windows

2. **Install MySQL**
   ```powershell
   # Run the installer and select:
   # - Server only (for development)
   # - Development Computer configuration
   # - Use Strong Password Encryption
   # - Create root password (save it!)
   ```

3. **Verify Installation**
   ```powershell
   # Add MySQL to PATH (usually: C:\Program Files\MySQL\MySQL Server 8.0\bin)
   mysql --version
   ```

4. **Create Development Databases**
   ```sql
   mysql -u root -p
   CREATE DATABASE vetcare_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE DATABASE vetcare_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   
   -- Create application user
   CREATE USER 'vetcare_user'@'localhost' IDENTIFIED BY 'VetCare2024!';
   GRANT ALL PRIVILEGES ON vetcare_dev.* TO 'vetcare_user'@'localhost';
   GRANT ALL PRIVILEGES ON vetcare_test.* TO 'vetcare_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 2. Redis Installation (Windows)

**Option A: Using WSL2 (Recommended)**
```powershell
# Install WSL2 first
wsl --install

# In WSL2 terminal:
sudo apt update
sudo apt install redis-server
sudo service redis-server start

# Test Redis
redis-cli ping
# Should return: PONG
```

**Option B: Windows Native (Alternative)**
```powershell
# Download from: https://github.com/microsoftarchive/redis/releases
# Install Redis-x64-3.0.504.msi
# Start Redis service
net start redis
```

### 3. Cloudflare Wrangler CLI

```powershell
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Verify installation
wrangler --version
```

### 4. VS Code Extensions

Install these extensions in VS Code:
- ESLint (ms-vscode.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- MySQL (cweijan.vscode-mysql-client2)
- Thunder Client (rangav.vscode-thunder-client)
- GitLens (eamodio.gitlens)
- Auto Rename Tag (formulahendry.auto-rename-tag)
- Bracket Pair Colorizer (coenraads.bracket-pair-colorizer-2)

## Project Setup

### 1. Install Project Dependencies

```powershell
cd c:\Users\domin\code\VetCare\vetcare-saas

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your actual database credentials
```

### 2. Configure Environment Variables

Edit `backend/.env`:
```env
# Update these with your MySQL credentials
DB_USER=vetcare_user
DB_PASSWORD=VetCare2024!
DB_NAME=vetcare_dev
DB_TEST_NAME=vetcare_test

# Generate secure JWT secrets (32+ characters each)
JWT_SECRET=your_generated_secret_here_at_least_32_chars_long
JWT_REFRESH_SECRET=your_refresh_secret_here_also_32_chars_long

# Generate encryption key (exactly 32 characters)
ENCRYPTION_KEY=abcdefghijklmnopqrstuvwxyz123456
```

### 3. Test the Setup

```powershell
# Test MySQL connection
mysql -u vetcare_user -p vetcare_dev
# Enter password: VetCare2024!

# Test Redis connection
redis-cli ping

# Test Node.js backend
cd backend
npm run dev
# Should start server on http://localhost:3000
```

### 4. Verify Installation

Visit these URLs in your browser:
- http://localhost:3000/health - Should return health status
- http://localhost:3000/api/v1 - Should return API info

## Next Steps

Once the environment is set up:

1. **Database Schema**: Run migrations to create tables
2. **Frontend Setup**: Initialize React application
3. **Authentication**: Implement JWT authentication system
4. **Testing**: Set up test database and run tests

## Troubleshooting

### MySQL Issues
```powershell
# Check MySQL service status
Get-Service mysql*

# Start MySQL service if stopped
Start-Service MySQL80
```

### Redis Issues
```powershell
# WSL2: Check Redis status
wsl -d Ubuntu service redis-server status

# Start Redis if stopped
wsl -d Ubuntu sudo service redis-server start
```

### Node.js Issues
```powershell
# Check Node version (should be 20.x+)
node --version

# Clear npm cache if having install issues
npm cache clean --force
```

### Port Conflicts
```powershell
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <process_id> /F
```

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords for database users
- Keep JWT secrets secure and rotate them regularly
- Enable MySQL SSL in production
- Use Redis AUTH in production
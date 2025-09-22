# VetCare SaaS Platform

Multi-tenant SaaS platform for veterinary clinics with appointment scheduling, electronic health records (EHR), and practice management.

## Architecture

- **Backend**: Node.js/Express.js with MySQL
- **Frontend**: React with TypeScript
- **Infrastructure**: Cloudflare Workers, R2 Storage, Redis
- **Database**: MySQL 8.0 with multi-tenant architecture

## Getting Started

### Prerequisites

- Node.js v20.x or higher
- MySQL 8.0
- Redis 7.x
- Cloudflare Wrangler CLI

### Installation Steps

1. **Install Dependencies**
   ```bash
   # Install MySQL
   # Download from: https://dev.mysql.com/downloads/mysql/
   
   # Install Redis (Windows)
   # Download from: https://github.com/microsoftarchive/redis/releases
   
   # Install Cloudflare Wrangler
   npm install -g wrangler
   ```

2. **Clone and Setup**
   ```bash
   cd vetcare-saas
   
   # Backend setup
   cd backend
   npm install
   
   # Frontend setup
   cd ../frontend
   npm install
   ```

3. **Database Setup**
   ```bash
   # Start MySQL service
   # Create development database
   mysql -u root -p
   CREATE DATABASE vetcare_dev;
   CREATE DATABASE vetcare_test;
   
   # Run migrations
   cd ../database
   npm run migrate
   ```

4. **Environment Configuration**
   ```bash
   cp backend/.env.example backend/.env
   # Configure your environment variables
   ```

## Project Structure

```
vetcare-saas/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Database, Redis, security config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Database models (Objection.js)
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Helper functions
│   └── tests/              # Backend tests
├── frontend/               # React application
├── database/               # Migrations and seeds
├── docs/                   # Documentation
└── scripts/               # Build and deployment scripts
```

## Development Commands

```bash
# Start backend development server
cd backend && npm run dev

# Start frontend development server
cd frontend && npm start

# Run tests
npm run test

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
```

## Features

### MVP Features
- [ ] Multi-tenant clinic management
- [ ] User authentication with RBAC
- [ ] Appointment scheduling system
- [ ] Electronic health records (SOAP notes)
- [ ] Pet and client management
- [ ] Vaccination tracking
- [ ] Automated reminders (email/SMS)

### Phase 2 Features
- [ ] Advanced reporting dashboard
- [ ] Inventory management
- [ ] Payment processing
- [ ] Client portal
- [ ] Telemedicine capabilities
- [ ] Mobile applications

## Security & Compliance

- HIPAA-compliant data handling
- End-to-end encryption for PHI
- Audit logging for all medical record access
- Multi-factor authentication
- Role-based access control

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
---
applyTo: '**'
---

# VetCare SaaS Development Guide

## 🏥 Project Overview
VetCare is a modern, multi-tenant veterinary clinic management SaaS platform following industry-standard practices. Built with React 19.1.1 + TypeScript frontend, Node.js + Express backend, and SQLite database with proper separation of concerns.

## 📁 Project Architecture
```
VetCare/                  # Root monorepo following industry standards
├── backend/              # Node.js Express API (PORT: 8000)
│   ├── src/             # Source code with modular architecture
│   │   ├── controllers/ # Route handlers (MVC pattern)
│   │   ├── models/      # Database models with Knex.js ORM
│   │   ├── routes/      # API route definitions
│   │   ├── middleware/  # Custom middleware functions
│   │   ├── services/    # Business logic layer
│   │   ├── config/      # Configuration management
│   │   └── utils/       # Utility functions
│   ├── tests/           # Unit and integration tests
│   ├── .env.example     # Environment variables template
│   └── package.json     # Backend dependencies and scripts
├── frontend/             # React TypeScript SPA (PORT: 3000)
│   ├── src/             # Source code with feature-based organization
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-based page components
│   │   ├── layouts/     # Layout wrapper components
│   │   ├── services/    # API service layer
│   │   ├── store/       # Redux Toolkit state management
│   │   ├── hooks/       # Custom React hooks
│   │   ├── types/       # TypeScript type definitions
│   │   ├── utils/       # Utility functions
│   │   ├── styles/      # Global styles and utilities
│   │   ├── theme/       # Material-UI theme configuration
│   │   └── constants/   # Application constants
│   ├── public/          # Static assets
│   ├── .env.example     # Environment variables template
│   └── package.json     # Frontend dependencies and scripts
├── database/             # Database schema and migrations
│   ├── migrations/      # Knex.js database migrations
│   ├── seeds/          # Development seed data
│   └── README.md       # Database documentation
├── docs/                # Comprehensive project documentation
│   ├── DATABASE_SCHEMA.md
│   ├── SETUP.md
│   └── API_REFERENCE.md
├── scripts/             # Build and utility scripts
├── .github/             # GitHub Actions and templates
│   └── instructions/    # AI development guidelines
├── package.json         # Root workspace configuration
├── README.md           # Project overview and setup
├── LICENSE             # MIT license
└── .gitignore          # Comprehensive ignore patterns
```

## 🚀 Development Workflow

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ (comes with Node.js)
- Git 2.40+
- VS Code (recommended IDE)

### Initial Setup
```bash
# Clone repository
git clone https://github.com/alexxvives/VetCare.git
cd VetCare

# Install all dependencies (monorepo setup)
npm run install:all

# Run database migrations
npm run migrate

# Seed development data (optional)
npm run seed
```

### Development Commands
**BEST PRACTICE**: Use separate terminals for better control and clearer logs

```bash
# RECOMMENDED: Individual terminals (preferred by most developers)
# Terminal 1 - Backend:
cd backend
npm run dev

# Terminal 2 - Frontend:
cd frontend  
npm run dev

# ALTERNATIVE: Start both servers concurrently from root
npm run dev

# Other useful commands
npm test              # Run all tests
npm run test:backend  # Backend tests only
npm run test:frontend # Frontend tests only
npm run build         # Build both applications
```

### Environment-Specific Development
**PowerShell Users**: Individual terminals provide the cleanest experience

```powershell
# Terminal 1 - Backend (recommended approach)
Set-Location .\backend
npm run dev

# Terminal 2 - Frontend (recommended approach)  
Set-Location .\frontend
npm run dev

# Alternative: From root with concurrently (if you prefer single terminal)
Set-Location C:\Users\domin\code\VetCare
npm run dev
```

### Cross-Platform Commands
```bash
# Unix/Linux/macOS
export PORT=8000 && npm run dev

# Windows Command Prompt
set PORT=8000 && npm run dev

# PowerShell
$env:PORT=8000; npm run dev
```

## 🏗️ Architecture Patterns & Best Practices

### Backend Architecture (Node.js/Express)
- **MVC Pattern**: Controllers handle requests, Models define data, Services contain business logic
- **Middleware Chain**: Authentication → Rate limiting → Validation → Route handling
- **Database Layer**: Knex.js ORM with migration-based schema management
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Security**: JWT authentication, CORS, rate limiting, input validation

### Frontend Architecture (React/TypeScript)
- **Component Hierarchy**: Pages → Layouts → Components → UI Elements
- **State Management**: Redux Toolkit with normalized state structure
- **Routing**: React Router v6 with protected routes and error boundaries
- **Styling**: Material-UI v5 with custom theme and responsive design
- **Type Safety**: Strict TypeScript configuration with comprehensive type definitions

### Database Design
- **Multi-tenancy**: Organization-based data isolation with foreign key constraints
- **Migrations**: Version-controlled schema changes using Knex.js migrations
- **Indexing**: Strategic indexes on foreign keys and frequently queried columns
- **Audit Trail**: Comprehensive logging for HIPAA compliance
- **Data Integrity**: Foreign key constraints and validation at database level

## 🔄 Development Workflow Patterns

### Feature Development Lifecycle
1. **Planning**: Reference `Plan.md` for feature specifications and requirements
2. **Backend First**: Implement API endpoints, models, and business logic
3. **Frontend Integration**: Create React components and connect to API
4. **Testing**: Write unit tests for both backend and frontend
5. **Documentation**: Update relevant README files and API docs

### Code Organization Standards
- **Feature-Based Structure**: Group related files by feature/domain
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Consistent Naming**: Use descriptive names following TypeScript/JavaScript conventions
- **Import Organization**: External libraries → Internal modules → Relative imports
- **File Naming**: PascalCase for components, camelCase for utilities, kebab-case for assets

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/pet-medical-records
git add .
git commit -m "feat: implement pet medical records CRUD"
git push origin feature/pet-medical-records

# Create pull request for code review
```

### Database Operations
```bash
# Create new migration
cd backend && npm run migrate:make add_vaccination_table

# Run migrations (development)
npm run migrate

# Rollback if needed
cd backend && npm run migrate:rollback

# Seed development data
npm run seed
```

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Individual functions and utilities
- **Integration Tests**: API endpoints with database
- **Contract Tests**: API response schemas
- **Security Tests**: Authentication and authorization

### Frontend Testing
- **Component Tests**: Individual React components
- **Integration Tests**: User interactions and workflows
- **Store Tests**: Redux slice logic and async actions
- **E2E Tests**: Critical user journeys

### Test Commands
```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only  
npm run test:frontend

# Test with coverage
npm run test:coverage
```

## 🚀 Deployment & Production

### Build Process
```bash
# Production build
npm run build

# Test production build locally
cd frontend && npx serve -s build
```

### Environment Management
- **Development**: `.env` files for local configuration
- **Staging**: Environment-specific variables for testing
- **Production**: Secure environment variable management

### Performance Optimization
- **Backend**: Connection pooling, query optimization, caching
- **Frontend**: Code splitting, lazy loading, bundle optimization
- **Database**: Proper indexing, query analysis, regular maintenance

## � Troubleshooting & Common Issues

### Development Server Issues
1. **Port Conflicts**: 
   - Backend: port 8000, Frontend: port 3000
   - Check occupied ports: `netstat -an | findstr "8000|3000"`
   - Kill processes: `taskkill /f /im node.exe` (Windows)

2. **Terminal Navigation (PowerShell)**:
   - Always verify location: `Get-Location`
   - Navigate properly: `Set-Location C:\Users\domin\code\VetCare`
   - Combine commands: `Set-Location .\backend\; npm run dev`

3. **Package Installation**:
   - Install all: `npm run install:all`
   - Clear cache: `npm cache clean --force`
   - Delete node_modules: `Remove-Item node_modules -Recurse -Force`

### TypeScript Issues
- **Compilation Errors**: Run `npm run type-check` in frontend
- **Missing Types**: Check `/types/` directory for existing definitions
- **Import Errors**: Verify file paths and exports

### Database Issues
- **Migration Errors**: Check migration syntax and rollback if needed
- **Connection Issues**: Verify database file exists in `/database/`
- **Data Integrity**: Ensure foreign key constraints are respected

### Redux State Issues
- **Action Conflicts**: Use prefixed action names (`clearAuthError` vs `clearClinicError`)
- **Persistence Issues**: Check Redux persist configuration
- **Type Safety**: Ensure all actions and state are properly typed

## 🎯 Quick Reference Guide

### Essential URLs
- **Backend API**: http://localhost:8000
- **Frontend App**: http://localhost:3000
- **Health Check**: http://localhost:8000/health

### Key Files & Locations
- **Main Package**: `VetCare/package.json` (root scripts)
- **Backend Config**: `backend/src/config/`
- **Frontend Store**: `frontend/src/store/`
- **Database**: `database/vetcare_dev.db`
- **Documentation**: `docs/` directory

### Development Checklist
- [ ] Open Terminal 1 → `cd backend` → `npm run dev`
- [ ] Open Terminal 2 → `cd frontend` → `npm run dev`  
- [ ] Verify backend responds at localhost:8000
- [ ] Verify frontend loads at localhost:3000
- [ ] Check console for errors in both terminals
- [ ] Test database connectivity with sample operations

### Code Quality Standards
- **Linting**: ESLint configuration in both backend and frontend
- **Formatting**: Prettier for consistent code style
- **Type Checking**: Strict TypeScript configuration
- **Testing**: Minimum 80% code coverage target
- **Documentation**: README files in each major directory

## 🚨 Critical Best Practices

1. **Always work from VetCare root** for npm scripts
2. **Follow the established directory structure** - don't create new top-level folders
3. **Use TypeScript strict mode** - avoid `any` types
4. **Implement proper error handling** - use try/catch and error boundaries
5. **Multi-tenant awareness** - always include clinic context in API calls
6. **HIPAA compliance** - log all data access and modifications
7. **Security first** - validate all inputs, sanitize outputs
8. **Performance considerations** - optimize queries, implement caching
9. **Mobile responsiveness** - test on multiple screen sizes
10. **Accessibility standards** - follow WCAG guidelines for UI components
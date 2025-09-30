# VetCare SaaS

A modern, multi-tenant veterinary clinic management platform built with React, Node.js, and SQLite.

## 🏥 Overview

VetCare is a comprehensive Software-as-a-Service platform designed for veterinary clinics to manage:
- Patient records and medical history
- Appointment scheduling
- Multi-clinic operations
- HIPAA-compliant data handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/alexxvives/VetCare.git
cd VetCare

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

This will start:
- Backend API on `http://localhost:8000`
- Frontend on `http://localhost:3000`

## 📁 Project Structure

```
VetCare/
├── backend/           # Node.js Express API
├── frontend/          # React TypeScript SPA
├── database/          # SQLite schema & migrations
├── docs/             # Documentation
├── scripts/          # Build and utility scripts
└── .github/          # CI/CD and project templates
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:backend` - Start only backend (port 8000)
- `npm run dev:frontend` - Start only frontend (port 3000)
- `npm run build` - Build both applications for production
- `npm test` - Run all tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Technology Stack

**Frontend:**
- React 19.1.1 with TypeScript
- Material-UI v5 for components
- Redux Toolkit for state management
- React Router for navigation

**Backend:**
- Node.js with Express
- SQLite database with Knex.js
- JWT authentication
- CORS enabled for development

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)

## 🔒 Security & Compliance

- HIPAA-compliant data handling
- JWT-based authentication
- Multi-tenant data isolation
- Secure API endpoints

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.
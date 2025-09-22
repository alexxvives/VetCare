# VetCare SaaS - Veterinary Practice Management Platform

A comprehensive, multi-tenant SaaS solution for veterinary clinics built with modern web technologies.

## 🏥 Project Overview

VetCare SaaS is a complete veterinary practice management system designed to streamline clinic operations, improve patient care, and enhance client communication. The platform supports multiple clinics with role-based access control and comprehensive features for managing appointments, medical records, clients, and pets.

## 🚀 Tech Stack

### Frontend
- **React 19.1.1** with TypeScript
- **Material-UI v5** for UI components
- **Redux Toolkit** for state management
- **React Router v7** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MySQL** database with Knex.js ORM
- **Redis** for caching and sessions
- **JWT** authentication

## 📋 Features

### ✅ Completed Features
- 🔐 **Authentication & Authorization** - Multi-role user system with JWT
- 🏢 **Multi-tenant Architecture** - Support for multiple clinics
- 📊 **Dashboard** - Comprehensive analytics and quick actions
- 📅 **Appointment Management** - Scheduling and calendar views
- 👥 **Client Management** - Client profiles and communication
- 🐕 **Pet Records** - Complete pet profiles and medical history
- 📋 **Medical Records** - Digital health records and treatment tracking
- 📈 **Reports & Analytics** - Business insights and reporting
- ⚙️ **Settings** - Clinic configuration and user preferences

### 🎨 UI/UX Features
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Material Design** - Professional medical theme
- 🌙 **Dark/Light Mode** - User preference themes
- ♿ **Accessibility** - WCAG compliant interface

## 🏗️ Project Structure

```
VetCare/
├── vetcare-saas/
│   ├── backend/          # Node.js API server
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   └── package.json
│   └── frontend/         # React application
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── store/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
└── Plan.md              # Development roadmap
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- Redis 6.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VetCare
   ```

2. **Backend Setup**
   ```bash
   cd vetcare-saas/backend
   npm install
   cp .env.example .env
   # Configure your database and Redis settings in .env
   npm run migrate
   npm run seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd vetcare-saas/frontend
   npm install
   npm start
   ```

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=vetcare_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Application Features

### Dashboard
- Real-time clinic statistics
- Today's appointments overview
- Quick action buttons
- Revenue and patient metrics

### User Roles
- **Clinic Admin** - Full clinic management access
- **Veterinarian** - Medical records and appointments
- **Receptionist** - Appointments and client management
- **Technician** - Limited medical record access

### Security Features
- JWT-based authentication
- Role-based access control
- API rate limiting
- Data encryption

## 🚧 Development Progress

### Phase 1: Foundation ✅
- [x] Database schema and models
- [x] Backend API infrastructure
- [x] Frontend setup with TypeScript
- [x] Authentication system
- [x] Basic routing and layouts

### Phase 2: Core Features ✅
- [x] Material-UI integration
- [x] Redux state management
- [x] Dashboard implementation
- [x] Responsive design system

### Phase 3: Business Logic 🔄
- [ ] Appointment scheduling system
- [ ] Medical records CRUD
- [ ] Client and pet management
- [ ] Reporting and analytics

## 🎯 Getting Started

1. **For Developers**: Follow the installation steps above
2. **For Users**: Access the deployed application at [URL]
3. **For Clinics**: Contact admin for multi-tenant setup

## 📝 API Documentation

The API follows RESTful conventions:

- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

Full API documentation available at `/api/docs` when running the server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏥 About VetCare

VetCare SaaS is designed to modernize veterinary practice management, making it easier for clinics to provide exceptional pet care while maintaining efficient operations.

---

**Built with ❤️ for veterinary professionals**
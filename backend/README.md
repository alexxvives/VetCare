# VetCare Backend API

Node.js Express API for the VetCare SaaS platform.

## 🏗️ Architecture

- **Framework**: Express.js with ES Modules
- **Database**: SQLite with Knex.js ORM
- **Authentication**: JWT-based
- **Validation**: Express Validator
- **Rate Limiting**: Express Rate Limit
- **File Storage**: Local filesystem (configurable)

## 📁 Directory Structure

```
backend/
├── src/
│   ├── app.js              # Application entry point
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── tests/                 # Test files
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure your environment variables:

```env
NODE_ENV=development
PORT=8000
JWT_SECRET=your-jwt-secret-here
DB_PATH=../database/vetcare_dev.db
```

### Running the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Clinic Management

- `GET /api/clinics` - List clinics for authenticated user
- `POST /api/clinics` - Create new clinic
- `PUT /api/clinics/:id` - Update clinic
- `DELETE /api/clinics/:id` - Delete clinic

### Pet Management

- `GET /api/pets` - List pets for clinic
- `POST /api/pets` - Create new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

## 🔧 Database Management

```bash
# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Create new migration
npm run migrate:make migration_name

# Seed database
npm run seed

# Create new seed
npm run seed:make seed_name
```

## 🧪 Testing

The test suite uses Jest and covers:
- Unit tests for controllers
- Integration tests for API endpoints
- Database model tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔒 Security Features

- JWT authentication with refresh tokens
- Rate limiting on API endpoints
- CORS protection
- Environment-based configuration
- SQL injection prevention via Knex.js
- Input validation and sanitization

## 📝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Use ESLint for code formatting
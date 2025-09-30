# VetCare Frontend

Modern React TypeScript SPA for the VetCare veterinary clinic management platform.

## 🏗️ Technology Stack

- **Framework**: React 19.1.1 with TypeScript
- **UI Library**: Material-UI v5 with custom theme
- **State Management**: Redux Toolkit with persistence
- **Routing**: React Router v6
- **Build Tool**: Create React App
- **Testing**: Jest + React Testing Library

## 📁 Directory Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── constants/       # Application constants
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route components
│   ├── router/         # Routing configuration
│   ├── services/       # API service layer
│   ├── store/          # Redux store and slices
│   ├── styles/         # Global styles and utilities
│   ├── theme/          # Material-UI theme configuration
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🎨 UI Components

The application uses Material-UI v5 with a custom veterinary-themed design system:

- **Colors**: Professional blue/teal palette
- **Typography**: Clean, readable fonts optimized for medical data
- **Components**: Consistent spacing, shadows, and interaction patterns
- **Responsive**: Mobile-first design approach

### Key Components

- **AppLayout**: Main application shell with navigation
- **Dashboard**: Overview of clinic operations
- **Pet Management**: CRUD operations for patient records
- **Appointment Scheduling**: Calendar-based booking system
- **User Management**: Multi-clinic user access control

## 🔄 State Management

Redux Toolkit provides predictable state management:

```
store/
├── index.ts          # Store configuration
├── authSlice.ts      # Authentication state
├── clinicSlice.ts    # Clinic management
├── petSlice.ts       # Pet records
└── uiSlice.ts        # UI state (modals, notifications)
```

### Key Features

- **Persistence**: State persisted to localStorage
- **Type Safety**: Full TypeScript integration
- **DevTools**: Redux DevTools support in development
- **Async Actions**: RTK Query for API interactions

## 🛣️ Routing

React Router v6 handles navigation:

- **Public Routes**: Login, registration
- **Protected Routes**: Dashboard, clinic management
- **Multi-tenant**: Clinic-specific route protection
- **Error Boundaries**: Graceful error handling

## 🧪 Testing

Comprehensive test suite using Jest and React Testing Library:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Categories

- **Unit Tests**: Individual components and utilities
- **Integration Tests**: Component interactions
- **Store Tests**: Redux slice logic
- **API Tests**: Service layer mocking

## 🔧 Configuration

### Environment Variables

Create `.env` files for environment-specific configuration:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_DEBUG_MODE=true
```

### TypeScript Configuration

- **Strict Mode**: Enabled for type safety
- **Path Mapping**: Absolute imports from `src/`
- **Declaration Files**: Custom type definitions in `types/`

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: 360px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Route Protection**: Private route guards
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token validation

## 📈 Performance

- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Service worker for offline functionality
- **Memoization**: React.memo for expensive components

## 🚀 Deployment

```bash
# Build for production
npm run build

# Serve locally for testing
npx serve -s build
```

The build process creates an optimized production bundle in the `build/` directory.
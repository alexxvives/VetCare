import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { testConnection as testCacheConnection } from './config/cache.js';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://app.vetcare.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database and cache connections
const initializeConnections = async () => {
  try {
    const dbConnected = await testConnection();
    const cacheConnected = await testCacheConnection();
    
    if (!dbConnected) {
      console.log('⚠️ SQLite database connection failed - some features may not work');
      console.log('💡 Check database file permissions and path');
    }
    
    if (!cacheConnected) {
      console.log('⚠️ Cache initialization failed - caching disabled');
      console.log('💡 In-memory cache should initialize automatically');
    }
    
    return { database: dbConnected, cache: cacheConnected };
  } catch (error) {
    console.error('❌ Connection initialization error:', error.message);
    return { database: false, cache: false };
  }
};

// Health check endpoint
app.get('/health', async (req, res) => {
  const connections = await initializeConnections();
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    connections: {
      database: connections.database ? 'connected' : 'disconnected',
      cache: connections.cache ? 'connected' : 'disconnected'
    }
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/protected', protectedRoutes);

// API routes will be added here
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'VetCare API v1.0.0',
    status: 'Active',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      appointments: '/api/v1/appointments',
      medical: '/api/v1/medical',
      clinics: '/api/v1/clinics'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 VetCare API server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  
  // Test connections on startup
  console.log('\n🔄 Testing connections...');
  await initializeConnections();
  console.log('✅ Server initialization complete\n');
});

export default app;
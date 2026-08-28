import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import useCasesRoutes from './routes/useCases.routes.js';
import contentBlocksRoutes from './routes/contentBlocks.routes.js';
import contentVariantsRoutes from './routes/contentVariants.routes.js';
import quizConfigRoutes from './routes/quizConfig.routes.js';
import publicRoutes from './routes/public.routes.js';
import insightsRoutes from './routes/insights.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers with resource sharing for public embed script
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
  })
);

// CORS configuration: Allow frontend origin for dashboard and open CORS for public endpoints
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, embed script) or match
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (such as embed.js)
app.use(express.static(path.join(__dirname, '../public')));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'AdaptCX Backend API',
    status: 'online',
    health: '/api/health',
    embed_script: '/embed.js'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'AdaptCX Backend API', time: new Date().toISOString() });
});

// Mount Routes with /api and direct root alias
const mountRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/use-cases`, useCasesRoutes);
  app.use(`${prefix}/content-blocks`, contentBlocksRoutes);
  app.use(`${prefix}/content-variants`, contentVariantsRoutes);
  app.use(`${prefix}/quiz-config`, quizConfigRoutes);
  app.use(`${prefix}/public/:businessId`, publicRoutes);
  app.use(`${prefix}/insights`, insightsRoutes);
};

mountRoutes('/api');
mountRoutes('');

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

export default app;

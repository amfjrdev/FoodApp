import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { generalRateLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { NotFoundError } from './errors/AppError.js';
import apiRoutes from './routes/index.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Global Rate Limiting
app.use(generalRateLimiter);

// Direct root health endpoint for load balancers
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', apiRoutes);

// Catch 404 for unhandled routes
app.use((req, _res, next) => {
  next(new NotFoundError(`Endpoint not found: ${req.method} ${req.originalUrl}`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;

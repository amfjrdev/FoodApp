import { Router } from 'express';
import healthRoutes from './health.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// Root API v1 info
router.get('/', (req, res) => {
  return sendSuccess(res, {
    name: 'Food Delivery Platform API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  }, 'Food Delivery API v1 ready');
});

// Health check route
router.use('/health', healthRoutes);

export default router;

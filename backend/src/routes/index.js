import { Router } from 'express';
import healthRoutes from './health.routes.js';
import adminRoutes from './admin/index.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// Root API v1 info
router.get('/', (req, res) => {
  return sendSuccess(
    res,
    {
      name: 'Food Delivery Platform API',
      version: '1.0.0',
      documentation: '/api/v1/health',
      endpoints: {
        health: '/api/v1/health',
        adminAuth: '/api/v1/admin/auth',
      },
    },
    'Food Delivery API v1 ready'
  );
});

// Health check route
router.use('/health', healthRoutes);

// Admin routes (Protected by requireAdminAuth where applicable)
router.use('/admin', adminRoutes);

export default router;

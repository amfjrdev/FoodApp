import { Router } from 'express';
import healthRoutes from './health.routes.js';
import adminRoutes from './admin/index.js';
import publicCategoryRoutes from './public/category.routes.js';
import publicFoodRoutes from './public/food.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// Root API v1 metadata
router.get('/', (_req, res) => {
  return sendSuccess(
    res,
    {
      name: 'Food Delivery Platform API',
      version: '1.0.0',
      endpoints: {
        health: '/api/v1/health',
        publicCategories: '/api/v1/categories',
        publicFoods: '/api/v1/foods',
        adminAuth: '/api/v1/admin/auth',
        adminCategories: '/api/v1/admin/categories',
        adminFoods: '/api/v1/admin/foods',
      },
    },
    'Food Delivery API v1 ready'
  );
});

// System health routes
router.use('/health', healthRoutes);

// Public customer routes
router.use('/categories', publicCategoryRoutes);
router.use('/foods', publicFoodRoutes);

// Admin protected routes
router.use('/admin', adminRoutes);

export default router;

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import adminRoutes from './admin/index.js';
import publicCategoryRoutes from './public/category.routes.js';
import publicFoodRoutes from './public/food.routes.js';
import publicOrderRoutes from './public/order.routes.js';
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
        publicOrders: '/api/v1/orders',
        adminAuth: '/api/v1/admin/auth',
        adminCategories: '/api/v1/admin/categories',
        adminFoods: '/api/v1/admin/foods',
        adminOrders: '/api/v1/admin/orders',
        adminDashboard: '/api/v1/admin/dashboard/statistics',
      },
    },
    'Food Delivery API v1 ready'
  );
});

// System health routes
router.use('/health', healthRoutes);

// Public customer routes (No authentication required)
router.use('/categories', publicCategoryRoutes);
router.use('/foods', publicFoodRoutes);
router.use('/orders', publicOrderRoutes);

// Admin protected routes (Requires JWT authentication)
router.use('/admin', adminRoutes);

export default router;

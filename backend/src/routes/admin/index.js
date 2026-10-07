import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import foodRoutes from './food.routes.js';
import orderRoutes from './order.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

// Mount Admin submodules
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/foods', foodRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

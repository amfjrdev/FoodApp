import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import foodRoutes from './food.routes.js';

const router = Router();

// Mount Admin subroutes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/foods', foodRoutes);

export default router;

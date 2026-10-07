import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// Mount Admin Auth routes
router.use('/auth', authRoutes);

export default router;

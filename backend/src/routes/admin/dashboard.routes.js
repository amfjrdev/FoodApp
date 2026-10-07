import { Router } from 'express';
import { dashboardController } from '../../controllers/dashboard.controller.js';
import { requireAdminAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

// Guard all admin dashboard statistics
router.use(requireAdminAuth);

router.get('/statistics', dashboardController.getStatistics);

export default router;

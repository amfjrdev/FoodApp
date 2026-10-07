import { Router } from 'express';
import { authController } from '../../controllers/auth.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { loginSchema } from '../../validators/auth.validator.js';
import { authRateLimiter } from '../../middlewares/rateLimiter.js';
import { requireAdminAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public Admin Login endpoint (rate-limited)
router.post('/login', authRateLimiter, validateRequest(loginSchema), authController.login);

// Protected Admin Auth endpoints
router.post('/logout', requireAdminAuth, authController.logout);
router.get('/me', requireAdminAuth, authController.getMe);

export default router;

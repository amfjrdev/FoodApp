import { Router } from 'express';
import { orderController } from '../../controllers/order.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  orderQuerySchema,
  updateOrderStatusSchema,
} from '../../validators/order.validator.js';
import { requireAdminAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

// Guard all admin order operations
router.use(requireAdminAuth);

router.get('/', validateRequest(orderQuerySchema), orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', validateRequest(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;

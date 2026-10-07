import { Router } from 'express';
import { orderController } from '../../controllers/order.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { createOrderSchema } from '../../validators/order.validator.js';

const router = Router();

// Anonymous customer order placement
router.post('/', validateRequest(createOrderSchema), orderController.createOrder);

// Anonymous customer order tracking by public order number (e.g. FD-849201)
router.get('/:orderNumber', orderController.trackOrder);

export default router;

import { Router } from 'express';
import { foodController } from '../../controllers/food.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { foodQuerySchema } from '../../validators/food.validator.js';

const router = Router();

router.get('/', validateRequest(foodQuerySchema), foodController.getPublicFoods);
router.get('/:id', foodController.getFoodById);

export default router;

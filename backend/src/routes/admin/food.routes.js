import { Router } from 'express';
import { foodController } from '../../controllers/food.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createFoodSchema,
  updateFoodSchema,
  foodQuerySchema,
} from '../../validators/food.validator.js';
import { requireAdminAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

// Guard all admin food operations
router.use(requireAdminAuth);

router.get('/', validateRequest(foodQuerySchema), foodController.getAllFoods);
router.get('/:id', foodController.getFoodById);
router.post('/', validateRequest(createFoodSchema), foodController.createFood);
router.patch('/:id', validateRequest(updateFoodSchema), foodController.updateFood);
router.delete('/:id', foodController.deleteFood);

export default router;

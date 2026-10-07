import { Router } from 'express';
import { categoryController } from '../../controllers/category.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../validators/category.validator.js';
import { requireAdminAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

// Guard all admin category operations
router.use(requireAdminAuth);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', validateRequest(createCategorySchema), categoryController.createCategory);
router.patch('/:id', validateRequest(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;

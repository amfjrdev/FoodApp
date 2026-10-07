import { Router } from 'express';
import { categoryController } from '../../controllers/category.controller.js';

const router = Router();

router.get('/', categoryController.getActiveCategories);
router.get('/:id', categoryController.getCategoryById);

export default router;
